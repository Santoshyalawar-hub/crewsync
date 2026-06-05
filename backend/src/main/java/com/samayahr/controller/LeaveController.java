package com.samayahr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.Leave;
import com.samayahr.entity.LeaveBalance;
import com.samayahr.service.LeaveBalanceService;
import com.samayahr.service.LeaveService;
import com.samayahr.service.UserService;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    // ── NEW: Leave balance ────────────────────────────────────────────────────
    @Autowired
    private LeaveBalanceService leaveBalanceService;

    @Autowired
    private UserService userService;

    // ========== EXISTING ENDPOINTS (unchanged) ==========

    @GetMapping("/my-leaves")
    public ResponseEntity<ApiResponse<List<Leave>>> getMyLeaves() {
        try {
            List<Leave> leaves = leaveService.getMyLeaves();
            return ResponseEntity.ok(
                    ApiResponse.success("Leaves fetched", leaves));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<Leave>>> getAllLeaves() {
        try {
            List<Leave> leaves = leaveService.getAllLeaves();
            return ResponseEntity.ok(
                    ApiResponse.success("All leaves fetched", leaves));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<Leave>>> getPendingLeaves() {
        try {
            List<Leave> leaves = leaveService.getPendingLeaves();
            return ResponseEntity.ok(
                    ApiResponse.success("Pending leaves fetched", leaves));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Leave>> getLeaveById(
            @PathVariable Long id) {
        try {
            Leave leave = leaveService.getLeaveById(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Leave fetched", leave));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<Leave>> applyLeave(
            @RequestBody Leave leave) {
        try {
            Leave created = leaveService.applyLeave(leave);
            return ResponseEntity.ok(
                    ApiResponse.success("Leave applied successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Leave>> approveLeave(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        try {
            Long reviewedBy = request.get("reviewedBy");
            Leave approved = leaveService.approveLeave(id, reviewedBy);
            return ResponseEntity.ok(
                    ApiResponse.success("Leave approved", approved));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Leave>> rejectLeave(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long reviewedBy = Long.parseLong(
                    request.get("reviewedBy").toString());
            String reason = (String) request.get("reason");
            Leave rejected = leaveService.rejectLeave(id, reviewedBy, reason);
            return ResponseEntity.ok(
                    ApiResponse.success("Leave rejected", rejected));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteLeave(
            @PathVariable Long id) {
        try {
            leaveService.deleteLeave(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Leave deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<Leave>>> getLeavesByUserId(
            @PathVariable Long userId) {
        try {
            List<Leave> leaves = leaveService.getLeavesByUserId(userId);
            return ResponseEntity.ok(
                    ApiResponse.success("User leaves fetched", leaves));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ========== NEW: LEAVE BALANCE ENDPOINTS ==========

    /**
     * GET /api/leaves/my-balance
     *
     * Employee sees their own leave balance for the current year.
     *
     * Response:
     * [
     *   { "leaveType": "EARNED",  "totalEntitled": 12,
     *     "used": 2, "pending": 1, "available": 9 },
     *   { "leaveType": "SICK",    "totalEntitled": 7,
     *     "used": 0, "pending": 0, "available": 7 },
     *   { "leaveType": "CASUAL",  "totalEntitled": 7,
     *     "used": 1, "pending": 0, "available": 6 }
     * ]
     */
    @GetMapping("/my-balance")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> getMyBalance() {
        try {
            Long currentUserId = userService.getCurrentUser().getId();
            List<LeaveBalance> balances =
                    leaveBalanceService.getBalancesForEmployee(currentUserId);
            return ResponseEntity.ok(
                    ApiResponse.success("Leave balance fetched", balances));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/leaves/balance/{userId}
     *
     * Admin views leave balance for any employee (tenant-scoped).
     *
     * Header: X-Tenant-Code
     */
    @GetMapping("/balance/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> getBalanceForEmployee(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            List<LeaveBalance> balances =
                    leaveBalanceService.getBalancesForEmployee(userId);
            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Employee leave balance fetched", balances));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PUT /api/leaves/balance/{userId}/set
     *
     * Admin sets a custom leave entitlement for one employee.
     * Example: give an employee 15 earned leaves instead of default 12.
     *
     * Header: X-Tenant-Code
     *
     * Body:
     * {
     *   "leaveType": "EARNED",
     *   "days": 15
     * }
     *
     * Valid leaveType values:
     *   EARNED | SICK | CASUAL | MATERNITY | PATERNITY | COMPENSATORY
     */
    @PutMapping("/balance/{userId}/set")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveBalance>> setEntitlement(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody Map<String, Object> body) {
        try {
            String leaveType = (String) body.get("leaveType");
            double days = Double.parseDouble(body.get("days").toString());

            if (leaveType == null || leaveType.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("leaveType is required"));
            if (days < 0)
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("days cannot be negative"));

            LeaveBalance balance = leaveBalanceService
                    .setEntitlement(userId, leaveType, days, tenantCode);
            return ResponseEntity.ok(
                    ApiResponse.success("Leave entitlement updated", balance));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/leaves/balance/{userId}/init
     *
     * Manually initialises leave balances for an existing employee
     * who was created before this feature was added.
     * Safe to call multiple times — skips types that already exist.
     *
     * Header: X-Tenant-Code
     */
    @PostMapping("/balance/{userId}/init")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> initBalances(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            com.samayahr.entity.User employee =
                    userService.getUserById(userId);

            if (!tenantCode.equals(employee.getTenantCode()))
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(
                                "Access denied: employee does not belong "
                                + "to your company"));

            leaveBalanceService.initialiseForEmployee(employee);

            List<LeaveBalance> balances =
                    leaveBalanceService.getBalancesForEmployee(userId);
            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Leave balances initialised", balances));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/leaves/balance/tenant/all?year=2025
     *
     * Admin views leave balances for ALL employees in the company.
     * Useful for HR planning and overview.
     *
     * Headers:
     *   X-Tenant-Code
     *   X-Company-Id
     */
    @GetMapping("/balance/tenant/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> getAllByTenant(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestParam(defaultValue = "0") int year) {
        try {
            int targetYear = year > 0
                    ? year : java.time.LocalDate.now().getYear();

            List<LeaveBalance> balances =
                    leaveBalanceService.getAllBalancesForTenant(
                            tenantCode, companyId, targetYear);
            return ResponseEntity.ok(
                    ApiResponse.success("All leave balances fetched",
                            balances));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/leaves/balance/carry-forward
     *
     * Year-end: carries unused EARNED leave (max 30 days) to next year.
     * Run once on January 1st each year.
     *
     * Header: X-Tenant-Code
     *
     * Body: { "fromYear": 2024 }
     */
    // ── Admin leave summary (called by AdminDashboard) ────────────────────────
    @GetMapping("/admin/summary")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getAdminLeaveSummary(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode) {
        try {
            List<Leave> all = leaveService.getAllLeaves();
            Map<String, Long> summary = new java.util.HashMap<>();
            summary.put("sickLeave",    all.stream().filter(l -> l.getLeaveType() != null && l.getLeaveType().toUpperCase().contains("SICK")).count());
            summary.put("casualLeave",  all.stream().filter(l -> l.getLeaveType() != null && l.getLeaveType().toUpperCase().contains("CASUAL")).count());
            summary.put("earnedLeave",  all.stream().filter(l -> l.getLeaveType() != null && (l.getLeaveType().toUpperCase().contains("ANNUAL") || l.getLeaveType().toUpperCase().contains("EARNED"))).count());
            summary.put("unpaidLeave",  all.stream().filter(l -> l.getLeaveType() != null && l.getLeaveType().toUpperCase().contains("UNPAID")).count());
            return ResponseEntity.ok(ApiResponse.success("Leave summary fetched", summary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/balance/carry-forward")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<String>> processCarryForward(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody Map<String, Object> body) {
        try {
            int fromYear = body.get("fromYear") != null
                    ? Integer.parseInt(body.get("fromYear").toString())
                    : java.time.LocalDate.now().getYear() - 1;

            leaveBalanceService.processYearEndCarryForward(
                    tenantCode, fromYear);

            return ResponseEntity.ok(ApiResponse.success(
                    "Carry forward processed: "
                    + fromYear + " → " + (fromYear + 1), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}