import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/apiClient";
import {
  Building2, Edit2, RefreshCw, AlertCircle, X, Check,
  Globe, Mail, Phone, MapPin, Users, Calendar, Shield, Briefcase,
} from "lucide-react";

/* ── Design tokens ── */
const T = {
  navy: "#0B1020", navyMid: "#374151", coral: "#8B5CF6", teal: "#06B6D4",
  bg: "#F5F7FB", border: "#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.cm { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.cm .fd { font-family:'Sora',sans-serif; }
.cm-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); }
.cm-input { width:100%; border:1.5px solid ${T.border}; border-radius:10px; padding:10px 14px; font-size:13px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; transition:border-color .2s,box-shadow .2s; background:#fff; }
.cm-input:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
.cm-label { font-size:11px; font-weight:700; color:#64748b; margin-bottom:6px; display:block; text-transform:uppercase; letter-spacing:.06em; }
.cm-stat { background:#fff; border:1.5px solid ${T.border}; border-radius:16px; padding:18px 20px; display:flex; align-items:center; gap:14px; }
.cm-field { padding:12px 14px; background:#F8FAFF; border:1px solid ${T.border}; border-radius:10px; }
@keyframes cmUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.cm-in { animation:cmUp .35s ease both; }
@keyframes spin { to{transform:rotate(360deg)} }
`;

const PLAN_LABELS = { BASIC: "Basic", STANDARD: "Standard", PREMIUM: "Premium" };
const PLAN_COLORS = {
  BASIC:    { bg: "rgba(148,163,184,.1)", color: "#94a3b8", border: "rgba(148,163,184,.3)" },
  STANDARD: { bg: "rgba(99,102,241,.1)",  color: "#6366f1", border: "rgba(99,102,241,.3)"  },
  PREMIUM:  { bg: "rgba(139,92,246,.1)",  color: T.coral,   border: "rgba(139,92,246,.3)"  },
};

export default function WorkspaceOperations() {
  const [company,    setWorkspace]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [editing,    setEditing]    = useState(false);
  const [form,       setForm]       = useState({});
  const [saving,     setSaving]     = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [logoFile,   setLogoFile]   = useState(null);

  const tenantCode = localStorage.getItem("tenantCode") || "";
  const companyId  = localStorage.getItem("companyId")  || "";

  /* ── Fetch company ── */
  const fetchWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = null;
      if (companyId) {
        const res = await api.get(`/api/global-admin/companies/${companyId}`).catch(() => null);
        if (res) data = res.data?.data || res.data;
      }
      if (!data && tenantCode) {
        const res = await api.get(`/api/global-admin/companies/by-tenant/${tenantCode}`).catch(() => null);
        if (res) data = res.data?.data || res.data;
      }
      if (!data) {
        const res = await api.get("/api/company/register/companies").catch(() => null);
        if (res) {
          const list = res.data?.data || res.data || [];
          if (Array.isArray(list))
            data = list.find(c => String(c.id) === companyId || c.tenantCode === tenantCode) || list[0];
        }
      }
      setWorkspace(data || null);
      if (data) setForm({
        displayName:   data.displayName   || data.companyName || "",
        officialEmail: data.officialEmail || data.email       || "",
        phone:         data.phone         || "",
        website:       data.website       || "",
        industry:      data.industry      || "",
        address:       data.address       || "",
        city:          data.city          || "",
        state:         data.state         || "",
        country:       data.country       || "",
        pincode:       data.pincode       || "",
        gstin:         data.gstin         || "",
        cin:           data.cin           || "",
        pan:           data.pan           || "",
      });
    } catch (err) {
      console.error("Fetch company error:", err);
      setError("Failed to load company information.");
    } finally { setLoading(false); }
  }, [tenantCode, companyId]);

  useEffect(() => { fetchWorkspace(); }, [fetchWorkspace]);

  /* ── Save changes ── */
  const saveChanges = async () => {
    setSaving(true);
    setError(null);
    try {
      const id = companyId || company?.id;
      if (!id) throw new Error("Workspace ID not found.");

      if (logoFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
        fd.append("logo", logoFile);
        await api.put(`/api/global-admin/companies/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put(`/api/global-admin/companies/${id}`, form);
      }
      setSuccessMsg("Workspace information updated successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
      setEditing(false);
      setLogoFile(null);
      await fetchWorkspace();
    } catch (err) {
      console.error("Save company error:", err);
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally { setSaving(false); }
  };

  /* ── Plan badge ── */
  const PlanBadge = ({ plan }) => {
    const p = PLAN_COLORS[plan] || PLAN_COLORS.BASIC;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
        <Shield size={10} /> {PLAN_LABELS[plan] || plan || "Basic"}
      </span>
    );
  };

  return (
    <div className="cm" style={{ padding: "0 0 56px" }}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, padding: "22px 26px", position: "relative", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ position: "absolute", top: -50, right: 60, width: 180, height: 180, borderRadius: "50%", background: "rgba(139,92,246,.07)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.coral, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>CrewSync · Operatoristration</p>
            <h1 className="fd" style={{ fontSize: 23, fontWeight: 900, color: "#fff", margin: 0 }}>Workspace Control</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4 }}>Manage your company profile and subscription settings.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={fetchWorkspace} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 11, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans" }}>
              <RefreshCw size={13} /> Refresh
            </button>
            {!editing && (
              <button onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${T.coral},#06B6D4)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans", boxShadow: "0 4px 16px rgba(139,92,246,.3)" }}>
                <Edit2 size={13} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 26px" }}>

        {/* ── ALERTS ── */}
        {error && (
          <div className="cm-in" style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <AlertCircle size={16} color="#EF4444" />
            <p style={{ fontSize: 13, color: "#991b1b", fontWeight: 600, flex: 1 }}>{error}</p>
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} color="#991b1b" /></button>
          </div>
        )}
        {successMsg && (
          <div className="cm-in" style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Check size={16} color="#16a34a" />
            <p style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>{successMsg}</p>
          </div>
        )}

        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${T.coral}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .9s linear infinite", margin: "0 auto 12px" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ fontSize: 13, color: "#64748b" }}>Loading company information…</p>
          </div>
        ) : !company ? (
          <div className="cm-card" style={{ padding: "48px 24px", textAlign: "center" }}>
            <span style={{ fontSize: 44, display: "block", marginBottom: 12 }}>🏢</span>
            <p className="fd" style={{ fontSize: 16, fontWeight: 800, color: T.navy, marginBottom: 6 }}>No Workspace Found</p>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>Workspace profile could not be loaded. Please contact your Global Operator.</p>
          </div>
        ) : (
          <>
            {/* ── STATS ROW ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 22 }}>
              {[
                { Icon: Building2, label: "Tenant Code",   value: company.tenantCode || tenantCode || "—", color: T.coral   },
                { Icon: Shield,    label: "Plan",           value: company.plan       || "BASIC",           color: "#6366f1" },
                { Icon: Users,     label: "Seats",          value: company.maxPersons || "Unlimited",     color: T.teal    },
                { Icon: Calendar,  label: "Member Since",   value: company.createdAt
                    ? new Date(company.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                    : "—",
                  color: "#f59e0b" },
              ].map(({ Icon, label, value, color }) => (
                <div key={label} className="cm-stat cm-in">
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>{label}</p>
                    <p className="fd" style={{ fontSize: 15, fontWeight: 900, color: T.navy }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── COMPANY PROFILE CARD ── */}
            <div className="cm-card cm-in" style={{ overflow: "hidden" }}>
              <div style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Building2 size={16} color={T.coral} />
                  <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Workspace Profile</p>
                </div>
                {company.plan && <PlanBadge plan={company.plan} />}
              </div>

              <div style={{ padding: "22px 24px" }}>
                {/* Logo + name header */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 18, background: "#F8FAFF", border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    {company.logoUrl
                      ? <img src={company.logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      : <Building2 size={28} color="#94a3b8" />}
                  </div>
                  <div>
                    <p className="fd" style={{ fontSize: 20, fontWeight: 900, color: T.navy }}>{company.displayName || company.companyName}</p>
                    {company.officialEmail && <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{company.officialEmail}</p>}
                    {editing && (
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${T.border}`, background: "#fff", fontSize: 11, fontWeight: 700, color: "#64748b", cursor: "pointer", marginTop: 10 }}>
                        {logoFile ? `✓ ${logoFile.name}` : "Upload Logo"}
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => setLogoFile(e.target.files[0])} />
                      </label>
                    )}
                  </div>
                </div>

                {editing ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {[
                        { label: "Workspace Name",   key: "displayName"   },
                        { label: "Official Email", key: "officialEmail" },
                        { label: "Phone",          key: "phone"         },
                        { label: "Website",        key: "website"       },
                        { label: "Industry",       key: "industry"      },
                        { label: "GSTIN",          key: "gstin"         },
                        { label: "CIN",            key: "cin"           },
                        { label: "PAN",            key: "pan"           },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="cm-label">{label}</label>
                          <input className="cm-input" value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                        </div>
                      ))}
                      <div style={{ gridColumn: "1/-1" }}>
                        <label className="cm-label">Address</label>
                        <input className="cm-input" value={form.address || ""} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                      </div>
                      {[["City","city"],["State","state"],["Country","country"],["Pincode","pincode"]].map(([l,k]) => (
                        <div key={k}>
                          <label className="cm-label">{l}</label>
                          <input className="cm-input" value={form[k] || ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                      <button onClick={() => { setEditing(false); setLogoFile(null); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: "#fff", color: T.navy, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans" }}>
                        Cancel
                      </button>
                      <button onClick={saveChanges} disabled={saving}
                        style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11, background: `linear-gradient(135deg,${T.coral},#06B6D4)`, color: "#fff", fontSize: 13, fontWeight: 800, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? .7 : 1, fontFamily: "DM Sans", boxShadow: "0 4px 16px rgba(139,92,246,.3)" }}>
                        {saving ? "Saving…" : "Save Changes"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                    {[
                      { icon: Mail,     label: "Official Email", value: company.officialEmail || company.email  || "—" },
                      { icon: Phone,    label: "Phone",          value: company.phone          || "—" },
                      { icon: Globe,    label: "Website",        value: company.website        || "—" },
                      { icon: Briefcase,label: "Industry",       value: company.industry       || "—" },
                      { icon: MapPin,   label: "Address",        value: [company.address, company.city, company.state, company.country].filter(Boolean).join(", ") || "—" },
                      { icon: Shield,   label: "GSTIN",          value: company.gstin          || "—" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="cm-field">
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                          <Icon size={12} color="#94a3b8" />
                          <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em" }}>{label}</p>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
