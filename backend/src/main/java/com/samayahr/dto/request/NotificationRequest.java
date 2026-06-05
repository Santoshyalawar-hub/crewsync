package com.samayahr.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.samayahr.entity.Notification;

public class NotificationRequest {

    private String title;
    private String message;
    private String priority;    // LOW, MEDIUM, HIGH
    private String status;      // DRAFT, PUBLISHED, SCHEDULED, ARCHIVED
    private boolean pinned;
    private boolean reqAck;
    private boolean sendEmail;
    private boolean sendPush;

    // ── Tenant isolation ──────────────────────────────────────────────────────
    // Set by AdminNotificationController from X-Tenant-Code header or JWT lookup.
    // Stored on Notification so employees can be filtered by tenantCode at query time.
    private String tenantCode;

    // ── Targeting ─────────────────────────────────────────────────────────────
    private String       targetType;         // ALL, DEPT, SPECIFIC
    private List<String> targetDepts;        // department names (when targetType = DEPT)
    private List<String> targetEmployeeIds;  // email / empId list (when targetType = SPECIFIC)

    // ── Scheduling ────────────────────────────────────────────────────────────
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime scheduledAt;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime expiresAt;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getTitle()                       { return title; }
    public void   setTitle(String title)           { this.title = title; }

    public String getMessage()                     { return message; }
    public void   setMessage(String message)       { this.message = message; }

    public String getPriority()                    { return priority; }
    public void   setPriority(String priority)     { this.priority = priority; }

    public String getStatus()                      { return status; }
    public void   setStatus(String status)         { this.status = status; }

    public boolean isPinned()                      { return pinned; }
    public void    setPinned(boolean pinned)       { this.pinned = pinned; }

    public boolean isReqAck()                      { return reqAck; }
    public void    setReqAck(boolean reqAck)       { this.reqAck = reqAck; }

    public boolean isSendEmail()                   { return sendEmail; }
    public void    setSendEmail(boolean sendEmail) { this.sendEmail = sendEmail; }

    public boolean isSendPush()                    { return sendPush; }
    public void    setSendPush(boolean sendPush)   { this.sendPush = sendPush; }

    public String getTenantCode()                        { return tenantCode; }
    public void   setTenantCode(String tenantCode)       { this.tenantCode = tenantCode; }

    public String       getTargetType()                              { return targetType; }
    public void         setTargetType(String targetType)             { this.targetType = targetType; }

    public List<String> getTargetDepts()                             { return targetDepts; }
    public void         setTargetDepts(List<String> targetDepts)     { this.targetDepts = targetDepts; }

    public List<String> getTargetEmployeeIds()                                   { return targetEmployeeIds; }
    public void         setTargetEmployeeIds(List<String> targetEmployeeIds)     { this.targetEmployeeIds = targetEmployeeIds; }

    public LocalDateTime getScheduledAt()                        { return scheduledAt; }
    public void          setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public LocalDateTime getExpiresAt()                          { return expiresAt; }
    public void          setExpiresAt(LocalDateTime expiresAt)   { this.expiresAt = expiresAt; }

    // ── DTO → Entity mapper ───────────────────────────────────────────────────

    public Notification toEntity() {
        Notification n = new Notification();

        n.setTitle(this.title);
        n.setMessage(this.message);

        // Safe enum parsing with fallback defaults
        n.setPriority(parseEnum(Notification.Priority.class, this.priority,
                Notification.Priority.LOW));

        n.setStatus(parseEnum(Notification.Status.class, this.status,
                Notification.Status.PUBLISHED));

        n.setTargetType(parseEnum(Notification.TargetType.class, this.targetType,
                Notification.TargetType.ALL));

        n.setPinned(this.pinned);
        n.setReqAck(this.reqAck);
        n.setSendEmail(this.sendEmail);
        n.setSendPush(this.sendPush);

        n.setTargetDepts(this.targetDepts);
        n.setTargetEmployeeIds(this.targetEmployeeIds);

        n.setScheduledAt(this.scheduledAt != null
                ? this.scheduledAt
                : java.time.LocalDateTime.now());

        n.setExpiresAt(this.expiresAt);

        // ── Tenant code stored on notification for query-time filtering ────────
        if (this.tenantCode != null && !this.tenantCode.isBlank()) {
            n.setTenantCode(this.tenantCode);
        }

        return n;
    }

    // ── Private helper — safe enum parse with fallback ────────────────────────
    private <E extends Enum<E>> E parseEnum(Class<E> enumClass, String value, E fallback) {
        if (value == null || value.isBlank()) return fallback;
        try {
            return Enum.valueOf(enumClass, value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            System.err.println("NotificationRequest: unknown " + enumClass.getSimpleName()
                    + " value '" + value + "', using default: " + fallback);
            return fallback;
        }
    }
}