import React, { useState, useEffect, useCallback } from "react";
import { BarChart3, RefreshCw, FileText, ClipboardList, Receipt, TrendingUp, Users, History } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "@/lib/apiClient";

/* ── SamayaHR design tokens ── */
const T = {
  navy: "#0D1F2D", navyMid: "#1E3448", coral: "#FF6B35", teal: "#00C2A8",
  bg: "#F5F7FB", border: "#E8ECF2",
};

const PIE_COLORS = ["#FF6B35", "#00C2A8", "#6366f1", "#f59e0b", "#22c55e", "#ec4899"];
const BAR_COLOR  = "#FF6B35";

const fmt = (n) => n >= 100000
  ? `₹${(n / 100000).toFixed(1)}L`
  : n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.fo { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.fo .fd { font-family:'Sora',sans-serif; }
.fo-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.fo-stat { background:#fff; border:1.5px solid ${T.border}; border-radius:16px; padding:18px 20px; display:flex; align-items:center; gap:14px; box-shadow:0 2px 10px rgba(13,31,45,.04); transition:all .18s; cursor:default; }
.fo-stat:hover { box-shadow:0 6px 22px rgba(13,31,45,.09); transform:translateY(-2px); }
.fo-stat-ico { width:46px; height:46px; border-radius:13px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.fo-qa-btn { display:flex; align-items:center; gap:10px; padding:13px 16px; border-radius:13px; border:1.5px solid ${T.border}; background:#fff; color:${T.navy}; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .18s; }
.fo-qa-btn:hover { border-color:${T.coral}; background:rgba(255,107,53,.05); color:${T.coral}; box-shadow:0 4px 14px rgba(255,107,53,.1); transform:translateY(-1px); }
.fo-qa-ico { width:34px; height:34px; border-radius:9px; background:#F1F5F9; display:flex; align-items:center; justify-content:center; transition:all .18s; flex-shrink:0; }
.fo-qa-btn:hover .fo-qa-ico { background:rgba(255,107,53,.15); color:${T.coral}; }
@keyframes foUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.fo-in  { animation:foUp .35s ease both; }
.fo-kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.fo-chart-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.fo-qa-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
@media(max-width:1100px){ .fo-kpi-grid{ grid-template-columns:1fr 1fr!important; } .fo-qa-grid{ grid-template-columns:1fr 1fr!important; } }
@media(max-width:700px){ .fo-chart-grid{ grid-template-columns:1fr!important; } .fo-kpi-grid{ grid-template-columns:1fr!important; } .fo-qa-grid{ grid-template-columns:1fr 1fr!important; } }
`;

const QUICK_ACTIONS = [
  { id: "generate",  label: "Generate Payroll",   Icon: RefreshCw,     pageKey: "ad_autopayroll" },
  { id: "payroll",   label: "Payroll Records",    Icon: FileText,      pageKey: "ad_payroll"     },
  { id: "salrev",    label: "Salary Revisions",   Icon: History,       pageKey: "ad_salrev"      },
  { id: "claims",    label: "Reimbursements",     Icon: ClipboardList, pageKey: "ad_finance"     },
];

export default function FinanceOverview({ navigateTo }) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const [trend,     setTrend]     = useState([]);
  const [deptCost,  setDeptCost]  = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [trendRes, deptRes, analyticsRes] = await Promise.all([
        api.get(`/api/payroll/analytics/monthly-trend?year=${year}`).then(r => r.data).catch(() => ({})),
        api.get(`/api/payroll/analytics/dept-cost?year=${year}&month=${month}`).then(r => r.data).catch(() => ({})),
        api.get(`/api/payroll/analytics`).then(r => r.data).catch(() => ({})),
      ]);

      if (Array.isArray(trendRes.data)) setTrend(trendRes.data);
      if (Array.isArray(deptRes.data))  setDeptCost(deptRes.data);
      if (analyticsRes.data)            setAnalytics(analyticsRes.data);
    } catch {
      // non-fatal
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  // KPI values from analytics API
  const totalPayout   = analytics?.totalPayouts   ?? trend.reduce((s, m) => s + Number(m.totalPayout || 0), 0);
  const activePayroll = analytics?.activePayrolls  ?? 0;
  const totalEmp      = analytics?.totalEmployees  ?? 0;
  const currentMonthPayout = trend.find(m => m.month === month)?.totalPayout ?? 0;

  const KPI_CARDS = [
    { value: totalEmp,             label: "Active Employees",     emoji: "👥", bg: "rgba(255,107,53,.1)",  color: T.coral,    fmt: v => v },
    { value: currentMonthPayout,   label: "Current Month Payroll",emoji: "💰", bg: "rgba(0,194,168,.1)",  color: T.teal,     fmt: fmt },
    { value: totalPayout,          label: `${year} Total Payout`, emoji: "📊", bg: "rgba(99,102,241,.1)", color: "#6366F1",  fmt: fmt },
    { value: activePayroll,        label: "Processed This Month", emoji: "✅", bg: "rgba(34,197,94,.1)",  color: "#16a34a",  fmt: v => v },
  ];

  // Dept pie data
  const deptPieData = deptCost
    .filter(d => d.department && Number(d.totalPayout) > 0)
    .map(d => ({ name: d.department, value: Number(d.totalPayout) }));

  // Monthly trend bar data
  const barData = trend.map(m => ({
    month: m.monthName || String(m.month),
    payout: Number(m.totalPayout || 0),
    count:  Number(m.employeeCount || 0),
  }));

  return (
    <div className="fo" style={{ padding: "0 0 56px" }}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, padding: "22px 26px", position: "relative", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ position: "absolute", top: -50, right: 60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,107,53,.07)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.coral, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>SamayaHR · Payroll</p>
            <h1 className="fd" style={{ fontSize: 23, fontWeight: 900, color: "#fff", margin: 0 }}>Finance Overview</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4 }}>Live payroll analytics &amp; trends — {year}</p>
          </div>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: "0 26px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── KPI CARDS ── */}
        <div className="fo-kpi-grid">
          {KPI_CARDS.map((c, i) => (
            <div key={i} className="fo-stat fo-in" style={{ animationDelay: `${i * .06}s` }}>
              <div className="fo-stat-ico" style={{ background: c.bg }}><span>{c.emoji}</span></div>
              <div>
                <p className="fd" style={{ fontSize: 22, fontWeight: 900, color: c.color, lineHeight: 1 }}>
                  {loading ? "…" : c.fmt(c.value)}
                </p>
                <p style={{ fontSize: 11, color: "#64748b", marginTop: 3, fontWeight: 600 }}>{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="fo-chart-grid fo-in" style={{ animationDelay: ".1s" }}>

          {/* Monthly payroll trend bar chart */}
          <div className="fo-card">
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,107,53,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={15} color={T.coral} />
              </div>
              <p className="fd" style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>Monthly Payroll Trend — {year}</p>
            </div>
            <div style={{ padding: "16px 18px" }}>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={barData} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                    <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Total Payout"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}` }} />
                    <Bar dataKey="payout" fill={BAR_COLOR} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 190, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
                  {loading ? "Loading…" : "No payroll data for this year yet"}
                </div>
              )}
            </div>
          </div>

          {/* Department-wise cost pie */}
          <div className="fo-card">
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(0,194,168,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={15} color={T.teal} />
              </div>
              <p className="fd" style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>
                Dept-wise Cost — {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
              </p>
            </div>
            <div style={{ padding: "16px 18px" }}>
              {deptPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie data={deptPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                      dataKey="value" nameKey="name" paddingAngle={3}>
                      {deptPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: `1px solid ${T.border}` }} />
                    <Legend iconType="circle" iconSize={8}
                      formatter={(v) => <span style={{ fontSize: 10, color: "#64748b" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 190, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
                  {loading ? "Loading…" : "No department payroll data for this month"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="fo-in" style={{ animationDelay: ".2s" }}>
          <p className="fd" style={{ fontSize: 13, fontWeight: 800, color: T.navy, marginBottom: 12 }}>Quick Actions</p>
          <div className="fo-qa-grid">
            {QUICK_ACTIONS.map(a => (
              <button key={a.id} className="fo-qa-btn" onClick={() => navigateTo && navigateTo(a.pageKey)}>
                <div className="fo-qa-ico"><a.Icon size={15} /></div>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── NOTICE ── */}
        <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(0,194,168,.06)", border: "1.5px solid rgba(0,194,168,.2)", display: "flex", alignItems: "center", gap: 10 }}>
          <TrendingUp size={14} color={T.teal} />
          <p style={{ fontSize: 12, color: "#475569" }}>Payroll analytics update in real-time from the database.</p>
        </div>
      </div>
    </div>
  );
}
