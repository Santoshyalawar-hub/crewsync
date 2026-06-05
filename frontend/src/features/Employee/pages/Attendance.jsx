import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import api from "@/lib/apiClient";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// ── IST Time Helpers ──────────────────────────────────────────────────────────

const fmtTimeIST = (val) => {
  if (!val) return null;
  const s = String(val).trim();
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(s)) return s;
  const timeOnly = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (timeOnly) {
    const h   = parseInt(timeOnly[1], 10);
    const m   = timeOnly[2];
    const suf = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(h12).padStart(2, "0")}:${m} ${suf}`;
  }
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch { return null; }
};

const nowIST = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
    timeZone: "Asia/Kolkata",
  });

const todayKeyIST = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric", month: "2-digit", day: "2-digit",
    timeZone: "Asia/Kolkata",
  }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${p.year}-${p.month}-${p.day}`;
};

// ─────────────────────────────────────────────────────────────────────────────


const STATUS_CFG = {
  notstarted: { label: "Not Started"  },
  working:    { label: "Working"      },
  completed:  { label: "Day Complete" },
};

const getCodeInfo = (status) => {
  const s = String(status || "").toUpperCase().trim();
  if (s === "HALF_DAY" || s === "HALF" || s === "HALF DAY")
    return { code: "HD", color: "#14b8a6", label: "Half Day" };
  if (s === "PRESENT" || s === "WORKING" || s === "FULL" ||
      s === "FULL_DAY" || s === "COMPLETED" || s === "ON_BREAK")
    return { code: "P", color: "#0ea5e9", label: "Present" };
  if (s.includes("LEAVE") || s.includes("SICK"))
    return { code: "L", color: "#8b5cf6", label: "Leave" };
  if (s === "HOLIDAY" || s === "PUBLIC_HOLIDAY" ||
      s.includes("HOLIDAY") || s.includes("COMP") || s.includes("WEEKEND"))
    return { code: "H", color: "#eab308", label: "Holiday" };
  if (s === "ABSENT" || s === "NOSHOW" || s === "NO_SHOW" || s.includes("ABSENT"))
    return { code: "A", color: "#f97316", label: "Absent" };
  return null;
};

const MAX_WORK_SECONDS = 9 * 60 * 60;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
.atd * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
.atd {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #fff7ed 100%);
  padding: 20px;
}
.ctrl-panel {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  padding: 14px 18px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 0;
}
.ctrl-divider {
  width: 1.5px; background: #f1f5f9;
  align-self: stretch; margin: 0 16px; flex-shrink: 0;
}
.time-stat {
  display: flex; flex-direction: column; align-items: center;
  gap: 1px; min-width: 80px;
}
.time-label {
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .07em;
}
.time-value {
  font-size: 18px; font-weight: 900;
  font-variant-numeric: tabular-nums; line-height: 1.1;
}
.punch-btn {
  border: none; border-radius: 10px;
  padding: 9px 16px; font-size: 13px; font-weight: 800;
  cursor: pointer; transition: all .15s;
  display: flex; align-items: center; justify-content: center;
  gap: 6px; color: #fff; white-space: nowrap;
}
.punch-btn:hover  { transform: translateY(-1px); filter: brightness(1.06); }
.punch-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.btn-green { background: linear-gradient(135deg,#10b981,#34d399); box-shadow: 0 4px 12px rgba(16,185,129,.25); }
.btn-red   { background: linear-gradient(135deg,#ef4444,#f87171); box-shadow: 0 4px 12px rgba(239,68,68,.25); }
.atd-table-wrap {
  background: #fff; border-radius: 20px; border: 1.5px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0,0,0,.07); overflow-x: auto; padding: 0;
}
.atd-table { width: 100%; border-collapse: collapse; }
.atd-table thead tr th {
  background: #1e293b; color: #94a3b8;
  font-size: 12px; font-weight: 800; letter-spacing: .04em;
  padding: 13px 0; text-align: center;
  border-right: 1px solid rgba(255,255,255,.06);
  white-space: nowrap; min-width: 42px;
}
.atd-table thead tr th:first-child {
  text-align: left; padding-left: 20px; min-width: 90px;
  font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
}
.day-badge {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; color: #fff; margin: 0 auto;
  transition: transform .12s, box-shadow .12s;
  box-shadow: 0 2px 6px rgba(0,0,0,.15); cursor: default;
}
.day-badge:hover { transform: scale(1.18); box-shadow: 0 4px 12px rgba(0,0,0,.2); }
.legend-pill {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 10px; padding: 6px 14px;
  font-size: 13px; font-weight: 700; color: #334155;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.legend-badge {
  width: 26px; height: 26px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; color: #fff; flex-shrink: 0;
}
.auto-banner {
  background: linear-gradient(135deg,#fff7ed,#ffedd5);
  border: 1.5px solid #fed7aa; border-radius: 12px;
  padding: 10px 16px; margin-bottom: 14px;
  font-size: 13px; font-weight: 700; color: #c2410c;
  display: flex; align-items: center; gap: 8px;
}
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.45);
  backdrop-filter: blur(6px); display: flex;
  align-items: center; justify-content: center; z-index: 50; padding: 16px;
}
.modal {
  background: #fff; border-radius: 22px;
  width: 100%; max-width: 480px; max-height: 90vh;
  overflow: hidden; display: flex; flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,.18); border: 1.5px solid #e2e8f0;
}
.modal-input {
  width: 100%; border: 1.5px solid #e2e8f0; border-radius: 11px;
  padding: 10px 13px; font-size: 14px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1e293b; outline: none; transition: border-color .15s; background: #fff;
}
.modal-input:focus { border-color: #f97316; }
.modal-label {
  font-size: 11px; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: .07em;
  margin-bottom: 5px; display: block;
}
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.anim  { animation: fadeUp .3s ease both; }
.anim2 { animation: fadeUp .3s .06s ease both; }
`;

// ─────────────────────────────────────────────────────────────────────────────
export default function Attendance() {
  const todayKey = todayKeyIST();
  const today    = new Date();

  const [selectedYear,     setSelectedYear]     = useState(today.getFullYear());
  const [status,           setStatus]           = useState("notstarted");
  const [workSeconds,      setWorkSeconds]      = useState(0);
  const [shiftStartTime,   setShiftStartTime]   = useState(null);
  const [shiftEndTime,     setShiftEndTime]     = useState(null);
  const [shiftDate,        setShiftDate]        = useState(null);
  const [workStartedToday, setWorkStartedToday] = useState(false);
  const [autoClockOutMsg,  setAutoClockOutMsg]  = useState(null);

  const intervalRef  = useRef(null);
  const autoCheckRef = useRef(null);

  // Guard ref prevents fetchYearData from running concurrently or
  // re-entering while a previous fetch is still in-flight.
  const fetchingRef    = useRef(false);
  const fetchedYearRef = useRef(null);

  const [showLeaveModal,      setShowLeaveModal]      = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [yearData,    setYearData]    = useState({});
  const [loadingYear, setLoadingYear] = useState(false);

  const empName = localStorage.getItem("userName") || "Employee";

  const getUserKey = (key) => {
    const uid = localStorage.getItem("userId");
    return uid ? `${key}_${uid}` : key;
  };

  const shouldShowCheckIn = () =>
    (shiftDate === todayKey || workStartedToday) && !!shiftStartTime;

  // ── Visible months ────────────────────────────────────────────────────────
  const visibleMonths = useMemo(() => {
    const maxMonth = selectedYear === today.getFullYear() ? today.getMonth() : 11;
    return Array.from({ length: maxMonth + 1 }, (_, i) => i);
  }, [selectedYear]);

  // ── Year-level stats ──────────────────────────────────────────────────────
  const yearStats = useMemo(() => {
    let present = 0, halfDay = 0, sick = 0, absent = 0, holiday = 0;
    visibleMonths.forEach(m => {
      const mk    = `${selectedYear}-${String(m + 1).padStart(2, "0")}`;
      const mdata = yearData[mk] || {};
      const daysInM = new Date(selectedYear, m + 1, 0).getDate();
      for (let d = 1; d <= daysInM; d++) {
        const dk       = `${mk}-${String(d).padStart(2, "0")}`;
        const isWeekend= new Date(selectedYear, m, d).getDay() % 6 === 0;
        const bd       = mdata[dk] || mdata.days?.find?.(x => x.date === dk);
        const raw      = String(bd?.status || "").toUpperCase().trim();
        if      (raw === "HALF_DAY" || raw === "HALF") halfDay++;
        else if (raw === "PRESENT" || raw === "WORKING" || raw === "FULL" || raw === "FULL_DAY" || raw === "COMPLETED" || raw === "ON_BREAK") present++;
        else if (raw.includes("LEAVE") || raw.includes("SICK")) sick++;
        else if (raw === "HOLIDAY" || raw.includes("HOLIDAY") || raw.includes("COMP") || isWeekend) holiday++;
        else if (raw === "ABSENT" || raw.includes("ABSENT") || raw === "NOSHOW" || raw === "NO_SHOW") absent++;
      }
    });
    return { present, halfDay, sick, absent, holiday };
  }, [yearData, visibleMonths, selectedYear]);

  // ── Fetch calendar data ───────────────────────────────────────────────────
  const fetchYearData = useCallback(async (year) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    const uid  = Number(localStorage.getItem("userId"));
    if (!uid) { fetchingRef.current = false; return; }

    setLoadingYear(true);
    const maxMonth = year === today.getFullYear() ? today.getMonth() : 11;
    const results  = {};

    await Promise.all(
      Array.from({ length: maxMonth + 1 }, (_, i) => i).map(async (m) => {
        try {
          const r = await api.get(`/api/attendance/calendar/${uid}/${year}/${m + 1}`);
          const mk  = `${year}-${String(m + 1).padStart(2, "0")}`;
          const raw = r.data?.data || {};

          if (raw.days && Array.isArray(raw.days)) {
            const indexed = {};
            raw.days.forEach(day => { if (day.date) indexed[day.date] = day; });
            results[mk] = indexed;
          } else {
            results[mk] = raw;
          }
        } catch { /* ignore per-month errors */ }
      })
    );

    setYearData(results);
    fetchedYearRef.current = year;
    setLoadingYear(false);
    fetchingRef.current = false;
  }, []);

  const getDayStatus = (year, month, dayNum) => {
    const mk      = `${year}-${String(month + 1).padStart(2, "0")}`;
    const dk      = `${mk}-${String(dayNum).padStart(2, "0")}`;
    const mdata   = yearData[mk] || {};
    const bd      = mdata[dk] || mdata.days?.find?.(x => x.date === dk);
    const isWknd  = new Date(year, month, dayNum).getDay() % 6 === 0;
    if (bd?.status) return bd.status;
    if (isWknd)     return "HOLIDAY";
    return null;
  };

  const getMonthStats = (month) => {
    let present = 0, sick = 0, absent = 0;
    const daysInM = new Date(selectedYear, month + 1, 0).getDate();
    for (let d = 1; d <= daysInM; d++) {
      const raw = String(getDayStatus(selectedYear, month, d) || "").toUpperCase().trim();
      if      (raw === "PRESENT" || raw === "WORKING" || raw === "FULL" || raw === "FULL_DAY" || raw === "COMPLETED") present++;
      else if (raw === "HALF_DAY" || raw === "HALF") present += 0.5;
      else if (raw.includes("LEAVE") || raw.includes("SICK")) sick++;
      else if (raw === "ABSENT" || raw.includes("ABSENT") || raw === "NOSHOW") absent++;
    }
    return { present: Math.round(present), sick, absent };
  };

  // ── Auto clock-out ────────────────────────────────────────────────────────
  const triggerAutoClockOut = useCallback(async () => {
    const uid  = Number(localStorage.getItem("userId"));
    if (!uid) return;
    try {
      await api.post("/api/attendance/end-work", { employeeId: uid });
      if (intervalRef.current)  { clearInterval(intervalRef.current);  intervalRef.current  = null; }
      if (autoCheckRef.current) { clearInterval(autoCheckRef.current); autoCheckRef.current = null; }
      const ts = nowIST();
      setShiftEndTime(ts); setShiftDate(todayKey);
      setStatus("completed"); setWorkStartedToday(true);
      localStorage.setItem(getUserKey("workCompletedToday"), todayKey);
      localStorage.setItem(getUserKey("shiftEndTime"), ts);
      setAutoClockOutMsg(`Auto Clock-Out at ${ts} — 9 hours completed. Marked as Present.`);
      fetchYearData(selectedYear);
    } catch (e) { console.error("Auto clock-out failed:", e); }
  }, [selectedYear, todayKey, fetchYearData]);

  // ── Load today's attendance from backend ──────────────────────────────────
  const loadTodayAttendance = useCallback(async () => {
    const uid  = Number(localStorage.getItem("userId"));
    if (!uid) return;
    try {
      const resp   = await api.get(`/api/attendance/today/${uid}`);
      const parsed = resp.data;
      const payload = parsed?.data ?? parsed;

      const rawStatus = payload?.status;
      const backendStatus = (
        typeof rawStatus === "string"
          ? rawStatus
          : typeof rawStatus === "object" && rawStatus !== null
            ? (rawStatus.name ?? "")
            : ""
      ).toLowerCase().trim();

      const totalSecs = Number(payload?.totalSeconds ?? 0);
      const rawStart  = payload?.shiftStartTime ?? payload?.startTime  ?? null;
      const rawEnd    = payload?.shiftEndTime   ?? payload?.endTime    ?? null;

      const storedStart     = localStorage.getItem(getUserKey("shiftStartTime"));
      const storedEnd       = localStorage.getItem(getUserKey("shiftEndTime"));
      const storedShiftDate = localStorage.getItem(getUserKey("shiftDate"));
      const completedDate   = localStorage.getItem(getUserKey("workCompletedToday"));

      if (completedDate === todayKey) {
        setWorkStartedToday(true);
        setStatus("completed");
      }

      if (rawStart) {
        const f = fmtTimeIST(rawStart);
        if (f) {
          setShiftStartTime(f);
          setShiftDate(todayKey);
          localStorage.setItem(getUserKey("shiftStartTime"), f);
          localStorage.setItem(getUserKey("shiftDate"), todayKey);
        }
      } else if (storedStart && storedShiftDate === todayKey) {
        setShiftStartTime(storedStart);
        setShiftDate(todayKey);
      }

      if (rawEnd) {
        const f = fmtTimeIST(rawEnd);
        if (f) {
          setShiftEndTime(f);
          localStorage.setItem(getUserKey("shiftEndTime"), f);
        }
      } else if (storedEnd && storedShiftDate === todayKey) {
        setShiftEndTime(storedEnd);
      }

      if (backendStatus === "working" || backendStatus === "on_break" || backendStatus === "onbreak") {
        setStatus("working");
        setWorkSeconds(totalSecs);
        setWorkStartedToday(true);
        localStorage.setItem(getUserKey("workStartedToday"), "true");
        localStorage.setItem(getUserKey("workStartDate"),    todayKey);
        localStorage.setItem(getUserKey("shiftDate"),        todayKey);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => setWorkSeconds(p => p + 1), 1000);

      } else if (
        backendStatus === "completed" || backendStatus === "half_day" ||
        backendStatus === "present"   || backendStatus === "partial"
      ) {
        setStatus("completed");
        setWorkSeconds(totalSecs);
        setWorkStartedToday(true);
        localStorage.setItem(getUserKey("workCompletedToday"), todayKey);

      } else {
        const storedDate = localStorage.getItem(getUserKey("workStartDate"));
        if (storedDate === todayKey) {
          setWorkStartedToday(true);
          setShiftDate(localStorage.getItem(getUserKey("shiftDate")));
        } else {
          setWorkStartedToday(false);
          setShiftStartTime(null); setShiftEndTime(null); setShiftDate(null);
          ["workStartedToday","workStartDate","shiftDate",
           "shiftStartTime","shiftEndTime","workCompletedToday"]
            .forEach(k => localStorage.removeItem(getUserKey(k)));
          setStatus("notstarted");
        }
      }
    } catch (e) {
      console.error("loadTodayAttendance:", e);
    }
  }, [todayKey]);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    loadTodayAttendance();
    fetchYearData(today.getFullYear());
    return () => {
      if (intervalRef.current)  clearInterval(intervalRef.current);
      if (autoCheckRef.current) clearInterval(autoCheckRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetchedYearRef.current !== selectedYear) {
      fetchYearData(selectedYear);
    }
  }, [selectedYear, fetchYearData]);

  useEffect(() => {
    if (status === "working" && workSeconds >= MAX_WORK_SECONDS) {
      triggerAutoClockOut();
    }
  }, [workSeconds, status, triggerAutoClockOut]);

  // ── Clock In ──────────────────────────────────────────────────────────────
  const startWork = async () => {
    if (workStartedToday) { alert("Shift already started today."); return; }
    const uid  = Number(localStorage.getItem("userId"));
    if (!uid) { alert("Not logged in."); return; }
    try {
      const r = await api.post("/api/attendance/start-work", { employeeId: uid });
      const parsed = r.data;
      if (!parsed?.success && parsed?.message) { alert(parsed.message); return; }
      const ts = nowIST();
      setShiftStartTime(ts); setShiftDate(todayKey);
      setStatus("working"); setWorkStartedToday(true); setWorkSeconds(0);
      localStorage.setItem(getUserKey("workStartedToday"), "true");
      localStorage.setItem(getUserKey("workStartDate"),    todayKey);
      localStorage.setItem(getUserKey("shiftDate"),        todayKey);
      localStorage.setItem(getUserKey("shiftStartTime"),   ts);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => setWorkSeconds(p => p + 1), 1000);
      fetchedYearRef.current = null;
      fetchYearData(selectedYear);
    } catch { alert("Network error."); }
  };

  // ── Clock Out ─────────────────────────────────────────────────────────────
  const endWork = async () => {
    const uid  = Number(localStorage.getItem("userId"));
    if (!uid) { alert("Not logged in."); return; }
    try {
      const r = await api.post("/api/attendance/end-work", { employeeId: uid });
      const parsed = r.data;
      if (!parsed?.success && parsed?.message) { alert(parsed.message); return; }
      if (intervalRef.current)  { clearInterval(intervalRef.current);  intervalRef.current  = null; }
      if (autoCheckRef.current) { clearInterval(autoCheckRef.current); autoCheckRef.current = null; }
      const ts = nowIST();
      setShiftEndTime(ts); setShiftDate(todayKey);
      setStatus("completed"); setWorkStartedToday(true);
      localStorage.setItem(getUserKey("workCompletedToday"), todayKey);
      localStorage.setItem(getUserKey("shiftEndTime"),       ts);
      fetchedYearRef.current = null;
      fetchYearData(selectedYear);
    } catch { alert("Network error."); }
  };

  const fmtSecs = (s) =>
    `${String(Math.floor(s / 3600)).padStart(2,"0")}:` +
    `${String(Math.floor((s % 3600) / 60)).padStart(2,"0")}:` +
    `${String(s % 60).padStart(2,"0")}`;

  const todayLabel = today.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", timeZone: "Asia/Kolkata",
  }).toUpperCase();

  // ── Modal shell ───────────────────────────────────────────────────────────
  const Modal = ({ children, onClose, title }) => (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1.5px solid #f1f5f9" }}>
          <p style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>{title}</p>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", fontSize:22, lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"20px", overflowY:"auto", flex:1 }}>{children}</div>
      </div>
    </div>
  );

  const LeaveForm = ({ onCancel, onSubmit }) => {
    const [type, setType]   = useState("ANNUAL_LEAVE");
    const [start, setStart] = useState("");
    const [end,   setEnd]   = useState("");
    const reasonRef         = useRef(null);
    const [sub, setSub]     = useState(false);
    const go = async () => {
      const reason = reasonRef.current?.value || "";
      if (!start || !end || !reason.trim()) { alert("Fill all fields."); return; }
      const eid = Number(localStorage.getItem("userId"));
      if (!eid) { alert("Not logged in."); return; }
      setSub(true);
      try {
        const r = await api.post("/api/leaves/apply", { employeeId:eid, type, startDate:start, endDate:end, reason:reason.trim() });
        const res = r.data;
        if (!res?.success && res?.message) { alert(res.message); setSub(false); return; }
        alert("Leave submitted!"); onSubmit({});
      } catch { alert("Error."); } finally { setSub(false); }
    };
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        <div>
          <label className="modal-label">Category</label>
          <select className="modal-input" value={type} onChange={e=>setType(e.target.value)}>
            <option value="ANNUAL_LEAVE">Annual Leave</option>
            <option value="SICK_LEAVE">Sick Leave</option>
            <option value="CASUAL_LEAVE">Casual Leave</option>
            <option value="MATERNITY_LEAVE">Maternity Leave</option>
            <option value="PATERNITY_LEAVE">Paternity Leave</option>
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div><label className="modal-label">From</label><input type="date" className="modal-input" value={start} onChange={e=>setStart(e.target.value)} min={todayKey}/></div>
          <div><label className="modal-label">To</label><input type="date" className="modal-input" value={end} onChange={e=>setEnd(e.target.value)} min={start||todayKey} disabled={!start}/></div>
        </div>
        <div><label className="modal-label">Reason</label><textarea ref={reasonRef} className="modal-input" rows={3} style={{resize:"none"}}/></div>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
          <button onClick={onCancel} style={{ padding:"9px 16px", borderRadius:10, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#64748b", cursor:"pointer" }}>Cancel</button>
          <button onClick={go} disabled={sub} style={{ padding:"9px 18px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#10b981,#34d399)", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer", opacity:sub?0.6:1 }}>{sub?"Submitting…":"Apply"}</button>
        </div>
      </div>
    );
  };

  const CorrectionForm = ({ dateKey, onCancel, onSubmit }) => {
    const [date, setDate] = useState(dateKey);
    const reasonRef       = useRef(null);
    const [sub, setSub]   = useState(false);
    const go = async () => {
      const reason = reasonRef.current?.value || "";
      if (!date || !reason.trim()) { alert("Fill all fields."); return; }
      const eid = Number(localStorage.getItem("userId"));
      if (!eid) { alert("Not logged in."); return; }
      setSub(true);
      try {
        const r = await api.post("/api/attendance/correction-request", { employeeId:eid, date, reason:reason.trim(), action:"mark_present" });
        const res = r.data;
        if (!res?.success && res?.message) { alert(res.message); setSub(false); return; }
        alert("Request sent!"); onSubmit({ date, reason });
      } catch { alert("Error."); } finally { setSub(false); }
    };
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        <div><label className="modal-label">Date to Correct</label><input type="date" className="modal-input" value={date} onChange={e=>setDate(e.target.value)} max={todayKey}/></div>
        <div><label className="modal-label">Reason</label><textarea ref={reasonRef} className="modal-input" rows={4} placeholder="Was present but marked absent..." style={{resize:"none"}}/></div>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
          <button onClick={onCancel} style={{ padding:"9px 16px", borderRadius:10, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#64748b", cursor:"pointer" }}>Cancel</button>
          <button onClick={go} disabled={sub} style={{ padding:"9px 18px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#f59e0b,#fbbf24)", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer", opacity:sub?0.6:1 }}>{sub?"Submitting…":"Send"}</button>
        </div>
      </div>
    );
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="atd">
      <style>{CSS}</style>

      {autoClockOutMsg && (
        <div className="auto-banner anim">
          <span>⏰</span>
          <span>{autoClockOutMsg}</span>
          <button onClick={() => setAutoClockOutMsg(null)}
            style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#c2410c", fontSize:18, lineHeight:1 }}>×</button>
        </div>
      )}

      {/* ────── TOP CONTROL BAR ────── */}
      <div className="ctrl-panel anim">

        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#f97316,#fb923c)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:15, fontWeight:900, flexShrink:0 }}>
            {empName.charAt(0).toUpperCase()}
          </div>
          <p style={{ fontSize:14, fontWeight:900, color:"#0f172a", whiteSpace:"nowrap" }}>{empName}</p>
        </div>

        <div className="ctrl-divider" />

        <div style={{ flexShrink:0 }}>
          <span style={{
            padding:"4px 12px", borderRadius:999, fontSize:11, fontWeight:800, whiteSpace:"nowrap",
            background: status==="working" ? "#fff7ed" : status==="completed" ? "#f0fdf4" : "#f8fafc",
            color:      status==="working" ? "#f97316" : status==="completed" ? "#059669" : "#94a3b8",
            border: `1.5px solid ${status==="working" ? "#fed7aa" : status==="completed" ? "#bbf7d0" : "#e2e8f0"}`,
          }}>
            {STATUS_CFG[status]?.label}
          </span>
          <p style={{ fontSize:10, color:"#94a3b8", fontWeight:600, marginTop:3, textAlign:"center" }}>
            TODAY · {todayLabel}
          </p>
        </div>

        <div className="ctrl-divider" />

        <div className="time-stat">
          <span className="time-label">Check-In</span>
          {shouldShowCheckIn()
            ? <span className="time-value" style={{ color:"#f97316" }}>{shiftStartTime}</span>
            : <span style={{ fontSize:13, fontWeight:600, color:"#cbd5e1" }}>—</span>}
        </div>

        {(status === "working" || status === "completed") && (
          <>
            <div className="ctrl-divider" />
            <div className="time-stat">
              <span className="time-label">Work</span>
              <span className="time-value" style={{ color:"#059669" }}>{fmtSecs(workSeconds)}</span>
            </div>
          </>
        )}

        <div className="ctrl-divider" />

        <div className="time-stat" style={{ minWidth:90 }}>
          <span className="time-label">Present</span>
          <span className="time-value" style={{ color:"#f97316", fontSize:16 }}>{yearStats.present}</span>
          <span style={{ fontSize:9, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>
            this year
          </span>
        </div>

        <div className="ctrl-divider" />

        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          {status === "notstarted" && (
            <button className="punch-btn btn-green" onClick={startWork} disabled={workStartedToday}>
              ▶ Clock In
            </button>
          )}
          {status === "working" && (
            <button className="punch-btn btn-red" onClick={endWork}>
              ⏹ Clock Out
            </button>
          )}
          {status === "completed" && (
            <span style={{ fontSize:13, fontWeight:800, color:"#059669", background:"#f0fdf4", border:"1.5px solid #bbf7d0", padding:"6px 14px", borderRadius:10 }}>
              ✓ Done
            </span>
          )}
        </div>
      </div>

      {/* ────── YEAR CALENDAR GRID ────── */}
      <div className="anim2">

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:10 }}>

          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => setSelectedYear(y => y - 1)}
              style={{ width:34, height:34, borderRadius:10, border:"1.5px solid #e2e8f0", background:"#fff", color:"#475569", cursor:"pointer", fontSize:16, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
            <div style={{ padding:"7px 20px", borderRadius:10, border:"1.5px solid #f97316", background:"#fff7ed", color:"#f97316", fontSize:15, fontWeight:900, minWidth:80, textAlign:"center" }}>
              {selectedYear}
            </div>
            <button onClick={() => setSelectedYear(y => y + 1)}
              style={{ width:34, height:34, borderRadius:10, border:"1.5px solid #e2e8f0", background:"#fff", color:"#475569", cursor:"pointer", fontSize:16, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
          </div>

          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[
              { code:"P",  color:"#0ea5e9", label:"Present",  count: yearStats.present  },
              { code:"HD", color:"#14b8a6", label:"Half Day", count: yearStats.halfDay,  small: true },
              { code:"L",  color:"#8b5cf6", label:"Leave",    count: yearStats.sick      },
              { code:"A",  color:"#f97316", label:"Absent",   count: yearStats.absent    },
              { code:"H",  color:"#eab308", label:"Holiday",  count: yearStats.holiday   },
            ].map(l => (
              <div key={l.code} className="legend-pill">
                <span className="legend-badge" style={{ background: l.color, fontSize: l.small ? 9 : 11 }}>
                  {l.code}
                </span>
                <span style={{ fontWeight:900, color:"#0f172a" }}>{l.count}</span>
                <span style={{ color:"#94a3b8", fontWeight:500 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="atd-table-wrap">
          {loadingYear ? (
            <div style={{ padding:48, display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", border:"3px solid #f97316", borderTopColor:"transparent", animation:"spin .8s linear infinite" }} />
              <p style={{ fontSize:13, color:"#94a3b8", fontWeight:600 }}>Loading attendance…</p>
            </div>
          ) : (
            <table className="atd-table" style={{ tableLayout:"fixed", minWidth: 90 + 31 * 38 }}>
              <thead>
                <tr>
                  <th>MONTH</th>
                  {Array.from({ length:31 }, (_,i) => i + 1).map(d => (
                    <th key={d} style={{ width:38, minWidth:38 }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleMonths.map((m, idx) => {
                  const daysInM    = new Date(selectedYear, m + 1, 0).getDate();
                  const isCurrentM = m === today.getMonth() && selectedYear === today.getFullYear();
                  const ms         = getMonthStats(m);

                  return (
                    <tr key={m} style={{ background: isCurrentM ? "#fffcf8" : idx % 2 === 0 ? "#fff" : "#fafbfc" }}>

                      <td style={{ padding:"8px 14px", borderRight:"2px solid #e8edf3", borderBottom:"1px solid #f1f5f9", verticalAlign:"middle", background: isCurrentM ? "#fff8f0" : "#fafbfc" }}>
                        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                          <span style={{ fontSize:13, fontWeight: isCurrentM ? 900 : 700, color: isCurrentM ? "#f97316" : "#334155", whiteSpace:"nowrap" }}>
                            {monthNames[m].slice(0, 3)}
                          </span>
                          <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                            {ms.present > 0 && <span style={{ fontSize:9, fontWeight:800, color:"#0ea5e9" }}>{ms.present}P</span>}
                            {ms.sick    > 0 && <span style={{ fontSize:9, fontWeight:800, color:"#8b5cf6" }}>{ms.sick}L</span>}
                            {ms.absent  > 0 && <span style={{ fontSize:9, fontWeight:800, color:"#f97316" }}>{ms.absent}A</span>}
                          </div>
                        </div>
                      </td>

                      {Array.from({ length:31 }, (_,di) => di + 1).map(d => {
                        const isToday = d === today.getDate() && isCurrentM;

                        if (d > daysInM) return (
                          <td key={d} style={{ borderRight:"1px solid #f1f5f9", borderBottom:"1px solid #f1f5f9", background:"#f4f6f8", padding:"6px 3px", textAlign:"center" }}>
                            <div style={{ width:30, height:30, margin:"0 auto", borderRadius:8, background:"#edf0f3" }} />
                          </td>
                        );

                        const isFuture = new Date(selectedYear, m, d) > today;
                        const st       = getDayStatus(selectedYear, m, d);
                        const info     = getCodeInfo(st);

                        return (
                          <td key={d} style={{ borderRight:"1px solid #f1f5f9", borderBottom:"1px solid #f1f5f9", padding:"6px 3px", textAlign:"center", background: isToday ? "#fff3e8" : undefined }}>
                            {isFuture ? (
                              <div style={{ width:30, height:30, margin:"0 auto", borderRadius:8, border:"1.5px dashed #dde3ea" }} />
                            ) : info ? (
                              <div
                                title={`${monthNames[m]} ${d} — ${info.label}`}
                                className="day-badge"
                                style={{
                                  background:    info.color,
                                  outline:       isToday ? "2.5px solid #f97316" : undefined,
                                  outlineOffset: 2,
                                  fontSize:      info.code === "HD" ? 9 : 13,
                                }}>
                                {info.code}
                              </div>
                            ) : (
                              <div style={{ width:30, height:30, margin:"0 auto", borderRadius:8, background: isToday ? "#fed7aa" : "#f1f5f9", border: isToday ? "2px solid #f97316" : "1px solid #e8edf3" }} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {showLeaveModal && (
        <Modal title="Apply for Leave" onClose={() => setShowLeaveModal(false)}>
          <LeaveForm onCancel={() => setShowLeaveModal(false)} onSubmit={() => { setShowLeaveModal(false); fetchedYearRef.current = null; fetchYearData(selectedYear); }} />
        </Modal>
      )}
      {showCorrectionModal && (
        <Modal title="Attendance Correction Request" onClose={() => setShowCorrectionModal(false)}>
          <CorrectionForm dateKey={todayKey} onCancel={() => setShowCorrectionModal(false)} onSubmit={() => { setShowCorrectionModal(false); fetchedYearRef.current = null; fetchYearData(selectedYear); }} />
        </Modal>
      )}
    </div>
  );
}
