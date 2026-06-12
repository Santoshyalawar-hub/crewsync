import React, { useState, useEffect, useCallback } from "react";
import {
  FileText, Activity, Building2, ShieldCheck, DollarSign,
  Server, Package, Search, Download, RefreshCw, Loader2, AlertCircle,
} from "lucide-react";
import api from "@/lib/apiClient";

const S = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 32 },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
};

const TAG_ICONS = { Auth: ShieldCheck, Workspace: Building2, Payment: DollarSign, Subscription: Package, System: Server, CareDesk: FileText, Demo: Activity };
const TAG_COLORS = { Auth: "#6366f1", Workspace: "#8B5CF6", Payment: "#22c55e", Subscription: "#0ea5e9", System: "#f59e0b", CareDesk: "#8b5cf6", Demo: "#ec4899", Activity: "#64748b" };

function tagIcon(tag) {
  const Icon = TAG_ICONS[tag] || Activity;
  return <Icon style={{ width: 13, height: 13 }} />;
}

function sevStyle(s) {
  const m = { success: { bg: "#dcfce7", color: "#16a34a" }, warning: { bg: "#fef9c3", color: "#ca8a04" }, error: { bg: "#fee2e2", color: "#dc2626" }, danger: { bg: "#fee2e2", color: "#dc2626" } };
  return m[s] || { bg: "#dbeafe", color: "#8B5CF6" };
}

const Th = ({ ch }) => (
  <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{ch}</th>
);

function exportCSV(logs) {
  const rows = [["Event", "Tag", "Severity", "Actor", "Tenant", "Time"]];
  logs.forEach(l => rows.push([
    `"${(l.message || l.eventType || "").replace(/"/g, '""')}"`,
    l.tag || "",
    l.severity || "info",
    l.actorName || "system",
    l.tenantCode || "—",
    l.createdAt ? new Date(l.createdAt).toLocaleString() : l.timeAgo || "—",
  ]));
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `system-logs-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

const ALL_TAGS = ["Workspace", "Auth", "Payment", "Subscription", "System", "CareDesk", "Demo"];

export default function SystemLogs() {
  const [logs,      setLogs]      = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [search,    setSearch]    = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [page,      setPage]      = useState(0);
  const PAGE_SIZE = 25;

  const fetchLogs = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/api/global-admin/activity?limit=200");
      const data = res.data;
      // API returns array directly or { data: [...] }
      const arr = Array.isArray(data) ? data : (data.data || []);
      setLogs(arr);
    } catch {
      setError("Failed to load logs. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    const msg = (l.message || l.eventType || "").toLowerCase();
    const actor = (l.actorName || "").toLowerCase();
    const tag = (l.tag || "").toLowerCase();
    const matchSearch = !q || msg.includes(q) || actor.includes(q) || tag.includes(q);
    const matchTag = tagFilter === "all" || (l.tag || "").toLowerCase() === tagFilter.toLowerCase();
    return matchSearch && matchTag;
  });

  const tagCounts = ALL_TAGS.reduce((acc, t) => ({
    ...acc,
    [t]: logs.filter(l => (l.tag || "").toLowerCase() === t.toLowerCase()).length,
  }), {});

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 18, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 130, height: 130, borderRadius: "50%", background: "rgba(99,102,241,0.1)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>CrewSync · Global Operator</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>System Trail</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>
              {loading ? "Loading…" : `${filtered.length} events · live audit trail`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchLogs} disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: loading ? 0.6 : 1 }}>
              {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={14} />} Refresh
            </button>
            <button onClick={() => exportCSV(filtered)} disabled={filtered.length === 0}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: filtered.length === 0 ? 0.5 : 1 }}>
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

      {/* Tag filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => { setTagFilter("all"); setPage(0); }}
          style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: tagFilter === "all" ? "#0f172a" : "#f1f5f9", color: tagFilter === "all" ? "#fff" : "#64748b" }}>
          All ({logs.length})
        </button>
        {ALL_TAGS.filter(t => tagCounts[t] > 0).map(tag => {
          const tc = TAG_COLORS[tag] || "#64748b";
          const active = tagFilter.toLowerCase() === tag.toLowerCase();
          return (
            <button key={tag} onClick={() => { setTagFilter(tag); setPage(0); }}
              style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, background: active ? tc : "#f1f5f9", color: active ? "#fff" : tc }}>
              {tagIcon(tag)} {tag} ({tagCounts[tag]})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ ...S.card, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ position: "relative" }}>
          <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8" }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by event, actor, tenant, or tag…"
            style={{ width: "100%", paddingLeft: 30, padding: "8px 12px 8px 30px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading logs…
          </div>
        ) : paged.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            {logs.length === 0 ? "No logs yet — events will appear here as the platform is used." : "No logs match your filter."}
          </div>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  {["Event", "Tag", "Severity", "Actor", "Tenant", "Time"].map(h => <Th key={h} ch={h} />)}
                </tr>
              </thead>
              <tbody>
                {paged.map((l, i) => {
                  const sc = sevStyle(l.severity);
                  const tc = TAG_COLORS[l.tag] || "#64748b";
                  return (
                    <tr key={l.id || i} style={{ borderBottom: "1px solid #f1f5f9" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "11px 16px", fontWeight: 600, color: "#1e293b", maxWidth: 320 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 7, background: tc + "18", color: tc, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {tagIcon(l.tag)}
                          </div>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {l.message || l.eventType || "—"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: tc + "18", color: tc }}>
                          {l.tag || "Activity"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color }}>
                          {l.severity || "info"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: "#475569" }}>{l.actorName || "system"}</td>
                      <td style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>{l.tenantCode || "—"}</td>
                      <td style={{ padding: "11px 16px", fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>
                        {l.timeAgo || (l.createdAt ? new Date(l.createdAt).toLocaleString() : "—")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                    style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: page === 0 ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600, color: page === 0 ? "#cbd5e1" : "#1e293b" }}>
                    Prev
                  </button>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                    style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600, color: page >= totalPages - 1 ? "#cbd5e1" : "#1e293b" }}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
