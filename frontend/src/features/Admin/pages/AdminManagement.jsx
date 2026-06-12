import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/apiClient";

/* ─────────────── ICON ─────────────── */
const Ic = ({ d, size = 16, sw = 1.8, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

/* ─────────────── ROLE META ─────────────── */
const ROLE_COLORS = {
  SUPER_ADMIN: { label: "Owner", color: "#8B5CF6", bg: "rgba(139,92,246,.12)" },
  ADMIN:       { label: "Operator",       color: "#818cf8", bg: "rgba(129,140,248,.12)" },
  MANAGER:     { label: "Manager",     color: "#06B6D4", bg: "rgba(6,182,212,.12)" },
};
const roleMeta = (r = "") => {
  const key = r.toString().toUpperCase().replace(/\s+/g, "_");
  return ROLE_COLORS[key] || { label: r || "Operator", color: "#6b7280", bg: "#f3f4f6" };
};
const initials = (name = "") =>
  name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "A";

/* ─────────────── MAIN COMPONENT ─────────────── */
const OperatorOperations = ({ onBack }) => {
  const navigate = useNavigate();

  const [showModal,    setShowModal]    = useState(false);
  const [admins,       setOperators]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [loadError,    setLoadError]    = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState("");
  const [search,       setSearch]       = useState("");
  const [formData,     setFormData]     = useState({ name: "", email: "", role: "", password: "" });
  const [errors,       setErrors]       = useState({});

  const handleBack = () => {
    if (typeof onBack === "function") return onBack();
    navigate("/admin/dashboard");
  };

  /* ── FETCH ADMINS — original logic ── */
  const fetchOperators = async () => {
    setLoading(true); setLoadError("");
    try {
      const res = await api.get("/api/users/tenant/admins");
      const data = res.data;
      setOperators(
        (Array.isArray(data) && data) ||
        (Array.isArray(data.data) && data.data) ||
        (Array.isArray(data.content) && data.content) || []
      );
    } catch (err) {
      setLoadError(err.message || "Failed to load admins");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOperators(); }, []);

  /* ── FORM — original logic ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => { const c = { ...p }; delete c[name]; return c; });
    if (submitError) setSubmitError("");
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name  = "Operator name is required.";
    if (!formData.email.trim()) e.email = "Email is required.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim()))
      e.email = "Enter a valid email.";
    if (!formData.role)         e.role     = "Role is required.";
    if (!formData.password.trim()) e.password = "Password is required.";
    else if (formData.password.length < 6) e.password = "Min 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true); setSubmitError("");
    try {
      await api.post("/api/users/tenant/admins", { name: formData.name, email: formData.email, role: formData.role, password: formData.password });
      await fetchOperators();
      setFormData({ name: "", email: "", role: "", password: "" });
      setErrors({});
      setShowModal(false);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally { setSubmitting(false); }
  };

  const filtered = admins.filter(a => {
    const q = search.toLowerCase();
    return !q ||
      (a.name || a.fullName || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q);
  });

  /* ── FIELD HELPER ── */
  const Field = ({ label, error, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#6b7280" }}>
        {label} <span style={{ color: "#8B5CF6" }}>*</span>
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>{error}</span>}
    </div>
  );

  const inputSt = (err) => ({
    width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500,
    border: `1.5px solid ${err ? "#fca5a5" : "#e5e7eb"}`, background: "#fff", color: "#0B1020",
    outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", transition: "border-color .2s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .am-root { font-family: 'DM Sans', sans-serif; }
        .am-sora { font-family: 'Sora', sans-serif; }
        .am-input:focus  { border-color: #8B5CF6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,.1); }
        .am-select:focus { border-color: #8B5CF6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,.1); }
        .am-row:hover { background: #fafafa; }
        .am-back:hover  { border-color: #8B5CF6 !important; color: #8B5CF6 !important; }
        .am-refresh:hover { border-color: #8B5CF6 !important; color: #8B5CF6 !important; }
        .am-overlay {
          position: fixed; inset: 0; background: rgba(13,31,45,.55);
          backdrop-filter: blur(6px); display: flex; align-items: center;
          justify-content: center; z-index: 300; padding: 20px;
        }
      `}</style>

      <div className="am-root" style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Page Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={handleBack} className="am-back"
              style={{ width: 38, height: 38, borderRadius: 10, background: "#fff", border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280", transition: "all .2s" }}>
              <Ic d="M15 19l-7-7 7-7" size={15} sw={2.5} />
            </button>
            <div>
              <h1 className="am-sora" style={{ fontSize: 21, fontWeight: 900, color: "#0B1020", margin: 0, lineHeight: 1.2 }}>Operator Operations</h1>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "3px 0 0", fontWeight: 500 }}>Manage admin users, roles & access control</p>
            </div>
          </div>
          <button onClick={() => { setShowModal(true); setSubmitError(""); setErrors({}); }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#8B5CF6,#06B6D4)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(139,92,246,.35)", transition: "all .2s", fontFamily: "'Sora',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(139,92,246,.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(139,92,246,.35)"; }}>
            <Ic d="M12 4v16m8-8H4" size={15} sw={2.5} />
            Add Operator
          </button>
        </div>

        {/* ── Stat chips ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
          {[
            { label: "Total Operators",  val: admins.length, color: "#8B5CF6" },
            { label: "Owners",  val: admins.filter(a => (a.adminRole||a.role||"").toUpperCase().includes("SUPER")).length, color: "#818cf8" },
            { label: "Managers",      val: admins.filter(a => (a.adminRole||a.role||"").toUpperCase().includes("MANAGER")).length, color: "#06B6D4" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "16px 22px", boxShadow: "0 2px 10px rgba(13,31,45,.04)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="am-sora" style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{loading ? "—" : s.val}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Table card ── */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0", boxShadow: "0 2px 18px rgba(13,31,45,.06)", overflow: "hidden" }}>

          {/* toolbar */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F6F8FB", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "8px 14px", flex: 1, maxWidth: 340 }}>
              <Ic d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" size={14} sw={2} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#0B1020", fontFamily: "'DM Sans',sans-serif", width: "100%" }} />
            </div>
            <button onClick={fetchOperators} className="am-refresh"
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#F6F8FB", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "#6b7280", cursor: "pointer", transition: "all .2s" }}>
              <Ic d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size={13} />
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>

          {/* error */}
          {loadError && (
            <div style={{ margin: "14px 24px", padding: "10px 16px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
              ⚠️ {loadError}
            </div>
          )}

          {/* table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F6F8FB" }}>
                  {["Operator", "Email", "Role", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#9ca3af", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: "56px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>Loading admins…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "64px 24px", textAlign: "center" }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0B1020", marginBottom: 4 }}>
                        {search ? "No results found" : "No admins yet"}
                      </div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>
                        {search ? "Try a different search term" : `Click "Add Operator" to get started`}
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((admin, i) => {
                  const name = admin.name || admin.fullName || "—";
                  const role = admin.adminRole || admin.role || admin.position || "Operator";
                  const meta = roleMeta(role);
                  return (
                    <tr key={admin.id || admin.adminId || admin.email || i} className="am-row"
                      style={{ borderTop: "1px solid #f5f5f5", transition: "background .15s" }}>
                      <td style={{ padding: "14px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: meta.bg, border: `1.5px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: meta.color, fontFamily: "'Sora',sans-serif", flexShrink: 0 }}>
                            {initials(name)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1020" }}>{name}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>ID: {admin.id || admin.adminId || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: 13, color: "#6b7280" }}>{admin.email || "—"}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em", color: meta.color, background: meta.bg, padding: "4px 10px", borderRadius: 999 }}>{meta.label}</span>
                      </td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "3px 9px", borderRadius: 999 }}>Active</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div style={{ padding: "12px 24px", borderTop: "1px solid #f5f5f5", fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>
              Showing {filtered.length} of {admins.length} admins
            </div>
          )}
        </div>
      </div>

      {/* ──────────── MODAL ──────────── */}
      {showModal && (
        <div className="am-overlay" onClick={e => e.target === e.currentTarget && !submitting && setShowModal(false)}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, boxShadow: "0 28px 64px rgba(13,31,45,.28)", overflow: "hidden" }}>

            {/* modal header */}
            <div style={{ background: "linear-gradient(135deg,#0B1020,#182033)", padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 className="am-sora" style={{ fontSize: 17, fontWeight: 900, color: "#fff", margin: 0 }}>Add New Operator</h2>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,.4)", margin: "3px 0 0" }}>Fill all fields to create admin access</p>
              </div>
              <button onClick={() => !submitting && setShowModal(false)}
                style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,.6)", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,.3)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "rgba(255,255,255,.6)"; }}>
                <Ic d="M6 18L18 6M6 6l12 12" size={14} sw={2.5} />
              </button>
            </div>

            {/* modal body */}
            <form onSubmit={handleSubmit} style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: 16 }}>

              <Field label="Operator Name" error={errors.name}>
                <input name="name" type="text" placeholder="Enter admin name"
                  value={formData.name} onChange={handleChange} className="am-input"
                  style={inputSt(errors.name)} />
              </Field>

              <Field label="Email" error={errors.email}>
                <input name="email" type="email" placeholder="Enter email address"
                  value={formData.email} onChange={handleChange} className="am-input"
                  style={inputSt(errors.email)} />
              </Field>

              <Field label="Operator Role" error={errors.role}>
                <select name="role" value={formData.role} onChange={handleChange} className="am-select"
                  style={{ ...inputSt(errors.role), appearance: "none", cursor: "pointer" }}>
                  <option value="">Select role…</option>
                  <option value="SUPER_ADMIN">Owner</option>
                  <option value="ADMIN">Operator</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </Field>

              <Field label="Password" error={errors.password}>
                <input name="password" type="password" placeholder="Min 6 characters"
                  value={formData.password} onChange={handleChange} className="am-input"
                  style={inputSt(errors.password)} />
              </Field>

              {submitError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
                  ⚠️ {submitError}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => !submitting && setShowModal(false)} disabled={submitting}
                  style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 700, color: "#6b7280", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "border-color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#0B1020"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ flex: 2, padding: "11px 0", borderRadius: 12, background: "linear-gradient(135deg,#8B5CF6,#06B6D4)", border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: "0 4px 14px rgba(139,92,246,.35)", opacity: submitting ? 0.7 : 1, transition: "all .2s" }}>
                  {submitting ? "Adding…" : "Add Operator →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OperatorOperations;
