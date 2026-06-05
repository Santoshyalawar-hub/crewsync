package com.samayahr.service;

import com.samayahr.entity.User;
import com.samayahr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * PasswordResetService
 *
 * Handles two security flows:
 *
 * 1. Forgot Password:
 *    requestPasswordReset(email) → token generated → email sent
 *    resetPassword(token, newPassword) → password updated → token cleared
 *
 * 2. Email Verification:
 *    sendVerificationEmail(user) → token generated → email sent
 *    verifyEmail(token) → isVerified = true → token cleared
 *    resendVerificationEmail(email) → new token → email sent again
 *
 * Both tokens use UUID strings stored on the User entity.
 * Both flows are safe when email is not configured (log error, don't crash).
 */
@Service
public class PasswordResetService {

    @Autowired
    private UserRepository  userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // EmailService injected with required=false — won't crash if email
    // is not yet configured in application.properties
    @Autowired(required = false)
    private EmailService emailService;

    // ── Forgot password — Step 1 ──────────────────────────────────────────────

    /**
     * Employee calls "Forgot Password" with their email.
     *
     * - Generates a UUID reset token valid for 1 hour
     * - Saves token + expiry on the User record
     * - Sends email with reset link
     *
     * Always returns success even if email does not exist
     * (security: don't reveal whether an account exists).
     */
    @Transactional
    public void requestPasswordReset(String email) {
        if (email == null || email.trim().isEmpty()) return;

        userRepository.findByEmail(email.trim().toLowerCase())
                .ifPresent(user -> {
                    String token = UUID.randomUUID().toString();

                    user.setResetPasswordToken(token);
                    user.setResetPasswordExpire(
                            LocalDateTime.now().plusHours(1));
                    userRepository.save(user);

                    if (emailService != null) {
                        try {
                            emailService.sendPasswordResetEmail(
                                    user.getEmail(),
                                    user.getFullName(),
                                    token);
                        } catch (Exception e) {
                            System.err.println(
                                    "Password reset email failed for "
                                    + user.getEmail() + ": " + e.getMessage());
                        }
                    } else {
                        // Email not configured — log token for development
                        System.out.println(
                                "[DEV] Password reset token for "
                                + user.getEmail() + ": " + token);
                    }
                });
    }

    // ── Forgot password — Step 2 ──────────────────────────────────────────────

    /**
     * Employee submits the reset form with token + new password.
     *
     * - Validates token exists and is not expired
     * - Updates password (hashed only — plainPassword removed)
     * - Clears token so it cannot be reused
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        if (token == null || token.trim().isEmpty())
            throw new RuntimeException("Reset token is required");

        if (newPassword == null || newPassword.trim().length() < 6)
            throw new RuntimeException(
                    "Password must be at least 6 characters");

        User user = userRepository
                .findByResetPasswordTokenAndResetPasswordExpireAfter(
                        token.trim(), LocalDateTime.now())
                .orElseThrow(() -> new RuntimeException(
                        "Reset link is invalid or has expired. "
                        + "Please request a new one."));

        // Update password — hashed only, no plainPassword
        user.setPassword(passwordEncoder.encode(newPassword));

        // Clear token so it cannot be reused
        user.setResetPasswordToken(null);
        user.setResetPasswordExpire(null);

        userRepository.save(user);
    }

    // ── Email verification — Send ─────────────────────────────────────────────

    /**
     * Called from AuthService after a new employee registers.
     * Generates a verification token and sends the verification email.
     *
     * Safe to call even if email is not configured — just logs to console.
     */
    @Transactional
    public void sendVerificationEmail(User user) {
        String token = UUID.randomUUID().toString();

        user.setVerificationToken(token);
        user.setIsVerified(false);
        userRepository.save(user);

        if (emailService != null) {
            try {
                emailService.sendEmailVerificationEmail(
                        user.getEmail(),
                        user.getFullName(),
                        token);
            } catch (Exception e) {
                System.err.println(
                        "Verification email failed for "
                        + user.getEmail() + ": " + e.getMessage());
            }
        } else {
            // Email not configured — log token for development use
            System.out.println(
                    "[DEV] Email verification token for "
                    + user.getEmail() + ": " + token);
        }
    }

    // ── Email verification — Confirm ──────────────────────────────────────────

    /**
     * Employee clicks the verification link in their email.
     * GET /api/auth/verify-email?token=uuid
     *
     * - Finds user by token
     * - Sets isVerified = true
     * - Clears token so link cannot be reused
     */
    @Transactional
    public void verifyEmail(String token) {
        if (token == null || token.trim().isEmpty())
            throw new RuntimeException("Verification token is required");

        User user = userRepository
                .findByVerificationToken(token.trim())
                .orElseThrow(() -> new RuntimeException(
                        "Verification link is invalid or has already been used. "
                        + "Please request a new verification email."));

        user.setIsVerified(true);
        user.setVerificationToken(null); // clear so link can't be reused
        userRepository.save(user);
    }

    // ── Email verification — Resend ───────────────────────────────────────────

    /**
     * Employee requests a new verification email
     * if they lost or never received the first one.
     * POST /api/auth/resend-verification  { "email": "..." }
     */
    @Transactional
    public void resendVerificationEmail(String email) {
        if (email == null || email.trim().isEmpty())
            throw new RuntimeException("Email is required");

        User user = userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException(
                        "No account found with this email address"));

        if (Boolean.TRUE.equals(user.getIsVerified()))
            throw new RuntimeException(
                    "This email is already verified. You can login.");

        // Generate new token and resend
        sendVerificationEmail(user);
    }
}