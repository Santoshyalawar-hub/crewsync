package com.samayahr.controller;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.Document;
import com.samayahr.entity.HrDocument;
import com.samayahr.entity.User;
import com.samayahr.repository.DocumentRepository;
import com.samayahr.repository.HrDocumentRepository;
import com.samayahr.repository.UserRepository;
import com.samayahr.service.CloudinaryService;
import com.samayahr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class SignedDocumentController {

    @Autowired private HrDocumentRepository   hrDocRepo;
    @Autowired private DocumentRepository     documentRepository;
    @Autowired private CloudinaryService      cloudinaryService;
    @Autowired private UserService            userService;
    @Autowired private UserRepository         userRepository;
    @Autowired private PasswordEncoder        passwordEncoder;

    // ─────────────────────────────────────────────────────────────────────────
    //  1. Upload signed PDF for an HR Document
    //     POST /api/signed-docs/hr/{docId}/upload
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/api/signed-docs/hr/{docId}/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadSignedHrDoc(
            @PathVariable("docId") Long docId,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode,
            @RequestParam("file") MultipartFile file) {
        try {
            User me = userService.getCurrentUser();

            HrDocument doc = hrDocRepo.findById(docId)
                    .orElseThrow(() -> new RuntimeException("HR document not found: " + docId));

            if (!doc.getEmployeeId().equals(me.getId()))
                throw new RuntimeException("Access denied: not your document");

            String tc = (tenantCode != null && !tenantCode.isBlank())
                    ? tenantCode
                    : (me.getTenantCode() != null ? me.getTenantCode() : "global");

            String folder = "hr_documents/signed/"
                    + (doc.getDocType() != null ? doc.getDocType().name().toLowerCase() : "other");

            Map<String, Object> result = cloudinaryService.upload(file, tc, folder);
            String signedUrl      = cloudinaryService.getSecureUrl(result);
            String signedPublicId = cloudinaryService.getPublicId(result);

            doc.setSignedFileUrl(signedUrl);
            doc.setSignedFilePublicId(signedPublicId);
            doc.setSignedFileName(file.getOriginalFilename());
            doc.setSignedFileSize(file.getSize());
            doc.setUpdatedAt(LocalDateTime.now());
            hrDocRepo.save(doc);

            return ResponseEntity.ok(ApiResponse.success(
                    "Signed HR document uploaded",
                    Map.of("signedFileUrl", signedUrl, "docId", docId.toString())
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Upload failed: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  2. Upload signed file for My Uploads document
    //     POST /api/signed-docs/my/{docId}/upload
    //
    //  FIX: @PathVariable("docId") — explicit name so Spring 6 can resolve it
    //  without the -parameters compiler flag.
    //
    //  signerName accepted as optional @RequestParam so it is saved atomically
    //  with the upload in one DB call — no dependency on the PATCH succeeding.
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/api/signed-docs/my/{docId}/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadSignedMyDoc(
            @PathVariable("docId") Long docId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "signerName", required = false) String signerName) {
        try {
            User me = userService.getCurrentUser();

            Document doc = documentRepository.findById(docId)
                    .orElseThrow(() -> new RuntimeException("Document not found: " + docId));

            if (!doc.getUserId().equals(me.getId()))
                throw new RuntimeException("Access denied: not your document");

            // Delete old signed file from Cloudinary before uploading new one
            if (doc.getSignedFilePublicId() != null && !doc.getSignedFilePublicId().isBlank()) {
                try {
                    cloudinaryService.delete(doc.getSignedFilePublicId());
                } catch (Exception ignored) {
                    System.err.println("Non-fatal: could not delete old signed file: "
                            + doc.getSignedFilePublicId());
                }
            }

            String tenantCode = (me.getTenantCode() != null && !me.getTenantCode().isBlank())
                    ? me.getTenantCode() : "global";

            // Upload the signed PDF to Cloudinary under documents/signed/
            Map<String, Object> result = cloudinaryService.upload(
                    file, tenantCode, "documents/signed");

            String signedUrl      = cloudinaryService.getSecureUrl(result);
            String signedPublicId = cloudinaryService.getPublicId(result);

            // Save ALL signed fields atomically in ONE db.save()
            // Even if the subsequent PATCH sign-status call fails,
            // the signature URL + flag are already persisted here.
            doc.setSignedFileUrl(signedUrl);
            doc.setSignedFilePublicId(signedPublicId);
            doc.setSigned(Boolean.TRUE);
            doc.setSignedAt(LocalDateTime.now());

            // Resolve signer name: from request param > user full name > email
            String resolvedName;
            if (signerName != null && !signerName.isBlank()) {
                resolvedName = signerName.trim();
            } else if (me.getFullName() != null && !me.getFullName().isBlank()) {
                resolvedName = me.getFullName();
            } else {
                resolvedName = me.getEmail();
            }
            doc.setSignerName(resolvedName);

            documentRepository.save(doc);

            return ResponseEntity.ok(ApiResponse.success(
                    "Signed document uploaded and persisted",
                    Map.of(
                            "signedFileUrl",  signedUrl,
                            "signedPublicId", signedPublicId,
                            "signed",         true,
                            "signerName",     resolvedName,
                            "signedAt",       doc.getSignedAt().toString(),
                            "docId",          docId.toString()
                    )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Upload failed: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  3a. PATCH /api/documents/{docId}/sign
    //      Updates signerName / signedFileUrl after upload (optional extra call)
    // ─────────────────────────────────────────────────────────────────────────
    @PatchMapping("/api/documents/{docId}/sign")
    public ResponseEntity<ApiResponse<Map<String, Object>>> patchSign(
            @PathVariable("docId") Long docId,
            @RequestBody Map<String, Object> body) {
        return saveSignMetadata(docId, body);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  3b. PATCH /api/documents/{docId}/sign-status  (backward-compat alias)
    // ─────────────────────────────────────────────────────────────────────────
    @PatchMapping("/api/documents/{docId}/sign-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> patchSignStatus(
            @PathVariable("docId") Long docId,
            @RequestBody Map<String, Object> body) {
        return saveSignMetadata(docId, body);
    }

    private ResponseEntity<ApiResponse<Map<String, Object>>> saveSignMetadata(
            Long docId, Map<String, Object> body) {
        try {
            User me = userService.getCurrentUser();

            Document doc = documentRepository.findById(docId)
                    .orElseThrow(() -> new RuntimeException("Document not found: " + docId));

            if (!doc.getUserId().equals(me.getId()))
                throw new RuntimeException("Access denied: not your document");

            Object urlVal  = body.get("signedFileUrl");
            Object nameVal = body.get("signerName");

            if (urlVal != null && !urlVal.toString().isBlank())
                doc.setSignedFileUrl(urlVal.toString());

            String signerName = (nameVal != null && !nameVal.toString().isBlank())
                    ? nameVal.toString()
                    : (me.getFullName() != null && !me.getFullName().isBlank()
                            ? me.getFullName() : me.getEmail());

            doc.setSignerName(signerName);
            doc.setSigned(Boolean.TRUE);
            if (doc.getSignedAt() == null) doc.setSignedAt(LocalDateTime.now());

            documentRepository.save(doc);

            return ResponseEntity.ok(ApiResponse.success(
                    "Sign metadata saved",
                    Map.of(
                            "docId",         docId,
                            "signedFileUrl", doc.getSignedFileUrl() != null ? doc.getSignedFileUrl() : "",
                            "signerName",    signerName,
                            "signed",        true,
                            "signedAt",      doc.getSignedAt().toString()
                    )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to save sign metadata: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  4. Verify identity before re-sign
    //     POST /api/signed-docs/verify-resign
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/api/signed-docs/verify-resign")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyResign(
            @RequestBody Map<String, String> body) {
        try {
            String email    = body.getOrDefault("email",    "").trim();
            String password = body.getOrDefault("password", "").trim();

            if (email.isEmpty() || password.isEmpty())
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email and password are required."));

            User currentUser = userService.getCurrentUser();

            if (!currentUser.getEmail().equalsIgnoreCase(email))
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email does not match your account."));

            if (!passwordEncoder.matches(password, currentUser.getPassword()))
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Incorrect password. Please try again."));

            return ResponseEntity.ok(ApiResponse.success(
                    "Identity verified. You can now re-sign.",
                    Map.of(
                            "verified",   true,
                            "employeeId", currentUser.getId(),
                            "name",       currentUser.getFullName() != null
                                    ? currentUser.getFullName() : ""
                    )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Verification failed: " + e.getMessage()));
        }
    }
}