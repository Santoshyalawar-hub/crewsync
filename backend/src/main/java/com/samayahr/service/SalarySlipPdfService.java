package com.samayahr.service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

// ⚠️ DO NOT import com.itextpdf.text.Document here
// It conflicts with com.samayahr.entity.Document (your JPA entity)
// Use com.itextpdf.text.Document fully qualified everywhere below

import com.samayahr.entity.Company;
import com.samayahr.entity.EmployeeBankDetail;
import com.samayahr.entity.EmployeeSalaryDetail;
import com.samayahr.entity.PayrollHistory;
import com.samayahr.entity.SalarySlipSettings;
import com.samayahr.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class SalarySlipPdfService {

    @Autowired
    private CloudinaryService cloudinaryService;

    // ── Fonts ─────────────────────────────────────────────────────────────────
    private static final Font FONT_TITLE   =
            new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD,  BaseColor.WHITE);
    private static final Font FONT_HEADER  =
            new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD,  BaseColor.WHITE);
    private static final Font FONT_SUBHEAD =
            new Font(Font.FontFamily.HELVETICA, 9,  Font.BOLD,  new BaseColor(30, 30, 30));
    private static final Font FONT_BODY    =
            new Font(Font.FontFamily.HELVETICA, 9,  Font.NORMAL, new BaseColor(50, 50, 50));
    private static final Font FONT_BOLD    =
            new Font(Font.FontFamily.HELVETICA, 9,  Font.BOLD,  new BaseColor(30, 30, 30));
    private static final Font FONT_NET     =
            new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD,  new BaseColor(0, 102, 68));
    private static final Font FONT_SMALL   =
            new Font(Font.FontFamily.HELVETICA, 7,  Font.NORMAL, new BaseColor(100, 100, 100));

    private static final BaseColor COLOR_PRIMARY   = new BaseColor(15, 76, 129);
    private static final BaseColor COLOR_SECONDARY = new BaseColor(230, 240, 255);
    private static final BaseColor COLOR_NET_BG    = new BaseColor(220, 255, 235);
    private static final BaseColor COLOR_ROW_ALT   = new BaseColor(248, 250, 253);

    // ── Public entry point ────────────────────────────────────────────────────

    public String generateAndUpload(PayrollHistory payroll,
                                     User employee,
                                     EmployeeSalaryDetail salaryDetail,
                                     EmployeeBankDetail bankDetail,
                                     Company company,
                                     SalarySlipSettings settings,
                                     int year, int month,
                                     int workingDays, int lopDays,
                                     int leaveDays, int halfDays,
                                     double effectiveDays) throws Exception {

        byte[] pdfBytes = buildPdf(payroll, employee, salaryDetail, bankDetail,
                company, settings, year, month,
                workingDays, lopDays, leaveDays, halfDays, effectiveDays);

        String tenantCode = employee.getTenantCode() != null
                ? employee.getTenantCode() : "global";

        String publicId = "payslip_" + employee.getId() + "_"
                + year + "_" + String.format("%02d", month);

        Map<String, Object> options = new HashMap<>();
        options.put("folder",        "hrms/" + tenantCode + "/payslips");
        options.put("public_id",     publicId);
        options.put("resource_type", "raw");
        options.put("overwrite",     true);

        Map<String, Object> uploadResult =
                cloudinaryService.uploadRawBytes(pdfBytes, options);

        return cloudinaryService.getSecureUrl(uploadResult);
    }

    // ── PDF construction ──────────────────────────────────────────────────────

    private byte[] buildPdf(PayrollHistory payroll,
                             User employee,
                             EmployeeSalaryDetail salaryDetail,
                             EmployeeBankDetail bankDetail,
                             Company company,
                             SalarySlipSettings settings,
                             int year, int month,
                             int workingDays, int lopDays,
                             int leaveDays, int halfDays,
                             double effectiveDays) throws Exception {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // ↓ Fully qualified — avoids conflict with com.samayahr.entity.Document
        com.itextpdf.text.Document doc =
                new com.itextpdf.text.Document(PageSize.A4, 36, 36, 36, 36);

        PdfWriter.getInstance(doc, baos);
        doc.open();

        String monthName = java.time.Month.of(month).getDisplayName(
                java.time.format.TextStyle.FULL, java.util.Locale.ENGLISH);
        String slipTitle = (settings.getSlipTitle() != null)
                ? settings.getSlipTitle() : "SALARY SLIP";

        // Section 1: Company Header
        addCompanyHeader(doc, company, settings, slipTitle, monthName, year);
        doc.add(Chunk.NEWLINE);

        // Section 2: Employee Information
        addEmployeeInfo(doc, employee, salaryDetail, bankDetail, settings,
                payroll, monthName, year, workingDays, lopDays,
                leaveDays, halfDays);
        doc.add(Chunk.NEWLINE);

        // Section 3: Attendance Summary
        addAttendanceSummary(doc, workingDays, lopDays, leaveDays,
                halfDays, effectiveDays);
        doc.add(Chunk.NEWLINE);

        // Section 4: Earnings + Deductions
        addEarningsDeductionsTable(doc, payroll, settings);
        doc.add(Chunk.NEWLINE);

        // Section 5: Net Salary box
        addNetSalaryBox(doc, payroll.getNetSalary());
        doc.add(Chunk.NEWLINE);

        // Section 6: Bank Details
        if (bankDetail != null && Boolean.TRUE.equals(settings.getShowBankName())) {
            addBankDetails(doc, bankDetail, settings);
            doc.add(Chunk.NEWLINE);
        }

        // Section 7: Footer
        addFooter(doc, settings);

        doc.close();
        return baos.toByteArray();
    }

    // ── Section 1: Company Header ─────────────────────────────────────────────

    private void addCompanyHeader(com.itextpdf.text.Document doc,
                                   Company company,
                                   SalarySlipSettings settings,
                                   String slipTitle,
                                   String monthName,
                                   int year) throws DocumentException {

        PdfPTable headerTable = new PdfPTable(new float[]{1.5f, 3f});
        headerTable.setWidthPercentage(100);
        headerTable.setSpacingAfter(4);

        // Left cell — Company Logo
        PdfPCell logoCell = new PdfPCell();
        logoCell.setBackgroundColor(COLOR_PRIMARY);
        logoCell.setBorder(Rectangle.NO_BORDER);
        logoCell.setPadding(10);
        logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

        boolean logoAdded = false;

        // Try Company.logoUrl (Cloudinary URL) first
        if (company != null && company.getLogoUrl() != null
                && !company.getLogoUrl().isEmpty()) {
            try {
                Image logo = Image.getInstance(new java.net.URL(company.getLogoUrl()));
                logo.scaleToFit(80, 60);
                logo.setAlignment(Element.ALIGN_CENTER);
                logoCell.addElement(logo);
                logoAdded = true;
            } catch (Exception ignored) { }
        }

        // Fallback — base64 logo from SalarySlipSettings
        if (!logoAdded && settings.getCompanyLogoBase64() != null
                && !settings.getCompanyLogoBase64().isEmpty()) {
            try {
                byte[] imgBytes = java.util.Base64
                        .getDecoder().decode(settings.getCompanyLogoBase64());
                Image logo = Image.getInstance(imgBytes);
                logo.scaleToFit(80, 60);
                logo.setAlignment(Element.ALIGN_CENTER);
                logoCell.addElement(logo);
                logoAdded = true;
            } catch (Exception ignored) { }
        }

        // Fallback — company initials as text
        if (!logoAdded) {
            String initials = company != null && company.getDisplayName() != null
                    ? company.getDisplayName()
                            .substring(0, Math.min(2, company.getDisplayName().length()))
                            .toUpperCase()
                    : "CO";
            Paragraph initialsP = new Paragraph(initials,
                    new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, BaseColor.WHITE));
            initialsP.setAlignment(Element.ALIGN_CENTER);
            logoCell.addElement(initialsP);
        }

        headerTable.addCell(logoCell);

        // Right cell — Company name + slip title
        PdfPCell titleCell = new PdfPCell();
        titleCell.setBackgroundColor(COLOR_PRIMARY);
        titleCell.setBorder(Rectangle.NO_BORDER);
        titleCell.setPadding(12);
        titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

        String companyName = company != null ? company.getDisplayName() : "Company";
        Paragraph compNameP = new Paragraph(companyName,
                new Font(Font.FontFamily.HELVETICA, 13, Font.BOLD, BaseColor.WHITE));
        compNameP.setAlignment(Element.ALIGN_RIGHT);
        titleCell.addElement(compNameP);

        if (company != null && company.getCity() != null) {
            Paragraph addrP = new Paragraph(buildAddressLine(company),
                    new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL,
                            new BaseColor(200, 220, 255)));
            addrP.setAlignment(Element.ALIGN_RIGHT);
            titleCell.addElement(addrP);
        }

        titleCell.addElement(Chunk.NEWLINE);

        Paragraph slipTitleP = new Paragraph(
                slipTitle + " — " + monthName.toUpperCase() + " " + year,
                FONT_TITLE);
        slipTitleP.setAlignment(Element.ALIGN_RIGHT);
        titleCell.addElement(slipTitleP);

        headerTable.addCell(titleCell);
        doc.add(headerTable);
    }

    // ── Section 2: Employee Information ──────────────────────────────────────

    private void addEmployeeInfo(com.itextpdf.text.Document doc,
                                  User employee,
                                  EmployeeSalaryDetail salaryDetail,
                                  EmployeeBankDetail bankDetail,
                                  SalarySlipSettings settings,
                                  PayrollHistory payroll,
                                  String monthName, int year,
                                  int workingDays, int lopDays,
                                  int leaveDays, int halfDays)
            throws DocumentException {

        doc.add(sectionTitle("EMPLOYEE INFORMATION"));

        PdfPTable infoTable = new PdfPTable(new float[]{1f, 1f, 1f, 1f});
        infoTable.setWidthPercentage(100);
        infoTable.setSpacingAfter(4);

        // Row 1
        addInfoCell(infoTable, "Employee Name",  employee.getFullName(), true);

        if (Boolean.TRUE.equals(settings.getShowEmployeeId()))
            addInfoCell(infoTable, "Employee ID",
                    nvl(employee.getEmployeeId(), "—"), false);
        else
            addInfoCell(infoTable, "Email", nvl(employee.getEmail(), "—"), false);

        if (Boolean.TRUE.equals(settings.getShowDepartment()))
            addInfoCell(infoTable, "Department",
                    nvl(employee.getDepartment(), "—"), true);
        else
            addInfoCell(infoTable, "Mobile", nvl(employee.getMobile(), "—"), true);

        if (Boolean.TRUE.equals(settings.getShowDesignation()))
            addInfoCell(infoTable, "Designation",
                    nvl(employee.getPosition(), "—"), false);
        else
            addInfoCell(infoTable, "", "", false);

        // Row 2
        if (Boolean.TRUE.equals(settings.getShowDateOfJoining()))
            addInfoCell(infoTable, "Date of Joining",
                    nvl(employee.getJoiningDate(), "—"), true);
        else
            addInfoCell(infoTable, "", "", true);

        if (Boolean.TRUE.equals(settings.getShowPanNumber()) && salaryDetail != null)
            addInfoCell(infoTable, "PAN",
                    nvl(salaryDetail.getPanNumber(), "—"), false);
        else
            addInfoCell(infoTable, "Pay Period", monthName + " " + year, false);

        if (Boolean.TRUE.equals(settings.getShowUanNumber()) && salaryDetail != null)
            addInfoCell(infoTable, "UAN",
                    nvl(salaryDetail.getPfUan(), "—"), true);
        else
            addInfoCell(infoTable, "Pay Date",
                    java.time.LocalDate.now()
                            .format(DateTimeFormatter.ofPattern("dd MMM yyyy")), true);

        if (Boolean.TRUE.equals(settings.getShowEsiNumber()) && salaryDetail != null)
            addInfoCell(infoTable, "ESI No.",
                    nvl(salaryDetail.getEsiNumber(), "—"), false);
        else
            addInfoCell(infoTable, "Working Days",
                    String.valueOf(workingDays), false);

        doc.add(infoTable);
    }

    // ── Section 3: Attendance Summary ────────────────────────────────────────

    private void addAttendanceSummary(com.itextpdf.text.Document doc,
                                       int workingDays, int lopDays,
                                       int leaveDays, int halfDays,
                                       double effectiveDays)
            throws DocumentException {

        doc.add(sectionTitle("ATTENDANCE SUMMARY"));

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingAfter(4);

        String[] headers = {
            "Working Days", "Present Days", "LOP (Absent)", "Leave Days", "Half Days"
        };
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, FONT_HEADER));
            cell.setBackgroundColor(COLOR_PRIMARY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(7);
            cell.setBorder(Rectangle.NO_BORDER);
            table.addCell(cell);
        }

        int presentDays = (int) Math.round(effectiveDays);
        String[] values = {
            String.valueOf(workingDays),
            String.valueOf(presentDays),
            String.valueOf(lopDays),
            String.valueOf(leaveDays),
            String.valueOf(halfDays)
        };

        boolean alt = false;
        for (String v : values) {
            PdfPCell cell = new PdfPCell(new Phrase(v,
                    new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, COLOR_PRIMARY)));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setPadding(8);
            cell.setBackgroundColor(alt ? COLOR_ROW_ALT : BaseColor.WHITE);
            cell.setBorderColor(new BaseColor(220, 230, 245));
            table.addCell(cell);
            alt = !alt;
        }

        doc.add(table);
    }

    // ── Section 4: Earnings + Deductions ─────────────────────────────────────

    private void addEarningsDeductionsTable(com.itextpdf.text.Document doc,
                                             PayrollHistory payroll,
                                             SalarySlipSettings settings)
            throws DocumentException {

        doc.add(sectionTitle("EARNINGS & DEDUCTIONS"));

        PdfPTable outer = new PdfPTable(2);
        outer.setWidthPercentage(100);
        outer.setWidths(new float[]{1f, 1f});
        outer.setSpacingAfter(4);

        // Left — Earnings
        PdfPTable earningsTable = new PdfPTable(2);
        earningsTable.setWidthPercentage(100);
        addTableSectionHeader(earningsTable, "EARNINGS", 2);

        if (Boolean.TRUE.equals(settings.getShowBasicSalary()))
            addAmountRow(earningsTable, "Basic Salary",
                    payroll.getBasicSalary(), false);
        if (Boolean.TRUE.equals(settings.getShowHra()))
            addAmountRow(earningsTable, "HRA",
                    payroll.getHra(), true);
        if (Boolean.TRUE.equals(settings.getShowSpecialAllowance()))
            addAmountRow(earningsTable, "Special Allowance",
                    payroll.getSpecialAllowance(), false);
        if (Boolean.TRUE.equals(settings.getShowTransportAllowance()))
            addAmountRow(earningsTable, "Transport Allow.",
                    payroll.getConveyanceAllowance(), true);
        if (Boolean.TRUE.equals(settings.getShowMedicalAllowance()))
            addAmountRow(earningsTable, "Medical Allow.",
                    payroll.getMedicalAllowance(), false);
        if (Boolean.TRUE.equals(settings.getShowOtherAllowances()))
            addAmountRow(earningsTable, "Leave Travel Allowance",
                    payroll.getLta(), true);
        if (Boolean.TRUE.equals(settings.getShowOtherAllowances()))
            addAmountRow(earningsTable, "Other Allowances",
                    payroll.getOtherAllowances(), false);

        addTotalRow(earningsTable, "Total Earnings", payroll.getTotalEarnings());

        PdfPCell earningsCell = new PdfPCell();
        earningsCell.addElement(earningsTable);
        earningsCell.setBorder(Rectangle.NO_BORDER);
        earningsCell.setPaddingRight(4);
        outer.addCell(earningsCell);

        // Right — Deductions
        PdfPTable deductionsTable = new PdfPTable(2);
        deductionsTable.setWidthPercentage(100);
        addTableSectionHeader(deductionsTable, "DEDUCTIONS", 2);

        if (Boolean.TRUE.equals(settings.getShowPfDeduction()))
            addAmountRow(deductionsTable, "PF (Employee)",
                    payroll.getPfEmployee(), false);
        if (Boolean.TRUE.equals(settings.getShowEsiDeduction()))
            addAmountRow(deductionsTable, "ESI (Employee)",
                    payroll.getEsiEmployee(), true);
        if (Boolean.TRUE.equals(settings.getShowProfessionalTax()))
            addAmountRow(deductionsTable, "Professional Tax",
                    payroll.getProfessionalTax(), false);
        if (Boolean.TRUE.equals(settings.getShowTds()))
            addAmountRow(deductionsTable, "TDS / Income Tax",
                    payroll.getTaxDeductions(), true);
        if (Boolean.TRUE.equals(settings.getShowOtherDeductions()))
            addAmountRow(deductionsTable, "Other Deductions",
                    payroll.getOtherDeductions(), false);

        // LOP line — always shown if LOP days > 0
        if (payroll.getLopDays() != null && payroll.getLopDays() > 0) {
            addAmountRow(deductionsTable,
                    "LOP (" + payroll.getLopDays() + " days)",
                    payroll.getTotalEarnings()
                            .subtract(payroll.getNetSalary())
                            .subtract(payroll.getTotalDeductions())
                            .abs(),
                    true);
        }

        addTotalRow(deductionsTable, "Total Deductions",
                payroll.getTotalDeductions());

        PdfPCell deductionsCell = new PdfPCell();
        deductionsCell.addElement(deductionsTable);
        deductionsCell.setBorder(Rectangle.NO_BORDER);
        deductionsCell.setPaddingLeft(4);
        outer.addCell(deductionsCell);

        doc.add(outer);
    }

    // ── Section 5: Net Salary box ─────────────────────────────────────────────

    private void addNetSalaryBox(com.itextpdf.text.Document doc,
                                  BigDecimal netSalary)
            throws DocumentException {

        PdfPTable netTable = new PdfPTable(1);
        netTable.setWidthPercentage(100);
        netTable.setSpacingAfter(4);

        PdfPCell netCell = new PdfPCell();
        netCell.setBackgroundColor(COLOR_NET_BG);
        netCell.setBorderColor(new BaseColor(0, 153, 102));
        netCell.setBorderWidth(1.5f);
        netCell.setPadding(12);
        netCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph netLabel = new Paragraph("NET TAKE HOME SALARY",
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD,
                        new BaseColor(0, 102, 68)));
        netLabel.setAlignment(Element.ALIGN_CENTER);
        netCell.addElement(netLabel);

        Paragraph netAmt = new Paragraph(
                "₹ " + formatAmount(netSalary), FONT_NET);
        netAmt.setAlignment(Element.ALIGN_CENTER);
        netCell.addElement(netAmt);

        Paragraph inWords = new Paragraph(
                "(" + toWords(netSalary) + " Only)", FONT_SMALL);
        inWords.setAlignment(Element.ALIGN_CENTER);
        netCell.addElement(inWords);

        netTable.addCell(netCell);
        doc.add(netTable);
    }

    // ── Section 6: Bank Details ───────────────────────────────────────────────

    private void addBankDetails(com.itextpdf.text.Document doc,
                                 EmployeeBankDetail bank,
                                 SalarySlipSettings settings)
            throws DocumentException {

        doc.add(sectionTitle("BANK DETAILS"));

        PdfPTable table = new PdfPTable(new float[]{1f, 1f, 1f, 1f});
        table.setWidthPercentage(100);
        table.setSpacingAfter(4);

        if (Boolean.TRUE.equals(settings.getShowBankName()))
            addInfoCell(table, "Bank Name",
                    nvl(bank.getBankName(), "—"), true);
        if (Boolean.TRUE.equals(settings.getShowAccountNumber()))
            addInfoCell(table, "Account No.",
                    maskAccountNumber(bank.getAccountNumber()), false);

        addInfoCell(table, "IFSC Code",
                nvl(bank.getIfscCode(), "—"), true);
        addInfoCell(table, "Account Type",
                bank.getAccountType() != null
                        ? bank.getAccountType().name() : "—", false);

        doc.add(table);
    }

    // ── Section 7: Footer ─────────────────────────────────────────────────────

    private void addFooter(com.itextpdf.text.Document doc,
                            SalarySlipSettings settings)
            throws DocumentException {

        String footerText = settings.getFooterNote() != null
                ? settings.getFooterNote()
                : "This is a computer-generated salary slip and does not require a signature.";

        PdfPTable footerTable = new PdfPTable(1);
        footerTable.setWidthPercentage(100);

        PdfPCell footerCell = new PdfPCell(new Phrase(footerText, FONT_SMALL));
        footerCell.setBackgroundColor(COLOR_SECONDARY);
        footerCell.setBorder(Rectangle.NO_BORDER);
        footerCell.setPadding(8);
        footerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        footerTable.addCell(footerCell);

        doc.add(footerTable);
    }

    // ── Cell / table helpers ──────────────────────────────────────────────────

    private Paragraph sectionTitle(String text) {
        Paragraph p = new Paragraph(text,
                new Font(Font.FontFamily.HELVETICA, 9, Font.BOLD, COLOR_PRIMARY));
        p.setSpacingBefore(4);
        p.setSpacingAfter(2);
        return p;
    }

    private void addInfoCell(PdfPTable table, String label,
                              String value, boolean alt) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(alt ? COLOR_ROW_ALT : BaseColor.WHITE);
        cell.setBorderColor(new BaseColor(220, 230, 245));
        cell.setPadding(6);

        Paragraph lp = new Paragraph(label, FONT_SMALL);
        lp.setSpacingAfter(1);
        cell.addElement(lp);
        cell.addElement(new Paragraph(value, FONT_BOLD));
        table.addCell(cell);
    }

    private void addTableSectionHeader(PdfPTable table,
                                        String title, int colspan) {
        PdfPCell cell = new PdfPCell(new Phrase(title, FONT_HEADER));
        cell.setColspan(colspan);
        cell.setBackgroundColor(COLOR_PRIMARY);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(6);
        cell.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell);
    }

    private void addAmountRow(PdfPTable table, String label,
                               BigDecimal amount, boolean alt) {
        BaseColor bg = alt ? COLOR_ROW_ALT : BaseColor.WHITE;

        PdfPCell labelCell = new PdfPCell(new Phrase(label, FONT_BODY));
        labelCell.setBackgroundColor(bg);
        labelCell.setPadding(5);
        labelCell.setBorderColor(new BaseColor(230, 235, 245));
        table.addCell(labelCell);

        PdfPCell amtCell = new PdfPCell(
                new Phrase("₹ " + formatAmount(amount), FONT_BODY));
        amtCell.setBackgroundColor(bg);
        amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        amtCell.setPadding(5);
        amtCell.setBorderColor(new BaseColor(230, 235, 245));
        table.addCell(amtCell);
    }

    private void addTotalRow(PdfPTable table, String label, BigDecimal amount) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, FONT_BOLD));
        labelCell.setBackgroundColor(COLOR_SECONDARY);
        labelCell.setPadding(6);
        labelCell.setBorderColor(COLOR_PRIMARY);
        table.addCell(labelCell);

        PdfPCell amtCell = new PdfPCell(
                new Phrase("₹ " + formatAmount(amount), FONT_BOLD));
        amtCell.setBackgroundColor(COLOR_SECONDARY);
        amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        amtCell.setPadding(6);
        amtCell.setBorderColor(COLOR_PRIMARY);
        table.addCell(amtCell);
    }

    // ── Formatting utilities ──────────────────────────────────────────────────

    private String formatAmount(BigDecimal amount) {
        if (amount == null) return "0.00";
        return String.format("%,.2f", amount);
    }

    private String maskAccountNumber(String accNo) {
        if (accNo == null || accNo.length() < 4) return "XXXX";
        return "XXXX XXXX " + accNo.substring(accNo.length() - 4);
    }

    private String nvl(String v, String def) {
        return (v != null && !v.trim().isEmpty()) ? v.trim() : def;
    }

    private String buildAddressLine(Company company) {
        StringBuilder sb = new StringBuilder();
        if (company.getCity()    != null) sb.append(company.getCity()).append(", ");
        if (company.getState()   != null) sb.append(company.getState()).append(", ");
        if (company.getCountry() != null) sb.append(company.getCountry());
        return sb.toString();
    }

    private String toWords(BigDecimal amount) {
        if (amount == null) return "Zero";
        long val = amount.setScale(0, RoundingMode.HALF_UP).longValue();
        if (val == 0) return "Zero";
        String[] ones = {"", "One", "Two", "Three", "Four", "Five", "Six",
                "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
                "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
                "Eighteen", "Nineteen"};
        String[] tens = {"", "", "Twenty", "Thirty", "Forty", "Fifty",
                "Sixty", "Seventy", "Eighty", "Ninety"};
        if (val < 20)   return ones[(int) val];
        if (val < 100)  return tens[(int)(val / 10)]
                + (val % 10 != 0 ? " " + ones[(int)(val % 10)] : "");
        if (val < 1000) return ones[(int)(val / 100)] + " Hundred"
                + (val % 100 != 0
                        ? " " + toWords(BigDecimal.valueOf(val % 100)) : "");
        if (val < 100000) return toWords(BigDecimal.valueOf(val / 1000))
                + " Thousand"
                + (val % 1000 != 0
                        ? " " + toWords(BigDecimal.valueOf(val % 1000)) : "");
        if (val < 10000000) return toWords(BigDecimal.valueOf(val / 100000))
                + " Lakh"
                + (val % 100000 != 0
                        ? " " + toWords(BigDecimal.valueOf(val % 100000)) : "");
        return toWords(BigDecimal.valueOf(val / 10000000))
                + " Crore"
                + (val % 10000000 != 0
                        ? " " + toWords(BigDecimal.valueOf(val % 10000000)) : "");
    }
}
