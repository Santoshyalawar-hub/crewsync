import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/lib/apiClient";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  navy:    "#0B1020",
  navy2:   "#182033",
  coral:   "#8B5CF6",
  teal:    "#06B6D4",
  bg:      "#F4F6F9",
  border:  "#E8EDF3",
  muted:   "#64748b",
  green:   "#10b981",
  amber:   "#f59e0b",
  red:     "#ef4444",
  purple:  "#8b5cf6",
  indigo:  "#6366f1",
};

const PATHS  = { finance:"/p/ad/finance", payroll:"/p/ad/payroll" };
const KEYMAP = { finance:"ad_finance",    payroll:"ad_payroll"    };

const Ic = ({ d, size=16, sw=1.8, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {[].concat(d).map((p,i) => <path key={i} d={p}/>)}
  </svg>
);

const ICONS = {
  arrowL:  "M19 12H5M12 19l-7-7 7-7",
  zap:     ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  users:   ["M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"],
  user:    ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8"],
  building:["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  check:   "M20 6L9 17l-5-5",
  x:       "M18 6L6 18M6 6l12 12",
  skip:    ["M9 9l3 3-3 3","M15 6v12"],
  file:    ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6"],
  pdf:     ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M9 15h6","M9 11h6","M9 18h4"],
  refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  play:    "M5 3l14 9-14 9V3z",
  rupee:   ["M6 3h12","M6 8h12","M6 13h8","M6 13c0 3.87 3.13 7 7 7"],
  calendar:["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"],
  info:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 8v4","M12 16h.01"],
  chevD:   "M6 9l6 6 6-6",
  link:    ["M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71","M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getTenantContext = () => {
  const tenantCode = (localStorage.getItem("tenantCode") || "").trim();
  const raw = (localStorage.getItem("companyId") || "").trim();
  const companyId = raw && raw !== "null" && raw !== "undefined" ? Number(raw) : null;
  return { tenantCode, companyId };
};


const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.ap * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }
.ap .fd { font-family:'Sora',sans-serif; }
.ap { background:${C.bg}; min-height:100vh; }

@keyframes ap-in   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes ap-pop  { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
@keyframes ap-spin { to{transform:rotate(360deg)} }
@keyframes ap-pulse{ 0%,100%{opacity:1} 50%{opacity:.35} }
@keyframes ap-slide{ from{max-height:0;opacity:0} to{max-height:800px;opacity:1} }
.ap-in  { animation:ap-in  .3s cubic-bezier(.22,.97,.55,1) both; }
.ap-pop { animation:ap-pop .25s cubic-bezier(.22,.97,.55,1) both; }

.ap-mode-btn {
  display:flex;align-items:center;gap:8px;padding:12px 20px;
  border-radius:14px;border:1.5px solid ${C.border};
  background:#fff;cursor:pointer;transition:all .2s;
  font-size:13px;font-weight:700;color:${C.muted};
  flex:1;justify-content:center;
}
.ap-mode-btn.active {
  background:${C.navy};color:#fff;border-color:${C.navy};
  box-shadow:0 4px 14px rgba(13,31,45,.18);
}
.ap-mode-btn:hover:not(.active) { background:#f8fafc;border-color:#d1d5db; }

.ap-card { background:#fff;border:1.5px solid ${C.border};border-radius:20px;overflow:hidden;box-shadow:0 2px 12px rgba(13,31,45,.06); }
.ap-card-head { padding:18px 22px;border-bottom:1px solid ${C.border};background:linear-gradient(180deg,#fff,#fafbfd);display:flex;align-items:center;gap:12px; }
.ap-card-body { padding:22px; }

.ap-input, .ap-select {
  width:100%;border:1.5px solid ${C.border};background:#fafbfd;
  border-radius:12px;padding:11px 14px;font-size:13px;color:${C.navy};
  outline:none;transition:all .18s;font-family:'DM Sans',sans-serif;
}
.ap-input:focus, .ap-select:focus { border-color:${C.coral};background:#fff;box-shadow:0 0 0 4px rgba(139,92,246,.07); }
.ap-select { appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23FF6B35'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px;cursor:pointer; }
.ap-label { font-size:10px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:6px; }

.ap-run-btn {
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  padding:14px 28px;border:none;border-radius:14px;
  background:linear-gradient(135deg,${C.coral},#FBBF24);color:#fff;
  font-size:14px;font-weight:800;cursor:pointer;transition:all .2s;
  box-shadow:0 6px 20px rgba(139,92,246,.28);font-family:'Sora',sans-serif;
  width:100%;
}
.ap-run-btn:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 10px 28px rgba(139,92,246,.38); }
.ap-run-btn:disabled { opacity:.55;cursor:not-allowed;transform:none; }
.ap-run-btn.running { background:linear-gradient(135deg,#0B1020,#374151); }

.ap-prog-track { height:8px;border-radius:999px;background:${C.border};overflow:hidden;margin:12px 0; }
.ap-prog-fill  { height:100%;border-radius:999px;transition:width .4s ease;background:linear-gradient(90deg,${C.coral},${C.teal}); }

.ap-result-row {
  display:flex;align-items:center;gap:12px;padding:12px 16px;
  border-radius:12px;border:1.5px solid ${C.border};
  animation:ap-in .25s ease both;transition:border-color .15s;
}
.ap-result-row.success { border-color:rgba(16,185,129,.2);background:rgba(16,185,129,.03); }
.ap-result-row.skipped { border-color:rgba(245,158,11,.2);background:rgba(245,158,11,.02); }
.ap-result-row.failed  { border-color:rgba(239,68,68,.2);background:rgba(239,68,68,.03); }

.ap-badge { display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap; }
.ap-badge.success { color:${C.green};background:rgba(16,185,129,.12); }
.ap-badge.skipped { color:${C.amber};background:rgba(245,158,11,.1); }
.ap-badge.failed  { color:${C.red};background:rgba(239,68,68,.1); }
.ap-badge.pending { color:${C.indigo};background:rgba(99,102,241,.1); }
.ap-badge.running { color:${C.coral};background:rgba(139,92,246,.1); }

.ap-spin { border:2.5px solid rgba(139,92,246,.25);border-top-color:${C.coral};border-radius:50%;animation:ap-spin .7s linear infinite;flex-shrink:0; }

.ap-toggle { display:flex;align-items:center;gap:10px;cursor:pointer; }
.ap-toggle-track { width:42px;height:22px;border-radius:999px;transition:background .2s;position:relative; }
.ap-toggle-thumb { position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.18); }

.ap-sum-row { display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid ${C.border}; }
.ap-sum-row:last-child { border-bottom:none; }

.ap ::-webkit-scrollbar { width:4px;height:4px; }
.ap ::-webkit-scrollbar-track { background:transparent; }
.ap ::-webkit-scrollbar-thumb { background:#cbd5e1;border-radius:999px; }
`;

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function AutoPayouts({ onBack, token, navigateTo }) {
  const navigate = useNavigate();
  const go = (key) => {
    const pageKey = KEYMAP[key];
    if (navigateTo && pageKey) { navigateTo(pageKey); return; }
    if (PATHS[key]) navigate(PATHS[key]);
  };

  // ── Mode ───────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState("single");

  // ── Config ─────────────────────────────────────────────────────────────────
  const [employees,     setPersons]     = useState([]);
  const [departments,   setDepartments]   = useState([]);
  const [empLoading,    setEmpLoading]    = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedDept,  setSelectedDept]  = useState("");
  const [payrollMonth,  setPayoutsMonth]  = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  });
  const [generatePdf,   setGeneratePdf]   = useState(true);

  // ── Run state ─────────────────────────────────────────────────────────────
  const [running,       setRunning]       = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [results,       setResults]       = useState(null);
  const [runDone,       setRunDone]       = useState(false);
  const [runError,      setRunError]      = useState("");
  const [processingMsg, setProcessingMsg] = useState("");
  const resultsRef  = useRef(null);
  const progressRef = useRef(null); // FIX: track interval so we can always clear it

  // ── Fetch employees ────────────────────────────────────────────────────────
  const fetchPersons = useCallback(async () => {
    setEmpLoading(true);
    try {
      const { tenantCode, companyId } = getTenantContext();
      if (!tenantCode || !companyId) { setEmpLoading(false); return; }
      const res  = await api.get("/api/users/tenant/employees");
      const json = res.data;
      const list = Array.isArray(json.data)
        ? json.data.filter(u => Number(u.companyId) === Number(companyId))
        : [];
      setPersons(list);
      const depts = [...new Set(list.map(e => e.department).filter(Boolean))];
      setDepartments(depts);
    } catch (err) {
      console.error("fetchPersons error:", err);
      toast.error("Failed to load employees. Check your connection.");
    } finally {
      setEmpLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchPersons(); }, [fetchPersons]);

  // ── Reset on mode change ───────────────────────────────────────────────────
  useEffect(() => {
    setResults(null); setRunDone(false); setRunError(""); setProgress(0);
  }, [mode]);

  // ── Cleanup interval on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, []);

  // ── Animate progress for batch operations ─────────────────────────────────
  const startProgressAnimation = (totalItems) => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    let p = 0;
    progressRef.current = setInterval(() => {
      p += (100 / Math.max(totalItems, 1)) * 0.4;
      if (p >= 92) {
        clearInterval(progressRef.current);
        progressRef.current = null;
        setProgress(92);
        return;
      }
      setProgress(Math.round(p));
    }, 150);
  };

  const stopProgressAnimation = () => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    setProgress(100);
  };

  // ── Run payroll ────────────────────────────────────────────────────────────
  const handleRun = async () => {
    const [y, m] = payrollMonth.split("-");
    const year  = parseInt(y, 10);
    const month = parseInt(m, 10);

    const { tenantCode, companyId } = getTenantContext();

    // Guard: validate tenant context
    if (!tenantCode) {
      toast.error("Tenant context missing. Please log in again.");
      return;
    }

    setRunning(true);
    setRunDone(false);
    setResults(null);
    setRunError("");
    setProgress(0);

    const body = JSON.stringify({ year, month, generatePdf });

    try {
      // ── SINGLE EMPLOYEE ──────────────────────────────────────────────────
      if (mode === "single") {
        if (!selectedEmpId) {
          toast.error("Select an employee first.");
          setRunning(false);
          return;
        }
        setProcessingMsg("Calculating salary from attendance & salary structure…");

        // Animate progress for single employee
        let p = 0;
        const timer = setInterval(() => {
          p = Math.min(p + 7, 90);
          setProgress(p);
          if (p >= 90) clearInterval(timer);
        }, 250);

        let res;
        try {
          // FIX 2: single employee endpoint only needs X-Tenant-Code, NOT X-Workspace-Id
          res = await api.post(`/api/auto-payroll/employee/${selectedEmpId}`, JSON.parse(body));
        } finally {
          clearInterval(timer);
        }

        setProgress(100);

        // FIX 3: Properly parse ApiResponse wrapper { success, message, data }
        const json = res.data;

        if (json.success === false) {
          throw new Error(json.message || "Server error");
        }

        // FIX 4: Backend wraps PayoutsHistory in json.data
        const record = json.data;
        if (!record) throw new Error("No payroll data returned from server.");

        // FIX 5: Map PayoutsHistory fields correctly
        // Backend entity fields: id, userId, userName, payrollMonth,
        //   netCompensation, lopDays, payslipPath, payslipGenerated, remarks, status
        const empName = record.userName
          || employees.find(e => String(e.id) === String(selectedEmpId))?.fullName
          || `Person #${selectedEmpId}`;

        setResults([{
          status:       "SUCCESS",
          employeeName: empName,
          employeeId:   selectedEmpId,
          payrollId:    record.id,
          netCompensation:    record.netCompensation,
          lopDays:      record.lopDays ?? 0,
          payslipUrl:   record.payslipPath || null,  // field is payslipPath not payslipUrl
          remarks:      record.remarks || "",
        }]);

        toast.success("Payouts generated successfully!", { autoClose: 3000, theme: "colored" });

      // ── ALL EMPLOYEES ────────────────────────────────────────────────────
      } else if (mode === "all") {
        // Guard: companyId is required for batch
        if (!companyId) {
          toast.error("Workspace ID missing. Please log in again.");
          setRunning(false);
          return;
        }

        const total = employees.length || 5;
        setProcessingMsg(`Processing ${total} employee(s)…`);
        startProgressAnimation(total);

        let res;
        try {
          // FIX 6: Both X-Tenant-Code AND X-Workspace-Id required for batch
          res = await api.post("/api/auto-payroll/all", JSON.parse(body));
        } finally {
          stopProgressAnimation();
        }

        const json = res.data;

        if (json.success === false) {
          throw new Error(json.message || "Server error");
        }

        // FIX 7: Backend returns ApiResponse<List<Map<String,Object>>>
        // json.data is the List, fallback to json itself if already an array
        const list = Array.isArray(json.data) ? json.data
                   : Array.isArray(json)       ? json
                   : [];

        setResults(list);

        const successCount = list.filter(r => r.status === "SUCCESS").length;
        const skippedCount = list.filter(r => r.status === "SKIPPED").length;
        const failedCount  = list.filter(r => r.status === "FAILED").length;
        toast.success(
          `Batch complete — ${successCount} success, ${skippedCount} skipped, ${failedCount} failed.`,
          { autoClose: 5000, theme: "colored" }
        );

      // ── DEPARTMENT-WISE ──────────────────────────────────────────────────
      } else if (mode === "department") {
        if (!selectedDept) {
          toast.error("Select a department first.");
          setRunning(false);
          return;
        }
        if (!companyId) {
          toast.error("Workspace ID missing. Please log in again.");
          setRunning(false);
          return;
        }

        const deptEmps = employees.filter(e => e.department === selectedDept).length || 3;
        setProcessingMsg(`Processing ${deptEmps} employee(s) in ${selectedDept}…`);
        startProgressAnimation(deptEmps);

        const deptEncoded = encodeURIComponent(selectedDept);
        let res;
        try {
          res = await api.post(`/api/auto-payroll/department/${deptEncoded}`, JSON.parse(body));
        } finally {
          stopProgressAnimation();
        }

        const json = res.data;

        if (json.success === false) {
          throw new Error(json.message || "Server error");
        }

        const list = Array.isArray(json.data) ? json.data
                   : Array.isArray(json)       ? json
                   : [];

        setResults(list);

        const successCount = list.filter(r => r.status === "SUCCESS").length;
        toast.success(
          `Department payroll done — ${successCount} of ${list.length} processed.`,
          { autoClose: 4000, theme: "colored" }
        );
      }

    } catch (err) {
      console.error("handleRun error:", err);
      // FIX 8: reset progress on error (don't leave it stuck at 92%)
      setProgress(0);
      const msg = err.message || "Payouts generation failed. Please try again.";
      setRunError(msg);
      toast.error(msg, { autoClose: 6000 });
    } finally {
      setRunning(false);
      setRunDone(true);
      setProcessingMsg("");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedPerson = employees.find(e => String(e.id) === String(selectedEmpId));

  const canRun = !running && !!payrollMonth && (
    (mode === "single"     && !!selectedEmpId) ||
    (mode === "all"        && employees.length > 0) ||
    (mode === "department" && !!selectedDept)
  );

  const summary = results && results.length > 0 ? {
    total:    results.length,
    success:  results.filter(r => r.status === "SUCCESS").length,
    skipped:  results.filter(r => r.status === "SKIPPED").length,
    failed:   results.filter(r => r.status === "FAILED").length,
    totalNet: results
      .filter(r => r.status === "SUCCESS")
      .reduce((s, r) => s + (Number(r.netCompensation) || 0), 0),
  } : null;

  // ── Toggle component ───────────────────────────────────────────────────────
  const Toggle = ({ value, onChange, label }) => (
    <div className="ap-toggle" onClick={() => onChange(!value)}>
      <div className="ap-toggle-track" style={{ background: value ? C.coral : "#e2e8f0" }}>
        <div className="ap-toggle-thumb" style={{ left: value ? "calc(100% - 19px)" : "3px" }}/>
      </div>
      <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>{label}</span>
    </div>
  );

  // ── Status icon ────────────────────────────────────────────────────────────
  const StatusIcon = ({ status }) => {
    if (status === "SUCCESS") return (
      <div style={{ width:28,height:28,borderRadius:8,background:"rgba(16,185,129,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
        <Ic d={ICONS.check} size={14} sw={2.5} color={C.green}/>
      </div>
    );
    if (status === "SKIPPED") return (
      <div style={{ width:28,height:28,borderRadius:8,background:"rgba(245,158,11,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
        <Ic d={ICONS.skip} size={14} sw={2.5} color={C.amber}/>
      </div>
    );
    return (
      <div style={{ width:28,height:28,borderRadius:8,background:"rgba(239,68,68,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
        <Ic d={ICONS.x} size={14} sw={2.5} color={C.red}/>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="ap">

        {/* ── Hero ── */}
        <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy2} 60%,#28445D 100%)`, padding:"24px 28px", marginBottom:24, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-40,right:80,width:200,height:200,borderRadius:"50%",background:"rgba(139,92,246,.1)",filter:"blur(50px)",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",bottom:-30,left:100,width:160,height:160,borderRadius:"50%",background:"rgba(6,182,212,.08)",filter:"blur(40px)",pointerEvents:"none" }}/>
          <div style={{ position:"relative",zIndex:2 }}>
            <button onClick={() => go("finance")}
              style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"8px 14px",border:"none",borderRadius:11,background:"rgba(255,255,255,.1)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:14 }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.18)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>
              <Ic d={ICONS.arrowL} size={13} color="#fff" sw={2.5}/> MoneyOps
            </button>

            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap" }}>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                  <div style={{ width:38,height:38,borderRadius:12,background:"rgba(139,92,246,.2)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <Ic d={ICONS.zap} size={20} color={C.coral} sw={2}/>
                  </div>
                  <div>
                    <div style={{ fontFamily:"Sora,sans-serif",fontSize:24,fontWeight:900,color:"#fff",lineHeight:1 }}>Auto Payouts</div>
                    <div style={{ fontSize:12,color:"rgba(255,255,255,.5)",marginTop:2 }}>Presence-driven payroll computation engine</div>
                  </div>
                </div>
                <p style={{ fontSize:12,color:"rgba(255,255,255,.4)",margin:0,maxWidth:520 }}>
                  Automatically calculates salaries using attendance data, salary structures, PF, TDS and LOP deductions — exactly like a real-world workforce platform.
                </p>
              </div>
              <button onClick={() => go("payroll")}
                style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"10px 16px",border:"1px solid rgba(255,255,255,.2)",borderRadius:11,background:"rgba(255,255,255,.08)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.15)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}>
                <Ic d={ICONS.file} size={13} color="#fff"/> View Payoutss
              </button>
            </div>

            <div style={{ display:"flex",gap:8,marginTop:18,flexWrap:"wrap" }}>
              {[
                "✓ Fetches salary structure from DB",
                "✓ Calculates LOP from attendance",
                "✓ Applies PF, TDS, PT automatically",
                "✓ Generates payslip PDF (optional)",
              ].map(t => (
                <div key={t} style={{ fontSize:10,fontWeight:700,color:"rgba(255,255,255,.65)",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",borderRadius:999,padding:"4px 12px" }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:820, margin:"0 auto", padding:"0 20px 60px" }}>

          {/* ── Mode selector ── */}
          <div style={{ display:"flex",gap:10,marginBottom:22 }}>
            {[
              { id:"single",     label:"Single Person",  icon:"user"     },
              { id:"all",        label:"All Persons",    icon:"users"    },
              { id:"department", label:"By Department",    icon:"building" },
            ].map(m => (
              <button key={m.id} className={`ap-mode-btn ${mode===m.id?"active":""}`}
                onClick={() => setMode(m.id)}>
                <Ic d={ICONS[m.icon]} size={15} sw={2} color={mode===m.id?"#fff":C.muted}/>
                {m.label}
              </button>
            ))}
          </div>

          {/* ── Config card ── */}
          <div className="ap-card ap-in" style={{ marginBottom:20 }}>
            <div className="ap-card-head">
              <div style={{ width:38,height:38,borderRadius:12,background:"rgba(139,92,246,.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Ic d={ICONS.calendar} size={17} color={C.coral} sw={2}/>
              </div>
              <div>
                <div style={{ fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:800,color:C.navy }}>Payouts Configuration</div>
                <div style={{ fontSize:12,color:"#8A98A9",marginTop:1 }}>Set the period and scope for this payroll run</div>
              </div>
            </div>
            <div className="ap-card-body" style={{ display:"flex",flexDirection:"column",gap:16 }}>

              {/* Period */}
              <div>
                <label className="ap-label">Payouts Month <span style={{color:C.coral}}>*</span></label>
                <input
                  type="month"
                  value={payrollMonth}
                  onChange={e => setPayoutsMonth(e.target.value)}
                  className="ap-input"
                />
              </div>

              {/* Single employee */}
              {mode === "single" && (
                <div>
                  <label className="ap-label">Person <span style={{color:C.coral}}>*</span></label>
                  <select
                    value={selectedEmpId}
                    onChange={e => setSelectedEmpId(e.target.value)}
                    className="ap-select"
                    disabled={empLoading}
                  >
                    <option value="">
                      {empLoading ? "Loading employees…" : employees.length === 0 ? "No employees found" : "— Select an employee —"}
                    </option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName || emp.name || emp.email || `Emp #${emp.id}`}
                        {emp.department ? ` — ${emp.department}` : ""}
                      </option>
                    ))}
                  </select>
                  {selectedPerson && (
                    <div style={{ marginTop:10,padding:"12px 14px",background:"rgba(6,182,212,.06)",borderRadius:12,border:"1.5px solid rgba(6,182,212,.2)",display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.coral},#06B6D4)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:900,flexShrink:0 }}>
                        {String(selectedPerson.fullName || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontFamily:"Sora,sans-serif",fontSize:13,fontWeight:800,color:C.navy }}>
                          {selectedPerson.fullName || selectedPerson.email}
                        </div>
                        <div style={{ fontSize:11,color:C.muted,marginTop:1 }}>
                          {selectedPerson.department || "—"} · {selectedPerson.position || selectedPerson.designation || "—"}
                        </div>
                      </div>
                      <div style={{ marginLeft:"auto" }}>
                        <div className="ap-badge success">Selected</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* All employees */}
              {mode === "all" && (
                <div style={{ padding:"14px 16px",background:"rgba(99,102,241,.05)",borderRadius:14,border:"1.5px solid rgba(99,102,241,.2)" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <Ic d={ICONS.info} size={15} color={C.indigo} sw={2}/>
                    <div>
                      <div style={{ fontSize:13,fontWeight:700,color:C.navy }}>
                        {empLoading ? "Loading…" : `${employees.length} employee(s) will be processed`}
                      </div>
                      <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>
                        Persons with no salary structure configured will be skipped automatically.
                      </div>
                    </div>
                  </div>
                  {departments.length > 0 && (
                    <div style={{ display:"flex",gap:6,marginTop:10,flexWrap:"wrap" }}>
                      {departments.map(d => (
                        <div key={d} style={{ fontSize:10,fontWeight:700,color:C.teal,background:"rgba(6,182,212,.1)",border:"1px solid rgba(6,182,212,.2)",borderRadius:999,padding:"3px 10px" }}>
                          {d}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Department */}
              {mode === "department" && (
                <div>
                  <label className="ap-label">Department <span style={{color:C.coral}}>*</span></label>
                  <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    className="ap-select"
                    disabled={empLoading || departments.length === 0}
                  >
                    <option value="">
                      {departments.length === 0 ? "No departments found" : "— Select a department —"}
                    </option>
                    {departments.map(d => (
                      <option key={d} value={d}>
                        {d} ({employees.filter(e => e.department === d).length} employees)
                      </option>
                    ))}
                  </select>
                  {selectedDept && (
                    <div style={{ marginTop:8,fontSize:12,color:C.muted,fontWeight:600 }}>
                      {employees.filter(e => e.department === selectedDept).length} employee(s) in {selectedDept}
                    </div>
                  )}
                </div>
              )}

              {/* Options */}
              <div style={{ padding:"14px 16px",background:"#FAFBFD",borderRadius:14,border:`1.5px solid ${C.border}` }}>
                <div style={{ fontSize:12,fontWeight:700,color:C.navy,marginBottom:12 }}>Options</div>
                <Toggle value={generatePdf} onChange={setGeneratePdf} label="Generate payslip PDF (uploaded to Cloudinary)"/>
                <div style={{ fontSize:11,color:C.muted,marginTop:6,marginLeft:52 }}>
                  If enabled, a PDF salary slip is created and stored for each employee. Slower but required for payslip downloads.
                </div>
              </div>

              {/* Run button */}
              <button
                className={`ap-run-btn ${running ? "running" : ""}`}
                onClick={handleRun}
                disabled={!canRun}
              >
                {running ? (
                  <>
                    <div className="ap-spin" style={{ width:18,height:18 }}/>
                    {processingMsg || "Processing…"}
                  </>
                ) : (
                  <>
                    <Ic d={ICONS.play} size={16} color="#fff" sw={2}/>
                    {mode === "single"     ? "Generate Payouts"
                   : mode === "all"        ? `Run Batch for All ${employees.length} Persons`
                   :                         `Run for ${selectedDept || "Selected Department"}`}
                  </>
                )}
              </button>

              {/* Progress */}
              {(running || (runDone && progress > 0)) && (
                <div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,fontWeight:600,marginBottom:4 }}>
                    <span>{running ? "Processing…" : "Complete"}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="ap-prog-track">
                    <div className="ap-prog-fill" style={{ width:`${progress}%` }}/>
                  </div>
                </div>
              )}

              {/* Error */}
              {runError && !running && (
                <div style={{ padding:"12px 14px",background:"rgba(239,68,68,.06)",borderRadius:12,border:"1.5px solid rgba(239,68,68,.2)",fontSize:13,color:C.red,fontWeight:600,display:"flex",alignItems:"flex-start",gap:8 }}>
                  <Ic d={ICONS.x} size={15} color={C.red} sw={2.5}/>
                  <span>{runError}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Results ── */}
          {results && runDone && !running && (
            <div ref={resultsRef} className="ap-in" style={{ display:"flex",flexDirection:"column",gap:16 }}>

              {/* Summary strip */}
              {summary && (
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12 }}>
                  {[
                    { label:"Total",        val:summary.total,               color:C.navy,  bg:"#fff"                          },
                    { label:"Success",       val:summary.success,             color:C.green, bg:"rgba(16,185,129,.06)"           },
                    { label:"Skipped",       val:summary.skipped,             color:C.amber, bg:"rgba(245,158,11,.06)"           },
                    { label:"Failed",        val:summary.failed,              color:C.red,   bg:"rgba(239,68,68,.06)"            },
                    { label:"Total Payout",  val:`₹${fmt(summary.totalNet)}`, color:C.coral, bg:"rgba(139,92,246,.05)", wide:true },
                  ].map(s => (
                    <div key={s.label} style={{ background:s.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"14px 16px",gridColumn:s.wide?"span 2":undefined }}>
                      <div style={{ fontSize:9,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4 }}>{s.label}</div>
                      <div style={{ fontFamily:"Sora,sans-serif",fontSize:s.wide?18:24,fontWeight:900,color:s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Results list */}
              <div className="ap-card">
                <div className="ap-card-head">
                  <Ic d={ICONS.file} size={16} color={C.teal} sw={2}/>
                  <div style={{ fontFamily:"Sora,sans-serif",fontSize:14,fontWeight:800,color:C.navy }}>
                    Payouts Results — {payrollMonth}
                  </div>
                  <div style={{ marginLeft:"auto",fontSize:11,color:C.muted,fontWeight:600 }}>
                    {results.length} record(s)
                  </div>
                </div>
                <div style={{ padding:16,display:"flex",flexDirection:"column",gap:8,maxHeight:540,overflowY:"auto" }}>
                  {results.map((r, i) => {
                    // FIX 9: Normalise status to uppercase for comparison
                    const status = (r.status || "FAILED").toUpperCase();
                    const statusClass = status.toLowerCase();
                    return (
                      <div
                        key={i}
                        className={`ap-result-row ${statusClass}`}
                        style={{ animationDelay:`${i * 0.03}s` }}
                      >
                        <StatusIcon status={status}/>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontSize:13,fontWeight:700,color:C.navy,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>
                            {r.employeeName || `Person #${r.employeeId}`}
                          </div>
                          {status === "SUCCESS" && (
                            <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>
                              Net: <b style={{color:C.green}}>₹{fmt(r.netCompensation)}</b>
                              {(r.lopDays > 0) && <> · LOP: <b style={{color:C.red}}>{r.lopDays} day(s)</b></>}
                            </div>
                          )}
                          {status === "SKIPPED" && (
                            <div style={{ fontSize:11,color:C.amber,marginTop:2 }}>
                              {r.reason || "Skipped — no salary structure configured"}
                            </div>
                          )}
                          {status === "FAILED" && (
                            <div style={{ fontSize:11,color:C.red,marginTop:2 }}>
                              {r.reason || "Unknown error"}
                            </div>
                          )}
                        </div>
                        <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                          <div className={`ap-badge ${statusClass}`}>{status}</div>
                          {r.payslipUrl && (
                            <a
                              href={r.payslipUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:700,color:C.teal,background:"rgba(6,182,212,.1)",padding:"3px 9px",borderRadius:999,border:"1px solid rgba(6,182,212,.2)",textDecoration:"none" }}
                            >
                              <Ic d={ICONS.pdf} size={11} color={C.teal} sw={2}/> PDF
                            </a>
                          )}
                          {r.payrollId && (
                            <div style={{ fontSize:10,color:C.muted,fontWeight:600 }}>#{r.payrollId}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* How it was calculated */}
              <div className="ap-card" style={{ padding:0,overflow:"hidden" }}>
                <div
                  style={{ padding:"14px 20px",background:`linear-gradient(135deg,${C.navy},${C.navy2})`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                  onClick={e => {
                    const body = e.currentTarget.nextSibling;
                    body.style.display = body.style.display === "none" ? "block" : "none";
                  }}
                >
                  <div style={{ fontFamily:"Sora,sans-serif",fontSize:13,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:8 }}>
                    <Ic d={ICONS.info} size={14} color="rgba(255,255,255,.6)" sw={2}/> How was salary calculated?
                  </div>
                  <Ic d={ICONS.chevD} size={14} color="rgba(255,255,255,.5)" sw={2}/>
                </div>
                <div style={{ padding:"18px 20px",display:"none" }}>
                  {[
                    ["Step 1", "Fetch salary structure (basic, HRA, allowances, PF, TDS)", C.teal],
                    ["Step 2", "Fetch monthly attendance → get working days, absent days, leave days, half days", C.coral],
                    ["Step 3", "Calculate attendance factor = effectiveDays / totalWorkingDays", C.amber],
                    ["Step 4", "Scale all earnings by attendance factor (LOP applied proportionally)", C.purple],
                    ["Step 5", "Apply statutory deductions (PF, ESI, PT, TDS) on full structure", C.indigo],
                    ["Step 6", "Net = (Scaled Earnings) − (Deductions). Saved as PayoutsHistory (PENDING)", C.green],
                    ["Step 7", "If generatePdf=true → create salary slip PDF → upload to Cloudinary", C.teal],
                  ].map(([step, desc, color]) => (
                    <div key={step} style={{ display:"flex",gap:12,marginBottom:12 }}>
                      <div style={{ width:52,flexShrink:0,fontFamily:"Sora,sans-serif",fontSize:11,fontWeight:800,color,background:`rgba(0,0,0,.05)`,borderRadius:8,padding:"3px 6px",textAlign:"center",height:"fit-content",marginTop:1 }}>
                        {step}
                      </div>
                      <div style={{ fontSize:12,color:C.muted,fontWeight:500,lineHeight:1.6 }}>{desc}</div>
                    </div>
                  ))}
                  <div style={{ marginTop:4,padding:"10px 14px",background:"rgba(139,92,246,.06)",borderRadius:10,fontSize:12,color:C.coral,fontWeight:600,border:"1px solid rgba(139,92,246,.15)" }}>
                    ✓ All records are saved with status PENDING. Use Payout Control to approve and mark as PAID.
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                <button
                  className="ap-run-btn"
                  style={{ flex:1,padding:"12px",fontSize:13 }}
                  onClick={() => {
                    setResults(null);
                    setRunDone(false);
                    setProgress(0);
                    setRunError("");
                  }}
                >
                  <Ic d={ICONS.refresh} size={14} color="#fff"/> Run Again
                </button>
                <button
                  onClick={() => go("payroll")}
                  style={{ flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px",border:`1.5px solid ${C.border}`,borderRadius:14,background:"#fff",color:C.navy,fontSize:13,fontWeight:700,cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background="#fff"}
                >
                  <Ic d={ICONS.file} size={14} color={C.navy}/> View in Payout Control
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right"/>
    </>
  );
}