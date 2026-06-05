package com.samayahr.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samayahr.dto.request.AttendanceRequest;
import com.samayahr.dto.request.LeaveRequest;
import com.samayahr.dto.request.TimesheetRequest;
import com.samayahr.dto.response.AttendanceResponse;
import com.samayahr.entity.AttendanceSession;
import com.samayahr.entity.Break;
import com.samayahr.entity.Leave;
import com.samayahr.entity.Timesheet;
import com.samayahr.repository.AttendanceSessionRepository;
import com.samayahr.repository.BreakRepository;
import com.samayahr.repository.LeaveRepository;
import com.samayahr.repository.TimesheetRepository;
import com.samayahr.repository.UserRepository;

@Service
public class AttendanceService {

    @Autowired private AttendanceSessionRepository attendanceSessionRepository;
    @Autowired private BreakRepository             breakRepository;
    @Autowired private TimesheetRepository         timesheetRepository;
    @Autowired private LeaveRepository             leaveRepository;
    @Autowired private UserRepository              userRepository;

    private static final int MAX_WORK_SECONDS           = 9 * 60 * 60; // 9 h
    private static final int HALF_DAY_THRESHOLD_SECONDS = 4 * 60 * 60; // 4 h
    private static final int HALF_DAY_CREDIT_SECONDS    = 5 * 60 * 60; // 5 h credit
    private static final int FULL_DAY_CREDIT_SECONDS    = 8 * 60 * 60; // 8 h credit

    // ─────────────────────────────────────────────────────────────
    //  PRIVATE HELPER — safe leave fetch
    //
    //  Always call THIS instead of the repository directly.
    //  Reason: the JPQL query now requires an explicit enum parameter.
    //  Wrapping in try-catch here means a misconfigured DB or missing
    //  Leave table never crashes the calendar/attendance endpoints —
    //  it just returns an empty list, which renders correctly as "no leave".
    // ─────────────────────────────────────────────────────────────
    private List<Leave> safeGetApprovedLeaves(Long userId,
                                               LocalDate startDate,
                                               LocalDate endDate) {
        try {
            return leaveRepository.findApprovedLeavesByUserIdAndDateRange(
                    userId, startDate, endDate, Leave.LeaveStatus.APPROVED);
        } catch (Exception e) {
            System.err.println("[AttendanceService] Could not fetch approved leaves for user "
                    + userId + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  CLOCK IN / OUT
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public AttendanceSession startWork(Long employeeId) {
        LocalDate today = LocalDate.now();

        List<AttendanceSession> todaySessions =
                attendanceSessionRepository.findByEmployeeIdAndDate(employeeId, today);

        if (!todaySessions.isEmpty()) {
            AttendanceSession existing = todaySessions.get(0);
            if (existing.getStatus() == AttendanceSession.AttendanceStatus.COMPLETED
                    || existing.getStatus() == AttendanceSession.AttendanceStatus.HALF_DAY
                    || existing.getStatus() == AttendanceSession.AttendanceStatus.PRESENT) {
                throw new RuntimeException(
                        "Work already ended for today. You can start work again tomorrow.");
            }
            throw new RuntimeException("Work session already started today at "
                    + existing.getStartTime().toLocalTime());
        }

        AttendanceSession session = new AttendanceSession();
        session.setEmployeeId(employeeId);
        session.setStartTime(LocalDateTime.now());
        session.setStatus(AttendanceSession.AttendanceStatus.WORKING);
        session.setInternalWorkSeconds(0);
        session.setTotalSeconds(0);

        return attendanceSessionRepository.save(session);
    }

    @Transactional
    public void startBreak(Long employeeId) {
        AttendanceSession session = getActiveTodaySession(employeeId);

        if (session.getStatus() == AttendanceSession.AttendanceStatus.ON_BREAK)
            throw new RuntimeException("You are already on break");

        if (session.getStatus() == AttendanceSession.AttendanceStatus.COMPLETED
                || session.getStatus() == AttendanceSession.AttendanceStatus.PRESENT
                || session.getStatus() == AttendanceSession.AttendanceStatus.HALF_DAY)
            throw new RuntimeException("Cannot start break after work has ended");

        if (performAutoSubmitIfExceeded(session))
            throw new RuntimeException(
                    "Work session automatically ended after 9 hours. Timesheet submitted.");

        Break breakEntry = new Break();
        breakEntry.setSessionId(session.getId());
        breakEntry.setBreakStart(LocalDateTime.now());
        breakRepository.save(breakEntry);

        session.setStatus(AttendanceSession.AttendanceStatus.ON_BREAK);
        attendanceSessionRepository.save(session);
    }

    @Transactional
    public void resumeWork(Long employeeId) {
        AttendanceSession session = getActiveTodaySession(employeeId);

        Break breakEntry = breakRepository
                .findActiveBreakBySessionId(session.getId())
                .orElseThrow(() -> new RuntimeException("No active break found"));

        LocalDateTime now = LocalDateTime.now();
        breakEntry.setBreakEnd(now);
        breakEntry.setDurationSeconds(
                (int) ChronoUnit.SECONDS.between(breakEntry.getBreakStart(), now));
        breakRepository.save(breakEntry);

        session.setStatus(AttendanceSession.AttendanceStatus.WORKING);
        attendanceSessionRepository.save(session);

        if (performAutoSubmitIfExceeded(session))
            throw new RuntimeException(
                    "Work session automatically ended after 9 hours. Timesheet submitted.");
    }

    @Transactional
    public AttendanceSession endWork(Long employeeId) {
        AttendanceSession session = getActiveTodaySession(employeeId);

        // Close any open break
        Optional<Break> activeBreak =
                breakRepository.findActiveBreakBySessionId(session.getId());
        if (activeBreak.isPresent()) {
            Break b = activeBreak.get();
            LocalDateTime now = LocalDateTime.now();
            b.setBreakEnd(now);
            b.setDurationSeconds(
                    (int) ChronoUnit.SECONDS.between(b.getBreakStart(), now));
            breakRepository.save(b);
        }

        LocalDateTime now = LocalDateTime.now();
        session.setEndTime(now);
        session.setTotalSeconds(
                (int) ChronoUnit.SECONDS.between(session.getStartTime(), now));

        int netWorkSeconds = calculateNetWorkSeconds(session);
        int creditSeconds  = calculateInternalWorkHours(netWorkSeconds);
        session.setInternalWorkSeconds(creditSeconds);

        if (creditSeconds >= FULL_DAY_CREDIT_SECONDS)
            session.setStatus(AttendanceSession.AttendanceStatus.PRESENT);
        else if (creditSeconds >= HALF_DAY_CREDIT_SECONDS)
            session.setStatus(AttendanceSession.AttendanceStatus.HALF_DAY);
        else
            session.setStatus(AttendanceSession.AttendanceStatus.PARTIAL);

        AttendanceSession saved = attendanceSessionRepository.save(session);
        autoSubmitTimesheet(saved, "Timesheet submitted on work end");
        return saved;
    }

    // ─────────────────────────────────────────────────────────────
    //  AUTO-SUBMIT (9-HOUR RULE)
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public boolean performAutoSubmitIfExceeded(AttendanceSession session) {
        if (session.getStatus() == AttendanceSession.AttendanceStatus.COMPLETED
                || session.getStatus() == AttendanceSession.AttendanceStatus.PRESENT
                || session.getStatus() == AttendanceSession.AttendanceStatus.HALF_DAY
                || session.getStatus() == AttendanceSession.AttendanceStatus.PARTIAL)
            return false;

        if (calculateNetWorkSeconds(session) < MAX_WORK_SECONDS)
            return false;

        // Close open break
        Optional<Break> activeBreak =
                breakRepository.findActiveBreakBySessionId(session.getId());
        if (activeBreak.isPresent()) {
            Break b = activeBreak.get();
            LocalDateTime now = LocalDateTime.now();
            b.setBreakEnd(now);
            b.setDurationSeconds(
                    (int) ChronoUnit.SECONDS.between(b.getBreakStart(), now));
            breakRepository.save(b);
        }

        LocalDateTime now = LocalDateTime.now();
        session.setEndTime(now);
        session.setTotalSeconds(
                (int) ChronoUnit.SECONDS.between(session.getStartTime(), now));

        int finalNet    = calculateNetWorkSeconds(session);
        int creditSecs  = calculateInternalWorkHours(finalNet);
        session.setInternalWorkSeconds(creditSecs);
        session.setStatus(AttendanceSession.AttendanceStatus.PRESENT);

        attendanceSessionRepository.save(session);
        autoSubmitTimesheet(session, "Auto-submitted: Work duration exceeded 9 hours");
        return true;
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void autoSubmitExceededSessions() {
        List<AttendanceSession> candidates =
                attendanceSessionRepository.findActiveSessionsExceedingDuration(MAX_WORK_SECONDS);
        for (AttendanceSession session : candidates) {
            try {
                performAutoSubmitIfExceeded(session);
            } catch (Exception e) {
                System.err.println("Error auto-submitting session "
                        + session.getId() + ": " + e.getMessage());
            }
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  TIMESHEET
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public void saveTimesheet(TimesheetRequest request) {
        Long sessionId  = request.getSessionId();
        Long employeeId = request.getEmployeeId();

        if (sessionId == null && employeeId != null) {
            List<AttendanceSession> sessions =
                    attendanceSessionRepository.findByEmployeeIdAndDate(
                            employeeId, LocalDate.now());
            if (sessions.isEmpty())
                throw new RuntimeException("No attendance session found for today");
            sessionId = sessions.get(0).getId();
        }

        if (sessionId == null)
            throw new RuntimeException("Unable to determine session for timesheet");

        if (timesheetRepository.findBySessionId(sessionId).isPresent())
            throw new RuntimeException("Timesheet already submitted for this session");

        Timesheet ts = new Timesheet();
        ts.setSessionId(sessionId);
        ts.setEmployeeId(employeeId);
        ts.setTasks(request.getTasks());
        ts.setRemarks(request.getRemarks());
        ts.setSubmittedAt(LocalDateTime.now());
        timesheetRepository.save(ts);
    }

    // ─────────────────────────────────────────────────────────────
    //  TODAY'S ATTENDANCE
    //
    //  FIX: Status is now always serialised as a plain lowercase STRING
    //  so the frontend can safely call .toLowerCase() on it.
    //  The AttendanceStatus enum name is explicitly converted to string
    //  — we never let the JSON serialiser decide how to represent an enum.
    // ─────────────────────────────────────────────────────────────

    public AttendanceResponse getTodayAttendance(Long employeeId) {
        LocalDate today = LocalDate.now();
        List<AttendanceSession> sessions =
                attendanceSessionRepository.findByEmployeeIdAndDate(employeeId, today);

        if (sessions.isEmpty()) {
            AttendanceResponse r = new AttendanceResponse();
            r.setStatus("not_started");   // ← always plain string
            r.setMessage("No work session started today");
            return r;
        }

        AttendanceSession session = sessions.get(0);
        AttendanceResponse r = new AttendanceResponse();
        r.setId(session.getId());
        r.setStartTime(session.getStartTime());
        r.setEndTime(session.getEndTime());

        // ── Explicit string mapping — NEVER send raw enum to frontend ──────
        String statusStr;
        switch (session.getStatus()) {
            case WORKING:          statusStr = "working";    break;
            case ON_BREAK:         statusStr = "on_break";   break;
            case PRESENT:          // fall-through intentional
            case COMPLETED:        statusStr = "completed";  break;
            case HALF_DAY:         statusStr = "half_day";   break;
            case PARTIAL:          statusStr = "partial";    break;
            case ABSENT:           statusStr = "absent";     break;
            case LEAVE:            statusStr = "leave";      break;
            case COMPENSATION_OFF: statusStr = "compensation_off"; break;
            default:               statusStr = session.getStatus().name().toLowerCase();
        }
        r.setStatus(statusStr);

        // Work seconds
        int totalSeconds = session.getTotalSeconds() != null ? session.getTotalSeconds() : 0;
        if (session.getStatus() == AttendanceSession.AttendanceStatus.WORKING
                || session.getStatus() == AttendanceSession.AttendanceStatus.ON_BREAK) {
            totalSeconds = (int) ChronoUnit.SECONDS.between(
                    session.getStartTime(), LocalDateTime.now());
        }
        r.setTotalSeconds(totalSeconds);

        // Break seconds
        int totalBreakSeconds = breakRepository.findBySessionId(session.getId())
                .stream()
                .mapToInt(b -> {
                    if (b.getBreakEnd() != null) return b.getDurationSeconds();
                    r.setCurrentBreakStart(b.getBreakStart());
                    return (int) ChronoUnit.SECONDS.between(
                            b.getBreakStart(), LocalDateTime.now());
                })
                .sum();
        r.setTotalBreakSeconds(totalBreakSeconds);
        r.setNetWorkSeconds(totalSeconds - totalBreakSeconds);

        if (session.getStartTime() != null)
            r.setShiftStartTime(session.getStartTime().toLocalTime().toString());
        if (session.getEndTime() != null)
            r.setShiftEndTime(session.getEndTime().toLocalTime().toString());

        r.setTimesheetSubmitted(
                timesheetRepository.findBySessionId(session.getId()).isPresent());

        return r;
    }

    // ─────────────────────────────────────────────────────────────
    //  CALENDAR DATA
    //
    //  FIX: Uses safeGetApprovedLeaves() so a leave-table error never
    //  crashes the calendar. The whole method is also wrapped so any
    //  other unexpected exception returns an empty-but-valid calendar
    //  instead of a 500.
    // ─────────────────────────────────────────────────────────────

    public Map<String, Object> getCalendarData(Long employeeId,
                                                Integer year, Integer month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate   = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<AttendanceSession> sessions;
        try {
            sessions = attendanceSessionRepository
                    .findByEmployeeIdAndDateRange(employeeId, startDate, endDate);
        } catch (Exception e) {
            System.err.println("[AttendanceService] getCalendarData sessions error: "
                    + e.getMessage());
            sessions = new ArrayList<>();
        }

        // ✅ Uses safe wrapper — leave query error returns empty list, not 500
        List<Leave> approvedLeaves = safeGetApprovedLeaves(employeeId, startDate, endDate);

        Map<LocalDate, AttendanceSession> sessionByDate = sessions.stream()
                .filter(s -> s.getStartTime() != null)
                .collect(Collectors.toMap(
                        s -> s.getStartTime().toLocalDate(),
                        s -> s, (s1, s2) -> s1));

        List<Map<String, Object>> days = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            final LocalDate cur = date;
            Map<String, Object> day = new HashMap<>();
            day.put("date",      cur.toString());
            day.put("day",       cur.getDayOfMonth());
            day.put("dayOfWeek", cur.getDayOfWeek().toString());

            boolean isWeekend = cur.getDayOfWeek() == DayOfWeek.SATURDAY
                    || cur.getDayOfWeek() == DayOfWeek.SUNDAY;

            boolean isOnLeave = approvedLeaves.stream().anyMatch(l ->
                    !cur.isBefore(l.getStartDate()) && !cur.isAfter(l.getEndDate()));

            if (isOnLeave) {
                applyCalendarColors(day, "LEAVE");
                days.add(day);
                continue;
            }

            AttendanceSession session = sessionByDate.get(cur);

            if (session != null) {
                int intSec = session.getInternalWorkSeconds() != null
                        ? session.getInternalWorkSeconds() : 0;
                double hours = intSec / 3600.0;

                day.put("startTime",         session.getStartTime());
                day.put("endTime",           session.getEndTime());
                day.put("internalWorkHours", hours);

                AttendanceSession.AttendanceStatus st = session.getStatus();

                if      (st == AttendanceSession.AttendanceStatus.COMPENSATION_OFF)
                    applyCalendarColors(day, "COMPENSATION_OFF");
                else if (st == AttendanceSession.AttendanceStatus.WORKING)
                    applyCalendarColors(day, "WORKING");
                else if (st == AttendanceSession.AttendanceStatus.ON_BREAK)
                    applyCalendarColors(day, "ON_BREAK");
                else if (st == AttendanceSession.AttendanceStatus.COMPLETED
                        || st == AttendanceSession.AttendanceStatus.PRESENT)
                    applyCalendarColors(day, "FULL");
                else if (st == AttendanceSession.AttendanceStatus.HALF_DAY)
                    applyCalendarColors(day, "HALF");
                else if (hours >= 8)  applyCalendarColors(day, "FULL");
                else if (hours >= 5)  applyCalendarColors(day, "HALF");
                else if (hours >  0)  applyCalendarColors(day, "PARTIAL");
                else                  applyCalendarColors(day, "ABSENT");

                if (isWeekend && hours > 0) applyCalendarColors(day, "HOLIDAY_WORK");

            } else {
                if      (isWeekend)                        applyCalendarColors(day, "HOLIDAY");
                else if (cur.isAfter(LocalDate.now()))     applyCalendarColors(day, "UPCOMING");
                else                                       applyCalendarColors(day, "ABSENT");
            }

            days.add(day);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("year",      year);
        response.put("month",     month);
        response.put("monthName", startDate.getMonth().toString());
        response.put("days",      days);
        return response;
    }

    // ─────────────────────────────────────────────────────────────
    //  MONTHLY ATTENDANCE — tenant-aware (new)
    // ─────────────────────────────────────────────────────────────

    public Map<String, Object> getMonthlyAttendanceForEmployee(
            Long employeeId, Integer year, Integer month, String tenantCode) {
        validateEmployeeTenant(employeeId, tenantCode);
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate   = startDate.withDayOfMonth(startDate.lengthOfMonth());
        List<AttendanceSession> sessions =
                attendanceSessionRepository.findByEmployeeIdAndDateRange(
                        employeeId, startDate, endDate);
        List<Leave> leaves = safeGetApprovedLeaves(employeeId, startDate, endDate);
        return buildMonthlyAttendanceSummary(sessions, leaves, year, month, startDate, endDate);
    }

    public List<Map<String, Object>> getMonthlyAttendanceForAllEmployees(
            Integer year, Integer month, String tenantCode, Long companyId) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate   = startDate.withDayOfMonth(startDate.lengthOfMonth());
        List<Long> empIds   =
                userRepository.findEmployeeIdsByTenantAndCompany(tenantCode, companyId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Long empId : empIds) {
            List<AttendanceSession> sessions =
                    attendanceSessionRepository.findByEmployeeIdAndDateRange(
                            empId, startDate, endDate);
            List<Leave> leaves = safeGetApprovedLeaves(empId, startDate, endDate);
            Map<String, Object> summary =
                    buildMonthlyAttendanceSummary(sessions, leaves, year, month, startDate, endDate);
            summary.put("employeeId", empId);
            userRepository.findById(empId).ifPresent(u -> {
                summary.put("employeeName",  u.getFullName());
                summary.put("department",    u.getDepartment());
                summary.put("designation",   u.getPosition());
                summary.put("employeeCode", u.getEmployeeId());
            });
            result.add(summary);
        }
        return result;
    }

    public Map<String, Object> getMonthlyAttendanceByDepartment(
            Integer year, Integer month, String tenantCode, Long companyId) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate   = startDate.withDayOfMonth(startDate.lengthOfMonth());
        List<Long> empIds   =
                userRepository.findEmployeeIdsByTenantAndCompany(tenantCode, companyId);

        Map<String, List<Map<String, Object>>> byDept = new HashMap<>();
        for (Long empId : empIds) {
            String dept = userRepository.findById(empId)
                    .map(u -> u.getDepartment() != null ? u.getDepartment() : "Unassigned")
                    .orElse("Unassigned");
            List<AttendanceSession> sessions =
                    attendanceSessionRepository.findByEmployeeIdAndDateRange(
                            empId, startDate, endDate);
            List<Leave> leaves = safeGetApprovedLeaves(empId, startDate, endDate);
            Map<String, Object> emp =
                    buildMonthlyAttendanceSummary(sessions, leaves, year, month, startDate, endDate);
            emp.put("employeeId", empId);
            userRepository.findById(empId).ifPresent(u -> {
                emp.put("employeeName",  u.getFullName());
                emp.put("designation",   u.getPosition());
                emp.put("employeeCode", u.getEmployeeId());
            });
            byDept.computeIfAbsent(dept, k -> new ArrayList<>()).add(emp);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("year", year); result.put("month", month);
        result.put("tenantCode", tenantCode); result.put("companyId", companyId);

        List<Map<String, Object>> departments = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : byDept.entrySet()) {
            Map<String, Object> deptData = new HashMap<>();
            deptData.put("department",     entry.getKey());
            deptData.put("employees",      entry.getValue());
            deptData.put("totalEmployees", entry.getValue().size());
            deptData.put("deptFullDays",   entry.getValue().stream().mapToLong(e -> toLong(e.get("fullDays"))).sum());
            deptData.put("deptHalfDays",   entry.getValue().stream().mapToLong(e -> toLong(e.get("halfDays"))).sum());
            deptData.put("deptAbsentDays", entry.getValue().stream().mapToLong(e -> toLong(e.get("absentDays"))).sum());
            deptData.put("deptLeaveDays",  entry.getValue().stream().mapToLong(e -> toLong(e.get("leaveDays"))).sum());
            deptData.put("deptTotalWorkHours", String.format("%.2f",
                    entry.getValue().stream().mapToDouble(e -> toDouble(e.get("totalWorkHours"))).sum()));
            departments.add(deptData);
        }
        result.put("departments", departments);
        return result;
    }

    public Map<String, Object> getPayrollAttendanceForEmployee(
            Long employeeId, Integer year, Integer month, String tenantCode) {
        validateEmployeeTenant(employeeId, tenantCode);
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate   = startDate.withDayOfMonth(startDate.lengthOfMonth());
        List<AttendanceSession> sessions =
                attendanceSessionRepository.findByEmployeeIdAndDateRange(
                        employeeId, startDate, endDate);
        List<Leave> leaves = safeGetApprovedLeaves(employeeId, startDate, endDate);
        Map<String, Object> summary =
                buildMonthlyAttendanceSummary(sessions, leaves, year, month, startDate, endDate);
        summary.put("employeeId",   employeeId);
        summary.put("dailyRecords", buildDailyRecords(sessions, leaves, startDate, endDate));
        userRepository.findById(employeeId).ifPresent(u -> {
            summary.put("employeeName", u.getFullName());
            summary.put("department",   u.getDepartment());
            summary.put("designation",  u.getPosition());
        });
        return summary;
    }

    // ─────────────────────────────────────────────────────────────
    //  LEGACY monthly summary (backward compat)
    // ─────────────────────────────────────────────────────────────

    public Map<String, Object> getMonthlyAttendance(
            Long employeeId, Integer year, Integer month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate   = startDate.withDayOfMonth(startDate.lengthOfMonth());
        List<AttendanceSession> sessions =
                attendanceSessionRepository.findByEmployeeIdAndDateRange(
                        employeeId, startDate, endDate);

        long presentDays = sessions.stream()
                .filter(s -> s.getStatus() == AttendanceSession.AttendanceStatus.COMPLETED
                        || s.getStatus() == AttendanceSession.AttendanceStatus.PRESENT
                        || s.getStatus() == AttendanceSession.AttendanceStatus.WORKING)
                .map(s -> s.getStartTime().toLocalDate()).distinct().count();
        long halfDays = sessions.stream()
                .filter(s -> s.getStatus() == AttendanceSession.AttendanceStatus.HALF_DAY)
                .count();
        long leaves   = sessions.stream()
                .filter(s -> s.getStatus() == AttendanceSession.AttendanceStatus.LEAVE)
                .count();
        int totalWorkSecs = sessions.stream()
                .filter(s -> s.getTotalSeconds() != null)
                .mapToInt(AttendanceSession::getTotalSeconds).sum();
        double totalWorkHours = totalWorkSecs / 3600.0;
        double avgWorkHours   = presentDays > 0 ? totalWorkHours / presentDays : 0;

        Map<String, Object> data = new HashMap<>();
        data.put("year",           year);
        data.put("month",          month);
        data.put("totalDays",      startDate.lengthOfMonth());
        data.put("presentDays",    presentDays);
        data.put("halfDays",       halfDays);
        data.put("leaves",         leaves);
        data.put("totalWorkHours", String.format("%.2f", totalWorkHours));
        data.put("avgWorkHours",   String.format("%.2f", avgWorkHours));
        return data;
    }

    // ─────────────────────────────────────────────────────────────
    //  ATTENDANCE SUMMARY (dashboard)
    // ─────────────────────────────────────────────────────────────

    public Map<String, Object> getAttendanceSummary(Long employeeId) {
        LocalDate now       = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate   = now.withDayOfMonth(now.lengthOfMonth());
        List<AttendanceSession> sessions =
                attendanceSessionRepository.findByEmployeeIdAndDateRange(
                        employeeId, startDate, endDate);

        long fullDays = sessions.stream()
                .filter(s -> s.getInternalWorkSeconds() != null
                        && s.getInternalWorkSeconds() >= FULL_DAY_CREDIT_SECONDS)
                .map(s -> s.getStartTime().toLocalDate()).distinct().count();
        long halfDays = sessions.stream()
                .filter(s -> s.getInternalWorkSeconds() != null
                        && s.getInternalWorkSeconds() >= HALF_DAY_CREDIT_SECONDS
                        && s.getInternalWorkSeconds() < FULL_DAY_CREDIT_SECONDS)
                .map(s -> s.getStartTime().toLocalDate()).distinct().count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("currentMonth",    now.getMonth().toString());
        summary.put("fullDays",        fullDays);
        summary.put("halfDays",        halfDays);
        summary.put("todayAttendance", getTodayAttendance(employeeId));
        return summary;
    }

    // ─────────────────────────────────────────────────────────────
    //  LEAVE & CORRECTION REQUESTS
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public Leave submitLeaveRequest(LeaveRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null)
            throw new RuntimeException("Start date and end date are required");
        if (request.getStartDate().isAfter(request.getEndDate()))
            throw new RuntimeException("Start date cannot be after end date");

        long totalDays = ChronoUnit.DAYS.between(
                request.getStartDate(), request.getEndDate()) + 1;

        Leave leave = new Leave();
        leave.setUserId(request.getEmployeeId());
        leave.setLeaveType(request.getType());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());
        leave.setTotalDays((int) totalDays);
        leave.setStatus(Leave.LeaveStatus.PENDING);
        return leaveRepository.save(leave);
    }

    @Transactional
    public void submitCorrectionRequest(AttendanceRequest request) {
        LocalDate requestDate = request.getDate() != null ? request.getDate()
                : (request.getTimestamp() != null
                        ? request.getTimestamp().toLocalDate() : null);
        if (requestDate == null)
            throw new RuntimeException("Date is required for correction request");

        List<AttendanceSession> sessions =
                attendanceSessionRepository.findByEmployeeIdAndDate(
                        request.getEmployeeId(), requestDate);

        AttendanceSession session;
        if (sessions.isEmpty()) {
            session = new AttendanceSession();
            session.setEmployeeId(request.getEmployeeId());
            session.setStartTime(requestDate.atStartOfDay());
        } else {
            session = sessions.get(0);
        }

        String action = request.getAction() != null
                ? request.getAction().toLowerCase() : "mark_present";
        switch (action) {
            case "mark_present":
                session.setStatus(AttendanceSession.AttendanceStatus.PRESENT);
                session.setInternalWorkSeconds(FULL_DAY_CREDIT_SECONDS);
                session.setTotalSeconds(FULL_DAY_CREDIT_SECONDS);
                break;
            case "mark_half_day":
                session.setStatus(AttendanceSession.AttendanceStatus.HALF_DAY);
                session.setInternalWorkSeconds(HALF_DAY_CREDIT_SECONDS);
                session.setTotalSeconds(HALF_DAY_CREDIT_SECONDS);
                break;
            default:
                throw new RuntimeException("Invalid correction action: " + action);
        }
        attendanceSessionRepository.save(session);
    }

    // ─────────────────────────────────────────────────────────────
    //  ATTENDANCE HISTORY
    // ─────────────────────────────────────────────────────────────

    public List<AttendanceSession> getAttendanceHistory(
            Long employeeId, String startDateStr, String endDateStr) {
        if (startDateStr != null && endDateStr != null)
            return attendanceSessionRepository.findByEmployeeIdAndDateRange(
                    employeeId, LocalDate.parse(startDateStr), LocalDate.parse(endDateStr));
        LocalDate end   = LocalDate.now();
        LocalDate start = end.minusDays(30);
        return attendanceSessionRepository.findByEmployeeIdAndDateRange(
                employeeId, start, end);
    }

    // ─────────────────────────────────────────────────────────────
    //  PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────

    private int calculateNetWorkSeconds(AttendanceSession session) {
        LocalDateTime end = session.getEndTime() != null
                ? session.getEndTime() : LocalDateTime.now();
        int total = (int) ChronoUnit.SECONDS.between(session.getStartTime(), end);
        int breaks = breakRepository.findBySessionId(session.getId()).stream()
                .mapToInt(b -> b.getBreakEnd() != null ? b.getDurationSeconds()
                        : (int) ChronoUnit.SECONDS.between(b.getBreakStart(), LocalDateTime.now()))
                .sum();
        return total - breaks;
    }

    private int calculateInternalWorkHours(int netSecs) {
        if (netSecs < HALF_DAY_THRESHOLD_SECONDS) return HALF_DAY_CREDIT_SECONDS;
        if (netSecs <= MAX_WORK_SECONDS)           return FULL_DAY_CREDIT_SECONDS;
        return MAX_WORK_SECONDS;
    }

    private void autoSubmitTimesheet(AttendanceSession session, String remarks) {
        if (timesheetRepository.findBySessionId(session.getId()).isPresent()) return;
        Timesheet ts = new Timesheet();
        ts.setSessionId(session.getId());
        ts.setEmployeeId(session.getEmployeeId());
        ts.setTasks("Auto-generated: Work completed");
        ts.setRemarks(remarks);
        ts.setSubmittedAt(LocalDateTime.now());
        timesheetRepository.save(ts);
    }

    private AttendanceSession getActiveTodaySession(Long employeeId) {
        List<AttendanceSession> sessions =
                attendanceSessionRepository.findByEmployeeIdAndDate(
                        employeeId, LocalDate.now());
        if (sessions.isEmpty())
            throw new RuntimeException(
                    "No active session found for today. Please start work first.");
        AttendanceSession s = sessions.get(0);
        if (s.getStatus() == AttendanceSession.AttendanceStatus.COMPLETED
                || s.getStatus() == AttendanceSession.AttendanceStatus.PRESENT
                || s.getStatus() == AttendanceSession.AttendanceStatus.HALF_DAY)
            throw new RuntimeException(
                    "Work already ended for today. You can start work again tomorrow.");
        return s;
    }

    private void validateEmployeeTenant(Long employeeId, String tenantCode) {
        boolean valid = userRepository.findById(employeeId)
                .map(u -> tenantCode.equals(u.getTenantCode()))
                .orElse(false);
        if (!valid)
            throw new RuntimeException(
                    "Access denied: employee does not belong to tenant " + tenantCode);
    }

    private Map<String, Object> buildMonthlyAttendanceSummary(
            List<AttendanceSession> sessions,
            List<Leave> approvedLeaves,
            Integer year, Integer month,
            LocalDate startDate, LocalDate endDate) {

        int  totalCalDays = startDate.lengthOfMonth();
        long weekendDays  = startDate.datesUntil(endDate.plusDays(1))
                .filter(d -> d.getDayOfWeek() == DayOfWeek.SATURDAY
                        || d.getDayOfWeek() == DayOfWeek.SUNDAY)
                .count();
        long workingDays  = totalCalDays - weekendDays;

        long fullDays = sessions.stream()
                .filter(s -> s.getInternalWorkSeconds() != null
                        && s.getInternalWorkSeconds() >= FULL_DAY_CREDIT_SECONDS)
                .map(s -> s.getStartTime().toLocalDate()).distinct().count();
        long halfDays = sessions.stream()
                .filter(s -> s.getInternalWorkSeconds() != null
                        && s.getInternalWorkSeconds() >= HALF_DAY_CREDIT_SECONDS
                        && s.getInternalWorkSeconds() < FULL_DAY_CREDIT_SECONDS)
                .map(s -> s.getStartTime().toLocalDate()).distinct().count();
        long leaveDays = approvedLeaves.stream()
                .mapToLong(l -> {
                    LocalDate ls = l.getStartDate().isBefore(startDate) ? startDate : l.getStartDate();
                    LocalDate le = l.getEndDate().isAfter(endDate)     ? endDate   : l.getEndDate();
                    return ChronoUnit.DAYS.between(ls, le) + 1;
                }).sum();
        long partialDays = sessions.stream()
                .filter(s -> s.getInternalWorkSeconds() != null
                        && s.getInternalWorkSeconds() > 0
                        && s.getInternalWorkSeconds() < HALF_DAY_CREDIT_SECONDS)
                .map(s -> s.getStartTime().toLocalDate()).distinct().count();

        LocalDate today      = LocalDate.now();
        LocalDate cutoff     = endDate.isAfter(today) ? today : endDate;
        long pastWorkingDays = startDate.datesUntil(cutoff.plusDays(1))
                .filter(d -> d.getDayOfWeek() != DayOfWeek.SATURDAY
                        && d.getDayOfWeek() != DayOfWeek.SUNDAY)
                .count();
        long absentDays = Math.max(
                0, pastWorkingDays - fullDays - halfDays - partialDays - leaveDays);

        int    totalIntSecs  = sessions.stream()
                .filter(s -> s.getInternalWorkSeconds() != null)
                .mapToInt(AttendanceSession::getInternalWorkSeconds).sum();
        double totalWorkHrs  = totalIntSecs / 3600.0;
        long   daysWorked    = fullDays + halfDays + partialDays;
        double avgWorkHrs    = daysWorked > 0 ? totalWorkHrs / daysWorked : 0;
        double effectiveDays = fullDays + (halfDays * 0.5) + (partialDays * 0.25);

        Map<String, Object> s = new HashMap<>();
        s.put("year",              year);
        s.put("month",             month);
        s.put("monthName",         startDate.getMonth().toString());
        s.put("totalCalendarDays", totalCalDays);
        s.put("weekendDays",       weekendDays);
        s.put("workingDays",       workingDays);
        s.put("fullDays",          fullDays);
        s.put("halfDays",          halfDays);
        s.put("partialDays",       partialDays);
        s.put("leaveDays",         leaveDays);
        s.put("absentDays",        absentDays);
        s.put("totalWorkHours",    totalWorkHrs);
        s.put("avgWorkHours",      Double.parseDouble(String.format("%.2f", avgWorkHrs)));
        s.put("effectiveDays",     Double.parseDouble(String.format("%.2f", effectiveDays)));
        return s;
    }

    private List<Map<String, Object>> buildDailyRecords(
            List<AttendanceSession> sessions,
            List<Leave> approvedLeaves,
            LocalDate startDate, LocalDate endDate) {

        Map<LocalDate, AttendanceSession> byDate = sessions.stream()
                .filter(s -> s.getStartTime() != null)
                .collect(Collectors.toMap(
                        s -> s.getStartTime().toLocalDate(), s -> s, (a, b) -> a));

        List<Map<String, Object>> records = new ArrayList<>();
        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            Map<String, Object> rec = new HashMap<>();
            rec.put("date",      d.toString());
            rec.put("dayOfWeek", d.getDayOfWeek().toString());
            boolean isWknd   = d.getDayOfWeek() == DayOfWeek.SATURDAY || d.getDayOfWeek() == DayOfWeek.SUNDAY;
            boolean isFuture  = d.isAfter(LocalDate.now());
            final LocalDate fd = d;
            boolean isLeave   = approvedLeaves.stream().anyMatch(l ->
                    !fd.isBefore(l.getStartDate()) && !fd.isAfter(l.getEndDate()));

            if (isWknd)        { rec.put("type", "WEEKEND"); rec.put("effectiveValue", 0.0); }
            else if (isLeave)  { rec.put("type", "LEAVE");   rec.put("effectiveValue", 0.0); }
            else if (isFuture) { rec.put("type", "UPCOMING");rec.put("effectiveValue", 0.0); }
            else {
                AttendanceSession ses = byDate.get(d);
                if (ses == null) {
                    rec.put("type", "ABSENT"); rec.put("effectiveValue", 0.0);
                } else {
                    int intSec = ses.getInternalWorkSeconds() != null ? ses.getInternalWorkSeconds() : 0;
                    double hrs = intSec / 3600.0;
                    rec.put("startTime",       ses.getStartTime());
                    rec.put("endTime",         ses.getEndTime());
                    rec.put("workHours",       Double.parseDouble(String.format("%.2f", hrs)));
                    rec.put("internalSeconds", intSec);
                    if      (intSec >= FULL_DAY_CREDIT_SECONDS)  { rec.put("type","FULL_DAY"); rec.put("effectiveValue",1.0); }
                    else if (intSec >= HALF_DAY_CREDIT_SECONDS)  { rec.put("type","HALF_DAY"); rec.put("effectiveValue",0.5); }
                    else if (intSec > 0)                          { rec.put("type","PARTIAL");  rec.put("effectiveValue",0.25); }
                    else                                          { rec.put("type","ABSENT");   rec.put("effectiveValue",0.0); }
                }
            }
            records.add(rec);
        }
        return records;
    }

    private void applyCalendarColors(Map<String, Object> m, String status) {
        switch (status) {
            case "FULL":             set(m,"FULL",             "#16A34A","#FFFFFF"); break;
            case "HALF":             set(m,"HALF",             "#F97316","#FFFFFF"); break;
            case "PARTIAL":          set(m,"PARTIAL",          "#F59E0B","#000000"); break;
            case "WORKING":          set(m,"WORKING",          "#0EA5E9","#FFFFFF"); break;
            case "ON_BREAK":         set(m,"ON_BREAK",         "#06B6D4","#FFFFFF"); break;
            case "LEAVE":            set(m,"LEAVE",            "#FACC15","#000000"); break;
            case "COMPENSATION_OFF": set(m,"COMPENSATION_OFF", "#2563EB","#FFFFFF"); break;
            case "HOLIDAY_WORK":     set(m,"HOLIDAY_WORK",     "#7C3AED","#FFFFFF"); break;
            case "HOLIDAY":          set(m,"HOLIDAY",          "#374151","#FFFFFF"); break;
            case "UPCOMING":         set(m,"UPCOMING",         "#E5E7EB","#6B7280"); break;
            default:                 set(m,"ABSENT",           "#DC2626","#FFFFFF"); break;
        }
    }

    private void set(Map<String,Object> m, String st, String bg, String txt) {
        m.put("status",      st);
        m.put("displayText", st);
        m.put("statusColor", bg);
        m.put("textColor",   txt);
    }

    private long toLong(Object v) {
        if (v == null) return 0L;
        if (v instanceof Number) return ((Number) v).longValue();
        try { return Long.parseLong(v.toString()); } catch (Exception e) { return 0L; }
    }

    private double toDouble(Object v) {
        if (v == null) return 0.0;
        if (v instanceof Number) return ((Number) v).doubleValue();
        try { return Double.parseDouble(v.toString()); } catch (Exception e) { return 0.0; }
    }
}