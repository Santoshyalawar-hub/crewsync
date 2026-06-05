package com.samayahr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * HR documents uploaded by Admin/SuperAdmin for a specific employee.
 */
@Entity
@Table(name = "hr_documents",
    indexes = {
        @Index(name = "idx_hr_doc_employee", columnList = "employee_id"),
        @Index(name = "idx_hr_doc_tenant",   columnList = "tenant_code"),
        @Index(name = "idx_hr_doc_status",   columnList = "status"),
    })
public class HrDocument {

    public enum HrDocType {
        OFFER_LETTER, JOINING_LETTER, SALARY_REVISION_LETTER,
        APPOINTMENT_LETTER, CONFIRMATION_LETTER, WARNING_LETTER,
        RELIEVING_LETTER, EXPERIENCE_CERTIFICATE, NON_DISCLOSURE_AGREEMENT,
        EMPLOYMENT_CONTRACT, POLICY_DOCUMENT, ONBOARDING_CHECKLIST, OTHER
    }

    public enum HrDocStatus {
        PENDING_SIGNATURE, SIGNED, ACKNOWLEDGED, REJECTED, EXPIRED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_code", nullable = false, length = 100)
    private String tenantCode;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "uploaded_by_admin_id", nullable = false)
    private Long uploadedByAdminId;

    @Enumerated(EnumType.STRING)
    @Column(name = "doc_type", nullable = false, length = 60)
    private HrDocType docType;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "original_file_url", nullable = false, length = 1000)
    private String originalFileUrl;

    @Column(name = "original_file_public_id", length = 500)
    private String originalFilePublicId;

    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    @Column(name = "original_file_size")
    private Long originalFileSize;

    @Column(name = "signed_file_url", length = 1000)
    private String signedFileUrl;

    @Column(name = "signed_file_public_id", length = 500)
    private String signedFilePublicId;

    @Column(name = "signed_file_name", length = 255)
    private String signedFileName;

    @Column(name = "signed_file_size")
    private Long signedFileSize;

    // ✅ FIXED: Changed TEXT → MEDIUMTEXT
    // TEXT column in MySQL holds max 65,535 bytes.
    // A canvas signature as base64 PNG is typically 80,000–200,000 bytes.
    // This caused: "Data too long for column 'signature_data'" → 500 error.
    // MEDIUMTEXT holds up to 16,777,215 bytes (16 MB) — more than enough.
    @Column(name = "signature_data", columnDefinition = "MEDIUMTEXT")
    private String signatureData;

    @Column(name = "signer_name", length = 255)
    private String signerName;

    @Column(name = "signing_ip", length = 100)
    private String signingIp;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private HrDocStatus status = HrDocStatus.PENDING_SIGNATURE;

    @Column(name = "requires_signature")
    private Boolean requiresSignature = true;

    @Column(name = "sign_by_date")
    private LocalDateTime signByDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getUploadedByAdminId() { return uploadedByAdminId; }
    public void setUploadedByAdminId(Long uploadedByAdminId) { this.uploadedByAdminId = uploadedByAdminId; }

    public HrDocType getDocType() { return docType; }
    public void setDocType(HrDocType docType) { this.docType = docType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getOriginalFileUrl() { return originalFileUrl; }
    public void setOriginalFileUrl(String originalFileUrl) { this.originalFileUrl = originalFileUrl; }

    public String getOriginalFilePublicId() { return originalFilePublicId; }
    public void setOriginalFilePublicId(String originalFilePublicId) { this.originalFilePublicId = originalFilePublicId; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public Long getOriginalFileSize() { return originalFileSize; }
    public void setOriginalFileSize(Long originalFileSize) { this.originalFileSize = originalFileSize; }

    public String getSignedFileUrl() { return signedFileUrl; }
    public void setSignedFileUrl(String signedFileUrl) { this.signedFileUrl = signedFileUrl; }

    public String getSignedFilePublicId() { return signedFilePublicId; }
    public void setSignedFilePublicId(String signedFilePublicId) { this.signedFilePublicId = signedFilePublicId; }

    public String getSignedFileName() { return signedFileName; }
    public void setSignedFileName(String signedFileName) { this.signedFileName = signedFileName; }

    public Long getSignedFileSize() { return signedFileSize; }
    public void setSignedFileSize(Long signedFileSize) { this.signedFileSize = signedFileSize; }

    public String getSignatureData() { return signatureData; }
    public void setSignatureData(String signatureData) { this.signatureData = signatureData; }

    public String getSignerName() { return signerName; }
    public void setSignerName(String signerName) { this.signerName = signerName; }

    public String getSigningIp() { return signingIp; }
    public void setSigningIp(String signingIp) { this.signingIp = signingIp; }

    public HrDocStatus getStatus() { return status; }
    public void setStatus(HrDocStatus status) { this.status = status; }

    public Boolean getRequiresSignature() { return requiresSignature; }
    public void setRequiresSignature(Boolean requiresSignature) { this.requiresSignature = requiresSignature; }

    public LocalDateTime getSignByDate() { return signByDate; }
    public void setSignByDate(LocalDateTime signByDate) { this.signByDate = signByDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}