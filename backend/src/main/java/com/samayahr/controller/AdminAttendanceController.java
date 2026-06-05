package com.samayahr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.samayahr.dto.request.ApplyLeaveRequest;
import com.samayahr.dto.request.AttendanceRequest;
import com.samayahr.dto.request.BulkActionRequest;
import com.samayahr.dto.request.ManualAttendanceRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.dto.response.DashboardStatsResponse;
import com.samayahr.service.AdminAttendanceService;
import com.samayahr.service.AttendanceService;

@RestController
@RequestMapping("/api/admin/attendance")
@CrossOrigin(origins = "*")
public class AdminAttendanceController {

    @Autowired
    private AdminAttendanceService adminAttendanceService;

    // ── NEW: inject AttendanceService for the monthly/payroll methods ──
    @Autowired
    private AttendanceService attendanceService;

    // ─────────────────────────────────────────────────────────────
    //  TENANT HELPERS
    // ─────────────────────────────────────────────────────────────

    private String resolveTenantCode(String header, String param) {
        String t = (header != null && !header.isBlank()) ? header : param;
        if (t == null || t.isBlank()) throw new RuntimeException("tenantCode is required");
        return t;
    }

    private Long resolveCompanyId(Long header, Long param) {
        Long c = header != null ? header : param;
        if (c == null) throw new RuntimeException("companyId is required");
        return c;
    }

    // ─────────────────────────────────────────────────────────────
    //  LIVE / DASHBOARD
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/live")
    public ResponseEntity<ApiResponse<?>> getLiveAttendance(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestHeader(value = "X-Company-Id",  required = false) Long   companyHeader,
            @RequestParam(value = "tenantCode",      required = false) String tenantParam,
            @RequestParam(value = "companyId",        required = false) Long   companyParam) {
        try {
            String tc = resolveTenantCode(tenantHeader, tenantParam);
            Long   ci = resolveCompanyId(companyHeader, companyParam);
            return ResponseEntity.ok(ApiResponse.success("Live attendance fetched",
                    adminAttendanceService.getLiveAttendance(tc, ci)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/live-employees")
    public ResponseEntity<ApiResponse<?>> getLiveAttendanceAlias(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestHeader(value = "X-Company-Id",  required = false) Long   companyHeader,
            @RequestParam(value = "tenantCode",      required = false) String tenantParam,
            @RequestParam(value = "companyId",        required = false) Long   companyParam) {
        String tc = resolveTenantCode(tenantHeader, tenantParam);
        Long   ci = resolveCompanyId(companyHeader, companyParam);
        return ResponseEntity.ok(ApiResponse.success("Live attendance fetched",
                adminAttendanceService.getLiveAttendance(tc, ci)));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestHeader(value = "X-Company-Id",  required = false) Long   companyHeader,
            @RequestParam(value = "tenantCode",      required = false) String tenantParam,
            @RequestParam(value = "companyId",        required = false) Long   companyParam) {
        try {
            String tc = resolveTenantCode(tenantHeader, tenantParam);
            Long   ci = resolveCompanyId(companyHeader, companyParam);
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched",
                    adminAttendanceService.getDashboardStats(tc, ci)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  MONTHLY ATTENDANCE  (admin view — delegates to AttendanceService)
    // ─────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/attendance/monthly/all
     * Returns monthly attendance for ALL employees in a tenant+company.
     * Used by the admin monthly table view and CSV/PDF export.
     */
    @GetMapping("/monthly/all")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMonthlyAttendanceAll(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestHeader(value = "X-Company-Id",  required = false) Long   companyHeader,
            @RequestParam(value = "tenantCode",      required = false) String tenantParam,
            @RequestParam(value = "companyId",        required = false) Long   companyParam) {
        try {
            String tc = resolveTenantCode(tenantHeader, tenantParam);
            Long   ci = resolveCompanyId(companyHeader, companyParam);
            List<Map<String, Object>> data =
                    attendanceService.getMonthlyAttendanceForAllEmployees(year, month, tc, ci);
            return ResponseEntity.ok(ApiResponse.success("Monthly attendance fetched", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/admin/attendance/monthly/department
     * Returns monthly attendance grouped by department.
     */
    @GetMapping("/monthly/department")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyAttendanceByDept(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestHeader(value = "X-Company-Id",  required = false) Long   companyHeader,
            @RequestParam(value = "tenantCode",      required = false) String tenantParam,
            @RequestParam(value = "companyId",        required = false) Long   companyParam) {
        try {
            String tc = resolveTenantCode(tenantHeader, tenantParam);
            Long   ci = resolveCompanyId(companyHeader, companyParam);
            Map<String, Object> data =
                    attendanceService.getMonthlyAttendanceByDepartment(year, month, tc, ci);
            return ResponseEntity.ok(ApiResponse.success("Monthly attendance by dept fetched", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/admin/attendance/monthly/employee/{employeeId}
     * Returns monthly summary for a single employee (tenant-validated).
     */
    @GetMapping("/monthly/employee/{employeeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyAttendanceForEmployee(
            @PathVariable Long employeeId,
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestParam(value = "tenantCode",      required = false) String tenantParam) {
        try {
            String tc = resolveTenantCode(tenantHeader, tenantParam);
            Map<String, Object> data =
                    attendanceService.getMonthlyAttendanceForEmployee(employeeId, year, month, tc);
            return ResponseEntity.ok(ApiResponse.success("Employee monthly attendance fetched", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/admin/attendance/payroll/employee/{employeeId}
     * Payroll-ready: summary + day-by-day breakdown with effectiveValue.
     */
    @GetMapping("/payroll/employee/{employeeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPayrollAttendance(
            @PathVariable Long employeeId,
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestParam(value = "tenantCode",      required = false) String tenantParam) {
        try {
            String tc = resolveTenantCode(tenantHeader, tenantParam);
            Map<String, Object> data =
                    attendanceService.getPayrollAttendanceForEmployee(employeeId, year, month, tc);
            return ResponseEntity.ok(ApiResponse.success("Payroll attendance fetched", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  TIMESHEETS
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/timesheets")
    public ResponseEntity<ApiResponse<?>> getTimesheets(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestHeader(value = "X-Company-Id",  required = false) Long   companyHeader,
            @RequestParam(value = "tenantCode",      required = false) String tenantParam,
            @RequestParam(value = "companyId",        required = false) Long   companyParam) {
        try {
            String tc = resolveTenantCode(tenantHeader, tenantParam);
            Long   ci = resolveCompanyId(companyHeader, companyParam);
            return ResponseEntity.ok(ApiResponse.success("Timesheets fetched",
                    adminAttendanceService.getTimesheets(tc, ci)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllTimesheets() {
        try {
            return ResponseEntity.ok(ApiResponse.success("Timesheets fetched",
                    adminAttendanceService.getAllTimesheets()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getTimesheetById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Timesheet fetched",
                    adminAttendanceService.getTimesheetById(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/timesheets/{id}")
    public ResponseEntity<ApiResponse<?>> updateTimesheet(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Timesheet updated",
                    adminAttendanceService.updateTimesheet(id, updates.get("task"), updates.get("remarks"))));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteTimesheet(@PathVariable Long id) {
        try {
            adminAttendanceService.deleteTimesheet(id);
            return ResponseEntity.ok(ApiResponse.success("Timesheet deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<?>> getTimesheetsByEmployee(@PathVariable Long employeeId) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Employee timesheets fetched",
                    adminAttendanceService.getTimesheetsByEmployee(employeeId)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  LEAVE MANAGEMENT
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/apply-leave/{id}")
    public ResponseEntity<ApiResponse<String>> applyLeave(
            @PathVariable Long id,
            @RequestBody ApplyLeaveRequest request) {
        try {
            adminAttendanceService.applyLeave(id, request.getStartDate(),
                    request.getEndDate(), request.getLeaveType(), request.getReason());
            return ResponseEntity.ok(ApiResponse.success("Leave applied", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/apply-leave-all")
    public ResponseEntity<ApiResponse<String>> applyLeaveAll(@RequestBody ApplyLeaveRequest request) {
        try {
            adminAttendanceService.applyLeaveAll(request.getStartDate(),
                    request.getEndDate(), request.getLeaveType(), request.getReason());
            return ResponseEntity.ok(ApiResponse.success("Leave applied for all", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  PENDING / APPROVE / REJECT
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/pending-requests")
    public ResponseEntity<ApiResponse<?>> getPendingRequests() {
        try {
            return ResponseEntity.ok(ApiResponse.success("Pending requests fetched",
                    adminAttendanceService.getPendingRequests()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/approve-request/{id}")
    public ResponseEntity<ApiResponse<String>> approveRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            adminAttendanceService.approveRequest(id, body.get("type"));
            return ResponseEntity.ok(ApiResponse.success("Request approved", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/reject-request/{id}")
    public ResponseEntity<ApiResponse<String>> rejectRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            adminAttendanceService.rejectRequest(id, body.get("type"), body.get("reason"));
            return ResponseEntity.ok(ApiResponse.success("Request rejected", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  MANUAL ATTENDANCE
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/apply-manual-attendance/{employeeId}")
    public ResponseEntity<ApiResponse<String>> applyManualAttendance(
            @PathVariable Long employeeId,
            @RequestBody ManualAttendanceRequest request) {
        try {
            adminAttendanceService.applyManualAttendance(employeeId, request);
            return ResponseEntity.ok(ApiResponse.success("Manual attendance applied", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/update-manual-attendance/{employeeId}")
    public ResponseEntity<ApiResponse<String>> updateManualAttendance(
            @PathVariable Long employeeId,
            @RequestBody ManualAttendanceRequest request) {
        try {
            adminAttendanceService.updateManualAttendance(employeeId, request);
            return ResponseEntity.ok(ApiResponse.success("Attendance updated", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  FORCE PUNCH
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/force-punch")
    public ResponseEntity<ApiResponse<String>> forcePunch(@RequestBody AttendanceRequest request) {
        try {
            if ("punch_in".equals(request.getAction())) {
                adminAttendanceService.forcePunchIn(request.getEmployeeId(), request.getTimestamp());
            } else if ("punch_out".equals(request.getAction())) {
                adminAttendanceService.forcePunchOut(request.getEmployeeId(), request.getTimestamp());
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid action"));
            }
            return ResponseEntity.ok(ApiResponse.success("Force punch successful", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  RECORDS / CALENDAR / ANALYTICS / USERS
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/records")
    public ResponseEntity<ApiResponse<?>> getRecords(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Records fetched",
                    adminAttendanceService.getRecords(userId, date, status, startDate, endDate)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<?>> getCalendar(
            @RequestParam Long userId,
            @RequestParam Integer year,
            @RequestParam Integer month) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Calendar data fetched",
                    adminAttendanceService.getCalendar(userId, year, month)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<?>> getAttendanceAnalytics() {
        try {
            return ResponseEntity.ok(ApiResponse.success("Analytics fetched",
                    adminAttendanceService.getAttendanceAnalytics()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getUsers() {
        try {
            return ResponseEntity.ok(ApiResponse.success("Users fetched",
                    adminAttendanceService.getUsers()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  BULK ACTION
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/bulk-action")
    public ResponseEntity<ApiResponse<String>> applyBulkAction(@RequestBody BulkActionRequest request) {
        try {
            adminAttendanceService.applyBulkActionForUser(request);
            return ResponseEntity.ok(ApiResponse.success("Bulk action applied", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  REPORTS (legacy)
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<?>> getReports(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Reports fetched",
                    adminAttendanceService.getReports(month, year)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  ADMIN USER MANAGEMENT
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/admins")
    public ResponseEntity<ApiResponse<?>> getAllAdmins() {
        try {
            return ResponseEntity.ok(ApiResponse.success("Admins fetched",
                    adminAttendanceService.getAllAdmins()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<ApiResponse<?>> getAdminById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Admin fetched",
                    adminAttendanceService.getAdminById(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<ApiResponse<String>> updateAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updateData) {
        try {
            adminAttendanceService.updateAdmin(id,
                    (String) updateData.get("fullName"),
                    (String) updateData.get("email"),
                    (String) updateData.get("phone"),
                    (String) updateData.get("department"),
                    (String) updateData.get("position"),
                    (Boolean) updateData.get("isAdmin"));
            return ResponseEntity.ok(ApiResponse.success("Admin updated", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAdmin(@PathVariable Long id) {
        try {
            adminAttendanceService.deleteAdmin(id);
            return ResponseEntity.ok(ApiResponse.success("Admin deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  WEEKLY ATTENDANCE (dashboard sparkline)
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<?>> getWeeklyAttendance(
            @RequestParam String from,
            @RequestParam String to,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode) {
        try {
            List<Map<String, Object>> weekly = adminAttendanceService.getWeeklyAttendance(from, to, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Weekly attendance fetched", weekly));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
