package com.samayahr.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.samayahr.entity.User;
import com.samayahr.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CloudinaryService cloudinaryService;

    // ✅ NEW — delegates changePassword to enforce monthly limit
    @Autowired(required = false)
    private EmployeeLoginAccessService employeeLoginAccessService;

    // ========== TENANT-AWARE METHODS ==========

    public List<User> getAllUsersByTenant(String tenantCode) {
        if (tenantCode == null || tenantCode.trim().isEmpty())
            throw new RuntimeException("Tenant code is required");
        return userRepository.findByTenantCodeAndDeletedAtIsNull(tenantCode);
    }

    public List<User> getEmployeesByTenant(String tenantCode) {
        if (tenantCode == null || tenantCode.trim().isEmpty())
            throw new RuntimeException("Tenant code is required");
        return userRepository.findEmployeesByTenantCode(tenantCode);
    }

    public long getEmployeeCountByTenant(String tenantCode) {
        if (tenantCode == null || tenantCode.trim().isEmpty())
            throw new RuntimeException("Tenant code is required");
        return userRepository.countEmployeesByTenantCode(tenantCode);
    }

    public List<User> searchUsersByTenant(String tenantCode, String query) {
        if (tenantCode == null || tenantCode.trim().isEmpty())
            throw new RuntimeException("Tenant code is required");
        return userRepository.searchUsersByTenantCode(tenantCode, query);
    }

    public List<User> getUsersByTenantAndDepartment(String tenantCode,
                                                      String department) {
        if (tenantCode == null || tenantCode.trim().isEmpty())
            throw new RuntimeException("Tenant code is required");
        return userRepository.findByTenantCodeAndDepartment(tenantCode, department);
    }

    public List<User> getUsersByTenantAndStatus(String tenantCode,
                                                  String statusStr) {
        if (tenantCode == null || tenantCode.trim().isEmpty())
            throw new RuntimeException("Tenant code is required");
        return userRepository.findByTenantCodeAndStatus(tenantCode,
                User.Status.valueOf(statusStr.toUpperCase()));
    }

    public User getUserByIdWithTenantValidation(Long id, String tenantCode) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + id));
        if (!user.getTenantCode().equals(tenantCode))
            throw new RuntimeException(
                    "Access denied: User does not belong to your company");
        return user;
    }

    @Transactional
    public User updateUserWithTenantValidation(Long id, User userDetails,
                                                String tenantCode) {
        User user = getUserByIdWithTenantValidation(id, tenantCode);
        if (userDetails.getFullName() != null)
            user.setFullName(userDetails.getFullName());
        if (userDetails.getEmail() != null) {
            if (userRepository.existsByEmailAndTenantCode(
                    userDetails.getEmail(), tenantCode)
                    && !user.getEmail().equals(userDetails.getEmail()))
                throw new RuntimeException(
                        "Email already exists for another employee in this company");
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getMobile() != null)
            user.setMobile(userDetails.getMobile());
        if (userDetails.getPosition() != null)
            user.setPosition(userDetails.getPosition());
        if (userDetails.getDepartment() != null)
            user.setDepartment(userDetails.getDepartment());
        if (userDetails.getStatus() != null)
            user.setStatus(userDetails.getStatus());
        if (userDetails.getEmployeeId() != null) {
            if (userRepository.existsByEmployeeIdAndTenantCode(
                    userDetails.getEmployeeId(), tenantCode)
                    && !user.getEmployeeId().equals(userDetails.getEmployeeId()))
                throw new RuntimeException(
                        "Employee ID already exists for another employee in this company");
            user.setEmployeeId(userDetails.getEmployeeId());
        }
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUserWithTenantValidation(Long id, String tenantCode) {
        userRepository.delete(getUserByIdWithTenantValidation(id, tenantCode));
    }

    // ========== EXISTING METHODS ==========

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + id));
    }

    public User getCurrentUser() {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser"))
            throw new RuntimeException("User is not authenticated");
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        if (userDetails.getFullName() != null)
            user.setFullName(userDetails.getFullName());
        if (userDetails.getEmail() != null)
            user.setEmail(userDetails.getEmail());
        if (userDetails.getMobile() != null)
            user.setMobile(userDetails.getMobile());
        if (userDetails.getPosition() != null)
            user.setPosition(userDetails.getPosition());
        if (userDetails.getDepartment() != null)
            user.setDepartment(userDetails.getDepartment());
        if (userDetails.getStatus() != null)
            user.setStatus(userDetails.getStatus());
        if (userDetails.getEmployeeId() != null)
            user.setEmployeeId(userDetails.getEmployeeId());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public User updateCurrentUser(User userDetails) {
        return updateUser(getCurrentUser().getId(), userDetails);
    }

    /**
     * Change password — enforces the monthly limit (max 2/month) for EMPLOYEE role.
     *
     * For ADMIN / SUPER_ADMIN / GLOBAL_ADMIN roles the old simple behaviour
     * is preserved (no monthly limit).
     *
     * Called from POST /api/users/change-password (existing endpoint).
     * Also called internally — both paths go through here so the limit is
     * always respected regardless of which endpoint the frontend uses.
     */
    @Transactional
    public void changePassword(String oldPassword, String newPassword) {
        User currentUser = getCurrentUser();

        // ── EMPLOYEE: delegate to EmployeeLoginAccessService (enforces limit) ─
        if (currentUser.getRole() == User.Role.EMPLOYEE
                && employeeLoginAccessService != null) {
            // Pass newPassword as both newPassword and confirmPassword
            // (the old /api/users/change-password endpoint only takes 2 params)
            employeeLoginAccessService.changePasswordByEmployee(
                    oldPassword, newPassword, newPassword);
            return;
        }

        // ── ADMIN / SUPER_ADMIN / GLOBAL_ADMIN: simple change, no limit ───────
        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword()))
            throw new RuntimeException("Old password is incorrect");

        if (passwordEncoder.matches(newPassword, currentUser.getPassword()))
            throw new RuntimeException(
                    "New password must be different from your current password.");

        if (newPassword.length() < 8)
            throw new RuntimeException(
                    "Password must be at least 8 characters long.");

        currentUser.setPassword(passwordEncoder.encode(newPassword));
        currentUser.setUpdatedAt(LocalDateTime.now());
        userRepository.save(currentUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.delete(getUserById(id));
    }

    public List<User> getUsersByRole(String roleStr) {
        return userRepository.findByRole(User.Role.valueOf(roleStr.toUpperCase()));
    }

    public List<User> getUsersByStatus(String statusStr) {
        return userRepository.findByStatus(
                User.Status.valueOf(statusStr.toUpperCase()));
    }

    public List<User> searchUsers(String query) {
        return userRepository.searchUsers(query);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with email: " + email));
    }

    // ========== PROFILE PHOTO — CLOUDINARY ==========

    @Transactional
    public String uploadUserPhotoSimple(Long userId, MultipartFile file) {
        validateImageFile(file);
        User user = getUserById(userId);
        String tenantCode = user.getTenantCode() != null
                ? user.getTenantCode() : "global";

        if (user.getProfilePhotoPublicId() != null) {
            try {
                cloudinaryService.deleteImage(user.getProfilePhotoPublicId());
            } catch (Exception ignored) { }
        }

        try {
            Map<String, Object> result = cloudinaryService.uploadImage(
                    file, tenantCode, "profile_photos");
            user.setProfilePhotoUrl(cloudinaryService.getSecureUrl(result));
            user.setProfilePhotoPublicId(cloudinaryService.getPublicId(result));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return user.getProfilePhotoUrl();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to upload profile photo: " + e.getMessage());
        }
    }

    public String getUserPhotoUrl(Long userId) {
        return getUserById(userId).getProfilePhotoUrl();
    }

    @Transactional
    public void deleteUserPhotoSimple(Long userId) {
        User user = getUserById(userId);
        if (user.getProfilePhotoUrl() != null) {
            if (user.getProfilePhotoPublicId() != null) {
                try {
                    cloudinaryService.deleteImage(user.getProfilePhotoPublicId());
                } catch (Exception ignored) { }
            }
            user.setProfilePhotoUrl(null);
            user.setProfilePhotoPublicId(null);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    // ========== OFFER LETTER — CLOUDINARY ==========

    @Transactional
    public String uploadOfferLetter(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new RuntimeException("Please select a file to upload");
        if (file.getSize() > 10 * 1024 * 1024)
            throw new RuntimeException("File size must be less than 10MB");
        String ct = file.getContentType();
        if (ct == null || (!ct.equals("application/pdf")
                && !ct.equals("image/jpeg") && !ct.equals("image/jpg")
                && !ct.equals("image/png")))
            throw new RuntimeException(
                    "Only PDF, JPEG, and PNG files are allowed for offer letters");

        User user = getUserById(userId);
        String tenantCode = user.getTenantCode() != null
                ? user.getTenantCode() : "global";

        if (user.getOfferLetterUrl() != null) {
            try {
                String url = user.getOfferLetterUrl();
                String afterUpload = url.substring(url.indexOf("/upload/") + 8);
                String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
                String publicId = withoutVersion.substring(
                        0, withoutVersion.lastIndexOf("."));
                cloudinaryService.delete(publicId);
            } catch (Exception ignored) { }
        }

        try {
            Map<String, Object> result = cloudinaryService.upload(
                    file, tenantCode, "offer_letters");
            user.setOfferLetterUrl(cloudinaryService.getSecureUrl(result));
            user.setOfferLetterUploaded(true);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return user.getOfferLetterUrl();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to upload offer letter: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteOfferLetter(Long userId) {
        User user = getUserById(userId);
        if (user.getOfferLetterUrl() != null) {
            try {
                String url = user.getOfferLetterUrl();
                String afterUpload = url.substring(url.indexOf("/upload/") + 8);
                String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
                String publicId = withoutVersion.substring(
                        0, withoutVersion.lastIndexOf("."));
                cloudinaryService.delete(publicId);
            } catch (Exception ignored) { }
            user.setOfferLetterUrl(null);
            user.setOfferLetterUploaded(false);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    // ========== ADMIN METHODS ==========

    public List<User> getAdminsByTenantCompany(String tenantCode, Long companyId) {
        if (tenantCode == null || tenantCode.trim().isEmpty())
            throw new RuntimeException("Tenant code is required");
        if (companyId == null)
            throw new RuntimeException("Company ID is required");
        return userRepository.findAdminsByTenantCompany(
                tenantCode.trim(), companyId);
    }

    @Transactional
    public User createAdminForTenantCompany(String tenantCode, Long companyId,
                                             Map<String, String> payload) {
        if (tenantCode == null || tenantCode.trim().isEmpty())
            throw new RuntimeException("Tenant code is required");
        if (companyId == null)
            throw new RuntimeException("Company ID is required");

        String name      = payload.getOrDefault("name",     "").trim();
        String email     = payload.getOrDefault("email",    "").trim();
        String password  = payload.getOrDefault("password", "").trim();
        String adminRole = payload.getOrDefault("role",     "").trim();

        if (name.isEmpty())      throw new RuntimeException("Name is required");
        if (email.isEmpty())     throw new RuntimeException("Email is required");
        if (password.isEmpty())  throw new RuntimeException("Password is required");
        if (adminRole.isEmpty()) throw new RuntimeException("Role is required");

        if (userRepository.findAdminByTenantCompanyAndEmail(
                tenantCode.trim(), companyId, email).isPresent())
            throw new RuntimeException("Admin already exists for this company");

        User u = new User();
        u.setFullName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u.setTenantCode(tenantCode.trim());
        u.setCompanyId(companyId);
        u.setRole(User.Role.ADMIN);
        u.setIsAdmin(true);
        u.setAdminRole(adminRole);
        u.setApproved(true);
        u.setStatus(User.Status.ACTIVE);
        u.setIsActive(true);
        u.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(u);
    }

    // ========== PRIVATE HELPERS ==========

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new RuntimeException("Please select a file to upload");
        if (file.getSize() > 5 * 1024 * 1024)
            throw new RuntimeException("File size must be less than 5MB");
        String ct = file.getContentType();
        if (ct == null
                || (!ct.equals("image/jpeg") && !ct.equals("image/jpg")
                        && !ct.equals("image/png") && !ct.equals("image/gif")))
            throw new RuntimeException(
                    "Only JPEG, PNG, and GIF images are allowed");
    }
}