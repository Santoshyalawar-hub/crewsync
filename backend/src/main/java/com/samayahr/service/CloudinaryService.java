package com.samayahr.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}")    String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key",    apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure",     "true");

        this.cloudinary = new Cloudinary(config);
    }

    public Cloudinary getCloudinary() {
        return this.cloudinary;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  MAIN UPLOAD METHOD
    //  ✅ FIXED: PDFs use resource_type=raw so browser can open them correctly.
    //  Old code used resource_type=auto or image which caused:
    //  "We can't open this file" when clicking View/Download on a PDF.
    //
    //  How Cloudinary resource types work:
    //  - resource_type=image → serves as image, browser can't render as PDF
    //  - resource_type=raw   → serves file as-is with correct content-type
    //  - resource_type=auto  → Cloudinary decides, sometimes wrong for PDFs
    //
    //  Rule we use:
    //  - PDF files  → resource_type=raw
    //  - Image files → resource_type=image
    // ─────────────────────────────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    public Map<String, Object> upload(MultipartFile file, String tenantCode,
                                       String folder) throws IOException {
        String fullFolder  = String.format("hrms/%s/%s", tenantCode, folder);
        String contentType = file.getContentType();
        boolean isPdf      = contentType != null && contentType.equals("application/pdf");

        Map<String, Object> options = new HashMap<>();
        options.put("folder",          fullFolder);
        options.put("resource_type",   isPdf ? "raw" : "image"); // ← KEY FIX
        options.put("use_filename",    true);
        options.put("unique_filename", true);
        options.put("overwrite",       false);

        return (Map<String, Object>) cloudinary.uploader()
                .upload(file.getBytes(), options);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  IMAGE-ONLY UPLOAD (profile photos, passport photos)
    //  Never call this for PDFs. Only for confirmed image/* content-type.
    // ─────────────────────────────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadImage(MultipartFile file, String tenantCode,
                                            String folder) throws IOException {
        String fullFolder = String.format("hrms/%s/%s", tenantCode, folder);

        Map<String, Object> transformation = new HashMap<>();
        transformation.put("width",   1200);
        transformation.put("height",  1200);
        transformation.put("crop",    "limit");
        transformation.put("quality", "auto");

        Map<String, Object> options = new HashMap<>();
        options.put("folder",          fullFolder);
        options.put("resource_type",   "image");
        options.put("use_filename",    true);
        options.put("unique_filename", true);
        options.put("overwrite",       false);
        options.put("transformation",  transformation);

        return (Map<String, Object>) cloudinary.uploader()
                .upload(file.getBytes(), options);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  RAW BYTES UPLOAD — EXISTING (used by PayrollService for PDF payslips)
    //  Caller provides full options map including resource_type.
    // ─────────────────────────────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadRawBytes(byte[] bytes,
                                               Map<String, Object> options)
            throws IOException {
        return (Map<String, Object>) cloudinary.uploader().upload(bytes, options);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  RAW BYTES UPLOAD — NEW (used by HrDocumentService for signed documents)
    // ─────────────────────────────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadRawBytes(byte[] bytes,
                                               String mimeType,
                                               String fileName,
                                               String tenantCode,
                                               String folder) throws IOException {
        boolean isPdf     = mimeType != null && mimeType.equals("application/pdf");
        String fullFolder = String.format("hrms/%s/%s", tenantCode, folder);
        String safeName   = (fileName != null)
                ? fileName.replaceAll("[^a-zA-Z0-9_\\-.]", "_").replaceAll("\\..*$", "")
                : "signed_" + System.currentTimeMillis();

        Map<String, Object> options = new HashMap<>();
        options.put("folder",          fullFolder);
        options.put("resource_type",   isPdf ? "raw" : "image");
        options.put("public_id",       safeName + "_" + System.currentTimeMillis());
        options.put("use_filename",    true);
        options.put("unique_filename", true);
        options.put("overwrite",       false);

        return (Map<String, Object>) cloudinary.uploader().upload(bytes, options);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  getSecureUrl — ✅ FIXED
    //
    //  Problem: When resource_type=raw, Cloudinary sometimes still returns
    //  a secure_url containing /image/upload/ instead of /raw/upload/.
    //  When the browser opens an /image/upload/ URL for a PDF, it gets
    //  served as an image content-type and shows "We can't open this file".
    //
    //  Fix: If Cloudinary stored it as "raw" but gave an /image/upload/ URL,
    //  replace the path segment so the URL is correct.
    // ─────────────────────────────────────────────────────────────────────────
    public String getSecureUrl(Map<String, Object> result) {
        String url          = (String) result.getOrDefault("secure_url", "");
        String resourceType = (String) result.getOrDefault("resource_type", "image");

        // Correct URL path for raw resources
        if ("raw".equals(resourceType) && url.contains("/image/upload/")) {
            url = url.replace("/image/upload/", "/raw/upload/");
        }

        return url;
    }

    public String getPublicId(Map<String, Object> result) {
        return (String) result.getOrDefault("public_id", "");
    }

    public String getFormat(Map<String, Object> result) {
        return (String) result.getOrDefault("format", "");
    }

    public Long getBytes(Map<String, Object> result) {
        Object bytes = result.get("bytes");
        if (bytes instanceof Integer) return ((Integer) bytes).longValue();
        if (bytes instanceof Long)    return (Long) bytes;
        return 0L;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  DELETE — ✅ FIXED
    //
    //  Problem: Old code always used resource_type=auto or image.
    //  PDFs are stored as resource_type=raw, so image delete silently failed.
    //  The file stayed in Cloudinary even after employee deleted from UI.
    //
    //  Fix: Try raw delete first (covers PDFs), fall back to image (covers JPG/PNG).
    // ─────────────────────────────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    public Map<String, Object> delete(String publicId) throws IOException {
        // Step 1: Try raw delete — covers PDFs uploaded with resource_type=raw
        try {
            Map<String, Object> rawOpts = new HashMap<>();
            rawOpts.put("resource_type", "raw");
            Map<String, Object> rawResult = (Map<String, Object>)
                    cloudinary.uploader().destroy(publicId, rawOpts);
            if ("ok".equals(rawResult.get("result"))) {
                return rawResult;
            }
        } catch (Exception ignored) { }

        // Step 2: Fall back to image delete — covers JPG/PNG
        Map<String, Object> imgOpts = new HashMap<>();
        imgOpts.put("resource_type", "image");
        return (Map<String, Object>) cloudinary.uploader().destroy(publicId, imgOpts);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> deleteRaw(String publicId) throws IOException {
        Map<String, Object> options = new HashMap<>();
        options.put("resource_type", "raw");
        return (Map<String, Object>) cloudinary.uploader().destroy(publicId, options);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> deleteImage(String publicId) throws IOException {
        Map<String, Object> options = new HashMap<>();
        options.put("resource_type", "image");
        return (Map<String, Object>) cloudinary.uploader().destroy(publicId, options);
    }
}