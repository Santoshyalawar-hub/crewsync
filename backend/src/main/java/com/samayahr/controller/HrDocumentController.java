package com.samayahr.controller;

import com.samayahr.dto.request.SignDocumentRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.HrDocument;
import com.samayahr.entity.User;
import com.samayahr.service.HrDocumentService;
import com.samayahr.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr-documents")
@CrossOrigin(origins = "*")
public class HrDocumentController {

    @Autowired private HrDocumentService hrDocumentService;
    @Autowired private UserService       userService;

    // ════════════════════════════════════════════════════════════
    //  ADMIN ENDPOINTS — unchanged
    // ════════════════════════════════════════════════════════════

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','GLOBAL_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminUpload(
            @RequestHeader("X-Tenant-Code")                              String tenantCode,
            @RequestHeader(value = "X-Company-Id", required = false)     Long companyId,
            @RequestParam("file")                                         MultipartFile file,
            @RequestParam("employeeId")                                   Long employeeId,
            @RequestParam("docType")                                      String docType,
            @RequestParam("title")                                        String title,
            @RequestParam(value = "notes",            required = false)   String notes,
            @RequestParam(value = "requiresSignature", defaultValue = "true") Boolean requiresSignature,
            @RequestParam(value = "signByDate",       required = false)   String signByDate) {
        try {
            User admin  = userService.getCurrentUser();
            HrDocument doc = hrDocumentService.adminUploadDocument(
                    admin.getId(), tenantCode, companyId, employeeId,
                    docType, title, notes, requiresSignature, signByDate, file);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("HR document uploaded successfully",
                            Map.of("id", doc.getId(), "title", doc.getTitle(),
                                   "status", doc.getStatus().name(), "fileUrl", doc.getOriginalFileUrl())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','GLOBAL_ADMIN')")
    public ResponseEntity<?> adminGetAll(
            @RequestHeader("X-Tenant-Code")                          String tenantCode,
            @RequestHeader(value = "X-Company-Id", required = false) Long companyId) {
        try {
            if (companyId == null)
                return ResponseEntity.badRequest().body(ApiResponse.error("X-Company-Id header required"));
            List<Map<String, Object>> result = hrDocumentService.getHrDocsGroupedByEmployee(tenantCode, companyId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','GLOBAL_ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> adminGetForEmployee(
            @PathVariable                                             Long employeeId,
            @RequestHeader("X-Tenant-Code")                          String tenantCode,
            @RequestHeader(value = "X-Company-Id", required = false) Long companyId) {
        try {
            List<Map<String, Object>> docs = hrDocumentService.getHrDocsForEmployee(
                    employeeId, tenantCode, companyId != null ? companyId : 0L);
            return ResponseEntity.ok(ApiResponse.success("HR docs fetched", docs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/admin/{docId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','GLOBAL_ADMIN')")
    public ResponseEntity<ApiResponse<String>> adminDelete(
            @PathVariable                   Long docId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            hrDocumentService.adminDeleteHrDocument(docId, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("HR document deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ════════════════════════════════════════════════════════════
    //  EMPLOYEE ENDPOINTS
    // ════════════════════════════════════════════════════════════

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> myDocuments(
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            User me = userService.getCurrentUser();
            List<Map<String, Object>> docs = hrDocumentService.getMyHrDocuments(me.getId(), tenantCode);
            return ResponseEntity.ok(ApiResponse.success("HR documents fetched", docs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/my/pending-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> myPendingCount(
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            User me    = userService.getCurrentUser();
            long count = hrDocumentService.countMyPendingSignatures(me.getId(), tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Pending count", Map.of("pendingCount", count)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ✅ SIGN ENDPOINT — with full exception logging
    //
    //  Previous versions were catching generic Exception and returning
    //  Spring's default 500 page instead of our custom ApiResponse.
    //  Now we log the full stack trace so the real cause is visible
    //  in the Spring Boot console, and we return a proper ApiResponse
    //  with the actual error message.
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/{docId}/sign")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signDocument(
            @PathVariable                    Long docId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody                     SignDocumentRequest req,
            HttpServletRequest               httpReq) {

        System.out.println("[HrDocumentController] Sign request received for docId=" + docId
            + " tenant=" + tenantCode
            + " signerName=" + (req != null ? req.getSignerName() : "NULL")
            + " signatureDataLength=" + (req != null && req.getSignatureData() != null
                ? req.getSignatureData().length() : 0));

        try {
            User me = userService.getCurrentUser();

            System.out.println("[HrDocumentController] Current user: " + me.getId()
                + " email=" + me.getEmail());

            // Truncate signatureData if it's still somehow too large
            // (safety net — MEDIUMTEXT handles up to 16MB so this shouldn't be needed)
            if (req.getSignatureData() != null && req.getSignatureData().length() > 1_000_000) {
                System.out.println("[HrDocumentController] signatureData too large ("
                    + req.getSignatureData().length() + " chars), truncating to 1MB");
                req.setSignatureData(req.getSignatureData().substring(0, 1_000_000));
            }

            HrDocument signed = hrDocumentService.signDocument(
                    docId, me.getId(), tenantCode, req, httpReq);

            System.out.println("[HrDocumentController] Document signed successfully. "
                + "New status=" + signed.getStatus().name());

            return ResponseEntity.ok(ApiResponse.success("Document signed successfully",
                    Map.of(
                        "id",         signed.getId(),
                        "status",     signed.getStatus().name(),
                        "signedAt",   signed.getSignedAt() != null ? signed.getSignedAt().toString() : "",
                        "signerName", signed.getSignerName() != null ? signed.getSignerName() : ""
                    )));

        } catch (Exception e) {
            // ✅ Log the FULL exception with stack trace to Spring Boot console
            // This tells you the REAL cause of the 500 error
            System.err.println("[HrDocumentController] SIGN FAILED for docId=" + docId);
            System.err.println("[HrDocumentController] Exception type: " + e.getClass().getName());
            System.err.println("[HrDocumentController] Exception message: " + e.getMessage());
            e.printStackTrace(); // full stack trace in console

            // Return proper ApiResponse instead of Spring's generic 500 page
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Signing failed: " + e.getMessage()));
        }
    }

    @PostMapping("/{docId}/acknowledge")
    public ResponseEntity<ApiResponse<String>> acknowledgeDocument(
            @PathVariable                    Long docId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            User me = userService.getCurrentUser();
            hrDocumentService.acknowledgeDocument(docId, me.getId(), tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Document acknowledged", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}