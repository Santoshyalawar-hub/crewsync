import React, { useState, useEffect, useCallback } from "react";
import {
  Shield, ShieldCheck, ShieldAlert, Lock, Activity,
  AlertCircle, CheckCircle, RefreshCw, Loader2, Building2,
  Users, Clock,
} from "lucide-react";
import api from "@/lib/apiClient";

const S = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 32 },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
};

// Derive security checks from real data
function buildChecks(companies, logs, stats) {
  const total = companies.length;
  const active = companies.filter(c => (c.status || "").toLowerCase() === "active").length;
  const suspended = total - active;
  const recent24h = logs.filter(l => {
    if (!l.createdAt) return false;
    return (Date.now() - new Date(l.createdAt).getTime()) < 24 * 60 * 60 * 1000;
  }).length;

  return [
    {
      label: "Company Status Monitoring",
      desc:  `${active} active, ${suspended} suspended companies`,
      status: suspended === 0 ? "pass" : suspended > 2 ? "fail" : "warn",
      detail: suspended > 0 ? `${suspended} company/ies are suspended — review billing` : "All companies are in good standing",
    },
    {
      label: "Audit Logging Active",
      desc:  `${logs.length} events captured in the audit trail`,
      status: logs.length > 0 ? "pass" : "warn",
      detail: logs.length > 0 ? `${recent24h} events in last 24 hours` : "No activity logged yet — verify logging is enabled",
    },
    {
      label: "Platform Activity (24h)",
      desc:  `${recent24h} events in the last 24 hours`,
      status: recent24h > 0 ? "pass" : "warn",
      detail: recent24h > 0 ? "Normal activity levels detected" : "No activity in last 24h — check if backend is running",
    },
    {
      label: "Employee Capacity Check",
      desc:  `Companies using employee slot limits`,
      status: (() => {
        const overloaded = companies.filter(c => c.employeeLimit && c.employees >= c.employeeLimit * 0.9);
        if (overloaded.length === 0) return "pass";
        if (overloaded.length > 2)  return "fail";
        return "warn";
      })(),
      detail: (() => {
        const overloaded = companies.filter(c => c.employeeLimit && c.employees >= c.employeeLimit * 0.9);
        return overloaded.length > 0
          ? `${overloaded.length} company/ies near or at employee limit: ${overloaded.map(c => c.displayName).join(", ")}`
          : "All companies well within limits";
      })(),
    },
    {
      label: "Data Integrity",
      desc:  "Companies with complete profile information",
      status: (() => {
        const incomplete = companies.filter(c => !c.adminEmail || !c.tenantCode || !c.plan);
        return incomplete.length === 0 ? "pass" : "warn";
      })(),
      detail: (() => {
        const incomplete = companies.filter(c => !c.adminEmail || !c.tenantCode || !c.plan);
        return incomplete.length > 0
          ? `${incomplete.length} company profiles are incomplete (missing email/tenant/plan)`
          : "All company records are complete";
      })(),
    },
    {
      label: "Suspicious Activity Detection",
      desc:  "Failed login / unusual event monitoring",
      status: (() => {
        const suspicious = logs.filter(l => (l.severity || "").toLowerCase() === "error" || (l.eventType || "").toLowerCase().includes("fail"));
        return suspicious.length === 0 ? "pass" : suspicious.length > 5 ? "fail" : "warn";
      })(),
      detail: (() => {
        const suspicious = logs.filter(l => (l.severity || "").toLowerCase() === "error" || (l.eventType || "").toLowerCase().includes("fail"));
        return suspicious.length > 0
          ? `${suspicious.length} suspicious event(s) detected — review system logs`
          : "No suspicious activity detected";
      })(),
    },
  ];
}

// Map logs to login activity feed
function buildLoginFeed(logs) {
  return logs
    .filter(l => l.tag === "Auth" || l.tag === "Company" || (l.eventType || "").toLowerCase().includes("login"))
    .slice(0, 10)
    .map(l => ({
      user: l.actorName || "System",
      event: l.message || l.eventType || "Activity",
      time: l.timeAgo || (l.createdAt ? new Date(l.createdAt).toLocaleString() : "—"),
      tenant: l.tenantCode || "—",
      severity: l.severity || "info",
    }));
}

const CHECK_STYLE = {
  pass: { bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle, iconColor: "#22c55e", badge: { bg: "#dcfce7", color: "#16a34a", label: "Pass" } },
  warn: { bg: "#fefce8", border: "#fde68a", icon: ShieldAlert,  iconColor: "#ca8a04", badge: { bg: "#fef9c3", color: "#ca8a04", label: "Warning" } },
  fail: { bg: "#fef2f2", border: "#fecaca", icon: ShieldAlert,  iconColor: "#dc2626", badge: { bg: "#fee2e2", color: "#dc2626", label: "Critical" } },
};

const SEV_STYLE = {
  info:    { bg: "#dbeafe", color: "#2563eb" },
  success: { bg: "#dcfce7", color: "#16a34a" },
  warning: { bg: "#fef9c3", color: "#ca8a04" },
  error:   { bg: "#fee2e2", color: "#dc2626" },
};

export default function SecurityCompliance() {
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
        api.get("/api/global-admin/activity?limit=100"),
      ]);
      setCompanies(cRes.data?.data || []);
      setStats(sRes.data?.data || {});
      const arr = Array.isArray(aRes.data) ? aRes.data : (aRes.data?.data || []);
      setLogs(arr);
    } catch {
      setError("Failed to load security data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const checks    = buildChecks(companies, logs, stats);
  const loginFeed = buildLoginFeed(logs);

  const passing  = checks.filter(c => c.status === "pass").length;
  const warnings = checks.filter(c => c.status === "warn").length;
  const failing  = checks.filter(c => c.status === "fail").length;
  const score    = Math.round((passing / checks.length) * 100) || 0;

  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#ca8a04" : "#dc2626";

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 18, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 130, height: 130, borderRadius: "50%", background: "rgba(239,68,68,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>SamayaHR · Global Admin</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Security & Compliance</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>
              {loading ? "Loading…" : `Security score: ${score}% · ${checks.length} checks · ${logs.length} events monitored`}
            </p>
          </div>
          <button onClick={fetchData} disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={14} />} Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 14 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "80px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} /> Running security checks…
        </div>
      ) : (
        <>
          {/* Score + Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
            {/* Score Ring */}
            <div style={{ ...S.card, padding: "20px 28px", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="8"
                    strokeDasharray={`${(score / 100) * 201} 201`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: scoreColor }}>{score}</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Security Score</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", margin: "4px 0 0" }}>
                  {score >= 80 ? "Good" : score >= 60 ? "Needs Attention" : "Critical"}
                </p>
              </div>
            </div>

            {[
              { label: "Checks Passing", value: passing,  icon: CheckCircle, accent: "#22c55e", bg: "#f0fdf4" },
              { label: "Warnings",       value: warnings, icon: ShieldAlert,  accent: "#ca8a04", bg: "#fefce8" },
              { label: "Critical",       value: failing,  icon: ShieldAlert,  accent: "#dc2626", bg: "#fef2f2" },
            ].map(({ label, value, icon: Icon, accent, bg }) => (
              <div key={label} style={{ ...S.card, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={19} color={accent} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "2px 0 0", letterSpacing: "-0.02em" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Security Checks */}
            <div style={{ ...S.card, padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>Security Checks</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {checks.map((check, i) => {
                  const cs = CHECK_STYLE[check.status];
                  const Icon = cs.icon;
                  return (
                    <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: cs.bg, border: `1px solid ${cs.border}` }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <Icon size={16} color={cs.iconColor} style={{ flexShrink: 0, marginTop: 1 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>{check.label}</p>
                            <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: cs.badge.bg, color: cs.badge.color }}>{cs.badge.label}</span>
                          </div>
                          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 3px" }}>{check.desc}</p>
                          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{check.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div style={{ ...S.card, padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>Recent Platform Activity</p>
              {loginFeed.length === 0 ? (
                <div style={{ padding: "32px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                  No recent activity found
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {loginFeed.map((entry, i) => {
                    const ss = SEV_STYLE[entry.severity] || SEV_STYLE.info;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < loginFeed.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Activity size={14} color="#64748b" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.event}</p>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{entry.user}</span>
                            {entry.tenant !== "—" && (
                              <span style={{ fontSize: 10, fontFamily: "monospace", color: "#c7d2fe", background: "#1e1b4b", padding: "1px 6px", borderRadius: 4 }}>{entry.tenant}</span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <span style={{ padding: "2px 7px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: ss.bg, color: ss.color }}>{entry.severity}</span>
                          <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>{entry.time}</span>
                        </div>
                      </div>
                    );
                  })}
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
