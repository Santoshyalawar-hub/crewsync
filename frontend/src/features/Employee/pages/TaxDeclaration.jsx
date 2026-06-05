import React from "react";
import { API_BASE_URL } from "@/lib/apiClient";

/* ── SamayaHR design tokens ── */
const T = {
  navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.td { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.td .fd { font-family:'Sora',sans-serif; }
.td-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.td-row { transition:background .12s; }
.td-row:hover { background:#FAFBFF; }
@keyframes tdUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.td-in { animation:tdUp .35s ease both; }
`;

export default function TaxDeclaration() {
  return (
    <div className="td" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(255,107,53,.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,right:260,width:100,height:100,borderRadius:"50%",background:"rgba(0,194,168,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>SamayaHR · Compliance</p>
            <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Tax Declarations</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>View and manage your annual income tax filings.</p>
          </div>
          {/* quick stats */}
          <div style={{display:"flex",gap:10}}>
            {[{cap:"Financial Year",val:"2025–26"},{cap:"Status",val:"Pending"}].map(k=>(
              <div key={k.cap} style={{background:"rgba(255,255,255,.09)",border:"1px solid rgba(255,255,255,.13)",borderRadius:12,padding:"10px 16px",textAlign:"right"}}>
                <p style={{fontSize:9,color:"rgba(255,255,255,.5)",marginBottom:2,textTransform:"uppercase",letterSpacing:".07em"}}>{k.cap}</p>
                <p className="fd" style={{fontSize:15,fontWeight:800,color:"#fff"}}>{k.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

        {/* ── KPI ROW ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}} className="td-kpi td-in">
          <style>{`@media(max-width:580px){.td-kpi{grid-template-columns:1fr!important}}`}</style>
          {[
            {icon:"📋",cap:"Declarations Filed",  val:"0",   accent:T.coral,  bg:"rgba(255,107,53,.08)"},
            {icon:"⏳",cap:"Pending Review",       val:"1",   accent:"#F59E0B",bg:"rgba(245,158,11,.08)"},
            {icon:"✅",cap:"Verified & Approved",  val:"0",   accent:T.teal,   bg:"rgba(0,194,168,.08)"},
          ].map(k=>(
            <div key={k.cap} className="td-card" style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:42,height:42,borderRadius:12,background:k.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{k.icon}</div>
              <div>
                <p style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",marginBottom:3}}>{k.cap}</p>
                <p className="fd" style={{fontSize:26,fontWeight:900,color:k.accent,lineHeight:1}}>{k.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE ── */}
        <div className="td-card td-in" style={{animationDelay:".06s"}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,background:"linear-gradient(90deg,#FAFBFF,#F5F7FB)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <p className="fd" style={{fontSize:14,fontWeight:800,color:T.navy}}>Declaration History</p>
            <span style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>1 record</span>
          </div>

          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`}}>
                  {["Financial Year","Total Income","Taxable Income","Tax Payable","Status","Submitted","Actions"].map(h=>(
                    <th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.75)",textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="td-row" style={{borderBottom:`1px solid ${T.border}`}}>
                  <td style={{padding:"14px 16px"}}>
                    <p className="fd" style={{fontSize:14,fontWeight:800,color:T.navy}}>2025–2026</p>
                  </td>
                  <td style={{padding:"14px 16px"}}>
                    <span style={{fontSize:13,color:"#94a3b8",fontFamily:"monospace"}}>—</span>
                  </td>
                  <td style={{padding:"14px 16px"}}>
                    <span style={{fontSize:13,color:"#94a3b8",fontFamily:"monospace"}}>—</span>
                  </td>
                  <td style={{padding:"14px 16px"}}>
                    <span style={{fontSize:13,color:"#94a3b8",fontFamily:"monospace"}}>—</span>
                  </td>
                  <td style={{padding:"14px 16px"}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:999,background:"#FFFBEB",color:"#B45309",border:"1px solid #FDE68A",fontSize:11,fontWeight:700}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:"#F59E0B"}}/>
                      Pending
                    </span>
                  </td>
                  <td style={{padding:"14px 16px"}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:999,background:"#FEF2F2",color:"#991B1B",border:"1px solid #FECACA",fontSize:11,fontWeight:700}}>
                      Not Yet
                    </span>
                  </td>
                  <td style={{padding:"14px 16px"}}>
                    <span style={{fontSize:13,color:"#94a3b8"}}>—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── INFO NOTICE ── */}
        <div className="td-in" style={{padding:"14px 18px",borderRadius:14,background:"rgba(0,194,168,.06)",border:"1.5px solid rgba(0,194,168,.2)",display:"flex",alignItems:"center",gap:12,animationDelay:".12s"}}>
          <span style={{fontSize:18,flexShrink:0}}>ℹ️</span>
          <p style={{fontSize:12,color:"#475569",lineHeight:1.65}}>
            Your tax declaration for <strong style={{color:T.navy}}>FY 2025–26</strong> is pending. Contact HR or your finance team to complete your submission before the deadline.
          </p>
        </div>

      </div>
    </div>
  );
}