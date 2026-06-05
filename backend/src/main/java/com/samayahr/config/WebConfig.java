package com.samayahr.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /*
     * All media files (profile photos, bank proofs, offer letters) are now
     * stored on Cloudinary CDN — not on local disk.
     *
     * Cloudinary folder structure (tenant-isolated):
     *   hrms/{tenantCode}/profile_photos/   ← profile photos
     *   hrms/{tenantCode}/bank_proofs/      ← bank proof documents
     *   hrms/{tenantCode}/offer_letters/    ← offer letters (PDF/image)
     *
     * No local /uploads/** serving required.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // No local file serving — Cloudinary CDN handles all media
    }
}