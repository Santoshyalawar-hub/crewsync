package com.samayahr.service;

import com.samayahr.dto.request.BankDetailRequest;
import com.samayahr.entity.EmployeeBankDetail;
import com.samayahr.entity.User;
import com.samayahr.repository.EmployeeBankDetailRepository;
import com.samayahr.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EmployeeBankService {

    @Autowired
    private EmployeeBankDetailRepository bankRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CloudinaryService cloudinaryService;

    // ── Save or update bank details ───────────────────────────────────────────

    @Transactional
    public EmployeeBankDetail saveOrUpdate(Long userId, String tenantCode, BankDetailRequest req) {
        User user = userRepo.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + userId));

        if (!tenantCode.equals(user.getTenantCode())) {
            throw new RuntimeException("Access denied: employee does not belong to this company");
        }

        if (req.getAccountNumber() != null && req.getConfirmAccountNumber() != null
                && !req.getAccountNumber().equals(req.getConfirmAccountNumber())) {
            throw new RuntimeException("Account number and confirm account number do not match");
        }

        EmployeeBankDetail detail = bankRepo
                .findByUserIdAndTenantCode(userId, tenantCode)
                .orElse(new EmployeeBankDetail());

        detail.setUser(user);
        detail.setTenantCode(tenantCode);
        detail.setCompanyId(user.getCompanyId());

        detail.setBankName(req.getBankName());
        detail.setAccountHolderName(req.getAccountHolderName());
        detail.setAccountNumber(req.getAccountNumber());
        detail.setConfirmAccountNumber(req.getConfirmAccountNumber());
        detail.setIfscCode(req.getIfscCode());
        detail.setBranchName(req.getBranchName());
        detail.setBranchAddress(req.getBranchAddress());
        detail.setMicrCode(req.getMicrCode());
        detail.setSwiftCode(req.getSwiftCode());
        detail.setProofDocumentType(req.getProofDocumentType());

        if (req.getAccountType() != null) {
            try { detail.setAccountType(EmployeeBankDetail.AccountType.valueOf(req.getAccountType().toUpperCase())); }
            catch (IllegalArgumentException ignored) { detail.setAccountType(EmployeeBankDetail.AccountType.SAVINGS); }
        }

        return bankRepo.save(detail);
    }

    // ── Upload proof document via Cloudinary ──────────────────────────────────

    @Transactional
    public EmployeeBankDetail uploadProofDocument(Long userId, String tenantCode, MultipartFile file,
                                                   String proofDocumentType) throws IOException {
        User user = userRepo.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + userId));

        if (!tenantCode.equals(user.getTenantCode())) {
            throw new RuntimeException("Access denied");
        }

        EmployeeBankDetail detail = bankRepo
                .findByUserIdAndTenantCode(userId, tenantCode)
                .orElseGet(() -> {
                    EmployeeBankDetail d = new EmployeeBankDetail();
                    d.setUser(user);
                    d.setTenantCode(tenantCode);
                    d.setCompanyId(user.getCompanyId());
                    return d;
                });

        // Delete old document from Cloudinary if exists
        if (detail.getProofDocumentPublicId() != null) {
            try { cloudinaryService.delete(detail.getProofDocumentPublicId()); }
            catch (Exception ignored) { /* log in production */ }
        }

        Map<String, Object> result = cloudinaryService.upload(file, tenantCode, "bank_proofs");
        detail.setProofDocumentUrl(cloudinaryService.getSecureUrl(result));
        detail.setProofDocumentPublicId(cloudinaryService.getPublicId(result));
        if (proofDocumentType != null) detail.setProofDocumentType(proofDocumentType);
        detail.setVerificationStatus(EmployeeBankDetail.VerificationStatus.PENDING);

        return bankRepo.save(detail);
    }

    // ── Verify bank details ───────────────────────────────────────────────────

    @Transactional
    public EmployeeBankDetail verify(Long bankDetailId, String tenantCode, Long verifiedByUserId,
                                      boolean approved, String rejectionReason) {
        EmployeeBankDetail detail = bankRepo.findById(bankDetailId)
                .orElseThrow(() -> new RuntimeException("Bank detail not found"));

        if (!tenantCode.equals(detail.getTenantCode())) {
            throw new RuntimeException("Access denied");
        }

        if (approved) {
            detail.setVerificationStatus(EmployeeBankDetail.VerificationStatus.VERIFIED);
            detail.setRejectionReason(null);
        } else {
            detail.setVerificationStatus(EmployeeBankDetail.VerificationStatus.REJECTED);
            detail.setRejectionReason(rejectionReason);
        }
        detail.setVerifiedBy(verifiedByUserId);
        detail.setVerifiedAt(java.time.LocalDateTime.now());

        return bankRepo.save(detail);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public Optional<EmployeeBankDetail> findByUserAndTenant(Long userId, String tenantCode) {
        return bankRepo.findByUserIdAndTenantCode(userId, tenantCode);
    }

    public List<EmployeeBankDetail> findAllByTenant(String tenantCode) {
        return bankRepo.findByTenantCode(tenantCode);
    }

    public List<EmployeeBankDetail> findPendingVerifications(String tenantCode) {
        return bankRepo.findPendingVerificationsByTenant(tenantCode);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void delete(Long userId, String tenantCode) {
        bankRepo.findByUserIdAndTenantCode(userId, tenantCode).ifPresent(d -> {
            if (d.getProofDocumentPublicId() != null) {
                try { cloudinaryService.delete(d.getProofDocumentPublicId()); }
                catch (Exception ignored) { /* log in production */ }
            }
            bankRepo.delete(d);
        });
    }
}