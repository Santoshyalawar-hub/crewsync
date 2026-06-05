package com.samayahr.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.TreeMap;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samayahr.dto.request.PayrollRequest;
import com.samayahr.dto.response.PayrollItemResponse;
import com.samayahr.dto.response.PayrollResponse;
import com.samayahr.entity.Company;
import com.samayahr.entity.EmployeeBankDetail;
import com.samayahr.entity.EmployeeSalaryDetail;
import com.samayahr.entity.PayrollHistory;
import com.samayahr.entity.PayrollItem;
import com.samayahr.entity.SalarySlipSettings;
import com.samayahr.entity.User;
import com.samayahr.repository.CompanyRepository;
import com.samayahr.repository.EmployeeBankDetailRepository;
import com.samayahr.repository.EmployeeSalaryDetailRepository;
import com.samayahr.repository.PayrollHistoryRepository;
import com.samayahr.repository.PayrollItemRepository;
import com.samayahr.repository.Salaryslipsettingsrepository;
import com.samayahr.repository.UserRepository;

@Service
public class PayrollService {

    private static final DateTimeFormatter MONTH_YEAR =
            DateTimeFormatter.ofPattern("MMMM yyyy");
    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final Pattern WORKING_DAYS_PATTERN =
            Pattern.compile("Working days: (\\d+)");

    @Autowired private PayrollHistoryRepository payrollHistoryRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmployeeSalaryDetailRepository employeeSalaryDetailRepository;
    @Autowired private EmployeeBankDetailRepository employeeBankDetailRepository;
    @Autowired private PayrollItemRepository payrollItemRepository;
    @Autowired private Salaryslipsettingsrepository salarySlipSettingsRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private CloudinaryService cloudinaryService;
    @Autowired private SalarySlipPdfService salarySlipPdfService;
    @Autowired private UserService userService;

    @Autowired(required = false)
    private EmailService emailService;

    public List<PayrollResponse> getAllPayrolls() {
        User actor = requireCurrentUser();

        if (actor.getRole() == User.Role.GLOBAL_ADMIN) {
            return payrollHistoryRepository.findAll().stream()
                    .map(this::enrichPayrollWithUserDetails)
                    .collect(Collectors.toList());
        }

        if (actor.getRole() == User.Role.EMPLOYEE) {
            return payrollHistoryRepository.findByUserIdOrderByPayrollMonthDesc(actor.getId()).stream()
                    .map(this::enrichPayrollWithUserDetails)
                    .collect(Collectors.toList());
        }

        return payrollHistoryRepository
                .findByTenantCompany(actor.getTenantCode(), actor.getCompanyId()).stream()
                .map(this::enrichPayrollWithUserDetails)
                .collect(Collectors.toList());
    }

    public PayrollResponse getPayrollById(Long id) {
        PayrollHistory payroll = getAccessiblePayroll(id);
        return enrichPayrollWithUserDetails(payroll);
    }

    public List<PayrollResponse> getPayrollByUser(Long userId) {
        User actor = requireCurrentUser();
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        validateUserAccess(actor, target);

        return payrollHistoryRepository.findByUserIdOrderByPayrollMonthDesc(userId).stream()
                .map(this::enrichPayrollWithUserDetails)
                .collect(Collectors.toList());
    }

    @Transactional
    public PayrollHistory createPayroll(PayrollRequest request) {
        User actor = requireCurrentUser();
        User employee = validatePayrollWriteRequest(actor, request);

        if (request.getPayrollMonth() != null) {
            payrollHistoryRepository
                    .findByUserIdAndMonth(employee.getId(), request.getPayrollMonth())
                    .ifPresent(existing -> {
                        throw new RuntimeException("Payroll already exists for this month");
                    });
        }

        PayrollHistory payroll = new PayrollHistory();
        mapRequestToEntity(request, payroll, employee);
        payroll.setCreatedBy(actor.getId());
        return payrollHistoryRepository.save(payroll);
    }

    @Transactional
    public PayrollHistory updatePayroll(Long id, PayrollRequest request) {
        User actor = requireCurrentUser();
        PayrollHistory payroll = getAccessiblePayroll(id);
        User employee = validatePayrollWriteRequest(actor, request);
        if (!payroll.getUserId().equals(employee.getId())) {
            throw new RuntimeException("Payroll cannot be reassigned to another employee");
        }
        mapRequestToEntity(request, payroll, employee);
        payroll.setCreatedBy(actor.getId());
        return payrollHistoryRepository.save(payroll);
    }

    @Transactional
    public void deletePayroll(Long id) {
        PayrollHistory payroll = getAccessiblePayroll(id);

        if (Boolean.TRUE.equals(payroll.getPayslipGenerated())
                && payroll.getPayslipPath() != null
                && payroll.getPayslipPath().startsWith("http")) {
            try {
                String url = payroll.getPayslipPath();
                String afterUpload = url.substring(url.indexOf("/upload/") + 8);
                String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
                String publicId = withoutVersion.contains(".")
                        ? withoutVersion.substring(0, withoutVersion.lastIndexOf("."))
                        : withoutVersion;
                cloudinaryService.deleteRaw(publicId);
            } catch (Exception ignored) {
            }
        }

        payrollItemRepository.deleteByPayrollId(payroll.getId());
        payrollHistoryRepository.delete(payroll);
    }

    @Transactional
    public PayrollHistory generateAutoPayroll(PayrollRequest request) {
        return createPayroll(request);
    }

    @Transactional
    public PayrollHistory manualPayrollEntry(PayrollRequest request) {
        return createPayroll(request);
    }

    @Transactional
    public PayrollHistory approvePayroll(Long payrollId, Long approvedBy) {
        PayrollHistory payroll = getAccessiblePayroll(payrollId);

        if (payroll.getStatus() == PayrollHistory.PayrollStatus.PAID) {
            throw new RuntimeException("Payroll is already PAID");
        }
        if (payroll.getStatus() == PayrollHistory.PayrollStatus.CANCELLED) {
            throw new RuntimeException("Cannot approve a cancelled payroll");
        }

        payroll.setStatus(PayrollHistory.PayrollStatus.APPROVED);
        payroll.setCreatedBy(approvedBy != null ? approvedBy : requireCurrentUser().getId());
        return payrollHistoryRepository.save(payroll);
    }

    @Transactional
    public PayrollHistory markAsPaid(Long payrollId, Long markedBy) {
        PayrollHistory payroll = getAccessiblePayroll(payrollId);

        if (payroll.getStatus() != PayrollHistory.PayrollStatus.APPROVED) {
            throw new RuntimeException(
                    "Payroll must be APPROVED before marking as PAID. Current status: "
                            + payroll.getStatus());
        }

        payroll.setStatus(PayrollHistory.PayrollStatus.PAID);
        payroll.setPaymentDate(LocalDate.now());
        payroll.setCreatedBy(markedBy != null ? markedBy : requireCurrentUser().getId());
        PayrollHistory saved = payrollHistoryRepository.save(payroll);

        if (emailService != null) {
            try {
                User employee = userRepository.findById(payroll.getUserId()).orElse(null);
                if (employee != null
                        && payroll.getPayslipPath() != null
                        && !payroll.getPayslipPath().isEmpty()) {
                    String companyName = employee.getCompanyName() != null
                            ? employee.getCompanyName() : "Your Company";
                    String monthYear = payroll.getPayrollMonth() != null
                            ? payroll.getPayrollMonth().format(MONTH_YEAR) : "Payroll";

                    emailService.sendPayslipEmail(
                            employee.getEmail(),
                            employee.getFullName(),
                            monthYear,
                            payroll.getPayslipPath(),
                            companyName);
                }
            } catch (Exception e) {
                System.err.println("Payslip email failed for payroll "
                        + payrollId + ": " + e.getMessage());
            }
        }

        return saved;
    }

    @Transactional
    public PayrollHistory cancelPayroll(Long payrollId, String reason) {
        PayrollHistory payroll = getAccessiblePayroll(payrollId);

        if (payroll.getStatus() == PayrollHistory.PayrollStatus.PAID) {
            throw new RuntimeException("Cannot cancel a payroll that is already PAID");
        }

        payroll.setStatus(PayrollHistory.PayrollStatus.CANCELLED);
        if (reason != null) {
            payroll.setRemarks(reason);
        }
        return payrollHistoryRepository.save(payroll);
    }

    @Transactional
    public PayrollHistory lockPayroll(Long payrollId) {
        PayrollHistory payroll = getAccessiblePayroll(payrollId);
        if (payroll.getStatus() != PayrollHistory.PayrollStatus.PAID
                && payroll.getStatus() != PayrollHistory.PayrollStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED or PAID payrolls can be locked");
        }
        payroll.setIsLocked(true);
        payroll.setStatus(PayrollHistory.PayrollStatus.LOCKED);
        return payrollHistoryRepository.save(payroll);
    }

    @Transactional
    public PayrollHistory unlockPayroll(Long payrollId) {
        User actor = requireCurrentUser();
        if (actor.getRole() != User.Role.GLOBAL_ADMIN
                && actor.getRole() != User.Role.SUPER_ADMIN
                && actor.getRole() != User.Role.COMPANY_ADMIN
                && actor.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Only admins can unlock a payroll");
        }
        PayrollHistory payroll = getAccessiblePayroll(payrollId);
        payroll.setIsLocked(false);
        payroll.setStatus(PayrollHistory.PayrollStatus.APPROVED);
        return payrollHistoryRepository.save(payroll);
    }

    /** Monthly payroll trend for a year — returns list of {month, totalPayout, employeeCount} */
    public List<Map<String, Object>> getMonthlyTrend(int year) {
        User actor = requireCurrentUser();
        List<PayrollHistory> records;

        if (actor.getRole() == User.Role.GLOBAL_ADMIN) {
            records = payrollHistoryRepository.findByYearAndMonth(year, 0); // fetch by year only below
            // fallback: fetch all and filter by year
            records = payrollHistoryRepository.findAll().stream()
                    .filter(p -> p.getPayrollMonth() != null && p.getPayrollMonth().getYear() == year)
                    .collect(Collectors.toList());
        } else {
            records = payrollHistoryRepository.findByTenantCompanyAndYear(
                    actor.getTenantCode(), actor.getCompanyId(), year);
        }

        Map<Integer, List<PayrollHistory>> byMonth = new TreeMap<>();
        for (PayrollHistory p : records) {
            if (p.getPayrollMonth() == null) continue;
            int m = p.getPayrollMonth().getMonthValue();
            byMonth.computeIfAbsent(m, k -> new ArrayList<>()).add(p);
        }

        List<Map<String, Object>> trend = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            List<PayrollHistory> monthList = byMonth.getOrDefault(m, new ArrayList<>());
            BigDecimal total = monthList.stream()
                    .map(PayrollHistory::getNetSalary)
                    .filter(v -> v != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", m);
            entry.put("monthName", Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            entry.put("totalPayout", total);
            entry.put("employeeCount", monthList.size());
            trend.add(entry);
        }
        return trend;
    }

    /** Department-wise salary cost for a given month */
    public List<Map<String, Object>> getDeptCost(int year, int month) {
        User actor = requireCurrentUser();
        if (actor.getRole() == User.Role.GLOBAL_ADMIN || actor.getCompanyId() == null) {
            return new ArrayList<>();
        }

        List<String> depts = payrollHistoryRepository.findDistinctDepartments(
                actor.getTenantCode(), actor.getCompanyId(), year, month);

        List<Map<String, Object>> result = new ArrayList<>();
        for (String dept : depts) {
            List<PayrollHistory> deptRecords = payrollHistoryRepository
                    .findByTenantDepartmentAndMonth(actor.getTenantCode(), dept, year, month);
            BigDecimal total = deptRecords.stream()
                    .map(PayrollHistory::getNetSalary)
                    .filter(v -> v != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Map<String, Object> entry = new HashMap<>();
            entry.put("department", dept);
            entry.put("totalPayout", total);
            entry.put("employeeCount", deptRecords.size());
            result.add(entry);
        }
        return result;
    }

    /** Employee salary growth — returns list of {month, netSalary} for last N months */
    public List<Map<String, Object>> getEmployeeGrowth(Long userId) {
        User actor = requireCurrentUser();
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        validateUserAccess(actor, target);

        List<PayrollHistory> records = payrollHistoryRepository
                .findByUserIdOrderByPayrollMonthAsc(userId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (PayrollHistory p : records) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", p.getPayrollMonth() != null
                    ? p.getPayrollMonth().format(DateTimeFormatter.ofPattern("MMM yyyy"))
                    : "N/A");
            entry.put("netSalary", p.getNetSalary() != null ? p.getNetSalary() : BigDecimal.ZERO);
            entry.put("totalEarnings", p.getTotalEarnings() != null ? p.getTotalEarnings() : BigDecimal.ZERO);
            entry.put("totalDeductions", p.getTotalDeductions() != null ? p.getTotalDeductions() : BigDecimal.ZERO);
            result.add(entry);
        }
        return result;
    }

    public Map<String, Object> getAnalytics(String range) {
        User actor = requireCurrentUser();
        Map<String, Object> analytics = new HashMap<>();

        if (actor.getRole() == User.Role.GLOBAL_ADMIN) {
            analytics.put("totalEmployees", userRepository.countByRole(User.Role.EMPLOYEE));
        } else {
            analytics.put("totalEmployees",
                    userRepository.countEmployeesByTenantCode(actor.getTenantCode()));
        }

        LocalDate now = LocalDate.now();
        List<PayrollHistory> currentMonthPayrolls;

        if (actor.getRole() == User.Role.GLOBAL_ADMIN) {
            currentMonthPayrolls = payrollHistoryRepository.findByYearAndMonth(
                    now.getYear(), now.getMonthValue());
        } else {
            currentMonthPayrolls = payrollHistoryRepository.findByTenantCompanyAndMonth(
                    actor.getTenantCode(), actor.getCompanyId(),
                    now.getYear(), now.getMonthValue());
        }

        analytics.put("activePayrolls", currentMonthPayrolls.size());
        analytics.put("totalPayouts", currentMonthPayrolls.stream()
                .map(PayrollHistory::getNetSalary)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        analytics.put("pendingReimbursements", 0);
        return analytics;
    }

    public ResponseEntity<?> exportPayrolls(String format, String status, String month) {
        return ResponseEntity.ok(
                Map.of("message", "Export functionality to be implemented"));
    }

    @Transactional
    public Map<String, Object> generatePayslip(Long payrollId) throws Exception {
        PayrollHistory payroll = getAccessiblePayroll(payrollId);
        User employee = userRepository.findById(payroll.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        EmployeeSalaryDetail salaryDetail = employeeSalaryDetailRepository
                .findByUserIdAndTenantCode(employee.getId(), employee.getTenantCode())
                .orElse(null);
        EmployeeBankDetail bankDetail = employeeBankDetailRepository
                .findByUserIdAndTenantCode(employee.getId(), employee.getTenantCode())
                .orElse(null);
        Company company = companyRepository.findByTenantCode(employee.getTenantCode())
                .orElse(null);
        SalarySlipSettings settings = salarySlipSettingsRepository
                .findByTenantCode(employee.getTenantCode())
                .orElse(new SalarySlipSettings(employee.getTenantCode()));

        int workingDays = extractWorkingDays(payroll.getRemarks());
        int lopDays = payroll.getLopDays() != null ? payroll.getLopDays() : 0;
        int paidDays = Math.max(workingDays - lopDays, 0);

        String payslipUrl = salarySlipPdfService.generateAndUpload(
                payroll,
                employee,
                salaryDetail,
                bankDetail,
                company,
                settings,
                payroll.getPayrollMonth() != null ? payroll.getPayrollMonth().getYear() : LocalDate.now().getYear(),
                payroll.getPayrollMonth() != null ? payroll.getPayrollMonth().getMonthValue() : LocalDate.now().getMonthValue(),
                workingDays,
                lopDays,
                0,
                0,
                paidDays);

        payroll.setPayslipGenerated(true);
        payroll.setPayslipPath(payslipUrl);
        payrollHistoryRepository.save(payroll);

        return Map.of("message", "Payslip generated successfully", "payslipUrl", payslipUrl);
    }

    public ResponseEntity<?> downloadPayslip(Long payrollId) {
        PayrollHistory payroll = getAccessiblePayroll(payrollId);

        if (!Boolean.TRUE.equals(payroll.getPayslipGenerated())
                || payroll.getPayslipPath() == null) {
            throw new RuntimeException("Payslip not generated yet");
        }

        return ResponseEntity.status(302)
                .header(HttpHeaders.LOCATION, payroll.getPayslipPath())
                .build();
    }

    private PayrollResponse enrichPayrollWithUserDetails(PayrollHistory payroll) {
        PayrollResponse dto = new PayrollResponse();
        dto.setId(payroll.getId());
        dto.setUserId(payroll.getUserId());
        dto.setUserName(payroll.getUserName());
        dto.setPayrollMonth(payroll.getPayrollMonth());
        dto.setBasicSalary(payroll.getBasicSalary());
        dto.setHra(payroll.getHra());
        dto.setSpecialAllowance(payroll.getSpecialAllowance());
        dto.setConveyanceAllowance(payroll.getConveyanceAllowance());
        dto.setMedicalAllowance(payroll.getMedicalAllowance());
        dto.setLta(payroll.getLta());
        dto.setOtherAllowances(payroll.getOtherAllowances());
        dto.setTotalEarnings(payroll.getTotalEarnings());
        dto.setPfEmployee(payroll.getPfEmployee());
        dto.setEsiEmployee(payroll.getEsiEmployee());
        dto.setProfessionalTax(payroll.getProfessionalTax());
        dto.setTaxDeductions(payroll.getTaxDeductions());
        dto.setOtherDeductions(payroll.getOtherDeductions());
        dto.setTotalDeductions(payroll.getTotalDeductions());
        dto.setNetSalary(payroll.getNetSalary());
        dto.setLopDays(payroll.getLopDays());
        dto.setOvertimeHours(payroll.getOvertimeHours());
        dto.setStatus(payroll.getStatus());
        dto.setPaymentDate(payroll.getPaymentDate());
        dto.setPayslipGenerated(payroll.getPayslipGenerated());
        dto.setPayslipPath(payroll.getPayslipPath());
        dto.setAutoGenerated(payroll.getAutoGenerated());
        dto.setRemarks(payroll.getRemarks());
        dto.setCreatedAt(payroll.getCreatedAt());
        dto.setEarnings(new ArrayList<>());
        dto.setDeductions(new ArrayList<>());

        User user = userRepository.findById(payroll.getUserId()).orElse(null);
        if (user == null) {
            dto.setEmployeeId("N/A");
            dto.setEmployeeName(payroll.getUserName() != null ? payroll.getUserName() : "Unknown");
            return dto;
        }

        dto.setEmployeeId(user.getEmployeeId() != null ? user.getEmployeeId() : "EMP-" + user.getId());
        dto.setEmployeeName(user.getFullName());
        dto.setJoiningDate(user.getCreatedAt());
        dto.setDateOfJoining(user.getJoiningDate());
        dto.setDepartment(user.getDepartment());
        dto.setDesignation(user.getPosition());
        dto.setTenantCode(user.getTenantCode());
        dto.setCompanyId(user.getCompanyId());
        dto.setCompanyName(user.getCompanyName());
        dto.setSource(Boolean.TRUE.equals(payroll.getAutoGenerated())
                ? "Auto Generated" : "Manual Entry");

        if (payroll.getPayrollMonth() != null) {
            dto.setPayPeriod(payroll.getPayrollMonth().format(MONTH_YEAR));
            dto.setPayDate((payroll.getPaymentDate() != null
                    ? payroll.getPaymentDate()
                    : payroll.getPayrollMonth()).format(DATE_FMT));
        }

        int workingDays = extractWorkingDays(payroll.getRemarks());
        int lopDays = payroll.getLopDays() != null ? payroll.getLopDays() : 0;
        dto.setWorkingDays(workingDays);
        dto.setPaidDays(Math.max(workingDays - lopDays, 0));

        EmployeeSalaryDetail salaryDetail = employeeSalaryDetailRepository
                .findByUserIdAndTenantCode(user.getId(), user.getTenantCode())
                .orElse(null);
        EmployeeBankDetail bankDetail = employeeBankDetailRepository
                .findByUserIdAndTenantCode(user.getId(), user.getTenantCode())
                .orElse(null);
        if (salaryDetail != null) {
            dto.setPanNumber(salaryDetail.getPanNumber());
            dto.setUanNumber(salaryDetail.getPfUan());
            dto.setPfNumber(salaryDetail.getPfUan());
            dto.setEsiNumber(salaryDetail.getEsiNumber());
        }

        if (bankDetail != null) {
            dto.setBankName(bankDetail.getBankName());
            dto.setAccountNumber(bankDetail.getAccountNumber());
            dto.setIfscCode(bankDetail.getIfscCode());
            dto.setBranchName(bankDetail.getBranchName());
        }

        List<PayrollItem> items = payrollItemRepository.findByPayrollIdOrderByIdAsc(payroll.getId());
        if (!items.isEmpty()) {
            dto.setEarnings(items.stream()
                    .filter(item -> item.getComponentType() != null
                            && item.getComponentType() != com.samayahr.entity.EmployeeSalaryComponent.ComponentType.DEDUCTION)
                    .map(this::toPayrollItemResponse)
                    .collect(Collectors.toList()));
            dto.setDeductions(items.stream()
                    .filter(item -> item.getComponentType() == com.samayahr.entity.EmployeeSalaryComponent.ComponentType.DEDUCTION)
                    .map(this::toPayrollItemResponse)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private PayrollItemResponse toPayrollItemResponse(PayrollItem item) {
        return new PayrollItemResponse(
                item.getComponentName(),
                item.getComponentKey(),
                item.getComponentType() != null ? item.getComponentType().name() : null,
                item.getAmount());
    }

    private void mapRequestToEntity(PayrollRequest request,
                                    PayrollHistory payroll,
                                    User employee) {
        payroll.setUserId(employee.getId());
        payroll.setUserName(employee.getFullName());
        payroll.setPayrollMonth(request.getPayrollMonth());
        payroll.setBasicSalary(safe(request.getBasicSalary()));
        payroll.setHra(safe(request.getHra()));
        payroll.setSpecialAllowance(safe(request.getSpecialAllowance()));
        payroll.setConveyanceAllowance(safe(request.getConveyanceAllowance()));
        payroll.setMedicalAllowance(safe(request.getMedicalAllowance()));
        payroll.setLta(safe(request.getLta()));
        payroll.setOtherAllowances(safe(request.getOtherAllowances()));
        payroll.setPfEmployee(safe(request.getPfEmployee()));
        payroll.setEsiEmployee(safe(request.getEsiEmployee()));
        payroll.setProfessionalTax(safe(request.getProfessionalTax()));
        payroll.setTaxDeductions(safe(request.getTaxDeductions()));
        payroll.setOtherDeductions(safe(request.getOtherDeductions()));
        payroll.setLopDays(request.getLopDays());
        payroll.setOvertimeHours(request.getOvertimeHours());
        payroll.setAutoGenerated(request.getAutoGenerated());
        payroll.setTotalEarnings(safe(request.getTotalEarnings()));
        payroll.setTotalDeductions(safe(request.getTotalDeductions()));
        payroll.setNetSalary(safe(request.getNetSalary()));
        payroll.setRemarks(request.getNotes());
    }

    private PayrollHistory getAccessiblePayroll(Long payrollId) {
        User actor = requireCurrentUser();
        PayrollHistory payroll = payrollHistoryRepository.findById(payrollId)
                .orElseThrow(() -> new RuntimeException(
                        "Payroll not found with id: " + payrollId));

        if (actor.getRole() == User.Role.GLOBAL_ADMIN) {
            return payroll;
        }

        User employee = userRepository.findById(payroll.getUserId())
                .orElseThrow(() -> new RuntimeException("Employee not found for payroll"));
        validateUserAccess(actor, employee);
        return payroll;
    }

    private User validatePayrollWriteRequest(User actor, PayrollRequest request) {
        if (request.getUserId() == null) {
            throw new RuntimeException("Employee is required");
        }

        User employee = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        validateUserAccess(actor, employee);
        return employee;
    }

    private void validateUserAccess(User actor, User target) {
        if (actor.getRole() == User.Role.GLOBAL_ADMIN) {
            return;
        }

        boolean sameTenant = actor.getTenantCode() != null
                && actor.getTenantCode().equals(target.getTenantCode());
        boolean sameCompany = actor.getCompanyId() != null
                && actor.getCompanyId().equals(target.getCompanyId());

        if (!sameTenant || !sameCompany) {
            throw new RuntimeException("Access denied for another company");
        }

        boolean self = actor.getId().equals(target.getId());
        boolean admin = actor.getRole() == User.Role.SUPER_ADMIN
                || actor.getRole() == User.Role.COMPANY_ADMIN
                || actor.getRole() == User.Role.ADMIN;

        if (!self && !admin) {
            throw new RuntimeException("Access denied for another employee");
        }
    }

    private User requireCurrentUser() {
        return userService.getCurrentUser();
    }

    private BigDecimal safe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private int extractWorkingDays(String remarks) {
        if (remarks == null || remarks.isBlank()) {
            return 30;
        }

        Matcher matcher = WORKING_DAYS_PATTERN.matcher(remarks);
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group(1));
            } catch (NumberFormatException ignored) {
            }
        }

        return 30;
    }
}
