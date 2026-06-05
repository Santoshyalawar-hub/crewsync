package com.samayahr.service;

import com.samayahr.entity.EmployeeExit;
import com.samayahr.entity.User;
import com.samayahr.repository.EmployeeExitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeExitService {

    @Autowired
    private EmployeeExitRepository employeeExitRepository;

    @Autowired
    private UserService userService;

    // ── Employee: submit exit request ─────────────────────────────────────────

    @Transactional
    public EmployeeExit submitExitRequest(Map<String, String> request) {
        User current = userService.getCurrentUser();

        // Block if there's an active (non-final) request already
        boolean active = employeeExitRepository.existsByUserIdAndStatusNotIn(
                current.getId(),
                Arrays.asList(EmployeeExit.ExitStatus.TEAM_LEADER_REJECTED,
                              EmployeeExit.ExitStatus.HR_REJECTED,
                              EmployeeExit.ExitStatus.COMPLETED));
        if (active) {
            throw new RuntimeException("You already have an active exit request.");
        }

        EmployeeExit exit = new EmployeeExit();
        exit.setUserId(current.getId());
        exit.setEmployeeName(current.getFullName());
        exit.setEmployeeCode(current.getEmployeeId());
        exit.setDepartment(current.getDepartment());
        exit.setTenantCode(current.getTenantCode());
        exit.setCompanyId(current.getCompanyId());
        exit.setExitType(EmployeeExit.ExitType.valueOf(request.get("exitType")));
        exit.setReason(request.get("reason"));
        exit.setLastWorkingDay(LocalDate.parse(request.get("lastWorkingDay")));
        exit.setComments(request.get("comments"));
        exit.setStatus(EmployeeExit.ExitStatus.PENDING);

        return employeeExitRepository.save(exit);
    }

    // ── Employee: get own exit status ─────────────────────────────────────────

    public EmployeeExit getMyExitStatus() {
        User current = userService.getCurrentUser();
        return employeeExitRepository
                .findTopByUserIdOrderByAppliedOnDesc(current.getId())
                .orElseThrow(() -> new RuntimeException("No exit request found"));
    }

    // ── Admin: list all exit requests for tenant ──────────────────────────────

    public List<EmployeeExit> getAllByTenant(String tenantCode) {
        return employeeExitRepository.findByTenantCodeOrderByAppliedOnDesc(tenantCode);
    }

    // ── Admin: Team Leader / HR approve ───────────────────────────────────────

    @Transactional
    public EmployeeExit approve(Long id, Map<String, String> body) {
        User reviewer = userService.getCurrentUser();
        EmployeeExit exit = findById(id);

        if (exit.getStatus() == EmployeeExit.ExitStatus.PENDING) {
            exit.setTeamLeaderId(reviewer.getId());
            exit.setTeamLeaderName(reviewer.getFullName());
            exit.setTeamLeaderReviewedAt(LocalDateTime.now());
            exit.setTeamLeaderComments(body.getOrDefault("comments", ""));
            exit.setStatus(EmployeeExit.ExitStatus.TEAM_LEADER_APPROVED);

        } else if (exit.getStatus() == EmployeeExit.ExitStatus.TEAM_LEADER_APPROVED) {
            exit.setHrReviewedBy(reviewer.getId());
            exit.setHrReviewedAt(LocalDateTime.now());
            exit.setHrComments(body.getOrDefault("comments", ""));
            exit.setStatus(EmployeeExit.ExitStatus.HR_APPROVED);

        } else if (exit.getStatus() == EmployeeExit.ExitStatus.HR_APPROVED) {
            exit.setClearanceCompletedAt(LocalDateTime.now());
            exit.setStatus(EmployeeExit.ExitStatus.IN_PROGRESS);

        } else if (exit.getStatus() == EmployeeExit.ExitStatus.IN_PROGRESS) {
            exit.setCompletedAt(LocalDateTime.now());
            exit.setStatus(EmployeeExit.ExitStatus.COMPLETED);

        } else {
            throw new RuntimeException("Cannot approve exit in status: " + exit.getStatus());
        }

        return employeeExitRepository.save(exit);
    }

    // ── Admin: reject ──────────────────────────────────────────────────────────

    @Transactional
    public EmployeeExit reject(Long id, Map<String, String> body) {
        User reviewer = userService.getCurrentUser();
        EmployeeExit exit = findById(id);

        String rejectionReason = body.getOrDefault("rejectionReason", "No reason provided");

        if (exit.getStatus() == EmployeeExit.ExitStatus.PENDING) {
            exit.setTeamLeaderId(reviewer.getId());
            exit.setTeamLeaderName(reviewer.getFullName());
            exit.setTeamLeaderReviewedAt(LocalDateTime.now());
            exit.setTeamLeaderComments(rejectionReason);
            exit.setRejectionReason(rejectionReason);
            exit.setStatus(EmployeeExit.ExitStatus.TEAM_LEADER_REJECTED);

        } else if (exit.getStatus() == EmployeeExit.ExitStatus.TEAM_LEADER_APPROVED) {
            exit.setHrReviewedBy(reviewer.getId());
            exit.setHrReviewedAt(LocalDateTime.now());
            exit.setHrComments(rejectionReason);
            exit.setRejectionReason(rejectionReason);
            exit.setStatus(EmployeeExit.ExitStatus.HR_REJECTED);

        } else {
            throw new RuntimeException("Cannot reject exit in status: " + exit.getStatus());
        }

        return employeeExitRepository.save(exit);
    }

    // ── Helper ─────────────────────────────────────────────────────────────────

    private EmployeeExit findById(Long id) {
        return employeeExitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exit request not found with id: " + id));
    }
}
