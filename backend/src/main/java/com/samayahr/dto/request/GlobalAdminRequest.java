package com.samayahr.dto.request;

public class GlobalAdminRequest {

    private String fullName;
    private String email;
    private String password;
    private String mobile;

    /**
     * Secret key to prevent unauthorised creation.
     * Set this value in application.properties as: global.admin.secret=YourSecretKey
     */
    private String secretKey;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getSecretKey() { return secretKey; }
    public void setSecretKey(String secretKey) { this.secretKey = secretKey; }
}