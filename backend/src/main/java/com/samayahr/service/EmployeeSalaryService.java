package com.samayahr.service;

import com.samayahr.dto.request.SalaryDetailRequest;
import com.samayahr.dto.request.SalaryComponentRequest;
import com.samayahr.entity.EmployeeSalaryComponent;
import com.samayahr.entity.EmployeeSalaryDetail;
import com.samayahr.entity.User;
import com.samayahr.repository.EmployeeSalaryComponentRepository;
import com.samayahr.repository.EmployeeSalaryDetailRepository;
import com.samayahr.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.math.BigDecimal;

@Service
public class EmployeeSalaryService {

    @Autowired
    private EmployeeSalaryDetailRepository salaryRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmployeeSalaryComponentRepository componentRepo;

    // ── Save or update ────────────────────────────────────────────────────────

    @Transactional
    public EmployeeSalaryDetail saveOrUpdate(Long userId, String tenantCode, SalaryDetailRequest req) {
        // Verify the user belongs to this tenant
        User user = userRepo.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + userId));

        if (!tenantCode.equals(user.getTenantCode())) {
            throw new RuntimeException("Access denied: employee does not belong to this company");
        }

        EmployeeSalaryDetail detail = salaryRepo
                .findByUserIdAndTenantCode(userId, tenantCode)
                .orElse(new EmployeeSalaryDetail());

        detail.setUser(user);
        detail.setTenantCode(tenantCode);
        detail.setCompanyId(user.getCompanyId());

        // CTC & Gross
        detail.setAnnualCtc(req.getAnnualCtc());
        detail.setMonthlyGross(req.getMonthlyGross());

        // Earnings
        detail.setBasicSalary(req.getBasicSalary());
        detail.setHra(req.getHra());
        detail.setSpecialAllowance(req.getSpecialAllowance());
        detail.setTransportAllowance(req.getTransportAllowance());
        detail.setMedicalAllowance(req.getMedicalAllowance());
        detail.setLta(req.getLta());
        detail.setOtherAllowance(req.getOtherAllowance());

        // Deductions
        detail.setPfEmployee(req.getPfEmployee());
        detail.setPfEmployer(req.getPfEmployer());
        detail.setProfessionalTax(req.getProfessionalTax());
        detail.setTds(req.getTds());
        detail.setEsiEmployee(req.getEsiEmployee());
        detail.setEsiEmployer(req.getEsiEmployer());
        detail.setOtherDeduction(req.getOtherDeduction());

        // Net
        detail.setNetTakeHome(req.getNetTakeHome());

        // Pay meta
        if (req.getPayCycle() != null) {
            try { detail.setPayCycle(EmployeeSalaryDetail.PayCycle.valueOf(req.getPayCycle().toUpperCase())); }
            catch (IllegalArgumentException ignored) { detail.setPayCycle(EmployeeSalaryDetail.PayCycle.MONTHLY); }
        }
        if (req.getSalaryMode() != null) {
            try { detail.setSalaryMode(EmployeeSalaryDetail.SalaryMode.valueOf(req.getSalaryMode().toUpperCase())); }
            catch (IllegalArgumentException ignored) { detail.setSalaryMode(EmployeeSalaryDetail.SalaryMode.BANK_TRANSFER); }
        }
        detail.setEffectiveFrom(req.getEffectiveFrom());
        detail.setSalaryGrade(req.getSalaryGrade());
        detail.setPayBand(req.getPayBand());

        // Statutory
        detail.setPfUan(req.getPfUan());
        detail.setEsiNumber(req.getEsiNumber());
        detail.setPanNumber(req.getPanNumber());
        detail.setRemarks(req.getRemarks());

        EmployeeSalaryDetail saved = salaryRepo.save(detail);
        syncComponents(user, req);
        return saved;
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public Optional<EmployeeSalaryDetail> findByUserAndTenant(Long userId, String tenantCode) {
        return salaryRepo.findByUserIdAndTenantCode(userId, tenantCode);
    }

    public List<EmployeeSalaryDetail> findAllByTenant(String tenantCode) {
        return salaryRepo.findByTenantCode(tenantCode);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void delete(Long userId, String tenantCode) {
        salaryRepo.findByUserIdAndTenantCode(userId, tenantCode)
                .ifPresent(salaryRepo::delete);
        componentRepo.deleteByEmployeeIdAndTenantCode(userId, tenantCode);
    }

    private void syncComponents(User user, SalaryDetailRequest req) {
        componentRepo.deleteByEmployeeIdAndTenantCode(user.getId(), user.getTenantCode());

        List<SalaryComponentRequest> requested = req.getComponents();
        if (requested == null || requested.isEmpty()) {
            requested = buildLegacyComponents(req);
        }

        int index = 0;
        for (SalaryComponentRequest item : requested) {
            if (item == null || item.getComponentName() == null || item.getComponentName().isBlank()) {
                continue;
            }

            BigDecimal amount = item.getAmount() != null ? item.getAmount() : BigDecimal.ZERO;
            boolean active = Boolean.TRUE.equals(item.getIsActive()) && amount.compareTo(BigDecimal.ZERO) > 0;
            if (!active) {
                continue;
            }

            EmployeeSalaryComponent component = new EmployeeSalaryComponent();
            component.setEmployeeId(user.getId());
            component.setTenantCode(user.getTenantCode());
            component.setCompanyId(user.getCompanyId());
            component.setComponentName(item.getComponentName());
            component.setComponentKey(normalizeKey(item.getComponentKey(), item.getComponentName()));
            component.setAmount(amount);
            component.setIsActive(true);
            component.setDisplayOrder(item.getDisplayOrder() != null ? item.getDisplayOrder() : index++);
            component.setComponentType(parseType(item.getComponentType()));
            componentRepo.save(component);
        }
    }

    private List<SalaryComponentRequest> buildLegacyComponents(SalaryDetailRequest req) {
        List<SalaryComponentRequest> items = new ArrayList<>();
        addLegacy(items, "basicSalary", "Basic Salary", "EARNING", req.getBasicSalary());
        addLegacy(items, "hra", "HRA", "EARNING", req.getHra());
        addLegacy(items, "specialAllowance", "Special Allowance", "EARNING", req.getSpecialAllowance());
        addLegacy(items, "transportAllowance", "Transport Allowance", "EARNING", req.getTransportAllowance());
        addLegacy(items, "medicalAllowance", "Medical Allowance", "EARNING", req.getMedicalAllowance());
        addLegacy(items, "lta", "LTA", "EARNING", req.getLta());
        addLegacy(items, "otherAllowance", "Other Allowance", "EARNING", req.getOtherAllowance());
        addLegacy(items, "pfEmployee", "PF", "DEDUCTION", req.getPfEmployee());
        addLegacy(items, "professionalTax", "Professional Tax", "DEDUCTION", req.getProfessionalTax());
        addLegacy(items, "tds", "TDS", "DEDUCTION", req.getTds());
        addLegacy(items, "esiEmployee", "ESI", "DEDUCTION", req.getEsiEmployee());
        addLegacy(items, "otherDeduction", "Other Deduction", "DEDUCTION", req.getOtherDeduction());
        return items;
    }

    private void addLegacy(List<SalaryComponentRequest> items,
                           String key,
                           String name,
                           String type,
                           BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }
        SalaryComponentRequest req = new SalaryComponentRequest();
        req.setComponentKey(key);
        req.setComponentName(name);
        req.setComponentType(type);
        req.setAmount(amount);
        req.setIsActive(true);
        req.setDisplayOrder(items.size());
        items.add(req);
    }

    private EmployeeSalaryComponent.ComponentType parseType(String type) {
        if (type == null || type.isBlank()) {
            return EmployeeSalaryComponent.ComponentType.EARNING;
        }
        try {
            return EmployeeSalaryComponent.ComponentType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return EmployeeSalaryComponent.ComponentType.EARNING;
        }
    }

    private String normalizeKey(String key, String name) {
        if (key != null && !key.isBlank()) {
            return key.trim();
        }
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "_").replaceAll("^_|_$", "");
    }
}
