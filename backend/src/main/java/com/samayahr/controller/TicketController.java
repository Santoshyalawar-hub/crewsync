package com.samayahr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samayahr.dto.request.TicketRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.Ticket;
import com.samayahr.entity.User;
import com.samayahr.service.TicketService;
import com.samayahr.service.UserService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    @Autowired
    private UserService userService;
    
    public TicketController(TicketService ticketService) {
        super();
        this.ticketService = ticketService;
    }

    /**
     * Create a new ticket
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Ticket>> createTicket(@RequestBody TicketRequest request) {
        try {
            Ticket ticket = ticketService.createTicket(request);
            return ResponseEntity.ok(ApiResponse.success("Ticket created successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get current user's tickets (employee view)
     */
    @GetMapping("/my-tickets")
    public ResponseEntity<ApiResponse<List<Ticket>>> getMyTickets() {
        try {
            List<Ticket> tickets = ticketService.getMyTickets();
            return ResponseEntity.ok(ApiResponse.success("Tickets fetched successfully", tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get all tickets (admin view - filtered by company)
     * This endpoint automatically filters by the logged-in user's tenant/company
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Ticket>>> getAllTickets() {
        try {
            // Get current user to determine access level
            User currentUser = userService.getCurrentUser();
            
            List<Ticket> tickets;
            
            // If admin, get all tickets for their company
            if (currentUser.getRole() == User.Role.ADMIN || Boolean.TRUE.equals(currentUser.getIsAdmin())) {
                String tenantCode = currentUser.getTenantCode();
                Long companyId = currentUser.getCompanyId();
                
                if (tenantCode == null || companyId == null) {
                    return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Admin user not properly configured with tenant/company"));
                }
                
                tickets = ticketService.getAllTicketsByTenantCompany(tenantCode, companyId);
            } else {
                // Regular employee - only see their tickets
                tickets = ticketService.getMyTickets();
            }
            
            return ResponseEntity.ok(
                ApiResponse.success("Tickets fetched successfully", tickets)
            );
        } catch (Exception e) {
            e.printStackTrace(); // For debugging
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch tickets: " + e.getMessage()));
        }
    }

    /**
     * Get ticket by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> getTicketById(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(ApiResponse.success("Ticket fetched successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Update ticket status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Ticket>> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            String status = (String) request.get("status");
            Long assignedToId = request.get("assignedToId") != null ? 
                Long.parseLong(request.get("assignedToId").toString()) : null;
            
            Ticket ticket = ticketService.updateTicketStatus(id, status, assignedToId);
            return ResponseEntity.ok(ApiResponse.success("Ticket status updated successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Add comment to ticket
     */
    @PostMapping("/{id}/comment")
    public ResponseEntity<ApiResponse<Ticket>> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String comment = request.get("comment");
            ticketService.addComment(id, comment);
            Ticket updatedTicket = ticketService.getTicketById(id);
            return ResponseEntity.ok(ApiResponse.success("Comment added successfully", updatedTicket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get ticket statistics (filtered by company for admins)
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> getTicketStats() {
        try {
            var stats = ticketService.getTicketStats();
            return ResponseEntity.ok(ApiResponse.success("Stats fetched successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}