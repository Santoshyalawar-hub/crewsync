package com.samayahr.dto.request;

public class BankDetailRequest {

    private String bankName;
    private String accountHolderName;
    private String accountNumber;
    private String confirmAccountNumber;
    private String ifscCode;
    private String branchName;
    private String branchAddress;
    private String accountType;       // SAVINGS | CURRENT | SALARY
    private String micrCode;
    private String swiftCode;
    private String proofDocumentType; // CANCELLED_CHEQUE | PASSBOOK | BANK_STATEMENT

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getConfirmAccountNumber() { return confirmAccountNumber; }
    public void setConfirmAccountNumber(String confirmAccountNumber) { this.confirmAccountNumber = confirmAccountNumber; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getBranchAddress() { return branchAddress; }
    public void setBranchAddress(String branchAddress) { this.branchAddress = branchAddress; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getMicrCode() { return micrCode; }
    public void setMicrCode(String micrCode) { this.micrCode = micrCode; }

    public String getSwiftCode() { return swiftCode; }
    public void setSwiftCode(String swiftCode) { this.swiftCode = swiftCode; }

    public String getProofDocumentType() { return proofDocumentType; }
    public void setProofDocumentType(String proofDocumentType) { this.proofDocumentType = proofDocumentType; }
}