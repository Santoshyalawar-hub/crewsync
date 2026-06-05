package com.samayahr.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.samayahr.entity.CompanyRegistration;

public interface CompanyRegistrationRepository extends JpaRepository<CompanyRegistration, Long> {

	  CompanyRegistration save(CompanyRegistration company);
	  boolean existsByCompanyEmail(String companyEmail);
	  CompanyRegistration findByCompanyEmail(String companyEmail);
	  CompanyRegistration findByCompanyKey(String companyKey);
}
