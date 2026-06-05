import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Search, Trash2, Edit3, Pin, CheckCircle, AlertTriangle, X, ChevronDown, Check, Calendar, Clock, Paperclip, Mail, Eye, Save, Send, Archive } from "lucide-react";
import api from "@/lib/apiClient";
const T = {
  navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.an * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.an .fd { font-family:'Sora',sans-serif; }

.an-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.an-card-head { background:linear-gradient(90deg,${T.navy},${T.navyMid}); padding:13px 18px; display:flex; align-items:center; justify-content:space-between; }
.an-card-head-left { display:flex; align-items:center; gap:9px; }
.an-card-head-icon { width:30px; height:30px; border-radius:9px; background:rgba(255,255,255,.1); display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* tabs */
.an-tabs { display:flex; background:#fff; border:1.5px solid ${T.border}; border-radius:11px; padding:4px; gap:3px; }
.an-tab { padding:7px 14px; border-radius:8px; font-size:10px; font-family:'Sora',sans-serif; font-weight:800; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; border:none; background:transparent; color:#A0ABBA; transition:all .15s; white-space:nowrap; }
.an-tab:hover { color:${T.navy}; }
.an-tab.active { background:linear-gradient(135deg,${T.coral},#FF8C5A); color:#fff; box-shadow:0 3px 10px rgba(255,107,53,.25); }

/* search */
.an-search { width:100%; background:#fff; border:1.5px solid ${T.border}; border-radius:11px; padding:10px 14px 10px 42px; font-size:13px; color:${T.navy}; font-family:'DM Sans',sans-serif; outline:none; transition:all .18s; }
.an-search:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(255,107,53,.08); }
.an-search::placeholder { color:#A0ABBA; }

/* form */
.an-label { display:block; font-size:10px; font-weight:700; color:#8898A8; text-transform:uppercase; letter-spacing:.08em; margin-bottom:5px; }
.an-input { width:100%; background:#F8FAFF; border:1.5px solid ${T.border}; border-radius:10px; padding:10px 12px; font-size:13px; color:${T.navy}; font-family:'DM Sans',sans-serif; outline:none; transition:all .18s; }
.an-input:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(255,107,53,.08); background:#fff; }
.an-input::placeholder { color:#A0ABBA; }
.an-textarea { resize:none; min-height:96px; }
.an-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23FF6B35'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:30px; }

/* department dropdown */
.an-dept-btn { width:100%; display:flex; align-items:center; justify-content:space-between; background:#F8FAFF; border:1.5px solid ${T.border}; border-radius:10px; padding:10px 12px; font-size:13px; color:#A0ABBA; cursor:pointer; transition:all .18s; font-family:'DM Sans',sans-serif; }
.an-dept-btn:hover, .an-dept-btn.open { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(255,107,53,.08); }
.an-dept-dropdown { position:absolute; z-index:20; width:100%; top:calc(100% + 6px); left:0; background:#fff; border:1.5px solid ${T.border}; border-radius:12px; box-shadow:0 12px 40px rgba(13,31,45,.12); padding:6px; max-height:200px; overflow-y:auto; }
.an-dept-opt { display:flex; align-items:center; gap:9px; padding:8px 10px; border-radius:8px; cursor:pointer; transition:background .12s; font-size:13px; color:#475569; }
.an-dept-opt:hover { background:#F8FAFF; }
.an-dept-check { width:16px; height:16px; border:1.5px solid ${T.border}; border-radius:4px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .12s; }
.an-dept-check.on { background:${T.coral}; border-color:${T.coral}; }

/* settings checkbox row */
.an-check-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1.5px solid ${T.border}; }
.an-check-row:last-child { border-bottom:none; }
.an-check-label { display:flex; align-items:center; gap:9px; font-size:13px; color:#475569; cursor:pointer; }
.an-check-input { appearance:none; width:16px; height:16px; border:1.5px solid ${T.border}; border-radius:4px; cursor:pointer; position:relative; transition:all .12s; flex-shrink:0; }
.an-check-input:checked { background:${T.coral}; border-color:${T.coral}; }
.an-check-input:checked::after { content:'✓'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#fff; font-weight:800; }

/* action buttons */
.an-btn-primary { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:11px; border-radius:11px; border:none; background:linear-gradient(135deg,${T.coral},#FF8C5A); color:#fff; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .18s; box-shadow:0 4px 14px rgba(255,107,53,.25); }
.an-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(255,107,53,.35); }
.an-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.an-btn-ghost { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:10px; border-radius:11px; border:1.5px solid ${T.border}; background:#fff; color:#64748B; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
.an-btn-ghost:hover { border-color:${T.coral}; color:${T.coral}; }

/* attach btn */
.an-attach-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:9px; border:1.5px solid ${T.border}; background:#F8FAFF; color:#64748B; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
.an-attach-btn:hover { border-color:${T.coral}; color:${T.coral}; }

/* notification card */
.an-notif { background:#fff; border:1.5px solid ${T.border}; border-radius:14px; padding:16px 18px; transition:all .18s; position:relative; overflow:hidden; }
.an-notif:hover { border-color:rgba(255,107,53,.25); box-shadow:0 4px 18px rgba(13,31,45,.07); }
.an-notif.pinned { border-color:rgba(255,107,53,.3); background:rgba(255,107,53,.015); }
.an-notif-stripe { position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:0; }

/* priority pill */
.an-prio { display:inline-flex; align-items:center; gap:4px; padding:2px 9px; border-radius:999px; font-size:10px; font-weight:700; font-family:'Sora',sans-serif; white-space:nowrap; }
.an-prio-HIGH   { background:rgba(239,68,68,.1);   color:#EF4444; }
.an-prio-MEDIUM { background:rgba(245,158,11,.1);  color:#D97706; }
.an-prio-LOW    { background:#F1F5F9;               color:#64748B; }

/* meta pill */
.an-meta { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:600; font-family:'DM Sans',sans-serif; border:1px solid; }

/* notif action btns */
.an-nact { width:28px; height:28px; border-radius:8px; border:1.5px solid ${T.border}; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .14s; }
.an-nact:hover { transform:scale(1.08); }
.an-nact-e:hover { background:rgba(255,107,53,.08); border-color:rgba(255,107,53,.3); }
.an-nact-a:hover { background:rgba(0,194,168,.08);  border-color:rgba(0,194,168,.3); }
.an-nact-d:hover { background:rgba(239,68,68,.07);  border-color:rgba(239,68,68,.3); }

/* pin badge */
.an-pin { position:absolute; top:0; right:0; background:${T.coral}; color:#fff; font-size:8px; font-family:'Sora',sans-serif; font-weight:800; letter-spacing:.06em; padding:3px 10px; border-radius:0 12px 0 8px; display:flex; align-items:center; gap:3px; }

/* scheduled chip */
.an-sched { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:6px; background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.2); color:#D97706; font-size:10px; font-weight:700; font-family:'Sora',sans-serif; }

/* empty */
.an-empty { padding:48px 20px; text-align:center; border:1.5px dashed ${T.border}; border-radius:14px; background:#FAFBFF; }

/* error */
.an-error { padding:11px 16px; border-radius:11px; background:#FEF2F2; border:1.5px solid #FECACA; color:#DC2626; font-size:12px; display:flex; align-items:center; justify-content:space-between; gap:8px; }

/* spinner */
.an-spin { width:30px; height:30px; border:3px solid ${T.border}; border-top-color:${T.coral}; border-radius:50%; animation:anSpin .8s linear infinite; }
@keyframes anSpin { to{transform:rotate(360deg)} }

.an-2col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:480px){ .an-2col{ grid-template-columns:1fr!important; } }

@keyframes anIn { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.an-in { animation:anIn .32s ease both; }
`;

const DEPARTMENTS = ["IT & Engineering","HR & Admin","Finance","Sales & Marketing","Operations","Legal"];

const PRIO_STRIPE = { HIGH:"#EF4444", MEDIUM:"#F59E0B", LOW:T.teal };

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle]           = useState("");
  const [message, setMessage]       = useState("");
  const [priority, setPriority]     = useState("LOW");
  const [isPinned, setIsPinned]     = useState(false);
  const [targetType, setTargetType] = useState("ALL");
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [targetEmployeeIds, setTargetEmployeeIds] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [expiryDate, setExpiryDate]   = useState("");
  const [reqAck, setReqAck]           = useState(false);
  const [channels, setChannels]       = useState({email:false,push:false});
  const [attachment, setAttachment]   = useState(null);
  const [editingId, setEditingId]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [searchTerm, setSearchTerm]   = useState("");
  const [activeTab, setActiveTab]     = useState("PUBLISHED");
  const [isDeptOpen, setIsDeptOpen]   = useState(false);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    if(error){const t=setTimeout(()=>setError(""),5000);return()=>clearTimeout(t);}
  },[error]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res=await api.get("/api/admin/notifications");
      const data=res.data||[];
      setNotifications(data.sort((a,b)=>{if(a.pinned!==b.pinned)return a.pinned?-1:1;return new Date(b.createdAt)-new Date(a.createdAt);}));
    } catch(err){console.error(err);setError("Failed to fetch notifications.");}
    finally{setLoading(false);}
  };

  useEffect(()=>{
    fetchNotifications();
    const handler=e=>{if(dropdownRef.current&&!dropdownRef.current.contains(e.target))setIsDeptOpen(false);};
    document.addEventListener("mousedown",handler);
    return()=>document.removeEventListener("mousedown",handler);
  },[]);

  const handleFileChange = e=>{if(e.target.files[0])setAttachment(e.target.files[0]);};
  const toggleDept = dept=>setSelectedDepts(p=>p.includes(dept)?p.filter(d=>d!==dept):[...p,dept]);

  const handleSubmit = async (saveAsDraft=false) => {
    if(!title.trim()||!message.trim()){alert("Title and message are required.");return;}
    setLoading(true); setError("");
    let status=saveAsDraft?"DRAFT":"PUBLISHED";
    if(!saveAsDraft&&publishDate&&new Date(publishDate)>new Date()) status="SCHEDULED";
    const fd=new FormData();
    fd.append("title",title); fd.append("message",message); fd.append("priority",priority);
    fd.append("status",status); fd.append("pinned",isPinned); fd.append("reqAck",reqAck);
    fd.append("sendEmail",channels.email); fd.append("sendPush",channels.push);
    fd.append("targetType",targetType);
    selectedDepts.forEach(d=>fd.append("targetDepts",d));
    targetEmployeeIds.split(",").map(id=>id.trim()).filter(Boolean).forEach(id=>fd.append("targetEmployeeIds",id));
    fd.append("scheduledAt",publishDate||new Date().toISOString());
    fd.append("expiresAt",expiryDate||"");
    if(attachment) fd.append("attachment",attachment);
    try {
      const res=editingId?await api.put(`/api/admin/notifications/${editingId}`,fd):await api.post("/api/admin/notifications",fd);
      if(res.data?.success===false) throw new Error(res.data.message||"Operation failed");
      await fetchNotifications(); resetForm(); setActiveTab(status);
    } catch(err){console.error(err);setError(err.message||"Failed to save notification.");}
    finally{setLoading(false);}
  };

  const handleDelete = async id=>{
    if(!confirm("Delete this notification permanently?"))return;
    try{await api.delete(`/api/admin/notifications/${id}`);setNotifications(p=>p.filter(n=>n.id!==id));}
    catch(err){console.error(err);setError("Could not delete.");}
  };

  const handleArchive = async id=>{
    if(!confirm("Archive this notification?"))return;
    try{await api.patch(`/api/admin/notifications/${id}/archive`);await fetchNotifications();}
    catch(err){console.error(err);setError("Could not archive.");}
  };

  const handleEdit = n=>{
    setTitle(n.title); setMessage(n.message); setPriority(n.priority); setIsPinned(n.pinned);
    setPublishDate(n.scheduledAt?n.scheduledAt.slice(0,16):"");
    setExpiryDate(n.expiresAt?n.expiresAt.slice(0,16):"");
    setReqAck(n.reqAck||false); setChannels({email:n.sendEmail||false,push:n.sendPush||false});
    setAttachment(n.attachmentName?{name:n.attachmentName}:null);
    if(n.targetEmployeeIds?.length>0){setTargetType("SPECIFIC");setTargetEmployeeIds(Array.isArray(n.targetEmployeeIds)?n.targetEmployeeIds.join(", "):"");}
    else if(n.targetDepts?.length>0){setTargetType("DEPT");setSelectedDepts(n.targetDepts);}
    else setTargetType("ALL");
    setEditingId(n.id); window.scrollTo({top:0,behavior:"smooth"});
  };

  const resetForm = ()=>{
    setTitle(""); setMessage(""); setPriority("LOW"); setTargetType("ALL"); setSelectedDepts([]);
    setTargetEmployeeIds(""); setIsPinned(false); setPublishDate(""); setExpiryDate("");
    setReqAck(false); setChannels({email:false,push:false}); setAttachment(null); setEditingId(null);
    if(fileInputRef.current) fileInputRef.current.value="";
  };

  const filtered = useMemo(()=>notifications.filter(n=>n.title.toLowerCase().includes(searchTerm.toLowerCase())&&n.status===activeTab),[notifications,searchTerm,activeTab]);

  const TAB_COUNTS = t=>notifications.filter(n=>n.status===t).length;

  return (
    <div className="an" style={{background:T.bg,minHeight:"100vh",padding:"0 0 56px"}}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",marginBottom:22,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(255,107,53,.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,right:260,width:100,height:100,borderRadius:"50%",background:"rgba(0,194,168,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>SamayaHR · Admin</p>
            <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Notification Centre</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>Create and manage org-wide announcements.</p>
          </div>
          <div className="an-tabs">
            {["PUBLISHED","SCHEDULED","DRAFT","ARCHIVED"].map(tab=>{
              const cnt=TAB_COUNTS(tab);
              return (
                <button key={tab} className={`an-tab${activeTab===tab?" active":""}`} onClick={()=>setActiveTab(tab)}>
                  {tab.charAt(0)+tab.slice(1).toLowerCase()}
                  {cnt>0&&<span style={{marginLeft:5,background:activeTab===tab?"rgba(255,255,255,.25)":"rgba(255,107,53,.1)",color:activeTab===tab?"#fff":T.coral,padding:"0 5px",borderRadius:4,fontSize:9}}>{cnt}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error&&(
        <div style={{padding:"0 26px",marginBottom:16}}>
          <div className="an-error">
            <div style={{display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={13}/>{error}</div>
            <button onClick={()=>setError("")} style={{background:"none",border:"none",cursor:"pointer",color:"#DC2626"}}><X size={13}/></button>
          </div>
        </div>
      )}

      <div style={{padding:"0 26px",display:"grid",gridTemplateColumns:"400px 1fr",gap:20,alignItems:"start"}}>

        {/* ── LEFT: COMPOSE FORM ── */}
        <div className="an-card an-in" style={{position:"sticky",top:16}}>
          <div className="an-card-head">
            <div className="an-card-head-left">
              <div className="an-card-head-icon">{editingId?<Edit3 size={14} color="rgba(255,255,255,.8)"/>:<Bell size={14} color="rgba(255,255,255,.8)"/>}</div>
              <div>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:"#fff"}}>{editingId?"Edit Notification":"Compose New"}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,.45)",marginTop:1}}>Broadcast to your team</p>
              </div>
            </div>
            {editingId&&(
              <button onClick={resetForm} style={{fontSize:10,fontFamily:"Sora",fontWeight:800,color:T.coral,background:"rgba(255,107,53,.1)",border:"1px solid rgba(255,107,53,.2)",borderRadius:7,padding:"4px 10px",cursor:"pointer",letterSpacing:".06em"}}>
                ✕ Cancel
              </button>
            )}
          </div>

          <div style={{padding:"18px",display:"flex",flexDirection:"column",gap:14}}>

            <div>
              <label className="an-label">Title</label>
              <input className="an-input" placeholder="e.g. Office closed — public holiday" value={title} onChange={e=>setTitle(e.target.value)}/>
            </div>

            <div>
              <label className="an-label">Message</label>
              <textarea className="an-input an-textarea" placeholder="Write your announcement here…" value={message} onChange={e=>setMessage(e.target.value)}/>
            </div>

            <div>
              <button className="an-attach-btn" onClick={()=>fileInputRef.current?.click()}>
                <Paperclip size={12}/>{attachment?"Change File":"Attach File"}
              </button>
              {attachment&&<span style={{fontSize:11,color:"#64748B",marginLeft:8}}>{attachment.name}</span>}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display:"none"}}/>
            </div>

            <div style={{height:1,background:T.border}}/>

            <div className="an-2col">
              <div>
                <label className="an-label">Priority</label>
                <select className="an-input an-select" value={priority} onChange={e=>setPriority(e.target.value)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="an-label">Audience</label>
                <select className="an-input an-select" value={targetType} onChange={e=>setTargetType(e.target.value)}>
                  <option value="ALL">All Employees</option>
                  <option value="DEPT">By Department</option>
                  <option value="SPECIFIC">Specific IDs</option>
                </select>
              </div>
            </div>

            {targetType==="DEPT"&&(
              <div style={{position:"relative"}} ref={dropdownRef}>
                <label className="an-label">Departments</label>
                <button className={`an-dept-btn${isDeptOpen?" open":""}`} onClick={()=>setIsDeptOpen(p=>!p)}>
                  <span style={{color:selectedDepts.length?T.navy:"#A0ABBA"}}>
                    {selectedDepts.length?`${selectedDepts.length} dept${selectedDepts.length>1?"s":""} selected`:"Select departments"}
                  </span>
                  <ChevronDown size={13} color={T.coral}/>
                </button>
                {isDeptOpen&&(
                  <div className="an-dept-dropdown">
                    {DEPARTMENTS.map(d=>(
                      <div key={d} className="an-dept-opt" onClick={()=>toggleDept(d)}>
                        <div className={`an-dept-check${selectedDepts.includes(d)?" on":""}`}>
                          {selectedDepts.includes(d)&&<Check size={9} color="#fff" strokeWidth={3}/>}
                        </div>
                        {d}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {targetType==="SPECIFIC"&&(
              <div>
                <label className="an-label">Employee IDs</label>
                <input className="an-input" placeholder="EMP001, EMP002, EMP003" value={targetEmployeeIds} onChange={e=>setTargetEmployeeIds(e.target.value)}/>
              </div>
            )}

            <div style={{height:1,background:T.border}}/>

            <div className="an-2col">
              <div>
                <label className="an-label" style={{display:"flex",alignItems:"center",gap:4}}><Calendar size={9}/>Publish Date</label>
                <input type="datetime-local" className="an-input" style={{fontSize:12}} value={publishDate} onChange={e=>setPublishDate(e.target.value)}/>
              </div>
              <div>
                <label className="an-label" style={{display:"flex",alignItems:"center",gap:4}}><Clock size={9}/>Expires On</label>
                <input type="datetime-local" className="an-input" style={{fontSize:12}} value={expiryDate} onChange={e=>setExpiryDate(e.target.value)}/>
              </div>
            </div>

            <div style={{background:"#F8FAFF",border:`1.5px solid ${T.border}`,borderRadius:11,padding:"4px 12px"}}>
              {[
                [reqAck,()=>setReqAck(p=>!p),"Require Acknowledgement",<Eye size={12} color="#8898A8"/>],
                [channels.email,()=>setChannels(p=>({...p,email:!p.email})),"Send via Email",<Mail size={12} color="#8898A8"/>],
                [isPinned,()=>setIsPinned(p=>!p),"Pin to Dashboard",<Pin size={12} color="#8898A8"/>],
              ].map(([val,fn,txt,ico])=>(
                <div className="an-check-row" key={txt}>
                  <label className="an-check-label">
                    <input type="checkbox" className="an-check-input" checked={val} onChange={fn}/>
                    {txt}
                  </label>
                  {ico}
                </div>
              ))}
            </div>

            <div style={{display:"flex",gap:10,paddingTop:4}}>
              <button className="an-btn-ghost" onClick={()=>handleSubmit(true)}><Save size={13}/>Draft</button>
              <button className="an-btn-primary" onClick={()=>handleSubmit(false)} disabled={loading}>
                {loading?"Saving…":<><Send size={13}/>{editingId?"Update":"Publish"}</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: NOTIFICATION LIST ── */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {/* search */}
          <div style={{position:"relative"}}>
            <Search size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#A0ABBA"}}/>
            <input className="an-search" placeholder={`Search ${activeTab.toLowerCase()} notifications…`} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <p style={{fontSize:11,fontWeight:700,color:"#8898A8",textTransform:"uppercase",letterSpacing:".08em"}}>
              {filtered.length} {activeTab.toLowerCase()} notification{filtered.length!==1?"s":""}
            </p>
          </div>

          {loading&&(
            <div style={{display:"flex",justifyContent:"center",padding:40}}>
              <div className="an-spin"/>
            </div>
          )}

          {!loading&&filtered.length===0&&(
            <div className="an-empty an-in">
              <p style={{fontSize:28,marginBottom:10}}>🔔</p>
              <p className="fd" style={{fontSize:15,fontWeight:900,color:T.navy,marginBottom:4}}>No {activeTab.toLowerCase()} notifications</p>
              <p style={{fontSize:12,color:"#A0ABBA"}}>Nothing to display here yet.</p>
            </div>
          )}

          {filtered.map((n,i)=>(
            <div key={n.id} className={`an-notif an-in${n.pinned?" pinned":""}`} style={{animationDelay:`${i*.04}s`}}>
              <div className="an-notif-stripe" style={{background:PRIO_STRIPE[n.priority||"LOW"]||T.teal}}/>

              {n.pinned&&(
                <div className="an-pin"><Pin size={8} style={{fill:"#fff"}}/> PINNED</div>
              )}

              <div style={{display:"flex",alignItems:"flex-start",gap:14,paddingLeft:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5,paddingRight:n.pinned?64:0}}>
                    <h3 className="fd" style={{fontSize:14,fontWeight:800,color:T.navy}}>{n.title}</h3>
                    <span className={`an-prio an-prio-${n.priority||"LOW"}`}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:"currentColor"}}/>
                      {n.priority||"LOW"}
                    </span>
                    {n.status==="SCHEDULED"&&(
                      <span className="an-sched"><Clock size={9}/>{new Date(n.scheduledAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  <p style={{fontSize:13,color:"#475569",lineHeight:1.7,marginBottom:10,whiteSpace:"pre-line"}}>{n.message}</p>

                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {n.attachmentName&&(
                      <span className="an-meta" style={{background:"rgba(99,102,241,.06)",borderColor:"rgba(99,102,241,.2)",color:"#6366F1"}}>
                        <Paperclip size={9}/>{n.attachmentName}
                      </span>
                    )}
                    {n.reqAck&&(
                      <span className="an-meta" style={{background:"rgba(245,158,11,.07)",borderColor:"rgba(245,158,11,.2)",color:"#D97706"}}>
                        <Eye size={9}/>Ack Required
                      </span>
                    )}
                    {n.expiresAt&&(
                      <span className="an-meta" style={{background:"#F1F5F9",borderColor:T.border,color:"#64748B"}}>
                        <Clock size={9}/>Exp {new Date(n.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                    {n.targetDepts?.length>0&&(
                      <span className="an-meta" style={{background:"rgba(0,194,168,.07)",borderColor:"rgba(0,194,168,.2)",color:T.teal}}>
                        Dept · {n.targetDepts.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* actions */}
                <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
                  <button className="an-nact an-nact-e" onClick={()=>handleEdit(n)} title="Edit"><Edit3 size={12} color={T.coral}/></button>
                  {activeTab==="PUBLISHED"&&(
                    <button className="an-nact an-nact-a" onClick={()=>handleArchive(n.id)} title="Archive"><Archive size={12} color={T.teal}/></button>
                  )}
                  <button className="an-nact an-nact-d" onClick={()=>handleDelete(n.id)} title="Delete"><Trash2 size={12} color="#EF4444"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}