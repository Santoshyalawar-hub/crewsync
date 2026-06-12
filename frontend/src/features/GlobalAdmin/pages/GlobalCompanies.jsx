import React, { useState, useEffect, useRef } from "react";
import {
  Building2, CheckCircle, XCircle, Users, Plus, Search,
  Download, Eye, Edit2, Trash2, Loader2, X, ChevronLeft,
  ChevronRight, UserPlus, CreditCard, Calendar, AlertCircle,
  FileText, Upload, Image, Trash, Mail,
} from "lucide-react";
import api from "@/lib/apiClient";

/* ─── Shared styles ──────────────────────────────────────────────────────── */
const S = {
  page:  { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 32 },
  card:  { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  label: { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fff" },
  btn:   (bg, color = "#fff") => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, background: bg, color, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "opacity 0.15s" }),
};

/* ─── Logo Upload — calls Cloudinary via backend ─────────────────────────── */
function LogoUpload({ companyId, currentLogoUrl, onLogoUpdated }) {
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(currentLogoUrl || null);
  const [error,     setError]     = useState("");
  const inputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, and SVG allowed"); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be under 2MB"); return;
    }

    setError("");
    setUploading(true);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary via backend API
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res  = await api.post(`/api/global-admin/companies/${companyId}/upload-logo`, formData);
      const json = res.data;
      if (json.success) {
        setPreview(json.logoUrl);
        onLogoUpdated && onLogoUpdated(json.logoUrl);
      } else {
        setError(json.message || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove company logo?")) return;
    setUploading(true);
    try {
      const res  = await api.delete(`/api/global-admin/companies/${companyId}/logo`);
      const json = res.data;
      if (json.success) {
        setPreview(null);
        onLogoUpdated && onLogoUpdated(null);
      } else {
        setError(json.message || "Delete failed");
      }
    } catch (err) {
      setError("Delete failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label style={S.label}>Workspace Logo — Cloudinary CDN</label>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

        {/* Preview */}
        <div style={{ width: 80, height: 80, borderRadius: 12, border: "2px dashed #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {preview
            ? <img src={preview} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            : <Image size={24} color="#cbd5e1" />
          }
        </div>

        {/* Buttons + info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
              style={{ ...S.btn("#6366f1"), fontSize: 12, padding: "7px 14px", opacity: uploading ? 0.6 : 1 }}>
              {uploading
                ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                : <Upload size={13} />}
              {preview ? "Change Logo" : "Upload Logo"}
            </button>
            {preview && (
              <button type="button" onClick={handleDelete} disabled={uploading}
                style={{ ...S.btn("#fef2f2", "#ef4444"), border: "1px solid #fecaca", fontSize: 12, padding: "7px 14px" }}>
                <Trash size={13} /> Remove
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 2px" }}>
            PNG, JPG, or SVG · Max 2MB · Stored on Cloudinary CDN
          </p>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
            This logo appears on all salary slip PDFs for this company.
          </p>
          {error && (
            <p style={{ fontSize: 11, color: "#ef4444", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={11} /> {error}
            </p>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

/* ─── Toggle ─────────────────────────────────────────────────────────────── */
function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
      <div onClick={() => onChange(!checked)} style={{ width: 38, height: 21, borderRadius: 99, background: checked ? "#22c55e" : "#e2e8f0", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 3, left: checked ? 19 : 3, width: 15, height: 15, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#475569" }}>{label}</span>
    </label>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#6366f1";
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 12, background: bg, color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, accent, bg }) {
  return (
    <div style={{ ...S.card, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} color={accent} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "2px 0 0", letterSpacing: "-0.02em" }}>{value ?? "—"}</p>
      </div>
    </div>
  );
}

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({ label, children, span }) {
  return (
    <div style={span ? { gridColumn: "span 2" } : {}}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

/* ─── Toggle Group ───────────────────────────────────────────────────────── */
function ToggleGroup({ title, color, items, values, onChange }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: `1px solid ${color}22` }}>
      <p style={{ fontSize: 12, fontWeight: 700, color, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
        {items.map(({ key, label }) => (
          <Toggle key={key} label={label} checked={!!values[key]} onChange={v => onChange(key, v)} />
        ))}
      </div>
    </div>
  );
}

/* ─── Modal Shell ────────────────────────────────────────────────────────── */
function ModalShell({ title, sub, onClose, children, accentBg = "linear-gradient(135deg, #0f172a, #1e293b)" }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ background: accentBg, borderRadius: "18px 18px 0 0", padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h2>
            {sub && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "4px 0 0" }}>{sub}</p>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function WorkspacesPage() {
  const [companies,    setWorkspaces]    = useState([]);
  const [stats,        setStats]        = useState({ totalWorkspaces: 0, activeWorkspaces: 0, suspendedWorkspaces: 0, totalPersons: 0 });
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading,      setLoading]      = useState(false);
  const [toast,        setToast]        = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [selected,     setSelected]     = useState(null);
  const [modal,        setModal]        = useState(null);

  const showToast  = (message, type) => setToast({ message, type });
  const closeModal = () => { setModal(null); setSelected(null); };

  /* ── Fetch ─────────────────────────────────────────────────────────────── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        api.get("/api/global-admin/companies"),
        api.get("/api/global-admin/companies/statistics"),
      ]);
      const cData = cRes.data;
      const sData = sRes.data;
      if (cData.success) setWorkspaces(cData.data);
      if (sData.success) setStats(sData.data);
    } catch { showToast("Failed to load data", "error"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      (c.displayName || "").toLowerCase().includes(q) ||
      (c.adminEmail  || "").toLowerCase().includes(q) ||
      (c.admin       || "").toLowerCase().includes(q) ||
      (c.tenantCode  || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  /* ── CRUD ──────────────────────────────────────────────────────────────── */
  const handleCreate = async ({ company: companyData, slipConfiguration }) => {
    setLoading(true);
    try {
      // 1. Create company
      const r = await api.post("/api/global-admin/companies", companyData);
      const j = r.data;
      if (!j.success) { showToast(j.message || "Failed to create company", "error"); return; }

      // 2. Save salary slip settings
      await api.post("/api/salary-slip-settings", { ...slipConfiguration, tenantCode: j.data.tenantCode });

      showToast("Workspace created! Open Edit to upload the Cloudinary logo.", "success");
      setShowCreate(false);
      fetchAll();
    } catch { showToast("Error creating company", "error"); }
    finally  { setLoading(false); }
  };

  const handleUpdate = async (id, data) => {
    setLoading(true);
    try {
      const r = await api.put(`/api/global-admin/companies/${id}`, data);
      const j = r.data;
      if (j.success) { showToast("Updated!", "success"); closeModal(); fetchAll(); }
      else showToast(j.message || "Failed", "error");
    } catch { showToast("Error updating", "error"); }
    finally  { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company? This cannot be undone.")) return;
    setLoading(true);
    try {
      const r = await api.delete(`/api/global-admin/companies/${id}`);
      const j = r.data;
      if (j.success) { showToast("Deleted!", "success"); fetchAll(); }
      else showToast(j.message || "Failed", "error");
    } catch { showToast("Error deleting", "error"); }
    finally  { setLoading(false); }
  };

  const toggleStatus = async (id) => {
    setLoading(true);
    try {
      const r = await api.patch(`/api/global-admin/companies/${id}/toggle-status`);
      const j = r.data;
      if (j.success) { showToast("Status updated!", "success"); fetchAll(); }
      else showToast(j.message || "Failed", "error");
    } catch { showToast("Error", "error"); }
    finally  { setLoading(false); }
  };

  const handleSendCredentials = async (company) => {
    if (!window.confirm(`Send login credentials to ${company.adminEmail || company.officialEmail || "the admin"}?`)) return;
    setLoading(true);
    try {
      const r = await api.post(`/api/global-admin/companies/${company.id}/send-credentials`);
      const j = r.data;
      if (j.success) showToast(j.message || "Credentials sent!", "success");
      else showToast(j.message || "Failed to send credentials", "error");
    } catch { showToast("Error sending credentials", "error"); }
    finally { setLoading(false); }
  };

  const handleLogoUpdated = (companyId, url) => {
    // Update the company in local state so table logo updates immediately
    setWorkspaces(prev =>
      prev.map(c => c.id === companyId ? { ...c, logoUrl: url } : c)
    );
    if (selected && selected.id === companyId) {
      setSelected(prev => ({ ...prev, logoUrl: url }));
    }
  };

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div style={S.page}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)", borderRadius: 18, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 140, height: 140, borderRadius: "50%", background: "rgba(139,92,246,0.1)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>CrewSync · Global Operator</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Workspace Control</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>
              {companies.length} companies · {stats.totalPersons} total employees
            </p>
          </div>
          <button onClick={() => setShowCreate(true)}
            style={{ ...S.btn("#8B5CF6"), padding: "10px 20px", fontSize: 13, borderRadius: 11, boxShadow: "0 4px 14px rgba(139,92,246,0.35)" }}>
            <Plus size={16} /> Add Workspace
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Total"     value={stats.totalWorkspaces}     icon={Building2}   accent="#8B5CF6" bg="#fff4ef" />
        <StatCard label="Active"    value={stats.activeWorkspaces}    icon={CheckCircle} accent="#22c55e" bg="#f0fdf4" />
        <StatCard label="Suspended" value={stats.suspendedWorkspaces} icon={XCircle}     accent="#ef4444" bg="#fef2f2" />
        <StatCard label="Persons" value={stats.totalPersons}     icon={Users}       accent="#8b5cf6" bg="#f5f3ff" />
      </div>

      {/* Filters */}
      <div style={{ ...S.card, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, admin, email or tenant code…"
            style={{ ...S.input, paddingLeft: 32 }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ ...S.input, width: "auto" }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No companies found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  {["Workspace", "Operator", "Persons", "Plan", "Status", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const pct = c.employeeLimit ? Math.min((c.employees / c.employeeLimit) * 100, 100) : 0;
                  const planColors = {
                    Enterprise:   { bg: "#f5f3ff", color: "#A855F7" },
                    Professional: { bg: "#fff4ef", color: "#ea6b35" },
                    Basic:        { bg: "#f0fdf4", color: "#16a34a" },
                  };
                  const pc = planColors[c.plan] || planColors.Basic;
                  const isActive = (c.status || "").toLowerCase() === "active";

                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                      {/* Workspace — shows Cloudinary logo if available */}
                      <td style={{ padding: "13px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {c.logoUrl ? (
                            <img src={c.logoUrl} alt={c.displayName}
                              style={{ width: 36, height: 36, borderRadius: 10, objectFit: "contain", border: "1px solid #e2e8f0", background: "#fff", flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #8B5CF6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                              {(c.displayName || "?").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p style={{ fontWeight: 700, color: "#1e293b", margin: 0 }}>{c.displayName || "—"}</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0", fontFamily: "monospace" }}>{c.tenantCode}</p>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "13px 18px" }}>
                        <p style={{ fontWeight: 600, color: "#334155", margin: 0 }}>{c.admin || "—"}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{c.adminEmail || ""}</p>
                      </td>

                      <td style={{ padding: "13px 18px" }}>
                        <p style={{ fontWeight: 600, color: "#334155", margin: "0 0 4px" }}>{c.employees ?? 0} / {c.employeeLimit ?? "∞"}</p>
                        <div style={{ width: 80, height: 4, borderRadius: 4, background: "#e2e8f0" }}>
                          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: pct > 80 ? "#ef4444" : "#8B5CF6" }} />
                        </div>
                      </td>

                      <td style={{ padding: "13px 18px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: pc.bg, color: pc.color }}>
                          {c.plan || "—"}
                        </span>
                      </td>

                      <td style={{ padding: "13px 18px" }}>
                        <button onClick={() => toggleStatus(c.id)} disabled={loading}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: isActive ? "#dcfce7" : "#fee2e2", color: isActive ? "#16a34a" : "#dc2626" }}>
                          {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {isActive ? "Active" : "Suspended"}
                        </button>
                      </td>

                      <td style={{ padding: "13px 18px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[
                            { icon: Eye,    color: "#6366f1", bg: "#eef2ff", action: () => { setSelected(c); setModal("view"); },   title: "View" },
                            { icon: Edit2,  color: "#0ea5e9", bg: "#f0f9ff", action: () => { setSelected(c); setModal("edit"); },   title: "Edit" },
                            { icon: Mail,   color: "#22c55e", bg: "#f0fdf4", action: () => handleSendCredentials(c),               title: "Send Credentials" },
                            { icon: Trash2, color: "#ef4444", bg: "#fef2f2", action: () => handleDelete(c.id),                     title: "Delete" },
                          ].map(({ icon: Icon, color, bg, action, title }, idx) => (
                            <button key={idx} onClick={action} disabled={loading} title={title}
                              style={{ width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon size={14} />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate       && <CreateModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} loading={loading} />}
      {modal === "view" && selected && <ViewModal  company={selected} onClose={closeModal} onLogoUpdated={(url) => handleLogoUpdated(selected.id, url)} />}
      {modal === "edit" && selected && <EditModal  company={selected} onClose={closeModal} loading={loading} onSubmit={d => handleUpdate(selected.id, d)} onLogoUpdated={(url) => handleLogoUpdated(selected.id, url)} />}
    </div>
  );
}

/* ─── Create Modal ───────────────────────────────────────────────────────── */
function CreateModal({ onClose, onSubmit, loading }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    legalName: "", displayName: "", tenantCode: "", organizationType: "", industry: "",
    admin: "", adminEmail: "", mobileNumber: "", role: "COMPANY_ADMIN",
    address: "", city: "", state: "", country: "", pincode: "", officialEmail: "", phoneNumber: "", website: "",
    plan: "Basic", employees: 0, employeeLimit: 50, storageLimit: "10 GB", billingCycle: "monthly",
    startDate: new Date().toISOString().split("T")[0],
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const [slip, setSlip] = useState({
    slipTitle: "SALARY SLIP",
    footerNote: "This is a computer-generated salary slip and does not require a signature.",
    companyLogoBase64: null, logoMediaType: null,
    showPersonId: true,    showDepartment: true,    showDesignation: true,
    showDateOfJoining: true, showPanNumber: false,    showUanNumber: true,
    showPfNumber: true,      showEsiNumber: false,    showBankName: true,
    showAccountNumber: true, showLoanNumber: false,
    showBasicCompensation: true,   showHra: true,           showSpecialAllowance: true,
    showTransportAllowance: false, showMedicalAllowance: false, showOtherAllowances: false,
    showPfDeduction: true,   showEsiDeduction: false, showProfessionalTax: true,
    showTds: false,          showLoanDeduction: false, showOtherDeductions: false,
  });
  const setS = (k, v) => setSlip(p => ({ ...p, [k]: v }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setS("companyLogoBase64", reader.result.split(",")[1]);
      setS("logoMediaType", file.type);
    };
    reader.readAsDataURL(file);
  };

  const steps = [
    { n: 1, label: "Workspace Info"  },
    { n: 2, label: "Operator"         },
    { n: 3, label: "Contact"       },
    { n: 4, label: "Subscription"  },
    { n: 5, label: "Slip Configuration" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 5) { setStep(s => s + 1); return; }
    onSubmit({ company: form, slipConfiguration: slip });
  };

  return (
    <ModalShell title="Create Workspace" sub={`Step ${step} of 5 — ${steps[step - 1].label}`} onClose={onClose}>
      {/* Stepper */}
      <div style={{ background: "#f8fafc", padding: "16px 28px", display: "flex", alignItems: "center", borderBottom: "1px solid #eef0f4" }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, background: step > s.n ? "#22c55e" : step === s.n ? "#8B5CF6" : "#e2e8f0", color: step >= s.n ? "#fff" : "#94a3b8", transition: "all 0.2s" }}>
                {step > s.n ? <CheckCircle size={16} /> : s.n}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, marginTop: 4, whiteSpace: "nowrap", color: step === s.n ? "#8B5CF6" : "#94a3b8" }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ height: 2, flex: 1, background: step > s.n ? "#22c55e" : "#e2e8f0", borderRadius: 2, margin: "0 4px", marginBottom: 16 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Step 1 */}
          {step === 1 && <>
            <Field label="Legal Name *"><input required style={S.input} value={form.legalName} onChange={e => set("legalName", e.target.value)} placeholder="Acme Pvt Ltd" /></Field>
            <Field label="Display Name *"><input required style={S.input} value={form.displayName} onChange={e => set("displayName", e.target.value)} placeholder="Acme" /></Field>
            <Field label="Tenant Code *">
              <input required style={S.input} value={form.tenantCode}
                onChange={e => set("tenantCode", e.target.value.toUpperCase().replace(/\s/g, ""))}
                placeholder="ACME001" />
            </Field>
            <Field label="Network Type *">
              <select required style={S.input} value={form.organizationType} onChange={e => set("organizationType", e.target.value)}>
                <option value="">Select type</option>
                {["Private Limited","Public Limited","Partnership","Sole Proprietorship","LLP"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Industry *" span>
              <select required style={S.input} value={form.industry} onChange={e => set("industry", e.target.value)}>
                <option value="">Select industry</option>
                {["Technology","Healthcare","MoneyOps","Manufacturing","Retail","Education","Other"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
          </>}

          {/* Step 2 */}
          {step === 2 && <>
            <Field label="Operator Full Name *"><input required style={S.input} value={form.admin} onChange={e => set("admin", e.target.value)} placeholder="John Doe" /></Field>
            <Field label="Operator Email *"><input required type="email" style={S.input} value={form.adminEmail} onChange={e => set("adminEmail", e.target.value)} placeholder="admin@company.com" /></Field>
            <Field label="Pocket Number *"><input required style={S.input} value={form.mobileNumber} onChange={e => set("mobileNumber", e.target.value)} placeholder="+91 9876543210" /></Field>
            <Field label="Role"><input disabled style={{ ...S.input, background: "#f8fafc", color: "#94a3b8" }} value={form.role} /></Field>
          </>}

          {/* Step 3 */}
          {step === 3 && <>
            <Field label="Address *" span><textarea required style={{ ...S.input, resize: "none" }} rows={2} value={form.address} onChange={e => set("address", e.target.value)} placeholder="Full address" /></Field>
            <Field label="Official Email *"><input required type="email" style={S.input} value={form.officialEmail} onChange={e => set("officialEmail", e.target.value)} placeholder="info@company.com" /></Field>
            <Field label="Phone Number *"><input required style={S.input} value={form.phoneNumber} onChange={e => set("phoneNumber", e.target.value)} placeholder="+91 22 12345678" /></Field>
            <Field label="City *"><input required style={S.input} value={form.city} onChange={e => set("city", e.target.value)} placeholder="Mumbai" /></Field>
            <Field label="State *"><input required style={S.input} value={form.state} onChange={e => set("state", e.target.value)} placeholder="Maharashtra" /></Field>
            <Field label="Country *"><input required style={S.input} value={form.country} onChange={e => set("country", e.target.value)} placeholder="India" /></Field>
            <Field label="Pincode *"><input required style={S.input} value={form.pincode} onChange={e => set("pincode", e.target.value)} placeholder="400001" /></Field>
            <Field label="Website"><input style={S.input} value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://company.com" /></Field>
          </>}

          {/* Step 4 */}
          {step === 4 && <>
            <Field label="Plan *">
              <select required style={S.input} value={form.plan} onChange={e => {
                const limits = { Basic: { employeeLimit: 50, storageLimit: "10 GB" }, Professional: { employeeLimit: 100, storageLimit: "20 GB" }, Enterprise: { employeeLimit: 500, storageLimit: "50 GB" } };
                setForm(p => ({ ...p, plan: e.target.value, ...(limits[e.target.value] || {}) }));
              }}>
                <option value="Basic">Basic</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </Field>
            <Field label="Person Limit *"><input required type="number" min={1} style={S.input} value={form.employeeLimit} onChange={e => set("employeeLimit", parseInt(e.target.value))} /></Field>
            <Field label="Current Persons"><input type="number" min={0} style={S.input} value={form.employees} onChange={e => set("employees", Number(e.target.value))} /></Field>
            <Field label="Billing Cycle *">
              <select required style={S.input} value={form.billingCycle} onChange={e => set("billingCycle", e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </Field>
            <Field label="Start Date *"><input required type="date" style={S.input} value={form.startDate} onChange={e => set("startDate", e.target.value)} /></Field>
          </>}

          {/* Step 5 — Slip Configuration */}
          {step === 5 && (
            <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Note about Cloudinary logo */}
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10 }}>
                <FileText size={16} color="#3b82f6" style={{ marginTop: 1, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>PayStatement Setup</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#3b82f6" }}>
                    Upload a base64 logo below for salary slips. After creating the company,
                    open <strong>Edit</strong> to upload the full Cloudinary logo — it renders
                    faster on PDFs and is stored on CDN.
                  </p>
                </div>
              </div>

              {/* Branding */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={S.label}>Logo for Compensation Slips (base64)</label>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 9, border: "1.5px dashed #e2e8f0", cursor: "pointer", background: "#f8fafc" }}>
                    {slip.companyLogoBase64
                      ? <img src={`data:${slip.logoMediaType};base64,${slip.companyLogoBase64}`} alt="logo" style={{ height: 36, objectFit: "contain", borderRadius: 6 }} />
                      : <><Upload size={15} color="#94a3b8" /><span style={{ fontSize: 12, color: "#94a3b8" }}>Click to upload (PNG/JPG)</span></>
                    }
                    <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoUpload} style={{ display: "none" }} />
                  </label>
                </div>
                <div>
                  <label style={S.label}>Slip Title</label>
                  <input style={S.input} value={slip.slipTitle} onChange={e => setS("slipTitle", e.target.value)} placeholder="SALARY SLIP" />
                  <label style={{ ...S.label, marginTop: 12 }}>Footer Note</label>
                  <input style={S.input} value={slip.footerNote} onChange={e => setS("footerNote", e.target.value)} />
                </div>
              </div>

              <ToggleGroup title="Person Information Fields" color="#6366f1" values={slip} onChange={setS}
                items={[
                  { key: "showPersonId",    label: "Person ID"     },
                  { key: "showDepartment",    label: "Department"      },
                  { key: "showDesignation",   label: "Designation"     },
                  { key: "showDateOfJoining", label: "Date of Joining" },
                  { key: "showPanNumber",     label: "PAN Number"      },
                  { key: "showUanNumber",     label: "UAN Number"      },
                  { key: "showPfNumber",      label: "PF Number"       },
                  { key: "showEsiNumber",     label: "ESI Number"      },
                  { key: "showBankName",      label: "Bank Name"       },
                  { key: "showAccountNumber", label: "Account Number"  },
                  { key: "showLoanNumber",    label: "Loan Number"     },
                ]}
              />
              <ToggleGroup title="Earnings Components" color="#22c55e" values={slip} onChange={setS}
                items={[
                  { key: "showBasicCompensation",        label: "Basic Compensation"        },
                  { key: "showHra",                label: "HRA"                 },
                  { key: "showSpecialAllowance",   label: "Special Allowance"   },
                  { key: "showTransportAllowance", label: "Transport Allowance" },
                  { key: "showMedicalAllowance",   label: "Medical Allowance"   },
                  { key: "showOtherAllowances",    label: "Other Allowances"    },
                ]}
              />
              <ToggleGroup title="Deduction Components" color="#ef4444" values={slip} onChange={setS}
                items={[
                  { key: "showPfDeduction",     label: "PF Deduction"     },
                  { key: "showEsiDeduction",    label: "ESI Deduction"    },
                  { key: "showProfessionalTax", label: "Professional Tax" },
                  { key: "showTds",             label: "TDS"              },
                  { key: "showLoanDeduction",   label: "Loan Deduction"   },
                  { key: "showOtherDeductions", label: "Other Deductions" },
                ]}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
          <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1}
            style={{ ...S.btn("#f1f5f9", "#475569"), opacity: step === 1 ? 0.3 : 1 }}>
            <ChevronLeft size={15} /> Back
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} style={S.btn("#f1f5f9", "#475569")}>Cancel</button>
            {step < 5
              ? <button type="submit" style={{ ...S.btn("#8B5CF6"), boxShadow: "0 4px 12px rgba(139,92,246,0.3)" }}>
                  Next <ChevronRight size={15} />
                </button>
              : <button type="submit" disabled={loading} style={{ ...S.btn("#22c55e"), boxShadow: "0 4px 12px rgba(34,197,94,0.3)", opacity: loading ? 0.7 : 1 }}>
                  {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                  <CheckCircle size={15} /> Create Workspace
                </button>
            }
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

/* ─── View Modal ─────────────────────────────────────────────────────────── */
function ViewModal({ company: c, onClose, onLogoUpdated }) {
  const sections = [
    { title: "Basic Info",   icon: Building2,  color: "#8B5CF6", rows: [["Legal Name", c.legalName], ["Tenant Code", c.tenantCode], ["Industry", c.industry], ["Org Type", c.organizationType]] },
    { title: "Operator",        icon: UserPlus,   color: "#6366f1", rows: [["Name", c.admin], ["Email", c.adminEmail], ["Pocket", c.mobileNumber]] },
    { title: "Subscription", icon: CreditCard, color: "#0ea5e9", rows: [["Plan", c.plan], ["Billing", c.billingCycle], ["Start Date", c.startDate]] },
    { title: "Contact",      icon: Building2,  color: "#10b981", rows: [["Phone", c.phoneNumber], ["Website", c.website || "N/A"], ["City/State", [c.city, c.state].filter(Boolean).join(", ")], ["Country", c.country]] },
  ];

  return (
    <ModalShell title={c.displayName || "Workspace"} sub={`Tenant: ${c.tenantCode}`} onClose={onClose}>
      <div style={{ padding: 28 }}>

        {/* ── Cloudinary Logo Upload ── */}
        <div style={{ marginBottom: 20, padding: "16px 18px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <LogoUpload companyId={c.id} currentLogoUrl={c.logoUrl} onLogoUpdated={onLogoUpdated} />
        </div>

        {/* Person usage bar */}
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <Users size={18} color="#8b5cf6" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Person Usage</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{c.employees} / {c.employeeLimit}</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "#e2e8f0" }}>
              <div style={{ height: "100%", borderRadius: 6, background: "#8b5cf6", width: `${Math.min((c.employees / c.employeeLimit) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Detail sections */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {sections.map(({ title, icon: Icon, color, rows }) => (
            <div key={title} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <Icon size={15} color={color} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{title}</span>
              </div>
              {rows.map(([k, v]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>{v || "—"}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose} style={{ ...S.btn("#0f172a"), padding: "9px 20px" }}>Close</button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ─── Edit Modal ─────────────────────────────────────────────────────────── */
function EditModal({ company, onClose, onSubmit, loading, onLogoUpdated }) {
  const [form, setForm] = useState({
    legalName:     company.legalName     || "",
    displayName:   company.displayName   || "",
    admin:         company.admin         || "",
    adminEmail:    company.adminEmail    || "",
    plan:          company.plan          || "Basic",
    employeeLimit: company.employeeLimit || 50,
    billingCycle:  company.billingCycle  || "monthly",
    status:        company.status        || "active",
    tenantCode:    company.tenantCode    || "",
    industry:      company.industry      || "",
    city:          company.city          || "",
    state:         company.state         || "",
    country:       company.country       || "",
    pincode:       company.pincode       || "",
    phoneNumber:   company.phoneNumber   || "",
    website:       company.website       || "",
    address:       company.address       || "",
    officialEmail: company.officialEmail || "",
  });

  const fields = [
    ["Legal Name",     "legalName",     "text"],
    ["Display Name",   "displayName",   "text"],
    ["Operator Name",     "admin",         "text"],
    ["Operator Email",    "adminEmail",    "email"],
    ["Official Email", "officialEmail", "email"],
    ["Tenant Code",    "tenantCode",    "text"],
    ["Industry",       "industry",      "text"],
    ["Address",        "address",       "text"],
    ["City",           "city",          "text"],
    ["State",          "state",         "text"],
    ["Country",        "country",       "text"],
    ["Pincode",        "pincode",       "text"],
    ["Phone",          "phoneNumber",   "text"],
    ["Website",        "website",       "text"],
  ];

  return (
    <ModalShell title="Edit Workspace" sub={`Tenant: ${company.tenantCode}`} onClose={onClose}
      accentBg="linear-gradient(135deg, #0ea5e9, #0284c7)">
      <div style={{ padding: "24px 28px" }}>

        {/* ── Cloudinary Logo Upload ── */}
        <div style={{ marginBottom: 24, padding: "16px 18px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <LogoUpload companyId={company.id} currentLogoUrl={company.logoUrl} onLogoUpdated={onLogoUpdated} />
        </div>

        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {fields.map(([label, key, type]) => (
              <Field key={key} label={label}>
                <input type={type} style={S.input} value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
              </Field>
            ))}
            <Field label="Plan">
              <select style={S.input} value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}>
                {["Basic","Professional","Enterprise"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Person Limit">
              <input type="number" style={S.input} value={form.employeeLimit}
                onChange={e => setForm(p => ({ ...p, employeeLimit: parseInt(e.target.value) }))} />
            </Field>
            <Field label="Billing Cycle">
              <select style={S.input} value={form.billingCycle} onChange={e => setForm(p => ({ ...p, billingCycle: e.target.value }))}>
                {["monthly","quarterly","yearly"].map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select style={S.input} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </Field>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
            <button type="button" onClick={onClose} disabled={loading} style={S.btn("#f1f5f9", "#475569")}>Cancel</button>
            <button type="submit" disabled={loading}
              style={{ ...S.btn("#0ea5e9"), boxShadow: "0 4px 12px rgba(14,165,233,0.3)", opacity: loading ? 0.7 : 1 }}>
              {loading && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}