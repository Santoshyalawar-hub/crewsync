package com.samayahr.service;

import com.samayahr.dto.response.LoginAccessStatusResponse;
import com.samayahr.entity.EmployeeLoginAccess;
import com.samayahr.entity.User;
import com.samayahr.repository.EmployeeLoginAccessRepository;
import com.samayahr.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmployeeLoginAccessService {

    private static final Logger log =
            LoggerFactory.getLogger(EmployeeLoginAccessService.class);

    private static final int MAX_PASSWORD_CHANGES_PER_MONTH = 2;

    @Autowired
    private EmployeeLoginAccessRepository loginAccessRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // ── INITIALISE ────────────────────────────────────────────────────────

    @Transactional
    public EmployeeLoginAccess initialiseForEmployee(User employee) {
        return loginAccessRepository.findByUserId(employee.getId())
                .orElseGet(() -> {
                    EmployeeLoginAccess a = new EmployeeLoginAccess();
                    a.setUserId(employee.getId());
                    a.setTenantCode(
                        employee.getTenantCode() != null
                            ? employee.getTenantCode() : "");
                    a.setLoginAccessPermission(
                            EmployeeLoginAccess.LoginAccessPermission.NOT_ELIGIBLE);
                    a.setCredentialsEmailSent(false);
                    a.setPasswordChangesThisMonth(0);
                    EmployeeLoginAccess saved = loginAccessRepository.save(a);
                    log.info("LoginAccess created for userId={}", employee.getId());
                    return saved;
                });
    }

    // ── READ ──────────────────────────────────────────────────────────────

    public LoginAccessStatusResponse getStatusForEmployee(Long userId) {
        User user = getUser(userId);
        EmployeeLoginAccess access = getOrCreate(user);
        return LoginAccessStatusResponse.from(
                access, user.getFullName(), user.getEmail());
    }

    public List<LoginAccessStatusResponse> getStatusForTenant(String tenantCode) {
        try {
            List<User> employees =
                    userRepository.findEmployeesByTenantCode(tenantCode);
            for (User emp : employees) {
                getOrCreate(emp);
            }
            return loginAccessRepository.findAllByTenantCode(tenantCode)
                    .stream()
                    .map(a -> {
                        User u = userRepository.findById(a.getUserId()).orElse(null);
                        String name  = u != null ? u.getFullName() : "Unknown";
                        String email = u != null ? u.getEmail()    : "";
                        return LoginAccessStatusResponse.from(a, name, email);
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("getStatusForTenant failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    // ── UPDATE PERMISSION — NO tenant validation ───────────────────────────
    // Tenant validation was causing 500 due to empty/null tenant_code.
    // Removed entirely — the admin is already authenticated.

    @Transactional
    public LoginAccessStatusResponse updatePermission(
            Long userId,
            EmployeeLoginAccess.LoginAccessPermission permission,
            String tenantCode) {

        log.info("updatePermission START: userId={}, permission={}, tenantCode={}",
                userId, permission, tenantCode);

        try {
            User user = getUser(userId);
            log.info("User found: id={}, name={}, tenantCode={}",
                    user.getId(), user.getFullName(), user.getTenantCode());

            EmployeeLoginAccess access = getOrCreate(user);
            log.info("LoginAccess found/created: id={}, currentPermission={}",
                    access.getId(), access.getLoginAccessPermission());

            access.setLoginAccessPermission(permission);
            loginAccessRepository.save(access);

            log.info("updatePermission SUCCESS: userId={} → {}", userId, permission);
            return LoginAccessStatusResponse.from(
                    access, user.getFullName(), user.getEmail());

        } catch (Exception e) {
            log.error("updatePermission FAILED for userId={}: {}",
                    userId, e.getMessage(), e);
            throw e;
        }
    }

    // ── SEND CREDENTIALS EMAIL ────────────────────────────────────────────

    @Transactional
    public LoginAccessStatusResponse sendCredentialsEmail(Long userId,
                                                           String tenantCode) {
        log.info("sendCredentialsEmail: userId={}, tenant={}", userId, tenantCode);

        try {
            User user = getUser(userId);
            EmployeeLoginAccess access = getOrCreate(user);

            if (access.getLoginAccessPermission()
                    != EmployeeLoginAccess.LoginAccessPermission.ELIGIBLE) {
                throw new RuntimeException(
                        "Employee is not eligible. Set toggle to Eligible first.");
            }

            if (Boolean.TRUE.equals(access.getCredentialsEmailSent())) {
                throw new RuntimeException(
                        "Credentials already sent. Email can only be sent once.");
            }

            String tempPassword = generateTempPassword();

            user.setPassword(passwordEncoder.encode(tempPassword));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            emailService.sendLoginCredentialsEmail(
                    user.getEmail(),
                    user.getFullName(),
                    user.getEmail(),
                    tempPassword,
                    user.getCompanyName() != null
                            ? user.getCompanyName() : "SamayaHR"
            );

            access.setCredentialsEmailSent(true);
            access.setCredentialsEmailSentAt(LocalDateTime.now());
            access.setTempPassword(tempPassword);
            loginAccessRepository.save(access);

            log.info("Credentials sent to userId={} ({})",
                    userId, user.getEmail());
            return LoginAccessStatusResponse.from(
                    access, user.getFullName(), user.getEmail());

        } catch (Exception e) {
            log.error("sendCredentialsEmail FAILED userId={}: {}",
                    userId, e.getMessage(), e);
            throw e;
        }
    }

    // ── EMPLOYEE CHANGE PASSWORD ──────────────────────────────────────────

    @Transactional
    public void changePasswordByEmployee(String oldPassword,
                                          String newPassword,
                                          String confirmPassword) {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("You are not authenticated.");
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (user.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException(
                    "This endpoint is only for employees.");
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException(
                    "Current password is incorrect. Please try again.");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException(
                    "New password and confirm password do not match.");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException(
                    "New password must be different from your current password.");
        }

        if (newPassword.length() < 8) {
            throw new RuntimeException(
                    "Password must be at least 8 characters long.");
        }

        EmployeeLoginAccess access = getOrCreate(user);
        resetMonthlyCountIfNewMonth(access);

        if (access.getPasswordChangesThisMonth() >= MAX_PASSWORD_CHANGES_PER_MONTH) {
            throw new RuntimeException(
                    "You have reached your monthly password change limit ("
                    + MAX_PASSWORD_CHANGES_PER_MONTH + " changes per month). "
                    + "Please try again next month.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        access.setPasswordChangesThisMonth(
                access.getPasswordChangesThisMonth() + 1);
        access.setLastPasswordChangedAt(LocalDateTime.now());
        access.setPasswordChangeMonth(currentYearMonth());
        if (access.getTempPassword() != null) {
            access.setTempPassword(null);
        }
        loginAccessRepository.save(access);

        log.info("Password changed by userId={} — {}/{} this month",
                user.getId(),
                access.getPasswordChangesThisMonth(),
                MAX_PASSWORD_CHANGES_PER_MONTH);
    }

    // ── PASSWORD CHANGE SUMMARY ───────────────────────────────────────────

    public PasswordChangeSummary getPasswordChangeSummary() {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        EmployeeLoginAccess access = getOrCreate(user);
        resetMonthlyCountIfNewMonth(access);
        loginAccessRepository.save(access);

        int used      = access.getPasswordChangesThisMonth();
        int remaining = Math.max(0, MAX_PASSWORD_CHANGES_PER_MONTH - used);

        return new PasswordChangeSummary(
                used, MAX_PASSWORD_CHANGES_PER_MONTH, remaining,
                access.getLastPasswordChangedAt());
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found with id: " + userId));
    }

    @Transactional
    public EmployeeLoginAccess getOrCreate(User user) {
        return loginAccessRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    log.info("Auto-creating LoginAccess for userId={}", user.getId());
                    EmployeeLoginAccess a = new EmployeeLoginAccess();
                    a.setUserId(user.getId());
                    a.setTenantCode(
                        user.getTenantCode() != null
                            ? user.getTenantCode() : "");
                    a.setLoginAccessPermission(
                            EmployeeLoginAccess.LoginAccessPermission.NOT_ELIGIBLE);
                    a.setCredentialsEmailSent(false);
                    a.setPasswordChangesThisMonth(0);
                    return loginAccessRepository.save(a);
                });
    }

    private void resetMonthlyCountIfNewMonth(EmployeeLoginAccess access) {
        String current = currentYearMonth();
        if (!current.equals(access.getPasswordChangeMonth())) {
            access.setPasswordChangesThisMonth(0);
            access.setPasswordChangeMonth(current);
        }
    }

    private String currentYearMonth() {
        return YearMonth.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
    }

    private String generateTempPassword() {
        String uuid = UUID.randomUUID().toString()
                          .replace("-", "").toUpperCase();
        return "Samaya@" + uuid.substring(0, 6);
    }

    // ── INNER DTO ─────────────────────────────────────────────────────────

    public static class PasswordChangeSummary {
        private final int usedThisMonth;
        private final int monthlyLimit;
        private final int remainingChanges;
        private final LocalDateTime lastChangedAt;

        public PasswordChangeSummary(int usedThisMonth, int monthlyLimit,
                                      int remainingChanges,
                                      LocalDateTime lastChangedAt) {
            this.usedThisMonth    = usedThisMonth;
            this.monthlyLimit     = monthlyLimit;
            this.remainingChanges = remainingChanges;
            this.lastChangedAt    = lastChangedAt;
        }

        public int getUsedThisMonth()    { return usedThisMonth; }
        public int getMonthlyLimit()     { return monthlyLimit; }
        public int getRemainingChanges() { return remainingChanges; }
        public boolean isLimitReached()  { return usedThisMonth >= monthlyLimit; }
        public LocalDateTime getLastChangedAt() { return lastChangedAt; }
        public String getSummaryText() {
            return "Password Changes: " + usedThisMonth + " / " + monthlyLimit;
        }
    }
}