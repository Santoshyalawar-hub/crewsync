package com.samayahr.service;

import com.samayahr.entity.LeaveBalance;
import com.samayahr.entity.Leave;
import com.samayahr.entity.User;
import com.samayahr.repository.LeaveBalanceRepository;
import com.samayahr.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LeaveBalanceService {

    @Autowired
    private LeaveBalanceRepository balanceRepo;

    @Autowired
    private UserRepository userRepo;

    // ── Default entitlements ──────────────────────────────────────────────────

    private static final Map<LeaveBalance.LeaveType, Double>
            DEFAULT_ENTITLEMENTS = Map.of(
                LeaveBalance.LeaveType.EARNED,        12.0,
                LeaveBalance.LeaveType.SICK,           7.0,
                LeaveBalance.LeaveType.CASUAL,         7.0,
                LeaveBalance.LeaveType.MATERNITY,    182.0,
                LeaveBalance.LeaveType.PATERNITY,     15.0,
                LeaveBalance.LeaveType.COMPENSATORY,   0.0
            );

    // ── Initialise for new employee ───────────────────────────────────────────

    /**
     * Creates 6 leave balance rows for a new employee.
     * Called from AuthService.register() and UserService.createAdmin...()
     * Safe to call multiple times — skips types that already exist.
     */
    @Transactional
    public void initialiseForEmployee(User employee) {
        int year = LocalDate.now().getYear();

        DEFAULT_ENTITLEMENTS.forEach((type, entitled) -> {
            if (!balanceRepo.existsByUserIdAndLeaveTypeAndYear(
                    employee.getId(), type, year)) {

                LeaveBalance lb = new LeaveBalance();
                lb.setUserId(employee.getId());
                lb.setTenantCode(employee.getTenantCode());
                lb.setCompanyId(employee.getCompanyId());
                lb.setLeaveType(type);
                lb.setYear(year);
                lb.setTotalEntitled(entitled);
                lb.setUsed(0.0);
                lb.setPending(0.0);
                lb.setCarriedForward(0.0);
                balanceRepo.save(lb);
            }
        });
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<LeaveBalance> getBalancesForEmployee(Long userId) {
        return balanceRepo.findByUserIdAndYear(
                userId, LocalDate.now().getYear());
    }

    public Optional<LeaveBalance> getBalance(Long userId,
                                              LeaveBalance.LeaveType type) {
        return balanceRepo.findByUserIdAndLeaveTypeAndYear(
                userId, type, LocalDate.now().getYear());
    }

    public List<LeaveBalance> getAllBalancesForTenant(String tenantCode,
                                                       Long companyId,
                                                       int year) {
        return balanceRepo.findByTenantCompanyAndYear(
                tenantCode, companyId, year);
    }

    // ── Called from LeaveService.applyLeave() ─────────────────────────────────

    /**
     * Reserves balance when employee submits a leave request.
     * Throws RuntimeException if balance is insufficient — blocks the apply.
     */
    @Transactional
    public void addToPending(Leave leave) {
        LeaveBalance.LeaveType type = resolveType(leave.getLeaveType());
        if (type == LeaveBalance.LeaveType.UNPAID) return;
        if (leave.getStartDate() == null) return;

        int year = leave.getStartDate().getYear();
        double days = leave.getTotalDays() != null
                ? leave.getTotalDays()
                : ChronoUnit.DAYS.between(
                        leave.getStartDate(), leave.getEndDate()) + 1;

        LeaveBalance balance = balanceRepo
                .findByUserIdAndLeaveTypeAndYear(
                        leave.getUserId(), type, year)
                .orElseGet(() -> createDefaultBalance(
                        leave.getUserId(), type, year));

        if (days > balance.getAvailable()) {
            throw new RuntimeException(
                    "Insufficient " + type.name() + " leave balance. "
                    + "Available: " + balance.getAvailable()
                    + " days, Requested: " + (int) days + " days.");
        }

        balance.setPending(nvl(balance.getPending()) + days);
        balanceRepo.save(balance);
    }

    // ── Called from LeaveService.approveLeave() ───────────────────────────────

    /**
     * Moves days from pending → used when leave is approved.
     */
    @Transactional
    public void deductOnApproval(Leave leave) {
        LeaveBalance.LeaveType type = resolveType(leave.getLeaveType());
        if (type == LeaveBalance.LeaveType.UNPAID) return;
        if (leave.getStartDate() == null) return;

        int year = leave.getStartDate().getYear();
        double days = leave.getTotalDays() != null
                ? leave.getTotalDays()
                : ChronoUnit.DAYS.between(
                        leave.getStartDate(), leave.getEndDate()) + 1;

        balanceRepo.findByUserIdAndLeaveTypeAndYear(
                leave.getUserId(), type, year)
                .ifPresent(balance -> {
                    balance.setPending(
                            Math.max(0, nvl(balance.getPending()) - days));
                    balance.setUsed(nvl(balance.getUsed()) + days);
                    balanceRepo.save(balance);
                });
    }

    // ── Called from LeaveService.rejectLeave() + deleteLeave() ───────────────

    /**
     * Restores balance when leave is rejected or cancelled.
     */
    @Transactional
    public void removeFromPending(Leave leave) {
        LeaveBalance.LeaveType type = resolveType(leave.getLeaveType());
        if (type == LeaveBalance.LeaveType.UNPAID) return;
        if (leave.getStartDate() == null) return;

        int year = leave.getStartDate().getYear();
        double days = leave.getTotalDays() != null
                ? leave.getTotalDays()
                : ChronoUnit.DAYS.between(
                        leave.getStartDate(), leave.getEndDate()) + 1;

        balanceRepo.findByUserIdAndLeaveTypeAndYear(
                leave.getUserId(), type, year)
                .ifPresent(balance -> {
                    balance.setPending(
                            Math.max(0, nvl(balance.getPending()) - days));
                    balanceRepo.save(balance);
                });
    }

    // ── Admin: set custom entitlement ─────────────────────────────────────────

    @Transactional
    public LeaveBalance setEntitlement(Long userId, String leaveTypeStr,
                                        double days, String tenantCode) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found"));

        if (!tenantCode.equals(user.getTenantCode()))
            throw new RuntimeException(
                    "Access denied: employee does not belong to your company");

        LeaveBalance.LeaveType type =
                LeaveBalance.LeaveType.valueOf(
                        leaveTypeStr.trim().toUpperCase());
        int year = LocalDate.now().getYear();

        LeaveBalance balance = balanceRepo
                .findByUserIdAndLeaveTypeAndYear(userId, type, year)
                .orElseGet(() -> createDefaultBalance(userId, type, year));

        balance.setTotalEntitled(days);
        return balanceRepo.save(balance);
    }

    // ── Year-end carry forward ────────────────────────────────────────────────

    @Transactional
    public void processYearEndCarryForward(String tenantCode,
                                            int fromYear) {
        List<LeaveBalance> earnedBalances =
                balanceRepo.findEarnedBalancesByTenantAndYear(
                        tenantCode, fromYear);

        int nextYear = fromYear + 1;

        for (LeaveBalance old : earnedBalances) {
            double carryForward = Math.min(old.getAvailable(), 30.0);
            if (carryForward <= 0) continue;

            LeaveBalance next = balanceRepo
                    .findByUserIdAndLeaveTypeAndYear(
                            old.getUserId(),
                            LeaveBalance.LeaveType.EARNED,
                            nextYear)
                    .orElseGet(() -> createDefaultBalance(
                            old.getUserId(),
                            LeaveBalance.LeaveType.EARNED,
                            nextYear));

            next.setCarriedForward(carryForward);
            balanceRepo.save(next);
        }
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private LeaveBalance createDefaultBalance(Long userId,
                                               LeaveBalance.LeaveType type,
                                               int year) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "User not found: " + userId));

        LeaveBalance lb = new LeaveBalance();
        lb.setUserId(userId);
        lb.setTenantCode(user.getTenantCode());
        lb.setCompanyId(user.getCompanyId());
        lb.setLeaveType(type);
        lb.setYear(year);
        lb.setTotalEntitled(DEFAULT_ENTITLEMENTS.getOrDefault(type, 0.0));
        lb.setUsed(0.0);
        lb.setPending(0.0);
        lb.setCarriedForward(0.0);
        return balanceRepo.save(lb);
    }

    /**
     * Maps the free-text leaveType string on the Leave entity
     * to the LeaveBalance.LeaveType enum.
     */
    private LeaveBalance.LeaveType resolveType(String s) {
        if (s == null || s.trim().isEmpty())
            return LeaveBalance.LeaveType.UNPAID;

        return switch (s.trim().toUpperCase()
                .replace(" ", "_").replace("-", "_")) {
            case "EARNED", "PRIVILEGE", "PL", "EL"
                    -> LeaveBalance.LeaveType.EARNED;
            case "SICK", "MEDICAL", "SL"
                    -> LeaveBalance.LeaveType.SICK;
            case "CASUAL", "CL"
                    -> LeaveBalance.LeaveType.CASUAL;
            case "MATERNITY"
                    -> LeaveBalance.LeaveType.MATERNITY;
            case "PATERNITY"
                    -> LeaveBalance.LeaveType.PATERNITY;
            case "COMPENSATORY", "COMP", "COMP_OFF", "COMPOFF"
                    -> LeaveBalance.LeaveType.COMPENSATORY;
            default -> LeaveBalance.LeaveType.UNPAID;
        };
    }

    private double nvl(Double v) {
        return v != null ? v : 0.0;
    }
}