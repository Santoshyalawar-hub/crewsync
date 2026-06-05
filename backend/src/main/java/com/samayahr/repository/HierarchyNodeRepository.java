package com.samayahr.repository;

import com.samayahr.entity.HierarchyNode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HierarchyNodeRepository extends JpaRepository<HierarchyNode, Long> {
    Optional<HierarchyNode> findByParentIdIsNullAndTenantCode(String tenantCode);
    List<HierarchyNode> findAllByTenantCode(String tenantCode);
    void deleteByTenantCode(String tenantCode);
}
