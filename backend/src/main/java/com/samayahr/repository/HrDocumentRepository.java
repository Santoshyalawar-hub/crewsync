package com.samayahr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.HrDocument;

@Repository
public interface HrDocumentRepository extends JpaRepository<HrDocument, Long> {

    /** All HR docs sent to a specific employee (for employee dashboard) */
    List<HrDocument> findByEmployeeIdAndTenantCodeOrderByCreatedAtDesc(
            Long employeeId, String tenantCode);

    /** All HR docs for a tenant (admin view) */
    List<HrDocument> findByTenantCodeOrderByCreatedAtDesc(String tenantCode);

    /** All HR docs for a specific employee (admin view) */
    List<HrDocument> findByEmployeeIdAndTenantCodeAndCompanyIdOrderByCreatedAtDesc(
            Long employeeId, String tenantCode, Long companyId);

    /** All docs by status for a tenant */
    List<HrDocument> findByTenantCodeAndStatusOrderByCreatedAtDesc(
            String tenantCode, HrDocument.HrDocStatus status);

    /** Count pending-signature docs for an employee — used for badge */
    @Query("SELECT COUNT(d) FROM HrDocument d WHERE d.employeeId = :eid " +
           "AND d.tenantCode = :tc AND d.status = 'PENDING_SIGNATURE'")
    long countPendingForEmployee(@Param("eid") Long employeeId,
                                 @Param("tc")  String tenantCode);

    /** All docs grouped by employee for admin panel */
    @Query("SELECT d FROM HrDocument d WHERE d.tenantCode = :tc " +
           "AND d.companyId = :cid ORDER BY d.employeeId, d.createdAt DESC")
    List<HrDocument> findByTenantAndCompany(@Param("tc")  String tenantCode,
                                             @Param("cid") Long companyId);
}