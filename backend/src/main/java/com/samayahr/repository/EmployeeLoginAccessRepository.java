package com.samayahr.repository;

import com.samayahr.entity.EmployeeLoginAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeLoginAccessRepository
        extends JpaRepository<EmployeeLoginAccess, Long> {

    Optional<EmployeeLoginAccess> findByUserId(Long userId);

    List<EmployeeLoginAccess> findAllByTenantCode(String tenantCode);

    boolean existsByUserId(Long userId);

    @Query("SELECT e FROM EmployeeLoginAccess e WHERE e.tenantCode = :tc " +
           "AND e.loginAccessPermission = 'ELIGIBLE'")
    List<EmployeeLoginAccess> findEligibleByTenant(@Param("tc") String tenantCode);

    @Query("SELECT e FROM EmployeeLoginAccess e WHERE e.tenantCode = :tc " +
           "AND e.loginAccessPermission = 'ELIGIBLE' " +
           "AND e.credentialsEmailSent = false")
    List<EmployeeLoginAccess> findEligibleAndNotYetSentByTenant(
            @Param("tc") String tenantCode);
}