package com.samayahr.controller;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.EmployeeSalaryComponent;
import com.samayahr.entity.SalaryRevisionHistory;
import com.samayahr.repository.EmployeeSalaryComponentRepository;
import com.samayahr.repository.SalaryRevisionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Manage dynamic salary components per employee.
 * All routes are tenant-scoped via X-Tenant-Code header.
 */
@RestController
@RequestMapping("/api/salary-components")
@CrossOrigin(origins = "*")
public class SalaryComponentController {

    @Autowired
    private EmployeeSalaryComponentRepository componentRepo;

    @Autowired
    private SalaryRevisionHistoryRepository revisionRepo;

    /** Get all components (active + inactive) for an employee */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<EmployeeSalaryComponent>>> getComponents(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            List<EmployeeSalaryComponent> list =
                    componentRepo.findByEmployeeIdAndTenantCodeOrderByDisplayOrderAscIdAsc(
                            employeeId, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Components fetched", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Get only ACTIVE components for an employee */
    @GetMapping("/employee/{employeeId}/active")
    public ResponseEntity<ApiResponse<List<EmployeeSalaryComponent>>> getActiveComponents(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            List<EmployeeSalaryComponent> list =
                    componentRepo.findByEmployeeIdAndTenantCodeAndIsActiveTrueOrderByDisplayOrderAscIdAsc(
                            employeeId, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Active components fetched", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Bulk save/replace all components for an employee (idempotent upsert).
     * Records a SalaryRevisionHistory row for each component that changed.
     * Optional header X-Changed-By passes the acting user's id.
     */
    @PostMapping("/employee/{employeeId}/bulk")
    public ResponseEntity<ApiResponse<List<EmployeeSalaryComponent>>> bulkSave(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestHeader(value = "X-Changed-By", required = false) Long changedBy,
            @RequestBody List<Map<String, Object>> components) {
        try {
            // Snapshot existing components before deletion (keyed by componentKey)
            List<EmployeeSalaryComponent> existing =
                    componentRepo.findByEmployeeIdAndTenantCodeOrderByDisplayOrderAscIdAsc(employeeId, tenantCode);
            Map<String, EmployeeSalaryComponent> prevMap = new HashMap<>();
            for (EmployeeSalaryComponent e : existing) {
                prevMap.put(e.getComponentKey(), e);
            }

            componentRepo.deleteByEmployeeIdAndTenantCode(employeeId, tenantCode);

            List<EmployeeSalaryComponent> saved = new ArrayList<>();
            List<SalaryRevisionHistory> revisions = new ArrayList<>();
            LocalDate today = LocalDate.now();

            for (int i = 0; i < components.size(); i++) {
                Map<String, Object> c = components.get(i);
                EmployeeSalaryComponent comp = new EmployeeSalaryComponent();
                comp.setEmployeeId(employeeId);
                comp.setTenantCode(tenantCode);
                comp.setComponentName(str(c.get("componentName")));
                comp.setComponentKey(str(c.get("componentKey")));
                comp.setComponentType(parseType(str(c.get("componentType"))));
                comp.setAmount(parseBD(c.get("amount")));
                comp.setIsActive(parseBool(c.get("isActive")));
                comp.setDisplayOrder(i);
                saved.add(comp);

                // Diff against previous snapshot
                EmployeeSalaryComponent prev = prevMap.get(comp.getComponentKey());
                String reason = buildChangeReason(prev, comp);
                if (reason != null) {
                    SalaryRevisionHistory rev = new SalaryRevisionHistory();
                    rev.setEmployeeId(employeeId);
                    rev.setTenantCode(tenantCode);
                    rev.setComponentKey(comp.getComponentKey());
                    rev.setComponentName(comp.getComponentName());
                    rev.setComponentType(comp.getComponentType());
                    rev.setOldAmount(prev != null ? prev.getAmount() : null);
                    rev.setNewAmount(comp.getAmount());
                    rev.setOldActive(prev != null ? prev.getIsActive() : null);
                    rev.setNewActive(comp.getIsActive());
                    rev.setChangeReason(reason);
                    rev.setEffectiveDate(today);
                    rev.setChangedBy(changedBy);
                    revisions.add(rev);
                }
            }

            List<EmployeeSalaryComponent> result = componentRepo.saveAll(saved);
            if (!revisions.isEmpty()) {
                revisionRepo.saveAll(revisions);
            }
            return ResponseEntity.ok(ApiResponse.success("Components saved", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Toggle active status of a single component */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<EmployeeSalaryComponent>> toggle(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestHeader(value = "X-Changed-By", required = false) Long changedBy) {
        try {
            EmployeeSalaryComponent comp = componentRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Component not found"));
            if (!comp.getTenantCode().equals(tenantCode)) {
                throw new RuntimeException("Access denied");
            }
            boolean wasActive = Boolean.TRUE.equals(comp.getIsActive());
            comp.setIsActive(!wasActive);
            EmployeeSalaryComponent saved = componentRepo.save(comp);

            SalaryRevisionHistory rev = new SalaryRevisionHistory();
            rev.setEmployeeId(comp.getEmployeeId());
            rev.setTenantCode(tenantCode);
            rev.setComponentKey(comp.getComponentKey());
            rev.setComponentName(comp.getComponentName());
            rev.setComponentType(comp.getComponentType());
            rev.setOldAmount(comp.getAmount());
            rev.setNewAmount(comp.getAmount());
            rev.setOldActive(wasActive);
            rev.setNewActive(!wasActive);
            rev.setChangeReason(wasActive ? "Deactivated" : "Activated");
            rev.setEffectiveDate(LocalDate.now());
            rev.setChangedBy(changedBy);
            revisionRepo.save(rev);

            return ResponseEntity.ok(ApiResponse.success("Toggled", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Update amount of a single component */
    @PatchMapping("/{id}/amount")
    public ResponseEntity<ApiResponse<EmployeeSalaryComponent>> updateAmount(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestHeader(value = "X-Changed-By", required = false) Long changedBy,
            @RequestBody Map<String, Object> body) {
        try {
            EmployeeSalaryComponent comp = componentRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Component not found"));
            if (!comp.getTenantCode().equals(tenantCode)) {
                throw new RuntimeException("Access denied");
            }
            BigDecimal oldAmount = comp.getAmount();
            BigDecimal newAmount = parseBD(body.get("amount"));
            comp.setAmount(newAmount);
            EmployeeSalaryComponent saved = componentRepo.save(comp);

            if (oldAmount.compareTo(newAmount) != 0) {
                SalaryRevisionHistory rev = new SalaryRevisionHistory();
                rev.setEmployeeId(comp.getEmployeeId());
                rev.setTenantCode(tenantCode);
                rev.setComponentKey(comp.getComponentKey());
                rev.setComponentName(comp.getComponentName());
                rev.setComponentType(comp.getComponentType());
                rev.setOldAmount(oldAmount);
                rev.setNewAmount(newAmount);
                rev.setOldActive(comp.getIsActive());
                rev.setNewActive(comp.getIsActive());
                rev.setChangeReason("Amount changed");
                rev.setEffectiveDate(LocalDate.now());
                rev.setChangedBy(changedBy);
                revisionRepo.save(rev);
            }

            return ResponseEntity.ok(ApiResponse.success("Amount updated", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Salary revision history for an employee (newest first) */
    @GetMapping("/employee/{employeeId}/history")
    public ResponseEntity<ApiResponse<List<SalaryRevisionHistory>>> getHistory(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestParam(required = false) String componentKey) {
        try {
            List<SalaryRevisionHistory> list = componentKey != null && !componentKey.isBlank()
                    ? revisionRepo.findByEmployeeIdAndTenantCodeAndComponentKeyOrderByEffectiveDateDescCreatedAtDesc(
                            employeeId, tenantCode, componentKey)
                    : revisionRepo.findByEmployeeIdAndTenantCodeOrderByEffectiveDateDescCreatedAtDesc(
                            employeeId, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Revision history fetched", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    /**
     * Returns a human-readable reason string if the component changed, null if unchanged / new with no notable change.
     */
    private String buildChangeReason(EmployeeSalaryComponent prev, EmployeeSalaryComponent next) {
        if (prev == null) {
            // New component — only record if it is active (i.e. actually being added)
            return Boolean.TRUE.equals(next.getIsActive()) ? "Added" : null;
        }
        boolean amountChanged = prev.getAmount().compareTo(next.getAmount()) != 0;
        boolean activeChanged = !Boolean.valueOf(prev.getIsActive()).equals(next.getIsActive());
        if (amountChanged && activeChanged) return "Amount changed & " + (next.getIsActive() ? "Activated" : "Deactivated");
        if (amountChanged) return "Amount changed";
        if (activeChanged) return next.getIsActive() ? "Activated" : "Deactivated";
        return null; // no change
    }

    private String str(Object v) {
        return v != null ? v.toString().trim() : "";
    }

    private BigDecimal parseBD(Object v) {
        if (v == null) return BigDecimal.ZERO;
        try { return new BigDecimal(v.toString()); }
        catch (NumberFormatException e) { return BigDecimal.ZERO; }
    }

    private boolean parseBool(Object v) {
        if (v == null) return false;
        if (v instanceof Boolean b) return b;
        return Boolean.parseBoolean(v.toString());
    }

    private EmployeeSalaryComponent.ComponentType parseType(String s) {
        if (s == null) return EmployeeSalaryComponent.ComponentType.EARNING;
        try { return EmployeeSalaryComponent.ComponentType.valueOf(s.toUpperCase()); }
        catch (IllegalArgumentException e) {
            return EmployeeSalaryComponent.ComponentType.EARNING;
        }
    }
}
