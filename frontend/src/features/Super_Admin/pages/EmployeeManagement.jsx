import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/apiClient";

/* ── design tokens ── */
const C = {
  navy:"#0B1020", mid:"#182033", coral:"#8B5CF6",
  green:"#10b981", red:"#ef4444", amber:"#f59e0b",
  purple:"#6366f1", teal:"#06B6D4",
  bg:"#F4F6FB", border:"#EDF0F7",
};

const Ic = ({ d, size=16, sw=1.8, color="currentColor" }) => (
  <svg width={size} height={size} fill="none" stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    {[].concat(d).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);

const displayName = u =>
  u.firstName ? `${u.firstName} ${u.lastName||""}`.trim() : (u.name||u.username||u.email||"—");
const initials = u => {
  const n = displayName(u);
  return n.split(" ").filter(Boolean).map(w=>w[0]).join("").toUpperCase().slice(0,2)||"?";
};
const statusOf = u => (u.status||"ACTIVE").toUpperCase();

function SpinIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ animation:"spin 1s linear infinite" }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

/* ── Toast ── */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return ()=>clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position:"fixed", top:20, right:24, zIndex:100000,
      display:"flex", alignItems:"center", gap:10, padding:"13px 20px", borderRadius:14,
      background:type==="success"?C.green:C.red, color:"#fff", fontSize:13, fontWeight:700,
      boxShadow:"0 8px 28px rgba(0,0,0,.25)", animation:"fadeUp .25s ease",
    }}>
      <Ic d={type==="success"?"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z":"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} size={15} sw={2.2}/>
      {message}
    </div>
  );
}

/* ── Confirm Modal ── */
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

/* ── View/Edit Modal ── */
function PersonModal({ mode, emp, onClose, onSubmit, saving }) {
  const isView = mode==="view";
  const [form, setForm] = useState({
    firstName:   emp?.firstName   || "",
    lastName:    emp?.lastName    || "",
    email:       emp?.email       || "",
    phoneNumber: emp?.phoneNumber || emp?.phone || "",
    department:  emp?.department  || "",
    designation: emp?.designation || "",
    employeeId:  emp?.employeeId  || "",
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const inp = (disabled=false) => ({
    width:"100%", border:`1.5px solid ${disabled?"#f1f5f9":C.border}`, borderRadius:10, padding:"10px 13px",
    fontSize:13, color:disabled?"#94a3b8":"#1e293b", outline:"none", boxSizing:"border-box",
    fontFamily:"'DM Sans',sans-serif", background:disabled?"#f8fafc":"#fff",
  });
  const lbl = {
    fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase",
    letterSpacing:".07em", display:"block", marginBottom:5,
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, padding:20 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:22, width:"100%", maxWidth:520, maxHeight:"90vh", overflow:"auto", boxShadow:"0 32px 80px rgba(0,0,0,.28)" }} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ background:isView?"linear-gradient(135deg,#6366f1,#0ea5e9)":`linear-gradient(135deg,${C.navy},${C.mid})`, padding:"20px 26px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", position:"sticky", top:0, zIndex:2 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:16, fontFamily:"'Sora',sans-serif", flexShrink:0 }}>
              {initials(emp)}
            </div>
            <div>
              <p style={{ color:"#fff", fontSize:15, fontWeight:900, margin:0, fontFamily:"'Sora',sans-serif" }}>{isView?"Person Profile":"Edit Person"}</p>
              <p style={{ color:"rgba(255,255,255,.45)", fontSize:11, margin:"2px 0 0" }}>{displayName(emp)}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, border:"none", background:"rgba(255,255,255,.12)", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Ic d="M6 18L18 6M6 6l12 12" size={14} sw={2.2}/>
          </button>
        </div>

        {isView ? (
          <div style={{ padding:"22px 26px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 20px" }}>
              {[
                ["First Name",   emp.firstName||"—"],
                ["Last Name",    emp.lastName||"—"],
                ["Email",        emp.email||"—"],
                ["Phone",        emp.phoneNumber||emp.phone||"—"],
                ["Department",   emp.department||"—"],
                ["Designation",  emp.designation||"—"],
                ["Person ID",  emp.employeeId||"—"],
                ["Status",       statusOf(emp)],
              ].map(([label,val])=>(
                <div key={label}>
                  <label style={lbl}>{label}</label>
                  <div style={{ padding:"10px 13px", borderRadius:10, background:"#f8fafc", border:`1.5px solid #f1f5f9`, fontSize:13, color:label==="Status"?(val==="ACTIVE"?C.green:C.red):"#1e293b", fontWeight:label==="Status"?700:400 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:22, paddingTop:18, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"flex-end" }}>
              <button onClick={onClose} style={{ padding:"10px 22px", borderRadius:11, border:`1.5px solid ${C.border}`, background:"#fff", color:"#475569", fontSize:13, fontWeight:700, cursor:"pointer" }}>Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={e=>{e.preventDefault();onSubmit(form);}} style={{ padding:"22px 26px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 16px" }}>
              <div>
                <label style={lbl}>First Name *</label>
                <input required style={inp()} value={form.firstName} onChange={e=>set("firstName",e.target.value)} placeholder="First name"/>
              </div>
              <div>
                <label style={lbl}>Last Name</label>
                <input style={inp()} value={form.lastName} onChange={e=>set("lastName",e.target.value)} placeholder="Last name"/>
              </div>
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={lbl}>Email *</label>
                <input required type="email" style={inp()} value={form.email} onChange={e=>set("email",e.target.value)} placeholder="email@company.com"/>
              </div>
              <div>
                <label style={lbl}>Phone</label>
                <input style={inp()} value={form.phoneNumber} onChange={e=>set("phoneNumber",e.target.value)} placeholder="+91 98765 43210"/>
              </div>
              <div>
                <label style={lbl}>Person ID</label>
                <input style={inp(true)} value={form.employeeId} disabled placeholder="Auto-assigned"/>
              </div>
              <div>
                <label style={lbl}>Department</label>
                <input style={inp()} value={form.department} onChange={e=>set("department",e.target.value)} placeholder="Engineering"/>
              </div>
              <div>
                <label style={lbl}>Designation</label>
                <input style={inp()} value={form.designation} onChange={e=>set("designation",e.target.value)} placeholder="Software Engineer"/>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:22, paddingTop:18, borderTop:`1px solid ${C.border}` }}>
              <button type="button" onClick={onClose} style={{ padding:"10px 22px", borderRadius:11, border:`1.5px solid ${C.border}`, background:"#fff", color:"#475569", fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancel</button>
              <button type="submit" disabled={saving} style={{
                padding:"10px 22px", borderRadius:11, border:"none",
                background:`linear-gradient(135deg,${C.coral},#FBBF24)`,
                color:"#fff", fontSize:13, fontWeight:800,
                cursor:saving?"not-allowed":"pointer",
                opacity:saving?.7:1, boxShadow:"0 4px 14px rgba(139,92,246,.3)",
                display:"flex", alignItems:"center", gap:7,
              }}>
                {saving&&<SpinIcon/>} Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.saem * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }
.saem .fd { font-family:'Sora',sans-serif; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.saem-card { background:#fff; border-radius:16px; border:1px solid ${C.border}; box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.04); }
.saem-row:hover { background:#f8fafc !important; }
.saem-stat:hover { transform:translateY(-2px); box-shadow:0 4px 20px rgba(0,0,0,.08); }
.saem-stat { transition:all .2s; }
`;

const AVATAR_GRADS = [
  "linear-gradient(135deg,#6366f1,#0ea5e9)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#0ea5e9,#10b981)",
];

/* ════════════════════════════════ MAIN ════════════════════════════════ */
export default function PersonOperations({ navigateTo }) {
  const [employees,   setPersons]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [deptFilt,    setDeptFilt]    = useState("all");
  const [statusFilt,  setStatusFilt]  = useState("all");
  const [modal,       setModal]       = useState(null);
  const [delConf,     setDelConf]     = useState(null);
  const [sendingCred, setSendingCred] = useState(null); // userId being sent
  const [credSentMap, setCredSentMap] = useState({});   // userId → boolean

  const companyName = localStorage.getItem("companyName") || "Workspace";
  const showToast = (message, type="success") => setToast({ message, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/api/users/tenant/employees");
      const list = Array.isArray(r.data) ? r.data
        : Array.isArray(r.data?.data) ? r.data.data : [];
      setPersons(list);
    } catch {
      try {
        const r2 = await api.get("/api/users/tenant");
        const all = Array.isArray(r2.data) ? r2.data
          : Array.isArray(r2.data?.data) ? r2.data.data : [];
        setPersons(all.filter(u => (u.role||"").toUpperCase()==="EMPLOYEE"));
      } catch { setPersons([]); }
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

  const handleUpdate = async form => {
    if (!modal?.emp) return;
    setSaving(true);
    try {
      const r = await api.put(`/api/users/${modal.emp.id}`, form);
      if (r.data?.success !== false) {
        showToast("Person updated!");
        setModal(null);
        load();
      } else showToast(r.data?.message||"Failed to update","error");
    } catch(e) { showToast(e.response?.data?.message||"Error updating","error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!delConf) return;
    try {
      await api.delete(`/api/users/${delConf.id}`);
      showToast("Person removed");
      setDelConf(null);
      load();
    } catch(e) { showToast(e.response?.data?.message||"Error deleting","error"); }
  };

  const handleToggle = async emp => {
    try {
      await api.patch(`/api/users/${emp.id}/toggle-status`);
      showToast("Status updated!");
      load();
    } catch { showToast("Failed to toggle status","error"); }
  };

  const handleSendCredentials = async emp => {
    setSendingCred(emp.id);
    try {
      await api.post(`/api/login-access/employee/${emp.id}/send-credentials`);
      showToast(`Credentials sent to ${emp.email||displayName(emp)} ✓`);
      setCredSentMap(prev => ({ ...prev, [String(emp.id)]: true }));
    } catch(e) {
      showToast(e.response?.data?.message || "Failed to send credentials","error");
    }
    setSendingCred(null);
  };

  const depts = [...new Set(employees.map(e=>e.department).filter(Boolean))].sort();

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || displayName(e).toLowerCase().includes(q)
      || (e.email||"").toLowerCase().includes(q)
      || (e.employeeId||"").toLowerCase().includes(q)
      || (e.department||"").toLowerCase().includes(q);
    const matchD = deptFilt==="all" || e.department===deptFilt;
    const matchS = statusFilt==="all" || statusOf(e)===statusFilt.toUpperCase();
    return matchQ && matchD && matchS;
  });

  const totalEmp    = employees.length;
  const activeEmp   = employees.filter(e=>statusOf(e)==="ACTIVE").length;
  const inactiveEmp = employees.filter(e=>statusOf(e)==="INACTIVE").length;
  const totalDepts  = depts.length;

  return (
    <div className="saem" style={{ background:C.bg, minHeight:"100vh", padding:"24px 28px" }}>
      <style>{CSS}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
      {modal && <PersonModal mode={modal.mode} emp={modal.emp} onClose={()=>setModal(null)} onSubmit={handleUpdate} saving={saving}/>}
      {delConf && (
        <ConfirmModal
          title="Remove Person"
          body={`Remove "${displayName(delConf)}" from the system? This cannot be undone.`}
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
        <div style={{ position:"absolute", top:-40, right:80, width:160, height:160, borderRadius:"50%", background:"rgba(99,102,241,.08)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,.4)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".12em", margin:"0 0 5px" }}>{companyName} · Owner</p>
            <h1 className="fd" style={{ color:"#fff", fontSize:24, fontWeight:900, margin:0, letterSpacing:"-.02em" }}>People Grid</h1>
            <p style={{ color:"rgba(255,255,255,.45)", fontSize:12, margin:"5px 0 0" }}>View, search, and manage your entire workforce</p>
          </div>
          <button onClick={()=>navigateTo?.("sa_onboard")} style={{
            padding:"11px 22px", borderRadius:13,
            background:"linear-gradient(135deg,#8B5CF6,#FBBF24)",
            color:"#fff", border:"none", cursor:"pointer",
            fontSize:13, fontWeight:800,
            boxShadow:"0 4px 16px rgba(139,92,246,.35)",
            display:"flex", alignItems:"center", gap:8,
          }}>
            <Ic d="M12 4v16m8-8H4" size={14} sw={2.5}/> Add Person
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
        {[
          { label:"Total People", value:totalEmp,    icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", accent:C.purple, bg:"rgba(99,102,241,.08)" },
          { label:"Active",          value:activeEmp,   icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",                                                                                                                                                                          accent:C.green,  bg:"rgba(16,185,129,.08)" },
          { label:"Inactive",        value:inactiveEmp, icon:"M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",                                                                                                                        accent:C.red,    bg:"rgba(239,68,68,.08)" },
          { label:"Departments",     value:totalDepts,  icon:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",                                                                          accent:C.amber,  bg:"rgba(245,158,11,.08)" },
        ].map((s,i)=>(
          <div key={s.label} className="saem-card saem-stat" style={{ padding:"18px 20px", display:"flex", alignItems:"center", gap:14, animation:`fadeUp .35s ease ${i*70}ms both` }}>
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

      {/* ── Filters ── */}
      <div className="saem-card" style={{ padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:"1 1 220px" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
            <Ic d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={14} color="#94a3b8" sw={2}/>
          </span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, ID, department…"
            style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 13px 9px 36px", fontSize:13, color:"#1e293b", outline:"none", fontFamily:"'DM Sans',sans-serif", background:"#fff" }}/>
        </div>
        <select value={deptFilt} onChange={e=>setDeptFilt(e.target.value)} style={{
          border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 13px",
          fontSize:13, color:deptFilt!=="all"?C.navy:"#94a3b8", outline:"none", background:"#fff",
          fontFamily:"'DM Sans',sans-serif", cursor:"pointer", minWidth:160,
        }}>
          <option value="all">All Departments</option>
          {depts.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
        {["all","active","inactive"].map(s=>(
          <button key={s} onClick={()=>setStatusFilt(s)} style={{
            padding:"8px 16px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", border:"none",
            background:statusFilt===s?(s==="active"?"rgba(16,185,129,.12)":s==="inactive"?"rgba(239,68,68,.10)":"rgba(99,102,241,.10)"):"#f1f5f9",
            color:statusFilt===s?(s==="active"?C.green:s==="inactive"?C.red:C.purple):"#94a3b8",
            transition:"all .15s",
          }}>{s==="all"?"All Status":s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
        <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600, whiteSpace:"nowrap", marginLeft:"auto" }}>
          {filtered.length} of {totalEmp}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="saem-card" style={{ overflow:"hidden" }}>
        {loading && employees.length===0 ? (
          <div style={{ padding:"60px 0", textAlign:"center", color:"#94a3b8", display:"flex", alignItems:"center", justifyContent:"center", gap:10, fontSize:13 }}>
            <SpinIcon/> Loading employees…
          </div>
        ) : filtered.length===0 ? (
          <div style={{ padding:"60px 0", textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:16, background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <Ic d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size={24} color="#cbd5e1"/>
            </div>
            <p style={{ fontSize:14, fontWeight:700, color:"#94a3b8", margin:0 }}>No employees found</p>
            <p style={{ fontSize:12, color:"#cbd5e1", margin:"4px 0 0" }}>
              {search||deptFilt!=="all"||statusFilt!=="all"?"Try different filters":"Add your first employee to get started"}
            </p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:C.navy }}>
                  {["Person","Department / Role","Person ID","Phone","Status","Actions (View · Edit · Send Creds · Del)"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"12px 16px", fontSize:10, fontWeight:700, color:"rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".08em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp,i)=>{
                  const isActive = statusOf(emp)==="ACTIVE";
                  const grad = AVATAR_GRADS[(emp.id||i) % AVATAR_GRADS.length];
                  return (
                    <tr key={emp.id||i} className="saem-row" style={{ borderBottom:`1px solid ${C.border}`, background:"transparent", transition:"background .15s" }}>
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                          <div style={{ width:38, height:38, borderRadius:11, background:grad, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13, flexShrink:0, fontFamily:"'Sora',sans-serif" }}>
                            {initials(emp)}
                          </div>
                          <div>
                            <p style={{ fontWeight:700, color:C.navy, margin:0, fontSize:13 }}>{displayName(emp)}</p>
                            <p style={{ fontSize:10, color:"#94a3b8", margin:0 }}>{emp.email||"—"}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        {emp.department&&<p style={{ fontWeight:600, color:C.navy, margin:0, fontSize:12 }}>{emp.department}</p>}
                        {emp.designation&&<p style={{ fontSize:10, color:"#94a3b8", margin:0 }}>{emp.designation}</p>}
                        {!emp.department&&!emp.designation&&<span style={{ color:"#cbd5e1" }}>—</span>}
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        {emp.employeeId
                          ? <span style={{ background:"rgba(99,102,241,.08)", color:C.purple, padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:700 }}>{emp.employeeId}</span>
                          : <span style={{ color:"#cbd5e1" }}>—</span>}
                      </td>
                      <td style={{ padding:"13px 16px", color:"#475569", fontSize:12 }}>{emp.phoneNumber||emp.phone||"—"}</td>
                      <td style={{ padding:"13px 16px" }}>
                        <button onClick={()=>handleToggle(emp)} title="Click to toggle" style={{
                          padding:"4px 12px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer", border:"none",
                          background:isActive?"rgba(16,185,129,.10)":"rgba(239,68,68,.08)",
                          color:isActive?C.green:C.red, transition:"all .15s",
                        }}>{isActive?"Active":"Inactive"}</button>
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          <button onClick={()=>setModal({mode:"view",emp})} style={{ padding:"6px 12px", borderRadius:9, border:`1.5px solid rgba(99,102,241,.3)`, background:"rgba(99,102,241,.07)", color:C.purple, fontSize:11, fontWeight:700, cursor:"pointer" }}>View</button>
                          <button onClick={()=>setModal({mode:"edit",emp})} style={{ padding:"6px 12px", borderRadius:9, border:`1.5px solid rgba(14,165,233,.3)`, background:"rgba(14,165,233,.07)", color:"#0ea5e9", fontSize:11, fontWeight:700, cursor:"pointer" }}>Edit</button>
                          {credSentMap[String(emp.id)]
                            ? <span style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:9, background:"rgba(16,185,129,.10)", color:C.green, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                                <Ic d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={11} sw={2.5} color={C.green}/> Sent ✓
                              </span>
                            : <button
                                onClick={()=>handleSendCredentials(emp)}
                                disabled={sendingCred===emp.id}
                                title="Send login credentials to employee's email"
                                style={{
                                  padding:"6px 12px", borderRadius:9,
                                  border:`1.5px solid rgba(16,185,129,.3)`,
                                  background:"rgba(16,185,129,.07)", color:C.green,
                                  fontSize:11, fontWeight:700,
                                  cursor:sendingCred===emp.id?"not-allowed":"pointer",
                                  opacity:sendingCred===emp.id?.7:1,
                                  display:"flex", alignItems:"center", gap:4,
                                }}>
                                {sendingCred===emp.id
                                  ? <SpinIcon/>
                                  : <Ic d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" size={11} sw={2}/>}
                                {sendingCred===emp.id ? "Sending…" : "Send Creds"}
                              </button>
                          }
                          <button onClick={()=>setDelConf(emp)} style={{ padding:"6px 12px", borderRadius:9, border:`1.5px solid rgba(239,68,68,.25)`, background:"rgba(239,68,68,.06)", color:C.red, fontSize:11, fontWeight:700, cursor:"pointer" }}>Del</button>
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
