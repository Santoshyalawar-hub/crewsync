package com.samayahr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.dto.request.BankDetailRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.EmployeeBankDetail;
import com.samayahr.service.EmployeeBankService;

/**
 * Bank detail management + Cloudinary document upload.
 * All routes are tenant-scoped via X-Tenant-Code header.
 */
@RestController
@RequestMapping("/api/bank")
@CrossOrigin(origins = "*")
public class EmployeeBankController {

    @Autowired
    private EmployeeBankService bankService;

    /** Save or update bank details (without document upload) */
    @PostMapping("/employee/{userId}")
    public ResponseEntity<ApiResponse<EmployeeBankDetail>> saveOrUpdate(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody BankDetailRequest request) {
        try {
            EmployeeBankDetail detail = bankService.saveOrUpdate(userId, tenantCode, request);
            return ResponseEntity.ok(ApiResponse.success("Bank details saved", detail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Upload proof document (cancelled cheque, passbook, bank statement).
     * Stores file in Cloudinary under hrms/{tenantCode}/bank_proofs/.
     */
    @PostMapping("/employee/{userId}/upload-proof")
    public ResponseEntity<ApiResponse<EmployeeBankDetail>> uploadProof(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "proofDocumentType", defaultValue = "CANCELLED_CHEQUE") String proofDocumentType) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("File cannot be empty"));
            }
            EmployeeBankDetail detail = bankService.uploadProofDocument(userId, tenantCode, file, proofDocumentType);
            return ResponseEntity.ok(ApiResponse.success("Proof document uploaded", detail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Get bank details for a specific employee */
    @GetMapping("/employee/{userId}")
    public ResponseEntity<ApiResponse<EmployeeBankDetail>> getByEmployee(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            EmployeeBankDetail detail = bankService.findByUserAndTenant(userId, tenantCode)
                    .orElseThrow(() -> new RuntimeException("Bank details not found"));
            return ResponseEntity.ok(ApiResponse.success("Bank details fetched", detail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** List all bank records for the tenant (admin view) */
    @GetMapping("/tenant/all")
    public ResponseEntity<ApiResponse<List<EmployeeBankDetail>>> getAllByTenant(
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Bank list fetched", bankService.findAllByTenant(tenantCode)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** List all pending verifications for admin review */
    @GetMapping("/tenant/pending-verification")
    public ResponseEntity<ApiResponse<List<EmployeeBankDetail>>> pendingVerifications(
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Pending verifications",
                    bankService.findPendingVerifications(tenantCode)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Admin verifies / rejects a bank detail record.
     * Body: { "approved": true/false, "rejectionReason": "..." }
     */
    @PatchMapping("/{bankDetailId}/verify")
    public ResponseEntity<ApiResponse<EmployeeBankDetail>> verify(
            @PathVariable Long bankDetailId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody Map<String, Object> body) {
        try {
            boolean approved = Boolean.TRUE.equals(body.get("approved"));
            String rejectionReason = (String) body.get("rejectionReason");
            Long verifiedBy = body.get("verifiedByUserId") != null
                    ? Long.valueOf(body.get("verifiedByUserId").toString()) : null;
            EmployeeBankDetail detail = bankService.verify(bankDetailId, tenantCode, verifiedBy, approved, rejectionReason);
            return ResponseEntity.ok(ApiResponse.success("Bank detail verification updated", detail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Delete bank details and Cloudinary document */
    @DeleteMapping("/employee/{userId}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long userId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            bankService.delete(userId, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Bank details deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}