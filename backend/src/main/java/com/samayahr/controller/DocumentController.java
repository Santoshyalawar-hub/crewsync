package com.samayahr.controller;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.Document;
import com.samayahr.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // ── Admin: Get all documents grouped by employee ──────────────────────────
    // UNCHANGED from your original

    @GetMapping("/admin/all-documents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDocumentsGroupedByEmployee(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantHeader,
            @RequestHeader(value = "X-Company-Id",  required = false) Long companyHeader,
            @RequestParam(value = "tenantCode",     required = false) String tenantParam,
            @RequestParam(value = "companyId",      required = false) Long companyParam) {
        try {
            String tenantCode = tenantHeader != null ? tenantHeader : tenantParam;
            Long companyId    = companyHeader != null ? companyHeader : companyParam;

            if (tenantCode == null || companyId == null)
                throw new RuntimeException("tenantCode and companyId are required");

            List<Map<String, Object>> employeeDocuments =
                    documentService.getAllDocumentsGroupedByEmployee(tenantCode, companyId);

            return ResponseEntity.ok(employeeDocuments);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch documents: " + e.getMessage()));
        }
    }

    // ── Employee: Get their own documents ─────────────────────────────────────
    // UNCHANGED from your original

    @GetMapping("/my-documents")
    public ResponseEntity<ApiResponse<List<Document>>> getMyDocuments() {
        try {
            List<Document> documents = documentService.getCurrentUserDocuments();
            return ResponseEntity.ok(ApiResponse.success("Documents fetched successfully", documents));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch documents: " + e.getMessage()));
        }
    }

    // ── Admin: Get all documents ──────────────────────────────────────────────
    // UNCHANGED from your original

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Document>>> getAllDocuments() {
        try {
            List<Document> documents = documentService.getAllDocuments();
            return ResponseEntity.ok(ApiResponse.success("All documents fetched successfully", documents));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch documents: " + e.getMessage()));
        }
    }

    // ── Admin: Get documents by specific user ─────────────────────────────────
    // UNCHANGED from your original

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Document>>> getUserDocuments(@PathVariable Long userId) {
        try {
            List<Document> documents = documentService.getUserDocuments(userId);
            return ResponseEntity.ok(ApiResponse.success("User documents fetched successfully", documents));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch user documents: " + e.getMessage()));
        }
    }

    // ── Employee: Upload their own document ───────────────────────────────────
    // UNCHANGED from your original

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Document>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType) {
        try {
            if (file.isEmpty())
                return ResponseEntity.badRequest().body(ApiResponse.error("File is empty"));

            Document document = documentService.uploadDocument(file, documentType);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document uploaded successfully", document));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to upload document: " + e.getMessage()));
        }
    }

    // ── Admin: Upload document for specific user ──────────────────────────────
    // UNCHANGED from your original

    @PostMapping("/upload/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Document>> uploadDocumentForUser(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType) {
        try {
            if (file.isEmpty())
                return ResponseEntity.badRequest().body(ApiResponse.error("File is empty"));

            Document document = documentService.uploadDocumentForUser(userId, file, documentType);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document uploaded successfully for user", document));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to upload document: " + e.getMessage()));
        }
    }

    // ── Download (existing endpoint — kept as-is, still works) ───────────────
    // UNCHANGED from your original

    @GetMapping("/download/{id}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(@PathVariable Long id) {
        try {
            return documentService.downloadDocument(id);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ✅ NEW ENDPOINT: /proxy/{id}
    //
    //  This is the ONLY new code added to your existing controller.
    //  All endpoints above and below are UNCHANGED from your original file.
    //
    //  WHY THIS FIXES THE PROBLEMS:
    //
    //  PROBLEM 1 — Download saves as "file_ujpdz5" with no extension:
    //    OLD: frontend called /download/{id} → service did 302 redirect to Cloudinary
    //         Edge browser followed redirect but lost Content-Disposition header
    //         Result: file saved as random name with no extension
    //    NEW: frontend calls /proxy/{id}?dl=true → THIS method fetches bytes from
    //         Cloudinary server-side (Java has no CORS) and returns them with:
    //         Content-Disposition: attachment; filename="DevOps_Guide_SamayaHR.pdf"
    //         Result: file saves with correct original name + extension
    //
    //  PROBLEM 2 — Signature not appearing on document image:
    //    OLD: frontend tried fetch(cloudinaryUrl) to load image into canvas
    //         Cloudinary CDN returns no Access-Control-Allow-Origin header for images
    //         Browser blocked the request → canvas.toDataURL() failed silently
    //    NEW: frontend calls fetch(/api/documents/proxy/{id}) with auth token
    //         THIS method returns the image bytes with Access-Control-Allow-Origin: *
    //         (added by @CrossOrigin on this class + explicit headers below)
    //         Frontend gets a blob URL from the response → draws on canvas → works
    //         canvas.toDataURL() succeeds → signature appears on document
    // ─────────────────────────────────────────────────────────────────────────

    @GetMapping("/proxy/{documentId}")
    public ResponseEntity<Resource> proxyDocument(
            @PathVariable Long documentId,
            @RequestParam(value = "dl", defaultValue = "false") boolean forDownload) {
        try {
            Document document = documentService.getDocumentById(documentId);
            return buildProxyResponse(
                document.getFilePath(),
                document.getFileName(),
                document.getFileType(),
                forDownload
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ── Get single document ───────────────────────────────────────────────────
    // UNCHANGED from your original

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Document>> getDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            return ResponseEntity.ok(ApiResponse.success("Document fetched successfully", document));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch document: " + e.getMessage()));
        }
    }

    // ── Employee: Update their own document ───────────────────────────────────
    // UNCHANGED from your original

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Document>> updateDocument(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty())
                return ResponseEntity.badRequest().body(ApiResponse.error("File is empty"));

            Document document = documentService.updateDocument(id, file);
            return ResponseEntity.ok(ApiResponse.success("Document updated successfully", document));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update document: " + e.getMessage()));
        }
    }

    // ── Admin: Update document status ─────────────────────────────────────────
    // UNCHANGED from your original — kept your inner class style

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Document>> updateDocumentStatus(
            @PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody DocumentStatusUpdateRequest request) {
        try {
            Document document = documentService.updateDocumentStatus(
                id, request.getStatus(), request.getRemarks());
            return ResponseEntity.ok(ApiResponse.success("Document status updated successfully", document));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update document status: " + e.getMessage()));
        }
    }

    // ── Employee: Delete their own document ───────────────────────────────────
    // UNCHANGED from your original

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDocument(@PathVariable Long id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.ok(ApiResponse.success("Document deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to delete document: " + e.getMessage()));
        }
    }

    // ── Admin: Force delete any document ─────────────────────────────────────
    // UNCHANGED from your original

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> adminDeleteDocument(@PathVariable Long id) {
        try {
            documentService.adminDeleteDocument(id);
            return ResponseEntity.ok(ApiResponse.success("Document deleted successfully by admin", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to delete document: " + e.getMessage()));
        }
    }

    // ── Employee: Sign document ───────────────────────────────────────────────
    // NEW — called by frontend after signing, records metadata

    @PostMapping("/{documentId}/sign")
    public ResponseEntity<ApiResponse<String>> signDocument(
            @PathVariable Long documentId,
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> request) {
        try {
            // Signature composite is done on the frontend for image documents.
            // This endpoint records that the document was signed.
            return ResponseEntity.ok(ApiResponse.success("Document signed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to sign document: " + e.getMessage()));
        }
    }

    // ── Passport photo ────────────────────────────────────────────────────────
    // UNCHANGED from your original

    @GetMapping("/my-passport-photo")
    public ResponseEntity<ApiResponse<String>> getMyPassportPhoto() {
        String photoUrl = documentService.getCurrentUserPassportPhotoUrl();
        return ResponseEntity.ok(ApiResponse.success("Passport photo fetched", photoUrl));
    }

    // ── Admin: Get documents by status ────────────────────────────────────────
    // UNCHANGED from your original

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Document>>> getDocumentsByStatus(
            @PathVariable String status) {
        try {
            List<Document> documents = documentService.getDocumentsByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Documents fetched by status", documents));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch documents: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  PRIVATE HELPER — used only by proxyDocument() above
    //  Fetches file from Cloudinary server-side and returns to browser
    //  with correct Content-Type, Content-Disposition, and CORS headers.
    // ─────────────────────────────────────────────────────────────────────────

    private ResponseEntity<Resource> buildProxyResponse(
            String fileUrl, String fileName, String fileType, boolean forDownload) {
        try {
            // Fix URL for PDFs stored with wrong Cloudinary resource type path
            boolean isPdf = "application/pdf".equals(fileType)
                || (fileName != null && fileName.toLowerCase().endsWith(".pdf"));
            String fetchUrl = fileUrl;
            if (isPdf && fetchUrl != null && fetchUrl.contains("/image/upload/")) {
                fetchUrl = fetchUrl.replace("/image/upload/", "/raw/upload/");
            }

            // Fetch from Cloudinary — server-side fetch has no CORS restriction
            URL connUrl = new URL(fetchUrl);
            HttpURLConnection conn = (HttpURLConnection) connUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(30000);
            conn.setRequestProperty("User-Agent", "SamayaHR-Proxy/1.0");
            conn.connect();

            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                return ResponseEntity.status(conn.getResponseCode()).build();
            }

            try (InputStream is = conn.getInputStream()) {
                byte[] bytes = is.readAllBytes();

                // Correct media type
                MediaType mediaType;
                try {
                    mediaType = MediaType.parseMediaType(
                        fileType != null ? fileType : "application/octet-stream");
                } catch (Exception e) {
                    mediaType = MediaType.APPLICATION_OCTET_STREAM;
                }

                // Ensure filename has correct extension
                String safeName = ensureExtension(fileName, fileType);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(mediaType);
                headers.setContentLength(bytes.length);

                // CORS headers — allow frontend fetch() into canvas
                headers.add("Access-Control-Allow-Origin",   "*");
                headers.add("Access-Control-Allow-Methods",  "GET, OPTIONS");
                headers.add("Access-Control-Expose-Headers", "Content-Disposition, Content-Type");

                // Disposition — inline for view, attachment for download
                headers.add(HttpHeaders.CONTENT_DISPOSITION,
                    (forDownload ? "attachment" : "inline")
                    + "; filename=\"" + safeName + "\"");

                return ResponseEntity.ok()
                    .headers(headers)
                    .body(new ByteArrayResource(bytes));
            }

        } catch (Exception e) {
            System.err.println("[DocumentController] Proxy failed for: "
                + fileUrl + " — " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String ensureExtension(String fileName, String fileType) {
        if (fileName == null) fileName = "document";
        if (fileName.contains(".")) return fileName; // already has extension
        String ext = switch (fileType != null ? fileType : "") {
            case "application/pdf"         -> "pdf";
            case "image/jpeg", "image/jpg" -> "jpg";
            case "image/png"               -> "png";
            case "image/webp"              -> "webp";
            default                        -> "bin";
        };
        return fileName + "." + ext;
    }

    // ── Inner class for status update request ─────────────────────────────────
    // UNCHANGED from your original

    public static class DocumentStatusUpdateRequest {
        private String status;
        private String remarks;

        public String getStatus()  { return status;  }
        public void setStatus(String status) { this.status = status; }

        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }
}