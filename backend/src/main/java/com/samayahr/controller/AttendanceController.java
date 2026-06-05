package com.samayahr.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.samayahr.dto.request.AttendanceRequest;
import com.samayahr.dto.request.LeaveRequest;
import com.samayahr.dto.request.TimesheetRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.dto.response.AttendanceResponse;
import com.samayahr.entity.AttendanceSession;
import com.samayahr.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // ─────────────────────────────────────────────────────────────
    //  CLOCK IN / OUT
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/start-work")
    public ResponseEntity<ApiResponse<AttendanceSession>> startWork(
            @RequestBody AttendanceRequest request) {
        try {
            AttendanceSession session = attendanceService.startWork(request.getEmployeeId());
            return ResponseEntity.ok(ApiResponse.success("Work session started successfully", session));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/break-start")
    public ResponseEntity<ApiResponse<String>> breakStart(
            @RequestBody AttendanceRequest request) {
        try {
            attendanceService.startBreak(request.getEmployeeId());
            return ResponseEntity.ok(ApiResponse.success("Break started successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/break-resume")
    public ResponseEntity<ApiResponse<String>> breakResume(
            @RequestBody AttendanceRequest request) {
        try {
            attendanceService.resumeWork(request.getEmployeeId());
            return ResponseEntity.ok(ApiResponse.success("Work resumed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/end-work")
    public ResponseEntity<ApiResponse<AttendanceSession>> endWork(
            @RequestBody AttendanceRequest request) {
        try {
            AttendanceSession session = attendanceService.endWork(request.getEmployeeId());
            return ResponseEntity.ok(ApiResponse.success("Work session ended successfully", session));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  TIMESHEET
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/save-timesheet")
    public ResponseEntity<ApiResponse<String>> saveTimesheet(
            @RequestBody TimesheetRequest request) {
        try {
            attendanceService.saveTimesheet(request);
            return ResponseEntity.ok(ApiResponse.success("Timesheet submitted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  TODAY / CALENDAR / SUMMARY
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/today/{employeeId}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getTodayAttendance(
            @PathVariable Long employeeId) {
        try {
            AttendanceResponse response = attendanceService.getTodayAttendance(employeeId);
            return ResponseEntity.ok(ApiResponse.success("Today's attendance fetched", response));
        } catch (Exception e) {
            // ── FIX: Never return 500/400 for today-status — return a safe default
            // so the frontend doesn't crash trying to parse an error body as AttendanceResponse
            AttendanceResponse fallback = new AttendanceResponse();
            fallback.setStatus("not_started");
            fallback.setMessage("Could not fetch today's attendance: " + e.getMessage());
            return ResponseEntity.ok(ApiResponse.success("Today's attendance (fallback)", fallback));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  CALENDAR
    //
    //  FIX: On ANY exception we return a valid empty calendar structure
    //  (HTTP 200 with empty days array) instead of HTTP 400/500.
    //
    //  Why: the frontend calls this endpoint for EVERY visible month and
    //  retries on failure — a 500 triggers a re-render which triggers
    //  another call, creating the infinite request loop seen in the console.
    //  Returning 200 + empty data breaks that loop immediately.
    // ─────────────────────────────────────────────────────────────
    @GetMapping("/calendar/{employeeId}/{year}/{month}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCalendarData(
            @PathVariable Long    employeeId,
            @PathVariable Integer year,
            @PathVariable Integer month) {
        try {
            Map<String, Object> calendarData =
                    attendanceService.getCalendarData(employeeId, year, month);
            return ResponseEntity.ok(ApiResponse.success("Calendar data fetched", calendarData));
        } catch (Exception e) {
            System.err.println("[AttendanceController] getCalendarData error for employee="
                    + employeeId + " year=" + year + " month=" + month
                    + " → " + e.getMessage());
            // Return empty-but-valid calendar so frontend renders blank month without crashing
            Map<String, Object> empty = new HashMap<>();
            empty.put("year",      year);
            empty.put("month",     month);
            empty.put("monthName", "");
            empty.put("days",      new ArrayList<>());
            return ResponseEntity.ok(ApiResponse.success("Calendar data (empty fallback)", empty));
        }
    }

    @GetMapping("/summary/{employeeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAttendanceSummary(
            @PathVariable Long employeeId) {
        try {
            Map<String, Object> summary = attendanceService.getAttendanceSummary(employeeId);
            return ResponseEntity.ok(ApiResponse.success("Summary fetched", summary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  MONTHLY ATTENDANCE  (existing — backward compat)
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyAttendance(
            @RequestParam Long    employeeId,
            @RequestParam Integer year,
            @RequestParam Integer month) {
        try {
            Map<String, Object> monthlyData =
                    attendanceService.getMonthlyAttendance(employeeId, year, month);
            return ResponseEntity.ok(ApiResponse.success("Monthly attendance fetched", monthlyData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  MONTHLY ATTENDANCE — tenant-aware (new endpoints)
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/monthly/employee/{employeeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyAttendanceForEmployee(
            @PathVariable Long    employeeId,
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam String  tenantCode) {
        try {
            Map<String, Object> data = attendanceService
                    .getMonthlyAttendanceForEmployee(employeeId, year, month, tenantCode);
            return ResponseEntity.ok(
                    ApiResponse.success("Monthly attendance fetched for employee", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/monthly/all")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMonthlyAttendanceForAll(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam String  tenantCode,
            @RequestParam Long    companyId) {
        try {
            List<Map<String, Object>> data = attendanceService
                    .getMonthlyAttendanceForAllEmployees(year, month, tenantCode, companyId);
            return ResponseEntity.ok(
                    ApiResponse.success("Monthly attendance fetched for all employees", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/monthly/department")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyAttendanceByDepartment(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam String  tenantCode,
            @RequestParam Long    companyId) {
        try {
            Map<String, Object> data = attendanceService
                    .getMonthlyAttendanceByDepartment(year, month, tenantCode, companyId);
            return ResponseEntity.ok(
                    ApiResponse.success("Monthly attendance by department fetched", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/payroll/employee/{employeeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPayrollAttendance(
            @PathVariable Long    employeeId,
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam String  tenantCode) {
        try {
            Map<String, Object> data = attendanceService
                    .getPayrollAttendanceForEmployee(employeeId, year, month, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Payroll attendance fetched", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  LEAVE & CORRECTION REQUESTS
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/leave-request")
    public ResponseEntity<ApiResponse<String>> submitLeaveRequest(
            @RequestBody LeaveRequest request) {
        try {
            attendanceService.submitLeaveRequest(request);
            return ResponseEntity.ok(
                    ApiResponse.success("Leave request submitted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/correction-request")
    public ResponseEntity<ApiResponse<String>> submitCorrectionRequest(
            @RequestBody AttendanceRequest request) {
        try {
            attendanceService.submitCorrectionRequest(request);
            return ResponseEntity.ok(
                    ApiResponse.success("Correction request submitted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  ATTENDANCE HISTORY
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/history/{employeeId}")
    public ResponseEntity<ApiResponse<List<AttendanceSession>>> getAttendanceHistory(
            @PathVariable Long   employeeId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<AttendanceSession> history =
                    attendanceService.getAttendanceHistory(employeeId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success("Attendance history fetched", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}