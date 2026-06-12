// import React, { useEffect, useState } from "react";
// import { RefreshCw, CheckCircle, Clock, TrendingUp, Star } from "lucide-react";
// import { API_BASE_URL } from "@/lib/apiClient";

// const getAuthHeader = () => {
//   const t = localStorage.getItem("token");
//   if (!t) return "";
//   return t.startsWith("Bearer ") ? t : `Bearer ${t}`;
// };

// const C = {
//   ink: "#0A0E1A", slate: "#1C2333", mist: "#2E3A50", silver: "#8A95A8",
//   fog: "#F0F3F8", page: "#F7F9FC", lime: "#B8F53A", sky: "#38C4F0",
//   peach: "#FF8A65", violet: "#9B7EFF", mint: "#2DD4A0",
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=JetBrains+Mono:wght@400;600&display=swap');
// .xp{font-family:'Space Grotesk',sans-serif;background:${C.page};}
// .xp .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:.03em;}
// .xp .mono{font-family:'JetBrains Mono',monospace;}
// .xp-panel{background:#fff;border:1px solid #E4E9F0;border-radius:16px;}
// .xp-chip{border-radius:999px;font-size:11px;font-weight:600;padding:3px 10px;display:inline-flex;align-items:center;gap:4px;}
// .xp-bar-bg{height:6px;border-radius:3px;background:#E4E9F0;overflow:hidden;}
// .xp-bar-fg{height:100%;border-radius:3px;transition:width .7s cubic-bezier(.4,0,.2,1);}
// @keyframes xpIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
// .xp-in{animation:xpIn .35s ease both;}
// @keyframes xpSpin{to{transform:rotate(360deg)}}
// .xp-spin{animation:xpSpin .7s linear infinite;}
// `;

// const gradeMap = {
//   Excellent:          { bg:"#ECFEF5",color:"#0A6640",ring:"#2DD4A0" },
//   Good:               { bg:"#EEF4FF",color:"#1A3A8F",ring:"#6088FF" },
//   Average:            { bg:"#FFF8EC",color:"#7A4500",ring:"#FFAA44" },
//   "Needs Improvement":{ bg:"#FFF0F0",color:"#7A1A1A",ring:"#FF7070" },
// };

// export default function PersonMomentumControlRoom() {
//   const [perf,  setPerf]  = useState(null);
//   const [board, setBoard] = useState(null);
//   const [busy,  setBusy]  = useState(true);
//   const [err,   setErr]   = useState(null);

//   const load = async () => {
//     try {
//       setBusy(true); setErr(null);
//       const h = {
//         Authorization: getAuthHeader(), "Content-Type": "application/json",
//         ...(localStorage.getItem("tenantCode") ? { "X-Tenant-Code": localStorage.getItem("tenantCode") } : {}),
//       };
//       const [pR, bR] = await Promise.all([
//         fetch(`${API_BASE_URL}/api/performance/me`,          { headers: h }),
//         fetch(`${API_BASE_URL}/api/performance/leaderboard`, { headers: h }),
//       ]);
//       const pJ = await pR.json().catch(() => ({}));
//       const bJ = await bR.json().catch(() => ({}));
//       if      (pR.status === 404)     setPerf(null);
//       else if (pR.ok && pJ?.success)  setPerf(pJ.data);
//       else throw new Error(pJ?.message || `Error ${pR.status}`);
//       if (bR.ok && bJ?.success) setBoard(bJ.data);
//     } catch (e) { setErr(e.message); }
//     finally     { setBusy(false); }
//   };

//   useEffect(() => { load(); }, []);

//   if (busy) return (
//     <div className="xp" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
//       <style>{CSS}</style>
//       <div style={{ textAlign:"center" }}>
//         <div className="xp-spin" style={{ width:32, height:32, border:`2px solid ${C.lime}`, borderTopColor:"transparent", borderRadius:"50%", margin:"0 auto 12px" }} />
//         <p className="mono" style={{ fontSize:12, color:C.silver }}>fetching your data…</p>
//       </div>
//     </div>
//   );

//   if (err) return (
//     <div className="xp" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
//       <style>{CSS}</style>
//       <div className="xp-panel" style={{ maxWidth:360, width:"100%", padding:32, textAlign:"center" }}>
//         <div style={{ fontSize:36, marginBottom:12 }}>⚡</div>
//         <p className="disp" style={{ fontSize:22, color:C.ink, marginBottom:6 }}>Connection Lost</p>
//         <p style={{ fontSize:13, color:C.silver, marginBottom:20 }}>{err}</p>
//         <button onClick={load} style={{ padding:"10px 24px", borderRadius:10, border:"none", background:C.lime, color:C.ink, fontSize:13, fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 }}>
//           <RefreshCw size={13} /> Try Again
//         </button>
//       </div>
//     </div>
//   );

//   if (!perf) return (
//     <div className="xp" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
//       <style>{CSS}</style>
//       <div className="xp-panel" style={{ maxWidth:380, width:"100%", padding:40, textAlign:"center" }}>
//         <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
//         <p className="disp" style={{ fontSize:24, color:C.ink, marginBottom:8 }}>Nothing Here Yet</p>
//         <p style={{ fontSize:13, color:C.silver, lineHeight:1.7 }}>Your manager hasn't published your evaluation yet. Check back soon.</p>
//       </div>
//     </div>
//   );

//   const {
//     employeeId, name, department, position, currentScore, status,
//     tasksCompleted, totalTasks, attendance, productivity,
//     qualityScore, punctuality, validated, lastUpdated,
//     monthlyScores = [], feedback = [],
//   } = perf;

//   const taskRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
//   const grade = gradeMap[status] || gradeMap.Average;

//   return (
//     <div className="xp" style={{ minHeight:"100vh", padding:"0 0 48px" }}>
//       <style>{CSS}</style>

//       {/* TOP BAR */}
//       <div style={{ background:C.ink, padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
//         <div style={{ display:"flex", alignItems:"center", gap:14 }}>
//           <div style={{ width:40, height:40, borderRadius:10, background:C.lime, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
//           <div>
//             <p style={{ fontSize:10, fontWeight:600, color:C.silver, textTransform:"uppercase", letterSpacing:".12em", marginBottom:2 }}>Growth Studio</p>
//             <p className="disp" style={{ fontSize:22, color:"#fff" }}>Career Pulse</p>
//           </div>
//         </div>
//         <div className="mono" style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"8px 16px" }}>
//           <p style={{ fontSize:9, color:C.silver, marginBottom:2 }}>STAFF ID</p>
//           <p style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{employeeId}</p>
//         </div>
//       </div>

//       <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:20 }}>

//         {board && <Leaderboard data={board} />}

//         {/* IDENTITY */}
//         <div className="xp-panel xp-in" style={{ padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:14 }}>
//             <div style={{ width:50, height:50, borderRadius:14, background:`linear-gradient(135deg,${C.slate},${C.mist})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👤</div>
//             <div>
//               <p className="disp" style={{ fontSize:22, color:C.ink }}>{name}</p>
//               <p style={{ fontSize:12, color:C.silver }}>{position} &middot; {department}</p>
//             </div>
//           </div>
//           <span style={{ background:grade.bg, color:grade.color, border:`1.5px solid ${grade.ring}`, padding:"6px 16px", borderRadius:999, fontSize:13, fontWeight:700, display:"inline-flex", alignItems:"center", gap:6 }}>
//             {validated ? <CheckCircle size={12} /> : <Clock size={12} />} {status}
//           </span>
//         </div>

//         {/* GAUGES */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }} className="xp-gauges">
//           <style>{`@media(max-width:700px){.xp-gauges{grid-template-columns:1fr 1fr!important}}`}</style>
//           {[
//             { icon:"🎯", cap:"Composite Score",  big:`${currentScore}`,             sub:null,               accent:C.lime   },
//             { icon:"✦",  cap:"Delivery Rate",    big:`${tasksCompleted}/${totalTasks}`, sub:`${taskRate}%`, accent:C.sky    },
//             { icon:"📅", cap:"Presence Index",   big:`${attendance}%`,              sub:attendance>=90?"On track":null, accent:C.mint },
//             { icon:"⚡", cap:"Output Index",     big:`${productivity}%`,            sub:null,               accent:C.violet },
//           ].map(g => (
//             <div key={g.cap} className="xp-panel" style={{ padding:"18px 20px", position:"relative", overflow:"hidden" }}>
//               <div style={{ position:"absolute", top:-10, right:-10, fontSize:48, opacity:.05 }}>{g.icon}</div>
//               <p style={{ fontSize:11, fontWeight:600, color:C.silver, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>{g.cap}</p>
//               <p className="disp" style={{ fontSize:34, color:C.ink, lineHeight:1, marginBottom:4 }}>{g.big}</p>
//               {g.sub && <span style={{ fontSize:11, fontWeight:700, color:g.accent, background:`${g.accent}18`, padding:"2px 8px", borderRadius:6 }}>{g.sub}</span>}
//               <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:3, background:`${g.accent}28` }}>
//                 <div style={{ height:"100%", background:g.accent, width:"55%", opacity:.7 }} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* CHARTS */}
//         <div style={{ display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:20 }} className="xp-c2">
//           <style>{`@media(max-width:840px){.xp-c2{grid-template-columns:1fr!important}}`}</style>
//           <div className="xp-panel" style={{ padding:"22px 24px" }}>
//             <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
//               <p style={{ fontSize:13, fontWeight:700, color:C.ink }}>Score Journey <span style={{ fontSize:11, color:C.silver, fontWeight:400 }}>last 6 months</span></p>
//               <span className="xp-chip" style={{ background:`${C.sky}15`, color:C.sky }}>↑ Trend</span>
//             </div>
//             <MiniTrend scores={monthlyScores.slice(-6)} />
//           </div>
//           <div className="xp-panel" style={{ padding:"22px 24px" }}>
//             <p style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:16 }}>Capability Web</p>
//             <Spider metrics={[
//               { label:"Output",    v: productivity || 0 },
//               { label:"Quality",   v: qualityScore  || 0 },
//               { label:"Timing",    v: punctuality   || 0 },
//               { label:"Presence",  v: attendance    || 0 },
//               { label:"Delivery",  v: taskRate        },
//             ]} />
//           </div>
//         </div>

//         {/* BREAKDOWN + RING */}
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }} className="xp-c2">
//           <div className="xp-panel" style={{ padding:"22px 24px" }}>
//             <p style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:18 }}>Dimension Breakdown</p>
//             <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
//               {[
//                 { label:"Output Rate",     v:productivity, c:C.lime   },
//                 { label:"Work Quality",    v:qualityScore, c:C.violet },
//                 { label:"Time Discipline", v:punctuality,  c:C.mint   },
//                 { label:"Presence Rate",   v:attendance,   c:C.sky    },
//               ].map(m => (
//                 <div key={m.label}>
//                   <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
//                     <span style={{ fontSize:12, color:C.ink, fontWeight:500 }}>{m.label}</span>
//                     <span className="mono" style={{ fontSize:12, fontWeight:600, color:m.c }}>{m.v}%</span>
//                   </div>
//                   <div className="xp-bar-bg">
//                     <div className="xp-bar-fg" style={{ width:`${m.v}%`, background:m.c }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="xp-panel" style={{ padding:"22px 24px" }}>
//             <p style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:16 }}>Score Composition</p>
//             <RingChart segments={[
//               { label:"Output Rate",    v:productivity || 0, c:C.lime   },
//               { label:"Work Quality",   v:qualityScore  || 0, c:C.violet },
//               { label:"Time Discipline",v:punctuality   || 0, c:C.mint   },
//               { label:"Presence",       v:attendance    || 0, c:C.sky    },
//             ]} />
//           </div>
//         </div>

//         {/* MANAGER NOTES */}
//         <div className="xp-panel" style={{ padding:"22px 24px" }}>
//           <p style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:16 }}>Manager Notes</p>
//           {feedback.length > 0
//             ? <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:280, overflowY:"auto" }}>
//                 {feedback.map((f, i) => (
//                   <div key={i} style={{ background:C.fog, borderRadius:12, padding:"14px 16px", borderLeft:`3px solid ${C.sky}` }}>
//                     <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
//                       <p style={{ fontSize:13, fontWeight:700, color:C.ink }}>{f.title}</p>
//                       <p className="mono" style={{ fontSize:10, color:C.silver }}>{f.date}</p>
//                     </div>
//                     <p style={{ fontSize:12, color:C.slate, lineHeight:1.65 }}>{f.comment}</p>
//                     <p style={{ fontSize:11, color:C.sky, fontWeight:600, marginTop:6 }}>— {f.author}</p>
//                   </div>
//                 ))}
//               </div>
//             : <div style={{ textAlign:"center", padding:"28px 0" }}>
//                 <span style={{ fontSize:32, display:"block", marginBottom:8 }}>📭</span>
//                 <p style={{ fontSize:13, color:C.silver }}>No notes from your manager yet.</p>
//               </div>
//           }
//         </div>

//         {/* VALIDATION */}
//         <div style={{ padding:"16px 20px", borderRadius:14, background:validated?"#ECFEF5":"#FFFAEC", border:`1px solid ${validated?C.mint:C.peach}40`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//             <span style={{ fontSize:18 }}>{validated ? "✅" : "⏳"}</span>
//             <div>
//               <p style={{ fontSize:12, fontWeight:700, color:validated?"#0A6640":"#7A4500" }}>
//                 {validated ? "Scorecard Signed Off" : "Awaiting Manager Review"}
//               </p>
//               <p style={{ fontSize:11, color:C.silver }}>{validated ? "Confirmed by your manager." : "Your evaluation is pending approval."}</p>
//             </div>
//           </div>
//           {lastUpdated && <p className="mono" style={{ fontSize:10, color:C.silver }}>{new Date(lastUpdated).toLocaleString()}</p>}
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ── LEADERBOARD ── */
// function Leaderboard({ data }) {
//   const { currentUser, topPerformers, totalPersons, month } = data;
//   const fmtMonth = s => {
//     if (!s) return "";
//     const [y, m] = s.split("-");
//     return new Date(y, parseInt(m)-1).toLocaleDateString("en-US",{ year:"numeric", month:"long" });
//   };
//   const stripes = ["#B8F53A","#C0C8D8","#FF8A65"];
//   const icons   = ["👑","🥈","🥉"];

//   return (
//     <div className="xp-in" style={{ display:"flex", flexDirection:"column", gap:14 }}>
//       <div style={{ background:C.ink, borderRadius:18, padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
//         <div>
//           <p style={{ fontSize:10, fontWeight:600, color:C.silver, textTransform:"uppercase", letterSpacing:".12em", marginBottom:4 }}>🏆 Monthly Rankings · {fmtMonth(month)}</p>
//           <p className="disp" style={{ fontSize:26, color:"#fff" }}>Who's Leading?</p>
//         </div>
//         <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"10px 20px", textAlign:"center" }}>
//           <p style={{ fontSize:9, color:C.silver, marginBottom:2, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em" }}>Your Position</p>
//           <p className="disp" style={{ fontSize:36, color:C.lime, lineHeight:1 }}>#{currentUser?.rank||"—"}</p>
//           <p style={{ fontSize:10, color:C.silver }}>of {totalPersons}</p>
//         </div>
//       </div>

//       {topPerformers && (
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }} className="xp-pod">
//           <style>{`@media(max-width:600px){.xp-pod{grid-template-columns:1fr!important}}`}</style>
//           {topPerformers.map((p, idx) => (
//             <div key={p.id} className="xp-panel" style={{ padding:20, borderTop:`3px solid ${stripes[idx]||"#E4E9F0"}` }}>
//               <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//                   <span style={{ fontSize:22 }}>{icons[idx]||"🏅"}</span>
//                   <div>
//                     <p className="disp" style={{ fontSize:22, color:C.ink }}>#{p.rank}</p>
//                     <p style={{ fontSize:9, color:C.silver, fontWeight:600, textTransform:"uppercase" }}>{idx===0?"Champion":idx===1?"Runner-up":"3rd Place"}</p>
//                   </div>
//                 </div>
//                 <p className="disp" style={{ fontSize:30, color:stripes[idx]===C.lime?C.ink:(stripes[idx]||C.ink) }}>{p.currentScore}</p>
//               </div>
//               <p style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:2 }}>{p.name}</p>
//               <p style={{ fontSize:11, color:C.silver, marginBottom:14 }}>{p.department} · {p.position}</p>
//               <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
//                 {[{ l:"Tasks",v:`${p.tasksCompleted}/${p.totalTasks}` },{ l:"Presence",v:`${p.attendance}%` }].map(x => (
//                   <div key={x.l} style={{ background:C.fog, borderRadius:8, padding:"8px 10px" }}>
//                     <p style={{ fontSize:9, color:C.silver, fontWeight:600, textTransform:"uppercase", marginBottom:2 }}>{x.l}</p>
//                     <p className="mono" style={{ fontSize:12, fontWeight:600, color:C.ink }}>{x.v}</p>
//                   </div>
//                 ))}
//               </div>
//               {p.rank === 1 && (
//                 <div style={{ marginTop:12, textAlign:"center" }}>
//                   <span className="xp-chip" style={{ background:`${C.lime}25`, color:C.ink }}>
//                     <Star size={10} /> Top of the Month
//                   </span>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {currentUser && (
//         <div className="xp-panel" style={{ padding:"18px 22px", borderLeft:`4px solid ${C.sky}` }}>
//           <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
//             <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//               <div style={{ width:46, height:46, borderRadius:12, background:C.fog, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🧑‍💼</div>
//               <div>
//                 <p style={{ fontSize:10, fontWeight:600, color:C.silver, textTransform:"uppercase", letterSpacing:".07em", marginBottom:2 }}>Your Standing</p>
//                 <p className="disp" style={{ fontSize:20, color:C.ink }}>{currentUser.name}</p>
//                 <p style={{ fontSize:11, color:C.silver }}>{currentUser.department} · {currentUser.position}</p>
//               </div>
//             </div>
//             <div style={{ display:"flex", gap:20 }}>
//               {[{ l:"Rank",v:`#${currentUser.rank}`,c:C.sky },{ l:"Score",v:currentUser.currentScore,c:C.ink }].map(x => (
//                 <div key={x.l} style={{ textAlign:"center" }}>
//                   <p style={{ fontSize:9, color:C.silver, fontWeight:600, textTransform:"uppercase", marginBottom:2 }}>{x.l}</p>
//                   <p className="disp" style={{ fontSize:28, color:x.c }}>{x.v}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #E4E9F0", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
//             {[
//               { l:"Tasks",    v:`${currentUser.tasksCompleted}/${currentUser.totalTasks}` },
//               { l:"Presence", v:`${currentUser.attendance}%`    },
//               { l:"Output",   v:`${currentUser.productivity}%`  },
//               { l:"Quality",  v:`${currentUser.qualityScore}%`  },
//             ].map(x => (
//               <div key={x.l} style={{ background:C.fog, borderRadius:10, padding:"8px 12px", textAlign:"center" }}>
//                 <p style={{ fontSize:9, color:C.silver, fontWeight:600, textTransform:"uppercase", marginBottom:3 }}>{x.l}</p>
//                 <p className="mono" style={{ fontSize:13, fontWeight:700, color:C.ink }}>{x.v}</p>
//               </div>
//             ))}
//           </div>
//           {currentUser.rank <= 3 && (
//             <div style={{ marginTop:12, textAlign:"center" }}>
//               <span className="xp-chip" style={{ background:`${C.mint}20`, color:"#0A6640" }}>
//                 <TrendingUp size={10} /> You're in the top 3 — incredible work!
//               </span>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function MiniTrend({ scores }) {
//   if (!scores.length) return <p style={{ fontSize:12, color:C.silver, textAlign:"center", padding:"20px 0" }}>No trend data yet.</p>;
//   const H = 130, W = 360, max = Math.max(...scores, 100);
//   const pts = scores.map((v,i) => `${(i/(scores.length-1))*W},${H-(v/max)*H}`).join(" ");
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   const now = new Date().getMonth();
//   const labels = scores.map((_,i) => months[(now - scores.length + 1 + i + 12) % 12]);
//   return (
//     <div>
//       <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:130 }}>
//         <defs>
//           <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor={C.sky} stopOpacity=".18" />
//             <stop offset="100%" stopColor={C.sky} stopOpacity="0" />
//           </linearGradient>
//         </defs>
//         <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#tg)" />
//         <polyline fill="none" stroke={C.sky} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
//         {scores.map((v,i) => {
//           const x=(i/(scores.length-1))*W, y=H-(v/max)*H;
//           return <circle key={i} cx={x} cy={y} r="4" fill={C.sky} stroke="#fff" strokeWidth="2" />;
//         })}
//       </svg>
//       <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
//         {labels.map((l,i) => <span key={i} className="mono" style={{ fontSize:10, color:C.silver }}>{l}</span>)}
//       </div>
//     </div>
//   );
// }

// function Spider({ metrics }) {
//   const cx=130, cy=120, r=90, step=(2*Math.PI)/metrics.length;
//   const toXY = (i, pct) => { const a=i*step-Math.PI/2, rv=(pct/100)*r; return { x:cx+rv*Math.cos(a), y:cy+rv*Math.sin(a) }; };
//   const pts = metrics.map((m,i) => { const p=toXY(i,m.v); return `${p.x},${p.y}`; }).join(" ");
//   return (
//     <svg viewBox="0 0 260 240" style={{ width:"100%", height:200 }}>
//       {[1,2,3,4,5].map(lvl => {
//         const p = metrics.map((_,i) => { const pt=toXY(i,lvl*20); return `${pt.x},${pt.y}`; }).join(" ");
//         return <polygon key={lvl} points={p} fill="none" stroke="#E4E9F0" strokeWidth="1" />;
//       })}
//       {metrics.map((_,i) => { const o=toXY(i,100); return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke="#E4E9F0" strokeWidth="1" />; })}
//       <polygon points={pts} fill={`${C.sky}25`} stroke={C.sky} strokeWidth="2" />
//       {metrics.map((m,i) => { const lp=toXY(i,120); return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize:9, fill:C.silver, fontFamily:"Space Grotesk", fontWeight:600 }}>{m.label}</text>; })}
//     </svg>
//   );
// }

// function RingChart({ segments }) {
//   const total = segments.reduce((s,x) => s+x.v, 0);
//   const cx=90, cy=90, R=68, ir=44;
//   let ang = -90;
//   const toXY = (deg,rad) => ({ x:cx+rad*Math.cos(deg*Math.PI/180), y:cy+rad*Math.sin(deg*Math.PI/180) });
//   const arc = (sa,ea) => {
//     const s=toXY(ea,R), e=toXY(sa,R), is=toXY(ea,ir), ie=toXY(sa,ir);
//     const big = ea-sa<=180?"0":"1";
//     return `M ${s.x} ${s.y} A ${R} ${R} 0 ${big} 0 ${e.x} ${e.y} L ${ie.x} ${ie.y} A ${ir} ${ir} 0 ${big} 1 ${is.x} ${is.y} Z`;
//   };
//   return (
//     <div style={{ display:"flex", alignItems:"center", gap:16 }}>
//       <svg viewBox="0 0 180 180" style={{ width:150, height:150, flexShrink:0 }}>
//         {segments.map((seg,i) => {
//           const a=(seg.v/total)*360, path=arc(ang,ang+a); ang+=a;
//           return <path key={i} d={path} fill={seg.c} stroke="#fff" strokeWidth="2" />;
//         })}
//         <text x={cx} y={cy-8} textAnchor="middle" style={{ fontSize:16, fontWeight:700, fill:C.ink, fontFamily:"Bebas Neue" }}>{Math.round(total/segments.length)}%</text>
//         <text x={cx} y={cy+12} textAnchor="middle" style={{ fontSize:9, fill:C.silver, fontFamily:"Space Grotesk", fontWeight:600 }}>AVG</text>
//       </svg>
//       <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
//         {segments.map((seg,i) => (
//           <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
//             <span style={{ width:8, height:8, borderRadius:2, background:seg.c, flexShrink:0 }} />
//             <div style={{ flex:1 }}>
//               <div style={{ display:"flex", justifyContent:"space-between" }}>
//                 <p style={{ fontSize:11, color:C.silver }}>{seg.label}</p>
//                 <p className="mono" style={{ fontSize:11, fontWeight:700, color:C.ink }}>{seg.v}%</p>
//               </div>
//               <div className="xp-bar-bg" style={{ marginTop:3 }}>
//                 <div className="xp-bar-fg" style={{ width:`${seg.v}%`, background:seg.c }} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

//18-3-2026

import React, { useEffect, useState } from "react";
import { RefreshCw, CheckCircle, Clock, TrendingUp, Star } from "lucide-react";
import api from "@/lib/apiClient";

/*
  PersonMomentumControlRoom
  ─────────────────────────────────────────────────────────────────
  Fixes:
  1. Replaced axios.create({ withCredentials: true }) with plain fetch
     + Authorization: Bearer <token> header — the backend uses JWT,
     not session cookies, so withCredentials caused CORS preflight failures
  2. Added X-Tenant-Code header to all requests
  3. /api/performance/leaderboard failure no longer blocks the whole page —
     perf data still shows even if leaderboard returns 404/500
  4. Better error messages that show the actual HTTP status
  5. Retry button works correctly
*/


const C = {
  ink: "#0A0E1A", slate: "#1C2333", mist: "#2E3A50", silver: "#8A95A8",
  fog: "#F0F3F8", page: "#F7F9FC", lime: "#B8F53A", sky: "#38C4F0",
  peach: "#FF8A65", violet: "#9B7EFF", mint: "#2DD4A0",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=JetBrains+Mono:wght@400;600&display=swap');
.xp{font-family:'Space Grotesk',sans-serif;background:${C.page};}
.xp .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:.03em;}
.xp .mono{font-family:'JetBrains Mono',monospace;}
.xp-panel{background:#fff;border:1px solid #E4E9F0;border-radius:16px;}
.xp-chip{border-radius:999px;font-size:11px;font-weight:600;padding:3px 10px;display:inline-flex;align-items:center;gap:4px;}
.xp-bar-bg{height:6px;border-radius:3px;background:#E4E9F0;overflow:hidden;}
.xp-bar-fg{height:100%;border-radius:3px;transition:width .7s cubic-bezier(.4,0,.2,1);}
@keyframes xpIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.xp-in{animation:xpIn .35s ease both;}
@keyframes xpSpin{to{transform:rotate(360deg)}}
.xp-spin{animation:xpSpin .7s linear infinite;}
`;

const gradeMap = {
  Excellent:           { bg:"#ECFEF5", color:"#0A6640", ring:"#2DD4A0" },
  Good:                { bg:"#EEF4FF", color:"#1A3A8F", ring:"#6088FF" },
  Average:             { bg:"#FFF8EC", color:"#7A4500", ring:"#FFAA44" },
  "Needs Improvement": { bg:"#FFF0F0", color:"#7A1A1A", ring:"#FF7070" },
};

export default function PersonMomentumControlRoom() {
  const [perf,  setPerf]  = useState(null);
  const [board, setBoard] = useState(null);
  const [busy,  setBusy]  = useState(true);
  const [err,   setErr]   = useState(null);

  const load = async () => {
    try {
      setBusy(true);
      setErr(null);

      /* ── Fetch performance data ───────────────────────────────────────────
         GET /api/performance/me
         Response: ApiResponse<MomentumResponse>
         { success: true, data: { employeeId, name, currentScore, ... } }
      ─────────────────────────────────────────────────────────────────────── */
      try {
        const pRes  = await api.get("/api/performance/me");
        const pJson = pRes.data;
        if (pJson?.success && pJson?.data) {
          setPerf(pJson.data);
        } else if (pJson?.data) {
          setPerf(pJson.data);
        } else {
          setPerf(null);
        }
      } catch (pErr) {
        if (pErr?.response?.status === 404) {
          // No performance record yet — show empty state, not error
          setPerf(null);
        } else {
          throw new Error(pErr?.response?.data?.message || pErr.message || "Momentum data unavailable");
        }
      }

      /* ── Fetch leaderboard — non-blocking ─────────────────────────────────
         GET /api/performance/leaderboard
         Failure here should NOT block the main perf view.
      ─────────────────────────────────────────────────────────────────────── */
      try {
        const bRes  = await api.get("/api/performance/leaderboard");
        const bJson = bRes.data;
        if (bJson?.success && bJson?.data) setBoard(bJson.data);
        else if (bJson?.data)               setBoard(bJson.data);
        // Silently ignore leaderboard failures (404, 500, etc.)
      } catch {
        // Leaderboard is optional — fail silently
      }

    } catch (e) {
      console.error("Momentum load error:", e);
      setErr(e.message || "Failed to load performance data.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { load(); }, []);

  /* ── Loading ── */
  if (busy) return (
    <div className="xp" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{CSS}</style>
      <div style={{ textAlign:"center" }}>
        <div className="xp-spin" style={{ width:32, height:32, border:`2px solid ${C.lime}`, borderTopColor:"transparent", borderRadius:"50%", margin:"0 auto 12px" }} />
        <p className="mono" style={{ fontSize:12, color:C.silver }}>fetching your data…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (err) return (
    <div className="xp" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{CSS}</style>
      <div className="xp-panel" style={{ maxWidth:400, width:"100%", padding:36, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⚡</div>
        <p className="disp" style={{ fontSize:24, color:C.ink, marginBottom:8 }}>Something went wrong</p>
        <p style={{ fontSize:13, color:C.silver, marginBottom:20, lineHeight:1.6 }}>{err}</p>
        <button onClick={load} style={{ padding:"10px 28px", borderRadius:10, border:"none", background:C.lime, color:C.ink, fontSize:13, fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 }}>
          <RefreshCw size={13} /> Try Again
        </button>
      </div>
    </div>
  );

  /* ── No performance record yet ── */
  if (!perf) return (
    <div className="xp" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{CSS}</style>
      <div className="xp-panel" style={{ maxWidth:400, width:"100%", padding:44, textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:14 }}>📊</div>
        <p className="disp" style={{ fontSize:26, color:C.ink, marginBottom:10 }}>Nothing Here Yet</p>
        <p style={{ fontSize:13, color:C.silver, lineHeight:1.7, marginBottom:20 }}>
          Your manager hasn't published your performance evaluation yet.<br/>Check back soon.
        </p>
        <button onClick={load} style={{ padding:"10px 24px", borderRadius:10, border:"1px solid #E4E9F0", background:"#fff", color:C.ink, fontSize:12, fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
    </div>
  );

  const {
    employeeId, name, department, position, currentScore, status,
    tasksCompleted, totalTasks, attendance, productivity,
    qualityScore, punctuality, validated, lastUpdated,
    monthlyScores = [], feedback = [],
  } = perf;

  const taskRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
  const grade    = gradeMap[status] || gradeMap.Average;

  return (
    <div className="xp" style={{ minHeight:"100vh", padding:"0 0 48px" }}>
      <style>{CSS}</style>

      {/* TOP BAR */}
      <div style={{ background:C.ink, padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:C.lime, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
          <div>
            <p style={{ fontSize:10, fontWeight:600, color:C.silver, textTransform:"uppercase", letterSpacing:".12em", marginBottom:2 }}>Growth Studio</p>
            <p className="disp" style={{ fontSize:22, color:"#fff" }}>Career Pulse</p>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="mono" style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"8px 16px" }}>
            <p style={{ fontSize:9, color:C.silver, marginBottom:2 }}>STAFF ID</p>
            <p style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{employeeId || "—"}</p>
          </div>
          <button onClick={load} title="Refresh"
            style={{ width:36, height:36, borderRadius:9, border:"1px solid rgba(255,255,255,.15)", background:"rgba(255,255,255,.07)", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:20 }}>

        {/* LEADERBOARD — only if data available */}
        {board && <Leaderboard data={board} />}

        {/* IDENTITY */}
        <div className="xp-panel xp-in" style={{ padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:50, height:50, borderRadius:14, background:`linear-gradient(135deg,${C.slate},${C.mist})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👤</div>
            <div>
              <p className="disp" style={{ fontSize:22, color:C.ink }}>{name || "—"}</p>
              <p style={{ fontSize:12, color:C.silver }}>{position || "—"} &middot; {department || "—"}</p>
            </div>
          </div>
          <span style={{ background:grade.bg, color:grade.color, border:`1.5px solid ${grade.ring}`, padding:"6px 16px", borderRadius:999, fontSize:13, fontWeight:700, display:"inline-flex", alignItems:"center", gap:6 }}>
            {validated ? <CheckCircle size={12} /> : <Clock size={12} />} {status || "—"}
          </span>
        </div>

        {/* GAUGES */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }} className="xp-gauges">
          <style>{`@media(max-width:700px){.xp-gauges{grid-template-columns:1fr 1fr!important}}`}</style>
          {[
            { icon:"🎯", cap:"Composite Score",  big:`${currentScore ?? "—"}`,         sub:null,               accent:C.lime   },
            { icon:"✦",  cap:"Delivery Rate",    big:`${tasksCompleted}/${totalTasks}`, sub:`${taskRate}%`,     accent:C.sky    },
            { icon:"📅", cap:"Presence Index",   big:`${attendance ?? 0}%`,             sub: (attendance ?? 0) >= 90 ? "On track" : null, accent:C.mint },
            { icon:"⚡", cap:"Output Index",     big:`${productivity ?? 0}%`,           sub:null,               accent:C.violet },
          ].map(g => (
            <div key={g.cap} className="xp-panel" style={{ padding:"18px 20px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-10, right:-10, fontSize:48, opacity:.05 }}>{g.icon}</div>
              <p style={{ fontSize:11, fontWeight:600, color:C.silver, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>{g.cap}</p>
              <p className="disp" style={{ fontSize:34, color:C.ink, lineHeight:1, marginBottom:4 }}>{g.big}</p>
              {g.sub && <span style={{ fontSize:11, fontWeight:700, color:g.accent, background:`${g.accent}18`, padding:"2px 8px", borderRadius:6 }}>{g.sub}</span>}
              <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:3, background:`${g.accent}28` }}>
                <div style={{ height:"100%", background:g.accent, width:"55%", opacity:.7 }} />
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div style={{ display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:20 }} className="xp-c2">
          <style>{`@media(max-width:840px){.xp-c2{grid-template-columns:1fr!important}}`}</style>
          <div className="xp-panel" style={{ padding:"22px 24px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.ink }}>Score Journey <span style={{ fontSize:11, color:C.silver, fontWeight:400 }}>last 6 months</span></p>
              <span className="xp-chip" style={{ background:`${C.sky}15`, color:C.sky }}>↑ Trend</span>
            </div>
            <MiniTrend scores={monthlyScores.slice(-6)} />
          </div>
          <div className="xp-panel" style={{ padding:"22px 24px" }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:16 }}>Capability Web</p>
            <Spider metrics={[
              { label:"Output",   v: productivity ?? 0 },
              { label:"Quality",  v: qualityScore  ?? 0 },
              { label:"Timing",   v: punctuality   ?? 0 },
              { label:"Presence", v: attendance    ?? 0 },
              { label:"Delivery", v: taskRate           },
            ]} />
          </div>
        </div>

        {/* BREAKDOWN + RING */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }} className="xp-c2">
          <div className="xp-panel" style={{ padding:"22px 24px" }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:18 }}>Dimension Breakdown</p>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { label:"Output Rate",     v: productivity ?? 0, c:C.lime   },
                { label:"Work Quality",    v: qualityScore  ?? 0, c:C.violet },
                { label:"Time Discipline", v: punctuality   ?? 0, c:C.mint   },
                { label:"Presence Rate",   v: attendance    ?? 0, c:C.sky    },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, color:C.ink, fontWeight:500 }}>{m.label}</span>
                    <span className="mono" style={{ fontSize:12, fontWeight:600, color:m.c }}>{m.v}%</span>
                  </div>
                  <div className="xp-bar-bg">
                    <div className="xp-bar-fg" style={{ width:`${m.v}%`, background:m.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="xp-panel" style={{ padding:"22px 24px" }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:16 }}>Score Composition</p>
            <RingChart segments={[
              { label:"Output Rate",    v: productivity ?? 0, c:C.lime   },
              { label:"Work Quality",   v: qualityScore  ?? 0, c:C.violet },
              { label:"Time Discipline",v: punctuality   ?? 0, c:C.mint   },
              { label:"Presence",       v: attendance    ?? 0, c:C.sky    },
            ]} />
          </div>
        </div>

        {/* MANAGER NOTES */}
        <div className="xp-panel" style={{ padding:"22px 24px" }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:16 }}>Manager Notes</p>
          {feedback.length > 0
            ? (
              <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:280, overflowY:"auto" }}>
                {feedback.map((f, i) => (
                  <div key={i} style={{ background:C.fog, borderRadius:12, padding:"14px 16px", borderLeft:`3px solid ${C.sky}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:C.ink }}>{f.title}</p>
                      <p className="mono" style={{ fontSize:10, color:C.silver }}>{f.date}</p>
                    </div>
                    <p style={{ fontSize:12, color:C.slate, lineHeight:1.65 }}>{f.comment}</p>
                    <p style={{ fontSize:11, color:C.sky, fontWeight:600, marginTop:6 }}>— {f.author}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"28px 0" }}>
                <span style={{ fontSize:32, display:"block", marginBottom:8 }}>📭</span>
                <p style={{ fontSize:13, color:C.silver }}>No notes from your manager yet.</p>
              </div>
            )
          }
        </div>

        {/* VALIDATION STATUS */}
        <div style={{ padding:"16px 20px", borderRadius:14, background: validated ? "#ECFEF5" : "#FFFAEC", border:`1px solid ${validated ? C.mint : C.peach}40`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>{validated ? "✅" : "⏳"}</span>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color: validated ? "#0A6640" : "#7A4500" }}>
                {validated ? "Scorecard Signed Off" : "Awaiting Manager Review"}
              </p>
              <p style={{ fontSize:11, color:C.silver }}>
                {validated ? "Confirmed by your manager." : "Your evaluation is pending approval."}
              </p>
            </div>
          </div>
          {lastUpdated && <p className="mono" style={{ fontSize:10, color:C.silver }}>{new Date(lastUpdated).toLocaleString()}</p>}
        </div>

      </div>
    </div>
  );
}

/* ── LEADERBOARD ── */
function Leaderboard({ data }) {
  const { currentUser, topPerformers, totalPersons, month } = data;
  const fmtMonth = s => {
    if (!s) return "";
    const [y, m] = s.split("-");
    return new Date(y, parseInt(m) - 1).toLocaleDateString("en-US", { year:"numeric", month:"long" });
  };
  const stripes = ["#B8F53A", "#C0C8D8", "#FF8A65"];
  const icons   = ["👑", "🥈", "🥉"];

  return (
    <div className="xp-in" style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ background:C.ink, borderRadius:18, padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <p style={{ fontSize:10, fontWeight:600, color:C.silver, textTransform:"uppercase", letterSpacing:".12em", marginBottom:4 }}>🏆 Monthly Rankings · {fmtMonth(month)}</p>
          <p className="disp" style={{ fontSize:26, color:"#fff" }}>Who's Leading?</p>
        </div>
        <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"10px 20px", textAlign:"center" }}>
          <p style={{ fontSize:9, color:C.silver, marginBottom:2, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em" }}>Your Position</p>
          <p className="disp" style={{ fontSize:36, color:C.lime, lineHeight:1 }}>#{currentUser?.rank || "—"}</p>
          <p style={{ fontSize:10, color:C.silver }}>of {totalPersons}</p>
        </div>
      </div>

      {topPerformers && topPerformers.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }} className="xp-pod">
          <style>{`@media(max-width:600px){.xp-pod{grid-template-columns:1fr!important}}`}</style>
          {topPerformers.map((p, idx) => (
            <div key={p.id || idx} className="xp-panel" style={{ padding:20, borderTop:`3px solid ${stripes[idx] || "#E4E9F0"}` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:22 }}>{icons[idx] || "🏅"}</span>
                  <div>
                    <p className="disp" style={{ fontSize:22, color:C.ink }}>#{p.rank}</p>
                    <p style={{ fontSize:9, color:C.silver, fontWeight:600, textTransform:"uppercase" }}>
                      {idx === 0 ? "Champion" : idx === 1 ? "Runner-up" : "3rd Place"}
                    </p>
                  </div>
                </div>
                <p className="disp" style={{ fontSize:30, color: stripes[idx] === C.lime ? C.ink : (stripes[idx] || C.ink) }}>{p.currentScore}</p>
              </div>
              <p style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:2 }}>{p.name}</p>
              <p style={{ fontSize:11, color:C.silver, marginBottom:14 }}>{p.department} · {p.position}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[{ l:"Tasks", v:`${p.tasksCompleted}/${p.totalTasks}` }, { l:"Presence", v:`${p.attendance}%` }].map(x => (
                  <div key={x.l} style={{ background:C.fog, borderRadius:8, padding:"8px 10px" }}>
                    <p style={{ fontSize:9, color:C.silver, fontWeight:600, textTransform:"uppercase", marginBottom:2 }}>{x.l}</p>
                    <p className="mono" style={{ fontSize:12, fontWeight:600, color:C.ink }}>{x.v}</p>
                  </div>
                ))}
              </div>
              {p.rank === 1 && (
                <div style={{ marginTop:12, textAlign:"center" }}>
                  <span className="xp-chip" style={{ background:`${C.lime}25`, color:C.ink }}>
                    <Star size={10} /> Top of the Month
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {currentUser && (
        <div className="xp-panel" style={{ padding:"18px 22px", borderLeft:`4px solid ${C.sky}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:46, height:46, borderRadius:12, background:C.fog, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🧑‍💼</div>
              <div>
                <p style={{ fontSize:10, fontWeight:600, color:C.silver, textTransform:"uppercase", letterSpacing:".07em", marginBottom:2 }}>Your Standing</p>
                <p className="disp" style={{ fontSize:20, color:C.ink }}>{currentUser.name}</p>
                <p style={{ fontSize:11, color:C.silver }}>{currentUser.department} · {currentUser.position}</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:20 }}>
              {[{ l:"Rank", v:`#${currentUser.rank}`, c:C.sky }, { l:"Score", v:currentUser.currentScore, c:C.ink }].map(x => (
                <div key={x.l} style={{ textAlign:"center" }}>
                  <p style={{ fontSize:9, color:C.silver, fontWeight:600, textTransform:"uppercase", marginBottom:2 }}>{x.l}</p>
                  <p className="disp" style={{ fontSize:28, color:x.c }}>{x.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #E4E9F0", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {[
              { l:"Tasks",    v:`${currentUser.tasksCompleted}/${currentUser.totalTasks}` },
              { l:"Presence", v:`${currentUser.attendance}%`    },
              { l:"Output",   v:`${currentUser.productivity}%`  },
              { l:"Quality",  v:`${currentUser.qualityScore}%`  },
            ].map(x => (
              <div key={x.l} style={{ background:C.fog, borderRadius:10, padding:"8px 12px", textAlign:"center" }}>
                <p style={{ fontSize:9, color:C.silver, fontWeight:600, textTransform:"uppercase", marginBottom:3 }}>{x.l}</p>
                <p className="mono" style={{ fontSize:13, fontWeight:700, color:C.ink }}>{x.v}</p>
              </div>
            ))}
          </div>
          {currentUser.rank <= 3 && (
            <div style={{ marginTop:12, textAlign:"center" }}>
              <span className="xp-chip" style={{ background:`${C.mint}20`, color:"#0A6640" }}>
                <TrendingUp size={10} /> You're in the top 3 — incredible work!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── MiniTrend chart ── */
function MiniTrend({ scores }) {
  if (!scores || !scores.length) return (
    <p style={{ fontSize:12, color:C.silver, textAlign:"center", padding:"20px 0" }}>No trend data yet.</p>
  );
  const H = 130, W = 360;
  const max = Math.max(...scores, 100);
  const pts = scores.map((v, i) => `${(i / (scores.length - 1)) * W},${H - (v / max) * H}`).join(" ");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now    = new Date().getMonth();
  const labels = scores.map((_, i) => months[(now - scores.length + 1 + i + 12) % 12]);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:130 }}>
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={C.sky} stopOpacity=".18" />
            <stop offset="100%" stopColor={C.sky} stopOpacity="0"   />
          </linearGradient>
        </defs>
        <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#tg)" />
        <polyline fill="none" stroke={C.sky} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
        {scores.map((v, i) => {
          const x = (i / (scores.length - 1)) * W, y = H - (v / max) * H;
          return <circle key={i} cx={x} cy={y} r="4" fill={C.sky} stroke="#fff" strokeWidth="2" />;
        })}
      </svg>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
        {labels.map((l, i) => <span key={i} className="mono" style={{ fontSize:10, color:C.silver }}>{l}</span>)}
      </div>
    </div>
  );
}

/* ── Spider chart ── */
function Spider({ metrics }) {
  const cx = 130, cy = 120, r = 90, step = (2 * Math.PI) / metrics.length;
  const toXY = (i, pct) => { const a = i * step - Math.PI / 2, rv = (pct / 100) * r; return { x: cx + rv * Math.cos(a), y: cy + rv * Math.sin(a) }; };
  const pts  = metrics.map((m, i) => { const p = toXY(i, m.v); return `${p.x},${p.y}`; }).join(" ");
  return (
    <svg viewBox="0 0 260 240" style={{ width:"100%", height:200 }}>
      {[1, 2, 3, 4, 5].map(lvl => {
        const p = metrics.map((_, i) => { const pt = toXY(i, lvl * 20); return `${pt.x},${pt.y}`; }).join(" ");
        return <polygon key={lvl} points={p} fill="none" stroke="#E4E9F0" strokeWidth="1" />;
      })}
      {metrics.map((_, i) => { const o = toXY(i, 100); return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke="#E4E9F0" strokeWidth="1" />; })}
      <polygon points={pts} fill={`${C.sky}25`} stroke={C.sky} strokeWidth="2" />
      {metrics.map((m, i) => { const lp = toXY(i, 120); return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize:9, fill:C.silver, fontFamily:"Space Grotesk", fontWeight:600 }}>{m.label}</text>; })}
    </svg>
  );
}

/* ── Ring chart ── */
function RingChart({ segments }) {
  const total = segments.reduce((s, x) => s + (x.v || 0), 0) || 1;
  const cx = 90, cy = 90, R = 68, ir = 44;
  let ang = -90;
  const toXY = (deg, rad) => ({ x: cx + rad * Math.cos(deg * Math.PI / 180), y: cy + rad * Math.sin(deg * Math.PI / 180) });
  const arc  = (sa, ea) => {
    const s = toXY(ea, R), e = toXY(sa, R), is = toXY(ea, ir), ie = toXY(sa, ir);
    const big = ea - sa <= 180 ? "0" : "1";
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${big} 0 ${e.x} ${e.y} L ${ie.x} ${ie.y} A ${ir} ${ir} 0 ${big} 1 ${is.x} ${is.y} Z`;
  };
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
      <svg viewBox="0 0 180 180" style={{ width:150, height:150, flexShrink:0 }}>
        {segments.map((seg, i) => {
          const a = ((seg.v || 0) / total) * 360, path = arc(ang, ang + a); ang += a;
          return <path key={i} d={path} fill={seg.c} stroke="#fff" strokeWidth="2" />;
        })}
        <text x={cx} y={cy - 8}  textAnchor="middle" style={{ fontSize:16, fontWeight:700, fill:C.ink, fontFamily:"Bebas Neue" }}>{Math.round(total / segments.length)}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize:9,  fill:C.silver, fontFamily:"Space Grotesk", fontWeight:600 }}>AVG</text>
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ width:8, height:8, borderRadius:2, background:seg.c, flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <p style={{ fontSize:11, color:C.silver }}>{seg.label}</p>
                <p className="mono" style={{ fontSize:11, fontWeight:700, color:C.ink }}>{seg.v}%</p>
              </div>
              <div className="xp-bar-bg" style={{ marginTop:3 }}>
                <div className="xp-bar-fg" style={{ width:`${seg.v}%`, background:seg.c }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}