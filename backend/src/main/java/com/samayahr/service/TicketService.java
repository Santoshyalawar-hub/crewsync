package com.samayahr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.samayahr.dto.request.TicketRequest;
import com.samayahr.entity.Ticket;
import com.samayahr.entity.User;
import com.samayahr.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
public class TicketService {
    
    // ✅ FIXED: Added 'final' keyword for proper dependency injection
	@Autowired
    private  TicketRepository ticketRepository;
	@Autowired
    private  UserService userService;
	@Autowired
    private  ObjectMapper objectMapper;
    


    @Transactional
    public Ticket createTicket(TicketRequest request) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getTenantCode() == null || currentUser.getCompanyId() == null) {
            throw new RuntimeException("User is not mapped to a company");
        }

        Ticket ticket = new Ticket();
        ticket.setEmployeeId(currentUser.getId());
        ticket.setEmployeeName(currentUser.getFullName());
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());

        // ✅ set company scope
        ticket.setTenantCode(currentUser.getTenantCode());
        ticket.setCompanyId(currentUser.getCompanyId());

        try {
            ticket.setPriority(Ticket.TicketPriority.valueOf(request.getPriority().toUpperCase()));
        } catch (Exception e) {
            ticket.setPriority(Ticket.TicketPriority.MEDIUM);
        }

        ticket.setStatus(Ticket.TicketStatus.OPEN);

        Ticket saved = ticketRepository.save(ticket);
        saved.setTicketId("TKT-" + saved.getId());
        return ticketRepository.save(saved);
    }

    
    public List<Ticket> getMyTickets() {
        User currentUser = userService.getCurrentUser();
        return ticketRepository.findByEmployeeIdOrderByCreatedAtDesc(currentUser.getId());
    }
    
    public List<Ticket> getAllTickets() {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() == User.Role.ADMIN || Boolean.TRUE.equals(currentUser.getIsAdmin())) {
            String tenantCode = currentUser.getTenantCode();
            Long companyId = currentUser.getCompanyId();

            if (tenantCode == null || companyId == null) {
                throw new RuntimeException("Admin not mapped to company");
            }

            // ✅ Now directly fetch by tenant/company from Ticket table
            return ticketRepository.findAllByTenantCompany(tenantCode, companyId);
        }

        return ticketRepository.findByEmployeeIdOrderByCreatedAtDesc(currentUser.getId());
    }


    
    public Ticket getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User currentUser = userService.getCurrentUser();

        if (currentUser.getTenantCode() == null || currentUser.getCompanyId() == null) {
            throw new RuntimeException("User not mapped to company");
        }

        // ✅ ticket-level company validation
        if (!currentUser.getTenantCode().equals(ticket.getTenantCode()) ||
            !currentUser.getCompanyId().equals(ticket.getCompanyId())) {
            throw new RuntimeException("Access denied: Cross-company ticket access");
        }

        return ticket;
    }


    
    @Transactional
    public Ticket updateTicketStatus(Long id, String status, Long assignedToId) {
        Ticket ticket = getTicketById(id);
        
        try {
            ticket.setStatus(Ticket.TicketStatus.valueOf(status.toUpperCase().replace("-", "_")));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
        
        if (assignedToId != null) {
            ticket.setAssignedToId(assignedToId);
        }
        
        return ticketRepository.save(ticket);
    }
    
    @Transactional
    public void addComment(Long ticketId, String commentText) {
        Ticket ticket = getTicketById(ticketId);
        User currentUser = userService.getCurrentUser();
        
        // Parse existing comments
        List<Map<String, Object>> comments = parseComments(ticket.getComments());
        
        // Add new comment
        Map<String, Object> newComment = new HashMap<>();
        newComment.put("id", System.currentTimeMillis());
        newComment.put("authorId", currentUser.getId());
        newComment.put("authorName", currentUser.getFullName());
        newComment.put("authorType", currentUser.getRole().name());
        newComment.put("comment", commentText);
        newComment.put("createdAt", new java.util.Date().toString());
        
        comments.add(newComment);
        
        // Save back to ticket
        try {
            ticket.setComments(objectMapper.writeValueAsString(comments));
            ticketRepository.save(ticket);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error adding comment", e);
        }
    }
    
    public List<Ticket> getAllTicketsByTenantCompany(String tenantCode, Long companyId) {
        return ticketRepository.findAllByTenantCompany(tenantCode, companyId);
    }

    
    public Map<String, Long> getTicketStats() {
        User currentUser = userService.getCurrentUser();

        // Admin stats should be company based
        if (currentUser.getRole() == User.Role.ADMIN || Boolean.TRUE.equals(currentUser.getIsAdmin())) {
            String tenantCode = currentUser.getTenantCode();
            Long companyId = currentUser.getCompanyId();

            if (tenantCode == null || tenantCode.isBlank() || companyId == null) {
                throw new RuntimeException("Admin tenantCode/companyId not found");
            }

            Map<String, Long> stats = new HashMap<>();
            stats.put("total", ticketRepository.countByTenantCompany(tenantCode, companyId));
            stats.put("open", ticketRepository.countByStatusTenantCompany(Ticket.TicketStatus.OPEN, tenantCode, companyId));
            stats.put("in_progress", ticketRepository.countByStatusTenantCompany(Ticket.TicketStatus.IN_PROGRESS, tenantCode, companyId));
            stats.put("resolved", ticketRepository.countByStatusTenantCompany(Ticket.TicketStatus.RESOLVED, tenantCode, companyId));
            stats.put("closed", ticketRepository.countByStatusTenantCompany(Ticket.TicketStatus.CLOSED, tenantCode, companyId));
            return stats;
        }

        // Employee stats (optional): only their own tickets
        Map<String, Long> stats = new HashMap<>();
        List<Ticket> my = ticketRepository.findByEmployeeIdOrderByCreatedAtDesc(currentUser.getId());

        stats.put("total", (long) my.size());
        stats.put("open", my.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.OPEN).count());
        stats.put("in_progress", my.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.IN_PROGRESS).count());
        stats.put("resolved", my.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.RESOLVED).count());
        stats.put("closed", my.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.CLOSED).count());
        return stats;
    }

    
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseComments(String commentsJson) {
        if (commentsJson == null || commentsJson.isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            return objectMapper.readValue(commentsJson, List.class);
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}