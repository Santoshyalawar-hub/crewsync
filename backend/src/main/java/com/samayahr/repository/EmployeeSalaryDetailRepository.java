package com.samayahr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.EmployeeSalaryDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeSalaryDetailRepository extends JpaRepository<EmployeeSalaryDetail, Long> {

    Optional<EmployeeSalaryDetail> findByUserIdAndTenantCode(Long userId, String tenantCode);

    Optional<EmployeeSalaryDetail> findByUserId(Long userId);

    List<EmployeeSalaryDetail> findByTenantCode(String tenantCode);

    boolean existsByUserIdAndTenantCode(Long userId, String tenantCode);

    @Query("SELECT s FROM EmployeeSalaryDetail s WHERE s.tenantCode = :tenantCode AND s.companyId = :companyId")
    List<EmployeeSalaryDetail> findByTenantCodeAndCompanyId(
            @Param("tenantCode") String tenantCode,
            @Param("companyId") Long companyId);
}