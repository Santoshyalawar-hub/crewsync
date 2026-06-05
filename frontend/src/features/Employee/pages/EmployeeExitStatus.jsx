import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, CheckCircle, AlertCircle, XCircle, Calendar,
  FileText, User, ArrowLeft, MessageSquare, Building,
  Mail, Phone, Loader2,
} from "lucide-react";
import api from "@/lib/apiClient";

/* ── SamayaHR design tokens ── */
const T = {
  navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
  bg:"#F5F7FB", border:"#E8ECF2",
};


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.es { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.es .fd { font-family:'Sora',sans-serif; }
.es-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }

.es-field-label { font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em; display:flex; align-items:center; gap:5px; margin-bottom:5px; }
.es-field-val   { font-size:14px; font-weight:700; color:${T.navy}; font-family:'Sora',sans-serif; }

/* timeline */
.es-tl-line { position:absolute; left:15px; top:32px; bottom:8px; width:1.5px; background:${T.border}; }
.es-tl-dot  { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; position:relative; z-index:1; border:2.5px solid; transition:all .2s; }

@keyframes esUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.es-in { animation:esUp .35s ease both; }

.es-grid { display:grid; grid-template-columns:1fr 320px; gap:20px; }
@media(max-width:900px){ .es-grid{ grid-template-columns:1fr!important; } }

.es-fields-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
@media(max-width:600px){ .es-fields-grid{ grid-template-columns:1fr!important; } }

.es-btn-primary { display:inline-flex; align-items:center; gap:7px; padding:10px 22px; border-radius:11px; border:none; background:linear-gradient(135deg,${T.coral},#ff8c5a); color:#fff; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; box-shadow:0 4px 14px rgba(255,107,53,.3); transition:all .15s; }
.es-btn-primary:hover { transform:translateY(-1px); }
.es-btn-ghost { display:inline-flex; align-items:center; gap:7px; padding:8px 16px; border-radius:10px; border:1.5px solid ${T.border}; background:#fff; color:#64748b; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
.es-btn-ghost:hover { border-color:${T.coral}; color:${T.coral}; }
`;

const STATUS_CFG = {
  PENDING:               { icon:Clock,        bg:"#FFFBEB", color:"#B45309", border:"#FDE68A", dot:"#F59E0B",  msg:"Your request is being reviewed by your Team Leader." },
  TEAM_LEADER_APPROVED:  { icon:CheckCircle,  bg:"rgba(255,107,53,.07)", color:T.coral,  border:"rgba(255,107,53,.25)", dot:T.coral,   msg:"Team Leader approved. Awaiting HR approval." },
  TEAM_LEADER_REJECTED:  { icon:XCircle,      bg:"#FEF2F2", color:"#991B1B", border:"#FECACA", dot:"#EF4444", msg:"Your request was rejected by Team Leader." },
  HR_APPROVED:           { icon:CheckCircle,  bg:"rgba(0,194,168,.07)", color:T.teal,   border:"rgba(0,194,168,.25)", dot:T.teal,    msg:"Your exit request has been approved by HR." },
  HR_REJECTED:           { icon:XCircle,      bg:"#FEF2F2", color:"#991B1B", border:"#FECACA", dot:"#EF4444", msg:"Your request was rejected by HR." },
  IN_PROGRESS:           { icon:AlertCircle,  bg:"rgba(99,102,241,.07)", color:"#4F46E5", border:"rgba(99,102,241,.2)", dot:"#6366F1", msg:"Your exit clearance is in progress." },
  COMPLETED:             { icon:CheckCircle,  bg:"rgba(0,194,168,.08)", color:T.teal,   border:"rgba(0,194,168,.3)", dot:T.teal,    msg:"Exit process completed successfully." },
};

const fmtDate = d => new Date(d).toLocaleDateString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric'});

const formatExitType = t => ({RESIGNATION:"Resignation",TERMINATION:"Termination",RETIREMENT:"Retirement"}[t]||t);
const formatReason   = r => ({BETTER_OPPORTUNITY:"Better opportunity",PERSONAL_REASONS:"Personal reasons",HEALTH_ISSUES:"Health issues",RELOCATION:"Relocation",CAREER_CHANGE:"Career change",HIGHER_EDUCATION:"Higher education",OTHER:"Other"}[r]||r);

export default function EmployeeExitStatus() {
  const navigate = useNavigate();
  const [exitStatus, setExitStatus] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(()=>{ fetchExitStatus(); },[]);

  const fetchExitStatus = async () => {
    setLoading(true); setError(null);
    const userId = localStorage.getItem("userId");
    if (!userId) { navigate("/login"); return; }
    try {
      const res  = await api.get("/api/employee/exit-request/status");
      const data = res.data;
      if (data.success) setExitStatus(data.data);
      else throw new Error(data.message||"No exit request found");
    } catch(err) { console.error(err); setError(err.message); }
    finally { setLoading(false); }
  };

  /* ── loading ── */
  if (loading) return (
    <div className="es" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:38,height:38,border:`3px solid ${T.coral}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .9s linear infinite",margin:"0 auto 12px"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{fontSize:13,color:"#64748b",fontFamily:"DM Sans"}}>Loading exit status…</p>
      </div>
    </div>
  );

  /* ── empty / error ── */
  if (error||!exitStatus) return (
    <div className="es" style={{padding:"40px 26px"}}>
      <div style={{maxWidth:480,margin:"0 auto",textAlign:"center",padding:"40px 28px",background:"#fff",borderRadius:20,border:`1.5px solid ${T.border}`,boxShadow:"0 2px 14px rgba(13,31,45,.05)"}}>
        <span style={{fontSize:52,display:"block",marginBottom:16}}>📭</span>
        <p className="fd" style={{fontSize:18,fontWeight:900,color:T.navy,marginBottom:8}}>No Exit Request Found</p>
        <p style={{fontSize:13,color:"#64748b",marginBottom:24}}>{error||"You haven't submitted an exit request yet."}</p>
        <button onClick={()=>navigate("/employee/exit")} className="es-btn-primary">
          Submit Exit Request
        </button>
      </div>
    </div>
  );

  const cfg        = STATUS_CFG[exitStatus.status] || STATUS_CFG.PENDING;
  const StatusIcon = cfg.icon;

  const TIMELINE = [
    { title:"Request Submitted",   date:fmtDate(exitStatus.appliedOn), done:true },
    { title:"Team Leader Review",  date:exitStatus.teamLeaderApprovedAt?fmtDate(exitStatus.teamLeaderApprovedAt):"In Progress", done:["TEAM_LEADER_APPROVED","HR_APPROVED","IN_PROGRESS","COMPLETED"].includes(exitStatus.status) },
    { title:"HR Approval",         date:exitStatus.hrApprovedAt?fmtDate(exitStatus.hrApprovedAt):"Awaiting",                   done:["HR_APPROVED","IN_PROGRESS","COMPLETED"].includes(exitStatus.status) },
    { title:"Exit Clearance",      date:"Pending",                                                                              done:["IN_PROGRESS","COMPLETED"].includes(exitStatus.status) },
    { title:"Final Settlement",    date:exitStatus.status==="COMPLETED"?fmtDate(exitStatus.lastWorkingDay):"Pending",          done:exitStatus.status==="COMPLETED" },
  ];

  return (
    <div className="es" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(255,107,53,.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,right:260,width:100,height:100,borderRadius:"50%",background:"rgba(0,194,168,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:13,background:cfg.bg,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${cfg.border}`}}>
              <StatusIcon size={20} color={cfg.color}/>
            </div>
            <div>
              <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:3}}>SamayaHR · HR</p>
              <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Exit Request Status</h1>
              <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:3}}>Track your exit request and clearance process.</p>
            </div>
          </div>
          <button onClick={()=>navigate("/employee/exit")} className="es-btn-ghost"
            style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",color:"#fff"}}>
            <ArrowLeft size={13}/> Back to Form
          </button>
        </div>
      </div>

      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

        {/* status banner */}
        <div className="es-in" style={{padding:"13px 16px",borderRadius:12,background:cfg.bg,border:`1.5px solid ${cfg.border}`,display:"flex",alignItems:"center",gap:10}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:cfg.dot,flexShrink:0}}/>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:cfg.color}}>{cfg.msg}</p>
            <p style={{fontSize:11,color:cfg.color,opacity:.7,marginTop:2}}>Processing time: 2–3 business days</p>
          </div>
        </div>

        <div className="es-grid">

          {/* ── DETAILS CARD ── */}
          <div className="es-card es-in">
            <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:"14px 20px",display:"flex",alignItems:"center",gap:9}}>
              <FileText size={15} color="rgba(255,255,255,.7)"/>
              <p className="fd" style={{fontSize:14,fontWeight:800,color:"#fff"}}>Request Details</p>
            </div>
            <div style={{padding:"20px 22px"}}>

              {/* status pill */}
              <div style={{marginBottom:20}}>
                <p className="es-field-label">Current Status</p>
                <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:999,background:cfg.bg,color:cfg.color,border:`1.5px solid ${cfg.border}`,fontSize:12,fontWeight:700}}>
                  <StatusIcon size={12}/>{exitStatus.status.replace(/_/g,' ')}
                </span>
              </div>

              <div className="es-fields-grid">
                <div>
                  <p className="es-field-label"><FileText size={10}/>Exit Type</p>
                  <p className="es-field-val">{formatExitType(exitStatus.exitType)}</p>
                </div>
                <div>
                  <p className="es-field-label"><MessageSquare size={10}/>Reason</p>
                  <p className="es-field-val">{formatReason(exitStatus.reason)}</p>
                </div>
                <div>
                  <p className="es-field-label"><Calendar size={10}/>Last Working Day</p>
                  <p className="es-field-val">{fmtDate(exitStatus.lastWorkingDay)}</p>
                </div>
                <div>
                  <p className="es-field-label"><Clock size={10}/>Applied On</p>
                  <p className="es-field-val">{fmtDate(exitStatus.appliedOn)}</p>
                </div>
                {exitStatus.teamLeaderName&&(
                  <div>
                    <p className="es-field-label"><User size={10}/>Team Leader</p>
                    <p className="es-field-val">{exitStatus.teamLeaderName}</p>
                  </div>
                )}
              </div>

              {/* comments */}
              {exitStatus.comments&&(
                <div style={{marginTop:18,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
                  <p className="es-field-label"><MessageSquare size={10}/>Your Comments</p>
                  <div style={{padding:"12px 14px",borderRadius:10,background:"#F8FAFF",border:`1.5px solid ${T.border}`}}>
                    <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}>{exitStatus.comments}</p>
                  </div>
                </div>
              )}

              {/* rejection */}
              {(exitStatus.status==='TEAM_LEADER_REJECTED'||exitStatus.status==='HR_REJECTED')&&exitStatus.rejectionReason&&(
                <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
                  <p className="es-field-label" style={{color:"#EF4444"}}><XCircle size={10}/>Rejection Reason</p>
                  <div style={{padding:"12px 14px",borderRadius:10,background:"#FEF2F2",border:"1.5px solid #FECACA"}}>
                    <p style={{fontSize:13,color:"#991B1B",fontWeight:600,lineHeight:1.7}}>{exitStatus.rejectionReason}</p>
                  </div>
                </div>
              )}

              <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"flex-end"}}>
                <button onClick={()=>window.print()} className="es-btn-primary">
                  <FileText size={13}/> Print Status
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: TIMELINE + HELP ── */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* timeline */}
            <div className="es-card es-in" style={{animationDelay:".06s"}}>
              <div style={{background:"linear-gradient(135deg,#6366F1,#7C3AED)",padding:"14px 20px"}}>
                <p className="fd" style={{fontSize:14,fontWeight:800,color:"#fff"}}>Exit Timeline</p>
              </div>
              <div style={{padding:"18px 20px",position:"relative"}}>
                <div className="es-tl-line"/>
                <div style={{display:"flex",flexDirection:"column",gap:18}}>
                  {TIMELINE.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:12,position:"relative"}}>
                      <div className="es-tl-dot" style={{
                        background:item.done?T.teal:"#fff",
                        borderColor:item.done?T.teal:T.border,
                        boxShadow:item.done?`0 0 0 3px rgba(0,194,168,.15)`:"none",
                      }}>
                        {item.done&&<CheckCircle size={14} color="#fff"/>}
                      </div>
                      <div style={{paddingTop:4}}>
                        <p style={{fontSize:12,fontWeight:700,color:item.done?T.navy:"#94a3b8"}}>{item.title}</p>
                        <p style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* help */}
            <div className="es-card es-in" style={{animationDelay:".1s"}}>
              <div style={{background:`linear-gradient(135deg,${T.coral},#ff8c5a)`,padding:"14px 20px"}}>
                <p className="fd" style={{fontSize:14,fontWeight:800,color:"#fff"}}>Need Assistance?</p>
              </div>
              <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {Icon:Mail,    label:"Email Support", val:"hr@company.com",       href:"mailto:hr@company.com"},
                  {Icon:Phone,   label:"Phone Support",  val:"+1 (234) 567-8900",   href:"tel:+1234567890"},
                  {Icon:Building,label:"Office Hours",   val:"Mon–Fri, 9 AM–6 PM",  href:null},
                ].map(row=>(
                  <div key={row.label} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:9,background:"rgba(255,107,53,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <row.Icon size={14} color={T.coral}/>
                    </div>
                    <div>
                      <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",marginBottom:2}}>{row.label}</p>
                      {row.href
                        ? <a href={row.href} style={{fontSize:12,fontWeight:700,color:T.navy,textDecoration:"none"}}>{row.val}</a>
                        : <p style={{fontSize:12,fontWeight:700,color:T.navy}}>{row.val}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}