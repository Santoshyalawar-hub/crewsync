package com.samayahr.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Identity ──────────────────────────────────────────────────────────────
    @Column(name = "legal_name")
    private String legalName;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "tenant_code", unique = true)
    private String tenantCode;

    @Column(name = "organization_type")
    private String organizationType;

    private String industry;

    // ── Admin ─────────────────────────────────────────────────────────────────
    private String admin;

    @Column(name = "admin_email", unique = true)
    private String adminEmail;

    @Column(name = "mobile_number")
    private String mobileNumber;

    private String role;

    // ── Contact ───────────────────────────────────────────────────────────────
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;

    @Column(name = "official_email")
    private String officialEmail;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String website;

    // ── Plan / Subscription ───────────────────────────────────────────────────
    private String plan;

    @Column(name = "employee_limit")
    private Integer employeeLimit;

    @Column(name = "storage_limit")
    private String storageLimit;

    @Column(name = "billing_cycle")
    private String billingCycle;

    @Column(name = "start_date")
    private LocalDate startDate;

    // ── Stats ─────────────────────────────────────────────────────────────────
    private Integer employees = 0;
    private String storage;

    // ── Status ────────────────────────────────────────────────────────────────
    private String status;

    // ── Logo / Branding ───────────────────────────────────────────────────────
    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "logo_public_id", length = 500)
    private String logoPublicId;

    // ── Timestamps ────────────────────────────────────────────────────────────
    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "updated_date")
    private LocalDate updatedDate;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLegalName() { return legalName; }
    public void setLegalName(String legalName) { this.legalName = legalName; }

    public String getDisplayName() {
        return (displayName != null && !displayName.trim().isEmpty()) ? displayName : legalName;
    }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public String getOrganizationType() { return organizationType; }
    public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getAdmin() { return admin; }
    public void setAdmin(String admin) { this.admin = admin; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getOfficialEmail() { return officialEmail; }
    public void setOfficialEmail(String officialEmail) { this.officialEmail = officialEmail; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public Integer getEmployeeLimit() { return employeeLimit; }
    public void setEmployeeLimit(Integer employeeLimit) { this.employeeLimit = employeeLimit; }

    public String getStorageLimit() { return storageLimit; }
    public void setStorageLimit(String storageLimit) { this.storageLimit = storageLimit; }

    public String getBillingCycle() { return billingCycle; }
    public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public Integer getEmployees() { return employees; }
    public void setEmployees(Integer employees) { this.employees = employees; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getLogoPublicId() { return logoPublicId; }
    public void setLogoPublicId(String logoPublicId) { this.logoPublicId = logoPublicId; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }

    public LocalDate getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDate updatedDate) { this.updatedDate = updatedDate; }
}