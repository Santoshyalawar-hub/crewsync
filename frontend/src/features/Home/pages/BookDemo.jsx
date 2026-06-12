// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { API_BASE_URL } from "@/lib/apiClient";


// /* ══════════════════════════════════════════
//    ANIMATION COMPONENTS (left panel only)
// ══════════════════════════════════════════ */

// /* Particle + mesh canvas */
// function AnimatedBg() {
//   const canvasRef = useRef(null);
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
//     resize();
//     window.addEventListener("resize", resize);
//     const ctx = canvas.getContext("2d");

//     const PARTICLE_COUNT = 38;
//     const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
//       x:  Math.random() * canvas.width,
//       y:  Math.random() * canvas.height,
//       r:  1 + Math.random() * 2,
//       dx: (Math.random() - 0.5) * 0.35,
//       dy: (Math.random() - 0.5) * 0.35,
//       color: Math.random() > 0.5 ? "#8B5CF6" : "#06B6D4",
//       alpha: 0.25 + Math.random() * 0.45,
//     }));

//     const orbs = [
//       { x: 0.2, y: 0.3, r: 90, color: "#8B5CF6", dx: 0.18, dy: 0.12 },
//       { x: 0.8, y: 0.6, r: 70, color: "#06B6D4", dx: -0.14, dy: 0.16 },
//       { x: 0.5, y: 0.85,r: 60, color: "#818cf8", dx: 0.10, dy: -0.18 },
//     ].map(o => ({ ...o, x: o.x * canvas.width, y: o.y * canvas.height }));

//     let raf;
//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // soft orbs
//       orbs.forEach(o => {
//         o.x += o.dx; o.y += o.dy;
//         if (o.x < -o.r || o.x > canvas.width  + o.r) o.dx *= -1;
//         if (o.y < -o.r || o.y > canvas.height + o.r) o.dy *= -1;
//         const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
//         g.addColorStop(0, o.color + "40");
//         g.addColorStop(1, "transparent");
//         ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
//         ctx.fillStyle = g; ctx.fill();
//       });

//       // particles + connecting lines
//       particles.forEach(p => {
//         p.x += p.dx; p.y += p.dy;
//         if (p.x < 0) p.x = canvas.width;
//         if (p.x > canvas.width)  p.x = 0;
//         if (p.y < 0) p.y = canvas.height;
//         if (p.y > canvas.height) p.y = 0;
//         ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2,"0");
//         ctx.fill();
//       });

//       // draw lines between close particles
//       for (let i = 0; i < particles.length; i++) {
//         for (let j = i + 1; j < particles.length; j++) {
//           const dx = particles[i].x - particles[j].x;
//           const dy = particles[i].y - particles[j].y;
//           const dist = Math.sqrt(dx*dx + dy*dy);
//           if (dist < 70) {
//             ctx.beginPath();
//             ctx.moveTo(particles[i].x, particles[i].y);
//             ctx.lineTo(particles[j].x, particles[j].y);
//             ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist/70)})`;
//             ctx.lineWidth = 0.6;
//             ctx.stroke();
//           }
//         }
//       }
//       raf = requestAnimationFrame(draw);
//     };
//     draw();
//     return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
//   }, []);
//   return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
// }

// /* Rotating typewriter word */
// const WORDS = ["Payouts", "Presence", "Time Aways", "Joiner Flow", "Signals", "Assurance"];
// function RotatingWord() {
//   const [idx, setIdx]         = useState(0);
//   const [visible, setVisible] = useState(true);
//   useEffect(() => {
//     const id = setInterval(() => {
//       setVisible(false);
//       setTimeout(() => { setIdx(i => (i + 1) % WORDS.length); setVisible(true); }, 300);
//     }, 2200);
//     return () => clearInterval(id);
//   }, []);
//   return (
//     <span style={{
//       background: "linear-gradient(90deg,#8B5CF6,#ff9a6c)",
//       WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//       display: "inline-block",
//       transition: "opacity .3s cubic-bezier(.4,0,.2,1), transform .3s cubic-bezier(.4,0,.2,1)",
//       opacity: visible ? 1 : 0,
//       transform: visible ? "translateY(0) scale(1)" : "translateY(-12px) scale(.92)",
//     }}>
//       {WORDS[idx]}
//     </span>
//   );
// }

// /* Glowing orbit with icon planets */
// function OrbitGraphic() {
//   const icons1 = ["💸","📊","🔐","📱"];
//   const icons2 = ["⏱️","🏖️","👥","🎯"];
//   return (
//     <div style={{ position:"relative", width:230, height:230 }}>

//       {/* glow layers */}
//       <div style={{ position:"absolute", top:"50%", left:"50%", width:100, height:100, marginLeft:-50, marginTop:-50, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.35) 0%,transparent 70%)", animation:"pulse-glow 2.8s ease-in-out infinite" }} />
//       <div style={{ position:"absolute", top:"50%", left:"50%", width:60, height:60, marginLeft:-30, marginTop:-30, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.5) 0%,transparent 70%)", animation:"pulse-glow 2.8s ease-in-out infinite .4s" }} />

//       {/* center */}
//       <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:54, height:54, borderRadius:16, background:"linear-gradient(135deg,#8B5CF6,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:5, boxShadow:"0 0 0 6px rgba(139,92,246,.15), 0 0 40px rgba(139,92,246,.4)" }}>
//         <span style={{ fontSize:24 }}>⚡</span>
//       </div>

//       {/* ring 1 */}
//       <div style={{ position:"absolute", top:"50%", left:"50%", width:126, height:126, marginLeft:-63, marginTop:-63, borderRadius:"50%", border:"1.5px solid rgba(139,92,246,.25)", boxShadow:"0 0 20px rgba(139,92,246,.08) inset", animation:"spin-cw 10s linear infinite" }}>
//         {icons1.map((ic, i) => {
//           const deg = i * 90;
//           return (
//             <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:30, height:30, marginLeft:-15, marginTop:-15, borderRadius:"50%", background:`linear-gradient(135deg,${["#8B5CF6","#06B6D4","#818cf8","#34d399"][i]},${["#ff9a6c","#0D9488","#a5b4fc","#6ee7b7"][i]})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, boxShadow:`0 0 16px ${["rgba(139,92,246,.6)","rgba(6,182,212,.6)","rgba(129,140,248,.6)","rgba(52,211,153,.6)"][i]}`, transform:`rotate(${deg}deg) translateX(62px) rotate(-${deg}deg)` }}>
//               {ic}
//             </div>
//           );
//         })}
//       </div>

//       {/* ring 2 */}
//       <div style={{ position:"absolute", top:"50%", left:"50%", width:200, height:200, marginLeft:-100, marginTop:-100, borderRadius:"50%", border:"1px dashed rgba(6,182,212,.2)", animation:"spin-ccw 16s linear infinite" }}>
//         {icons2.map((ic, i) => {
//           const deg = 45 + i * 90;
//           return (
//             <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:24, height:24, marginLeft:-12, marginTop:-12, borderRadius:"50%", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.18)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, transform:`rotate(${deg}deg) translateX(99px) rotate(-${deg}deg)` }}>
//               {ic}
//             </div>
//           );
//         })}
//       </div>

//       {/* ring 3 — thin shimmer */}
//       <div style={{ position:"absolute", top:"50%", left:"50%", width:166, height:166, marginLeft:-83, marginTop:-83, borderRadius:"50%", border:"1px solid rgba(255,255,255,.05)", animation:"spin-cw 22s linear infinite" }} />
//     </div>
//   );
// }

// /* Animated counter */
// function Counter({ to, suffix = "" }) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     let n = 0;
//     const step = Math.max(1, Math.ceil(to / 50));
//     const id = setInterval(() => { n = Math.min(n + step, to); setVal(n); if (n >= to) clearInterval(id); }, 28);
//     return () => clearInterval(id);
//   }, [to]);
//   return <>{val}{suffix}</>;
// }

// /* ══════════════════════════════════════════
//    MAIN PAGE
// ══════════════════════════════════════════ */
// export default function BookDemoPage() {

//   /* ── same state & logic, untouched ── */
//   const [formData, setFormData] = useState({
//     fullName: "", workEmail: "", password: "",
//     phoneCountryCode: "IN +91", phoneNumber: "",
//     companyName: "", role: "",
//   });
//   const [errors,       setErrors]       = useState({});
//   const [submitting,   setSubmitting]   = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(p => ({ ...p, [name]: value }));
//     setErrors(p => ({ ...p, [name]: "" }));
//     setSubmitStatus({ type: null, message: "" });
//   };

//   const validate = () => {
//     const e = {};
//     if (!formData.fullName.trim())    e.fullName    = "Full name is required";
//     if (!formData.workEmail.trim())   e.workEmail   = "Work email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) e.workEmail = "Enter a valid email address";
//     if (!formData.password?.trim())   e.password    = "Password is required";
//     else if (formData.password.length < 6) e.password = "Password must be at least 6 characters";
//     if (!formData.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
//     else if (!/^\d{7,15}$/.test(formData.phoneNumber.replace(/\s+/g,""))) e.phoneNumber = "Enter a valid phone number (7–15 digits)";
//     if (!formData.companyName.trim()) e.companyName = "Workspace name is required";
//     if (!formData.role || formData.role === "Select Role") e.role = "Please select your role";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitStatus({ type: null, message: "" });
//     if (!validate()) return;
//     setSubmitting(true);
//     try {
//       const payload = {
//         fullName:     formData.fullName.trim(),
//         companyEmail: formData.workEmail.trim(),
//         password:     formData.password.trim(),
//         phoneNumber:  `${formData.phoneCountryCode} ${formData.phoneNumber}`.trim(),
//         companyName:  formData.companyName.trim(),
//         designation:  formData.role,
//       };
//       const endpoint = API_BASE_URL
//         ? `${API_BASE_URL.replace(/\/+$/,"")}/api/company/demo-register`
//         : "/api/company/demo-register";
//       console.log("Sending to endpoint:", endpoint);
//       console.log("Payload:", payload);
//       const res = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
//       const ct = res.headers.get("content-type");
//       let data = {};
//       if (ct?.includes("application/json")) data = await res.json().catch(() => ({}));
//       else { const t = await res.text().catch(() => ""); data = t ? { message: t } : {}; }
//       if (!res.ok) throw new Error(data.message || "Failed to submit demo request. Please try again.");
//       setSubmitStatus({ type:"success", message: data.message || "Your demo request has been submitted. Our team will reach out shortly." });
//       setFormData({ fullName:"", workEmail:"", password:"", phoneCountryCode:"IN +91", phoneNumber:"", companyName:"", role:"" });
//       setErrors({});
//     } catch (err) {
//       setSubmitStatus({ type:"error", message: err.message || "Something went wrong while submitting the form. Please try again." });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div style={{ minHeight:"100vh", background:"#F6F8FB" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
//         *, *::before, *::after { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
//         .sora { font-family:'Sora',sans-serif !important; }

//         @keyframes spin-cw   { to { transform: rotate(360deg);  } }
//         @keyframes spin-ccw  { to { transform: rotate(-360deg); } }
//         @keyframes float-up  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
//         @keyframes ping-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(2)} }
//         @keyframes pulse-glow{ 0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.3;transform:translate(-50%,-50%) scale(1.3)} }
//         @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }

//         .bk-input {
//           width:100%; border:1.5px solid #e5e7eb; border-radius:12px;
//           padding:11px 14px; font-size:14px; color:#0B1020; outline:none;
//           transition:border-color .2s, box-shadow .2s; background:#fff;
//         }
//         .bk-input:focus { border-color:#8B5CF6; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
//         .bk-input.err   { border-color:#f87171; }
//         .bk-input::placeholder { color:#9ca3af; }
//         select.bk-input { cursor:pointer; }

//         .cta-btn {
//           width:100%;
//           background: linear-gradient(135deg,#8B5CF6 0%,#06B6D4 50%,#38BDF8 100%);
//           background-size: 200% auto;
//           color:#fff; font-weight:800; font-size:15px; padding:14px;
//           border-radius:14px; border:none; cursor:pointer;
//           box-shadow:0 4px 24px rgba(139,92,246,.4);
//           transition:transform .22s, box-shadow .22s, background-position .4s;
//           letter-spacing:.03em;
//         }
//         .cta-btn:hover   { transform:translateY(-2px); box-shadow:0 10px 32px rgba(139,92,246,.5); background-position:right center; }
//         .cta-btn:disabled{ opacity:.65; cursor:not-allowed; transform:none; }

//         .stat-card {
//           background:rgba(255,255,255,.07);
//           border:1px solid rgba(255,255,255,.1);
//           border-radius:14px; padding:11px 14px;
//           display:flex; align-items:center; gap:10px;
//           transition: background .3s;
//         }
//         .stat-card:hover { background:rgba(255,255,255,.12); }
//       `}</style>

//       {/* ── Navbar ── */}
//       <header style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 10px rgba(0,0,0,.05)" }}>
//         <nav style={{ maxWidth:1120, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//           <Link to="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none" }}>
//             <div className="sora" style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#8B5CF6,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:15 }}>S</div>
//             <span className="sora" style={{ fontWeight:900, fontSize:20, color:"#0B1020" }}>CrewSync<span style={{ color:"#8B5CF6" }}>People Studio</span></span>
//           </Link>
//           <Link to="/"
//             style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"#6b7280", textDecoration:"none", padding:"7px 16px", borderRadius:10, border:"1.5px solid #e5e7eb", transition:"all .2s" }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor="#8B5CF6"; e.currentTarget.style.color="#8B5CF6"; }}
//             onMouseTime Away={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.color="#6b7280"; }}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
//             </svg>
//             Back to Home
//           </Link>
//         </nav>
//       </header>

//       {/* ── Main ── */}
//       <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px 64px" }}>
//         <div style={{ display:"flex", borderRadius:28, overflow:"hidden", boxShadow:"0 20px 70px rgba(13,31,45,.15)" }}>

//           {/* ══ LEFT: pure visual ══ */}
//           <div style={{ width:"42%", flexShrink:0, background:"linear-gradient(150deg,#0b1a28 0%,#0f2840 60%,#0B1020 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 32px", gap:28 }}>

//             <AnimatedBg />

//             {/* badge */}
//             <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:12, textAlign:"center" }}>
//               <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(139,92,246,.14)", border:"1px solid rgba(139,92,246,.3)", borderRadius:999, padding:"5px 16px" }}>
//                 <span style={{ width:7, height:7, borderRadius:"50%", background:"#8B5CF6", display:"inline-block", animation:"ping-dot 1.8s ease-in-out infinite" }} />
//                 <span style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:"#8B5CF6", textTransform:"uppercase" }}>Free · 30 min Demo</span>
//               </div>

//               <h2 className="sora" style={{ fontSize:"clamp(1.55rem,2.6vw,2.05rem)", fontWeight:900, color:"#fff", lineHeight:1.2, margin:0 }}>
//                 Automate your<br/>
//                 <RotatingWord />
//               </h2>

//               <p style={{ fontSize:13, color:"#6b7280", margin:0 }}>One platform · Zero complexity</p>
//             </div>

//             {/* orbit */}
//             <div style={{ position:"relative", zIndex:2, animation:"float-up 4.5s ease-in-out infinite" }}>
//               <OrbitGraphic />
//             </div>

//             {/* stat counters */}
//             {/* <div style={{ position:"relative", zIndex:2, display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, width:"100%" }}>
//               {[
//                 { icon:"🏢", to:500,  suffix:"+",   label:"Workspaces"  },
//                 { icon:"👥", to:12,   suffix:"k+",  label:"Persons"  },
//                 { icon:"⚡", to:98,   suffix:"%",   label:"Accuracy"   },
//                 { icon:"🕐", to:5,    suffix:"min", label:"Avg Setup"  },
//               ].map(s => (
//                 <div key={s.label} className="stat-card">
//                   <span style={{ fontSize:20 }}>{s.icon}</span>
//                   <div>
//                     <div className="sora" style={{ fontSize:15, fontWeight:900, color:"#fff" }}>
//                       <Counter to={s.to} suffix={s.suffix} />
//                     </div>
//                     <div style={{ fontSize:10, color:"#6b7280" }}>{s.label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div> */}

//             {/* testimonial */}
//             {/* <div style={{ position:"relative", zIndex:2, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:16, padding:"14px 18px", width:"100%", backdropFilter:"blur(6px)" }}>
//               <div style={{ display:"flex", gap:2, marginBottom:7 }}>
//                 {[...Array(5)].map((_,i) => (
//                   <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#8B5CF6"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
//                 ))}
//               </div>
//               <p style={{ fontSize:12, color:"#d1d5db", margin:"0 0 10px", lineHeight:1.65, fontStyle:"italic" }}>
//                 "Joiner Flow took 5 minutes. Payouts runs itself now."
//               </p>
//               <div style={{ display:"flex", alignItems:"center", gap:9 }}>
//                 <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#8B5CF6,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", flexShrink:0, boxShadow:"0 0 10px rgba(139,92,246,.4)" }}>R</div>
//                 <div>
//                   <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>Rohit M.</div>
//                   <div style={{ fontSize:10, color:"#6b7280" }}>People Studio Director, NexaTech</div>
//                 </div>
//               </div>
//             </div> */}
//           </div>

//           {/* ══ RIGHT: form (untouched) ══ */}
//           <div style={{ flex:1, background:"#fff", padding:"44px 40px", overflowY:"auto" }}>
//             <div style={{ marginBottom:22 }}>
//               <h3 className="sora" style={{ fontSize:22, fontWeight:900, color:"#0B1020", margin:"0 0 5px" }}>Get started today</h3>
//               <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>Takes 2 minutes · We confirm your slot within 24 hrs</p>
//             </div>

//             {submitStatus.type && (
//               <div style={{
//                 marginBottom:18, padding:"12px 16px", borderRadius:12, fontSize:14, fontWeight:500,
//                 background: submitStatus.type === "success" ? "rgba(6,182,212,.08)" : "rgba(239,68,68,.08)",
//                 border: `1.5px solid ${submitStatus.type === "success" ? "rgba(6,182,212,.3)" : "rgba(239,68,68,.3)"}`,
//                 color: submitStatus.type === "success" ? "#0D9488" : "#dc2626",
//               }}>{submitStatus.message}</div>
//             )}

//             <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:18 }}>

//               <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
//                 <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
//                   <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Your Name <span style={{ color:"#8B5CF6" }}>*</span></label>
//                   <input type="text" name="fullName" placeholder="e.g. Rahul Sharma"
//                     value={formData.fullName} onChange={handleChange}
//                     className={`bk-input${errors.fullName ? " err" : ""}`} />
//                   {errors.fullName && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.fullName}</p>}
//                 </div>
//                 <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
//                   <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Business Email <span style={{ color:"#8B5CF6" }}>*</span></label>
//                   <input type="email" name="workEmail" placeholder="you@yourcompany.com"
//                     value={formData.workEmail} onChange={handleChange}
//                     className={`bk-input${errors.workEmail ? " err" : ""}`} />
//                   {errors.workEmail && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.workEmail}</p>}
//                 </div>
//               </div>

//               {/* <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
//                 <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Create a Password <span style={{ color:"#8B5CF6" }}>*</span></label>
//                 <input type="password" name="password" placeholder="Minimum 6 characters"
//                   value={formData.password} onChange={handleChange}
//                   className={`bk-input${errors.password ? " err" : ""}`} />
//                 {errors.password && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.password}</p>}
//               </div> */}
//                 <div style={{ display:"none" }}>
//                  <input type="password" name="password" value="12345678" readOnly/>
//                 </div>

//               <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
//                 <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Pocket Number <span style={{ color:"#8B5CF6" }}>*</span></label>
//                 <div style={{ display:"flex" }}>
//                   <select name="phoneCountryCode" value={formData.phoneCountryCode} onChange={handleChange}
//                     style={{ border:"1.5px solid #e5e7eb", borderRight:"none", borderRadius:"12px 0 0 12px", padding:"11px 10px", background:"#f9fafb", fontSize:13, color:"#0B1020", outline:"none", flexShrink:0, width:94 }}>
//                     <option>IN +91</option>
//                     <option>US +1</option>
//                     <option>UK +44</option>
//                     <option>AE +971</option>
//                   </select>
//                   <input type="tel" name="phoneNumber" placeholder="98765 43210"
//                     value={formData.phoneNumber} onChange={handleChange}
//                     className={`bk-input${errors.phoneNumber ? " err" : ""}`}
//                     style={{ borderRadius:"0 12px 12px 0", borderLeft:"none" }} />
//                 </div>
//                 {errors.phoneNumber && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.phoneNumber}</p>}
//               </div>

//               <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
//                 <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
//                   <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Organisation <span style={{ color:"#8B5CF6" }}>*</span></label>
//                   <input type="text" name="companyName" placeholder="Your company name"
//                     value={formData.companyName} onChange={handleChange}
//                     className={`bk-input${errors.companyName ? " err" : ""}`} />
//                   {errors.companyName && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.companyName}</p>}
//                 </div>
//                 <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
//                   <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>I Am A… <span style={{ color:"#8B5CF6" }}>*</span></label>
//                   <select name="role" value={formData.role} onChange={handleChange}
//                     className={`bk-input${errors.role ? " err" : ""}`}>
//                     <option value="">Who best describes you?</option>
//                     <option value="People Studio Manager / Director">People &amp; Culture Lead</option>
//                     <option value="Founder / CEO">Business Owner / Co-Founder</option>
//                     <option value="Money Desk / Operator">Money Desk &amp; Accounts Head</option>
//                     <option value="IT / Operations">Operations &amp; Tech Lead</option>
//                     <option value="Other">Exploring for My Team</option>
//                   </select>
//                   {errors.role && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.role}</p>}
//                 </div>
//               </div>

//               <div style={{ display:"flex", flexWrap:"wrap", gap:14, background:"#F6F8FB", borderRadius:14, padding:"12px 16px" }}>
//                 {[["🔒","Secure & Private"],["🆓","No Credit Card"],["⚡","Response in 24h"]].map(([ic,tx]) => (
//                   <div key={tx} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#6b7280", fontWeight:500 }}>
//                     <span>{ic}</span>{tx}
//                   </div>
//                 ))}
//               </div>

//               <button type="submit" disabled={submitting} className="cta-btn">
//                 {submitting ? "Submitting…" : "Request My Free Demo →"}
//               </button>

//               <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center", margin:"-4px 0 0" }}>
//                 No spam, ever. By submitting you agree to our{" "}
//                 <Link to="/privacy" style={{ color:"#8B5CF6", textDecoration:"none" }}>Privacy Playbook</Link>.
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/lib/apiClient";


/* ══════════════════════════════════════════
   ANIMATION COMPONENTS (left panel only)
══════════════════════════════════════════ */

/* Particle + mesh canvas */
function AnimatedBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d");

    const PARTICLE_COUNT = 38;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  1 + Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      color: Math.random() > 0.5 ? "#8B5CF6" : "#06B6D4",
      alpha: 0.25 + Math.random() * 0.45,
    }));

    const orbs = [
      { x: 0.2, y: 0.3, r: 90, color: "#8B5CF6", dx: 0.18, dy: 0.12 },
      { x: 0.8, y: 0.6, r: 70, color: "#06B6D4", dx: -0.14, dy: 0.16 },
      { x: 0.5, y: 0.85,r: 60, color: "#818cf8", dx: 0.10, dy: -0.18 },
    ].map(o => ({ ...o, x: o.x * canvas.width, y: o.y * canvas.height }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // soft orbs
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy;
        if (o.x < -o.r || o.x > canvas.width  + o.r) o.dx *= -1;
        if (o.y < -o.r || o.y > canvas.height + o.r) o.dy *= -1;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.color + "40");
        g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      // particles + connecting lines
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2,"0");
        ctx.fill();
      });

      // draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 70) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist/70)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

/* Rotating typewriter word */
const WORDS = ["Payouts", "Presence", "Time Aways", "Joiner Flow", "Signals", "Assurance"];
function RotatingWord() {
  const [idx, setIdx]         = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % WORDS.length); setVisible(true); }, 300);
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{
      background: "linear-gradient(90deg,#8B5CF6,#ff9a6c)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      display: "inline-block",
      transition: "opacity .3s cubic-bezier(.4,0,.2,1), transform .3s cubic-bezier(.4,0,.2,1)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(-12px) scale(.92)",
    }}>
      {WORDS[idx]}
    </span>
  );
}

/* Glowing orbit with icon planets */
function OrbitGraphic() {
  const icons1 = ["💸","📊","🔐","📱"];
  const icons2 = ["⏱️","🏖️","👥","🎯"];
  return (
    <div style={{ position:"relative", width:230, height:230 }}>

      {/* glow layers */}
      <div style={{ position:"absolute", top:"50%", left:"50%", width:100, height:100, marginLeft:-50, marginTop:-50, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.35) 0%,transparent 70%)", animation:"pulse-glow 2.8s ease-in-out infinite" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", width:60, height:60, marginLeft:-30, marginTop:-30, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.5) 0%,transparent 70%)", animation:"pulse-glow 2.8s ease-in-out infinite .4s" }} />

      {/* center */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:54, height:54, borderRadius:16, background:"linear-gradient(135deg,#8B5CF6,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:5, boxShadow:"0 0 0 6px rgba(139,92,246,.15), 0 0 40px rgba(139,92,246,.4)" }}>
        <span style={{ fontSize:24 }}>⚡</span>
      </div>

      {/* ring 1 */}
      <div style={{ position:"absolute", top:"50%", left:"50%", width:126, height:126, marginLeft:-63, marginTop:-63, borderRadius:"50%", border:"1.5px solid rgba(139,92,246,.25)", boxShadow:"0 0 20px rgba(139,92,246,.08) inset", animation:"spin-cw 10s linear infinite" }}>
        {icons1.map((ic, i) => {
          const deg = i * 90;
          return (
            <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:30, height:30, marginLeft:-15, marginTop:-15, borderRadius:"50%", background:`linear-gradient(135deg,${["#8B5CF6","#06B6D4","#818cf8","#34d399"][i]},${["#ff9a6c","#0D9488","#a5b4fc","#6ee7b7"][i]})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, boxShadow:`0 0 16px ${["rgba(139,92,246,.6)","rgba(6,182,212,.6)","rgba(129,140,248,.6)","rgba(52,211,153,.6)"][i]}`, transform:`rotate(${deg}deg) translateX(62px) rotate(-${deg}deg)` }}>
              {ic}
            </div>
          );
        })}
      </div>

      {/* ring 2 */}
      <div style={{ position:"absolute", top:"50%", left:"50%", width:200, height:200, marginLeft:-100, marginTop:-100, borderRadius:"50%", border:"1px dashed rgba(6,182,212,.2)", animation:"spin-ccw 16s linear infinite" }}>
        {icons2.map((ic, i) => {
          const deg = 45 + i * 90;
          return (
            <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:24, height:24, marginLeft:-12, marginTop:-12, borderRadius:"50%", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.18)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, transform:`rotate(${deg}deg) translateX(99px) rotate(-${deg}deg)` }}>
              {ic}
            </div>
          );
        })}
      </div>

      {/* ring 3 — thin shimmer */}
      <div style={{ position:"absolute", top:"50%", left:"50%", width:166, height:166, marginLeft:-83, marginTop:-83, borderRadius:"50%", border:"1px solid rgba(255,255,255,.05)", animation:"spin-cw 22s linear infinite" }} />
    </div>
  );
}

/* Animated counter */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.ceil(to / 50));
    const id = setInterval(() => { n = Math.min(n + step, to); setVal(n); if (n >= to) clearInterval(id); }, 28);
    return () => clearInterval(id);
  }, [to]);
  return <>{val}{suffix}</>;
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */

const DEFAULT_PASSWORD = "12345678";

export default function BookDemoPage() {

  /* ── state & logic ── */
  const [formData, setFormData] = useState({
    fullName: "", workEmail: "",
    phoneCountryCode: "IN +91", phoneNumber: "",
    companyName: "", role: "",
  });
  const [errors,       setErrors]       = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
    setSubmitStatus({ type: null, message: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim())    e.fullName    = "Full name is required";
    if (!formData.workEmail.trim())   e.workEmail   = "Work email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) e.workEmail = "Enter a valid email address";
    if (!formData.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!/^\d{7,15}$/.test(formData.phoneNumber.replace(/\s+/g,""))) e.phoneNumber = "Enter a valid phone number (7–15 digits)";
    if (!formData.companyName.trim()) e.companyName = "Workspace name is required";
    if (!formData.role || formData.role === "Select Role") e.role = "Please select your role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        fullName:     formData.fullName.trim(),
        companyEmail: formData.workEmail.trim(),
        password:     DEFAULT_PASSWORD,
        phoneNumber:  `${formData.phoneCountryCode} ${formData.phoneNumber}`.trim(),
        companyName:  formData.companyName.trim(),
        designation:  formData.role,
      };
      const endpoint = API_BASE_URL
        ? `${API_BASE_URL.replace(/\/+$/,"")}/api/company/demo-register`
        : "/api/company/demo-register";
      console.log("Sending to endpoint:", endpoint);
      console.log("Payload:", payload);
      const res = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      const ct = res.headers.get("content-type");
      let data = {};
      if (ct?.includes("application/json")) data = await res.json().catch(() => ({}));
      else { const t = await res.text().catch(() => ""); data = t ? { message: t } : {}; }
      if (!res.ok) throw new Error(data.message || "Failed to submit demo request. Please try again.");
      setSubmitStatus({ type:"success", message: data.message || "Your demo request has been submitted. Our team will reach out shortly." });
      setFormData({ fullName:"", workEmail:"", phoneCountryCode:"IN +91", phoneNumber:"", companyName:"", role:"" });
      setErrors({});
    } catch (err) {
      setSubmitStatus({ type:"error", message: err.message || "Something went wrong while submitting the form. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F6F8FB" }}>
      <style>{`
        @import url('[fonts.googleapis.com](https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap)');
        *, *::before, *::after { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
        .sora { font-family:'Sora',sans-serif !important; }

        @keyframes spin-cw   { to { transform: rotate(360deg);  } }
        @keyframes spin-ccw  { to { transform: rotate(-360deg); } }
        @keyframes float-up  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes ping-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(2)} }
        @keyframes pulse-glow{ 0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.3;transform:translate(-50%,-50%) scale(1.3)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .bk-input {
          width:100%; border:1.5px solid #e5e7eb; border-radius:12px;
          padding:11px 14px; font-size:14px; color:#0B1020; outline:none;
          transition:border-color .2s, box-shadow .2s; background:#fff;
        }
        .bk-input:focus { border-color:#8B5CF6; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
        .bk-input.err   { border-color:#f87171; }
        .bk-input::placeholder { color:#9ca3af; }
        select.bk-input { cursor:pointer; }

        .cta-btn {
          width:100%;
          background: linear-gradient(135deg,#8B5CF6 0%,#06B6D4 50%,#38BDF8 100%);
          background-size: 200% auto;
          color:#fff; font-weight:800; font-size:15px; padding:14px;
          border-radius:14px; border:none; cursor:pointer;
          box-shadow:0 4px 24px rgba(139,92,246,.4);
          transition:transform .22s, box-shadow .22s, background-position .4s;
          letter-spacing:.03em;
        }
        .cta-btn:hover   { transform:translateY(-2px); box-shadow:0 10px 32px rgba(139,92,246,.5); background-position:right center; }
        .cta-btn:disabled{ opacity:.65; cursor:not-allowed; transform:none; }

        .stat-card {
          background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.1);
          border-radius:14px; padding:11px 14px;
          display:flex; align-items:center; gap:10px;
          transition: background .3s;
        }
        .stat-card:hover { background:rgba(255,255,255,.12); }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 10px rgba(0,0,0,.05)" }}>
        <nav style={{ maxWidth:1120, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link to="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none" }}>
            <div className="sora" style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#8B5CF6,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:15 }}>S</div>
            <span className="sora" style={{ fontWeight:900, fontSize:20, color:"#0B1020" }}>CrewSync<span style={{ color:"#8B5CF6" }}>People Studio</span></span>
          </Link>
          <Link to="/"
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"#6b7280", textDecoration:"none", padding:"7px 16px", borderRadius:10, border:"1.5px solid #e5e7eb", transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#8B5CF6"; e.currentTarget.style.color="#8B5CF6"; }}
            onMouseTime Away={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.color="#6b7280"; }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </Link>
        </nav>
      </header>

      {/* ── Main ── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px 64px" }}>
        <div style={{ display:"flex", borderRadius:28, overflow:"hidden", boxShadow:"0 20px 70px rgba(13,31,45,.15)" }}>

          {/* ══ LEFT: pure visual ══ */}
          <div style={{ width:"42%", flexShrink:0, background:"linear-gradient(150deg,#0b1a28 0%,#0f2840 60%,#0B1020 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 32px", gap:28 }}>

            <AnimatedBg />

            {/* badge */}
            <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:12, textAlign:"center" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(139,92,246,.14)", border:"1px solid rgba(139,92,246,.3)", borderRadius:999, padding:"5px 16px" }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#8B5CF6", display:"inline-block", animation:"ping-dot 1.8s ease-in-out infinite" }} />
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:"#8B5CF6", textTransform:"uppercase" }}>Free · 30 min Demo</span>
              </div>

              <h2 className="sora" style={{ fontSize:"clamp(1.55rem,2.6vw,2.05rem)", fontWeight:900, color:"#fff", lineHeight:1.2, margin:0 }}>
                Automate your<br/>
                <RotatingWord />
              </h2>

              <p style={{ fontSize:13, color:"#6b7280", margin:0 }}>One platform · Zero complexity</p>
            </div>

            {/* orbit */}
            <div style={{ position:"relative", zIndex:2, animation:"float-up 4.5s ease-in-out infinite" }}>
              <OrbitGraphic />
            </div>
          </div>

          {/* ══ RIGHT: form ══ */}
          <div style={{ flex:1, background:"#fff", padding:"44px 40px", overflowY:"auto" }}>
            <div style={{ marginBottom:22 }}>
              <h3 className="sora" style={{ fontSize:22, fontWeight:900, color:"#0B1020", margin:"0 0 5px" }}>Get started today</h3>
              <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>Takes 2 minutes · We confirm your slot within 24 hrs</p>
            </div>

            {submitStatus.type && (
              <div style={{
                marginBottom:18, padding:"12px 16px", borderRadius:12, fontSize:14, fontWeight:500,
                background: submitStatus.type === "success" ? "rgba(6,182,212,.08)" : "rgba(239,68,68,.08)",
                border: `1.5px solid ${submitStatus.type === "success" ? "rgba(6,182,212,.3)" : "rgba(239,68,68,.3)"}`,
                color: submitStatus.type === "success" ? "#0D9488" : "#dc2626",
              }}>{submitStatus.message}</div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:18 }}>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Your Name <span style={{ color:"#8B5CF6" }}>*</span></label>
                  <input type="text" name="fullName" placeholder="e.g. Rahul Sharma"
                    value={formData.fullName} onChange={handleChange}
                    className={`bk-input${errors.fullName ? " err" : ""}`} />
                  {errors.fullName && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.fullName}</p>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Business Email <span style={{ color:"#8B5CF6" }}>*</span></label>
                  <input type="email" name="workEmail" placeholder="you@yourcompany.com"
                    value={formData.workEmail} onChange={handleChange}
                    className={`bk-input${errors.workEmail ? " err" : ""}`} />
                  {errors.workEmail && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.workEmail}</p>}
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Pocket Number <span style={{ color:"#8B5CF6" }}>*</span></label>
                <div style={{ display:"flex" }}>
                  <select name="phoneCountryCode" value={formData.phoneCountryCode} onChange={handleChange}
                    style={{ border:"1.5px solid #e5e7eb", borderRight:"none", borderRadius:"12px 0 0 12px", padding:"11px 10px", background:"#f9fafb", fontSize:13, color:"#0B1020", outline:"none", flexShrink:0, width:94 }}>
                    <option>IN +91</option>
                    <option>US +1</option>
                    <option>UK +44</option>
                    <option>AE +971</option>
                  </select>
                  <input type="tel" name="phoneNumber" placeholder="98765 43210"
                    value={formData.phoneNumber} onChange={handleChange}
                    className={`bk-input${errors.phoneNumber ? " err" : ""}`}
                    style={{ borderRadius:"0 12px 12px 0", borderLeft:"none" }} />
                </div>
                {errors.phoneNumber && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.phoneNumber}</p>}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>Organisation <span style={{ color:"#8B5CF6" }}>*</span></label>
                  <input type="text" name="companyName" placeholder="Your company name"
                    value={formData.companyName} onChange={handleChange}
                    className={`bk-input${errors.companyName ? " err" : ""}`} />
                  {errors.companyName && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.companyName}</p>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>I Am A… <span style={{ color:"#8B5CF6" }}>*</span></label>
                  <select name="role" value={formData.role} onChange={handleChange}
                    className={`bk-input${errors.role ? " err" : ""}`}>
                    <option value="">Who best describes you?</option>
                    <option value="People Studio Manager / Director">People &amp; Culture Lead</option>
                    <option value="Founder / CEO">Business Owner / Co-Founder</option>
                    <option value="Money Desk / Operator">Money Desk &amp; Accounts Head</option>
                    <option value="IT / Operations">Operations &amp; Tech Lead</option>
                    <option value="Other">Exploring for My Team</option>
                  </select>
                  {errors.role && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>{errors.role}</p>}
                </div>
              </div>

              <div style={{ display:"flex", flexWrap:"wrap", gap:14, background:"#F6F8FB", borderRadius:14, padding:"12px 16px" }}>
                {[["🔒","Secure & Private"],["🆓","No Credit Card"],["⚡","Response in 24h"]].map(([ic,tx]) => (
                  <div key={tx} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#6b7280", fontWeight:500 }}>
                    <span>{ic}</span>{tx}
                  </div>
                ))}
              </div>

              <button type="submit" disabled={submitting} className="cta-btn">
                {submitting ? "Submitting…" : "Request My Free Demo →"}
              </button>

              <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center", margin:"-4px 0 0" }}>
                No spam, ever. By submitting you agree to our{" "}
                <Link to="/privacy" style={{ color:"#8B5CF6", textDecoration:"none" }}>Privacy Playbook</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
