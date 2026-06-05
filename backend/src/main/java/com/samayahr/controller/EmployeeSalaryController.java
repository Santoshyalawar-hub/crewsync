package com.samayahr.controller;

import com.samayahr.dto.request.SalaryDetailRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.EmployeeSalaryDetail;
import com.samayahr.service.EmployeeSalaryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * All routes are tenant-scoped.
 * Tenant code is read from the X-Tenant-Code header (set by the frontend after login).
 */
@RestController
@RequestMapping("/api/salary")
@CrossOrigin(origins = "*")
public class EmployeeSalaryController {

    @Autowired
    private EmployeeSalaryService salaryService;

    /** Save or update salary details for an employee */
    @PostMapping("/employee/{userId}")
    public ResponseEntity<ApiResponse<EmployeeSalaryDetail>> saveOrUpdate(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody SalaryDetailRequest request) {
        try {
            EmployeeSalaryDetail detail = salaryService.saveOrUpdate(userId, tenantCode, request);
            return ResponseEntity.ok(ApiResponse.success("Salary details saved", detail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Fetch salary details for a specific employee (tenant-scoped) */
    @GetMapping("/employee/{userId}")
    public ResponseEntity<ApiResponse<EmployeeSalaryDetail>> getByEmployee(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            EmployeeSalaryDetail detail = salaryService.findByUserAndTenant(userId, tenantCode)
                    .orElseThrow(() -> new RuntimeException("Salary details not found for this employee"));
            return ResponseEntity.ok(ApiResponse.success("Salary details fetched", detail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Fetch all salary details for the company (admin view) */
    @GetMapping("/tenant/all")
    public ResponseEntity<ApiResponse<List<EmployeeSalaryDetail>>> getAllByTenant(
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            List<EmployeeSalaryDetail> list = salaryService.findAllByTenant(tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Salary list fetched", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Delete salary details for an employee */
    @DeleteMapping("/employee/{userId}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            salaryService.delete(userId, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Salary details deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}