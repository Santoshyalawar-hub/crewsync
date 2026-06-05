package com.samayahr.service;

import com.samayahr.dto.request.GlobalAdminRequest;
import com.samayahr.dto.response.AuthResponse;
import com.samayahr.entity.User;
import com.samayahr.repository.UserRepository;
import com.samayahr.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GlobalAdminService {

    @Autowired private UserRepository  userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil         jwtUtil;

    @Value("${global.admin.secret}")
    private String globalAdminSecret;

    public AuthResponse createGlobalAdmin(GlobalAdminRequest request) {

        if (request.getSecretKey() == null
                || !request.getSecretKey().equals(globalAdminSecret))
            throw new RuntimeException("Invalid secret key. Unauthorized.");

        if (request.getFullName() == null
                || request.getFullName().trim().isEmpty())
            throw new RuntimeException("Full name is required");

        if (request.getEmail() == null
                || request.getEmail().trim().isEmpty())
            throw new RuntimeException("Email is required");

        if (request.getPassword() == null
                || request.getPassword().trim().isEmpty())
            throw new RuntimeException("Password is required");

        if (request.getPassword().length() < 6)
            throw new RuntimeException(
                    "Password must be at least 6 characters");

        if (userRepository.findByEmail(request.getEmail().trim()).isPresent())
            throw new RuntimeException(
                    "Email already exists: " + request.getEmail());

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // ✅ plainPassword removed
        user.setMobile(request.getMobile());
        user.setRole(User.Role.GLOBAL_ADMIN);
        user.setStatus(User.Status.ACTIVE);
        user.setIsAdmin(true);
        user.setIsActive(true);
        user.setApproved(true);
        user.setTenantCode(null);
        user.setCompanyId(null);
        user.setCompanyName(null);
        user.setOnboardingStatus(User.OnboardingStatus.NOT_STARTED);
        user.setOnboardingStep(0);

        User saved = userRepository.save(user);

        String token = generateJwt(saved);
        return buildAuthResponse(token, saved);
    }

    public boolean globalAdminExists() {
        return userRepository.existsByRole(User.Role.GLOBAL_ADMIN);
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