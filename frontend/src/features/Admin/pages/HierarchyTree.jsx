import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import api from "@/lib/apiClient";

/* ── design tokens ── */
const T = {
  navy:"#0B1020", mid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F8FAFC", card:"#ffffff", border:"#E2E8F0",
  text:"#1e293b", muted:"#64748b", faint:"#94a3b8",
};

/* ── role visual config ── */
const ROLE_CFG = {
  CEO:           { grad:"linear-gradient(135deg,#8B5CF6,#FF9A00)", dot:"#8B5CF6", light:"rgba(139,92,246,.08)",  text:"#C2410C" },
  "Co-Founder":  { grad:"linear-gradient(135deg,#A855F7,#A855F7)", dot:"#A855F7", light:"rgba(124,58,237,.08)", text:"#5B21B6" },
  CTO:           { grad:"linear-gradient(135deg,#0284C7,#38BDF8)", dot:"#0284C7", light:"rgba(2,132,199,.08)",   text:"#075985" },
  CFO:           { grad:"linear-gradient(135deg,#059669,#34D399)", dot:"#059669", light:"rgba(5,150,105,.08)",   text:"#065F46" },
  COO:           { grad:"linear-gradient(135deg,#D97706,#FBBF24)", dot:"#D97706", light:"rgba(217,119,6,.08)",   text:"#92400E" },
  VP:            { grad:"linear-gradient(135deg,#DB2777,#F472B6)", dot:"#DB2777", light:"rgba(219,39,119,.08)",  text:"#9D174D" },
  Director:      { grad:"linear-gradient(135deg,#4F46E5,#818CF8)", dot:"#4F46E5", light:"rgba(79,70,229,.08)",   text:"#3730A3" },
  Manager:       { grad:"linear-gradient(135deg,#0D9488,#2DD4BF)", dot:"#0D9488", light:"rgba(13,148,136,.08)",  text:"#0F766E" },
  "Team Lead":   { grad:"linear-gradient(135deg,#6366F1,#A5B4FC)", dot:"#6366F1", light:"rgba(99,102,241,.08)",  text:"#4338CA" },
  "Team Member": { grad:"linear-gradient(135deg,#475569,#94A3B8)", dot:"#475569", light:"rgba(71,85,105,.08)",   text:"#334155" },
};
const rc = role => ROLE_CFG[role] || { grad:`linear-gradient(135deg,#0B1020,#374151)`, dot:"#0B1020", light:"rgba(13,31,45,.06)", text:"#0B1020" };

/* ── layout ── */
const NW=216, NH=190, HG=44, VG=64;

function subtreeW(node) {
  if (!node?.children?.length) return NW;
  const tot = node.children.reduce((s,c)=>s+subtreeW(c),0) + HG*(node.children.length-1);
  return Math.max(NW, tot);
}
function layout(node, x, y, out) {
  const w = subtreeW(node);
  out[node.id] = { x: x+(w-NW)/2, y };
  if (node.children?.length) {
    let cx = x;
    node.children.forEach(c => { layout(c, cx, y+NH+VG, out); cx += subtreeW(c)+HG; });
  }
}
function canvasDims(pos) {
  let mx=0, my=0;
  Object.values(pos).forEach(p => { mx=Math.max(mx,p.x+NW); my=Math.max(my,p.y+NH); });
  return { w:mx+80, h:my+80 };
}
function collectConn(node, pos, out) {
  const pp = pos[node.id]; if(!pp) return;
  node.children?.forEach(c => {
    const cp = pos[c.id];
    if (cp) out.push({ fx:pp.x+NW/2, fy:pp.y+NH, tx:cp.x+NW/2, ty:cp.y });
    collectConn(c, pos, out);
  });
}
function flatten(node, depth=0, acc=[]) {
  if (!node) return acc;
  acc.push({...node, depth});
  node.children?.forEach(c => flatten(c, depth+1, acc));
  return acc;
}
function filterTree(node, pred) {
  if (!node) return null;
  const fc = (node.children||[]).map(c=>filterTree(c,pred)).filter(Boolean);
  if (pred(node)||fc.length>0) return {...node, children:fc};
  return null;
}
const initials = name => {
  if (!name) return "?";
  const p = name.trim().split(/\s+/);
  return (p[0]?.[0]+(p[1]?.[0]||"")).toUpperCase();
};

/* ── api ── */
const call = async (method, path, body) => {
  try {
    const res = body
      ? await { POST:api.post, PUT:api.put }[method](path, body)
      : await { GET:api.get, DELETE:api.delete }[method](path);
    return { ok:true, data:res.data?.data??res.data };
  } catch(e) { return { ok:false, msg:e.response?.data?.message||e.message }; }
};

/* ── NodeCard ── */
const NodeCard = ({ node, pos, canEdit, onAdd, onEdit, onDelete, dimmed }) => {
  const cfg = rc(node.role);
  return (
    <div style={{ position:"absolute", left:pos.x, top:pos.y, width:NW,
      opacity:dimmed?0.22:1, transition:"opacity .2s", fontFamily:"'Inter',sans-serif" }}>
      <div style={{
        background:T.card, borderRadius:18,
        border:`1.5px solid ${T.border}`,
        boxShadow:"0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.07)",
        overflow:"hidden",
        transition:"box-shadow .2s, transform .2s",
      }}
        onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,.13)"; e.currentTarget.style.transform="translateY(-2px)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.07)"; e.currentTarget.style.transform=""; }}
      >
        {/* top accent bar */}
        <div style={{ height:5, background:cfg.grad }}/>
        <div style={{ padding:"16px 14px 14px", textAlign:"center" }}>
          {/* avatar */}
          <div style={{
            width:54, height:54, borderRadius:"50%",
            background:cfg.grad, margin:"0 auto 11px",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:17, fontWeight:800, color:"#fff",
            fontFamily:"'Sora',sans-serif",
            boxShadow:`0 3px 12px ${cfg.dot}55`,
            overflow:"hidden", flexShrink:0,
          }}>
            {node.photo
              ? <img src={node.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : initials(node.name)}
          </div>

          {/* role badge */}
          <div style={{
            display:"inline-flex", alignItems:"center",
            background:cfg.light, color:cfg.text,
            border:`1px solid ${cfg.dot}30`,
            borderRadius:999, padding:"2px 10px",
            fontSize:9, fontWeight:800, letterSpacing:".1em",
            fontFamily:"'Sora',sans-serif", marginBottom:7,
            textTransform:"uppercase",
          }}>{node.role}</div>

          {/* name */}
          <div style={{
            fontSize:13, fontWeight:700, color:T.text,
            fontFamily:"'Sora',sans-serif", lineHeight:1.35, marginBottom:2,
            overflow:"hidden", textOverflow:"ellipsis",
            display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical",
          }}>{node.name}</div>

          {/* designation */}
          {node.designation && (
            <div style={{ fontSize:10, color:T.muted, fontWeight:500, marginBottom:5,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {node.designation}
            </div>
          )}

          {/* department */}
          {node.department && (
            <div style={{
              display:"inline-flex", background:"#F1F5F9", borderRadius:6,
              padding:"2px 8px", fontSize:9, fontWeight:600, color:"#475569",
              marginBottom:7, letterSpacing:".04em",
            }}>{node.department}</div>
          )}

          {/* reports count */}
          {node.children?.length > 0 && (
            <div style={{ fontSize:10, color:T.faint, marginBottom:4 }}>
              {node.children.length} direct report{node.children.length!==1?"s":""}
            </div>
          )}

          {/* actions */}
          {canEdit && (
            <div style={{ display:"flex", gap:5, justifyContent:"center", marginTop:9, flexWrap:"wrap" }}>
              <button onMouseDown={e=>e.stopPropagation()} onClick={()=>onAdd(node)} style={btnStyle("#0D9488","rgba(13,148,136,.08)")}>＋ Add</button>
              <button onMouseDown={e=>e.stopPropagation()} onClick={()=>onEdit(node)} style={btnStyle("#8B5CF6","rgba(139,92,246,.08)")}>✎ Edit</button>
              <button onMouseDown={e=>e.stopPropagation()} onClick={()=>onDelete(node)} style={btnStyle("#EF4444","rgba(239,68,68,.07)")}>✕ Del</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const btnStyle = (color, bg) => ({
  padding:"4px 10px", borderRadius:7,
  border:`1.5px solid ${color}40`,
  background:bg, color,
  fontSize:10, fontWeight:700, cursor:"pointer",
  fontFamily:"'DM Sans',sans-serif", transition:"all .15s",
  lineHeight:1.4,
});

/* ── Modal ── */
const Modal = ({ title, subtitle, onClose, children }) => (
  <div style={{
    position:"fixed", inset:0, background:"rgba(15,23,42,.6)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:99999, padding:20,
  }} onClick={onClose}>
    <div style={{
      background:"#fff", borderRadius:22, width:"100%", maxWidth:440,
      boxShadow:"0 32px 80px rgba(0,0,0,.28)", overflow:"hidden",
    }} onClick={e=>e.stopPropagation()}>
      <div style={{ background:`linear-gradient(135deg,${T.navy},${T.mid})`, padding:"20px 24px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
          <div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:900, color:"#fff", marginBottom:2 }}>{title}</div>
            {subtitle && <div style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.12)", border:"none", color:"#fff", width:30, height:30, borderRadius:9, cursor:"pointer", fontSize:14, flexShrink:0 }}>✕</button>
        </div>
      </div>
      <div style={{ padding:"22px 24px" }}>{children}</div>
    </div>
  </div>
);

const Fld = ({label, children}) => (
  <div style={{marginBottom:14}}>
    <label style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:5}}>{label}</label>
    {children}
  </div>
);
const Inp = ({value, onChange, placeholder, style={}}) => (
  <input value={value} onChange={onChange} placeholder={placeholder} style={{
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:10, padding:"10px 13px",
    fontSize:13, color:T.text, outline:"none", boxSizing:"border-box",
    fontFamily:"'DM Sans',sans-serif", background:"#fff", ...style,
  }}/>
);
const Sel = ({value, onChange, children, style={}}) => (
  <select value={value} onChange={onChange} style={{
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:10, padding:"10px 13px",
    fontSize:13, color:value?"#1e293b":"#94a3b8", outline:"none", boxSizing:"border-box",
    fontFamily:"'DM Sans',sans-serif", background:"#fff", cursor:"pointer", ...style,
  }}>{children}</select>
);
const PrimaryBtn = ({onClick, label, disabled}) => (
  <button onClick={onClick} disabled={disabled} style={{
    width:"100%", padding:"12px", borderRadius:11,
    background:disabled?"#e2e8f0":`linear-gradient(135deg,${T.coral},#FBBF24)`,
    color:disabled?T.faint:"#fff", border:"none", fontSize:13, fontWeight:800,
    cursor:disabled?"not-allowed":"pointer", fontFamily:"'Sora',sans-serif",
    boxShadow:disabled?"none":"0 4px 16px rgba(139,92,246,.3)",
    transition:"all .2s",
  }}>{label}</button>
);

/* ── filter pill ── */
const FPill = ({label, active, onClick}) => (
  <button onClick={onClick} style={{
    padding:"6px 14px", borderRadius:20,
    border:`1.5px solid ${active?T.coral:T.border}`,
    background:active?"rgba(139,92,246,.08)":"#fff",
    color:active?T.coral:T.muted,
    fontSize:11, fontWeight:active?700:500, cursor:"pointer",
    fontFamily:"'DM Sans',sans-serif", transition:"all .15s",
    whiteSpace:"nowrap",
  }}>{label}</button>
);

/* ══════════════════════════════ MAIN COMPONENT ══════════════════════════════ */
export default function PeopleMapTree({ canEdit = true }) {
  const [tree,     setTree]    = useState(null);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState("");

  /* pan / zoom */
  const [scale, setScale]      = useState(0.78);
  const [pan,   setPan]        = useState({ x:80, y:60 });
  const dragging               = useRef(false);
  const dragOrigin             = useRef({mx:0,my:0,px:0,py:0});
  const containerRef           = useRef(null);

  /* filters */
  const [search,     setSearch]     = useState("");
  const [levelFilt,  setLevelFilt]  = useState("");
  const [deptFilt,   setDeptFilt]   = useState("");

  /* modals */
  const [addModal,   setAddModal]   = useState(null);
  const [editModal,  setEditModal]  = useState(null);
  const [delModal,   setDelModal]   = useState(null);
  const [rootModal,  setRootModal]  = useState(false);
  const [form,       setForm]       = useState({});
  const [saving,     setSaving]     = useState(false);

  /* ── load ── */
  const load = useCallback(async () => {
    setLoading(true); setError("");
    const r = await call("GET", "/api/hierarchy/root");
    if (r.ok) setTree(r.data||null);
    else if (!r.msg||r.msg.includes("404")||r.msg.includes("not found")) setTree(null);
    else setError(r.msg);
    setLoading(false);
  }, []);
  useEffect(()=>{ load(); },[load]);

  /* ── layout ── */
  const positions = useMemo(()=>{ if(!tree) return {}; const o={}; layout(tree,40,40,o); return o; },[tree]);
  const dims      = useMemo(()=>canvasDims(positions),[positions]);
  const conns     = useMemo(()=>{ if(!tree) return []; const o=[]; collectConn(tree,positions,o); return o; },[tree,positions]);

  /* ── derive unique roles & depts from tree ── */
  const allNodes = useMemo(()=>flatten(tree),[tree]);
  const uniqueRoles = useMemo(()=>[...new Set(allNodes.map(n=>n.role).filter(Boolean))],[allNodes]);
  const uniqueDepts = useMemo(()=>[...new Set(allNodes.map(n=>n.department).filter(Boolean))],[allNodes]);

  /* ── filter ── */
  const filterActive = Boolean(search||levelFilt||deptFilt);
  const pred = n =>
    (!search || (n.name||"").toLowerCase().includes(search.toLowerCase()) || (n.designation||"").toLowerCase().includes(search.toLowerCase())) &&
    (!levelFilt || n.role===levelFilt) &&
    (!deptFilt  || n.department===deptFilt);

  const displayTree = useMemo(()=>{
    if (!filterActive) return tree;
    return filterTree(tree, pred);
  },[tree, search, levelFilt, deptFilt, filterActive]);

  const dispPos  = useMemo(()=>{ if(!displayTree) return {}; const o={}; layout(displayTree,40,40,o); return o; },[displayTree]);
  const dispDims = useMemo(()=>canvasDims(dispPos),[dispPos]);
  const dispConn = useMemo(()=>{ if(!displayTree) return []; const o=[]; collectConn(displayTree,dispPos,o); return o; },[displayTree,dispPos]);
  const dispNodes = useMemo(()=>flatten(displayTree),[displayTree]);

  /* ── zoom/pan ── */
  const onWheel = useCallback(e => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect(); if(!rect) return;
    const mx=e.clientX-rect.left, my=e.clientY-rect.top;
    const d = e.deltaY<0 ? 1.12 : 0.89;
    setScale(prev => {
      const ns = Math.min(3,Math.max(0.12,prev*d));
      const r  = ns/prev;
      setPan(p=>({x:mx-r*(mx-p.x),y:my-r*(my-p.y)}));
      return ns;
    });
  },[]);

  const onMD = useCallback(e => {
    if(e.button!==0||e.target.closest("button")||e.target.closest("input")||e.target.closest("select")) return;
    dragging.current=true;
    dragOrigin.current={mx:e.clientX,my:e.clientY,px:pan.x,py:pan.y};
    e.currentTarget.style.cursor="grabbing";
  },[pan]);
  const onMM = useCallback(e => {
    if(!dragging.current) return;
    setPan({x:dragOrigin.current.px+(e.clientX-dragOrigin.current.mx), y:dragOrigin.current.py+(e.clientY-dragOrigin.current.my)});
  },[]);
  const onMU = useCallback(e => {
    dragging.current=false;
    if(containerRef.current) containerRef.current.style.cursor="grab";
  },[]);

  useEffect(()=>{
    const el=containerRef.current; if(!el) return;
    el.addEventListener("wheel",onWheel,{passive:false});
    return ()=>el.removeEventListener("wheel",onWheel);
  },[onWheel]);

  const zoomIn  = () => setScale(s=>Math.min(3,+(s*1.2).toFixed(2)));
  const zoomOut = () => setScale(s=>Math.max(0.12,+(s*.83).toFixed(2)));
  const fitAll  = useCallback(()=>{
    if(!containerRef.current||!dispDims.w) return;
    const {clientWidth:cw,clientHeight:ch}=containerRef.current;
    const ns=Math.min(0.95,Math.min(cw/(dispDims.w+80),ch/(dispDims.h+80)));
    setScale(ns); setPan({x:(cw-dispDims.w*ns)/2,y:40});
  },[dispDims]);

  /* ── create root ── */
  const createRoot = async () => {
    if(!form.name?.trim()||!form.role) return;
    setSaving(true);
    const r=await call("POST","/api/hierarchy/root",form);
    if(r.ok){await load();setRootModal(false);}
    else alert(r.msg||"Failed");
    setSaving(false);
  };

  /* ── add child ── */
  const submitAdd = async () => {
    if(!form.name?.trim()||!form.role) return;
    setSaving(true);
    const r=await call("POST",`/api/hierarchy/${addModal.parentNode.id}/children`,form);
    if(r.ok){await load();setAddModal(null);}
    else alert(r.msg||"Failed");
    setSaving(false);
  };

  /* ── edit ── */
  const submitEdit = async () => {
    if(!form.name?.trim()) return;
    setSaving(true);
    const r=await call("PUT",`/api/hierarchy/${editModal.id}`,form);
    if(r.ok){await load();setEditModal(null);}
    else alert(r.msg||"Failed");
    setSaving(false);
  };

  /* ── delete ── */
  const submitDelete = async () => {
    setSaving(true);
    const r=await call("DELETE",`/api/hierarchy/${delModal.id}`);
    if(r.ok){await load();setDelModal(null);}
    else alert(r.msg||"Failed to delete");
    setSaving(false);
  };

  const openAdd  = n => { setForm({name:"",role:"",designation:"",department:""}); setAddModal({parentNode:n}); };
  const openEdit = n => { setForm({name:n.name,role:n.role,designation:n.designation||"",department:n.department||"",photo:n.photo||""}); setEditModal(n); };
  const openDel  = n => setDelModal(n);

  /* ── all roles for "add child" (existing + standard) ── */
  const ALL_ROLES = ["CEO","Co-Founder","CTO","CFO","COO","VP","Director","Manager","Team Lead","Team Member"];
  const dynamicRoles = useMemo(()=>[...new Set([...uniqueRoles,...ALL_ROLES])],[uniqueRoles]);

  /* ── role count stats ── */
  const roleCounts = useMemo(()=>{
    const m={};
    allNodes.forEach(n=>{ m[n.role]=(m[n.role]||0)+1; });
    return m;
  },[allNodes]);

  /* ─────────── RENDER ─────────── */
  if(loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg,flexDirection:"column",gap:12}}>
      <div style={{width:38,height:38,borderRadius:"50%",border:`3px solid ${T.border}`,borderTopColor:T.coral,animation:"spin .7s linear infinite"}}/>
      <p style={{color:T.faint,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Loading org chart…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if(error) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg,flexDirection:"column",gap:12}}>
      <p style={{color:"#ef4444",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{error}</p>
      <button onClick={load} style={{padding:"8px 18px",borderRadius:9,border:`1.5px solid ${T.coral}`,background:"rgba(139,92,246,.08)",color:T.coral,fontSize:12,fontWeight:700,cursor:"pointer"}}>Retry</button>
    </div>
  );

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.bg,fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        input::placeholder{color:#94a3b8;}
        select option{color:#1e293b!important;background:#fff!important;}
      `}</style>

      {/* ─── TOPBAR ─── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy} 0%,${T.mid} 100%)`,
        padding:"14px 24px", flexShrink:0,
        display:"flex", alignItems:"center", gap:16,
        borderBottom:"1px solid rgba(255,255,255,.06)",
      }}>
        <div>
          <p style={{fontSize:10,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".14em",marginBottom:2}}>CrewSync · Network</p>
          <h1 style={{fontSize:18,fontWeight:900,color:"#fff",margin:0,fontFamily:"'Sora',sans-serif",letterSpacing:"-.01em"}}>PeopleMap</h1>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          {canEdit && !tree && (
            <button onClick={()=>{setForm({name:"",role:"CEO",designation:"",department:""});setRootModal(true);}} style={{
              padding:"8px 18px",borderRadius:10,
              background:`linear-gradient(135deg,${T.coral},#FBBF24)`,
              color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 14px rgba(139,92,246,.35)",
            }}>＋ Create Root Node</button>
          )}
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",background:"rgba(255,255,255,.07)",padding:"5px 12px",borderRadius:8}}>
            {allNodes.length} members
          </div>
        </div>
      </div>

      {/* ─── FILTER BAR ─── */}
      <div style={{
        background:"#fff", borderBottom:`1px solid ${T.border}`,
        padding:"10px 24px", flexShrink:0,
        display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
      }}>
        {/* search */}
        <div style={{position:"relative",minWidth:220}}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.5}
            style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
            <circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or title…"
            style={{paddingLeft:32,paddingRight:12,paddingTop:8,paddingBottom:8,border:`1.5px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.text,outline:"none",width:"100%",fontFamily:"'DM Sans',sans-serif"}}/>
        </div>

        {/* level filter pills */}
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          <FPill label="All Levels" active={!levelFilt} onClick={()=>setLevelFilt("")}/>
          {uniqueRoles.map(role=>(
            <FPill key={role} label={role} active={levelFilt===role} onClick={()=>setLevelFilt(l=>l===role?"":role)}/>
          ))}
        </div>

        {/* dept filter */}
        {uniqueDepts.length>0 && (
          <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:11,color:T.faint,fontWeight:600}}>Dept:</span>
            <select value={deptFilt} onChange={e=>setDeptFilt(e.target.value)} style={{
              padding:"6px 10px",borderRadius:9,border:`1.5px solid ${T.border}`,
              background:"#fff",color:deptFilt?T.text:T.faint,fontSize:12,outline:"none",
              fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
            }}>
              <option value="">All Departments</option>
              {uniqueDepts.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        {/* stats chips */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginLeft:uniqueDepts.length>0?"8px":"auto"}}>
          {Object.entries(roleCounts).map(([role,cnt])=>{
            const cfg=rc(role);
            return (
              <div key={role} style={{display:"flex",alignItems:"center",gap:5,background:"#F8FAFC",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 10px"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:cfg.dot,flexShrink:0}}/>
                <span style={{fontSize:10,color:T.muted,fontWeight:600}}>{role}</span>
                <span style={{fontSize:10,fontWeight:800,color:T.text}}>{cnt}</span>
              </div>
            );
          })}
        </div>

        {filterActive && (
          <button onClick={()=>{setSearch("");setLevelFilt("");setDeptFilt("");}} style={{
            padding:"6px 12px",borderRadius:8,border:`1.5px solid rgba(239,68,68,.3)`,
            background:"rgba(239,68,68,.07)",color:"#EF4444",fontSize:11,fontWeight:700,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",
          }}>✕ Clear filters</button>
        )}
      </div>

      {/* ─── CANVAS ─── */}
      <div style={{flex:1,position:"relative",overflow:"hidden",background:T.bg}}>

        {!displayTree ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:16}}>
            <div style={{fontSize:52,filter:"grayscale(.3)"}}>🏢</div>
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:18,fontWeight:800,color:T.text,margin:"0 0 6px",fontFamily:"'Sora',sans-serif"}}>
                {filterActive ? "No results match your filters" : "No org chart yet"}
              </p>
              <p style={{fontSize:13,color:T.muted,margin:0}}>
                {filterActive ? "Try clearing your filters" : canEdit ? "Create the root node to get started" : "The org chart hasn't been set up yet"}
              </p>
            </div>
            {filterActive && (
              <button onClick={()=>{setSearch("");setLevelFilt("");setDeptFilt("");}} style={{padding:"9px 20px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>Clear Filters</button>
            )}
          </div>
        ) : (
          <div ref={containerRef}
            style={{width:"100%",height:"100%",cursor:"grab",userSelect:"none",overflow:"hidden",position:"relative"}}
            onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}>

            {/* subtle dot grid background */}
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:.4}}>
              <defs>
                <pattern id="dots" width={28} height={28} patternUnits="userSpaceOnUse">
                  <circle cx={2} cy={2} r={1} fill="#CBD5E1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>

            <div style={{
              position:"absolute",
              transformOrigin:"0 0",
              transform:`translate(${pan.x}px,${pan.y}px) scale(${scale})`,
              width:dispDims.w, height:dispDims.h,
            }}>
              {/* SVG connections */}
              <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"visible",pointerEvents:"none"}}>
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill={T.border}/>
                  </marker>
                </defs>
                {dispConn.map((c,i)=>{
                  const my=(c.fy+c.ty)/2;
                  return (
                    <path key={i}
                      d={`M${c.fx},${c.fy} C${c.fx},${my} ${c.tx},${my} ${c.tx},${c.ty}`}
                      fill="none" stroke="#CBD5E1" strokeWidth={2}
                    />
                  );
                })}
              </svg>

              {/* nodes */}
              {dispNodes.map(node=>(
                <NodeCard key={node.id}
                  node={node}
                  pos={dispPos[node.id]||{x:0,y:0}}
                  canEdit={canEdit}
                  onAdd={openAdd}
                  onEdit={openEdit}
                  onDelete={openDel}
                  dimmed={filterActive && !pred(node) && !dispPos[node.id]}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── ZOOM CONTROLS ─── */}
        {displayTree && (
          <div style={{
            position:"absolute",bottom:24,right:24,
            background:"#fff",borderRadius:14,padding:"6px",
            boxShadow:"0 4px 20px rgba(0,0,0,.12)",border:`1px solid ${T.border}`,
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,
          }}>
            <ZBtn onClick={zoomIn} title="Zoom In">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14"/></svg>
            </ZBtn>
            <div style={{fontSize:10,fontWeight:700,color:T.muted,padding:"4px 2px",minWidth:38,textAlign:"center"}}>
              {Math.round(scale*100)}%
            </div>
            <ZBtn onClick={zoomOut} title="Zoom Out">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14"/></svg>
            </ZBtn>
            <div style={{height:1,background:T.border,width:"100%",margin:"2px 0"}}/>
            <ZBtn onClick={fitAll} title="Fit to screen">
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M8 21H5a2 2 0 01-2-2v-3M16 3h3a2 2 0 012 2v3M16 21h3a2 2 0 002-2v-3"/>
              </svg>
            </ZBtn>
          </div>
        )}

        {/* ─── HELP TIP ─── */}
        {displayTree && (
          <div style={{position:"absolute",bottom:24,left:24,background:"rgba(255,255,255,.9)",backdropFilter:"blur(8px)",borderRadius:10,padding:"8px 14px",border:`1px solid ${T.border}`,boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
            <p style={{fontSize:10,color:T.faint,margin:0,fontWeight:500}}>🖱 Scroll to zoom · Drag to pan</p>
          </div>
        )}
      </div>

      {/* ─── CREATE ROOT MODAL ─── */}
      {rootModal && (
        <Modal title="Create Root Node" subtitle="This will be the top of your org chart" onClose={()=>setRootModal(false)}>
          <Fld label="Full Name"><Inp value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. John Smith"/></Fld>
          <Fld label="Role">
            <Sel value={form.role||""} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              {["CEO","Co-Founder","CTO","CFO","COO","VP","Director"].map(r=><option key={r} value={r}>{r}</option>)}
            </Sel>
          </Fld>
          <Fld label="Title / Designation"><Inp value={form.designation||""} onChange={e=>setForm(f=>({...f,designation:e.target.value}))} placeholder="e.g. Chief Executive Officer"/></Fld>
          <Fld label="Department"><Inp value={form.department||""} onChange={e=>setForm(f=>({...f,department:e.target.value}))} placeholder="e.g. Executive"/></Fld>
          <div style={{marginTop:4}}><PrimaryBtn onClick={createRoot} disabled={saving||!form.name||!form.role} label={saving?"Creating…":"Create Root Node"}/></div>
        </Modal>
      )}

      {/* ─── ADD CHILD MODAL ─── */}
      {addModal && (
        <Modal title="Add Team Member" subtitle={`Reporting to ${addModal.parentNode.name}`} onClose={()=>setAddModal(null)}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:T.bg,borderRadius:10,marginBottom:16}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:rc(addModal.parentNode.role).grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",fontFamily:"'Sora',sans-serif",flexShrink:0}}>
              {initials(addModal.parentNode.name)}
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:T.text}}>{addModal.parentNode.name}</div>
              <div style={{fontSize:10,color:T.faint}}>{addModal.parentNode.role}{addModal.parentNode.designation?` · ${addModal.parentNode.designation}`:""}</div>
            </div>
          </div>
          <Fld label="Full Name"><Inp value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name"/></Fld>
          <Fld label="Role / Level">
            <Sel value={form.role||""} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              <option value="">Select role…</option>
              {dynamicRoles.map(r=><option key={r} value={r}>{r}</option>)}
            </Sel>
          </Fld>
          <Fld label="Title / Designation"><Inp value={form.designation||""} onChange={e=>setForm(f=>({...f,designation:e.target.value}))} placeholder="e.g. Senior Engineer"/></Fld>
          <Fld label="Department"><Inp value={form.department||""} onChange={e=>setForm(f=>({...f,department:e.target.value}))} placeholder="e.g. Engineering"/></Fld>
          <div style={{marginTop:4}}><PrimaryBtn onClick={submitAdd} disabled={saving||!form.name||!form.role} label={saving?"Adding…":"Add Member"}/></div>
        </Modal>
      )}

      {/* ─── EDIT MODAL ─── */}
      {editModal && (
        <Modal title="Edit Member" subtitle={`${editModal.name} · ${editModal.role}`} onClose={()=>setEditModal(null)}>
          <Fld label="Full Name"><Inp value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name"/></Fld>
          <Fld label="Role / Level">
            <Sel value={form.role||""} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              {dynamicRoles.map(r=><option key={r} value={r}>{r}</option>)}
            </Sel>
          </Fld>
          <Fld label="Title / Designation"><Inp value={form.designation||""} onChange={e=>setForm(f=>({...f,designation:e.target.value}))} placeholder="e.g. VP of Engineering"/></Fld>
          <Fld label="Department"><Inp value={form.department||""} onChange={e=>setForm(f=>({...f,department:e.target.value}))} placeholder="e.g. Engineering"/></Fld>
          <Fld label="Photo URL (optional)"><Inp value={form.photo||""} onChange={e=>setForm(f=>({...f,photo:e.target.value}))} placeholder="https://…"/></Fld>
          <div style={{marginTop:4}}><PrimaryBtn onClick={submitEdit} disabled={saving||!form.name} label={saving?"Saving…":"Save Changes"}/></div>
        </Modal>
      )}

      {/* ─── DELETE CONFIRM MODAL ─── */}
      {delModal && (
        <Modal title="Delete Node" subtitle="This will also remove all child nodes" onClose={()=>setDelModal(null)}>
          <div style={{padding:"16px",background:"rgba(239,68,68,.06)",border:"1.5px solid rgba(239,68,68,.2)",borderRadius:12,marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:rc(delModal.role).grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",fontFamily:"'Sora',sans-serif",flexShrink:0}}>
                {initials(delModal.name)}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:T.text}}>{delModal.name}</div>
                <div style={{fontSize:11,color:T.muted}}>{delModal.role}{delModal.designation?` · ${delModal.designation}`:""}</div>
                {delModal.children?.length>0 && (
                  <div style={{fontSize:10,color:"#EF4444",marginTop:3,fontWeight:600}}>
                    ⚠ {delModal.children.length} child node{delModal.children.length!==1?"s":""} will also be deleted
                  </div>
                )}
              </div>
            </div>
          </div>
          <button onClick={submitDelete} disabled={saving} style={{
            width:"100%",padding:"12px",borderRadius:11,
            background:saving?"#e2e8f0":"linear-gradient(135deg,#EF4444,#F87171)",
            color:saving?T.faint:"#fff",border:"none",fontSize:13,fontWeight:800,
            cursor:saving?"not-allowed":"pointer",fontFamily:"'Sora',sans-serif",
            boxShadow:saving?"none":"0 4px 16px rgba(239,68,68,.3)",
          }}>{saving?"Deleting…":"Delete Node"}</button>
          <button onClick={()=>setDelModal(null)} style={{
            width:"100%",marginTop:8,padding:"10px",borderRadius:11,
            background:"#fff",border:`1.5px solid ${T.border}`,color:T.muted,
            fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
          }}>Cancel</button>
        </Modal>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ── zoom button ── */
const ZBtn = ({ onClick, title, children }) => (
  <button onClick={onClick} title={title} style={{
    width:36,height:36,borderRadius:9,border:`1.5px solid ${T.border}`,
    background:"#fff",color:"#475569",display:"flex",alignItems:"center",
    justifyContent:"center",cursor:"pointer",transition:"all .15s",
  }}
    onMouseEnter={e=>{e.currentTarget.style.background=T.bg;e.currentTarget.style.borderColor="#94a3b8";}}
    onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor=T.border;}}
  >{children}</button>
);
