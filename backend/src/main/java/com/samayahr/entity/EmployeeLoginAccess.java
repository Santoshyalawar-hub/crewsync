package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Tracks login access permission, credential email status,
 * and monthly password change count for each employee.
 *
 * One-to-one with User (employee only).
 */
@Entity
@Table(name = "employee_login_access")
public class EmployeeLoginAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Link to User ──────────────────────────────────────────────────────────
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "tenant_code", nullable = false)
    private String tenantCode;

    // ── Login Access Permission ───────────────────────────────────────────────
    /**
     * ELIGIBLE   → admin has granted login access; email can be sent
     * NOT_ELIGIBLE → no login access; send-email button hidden
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "login_access_permission", nullable = false)
    private LoginAccessPermission loginAccessPermission = LoginAccessPermission.NOT_ELIGIBLE;

    // ── Credential Email State ────────────────────────────────────────────────
    /**
     * Whether the credentials email has been sent.
     * Once true it must never be reset to false — email is sent only once.
     */
    @Column(name = "credentials_email_sent", nullable = false)
    private Boolean credentialsEmailSent = false;

    @Column(name = "credentials_email_sent_at")
    private LocalDateTime credentialsEmailSentAt;

    /**
     * The temporary password that was emailed.
     * Stored so we can include it in the email body.
     * Cleared (set to null) after the employee changes their password for the first time.
     */
    @Column(name = "temp_password")
    private String tempPassword;

    // ── Password Change Tracking ──────────────────────────────────────────────
    /**
     * How many times the employee changed their password in the current calendar month.
     * Max 2 per month. Automatically reset to 0 at the start of a new month.
     */
    @Column(name = "password_changes_this_month", nullable = false)
    private Integer passwordChangesThisMonth = 0;

    /**
     * Year-month of the last password change count reset (format: YYYY-MM).
     * Used to detect when a new month starts and the counter must be reset.
     */
    @Column(name = "password_change_month")
    private String passwordChangeMonth;   // e.g. "2025-11"

    @Column(name = "last_password_changed_at")
    private LocalDateTime lastPasswordChangedAt;

    // ── Timestamps ────────────────────────────────────────────────────────────
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Enum ──────────────────────────────────────────────────────────────────
    public enum LoginAccessPermission {
        ELIGIBLE, NOT_ELIGIBLE
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public LoginAccessPermission getLoginAccessPermission() { return loginAccessPermission; }
    public void setLoginAccessPermission(LoginAccessPermission loginAccessPermission) {
        this.loginAccessPermission = loginAccessPermission;
    }

    public Boolean getCredentialsEmailSent() { return credentialsEmailSent; }
    public void setCredentialsEmailSent(Boolean credentialsEmailSent) {
        this.credentialsEmailSent = credentialsEmailSent;
    }

    public LocalDateTime getCredentialsEmailSentAt() { return credentialsEmailSentAt; }
    public void setCredentialsEmailSentAt(LocalDateTime credentialsEmailSentAt) {
        this.credentialsEmailSentAt = credentialsEmailSentAt;
    }

    public String getTempPassword() { return tempPassword; }
    public void setTempPassword(String tempPassword) { this.tempPassword = tempPassword; }

    public Integer getPasswordChangesThisMonth() { return passwordChangesThisMonth; }
    public void setPasswordChangesThisMonth(Integer passwordChangesThisMonth) {
        this.passwordChangesThisMonth = passwordChangesThisMonth;
    }

    public String getPasswordChangeMonth() { return passwordChangeMonth; }
    public void setPasswordChangeMonth(String passwordChangeMonth) {
        this.passwordChangeMonth = passwordChangeMonth;
    }

    public LocalDateTime getLastPasswordChangedAt() { return lastPasswordChangedAt; }
    public void setLastPasswordChangedAt(LocalDateTime lastPasswordChangedAt) {
        this.lastPasswordChangedAt = lastPasswordChangedAt;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}