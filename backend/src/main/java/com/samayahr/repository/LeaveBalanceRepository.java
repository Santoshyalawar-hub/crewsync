package com.samayahr.repository;

import com.samayahr.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository
        extends JpaRepository<LeaveBalance, Long> {

    // ── Single employee queries ───────────────────────────────────────────────

    Optional<LeaveBalance> findByUserIdAndLeaveTypeAndYear(
            Long userId,
            LeaveBalance.LeaveType leaveType,
            Integer year);

    List<LeaveBalance> findByUserIdAndYear(Long userId, Integer year);

    boolean existsByUserIdAndLeaveTypeAndYear(
            Long userId,
            LeaveBalance.LeaveType leaveType,
            Integer year);

    // ── Tenant-scoped queries ─────────────────────────────────────────────────

    List<LeaveBalance> findByTenantCodeAndYear(
            String tenantCode, Integer year);

    @Query("SELECT lb FROM LeaveBalance lb " +
           "WHERE lb.tenantCode = :tc " +
           "AND lb.companyId = :cid " +
           "AND lb.year = :year")
    List<LeaveBalance> findByTenantCompanyAndYear(
            @Param("tc")   String tenantCode,
            @Param("cid")  Long companyId,
            @Param("year") Integer year);

    // ── Used by carry-forward — all EARNED balances for a tenant/year ─────────
    @Query("SELECT lb FROM LeaveBalance lb " +
           "WHERE lb.tenantCode = :tc " +
           "AND lb.year = :year " +
           "AND lb.leaveType = 'EARNED'")
    List<LeaveBalance> findEarnedBalancesByTenantAndYear(
            @Param("tc")   String tenantCode,
            @Param("year") Integer year);
}