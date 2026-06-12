import React, { useState, useEffect, useCallback } from "react";
import {
  Headphones, AlertCircle, Clock, CheckCircle, MessageSquare,
  Search, RefreshCw, Loader2, X, Send, ChevronDown,
} from "lucide-react";
import api from "@/lib/apiClient";

const S = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 32 },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  btn: (bg, color = "#fff") => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, background: bg, color, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }),
};

const PRIORITY_STYLE = {
  HIGH:    { bg: "#fee2e2", color: "#dc2626" },
  MEDIUM:  { bg: "#fef9c3", color: "#ca8a04" },
  LOW:     { bg: "#dcfce7", color: "#16a34a" },
  URGENT:  { bg: "#fce7f3", color: "#be185d" },
};
const STATUS_STYLE = {
  OPEN:        { bg: "#fff4ef", color: "#8B5CF6" },
  IN_PROGRESS: { bg: "#f0f9ff", color: "#0ea5e9" },
  RESOLVED:    { bg: "#f0fdf4", color: "#16a34a" },
  CLOSED:      { bg: "#f1f5f9", color: "#64748b" },
};

const Th = ({ ch }) => (
  <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{ch}</th>
);

function TicketDetailModal({ ticket, onClose, onStatusChange }) {
  const [comment, setComment]   = useState("");
  const [newStatus, setNewStatus] = useState(ticket.status);
  const [saving, setSaving]     = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (newStatus !== ticket.status) {
        await api.put(`/api/tickets/${ticket.id}/status`, { status: newStatus });
      }
      if (comment.trim()) {
        await api.post(`/api/tickets/${ticket.id}/comment`, { comment });
      }
      onStatusChange();
      onClose();
    } catch {
      // ignore
    } finally { setSaving(false); }
  };

  const ss = STATUS_STYLE[ticket.status] || { bg: "#f1f5f9", color: "#64748b" };
  const ps = PRIORITY_STYLE[ticket.priority] || { bg: "#f1f5f9", color: "#64748b" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: "18px 18px 0 0", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, margin: "0 0 4px", fontFamily: "monospace" }}>#{ticket.id}</p>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: 0 }}>{ticket.title || ticket.subject || "CareDesk Ticket"}</h2>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: ss.bg, color: ss.color }}>{ticket.status}</span>
            <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: ps.bg, color: ps.color }}>{ticket.priority}</span>
            {ticket.category && <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#f1f5f9", color: "#64748b" }}>{ticket.category}</span>}
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px", marginBottom: 20, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
            {ticket.description || ticket.message || "No description provided."}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20, fontSize: 12, color: "#64748b" }}>
            {[
              ["Workspace", ticket.companyName || ticket.tenantCode || "—"],
              ["Created", ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "—"],
              ["Assignee", ticket.assignedToName || "Unassigned"],
              ["Person", ticket.employeeName || "—"],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ fontWeight: 700, color: "#94a3b8", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>{label}</p>
                <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Update Status */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Update Status</label>
            <div style={{ position: "relative" }}>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                style={{ width: "100%", padding: "9px 32px 9px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", appearance: "none", background: "#fff", cursor: "pointer" }}>
                {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map(s => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Add Comment */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Add Note / Response</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Type a response or internal note…"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ ...S.btn("#f1f5f9", "#64748b") }}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              style={{ ...S.btn("#8B5CF6"), opacity: saving ? 0.6 : 1 }}>
              {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} />}
              {saving ? "Saving…" : "Save & Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareDeskTickets() {
  const [tickets,  setTickets]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/api/global-admin/tickets");
      const data = res.data;
      setTickets(data.success ? (data.data || []) : []);
    } catch {
      setError("Failed to load tickets.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const normalized = tickets.map(t => ({
    ...t,
    status: (t.status || "OPEN").toUpperCase().replace("-", "_").replace(" ", "_"),
    priority: (t.priority || "MEDIUM").toUpperCase(),
  }));

  const counts = {
    all: normalized.length,
    OPEN: normalized.filter(t => t.status === "OPEN").length,
    IN_PROGRESS: normalized.filter(t => t.status === "IN_PROGRESS").length,
    RESOLVED: normalized.filter(t => t.status === "RESOLVED").length,
    CLOSED: normalized.filter(t => t.status === "CLOSED").length,
  };

  const filtered = normalized.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (t.title || t.subject || "").toLowerCase().includes(q) ||
      (t.companyName || t.tenantCode || "").toLowerCase().includes(q) ||
      (t.employeeName || "").toLowerCase().includes(q);
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const FILTER_TABS = [
    { key: "all",         label: "All",         count: counts.all },
    { key: "OPEN",        label: "Open",        count: counts.OPEN },
    { key: "IN_PROGRESS", label: "In Progress", count: counts.IN_PROGRESS },
    { key: "RESOLVED",    label: "Resolved",    count: counts.RESOLVED },
    { key: "CLOSED",      label: "Closed",      count: counts.CLOSED },
  ].filter(t => t.key === "all" || t.count > 0);

  return (
    <div style={S.page}>
      {selected && (
        <TicketDetailModal ticket={selected} onClose={() => setSelected(null)} onStatusChange={fetchTickets} />
      )}

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 18, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 130, height: 130, borderRadius: "50%", background: "rgba(14,165,233,0.1)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>CrewSync · Global Operator</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Care Requests</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>
              {loading ? "Loading…" : `${tickets.length} tickets across all companies`}
            </p>
          </div>
          <button onClick={fetchTickets} disabled={loading}
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

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "All Tickets",  value: counts.all,         icon: Headphones,  accent: "#8B5CF6", bg: "#fff4ef" },
          { label: "Open",         value: counts.OPEN,        icon: AlertCircle, accent: "#ef4444", bg: "#fef2f2" },
          { label: "In Progress",  value: counts.IN_PROGRESS, icon: Clock,       accent: "#0ea5e9", bg: "#f0f9ff" },
          { label: "Resolved",     value: counts.RESOLVED + counts.CLOSED, icon: CheckCircle, accent: "#22c55e", bg: "#f0fdf4" },
        ].map(({ label, value, icon: Icon, accent, bg }) => (
          <div key={label} style={{ ...S.card, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={19} color={accent} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "2px 0 0", letterSpacing: "-0.02em" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, background: "#f1f5f9", padding: 4, borderRadius: 12 }}>
          {FILTER_TABS.map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filter === key ? "#fff" : "transparent", color: filter === key ? "#0f172a" : "#64748b", boxShadow: filter === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {label} ({count})
            </button>
          ))}
        </div>
        <div style={{ position: "relative", flex: 1 }}>
          <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, employee…"
            style={{ width: "100%", paddingLeft: 30, padding: "8px 12px 8px 30px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading tickets…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            {tickets.length === 0 ? "No tickets yet — they'll appear here when companies submit support requests." : "No tickets match your filter."}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["#", "Workspace", "Subject", "Priority", "Status", "Date", "Actions"].map(h => <Th key={h} ch={h} />)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const ps = PRIORITY_STYLE[t.priority] || { bg: "#f1f5f9", color: "#64748b" };
                const ss = STATUS_STYLE[t.status]     || { bg: "#f1f5f9", color: "#64748b" };
                return (
                  <tr key={t.id || i} style={{ borderBottom: "1px solid #f1f5f9" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 11, color: "#6366f1", fontWeight: 700 }}>#{t.id}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#334155", fontSize: 12 }}>
                      {t.companyName || t.tenantCode || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#1e293b", maxWidth: 260 }}>
                      <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>
                        {t.title || t.subject || "—"}
                      </p>
                      {t.employeeName && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>{t.employeeName}</p>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: ps.bg, color: ps.color }}>{t.priority}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: ss.bg, color: ss.color }}>{t.status.replace("_", " ")}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 11, color: "#94a3b8" }}>
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => setSelected(t)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#0ea5e9", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        <MessageSquare size={12} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
