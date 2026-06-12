import React, { useState, useEffect } from "react";
import { ScrollText, Search, RefreshCw, User } from "lucide-react";
import api from "@/lib/apiClient";

const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.aal { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.aal .fd { font-family:'Sora',sans-serif; }
.aal-panel { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.aal-row { display:grid; grid-template-columns:1fr 2fr 1.5fr 1fr; align-items:flex-start; gap:12px; padding:13px 18px; border-bottom:1px solid ${T.border}; }
.aal-row:hover { background:#FAFBFF; }
.aal-row:last-child { border-bottom:none; }
@keyframes aalUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.aal-in { animation:aalUp .3s ease both; }
.aal-input { border:1.5px solid ${T.border}; border-radius:10px; padding:8px 13px; font-size:12px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; background:#fff; }
.aal-input:focus { border-color:${T.coral}; }
`;

const fmtDateTime = d => d ? new Date(d).toLocaleString("en-IN",{
  day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"
}) : "—";

// Colour-code action types
const actionColor = action => {
  if (!action) return { bg:"#F1F5F9", color:"#64748b" };
  const a = action.toUpperCase();
  if (a.includes("CREATE") || a.includes("ADD"))    return { bg:"rgba(6,182,212,.1)",  color:"#0D7A6A" };
  if (a.includes("UPDATE") || a.includes("EDIT"))   return { bg:"rgba(99,102,241,.1)", color:"#4F46E5" };
  if (a.includes("DELETE") || a.includes("REMOVE")) return { bg:"rgba(239,68,68,.08)", color:"#991B1B" };
  if (a.includes("APPROVE"))                        return { bg:"rgba(6,182,212,.1)",  color:"#0D7A6A" };
  if (a.includes("REJECT"))                         return { bg:"rgba(239,68,68,.08)", color:"#991B1B" };
  if (a.includes("LOGIN"))                          return { bg:"rgba(139,92,246,.1)", color:T.coral   };
  return { bg:"#F1F5F9", color:"#64748b" };
};

export default function OperatorAuditLogs() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId,  setUserId]  = useState("");
  const [mode,    setMode]    = useState("user"); // "user" | "performer"
  const [search,  setSearch]  = useState("");

  const currentUserId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (currentUserId) {
      setUserId(currentUserId);
      fetchLogs(currentUserId, "performer");
      setMode("performer");
    }
  }, []);

  const fetchLogs = (id, m) => {
    if (!id) return;
    setLoading(true);
    const endpoint = m === "user"
      ? `/api/audit/user/${id}`
      : `/api/audit/performer/${id}`;
    api.get(endpoint)
      .then(res => {
        const raw = res.data?.data ?? res.data;
        setLogs(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  const handleSearch = () => {
    if (!userId.trim()) { alert("Enter a User ID to search."); return; }
    fetchLogs(userId.trim(), mode);
  };

  const filtered = logs.filter(l =>
    !search ||
    (l.action || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.details || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="aal" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(139,92,246,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>CrewSync · MoneyOps</p>
          <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>Activity Trail</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>Track all actions performed in the system</p>
        </div>
      </div>

      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

        {/* Search Controls */}
        <div style={{background:"#fff",border:`1.5px solid ${T.border}`,borderRadius:14,padding:"16px 18px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          {/* Mode toggle */}
          <div style={{display:"flex",background:"#F1F5F9",borderRadius:9,padding:3,gap:2}}>
            {[["performer","My Actions"],["user","Actions on User"]].map(([val,lbl]) => (
              <button key={val} onClick={() => setMode(val)}
                style={{padding:"5px 13px",borderRadius:7,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                  background:mode===val?`linear-gradient(135deg,${T.coral},#FBBF24)`:"transparent",
                  color:mode===val?"#fff":"#64748b",transition:"all .15s"}}>
                {lbl}
              </button>
            ))}
          </div>

          <div style={{position:"relative"}}>
            <User size={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}/>
            <input className="aal-input" value={userId} onChange={e => setUserId(e.target.value)}
              placeholder="User ID…" style={{paddingLeft:30,width:100}}/>
          </div>

          <button onClick={handleSearch}
            style={{padding:"8px 16px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${T.coral},#FBBF24)`,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            Search
          </button>

          <div style={{position:"relative",flex:1,minWidth:180}}>
            <Search size={13} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}/>
            <input className="aal-input" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Filter by action or details…" style={{paddingLeft:30,width:"100%",boxSizing:"border-box"}}/>
          </div>

          <button onClick={() => fetchLogs(userId || currentUserId, mode)}
            style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            <RefreshCw size={12}/> Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
          {[
            { label:"Total Logs", val:logs.length, color:T.navy },
            { label:"Shown", val:filtered.length, color:T.teal },
          ].map(s => (
            <div key={s.label} style={{background:"#fff",border:`1.5px solid ${T.border}`,borderRadius:14,padding:"14px 16px"}}>
              <p style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{s.label}</p>
              <p className="fd" style={{fontSize:22,fontWeight:900,color:s.color,margin:0}}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="aal-panel aal-in">
          <div style={{background:`linear-gradient(90deg,${T.navy},${T.navyMid})`,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
            <ScrollText size={15} color={T.coral}/>
            <p className="fd" style={{fontSize:13,fontWeight:800,color:"#fff"}}>Activity Log</p>
            <span style={{marginLeft:"auto",padding:"2px 9px",borderRadius:999,background:"rgba(139,92,246,.2)",color:T.coral,fontSize:10,fontWeight:700}}>{filtered.length}</span>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1.5fr 1fr",gap:12,padding:"10px 18px",borderBottom:`1.5px solid ${T.border}`,background:"#FAFBFF"}}>
            {["Action","Details","Timestamp","IP"].map(h => (
              <p key={h} style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em",margin:0}}>{h}</p>
            ))}
          </div>

          {loading ? (
            <div style={{padding:"40px",textAlign:"center"}}><p style={{fontSize:13,color:"#94a3b8"}}>Loading…</p></div>
          ) : filtered.length === 0 ? (
            <div style={{padding:"40px",textAlign:"center"}}>
              <p style={{fontSize:24,marginBottom:8}}>📋</p>
              <p style={{fontSize:13,color:"#94a3b8"}}>No audit logs found.</p>
            </div>
          ) : (
            filtered.map((log, i) => {
              const ac = actionColor(log.action);
              return (
                <div key={log.id || i} className="aal-row">
                  <span style={{display:"inline-flex",padding:"3px 9px",borderRadius:999,fontSize:10,fontWeight:700,background:ac.bg,color:ac.color,width:"fit-content"}}>
                    {log.action || "—"}
                  </span>
                  <p style={{fontSize:12,color:"#475569",margin:0,lineHeight:1.6,wordBreak:"break-word"}}>{log.details || "—"}</p>
                  <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{fmtDateTime(log.createdAt)}</p>
                  <p style={{fontSize:11,color:"#b0bec5",margin:0,fontFamily:"monospace"}}>{log.ipAddress || "—"}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
