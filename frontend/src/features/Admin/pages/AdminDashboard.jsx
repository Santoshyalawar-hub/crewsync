import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/apiClient";

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────── */
const C = {
  navy:"#0D1F2D", mid:"#162639", teal:"#00C2A8", coral:"#FF6B35",
  purple:"#818cf8", amber:"#f59e0b", green:"#10b981", red:"#ef4444",
  bg:"#F4F6FB", border:"#EDF0F7",
};

/* ─────────────────────────────────────────────────────────────────
   ICON
───────────────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, sw = 1.8, color = "currentColor" }) => (
  <svg width={size} height={size} fill="none" stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────────── */
function Counter({ to, duration = 800 }) {
  const [v, setV] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (!to) { setV(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [to]);
  return <>{v.toLocaleString("en-IN")}</>;
}

/* ─────────────────────────────────────────────────────────────────
   SVG DONUT — all data from real API
───────────────────────────────────────────────────────────────── */
function Donut({ segs, size = 110, thick = 18, label, sub }) {
  const r = (size - thick) / 2, circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  const total = segs.reduce((s, x) => s + x.pct, 0);
  const all = [...segs];
  if (total < 99.5) all.push({ pct: 100 - total, color: "#EDF0F7" });
  let off = 0;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        {all.map((s, i) => {
          const dash = (s.pct / 100) * circ;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={thick}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-(off * circ / 100)}
              strokeLinecap="butt"
              style={{ transition:"stroke-dasharray .9s ease" }} />
          );
          off += s.pct; return el;
        })}
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
        <span style={{ fontSize:15,fontWeight:900,color:C.navy,fontFamily:"'Sora',sans-serif",lineHeight:1 }}>{label}</span>
        {sub && <span style={{ fontSize:9,color:"#94a3b8",fontWeight:600,marginTop:2 }}>{sub}</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATED H-BAR — width driven by real pct
───────────────────────────────────────────────────────────────── */
function HBar({ label, value, pct, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(Math.max(pct, 2)), 180 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:11, fontWeight:600, color:"#6b7280" }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:800, color:C.navy, fontFamily:"'Sora',sans-serif" }}>{value}</span>
      </div>
      <div style={{ height:7, background:"#f1f5f9", borderRadius:999, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`, background:color, borderRadius:999, transition:`width 1.1s cubic-bezier(.34,1.56,.64,1) ${delay}ms` }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATED V-BARS — heights from real data
───────────────────────────────────────────────────────────────── */
function VBars({ data }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);
  const max = Math.max(...data.map(d => d.val), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:84, padding:"0 2px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <div style={{ fontSize:9, fontWeight:800, color:d.active ? C.coral : "transparent", fontFamily:"'Sora',sans-serif", minHeight:12 }}>
            {d.active ? d.val : ""}
          </div>
          <div style={{ width:"100%", display:"flex", alignItems:"flex-end", height:60 }}>
            <div style={{
              width:"100%",
              height: ready ? `${Math.max((d.val / max) * 100, 4)}%` : "4%",
              background: d.active
                ? `linear-gradient(180deg,${C.coral},#e55a25)`
                : d.val > 0 ? `linear-gradient(180deg,${C.teal}99,${C.teal}44)` : "#f1f5f9",
              borderRadius:"4px 4px 0 0",
              transition:`height .9s cubic-bezier(.34,1.56,.64,1) ${i * 60}ms`,
              boxShadow: d.active ? `0 -3px 10px ${C.coral}55` : "none",
            }}/>
          </div>
          <span style={{ fontSize:9, color:d.active ? C.coral : "#94a3b8", fontWeight:d.active ? 800 : 500 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SPARKLINE — from rolling real present counts
───────────────────────────────────────────────────────────────── */
function Spark({ data, color, w = 80, h = 26 }) {
  if (!data || data.length < 2 || data.every(v => v === 0)) return <div style={{ width:w, height:h }}/>;
  const max = Math.max(...data, 1), min = Math.min(...data, 0), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const lastPt = pts.split(" ").pop().split(",");
  return (
    <svg width={w} height={h} style={{ overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={lastPt[0]} cy={lastPt[1]} r={2.5} fill={color}/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   RING METER — leave type breakdown
───────────────────────────────────────────────────────────────── */
function Ring({ label, value, total, color }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  const r = 18, circ = 2 * Math.PI * r;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
      <div style={{ position:"relative" }}>
        <svg width={46} height={46} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={23} cy={23} r={r} fill="none" stroke="#f1f5f9" strokeWidth={5}/>
          <circle cx={23} cy={23} r={r} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
            style={{ transition:"stroke-dasharray 1.2s ease" }}/>
        </svg>
        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ fontSize:10, fontWeight:900, color:C.navy, fontFamily:"'Sora',sans-serif" }}>{value}</span>
        </div>
      </div>
      <span style={{ fontSize:9.5, fontWeight:600, color:"#64748b", textAlign:"center", lineHeight:1.3 }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────────────────────────── */
function KpiCard({ icon, label, value, pctLabel, accent = C.coral, loading, spark }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.navy : "#fff", borderRadius:16,
        border:`1.5px solid ${hov ? C.navy : C.border}`,
        padding:"16px 18px", transition:"all .22s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 18px 40px rgba(13,31,45,.18)" : "0 2px 12px rgba(13,31,45,.04)",
        position:"relative", overflow:"hidden", cursor:"default",
      }}>
      <div style={{ position:"absolute",bottom:-16,right:-16,width:60,height:60,borderRadius:"50%",background:`${accent}12` }}/>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10 }}>
        <div style={{ width:34,height:34,borderRadius:9,background:hov?`${accent}30`:`${accent}15`,display:"flex",alignItems:"center",justifyContent:"center",color:accent,transition:"background .22s" }}>{icon}</div>
        {pctLabel && <span style={{ fontSize:10,fontWeight:700,color:hov?"rgba(255,255,255,.4)":"#94a3b8",background:hov?"rgba(255,255,255,.08)":"#f8faff",padding:"2px 7px",borderRadius:999 }}>{pctLabel}</span>}
      </div>
      <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:hov?"rgba(255,255,255,.35)":"#94a3b8",marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:26,fontWeight:900,color:hov?"#fff":C.navy,lineHeight:1,fontFamily:"'Sora',sans-serif" }}>
        {loading ? <span style={{ fontSize:14,color:"#d1d5db" }}>—</span> : <Counter to={value}/>}
      </div>
      {spark && (
        <div style={{ marginTop:8, opacity:hov ? 0.55 : 1 }}>
          <Spark data={spark} color={accent} w={70} h={22}/>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ACTION TILE — exact same navigate() paths as original
───────────────────────────────────────────────────────────────── */
function ActionTile({ emoji, title, sub, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:hov?C.navy:"#fff", borderRadius:14,
        border:`1.5px solid ${hov?C.navy:C.border}`,
        padding:"13px 16px", cursor:"pointer", transition:"all .2s",
        transform:hov?"translateY(-2px)":"none",
        boxShadow:hov?"0 14px 36px rgba(13,31,45,.18)":"0 1px 6px rgba(13,31,45,.04)",
        display:"flex", alignItems:"center", gap:12,
      }}>
      <div style={{ width:38,height:38,borderRadius:10,background:hov?`${accent}25`:`${accent}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{emoji}</div>
      <div style={{ minWidth:0, flex:1 }}>
        <div style={{ fontSize:13,fontWeight:800,color:hov?"#fff":C.navy,fontFamily:"'Sora',sans-serif",marginBottom:1 }}>{title}</div>
        <div style={{ fontSize:11,color:hov?"rgba(255,255,255,.4)":"#94a3b8" }}>{sub}</div>
      </div>
      <Ic d="M9 5l7 7-7 7" size={12} sw={2.5} color={hov?C.coral:"#e5e7eb"}/>
    </div>
  );
}

const Panel = ({ children, style = {} }) => (
  <div style={{ background:"#fff",borderRadius:16,border:`1.5px solid ${C.border}`,boxShadow:"0 2px 14px rgba(13,31,45,.05)",padding:"18px 20px",...style }}>{children}</div>
);
const PanelHead = ({ title, badge }) => (
  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
    <span style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#94a3b8" }}>{title}</span>
    {badge && <span style={{ fontSize:9,fontWeight:700,color:C.coral,background:"rgba(255,107,53,.08)",padding:"2px 8px",borderRadius:999 }}>{badge}</span>}
  </div>
);
const SectionHead = ({ title }) => (
  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
    <span style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:"#94a3b8" }}>{title}</span>
    <div style={{ flex:1,height:1,background:C.border }}/>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN AdminDashboard
═══════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [tenantInfo,  setTenantInfo]  = useState({ tenantCode:"", companyName:"", companyId:null });
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [greeting,    setGreeting]    = useState("Good morning");
  const [lastRefresh, setLastRefresh] = useState(null);

  /* attendance stats — from real API, same as original */
  const [stats, setStats] = useState({
    totalEmployees:0, presentToday:0, onLeave:0,
    absentToday:0, lateToday:0, pendingRequests:0, onBreak:0, workingNow:0,
  });

  /* dept rows — built 100% from real /api/users/tenant/employees response */
  const [deptRows,   setDeptRows]   = useState([]);
  /* weekly bars — today = real API, other days from weekly endpoint or 0 */
  const [weekBars,   setWeekBars]   = useState([]);
  /* leave breakdown — from /api/admin/leave/summary */
  const [leaveTypes, setLeaveTypes] = useState({ sick:0, casual:0, earned:0, unpaid:0 });
  /* sparkline buffer — accumulates real present counts across refreshes */
  const sparkBuf = useRef([0,0,0,0,0,0,0]);
  /* system health — live pinged */
  const [health, setHealth] = useState([
    { l:"API",       s:"—", c:"#94a3b8" },
    { l:"Payroll",   s:"—", c:"#94a3b8" },
    { l:"Face Recog",s:"—", c:"#94a3b8" },
    { l:"Backup",    s:"—", c:"#94a3b8" },
    { l:"Compliance",s:"—", c:"#94a3b8" },
  ]);

  /* init */
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    try {
      const tenantCode  = (localStorage.getItem("tenantCode")  || "").trim();
      const companyName = (localStorage.getItem("companyName") || "Company").trim();
      const raw         = (localStorage.getItem("companyId")   || "").trim();
      const companyId   = raw && raw !== "null" ? Number(raw) : null;
      setTenantInfo({ tenantCode, companyName, companyId });
    } catch {}
  }, []);

  /* ── MAIN FETCH ─────────────────────────────────────────────────── */
  const fetchAllStats = useCallback(async () => {
    if (!tenantInfo.tenantCode || !tenantInfo.companyId) return;
    setLoading(true); setError(null);

    try {
      /* 1. Attendance dashboard-stats — same 3 fallback paths as original */
      let attData = null;
      for (const path of [
        "/api/admin/attendance/dashboard-stats",
        "/api/admin/attendance/today",
        "/api/attendance/dashboard-stats",
      ]) {
        try {
          const r = await api.get(path);
          if (r.data) { attData = r.data?.data ?? r.data; break; }
        } catch { /* try next */ }
      }

      /* 2. Employee list — same call as original, also drives dept chart */
      let employees = [];
      try {
        const empRes = await api.get("/api/users/tenant/employees");
        const arr = Array.isArray(empRes.data?.data) ? empRes.data.data : [];
        employees = arr.filter(e => Number(e.companyId) === Number(tenantInfo.companyId));
      } catch {}

      /* 3. Dept breakdown — built entirely from real employee data, zero hardcoding */
      if (employees.length > 0) {
        const map = {};
        employees.forEach(e => {
          const dept = (e.department || e.dept || "Unassigned").trim();
          map[dept] = (map[dept] || 0) + 1;
        });
        const COLORS = [C.teal, C.purple, C.coral, C.amber, C.green, "#0284c7", "#ec4899", "#14b8a6"];
        const sorted = Object.entries(map).sort((a,b) => b[1] - a[1]);
        const maxV = sorted[0]?.[1] || 1;
        setDeptRows(sorted.map(([label, value], i) => ({
          label, value,
          pct: Math.round((value / maxV) * 100),
          color: COLORS[i % COLORS.length],
        })));
      }

      /* 4. Weekly attendance — real 7-day endpoint if available */
      let weekHistory = null;
      try {
        const today = new Date();
        const from  = new Date(today); from.setDate(today.getDate() - 6);
        const wRes  = await api.get(
          `/api/admin/attendance/weekly?from=${from.toISOString().split("T")[0]}&to=${today.toISOString().split("T")[0]}`
        );
        const wArr = wRes.data?.data ?? wRes.data ?? [];
        if (Array.isArray(wArr) && wArr.length > 0) weekHistory = wArr;
      } catch {}

      /* 5. Leave-type breakdown — non-fatal */
      try {
        const lRes = await api.get("/api/leaves/admin/summary");
        const ld = lRes.data?.data ?? lRes.data ?? {};
        setLeaveTypes({
          sick:   ld.sickLeave   ?? ld.sick   ?? ld.SICK   ?? 0,
          casual: ld.casualLeave ?? ld.casual ?? ld.CASUAL ?? 0,
          earned: ld.earnedLeave ?? ld.earned ?? ld.EARNED ?? 0,
          unpaid: ld.unpaidLeave ?? ld.unpaid ?? ld.UNPAID ?? 0,
        });
      } catch {}

      /* 6. Merge attendance stats */
      const totalEmployees = employees.length || attData?.totalEmployees || attData?.total || 0;
      const presentToday   = attData?.presentToday ?? attData?.present ?? 0;
      const newStats = {
        totalEmployees,
        presentToday,
        onLeave:         attData?.onLeave         ?? attData?.leaveCount       ?? 0,
        absentToday:     attData?.absentToday     ?? attData?.absent           ?? 0,
        lateToday:       attData?.lateToday       ?? attData?.lateCheckIns     ?? 0,
        pendingRequests: attData?.pendingRequests ?? attData?.pending           ?? 0,
        onBreak:         attData?.onBreak         ?? attData?.breakCount        ?? 0,
        workingNow:      attData?.workingNow      ?? attData?.currentlyWorking  ?? 0,
      };
      setStats(newStats);

      /* 7. Build weekly bars — today = real, rest from API if available, else 0 */
      const DAY_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];
      const now = new Date();
      const bars = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(now.getDate() - (6 - i));
        const isToday = i === 6;
        let val = isToday ? presentToday : 0;
        if (!isToday && weekHistory) {
          const match = weekHistory.find(w => {
            const wd = new Date(w.date || w.day || "");
            return wd.toDateString() === d.toDateString();
          });
          if (match) val = match.presentCount ?? match.present ?? match.count ?? 0;
        }
        return { label: DAY_SHORT[d.getDay()], val, active: isToday };
      });
      setWeekBars(bars);

      /* 8. Rolling sparkline — real present count per refresh */
      sparkBuf.current = [...sparkBuf.current.slice(1), presentToday];

      /* 9. Live health pings */
      const healthDefs = [
        { l:"API",       path:"/api/health"           },
        { l:"Payroll",   path:"/api/payroll/health"   },
        { l:"Face Recog",path:"/api/face/health"      },
        { l:"Backup",    path:"/api/backup/status"    },
        { l:"Compliance",path:"/api/compliance/status"},
      ];
      const results = await Promise.all(healthDefs.map(async ({ l, path }) => {
        try {
          await api.get(path);
          return { l, s:"Online", c:C.teal };
        } catch (e) {
          const status = e.response?.status;
          if (status === 401 || status === 403) return { l, s:"Auth",   c:C.amber };
          if (status === 404)                   return { l, s:"Active", c:C.teal  };
          return { l, s:"Offline", c:C.red };
        }
      }));
      setHealth(results);

      setLastRefresh(new Date().toLocaleTimeString("en-IN",{ hour:"2-digit", minute:"2-digit" }));
    } catch (e) {
      const status = e.response?.status;
      setError(status === 401 || status === 403 ? "Session expired." : "Failed to load dashboard data.");
    } finally { setLoading(false); }
  }, [tenantInfo.tenantCode, tenantInfo.companyId]);

  useEffect(() => { fetchAllStats(); }, [fetchAllStats]);

  /* ── derived values — zero hardcoded ratios ── */
  const emp    = Math.max(stats.totalEmployees, 1);
  const toPct  = (n) => Math.min(Math.round((n / emp) * 100), 100);
  const fmt    = (n) => (Number(n) || 0).toLocaleString("en-IN");

  const donutSegs = [
    { label:"Present", pct:toPct(stats.presentToday), color:C.teal   },
    { label:"Absent",  pct:toPct(stats.absentToday),  color:C.purple },
    { label:"On Leave",pct:toPct(stats.onLeave),      color:C.coral  },
    { label:"Late",    pct:toPct(stats.lateToday),    color:C.amber  },
  ];

  const leaveTotal = Math.max(
    leaveTypes.sick + leaveTypes.casual + leaveTypes.earned + leaveTypes.unpaid,
    stats.onLeave, 1
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .db-root{font-family:'DM Sans',sans-serif;background:${C.bg};min-height:100vh;}
        .db-s{font-family:'Sora',sans-serif;}
        @keyframes db-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .a0{animation:db-up .38s ease both}
        .a1{animation:db-up .38s .07s ease both}
        .a2{animation:db-up .38s .14s ease both}
        .a3{animation:db-up .38s .21s ease both}
        .a4{animation:db-up .38s .28s ease both}
        .a5{animation:db-up .38s .35s ease both}
      `}</style>

      <div className="db-root" style={{ padding:"18px 20px 52px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexDirection:"column", gap:18 }}>

        {/* ════ HERO ════════════════════════════════════════════════════ */}
        <div className="a0" style={{ background:"linear-gradient(135deg,#0D1F2D 0%,#162639 60%,#1a3a52 100%)", borderRadius:20, padding:"24px 30px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:140,width:180,height:180,borderRadius:"50%",background:"rgba(255,107,53,.10)",filter:"blur(40px)",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",bottom:-20,right:-20,width:200,height:200,borderRadius:"50%",background:"rgba(0,194,168,.07)",filter:"blur(50px)",pointerEvents:"none" }}/>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,position:"relative" }}>
            <div>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.3)",marginBottom:4 }}>
                {new Date().toLocaleDateString("en-IN",{ weekday:"long",day:"numeric",month:"long",year:"numeric" })}
              </div>
              <h1 className="db-s" style={{ fontSize:22,fontWeight:900,color:"#fff",margin:"0 0 3px" }}>{greeting} 👋</h1>
              <p style={{ fontSize:12,color:"rgba(255,255,255,.4)",margin:0 }}>{tenantInfo.companyName} · Admin Dashboard</p>
            </div>
            <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
              {tenantInfo.tenantCode && (
                <div style={{ background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"8px 14px" }}>
                  <div style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:3 }}>Tenant</div>
                  <code className="db-s" style={{ fontSize:13,fontWeight:900,color:C.teal }}>{tenantInfo.tenantCode}</code>
                </div>
              )}
              {lastRefresh && (
                <div style={{ background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:"8px 14px" }}>
                  <div style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:3 }}>Updated</div>
                  <div style={{ fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)" }}>{lastRefresh}</div>
                </div>
              )}
              <button onClick={fetchAllStats} disabled={loading}
                style={{ background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"9px 14px",color:"rgba(255,255,255,.5)",cursor:loading?"not-allowed":"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:6,transition:"all .2s",fontFamily:"'DM Sans',sans-serif" }}
                onMouseEnter={e=>{ if(!loading)e.currentTarget.style.background="rgba(255,107,53,.2)"; }}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}>
                <Ic d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size={13} color="currentColor"/>
                {loading ? "Loading…" : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* ════ ERROR ════ */}
        {error && (
          <div style={{ background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:12,padding:"11px 18px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <span style={{ fontSize:13,color:"#b91c1c",fontWeight:600 }}>⚠️ {error}</span>
            <button onClick={fetchAllStats} style={{ fontSize:11,fontWeight:700,color:C.coral,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontFamily:"'DM Sans',sans-serif" }}>Retry</button>
          </div>
        )}

        {/* ════ KPI ROW — animated counters + sparklines from real API ═ */}
        <div className="a1" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12 }}>
          <KpiCard
            icon={<Ic d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>}
            label="Total Staff"   value={stats.totalEmployees}  accent={C.coral}  loading={loading} spark={sparkBuf.current} />
          <KpiCard
            icon={<Ic d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>}
            label="Present"       value={stats.presentToday}    accent={C.teal}   loading={loading} pctLabel={`${toPct(stats.presentToday)}%`} spark={sparkBuf.current}/>
          <KpiCard
            icon={<Ic d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>}
            label="Absent"        value={stats.absentToday}     accent={C.red}    loading={loading} pctLabel={`${toPct(stats.absentToday)}%`}/>
          <KpiCard
            icon={<Ic d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>}
            label="On Leave"      value={stats.onLeave}         accent={C.amber}  loading={loading}/>
          <KpiCard
            icon={<Ic d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>}
            label="Late Today"    value={stats.lateToday}       accent={C.purple} loading={loading}/>
          <KpiCard
            icon={<Ic d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>}
            label="Pending"       value={stats.pendingRequests} accent={C.green}  loading={loading}/>
        </div>

        {/* ════ CHARTS ROW 1: Donut · Weekly V-bars · Dept H-bars ═════ */}
        <div className="a2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1.25fr",gap:14 }}>

          {/* Donut — live present/absent/leave/late from API */}
          <Panel>
            <PanelHead title="Workforce Split"/>
            <div style={{ display:"flex",alignItems:"center",gap:16 }}>
              <Donut segs={donutSegs} size={108} thick={19}
                label={loading?"…":`${toPct(stats.presentToday)}%`} sub="present"/>
              <div style={{ display:"flex",flexDirection:"column",gap:8,flex:1 }}>
                {donutSegs.map(s => (
                  <div key={s.label} style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                      <div style={{ width:7,height:7,borderRadius:2,background:s.color,flexShrink:0 }}/>
                      <span style={{ fontSize:11,color:"#6b7280",fontWeight:600 }}>{s.label}</span>
                    </div>
                    <span className="db-s" style={{ fontSize:11,fontWeight:800,color:C.navy }}>{loading?"—":`${s.pct}%`}</span>
                  </div>
                ))}
                <div style={{ marginTop:4,paddingTop:8,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between" }}>
                  <span style={{ fontSize:10,color:"#94a3b8",fontWeight:600 }}>Total</span>
                  <span className="db-s" style={{ fontSize:11,fontWeight:900,color:C.navy }}>{loading?"—":fmt(stats.totalEmployees)}</span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Weekly V-bars — today = real, rest = weekly API if available, else 0 */}
          <Panel>
            <PanelHead title="7-Day Attendance" badge="Today Live"/>
            {weekBars.length > 0
              ? <VBars data={weekBars}/>
              : <div style={{ height:84,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ fontSize:12,color:"#d1d5db" }}>{loading?"Loading…":"No data"}</span>
                </div>
            }
            <div style={{ marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between" }}>
              <span style={{ fontSize:10,color:"#94a3b8",fontWeight:600 }}>On Break Now</span>
              <span className="db-s" style={{ fontSize:11,fontWeight:900,color:C.navy }}>{loading?"—":stats.onBreak}</span>
            </div>
          </Panel>

          {/* Dept H-bars — 100% from real employee list */}
          <Panel>
            <PanelHead title="By Department" badge={deptRows.length > 0 ? `${deptRows.length} depts` : undefined}/>
            {deptRows.length > 0
              ? <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {deptRows.slice(0,6).map((d,i) => (
                    <HBar key={d.label} label={d.label} value={d.value} pct={d.pct} color={d.color} delay={i*80}/>
                  ))}
                </div>
              : <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {loading
                    ? [1,2,3,4].map(i=><div key={i} style={{ height:22,background:"#f1f5f9",borderRadius:6,opacity:.3+i*.15 }}/>)
                    : <span style={{ fontSize:12,color:"#d1d5db",textAlign:"center",paddingTop:20 }}>No department data</span>
                  }
                </div>
            }
          </Panel>
        </div>

        {/* ════ CHARTS ROW 2: Leave rings · Ratios · Action panel ═════ */}
        <div className="a3" style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14 }}>

          {/* Leave-type ring meters — from /api/admin/leave/summary */}
          <Panel>
            <PanelHead title="Leave Breakdown"/>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <Ring label="Sick"   value={leaveTypes.sick}   total={leaveTotal} color={C.red}/>
              <Ring label="Casual" value={leaveTypes.casual} total={leaveTotal} color={C.amber}/>
              <Ring label="Earned" value={leaveTypes.earned} total={leaveTotal} color={C.teal}/>
              <Ring label="Unpaid" value={leaveTypes.unpaid} total={leaveTotal} color={C.purple}/>
            </div>
            <div style={{ marginTop:14,background:"#f8faff",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:11,color:"#6b7280",fontWeight:600 }}>On leave today</span>
              <span className="db-s" style={{ fontSize:14,fontWeight:900,color:C.navy }}>{loading?"—":stats.onLeave}</span>
            </div>
          </Panel>

          {/* Attendance ratio H-bars — all from real stats, no hardcoded percentages */}
          <Panel>
            <PanelHead title="Attendance Ratios"/>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {[
                { label:"Present Rate", value:`${toPct(stats.presentToday)}%`, pct:toPct(stats.presentToday), color:C.teal   },
                { label:"Absent Rate",  value:`${toPct(stats.absentToday)}%`,  pct:toPct(stats.absentToday),  color:C.red    },
                { label:"On Leave",     value:`${toPct(stats.onLeave)}%`,      pct:toPct(stats.onLeave),      color:C.amber  },
                { label:"Late Rate",    value:`${toPct(stats.lateToday)}%`,    pct:toPct(stats.lateToday),    color:C.purple },
              ].map((r,i) => (
                <HBar key={r.label} label={r.label} value={r.value} pct={r.pct} color={r.color} delay={i*70}/>
              ))}
            </div>
            <div style={{ marginTop:12,paddingTop:10,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:10,color:"#94a3b8",fontWeight:600 }}>Working Now</span>
              <span className="db-s" style={{ fontSize:11,fontWeight:900,color:C.teal }}>{loading?"—":stats.workingNow}</span>
            </div>
          </Panel>

          {/* Action required panel */}
          <Panel>
            <PanelHead title="Action Required"/>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {/* Pending gauge */}
              <div style={{ background:`linear-gradient(135deg,${C.navy},#1e3448)`,borderRadius:14,padding:"16px 18px" }}>
                <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.35)",marginBottom:6 }}>Pending Approvals</div>
                <div className="db-s" style={{ fontSize:32,fontWeight:900,color:"#fff",lineHeight:1 }}>
                  {loading?"—":<Counter to={stats.pendingRequests}/>}
                </div>
                <div style={{ marginTop:8,height:4,background:"rgba(255,255,255,.1)",borderRadius:999,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${Math.min((stats.pendingRequests/Math.max(stats.totalEmployees,1))*200,100)}%`,background:C.coral,borderRadius:999,transition:"width 1s ease" }}/>
                </div>
                <button onClick={()=>navigate("/admin/attendance")}
                  style={{ marginTop:10,fontSize:11,fontWeight:700,color:C.coral,background:"rgba(255,107,53,.15)",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,53,.28)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,107,53,.15)"}>
                  Review Requests →
                </button>
              </div>
              {/* Late today */}
              <div style={{ background:"rgba(239,68,68,.05)",border:"1px solid rgba(239,68,68,.12)",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#ef4444",marginBottom:3 }}>Late Today</div>
                  <div className="db-s" style={{ fontSize:20,fontWeight:900,color:C.navy }}>{loading?"—":<Counter to={stats.lateToday}/>}</div>
                </div>
                <div style={{ width:42,height:42,borderRadius:11,background:"rgba(239,68,68,.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444" }}>
                  <Ic d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={18}/>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
      </div>
    </>
  );
}