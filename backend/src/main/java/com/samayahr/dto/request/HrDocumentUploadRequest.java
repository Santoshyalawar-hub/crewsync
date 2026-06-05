package com.samayahr.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class HrDocumentUploadRequest {
    private Long employeeId;
    private String docType;
    private String title;
    private String notes;
    private Boolean requiresSignature = true;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime signByDate;

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	public String getDocType() {
		return docType;
	}

	public void setDocType(String docType) {
		this.docType = docType;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Boolean getRequiresSignature() {
		return requiresSignature;
	}

	public void setRequiresSignature(Boolean requiresSignature) {
		this.requiresSignature = requiresSignature;
	}

	public LocalDateTime getSignByDate() {
		return signByDate;
	}

	public void setSignByDate(LocalDateTime signByDate) {
		this.signByDate = signByDate;
	}

    
}