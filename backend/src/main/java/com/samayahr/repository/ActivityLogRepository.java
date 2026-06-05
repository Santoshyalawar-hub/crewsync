package com.samayahr.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.samayahr.entity.ActivityLog;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    Page<ActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<ActivityLog> findByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

    Page<ActivityLog> findByEventTypeOrderByCreatedAtDesc(String eventType, Pageable pageable);
}