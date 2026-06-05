package com.samayahr.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    // ── Existence checks ──────────────────────────────────────────────────────
    boolean existsByDisplayName(String displayName);
    boolean existsByAdminEmail(String adminEmail);
    boolean existsByTenantCode(String tenantCode);
    boolean existsByOfficialEmail(String officialEmail);

    // ── Find by fields ────────────────────────────────────────────────────────
    Optional<Company> findByDisplayName(String displayName);
    Optional<Company> findByAdminEmail(String adminEmail);
    Optional<Company> findByTenantCode(String tenantCode);           // ✅ used by getByTenantCode()
    Optional<Company> findByOfficialEmail(String officialEmail);
    Optional<Company> findByOfficialEmailAndTenantCode(String officialEmail, String tenantCode);

    // ── Status-based ──────────────────────────────────────────────────────────
    List<Company> findByStatus(String status);

    @Query("SELECT COUNT(c) FROM Company c WHERE c.status = :status")
    Long countByStatus(@Param("status") String status);

    // ── Search ────────────────────────────────────────────────────────────────
    @Query("SELECT c FROM Company c WHERE " +
           "LOWER(c.displayName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.legalName)   LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.admin)       LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.adminEmail)  LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.tenantCode)  LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Company> searchCompanies(@Param("searchTerm") String searchTerm);

    // ── Statistics ────────────────────────────────────────────────────────────
    @Query("SELECT COALESCE(SUM(c.employees), 0) FROM Company c")
    Long getTotalEmployees();
    


}