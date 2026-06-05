//package com.hireconnect.repository;
//
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import com.hireconnect.entity.PerformanceData;
//
//@Repository
//public interface PerformanceRepository extends JpaRepository<PerformanceData, Long> {
//
//    // All (admin) — without tenant filtering
//    @Query("SELECT DISTINCT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user")
//    List<PerformanceData> findAllWithFeedback();
//
//    // ✅ Tenant All (used for dashboard)
//    @Query("SELECT DISTINCT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user " +
//           "WHERE p.tenantCode = :tenantCode")
//    List<PerformanceData> findAllByTenantCodeWithFeedback(@Param("tenantCode") String tenantCode);
//
//    @Query("SELECT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user WHERE p.employeeId = :employeeId")
//    Optional<PerformanceData> findByEmployeeIdWithFeedback(@Param("employeeId") String employeeId);
//
//    @Query("SELECT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user WHERE p.user.id = :userId")
//    Optional<PerformanceData> findByUserIdWithFeedback(@Param("userId") Long userId);
//
//    @Query("SELECT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user WHERE p.id = :id")
//    Optional<PerformanceData> findByIdWithFeedback(@Param("id") Long id);
//
//    Optional<PerformanceData> findByEmployeeId(String employeeId);
//
//    Boolean existsByEmployeeId(String employeeId);
//
//    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM PerformanceData p WHERE p.user.id = :userId")
//    boolean existsByUserId(@Param("userId") Long userId);
//
//    // ✅ Strong tenant safety (for update/delete/validate)
//    @Query("SELECT p FROM PerformanceData p WHERE p.id = :id AND p.tenantCode = :tenantCode")
//    Optional<PerformanceData> findByIdAndTenantCode(@Param("id") Long id, @Param("tenantCode") String tenantCode);
//
//    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
//           "FROM PerformanceData p WHERE p.employeeId = :employeeId AND p.tenantCode = :tenantCode")
//    boolean existsByEmployeeIdAndTenantCode(@Param("employeeId") String employeeId, @Param("tenantCode") String tenantCode);
//}


package com.samayahr.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.PerformanceData;

@Repository
public interface PerformanceRepository extends JpaRepository<PerformanceData, Long> {
    
    // ========== EXISTING QUERIES ==========
    @Query("SELECT DISTINCT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user")
    List<PerformanceData> findAllWithFeedback();
    
    @Query("SELECT DISTINCT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user " +
           "WHERE p.tenantCode = :tenantCode")
    List<PerformanceData> findAllByTenantCodeWithFeedback(@Param("tenantCode") String tenantCode);
    
    @Query("SELECT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user WHERE p.employeeId = :employeeId")
    Optional<PerformanceData> findByEmployeeIdWithFeedback(@Param("employeeId") String employeeId);
    
    @Query("SELECT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user WHERE p.user.id = :userId")
    Optional<PerformanceData> findByUserIdWithFeedback(@Param("userId") Long userId);
    
    @Query("SELECT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user WHERE p.id = :id")
    Optional<PerformanceData> findByIdWithFeedback(@Param("id") Long id);
    
    Optional<PerformanceData> findByEmployeeId(String employeeId);
    Boolean existsByEmployeeId(String employeeId);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM PerformanceData p WHERE p.user.id = :userId")
    boolean existsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM PerformanceData p WHERE p.id = :id AND p.tenantCode = :tenantCode")
    Optional<PerformanceData> findByIdAndTenantCode(@Param("id") Long id, @Param("tenantCode") String tenantCode);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
           "FROM PerformanceData p WHERE p.employeeId = :employeeId AND p.tenantCode = :tenantCode")
    boolean existsByEmployeeIdAndTenantCode(@Param("employeeId") String employeeId, @Param("tenantCode") String tenantCode);
    
    // ========== NEW: MONTH-BASED QUERIES ==========
    
    /**
     * Get all performance records for a specific tenant and month
     */
    @Query("SELECT DISTINCT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user " +
           "WHERE p.tenantCode = :tenantCode AND p.performanceMonth = :month")
    List<PerformanceData> findAllByTenantCodeAndMonthWithFeedback(
            @Param("tenantCode") String tenantCode, 
            @Param("month") String month);
    
    /**
     * Get user's performance for a specific month
     */
    @Query("SELECT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user " +
           "WHERE p.user.id = :userId AND p.performanceMonth = :month")
    Optional<PerformanceData> findByUserIdAndMonth(@Param("userId") Long userId, @Param("month") String month);
    
    /**
     * Get top N performers for a tenant and month
     */
    @Query("SELECT DISTINCT p FROM PerformanceData p LEFT JOIN FETCH p.feedback LEFT JOIN FETCH p.user " +
           "WHERE p.tenantCode = :tenantCode AND p.performanceMonth = :month " +
           "ORDER BY p.currentScore DESC")
    List<PerformanceData> findTopPerformersByTenantAndMonth(
            @Param("tenantCode") String tenantCode, 
            @Param("month") String month);
    
    /**
     * Get employee's rank for a specific month within their tenant
     */
    @Query("SELECT COUNT(p) + 1 FROM PerformanceData p " +
           "WHERE p.tenantCode = :tenantCode AND p.performanceMonth = :month " +
           "AND p.currentScore > :score")
    Long findRankByTenantMonthAndScore(
            @Param("tenantCode") String tenantCode, 
            @Param("month") String month, 
            @Param("score") Integer score);
    
    /**
     * Get all distinct months for a tenant (for dropdown)
     */
    @Query("SELECT DISTINCT p.performanceMonth FROM PerformanceData p " +
           "WHERE p.tenantCode = :tenantCode " +
           "ORDER BY p.performanceMonth DESC")
    List<String> findDistinctMonthsByTenantCode(@Param("tenantCode") String tenantCode);
}