import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ══ TOKENS: Navy #0D1F2D · Coral #FF6B35 · Teal #00C2A8 · Surface #F7F8FA ══ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
*{font-family:'DM Sans',sans-serif;box-sizing:border-box}
.fd{font-family:'Sora',sans-serif}
h1,h2,h3{font-family:'Sora',sans-serif}

@keyframes ticker  {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes floatY  {0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
@keyframes floatY2 {0%,100%{transform:translateY(-5px)}50%{transform:translateY(5px)}}
@keyframes floatY3 {0%,100%{transform:translateY(0px)}50%{transform:translateY(-7px)}}
@keyframes pdot    {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.8)}}
@keyframes scanY   {0%{top:12%}50%{top:78%}100%{top:12%}}
@keyframes ping    {0%{transform:scale(1);opacity:.8}100%{transform:scale(2.2);opacity:0}}
@keyframes spin1   {to{transform:rotate(360deg)}}
@keyframes spin2   {to{transform:rotate(-360deg)}}
@keyframes barUp   {from{height:2px}to{height:var(--bh)}}
@keyframes fadeIn  {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR  {from{width:0}to{width:var(--pw)}}
@keyframes blink   {0%,100%{opacity:1}50%{opacity:.3}}
@keyframes orbit1  {to{transform:rotate(360deg)}}
@keyframes orbit2  {to{transform:rotate(-360deg)}}
@keyframes glow    {0%,100%{box-shadow:0 0 12px rgba(0,194,168,.4)}50%{box-shadow:0 0 28px rgba(0,194,168,.8)}}
@keyframes rowFade {0%{background:rgba(255,107,53,.12)}100%{background:transparent}}
@keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes pulse-dot {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.4)}}

.coral-btn{background:linear-gradient(135deg,#FF6B35,#FF5722);box-shadow:0 4px 20px rgba(255,107,53,.35);transition:all .25s}
.coral-btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(255,107,53,.45)}
.dark-btn{background:#0D1F2D;transition:all .25s}
.dark-btn:hover{background:#162639;transform:translateY(-1px)}
.g-coral{background:linear-gradient(135deg,#FF6B35 0%,#FF9A5C 60%,#FFB347 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.g-teal{background:linear-gradient(135deg,#00C2A8,#00A896);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.spill{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#FF6B35;background:rgba(255,107,53,.08);border:1px solid rgba(255,107,53,.2);padding:5px 14px;border-radius:999px}
.chteal{width:20px;height:20px;border-radius:50%;background:rgba(0,194,168,.12);color:#00C2A8;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0}
.nav-ul::after{content:'';position:absolute;bottom:-2px;left:50%;right:50%;height:2px;background:#FF6B35;border-radius:2px;transition:left .2s,right .2s}
.nav-ul:hover::after{left:0;right:0}
.hero-mesh{background:radial-gradient(ellipse 70% 50% at 65% 0%,rgba(255,107,53,.10) 0%,transparent 65%),radial-gradient(ellipse 50% 40% at 10% 80%,rgba(0,194,168,.08) 0%,transparent 60%)}
.divider{height:3px;background:linear-gradient(90deg,#FF6B35,#00C2A8);border-radius:3px}
.ticker-mask{mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent);-webkit-mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent)}
.animate-float-0{animation:float 5s ease-in-out infinite 0s}
.animate-float-1{animation:float 5s ease-in-out infinite 1.2s}
.animate-float-2{animation:float 5s ease-in-out infinite 0.6s}
.animate-float-3{animation:float 5s ease-in-out infinite 1.8s}
.pulse-dot{animation:pulse-dot 2s ease-in-out infinite}
`;

/* ─── helpers ─── */
const S = (styles) => ({ style: styles });
const Pill = ({ c }) => <span className="spill">{c}</span>;
const Li = ({ c }) => <li style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}><span className="chteal">✓</span><span style={{ fontSize:14,color:'#4b5563',fontWeight:500 }}>{c}</span></li>;

/* ══════════════════════════════════════════════════════════
   VISUAL 1 ─ HERO: Full App Dashboard (laptop)
══════════════════════════════════════════════════════════ */
function HeroDashboard() {
  const [activeNav, setActiveNav] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const employees = [
    { init: 'RS', name: 'Riya S.', dept: 'Design', time: '09:02', c: '#FF6B35' },
    { init: 'AK', name: 'Arjun K.', dept: 'Engineering', time: '09:05', c: '#00C2A8' },
    { init: 'PP', name: 'Priya P.', dept: 'HR', time: '09:08', c: '#818cf8' },
    { init: 'MT', name: 'Meera T.', dept: 'Finance', time: '09:11', c: '#34d399' },
  ];

  return (
    <div style={{ width: 540 }}>
      <div style={{ borderRadius: '16px 16px 0 0', padding: '10px 12px 0', background: 'linear-gradient(145deg,#1e2533,#0d1420)', boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca40' }} />
          <div style={{ flex: 1, marginLeft: 8, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,194,168,.6)' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', fontFamily: 'monospace' }}>app.samayahr.com/dashboard</span>
          </div>
        </div>
        <div style={{ background: '#f0f2f5', borderRadius: '10px 10px 0 0', overflow: 'hidden', height: 320, display: 'flex' }}>
          <div style={{ width: 52, background: '#0D1F2D', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 14, gap: 6, flexShrink: 0 }}>
            <img src="/SamayaHRSidebar.png" alt="SamayaHR" style={{ width: 30, height: 30, borderRadius: 9, objectFit: 'contain', marginBottom: 6, flexShrink: 0 }} />
            {['📊','⏱️','💸','👥','📅','🔐'].map((ic, i) => (
              <div key={i} onClick={() => setActiveNav(i)} style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', background: i === activeNav ? 'rgba(255,107,53,.25)' : 'transparent', borderLeft: i === activeNav ? '2px solid #FF6B35' : '2px solid transparent', transition: 'all .2s' }}>{ic}</div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '12px 14px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 8, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>March 2026</div>
                <div className="fd" style={{ fontSize: 13, fontWeight: 900, color: '#0D1F2D' }}>Dashboard</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#e8fdf7', border: '1px solid #b2f0e8', borderRadius: 999, padding: '3px 8px' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00C2A8', animation: 'pdot 1.4s ease-in-out infinite' }} />
                  <span style={{ fontSize: 8, color: '#00A896', fontWeight: 700 }}>Live</span>
                </div>
                <div className="fd" style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B35,#FF5722)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>KR</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7, marginBottom: 12 }}>
              {[
                { l: 'Total Staff', v: '124', d: '↑ 3 new', bg: '#fff', dc: '#00C2A8' },
                { l: 'Present Today', v: '116', d: '93.5%', bg: '#e8fdf7', dc: '#00C2A8' },
                { l: 'On Leave', v: '8', d: '6.5%', bg: '#fff7ed', dc: '#FF6B35' },
                { l: 'Payroll Due', v: '₹1.4L', d: '✓ Auto', bg: '#f0fdf4', dc: '#16a34a' },
              ].map(s => (
                <div key={s.l} style={{ background: s.bg, border: '1px solid rgba(0,0,0,.05)', borderRadius: 10, padding: '7px 9px' }}>
                  <div style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>{s.l}</div>
                  <div className="fd" style={{ fontSize: 15, fontWeight: 900, color: '#0D1F2D', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 7, fontWeight: 700, color: s.dc, marginTop: 2 }}>{s.d}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 10, border: '1px solid rgba(0,0,0,.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.06em' }}>Weekly Attendance</span>
                  <span style={{ fontSize: 7, color: '#FF6B35', fontWeight: 700 }}>View All →</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60, marginBottom: 6 }}>
                  {[85, 92, 78, 95, 88, 52, 48].map((h, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ width: '100%', borderRadius: '3px 3px 2px 2px', height: `${h * 0.6}px`, background: i === 4 ? 'linear-gradient(180deg,#FF6B35,#FF5722)' : i < 5 ? 'linear-gradient(180deg,#00C2A8,#00a896)' : '#e5e7eb', boxShadow: i === 4 ? '0 2px 8px rgba(255,107,53,.4)' : 'none' }} />
                      <span style={{ fontSize: 6, color: '#9ca3af', fontWeight: 600 }}>{['M','T','W','T','F','S','S'][i]}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 6 }}>
                  <div style={{ fontSize: 7, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Live Check-ins</div>
                  {employees.slice(0, 3).map(e => (
                    <div key={e.init} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${e.c}22`, border: `1.5px solid ${e.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6, fontWeight: 800, color: e.c }}>{e.init}</div>
                        <div>
                          <div style={{ fontSize: 8, fontWeight: 700, color: '#0D1F2D' }}>{e.name}</div>
                          <div style={{ fontSize: 6, color: '#9ca3af' }}>{e.dept}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 7, fontWeight: 700, color: '#00A896', background: '#e8fdf7', padding: '2px 5px', borderRadius: 999 }}>✓ {e.time}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: 'linear-gradient(135deg,#0D1F2D,#162639)', borderRadius: 10, padding: '10px 12px', flex: 1 }}>
                  <div style={{ fontSize: 7, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>March Payroll</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div className="fd" style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>₹41,500</div>
                    <div style={{ position: 'relative', width: 38, height: 38 }}>
                      <svg viewBox="0 0 38 38" style={{ width: 38, height: 38, transform: 'rotate(-90deg)' }}>
                        <circle cx="19" cy="19" r="15" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="4.5" />
                        <circle cx="19" cy="19" r="15" fill="none" stroke="#00C2A8" strokeWidth="4.5" strokeDasharray="85 94" strokeLinecap="round" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 900, color: '#fff' }}>90%</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                    {[['Base','₹30K','#818cf8'],['Bonus','₹9K','#00C2A8'],['Ded.','₹2.5K','#FF6B35']].map(([l,v,c]) => (
                      <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '4px 6px', textAlign: 'center' }}>
                        <div style={{ fontSize: 9, fontWeight: 800, color: c }}>{v}</div>
                        <div style={{ fontSize: 6, color: '#6b7280', marginTop: 1 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: '90%', height: '100%', background: 'linear-gradient(90deg,#00C2A8,#00e6cc)', borderRadius: 2 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 7, color: '#6b7280' }}>112 of 124 employees</span>
                    <span style={{ fontSize: 7, color: '#00C2A8', fontWeight: 700 }}>90%</span>
                  </div>
                </div>
                <button style={{ width: '100%', padding: '8px 0', borderRadius: 8, fontWeight: 800, fontSize: 9, background: 'linear-gradient(135deg,#FF6B35,#FF5722)', color: '#fff', border: 'none', cursor: 'pointer', letterSpacing: '.04em', boxShadow: '0 4px 12px rgba(255,107,53,.4)' }}>
                  ⚡ Run Payroll Now →
                </button>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[['PF','✓','#00C2A8'],['TDS','✓','#818cf8'],['ESI','✓','#34d399']].map(([l,ic,c]) => (
                    <div key={l} style={{ flex: 1, background: '#fff', borderRadius: 7, padding: '4px 0', textAlign: 'center', border: '1px solid #f3f4f6' }}>
                      <div style={{ fontSize: 9, fontWeight: 800, color: c }}>{ic}</div>
                      <div style={{ fontSize: 6, color: '#9ca3af', fontWeight: 700 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 14, background: '#161c28', borderRadius: '0 0 8px 8px', margin: '0 8px' }} />
      <div style={{ height: 8, background: '#0f1420', borderRadius: '0 0 14px 14px', margin: '0 30px' }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VISUAL 1b ─ HERO PHONE
══════════════════════════════════════════════════════════ */
function HeroPhone() {
  const [secs, setSecs] = useState(6 * 3600 + 42 * 60 + 11);
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const id = setInterval(() => { setSecs(s => s + 1); setPulse(p => !p); }, 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = s => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div style={{ width: 195, borderRadius: 38, padding: 7, background: 'linear-gradient(145deg,#1a1a2e,#0d1117)', boxShadow: '0 28px 70px rgba(0,0,0,.45)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 50, height: 13, borderRadius: 999, background: '#0d1117', zIndex: 10 }} />
      <div style={{ borderRadius: 32, overflow: 'hidden', height: 390, background: '#F7F8FA' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 14px 8px', background: '#0D1F2D' }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,.6)', fontWeight: 700 }}>9:41 AM</span>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {[...Array(4)].map((_,i) => <div key={i} style={{ width: 3, height: 4+i*2, borderRadius: 1, background: i < 3 ? '#fff' : 'rgba(255,255,255,.3)' }} />)}
            <div style={{ width: 13, height: 7, borderRadius: 2, border: '1px solid rgba(255,255,255,.4)', marginLeft: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 1, top: 1, right: 2, bottom: 1, borderRadius: 1, background: '#00C2A8' }} />
            </div>
          </div>
        </div>
        <div style={{ margin: '8px 8px 0', borderRadius: 14, padding: '10px 12px', background: 'linear-gradient(135deg,#0D1F2D,#1a3a52)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, top: -10, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,107,53,.15)' }} />
          <div style={{ fontSize: 8, color: '#FF6B35', fontWeight: 700, marginBottom: 2 }}>Good morning 👋</div>
          <div className="fd" style={{ fontSize: 14, color: '#fff', fontWeight: 900 }}>Kumar Raj</div>
          <div style={{ fontSize: 8, color: '#6b7280', marginTop: 2 }}>Design Lead · Thursday</div>
        </div>
        <div style={{ margin: '8px 8px', background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,194,168,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C2A8', opacity: pulse ? 1 : 0.3, transition: 'opacity .5s' }} />
            <span style={{ fontSize: 8, color: '#00C2A8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Work Time</span>
          </div>
          <div className="fd" style={{ fontSize: 22, fontWeight: 900, color: '#0D1F2D', letterSpacing: '-1px', marginBottom: 6 }}>{fmt(secs)}</div>
          <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg,#00C2A8,#00e6cc)', borderRadius: 2 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, color: '#9ca3af', fontWeight: 600 }}>
            <span>Check-in: 09:00 AM</span><span>Target: 9h</span>
          </div>
        </div>
        <div style={{ margin: '0 8px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div style={{ background: '#fff7ed', borderRadius: 12, padding: '8px 10px', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: 7, color: '#FF6B35', fontWeight: 700, marginBottom: 2 }}>☕ Break</div>
            <div className="fd" style={{ fontSize: 14, color: '#FF6B35', fontWeight: 900 }}>00:30</div>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '8px 10px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 7, color: '#16a34a', fontWeight: 700, marginBottom: 2 }}>⚡ OT</div>
            <div className="fd" style={{ fontSize: 14, color: '#16a34a', fontWeight: 900 }}>01:12</div>
          </div>
        </div>
        <div style={{ margin: '0 8px 8px' }}>
          <button style={{ width: '100%', background: 'linear-gradient(135deg,#FF6B35,#FF5722)', color: '#fff', fontWeight: 800, fontSize: 10, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,53,.4)', letterSpacing: '.04em' }}>⏹ Stop Work</button>
        </div>
        <div style={{ margin: '0 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[['📅','Apply Leave','3 pending','#fff7ed'],['₹','View Payslip','Mar 2026','#e8fdf7'],['📊','My Analytics','98% month','#f0f9ff']].map(([ic,lb,sub,bg]) => (
            <div key={lb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 10, padding: '6px 10px', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{ic}</div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#0D1F2D' }}>{lb}</div>
                  <div style={{ fontSize: 7, color: '#9ca3af' }}>{sub}</div>
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#d1d5db' }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VISUAL 2 ─ ATTENDANCE
   Matches the real "My Attendance" page exactly:
   - Light white card (not dark)
   - SamayaHR top nav strip + Clock In button
   - Employee status bar (name, Not Started, check-in, present count)
   - Year nav ‹ 2026 › + P/L/A/H stat badges
   - Horizontal calendar: dark header row (MONTH + day 1–31)
     then month rows (Jan/Feb/Mar) with colored badge cells
   - P=blue, A=orange, H=yellow, L=purple (matches screenshot)
   - Footer legend + Live sync dot
   - Floating GPS + streak badges
══════════════════════════════════════════════════════════ */
function AttendanceVisual() {
  const [currentYear] = useState(2026);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1600);
    return () => clearInterval(id);
  }, []);

  // Build month day data: array of {day, type}
  const buildMonth = (total, data) => {
    const map = {};
    data.forEach(([d, t]) => { map[d] = t; });
    return Array.from({ length: total }, (_, i) => ({ day: i + 1, type: map[i + 1] || '' }));
  };

  // Jan: lots of A and H (matching screenshot pattern)
  const months = [
    {
      name: 'Jan', short: '22A',
      days: buildMonth(31, [
        [1,'A'],[2,'A'],[3,'H'],[4,'H'],[5,'A'],[6,'A'],[7,'A'],[8,'A'],[9,'A'],
        [10,'H'],[11,'H'],[12,'A'],[13,'A'],[14,'A'],[15,'A'],[16,'A'],[17,'H'],[18,'H'],
        [19,'A'],[20,'A'],[21,'A'],[22,'A'],[23,'A'],[24,'H'],[25,'H'],[26,'A'],[27,'A'],
        [28,'A'],[29,'A'],[30,'A'],[31,'H'],
      ]),
    },
    {
      name: 'Feb', short: '20A',
      days: buildMonth(28, [
        [1,'H'],[2,'A'],[3,'A'],[4,'A'],[5,'A'],[6,'A'],[7,'H'],[8,'H'],[9,'A'],[10,'A'],
        [11,'A'],[12,'A'],[13,'A'],[14,'H'],[15,'H'],[16,'A'],[17,'A'],[18,'A'],[19,'A'],
        [20,'A'],[21,'H'],[22,'H'],[23,'A'],[24,'A'],[25,'A'],[26,'A'],[27,'A'],[28,'H'],
      ]),
    },
    {
      name: 'Mar', short: '5A',
      days: buildMonth(31, [
        [1,'A'],[2,'A'],[3,'A'],[4,'A'],[5,'A'],[6,'A'],[7,'H'],[8,'H'],
      ]),
    },
  ];

  // Stats matching screenshot: P=0, L=0, A=47, H=26
  const stats = [
    { letter: 'P', label: 'Present', count: 0,  bg: '#3b82f6', light: '#eff6ff', text: '#1d4ed8' },
    { letter: 'L', label: 'Leave',   count: 0,  bg: '#a78bfa', light: '#f5f3ff', text: '#7c3aed' },
    { letter: 'A', label: 'Absent',  count: 47, bg: '#f97316', light: '#fff7ed', text: '#c2410c' },
    { letter: 'H', label: 'Holiday', count: 26, bg: '#eab308', light: '#fefce8', text: '#a16207' },
  ];

  // Cell colors: P=blue, A=orange, H=yellow, L=purple
  const getCell = (type, mIdx, day) => {
    const isToday = mIdx === 2 && day === 8;
    const base = {
      width: 22, minWidth: 22, height: 22, borderRadius: 6, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 7.5, fontWeight: 900, cursor: 'pointer',
      transition: 'transform .12s, box-shadow .12s',
      border: isToday ? '2px solid #f97316' : '1.5px solid transparent',
    };
    if (!type) return { ...base, background: 'transparent', color: 'transparent', border: '1.5px dashed #e2e8f0', cursor: 'default' };
    const colors = { P: ['#3b82f6','#fff'], A: ['#f97316','#fff'], H: ['#eab308','#fff'], L: ['#a78bfa','#fff'] };
    const [bg, fg] = colors[type] || ['#e5e7eb','#64748b'];
    return { ...base, background: bg, color: fg };
  };

  return (
    <div style={{ position: 'relative', width: '100%', animation: 'floatY 6s ease-in-out infinite' }}>

      {/* ── Main white card ── */}
      <div style={{
        background: '#ffffff',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.10), 0 4px 16px rgba(0,0,0,.05)',
        border: '1px solid #f1f5f9',
      }}>

        {/* ── Top nav bar: SamayaHR branding + Clock In ── */}
        <div style={{
          background: '#ffffff', borderBottom: '1px solid #f1f5f9',
          padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/SamayaHRSidebar.png" alt="SamayaHR" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em' }}>SAMAYAHR</div>
              <div className="fd" style={{ fontSize: 13, fontWeight: 900, color: '#0D1F2D', lineHeight: 1.1 }}>My Attendance</div>
            </div>
          </div>
          {/* Clock In button — coral, exactly like real app */}
          <div style={{
            background: 'linear-gradient(135deg,#FF6B35,#FF5722)', color: '#fff',
            borderRadius: 9, padding: '6px 14px',
            fontSize: 9.5, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(255,107,53,.4)',
            display: 'flex', alignItems: 'center', gap: 5,
            animation: tick % 4 === 0 ? 'glow .6s ease' : 'none',
          }}>
            <span style={{ fontSize: 9 }}>▶</span> Clock In
          </div>
        </div>

        {/* ── Employee status row ── */}
        <div style={{
          background: '#f8fafc', borderBottom: '1px solid #f1f5f9',
          padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {/* Avatar */}
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#FF6B35,#FF5722)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>E</div>
          {/* Name + status */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#0D1F2D' }}>Employee</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <span style={{ fontSize: 7.5, background: '#f1f5f9', color: '#64748b', borderRadius: 999, padding: '1px 8px', fontWeight: 700, border: '1px solid #e2e8f0' }}>Not Started</span>
              <span style={{ fontSize: 7, color: '#94a3b8', fontWeight: 600 }}>TODAY · MAR 8</span>
            </div>
          </div>
          {/* Check-in time */}
          <div style={{ textAlign: 'center', marginRight: 12 }}>
            <div style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>CHECK-IN</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#0D1F2D' }}>—</div>
          </div>
          {/* Present count */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>PRESENT</div>
            <div className="fd" style={{ fontSize: 16, fontWeight: 900, color: '#f97316' }}>0</div>
            <div style={{ fontSize: 6.5, color: '#94a3b8', fontWeight: 600 }}>THIS YEAR</div>
          </div>
        </div>

        {/* ── Year nav + Stat badges ── */}
        <div style={{
          padding: '8px 16px', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
        }}>
          {/* Year navigator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button style={{ width: 22, height: 22, borderRadius: 6, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 10, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <span style={{ background: '#fff7ed', border: '2px solid #f97316', borderRadius: 9, padding: '3px 14px', fontSize: 12, fontWeight: 900, color: '#c2410c' }}>{currentYear}</span>
            <button style={{ width: 22, height: 22, borderRadius: 6, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 10, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          </div>
          {/* P / L / A / H badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {stats.map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: s.light, border: `1.5px solid ${s.bg}25`,
                borderRadius: 8, padding: '3px 9px',
              }}>
                <div style={{ width: 16, height: 16, borderRadius: 5, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7.5, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{s.letter}</div>
                <span className="fd" style={{ fontSize: 12, fontWeight: 900, color: s.text }}>{s.count}</span>
                <span style={{ fontSize: 8, color: '#64748b', fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Horizontal Calendar Grid ══
            Dark header row: MONTH col + day numbers 1–31
            Then month rows with colored badge cells            */}
        <div style={{ overflowX: 'auto', background: '#fff' }}>
          <div style={{ minWidth: 640 }}>

            {/* Header: dark background, day numbers */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#0D1F2D', borderBottom: '2px solid #1a2740' }}>
              <div style={{ width: 60, minWidth: 60, flexShrink: 0, padding: '7px 12px' }}>
                <span style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '.1em' }}>MONTH</span>
              </div>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <div key={d} style={{
                  width: 26, minWidth: 26, flexShrink: 0,
                  textAlign: 'center', padding: '7px 2px',
                  fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.5)',
                }}>{d}</div>
              ))}
            </div>

            {/* Month rows */}
            {months.map((m, mIdx) => (
              <div key={m.name} style={{
                display: 'flex', alignItems: 'center',
                borderBottom: mIdx < months.length - 1 ? '1px solid #f8fafc' : 'none',
                background: mIdx % 2 === 0 ? '#ffffff' : '#fafbfc',
              }}>
                {/* Month label column */}
                <div style={{
                  width: 60, minWidth: 60, flexShrink: 0,
                  padding: '7px 12px', borderRight: '2px solid #f1f5f9',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#0D1F2D', lineHeight: 1 }}>{m.name}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#f97316', marginTop: 2 }}>{m.short}</div>
                </div>

                {/* Day cells */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '5px 4px', flex: 1 }}>
                  {Array.from({ length: 31 }, (_, i) => {
                    const entry = m.days[i];
                    const type = entry ? entry.type : '';
                    const day = i + 1;
                    const key = `${mIdx}-${day}`;
                    const cs = getCell(type, mIdx, day);
                    const isHovered = hoveredCell === key && !!type;
                    return (
                      <div
                        key={key}
                        onMouseEnter={() => type && setHoveredCell(key)}
                        onMouseLeave={() => setHoveredCell(null)}
                        style={{
                          ...cs,
                          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                          boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,.2)' : 'none',
                          zIndex: isHovered ? 2 : 1,
                          position: 'relative',
                        }}
                      >
                        {type}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Legend footer ── */}
        <div style={{
          padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {[['P','#3b82f6','Present'],['A','#f97316','Absent'],['H','#eab308','Holiday'],['L','#a78bfa','Leave']].map(([l,c,label]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 15, height: 15, borderRadius: 4, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7.5, fontWeight: 900, color: '#fff' }}>{l}</div>
              <span style={{ fontSize: 8.5, color: '#64748b', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C2A8', animation: 'pdot 1.4s ease-in-out infinite' }} />
            <span style={{ fontSize: 8, color: '#00A896', fontWeight: 700 }}>Live sync</span>
          </div>
        </div>
      </div>

      {/* Floating GPS badge */}
      <div style={{ position:'absolute', top:-12, right:-16, background:'#fff', borderRadius:11, padding:'6px 10px', boxShadow:'0 6px 20px rgba(0,0,0,.12)', border:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:6, animation:'floatY2 4s ease-in-out infinite' }}>
        <span style={{ fontSize:14 }}>📍</span>
        <div><div style={{ fontSize:9, fontWeight:800, color:'#0D1F2D' }}>GPS Verified</div><div style={{ fontSize:7.5, color:'#00C2A8', fontWeight:700 }}>Office · 0.12 km</div></div>
      </div>

      {/* Floating streak badge */}
      <div style={{ position:'absolute', bottom:-12, left:-16, background:'#fff', borderRadius:11, padding:'6px 10px', boxShadow:'0 6px 20px rgba(0,0,0,.12)', border:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:6, animation:'floatY2 4s ease-in-out infinite 1.2s' }}>
        <span style={{ fontSize:14 }}>🔥</span>
        <div><div style={{ fontSize:9, fontWeight:800, color:'#0D1F2D' }}>22-day streak</div><div style={{ fontSize:7.5, color:'#f97316', fontWeight:700 }}>Best this year!</div></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VISUAL 3 ─ PAYROLL: Compact app-style card
   Proportions match the HeroDashboard density & padding
══════════════════════════════════════════════════════════ */
function PayrollVisual() {
  const [animDone, setAnimDone] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(()=>{
    const t = setTimeout(()=>setAnimDone(true), 400);
    const a = setInterval(()=>setStep(s=>(s+1)%4), 1600);
    return ()=>{ clearTimeout(t); clearInterval(a); };
  },[]);

  const steps = ['Calculating','Verifying','Processing','Complete ✓'];
  const breakdown = [
    { l:'Basic Salary',    v:'₹3,00,000', pct:72, c:'#818cf8' },
    { l:'HRA & Allowances',v:'₹72,000',  pct:17, c:'#00C2A8' },
    { l:'Bonus',           v:'₹43,000',  pct:10, c:'#FF6B35' },
    { l:'Deductions',      v:'₹15,000',  pct: 3, c:'#ef4444' },
  ];

  return (
    <div style={{ position:'relative', width:'100%' }}>
      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 16px 50px rgba(0,0,0,.10)', border:'1px solid #f0f0f0', animation:'floatY 6s ease-in-out infinite 0.5s' }}>
        <div style={{ background:'linear-gradient(135deg,#0D1F2D,#162639)', padding:'12px 14px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute',top:-16,right:-16,width:60,height:60,borderRadius:'50%',background:'rgba(255,107,53,.1)' }}/>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <div style={{ fontSize:7, color:'#6b7280', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:2 }}>March 2026 · Payroll Run</div>
              <div className="fd" style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1 }}>₹4,15,000</div>
              <div style={{ fontSize:10, color:'#00A896', fontWeight:700, marginTop:4 }}>↑ ₹12,000 from Feb</div>
            </div>
            <div style={{ position:'relative', width:46, height:46, flexShrink:0 }}>
              <svg viewBox="0 0 38 38" style={{ width:46, height:46, transform:'rotate(-90deg)' }}>
                <circle cx="19" cy="19" r="15" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="5"/>
                <circle cx="19" cy="19" r="15" fill="none" stroke="#00C2A8" strokeWidth="5" strokeDasharray="85 94" strokeLinecap="round"/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span className="fd" style={{ fontSize:10, fontWeight:900, color:'#fff', lineHeight:1 }}>90%</span>
                <span style={{ fontSize:5.5, color:'#6b7280' }}>paid</span>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:5 }}>
            {steps.map((s,i)=>(
              <div key={s} style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
                <div style={{ height:3, borderRadius:2, background:i<=step?'linear-gradient(90deg,#00C2A8,#00e6cc)':'rgba(255,255,255,.08)', transition:'background .5s' }}/>
                <span style={{ fontSize:6, color:i<=step?'#00C2A8':'#4b5563', fontWeight:700 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:'12px 14px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <div style={{ fontSize:7.5, color:'#374151', fontWeight:700, marginBottom:8, textTransform:'uppercase', letterSpacing:'.06em' }}>Salary Breakdown</div>
              {breakdown.map(b=>(
                <div key={b.l} style={{ marginBottom:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <div style={{ width:7,height:7,borderRadius:2,background:b.c }}/>
                      <span style={{ fontSize:9, color:'#374151', fontWeight:600 }}>{b.l}</span>
                    </div>
                    <span style={{ fontSize:9, fontWeight:800, color:'#0D1F2D' }}>{b.v}</span>
                  </div>
                  <div style={{ height:5, background:'#f3f4f6', borderRadius:999, overflow:'hidden' }}>
                    <div style={{ width:animDone?`${b.pct}%`:'0%', height:'100%', background:b.c, borderRadius:999, transition:'width 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}/>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:7.5, color:'#374151', fontWeight:700, marginBottom:8, textTransform:'uppercase', letterSpacing:'.06em' }}>Compliance</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:8 }}>
                {[['PF','#e8fdf7','#00A896'],['TDS','#fff7ed','#FF6B35'],['ESI','#f0fdf4','#16a34a'],['Salary','#f0f9ff','#0284c7']].map(([b,bg,c])=>(
                  <div key={b} style={{ background:bg, borderRadius:9, padding:'7px 6px', textAlign:'center', border:`1px solid ${c}22` }}>
                    <div style={{ fontSize:11, fontWeight:900, color:c }}>✓</div>
                    <div style={{ fontSize:8, fontWeight:700, color:c, marginTop:1 }}>{b}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#f8fafc', borderRadius:9, padding:'8px 10px', border:'1px solid #e5e7eb' }}>
                <div style={{ fontSize:7.5, color:'#6b7280', fontWeight:600, marginBottom:4 }}>Employees Processed</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                  <div className="fd" style={{ fontSize:18, fontWeight:900, color:'#0D1F2D' }}>112</div>
                  <span style={{ fontSize:9, color:'#9ca3af' }}>of 124</span>
                </div>
                <div style={{ height:4, background:'#e5e7eb', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ width:'90%', height:'100%', background:'linear-gradient(90deg,#00C2A8,#00e6cc)', borderRadius:2 }}/>
                </div>
              </div>
            </div>
          </div>
          <button style={{ width:'100%', padding:'10px 0', borderRadius:10, fontWeight:800, fontSize:11, background:'linear-gradient(135deg,#FF6B35,#FF5722)', color:'#fff', border:'none', cursor:'pointer', boxShadow:'0 4px 16px rgba(255,107,53,.35)', letterSpacing:'.02em' }}>
            ⚡ Release All Payments →
          </button>
        </div>
      </div>
      <div style={{ position:'absolute', top:-12, right:-16, background:'linear-gradient(135deg,#818cf8,#6366f1)', borderRadius:11, padding:'6px 10px', boxShadow:'0 6px 20px rgba(99,102,241,.35)', display:'flex', alignItems:'center', gap:6, animation:'floatY2 4s ease-in-out infinite 0.8s' }}>
        <span style={{ fontSize:13 }}>📑</span>
        <div><div style={{ fontSize:9, fontWeight:800, color:'#fff' }}>TDS Auto-Filed</div><div style={{ fontSize:7.5, color:'rgba(255,255,255,.7)', fontWeight:700 }}>₹58,800 this month</div></div>
      </div>
      <div style={{ position:'absolute', bottom:-12, left:-16, background:'#fff', borderRadius:11, padding:'6px 10px', boxShadow:'0 6px 20px rgba(0,0,0,.12)', border:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:6, animation:'floatY2 4s ease-in-out infinite 2s' }}>
        <span style={{ fontSize:13 }}>📧</span>
        <div><div style={{ fontSize:9, fontWeight:800, color:'#0D1F2D' }}>14 Payslips Sent</div><div style={{ fontSize:7.5, color:'#00C2A8', fontWeight:700 }}>All inboxes updated</div></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VISUAL 4 ─ FACE RECOGNITION
══════════════════════════════════════════════════════════ */
function FaceVisual() {
  const [scanState, setScanState] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=>setScanState(s=>(s+1)%3), 2200);
    return ()=>clearInterval(id);
  },[]);

  const checkins=[
    {i:'AK',n:'Arjun K.',  t:'09:01 AM',c:'#818cf8'},
    {i:'PS',n:'Priya S.',  t:'09:05 AM',c:'#34d399'},
    {i:'MJ',n:'Meera J.',  t:'09:12 AM',c:'#FF6B35'},
    {i:'RS',n:'Rohit S.',  t:'09:18 AM',c:'#00C2A8'},
  ];

  return (
    <div style={{ display:'flex',gap:16,alignItems:'center',justifyContent:'center' }}>
      <div style={{ animation:'floatY2 4s ease-in-out infinite',flexShrink:0 }}>
        <div style={{ width:210,borderRadius:26,padding:7,background:'linear-gradient(145deg,#1a2535,#0d1420)',boxShadow:'0 24px 60px rgba(0,0,0,.5)',position:'relative' }}>
          <div style={{ position:'absolute',top:'25%',left:'50%',transform:'translate(-50%,-50%)',width:100,height:100,borderRadius:'50%',background:'rgba(0,194,168,.18)',filter:'blur(28px)',pointerEvents:'none',animation:'pdot 2.5s ease-in-out infinite' }}/>
          <div style={{ borderRadius:20,overflow:'hidden',height:400,background:'#111827',position:'relative' }}>
            <div style={{ padding:'10px 12px 8px',display:'flex',alignItems:'center',gap:7,borderBottom:'1px solid rgba(255,255,255,.05)',background:'rgba(13,31,45,.9)' }}>
              <img src="/SamayaHRSidebar.png" alt="SamayaHR" style={{ width:23,height:23,borderRadius:7,objectFit:'contain',flexShrink:0 }} />
              <div>
                <div style={{ fontSize:10,color:'#fff',fontWeight:800 }}>SamayaHR</div>
                <div style={{ fontSize:7,color:'#6b7280' }}>Face Attendance</div>
              </div>
              <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:4 }}>
                <div style={{ position:'relative',width:8,height:8 }}>
                  <div style={{ position:'absolute',inset:0,borderRadius:'50%',background:'#00C2A8',animation:'ping 1.4s ease-in-out infinite' }}/>
                  <div style={{ position:'absolute',inset:0,borderRadius:'50%',background:'#00C2A8' }}/>
                </div>
                <span style={{ fontSize:7,color:'#00C2A8',fontWeight:700 }}>LIVE</span>
              </div>
            </div>
            <div style={{ margin:'9px 9px 7px',borderRadius:13,overflow:'hidden',position:'relative',height:185,background:'linear-gradient(145deg,#1f2937,#111827)' }}>
              <div style={{ position:'absolute',inset:0,backgroundImage:'radial-gradient(circle,rgba(0,194,168,.12) 1px,transparent 1px)',backgroundSize:'14px 14px',opacity:.5 }}/>
              <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <div style={{ width:78,height:78,borderRadius:'50%',background:'linear-gradient(145deg,#374151,#1f2937)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,boxShadow:scanState===1?'0 0 28px rgba(0,194,168,.7)':'0 0 8px rgba(0,0,0,.3)',transition:'box-shadow .5s' }}>👤</div>
              </div>
              <div style={{ position:'absolute',left:12,right:12,height:1.5,background:'linear-gradient(90deg,transparent,#00C2A8,transparent)',opacity:scanState<2?.85:0,animation:'scanY 2.2s ease-in-out infinite',transition:'opacity .3s' }}/>
              <div style={{ position:'absolute',bottom:7,left:'50%',transform:'translateX(-50%)',backdropFilter:'blur(10px)',color:'#fff',fontSize:8,fontWeight:700,padding:'4px 12px',borderRadius:999,whiteSpace:'nowrap',border:'1px solid rgba(0,194,168,.3)',transition:'background .5s',
                background:scanState===0?'rgba(0,0,0,.6)':scanState===1?'rgba(0,194,168,.85)':'rgba(255,107,53,.75)',
              }}>
                {scanState===0?'🔍 Scanning face…':scanState===1?'✓ Face Matched':'⟳ Processing…'}
              </div>
            </div>
            <div style={{ margin:'0 9px 7px',borderRadius:11,padding:'9px 11px',background:'rgba(0,194,168,.1)',border:'1px solid rgba(0,194,168,.2)',opacity:scanState===1?1:.3,transition:'opacity .5s' }}>
              <div style={{ display:'flex',alignItems:'center',gap:9 }}>
                <div style={{ width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#FF6B35,#FF5722)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,color:'#fff',flexShrink:0 }}>RS</div>
                <div>
                  <div style={{ fontSize:11,fontWeight:800,color:'#fff' }}>Riya Sharma</div>
                  <div style={{ fontSize:8,color:'#00C2A8',fontWeight:700 }}>✓ Identity Verified</div>
                  <div style={{ fontSize:7,color:'#6b7280',marginTop:1 }}>Design Lead · 09:02 AM</div>
                </div>
              </div>
            </div>
            <div style={{ margin:'0 9px',background:'rgba(255,255,255,.03)',borderRadius:10,padding:'8px 10px' }}>
              <div style={{ fontSize:7,color:'#6b7280',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6 }}>Today's Check-ins</div>
              {checkins.map(c=>(
                <div key={c.i} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:5 }}>
                    <div style={{ width:17,height:17,borderRadius:'50%',background:`${c.c}22`,border:`1.5px solid ${c.c}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:6.5,fontWeight:800,color:c.c }}>{c.i}</div>
                    <span style={{ fontSize:8.5,color:'#d1d5db',fontWeight:600 }}>{c.n}</span>
                  </div>
                  <span style={{ fontSize:7.5,color:'#4b5563' }}>{c.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
        {[
          {icon:'⚡',v:'<0.5s',  l:'Recognition',     bg:'#fff7ed',c:'#FF6B35'},
          {icon:'👥',v:'10,000+',l:'Face Profiles',    bg:'#eef2ff',c:'#818cf8'},
          {icon:'📡',v:'Offline', l:'Works Without Net',bg:'#edfcf8',c:'#00C2A8'},
          {icon:'🔒',v:'256-bit', l:'Encrypted Logs',  bg:'#f0fdf4',c:'#16a34a'},
        ].map(s=>(
          <div key={s.l} style={{ background:s.bg,borderRadius:13,padding:'11px 15px',display:'flex',alignItems:'center',gap:11,width:170,border:`1px solid ${s.c}22` }}>
            <span style={{ fontSize:22 }}>{s.icon}</span>
            <div>
              <div className="fd" style={{ fontSize:15,fontWeight:900,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:9,color:'#6b7280',marginTop:1 }}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VISUAL 5 ─ MOBILE APP
══════════════════════════════════════════════════════════ */
function MobileVisual() {
  const [secs, setSecs] = useState(23531);
  const [chartTick, setChartTick] = useState(0);
  const [orgPulse, setOrgPulse] = useState(0);
  useEffect(()=>{
    const a=setInterval(()=>setSecs(s=>s+1),1000);
    const b=setInterval(()=>setChartTick(t=>(t+1)%7),1200);
    const c=setInterval(()=>setOrgPulse(p=>(p+1)%4),2000);
    return()=>{clearInterval(a);clearInterval(b);clearInterval(c);};
  },[]);
  const fmt=s=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const chartBars=[72,58,90,65,84,48,76];
  const orgNodes=[
    {i:'MD',n:'Meera D.',r:'CEO',     c:'#FF6B35',lvl:0},
    {i:'RV',n:'Rahul V.',r:'CTO',     c:'#00C2A8',lvl:1},
    {i:'SA',n:'Sneha A.',r:'Design',  c:'#818cf8',lvl:1},
    {i:'KP',n:'Kiran P.',r:'HR Head', c:'#f59e0b',lvl:1},
  ];

  return (
    <div style={{ display:'flex',justifyContent:'center',alignItems:'flex-end',gap:14 }}>
      <div style={{ transform:'rotate(-8deg) translateY(22px)',animation:'floatY3 5s ease-in-out infinite',flexShrink:0 }}>
        <div style={{ width:155,borderRadius:28,padding:5,background:'linear-gradient(145deg,#0d1117,#1a1a2e)',boxShadow:'0 18px 45px rgba(0,0,0,.5)' }}>
          <div style={{ borderRadius:22,overflow:'hidden',height:285,background:'#0D1F2D' }}>
            <div style={{ padding:'14px 10px 10px',background:'linear-gradient(135deg,#111827,#0D1F2D)',borderBottom:'1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontSize:7,color:'#6b7280',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em' }}>People Analytics</div>
              <div className="fd" style={{ fontSize:13,color:'#fff',fontWeight:900,marginTop:1 }}>HR Insights</div>
            </div>
            <div style={{ padding:'10px 10px 0' }}>
              <div style={{ background:'rgba(0,194,168,.1)',border:'1px solid rgba(0,194,168,.2)',borderRadius:10,padding:'8px 10px',marginBottom:8 }}>
                <div style={{ fontSize:7,color:'#6b7280',fontWeight:600 }}>Monthly Headcount</div>
                <div style={{ display:'flex',alignItems:'flex-end',gap:6,marginTop:2 }}>
                  <div className="fd" style={{ fontSize:22,fontWeight:900,color:'#00C2A8',lineHeight:1 }}>124</div>
                  <div style={{ fontSize:8,color:'#34d399',fontWeight:700,marginBottom:2 }}>↑ +3 this month</div>
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,.03)',borderRadius:10,padding:'8px 10px' }}>
                <div style={{ fontSize:7,color:'#6b7280',fontWeight:700,marginBottom:7,textTransform:'uppercase',letterSpacing:'.06em' }}>Attendance Rate</div>
                <div style={{ display:'flex',alignItems:'flex-end',gap:3,height:46 }}>
                  {chartBars.map((h,i)=>(
                    <div key={i} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2 }}>
                      <div style={{ width:'100%',borderRadius:'3px 3px 0 0',height:i===chartTick?h*0.48+4:h*0.48,background:i===chartTick?'linear-gradient(180deg,#FF6B35,#FF5722)':'linear-gradient(180deg,#00C2A8,#00a896)',transition:'height .4s,background .4s' }}/>
                      <span style={{ fontSize:5.5,color:'#4b5563' }}>{'MTWTFSS'[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginTop:8 }}>
                {[['Turnover','8.2%','#ef4444'],['Retention','91.8%','#00C2A8']].map(([l,v,c])=>(
                  <div key={l} style={{ background:'rgba(255,255,255,.04)',borderRadius:8,padding:'6px 8px',textAlign:'center' }}>
                    <div className="fd" style={{ fontSize:13,fontWeight:900,color:c }}>{v}</div>
                    <div style={{ fontSize:6.5,color:'#6b7280',marginTop:1 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ animation:'floatY 4.5s ease-in-out infinite',flexShrink:0 }}>
        <div style={{ width:174,borderRadius:30,padding:7,background:'linear-gradient(145deg,#1a1a2e,#0d1117)',boxShadow:'0 28px 65px rgba(0,0,0,.6)',position:'relative' }}>
          <div style={{ position:'absolute',top:13,left:'50%',transform:'translateX(-50%)',width:40,height:10,borderRadius:999,background:'#0d1117',zIndex:10 }}/>
          <div style={{ borderRadius:24,overflow:'hidden',height:336,background:'#fff' }}>
            <div style={{ padding:'15px 10px 6px',background:'#0D1F2D',display:'flex',justifyContent:'space-between' }}>
              <span style={{ fontSize:7,color:'rgba(255,255,255,.5)',fontWeight:700 }}>9:41</span>
              <div style={{ display:'flex',gap:2,alignItems:'center' }}>
                {[...Array(4)].map((_,i)=><div key={i} style={{ width:2,height:4+i*2,borderRadius:1,background:i<3?'#fff':'rgba(255,255,255,.3)' }}/>)}
              </div>
            </div>
            <div style={{ margin:'7px 8px 6px',borderRadius:11,padding:'9px 10px',background:'linear-gradient(135deg,#FF6B35,#FF5722)',boxShadow:'0 4px 14px rgba(255,107,53,.4)' }}>
              <div style={{ fontSize:7,color:'rgba(255,255,255,.8)',fontWeight:700 }}>Good morning 👋</div>
              <div className="fd" style={{ fontSize:13,color:'#fff',fontWeight:900,marginTop:1 }}>Kumar</div>
              <div style={{ fontSize:7,color:'rgba(255,255,255,.65)',marginTop:1 }}>Design Lead · Thursday</div>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,padding:'0 8px 6px' }}>
              <div style={{ background:'#edfcf8',borderRadius:10,padding:'7px 8px',border:'1px solid #b2f0e8' }}>
                <div style={{ fontSize:7,color:'#00C2A8',fontWeight:700 }}>Work Time</div>
                <div className="fd" style={{ fontSize:12,color:'#00A896',fontWeight:900 }}>{fmt(secs)}</div>
                <div style={{ marginTop:3,height:3,background:'rgba(0,194,168,.2)',borderRadius:2,overflow:'hidden' }}>
                  <div style={{ width:'74%',height:'100%',background:'#00C2A8' }}/>
                </div>
              </div>
              <div style={{ background:'#fff7ed',borderRadius:10,padding:'7px 8px',border:'1px solid #fed7aa' }}>
                <div style={{ fontSize:7,color:'#FF6B35',fontWeight:700 }}>Break</div>
                <div className="fd" style={{ fontSize:12,color:'#FF6B35',fontWeight:900 }}>00:30:00</div>
                <div style={{ marginTop:3,height:3,background:'rgba(255,107,53,.15)',borderRadius:2 }}>
                  <div style={{ width:'28%',height:'100%',background:'#FF6B35' }}/>
                </div>
              </div>
            </div>
            <div style={{ padding:'0 8px 6px' }}>
              <button style={{ width:'100%',background:'linear-gradient(135deg,#FF6B35,#FF5722)',color:'#fff',fontWeight:800,fontSize:9,padding:'8px 0',borderRadius:10,border:'none',cursor:'pointer' }}>⏹ Stop Work</button>
            </div>
            {[['📅','Apply Leave','#edfcf8','#00C2A8'],['₹','Payslip','#f5f3ff','#818cf8'],['📊','Attendance','#fff7ed','#FF6B35'],['👥','My Team','#f0fdf4','#16a34a']].map(([ic,lb,bg,c])=>(
              <div key={lb} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',margin:'0 8px 4px',borderRadius:9,padding:'5px 8px',border:'1px solid #f3f4f6' }}>
                <div style={{ display:'flex',alignItems:'center',gap:7 }}>
                  <div style={{ width:21,height:21,borderRadius:6,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9 }}>{ic}</div>
                  <span style={{ fontSize:8.5,fontWeight:700,color:'#0D1F2D' }}>{lb}</span>
                </div>
                <span style={{ width:5,height:5,borderRadius:'50%',background:c,display:'block' }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ transform:'rotate(8deg) translateY(22px)',animation:'floatY3 5s ease-in-out infinite 1.5s',flexShrink:0 }}>
        <div style={{ width:155,borderRadius:28,padding:5,background:'linear-gradient(145deg,#1a1a2e,#0d1117)',boxShadow:'0 18px 45px rgba(0,0,0,.5)' }}>
          <div style={{ borderRadius:22,overflow:'hidden',height:285,background:'#f8f7ff' }}>
            <div style={{ padding:'14px 10px 10px',background:'linear-gradient(135deg,#6366f1,#818cf8)',borderBottom:'1px solid rgba(255,255,255,.15)' }}>
              <div style={{ fontSize:7,color:'rgba(255,255,255,.75)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em' }}>People</div>
              <div className="fd" style={{ fontSize:13,color:'#fff',fontWeight:900,marginTop:1 }}>Team Directory</div>
            </div>
            <div style={{ padding:'9px 10px 0' }}>
              <div style={{ background:'#fff',borderRadius:8,padding:'5px 8px',display:'flex',alignItems:'center',gap:4,border:'1px solid #e5e7eb',marginBottom:9 }}>
                <span style={{ fontSize:8,color:'#9ca3af' }}>🔍</span>
                <span style={{ fontSize:8,color:'#d1d5db' }}>Search employees…</span>
              </div>
              <div style={{ fontSize:7,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:7 }}>Org Chart</div>
              <div style={{ display:'flex',justifyContent:'center',marginBottom:6 }}>
                <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:3 }}>
                  <div style={{ width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#FF6B35,#FF5722)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:'#fff',boxShadow:'0 3px 8px rgba(255,107,53,.4)' }}>MD</div>
                  <div style={{ fontSize:7,fontWeight:800,color:'#0D1F2D' }}>Meera D.</div>
                  <div style={{ fontSize:6,color:'#FF6B35',fontWeight:700,background:'rgba(255,107,53,.1)',padding:'1px 6px',borderRadius:999 }}>CEO</div>
                </div>
              </div>
              <div style={{ width:1,height:10,background:'#e5e7eb',margin:'0 auto 4px' }}/>
              <div style={{ display:'flex',justifyContent:'space-around',marginBottom:8 }}>
                {orgNodes.slice(1).map((n,i)=>(
                  <div key={n.i} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'4px',borderRadius:8,background:i===orgPulse?`${n.c}12`:'transparent',border:i===orgPulse?`1px solid ${n.c}30`:'1px solid transparent',transition:'all .5s' }}>
                    <div style={{ width:22,height:22,borderRadius:'50%',background:`${n.c}22`,border:`2px solid ${n.c}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,fontWeight:900,color:n.c }}>{n.i}</div>
                    <div style={{ fontSize:6.5,fontWeight:700,color:'#374151' }}>{n.n.split(' ')[0]}</div>
                    <div style={{ fontSize:5.5,color:n.c,fontWeight:700 }}>{n.r}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff',borderRadius:9,padding:'7px 9px',border:'1px solid #f3f4f6' }}>
                <div style={{ display:'flex',justifyContent:'space-around' }}>
                  {[['124','Total'],['8','Depts'],['97%','Active']].map(([v,l])=>(
                    <div key={l} style={{ textAlign:'center' }}>
                      <div className="fd" style={{ fontSize:13,fontWeight:900,color:'#6366f1' }}>{v}</div>
                      <div style={{ fontSize:7,color:'#9ca3af',marginTop:1 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FEATURE CARD
══════════════════════════════════════════════════════════ */
function FeatureCard({ title, description, icon, id }) {
  return (
    <Link to={`/features/${id}`} className="group relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden block transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100/60 hover:border-orange-200">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-teal-50/0 group-hover:from-orange-50/80 group-hover:to-teal-50/40 transition-all duration-500 rounded-2xl"/>
      <div className="relative">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gray-50 border border-gray-100 group-hover:bg-gradient-to-br group-hover:from-[#FF6B35] group-hover:to-[#FF8C5A] group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-orange-200 transition-all duration-300">{icon}</div>
        <h3 className="fd font-bold text-[#0D1F2D] text-[15px] mb-1.5 group-hover:text-[#FF6B35] transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(()=>{
    const fn = ()=>setScrolled(window.scrollY>20);
    window.addEventListener('scroll',fn);
    return ()=>window.removeEventListener('scroll',fn);
  },[]);

  const goto = id=>{
    const el=document.getElementById(id);
    if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.pageYOffset-90,behavior:'smooth'});
  };

  const ticker=[
    {icon:"⚡",label:"Zero Payroll Errors"},{icon:"🧠",label:"AI-Driven Insights"},
    {icon:"🕐",label:"One-Click Attendance"},{icon:"🌿",label:"Paperless Onboarding"},
    {icon:"📊",label:"Live Workforce Analytics"},{icon:"🔐",label:"Bank-Grade Security"},
    {icon:"📲",label:"iOS & Android App"},{icon:"🎯",label:"OKR & Goal Alignment"},
    {icon:"🤝",label:"Dedicated HR Expert"},{icon:"🌏",label:"Pan-India Compliance"},
  ];

  return (
    <div className="min-h-screen flex flex-col text-[#0D1F2D] overflow-x-hidden" style={{ backgroundColor:'#F7F8FA' }}>
      <style>{CSS}</style>

      {/* ══ NAVBAR ══ */}
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled?'bg-white/97 backdrop-blur-2xl border-b border-gray-100 shadow-[0_2px_24px_rgba(0,0,0,.07)]':'bg-white/90 backdrop-blur-md border-b border-gray-100/80'}`}>
        <nav className="flex w-full items-center px-8 lg:px-14 h-[70px] gap-2">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-6 group">
            <img src="/SamayaHRSidebar.png" alt="SamayaHR" className="group-hover:scale-105 transition-transform" style={{ width:36, height:36, borderRadius:10, objectFit:"contain", flexShrink:0 }} />
            <span className="fd text-[20px] font-black tracking-tight text-[#0D1F2D]">Samaya<span className="g-coral">HR</span></span>
          </Link>
          <div className="hidden lg:flex items-center text-[13.5px] font-semibold text-gray-500 h-full">
            <div className="relative group h-full flex items-center">
              <button className="nav-ul relative flex items-center gap-1 hover:text-[#0D1F2D] transition-colors px-3.5 py-4 rounded-xl hover:bg-gray-50">
                Platform<svg className="w-3 h-3 ml-0.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="w-[580px] bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-3">Core Modules</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      {href:"/features/attendance",icon:"⏱️",col:"bg-amber-50",ic:"text-amber-600",title:"Time & Attendance",sub:"Clock-ins, shifts, timesheets"},
                      {href:"/features/payroll",icon:"💸",col:"bg-teal-50",ic:"text-teal-600",title:"Payroll & Compliance",sub:"Salaries, TDS, payslips"},
                      {href:"/features/leave-management",icon:"🏖️",col:"bg-sky-50",ic:"text-sky-500",title:"Leave Management",sub:"Apply, approve, track leaves"},
                      {href:"/features/employee-dashboard",icon:"👥",col:"bg-violet-50",ic:"text-violet-500",title:"Employee Directory",sub:"Profiles, org chart, docs"},
                      {href:"/features/analytics",icon:"📈",col:"bg-orange-50",ic:"text-orange-500",title:"Analytics & Reports",sub:"Insights, exports, dashboards"},
                      {href:"/features/onboarding",icon:"🚀",col:"bg-rose-50",ic:"text-rose-500",title:"Onboarding & Offboarding",sub:"Digital joining, exit flows"},
                      {href:"/features/mobile",icon:"📱",col:"bg-green-50",ic:"text-green-600",title:"Mobile App",sub:"iOS & Android, offline mode"},
                      {href:"/features/security",icon:"🔐",col:"bg-slate-50",ic:"text-slate-600",title:"Security & Roles",sub:"2FA, permissions, audit log"},
                    ].map(s=>(
                      <Link key={s.href} to={s.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                        <div className={`w-9 h-9 rounded-xl ${s.col} ${s.ic} flex items-center justify-center text-lg shrink-0 group-hover/item:bg-[#FF6B35] group-hover/item:text-white transition-all duration-200`}>{s.icon}</div>
                        <div><div className="text-[13px] font-bold text-[#0D1F2D] leading-tight">{s.title}</div><div className="text-[11px] text-gray-400 mt-0.5">{s.sub}</div></div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between px-2">
                    <span className="text-xs text-gray-400">Free for up to 10 employees</span>
                    <Link to="/features" className="text-xs font-bold text-[#FF6B35] hover:underline">View all →</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group h-full flex items-center">
              <button className="nav-ul relative flex items-center gap-1 hover:text-[#0D1F2D] transition-colors px-3.5 py-4 rounded-xl hover:bg-gray-50">
                Solutions<svg className="w-3 h-3 ml-0.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div className="absolute top-full -left-2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="w-64 bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 p-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-2">By Team Size</p>
                  {[{href:"/solutions/startups",icon:"🌱",title:"Startups",sub:"1–50 employees"},{href:"/solutions/smb",icon:"🏢",title:"Small Business",sub:"50–500 employees"},{href:"/solutions/enterprise",icon:"🏛️",title:"Enterprise",sub:"500+ employees"}].map(s=>(
                    <Link key={s.href} to={s.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors group/item">
                      <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base group-hover/item:bg-[#FF6B35] transition-all">{s.icon}</span>
                      <div><div className="text-sm font-bold text-[#0D1F2D] group-hover/item:text-[#FF6B35]">{s.title}</div><div className="text-xs text-gray-400">{s.sub}</div></div>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-2">By Industry</p>
                    {[{href:"/solutions/tech",icon:"💻",title:"Technology"},{href:"/solutions/retail",icon:"🛍️",title:"Retail & FMCG"},{href:"/solutions/healthcare",icon:"🏥",title:"Healthcare"}].map(s=>(
                      <Link key={s.href} to={s.href} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors group/item">
                        <span>{s.icon}</span><span className="text-sm font-medium text-gray-700 group-hover/item:text-[#FF6B35]">{s.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={()=>goto('pricing')} className="nav-ul relative hover:text-[#0D1F2D] transition-colors px-3.5 py-4 rounded-xl hover:bg-gray-50">Pricing</button>
            <div className="relative group h-full flex items-center">
              <button className="nav-ul relative flex items-center gap-1 hover:text-[#0D1F2D] transition-colors px-3.5 py-4 rounded-xl hover:bg-gray-50">
                Resources<svg className="w-3 h-3 ml-0.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div className="absolute top-full -left-2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="w-52 bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 p-2">
                  {[["📖","Documentation","/docs"],["📝","HR Blog","/blog"],["🎓","Learning Hub","/academy"],["💡","Help & Support","/help-center"],["📣","What's New","/changelog"]].map(([icon,label,href])=>(
                    <Link key={href} to={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                      <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base group-hover/item:bg-orange-50 transition-all">{icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover/item:text-[#FF6B35]">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={()=>goto('about')} className="nav-ul relative hover:text-[#0D1F2D] transition-colors px-3.5 py-4 rounded-xl hover:bg-gray-50">About</button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={()=>setSearchOpen(!searchOpen)} className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0D1F2D] transition-all">
              {searchOpen?<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>:<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>}
            </button>
            <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1"/>
            <Link to="/login" className="hidden sm:inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-gray-600 hover:text-[#0D1F2D] transition-colors px-3 py-2 rounded-xl hover:bg-gray-50">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>Sign in
            </Link>
            <button onClick={()=>setMobileMenu(!mobileMenu)} className="lg:hidden w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 ml-1">
              {mobileMenu?<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>:<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>}
            </button>
          </div>
        </nav>
        <div className={`overflow-hidden transition-all duration-300 bg-white border-t border-gray-100 ${searchOpen?'max-h-24 opacity-100':'max-h-0 opacity-0'}`}>
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 gap-2 focus-within:border-orange-300 focus-within:bg-white transition-all">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
              <input type="text" placeholder="Search features, payroll, attendance…" className="flex-1 py-3 bg-transparent text-[#0D1F2D] outline-none placeholder:text-gray-400 text-sm" autoFocus={searchOpen}/>
              <kbd className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
            </div>
          </div>
        </div>
        <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100 ${mobileMenu?'max-h-screen opacity-100':'max-h-0 opacity-0'}`}>
          <div className="px-6 py-4 space-y-1">
            {[["Platform","/#features"],["Solutions","/#solutions"],["Pricing","/#pricing"],["Resources","/blog"],["About","/about"]].map(([label,href])=>(
              <Link key={label} to={href} className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35] transition-colors">
                {label}<svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link to="/login" className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-[#0D1F2D] border-2 border-gray-200">Sign in</Link>
              <Link to="/signup" className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white coral-btn">Start Free →</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-[70px]">

        {/* ═══ HERO ════════════════════════════════════ */}
        <section className="relative hero-mesh pt-14 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-[.025] pointer-events-none" style={{ backgroundImage:'linear-gradient(rgba(13,31,45,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(13,31,45,.04) 1px,transparent 1px)',backgroundSize:'50px 50px' }}/>
          <div className="mx-auto max-w-7xl lg:flex lg:items-center lg:gap-12">
            <div className="flex-1 text-center lg:text-left mb-12 lg:mb-0">
              <div className="inline-flex justify-center lg:justify-start gap-8 mb-8 pb-6 border-b border-gray-200">
                {[["3×","Faster Onboarding"],["₹0","Payroll Errors"],["100%","Compliance"]].map(([v,l],i)=>(
                  <React.Fragment key={l}>
                    {i>0&&<div className="w-px bg-gray-200 self-stretch"/>}
                    <div className="text-center lg:text-left">
                      <p className="fd text-2xl font-black text-[#0D1F2D] leading-none">{v}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">{l}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold mb-6 text-[#FF6B35]">
                <span className="relative flex h-2 w-2"><span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"/><span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"/></span>
                India's Free HRMS for Startups &amp; Growing Teams
              </div>
              <h1 className="fd text-5xl lg:text-[58px] font-black tracking-tight text-[#0D1F2D] mb-5 leading-[1.04]">
                <span className="g-coral">Where HR meets simplicity</span>
              </h1>
              <p className="max-w-lg mx-auto lg:mx-0 text-[17px] text-gray-500 mb-9 leading-relaxed">
                Payroll, attendance, leaves &amp; compliance — all in one place, built for India.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <Link to="/solutions/bookdemo" className="coral-btn inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white">
                  Demo <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </Link>
              </div>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5 justify-center lg:justify-start">
                <svg className="w-3.5 h-3.5 text-teal-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Setup under 5 minutes · No credit card needed
              </p>
            </div>
            <div className="flex-1 relative flex justify-center items-end gap-4 min-h-[380px]">
              <div className="animate-float-0"><HeroDashboard /></div>
              <div className="animate-float-1" style={{ position:'absolute', right:-10, bottom:0 }}><HeroPhone /></div>
            </div>
          </div>
        </section>

        {/* ═══ TICKER ═══════════════════════════════════ */}
        <section className="py-4 bg-white border-y border-gray-100 overflow-hidden ticker-mask">
          <div className="flex whitespace-nowrap" style={{ animation:'ticker 30s linear infinite' }}>
            {[...ticker,...ticker].map((item,i)=>(
              <div key={i} className="flex items-center gap-2.5 px-6 shrink-0">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">{item.label}</span>
                <span className="ml-6 text-gray-200">◆</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ ATTENDANCE ════════════════════════════════ */}
        <section className="py-16 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-14">
            <div className="lg:w-[340px] shrink-0 mb-10 lg:mb-0">
              <Pill c="⏰ Smart Attendance" />
              <h2 className="fd text-3xl md:text-4xl font-black text-[#0D1F2D] mt-4 mb-3 leading-tight">
                Know who's in, out<br />&amp; on the clock.
              </h2>
              <p className="text-gray-500 mb-6 text-[15px] leading-relaxed">GPS, biometric &amp; face-recognition — synced live to payroll. No manual reconciliation.</p>
              <ul style={{ listStyle:'none',padding:0,margin:'0 0 22px 0' }}>
                <Li c="Drag-and-drop shift scheduler" />
                <Li c="One-tap clock-in with geo-validation" />
                <Li c="Overtime auto-linked to payroll" />
                <Li c="Instant regularisation approvals" />
              </ul>
              <Link to="/solutions/attendance" className="inline-flex items-center gap-2 text-[#FF6B35] font-bold text-sm hover:gap-3 transition-all">Explore Attendance →</Link>
            </div>
            {/* RIGHT: AttendanceVisual — same slot, same size, new design */}
            <div className="flex-1 relative min-w-0" style={{ paddingTop:16, paddingBottom:16 }}>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-30 -z-10"/>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-20 -z-10"/>
              <AttendanceVisual />
            </div>
          </div>
        </section>

        {/* ═══ STATS LIGHT ═══════════════════════════════ */}
        <section className="py-8" style={{ backgroundColor:'#F7F8FA' }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[["🏢","0","Companies on SamayaHR"],["⚡","98%","Payroll accuracy — always"],["📊","70%","Less HR admin work"]].map(([ic,v,l])=>(
                <div key={v} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="text-2xl w-8 h-8 flex items-center justify-center bg-orange-50 rounded-xl group-hover:bg-gradient-to-br group-hover:from-[#FF6B35] group-hover:to-[#FF8C5A] group-hover:shadow-lg transition-all duration-300">{ic}</div>
                  <div>
                    <p className="fd text-2xl font-black text-[#0D1F2D] leading-none tracking-tight">{v}</p>
                    <p className="text-gray-500 text-xs mt-2">{l}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PAYROLL ════════════════════════════════════ */}
        <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:flex-row-reverse lg:gap-14">
            <div className="lg:w-[340px] shrink-0 mb-10 lg:mb-0">
              <Pill c="💸 Payroll & Compliance" />
              <h2 className="fd text-3xl md:text-4xl font-black text-[#0D1F2D] mt-4 mb-3 leading-tight">
                Payday in minutes,<br />not a marathon.
              </h2>
              <p className="text-gray-500 mb-6 text-[15px] leading-relaxed">TDS, PF &amp; ESI auto-calculated. Bulk disbursement in one click.</p>
              <ul style={{ listStyle:'none',padding:0,margin:'0 0 22px 0' }}>
                <Li c="India-compliant TDS, PF & ESI" />
                <Li c="Bulk salary via direct bank transfer" />
                <Li c="Configurable CTC structures" />
                <Li c="Signed payslips to every inbox" />
              </ul>
              <Link to="/solutions/payroll" className="inline-flex items-center gap-2 text-[#FF6B35] font-bold text-sm hover:gap-3 transition-all">Explore Payroll →</Link>
            </div>
            <div className="flex-1 relative min-w-0" style={{ paddingTop:16, paddingBottom:16 }}>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-teal-100 rounded-full blur-3xl opacity-30 -z-10"/>
              <PayrollVisual />
            </div>
          </div>
        </section>

        {/* ═══ FACE RECOGNITION ══════════════════════════ */}
        <section className="py-8 overflow-hidden" style={{ backgroundColor:'#F7F8FA' }}>
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-16">
            <div className="flex-1 mb-12 lg:mb-0 flex justify-center"><FaceVisual /></div>
            <div className="flex-[0.9]">
              <Pill c="🤖 AI Face Recognition" />
              <h2 className="fd text-3xl md:text-4xl font-black text-[#0D1F2D] mt-5 mb-4 leading-tight">
                Sub-second check-in.<br /><span className="g-teal">Zero contact.</span>
              </h2>
              <p className="text-gray-500 mb-7 text-[16px] leading-relaxed max-w-md">Any tablet becomes a smart kiosk. No PIN, no card, no queue.</p>
              <ul style={{ listStyle:'none',padding:0,margin:'0 0 28px 0' }}>
                <Li c="Recognises 10,000+ faces in <0.5s" />
                <Li c="Works on any Android 8+ tablet" />
                <Li c="100% offline capable, syncs when online" />
                <Li c="Geo-fence alerts for off-site clock-ins" />
              </ul>
              <Link to="/solutions/bookdemo" className="coral-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white">Watch it Live →</Link>
            </div>
          </div>
        </section>

        {/* ═══ DARK NUMBERS ═══════════════════════════════ */}
        <section className="py-5" style={{ background:'linear-gradient(135deg,#0D1F2D 0%,#162639 50%,#0D1F2D 100%)' }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[["70%","HR Admin Time Saved","🕐"],["₹0","Hidden Fees, Ever","💎"],["24/7","Self-Service Access","🌐"]].map(([v,l,ic])=>(
                <div key={l} className="p-10 text-center">
                  <div className="text-2xl mb-2">{ic}</div>
                  <p className="fd text-2xl font-black mb-1 g-coral">{v}</p>
                  <p className="text-gray-400 font-medium">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ AUTOMATION ════════════════════════════════ */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-16">
            <div className="flex-1 mb-12 lg:mb-0">
              <Pill c="⚡ Workflow Automation" />
              <h2 className="fd text-3xl md:text-4xl font-black text-[#0D1F2D] mt-5 mb-4 leading-tight">
                Your HR deserves<br /><span className="g-teal">a smarter co-pilot.</span>
              </h2>
              <p className="text-gray-500 mb-8 text-[16px] leading-relaxed max-w-md">No-code workflows — from onboarding emails to payroll reminders, fully automated.</p>
              <Link to="/signup" className="coral-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white">Automate Your HR →</Link>
            </div>
            <div className="flex-1 relative h-72 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {[
                  {pos:"absolute top-0 right-8",   delay:"0s",  icon:"👥",title:"Team Directory",   bg:"bg-orange-50",ic:"bg-orange-100"},
                  {pos:"absolute top-16 left-0",   delay:"1s",  icon:"⚙️",title:"Flow Triggered",    bg:"bg-teal-50",  ic:"bg-teal-100"},
                  {pos:"absolute bottom-0 right-0",delay:"2s",  icon:"📅",title:"Leave Approved",    bg:"bg-blue-50",  ic:"bg-blue-100"},
                  {pos:"absolute bottom-12 left-8",delay:"3s",  icon:"📋",title:"Payroll Processed", bg:"bg-purple-50",ic:"bg-purple-100"},
                ].map(c=>(
                  <div key={c.title} className={`${c.pos} ${c.bg} rounded-2xl shadow-xl border border-white px-4 py-3 flex items-center gap-3`} style={{ animation:`floatY 5s ease-in-out infinite ${c.delay}` }}>
                    <div className={`w-8 h-8 rounded-xl ${c.ic} flex items-center justify-center text-lg`}>{c.icon}</div>
                    <p className="fd text-xs font-bold text-[#0D1F2D]">{c.title}</p>
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white" style={{ background:'linear-gradient(135deg,#e8fdf7,#fff3ee)' }}>🧑‍💼</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FEATURE GRID ═══════════════════════════════ */}
        <section id="features" className="relative py-20 scroll-mt-20 overflow-hidden" style={{ backgroundColor:'#F7F8FA' }}>
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-orange-100 opacity-50 blur-3xl"/>
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-100 opacity-40 blur-3xl"/>
          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <Pill c="🎯 Full Feature Suite" />
            <h2 className="fd text-3xl md:text-4xl font-black mt-4 mb-2 text-[#0D1F2D]">One platform. Every HR need.</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-12">Less spreadsheets. More people.</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 text-left">
              <FeatureCard icon="🧑‍💼" id="employee-dashboard" title="People Directory"   description="Profiles, org chart, docs & history."/>
              <FeatureCard icon="⏱️"  id="attendance"          title="Time & Attendance" description="Biometric, GPS & face check-ins synced live."/>
              <FeatureCard icon="🏖️" id="leave-management"    title="Leave Management"  description="Policies, accruals & one-click approvals."/>
              <FeatureCard icon="💸" id="payroll"              title="Payroll Engine"    description="TDS, PF & ESI in under 5 minutes."/>
              <FeatureCard icon="📊" id="analytics"            title="People Analytics"  description="Headcount, attrition & cost dashboards."/>
              <FeatureCard icon="📱" id="mobile"               title="Mobile-First App"  description="Full HR in your pocket. Works offline."/>
              <FeatureCard icon="🔐" id="security"             title="Security & Access" description="SSO, 2FA & complete audit trail."/>
              <FeatureCard icon="🚀" id="onboarding"           title="Onboarding & Exit" description="E-signatures, digital offers & exit flows."/>
            </div>
          </div>
        </section>

        {/* ═══ MOBILE APP ══════════════════════════════════ */}
        <section className="py-10 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <Pill c="📱 In Your Pocket" />
            <h2 className="fd text-2xl md:text-4xl font-black text-[#0D1F2D] mt-4 mb-3">Your entire HR, in your pocket.</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-14">Clock in, check payslips &amp; approve leaves — from anywhere.</p>
            <div className="mb-10"><MobileVisual /></div>
          </div>
        </section>

        {/* ═══ PRICING ════════════════════════════════════ */}
        <section id="pricing" className="py-8 border-y border-gray-100 scroll-mt-20" style={{ backgroundColor:'#F7F8FA' }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Pill c="💎 Honest Pricing" />
              <h2 className="fd text-3xl font-black text-[#0D1F2D] mt-4 mb-3">Grow freely. Pay fairly.</h2>
              <p className="text-gray-500">No hidden fees. No per-feature locks.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="border border-gray-200 rounded-3xl p-8 flex flex-col bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Essentials</span>
                <div className="flex items-baseline gap-1 mb-1"><span className="fd text-5xl font-black text-[#0D1F2D]">₹0</span><span className="text-gray-400 text-sm ml-1">/forever</span></div>
                <p className="text-xs text-gray-400 mb-6">For early-stage teams up to 10.</p>
                <div className="divider mb-6 w-12"/>
                <ul className="space-y-3 mb-8 flex-1">
                  {["People Directory & Org Chart","Document Vault","Basic Leave Tracking","Mobile App Access"].map(f=>(
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600"><span className="chteal">✓</span>{f}</li>
                  ))}
                </ul>
                <button className="w-full py-3.5 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all text-sm">Get Started Free</button>
              </div>
              <div className="relative rounded-3xl p-8 flex flex-col text-white shadow-2xl shadow-orange-900/20 md:-translate-y-4" style={{ background:'linear-gradient(145deg,#0D1F2D,#162639)' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 coral-btn text-white px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest">Most Popular</div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">Scale</span>
                <div className="flex items-baseline gap-1 mb-1"><span className="fd text-5xl font-black text-white">₹0</span><span className="text-gray-400 text-sm ml-1">/employee/month</span></div>
                <p className="text-xs text-gray-500 mb-6">Complete stack for high-growth teams.</p>
                <div className="h-0.5 bg-white/10 mb-6 w-12 rounded"/>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Everything in Essentials","Automated Payroll (TDS, PF, ESI)","Biometric & Face Attendance","Performance Reviews & OKRs","Dedicated Onboarding Support"].map(f=>(
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300"><span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <button className="w-full py-3.5 rounded-xl bg-white font-bold text-[#0D1F2D] hover:bg-orange-50 transition-all shadow-lg text-sm">Start 14-Day Free Trial</button>
              </div>
              <div className="border border-gray-200 rounded-3xl p-8 flex flex-col bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50 transition-all duration-300">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Enterprise</span>
                <div className="flex items-baseline gap-1 mb-1"><span className="fd text-5xl font-black text-[#0D1F2D]">Custom</span></div>
                <p className="text-xs text-gray-400 mb-6">For large orgs, 500+ employees.</p>
                <div className="divider mb-6 w-12"/>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Everything in Scale","Dedicated Customer Success","White-label & Custom Branding","HRMS + Payroll API Access","On-Premise Deployment"].map(f=>(
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600"><span className="chteal">✓</span>{f}</li>
                  ))}
                </ul>
                <button className="w-full py-3.5 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:border-[#00C2A8] hover:text-[#00C2A8] transition-all text-sm">Talk to Our Team</button>
              </div>
            </div>
            <div className="max-w-5xl mx-auto mt-4 text-right"><p className="text-xs text-gray-400">* Local taxes will be charged in addition.</p></div>
          </div>
        </section>

        {/* ═══ CTA ════════════════════════════════════════ */}
        <section className="py-12 relative overflow-hidden" style={{ background:'linear-gradient(145deg,#0D1F2D 0%,#162639 100%)' }}>
          <div className="absolute top-10 left-10 w-30 h-30 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background:'#FF6B35' }}/>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background:'#00C2A8' }}/>
          <div className="mx-auto max-w-3xl px-6 text-center relative">
            <h2 className="fd text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Your best hire just got easier to manage.</h2>
            <p className="text-gray-400 mb-3 leading-relaxed">Join hundreds of Indian companies that ditched spreadsheets for SamayaHR.</p>
            <p className="font-bold text-gray-500 mb-10 text-sm">No contracts · No credit card · Free for 10 people</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="coral-btn inline-flex items-center justify-center gap-2 rounded-xl px-10 py-4 font-bold text-white">Start Free — 5 Minutes →</Link>
              <Link to="/contact" className="inline-flex items-center justify-center rounded-xl border-2 border-white/15 text-white px-10 py-4 font-bold hover:bg-white/5 hover:border-white/30 transition-all">Talk to a Human</Link>
            </div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer style={{ background:"linear-gradient(180deg,#09101f 0%,#060c18 100%)", position:"relative", overflow:"hidden" }}>
        {/* Top gradient accent line */}
        <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(255,107,53,.5) 30%,rgba(0,194,168,.4) 70%,transparent)" }} />
        {/* Ambient glow */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:700, height:180, background:"radial-gradient(ellipse,rgba(255,107,53,.05) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px 32px 0" }}>

          {/* ── Main grid ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr 1fr", gap:28, paddingBottom:32, borderBottom:"1px solid rgba(255,255,255,.05)" }}>

            {/* Brand column */}
            <div>
              {/* Logo — mix-blend-mode:screen removes white bg on dark surface */}
              <div style={{ marginBottom:10 }}>
                <img src="/SamayaHR.png" alt="SamayaHR"
                  style={{ height:72, maxWidth:240, objectFit:"contain", objectPosition:"left", mixBlendMode:"screen", display:"block" }} />
              </div>
              <p style={{ fontSize:12.5, color:"#4b5a73", lineHeight:1.7, marginBottom:16, maxWidth:200 }}>
                Built for India's fastest-growing startups, SMBs &amp; enterprises.
              </p>
              {/* Trust badge */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:99, background:"rgba(255,107,53,.07)", border:"1px solid rgba(255,107,53,.15)", marginBottom:16 }}>
                <span style={{ fontSize:12 }}>🇮🇳</span>
                <span style={{ fontSize:11, fontWeight:700, color:"#FF6B35", letterSpacing:".04em" }}>Made in India</span>
              </div>
              {/* Social icons */}
              <div style={{ display:"flex", gap:8 }}>
                {[
                  {fill:"#1877F2",d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"},
                  {fill:"#fff",d:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"},
                  {fill:"#0A66C2",d:"M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"},
                  {fill:"#E4405F",d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"},
                  {fill:"#FF0000",d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"},
                ].map((s,i) => (
                  <a key={i} href="#" style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(255,107,53,.15)"; e.currentTarget.style.borderColor="rgba(255,107,53,.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,.06)"; }}>
                    <svg width={14} height={14} fill={s.fill} viewBox="0 0 24 24"><path d={s.d}/></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {[
              {title:"Company", links:[["About","/about"],["Features","#features"],["Pricing","#pricing"],["Contact","/contact"]]},
              {title:"Product", links:[["Get Started","/signup"],["Sign Up","/signup"],["Book a Demo","/solutions/bookdemo"]]},
              {title:"Support", links:[["Help Center","/help-center"],["FAQs","/faqs"],["Blog","/blog"],["Sitemap","/sitemap"]]},
              {title:"Legal",   links:[["Privacy Policy","/privacy"],["Terms","/terms"],["Cookie Policy","/cookies"],["Refund Policy","/refund"]]},
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize:10, fontWeight:800, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(255,255,255,.35)", marginBottom:18 }}>{col.title}</h4>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                  {col.links.map(([label,href]) => (
                    <li key={label}>
                      <Link to={href} style={{ fontSize:13, color:"#4b5a73", textDecoration:"none", transition:"color .15s", fontWeight:500 }}
                        onMouseEnter={e => e.target.style.color="#fff"}
                        onMouseLeave={e => e.target.style.color="#4b5a73"}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ── */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, padding:"16px 0 20px" }}>
            {/* Left: email + compliance */}
            <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
              <a href="mailto:support@zlabs.com" style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:"#4b5a73", textDecoration:"none", fontWeight:600, transition:"color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color="#FF6B35"}
                onMouseLeave={e => e.currentTarget.style.color="#4b5a73"}>
                <svg width={13} height={13} fill="none" stroke="#FF6B35" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                support@zlabs.com
              </a>
              <span style={{ fontSize:11, color:"#283246", fontWeight:600 }}>DPDPA 2023 Compliant</span>
              <span style={{ fontSize:11, color:"#283246", fontWeight:600 }}>ISO 27001</span>
            </div>
            {/* Right: app store buttons */}
            <div style={{ display:"flex", gap:8 }}>
              {[
                {icon:"M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11",l1:"Download on the",l2:"App Store"},
                {icon:"M3.18 23.76c.3.17.67.17.98 0l10.93-6.31-2.26-2.26-9.65 8.57zm-1.1-20.7a1.05 1.05 0 000 1.74l9.18 5.3-2.26 2.26L2.08 3.06zm19.3 8.7L19 9.55l-2.49 2.49L19 14.45l2.38-1.37a1.05 1.05 0 000-1.82zM5.42.25L16.35 6.56l-2.26 2.26L3.18.25C3.5.08 3.87.08 4.18.25z",l1:"Get it on",l2:"Google Play"},
              ].map(btn => (
                <a key={btn.l2} href="#" style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", borderRadius:10, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", textDecoration:"none", transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.08)"; e.currentTarget.style.borderColor="rgba(255,255,255,.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,.08)"; }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff"><path d={btn.icon}/></svg>
                  <div>
                    <p style={{ fontSize:8, color:"#4b5a73", margin:0, fontWeight:600, lineHeight:1.2 }}>{btn.l1}</p>
                    <p style={{ fontSize:11, color:"#fff", margin:0, fontWeight:800, lineHeight:1.3 }}>{btn.l2}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Copyright strip ── */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,.04)", padding:"12px 0", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
            <p style={{ fontSize:11, color:"#283246", margin:0, fontWeight:500 }}>
              © {new Date().getFullYear()} Zlabs Innovation Pvt. Ltd. · SamayaHR is a registered trademark.
            </p>
            <div style={{ display:"flex", gap:20 }}>
              {[["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Cookie Policy","/cookies"]].map(([l,h]) => (
                <Link key={l} to={h} style={{ fontSize:11, color:"#283246", textDecoration:"none", fontWeight:500, transition:"color .15s" }}
                  onMouseEnter={e => e.target.style.color="#94a3b8"}
                  onMouseLeave={e => e.target.style.color="#283246"}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}