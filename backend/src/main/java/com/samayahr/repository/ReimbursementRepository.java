package com.samayahr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.Reimbursement;

import java.util.List;

@Repository
public interface ReimbursementRepository extends JpaRepository<Reimbursement, Long> {
    
    List<Reimbursement> findByUserId(Long userId);
    
    List<Reimbursement> findByStatus(Reimbursement.ReimbursementStatus status);

    @Query("SELECT r FROM Reimbursement r JOIN User u ON u.id = r.userId "
            + "WHERE r.userId = :userId AND u.tenantCode = :tenantCode "
            + "AND r.status = 'APPROVED' AND r.paymentDate IS NULL")
    List<Reimbursement> findApprovedUnpaidByUserAndTenant(@Param("userId") Long userId,
                                                          @Param("tenantCode") String tenantCode);

    @Query("SELECT COUNT(r) FROM Reimbursement r WHERE r.status = 'PENDING'")
    long countPending();
}
