package com.samayahr.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samayahr.entity.SalarySlipSettings;
import com.samayahr.repository.Salaryslipsettingsrepository;


@Service
@Transactional
public class Salaryslipsettingsservice {

    @Autowired
    private Salaryslipsettingsrepository repo;

    /**
     * Create or update salary slip settings for a given tenantCode.
     * Called during company registration (step 5) and from the settings update endpoint.
     */
    public SalarySlipSettings saveSettings(SalarySlipSettings settings) {
        if (settings.getTenantCode() == null || settings.getTenantCode().trim().isEmpty()) {
            throw new RuntimeException("Tenant code is required for salary slip settings");
        }

        String tenantCode = settings.getTenantCode().trim();

        // If settings already exist for this tenant, update in place
        Optional<SalarySlipSettings> existing = repo.findByTenantCode(tenantCode);
        if (existing.isPresent()) {
            SalarySlipSettings s = existing.get();
            mergeInto(s, settings);
            return repo.save(s);
        }

        // No existing record — always create a fresh entity to avoid any id clash
        SalarySlipSettings fresh = new SalarySlipSettings(tenantCode);
        mergeInto(fresh, settings);
        return repo.save(fresh);
    }

    /**
     * Fetch settings by tenantCode.
     * Returns a default (all-false) settings object if none found,
     * so the frontend always gets a response.
     */
    @Transactional(readOnly = true)
    public SalarySlipSettings getByTenantCode(String tenantCode) {
        return repo.findByTenantCode(tenantCode)
                .orElseGet(() -> {
                    SalarySlipSettings defaults = new SalarySlipSettings(tenantCode);
                    return defaults; // not persisted — just a default shape
                });
    }

    /**
     * Create a default settings record automatically when a company is created,
     * so that the tenant always has a row in the table.
     */
    public SalarySlipSettings createDefaults(String tenantCode) {
        if (repo.existsByTenantCode(tenantCode)) {
            return repo.findByTenantCode(tenantCode).get();
        }
        SalarySlipSettings defaults = new SalarySlipSettings(tenantCode);
        return repo.save(defaults);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private void mergeInto(SalarySlipSettings target, SalarySlipSettings src) {
        if (src.getCompanyLogoBase64() != null)  target.setCompanyLogoBase64(src.getCompanyLogoBase64());
        if (src.getLogoMediaType() != null)       target.setLogoMediaType(src.getLogoMediaType());
        if (src.getSlipTitle() != null)           target.setSlipTitle(src.getSlipTitle());
        if (src.getFooterNote() != null)          target.setFooterNote(src.getFooterNote());

        if (src.getShowEmployeeId() != null)        target.setShowEmployeeId(src.getShowEmployeeId());
        if (src.getShowDepartment() != null)        target.setShowDepartment(src.getShowDepartment());
        if (src.getShowDesignation() != null)       target.setShowDesignation(src.getShowDesignation());
        if (src.getShowDateOfJoining() != null)     target.setShowDateOfJoining(src.getShowDateOfJoining());
        if (src.getShowPanNumber() != null)         target.setShowPanNumber(src.getShowPanNumber());
        if (src.getShowUanNumber() != null)         target.setShowUanNumber(src.getShowUanNumber());
        if (src.getShowPfNumber() != null)          target.setShowPfNumber(src.getShowPfNumber());
        if (src.getShowEsiNumber() != null)         target.setShowEsiNumber(src.getShowEsiNumber());
        if (src.getShowBankName() != null)          target.setShowBankName(src.getShowBankName());
        if (src.getShowAccountNumber() != null)     target.setShowAccountNumber(src.getShowAccountNumber());
        if (src.getShowLoanNumber() != null)        target.setShowLoanNumber(src.getShowLoanNumber());

        if (src.getShowBasicSalary() != null)       target.setShowBasicSalary(src.getShowBasicSalary());
        if (src.getShowHra() != null)               target.setShowHra(src.getShowHra());
        if (src.getShowSpecialAllowance() != null)  target.setShowSpecialAllowance(src.getShowSpecialAllowance());
        if (src.getShowTransportAllowance() != null) target.setShowTransportAllowance(src.getShowTransportAllowance());
        if (src.getShowMedicalAllowance() != null)  target.setShowMedicalAllowance(src.getShowMedicalAllowance());
        if (src.getShowOtherAllowances() != null)   target.setShowOtherAllowances(src.getShowOtherAllowances());

        if (src.getShowPfDeduction() != null)       target.setShowPfDeduction(src.getShowPfDeduction());
        if (src.getShowEsiDeduction() != null)      target.setShowEsiDeduction(src.getShowEsiDeduction());
        if (src.getShowProfessionalTax() != null)   target.setShowProfessionalTax(src.getShowProfessionalTax());
        if (src.getShowTds() != null)               target.setShowTds(src.getShowTds());
        if (src.getShowLoanDeduction() != null)     target.setShowLoanDeduction(src.getShowLoanDeduction());
        if (src.getShowOtherDeductions() != null)   target.setShowOtherDeductions(src.getShowOtherDeductions());
    }
}