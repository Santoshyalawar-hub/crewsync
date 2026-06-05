package com.samayahr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.samayahr.entity.CompanyDemoDetails;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.company.name:SamayaHR}")
    private String companyName;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:8080}")
    private String appBaseUrl;

    // ── Demo emails ────────────────────────────────────────────────────────────

    public void sendDemoRegistrationEmail(CompanyDemoDetails demoDetails) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("New Demo Request - " + demoDetails.getCompanyName());
            helper.setText(buildDemoRegistrationEmailBody(demoDetails), true);
            mailSender.send(message);
            logger.info("Demo registration email sent for company: {}",
                    demoDetails.getCompanyName());
        } catch (MessagingException e) {
            logger.error("Failed to send demo registration email for: {}",
                    demoDetails.getCompanyName(), e);
        }
    }

    public void sendDemoConfirmationToUser(CompanyDemoDetails demoDetails) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(demoDetails.getCompanyEmail());
            helper.setSubject("Demo Request Received - " + companyName);
            helper.setText(buildUserConfirmationEmailBody(demoDetails), true);
            mailSender.send(message);
            logger.info("Confirmation email sent to: {}",
                    demoDetails.getCompanyEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send confirmation email to: {}",
                    demoDetails.getCompanyEmail(), e);
        }
    }

    // ── Password reset ─────────────────────────────────────────────────────────

    public void sendPasswordResetEmail(String toEmail, String name, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset your " + companyName + " password");

            String resetLink = appBaseUrl + "/reset-password?token=" + token;

            String html = """
                <div style="font-family:Arial,sans-serif;max-width:600px;
                            margin:auto;border:1px solid #e0e0e0;
                            border-radius:8px;overflow:hidden;">
                  <div style="background:#1a237e;padding:24px;text-align:center;">
                    <h2 style="color:#fff;margin:0;">Password Reset Request</h2>
                  </div>
                  <div style="padding:32px;">
                    <p>Hi <strong>%s</strong>,</p>
                    <p>You requested a password reset. Click the button below
                       to set a new password.
                       This link expires in <strong>1 hour</strong>.</p>
                    <div style="text-align:center;margin:32px 0;">
                      <a href="%s"
                         style="background:#1a237e;color:#fff;padding:14px 32px;
                                text-decoration:none;border-radius:6px;
                                font-weight:bold;display:inline-block;">
                        Reset Password
                      </a>
                    </div>
                    <p style="color:#666;font-size:13px;">
                      Or copy this link into your browser:<br>
                      <a href="%s" style="color:#1a237e;word-break:break-all;">%s</a>
                    </p>
                    <p style="color:#e53935;font-size:13px;">
                      If you did not request this, ignore this email.
                      Your password will not change.
                    </p>
                  </div>
                  <div style="background:#f5f5f5;padding:16px;text-align:center;
                              font-size:12px;color:#999;">
                    &copy; %s
                  </div>
                </div>
                """.formatted(name, resetLink, resetLink, resetLink, companyName);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Password reset email sent to: {}", toEmail);

        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send reset email: " + e.getMessage());
        }
    }

    // ── Email verification ─────────────────────────────────────────────────────

    public void sendEmailVerificationEmail(String toEmail, String name, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify your " + companyName + " account");

            String verifyLink = appBaseUrl + "/verify-email?token=" + token;

            String html = """
                <div style="font-family:Arial,sans-serif;max-width:600px;
                            margin:auto;border:1px solid #e0e0e0;
                            border-radius:8px;overflow:hidden;">
                  <div style="background:#1a237e;padding:24px;text-align:center;">
                    <h2 style="color:#fff;margin:0;">Verify Your Email</h2>
                  </div>
                  <div style="padding:32px;">
                    <p>Hi <strong>%s</strong>,</p>
                    <p>Welcome to <strong>%s</strong>! Please verify your
                       email address to activate your account.</p>
                    <div style="text-align:center;margin:32px 0;">
                      <a href="%s"
                         style="background:#2e7d32;color:#fff;padding:14px 32px;
                                text-decoration:none;border-radius:6px;
                                font-weight:bold;display:inline-block;">
                        Verify Email Address
                      </a>
                    </div>
                    <p style="color:#666;font-size:13px;">
                      Or copy this link into your browser:<br>
                      <a href="%s" style="color:#2e7d32;word-break:break-all;">%s</a>
                    </p>
                    <p style="color:#666;font-size:13px;">
                      If you did not create this account, ignore this email.
                    </p>
                  </div>
                  <div style="background:#f5f5f5;padding:16px;text-align:center;
                              font-size:12px;color:#999;">
                    &copy; %s
                  </div>
                </div>
                """.formatted(name, companyName, verifyLink,
                               verifyLink, verifyLink, companyName);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Verification email sent to: {}", toEmail);

        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", toEmail, e);
            // Don't throw — verification email failure should not block registration
        }
    }

    // ── Employee welcome (existing method — kept unchanged) ────────────────────

    public void sendEmployeeWelcomeEmail(String toEmail, String employeeName,
                                          String loginEmail, String password,
                                          String companyDisplayName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to " + companyDisplayName
                    + " — Your Login Credentials");

            String html = """
                <div style="font-family:Arial,sans-serif;max-width:600px;
                            margin:auto;border:1px solid #e0e0e0;
                            border-radius:8px;overflow:hidden;">
                  <div style="background:#1a237e;padding:24px;text-align:center;">
                    <h2 style="color:#fff;margin:0;">Welcome to %s!</h2>
                  </div>
                  <div style="padding:32px;">
                    <p>Hi <strong>%s</strong>,</p>
                    <p>Your employee account has been created.
                       Here are your login credentials:</p>
                    <div style="background:#f5f5f5;border-radius:6px;
                                padding:16px;margin:24px 0;">
                      <p style="margin:0 0 8px;">
                        <strong>Login Email:</strong> %s
                      </p>
                      <p style="margin:0;">
                        <strong>Password:</strong>
                        <span style="font-family:monospace;background:#fff;
                                     padding:4px 8px;border-radius:4px;
                                     border:1px solid #ddd;">%s</span>
                      </p>
                    </div>
                    <p style="color:#e53935;font-size:13px;">
                      Please change your password after your first login.
                    </p>
                    <p>Once logged in, please complete your onboarding profile.</p>
                  </div>
                  <div style="background:#f5f5f5;padding:16px;text-align:center;
                              font-size:12px;color:#999;">
                    &copy; %s
                  </div>
                </div>
                """.formatted(companyDisplayName, employeeName,
                               loginEmail, password, companyDisplayName);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Welcome email sent to: {}", toEmail);

        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send welcome email: " + e.getMessage());
        }
    }

    // ── ✅ NEW — Login credentials email (sent manually from Manage Employee) ──

    /**
     * Sent when admin manually clicks "Send Credentials" for a specific employee.
     * Contains login email, temporary password, first-login instructions,
     * and password policy (max 2 changes/month).
     * This is sent ONCE — the backend guards against duplicates.
     */
    public void sendLoginCredentialsEmail(String toEmail,
                                           String employeeName,
                                           String loginEmail,
                                           String temporaryPassword,
                                           String companyDisplayName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your Login Credentials — " + companyDisplayName);

            String html = """
                <div style="font-family:Arial,sans-serif;max-width:600px;
                            margin:auto;border:1px solid #e0e0e0;
                            border-radius:10px;overflow:hidden;
                            box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <div style="background:linear-gradient(135deg,#1a237e,#283593);
                              padding:32px 24px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:22px;">
                      Welcome to %s
                    </h1>
                    <p style="color:rgba(255,255,255,0.75);margin:8px 0 0;font-size:13px;">
                      Your account is ready. Here are your login credentials.
                    </p>
                  </div>

                  <!-- Body -->
                  <div style="padding:32px 28px;background:#fff;">
                    <p style="font-size:15px;color:#1a1a2e;margin:0 0 8px;">
                      Hi <strong>%s</strong>,
                    </p>
                    <p style="font-size:13px;color:#555;line-height:1.6;margin:0 0 24px;">
                      Your HR administrator has set up your account on
                      <strong>%s</strong>. Use the credentials below to log in
                      for the first time.
                    </p>

                    <!-- Credentials box -->
                    <div style="background:#f4f6fb;border-radius:10px;
                                padding:20px 24px;margin:0 0 24px;
                                border:1px solid #e3e8f0;">
                      <table style="width:100%%;border-collapse:collapse;">
                        <tr>
                          <td style="padding:8px 0;width:40%%;font-size:12px;
                                     font-weight:700;color:#7986cb;
                                     text-transform:uppercase;letter-spacing:0.06em;">
                            Login Email
                          </td>
                          <td style="padding:8px 0;font-size:14px;
                                     color:#1a237e;font-weight:600;">
                            %s
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;font-size:12px;font-weight:700;
                                     color:#7986cb;text-transform:uppercase;
                                     letter-spacing:0.06em;
                                     border-top:1px solid #e3e8f0;">
                            Temporary Password
                          </td>
                          <td style="padding:8px 0;border-top:1px solid #e3e8f0;">
                            <span style="font-family:monospace;font-size:16px;
                                         font-weight:700;color:#e53935;
                                         background:#fff3f3;padding:5px 12px;
                                         border-radius:6px;border:1px solid #ffcdd2;
                                         letter-spacing:1px;">
                              %s
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- First-login notice -->
                    <div style="background:#fff8e1;border-left:4px solid #ffc107;
                                border-radius:6px;padding:14px 18px;margin:0 0 20px;">
                      <p style="margin:0;font-size:13px;color:#795548;font-weight:600;">
                        ⚠️ This is your first-time login password.
                      </p>
                      <p style="margin:6px 0 0;font-size:12px;color:#8d6e63;line-height:1.5;">
                        You can change your password after logging in from your dashboard.
                        Your <strong>email address cannot be changed</strong> —
                        it is your permanent username.
                      </p>
                    </div>

                    <!-- Password policy -->
                    <div style="background:#e8f5e9;border-left:4px solid #43a047;
                                border-radius:6px;padding:14px 18px;margin:0 0 20px;">
                      <p style="margin:0;font-size:13px;color:#2e7d32;font-weight:600;">
                        🔒 Password Policy
                      </p>
                      <ul style="margin:6px 0 0;padding-left:18px;
                                 font-size:12px;color:#388e3c;line-height:1.8;">
                        <li>You may change your password a maximum of
                            <strong>2 times per month</strong>.</li>
                        <li>Your <strong>email address (username)</strong>
                            cannot be changed.</li>
                        <li>Choose a strong password (minimum 8 characters).</li>
                      </ul>
                    </div>

                    <p style="font-size:13px;color:#555;line-height:1.6;">
                      If you have any trouble logging in, please contact your
                      HR administrator.
                    </p>
                  </div>

                  <!-- Footer -->
                  <div style="background:#f5f5f5;padding:16px 24px;
                              text-align:center;font-size:11px;color:#9e9e9e;
                              border-top:1px solid #e0e0e0;">
                    This is an automated message from <strong>%s</strong>.<br>
                    Please do not reply to this email.
                  </div>
                </div>
                """.formatted(
                    companyDisplayName,   // header company name
                    employeeName,         // Hi <name>
                    companyDisplayName,   // "your account on <company>"
                    loginEmail,           // credentials table — login email
                    temporaryPassword,    // credentials table — password
                    companyDisplayName    // footer
            );

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Login credentials email sent to: {}", toEmail);

        } catch (Exception e) {
            logger.error("Failed to send login credentials email to: {}", toEmail, e);
            throw new RuntimeException(
                    "Failed to send login credentials email: " + e.getMessage());
        }
    }

    // ── Company Admin Credentials (sent from Global Admin dashboard) ───────────

    public void sendCompanyAdminCredentials(String toEmail, String adminName,
                                             String adminEmail, String tenantCode,
                                             String companyDisplayName, String loginUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your SamayaHR Access Credentials — " + companyDisplayName);

            String html = """
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
                            border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;
                            box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                  <div style="background:linear-gradient(135deg,#FF6B35,#FF8C5A);
                              padding:32px 28px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;
                                letter-spacing:-0.5px;">SamayaHR</h1>
                    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                      Your platform access is ready
                    </p>
                  </div>
                  <div style="padding:36px 32px;">
                    <p style="font-size:15px;color:#1e293b;margin:0 0 8px;">
                      Hi <strong>%s</strong>,
                    </p>
                    <p style="font-size:14px;color:#475569;margin:0 0 28px;">
                      Your SamayaHR account for <strong>%s</strong> has been set up.
                      Use the details below to access your HR dashboard.
                    </p>

                    <div style="background:#f8fafc;border-radius:10px;
                                border:1px solid #e2e8f0;padding:20px 24px;margin:0 0 24px;">
                      <p style="font-size:11px;font-weight:700;color:#94a3b8;
                                text-transform:uppercase;letter-spacing:0.08em;margin:0 0 14px;">
                        Login Details
                      </p>
                      <table style="width:100%;border-collapse:collapse;">
                        <tr>
                          <td style="padding:8px 0;font-size:13px;color:#64748b;
                                     font-weight:600;width:130px;">Company</td>
                          <td style="padding:8px 0;font-size:13px;color:#1e293b;
                                     font-weight:700;">%s</td>
                        </tr>
                        <tr style="border-top:1px solid #f1f5f9;">
                          <td style="padding:8px 0;font-size:13px;color:#64748b;
                                     font-weight:600;">Email</td>
                          <td style="padding:8px 0;font-size:13px;color:#1e293b;
                                     font-weight:700;">%s</td>
                        </tr>
                        <tr style="border-top:1px solid #f1f5f9;">
                          <td style="padding:8px 0;font-size:13px;color:#64748b;
                                     font-weight:600;">Tenant Code</td>
                          <td style="padding:8px 0;font-size:13px;color:#FF6B35;
                                     font-weight:800;font-family:monospace;letter-spacing:1px;">%s</td>
                        </tr>
                      </table>
                    </div>

                    <div style="text-align:center;margin:28px 0;">
                      <a href="%s" style="background:linear-gradient(135deg,#FF6B35,#FF8C5A);
                         color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;
                         font-weight:700;font-size:14px;display:inline-block;
                         box-shadow:0 4px 14px rgba(255,107,53,0.35);">
                        Access Dashboard →
                      </a>
                    </div>

                    <div style="background:#fff4ef;border-left:4px solid #FF6B35;
                                border-radius:6px;padding:14px 18px;margin:0 0 20px;">
                      <p style="margin:0;font-size:13px;color:#c2410c;font-weight:600;">
                        First-time login
                      </p>
                      <p style="margin:6px 0 0;font-size:13px;color:#9a3412;">
                        Use your email address to log in and set your password on first access.
                        Keep your Tenant Code safe — it identifies your company on the platform.
                      </p>
                    </div>

                    <p style="font-size:13px;color:#94a3b8;margin:0;">
                      Need help? Reply to this email or contact our support team.
                    </p>
                  </div>
                  <div style="background:#f8fafc;padding:16px;text-align:center;
                              font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
                    &copy; %s · Powered by SamayaHR
                  </div>
                </div>
                """.formatted(adminName, companyDisplayName, companyDisplayName,
                               adminEmail, tenantCode, loginUrl, companyDisplayName);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Company credentials email sent to: {} for company: {}",
                    toEmail, companyDisplayName);

        } catch (Exception e) {
            logger.error("Failed to send company credentials email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send credentials email: " + e.getMessage());
        }
    }

    // ── Payslip delivery ──────────────────────────────────────────────────────

    public void sendPayslipEmail(String toEmail, String employeeName,
                                  String monthYear, String payslipUrl,
                                  String companyDisplayName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your salary slip for " + monthYear
                    + " — " + companyDisplayName);

            String html = """
                <div style="font-family:Arial,sans-serif;max-width:600px;
                            margin:auto;border:1px solid #e0e0e0;
                            border-radius:8px;overflow:hidden;">
                  <div style="background:#1a237e;padding:24px;text-align:center;">
                    <h2 style="color:#fff;margin:0;">Salary Slip — %s</h2>
                  </div>
                  <div style="padding:32px;">
                    <p>Hi <strong>%s</strong>,</p>
                    <p>Your salary slip for <strong>%s</strong> is ready.
                       Click below to download it.</p>
                    <div style="text-align:center;margin:32px 0;">
                      <a href="%s"
                         style="background:#1a237e;color:#fff;padding:14px 32px;
                                text-decoration:none;border-radius:6px;
                                font-weight:bold;display:inline-block;">
                        Download Salary Slip
                      </a>
                    </div>
                    <p style="color:#666;font-size:13px;">
                      This is a computer-generated salary slip.
                      Please keep it for your records.
                    </p>
                  </div>
                  <div style="background:#f5f5f5;padding:16px;text-align:center;
                              font-size:12px;color:#999;">
                    &copy; %s
                  </div>
                </div>
                """.formatted(monthYear, employeeName, monthYear,
                               payslipUrl, companyDisplayName);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Payslip email sent to: {} for {}", toEmail, monthYear);

        } catch (Exception e) {
            logger.error("Failed to send payslip email to: {}", toEmail, e);
            // Don't throw — payslip email failure should NOT roll back PAID status
        }
    }

    // ── Private builders (demo emails) ────────────────────────────────────────

    private String buildDemoRegistrationEmailBody(CompanyDemoDetails demoDetails) {
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        String formattedDate = demoDetails.getCreatedAt().format(formatter);

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                              color: white; padding: 30px; text-align: center;
                              border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px;
                               border-radius: 0 0 10px 10px; }
                    .info-box { background: white; border-left: 4px solid #667eea;
                                padding: 20px; margin: 20px 0; border-radius: 5px; }
                    .info-row { display: flex; padding: 10px 0;
                                border-bottom: 1px solid #e5e7eb; }
                    .info-row:last-child { border-bottom: none; }
                    .label { font-weight: bold; color: #4b5563; width: 150px; flex-shrink: 0; }
                    .value { color: #1f2937; flex-grow: 1; }
                    .status-badge { display: inline-block; padding: 5px 15px;
                                    background: #fef3c7; color: #92400e;
                                    border-radius: 20px; font-size: 12px; font-weight: bold; }
                    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Demo Request Received</h1>
                  <p style="margin:10px 0 0 0;opacity:0.9;">%s</p>
                </div>
                <div class="content">
                  <p style="font-size:16px;color:#374151;margin-bottom:20px;">
                    A new company has requested a demo:
                  </p>
                  <div class="info-box">
                    <div class="info-row">
                      <span class="label">Request ID:</span>
                      <span class="value">#%d</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Full Name:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Company:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Email:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Phone:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Designation:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Requested On:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Status:</span>
                      <span class="value">
                        <span class="status-badge">%s</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="footer">
                  <p>Automated notification from %s</p>
                  <p>&copy; 2026 %s. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
            """,
                companyName,
                demoDetails.getId(),
                demoDetails.getFullName(),
                demoDetails.getCompanyName(),
                demoDetails.getCompanyEmail(),
                demoDetails.getPhoneNumber(),
                demoDetails.getDesignation(),
                formattedDate,
                demoDetails.getStatus().name(),
                companyName,
                companyName);
    }

    private String buildUserConfirmationEmailBody(CompanyDemoDetails demoDetails) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                              color: white; padding: 30px; text-align: center;
                              border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px;
                               border-radius: 0 0 10px 10px; }
                    .highlight-box { background: white; border: 2px solid #667eea;
                                     padding: 20px; margin: 20px 0; border-radius: 8px;
                                     text-align: center; }
                    .footer { text-align: center; padding: 20px;
                              color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Demo Request Confirmed</h1>
                </div>
                <div class="content">
                  <p>Hi <strong>%s</strong>,</p>
                  <p>Thank you for your interest in %s!
                     We have received your demo request.</p>
                  <div class="highlight-box">
                    <h3 style="color:#667eea;margin-top:0;">What's Next?</h3>
                    <p>Our team will review your request and reach out within
                       <strong>24-48 hours</strong> to schedule a demo.</p>
                  </div>
                  <p><strong>Your Request Details:</strong></p>
                  <ul style="background:white;padding:20px 40px;border-radius:5px;">
                    <li>Company: %s</li>
                    <li>Email: %s</li>
                    <li>Phone: %s</li>
                  </ul>
                  <p>Best regards,<br><strong>%s Team</strong></p>
                </div>
                <div class="footer">
                  <p>&copy; 2026 %s. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
            """,
                demoDetails.getFullName(),
                companyName,
                demoDetails.getCompanyName(),
                demoDetails.getCompanyEmail(),
                demoDetails.getPhoneNumber(),
                companyName,
                companyName);
    }
}