package com.samayahr.repository;

import com.samayahr.entity.EmployeeSalaryComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeSalaryComponentRepository extends JpaRepository<EmployeeSalaryComponent, Long> {
    List<EmployeeSalaryComponent> findByEmployeeIdAndTenantCodeOrderByDisplayOrderAscIdAsc(Long employeeId, String tenantCode);
    List<EmployeeSalaryComponent> findByEmployeeIdAndTenantCodeAndIsActiveTrueOrderByDisplayOrderAscIdAsc(Long employeeId, String tenantCode);
    void deleteByEmployeeIdAndTenantCode(Long employeeId, String tenantCode);
}
