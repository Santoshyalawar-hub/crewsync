package com.samayahr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.EmployeeDocument;

import java.util.List;

@Repository
public interface EmployeeDocumentRepository extends JpaRepository<EmployeeDocument, Long> {

    List<EmployeeDocument> findByUserIdAndTenantCode(Long userId, String tenantCode);

    List<EmployeeDocument> findByUserId(Long userId);

    List<EmployeeDocument> findByTenantCode(String tenantCode);

    @Query("SELECT d FROM EmployeeDocument d WHERE d.user.id = :userId " +
           "AND d.tenantCode = :tenantCode AND d.documentType = :type")
    List<EmployeeDocument> findByUserIdAndTenantCodeAndDocumentType(
            @Param("userId") Long userId,
            @Param("tenantCode") String tenantCode,
            @Param("type") EmployeeDocument.DocumentType type);

    void deleteByCloudinaryPublicId(String cloudinaryPublicId);
}