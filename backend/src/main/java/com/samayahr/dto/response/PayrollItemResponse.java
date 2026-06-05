package com.samayahr.dto.response;

import java.math.BigDecimal;

public class PayrollItemResponse {
    private String name;
    private String key;
    private String type;
    private BigDecimal amount;

    public PayrollItemResponse() {
    }

    public PayrollItemResponse(String name, String key, String type, BigDecimal amount) {
        this.name = name;
        this.key = key;
        this.type = type;
        this.amount = amount;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
