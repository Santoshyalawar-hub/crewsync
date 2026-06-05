package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Stores leave balance per employee per leave type per year.
 *
 * One row per employee per leave type per year.
 * Example rows for employee id=5, year=2025:
 *   EARNED   → totalEntitled=12, used=2, pending=1, available=9
 *   SICK     → totalEntitled=7,  used=0, pending=0, available=7
 *   CASUAL   → totalEntitled=7,  used=1, pending=0, available=6
 *
 * available = totalEntitled + carriedForward - used - pending
 *
 * Hibernate auto-creates the table on startup because
 * spring.jpa.hibernate.ddl-auto=update is set.
 */
@Entity
@Table(name = "leave_balances",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "leave_type", "year"})
        })
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Tenant isolation ──────────────────────────────────────────────────────
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "tenant_code", nullable = false)
    private String tenantCode;

    @Column(name = "company_id")
    private Long companyId;

    // ── Leave type + year ─────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    private LeaveType leaveType;

    @Column(name = "year", nullable = false)
    private Integer year;

    // ── Balance fields ────────────────────────────────────────────────────────

    /** Annual entitlement set by company policy or admin override */
    @Column(name = "total_entitled")
    private Double totalEntitled = 0.0;

    /** Days actually used (approved leaves) */
    @Column(name = "used")
    private Double used = 0.0;

    /** Days reserved but not yet approved (pending leaves) */
    @Column(name = "pending")
    private Double pending = 0.0;

    /** Unused days carried forward from previous year (EARNED only) */
    @Column(name = "carried_forward")
    private Double carriedForward = 0.0;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Computed: available = entitled + carried - used - pending ─────────────
    @Transient
    public double getAvailable() {
        return Math.max(0,
                nvl(totalEntitled)
                + nvl(carriedForward)
                - nvl(used)
                - nvl(pending));
    }

    private double nvl(Double v) {
        return v != null ? v : 0.0;
    }

    // ── Leave types ───────────────────────────────────────────────────────────
    public enum LeaveType {
        EARNED,        // Privilege leave — accrues monthly (12/year)
        SICK,          // Medical leave (7/year)
        CASUAL,        // Short notice leave (7/year)
        MATERNITY,     // 26 weeks = 182 days by Indian law
        PATERNITY,     // 15 days
        COMPENSATORY,  // Comp-off for working on holidays (accrues)
        UNPAID         // LOP — no balance deducted, affects payroll
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) {
        this.tenantCode = tenantCode;
    }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getTotalEntitled() { return totalEntitled; }
    public void setTotalEntitled(Double totalEntitled) {
        this.totalEntitled = totalEntitled;
    }

    public Double getUsed() { return used; }
    public void setUsed(Double used) { this.used = used; }

    public Double getPending() { return pending; }
    public void setPending(Double pending) { this.pending = pending; }

    public Double getCarriedForward() { return carriedForward; }
    public void setCarriedForward(Double carriedForward) {
        this.carriedForward = carriedForward;
    }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
}