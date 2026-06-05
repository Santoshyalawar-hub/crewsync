package com.samayahr.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.samayahr.dto.request.LoginRequest;
import com.samayahr.dto.request.RegisterRequest;
import com.samayahr.dto.response.AuthResponse;
import com.samayahr.entity.Company;
import com.samayahr.entity.User;
import com.samayahr.repository.CompanyRepository;
import com.samayahr.repository.UserRepository;
import com.samayahr.util.JwtUtil;

@Service
public class AuthService {

    @Autowired private UserRepository        userRepository;
    @Autowired private CompanyRepository     companyRepository;
    @Autowired private PasswordEncoder       passwordEncoder;
    @Autowired private JwtUtil               jwtUtil;
    @Autowired private AuthenticationManager authenticationManager;

    // ✅ Injected lazily to avoid circular dependency
    @Autowired(required = false)
    private PasswordResetService passwordResetService;

    @Autowired(required = false)
    private LeaveBalanceService leaveBalanceService;

    // ✅ NEW — Login Access Permission feature
    @Autowired(required = false)
    private EmployeeLoginAccessService employeeLoginAccessService;

    // ── Register ──────────────────────────────────────────────────────────────

    public AuthResponse register(RegisterRequest request) {

        User.Role role = resolveRole(request.getRole());

        if (role == User.Role.GLOBAL_ADMIN)
            throw new RuntimeException(
                    "GLOBAL_ADMIN cannot be created via registration endpoint");

        if (request.getTenantCode() == null
                || request.getTenantCode().trim().isEmpty())
            throw new RuntimeException(
                    "Tenant code is required for registration");

        String tenantCode = request.getTenantCode().trim();

        Company company = companyRepository.findByTenantCode(tenantCode)
                .orElseThrow(() -> new RuntimeException(
                        "Invalid tenant code: Company not found"));

        if (userRepository.existsByEmailAndTenantCode(
                request.getEmail(), tenantCode))
            throw new RuntimeException(
                    "Email already registered for this company");

        if (request.getEmployeeId() != null
                && !request.getEmployeeId().trim().isEmpty()
                && userRepository.existsByEmployeeIdAndTenantCode(
                        request.getEmployeeId(), tenantCode))
            throw new RuntimeException(
                    "Employee ID already exists for this company");

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmployeeId(request.getEmployeeId());
        user.setMobile(request.getMobile());
        user.setDepartment(request.getDepartment());
        user.setPosition(request.getPosition());
        user.setDob(request.getDob());
        user.setJoiningDate(request.getJoiningDate());
        user.setTenantCode(tenantCode);
        user.setCompanyId(company.getId());
        user.setCompanyName(company.getDisplayName());
        user.setRole(role);
        user.setIsAdmin(role == User.Role.ADMIN
                || role == User.Role.SUPER_ADMIN
                || role == User.Role.COMPANY_ADMIN);
        user.setStatus(User.Status.ACTIVE);
        user.setOnboardingStatus(User.OnboardingStatus.NOT_STARTED);

        User savedUser = userRepository.save(user);

        // ── Initialise leave balance ───────────────────────────────────────────
        if (leaveBalanceService != null
                && savedUser.getRole() == User.Role.EMPLOYEE) {
            try {
                leaveBalanceService.initialiseForEmployee(savedUser);
            } catch (Exception e) {
                System.err.println("Leave balance init failed: " + e.getMessage());
            }
        }

        // ── Initialise Login Access record (default: NOT_ELIGIBLE) ────────────
        // Admin must explicitly mark employee ELIGIBLE and click "Send Email".
        // Credentials are NEVER sent automatically on registration.
        if (employeeLoginAccessService != null
                && savedUser.getRole() == User.Role.EMPLOYEE) {
            try {
                employeeLoginAccessService.initialiseForEmployee(savedUser);
            } catch (Exception e) {
                System.err.println("LoginAccess init failed: " + e.getMessage());
                // Non-fatal — registration still completes
            }
        }

        // ── Increment company employee count ──────────────────────────────────
        if (role == User.Role.EMPLOYEE) {
            company.setEmployees(company.getEmployees() + 1);
            companyRepository.save(company);
        }

        // ── Send email verification (NOT login credentials) ───────────────────
        // Login credentials are sent manually from the Manage Employee table.
        if (passwordResetService != null) {
            try {
                passwordResetService.sendVerificationEmail(savedUser);
            } catch (Exception e) {
                System.err.println("Verification email failed (email not yet "
                        + "configured): " + e.getMessage());
            }
        }

        return buildAuthResponse(generateJwt(savedUser), savedUser);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getDeletedAt() != null)
            throw new RuntimeException(
                    "Account has been deactivated. Please contact support.");

        if (user.getStatus() == User.Status.INACTIVE)
            throw new RuntimeException(
                    "Account is inactive. Please contact your administrator.");

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return buildAuthResponse(generateJwt(user), user);
    }

    // ── Current user ──────────────────────────────────────────────────────────

    public User getCurrentUser() {
        org.springframework.security.core.Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException(
                        "Current user not found"));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User.Role resolveRole(String roleStr) {
        if (roleStr == null || roleStr.trim().isEmpty())
            return User.Role.EMPLOYEE;
        try {
            return User.Role.valueOf(roleStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return User.Role.EMPLOYEE;
        }
    }

    private String generateJwt(User user) {
        UserDetails ud = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name())));
        return jwtUtil.generateToken(ud);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        AuthResponse resp = new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getEmployeeId(),
                user.getRole().name(),
                user.getOnboardingStatus() != null
                        ? user.getOnboardingStatus().name() : "NOT_STARTED",
                user.getDob(),
                user.getJoiningDate(),
                user.getTenantCode(),
                user.getCompanyName());
        resp.setCompanyId(user.getCompanyId());
        return resp;
    }
}