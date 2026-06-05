package com.samayahr.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.samayahr.dto.request.PayrollRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.dto.response.PayrollResponse;
import com.samayahr.entity.PayrollHistory;
import com.samayahr.service.PayrollService;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {
    
    @Autowired
    private PayrollService payrollService;
    
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getAllPayrolls() {
        try {
            List<PayrollResponse> payrolls = payrollService.getAllPayrolls();
            return ResponseEntity.ok(ApiResponse.success("Payrolls fetched", payrolls));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PayrollResponse>> getPayrollById(@PathVariable Long id) {
        try {
        	PayrollResponse payroll = payrollService.getPayrollById(id);
            return ResponseEntity.ok(ApiResponse.success("Payroll fetched", payroll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 🔥 UPDATED: Return PayrollDTO with user details
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getPayrollByUser(@PathVariable Long userId) {
        try {
            List<PayrollResponse> payrolls = payrollService.getPayrollByUser(userId);
            return ResponseEntity.ok(ApiResponse.success("User payrolls fetched", payrolls));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<PayrollHistory>> createPayroll(@RequestBody PayrollRequest request) {
        try {
            PayrollHistory payroll = payrollService.createPayroll(request);
            return ResponseEntity.ok(ApiResponse.success("Payroll created", payroll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PayrollHistory>> updatePayroll(
            @PathVariable Long id,
            @RequestBody PayrollRequest request) {
        try {
            PayrollHistory payroll = payrollService.updatePayroll(id, request);
            return ResponseEntity.ok(ApiResponse.success("Payroll updated", payroll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePayroll(@PathVariable Long id) {
        try {
            payrollService.deletePayroll(id);
            return ResponseEntity.ok(ApiResponse.success("Payroll deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/generate-auto")
    public ResponseEntity<ApiResponse<PayrollHistory>> generateAutoPayroll(@RequestBody PayrollRequest request) {
        try {
            PayrollHistory payroll = payrollService.generateAutoPayroll(request);
            return ResponseEntity.ok(ApiResponse.success("Auto payroll generated", payroll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/manual-entry")
    public ResponseEntity<ApiResponse<PayrollHistory>> manualPayrollEntry(@RequestBody PayrollRequest request) {
        try {
            PayrollHistory payroll = payrollService.manualPayrollEntry(request);
            return ResponseEntity.ok(ApiResponse.success("Manual payroll created", payroll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<?>> getAnalytics(@RequestParam(defaultValue = "6months") String range) {
        try {
            var analytics = payrollService.getAnalytics(range);
            return ResponseEntity.ok(ApiResponse.success("Analytics fetched", analytics));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/export")
    public ResponseEntity<?> exportPayrolls(
            @RequestParam(defaultValue = "xlsx") String format,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "all") String month) {
        try {
            return payrollService.exportPayrolls(format, status, month);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/generate-payslip")
    public ResponseEntity<ApiResponse<?>> generatePayslip(@PathVariable Long id) {
        try {
            var result = payrollService.generatePayslip(id);
            return ResponseEntity.ok(ApiResponse.success("Payslip generated", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/download-payslip")
    public ResponseEntity<?> downloadPayslip(@PathVariable Long id) {
        try {
            return payrollService.downloadPayslip(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Workflow: Approve ─────────────────────────────────────────────────────
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<PayrollHistory>> approvePayroll(
            @PathVariable Long id) {
        try {
            PayrollHistory result = payrollService.approvePayroll(id, null);
            return ResponseEntity.ok(ApiResponse.success("Payroll approved", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Workflow: Mark as Paid ────────────────────────────────────────────────
    @PatchMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<PayrollHistory>> markAsPaid(
            @PathVariable Long id) {
        try {
            PayrollHistory result = payrollService.markAsPaid(id, null);
            return ResponseEntity.ok(ApiResponse.success("Payroll marked as paid", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Workflow: Cancel ──────────────────────────────────────────────────────
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<PayrollHistory>> cancelPayroll(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        try {
            PayrollHistory result = payrollService.cancelPayroll(id, reason);
            return ResponseEntity.ok(ApiResponse.success("Payroll cancelled", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Workflow: Lock ────────────────────────────────────────────────────────
    @PatchMapping("/{id}/lock")
    public ResponseEntity<ApiResponse<PayrollHistory>> lockPayroll(
            @PathVariable Long id) {
        try {
            PayrollHistory result = payrollService.lockPayroll(id);
            return ResponseEntity.ok(ApiResponse.success("Payroll locked", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Workflow: Unlock ──────────────────────────────────────────────────────
    @PatchMapping("/{id}/unlock")
    public ResponseEntity<ApiResponse<PayrollHistory>> unlockPayroll(
            @PathVariable Long id) {
        try {
            PayrollHistory result = payrollService.unlockPayroll(id);
            return ResponseEntity.ok(ApiResponse.success("Payroll unlocked", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Analytics: Monthly trend ──────────────────────────────────────────────
    @GetMapping("/analytics/monthly-trend")
    public ResponseEntity<ApiResponse<?>> getMonthlyTrend(
            @RequestParam(defaultValue = "0") int year) {
        try {
            int y = year > 0 ? year : LocalDate.now().getYear();
            var trend = payrollService.getMonthlyTrend(y);
            return ResponseEntity.ok(ApiResponse.success("Monthly trend fetched", trend));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Analytics: Department cost ────────────────────────────────────────────
    @GetMapping("/analytics/dept-cost")
    public ResponseEntity<ApiResponse<?>> getDeptCost(
            @RequestParam(defaultValue = "0") int year,
            @RequestParam(defaultValue = "0") int month) {
        try {
            LocalDate now = LocalDate.now();
            int y = year > 0 ? year : now.getYear();
            int m = month > 0 ? month : now.getMonthValue();
            var cost = payrollService.getDeptCost(y, m);
            return ResponseEntity.ok(ApiResponse.success("Department cost fetched", cost));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Analytics: Employee salary growth ────────────────────────────────────
    @GetMapping("/analytics/employee-growth/{userId}")
    public ResponseEntity<ApiResponse<?>> getEmployeeGrowth(
            @PathVariable Long userId) {
        try {
            var growth = payrollService.getEmployeeGrowth(userId);
            return ResponseEntity.ok(ApiResponse.success("Employee growth fetched", growth));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

}