
package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_salary_details",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "tenant_code"})
        })
public class EmployeeSalaryDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Tenant isolation ──────────────────────────────────────────────────────
    @Column(name = "tenant_code", nullable = false)
    private String tenantCode;

    @Column(name = "company_id")
    private Long companyId;

    // ── Owner ─────────────────────────────────────────────────────────────────
    // FIX: @JsonIgnoreProperties breaks the circular User <-> SalaryDetail reference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"salaryDetail", "bankDetail", "password", "plainPassword",
            "verificationToken", "resetPasswordToken", "hibernateLazyInitializer", "handler"})
    private User user;

    // ── CTC & Gross ───────────────────────────────────────────────────────────
    @Column(name = "annual_ctc", precision = 15, scale = 2)
    private BigDecimal annualCtc;

    @Column(name = "monthly_gross", precision = 12, scale = 2)
    private BigDecimal monthlyGross;

    // ── Earnings ──────────────────────────────────────────────────────────────
    @Column(name = "basic_salary", precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(name = "hra", precision = 12, scale = 2)
    private BigDecimal hra;

    @Column(name = "special_allowance", precision = 12, scale = 2)
    private BigDecimal specialAllowance;

    @Column(name = "transport_allowance", precision = 12, scale = 2)
    private BigDecimal transportAllowance;

    @Column(name = "medical_allowance", precision = 12, scale = 2)
    private BigDecimal medicalAllowance;

    @Column(name = "lta", precision = 12, scale = 2)
    private BigDecimal lta;

    @Column(name = "other_allowance", precision = 12, scale = 2)
    private BigDecimal otherAllowance;

    // ── Deductions ────────────────────────────────────────────────────────────
    @Column(name = "pf_employee", precision = 12, scale = 2)
    private BigDecimal pfEmployee;

    @Column(name = "pf_employer", precision = 12, scale = 2)
    private BigDecimal pfEmployer;

    @Column(name = "professional_tax", precision = 12, scale = 2)
    private BigDecimal professionalTax;

    @Column(name = "tds", precision = 12, scale = 2)
    private BigDecimal tds;

    @Column(name = "esi_employee", precision = 12, scale = 2)
    private BigDecimal esiEmployee;

    @Column(name = "esi_employer", precision = 12, scale = 2)
    private BigDecimal esiEmployer;

    @Column(name = "other_deduction", precision = 12, scale = 2)
    private BigDecimal otherDeduction;

    // ── Net ───────────────────────────────────────────────────────────────────
    @Column(name = "net_take_home", precision = 12, scale = 2)
    private BigDecimal netTakeHome;

    // ── Pay cycle & mode ─────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "pay_cycle")
    private PayCycle payCycle = PayCycle.MONTHLY;

    @Enumerated(EnumType.STRING)
    @Column(name = "salary_mode")
    private SalaryMode salaryMode = SalaryMode.BANK_TRANSFER;

    @Column(name = "effective_from")
    private String effectiveFrom;

    @Column(name = "salary_grade")
    private String salaryGrade;

    @Column(name = "pay_band")
    private String payBand;

    // ── Statutory ─────────────────────────────────────────────────────────────
    @Column(name = "pf_uan")
    private String pfUan;

    @Column(name = "esi_number")
    private String esiNumber;

    @Column(name = "pan_number")
    private String panNumber;

    // ── Metadata ─────────────────────────────────────────────────────────────
    @Column(name = "remarks", length = 1000)
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Enums ─────────────────────────────────────────────────────────────────
    public enum PayCycle { MONTHLY, WEEKLY, BI_WEEKLY }
    public enum SalaryMode { BANK_TRANSFER, CASH, CHEQUE }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getAnnualCtc() { return annualCtc; }
    public void setAnnualCtc(BigDecimal annualCtc) { this.annualCtc = annualCtc; }

    public BigDecimal getMonthlyGross() { return monthlyGross; }
    public void setMonthlyGross(BigDecimal monthlyGross) { this.monthlyGross = monthlyGross; }

    public BigDecimal getBasicSalary() { return basicSalary; }
    public void setBasicSalary(BigDecimal basicSalary) { this.basicSalary = basicSalary; }

    public BigDecimal getHra() { return hra; }
    public void setHra(BigDecimal hra) { this.hra = hra; }

    public BigDecimal getSpecialAllowance() { return specialAllowance; }
    public void setSpecialAllowance(BigDecimal specialAllowance) { this.specialAllowance = specialAllowance; }

    public BigDecimal getTransportAllowance() { return transportAllowance; }
    public void setTransportAllowance(BigDecimal transportAllowance) { this.transportAllowance = transportAllowance; }

    public BigDecimal getMedicalAllowance() { return medicalAllowance; }
    public void setMedicalAllowance(BigDecimal medicalAllowance) { this.medicalAllowance = medicalAllowance; }

    public BigDecimal getLta() { return lta; }
    public void setLta(BigDecimal lta) { this.lta = lta; }

    public BigDecimal getOtherAllowance() { return otherAllowance; }
    public void setOtherAllowance(BigDecimal otherAllowance) { this.otherAllowance = otherAllowance; }

    public BigDecimal getPfEmployee() { return pfEmployee; }
    public void setPfEmployee(BigDecimal pfEmployee) { this.pfEmployee = pfEmployee; }

    public BigDecimal getPfEmployer() { return pfEmployer; }
    public void setPfEmployer(BigDecimal pfEmployer) { this.pfEmployer = pfEmployer; }

    public BigDecimal getProfessionalTax() { return professionalTax; }
    public void setProfessionalTax(BigDecimal professionalTax) { this.professionalTax = professionalTax; }

    public BigDecimal getTds() { return tds; }
    public void setTds(BigDecimal tds) { this.tds = tds; }

    public BigDecimal getEsiEmployee() { return esiEmployee; }
    public void setEsiEmployee(BigDecimal esiEmployee) { this.esiEmployee = esiEmployee; }

    public BigDecimal getEsiEmployer() { return esiEmployer; }
    public void setEsiEmployer(BigDecimal esiEmployer) { this.esiEmployer = esiEmployer; }

    public BigDecimal getOtherDeduction() { return otherDeduction; }
    public void setOtherDeduction(BigDecimal otherDeduction) { this.otherDeduction = otherDeduction; }

    public BigDecimal getNetTakeHome() { return netTakeHome; }
    public void setNetTakeHome(BigDecimal netTakeHome) { this.netTakeHome = netTakeHome; }

    public PayCycle getPayCycle() { return payCycle; }
    public void setPayCycle(PayCycle payCycle) { this.payCycle = payCycle; }

    public SalaryMode getSalaryMode() { return salaryMode; }
    public void setSalaryMode(SalaryMode salaryMode) { this.salaryMode = salaryMode; }

    public String getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(String effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public String getSalaryGrade() { return salaryGrade; }
    public void setSalaryGrade(String salaryGrade) { this.salaryGrade = salaryGrade; }

    public String getPayBand() { return payBand; }
    public void setPayBand(String payBand) { this.payBand = payBand; }

    public String getPfUan() { return pfUan; }
    public void setPfUan(String pfUan) { this.pfUan = pfUan; }

    public String getEsiNumber() { return esiNumber; }
    public void setEsiNumber(String esiNumber) { this.esiNumber = esiNumber; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}