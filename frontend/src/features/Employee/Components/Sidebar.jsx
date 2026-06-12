// import React, { useState } from "react";
// import {
//   Home, Clock4, Bell, HelpCircle, FileText, ScrollText,
//   IndianRupee, ChevronLeft, ChevronRight, BarChart3,
//   Laptop, LogOut, Receipt, CalendarDays,
// } from "lucide-react";

// const T = {
//   navy:     "#0B1020",
//   coral:    "#8B5CF6",
//   border:   "#E8ECF2",
//   textSoft: "#64748B",
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
// .esb * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
// .esb .fd { font-family:'Sora',sans-serif; }

// .esb-link {
//   display:flex; align-items:center; gap:10px; padding:10px 12px;
//   border-radius:14px; color:${T.textSoft}; font-size:13px; font-weight:600;
//   transition:all .18s ease; position:relative; border:1px solid transparent;
//   cursor:pointer; background:transparent; width:100%; text-align:left;
// }
// .esb-link:hover {
//   background:linear-gradient(135deg,rgba(139,92,246,.08),rgba(6,182,212,.04));
//   color:${T.coral}; border-color:rgba(139,92,246,.10); transform:translateX(2px);
// }
// .esb-link.active {
//   background:linear-gradient(135deg,rgba(139,92,246,.14),rgba(6,182,212,.05));
//   color:${T.navy}; font-weight:800; border-color:rgba(139,92,246,.14);
//   box-shadow:inset 3px 0 0 ${T.coral},0 8px 18px rgba(139,92,246,.08);
// }
// .esb-link.active .esb-icon-wrap {
//   background:linear-gradient(135deg,${T.coral},#FBBF24); color:#fff;
//   box-shadow:0 6px 14px rgba(139,92,246,.25);
// }
// .esb-link.collapsed-link { justify-content:center; padding:11px 0; gap:0; }

// .esb-icon-wrap {
//   width:30px; height:30px; border-radius:10px; flex-shrink:0;
//   display:flex; align-items:center; justify-content:center;
//   transition:all .18s ease; background:transparent; color:inherit;
// }
// .esb-link:hover .esb-icon-wrap { background:rgba(139,92,246,.10); color:${T.coral}; }

// .esb-section-label {
//   font-size:9px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
//   color:#94A3B8; padding:8px 12px 6px; display:block;
// }

// .esb-collapse-btn {
//   position:absolute; top:50%; transform:translateY(-50%); right:-11px; z-index:10;
//   width:24px; height:24px; border-radius:999px;
//   background:linear-gradient(135deg,${T.coral},#FBBF24);
//   color:#fff; border:2.5px solid #fff; display:flex; align-items:center;
//   justify-content:center; cursor:pointer;
//   box-shadow:0 4px 12px rgba(139,92,246,.30); transition:all .18s ease;
// }
// .esb-collapse-btn:hover { transform:translateY(-50%) scale(1.05); }

// .esb-exit-btn {
//   display:flex; align-items:center; gap:10px; padding:10px 12px;
//   border-radius:14px; color:#DC2626; font-size:13px; font-weight:700;
//   background:rgba(220,38,38,.05); border:1.5px solid rgba(220,38,38,.12);
//   transition:all .18s ease; cursor:pointer; width:100%; text-align:left;
// }
// .esb-exit-btn:hover { background:rgba(220,38,38,.08); border-color:rgba(220,38,38,.20); transform:translateX(2px); }
// .esb-exit-btn.collapsed-link { justify-content:center; padding:11px 0; gap:0; }
// `;

// const NAV_SECTIONS = [
//   {
//     label: "Main",
//     items: [
//       { key: "em_home",    label: "Control Room",      Icon: Home         },
//       { key: "em_time",    label: "Presence",     Icon: Clock4       },
//       { key: "em_leave",   label: "Time Away",          Icon: CalendarDays },
//       { key: "em_perf",    label: "Momentum",    Icon: BarChart3    },
//     ],
//   },
//   {
//     label: "Work & MoneyOps",
//     items: [
//       { key: "em_finance", label: "Money Desk",    Icon: IndianRupee  },
//       { key: "em_claims",  label: "ClaimsDesk", Icon: Receipt      },
//       { key: "em_docs",    label: "Vault",      Icon: FileText     },
//       { key: "em_gear",    label: "Equipment",         Icon: Laptop       },
//       { key: "em_policy",  label: "Playbooks",       Icon: ScrollText   },
//     ],
//   },
//   {
//     label: "Care Desk",
//     items: [
//       { key: "em_alerts",  label: "Signals",  Icon: Bell         },
//       { key: "em_support", label: "Care Desk", Icon: HelpCircle   },
//     ],
//   },
// ];

// export default function PersonSidebar({ currentPage, navigateTo }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside className="esb" style={{
//       position:"sticky", top:0, height:"100vh",
//       width: collapsed ? 72 : 248,
//       background:"#fff",
//       borderRight:`1.5px solid ${T.border}`,
//       display:"flex", flexDirection:"column",
//       transition:"width .25s cubic-bezier(.4,0,.2,1)",
//       flexShrink:0, zIndex:40,
//       boxShadow:"4px 0 22px rgba(13,31,45,.05)",
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
//             <p style={{ fontSize:10, fontWeight:800, color:T.coral, textTransform:"uppercase", letterSpacing:".12em", margin:"0 0 2px" }}>Person Portal</p>
//             <p className="fd" style={{ fontSize:16, fontWeight:900, color:T.navy, lineHeight:1, margin:0 }}>
//               CrewSync<span style={{ background:"linear-gradient(135deg,#8B5CF6,#60A5FA)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>PeopleOps</span>
//             </p>
//           </div>
//         )}
//       </div>

//       {/* COLLAPSE TOGGLE */}
//       <div style={{ position:"relative", height:0, flexShrink:0 }}>
//         <button className="esb-collapse-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand" : "Collapse"}>
//           {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
//         </button>
//       </div>

//       {/* NAV */}
//       <nav style={{ flex:1, overflowY:"auto", padding:"12px 8px 8px", display:"flex", flexDirection:"column", gap:4, scrollbarWidth:"none" }}>
//         <style>{`.esb nav::-webkit-scrollbar{display:none}`}</style>
//         {NAV_SECTIONS.map(section => (
//           <div key={section.label} style={{ marginBottom:8 }}>
//             {!collapsed && <span className="esb-section-label">{section.label}</span>}
//             {section.items.map(({ key, label, Icon }) => {
//               const active = currentPage === key;
//               return (
//                 <button key={key} onClick={() => navigateTo(key)} title={collapsed ? label : undefined}
//                   className={`esb-link${active ? " active" : ""}${collapsed ? " collapsed-link" : ""}`}>
//                   <span className="esb-icon-wrap"><Icon size={15} /></span>
//                   {!collapsed && <span>{label}</span>}
//                   {!collapsed && active && (
//                     <span style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:T.coral, flexShrink:0, boxShadow:"0 0 0 4px rgba(139,92,246,.10)" }} />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         ))}
//       </nav>

//       {/* EXIT PORTAL */}
//       <div style={{ padding:"8px 8px 16px", borderTop:`1px solid ${T.border}`, background:"rgba(250,251,253,.8)", flexShrink:0 }}>
//         <button onClick={() => navigateTo("em_offboard")} title={collapsed ? "Exit Portal" : undefined}
//           className={`esb-exit-btn${collapsed ? " collapsed-link" : ""}`}>
//           <span style={{ width:30, height:30, borderRadius:10, background:"rgba(220,38,38,.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//             <LogOut size={15} color="#DC2626" />
//           </span>
//           {!collapsed && <span>Exit Portal</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }


//18-3-2026

import React, { useState, useEffect } from "react";
import {
  Home, Clock4, Bell, HelpCircle, FileText, ScrollText,
  IndianRupee, ChevronLeft, ChevronRight, BarChart3,
  Laptop, LogOut, Receipt, CalendarDays, Network,
} from "lucide-react";

/* Workspace logo — reads from localStorage cache (populated by PersonNavbar) */
function WorkspaceLogoMark({ size = 38 }) {
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem("companyLogoUrl") || "");
  const [err, setErr] = useState(false);
  const companyName = (localStorage.getItem("companyName") || "Workspace").trim();
  const initials = companyName.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  /* Listen for Navbar updating the cache */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "companyLogoUrl" && e.newValue) { setLogoUrl(e.newValue); setErr(false); }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
  navy:     "#0B1020",
  coral:    "#8B5CF6",
  teal:     "#06B6D4",
  border:   "#E8ECF2",
  textSoft: "#64748B",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.esb * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.esb .fd { font-family:'Sora',sans-serif; }

.esb-link {
  display:flex; align-items:center; gap:10px; padding:10px 12px;
  border-radius:14px; color:${T.textSoft}; font-size:13px; font-weight:600;
  transition:all .18s ease; position:relative; border:1px solid transparent;
  cursor:pointer; background:transparent; width:100%; text-align:left;
}
.esb-link:hover {
  background:linear-gradient(135deg,rgba(139,92,246,.08),rgba(6,182,212,.04));
  color:${T.coral}; border-color:rgba(139,92,246,.10); transform:translateX(2px);
}
.esb-link.active {
  background:linear-gradient(135deg,rgba(139,92,246,.14),rgba(6,182,212,.05));
  color:${T.navy}; font-weight:800; border-color:rgba(139,92,246,.14);
  box-shadow:inset 3px 0 0 ${T.coral},0 8px 18px rgba(139,92,246,.08);
}
.esb-link.active .esb-icon-wrap {
  background:linear-gradient(135deg,${T.coral},#FBBF24); color:#fff;
  box-shadow:0 6px 14px rgba(139,92,246,.25);
}
.esb-link.collapsed-link { justify-content:center; padding:11px 0; gap:0; }

.esb-icon-wrap {
  width:30px; height:30px; border-radius:10px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  transition:all .18s ease; background:transparent; color:inherit;
}
.esb-link:hover .esb-icon-wrap { background:rgba(139,92,246,.10); color:${T.coral}; }

.esb-section-label {
  font-size:9px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
  color:#94A3B8; padding:8px 12px 6px; display:block;
}

.esb-collapse-btn {
  position:absolute; top:50%; transform:translateY(-50%); right:-11px; z-index:10;
  width:24px; height:24px; border-radius:999px;
  background:linear-gradient(135deg,${T.coral},#FBBF24);
  color:#fff; border:2.5px solid #fff; display:flex; align-items:center;
  justify-content:center; cursor:pointer;
  box-shadow:0 4px 12px rgba(139,92,246,.30); transition:all .18s ease;
}
.esb-collapse-btn:hover { transform:translateY(-50%) scale(1.05); }

.esb-exit-btn {
  display:flex; align-items:center; gap:10px; padding:10px 12px;
  border-radius:14px; color:#DC2626; font-size:13px; font-weight:700;
  background:rgba(220,38,38,.05); border:1.5px solid rgba(220,38,38,.12);
  transition:all .18s ease; cursor:pointer; width:100%; text-align:left;
}
.esb-exit-btn:hover { background:rgba(220,38,38,.08); border-color:rgba(220,38,38,.20); transform:translateX(2px); }
.esb-exit-btn.collapsed-link { justify-content:center; padding:11px 0; gap:0; }

/* CrewSync logo text gradient */
.esb-logo-text {
  background: linear-gradient(135deg,#8B5CF6,#60A5FA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { key: "em_home",    label: "Control Room",      Icon: Home         },
      { key: "em_time",    label: "Presence",     Icon: Clock4       },
      { key: "em_leave",   label: "Time Away",          Icon: CalendarDays },
      { key: "em_perf",    label: "Momentum",    Icon: BarChart3    },
    ],
  },
  {
    label: "Work & MoneyOps",
    items: [
      { key: "em_finance", label: "Money Desk",    Icon: IndianRupee  },
      { key: "em_claims",  label: "ClaimsDesk", Icon: Receipt      },
      { key: "em_docs",    label: "Vault",      Icon: FileText     },
      { key: "em_gear",    label: "Equipment",         Icon: Laptop       },
      { key: "em_policy",  label: "Playbooks",       Icon: ScrollText   },
    ],
  },
  {
    label: "Organisation",
    items: [
      { key: "em_org",     label: "People Map",      Icon: Network      },
    ],
  },
  {
    label: "Care Desk",
    items: [
      { key: "em_alerts",  label: "Signals",  Icon: Bell         },
      { key: "em_support", label: "Care Desk", Icon: HelpCircle   },
    ],
  },
];

export default function PersonSidebar({ currentPage, navigateTo }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="esb" style={{
      position: "sticky", top: 0, height: "100vh",
      width: collapsed ? 72 : 248,
      background: "#fff",
      borderRight: `1.5px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      transition: "width .25s cubic-bezier(.4,0,.2,1)",
      flexShrink: 0, zIndex: 40,
      boxShadow: "4px 0 22px rgba(13,31,45,.05)",
      overflow: "hidden",
    }}>
      <style>{CSS}</style>

      {/* ── COMPANY LOGO ── */}
      <div style={{
        padding: collapsed ? "18px 0" : "18px 16px 14px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 10,
        justifyContent: collapsed ? "center" : "flex-start",
        flexShrink: 0,
        background: "linear-gradient(180deg,#fff 0%,#fafbfd 100%)",
      }}>
        {collapsed ? (
          <img src="/crewsync-mark.svg" alt="CrewSync"
            style={{ width: 40, height: 40, borderRadius: 12, objectFit: "contain", flexShrink: 0 }} />
        ) : (
          <img src="/crewsync-logo.svg" alt="CrewSync"
            style={{ height: 44, maxWidth: 180, objectFit: "contain", objectPosition: "left", flexShrink: 0 }} />
        )}
      </div>

      {/* ── COLLAPSE TOGGLE ── */}
      <div style={{ position: "relative", height: 0, flexShrink: 0 }}>
        <button
          className="esb-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* ── NAV SECTIONS ── */}
      <nav style={{
        flex: 1, overflowY: "auto", padding: "12px 8px 8px",
        display: "flex", flexDirection: "column", gap: 4,
        scrollbarWidth: "none",
      }}>
        <style>{`.esb nav::-webkit-scrollbar{display:none}`}</style>

        {NAV_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            {!collapsed && (
              <span className="esb-section-label">{section.label}</span>
            )}
            {section.items.map(({ key, label, Icon }) => {
              const active = currentPage === key;
              return (
                <button
                  key={key}
                  onClick={() => navigateTo(key)}
                  title={collapsed ? label : undefined}
                  className={[
                    "esb-link",
                    active    ? "active"        : "",
                    collapsed ? "collapsed-link" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <span className="esb-icon-wrap"><Icon size={15} /></span>
                  {!collapsed && <span>{label}</span>}
                  {!collapsed && active && (
                    <span style={{
                      marginLeft: "auto", width: 6, height: 6,
                      borderRadius: "50%", background: T.coral, flexShrink: 0,
                      boxShadow: "0 0 0 4px rgba(139,92,246,.10)",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── EXIT PORTAL ── */}
      <div style={{
        padding: "8px 8px 16px",
        borderTop: `1px solid ${T.border}`,
        background: "rgba(250,251,253,.8)",
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigateTo("em_offboard")}
          title={collapsed ? "Exit Portal" : undefined}
          className={`esb-exit-btn${collapsed ? " collapsed-link" : ""}`}
        >
          <span style={{
            width: 30, height: 30, borderRadius: 10,
            background: "rgba(220,38,38,.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <LogOut size={15} color="#DC2626" />
          </span>
          {!collapsed && <span>Exit Portal</span>}
        </button>
      </div>
    </aside>
  );
}