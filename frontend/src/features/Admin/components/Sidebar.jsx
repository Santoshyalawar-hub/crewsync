// import React, { useState } from "react";

// /* ── SVG icon helper (same as original) ── */
// const Icon = ({ d, size = 18, strokeWidth = 1.8 }) => (
//   <svg width={size} height={size} fill="none" stroke="currentColor"
//     strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//     {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
//   </svg>
// );

// const ICONS = {
//   overview:     ["M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"],
//   hierarchy:    ["M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"],
//   workforce:    ["M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"],
//   performance:  ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
//   finance:      ["M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"],
//   attendance:   ["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"],
//   documents:    ["M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"],
//   assets:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2"],
//   support:      ["M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"],
//   notifications:["M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"],
// };

// const MENU = [
//   { id: "ad_home",    label: "Control Room",       icon: "overview",      group: "Core"       },
//   { id: "ad_org",     label: "People Map",        icon: "hierarchy",     group: "Core"       },
//   { id: "ad_team",    label: "Workforce Hub",        icon: "workforce",     group: "Core"       },
//   { id: "ad_perf",    label: "Growth Signals", icon: "performance",   group: "Operations" },
//   { id: "ad_finance", label: "MoneyOps & Payouts",    icon: "finance",       group: "Operations" },
//   { id: "ad_time",    label: "Time & Presence",      icon: "attendance",    group: "Operations" },
//   { id: "ad_docs",    label: "Vault",       icon: "documents",     group: "Resources"  },
//   { id: "ad_gear",    label: "Equipment Registry",       icon: "assets",        group: "Resources"  },
//   { id: "ad_alerts",  label: "Signals",     icon: "notifications", group: "System"     },
//   { id: "ad_support", label: "Care Desk",       icon: "support",       group: "System"     },
// ];

// const GROUPS = ["Core", "Operations", "Resources", "System"];

// export default function OperatorSidebar({ currentPage, navigateTo }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const [hovered,   setHovered]   = useState(null);

//   const companyName = (localStorage.getItem("companyName") || "Your Workspace").trim();
//   const initials    = companyName.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
//         .sb-root { font-family:'DM Sans',sans-serif; }
//         .sb-fd   { font-family:'Sora',sans-serif; }

//         .sb-aside {
//           height:100vh; position:sticky; top:0;
//           display:flex; flex-direction:column;
//           background:#0B1020;
//           transition:width .3s cubic-bezier(.4,0,.2,1);
//           overflow:hidden; flex-shrink:0; z-index:50;
//         }
//         .sb-aside.open   { width:252px; }
//         .sb-aside.closed { width:68px;  }

//         .sb-header {
//           padding:18px 14px 14px;
//           border-bottom:1px solid rgba(255,255,255,.06);
//           display:flex; align-items:center; gap:10px;
//           flex-shrink:0; min-height:72px;
//         }
//         .sb-logo {
//           width:38px; height:38px; border-radius:11px;
//           background:linear-gradient(135deg,#8B5CF6,#06B6D4);
//           display:flex; align-items:center; justify-content:center;
//           font-size:16px; font-weight:900; color:#fff; flex-shrink:0;
//           box-shadow:0 4px 14px rgba(139,92,246,.4);
//           font-family:'Sora',sans-serif;
//         }
//         .sb-brand { overflow:hidden; }
//         .sb-brand-name { font-size:17px; font-weight:900; color:#fff; white-space:nowrap; font-family:'Sora',sans-serif; }
//         .sb-brand-sub  { font-size:10px; font-weight:600; color:rgba(255,255,255,.35); text-transform:uppercase; letter-spacing:.1em; white-space:nowrap; }

//         .sb-toggle {
//           position:absolute; top:22px; right:-12px;
//           width:24px; height:24px; border-radius:50%;
//           background:#fff; border:1.5px solid #e5e7eb;
//           box-shadow:0 2px 8px rgba(0,0,0,.12);
//           display:flex; align-items:center; justify-content:center;
//           cursor:pointer; color:#8B5CF6; transition:all .2s; z-index:60;
//         }
//         .sb-toggle:hover { background:#8B5CF6; color:#fff; border-color:#8B5CF6; }

//         .sb-company {
//           margin:12px 10px 8px;
//           background:rgba(255,255,255,.05);
//           border:1px solid rgba(255,255,255,.08);
//           border-radius:12px; padding:10px 12px;
//           display:flex; align-items:center; gap:10px; flex-shrink:0;
//         }
//         .sb-company-avatar {
//           width:32px; height:32px; border-radius:9px;
//           background:linear-gradient(135deg,#06B6D4,#0D9488);
//           display:flex; align-items:center; justify-content:center;
//           font-size:12px; font-weight:900; color:#fff;
//           flex-shrink:0; font-family:'Sora',sans-serif;
//         }
//         .sb-company-name { font-size:12px; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
//         .sb-company-plan { font-size:10px; color:#06B6D4; font-weight:700; }

//         .sb-nav { flex:1; overflow-y:auto; overflow-x:hidden; padding:4px 8px 8px; }
//         .sb-nav::-webkit-scrollbar { width:3px; }
//         .sb-nav::-webkit-scrollbar-track { background:transparent; }
//         .sb-nav::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:2px; }

//         .sb-group-label {
//           font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.1em;
//           color:rgba(255,255,255,.2); padding:12px 8px 4px; white-space:nowrap; overflow:hidden;
//         }

//         .sb-item {
//           display:flex; align-items:center; gap:10px; padding:9px 10px;
//           border-radius:10px; cursor:pointer; transition:all .18s;
//           position:relative; color:rgba(255,255,255,.5); margin-bottom:2px;
//           border:1px solid transparent; white-space:nowrap;
//           background:transparent; width:100%; text-align:left;
//         }
//         .sb-item:hover { background:rgba(255,255,255,.06); color:rgba(255,255,255,.85); border-color:rgba(255,255,255,.05); }
//         .sb-item.active {
//           background:linear-gradient(135deg,rgba(139,92,246,.18),rgba(139,92,246,.08));
//           color:#fff; border-color:rgba(139,92,246,.25);
//         }
//         .sb-item.active .sb-icon-wrap { color:#8B5CF6; }

//         .sb-active-bar {
//           position:absolute; left:0; top:50%; transform:translateY(-50%);
//           width:3px; height:60%; border-radius:0 2px 2px 0;
//           background:#8B5CF6; box-shadow:0 0 8px rgba(139,92,246,.5);
//         }
//         .sb-icon-wrap {
//           width:22px; height:22px; display:flex; align-items:center;
//           justify-content:center; flex-shrink:0; transition:color .18s;
//         }
//         .sb-label { font-size:13px; font-weight:600; overflow:hidden; text-overflow:ellipsis; flex:1; }

//         .sb-tooltip {
//           position:absolute; left:calc(100% + 14px); top:50%; transform:translateY(-50%);
//           background:#0B1020; color:#fff; font-size:12px; font-weight:700;
//           padding:6px 12px; border-radius:8px; border:1px solid rgba(255,255,255,.1);
//           white-space:nowrap; pointer-events:none;
//           box-shadow:0 4px 20px rgba(0,0,0,.4); z-index:999; font-family:'Sora',sans-serif;
//         }
//         .sb-tooltip::before {
//           content:''; position:absolute; left:-5px; top:50%; transform:translateY(-50%);
//           border:5px solid transparent; border-right-color:rgba(255,255,255,.1);
//         }

//         .sb-footer {
//           margin:8px 10px 14px;
//           background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
//           border-radius:12px; padding:12px; flex-shrink:0;
//         }
//         .sb-footer-live { display:flex; align-items:center; gap:8px; }
//         .sb-live-dot { width:7px; height:7px; border-radius:50%; background:#06B6D4; animation:sb-pulse 2s ease-in-out infinite; }
//         @keyframes sb-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.6)} }
//         .sb-footer-text { font-size:11px; color:rgba(255,255,255,.4); font-weight:500; white-space:nowrap; }
//         .sb-footer-text strong { color:#06B6D4; }
//       `}</style>

//       <aside className={`sb-root sb-aside ${collapsed ? "closed" : "open"}`}>

//         {/* Toggle */}
//         <button className="sb-toggle" onClick={() => setCollapsed(c => !c)}>
//           <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//             {collapsed
//               ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
//               : <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
//             }
//           </svg>
//         </button>

//         {/* Header */}
//         <div className="sb-header">
//           <div className="sb-logo">S</div>
//           {!collapsed && (
//             <div className="sb-brand">
//               <div className="sb-fd sb-brand-name">CrewSync</div>
//               <div className="sb-brand-sub">Ops Console</div>
//             </div>
//           )}
//         </div>

//         {/* Workspace badge */}
//         {!collapsed && (
//           <div className="sb-company">
//             <div className="sb-company-avatar">{initials || "C"}</div>
//             <div style={{ overflow:"hidden" }}>
//               <div className="sb-company-name">{companyName}</div>
//               <div className="sb-company-plan">Pro Plan · Active</div>
//             </div>
//           </div>
//         )}

//         {/* Nav */}
//         <nav className="sb-nav">
//           {GROUPS.map(group => {
//             const items = MENU.filter(m => m.group === group);
//             return (
//               <div key={group}>
//                 {!collapsed && <div className="sb-group-label">{group}</div>}
//                 {collapsed && <div style={{ height:8 }} />}
//                 {items.map(item => {
//                   const active = currentPage === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       className={`sb-item${active ? " active" : ""}`}
//                       onClick={() => navigateTo(item.id)}
//                       onMouseEnter={() => setHovered(item.id)}
//                       onMouseLeave={() => setHovered(null)}
//                       style={{ justifyContent: collapsed ? "center" : "flex-start" }}
//                     >
//                       {active && <div className="sb-active-bar" />}
//                       <div className="sb-icon-wrap">
//                         <Icon d={ICONS[item.icon]} size={17} strokeWidth={active ? 2.2 : 1.8} />
//                       </div>
//                       {!collapsed && <span className="sb-label">{item.label}</span>}
//                       {collapsed && hovered === item.id && (
//                         <div className="sb-tooltip">{item.label}</div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             );
//           })}
//         </nav>

//         {/* Footer — System Online */}
//         <div className="sb-footer">
//           <div className="sb-footer-live">
//             <div className="sb-live-dot" />
//             {!collapsed && <div className="sb-footer-text">System <strong>Online</strong></div>}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }


//18-3-2026

// import React, { useState, useEffect } from "react";
// import { API_BASE_URL } from "@/lib/apiClient";

// /* ── SVG icon helper ── */
// const Icon = ({ d, size = 18, strokeWidth = 1.8 }) => (
//   <svg width={size} height={size} fill="none" stroke="currentColor"
//     strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//     {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
//   </svg>
// );

// const ICONS = {
//   overview:      ["M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"],
//   hierarchy:     ["M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"],
//   workforce:     ["M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"],
//   performance:   ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
//   finance:       ["M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"],
//   attendance:    ["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"],
//   documents:     ["M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"],
//   assets:        ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2"],
//   support:       ["M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"],
//   notifications: ["M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"],
// };

// const MENU = [
//   { id: "ad_home",    label: "Control Room",       icon: "overview",      group: "Core"       },
//   { id: "ad_org",     label: "People Map",        icon: "hierarchy",     group: "Core"       },
//   { id: "ad_team",    label: "Workforce Hub",        icon: "workforce",     group: "Core"       },
//   { id: "ad_perf",    label: "Growth Signals", icon: "performance",   group: "Operations" },
//   { id: "ad_finance", label: "MoneyOps & Payouts",    icon: "finance",       group: "Operations" },
//   { id: "ad_time",    label: "Time & Presence",      icon: "attendance",    group: "Operations" },
//   { id: "ad_docs",    label: "Vault",       icon: "documents",     group: "Resources"  },
//   { id: "ad_gear",    label: "Equipment Registry",       icon: "assets",        group: "Resources"  },
//   { id: "ad_alerts",  label: "Signals",     icon: "notifications", group: "System"     },
//   { id: "ad_support", label: "Care Desk",       icon: "support",       group: "System"     },
// ];

// const GROUPS = ["Core", "Operations", "Resources", "System"];

// /* ─────────────────────────────────────────────────────────────
//    Fetch company logo by tenantCode
//    GET /api/global-admin/companies/by-tenant/{tenantCode}
//    Returns Workspace entity → logoUrl (Cloudinary CDN URL)
// ───────────────────────────────────────────────────────────── */
// function useWorkspaceLogo(tenantCode) {
//   const [logoUrl, setLogoUrl] = useState(
//     () => localStorage.getItem("companyLogoUrl") || ""
//   );
//   const [logoError, setLogoError] = useState(false);

//   useEffect(() => {
//     if (!tenantCode) return;

//     const token = (localStorage.getItem("token") || "").trim();
//     const authH = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

//     const fetch_ = async () => {
//       try {
//         const res  = await fetch(
//           `${API_BASE_URL}/api/global-admin/companies/by-tenant/${tenantCode}`,
//           { headers: { Authorization: authH, "Content-Type": "application/json" } }
//         );
//         if (!res.ok) return;
//         const json = await res.json();

//         /* Backend wraps in { success, data } */
//         const company = json?.data ?? json;
//         const url     = company?.logoUrl || "";

//         if (url) {
//           setLogoUrl(url);
//           setLogoError(false);
//           /* Cache so TopNav / other components can read it instantly */
//           localStorage.setItem("companyLogoUrl", url);
//         }
//       } catch {
//         /* Silently fall back to initials */
//       }
//     };

//     fetch_();
//   }, [tenantCode]);

//   return { logoUrl, logoError, setLogoError };
// }

// /* ─────────────────────────────────────────────────────────────
//    Logo component — Cloudinary image OR coloured initials
// ───────────────────────────────────────────────────────────── */
// function WorkspaceLogo({ logoUrl, companyName, size = 42, radius = 12 }) {
//   const [err, setErr] = useState(false);

//   const initials = (companyName || "C")
//     .split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

//   /* When logoUrl changes (new fetch), reset error state */
//   useEffect(() => { setErr(false); }, [logoUrl]);

//   if (logoUrl && !err) {
//     return (
//       <img
//         src={logoUrl}
//         alt={companyName}
//         onError={() => setErr(true)}
//         style={{
//           width: size, height: size, borderRadius: radius,
//           objectFit: "contain", background: "#fff",
//           border: "1.5px solid rgba(255,255,255,0.15)",
//           padding: 4, flexShrink: 0,
//         }}
//       />
//     );
//   }

//   /* Fallback: coloured initials */
//   return (
//     <div style={{
//       width: size, height: size, borderRadius: radius,
//       background: "linear-gradient(135deg,#8B5CF6,#06B6D4)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       fontSize: size * 0.35, fontWeight: 900, color: "#fff",
//       fontFamily: "'Sora',sans-serif", flexShrink: 0,
//       boxShadow: "0 4px 14px rgba(139,92,246,0.4)",
//       border: "1.5px solid rgba(255,255,255,0.1)",
//     }}>
//       {initials}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    MAIN OperatorSidebar
// ═══════════════════════════════════════════════════════════ */
// export default function OperatorSidebar({ currentPage, navigateTo }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const [hovered,   setHovered]   = useState(null);

//   const companyName = (localStorage.getItem("companyName") || "Your Workspace").trim();
//   const tenantCode  = (localStorage.getItem("tenantCode")  || "").trim();

//   /* Fetch Cloudinary logo */
//   const { logoUrl, logoError, setLogoError } = useWorkspaceLogo(tenantCode);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
//         .sb-root { font-family:'DM Sans',sans-serif; }
//         .sb-fd   { font-family:'Sora',sans-serif; }

//         .sb-aside {
//           height: 100vh; position: sticky; top: 0;
//           display: flex; flex-direction: column;
//           background: #0B1020;
//           transition: width .3s cubic-bezier(.4,0,.2,1);
//           overflow: hidden; flex-shrink: 0; z-index: 50;
//         }
//         .sb-aside.open   { width: 252px; }
//         .sb-aside.closed { width: 68px;  }

//         /* ── Header — logo area ── */
//         .sb-header {
//           padding: 16px 14px;
//           border-bottom: 1px solid rgba(255,255,255,.06);
//           display: flex; align-items: center; gap: 10px;
//           flex-shrink: 0; min-height: 72px;
//         }
//         .sb-brand { overflow: hidden; }
//         .sb-brand-name {
//           font-size: 15px; font-weight: 900; color: #fff;
//           white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
//           font-family: 'Sora', sans-serif; max-width: 160px;
//         }
//         .sb-brand-sub {
//           font-size: 10px; font-weight: 600;
//           color: rgba(255,255,255,.35);
//           text-transform: uppercase; letter-spacing: .1em;
//           white-space: nowrap;
//         }

//         /* ── Collapse toggle ── */
//         .sb-toggle {
//           position: absolute; top: 22px; right: -12px;
//           width: 24px; height: 24px; border-radius: 50%;
//           background: #fff; border: 1.5px solid #e5e7eb;
//           box-shadow: 0 2px 8px rgba(0,0,0,.12);
//           display: flex; align-items: center; justify-content: center;
//           cursor: pointer; color: #8B5CF6;
//           transition: all .2s; z-index: 60;
//         }
//         .sb-toggle:hover { background: #8B5CF6; color: #fff; border-color: #8B5CF6; }

//         /* ── Workspace badge (below header when expanded) ── */
//         .sb-company {
//           margin: 10px 10px 6px;
//           background: rgba(255,255,255,.05);
//           border: 1px solid rgba(255,255,255,.08);
//           border-radius: 12px; padding: 10px 12px;
//           display: flex; align-items: center; gap: 10px; flex-shrink: 0;
//         }
//         .sb-company-name {
//           font-size: 12px; font-weight: 700; color: #fff;
//           white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
//         }
//         .sb-company-plan { font-size: 10px; color: #06B6D4; font-weight: 700; }

//         /* ── Nav ── */
//         .sb-nav {
//           flex: 1; overflow-y: auto; overflow-x: hidden;
//           padding: 4px 8px 8px;
//         }
//         .sb-nav::-webkit-scrollbar       { width: 3px; }
//         .sb-nav::-webkit-scrollbar-track  { background: transparent; }
//         .sb-nav::-webkit-scrollbar-thumb  { background: rgba(255,255,255,.1); border-radius: 2px; }

//         .sb-group-label {
//           font-size: 9.5px; font-weight: 700;
//           text-transform: uppercase; letter-spacing: .1em;
//           color: rgba(255,255,255,.2);
//           padding: 12px 8px 4px;
//           white-space: nowrap; overflow: hidden;
//         }

//         .sb-item {
//           display: flex; align-items: center; gap: 10px;
//           padding: 9px 10px; border-radius: 10px;
//           cursor: pointer; transition: all .18s;
//           position: relative; color: rgba(255,255,255,.5);
//           margin-bottom: 2px; border: 1px solid transparent;
//           white-space: nowrap; background: transparent;
//           width: 100%; text-align: left;
//         }
//         .sb-item:hover {
//           background: rgba(255,255,255,.06);
//           color: rgba(255,255,255,.85);
//           border-color: rgba(255,255,255,.05);
//         }
//         .sb-item.active {
//           background: linear-gradient(135deg,rgba(139,92,246,.18),rgba(139,92,246,.08));
//           color: #fff; border-color: rgba(139,92,246,.25);
//         }
//         .sb-item.active .sb-icon-wrap { color: #8B5CF6; }

//         .sb-active-bar {
//           position: absolute; left: 0; top: 50%; transform: translateY(-50%);
//           width: 3px; height: 60%; border-radius: 0 2px 2px 0;
//           background: #8B5CF6; box-shadow: 0 0 8px rgba(139,92,246,.5);
//         }
//         .sb-icon-wrap {
//           width: 22px; height: 22px;
//           display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0; transition: color .18s;
//         }
//         .sb-label {
//           font-size: 13px; font-weight: 600;
//           overflow: hidden; text-overflow: ellipsis; flex: 1;
//         }

//         /* ── Tooltip (collapsed mode) ── */
//         .sb-tooltip {
//           position: absolute; left: calc(100% + 14px); top: 50%;
//           transform: translateY(-50%);
//           background: #0B1020; color: #fff;
//           font-size: 12px; font-weight: 700;
//           padding: 6px 12px; border-radius: 8px;
//           border: 1px solid rgba(255,255,255,.1);
//           white-space: nowrap; pointer-events: none;
//           box-shadow: 0 4px 20px rgba(0,0,0,.4);
//           z-index: 999; font-family: 'Sora', sans-serif;
//         }
//         .sb-tooltip::before {
//           content: ''; position: absolute; left: -5px; top: 50%;
//           transform: translateY(-50%);
//           border: 5px solid transparent;
//           border-right-color: rgba(255,255,255,.1);
//         }

//         /* ── Footer ── */
//         .sb-footer {
//           margin: 8px 10px 14px;
//           background: rgba(255,255,255,.04);
//           border: 1px solid rgba(255,255,255,.07);
//           border-radius: 12px; padding: 12px; flex-shrink: 0;
//         }
//         .sb-footer-live { display: flex; align-items: center; gap: 8px; }
//         .sb-live-dot {
//           width: 7px; height: 7px; border-radius: 50%;
//           background: #06B6D4;
//           animation: sb-pulse 2s ease-in-out infinite;
//           flex-shrink: 0;
//         }
//         @keyframes sb-pulse {
//           0%,100% { opacity:1; transform:scale(1); }
//           50%      { opacity:.4; transform:scale(1.6); }
//         }
//         .sb-footer-text { font-size: 11px; color: rgba(255,255,255,.4); font-weight: 500; white-space: nowrap; }
//         .sb-footer-text strong { color: #06B6D4; }

//         /* Tenant pill */
//         .sb-tenant-pill {
//           display: inline-flex; align-items: center; gap: 4px;
//           background: rgba(6,182,212,.12);
//           border: 1px solid rgba(6,182,212,.2);
//           border-radius: 6px; padding: 2px 7px;
//           font-size: 9px; font-weight: 800;
//           color: #06B6D4; letter-spacing: .06em;
//           font-family: monospace; white-space: nowrap;
//         }
//       `}</style>

//       <aside className={`sb-root sb-aside ${collapsed ? "closed" : "open"}`}>

//         {/* ── Collapse Toggle ── */}
//         <button className="sb-toggle" onClick={() => setCollapsed(c => !c)}>
//           <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//             {collapsed
//               ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
//               : <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
//             }
//           </svg>
//         </button>

//         {/* ── Header — Workspace Logo ── */}
//         <div className="sb-header">
//           {/*
//             Logo spot:
//             - Expanded  → logo image (or initials) + company name + tenant code pill
//             - Collapsed → just the logo image (or initials), centered
//           */}
//           <WorkspaceLogo
//             logoUrl={logoUrl}
//             companyName={companyName}
//             size={collapsed ? 40 : 42}
//             radius={11}
//           />

//           {!collapsed && (
//             <div className="sb-brand">
//               <div className="sb-fd sb-brand-name">{companyName}</div>
//               {tenantCode && (
//                 <div style={{ marginTop: 4 }}>
//                   <span className="sb-tenant-pill">{tenantCode}</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── Workspace badge (expanded only) ── */}
//         {!collapsed && (
//           <div className="sb-company">
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div className="sb-company-name">Ops Console</div>
//               <div className="sb-company-plan">Pro Plan · Active</div>
//             </div>
//             <div style={{ flexShrink: 0 }}>
//               <div className="sb-live-dot" style={{ animation: "sb-pulse 2s ease-in-out infinite" }} />
//             </div>
//           </div>
//         )}

//         {/* ── Nav ── */}
//         <nav className="sb-nav">
//           {GROUPS.map(group => {
//             const items = MENU.filter(m => m.group === group);
//             return (
//               <div key={group}>
//                 {!collapsed && <div className="sb-group-label">{group}</div>}
//                 {collapsed  && <div style={{ height: 8 }} />}
//                 {items.map(item => {
//                   const active = currentPage === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       className={`sb-item${active ? " active" : ""}`}
//                       onClick={() => navigateTo(item.id)}
//                       onMouseEnter={() => setHovered(item.id)}
//                       onMouseLeave={() => setHovered(null)}
//                       style={{ justifyContent: collapsed ? "center" : "flex-start" }}
//                     >
//                       {active && <div className="sb-active-bar" />}
//                       <div className="sb-icon-wrap">
//                         <Icon d={ICONS[item.icon]} size={17} strokeWidth={active ? 2.2 : 1.8} />
//                       </div>
//                       {!collapsed && <span className="sb-label">{item.label}</span>}
//                       {collapsed && hovered === item.id && (
//                         <div className="sb-tooltip">{item.label}</div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             );
//           })}
//         </nav>

//         {/* ── Footer ── */}
//         <div className="sb-footer">
//           <div className="sb-footer-live">
//             <div className="sb-live-dot" />
//             {!collapsed && (
//               <div className="sb-footer-text">
//                 System <strong>Online</strong>
//               </div>
//             )}
//           </div>
//         </div>

//       </aside>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import api from "@/lib/apiClient";

/* ── SVG icon helper ── */
const Icon = ({ d, size = 18, strokeWidth = 1.8 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  overview:      ["M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"],
  hierarchy:     ["M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"],
  workforce:     ["M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"],
  performance:   ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
  finance:       ["M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"],
  attendance:    ["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"],
  documents:     ["M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"],
  // ✅ NEW icon for PeopleOps Vault — pen/signature style
  hrdocuments:   ["M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"],
  assets:        ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2"],
  support:       ["M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"],
  notifications: ["M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"],
  policy:        ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"],
};

// ─────────────────────────────────────────────────────────────────────────────
//  MENU — each item.id must exactly match a key in PAGE_REGISTRY in AppShell.jsx
//
//  ✅ ADDED: { id: "ad_hrdocs", label: "People Vault", icon: "hrdocuments", group: "Resources" }
//  This is the ONLY change from your original file.
//  It appears right after "Vault" in the Resources group.
// ─────────────────────────────────────────────────────────────────────────────
const MENU = [
  { id: "ad_home",    label: "Control Room",       icon: "overview",      group: "Core"       },
  { id: "ad_org",     label: "People Map",        icon: "hierarchy",     group: "Core"       },
  { id: "ad_team",    label: "Workforce Hub",        icon: "workforce",     group: "Core"       },
  { id: "ad_perf",    label: "Growth Signals", icon: "performance",   group: "Operations" },
  { id: "ad_finance", label: "MoneyOps & Payouts",    icon: "finance",       group: "Operations" },
  { id: "ad_time",    label: "Time & Presence",      icon: "attendance",    group: "Operations" },
  { id: "ad_docs",    label: "Vault",       icon: "documents",     group: "Resources"  },
  { id: "ad_hrdocs",  label: "People Vault",         icon: "hrdocuments",   group: "Resources"  }, // ← NEW ✅
  { id: "ad_policy",  label: "Playbook Vault",         icon: "policy",        group: "Resources"  },
  { id: "ad_gear",    label: "Equipment Registry",       icon: "assets",        group: "Resources"  },
  { id: "ad_alerts",  label: "Signals",     icon: "notifications", group: "System"     },
  { id: "ad_support", label: "Care Desk",       icon: "support",       group: "System"     },
];

const GROUPS = ["Core", "Operations", "Resources", "System"];

/* ─────────────────────────────────────────────────────────────────────────────
   Fetch company logo by tenantCode
────────────────────────────────────────────────────────────────────────────── */
function useWorkspaceLogo(tenantCode) {
  const [logoUrl,   setLogoUrl]   = useState(() => localStorage.getItem("companyLogoUrl") || "");
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (!tenantCode) return;

    const fetch_ = async () => {
      try {
        const res  = await api.get(
          `/api/global-admin/companies/by-tenant/${tenantCode}`
        );
        const json = res.data;
        const url  = (json?.data ?? json)?.logoUrl || "";
        if (url) {
          setLogoUrl(url);
          setLogoError(false);
          localStorage.setItem("companyLogoUrl", url);
        }
      } catch { /* silently fall back to initials */ }
    };

    fetch_();
  }, [tenantCode]);

  return { logoUrl, logoError, setLogoError };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Logo — Cloudinary image OR coloured initials
────────────────────────────────────────────────────────────────────────────── */
function WorkspaceLogo({ logoUrl, companyName, size = 42, radius = 12 }) {
  const [err, setErr] = useState(false);
  const initials = (companyName || "C").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  useEffect(() => { setErr(false); }, [logoUrl]);

  if (logoUrl && !err) {
    return (
      <img src={logoUrl} alt={companyName} onError={() => setErr(true)}
        style={{ width: size, height: size, borderRadius: radius,
          objectFit: "contain", background: "#fff",
          border: "1.5px solid rgba(255,255,255,0.15)",
          padding: 4, flexShrink: 0 }} />
    );
  }

  return (
    <div style={{ width: size, height: size, borderRadius: radius,
      background: "linear-gradient(135deg,#8B5CF6,#06B6D4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 900, color: "#fff",
      fontFamily: "'Sora',sans-serif", flexShrink: 0,
      boxShadow: "0 4px 14px rgba(139,92,246,0.4)",
      border: "1.5px solid rgba(255,255,255,0.1)" }}>
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN OperatorSidebar — identical to your original except MENU above
═══════════════════════════════════════════════════════════ */
export default function OperatorSidebar({ currentPage, navigateTo }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered,   setHovered]   = useState(null);

  const companyName = (localStorage.getItem("companyName") || "Your Workspace").trim();
  const tenantCode  = (localStorage.getItem("tenantCode")  || "").trim();

  const { logoUrl } = useWorkspaceLogo(tenantCode);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        .sb-root { font-family:'DM Sans',sans-serif; }
        .sb-fd   { font-family:'Sora',sans-serif; }

        .sb-aside {
          height: 100vh; position: sticky; top: 0;
          display: flex; flex-direction: column;
          background: #0B1020;
          transition: width .3s cubic-bezier(.4,0,.2,1);
          overflow: hidden; flex-shrink: 0; z-index: 50;
        }
        .sb-aside.open   { width: 252px; }
        .sb-aside.closed { width: 68px;  }

        .sb-header {
          padding: 16px 14px;
          border-bottom: 1px solid rgba(255,255,255,.06);
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0; min-height: 72px;
        }
        .sb-brand { overflow: hidden; }
        .sb-brand-name {
          font-size: 15px; font-weight: 900; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          font-family: 'Sora', sans-serif; max-width: 160px;
        }
        .sb-brand-sub {
          font-size: 10px; font-weight: 600;
          color: rgba(255,255,255,.35);
          text-transform: uppercase; letter-spacing: .1em;
          white-space: nowrap;
        }

        .sb-toggle {
          position: absolute; top: 22px; right: -12px;
          width: 24px; height: 24px; border-radius: 50%;
          background: #fff; border: 1.5px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,.12);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #8B5CF6;
          transition: all .2s; z-index: 60;
        }
        .sb-toggle:hover { background: #8B5CF6; color: #fff; border-color: #8B5CF6; }

        .sb-company {
          margin: 10px 10px 6px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px; padding: 10px 12px;
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .sb-company-name { font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb-company-plan { font-size: 10px; color: #06B6D4; font-weight: 700; }

        .sb-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 4px 8px 8px;
        }
        .sb-nav::-webkit-scrollbar       { width: 3px; }
        .sb-nav::-webkit-scrollbar-track  { background: transparent; }
        .sb-nav::-webkit-scrollbar-thumb  { background: rgba(255,255,255,.1); border-radius: 2px; }

        .sb-group-label {
          font-size: 9.5px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .1em;
          color: rgba(255,255,255,.2);
          padding: 12px 8px 4px;
          white-space: nowrap; overflow: hidden;
        }

        .sb-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 10px;
          cursor: pointer; transition: all .18s;
          position: relative; color: rgba(255,255,255,.5);
          margin-bottom: 2px; border: 1px solid transparent;
          white-space: nowrap; background: transparent;
          width: 100%; text-align: left;
        }
        .sb-item:hover {
          background: rgba(255,255,255,.06);
          color: rgba(255,255,255,.85);
          border-color: rgba(255,255,255,.05);
        }
        .sb-item.active {
          background: linear-gradient(135deg,rgba(139,92,246,.18),rgba(139,92,246,.08));
          color: #fff; border-color: rgba(139,92,246,.25);
        }
        .sb-item.active .sb-icon-wrap { color: #8B5CF6; }

        .sb-active-bar {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 60%; border-radius: 0 2px 2px 0;
          background: #8B5CF6; box-shadow: 0 0 8px rgba(139,92,246,.5);
        }
        .sb-icon-wrap {
          width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: color .18s;
        }
        .sb-label { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; flex: 1; }

        .sb-tooltip {
          position: absolute; left: calc(100% + 14px); top: 50%;
          transform: translateY(-50%);
          background: #0B1020; color: #fff;
          font-size: 12px; font-weight: 700;
          padding: 6px 12px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,.1);
          white-space: nowrap; pointer-events: none;
          box-shadow: 0 4px 20px rgba(0,0,0,.4);
          z-index: 999; font-family: 'Sora', sans-serif;
        }
        .sb-tooltip::before {
          content: ''; position: absolute; left: -5px; top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: rgba(255,255,255,.1);
        }

        .sb-footer {
          margin: 8px 10px 14px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 12px; padding: 12px; flex-shrink: 0;
        }
        .sb-footer-live { display: flex; align-items: center; gap: 8px; }
        .sb-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #06B6D4;
          animation: sb-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes sb-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(1.6); }
        }
        .sb-footer-text { font-size: 11px; color: rgba(255,255,255,.4); font-weight: 500; white-space: nowrap; }
        .sb-footer-text strong { color: #06B6D4; }

        .sb-tenant-pill {
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(6,182,212,.12);
          border: 1px solid rgba(6,182,212,.2);
          border-radius: 6px; padding: 2px 7px;
          font-size: 9px; font-weight: 800;
          color: #06B6D4; letter-spacing: .06em;
          font-family: monospace; white-space: nowrap;
        }
      `}</style>

      <aside className={`sb-root sb-aside ${collapsed ? "closed" : "open"}`}>

        {/* Collapse Toggle */}
        <button className="sb-toggle" onClick={() => setCollapsed(c => !c)}>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              : <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>}
          </svg>
        </button>

        {/* Header — Workspace Logo */}
        <div className="sb-header">
          {collapsed ? (
            <img src="/crewsync-mark.svg" alt="CrewSync"
              style={{ width: 40, height: 40, borderRadius: 11, objectFit: "contain", flexShrink: 0, mixBlendMode: "screen" }} />
          ) : (
            <img src="/crewsync-logo.svg" alt="CrewSync"
              style={{ height: 42, maxWidth: 175, objectFit: "contain", objectPosition: "left", flexShrink: 0, mixBlendMode: "screen" }} />
          )}
        </div>

        {/* Workspace badge (expanded only) */}
        {!collapsed && (
          <div className="sb-company">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sb-company-name">Ops Console</div>
              <div className="sb-company-plan">Pro Plan · Active</div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <div className="sb-live-dot" />
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="sb-nav">
          {GROUPS.map(group => {
            const items = MENU.filter(m => m.group === group);
            return (
              <div key={group}>
                {!collapsed && <div className="sb-group-label">{group}</div>}
                {collapsed  && <div style={{ height: 8 }} />}
                {items.map(item => {
                  const active = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`sb-item${active ? " active" : ""}`}
                      onClick={() => navigateTo(item.id)}
                      onMouseEnter={() => setHovered(item.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                    >
                      {active && <div className="sb-active-bar" />}
                      <div className="sb-icon-wrap">
                        <Icon d={ICONS[item.icon]} size={17} strokeWidth={active ? 2.2 : 1.8} />
                      </div>
                      {!collapsed && <span className="sb-label">{item.label}</span>}
                      {collapsed && hovered === item.id && (
                        <div className="sb-tooltip">{item.label}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          <div className="sb-footer-live">
            <div className="sb-live-dot" />
            {!collapsed && (
              <div className="sb-footer-text">
                System <strong>Online</strong>
              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}