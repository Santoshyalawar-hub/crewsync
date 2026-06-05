// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "@/lib/apiClient";

// // ── Tokens ────────────────────────────────────────────────────────────────────
// const CORAL = "#FF6B35";
// const NAVY  = "#0D1F2D";

// // ── Minimal SVG icon ──────────────────────────────────────────────────────────
// const Ic = ({ d, size = 20, sw = 1.8, color = "currentColor" }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//     stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
//     {[].concat(d).map((p, i) => <path key={i} d={p} />)}
//   </svg>
// );

// const ICONS = {
//   plus:      "M12 4v16m8-8H4",
//   refresh:   ["M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"],
//   clipboard: ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"],
//   barChart:  ["M18 20V10", "M12 20V4", "M6 20v-6"],
//   rupee:     ["M6 3h12", "M6 8h12", "M6 13h8", "M6 13c0 3.87 3.13 7 7 7"],
//   fileText:  ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
//   receipt:   ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"],
//   banknote:  ["M2 9h20", "M2 15h20", "M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z", "M12 12a2 2 0 100 4 2 2 0 000-4z"],
//   shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
//   scroll:    ["M8 21h12a2 2 0 002-2v-2H10v2a2 2 0 11-4 0V5a2 2 0 00-2-2H4a2 2 0 00-2 2v3", "M9 3h11a2 2 0 012 2v1", "M8 8h8", "M8 12h6"],
//   settings:  ["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"],
//   trending:  ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
//   arrowLeft: "M19 12H5M12 19l-7-7 7-7",
// };

// // ─────────────────────────────────────────────────────────────────────────────
// //  ROUTE MAP — keys match card IDs, values match navRoutes.jsx ADM_NAV paths
// //  To add a new page: add the route in navRoutes.jsx, then add it here.
// // ─────────────────────────────────────────────────────────────────────────────
// const ROUTE_MAP = {
//   "overview":            "/p/ad/finview",   // key: finview  in ADM_NAV
//   "payroll-management":  "/p/ad/payroll",   // key: payroll  in ADM_NAV
//   "manual-entry":        "/p/ad/manual",    // key: manual   in ADM_NAV
//   "payslip-management":  "/p/ad/payroll",   // no separate route yet → payroll
//   "tax-management":      "/p/ad/payroll",   // update when tax page exists
//   "reimbursements":      "/p/ad/payroll",   // update when reimbursements page exists
//   "compliance":          "/p/ad/payroll",   // update when compliance page exists
//   "audit-logs":          "/p/ad/payroll",   // update when audit page exists
//   "settings":            "/p/ad/company",   // key: company  in ADM_NAV
//   "auto-generate":       "/p/ad/payroll",   // key: payroll  in ADM_NAV
// };

// // Page keys for state-based navigation (AppShell)
// const PAGE_MAP = {
//   "overview":            "ad_finview",
//   "payroll-management":  "ad_payroll",
//   "manual-entry":        "ad_manual",
//   "payslip-management":  "ad_payroll",
//   "tax-management":      "ad_payroll",
//   "reimbursements":      "ad_payroll",
//   "compliance":          "ad_payroll",
//   "audit-logs":          "ad_payroll",
//   "settings":            "ad_company",
//   "auto-generate":       "ad_payroll",
// };

// // ── Quick actions ─────────────────────────────────────────────────────────────
// const quickActions = [
//   { id: "manual-entry",       title: "Manual Payroll",  description: "Select employee → Input details → Save",   icon: "plus"      },
//   { id: "auto-generate",      title: "Auto Generate",   description: "Auto-calculates payroll using attendance",  icon: "refresh"   },
//   { id: "tax-management",     title: "Tax Review",      description: "View pending declarations",                 icon: "clipboard" },
//   { id: "reimbursements",     title: "Reimbursements",  description: "View pending claims",                       icon: "rupee"     },
// ];

// // ── Feature cards ─────────────────────────────────────────────────────────────
// const featureCards = [
//   { id: "overview",           title: "Overview",           description: "Stats, graphs, employee count, payroll trends", icon: "barChart"  },
//   { id: "payroll-management", title: "Payroll Management", description: "Manual + Auto payroll generation",              icon: "rupee"     },
//   { id: "payslip-management", title: "Payslip Management", description: "Generate & download payslips",                  icon: "fileText"  },
//   { id: "tax-management",     title: "Tax Management",     description: "Review & approve declarations",                 icon: "receipt"   },
//   { id: "reimbursements",     title: "Reimbursements",     description: "Approve / reject reimbursement claims",         icon: "banknote"  },
//   { id: "compliance",         title: "Compliance",         description: "PF, TDS, PT monthly reports",                  icon: "shield"    },
//   { id: "audit-logs",         title: "Audit & Logs",       description: "Track payroll actions",                        icon: "scroll"    },
//   { id: "settings",           title: "Settings",           description: "Templates & pay cycle settings",               icon: "settings"  },
//   { id: "manual-entry",       title: "Manual Entry",       description: "Individual salary entry system",               icon: "trending"  },
// ];

// // ── Feature card component ────────────────────────────────────────────────────
// function FeatureCard({ card, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         position: "relative", display: "flex", flexDirection: "column",
//         justifyContent: "space-between", borderRadius: 20,
//         background: hov ? NAVY : "#fff",
//         border: `1.5px solid ${hov ? NAVY : "#f0f0f0"}`,
//         padding: "22px 22px 18px", cursor: "pointer", transition: "all .22s",
//         transform: hov ? "translateY(-4px)" : "none",
//         boxShadow: hov ? "0 20px 48px rgba(13,31,45,.20)" : "0 1px 6px rgba(13,31,45,.05)",
//         textAlign: "left", fontFamily: "'DM Sans', sans-serif",
//       }}>
//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
//         <div>
//           <h3 style={{ fontSize: 14, fontWeight: 800, color: hov ? "#fff" : NAVY, margin: "0 0 6px", fontFamily: "'Sora', sans-serif" }}>
//             {card.title}
//           </h3>
//           <p style={{ fontSize: 12, color: hov ? "rgba(255,255,255,.45)" : "#9ca3af", margin: 0, maxWidth: 220 }}>
//             {card.description}
//           </p>
//         </div>
//         <div style={{ width: 44, height: 44, borderRadius: 12, background: hov ? "rgba(255,107,53,.2)" : "rgba(255,107,53,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .22s", transform: hov ? "scale(1.08)" : "none" }}>
//           <Ic d={ICONS[card.icon]} size={22} sw={1.8} color={CORAL} />
//         </div>
//       </div>
//       <div style={{ display: "flex", justifyContent: "flex-end" }}>
//         <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 999, background: hov ? "rgba(255,107,53,.15)" : "rgba(255,107,53,.08)", color: CORAL, border: "1px solid rgba(255,107,53,.2)", letterSpacing: ".04em" }}>
//           Manage
//         </span>
//       </div>
//     </button>
//   );
// }

// // ── Quick tile component ──────────────────────────────────────────────────────
// function QuickTile({ action, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{ display: "flex", alignItems: "center", gap: 14, borderRadius: 16, background: "#fff", border: `1.5px solid ${hov ? CORAL : "#f0f0f0"}`, padding: "14px 18px", cursor: "pointer", transition: "all .18s", textAlign: "left", boxShadow: hov ? "0 8px 22px rgba(255,107,53,.15)" : "0 1px 4px rgba(13,31,45,.04)", transform: hov ? "translateY(-2px)" : "none", fontFamily: "'DM Sans', sans-serif" }}>
//       <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,107,53,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//         <Ic d={ICONS[action.icon]} size={18} sw={2} color={CORAL} />
//       </div>
//       <div>
//         <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 2px", fontFamily: "'Sora', sans-serif" }}>{action.title}</h3>
//         <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{action.description}</p>
//       </div>
//     </button>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// //  MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════════════════
// const FinanceHub = ({ onBack, navigateTo }) => {
//   const navigate = useNavigate();

//   const handleNavigate = (id) => {
//     const pageKey = PAGE_MAP[id];
//     if (navigateTo && pageKey) {
//       navigateTo(pageKey);
//       return;
//     }

//     const path = ROUTE_MAP[id];
//     if (path) {
//       navigate(path);
//     } else {
//       console.warn(`FinanceHub: no route mapped for id="${id}". Add it to ROUTE_MAP.`);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
//         .fh-root { font-family: 'DM Sans', sans-serif; }
//         .fh-fd   { font-family: 'Sora', sans-serif; }
//       `}</style>

//       <div className="fh-root" style={{ minHeight: "100vh", padding: "16px 20px" }}>

//         {/* ── Header ── */}
//         <div style={{ background: `linear-gradient(135deg,${NAVY},#162639)`, borderRadius: 20, padding: "22px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: -30, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,107,53,.12)", filter: "blur(40px)", pointerEvents: "none" }} />
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, position: "relative" }}>
//             <div>
//               <h1 className="fh-fd" style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>Finance Hub</h1>
//               <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", margin: 0 }}>
//                 Central place to manage payroll, taxes, and compliance.
//               </p>
//             </div>
//             {onBack && (
//               <button
//                 onClick={onBack}
//                 style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 999, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s" }}
//                 onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,53,.25)"}
//                 onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>
//                 <Ic d={ICONS.arrowLeft} size={16} sw={2.5} color="#fff" />
//                 Back
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── Quick Actions ── */}
//         <section style={{ marginBottom: 32 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//             <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#9ca3af" }}>Quick Actions</span>
//             <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14 }}>
//             {quickActions.map(action => (
//               <QuickTile
//                 key={action.id}
//                 action={action}
//                 onClick={() => handleNavigate(action.id)}
//               />
//             ))}
//           </div>
//         </section>

//         {/* ── Finance Modules ── */}
//         <section>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//             <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#9ca3af" }}>Finance Modules</span>
//             <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
//             {featureCards.map(card => (
//               <FeatureCard
//                 key={card.id}
//                 card={card}
//                 onClick={() => handleNavigate(card.id)}
//               />
//             ))}
//           </div>
//         </section>

//       </div>
//     </>
//   );
// };

// export default FinanceHub;


//18-3-2026

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Tokens ────────────────────────────────────────────────────────────────────
const CORAL = "#FF6B35";
const NAVY  = "#0D1F2D";

// ── Minimal SVG icon ──────────────────────────────────────────────────────────
const Ic = ({ d, size = 20, sw = 1.8, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  plus:      "M12 4v16m8-8H4",
  refresh:   ["M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"],
  clipboard: ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"],
  barChart:  ["M18 20V10", "M12 20V4", "M6 20v-6"],
  rupee:     ["M6 3h12", "M6 8h12", "M6 13h8", "M6 13c0 3.87 3.13 7 7 7"],
  fileText:  ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  receipt:   ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"],
  banknote:  ["M2 9h20", "M2 15h20", "M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z", "M12 12a2 2 0 100 4 2 2 0 000-4z"],
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  scroll:    ["M8 21h12a2 2 0 002-2v-2H10v2a2 2 0 11-4 0V5a2 2 0 00-2-2H4a2 2 0 00-2 2v3", "M9 3h11a2 2 0 012 2v1", "M8 8h8", "M8 12h6"],
  settings:  ["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"],
  trending:  ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
};

// ─────────────────────────────────────────────────────────────────────────────
//  ROUTE MAP  (used when navigateTo prop is NOT available — fallback only)
// ─────────────────────────────────────────────────────────────────────────────
const ROUTE_MAP = {
  "overview":            "/p/ad/finview",
  "payroll-management":  "/p/ad/payroll",
  "manual-entry":        "/p/ad/manual",
  "auto-generate":       "/p/ad/autopayroll",
  "payslip-management":  "/p/ad/payslip",
  "tax-management":      "/p/ad/tax",
  "reimbursements":      "/p/ad/reimbursements",
  "compliance":          "/p/ad/compliance",
  "audit-logs":          "/p/ad/audit",
  "settings":            "/p/ad/company",
};

// ─────────────────────────────────────────────────────────────────────────────
//  PAGE MAP  (AppShell state-based navigation — primary navigation method)
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_MAP = {
  "overview":            "ad_finview",
  "payroll-management":  "ad_payroll",
  "manual-entry":        "ad_manual",
  "auto-generate":       "ad_autopayroll",
  "payslip-management":  "ad_payslip",
  "tax-management":      "ad_tax",
  "reimbursements":      "ad_reimbursements",
  "compliance":          "ad_compliance",
  "audit-logs":          "ad_audit",
  "settings":            "ad_company",
};

// ── Quick actions ─────────────────────────────────────────────────────────────
const quickActions = [
  { id: "manual-entry",   title: "Manual Payroll",  description: "Select employee → data auto-loads → Save",    icon: "plus"     },
  { id: "auto-generate",  title: "Auto Generate",   description: "Attendance-driven payroll for 1 / dept / all", icon: "refresh"  },
  { id: "tax-management", title: "Tax Declarations", description: "Review & approve employee tax declarations",   icon: "clipboard"},
  { id: "reimbursements", title: "Reimbursements",   description: "Approve / reject employee claims",             icon: "rupee"    },
];

// ── Feature cards ─────────────────────────────────────────────────────────────
const featureCards = [
  { id: "overview",           title: "Overview",           description: "Stats, graphs, employee count, payroll trends", icon: "barChart"  },
  { id: "payroll-management", title: "Payroll Management", description: "Manual + Auto payroll generation",              icon: "rupee"     },
  { id: "auto-generate",      title: "Auto Payroll",       description: "Attendance-driven auto salary calculation",     icon: "refresh"   }, // ✅ UPDATED description
  { id: "payslip-management", title: "Payslip Management", description: "Generate & download payslips",                  icon: "fileText"  },
  { id: "tax-management",     title: "Tax Management",     description: "Review & approve declarations",                 icon: "receipt"   },
  { id: "reimbursements",     title: "Reimbursements",     description: "Approve / reject reimbursement claims",         icon: "banknote"  },
  { id: "compliance",         title: "Compliance",         description: "PF, TDS, PT monthly reports",                  icon: "shield"    },
  { id: "audit-logs",         title: "Audit & Logs",       description: "Track payroll actions",                        icon: "scroll"    },
  { id: "settings",           title: "Settings",           description: "Templates & pay cycle settings",               icon: "settings"  },
  { id: "manual-entry",       title: "Manual Entry",       description: "Individual salary entry — data auto-fills",    icon: "trending"  }, // ✅ UPDATED description
];

// ── Feature card component ────────────────────────────────────────────────────
function FeatureCard({ card, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", display: "flex", flexDirection: "column",
        justifyContent: "space-between", borderRadius: 20,
        background: hov ? NAVY : "#fff",
        border: `1.5px solid ${hov ? NAVY : "#f0f0f0"}`,
        padding: "22px 22px 18px", cursor: "pointer", transition: "all .22s",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 20px 48px rgba(13,31,45,.20)" : "0 1px 6px rgba(13,31,45,.05)",
        textAlign: "left", fontFamily: "'DM Sans', sans-serif",
      }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:16 }}>
        <div>
          <h3 style={{ fontSize:14, fontWeight:800, color: hov ? "#fff" : NAVY, margin:"0 0 6px", fontFamily:"'Sora', sans-serif" }}>
            {card.title}
          </h3>
          <p style={{ fontSize:12, color: hov ? "rgba(255,255,255,.45)" : "#9ca3af", margin:0, maxWidth:220 }}>
            {card.description}
          </p>
        </div>
        <div style={{ width:44, height:44, borderRadius:12, background: hov ? "rgba(255,107,53,.2)" : "rgba(255,107,53,.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .22s", transform: hov ? "scale(1.08)" : "none" }}>
          <Ic d={ICONS[card.icon]} size={22} sw={1.8} color={CORAL} />
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <span style={{ fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:999, background: hov ? "rgba(255,107,53,.15)" : "rgba(255,107,53,.08)", color:CORAL, border:"1px solid rgba(255,107,53,.2)", letterSpacing:".04em" }}>
          Manage
        </span>
      </div>
    </button>
  );
}

// ── Quick tile component ──────────────────────────────────────────────────────
function QuickTile({ action, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:14, borderRadius:16, background:"#fff", border:`1.5px solid ${hov ? CORAL : "#f0f0f0"}`, padding:"14px 18px", cursor:"pointer", transition:"all .18s", textAlign:"left", boxShadow: hov ? "0 8px 22px rgba(255,107,53,.15)" : "0 1px 4px rgba(13,31,45,.04)", transform: hov ? "translateY(-2px)" : "none", fontFamily:"'DM Sans', sans-serif" }}>
      <div style={{ width:40, height:40, borderRadius:11, background:"rgba(255,107,53,.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Ic d={ICONS[action.icon]} size={18} sw={2} color={CORAL} />
      </div>
      <div>
        <h3 style={{ fontSize:13, fontWeight:700, color:NAVY, margin:"0 0 2px", fontFamily:"'Sora', sans-serif" }}>{action.title}</h3>
        <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>{action.description}</p>
      </div>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const FinanceHub = ({ onBack, navigateTo }) => {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    // Primary: AppShell state-based navigation (no URL change)
    const pageKey = PAGE_MAP[id];
    if (navigateTo && pageKey) {
      navigateTo(pageKey);
      return;
    }
    // Fallback: React Router (if rendered outside AppShell)
    const path = ROUTE_MAP[id];
    if (path) {
      navigate(path);
    } else {
      console.warn(`FinanceHub: no route mapped for id="${id}".`);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .fh-root { font-family: 'DM Sans', sans-serif; }
        .fh-fd   { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="fh-root" style={{ minHeight:"100vh", padding:"16px 20px" }}>

        {/* ── Header ── */}
        <div style={{ background:`linear-gradient(135deg,${NAVY},#162639)`, borderRadius:20, padding:"22px 28px", marginBottom:24, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:80, width:160, height:160, borderRadius:"50%", background:"rgba(255,107,53,.12)", filter:"blur(40px)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14, position:"relative" }}>
            <div>
              <h1 className="fh-fd" style={{ fontSize:22, fontWeight:900, color:"#fff", margin:"0 0 4px" }}>Finance Hub</h1>
              <p style={{ fontSize:12, color:"rgba(255,255,255,.4)", margin:0 }}>
                Central place to manage payroll, taxes, and compliance.
              </p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:999, background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.18)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,53,.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>
                <Ic d={ICONS.arrowLeft} size={16} sw={2.5} color="#fff"/>
                Back
              </button>
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <section style={{ marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"#9ca3af" }}>Quick Actions</span>
            <div style={{ flex:1, height:1, background:"#f0f0f0" }}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:14 }}>
            {quickActions.map(action => (
              <QuickTile key={action.id} action={action} onClick={() => handleNavigate(action.id)}/>
            ))}
          </div>
        </section>

        {/* ── Finance Modules ── */}
        <section>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"#9ca3af" }}>Finance Modules</span>
            <div style={{ flex:1, height:1, background:"#f0f0f0" }}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
            {featureCards.map(card => (
              <FeatureCard key={card.id} card={card} onClick={() => handleNavigate(card.id)}/>
            ))}
          </div>
        </section>

      </div>
    </>
  );
};

export default FinanceHub;