// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../public/assets/Zlabs-Logo.png";

// const getApiBaseUrl = () => {
//   const fromEnv =
//     import.meta.env?.VITE_API_BASE_URL &&
//     import.meta.env.VITE_API_BASE_URL.trim();
//   if (fromEnv) return fromEnv;
//   if (
//     window.location.hostname === "localhost" ||
//     window.location.hostname === "127.0.0.1"
//   ) {
//     return "http://localhost:8080";
//   }
//   return "";
// };

// const API_BASE_URL = getApiBaseUrl();

// const PARTICLES = [
//   { id: 1,  left: "8%",  bottom: "-10%", size: 5,  duration: 18, delay: 0   },
//   { id: 2,  left: "18%", bottom: "-15%", size: 7,  duration: 22, delay: 4   },
//   { id: 3,  left: "28%", bottom: "-12%", size: 4,  duration: 16, delay: 2   },
//   { id: 4,  left: "38%", bottom: "-18%", size: 6,  duration: 24, delay: 6   },
//   { id: 5,  left: "48%", bottom: "-10%", size: 3,  duration: 20, delay: 1   },
//   { id: 6,  left: "58%", bottom: "-14%", size: 8,  duration: 26, delay: 3   },
//   { id: 7,  left: "68%", bottom: "-16%", size: 5,  duration: 21, delay: 5   },
//   { id: 8,  left: "78%", bottom: "-12%", size: 4,  duration: 19, delay: 7   },
//   { id: 9,  left: "88%", bottom: "-18%", size: 6,  duration: 23, delay: 2.5 },
//   { id: 10, left: "15%", bottom: "-20%", size: 3,  duration: 27, delay: 8   },
// ];

// const FEATURES = [
//   { icon: "⚡", text: "Automated payroll in minutes" },
//   { icon: "📅", text: "Smart leave management" },
//   { icon: "🕒", text: "Real-time attendance tracking" },
//   { icon: "📊", text: "Powerful analytics & reports" },
//   { icon: "🔒", text: "Enterprise-grade security" },
//   { icon: "📱", text: "Mobile app for iOS & Android" },
// ];

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [showForm, setShowForm] = useState(false);
//   const [loginData, setLoginData] = useState({ email: "", password: "", companyKey: "" });
//   const [activeTab, setActiveTab] = useState("employee");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleLoginClick = () => setShowForm(true);
//   const handleReturnHome = () => navigate("/");

//   const getLoginApi = () => {
//     const base = API_BASE_URL.replace(/\/+$/, "");
//     if (activeTab === "company") {
//       return base
//         ? `${base}/api/global-admin/companies/company-login`
//         : "/api/global-admin/companies/company-login";
//     }
//     return base ? `${base}/api/auth/login` : "/api/auth/login";
//   };

//   const getTitle = () =>
//     activeTab === "company" ? "Company Sign In" : "Employee Sign In";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const isCompany = activeTab === "company";
//     const payload = isCompany
//       ? { officialEmail: loginData.email, tenantCode: loginData.companyKey }
//       : { email: loginData.email, password: loginData.password };

//     setLoading(true);
//     try {
//       const res = await fetch(getLoginApi(), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("LOGIN RESPONSE:", data);

//       if (!res.ok || !data.success) {
//         alert("Error: " + (data?.message || "Login failed"));
//         return;
//       }

//       const token = data?.data?.token ?? null;
//       if (!token) { alert("Login succeeded but token missing"); return; }

//       localStorage.setItem("token", `Bearer ${token}`);

//       if (isCompany) {
//         localStorage.setItem("companyId", String(data?.data?.companyId || ""));
//         localStorage.setItem("companyName", data?.data?.displayName || "");
//         localStorage.setItem("tenantCode", data?.data?.tenantCode || "");
//         localStorage.setItem("userRole", "COMPANY_ADMIN");
//         window.location.href = "/super-admin/dashboard";
//       } else {
//         const userRole = data.data?.role || "EMPLOYEE";
//         const userId = data?.data?.userId || data?.data?.id;
//         const tenantCode = data.data?.tenantCode || "";
//         const companyId = data.data?.companyId || "";
//         const companyName = data.data?.companyName || "";

//         localStorage.setItem("userId", String(userId));
//         localStorage.setItem("employeeName", data.data?.fullName || data.data?.name || "");
//         localStorage.setItem("userRole", userRole);

//         if (userRole === "ADMIN" || userRole === "GLOBALADMIN") {
//           localStorage.setItem("tenantCode", tenantCode);
//           localStorage.setItem("companyId", String(companyId));
//           localStorage.setItem("companyName", companyName);
//         }

//         if (userRole === "GLOBALADMIN") window.location.href = "/global-admin/dashboard";
//         else if (userRole === "ADMIN")   window.location.href = "/admin/dashboard";
//         else                             window.location.href = "/employee/dashboard";
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Login error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

//         @keyframes particle-float-up {
//           0%   { transform: translate3d(0, 0, 0); opacity: 0; }
//           15%  { opacity: 0.8; }
//           80%  { opacity: 0.8; }
//           100% { transform: translate3d(0, -140vh, 0); opacity: 0; }
//         }
//         @keyframes scan-line {
//           0%   { top: 0%;   opacity: 0; }
//           20%  { opacity: 0.6; }
//           80%  { opacity: 0.6; }
//           100% { top: 100%; opacity: 0; }
//         }
//         @keyframes shimmer-pass {
//           0%   { transform: translateX(-150%) skewX(-12deg); }
//           100% { transform: translateX(150%)  skewX(-12deg); }
//         }
//         @keyframes pulse-ring {
//           0%,100% { transform: scale(1);   opacity: 0.75; }
//           50%     { transform: scale(1.4); opacity: 0; }
//         }
//         @keyframes float-badge {
//           0%,100% { transform: translateY(0); }
//           50%     { transform: translateY(-8px); }
//         }
//         @keyframes fade-slide-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes ticker {
//           0%   { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }

//         .particle { animation: particle-float-up var(--dur) linear infinite var(--delay); }
//         .scan-line { animation: scan-line 4s linear infinite; }
//         .shimmer   { animation: shimmer-pass 3s ease-in-out infinite; }
//         .pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
//         .badge-float { animation: float-badge 3s ease-in-out infinite; }
//         .fade-up-1 { animation: fade-slide-up .45s ease both .05s; }
//         .fade-up-2 { animation: fade-slide-up .45s ease both .15s; }
//         .fade-up-3 { animation: fade-slide-up .45s ease both .25s; }
//         .fade-up-4 { animation: fade-slide-up .45s ease both .35s; }
//         .ticker-anim { animation: ticker 22s linear infinite; }

//         .coral-btn {
//           background: linear-gradient(135deg, #FF6B35 0%, #FF5722 100%);
//           box-shadow: 0 4px 20px rgba(255,107,53,0.35);
//           transition: all .25s;
//         }
//         .coral-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 30px rgba(255,107,53,0.45);
//         }
//         .coral-btn:disabled {
//           opacity: .7;
//           transform: none;
//           cursor: not-allowed;
//         }

//         .input-field {
//           width: 100%;
//           border: 1.5px solid #E5E7EB;
//           border-radius: 12px;
//           background: #FAFAFA;
//           padding: 11px 14px;
//           font-size: 14px;
//           color: #0D1F2D;
//           outline: none;
//           transition: border-color .2s, background .2s, box-shadow .2s;
//         }
//         .input-field:focus {
//           border-color: #FF6B35;
//           background: #fff;
//           box-shadow: 0 0 0 3px rgba(255,107,53,0.10);
//         }
//         .input-field::placeholder { color: #9CA3AF; }

//         .tab-active {
//           color: #FF6B35;
//           border-bottom: 2.5px solid #FF6B35;
//         }
//         .tab-inactive {
//           color: #9CA3AF;
//           border-bottom: 2.5px solid transparent;
//         }
//         .tab-inactive:hover { color: #0D1F2D; }

//         .ticker-mask {
//           mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
//           -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
//         }
//       `}</style>

//       {/* ══════════════════════════════════════════
//           LEFT PANEL — dark ocean with particles
//       ══════════════════════════════════════════ */}
//       <div className="hidden md:flex md:w-[40%] lg:w-[42%] relative overflow-hidden text-white flex-col">

//         {/* Background */}
//         <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0D1F2D 40%, #111d33 100%)' }} />

//         {/* Orbs */}
//         <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: '#FF6B35' }} />
//         <div className="absolute top-1/2 -right-16 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: '#00C2A8' }} />
//         <div className="absolute bottom-[-60px] left-16 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: '#FF6B35' }} />

//         {/* Grid overlay */}
//         <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
//           backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
//           backgroundSize: '48px 48px'
//         }} />

//         {/* Floating particles */}
//         {PARTICLES.map((p) => (
//           <span
//             key={p.id}
//             className="absolute rounded-full particle"
//             style={{
//               left: p.left,
//               bottom: p.bottom,
//               width: `${p.size}px`,
//               height: `${p.size}px`,
//               '--dur': `${p.duration}s`,
//               '--delay': `${p.delay}s`,
//               background: 'rgba(255,107,53,0.6)',
//               boxShadow: '0 0 12px rgba(255,107,53,0.5)',
//             }}
//           />
//         ))}

//         {/* Content */}
//         <div className="relative z-10 flex flex-col px-10 py-10 h-full">

//           {/* Logo box */}
//           <div className="flex items-center gap-4 mb-auto">
//             <div className="relative group">
//               <div className="absolute -inset-1.5 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" style={{ background: '#FF6B35' }} />
//               <div className="relative w-[72px] h-[72px] bg-white rounded-2xl shadow-2xl border border-white/10 flex items-center justify-center overflow-hidden">
//                 {/* scan line */}
//                 <div className="absolute inset-0 pointer-events-none z-20">
//                   <div className="scan-line absolute left-0 w-full h-[2px]"
//                     style={{ background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)', opacity: .5 }} />
//                 </div>
//                 {/* shimmer */}
//                 <div className="absolute inset-0 pointer-events-none overflow-hidden">
//                   <div className="shimmer absolute top-0 left-0 w-1/2 h-full"
//                     style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }} />
//                 </div>
//                 <img src={logo} alt="SamayaHR" className="relative z-10 h-12 w-12 object-contain group-hover:scale-105 transition-transform duration-500" />
//                 {/* corner accents */}
//                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: '#FF6B35' }} />
//                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: '#00C2A8' }} />
//               </div>
//             </div>
//             <div>
//               <p className="font-black text-xl tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
//                 Samaya<span style={{ color: '#FF6B35' }}>HR</span>
//               </p>
//               <p className="text-xs text-gray-500 font-medium mt-0.5">Your Trusted HR Companion</p>
//             </div>
//           </div>

//           {/* Center: headline + features */}
//           <div className="flex-1 flex flex-col justify-center py-10">
//             <div className="fade-up-1">
//               <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6"
//                 style={{ background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.25)', color: '#FF6B35' }}>
//                 <span className="relative flex h-1.5 w-1.5">
//                   <span className="pulse-ring absolute inline-flex h-full w-full rounded-full" style={{ background: '#FF6B35' }} />
//                   <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#FF6B35' }} />
//                 </span>
//                 Trusted by 1000+ companies
//               </div>

//               <h2 className="text-3xl font-black leading-tight mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
//                 HR that works as hard<br />
//                 <span style={{ background: 'linear-gradient(135deg,#FF6B35,#FF9A5C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//                   as your team does.
//                 </span>
//               </h2>
//               <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
//                 From attendance to payroll, SamayaHR automates the routine so you can focus on what matters.
//               </p>
//             </div>

//             {/* Feature ticker */}
//             <div className="overflow-hidden ticker-mask fade-up-2">
//               <div className="ticker-anim flex whitespace-nowrap gap-0">
//                 {[...FEATURES, ...FEATURES].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2 px-5 shrink-0">
//                     <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
//                       style={{ background: 'rgba(255,107,53,0.15)' }}>{f.icon}</span>
//                     <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">{f.text}</span>
//                     <span className="text-gray-700 ml-4">◆</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Testimonial card */}
//           <div className="fade-up-3">
//             <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
//               <div className="flex gap-1 mb-3">
//                 {[...Array(5)].map((_, i) => (
//                   <svg key={i} className="w-3.5 h-3.5" fill="#FF6B35" viewBox="0 0 24 24">
//                     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
//                   </svg>
//                 ))}
//               </div>
//               <p className="text-sm leading-relaxed text-gray-300 mb-4">
//                 "With SamayaHR, our team can check in, track leaves and view payslips from anywhere. HR work feels lighter and paydays are smoother."
//               </p>
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white coral-btn shrink-0">R</div>
//                 <div>
//                   <p className="text-xs font-bold text-white">Riya Sharma</p>
//                   <p className="text-[10px] text-gray-500">HR Partner, Client Organization</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* ══════════════════════════════════════════
//           RIGHT PANEL — form area
//       ══════════════════════════════════════════ */}
//       <div className="flex-1 flex flex-col relative" style={{ backgroundColor: '#F7F8FA' }}>

//         {/* Back button */}
//         <div className="absolute top-6 left-6 z-10">
//           <button
//             type="button"
//             onClick={handleReturnHome}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-[#0D1F2D] hover:bg-white rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
//           >
//             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Home
//           </button>
//         </div>

//         <div className="flex flex-col items-center justify-center flex-1 px-6 pt-16 pb-8">
//           <div className="w-full max-w-[420px] mx-auto">

//             {/* Logo + title */}
//             <div className="text-center mb-8 fade-up-1">
//               <div className="inline-block mb-4">
//                 <img src="/assets/Zlabs-Logo.png" alt="SamayaHR" className="h-[80px] w-[80px] object-contain mx-auto" />
//               </div>
//               <h1 className="text-2xl font-black text-[#0D1F2D] mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>
//                 Welcome back
//               </h1>
//               <p className="text-sm text-gray-500">
//                 {activeTab === "company"
//                   ? "Sign in with your company email and tenant code."
//                   : "Sign in with your registered email and password."}
//               </p>
//             </div>

//             {!showForm ? (
//               /* ── INITIAL CTA ───────────────────────── */
//               <div className="flex flex-col items-center fade-up-2">

//                 {/* Big sign-in card */}
//                 <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 mb-6">
//                   <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl" style={{ background: '#F7F8FA' }}>
//                     <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
//                       style={{ background: 'rgba(255,107,53,0.10)' }}>🔐</div>
//                     <div>
//                       <p className="text-sm font-bold text-[#0D1F2D]">Secure Sign In</p>
//                       <p className="text-xs text-gray-400">Your data is protected with AES-256 encryption</p>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={handleLoginClick}
//                     className="coral-btn w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
//                   >
//                     Continue to Sign In
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </button>

//                   <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
//                     <div className="flex-1 h-px bg-gray-100" />
//                     or
//                     <div className="flex-1 h-px bg-gray-100" />
//                   </div>

//                   <p className="mt-4 text-xs text-gray-500 text-center">
//                     Don't have an account?{" "}
//                     <a href="/solutions/bookdemo" className="font-bold" style={{ color: '#FF6B35' }}>
//                       Book a Demo →
//                     </a>
//                   </p>
//                 </div>

//                 {/* Trust badges */}
//                 <div className="flex items-center gap-4 text-xs text-gray-400">
//                   {[["🔒","Encrypted"],["✅","Verified"],["🌍","GDPR Safe"]].map(([ic,lb]) => (
//                     <div key={lb} className="flex items-center gap-1">
//                       <span>{ic}</span><span className="font-medium">{lb}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               /* ── LOGIN FORM ────────────────────────── */
//               <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 fade-up-2">

//                 {/* Tabs */}
//                 <div className="flex border-b border-gray-100 mb-6 gap-1">
//                   {[["employee","👤 Employee"],["company","🏢 Company"]].map(([tab, label]) => (
//                     <button
//                       key={tab}
//                       type="button"
//                       onClick={() => setActiveTab(tab)}
//                       className={`flex-1 pb-3 text-sm font-bold transition-all ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}
//                     >
//                       {label}
//                     </button>
//                   ))}
//                 </div>

//                 <h2 className="text-lg font-black text-[#0D1F2D] mb-5 text-center" style={{ fontFamily: 'Sora, sans-serif' }}>
//                   {getTitle()}
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-4">

//                   {/* Email */}
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1.5">
//                       Email address
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder={activeTab === "company" ? "you@organization.com" : "you@company.com"}
//                       value={loginData.email}
//                       onChange={handleChange}
//                       required
//                       className="input-field"
//                     />
//                   </div>

//                   {/* Tenant code (company tab) */}
//                   {activeTab === "company" && (
//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1.5">
//                         Tenant Code
//                       </label>
//                       <input
//                         type="text"
//                         name="companyKey"
//                         placeholder="e.g. ACME2024"
//                         value={loginData.companyKey}
//                         onChange={handleChange}
//                         required
//                         className="input-field"
//                       />
//                     </div>
//                   )}

//                   {/* Password (employee tab) */}
//                   {activeTab !== "company" && (
//                     <div>
//                       <div className="flex items-center justify-between mb-1.5">
//                         <label className="text-xs font-semibold text-gray-600">Password</label>
//                         <a href="/forgot-password" className="text-xs font-semibold" style={{ color: '#FF6B35' }}>
//                           Forgot password?
//                         </a>
//                       </div>
//                       <input
//                         type="password"
//                         name="password"
//                         placeholder="••••••••"
//                         value={loginData.password}
//                         onChange={handleChange}
//                         required
//                         className="input-field"
//                       />
//                     </div>
//                   )}

//                   {/* Submit */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="coral-btn w-full mt-2 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                         </svg>
//                         Signing in...
//                       </>
//                     ) : (
//                       <>
//                         Sign In
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
//                         </svg>
//                       </>
//                     )}
//                   </button>
//                 </form>

//                 {/* Back link */}
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="mt-5 w-full text-center text-xs font-semibold text-gray-400 hover:text-[#FF6B35] transition-colors"
//                 >
//                   ← Back to sign-in screen
//                 </button>
//               </div>
//             )}

//             {/* ToS */}
//             <p className="mt-8 text-[11px] text-gray-400 text-center leading-relaxed fade-up-4">
//               By logging in, you agree to our{" "}
//               <a href="/terms" className="underline underline-offset-2 hover:text-[#FF6B35] transition-colors">Terms of Service</a>
//               {" "}and{" "}
//               <a href="/privacy" className="underline underline-offset-2 hover:text-[#FF6B35] transition-colors">Privacy Policy</a>.
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="w-full py-4 text-center border-t border-gray-100 bg-white">
//           <p className="text-[11px] text-gray-400">
//             © {new Date().getFullYear()} Zlabs Innovation Private Limited. All rights reserved.
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// with styling design changed

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../public/assets/Zlabs-Logo.png";

// /* ─── API helper ─────────────────────────────────── */
// const getApiBaseUrl = () => {
//   const fromEnv = import.meta.env?.VITE_API_BASE_URL?.trim();
//   if (fromEnv) return fromEnv;
//   if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
//     return "http://localhost:8080";
//   return "";
// };
// const API_BASE_URL = getApiBaseUrl();

// const LEFT_PARTICLES = [
//   {id:1,left:"8%", bottom:"-10%",size:5,dur:18,delay:0  },
//   {id:2,left:"18%",bottom:"-15%",size:7,dur:22,delay:4  },
//   {id:3,left:"28%",bottom:"-12%",size:4,dur:16,delay:2  },
//   {id:4,left:"38%",bottom:"-18%",size:6,dur:24,delay:6  },
//   {id:5,left:"48%",bottom:"-10%",size:3,dur:20,delay:1  },
//   {id:6,left:"58%",bottom:"-14%",size:8,dur:26,delay:3  },
//   {id:7,left:"68%",bottom:"-16%",size:5,dur:21,delay:5  },
//   {id:8,left:"78%",bottom:"-12%",size:4,dur:19,delay:7  },
//   {id:9,left:"88%",bottom:"-18%",size:6,dur:23,delay:2.5},
//   {id:10,left:"15%",bottom:"-20%",size:3,dur:27,delay:8 },
// ];
// const RIGHT_PARTICLES = [
//   {id:1,left:"10%",bottom:"-10%",size:3,dur:19,delay:1  },
//   {id:2,left:"30%",bottom:"-15%",size:5,dur:25,delay:3  },
//   {id:3,left:"55%",bottom:"-12%",size:4,dur:18,delay:0.5},
//   {id:4,left:"72%",bottom:"-18%",size:3,dur:22,delay:5  },
//   {id:5,left:"85%",bottom:"-10%",size:5,dur:28,delay:2  },
// ];
// const HR_FEATURES = [
//   {icon:"⏱️",text:"Smart Attendance"},      {icon:"💸",text:"Instant Payroll"},
//   {icon:"🏖️",text:"Leave Automation"},      {icon:"📊",text:"People Analytics"},
//   {icon:"🔐",text:"Bank-Grade Security"},   {icon:"📱",text:"Mobile App Access"},
//   {icon:"🚀",text:"Paperless Onboarding"},  {icon:"🎯",text:"OKR Tracking"},
// ];

// function Counter({target,suffix=""}) {
//   const [n,setN]=useState(0);
//   useEffect(()=>{
//     let v=0; const step=target/50;
//     const t=setInterval(()=>{ v+=step; if(v>=target){setN(target);clearInterval(t);}else setN(Math.floor(v)); },30);
//     return ()=>clearInterval(t);
//   },[target]);
//   return <>{n}{suffix}</>;
// }

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [showForm,  setShowForm]  = useState(false);
//   const [activeTab, setActiveTab] = useState("employee");
//   const [loading,   setLoading]   = useState(false);
//   const [showPass,  setShowPass]  = useState(false);
//   const [loginData, setLoginData] = useState({email:"",password:"",companyKey:""});

//   const handleChange = e => setLoginData(p=>({...p,[e.target.name]:e.target.value}));
//   const handleReturnHome = () => navigate("/");

//   const getLoginApi = () => {
//     const b = API_BASE_URL.replace(/\/+$/,"");
//     return activeTab==="company"
//       ? (b?`${b}/api/global-admin/companies/company-login`:"/api/global-admin/companies/company-login")
//       : (b?`${b}/api/auth/login`:"/api/auth/login");
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const isCompany = activeTab==="company";
//     const payload   = isCompany
//       ? {officialEmail:loginData.email, tenantCode:loginData.companyKey}
//       : {email:loginData.email, password:loginData.password};
//     setLoading(true);
//     try {
//       const res  = await fetch(getLoginApi(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
//       const data = await res.json();
//       console.log("LOGIN RESPONSE:",data);
//       if(!res.ok||!data.success){alert("Error: "+(data?.message||"Login failed"));return;}
//       const token=data?.data?.token??null;
//       if(!token){alert("Login succeeded but token missing");return;}
//       localStorage.setItem("token",`Bearer ${token}`);
//       if(isCompany){
//         localStorage.setItem("companyId",  String(data?.data?.companyId||""));
//         localStorage.setItem("companyName",data?.data?.displayName||"");
//         localStorage.setItem("tenantCode", data?.data?.tenantCode||"");
//         localStorage.setItem("userRole",   "COMPANY_ADMIN");
//         window.location.href="/super-admin/dashboard";
//       } else {
//         const userRole=data.data?.role||"EMPLOYEE";
//         const userId  =data?.data?.userId||data?.data?.id;
//         localStorage.setItem("userId",      String(userId));
//         localStorage.setItem("employeeName",data.data?.fullName||data.data?.name||"");
//         localStorage.setItem("userRole",    userRole);
//         if(userRole==="ADMIN"||userRole==="GLOBALADMIN"){
//           localStorage.setItem("tenantCode", data.data?.tenantCode||"");
//           localStorage.setItem("companyId",  String(data.data?.companyId||""));
//           localStorage.setItem("companyName",data.data?.companyName||"");
//         }
//         if     (userRole==="GLOBALADMIN") window.location.href="/global-admin/dashboard";
//         else if(userRole==="ADMIN")       window.location.href="/admin/dashboard";
//         else                              window.location.href="/employee/dashboard";
//       }
//     } catch(err){
//       console.error("Login error:",err);
//       alert("Login error: "+err.message);
//     } finally { setLoading(false); }
//   };

//   const STYLES = `
//     @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

//     @keyframes float-up      { 0%{transform:translate3d(0,0,0);opacity:0}15%{opacity:.8}80%{opacity:.8}100%{transform:translate3d(0,-140vh,0);opacity:0} }
//     @keyframes float-up-teal { 0%{transform:translate3d(0,0,0);opacity:0}15%{opacity:.5}80%{opacity:.5}100%{transform:translate3d(20px,-140vh,0);opacity:0} }
//     @keyframes scan           { 0%{top:0%;opacity:0}20%{opacity:.6}80%{opacity:.6}100%{top:100%;opacity:0} }
//     @keyframes shimmer-x      { 0%{transform:translateX(-150%) skewX(-12deg)}100%{transform:translateX(150%) skewX(-12deg)} }
//     @keyframes pulse-ring     { 0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(1.6);opacity:0} }
//     @keyframes ticker         { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }
//     @keyframes spin-slow      { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
//     @keyframes spin-rev       { from{transform:rotate(0deg)}to{transform:rotate(-360deg)} }
//     @keyframes fade-up        { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
//     @keyframes float-card     { 0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(1deg)} }
//     @keyframes float-card-inv { 0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(8px) rotate(-1deg)} }
//     @keyframes glow-pulse     { 0%,100%{opacity:.25}50%{opacity:.6} }

//     .p-left  { animation:float-up      var(--d) linear infinite var(--dl); }
//     .p-right { animation:float-up-teal var(--d) linear infinite var(--dl); }
//     .scan    { animation:scan 4s linear infinite; }
//     .shim    { animation:shimmer-x 3s ease-in-out infinite; }
//     .pr      { animation:pulse-ring 2s ease-in-out infinite; }
//     .tick    { animation:ticker 26s linear infinite; }
//     .ss      { animation:spin-slow 20s linear infinite; }
//     .sr      { animation:spin-rev  15s linear infinite; }
//     .fc      { animation:float-card 4s ease-in-out infinite; }
//     .fci     { animation:float-card-inv 5s ease-in-out infinite; }
//     .gp      { animation:glow-pulse 3s ease-in-out infinite; }

//     .f1{animation:fade-up .45s ease both .05s}.f2{animation:fade-up .45s ease both .15s}
//     .f3{animation:fade-up .45s ease both .25s}.f4{animation:fade-up .45s ease both .35s}
//     .f5{animation:fade-up .45s ease both .45s}

//     .coral-btn{background:linear-gradient(135deg,#FF6B35,#FF5722);box-shadow:0 4px 20px rgba(255,107,53,.35);transition:all .25s}
//     .coral-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,107,53,.45)}
//     .coral-btn:disabled{opacity:.7;transform:none;cursor:not-allowed}

//     .ifield{
//       width:100%;border:1.5px solid rgba(255,255,255,.12);border-radius:14px;
//       background:rgba(255,255,255,.07);padding:12px 14px 12px 40px;
//       font-size:14px;color:#fff;outline:none;transition:all .2s;
//       font-family:'DM Sans',sans-serif;
//     }
//     .ifield::placeholder{color:rgba(255,255,255,.25)}
//     .ifield:focus{border-color:#FF6B35;background:rgba(255,255,255,.10);box-shadow:0 0 0 4px rgba(255,107,53,.12)}

//     .glass-d{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);backdrop-filter:blur(12px)}
//     .tm{mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent);-webkit-mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent)}
//   `;

//   return (
//     <div style={{fontFamily:"'DM Sans',sans-serif"}} className="min-h-screen w-full flex overflow-hidden">
//       <style>{STYLES}</style>

//       {/* ═══════════════ LEFT PANEL ═══════════════ */}
//       <div className="hidden md:flex md:w-[44%] relative overflow-hidden text-white flex-col"
//         style={{background:'linear-gradient(155deg,#08101e 0%,#0D1F2D 50%,#0e2235 100%)'}}>

//         {/* rotating rings */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
//           <div className="ss"  style={{width:600,height:600,borderRadius:'50%',border:'1px solid rgba(255,255,255,.03)'}} />
//           <div className="sr"  style={{position:'absolute',inset:36,borderRadius:'50%',border:'1px solid rgba(255,255,255,.04)'}} />
//           <div className="ss"  style={{position:'absolute',inset:80,borderRadius:'50%',border:'1px solid rgba(255,107,53,.07)'}} />
//         </div>

//         {/* orbs */}
//         <div className="gp absolute pointer-events-none" style={{top:-80,left:-80,width:320,height:320,borderRadius:'50%',filter:'blur(80px)',background:'rgba(255,107,53,.22)'}} />
//         <div className="gp absolute pointer-events-none" style={{top:'50%',right:-60,width:260,height:260,borderRadius:'50%',filter:'blur(70px)',background:'rgba(0,194,168,.14)',animationDelay:'.8s'}} />
//         <div className="gp absolute pointer-events-none" style={{bottom:-60,left:40,width:300,height:300,borderRadius:'50%',filter:'blur(80px)',background:'rgba(255,107,53,.16)',animationDelay:'1.5s'}} />

//         {/* grid */}
//         <div className="absolute inset-0 pointer-events-none" style={{opacity:.035,backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',backgroundSize:'52px 52px'}} />

//         {/* particles */}
//         {LEFT_PARTICLES.map(p=>(
//           <span key={p.id} className="absolute rounded-full p-left pointer-events-none"
//             style={{left:p.left,bottom:p.bottom,width:p.size,height:p.size,'--d':`${p.dur}s`,'--dl':`${p.delay}s`,
//               background:'rgba(255,107,53,.65)',boxShadow:'0 0 10px rgba(255,107,53,.5)'}} />
//         ))}

//         {/* content */}
//         <div className="relative z-10 flex flex-col h-full px-10 py-9">

//           {/* logo */}
//           <div className="flex items-center gap-3 mb-auto f1">
//             <div className="relative group">
//               <div className="absolute -inset-1.5 rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition-all" style={{background:'#FF6B35'}} />
//               <div className="relative flex items-center justify-center overflow-hidden" style={{width:60,height:60,background:'white',borderRadius:16,boxShadow:'0 20px 60px rgba(0,0,0,.4)',border:'1px solid rgba(255,255,255,.2)'}}>
//                 <div className="scan absolute left-0 w-full" style={{height:2,background:'linear-gradient(90deg,transparent,#FF6B35,transparent)',opacity:.6,zIndex:20}} />
//                 <div className="shim absolute top-0 left-0 h-full pointer-events-none" style={{width:'50%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)'}} />
//                 <img src={logo} alt="SamayaHR" className="relative z-10 object-contain group-hover:scale-110 transition-transform duration-500" style={{width:40,height:40}} />
//                 <div className="absolute top-0 left-0" style={{width:12,height:12,borderTop:'2px solid #FF6B35',borderLeft:'2px solid #FF6B35',borderTopLeftRadius:6}} />
//                 <div className="absolute bottom-0 right-0" style={{width:12,height:12,borderBottom:'2px solid #00C2A8',borderRight:'2px solid #00C2A8',borderBottomRightRadius:6}} />
//               </div>
//             </div>
//             <div>
//               <p className="font-black text-xl tracking-tight" style={{fontFamily:'Sora,sans-serif'}}>Samaya<span style={{color:'#FF6B35'}}>HR</span></p>
//               <p className="text-gray-600 font-semibold" style={{fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',marginTop:2}}>Workplace OS</p>
//             </div>
//           </div>

//           {/* hero */}
//           <div className="flex-1 flex flex-col justify-center py-8">
//             <div className="f2 mb-6">
//               <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5" style={{background:'rgba(255,107,53,.12)',border:'1px solid rgba(255,107,53,.25)',color:'#FF6B35'}}>
//                 <span className="relative flex" style={{width:6,height:6}}>
//                   <span className="pr absolute inline-flex rounded-full" style={{width:'100%',height:'100%',background:'#FF6B35'}} />
//                   <span className="relative inline-flex rounded-full" style={{width:6,height:6,background:'#FF6B35'}} />
//                 </span>
//                  Indian companies run on SamayaHR
//               </div>
//               <h2 className="font-black leading-tight mb-4" style={{fontSize:'1.9rem',fontFamily:'Sora,sans-serif'}}>
//                 Your people deserve<br />
//                 <span style={{background:'linear-gradient(135deg,#FF6B35,#FFAA5C)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
//                   better than a spreadsheet.
//                 </span>
//               </h2>
//               <p className="text-sm leading-relaxed max-w-xs" style={{color:'rgba(255,255,255,.4)'}}>
//                 SamayaHR handles your payroll, attendance, leaves, and performance reviews — so you can focus on the part that actually matters: your people.
//               </p>
//             </div>

//             {/* stats */}
//             <div className="f3 grid grid-cols-3 gap-2.5 mb-7">
//               {[{v:70,s:"%",l:"Admin Time Saved"},{v:99,s:"%",l:"Payroll Accuracy"},{v:5,s:"min",l:"To Run Payroll"}].map(x=>(
//                 <div key={x.l} className="glass-d rounded-2xl p-3 text-center" style={{animationName:'border-dance',animationDuration:'3s',animationIterationCount:'infinite'}}>
//                   <p className="font-black text-white" style={{fontSize:'1.4rem',fontFamily:'Sora,sans-serif'}}><Counter target={x.v} suffix={x.s} /></p>
//                   <p className="text-gray-500 font-medium leading-tight" style={{fontSize:10,marginTop:2}}>{x.l}</p>
//                 </div>
//               ))}
//             </div>

//             {/* ticker */}
//             <div className="f4 overflow-hidden tm mb-7">
//               <div className="tick flex whitespace-nowrap">
//                 {[...HR_FEATURES,...HR_FEATURES].map((f,i)=>(
//                   <div key={i} className="flex items-center gap-2 shrink-0" style={{paddingLeft:16,paddingRight:16}}>
//                     <span className="flex items-center justify-center rounded-lg text-xs" style={{width:24,height:24,background:'rgba(255,107,53,.15)'}}>{f.icon}</span>
//                     <span className="font-semibold whitespace-nowrap" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{f.text}</span>
//                     <span style={{color:'rgba(255,255,255,.15)',marginLeft:12,fontSize:8}}>◆</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* testimonial */}
//             <div className="f5 glass-d rounded-2xl p-5">
//               <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_,i)=><svg key={i} style={{width:14,height:14}} fill="#FF6B35" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div>
//               <p className="text-sm leading-relaxed mb-4" style={{color:'rgba(255,255,255,.65)'}}>
//                 "Onboarding our 20-person team used to take a week. With SamayaHR it took a single afternoon. The payroll automation alone paid for itself on day one."
//               </p>
//               <div className="flex items-center gap-3">
//                 <div className="coral-btn flex items-center justify-center rounded-full font-black text-white shrink-0" style={{width:32,height:32,fontSize:12}}>P</div>
//                 <div>
//                   <p className="text-xs font-bold text-white">Priya M</p>
//                   <p style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>Head of HR </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ═══════════════ RIGHT PANEL ═══════════════ */}
//       <div className="flex-1 relative flex flex-col overflow-hidden"
//         style={{background:'linear-gradient(150deg,#0f1c2e 0%,#0a1624 50%,#0d1e30 100%)'}}>

//         {/* orbs */}
//         <div className="gp absolute pointer-events-none" style={{top:-60,right:-40,width:280,height:280,borderRadius:'50%',filter:'blur(70px)',background:'rgba(0,194,168,.12)'}} />
//         <div className="gp absolute pointer-events-none" style={{bottom:-40,right:-60,width:240,height:240,borderRadius:'50%',filter:'blur(60px)',background:'rgba(255,107,53,.10)',animationDelay:'1s'}} />
//         <div className="gp absolute pointer-events-none" style={{top:'45%',left:-30,width:200,height:200,borderRadius:'50%',filter:'blur(60px)',background:'rgba(255,107,53,.08)',animationDelay:'2s'}} />

//         {/* grid */}
//         <div className="absolute inset-0 pointer-events-none" style={{opacity:.03,backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />

//         {/* particles teal */}
//         {RIGHT_PARTICLES.map(p=>(
//           <span key={p.id} className="absolute rounded-full p-right pointer-events-none"
//             style={{left:p.left,bottom:p.bottom,width:p.size,height:p.size,'--d':`${p.dur}s`,'--dl':`${p.delay}s`,
//               background:'rgba(0,194,168,.55)',boxShadow:'0 0 10px rgba(0,194,168,.4)'}} />
//         ))}

//         {/* floating deco cards */}
//         <div className="fc absolute hidden lg:block pointer-events-none" style={{top:28,right:28,opacity:.18}}>
//           <div className="glass-d flex items-center gap-2 px-3" style={{width:148,height:56,borderRadius:16}}>
//             <span style={{fontSize:20}}>💰</span>
//             <div><p className="font-bold text-white" style={{fontSize:11}}>Payroll Run</p><p style={{fontSize:10,color:'#4ade80'}}>Processed ✓</p></div>
//           </div>
//         </div>
//         <div className="fci absolute hidden lg:block pointer-events-none" style={{bottom:100,left:20,opacity:.15}}>
//           <div className="glass-d flex items-center gap-2 px-3" style={{width:164,height:52,borderRadius:16}}>
//             <span style={{fontSize:20}}>⏰</span>
//             <div><p className="font-bold text-white" style={{fontSize:11}}>Team Check-in</p><p style={{fontSize:10,color:'#2dd4bf'}}>48 / 50 present</p></div>
//           </div>
//         </div>

//         {/* back btn */}
//         <div className="absolute top-5 left-5 z-20">
//           <button type="button" onClick={handleReturnHome}
//             className="glass-d flex items-center gap-1.5 rounded-xl transition-all hover:border-white/20"
//             style={{padding:'8px 14px',fontSize:12,fontWeight:700,color:'white',border:'1px solid transparent'}}>
//             <svg style={{width:14,height:14}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Home
//           </button>
//         </div>

//         {/* form area */}
//         <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12">
//           <div style={{width:'100%',maxWidth:400}}>

//             {/* greeting */}
//             <div className="text-center f1" style={{marginBottom:28}}>
//               <div className="inline-flex items-center justify-center relative" style={{width:60,height:60,borderRadius:18,background:'rgba(255,107,53,.15)',border:'1.5px solid rgba(255,107,53,.25)',marginBottom:16}}>
//                 <img src="/assets/Zlabs-Logo.png" alt="SamayaHR" style={{width:36,height:36,objectFit:'contain'}} />
//                 <div className="absolute" style={{top:-4,right:-4,width:14,height:14,borderRadius:'50%',background:'#22c55e',border:'2px solid #0a1624',display:'flex',alignItems:'center',justifyContent:'center'}}>
//                   <span className="pr" style={{display:'block',width:6,height:6,borderRadius:'50%',background:'white'}} />
//                 </div>
//               </div>
//               <h1 className="font-black text-white" style={{fontSize:'1.5rem',fontFamily:'Sora,sans-serif',marginBottom:6}}>
//                 {showForm ? "Sign in to your workspace" : "Good to see you again 👋"}
//               </h1>
//               <p style={{fontSize:13,color:'rgba(255,255,255,.35)'}}>
//                 {activeTab==="company" ? "Enter your company email and Pass code to continue." : "Pick up right where your team left off."}
//               </p>
//             </div>

//             {!showForm ? (
//               <div className="f2">
//                 {/* card */}
//                 <div className="glass-d rounded-3xl p-6" style={{marginBottom:20}}>

//                   {/* feature pills */}
//                   <div className="flex flex-wrap gap-2" style={{marginBottom:20}}>
//                     {[{icon:"⏱️",l:"Attendance"},{icon:"💸",l:"Payroll"},{icon:"🏖️",l:"Leaves"},{icon:"📊",l:"Analytics"},{icon:"🔐",l:"Security"}].map(f=>(
//                       <div key={f.l} className="flex items-center gap-1.5" style={{padding:'6px 12px',borderRadius:999,fontSize:12,fontWeight:600,color:'rgba(255,255,255,.5)',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.08)'}}>
//                         <span>{f.icon}</span>{f.l}
//                       </div>
//                     ))}
//                     <div className="flex items-center" style={{padding:'6px 12px',borderRadius:999,fontSize:12,fontWeight:700,color:'#FF6B35',background:'rgba(255,107,53,.10)',border:'1px solid rgba(255,107,53,.2)'}}>
//                       +8 more →
//                     </div>
//                   </div>

//                   {/* security note */}
//                   <div className="flex items-start gap-3 rounded-2xl" style={{marginBottom:20,padding:'14px',background:'rgba(0,194,168,.08)',border:'1px solid rgba(0,194,168,.15)'}}>
//                     <span style={{fontSize:20,marginTop:2}}>🛡️</span>
//                     <div>
//                       <p className="font-bold text-white" style={{fontSize:12}}>Enterprise-Grade Security</p>
//                       <p style={{fontSize:11,color:'rgba(255,255,255,.35)',marginTop:2}}>AES-256 encryption, 2FA, SSO and a full audit log — your data is locked down tight.</p>
//                     </div>
//                   </div>

//                   <button type="button" onClick={()=>setShowForm(true)} className="coral-btn w-full rounded-2xl text-white font-bold flex items-center justify-center gap-2" style={{padding:'14px',fontSize:14}}>
//                     Access My Workspace
//                     <svg style={{width:16,height:16}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
//                   </button>

//                   <p className="text-center" style={{marginTop:16,fontSize:12,color:'rgba(255,255,255,.25)'}}>
//                     New here?{" "}
//                     <a href="/solutions/bookdemo" style={{fontWeight:700,color:'#FF6B35'}}>Get a free personalised demo →</a>
//                   </p>
//                 </div>

//                 {/* trust */}
//                 <div className="flex items-center justify-center gap-6" style={{fontSize:12,color:'rgba(255,255,255,.3)'}}>
//                   {[["🔒","AES-256"],["🇮🇳","DPDPA 2023"],["✅","SOC 2 Ready"]].map(([ic,lb])=>(
//                     <div key={lb} className="flex items-center gap-1.5"><span>{ic}</span><span style={{fontWeight:600}}>{lb}</span></div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="f2 glass-d rounded-3xl p-6">

//                 {/* tabs */}
//                 <div className="flex gap-1 rounded-2xl p-1" style={{marginBottom:24,background:'rgba(255,255,255,.06)'}}>
//                   {[["employee","👤 Employee"],["company","🏢 Company"]].map(([tab,label])=>(
//                     <button key={tab} type="button" onClick={()=>setActiveTab(tab)}
//                       className={`flex-1 rounded-xl font-bold transition-all ${activeTab===tab?"coral-btn text-white shadow-lg":""}`}
//                       style={{padding:'10px',fontSize:12,color:activeTab===tab?'white':'rgba(255,255,255,.4)'}}>
//                       {label}
//                     </button>
//                   ))}
//                 </div>

//                 <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>

//                   {/* Email */}
//                   <div>
//                     <label style={{display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.4)',marginBottom:6}}>Email address</label>
//                     <div style={{position:'relative'}}>
//                       <div style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)'}}>
//                         <svg style={{width:16,height:16}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
//                       </div>
//                       <input type="email" name="email"
//                         placeholder={activeTab==="company"?"admin@company.com":"you@company.com"}
//                         value={loginData.email} onChange={handleChange} required className="ifield" />
//                     </div>
//                   </div>

//                   {activeTab==="company" && (
//                     <div>
//                       <label style={{display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.4)',marginBottom:6}}>Pass Code</label>
//                       <div style={{position:'relative'}}>
//                         <div style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)'}}>
//                           <svg style={{width:16,height:16}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
//                         </div>
//                         <input type="text" name="companyKey" placeholder="e.g. ACME2024"
//                           value={loginData.companyKey} onChange={handleChange} required className="ifield" />
//                       </div>
//                     </div>
//                   )}

//                   {activeTab!=="company" && (
//                     <div>
//                       <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
//                         <label style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.4)'}}>Password</label>
//                         <a href="/forgot-password" style={{fontSize:11,fontWeight:700,color:'#FF6B35'}}>Forgot password?</a>
//                       </div>
//                       <div style={{position:'relative'}}>
//                         <div style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)'}}>
//                           <svg style={{width:16,height:16}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
//                         </div>
//                         <input type={showPass?"text":"password"} name="password" placeholder="••••••••"
//                           value={loginData.password} onChange={handleChange} required className="ifield" style={{paddingRight:44}} />
//                         <button type="button" onClick={()=>setShowPass(!showPass)}
//                           style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)',background:'none',border:'none',cursor:'pointer',transition:'color .2s'}}
//                           onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.6)'}
//                           onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}>
//                           {showPass
//                             ? <svg style={{width:16,height:16}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
//                             : <svg style={{width:16,height:16}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
//                           }
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   <button type="submit" disabled={loading} className="coral-btn w-full rounded-2xl text-white font-bold flex items-center justify-center gap-2" style={{padding:'14px',fontSize:14,marginTop:4}}>
//                     {loading ? (
//                       <><svg className="animate-spin" style={{width:16,height:16}} fill="none" viewBox="0 0 24 24"><circle style={{opacity:.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{opacity:.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
//                     ) : (
//                       <>Sign In<svg style={{width:16,height:16}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
//                     )}
//                   </button>
//                 </form>

//                 <button type="button" onClick={()=>setShowForm(false)}
//                   className="w-full text-center transition-colors" style={{marginTop:16,fontSize:12,fontWeight:600,color:'rgba(255,255,255,.3)',background:'none',border:'none',cursor:'pointer'}}>
//                   ← Back to sign-in screen
//                 </button>
//               </div>
//             )}

//             <p className="text-center f5" style={{marginTop:24,fontSize:11,color:'rgba(255,255,255,.2)',lineHeight:1.7}}>
//               By signing in, you agree to our{" "}
//               <a href="/terms"   style={{textDecoration:'underline',color:'rgba(255,255,255,.35)'}}>Terms of Service</a>
//               {" "}&amp;{" "}
//               <a href="/privacy" style={{textDecoration:'underline',color:'rgba(255,255,255,.35)'}}>Privacy Policy</a>.
//             </p>
//           </div>
//         </div>

//         {/* footer */}
//         <div className="relative z-10 text-center py-3" style={{borderTop:'1px solid rgba(255,255,255,.05)'}}>
//           <p style={{fontSize:11,color:'rgba(255,255,255,.18)'}}>
//             © {new Date().getFullYear()} Zlabs Innovation Private Limited. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


//Animation added for the login page 

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../public/assets/Zlabs-Logo.png";

// /* ─── API helper ─────────────────────────────────── */
// const getApiBaseUrl = () => {
//   const fromEnv = import.meta.env?.VITE_API_BASE_URL?.trim();
//   if (fromEnv) return fromEnv;
//   if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
//     return "http://localhost:8080";
//   return "";
// };
// const API_BASE_URL = getApiBaseUrl();

// /* ─── Animated Left Panel ─────────────────────────── */
// function HROrbitScene() {
//   const canvasRef = useRef(null);
//   const animRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let W = canvas.offsetWidth, H = canvas.offsetHeight;
//     canvas.width = W; canvas.height = H;

//     const resize = () => {
//       W = canvas.offsetWidth; H = canvas.offsetHeight;
//       canvas.width = W; canvas.height = H;
//     };
//     window.addEventListener("resize", resize);

//     // Particles
//     const particles = Array.from({ length: 60 }, () => ({
//       x: Math.random() * W,
//       y: Math.random() * H,
//       r: Math.random() * 2 + 0.5,
//       vx: (Math.random() - 0.5) * 0.3,
//       vy: (Math.random() - 0.5) * 0.3,
//       alpha: Math.random() * 0.5 + 0.1,
//       color: Math.random() > 0.5 ? "#FF6B35" : "#00C2A8",
//     }));

//     // Orbit nodes
//     const ICONS = ["💸", "⏱️", "🏖️", "📊", "🔐", "📱", "🎯", "🚀"];
//     const orbits = [
//       { r: 100, speed: 0.008, nodes: 3, offset: 0 },
//       { r: 170, speed: -0.005, nodes: 4, offset: Math.PI / 4 },
//       { r: 240, speed: 0.003, nodes: 5, offset: Math.PI / 8 },
//     ];

//     // Data stream lines
//     const streams = Array.from({ length: 8 }, (_, i) => ({
//       x: Math.random() * W,
//       y: -20,
//       speed: Math.random() * 1.5 + 0.5,
//       length: Math.random() * 60 + 40,
//       alpha: Math.random() * 0.3 + 0.1,
//       color: Math.random() > 0.5 ? "#FF6B35" : "#00C2A8",
//     }));

//     // Pulse rings emanating from center
//     const pulses = [
//       { r: 0, maxR: 260, alpha: 0.6, speed: 0.8 },
//       { r: 87, maxR: 260, alpha: 0.6, speed: 0.8 },
//       { r: 174, maxR: 260, alpha: 0.6, speed: 0.8 },
//     ];

//     let t = 0;

//     const draw = () => {
//       ctx.clearRect(0, 0, W, H);
//       const cx = W / 2, cy = H / 2;
//       t += 0.016;

//       // Background grid subtle
//       ctx.save();
//       ctx.strokeStyle = "rgba(255,255,255,0.03)";
//       ctx.lineWidth = 1;
//       for (let gx = 0; gx < W; gx += 48) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
//       for (let gy = 0; gy < H; gy += 48) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
//       ctx.restore();

//       // Data streams (falling lines)
//       streams.forEach(s => {
//         s.y += s.speed;
//         if (s.y > H + s.length) { s.y = -s.length; s.x = Math.random() * W; }
//         const grad = ctx.createLinearGradient(s.x, s.y - s.length, s.x, s.y);
//         grad.addColorStop(0, "transparent");
//         grad.addColorStop(1, s.color.replace(")", `,${s.alpha})`).replace("rgb", "rgba").replace("#FF6B35", `rgba(255,107,53,${s.alpha})`).replace("#00C2A8", `rgba(0,194,168,${s.alpha})`));
//         ctx.save();
//         ctx.strokeStyle = s.color === "#FF6B35" ? `rgba(255,107,53,${s.alpha})` : `rgba(0,194,168,${s.alpha})`;
//         ctx.lineWidth = 1.5;
//         ctx.beginPath(); ctx.moveTo(s.x, s.y - s.length); ctx.lineTo(s.x, s.y); ctx.stroke();
//         ctx.restore();
//       });

//       // Pulse rings
//       pulses.forEach(p => {
//         p.r += p.speed;
//         if (p.r > p.maxR) p.r = 0;
//         const a = (1 - p.r / p.maxR) * 0.25;
//         ctx.save();
//         ctx.beginPath();
//         ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
//         ctx.strokeStyle = `rgba(255,107,53,${a})`;
//         ctx.lineWidth = 1.5;
//         ctx.stroke();
//         ctx.restore();
//       });

//       // Orbit rings + nodes
//       orbits.forEach((orb, oi) => {
//         // Ring
//         ctx.save();
//         ctx.beginPath();
//         ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
//         ctx.strokeStyle = `rgba(255,255,255,0.06)`;
//         ctx.lineWidth = 1;
//         ctx.setLineDash([4, 8]);
//         ctx.stroke();
//         ctx.setLineDash([]);
//         ctx.restore();

//         // Nodes on orbit
//         for (let n = 0; n < orb.nodes; n++) {
//           const angle = (2 * Math.PI * n) / orb.nodes + t * orb.speed + orb.offset;
//           const nx = cx + orb.r * Math.cos(angle);
//           const ny = cy + orb.r * Math.sin(angle);
//           const iconIdx = (oi * 3 + n) % ICONS.length;

//           // Glow
//           const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, 22);
//           grd.addColorStop(0, oi % 2 === 0 ? "rgba(255,107,53,0.3)" : "rgba(0,194,168,0.3)");
//           grd.addColorStop(1, "transparent");
//           ctx.beginPath();
//           ctx.arc(nx, ny, 22, 0, Math.PI * 2);
//           ctx.fillStyle = grd;
//           ctx.fill();

//           // Node circle
//           ctx.beginPath();
//           ctx.arc(nx, ny, 14, 0, Math.PI * 2);
//           ctx.fillStyle = "rgba(10,22,36,0.9)";
//           ctx.fill();
//           ctx.strokeStyle = oi % 2 === 0 ? "rgba(255,107,53,0.5)" : "rgba(0,194,168,0.5)";
//           ctx.lineWidth = 1.5;
//           ctx.stroke();

//           // Icon
//           ctx.font = "12px serif";
//           ctx.textAlign = "center";
//           ctx.textBaseline = "middle";
//           ctx.fillText(ICONS[iconIdx], nx, ny);

//           // Connector line to center
//           ctx.save();
//           const lineGrad = ctx.createLinearGradient(cx, cy, nx, ny);
//           lineGrad.addColorStop(0, "transparent");
//           lineGrad.addColorStop(1, oi % 2 === 0 ? "rgba(255,107,53,0.15)" : "rgba(0,194,168,0.15)");
//           ctx.strokeStyle = lineGrad;
//           ctx.lineWidth = 1;
//           ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();
//           ctx.restore();
//         }
//       });

//       // Center core
//       // Outer glow
//       const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
//       coreGlow.addColorStop(0, "rgba(255,107,53,0.25)");
//       coreGlow.addColorStop(0.6, "rgba(255,107,53,0.08)");
//       coreGlow.addColorStop(1, "transparent");
//       ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2);
//       ctx.fillStyle = coreGlow; ctx.fill();

//       // Core ring rotate
//       ctx.save();
//       ctx.translate(cx, cy);
//       ctx.rotate(t * 0.5);
//       ctx.beginPath();
//       ctx.arc(0, 0, 36, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(255,107,53,0.4)";
//       ctx.lineWidth = 1.5;
//       ctx.setLineDash([6, 6]);
//       ctx.stroke();
//       ctx.setLineDash([]);
//       ctx.restore();

//       ctx.save();
//       ctx.translate(cx, cy);
//       ctx.rotate(-t * 0.3);
//       ctx.beginPath();
//       ctx.arc(0, 0, 28, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(0,194,168,0.3)";
//       ctx.lineWidth = 1;
//       ctx.setLineDash([3, 9]);
//       ctx.stroke();
//       ctx.setLineDash([]);
//       ctx.restore();

//       // Center fill
//       ctx.beginPath();
//       ctx.arc(cx, cy, 22, 0, Math.PI * 2);
//       ctx.fillStyle = "rgba(10,22,36,0.95)";
//       ctx.fill();
//       ctx.strokeStyle = "rgba(255,107,53,0.6)";
//       ctx.lineWidth = 2;
//       ctx.stroke();

//       // Floating particles
//       particles.forEach(p => {
//         p.x += p.vx; p.y += p.vy;
//         if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
//         if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = p.color === "#FF6B35" ? `rgba(255,107,53,${p.alpha})` : `rgba(0,194,168,${p.alpha})`;
//         ctx.fill();
//       });

//       // Scanning line
//       const scanY = ((t * 60) % (H + 40)) - 20;
//       const scanGrad = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
//       scanGrad.addColorStop(0, "transparent");
//       scanGrad.addColorStop(0.5, "rgba(0,194,168,0.07)");
//       scanGrad.addColorStop(1, "transparent");
//       ctx.fillStyle = scanGrad;
//       ctx.fillRect(0, scanY - 8, W, 16);

//       animRef.current = requestAnimationFrame(draw);
//     };

//     draw();
//     return () => {
//       cancelAnimationFrame(animRef.current);
//       window.removeEventListener("resize", resize);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
//     />
//   );
// }

// /* ─── Floating HR Metric Cards ───────────────────── */
// function FloatingCards() {
//   return (
//     <>
//       {/* Top-left card */}
//       <div style={{
//         position: "absolute", top: 40, left: 24, zIndex: 10,
//         animation: "floatA 4s ease-in-out infinite",
//         background: "rgba(255,255,255,0.06)",
//         border: "1px solid rgba(255,107,53,0.25)",
//         backdropFilter: "blur(12px)",
//         borderRadius: 16, padding: "10px 16px",
//         display: "flex", alignItems: "center", gap: 10,
//       }}>
//         <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,107,53,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💸</div>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "Sora,sans-serif" }}>Payroll Done</div>
//           <div style={{ fontSize: 10, color: "#4ade80", marginTop: 1 }}>✓ 248 employees</div>
//         </div>
//       </div>

//       {/* Bottom-right card */}
//       <div style={{
//         position: "absolute", bottom: 80, right: 24, zIndex: 10,
//         animation: "floatB 5s ease-in-out infinite",
//         background: "rgba(255,255,255,0.06)",
//         border: "1px solid rgba(0,194,168,0.25)",
//         backdropFilter: "blur(12px)",
//         borderRadius: 16, padding: "10px 16px",
//         display: "flex", alignItems: "center", gap: 10,
//       }}>
//         <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,194,168,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⏰</div>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "Sora,sans-serif" }}>Team Check-In</div>
//           <div style={{ fontSize: 10, color: "#2dd4bf", marginTop: 1 }}>48 / 50 present</div>
//         </div>
//       </div>

//       {/* Middle-right */}
//       <div style={{
//         position: "absolute", top: "42%", right: 20, zIndex: 10,
//         animation: "floatC 6s ease-in-out infinite",
//         background: "rgba(255,255,255,0.06)",
//         border: "1px solid rgba(255,255,255,0.1)",
//         backdropFilter: "blur(12px)",
//         borderRadius: 16, padding: "10px 16px",
//         display: "flex", alignItems: "center", gap: 10,
//       }}>
//         <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,107,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏖️</div>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "Sora,sans-serif" }}>Leave Approved</div>
//           <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>3 requests · instant</div>
//         </div>
//       </div>
//     </>
//   );
// }

// /* ─── Logo in left panel center ─────────────────── */
// function CenterLogo() {
//   return (
//     <div style={{
//       position: "absolute", top: "50%", left: "50%",
//       transform: "translate(-50%, -50%)",
//       zIndex: 5, pointerEvents: "none",
//       display: "flex", alignItems: "center", justifyContent: "center",
//     }}>
//       <div style={{
//         width: 44, height: 44, borderRadius: 14,
//         background: "white",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         boxShadow: "0 0 30px rgba(255,107,53,0.4)",
//       }}>
//         <img src={logo} alt="SamayaHR" style={{ width: 30, height: 30, objectFit: "contain" }} />
//       </div>
//     </div>
//   );
// }

// /* ─── Main Login Page ────────────────────────────── */
// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [showForm,  setShowForm]  = useState(false);
//   const [activeTab, setActiveTab] = useState("employee");
//   const [loading,   setLoading]   = useState(false);
//   const [showPass,  setShowPass]  = useState(false);
//   const [loginData, setLoginData] = useState({ email: "", password: "", companyKey: "" });

//   const handleChange = e => setLoginData(p => ({ ...p, [e.target.name]: e.target.value }));
//   const handleReturnHome = () => navigate("/");

//   const getLoginApi = () => {
//     const b = API_BASE_URL.replace(/\/+$/, "");
//     return activeTab === "company"
//       ? (b ? `${b}/api/global-admin/companies/company-login` : "/api/global-admin/companies/company-login")
//       : (b ? `${b}/api/auth/login` : "/api/auth/login");
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const isCompany = activeTab === "company";
//     const payload = isCompany
//       ? { officialEmail: loginData.email, tenantCode: loginData.companyKey }
//       : { email: loginData.email, password: loginData.password };
//     setLoading(true);
//     try {
//       const res  = await fetch(getLoginApi(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       const data = await res.json();
//       if (!res.ok || !data.success) { alert("Error: " + (data?.message || "Login failed")); return; }
//       const token = data?.data?.token ?? null;
//       if (!token) { alert("Login succeeded but token missing"); return; }
//       localStorage.setItem("token", `Bearer ${token}`);
//       if (isCompany) {
//         localStorage.setItem("companyId",   String(data?.data?.companyId || ""));
//         localStorage.setItem("companyName", data?.data?.displayName || "");
//         localStorage.setItem("tenantCode",  data?.data?.tenantCode || "");
//         localStorage.setItem("userRole",    "COMPANY_ADMIN");
//         window.location.href = "/super-admin/dashboard";
//       } else {
//         const userRole = data.data?.role || "EMPLOYEE";
//         const userId   = data?.data?.userId || data?.data?.id;
//         localStorage.setItem("userId",       String(userId));
//         localStorage.setItem("employeeName", data.data?.fullName || data.data?.name || "");
//         localStorage.setItem("userRole",     userRole);
//         if (userRole === "ADMIN" || userRole === "GLOBALADMIN") {
//           localStorage.setItem("tenantCode", data.data?.tenantCode || "");
//           localStorage.setItem("companyId",  String(data.data?.companyId || ""));
//           localStorage.setItem("companyName",data.data?.companyName || "");
//         }
//         if      (userRole === "GLOBALADMIN") window.location.href = "/global-admin/dashboard";
//         else if (userRole === "ADMIN")       window.location.href = "/admin/dashboard";
//         else                                 window.location.href = "/employee/dashboard";
//       }
//     } catch (err) {
//       alert("Login error: " + err.message);
//     } finally { setLoading(false); }
//   };

//   const STYLES = `
//     @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

//     @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
//     @keyframes floatB { 0%,100%{transform:translateY(0) rotate(1deg)} 50%{transform:translateY(10px) rotate(-1deg)} }
//     @keyframes floatC { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(1deg)} }
//     @keyframes shimmer-x { 0%{transform:translateX(-150%) skewX(-12deg)} 100%{transform:translateX(150%) skewX(-12deg)} }
//     @keyframes fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
//     @keyframes glow-pulse { 0%,100%{opacity:.25} 50%{opacity:.6} }

//     .shim { animation:shimmer-x 3s ease-in-out infinite; }
//     .gp   { animation:glow-pulse 3s ease-in-out infinite; }

//     .f1{animation:fade-up .45s ease both .05s} .f2{animation:fade-up .45s ease both .15s}
//     .f3{animation:fade-up .45s ease both .25s} .f4{animation:fade-up .45s ease both .35s}
//     .f5{animation:fade-up .45s ease both .45s}

//     .coral-btn{background:linear-gradient(135deg,#FF6B35,#FF5722);box-shadow:0 4px 20px rgba(255,107,53,.35);transition:all .25s}
//     .coral-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,107,53,.45)}
//     .coral-btn:disabled{opacity:.7;transform:none;cursor:not-allowed}

//     .ifield{
//       width:100%;border:1.5px solid rgba(255,255,255,.12);border-radius:14px;
//       background:rgba(255,255,255,.07);padding:12px 14px 12px 40px;
//       font-size:14px;color:#fff;outline:none;transition:all .2s;
//       font-family:'DM Sans',sans-serif;
//     }
//     .ifield::placeholder{color:rgba(255,255,255,.25)}
//     .ifield:focus{border-color:#FF6B35;background:rgba(255,255,255,.10);box-shadow:0 0 0 4px rgba(255,107,53,.12)}

//     .glass-d{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);backdrop-filter:blur(12px)}
//   `;

//   return (
//     <div style={{ fontFamily: "'DM Sans',sans-serif" }} className="min-h-screen w-full flex overflow-hidden">
//       <style>{STYLES}</style>

//       {/* ═══════════════ LEFT PANEL — ANIMATION ONLY ═══════════════ */}
//       <div className="hidden md:flex md:w-[44%] relative overflow-hidden"
//         style={{ background: "linear-gradient(155deg,#08101e 0%,#0D1F2D 50%,#0e2235 100%)" }}>

//         {/* Canvas animation */}
//         <HROrbitScene />

//         {/* Floating metric cards */}
//         <FloatingCards />

//         {/* Center logo overlay */}
//         <CenterLogo />

//         {/* Subtle brand watermark at bottom */}
//         <div style={{
//           position: "absolute", bottom: 24, left: 0, right: 0,
//           textAlign: "center", zIndex: 10, pointerEvents: "none",
//         }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.12)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Sora,sans-serif" }}>
//             Samaya<span style={{ color: "rgba(255,107,53,0.3)" }}>HR</span> · Workplace OS
//           </p>
//         </div>
//       </div>

//       {/* ═══════════════ RIGHT PANEL ═══════════════ */}
//       <div className="flex-1 relative flex flex-col overflow-hidden"
//         style={{ background: "linear-gradient(150deg,#0f1c2e 0%,#0a1624 50%,#0d1e30 100%)" }}>

//         {/* orbs */}
//         <div className="gp absolute pointer-events-none" style={{ top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", filter: "blur(70px)", background: "rgba(0,194,168,.12)" }} />
//         <div className="gp absolute pointer-events-none" style={{ bottom: -40, right: -60, width: 240, height: 240, borderRadius: "50%", filter: "blur(60px)", background: "rgba(255,107,53,.10)", animationDelay: "1s" }} />
//         <div className="gp absolute pointer-events-none" style={{ top: "45%", left: -30, width: 200, height: 200, borderRadius: "50%", filter: "blur(60px)", background: "rgba(255,107,53,.08)", animationDelay: "2s" }} />

//         {/* grid */}
//         <div className="absolute inset-0 pointer-events-none" style={{ opacity: .03, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

//         {/* back btn */}
//         <div className="absolute top-5 left-5 z-20">
//           <button type="button" onClick={handleReturnHome}
//             className="glass-d flex items-center gap-1.5 rounded-xl transition-all hover:border-white/20"
//             style={{ padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "white", border: "1px solid transparent" }}>
//             <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Home
//           </button>
//         </div>

//         {/* form area */}
//         <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12">
//           <div style={{ width: "100%", maxWidth: 400 }}>

//             {/* greeting */}
//             <div className="text-center f1" style={{ marginBottom: 28 }}>
//               <div className="inline-flex items-center justify-center relative" style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,107,53,.15)", border: "1.5px solid rgba(255,107,53,.25)", marginBottom: 16 }}>
//                 <img src="/assets/Zlabs-Logo.png" alt="SamayaHR" style={{ width: 36, height: 36, objectFit: "contain" }} />
//                 <div className="absolute" style={{ top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "#22c55e", border: "2px solid #0a1624" }} />
//               </div>
//               <h1 className="font-black text-white" style={{ fontSize: "1.5rem", fontFamily: "Sora,sans-serif", marginBottom: 6 }}>
//                 {showForm ? "Sign in to your workspace" : "Good to see you again 👋"}
//               </h1>
//               <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)" }}>
//                 {activeTab === "company" ? "Enter your company email and Pass code to continue." : "Pick up right where your team left off."}
//               </p>
//             </div>

//             {!showForm ? (
//               <div className="f2">
//                 <div className="glass-d rounded-3xl p-6" style={{ marginBottom: 20 }}>
//                   <div className="flex flex-wrap gap-2" style={{ marginBottom: 20 }}>
//                     {[{ icon: "⏱️", l: "Attendance" }, { icon: "💸", l: "Payroll" }, { icon: "🏖️", l: "Leaves" }, { icon: "📊", l: "Analytics" }, { icon: "🔐", l: "Security" }].map(f => (
//                       <div key={f.l} className="flex items-center gap-1.5" style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" }}>
//                         <span>{f.icon}</span>{f.l}
//                       </div>
//                     ))}
//                     <div className="flex items-center" style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#FF6B35", background: "rgba(255,107,53,.10)", border: "1px solid rgba(255,107,53,.2)" }}>
//                       +8 more →
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3 rounded-2xl" style={{ marginBottom: 20, padding: "14px", background: "rgba(0,194,168,.08)", border: "1px solid rgba(0,194,168,.15)" }}>
//                     <span style={{ fontSize: 20, marginTop: 2 }}>🛡️</span>
//                     <div>
//                       <p className="font-bold text-white" style={{ fontSize: 12 }}>Enterprise-Grade Security</p>
//                       <p style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 2 }}>AES-256 encryption, 2FA, SSO and a full audit log — your data is locked down tight.</p>
//                     </div>
//                   </div>

//                   <button type="button" onClick={() => setShowForm(true)} className="coral-btn w-full rounded-2xl text-white font-bold flex items-center justify-center gap-2" style={{ padding: "14px", fontSize: 14 }}>
//                     Access My Workspace
//                     <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
//                   </button>

//                   <p className="text-center" style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,.25)" }}>
//                     New here?{" "}
//                     <a href="/solutions/bookdemo" style={{ fontWeight: 700, color: "#FF6B35" }}>Get a free personalised demo →</a>
//                   </p>
//                 </div>

//                 <div className="flex items-center justify-center gap-6" style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>
//                   {[["🔒", "AES-256"], ["🇮🇳", "DPDPA 2023"], ["✅", "SOC 2 Ready"]].map(([ic, lb]) => (
//                     <div key={lb} className="flex items-center gap-1.5"><span>{ic}</span><span style={{ fontWeight: 600 }}>{lb}</span></div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="f2 glass-d rounded-3xl p-6">
//                 {/* tabs */}
//                 <div className="flex gap-1 rounded-2xl p-1" style={{ marginBottom: 24, background: "rgba(255,255,255,.06)" }}>
//                   {[["employee", "👤 Employee"], ["company", "🏢 Company"]].map(([tab, label]) => (
//                     <button key={tab} type="button" onClick={() => setActiveTab(tab)}
//                       className={`flex-1 rounded-xl font-bold transition-all ${activeTab === tab ? "coral-btn text-white shadow-lg" : ""}`}
//                       style={{ padding: "10px", fontSize: 12, color: activeTab === tab ? "white" : "rgba(255,255,255,.4)" }}>
//                       {label}
//                     </button>
//                   ))}
//                 </div>

//                 <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                   <div>
//                     <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Email address</label>
//                     <div style={{ position: "relative" }}>
//                       <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.3)" }}>
//                         <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
//                       </div>
//                       <input type="email" name="email"
//                         placeholder={activeTab === "company" ? "admin@company.com" : "you@company.com"}
//                         value={loginData.email} onChange={handleChange} required className="ifield" />
//                     </div>
//                   </div>

//                   {activeTab === "company" && (
//                     <div>
//                       <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Pass Code</label>
//                       <div style={{ position: "relative" }}>
//                         <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.3)" }}>
//                           <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
//                         </div>
//                         <input type="text" name="companyKey" placeholder="e.g. ACME2024"
//                           value={loginData.companyKey} onChange={handleChange} required className="ifield" />
//                       </div>
//                     </div>
//                   )}

//                   {activeTab !== "company" && (
//                     <div>
//                       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//                         <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.4)" }}>Password</label>
//                         <a href="/forgot-password" style={{ fontSize: 11, fontWeight: 700, color: "#FF6B35" }}>Forgot password?</a>
//                       </div>
//                       <div style={{ position: "relative" }}>
//                         <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.3)" }}>
//                           <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
//                         </div>
//                         <input type={showPass ? "text" : "password"} name="password" placeholder="••••••••"
//                           value={loginData.password} onChange={handleChange} required className="ifield" style={{ paddingRight: 44 }} />
//                         <button type="button" onClick={() => setShowPass(!showPass)}
//                           style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.3)", background: "none", border: "none", cursor: "pointer" }}>
//                           {showPass
//                             ? <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
//                             : <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
//                           }
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   <button type="submit" disabled={loading} className="coral-btn w-full rounded-2xl text-white font-bold flex items-center justify-center gap-2" style={{ padding: "14px", fontSize: 14, marginTop: 4 }}>
//                     {loading ? (
//                       <><svg className="animate-spin" style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity: .25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path style={{ opacity: .75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</>
//                     ) : (
//                       <>Sign In<svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
//                     )}
//                   </button>
//                 </form>

//                 <button type="button" onClick={() => setShowForm(false)}
//                   className="w-full text-center" style={{ marginTop: 16, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.3)", background: "none", border: "none", cursor: "pointer" }}>
//                   ← Back to sign-in screen
//                 </button>
//               </div>
//             )}

//             <p className="text-center f5" style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,.2)", lineHeight: 1.7 }}>
//               By signing in, you agree to our{" "}
//               <a href="/terms"   style={{ textDecoration: "underline", color: "rgba(255,255,255,.35)" }}>Terms of Service</a>
//               {" "}&amp;{" "}
//               <a href="/privacy" style={{ textDecoration: "underline", color: "rgba(255,255,255,.35)" }}>Privacy Policy</a>.
//             </p>
//           </div>
//         </div>

//         {/* footer */}
//         <div className="relative z-10 text-center py-3" style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
//           <p style={{ fontSize: 11, color: "rgba(255,255,255,.18)" }}>
//             © {new Date().getFullYear()} Zlabs Innovation Private Limited. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

//animation added  7/3/2026
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "/assets/Zlabs-Logo.png?url";

// const getApiBaseUrl = () => {
//   const fromEnv = import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim();
//   if (fromEnv) return fromEnv;
//   if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return "http://localhost:8080";
//   return "";
// };
// const API_BASE_URL = getApiBaseUrl();

// /* ══════════════════════════════════════════
//    LEFT PANEL — Original orbit canvas animation
// ══════════════════════════════════════════ */
// function HROrbitScene() {
//   const canvasRef = useRef(null);
//   const animRef   = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let W = canvas.offsetWidth, H = canvas.offsetHeight;
//     canvas.width = W; canvas.height = H;

//     const resize = () => {
//       W = canvas.offsetWidth; H = canvas.offsetHeight;
//       canvas.width = W; canvas.height = H;
//     };
//     window.addEventListener("resize", resize);

//     const ICONS = ["💸","⏱️","🏖️","📊","🔐","📱","🎯","🚀","👥","📋"];
//     const orbits = [
//       { r: 78,  speed:  0.009, nodes: 3, offset: 0 },
//       { r: 138, speed: -0.006, nodes: 5, offset: Math.PI / 5 },
//       { r: 198, speed:  0.004, nodes: 6, offset: Math.PI / 9 },
//     ];
//     const COLS = ["rgba(255,107,53,","rgba(255,160,80,","rgba(255,70,30,"];

//     const PCOLS = ["rgba(255,107,53,","rgba(255,160,80,","rgba(255,200,100,","rgba(0,194,168,"];
//     const particles = Array.from({ length: 65 }, () => ({
//       x: Math.random() * W, y: Math.random() * H,
//       r: Math.random() * 1.8 + 0.4,
//       vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
//       alpha: Math.random() * 0.6 + 0.15,
//       col: PCOLS[Math.floor(Math.random() * PCOLS.length)],
//     }));

//     const pulses = [0, 85, 170].map(s => ({ r: s, max: 215, speed: 0.65 }));
//     let t = 0;

//     const draw = () => {
//       ctx.clearRect(0, 0, W, H);
//       const cx = W / 2, cy = H / 2;
//       t += 0.016;

//       // grid
//       ctx.save();
//       ctx.strokeStyle = "rgba(255,107,53,0.05)";
//       ctx.lineWidth = 1;
//       for (let x = 0; x < W; x += 44) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
//       for (let y = 0; y < H; y += 44) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
//       ctx.restore();

//       // particles
//       particles.forEach(p => {
//         p.x += p.vx; p.y += p.vy;
//         if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
//         if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
//         ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = p.col + p.alpha + ")";
//         ctx.shadowBlur = 8; ctx.shadowColor = p.col + "0.9)";
//         ctx.fill(); ctx.shadowBlur = 0;
//       });

//       // pulse rings
//       pulses.forEach(p => {
//         p.r += p.speed; if (p.r > p.max) p.r = 0;
//         const a = (1 - p.r / p.max) * 0.22;
//         ctx.beginPath(); ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
//         ctx.strokeStyle = `rgba(255,107,53,${a})`;
//         ctx.lineWidth = 1.5; ctx.stroke();
//       });

//       // orbits
//       orbits.forEach((orb, oi) => {
//         ctx.beginPath(); ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
//         ctx.strokeStyle = COLS[oi] + "0.15)";
//         ctx.lineWidth = 1; ctx.setLineDash([5, 10]); ctx.stroke(); ctx.setLineDash([]);

//         for (let n = 0; n < orb.nodes; n++) {
//           const angle = (2 * Math.PI * n) / orb.nodes + t * orb.speed + orb.offset;
//           const nx = cx + orb.r * Math.cos(angle);
//           const ny = cy + orb.r * Math.sin(angle);

//           const lg = ctx.createLinearGradient(cx, cy, nx, ny);
//           lg.addColorStop(0, "transparent"); lg.addColorStop(1, COLS[oi] + "0.2)");
//           ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
//           ctx.strokeStyle = lg; ctx.lineWidth = 1; ctx.stroke();

//           const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, 22);
//           rg.addColorStop(0, COLS[oi] + "0.42)"); rg.addColorStop(1, "transparent");
//           ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI * 2);
//           ctx.fillStyle = rg; ctx.fill();

//           ctx.beginPath(); ctx.arc(nx, ny, 13, 0, Math.PI * 2);
//           ctx.fillStyle = "rgba(10,5,2,0.92)"; ctx.fill();
//           ctx.strokeStyle = COLS[oi] + "0.8)"; ctx.lineWidth = 1.5; ctx.stroke();

//           ctx.font = "11px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
//           ctx.fillText(ICONS[(oi * 4 + n) % ICONS.length], nx, ny);
//         }
//       });

//       // core glow
//       const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
//       cg.addColorStop(0, "rgba(255,107,53,0.42)");
//       cg.addColorStop(0.5, "rgba(255,80,20,0.14)");
//       cg.addColorStop(1, "transparent");
//       ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2);
//       ctx.fillStyle = cg; ctx.fill();

//       ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.4);
//       ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(255,107,53,0.55)"; ctx.lineWidth = 1.5;
//       ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]);
//       ctx.restore();

//       ctx.save(); ctx.translate(cx, cy); ctx.rotate(-t * 0.25);
//       ctx.beginPath(); ctx.arc(0, 0, 23, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(255,160,80,0.4)"; ctx.lineWidth = 1;
//       ctx.setLineDash([3, 8]); ctx.stroke(); ctx.setLineDash([]);
//       ctx.restore();

//       ctx.beginPath(); ctx.arc(cx, cy, 17, 0, Math.PI * 2);
//       ctx.fillStyle = "rgba(8,4,2,0.96)"; ctx.fill();
//       ctx.strokeStyle = "rgba(255,107,53,0.95)"; ctx.lineWidth = 2; ctx.stroke();

//       animRef.current = requestAnimationFrame(draw);
//     };
//     draw();
//     return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
//   }, []);

//   return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />;
// }

// /* Floating metric card */
// function MCard({ style, icon, title, sub, subColor }) {
//   return (
//     <div style={{
//       position:"absolute", zIndex:10,
//       background:"rgba(10,4,2,0.85)",
//       border:"1px solid rgba(255,107,53,0.35)",
//       backdropFilter:"blur(16px)",
//       borderRadius:14, padding:"9px 14px",
//       display:"flex", alignItems:"center", gap:10,
//       boxShadow:"0 8px 28px rgba(0,0,0,0.45), 0 0 18px rgba(255,107,53,0.12)",
//       ...style,
//     }}>
//       <div style={{ width:30, height:30, borderRadius:9, background:"rgba(255,107,53,0.14)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{icon}</div>
//       <div>
//         <div style={{ fontSize:11, fontWeight:700, color:"#fff", fontFamily:"Sora,sans-serif" }}>{title}</div>
//         <div style={{ fontSize:10, color:subColor, marginTop:1 }}>{sub}</div>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════
//    PURE VISUAL ANIMATION (no text/data)
// ══════════════════════════════════════════ */
// function VisualAnimation() {
//   const canvasRef = useRef(null);
//   const animRef   = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let W = canvas.offsetWidth, H = canvas.offsetHeight;
//     canvas.width = W; canvas.height = H;
//     const onResize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
//     window.addEventListener("resize", onResize);

//     let t = 0;

//     // Flowing orbs
//     const orbs = Array.from({ length: 6 }, (_, i) => ({
//       x: W * (0.15 + (i * 0.18) % 0.85),
//       y: H * (0.2 + (i * 0.27) % 0.7),
//       r: 28 + i * 8,
//       speedX: (Math.random() - 0.5) * 0.5,
//       speedY: (Math.random() - 0.5) * 0.5,
//       hue: [22, 30, 16, 25, 18, 28][i], // orange family
//       phase: (i * Math.PI) / 3,
//     }));

//     // Wave lines
//     const WAVE_COUNT = 5;

//     // Sparkles
//     const sparks = Array.from({ length: 22 }, () => ({
//       x: Math.random() * W, y: Math.random() * H,
//       r: Math.random() * 2.5 + 0.5,
//       alpha: Math.random(),
//       speed: Math.random() * 0.02 + 0.008,
//       phase: Math.random() * Math.PI * 2,
//     }));

//     // Hexagon grid nodes
//     const hexNodes = [];
//     const hexSize = 38;
//     for (let row = 0; row < 5; row++) {
//       for (let col = 0; col < 8; col++) {
//         const offsetX = row % 2 === 0 ? 0 : hexSize * 0.9;
//         hexNodes.push({
//           x: col * hexSize * 1.8 + offsetX - 20,
//           y: row * hexSize * 1.1 - 10,
//           pulse: Math.random() * Math.PI * 2,
//           speed: 0.018 + Math.random() * 0.012,
//         });
//       }
//     }

//     const draw = () => {
//       ctx.clearRect(0, 0, W, H);
//       t += 0.018;

//       // Background gradient
//       const bg = ctx.createLinearGradient(0, 0, W, H);
//       bg.addColorStop(0, "#fff8f5");
//       bg.addColorStop(0.5, "#fff3ee");
//       bg.addColorStop(1, "#fff8f5");
//       ctx.fillStyle = bg;
//       ctx.fillRect(0, 0, W, H);

//       // Hex grid — subtle pulsing dots connected by lines
//       ctx.save();
//       hexNodes.forEach((n, i) => {
//         n.pulse += n.speed;
//         const glow = (Math.sin(n.pulse) + 1) / 2; // 0..1
//         const alpha = 0.06 + glow * 0.18;
//         const radius = 2 + glow * 3;

//         // Connect to neighbors
//         hexNodes.forEach((m, j) => {
//           if (j <= i) return;
//           const dx = n.x - m.x, dy = n.y - m.y;
//           const dist = Math.sqrt(dx*dx + dy*dy);
//           if (dist < hexSize * 2.2) {
//             const lineAlpha = (1 - dist / (hexSize * 2.2)) * 0.08;
//             ctx.beginPath();
//             ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
//             ctx.strokeStyle = `rgba(255,107,53,${lineAlpha})`;
//             ctx.lineWidth = 0.8;
//             ctx.stroke();
//           }
//         });

//         ctx.beginPath();
//         ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255,107,53,${alpha})`;
//         ctx.fill();
//       });
//       ctx.restore();

//       // Wave lines sweeping across
//       for (let w = 0; w < WAVE_COUNT; w++) {
//         const phase = t * 0.7 + (w * Math.PI * 2) / WAVE_COUNT;
//         const yBase = H * (0.2 + w * 0.15);
//         const amp   = 12 + w * 5;
//         const alpha = 0.08 + w * 0.025;

//         ctx.beginPath();
//         for (let x = 0; x <= W; x += 3) {
//           const y = yBase + Math.sin((x / W) * Math.PI * 3 + phase) * amp
//                            + Math.sin((x / W) * Math.PI * 6 + phase * 1.3) * (amp * 0.4);
//           x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//         }
//         ctx.strokeStyle = `rgba(255,107,53,${alpha})`;
//         ctx.lineWidth = 1.5;
//         ctx.stroke();
//       }

//       // Glowing orbs floating
//       orbs.forEach((o, i) => {
//         o.x += o.speedX + Math.sin(t * 0.4 + o.phase) * 0.3;
//         o.y += o.speedY + Math.cos(t * 0.35 + o.phase) * 0.3;
//         if (o.x < -o.r) o.x = W + o.r;
//         if (o.x > W + o.r) o.x = -o.r;
//         if (o.y < -o.r) o.y = H + o.r;
//         if (o.y > H + o.r) o.y = -o.r;

//         const pulse = (Math.sin(t * 0.9 + o.phase) + 1) / 2;
//         const r = o.r * (0.85 + pulse * 0.3);
//         const alpha = 0.55 + pulse * 0.3;

//         const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
//         grad.addColorStop(0, `rgba(255,${100 + i * 12},${30 + i * 8},${alpha})`);
//         grad.addColorStop(0.5, `rgba(255,107,53,${alpha * 0.4})`);
//         grad.addColorStop(1, "transparent");
//         ctx.beginPath();
//         ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
//         ctx.fillStyle = grad;
//         ctx.fill();
//       });

//       // Rotating ring in center
//       const cx = W / 2, cy = H / 2;
//       for (let ring = 0; ring < 3; ring++) {
//         const rr = 30 + ring * 22;
//         const rot = t * (ring % 2 === 0 ? 0.5 : -0.35) + ring;
//         const ringAlpha = 0.15 + ring * 0.05;

//         ctx.save();
//         ctx.translate(cx, cy);
//         ctx.rotate(rot);
//         ctx.beginPath();
//         ctx.arc(0, 0, rr, 0, Math.PI * 2);
//         ctx.strokeStyle = `rgba(255,107,53,${ringAlpha})`;
//         ctx.lineWidth = 1.5;
//         ctx.setLineDash([6, 10]);
//         ctx.stroke();
//         ctx.setLineDash([]);

//         // Dots on ring
//         const dotCount = 3 + ring;
//         for (let d = 0; d < dotCount; d++) {
//           const angle = (d / dotCount) * Math.PI * 2;
//           const dx = Math.cos(angle) * rr;
//           const dy = Math.sin(angle) * rr;
//           const glow = (Math.sin(t * 2 + d + ring) + 1) / 2;
//           ctx.beginPath();
//           ctx.arc(dx, dy, 3 + glow * 2, 0, Math.PI * 2);
//           ctx.fillStyle = `rgba(255,107,53,${0.5 + glow * 0.5})`;
//           ctx.shadowBlur = 8 + glow * 8;
//           ctx.shadowColor = "#FF6B35";
//           ctx.fill();
//           ctx.shadowBlur = 0;
//         }
//         ctx.restore();
//       }

//       // Center core glow
//       const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
//       coreGlow.addColorStop(0, `rgba(255,107,53,${0.5 + Math.sin(t * 1.2) * 0.2})`);
//       coreGlow.addColorStop(0.5, "rgba(255,107,53,0.15)");
//       coreGlow.addColorStop(1, "transparent");
//       ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2);
//       ctx.fillStyle = coreGlow; ctx.fill();

//       // Center solid dot
//       ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2);
//       ctx.fillStyle = "#FF6B35";
//       ctx.shadowBlur = 16; ctx.shadowColor = "#FF6B35";
//       ctx.fill(); ctx.shadowBlur = 0;

//       // Sparkle stars twinkling
//       sparks.forEach(s => {
//         s.phase += s.speed;
//         const a = (Math.sin(s.phase) + 1) / 2;
//         ctx.beginPath();
//         ctx.arc(s.x, s.y, s.r * a, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255,107,53,${a * 0.7})`;
//         ctx.shadowBlur = a * 6; ctx.shadowColor = "#FF6B35";
//         ctx.fill(); ctx.shadowBlur = 0;
//       });

//       animRef.current = requestAnimationFrame(draw);
//     };

//     draw();
//     return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", onResize); };
//   }, []);

//   return (
//     <div className="fu2" style={{
//       borderRadius: 16,
//       overflow: "hidden",
//       marginBottom: 18,
//       border: "1.5px solid rgba(255,107,53,0.18)",
//       boxShadow: "0 4px 24px rgba(255,107,53,0.1)",
//       position: "relative",
//       height: 180,
//     }}>
//       <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block" }} />
//       {/* Overlay badge */}
//       <div style={{
//         position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)",
//         display:"flex", alignItems:"center", gap:6,
//         background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
//         border:"1px solid rgba(255,107,53,0.25)",
//         borderRadius:999, padding:"4px 14px",
//         boxShadow:"0 2px 12px rgba(255,107,53,0.15)",
//         whiteSpace:"nowrap",
//       }}>
//         <div style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B35", animation:"ping-dot 1.6s ease-in-out infinite" }} />
//         <span style={{ fontSize:11, fontWeight:700, color:"#FF6B35" }}>SamayaHR · Live Platform</span>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════
//    MAIN PAGE
// ══════════════════════════════════════════ */
// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [showForm,  setShowForm]  = useState(false);
//   const [activeTab, setActiveTab] = useState("employee");
//   const [loading,   setLoading]   = useState(false);
//   const [showPass,  setShowPass]  = useState(false);
//   const [formData,  setFormData]  = useState({ email:"", password:"", companyKey:"" });

//   const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

//   const getLoginApi = () => {
//     const b = API_BASE_URL.replace(/\/+$/, "");
//     return activeTab === "company"
//       ? (b ? `${b}/api/global-admin/companies/company-login` : "/api/global-admin/companies/company-login")
//       : (b ? `${b}/api/auth/login` : "/api/auth/login");
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const isC = activeTab === "company";
//     const payload = isC
//       ? { officialEmail: formData.email, tenantCode: formData.companyKey }
//       : { email: formData.email, password: formData.password };
//     setLoading(true);
//     try {
//       const res  = await fetch(getLoginApi(), { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
//       const data = await res.json();
//       if (!res.ok || !data.success) { alert("Error: " + (data?.message || "Login failed")); return; }
//       const token = data?.data?.token ?? null;
//       if (!token) { alert("Token missing"); return; }
//       localStorage.setItem("token", `Bearer ${token}`);
//       if (isC) {
//         localStorage.setItem("companyId",   String(data?.data?.companyId || ""));
//         localStorage.setItem("companyName", data?.data?.displayName || "");
//         localStorage.setItem("tenantCode",  data?.data?.tenantCode || "");
//         localStorage.setItem("userRole", "COMPANY_ADMIN");
//         window.location.href = "/super-admin/dashboard";
//       } else {
//         const role = data.data?.role || "EMPLOYEE";
//         const uid  = data?.data?.userId || data?.data?.id;
//         localStorage.setItem("userId",       String(uid));
//         localStorage.setItem("employeeName", data.data?.fullName || data.data?.name || "");
//         localStorage.setItem("userRole",     role);
//         //8/32026 tennat code added because for all employees means for all roles
//         // if (role === "ADMIN" || role === "GLOBALADMIN") {
//         //   localStorage.setItem("tenantCode",  data.data?.tenantCode || "");
//         //   localStorage.setItem("companyId",   String(data.data?.companyId || ""));
//         //   localStorage.setItem("companyName", data.data?.companyName || "");
//         // }
//         // AFTER (saves for ALL roles including EMPLOYEE)
//             localStorage.setItem("tenantCode",  data.data?.tenantCode  || "");
//             localStorage.setItem("companyId",   String(data.data?.companyId || ""));
//             localStorage.setItem("companyName", data.data?.companyName || "");
//             localStorage.setItem("employeeId",  data.data?.employeeId  || "");

//         if      (role === "GLOBALADMIN") window.location.href = "/global-admin/dashboard";
//         else if (role === "ADMIN")       window.location.href = "/admin/dashboard";
//         else                             window.location.href = "/employee/dashboard";
//       }
//     } catch (err) { alert("Login error: " + err.message); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div style={{ minHeight:"100vh", background:"#F7F8FA" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
//         *, *::before, *::after { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
//         .sora { font-family:'Sora',sans-serif !important; }

//         @keyframes floatA     { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-11px) rotate(1deg)} }
//         @keyframes floatB     { 0%,100%{transform:translateY(0) rotate(1deg)}  50%{transform:translateY(9px) rotate(-1deg)} }
//         @keyframes floatC     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
//         @keyframes fadeUp     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes ping-dot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(2.2)} }
//         @keyframes gp         { 0%,100%{opacity:.25} 50%{opacity:.55} }
//         @keyframes spin-loader{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

//         .fu1{animation:fadeUp .45s ease both .05s}
//         .fu2{animation:fadeUp .45s ease both .15s}
//         .fu3{animation:fadeUp .45s ease both .25s}
//         .fu4{animation:fadeUp .45s ease both .35s}
//         .fu5{animation:fadeUp .45s ease both .45s}

//         .lg-input {
//           width:100%; border:1.5px solid #e5e7eb; border-radius:12px;
//           background:#fff; padding:11px 14px 11px 42px;
//           font-size:14px; color:#0D1F2D; outline:none;
//           transition:border-color .2s, box-shadow .2s;
//           font-family:'DM Sans',sans-serif;
//         }
//         .lg-input::placeholder { color:#9ca3af; }
//         .lg-input:focus { border-color:#FF6B35; box-shadow:0 0 0 3px rgba(255,107,53,.1); }

//         .coral-btn {
//           width:100%;
//           background:linear-gradient(135deg,#FF6B35 0%,#FF5722 50%,#ff7043 100%);
//           background-size:200% auto;
//           color:#fff; font-weight:800; font-size:15px; padding:13px;
//           border-radius:14px; border:none; cursor:pointer;
//           box-shadow:0 4px 24px rgba(255,107,53,.38);
//           transition:transform .22s, box-shadow .22s, background-position .4s;
//           display:flex; align-items:center; justify-content:center; gap:8px;
//           letter-spacing:.02em;
//         }
//         .coral-btn:hover    { transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,107,53,.5); background-position:right center; }
//         .coral-btn:disabled { opacity:.65; cursor:not-allowed; transform:none; }

//         .tab-btn {
//           flex:1; padding:9px; border-radius:10px; font-size:12px; font-weight:700;
//           cursor:pointer; border:none; transition:all .2s; font-family:'DM Sans',sans-serif;
//         }
//       `}</style>

//       {/* ── Navbar — same as BookDemo ── */}
//       <header style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 10px rgba(0,0,0,.05)" }}>
//         <nav style={{ maxWidth:1120, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:9 }}>
//             <div className="sora" style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#FF6B35,#FF5722)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:15 }}>S</div>
//             <span className="sora" style={{ fontWeight:900, fontSize:20, color:"#0D1F2D" }}>Samaya<span style={{ color:"#FF6B35" }}>HR</span></span>
//           </div>
//           <button onClick={() => navigate("/")}
//             style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"#6b7280", background:"none", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"7px 16px", cursor:"pointer", transition:"all .2s" }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor="#FF6B35"; e.currentTarget.style.color="#FF6B35"; }}
//             onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.color="#6b7280"; }}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
//             Back to Home
//           </button>
//         </nav>
//       </header>

//       {/* ── Main card — same layout as BookDemo ── */}
//       <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px 64px" }}>
//         <div style={{ display:"flex", borderRadius:28, overflow:"hidden", boxShadow:"0 20px 70px rgba(13,31,45,.15)" }}>

//           {/* ════ LEFT — Original orbit animation, warm dark bg ════ */}
//           <div style={{
//             width:"42%", flexShrink:0,
//             background:"linear-gradient(148deg, #0d0400 0%, #180800 30%, #1a0600 60%, #0d0300 100%)",
//             position:"relative", overflow:"hidden",
//             display:"flex", flexDirection:"column",
//             alignItems:"center", justifyContent:"center",
//             minHeight:560,
//           }}>
//             {/* Warm ambient orbs */}
//             <div style={{ position:"absolute", top:-80, left:-60, width:360, height:360, borderRadius:"50%", filter:"blur(90px)", background:"rgba(255,107,53,0.28)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite" }} />
//             <div style={{ position:"absolute", bottom:-60, right:-40, width:300, height:300, borderRadius:"50%", filter:"blur(80px)", background:"rgba(255,60,10,0.22)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite 1s" }} />
//             <div style={{ position:"absolute", top:"40%", right:0, width:240, height:240, borderRadius:"50%", filter:"blur(70px)", background:"rgba(255,140,50,0.16)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite 2s" }} />

//             {/* Divider line */}
//             <div style={{ position:"absolute", top:0, right:0, width:1, height:"100%", background:"linear-gradient(to bottom, transparent, rgba(255,107,53,0.45) 30%, rgba(255,107,53,0.45) 70%, transparent)", zIndex:20, pointerEvents:"none" }} />

//             {/* Canvas orbit animation */}
//             <HROrbitScene />

//             {/* Floating metric cards */}
//             <MCard style={{ top:26, left:18, animation:"floatA 4.5s ease-in-out infinite" }}
//               icon="💸" title="Payroll Done" sub="✓ 248 employees" subColor="#4ade80" />
//             <MCard style={{ bottom:52, right:14, animation:"floatB 5.5s ease-in-out infinite" }}
//               icon="⏰" title="Team Check-In" sub="48 / 50 present" subColor="#fbbf24" />
//             <MCard style={{ top:"43%", right:12, animation:"floatC 6s ease-in-out infinite" }}
//               icon="🏖️" title="Leave Approved" sub="3 requests · instant" subColor="#fb923c" />

//             {/* Center logo badge */}
//             <div style={{
//               position:"absolute", top:"50%", left:"50%",
//               transform:"translate(-50%,-50%)",
//               zIndex:5, pointerEvents:"none",
//               width:36, height:36, borderRadius:11,
//               background:"rgba(8,3,1,0.96)",
//               border:"1.5px solid rgba(255,107,53,0.9)",
//               display:"flex", alignItems:"center", justifyContent:"center",
//               boxShadow:"0 0 22px rgba(255,107,53,0.7), 0 0 50px rgba(255,80,20,0.3)",
//             }}>
//               <img src={logo} alt="SamayaHR" style={{ width:22, height:22, objectFit:"contain" }} />
//             </div>

//             {/* Live badge */}
//             <div style={{ position:"absolute", top:20, left:"50%", transform:"translateX(-50%)", zIndex:10 }}>
//               <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,107,53,.14)", border:"1px solid rgba(255,107,53,.3)", borderRadius:999, padding:"5px 14px" }}>
//                 <span style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B35", display:"inline-block", animation:"ping-dot 1.8s ease-in-out infinite" }} />
//                 <span style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", color:"#FF6B35", textTransform:"uppercase", whiteSpace:"nowrap" }}>Live · Secure Access</span>
//               </div>
//             </div>

//             {/* Watermark */}
//             <div style={{ position:"absolute", bottom:16, left:0, right:0, textAlign:"center", zIndex:10, pointerEvents:"none" }}>
//               <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.1)", letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:"Sora,sans-serif", margin:0 }}>
//                 Samaya<span style={{ color:"rgba(255,107,53,0.3)" }}>HR</span> · Workplace OS
//               </p>
//             </div>
//           </div>

//           {/* ════ RIGHT — Clean white form, same as BookDemo ════ */}
//           <div style={{ flex:1, background:"#fff", padding:"44px 40px", display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"auto" }}>
//             <div style={{ maxWidth:360, margin:"0 auto", width:"100%" }}>

//               {/* Header */}
//               <div className="fu1" style={{ marginBottom:24 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
//                   <div style={{ width:44, height:44, borderRadius:13, background:"linear-gradient(135deg,#FF6B35,#FF5722)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(255,107,53,.3)", flexShrink:0, position:"relative" }}>
//                     <img src="/assets/Zlabs-Logo.png" alt="SamayaHR" style={{ width:28, height:28, objectFit:"contain" }} />
//                     <div style={{ position:"absolute", top:-2, right:-2, width:11, height:11, borderRadius:"50%", background:"#22c55e", border:"2px solid #fff" }} />
//                   </div>
//                   <div>
//                     <h3 className="sora" style={{ fontSize:22, fontWeight:900, color:"#0D1F2D", margin:0 }}>
//                       {showForm ? "Sign in to workspace" : "Welcome back 👋"}
//                     </h3>
//                     <p style={{ fontSize:12, color:"#9ca3af", margin:"3px 0 0" }}>
//                       {activeTab === "company" ? "Enter your company credentials to continue." : "Takes 10 seconds · Pick up where you left off."}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {!showForm ? (
//                 <>
//                   {/* ── Pure Visual Animation ── */}
//                   <VisualAnimation />

//                   {/* CTA */}
//                   <button className="fu4 coral-btn" onClick={() => setShowForm(true)}>
//                     Access My Workspace
//                     <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
//                   </button>

//                   <p className="fu5" style={{ textAlign:"center", marginTop:14, fontSize:12, color:"#9ca3af" }}>
//                     New here?{" "}
//                     <a href="/solutions/bookdemo" style={{ color:"#FF6B35", fontWeight:700, textDecoration:"none" }}>Get a free personalised demo →</a>
//                   </p>

//                   {/* Trust row — same as BookDemo */}
//                   <div style={{ display:"flex", flexWrap:"wrap", gap:14, background:"#F7F8FA", borderRadius:12, padding:"11px 14px", marginTop:16 }}>
//                     {[["🔒","Secure & Private"],["⚡","Instant Login"]].map(([ic,tx]) => (
//                       <div key={tx} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#6b7280", fontWeight:500 }}>
//                         <span>{ic}</span>{tx}
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* Tab toggle */}
//                   <div className="fu1" style={{ display:"flex", gap:4, borderRadius:12, padding:4, background:"#f3f4f6", marginBottom:20, border:"1px solid #e5e7eb" }}>
//                     {[["employee","👤 Employee"],["company","🏢 Company"]].map(([tab, label]) => (
//                       <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{
//                         background: activeTab === tab ? "linear-gradient(135deg,#FF6B35,#FF5722)" : "transparent",
//                         color:      activeTab === tab ? "#fff" : "#6b7280",
//                         boxShadow:  activeTab === tab ? "0 2px 10px rgba(255,107,53,.3)" : "none",
//                       }}>{label}</button>
//                     ))}
//                   </div>

//                   <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

//                     {/* Email */}
//                     <div className="fu2">
//                       <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
//                         Email address <span style={{ color:"#FF6B35" }}>*</span>
//                       </label>
//                       <div style={{ position:"relative" }}>
//                         <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                           <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
//                         </div>
//                         <input type="email" name="email" className="lg-input"
//                           placeholder={activeTab === "company" ? "admin@company.com" : "you@company.com"}
//                           value={formData.email} onChange={handleChange} required />
//                       </div>
//                     </div>

//                     {activeTab === "company" ? (
//                       <div className="fu3">
//                         <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
//                           Pass Code <span style={{ color:"#FF6B35" }}>*</span>
//                         </label>
//                         <div style={{ position:"relative" }}>
//                           <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                             <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
//                           </div>
//                           <input type="text" name="companyKey" className="lg-input" placeholder="e.g. ACME2024"
//                             value={formData.companyKey} onChange={handleChange} required />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="fu3">
//                         <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
//                           <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>
//                             Password <span style={{ color:"#FF6B35" }}>*</span>
//                           </label>
//                           <a href="/forgot-password" style={{ fontSize:11, fontWeight:700, color:"#FF6B35", textDecoration:"none" }}>Forgot password?</a>
//                         </div>
//                         <div style={{ position:"relative" }}>
//                           <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                             <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
//                           </div>
//                           <input type={showPass ? "text" : "password"} name="password" className="lg-input"
//                             placeholder="••••••••" style={{ paddingRight:42 }}
//                             value={formData.password} onChange={handleChange} required />
//                           <button type="button" onClick={() => setShowPass(p => !p)}
//                             style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0 }}>
//                             {showPass
//                               ? <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
//                               : <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
//                             }
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     <button type="submit" disabled={loading} className="fu4 coral-btn" style={{ marginTop:4 }}>
//                       {loading
//                         ? <><svg style={{ animation:"spin-loader 1s linear infinite", width:15, height:15 }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity:.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity:.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
//                         : <>Sign In <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
//                       }
//                     </button>
//                   </form>

//                   <button onClick={() => setShowForm(false)}
//                     style={{ marginTop:14, width:"100%", background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, color:"#9ca3af", textAlign:"center" }}>
//                     ← Back to sign-in screen
//                   </button>
//                 </>
//               )}

//               <p className="fu5" style={{ marginTop:16, textAlign:"center", fontSize:11, color:"#9ca3af", lineHeight:1.7 }}>
//                 By signing in, you agree to our{" "}
//                 <a href="/terms"   style={{ color:"#FF6B35", textDecoration:"none" }}>Terms of Service</a>{" "}&{" "}
//                 <a href="/privacy" style={{ color:"#FF6B35", textDecoration:"none" }}>Privacy Policy</a>.
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


//new role naviagtion added and no Protected Route 
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "/assets/Zlabs-Logo.png?url";

// const getApiBaseUrl = () => {
//   const fromEnv =
//     import.meta.env?.VITE_API_BASE_URL &&
//     import.meta.env.VITE_API_BASE_URL.trim();
//   if (fromEnv) return fromEnv;
//   if (
//     window.location.hostname === "localhost" ||
//     window.location.hostname === "127.0.0.1"
//   )
//     return "http://localhost:8080";
//   return "";
// };
// const API_BASE_URL = getApiBaseUrl();

// /* ─────────────────────────────────────────────────────────────
//    ROLE → DASHBOARD REDIRECT MAP
// ───────────────────────────────────────────────────────────── */
// const ROLE_REDIRECT = {
//   GLOBAL_ADMIN: "/global-admin/dashboard",
//   GLOBALADMIN: "/global-admin/dashboard",
//   SUPER_ADMIN: "/super-admin/dashboard",
//   SUPERADMIN: "/super-admin/dashboard",
//   COMPANY_ADMIN: "/super-admin/dashboard",
//   COMPANYADMIN: "/super-admin/dashboard",
//   ADMIN: "/admin/dashboard",
//   EMPLOYEE: "/employee/dashboard",
// };

// /* ══════════════════════════════════════════
//    LEFT PANEL — Original orbit canvas animation
// ══════════════════════════════════════════ */
// function HROrbitScene() {
//   const canvasRef = useRef(null);
//   const animRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let W = canvas.offsetWidth,
//       H = canvas.offsetHeight;
//     canvas.width = W;
//     canvas.height = H;

//     const resize = () => {
//       W = canvas.offsetWidth;
//       H = canvas.offsetHeight;
//       canvas.width = W;
//       canvas.height = H;
//     };
//     window.addEventListener("resize", resize);

//     const ICONS = ["💸", "⏱️", "🏖️", "📊", "🔐", "📱", "🎯", "🚀", "👥", "📋"];
//     const orbits = [
//       { r: 78, speed: 0.009, nodes: 3, offset: 0 },
//       { r: 138, speed: -0.006, nodes: 5, offset: Math.PI / 5 },
//       { r: 198, speed: 0.004, nodes: 6, offset: Math.PI / 9 },
//     ];
//     const COLS = ["rgba(255,107,53,", "rgba(255,160,80,", "rgba(255,70,30,"];

//     const PCOLS = [
//       "rgba(255,107,53,",
//       "rgba(255,160,80,",
//       "rgba(255,200,100,",
//       "rgba(0,194,168,",
//     ];
//     const particles = Array.from({ length: 65 }, () => ({
//       x: Math.random() * W,
//       y: Math.random() * H,
//       r: Math.random() * 1.8 + 0.4,
//       vx: (Math.random() - 0.5) * 0.35,
//       vy: (Math.random() - 0.5) * 0.35,
//       alpha: Math.random() * 0.6 + 0.15,
//       col: PCOLS[Math.floor(Math.random() * PCOLS.length)],
//     }));

//     const pulses = [0, 85, 170].map((s) => ({ r: s, max: 215, speed: 0.65 }));
//     let t = 0;

//     const draw = () => {
//       ctx.clearRect(0, 0, W, H);
//       const cx = W / 2,
//         cy = H / 2;
//       t += 0.016;

//       // grid
//       ctx.save();
//       ctx.strokeStyle = "rgba(255,107,53,0.05)";
//       ctx.lineWidth = 1;
//       for (let x = 0; x < W; x += 44) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, H);
//         ctx.stroke();
//       }
//       for (let y = 0; y < H; y += 44) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(W, y);
//         ctx.stroke();
//       }
//       ctx.restore();

//       // particles
//       particles.forEach((p) => {
//         p.x += p.vx;
//         p.y += p.vy;
//         if (p.x < 0) p.x = W;
//         if (p.x > W) p.x = 0;
//         if (p.y < 0) p.y = H;
//         if (p.y > H) p.y = 0;
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = p.col + p.alpha + ")";
//         ctx.shadowBlur = 8;
//         ctx.shadowColor = p.col + "0.9)";
//         ctx.fill();
//         ctx.shadowBlur = 0;
//       });

//       // pulse rings
//       pulses.forEach((p) => {
//         p.r += p.speed;
//         if (p.r > p.max) p.r = 0;
//         const a = (1 - p.r / p.max) * 0.22;
//         ctx.beginPath();
//         ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
//         ctx.strokeStyle = `rgba(255,107,53,${a})`;
//         ctx.lineWidth = 1.5;
//         ctx.stroke();
//       });

//       // orbits
//       orbits.forEach((orb, oi) => {
//         ctx.beginPath();
//         ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
//         ctx.strokeStyle = COLS[oi] + "0.15)";
//         ctx.lineWidth = 1;
//         ctx.setLineDash([5, 10]);
//         ctx.stroke();
//         ctx.setLineDash([]);

//         for (let n = 0; n < orb.nodes; n++) {
//           const angle = (2 * Math.PI * n) / orb.nodes + t * orb.speed + orb.offset;
//           const nx = cx + orb.r * Math.cos(angle);
//           const ny = cy + orb.r * Math.sin(angle);

//           const lg = ctx.createLinearGradient(cx, cy, nx, ny);
//           lg.addColorStop(0, "transparent");
//           lg.addColorStop(1, COLS[oi] + "0.2)");
//           ctx.beginPath();
//           ctx.moveTo(cx, cy);
//           ctx.lineTo(nx, ny);
//           ctx.strokeStyle = lg;
//           ctx.lineWidth = 1;
//           ctx.stroke();

//           const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, 22);
//           rg.addColorStop(0, COLS[oi] + "0.42)");
//           rg.addColorStop(1, "transparent");
//           ctx.beginPath();
//           ctx.arc(nx, ny, 22, 0, Math.PI * 2);
//           ctx.fillStyle = rg;
//           ctx.fill();

//           ctx.beginPath();
//           ctx.arc(nx, ny, 13, 0, Math.PI * 2);
//           ctx.fillStyle = "rgba(10,5,2,0.92)";
//           ctx.fill();
//           ctx.strokeStyle = COLS[oi] + "0.8)";
//           ctx.lineWidth = 1.5;
//           ctx.stroke();

//           ctx.font = "11px serif";
//           ctx.textAlign = "center";
//           ctx.textBaseline = "middle";
//           ctx.fillText(ICONS[(oi * 4 + n) % ICONS.length], nx, ny);
//         }
//       });

//       // core glow
//       const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
//       cg.addColorStop(0, "rgba(255,107,53,0.42)");
//       cg.addColorStop(0.5, "rgba(255,80,20,0.14)");
//       cg.addColorStop(1, "transparent");
//       ctx.beginPath();
//       ctx.arc(cx, cy, 55, 0, Math.PI * 2);
//       ctx.fillStyle = cg;
//       ctx.fill();

//       ctx.save();
//       ctx.translate(cx, cy);
//       ctx.rotate(t * 0.4);
//       ctx.beginPath();
//       ctx.arc(0, 0, 32, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(255,107,53,0.55)";
//       ctx.lineWidth = 1.5;
//       ctx.setLineDash([6, 6]);
//       ctx.stroke();
//       ctx.setLineDash([]);
//       ctx.restore();

//       ctx.save();
//       ctx.translate(cx, cy);
//       ctx.rotate(-t * 0.25);
//       ctx.beginPath();
//       ctx.arc(0, 0, 23, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(255,160,80,0.4)";
//       ctx.lineWidth = 1;
//       ctx.setLineDash([3, 8]);
//       ctx.stroke();
//       ctx.setLineDash([]);
//       ctx.restore();

//       ctx.beginPath();
//       ctx.arc(cx, cy, 17, 0, Math.PI * 2);
//       ctx.fillStyle = "rgba(8,4,2,0.96)";
//       ctx.fill();
//       ctx.strokeStyle = "rgba(255,107,53,0.95)";
//       ctx.lineWidth = 2;
//       ctx.stroke();

//       animRef.current = requestAnimationFrame(draw);
//     };

//     draw();
//     return () => {
//       cancelAnimationFrame(animRef.current);
//       window.removeEventListener("resize", resize);
//     };
//   }, []);

//   return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
// }

// /* Floating metric card */
// function MCard({ style, icon, title, sub, subColor }) {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         zIndex: 10,
//         background: "rgba(10,4,2,0.85)",
//         border: "1px solid rgba(255,107,53,0.35)",
//         backdropFilter: "blur(16px)",
//         borderRadius: 14,
//         padding: "9px 14px",
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         boxShadow: "0 8px 28px rgba(0,0,0,0.45), 0 0 18px rgba(255,107,53,0.12)",
//         ...style,
//       }}
//     >
//       <div
//         style={{
//           width: 30,
//           height: 30,
//           borderRadius: 9,
//           background: "rgba(255,107,53,0.14)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 14,
//           flexShrink: 0,
//         }}
//       >
//         {icon}
//       </div>
//       <div>
//         <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "Sora,sans-serif" }}>
//           {title}
//         </div>
//         <div style={{ fontSize: 10, color: subColor, marginTop: 1 }}>{sub}</div>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════
//    PURE VISUAL ANIMATION (no text/data)
// ══════════════════════════════════════════ */
// function VisualAnimation() {
//   const canvasRef = useRef(null);
//   const animRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let W = canvas.offsetWidth,
//       H = canvas.offsetHeight;
//     canvas.width = W;
//     canvas.height = H;
//     const onResize = () => {
//       W = canvas.offsetWidth;
//       H = canvas.offsetHeight;
//       canvas.width = W;
//       canvas.height = H;
//     };
//     window.addEventListener("resize", onResize);

//     let t = 0;

//     const orbs = Array.from({ length: 6 }, (_, i) => ({
//       x: W * (0.15 + ((i * 0.18) % 0.85)),
//       y: H * (0.2 + ((i * 0.27) % 0.7)),
//       r: 28 + i * 8,
//       speedX: (Math.random() - 0.5) * 0.5,
//       speedY: (Math.random() - 0.5) * 0.5,
//       hue: [22, 30, 16, 25, 18, 28][i],
//       phase: (i * Math.PI) / 3,
//     }));

//     const WAVE_COUNT = 5;

//     const sparks = Array.from({ length: 22 }, () => ({
//       x: Math.random() * W,
//       y: Math.random() * H,
//       r: Math.random() * 2.5 + 0.5,
//       alpha: Math.random(),
//       speed: Math.random() * 0.02 + 0.008,
//       phase: Math.random() * Math.PI * 2,
//     }));

//     const hexNodes = [];
//     const hexSize = 38;
//     for (let row = 0; row < 5; row++) {
//       for (let col = 0; col < 8; col++) {
//         const offsetX = row % 2 === 0 ? 0 : hexSize * 0.9;
//         hexNodes.push({
//           x: col * hexSize * 1.8 + offsetX - 20,
//           y: row * hexSize * 1.1 - 10,
//           pulse: Math.random() * Math.PI * 2,
//           speed: 0.018 + Math.random() * 0.012,
//         });
//       }
//     }

//     const draw = () => {
//       ctx.clearRect(0, 0, W, H);
//       t += 0.018;

//       const bg = ctx.createLinearGradient(0, 0, W, H);
//       bg.addColorStop(0, "#fff8f5");
//       bg.addColorStop(0.5, "#fff3ee");
//       bg.addColorStop(1, "#fff8f5");
//       ctx.fillStyle = bg;
//       ctx.fillRect(0, 0, W, H);

//       ctx.save();
//       hexNodes.forEach((n, i) => {
//         n.pulse += n.speed;
//         const glow = (Math.sin(n.pulse) + 1) / 2;
//         const alpha = 0.06 + glow * 0.18;
//         const radius = 2 + glow * 3;

//         hexNodes.forEach((m, j) => {
//           if (j <= i) return;
//           const dx = n.x - m.x,
//             dy = n.y - m.y;
//           const dist = Math.sqrt(dx * dx + dy * dy);
//           if (dist < hexSize * 2.2) {
//             const lineAlpha = (1 - dist / (hexSize * 2.2)) * 0.08;
//             ctx.beginPath();
//             ctx.moveTo(n.x, n.y);
//             ctx.lineTo(m.x, m.y);
//             ctx.strokeStyle = `rgba(255,107,53,${lineAlpha})`;
//             ctx.lineWidth = 0.8;
//             ctx.stroke();
//           }
//         });

//         ctx.beginPath();
//         ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255,107,53,${alpha})`;
//         ctx.fill();
//       });
//       ctx.restore();

//       for (let w = 0; w < WAVE_COUNT; w++) {
//         const phase = t * 0.7 + (w * Math.PI * 2) / WAVE_COUNT;
//         const yBase = H * (0.2 + w * 0.15);
//         const amp = 12 + w * 5;
//         const alpha = 0.08 + w * 0.025;

//         ctx.beginPath();
//         for (let x = 0; x <= W; x += 3) {
//           const y =
//             yBase +
//             Math.sin((x / W) * Math.PI * 3 + phase) * amp +
//             Math.sin((x / W) * Math.PI * 6 + phase * 1.3) * (amp * 0.4);
//           x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//         }
//         ctx.strokeStyle = `rgba(255,107,53,${alpha})`;
//         ctx.lineWidth = 1.5;
//         ctx.stroke();
//       }

//       orbs.forEach((o, i) => {
//         o.x += o.speedX + Math.sin(t * 0.4 + o.phase) * 0.3;
//         o.y += o.speedY + Math.cos(t * 0.35 + o.phase) * 0.3;
//         if (o.x < -o.r) o.x = W + o.r;
//         if (o.x > W + o.r) o.x = -o.r;
//         if (o.y < -o.r) o.y = H + o.r;
//         if (o.y > H + o.r) o.y = -o.r;

//         const pulse = (Math.sin(t * 0.9 + o.phase) + 1) / 2;
//         const r = o.r * (0.85 + pulse * 0.3);
//         const alpha = 0.55 + pulse * 0.3;

//         const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
//         grad.addColorStop(0, `rgba(255,${100 + i * 12},${30 + i * 8},${alpha})`);
//         grad.addColorStop(0.5, `rgba(255,107,53,${alpha * 0.4})`);
//         grad.addColorStop(1, "transparent");
//         ctx.beginPath();
//         ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
//         ctx.fillStyle = grad;
//         ctx.fill();
//       });

//       const cx = W / 2,
//         cy = H / 2;
//       for (let ring = 0; ring < 3; ring++) {
//         const rr = 30 + ring * 22;
//         const rot = t * (ring % 2 === 0 ? 0.5 : -0.35) + ring;
//         const ringAlpha = 0.15 + ring * 0.05;

//         ctx.save();
//         ctx.translate(cx, cy);
//         ctx.rotate(rot);
//         ctx.beginPath();
//         ctx.arc(0, 0, rr, 0, Math.PI * 2);
//         ctx.strokeStyle = `rgba(255,107,53,${ringAlpha})`;
//         ctx.lineWidth = 1.5;
//         ctx.setLineDash([6, 10]);
//         ctx.stroke();
//         ctx.setLineDash([]);

//         const dotCount = 3 + ring;
//         for (let d = 0; d < dotCount; d++) {
//           const angle = (d / dotCount) * Math.PI * 2;
//           const dx = Math.cos(angle) * rr;
//           const dy = Math.sin(angle) * rr;
//           const glow = (Math.sin(t * 2 + d + ring) + 1) / 2;
//           ctx.beginPath();
//           ctx.arc(dx, dy, 3 + glow * 2, 0, Math.PI * 2);
//           ctx.fillStyle = `rgba(255,107,53,${0.5 + glow * 0.5})`;
//           ctx.shadowBlur = 8 + glow * 8;
//           ctx.shadowColor = "#FF6B35";
//           ctx.fill();
//           ctx.shadowBlur = 0;
//         }
//         ctx.restore();
//       }

//       const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
//       coreGlow.addColorStop(0, `rgba(255,107,53,${0.5 + Math.sin(t * 1.2) * 0.2})`);
//       coreGlow.addColorStop(0.5, "rgba(255,107,53,0.15)");
//       coreGlow.addColorStop(1, "transparent");
//       ctx.beginPath();
//       ctx.arc(cx, cy, 24, 0, Math.PI * 2);
//       ctx.fillStyle = coreGlow;
//       ctx.fill();

//       ctx.beginPath();
//       ctx.arc(cx, cy, 7, 0, Math.PI * 2);
//       ctx.fillStyle = "#FF6B35";
//       ctx.shadowBlur = 16;
//       ctx.shadowColor = "#FF6B35";
//       ctx.fill();
//       ctx.shadowBlur = 0;

//       sparks.forEach((s) => {
//         s.phase += s.speed;
//         const a = (Math.sin(s.phase) + 1) / 2;
//         ctx.beginPath();
//         ctx.arc(s.x, s.y, s.r * a, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255,107,53,${a * 0.7})`;
//         ctx.shadowBlur = a * 6;
//         ctx.shadowColor = "#FF6B35";
//         ctx.fill();
//         ctx.shadowBlur = 0;
//       });

//       animRef.current = requestAnimationFrame(draw);
//     };

//     draw();
//     return () => {
//       cancelAnimationFrame(animRef.current);
//       window.removeEventListener("resize", onResize);
//     };
//   }, []);

//   return (
//     <div
//       className="fu2"
//       style={{
//         borderRadius: 16,
//         overflow: "hidden",
//         marginBottom: 18,
//         border: "1.5px solid rgba(255,107,53,0.18)",
//         boxShadow: "0 4px 24px rgba(255,107,53,0.1)",
//         position: "relative",
//         height: 180,
//       }}
//     >
//       <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
//       <div
//         style={{
//           position: "absolute",
//           bottom: 12,
//           left: "50%",
//           transform: "translateX(-50%)",
//           display: "flex",
//           alignItems: "center",
//           gap: 6,
//           background: "rgba(255,255,255,0.85)",
//           backdropFilter: "blur(8px)",
//           border: "1px solid rgba(255,107,53,0.25)",
//           borderRadius: 999,
//           padding: "4px 14px",
//           boxShadow: "0 2px 12px rgba(255,107,53,0.15)",
//           whiteSpace: "nowrap",
//         }}
//       >
//         <div
//           style={{
//             width: 6,
//             height: 6,
//             borderRadius: "50%",
//             background: "#FF6B35",
//             animation: "ping-dot 1.6s ease-in-out infinite",
//           }}
//         />
//         <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B35" }}>
//           SamayaHR · Live Platform
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════
//    MAIN PAGE
// ══════════════════════════════════════════ */
// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [showForm, setShowForm] = useState(false);
//   const [activeTab, setActiveTab] = useState("employee");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     companyKey: "",
//   });

//   const handleChange = (e) => {
//     setError("");
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   const getLoginApi = () => {
//     const b = API_BASE_URL.replace(/\/+$/, "");
//     return activeTab === "company"
//       ? b
//         ? `${b}/api/global-admin/companies/company-login`
//         : "/api/global-admin/companies/company-login"
//       : b
//       ? `${b}/api/auth/login`
//       : "/api/auth/login";
//   };

//   const saveCommonData = (data = {}) => {
//     localStorage.setItem("tenantCode", data?.tenantCode || "");
//     localStorage.setItem("companyId", String(data?.companyId || ""));
//     localStorage.setItem("companyName", data?.companyName || data?.displayName || "");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       if (activeTab === "company") {
//         const payload = {
//           officialEmail: formData.email,
//           tenantCode: formData.companyKey,
//         };

//         const res = await fetch(getLoginApi(), {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });

//         const data = await res.json();

//         if (!res.ok || !data.success) {
//           throw new Error(data?.message || "Company login failed");
//         }

//         const token = data?.data?.token;
//         if (!token) throw new Error("Token missing");

//         const role = String(
//           data?.data?.role || data?.data?.userRole || "COMPANY_ADMIN"
//         ).toUpperCase();

//         localStorage.setItem("token", `Bearer ${token}`);
//         localStorage.setItem("role", role);
//         localStorage.setItem("userRole", role);
//         saveCommonData(data?.data || {});

//         const redirect = ROLE_REDIRECT[role] || "/super-admin/dashboard";
//         window.location.href = redirect;
//       } else {
//         const payload = {
//           email: formData.email,
//           password: formData.password,
//         };

//         const res = await fetch(getLoginApi(), {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });

//         const data = await res.json();

//         if (!res.ok || !data.success) {
//           throw new Error(data?.message || "Login failed");
//         }

//         const token = data?.data?.token;
//         if (!token) throw new Error("Token missing");

//         const role = String(data?.data?.role || "EMPLOYEE").toUpperCase();
//         const uid = data?.data?.userId || data?.data?.id || "";

//         localStorage.setItem("token", `Bearer ${token}`);
//         localStorage.setItem("userId", String(uid));
//         localStorage.setItem("employeeName", data?.data?.fullName || data?.data?.name || "");
//         localStorage.setItem("employeeId", data?.data?.employeeId || "");
//         localStorage.setItem("role", role);
//         localStorage.setItem("userRole", role);

//         saveCommonData(data?.data || {});

//         const redirect = ROLE_REDIRECT[role] || "/employee/dashboard";
//         window.location.href = redirect;
//       }
//     } catch (err) {
//       setError(err.message || "Login error");
//       alert("Error: " + (err.message || "Login failed"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
//         *, *::before, *::after { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
//         .sora { font-family:'Sora',sans-serif !important; }

//         @keyframes floatA     { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-11px) rotate(1deg)} }
//         @keyframes floatB     { 0%,100%{transform:translateY(0) rotate(1deg)}  50%{transform:translateY(9px) rotate(-1deg)} }
//         @keyframes floatC     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
//         @keyframes fadeUp     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes ping-dot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(2.2)} }
//         @keyframes gp         { 0%,100%{opacity:.25} 50%{opacity:.55} }
//         @keyframes spin-loader{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

//         .fu1{animation:fadeUp .45s ease both .05s}
//         .fu2{animation:fadeUp .45s ease both .15s}
//         .fu3{animation:fadeUp .45s ease both .25s}
//         .fu4{animation:fadeUp .45s ease both .35s}
//         .fu5{animation:fadeUp .45s ease both .45s}

//         .lg-input {
//           width:100%; border:1.5px solid #e5e7eb; border-radius:12px;
//           background:#fff; padding:11px 14px 11px 42px;
//           font-size:14px; color:#0D1F2D; outline:none;
//           transition:border-color .2s, box-shadow .2s;
//           font-family:'DM Sans',sans-serif;
//         }
//         .lg-input::placeholder { color:#9ca3af; }
//         .lg-input:focus { border-color:#FF6B35; box-shadow:0 0 0 3px rgba(255,107,53,.1); }

//         .coral-btn {
//           width:100%;
//           background:linear-gradient(135deg,#FF6B35 0%,#FF5722 50%,#ff7043 100%);
//           background-size:200% auto;
//           color:#fff; font-weight:800; font-size:15px; padding:13px;
//           border-radius:14px; border:none; cursor:pointer;
//           box-shadow:0 4px 24px rgba(255,107,53,.38);
//           transition:transform .22s, box-shadow .22s, background-position .4s;
//           display:flex; align-items:center; justify-content:center; gap:8px;
//           letter-spacing:.02em;
//         }
//         .coral-btn:hover    { transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,107,53,.5); background-position:right center; }
//         .coral-btn:disabled { opacity:.65; cursor:not-allowed; transform:none; }

//         .tab-btn {
//           flex:1; padding:9px; border-radius:10px; font-size:12px; font-weight:700;
//           cursor:pointer; border:none; transition:all .2s; font-family:'DM Sans',sans-serif;
//         }
//       `}</style>

//       <header style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 10px rgba(0,0,0,.05)" }}>
//         <nav style={{ maxWidth:1120, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:9 }}>
//             <div className="sora" style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#FF6B35,#FF5722)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:15 }}>S</div>
//             <span className="sora" style={{ fontWeight:900, fontSize:20, color:"#0D1F2D" }}>Samaya<span style={{ color:"#FF6B35" }}>HR</span></span>
//           </div>
//           <button onClick={() => navigate("/")}
//             style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"#6b7280", background:"none", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"7px 16px", cursor:"pointer", transition:"all .2s" }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor="#FF6B35"; e.currentTarget.style.color="#FF6B35"; }}
//             onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.color="#6b7280"; }}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
//             Back to Home
//           </button>
//         </nav>
//       </header>

//       <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px 64px" }}>
//         <div style={{ display:"flex", borderRadius:28, overflow:"hidden", boxShadow:"0 20px 70px rgba(13,31,45,.15)" }}>

//           <div style={{
//             width:"42%", flexShrink:0,
//             background:"linear-gradient(148deg, #0d0400 0%, #180800 30%, #1a0600 60%, #0d0300 100%)",
//             position:"relative", overflow:"hidden",
//             display:"flex", flexDirection:"column",
//             alignItems:"center", justifyContent:"center",
//             minHeight:560,
//           }}>
//             <div style={{ position:"absolute", top:-80, left:-60, width:360, height:360, borderRadius:"50%", filter:"blur(90px)", background:"rgba(255,107,53,0.28)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite" }} />
//             <div style={{ position:"absolute", bottom:-60, right:-40, width:300, height:300, borderRadius:"50%", filter:"blur(80px)", background:"rgba(255,60,10,0.22)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite 1s" }} />
//             <div style={{ position:"absolute", top:"40%", right:0, width:240, height:240, borderRadius:"50%", filter:"blur(70px)", background:"rgba(255,140,50,0.16)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite 2s" }} />

//             <div style={{ position:"absolute", top:0, right:0, width:1, height:"100%", background:"linear-gradient(to bottom, transparent, rgba(255,107,53,0.45) 30%, rgba(255,107,53,0.45) 70%, transparent)", zIndex:20, pointerEvents:"none" }} />

//             <HROrbitScene />

//             <MCard style={{ top:26, left:18, animation:"floatA 4.5s ease-in-out infinite" }}
//               icon="💸" title="Payroll Done" sub="✓ 248 employees" subColor="#4ade80" />
//             <MCard style={{ bottom:52, right:14, animation:"floatB 5.5s ease-in-out infinite" }}
//               icon="⏰" title="Team Check-In" sub="48 / 50 present" subColor="#fbbf24" />
//             <MCard style={{ top:"43%", right:12, animation:"floatC 6s ease-in-out infinite" }}
//               icon="🏖️" title="Leave Approved" sub="3 requests · instant" subColor="#fb923c" />

//             <div style={{
//               position:"absolute", top:"50%", left:"50%",
//               transform:"translate(-50%,-50%)",
//               zIndex:5, pointerEvents:"none",
//               width:36, height:36, borderRadius:11,
//               background:"rgba(8,3,1,0.96)",
//               border:"1.5px solid rgba(255,107,53,0.9)",
//               display:"flex", alignItems:"center", justifyContent:"center",
//               boxShadow:"0 0 22px rgba(255,107,53,0.7), 0 0 50px rgba(255,80,20,0.3)",
//             }}>
//               <img src={logo} alt="SamayaHR" style={{ width:22, height:22, objectFit:"contain" }} />
//             </div>

//             <div style={{ position:"absolute", top:20, left:"50%", transform:"translateX(-50%)", zIndex:10 }}>
//               <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,107,53,.14)", border:"1px solid rgba(255,107,53,.3)", borderRadius:999, padding:"5px 14px" }}>
//                 <span style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B35", display:"inline-block", animation:"ping-dot 1.8s ease-in-out infinite" }} />
//                 <span style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", color:"#FF6B35", textTransform:"uppercase", whiteSpace:"nowrap" }}>Live · Secure Access</span>
//               </div>
//             </div>

//             <div style={{ position:"absolute", bottom:16, left:0, right:0, textAlign:"center", zIndex:10, pointerEvents:"none" }}>
//               <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.1)", letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:"Sora,sans-serif", margin:0 }}>
//                 Samaya<span style={{ color:"rgba(255,107,53,0.3)" }}>HR</span> · Workplace OS
//               </p>
//             </div>
//           </div>

//           <div style={{ flex:1, background:"#fff", padding:"44px 40px", display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"auto" }}>
//             <div style={{ maxWidth:360, margin:"0 auto", width:"100%" }}>

//               <div className="fu1" style={{ marginBottom:24 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
//                   <div style={{ width:44, height:44, borderRadius:13, background:"linear-gradient(135deg,#FF6B35,#FF5722)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(255,107,53,.3)", flexShrink:0, position:"relative" }}>
//                     <img src="/assets/Zlabs-Logo.png" alt="SamayaHR" style={{ width:28, height:28, objectFit:"contain" }} />
//                     <div style={{ position:"absolute", top:-2, right:-2, width:11, height:11, borderRadius:"50%", background:"#22c55e", border:"2px solid #fff" }} />
//                   </div>
//                   <div>
//                     <h3 className="sora" style={{ fontSize:22, fontWeight:900, color:"#0D1F2D", margin:0 }}>
//                       {showForm ? "Sign in to workspace" : "Welcome back 👋"}
//                     </h3>
//                     <p style={{ fontSize:12, color:"#9ca3af", margin:"3px 0 0" }}>
//                       {activeTab === "company" ? "Enter your company credentials to continue." : "Takes 10 seconds · Pick up where you left off."}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {!showForm ? (
//                 <>
//                   <VisualAnimation />

//                   <button className="fu4 coral-btn" onClick={() => setShowForm(true)}>
//                     Access My Workspace
//                     <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
//                   </button>

//                   <p className="fu5" style={{ textAlign:"center", marginTop:14, fontSize:12, color:"#9ca3af" }}>
//                     New here?{" "}
//                     <a href="/solutions/bookdemo" style={{ color:"#FF6B35", fontWeight:700, textDecoration:"none" }}>Get a free personalised demo →</a>
//                   </p>

//                   <div style={{ display:"flex", flexWrap:"wrap", gap:14, background:"#F7F8FA", borderRadius:12, padding:"11px 14px", marginTop:16 }}>
//                     {[["🔒","Secure & Private"],["⚡","Instant Login"]].map(([ic,tx]) => (
//                       <div key={tx} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#6b7280", fontWeight:500 }}>
//                         <span>{ic}</span>{tx}
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="fu1" style={{ display:"flex", gap:4, borderRadius:12, padding:4, background:"#f3f4f6", marginBottom:20, border:"1px solid #e5e7eb" }}>
//                     {[["employee","👤 Employee"],["company","🏢 Company"]].map(([tab, label]) => (
//                       <button key={tab} className="tab-btn" onClick={() => { setActiveTab(tab); setError(""); }} style={{
//                         background: activeTab === tab ? "linear-gradient(135deg,#FF6B35,#FF5722)" : "transparent",
//                         color:      activeTab === tab ? "#fff" : "#6b7280",
//                         boxShadow:  activeTab === tab ? "0 2px 10px rgba(255,107,53,.3)" : "none",
//                       }}>{label}</button>
//                     ))}
//                   </div>

//                   {error ? (
//                     <div style={{
//                       marginBottom: 14,
//                       background: "#FEF2F2",
//                       border: "1px solid #FECACA",
//                       color: "#B91C1C",
//                       borderRadius: 12,
//                       padding: "10px 12px",
//                       fontSize: 12,
//                       fontWeight: 700,
//                     }}>
//                       {error}
//                     </div>
//                   ) : null}

//                   <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

//                     <div className="fu2">
//                       <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
//                         Email address <span style={{ color:"#FF6B35" }}>*</span>
//                       </label>
//                       <div style={{ position:"relative" }}>
//                         <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                           <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
//                         </div>
//                         <input type="email" name="email" className="lg-input"
//                           placeholder={activeTab === "company" ? "admin@company.com" : "you@company.com"}
//                           value={formData.email} onChange={handleChange} required />
//                       </div>
//                     </div>

//                     {activeTab === "company" ? (
//                       <div className="fu3">
//                         <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
//                           Pass Code <span style={{ color:"#FF6B35" }}>*</span>
//                         </label>
//                         <div style={{ position:"relative" }}>
//                           <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                             <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
//                           </div>
//                           <input type="text" name="companyKey" className="lg-input" placeholder="e.g. ACME2024"
//                             value={formData.companyKey} onChange={handleChange} required />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="fu3">
//                         <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
//                           <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>
//                             Password <span style={{ color:"#FF6B35" }}>*</span>
//                           </label>
//                           <a href="/forgot-password" style={{ fontSize:11, fontWeight:700, color:"#FF6B35", textDecoration:"none" }}>Forgot password?</a>
//                         </div>
//                         <div style={{ position:"relative" }}>
//                           <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                             <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
//                           </div>
//                           <input type={showPass ? "text" : "password"} name="password" className="lg-input"
//                             placeholder="••••••••" style={{ paddingRight:42 }}
//                             value={formData.password} onChange={handleChange} required />
//                           <button type="button" onClick={() => setShowPass(p => !p)}
//                             style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0 }}>
//                             {showPass
//                               ? <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
//                               : <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
//                             }
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     <button type="submit" disabled={loading} className="fu4 coral-btn" style={{ marginTop:4 }}>
//                       {loading
//                         ? <><svg style={{ animation:"spin-loader 1s linear infinite", width:15, height:15 }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity:.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity:.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
//                         : <>Sign In <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
//                       }
//                     </button>
//                   </form>

//                   <button onClick={() => setShowForm(false)}
//                     style={{ marginTop:14, width:"100%", background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, color:"#9ca3af", textAlign:"center" }}>
//                     ← Back to sign-in screen
//                   </button>
//                 </>
//               )}

//               <p className="fu5" style={{ marginTop:16, textAlign:"center", fontSize:11, color:"#9ca3af", lineHeight:1.7 }}>
//                 By signing in, you agree to our{" "}
//                 <a href="/terms"   style={{ color:"#FF6B35", textDecoration:"none" }}>Terms of Service</a>{" "}&{" "}
//                 <a href="/privacy" style={{ color:"#FF6B35", textDecoration:"none" }}>Privacy Policy</a>.
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

//With Protected Route no Domain Name 9/3/2026

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import logo from "/assets/Zlabs-Logo.png?url";
// import { isTokenValid, getRoleHome, clearSession } from "./app/authGuard";

// const getApiBaseUrl = () => {
//   const fromEnv =
//     import.meta.env?.VITE_API_BASE_URL &&
//     import.meta.env.VITE_API_BASE_URL.trim();
//   if (fromEnv) return fromEnv;
//   if (
//     window.location.hostname === "localhost" ||
//     window.location.hostname === "127.0.0.1"
//   )
//     return "http://localhost:8080";
//   return "";
// };
// const API_BASE_URL = getApiBaseUrl();

// // ✅ UPDATED — obfuscated paths, no role/page names in URL
// const ROLE_REDIRECT = {
//   GLOBAL_ADMIN:  "/p/ga/home",
//   GLOBALADMIN:   "/p/ga/home",
//   SUPER_ADMIN:   "/p/sa/home",
//   SUPERADMIN:    "/p/sa/home",
//   COMPANY_ADMIN: "/p/sa/home",
//   COMPANYADMIN:  "/p/sa/home",
//   ADMIN:         "/p/ad/home",
//   EMPLOYEE:      "/p/em/home",
// };

// /* ══════════════════════════════════════════════════════════════════════════════
//    LEFT PANEL — orbit canvas
// ══════════════════════════════════════════════════════════════════════════════ */
// function HROrbitScene() {
//   const canvasRef = useRef(null);
//   const animRef   = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let W = canvas.offsetWidth, H = canvas.offsetHeight;
//     canvas.width = W; canvas.height = H;

//     const resize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
//     window.addEventListener("resize", resize);

//     const ICONS  = ["💸","⏱️","🏖️","📊","🔐","📱","🎯","🚀","👥","📋"];
//     const orbits = [
//       { r:78,  speed:0.009,  nodes:3, offset:0 },
//       { r:138, speed:-0.006, nodes:5, offset:Math.PI/5 },
//       { r:198, speed:0.004,  nodes:6, offset:Math.PI/9 },
//     ];
//     const COLS  = ["rgba(255,107,53,","rgba(255,160,80,","rgba(255,70,30,"];
//     const PCOLS = ["rgba(255,107,53,","rgba(255,160,80,","rgba(255,200,100,","rgba(0,194,168,"];
//     const particles = Array.from({length:65},()=>({
//       x:Math.random()*W, y:Math.random()*H,
//       r:Math.random()*1.8+0.4,
//       vx:(Math.random()-0.5)*0.35, vy:(Math.random()-0.5)*0.35,
//       alpha:Math.random()*0.6+0.15,
//       col:PCOLS[Math.floor(Math.random()*PCOLS.length)],
//     }));
//     const pulses = [0,85,170].map(s=>({r:s,max:215,speed:0.65}));
//     let t = 0;

//     const draw = () => {
//       ctx.clearRect(0,0,W,H);
//       const cx=W/2, cy=H/2; t+=0.016;
//       ctx.save(); ctx.strokeStyle="rgba(255,107,53,0.05)"; ctx.lineWidth=1;
//       for(let x=0;x<W;x+=44){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
//       for(let y=0;y<H;y+=44){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
//       ctx.restore();
//       particles.forEach(p=>{
//         p.x+=p.vx; p.y+=p.vy;
//         if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
//         ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
//         ctx.fillStyle=p.col+p.alpha+")"; ctx.shadowBlur=8; ctx.shadowColor=p.col+"0.9)"; ctx.fill(); ctx.shadowBlur=0;
//       });
//       pulses.forEach(p=>{
//         p.r+=p.speed; if(p.r>p.max)p.r=0;
//         const a=(1-p.r/p.max)*0.22;
//         ctx.beginPath(); ctx.arc(cx,cy,p.r,0,Math.PI*2); ctx.strokeStyle=`rgba(255,107,53,${a})`; ctx.lineWidth=1.5; ctx.stroke();
//       });
//       orbits.forEach((orb,oi)=>{
//         ctx.beginPath(); ctx.arc(cx,cy,orb.r,0,Math.PI*2); ctx.strokeStyle=COLS[oi]+"0.15)"; ctx.lineWidth=1; ctx.setLineDash([5,10]); ctx.stroke(); ctx.setLineDash([]);
//         for(let n=0;n<orb.nodes;n++){
//           const angle=(2*Math.PI*n)/orb.nodes+t*orb.speed+orb.offset;
//           const nx=cx+orb.r*Math.cos(angle), ny=cy+orb.r*Math.sin(angle);
//           const lg=ctx.createLinearGradient(cx,cy,nx,ny); lg.addColorStop(0,"transparent"); lg.addColorStop(1,COLS[oi]+"0.2)");
//           ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(nx,ny); ctx.strokeStyle=lg; ctx.lineWidth=1; ctx.stroke();
//           const rg=ctx.createRadialGradient(nx,ny,0,nx,ny,22); rg.addColorStop(0,COLS[oi]+"0.42)"); rg.addColorStop(1,"transparent");
//           ctx.beginPath(); ctx.arc(nx,ny,22,0,Math.PI*2); ctx.fillStyle=rg; ctx.fill();
//           ctx.beginPath(); ctx.arc(nx,ny,13,0,Math.PI*2); ctx.fillStyle="rgba(10,5,2,0.92)"; ctx.fill();
//           ctx.strokeStyle=COLS[oi]+"0.8)"; ctx.lineWidth=1.5; ctx.stroke();
//           ctx.font="11px serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(ICONS[(oi*4+n)%ICONS.length],nx,ny);
//         }
//       });
//       const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,55); cg.addColorStop(0,"rgba(255,107,53,0.42)"); cg.addColorStop(0.5,"rgba(255,80,20,0.14)"); cg.addColorStop(1,"transparent");
//       ctx.beginPath(); ctx.arc(cx,cy,55,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();
//       ctx.save(); ctx.translate(cx,cy); ctx.rotate(t*0.4); ctx.beginPath(); ctx.arc(0,0,32,0,Math.PI*2); ctx.strokeStyle="rgba(255,107,53,0.55)"; ctx.lineWidth=1.5; ctx.setLineDash([6,6]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
//       ctx.save(); ctx.translate(cx,cy); ctx.rotate(-t*0.25); ctx.beginPath(); ctx.arc(0,0,23,0,Math.PI*2); ctx.strokeStyle="rgba(255,160,80,0.4)"; ctx.lineWidth=1; ctx.setLineDash([3,8]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
//       ctx.beginPath(); ctx.arc(cx,cy,17,0,Math.PI*2); ctx.fillStyle="rgba(8,4,2,0.96)"; ctx.fill(); ctx.strokeStyle="rgba(255,107,53,0.95)"; ctx.lineWidth=2; ctx.stroke();
//       animRef.current = requestAnimationFrame(draw);
//     };
//     draw();
//     return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
//   }, []);

//   return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />;
// }

// function MCard({ style, icon, title, sub, subColor }) {
//   return (
//     <div style={{ position:"absolute", zIndex:10, background:"rgba(10,4,2,0.85)", border:"1px solid rgba(255,107,53,0.35)", backdropFilter:"blur(16px)", borderRadius:14, padding:"9px 14px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 28px rgba(0,0,0,0.45), 0 0 18px rgba(255,107,53,0.12)", ...style }}>
//       <div style={{ width:30, height:30, borderRadius:9, background:"rgba(255,107,53,0.14)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{icon}</div>
//       <div>
//         <div style={{ fontSize:11, fontWeight:700, color:"#fff", fontFamily:"Sora,sans-serif" }}>{title}</div>
//         <div style={{ fontSize:10, color:subColor, marginTop:1 }}>{sub}</div>
//       </div>
//     </div>
//   );
// }

// function VisualAnimation() {
//   const canvasRef = useRef(null);
//   const animRef   = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let W = canvas.offsetWidth, H = canvas.offsetHeight;
//     canvas.width = W; canvas.height = H;
//     const onResize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
//     window.addEventListener("resize", onResize);
//     let t = 0;
//     const orbs = Array.from({length:6},(_,i)=>({ x:W*(0.15+((i*0.18)%0.85)), y:H*(0.2+((i*0.27)%0.7)), r:28+i*8, speedX:(Math.random()-0.5)*0.5, speedY:(Math.random()-0.5)*0.5, hue:[22,30,16,25,18,28][i], phase:(i*Math.PI)/3 }));
//     const WAVE_COUNT=5;
//     const sparks=Array.from({length:22},()=>({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*2.5+0.5, alpha:Math.random(), speed:Math.random()*0.02+0.008, phase:Math.random()*Math.PI*2 }));
//     const hexNodes=[]; const hexSize=38;
//     for(let row=0;row<5;row++) for(let col=0;col<8;col++) hexNodes.push({ x:col*hexSize*1.8+(row%2===0?0:hexSize*0.9)-20, y:row*hexSize*1.1-10, pulse:Math.random()*Math.PI*2, speed:0.018+Math.random()*0.012 });
//     const draw=()=>{
//       ctx.clearRect(0,0,W,H); t+=0.018;
//       const bg=ctx.createLinearGradient(0,0,W,H); bg.addColorStop(0,"#fff8f5"); bg.addColorStop(0.5,"#fff3ee"); bg.addColorStop(1,"#fff8f5"); ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
//       ctx.save();
//       hexNodes.forEach((n,i)=>{
//         n.pulse+=n.speed; const glow=(Math.sin(n.pulse)+1)/2; const alpha=0.06+glow*0.18; const radius=2+glow*3;
//         hexNodes.forEach((m,j)=>{ if(j<=i)return; const dx=n.x-m.x,dy=n.y-m.y,dist=Math.sqrt(dx*dx+dy*dy); if(dist<hexSize*2.2){ ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(m.x,m.y); ctx.strokeStyle=`rgba(255,107,53,${(1-dist/(hexSize*2.2))*0.08})`; ctx.lineWidth=0.8; ctx.stroke(); }});
//         ctx.beginPath(); ctx.arc(n.x,n.y,radius,0,Math.PI*2); ctx.fillStyle=`rgba(255,107,53,${alpha})`; ctx.fill();
//       });
//       ctx.restore();
//       for(let w=0;w<WAVE_COUNT;w++){
//         const phase=t*0.7+(w*Math.PI*2)/WAVE_COUNT, yBase=H*(0.2+w*0.15), amp=12+w*5, alpha=0.08+w*0.025;
//         ctx.beginPath();
//         for(let x=0;x<=W;x+=3){ const y=yBase+Math.sin((x/W)*Math.PI*3+phase)*amp+Math.sin((x/W)*Math.PI*6+phase*1.3)*(amp*0.4); x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }
//         ctx.strokeStyle=`rgba(255,107,53,${alpha})`; ctx.lineWidth=1.5; ctx.stroke();
//       }
//       orbs.forEach((o,i)=>{
//         o.x+=o.speedX+Math.sin(t*0.4+o.phase)*0.3; o.y+=o.speedY+Math.cos(t*0.35+o.phase)*0.3;
//         if(o.x<-o.r)o.x=W+o.r; if(o.x>W+o.r)o.x=-o.r; if(o.y<-o.r)o.y=H+o.r; if(o.y>H+o.r)o.y=-o.r;
//         const pulse=(Math.sin(t*0.9+o.phase)+1)/2, r=o.r*(0.85+pulse*0.3), alpha=0.55+pulse*0.3;
//         const grad=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r); grad.addColorStop(0,`rgba(255,${100+i*12},${30+i*8},${alpha})`); grad.addColorStop(0.5,`rgba(255,107,53,${alpha*0.4})`); grad.addColorStop(1,"transparent");
//         ctx.beginPath(); ctx.arc(o.x,o.y,r,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
//       });
//       const cx=W/2,cy=H/2;
//       for(let ring=0;ring<3;ring++){
//         const rr=30+ring*22,rot=t*(ring%2===0?0.5:-0.35)+ring,ringAlpha=0.15+ring*0.05;
//         ctx.save(); ctx.translate(cx,cy); ctx.rotate(rot); ctx.beginPath(); ctx.arc(0,0,rr,0,Math.PI*2); ctx.strokeStyle=`rgba(255,107,53,${ringAlpha})`; ctx.lineWidth=1.5; ctx.setLineDash([6,10]); ctx.stroke(); ctx.setLineDash([]);
//         const dotCount=3+ring;
//         for(let d=0;d<dotCount;d++){ const angle=(d/dotCount)*Math.PI*2,dx=Math.cos(angle)*rr,dy=Math.sin(angle)*rr,glow=(Math.sin(t*2+d+ring)+1)/2; ctx.beginPath(); ctx.arc(dx,dy,3+glow*2,0,Math.PI*2); ctx.fillStyle=`rgba(255,107,53,${0.5+glow*0.5})`; ctx.shadowBlur=8+glow*8; ctx.shadowColor="#FF6B35"; ctx.fill(); ctx.shadowBlur=0; }
//         ctx.restore();
//       }
//       const coreGlow=ctx.createRadialGradient(cx,cy,0,cx,cy,24); coreGlow.addColorStop(0,`rgba(255,107,53,${0.5+Math.sin(t*1.2)*0.2})`); coreGlow.addColorStop(0.5,"rgba(255,107,53,0.15)"); coreGlow.addColorStop(1,"transparent"); ctx.beginPath(); ctx.arc(cx,cy,24,0,Math.PI*2); ctx.fillStyle=coreGlow; ctx.fill();
//       ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2); ctx.fillStyle="#FF6B35"; ctx.shadowBlur=16; ctx.shadowColor="#FF6B35"; ctx.fill(); ctx.shadowBlur=0;
//       sparks.forEach(s=>{ s.phase+=s.speed; const a=(Math.sin(s.phase)+1)/2; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*a,0,Math.PI*2); ctx.fillStyle=`rgba(255,107,53,${a*0.7})`; ctx.shadowBlur=a*6; ctx.shadowColor="#FF6B35"; ctx.fill(); ctx.shadowBlur=0; });
//       animRef.current=requestAnimationFrame(draw);
//     };
//     draw();
//     return ()=>{ cancelAnimationFrame(animRef.current); window.removeEventListener("resize",onResize); };
//   }, []);

//   return (
//     <div className="fu2" style={{ borderRadius:16, overflow:"hidden", marginBottom:18, border:"1.5px solid rgba(255,107,53,0.18)", boxShadow:"0 4px 24px rgba(255,107,53,0.1)", position:"relative", height:180 }}>
//       <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block" }} />
//       <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,107,53,0.25)", borderRadius:999, padding:"4px 14px", boxShadow:"0 2px 12px rgba(255,107,53,0.15)", whiteSpace:"nowrap" }}>
//         <div style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B35", animation:"ping-dot 1.6s ease-in-out infinite" }} />
//         <span style={{ fontSize:11, fontWeight:700, color:"#FF6B35" }}>SamayaHR · Live Platform</span>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════════════════════════
//    MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════ */
// export default function LoginPage() {
//   const navigate  = useNavigate();
//   const location  = useLocation();

//   const [showForm,   setShowForm]   = useState(false);
//   const [activeTab,  setActiveTab]  = useState("employee");
//   const [loading,    setLoading]    = useState(false);
//   const [showPass,   setShowPass]   = useState(false);
//   const [error,      setError]      = useState("");
//   const [formData,   setFormData]   = useState({ email:"", password:"", companyKey:"" });

//   // 🔒 If the user already has a valid session, send them to their dashboard
//   useEffect(() => {
//     if (isTokenValid()) {
//       navigate(getRoleHome(), { replace: true });
//     }
//   }, []);

//   const handleChange = (e) => {
//     setError("");
//     setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   const getLoginApi = () => {
//     const b = API_BASE_URL.replace(/\/+$/, "");
//     return activeTab === "company"
//       ? b ? `${b}/api/global-admin/companies/company-login` : "/api/global-admin/companies/company-login"
//       : b ? `${b}/api/auth/login` : "/api/auth/login";
//   };

//   const saveCommonData = (data = {}) => {
//     localStorage.setItem("tenantCode",   data?.tenantCode  || "");
//     localStorage.setItem("companyId",    String(data?.companyId || ""));
//     localStorage.setItem("companyName",  data?.companyName || data?.displayName || "");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     clearSession();

//     try {
//       if (activeTab === "company") {
//         const payload = { officialEmail: formData.email, tenantCode: formData.companyKey };
//         const res  = await fetch(getLoginApi(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(payload) });
//         const data = await res.json();

//         if (!res.ok || !data.success) throw new Error(data?.message || "Company login failed");
//         const token = data?.data?.token;
//         if (!token) throw new Error("Token missing");

//         const role = String(data?.data?.role || data?.data?.userRole || "COMPANY_ADMIN").toUpperCase();
//         localStorage.setItem("token",    `Bearer ${token}`);
//         localStorage.setItem("role",     role);
//         localStorage.setItem("userRole", role);
//         saveCommonData(data?.data || {});

//         // ✅ UPDATED — redirect to obfuscated path
//         const intended = location.state?.from?.pathname;
//         const redirect = intended && intended.startsWith("/p/sa")
//           ? intended
//           : ROLE_REDIRECT[role] || "/p/sa/home";
//         navigate(redirect, { replace: true });

//       } else {
//         const payload = { email: formData.email, password: formData.password };
//         const res  = await fetch(getLoginApi(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(payload) });
//         const data = await res.json();

//         if (!res.ok || !data.success) throw new Error(data?.message || "Login failed");
//         const token = data?.data?.token;
//         if (!token) throw new Error("Token missing");

//         const role = String(data?.data?.role || "EMPLOYEE").toUpperCase();
//         const uid  = data?.data?.userId || data?.data?.id || "";

//         localStorage.setItem("token",        `Bearer ${token}`);
//         localStorage.setItem("userId",       String(uid));
//         localStorage.setItem("employeeName", data?.data?.fullName || data?.data?.name || "");
//         localStorage.setItem("employeeId",   data?.data?.employeeId || "");
//         localStorage.setItem("role",         role);
//         localStorage.setItem("userRole",     role);
//         saveCommonData(data?.data || {});

//         // ✅ UPDATED — redirect to obfuscated path
//         const intended = location.state?.from?.pathname;
//         const roleHome = ROLE_REDIRECT[role] || "/p/em/home";
//         const redirect = intended || roleHome;
//         navigate(redirect, { replace: true });
//       }
//     } catch (err) {
//       setError(err.message || "Login error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ minHeight:"100vh", background:"#F7F8FA" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
//         *, *::before, *::after { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
//         .sora { font-family:'Sora',sans-serif !important; }
//         @keyframes floatA   { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-11px) rotate(1deg)} }
//         @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(1deg)}  50%{transform:translateY(9px) rotate(-1deg)} }
//         @keyframes floatC   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
//         @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes ping-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(2.2)} }
//         @keyframes gp       { 0%,100%{opacity:.25} 50%{opacity:.55} }
//         @keyframes spin-loader{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
//         .fu1{animation:fadeUp .45s ease both .05s} .fu2{animation:fadeUp .45s ease both .15s}
//         .fu3{animation:fadeUp .45s ease both .25s} .fu4{animation:fadeUp .45s ease both .35s}
//         .fu5{animation:fadeUp .45s ease both .45s}
//         .lg-input { width:100%; border:1.5px solid #e5e7eb; border-radius:12px; background:#fff; padding:11px 14px 11px 42px; font-size:14px; color:#0D1F2D; outline:none; transition:border-color .2s, box-shadow .2s; font-family:'DM Sans',sans-serif; }
//         .lg-input::placeholder { color:#9ca3af; }
//         .lg-input:focus { border-color:#FF6B35; box-shadow:0 0 0 3px rgba(255,107,53,.1); }
//         .coral-btn { width:100%; background:linear-gradient(135deg,#FF6B35 0%,#FF5722 50%,#ff7043 100%); background-size:200% auto; color:#fff; font-weight:800; font-size:15px; padding:13px; border-radius:14px; border:none; cursor:pointer; box-shadow:0 4px 24px rgba(255,107,53,.38); transition:transform .22s, box-shadow .22s, background-position .4s; display:flex; align-items:center; justify-content:center; gap:8px; letter-spacing:.02em; }
//         .coral-btn:hover    { transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,107,53,.5); background-position:right center; }
//         .coral-btn:disabled { opacity:.65; cursor:not-allowed; transform:none; }
//         .tab-btn { flex:1; padding:9px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; border:none; transition:all .2s; font-family:'DM Sans',sans-serif; }
//       `}</style>

//       <header style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 10px rgba(0,0,0,.05)" }}>
//         <nav style={{ maxWidth:1120, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:9 }}>
//             <div className="sora" style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#FF6B35,#FF5722)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:15 }}>S</div>
//             <span className="sora" style={{ fontWeight:900, fontSize:20, color:"#0D1F2D" }}>Samaya<span style={{ color:"#FF6B35" }}>HR</span></span>
//           </div>
//           <button onClick={() => navigate("/")}
//             style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"#6b7280", background:"none", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"7px 16px", cursor:"pointer", transition:"all .2s" }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor="#FF6B35"; e.currentTarget.style.color="#FF6B35"; }}
//             onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.color="#6b7280"; }}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
//             Back to Home
//           </button>
//         </nav>
//       </header>

//       <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px 64px" }}>
//         <div style={{ display:"flex", borderRadius:28, overflow:"hidden", boxShadow:"0 20px 70px rgba(13,31,45,.15)" }}>

//           {/* ── LEFT PANEL ── */}
//           <div style={{ width:"42%", flexShrink:0, background:"linear-gradient(148deg, #0d0400 0%, #180800 30%, #1a0600 60%, #0d0300 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:560 }}>
//             <div style={{ position:"absolute", top:-80, left:-60, width:360, height:360, borderRadius:"50%", filter:"blur(90px)", background:"rgba(255,107,53,0.28)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite" }} />
//             <div style={{ position:"absolute", bottom:-60, right:-40, width:300, height:300, borderRadius:"50%", filter:"blur(80px)", background:"rgba(255,60,10,0.22)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite 1s" }} />
//             <div style={{ position:"absolute", top:"40%", right:0, width:240, height:240, borderRadius:"50%", filter:"blur(70px)", background:"rgba(255,140,50,0.16)", pointerEvents:"none", zIndex:1, animation:"gp 4s ease-in-out infinite 2s" }} />
//             <div style={{ position:"absolute", top:0, right:0, width:1, height:"100%", background:"linear-gradient(to bottom, transparent, rgba(255,107,53,0.45) 30%, rgba(255,107,53,0.45) 70%, transparent)", zIndex:20, pointerEvents:"none" }} />
//             <HROrbitScene />
//             <MCard style={{ top:26, left:18, animation:"floatA 4.5s ease-in-out infinite" }} icon="💸" title="Payroll Done" sub="✓ 248 employees" subColor="#4ade80" />
//             <MCard style={{ bottom:52, right:14, animation:"floatB 5.5s ease-in-out infinite" }} icon="⏰" title="Team Check-In" sub="48 / 50 present" subColor="#fbbf24" />
//             <MCard style={{ top:"43%", right:12, animation:"floatC 6s ease-in-out infinite" }} icon="🏖️" title="Leave Approved" sub="3 requests · instant" subColor="#fb923c" />
//             <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:5, pointerEvents:"none", width:36, height:36, borderRadius:11, background:"rgba(8,3,1,0.96)", border:"1.5px solid rgba(255,107,53,0.9)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 22px rgba(255,107,53,0.7), 0 0 50px rgba(255,80,20,0.3)" }}>
//               <img src={logo} alt="SamayaHR" style={{ width:22, height:22, objectFit:"contain" }} />
//             </div>
//             <div style={{ position:"absolute", top:20, left:"50%", transform:"translateX(-50%)", zIndex:10 }}>
//               <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,107,53,.14)", border:"1px solid rgba(255,107,53,.3)", borderRadius:999, padding:"5px 14px" }}>
//                 <span style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B35", display:"inline-block", animation:"ping-dot 1.8s ease-in-out infinite" }} />
//                 <span style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", color:"#FF6B35", textTransform:"uppercase", whiteSpace:"nowrap" }}>Live · Secure Access</span>
//               </div>
//             </div>
//           </div>

//           {/* ── RIGHT PANEL ── */}
//           <div style={{ flex:1, background:"#fff", padding:"44px 40px", display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"auto" }}>
//             <div style={{ maxWidth:360, margin:"0 auto", width:"100%" }}>

//               <div className="fu1" style={{ marginBottom:24 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
//                   <div style={{ width:44, height:44, borderRadius:13, background:"linear-gradient(135deg,#FF6B35,#FF5722)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(255,107,53,.3)", flexShrink:0, position:"relative" }}>
//                     <img src="/assets/Zlabs-Logo.png" alt="SamayaHR" style={{ width:28, height:28, objectFit:"contain" }} />
//                     <div style={{ position:"absolute", top:-2, right:-2, width:11, height:11, borderRadius:"50%", background:"#22c55e", border:"2px solid #fff" }} />
//                   </div>
//                   <div>
//                     <h3 className="sora" style={{ fontSize:22, fontWeight:900, color:"#0D1F2D", margin:0 }}>
//                       {showForm ? "Sign in to workspace" : "Welcome back 👋"}
//                     </h3>
//                     <p style={{ fontSize:12, color:"#9ca3af", margin:"3px 0 0" }}>
//                       {activeTab === "company" ? "Enter your company credentials to continue." : "Takes 10 seconds · Pick up where you left off."}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {!showForm ? (
//                 <>
//                   <VisualAnimation />
//                   <button className="fu4 coral-btn" onClick={() => setShowForm(true)}>
//                     Access My Workspace
//                     <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
//                   </button>
//                   <p className="fu5" style={{ textAlign:"center", marginTop:14, fontSize:12, color:"#9ca3af" }}>
//                     New here?{" "}
//                     <a href="/solutions/bookdemo" style={{ color:"#FF6B35", fontWeight:700, textDecoration:"none" }}>Get a free personalised demo →</a>
//                   </p>
//                   <div style={{ display:"flex", flexWrap:"wrap", gap:14, background:"#F7F8FA", borderRadius:12, padding:"11px 14px", marginTop:16 }}>
//                     {[["🔒","Secure & Private"],["⚡","Instant Login"]].map(([ic,tx]) => (
//                       <div key={tx} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#6b7280", fontWeight:500 }}>
//                         <span>{ic}</span>{tx}
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="fu1" style={{ display:"flex", gap:4, borderRadius:12, padding:4, background:"#f3f4f6", marginBottom:20, border:"1px solid #e5e7eb" }}>
//                     {[["employee","👤 Employee"],["company","🏢 Company"]].map(([tab, label]) => (
//                       <button key={tab} className="tab-btn" onClick={() => { setActiveTab(tab); setError(""); }} style={{
//                         background: activeTab===tab ? "linear-gradient(135deg,#FF6B35,#FF5722)" : "transparent",
//                         color:      activeTab===tab ? "#fff" : "#6b7280",
//                         boxShadow:  activeTab===tab ? "0 2px 10px rgba(255,107,53,.3)" : "none",
//                       }}>{label}</button>
//                     ))}
//                   </div>

//                   {error && (
//                     <div style={{ marginBottom:14, background:"#FEF2F2", border:"1px solid #FECACA", color:"#B91C1C", borderRadius:12, padding:"10px 12px", fontSize:12, fontWeight:700 }}>
//                       {error}
//                     </div>
//                   )}

//                   <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
//                     <div className="fu2">
//                       <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
//                         Email address <span style={{ color:"#FF6B35" }}>*</span>
//                       </label>
//                       <div style={{ position:"relative" }}>
//                         <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                           <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
//                         </div>
//                         <input type="email" name="email" className="lg-input"
//                           placeholder={activeTab==="company" ? "admin@company.com" : "you@company.com"}
//                           value={formData.email} onChange={handleChange} required />
//                       </div>
//                     </div>

//                     {activeTab === "company" ? (
//                       <div className="fu3">
//                         <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
//                           Pass Code <span style={{ color:"#FF6B35" }}>*</span>
//                         </label>
//                         <div style={{ position:"relative" }}>
//                           <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                             <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
//                           </div>
//                           <input type="text" name="companyKey" className="lg-input" placeholder="e.g. ACME2024"
//                             value={formData.companyKey} onChange={handleChange} required />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="fu3">
//                         <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
//                           <label style={{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em" }}>
//                             Password <span style={{ color:"#FF6B35" }}>*</span>
//                           </label>
//                           <a href="/forgot-password" style={{ fontSize:11, fontWeight:700, color:"#FF6B35", textDecoration:"none" }}>Forgot password?</a>
//                         </div>
//                         <div style={{ position:"relative" }}>
//                           <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
//                             <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
//                           </div>
//                           <input type={showPass?"text":"password"} name="password" className="lg-input"
//                             placeholder="••••••••" style={{ paddingRight:42 }}
//                             value={formData.password} onChange={handleChange} required />
//                           <button type="button" onClick={() => setShowPass(p=>!p)}
//                             style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0 }}>
//                             {showPass
//                               ? <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
//                               : <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
//                             }
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     <button type="submit" disabled={loading} className="fu4 coral-btn" style={{ marginTop:4 }}>
//                       {loading
//                         ? <><svg style={{ animation:"spin-loader 1s linear infinite", width:15, height:15 }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity:.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity:.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
//                         : <>Sign In <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
//                       }
//                     </button>
//                   </form>

//                   <button onClick={() => setShowForm(false)}
//                     style={{ marginTop:14, width:"100%", background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, color:"#9ca3af", textAlign:"center" }}>
//                     ← Back to sign-in screen
//                   </button>
//                 </>
//               )}

//               <p className="fu5" style={{ marginTop:16, textAlign:"center", fontSize:11, color:"#9ca3af", lineHeight:1.7 }}>
//                 By signing in, you agree to our{" "}
//                 <a href="/terms"   style={{ color:"#FF6B35", textDecoration:"none" }}>Terms of Service</a>{" "}&{" "}
//                 <a href="/privacy" style={{ color:"#FF6B35", textDecoration:"none" }}>Privacy Policy</a>.
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

//with Domain Name in URL Path 9/3/2026
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/SamayaHRSidebar.png?url";
import { isTokenValid, clearSession } from "./app/authGuard";
import { API_BASE_URL } from "@/lib/apiClient";


// ─────────────────────────────────────────────────────────────────────────────
//  ROLE → PAGE KEY MAP
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_DEFAULT_PAGE = {
  GLOBAL_ADMIN:  "ga_home",
  GLOBALADMIN:   "ga_home",
  SUPER_ADMIN:   "sa_home",
  SUPERADMIN:    "sa_home",
  COMPANY_ADMIN: "sa_home",
  COMPANYADMIN:  "sa_home",
  ADMIN:         "ad_home",
  EMPLOYEE:      "em_home",
};

const seedCurrentPage = (role = "") => {
  const key = ROLE_DEFAULT_PAGE[role.toUpperCase().trim()];
  if (key) sessionStorage.setItem("currentPage", key);
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECURE ERROR MESSAGE MAPPER
//  Never reveals which field is wrong — uses friendly, non-technical language
// ─────────────────────────────────────────────────────────────────────────────
const getSecureErrorMessage = (rawMessage = "", tab = "employee") => {
  const msg = rawMessage.toLowerCase();

  // Network / server issues
  if (msg.includes("failed to fetch") || msg.includes("networkerror") || msg.includes("network"))
    return { text: "Unable to connect. Please check your internet and try again.", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", icon: "🌐" };

  if (msg.includes("token missing"))
    return { text: "Session could not be established. Please try again.", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", icon: "⚠️" };

  if (msg.includes("server") || msg.includes("500") || msg.includes("internal"))
    return { text: "Something went wrong on our end. Please try again in a moment.", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", icon: "⚠️" };

  // Auth failures — never tell them which field is wrong
  if (
    msg.includes("invalid") || msg.includes("incorrect") ||
    msg.includes("wrong") || msg.includes("mismatch") ||
    msg.includes("not found") || msg.includes("no user") ||
    msg.includes("unauthorized") || msg.includes("401") ||
    msg.includes("bad credentials") || msg.includes("failed") ||
    msg.includes("password") || msg.includes("email") ||
    msg.includes("tenant") || msg.includes("code") ||
    msg.includes("does not exist") || msg.includes("not match") ||
    msg.includes("login failed") || msg.includes("company login failed") ||
    msg.includes("not exist") || msg.includes("no account")
  ) {
    if (tab === "company")
      return { text: "Access denied. Your credentials could not be verified.", color: "#DC2626", bg: "#FFF0F0", border: "#FECACA", icon: "🔒" };
    return { text: "Access denied. Your credentials could not be verified.", color: "#DC2626", bg: "#FFF0F0", border: "#FECACA", icon: "🔒" };
  }

  // Account state issues
  if (msg.includes("disabled") || msg.includes("blocked") || msg.includes("suspended") || msg.includes("deactivated"))
    return { text: "Your account access has been restricted. Please contact your administrator.", color: "#9D174D", bg: "#FDF2F8", border: "#FBCFE8", icon: "🚫" };

  if (msg.includes("expired"))
    return { text: "Your session or credentials have expired. Please sign in again.", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", icon: "⏳" };

  // Rate limit
  if (msg.includes("too many") || msg.includes("rate limit") || msg.includes("limit"))
    return { text: "Too many attempts. Please wait a moment before trying again.", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", icon: "⏳" };

  // Fallback — generic, never reveals info
  return { text: "Sign-in unsuccessful. Please check your details and try again.", color: "#DC2626", bg: "#FFF0F0", border: "#FECACA", icon: "🔒" };
};

// ─────────────────────────────────────────────────────────────────────────────
//  LEFT PANEL — animated orbit canvas
// ─────────────────────────────────────────────────────────────────────────────
function HROrbitScene() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", resize);

    const ICONS  = ["💸","⏱️","🏖️","📊","🔐","📱","🎯","🚀","👥","📋"];
    const orbits = [
      { r: 78,  speed:  0.009,  nodes: 3, offset: 0 },
      { r: 138, speed: -0.006,  nodes: 5, offset: Math.PI / 5 },
      { r: 198, speed:  0.004,  nodes: 6, offset: Math.PI / 9 },
    ];
    const COLS  = ["rgba(255,107,53,", "rgba(255,160,80,", "rgba(255,70,30,"];
    const PCOLS = ["rgba(255,107,53,", "rgba(255,160,80,", "rgba(255,200,100,", "rgba(0,194,168,"];

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.6 + 0.15,
      col: PCOLS[Math.floor(Math.random() * PCOLS.length)],
    }));
    const pulses = [0, 85, 170].map(s => ({ r: s, max: 215, speed: 0.65 }));
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      t += 0.016;

      ctx.save(); ctx.strokeStyle = "rgba(255,107,53,0.05)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + p.alpha + ")";
        ctx.shadowBlur = 8; ctx.shadowColor = p.col + "0.9)"; ctx.fill(); ctx.shadowBlur = 0;
      });

      pulses.forEach(p => {
        p.r += p.speed; if (p.r > p.max) p.r = 0;
        const a = (1 - p.r / p.max) * 0.22;
        ctx.beginPath(); ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,107,53,${a})`; ctx.lineWidth = 1.5; ctx.stroke();
      });

      orbits.forEach((orb, oi) => {
        ctx.beginPath(); ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx.strokeStyle = COLS[oi] + "0.15)"; ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]); ctx.stroke(); ctx.setLineDash([]);

        for (let n = 0; n < orb.nodes; n++) {
          const angle = (2 * Math.PI * n) / orb.nodes + t * orb.speed + orb.offset;
          const nx = cx + orb.r * Math.cos(angle), ny = cy + orb.r * Math.sin(angle);

          const lg = ctx.createLinearGradient(cx, cy, nx, ny);
          lg.addColorStop(0, "transparent"); lg.addColorStop(1, COLS[oi] + "0.2)");
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
          ctx.strokeStyle = lg; ctx.lineWidth = 1; ctx.stroke();

          const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, 22);
          rg.addColorStop(0, COLS[oi] + "0.42)"); rg.addColorStop(1, "transparent");
          ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI * 2); ctx.fillStyle = rg; ctx.fill();

          ctx.beginPath(); ctx.arc(nx, ny, 13, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(10,5,2,0.92)"; ctx.fill();
          ctx.strokeStyle = COLS[oi] + "0.8)"; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.font = "11px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(ICONS[(oi * 4 + n) % ICONS.length], nx, ny);
        }
      });

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
      cg.addColorStop(0, "rgba(255,107,53,0.42)");
      cg.addColorStop(0.5, "rgba(255,80,20,0.14)");
      cg.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill();

      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.4);
      ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,107,53,0.55)"; ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();

      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-t * 0.25);
      ctx.beginPath(); ctx.arc(0, 0, 23, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,160,80,0.4)"; ctx.lineWidth = 1;
      ctx.setLineDash([3, 8]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();

      ctx.beginPath(); ctx.arc(cx, cy, 17, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8,4,2,0.96)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,107,53,0.95)"; ctx.lineWidth = 2; ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

function MCard({ style, icon, title, sub, subColor }) {
  return (
    <div style={{
      position: "absolute", zIndex: 10,
      background: "rgba(10,4,2,0.85)", border: "1px solid rgba(255,107,53,0.35)",
      backdropFilter: "blur(16px)", borderRadius: 14, padding: "9px 14px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 28px rgba(0,0,0,0.45), 0 0 18px rgba(255,107,53,0.12)", ...style
    }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,107,53,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "Sora,sans-serif" }}>{title}</div>
        <div style={{ fontSize: 10, color: subColor, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  RIGHT PANEL — animated canvas (light background)
// ─────────────────────────────────────────────────────────────────────────────
function VisualAnimation() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const onResize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", onResize);

    let t = 0;
    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: W * (0.15 + ((i * 0.18) % 0.85)), y: H * (0.2 + ((i * 0.27) % 0.7)),
      r: 28 + i * 8, speedX: (Math.random() - 0.5) * 0.5, speedY: (Math.random() - 0.5) * 0.5,
      phase: (i * Math.PI) / 3,
    }));
    const sparks = Array.from({ length: 22 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5, speed: Math.random() * 0.02 + 0.008,
      phase: Math.random() * Math.PI * 2,
    }));
    const hexNodes = []; const hexSize = 38;
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 8; col++)
        hexNodes.push({ x: col * hexSize * 1.8 + (row % 2 === 0 ? 0 : hexSize * 0.9) - 20, y: row * hexSize * 1.1 - 10, pulse: Math.random() * Math.PI * 2, speed: 0.018 + Math.random() * 0.012 });

    const draw = () => {
      ctx.clearRect(0, 0, W, H); t += 0.018;
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#fff8f5"); bg.addColorStop(0.5, "#fff3ee"); bg.addColorStop(1, "#fff8f5");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      ctx.save();
      hexNodes.forEach((n, i) => {
        n.pulse += n.speed;
        const glow = (Math.sin(n.pulse) + 1) / 2, alpha = 0.06 + glow * 0.18, radius = 2 + glow * 3;
        hexNodes.forEach((m, j) => {
          if (j <= i) return;
          const dx = n.x - m.x, dy = n.y - m.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < hexSize * 2.2) {
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(255,107,53,${(1 - dist / (hexSize * 2.2)) * 0.08})`; ctx.lineWidth = 0.8; ctx.stroke();
          }
        });
        ctx.beginPath(); ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,53,${alpha})`; ctx.fill();
      });
      ctx.restore();

      for (let w = 0; w < 5; w++) {
        const phase = t * 0.7 + (w * Math.PI * 2) / 5, yBase = H * (0.2 + w * 0.15), amp = 12 + w * 5, alpha = 0.08 + w * 0.025;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = yBase + Math.sin((x / W) * Math.PI * 3 + phase) * amp + Math.sin((x / W) * Math.PI * 6 + phase * 1.3) * (amp * 0.4);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,107,53,${alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
      }

      orbs.forEach((o, i) => {
        o.x += o.speedX + Math.sin(t * 0.4 + o.phase) * 0.3;
        o.y += o.speedY + Math.cos(t * 0.35 + o.phase) * 0.3;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
        const pulse = (Math.sin(t * 0.9 + o.phase) + 1) / 2, r = o.r * (0.85 + pulse * 0.3), alpha = 0.55 + pulse * 0.3;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
        grad.addColorStop(0, `rgba(255,${100 + i * 12},${30 + i * 8},${alpha})`);
        grad.addColorStop(0.5, `rgba(255,107,53,${alpha * 0.4})`); grad.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(o.x, o.y, r, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
      });

      const cx = W / 2, cy = H / 2;
      for (let ring = 0; ring < 3; ring++) {
        const rr = 30 + ring * 22, rot = t * (ring % 2 === 0 ? 0.5 : -0.35) + ring, ringAlpha = 0.15 + ring * 0.05;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,107,53,${ringAlpha})`; ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 10]); ctx.stroke(); ctx.setLineDash([]);
        const dotCount = 3 + ring;
        for (let d = 0; d < dotCount; d++) {
          const angle = (d / dotCount) * Math.PI * 2, dx = Math.cos(angle) * rr, dy = Math.sin(angle) * rr;
          const glow = (Math.sin(t * 2 + d + ring) + 1) / 2;
          ctx.beginPath(); ctx.arc(dx, dy, 3 + glow * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,107,53,${0.5 + glow * 0.5})`;
          ctx.shadowBlur = 8 + glow * 8; ctx.shadowColor = "#FF6B35"; ctx.fill(); ctx.shadowBlur = 0;
        }
        ctx.restore();
      }

      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
      coreGlow.addColorStop(0, `rgba(255,107,53,${0.5 + Math.sin(t * 1.2) * 0.2})`);
      coreGlow.addColorStop(0.5, "rgba(255,107,53,0.15)"); coreGlow.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2); ctx.fillStyle = coreGlow; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#FF6B35"; ctx.shadowBlur = 16; ctx.shadowColor = "#FF6B35"; ctx.fill(); ctx.shadowBlur = 0;

      sparks.forEach(s => {
        s.phase += s.speed;
        const a = (Math.sin(s.phase) + 1) / 2;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,53,${a * 0.7})`;
        ctx.shadowBlur = a * 6; ctx.shadowColor = "#FF6B35"; ctx.fill(); ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div className="fu2" style={{ borderRadius: 16, overflow: "hidden", marginBottom: 18, border: "1.5px solid rgba(255,107,53,0.18)", boxShadow: "0 4px 24px rgba(255,107,53,0.1)", position: "relative", height: 180 }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,107,53,0.25)", borderRadius: 999, padding: "4px 14px", boxShadow: "0 2px 12px rgba(255,107,53,0.15)", whiteSpace: "nowrap" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B35", animation: "ping-dot 1.6s ease-in-out infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B35" }}>SamayaHR · Live Platform</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [showForm,  setShowForm]  = useState(false);
  const [activeTab, setActiveTab] = useState("employee");
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState(null); // { text, color, bg, border, icon }
  const [formData,  setFormData]  = useState({ email: "", password: "", companyKey: "" });

  useEffect(() => {
    if (isTokenValid()) navigate("/", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    setError(null);
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const getLoginApi = () => {
    const b = API_BASE_URL.replace(/\/+$/, "");
    return activeTab === "company"
      ? b ? `${b}/api/global-admin/companies/company-login` : "/api/global-admin/companies/company-login"
      : b ? `${b}/api/auth/login` : "/api/auth/login";
  };

  const saveCommonData = (data = {}) => {
    localStorage.setItem("tenantCode",  data?.tenantCode  || "");
    localStorage.setItem("companyId",   String(data?.companyId || ""));
    localStorage.setItem("companyName", data?.companyName || data?.displayName || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    clearSession();

    try {
      if (activeTab === "company") {
        // ── COMPANY / SUPER-ADMIN LOGIN ────────────────────────────────────
        // Send officialEmail + tenantCode as the API expects
        const payload = {
          officialEmail: formData.email.trim(),
          tenantCode:    formData.companyKey.trim(),
        };

        let res, data;
        try {
          res  = await fetch(getLoginApi(), {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
          });
          data = await res.json();
        } catch (networkErr) {
          throw new Error("network");
        }

        if (!res.ok || !data.success) {
          throw new Error(data?.message || "company login failed");
        }

        // Support multiple token locations in response
        const token =
          data?.data?.token ||
          data?.token       ||
          data?.data?.accessToken ||
          data?.accessToken;

        if (!token) throw new Error("token missing");

        const role = String(
          data?.data?.role     ||
          data?.data?.userRole ||
          data?.data?.roleName ||
          data?.role           ||
          "COMPANY_ADMIN"
        ).toUpperCase();

        localStorage.setItem("token",    `Bearer ${token}`);
        localStorage.setItem("role",     role);
        localStorage.setItem("userRole", role);
        saveCommonData(data?.data || data || {});

        seedCurrentPage(role);
        navigate("/", { replace: true });

      } else {
        // ── EMPLOYEE LOGIN ─────────────────────────────────────────────────
        const payload = {
          email:    formData.email.trim(),
          password: formData.password,
        };

        let res, data;
        try {
          res  = await fetch(getLoginApi(), {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
          });
          data = await res.json();
        } catch (networkErr) {
          throw new Error("network");
        }

        if (!res.ok || !data.success) {
          throw new Error(data?.message || "login failed");
        }

        const token =
          data?.data?.token ||
          data?.token       ||
          data?.data?.accessToken ||
          data?.accessToken;

        if (!token) throw new Error("token missing");

        const role = String(
          data?.data?.role     ||
          data?.data?.userRole ||
          data?.role           ||
          "EMPLOYEE"
        ).toUpperCase();

        const uid = data?.data?.userId || data?.data?.id || data?.userId || "";

        localStorage.setItem("token",        `Bearer ${token}`);
        localStorage.setItem("userId",       String(uid));
        localStorage.setItem("employeeName", data?.data?.fullName || data?.data?.name || "");
        localStorage.setItem("employeeId",   data?.data?.employeeId || "");
        localStorage.setItem("role",         role);
        localStorage.setItem("userRole",     role);
        saveCommonData(data?.data || data || {});

        seedCurrentPage(role);
        navigate("/", { replace: true });
      }
    } catch (err) {
      // Always map to secure, friendly message — never expose field names
      setError(getSecureErrorMessage(err.message || "", activeTab));
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .sora { font-family: 'Sora', sans-serif !important; }
        @keyframes floatA   { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-11px) rotate(1deg)} }
        @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(1deg)}  50%{transform:translateY(9px) rotate(-1deg)} }
        @keyframes floatC   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(2.2)} }
        @keyframes gp       { 0%,100%{opacity:.25} 50%{opacity:.55} }
        @keyframes spin-loader { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slideInError { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .fu1 { animation: fadeUp .45s ease both .05s }
        .fu2 { animation: fadeUp .45s ease both .15s }
        .fu3 { animation: fadeUp .45s ease both .25s }
        .fu4 { animation: fadeUp .45s ease both .35s }
        .fu5 { animation: fadeUp .45s ease both .45s }
        .lg-input {
          width: 100%; border: 1.5px solid #e5e7eb; border-radius: 12px;
          background: #fff; padding: 11px 14px 11px 42px; font-size: 14px;
          color: #0D1F2D; outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .lg-input::placeholder { color: #9ca3af; }
        .lg-input:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,.1); }
        .coral-btn {
          width: 100%;
          background: linear-gradient(135deg,#FF6B35 0%,#FF5722 50%,#ff7043 100%);
          background-size: 200% auto; color: #fff; font-weight: 800; font-size: 15px;
          padding: 13px; border-radius: 14px; border: none; cursor: pointer;
          box-shadow: 0 4px 24px rgba(255,107,53,.38);
          transition: transform .22s, box-shadow .22s, background-position .4s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .coral-btn:hover    { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,107,53,.5); background-position: right center; }
        .coral-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }
        .tab-btn { flex: 1; padding: 9px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: all .2s; }
        .error-banner { animation: slideInError .3s ease both; }
      `}</style>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 10px rgba(0,0,0,.05)" }}>
        <nav style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <img src="/SamayaHRSidebar.png" alt="SamayaHR" style={{ width: 32, height: 32, borderRadius: 10, objectFit: "contain" }} onError={e=>{e.target.style.display="none";}} />
            <span className="sora" style={{ fontWeight: 900, fontSize: 20, color: "#0D1F2D" }}>Samaya<span style={{ color: "#FF6B35" }}>HR</span></span>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "none", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "7px 16px", cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B35"; e.currentTarget.style.color = "#FF6B35"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
        </nav>
      </header>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 64px" }}>
        <div style={{ display: "flex", borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 70px rgba(13,31,45,.15)" }}>

          {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
          <div style={{ width: "42%", flexShrink: 0, background: "linear-gradient(148deg,#0d0400 0%,#180800 30%,#1a0600 60%,#0d0300 100%)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 560 }}>
            <div style={{ position: "absolute", top: -80, left: -60, width: 360, height: 360, borderRadius: "50%", filter: "blur(90px)", background: "rgba(255,107,53,0.28)", pointerEvents: "none", zIndex: 1, animation: "gp 4s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: -60, right: -40, width: 300, height: 300, borderRadius: "50%", filter: "blur(80px)", background: "rgba(255,60,10,0.22)", pointerEvents: "none", zIndex: 1, animation: "gp 4s ease-in-out infinite 1s" }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "linear-gradient(to bottom,transparent,rgba(255,107,53,0.45) 30%,rgba(255,107,53,0.45) 70%,transparent)", zIndex: 20, pointerEvents: "none" }} />

            <HROrbitScene />

            <MCard style={{ top: 26, left: 18, animation: "floatA 4.5s ease-in-out infinite" }}   icon="💸" title="Payroll Done"   sub="✓ 248 employees"     subColor="#4ade80" />
            <MCard style={{ bottom: 52, right: 14, animation: "floatB 5.5s ease-in-out infinite" }} icon="⏰" title="Team Check-In" sub="48 / 50 present"     subColor="#fbbf24" />
            <MCard style={{ top: "43%", right: 12, animation: "floatC 6s ease-in-out infinite" }}  icon="🏖️" title="Leave Approved" sub="3 requests · instant" subColor="#fb923c" />

            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 5, pointerEvents: "none", width: 36, height: 36, borderRadius: 11, background: "rgba(8,3,1,0.96)", border: "1.5px solid rgba(255,107,53,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 22px rgba(255,107,53,0.7)" }}>
              <img src={logo} alt="SamayaHR" style={{ width: 22, height: 22, objectFit: "contain" }} />
            </div>
            <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,107,53,.14)", border: "1px solid rgba(255,107,53,.3)", borderRadius: 999, padding: "5px 14px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B35", display: "inline-block", animation: "ping-dot 1.8s ease-in-out infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "#FF6B35", textTransform: "uppercase", whiteSpace: "nowrap" }}>Live · Secure Access</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
          <div style={{ flex: 1, background: "#fff", padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
            <div style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>

              {/* Header */}
              <div className="fu1" style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#FF6B35,#FF5722)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(255,107,53,.3)", flexShrink: 0, position: "relative" }}>
                    <img src="/SamayaHRSidebar.png" alt="SamayaHR" style={{ width: 30, height: 30, objectFit: "contain" }} />
                    <div style={{ position: "absolute", top: -2, right: -2, width: 11, height: 11, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
                  </div>
                  <div>
                    <h3 className="sora" style={{ fontSize: 22, fontWeight: 900, color: "#0D1F2D", margin: 0 }}>
                      {showForm ? "Sign in to workspace" : "Welcome back 👋"}
                    </h3>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "3px 0 0" }}>
                      {activeTab === "company" ? "Enter your company credentials to continue." : "Takes 10 seconds · Pick up where you left off."}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── LANDING STATE ── */}
              {!showForm ? (
                <>
                  <VisualAnimation />
                  <button className="fu4 coral-btn" onClick={() => setShowForm(true)}>
                    Access My Workspace
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                  <p className="fu5" style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#9ca3af" }}>
                    New here?{" "}
                    <a href="/solutions/bookdemo" style={{ color: "#FF6B35", fontWeight: 700, textDecoration: "none" }}>Get a free personalised demo →</a>
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "#F7F8FA", borderRadius: 12, padding: "11px 14px", marginTop: 16 }}>
                    {[["🔒", "Secure & Private"], ["⚡", "Instant Login"]].map(([ic, tx]) => (
                      <div key={tx} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280", fontWeight: 500 }}><span>{ic}</span>{tx}</div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Tab switcher */}
                  <div className="fu1" style={{ display: "flex", gap: 4, borderRadius: 12, padding: 4, background: "#f3f4f6", marginBottom: 20, border: "1px solid #e5e7eb" }}>
                    {[["employee", "👤 Employee"], ["company", "🏢 Company"]].map(([tab, label]) => (
                      <button key={tab} className="tab-btn"
                        onClick={() => { setActiveTab(tab); setError(null); }}
                        style={{
                          background:  activeTab === tab ? "linear-gradient(135deg,#FF6B35,#FF5722)" : "transparent",
                          color:       activeTab === tab ? "#fff" : "#6b7280",
                          boxShadow:   activeTab === tab ? "0 2px 10px rgba(255,107,53,.3)" : "none",
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* ── SECURE ERROR BANNER ── */}
                  {error && (
                    <div className="error-banner" style={{
                      marginBottom: 14,
                      background: error.bg,
                      border: `1.5px solid ${error.border}`,
                      borderRadius: 12,
                      padding: "11px 14px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}>
                      {/* Left accent bar */}
                      <div style={{ width: 3, borderRadius: 999, background: error.color, alignSelf: "stretch", flexShrink: 0, minHeight: 18 }} />
                      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{error.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: error.color, lineHeight: 1.5 }}>
                          {error.text}
                        </p>
                        <p style={{ margin: "3px 0 0", fontSize: 11, color: error.color, opacity: 0.7, fontWeight: 500 }}>
                          Please verify your details and try again.
                        </p>
                      </div>
                      {/* Dismiss */}
                      <button
                        onClick={() => setError(null)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: error.color, opacity: 0.5, padding: 0, fontSize: 14, flexShrink: 0, marginTop: 1 }}
                        aria-label="Dismiss">✕</button>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Email */}
                    <div className="fu2">
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>
                        Email address <span style={{ color: "#FF6B35" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <input type="email" name="email" className="lg-input"
                          placeholder={activeTab === "company" ? "admin@company.com" : "you@company.com"}
                          value={formData.email} onChange={handleChange} required />
                      </div>
                    </div>

                    {/* Pass code (company) OR Password (employee) */}
                    {activeTab === "company" ? (
                      <div className="fu3">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".06em" }}>
                            Tenant Code <span style={{ color: "#FF6B35" }}>*</span>
                          </label>
                          <a href="mailto:support@samayahr.com" style={{ fontSize: 11, fontWeight: 700, color: "#FF6B35", textDecoration: "none" }}>Request Access →</a>
                        </div>
                        <div style={{ position: "relative" }}>
                          <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          </div>
                          <input type="text" name="companyKey" className="lg-input"
                            placeholder="e.g. SamayaClient0001"
                            value={formData.companyKey} onChange={handleChange} required />
                        </div>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0", lineHeight: 1.5 }}>
                          Your tenant code was provided when your company account was set up. Contact <a href="mailto:support@samayahr.com" style={{ color: "#FF6B35", textDecoration: "none", fontWeight: 600 }}>support@samayahr.com</a> to request access.
                        </p>
                      </div>
                    ) : (
                      <div className="fu3">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".06em" }}>
                            Password <span style={{ color: "#FF6B35" }}>*</span>
                          </label>
                          <a href="/forgot-password" style={{ fontSize: 11, fontWeight: 700, color: "#FF6B35", textDecoration: "none" }}>Forgot password?</a>
                        </div>
                        <div style={{ position: "relative" }}>
                          <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          </div>
                          <input type={showPass ? "text" : "password"} name="password" className="lg-input"
                            placeholder="••••••••" style={{ paddingRight: 42 }}
                            value={formData.password} onChange={handleChange} required />
                          <button type="button" onClick={() => setShowPass(p => !p)}
                            style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                            {showPass
                              ? <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                              : <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            }
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button type="submit" disabled={loading} className="fu4 coral-btn" style={{ marginTop: 4 }}>
                      {loading
                        ? <><svg style={{ animation: "spin-loader 1s linear infinite", width: 15, height: 15 }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity: .25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path style={{ opacity: .75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</>
                        : <>Sign In <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                      }
                    </button>
                  </form>

                  <button onClick={() => setShowForm(false)} style={{ marginTop: 14, width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#9ca3af", textAlign: "center" }}>
                    ← Back to sign-in screen
                  </button>
                </>
              )}

              <p className="fu5" style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "#9ca3af", lineHeight: 1.7 }}>
                By signing in, you agree to our{" "}
                <a href="/terms" style={{ color: "#FF6B35", textDecoration: "none" }}>Terms of Service</a>{" "}&{" "}
                <a href="/privacy" style={{ color: "#FF6B35", textDecoration: "none" }}>Privacy Policy</a>.
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}