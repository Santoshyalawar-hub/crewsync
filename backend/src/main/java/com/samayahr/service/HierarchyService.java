package com.samayahr.service;

import com.samayahr.entity.HierarchyNode;
import com.samayahr.entity.HierarchyProject;
import com.samayahr.repository.HierarchyNodeRepository;
import com.samayahr.repository.HierarchyProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HierarchyService {

    @Autowired
    private HierarchyNodeRepository nodeRepo;

    @Autowired
    private HierarchyProjectRepository projectRepo;

    /* ── Build full tree for tenant ── */
    @Transactional(readOnly = true)
    public HierarchyNode getTreeForTenant(String tenantCode) {
        List<HierarchyNode> all = nodeRepo.findAllByTenantCode(tenantCode);
        if (all.isEmpty()) return null;

        // Index by id
        Map<Long, HierarchyNode> byId = all.stream()
                .collect(Collectors.toMap(HierarchyNode::getId, n -> {
                    n.setChildren(new ArrayList<>());
                    return n;
                }));

        HierarchyNode root = null;
        for (HierarchyNode node : all) {
            if (node.getParentId() == null) {
                root = node;
            } else {
                HierarchyNode parent = byId.get(node.getParentId());
                if (parent != null) parent.getChildren().add(node);
            }
        }
        return root;
    }

    /* ── Create root (CEO) ── */
    @Transactional
    public HierarchyNode createRoot(String tenantCode, String name, String role, String designation, String photo) {
        if (nodeRepo.findByParentIdIsNullAndTenantCode(tenantCode).isPresent()) {
            throw new RuntimeException("Root node already exists for this tenant");
        }
        HierarchyNode node = new HierarchyNode();
        node.setTenantCode(tenantCode);
        node.setParentId(null);
        node.setName(name);
        node.setRole(role != null ? role : "CEO");
        node.setDesignation(designation);
        node.setPhoto(photo != null ? photo : "");
        return nodeRepo.save(node);
    }

    /* ── Add child node ── */
    @Transactional
    public HierarchyNode addChild(String tenantCode, Long parentId, String name, String role, String designation, String photo) {
        HierarchyNode parent = nodeRepo.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent node not found"));
        if (!tenantCode.equals(parent.getTenantCode())) {
            throw new RuntimeException("Access denied: tenant mismatch");
        }
        HierarchyNode node = new HierarchyNode();
        node.setTenantCode(tenantCode);
        node.setParentId(parentId);
        node.setName(name);
        node.setRole(role);
        node.setDesignation(designation != null ? designation : "");
        node.setPhoto(photo != null ? photo : "");
        return nodeRepo.save(node);
    }

    /* ── Update node ── */
    @Transactional
    public HierarchyNode updateNode(String tenantCode, Long nodeId, String name, String designation, String photo) {
        HierarchyNode node = nodeRepo.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found"));
        if (!tenantCode.equals(node.getTenantCode())) {
            throw new RuntimeException("Access denied: tenant mismatch");
        }
        if (name != null && !name.isBlank()) node.setName(name);
        if (designation != null) node.setDesignation(designation);
        if (photo != null) node.setPhoto(photo);
        return nodeRepo.save(node);
    }

    /* ── Delete node and all descendants ── */
    @Transactional
    public void deleteNode(String tenantCode, Long nodeId) {
        HierarchyNode node = nodeRepo.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found"));
        if (!tenantCode.equals(node.getTenantCode())) {
            throw new RuntimeException("Access denied: tenant mismatch");
        }
        if (node.getParentId() == null) {
            throw new RuntimeException("Cannot delete the root node");
        }
        deleteRecursive(tenantCode, nodeId);
    }

    private void deleteRecursive(String tenantCode, Long nodeId) {
        List<HierarchyNode> children = nodeRepo.findAllByTenantCode(tenantCode)
                .stream().filter(n -> nodeId.equals(n.getParentId())).collect(Collectors.toList());
        for (HierarchyNode child : children) {
            deleteRecursive(tenantCode, child.getId());
        }
        nodeRepo.deleteById(nodeId);
    }

    /* ── Add project ── */
    @Transactional
    public HierarchyProject addProject(String tenantCode, Long nodeId, String name, String status, String due) {
        HierarchyNode node = nodeRepo.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found"));
        if (!tenantCode.equals(node.getTenantCode())) {
            throw new RuntimeException("Access denied: tenant mismatch");
        }
        HierarchyProject project = new HierarchyProject();
        project.setName(name);
        project.setStatus(status != null ? status : "Planning");
        project.setDue(due != null ? due : "TBD");
        project.setNode(node);
        return projectRepo.save(project);
    }

    /* ── Delete project ── */
    @Transactional
    public void deleteProject(Long projectId) {
        if (!projectRepo.existsById(projectId)) {
            throw new RuntimeException("Project not found");
        }
        projectRepo.deleteById(projectId);
    }

    /* ── Get single node ── */
    @Transactional(readOnly = true)
    public Optional<HierarchyNode> getNode(Long nodeId) {
        return nodeRepo.findById(nodeId);
    }
}
