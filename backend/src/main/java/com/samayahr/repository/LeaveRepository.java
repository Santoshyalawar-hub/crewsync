package com.samayahr.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.Leave;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByUserId(Long userId);

    List<Leave> findByStatus(Leave.LeaveStatus status);

    // ─────────────────────────────────────────────────────────────
    //  FIX 1: The original query used a raw string literal 'APPROVED'.
    //  Hibernate with @Enumerated(EnumType.STRING) expects a named
    //  parameter bound to the actual Java enum constant — NOT a quoted
    //  string in JPQL. The inner-class separator in JPQL is $ not dot.
    //
    //  Using a @Param-bound enum constant is the safest cross-DB approach:
    //  we pass Leave.LeaveStatus.APPROVED as a parameter so Hibernate
    //  handles the serialisation consistently regardless of @Enumerated type.
    // ─────────────────────────────────────────────────────────────
    @Query("SELECT l FROM Leave l " +
           "WHERE l.userId = :userId " +
           "AND   l.status = :approvedStatus " +
           "AND ( " +
           "       (l.startDate BETWEEN :startDate AND :endDate) " +
           "    OR (l.endDate   BETWEEN :startDate AND :endDate) " +
           "    OR (l.startDate <= :startDate AND l.endDate >= :endDate) " +
           ")")
    List<Leave> findApprovedLeavesByUserIdAndDateRange(
            @Param("userId")         Long             userId,
            @Param("startDate")      LocalDate        startDate,
            @Param("endDate")        LocalDate        endDate,
            @Param("approvedStatus") Leave.LeaveStatus approvedStatus);

    // ─────────────────────────────────────────────────────────────
    //  FIX 2: Same fix for countPendingLeaves — pass enum as param.
    // ─────────────────────────────────────────────────────────────
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.status = :pendingStatus")
    long countPendingLeaves(
            @Param("pendingStatus") Leave.LeaveStatus pendingStatus);

    // Convenience wrapper so existing callers require no change
    default long countPendingLeaves() {
        return countPendingLeaves(Leave.LeaveStatus.PENDING);
    }

    @Query("SELECT l FROM Leave l WHERE l.userId = :userId ORDER BY l.createdAt DESC")
    List<Leave> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}