
import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { CheckCircle, XCircle, Calendar, Clock, AlertCircle, RefreshCw } from "lucide-react";
/* ── CrewSync design tokens ── */
const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.lm { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.lm .fd { font-family:'Sora',sans-serif; }
.lm-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }

/* request row */
.lm-row { background:#fff; border:1.5px solid ${T.border}; border-radius:14px; padding:14px 16px; transition:all .15s; }
.lm-row:hover { border-color:rgba(139,92,246,.25); box-shadow:0 4px 16px rgba(13,31,45,.07); }

/* action buttons */
.lm-approve { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:9px; border:1.5px solid rgba(6,182,212,.3); background:rgba(6,182,212,.08); color:${T.teal}; font-size:11px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
.lm-approve:hover { background:rgba(6,182,212,.15); border-color:${T.teal}; }
.lm-reject  { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:9px; border:1.5px solid rgba(239,68,68,.25); background:rgba(239,68,68,.06); color:#EF4444; font-size:11px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
.lm-reject:hover  { background:rgba(239,68,68,.12); border-color:#EF4444; }

.lm-empty { padding:40px 20px; text-align:center; border:1.5px dashed ${T.border}; border-radius:14px; background:#FAFBFF; }

@keyframes lmUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.lm-in { animation:lmUp .35s ease both; }

.lm-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
@media(max-width:900px){ .lm-grid{ grid-template-columns:1fr!important; } }
`;

export default function TimeAwayOperations() {
  const [pending, setPending] = useState({ leaveRequests:[], correctionRequests:[] });
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const leavesRes = await api.get("/api/leaves/pending");
      const leaves = leavesRes.data?.data || leavesRes.data || [];
      setPending({
        leaveRequests: Array.isArray(leaves) ? leaves : [],
        correctionRequests: []
      });
    } catch(err) {
      console.error("Error fetching pending:", err);
      setPending({ leaveRequests: [], correctionRequests: [] });
    }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchPending(); },[]);

  const reviewerId = Number(localStorage.getItem("userId")) || 0;

  const approveTimeAway = async id => {
    try {
      await api.put(`/api/leaves/${id}/approve`, { reviewedBy: reviewerId });
      fetchPending();
    } catch(err) { console.error("Failed to approve leave", err); }
  };

  const rejectTimeAway = async id => {
    try {
      await api.put(`/api/leaves/${id}/reject`, { reviewedBy: reviewerId, reason: "Rejected by admin" });
      fetchPending();
    } catch(err) { console.error("Failed to reject leave", err); }
  };

  if (loading) return (
    <div className="lm" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
      <style>{CSS}</style>
      <div style={{textAlign:'center'}}>
        <div style={{width:36,height:36,border:`3px solid ${T.coral}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin .9s linear infinite',margin:'0 auto 12px'}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{fontSize:13,color:'#64748b',fontFamily:'DM Sans'}}>Loading pending requests…</p>
      </div>
    </div>
  );

  const SectionCard = ({ title, sub, count, accent, Icon, children }) => (
    <div className="lm-card lm-in">
      <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:30,height:30,borderRadius:9,background:`rgba(255,255,255,.1)`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon size={15} color='rgba(255,255,255,.8)'/>
          </div>
          <div>
            <p className="fd" style={{fontSize:13,fontWeight:800,color:'#fff'}}>{title}</p>
            <p style={{fontSize:10,color:'rgba(255,255,255,.5)',marginTop:1}}>{sub}</p>
          </div>
        </div>
        <span style={{padding:'3px 10px',borderRadius:999,background:'rgba(139,92,246,.2)',color:T.coral,fontSize:11,fontWeight:700,border:'1px solid rgba(139,92,246,.3)'}}>
          {count} pending
        </span>
      </div>
      <div style={{padding:'16px 18px',display:'flex',flexDirection:'column',gap:10}}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="lm" style={{padding:'0 0 56px'}}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:'22px 26px',position:'relative',overflow:'hidden',marginBottom:22}}>
        <div style={{position:'absolute',top:-50,right:60,width:180,height:180,borderRadius:'50%',background:'rgba(139,92,246,.07)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-30,right:260,width:100,height:100,borderRadius:'50%',background:'rgba(6,182,212,.07)',pointerEvents:'none'}}/>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:'uppercase',letterSpacing:'.12em',marginBottom:4}}>CrewSync · PeopleOps Operations</p>
            <h1 className="fd" style={{fontSize:23,fontWeight:900,color:'#fff',margin:0}}>TimeAway & Presence Requests</h1>
            <p style={{fontSize:13,color:'rgba(255,255,255,.5)',marginTop:4}}>Review pending leave applications and presence correction requests.</p>
          </div>
          <button onClick={fetchPending} style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:11,border:'1px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.08)',color:'#fff',fontSize:12,fontWeight:700,fontFamily:'DM Sans',cursor:'pointer'}}>
            <RefreshCw size={13}/> Refresh
          </button>
        </div>
      </div>

      <div style={{padding:'0 26px'}}>
        {/* KPI row */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}} className="lm-kpi">
          <style>{`@media(max-width:500px){.lm-kpi{grid-template-columns:1fr!important}}`}</style>
          {[
            {emoji:'🗓️',cap:'Pending TimeAways',     val:pending.leaveRequests.length,      accent:T.coral,  bg:'rgba(139,92,246,.08)'},
            {emoji:'⚙️',cap:'Pending Corrections', val:pending.correctionRequests.length, accent:T.teal,   bg:'rgba(6,182,212,.08)'},
          ].map(k=>(
            <div key={k.cap} style={{background:'#fff',border:`1.5px solid ${T.border}`,borderRadius:16,padding:'16px 18px',display:'flex',alignItems:'center',gap:14,boxShadow:'0 2px 10px rgba(13,31,45,.04)'}}>
              <div style={{width:44,height:44,borderRadius:12,background:k.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{k.emoji}</div>
              <div>
                <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:3}}>{k.cap}</p>
                <p className="fd" style={{fontSize:26,fontWeight:900,color:k.accent,lineHeight:1}}>{k.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lm-grid">

          {/* ── LEAVE REQUESTS ── */}
          <SectionCard title="Pending TimeAway Requests" sub="Approve or reject employee leave applications" count={pending.leaveRequests.length} accent={T.coral} Icon={Calendar}>
            {pending.leaveRequests.length===0
              ? <div className="lm-empty"><span style={{fontSize:32,display:'block',marginBottom:8}}>🗓️</span><p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,marginBottom:4}}>No pending leaves</p><p style={{fontSize:12,color:'#94a3b8'}}>All leave requests have been reviewed.</p></div>
              : pending.leaveRequests.map((r,i)=>(
                  <div key={r.id} className="lm-row lm-in" style={{animationDelay:`${i*.05}s`}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
                      <div>
                        <p style={{fontSize:12,color:'#64748b',marginBottom:2}}>Person ID</p>
                        <code style={{fontSize:13,fontWeight:700,color:T.navy,background:'#F1F5F9',padding:'2px 8px',borderRadius:5,border:`1px solid ${T.border}`}}>{r.userId}</code>
                      </div>
                      {r.leaveType&&(
                        <span style={{padding:'3px 10px',borderRadius:999,background:'rgba(139,92,246,.08)',color:T.coral,border:'1px solid rgba(139,92,246,.2)',fontSize:10,fontWeight:700}}>
                          {r.leaveType}
                        </span>
                      )}
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                      <div style={{padding:'8px 10px',borderRadius:9,background:'#F8FAFF',border:`1px solid ${T.border}`}}>
                        <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>Period</p>
                        <p style={{fontSize:12,fontWeight:700,color:T.navy}}>{r.startDate} → {r.endDate}</p>
                      </div>
                      <div style={{padding:'8px 10px',borderRadius:9,background:'#F8FAFF',border:`1px solid ${T.border}`}}>
                        <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>Total Days</p>
                        <p className="fd" style={{fontSize:15,fontWeight:900,color:T.coral}}>{r.totalDays}</p>
                      </div>
                    </div>

                    {r.reason&&(
                      <div style={{padding:'8px 10px',borderRadius:9,background:'rgba(6,182,212,.05)',border:'1px solid rgba(6,182,212,.15)',marginBottom:10}}>
                        <p style={{fontSize:11,color:'#475569',lineHeight:1.65}}><strong style={{color:T.navy}}>Reason: </strong>{r.reason}</p>
                      </div>
                    )}

                    <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                      <button className="lm-approve" onClick={()=>approveTimeAway(r.id)}><CheckCircle size={11}/>Approve</button>
                      <button className="lm-reject"  onClick={()=>rejectTimeAway(r.id)}><XCircle size={11}/>Reject</button>
                    </div>
                  </div>
                ))
            }
          </SectionCard>

          {/* ── CORRECTION REQUESTS ── */}
          <SectionCard title="Pending Correction Requests" sub="Review presence correction / regularization requests" count={pending.correctionRequests.length} accent={T.teal} Icon={Clock}>
            {pending.correctionRequests.length===0
              ? <div className="lm-empty"><span style={{fontSize:32,display:'block',marginBottom:8}}>⚙️</span><p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,marginBottom:4}}>No pending corrections</p><p style={{fontSize:12,color:'#94a3b8'}}>All correction requests have been reviewed.</p></div>
              : pending.correctionRequests.map((r,i)=>(
                  <div key={r.id} className="lm-row lm-in" style={{animationDelay:`${i*.05}s`}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
                      <div>
                        <p style={{fontSize:12,color:'#64748b',marginBottom:2}}>Person ID</p>
                        <code style={{fontSize:13,fontWeight:700,color:T.navy,background:'#F1F5F9',padding:'2px 8px',borderRadius:5,border:`1px solid ${T.border}`}}>{r.userId}</code>
                      </div>
                      <span style={{padding:'3px 10px',borderRadius:999,background:'rgba(6,182,212,.08)',color:T.teal,border:'1px solid rgba(6,182,212,.2)',fontSize:10,fontWeight:700}}>
                        Correction
                      </span>
                    </div>

                    <div style={{padding:'8px 10px',borderRadius:9,background:'#F8FAFF',border:`1px solid ${T.border}`,marginBottom:10}}>
                      <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>Requested At</p>
                      <p style={{fontSize:12,fontWeight:700,color:T.navy}}>{new Date(r.requested_timestamp).toLocaleString()}</p>
                    </div>

                    {r.reason&&(
                      <div style={{padding:'8px 10px',borderRadius:9,background:'rgba(6,182,212,.05)',border:'1px solid rgba(6,182,212,.15)',marginBottom:10}}>
                        <p style={{fontSize:11,color:'#475569',lineHeight:1.65}}><strong style={{color:T.navy}}>Reason: </strong>{r.reason}</p>
                      </div>
                    )}

                    <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                      <button className="lm-approve" onClick={()=>process(r.id,'correction',true)}><CheckCircle size={11}/>Approve</button>
                      <button className="lm-reject"  onClick={()=>process(r.id,'correction',false)}><XCircle size={11}/>Reject</button>
                    </div>
                  </div>
                ))
            }
          </SectionCard>

        </div>
      </div>
    </div>
  );
}