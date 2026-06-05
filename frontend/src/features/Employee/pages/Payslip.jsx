import React, { useState, useEffect, useRef } from "react";
import {
  Download, FileText, Loader2, AlertCircle, CheckCircle,
  TrendingDown, TrendingUp, Calendar, ChevronLeft, ChevronRight,
} from "lucide-react";
import api from "@/lib/apiClient";
const fmt = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const bool = (v) => v === true || v === "true";
const normalizePayrollRows = (rows, fallback) => {
  if (Array.isArray(rows) && rows.length > 0) {
    return rows
      .filter((row) => Number(row?.amount || 0) > 0)
      .map((row) => ({
        label: row?.name || row?.label || row?.key || "Component",
        value: row?.amount,
      }));
  }
  return fallback;
};

const S = {
  card: { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  btn: (bg, color = "#fff") => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 9,
    background: bg,
    color,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "opacity 0.15s",
  }),
};

const toMonthValue = (value) => {
  if (!value) return "";
  const raw = String(value);
  const iso = raw.match(/^(\d{4})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}`;
  const d = new Date(raw);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function Payslip() {
  const tenantCode = localStorage.getItem("tenantCode") || "";
  const userId = localStorage.getItem("userId") || "";

  const today = new Date();
  const defMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const [month, setMonth] = useState(defMonth);
  const [company, setCompany] = useState(null);
  const [settings, setSettings] = useState(null);
  const [allPayrolls, setAllPayrolls] = useState([]);
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metaErr, setMetaErr] = useState(null);
  const [slipErr, setSlipErr] = useState(null);
  const slipRef = useRef(null);

  useEffect(() => {
    if (!tenantCode) {
      setMetaErr("Tenant code not found. Please re-login.");
      return;
    }
    Promise.all([
      api.get(`/api/global-admin/companies/by-tenant/${tenantCode}`).then((r) => r.data).catch(() => ({})),
      api.get(`/api/salary-slip-settings/${tenantCode}`).then((r) => r.data).catch(() => ({})),
    ])
      .then(([cData, sData]) => {
        if (cData.success) setCompany(cData.data);
        if (sData.success) setSettings(sData.data);
      })
      .catch((e) => setMetaErr("Could not load company info: " + e.message));
  }, [tenantCode]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setMetaErr("User ID not found. Please re-login.");
      return;
    }

    setLoading(true);
    setSlipErr(null);

    api.get(`/api/payroll/user/${userId}`)
      .then((r) => {
        const data = r.data;
        if (data?.success === false) {
          throw new Error(data?.message || `Failed to load payrolls`);
        }
        const list = Array.isArray(data?.data) ? data.data : [];
        const sorted = [...list].sort((a, b) => new Date(b.payrollMonth || 0) - new Date(a.payrollMonth || 0));
        setAllPayrolls(sorted);
      })
      .catch((e) => {
        setAllPayrolls([]);
        setSlipErr("Failed to load payslip: " + e.message);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!allPayrolls.length) {
      setPayslip(null);
      return;
    }

    const matched = allPayrolls.find((item) => toMonthValue(item.payrollMonth || item.payPeriod) === month);
    setPayslip(matched || null);
    setSlipErr(matched ? null : "No payslip found for this month.");
  }, [allPayrolls, month]);

  const changeMonth = (dir) => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const handleDownload = () => {
    const pdfUrl = payslip?.payslipPath || payslip?.payslipUrl;
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (!slipRef.current) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Salary Slip - ${month}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; font-size: 13px; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${slipRef.current.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const s = settings || {};
  const c = company || {};
  const p = payslip || {};
  const showAll = !settings || Object.keys(s).length === 0;

  const fallbackEarningsRows = [
    { show: showAll || bool(s.showBasicSalary),        label: "Basic Salary",         value: p.basicSalary         },
    { show: showAll || bool(s.showHra),                label: "House Rent Allowance", value: p.hra                 },
    { show: showAll || bool(s.showSpecialAllowance),   label: "Special Allowance",    value: p.specialAllowance    },
    { show: showAll || bool(s.showTransportAllowance), label: "Transport Allowance",  value: p.conveyanceAllowance },
    { show: showAll || bool(s.showMedicalAllowance),   label: "Medical Allowance",    value: p.medicalAllowance    },
    { show: showAll || bool(s.showOtherAllowances),    label: "Other Allowances",     value: p.otherAllowances     },
  ].filter((r) => r.show && Number(r.value || 0) > 0);

  const fallbackDeductionRows = [
    { show: showAll || bool(s.showPfDeduction),     label: "Provident Fund (PF)", value: p.pfEmployee      },
    { show: showAll || bool(s.showEsiDeduction),    label: "ESI",                  value: p.esiEmployee     },
    { show: showAll || bool(s.showProfessionalTax), label: "Professional Tax",     value: p.professionalTax },
    { show: showAll || bool(s.showTds),             label: "TDS",                  value: p.taxDeductions   },
    { show: showAll || bool(s.showOtherDeductions), label: "Other Deductions",     value: p.otherDeductions },
  ].filter((r) => r.show && Number(r.value || 0) > 0);

  const earningsRows = normalizePayrollRows(p.earnings, fallbackEarningsRows);
  const deductionRows = normalizePayrollRows(p.deductions, fallbackDeductionRows);

  const totalEarnings = Number(p.totalEarnings || earningsRows.reduce((sum, r) => sum + Number(r.value || 0), 0));
  const totalDeductions = Number(p.totalDeductions || deductionRows.reduce((sum, r) => sum + Number(r.value || 0), 0));
  const netPay = p.netSalary != null ? Number(p.netSalary) : totalEarnings - totalDeductions;
  const monthLabel = new Date(`${month}-02`).toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 40 }}>
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)", borderRadius: 18, padding: "22px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,107,53,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 5px" }}>Finance Hub</p>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: 0 }}>My Payslips</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "5px 0 0" }}>Download your monthly salary statements</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => changeMonth(-1)} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft style={{ width: 15, height: 15 }} />
            </button>
            <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar style={{ width: 14, height: 14, color: "#ff6b35" }} />
              <input
                type="month"
                value={month}
                max={defMonth}
                onChange={(e) => setMonth(e.target.value)}
                style={{ background: "transparent", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, outline: "none", cursor: "pointer" }}
              />
            </div>
            <button onClick={() => changeMonth(1)} disabled={month >= defMonth} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: month >= defMonth ? 0.3 : 1 }}>
              <ChevronRight style={{ width: 15, height: 15 }} />
            </button>
            <button
              onClick={handleDownload}
              disabled={!payslip || loading}
              style={{ ...S.btn("#ff6b35"), padding: "9px 18px", borderRadius: 10, boxShadow: "0 4px 12px rgba(255,107,53,0.35)", opacity: (!payslip || loading) ? 0.5 : 1 }}
            >
              <Download style={{ width: 15, height: 15 }} /> Download
            </button>
          </div>
        </div>
      </div>

      {metaErr && (
        <div style={{ ...S.card, padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, borderLeft: "4px solid #ef4444" }}>
          <AlertCircle style={{ width: 18, height: 18, color: "#ef4444", flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 13, color: "#1e293b" }}>{metaErr}</p>
        </div>
      )}

      {loading && (
        <div style={{ ...S.card, padding: "48px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} />
          Loading payslip for {monthLabel}...
        </div>
      )}

      {slipErr && !loading && (
        <div style={{ ...S.card, padding: "48px 0", textAlign: "center" }}>
          <FileText style={{ width: 36, height: 36, color: "#e2e8f0", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", margin: 0 }}>No payslip found</p>
          <p style={{ fontSize: 12, color: "#cbd5e1", margin: "6px 0 0" }}>{slipErr}</p>
        </div>
      )}

      {payslip && !loading && (
        <div ref={slipRef}>
          <div style={{ ...S.card, overflow: "hidden", maxWidth: 860, margin: "0 auto" }}>
            <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "22px 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {s.companyLogoBase64
                  ? <img
                      src={`data:${s.logoMediaType || "image/png"};base64,${s.companyLogoBase64}`}
                      alt="company logo"
                      style={{ height: 52, maxWidth: 120, objectFit: "contain", borderRadius: 8, background: "#fff", padding: 4 }}
                    />
                  : <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(135deg, #ff6b35, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 22 }}>
                      {(c.displayName || "C").charAt(0)}
                    </div>
                }
                <div>
                  <p style={{ color: "#fff", fontWeight: 800, fontSize: 18, margin: 0 }}>{c.displayName || c.legalName || "Company"}</p>
                  {[c.address, c.city, c.state, c.pincode].filter(Boolean).length > 0 && (
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: "3px 0 0" }}>
                      {[c.address, c.city, c.state, c.pincode].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {(c.officialEmail || c.phoneNumber) && (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: "2px 0 0" }}>
                      {[c.officialEmail, c.phoneNumber].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#ff6b35", fontWeight: 800, fontSize: 15, margin: 0, letterSpacing: "0.08em" }}>
                  {s.slipTitle || "SALARY SLIP"}
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "4px 0 0" }}>{monthLabel}</p>
                {p.paymentDate && (
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: "3px 0 0" }}>Paid on: {p.paymentDate}</p>
                )}
              </div>
            </div>

            <div style={{ padding: "18px 30px", background: "#f8fafc", borderBottom: "1px solid #eef0f4" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px 20px" }}>
                <InfoCell label="Employee Name" value={p.employeeName} />
                {(showAll || bool(s.showEmployeeId)) && <InfoCell label="Employee ID" value={p.employeeId} />}
                {(showAll || bool(s.showDepartment)) && <InfoCell label="Department" value={p.department} />}
                {(showAll || bool(s.showDesignation)) && <InfoCell label="Designation" value={p.designation} />}
                {(showAll || bool(s.showDateOfJoining)) && <InfoCell label="Date of Joining" value={p.dateOfJoining || p.joiningDate} />}
                {(showAll || bool(s.showPanNumber)) && <InfoCell label="PAN Number" value={p.panNumber} />}
                {(showAll || bool(s.showUanNumber)) && <InfoCell label="UAN Number" value={p.uanNumber} />}
                {(showAll || bool(s.showPfNumber)) && <InfoCell label="PF Number" value={p.pfNumber} />}
                {(showAll || bool(s.showEsiNumber)) && <InfoCell label="ESI Number" value={p.esiNumber} />}
                {(showAll || bool(s.showBankName)) && <InfoCell label="Bank Name" value={p.bankName} />}
                {(showAll || bool(s.showAccountNumber)) && <InfoCell label="Account Number" value={p.accountNumber} />}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ borderRight: "1px solid #eef0f4" }}>
                <div style={{ background: "#f0fdf4", padding: "10px 20px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid #dcfce7" }}>
                  <TrendingUp style={{ width: 13, height: 13, color: "#16a34a" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Earnings</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <th style={{ padding: "8px 20px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textAlign: "left", textTransform: "uppercase" }}>Component</th>
                      <th style={{ padding: "8px 20px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textAlign: "right", textTransform: "uppercase" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningsRows.map(({ label, value }) => (
                      <tr key={label} style={{ borderBottom: "1px solid #f8fafc" }}>
                        <td style={{ padding: "9px 20px", fontSize: 13, color: "#334155" }}>{label}</td>
                        <td style={{ padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "#1e293b", textAlign: "right" }}>{fmt(value)}</td>
                      </tr>
                    ))}
                    {earningsRows.length === 0 && (
                      <tr><td colSpan={2} style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "#94a3b8" }}>No earnings configured</td></tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#f0fdf4", borderTop: "2px solid #bbf7d0" }}>
                      <td style={{ padding: "11px 20px", fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Total Earnings</td>
                      <td style={{ padding: "11px 20px", fontSize: 13, fontWeight: 800, color: "#16a34a", textAlign: "right" }}>{fmt(totalEarnings)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div>
                <div style={{ background: "#fef2f2", padding: "10px 20px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid #fecaca" }}>
                  <TrendingDown style={{ width: 13, height: 13, color: "#dc2626" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.06em" }}>Deductions</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <th style={{ padding: "8px 20px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textAlign: "left", textTransform: "uppercase" }}>Component</th>
                      <th style={{ padding: "8px 20px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textAlign: "right", textTransform: "uppercase" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deductionRows.map(({ label, value }) => (
                      <tr key={label} style={{ borderBottom: "1px solid #f8fafc" }}>
                        <td style={{ padding: "9px 20px", fontSize: 13, color: "#334155" }}>{label}</td>
                        <td style={{ padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "#1e293b", textAlign: "right" }}>{fmt(value)}</td>
                      </tr>
                    ))}
                    {deductionRows.length === 0 && (
                      <tr><td colSpan={2} style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "#94a3b8" }}>No deductions configured</td></tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#fef2f2", borderTop: "2px solid #fecaca" }}>
                      <td style={{ padding: "11px 20px", fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Total Deductions</td>
                      <td style={{ padding: "11px 20px", fontSize: 13, fontWeight: 800, color: "#dc2626", textAlign: "right" }}>{fmt(totalDeductions)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "18px 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Net Pay (Take Home)</p>
                <p style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: "4px 0 0", letterSpacing: "-0.02em" }}>{fmt(netPay)}</p>
              </div>
              <div style={{ display: "flex", gap: 20, textAlign: "right" }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", margin: 0 }}>Gross Salary</p>
                  <p style={{ color: "#22c55e", fontSize: 14, fontWeight: 700, margin: "2px 0 0" }}>{fmt(totalEarnings)}</p>
                </div>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", margin: 0 }}>Total Deductions</p>
                  <p style={{ color: "#f87171", fontSize: 14, fontWeight: 700, margin: "2px 0 0" }}>{fmt(totalDeductions)}</p>
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 30px", background: "#f8fafc", borderTop: "1px solid #eef0f4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, fontStyle: "italic" }}>
                {s.footerNote || "This is a computer-generated salary slip and does not require a signature."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <CheckCircle style={{ width: 11, height: 11, color: "#22c55e" }} />
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Verified · {c.tenantCode || tenantCode}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "3px 0 0" }}>{value || "—"}</p>
    </div>
  );
}
