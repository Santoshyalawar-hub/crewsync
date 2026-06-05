package com.samayahr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_notifications",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"notification_id", "employee_id"}
        )
)
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "notification_id", nullable = false)
    private Long notificationId;

    /**
     * Stores the employee's email address — matches auth.getName() from JWT.
     * This is how notifications are linked back to a specific user.
     */
    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    // ── Read tracking ─────────────────────────────────────────────────────────
    @Column(name = "is_read")
    private boolean read;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    // ── Acknowledgement tracking ──────────────────────────────────────────────
    private boolean acknowledged;
    private LocalDateTime acknowledgedAt;

    // ── Dismiss tracking ──────────────────────────────────────────────────────
    private boolean dismissed;

    /**
     * Timestamp of when the employee dismissed this notification.
     * Useful for audit trails and analytics on notification engagement.
     */
    @Column(name = "dismissed_at")
    private LocalDateTime dismissedAt;

    // ── Lifecycle hook ────────────────────────────────────────────────────────
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    // ── Read ──────────────────────────────────────────────────────────────────
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }

    // ── Acknowledgement ───────────────────────────────────────────────────────
    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }

    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    // ── Dismiss ───────────────────────────────────────────────────────────────
    public boolean isDismissed() { return dismissed; }
    public void setDismissed(boolean dismissed) { this.dismissed = dismissed; }

    public LocalDateTime getDismissedAt() { return dismissedAt; }
    public void setDismissedAt(LocalDateTime dismissedAt) { this.dismissedAt = dismissedAt; }

    // ── Audit ─────────────────────────────────────────────────────────────────
    public LocalDateTime getCreatedAt() { return createdAt; }
}