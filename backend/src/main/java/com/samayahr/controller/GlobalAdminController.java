package com.samayahr.controller;

import com.samayahr.dto.request.GlobalAdminRequest;
import com.samayahr.dto.response.ApiResponse;
import com.samayahr.dto.response.AuthResponse;
import com.samayahr.entity.Ticket;
import com.samayahr.repository.TicketRepository;
import com.samayahr.service.GlobalAdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/global-admin")
@CrossOrigin(origins = "*")
public class GlobalAdminController {

    @Autowired
    private GlobalAdminService globalAdminService;

    @Autowired
    private TicketRepository ticketRepository;

    /**
     * POST /api/global-admin/create
     * Creates a new Global Admin from request body.
     * Secured by a secret key in the request to prevent public misuse.
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<AuthResponse>> createGlobalAdmin(
            @RequestBody GlobalAdminRequest request) {
        try {
            AuthResponse response = globalAdminService.createGlobalAdmin(request);
            return ResponseEntity.ok(ApiResponse.success("Global Admin created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/global-admin/exists
     * Check if any global admin exists (useful for first-time setup UI).
     */
    @GetMapping("/exists")
    public ResponseEntity<ApiResponse<Boolean>> globalAdminExists() {
        boolean exists = globalAdminService.globalAdminExists();
        return ResponseEntity.ok(ApiResponse.success("checked", exists));
    }

    /**
     * GET /api/global-admin/tickets
     * Returns all tickets across all companies (global admin view).
     */
    @GetMapping("/tickets")
    public ResponseEntity<ApiResponse<List<Ticket>>> getAllTickets() {
        try {
            List<Ticket> tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(ApiResponse.success("All tickets fetched", tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
