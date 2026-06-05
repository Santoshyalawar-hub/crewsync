package com.samayahr.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class LeaderboardResponse {
    private PerformanceResponse currentUser;
    private List<PerformanceResponse> topPerformers;
    private Long totalEmployees;
    private String month;
    
    

	public LeaderboardResponse(PerformanceResponse currentUser, List<PerformanceResponse> topPerformers,
			Long totalEmployees, String month) {
		super();
		this.currentUser = currentUser;
		this.topPerformers = topPerformers;
		this.totalEmployees = totalEmployees;
		this.month = month;
	}

	public PerformanceResponse getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(PerformanceResponse currentUser) {
        this.currentUser = currentUser;
    }

    public List<PerformanceResponse> getTopPerformers() {
        return topPerformers;
    }

    public void setTopPerformers(List<PerformanceResponse> topPerformers) {
        this.topPerformers = topPerformers;
    }

    public Long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(Long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }
}