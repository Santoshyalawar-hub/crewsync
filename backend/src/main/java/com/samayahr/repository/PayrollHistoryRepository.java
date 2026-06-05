	package com.samayahr.repository;
	
	import com.samayahr.entity.PayrollHistory;
	import org.springframework.data.jpa.repository.JpaRepository;
	import org.springframework.data.jpa.repository.Query;
	import org.springframework.data.repository.query.Param;
	import org.springframework.stereotype.Repository;
	
	import java.time.LocalDate;
	import java.util.List;
	import java.util.Optional;
	
	@Repository
	public interface PayrollHistoryRepository extends JpaRepository<PayrollHistory, Long> {
	
	    List<PayrollHistory> findByUserIdOrderByPayrollMonthDesc(Long userId);
	
	    List<PayrollHistory> findByStatus(PayrollHistory.PayrollStatus status);
	
	    // ── Used by AutoPayrollService to prevent duplicate payroll ───────────────
	    @Query("SELECT p FROM PayrollHistory p WHERE p.userId = :userId " +
	           "AND p.payrollMonth = :month")
	    Optional<PayrollHistory> findByUserIdAndMonth(
	            @Param("userId") Long userId,
	            @Param("month")  LocalDate month);
	
	    // ── Used by PayrollService analytics ─────────────────────────────────────
	    @Query("SELECT p FROM PayrollHistory p WHERE " +
	           "YEAR(p.payrollMonth) = :year AND MONTH(p.payrollMonth) = :month")
	    List<PayrollHistory> findByYearAndMonth(
	            @Param("year")  int year,
	            @Param("month") int month);
	
	    // ── Tenant-scoped payroll history ─────────────────────────────────────────
	    @Query("SELECT p FROM PayrollHistory p " +
	           "JOIN User u ON u.id = p.userId " +
	           "WHERE u.tenantCode = :tenantCode AND u.companyId = :companyId " +
	           "ORDER BY p.payrollMonth DESC")
	    List<PayrollHistory> findByTenantCompany(
	            @Param("tenantCode") String tenantCode,
	            @Param("companyId")  Long companyId);
	
	    @Query("SELECT p FROM PayrollHistory p " +
	           "JOIN User u ON u.id = p.userId " +
	           "WHERE u.tenantCode = :tenantCode AND u.companyId = :companyId " +
	           "AND YEAR(p.payrollMonth) = :year AND MONTH(p.payrollMonth) = :month")
	    List<PayrollHistory> findByTenantCompanyAndMonth(
	            @Param("tenantCode") String tenantCode,
	            @Param("companyId")  Long companyId,
	            @Param("year")       int year,
	            @Param("month")      int month);
	
	    @Query("SELECT p FROM PayrollHistory p " +
	           "JOIN User u ON u.id = p.userId " +
	           "WHERE u.tenantCode = :tenantCode AND u.department = :dept " +
	           "AND YEAR(p.payrollMonth) = :year AND MONTH(p.payrollMonth) = :month")
	    List<PayrollHistory> findByTenantDepartmentAndMonth(
	            @Param("tenantCode") String tenantCode,
	            @Param("dept")       String department,
	            @Param("year")       int year,
	            @Param("month")      int month);

	    // ── Analytics: monthly trend for a year (tenant-scoped) ──────────────────
	    @Query("SELECT p FROM PayrollHistory p " +
	           "JOIN User u ON u.id = p.userId " +
	           "WHERE u.tenantCode = :tenantCode AND u.companyId = :companyId " +
	           "AND YEAR(p.payrollMonth) = :year " +
	           "ORDER BY p.payrollMonth ASC")
	    List<PayrollHistory> findByTenantCompanyAndYear(
	            @Param("tenantCode") String tenantCode,
	            @Param("companyId")  Long companyId,
	            @Param("year")       int year);

	    // ── Analytics: all payroll for employee (salary growth chart) ─────────────
	    @Query("SELECT p FROM PayrollHistory p WHERE p.userId = :userId " +
	           "ORDER BY p.payrollMonth ASC")
	    List<PayrollHistory> findByUserIdOrderByPayrollMonthAsc(
	            @Param("userId") Long userId);

	    // ── Analytics: distinct departments having payroll in a month ─────────────
	    @Query("SELECT DISTINCT u.department FROM PayrollHistory p " +
	           "JOIN User u ON u.id = p.userId " +
	           "WHERE u.tenantCode = :tenantCode AND u.companyId = :companyId " +
	           "AND YEAR(p.payrollMonth) = :year AND MONTH(p.payrollMonth) = :month " +
	           "AND u.department IS NOT NULL")
	    List<String> findDistinctDepartments(
	            @Param("tenantCode") String tenantCode,
	            @Param("companyId")  Long companyId,
	            @Param("year")       int year,
	            @Param("month")      int month);
	}