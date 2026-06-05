package com.samayahr.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // ── Admin: all notifications newest first (no tenant filter) ──────────────
    List<Notification> findAllByOrderByCreatedAtDesc();

    // ── Admin: tenant-scoped — pinned first, then newest ─────────────────────
    List<Notification> findByTenantCodeOrderByPinnedDescCreatedAtDesc(String tenantCode);

    // ── Employee: relevant notifications — NO tenant filter (backward compat) ──
    @Query(
        "SELECT n FROM Notification n WHERE " +
        "n.status = 'PUBLISHED' " +
        "AND n.scheduledAt <= :now " +
        "AND (n.expiresAt IS NULL OR n.expiresAt > :now) " +
        "AND (" +
            "n.targetType = 'ALL' " +
            "OR (n.targetType = 'DEPT' AND :dept MEMBER OF n.targetDepts) " +
            "OR (n.targetType = 'SPECIFIC' AND :empId MEMBER OF n.targetEmployeeIds)" +
        ") " +
        "ORDER BY n.pinned DESC, n.createdAt DESC"
    )
    List<Notification> findRelevantNotifications(
            @Param("empId") String empId,
            @Param("dept")  String dept,
            @Param("now")   LocalDateTime now
    );

    // ── Employee: relevant notifications — tenant-scoped ─────────────────────
    @Query(
        "SELECT n FROM Notification n WHERE " +
        "n.status = 'PUBLISHED' " +
        "AND (n.tenantCode IS NULL OR n.tenantCode = '' OR n.tenantCode = :tenantCode) " +
        "AND n.scheduledAt <= :now " +
        "AND (n.expiresAt IS NULL OR n.expiresAt > :now) " +
        "AND (" +
            "n.targetType = 'ALL' " +
            "OR (n.targetType = 'DEPT' AND :dept MEMBER OF n.targetDepts) " +
            "OR (n.targetType = 'SPECIFIC' AND :empId MEMBER OF n.targetEmployeeIds)" +
        ") " +
        "ORDER BY n.pinned DESC, n.createdAt DESC"
    )
    List<Notification> findRelevantNotifications(
            @Param("empId")      String empId,
            @Param("dept")       String dept,
            @Param("now")        LocalDateTime now,
            @Param("tenantCode") String tenantCode
    );
}