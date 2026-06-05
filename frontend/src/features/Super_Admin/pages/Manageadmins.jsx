import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/apiClient";

/* ── design tokens ── */
const C = {
  navy:"#0D1F2D", mid:"#162639", coral:"#FF6B35",
  green:"#10b981", red:"#ef4444", amber:"#f59e0b",
  bg:"#F4F6FB", border:"#EDF0F7",
};

const Ic = ({ d, size=16, sw=1.8, color="currentColor" }) => (
  <svg width={size} height={size} fill="none" stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    {[].concat(d).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);

/* ── helpers ── */
const displayName = a =>
  a.firstName ? `${a.firstName} ${a.lastName||""}`.trim() : (a.name||a.username||a.email||"—");
const initials = a => {
  const n = displayName(a);
  return n.split(" ").filter(Boolean).map(w=>w[0]).join("").toUpperCase().slice(0,2)||"A";
};
const statusOf = a => (a.status||"ACTIVE").toUpperCase();

/* ── toast ── */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return ()=>clearTimeout(t); }, [onClose]);
  const bg = type==="success" ? C.green : C.red;
  return (
    <div style={{ position:"fixed", top:20, right:24, zIndex:100000,
      display:"flex", alignItems:"center", gap:10,
      padding:"13px 20px", borderRadius:14,
      background:bg, color:"#fff", fontSize:13, fontWeight:700,
      boxShadow:"0 8px 28px rgba(0,0,0,.25)", animation:"fadeUp .25s ease",
    }}>
      <Ic d={type==="success"?"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z":"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} size={15} sw={2.2}/>
      {message}
    </div>
  );
}

/* ── confirm modal ── */
function ConfirmModal({ title, body, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, padding:20 }} onClick={onCancel}>
      <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:400, boxShadow:"0 24px 60px rgba(0,0,0,.25)", overflow:"hidden" }} onClick={e=>e.stopPropagation()}>
        <div style={{ background:`linear-gradient(135deg,${C.navy},${C.mid})`, padding:"20px 24px" }}>
          <p style={{ color:"#fff", fontSize:16, fontWeight:800, margin:0, fontFamily:"'Sora',sans-serif" }}>{title}</p>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <p style={{ fontSize:13, color:"#475569", margin:"0 0 20px", lineHeight:1.6 }}>{body}</p>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={onCancel} style={{ padding:"9px 20px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"#fff", color:"#475569", fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancel</button>
            <button onClick={onConfirm} style={{ padding:"9px 20px", borderRadius:10, border:"none", background:C.red, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 12px rgba(239,68,68,.3)" }}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── add / edit modal ── */
function AdminModal({ mode, admin, onClose, onSubmit, saving }) {
  const isEdit = mode==="edit";
  const [form, setForm] = useState({
    firstName:   admin?.firstName   || (admin?.name||"").split(" ")[0] || "",
    lastName:    admin?.lastName    || (admin?.name||"").split(" ").slice(1).join(" ") || "",
    email:       admin?.email       || "",
    phoneNumber: admin?.phoneNumber || admin?.phone || "",
    password:    "",
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const inp = {
    width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 13px",
    fontSize:13, color:"#1e293b", outline:"none", boxSizing:"border-box",
    fontFamily:"'DM Sans',sans-serif", background:"#fff",
  };
  const lbl = {
    fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase",
    letterSpacing:".07em", display:"block", marginBottom:5,
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, padding:20 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:22, width:"100%", maxWidth:480, boxShadow:"0 32px 80px rgba(0,0,0,.28)", overflow:"hidden" }} onClick={e=>e.stopPropagation()}>
        <div style={{ background:isEdit?"linear-gradient(135deg,#0ea5e9,#0284c7)":`linear-gradient(135deg,${C.navy},${C.mid})`, padding:"20px 26px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div>
            <p style={{ color:"#fff", fontSize:16, fontWeight:900, margin:0, fontFamily:"'Sora',sans-serif" }}>{isEdit?"Edit Admin":"Add New Admin"}</p>
            <p style={{ color:"rgba(255,255,255,.45)", fontSize:11, margin:"3px 0 0" }}>{isEdit?"Update admin details":"Create a new admin for your team"}</p>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, border:"none", background:"rgba(255,255,255,.12)", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic d="M6 18L18 6M6 6l12 12" size={14} sw={2.2}/>
          </button>
        </div>
        <form onSubmit={e=>{e.preventDefault(); onSubmit(form);}} style={{ padding:"22px 26px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 16px" }}>
            <div>
              <label style={lbl}>First Name *</label>
              <input required style={inp} value={form.firstName} onChange={e=>set("firstName",e.target.value)} placeholder="John"/>
            </div>
            <div>
              <label style={lbl}>Last Name</label>
              <input style={inp} value={form.lastName} onChange={e=>set("lastName",e.target.value)} placeholder="Doe"/>
            </div>
            <div style={{ gridColumn:"1 / -1" }}>
              <label style={lbl}>Email *</label>
              <input required type="email" style={inp} value={form.email} onChange={e=>set("email",e.target.value)} placeholder="admin@company.com"/>
            </div>
            <div style={{ gridColumn:"1 / -1" }}>
              <label style={lbl}>Phone Number</label>
              <input style={inp} value={form.phoneNumber} onChange={e=>set("phoneNumber",e.target.value)} placeholder="+91 9876543210"/>
            </div>
            {!isEdit && (
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={lbl}>Password *</label>
                <input required type="password" style={inp} value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Min 8 characters" minLength={8}/>
              </div>
            )}
          </div>
          {!isEdit && (
            <div style={{ marginTop:14, padding:"11px 14px", borderRadius:10, background:"rgba(16,185,129,.07)", border:"1.5px solid rgba(16,185,129,.2)", display:"flex", alignItems:"flex-start", gap:9 }}>
              <svg width={15} height={15} fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:1 }}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <p style={{ fontSize:12, color:"#065f46", fontWeight:600, margin:0, lineHeight:1.5 }}>
                Login credentials (email + password) will be automatically sent to the admin's email address after creation.
              </p>
            </div>
          )}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:22, paddingTop:18, borderTop:`1px solid ${C.border}` }}>
            <button type="button" onClick={onClose} style={{ padding:"10px 22px", borderRadius:11, border:`1.5px solid ${C.border}`, background:"#fff", color:"#475569", fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancel</button>
            <button type="submit" disabled={saving} style={{
              padding:"10px 22px", borderRadius:11, border:"none",
              background:isEdit?"linear-gradient(135deg,#0ea5e9,#0284c7)":`linear-gradient(135deg,${C.coral},#FF8C5A)`,
              color:"#fff", fontSize:13, fontWeight:800, cursor:saving?"not-allowed":"pointer",
              opacity:saving?.7:1, boxShadow:`0 4px 14px ${isEdit?"rgba(14,165,233,.3)":"rgba(255,107,53,.3)"}`,
              display:"flex", alignItems:"center", gap:7,
            }}>
              {saving&&<SpinIcon/>}
              {isEdit?"Save Changes":"Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SpinIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ animation:"spin 1s linear infinite" }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.sadm * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }
.sadm .fd { font-family:'Sora',sans-serif; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.sadm-card { background:#fff; border-radius:16px; border:1px solid ${C.border}; box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.04); }
.sadm-row:hover { background:#f8fafc !important; }
.sadm-stat:hover { transform:translateY(-2px); box-shadow:0 4px 20px rgba(0,0,0,.08); }
.sadm-stat { transition:all .2s; }
`;

/* ════════════════════════════════ MAIN ════════════════════════════════ */
export default function ManageAdmins() {
  const [admins,  setAdmins]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [modal,       setModal]       = useState(null); // null | "add" | "edit"
  const [selected,    setSelected]    = useState(null);
  const [delConf,     setDelConf]     = useState(null);
  const [sendingCred, setSendingCred] = useState(null); // userId being sent
  const [credSentMap, setCredSentMap] = useState({});   // userId → boolean

  const companyName = localStorage.getItem("companyName") || "Company";
  const showToast = (message, type="success") => setToast({ message, type });

  /* ── fetch ── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/api/users/tenant/admins");
      const list = Array.isArray(r.data) ? r.data
        : Array.isArray(r.data?.data) ? r.data.data : [];
      setAdmins(list);
    } catch {
      // fallback: get all users and filter admins
      try {
        const r2 = await api.get("/api/users/tenant");
        const all = Array.isArray(r2.data) ? r2.data
          : Array.isArray(r2.data?.data) ? r2.data.data : [];
        setAdmins(all.filter(u => {
          const role = (u.role||"").toUpperCase();
          return role==="ADMIN"||role==="COMPANY_ADMIN"||role==="SUPER_ADMIN";
        }));
      } catch { setAdmins([]); }
    }
    setLoading(false);
  }, []);

  const loadCredStatus = useCallback(async () => {
    try {
      const r = await api.get("/api/login-access/tenant");
      const list = Array.isArray(r.data) ? r.data
        : Array.isArray(r.data?.data) ? r.data.data : [];
      const map = {};
      list.forEach(item => {
        const id = item.userId ?? item.employeeId ?? item.id;
        if (id != null) map[String(id)] = item.credentialsSent === true;
      });
      setCredSentMap(map);
    } catch { /* best-effort */ }
  }, []);

  useEffect(() => { load(); loadCredStatus(); }, [load, loadCredStatus]);

  /* ── CRUD ── */
  const handleCreate = async form => {
    setSaving(true);
    try {
      const body = { ...form, role:"ADMIN", tenantCode: localStorage.getItem("tenantCode")||"" };
      const r = await api.post("/api/users/register", body);
      const created = r.data?.data || r.data;
      if (r.data?.success !== false) {
        showToast("Admin created! Sending credentials email…");
        setModal(null);
        load();
        // auto-send credentials email after creation
        if (created?.id) {
          try {
            await api.post(`/api/login-access/employee/${created.id}/send-credentials`);
            showToast(`Credentials sent to ${form.email} ✓`);
          } catch { /* email send is best-effort */ }
        }
      } else showToast(r.data?.message||"Failed to create admin","error");
    } catch(e) { showToast(e.response?.data?.message||"Error creating admin","error"); }
    setSaving(false);
  };

  const handleUpdate = async form => {
    setSaving(true);
    try {
      const r = await api.put(`/api/users/${selected.id}`, form);
      if (r.data?.success !== false) {
        showToast("Admin updated!");
        setModal(null); setSelected(null);
        load();
      } else showToast(r.data?.message||"Failed to update","error");
    } catch(e) { showToast(e.response?.data?.message||"Error updating admin","error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!delConf) return;
    try {
      await api.delete(`/api/users/${delConf.id}`);
      showToast("Admin deleted");
      setDelConf(null);
      load();
    } catch(e) { showToast(e.response?.data?.message||"Error deleting admin","error"); }
  };

  const handleToggle = async a => {
    try {
      await api.patch(`/api/users/${a.id}/toggle-status`);
      showToast("Status updated!");
      load();
    } catch { showToast("Failed to toggle status","error"); }
  };

  const handleSendCredentials = async a => {
    setSendingCred(a.id);
    try {
      await api.post(`/api/login-access/employee/${a.id}/send-credentials`);
      showToast(`Credentials sent to ${a.email||displayName(a)} ✓`);
      setCredSentMap(prev => ({ ...prev, [String(a.id)]: true }));
    } catch(e) {
      showToast(e.response?.data?.message || "Failed to send credentials","error");
    }
    setSendingCred(null);
  };

  /* ── derived ── */
  const filtered = admins.filter(a => {
    const q = search.toLowerCase();
    return displayName(a).toLowerCase().includes(q) || (a.email||"").toLowerCase().includes(q);
  });
  const totalAdmins    = admins.length;
  const activeAdmins   = admins.filter(a=>statusOf(a)==="ACTIVE").length;
  const inactiveAdmins = admins.filter(a=>statusOf(a)==="INACTIVE").length;

  return (
    <div className="sadm" style={{ background:C.bg, minHeight:"100vh", padding:"24px 28px" }}>
      <style>{CSS}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
      {modal==="add"  && <AdminModal mode="add"  onClose={()=>setModal(null)} onSubmit={handleCreate} saving={saving}/>}
      {modal==="edit" && selected && <AdminModal mode="edit" admin={selected} onClose={()=>{setModal(null);setSelected(null);}} onSubmit={handleUpdate} saving={saving}/>}
      {delConf && (
        <ConfirmModal
          title="Delete Admin"
          body={`Are you sure you want to delete "${displayName(delConf)}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={()=>setDelConf(null)}
        />
      )}

      {/* ── Hero ── */}
      <div style={{
        background:`linear-gradient(135deg,${C.navy} 0%,${C.mid} 60%,#1a3a5c 100%)`,
        borderRadius:20, padding:"22px 28px", marginBottom:22,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-30, right:60, width:140, height:140, borderRadius:"50%", background:"rgba(99,102,241,.10)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div>
            <p style={{ color:"rgba(255,255,255,.4)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".12em", margin:"0 0 5px" }}>{companyName} · Super Admin</p>
            <h1 className="fd" style={{ color:"#fff", fontSize:24, fontWeight:900, margin:0, letterSpacing:"-.02em" }}>Manage Admins</h1>
            <p style={{ color:"rgba(255,255,255,.45)", fontSize:12, margin:"5px 0 0" }}>Add, edit, and manage your admin users</p>
          </div>
          <button onClick={()=>setModal("add")} style={{
            padding:"11px 22px", borderRadius:13,
            background:"linear-gradient(135deg,#FF6B35,#FF8C5A)",
            color:"#fff", border:"none", cursor:"pointer",
            fontSize:13, fontWeight:800,
            boxShadow:"0 4px 16px rgba(255,107,53,.35)",
            display:"flex", alignItems:"center", gap:8,
          }}>
            <Ic d="M12 4v16m8-8H4" size={14} sw={2.5}/> Add Admin
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:22 }}>
        {[
          { label:"Total Admins",   value:totalAdmins,    icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", accent:"#6366f1", bg:"rgba(99,102,241,.08)" },
          { label:"Active",         value:activeAdmins,   icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", accent:C.green, bg:"rgba(16,185,129,.08)" },
          { label:"Inactive",       value:inactiveAdmins, icon:"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", accent:C.red,   bg:"rgba(239,68,68,.08)" },
        ].map((s,i)=>(
          <div key={s.label} className="sadm-card sadm-stat" style={{ padding:"18px 20px", display:"flex", alignItems:"center", gap:14, animation:`fadeUp .35s ease ${i*80}ms both` }}>
            <div style={{ width:46, height:46, borderRadius:13, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ic d={s.icon} size={21} color={s.accent} sw={1.8}/>
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 3px" }}>{s.label}</p>
              <p className="fd" style={{ fontSize:28, fontWeight:900, color:C.navy, margin:0, letterSpacing:"-.02em" }}>
                {loading ? <span style={{ color:"#e2e8f0" }}>—</span> : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div className="sadm-card" style={{ padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ position:"relative", flex:1 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
            <Ic d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={14} color="#94a3b8" sw={2}/>
          </span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…"
            style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 13px 9px 36px", fontSize:13, color:"#1e293b", outline:"none", fontFamily:"'DM Sans',sans-serif", background:"#fff" }}/>
        </div>
        <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600, whiteSpace:"nowrap" }}>{filtered.length} admin{filtered.length!==1?"s":""}</span>
      </div>

      {/* ── Table ── */}
      <div className="sadm-card" style={{ overflow:"hidden" }}>
        {loading && admins.length===0 ? (
          <div style={{ padding:"56px 0", textAlign:"center", color:"#94a3b8", display:"flex", alignItems:"center", justifyContent:"center", gap:10, fontSize:13 }}>
            <SpinIcon/> Loading admins…
          </div>
        ) : filtered.length===0 ? (
          <div style={{ padding:"56px 0", textAlign:"center" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
              <Ic d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size={22} color="#cbd5e1"/>
            </div>
            <p style={{ fontSize:14, fontWeight:700, color:"#94a3b8", margin:0 }}>No admins found</p>
            <p style={{ fontSize:12, color:"#cbd5e1", margin:"4px 0 0" }}>
              {search?"Try a different search":"Click 'Add Admin' to create one"}
            </p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:C.navy }}>
                  {["Admin","Email","Phone","Employee ID","Status","Actions"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"12px 16px", fontSize:10, fontWeight:700, color:"rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".08em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a,i)=>{
                  const isActive = statusOf(a)==="ACTIVE";
                  return (
                    <tr key={a.id||i} className="sadm-row" style={{ borderBottom:`1px solid ${C.border}`, background:"transparent", transition:"background .15s" }}>
                      {/* Name */}
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                          <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#6366f1,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13, flexShrink:0, fontFamily:"'Sora',sans-serif" }}>
                            {initials(a)}
                          </div>
                          <div>
                            <p style={{ fontWeight:700, color:C.navy, margin:0, fontSize:13 }}>{displayName(a)}</p>
                            <p style={{ fontSize:10, color:"#94a3b8", margin:0, fontFamily:"'DM Sans',sans-serif" }}>
                              {(a.role||"Admin").replace(/_/g," ")}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Email */}
                      <td style={{ padding:"13px 16px", color:"#475569", fontSize:12 }}>{a.email||"—"}</td>
                      {/* Phone */}
                      <td style={{ padding:"13px 16px", color:"#475569", fontSize:12 }}>{a.phoneNumber||a.phone||"—"}</td>
                      {/* Employee ID */}
                      <td style={{ padding:"13px 16px", color:"#475569", fontSize:12 }}>{a.employeeId||"—"}</td>
                      {/* Status */}
                      <td style={{ padding:"13px 16px" }}>
                        <button onClick={()=>handleToggle(a)} title="Click to toggle status" style={{
                          padding:"4px 12px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer", border:"none",
                          background:isActive?"rgba(16,185,129,.10)":"rgba(239,68,68,.08)",
                          color:isActive?C.green:C.red,
                          transition:"all .15s",
                        }}>{isActive?"Active":"Inactive"}</button>
                      </td>
                      {/* Actions */}
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                          <button onClick={()=>{setSelected(a);setModal("edit");}} style={{ padding:"6px 13px", borderRadius:9, border:`1.5px solid rgba(14,165,233,.3)`, background:"rgba(14,165,233,.07)", color:"#0ea5e9", fontSize:11, fontWeight:700, cursor:"pointer" }}>Edit</button>
                          {credSentMap[String(a.id)]
                            ? <span style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 13px", borderRadius:9, background:"rgba(16,185,129,.10)", color:C.green, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                                <Ic d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={11} sw={2.5} color={C.green}/> Sent ✓
                              </span>
                            : <button
                                onClick={()=>handleSendCredentials(a)}
                                disabled={sendingCred===a.id}
                                title="Send login credentials to admin's email"
                                style={{
                                  padding:"6px 13px", borderRadius:9,
                                  border:`1.5px solid rgba(16,185,129,.3)`,
                                  background:"rgba(16,185,129,.07)", color:C.green,
                                  fontSize:11, fontWeight:700,
                                  cursor:sendingCred===a.id?"not-allowed":"pointer",
                                  opacity:sendingCred===a.id?.7:1,
                                  display:"flex", alignItems:"center", gap:4,
                                }}>
                                {sendingCred===a.id
                                  ? <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ animation:"spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                                  : <svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
                                {sendingCred===a.id ? "Sending…" : "Send Creds"}
                              </button>
                          }
                          <button onClick={()=>setDelConf(a)} style={{ padding:"6px 13px", borderRadius:9, border:`1.5px solid rgba(239,68,68,.25)`, background:"rgba(239,68,68,.06)", color:C.red, fontSize:11, fontWeight:700, cursor:"pointer" }}>Delete</button>
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
    </div>
  );
}
