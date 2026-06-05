import React, { useState, useEffect } from "react";
import { BookOpen, Eye, Download, FileText } from "lucide-react";
import api from "@/lib/apiClient";

const T = {
  navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.pv { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.pv .fd { font-family:'Sora',sans-serif; }
.pv-panel {
  background:#fff; border:1.5px solid ${T.border};
  border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05);
  overflow:hidden;
}
@keyframes pvUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.pv-in { animation:pvUp .35s ease both; }
`;

const EmptyState = ({ message }) => (
  <div style={{padding:'48px 20px',textAlign:'center',border:`1.5px dashed ${T.border}`,borderRadius:16,background:'#fafbff'}}>
    <p style={{fontSize:32,marginBottom:12}}>📄</p>
    <p className="fd" style={{fontSize:14,fontWeight:800,color:T.navy,marginBottom:6}}>No Policies Yet</p>
    <p style={{fontSize:13,color:'#94a3b8'}}>{message}</p>
  </div>
);

const getDownloadUrl = (url, fileName) => {
  if (!url) return url;
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    const label = fileName ? `fl_attachment:${encodeURIComponent(fileName.replace(/\s+/g, "_"))}` : "fl_attachment";
    return url.replace("/upload/", `/upload/${label}/`);
  }
  return url;
};

const PolicyCard = ({ p }) => (
  <div style={{padding:'14px 16px',border:`1.5px solid ${T.border}`,borderRadius:12,display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,background:'#fff'}}>
    <div style={{flex:1,minWidth:0}}>
      <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,marginBottom:4}}>{p.title}</p>
      {p.description && (
        <p style={{fontSize:12,color:'#64748b',lineHeight:1.6,marginBottom:4}}>{p.description}</p>
      )}
      {p.createdAt && (
        <p style={{fontSize:11,color:'#94a3b8'}}>
          Published: {new Date(p.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
        </p>
      )}
    </div>
    {p.fileUrl && (
      <div style={{display:'flex',gap:8,flexShrink:0}}>
        <a href={p.fileUrl} target="_blank" rel="noreferrer"
          style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 11px',borderRadius:8,border:`1.5px solid rgba(0,194,168,.3)`,background:'rgba(0,194,168,.08)',color:T.teal,fontSize:11,fontWeight:700,textDecoration:'none'}}>
          <Eye size={10}/> View
        </a>
        <a href={getDownloadUrl(p.fileUrl, p.fileName)} target="_blank" rel="noreferrer"
          style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 11px',borderRadius:8,border:`1.5px solid rgba(99,102,241,.3)`,background:'rgba(99,102,241,.08)',color:'#6366f1',fontSize:11,fontWeight:700,textDecoration:'none'}}>
          <Download size={10}/> Download
        </a>
      </div>
    )}
  </div>
);

export default function PolicyPage() {
  const [policyTab,      setPolicyTab]      = useState("company");
  const [companyPolicies, setCompanyPolicies] = useState([]);
  const [hrPolicies,      setHrPolicies]      = useState([]);
  const [loading,         setLoading]         = useState(true);

  const companyName = localStorage.getItem("companyName") || "Your Organisation";
  const tenantCode  = localStorage.getItem("tenantCode")  || "";

  useEffect(() => {
    if (!tenantCode) { setLoading(false); return; }
    api.get(`/api/policies/tenant/${tenantCode}`)
      .then(res => {
        const all = Array.isArray(res.data?.data ?? res.data) ? (res.data?.data ?? res.data) : [];
        setCompanyPolicies(all.filter(p => !p.policyType || p.policyType === "COMPANY_POLICY"));
        setHrPolicies(all.filter(p => p.policyType === "HR_POLICY"));
      })
      .catch(() => { setCompanyPolicies([]); setHrPolicies([]); })
      .finally(() => setLoading(false));
  }, [tenantCode]);

  const active = policyTab === "company" ? companyPolicies : hrPolicies;

  return (
    <div className="pv" style={{padding:'0 0 56px'}}>
      <style>{CSS}</style>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:'22px 26px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:60,width:180,height:180,borderRadius:'50%',background:'rgba(255,107,53,.07)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-30,right:260,width:100,height:100,borderRadius:'50%',background:'rgba(0,194,168,.07)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:'uppercase',letterSpacing:'.12em',marginBottom:4}}>SamayaHR · Compliance</p>
          <h1 className="fd" style={{fontSize:23,fontWeight:900,color:'#fff',margin:0}}>Policy Vault</h1>
          <p style={{fontSize:13,color:'rgba(255,255,255,.5)',marginTop:4}}>{companyName}</p>
        </div>
      </div>

      {/* TAB TOGGLE */}
      <div style={{padding:'14px 26px 0',display:'flex',gap:0}}>
        <div style={{display:'flex',background:'#fff',border:`1.5px solid ${T.border}`,borderRadius:12,padding:4,gap:3}}>
          {[["company","Company Policies"],["hr","HR Policies"]].map(([val,lbl]) => (
            <button key={val} onClick={() => setPolicyTab(val)}
              style={{padding:'7px 18px',borderRadius:9,border:'none',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",
                background: policyTab===val ? `linear-gradient(135deg,${T.coral},#ff5722)` : 'transparent',
                color:      policyTab===val ? '#fff' : '#64748b',
                boxShadow:  policyTab===val ? '0 3px 10px rgba(255,107,53,.25)' : 'none',
                transition:'all .18s'}}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:'22px 26px',display:'flex',flexDirection:'column',gap:14}}>
        {loading ? (
          <div style={{textAlign:'center',padding:'40px 0'}}>
            <p style={{fontSize:13,color:'#94a3b8'}}>Loading policies…</p>
          </div>
        ) : (
          <>
            {/* Panel header */}
            <div className="pv-panel pv-in">
              <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:'12px 18px',display:'flex',alignItems:'center',gap:10}}>
                <FileText size={15} color={policyTab==="company" ? T.coral : "#6366f1"}/>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:'#fff'}}>
                  {policyTab==="company" ? "Company Policies" : "HR Policies"}
                </p>
                <span style={{marginLeft:'auto',padding:'2px 9px',borderRadius:999,
                  background: policyTab==="company" ? 'rgba(255,107,53,.2)' : 'rgba(99,102,241,.2)',
                  color: policyTab==="company" ? T.coral : '#6366f1',fontSize:10,fontWeight:700}}>
                  {active.length}
                </span>
              </div>
              <div style={{padding:'16px 18px',display:'flex',flexDirection:'column',gap:10}}>
                {active.length === 0
                  ? <EmptyState message={
                      policyTab==="company"
                        ? "No company policies have been published yet. Check back later."
                        : "No HR policies have been published yet."
                    }/>
                  : active.map(p => <PolicyCard key={p.id} p={p}/>)
                }
              </div>
            </div>

            {/* Info note */}
            {!tenantCode && (
              <div style={{padding:'14px 18px',borderRadius:12,background:'#FFFAF8',border:`1.5px solid rgba(255,107,53,.2)`}}>
                <p style={{fontSize:12,color:'#92400e'}}>Session not found. Please log in again to view policies.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
