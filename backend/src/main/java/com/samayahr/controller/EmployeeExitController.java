package com.samayahr.controller;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.EmployeeExit;
import com.samayahr.service.EmployeeExitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "*")
public class EmployeeExitController {

    @Autowired
    private EmployeeExitService employeeExitService;

    // ── Employee: submit exit request ─────────────────────────────────────────
    @PostMapping("/exit-request")
    public ResponseEntity<ApiResponse<EmployeeExit>> submitExitRequest(
            @RequestBody Map<String, String> request) {
        try {
            EmployeeExit exit = employeeExitService.submitExitRequest(request);
            return ResponseEntity.ok(ApiResponse.success("Exit request submitted successfully", exit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Employee: get own exit status ─────────────────────────────────────────
    @GetMapping("/exit-request/status")
    public ResponseEntity<ApiResponse<EmployeeExit>> getExitStatus() {
        try {
            EmployeeExit exit = employeeExitService.getMyExitStatus();
            return ResponseEntity.ok(ApiResponse.success("Exit status fetched", exit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Admin: list all exit requests for tenant ──────────────────────────────
    @GetMapping("/exit-requests/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<EmployeeExit>>> getAllExitRequests(
            @RequestParam String tenantCode) {
        try {
            List<EmployeeExit> list = employeeExitService.getAllByTenant(tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Exit requests fetched", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Admin: approve (moves to next stage) ─────────────────────────────────
    @PatchMapping("/exit-requests/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeExit>> approve(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            EmployeeExit exit = employeeExitService.approve(id, body != null ? body : Map.of());
            return ResponseEntity.ok(ApiResponse.success("Exit request approved", exit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Admin: reject ─────────────────────────────────────────────────────────
    @PatchMapping("/exit-requests/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeExit>> reject(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            EmployeeExit exit = employeeExitService.reject(id, body);
            return ResponseEntity.ok(ApiResponse.success("Exit request rejected", exit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
