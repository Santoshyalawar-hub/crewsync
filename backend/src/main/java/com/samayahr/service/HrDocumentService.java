package com.samayahr.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.dto.request.SignDocumentRequest;
import com.samayahr.entity.HrDocument;
import com.samayahr.entity.User;
import com.samayahr.repository.HrDocumentRepository;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Business logic for HR document lifecycle:
 *  1. Admin uploads document for employee
 *  2. Employee views and digitally signs it
 *  3. Signed copy stored on Cloudinary
 *  4. Admin can view signed status and download signed copy
 */
@Service
public class HrDocumentService {

    @Autowired private HrDocumentRepository hrDocRepo;
    @Autowired private UserService          userService;
    @Autowired private CloudinaryService    cloudinaryService;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    // ── Admin: upload HR document for an employee ─────────────────────────────

    @Transactional
    public HrDocument adminUploadDocument(
            Long adminId,
            String tenantCode,
            Long companyId,
            Long employeeId,
            String docTypeStr,
            String title,
            String notes,
            Boolean requiresSignature,
            String signByDateStr,
            MultipartFile file) throws Exception {

        // Validate file
        if (file == null || file.isEmpty())
            throw new RuntimeException("File cannot be empty");
        if (file.getSize() > 15 * 1024 * 1024)
            throw new RuntimeException("File size must be under 15 MB");

        String ct = file.getContentType();
        if (ct == null || (!ct.equals("application/pdf")
                && !ct.startsWith("image/")))
            throw new RuntimeException("Only PDF and image files are allowed");

        // Validate employee belongs to tenant
        User employee = userService.getUserById(employeeId);
        if (!tenantCode.equals(employee.getTenantCode()))
            throw new RuntimeException("Employee does not belong to this tenant");

        // Map docType
        HrDocument.HrDocType docType;
        try {
            docType = HrDocument.HrDocType.valueOf(docTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid document type: " + docTypeStr);
        }

        // Upload to Cloudinary — folder: hrms/{tenant}/hr_documents/{docType}/
        String folder = "hr_documents/" + docType.name().toLowerCase();
        Map<String, Object> result = cloudinaryService.upload(file, tenantCode, folder);

        HrDocument doc = new HrDocument();
        doc.setTenantCode(tenantCode);
        doc.setCompanyId(companyId);
        doc.setEmployeeId(employeeId);
        doc.setUploadedByAdminId(adminId);
        doc.setDocType(docType);
        doc.setTitle(title != null ? title.trim() : docType.name().replace("_", " "));
        doc.setNotes(notes);
        doc.setRequiresSignature(requiresSignature != null ? requiresSignature : true);
        doc.setOriginalFileUrl(cloudinaryService.getSecureUrl(result));
        doc.setOriginalFilePublicId(cloudinaryService.getPublicId(result));
        doc.setOriginalFileName(file.getOriginalFilename());
        doc.setOriginalFileSize(file.getSize());
        doc.setStatus(HrDocument.HrDocStatus.PENDING_SIGNATURE);

        if (signByDateStr != null && !signByDateStr.isBlank()) {
            try {
                doc.setSignByDate(LocalDateTime.parse(signByDateStr));
            } catch (Exception ignored) { /* optional field — skip if malformed */ }
        }

        return hrDocRepo.save(doc);
    }

    // ── Employee: sign a document ─────────────────────────────────────────────

    @Transactional
    public HrDocument signDocument(Long docId,
                                    Long employeeId,
                                    String tenantCode,
                                    SignDocumentRequest req,
                                    HttpServletRequest httpReq) throws Exception {

        HrDocument doc = hrDocRepo.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Security: employee can only sign their own docs in their tenant
        if (!doc.getEmployeeId().equals(employeeId))
            throw new RuntimeException("Access denied: not your document");
        if (!doc.getTenantCode().equals(tenantCode))
            throw new RuntimeException("Access denied: tenant mismatch");
        if (doc.getStatus() == HrDocument.HrDocStatus.SIGNED)
            throw new RuntimeException("Document is already signed");

        // Store signature data (PNG data-URL) for audit trail
        doc.setSignatureData(req.getSignatureData());
        doc.setSignerName(req.getSignerName());
        doc.setSigningIp(getClientIp(httpReq));
        doc.setSignedAt(LocalDateTime.now());
        doc.setUpdatedAt(LocalDateTime.now());
        doc.setStatus(HrDocument.HrDocStatus.SIGNED);

        // If employee sent back a signed file (PDF with embedded signature),
        // upload that to Cloudinary as the signed copy
        if (req.getSignedFileBase64() != null && !req.getSignedFileBase64().isBlank()) {
            try {
                byte[] fileBytes = Base64.getDecoder().decode(
                        req.getSignedFileBase64().replaceAll("^data:[^;]+;base64,", ""));

                // Use Cloudinary raw upload for PDFs
                String folder = "hr_documents/signed/" +
                        doc.getDocType().name().toLowerCase();

                Map<String, Object> result = cloudinaryService.uploadRawBytes(
                        fileBytes,
                        req.getSignedFileType() != null
                                ? req.getSignedFileType() : "image/png",
                        req.getSignedFileName() != null
                                ? req.getSignedFileName()
                                : "signed_" + doc.getOriginalFileName(),
                        tenantCode,
                        folder);

                doc.setSignedFileUrl(cloudinaryService.getSecureUrl(result));
                doc.setSignedFilePublicId(cloudinaryService.getPublicId(result));
                doc.setSignedFileName(req.getSignedFileName());
                doc.setSignedFileSize((long) fileBytes.length);
            } catch (Exception e) {
                // Don't fail the sign operation if signed-file upload fails;
                // signature data is already saved as audit record
                System.err.println("Signed file upload failed (non-critical): " + e.getMessage());
            }
        }

        return hrDocRepo.save(doc);
    }

    // ── Employee: acknowledge (for docs that don't require signature) ─────────

    @Transactional
    public HrDocument acknowledgeDocument(Long docId, Long employeeId,
                                           String tenantCode) {
        HrDocument doc = getAndValidateEmployeeDoc(docId, employeeId, tenantCode);
        doc.setStatus(HrDocument.HrDocStatus.ACKNOWLEDGED);
        doc.setSignedAt(LocalDateTime.now());
        doc.setUpdatedAt(LocalDateTime.now());
        return hrDocRepo.save(doc);
    }

    // ── Read: employee view ───────────────────────────────────────────────────

    public List<Map<String, Object>> getMyHrDocuments(Long employeeId,
                                                        String tenantCode) {
        return hrDocRepo
                .findByEmployeeIdAndTenantCodeOrderByCreatedAtDesc(employeeId, tenantCode)
                .stream()
                .map(this::toResponseMap)
                .collect(Collectors.toList());
    }

    public long countMyPendingSignatures(Long employeeId, String tenantCode) {
        return hrDocRepo.countPendingForEmployee(employeeId, tenantCode);
    }

    // ── Read: admin view ──────────────────────────────────────────────────────

    /**
     * Returns all HR docs grouped by employee for the admin documents dashboard.
     * Merged into the same structure used by AdminDocuments.jsx so no UI changes needed.
     */
    public List<Map<String, Object>> getHrDocsGroupedByEmployee(String tenantCode,
                                                                  Long companyId) {
        List<HrDocument> allDocs = hrDocRepo.findByTenantAndCompany(tenantCode, companyId);

        Map<Long, List<HrDocument>> byEmployee = allDocs.stream()
                .collect(Collectors.groupingBy(HrDocument::getEmployeeId));

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map.Entry<Long, List<HrDocument>> entry : byEmployee.entrySet()) {
            try {
                User emp = userService.getUserById(entry.getKey());
                if (!tenantCode.equals(emp.getTenantCode())) continue;

                Map<String, Object> empData = new HashMap<>();
                empData.put("id",    emp.getId().toString());
                empData.put("name",  emp.getFullName());
                empData.put("email", emp.getEmail());
                empData.put("hrDocuments", entry.getValue().stream()
                        .map(this::toResponseMap)
                        .collect(Collectors.toList()));
                result.add(empData);
            } catch (Exception ignored) { }
        }

        result.sort((a, b) ->
                ((String) a.get("name")).compareToIgnoreCase((String) b.get("name")));

        return result;
    }

    /** Get all HR docs for a single employee (admin view) */
    public List<Map<String, Object>> getHrDocsForEmployee(Long employeeId,
                                                            String tenantCode,
                                                            Long companyId) {
        return hrDocRepo
                .findByEmployeeIdAndTenantCodeAndCompanyIdOrderByCreatedAtDesc(
                        employeeId, tenantCode, companyId)
                .stream()
                .map(this::toResponseMap)
                .collect(Collectors.toList());
    }

    // ── Admin: delete HR document ─────────────────────────────────────────────

    @Transactional
    public void adminDeleteHrDocument(Long docId, String tenantCode) {
        HrDocument doc = hrDocRepo.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if (!doc.getTenantCode().equals(tenantCode))
            throw new RuntimeException("Access denied");

        deleteCloudinaryFile(doc.getOriginalFilePublicId());
        deleteCloudinaryFile(doc.getSignedFilePublicId());
        hrDocRepo.delete(doc);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private HrDocument getAndValidateEmployeeDoc(Long docId, Long employeeId,
                                                  String tenantCode) {
        HrDocument doc = hrDocRepo.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if (!doc.getEmployeeId().equals(employeeId))
            throw new RuntimeException("Access denied: not your document");
        if (!doc.getTenantCode().equals(tenantCode))
            throw new RuntimeException("Access denied: tenant mismatch");
        return doc;
    }

    private Map<String, Object> toResponseMap(HrDocument doc) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",                doc.getId());
        m.put("docType",           doc.getDocType().name());
        m.put("title",             doc.getTitle());
        m.put("notes",             doc.getNotes());
        m.put("status",            doc.getStatus().name());
        m.put("requiresSignature", doc.getRequiresSignature());
        m.put("signerName",        doc.getSignerName());
        m.put("signedAt",          doc.getSignedAt() != null
                ? doc.getSignedAt().format(FMT) : null);
        m.put("signByDate",        doc.getSignByDate() != null
                ? doc.getSignByDate().format(FMT) : null);
        m.put("createdAt",         doc.getCreatedAt().format(FMT));
        m.put("uploadedByAdminId", doc.getUploadedByAdminId());
        m.put("employeeId",        doc.getEmployeeId());

        // Original file
        m.put("originalFileUrl",   doc.getOriginalFileUrl());
        m.put("originalFileName",  doc.getOriginalFileName());
        m.put("originalFileSize",  formatSize(doc.getOriginalFileSize()));

        // Signed file (null if not yet signed)
        m.put("signedFileUrl",     doc.getSignedFileUrl());
        m.put("signedFileName",    doc.getSignedFileName());
        m.put("signedFileSize",    formatSize(doc.getSignedFileSize()));

        // Signature image for display
        m.put("hasSignatureImage", doc.getSignatureData() != null);

        return m;
    }

    private void deleteCloudinaryFile(String publicId) {
        if (publicId != null && !publicId.isBlank()) {
            try { cloudinaryService.delete(publicId); }
            catch (Exception e) {
                System.err.println("Cloudinary delete failed [" + publicId + "]: " + e.getMessage());
            }
        }
    }

    private String formatSize(Long bytes) {
        if (bytes == null || bytes == 0) return "—";
        if (bytes < 1024)               return bytes + " B";
        if (bytes < 1024 * 1024)        return String.format("%.1f KB", bytes / 1024.0);
        return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
    }

    private String getClientIp(HttpServletRequest req) {
        if (req == null) return null;
        String xff = req.getHeader("X-Forwarded-For");
        return (xff != null && !xff.isBlank()) ? xff.split(",")[0].trim()
                : req.getRemoteAddr();
    }
}