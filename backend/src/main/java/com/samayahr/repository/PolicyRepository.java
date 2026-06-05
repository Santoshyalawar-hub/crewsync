package com.samayahr.repository;

import com.samayahr.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    @Query("SELECT p FROM Policy p WHERE p.tenantCode = :tenantCode AND p.isActive = true ORDER BY p.createdAt DESC")
    List<Policy> findByTenantCodeAndIsActiveTrueOrderByCreatedAtDesc(@Param("tenantCode") String tenantCode);

    @Query("SELECT p FROM Policy p WHERE p.tenantCode = :tenantCode ORDER BY p.createdAt DESC")
    List<Policy> findByTenantCodeOrderByCreatedAtDesc(@Param("tenantCode") String tenantCode);

    @Query("SELECT p FROM Policy p WHERE p.tenantCode = :tenantCode AND p.policyType = :policyType AND p.isActive = true ORDER BY p.createdAt DESC")
    List<Policy> findByTenantCodeAndPolicyTypeAndIsActiveTrueOrderByCreatedAtDesc(@Param("tenantCode") String tenantCode, @Param("policyType") String policyType);

    @Query("SELECT COUNT(p) FROM Policy p WHERE p.tenantCode = :tenantCode AND p.isActive = true")
    long countByTenantCodeAndIsActiveTrue(@Param("tenantCode") String tenantCode);
}
