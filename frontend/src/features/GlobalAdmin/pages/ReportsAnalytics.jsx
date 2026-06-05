import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart3, TrendingUp, Users, Building2, Activity,
  Download, RefreshCw, Loader2, AlertCircle, Calendar,
} from "lucide-react";
import api from "@/lib/apiClient";

const S = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 32 },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
};

function Bar({ value, max, color }) {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 4;
  return (
    <div style={{ position: "relative", height: 160, display: "flex", alignItems: "flex-end" }}>
      <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: color, height: `${pct}%`, transition: "height 0.5s ease", position: "relative" }}>
        <span style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", fontSize: 11, fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>{value}</span>
      </div>
    </div>
  );
}

function exportCSV(companies, stats, logs) {
  const rows = [["Metric", "Value"]];
  rows.push(["Total Companies", stats.totalCompanies || 0]);
  rows.push(["Active Companies", stats.activeCompanies || 0]);
  rows.push(["Suspended Companies", stats.suspendedCompanies || 0]);
  rows.push(["Total Employees", stats.totalEmployees || 0]);
  rows.push(["", ""]);
  rows.push(["Company", "Plan", "Employees", "Status", "Created"]);
  companies.forEach(c => rows.push([
    `"${(c.displayName || "").replace(/"/g, '""')}"`,
    c.plan || "—",
    c.employees || 0,
    c.status || "—",
    c.createdDate || "—",
  ]));
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// Group companies by month of creation
function buildMonthlyData(companies) {
  const map = {};
  companies.forEach(c => {
    if (!c.createdDate) return;
    const d = new Date(c.createdDate);
    if (isNaN(d)) return;
    const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    map[key] = (map[key] || 0) + 1;
  });
  // Return last 7 months sorted chronologically
  const allMonths = Object.entries(map)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      const parse = s => new Date("1 " + s);
      return parse(a.label) - parse(b.label);
    })
    .slice(-7);
  return allMonths.length > 0 ? allMonths : [];
}

// Build plan distribution
function buildPlanDist(companies) {
  const map = {};
  companies.forEach(c => {
    const plan = c.plan || "Basic";
    map[plan] = (map[plan] || 0) + 1;
  });
  return Object.entries(map).map(([plan, count]) => ({ plan, count }));
}

// Build activity by type from logs
function buildActivityDist(logs) {
  const map = {};
  logs.forEach(l => {
    const tag = l.tag || l.eventType || "Other";
    map[tag] = (map[tag] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag, count]) => ({ tag, count }));
}

const PLAN_COLORS = { Enterprise: "#7c3aed", Professional: "#ff6b35", Basic: "#22c55e", Starter: "#0ea5e9" };
const TAG_COLORS  = { Company: "#ff6b35", Auth: "#6366f1", Payment: "#22c55e", Subscription: "#0ea5e9", System: "#f59e0b", Support: "#8b5cf6" };

export default function ReportsAnalytics() {
  const [companies, setCompanies] = useState([]);
  const [stats,     setStats]     = useState({});
  const [logs,      setLogs]      = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [cRes, sRes, aRes] = await Promise.all([
        api.get("/api/global-admin/companies"),
        api.get("/api/global-admin/companies/statistics"),
        api.get("/api/global-admin/activity?limit=200"),
      ]);
      setCompanies(cRes.data?.data || []);
      setStats(sRes.data?.data || {});
      const arr = Array.isArray(aRes.data) ? aRes.data : (aRes.data?.data || []);
      setLogs(arr);
    } catch {
      setError("Failed to load analytics data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const monthly     = buildMonthlyData(companies);
  const planDist    = buildPlanDist(companies);
  const activityDist = buildActivityDist(logs);
  const maxMonthly  = Math.max(...monthly.map(m => m.count), 1);

  const totalEmployees = companies.reduce((s, c) => s + (c.employees || 0), 0);
  const avgEmployees   = companies.length > 0 ? Math.round(totalEmployees / companies.length) : 0;
  const growthRate     = companies.length > 0
    ? Math.round((companies.filter(c => {
        const d = new Date(c.createdDate);
        const now = new Date();
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      }).length / companies.length) * 100)
    : 0;

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 18, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 130, height: 130, borderRadius: "50%", background: "rgba(99,102,241,0.1)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>SamayaHR · Global Admin</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Reports & Analytics</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>
              {loading ? "Loading…" : `Live data · ${companies.length} companies · ${logs.length} events tracked`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchData} disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: loading ? 0.6 : 1 }}>
              {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={14} />} Refresh
            </button>
            <button onClick={() => exportCSV(companies, stats, logs)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 14 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "80px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} /> Loading analytics…
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Total Companies",  value: stats.totalCompanies   || 0, icon: Building2,   accent: "#ff6b35", bg: "#fff4ef", sub: `${stats.activeCompanies || 0} active` },
              { label: "Total Employees",  value: totalEmployees,              icon: Users,        accent: "#0ea5e9", bg: "#f0f9ff", sub: `avg ${avgEmployees} / company` },
              { label: "Platform Events",  value: logs.length,                 icon: Activity,     accent: "#6366f1", bg: "#eef2ff", sub: "all time" },
              { label: "Growth This Month",value: `${growthRate}%`,            icon: TrendingUp,   accent: "#22c55e", bg: "#f0fdf4", sub: "new companies" },
            ].map(({ label, value, icon: Icon, accent, bg, sub }) => (
              <div key={label} style={{ ...S.card, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={accent} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "2px 0 0", letterSpacing: "-0.02em" }}>{value}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Monthly Company Registrations Chart */}
            <div style={{ ...S.card, padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>Company Registrations</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>Monthly breakdown (last 7 months)</p>
                </div>
                <Calendar size={16} color="#94a3b8" />
              </div>
              {monthly.length === 0 ? (
                <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
                  No registration data yet
                </div>
              ) : (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 180 }}>
                  {monthly.map(({ label, count }) => (
                    <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <Bar value={count} max={maxMonthly} color="#ff6b35" />
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap" }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan Distribution */}
            <div style={{ ...S.card, padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>Plan Distribution</p>
              {planDist.length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "30px 0" }}>No data</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {planDist.map(({ plan, count }) => {
                    const total = planDist.reduce((s, p) => s + p.count, 0);
                    const pct = Math.round((count / total) * 100);
                    const color = PLAN_COLORS[plan] || "#64748b";
                    return (
                      <div key={plan}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{plan}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 4, background: "#f1f5f9" }}>
                          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: color, transition: "width 0.5s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Activity Breakdown */}
            <div style={{ ...S.card, padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>Activity by Type</p>
              {activityDist.length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "30px 0" }}>No activity data yet</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {activityDist.map(({ tag, count }) => {
                    const total = activityDist.reduce((s, a) => s + a.count, 0);
                    const pct = Math.round((count / total) * 100);
                    const color = TAG_COLORS[tag] || "#64748b";
                    return (
                      <div key={tag}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{tag}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color }}>{count}</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 4, background: "#f1f5f9" }}>
                          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Companies by Employees */}
            <div style={{ ...S.card, padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>Top Companies by Employees</p>
              {companies.length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "30px 0" }}>No company data</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[...companies]
                    .sort((a, b) => (b.employees || 0) - (a.employees || 0))
                    .slice(0, 5)
                    .map((c, i) => {
                      const maxEmp = companies.reduce((m, x) => Math.max(m, x.employees || 0), 1);
                      const pct = Math.round(((c.employees || 0) / maxEmp) * 100);
                      return (
                        <div key={c.id || i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{c.displayName}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#ff6b35" }}>{c.employees || 0}</span>
                          </div>
                          <div style={{ height: 5, borderRadius: 4, background: "#f1f5f9" }}>
                            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #ff6b35, #ff8c5a)" }} />
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
