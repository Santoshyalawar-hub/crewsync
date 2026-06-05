package com.samayahr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.PerformanceFeedback;

import java.util.List;

@Repository
public interface PerformanceFeedbackRepository extends JpaRepository<PerformanceFeedback, Long> {
    List<PerformanceFeedback> findByPerformanceDataId(Long performanceDataId);
}