package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "tenant_code", nullable = false)
    private String tenantCode;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_by_name")
    private String createdByName;

    @Column(name = "policy_type")
    private String policyType = "COMPANY_POLICY";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId()                  { return id; }
    public void setId(Long id)           { this.id = id; }

    public String getTitle()             { return title; }
    public void setTitle(String t)       { this.title = t; }

    public String getDescription()       { return description; }
    public void setDescription(String d) { this.description = d; }

    public String getTenantCode()              { return tenantCode; }
    public void setTenantCode(String tc)       { this.tenantCode = tc; }

    public Long getCompanyId()                 { return companyId; }
    public void setCompanyId(Long cid)         { this.companyId = cid; }

    public String getFileUrl()                 { return fileUrl; }
    public void setFileUrl(String fu)          { this.fileUrl = fu; }

    public String getFileName()                { return fileName; }
    public void setFileName(String fn)         { this.fileName = fn; }

    public String getFileType()                { return fileType; }
    public void setFileType(String ft)         { this.fileType = ft; }

    public Long getCreatedBy()                 { return createdBy; }
    public void setCreatedBy(Long cb)          { this.createdBy = cb; }

    public String getCreatedByName()           { return createdByName; }
    public void setCreatedByName(String n)     { this.createdByName = n; }

    public String getPolicyType()              { return policyType; }
    public void setPolicyType(String pt)       { this.policyType = pt; }

    public Boolean getIsActive()               { return isActive; }
    public void setIsActive(Boolean a)         { this.isActive = a; }

    public LocalDateTime getCreatedAt()        { return createdAt; }
    public LocalDateTime getUpdatedAt()        { return updatedAt; }
}
