import React, { useState, useEffect } from "react";
import { Shield, TrendingUp, Users, Download } from "lucide-react";
import api from "@/lib/apiClient";

const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.acmp { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.acmp .fd { font-family:'Sora',sans-serif; }
.acmp-panel { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.acmp-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1fr 1fr; align-items:center; gap:10px; padding:12px 18px; border-bottom:1px solid ${T.border}; }
.acmp-row:hover { background:#FAFBFF; }
.acmp-row:last-child { border-bottom:none; }
@keyframes acmpUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.acmp-in { animation:acmpUp .3s ease both; }
`;

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const fmtAmt = a => a != null ? `₹${Number(a).toLocaleString("en-IN",{minimumFractionDigits:0})}` : "₹0";

// Derive compliance data from payroll records
function buildAssuranceRows(records) {
  const grouped = {};
  records.forEach(r => {
    const month = r.payrollMonth || r.payroll_month || "Unknown";
    if (!grouped[month]) {
      grouped[month] = { month, pf:0, esi:0, pt:0, tds:0, employees:0 };
    }
    grouped[month].pf  += Number(r.pfPerson || r.pf_employee || 0);
    grouped[month].esi += Number(r.esiPerson || r.esi_employee || 0);
    grouped[month].pt  += Number(r.professionalTax || r.professional_tax || 0);
    grouped[month].tds += Number(r.taxDeductions || r.tax_deductions || 0);
    grouped[month].employees += 1;
  });
  return Object.values(grouped).sort((a, b) => b.month.localeCompare(a.month));
}

export default function OperatorAssurance() {
  const [records,  setRecords]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [year,     setYear]     = useState(String(new Date().getFullYear()));

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    api.get("/api/payroll")
      .then(res => {
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.content) ? raw.content : [];
        setRecords(list.filter(r => (r.status !== "CANCELLED")));
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2].map(String);

  const yearFiltered = records.filter(r => {
    const month = r.payrollMonth || r.payroll_month || "";
    return month.includes(year);
  });

  const rows = buildAssuranceRows(yearFiltered);

  const totals = rows.reduce((acc, r) => ({
    pf: acc.pf + r.pf,
    esi: acc.esi + r.esi,
    pt: acc.pt + r.pt,
    tds: acc.tds + r.tds,
  }), { pf:0, esi:0, pt:0, tds:0 });

  const exportCSV = () => {
    const header = "Month,Persons,PF,ESI,Professional Tax,TDS\n";
    const body = rows.map(r =>
      `${r.month},${r.employees},${r.pf},${r.esi},${r.pt},${r.tds}`
    ).join("\n");
    const blob = new Blob([header + body], { type:"text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `compliance_${year}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="acmp" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(139,92,246,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>CrewSync · MoneyOps</p>
          <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Assurance Report</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>Monthly PF, ESI, Professional Tax & TDS summary</p>
        </div>
      </div>

      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

        {/* Summary Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
          {[
            { label:"Total PF",   val:fmtAmt(totals.pf),  color:"#4F46E5", icon:"🏛️" },
            { label:"Total ESI",  val:fmtAmt(totals.esi), color:T.teal,    icon:"🏥" },
            { label:"Total PT",   val:fmtAmt(totals.pt),  color:T.coral,   icon:"📋" },
            { label:"Total TDS",  val:fmtAmt(totals.tds), color:"#B45309", icon:"💸" },
          ].map(s => (
            <div key={s.label} style={{background:"#fff",border:`1.5px solid ${T.border}`,borderRadius:14,padding:"14px 16px"}}>
              <p style={{fontSize:18,marginBottom:6}}>{s.icon}</p>
              <p style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{s.label}</p>
              <p className="fd" style={{fontSize:16,fontWeight:900,color:s.color,margin:0}}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Year filter + Export */}
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",gap:6}}>
            {yearOptions.map(y => (
              <button key={y} onClick={() => setYear(y)}
                style={{padding:"5px 13px",borderRadius:8,border:`1.5px solid ${year===y?T.coral:T.border}`,
                  background:year===y?"rgba(139,92,246,.08)":"#fff",
                  color:year===y?T.coral:"#64748b",
                  fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                {y}
              </button>
            ))}
          </div>
          <button onClick={exportCSV}
            style={{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            <Download size={12}/> Export CSV
          </button>
        </div>

        {/* Assurance Table */}
        <div className="acmp-panel acmp-in">
          <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
            <Shield size={15} color={T.coral}/>
            <p className="fd" style={{fontSize:13,fontWeight:800,color:"#fff"}}>Monthly Assurance — {year}</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",gap:10,padding:"10px 18px",borderBottom:`1.5px solid ${T.border}`,background:"#FAFBFF"}}>
            {["Month","Persons","PF","ESI","Prof. Tax","TDS"].map(h => (
              <p key={h} style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",margin:0}}>{h}</p>
            ))}
          </div>

          {loading ? (
            <div style={{padding:"40px",textAlign:"center"}}><p style={{fontSize:13,color:"#94a3b8"}}>Loading…</p></div>
          ) : rows.length === 0 ? (
            <div style={{padding:"40px",textAlign:"center"}}>
              <p style={{fontSize:24,marginBottom:8}}>📊</p>
              <p style={{fontSize:13,color:"#94a3b8"}}>No payout data found for {year}.</p>
              <p style={{fontSize:12,color:"#b0bec5",marginTop:4}}>Generate payout records to see compliance data here.</p>
            </div>
          ) : (
            <>
              {rows.map(r => (
                <div key={r.month} className="acmp-row">
                  <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,margin:0}}>{r.month}</p>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <Users size={11} color="#94a3b8"/>
                    <p style={{fontSize:12,fontWeight:700,color:"#64748b",margin:0}}>{r.employees}</p>
                  </div>
                  <p style={{fontSize:12,fontWeight:700,color:"#4F46E5",margin:0}}>{fmtAmt(r.pf)}</p>
                  <p style={{fontSize:12,fontWeight:700,color:T.teal,margin:0}}>{fmtAmt(r.esi)}</p>
                  <p style={{fontSize:12,fontWeight:700,color:T.coral,margin:0}}>{fmtAmt(r.pt)}</p>
                  <p style={{fontSize:12,fontWeight:700,color:"#B45309",margin:0}}>{fmtAmt(r.tds)}</p>
                </div>
              ))}
              {/* Totals row */}
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",gap:10,padding:"12px 18px",background:"rgba(13,31,45,.03)",borderTop:`2px solid ${T.border}`}}>
                <p className="fd" style={{fontSize:12,fontWeight:900,color:T.navy,margin:0}}>TOTAL</p>
                <p style={{fontSize:12,fontWeight:700,color:"#64748b",margin:0}}>—</p>
                <p className="fd" style={{fontSize:12,fontWeight:900,color:"#4F46E5",margin:0}}>{fmtAmt(totals.pf)}</p>
                <p className="fd" style={{fontSize:12,fontWeight:900,color:T.teal,margin:0}}>{fmtAmt(totals.esi)}</p>
                <p className="fd" style={{fontSize:12,fontWeight:900,color:T.coral,margin:0}}>{fmtAmt(totals.pt)}</p>
                <p className="fd" style={{fontSize:12,fontWeight:900,color:"#B45309",margin:0}}>{fmtAmt(totals.tds)}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
