package com.samayahr.service;

import com.samayahr.entity.User;
import com.samayahr.repository.AttendanceSessionRepository;
import com.samayahr.repository.LeaveRepository;
import com.samayahr.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    // FIX: replaced mixed constructor + non-final fields with consistent
    //      @Autowired field injection — matches the rest of the codebase
    //      and eliminates the risk of NullPointerException from Lombok
    //      generating a no-arg constructor on non-final fields.
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceSessionRepository attendanceSessionRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    // ── Employee Dashboard ────────────────────────────────────────────────────

    public Map<String, Object> getEmployeeDashboard(Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("employee",     employee);
        dashboard.put("pendingLeaves",
                leaveRepository.findByUserId(employeeId).size());

        return dashboard;
    }

    // ── Admin Dashboard ───────────────────────────────────────────────────────

    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalEmployees",
                userRepository.countByRole(User.Role.EMPLOYEE));
        dashboard.put("totalAdmins",
                userRepository.countByRole(User.Role.ADMIN));
        dashboard.put("presentToday",
                attendanceSessionRepository.countPresentToday());

        return dashboard;
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers",     userRepository.count());
        stats.put("totalEmployees", userRepository.countByRole(User.Role.EMPLOYEE));

        return stats;
    }
}