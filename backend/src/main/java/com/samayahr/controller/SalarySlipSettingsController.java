package com.samayahr.controller;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samayahr.entity.SalarySlipSettings;
import com.samayahr.service.Salaryslipsettingsservice;

@RestController
@RequestMapping("/api/salary-slip-settings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SalarySlipSettingsController {

    @Autowired
    private Salaryslipsettingsservice service;

    /**
     * GET /api/salary-slip-settings/{tenantCode}
     * Used by the employee Finance Hub to fetch settings before generating the PDF.
     */
    @GetMapping("/{tenantCode}")
    public ResponseEntity<Map<String, Object>> getSettings(@PathVariable String tenantCode) {
        Map<String, Object> response = new HashMap<>();
        try {
            SalarySlipSettings settings = service.getByTenantCode(tenantCode);
            response.put("success", true);
            response.put("data", settings);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * PUT /api/salary-slip-settings/{tenantCode}
     * Global Admin or Company Admin can update salary slip settings.
     */
    @PutMapping("/{tenantCode}")
    public ResponseEntity<Map<String, Object>> updateSettings(
            @PathVariable String tenantCode,
            @RequestBody SalarySlipSettings settings) {
        Map<String, Object> response = new HashMap<>();
        try {
            settings.setTenantCode(tenantCode);
            SalarySlipSettings saved = service.saveSettings(settings);
            response.put("success", true);
            response.put("message", "Settings saved successfully");
            response.put("data", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * POST /api/salary-slip-settings
     * Create settings (called during company registration step 5).
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createSettings(@RequestBody SalarySlipSettings settings) {
        Map<String, Object> response = new HashMap<>();
        try {
            SalarySlipSettings saved = service.saveSettings(settings);
            response.put("success", true);
            response.put("message", "Salary slip settings created successfully");
            response.put("data", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}