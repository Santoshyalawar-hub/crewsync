package com.samayahr.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	@EntityGraph(attributePaths = {"bankDetails", "salaryDetails"})
	@Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.role = 'EMPLOYEE' AND u.deletedAt IS NULL")
	List<User> findEmployeesWithDetails(@Param("tc") String tenantCode);
	
    // ── Core lookups ──────────────────────────────────────────────────────────
    Optional<User> findByEmail(String email);
    List<User> findAllById(Iterable<Long> ids);
    Optional<User> findByEmailAndDeletedAtIsNull(String email);
    Optional<User> findByIdAndDeletedAtIsNull(Long id);

    // ── Tenant-scoped lookups ─────────────────────────────────────────────────
    List<User> findByTenantCode(String tenantCode);
    List<User> findByTenantCodeAndDeletedAtIsNull(String tenantCode);
    Optional<User> findByEmailAndTenantCode(String email, String tenantCode);

    boolean existsByEmailAndTenantCode(String email, String tenantCode);
    boolean existsByEmployeeIdAndTenantCode(String employeeId, String tenantCode);

    // ── Employee queries (EMPLOYEE role only) ─────────────────────────────────
    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.role = 'EMPLOYEE' AND u.deletedAt IS NULL")
    List<User> findEmployeesByTenantCode(@Param("tc") String tenantCode);

    @Query("SELECT COUNT(u) FROM User u WHERE u.tenantCode = :tc AND u.role = 'EMPLOYEE' AND u.deletedAt IS NULL")
    long countEmployeesByTenantCode(@Param("tc") String tenantCode);

    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.companyId = :cid AND u.role = 'EMPLOYEE' AND u.deletedAt IS NULL")
    List<User> findEmployeesByTenantCompany(@Param("tc") String tenantCode, @Param("cid") Long companyId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.tenantCode = :tc AND u.companyId = :cid AND u.role = 'EMPLOYEE' AND u.deletedAt IS NULL")
    long countEmployeesByTenantCompany(@Param("tc") String tenantCode, @Param("cid") Long companyId);

    // ── Admin queries (ADMIN role only) ───────────────────────────────────────
    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.companyId = :cid " +
           "AND u.role = 'ADMIN' AND u.deletedAt IS NULL")
    List<User> findAdminsByTenantCompany(@Param("tc") String tenantCode, @Param("cid") Long companyId);

    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.companyId = :cid " +
           "AND u.role = 'ADMIN' AND u.deletedAt IS NULL AND u.email = :email")
    Optional<User> findAdminByTenantCompanyAndEmail(
            @Param("tc") String tenantCode,
            @Param("cid") Long companyId,
            @Param("email") String email);

    // ── Super Admin / Company Admin queries ───────────────────────────────────
    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc " +
           "AND (u.role = 'SUPER_ADMIN' OR u.role = 'COMPANY_ADMIN') AND u.deletedAt IS NULL")
    List<User> findSuperAdminsByTenantCode(@Param("tc") String tenantCode);

    // ── Search ────────────────────────────────────────────────────────────────
    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.deletedAt IS NULL AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(u.mobile) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(u.employeeId) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<User> searchUsersByTenantCode(@Param("tc") String tenantCode, @Param("q") String query);

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(u.mobile) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<User> searchUsers(@Param("q") String query);

    // ── Department / Status / Role filters ────────────────────────────────────
    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.department = :dept AND u.deletedAt IS NULL")
    List<User> findByTenantCodeAndDepartment(@Param("tc") String tenantCode, @Param("dept") String department);

    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.status = :status AND u.deletedAt IS NULL")
    List<User> findByTenantCodeAndStatus(@Param("tc") String tenantCode, @Param("status") User.Status status);

    @Query("SELECT u FROM User u WHERE u.tenantCode = :tc AND u.role = :role AND u.deletedAt IS NULL")
    List<User> findByTenantCodeAndRole(@Param("tc") String tenantCode, @Param("role") User.Role role);

    // ── Role-based lists (global) ─────────────────────────────────────────────
    List<User> findByRole(User.Role role);
    List<User> findByRoleAndDeletedAtIsNull(User.Role role);
    List<User> findByRoleAndStatus(User.Role role, User.Status status);
    List<User> findByRoleAndStatusAndDeletedAtIsNull(User.Role role, User.Status status);

    // ── Status ────────────────────────────────────────────────────────────────
    List<User> findByStatus(User.Status status);
    List<User> findByStatusAndDeletedAtIsNull(User.Status status);

    // ── Approval / Onboarding ─────────────────────────────────────────────────
    List<User> findByApproved(Boolean approved);
    List<User> findByApprovedAndDeletedAtIsNull(Boolean approved);
    List<User> findByApprovedAndRole(Boolean approved, User.Role role);
    List<User> findByOnboardingStatus(User.OnboardingStatus status);
    List<User> findByOnboardingStatusAndRole(User.OnboardingStatus status, User.Role role);

    // ── Department ────────────────────────────────────────────────────────────
    List<User> findByDepartment(String department);
    List<User> findByDepartmentAndDeletedAtIsNull(String department);

    // ── isAdmin flag ──────────────────────────────────────────────────────────
    List<User> findByIsAdmin(Boolean isAdmin);
    List<User> findByIsAdminAndDeletedAtIsNull(Boolean isAdmin);

    // ── Counts ────────────────────────────────────────────────────────────────
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") User.Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.status = :status")
    long countByRoleAndStatus(@Param("role") User.Role role, @Param("status") User.Status status);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.deletedAt IS NULL")
    long countActiveByRole(@Param("role") User.Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.approved = :approved AND u.role = :role")
    long countByApprovedAndRole(@Param("approved") Boolean approved, @Param("role") User.Role role);

    // ── Existence checks ──────────────────────────────────────────────────────
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);

    // ── Token lookups ─────────────────────────────────────────────────────────
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByResetPasswordToken(String token);
    Optional<User> findByResetPasswordTokenAndResetPasswordExpireAfter(String token, LocalDateTime now);

    // ── Misc ──────────────────────────────────────────────────────────────────
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    List<User> findAllActive();

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NOT NULL ORDER BY u.deletedAt DESC")
    List<User> findAllDeleted();

    @Query("SELECT u FROM User u WHERE u.lastLoginAt >= :since AND u.deletedAt IS NULL ORDER BY u.lastLoginAt DESC")
    List<User> findRecentlyLoggedIn(@Param("since") LocalDateTime since);

    @Query("SELECT u FROM User u WHERE u.role = :role OR u.isAdmin = true")
    List<User> findAllAdmins(@Param("role") User.Role role);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.deletedAt IS NULL AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<User> searchUsersByRole(@Param("role") User.Role role, @Param("q") String query);
    
    //Global admin
    boolean existsByRole(User.Role role);
    
    @Query("""
            SELECT u.id FROM User u
            WHERE u.role = 'EMPLOYEE'
            AND u.tenantCode = :tenantCode
            AND u.companyId  = :companyId
            AND u.deletedAt IS NULL
            """)
    List<Long> findEmployeeIdsByTenantAndCompany(
            @Param("tenantCode") String tenantCode,
            @Param("companyId")  Long companyId);

    // ─── NEW: Returns employee IDs filtered by department ────────────────────
    @Query("""
            SELECT u.id FROM User u
            WHERE u.role       = 'EMPLOYEE'
            AND u.tenantCode   = :tenantCode
            AND u.companyId    = :companyId
            AND u.department   = :department
            AND u.deletedAt   IS NULL
            """)
    List<Long> findEmployeeIdsByTenantCompanyAndDepartment(
            @Param("tenantCode")  String tenantCode,
            @Param("companyId")   Long companyId,
            @Param("department")  String department);
    
    
}