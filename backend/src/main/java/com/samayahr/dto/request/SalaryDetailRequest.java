package com.samayahr.dto.request;

import java.math.BigDecimal;
import java.util.List;

public class SalaryDetailRequest {

    // CTC
    private BigDecimal annualCtc;
    private BigDecimal monthlyGross;

    // Earnings
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal specialAllowance;
    private BigDecimal transportAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal lta;
    private BigDecimal otherAllowance;

    // Deductions
    private BigDecimal pfEmployee;
    private BigDecimal pfEmployer;
    private BigDecimal professionalTax;
    private BigDecimal tds;
    private BigDecimal esiEmployee;
    private BigDecimal esiEmployer;
    private BigDecimal otherDeduction;

    // Net
    private BigDecimal netTakeHome;

    // Pay meta
    private String payCycle;       // MONTHLY | WEEKLY | BI_WEEKLY
    private String salaryMode;     // BANK_TRANSFER | CASH | CHEQUE
    private String effectiveFrom;
    private String salaryGrade;
    private String payBand;

    // Statutory
    private String pfUan;
    private String esiNumber;
    private String panNumber;
    private String remarks;
    private List<SalaryComponentRequest> components;

    // ── Getters & Setters ─────────────────────────────────────────────────────
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

    public String getPayCycle() { return payCycle; }
    public void setPayCycle(String payCycle) { this.payCycle = payCycle; }

    public String getSalaryMode() { return salaryMode; }
    public void setSalaryMode(String salaryMode) { this.salaryMode = salaryMode; }

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

    public List<SalaryComponentRequest> getComponents() { return components; }
    public void setComponents(List<SalaryComponentRequest> components) { this.components = components; }
}
