import React, { useState, useEffect } from "react";
import { FileText, Download, Eye, RefreshCw, Search } from "lucide-react";
import api from "@/lib/apiClient";

const T = {
  navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.aps { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.aps .fd { font-family:'Sora',sans-serif; }
.aps-panel { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.aps-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1.5fr; align-items:center; gap:12px; padding:13px 18px; border-bottom:1px solid ${T.border}; }
.aps-row:hover { background:#FAFBFF; }
.aps-row:last-child { border-bottom:none; }
@keyframes apsUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.aps-in { animation:apsUp .3s ease both; }
.aps-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:999px; font-size:10px; font-weight:700; }
.aps-btn { display:inline-flex; align-items:center; gap:4px; padding:5px 11px; border-radius:8px; border:none; font-size:11px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
.aps-btn:disabled { opacity:.4; cursor:not-allowed; }
.aps-input { border:1.5px solid ${T.border}; border-radius:10px; padding:8px 13px; font-size:12px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; background:#fff; }
.aps-input:focus { border-color:${T.coral}; }
`;

const STATUS_STYLE = {
  PENDING:   { bg:"#FFFBEB",               color:"#B45309", border:"#FDE68A" },
  APPROVED:  { bg:"rgba(0,194,168,.08)",   color:"#0D7A6A", border:"rgba(0,194,168,.3)" },
  PAID:      { bg:"rgba(99,102,241,.08)",  color:"#4F46E5", border:"rgba(99,102,241,.25)" },
  LOCKED:    { bg:"rgba(13,31,45,.06)",    color:T.navy,    border:"rgba(13,31,45,.15)" },
  CANCELLED: { bg:"#FEF2F2",              color:"#991B1B", border:"#FECACA" },
};

const fmtDate  = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
const fmtAmt   = a => a != null ? `₹${Number(a).toLocaleString("en-IN",{minimumFractionDigits:0})}` : "—";

export default function AdminPayslipManagement() {
  const [records,   setRecords]  = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [search,    setSearch]   = useState("");
  const [generating,setGen]      = useState({});

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    api.get("/api/payroll")
      .then(res => {
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.content) ? raw.content : [];
        setRecords(list);
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  };

  const generatePayslip = async (id) => {
    setGen(p => ({...p,[id]:true}));
    try {
      await api.post(`/api/payroll/${id}/generate-payslip`);
      load();
    } catch(e) { alert("Error generating payslip: " + (e.response?.data?.message || e.message)); }
    finally { setGen(p => ({...p,[id]:false})); }
  };

  const normalize = r => ({
    id: r.id,
    userName: r.userName || r.user_name || r.employeeName || `Employee #${r.userId}`,
    payrollMonth: r.payrollMonth || r.payroll_month || "",
    netSalary: r.netSalary || r.net_salary || 0,
    status: r.status || "PENDING",
    payslipGenerated: r.payslipGenerated || r.payslip_generated || false,
    payslipPath: r.payslipPath || r.payslip_path || null,
  });

  const filtered = records
    .map(normalize)
    .filter(r => !search || r.userName.toLowerCase().includes(search.toLowerCase()) ||
                            r.payrollMonth.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total:     records.length,
    generated: records.filter(r => r.payslipGenerated || r.payslip_generated).length,
    pending:   records.filter(r => !(r.payslipGenerated || r.payslip_generated)).length,
  };

  return (
    <div className="aps" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(255,107,53,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>SamayaHR · Finance</p>
          <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Payslip Management</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>Generate and download employee payslips</p>
        </div>
      </div>

      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
          {[
            { label:"Total Payrolls", val:stats.total,     color:T.navy },
            { label:"Payslips Ready", val:stats.generated, color:T.teal },
            { label:"Not Generated",  val:stats.pending,   color:"#B45309" },
          ].map(s => (
            <div key={s.label} style={{background:"#fff",border:`1.5px solid ${T.border}`,borderRadius:14,padding:"14px 16px"}}>
              <p style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{s.label}</p>
              <p className="fd" style={{fontSize:22,fontWeight:900,color:s.color,margin:0}}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Search + Refresh */}
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{position:"relative",flex:1,maxWidth:320}}>
            <Search size={13} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}/>
            <input className="aps-input" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by employee or month…" style={{paddingLeft:32,width:"100%",boxSizing:"border-box"}}/>
          </div>
          <button onClick={load} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            <RefreshCw size={12}/> Refresh
          </button>
        </div>

        {/* Table */}
        <div className="aps-panel aps-in">
          <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
            <FileText size={15} color={T.coral}/>
            <p className="fd" style={{fontSize:13,fontWeight:800,color:"#fff"}}>Payroll Records</p>
            <span style={{marginLeft:"auto",padding:"2px 9px",borderRadius:999,background:"rgba(255,107,53,.2)",color:T.coral,fontSize:10,fontWeight:700}}>{filtered.length}</span>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr",gap:12,padding:"10px 18px",borderBottom:`1.5px solid ${T.border}`,background:"#FAFBFF"}}>
            {["Employee","Month","Net Salary","Status","Payslip"].map(h => (
              <p key={h} style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",margin:0}}>{h}</p>
            ))}
          </div>

          {loading ? (
            <div style={{padding:"40px",textAlign:"center"}}><p style={{fontSize:13,color:"#94a3b8"}}>Loading…</p></div>
          ) : filtered.length === 0 ? (
            <div style={{padding:"40px",textAlign:"center"}}><p style={{fontSize:13,color:"#94a3b8"}}>No payroll records found.</p></div>
          ) : (
            filtered.map(r => {
              const st = STATUS_STYLE[r.status] || STATUS_STYLE.PENDING;
              return (
                <div key={r.id} className="aps-row">
                  <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,margin:0}}>{r.userName}</p>
                  <p style={{fontSize:12,color:"#64748b",margin:0}}>{r.payrollMonth || "—"}</p>
                  <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,margin:0}}>{fmtAmt(r.netSalary)}</p>
                  <span className="aps-badge" style={{background:st.bg,color:st.color,border:`1px solid ${st.border}`}}>{r.status}</span>
                  <div style={{display:"flex",gap:6}}>
                    {r.payslipGenerated ? (
                      <>
                        {r.payslipPath && (
                          <a href={r.payslipPath} target="_blank" rel="noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 11px",borderRadius:8,border:`1.5px solid rgba(0,194,168,.3)`,background:"rgba(0,194,168,.08)",color:T.teal,fontSize:11,fontWeight:700,textDecoration:"none"}}>
                            <Eye size={10}/> View
                          </a>
                        )}
                        <a href={r.payslipPath} download target="_blank" rel="noreferrer"
                          style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 11px",borderRadius:8,border:`1.5px solid rgba(99,102,241,.3)`,background:"rgba(99,102,241,.08)",color:"#6366f1",fontSize:11,fontWeight:700,textDecoration:"none"}}>
                          <Download size={10}/> Download
                        </a>
                      </>
                    ) : (
                      <button className="aps-btn" disabled={generating[r.id] || r.status === "CANCELLED"}
                        onClick={() => generatePayslip(r.id)}
                        style={{background:`linear-gradient(135deg,${T.coral},#ff8c5a)`,color:"#fff",boxShadow:"0 3px 10px rgba(255,107,53,.25)"}}>
                        {generating[r.id] ? "…" : <><FileText size={10}/> Generate</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
