package com.samayahr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.samayahr.entity.TaxDeclaration;

import java.util.List;

@Repository
public interface TaxDeclarationRepository extends JpaRepository<TaxDeclaration, Long> {
    
    List<TaxDeclaration> findByUserId(Long userId);
    
    List<TaxDeclaration> findByStatus(TaxDeclaration.TaxStatus status);
}