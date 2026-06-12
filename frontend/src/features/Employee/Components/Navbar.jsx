// import React from "react";

// export default function PersonNavbar({ onLogout, pageTitle = "Person" }) {
//   return (
//     <nav
//       className="sticky top-0 z-50 px-6 md:px-8 py-3 flex items-center justify-between"
//       style={{
//         background: "rgba(255,255,255,0.88)",
//         backdropFilter: "blur(14px)",
//         borderBottom: "1.5px solid #E8ECF2",
//         boxShadow: "0 8px 24px rgba(13,31,45,.06)",
//       }}
//     >
//       <div className="flex items-center gap-3">
//         <div
//           className="w-11 h-11 rounded-xl flex items-center justify-center"
//           style={{
//             background: "#fff",
//             border: "1.5px solid #E8ECF2",
//             boxShadow: "0 4px 12px rgba(13,31,45,.06)",
//           }}
//         >
//           <img
//             src="/assets/crewsync-mark.svg"
//             alt="CrewSync"
//             className="h-8 w-8 object-contain"
//           />
//         </div>

//         <div className="leading-tight">
//           <p
//             style={{
//               fontSize: "11px",
//               fontWeight: 700,
//               color: "#8B5CF6",
//               textTransform: "uppercase",
//               letterSpacing: ".12em",
//               margin: 0,
//             }}
//           >
//             CrewSync
//           </p>
//           <h1
//             className="m-0"
//             style={{
//               fontSize: "18px",
//               fontWeight: 800,
//               color: "#0B1020",
//             }}
//           >
//             {pageTitle}
//           </h1>
//         </div>
//       </div>

//       <button
//         onClick={onLogout}
//         className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300"
//         style={{
//           background: "linear-gradient(135deg,#8B5CF6,#FBBF24)",
//           boxShadow: "0 8px 18px rgba(139,92,246,.25)",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.background =
//             "linear-gradient(135deg,#E85A24,#8B5CF6)";
//           e.currentTarget.style.boxShadow =
//             "0 10px 22px rgba(139,92,246,.35)";
//           e.currentTarget.style.transform = "translateY(-1px)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.background =
//             "linear-gradient(135deg,#8B5CF6,#FBBF24)";
//           e.currentTarget.style.boxShadow =
//             "0 8px 18px rgba(139,92,246,.25)";
//           e.currentTarget.style.transform = "translateY(0)";
//         }}
//       >
//         <svg
//           className="w-5 h-5"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//           />
//         </svg>
//         Logout
//       </button>
//     </nav>
//   );
// }


import React, { useState, useEffect } from "react";
import api from "@/lib/apiClient";

/*
  PersonNavbar
  ─────────────────────────────────────────────────────────────────
  • Left  : Workspace logo (fetched by tenantCode, same as OperatorTopNav)
            API: GET /api/global-admin/companies/by-tenant/{tenantCode}
            Response: { data: { logoUrl, name, tenantCode } }
  • Center: pageTitle
  • Right : Logout button
*/

const T = { navy: "#0B1020", coral: "#8B5CF6", border: "#E8ECF2" };

export default function PersonNavbar({ onLogout, pageTitle = "ControlRoom" }) {
  const [logoUrl,      setLogoUrl]      = useState(() => localStorage.getItem("companyLogoUrl") || "");
  const [logoErr,      setLogoErr]      = useState(false);
  const [companyName,  setWorkspaceName]  = useState(() => localStorage.getItem("companyName") || "");
  const [scrolled,     setScrolled]     = useState(false);

  const tenantCode = (localStorage.getItem("tenantCode") || "").trim();

  /* ── Scroll shadow ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Fetch company logo by tenantCode ────────────────────────────────────
     Same endpoint as OperatorSidebar / OperatorTopNav.
     Result cached in localStorage so sidebar + topnav stay in sync.
  ─────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!tenantCode) return;

    const fetchWorkspace = async () => {
      try {
        const res  = await api.get(
          `/api/global-admin/companies/by-tenant/${tenantCode}`
        );
        const json = res.data;
        const co   = json?.data ?? json;

        if (co?.logoUrl) {
          setLogoUrl(co.logoUrl);
          setLogoErr(false);
          localStorage.setItem("companyLogoUrl", co.logoUrl);
        }
        if (co?.name) {
          setWorkspaceName(co.name);
          localStorage.setItem("companyName", co.name);
        }
      } catch {
        /* silently use initials fallback */
      }
    };

    fetchWorkspace();

    /* Listen for logo updates from sidebar (same localStorage key) */
    const onStorage = (e) => {
      if (e.key === "companyLogoUrl" && e.newValue) {
        setLogoUrl(e.newValue);
        setLogoErr(false);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [tenantCode]);

  /* ── Workspace initials fallback ── */
  const initials = (companyName || tenantCode || "C")
    .trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const LogoBrand = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Workspace logo / initials */}
      <div style={{
        width: 40, height: 40, borderRadius: 11, overflow: "hidden",
        border: `1.5px solid ${T.border}`,
        background: "#fff",
        boxShadow: "0 2px 10px rgba(13,31,45,.07)",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {logoUrl && !logoErr
          ? <img src={logoUrl} alt={companyName || "Workspace"}
              onError={() => setLogoErr(true)}
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
          : <div style={{
              width: "100%", height: "100%", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg,#8B5CF6,#FBBF24)",
              color: "#fff", fontSize: 13, fontWeight: 900,
              fontFamily: "'Sora',sans-serif",
            }}>{initials}</div>
        }
      </div>

      {/* Name + portal label */}
      <div style={{ lineHeight: 1.2 }}>
        <p style={{
          fontSize: 10, fontWeight: 800, color: T.coral,
          textTransform: "uppercase", letterSpacing: ".12em", margin: "0 0 2px",
        }}>Person Portal</p>
        <p style={{
          fontSize: 15, fontWeight: 800, color: T.navy,
          fontFamily: "'Sora',sans-serif", margin: 0,
          maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {companyName || "CrewSync"}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .en-nav { font-family: 'DM Sans', sans-serif; }
        .en-logout:hover {
          background: linear-gradient(135deg,#E85A24,#8B5CF6) !important;
          box-shadow: 0 10px 22px rgba(139,92,246,.38) !important;
          transform: translateY(-1px);
        }
      `}</style>

      <nav className="en-nav" style={{
        position: "sticky", top: 0, zIndex: 50,
        height: 64,
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: `1.5px solid ${T.border}`,
        boxShadow: scrolled ? "0 8px 24px rgba(13,31,45,.08)" : "none",
        transition: "box-shadow .2s",
      }}>

        {/* LEFT — company brand */}
        <LogoBrand />

        {/* CENTER — page title */}
        <h1 style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          margin: 0, fontSize: 16, fontWeight: 800, color: T.navy,
          fontFamily: "'Sora',sans-serif",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          maxWidth: "calc(100% - 400px)",
          pointerEvents: "none",
        }}>
          {pageTitle}
        </h1>

        {/* RIGHT — logout */}
        <button
          className="en-logout"
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 18px", borderRadius: 11, border: "none",
            background: "linear-gradient(135deg,#8B5CF6,#FBBF24)",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 6px 16px rgba(139,92,246,.25)",
            transition: "all .18s", fontFamily: "'DM Sans',sans-serif",
            flexShrink: 0,
          }}
        >
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </nav>
    </>
  );
}