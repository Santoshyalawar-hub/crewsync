package com.samayahr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_exits")
public class EmployeeExit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "employee_name")
    private String employeeName;

    @Column(name = "employee_code")
    private String employeeCode;

    @Column(name = "department")
    private String department;

    @Column(name = "tenant_code")
    private String tenantCode;

    @Column(name = "company_id")
    private Long companyId;

    @Enumerated(EnumType.STRING)
    @Column(name = "exit_type", nullable = false)
    private ExitType exitType;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "last_working_day", nullable = false)
    private LocalDate lastWorkingDay;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ExitStatus status = ExitStatus.PENDING;

    // Team Leader review
    @Column(name = "team_leader_id")
    private Long teamLeaderId;

    @Column(name = "team_leader_name")
    private String teamLeaderName;

    @Column(name = "team_leader_reviewed_at")
    private LocalDateTime teamLeaderReviewedAt;

    @Column(name = "team_leader_comments", columnDefinition = "TEXT")
    private String teamLeaderComments;

    // HR review
    @Column(name = "hr_reviewed_by")
    private Long hrReviewedBy;

    @Column(name = "hr_reviewed_at")
    private LocalDateTime hrReviewedAt;

    @Column(name = "hr_comments", columnDefinition = "TEXT")
    private String hrComments;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "clearance_completed_at")
    private LocalDateTime clearanceCompletedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @CreationTimestamp
    @Column(name = "applied_on", nullable = false, updatable = false)
    private LocalDateTime appliedOn;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ExitType {
        RESIGNATION, TERMINATION, RETIREMENT
    }

    public enum ExitStatus {
        PENDING,
        TEAM_LEADER_APPROVED,
        TEAM_LEADER_REJECTED,
        HR_APPROVED,
        HR_REJECTED,
        IN_PROGRESS,
        COMPLETED
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public ExitType getExitType() { return exitType; }
    public void setExitType(ExitType exitType) { this.exitType = exitType; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDate getLastWorkingDay() { return lastWorkingDay; }
    public void setLastWorkingDay(LocalDate lastWorkingDay) { this.lastWorkingDay = lastWorkingDay; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public ExitStatus getStatus() { return status; }
    public void setStatus(ExitStatus status) { this.status = status; }

    public Long getTeamLeaderId() { return teamLeaderId; }
    public void setTeamLeaderId(Long teamLeaderId) { this.teamLeaderId = teamLeaderId; }

    public String getTeamLeaderName() { return teamLeaderName; }
    public void setTeamLeaderName(String teamLeaderName) { this.teamLeaderName = teamLeaderName; }

    public LocalDateTime getTeamLeaderReviewedAt() { return teamLeaderReviewedAt; }
    public void setTeamLeaderReviewedAt(LocalDateTime teamLeaderReviewedAt) { this.teamLeaderReviewedAt = teamLeaderReviewedAt; }

    public String getTeamLeaderComments() { return teamLeaderComments; }
    public void setTeamLeaderComments(String teamLeaderComments) { this.teamLeaderComments = teamLeaderComments; }

    public Long getHrReviewedBy() { return hrReviewedBy; }
    public void setHrReviewedBy(Long hrReviewedBy) { this.hrReviewedBy = hrReviewedBy; }

    public LocalDateTime getHrReviewedAt() { return hrReviewedAt; }
    public void setHrReviewedAt(LocalDateTime hrReviewedAt) { this.hrReviewedAt = hrReviewedAt; }

    public String getHrComments() { return hrComments; }
    public void setHrComments(String hrComments) { this.hrComments = hrComments; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getClearanceCompletedAt() { return clearanceCompletedAt; }
    public void setClearanceCompletedAt(LocalDateTime clearanceCompletedAt) { this.clearanceCompletedAt = clearanceCompletedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getAppliedOn() { return appliedOn; }
    public void setAppliedOn(LocalDateTime appliedOn) { this.appliedOn = appliedOn; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
