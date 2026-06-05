package com.samayahr.service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samayahr.dto.request.PerformanceRequest;
import com.samayahr.dto.response.FeedbackResponse;
import com.samayahr.dto.response.LeaderboardResponse;
import com.samayahr.dto.response.PerformanceResponse;
import com.samayahr.entity.PerformanceData;
import com.samayahr.entity.PerformanceFeedback;
import com.samayahr.entity.User;
import com.samayahr.repository.PerformanceFeedbackRepository;
import com.samayahr.repository.PerformanceRepository;
import com.samayahr.repository.UserRepository;

@Service
public class PerformanceService {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceService.class);

    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private PerformanceFeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    /* ================= READ METHODS ================= */

    @Transactional(readOnly = true)
    public List<PerformanceResponse> getAllPerformance() {
        return performanceRepository.findAllWithFeedback()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PerformanceResponse> getTenantPerformance(String tenantCode) {
        return performanceRepository.findAllByTenantCodeWithFeedback(tenantCode)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PerformanceResponse getPerformanceByEmployeeId(String employeeId) {
        PerformanceData data = performanceRepository.findByEmployeeIdWithFeedback(employeeId)
                .orElseThrow(() -> new RuntimeException("Performance not found for employee: " + employeeId));
        return convertToResponse(data);
    }

    @Transactional(readOnly = true)
    public PerformanceResponse getPerformanceByUserId(Long userId) {
        logger.info("Fetching performance for user ID: {}", userId);
        try {
            Optional<PerformanceData> dataOpt = performanceRepository.findByUserIdWithFeedback(userId);
            if (dataOpt.isEmpty()) {
                logger.warn("No performance record found for user ID: {}", userId);
                return emptyPerformanceResponse(userId);
            }
            logger.info("Successfully fetched performance for user ID: {}", userId);
            return convertToResponse(dataOpt.get());
        } catch (Exception e) {
            logger.error("Error fetching performance for user ID: {}", userId, e);
            return emptyPerformanceResponse(userId);
        }
    }

    @Transactional(readOnly = true)
    public PerformanceResponse getCurrentUserPerformance() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Fetching current user performance for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return getPerformanceByUserId(user.getId());
    }

    private PerformanceResponse emptyPerformanceResponse(Long userId) {
        PerformanceResponse r = new PerformanceResponse(
                null, null, null, null, null,
                0, null, 0, 0, 0, 0, 0, 0, false, null,
                Collections.emptyList(), Collections.emptyList());
        r.setUserId(userId);
        return r;
    }

    /* ================= MONTH-BASED QUERIES ================= */

    @Transactional(readOnly = true)
    public List<PerformanceResponse> getTenantPerformanceByMonth(String tenantCode, String month) {
        return performanceRepository.findAllByTenantCodeAndMonthWithFeedback(tenantCode, month)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAvailableMonths(String tenantCode) {
        return performanceRepository.findDistinctMonthsByTenantCode(tenantCode);
    }

@Transactional(readOnly = true)
public LeaderboardResponse getLeaderboardForCurrentUser() {
    final String email;
    try {
        email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Fetching leaderboard for user: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        logger.info("User found - ID: {}, Name: {}, TenantCode: {}", 
                user.getId(), user.getFullName(), user.getTenantCode());

        // Validate tenant code
        final String tenantCode = user.getTenantCode();
        if (tenantCode == null || tenantCode.trim().isEmpty()) {
            logger.error("User {} does not have a tenant code", email);
            throw new RuntimeException("User does not have a tenant code assigned");
        }

        // Get current user's performance data
        String currentMonth = YearMonth.now().toString();
        logger.info("Looking for performance data for month: {}", currentMonth);
        
        Optional<PerformanceData> currentMonthDataOpt = performanceRepository
                .findByUserIdAndMonth(user.getId(), currentMonth);
        
        final String finalPerformanceMonth;
        final PerformanceData finalCurrentUserData;
        
        if (currentMonthDataOpt.isPresent()) {
            finalCurrentUserData = currentMonthDataOpt.get();
            finalPerformanceMonth = currentMonth;
            logger.info("Found performance data for current month");
        } else {
            logger.warn("No performance data for current month, looking for any data");
            Optional<PerformanceData> anyDataOpt = performanceRepository.findByUserIdWithFeedback(user.getId());
            if (anyDataOpt.isEmpty()) {
                logger.warn("No performance data at all for user: {}", email);
                PerformanceResponse emptyUser = emptyPerformanceResponse(user.getId());
                return new LeaderboardResponse(emptyUser, Collections.emptyList(), 0L, currentMonth);
            }
            PerformanceData anyData = anyDataOpt.get();
            finalCurrentUserData = anyData;
            String dataMonth = anyData.getPerformanceMonth();
            finalPerformanceMonth = (dataMonth != null && !dataMonth.trim().isEmpty())
                    ? dataMonth
                    : currentMonth;

            logger.info("Using fallback performance month: {}", finalPerformanceMonth);
        }

        // Get top performers
        logger.info("Fetching top performers for tenant: {} and month: {}", tenantCode, finalPerformanceMonth);
        List<PerformanceData> allPerformers = performanceRepository
                .findTopPerformersByTenantAndMonth(tenantCode, finalPerformanceMonth);
        
        logger.info("Found {} performers for leaderboard", allPerformers.size());
        
        List<PerformanceData> topPerformers = allPerformers.stream()
                .limit(3)
                .collect(Collectors.toList());

        // Calculate ranks
        Integer currentScore = finalCurrentUserData.getCurrentScore();
        if (currentScore == null) {
            currentScore = 0;
            logger.warn("Current score is null, using 0");
        }

        Long rank = performanceRepository.findRankByTenantMonthAndScore(
                tenantCode,
                finalPerformanceMonth,
                currentScore
        );
        logger.info("Current user rank: {}", rank);

        // Convert to responses
        PerformanceResponse currentUserResponse = convertToResponse(finalCurrentUserData);
        currentUserResponse.setRank(rank);

        List<PerformanceResponse> topPerformersResponse = topPerformers.stream()
                .map(p -> {
                    PerformanceResponse response = convertToResponse(p);
                    Integer performerScore = p.getCurrentScore() != null ? p.getCurrentScore() : 0;
                    Long performerRank = performanceRepository.findRankByTenantMonthAndScore(
                            tenantCode,
                            finalPerformanceMonth,
                            performerScore
                    );
                    response.setRank(performerRank);
                    return response;
                })
                .collect(Collectors.toList());

        Long totalEmployees = (long) allPerformers.size();
        logger.info("Total employees in leaderboard: {}", totalEmployees);

        LeaderboardResponse response = new LeaderboardResponse(
                currentUserResponse,
                topPerformersResponse,
                totalEmployees,
                finalPerformanceMonth
        );
        
        logger.info("Successfully created leaderboard response");
        return response;
        
    } catch (Exception e) {
        logger.error("Error in getLeaderboardForCurrentUser", e);
        logger.error("Full stack trace:", e);
        throw new RuntimeException("Failed to load leaderboard: " + e.getMessage(), e);
    }
}

    /* ================= CREATE ================= */

    @Transactional
    public PerformanceResponse createPerformance(PerformanceRequest request, String tenantCode) {

        if (tenantCode == null || tenantCode.trim().isEmpty()) {
            throw new RuntimeException("Tenant code missing in request header");
        }

        if (request.getEmployeeId() == null || request.getEmployeeId().trim().isEmpty()) {
            throw new RuntimeException("Employee ID is required");
        }

        if (performanceRepository.existsByEmployeeIdAndTenantCode(request.getEmployeeId(), tenantCode)) {
            throw new RuntimeException("Performance record already exists for employee ID: " + request.getEmployeeId());
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Employee name is required");
        }

        if (request.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (performanceRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("Performance record already exists for this user");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        PerformanceData data = new PerformanceData();

        data.setTenantCode(tenantCode);
        data.setEmployeeId(request.getEmployeeId().trim());
        data.setName(request.getName().trim());
        data.setDepartment(request.getDepartment() != null ? request.getDepartment() : "");
        data.setPosition(request.getPosition() != null ? request.getPosition() : "");
        data.setCurrentScore(valueOrZero(request.getCurrentScore()));
        data.setTasksCompleted(valueOrZero(request.getTasksCompleted()));
        data.setTotalTasks(valueOrZero(request.getTotalTasks()));
        data.setAttendance(valueOrZero(request.getAttendance()));
        data.setProductivity(valueOrZero(request.getProductivity()));
        data.setQualityScore(valueOrZero(request.getQualityScore()));
        data.setPunctuality(valueOrZero(request.getPunctuality()));
        data.setValidated(false);
        data.setMonthlyScores(request.getMonthlyScores() != null ? request.getMonthlyScores() : new ArrayList<>());
        data.setUser(user);

        String month = request.getPerformanceMonth();
        if (month == null || month.trim().isEmpty()) {
            month = YearMonth.now().toString();
        }
        data.setPerformanceMonth(month);

        PerformanceData saved = performanceRepository.save(data);

        return convertToResponse(
                performanceRepository.findByIdWithFeedback(saved.getId()).orElse(saved)
        );
    }

    /* ================= UPDATE ================= */

    @Transactional
    public PerformanceResponse updatePerformance(Long id, PerformanceRequest request, String tenantCode) {

        PerformanceData data = performanceRepository.findByIdAndTenantCode(id, tenantCode)
                .orElseThrow(() -> new RuntimeException("Performance not found for this tenant"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            data.setName(request.getName().trim());
        }
        if (request.getDepartment() != null) data.setDepartment(request.getDepartment());
        if (request.getPosition() != null) data.setPosition(request.getPosition());
        if (request.getCurrentScore() != null) data.setCurrentScore(request.getCurrentScore());
        if (request.getTasksCompleted() != null) data.setTasksCompleted(request.getTasksCompleted());
        if (request.getTotalTasks() != null) data.setTotalTasks(request.getTotalTasks());
        if (request.getAttendance() != null) data.setAttendance(request.getAttendance());
        if (request.getProductivity() != null) data.setProductivity(request.getProductivity());
        if (request.getQualityScore() != null) data.setQualityScore(request.getQualityScore());
        if (request.getPunctuality() != null) data.setPunctuality(request.getPunctuality());
        if (request.getMonthlyScores() != null) data.setMonthlyScores(request.getMonthlyScores());

        if (request.getPerformanceMonth() != null && !request.getPerformanceMonth().trim().isEmpty()) {
            data.setPerformanceMonth(request.getPerformanceMonth());
        }

        PerformanceData saved = performanceRepository.save(data);
        return convertToResponse(saved);
    }

    /* ================= ADMIN ACTIONS ================= */

    @Transactional
    public void setValidationStatus(Long id, Boolean validated, String tenantCode) {
        PerformanceData data = performanceRepository.findByIdAndTenantCode(id, tenantCode)
                .orElseThrow(() -> new RuntimeException("Performance not found for this tenant"));

        data.setValidated(validated != null ? validated : false);
        performanceRepository.save(data);
    }

    @Transactional
    public void deletePerformance(Long id, String tenantCode) {
        PerformanceData data = performanceRepository.findByIdAndTenantCode(id, tenantCode)
                .orElseThrow(() -> new RuntimeException("Performance not found for this tenant"));

        performanceRepository.delete(data);
    }

    /* ================= FEEDBACK ================= */

    @Transactional
    public void addFeedback(Long performanceId, String title, String comment, String author, String tenantCode) {
        PerformanceData data = performanceRepository.findByIdAndTenantCode(performanceId, tenantCode)
                .orElseThrow(() -> new RuntimeException("Performance not found for this tenant"));

        if (title == null || title.trim().isEmpty()) throw new RuntimeException("Feedback title is required");
        if (comment == null || comment.trim().isEmpty()) throw new RuntimeException("Feedback comment is required");

        PerformanceFeedback feedback = new PerformanceFeedback();
        feedback.setTitle(title.trim());
        feedback.setComment(comment.trim());
        feedback.setAuthor(author != null ? author.trim() : "Anonymous");
        feedback.setPerformanceData(data);

        feedbackRepository.save(feedback);
    }

    /* ================= HELPERS ================= */

    private int valueOrZero(Integer value) {
        return value != null ? value : 0;
    }

    private PerformanceResponse convertToResponse(PerformanceData data) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");

            List<FeedbackResponse> feedbackList = new ArrayList<>();
            if (data.getFeedback() != null && !data.getFeedback().isEmpty()) {
                feedbackList = data.getFeedback().stream()
                        .map(f -> new FeedbackResponse(
                                f.getId(),
                                f.getTitle(),
                                f.getComment(),
                                f.getAuthor(),
                                f.getDate() != null ? f.getDate().format(formatter) : ""
                        ))
                        .collect(Collectors.toList());
            }

            PerformanceResponse response = new PerformanceResponse(
                    data.getId(),
                    data.getEmployeeId(),
                    data.getName(),
                    data.getDepartment(),
                    data.getPosition(),
                    data.getCurrentScore(),
                    data.getStatus(),
                    data.getTasksCompleted(),
                    data.getTotalTasks(),
                    data.getAttendance(),
                    data.getProductivity(),
                    data.getQualityScore(),
                    data.getPunctuality(),
                    data.getValidated(),
                    data.getLastUpdated(),
                    data.getMonthlyScores() != null ? new ArrayList<>(data.getMonthlyScores()) : Collections.emptyList(),
                    feedbackList
            );

            response.setPerformanceMonth(data.getPerformanceMonth());
            response.setUserId(data.getUser() != null ? data.getUser().getId() : null);

            return response;
        } catch (Exception e) {
            logger.error("Error converting PerformanceData to Response", e);
            throw new RuntimeException("Error converting performance data: " + e.getMessage(), e);
        }
    }
}