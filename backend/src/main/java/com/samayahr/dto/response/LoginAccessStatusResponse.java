package com.samayahr.dto.response;

import com.samayahr.entity.EmployeeLoginAccess;

import java.time.LocalDateTime;

/**
 * Returned by GET /api/login-access/employee/{userId}
 * and embedded inside the Manage Employee list response.
 */
public class LoginAccessStatusResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String tenantCode;

    // Permission toggle value: ELIGIBLE | NOT_ELIGIBLE
    private EmployeeLoginAccess.LoginAccessPermission loginAccessPermission;

    // Email state
    private boolean credentialsEmailSent;
    private LocalDateTime credentialsEmailSentAt;

    // Password change tracking (for admin view)
    private int passwordChangesThisMonth;
    private int monthlyLimit;           // always 2
    private String passwordChangeMonth; // "2025-11"
    private LocalDateTime lastPasswordChangedAt;

    // ── Constructors ──────────────────────────────────────────────────────────
    public LoginAccessStatusResponse() {}

    public static LoginAccessStatusResponse from(EmployeeLoginAccess access,
                                                  String fullName,
                                                  String email) {
        LoginAccessStatusResponse r = new LoginAccessStatusResponse();
        r.userId                   = access.getUserId();
        r.fullName                 = fullName;
        r.email                    = email;
        r.tenantCode               = access.getTenantCode();
        r.loginAccessPermission    = access.getLoginAccessPermission();
        r.credentialsEmailSent     = Boolean.TRUE.equals(access.getCredentialsEmailSent());
        r.credentialsEmailSentAt   = access.getCredentialsEmailSentAt();
        r.passwordChangesThisMonth = access.getPasswordChangesThisMonth() == null
                ? 0 : access.getPasswordChangesThisMonth();
        r.monthlyLimit             = 2;
        r.passwordChangeMonth      = access.getPasswordChangeMonth();
        r.lastPasswordChangedAt    = access.getLastPasswordChangedAt();
        return r;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public EmployeeLoginAccess.LoginAccessPermission getLoginAccessPermission() {
        return loginAccessPermission;
    }
    public void setLoginAccessPermission(
            EmployeeLoginAccess.LoginAccessPermission loginAccessPermission) {
        this.loginAccessPermission = loginAccessPermission;
    }

    public boolean isCredentialsEmailSent() { return credentialsEmailSent; }
    public void setCredentialsEmailSent(boolean credentialsEmailSent) {
        this.credentialsEmailSent = credentialsEmailSent;
    }

    public LocalDateTime getCredentialsEmailSentAt() { return credentialsEmailSentAt; }
    public void setCredentialsEmailSentAt(LocalDateTime credentialsEmailSentAt) {
        this.credentialsEmailSentAt = credentialsEmailSentAt;
    }

    public int getPasswordChangesThisMonth() { return passwordChangesThisMonth; }
    public void setPasswordChangesThisMonth(int passwordChangesThisMonth) {
        this.passwordChangesThisMonth = passwordChangesThisMonth;
    }

    public int getMonthlyLimit() { return monthlyLimit; }
    public void setMonthlyLimit(int monthlyLimit) { this.monthlyLimit = monthlyLimit; }

    public String getPasswordChangeMonth() { return passwordChangeMonth; }
    public void setPasswordChangeMonth(String passwordChangeMonth) {
        this.passwordChangeMonth = passwordChangeMonth;
    }

    public LocalDateTime getLastPasswordChangedAt() { return lastPasswordChangedAt; }
    public void setLastPasswordChangedAt(LocalDateTime lastPasswordChangedAt) {
        this.lastPasswordChangedAt = lastPasswordChangedAt;
    }
}