package com.samayahr.controller;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.dto.response.LoginAccessStatusResponse;
import com.samayahr.entity.EmployeeLoginAccess;
import com.samayahr.service.EmployeeLoginAccessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/login-access")
@CrossOrigin(origins = "*")
public class EmployeeLoginAccessController {

    private static final Logger log =
            LoggerFactory.getLogger(EmployeeLoginAccessController.class);

    @Autowired
    private EmployeeLoginAccessService loginAccessService;

    // ── GET all employees' status for tenant ─────────────────────────────

    @GetMapping("/tenant")
    public ResponseEntity<ApiResponse<List<LoginAccessStatusResponse>>>
    getTenantStatus(@RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            List<LoginAccessStatusResponse> list =
                    loginAccessService.getStatusForTenant(tenantCode);
            return ResponseEntity.ok(
                    ApiResponse.success("Login access status fetched", list));
        } catch (Exception e) {
            log.error("getTenantStatus error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── GET single employee status ────────────────────────────────────────

    @GetMapping("/employee/{userId}")
    public ResponseEntity<ApiResponse<LoginAccessStatusResponse>>
    getEmployeeStatus(@PathVariable Long userId,
                      @RequestHeader(value = "X-Tenant-Code",
                                     required = false) String tenantCode) {
        try {
            LoginAccessStatusResponse status =
                    loginAccessService.getStatusForEmployee(userId);
            return ResponseEntity.ok(ApiResponse.success("Status fetched", status));
        } catch (Exception e) {
            log.error("getEmployeeStatus error userId={}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── PUT toggle ELIGIBLE / NOT_ELIGIBLE ────────────────────────────────

    @PutMapping("/employee/{userId}/permission")
    public ResponseEntity<ApiResponse<LoginAccessStatusResponse>>
    updatePermission(@PathVariable Long userId,
                     @RequestHeader(value = "X-Tenant-Code",
                                    required = false) String tenantCode,
                     @RequestBody Map<String, String> body) {
        try {
            String raw = body.getOrDefault("permission", "").trim().toUpperCase();
            log.info("updatePermission: userId={}, tenantCode={}, permission={}",
                    userId, tenantCode, raw);

            if (raw.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("'permission' is required. Use ELIGIBLE or NOT_ELIGIBLE."));
            }

            EmployeeLoginAccess.LoginAccessPermission permission;
            try {
                permission = EmployeeLoginAccess.LoginAccessPermission.valueOf(raw);
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Invalid value '" + raw
                                + "'. Use ELIGIBLE or NOT_ELIGIBLE."));
            }

            LoginAccessStatusResponse updated =
                    loginAccessService.updatePermission(userId, permission, tenantCode);

            return ResponseEntity.ok(
                    ApiResponse.success("Permission updated", updated));

        } catch (Exception e) {
            log.error("updatePermission error userId={}: {}", userId, e.getMessage(), e);
            // ✅ Returns actual error message to frontend instead of generic 500
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Server error: " + e.getMessage()));
        }
    }

    // ── POST send credentials email (one-time) ────────────────────────────

    @PostMapping("/employee/{userId}/send-credentials")
    public ResponseEntity<ApiResponse<LoginAccessStatusResponse>>
    sendCredentials(@PathVariable Long userId,
                    @RequestHeader(value = "X-Tenant-Code",
                                   required = false) String tenantCode) {
        try {
            log.info("sendCredentials: userId={}, tenantCode={}", userId, tenantCode);
            LoginAccessStatusResponse result =
                    loginAccessService.sendCredentialsEmail(userId, tenantCode);
            return ResponseEntity.ok(
                    ApiResponse.success("Credentials sent", result));
        } catch (Exception e) {
            log.error("sendCredentials error userId={}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── POST employee change password ─────────────────────────────────────

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>>
    changePassword(@RequestBody Map<String, String> body) {
        try {
            String oldPwd     = body.getOrDefault("oldPassword",     "");
            String newPwd     = body.getOrDefault("newPassword",     "");
            String confirmPwd = body.getOrDefault("confirmPassword", "");

            if (oldPwd.isEmpty() || newPwd.isEmpty() || confirmPwd.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "oldPassword, newPassword, confirmPassword are all required."));
            }

            loginAccessService.changePasswordByEmployee(
                    oldPwd, newPwd, confirmPwd);

            return ResponseEntity.ok(ApiResponse.success(
                    "Password changed. Max 2 changes per month.", null));

        } catch (Exception e) {
            log.error("changePassword error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── GET monthly password change summary ───────────────────────────────

    @GetMapping("/password-summary")
    public ResponseEntity<ApiResponse<EmployeeLoginAccessService.PasswordChangeSummary>>
    getPasswordSummary() {
        try {
            EmployeeLoginAccessService.PasswordChangeSummary summary =
                    loginAccessService.getPasswordChangeSummary();
            return ResponseEntity.ok(ApiResponse.success("Summary fetched", summary));
        } catch (Exception e) {
            log.error("getPasswordSummary error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}