import React from 'react';
import { Link } from 'react-router-dom';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
  *{font-family:'DM Sans',sans-serif}
  h1,h2,h3,.fd{font-family:'Sora',sans-serif}
  .cb{background:linear-gradient(135deg,#8B5CF6,#06B6D4);box-shadow:0 4px 20px rgba(139,92,246,.3);transition:all .2s;border:none;cursor:pointer}
  .cb:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(139,92,246,.45)}
  .sl{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8B5CF6;background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2);padding:5px 14px;border-radius:999px}
  .gcard{background:#fff;border:1px solid #f0f0f0;border-radius:20px;padding:28px;transition:all .25s}
  .gcard:hover{border-color:#DDD6FE;box-shadow:0 8px 32px rgba(139,92,246,.08);transform:translateY(-3px)}
  .grid3{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
`;

export default function JoinerFlowPage() {
  return (
    <div style={{minHeight:'100vh',background:'#F6F8FB'}}>
      <style>{S}</style>

      {/* ── Navbar ── */}
      <header style={{background:'#fff',borderBottom:'1px solid #f0f0f0',position:'sticky',top:0,zIndex:100,boxShadow:'0 1px 8px rgba(0,0,0,.04)'}}>
        <nav style={{maxWidth:1200,margin:'0 auto',padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link to="/" style={{fontFamily:'Sora,sans-serif',fontWeight:900,fontSize:20,color:'#0B1020',textDecoration:'none'}}>
            CrewSync
          </Link>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <Link to="/" style={{fontSize:13,fontWeight:600,color:'#6b7280',textDecoration:'none'}}>← Back to Home</Link>
            <Link to="/login" style={{fontSize:13,fontWeight:600,color:'#6b7280',textDecoration:'none'}}>Sign in</Link>
            <Link to="/solutions/bookdemo" className="cb" style={{color:'#fff',fontWeight:700,fontSize:13,padding:'9px 20px',borderRadius:12,textDecoration:'none'}}>Book Demo</Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{background:'linear-gradient(160deg,#fff 0%,#fff8f5 100%)',padding:'72px 24px',textAlign:'center'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <span className="sl" style={{marginBottom:20,display:'inline-flex'}}>🚀 Joiner & Exit Flow</span>
          <h1 className="fd" style={{fontSize:'clamp(2rem,5vw,3rem)',fontWeight:900,color:'#0B1020',lineHeight:1.12,marginBottom:20,marginTop:16}}
            dangerouslySetInnerHTML={{ __html: 'First day done right.<br />Every single time.' }} />
          <p style={{fontSize:17,color:'#6b7280',lineHeight:1.75,marginBottom:32,maxWidth:560,margin:'0 auto 32px'}}>Digital offer letters, e-signatures, joining kits and welcome emails — all automated. Exit interviews and clearance checklists handled the same way.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/signup" className="cb" style={{color:'#fff',fontWeight:700,fontSize:14,padding:'12px 28px',borderRadius:12,textDecoration:'none'}}>
              Get Started Free →
            </Link>
            <Link to="/solutions/bookdemo" style={{fontWeight:700,fontSize:14,padding:'12px 28px',borderRadius:12,textDecoration:'none',border:'2px solid #e5e7eb',color:'#0B1020',background:'#fff',transition:'all .2s'}}>
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section style={{maxWidth:1100,margin:'0 auto',padding:'72px 24px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <span className="sl" style={{marginBottom:12,display:'inline-flex'}}>🎯 Key Capabilities</span>
          <h2 className="fd" style={{fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:900,color:'#0B1020',marginTop:12}}>
            Built to make your People team faster
          </h2>
        </div>
        <div className="grid3">
          <div className="gcard" key="Digital offer letters">
            <div style={{fontSize:28,marginBottom:12}}>📧</div>
            <h3 className="fd" style={{fontSize:16,fontWeight:800,color:'#0B1020',marginBottom:6}}>Digital offer letters</h3>
            <p style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>Generate and send signed offer letters in under 2 minutes.</p>
          </div>
          <div className="gcard" key="E-signatures">
            <div style={{fontSize:28,marginBottom:12}}>✍️</div>
            <h3 className="fd" style={{fontSize:16,fontWeight:800,color:'#0B1020',marginBottom:6}}>E-signatures</h3>
            <p style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>Persons sign documents digitally — no printing, scanning or couriers.</p>
          </div>
          <div className="gcard" key="Joining checklists">
            <div style={{fontSize:28,marginBottom:12}}>📋</div>
            <h3 className="fd" style={{fontSize:16,fontWeight:800,color:'#0B1020',marginBottom:6}}>Joining checklists</h3>
            <p style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>Customisable onboarding tasks assigned to People Studio, IT and the new hire.</p>
          </div>
          <div className="gcard" key="Welcome kits">
            <div style={{fontSize:28,marginBottom:12}}>🎁</div>
            <h3 className="fd" style={{fontSize:16,fontWeight:800,color:'#0B1020',marginBottom:6}}>Welcome kits</h3>
            <p style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>Auto-send welcome emails with all login credentials and policies.</p>
          </div>
          <div className="gcard" key="Structured exits">
            <div style={{fontSize:28,marginBottom:12}}>🚪</div>
            <h3 className="fd" style={{fontSize:16,fontWeight:800,color:'#0B1020',marginBottom:6}}>Structured exits</h3>
            <p style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>Exit interviews, knowledge transfer and asset return — all tracked.</p>
          </div>
          <div className="gcard" key="NOC & clearance">
            <div style={{fontSize:28,marginBottom:12}}>✅</div>
            <h3 className="fd" style={{fontSize:16,fontWeight:800,color:'#0B1020',marginBottom:6}}>NOC & clearance</h3>
            <p style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>Auto-generate full-and-final settlement and NOC documents.</p>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{background:'linear-gradient(135deg,#0B1020 0%,#182033 100%)',padding:'72px 24px',textAlign:'center'}}>
        <h2 className="fd" style={{fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:900,color:'#fff',marginBottom:12}}>
          Ready to see it in action?
        </h2>
        <p style={{color:'#9ca3af',marginBottom:28,fontSize:15}}>Free for your first 10 employees. No credit card. No lock-in.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/signup" className="cb" style={{color:'#fff',fontWeight:700,fontSize:14,padding:'13px 32px',borderRadius:12,textDecoration:'none'}}>
            Start Free Today →
          </Link>
          <Link to="/" style={{fontWeight:700,fontSize:14,padding:'13px 32px',borderRadius:12,textDecoration:'none',border:'2px solid rgba(255,255,255,.15)',color:'#fff',background:'transparent'}}>
            ← Back to Home
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{background:'#080e1a',padding:'24px',textAlign:'center',fontSize:12,color:'#4b5563'}}>
        © {new Date().getFullYear()} CrewSync Technologies · All rights reserved
      </footer>
    </div>
  );
}