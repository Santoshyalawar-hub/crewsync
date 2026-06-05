package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Tracks every salary component change per employee.
 * A row is written for each component whose amount or isActive state changed
 * during a bulk-save operation, forming an immutable audit trail.
 */
@Entity
@Table(name = "salary_revision_history",
        indexes = {
                @Index(name = "idx_srh_employee_tenant", columnList = "employee_id, tenant_code"),
                @Index(name = "idx_srh_effective_date",  columnList = "effective_date")
        })
public class SalaryRevisionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "tenant_code", nullable = false, length = 100)
    private String tenantCode;

    /** The salary component key, e.g. "basicSalary", "hra", "pfEmployee" */
    @Column(name = "component_key", nullable = false, length = 120)
    private String componentKey;

    @Column(name = "component_name", nullable = false, length = 120)
    private String componentName;

    @Enumerated(EnumType.STRING)
    @Column(name = "component_type", nullable = false, length = 20)
    private EmployeeSalaryComponent.ComponentType componentType;

    @Column(name = "old_amount", precision = 12, scale = 2)
    private BigDecimal oldAmount;

    @Column(name = "new_amount", precision = 12, scale = 2)
    private BigDecimal newAmount;

    @Column(name = "old_active")
    private Boolean oldActive;

    @Column(name = "new_active")
    private Boolean newActive;

    /** Human-readable change description, e.g. "Amount changed" / "Activated" / "Deactivated" */
    @Column(name = "change_reason", length = 255)
    private String changeReason;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    /** userId of the admin/HR who made the change */
    @Column(name = "changed_by")
    private Long changedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ── Getters / Setters ──────────────────────────────────────────────────────

    public Long getId() { return id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public String getComponentKey() { return componentKey; }
    public void setComponentKey(String componentKey) { this.componentKey = componentKey; }

    public String getComponentName() { return componentName; }
    public void setComponentName(String componentName) { this.componentName = componentName; }

    public EmployeeSalaryComponent.ComponentType getComponentType() { return componentType; }
    public void setComponentType(EmployeeSalaryComponent.ComponentType componentType) { this.componentType = componentType; }

    public BigDecimal getOldAmount() { return oldAmount; }
    public void setOldAmount(BigDecimal oldAmount) { this.oldAmount = oldAmount; }

    public BigDecimal getNewAmount() { return newAmount; }
    public void setNewAmount(BigDecimal newAmount) { this.newAmount = newAmount; }

    public Boolean getOldActive() { return oldActive; }
    public void setOldActive(Boolean oldActive) { this.oldActive = oldActive; }

    public Boolean getNewActive() { return newActive; }
    public void setNewActive(Boolean newActive) { this.newActive = newActive; }

    public String getChangeReason() { return changeReason; }
    public void setChangeReason(String changeReason) { this.changeReason = changeReason; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public Long getChangedBy() { return changedBy; }
    public void setChangedBy(Long changedBy) { this.changedBy = changedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
