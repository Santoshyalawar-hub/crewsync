package com.samayahr.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "payroll_items",
        indexes = {
                @Index(name = "idx_payroll_item_payroll", columnList = "payroll_id"),
                @Index(name = "idx_payroll_item_tenant", columnList = "tenant_code")
        })
public class PayrollItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payroll_id", nullable = false)
    private Long payrollId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "tenant_code", nullable = false, length = 100)
    private String tenantCode;

    @Column(name = "component_name", nullable = false, length = 120)
    private String componentName;

    @Column(name = "component_key", nullable = false, length = 120)
    private String componentKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "component_type", nullable = false, length = 20)
    private EmployeeSalaryComponent.ComponentType componentType;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "source", length = 80)
    private String source;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPayrollId() { return payrollId; }
    public void setPayrollId(Long payrollId) { this.payrollId = payrollId; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }
    public String getComponentName() { return componentName; }
    public void setComponentName(String componentName) { this.componentName = componentName; }
    public String getComponentKey() { return componentKey; }
    public void setComponentKey(String componentKey) { this.componentKey = componentKey; }
    public EmployeeSalaryComponent.ComponentType getComponentType() { return componentType; }
    public void setComponentType(EmployeeSalaryComponent.ComponentType componentType) { this.componentType = componentType; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
