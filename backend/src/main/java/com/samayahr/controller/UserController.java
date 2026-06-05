package com.samayahr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.User;
import com.samayahr.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/tenant")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByTenant(
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            List<User> users = userService.getAllUsersByTenant(tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Users fetched for tenant", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tenant/employees")
    public ResponseEntity<ApiResponse<List<User>>> getEmployeesByTenant(
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            List<User> users = userService.getEmployeesByTenant(tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Employees fetched for tenant", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tenant/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getEmployeeCountByTenant(
            @RequestHeader("X-Tenant-Code") String tenantCode) {
        try {
            long count = userService.getEmployeeCountByTenant(tenantCode);
            return ResponseEntity.ok(ApiResponse.success("Employee count fetched",
                    Map.of("employeeCount", count)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tenant/search")
    public ResponseEntity<ApiResponse<List<User>>> searchUsersByTenant(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestParam("query") String query) {
        try {
            List<User> users = userService.searchUsersByTenant(tenantCode, query);
            return ResponseEntity.ok(ApiResponse.success("Search results for tenant", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tenant/department/{department}")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByTenantAndDepartment(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @PathVariable("department") String department) {
        try {
            List<User> users = userService.getUsersByTenantAndDepartment(tenantCode, department);
            return ResponseEntity.ok(ApiResponse.success("Users fetched by department", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tenant/status/{status}")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByTenantAndStatus(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @PathVariable("status") String status) {
        try {
            List<User> users = userService.getUsersByTenantAndStatus(tenantCode, status);
            return ResponseEntity.ok(ApiResponse.success("Users fetched by status", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tenant/{id}")
    public ResponseEntity<ApiResponse<User>> getUserByIdWithTenantValidation(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @PathVariable("id") Long id) {
        try {
            User user = userService.getUserByIdWithTenantValidation(id, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("User fetched", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/tenant/{id}")
    public ResponseEntity<ApiResponse<User>> updateUserWithTenantValidation(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @PathVariable("id") Long id,
            @RequestBody User user) {
        try {
            User updated = userService.updateUserWithTenantValidation(id, user, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("User updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/tenant/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUserWithTenantValidation(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @PathVariable("id") Long id) {
        try {
            userService.deleteUserWithTenantValidation(id, tenantCode);
            return ResponseEntity.ok(ApiResponse.success("User deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ========== EXISTING ENDPOINTS ==========

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(
            @PathVariable("id") Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success("User fetched", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        try {
            User user = userService.getCurrentUser();
            return ResponseEntity.ok(ApiResponse.success("Current user fetched", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable("id") Long id,
            @RequestBody User user) {
        try {
            User updated = userService.updateUser(id, user);
            return ResponseEntity.ok(ApiResponse.success("User updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateCurrentUser(@RequestBody User user) {
        try {
            User updated = userService.updateCurrentUser(user);
            return ResponseEntity.ok(ApiResponse.success("Profile updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ========== PROFILE PHOTO ENDPOINTS ==========

    /**
     * POST /api/users/{userId}/upload-photo
     * Uploads profile photo to Cloudinary → hrms/{tenantCode}/profile_photos/
     */
    @PostMapping("/{userId}/upload-photo")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadUserPhotoSimple(
            @PathVariable("userId") Long userId,
            @RequestParam("photo") MultipartFile file) {
        try {
            String photoUrl = userService.uploadUserPhotoSimple(userId, file);
            return ResponseEntity.ok(ApiResponse.success("Photo uploaded",
                    Map.of("photoUrl", photoUrl,
                           "message", "Profile photo uploaded successfully")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/me/upload-photo")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadPhotoWithUserId(
            @RequestParam("photo") MultipartFile file,
            @RequestParam(value = "userId", required = false) Long userId) {
        try {
            if (userId == null)
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId is required"));
            String photoUrl = userService.uploadUserPhotoSimple(userId, file);
            return ResponseEntity.ok(ApiResponse.success("Photo uploaded",
                    Map.of("photoUrl", photoUrl,
                           "message", "Profile photo uploaded successfully")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{userId}/photo")
    public ResponseEntity<ApiResponse<Map<String, String>>> getUserPhoto(
            @PathVariable("userId") Long userId) {
        try {
            String photoUrl = userService.getUserPhotoUrl(userId);
            return ResponseEntity.ok(ApiResponse.success("Photo URL fetched",
                    Map.of("photoUrl", photoUrl != null ? photoUrl : "")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/photo")
    public ResponseEntity<ApiResponse<String>> deleteUserPhotoSimple(
            @PathVariable("userId") Long userId) {
        try {
            userService.deleteUserPhotoSimple(userId);
            return ResponseEntity.ok(ApiResponse.success("Profile photo deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ========== OFFER LETTER ENDPOINTS ==========

    @PostMapping("/{userId}/upload-offer-letter")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadOfferLetter(
            @PathVariable("userId") Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String url = userService.uploadOfferLetter(userId, file);
            return ResponseEntity.ok(ApiResponse.success("Offer letter uploaded",
                    Map.of("offerLetterUrl", url,
                           "message", "Offer letter uploaded successfully")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/offer-letter")
    public ResponseEntity<ApiResponse<String>> deleteOfferLetter(
            @PathVariable("userId") Long userId) {
        try {
            userService.deleteOfferLetter(userId);
            return ResponseEntity.ok(ApiResponse.success("Offer letter deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ========== OTHER ENDPOINTS ==========

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @RequestBody Map<String, String> request) {
        try {
            userService.changePassword(
                    request.get("oldPassword"), request.get("newPassword"));
            return ResponseEntity.ok(
                    ApiResponse.success("Password changed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteUser(
            @PathVariable("id") Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("User deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByRole(
            @PathVariable("role") String role) {
        try {
            List<User> users = userService.getUsersByRole(role);
            return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByStatus(
            @PathVariable("status") String status) {
        try {
            List<User> users = userService.getUsersByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> searchUsers(
            @RequestParam("query") String query) {
        try {
            List<User> users = userService.searchUsers(query);
            return ResponseEntity.ok(ApiResponse.success("Search results", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tenant/admins")
    public ResponseEntity<ApiResponse<List<User>>> getAdminsByTenantCompany(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestHeader("X-Company-Id") Long companyId) {
        try {
            List<User> admins = userService.getAdminsByTenantCompany(tenantCode, companyId);
            return ResponseEntity.ok(ApiResponse.success("Admins fetched", admins));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/tenant/admins")
    public ResponseEntity<ApiResponse<User>> createAdminByTenantCompany(
            @RequestHeader("X-Tenant-Code") String tenantCode,
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestBody Map<String, String> payload) {
        try {
            User created = userService.createAdminForTenantCompany(tenantCode, companyId, payload);
            return ResponseEntity.ok(ApiResponse.success("Admin created", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}