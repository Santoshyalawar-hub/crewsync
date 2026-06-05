package com.samayahr.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hierarchy_nodes")
public class HierarchyNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String role;
    private String designation;

    @Column(columnDefinition = "TEXT")
    private String photo;

    @Column(name = "tenant_code")
    private String tenantCode;

    @Column(name = "parent_id")
    private Long parentId;

    @OneToMany(mappedBy = "node", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<HierarchyProject> projects = new ArrayList<>();

    @Transient
    private List<HierarchyNode> children = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }

    public List<HierarchyProject> getProjects() { return projects; }
    public void setProjects(List<HierarchyProject> projects) { this.projects = projects; }

    public List<HierarchyNode> getChildren() { return children; }
    public void setChildren(List<HierarchyNode> children) { this.children = children; }
}
