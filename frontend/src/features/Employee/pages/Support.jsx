import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MessageSquare, Clock, HelpCircle, RefreshCw, X } from 'lucide-react';
import api from "@/lib/apiClient";

/* ── SamayaHR design tokens ── */
const T = {
  navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
  bg:"#F5F7FB", border:"#E8ECF2",
};



const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

.mt { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.mt .fd { font-family:'Sora',sans-serif; }
.mt-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); }

/* ticket grid cards */
.mt-ticket {
  background:#fff; border:1.5px solid ${T.border}; border-radius:16px;
  padding:16px 18px; text-align:left; cursor:pointer; transition:all .18s;
  display:flex; flex-direction:column; height:100%;
}
.mt-ticket:hover { border-color:rgba(255,107,53,.3); box-shadow:0 8px 24px rgba(13,31,45,.09); transform:translateY(-2px); }

/* filter tabs */
.mt-tab { padding:6px 16px; border-radius:9px; font-size:11px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; border:1.5px solid transparent; }

/* search input */
.mt-search { border:1.5px solid ${T.border}; border-radius:10px; padding:9px 12px 9px 36px; font-size:13px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; transition:border-color .15s; background:#fff; width:100%; box-sizing:border-box; }
.mt-search:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(255,107,53,.1); }

/* modal input */
.mt-input { border:1.5px solid ${T.border}; border-radius:10px; padding:9px 12px; font-size:13px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; transition:border-color .15s; background:#fff; width:100%; box-sizing:border-box; }
.mt-input:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(255,107,53,.1); }

/* buttons */
.mt-btn-primary { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; border-radius:11px; border:none; background:linear-gradient(135deg,${T.coral},#ff8c5a); color:#fff; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; box-shadow:0 4px 14px rgba(255,107,53,.3); transition:all .15s; }
.mt-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(255,107,53,.35); }
.mt-btn-ghost { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:11px; border:1.5px solid ${T.border}; background:#fff; color:#64748b; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
.mt-btn-ghost:hover { border-color:${T.coral}; color:${T.coral}; }
.mt-btn-ghost:disabled { opacity:.5; cursor:not-allowed; }

@keyframes mtUp   { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.mt-in  { animation:mtUp .35s ease both; }
@keyframes mtSpin { to{transform:rotate(360deg)} }
.mt-spin { animation:mtSpin .8s linear infinite; }

.mt-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
@media(max-width:900px){ .mt-grid{ grid-template-columns:1fr 1fr!important; } }
@media(max-width:540px){ .mt-grid{ grid-template-columns:1fr!important; } }
`;

/* ── priority + status colours ── */
const priorityStyle = p => {
  const v=(p||'').toLowerCase();
  if(v==='urgent') return {bg:'#FEF2F2',color:'#991B1B',border:'#FECACA'};
  if(v==='high')   return {bg:'#FFF7ED',color:'#C2410C',border:'#FED7AA'};
  if(v==='medium') return {bg:'#FFFBEB',color:'#B45309',border:'#FDE68A'};
  if(v==='low')    return {bg:'#ECFDF5',color:'#065F46',border:'#A7F3D0'};
  return {bg:'#F1F5F9',color:'#64748b',border:'#E2E8F0'};
};

const statusStyle = s => {
  if(s==='open')        return {bg:'rgba(255,107,53,.08)',color:T.coral,border:'rgba(255,107,53,.25)',dot:T.coral};
  if(s==='in-progress') return {bg:'#FFFBEB',color:'#B45309',border:'#FDE68A',dot:'#F59E0B'};
  if(s==='resolved')    return {bg:'rgba(0,194,168,.08)',color:T.teal,border:'rgba(0,194,168,.25)',dot:T.teal};
  return {bg:'#F1F5F9',color:'#64748b',border:'#E2E8F0',dot:'#94a3b8'};
};

const TABS = [
  {key:'all',label:'All Tickets'},
  {key:'open',label:'Open'},
  {key:'in-progress',label:'In Progress'},
  {key:'resolved',label:'Resolved'},
];

export default function MyTickets() {
  const [tickets,         setTickets]         = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [activeTab,       setActiveTab]       = useState('all');
  const [search,          setSearch]          = useState('');
  const [categoryFilter,  setCategoryFilter]  = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal,   setShowViewModal]   = useState(false);
  const [viewingTicket,   setViewingTicket]   = useState(null);

  const [newSubject,     setNewSubject]     = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory,    setNewCategory]    = useState('General');
  const [newPriority,    setNewPriority]    = useState('MEDIUM');

  const parseComments = comments => {
    if(!comments) return [];
    try {
      const parsed = typeof comments==='string' ? JSON.parse(comments) : comments;
      return parsed.map(c=>{
        const rawDate = c.createdAt||c.at;
        const dateObj = rawDate ? new Date(rawDate) : null;
        return { from:c.authorName||'Unknown', text:c.comment||'', at:dateObj&&!isNaN(dateObj.getTime())?dateObj.toISOString():null };
      });
    } catch { return []; }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true); setError('');
      const res = await api.get('/api/tickets/my-tickets');
      const result = res.data;
      const data = (result.data||[]).map(t=>({
        ...t,
        ticketId: t.ticketId||`TKT-${t.id}`,
        status:   (t.status||'').toLowerCase().replace('_','-'),
        priority: t.priority||'MEDIUM',
        comments: parseComments(t.comments),
      }));
      setTickets(data);
    } catch(err) { console.error(err); setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{
    fetchTickets();
    const iv = setInterval(fetchTickets,10000);
    return ()=>clearInterval(iv);
  },[]);

  const categories = useMemo(()=>Array.from(new Set(tickets.map(t=>t.category).filter(Boolean))),[tickets]);

  const filtered = useMemo(()=>tickets.filter(t=>{
    if(activeTab!=='all'&&t.status!==activeTab) return false;
    if(categoryFilter!=='all'&&t.category!==categoryFilter) return false;
    const q=search.trim().toLowerCase();
    if(q){ const h=`${t.ticketId} ${t.subject} ${t.description}`.toLowerCase(); if(!h.includes(q)) return false; }
    return true;
  }),[tickets,activeTab,categoryFilter,search]);

  const createTicket = async e => {
    e.preventDefault();
    if(!newSubject.trim()||!newDescription.trim()){ alert('Subject and description are required'); return; }
    try {
      await api.post('/api/tickets', {subject:newSubject.trim(),description:newDescription.trim(),category:newCategory,priority:newPriority});
      await fetchTickets();
      setShowCreateModal(false);
      setNewSubject(''); setNewDescription(''); setNewCategory('General'); setNewPriority('MEDIUM');
      alert('Ticket raised successfully!');
    } catch(err){ console.error(err); alert('Failed: '+err.message); }
  };

  const openView = t => { setViewingTicket(t); setShowViewModal(true); };

  /* ── count badges ── */
  const openCount     = tickets.filter(t=>t.status==='open').length;
  const progressCount = tickets.filter(t=>t.status==='in-progress').length;
  const resolvedCount = tickets.filter(t=>t.status==='resolved').length;

  return (
    <div className="mt" style={{padding:'0 0 56px'}}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:'22px 26px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:60,width:180,height:180,borderRadius:'50%',background:'rgba(255,107,53,.07)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-30,right:260,width:100,height:100,borderRadius:'50%',background:'rgba(0,194,168,.07)',pointerEvents:'none'}}/>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:'uppercase',letterSpacing:'.12em',marginBottom:4}}>SamayaHR · Support</p>
            <h1 className="fd" style={{fontSize:23,fontWeight:900,color:'#fff',margin:0}}>My Support Tickets</h1>
            <p style={{fontSize:13,color:'rgba(255,255,255,.5)',marginTop:4}}>Track and manage your raised issues.</p>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="mt-btn-ghost" onClick={fetchTickets} disabled={loading}
              style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',color:'#fff'}}>
              <RefreshCw size={13} className={loading?'mt-spin':''}/> Refresh
            </button>
            <button className="mt-btn-primary" onClick={()=>setShowCreateModal(true)}>
              <Plus size={13}/> New Ticket
            </button>
          </div>
        </div>
      </div>

      <div style={{padding:'22px 26px',display:'flex',flexDirection:'column',gap:18}}>

        {/* ── ERROR ── */}
        {error&&(
          <div style={{padding:'12px 16px',borderRadius:12,background:'#FEF2F2',border:'1.5px solid #FECACA',fontSize:13,color:'#991B1B'}}>
            ⚠️ {error}
          </div>
        )}

        {/* ── KPI ROW ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}} className="mt-kpi mt-in">
          <style>{`@media(max-width:580px){.mt-kpi{grid-template-columns:1fr!important}}`}</style>
          {[
            {icon:'🎫',cap:'Open',      val:openCount,     accent:T.coral,   bg:'rgba(255,107,53,.08)'},
            {icon:'⚙️',cap:'In Progress',val:progressCount,accent:'#F59E0B', bg:'rgba(245,158,11,.08)'},
            {icon:'✅',cap:'Resolved',  val:resolvedCount, accent:T.teal,    bg:'rgba(0,194,168,.08)'},
          ].map(k=>(
            <div key={k.cap} className="mt-card" style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:42,height:42,borderRadius:12,background:k.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{k.icon}</div>
              <div>
                <p style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:3}}>{k.cap}</p>
                <p className="fd" style={{fontSize:26,fontWeight:900,color:k.accent,lineHeight:1}}>{k.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── INFO BANNER ── */}
        <div style={{padding:'10px 16px',borderRadius:12,background:'rgba(255,107,53,.06)',border:`1.5px solid rgba(255,107,53,.2)`,display:'flex',alignItems:'center',gap:10}}>
          <HelpCircle size={15} color={T.coral}/>
          <p style={{fontSize:12,color:'#475569'}}>For urgent issues, call your HR / IT contact <strong style={{color:T.navy}}>in addition</strong> to raising a ticket.</p>
        </div>

        {/* ── FILTER TABS ── */}
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {TABS.map(tab=>{
            const active=activeTab===tab.key;
            return(
              <button key={tab.key} className="mt-tab" onClick={()=>setActiveTab(tab.key)}
                style={{background:active?`linear-gradient(135deg,${T.navy},${T.navyMid})`:'#fff',color:active?'#fff':'#64748b',borderColor:active?'transparent':T.border,boxShadow:active?'0 3px 10px rgba(13,31,45,.18)':'none'}}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── SEARCH + CATEGORY ── */}
        <div className="mt-card" style={{padding:'14px 18px',display:'flex',gap:14,flexWrap:'wrap',alignItems:'center'}}>
          <div style={{flex:1,minWidth:200,position:'relative'}}>
            <Search size={15} color="#94a3b8" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tickets…" className="mt-search"/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <p style={{fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.07em',whiteSpace:'nowrap'}}>Category</p>
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}
              style={{border:`1.5px solid ${T.border}`,borderRadius:8,padding:'6px 10px',fontSize:12,fontFamily:'DM Sans',color:T.navy,outline:'none',background:'#fff'}}>
              <option value="all">All</option>
              {categories.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading&&tickets.length===0&&(
          <div className="mt-card" style={{padding:'52px',textAlign:'center'}}>
            <div className="mt-spin" style={{width:32,height:32,border:`3px solid ${T.coral}`,borderTopColor:'transparent',borderRadius:'50%',margin:'0 auto 12px'}}/>
            <p style={{fontSize:13,color:'#94a3b8'}}>Fetching your tickets…</p>
          </div>
        )}

        {/* ── TICKET GRID ── */}
        {!loading&&(
          <div className="mt-grid">
            {filtered.map((t,i)=>{
              const ss=statusStyle(t.status);
              const ps=priorityStyle(t.priority);
              return(
                <button type="button" key={t.id||i} className="mt-ticket mt-in" style={{animationDelay:`${i*.04}s`}} onClick={()=>openView(t)}>
                  {/* top row: status + ticket id */}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:999,background:ss.bg,color:ss.color,border:`1px solid ${ss.border}`,fontSize:10,fontWeight:700}}>
                      <span style={{width:5,height:5,borderRadius:'50%',background:ss.dot}}/>
                      {t.status}
                    </span>
                    <code style={{fontSize:10,fontFamily:'monospace',background:'#F1F5F9',padding:'2px 8px',borderRadius:5,color:'#64748b',border:`1px solid ${T.border}`}}>{t.ticketId}</code>
                  </div>

                  {/* subject */}
                  <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,marginBottom:8,textAlign:'left',lineHeight:1.4}}>{t.subject}</p>

                  {/* category + priority */}
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
                    <span style={{fontSize:10,fontWeight:700,padding:'2px 9px',borderRadius:999,background:'#F1F5F9',color:'#475569',border:`1px solid ${T.border}`}}>{t.category}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:'2px 9px',borderRadius:999,background:ps.bg,color:ps.color,border:`1px solid ${ps.border}`}}>{t.priority}</span>
                  </div>

                  {/* description preview */}
                  <p style={{fontSize:12,color:'#64748b',lineHeight:1.6,textAlign:'left',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',flex:1}}>{t.description}</p>

                  {/* footer */}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:12,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                    <p style={{fontSize:10,color:'#94a3b8'}}>{new Date(t.createdAt).toLocaleDateString()}</p>
                    <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,color:'#94a3b8'}}>
                      <MessageSquare size={10}/> {t.comments?.length||0}
                    </span>
                  </div>
                </button>
              );
            })}

            {filtered.length===0&&!loading&&(
              <div style={{gridColumn:'1/-1',padding:'52px 24px',textAlign:'center',background:'#fff',borderRadius:16,border:`1.5px dashed ${T.border}`}}>
                <span style={{fontSize:36,display:'block',marginBottom:10}}>🔍</span>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,marginBottom:4}}>No tickets found</p>
                <p style={{fontSize:12,color:'#94a3b8'}}>Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CREATE MODAL ── */}
      {showCreateModal&&(
        <div style={{position:'fixed',inset:0,zIndex:40,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
          <div style={{position:'absolute',inset:0,background:'rgba(13,31,45,.5)',backdropFilter:'blur(4px)'}} onClick={()=>setShowCreateModal(false)}/>
          <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:560,background:'#fff',borderRadius:20,border:`1.5px solid ${T.border}`,boxShadow:'0 20px 60px rgba(13,31,45,.2)',overflow:'hidden'}}>
            {/* modal header */}
            <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:'16px 22px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:2}}>SamayaHR · Support</p>
                <p className="fd" style={{fontSize:16,fontWeight:900,color:'#fff'}}>Raise New Ticket</p>
              </div>
              <button onClick={()=>setShowCreateModal(false)} style={{width:30,height:30,borderRadius:8,border:'1px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff'}}>
                <X size={14}/>
              </button>
            </div>
            <div style={{padding:'20px 22px',display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <label style={{fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.07em',display:'block',marginBottom:5}}>Subject <span style={{color:T.coral}}>*</span></label>
                <input value={newSubject} onChange={e=>setNewSubject(e.target.value)} placeholder="Briefly describe your issue" className="mt-input"/>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.07em',display:'block',marginBottom:5}}>Description <span style={{color:T.coral}}>*</span></label>
                <textarea value={newDescription} onChange={e=>setNewDescription(e.target.value)} rows={4} placeholder="Provide more details…" className="mt-input" style={{resize:'none'}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.07em',display:'block',marginBottom:5}}>Category</label>
                  <select value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="mt-input">
                    {['General','Access','Payroll','Hardware','HR','IT_SUPPORT'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{minWidth:130}}>
                  <label style={{fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.07em',display:'block',marginBottom:5}}>Priority</label>
                  <select value={newPriority} onChange={e=>setNewPriority(e.target.value)} className="mt-input">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:4}}>
                <button className="mt-btn-ghost" onClick={()=>setShowCreateModal(false)}>Cancel</button>
                <button className="mt-btn-primary" onClick={createTicket}>
                  <Plus size={12}/> Raise Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {showViewModal&&viewingTicket&&(
        <ViewTicketModal ticket={viewingTicket} onClose={()=>{ setShowViewModal(false); setViewingTicket(null); }}/>
      )}
    </div>
  );
}

/* ── ViewTicketModal ── */
function ViewTicketModal({ ticket, onClose }) {
  const ss = statusStyle(ticket.status);
  const ps = priorityStyle(ticket.priority);

  return (
    <div style={{position:'fixed',inset:0,zIndex:40,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(13,31,45,.5)',backdropFilter:'blur(4px)'}} onClick={onClose}/>
      <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:640,background:'#fff',borderRadius:20,border:`1.5px solid ${T.border}`,boxShadow:'0 20px 60px rgba(13,31,45,.2)',overflow:'hidden',maxHeight:'90vh',display:'flex',flexDirection:'column'}}>

        {/* header */}
        <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:'16px 22px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexShrink:0}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
              <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'2px 9px',borderRadius:999,background:ss.bg,color:ss.color,border:`1px solid ${ss.border}`,fontSize:10,fontWeight:700}}>
                <span style={{width:5,height:5,borderRadius:'50%',background:ss.dot}}/>{ticket.status}
              </span>
              <code style={{fontSize:10,fontFamily:'monospace',background:'rgba(255,255,255,.12)',padding:'2px 8px',borderRadius:5,color:'rgba(255,255,255,.7)'}}>{ticket.ticketId}</code>
            </div>
            <p style={{fontSize:16,fontWeight:800,color:'#fff',fontFamily:'Sora',lineHeight:1.3}}>{ticket.subject}</p>
            <p style={{fontSize:11,color:'rgba(255,255,255,.5)',marginTop:4}}>
              {ticket.category} · Raised {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,border:'1px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff',flexShrink:0}}>
            <X size={14}/>
          </button>
        </div>

        <div style={{padding:'20px 22px',overflowY:'auto',display:'flex',flexDirection:'column',gap:16}}>
          {/* priority */}
          <span style={{display:'inline-flex',alignItems:'center',padding:'3px 10px',borderRadius:999,background:ps.bg,color:ps.color,border:`1px solid ${ps.border}`,fontSize:11,fontWeight:700,alignSelf:'flex-start'}}>
            Priority: {ticket.priority}
          </span>

          {/* description */}
          <div style={{padding:'14px 16px',borderRadius:12,background:'#F8FAFF',border:`1.5px solid ${T.border}`}}>
            <p style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8}}>Description</p>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.75}}>{ticket.description}</p>
          </div>

          {/* comments */}
          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.navy,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
              <MessageSquare size={12} color={T.coral}/> Comments ({ticket.comments?.length||0})
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:220,overflowY:'auto',paddingRight:4}}>
              {(!ticket.comments||ticket.comments.length===0)&&(
                <div style={{padding:'24px',textAlign:'center',borderRadius:10,background:'#F8FAFF',border:`1.5px dashed ${T.border}`}}>
                  <p style={{fontSize:12,color:'#94a3b8'}}>No comments yet from support.</p>
                </div>
              )}
              {ticket.comments&&ticket.comments.map((c,i)=>(
                <div key={i} style={{padding:'10px 14px',borderRadius:10,background:'#F8FAFF',border:`1.5px solid ${T.border}`}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
                    <p style={{fontSize:11,fontWeight:700,color:T.navy}}>{c.from}</p>
                    <p style={{fontSize:10,color:'#94a3b8'}}>
                      {c.at ? new Date(c.at).toLocaleString('en-IN',{year:'numeric',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'}) : '—'}
                    </p>
                  </div>
                  <p style={{fontSize:12,color:'#374151',lineHeight:1.65}}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{padding:'14px 22px',borderTop:`1px solid ${T.border}`,display:'flex',justifyContent:'flex-end',flexShrink:0}}>
          <button onClick={onClose} style={{padding:'9px 22px',borderRadius:11,border:`1.5px solid ${T.border}`,background:'#fff',color:'#64748b',fontSize:12,fontWeight:700,fontFamily:'DM Sans',cursor:'pointer'}}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}