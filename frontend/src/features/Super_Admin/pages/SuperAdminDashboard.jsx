import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/apiClient";

/* ── design tokens (matches admin dashboard) ── */
const C = {
  navy:"#0B1020", mid:"#182033", teal:"#06B6D4", coral:"#8B5CF6",
  purple:"#818cf8", amber:"#f59e0b", green:"#10b981", red:"#ef4444",
  bg:"#F4F6FB", border:"#EDF0F7",
};

/* ── SVG icon helper ── */
const Ic = ({ d, size=16, sw=1.8, color="currentColor" }) => (
  <svg width={size} height={size} fill="none" stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    {[].concat(d).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);

/* ── animated counter ── */
function Counter({ to, duration=800 }) {
  const [v, setV] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (!to) { setV(0); return; }
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setV(Math.round(to * (1 - Math.pow(1-p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [to]);
  return <>{v.toLocaleString("en-IN")}</>;
}

/* ── helpers ── */
const displayName = u =>
  u.firstName ? `${u.firstName} ${u.lastName||""}`.trim() : (u.name||u.username||u.email||"—");
const initials = u => {
  const n = displayName(u);
  return n.split(" ").filter(Boolean).map(w=>w[0]).join("").toUpperCase().slice(0,2)||"?";
};
const timeAgo = dateStr => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now()-d)/1000);
  if (diff<60) return "just now";
  if (diff<3600) return `${Math.floor(diff/60)}m ago`;
  if (diff<86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};

const DEPT_COLORS = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#06B6D4","#f97316","#64748b"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.sa-dash * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }
.sa-dash .fd { font-family:'Sora',sans-serif; }
@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
.sa-card { background:#fff; border-radius:16px; border:1px solid ${C.border}; box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.04); }
.sa-stat:hover { box-shadow:0 4px 24px rgba(0,0,0,.09); transform:translateY(-2px); }
.sa-stat { transition:all .2s; }
.sa-emp-row:hover { background:#f8fafc; }
.sa-quick:hover { transform:translateY(-3px); box-shadow:0 6px 20px rgba(0,0,0,.10); }
.sa-quick { transition:all .2s; cursor:pointer; }
`;

export default function SuperOperatorControlRoom({ navigateTo }) {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const companyName = localStorage.getItem("companyName") || "Workspace";
  const userName    = localStorage.getItem("firstName")   || "Operator";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/api/users/tenant");
      const list = Array.isArray(r.data) ? r.data
        : Array.isArray(r.data?.data) ? r.data.data : [];
      setUsers(list);
    } catch { setUsers([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* derived stats */
  const employees = users.filter(u => (u.role||"").toUpperCase()==="EMPLOYEE");
  const admins    = users.filter(u => {
    const r = (u.role||"").toUpperCase();
    return r==="ADMIN"||r==="COMPANY_ADMIN"||r==="SUPER_ADMIN";
  });
  const active   = employees.filter(u => (u.status||"ACTIVE").toUpperCase()==="ACTIVE");
  const inactive = employees.filter(u => (u.status||"").toUpperCase()==="INACTIVE");

  /* departments */
  const deptMap = {};
  employees.forEach(u => {
    const d = u.department||"Unassigned";
    deptMap[d] = (deptMap[d]||0)+1;
  });
  const depts = Object.entries(deptMap).sort((a,b)=>b[1]-a[1]);

  /* recent employees (last 5) */
  const recentEmps = [...employees]
    .sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
    .slice(0,5);

  const stats = [
    { label:"Total People", value:employees.length, icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", accent:"#6366f1", bg:"rgba(99,102,241,.10)" },
    { label:"Active Staff",    value:active.length,    icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", accent:C.green,  bg:"rgba(16,185,129,.10)" },
    { label:"Operators",          value:admins.length,    icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", accent:C.coral,  bg:"rgba(139,92,246,.10)" },
    { label:"Departments",     value:depts.length,     icon:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", accent:C.amber,  bg:"rgba(245,158,11,.10)" },
  ];

  const quickActions = [
    { label:"Add Person",   icon:"M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", color:"#6366f1", bg:"rgba(99,102,241,.10)", page:"sa_onboard" },
    { label:"Manage Operators",  icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color:C.coral, bg:"rgba(139,92,246,.10)", page:"sa_admins" },
    { label:"View Persons", icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color:C.green, bg:"rgba(16,185,129,.10)", page:"sa_team" },
    { label:"PeopleMap",      icon:"M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6", color:C.teal, bg:"rgba(6,182,212,.10)", page:"sa_org" },
    { label:"PeopleOps Vault",   icon:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color:C.amber, bg:"rgba(245,158,11,.10)", page:"sa_docs" },
    { label:"Playbook Vault",   icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", color:"#8b5cf6", bg:"rgba(139,92,246,.10)", page:"sa_policy" },
  ];

  return (
    <div className="sa-dash" style={{ background:C.bg, minHeight:"100vh", padding:"24px 28px" }}>
      <style>{CSS}</style>

      {/* ── Hero Header ── */}
      <div style={{
        background:`linear-gradient(135deg,${C.navy} 0%,${C.mid} 60%,#1a3a5c 100%)`,
        borderRadius:20, padding:"24px 28px", marginBottom:24,
        position:"relative", overflow:"hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position:"absolute", top:-40, right:80, width:180, height:180, borderRadius:"50%", background:"rgba(139,92,246,.08)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-30, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(6,182,212,.07)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,.45)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".12em", margin:"0 0 6px" }}>
              {companyName} · Super Ops Portal
            </p>
            <h1 className="fd" style={{ color:"#fff", fontSize:26, fontWeight:900, margin:"0 0 6px", letterSpacing:"-.02em" }}>
              Welcome back, {userName} 👋
            </h1>
            <p style={{ color:"rgba(255,255,255,.5)", fontSize:13, margin:0 }}>
              {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>navigateTo?.("sa_onboard")} style={{
              padding:"10px 20px", borderRadius:12,
              background:"linear-gradient(135deg,#8B5CF6,#FBBF24)",
              color:"#fff", border:"none", cursor:"pointer",
              fontSize:13, fontWeight:700,
              boxShadow:"0 4px 14px rgba(139,92,246,.35)",
              display:"flex", alignItems:"center", gap:7,
            }}>
              <Ic d="M12 4v16m8-8H4" size={14} sw={2.5}/> Add Person
            </button>
            <button onClick={()=>navigateTo?.("sa_admins")} style={{
              padding:"10px 20px", borderRadius:12,
              background:"rgba(255,255,255,.10)",
              color:"#fff", border:"1.5px solid rgba(255,255,255,.18)",
              cursor:"pointer", fontSize:13, fontWeight:700,
              display:"flex", alignItems:"center", gap:7,
            }}>
              <Ic d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size={14} sw={2}/> Manage Operators
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {stats.map((s,i) => (
          <div key={s.label} className="sa-card sa-stat" style={{ padding:"18px 20px", animation:`fadeUp .4s ease ${i*70}ms both` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ width:44, height:44, borderRadius:13, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ic d={s.icon} size={20} color={s.accent} sw={1.8}/>
              </div>
              {!loading && (
                <span style={{ fontSize:10, color:"#94a3b8", fontWeight:600, background:"#f8fafc", padding:"3px 8px", borderRadius:20 }}>
                  {s.label==="Active Staff" && employees.length>0
                    ? `${Math.round(active.length/employees.length*100)}%` : ""}
                </span>
              )}
            </div>
            <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 4px" }}>{s.label}</p>
            <p className="fd" style={{ fontSize:30, fontWeight:900, color:C.navy, margin:0, letterSpacing:"-.02em" }}>
              {loading ? <span style={{ color:"#e2e8f0" }}>—</span> : <Counter to={s.value}/>}
            </p>
          </div>
        ))}
      </div>

      {/* ── Middle Row: Quick Actions + Dept Breakdown ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:20, marginBottom:20 }}>

        {/* Quick Actions */}
        <div className="sa-card" style={{ padding:"20px 22px" }}>
          <p className="fd" style={{ fontSize:14, fontWeight:800, color:C.navy, margin:"0 0 16px" }}>Quick Actions</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {quickActions.map(q => (
              <div key={q.label} className="sa-quick sa-card" onClick={()=>navigateTo?.(q.page)} style={{
                padding:"16px 14px", textAlign:"center", border:`1px solid ${C.border}`,
                borderRadius:14,
              }}>
                <div style={{ width:44, height:44, borderRadius:13, background:q.bg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
                  <Ic d={q.icon} size={20} color={q.color} sw={1.8}/>
                </div>
                <p style={{ fontSize:12, fontWeight:700, color:C.navy, margin:0, lineHeight:1.3 }}>{q.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="sa-card" style={{ padding:"20px 22px" }}>
          <p className="fd" style={{ fontSize:14, fontWeight:800, color:C.navy, margin:"0 0 4px" }}>Departments</p>
          <p style={{ fontSize:11, color:"#94a3b8", fontWeight:600, margin:"0 0 16px" }}>{depts.length} departments · {employees.length} staff</p>
          {loading ? (
            <div style={{ textAlign:"center", padding:"20px 0", color:"#cbd5e1", fontSize:13 }}>Loading…</div>
          ) : depts.length === 0 ? (
            <div style={{ textAlign:"center", padding:"20px 0", color:"#94a3b8", fontSize:13 }}>No departments yet</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {depts.slice(0,6).map(([dept,cnt],i)=>{
                const pct = employees.length>0 ? Math.round(cnt/employees.length*100) : 0;
                const [w, setW] = [0, ()=>{}]; // handled below
                return (
                  <DeptBar key={dept} dept={dept} cnt={cnt} pct={pct} color={DEPT_COLORS[i%DEPT_COLORS.length]}/>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row: Recent Persons + Overview ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>

        {/* Recent Persons */}
        <div className="sa-card" style={{ padding:"20px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <p className="fd" style={{ fontSize:14, fontWeight:800, color:C.navy, margin:0 }}>Recent Persons</p>
            <button onClick={()=>navigateTo?.("sa_team")} style={{
              fontSize:11, fontWeight:700, color:C.coral, background:"rgba(139,92,246,.06)",
              border:"1px solid rgba(139,92,246,.15)", borderRadius:8, padding:"5px 12px", cursor:"pointer",
            }}>View All →</button>
          </div>
          {loading ? (
            <div style={{ textAlign:"center", padding:"20px 0", color:"#cbd5e1", fontSize:13 }}>Loading…</div>
          ) : recentEmps.length===0 ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ width:48, height:48, borderRadius:14, background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
                <Ic d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size={20} color="#cbd5e1"/>
              </div>
              <p style={{ fontSize:13, color:"#94a3b8", margin:0 }}>No employees yet</p>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  {["Person","Department","Status","Joined"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEmps.map(emp => {
                  const isActive = (emp.status||"ACTIVE").toUpperCase()==="ACTIVE";
                  return (
                    <tr key={emp.id} className="sa-emp-row" style={{ borderBottom:`1px solid ${C.border}`, transition:"background .15s" }}>
                      <td style={{ padding:"11px 10px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12, flexShrink:0 }}>
                            {initials(emp)}
                          </div>
                          <div>
                            <p style={{ fontWeight:700, color:C.navy, margin:0, fontSize:13 }}>{displayName(emp)}</p>
                            <p style={{ fontSize:10, color:"#94a3b8", margin:0 }}>{emp.employeeId||""}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"11px 10px", color:"#475569", fontSize:12 }}>{emp.department||"—"}</td>
                      <td style={{ padding:"11px 10px" }}>
                        <span style={{
                          padding:"3px 9px", borderRadius:20, fontSize:10, fontWeight:700,
                          background:isActive?"rgba(16,185,129,.10)":"rgba(239,68,68,.08)",
                          color:isActive?C.green:C.red,
                        }}>{isActive?"Active":"Inactive"}</span>
                      </td>
                      <td style={{ padding:"11px 10px", color:"#94a3b8", fontSize:11 }}>{timeAgo(emp.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Overview Card */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Workforce Overview */}
          <div className="sa-card" style={{ padding:"20px 22px" }}>
            <p className="fd" style={{ fontSize:14, fontWeight:800, color:C.navy, margin:"0 0 16px" }}>Workforce Overview</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <OverviewRow label="Active Persons" value={active.length} total={employees.length} color={C.green}/>
              <OverviewRow label="Inactive" value={inactive.length} total={employees.length} color={C.red}/>
              <OverviewRow label="Operators" value={admins.length} total={users.length} color={C.coral}/>
            </div>
          </div>

          {/* Operator Summary */}
          <div className="sa-card" style={{ padding:"20px 22px", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <p className="fd" style={{ fontSize:14, fontWeight:800, color:C.navy, margin:0 }}>Operator Team</p>
              <button onClick={()=>navigateTo?.("sa_admins")} style={{
                fontSize:11, fontWeight:700, color:C.coral, background:"rgba(139,92,246,.06)",
                border:"1px solid rgba(139,92,246,.15)", borderRadius:8, padding:"5px 12px", cursor:"pointer",
              }}>Manage →</button>
            </div>
            {admins.length===0 ? (
              <p style={{ fontSize:12, color:"#94a3b8", textAlign:"center", padding:"12px 0" }}>No admins found</p>
            ) : admins.slice(0,4).map(a => (
              <div key={a.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#8B5CF6,#FBBF24)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:11, flexShrink:0 }}>
                  {initials(a)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, color:C.navy, margin:0, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{displayName(a)}</p>
                  <p style={{ fontSize:10, color:"#94a3b8", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.email||"—"}</p>
                </div>
                <span style={{ fontSize:9, fontWeight:700, background:"rgba(139,92,246,.08)", color:C.coral, padding:"2px 7px", borderRadius:20, flexShrink:0 }}>
                  Operator
                </span>
              </div>
            ))}
            {admins.length>4&&<p style={{ fontSize:11, color:"#94a3b8", textAlign:"center", marginTop:8, marginBottom:0 }}>+{admins.length-4} more</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* sub-components */
function DeptBar({ dept, cnt, pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(Math.max(pct,2)), 200);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:12, fontWeight:600, color:"#475569", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"60%" }}>{dept}</span>
        <span style={{ fontSize:12, fontWeight:800, color:"#0f172a", fontFamily:"'Sora',sans-serif" }}>{cnt} <span style={{ fontSize:10, color:"#94a3b8", fontWeight:500 }}>({pct}%)</span></span>
      </div>
      <div style={{ height:7, background:"#f1f5f9", borderRadius:999, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`, background:color, borderRadius:999, transition:"width 1s cubic-bezier(.34,1.56,.64,1)" }}/>
      </div>
    </div>
  );
}

function OverviewRow({ label, value, total, color }) {
  const pct = total>0 ? Math.round(value/total*100) : 0;
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(Math.max(pct,2)), 300);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:12, fontWeight:600, color:"#475569" }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:800, color:"#0f172a", fontFamily:"'Sora',sans-serif" }}>{value}</span>
      </div>
      <div style={{ height:6, background:"#f1f5f9", borderRadius:999, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`, background:color, borderRadius:999, transition:"width 1s cubic-bezier(.34,1.56,.64,1)" }}/>
      </div>
    </div>
  );
}
