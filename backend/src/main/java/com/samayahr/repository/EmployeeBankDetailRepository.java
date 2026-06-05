package com.samayahr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.EmployeeBankDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeBankDetailRepository extends JpaRepository<EmployeeBankDetail, Long> {

    Optional<EmployeeBankDetail> findByUserIdAndTenantCode(Long userId, String tenantCode);

    Optional<EmployeeBankDetail> findByUserId(Long userId);

    List<EmployeeBankDetail> findByTenantCode(String tenantCode);

    boolean existsByUserIdAndTenantCode(Long userId, String tenantCode);

    /** All pending verifications for a given company */
    @Query("SELECT b FROM EmployeeBankDetail b WHERE b.tenantCode = :tenantCode " +
           "AND b.verificationStatus = 'PENDING'")
    List<EmployeeBankDetail> findPendingVerificationsByTenant(@Param("tenantCode") String tenantCode);
}