
package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Table(name = "employee_bank_details",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "tenant_code"})
        })
public class EmployeeBankDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Tenant isolation ──────────────────────────────────────────────────────
    @Column(name = "tenant_code", nullable = false)
    private String tenantCode;

    @Column(name = "company_id")
    private Long companyId;

    // ── Owner ─────────────────────────────────────────────────────────────────
    // FIX: @JsonIgnoreProperties breaks the circular User <-> BankDetail reference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"salaryDetail", "bankDetail", "password", "plainPassword",
            "verificationToken", "resetPasswordToken", "hibernateLazyInitializer", "handler"})
    private User user;

    // ── Bank Info ─────────────────────────────────────────────────────────────
    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "account_holder_name")
    private String accountHolderName;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "confirm_account_number")
    private String confirmAccountNumber;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "branch_address", length = 500)
    private String branchAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type")
    private AccountType accountType = AccountType.SAVINGS;

    // ── Additional IDs ────────────────────────────────────────────────────────
    @Column(name = "micr_code")
    private String micrCode;

    @Column(name = "swift_code")
    private String swiftCode;

    // ── Verification / Document ───────────────────────────────────────────────
    @Column(name = "proof_document_type")
    private String proofDocumentType;

    @Column(name = "proof_document_url", length = 1000)
    private String proofDocumentUrl;

    @Column(name = "proof_document_public_id", length = 500)
    private String proofDocumentPublicId;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    // ── Metadata ─────────────────────────────────────────────────────────────
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Enums ─────────────────────────────────────────────────────────────────
    public enum AccountType { SAVINGS, CURRENT, SALARY }
    public enum VerificationStatus { PENDING, VERIFIED, REJECTED }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getConfirmAccountNumber() { return confirmAccountNumber; }
    public void setConfirmAccountNumber(String confirmAccountNumber) { this.confirmAccountNumber = confirmAccountNumber; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getBranchAddress() { return branchAddress; }
    public void setBranchAddress(String branchAddress) { this.branchAddress = branchAddress; }

    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }

    public String getMicrCode() { return micrCode; }
    public void setMicrCode(String micrCode) { this.micrCode = micrCode; }

    public String getSwiftCode() { return swiftCode; }
    public void setSwiftCode(String swiftCode) { this.swiftCode = swiftCode; }

    public String getProofDocumentType() { return proofDocumentType; }
    public void setProofDocumentType(String proofDocumentType) { this.proofDocumentType = proofDocumentType; }

    public String getProofDocumentUrl() { return proofDocumentUrl; }
    public void setProofDocumentUrl(String proofDocumentUrl) { this.proofDocumentUrl = proofDocumentUrl; }

    public String getProofDocumentPublicId() { return proofDocumentPublicId; }
    public void setProofDocumentPublicId(String proofDocumentPublicId) { this.proofDocumentPublicId = proofDocumentPublicId; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public Long getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(Long verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}