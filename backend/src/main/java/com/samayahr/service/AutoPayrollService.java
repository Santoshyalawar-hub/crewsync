package com.samayahr.service;

import com.samayahr.entity.Company;
import com.samayahr.entity.EmployeeBankDetail;
import com.samayahr.entity.EmployeeSalaryComponent;
import com.samayahr.entity.EmployeeSalaryDetail;
import com.samayahr.entity.PayrollHistory;
import com.samayahr.entity.PayrollItem;
import com.samayahr.entity.Reimbursement;
import com.samayahr.entity.SalarySlipSettings;
import com.samayahr.entity.User;
import com.samayahr.repository.CompanyRepository;
import com.samayahr.repository.EmployeeBankDetailRepository;
import com.samayahr.repository.EmployeeSalaryComponentRepository;
import com.samayahr.repository.EmployeeSalaryDetailRepository;
import com.samayahr.repository.PayrollHistoryRepository;
import com.samayahr.repository.PayrollItemRepository;
import com.samayahr.repository.ReimbursementRepository;
import com.samayahr.repository.Salaryslipsettingsrepository;
import com.samayahr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class AutoPayrollService {

    @Autowired private UserRepository userRepository;
    @Autowired private EmployeeSalaryDetailRepository salaryDetailRepo;
    @Autowired private EmployeeSalaryComponentRepository componentRepo;
    @Autowired private EmployeeBankDetailRepository bankDetailRepo;
    @Autowired private PayrollHistoryRepository payrollHistoryRepo;
    @Autowired private PayrollItemRepository payrollItemRepo;
    @Autowired private ReimbursementRepository reimbursementRepository;
    @Autowired private CompanyRepository companyRepo;
    @Autowired private Salaryslipsettingsrepository salarySlipSettingsRepo;
    @Autowired private AttendanceService attendanceService;
    @Autowired private SalarySlipPdfService pdfService;

    @Transactional
    public PayrollHistory generateForEmployee(Long employeeId, int year, int month,
                                              String tenantCode, boolean generatePdf) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));
        if (!tenantCode.equals(employee.getTenantCode())) {
            throw new RuntimeException("Access denied: employee does not belong to your company");
        }

        return processEmployee(employee, year, month, tenantCode, generatePdf);
    }

    @Transactional
    public List<Map<String, Object>> generateForAll(int year, int month,
                                                    String tenantCode, Long companyId,
                                                    boolean generatePdf) {
        List<Long> employeeIds =
                userRepository.findEmployeeIdsByTenantAndCompany(tenantCode, companyId);

        return processEmployeeList(employeeIds, year, month, tenantCode, generatePdf);
    }

    @Transactional
    public List<Map<String, Object>> generateForDepartment(int year, int month,
                                                           String tenantCode, Long companyId,
                                                           String department, boolean generatePdf) {
        List<Long> employeeIds =
                userRepository.findEmployeeIdsByTenantCompanyAndDepartment(
                        tenantCode, companyId, department);

        return processEmployeeList(employeeIds, year, month, tenantCode, generatePdf);
    }

    private PayrollHistory processEmployee(User employee, int year, int month,
                                           String tenantCode, boolean generatePdf) {

        LocalDate payrollMonth = LocalDate.of(year, month, 1);

        Optional<PayrollHistory> existing =
                payrollHistoryRepo.findByUserIdAndMonth(employee.getId(), payrollMonth);

        EmployeeSalaryDetail salary = salaryDetailRepo
                .findByUserIdAndTenantCode(employee.getId(), tenantCode)
                .orElse(null);
        List<EmployeeSalaryComponent> activeComponents = componentRepo
                .findByEmployeeIdAndTenantCodeAndIsActiveTrueOrderByDisplayOrderAscIdAsc(
                        employee.getId(), tenantCode);

        if (salary == null && activeComponents.isEmpty()) {
            throw new RuntimeException(
                    "Salary structure not configured for: " + employee.getFullName()
                            + ". Please set up salary details before running payroll.");
        }

        Map<String, Object> attendance =
                attendanceService.getMonthlyAttendanceForEmployee(
                        employee.getId(), year, month, tenantCode);

        int totalWorkingDays = toLong(attendance.get("workingDays")).intValue();
        double effectiveDays = toDouble(attendance.get("effectiveDays"));
        long absentDays = toLong(attendance.get("absentDays"));
        long leaveDays = toLong(attendance.get("leaveDays"));
        long halfDays = toLong(attendance.get("halfDays"));
        int lopDays = (int) absentDays;

        BigDecimal monthlyGross = salary != null
                ? safe(salary.getMonthlyGross())
                : sumComponentAmounts(activeComponents, EmployeeSalaryComponent.ComponentType.EARNING);

        BigDecimal perDaySalary = totalWorkingDays > 0
                ? monthlyGross.divide(BigDecimal.valueOf(totalWorkingDays), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal lopDeduction = perDaySalary.multiply(BigDecimal.valueOf(lopDays));

        double attendanceFactor = totalWorkingDays > 0
                ? Math.min(effectiveDays / totalWorkingDays, 1.0)
                : 1.0;
        BigDecimal factor = BigDecimal.valueOf(attendanceFactor)
                .setScale(4, RoundingMode.HALF_UP);

        List<PayrollItem> payrollItems = new ArrayList<>();
        Map<String, BigDecimal> earningValues = new HashMap<>();
        Map<String, BigDecimal> deductionValues = new HashMap<>();

        if (!activeComponents.isEmpty()) {
            for (EmployeeSalaryComponent component : activeComponents) {
                EmployeeSalaryComponent.ComponentType type = component.getComponentType();
                if (type == null) {
                    type = EmployeeSalaryComponent.ComponentType.EARNING;
                }

                BigDecimal computedAmount = type == EmployeeSalaryComponent.ComponentType.DEDUCTION
                        ? safe(component.getAmount())
                        : scale(component.getAmount(), factor);

                addPayrollItem(payrollItems, employee, tenantCode,
                        component.getComponentName(),
                        component.getComponentKey(),
                        type,
                        computedAmount,
                        "SALARY_COMPONENT");

                if (computedAmount.compareTo(BigDecimal.ZERO) > 0) {
                    String normalizedKey = normalizeComponentKey(
                            component.getComponentKey(), component.getComponentName());
                    if (type == EmployeeSalaryComponent.ComponentType.DEDUCTION) {
                        deductionValues.put(normalizedKey, computedAmount);
                    } else {
                        earningValues.put(normalizedKey, computedAmount);
                    }
                }
            }
        } else if (salary != null) {
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "Basic Salary", "basicSalary",
                    EmployeeSalaryComponent.ComponentType.EARNING, scale(salary.getBasicSalary(), factor));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "HRA", "hra",
                    EmployeeSalaryComponent.ComponentType.EARNING, scale(salary.getHra(), factor));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "Special Allowance", "specialAllowance",
                    EmployeeSalaryComponent.ComponentType.EARNING, scale(salary.getSpecialAllowance(), factor));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "Transport Allowance", "transportAllowance",
                    EmployeeSalaryComponent.ComponentType.EARNING, scale(salary.getTransportAllowance(), factor));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "Medical Allowance", "medicalAllowance",
                    EmployeeSalaryComponent.ComponentType.EARNING, scale(salary.getMedicalAllowance(), factor));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "LTA", "lta",
                    EmployeeSalaryComponent.ComponentType.EARNING, scale(salary.getLta(), factor));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "Other Allowance", "otherAllowance",
                    EmployeeSalaryComponent.ComponentType.EARNING, scale(salary.getOtherAllowance(), factor));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "PF", "pfEmployee",
                    EmployeeSalaryComponent.ComponentType.DEDUCTION, safe(salary.getPfEmployee()));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "ESI", "esiEmployee",
                    EmployeeSalaryComponent.ComponentType.DEDUCTION, safe(salary.getEsiEmployee()));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "Professional Tax", "professionalTax",
                    EmployeeSalaryComponent.ComponentType.DEDUCTION, safe(salary.getProfessionalTax()));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "TDS", "tds",
                    EmployeeSalaryComponent.ComponentType.DEDUCTION, safe(salary.getTds()));
            addLegacyPayrollItem(payrollItems, employee, tenantCode, "Other Deduction", "otherDeduction",
                    EmployeeSalaryComponent.ComponentType.DEDUCTION, safe(salary.getOtherDeduction()));

            for (PayrollItem item : payrollItems) {
                if (item.getComponentType() == EmployeeSalaryComponent.ComponentType.DEDUCTION) {
                    deductionValues.put(item.getComponentKey(), item.getAmount());
                } else {
                    earningValues.put(item.getComponentKey(), item.getAmount());
                }
            }
        }

        List<Reimbursement> approvedReimbursements = new ArrayList<>();
        try {
            approvedReimbursements = reimbursementRepository
                    .findApprovedUnpaidByUserAndTenant(employee.getId(), tenantCode);
        } catch (Exception e) {
            System.err.println("Reimbursement fetch failed for "
                    + employee.getFullName() + ": " + e.getMessage());
        }
        for (Reimbursement reimbursement : approvedReimbursements) {
            BigDecimal amount = safe(reimbursement.getAmount());
            String key = "reimbursement_" + (reimbursement.getId() != null
                    ? reimbursement.getId()
                    : UUID.randomUUID());
            String name = reimbursement.getReimbursementType() != null
                    && !reimbursement.getReimbursementType().isBlank()
                    ? reimbursement.getReimbursementType() + " Reimbursement"
                    : "Reimbursement";

            addPayrollItem(payrollItems, employee, tenantCode, name, key,
                    EmployeeSalaryComponent.ComponentType.REIMBURSEMENT,
                    amount, "REIMBURSEMENT");
        }

        BigDecimal totalEarnings = payrollItems.stream()
                .filter(item -> item.getComponentType() != EmployeeSalaryComponent.ComponentType.DEDUCTION)
                .map(PayrollItem::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalDeductions = payrollItems.stream()
                .filter(item -> item.getComponentType() == EmployeeSalaryComponent.ComponentType.DEDUCTION)
                .map(PayrollItem::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal basicSalary = resolveAmount(earningValues, "basicSalary", "basic_salary");
        BigDecimal hra = resolveAmount(earningValues, "hra");
        BigDecimal specialAllow = resolveAmount(earningValues, "specialAllowance", "special_allowance");
        BigDecimal transportAllow = resolveAmount(earningValues, "transportAllowance",
                "transport_allowance", "conveyanceAllowance", "conveyance_allowance");
        BigDecimal medicalAllow = resolveAmount(earningValues, "medicalAllowance", "medical_allowance");
        BigDecimal lta = resolveAmount(earningValues, "lta");
        BigDecimal otherAllow = resolveAmount(earningValues, "otherAllowance",
                "other_allowance", "otherAllowances", "other_allowances");

        BigDecimal pfEmployee = resolveAmount(deductionValues, "pfEmployee", "pf_employee");
        BigDecimal esiEmployee = resolveAmount(deductionValues, "esiEmployee", "esi_employee");
        BigDecimal professionalTax = resolveAmount(deductionValues, "professionalTax", "professional_tax");
        BigDecimal tds = resolveAmount(deductionValues, "tds", "taxDeductions", "tax_deductions");
        BigDecimal otherDeduction = resolveAmount(deductionValues, "otherDeduction",
                "other_deduction", "otherDeductions", "other_deductions");

        BigDecimal netSalary = totalEarnings.subtract(totalDeductions).max(BigDecimal.ZERO);

        PayrollHistory payroll = existing.orElseGet(PayrollHistory::new);
        payroll.setUserId(employee.getId());
        payroll.setUserName(employee.getFullName());
        payroll.setPayrollMonth(payrollMonth);
        payroll.setBasicSalary(basicSalary);
        payroll.setHra(hra);
        payroll.setSpecialAllowance(specialAllow);
        payroll.setConveyanceAllowance(transportAllow);
        payroll.setMedicalAllowance(medicalAllow);
        payroll.setLta(lta);
        payroll.setOtherAllowances(otherAllow);
        payroll.setTotalEarnings(totalEarnings);
        payroll.setPfEmployee(pfEmployee);
        payroll.setEsiEmployee(esiEmployee);
        payroll.setProfessionalTax(professionalTax);
        payroll.setTaxDeductions(tds);
        payroll.setOtherDeductions(otherDeduction);
        payroll.setTotalDeductions(totalDeductions);
        payroll.setNetSalary(netSalary);
        payroll.setLopDays(lopDays);
        payroll.setOvertimeHours(0);
        payroll.setAutoGenerated(true);
        payroll.setStatus(PayrollHistory.PayrollStatus.PENDING);
        payroll.setRemarks(buildRemarks(totalWorkingDays, lopDays, (int) leaveDays,
                (int) halfDays, attendanceFactor, lopDeduction));
        payroll.setPayslipGenerated(false);
        payroll.setPayslipPath(null);

        PayrollHistory saved = payrollHistoryRepo.save(payroll);
        payrollItemRepo.deleteByPayrollId(saved.getId());
        for (PayrollItem item : payrollItems) {
            item.setPayrollId(saved.getId());
        }
        payrollItemRepo.saveAll(payrollItems);

        if (!approvedReimbursements.isEmpty()) {
            LocalDate paidOn = LocalDate.now();
            for (Reimbursement reimbursement : approvedReimbursements) {
                reimbursement.setStatus(Reimbursement.ReimbursementStatus.PAID);
                reimbursement.setPaymentDate(paidOn);
            }
            reimbursementRepository.saveAll(approvedReimbursements);
        }

        if (generatePdf) {
            try {
                Company company = companyRepo.findByTenantCode(tenantCode).orElse(null);
                SalarySlipSettings settings =
                        salarySlipSettingsRepo.findByTenantCode(tenantCode)
                                .orElse(new SalarySlipSettings(tenantCode));
                EmployeeBankDetail bank =
                        bankDetailRepo.findByUserIdAndTenantCode(
                                employee.getId(), tenantCode).orElse(null);

                String pdfUrl = pdfService.generateAndUpload(
                        saved, employee, salary, bank, company, settings,
                        year, month, totalWorkingDays, lopDays,
                        (int) leaveDays, (int) halfDays, effectiveDays);

                saved.setPayslipPath(pdfUrl);
                saved.setPayslipGenerated(true);
                payrollHistoryRepo.save(saved);

            } catch (Exception e) {
                System.err.println("Payslip PDF generation failed for "
                        + employee.getFullName() + ": " + e.getMessage());
            }
        }

        return saved;
    }

    private List<Map<String, Object>> processEmployeeList(List<Long> employeeIds,
                                                          int year, int month,
                                                          String tenantCode,
                                                          boolean generatePdf) {
        List<Map<String, Object>> results = new ArrayList<>();

        for (Long empId : employeeIds) {
            Map<String, Object> result = new HashMap<>();
            result.put("employeeId", empId);

            try {
                User employee = userRepository.findById(empId).orElse(null);
                if (employee == null) {
                    result.put("status", "SKIPPED");
                    result.put("reason", "Employee not found");
                    results.add(result);
                    continue;
                }
                result.put("employeeName", employee.getFullName());

                boolean hasSalary = salaryDetailRepo
                        .findByUserIdAndTenantCode(empId, tenantCode).isPresent();
                boolean hasComponents = !componentRepo
                        .findByEmployeeIdAndTenantCodeAndIsActiveTrueOrderByDisplayOrderAscIdAsc(
                                empId, tenantCode)
                        .isEmpty();
                if (!hasSalary && !hasComponents) {
                    result.put("status", "SKIPPED");
                    result.put("reason", "Salary structure not configured");
                    results.add(result);
                    continue;
                }

                PayrollHistory payroll =
                        processEmployee(employee, year, month, tenantCode, generatePdf);
                result.put("status", "SUCCESS");
                result.put("payrollId", payroll.getId());
                result.put("netSalary", payroll.getNetSalary());
                result.put("lopDays", payroll.getLopDays());
                result.put("payslipUrl", payroll.getPayslipPath());

            } catch (RuntimeException e) {
                result.put("status", "FAILED");
                result.put("reason", e.getMessage());
            }

            results.add(result);
        }

        return results;
    }

    private BigDecimal scale(BigDecimal value, BigDecimal factor) {
        if (value == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return value.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal safe(BigDecimal v) {
        return v != null ? v : BigDecimal.ZERO;
    }

    private BigDecimal sumComponentAmounts(List<EmployeeSalaryComponent> items,
                                           EmployeeSalaryComponent.ComponentType type) {
        return items.stream()
                .filter(item -> item.getComponentType() == type)
                .map(EmployeeSalaryComponent::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private void addLegacyPayrollItem(List<PayrollItem> items,
                                      User employee,
                                      String tenantCode,
                                      String componentName,
                                      String componentKey,
                                      EmployeeSalaryComponent.ComponentType type,
                                      BigDecimal amount) {
        addPayrollItem(items, employee, tenantCode, componentName, componentKey, type, amount, "LEGACY_DETAIL");
    }

    private void addPayrollItem(List<PayrollItem> items,
                                User employee,
                                String tenantCode,
                                String componentName,
                                String componentKey,
                                EmployeeSalaryComponent.ComponentType type,
                                BigDecimal amount,
                                String source) {
        BigDecimal normalized = safe(amount).setScale(2, RoundingMode.HALF_UP);
        if (normalized.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        String safeName = componentName != null && !componentName.isBlank()
                ? componentName.trim()
                : "Component";
        String safeKey = normalizeComponentKey(componentKey, safeName);

        PayrollItem item = new PayrollItem();
        item.setEmployeeId(employee.getId());
        item.setTenantCode(tenantCode);
        item.setComponentName(safeName);
        item.setComponentKey(safeKey);
        item.setComponentType(type != null ? type : EmployeeSalaryComponent.ComponentType.EARNING);
        item.setAmount(normalized);
        item.setSource(source);
        items.add(item);
    }

    private String normalizeComponentKey(String componentKey, String componentName) {
        String raw = componentKey != null && !componentKey.isBlank()
                ? componentKey.trim()
                : componentName;

        String normalized = raw == null ? "" : raw.trim()
                .replaceAll("([a-z])([A-Z])", "$1_$2")
                .replaceAll("[^A-Za-z0-9]+", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "")
                .toLowerCase();

        return normalized.isBlank() ? "component" : normalized;
    }

    private BigDecimal resolveAmount(Map<String, BigDecimal> values, String... keys) {
        for (String key : keys) {
            if (values.containsKey(key)) {
                return safe(values.get(key)).setScale(2, RoundingMode.HALF_UP);
            }
        }
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }

    private Long toLong(Object v) {
        if (v == null) {
            return 0L;
        }
        if (v instanceof Number) {
            return ((Number) v).longValue();
        }
        try {
            return Long.parseLong(v.toString());
        } catch (Exception e) {
            return 0L;
        }
    }

    private double toDouble(Object v) {
        if (v == null) {
            return 0.0;
        }
        if (v instanceof Number) {
            return ((Number) v).doubleValue();
        }
        try {
            return Double.parseDouble(v.toString());
        } catch (Exception e) {
            return 0.0;
        }
    }

    private String buildRemarks(int workingDays, int lopDays, int leaveDays,
                                int halfDays, double factor, BigDecimal lopDeduction) {
        return String.format(
                "Auto-generated | Working days: %d | LOP: %d | Leaves: %d | Half-days: %d"
                        + " | Attendance factor: %.2f | LOP deduction: %s",
                workingDays, lopDays, leaveDays, halfDays, factor,
                safe(lopDeduction).setScale(2, RoundingMode.HALF_UP).toPlainString());
    }
}
