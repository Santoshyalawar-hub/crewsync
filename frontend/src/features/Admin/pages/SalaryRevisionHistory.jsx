import React, { useState, useEffect, useCallback } from "react";
import { History, Search, ChevronDown, TrendingUp, TrendingDown, Minus, RefreshCw, User } from "lucide-react";
import api from "@/lib/apiClient";

/* ── Design tokens ── */
const T = {
  navy: "#0B1020", navyMid: "#374151", coral: "#8B5CF6", teal: "#06B6D4",
  bg: "#F5F7FB", border: "#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.srh { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.srh .fd { font-family:'Sora',sans-serif; }
.srh-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.srh-emp-item { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:10px; cursor:pointer; transition:all .15s; }
.srh-emp-item:hover { background:rgba(139,92,246,.06); }
.srh-emp-item.active { background:rgba(139,92,246,.1); }
.srh-emp-avatar { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; flex-shrink:0; }
.srh-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:6px; font-size:10px; font-weight:700; }
.srh-row { border-bottom:1px solid ${T.border}; }
.srh-row:last-child { border-bottom:none; }
@keyframes srhUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.srh-in { animation:srhUp .3s ease both; }
`;


const fmt = (n) => {
  if (n == null) return "—";
  const num = Number(n);
  return num >= 100000 ? `₹${(num / 100000).toFixed(1)}L`
       : num >= 1000   ? `₹${(num / 1000).toFixed(1)}k`
       : `₹${num.toLocaleString("en-IN")}`;
};

const avatarColor = (name = "") => {
  const colors = ["#8B5CF6","#06B6D4","#6366f1","#f59e0b","#22c55e","#ec4899","#3b82f6"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % colors.length;
  return colors[h];
};

const CHANGE_COLORS = {
  "Added":             { bg: "rgba(34,197,94,.1)",    color: "#16a34a" },
  "Amount changed":    { bg: "rgba(99,102,241,.1)",   color: "#6366f1" },
  "Activated":         { bg: "rgba(6,182,212,.1)",    color: "#06B6D4" },
  "Deactivated":       { bg: "rgba(239,68,68,.1)",    color: "#dc2626" },
  "default":           { bg: "rgba(100,116,139,.1)",  color: "#64748b" },
};

function ChangeIcon({ reason }) {
  if (!reason) return <Minus size={12} />;
  if (reason.includes("Amount")) return <TrendingUp size={12} />;
  if (reason === "Activated")    return <TrendingUp size={12} />;
  if (reason === "Deactivated")  return <TrendingDown size={12} />;
  return <Minus size={12} />;
}

export default function CompensationRevisionHistory() {
  const [employees, setPersons]   = useState([]);
  const [selected,  setSelected]    = useState(null);
  const [history,   setHistory]     = useState([]);
  const [empSearch, setEmpSearch]   = useState("");
  const [loading,   setLoading]     = useState(false);
  const [empLoading,setEmpLoading]  = useState(true);

  // Fetch employees
  useEffect(() => {
    api.get("/api/users/tenant/employees")
      .then(res => {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setPersons(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => {})
      .finally(() => setEmpLoading(false));
  }, []);

  // Fetch history whenever selected employee changes
  const loadHistory = useCallback(async (emp) => {
    if (!emp) return;
    setLoading(true);
    setHistory([]);
    try {
      const res = await api.get(`/api/salary-components/employee/${emp.id}/history`);
      setHistory(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(selected); }, [selected, loadHistory]);

  const filtered = employees.filter(e =>
    !empSearch ||
    (e.fullName || "").toLowerCase().includes(empSearch.toLowerCase()) ||
    (e.employeeId || "").toLowerCase().includes(empSearch.toLowerCase())
  );

  // Group history by effectiveDate
  const grouped = history.reduce((acc, row) => {
    const key = row.effectiveDate || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="srh" style={{ padding: "0 0 56px" }}>
      <style>{CSS}</style>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, padding: "22px 26px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(139,92,246,.07)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(139,92,246,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <History size={18} color={T.coral} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.coral, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 3 }}>CrewSync · Payouts</p>
            <h1 className="fd" style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>Compensation Revision History</h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 3 }}>Immutable audit trail of every salary component change</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 26px", display: "flex", gap: 16 }}>

        {/* ── Person list panel ── */}
        <div className="srh-card" style={{ width: 260, flexShrink: 0, maxHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.bg, borderRadius: 9, padding: "7px 10px", border: `1px solid ${T.border}` }}>
              <Search size={13} color="#94a3b8" />
              <input
                value={empSearch}
                onChange={e => setEmpSearch(e.target.value)}
                placeholder="Search employees…"
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: T.navy, width: "100%" }}
              />
            </div>
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: "8px" }}>
            {empLoading ? (
              <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>Loading…</p>
            ) : filtered.length === 0 ? (
              <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>No employees found</p>
            ) : (
              filtered.map(emp => (
                <div
                  key={emp.id}
                  className={`srh-emp-item${selected?.id === emp.id ? " active" : ""}`}
                  onClick={() => setSelected(emp)}
                >
                  <div className="srh-emp-avatar" style={{ background: `${avatarColor(emp.fullName || "")}22`, color: avatarColor(emp.fullName || "") }}>
                    {(emp.fullName || "?")[0].toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: T.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.fullName || "—"}</p>
                    <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>{emp.employeeId || emp.department || ""}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── History panel ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selected ? (
            <div className="srh-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
              <div style={{ textAlign: "center" }}>
                <User size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 13, color: "#94a3b8" }}>Select an employee to view their salary revision history</p>
              </div>
            </div>
          ) : (
            <>
              {/* Selected employee header */}
              <div className="srh-card srh-in" style={{ padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="srh-emp-avatar" style={{ width: 44, height: 44, background: `${avatarColor(selected.fullName || "")}22`, color: avatarColor(selected.fullName || ""), fontSize: 16 }}>
                    {(selected.fullName || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="fd" style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>{selected.fullName}</p>
                    <p style={{ fontSize: 11, color: "#64748b" }}>
                      {selected.department || ""}
                      {selected.department && selected.position ? " · " : ""}
                      {selected.position || ""}
                      {selected.employeeId ? ` · ${selected.employeeId}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => loadHistory(selected)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: T.bg, border: `1.5px solid ${T.border}`, color: T.navy, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {/* Timeline */}
              {loading ? (
                <div className="srh-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                  <p style={{ fontSize: 13, color: "#94a3b8" }}>Loading history…</p>
                </div>
              ) : sortedDates.length === 0 ? (
                <div className="srh-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 8 }}>
                  <History size={28} color="#cbd5e1" />
                  <p style={{ fontSize: 13, color: "#94a3b8" }}>No salary revisions recorded yet</p>
                  <p style={{ fontSize: 11, color: "#cbd5e1" }}>Changes will appear here after the first salary update</p>
                </div>
              ) : (
                sortedDates.map((date, di) => (
                  <div key={date} className="srh-card srh-in" style={{ marginBottom: 12, animationDelay: `${di * .05}s` }}>
                    {/* Date header */}
                    <div style={{ padding: "10px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, background: "rgba(13,31,45,.02)" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.coral }} />
                      <p className="fd" style={{ fontSize: 12, fontWeight: 800, color: T.navy }}>
                        {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>
                        {grouped[date].length} change{grouped[date].length > 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Change rows */}
                    {grouped[date].map((rev, ri) => {
                      const c = CHANGE_COLORS[rev.changeReason] || CHANGE_COLORS["default"];
                      const amtDiff = (rev.newAmount != null && rev.oldAmount != null)
                        ? Number(rev.newAmount) - Number(rev.oldAmount)
                        : null;
                      return (
                        <div key={rev.id} className="srh-row" style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                          {/* Icon */}
                          <div style={{ width: 30, height: 30, borderRadius: 9, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ChangeIcon reason={rev.changeReason} />
                          </div>

                          {/* Component info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{rev.componentName || rev.componentKey}</p>
                              <span className="srh-badge" style={{ background: rev.componentType === "EARNING" ? "rgba(6,182,212,.1)" : "rgba(239,68,68,.08)", color: rev.componentType === "EARNING" ? T.teal : "#dc2626" }}>
                                {rev.componentType}
                              </span>
                            </div>
                            <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                              {rev.oldAmount != null ? `${fmt(rev.oldAmount)} → ${fmt(rev.newAmount)}` : `Set to ${fmt(rev.newAmount)}`}
                              {rev.oldActive !== null && rev.oldActive !== rev.newActive && (
                                <span style={{ marginLeft: 6, color: rev.newActive ? T.teal : "#dc2626" }}>
                                  · {rev.newActive ? "Activated" : "Deactivated"}
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Delta badge */}
                          {amtDiff !== null && amtDiff !== 0 && (
                            <div style={{ flexShrink: 0 }}>
                              <span className="srh-badge" style={{ background: amtDiff > 0 ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)", color: amtDiff > 0 ? "#16a34a" : "#dc2626", fontSize: 11 }}>
                                {amtDiff > 0 ? "+" : ""}{fmt(amtDiff)}
                              </span>
                            </div>
                          )}

                          {/* Change type badge */}
                          <div style={{ flexShrink: 0 }}>
                            <span className="srh-badge" style={{ background: c.bg, color: c.color }}>
                              <ChangeIcon reason={rev.changeReason} />
                              {rev.changeReason || "Changed"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
