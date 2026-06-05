//package com.samayahr.service;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.Resource;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.samayahr.entity.Document;
//import com.samayahr.entity.User;
//import com.samayahr.repository.DocumentRepository;
//import com.samayahr.repository.UserRepository;
//
//@Service
//public class DocumentService {
//
//    @Autowired
//    private DocumentRepository documentRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private CloudinaryService cloudinaryService;
//    // All documents stored on Cloudinary CDN — tenant-isolated:
//    // hrms/{tenantCode}/documents/{documentType}/
//
//    // Map frontend keys to backend enums
//    private static final Map<String, Document.DocumentType> DOCUMENT_TYPE_MAPPING =
//        Map.ofEntries(
//            Map.entry("tenthMarksheet",          Document.DocumentType.TENTH_MARKSHEET),
//            Map.entry("twelfthMarksheet",         Document.DocumentType.TWELFTH_MARKSHEET),
//            Map.entry("graduationMarksheet",      Document.DocumentType.GRADUATION_MARKSHEET),
//            Map.entry("postGraduationMarksheet",  Document.DocumentType.POST_GRADUATION_MARKSHEET),
//            Map.entry("degreeCertificate",        Document.DocumentType.DEGREE_CERTIFICATE),
//            Map.entry("aadharCard",               Document.DocumentType.AADHAR_CARD),
//            Map.entry("panCard",                  Document.DocumentType.PAN_CARD),
//            Map.entry("passportPhoto",            Document.DocumentType.PASSPORT_PHOTO),
//            Map.entry("offerLetter",              Document.DocumentType.OFFER_LETTER),
//            Map.entry("experienceLetter",         Document.DocumentType.EXPERIENCE_LETTER)
//        );
//
//    // ── Read ──────────────────────────────────────────────────────────────────
//
//    public List<Document> getCurrentUserDocuments() {
//        Long currentUserId = userService.getCurrentUser().getId();
//        return documentRepository.findByUserIdOrderByUploadedAtDesc(currentUserId);
//    }
//
//    public List<Document> getAllDocuments() {
//        return documentRepository.findAllByOrderByUploadedAtDesc();
//    }
//
//    public List<Document> getUserDocuments(Long userId) {
//        userService.getUserById(userId);
//        return documentRepository.findByUserIdOrderByUploadedAtDesc(userId);
//    }
//
//    public Document getDocumentById(Long documentId) {
//        Document document = documentRepository.findById(documentId)
//            .orElseThrow(() -> new RuntimeException(
//                "Document not found with id: " + documentId));
//
//        User currentUser = userService.getCurrentUser();
//        if (!document.getUserId().equals(currentUser.getId())
//                && !currentUser.getIsAdmin()) {
//            throw new RuntimeException(
//                "Access denied: You can only access your own documents");
//        }
//
//        return document;
//    }
//
//    // ── Upload ────────────────────────────────────────────────────────────────
//
//    @Transactional
//    public Document uploadDocument(MultipartFile file, String documentType)
//            throws Exception {
//        Long currentUserId = userService.getCurrentUser().getId();
//        return saveDocument(currentUserId, file, documentType);
//    }
//
//    @Transactional
//    public Document uploadDocumentForUser(Long userId, MultipartFile file,
//                                           String documentType) throws Exception {
//        userService.getUserById(userId); // validates user exists
//        return saveDocument(userId, file, documentType);
//    }
//
//    private Document saveDocument(Long userId, MultipartFile file,
//                                   String documentTypeKey) throws Exception {
//
//        // ── 1. Validate file ──────────────────────────────────────────────────
//        if (file == null || file.isEmpty())
//            throw new RuntimeException("Cannot upload empty file");
//
//        if (file.getSize() > 5 * 1024 * 1024)
//            throw new RuntimeException("File size exceeds 5MB");
//
//        String contentType = file.getContentType();
//        if (contentType == null
//                || (!contentType.equals("application/pdf")
//                        && !contentType.startsWith("image/")))
//            throw new RuntimeException("Only PDF and image files are allowed");
//
//        // ── 2. Map document type ──────────────────────────────────────────────
//        Document.DocumentType docType = DOCUMENT_TYPE_MAPPING.get(documentTypeKey);
//        if (docType == null)
//            throw new RuntimeException("Invalid document type: " + documentTypeKey);
//
//        // ── 3. Get tenant code for folder isolation ───────────────────────────
//        User user = userService.getUserById(userId);
//        String tenantCode = user.getTenantCode() != null
//                ? user.getTenantCode() : "global";
//
//        // ── 4. Delete old document from Cloudinary if it exists ───────────────
//        Optional<Document> existingDoc =
//                documentRepository.findByUserIdAndDocumentType(userId, docType);
//        if (existingDoc.isPresent()) {
//            deleteFromCloudinary(existingDoc.get().getCloudinaryPublicId());
//            documentRepository.delete(existingDoc.get());
//        }
//
//        // ── 5. Upload to Cloudinary ───────────────────────────────────────────
//        // Folder: hrms/{tenantCode}/documents/{documentType}/
//        String folder = "documents/" + docType.name().toLowerCase();
//        Map<String, Object> result = cloudinaryService.upload(file, tenantCode, folder);
//
//        String fileUrl  = cloudinaryService.getSecureUrl(result);
//        String publicId = cloudinaryService.getPublicId(result);
//
//        // ── 6. Persist document record ────────────────────────────────────────
//        Document document = new Document();
//        document.setUserId(userId);
//        document.setDocumentType(docType);
//        document.setFileName(file.getOriginalFilename());
//        document.setFilePath(fileUrl);              // Cloudinary https:// URL
//        document.setCloudinaryPublicId(publicId);   // stored for deletion later
//        document.setFileType(contentType);
//        document.setFileSize(file.getSize());
//        document.setStatus(Document.DocumentStatus.SUBMITTED);
//
//        return documentRepository.save(document);
//    }
//
//    // ── Update (replace file) ─────────────────────────────────────────────────
//
//    @Transactional
//    public Document updateDocument(Long documentId, MultipartFile file)
//            throws Exception {
//        Document document = getDocumentById(documentId);
//
//        if (file == null || file.isEmpty())
//            throw new RuntimeException("Cannot upload empty file");
//
//        if (file.getSize() > 5 * 1024 * 1024)
//            throw new RuntimeException("File size exceeds 5MB");
//
//        String contentType = file.getContentType();
//        if (contentType == null
//                || (!contentType.equals("application/pdf")
//                        && !contentType.startsWith("image/")))
//            throw new RuntimeException("Only PDF and image files are allowed");
//
//        // Delete old file from Cloudinary
//        deleteFromCloudinary(document.getCloudinaryPublicId());
//
//        // Upload new file to Cloudinary — same folder as document type
//        User user = userService.getUserById(document.getUserId());
//        String tenantCode = user.getTenantCode() != null
//                ? user.getTenantCode() : "global";
//        String folder = "documents/"
//                + document.getDocumentType().name().toLowerCase();
//
//        Map<String, Object> result = cloudinaryService.upload(file, tenantCode, folder);
//
//        // Update document record
//        document.setFileName(file.getOriginalFilename());
//        document.setFilePath(cloudinaryService.getSecureUrl(result));
//        document.setCloudinaryPublicId(cloudinaryService.getPublicId(result));
//        document.setFileType(contentType);
//        document.setFileSize(file.getSize());
//        document.setStatus(Document.DocumentStatus.SUBMITTED);
//        document.setUploadedAt(LocalDateTime.now());
//
//        return documentRepository.save(document);
//    }
//
//    // ── Status update (admin approve/reject) ──────────────────────────────────
//
//    @Transactional
//    public Document updateDocumentStatus(Long documentId, String statusStr,
//                                          String remarks) {
//        Document document = documentRepository.findById(documentId)
//            .orElseThrow(() -> new RuntimeException(
//                "Document not found with id: " + documentId));
//
//        Document.DocumentStatus status;
//        try {
//            status = Document.DocumentStatus.valueOf(statusStr.toUpperCase());
//        } catch (IllegalArgumentException e) {
//            throw new RuntimeException("Invalid status: " + statusStr
//                + ". Valid values are: SUBMITTED, PENDING, APPROVED, REJECTED");
//        }
//
//        User currentAdmin = userService.getCurrentUser();
//
//        document.setStatus(status);
//        document.setRemarks(remarks);
//
//        if (status == Document.DocumentStatus.APPROVED
//                || status == Document.DocumentStatus.REJECTED) {
//            document.setApprovedBy(currentAdmin.getId());
//            document.setApprovedAt(LocalDateTime.now());
//        }
//
//        return documentRepository.save(document);
//    }
//
//    // ── Download — redirect to Cloudinary URL ─────────────────────────────────
//
//    /**
//     * Documents are now on Cloudinary CDN.
//     * filePath holds the https:// Cloudinary URL — redirect the client directly.
//     * No local file reading needed.
//     */
//    public ResponseEntity<Resource> downloadDocument(Long documentId) {
//        Document document = getDocumentById(documentId);
//
//        // filePath is now a Cloudinary URL — tell client to redirect
//        return ResponseEntity
//            .status(302)
//            .header(HttpHeaders.LOCATION, document.getFilePath())
//            .header(HttpHeaders.CONTENT_DISPOSITION,
//                "attachment; filename=\"" + document.getFileName() + "\"")
//            .build();
//    }
//
//    // ── Delete ────────────────────────────────────────────────────────────────
//
//    @Transactional
//    public void deleteDocument(Long documentId) {
//        Document document = getDocumentById(documentId);
//        deleteFromCloudinary(document.getCloudinaryPublicId());
//        documentRepository.delete(document);
//    }
//
//    @Transactional
//    public void adminDeleteDocument(Long documentId) {
//        Document document = documentRepository.findById(documentId)
//            .orElseThrow(() -> new RuntimeException(
//                "Document not found with id: " + documentId));
//        deleteFromCloudinary(document.getCloudinaryPublicId());
//        documentRepository.delete(document);
//    }
//
//    // ── Admin grouped view ────────────────────────────────────────────────────
//
//    public List<Map<String, Object>> getAllDocumentsGroupedByEmployee(
//            String tenantCode, Long companyId) {
//
//        List<Document> allDocuments =
//                documentRepository.findAllByTenantCompany(tenantCode, companyId);
//
//        Map<Long, List<Document>> documentsByUser = allDocuments.stream()
//                .collect(Collectors.groupingBy(Document::getUserId));
//
//        List<Map<String, Object>> result = new ArrayList<>();
//        DateTimeFormatter dateFormatter =
//                DateTimeFormatter.ofPattern("MMM dd, yyyy");
//
//        for (Map.Entry<Long, List<Document>> entry : documentsByUser.entrySet()) {
//            Long userId = entry.getKey();
//            List<Document> userDocs = entry.getValue();
//
//            try {
//                User user = userService.getUserById(userId);
//
//                // Tenant safety check
//                if (!tenantCode.equals(user.getTenantCode())
//                        || !companyId.equals(user.getCompanyId())) {
//                    continue;
//                }
//
//                Map<String, Object> employeeData = new HashMap<>();
//                employeeData.put("id",    userId.toString());
//                employeeData.put("name",  user.getFullName());
//                employeeData.put("email", user.getEmail());
//
//                List<Map<String, Object>> documents = userDocs.stream()
//                    .map(doc -> {
//                        Map<String, Object> docData = new HashMap<>();
//                        docData.put("id",           doc.getId());
//                        docData.put("documentType", doc.getDocumentType().name());
//                        docData.put("fileName",     doc.getFileName());
//                        docData.put("fileSize",     formatFileSize(doc.getFileSize()));
//                        docData.put("uploadedOn",
//                            doc.getUploadedAt().format(dateFormatter));
//                        // filePath is now a Cloudinary https:// URL
//                        docData.put("fileUrl",  doc.getFilePath());
//                        docData.put("status",   doc.getStatus().name());
//                        return docData;
//                    })
//                    .collect(Collectors.toList());
//
//                employeeData.put("documents", documents);
//                result.add(employeeData);
//
//            } catch (Exception ignored) { }
//        }
//
//        result.sort((a, b) ->
//            ((String) a.get("name")).compareToIgnoreCase((String) b.get("name")));
//
//        return result;
//    }
//
//    // ── Passport photo ────────────────────────────────────────────────────────
//
//    /**
//     * Returns the Cloudinary URL of the current user's passport photo.
//     * filePath now holds the https:// Cloudinary URL directly.
//     */
//    public String getCurrentUserPassportPhotoUrl() {
//        try {
//            org.springframework.security.core.Authentication auth =
//                SecurityContextHolder.getContext().getAuthentication();
//            String email = auth.getName();
//
//            User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//            return documentRepository
//                .findByUserIdAndDocumentType(
//                    user.getId(), Document.DocumentType.PASSPORT_PHOTO)
//                .map(Document::getFilePath)   // Cloudinary URL stored in filePath
//                .orElse(null);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//
//    // ── Status list ───────────────────────────────────────────────────────────
//
//    public List<Document> getDocumentsByStatus(String statusStr) {
//        Document.DocumentStatus status;
//        try {
//            status = Document.DocumentStatus.valueOf(statusStr.toUpperCase());
//        } catch (IllegalArgumentException e) {
//            throw new RuntimeException("Invalid status: " + statusStr);
//        }
//        return documentRepository.findByStatusOrderByUploadedAtDesc(status);
//    }
//
//    // ── Private helpers ───────────────────────────────────────────────────────
//
//    /**
//     * Deletes a file from Cloudinary by its public_id.
//     * Silently ignores failures so they never block the main operation.
//     */
//    private void deleteFromCloudinary(String publicId) {
//        if (publicId != null && !publicId.isEmpty()) {
//            try {
//                cloudinaryService.delete(publicId);
//            } catch (Exception e) {
//                System.err.println("Could not delete Cloudinary file ["
//                    + publicId + "]: " + e.getMessage());
//            }
//        }
//    }
//
//    private String formatFileSize(Long bytes) {
//        if (bytes == null || bytes == 0) return "0 KB";
//        if (bytes < 1024)               return bytes + " B";
//        if (bytes < 1024 * 1024)        return String.format("%.2f KB", bytes / 1024.0);
//        return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
//    }
//}
package com.samayahr.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.entity.Document;
import com.samayahr.entity.User;
import com.samayahr.repository.DocumentRepository;
import com.samayahr.repository.UserRepository;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Map frontend keys to backend enums
    private static final Map<String, Document.DocumentType> DOCUMENT_TYPE_MAPPING =
        Map.ofEntries(
            Map.entry("tenthMarksheet",          Document.DocumentType.TENTH_MARKSHEET),
            Map.entry("twelfthMarksheet",         Document.DocumentType.TWELFTH_MARKSHEET),
            Map.entry("graduationMarksheet",      Document.DocumentType.GRADUATION_MARKSHEET),
            Map.entry("postGraduationMarksheet",  Document.DocumentType.POST_GRADUATION_MARKSHEET),
            Map.entry("degreeCertificate",        Document.DocumentType.DEGREE_CERTIFICATE),
            Map.entry("aadharCard",               Document.DocumentType.AADHAR_CARD),
            Map.entry("panCard",                  Document.DocumentType.PAN_CARD),
            Map.entry("passportPhoto",            Document.DocumentType.PASSPORT_PHOTO),
            Map.entry("offerLetter",              Document.DocumentType.OFFER_LETTER),
            Map.entry("experienceLetter",         Document.DocumentType.EXPERIENCE_LETTER)
        );

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Document> getCurrentUserDocuments() {
        Long currentUserId = userService.getCurrentUser().getId();
        return documentRepository.findByUserIdOrderByUploadedAtDesc(currentUserId);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAllByOrderByUploadedAtDesc();
    }

    public List<Document> getUserDocuments(Long userId) {
        userService.getUserById(userId);
        return documentRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }

    public Document getDocumentById(Long documentId) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException(
                "Document not found with id: " + documentId));

        User currentUser = userService.getCurrentUser();
        if (!document.getUserId().equals(currentUser.getId())
                && !currentUser.getIsAdmin()) {
            throw new RuntimeException(
                "Access denied: You can only access your own documents");
        }

        return document;
    }

    // ── Upload ────────────────────────────────────────────────────────────────

    @Transactional
    public Document uploadDocument(MultipartFile file, String documentType)
            throws Exception {
        Long currentUserId = userService.getCurrentUser().getId();
        return saveDocument(currentUserId, file, documentType);
    }

    @Transactional
    public Document uploadDocumentForUser(Long userId, MultipartFile file,
                                           String documentType) throws Exception {
        userService.getUserById(userId);
        return saveDocument(userId, file, documentType);
    }

    private Document saveDocument(Long userId, MultipartFile file,
                                   String documentTypeKey) throws Exception {

        // ── 1. Validate file ──────────────────────────────────────────────────
        if (file == null || file.isEmpty())
            throw new RuntimeException("Cannot upload empty file");

        if (file.getSize() > 5 * 1024 * 1024)
            throw new RuntimeException("File size exceeds 5MB");

        String contentType = file.getContentType();
        if (contentType == null
                || (!contentType.equals("application/pdf")
                        && !contentType.startsWith("image/")))
            throw new RuntimeException("Only PDF and image files are allowed");

        // ── 2. Map document type ──────────────────────────────────────────────
        Document.DocumentType docType = DOCUMENT_TYPE_MAPPING.get(documentTypeKey);
        if (docType == null)
            throw new RuntimeException("Invalid document type: " + documentTypeKey);

        // ── 3. Get tenant code ────────────────────────────────────────────────
        User user = userService.getUserById(userId);
        String tenantCode = user.getTenantCode() != null
                ? user.getTenantCode() : "global";

        // ── 4. Delete old document from Cloudinary if it exists ───────────────
        Optional<Document> existingDoc =
                documentRepository.findByUserIdAndDocumentType(userId, docType);
        if (existingDoc.isPresent()) {
            deleteFromCloudinary(existingDoc.get().getCloudinaryPublicId());
            documentRepository.delete(existingDoc.get());
        }

        // ── 5. Upload to Cloudinary ───────────────────────────────────────────
        // CloudinaryService.upload() now correctly uses resource_type=raw for PDFs
        // and resource_type=image for images — fixing "We can't open this file".
        String folder = "documents/" + docType.name().toLowerCase();
        Map<String, Object> result = cloudinaryService.upload(file, tenantCode, folder);

        // getSecureUrl() also fixes /image/upload/ → /raw/upload/ for PDFs
        String fileUrl  = cloudinaryService.getSecureUrl(result);
        String publicId = cloudinaryService.getPublicId(result);

        // ── 6. Persist document record ────────────────────────────────────────
        Document document = new Document();
        document.setUserId(userId);
        document.setDocumentType(docType);
        document.setFileName(file.getOriginalFilename());
        document.setFilePath(fileUrl);
        document.setCloudinaryPublicId(publicId);
        document.setFileType(contentType);
        document.setFileSize(file.getSize());
        document.setStatus(Document.DocumentStatus.SUBMITTED);

        return documentRepository.save(document);
    }

    // ── Update (replace file) ─────────────────────────────────────────────────

    @Transactional
    public Document updateDocument(Long documentId, MultipartFile file)
            throws Exception {
        Document document = getDocumentById(documentId);

        if (file == null || file.isEmpty())
            throw new RuntimeException("Cannot upload empty file");

        if (file.getSize() > 5 * 1024 * 1024)
            throw new RuntimeException("File size exceeds 5MB");

        String contentType = file.getContentType();
        if (contentType == null
                || (!contentType.equals("application/pdf")
                        && !contentType.startsWith("image/")))
            throw new RuntimeException("Only PDF and image files are allowed");

        deleteFromCloudinary(document.getCloudinaryPublicId());

        User user = userService.getUserById(document.getUserId());
        String tenantCode = user.getTenantCode() != null
                ? user.getTenantCode() : "global";
        String folder = "documents/" + document.getDocumentType().name().toLowerCase();

        Map<String, Object> result = cloudinaryService.upload(file, tenantCode, folder);

        document.setFileName(file.getOriginalFilename());
        document.setFilePath(cloudinaryService.getSecureUrl(result));
        document.setCloudinaryPublicId(cloudinaryService.getPublicId(result));
        document.setFileType(contentType);
        document.setFileSize(file.getSize());
        document.setStatus(Document.DocumentStatus.SUBMITTED);
        document.setUploadedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    // ── Status update ─────────────────────────────────────────────────────────

    @Transactional
    public Document updateDocumentStatus(Long documentId, String statusStr,
                                          String remarks) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException(
                "Document not found with id: " + documentId));

        Document.DocumentStatus status;
        try {
            status = Document.DocumentStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + statusStr
                + ". Valid values: SUBMITTED, PENDING, APPROVED, REJECTED");
        }

        User currentAdmin = userService.getCurrentUser();
        document.setStatus(status);
        document.setRemarks(remarks);

        if (status == Document.DocumentStatus.APPROVED
                || status == Document.DocumentStatus.REJECTED) {
            document.setApprovedBy(currentAdmin.getId());
            document.setApprovedAt(LocalDateTime.now());
        }

        return documentRepository.save(document);
    }

    // ── Download — ✅ FIXED ───────────────────────────────────────────────────
    //
    //  OLD CODE problem:
    //  Used HTTP 302 redirect → browser followed redirect to Cloudinary URL
    //  but for raw/PDF files the URL had /image/upload/ so content-type was wrong.
    //  Result: "We can't open this file".
    //
    //  NEW CODE fix:
    //  We fetch the file bytes from Cloudinary on the server side, then stream
    //  them to the client with the correct Content-Type and Content-Disposition.
    //  This guarantees the browser receives the file with the right headers.
    //
    //  Fallback: If fetching bytes fails, we still redirect but with corrected URL.
    // ─────────────────────────────────────────────────────────────────────────
    public ResponseEntity<Resource> downloadDocument(Long documentId) {
        Document document = getDocumentById(documentId);
        String fileUrl   = document.getFilePath();
        String fileName  = document.getFileName() != null
                ? document.getFileName() : "document";
        String fileType  = document.getFileType() != null
                ? document.getFileType() : "application/octet-stream";

        // ── Determine correct Content-Type ────────────────────────────────────
        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(fileType);
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        // ── Fix URL if it has wrong path segment for PDFs ─────────────────────
        boolean isPdf = "application/pdf".equals(fileType);
        if (isPdf && fileUrl != null && fileUrl.contains("/image/upload/")) {
            fileUrl = fileUrl.replace("/image/upload/", "/raw/upload/");
        }

        // ── Try to fetch file bytes from Cloudinary and stream to client ───────
        try {
            URL url = new URL(fileUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(30000);
            connection.connect();

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (InputStream inputStream = connection.getInputStream()) {
                    byte[] bytes = inputStream.readAllBytes();
                    ByteArrayResource resource = new ByteArrayResource(bytes);

                    return ResponseEntity.ok()
                        .contentType(mediaType)
                        .contentLength(bytes.length)
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + fileName + "\"")
                        .header("Cache-Control", "no-cache")
                        .body(resource);
                }
            }
        } catch (IOException e) {
            System.err.println("Could not fetch file from Cloudinary, falling back to redirect: "
                    + e.getMessage());
        }

        // ── Fallback: redirect with corrected URL ─────────────────────────────
        return ResponseEntity
            .status(302)
            .header(HttpHeaders.LOCATION, fileUrl)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + fileName + "\"")
            .build();
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void deleteDocument(Long documentId) {
        Document document = getDocumentById(documentId);
        deleteFromCloudinary(document.getCloudinaryPublicId());
        documentRepository.delete(document);
    }

    @Transactional
    public void adminDeleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException(
                "Document not found with id: " + documentId));
        deleteFromCloudinary(document.getCloudinaryPublicId());
        documentRepository.delete(document);
    }

    // ── Admin grouped view ────────────────────────────────────────────────────

    public List<Map<String, Object>> getAllDocumentsGroupedByEmployee(
            String tenantCode, Long companyId) {

        List<Document> allDocuments =
                documentRepository.findAllByTenantCompany(tenantCode, companyId);

        Map<Long, List<Document>> documentsByUser = allDocuments.stream()
                .collect(Collectors.groupingBy(Document::getUserId));

        List<Map<String, Object>> result = new ArrayList<>();
        DateTimeFormatter dateFormatter  = DateTimeFormatter.ofPattern("MMM dd, yyyy");

        for (Map.Entry<Long, List<Document>> entry : documentsByUser.entrySet()) {
            Long userId      = entry.getKey();
            List<Document> userDocs = entry.getValue();

            try {
                User user = userService.getUserById(userId);

                if (!tenantCode.equals(user.getTenantCode())
                        || !companyId.equals(user.getCompanyId())) {
                    continue;
                }

                Map<String, Object> employeeData = new HashMap<>();
                employeeData.put("id",    userId.toString());
                employeeData.put("name",  user.getFullName());
                employeeData.put("email", user.getEmail());

                List<Map<String, Object>> documents = userDocs.stream()
                    .map(doc -> {
                        // ✅ Fix URL for PDFs before sending to frontend
                        String url = doc.getFilePath();
                        if ("application/pdf".equals(doc.getFileType())
                                && url != null && url.contains("/image/upload/")) {
                            url = url.replace("/image/upload/", "/raw/upload/");
                        }

                        // ✅ Fix signed file URL for PDFs too
                        String signedUrl = doc.getSignedFileUrl();
                        if (signedUrl != null && signedUrl.contains("/image/upload/")) {
                            signedUrl = signedUrl.replace("/image/upload/", "/raw/upload/");
                        }

                        Map<String, Object> docData = new HashMap<>();
                        docData.put("id",              doc.getId());
                        docData.put("documentType",    doc.getDocumentType().name());
                        docData.put("fileName",        doc.getFileName());
                        docData.put("fileSize",        formatFileSize(doc.getFileSize()));
                        docData.put("uploadedOn",      doc.getUploadedAt().format(dateFormatter));
                        docData.put("fileUrl",         url);          // original file URL (corrected)
                        docData.put("status",          doc.getStatus().name());
                        // ── Signed document fields ─────────────────────────────
                        docData.put("signedFileUrl",   signedUrl);    // null if not signed
                        docData.put("signerName",      doc.getSignerName());
                        docData.put("signed",          Boolean.TRUE.equals(doc.getSigned()));
                        docData.put("signedAt",        doc.getSignedAt() != null
                            ? doc.getSignedAt().toLocalDate().toString() : null);
                        return docData;
                    })
                    .collect(Collectors.toList());

                employeeData.put("documents", documents);
                result.add(employeeData);

            } catch (Exception ignored) { }
        }

        result.sort((a, b) ->
            ((String) a.get("name")).compareToIgnoreCase((String) b.get("name")));

        return result;
    }

    // ── Passport photo ────────────────────────────────────────────────────────

    public String getCurrentUserPassportPhotoUrl() {
        try {
            org.springframework.security.core.Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            return documentRepository
                .findByUserIdAndDocumentType(
                    user.getId(), Document.DocumentType.PASSPORT_PHOTO)
                .map(Document::getFilePath)
                .orElse(null);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // ── Status list ───────────────────────────────────────────────────────────

    public List<Document> getDocumentsByStatus(String statusStr) {
        Document.DocumentStatus status;
        try {
            status = Document.DocumentStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + statusStr);
        }
        return documentRepository.findByStatusOrderByUploadedAtDesc(status);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private void deleteFromCloudinary(String publicId) {
        if (publicId != null && !publicId.isEmpty()) {
            try {
                cloudinaryService.delete(publicId);
            } catch (Exception e) {
                System.err.println("Could not delete Cloudinary file ["
                    + publicId + "]: " + e.getMessage());
            }
        }
    }

    private String formatFileSize(Long bytes) {
        if (bytes == null || bytes == 0) return "0 KB";
        if (bytes < 1024)               return bytes + " B";
        if (bytes < 1024 * 1024)        return String.format("%.2f KB", bytes / 1024.0);
        return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
    }
}