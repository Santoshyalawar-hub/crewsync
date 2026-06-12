import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/apiClient";
import {
  Search, DollarSign, User, RefreshCw, AlertCircle,
  X, Check, ChevronDown, Save, Eye,
} from "lucide-react";

/* ── Design tokens ── */
const T = {
  navy: "#0B1020", navyMid: "#374151", coral: "#8B5CF6", teal: "#06B6D4",
  bg: "#F5F7FB", border: "#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.me2 { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.me2 .fd { font-family:'Sora',sans-serif; }
.me2-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.me2-input { width:100%; border:1.5px solid ${T.border}; border-radius:10px; padding:10px 14px; font-size:13px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; transition:border-color .2s,box-shadow .2s; background:#fff; }
.me2-input:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
.me2-select { appearance:none; width:100%; border:1.5px solid ${T.border}; border-radius:10px; padding:10px 34px 10px 14px; font-size:13px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center; }
.me2-select:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
.me2-label { font-size:11px; font-weight:700; color:#64748b; margin-bottom:6px; display:block; text-transform:uppercase; letter-spacing:.06em; }
.me2-emp-card { background:#fff; border:1.5px solid ${T.border}; border-radius:14px; padding:14px 16px; cursor:pointer; transition:all .15s; }
.me2-emp-card:hover, .me2-emp-card.selected { border-color:${T.coral}; background:#FFFAF8; box-shadow:0 4px 16px rgba(139,92,246,.1); }
.me2-comp-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid ${T.border}; }
.me2-comp-row:last-child { border-bottom:none; }
@keyframes me2Up { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.me2-in { animation:me2Up .35s ease both; }
@keyframes spin2 { to{transform:rotate(360deg)} }
`;

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const COMPONENT_LABELS = {
  basicCompensation:      "Basic Compensation",
  hra:              "HRA",
  conveyanceAllowance: "Conveyance Allowance",
  medicalAllowance: "Medical Allowance",
  specialAllowance: "Special Allowance",
  otherAllowance:   "Other Allowance",
  performanceBonus: "Momentum Bonus",
  pfPerson:       "PF (Person)",
  pfEmployer:       "PF (Employer)",
  esiPerson:      "ESI (Person)",
  esiEmployer:      "ESI (Employer)",
  incomeTax:        "Income Tax (TDS)",
  professionalTax:  "Professional Tax",
  loanDeduction:    "Loan Deduction",
  otherDeduction:   "Other Deduction",
  lopDeduction:     "LOP Deduction",
};

const EARNING_KEYS  = ["basicCompensation","hra","conveyanceAllowance","medicalAllowance","specialAllowance","otherAllowance","performanceBonus"];
const DEDUCTION_KEYS = ["pfPerson","pfEmployer","esiPerson","esiEmployer","incomeTax","professionalTax","loanDeduction","otherDeduction","lopDeduction"];

function fmt(n) { return Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

/* ══════════════════════════════════════════════════════════════════ */
export default function ManualEntry() {
  const [step,       setStep]       = useState(1); // 1=select emp, 2=entry, 3=preview
  const [employees,  setPersons]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);
  const [salaryData, setCompensationData] = useState(null);
  const [components, setComponents] = useState({});
  const [payMonth,   setPayMonth]   = useState(new Date().getMonth()); // 0-indexed
  const [payYear,    setPayYear]    = useState(new Date().getFullYear());
  const [lopDays,    setLopDays]    = useState(0);
  const [remarks,    setRemarks]    = useState("");
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(null);

  /* ── Load employees ── */
  const fetchPersons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users/tenant/employees");
      const raw = res.data?.data || res.data || [];
      setPersons(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error("Fetch employees error:", err);
      setError("Failed to load employees.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPersons(); }, [fetchPersons]);

  /* ── Load salary components when employee selected ── */
  const loadCompensationData = async (emp) => {
    setSelected(emp);
    setError(null);
    try {
      const [salRes, compRes] = await Promise.allSettled([
        api.get(`/api/salary/employee/${emp.id}`),
        api.get(`/api/salary-components/employee/${emp.id}`),
      ]);

      const sal   = salRes.status   === "fulfilled" ? (salRes.value.data?.data   || salRes.value.data)   : null;
      const comps = compRes.status  === "fulfilled" ? (compRes.value.data?.data  || compRes.value.data)  : [];

      setCompensationData(sal);

      // Build initial component values from saved salary + active components
      const init = {};
      if (sal) {
        EARNING_KEYS.concat(DEDUCTION_KEYS).forEach(k => {
          if (sal[k] != null) init[k] = String(sal[k]);
        });
      }
      if (Array.isArray(comps)) {
        comps.filter(c => c.enabled !== false).forEach(c => {
          const key = c.componentKey || c.name?.toLowerCase().replace(/\s+/g, "");
          if (key && c.value != null) init[key] = String(c.value);
        });
      }
      setComponents(init);
      setStep(2);
    } catch (err) {
      console.error("Load salary error:", err);
      setError("Failed to load salary data for this employee.");
    }
  };

  /* ── Totals ── */
  const totalEarnings   = EARNING_KEYS.reduce((s, k)  => s + Number(components[k]  || 0), 0);
  const totalDeductions = DEDUCTION_KEYS.reduce((s, k) => s + Number(components[k] || 0), 0);
  const lopDeductionCalc = salaryData?.basicCompensation
    ? ((Number(salaryData.basicCompensation) / 26) * Number(lopDays || 0))
    : 0;
  const netCompensation = totalEarnings - totalDeductions - lopDeductionCalc;

  /* ── Submit payroll ── */
  const submitPayouts = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        userId:          selected.id,
        employeeId:      selected.employeeId,
        employeeName:    selected.fullName,
        payrollMonth:    `${MONTHS[payMonth]} ${payYear}`,
        lopDays:         Number(lopDays || 0),
        remarks,
        ...Object.fromEntries(
          Object.entries(components).map(([k, v]) => [k, Number(v || 0)])
        ),
        totalEarnings,
        totalDeductions: totalDeductions + lopDeductionCalc,
        netCompensation,
        lopDeduction:    lopDeductionCalc,
        source:          "MANUAL",
      };
      await api.post("/api/payroll/manual-entry", payload);
      setSuccess(`Payouts saved for ${selected.fullName} — ${MONTHS[payMonth]} ${payYear}.`);
      setTimeout(() => setSuccess(null), 5000);
      setStep(1);
      setSelected(null);
      setCompensationData(null);
      setComponents({});
      setLopDays(0);
      setRemarks("");
    } catch (err) {
      console.error("Submit payroll error:", err);
      setError(err.response?.data?.message || "Failed to save payroll.");
    } finally { setSaving(false); }
  };

  /* ── Filtered employees ── */
  const filtered = employees.filter(e =>
    !search || `${e.fullName} ${e.employeeId} ${e.department}`.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Years ── */
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="me2" style={{ padding: "0 0 56px" }}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, padding: "22px 26px", position: "relative", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ position: "absolute", top: -50, right: 60, width: 180, height: 180, borderRadius: "50%", background: "rgba(139,92,246,.07)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.coral, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>CrewSync · Payouts</p>
          <h1 className="fd" style={{ fontSize: 23, fontWeight: 900, color: "#fff", margin: 0 }}>Manual Payouts Entry</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4 }}>Create a custom payroll record for an individual employee.</p>
          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            {["Select Person","Enter Components","Review & Save"].map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: step > i + 1 ? T.teal : step === i + 1 ? T.coral : "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: step === i + 1 ? "#fff" : "rgba(255,255,255,.5)" }}>{s}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.2)", maxWidth: 40 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 26px" }}>

        {/* ── ALERTS ── */}
        {error && (
          <div className="me2-in" style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <AlertCircle size={16} color="#EF4444" />
            <p style={{ fontSize: 13, color: "#991b1b", fontWeight: 600, flex: 1 }}>{error}</p>
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} color="#991b1b" /></button>
          </div>
        )}
        {success && (
          <div className="me2-in" style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Check size={16} color="#16a34a" />
            <p style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>{success}</p>
          </div>
        )}

        {/* ════════════════════════════
            STEP 1 — SELECT EMPLOYEE
            ════════════════════════════ */}
        {step === 1 && (
          <div className="me2-card me2-in">
            <div style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <User size={16} color={T.coral} />
              <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Select Person</p>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="me2-input" style={{ paddingLeft: 36 }} placeholder="Search by name, ID, department…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ width: 32, height: 32, border: `3px solid ${T.coral}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin2 .9s linear infinite", margin: "0 auto 10px" }} />
                  <p style={{ fontSize: 13, color: "#64748b" }}>Loading employees…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: "32px 0", textAlign: "center" }}>
                  <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>👥</span>
                  <p style={{ fontSize: 13, color: "#94a3b8" }}>No employees found.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                  {filtered.map(emp => (
                    <button key={emp.id} className={`me2-emp-card ${selected?.id === emp.id ? "selected" : ""}`} onClick={() => loadCompensationData(emp)}
                      style={{ textAlign: "left", width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", transition: "all .15s", background: "#fff" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${T.coral},${T.teal})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                          {(emp.fullName || "?").slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{emp.fullName}</p>
                          <p style={{ fontSize: 11, color: "#64748b" }}>{emp.employeeId ? `${emp.employeeId} · ` : ""}{emp.department || "—"}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════
            STEP 2 — ENTER COMPONENTS
            ════════════════════════════ */}
        {step === 2 && selected && (
          <div className="me2-in">
            {/* Month & Year */}
            <div className="me2-card" style={{ marginBottom: 18 }}>
              <div style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})`, padding: "14px 20px" }}>
                <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Payouts Period & Person</p>
              </div>
              <div style={{ padding: "18px 20px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
                <div style={{ minWidth: 160 }}>
                  <label className="me2-label">Month</label>
                  <select className="me2-select" value={payMonth} onChange={e => setPayMonth(Number(e.target.value))}>
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                </div>
                <div style={{ minWidth: 120 }}>
                  <label className="me2-label">Year</label>
                  <select className="me2-select" value={payYear} onChange={e => setPayYear(Number(e.target.value))}>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 200, padding: "12px 16px", background: "#F8FAFF", border: `1px solid ${T.border}`, borderRadius: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>Selected Person</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{selected.fullName}</p>
                  <p style={{ fontSize: 11, color: "#64748b" }}>{selected.employeeId ? `${selected.employeeId} · ` : ""}{selected.department || "—"}</p>
                </div>
                <div style={{ minWidth: 120 }}>
                  <label className="me2-label">LOP Days</label>
                  <input className="me2-input" type="number" min="0" max="31" value={lopDays} onChange={e => setLopDays(e.target.value)} />
                </div>
                <button onClick={() => setStep(1)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: "#fff", color: T.navy, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans" }}>
                  ← Change Person
                </button>
              </div>
            </div>

            {/* Earnings */}
            <div className="me2-card" style={{ marginBottom: 18 }}>
              <div style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Earnings</p>
                <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(6,182,212,.2)", color: T.teal, fontSize: 11, fontWeight: 700, border: "1px solid rgba(6,182,212,.3)" }}>
                  ₹{fmt(totalEarnings)}
                </span>
              </div>
              <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                {EARNING_KEYS.map(k => (
                  <div key={k}>
                    <label className="me2-label">{COMPONENT_LABELS[k]}</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94a3b8", fontWeight: 700 }}>₹</span>
                      <input className="me2-input" style={{ paddingLeft: 28 }} type="number" min="0" value={components[k] || ""} placeholder="0" onChange={e => setComponents(c => ({ ...c, [k]: e.target.value }))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div className="me2-card" style={{ marginBottom: 18 }}>
              <div style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Deductions</p>
                <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(239,68,68,.15)", color: "#EF4444", fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,.3)" }}>
                  ₹{fmt(totalDeductions + lopDeductionCalc)}
                </span>
              </div>
              <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                {DEDUCTION_KEYS.map(k => (
                  <div key={k}>
                    <label className="me2-label">{COMPONENT_LABELS[k]}</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94a3b8", fontWeight: 700 }}>₹</span>
                      <input className="me2-input" style={{ paddingLeft: 28 }} type="number" min="0" value={components[k] || ""} placeholder="0" onChange={e => setComponents(c => ({ ...c, [k]: e.target.value }))} />
                    </div>
                  </div>
                ))}
                {lopDeductionCalc > 0 && (
                  <div>
                    <label className="me2-label">LOP Deduction (auto)</label>
                    <div style={{ padding: "10px 14px", background: "#fef2f2", border: `1px solid rgba(239,68,68,.25)`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#EF4444" }}>
                      ₹{fmt(lopDeductionCalc)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div className="me2-card" style={{ marginBottom: 18 }}>
              <div style={{ padding: "16px 20px" }}>
                <label className="me2-label">Remarks (optional)</label>
                <textarea className="me2-input" rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Any additional notes…" style={{ resize: "vertical" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setStep(3)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: `linear-gradient(135deg,${T.coral},#06B6D4)`, color: "#fff", fontSize: 13, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "DM Sans", boxShadow: "0 4px 16px rgba(139,92,246,.3)" }}>
                <Eye size={14} /> Preview & Review
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════
            STEP 3 — REVIEW & SAVE
            ════════════════════════════ */}
        {step === 3 && selected && (
          <div className="me2-in">
            <div className="me2-card" style={{ marginBottom: 18, overflow: "hidden" }}>
              <div style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})`, padding: "14px 20px" }}>
                <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Payouts Summary — {selected.fullName} ({MONTHS[payMonth]} {payYear})</p>
              </div>
              <div style={{ padding: "20px 22px" }}>
                {/* Net summary */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 22 }}>
                  {[
                    { label: "Total Earnings",   value: totalEarnings,                        color: T.teal  },
                    { label: "Total Deductions",  value: totalDeductions + lopDeductionCalc,   color: "#EF4444" },
                    { label: "Net Compensation",        value: netCompensation,                            color: T.coral },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ padding: "14px 16px", background: "#F8FAFF", border: `1.5px solid ${T.border}`, borderRadius: 12, textAlign: "center" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>{label}</p>
                      <p className="fd" style={{ fontSize: 22, fontWeight: 900, color }}>₹{fmt(value)}</p>
                    </div>
                  ))}
                </div>

                {/* Earnings breakdown */}
                <p className="fd" style={{ fontSize: 13, fontWeight: 800, color: T.navy, marginBottom: 10 }}>Earnings Breakdown</p>
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 18 }}>
                  {EARNING_KEYS.filter(k => Number(components[k] || 0) > 0).map(k => (
                    <div key={k} className="me2-comp-row" style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 13, color: "#475569" }}>{COMPONENT_LABELS[k]}</span>
                      <span className="fd" style={{ fontSize: 13, fontWeight: 800, color: T.teal }}>₹{fmt(components[k])}</span>
                    </div>
                  ))}
                </div>

                {/* Deductions breakdown */}
                <p className="fd" style={{ fontSize: 13, fontWeight: 800, color: T.navy, marginBottom: 10 }}>Deductions Breakdown</p>
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 18 }}>
                  {DEDUCTION_KEYS.filter(k => Number(components[k] || 0) > 0).map(k => (
                    <div key={k} className="me2-comp-row" style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 13, color: "#475569" }}>{COMPONENT_LABELS[k]}</span>
                      <span className="fd" style={{ fontSize: 13, fontWeight: 800, color: "#EF4444" }}>₹{fmt(components[k])}</span>
                    </div>
                  ))}
                  {lopDeductionCalc > 0 && (
                    <div className="me2-comp-row" style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 13, color: "#475569" }}>LOP ({lopDays} days)</span>
                      <span className="fd" style={{ fontSize: 13, fontWeight: 800, color: "#EF4444" }}>₹{fmt(lopDeductionCalc)}</span>
                    </div>
                  )}
                </div>

                {remarks && <p style={{ fontSize: 12, color: "#64748b", padding: "10px 14px", background: "#F8FAFF", borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 18 }}><strong>Remarks:</strong> {remarks}</p>}

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setStep(2)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: "#fff", color: T.navy, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans" }}>
                    ← Edit
                  </button>
                  <button onClick={submitPayouts} disabled={saving}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: `linear-gradient(135deg,${T.coral},#06B6D4)`, color: "#fff", fontSize: 13, fontWeight: 800, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? .7 : 1, fontFamily: "DM Sans", boxShadow: "0 4px 16px rgba(139,92,246,.3)" }}>
                    {saving ? "Saving…" : <><Save size={14} /> Save Payouts</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
