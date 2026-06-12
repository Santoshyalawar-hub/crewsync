import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.eh * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.eh .fd { font-family:'Sora',sans-serif; }

.eh-node {
  background:#fff; border:1.5px solid ${T.border}; border-radius:16px;
  padding:16px 14px; width:180px; text-align:center;
  box-shadow:0 2px 12px rgba(13,31,45,.06); flex-shrink:0;
  transition:box-shadow .2s, transform .2s;
}
.eh-node:hover { box-shadow:0 6px 22px rgba(13,31,45,.11); transform:translateY(-2px); border-color:rgba(139,92,246,.25); }

.eh-avatar {
  width:60px; height:60px; border-radius:50%; margin:0 auto 10px;
  border:2px solid ${T.border}; background:#F8FAFF; overflow:hidden;
  display:flex; align-items:center; justify-content:center;
}

.eh-role {
  display:inline-flex; align-items:center; padding:2px 9px; border-radius:999px;
  font-size:9px; font-weight:700; font-family:'Sora',sans-serif;
  letter-spacing:.06em; text-transform:uppercase; margin-bottom:4px;
}

.eh-vline { width:1.5px; background:${T.border}; flex-shrink:0; }
.eh-hline { height:1.5px; background:${T.border}; }

@keyframes ehUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.eh-in { animation:ehUp .3s ease both; }
`;

const ROLE_STYLE = {
  CEO:          { bg:"rgba(139,92,246,.12)",  color:T.coral,   border:"rgba(139,92,246,.3)"  },
  Manager:      { bg:"rgba(6,182,212,.1)",    color:T.teal,    border:"rgba(6,182,212,.3)"   },
  "Team Lead":  { bg:"rgba(99,102,241,.1)",   color:"#6366F1", border:"rgba(99,102,241,.25)" },
  "Team Member":{ bg:"rgba(100,116,139,.1)",  color:"#64748b", border:"rgba(100,116,139,.25)"},
};

const getInitials = name => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0]||""}${parts.length>1?parts[parts.length-1][0]:""}`.toUpperCase();
};

const OrgNode = ({ node, level = 0 }) => {
  const rs = ROLE_STYLE[node.role] || ROLE_STYLE["Team Member"];
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
      {level > 0 && <div className="eh-vline" style={{height:28,marginBottom:-1}}/>}

      <div className="eh-node eh-in">
        <div className="eh-avatar">
          {node.photo
            ? <img src={node.photo} alt={node.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : <span className="fd" style={{fontSize:16,fontWeight:900,color:T.navy}}>{getInitials(node.name)}</span>
          }
        </div>
        <p className="fd" style={{fontSize:12,fontWeight:900,color:T.navy,marginBottom:4,lineHeight:1.3}}>{node.name}</p>
        <span className="eh-role" style={{background:rs.bg,color:rs.color,border:`1px solid ${rs.border}`}}>
          {node.role}
        </span>
        {node.designation && (
          <p style={{fontSize:10,fontWeight:700,color:"#64748b",marginTop:2}}>{node.designation}</p>
        )}
      </div>

      {hasChildren && (
        <>
          <div className="eh-vline" style={{height:20}}/>
          <div style={{position:"relative",width:"100%",display:"flex",justifyContent:"center"}}>
            <div className="eh-hline" style={{position:"absolute",top:0,left:"calc(50% - var(--half,0px))",width:"var(--full,0px)"}}/>
          </div>
        </>
      )}

      {hasChildren && (
        <div style={{display:"flex",gap:24,alignItems:"flex-start",marginTop:20}}>
          {node.children.map(child => (
            <OrgNode key={child.id} node={child} level={level + 1}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PersonPeopleMap() {
  const [tree,    setTree]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const tenantCode  = localStorage.getItem("tenantCode")  || "";
  const companyName = localStorage.getItem("companyName") || "Your Organisation";

  useEffect(() => {
    if (!tenantCode) { setLoading(false); return; }
    api.get("/api/hierarchy/root")
      .then(res => {
        const data = res.data?.data ?? res.data;
        setTree(data || null);
      })
      .catch(err => {
        if (err.response?.status === 404) setTree(null);
        else setError("Failed to load organisation chart.");
      })
      .finally(() => setLoading(false));
  }, [tenantCode]);

  /* Count roles for header badges */
  const roleCounts = { CEO:0, Manager:0, "Team Lead":0, "Team Member":0 };
  if (tree) {
    const walk = node => {
      roleCounts[node.role] = (roleCounts[node.role] || 0) + 1;
      (node.children || []).forEach(walk);
    };
    walk(tree);
  }

  return (
    <div className="eh" style={{minHeight:"100vh",background:T.bg,padding:"0 0 56px"}}>
      <style>{CSS}</style>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden",marginBottom:22}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(139,92,246,.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,right:260,width:100,height:100,borderRadius:"50%",background:"rgba(6,182,212,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>CrewSync · Organisation</p>
            <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>PeopleMap</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>{companyName}</p>
          </div>
          {tree && (
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[
                {label:"CEO",        val:roleCounts.CEO,           accent:T.coral,   bg:"rgba(139,92,246,.15)"},
                {label:"Managers",   val:roleCounts.Manager,       accent:T.teal,    bg:"rgba(6,182,212,.15)"},
                {label:"Team Leads", val:roleCounts["Team Lead"],  accent:"#6366F1", bg:"rgba(99,102,241,.15)"},
                {label:"Members",    val:roleCounts["Team Member"], accent:"#94a3b8", bg:"rgba(148,163,184,.15)"},
              ].map(r => (
                <div key={r.label} style={{padding:"6px 12px",borderRadius:10,background:r.bg,border:"1px solid rgba(255,255,255,.12)",textAlign:"center",minWidth:52}}>
                  <p className="fd" style={{fontSize:16,fontWeight:900,color:r.accent,lineHeight:1}}>{r.val}</p>
                  <p style={{fontSize:9,color:"rgba(255,255,255,.55)",marginTop:2,fontWeight:600}}>{r.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{padding:"0 26px"}}>
        {loading && (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <p style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>Loading organisation chart…</p>
          </div>
        )}

        {!loading && error && (
          <div style={{padding:"14px 18px",borderRadius:12,background:"#FEF2F2",border:"1.5px solid #FECACA",marginBottom:16}}>
            <p style={{fontSize:13,color:"#991B1B"}}>{error}</p>
          </div>
        )}

        {!loading && !error && !tree && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px",textAlign:"center"}}>
            <span style={{fontSize:52,marginBottom:16,display:"block"}}>🏢</span>
            <p className="fd" style={{fontSize:16,fontWeight:900,color:T.navy,marginBottom:6}}>No PeopleMap Set Up Yet</p>
            <p style={{fontSize:13,color:"#64748b"}}>Your admin hasn't configured the organisation chart yet. Check back later.</p>
          </div>
        )}

        {!loading && !error && tree && (
          <div style={{overflowX:"auto",paddingBottom:32,paddingTop:8}}>
            <div style={{display:"inline-flex",justifyContent:"center",minWidth:"100%"}}>
              <OrgNode node={tree}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
