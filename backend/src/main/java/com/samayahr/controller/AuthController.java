package com.samayahr.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samayahr.dto.request.LoginRequest;
import com.samayahr.dto.request.RegisterRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.dto.response.AuthResponse;
import com.samayahr.service.AuthService;
import com.samayahr.service.PasswordResetService;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

	@Autowired
    private AuthService authService;

    @Autowired(required = false)
    private PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<String>> validateToken() {
        return ResponseEntity.ok(ApiResponse.success("Token is valid", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getCurrentUser() {
        try {
            var user = authService.getCurrentUser();
            return ResponseEntity.ok(ApiResponse.success("User fetched", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/auth/forgot-password
     * Body: { "email": "user@company.com" }
     * Always returns success to prevent email enumeration.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            if (passwordResetService != null) {
                passwordResetService.requestPasswordReset(body.get("email"));
            }
        } catch (Exception ignored) {
            // Silently ignore — always return 200 to prevent enumeration
        }
        return ResponseEntity.ok(ApiResponse.success(
            "If that email is registered, a reset link has been sent.", null));
    }

    /**
     * POST /api/auth/reset-password
     * Body: { "token": "uuid", "newPassword": "..." }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody Map<String, String> body) {
        try {
            if (passwordResetService == null)
                throw new RuntimeException("Password reset service is not available.");
            passwordResetService.resetPassword(body.get("token"), body.get("newPassword"));
            return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully.", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
