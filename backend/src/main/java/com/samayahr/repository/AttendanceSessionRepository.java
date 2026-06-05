package com.samayahr.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.AttendanceSession;

@Repository
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

    // ─── Today's sessions (admin-level, no tenant filter) ────────────────────
    @Query("SELECT a FROM AttendanceSession a WHERE DATE(a.startTime) = CURRENT_DATE")
    List<AttendanceSession> findTodaysSessions();

    @Query("SELECT COUNT(DISTINCT a.employeeId) FROM AttendanceSession a WHERE DATE(a.startTime) = CURRENT_DATE")
    long countPresentToday();

    @Query("SELECT COUNT(DISTINCT a.employeeId) FROM AttendanceSession a " +
           "WHERE DATE(a.startTime) = CURRENT_DATE AND a.status = :status")
    long countByStatusToday(@Param("status") AttendanceSession.AttendanceStatus status);

    // ─── Employee-level queries ───────────────────────────────────────────────

    @Query("SELECT a FROM AttendanceSession a " +
           "WHERE a.employeeId = :employeeId " +
           "AND a.status IN ('WORKING', 'ON_BREAK') " +
           "ORDER BY a.startTime DESC")
    Optional<AttendanceSession> findActiveSessionByEmployeeId(
            @Param("employeeId") Long employeeId);

    @Query("SELECT a FROM AttendanceSession a " +
           "WHERE a.employeeId = :employeeId " +
           "AND DATE(a.startTime) = :date " +
           "ORDER BY a.startTime DESC")
    List<AttendanceSession> findByEmployeeIdAndDate(
            @Param("employeeId") Long employeeId,
            @Param("date") LocalDate date);

    @Query("SELECT a FROM AttendanceSession a " +
           "WHERE a.employeeId = :employeeId " +
           "AND DATE(a.startTime) BETWEEN :startDate AND :endDate " +
           "ORDER BY a.startTime DESC")
    List<AttendanceSession> findByEmployeeIdAndDateRange(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // ─── Auto-submit: find sessions that have been WORKING/ON_BREAK for >= maxSeconds ──
    //
    // NOTE: We use wall-clock elapsed time (startTime → now) as a cheap pre-filter.
    // The service then subtracts actual break time before deciding whether to close
    // the session — so sessions with long breaks are handled correctly.
    @Query("SELECT a FROM AttendanceSession a " +
           "WHERE a.status IN ('WORKING', 'ON_BREAK') " +
           "AND TIMESTAMPDIFF(SECOND, a.startTime, CURRENT_TIMESTAMP) >= :maxSeconds")
    List<AttendanceSession> findActiveSessionsExceedingDuration(
            @Param("maxSeconds") int maxSeconds);

    // ─── Tenant + company scoped queries ─────────────────────────────────────

    @Query("""
            SELECT a FROM AttendanceSession a
            WHERE DATE(a.startTime) = CURRENT_DATE
            AND a.employeeId IN (
                SELECT u.id FROM User u
                WHERE u.role = 'EMPLOYEE'
                AND u.tenantCode = :tenantCode
                AND u.companyId = :companyId
                AND u.deletedAt IS NULL
            )
            """)
    List<AttendanceSession> findTodaysSessionsByTenantCompany(
            @Param("tenantCode") String tenantCode,
            @Param("companyId") Long companyId);

    @Query("""
            SELECT COUNT(DISTINCT a.employeeId) FROM AttendanceSession a
            WHERE DATE(a.startTime) = CURRENT_DATE
            AND a.employeeId IN (
                SELECT u.id FROM User u
                WHERE u.role = 'EMPLOYEE'
                AND u.tenantCode = :tenantCode
                AND u.companyId = :companyId
                AND u.deletedAt IS NULL
            )
            """)
    long countPresentTodayByTenantCompany(
            @Param("tenantCode") String tenantCode,
            @Param("companyId") Long companyId);

    @Query("""
            SELECT COUNT(DISTINCT a.employeeId) FROM AttendanceSession a
            WHERE DATE(a.startTime) = CURRENT_DATE
            AND a.status = :status
            AND a.employeeId IN (
                SELECT u.id FROM User u
                WHERE u.role = 'EMPLOYEE'
                AND u.tenantCode = :tenantCode
                AND u.companyId = :companyId
                AND u.deletedAt IS NULL
            )
            """)
    long countByStatusTodayByTenantCompany(
            @Param("status") AttendanceSession.AttendanceStatus status,
            @Param("tenantCode") String tenantCode,
            @Param("companyId") Long companyId);

    // ─── Tenant-scoped date-range query (used by monthly attendance methods) ─
    @Query("""
            SELECT a FROM AttendanceSession a
            WHERE DATE(a.startTime) BETWEEN :startDate AND :endDate
            AND a.employeeId IN (
                SELECT u.id FROM User u
                WHERE u.role = 'EMPLOYEE'
                AND u.tenantCode = :tenantCode
                AND u.companyId = :companyId
                AND u.deletedAt IS NULL
            )
            ORDER BY a.startTime DESC
            """)
    List<AttendanceSession> findByTenantCompanyAndDateRange(
            @Param("tenantCode") String tenantCode,
            @Param("companyId") Long companyId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}