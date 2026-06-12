import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, FileText, Calendar, MessageSquare, AlertCircle, CheckCircle, Clock } from "lucide-react";
import api from "@/lib/apiClient";

/* ── CrewSync design tokens ── */
const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};



const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.ee { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.ee .fd { font-family:'Sora',sans-serif; }
.ee-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }

.ee-label { font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.07em; display:block; margin-bottom:6px; }
.ee-input {
  width:100%; border:1.5px solid ${T.border}; border-radius:10px;
  padding:10px 13px; font-size:13px; font-family:'DM Sans',sans-serif;
  color:${T.navy}; outline:none; transition:border-color .15s; background:#fff; box-sizing:border-box;
}
.ee-input:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(139,92,246,.1); }

.ee-step { display:flex; gap:12px; padding:10px 12px; border-radius:12px; border:1.5px solid ${T.border}; transition:all .15s; }
.ee-step.current { background:rgba(139,92,246,.05); border-color:rgba(139,92,246,.3); }
.ee-step-num { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; font-family:'Sora',sans-serif; flex-shrink:0; }

.ee-btn-primary { display:inline-flex; align-items:center; gap:7px; padding:11px 24px; border-radius:11px; border:none; background:linear-gradient(135deg,${T.coral},#FBBF24); color:#fff; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; box-shadow:0 4px 14px rgba(139,92,246,.3); transition:all .15s; }
.ee-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
.ee-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(139,92,246,.35); }
.ee-btn-outline { display:inline-flex; align-items:center; gap:7px; padding:11px 20px; border-radius:11px; border:1.5px solid ${T.coral}; background:#fff; color:${T.coral}; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
.ee-btn-outline:hover { background:rgba(139,92,246,.06); }

@keyframes eeUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.ee-in { animation:eeUp .35s ease both; }

.ee-grid { display:grid; grid-template-columns:1fr 340px; gap:20px; }
@media(max-width:900px){ .ee-grid{ grid-template-columns:1fr!important; } }
`;

const EXIT_TYPES   = [{ value:"RESIGNATION",label:"Resignation" },{ value:"TERMINATION",label:"Termination" },{ value:"RETIREMENT",label:"Retirement" }];
const REASON_OPTS  = [
  { value:"BETTER_OPPORTUNITY",label:"Better opportunity" },
  { value:"PERSONAL_REASONS",  label:"Personal reasons" },
  { value:"HEALTH_ISSUES",     label:"Health issues" },
  { value:"RELOCATION",        label:"Relocation" },
  { value:"CAREER_CHANGE",     label:"Career change" },
  { value:"HIGHER_EDUCATION",  label:"Higher education" },
  { value:"OTHER",             label:"Other" },
];

const STEPS = [
  { n:1, title:"Submit Request",       desc:"Fill and submit the exit form",     current:true  },
  { n:2, title:"Team Leader Review",   desc:"Team Leader reviews your request",  current:false },
  { n:3, title:"PeopleOps Approval",          desc:"PeopleOps approval process",               current:false },
  { n:4, title:"Exit Clearance",       desc:"Asset return & clearance",          current:false },
  { n:5, title:"Final Settlement",     desc:"Complete exit formalities",         current:false },
];

export default function PersonExit() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    exitType: "RESIGNATION",
    reason: "BETTER_OPPORTUNITY",
    otherReason: "",
    lastWorkingDay: "",
    comments: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]:value, ...(name==="reason"&&value!=="OTHER"?{otherReason:""}:{}) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Authentication required. Please login again."); navigate("/login"); return; }
    const payload = {
      exitType: formData.exitType,
      reason: formData.reason==="OTHER" ? formData.otherReason : formData.reason,
      lastWorkingDay: formData.lastWorkingDay,
      comments: formData.comments || null,
    };
    try {
      const res  = await api.post("/api/employee/exit-request", payload);
      const data = res.data;
      if (data.success) { alert("Exit request submitted successfully!"); navigate("/employee/exitStatus"); }
      else throw new Error(data.message||"Failed to submit exit request");
    } catch(err) { console.error(err); setError(err.message); alert("Error: "+err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="ee" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(139,92,246,.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,right:260,width:100,height:100,borderRadius:"50%",background:"rgba(6,182,212,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:44,height:44,borderRadius:13,background:"rgba(139,92,246,.2)",display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid rgba(139,92,246,.3)"}}>
            <LogOut size={20} color={T.coral}/>
          </div>
          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:3}}>CrewSync · PeopleOps</p>
            <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Person Exit Request</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:3}}>Submit your exit request and track its status.</p>
          </div>
        </div>
      </div>

      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

        {/* info banner */}
        <div className="ee-in" style={{padding:"13px 16px",borderRadius:12,background:"rgba(139,92,246,.06)",border:"1.5px solid rgba(139,92,246,.2)",display:"flex",alignItems:"flex-start",gap:10}}>
          <AlertCircle size={15} color={T.coral} style={{flexShrink:0,marginTop:1}}/>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:T.navy,marginBottom:2}}>Important</p>
            <p style={{fontSize:12,color:"#475569",lineHeight:1.65}}>Please ensure all details are accurate before submitting. Your Team Leader will review and process your request within 2–3 business days.</p>
          </div>
        </div>

        {error&&(
          <div className="ee-in" style={{padding:"13px 16px",borderRadius:12,background:"#FEF2F2",border:"1.5px solid #FECACA",display:"flex",alignItems:"flex-start",gap:10}}>
            <AlertCircle size={15} color="#EF4444" style={{flexShrink:0,marginTop:1}}/>
            <p style={{fontSize:12,color:"#991B1B"}}>{error}</p>
          </div>
        )}

        <div className="ee-grid">

          {/* ── FORM ── */}
          <div className="ee-card ee-in">
            <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:"14px 20px",display:"flex",alignItems:"center",gap:9}}>
              <FileText size={15} color="rgba(255,255,255,.7)"/>
              <p className="fd" style={{fontSize:14,fontWeight:800,color:"#fff"}}>Exit Request Form</p>
            </div>

            <form onSubmit={handleSubmit} style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:18}}>

              {/* Exit Type */}
              <div>
                <label className="ee-label">Exit Type <span style={{color:T.coral}}>*</span></label>
                <select name="exitType" value={formData.exitType} onChange={handleChange} required className="ee-input">
                  {EXIT_TYPES.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="ee-label">Reason for Exit <span style={{color:T.coral}}>*</span></label>
                <select name="reason" value={formData.reason} onChange={handleChange} required className="ee-input">
                  {REASON_OPTS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Other reason */}
              {formData.reason==="OTHER"&&(
                <div className="ee-in">
                  <label className="ee-label">Please specify <span style={{color:T.coral}}>*</span></label>
                  <input type="text" name="otherReason" value={formData.otherReason} onChange={handleChange} placeholder="Enter your reason…" required maxLength={200} className="ee-input"/>
                </div>
              )}

              {/* Last Working Day */}
              <div>
                <label className="ee-label" style={{display:"flex",alignItems:"center",gap:5}}>
                  <Calendar size={11} color={T.teal}/> Last Working Day <span style={{color:T.coral}}>*</span>
                </label>
                <input type="date" name="lastWorkingDay" value={formData.lastWorkingDay} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} required className="ee-input"/>
              </div>

              {/* Comments */}
              <div>
                <label className="ee-label" style={{display:"flex",alignItems:"center",gap:5}}>
                  <MessageSquare size={11} color={T.teal}/> Additional Comments
                  <span style={{fontWeight:400,color:"#94a3b8",textTransform:"none",letterSpacing:0,fontSize:10}}>(Optional)</span>
                </label>
                <textarea name="comments" value={formData.comments} onChange={handleChange}
                  rows={4} maxLength={500} placeholder="Share any additional information or feedback…"
                  className="ee-input" style={{resize:"none"}}/>
                <p style={{fontSize:10,color:"#94a3b8",marginTop:4,textAlign:"right"}}>{formData.comments.length} / 500</p>
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:10,paddingTop:8,borderTop:`1px solid ${T.border}`,flexWrap:"wrap"}}>
                <button type="button" onClick={()=>navigate("/employee/exitStatus")} className="ee-btn-outline">
                  <Clock size={13}/> View Status
                </button>
                <button type="submit" disabled={submitting} className="ee-btn-primary" style={{marginLeft:"auto"}}>
                  {submitting
                    ? <><span style={{width:13,height:13,borderRadius:"50%",border:"2px solid rgba(255,255,255,.4)",borderTopColor:"#fff",display:"inline-block",animation:"eeUp .7s linear infinite"}}/>Submitting…</>
                    : <><CheckCircle size={13}/>Submit Request</>
                  }
                </button>
              </div>
            </form>
          </div>

          {/* ── SIDEBAR STEPS ── */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="ee-card ee-in" style={{animationDelay:".06s"}}>
              <div style={{background:"linear-gradient(135deg,#6366F1,#A855F7)",padding:"14px 20px"}}>
                <p className="fd" style={{fontSize:14,fontWeight:800,color:"#fff"}}>Exit Process</p>
              </div>
              <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:10}}>
                {STEPS.map((s,i)=>(
                  <div key={s.n} className={`ee-step${s.current?" current":""}`} style={{animationDelay:`${i*.05}s`}}>
                    <div className="ee-step-num" style={{
                      background:s.current?T.coral:"#F1F5F9",
                      color:s.current?"#fff":"#94a3b8",
                      boxShadow:s.current?`0 4px 12px rgba(139,92,246,.3)`:"none",
                    }}>{s.n}</div>
                    <div>
                      <p style={{fontSize:12,fontWeight:700,color:s.current?T.navy:"#64748b"}}>{s.title}</p>
                      <p style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="ee-card ee-in" style={{animationDelay:".1s",padding:"16px 18px"}}>
              <p style={{fontSize:11,fontWeight:700,color:T.navy,marginBottom:4}}>Need Help?</p>
              <p style={{fontSize:12,color:"#64748b",lineHeight:1.65}}>
                Contact your Team Leader or PeopleOps at{" "}
                <a href="mailto:hr@company.com" style={{color:T.coral,fontWeight:700,textDecoration:"none"}}>hr@company.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}