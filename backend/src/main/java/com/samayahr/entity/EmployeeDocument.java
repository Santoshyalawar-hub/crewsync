//package com.hireconnect.entity;
//
//import jakarta.persistence.*;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.time.LocalDateTime;
//
///**
// * Generic document store per employee, backed by Cloudinary.
// * Relationship: One User -> Many EmployeeDocuments (one-to-many).
// */
//@Entity
//@Table(name = "employee_documents")
//public class Employeedocument {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    // ── Tenant isolation ──────────────────────────────────────────────────────
//    @Column(name = "tenant_code", nullable = false)
//    private String tenantCode;
//
//    @Column(name = "company_id")
//    private Long companyId;
//
//    // ── Owner ─────────────────────────────────────────────────────────────────
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//
//    // ── Document Info ─────────────────────────────────────────────────────────
//    @Enumerated(EnumType.STRING)
//    @Column(name = "document_type", nullable = false)
//    private DocumentType documentType;
//
//    @Column(name = "document_name")
//    private String documentName;          // user-visible label
//
//    /** Cloudinary secure URL */
//    @Column(name = "file_url", length = 1000, nullable = false)
//    private String fileUrl;
//
//    /** Cloudinary public_id used for deletion */
//    @Column(name = "cloudinary_public_id", length = 500)
//    private String cloudinaryPublicId;
//
//    @Column(name = "file_format", length = 20)
//    private String fileFormat;            // "pdf", "jpg", "png" …
//
//    @Column(name = "file_size_bytes")
//    private Long fileSizeBytes;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "status")
//    private DocumentStatus status = DocumentStatus.UPLOADED;
//
//    @Column(name = "remarks", length = 500)
//    private String remarks;
//
//    // ── Metadata ─────────────────────────────────────────────────────────────
//    @CreationTimestamp
//    @Column(name = "created_at", nullable = false, updatable = false)
//    private LocalDateTime createdAt;
//
//    @UpdateTimestamp
//    @Column(name = "updated_at")
//    private LocalDateTime updatedAt;
//
//    // ── Enums ─────────────────────────────────────────────────────────────────
//    public enum DocumentType {
//        OFFER_LETTER, ID_PROOF, ADDRESS_PROOF, PAN_CARD, AADHAR_CARD,
//        PASSPORT, CANCELLED_CHEQUE, BANK_PASSBOOK, BANK_STATEMENT,
//        EDUCATIONAL_CERTIFICATE, EXPERIENCE_LETTER, SALARY_SLIP,
//        APPOINTMENT_LETTER, NDA, OTHER
//    }
//
//    public enum DocumentStatus { UPLOADED, VERIFIED, REJECTED }
//
//    // ── Getters & Setters ─────────────────────────────────────────────────────
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public String getTenantCode() { return tenantCode; }
//    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }
//
//    public Long getCompanyId() { return companyId; }
//    public void setCompanyId(Long companyId) { this.companyId = companyId; }
//
//    public User getUser() { return user; }
//    public void setUser(User user) { this.user = user; }
//
//    public DocumentType getDocumentType() { return documentType; }
//    public void setDocumentType(DocumentType documentType) { this.documentType = documentType; }
//
//    public String getDocumentName() { return documentName; }
//    public void setDocumentName(String documentName) { this.documentName = documentName; }
//
//    public String getFileUrl() { return fileUrl; }
//    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
//
//    public String getCloudinaryPublicId() { return cloudinaryPublicId; }
//    public void setCloudinaryPublicId(String cloudinaryPublicId) { this.cloudinaryPublicId = cloudinaryPublicId; }
//
//    public String getFileFormat() { return fileFormat; }
//    public void setFileFormat(String fileFormat) { this.fileFormat = fileFormat; }
//
//    public Long getFileSizeBytes() { return fileSizeBytes; }
//    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }
//
//    public DocumentStatus getStatus() { return status; }
//    public void setStatus(DocumentStatus status) { this.status = status; }
//
//    public String getRemarks() { return remarks; }
//    public void setRemarks(String remarks) { this.remarks = remarks; }
//
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public LocalDateTime getUpdatedAt() { return updatedAt; }
//}

package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Generic document store per employee, backed by Cloudinary.
 * Relationship: One User -> Many EmployeeDocuments (one-to-many).
 */
@Entity
@Table(name = "employee_documents")
public class EmployeeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Tenant isolation ──────────────────────────────────────────────────────
    @Column(name = "tenant_code", nullable = false)
    private String tenantCode;

    @Column(name = "company_id")
    private Long companyId;

    // ── Owner ─────────────────────────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ── Document Info ─────────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;

    @Column(name = "document_name")
    private String documentName;          // user-visible label

    /** Cloudinary secure URL */
    @Column(name = "file_url", length = 1000, nullable = false)
    private String fileUrl;

    /** Cloudinary public_id used for deletion */
    @Column(name = "cloudinary_public_id", length = 500)
    private String cloudinaryPublicId;

    @Column(name = "file_format", length = 20)
    private String fileFormat;            // "pdf", "jpg", "png" …

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DocumentStatus status = DocumentStatus.UPLOADED;

    @Column(name = "remarks", length = 500)
    private String remarks;

    // ── Metadata ─────────────────────────────────────────────────────────────
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Enums ─────────────────────────────────────────────────────────────────
    public enum DocumentType {
        OFFER_LETTER, ID_PROOF, ADDRESS_PROOF, PAN_CARD, AADHAR_CARD,
        PASSPORT, CANCELLED_CHEQUE, BANK_PASSBOOK, BANK_STATEMENT,
        EDUCATIONAL_CERTIFICATE, EXPERIENCE_LETTER, SALARY_SLIP,
        APPOINTMENT_LETTER, NDA, OTHER
    }

    public enum DocumentStatus { UPLOADED, VERIFIED, REJECTED }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public DocumentType getDocumentType() { return documentType; }
    public void setDocumentType(DocumentType documentType) { this.documentType = documentType; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getCloudinaryPublicId() { return cloudinaryPublicId; }
    public void setCloudinaryPublicId(String cloudinaryPublicId) { this.cloudinaryPublicId = cloudinaryPublicId; }

    public String getFileFormat() { return fileFormat; }
    public void setFileFormat(String fileFormat) { this.fileFormat = fileFormat; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public DocumentStatus getStatus() { return status; }
    public void setStatus(DocumentStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}