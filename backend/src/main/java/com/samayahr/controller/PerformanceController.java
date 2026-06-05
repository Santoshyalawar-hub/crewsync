//package com.hireconnect.controller;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestHeader;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.hireconnect.dto.request.PerformanceRequest;
//import com.hireconnect.dto.response.ApiResponse;
//import com.hireconnect.dto.response.PerformanceResponse;
//import com.hireconnect.entity.User;
//import com.hireconnect.repository.UserRepository;
//import com.hireconnect.service.PerformanceService;
//
//@RestController
//@RequestMapping("/api/performance")
//@CrossOrigin(origins = "*")
//public class PerformanceController {
//
//    @Autowired
//    private PerformanceService performanceService;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @GetMapping("/me")
//    public ResponseEntity<ApiResponse<PerformanceResponse>> getMyPerformance() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(ApiResponse.error("Unauthorized"));
//        }
//
//        String email = auth.getName();
//        User user = userRepository.findByEmail(email)
//                .orElse(null);
//
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(ApiResponse.error("User not found"));
//        }
//
//        if (user.getRole() != User.Role.EMPLOYEE) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                    .body(ApiResponse.error("Access denied"));
//        }
//
//        try {
//            PerformanceResponse data = performanceService.getPerformanceByUserId(user.getId());
//            return ResponseEntity.ok(ApiResponse.success("Performance fetched successfully", data));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(ApiResponse.error(e.getMessage()));
//        }
//    }
//
//    // Admin all (not tenant)
//    @GetMapping("/all")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<List<PerformanceResponse>>> getAllPerformance() {
//        List<PerformanceResponse> data = performanceService.getAllPerformance();
//        return ResponseEntity.ok(ApiResponse.success("Performance data fetched successfully", data));
//    }
//
//    // ✅ Tenant all (dashboard)
//    @GetMapping("/tenant/all")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<List<PerformanceResponse>>> getTenantPerformance(
//            @RequestHeader("X-Tenant-Code") String tenantCode
//    ) {
//        List<PerformanceResponse> data = performanceService.getTenantPerformance(tenantCode);
//        return ResponseEntity.ok(ApiResponse.success("Tenant performance fetched successfully", data));
//    }
//
//    @PostMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<PerformanceResponse>> createPerformance(
//            @RequestHeader("X-Tenant-Code") String tenantCode,
//            @RequestBody PerformanceRequest request
//    ) {
//        try {
//            PerformanceResponse created = performanceService.createPerformance(request, tenantCode);
//            return ResponseEntity.status(HttpStatus.CREATED)
//                    .body(ApiResponse.success("Performance record created successfully", created));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ApiResponse.error(e.getMessage()));
//        }
//    }
//
//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<PerformanceResponse>> updatePerformance(
//            @RequestHeader("X-Tenant-Code") String tenantCode,
//            @PathVariable Long id,
//            @RequestBody PerformanceRequest request
//    ) {
//        try {
//            PerformanceResponse updated = performanceService.updatePerformance(id, request, tenantCode);
//            return ResponseEntity.ok(ApiResponse.success("Performance record updated successfully", updated));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ApiResponse.error(e.getMessage()));
//        }
//    }
//
//    @PutMapping("/validate/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<String>> validatePerformance(
//            @RequestHeader("X-Tenant-Code") String tenantCode,
//            @PathVariable Long id,
//            @RequestBody Map<String, Boolean> request
//    ) {
//        try {
//            Boolean validated = request.get("validated");
//            performanceService.setValidationStatus(id, validated, tenantCode);
//            String message = Boolean.TRUE.equals(validated)
//                    ? "Performance validated successfully"
//                    : "Validation revoked successfully";
//            return ResponseEntity.ok(ApiResponse.success(message, null));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ApiResponse.error(e.getMessage()));
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<String>> deletePerformance(
//            @RequestHeader("X-Tenant-Code") String tenantCode,
//            @PathVariable Long id
//    ) {
//        try {
//            performanceService.deletePerformance(id, tenantCode);
//            return ResponseEntity.ok(ApiResponse.success("Performance record deleted successfully", null));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ApiResponse.error(e.getMessage()));
//        }
//    }
//}

package com.samayahr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.samayahr.dto.request.PerformanceRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.dto.response.LeaderboardResponse;
import com.samayahr.dto.response.PerformanceResponse;
import com.samayahr.entity.User;
import com.samayahr.repository.UserRepository;
import com.samayahr.service.PerformanceService;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    @Autowired
    private UserRepository userRepository;

    /* ================= EXISTING ENDPOINTS ================= */

@GetMapping("/me")
public ResponseEntity<ApiResponse<PerformanceResponse>> getMyPerformance() {
    try {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized"));
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not found"));
        }

        if (user.getRole() != User.Role.EMPLOYEE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied"));
        }

        PerformanceResponse data = performanceService.getPerformanceByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Performance fetched successfully", data));
    } catch (Exception e) {
        e.printStackTrace(); // Log the full error
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error: " + e.getMessage()));
    }
}

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PerformanceResponse>>> getAllPerformance() {
        List<PerformanceResponse> data = performanceService.getAllPerformance();
        return ResponseEntity.ok(ApiResponse.success("Performance data fetched successfully", data));
    }

    @GetMapping("/tenant/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PerformanceResponse>>> getTenantPerformance(
            @RequestHeader("X-Tenant-Code") String tenantCode
    ) {
        List<PerformanceResponse> data = performanceService.getTenantPerformance(tenantCode);
        return ResponseEntity.ok(ApiResponse.success("Tenant performance fetched successfully", data));
    }

    /* ================= NEW: MONTH-BASED ENDPOINTS ================= */

    @GetMapping("/tenant/by-month")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PerformanceResponse>>> getTenantPerformanceByMonth(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestParam String month
    ) {
        List<PerformanceResponse> data = performanceService.getTenantPerformanceByMonth(tenantCode, month);
        return ResponseEntity.ok(ApiResponse.success("Performance data for month fetched successfully", data));
    }

    @GetMapping("/tenant/months")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableMonths(
            @RequestHeader("X-Tenant-Code") String tenantCode
    ) {
        List<String> months = performanceService.getAvailableMonths(tenantCode);
        return ResponseEntity.ok(ApiResponse.success("Available months fetched successfully", months));
    }

@GetMapping("/leaderboard")
public ResponseEntity<ApiResponse<LeaderboardResponse>> getLeaderboard() {
    try {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized"));
        }

        LeaderboardResponse data = performanceService.getLeaderboardForCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Leaderboard fetched successfully", data));
    } catch (Exception e) {
        e.printStackTrace(); // Log the full error
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error: " + e.getMessage()));
    }
}

    /* ================= EXISTING CRUD ENDPOINTS ================= */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PerformanceResponse>> createPerformance(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestBody PerformanceRequest request
    ) {
        try {
            PerformanceResponse created = performanceService.createPerformance(request, tenantCode);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Performance record created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PerformanceResponse>> updatePerformance(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @PathVariable Long id,
            @RequestBody PerformanceRequest request
    ) {
        try {
            PerformanceResponse updated = performanceService.updatePerformance(id, request, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Performance record updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/validate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> validatePerformance(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request
    ) {
        try {
            Boolean validated = request.get("validated");
            performanceService.setValidationStatus(id, validated, tenantCode);
            String message = Boolean.TRUE.equals(validated)
                    ? "Performance validated successfully"
                    : "Validation revoked successfully";
            return ResponseEntity.ok(ApiResponse.success(message, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deletePerformance(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @PathVariable Long id
    ) {
        try {
            performanceService.deletePerformance(id, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Performance record deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}