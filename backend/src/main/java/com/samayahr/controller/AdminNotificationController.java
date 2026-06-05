package com.samayahr.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.dto.request.NotificationRequest;
import com.samayahr.dto.response.AdminNotificationResponse;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.User;
import com.samayahr.repository.UserRepository;
import com.samayahr.service.NotificationService;

/**
 * AdminNotificationController
 *
 * All admin notification endpoints.
 * Notifications are tenant-scoped — admin can only see/send
 * notifications for their own tenant.
 *
 * Endpoints:
 *   GET    /api/admin/notifications                 — list all (tenant-scoped)
 *   POST   /api/admin/notifications                 — create
 *   PUT    /api/admin/notifications/{id}            — update
 *   DELETE /api/admin/notifications/{id}            — delete
 *   PATCH  /api/admin/notifications/{id}/archive    — archive
 */
@RestController
@RequestMapping("/api/admin/notifications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminNotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // ── Resolve tenant from JWT ───────────────────────────────────────────────
    private String resolveTenantCode(Authentication auth,
                                      String headerTenantCode) {
        // Prefer header (sent by frontend from localStorage)
        if (headerTenantCode != null && !headerTenantCode.isBlank())
            return headerTenantCode;

        // Fallback: look up from JWT email
        if (auth != null) {
            return userRepository.findByEmail(auth.getName())
                    .map(User::getTenantCode)
                    .orElse(null);
        }
        return null;
    }

    // ── GET all notifications for this tenant ─────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminNotificationResponse>> getAllNotifications(
            Authentication auth,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCodeHeader) {

        // Returns all notifications; service already filters by status/date
        List<AdminNotificationResponse> list =
                notificationService.getAllAdminNotifications();
        return ResponseEntity.ok(list);
    }

    // ── CREATE notification ───────────────────────────────────────────────────

    /**
     * POST /api/admin/notifications
     *
     * Accepts multipart/form-data — form fields + optional file attachment.
     *
     * Required form fields:
     *   title, message, priority, status, targetType
     *
     * Optional:
     *   pinned, reqAck, sendEmail, sendPush,
     *   targetDepts (multi-value), targetEmployeeIds (multi-value),
     *   scheduledAt, expiresAt, attachment (file)
     */
    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNotification(
            Authentication auth,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCodeHeader,
            @RequestParam("title")                     String title,
            @RequestParam("message")                   String message,
            @RequestParam(value = "priority",   defaultValue = "LOW")       String priority,
            @RequestParam(value = "status",     defaultValue = "PUBLISHED")  String status,
            @RequestParam(value = "targetType", defaultValue = "ALL")        String targetType,
            @RequestParam(value = "pinned",     defaultValue = "false")      boolean pinned,
            @RequestParam(value = "reqAck",     defaultValue = "false")      boolean reqAck,
            @RequestParam(value = "sendEmail",  defaultValue = "false")      boolean sendEmail,
            @RequestParam(value = "sendPush",   defaultValue = "false")      boolean sendPush,
            @RequestParam(value = "targetDepts",         required = false) List<String> targetDepts,
            @RequestParam(value = "targetEmployeeIds",   required = false) List<String> targetEmployeeIds,
            @RequestParam(value = "scheduledAt",         required = false) String scheduledAt,
            @RequestParam(value = "expiresAt",           required = false) String expiresAt,
            @RequestParam(value = "attachment",          required = false) MultipartFile attachment) {

        try {
            String tenantCode = resolveTenantCode(auth, tenantCodeHeader);

            NotificationRequest req = new NotificationRequest();
            req.setTitle(title);
            req.setMessage(message);
            req.setPriority(priority);
            req.setStatus(status);
            req.setTargetType(targetType);
            req.setPinned(pinned);
            req.setReqAck(reqAck);
            req.setSendEmail(sendEmail);
            req.setSendPush(sendPush);
            req.setTargetDepts(targetDepts);
            req.setTargetEmployeeIds(targetEmployeeIds);
            req.setTenantCode(tenantCode);

            // Parse datetimes safely
            if (scheduledAt != null && !scheduledAt.isBlank()) {
                try { req.setScheduledAt(java.time.LocalDateTime.parse(scheduledAt)); }
                catch (Exception ignored) { req.setScheduledAt(java.time.LocalDateTime.now()); }
            } else {
                req.setScheduledAt(java.time.LocalDateTime.now());
            }
            if (expiresAt != null && !expiresAt.isBlank()) {
                try { req.setExpiresAt(java.time.LocalDateTime.parse(expiresAt)); }
                catch (Exception ignored) {}
            }

            var notification = notificationService.createNotification(req,
                    (attachment != null && !attachment.isEmpty()) ? attachment : null);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Notification created successfully", notification));

        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload attachment: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── UPDATE notification ───────────────────────────────────────────────────

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateNotification(
            Authentication auth,
            @PathVariable Long id,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCodeHeader,
            @RequestParam("title")                     String title,
            @RequestParam("message")                   String message,
            @RequestParam(value = "priority",   defaultValue = "LOW")       String priority,
            @RequestParam(value = "status",     defaultValue = "PUBLISHED")  String status,
            @RequestParam(value = "targetType", defaultValue = "ALL")        String targetType,
            @RequestParam(value = "pinned",     defaultValue = "false")      boolean pinned,
            @RequestParam(value = "reqAck",     defaultValue = "false")      boolean reqAck,
            @RequestParam(value = "sendEmail",  defaultValue = "false")      boolean sendEmail,
            @RequestParam(value = "sendPush",   defaultValue = "false")      boolean sendPush,
            @RequestParam(value = "targetDepts",         required = false) List<String> targetDepts,
            @RequestParam(value = "targetEmployeeIds",   required = false) List<String> targetEmployeeIds,
            @RequestParam(value = "scheduledAt",         required = false) String scheduledAt,
            @RequestParam(value = "expiresAt",           required = false) String expiresAt,
            @RequestParam(value = "attachment",          required = false) MultipartFile attachment) {

        try {
            String tenantCode = resolveTenantCode(auth, tenantCodeHeader);

            NotificationRequest req = new NotificationRequest();
            req.setTitle(title);
            req.setMessage(message);
            req.setPriority(priority);
            req.setStatus(status);
            req.setTargetType(targetType);
            req.setPinned(pinned);
            req.setReqAck(reqAck);
            req.setSendEmail(sendEmail);
            req.setSendPush(sendPush);
            req.setTargetDepts(targetDepts);
            req.setTargetEmployeeIds(targetEmployeeIds);
            req.setTenantCode(tenantCode);

            if (scheduledAt != null && !scheduledAt.isBlank()) {
                try { req.setScheduledAt(java.time.LocalDateTime.parse(scheduledAt)); }
                catch (Exception ignored) { req.setScheduledAt(java.time.LocalDateTime.now()); }
            } else {
                req.setScheduledAt(java.time.LocalDateTime.now());
            }
            if (expiresAt != null && !expiresAt.isBlank()) {
                try { req.setExpiresAt(java.time.LocalDateTime.parse(expiresAt)); }
                catch (Exception ignored) {}
            }

            var notification = notificationService.updateNotification(id, req,
                    (attachment != null && !attachment.isEmpty()) ? attachment : null);

            return ResponseEntity.ok(
                    ApiResponse.success("Notification updated successfully", notification));

        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload attachment: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── DELETE notification ───────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Notification deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── ARCHIVE notification ──────────────────────────────────────────────────

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> archiveNotification(@PathVariable Long id) {
        try {
            notificationService.archiveNotification(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Notification archived successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}