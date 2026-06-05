package com.samayahr.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samayahr.entity.Leave;
import com.samayahr.entity.User;
import com.samayahr.repository.LeaveRepository;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private UserService userService;

    // ✅ Injected with required=false — won't crash if LeaveBalanceService
    // is not yet present or has an issue during startup
    @Autowired(required = false)
    private LeaveBalanceService leaveBalanceService;

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Leave> getMyLeaves() {
        User currentUser = userService.getCurrentUser();
        return leaveRepository.findByUserIdOrderByCreatedAtDesc(
                currentUser.getId());
    }

    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    public List<Leave> getPendingLeaves() {
        return leaveRepository.findByStatus(Leave.LeaveStatus.PENDING);
    }

    public Leave getLeaveById(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));
    }

    public List<Leave> getLeavesByUserId(Long userId) {
        return leaveRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ── Apply leave ───────────────────────────────────────────────────────────

    /**
     * Employee applies for leave.
     *
     * Flow:
     *  1. Set userId from current authenticated user
     *  2. Calculate total days
     *  3. Check leave balance — throws if insufficient
     *     (unpaid/LOP leaves skip balance check)
     *  4. Add to pending balance so available count reduces immediately
     *  5. Save leave record as PENDING
     */
    @Transactional
    public Leave applyLeave(Leave leave) {
        User currentUser = userService.getCurrentUser();

        leave.setUserId(currentUser.getId());
        leave.setStatus(Leave.LeaveStatus.PENDING);

        // Calculate total days
        if (leave.getStartDate() != null && leave.getEndDate() != null) {
            long days = ChronoUnit.DAYS.between(
                    leave.getStartDate(), leave.getEndDate()) + 1;
            leave.setTotalDays((int) days);
        }

        // ── Check and reserve balance ─────────────────────────────────────────
        // addToPending throws RuntimeException if balance is insufficient
        // so the leave will NOT be saved if balance check fails
        if (leaveBalanceService != null) {
            leaveBalanceService.addToPending(leave);
        }

        return leaveRepository.save(leave);
    }

    // ── Approve leave ─────────────────────────────────────────────────────────

    /**
     * Admin approves a leave request.
     *
     * Flow:
     *  1. Update leave status to APPROVED
     *  2. Move days from pending → used in leave balance
     *     (balance was already reserved when employee applied)
     */
    @Transactional
    public Leave approveLeave(Long leaveId, Long reviewedBy) {
        Leave leave = getLeaveById(leaveId);

        leave.setStatus(Leave.LeaveStatus.APPROVED);
        leave.setReviewedBy(reviewedBy);
        leave.setReviewedAt(LocalDateTime.now());

        Leave saved = leaveRepository.save(leave);

        // ── Move from pending → used ──────────────────────────────────────────
        if (leaveBalanceService != null) {
            try {
                leaveBalanceService.deductOnApproval(saved);
            } catch (Exception e) {
                // Log but don't block approval
                System.err.println("Balance deduction failed for leave "
                        + leaveId + ": " + e.getMessage());
            }
        }

        return saved;
    }

    // ── Reject leave ──────────────────────────────────────────────────────────

    /**
     * Admin rejects a leave request.
     *
     * Flow:
     *  1. Update leave status to REJECTED
     *  2. Remove days from pending — balance is restored
     */
    @Transactional
    public Leave rejectLeave(Long leaveId, Long reviewedBy, String reason) {
        Leave leave = getLeaveById(leaveId);

        leave.setStatus(Leave.LeaveStatus.REJECTED);
        leave.setReviewedBy(reviewedBy);
        leave.setReviewedAt(LocalDateTime.now());
        if (reason != null) leave.setReason(reason);

        Leave saved = leaveRepository.save(leave);

        // ── Restore pending balance ───────────────────────────────────────────
        if (leaveBalanceService != null) {
            try {
                leaveBalanceService.removeFromPending(saved);
            } catch (Exception e) {
                System.err.println("Balance restore failed for leave "
                        + leaveId + ": " + e.getMessage());
            }
        }

        return saved;
    }

    // ── Delete leave ──────────────────────────────────────────────────────────

    /**
     * Employee cancels / admin deletes a leave request.
     * If leave was PENDING, restores the reserved balance.
     */
    @Transactional
    public void deleteLeave(Long leaveId) {
        Leave leave = getLeaveById(leaveId);

        // If still pending, restore the reserved balance
        if (leave.getStatus() == Leave.LeaveStatus.PENDING
                && leaveBalanceService != null) {
            try {
                leaveBalanceService.removeFromPending(leave);
            } catch (Exception e) {
                System.err.println("Balance restore on delete failed: "
                        + e.getMessage());
            }
        }

        leaveRepository.delete(leave);
    }
}