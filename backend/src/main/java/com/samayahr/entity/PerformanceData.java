package com.samayahr.entity;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "performance_data")
@Data
public class PerformanceData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String tenantCode;
    private String employeeId;
    private String name;
    private String department;
    private String position;
    private Integer currentScore;
    private Integer tasksCompleted;
    private Integer totalTasks;
    private Integer attendance;
    private Integer productivity;
    private Integer qualityScore;
    private Integer punctuality;
    private Boolean validated = false;
    
    // ✅ NEW: Add month field for filtering
    @Column(name = "performance_month")
    private String performanceMonth; // Format: "YYYY-MM" (e.g., "2025-02")
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @ElementCollection
    @CollectionTable(name = "monthly_scores", joinColumns = @JoinColumn(name = "performance_id"))
    @Column(name = "score")
    private List<Integer> monthlyScores = new ArrayList<>();
    
    @OneToMany(mappedBy = "performanceData", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PerformanceFeedback> feedback = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
        updateStatus();
        
        // Auto-set current month if not specified
        if (this.performanceMonth == null) {
            this.performanceMonth = YearMonth.now().toString();
        }
    }
    
    public String getStatus() {
        if (currentScore == null) return "N/A";
        if (currentScore >= 90) return "Excellent";
        if (currentScore >= 75) return "Good";
        if (currentScore >= 60) return "Average";
        return "Needs Improvement";
    }
    
    private void updateStatus() {
        // Status is computed, not stored
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTenantCode() {
		return tenantCode;
	}

	public void setTenantCode(String tenantCode) {
		this.tenantCode = tenantCode;
	}

	public String getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public Integer getCurrentScore() {
		return currentScore;
	}

	public void setCurrentScore(Integer currentScore) {
		this.currentScore = currentScore;
	}

	public Integer getTasksCompleted() {
		return tasksCompleted;
	}

	public void setTasksCompleted(Integer tasksCompleted) {
		this.tasksCompleted = tasksCompleted;
	}

	public Integer getTotalTasks() {
		return totalTasks;
	}

	public void setTotalTasks(Integer totalTasks) {
		this.totalTasks = totalTasks;
	}

	public Integer getAttendance() {
		return attendance;
	}

	public void setAttendance(Integer attendance) {
		this.attendance = attendance;
	}

	public Integer getProductivity() {
		return productivity;
	}

	public void setProductivity(Integer productivity) {
		this.productivity = productivity;
	}

	public Integer getQualityScore() {
		return qualityScore;
	}

	public void setQualityScore(Integer qualityScore) {
		this.qualityScore = qualityScore;
	}

	public Integer getPunctuality() {
		return punctuality;
	}

	public void setPunctuality(Integer punctuality) {
		this.punctuality = punctuality;
	}

	public Boolean getValidated() {
		return validated;
	}

	public void setValidated(Boolean validated) {
		this.validated = validated;
	}

	public String getPerformanceMonth() {
		return performanceMonth;
	}

	public void setPerformanceMonth(String performanceMonth) {
		this.performanceMonth = performanceMonth;
	}

	public LocalDateTime getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(LocalDateTime lastUpdated) {
		this.lastUpdated = lastUpdated;
	}

	public List<Integer> getMonthlyScores() {
		return monthlyScores;
	}

	public void setMonthlyScores(List<Integer> monthlyScores) {
		this.monthlyScores = monthlyScores;
	}

	public List<PerformanceFeedback> getFeedback() {
		return feedback;
	}

	public void setFeedback(List<PerformanceFeedback> feedback) {
		this.feedback = feedback;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
    
    
}