package com.samayahr.controller;

import com.samayahr.dto.response.ApiResponse;
import com.samayahr.entity.HierarchyNode;
import com.samayahr.entity.HierarchyProject;
import com.samayahr.service.HierarchyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/hierarchy")
@CrossOrigin(origins = "*")
public class HierarchyController {

    @Autowired
    private HierarchyService hierarchyService;

    /* ── GET root (full tree) ── */
    @GetMapping("/root")
    public ResponseEntity<ApiResponse<HierarchyNode>> getRoot(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode) {
        try {
            if (tenantCode == null || tenantCode.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("X-Tenant-Code header is required"));
            }
            HierarchyNode tree = hierarchyService.getTreeForTenant(tenantCode);
            if (tree == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No hierarchy found for this tenant"));
            }
            return ResponseEntity.ok(ApiResponse.success("Hierarchy fetched", tree));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /* ── POST root (create CEO) ── */
    @PostMapping("/root")
    public ResponseEntity<ApiResponse<HierarchyNode>> createRoot(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode,
            @RequestBody Map<String, String> body) {
        try {
            if (tenantCode == null || tenantCode.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("X-Tenant-Code header is required"));
            }
            HierarchyNode node = hierarchyService.createRoot(
                    tenantCode,
                    body.get("name"),
                    body.getOrDefault("role", "CEO"),
                    body.get("designation"),
                    body.get("photo"));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Root node created", node));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /* ── POST child under a parent ── */
    @PostMapping("/{parentId}/children")
    public ResponseEntity<ApiResponse<HierarchyNode>> addChild(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode,
            @PathVariable Long parentId,
            @RequestBody Map<String, String> body) {
        try {
            if (tenantCode == null || tenantCode.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("X-Tenant-Code header is required"));
            }
            HierarchyNode node = hierarchyService.addChild(
                    tenantCode, parentId,
                    body.get("name"),
                    body.get("role"),
                    body.get("designation"),
                    body.get("photo"));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Child node added", node));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /* ── PUT update node ── */
    @PutMapping("/{nodeId}")
    public ResponseEntity<ApiResponse<HierarchyNode>> updateNode(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode,
            @PathVariable Long nodeId,
            @RequestBody Map<String, String> body) {
        try {
            if (tenantCode == null || tenantCode.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("X-Tenant-Code header is required"));
            }
            HierarchyNode node = hierarchyService.updateNode(
                    tenantCode, nodeId,
                    body.get("name"),
                    body.get("designation"),
                    body.get("photo"));
            return ResponseEntity.ok(ApiResponse.success("Node updated", node));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /* ── DELETE node (and descendants) ── */
    @DeleteMapping("/{nodeId}")
    public ResponseEntity<ApiResponse<String>> deleteNode(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode,
            @PathVariable Long nodeId) {
        try {
            if (tenantCode == null || tenantCode.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("X-Tenant-Code header is required"));
            }
            hierarchyService.deleteNode(tenantCode, nodeId);
            return ResponseEntity.ok(ApiResponse.success("Node deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /* ── GET single node ── */
    @GetMapping("/{nodeId}")
    public ResponseEntity<ApiResponse<HierarchyNode>> getNode(@PathVariable Long nodeId) {
        return hierarchyService.getNode(nodeId)
                .map(n -> ResponseEntity.ok(ApiResponse.success("Node fetched", n)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Node not found")));
    }

    /* ── POST project for a node ── */
    @PostMapping("/{nodeId}/projects")
    public ResponseEntity<ApiResponse<HierarchyProject>> addProject(
            @RequestHeader(value = "X-Tenant-Code", required = false) String tenantCode,
            @PathVariable Long nodeId,
            @RequestBody Map<String, String> body) {
        try {
            if (tenantCode == null || tenantCode.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("X-Tenant-Code header is required"));
            }
            HierarchyProject project = hierarchyService.addProject(
                    tenantCode, nodeId,
                    body.get("name"),
                    body.get("status"),
                    body.get("due"));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Project added", project));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /* ── DELETE project ── */
    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<ApiResponse<String>> deleteProject(@PathVariable Long projectId) {
        try {
            hierarchyService.deleteProject(projectId);
            return ResponseEntity.ok(ApiResponse.success("Project deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
