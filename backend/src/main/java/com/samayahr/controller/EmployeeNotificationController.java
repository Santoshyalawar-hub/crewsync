//package com.samayahr.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.samayahr.dto.response.EmployeeNotificationResponse;
//import com.samayahr.service.NotificationService;
//import com.samayahr.service.UserService;
//
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/api/employee/notifications")
//@CrossOrigin(
//	    origins = "http://localhost:3000",
//	    allowCredentials = "true"
//	)
//public class EmployeeNotificationController {
//@Autowired
//    private  NotificationService notificationService;
//@Autowired
//    private  UserService userService; 
//
//    @GetMapping
//    public ResponseEntity<List<EmployeeNotificationResponse>> getMyNotifications(
//            Authentication auth) {
//
//        if (auth == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        String employeeId = auth.getName();
//
//        // Fetch the real department, or default to "ALL" if unknown/not found
//        String department = getDepartmentForUser(employeeId);
//
//        return ResponseEntity.ok(
//                notificationService.getNotificationsForEmployee(employeeId, department)
//        );
//    }
//
//    @PutMapping("/{id}/read")
//    public ResponseEntity<Void> markRead(
//            @PathVariable Long id,
//            Authentication auth) {
//
//        if (auth == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        notificationService.markAsRead(id, auth.getName());
//        return ResponseEntity.ok().build();
//    }
//
//    @PutMapping("/read-all")
//    public ResponseEntity<Void> markAllRead(Authentication auth) {
//
//        if (auth == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        notificationService.markAllRead(auth.getName());
//        return ResponseEntity.ok().build();
//    }
//
//    @PostMapping("/{id}/acknowledge")
//    public ResponseEntity<Void> acknowledge(
//            @PathVariable Long id,
//            Authentication auth) {
//
//        if (auth == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        notificationService.acknowledge(id, auth.getName());
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> dismiss(
//            @PathVariable Long id,
//            Authentication auth) {
//
//        if (auth == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        notificationService.dismiss(id, auth.getName());
//        return ResponseEntity.ok().build();
//    }
//
//    // --- Helper Method ---
//    private String getDepartmentForUser(String empId) {
//        try {
//            // User user = userService.findById(empId);
//            // if (user != null && user.getDepartment() != null) {
//            //     return user.getDepartment();
//            // }
//            return "ALL";
//        } catch (Exception e) {
//            return "ALL";
//        }
//    }
//    
//    //Production 
//    
////    private String getDepartmentForUser(String email) {
////        User user = userService.findByEmail(email);
////        return user != null && user.getDepartment() != null
////                ? user.getDepartment()
////                : "ALL";
////    }
//
//}


package com.samayahr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samayahr.dto.response.EmployeeNotificationResponse;
import com.samayahr.entity.User;
import com.samayahr.repository.UserRepository;
import com.samayahr.service.NotificationService;

/**
 * EmployeeNotificationController
 *
 * All endpoints are tenant-scoped.
 * The employee's email (from JWT auth.getName()) is used as employeeId.
 * Department is fetched from the User record for accurate targeting.
 *
 * Endpoints:
 *   GET    /api/employee/notifications              — get my notifications
 *   PUT    /api/employee/notifications/{id}/read    — mark one as read
 *   PUT    /api/employee/notifications/read-all     — mark all as read
 *   POST   /api/employee/notifications/{id}/acknowledge — acknowledge
 *   DELETE /api/employee/notifications/{id}         — dismiss
 */
@RestController
@RequestMapping("/api/employee/notifications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EmployeeNotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // ── GET my notifications ──────────────────────────────────────────────────

    /**
     * GET /api/employee/notifications
     *
     * Headers (optional — used for tenant-scoping validation):
     *   X-Tenant-Code : <tenantCode>
     *
     * Auth: JWT (email = auth.getName())
     */
    @GetMapping
    public ResponseEntity<List<EmployeeNotificationResponse>> getMyNotifications(
            Authentication auth,
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCodeHeader) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = auth.getName();

        // ── Fetch real user to get department & tenant ────────────────────────
        User user = userRepository.findByEmail(email).orElse(null);

        String employeeId = email; // use email as stable identifier for notifications
        String department = "ALL";

        if (user != null) {
            // Use department from user record for accurate notification targeting
            if (user.getDepartment() != null && !user.getDepartment().trim().isEmpty()) {
                department = user.getDepartment();
            }
            // Tenant guard: if header provided, validate it matches user's tenant
            if (tenantCodeHeader != null && !tenantCodeHeader.isBlank()) {
                if (user.getTenantCode() != null
                        && !tenantCodeHeader.equals(user.getTenantCode())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            }
        }

        List<EmployeeNotificationResponse> notifications =
                notificationService.getNotificationsForEmployee(employeeId, department);

        return ResponseEntity.ok(notifications);
    }

    // ── Mark one as read ──────────────────────────────────────────────────────

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(
            @PathVariable Long id,
            Authentication auth) {

        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        notificationService.markAsRead(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    // ── Mark all as read ──────────────────────────────────────────────────────

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(Authentication auth) {

        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        notificationService.markAllRead(auth.getName());
        return ResponseEntity.ok().build();
    }

    // ── Acknowledge ───────────────────────────────────────────────────────────

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<Void> acknowledge(
            @PathVariable Long id,
            Authentication auth) {

        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        notificationService.acknowledge(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    // ── Dismiss ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> dismiss(
            @PathVariable Long id,
            Authentication auth) {

        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        notificationService.dismiss(id, auth.getName());
        return ResponseEntity.ok().build();
    }
}