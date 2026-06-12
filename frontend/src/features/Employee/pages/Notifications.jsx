// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import {
//   Bell, CheckCircle, AlertTriangle, Clock,
//   Info, CheckCheck, Trash2, X, Pin, Download, Eye, FileText
// } from 'lucide-react';
// import axios from "axios";
// import { API_BASE_URL } from "@/lib/apiClient";


// const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

// /* ── CrewSync design tokens ── */
// const T = {
//   navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
//   bg:"#F5F7FB", border:"#E8ECF2",
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

// .ac { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
// .ac .fd { font-family:'Sora',sans-serif; }

// /* cards */
// .ac-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); }

// /* alert rows — horizontal timeline style */
// .ac-row {
//   background:#fff; border:1.5px solid ${T.border}; border-radius:16px;
//   transition:box-shadow .18s, border-color .18s, transform .15s;
//   cursor:pointer; overflow:hidden;
// }
// .ac-row:hover { box-shadow:0 8px 28px rgba(13,31,45,.1); border-color:rgba(139,92,246,.3); transform:translateY(-1px); }
// .ac-row.high   { border-left:4px solid #EF4444; }
// .ac-row.unseen { border-left:4px solid ${T.coral}; }

// /* pill badges */
// .ac-pill { border-radius:999px; font-size:10px; font-weight:700; padding:3px 9px; display:inline-flex; align-items:center; gap:3px; }

// /* icon circle */
// .ac-ico { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

// /* action buttons */
// .ac-btn { display:inline-flex; align-items:center; gap:5px; padding:6px 14px; border-radius:10px; font-size:11px; font-weight:700; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
// .ac-del { width:32px; height:32px; border-radius:9px; border:1.5px solid ${T.border}; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; }
// .ac-del:hover { background:#FEF2F2; border-color:#FECACA; }

// /* filter tabs */
// .ac-tab { padding:6px 16px; border-radius:9px; font-size:11px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; border:1.5px solid transparent; }

// /* attachment chip */
// .ac-attach { display:inline-flex; align-items:center; gap:10px; padding:8px 14px; border-radius:12px; background:#F8FAFF; border:1.5px solid ${T.border}; cursor:pointer; transition:background .15s; margin-top:10px; }
// .ac-attach:hover { background:#EEF4FF; }

// @keyframes acUp   { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
// .ac-in { animation:acUp .35s ease both; }
// @keyframes acSpin { to{transform:rotate(360deg)} }
// .ac-spin { animation:acSpin .8s linear infinite; }
// `;

// const TABS = ['all','unread','action'];
// const TAB_LABELS = { all:'All Alerts', unread:'Unseen', action:'Needs Sign-off' };

// export default function PersonSignals() {
//   const [notifications, setSignals] = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [errMsg,   setErrMsg]   = useState("");
//   const [tab,      setTab]      = useState('all');

//   useEffect(()=>{ if(errMsg){ const t=setTimeout(()=>setErrMsg(""),5000); return ()=>clearTimeout(t); } },[errMsg]);

//   /* ── fetch ── */
//   const fetchAlerts = useCallback(async()=>{
//     setLoading(true);
//     try {
//       const res  = await api.get("/api/employee/notifications");
//       const data = res.data || [];
//       const sorted = [...data].sort((a,b)=>{
//         if(a.isPinned!==b.isPinned) return a.isPinned?-1:1;
//         if(a.read!==b.read) return a.read?1:-1;
//         if(a.reqAck!==b.reqAck&&!a.isAcknowledged) return a.reqAck?-1:1;
//         return new Date(b.createdAt)-new Date(a.createdAt);
//       });
//       setSignals(sorted);
//     } catch { setErrMsg("Couldn't load your alerts. Try again."); }
//     finally  { setLoading(false); }
//   },[]);

//   useEffect(()=>{ fetchAlerts(); },[fetchAlerts]);

//   /* ── actions ── */
//   const markRead = async id => {
//     setSignals(p=>p.map(n=>n.id===id?{...n,read:true}:n));
//     try { await api.put(`/api/employee/notifications/${id}/read`); } catch(e){ console.error(e); }
//   };

//   const markAllRead = async ()=>{
//     if(!notifications.some(n=>!n.read)) return;
//     const prev=[...notifications];
//     setSignals(p=>p.map(n=>({...n,read:true})));
//     try { await api.put("/api/employee/notifications/read-all"); }
//     catch { setErrMsg("Couldn't mark all as seen."); setSignals(prev); }
//   };

//   const acknowledge = async(id,e)=>{
//     e.stopPropagation();
//     setSignals(p=>p.map(n=>n.id===id?{...n,isAcknowledged:true,read:true}:n));
//     try { await api.put(`/api/employee/notifications/${id}/acknowledge`); }
//     catch { setErrMsg("Sign-off failed."); }
//   };

//   const handleDownload = (n,e)=>{
//     e.stopPropagation();
//     if(n.attachmentUrl) window.open(n.attachmentUrl,'_blank');
//     else alert("Downloading: "+n.attachmentName);
//   };

//   const deleteAlert = async(id,e)=>{
//     e.stopPropagation();
//     if(!confirm("Remove this alert?")) return;
//     const prev=[...notifications];
//     setSignals(p=>p.filter(n=>n.id!==id));
//     try { await api.delete(`/api/employee/notifications/${id}`); }
//     catch { setErrMsg("Couldn't remove alert."); setSignals(prev); }
//   };

//   /* ── computed ── */
//   const unreadCount = useMemo(()=>notifications.filter(n=>!n.read).length,[notifications]);
//   const actionCount = useMemo(()=>notifications.filter(n=>n.reqAck&&!n.isAcknowledged).length,[notifications]);
//   const visible     = useMemo(()=>notifications.filter(n=>{
//     if(tab==='all')    return true;
//     if(tab==='unread') return !n.read;
//     if(tab==='action') return n.reqAck&&!n.isAcknowledged;
//     return true;
//   }),[notifications,tab]);

//   const rowCls = n=>{
//     let c='ac-row';
//     if(!n.read) c+= n.priority==='HIGH' ? ' high' : ' unseen';
//     return c;
//   };
//   const prioIco = p=>{
//     if(p==='HIGH') return <AlertTriangle size={19} color="#EF4444"/>;
//     if(p==='LOW')  return <Info size={19} color="#94a3b8"/>;
//     return <Bell size={19} color={T.coral}/>;
//   };
//   const prioBg = p=>{
//     if(p==='HIGH') return 'rgba(239,68,68,.1)';
//     if(p==='LOW')  return 'rgba(148,163,184,.1)';
//     return `rgba(139,92,246,.1)`;
//   };

//   return (
//     <div className="ac" style={{padding:'0 0 56px'}}>
//       <style>{CSS}</style>

//       {/* ── HERO BANNER ── */}
//       <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:'22px 26px',position:'relative',overflow:'hidden'}}>
//         <div style={{position:'absolute',top:-50,right:60,width:180,height:180,borderRadius:'50%',background:'rgba(139,92,246,.07)',pointerEvents:'none'}}/>
//         <div style={{position:'absolute',bottom:-30,right:260,width:100,height:100,borderRadius:'50%',background:'rgba(6,182,212,.07)',pointerEvents:'none'}}/>
//         <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
//           <div>
//             <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:'uppercase',letterSpacing:'.12em',marginBottom:4}}>CrewSync · Inbox</p>
//             <h1 className="fd" style={{fontSize:23,fontWeight:900,color:'#fff',margin:0}}>Alert Centre</h1>
//             <p style={{fontSize:13,color:'rgba(255,255,255,.5)',marginTop:4}}>Playbook updates, sign-offs and compliance notices.</p>
//           </div>
//           <button onClick={markAllRead}
//             style={{padding:'9px 20px',borderRadius:11,border:'1.5px solid rgba(255,255,255,.18)',background:'rgba(255,255,255,.08)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',gap:7}}>
//             <CheckCheck size={14}/> Mark All Seen
//           </button>
//         </div>
//       </div>

//       <div style={{padding:'22px 26px',display:'flex',flexDirection:'column',gap:20}}>

//         {/* ── ERROR ── */}
//         {errMsg && (
//           <div className="ac-in" style={{padding:'12px 16px',borderRadius:12,background:'#FEF2F2',border:'1.5px solid #FECACA',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
//             <span style={{fontSize:13,color:'#991B1B',display:'flex',alignItems:'center',gap:6}}><AlertTriangle size={14}/>{errMsg}</span>
//             <button onClick={()=>setErrMsg("")} style={{background:'none',border:'none',cursor:'pointer',color:'#991B1B'}}><X size={14}/></button>
//           </div>
//         )}

//         {/* ── STAT STRIP ── */}
//         <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1.5fr',gap:14}} className="ac-stats ac-in">
//           <style>{`@media(max-width:640px){.ac-stats{grid-template-columns:1fr!important}}`}</style>

//           {/* unseen */}
//           <div className="ac-card" style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}>
//             <div className="ac-ico" style={{background:'rgba(139,92,246,.1)'}}>
//               <Bell size={20} color={T.coral}/>
//             </div>
//             <div>
//               <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>Unseen</p>
//               <p className="fd" style={{fontSize:28,fontWeight:900,color:T.coral,lineHeight:1}}>{unreadCount}</p>
//             </div>
//           </div>

//           {/* sign-off */}
//           <div className="ac-card" style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}>
//             <div className="ac-ico" style={{background:'rgba(6,182,212,.1)'}}>
//               <Eye size={20} color={T.teal}/>
//             </div>
//             <div>
//               <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>Needs Sign-off</p>
//               <p className="fd" style={{fontSize:28,fontWeight:900,color:T.teal,lineHeight:1}}>{actionCount}</p>
//             </div>
//           </div>

//           {/* filter card */}
//           <div className="ac-card" style={{padding:'14px 18px'}}>
//             <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
//               <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.08em'}}>Filter View</p>
//               <button onClick={markAllRead} style={{fontSize:11,fontWeight:700,color:T.coral,background:'none',border:'none',cursor:'pointer'}}>Seen all</button>
//             </div>
//             <div style={{display:'flex',gap:6}}>
//               {TABS.map(t=>{
//                 const active=tab===t;
//                 return(
//                   <button key={t} className="ac-tab" onClick={()=>setTab(t)}
//                     style={{flex:1,background:active?`linear-gradient(135deg,${T.navy},${T.navyMid})`:'#F1F5F9',color:active?'#fff':'#64748b',borderColor:active?'transparent':T.border,boxShadow:active?'0 3px 10px rgba(13,31,45,.18)':'none'}}>
//                     {TAB_LABELS[t]}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* ── LIST HEADER ── */}
//         <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
//           <p className="fd" style={{fontSize:14,fontWeight:800,color:T.navy}}>
//             Incoming Alerts
//             {loading&&<span style={{fontSize:12,fontWeight:400,color:'#94a3b8',marginLeft:8,fontFamily:'DM Sans'}}>Loading…</span>}
//           </p>
//           <span style={{fontSize:11,color:'#94a3b8',fontWeight:600}}>{visible.length} item{visible.length!==1?'s':''}</span>
//         </div>

//         {/* ── LOADING ── */}
//         {loading&&(
//           <div className="ac-card" style={{padding:'52px',textAlign:'center'}}>
//             <div className="ac-spin" style={{width:32,height:32,border:`3px solid ${T.coral}`,borderTopColor:'transparent',borderRadius:'50%',margin:'0 auto 12px'}}/>
//             <p style={{fontSize:13,color:'#94a3b8'}}>Fetching your alerts…</p>
//           </div>
//         )}

//         {/* ── EMPTY ── */}
//         {!loading&&visible.length===0&&(
//           <div className="ac-card" style={{padding:'52px 24px',textAlign:'center'}}>
//             <span style={{fontSize:40,display:'block',marginBottom:10}}>📭</span>
//             <p className="fd" style={{fontSize:14,fontWeight:800,color:T.navy,marginBottom:4}}>All clear</p>
//             <p style={{fontSize:13,color:'#94a3b8'}}>No alerts for this filter right now.</p>
//           </div>
//         )}

//         {/* ── ALERT ROWS ── */}
//         {!loading&&visible.map((n,i)=>(
//           <div key={n.id} className={rowCls(n)} style={{animationDelay:`${i*.04}s`}}
//             onClick={()=>!n.read&&markRead(n.id)}>

//             <div style={{padding:'16px 20px',display:'flex',gap:16,flexWrap:'wrap'}}>

//               {/* LEFT — icon + content */}
//               <div style={{display:'flex',gap:14,flex:1,minWidth:0}}>
//                 <div className="ac-ico" style={{background:prioBg(n.priority)}}>{prioIco(n.priority)}</div>

//                 <div style={{flex:1,minWidth:0}}>
//                   {/* title + badges */}
//                   <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:6}}>
//                     <p style={{fontSize:13,fontWeight:n.read?600:800,color:n.read?'#64748b':T.navy}}>{n.title}</p>
//                     {n.isPinned&&(
//                       <span className="ac-pill" style={{background:'rgba(139,92,246,.1)',color:T.coral,border:`1px solid rgba(139,92,246,.22)`}}>
//                         <Pin size={8}/> Pinned
//                       </span>
//                     )}
//                     {!n.read&&(
//                       <span className="ac-pill" style={{background:T.coral,color:'#fff'}}>New</span>
//                     )}
//                     {n.reqAck&&!n.isAcknowledged&&(
//                       <span className="ac-pill" style={{background:'rgba(6,182,212,.1)',color:T.teal,border:`1px solid rgba(6,182,212,.25)`}}>
//                         Sign-off Required
//                       </span>
//                     )}
//                   </div>

//                   {/* message */}
//                   <p style={{fontSize:12,color:'#475569',lineHeight:1.7,whiteSpace:'pre-wrap',maxWidth:640}}>{n.message}</p>

//                   {/* attachment */}
//                   {n.attachmentName&&(
//                     <div className="ac-attach" onClick={e=>handleDownload(n,e)}>
//                       <div style={{width:32,height:32,borderRadius:9,background:'rgba(139,92,246,.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
//                         <FileText size={15} color={T.coral}/>
//                       </div>
//                       <div>
//                         <p style={{fontSize:11,fontWeight:700,color:T.navy}}>{n.attachmentName}</p>
//                         <p style={{fontSize:10,color:'#94a3b8'}}>Tap to download</p>
//                       </div>
//                       <Download size={13} color="#94a3b8" style={{marginLeft:4}}/>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT — meta + actions */}
//               <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'space-between',gap:12,
//                 paddingLeft:16,borderLeft:`1px solid ${T.border}`,minWidth:160}}>

//                 <div style={{textAlign:'right'}}>
//                   <p style={{fontSize:11,fontWeight:600,color:'#64748b'}}>{new Date(n.createdAt).toLocaleDateString()}</p>
//                   <p style={{fontSize:10,color:'#94a3b8'}}>{new Date(n.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</p>
//                   {n.expiresAt&&new Date(n.expiresAt)<new Date(Date.now()+86400000)&&(
//                     <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,color:'#F59E0B',fontWeight:600,marginTop:3}}>
//                       <Clock size={10}/> Expiring soon
//                     </span>
//                   )}
//                 </div>

//                 <div style={{display:'flex',alignItems:'center',gap:6}}>
//                   <button className="ac-del" onClick={e=>deleteAlert(n.id,e)}>
//                     <Trash2 size={13} color="#ef4444"/>
//                   </button>

//                   {n.reqAck&&!n.isAcknowledged?(
//                     <button className="ac-btn" onClick={e=>acknowledge(n.id,e)}
//                       style={{background:`linear-gradient(135deg,${T.teal},#00a895)`,color:'#fff',boxShadow:'0 4px 12px rgba(6,182,212,.3)'}}>
//                       <Eye size={11}/> Sign Off
//                     </button>
//                   ):!n.read?(
//                     <button className="ac-btn" onClick={e=>{e.stopPropagation();markRead(n.id);}}
//                       style={{background:'rgba(139,92,246,.08)',color:T.coral,border:`1px solid rgba(139,92,246,.2)`}}>
//                       <CheckCheck size={11}/> Mark Seen
//                     </button>
//                   ):(
//                     <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,color:'#94a3b8',fontWeight:600,padding:'0 4px'}}>
//                       {n.isAcknowledged
//                         ?<><CheckCircle size={12} color={T.teal}/> Signed</>
//                         :<><CheckCircle size={12}/> Seen</>
//                       }
//                     </span>
//                   )}
//                 </div>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


//18-3-2026

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Bell, CheckCircle, AlertTriangle, Clock,
  Info, CheckCheck, Trash2, X, Pin, Download, Eye, FileText
} from 'lucide-react';
import api from "@/lib/apiClient";

/* ── Design tokens ── */
const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

.ac { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.ac .fd { font-family:'Sora',sans-serif; }

.ac-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); }

.ac-row {
  background:#fff; border:1.5px solid ${T.border}; border-radius:16px;
  transition:box-shadow .18s, border-color .18s, transform .15s;
  cursor:pointer; overflow:hidden;
}
.ac-row:hover { box-shadow:0 8px 28px rgba(13,31,45,.1); border-color:rgba(139,92,246,.3); transform:translateY(-1px); }
.ac-row.high   { border-left:4px solid #EF4444; }
.ac-row.unseen { border-left:4px solid ${T.coral}; }

.ac-pill { border-radius:999px; font-size:10px; font-weight:700; padding:3px 9px; display:inline-flex; align-items:center; gap:3px; }
.ac-ico  { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

.ac-btn { display:inline-flex; align-items:center; gap:5px; padding:6px 14px; border-radius:10px; font-size:11px; font-weight:700; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
.ac-del { width:32px; height:32px; border-radius:9px; border:1.5px solid ${T.border}; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; }
.ac-del:hover { background:#FEF2F2; border-color:#FECACA; }

.ac-tab { padding:6px 16px; border-radius:9px; font-size:11px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; border:1.5px solid transparent; }

.ac-attach { display:inline-flex; align-items:center; gap:10px; padding:8px 14px; border-radius:12px; background:#F8FAFF; border:1.5px solid ${T.border}; cursor:pointer; transition:background .15s; margin-top:10px; }
.ac-attach:hover { background:#EEF4FF; }

@keyframes acUp   { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.ac-in { animation:acUp .35s ease both; }
@keyframes acSpin { to{transform:rotate(360deg)} }
.ac-spin { animation:acSpin .8s linear infinite; }
`;

const TABS = ['all','unread','action'];
const TAB_LABELS = { all:'All Alerts', unread:'Unseen', action:'Needs Sign-off' };

export default function PersonSignals() {
  const [notifications, setSignals] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [errMsg,   setErrMsg]   = useState("");
  const [tab,      setTab]      = useState('all');

  useEffect(() => {
    if (errMsg) { const t = setTimeout(() => setErrMsg(""), 5000); return () => clearTimeout(t); }
  }, [errMsg]);

  /* ── Fetch with proper auth + tenant headers ── */
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await api.get("/api/employee/notifications");
      const data = res.data;

      // Backend may return array directly OR wrapped in { success, data: [...] }
      const list = Array.isArray(data) ? data : (data?.data || []);

      const sorted = [...list].sort((a, b) => {
        if (a.isPinned  !== b.isPinned)  return a.isPinned  ? -1 : 1;
        if (a.read      !== b.read)      return a.read      ?  1 : -1;
        if (a.reqAck    !== b.reqAck && !a.isAcknowledged) return a.reqAck ? -1 : 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setSignals(sorted);
    } catch (e) {
      console.error("fetchAlerts error:", e);
      setErrMsg("Couldn't load your alerts. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  /* ── Actions ── */
  const markRead = async id => {
    setSignals(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    try { await api.put(`/api/employee/notifications/${id}/read`); }
    catch (e) { console.error(e); }
  };

  const markAllRead = async () => {
    if (!notifications.some(n => !n.read)) return;
    const prev = [...notifications];
    setSignals(p => p.map(n => ({ ...n, read: true })));
    try { await api.put("/api/employee/notifications/read-all"); }
    catch { setErrMsg("Couldn't mark all as seen."); setSignals(prev); }
  };

  const acknowledge = async (id, e) => {
    e.stopPropagation();
    setSignals(p => p.map(n => n.id === id ? { ...n, isAcknowledged: true, read: true } : n));
    try { await api.post(`/api/employee/notifications/${id}/acknowledge`); }
    catch { setErrMsg("Sign-off failed."); }
  };

  const handleDownload = (n, e) => {
    e.stopPropagation();
    // attachmentUrl is now a Cloudinary https:// URL — open directly
    if (n.attachmentUrl) window.open(n.attachmentUrl, '_blank', 'noopener,noreferrer');
    else if (n.attachmentName) setErrMsg("Attachment URL not available.");
  };

  const deleteAlert = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Remove this alert?")) return;
    const prev = [...notifications];
    setSignals(p => p.filter(n => n.id !== id));
    try {
      await api.delete(`/api/employee/notifications/${id}`);
    } catch { setErrMsg("Couldn't remove alert."); setSignals(prev); }
  };

  /* ── Computed ── */
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const actionCount = useMemo(() => notifications.filter(n => n.reqAck && !n.isAcknowledged).length, [notifications]);
  const visible     = useMemo(() => notifications.filter(n => {
    if (tab === 'all')    return true;
    if (tab === 'unread') return !n.read;
    if (tab === 'action') return n.reqAck && !n.isAcknowledged;
    return true;
  }), [notifications, tab]);

  const rowCls  = n => `ac-row${!n.read ? (n.priority === 'HIGH' ? ' high' : ' unseen') : ''}`;
  const prioIco = p => {
    if (p === 'HIGH')   return <AlertTriangle size={19} color="#EF4444" />;
    if (p === 'LOW')    return <Info size={19} color="#94a3b8" />;
    return <Bell size={19} color={T.coral} />;
  };
  const prioBg  = p => {
    if (p === 'HIGH')   return 'rgba(239,68,68,.1)';
    if (p === 'LOW')    return 'rgba(148,163,184,.1)';
    return `rgba(139,92,246,.1)`;
  };

  return (
    <div className="ac" style={{ padding: '0 0 56px' }}>
      <style>{CSS}</style>

      {/* HERO */}
      <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, padding:'22px 26px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-50, right:60, width:180, height:180, borderRadius:'50%', background:'rgba(139,92,246,.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-30, right:260, width:100, height:100, borderRadius:'50%', background:'rgba(6,182,212,.07)', pointerEvents:'none' }} />
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:T.coral, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:4 }}>CrewSync · Inbox</p>
            <h1 className="fd" style={{ fontSize:23, fontWeight:900, color:'#fff', margin:0 }}>Alert Centre</h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.5)', marginTop:4 }}>Playbook updates, sign-offs and compliance notices.</p>
          </div>
          <button onClick={markAllRead}
            style={{ padding:'9px 20px', borderRadius:11, border:'1.5px solid rgba(255,255,255,.18)', background:'rgba(255,255,255,.08)', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', gap:7 }}>
            <CheckCheck size={14} /> Mark All Seen
          </button>
        </div>
      </div>

      <div style={{ padding:'22px 26px', display:'flex', flexDirection:'column', gap:20 }}>

        {/* ERROR */}
        {errMsg && (
          <div className="ac-in" style={{ padding:'12px 16px', borderRadius:12, background:'#FEF2F2', border:'1.5px solid #FECACA', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
            <span style={{ fontSize:13, color:'#991B1B', display:'flex', alignItems:'center', gap:6 }}><AlertTriangle size={14} />{errMsg}</span>
            <button onClick={() => setErrMsg("")} style={{ background:'none', border:'none', cursor:'pointer', color:'#991B1B' }}><X size={14} /></button>
          </div>
        )}

        {/* STAT STRIP */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.5fr', gap:14 }} className="ac-stats ac-in">
          <style>{`@media(max-width:640px){.ac-stats{grid-template-columns:1fr!important}}`}</style>

          <div className="ac-card" style={{ padding:'16px 18px', display:'flex', alignItems:'center', gap:14 }}>
            <div className="ac-ico" style={{ background:'rgba(139,92,246,.1)' }}><Bell size={20} color={T.coral} /></div>
            <div>
              <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Unseen</p>
              <p className="fd" style={{ fontSize:28, fontWeight:900, color:T.coral, lineHeight:1 }}>{unreadCount}</p>
            </div>
          </div>

          <div className="ac-card" style={{ padding:'16px 18px', display:'flex', alignItems:'center', gap:14 }}>
            <div className="ac-ico" style={{ background:'rgba(6,182,212,.1)' }}><Eye size={20} color={T.teal} /></div>
            <div>
              <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Needs Sign-off</p>
              <p className="fd" style={{ fontSize:28, fontWeight:900, color:T.teal, lineHeight:1 }}>{actionCount}</p>
            </div>
          </div>

          <div className="ac-card" style={{ padding:'14px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em' }}>Filter View</p>
              <button onClick={markAllRead} style={{ fontSize:11, fontWeight:700, color:T.coral, background:'none', border:'none', cursor:'pointer' }}>Seen all</button>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {TABS.map(t => {
                const active = tab === t;
                return (
                  <button key={t} className="ac-tab" onClick={() => setTab(t)}
                    style={{ flex:1, background: active ? `linear-gradient(135deg,${T.navy},${T.navyMid})` : '#F1F5F9', color: active ? '#fff' : '#64748b', borderColor: active ? 'transparent' : T.border, boxShadow: active ? '0 3px 10px rgba(13,31,45,.18)' : 'none' }}>
                    {TAB_LABELS[t]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LIST HEADER */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <p className="fd" style={{ fontSize:14, fontWeight:800, color:T.navy }}>
            Incoming Alerts
            {loading && <span style={{ fontSize:12, fontWeight:400, color:'#94a3b8', marginLeft:8, fontFamily:'DM Sans' }}>Loading…</span>}
          </p>
          <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{visible.length} item{visible.length !== 1 ? 's' : ''}</span>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="ac-card" style={{ padding:'52px', textAlign:'center' }}>
            <div className="ac-spin" style={{ width:32, height:32, border:`3px solid ${T.coral}`, borderTopColor:'transparent', borderRadius:'50%', margin:'0 auto 12px' }} />
            <p style={{ fontSize:13, color:'#94a3b8' }}>Fetching your alerts…</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && visible.length === 0 && (
          <div className="ac-card" style={{ padding:'52px 24px', textAlign:'center' }}>
            <span style={{ fontSize:40, display:'block', marginBottom:10 }}>📭</span>
            <p className="fd" style={{ fontSize:14, fontWeight:800, color:T.navy, marginBottom:4 }}>All clear</p>
            <p style={{ fontSize:13, color:'#94a3b8' }}>No alerts for this filter right now.</p>
          </div>
        )}

        {/* ALERT ROWS */}
        {!loading && visible.map((n, i) => (
          <div key={n.id} className={`${rowCls(n)} ac-in`} style={{ animationDelay:`${i * .04}s` }}
            onClick={() => !n.read && markRead(n.id)}>

            <div style={{ padding:'16px 20px', display:'flex', gap:16, flexWrap:'wrap' }}>

              {/* LEFT — icon + content */}
              <div style={{ display:'flex', gap:14, flex:1, minWidth:0 }}>
                <div className="ac-ico" style={{ background:prioBg(n.priority) }}>{prioIco(n.priority)}</div>

                <div style={{ flex:1, minWidth:0 }}>
                  {/* title + badges */}
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:6 }}>
                    <p style={{ fontSize:13, fontWeight: n.read ? 600 : 800, color: n.read ? '#64748b' : T.navy }}>{n.title}</p>
                    {n.isPinned && (
                      <span className="ac-pill" style={{ background:'rgba(139,92,246,.1)', color:T.coral, border:`1px solid rgba(139,92,246,.22)` }}>
                        <Pin size={8} /> Pinned
                      </span>
                    )}
                    {!n.read && <span className="ac-pill" style={{ background:T.coral, color:'#fff' }}>New</span>}
                    {n.reqAck && !n.isAcknowledged && (
                      <span className="ac-pill" style={{ background:'rgba(6,182,212,.1)', color:T.teal, border:`1px solid rgba(6,182,212,.25)` }}>
                        Sign-off Required
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize:12, color:'#475569', lineHeight:1.7, whiteSpace:'pre-wrap', maxWidth:640 }}>{n.message}</p>

                  {/* attachment — Cloudinary URL opens directly */}
                  {n.attachmentName && (
                    <div className="ac-attach" onClick={e => handleDownload(n, e)}>
                      <div style={{ width:32, height:32, borderRadius:9, background:'rgba(139,92,246,.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <FileText size={15} color={T.coral} />
                      </div>
                      <div>
                        <p style={{ fontSize:11, fontWeight:700, color:T.navy }}>{n.attachmentName}</p>
                        <p style={{ fontSize:10, color:'#94a3b8' }}>Tap to open</p>
                      </div>
                      <Download size={13} color="#94a3b8" style={{ marginLeft:4 }} />
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — meta + actions */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between', gap:12, paddingLeft:16, borderLeft:`1px solid ${T.border}`, minWidth:160 }}>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:11, fontWeight:600, color:'#64748b' }}>{new Date(n.createdAt).toLocaleDateString()}</p>
                  <p style={{ fontSize:10, color:'#94a3b8' }}>{new Date(n.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</p>
                  {n.expiresAt && new Date(n.expiresAt) < new Date(Date.now() + 86400000) && (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, color:'#F59E0B', fontWeight:600, marginTop:3 }}>
                      <Clock size={10} /> Expiring soon
                    </span>
                  )}
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <button className="ac-del" onClick={e => deleteAlert(n.id, e)}>
                    <Trash2 size={13} color="#ef4444" />
                  </button>

                  {n.reqAck && !n.isAcknowledged ? (
                    <button className="ac-btn" onClick={e => acknowledge(n.id, e)}
                      style={{ background:`linear-gradient(135deg,${T.teal},#00a895)`, color:'#fff', boxShadow:'0 4px 12px rgba(6,182,212,.3)' }}>
                      <Eye size={11} /> Sign Off
                    </button>
                  ) : !n.read ? (
                    <button className="ac-btn" onClick={e => { e.stopPropagation(); markRead(n.id); }}
                      style={{ background:'rgba(139,92,246,.08)', color:T.coral, border:`1px solid rgba(139,92,246,.2)` }}>
                      <CheckCheck size={11} /> Mark Seen
                    </button>
                  ) : (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, color:'#94a3b8', fontWeight:600, padding:'0 4px' }}>
                      {n.isAcknowledged
                        ? <><CheckCircle size={12} color={T.teal} /> Signed</>
                        : <><CheckCircle size={12} /> Seen</>
                      }
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}