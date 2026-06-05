package com.samayahr.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.dto.request.NotificationRequest;
import com.samayahr.dto.response.AdminNotificationResponse;
import com.samayahr.dto.response.EmployeeNotificationResponse;
import com.samayahr.entity.Notification;
import com.samayahr.entity.UserNotification;
import com.samayahr.repository.NotificationRepository;
import com.samayahr.repository.UserNotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserNotificationRepository userNotificationRepo;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Value("${app.base-url}")
    private String appBaseUrl;

    // ── Admin: Create ─────────────────────────────────────────────────────────

    @Transactional
    public Notification createNotification(NotificationRequest request,
                                            MultipartFile file) throws IOException {

        Notification notif = request.toEntity();

        // Persist tenant code so employees can be filtered at query time
        if (request.getTenantCode() != null && !request.getTenantCode().isBlank()) {
            notif.setTenantCode(request.getTenantCode());
        }

        if (file != null && !file.isEmpty()) {
            Map<String, Object> result = cloudinaryService.upload(
                    file, "global", "notification_attachments");
            notif.setAttachmentName(file.getOriginalFilename());
            notif.setAttachmentPath(cloudinaryService.getSecureUrl(result));
            notif.setAttachmentPublicId(cloudinaryService.getPublicId(result));
        }

        return notificationRepo.save(notif);
    }

    // ── Admin: Update ─────────────────────────────────────────────────────────

    @Transactional
    public Notification updateNotification(Long id, NotificationRequest request,
                                            MultipartFile file) throws IOException {

        Notification existing = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        existing.setTitle(request.getTitle());
        existing.setMessage(request.getMessage());

        // Safe enum parsing — won't throw 500 on unexpected values
        if (request.getPriority() != null) {
            existing.setPriority(parseEnum(Notification.Priority.class,
                    request.getPriority(), Notification.Priority.LOW));
        }
        if (request.getStatus() != null) {
            existing.setStatus(parseEnum(Notification.Status.class,
                    request.getStatus(), Notification.Status.PUBLISHED));
        }
        if (request.getTargetType() != null) {
            existing.setTargetType(parseEnum(Notification.TargetType.class,
                    request.getTargetType(), Notification.TargetType.ALL));
        }

        existing.setPinned(request.isPinned());
        existing.setReqAck(request.isReqAck());
        existing.setSendEmail(request.isSendEmail());
        existing.setSendPush(request.isSendPush());
        existing.setTargetDepts(request.getTargetDepts());
        existing.setTargetEmployeeIds(request.getTargetEmployeeIds());
        existing.setScheduledAt(request.getScheduledAt());
        existing.setExpiresAt(request.getExpiresAt());

        // Update tenantCode if provided
        if (request.getTenantCode() != null && !request.getTenantCode().isBlank()) {
            existing.setTenantCode(request.getTenantCode());
        }

        if (file != null && !file.isEmpty()) {
            // Delete old attachment from Cloudinary
            if (existing.getAttachmentPublicId() != null) {
                try {
                    cloudinaryService.delete(existing.getAttachmentPublicId());
                } catch (Exception ignored) {
                    System.err.println("Could not delete old notification attachment: "
                            + existing.getAttachmentPublicId());
                }
            }
            Map<String, Object> result = cloudinaryService.upload(
                    file, "global", "notification_attachments");
            existing.setAttachmentName(file.getOriginalFilename());
            existing.setAttachmentPath(cloudinaryService.getSecureUrl(result));
            existing.setAttachmentPublicId(cloudinaryService.getPublicId(result));
        }

        return notificationRepo.save(existing);
    }

    // ── Admin: Delete ─────────────────────────────────────────────────────────

    @Transactional
    public void deleteNotification(Long id) {
        notificationRepo.findById(id).ifPresent(n -> {
            if (n.getAttachmentPublicId() != null) {
                try {
                    cloudinaryService.delete(n.getAttachmentPublicId());
                } catch (Exception ignored) {
                    System.err.println("Could not delete notification attachment: "
                            + n.getAttachmentPublicId());
                }
            }
        });
        notificationRepo.deleteById(id);
    }

    // ── Admin: Archive ────────────────────────────────────────────────────────

    @Transactional
    public void archiveNotification(Long id) {
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setStatus(Notification.Status.ARCHIVED);
        notificationRepo.save(n);
    }

    // ── Admin: Get all — tenant-scoped ────────────────────────────────────────

    /**
     * Returns all notifications for a specific tenant, ordered by newest first.
     * Pinned notifications appear at the top.
     *
     * @param tenantCode the admin's tenant — only their notifications are returned
     */
    @Transactional(readOnly = true)
    public List<AdminNotificationResponse> getAllAdminNotifications(String tenantCode) {
        List<Notification> notifications = (tenantCode != null && !tenantCode.isBlank())
                ? notificationRepo.findByTenantCodeOrderByPinnedDescCreatedAtDesc(tenantCode)
                : notificationRepo.findAllByOrderByCreatedAtDesc();

        return notifications.stream()
                .map(this::toAdminResponse)
                .toList();
    }

    /**
     * Overload kept for backward compatibility — returns ALL notifications
     * regardless of tenant. Use the tenant-scoped version in production.
     */
    @Transactional(readOnly = true)
    public List<AdminNotificationResponse> getAllAdminNotifications() {
        return notificationRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toAdminResponse)
                .toList();
    }

    // ── Employee: Get notifications — tenant-scoped ───────────────────────────

    /**
     * Returns published, non-expired, non-dismissed notifications for an employee.
     *
     * @param empId      employee email (from JWT auth.getName())
     * @param dept       employee's department (or "ALL" if unknown)
     * @param tenantCode employee's tenant — only their company's notifications returned
     */
    @Transactional(readOnly = true)
    public List<EmployeeNotificationResponse> getNotificationsForEmployee(
            String empId, String dept, String tenantCode) {

        // Tenant-scoped query: returns only this company's published notifications
        List<Notification> notifications =
                notificationRepo.findRelevantNotifications(
                        empId, dept, LocalDateTime.now(), tenantCode);

        return notifications.stream()
                .map(n -> {
                    UserNotification interaction =
                            userNotificationRepo
                                    .findByNotificationIdAndEmployeeId(n.getId(), empId)
                                    .orElseGet(() -> createEmptyInteraction(n.getId(), empId));

                    // Skip dismissed notifications
                    if (interaction.isDismissed()) return null;

                    EmployeeNotificationResponse dto = new EmployeeNotificationResponse();
                    dto.setId(n.getId());
                    dto.setTitle(n.getTitle());
                    dto.setMessage(n.getMessage());
                    dto.setPriority(n.getPriority().name());
                    dto.setPinned(n.isPinned());
                    dto.setReqAck(n.isReqAck());
                    dto.setAttachmentName(n.getAttachmentName());
                    if (n.getAttachmentPath() != null) {
                        dto.setAttachmentUrl(n.getAttachmentPath()); // Cloudinary URL
                    }
                    dto.setCreatedAt(n.getCreatedAt());
                    dto.setExpiresAt(n.getExpiresAt());
                    dto.setRead(interaction.isRead());
                    dto.setAcknowledged(interaction.isAcknowledged());
                    return dto;
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Backward-compatible overload — passes empty tenantCode (shows all).
     * Prefer the 3-arg version in new code.
     */
    @Transactional(readOnly = true)
    public List<EmployeeNotificationResponse> getNotificationsForEmployee(
            String empId, String dept) {
        return getNotificationsForEmployee(empId, dept, "");
    }

    // ── Employee: Read ────────────────────────────────────────────────────────

    @Transactional
    public void markAsRead(Long notificationId, String empId) {
        UserNotification interaction = getOrCreateInteraction(notificationId, empId);
        if (!interaction.isRead()) {
            interaction.setRead(true);
            interaction.setReadAt(LocalDateTime.now());
            userNotificationRepo.save(interaction);
        }
    }

    @Transactional
    public void markAllRead(String empId) {
        // Use the 2-arg overload — marks all visible notifications as read
        List<Notification> notifications =
                notificationRepo.findRelevantNotifications(
                        empId, "ALL", LocalDateTime.now());

        for (Notification n : notifications) {
            UserNotification interaction = getOrCreateInteraction(n.getId(), empId);
            if (!interaction.isRead()) {
                interaction.setRead(true);
                interaction.setReadAt(LocalDateTime.now());
                userNotificationRepo.save(interaction);
            }
        }
    }

    // ── Employee: Acknowledge ─────────────────────────────────────────────────

    @Transactional
    public void acknowledge(Long notificationId, String empId) {
        UserNotification interaction = getOrCreateInteraction(notificationId, empId);
        interaction.setAcknowledged(true);
        interaction.setAcknowledgedAt(LocalDateTime.now());
        interaction.setRead(true);
        userNotificationRepo.save(interaction);
    }

    // ── Employee: Dismiss ─────────────────────────────────────────────────────

    @Transactional
    public void dismiss(Long notificationId, String empId) {
        UserNotification interaction = getOrCreateInteraction(notificationId, empId);
        interaction.setDismissed(true);
        interaction.setDismissedAt(LocalDateTime.now()); // ← records when dismissed
        userNotificationRepo.save(interaction);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private UserNotification getOrCreateInteraction(Long notifId, String empId) {
        return userNotificationRepo
                .findByNotificationIdAndEmployeeId(notifId, empId)
                .orElseGet(() -> createEmptyInteraction(notifId, empId));
    }

    private UserNotification createEmptyInteraction(Long notifId, String empId) {
        UserNotification un = new UserNotification();
        un.setNotificationId(notifId);
        un.setEmployeeId(empId);
        un.setRead(false);
        un.setAcknowledged(false);
        un.setDismissed(false);
        return un;
    }

    private AdminNotificationResponse toAdminResponse(Notification n) {
        AdminNotificationResponse dto = new AdminNotificationResponse();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setPriority(n.getPriority().name());
        dto.setStatus(n.getStatus().name());
        dto.setPinned(n.isPinned());
        dto.setReqAck(n.isReqAck());
        dto.setTargetDepts(
                n.getTargetDepts() == null ? List.of() : List.copyOf(n.getTargetDepts()));
        dto.setTargetEmployeeIds(
                n.getTargetEmployeeIds() == null ? List.of() : List.copyOf(n.getTargetEmployeeIds()));
        dto.setCreatedAt(n.getCreatedAt());
        dto.setScheduledAt(n.getScheduledAt());
        dto.setExpiresAt(n.getExpiresAt());
        dto.setAttachmentName(n.getAttachmentName());
        dto.setAttachmentUrl(n.getAttachmentPath()); // Cloudinary URL
        return dto;
    }

    /** Safe enum parse — returns fallback instead of throwing on bad values. */
    private <E extends Enum<E>> E parseEnum(Class<E> enumClass, String value, E fallback) {
        if (value == null || value.isBlank()) return fallback;
        try {
            return Enum.valueOf(enumClass, value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            System.err.println("NotificationService: unknown " + enumClass.getSimpleName()
                    + " value '" + value + "', using default: " + fallback);
            return fallback;
        }
    }
}