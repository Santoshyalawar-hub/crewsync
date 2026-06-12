
import React, { useEffect, useMemo, useState } from 'react';
import api from "@/lib/apiClient";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  navy:    "#0B1020",
  navyMid: "#374151",
  coral:   "#8B5CF6",
  teal:    "#06B6D4",
  bg:      "#F5F7FB",
  border:  "#E8ECF2",
  soft:    "#64748B",
};

// ─── SVG icon helper ──────────────────────────────────────────────────────────
const Ic = ({ d, size = 16, sw = 1.8, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const I = {
  msg:      ["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"],
  search:   ["M11 19a8 8 0 100-16 8 8 0 000 16z","M21 21l-4.35-4.35"],
  plus:     ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 8v8","M8 12h8"],
  filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3",
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 6v6l4 2"],
  phone:    "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.55 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012.48 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.69 6.69l1.77-1.77a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  mail:     ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  book:     ["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"],
  help:     ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3","M12 17h.01"],
  file:     ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6"],
  send:     "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7",
  refresh:  "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  chev_d:   "M6 9l6 6 6-6",
  x:        "M18 6L6 18M6 6l12 12",
  check:    "M20 6L9 17l-5-5",
};


// ─── Status/priority helpers ──────────────────────────────────────────────────
const STATUS_META = {
  'open':        { bg:"rgba(59,130,246,.1)",  color:"#8B5CF6",  dot:"#3B82F6",  label:"Open"        },
  'in-progress': { bg:"rgba(245,158,11,.1)",  color:"#D97706",  dot:"#F59E0B",  label:"In Progress" },
  'resolved':    { bg:"rgba(16,185,129,.1)",   color:"#059669",  dot:"#10B981",  label:"Resolved"    },
  'closed':      { bg:"rgba(100,116,139,.1)",  color:"#475569",  dot:"#94A3B8",  label:"Closed"      },
};
const PRIORITY_COLOR = { urgent:"#DC2626", high:T.coral, medium:"#D97706", low:"#10B981" };

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.sc * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }
.sc .fd { font-family:'Sora',sans-serif; }

@keyframes sc-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.sc-in { animation:sc-in .3s cubic-bezier(.22,.97,.55,1) both; }

.sc-card { background:#fff; border:1.5px solid ${T.border}; border-radius:20px; box-shadow:0 4px 18px rgba(13,31,45,.06); overflow:hidden; }

.sc-input {
  width:100%; border:1.5px solid ${T.border}; background:#FAFBFD;
  border-radius:12px; padding:10px 14px; font-size:13px; color:${T.navy};
  outline:none; transition:all .18s; font-family:'DM Sans',sans-serif;
}
.sc-input:focus { border-color:${T.coral}; background:#fff; box-shadow:0 0 0 4px rgba(139,92,246,.07); }
.sc-textarea {
  width:100%; border:1.5px solid ${T.border}; background:#FAFBFD;
  border-radius:14px; padding:12px 14px; font-size:12px; color:${T.navy};
  outline:none; transition:all .18s; resize:none; font-family:'DM Sans',sans-serif;
}
.sc-textarea:focus { border-color:${T.coral}; background:#fff; box-shadow:0 0 0 4px rgba(139,92,246,.07); }

.sc-select {
  border:1.5px solid ${T.border}; background:#FAFBFD; border-radius:10px;
  padding:8px 32px 8px 12px; font-size:12px; color:${T.navy};
  outline:none; transition:all .18s; appearance:none; cursor:pointer;
  font-family:'DM Sans',sans-serif;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23FF6B35'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 10px center;
}
.sc-select:focus { border-color:${T.coral}; }

.sc-btn {
  display:inline-flex; align-items:center; justify-content:center; gap:7px;
  padding:10px 18px; border:none; border-radius:12px; font-size:13px;
  font-weight:700; cursor:pointer; transition:all .18s; font-family:'DM Sans',sans-serif;
}
.sc-btn.coral { background:linear-gradient(135deg,${T.coral},#FBBF24); color:#fff; box-shadow:0 4px 14px rgba(139,92,246,.22); }
.sc-btn.coral:hover { transform:translateY(-1px); box-shadow:0 8px 20px rgba(139,92,246,.3); }
.sc-btn.outline { background:#fff; border:1.5px solid ${T.border}; color:${T.navy}; }
.sc-btn.outline:hover { border-color:${T.coral}; color:${T.coral}; }
.sc-btn.ghost { background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.18); color:#fff; }
.sc-btn.ghost:hover { background:rgba(255,255,255,.17); }
.sc-btn.sm { padding:7px 14px; font-size:12px; border-radius:10px; }
.sc-btn.amber { background:rgba(245,158,11,.12); border:none; color:#D97706; }
.sc-btn.amber:hover { background:rgba(245,158,11,.2); }
.sc-btn.emerald { background:rgba(16,185,129,.1); border:none; color:#059669; }
.sc-btn.emerald:hover { background:rgba(16,185,129,.18); }

.sc-ticket-row {
  padding:14px 16px; border-radius:16px; border:1.5px solid ${T.border};
  background:#fff; cursor:pointer; transition:all .18s; text-align:left; width:100%;
}
.sc-ticket-row:hover { border-color:rgba(139,92,246,.25); background:#FFFAF7; }
.sc-ticket-row.active { border-color:${T.coral}; background:rgba(139,92,246,.04); box-shadow:0 0 0 3px rgba(139,92,246,.08); }

.sc-comment-bubble {
  background:#F6F8FB; border:1px solid ${T.border}; border-radius:14px; padding:12px 14px;
}

.sc-hero { background:linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 55%,#28445D 100%); padding:26px 28px 24px; position:relative; overflow:hidden; }

@keyframes spin { to{transform:rotate(360deg)} }
.sc-spin { animation:spin .9s linear infinite; display:inline-block; }
`;

// ─────────────────────────────────────────────────────────────────────────────
export default function CareDeskCenter() {
  const [tickets,        setTickets]        = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');
  const [search,         setSearch]         = useState('');
  const [filterStatus,   setFilterStatus]   = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply,          setReply]          = useState('');

  // ── helpers (identical to original) ──────────────────────────────────────
  const parseComments = (commentsJson) => {
    if (!commentsJson) return [];
    try {
      return JSON.parse(commentsJson).map(c => ({
        from: c.authorName || c.from || 'Unknown',
        text: c.comment    || c.text || '',
        at:   c.createdAt  || c.at   || new Date().toISOString(),
      }));
    } catch { return []; }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true); setError('');
      const res = await api.get('/api/tickets');
      const result = res.data;
      const data   = (result.data || []).map(t => ({
        ...t,
        ticketId: t.ticketId || `TKT-${t.id}`,
        status:   (t.status || '').toLowerCase().replace('_', '-'),
        priority: t.priority || 'MEDIUM',
        comments: parseComments(t.comments),
      }));
      setTickets(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchTickets();
    const iv = setInterval(fetchTickets, 10000);
    return () => clearInterval(iv);
  }, []);

  const stats = useMemo(() => ({
    total:      tickets.length,
    open:       tickets.filter(t => t.status === 'open').length,
    inprogress: tickets.filter(t => t.status === 'in-progress').length,
    resolved:   tickets.filter(t => t.status === 'resolved').length,
  }), [tickets]);

  const categories = useMemo(() => {
    const s = new Set(tickets.map(t=>(t.category||'').toLowerCase()).filter(c=>c.trim()));
    return Array.from(s);
  }, [tickets]);

  const filtered = useMemo(() => tickets.filter(t => {
    const q = search.trim().toLowerCase();
    if (q && !`${t.ticketId||''} ${t.subject||''} ${t.employeeName||''} ${t.description||''}`.toLowerCase().includes(q)) return false;
    if (filterStatus   !== 'all' && t.status                       !== filterStatus)   return false;
    if (filterPriority !== 'all' && (t.priority||'').toLowerCase() !== filterPriority) return false;
    if (filterCategory !== 'all' && (t.category||'').toLowerCase() !== filterCategory) return false;
    return true;
  }), [tickets, search, filterStatus, filterPriority, filterCategory]);

  useEffect(() => {
    if (!selectedTicket && filtered.length) setSelectedTicket(filtered[0]);
    if (filtered.length === 0) setSelectedTicket(null);
  }, [filtered]);

  const changeTicketStatus = async (ticketId, status) => {
    try {
      const ticket = tickets.find(t => t.ticketId === ticketId);
      if (!ticket) return;
      const res = await api.put(`/api/tickets/${ticket.id}/status`, { status: status.toUpperCase().replace('-', '_') });
      if (!res.data.success) throw new Error('Failed to update status');
      await fetchTickets();
      if (selectedTicket?.id === ticket.id) {
        const updatedRes = await api.get(`/api/tickets/${ticket.id}`);
        const updated = updatedRes.data;
        if (updated.data) setSelectedTicket({ ...updated.data, ticketId: updated.data.ticketId||`TKT-${updated.data.id}`, status:(updated.data.status||'').toLowerCase().replace('_','-'), comments:parseComments(updated.data.comments) });
      }
    } catch (err) { alert('Failed to update ticket: ' + err.message); }
  };

  const sendReply = async () => {
    if (!selectedTicket || !reply.trim()) return;
    try {
      await api.post(`/api/tickets/${selectedTicket.id}/comment`, { comment: reply.trim() });
      await fetchTickets();
      const updatedRes = await api.get(`/api/tickets/${selectedTicket.id}`);
      const updated = updatedRes.data;
      if (updated.data) setSelectedTicket({ ...updated.data, ticketId: updated.data.ticketId||`TKT-${updated.data.id}`, status:(updated.data.status||'').toLowerCase().replace('_','-'), comments:parseComments(updated.data.comments) });
      setReply('');
    } catch (err) { alert('Failed to add comment: ' + err.message); }
  };

  const sm = STATUS_META;

  return (
    <div className="sc" style={{ background:T.bg, minHeight:"100vh", paddingBottom:60 }}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div className="sc-hero">
        {[[200,200,"right",-28,"top",-38,"rgba(255,255,255,.04)"],[140,140,"right",180,"bottom",-46,"rgba(139,92,246,.1)"],[110,110,"left",-18,"bottom",-22,"rgba(6,182,212,.07)"]].map(([w,h,h1,v1,h2,v2,c],i)=>(
          <div key={i} style={{position:"absolute",width:w,height:h,borderRadius:"50%",background:c,[h1]:v1,[h2]:v2,pointerEvents:"none"}}/>
        ))}
        <div style={{ position:"relative",zIndex:2 }}>
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap" }}>
            <div>
              <div style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"6px 12px",borderRadius:999,background:"rgba(255,255,255,.08)",color:"#FFD7C8",fontSize:10,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10 }}>
                <Ic d={I.msg} size={12} color="#FFD7C8"/> CareDesk
              </div>
              <h1 className="fd" style={{ fontSize:26,fontWeight:900,color:"#fff",margin:0 }}>CareDesk Center</h1>
              <p style={{ fontSize:13,color:"rgba(255,255,255,.55)",marginTop:6 }}>Manage employee tickets and resolve issues faster</p>
            </div>
            <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
              {/* contact pills */}
              {[
                { icon:I.phone, text:"+1 (91) 123-4567" },
                { icon:I.mail,  text:"support@crewsync.app" },
              ].map(p => (
                <div key={p.text} style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"9px 14px",borderRadius:12,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.8)",fontSize:12,fontWeight:600 }}>
                  <Ic d={p.icon} size={13} color="rgba(255,255,255,.7)"/> {p.text}
                </div>
              ))}
              <button className="sc-btn ghost" onClick={fetchTickets} disabled={loading}>
                <span className={loading?"sc-spin":""}><Ic d={I.refresh} size={14} color="#fff"/></span>
                Refresh
              </button>
            </div>
          </div>

          {/* stat strip */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:20 }}>
            {[
              { label:"Total Tickets", val:stats.total,      color:"#fff" },
              { label:"Open",          val:stats.open,       color:"#93C5FD" },
              { label:"In Progress",   val:stats.inprogress, color:"#FCD34D" },
              { label:"Resolved",      val:stats.resolved,   color:"#6EE7B7" },
            ].map(s => (
              <div key={s.label} style={{ background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,padding:"14px 16px",backdropFilter:"blur(8px)" }}>
                <div style={{ fontSize:9,textTransform:"uppercase",letterSpacing:".12em",color:"rgba(255,255,255,.5)",fontWeight:700,marginBottom:5 }}>{s.label}</div>
                <div className="fd" style={{ fontSize:24,fontWeight:900,color:s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:"24px 24px 0" }}>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20 }} className="sc-in">
          {[
            { icon:I.book, label:"Knowledge Base", sub:"Search internal articles", accent:"rgba(99,102,241,.1)", color:"#6366F1" },
            { icon:I.help, label:"FAQs",           sub:"Common support answers",   accent:"rgba(139,92,246,.1)", color:T.coral   },
            { icon:I.file, label:"Documentation",  sub:"Guides & API docs",         accent:"rgba(2,132,199,.1)", color:"#0284C7" },
            { icon:I.clock,label:"Avg Response",   sub:"2.3 hours average",         accent:"rgba(245,158,11,.1)", color:"#F59E0B" },
          ].map(qa => (
            <div key={qa.label} className="sc-card" style={{ cursor:"pointer" }}>
              <div style={{ padding:"16px 18px",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:42,height:42,borderRadius:14,background:qa.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <Ic d={qa.icon} size={18} color={qa.color} sw={2}/>
                </div>
                <div>
                  <div style={{ fontSize:13,fontWeight:700,color:T.navy }}>{qa.label}</div>
                  <div style={{ fontSize:11,color:"#94A3B8",marginTop:2 }}>{qa.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ background:"rgba(239,68,68,.08)",border:"1.5px solid rgba(239,68,68,.2)",borderRadius:14,padding:"14px 18px",marginBottom:18,fontSize:13,color:"#DC2626",fontWeight:600 }} className="sc-in">
            ⚠ {error}
          </div>
        )}

        {/* ── FILTER BAR ── */}
        <div className="sc-card sc-in" style={{ marginBottom:20,animationDelay:".06s" }}>
          <div style={{ padding:"14px 18px",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center" }}>
            {/* search */}
            <div style={{ position:"relative",flex:1,minWidth:200 }}>
              <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)" }}>
                <Ic d={I.search} size={14} color="#94A3B8"/>
              </div>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search by ticket ID, subject, employee…"
                className="sc-input" style={{ paddingLeft:36,paddingTop:9,paddingBottom:9 }}/>
            </div>
            <button className="sc-btn outline sm" style={{ borderRadius:10 }}>
              <Ic d={I.filter} size={13} color={T.soft}/>
            </button>
            <select className="sc-select" value={filterStatus}   onChange={e=>setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select className="sc-select" value={filterPriority} onChange={e=>setFilterPriority(e.target.value)}>
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="sc-select" value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* ── MAIN SPLIT LAYOUT ── */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 360px",gap:20,alignItems:"start" }}>

          {/* ticket list */}
          <div className="sc-card sc-in" style={{ animationDelay:".08s" }}>
            <div style={{ padding:"16px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div className="fd" style={{ fontSize:15,fontWeight:800,color:T.navy }}>Tickets</div>
              <div style={{ fontSize:12,color:"#94A3B8",fontWeight:600 }}>{filtered.length} result{filtered.length!==1?"s":""}</div>
            </div>
            <div style={{ padding:"16px 14px" }}>
              {loading ? (
                <div style={{ textAlign:"center",padding:"48px 20px" }}>
                  <div className="sc-spin" style={{ width:36,height:36,borderRadius:"50%",border:`4px solid rgba(139,92,246,.15)`,borderTopColor:T.coral,margin:"0 auto 14px",display:"block" }}/>
                  <p style={{ fontSize:13,color:T.soft }}>Loading tickets…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign:"center",padding:"48px 20px" }}>
                  <Ic d={I.msg} size={40} color="#E2E8F0" sw={1.5}/>
                  <p style={{ fontSize:14,color:T.soft,margin:"14px 0 4px",fontWeight:600 }}>No tickets match your filters</p>
                  <p style={{ fontSize:12,color:"#94A3B8" }}>Try adjusting your search or filter options</p>
                </div>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  {filtered.map(t => {
                    const meta = sm[t.status] || sm.closed;
                    const pcolor = PRIORITY_COLOR[(t.priority||'').toLowerCase()] || "#94A3B8";
                    return (
                      <button key={t.id} type="button"
                        className={`sc-ticket-row ${selectedTicket?.id===t.id?"active":""}`}
                        onClick={() => setSelectedTicket(t)}>
                        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10 }}>
                          <div style={{ display:"flex",alignItems:"flex-start",gap:10,flex:1,minWidth:0 }}>
                            {/* status dot */}
                            <div style={{ width:8,height:8,borderRadius:"50%",background:meta.dot,flexShrink:0,marginTop:4 }}/>
                            <div style={{ minWidth:0,flex:1 }}>
                              <div style={{ display:"flex",alignItems:"center",gap:7,flexWrap:"wrap" }}>
                                <span style={{ fontSize:13,fontWeight:700,color:T.navy }}>{t.subject}</span>
                                <span style={{ fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:999,background:"#F1F5F9",color:T.soft }}>{t.ticketId}</span>
                              </div>
                              <div style={{ fontSize:11,color:"#94A3B8",marginTop:3 }}>{t.employeeName} · {t.category}</div>
                              <p style={{ fontSize:12,color:T.soft,margin:"7px 0 0",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{t.description}</p>
                            </div>
                          </div>
                          <div style={{ textAlign:"right",flexShrink:0 }}>
                            <div style={{ fontSize:11,fontWeight:800,color:pcolor }}>{t.priority}</div>
                            <div style={{ fontSize:10,color:"#94A3B8",marginTop:4 }}>{new Date(t.createdAt).toLocaleDateString()}</div>
                            <div style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:999,background:meta.bg,marginTop:6 }}>
                              <div style={{ width:5,height:5,borderRadius:"50%",background:meta.dot }}/>
                              <span style={{ fontSize:10,fontWeight:700,color:meta.color }}>{meta.label}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* detail panel */}
          <div style={{ position:"sticky",top:20 }}>
            <div className="sc-card sc-in" style={{ animationDelay:".1s" }}>
              {selectedTicket ? (
                <>
                  {/* modal head */}
                  <div style={{ padding:"18px 20px 16px",background:`linear-gradient(135deg,${T.navy},${T.navyMid})` }}>
                    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10 }}>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:10,fontWeight:700,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:4 }}>{selectedTicket.ticketId}</div>
                        <div className="fd" style={{ fontSize:15,fontWeight:800,color:"#fff",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{selectedTicket.subject}</div>
                        <div style={{ fontSize:11,color:"rgba(255,255,255,.5)" }}>{selectedTicket.employeeName} · {selectedTicket.category}</div>
                      </div>
                      {/* status badge */}
                      {(() => { const m=sm[selectedTicket.status]||sm.closed; return (
                        <div style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:999,background:"rgba(255,255,255,.1)",flexShrink:0 }}>
                          <div style={{ width:6,height:6,borderRadius:"50%",background:m.dot }}/>
                          <span style={{ fontSize:11,fontWeight:700,color:"#fff" }}>{m.label}</span>
                        </div>
                      );})()}
                    </div>
                  </div>

                  <div style={{ padding:"18px 18px 0" }}>
                    {/* meta row */}
                    <div style={{ display:"flex",gap:8,marginBottom:14,flexWrap:"wrap" }}>
                      {[
                        { label:"Priority", val:selectedTicket.priority, color: PRIORITY_COLOR[(selectedTicket.priority||'').toLowerCase()]||"#94A3B8" },
                        { label:"Created",  val:new Date(selectedTicket.createdAt).toLocaleDateString(), color:T.soft },
                      ].map(m => (
                        <div key={m.label} style={{ background:"#F6F8FB",border:`1px solid ${T.border}`,borderRadius:10,padding:"6px 12px" }}>
                          <span style={{ fontSize:9,color:"#94A3B8",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em" }}>{m.label}: </span>
                          <span style={{ fontSize:12,fontWeight:700,color:m.color }}>{m.val}</span>
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize:13,color:T.soft,lineHeight:1.65,marginBottom:16 }}>{selectedTicket.description}</p>

                    {/* status actions */}
                    <div style={{ display:"flex",gap:8,marginBottom:18 }}>
                      <button className="sc-btn amber sm" style={{ flex:1 }} onClick={()=>changeTicketStatus(selectedTicket.ticketId,'in-progress')}>
                        In Progress
                      </button>
                      <button className="sc-btn emerald sm" style={{ flex:1 }} onClick={()=>changeTicketStatus(selectedTicket.ticketId,'resolved')}>
                        <Ic d={I.check} size={12} color="#059669" sw={2.5}/> Resolve
                      </button>
                    </div>

                    {/* comments */}
                    <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:16,marginBottom:14 }}>
                      <div style={{ fontSize:11,fontWeight:800,color:T.navy,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12 }}>
                        Comments {selectedTicket.comments?.length ? `(${selectedTicket.comments.length})` : ""}
                      </div>
                      <div style={{ maxHeight:180,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingRight:2 }}>
                        {(!selectedTicket.comments || selectedTicket.comments.length === 0) && (
                          <div style={{ fontSize:12,color:"#94A3B8",textAlign:"center",padding:"16px 0" }}>No comments yet</div>
                        )}
                        {selectedTicket.comments?.map((c, i) => (
                          <div key={i} className="sc-comment-bubble">
                            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                              <span style={{ fontSize:11,fontWeight:700,color:T.navy }}>{c.from}</span>
                              <span style={{ fontSize:10,color:"#94A3B8" }}>{new Date(c.at).toLocaleString()}</span>
                            </div>
                            <div style={{ fontSize:12,color:T.soft,lineHeight:1.55 }}>{c.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* reply box */}
                    <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:14,paddingBottom:18 }}>
                      <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={3}
                        placeholder="Write a reply or internal note…" className="sc-textarea"
                        style={{ marginBottom:10 }}/>
                      <div style={{ display:"flex",justifyContent:"flex-end" }}>
                        <button className="sc-btn coral sm" onClick={sendReply} disabled={!reply.trim()}>
                          <Ic d={I.send} size={13} color="#fff"/> Send Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding:"56px 24px",textAlign:"center" }}>
                  <div style={{ width:56,height:56,borderRadius:18,background:"rgba(139,92,246,.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
                    <Ic d={I.msg} size={24} color={T.coral} sw={1.8}/>
                  </div>
                  <div className="fd" style={{ fontSize:15,fontWeight:800,color:T.navy }}>Select a ticket</div>
                  <div style={{ fontSize:12,color:"#94A3B8",marginTop:6 }}>Click any ticket from the list to view details, comments, and reply options</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}