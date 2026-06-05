package com.samayahr.repository;

import com.samayahr.entity.PayrollItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollItemRepository extends JpaRepository<PayrollItem, Long> {
    List<PayrollItem> findByPayrollIdOrderByIdAsc(Long payrollId);
    void deleteByPayrollId(Long payrollId);
}
