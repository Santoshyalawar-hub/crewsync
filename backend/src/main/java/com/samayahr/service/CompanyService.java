package com.samayahr.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.entity.Company;
import com.samayahr.repository.CompanyRepository;

@Service
@Transactional
public class CompanyService {

    @Autowired private CompanyRepository        repo;
    @Autowired private ActivityLogService       activityLogService;
    @Autowired private Salaryslipsettingsservice salarySlipSettingsService;
    @Autowired private CloudinaryService        cloudinaryService;

    // ── Create ────────────────────────────────────────────────────────────────

    public Company createCompany(Company company) {
        if (company.getDisplayName() != null
                && repo.existsByDisplayName(company.getDisplayName()))
            throw new RuntimeException("Company with display name '"
                    + company.getDisplayName() + "' already exists");

        if (company.getAdminEmail() != null
                && repo.existsByAdminEmail(company.getAdminEmail()))
            throw new RuntimeException("Admin email '"
                    + company.getAdminEmail() + "' already exists");

        if (company.getTenantCode() != null
                && repo.existsByTenantCode(company.getTenantCode()))
            throw new RuntimeException("Tenant code '"
                    + company.getTenantCode() + "' already exists");

        if (company.getCreatedDate() == null)  company.setCreatedDate(LocalDate.now());
        if (company.getUpdatedDate() == null)  company.setUpdatedDate(LocalDate.now());
        if (company.getEmployees() == null)    company.setEmployees(0);
        if (company.getStorage() == null)      company.setStorage("0 GB");
        if (company.getStatus() == null)       company.setStatus("active");
        if (company.getRole() == null)         company.setRole("COMPANY_ADMIN");
        if (company.getPlan() == null)         company.setPlan("Basic");
        if (company.getEmployeeLimit() == null) company.setEmployeeLimit(50);
        if (company.getStorageLimit() == null)  company.setStorageLimit("10 GB");
        if (company.getBillingCycle() == null)  company.setBillingCycle("monthly");

        Company saved = repo.save(company);

        try {
            salarySlipSettingsService.createDefaults(saved.getTenantCode());
        } catch (Exception e) {
            System.out.println("Could not create default salary slip settings: "
                    + e.getMessage());
        }

        safeLog("COMPANY_CREATED",
                "New company " + safe(saved.getDisplayName()) + " registered",
                "success", "Company", saved.getId(),
                saved.getTenantCode(), null, saved.getAdmin());

        return saved;
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Company> getAll() { return repo.findAll(); }

    public Company getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Company not found with ID: " + id));
    }

    public Company getByTenantCode(String tenantCode) {
        return repo.findByTenantCode(tenantCode)
                .orElseThrow(() -> new RuntimeException(
                        "Company not found for tenant: " + tenantCode));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    public Company update(Long id, Company data) {
        Company c = getById(id);

        if (data.getDisplayName() != null
                && !c.getDisplayName().equals(data.getDisplayName())
                && repo.existsByDisplayName(data.getDisplayName()))
            throw new RuntimeException("Company with display name '"
                    + data.getDisplayName() + "' already exists");

        if (data.getAdminEmail() != null
                && !c.getAdminEmail().equals(data.getAdminEmail())
                && repo.existsByAdminEmail(data.getAdminEmail()))
            throw new RuntimeException("Admin email '"
                    + data.getAdminEmail() + "' already exists");

        if (data.getTenantCode() != null
                && !c.getTenantCode().equals(data.getTenantCode())
                && repo.existsByTenantCode(data.getTenantCode()))
            throw new RuntimeException("Tenant code '"
                    + data.getTenantCode() + "' already exists");

        if (data.getLegalName() != null)        c.setLegalName(data.getLegalName());
        if (data.getDisplayName() != null)      c.setDisplayName(data.getDisplayName());
        if (data.getTenantCode() != null)       c.setTenantCode(data.getTenantCode());
        if (data.getOrganizationType() != null) c.setOrganizationType(data.getOrganizationType());
        if (data.getIndustry() != null)         c.setIndustry(data.getIndustry());
        if (data.getAdmin() != null)            c.setAdmin(data.getAdmin());
        if (data.getAdminEmail() != null)       c.setAdminEmail(data.getAdminEmail());
        if (data.getMobileNumber() != null)     c.setMobileNumber(data.getMobileNumber());
        if (data.getRole() != null)             c.setRole(data.getRole());
        if (data.getAddress() != null)          c.setAddress(data.getAddress());
        if (data.getCity() != null)             c.setCity(data.getCity());
        if (data.getState() != null)            c.setState(data.getState());
        if (data.getCountry() != null)          c.setCountry(data.getCountry());
        if (data.getPincode() != null)          c.setPincode(data.getPincode());
        if (data.getOfficialEmail() != null)    c.setOfficialEmail(data.getOfficialEmail());
        if (data.getPhoneNumber() != null)      c.setPhoneNumber(data.getPhoneNumber());
        if (data.getWebsite() != null)          c.setWebsite(data.getWebsite());
        if (data.getPlan() != null)             c.setPlan(data.getPlan());
        if (data.getEmployeeLimit() != null)    c.setEmployeeLimit(data.getEmployeeLimit());
        if (data.getStorageLimit() != null)     c.setStorageLimit(data.getStorageLimit());
        if (data.getBillingCycle() != null)     c.setBillingCycle(data.getBillingCycle());
        if (data.getStartDate() != null)        c.setStartDate(data.getStartDate());
        if (data.getStatus() != null)           c.setStatus(data.getStatus());

        c.setUpdatedDate(LocalDate.now());
        Company updated = repo.save(c);

        safeLog("COMPANY_UPDATED",
                "Company " + safe(updated.getDisplayName()) + " updated",
                "info", "Company", updated.getId(),
                updated.getTenantCode(), null, updated.getAdmin());

        return updated;
    }

    // ── Logo upload — Cloudinary ──────────────────────────────────────────────

    /**
     * Upload company logo to Cloudinary.
     * Stored under: hrms/{tenantCode}/company_logo/
     * Sets Company.logoUrl and Company.logoPublicId.
     * Used by salary slip PDF to display the company logo.
     */
    @Transactional
    public Company uploadLogo(Long companyId, MultipartFile file)
            throws IOException {

        Company company = getById(companyId);

        if (file == null || file.isEmpty())
            throw new RuntimeException("Please select an image file");
        if (file.getSize() > 2 * 1024 * 1024)
            throw new RuntimeException("Logo must be less than 2MB");

        String ct = file.getContentType();
        if (ct == null
                || (!ct.equals("image/jpeg") && !ct.equals("image/jpg")
                        && !ct.equals("image/png")
                        && !ct.equals("image/svg+xml")))
            throw new RuntimeException(
                    "Only JPEG, PNG, and SVG files are allowed");

        // Delete old logo from Cloudinary
        if (company.getLogoPublicId() != null) {
            try { cloudinaryService.deleteImage(company.getLogoPublicId()); }
            catch (Exception ignored) { }
        }

        String tenantCode = company.getTenantCode() != null
                ? company.getTenantCode() : "global";

        Map<String, Object> result =
                cloudinaryService.uploadImage(file, tenantCode, "company_logo");

        company.setLogoUrl(cloudinaryService.getSecureUrl(result));
        company.setLogoPublicId(cloudinaryService.getPublicId(result));
        company.setUpdatedDate(LocalDate.now());

        Company saved = repo.save(company);

        safeLog("COMPANY_LOGO_UPLOADED",
                "Logo uploaded for " + safe(saved.getDisplayName()),
                "success", "Company", saved.getId(),
                saved.getTenantCode(), null, saved.getAdmin());

        return saved;
    }

    /**
     * Delete company logo from Cloudinary and clear the URL.
     */
    @Transactional
    public Company deleteLogo(Long companyId) {
        Company company = getById(companyId);
        if (company.getLogoPublicId() != null) {
            try { cloudinaryService.deleteImage(company.getLogoPublicId()); }
            catch (Exception ignored) { }
            company.setLogoUrl(null);
            company.setLogoPublicId(null);
            company.setUpdatedDate(LocalDate.now());
            repo.save(company);
        }
        return company;
    }

    // ── Delete / Toggle ───────────────────────────────────────────────────────

    public void delete(Long id) {
        Company c = getById(id);
        repo.deleteById(id);
        safeLog("COMPANY_DELETED",
                "Company " + safe(c.getDisplayName()) + " deleted",
                "danger", "Company", c.getId(),
                c.getTenantCode(), null, c.getAdmin());
    }

    public Company toggleStatus(Long id) {
        Company c = getById(id);
        c.setStatus("active".equalsIgnoreCase(c.getStatus())
                ? "suspended" : "active");
        c.setUpdatedDate(LocalDate.now());
        Company saved = repo.save(c);
        safeLog("COMPANY_STATUS_CHANGED",
                "Company " + safe(saved.getDisplayName())
                        + " status changed to " + safe(saved.getStatus()),
                "warning", "Company", saved.getId(),
                saved.getTenantCode(), null, saved.getAdmin());
        return saved;
    }

    // ── Search / Filter ───────────────────────────────────────────────────────

    public List<Company> searchCompanies(String searchTerm) {
        return repo.searchCompanies(searchTerm);
    }

    public List<Company> getCompaniesByStatus(String status) {
        return repo.findByStatus(status);
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCompanies",     repo.count());
        stats.put("activeCompanies",    repo.countByStatus("active"));
        stats.put("suspendedCompanies", repo.countByStatus("suspended"));
        Long emp = repo.getTotalEmployees();
        stats.put("totalEmployees", emp != null ? emp : 0);
        return stats;
    }

    public Optional<Company> findByOfficialEmailAndTenantCode(
            String officialEmail, String tenantCode) {
        Optional<Company> companyOpt =
                repo.findByOfficialEmailAndTenantCode(officialEmail, tenantCode);
        if (companyOpt.isPresent()) {
            Company c = companyOpt.get();
            safeLog("COMPANY_LOGIN",
                    "Company login: " + safe(c.getDisplayName()),
                    "info", "Auth", c.getId(),
                    c.getTenantCode(), null, c.getAdmin());
        }
        return companyOpt;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void safeLog(String eventType, String message, String severity,
                          String tag, Long companyId, String tenantCode,
                          Long actorUserId, String actorName) {
        try {
            activityLogService.log(eventType, message, severity, tag,
                    companyId, tenantCode, actorUserId, actorName);
        } catch (Exception e) {
            System.out.println("ActivityLog failed: " + e.getMessage());
        }
    }

    private String safe(String v) {
        return (v == null || v.trim().isEmpty()) ? "-" : v.trim();
    }
}