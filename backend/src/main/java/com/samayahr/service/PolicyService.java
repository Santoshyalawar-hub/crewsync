package com.samayahr.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.samayahr.entity.Policy;
import com.samayahr.repository.PolicyRepository;
import com.samayahr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired(required = false)
    private Cloudinary cloudinary;

    @Autowired
    private UserRepository userRepository;

    /* ── Get all active policies for a tenant ── */
    public List<Policy> getPoliciesByTenant(String tenantCode) {
        return policyRepository.findByTenantCodeAndIsActiveTrueOrderByCreatedAtDesc(tenantCode);
    }

    /* ── Get all policies for a tenant (including inactive) ── */
    public List<Policy> getAllPoliciesByTenant(String tenantCode) {
        return policyRepository.findByTenantCodeOrderByCreatedAtDesc(tenantCode);
    }

    /* ── Get active policies for a tenant filtered by type ── */
    public List<Policy> getPoliciesByTenantAndType(String tenantCode, String policyType) {
        return policyRepository.findByTenantCodeAndPolicyTypeAndIsActiveTrueOrderByCreatedAtDesc(tenantCode, policyType);
    }

    /* ── Create a new policy ── */
    public Policy createPolicy(
            String title,
            String description,
            String tenantCode,
            Long companyId,
            Long createdBy,
            String policyType,
            MultipartFile file) throws IOException {

        Policy policy = new Policy();
        policy.setTitle(title);
        policy.setDescription(description);
        policy.setTenantCode(tenantCode);
        policy.setCompanyId(companyId);
        policy.setCreatedBy(createdBy);
        policy.setPolicyType(policyType != null && !policyType.isBlank() ? policyType : "COMPANY_POLICY");
        policy.setIsActive(true);

        // Resolve creator name
        if (createdBy != null) {
            userRepository.findById(createdBy).ifPresent(u -> policy.setCreatedByName(u.getFullName()));
        }

        // Upload file to Cloudinary if provided
        if (file != null && !file.isEmpty() && cloudinary != null) {
            try {
                Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder",   "hrms/" + tenantCode + "/policies",
                    "resource_type", "auto",
                    "public_id", "policy_" + System.currentTimeMillis()
                ));
                policy.setFileUrl((String) result.get("secure_url"));
                policy.setFileName(file.getOriginalFilename());
                policy.setFileType(file.getContentType());
            } catch (IOException e) {
                throw new IOException("Failed to upload policy file: " + e.getMessage(), e);
            }
        }

        return policyRepository.save(policy);
    }

    /* ── Get policy by ID ── */
    public Optional<Policy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }

    /* ── Soft-delete a policy ── */
    public void deletePolicy(Long id) {
        policyRepository.findById(id).ifPresent(p -> {
            p.setIsActive(false);
            policyRepository.save(p);
        });
    }

    /* ── Hard-delete a policy ── */
    public void hardDeletePolicy(Long id) {
        policyRepository.deleteById(id);
    }

    /* ── Count active policies for a tenant ── */
    public long countByTenant(String tenantCode) {
        return policyRepository.countByTenantCodeAndIsActiveTrue(tenantCode);
    }
}
