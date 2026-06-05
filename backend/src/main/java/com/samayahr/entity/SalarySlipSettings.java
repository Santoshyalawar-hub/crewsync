package com.samayahr.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "salary_slip_settings")
public class SalarySlipSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-one link with company via tenantCode (unique)
    @Column(name = "tenant_code", nullable = false, unique = true, length = 100)
    private String tenantCode;

    // ── Company branding ──────────────────────────────────────────────────────
    @Column(name = "company_logo_base64", columnDefinition = "TEXT")
    private String companyLogoBase64;   // base64 encoded image, stored in DB

    @Column(name = "logo_media_type", length = 50)
    private String logoMediaType;       // e.g. "image/png"

    // ── Slip header / footer ──────────────────────────────────────────────────
    @Column(name = "slip_title", length = 200)
    private String slipTitle = "SALARY SLIP";

    @Column(name = "footer_note", length = 500)
    private String footerNote = "This is a computer-generated salary slip and does not require a signature.";

    // ── Toggle: which fields to SHOW on the slip ──────────────────────────────
    @Column(name = "show_employee_id")
    private Boolean showEmployeeId = true;

    @Column(name = "show_department")
    private Boolean showDepartment = true;

    @Column(name = "show_designation")
    private Boolean showDesignation = true;

    @Column(name = "show_date_of_joining")
    private Boolean showDateOfJoining = true;

    @Column(name = "show_pan_number")
    private Boolean showPanNumber = false;

    @Column(name = "show_uan_number")
    private Boolean showUanNumber = true;

    @Column(name = "show_pf_number")
    private Boolean showPfNumber = true;

    @Column(name = "show_esi_number")
    private Boolean showEsiNumber = false;

    @Column(name = "show_bank_name")
    private Boolean showBankName = true;

    @Column(name = "show_account_number")
    private Boolean showAccountNumber = true;

    @Column(name = "show_loan_number")
    private Boolean showLoanNumber = false;

    // ── Earnings toggles ──────────────────────────────────────────────────────
    @Column(name = "show_basic_salary")
    private Boolean showBasicSalary = true;

    @Column(name = "show_hra")
    private Boolean showHra = true;

    @Column(name = "show_special_allowance")
    private Boolean showSpecialAllowance = true;

    @Column(name = "show_transport_allowance")
    private Boolean showTransportAllowance = false;

    @Column(name = "show_medical_allowance")
    private Boolean showMedicalAllowance = false;

    @Column(name = "show_other_allowances")
    private Boolean showOtherAllowances = false;

    // ── Deductions toggles ────────────────────────────────────────────────────
    @Column(name = "show_pf_deduction")
    private Boolean showPfDeduction = true;

    @Column(name = "show_esi_deduction")
    private Boolean showEsiDeduction = false;

    @Column(name = "show_professional_tax")
    private Boolean showProfessionalTax = true;

    @Column(name = "show_tds")
    private Boolean showTds = false;

    @Column(name = "show_loan_deduction")
    private Boolean showLoanDeduction = false;

    @Column(name = "show_other_deductions")
    private Boolean showOtherDeductions = false;

    // ─────────────────────────────────────────────────────────────────────────
    // Constructors
    // ─────────────────────────────────────────────────────────────────────────
    public SalarySlipSettings() {}

    public SalarySlipSettings(String tenantCode) {
        this.tenantCode = tenantCode;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Getters & Setters
    // ─────────────────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public String getCompanyLogoBase64() { return companyLogoBase64; }
    public void setCompanyLogoBase64(String companyLogoBase64) { this.companyLogoBase64 = companyLogoBase64; }

    public String getLogoMediaType() { return logoMediaType; }
    public void setLogoMediaType(String logoMediaType) { this.logoMediaType = logoMediaType; }

    public String getSlipTitle() { return slipTitle; }
    public void setSlipTitle(String slipTitle) { this.slipTitle = slipTitle; }

    public String getFooterNote() { return footerNote; }
    public void setFooterNote(String footerNote) { this.footerNote = footerNote; }

    public Boolean getShowEmployeeId() { return showEmployeeId; }
    public void setShowEmployeeId(Boolean showEmployeeId) { this.showEmployeeId = showEmployeeId; }

    public Boolean getShowDepartment() { return showDepartment; }
    public void setShowDepartment(Boolean showDepartment) { this.showDepartment = showDepartment; }

    public Boolean getShowDesignation() { return showDesignation; }
    public void setShowDesignation(Boolean showDesignation) { this.showDesignation = showDesignation; }

    public Boolean getShowDateOfJoining() { return showDateOfJoining; }
    public void setShowDateOfJoining(Boolean showDateOfJoining) { this.showDateOfJoining = showDateOfJoining; }

    public Boolean getShowPanNumber() { return showPanNumber; }
    public void setShowPanNumber(Boolean showPanNumber) { this.showPanNumber = showPanNumber; }

    public Boolean getShowUanNumber() { return showUanNumber; }
    public void setShowUanNumber(Boolean showUanNumber) { this.showUanNumber = showUanNumber; }

    public Boolean getShowPfNumber() { return showPfNumber; }
    public void setShowPfNumber(Boolean showPfNumber) { this.showPfNumber = showPfNumber; }

    public Boolean getShowEsiNumber() { return showEsiNumber; }
    public void setShowEsiNumber(Boolean showEsiNumber) { this.showEsiNumber = showEsiNumber; }

    public Boolean getShowBankName() { return showBankName; }
    public void setShowBankName(Boolean showBankName) { this.showBankName = showBankName; }

    public Boolean getShowAccountNumber() { return showAccountNumber; }
    public void setShowAccountNumber(Boolean showAccountNumber) { this.showAccountNumber = showAccountNumber; }

    public Boolean getShowLoanNumber() { return showLoanNumber; }
    public void setShowLoanNumber(Boolean showLoanNumber) { this.showLoanNumber = showLoanNumber; }

    public Boolean getShowBasicSalary() { return showBasicSalary; }
    public void setShowBasicSalary(Boolean showBasicSalary) { this.showBasicSalary = showBasicSalary; }

    public Boolean getShowHra() { return showHra; }
    public void setShowHra(Boolean showHra) { this.showHra = showHra; }

    public Boolean getShowSpecialAllowance() { return showSpecialAllowance; }
    public void setShowSpecialAllowance(Boolean showSpecialAllowance) { this.showSpecialAllowance = showSpecialAllowance; }

    public Boolean getShowTransportAllowance() { return showTransportAllowance; }
    public void setShowTransportAllowance(Boolean showTransportAllowance) { this.showTransportAllowance = showTransportAllowance; }

    public Boolean getShowMedicalAllowance() { return showMedicalAllowance; }
    public void setShowMedicalAllowance(Boolean showMedicalAllowance) { this.showMedicalAllowance = showMedicalAllowance; }

    public Boolean getShowOtherAllowances() { return showOtherAllowances; }
    public void setShowOtherAllowances(Boolean showOtherAllowances) { this.showOtherAllowances = showOtherAllowances; }

    public Boolean getShowPfDeduction() { return showPfDeduction; }
    public void setShowPfDeduction(Boolean showPfDeduction) { this.showPfDeduction = showPfDeduction; }

    public Boolean getShowEsiDeduction() { return showEsiDeduction; }
    public void setShowEsiDeduction(Boolean showEsiDeduction) { this.showEsiDeduction = showEsiDeduction; }

    public Boolean getShowProfessionalTax() { return showProfessionalTax; }
    public void setShowProfessionalTax(Boolean showProfessionalTax) { this.showProfessionalTax = showProfessionalTax; }

    public Boolean getShowTds() { return showTds; }
    public void setShowTds(Boolean showTds) { this.showTds = showTds; }

    public Boolean getShowLoanDeduction() { return showLoanDeduction; }
    public void setShowLoanDeduction(Boolean showLoanDeduction) { this.showLoanDeduction = showLoanDeduction; }

    public Boolean getShowOtherDeductions() { return showOtherDeductions; }
    public void setShowOtherDeductions(Boolean showOtherDeductions) { this.showOtherDeductions = showOtherDeductions; }
}