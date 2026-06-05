package com.samayahr.controller;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.PayrollHistory;
import com.samayahr.service.AutoPayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AutoPayrollController
 *
 * All endpoints are tenant-scoped via X-Tenant-Code header.
 *
 * Endpoints:
 *   POST /api/auto-payroll/employee/{id}          — single employee
 *   POST /api/auto-payroll/all                    — all employees in company
 *   POST /api/auto-payroll/department/{dept}      — department-wise
 *   POST /api/auto-payroll/employee/{id}/payslip  — regenerate payslip PDF only
 */
@RestController
@RequestMapping("/api/auto-payroll")
@CrossOrigin(origins = "*")
public class AutoPayrollController {

    @Autowired
    private AutoPayrollService autoPayrollService;

    // ── Single employee ───────────────────────────────────────────────────────

    /**
     * POST /api/auto-payroll/employee/{employeeId}
     *
     * Headers:
     *   X-Tenant-Code : <tenantCode>
     *
     * Body (JSON):
     * {
     *   "year"        : 2025,
     *   "month"       : 6,
     *   "generatePdf" : true
     * }
     *
     * Response: PayrollHistory record with netSalary, lopDays, payslipUrl
     */
    @PostMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<PayrollHistory>> generateForEmployee(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody Map<String, Object> body) {
        try {
            int     year        = toInt(body.get("year"),  currentYear());
            int     month       = toInt(body.get("month"), currentMonth());
            boolean generatePdf = toBool(body.get("generatePdf"), true);

            PayrollHistory result = autoPayrollService
                    .generateForEmployee(employeeId, year, month,
                            tenantCode, generatePdf);

            return ResponseEntity.ok(ApiResponse.success(
                    "Payroll generated for employee", result));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── All employees ─────────────────────────────────────────────────────────

    /**
     * POST /api/auto-payroll/all
     *
     * Headers:
     *   X-Tenant-Code : <tenantCode>
     *   X-Company-Id  : <companyId>
     *
     * Body (JSON):
     * {
     *   "year"        : 2025,
     *   "month"       : 6,
     *   "generatePdf" : true
     * }
     *
     * Response: List of per-employee results with status SUCCESS / SKIPPED / FAILED
     */
    @PostMapping("/all")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> generateForAll(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestHeader("X-Company-Id")  Long companyId,
            @RequestBody Map<String, Object> body) {
        try {
            int     year        = toInt(body.get("year"),  currentYear());
            int     month       = toInt(body.get("month"), currentMonth());
            boolean generatePdf = toBool(body.get("generatePdf"), false);

            List<Map<String, Object>> results = autoPayrollService
                    .generateForAll(year, month, tenantCode, companyId, generatePdf);

            long success = results.stream()
                    .filter(r -> "SUCCESS".equals(r.get("status"))).count();
            long skipped = results.stream()
                    .filter(r -> "SKIPPED".equals(r.get("status"))).count();
            long failed  = results.stream()
                    .filter(r -> "FAILED".equals(r.get("status"))).count();

            String summary = String.format(
                    "Payroll batch complete — Success: %d | Skipped: %d | Failed: %d",
                    success, skipped, failed);

            return ResponseEntity.ok(ApiResponse.success(summary, results));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Department-wise ───────────────────────────────────────────────────────

    /**
     * POST /api/auto-payroll/department/{department}
     *
     * Headers:
     *   X-Tenant-Code : <tenantCode>
     *   X-Company-Id  : <companyId>
     *
     * Body (JSON):
     * {
     *   "year"        : 2025,
     *   "month"       : 6,
     *   "generatePdf" : true
     * }
     */
    @PostMapping("/department/{department}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> generateForDepartment(
            @PathVariable String department,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestHeader("X-Company-Id")  Long companyId,
            @RequestBody Map<String, Object> body) {
        try {
            int     year        = toInt(body.get("year"),  currentYear());
            int     month       = toInt(body.get("month"), currentMonth());
            boolean generatePdf = toBool(body.get("generatePdf"), false);

            List<Map<String, Object>> results = autoPayrollService
                    .generateForDepartment(year, month, tenantCode,
                            companyId, department, generatePdf);

            long success = results.stream()
                    .filter(r -> "SUCCESS".equals(r.get("status"))).count();

            return ResponseEntity.ok(ApiResponse.success(
                    "Department payroll complete — " + success
                    + " employees processed for " + department, results));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Regenerate payslip PDF only ───────────────────────────────────────────

    /**
     * POST /api/auto-payroll/employee/{employeeId}/payslip
     *
     * Regenerates the salary slip PDF for an existing payroll record
     * without recalculating the salary. Useful when company logo or
     * slip settings change after payroll is already processed.
     *
     * Body (JSON):
     * {
     *   "year"  : 2025,
     *   "month" : 6
     * }
     */
    @PostMapping("/employee/{employeeId}/payslip")
    public ResponseEntity<ApiResponse<Map<String, Object>>> regeneratePayslip(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody Map<String, Object> body) {
        try {
            int year  = toInt(body.get("year"),  currentYear());
            int month = toInt(body.get("month"), currentMonth());

            // Re-run with generatePdf=true — the service will find the existing
            // payroll record and only regenerate the PDF
            PayrollHistory result = autoPayrollService
                    .generateForEmployee(employeeId, year, month, tenantCode, true);

            Map<String, Object> response = Map.of(
                    "payrollId",  result.getId(),
                    "payslipUrl", result.getPayslipPath() != null
                            ? result.getPayslipPath() : ""
            );

            return ResponseEntity.ok(ApiResponse.success(
                    "Payslip regenerated successfully", response));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private int toInt(Object v, int def) {
        if (v == null) return def;
        try { return Integer.parseInt(v.toString()); }
        catch (Exception e) { return def; }
    }

    private boolean toBool(Object v, boolean def) {
        if (v == null) return def;
        if (v instanceof Boolean) return (Boolean) v;
        return Boolean.parseBoolean(v.toString());
    }

    private int currentYear()  { return java.time.LocalDate.now().getYear(); }
    private int currentMonth() { return java.time.LocalDate.now().getMonthValue(); }
}