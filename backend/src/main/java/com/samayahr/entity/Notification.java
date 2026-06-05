package com.samayahr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH

    @Enumerated(EnumType.STRING)
    private Status status; // DRAFT, PUBLISHED, SCHEDULED, ARCHIVED

    private boolean pinned;
    private boolean reqAck;    // Require Acknowledgement
    private boolean sendEmail;
    private boolean sendPush;

    // ── Tenant isolation ──────────────────────────────────────────────────────
    /**
     * Tenant code of the admin who created this notification.
     * Employees only see notifications whose tenantCode matches their own.
     * NULL means visible to all tenants (legacy data / global announcements).
     */
    @Column(name = "tenant_code")
    private String tenantCode;

    // ── Targeting ─────────────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    private TargetType targetType; // ALL, DEPT, SPECIFIC

    @ElementCollection
    @CollectionTable(
            name = "notification_target_depts",
            joinColumns = @JoinColumn(name = "notification_id")
    )
    @Column(name = "department")
    private List<String> targetDepts;

    @ElementCollection
    @CollectionTable(
            name = "notification_target_employees",
            joinColumns = @JoinColumn(name = "notification_id")
    )
    @Column(name = "employee_id")
    private List<String> targetEmployeeIds;

    // ── File Attachment ───────────────────────────────────────────────────────
    private String attachmentName;

    /**
     * Stores the Cloudinary https:// secure URL directly.
     * Used as-is by the frontend — no URL construction needed.
     */
    @Column(name = "attachment_path", length = 1000)
    private String attachmentPath;

    /**
     * Cloudinary public_id — stored so the file can be deleted
     * from Cloudinary when the notification is updated or deleted.
     * Never exposed to the frontend.
     */
    @Column(name = "attachment_public_id", length = 500)
    private String attachmentPublicId;

    // ── Scheduling ────────────────────────────────────────────────────────────
    private LocalDateTime scheduledAt;
    private LocalDateTime expiresAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    // ── Lifecycle Hooks ───────────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.scheduledAt == null) {
            this.scheduledAt = LocalDateTime.now();
        }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public boolean isPinned() { return pinned; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }

    public boolean isReqAck() { return reqAck; }
    public void setReqAck(boolean reqAck) { this.reqAck = reqAck; }

    public boolean isSendEmail() { return sendEmail; }
    public void setSendEmail(boolean sendEmail) { this.sendEmail = sendEmail; }

    public boolean isSendPush() { return sendPush; }
    public void setSendPush(boolean sendPush) { this.sendPush = sendPush; }

    // ── Tenant ────────────────────────────────────────────────────────────────
    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    // ── Targeting ─────────────────────────────────────────────────────────────
    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }

    public List<String> getTargetDepts() { return targetDepts; }
    public void setTargetDepts(List<String> targetDepts) { this.targetDepts = targetDepts; }

    public List<String> getTargetEmployeeIds() { return targetEmployeeIds; }
    public void setTargetEmployeeIds(List<String> targetEmployeeIds) {
        this.targetEmployeeIds = targetEmployeeIds;
    }

    // ── Attachment ────────────────────────────────────────────────────────────
    public String getAttachmentName() { return attachmentName; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }

    public String getAttachmentPath() { return attachmentPath; }
    public void setAttachmentPath(String attachmentPath) { this.attachmentPath = attachmentPath; }

    public String getAttachmentPublicId() { return attachmentPublicId; }
    public void setAttachmentPublicId(String attachmentPublicId) {
        this.attachmentPublicId = attachmentPublicId;
    }

    // ── Scheduling ────────────────────────────────────────────────────────────
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Enums ─────────────────────────────────────────────────────────────────

    public enum Priority   { LOW, MEDIUM, HIGH }
    public enum Status     { DRAFT, PUBLISHED, SCHEDULED, ARCHIVED }
    public enum TargetType { ALL, DEPT, SPECIFIC }
}