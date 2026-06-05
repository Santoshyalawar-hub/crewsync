package com.samayahr.controller;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.Policy;
import com.samayahr.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    /* ── GET all active policies for tenant (optionally filtered by type) ── */
    @GetMapping("/tenant/{tenantCode}")
    public ResponseEntity<ApiResponse<List<Policy>>> getPoliciesByTenant(
            @PathVariable String tenantCode,
            @RequestParam(required = false) String type) {
        try {
            List<Policy> policies = (type != null && !type.isBlank())
                    ? policyService.getPoliciesByTenantAndType(tenantCode, type)
                    : policyService.getPoliciesByTenant(tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Policies fetched", policies));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch policies: " + e.getMessage()));
        }
    }

    /* ── CREATE a new policy (multipart: title, description, tenantCode, companyId, createdBy, file?) ── */
    @PostMapping(consumes = { "multipart/form-data", "application/json", "application/x-www-form-urlencoded" })
    public ResponseEntity<ApiResponse<Policy>> createPolicy(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String tenantCode,
            @RequestParam(required = false) Long          companyId,
            @RequestParam(required = false) Long          createdBy,
            @RequestParam(required = false) String        policyType,
            @RequestParam(required = false) MultipartFile file) {
        try {
            Policy policy = policyService.createPolicy(
                    title, description, tenantCode, companyId, createdBy, policyType, file);
            return ResponseEntity.ok(ApiResponse.success("Policy created", policy));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create policy: " + e.getMessage()));
        }
    }

    /* ── GET a single policy by ID ── */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Policy>> getPolicyById(@PathVariable Long id) {
        return policyService.getPolicyById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.success("Policy found", p)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Policy not found")));
    }

    /* ── DELETE (soft) a policy ── */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePolicy(@PathVariable Long id) {
        try {
            policyService.deletePolicy(id);
            return ResponseEntity.ok(ApiResponse.success("Policy deleted", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete policy: " + e.getMessage()));
        }
    }

    /* ── GET count of active policies for tenant ── */
    @GetMapping("/tenant/{tenantCode}/count")
    public ResponseEntity<ApiResponse<Long>> countPolicies(@PathVariable String tenantCode) {
        long count = policyService.countByTenant(tenantCode);
        return ResponseEntity.ok(ApiResponse.success("Count fetched", count));
    }
}
