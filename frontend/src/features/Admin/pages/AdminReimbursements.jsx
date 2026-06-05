import React, { useState, useEffect } from "react";
import { DollarSign, CheckCircle, XCircle, CreditCard, Eye, Filter } from "lucide-react";
import api from "@/lib/apiClient";

const T = {
  navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.ar { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.ar .fd { font-family:'Sora',sans-serif; }
.ar-panel { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.ar-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1fr; align-items:center; gap:12px; padding:13px 18px; border-bottom:1px solid ${T.border}; transition:background .15s; }
.ar-row:hover { background:#FAFBFF; }
.ar-row:last-child { border-bottom:none; }
@keyframes arUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.ar-in { animation:arUp .3s ease both; }
.ar-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:999px; font-size:10px; font-weight:700; }
.ar-btn { display:inline-flex; align-items:center; gap:4px; padding:5px 11px; border-radius:8px; border:none; font-size:11px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
.ar-btn:disabled { opacity:.4; cursor:not-allowed; }
`;

const STATUS_STYLE = {
  PENDING:  { bg:"#FFFBEB", color:"#B45309", border:"#FDE68A" },
  APPROVED: { bg:"rgba(0,194,168,.08)", color:"#0D7A6A", border:"rgba(0,194,168,.3)" },
  REJECTED: { bg:"#FEF2F2", color:"#991B1B", border:"#FECACA" },
  PAID:     { bg:"rgba(99,102,241,.08)", color:"#4F46E5", border:"rgba(99,102,241,.25)" },
};

const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
const fmtAmt  = a => a != null ? `₹${Number(a).toLocaleString("en-IN",{minimumFractionDigits:2})}` : "—";

export default function AdminReimbursements() {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filterStatus, setFilter]   = useState("ALL");
  const [selected,   setSelected]   = useState(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [rejectForm, setRejectForm] = useState({ open:false, id:null, reason:"" });

  const adminId = Number(localStorage.getItem("userId") || 0);

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    api.get("/api/reimbursements/all")
      .then(res => {
        const raw = res.data?.data ?? res.data;
        setItems(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  const approve = async (id) => {
    setActionBusy(true);
    try {
      await api.put(`/api/reimbursements/${id}/approve`, { approvedBy: adminId });
      load();
    } catch(e) { alert("Error: " + (e.response?.data?.message || e.message)); }
    finally { setActionBusy(false); }
  };

  const reject = async () => {
    if (!rejectForm.reason.trim()) { alert("Please enter a rejection reason."); return; }
    setActionBusy(true);
    try {
      await api.put(`/api/reimbursements/${rejectForm.id}/reject`, {
        approvedBy: adminId,
        rejectionReason: rejectForm.reason,
      });
      setRejectForm({ open:false, id:null, reason:"" });
      load();
    } catch(e) { alert("Error: " + (e.response?.data?.message || e.message)); }
    finally { setActionBusy(false); }
  };

  const markPaid = async (id) => {
    setActionBusy(true);
    try {
      await api.put(`/api/reimbursements/${id}/mark-paid`);
      load();
    } catch(e) { alert("Error: " + (e.response?.data?.message || e.message)); }
    finally { setActionBusy(false); }
  };

  const filtered = filterStatus === "ALL" ? items : items.filter(i => i.status === filterStatus);

  const stats = {
    total:    items.length,
    pending:  items.filter(i => i.status === "PENDING").length,
    approved: items.filter(i => i.status === "APPROVED").length,
    paid:     items.filter(i => i.status === "PAID").length,
    totalAmt: items.filter(i => i.status !== "REJECTED").reduce((s,i) => s + Number(i.amount||0), 0),
  };

  return (
    <div className="ar" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(255,107,53,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>SamayaHR · Finance</p>
          <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Reimbursements</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>Review and process employee reimbursement claims</p>
        </div>
      </div>

      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          {[
            { label:"Total Claims",   val:stats.total,    color:T.navy },
            { label:"Pending",        val:stats.pending,  color:"#B45309" },
            { label:"Approved",       val:stats.approved, color:T.teal },
            { label:"Paid",           val:stats.paid,     color:"#4F46E5" },
            { label:"Total Amount",   val:fmtAmt(stats.totalAmt), color:T.coral },
          ].map(s => (
            <div key={s.label} style={{background:"#fff",border:`1.5px solid ${T.border}`,borderRadius:14,padding:"14px 16px"}}>
              <p style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{s.label}</p>
              <p className="fd" style={{fontSize:20,fontWeight:900,color:s.color,margin:0}}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <Filter size={13} color="#94a3b8"/>
          {["ALL","PENDING","APPROVED","REJECTED","PAID"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{padding:"5px 13px",borderRadius:8,border:`1.5px solid ${filterStatus===f ? T.coral : T.border}`,
                background: filterStatus===f ? `rgba(255,107,53,.08)` : "#fff",
                color: filterStatus===f ? T.coral : "#64748b",
                fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}}>
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="ar-panel ar-in">
          <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
            <DollarSign size={15} color={T.coral}/>
            <p className="fd" style={{fontSize:13,fontWeight:800,color:"#fff"}}>Claims</p>
            <span style={{marginLeft:"auto",padding:"2px 9px",borderRadius:999,background:"rgba(255,107,53,.2)",color:T.coral,fontSize:10,fontWeight:700}}>
              {filtered.length}
            </span>
          </div>

          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:12,padding:"10px 18px",borderBottom:`1.5px solid ${T.border}`,background:"#FAFBFF"}}>
            {["Employee","Type","Amount","Date","Actions"].map(h => (
              <p key={h} style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",margin:0}}>{h}</p>
            ))}
          </div>

          {loading ? (
            <div style={{padding:"40px",textAlign:"center"}}>
              <p style={{fontSize:13,color:"#94a3b8"}}>Loading…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{padding:"40px",textAlign:"center"}}>
              <p style={{fontSize:13,color:"#94a3b8"}}>No reimbursements found.</p>
            </div>
          ) : (
            filtered.map(item => {
              const st = STATUS_STYLE[item.status] || STATUS_STYLE.PENDING;
              return (
                <div key={item.id} className="ar-row">
                  <div>
                    <p style={{fontSize:13,fontWeight:700,color:T.navy,margin:0}}>Employee #{item.userId}</p>
                    <p style={{fontSize:11,color:"#94a3b8",margin:"2px 0 0"}}>{item.description?.slice(0,50)}{item.description?.length>50?"…":""}</p>
                  </div>
                  <p style={{fontSize:12,color:"#64748b",margin:0}}>{item.reimbursementType || "—"}</p>
                  <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,margin:0}}>{fmtAmt(item.amount)}</p>
                  <div>
                    <span className="ar-badge" style={{background:st.bg,color:st.color,border:`1px solid ${st.border}`}}>{item.status}</span>
                    <p style={{fontSize:10,color:"#94a3b8",margin:"3px 0 0"}}>{fmtDate(item.expenseDate)}</p>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    <button className="ar-btn" onClick={() => setSelected(item)}
                      style={{background:"rgba(13,31,45,.06)",color:T.navy}}>
                      <Eye size={10}/> View
                    </button>
                    {item.status === "PENDING" && (
                      <>
                        <button className="ar-btn" disabled={actionBusy} onClick={() => approve(item.id)}
                          style={{background:"rgba(0,194,168,.1)",color:"#0D7A6A"}}>
                          <CheckCircle size={10}/> Approve
                        </button>
                        <button className="ar-btn" disabled={actionBusy}
                          onClick={() => setRejectForm({ open:true, id:item.id, reason:"" })}
                          style={{background:"rgba(239,68,68,.08)",color:"#991B1B"}}>
                          <XCircle size={10}/> Reject
                        </button>
                      </>
                    )}
                    {item.status === "APPROVED" && (
                      <button className="ar-btn" disabled={actionBusy} onClick={() => markPaid(item.id)}
                        style={{background:"rgba(99,102,241,.1)",color:"#4F46E5"}}>
                        <CreditCard size={10}/> Mark Paid
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
          <div style={{background:"#fff",borderRadius:18,padding:28,width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}
            onClick={e => e.stopPropagation()}>
            <p className="fd" style={{fontSize:16,fontWeight:900,color:T.navy,marginBottom:18}}>Reimbursement Details</p>
            {[
              ["Employee ID", selected.employeeId || selected.employeeCode || selected.userId],
              ["Type", selected.reimbursementType],
              ["Amount", fmtAmt(selected.amount)],
              ["Expense Date", fmtDate(selected.expenseDate)],
              ["Status", selected.status],
              ["Submitted On", fmtDate(selected.createdAt)],
              ["Approved By", selected.approvedBy || "—"],
              ["Approved At", fmtDate(selected.approvedAt)],
              ["Payment Date", fmtDate(selected.paymentDate)],
              ["Rejection Reason", selected.rejectionReason || "—"],
            ].map(([label, val]) => (
              <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <p style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",margin:0}}>{label}</p>
                <p style={{fontSize:12,fontWeight:700,color:T.navy,margin:0,textAlign:"right",maxWidth:"60%"}}>{String(val)}</p>
              </div>
            ))}
            {selected.description && (
              <div style={{marginTop:14,padding:14,background:"#FAFBFF",borderRadius:10,border:`1.5px solid ${T.border}`}}>
                <p style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Description</p>
                <p style={{fontSize:12,color:"#475569",lineHeight:1.7,margin:0}}>{selected.description}</p>
              </div>
            )}
            <button onClick={() => setSelected(null)}
              style={{marginTop:18,width:"100%",padding:"10px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectForm.open && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}
          onClick={() => setRejectForm({ open:false, id:null, reason:"" })}>
          <div style={{background:"#fff",borderRadius:18,padding:28,width:"100%",maxWidth:400}}
            onClick={e => e.stopPropagation()}>
            <p className="fd" style={{fontSize:15,fontWeight:900,color:T.navy,marginBottom:14}}>Reject Reimbursement</p>
            <label style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:6}}>
              Rejection Reason *
            </label>
            <textarea value={rejectForm.reason} onChange={e => setRejectForm(p => ({...p,reason:e.target.value}))}
              rows={3} placeholder="Enter reason for rejection…"
              style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"10px 13px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:T.navy,resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={() => setRejectForm({ open:false, id:null, reason:"" })}
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
