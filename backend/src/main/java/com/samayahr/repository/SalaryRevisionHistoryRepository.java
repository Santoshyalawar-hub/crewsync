package com.samayahr.repository;

import com.samayahr.entity.SalaryRevisionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaryRevisionHistoryRepository extends JpaRepository<SalaryRevisionHistory, Long> {

    List<SalaryRevisionHistory> findByEmployeeIdAndTenantCodeOrderByEffectiveDateDescCreatedAtDesc(
            Long employeeId, String tenantCode);

    List<SalaryRevisionHistory> findByEmployeeIdAndTenantCodeAndComponentKeyOrderByEffectiveDateDescCreatedAtDesc(
            Long employeeId, String tenantCode, String componentKey);
}
