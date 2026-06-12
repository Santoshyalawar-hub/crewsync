import React, { useState, useEffect } from "react";
import { LogOut, CheckCircle, XCircle, Clock, AlertCircle, Eye, ChevronRight } from "lucide-react";
import api from "@/lib/apiClient";

const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.aex { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.aex .fd { font-family:'Sora',sans-serif; }
.aex-panel { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.aex-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1.5fr; align-items:center; gap:12px; padding:13px 18px; border-bottom:1px solid ${T.border}; transition:background .15s; }
.aex-row:hover { background:#FAFBFF; }
.aex-row:last-child { border-bottom:none; }
@keyframes aexUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.aex-in { animation:aexUp .3s ease both; }
.aex-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:999px; font-size:10px; font-weight:700; white-space:nowrap; }
.aex-btn { display:inline-flex; align-items:center; gap:4px; padding:5px 11px; border-radius:8px; border:none; font-size:11px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
.aex-btn:disabled { opacity:.4; cursor:not-allowed; }
`;

const STATUS_CFG = {
  PENDING:              { icon:Clock,        bg:"#FFFBEB", color:"#B45309", border:"#FDE68A",            label:"Pending" },
  TEAM_LEADER_APPROVED: { icon:CheckCircle,  bg:"rgba(139,92,246,.07)", color:T.coral, border:"rgba(139,92,246,.25)", label:"TL Approved" },
  TEAM_LEADER_REJECTED: { icon:XCircle,      bg:"#FEF2F2", color:"#991B1B", border:"#FECACA",            label:"TL Rejected" },
  PeopleOps_APPROVED:          { icon:CheckCircle,  bg:"rgba(6,182,212,.07)", color:T.teal, border:"rgba(6,182,212,.25)",  label:"PeopleOps Approved" },
  PeopleOps_REJECTED:          { icon:XCircle,      bg:"#FEF2F2", color:"#991B1B", border:"#FECACA",            label:"PeopleOps Rejected" },
  IN_PROGRESS:          { icon:AlertCircle,  bg:"rgba(99,102,241,.07)", color:"#4F46E5", border:"rgba(99,102,241,.2)", label:"In Progress" },
  COMPLETED:            { icon:CheckCircle,  bg:"rgba(6,182,212,.08)", color:T.teal, border:"rgba(6,182,212,.3)",  label:"Completed" },
};

const EXIT_TYPE_LABEL = { RESIGNATION:"Resignation", TERMINATION:"Termination", RETIREMENT:"Retirement" };

const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
const fmtDateTime = d => d ? new Date(d).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—";

// What action label to show based on current status
const nextActionLabel = status => ({
  PENDING: "Approve (TL)",
  TEAM_LEADER_APPROVED: "Approve (PeopleOps)",
  PeopleOps_APPROVED: "Start Clearance",
  IN_PROGRESS: "Mark Completed",
}[status] || null);

export default function OperatorExitRequests() {
  const [items,       setItems]      = useState([]);
  const [loading,     setLoading]    = useState(true);
  const [filterStatus,setFilter]     = useState("ALL");
  const [selected,    setSelected]   = useState(null);
  const [actionBusy,  setActionBusy] = useState(false);
  const [rejectModal, setRejectModal]= useState({ open:false, id:null, reason:"" });
  const [approveModal,setApproveModal]= useState({ open:false, id:null, comments:"" });

  const tenantCode = localStorage.getItem("tenantCode") || "";

  useEffect(() => { if (tenantCode) load(); }, [tenantCode]);

  const load = () => {
    setLoading(true);
    api.get("/api/employee/exit-requests/all", { params:{ tenantCode } })
      .then(res => {
        const raw = res.data?.data ?? res.data;
        setItems(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  const approve = async () => {
    setActionBusy(true);
    try {
      await api.patch(`/api/employee/exit-requests/${approveModal.id}/approve`, {
        comments: approveModal.comments,
      });
      setApproveModal({ open:false, id:null, comments:"" });
      load();
    } catch(e) { alert("Error: " + (e.response?.data?.message || e.message)); }
    finally { setActionBusy(false); }
  };

  const reject = async () => {
    if (!rejectModal.reason.trim()) { alert("Please enter a rejection reason."); return; }
    setActionBusy(true);
    try {
      await api.patch(`/api/employee/exit-requests/${rejectModal.id}/reject`, {
        rejectionReason: rejectModal.reason,
      });
      setRejectModal({ open:false, id:null, reason:"" });
      load();
    } catch(e) { alert("Error: " + (e.response?.data?.message || e.message)); }
    finally { setActionBusy(false); }
  };

  const filtered = filterStatus === "ALL" ? items : items.filter(i => i.status === filterStatus);

  const stats = {
    total:    items.length,
    pending:  items.filter(i => i.status === "PENDING").length,
    inReview: items.filter(i => ["TEAM_LEADER_APPROVED","PeopleOps_APPROVED","IN_PROGRESS"].includes(i.status)).length,
    completed:items.filter(i => i.status === "COMPLETED").length,
    rejected: items.filter(i => ["TEAM_LEADER_REJECTED","PeopleOps_REJECTED"].includes(i.status)).length,
  };

  return (
    <div className="aex" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(139,92,246,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>CrewSync · PeopleOps Operations</p>
          <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Exit Requests</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>Manage employee resignation, termination and retirement requests</p>
        </div>
      </div>

      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
          {[
            { label:"Total",     val:stats.total,     color:T.navy },
            { label:"Pending",   val:stats.pending,   color:"#B45309" },
            { label:"In Review", val:stats.inReview,  color:"#4F46E5" },
            { label:"Completed", val:stats.completed, color:T.teal },
            { label:"Rejected",  val:stats.rejected,  color:"#DC2626" },
          ].map(s => (
            <div key={s.label} style={{background:"#fff",border:`1.5px solid ${T.border}`,borderRadius:14,padding:"14px 16px"}}>
              <p style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{s.label}</p>
              <p className="fd" style={{fontSize:22,fontWeight:900,color:s.color,margin:0}}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["ALL","PENDING","TEAM_LEADER_APPROVED","PeopleOps_APPROVED","IN_PROGRESS","COMPLETED","TEAM_LEADER_REJECTED","PeopleOps_REJECTED"].map(f => {
            const cfg = STATUS_CFG[f];
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{padding:"5px 12px",borderRadius:8,
                  border:`1.5px solid ${filterStatus===f ? T.coral : T.border}`,
                  background: filterStatus===f ? "rgba(139,92,246,.08)" : "#fff",
                  color: filterStatus===f ? T.coral : "#64748b",
                  fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}}>
                {cfg ? cfg.label : "All"}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="aex-panel aex-in">
          <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
            <LogOut size={15} color={T.coral}/>
            <p className="fd" style={{fontSize:13,fontWeight:800,color:"#fff"}}>Exit Requests</p>
            <span style={{marginLeft:"auto",padding:"2px 9px",borderRadius:999,background:"rgba(139,92,246,.2)",color:T.coral,fontSize:10,fontWeight:700}}>
              {filtered.length}
            </span>
          </div>

          {/* Col headers */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr",gap:12,padding:"10px 18px",borderBottom:`1.5px solid ${T.border}`,background:"#FAFBFF"}}>
            {["Person","Exit Type","Last Day","Status","Actions"].map(h => (
              <p key={h} style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",margin:0}}>{h}</p>
            ))}
          </div>

          {loading ? (
            <div style={{padding:"40px",textAlign:"center"}}><p style={{fontSize:13,color:"#94a3b8"}}>Loading…</p></div>
          ) : filtered.length === 0 ? (
            <div style={{padding:"40px",textAlign:"center"}}><p style={{fontSize:13,color:"#94a3b8"}}>No exit requests found.</p></div>
          ) : (
            filtered.map(item => {
              const cfg = STATUS_CFG[item.status] || STATUS_CFG.PENDING;
              const nextLabel = nextActionLabel(item.status);
              const canReject = ["PENDING","TEAM_LEADER_APPROVED"].includes(item.status);
              return (
                <div key={item.id} className="aex-row">
                  <div>
                    <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,margin:0}}>{item.employeeName || `Person #${item.userId}`}</p>
                    <p style={{fontSize:11,color:"#94a3b8",margin:"2px 0 0"}}>{item.employeeCode} · {item.department}</p>
                    <p style={{fontSize:10,color:"#b0bec5",margin:"2px 0 0"}}>Applied: {fmtDate(item.appliedOn)}</p>
                  </div>
                  <p style={{fontSize:12,color:"#64748b",margin:0,fontWeight:600}}>{EXIT_TYPE_LABEL[item.exitType] || item.exitType}</p>
                  <p style={{fontSize:12,color:T.navy,fontWeight:700,margin:0}}>{fmtDate(item.lastWorkingDay)}</p>
                  <span className="aex-badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.border}`}}>
                    {cfg.label}
                  </span>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    <button className="aex-btn" onClick={() => setSelected(item)}
                      style={{background:"rgba(13,31,45,.06)",color:T.navy}}>
                      <Eye size={10}/> View
                    </button>
                    {nextLabel && (
                      <button className="aex-btn" disabled={actionBusy}
                        onClick={() => setApproveModal({ open:true, id:item.id, comments:"" })}
                        style={{background:"rgba(6,182,212,.1)",color:"#0D7A6A"}}>
                        <CheckCircle size={10}/> {nextLabel}
                      </button>
                    )}
                    {canReject && (
                      <button className="aex-btn" disabled={actionBusy}
                        onClick={() => setRejectModal({ open:true, id:item.id, reason:"" })}
                        style={{background:"rgba(239,68,68,.08)",color:"#991B1B"}}>
                        <XCircle size={10}/> Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}
          onClick={() => setSelected(null)}>
          <div style={{background:"#fff",borderRadius:18,padding:28,width:"100%",maxWidth:520,maxHeight:"85vh",overflowY:"auto"}}
            onClick={e => e.stopPropagation()}>
            <p className="fd" style={{fontSize:16,fontWeight:900,color:T.navy,marginBottom:18}}>Exit Request Details</p>
            {[
              ["Person", selected.employeeName || `#${selected.userId}`],
              ["Person Code", selected.employeeCode || "—"],
              ["Department", selected.department || "—"],
              ["Exit Type", EXIT_TYPE_LABEL[selected.exitType] || selected.exitType],
              ["Reason", selected.reason],
              ["Last Working Day", fmtDate(selected.lastWorkingDay)],
              ["Applied On", fmtDateTime(selected.appliedOn)],
              ["Status", STATUS_CFG[selected.status]?.label || selected.status],
              ["TL Reviewed At", fmtDateTime(selected.teamLeaderReviewedAt)],
              ["TL Comments", selected.teamLeaderComments || "—"],
              ["PeopleOps Reviewed At", fmtDateTime(selected.hrReviewedAt)],
              ["PeopleOps Comments", selected.hrComments || "—"],
              ["Rejection Reason", selected.rejectionReason || "—"],
              ["Clearance At", fmtDateTime(selected.clearanceCompletedAt)],
              ["Completed At", fmtDateTime(selected.completedAt)],
            ].map(([label, val]) => (
              <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <p style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",margin:0,flexShrink:0}}>{label}</p>
                <p style={{fontSize:12,fontWeight:700,color:T.navy,margin:0,textAlign:"right",maxWidth:"60%",wordBreak:"break-word"}}>{String(val ?? "—")}</p>
              </div>
            ))}
            {selected.comments && (
              <div style={{marginTop:14,padding:14,background:"#FAFBFF",borderRadius:10,border:`1.5px solid ${T.border}`}}>
                <p style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Additional Comments</p>
                <p style={{fontSize:12,color:"#475569",lineHeight:1.7,margin:0}}>{selected.comments}</p>
              </div>
            )}
            <button onClick={() => setSelected(null)}
              style={{marginTop:18,width:"100%",padding:"10px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal.open && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}
          onClick={() => setApproveModal({ open:false, id:null, comments:"" })}>
          <div style={{background:"#fff",borderRadius:18,padding:28,width:"100%",maxWidth:400}}
            onClick={e => e.stopPropagation()}>
            <p className="fd" style={{fontSize:15,fontWeight:900,color:T.navy,marginBottom:14}}>Approve Exit Request</p>
            <label style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:6}}>
              Comments (optional)
            </label>
            <textarea value={approveModal.comments} onChange={e => setApproveModal(p => ({...p,comments:e.target.value}))}
              rows={3} placeholder="Add any comments…"
              style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"10px 13px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:T.navy,resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={() => setApproveModal({ open:false, id:null, comments:"" })}
                style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                Cancel
              </button>
              <button onClick={approve} disabled={actionBusy}
                style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${T.teal},#0D9488)`,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:actionBusy?.5:1}}>
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}
          onClick={() => setRejectModal({ open:false, id:null, reason:"" })}>
          <div style={{background:"#fff",borderRadius:18,padding:28,width:"100%",maxWidth:400}}
            onClick={e => e.stopPropagation()}>
            <p className="fd" style={{fontSize:15,fontWeight:900,color:T.navy,marginBottom:14}}>Reject Exit Request</p>
            <label style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:6}}>
              Rejection Reason *
            </label>
            <textarea value={rejectModal.reason} onChange={e => setRejectModal(p => ({...p,reason:e.target.value}))}
              rows={3} placeholder="Enter reason for rejection…"
              style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"10px 13px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:T.navy,resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={() => setRejectModal({ open:false, id:null, reason:"" })}
                style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                Cancel
              </button>
              <button onClick={reject} disabled={actionBusy}
                style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#EF4444,#DC2626)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:actionBusy?.5:1}}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
