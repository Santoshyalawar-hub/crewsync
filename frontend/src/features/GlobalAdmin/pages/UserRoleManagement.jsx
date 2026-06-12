import React, { useState, useEffect, useCallback } from "react";
import {
  Users, ShieldCheck, Plus, Search, Trash2,
  Loader2, AlertCircle, RefreshCw, X, CheckCircle,
  Building2, ChevronDown,
} from "lucide-react";
import api from "@/lib/apiClient";

const S = {
  page:  { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 32 },
  card:  { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  label: { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fff" },
  btn:   (bg, color = "#fff") => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, background: bg, color, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }),
};

const ROLE_STYLE = {
  ADMIN:          { bg: "#fff4ef", color: "#8B5CF6" },
  SUPER_ADMIN:    { bg: "#f5f3ff", color: "#A855F7" },
  EMPLOYEE:       { bg: "#f0f9ff", color: "#0ea5e9" },
  GLOBAL_ADMIN:   { bg: "#fef9c3", color: "#ca8a04" },
  COMPANY_ADMIN:  { bg: "#fff4ef", color: "#8B5CF6" },
};

const STATUS_STYLE = {
  ACTIVE:   { bg: "#dcfce7", color: "#16a34a" },
  INACTIVE: { bg: "#fee2e2", color: "#dc2626" },
  PENDING:  { bg: "#fef9c3", color: "#ca8a04" },
};

const Th = ({ ch }) => (
  <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{ch}</th>
);

function AddUserModal({ companies, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", email: "", role: "EMPLOYEE", companyId: "", tenantCode: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleWorkspaceChange = (id) => {
    const company = companies.find(c => String(c.id) === id);
    set("companyId", id);
    if (company) set("tenantCode", company.tenantCode || "");
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required"); return; }
    if (!form.companyId) { setError("Please select a company"); return; }
    setSaving(true); setError("");
    try {
      await api.post("/api/users/tenant/admins",
        { name: form.name, email: form.email, role: form.role },
        { headers: { "X-Tenant-Code": form.tenantCode, "X-Workspace-Id": form.companyId } }
      );
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 520, boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: "18px 18px 0 0", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: 0 }}>Add User</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} /></button>
        </div>
        <div style={{ padding: 24 }}>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 9, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={S.label}>Full Name</label>
              <input style={S.input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Doe" />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={S.label}>Email</label>
              <input style={S.input} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@company.com" />
            </div>
            <div>
              <label style={S.label}>Role</label>
              <div style={{ position: "relative" }}>
                <select style={{ ...S.input, appearance: "none", paddingRight: 28 }} value={form.role} onChange={e => set("role", e.target.value)}>
                  <option value="EMPLOYEE">Person</option>
                  <option value="ADMIN">Operator</option>
                </select>
                <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
              </div>
            </div>
            <div>
              <label style={S.label}>Workspace</label>
              <div style={{ position: "relative" }}>
                <select style={{ ...S.input, appearance: "none", paddingRight: 28 }} value={form.companyId} onChange={e => handleWorkspaceChange(e.target.value)}>
                  <option value="">Select company…</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={S.btn("#f1f5f9", "#64748b")}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ ...S.btn("#8B5CF6"), opacity: saving ? 0.6 : 1 }}>
              {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Plus size={14} />}
              {saving ? "Creating…" : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserRoleOperations() {
  const [users,      setUsers]      = useState([]);
  const [companies,  setWorkspaces]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAdd,    setShowAdd]    = useState(false);
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [uRes, cRes] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/global-admin/companies"),
      ]);
      setUsers(uRes.data?.data || (Array.isArray(uRes.data) ? uRes.data : []));
      setWorkspaces(cRes.data?.data || []);
    } catch {
      setError("Failed to load users. Check backend connection.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast("User deleted", "success");
    } catch { showToast("Failed to delete user", "error"); }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const firstName = u.firstName || "";
    const lastName  = u.lastName  || "";
    const name = u.name || u.fullName || `${firstName} ${lastName}`.trim();
    const matchSearch = !q ||
      name.toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q) ||
      (u.tenantCode || "").toLowerCase().includes(q);
    const role = (u.role || "").toUpperCase();
    const matchRole = roleFilter === "all" || role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total:     users.length,
    active:    users.filter(u => (u.status || "ACTIVE").toUpperCase() === "ACTIVE").length,
    admins:    users.filter(u => (u.role || "").toUpperCase().includes("ADMIN")).length,
    companies: companies.length,
  };

  const ROLES = [...new Set(users.map(u => (u.role || "").toUpperCase()).filter(Boolean))];

  return (
    <div style={S.page}>
      {showAdd && <AddUserModal companies={companies} onClose={() => setShowAdd(false)} onSaved={fetchData} />}

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 18px", borderRadius: 12, background: toast.type === "success" ? "#22c55e" : "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 18, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 130, height: 130, borderRadius: "50%", background: "rgba(124,58,237,0.1)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>CrewSync · Global Operator</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Access Matrix</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>
              {loading ? "Loading…" : `${stats.total} users across ${stats.companies} companies`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchData} disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: loading ? 0.6 : 1 }}>
              {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={14} />} Refresh
            </button>
            <button onClick={() => setShowAdd(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "#8B5CF6", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 14px rgba(139,92,246,0.35)" }}>
              <Plus size={15} /> Add User
            </button>
          </div>
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
          { label: "Total Users",  value: stats.total,     icon: Users,       accent: "#8B5CF6", bg: "#fff4ef" },
          { label: "Active",       value: stats.active,    icon: CheckCircle, accent: "#22c55e", bg: "#f0fdf4" },
          { label: "Operators",       value: stats.admins,    icon: ShieldCheck, accent: "#A855F7", bg: "#f5f3ff" },
          { label: "Workspaces",    value: stats.companies, icon: Building2,   accent: "#0ea5e9", bg: "#f0f9ff" },
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

      {/* Search + Role Filter */}
      <div style={{ ...S.card, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, role, or tenant…"
            style={{ ...S.input, paddingLeft: 30 }} />
        </div>
        <div style={{ position: "relative" }}>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            style={{ ...S.input, width: "auto", minWidth: 150, appearance: "none", paddingRight: 28 }}>
            <option value="all">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading users…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            {users.length === 0 ? "No users found." : "No users match your filter."}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["User", "Email", "Role", "Workspace / Tenant", "Status", "Actions"].map(h => <Th key={h} ch={h} />)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const role   = (u.role || "EMPLOYEE").toUpperCase();
                const status = (u.status || "ACTIVE").toUpperCase();
                const rs = ROLE_STYLE[role]    || { bg: "#f1f5f9", color: "#64748b" };
                const ss = STATUS_STYLE[status] || { bg: "#f1f5f9", color: "#64748b" };
                const firstName = u.firstName || "";
                const lastName  = u.lastName  || "";
                const name = u.name || u.fullName || `${firstName} ${lastName}`.trim() || "—";

                return (
                  <tr key={u.id || i} style={{ borderBottom: "1px solid #f1f5f9" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #8B5CF6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                          {(name !== "—" ? name : u.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: "#1e293b", margin: 0 }}>{name}</p>
                          {u.department && <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{u.department}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>{u.email || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: rs.bg, color: rs.color }}>
                        {role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>
                      {u.companyName || u.tenantCode || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: ss.bg, color: ss.color }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => handleDelete(u.id)}
                        style={{ width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Delete user">
                        <Trash2 size={13} />
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
