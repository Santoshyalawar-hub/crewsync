package com.samayahr.service;

import com.samayahr.entity.Reimbursement;
import com.samayahr.entity.TaxDeclaration;
import com.samayahr.repository.ReimbursementRepository;
import com.samayahr.repository.TaxDeclarationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FinanceService {

    // FIX: removed @RequiredArgsConstructor — fields were not final so
    //      Lombok generated a no-arg constructor and nothing got injected.
    //      Using @Autowired field injection to match the rest of the codebase.
    @Autowired
    private ReimbursementRepository reimbursementRepository;

    @Autowired
    private TaxDeclarationRepository taxDeclarationRepository;

    @Autowired
    private UserService userService;

    // ── Reimbursement ─────────────────────────────────────────────────────────

    public List<Reimbursement> getReimbursements() {
        return reimbursementRepository
                .findByUserId(userService.getCurrentUser().getId());
    }

    public List<Reimbursement> getAllReimbursements() {
        return reimbursementRepository.findAll();
    }

    @Transactional
    public Reimbursement createReimbursement(Reimbursement reimbursement) {
        reimbursement.setUserId(userService.getCurrentUser().getId());
        reimbursement.setStatus(Reimbursement.ReimbursementStatus.PENDING);
        return reimbursementRepository.save(reimbursement);
    }

    @Transactional
    public void approveReimbursement(Long id, Long approvedBy) {
        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reimbursement not found"));

        reimbursement.setStatus(Reimbursement.ReimbursementStatus.APPROVED);
        reimbursement.setApprovedBy(approvedBy);
        reimbursement.setApprovedAt(LocalDateTime.now());
        reimbursementRepository.save(reimbursement);
    }

    @Transactional
    public void rejectReimbursement(Long id, Long approvedBy, String reason) {
        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reimbursement not found"));

        reimbursement.setStatus(Reimbursement.ReimbursementStatus.REJECTED);
        reimbursement.setApprovedBy(approvedBy);
        reimbursement.setApprovedAt(LocalDateTime.now());
        reimbursement.setRejectionReason(reason);
        reimbursementRepository.save(reimbursement);
    }

    @Transactional
    public void markReimbursementAsPaid(Long id) {
        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reimbursement not found"));

        reimbursement.setStatus(Reimbursement.ReimbursementStatus.PAID);
        reimbursement.setPaymentDate(java.time.LocalDate.now());
        reimbursementRepository.save(reimbursement);
    }

    // ── Tax Declaration ───────────────────────────────────────────────────────

    public List<TaxDeclaration> getTaxDeclarations() {
        return taxDeclarationRepository
                .findByUserId(userService.getCurrentUser().getId());
    }

    public List<TaxDeclaration> getAllTaxDeclarations() {
        return taxDeclarationRepository.findAll();
    }

    @Transactional
    public TaxDeclaration createTaxDeclaration(TaxDeclaration taxDeclaration) {
        taxDeclaration.setUserId(userService.getCurrentUser().getId());
        taxDeclaration.setStatus(TaxDeclaration.TaxStatus.PENDING);
        return taxDeclarationRepository.save(taxDeclaration);
    }

    @Transactional
    public void approveTaxDeclaration(Long id, Long approvedBy) {
        TaxDeclaration taxDeclaration = taxDeclarationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tax declaration not found"));

        taxDeclaration.setStatus(TaxDeclaration.TaxStatus.APPROVED);
        taxDeclaration.setApprovedBy(approvedBy);
        taxDeclaration.setApprovedAt(LocalDateTime.now());
        taxDeclarationRepository.save(taxDeclaration);
    }

    @Transactional
    public void rejectTaxDeclaration(Long id, Long approvedBy, String reason) {
        TaxDeclaration taxDeclaration = taxDeclarationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tax declaration not found"));

        taxDeclaration.setStatus(TaxDeclaration.TaxStatus.REJECTED);
        taxDeclaration.setApprovedBy(approvedBy);
        taxDeclaration.setApprovedAt(LocalDateTime.now());
        taxDeclaration.setRejectionReason(reason);
        taxDeclarationRepository.save(taxDeclaration);
    }
}
