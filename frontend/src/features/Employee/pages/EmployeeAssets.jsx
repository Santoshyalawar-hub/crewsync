import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "@/lib/apiClient";

const ASSET_TYPE_META = {
  laptop:  { label:"Laptop",       emoji:"💻", color:"#6366F1", bg:"rgba(99,102,241,.1)"  },
  mobile:  { label:"Mobile Phone", emoji:"📱", color:"#0891B2", bg:"rgba(8,145,178,.1)"   },
  tablet:  { label:"Tablet",       emoji:"📋", color:"#0D9488", bg:"rgba(13,148,136,.1)"  },
  sim:     { label:"SIM Card",     emoji:"📡", color:"#7C3AED", bg:"rgba(124,58,237,.1)"  },
  other:   { label:"Equipment",    emoji:"🔧", color:"#64748B", bg:"rgba(100,116,139,.1)" },
};

const T = {
  navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.ast *{font-family:'DM Sans',sans-serif;box-sizing:border-box;}
.ast .fd{font-family:'Sora',sans-serif;}
.ast-card{background:#fff;border:1.5px solid ${T.border};border-radius:18px;box-shadow:0 2px 14px rgba(13,31,45,.05);}
.ast-row{transition:background .15s;}
.ast-row:hover{background:#FAFBFF;}
@keyframes astUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ast-animate{animation:astUp .38s ease both;}
@keyframes astSpin{to{transform:rotate(360deg)}}
`;

const Skeleton = ({w=80,h=16})=>(
  <span style={{display:'inline-block',width:w,height:h,borderRadius:6,background:'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.4s infinite'}} />
);

export default function EmployeeAssets() {
  const [assets,   setAssets]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [employee, setEmployee] = useState({ staffId:"", employeeName:"", department:"", email:"", role:"" });
  const [error,    setError]    = useState(null);

  // Returns { userId (numeric, for API calls), staffId (HR code e.g. ZLE01, for display) }
  const getUserFromLocalStorage = () => {
    try {
      const userId       = localStorage.getItem('userId');       // numeric DB id — used for API
      const employeeId   = localStorage.getItem('employeeId');   // HR employee code e.g. ZLE01
      const employeeName = localStorage.getItem('employeeName');
      const userRole     = localStorage.getItem('userRole');
      const userDepartment = localStorage.getItem('userDepartment');

      let department = userDepartment || "", email = "";
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const p = JSON.parse(userInfo);
          department = p.department || department || "N/A";
          email = p.email || "";
        } catch {}
      }

      if (userId && employeeName) {
        return {
          userId,                                    
          staffId: employeeId ,
          employeeName,
          department: department || "N/A",
          email,
          role: userRole || "EMPLOYEE",
        };
      }
      return null;
    } catch { return null; }
  };

  const fetchCurrentUser = async () => {
    try {
      const r = await api.get('/api/users/me');
      const d = r.data;
      if (d.success && d.data) {
        const u = d.data;
        // u.employeeId = HR code (e.g. ZLE01); u.id = DB primary key (e.g. 4)
        // staffId shows the HR employee code; userId is used for asset API calls
        return {
          userId:       u.id?.toString() || "",
          staffId:      u.employeeId || u.id?.toString() || "",  // HR code for display
          employeeName: u.fullName || u.name || "",
          department:   u.department || "N/A",
          email:        u.email || "",
          role:         u.role || "EMPLOYEE",
        };
      }
      throw new Error("Invalid data");
    } catch {
      return getUserFromLocalStorage();
    }
  };

  const fetchEmployeeAssets = async (userId) => {
    try {
      const r = await api.get(`/api/assets/employee/${userId}`);
      const d = r.data;
      if (d.success) setAssets(d.data || []);
      else setAssets([]);
    } catch {
      setError("Unable to load equipment. Please refresh.");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const user = await fetchCurrentUser();
        if (user?.userId) {
          setEmployee(user);
          await fetchEmployeeAssets(user.userId);   // always use numeric userId for API
        } else {
          setError("Please log in to view your equipment.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const conditionStyle = (c) => {
    if (c === 'New')  return {bg:'#ECFDF5', color:'#065F46', border:'#A7F3D0'};
    if (c === 'Good') return {bg:'#EFF6FF', color:'#1E40AF', border:'#BFDBFE'};
    return {bg:'#FFF8EB', color:'#92400E', border:'#FDE68A'};
  };

  const laptopCount = assets.filter(a => a.assetType === 'laptop').length;
  const mobileCount = assets.filter(a => a.assetType === 'mobile').length;

  if (error) return (
    <div className="ast" style={{minHeight:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <style>{CSS}</style>
      <div className="ast-card" style={{maxWidth:380,width:'100%',padding:32,textAlign:'center'}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:'#FEF2F2',border:'2px solid #FECACA',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:24}}>⚠️</div>
        <p className="fd" style={{fontSize:16,fontWeight:800,color:T.navy,marginBottom:8}}>Access Problem</p>
        <p style={{fontSize:13,color:'#64748b',marginBottom:20}}>{error}</p>
        <button onClick={() => window.location.href = '/login'}
          style={{padding:'10px 24px',borderRadius:10,border:'none',background:`linear-gradient(135deg,${T.coral},#ff8c5a)`,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 14px rgba(255,107,53,.3)'}}>
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="ast" style={{minHeight:'100vh',background:T.bg,padding:'0 0 40px'}}>
      <style>{`${CSS}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:'20px 24px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:40,width:160,height:160,borderRadius:'50%',background:'rgba(255,107,53,.08)',pointerEvents:'none'}} />
        <div style={{position:'absolute',bottom:-20,right:200,width:90,height:90,borderRadius:'50%',background:'rgba(0,194,168,.07)',pointerEvents:'none'}} />
        <div style={{position:'relative'}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:'uppercase',letterSpacing:'.12em',marginBottom:4}}>SamayaHR · Equipment Registry</p>
          <h1 className="fd" style={{fontSize:22,fontWeight:900,color:'#fff',margin:0}}>My Issued Equipment</h1>
          <p style={{fontSize:13,color:'rgba(255,255,255,.5)',marginTop:4}}>All company hardware and devices assigned to you.</p>
        </div>
      </div>

      <div style={{padding:'20px 24px',display:'flex',flexDirection:'column',gap:18}}>

        {/* PROFILE STRIP */}
        <div className="ast-card ast-animate" style={{padding:'16px 20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}} className="ast-profile-grid">
            <style>{`@media(max-width:640px){.ast-profile-grid{grid-template-columns:1fr 1fr!important}}`}</style>
            {[
              {label:'Full Name',   val: employee.employeeName},
              {label:'Staff ID',    val: employee.staffId},        // ✅ now shows ZLE01 not 4
              {label:'Department',  val: employee.department},
              {label:'Designation', val: employee.role},
            ].map(f => (
              <div key={f.label} style={{background:'#F8FAFF',borderRadius:10,padding:'10px 14px'}}>
                <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>{f.label}</p>
                {loading ? <Skeleton /> : <p style={{fontSize:13,fontWeight:700,color:T.navy}}>{f.val || '—'}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* KPI ROW */}
        <div className="ast-kpi-grid ast-animate" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',animationDelay:'.05s'}}>
          <style>{`@media(max-width:580px){.ast-kpi-grid{grid-template-columns:1fr!important}}`}</style>
          {[
            {label:'Total Issued',   val:assets.length,  icon:'📦', color:T.coral,   bg:'rgba(255,107,53,.08)'},
            {label:'Laptops',        val:laptopCount,    icon:'💻', color:'#6366F1', bg:'rgba(99,102,241,.08)'},
            {label:'Mobile Devices', val:mobileCount,    icon:'📱', color:'#0891B2', bg:'rgba(8,145,178,.08)'},
          ].map(k => (
            <div key={k.label} className="ast-card" style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:42,height:42,borderRadius:12,background:k.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{k.icon}</div>
              <div>
                <p style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:3}}>{k.label}</p>
                <p className="fd" style={{fontSize:24,fontWeight:900,color:loading?'#e2e8f0':k.color}}>
                  {loading ? '—' : k.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* EQUIPMENT TABLE */}
        <div className="ast-card ast-animate" style={{overflow:'hidden',animationDelay:'.1s'}}>
          <div style={{padding:'14px 20px',borderBottom:`1px solid ${T.border}`,background:'linear-gradient(90deg,#FAFBFF,#F5F7FB)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <p className="fd" style={{fontSize:14,fontWeight:800,color:T.navy}}>Equipment Details</p>
            <span style={{fontSize:11,color:'#94a3b8',fontWeight:600}}>{assets.length} item{assets.length !== 1 ? 's' : ''} issued</span>
          </div>

          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`}}>
                  {['Preview','Category','Model / Make','Serial No.','Included Extras','Condition','Date Issued'].map(h => (
                    <th key={h} style={{padding:'11px 14px',textAlign:'left',fontSize:11,fontWeight:700,color:'rgba(255,255,255,.8)',textTransform:'uppercase',letterSpacing:'.07em',whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{padding:'48px 24px',textAlign:'center'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                      <div style={{width:32,height:32,borderRadius:'50%',border:`3px solid ${T.coral}`,borderTopColor:'transparent',animation:'astSpin .8s linear infinite'}} />
                      <p style={{fontSize:13,color:'#94a3b8'}}>Loading your equipment…</p>
                    </div>
                  </td></tr>
                ) : assets.length === 0 ? (
                  <tr><td colSpan={7} style={{padding:'48px 24px',textAlign:'center'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
                      <span style={{fontSize:40}}>📭</span>
                      <p style={{fontSize:14,fontWeight:700,color:T.navy}}>No equipment assigned yet</p>
                      <p style={{fontSize:12,color:'#94a3b8'}}>Items will appear here once your IT team issues them.</p>
                    </div>
                  </td></tr>
                ) : assets.map((asset, i) => {
                  const meta = ASSET_TYPE_META[asset.assetType] || ASSET_TYPE_META.other;
                  const cond = conditionStyle(asset.condition);
                  return (
                    <tr key={asset.id || i} className="ast-row" style={{borderBottom:`1px solid ${T.border}`}}>
                      {/* Preview */}
                      <td style={{padding:'12px 14px'}}>
                        {asset.imagePath ? (
                          <img src={`${API_BASE_URL}/uploads/assets/${asset.imagePath}`} alt="device"
                            style={{width:52,height:52,objectFit:'cover',borderRadius:10,border:`1.5px solid ${T.border}`}}
                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        ) : null}
                        <div style={{width:52,height:52,borderRadius:10,background:'#F1F5F9',border:`1.5px solid ${T.border}`,display:asset.imagePath?'none':'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>
                          {meta.emoji}
                        </div>
                      </td>
                      {/* Category */}
                      <td style={{padding:'12px 14px'}}>
                        <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:999,background:meta.bg,color:meta.color,fontSize:11,fontWeight:700,border:`1px solid ${meta.color}30`}}>
                          {meta.emoji} {meta.label}
                        </span>
                      </td>
                      {/* Model */}
                      <td style={{padding:'12px 14px',fontSize:13,fontWeight:600,color:T.navy}}>{asset.makeModel || '—'}</td>
                      {/* Serial */}
                      <td style={{padding:'12px 14px'}}>
                        <code style={{fontSize:11,fontFamily:'monospace',background:'#F1F5F9',padding:'3px 8px',borderRadius:6,color:'#475569',border:`1px solid ${T.border}`}}>{asset.serialNumber || '—'}</code>
                      </td>
                      {/* Extras */}
                      <td style={{padding:'12px 14px',fontSize:12,color:'#64748b'}}>{asset.accessories || 'None included'}</td>
                      {/* Condition */}
                      <td style={{padding:'12px 14px'}}>
                        <span style={{padding:'4px 10px',borderRadius:999,fontSize:11,fontWeight:700,background:cond.bg,color:cond.color,border:`1px solid ${cond.border}`}}>{asset.condition || '—'}</span>
                      </td>
                      {/* Date */}
                      <td style={{padding:'12px 14px',fontSize:12,color:'#64748b',whiteSpace:'nowrap'}}>{asset.dateIssued || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RESPONSIBILITY NOTICE */}
        <div className="ast-animate" style={{padding:'14px 18px',borderRadius:14,background:'rgba(0,194,168,.06)',border:`1.5px solid rgba(0,194,168,.2)`,display:'flex',alignItems:'flex-start',gap:12,animationDelay:'.15s'}}>
          <span style={{fontSize:18,flexShrink:0,marginTop:1}}>🛡️</span>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:T.teal,marginBottom:3}}>Equipment Responsibility</p>
            <p style={{fontSize:12,color:'#475569',lineHeight:1.6}}>
              You are accountable for the safe use and security of all issued items. Report any damage, loss, or malfunction to your manager immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}