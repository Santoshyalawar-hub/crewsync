package com.samayahr.controller;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.User;
import com.samayahr.repository.UserRepository;
import com.samayahr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired private UserService     userService;
    @Autowired private UserRepository  userRepository;
    @Autowired private JavaMailSender  mailSender;

    // ─────────────────────────────────────────────────────────────────────────
    //  POST /api/notifications/send
    //
    //  Body:
    //  {
    //    "employeeId":    123,
    //    "employeeEmail": "emp@example.com",
    //    "employeeName":  "John Doe",
    //    "actionType":    "upload" | "sign" | "re_upload" | "custom",
    //    "message":       "Your custom message here",
    //    "sentByAdmin":   true
    //  }
    //
    //  Called by AdminDocuments.jsx and AdminHrDocuments.jsx notify modals.
    //  Sends an email to the employee and returns success/failure.
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendNotification(
            @RequestBody Map<String, Object> body) {
        try {
            User admin = userService.getCurrentUser();

            String employeeEmail = safeStr(body.get("employeeEmail"));
            String employeeName  = safeStr(body.get("employeeName"));
            String actionType    = safeStr(body.get("actionType"));
            String message       = safeStr(body.get("message"));

            if (employeeEmail.isBlank())
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Employee email is required."));

            if (message.isBlank())
                message = defaultMessage(actionType);

            // Build email
            String subject = subjectFor(actionType);
            String body2   = buildEmailBody(employeeName, message, admin.getFullName());

            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(employeeEmail);
            mail.setSubject(subject);
            mail.setText(body2);
            mailSender.send(mail);

            return ResponseEntity.ok(ApiResponse.success(
                    "Notification sent to " + employeeEmail,
                    Map.of(
                            "sentTo",    employeeEmail,
                            "action",    actionType,
                            "sentAt",    LocalDateTime.now().toString(),
                            "sentBy",    admin.getFullName() != null ? admin.getFullName() : admin.getEmail()
                    )
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to send notification: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    private String safeStr(Object val) {
        return val != null ? val.toString().trim() : "";
    }

    private String subjectFor(String actionType) {
        return switch (actionType) {
            case "sign"      -> "Action Required: Please sign your document";
            case "re_upload" -> "Action Required: Please re-upload your document";
            case "upload"    -> "Action Required: Please upload your document";
            default          -> "Notification from SamayaHR";
        };
    }

    private String defaultMessage(String actionType) {
        return switch (actionType) {
            case "upload"    -> "You have a pending document that needs to be uploaded. Please log in to the portal and upload the required document at the earliest.";
            case "sign"      -> "You have a document pending your signature. Please log in to the portal and sign it at the earliest.";
            case "re_upload" -> "Your previously uploaded document requires re-submission. Please re-upload the correct document as soon as possible.";
            default          -> "You have a pending action in the SamayaHR portal. Please log in to take action.";
        };
    }

    private String buildEmailBody(String employeeName, String message, String adminName) {
        String name = (employeeName != null && !employeeName.isBlank()) ? employeeName : "Employee";
        String from = (adminName   != null && !adminName.isBlank())     ? adminName    : "Admin";
        return """
                Dear %s,

                %s

                Please log in to the SamayaHR portal to take the required action.

                If you have any questions, please contact your HR administrator.

                Best regards,
                %s
                SamayaHR Team
                """.formatted(name, message, from);
    }
}