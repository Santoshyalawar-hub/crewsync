package com.samayahr.repository;

import com.samayahr.entity.EmployeeExit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeExitRepository extends JpaRepository<EmployeeExit, Long> {

    Optional<EmployeeExit> findTopByUserIdOrderByAppliedOnDesc(Long userId);

    List<EmployeeExit> findByTenantCodeOrderByAppliedOnDesc(String tenantCode);

    List<EmployeeExit> findByTenantCodeAndStatusOrderByAppliedOnDesc(
            String tenantCode, EmployeeExit.ExitStatus status);

    boolean existsByUserIdAndStatusNotIn(Long userId, List<EmployeeExit.ExitStatus> statuses);
}
