import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Download, Eye, X, CheckCircle, TrendingUp, TrendingDown,
  Loader2, AlertCircle, Calendar, FileText,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "@/lib/apiClient";

/*
  FinanceHub — Fixed & Complete
  ─────────────────────────────────────────────────────────────────────────────
  FIXES in this version:
  1. tenantCode, companyName, employeeId now read from localStorage
     (Login.jsx must store them for EMPLOYEE role — see comment below)
  2. Company name + logo used from API; falls back to localStorage companyName
  3. Year parsing handles all formats: "2025-03", "March 2025", "Mar-2025" etc.
  4. Uses original payroll API: GET /api/payroll/user/{userId}
  5. PDF uses real company logo (base64) + real company name from settings/company API

  LOGIN.JSX FIX — add these lines inside the employee login success block:
    localStorage.setItem("tenantCode",  data.data?.tenantCode  || "");
    localStorage.setItem("companyId",   String(data.data?.companyId || ""));
    localStorage.setItem("companyName", data.data?.companyName || "");
    localStorage.setItem("employeeId",  data.data?.employeeId  || "");
*/

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const fmt      = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const rupeeFmt = (n) => "Rs." + Number(n || 0).toFixed(2);
const bool     = (v) => v === true || v === "true";
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

const formatDate = (s) => {
  if (!s) return "N/A";
  try {
    const d = new Date(s);
    if (isNaN(d)) return String(s);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  } catch { return String(s); }
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Robust month index extractor — handles ALL formats including full dates
const getMonthIndex = (str) => {
  if (!str) return -1;
  const s = String(str).trim();

  // "2026-03-06" full date — extract month from position
  const fullDate = s.match(/^\d{4}-(\d{1,2})-\d{1,2}$/);
  if (fullDate) return parseInt(fullDate[1], 10) - 1;

  // "2025-03" or "2025-3"
  const dashYM = s.match(/^\d{4}-(\d{1,2})$/);
  if (dashYM) return parseInt(dashYM[1], 10) - 1;

  // "03-2025" or "3-2025"
  const dashMY = s.match(/^(\d{1,2})-\d{4}$/);
  if (dashMY) return parseInt(dashMY[1], 10) - 1;

  // "03/2025" or "3/2025"
  const slashMY = s.match(/^(\d{1,2})\/\d{4}$/);
  if (slashMY) return parseInt(slashMY[1], 10) - 1;

  // ISO full date via Date object as fallback
  try {
    const d = new Date(s);
    if (!isNaN(d)) return d.getMonth();
  } catch {}

  // "March 2025", "march-2025", "Mar 2025", etc.
  for (let i = 0; i < MONTH_NAMES.length; i++) {
    const full  = MONTH_NAMES[i].toLowerCase();
    const short = full.slice(0, 3);
    const sl    = s.toLowerCase();
    if (sl.includes(full) || sl.includes(short)) return i;
  }

  return -1;
};

// Extract 4-digit year from any string
const getYear = (str) => {
  const m = String(str || "").match(/\d{4}/);
  return m ? parseInt(m[0], 10) : null;
};

const getName = (p) => p?.employeeName || p?.employee?.name || p?.userName || "Employee";
const getId   = (p) => String(p?.employeeId || p?.employee?.id || p?.userId || "—");

const numberToWords = (n) => {
  if (!n || n === 0) return "Zero Only";
  const ones  = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
  const tens  = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const teens = ["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const cr=Math.floor(n/10000000), lk=Math.floor((n%10000000)/100000),
        th=Math.floor((n%100000)/1000), hu=Math.floor((n%1000)/100), rem=n%100;
  let w="";
  if (cr)  w += numberToWords(cr) + " Crore ";
  if (lk)  w += numberToWords(lk) + " Lakh ";
  if (th)  w += numberToWords(th) + " Thousand ";
  if (hu)  w += ones[hu] + " Hundred ";
  if (rem > 0) {
    if (rem < 10)      w += ones[rem];
    else if (rem < 20) w += teens[rem - 10];
    else { w += tens[Math.floor(rem/10)]; if (rem%10 > 0) w += " " + ones[rem%10]; }
  }
  return w.trim() + " Only";
};

/* ── Card style ──────────────────────────────────────────────────────────── */
const cardStyle = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #eef0f4",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function FinanceHub() {

  // ── Read all keys from localStorage (set by Login.jsx on login) ──────────
  const userId        = (() => { try { return JSON.parse(localStorage.getItem("userId")) || localStorage.getItem("userId") || ""; } catch { return localStorage.getItem("userId") || ""; } })();
  const tenantCode    = localStorage.getItem("tenantCode")  || "";
  const lsCompanyName = localStorage.getItem("companyName") || "";

  const [allPayrolls,  setAllPayrolls]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [company,      setCompany]      = useState(null);
  const [settings,     setSettings]     = useState(null);

  // ✅ FIX: null means "wait for data" — never default to current year
  const [selectedYear, setSelectedYear] = useState(null);

  const [viewPayroll,  setViewPayroll]  = useState(null);
  const [dlLoading,    setDlLoading]    = useState(null);

  /* ── 1. Fetch payrolls — original working API ────────────────────────── */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User ID not found. Please re-login.");
      return;
    }
    const doFetch = () =>
      api.get(`/api/payroll/user/${userId}`)
        .then(r => {
          const d = r.data;
          const list = Array.isArray(d.data) ? d.data : (d.data ? [d.data] : []);
          setAllPayrolls(list);
          const dataYears = [...new Set(list.map(p => getYear(p.payrollMonth)).filter(Boolean))].sort((a,b)=>b-a);
          if (dataYears.length > 0) setSelectedYear(dataYears[0]);
          else setSelectedYear(new Date().getFullYear());
          setLoading(false);
        });
    doFetch().catch(e => { setError("Failed to load payrolls: " + e.message); setLoading(false); });
  }, [userId]);

  /* ── 2. Fetch company details + slip settings (non-fatal) ────────────── */
  useEffect(() => {
    if (!tenantCode) return;
    Promise.all([
      api.get(`/api/global-admin/companies/by-tenant/${tenantCode}`).then(r => r.data).catch(() => ({})),
      api.get(`/api/salary-slip-settings/${tenantCode}`).then(r => r.data).catch(() => ({})),
    ]).then(([cData, sData]) => {
      if (cData?.success && cData?.data) setCompany(cData.data);
      if (sData?.success && sData?.data) setSettings(sData.data);
    });
  }, [tenantCode]);

  /* ── Derived ─────────────────────────────────────────────────────────── */
  // ✅ Years = current year always included + all years from actual data, sorted descending
  const currentYear = new Date().getFullYear();
  const years = [...new Set([currentYear, ...allPayrolls.map(p => getYear(p.payrollMonth)).filter(Boolean)])].sort((a,b)=>b-a);

  // ✅ FIX: effectiveYear always resolves to a real year with data
  const effectiveYear = selectedYear ?? years[0] ?? new Date().getFullYear();

  const payrollByMonth = {};
  allPayrolls
    .filter(p => getYear(p.payrollMonth) === effectiveYear)
    .forEach(p => {
      const mi = getMonthIndex(p.payrollMonth);
      if (mi >= 0) payrollByMonth[mi] = p;
    });

  const yearPayrolls = Object.values(payrollByMonth);
  const totalNet = yearPayrolls.reduce((s, p) => s + ((p.totalEarnings||0) - (p.totalDeductions||0)), 0);

  // Resolved company name: API > localStorage > fallback
  const resolvedCompanyName = company?.displayName || company?.legalName || lsCompanyName || "Company";

  /* ── PDF Download ────────────────────────────────────────────────────── */
  const downloadPDF = (p) => {
    const key = p.id || p.payrollMonth;
    setDlLoading(key);
    const doGen = () => { generatePDF(p, company, settings, lsCompanyName); setDlLoading(null); };
    if (typeof window.jspdf === "undefined") {
      const s1 = document.createElement("script");
      s1.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s1.onload = () => {
        const s2 = document.createElement("script");
        s2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js";
        s2.onload = doGen;
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    } else { doGen(); }
  };

  const s = settings || {};
  const c = company  || {};

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", paddingBottom: 48 }}>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div style={{ background:"linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)", borderRadius:18, padding:"22px 28px", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:60, width:140, height:140, borderRadius:"50%", background:"rgba(255,107,53,0.08)", pointerEvents:"none" }}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 5px" }}>Finance Hub</p>
            <h1 style={{ color:"#fff", fontSize:22, fontWeight:800, margin:0 }}>My Payslips</h1>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, margin:"5px 0 0" }}>View and download your monthly salary statements</p>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            {/* ✅ Year dropdown — only renders after data loads, only shows years that have actual data */}
            {!loading && years.length > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 14px" }}>
                <Calendar style={{ width:14, height:14, color:"#ff6b35" }}/>
                <label style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600 }}>Year</label>
                <select
                  value={effectiveYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                  style={{ background:"transparent", border:"none", color:"#fff", fontSize:14, fontWeight:700, outline:"none", cursor:"pointer" }}
                >
                  {years.map(y => (
                    <option key={y} value={y} style={{ background:"#1e293b", color:"#fff" }}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Stats */}
            {yearPayrolls.length > 0 && (
              <>
                <Chip label="Payslips" value={yearPayrolls.length} color="#ff6b35"/>
                <Chip label="Total Net" value={fmt(totalNet)} color="#22c55e"/>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ ...cardStyle, padding:"52px 0", textAlign:"center", color:"#94a3b8", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <Loader2 style={{ width:20, height:20, animation:"spin 1s linear infinite" }}/> Loading payslips…
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && !loading && (
        <div style={{ ...cardStyle, padding:"22px 24px", display:"flex", alignItems:"center", gap:14, borderLeft:"4px solid #ef4444" }}>
          <AlertCircle style={{ width:18, height:18, color:"#ef4444", flexShrink:0 }}/>
          <div>
            <p style={{ margin:0, fontWeight:700, color:"#1e293b", fontSize:13 }}>{error}</p>
            <p style={{ margin:"4px 0 0", fontSize:12, color:"#94a3b8" }}>Check that your userId is stored correctly in localStorage.</p>
          </div>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div style={{ ...cardStyle, overflow:"hidden" }}>

          {/* Table header bar */}
          <div style={{ padding:"14px 22px", borderBottom:"1px solid #eef0f4", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#0f172a" }}>
              Payslip History — {effectiveYear}
            </p>
            <span style={{ fontSize:11, fontWeight:600, color:"#94a3b8" }}>
              {yearPayrolls.length} / 12 months processed
            </span>
          </div>

          {/* No payrolls */}
          {yearPayrolls.length === 0 ? (
            <div style={{ padding:"70px 0", textAlign:"center" }}>
              <FileText style={{ width:38, height:38, color:"#e2e8f0", margin:"0 auto 14px" }}/>
              <p style={{ fontSize:15, fontWeight:700, color:"#94a3b8", margin:0 }}>No payroll for {effectiveYear}</p>
              <p style={{ fontSize:12, color:"#cbd5e1", margin:"6px 0 0" }}>
                Payroll has not been processed for any month in {effectiveYear}.
                {years.length > 0 && ` Try selecting ${years[0]}.`}
              </p>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:"#0f172a" }}>
                    {["Month","Employee","Pay Period","Gross Salary","Deductions","Net Pay","Status","Actions"].map(h => (
                      <th key={h} style={{ padding:"11px 18px", textAlign:"left", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* ✅ Only processed months shown, sorted Jan→Dec */}
                  {Object.entries(payrollByMonth)
                    .sort(([a],[b]) => Number(a) - Number(b))
                    .map(([mi, p]) => {
                    const monthName = MONTH_NAMES[Number(mi)];
                    const gross  = p.totalEarnings  ?? ((p.basicSalary||0)+(p.hra||0)+(p.conveyanceAllowance||0)+(p.medicalAllowance||0)+(p.otherAllowances||0));
                    const deduct = p.totalDeductions ?? ((p.taxDeductions||0)+(p.pfEmployee||0)+(p.professionalTax||0)+(p.medicalInsurance||0)+(p.lossOfPay||0));
                    const net    = p.netPay ?? (gross - deduct);
                    const isDownloading = dlLoading === (p.id || p.payrollMonth);

                    return (
                      <tr key={mi}
                        style={{ borderBottom:"1px solid #f1f5f9", transition:"background 0.12s" }}
                        onMouseEnter={e => e.currentTarget.style.background="#fafbfc"}
                        onMouseLeave={e => e.currentTarget.style.background="transparent"}
                      >
                        {/* Month */}
                        <td style={{ padding:"13px 18px" }}>
                          <span style={{ fontWeight:700, color:"#1e293b", display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>
                            {monthName}
                          </span>
                        </td>

                        {/* Employee */}
                        <td style={{ padding:"13px 18px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                            <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#ff6b35,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:12, flexShrink:0 }}>
                              {getName(p).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ margin:0, fontWeight:600, color:"#1e293b", fontSize:12 }}>{getName(p)}</p>
                              <p style={{ margin:0, fontSize:10, color:"#94a3b8" }}>ID: {getId(p)}</p>
                            </div>
                          </div>
                        </td>

                        {/* Pay period */}
                        <td style={{ padding:"13px 18px", fontSize:12, color:"#475569", fontWeight:600 }}>
                          {p.payrollMonth}
                        </td>

                        {/* Gross */}
                        <td style={{ padding:"13px 18px" }}>
                          <span style={{ fontWeight:700, color:"#16a34a", fontSize:13 }}>{fmt(gross)}</span>
                        </td>

                        {/* Deductions */}
                        <td style={{ padding:"13px 18px" }}>
                          <span style={{ fontWeight:700, color:"#dc2626", fontSize:13 }}>{fmt(deduct)}</span>
                        </td>

                        {/* Net Pay */}
                        <td style={{ padding:"13px 18px" }}>
                          <span style={{ fontWeight:800, color:"#0f172a", fontSize:14 }}>{fmt(net)}</span>
                        </td>

                        {/* Status */}
                        <td style={{ padding:"13px 18px" }}>
                          <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:"#dcfce7", color:"#16a34a" }}>
                            ✓ Processed
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding:"13px 18px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            <IconBtn title="View Payslip"  bg="#eef2ff" color="#6366f1" hoverBg="#6366f1" onClick={() => setViewPayroll(p)}>
                              <Eye style={{ width:14, height:14 }}/>
                            </IconBtn>
                            <IconBtn title="Download PDF" bg="#fff4ef" color="#ff6b35" hoverBg="#ff6b35" disabled={isDownloading} onClick={() => downloadPDF(p)}>
                              {isDownloading
                                ? <Loader2 style={{ width:13, height:13, animation:"spin 1s linear infinite" }}/>
                                : <Download style={{ width:14, height:14 }}/>
                              }
                            </IconBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Analytics Charts (shown when there are payrolls for the year) ── */}
      {!loading && yearPayrolls.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:16 }}>

          {/* Bar chart: monthly net salary trend */}
          <div style={{ ...cardStyle, padding:"20px 24px" }}>
            <p style={{ margin:"0 0 14px", fontSize:13, fontWeight:700, color:"#0f172a" }}>
              Monthly Net Salary — {effectiveYear}
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={(() => {
                return Array.from({ length: 12 }, (_, i) => {
                  const p = payrollByMonth[i];
                  return {
                    month: MONTH_NAMES[i].slice(0, 3),
                    net:   p ? Number(p.netSalary || 0) : 0,
                  };
                });
              })()} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Net Pay"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #eef0f4" }} />
                <Bar dataKey="net" fill="#FF6B35" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart: earnings vs deductions (latest payroll) */}
          <div style={{ ...cardStyle, padding:"20px 24px" }}>
            <p style={{ margin:"0 0 14px", fontSize:13, fontWeight:700, color:"#0f172a" }}>
              Earnings vs Deductions
              {yearPayrolls.length > 0 && (
                <span style={{ fontSize:11, color:"#94a3b8", fontWeight:400, marginLeft:6 }}>
                  (latest month)
                </span>
              )}
            </p>
            {(() => {
              const latest = [...yearPayrolls].sort((a, b) =>
                new Date(b.payrollMonth || 0) - new Date(a.payrollMonth || 0)
              )[0];
              if (!latest) return null;

              // Build dynamic slices from PayrollItems if present, else fallback
              const earningItems = Array.isArray(latest.earnings) && latest.earnings.length > 0
                ? latest.earnings.map(e => ({ name: e.name || e.label || e.componentName || "Earning", value: Number(e.amount || 0) }))
                : [{ name: "Gross Earnings", value: Number(latest.totalEarnings || 0) }];
              const deductionItems = Array.isArray(latest.deductions) && latest.deductions.length > 0
                ? latest.deductions.map(d => ({ name: d.name || d.label || d.componentName || "Deduction", value: Number(d.amount || 0) }))
                : [{ name: "Total Deductions", value: Number(latest.totalDeductions || 0) }];

              const allSlices = [
                ...earningItems.map((e, i) => ({ ...e, fill: ["#22c55e","#16a34a","#00C2A8","#34d399","#6ee7b7"][i % 5] })),
                ...deductionItems.map((d, i) => ({ ...d, fill: ["#FF6B35","#ef4444","#f97316","#fb923c","#fca5a5"][i % 5] })),
              ].filter(s => s.value > 0);

              return (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={allSlices} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      dataKey="value" nameKey="name" paddingAngle={3}>
                      {allSlices.map((s, i) => <Cell key={i} fill={s.fill} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #eef0f4" }} />
                    <Legend iconType="circle" iconSize={8}
                      formatter={(v) => <span style={{ fontSize: 10, color: "#64748b" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              );
            })()}
          </div>

        </div>
      )}

      {/* ── View Modal ───────────────────────────────────────────────────── */}
      {viewPayroll && (
        <SlipModal
          payroll={viewPayroll}
          company={c}
          settings={s}
          resolvedCompanyName={resolvedCompanyName}
          onClose={() => setViewPayroll(null)}
          onDownload={() => downloadPDF(viewPayroll)}
          isDownloading={dlLoading === (viewPayroll.id || viewPayroll.payrollMonth)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Small reusable icon button ─────────────────────────────────────────── */
function IconBtn({ title, bg, color, hoverBg, disabled, onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:32, height:32, borderRadius:8, border:"1px solid #e2e8f0",
        background: hov && !disabled ? hoverBg : bg,
        color: hov && !disabled ? "#fff" : color,
        cursor: disabled ? "not-allowed" : "pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.15s", opacity: disabled ? 0.5 : 1,
      }}
    >{children}</button>
  );
}

/* ── Header stat chip ────────────────────────────────────────────────────── */
function Chip({ label, value, color }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"6px 14px", textAlign:"center" }}>
      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", margin:0 }}>{label}</p>
      <p style={{ color, fontSize:15, fontWeight:800, margin:"2px 0 0" }}>{value}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  PDF Generator                                                              */
/*  Logo source: ONLY salary_slip_settings.companyLogoBase64 (by tenantCode)  */
/* ══════════════════════════════════════════════════════════════════════════ */
function generatePDF(p, company, settings, lsCompanyName) {
  const { jsPDF } = window.jspdf;
  const doc  = new jsPDF("p", "pt", "a4");
  const pw   = doc.internal.pageSize.width;
  const c    = company  || {};
  const s    = settings || {};
  const showAll = !settings || Object.keys(s).length === 0;

  // ── Company info (from company API — display only, no logo from here) ──────
  const companyName  = c.displayName || c.legalName || lsCompanyName || "Company";
  const companyAddr  = [c.address, c.city, c.state, c.pincode].filter(Boolean).join(", ");
  const companyEmail = c.officialEmail || "";
  const companyPhone = c.phoneNumber   || "";
  const companyWeb   = c.website       || "";
  const slipTitle    = s.slipTitle  || "SALARY SLIP";
  const footerNote   = s.footerNote || "This is a computer-generated salary slip and does not require a signature.";

  // ── Logo: ONLY from salary_slip_settings table (matched by tenantCode) ──────
  // s = salarySlipSettings fetched via GET /api/salary-slip-settings/{tenantCode}
  // The admin uploads logo via SalarySlipSettingsPage which PUTs to the same endpoint
  const logoBase64 = s.companyLogoBase64 || null;   // null if admin hasn't uploaded yet
  const logoMime   = s.logoMediaType     || "image/png";

  // ── Payroll values ────────────────────────────────────────────────────────
  const empName  = getName(p);
  const empId    = getId(p);
  const basic    = p.basicSalary         || 0;
  const hra      = p.hra                 || 0;
  const conv     = p.conveyanceAllowance || 0;
  const med      = p.medicalAllowance    || 0;
  const special  = p.otherAllowances     || 0;
  const d_it     = p.taxDeductions       || 0;
  const d_pf     = p.pfEmployee          || 0;
  const d_pt     = p.professionalTax     || 0;
  const d_med    = p.medicalInsurance    || 0;
  const lop      = p.lossOfPay           || 0;
  const paidDays = p.paidDays || 30;
  const lopDays  = p.lopDays  || 0;
  const payMonth = p.payrollMonth || "";
  const payDate  = formatDate(p.payDate || p.payrollMonth);

  // Use API-calculated totals as primary source (server has full picture)
  const gross      = p.totalEarnings   ?? (basic + hra + conv + med + special);
  const deductions = p.totalDeductions ?? (d_it + d_pf + d_pt + d_med + lop);
  const net        = p.netPay          ?? (gross - deductions);
  const netWords = `Indian Rupee ${numberToWords(Math.floor(net))}`;

  // ── Rows: show if salary_slip_settings toggle=true AND value > 0 ────────────
  // Logic: toggle=true means "this company uses this field"
  //        value>0 means the employee actually has this component this month
  // Both must be true to appear on the slip
  const addEarning = (toggle, label, value) => {
    if ((showAll || bool(toggle)) && Number(value) > 0)
      earningsBody.push([label, rupeeFmt(value)]);
  };
  const addDeduct = (toggle, label, value) => {
    if ((showAll || bool(toggle)) && Number(value) > 0)
      deductBody.push([label, rupeeFmt(value)]);
  };

  const earningsBody = [];
  addEarning(s.showBasicSalary,        "Basic Salary",         basic);
  addEarning(s.showHra,                "House Rent Allowance", hra);
  addEarning(s.showTransportAllowance, "Conveyance Allowance", conv);
  addEarning(s.showMedicalAllowance,   "Medical Allowance",    med);
  addEarning(s.showSpecialAllowance,   "Special Allowance",    special);

  const deductBody = [];
  addDeduct(s.showTds,             "Income Tax (TDS)",  d_it);
  addDeduct(s.showPfDeduction,     "Provident Fund",    d_pf);
  addDeduct(s.showEsiDeduction,    "Medical Insurance", d_med);
  addDeduct(s.showProfessionalTax, "Professional Tax",  d_pt);
  addDeduct(s.showLoanDeduction,   "Loss of Pay",       lop);

  // Use API totals if available (most accurate), else sum visible rows
  const grossDisplay = p.totalEarnings   ?? earningsBody.reduce((s,[,v]) => s + parseFloat(v.replace("Rs.","")||0), 0);
  const deducDisplay = p.totalDeductions ?? deductBody.reduce((s,[,v])   => s + parseFloat(v.replace("Rs.","")||0), 0);

  // ── Core render — called after logo is ready (or immediately if no logo) ──
  const renderDoc = (logoDataUrl) => {
    // Layout
    const HAS_LOGO  = !!logoDataUrl;
    const LOGO_X    = 40,  LOGO_Y = 20, LOGO_W = 65, LOGO_H = 65;
    const TEXT_X    = HAS_LOGO ? LOGO_X + LOGO_W + 12 : LOGO_X;
    const DIVIDER_Y = LOGO_Y + LOGO_H + 12;  // horizontal rule after header

    // ── 1. Logo ──────────────────────────────────────────────────────────────
    if (HAS_LOGO) {
      try { doc.addImage(logoDataUrl, "PNG", LOGO_X, LOGO_Y, LOGO_W, LOGO_H); } catch {}
    }

    // ── 2. Company name & address (left) ─────────────────────────────────────
    doc.setFontSize(15); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 26, 91);
    doc.text(companyName, TEXT_X, LOGO_Y + 16);

    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(70, 70, 70);
    if (companyAddr) {
      // Split long address across max 2 lines within available width
      const maxW = pw - TEXT_X - 165;
      const addrLines = doc.splitTextToSize(companyAddr, maxW);
      doc.text(addrLines.slice(0, 2), TEXT_X, LOGO_Y + 30);
    }

    const contactParts = [companyEmail, companyPhone, companyWeb].filter(Boolean);
    if (contactParts.length > 0) {
      const contactLine = doc.splitTextToSize(contactParts.join("  ·  "), pw - TEXT_X - 40);
      doc.text(contactLine[0], TEXT_X, LOGO_Y + 50);
    }

    // ── 3. SALARY SLIP title block (right-aligned) ───────────────────────────
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 100, 100);
    doc.text(slipTitle, pw - 40, LOGO_Y + 14, { align: "right" });

    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 20, 20);
    doc.text(payMonth, pw - 40, LOGO_Y + 30, { align: "right" });

    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(110, 110, 110);
    doc.text(`Paid: ${payDate}`, pw - 40, LOGO_Y + 44, { align: "right" });

    // ── 4. Divider ───────────────────────────────────────────────────────────
    doc.setDrawColor(210, 210, 210);
    doc.line(40, DIVIDER_Y, pw - 40, DIVIDER_Y);

    // ── 5. Employee info (2-column) ───────────────────────────────────────────
    let y = DIVIDER_Y + 18;
    doc.setFontSize(9); doc.setTextColor(0, 0, 0);
    const col2 = pw - 195;

    const infoRow = (label, val, x) => {
      doc.setFont("helvetica", "normal"); doc.setTextColor(110, 110, 110);
      doc.text(label, x, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", x + 95, y);
      doc.text(String(val || "—"), x + 108, y);
    };

    infoRow("Employee Name", empName, 40);
    doc.setFont("helvetica", "normal"); doc.setTextColor(110, 110, 110);
    doc.text("Paid Days", col2, y);
    doc.setTextColor(0, 0, 0); doc.text(":", col2 + 75, y); doc.text(String(paidDays), col2 + 88, y);
    y += 16;

    // Employee ID — shown only if salary_slip_settings.showEmployeeId = true
    if (showAll || bool(s.showEmployeeId)) { infoRow("Employee ID", empId, 40); }
    else { doc.text("", 40, y); } // keep spacing consistent
    doc.setFont("helvetica", "normal"); doc.setTextColor(110, 110, 110);
    doc.text("LOP Days", col2, y);
    doc.setTextColor(0, 0, 0); doc.text(":", col2 + 75, y); doc.text(String(lopDays), col2 + 88, y);
    y += 16;

    infoRow("Pay Period", payMonth, 40); y += 16;
    infoRow("Pay Date",   payDate,  40);

    // Optional fields — exactly mirrors salary_slip_settings toggles for this company
    const optRows = [
      { show: showAll || bool(s.showDepartment),    label: "Department",      val: p.department              },
      { show: showAll || bool(s.showDesignation),   label: "Designation",     val: p.designation             },
      { show: showAll || bool(s.showDateOfJoining), label: "Date of Joining", val: formatDate(p.dateOfJoining) },
      { show: showAll || bool(s.showBankName),      label: "Bank Name",       val: p.bankName                },
      { show: showAll || bool(s.showAccountNumber), label: "Account No.",     val: p.accountNumber           },
      { show: showAll || bool(s.showUanNumber),     label: "UAN Number",      val: p.uanNumber               },
      { show: showAll || bool(s.showPfNumber),      label: "PF Number",       val: p.pfNumber                },
      { show: showAll || bool(s.showPanNumber),     label: "PAN Number",      val: p.panNumber               },
      { show: showAll || bool(s.showEsiNumber),     label: "ESI Number",      val: p.esiNumber               },
      { show: showAll || bool(s.showLoanNumber),    label: "Loan No.",        val: p.loanNumber              },
    ];
    // Only render row if toggle is ON AND value is not empty
    optRows.filter(r => r.show && r.val && r.val !== "N/A" && r.val !== "").forEach(r => {
      y += 16; infoRow(r.label, r.val, 40);
    });

    const tY = y + 16;

    // ── 6. Earnings table (left half) ────────────────────────────────────────
    const eBody = [
      ...earningsBody,
      [{ content: "", styles: { fillColor: [255,255,255] } }, ""],
      [{ content: "Gross Earnings", styles: { fontStyle: "bold", textColor: [22,163,74] } },
       { content: rupeeFmt(gross), styles: { fontStyle: "bold", textColor: [22,163,74], halign: "right" } }],
    ];
    // grossDisplay = sum of only visible rows (for table footer); gross = API total (for net pay box)
    doc.autoTable({
      startY: tY,
      margin: { left: 40, right: pw / 2 + 8 },
      head: [[
        { content: "EARNINGS", styles: { halign: "left" } },
        { content: "AMOUNT",   styles: { halign: "right" } },
      ]],
      body: eBody,
      headStyles: { fillColor: [240, 253, 244], textColor: [22, 163, 74], fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      columnStyles: { 1: { halign: "right" } },
      theme: "grid",
    });

    // ── 7. Deductions table (right half) ─────────────────────────────────────
    const dBody = [
      ...deductBody,
      [{ content: "", styles: { fillColor: [255,255,255] } }, ""],
      [{ content: "Total Deductions", styles: { fontStyle: "bold", textColor: [220,38,38] } },
       { content: rupeeFmt(deductions), styles: { fontStyle: "bold", textColor: [220,38,38], halign: "right" } }],
    ];
    doc.autoTable({
      startY: tY,
      margin: { left: pw / 2 + 18, right: 40 },
      head: [[
        { content: "DEDUCTIONS", styles: { halign: "left" } },
        { content: "AMOUNT",     styles: { halign: "right" } },
      ]],
      body: dBody,
      headStyles: { fillColor: [254, 242, 242], textColor: [220, 38, 38], fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      columnStyles: { 1: { halign: "right" } },
      theme: "grid",
    });

    // ── 8. Net Pay box ────────────────────────────────────────────────────────
    const fy = doc.lastAutoTable.finalY + 16;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(40, fy, pw - 80, 56, 6, 6, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("NET PAY (TAKE HOME)", 54, fy + 16);

    doc.setFontSize(7.5); doc.setTextColor(180, 180, 180);
    doc.text(`GROSS  ${rupeeFmt(gross)}     DEDUCTIONS  ${rupeeFmt(deductions)}`, 54, fy + 30);

    doc.setFontSize(17); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text(rupeeFmt(net), pw - 54, fy + 36, { align: "right" });

    // ── 9. Amount in words + footer ──────────────────────────────────────────
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(130, 130, 130);
    doc.text(`Amount in Words: ${netWords}`, 40, fy + 70);

    doc.setFontSize(7); doc.setFont("helvetica", "italic"); doc.setTextColor(160, 160, 160);
    doc.text(`— ${footerNote} —`, pw / 2, fy + 84, { align: "center" });

    doc.save(`Payslip_${empName.replace(/\s+/g, "_")}_${payMonth}.pdf`);
  };

  // ── Logo async loading ────────────────────────────────────────────────────
  // logoBase64 is from salary_slip_settings table ONLY.
  // If null (admin hasn't uploaded yet), render without logo.
  if (logoBase64) {
    const dataUrl = logoBase64.startsWith("data:")
      ? logoBase64
      : `data:${logoMime};base64,${logoBase64}`;
    const img = new Image();
    img.onload  = () => renderDoc(dataUrl);
    img.onerror = () => renderDoc(null);   // logo broken → render without
    img.src = dataUrl;
  } else {
    renderDoc(null);  // no logo in salary_slip_settings → render without
  }
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Salary Slip View Modal                                                     */
/*  ALL fields — info, earnings, deductions — driven 100% by                  */
/*  salary_slip_settings toggles for this company's tenantCode                */
/* ══════════════════════════════════════════════════════════════════════════ */
function SlipModal({ payroll:p, company:c, settings:s, resolvedCompanyName, onClose, onDownload, isDownloading }) {
  // showAll = true only if settings haven't loaded yet (safety fallback)
  const showAll = !s || Object.keys(s).length === 0;

  // ── Company logo: ONLY from salary_slip_settings (tenantCode matched) ───────
  const logoSrc = s?.companyLogoBase64
    ? `data:${s.logoMediaType || "image/png"};base64,${s.companyLogoBase64}`
    : null;

  const companyAddr = [c.address, c.city, c.state, c.pincode].filter(Boolean).join(", ");
  const slipTitle   = s?.slipTitle  || "SALARY SLIP";
  const footerNote  = s?.footerNote || "This is a computer-generated salary slip and does not require a signature.";
  // ── Employee info fields — shown only if toggle is ON in salary_slip_settings ─
  // Always shown: Name, Pay Period, Pay Date, Paid Days, LOP Days
  // Conditionally shown: all others — only if their toggle = true AND data exists
  const infoFields = [
    { label:"Employee Name",   value:getName(p),                             always:true  },
    { label:"Employee ID",     value:getId(p),                               show:showAll || bool(s?.showEmployeeId)    },
    { label:"Pay Period",      value:p.payrollMonth,                         always:true  },
    { label:"Pay Date",        value:formatDate(p.payDate || p.payrollMonth),always:true  },
    { label:"Paid Days",       value:String(p.paidDays ?? 30),               always:true  },
    { label:"LOP Days",        value:String(p.lopDays  ?? 0),                always:true  },
    { label:"Department",      value:p.department,    show:showAll || bool(s?.showDepartment)    },
    { label:"Designation",     value:p.designation,   show:showAll || bool(s?.showDesignation)   },
    { label:"Date of Joining", value:formatDate(p.dateOfJoining || p.joiningDate), show:showAll || bool(s?.showDateOfJoining) },
    { label:"Bank Name",       value:p.bankName,      show:showAll || bool(s?.showBankName)      },
    { label:"Account No.",     value:p.accountNumber, show:showAll || bool(s?.showAccountNumber) },
    { label:"UAN Number",      value:p.uanNumber,     show:showAll || bool(s?.showUanNumber)     },
    { label:"PF Number",       value:p.pfNumber,      show:showAll || bool(s?.showPfNumber)      },
    { label:"PAN Number",      value:p.panNumber,     show:showAll || bool(s?.showPanNumber)     },
    { label:"ESI Number",      value:p.esiNumber,     show:showAll || bool(s?.showEsiNumber)     },
    { label:"Loan Number",     value:p.loanNumber,    show:showAll || bool(s?.showLoanNumber)    },
  ].filter(r => (r.always || r.show) && (r.value !== null && r.value !== undefined && r.value !== "" && r.value !== "N/A"));

  // ── Earnings: show if toggle=true AND value > 0 ──────────────────────────────
  // toggle=true  → company configured this field (set in SalarySlipSettingsPage)
  // value > 0    → employee actually has this component this month
  const fallbackEarningsRows = [
    { show: showAll || bool(s?.showBasicSalary),        label:"Basic Salary",         value: p.basicSalary         },
    { show: showAll || bool(s?.showHra),                label:"House Rent Allowance", value: p.hra                 },
    { show: showAll || bool(s?.showSpecialAllowance),   label:"Special Allowance",    value: p.specialAllowance    },
    { show: showAll || bool(s?.showTransportAllowance), label:"Conveyance Allowance", value: p.conveyanceAllowance },
    { show: showAll || bool(s?.showMedicalAllowance),   label:"Medical Allowance",    value: p.medicalAllowance    },
    { show: showAll || bool(s?.showOtherAllowances),    label:"Leave Travel Allowance", value: p.lta               },
    { show: showAll || bool(s?.showOtherAllowances),    label:"Other Allowances",     value: p.otherAllowances     },
  ].filter(r => r.show && Number(r.value ?? 0) > 0);

  // ── Deductions: show if toggle=true AND value > 0 ─────────────────────────────
  const fallbackDeductionRows = [
    { show: showAll || bool(s?.showTds),             label:"Income Tax (TDS)",  value: p.taxDeductions    },
    { show: showAll || bool(s?.showPfDeduction),     label:"Provident Fund",    value: p.pfEmployee       },
    { show: showAll || bool(s?.showEsiDeduction),    label:"ESI",               value: p.esiEmployee      },
    { show: showAll || bool(s?.showProfessionalTax), label:"Professional Tax",  value: p.professionalTax  },
    { show: showAll || bool(s?.showOtherDeductions), label:"Other Deductions",  value: p.otherDeductions  },
  ].filter(r => r.show && Number(r.value ?? 0) > 0);

  const earningsRows = normalizePayrollRows(p.earnings, fallbackEarningsRows);
  const deductionRows = normalizePayrollRows(p.deductions, fallbackDeductionRows);

  // Use API totals as primary — they include ALL components the server calculated
  // Visible row sum is only used as fallback if API totals are missing
  const totalEarnings   = p.totalEarnings   ?? earningsRows.reduce((sum, r) => sum + Number(r.value || 0), 0);
  const totalDeductions = p.totalDeductions ?? deductionRows.reduce((sum, r) => sum + Number(r.value || 0), 0);
  const netPay = p.netPay ?? (totalEarnings - totalDeductions);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div onClick={onClose} style={{ position:"fixed", top:0, left:0, right:0, bottom:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.65)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, padding:16, boxSizing:"border-box" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:18, width:"100%", maxWidth:860, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(0,0,0,0.35)", position:"relative" }}>

        {/* ── Sticky top toolbar ─────────────────────────────────────────────── */}
        <div style={{ background:"linear-gradient(135deg,#0f172a,#1e293b)", borderRadius:"18px 18px 0 0", padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
          <div>
            <p style={{ color:"#ff6b35", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{slipTitle}</p>
            <p style={{ color:"#fff", fontWeight:800, fontSize:15, margin:"3px 0 0" }}>{p.payrollMonth}</p>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={onDownload} disabled={isDownloading}
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:9, background:"#ff6b35", color:"#fff", border:"none", cursor:isDownloading?"not-allowed":"pointer", fontSize:13, fontWeight:600, opacity:isDownloading?0.6:1 }}>
              {isDownloading ? <Loader2 style={{ width:13,height:13,animation:"spin 1s linear infinite" }}/> : <Download style={{ width:13,height:13 }}/>}
              Download PDF
            </button>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, border:"none", background:"rgba(255,255,255,0.1)", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <X style={{ width:16,height:16 }}/>
            </button>
          </div>
        </div>

        {/* ── Company header ─────────────────────────────────────────────────── */}
        {/* Logo from salary_slip_settings.companyLogoBase64 (tenantCode matched) */}
        <div style={{ background:"linear-gradient(135deg,#0f172a,#253352)", padding:"20px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {logoSrc
              ? <img src={logoSrc} alt="logo"
                  style={{ height:56, maxWidth:130, objectFit:"contain", borderRadius:8, background:"#fff", padding:4 }}/>
              : <div style={{ width:52, height:52, borderRadius:12, background:"linear-gradient(135deg,#ff6b35,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:22 }}>
                  {resolvedCompanyName.charAt(0).toUpperCase()}
                </div>
            }
            <div>
              <p style={{ color:"#fff", fontWeight:800, fontSize:17, margin:0 }}>{resolvedCompanyName}</p>
              {companyAddr && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, margin:"3px 0 0" }}>{companyAddr}</p>}
              {(c.officialEmail || c.phoneNumber) && (
                <p style={{ color:"rgba(255,255,255,0.3)", fontSize:11, margin:"2px 0 0" }}>
                  {[c.officialEmail, c.phoneNumber].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ color:"#ff6b35", fontWeight:800, fontSize:14, margin:0, letterSpacing:"0.08em" }}>{slipTitle}</p>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, margin:"4px 0 0" }}>{p.payrollMonth}</p>
            {p.payDate && <p style={{ color:"rgba(255,255,255,0.3)", fontSize:11, margin:"3px 0 0" }}>Paid: {formatDate(p.payDate)}</p>}
          </div>
        </div>

        {/* ── Employee info grid ─────────────────────────────────────────────── */}
        {/* Only fields whose toggle = true in salary_slip_settings are shown     */}
        <div style={{ padding:"16px 26px", background:"#f8fafc", borderBottom:"1px solid #eef0f4" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:"12px 18px" }}>
            {infoFields.map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize:9, fontWeight:700, color:"#94a3b8", margin:0, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</p>
                <p style={{ fontSize:12, fontWeight:600, color:"#1e293b", margin:"3px 0 0", wordBreak:"break-all" }}>{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Earnings + Deductions side by side ────────────────────────────── */}
        {/* Each column shows only toggled-ON components for this company        */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>

          {/* Earnings */}
          <div style={{ borderRight:"1px solid #eef0f4" }}>
            <div style={{ background:"#f0fdf4", padding:"9px 18px", display:"flex", alignItems:"center", gap:7, borderBottom:"1px solid #dcfce7" }}>
              <TrendingUp style={{ width:12,height:12,color:"#16a34a" }}/>
              <span style={{ fontSize:10, fontWeight:700, color:"#16a34a", textTransform:"uppercase", letterSpacing:"0.06em" }}>Earnings</span>
            </div>
            {earningsRows.length > 0 ? (
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #f1f5f9" }}>
                    <th style={{ padding:"7px 18px", fontSize:9, fontWeight:700, color:"#94a3b8", textAlign:"left", textTransform:"uppercase" }}>Component</th>
                    <th style={{ padding:"7px 18px", fontSize:9, fontWeight:700, color:"#94a3b8", textAlign:"right", textTransform:"uppercase" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsRows.map(({ label, value }) => (
                    <tr key={label} style={{ borderBottom:"1px solid #f8fafc" }}>
                      <td style={{ padding:"8px 18px", fontSize:12, color:"#334155" }}>{label}</td>
                      <td style={{ padding:"8px 18px", fontSize:12, fontWeight:600, color:"#1e293b", textAlign:"right" }}>{fmt(value)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background:"#f0fdf4", borderTop:"2px solid #bbf7d0" }}>
                    <td style={{ padding:"10px 18px", fontSize:12, fontWeight:700, color:"#16a34a" }}>Total Earnings</td>
                    <td style={{ padding:"10px 18px", fontSize:12, fontWeight:800, color:"#16a34a", textAlign:"right" }}>{fmt(totalEarnings)}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p style={{ padding:"20px 18px", fontSize:12, color:"#94a3b8", textAlign:"center" }}>No earnings configured</p>
            )}
          </div>

          {/* Deductions */}
          <div>
            <div style={{ background:"#fef2f2", padding:"9px 18px", display:"flex", alignItems:"center", gap:7, borderBottom:"1px solid #fecaca" }}>
              <TrendingDown style={{ width:12,height:12,color:"#dc2626" }}/>
              <span style={{ fontSize:10, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:"0.06em" }}>Deductions</span>
            </div>
            {deductionRows.length > 0 ? (
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #f1f5f9" }}>
                    <th style={{ padding:"7px 18px", fontSize:9, fontWeight:700, color:"#94a3b8", textAlign:"left", textTransform:"uppercase" }}>Component</th>
                    <th style={{ padding:"7px 18px", fontSize:9, fontWeight:700, color:"#94a3b8", textAlign:"right", textTransform:"uppercase" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {deductionRows.map(({ label, value }) => (
                    <tr key={label} style={{ borderBottom:"1px solid #f8fafc" }}>
                      <td style={{ padding:"8px 18px", fontSize:12, color:"#334155" }}>{label}</td>
                      <td style={{ padding:"8px 18px", fontSize:12, fontWeight:600, color:"#1e293b", textAlign:"right" }}>{fmt(value)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background:"#fef2f2", borderTop:"2px solid #fecaca" }}>
                    <td style={{ padding:"10px 18px", fontSize:12, fontWeight:700, color:"#dc2626" }}>Total Deductions</td>
                    <td style={{ padding:"10px 18px", fontSize:12, fontWeight:800, color:"#dc2626", textAlign:"right" }}>{fmt(totalDeductions)}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p style={{ padding:"20px 18px", fontSize:12, color:"#94a3b8", textAlign:"center" }}>No deductions configured</p>
            )}
          </div>
        </div>

        {/* ── Net Pay ────────────────────────────────────────────────────────── */}
        <div style={{ background:"linear-gradient(135deg,#0f172a,#1e293b)", padding:"18px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>Net Pay (Take Home)</p>
            <p style={{ color:"#fff", fontSize:28, fontWeight:900, margin:"4px 0 0", letterSpacing:"-0.02em" }}>{fmt(netPay)}</p>
          </div>
          <div style={{ display:"flex", gap:20, textAlign:"right" }}>
            <div>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:9, textTransform:"uppercase", margin:0 }}>Gross</p>
              <p style={{ color:"#22c55e", fontSize:14, fontWeight:700, margin:"3px 0 0" }}>{fmt(totalEarnings)}</p>
            </div>
            <div>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:9, textTransform:"uppercase", margin:0 }}>Deductions</p>
              <p style={{ color:"#f87171", fontSize:14, fontWeight:700, margin:"3px 0 0" }}>{fmt(totalDeductions)}</p>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div style={{ padding:"12px 26px", background:"#f8fafc", borderTop:"1px solid #eef0f4", display:"flex", alignItems:"center", justifyContent:"space-between", borderRadius:"0 0 18px 18px" }}>
          <p style={{ fontSize:10, color:"#94a3b8", margin:0, fontStyle:"italic" }}>{footerNote}</p>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <CheckCircle style={{ width:11,height:11,color:"#22c55e" }}/>
            <span style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>Verified</span>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
