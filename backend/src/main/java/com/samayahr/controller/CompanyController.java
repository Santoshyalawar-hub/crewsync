package com.samayahr.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.entity.Company;
import com.samayahr.service.CompanyService;
import com.samayahr.service.EmailService;

@RestController
@RequestMapping("/api/global-admin/companies")
@CrossOrigin(origins = "*", allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                   RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class CompanyController {

    @Autowired
    private CompanyService service;

    @Autowired
    private EmailService emailService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
            @RequestBody Company company) {
        Map<String, Object> response = new HashMap<>();
        try {
            Company saved = service.createCompany(company);
            response.put("success", true);
            response.put("message", "Company created successfully");
            response.put("data", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("message", "Companies fetched successfully");
            response.put("data", service.getAll());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> get(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("message", "Company fetched successfully");
            response.put("data", service.getById(id));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/by-tenant/{tenantCode}")
    public ResponseEntity<Map<String, Object>> getByTenant(
            @PathVariable String tenantCode) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("message", "Company fetched successfully");
            response.put("data", service.getByTenantCode(tenantCode));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long id, @RequestBody Company company) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("message", "Company updated successfully");
            response.put("data", service.update(id, company));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            service.delete(id);
            response.put("success", true);
            response.put("message", "Company deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Map<String, Object>> toggle(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("message", "Company status toggled successfully");
            response.put("data", service.toggleStatus(id));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam String searchTerm) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("message", "Search completed successfully");
            response.put("data", service.searchCompanies(searchTerm));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getByStatus(
            @PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("message", "Companies fetched successfully");
            response.put("data", service.getCompaniesByStatus(status));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("message", "Statistics fetched successfully");
            response.put("data", service.getStatistics());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/company-login")
    public ResponseEntity<Map<String, Object>> companyLogin(
            @RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        try {
            String officialEmail = loginRequest.get("officialEmail");
            String tenantCode    = loginRequest.get("tenantCode");

            if (officialEmail == null || officialEmail.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Official email is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(response);
            }
            if (tenantCode == null || tenantCode.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Tenant code is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(response);
            }

            Optional<Company> companyOpt =
                    service.findByOfficialEmailAndTenantCode(
                            officialEmail, tenantCode);
            if (!companyOpt.isPresent()) {
                response.put("success", false);
                response.put("message",
                        "Invalid credentials. Please check your official "
                        + "email and tenant code.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(response);
            }

            Company company = companyOpt.get();
            if (!"active".equalsIgnoreCase(company.getStatus())) {
                response.put("success", false);
                response.put("message",
                        "Company account is not active. Please contact support.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(response);
            }

            Map<String, Object> companyData = new HashMap<>();
            companyData.put("token",         "COMPANY_TOKEN_" + company.getId());
            companyData.put("companyId",     company.getId());
            companyData.put("displayName",   company.getDisplayName());
            companyData.put("legalName",     company.getLegalName());
            companyData.put("adminEmail",    company.getAdminEmail());
            companyData.put("officialEmail", company.getOfficialEmail());
            companyData.put("tenantCode",    company.getTenantCode());
            companyData.put("role",          company.getRole());
            companyData.put("status",        company.getStatus());
            // ✅ Include logo URL so frontend can display it immediately
            companyData.put("logoUrl",       company.getLogoUrl());

            response.put("success", true);
            response.put("message", "Company login successful");
            response.put("data", companyData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    // ── Send Credentials ─────────────────────────────────────────────────────

    /**
     * POST /api/global-admin/companies/{id}/send-credentials
     * Sends login credentials (tenant code, admin email, login URL) to the company admin.
     */
    @PostMapping("/{id}/send-credentials")
    public ResponseEntity<Map<String, Object>> sendCredentials(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Company company = service.getById(id);
            String toEmail = company.getAdminEmail() != null
                    ? company.getAdminEmail()
                    : company.getOfficialEmail();
            if (toEmail == null || toEmail.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "No email address found for this company");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            String adminName = company.getAdmin() != null ? company.getAdmin() : "Admin";
            emailService.sendCompanyAdminCredentials(
                    toEmail, adminName, toEmail,
                    company.getTenantCode(),
                    company.getDisplayName(),
                    frontendUrl);
            response.put("success", true);
            response.put("message", "Credentials sent to " + toEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ── Logo upload endpoints ─────────────────────────────────────────────────

    /**
     * POST /api/global-admin/companies/{id}/upload-logo
     * Uploads company logo to Cloudinary.
     * Stored under: hrms/{tenantCode}/company_logo/
     * Sets Company.logoUrl — used directly by salary slip PDF generator.
     */
    @PostMapping(value = "/{id}/upload-logo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadLogo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        try {
            Company company = service.uploadLogo(id, file);
            response.put("success",  true);
            response.put("message",  "Logo uploaded successfully");
            response.put("logoUrl",  company.getLogoUrl());
            response.put("data",     company);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * DELETE /api/global-admin/companies/{id}/logo
     * Removes logo from Cloudinary and clears logoUrl in DB.
     */
    @DeleteMapping("/{id}/logo")
    public ResponseEntity<Map<String, Object>> deleteLogo(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            service.deleteLogo(id);
            response.put("success", true);
            response.put("message", "Logo deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}