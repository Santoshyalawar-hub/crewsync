package com.samayahr.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "hierarchy_projects")
public class HierarchyProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String status;
    private String due;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "node_id")
    @JsonIgnore
    private HierarchyNode node;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDue() { return due; }
    public void setDue(String due) { this.due = due; }

    public HierarchyNode getNode() { return node; }
    public void setNode(HierarchyNode node) { this.node = node; }
}
