
package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Identity ──────────────────────────────────────────────────────────────
    @Column(name = "full_name")
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonIgnore  // Never expose hashed password in API responses
    private String password;


    @Column(name = "employee_id")
    private String employeeId;

    private String mobile;
    private String phone;
    private String position;
    private String dob;

    @Column(name = "joining_date")
    private String joiningDate;

    private String department;

    // ── Tenant isolation ──────────────────────────────────────────────────────
    @Column(name = "tenant_code")
    private String tenantCode;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_name")
    private String companyName;

    // ── Role & Status ─────────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "onboarding_step")
    private Integer onboardingStep = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "onboarding_status")
    private OnboardingStatus onboardingStatus = OnboardingStatus.NOT_STARTED;

    @Column(nullable = false)
    private Boolean approved = false;

    @Column(name = "is_admin")
    private Boolean isAdmin = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // ── Profile ───────────────────────────────────────────────────────────────
    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;

    @Column(name = "profile_photo_public_id", length = 500)
    private String profilePhotoPublicId;

    @Column(name = "admin_role")
    private String adminRole;

    // ── Timestamps ────────────────────────────────────────────────────────────
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by")
    private Long deletedBy;

    // ── Misc ──────────────────────────────────────────────────────────────────
    @Column(columnDefinition = "TEXT")
    private String profile;

    @Column(name = "offer_letter_url")
    private String offerLetterUrl;

    @Column(name = "offer_letter_uploaded")
    private Boolean offerLetterUploaded = false;

    @Column(name = "id_card_generated")
    private Boolean idCardGenerated = false;

    @Column(name = "terms_agreed")
    private Boolean termsAgreed = false;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "verification_token")
    @JsonIgnore  // Security token - never expose
    private String verificationToken;

    @Column(name = "reset_password_token")
    @JsonIgnore  // Security token - never expose
    private String resetPasswordToken;

    @Column(name = "reset_password_expire")
    @JsonIgnore
    private LocalDateTime resetPasswordExpire;

    @Column(name = "last_step_completed_at")
    private LocalDateTime lastStepCompletedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Relationships ─────────────────────────────────────────────────────────
    // FIX: @JsonIgnoreProperties prevents infinite recursion and Hibernate lazy proxy errors
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user"})
    private EmployeeSalaryDetail salaryDetail;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user"})
    private EmployeeBankDetail bankDetail;

    // ── Enums ─────────────────────────────────────────────────────────────────
    public enum Role {
        GLOBAL_ADMIN, SUPER_ADMIN, COMPANY_ADMIN, ADMIN, EMPLOYEE
    }

    public enum Status { ACTIVE, INACTIVE, PENDING }

    public enum OnboardingStatus { NOT_STARTED, IN_PROGRESS, COMPLETE }

    // ── Lifecycle hooks ───────────────────────────────────────────────────────
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (approved == null) approved = false;
        if (isAdmin == null) isAdmin = false;
        if (termsAgreed == null) termsAgreed = false;
        if (isVerified == null) isVerified = false;
        if (offerLetterUploaded == null) offerLetterUploaded = false;
        if (idCardGenerated == null) idCardGenerated = false;
        if (isActive == null) isActive = true;
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getJoiningDate() { return joiningDate; }
    public void setJoiningDate(String joiningDate) { this.joiningDate = joiningDate; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Integer getOnboardingStep() { return onboardingStep; }
    public void setOnboardingStep(Integer onboardingStep) { this.onboardingStep = onboardingStep; }

    public OnboardingStatus getOnboardingStatus() { return onboardingStatus; }
    public void setOnboardingStatus(OnboardingStatus onboardingStatus) { this.onboardingStatus = onboardingStatus; }

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getProfilePhotoPublicId() { return profilePhotoPublicId; }
    public void setProfilePhotoPublicId(String profilePhotoPublicId) { this.profilePhotoPublicId = profilePhotoPublicId; }

    public String getAdminRole() { return adminRole; }
    public void setAdminRole(String adminRole) { this.adminRole = adminRole; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    public Long getDeletedBy() { return deletedBy; }
    public void setDeletedBy(Long deletedBy) { this.deletedBy = deletedBy; }

    public String getProfile() { return profile; }
    public void setProfile(String profile) { this.profile = profile; }

    public String getOfferLetterUrl() { return offerLetterUrl; }
    public void setOfferLetterUrl(String offerLetterUrl) { this.offerLetterUrl = offerLetterUrl; }

    public Boolean getOfferLetterUploaded() { return offerLetterUploaded; }
    public void setOfferLetterUploaded(Boolean offerLetterUploaded) { this.offerLetterUploaded = offerLetterUploaded; }

    public Boolean getIdCardGenerated() { return idCardGenerated; }
    public void setIdCardGenerated(Boolean idCardGenerated) { this.idCardGenerated = idCardGenerated; }

    public Boolean getTermsAgreed() { return termsAgreed; }
    public void setTermsAgreed(Boolean termsAgreed) { this.termsAgreed = termsAgreed; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public String getResetPasswordToken() { return resetPasswordToken; }
    public void setResetPasswordToken(String resetPasswordToken) { this.resetPasswordToken = resetPasswordToken; }

    public LocalDateTime getResetPasswordExpire() { return resetPasswordExpire; }
    public void setResetPasswordExpire(LocalDateTime resetPasswordExpire) { this.resetPasswordExpire = resetPasswordExpire; }

    public LocalDateTime getLastStepCompletedAt() { return lastStepCompletedAt; }
    public void setLastStepCompletedAt(LocalDateTime lastStepCompletedAt) { this.lastStepCompletedAt = lastStepCompletedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public EmployeeSalaryDetail getSalaryDetail() { return salaryDetail; }
    public void setSalaryDetail(EmployeeSalaryDetail salaryDetail) { this.salaryDetail = salaryDetail; }

    public EmployeeBankDetail getBankDetail() { return bankDetail; }
    public void setBankDetail(EmployeeBankDetail bankDetail) { this.bankDetail = bankDetail; }
}