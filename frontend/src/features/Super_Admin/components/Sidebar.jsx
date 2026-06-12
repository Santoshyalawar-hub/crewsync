// import React, { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const T = {
//   coral:  "#8B5CF6",
//   navy:   "#0B1020",
//   border: "#E8ECF2",
//   soft:   "#64748B",
// };

// /* ── SVG icon helper ── */
// const Ic = ({ d, size = 15, strokeWidth = 1.8 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//     stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <path d={d} />
//   </svg>
// );

// const ICONS = {
//   grid:     "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
//   users:    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
//   shield:   "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
//   dollar:   "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
//   calendar: "M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
//   file:     "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 7.7a1 1 0 01.293.707V19a2 2 0 01-2 2z",
//   help:     "M8.228 9a3.75 3.75 0 117.544 1.5c0 1.5-1.5 2.25-2.25 2.75S12 14 12 15m0 3h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
//   onboard:  "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
// };

// const NAV_SECTIONS = [
//   {
//     label: "Main",
//     items: [
//       { key: "sa_home",    label: "Control Room",       icon: "grid"     },
//       { key: "sa_team",    label: "People Grid",icon: "users"    },
//       { key: "sa_admins",  label: "Manage Operators",   icon: "shield"   },
//       { key: "sa_onboard", label: "Add Person",    icon: "onboard"  },
//     ],
//   },
//   {
//     label: "Operations",
//     items: [
//       { key: "sa_finance", label: "Money Desk",     icon: "dollar"   },
//       { key: "sa_time",    label: "Presence",      icon: "calendar" },
//       { key: "sa_docs",    label: "Vault",       icon: "file"     },
//     ],
//   },
//   {
//     label: "Care Desk",
//     items: [
//       { key: "sa_support", label: "Care Desk",  icon: "help"     },
//     ],
//   },
// ];

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
// .sasb * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
// .sasb .fd { font-family:'Sora',sans-serif; }

// .sasb-link {
//   display:flex; align-items:center; gap:10px; padding:10px 12px;
//   border-radius:14px; color:#64748B; font-size:13px; font-weight:600;
//   transition:all .18s ease; position:relative;
//   border:1px solid transparent; cursor:pointer; background:transparent;
//   width:100%; text-align:left;
// }
// .sasb-link:hover {
//   background:linear-gradient(135deg,rgba(139,92,246,.08),rgba(6,182,212,.04));
//   color:${T.coral}; border-color:rgba(139,92,246,.10); transform:translateX(2px);
// }
// .sasb-link.active {
//   background:linear-gradient(135deg,rgba(139,92,246,.14),rgba(6,182,212,.05));
//   color:${T.navy}; font-weight:800; border-color:rgba(139,92,246,.14);
//   box-shadow:inset 3px 0 0 ${T.coral},0 8px 18px rgba(139,92,246,.08);
// }
// .sasb-link.active .sasb-icon-wrap {
//   background:linear-gradient(135deg,${T.coral},#FBBF24);
//   color:#fff; box-shadow:0 6px 14px rgba(139,92,246,.25);
// }
// .sasb-link.collapsed-link { justify-content:center; padding:11px 0; gap:0; }

// .sasb-icon-wrap {
//   width:30px; height:30px; border-radius:10px; flex-shrink:0;
//   display:flex; align-items:center; justify-content:center;
//   transition:all .18s ease; background:rgba(100,116,139,.10); color:inherit;
// }
// .sasb-link:hover .sasb-icon-wrap { background:rgba(139,92,246,.10); color:${T.coral}; }

// .sasb-section-label {
//   font-size:9px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
//   color:#94A3B8; padding:8px 12px 6px; display:block;
// }

// .sasb-collapse-btn {
//   position:absolute; top:50%; transform:translateY(-50%); right:-11px; z-index:10;
//   width:24px; height:24px; border-radius:999px;
//   background:linear-gradient(135deg,${T.coral},#FBBF24);
//   color:#fff; border:2.5px solid #fff;
//   display:flex; align-items:center; justify-content:center;
//   cursor:pointer; box-shadow:0 4px 12px rgba(139,92,246,.30); transition:all .18s ease;
// }
// .sasb-collapse-btn:hover { transform:translateY(-50%) scale(1.05); }

// .sasb-help-btn {
//   display:flex; align-items:center; gap:10px; padding:10px 12px;
//   border-radius:14px; color:#64748B; font-size:13px; font-weight:600;
//   transition:all .18s ease; border:1px solid rgba(139,92,246,.14);
//   cursor:pointer; background:rgba(139,92,246,.04); width:100%; text-align:left;
// }
// .sasb-help-btn:hover { background:rgba(139,92,246,.08); color:${T.coral}; transform:translateX(2px); }
// .sasb-help-btn .sasb-icon-wrap { background:rgba(139,92,246,.10); color:${T.coral}; }
// .sasb-help-btn.collapsed { justify-content:center; padding:11px 0; gap:0; }
// `;

// export default function SuperOperatorSidebar({ currentPage, navigateTo }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside className="sasb" style={{
//       position:"sticky", top:0, height:"100vh",
//       width: collapsed ? 72 : 260,
//       background:"#fff",
//       borderRight:`1.5px solid ${T.border}`,
//       display:"flex", flexDirection:"column",
//       transition:"width .25s cubic-bezier(.4,0,.2,1)",
//       flexShrink:0, zIndex:40,
//       boxShadow:"4px 0 22px rgba(13,31,45,.06)",
//       overflow:"hidden",
//     }}>
//       <style>{CSS}</style>

//       {/* LOGO */}
//       <div style={{
//         padding: collapsed ? "18px 0" : "18px 16px 14px",
//         borderBottom:`1px solid ${T.border}`,
//         display:"flex", alignItems:"center", gap:10,
//         justifyContent: collapsed ? "center" : "flex-start",
//         flexShrink:0,
//         background:"linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(250,251,253,1) 100%)",
//       }}>
//         <div className="fd" style={{
//           width:38, height:38, borderRadius:12,
//           background:"linear-gradient(135deg,#8B5CF6,#FBBF24)",
//           display:"flex", alignItems:"center", justifyContent:"center",
//           color:"#fff", fontSize:15, fontWeight:900, flexShrink:0,
//           boxShadow:"0 8px 18px rgba(139,92,246,.25)",
//         }}>S</div>
//         {!collapsed && (
//           <div style={{ lineHeight:1.15 }}>
//             <p style={{ fontSize:10, fontWeight:800, color:T.soft, textTransform:"uppercase", letterSpacing:".12em", margin:"0 0 2px" }}>Owner</p>
//             <p className="fd" style={{ fontSize:16, fontWeight:900, color:T.navy, lineHeight:1, margin:0 }}>
//               CrewSync<span style={{ background:"linear-gradient(135deg,#8B5CF6,#60A5FA)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>PeopleOps</span>
//             </p>
//           </div>
//         )}
//       </div>

//       {/* COLLAPSE TOGGLE */}
//       <div style={{ position:"relative", height:0, flexShrink:0 }}>
//         <button className="sasb-collapse-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand" : "Collapse"}>
//           {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
//         </button>
//       </div>

//       {/* NAV */}
//       <nav style={{ flex:1, overflowY:"auto", padding:"12px 8px 8px", display:"flex", flexDirection:"column", gap:2, scrollbarWidth:"none" }}>
//         <style>{`.sasb nav::-webkit-scrollbar{display:none}`}</style>
//         {NAV_SECTIONS.map(section => (
//           <div key={section.label} style={{ marginBottom:6 }}>
//             {!collapsed && <span className="sasb-section-label">{section.label}</span>}
//             {section.items.map(({ key, label, icon }) => {
//               const active = currentPage === key;
//               return (
//                 <button key={key} onClick={() => navigateTo(key)} title={collapsed ? label : undefined}
//                   className={`sasb-link${active ? " active" : ""}${collapsed ? " collapsed-link" : ""}`}>
//                   <span className="sasb-icon-wrap">
//                     <Ic d={ICONS[icon]} size={15} strokeWidth={active ? 2.2 : 1.8} />
//                   </span>
//                   {!collapsed && <span style={{ flex:1 }}>{label}</span>}
//                   {!collapsed && active && (
//                     <span style={{ width:6, height:6, borderRadius:"50%", background:T.coral, flexShrink:0, boxShadow:"0 0 0 4px rgba(139,92,246,.10)" }} />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         ))}
//       </nav>

//       {/* FOOTER */}
//       <div style={{ padding:"8px 8px 16px", borderTop:`1px solid ${T.border}`, background:"rgba(250,251,253,.8)", flexShrink:0 }}>
//         {!collapsed && (
//           <p style={{ fontSize:10, color:"#94A3B8", fontWeight:600, margin:"0 4px 8px" }}>v2.0.1 · CrewSync</p>
//         )}
//         <button onClick={() => navigateTo("sa_support")} title={collapsed ? "Care Desk" : undefined}
//           className={`sasb-help-btn${collapsed ? " collapsed" : ""}`}>
//           <span className="sasb-icon-wrap">
//             <Ic d={ICONS.help} size={15} />
//           </span>
//           {!collapsed && <span>CareDesk</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }


import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/apiClient";

/* Fetch company logo by tenantCode from API */
function useWorkspaceLogo(tenantCode) {
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem("companyLogoUrl") || "");
  useEffect(() => {
    if (!tenantCode) return;
    api.get(`/api/global-admin/companies/by-tenant/${tenantCode}`)
      .then(res => {
        const url = (res.data?.data ?? res.data)?.logoUrl || "";
        if (url) { setLogoUrl(url); localStorage.setItem("companyLogoUrl", url); }
      })
      .catch(() => {});
  }, [tenantCode]);
  return logoUrl;
}

/* Workspace logo — image or initials fallback */
function WorkspaceLogo({ logoUrl, companyName, size = 38 }) {
  const [err, setErr] = useState(false);
  const initials = (companyName || "C").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  useEffect(() => { setErr(false); }, [logoUrl]);
  if (logoUrl && !err) {
    return (
      <img src={logoUrl} alt={companyName} onError={() => setErr(true)}
        style={{ width: size, height: size, borderRadius: 10, objectFit: "contain",
          background: "#fff", border: "1.5px solid rgba(0,0,0,.08)",
          padding: 3, flexShrink: 0 }} />
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: 10,
      background: "linear-gradient(135deg,#8B5CF6,#FBBF24)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: Math.round(size * 0.38), fontWeight: 900,
      flexShrink: 0, boxShadow: "0 6px 16px rgba(139,92,246,.28)",
      fontFamily: "'Sora',sans-serif" }}>
      {initials}
    </div>
  );
}

const T = {
  coral:  "#8B5CF6",
  navy:   "#0B1020",
  border: "#E8ECF2",
  soft:   "#64748B",
};

const Ic = ({ d, size = 15, strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  grid:     "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
  users:    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  shield:   "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  file:     "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  onboard:  "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  policy:   "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  org:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  audit:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4",
  company:  "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
};

const NAV_SECTIONS = [
  {
    label: "Core",
    items: [
      { key: "sa_home",    label: "Control Room",        icon: "grid"     },
      { key: "sa_team",    label: "People Grid", icon: "users"    },
      { key: "sa_admins",  label: "Manage Operators",    icon: "shield"   },
      { key: "sa_onboard", label: "Add Person",     icon: "onboard"  },
      { key: "sa_org",     label: "People Map",        icon: "org"      },
    ],
  },
  {
    label: "Content",
    items: [
      { key: "sa_docs",    label: "People Vault",     icon: "file"     },
      { key: "sa_policy",  label: "Playbook Vault",     icon: "policy"   },
    ],
  },
  {
    label: "System",
    items: [
      { key: "sa_company", label: "Workspace Configuration", icon: "company"  },
      { key: "sa_audit",   label: "Activity Trail",       icon: "audit"    },
    ],
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.sasb * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.sasb .fd { font-family:'Sora',sans-serif; }

.sasb-link {
  display:flex; align-items:center; gap:10px; padding:10px 12px;
  border-radius:14px; color:#64748B; font-size:13px; font-weight:600;
  transition:all .18s ease; position:relative;
  border:1px solid transparent; cursor:pointer; background:transparent;
  width:100%; text-align:left;
}
.sasb-link:hover {
  background:linear-gradient(135deg,rgba(139,92,246,.08),rgba(6,182,212,.04));
  color:${T.coral}; border-color:rgba(139,92,246,.10); transform:translateX(2px);
}
.sasb-link.active {
  background:linear-gradient(135deg,rgba(139,92,246,.14),rgba(6,182,212,.05));
  color:${T.navy}; font-weight:800; border-color:rgba(139,92,246,.14);
  box-shadow:inset 3px 0 0 ${T.coral},0 8px 18px rgba(139,92,246,.08);
}
.sasb-link.active .sasb-icon-wrap {
  background:linear-gradient(135deg,${T.coral},#FBBF24);
  color:#fff; box-shadow:0 6px 14px rgba(139,92,246,.25);
}
.sasb-link.collapsed-link { justify-content:center; padding:11px 0; gap:0; }

.sasb-icon-wrap {
  width:30px; height:30px; border-radius:10px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  transition:all .18s ease; background:rgba(100,116,139,.10); color:inherit;
}
.sasb-link:hover .sasb-icon-wrap { background:rgba(139,92,246,.10); color:${T.coral}; }

.sasb-section-label {
  font-size:9px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
  color:#94A3B8; padding:8px 12px 6px; display:block;
}

.sasb-collapse-btn {
  position:absolute; top:50%; transform:translateY(-50%); right:-11px; z-index:10;
  width:24px; height:24px; border-radius:999px;
  background:linear-gradient(135deg,${T.coral},#FBBF24);
  color:#fff; border:2.5px solid #fff;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; box-shadow:0 4px 12px rgba(139,92,246,.30); transition:all .18s ease;
}
.sasb-collapse-btn:hover { transform:translateY(-50%) scale(1.05); }

.sasb-help-btn {
  display:flex; align-items:center; gap:10px; padding:10px 12px;
  border-radius:14px; color:#64748B; font-size:13px; font-weight:600;
  transition:all .18s ease; border:1px solid rgba(139,92,246,.14);
  cursor:pointer; background:rgba(139,92,246,.04); width:100%; text-align:left;
}
.sasb-help-btn:hover { background:rgba(139,92,246,.08); color:${T.coral}; transform:translateX(2px); }
.sasb-help-btn .sasb-icon-wrap { background:rgba(139,92,246,.10); color:${T.coral}; }
.sasb-help-btn.collapsed { justify-content:center; padding:11px 0; gap:0; }
`;

export default function SuperOperatorSidebar({ currentPage, navigateTo }) {
  const [collapsed, setCollapsed] = useState(false);

  const companyName = (localStorage.getItem("companyName") || "Workspace").trim();
  const tenantCode  = (localStorage.getItem("tenantCode")  || "").trim();
  const logoUrl     = useWorkspaceLogo(tenantCode);

  return (
    <aside className="sasb" style={{
      position: "sticky", top: 0, height: "100vh",
      width: collapsed ? 72 : 260,
      background: "#fff",
      borderRight: `1.5px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      transition: "width .25s cubic-bezier(.4,0,.2,1)",
      flexShrink: 0, zIndex: 40,
      boxShadow: "4px 0 22px rgba(13,31,45,.06)",
      overflow: "hidden",
    }}>
      <style>{CSS}</style>

      {/* LOGO */}
      <div style={{
        padding: collapsed ? "18px 0" : "18px 16px 14px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 10,
        justifyContent: collapsed ? "center" : "flex-start",
        flexShrink: 0,
        background: "linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(250,251,253,1) 100%)",
      }}>
        {collapsed ? (
          <img src="/crewsync-mark.svg" alt="CrewSync"
            style={{ width: 40, height: 40, borderRadius: 12, objectFit: "contain", flexShrink: 0 }} />
        ) : (
          <img src="/crewsync-logo.svg" alt="CrewSync"
            style={{ height: 44, maxWidth: 180, objectFit: "contain", objectPosition: "left", flexShrink: 0 }} />
        )}
      </div>

      {/* COLLAPSE TOGGLE */}
      <div style={{ position: "relative", height: 0, flexShrink: 0 }}>
        <button className="sasb-collapse-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand" : "Collapse"}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* NAV */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px 8px", display: "flex", flexDirection: "column", gap: 2, scrollbarWidth: "none" }}>
        <style>{`.sasb nav::-webkit-scrollbar{display:none}`}</style>
        {NAV_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom: 6 }}>
            {!collapsed && <span className="sasb-section-label">{section.label}</span>}
            {section.items.map(({ key, label, icon }) => {
              const active = currentPage === key;
              return (
                <button key={key} onClick={() => navigateTo(key)} title={collapsed ? label : undefined}
                  className={`sasb-link${active ? " active" : ""}${collapsed ? " collapsed-link" : ""}`}>
                  <span className="sasb-icon-wrap">
                    <Ic d={ICONS[icon]} size={15} strokeWidth={active ? 2.2 : 1.8} />
                  </span>
                  {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
                  {!collapsed && active && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.coral, flexShrink: 0, boxShadow: "0 0 0 4px rgba(139,92,246,.10)" }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div style={{ padding: "8px 8px 16px", borderTop: `1px solid ${T.border}`, background: "rgba(250,251,253,.8)", flexShrink: 0 }}>
        {!collapsed && (
          <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, margin: "0 4px 4px" }}>v2.0.1 · CrewSync</p>
        )}
        {!collapsed && (
          <p style={{ fontSize: 10, color: "#cbd5e1", fontWeight: 500, margin: "0 4px" }}>Super Ops Portal</p>
        )}
      </div>
    </aside>
  );
}