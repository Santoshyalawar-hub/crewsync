import React, { useEffect, useState, useCallback } from "react";
import {
  Activity, Building2, Users, Mail, X, ChevronRight,
  TrendingUp, AlertCircle, CheckCircle, DollarSign,
  Package, Server, ShieldCheck, Zap, RefreshCw, Eye,
  BarChart3, PieChart as PieIcon,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

import api from "@/lib/apiClient";

/* ═══════════════════════════════════════════════════════════════
   API LAYER
═══════════════════════════════════════════════════════════════ */


const apiFetch = async (path) => {
  const res = await api.get(path);
  return res.data;
};

/* ═══════════════════════════════════════════════════════════════
   DATE HELPERS — build monthly buckets from real records
═══════════════════════════════════════════════════════════════ */
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec"];

/** Return last N month labels like ["Jan","Feb",...] */
function lastNMonths(n = 6) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return { label: MONTH_LABELS[d.getMonth()], year: d.getFullYear(), month: d.getMonth() };
  });
}

/** Given array of records with a date field, count per month for last N months */
function groupByMonth(records = [], dateField = "createdAt", n = 6) {
  const buckets = lastNMonths(n);
  return buckets.map(({ label, year, month }) => ({
    month: label,
    count: records.filter(r => {
      const raw = r[dateField] || r.createdDate || r.registrationDate || r.created_at;
      if (!raw) return false;
      const d = new Date(raw);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length,
  }));
}

/** Group by a string field, return [{ name, value }] sorted desc */
function groupByField(records = [], field) {
  const map = {};
  records.forEach(r => {
    const val = r[field] || "Unknown";
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const T = {
  surface: "#ffffff",
  border:  "#e8ecf2",
  text:    "#0d1421",
  muted:   "#64748b",
  dim:     "#94a3b8",
  orange:  "#ff6b35",
  green:   "#10b981",
  blue:    "#3b82f6",
  purple:  "#8b5cf6",
  amber:   "#f59e0b",
  red:     "#ef4444",
  teal:    "#14b8a6",
};
const COLORS = [T.orange, T.blue, T.green, T.purple, T.amber, T.teal, "#ec4899", "#06b6d4"];

/* ═══════════════════════════════════════════════════════════════
   CUSTOM TOOLTIP
═══════════════════════════════════════════════════════════════ */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"#0d1421", border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:10, padding:"10px 14px", fontSize:12,
    }}>
      {label && <p style={{ color:"#94a3b8", margin:"0 0 6px", fontWeight:600 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color:p.color||"#fff", margin:"2px 0", fontWeight:700 }}>
          {p.name}: <span style={{ color:"#fff" }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CHART CARD WRAPPER
═══════════════════════════════════════════════════════════════ */
function ChartCard({ title, subtitle, icon, loading, error, empty, children }) {
  return (
    <div style={{
      background:T.surface, borderRadius:16, border:`1px solid ${T.border}`,
      boxShadow:"0 1px 4px rgba(0,0,0,0.05)", padding:"18px 20px 14px",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <div style={{ width:28, height:28, borderRadius:8, background:"#f8f9fc", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:T.text, margin:0 }}>{title}</p>
          <p style={{ fontSize:10, color:T.dim, margin:0 }}>{subtitle}</p>
        </div>
      </div>

      {loading ? (
        <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
          <div style={{ width:28, height:28, border:`3px solid ${T.border}`, borderTopColor:T.orange, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          <span style={{ fontSize:11, color:T.dim }}>Loading from API…</span>
        </div>
      ) : error ? (
        <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:6 }}>
          <AlertCircle size={22} color={T.red} />
          <span style={{ fontSize:12, color:T.red, textAlign:"center", maxWidth:200 }}>{error}</span>
        </div>
      ) : empty ? (
        <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:6 }}>
          <BarChart3 size={22} color={T.dim} />
          <span style={{ fontSize:12, color:T.dim }}>No data yet — will populate as records are added</span>
        </div>
      ) : children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLACEHOLDER ROW
═══════════════════════════════════════════════════════════════ */
const PlaceholderRow = ({ msg, err, loading }) => (
  <div style={{ padding:"40px 0", textAlign:"center", fontSize:13, color:err?T.red:T.dim, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
    {loading && <div style={{ width:20, height:20, border:`2px solid ${T.border}`, borderTopColor:T.orange, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />}
    {msg}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   ACTIVITY HELPERS
═══════════════════════════════════════════════════════════════ */
const actIcon = (a = {}) => {
  const { tag, eventType, severity } = a;
  if (tag === "Payment"      || eventType?.includes("PAYMENT"))      return <DollarSign size={11} />;
  if (tag === "Subscription" || eventType?.includes("SUBSCRIPTION")) return <Package size={11} />;
  if (tag === "Company"      || eventType?.includes("COMPANY"))      return <Building2 size={11} />;
  if (tag === "System"       || eventType?.includes("SYSTEM"))       return <Server size={11} />;
  if (tag === "Auth"         || eventType?.includes("LOGIN"))        return <ShieldCheck size={11} />;
  if (severity === "warning" || severity === "danger")               return <AlertCircle size={11} />;
  return <Zap size={11} />;
};
const sevColor = (s = "") => {
  switch (s.toLowerCase()) {
    case "success": return T.green;
    case "warning": return T.amber;
    case "danger":  return T.red;
    default:        return T.purple;
  }
};

/* ═══════════════════════════════════════════════════════════════
   SVC TABLE COMPONENTS
═══════════════════════════════════════════════════════════════ */
const svcTd = { padding:"10px 16px", fontWeight:600, color:"#1e293b", verticalAlign:"middle" };
const SvcTH = ({ children }) => (
  <th style={{
    textAlign:"left", padding:"9px 16px", fontSize:10, fontWeight:700,
    color:T.dim, textTransform:"uppercase", letterSpacing:".07em",
    borderBottom:`1px solid ${T.border}`,
  }}>{children}</th>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function GlobalAdminDashboard() {

  /* ── raw data state ───────────────────────────────────────── */
  const [stats,   setStats]   = useState(null);
  const [statsErr, setStatsErr] = useState("");
  const [statsLoading, setStatsLoading] = useState(false);

  const [companies,    setCompanies]    = useState([]);
  const [companiesErr, setCompaniesErr] = useState("");
  const [companiesLoading, setCompaniesLoading] = useState(false);

  const [demos,    setDemos]    = useState([]);
  const [demosErr, setDemosErr] = useState("");
  const [demosLoading, setDemosLoading] = useState(false);

  const [acts,    setActs]    = useState([]);
  const [actsErr, setActsErr] = useState("");
  const [actsLoading, setActsLoading] = useState(false);

  /* ── UI state ─────────────────────────────────────────────── */
  const [showSvc,       setShowSvc]       = useState(false);
  const [svcTab,        setSvcTab]        = useState("demo");
  const [actOpen,       setActOpen]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [selectedDay,   setSelectedDay]   = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletedDays,   setDeletedDays]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("ga_deleted_act_days") || "[]"); } catch { return []; }
  });

  /* ── fetchers ─────────────────────────────────────────────── */
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true); setStatsErr("");
      const j = await apiFetch("/api/global-admin/companies/statistics");
      setStats(j?.data || j || {});
    } catch (e) { setStatsErr(e.message); }
    finally { setStatsLoading(false); }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      setCompaniesLoading(true); setCompaniesErr("");
      const j = await apiFetch("/api/global-admin/companies");
      const list = Array.isArray(j) ? j : Array.isArray(j?.data) ? j.data : [];
      setCompanies(list);
    } catch (e) { setCompaniesErr(e.message); }
    finally { setCompaniesLoading(false); }
  }, []);

  const fetchDemos = useCallback(async () => {
    try {
      setDemosLoading(true); setDemosErr("");
      const j = await apiFetch("/api/company/companies");
      const list = Array.isArray(j) ? j : Array.isArray(j?.data) ? j.data : [];
      setDemos(list);
    } catch (e) { setDemosErr(e.message); }
    finally { setDemosLoading(false); }
  }, []);

  const fetchActs = useCallback(async () => {
    try {
      setActsLoading(true); setActsErr("");
      // Fetch 7 days of activity — limit=500 to get full week
      const j = await apiFetch("/api/global-admin/activity?limit=500&days=7");
      const raw = Array.isArray(j) ? j : Array.isArray(j?.data) ? j.data : [];
      // Filter to last 7 days only, auto-drop older
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      cutoff.setHours(0, 0, 0, 0);
      const week = raw.filter(a => {
        const d = new Date(a.createdAt || a.timestamp || a.time || Date.now());
        return d >= cutoff;
      });
      setActs(week);
      // Auto-remove deletedDays entries older than 7 days from localStorage
      const freshDeleted = (JSON.parse(localStorage.getItem("ga_deleted_act_days") || "[]"))
        .filter(ds => new Date(ds) >= cutoff);
      localStorage.setItem("ga_deleted_act_days", JSON.stringify(freshDeleted));
      setDeletedDays(freshDeleted);
    } catch (e) { setActsErr(e.message); }
    finally { setActsLoading(false); }
  }, []);

  /* initial load */
  useEffect(() => {
    fetchStats();
    fetchCompanies();
    fetchDemos();
    fetchActs();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchCompanies(), fetchDemos(), fetchActs()]);
    setRefreshing(false);
  };

  const openSvc = () => { setShowSvc(true); setSvcTab("demo"); };

  /* ── derive KPIs from real stats ─────────────────────────── */
  const total     = Number(stats?.totalCompanies)     || companies.length || 0;
  const active    = Number(stats?.activeCompanies)    || companies.filter(c => (c.status||"").toLowerCase() === "active").length || 0;
  const suspended = Number(stats?.suspendedCompanies) || companies.filter(c => (c.status||"").toLowerCase() === "suspended").length || 0;
  const employees = Number(stats?.totalEmployees)     || 0;
  const convRate  = total > 0 ? Math.round((active / total) * 100) : 0;

  /* ── derive chart data from real arrays ─────────────────── */

  // Company Growth — registered vs active per month (last 6 months)
  // "active" per month = companies whose status is active AND registered that month
  const companyGrowthData = (() => {
    const buckets = lastNMonths(6);
    return buckets.map(({ label, year, month }) => {
      const registered = companies.filter(c => {
        const raw = c.createdAt || c.createdDate || c.registrationDate || c.created_at;
        if (!raw) return false;
        const d = new Date(raw);
        return d.getFullYear() === year && d.getMonth() === month;
      }).length;

      // cumulative active up to this month
      const activeCount = companies.filter(c => {
        const raw = c.createdAt || c.createdDate || c.registrationDate || c.created_at;
        if (!raw) return false;
        const d = new Date(raw);
        const isBeforeOrSame = (d.getFullYear() < year) || (d.getFullYear() === year && d.getMonth() <= month);
        return isBeforeOrSame && (c.status || "").toLowerCase() === "active";
      }).length;

      return { month: label, Registered: registered, Active: activeCount };
    });
  })();

  // Demo Requests — grouped by month (last 6 months)
  const demoGrowthData = (() => {
    const buckets = lastNMonths(6);
    return buckets.map(({ label, year, month }) => ({
      month: label,
      Demos: demos.filter(d => {
        const raw = d.createdAt || d.createdDate || d.submittedAt || d.created_at;
        if (!raw) return false;
        const dt = new Date(raw);
        return dt.getFullYear() === year && dt.getMonth() === month;
      }).length,
    }));
  })();

  // Industry breakdown — from real company records
  const industryData = (() => {
    const raw = groupByField(companies, "industry");
    // fallback: try "organizationType" or "sector"
    if (raw.length === 0 || (raw.length === 1 && raw[0].name === "Unknown")) {
      const alt = groupByField(companies, "organizationType");
      return alt.length > 0 ? alt : groupByField(companies, "sector");
    }
    return raw.slice(0, 7); // top 7
  })();

  // Plan distribution — from real company records
  const planData = (() => {
    const raw = groupByField(companies, "subscriptionPlan");
    if (raw.length === 0 || (raw.length === 1 && raw[0].name === "Unknown")) {
      const alt = groupByField(companies, "plan");
      return alt.length > 0 ? alt.map(p => ({ plan: p.name, companies: p.value }))
                             : groupByField(companies, "planType").map(p => ({ plan: p.name, companies: p.value }));
    }
    return raw.slice(0, 6).map(p => ({ plan: p.name, companies: p.value }));
  })();

  // Platform Health computed from real data
  const activeRatePct  = convRate;
  const suspendedPct   = total > 0 ? Math.round((suspended / total) * 100) : 0;
  // Demo-to-company conversion: companies / (demos + companies) * 100
  const demoConvPct    = (demos.length + total) > 0
    ? Math.round((total / (demos.length + total)) * 100) : 0;
  // Recent activity SLA proxy: % of acts with severity "success"
  const slaScore       = acts.length > 0
    ? Math.round((acts.filter(a => (a.severity||"") === "success").length / acts.length) * 100) : 100;

  const healthItems = [
    { label: "Active Company Rate",   value: activeRatePct,    color: T.green,  desc: `${active} of ${total} companies active` },
    { label: "Demo → Company Rate",   value: demoConvPct,      color: T.blue,   desc: `${total} companies from ${demos.length + total} inquiries` },
    { label: "Platform Activity SLA", value: slaScore,         color: T.purple, desc: `${acts.filter(a=>(a.severity||"")==="success").length} success events` },
    { label: "Suspension Rate",       value: 100 - suspendedPct, color: suspendedPct > 20 ? T.red : T.amber, desc: `${suspended} suspended companies` },
  ];

  // Current month demo count for KPI
  const thisMonthDemos = demoGrowthData.at(-1)?.Demos ?? 0;

  /* ── KPI cards ────────────────────────────────────────────── */
  const kpis = [
    { label:"Total Companies",  value: statsLoading?"…":total,     sub:`${suspended} suspended`,      icon:Building2,   color:T.orange },
    { label:"Active Companies", value: statsLoading?"…":active,    sub:`${convRate}% active rate`,    icon:CheckCircle, color:T.green  },
    { label:"Total Employees",  value: statsLoading?"…":employees, sub:"Across all tenants",          icon:Users,       color:T.blue   },
    { label:"Demo Requests",    value: demosLoading?"…":thisMonthDemos, sub:"Registered this month",  icon:Eye,         color:T.purple },
  ];

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", color:T.text, paddingBottom:40 }}>

      {/* ── HEADER ────────────────────────────────────────────── */}
      <div style={{
        background:"linear-gradient(135deg,#0d1421 0%,#1a2540 55%,#0d1421 100%)",
        borderRadius:20, padding:"28px 32px 24px", marginBottom:24,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-60, right:60,  width:260, height:260, borderRadius:"50%", background:"rgba(255,107,53,0.10)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, right:260, width:180, height:180, borderRadius:"50%", background:"rgba(59,130,246,0.08)", pointerEvents:"none" }} />

        {/* top row */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", position:"relative", zIndex:1 }}>
          <div>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(255,107,53,0.85)", background:"rgba(255,107,53,0.12)", padding:"3px 10px", borderRadius:20, border:"1px solid rgba(255,107,53,0.2)" }}>
              SamayaHR · Global Admin
            </span>
            <h1 style={{ color:"#fff", fontSize:26, fontWeight:800, margin:"10px 0 5px", letterSpacing:"-0.02em" }}>Platform Overview</h1>
            <p style={{ color:"rgba(255,255,255,0.38)", fontSize:12, margin:0 }}>
              {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </p>
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={handleRefresh} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"8px 14px", cursor:"pointer", color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:600 }}>
              <RefreshCw size={13} style={{ animation:refreshing?"spin 1s linear infinite":"none" }} />
              Refresh
            </button>
            <button onClick={openSvc} style={{ display:"flex", alignItems:"center", gap:6, background:"linear-gradient(135deg,#ff6b35,#ff5722)", border:"none", borderRadius:10, padding:"8px 16px", cursor:"pointer", color:"#fff", fontSize:12, fontWeight:700, boxShadow:"0 4px 16px rgba(255,107,53,0.4)" }}>
              <Zap size={13} /> Services
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginTop:22, position:"relative", zIndex:1 }}>
          {kpis.map(({ label, value, sub, icon:Icon, color }) => (
            <div key={label} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:"14px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.38)", margin:0, fontWeight:600 }}>{label}</p>
                <div style={{ width:24, height:24, borderRadius:7, background:`${color}22`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon size={12} color={color} />
                </div>
              </div>
              <p style={{ fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 3px", letterSpacing:"-0.03em", lineHeight:1 }}>{value}</p>
              <p style={{ fontSize:10, color:"rgba(255,255,255,0.28)", margin:0 }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES PANEL ───────────────────────────────────────── */}
      {showSvc && (
        <div style={{ background:T.surface, borderRadius:16, border:`1px solid ${T.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.08)", marginBottom:24, overflow:"hidden" }}>

          {/* panel header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${T.border}`, background:"linear-gradient(135deg,#0d1421,#1a2540)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,107,53,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Zap size={16} color={T.orange} />
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:800, color:"#fff", margin:0 }}>Services Center</p>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.38)", margin:0 }}>Demo requests & company registry — live from database</p>
              </div>
            </div>
            <button onClick={() => setShowSvc(false)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:8, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.6)" }}>
              <X size={14} />
            </button>
          </div>

          {/* tabs */}
          <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, background:"#f8f9fc" }}>
            {[["demo","📋 Demo Requests"],["companies","🏢 Company Registry"]].map(([t,lbl]) => (
              <button key={t} onClick={() => setSvcTab(t)}
                style={{ padding:"12px 24px", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, background:"transparent", transition:"all 0.15s", borderBottom:svcTab===t?`2px solid ${T.orange}`:"2px solid transparent", color:svcTab===t?T.orange:T.muted }}>
                {lbl}
              </button>
            ))}
          </div>

          {/* summary pills */}
          <div style={{ display:"flex", gap:10, padding:"14px 20px", background:"#fafbfe", borderBottom:`1px solid ${T.border}` }}>
            {svcTab === "demo" ? (
              <>
                {[
                  { label:"Total Requests",    value: demosLoading?"…":demos.length,                                          color:T.purple },
                  { label:"This Month",        value: demosLoading?"…":thisMonthDemos,                                        color:T.blue   },
                  { label:"With Email",        value: demosLoading?"…":demos.filter(d=>d.companyEmail||d.workEmail||d.email).length, color:T.green  },
                ].map(({label,value,color}) => (
                  <div key={label} style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 14px" }}>
                    <p style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", margin:"0 0 3px" }}>{label}</p>
                    <p style={{ fontSize:20, fontWeight:800, color, margin:0 }}>{value}</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { label:"Total",     value: companiesLoading?"…":companies.length,                                                             color:T.orange },
                  { label:"Active",    value: companiesLoading?"…":companies.filter(c=>(c.status||"").toLowerCase()==="active").length,    color:T.green  },
                  { label:"Suspended", value: companiesLoading?"…":companies.filter(c=>(c.status||"").toLowerCase()==="suspended").length, color:T.red    },
                ].map(({label,value,color}) => (
                  <div key={label} style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 14px" }}>
                    <p style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", margin:"0 0 3px" }}>{label}</p>
                    <p style={{ fontSize:20, fontWeight:800, color, margin:0 }}>{value}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* table content */}
          <div style={{ maxHeight:380, overflowY:"auto" }}>
            {svcTab === "demo" && (
              demosLoading ? <PlaceholderRow loading msg="Loading demo requests from API…" /> :
              demosErr    ? <PlaceholderRow err msg={`Error: ${demosErr}`} /> :
              demos.length === 0 ? <PlaceholderRow msg="No demo requests in database yet." /> : (
                <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
                  <thead><tr>{["Name","Email","Phone","Company","Role","Action"].map(h=><SvcTH key={h}>{h}</SvcTH>)}</tr></thead>
                  <tbody>
                    {demos.map((r,i) => {
                      const em = r.companyEmail||r.workEmail||r.email||"";
                      return (
                        <tr key={i} style={{ borderBottom:`1px solid #f1f5f9` }}
                          onMouseEnter={e=>e.currentTarget.style.background="#fafbfc"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={svcTd}><span style={{ fontWeight:700 }}>{r.fullName||r.name||"—"}</span></td>
                          <td style={{...svcTd,color:T.muted}}>{em||"—"}</td>
                          <td style={{...svcTd,color:T.muted}}>{r.phoneNumber||r.phone||"—"}</td>
                          <td style={svcTd}>{r.companyName||"—"}</td>
                          <td style={svcTd}><span style={{ padding:"2px 8px", borderRadius:20, background:"#f1f5f9", color:T.muted, fontSize:11 }}>{r.designation||r.role||"—"}</span></td>
                          <td style={svcTd}>
                            {em
                              ? <a href={`mailto:${em}`} style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:8,background:T.orange,color:"#fff",fontSize:11,fontWeight:700,textDecoration:"none" }}><Mail size={10}/>Email</a>
                              : "—"
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}

            {svcTab === "companies" && (
              companiesLoading ? <PlaceholderRow loading msg="Loading companies from API…" /> :
              companiesErr    ? <PlaceholderRow err msg={`Error: ${companiesErr}`} /> :
              companies.length === 0 ? <PlaceholderRow msg="No companies registered yet." /> : (
                <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
                  <thead><tr>{["Company","Email","Tenant Code","Industry","Status","Employees"].map(h=><SvcTH key={h}>{h}</SvcTH>)}</tr></thead>
                  <tbody>
                    {companies.map((c,i) => {
                      const isActive = (c.status||"").toLowerCase()==="active";
                      const name = c.displayName||c.legalName||c.companyName||"—";
                      return (
                        <tr key={i} style={{ borderBottom:`1px solid #f1f5f9` }}
                          onMouseEnter={e=>e.currentTarget.style.background="#fafbfc"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={svcTd}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:28, height:28, borderRadius:8, background:`${T.orange}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:T.orange, flexShrink:0 }}>
                                {name[0].toUpperCase()}
                              </div>
                              <span style={{ fontWeight:700 }}>{name}</span>
                            </div>
                          </td>
                          <td style={{...svcTd,color:T.muted}}>{c.officialEmail||c.adminEmail||"—"}</td>
                          <td style={{...svcTd,fontFamily:"monospace",fontSize:11,color:T.dim}}>{c.tenantCode||c.companyKey||"—"}</td>
                          <td style={{...svcTd,color:T.muted}}>{c.industry||c.organizationType||c.sector||"—"}</td>
                          <td style={svcTd}>
                            <span style={{ padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700, background:isActive?"#dcfce7":"#fee2e2", color:isActive?"#16a34a":"#dc2626" }}>
                              {c.status||"—"}
                            </span>
                          </td>
                          <td style={{...svcTd,fontWeight:700,color:T.muted}}>{c.totalEmployees||c.employeeCount||"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      )}

      {/* ── CHART ROW 1 ──────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>

        {/* Company Growth */}
        <ChartCard
          title="Company Growth"
          subtitle="Registered & cumulative active companies — from database createdAt dates"
          icon={<TrendingUp size={14} color={T.orange} />}
          loading={companiesLoading}
          error={companiesErr}
          empty={!companiesLoading && !companiesErr && companies.length === 0}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={companyGrowthData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="gReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.orange} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={T.orange} stopOpacity={0.02}/>
                </linearGradient>
                <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.green} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={T.green} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:T.dim }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:T.dim }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }} />
              <Area type="monotone" dataKey="Registered" stroke={T.orange} strokeWidth={2.5} fill="url(#gReg)" dot={{ r:3, fill:T.orange }} />
              <Area type="monotone" dataKey="Active"     stroke={T.green}  strokeWidth={2.5} fill="url(#gAct)" dot={{ r:3, fill:T.green }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Demo Requests Growth */}
        <ChartCard
          title="Monthly Demo Requests"
          subtitle="Inbound demo signups — from database createdAt dates"
          icon={<BarChart3 size={14} color={T.purple} />}
          loading={demosLoading}
          error={demosErr}
          empty={!demosLoading && !demosErr && demos.length === 0}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demoGrowthData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:T.dim }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:T.dim }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Demos" name="Demo Requests" radius={[6,6,0,0]}>
                {demoGrowthData.map((d, i) => (
                  <Cell key={i} fill={i === demoGrowthData.length-1 ? T.orange : T.purple} fillOpacity={i === demoGrowthData.length-1 ? 1 : 0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── CHART ROW 2 ──────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18, marginBottom:18 }}>

        {/* Industry Mix */}
        <ChartCard
          title="Industry Mix"
          subtitle={`Derived from company.industry field (${companies.length} companies)`}
          icon={<PieIcon size={14} color={T.teal} />}
          loading={companiesLoading}
          error={companiesErr}
          empty={!companiesLoading && !companiesErr && industryData.length === 0}
        >
          {industryData.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPie>
                <Pie data={industryData} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={3} dataKey="value">
                  {industryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background:"#0d1421", border:"none", borderRadius:8, fontSize:11 }} itemStyle={{ color:"#fff" }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:10 }} />
              </RechartsPie>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Plan Distribution */}
        <ChartCard
          title="Plan Distribution"
          subtitle={`Derived from company.subscriptionPlan field`}
          icon={<BarChart3 size={14} color={T.blue} />}
          loading={companiesLoading}
          error={companiesErr}
          empty={!companiesLoading && !companiesErr && planData.length === 0}
        >
          {planData.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={planData} layout="vertical" margin={{ top:0, right:10, left:10, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize:10, fill:T.dim }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="plan" tick={{ fontSize:11, fill:T.muted, fontWeight:600 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="companies" name="Companies" radius={[0,6,6,0]}>
                  {planData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Platform Health */}
        <ChartCard
          title="Platform Health"
          subtitle="Computed from real stats ratios"
          icon={<Activity size={14} color={T.green} />}
          loading={statsLoading || companiesLoading || demosLoading || actsLoading}
          error=""
          empty={false}
        >
          <div style={{ padding:"4px 0", display:"flex", flexDirection:"column", gap:14 }}>
            {healthItems.map(({ label, value, color, desc }) => (
              <div key={label}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:5 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:T.muted }}>{label}</span>
                  <span style={{ fontSize:13, fontWeight:800, color }}>{value}%</span>
                </div>
                <div style={{ height:7, borderRadius:99, background:"#f1f5f9", overflow:"hidden" }}>
                  <div style={{ width:`${Math.min(value,100)}%`, height:"100%", borderRadius:99, background:`linear-gradient(90deg,${color}70,${color})`, transition:"width 1.2s ease" }} />
                </div>
                <p style={{ fontSize:10, color:T.dim, margin:"3px 0 0" }}>{desc}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── RECENT ACTIVITY ──────────────────────────────────────── */}
      {(() => {
        // Build last-7-days array (today first)
        const days7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(0, 0, 0, 0);
          return d;
        });

        const toKey = (d) => d.toISOString().slice(0, 10); // "YYYY-MM-DD"

        const activeKey   = selectedDay || toKey(days7[0]);
        const visibleActs = acts.filter(a => {
          const ts  = new Date(a.createdAt || a.timestamp || a.time || 0);
          return toKey(ts) === activeKey;
        }).filter(a => !deletedDays.includes(activeKey + "_" + (a.id || a._id || "")));

        const countForDay = (d) =>
          acts.filter(a => {
            const ts = new Date(a.createdAt || a.timestamp || a.time || 0);
            return toKey(ts) === toKey(d);
          }).length;

        // Delete helpers
        const deleteDayEvents = (key) => {
          const ids = acts
            .filter(a => toKey(new Date(a.createdAt || a.timestamp || a.time || 0)) === key)
            .map(a => key + "_" + (a.id || a._id || ""));
          const next = [...deletedDays, ...ids];
          setDeletedDays(next);
          localStorage.setItem("ga_deleted_act_days", JSON.stringify(next));
          setDeleteConfirm(null);
        };

        const deleteAllEvents = () => {
          const ids = acts.map(a =>
            toKey(new Date(a.createdAt || a.timestamp || a.time || 0)) + "_" + (a.id || a._id || "")
          );
          const next = [...deletedDays, ...ids];
          setDeletedDays(next);
          localStorage.setItem("ga_deleted_act_days", JSON.stringify(next));
          setDeleteConfirm(null);
        };

        const deleteBeforeWeek = () => {
          // Mark everything before 7 days as deleted (already filtered out from acts, but persist intent)
          const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
          const ids = acts
            .filter(a => new Date(a.createdAt || a.timestamp || a.time || 0) < cutoff)
            .map(a => toKey(new Date(a.createdAt || a.timestamp || a.time || 0)) + "_" + (a.id || a._id || ""));
          const next = [...deletedDays, ...ids];
          setDeletedDays(next);
          localStorage.setItem("ga_deleted_act_days", JSON.stringify(next));
          setDeleteConfirm(null);
        };

        const fmtDayLabel = (d) => {
          const now    = new Date(); now.setHours(0,0,0,0);
          const diff   = Math.round((now - d) / 86400000);
          if (diff === 0) return "Today";
          if (diff === 1) return "Yesterday";
          return d.toLocaleDateString("en-IN", { weekday:"short" });
        };
        const fmtDateSub = (d) =>
          d.toLocaleDateString("en-IN", { day:"2-digit", month:"short" });

        const totalVisible = acts.filter(a => !deletedDays.includes(
          toKey(new Date(a.createdAt || a.timestamp || a.time || 0)) + "_" + (a.id || a._id || "")
        )).length;

        return (
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8ecf2", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", overflow:"hidden" }}>

            {/* ── Header ── */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #f1f5f9" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:"#fff4ef", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Activity size={15} color="#FF6B35" />
                </div>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:"#0d1421", margin:0 }}>Recent Activity</p>
                  <p style={{ fontSize:11, color:"#94a3b8", margin:0 }}>Last 7 days · auto-clears after 1 week</p>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {totalVisible > 0 && (
                  <span style={{ padding:"3px 10px", borderRadius:20, background:"#fff4ef", color:"#FF6B35", fontSize:11, fontWeight:700 }}>
                    {totalVisible} events
                  </span>
                )}
                {/* Delete menu */}
                <div style={{ position:"relative" }}>
                  <button
                    onClick={() => setDeleteConfirm(deleteConfirm ? null : "menu")}
                    title="Delete options"
                    style={{ width:32, height:32, borderRadius:8, background:"#fef2f2", border:"1px solid #fecaca", color:"#ef4444", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {deleteConfirm === "menu" && (
                    <div style={{ position:"absolute", right:0, top:38, background:"#fff", border:"1px solid #e8ecf2", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", zIndex:50, minWidth:210, padding:6 }}>
                      <p style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".08em", padding:"6px 12px 4px", margin:0 }}>Delete Options</p>
                      <button onClick={() => setDeleteConfirm("day")}
                        style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 12px", borderRadius:8, border:"none", background:"transparent", cursor:"pointer", fontSize:13, fontWeight:600, color:"#ef4444", textAlign:"left" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#fef2f2"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        Delete selected day events
                      </button>
                      <button onClick={() => setDeleteConfirm("before")}
                        style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 12px", borderRadius:8, border:"none", background:"transparent", cursor:"pointer", fontSize:13, fontWeight:600, color:"#f59e0b", textAlign:"left" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#fffbeb"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Delete events older than 1 week
                      </button>
                      <div style={{ height:1, background:"#f1f5f9", margin:"4px 8px" }} />
                      <button onClick={() => setDeleteConfirm("all")}
                        style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 12px", borderRadius:8, border:"none", background:"transparent", cursor:"pointer", fontSize:13, fontWeight:600, color:"#dc2626", textAlign:"left" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#fef2f2"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                        Delete ALL activity (all 7 days)
                      </button>
                    </div>
                  )}
                </div>
                {/* Refresh */}
                <button onClick={fetchActs}
                  style={{ width:32, height:32, borderRadius:8, background:"#f8fafc", border:"1px solid #e8ecf2", color:"#64748b", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                  <RefreshCw size={13} style={{ animation: actsLoading ? "spin 0.8s linear infinite" : "none" }} />
                </button>
              </div>
            </div>

            {/* ── Confirm dialogs ── */}
            {(deleteConfirm === "day" || deleteConfirm === "all" || deleteConfirm === "before") && (
              <div style={{ margin:"12px 20px", padding:"12px 16px", borderRadius:12, background:"#fef2f2", border:"1px solid #fecaca", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                <p style={{ fontSize:12, fontWeight:600, color:"#dc2626", margin:0, flex:1 }}>
                  {deleteConfirm === "day"    && `Delete all events for ${fmtDayLabel(new Date(activeKey + "T00:00:00"))} (${fmtDateSub(new Date(activeKey + "T00:00:00"))})?`}
                  {deleteConfirm === "all"    && "Delete ALL activity across all 7 days? This cannot be undone."}
                  {deleteConfirm === "before" && "Delete all events older than 1 week from this session?"}
                </p>
                <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                  <button onClick={() => setDeleteConfirm(null)}
                    style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #e8ecf2", background:"#fff", fontSize:12, fontWeight:600, color:"#64748b", cursor:"pointer" }}>
                    Cancel
                  </button>
                  <button onClick={() => {
                    if (deleteConfirm === "day")    deleteDayEvents(activeKey);
                    if (deleteConfirm === "all")    deleteAllEvents();
                    if (deleteConfirm === "before") deleteBeforeWeek();
                  }} style={{ padding:"5px 12px", borderRadius:7, border:"none", background:"#dc2626", fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer" }}>
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}

            {/* ── 7-Day Tab Strip ── */}
            <div style={{ display:"flex", gap:6, padding:"14px 20px 0", overflowX:"auto", scrollbarWidth:"none" }}>
              <style>{`.act-day-strip::-webkit-scrollbar{display:none}`}</style>
              {days7.map((d) => {
                const key    = toKey(d);
                const cnt    = countForDay(d);
                const isActive = key === activeKey;
                return (
                  <button key={key} onClick={() => setSelectedDay(key)}
                    style={{
                      display:"flex", flexDirection:"column", alignItems:"center",
                      padding:"8px 14px", borderRadius:12, border: isActive ? "2px solid #FF6B35" : "1.5px solid #e8ecf2",
                      background: isActive ? "linear-gradient(135deg,rgba(255,107,53,.12),rgba(255,107,53,.04))" : "#fafbfc",
                      cursor:"pointer", flexShrink:0, minWidth:68, transition:"all .15s",
                      boxShadow: isActive ? "0 4px 12px rgba(255,107,53,.15)" : "none",
                    }}>
                    <span style={{ fontSize:11, fontWeight:800, color: isActive ? "#FF6B35" : "#64748b", textTransform:"uppercase", letterSpacing:".05em" }}>
                      {fmtDayLabel(d)}
                    </span>
                    <span style={{ fontSize:13, fontWeight:700, color: isActive ? "#0d1421" : "#94a3b8", lineHeight:1.2 }}>
                      {fmtDateSub(d)}
                    </span>
                    {cnt > 0 && (
                      <span style={{ marginTop:4, padding:"1px 7px", borderRadius:99, background: isActive ? "#FF6B35" : "#e8ecf2", color: isActive ? "#fff" : "#64748b", fontSize:10, fontWeight:700 }}>
                        {cnt}
                      </span>
                    )}
                    {cnt === 0 && (
                      <span style={{ marginTop:4, fontSize:9, color:"#cbd5e1", fontWeight:500 }}>no events</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Selected day label ── */}
            <div style={{ padding:"10px 20px 6px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#64748b" }}>
                {fmtDayLabel(new Date(activeKey + "T00:00:00"))} · {new Date(activeKey + "T00:00:00").toLocaleDateString("en-IN", { weekday:"long", day:"2-digit", month:"long", year:"numeric" })}
              </span>
              <span style={{ fontSize:11, color:"#94a3b8" }}>
                {visibleActs.length} event{visibleActs.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* ── Event List ── */}
            <div style={{ borderTop:"1px solid #f1f5f9", minHeight:80 }}>
              {actsLoading ? <PlaceholderRow loading msg="Loading activity…" /> :
               actsErr     ? <PlaceholderRow err    msg={`Error: ${actsErr}`} /> :
               visibleActs.length === 0 ? (
                <div style={{ padding:"36px 0", textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>📭</div>
                  <p style={{ fontSize:13, fontWeight:600, color:"#94a3b8", margin:0 }}>No activity on this day</p>
                  <p style={{ fontSize:11, color:"#cbd5e1", margin:"4px 0 0" }}>Events are kept for 7 days then auto-removed</p>
                </div>
               ) : (
                visibleActs.map((item, idx) => {
                  const c   = sevColor(item.severity);
                  const ts  = new Date(item.createdAt || item.timestamp || item.time || 0);
                  const timeStr = ts.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
                  return (
                    <div key={item.id || item._id || idx}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom: idx < visibleActs.length-1 ? "1px solid #f8fafc" : "none", transition:"background 0.1s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#fafbfc"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:`${c}15`, color:c, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {actIcon(item)}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:13, fontWeight:600, color:"#1e293b", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {item.message}
                        </p>
                        <p style={{ fontSize:11, color:"#94a3b8", margin:"3px 0 0", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{timeStr}</span>
                          {item.tag && (
                            <span style={{ padding:"1px 7px", borderRadius:4, background:"#f1f5f9", color:"#64748b", fontSize:10, fontWeight:600 }}>
                              {item.tag}
                            </span>
                          )}
                        </p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:c, flexShrink:0 }} />
                        {/* Per-item delete */}
                        <button
                          onClick={() => {
                            const id = activeKey + "_" + (item.id || item._id || "");
                            const next = [...deletedDays, id];
                            setDeletedDays(next);
                            localStorage.setItem("ga_deleted_act_days", JSON.stringify(next));
                          }}
                          title="Remove this event"
                          style={{ width:22, height:22, borderRadius:6, border:"none", background:"transparent", color:"#cbd5e1", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity:0.6 }}
                          onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2"; e.currentTarget.style.color="#ef4444"; e.currentTarget.style.opacity="1";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#cbd5e1"; e.currentTarget.style.opacity="0.6";}}>
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
               )}
            </div>

            {/* ── Footer note ── */}
            <div style={{ padding:"10px 20px", borderTop:"1px solid #f8fafc", background:"#fafbfc", display:"flex", alignItems:"center", gap:6 }}>
              <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span style={{ fontSize:10, color:"#94a3b8", fontWeight:500 }}>
                Activity older than 7 days is automatically removed. Deletions apply to this session view only.
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}