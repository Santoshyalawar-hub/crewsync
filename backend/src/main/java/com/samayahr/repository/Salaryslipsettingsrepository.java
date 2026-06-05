package com.samayahr.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.SalarySlipSettings;

@Repository
public interface Salaryslipsettingsrepository extends JpaRepository<SalarySlipSettings, Long> {

    Optional<SalarySlipSettings> findByTenantCode(String tenantCode);

    boolean existsByTenantCode(String tenantCode);
}