import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard, CheckCircle, XCircle, Users, Building2,
  RefreshCw, Loader2, AlertCircle, Download, TrendingUp, ChevronDown,
} from "lucide-react";
import api from "@/lib/apiClient";

const S = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 32 },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  btn: (bg, color = "#fff") => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, background: bg, color, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }),
  input: { width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fff" },
};

const PLAN_COLORS = {
  Enterprise:   { bg: "#f5f3ff", color: "#7c3aed", border: "#c4b5fd" },
  Professional: { bg: "#fff4ef", color: "#ff6b35", border: "#fed7aa" },
  Basic:        { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Starter:      { bg: "#f0f9ff", color: "#0ea5e9", border: "#bae6fd" },
};

const PLAN_PRICES = { Enterprise: 9999, Professional: 4999, Basic: 1999, Starter: 999 };

const Th = ({ ch }) => (
  <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{ch}</th>
);

function exportCSV(companies) {
  const rows = [["Company", "Plan", "Employees", "Employee Limit", "Billing Cycle", "Status", "MRR (₹)", "Created"]];
  companies.forEach(c => {
    const mrr = PLAN_PRICES[c.plan] || 0;
    rows.push([
      `"${(c.displayName || "").replace(/"/g, '""')}"`,
      c.plan || "—",
      c.employees || 0,
      c.employeeLimit || "—",
      c.billingCycle || "monthly",
      c.status || "—",
      mrr,
      c.createdDate || "—",
    ]);
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function SubscriptionsBilling() {
  const [companies, setCompanies] = useState([]);
  const [stats,     setStats]     = useState({});
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [tab,       setTab]       = useState("overview");
  const [planFilter,setPlanFilter]= useState("all");
  const [search,    setSearch]    = useState("");
  const [upgradingId, setUpgradingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [cRes, sRes] = await Promise.all([
        api.get("/api/global-admin/companies"),
        api.get("/api/global-admin/companies/statistics"),
      ]);
      setCompanies(cRes.data?.data || []);
      setStats(sRes.data?.data || {});
    } catch {
      setError("Failed to load subscription data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpgrade = async (companyId, newPlan) => {
    setUpgradingId(companyId);
    try {
      await api.put(`/api/global-admin/companies/${companyId}`, { plan: newPlan });
      setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, plan: newPlan } : c));
    } catch { /* ignore */ }
    finally { setUpgradingId(null); }
  };

  const active    = companies.filter(c => (c.status || "").toLowerCase() === "active");
  const suspended = companies.filter(c => (c.status || "").toLowerCase() !== "active");
  const mrr = active.reduce((sum, c) => sum + (PLAN_PRICES[c.plan] || 0), 0);
  const totalEmployees = companies.reduce((s, c) => s + (c.employees || 0), 0);

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (c.displayName || "").toLowerCase().includes(q) ||
      (c.adminEmail  || "").toLowerCase().includes(q) ||
      (c.tenantCode  || "").toLowerCase().includes(q);
    const matchPlan = planFilter === "all" || c.plan === planFilter;
    return matchSearch && matchPlan;
  });

  const planCounts = companies.reduce((acc, c) => {
    acc[c.plan || "Basic"] = (acc[c.plan || "Basic"] || 0) + 1;
    return acc;
  }, {});

  const PLANS = [
    { name: "Starter",      price: 999,  emp: 10,  features: ["Core HR", "Attendance", "Leave"] },
    { name: "Basic",        price: 1999, emp: 50,  features: ["All Starter", "Payroll", "Reports"] },
    { name: "Professional", price: 4999, emp: 200, features: ["All Basic", "Custom Roles", "API Access"] },
    { name: "Enterprise",   price: 9999, emp: "∞", features: ["All Pro", "Dedicated Support", "SLA"] },
  ];

  const TABS = [
    { key: "overview",  label: "Overview" },
    { key: "companies", label: `Companies (${companies.length})` },
    { key: "plans",     label: "Plan Catalog" },
  ];

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 18, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 130, height: 130, borderRadius: "50%", background: "rgba(34,197,94,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>SamayaHR · Global Admin</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Subscriptions & Billing</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>
              {loading ? "Loading…" : `₹${mrr.toLocaleString("en-IN")} MRR · ${active.length} active subscriptions`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchData} disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: loading ? 0.6 : 1 }}>
              {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={14} />} Refresh
            </button>
            <button onClick={() => exportCSV(companies)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 14 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Monthly Revenue",  value: `₹${mrr.toLocaleString("en-IN")}`, icon: TrendingUp,  accent: "#22c55e", bg: "#f0fdf4" },
          { label: "Active",           value: active.length,                      icon: CheckCircle, accent: "#22c55e", bg: "#f0fdf4" },
          { label: "Suspended",        value: suspended.length,                   icon: XCircle,     accent: "#ef4444", bg: "#fef2f2" },
          { label: "Total Employees",  value: totalEmployees,                     icon: Users,       accent: "#8b5cf6", bg: "#f5f3ff" },
        ].map(({ label, value, icon: Icon, accent, bg }) => (
          <div key={label} style={{ ...S.card, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={19} color={accent} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "2px 0 0", letterSpacing: "-0.02em" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "#f1f5f9", padding: 4, borderRadius: 12, width: "fit-content" }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: "7px 16px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: tab === key ? "#fff" : "transparent", color: tab === key ? "#0f172a" : "#64748b", boxShadow: tab === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Plan Distribution */}
          <div style={{ ...S.card, padding: "20px 24px" }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>Plan Distribution</p>
            {Object.keys(planCounts).length === 0 ? (
              <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "30px 0" }}>No companies yet</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {Object.entries(planCounts).map(([plan, count]) => {
                  const total = companies.length;
                  const pct = Math.round((count / total) * 100);
                  const pc = PLAN_COLORS[plan] || { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
                  const price = PLAN_PRICES[plan] || 0;
                  return (
                    <div key={plan}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: pc.bg, color: pc.color }}>{plan}</span>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>{count} companies</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>₹{(price * count).toLocaleString("en-IN")}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>/ mo</span>
                        </div>
                      </div>
                      <div style={{ height: 6, borderRadius: 4, background: "#f1f5f9" }}>
                        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: pc.color, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Revenue Breakdown */}
          <div style={{ ...S.card, padding: "20px 24px" }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>Revenue Breakdown</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(PLAN_PRICES).map(([plan, price]) => {
                const count = planCounts[plan] || 0;
                const revenue = price * count;
                const pc = PLAN_COLORS[plan] || { bg: "#f1f5f9", color: "#64748b" };
                return (
                  <div key={plan} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: pc.bg + "80", border: `1px solid ${pc.border || "#e2e8f0"}` }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: pc.color, margin: 0 }}>{plan}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>₹{price.toLocaleString("en-IN")}/mo × {count}</p>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>₹{revenue.toLocaleString("en-IN")}</p>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: "#0f172a", marginTop: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", margin: 0 }}>Total MRR</p>
                <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0 }}>₹{mrr.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {tab === "companies" && (
        <>
          <div style={{ ...S.card, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by company name, email, or tenant…"
              style={{ ...S.input, flex: 1 }} />
            <div style={{ position: "relative" }}>
              <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
                style={{ ...S.input, width: "auto", minWidth: 140, appearance: "none", paddingRight: 28 }}>
                <option value="all">All Plans</option>
                {Object.keys(PLAN_PRICES).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            </div>
          </div>
          <div style={{ ...S.card, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading…
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: "#0f172a" }}>
                  {["Company", "Plan", "Employees", "MRR", "Status", "Billing", "Change Plan"].map(h => <Th key={h} ch={h} />)}
                </tr></thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const pc = PLAN_COLORS[c.plan] || { bg: "#f1f5f9", color: "#64748b" };
                    const isActive = (c.status || "").toLowerCase() === "active";
                    const mrr_c = PLAN_PRICES[c.plan] || 0;
                    return (
                      <tr key={c.id || i} style={{ borderBottom: "1px solid #f1f5f9" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ fontWeight: 700, color: "#1e293b", margin: 0 }}>{c.displayName}</p>
                          <p style={{ fontSize: 10, color: "#94a3b8", margin: "2px 0 0", fontFamily: "monospace" }}>{c.tenantCode}</p>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: pc.bg, color: pc.color }}>{c.plan || "Basic"}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569", fontWeight: 600 }}>
                          {c.employees || 0} / {c.employeeLimit || "∞"}
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "#22c55e" }}>
                          ₹{mrr_c.toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: isActive ? "#dcfce7" : "#fee2e2", color: isActive ? "#16a34a" : "#dc2626" }}>
                            {isActive ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>{c.billingCycle || "Monthly"}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ position: "relative" }}>
                            <select
                              value={c.plan || "Basic"}
                              disabled={upgradingId === c.id}
                              onChange={e => handleUpgrade(c.id, e.target.value)}
                              style={{ padding: "5px 24px 5px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, outline: "none", appearance: "none", cursor: "pointer", background: "#fff" }}>
                              {Object.keys(PLAN_PRICES).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            {upgradingId === c.id
                              ? <Loader2 size={11} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", animation: "spin 1s linear infinite" }} />
                              : <ChevronDown size={11} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Plan Catalog Tab */}
      {tab === "plans" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PLANS.map(({ name, price, emp, features }) => {
            const pc = PLAN_COLORS[name] || { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
            const count = planCounts[name] || 0;
            return (
              <div key={name} style={{ ...S.card, padding: "24px 20px", border: `1px solid ${pc.border || "#e2e8f0"}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: pc.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <CreditCard size={20} color={pc.color} />
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>{name}</p>
                <p style={{ fontSize: 24, fontWeight: 900, color: pc.color, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                  ₹{price.toLocaleString("en-IN")}
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>/mo</span>
                </p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 16px" }}>Up to {emp} employees</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{count} companies on this plan</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#475569" }}>
                      <CheckCircle size={13} color={pc.color} /> {f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
