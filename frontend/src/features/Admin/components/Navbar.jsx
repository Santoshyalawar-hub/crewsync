
// // import React from "react";

// // const TopNav = ({ onLogout }) => {
// //   return (
// //     <nav className="sticky top-0 z-50 glass-nav h-18 px-6 md:px-8 py-3 flex items-center justify-between">
// //       <div className="flex items-center gap-3">
// //         <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
// //           <img
// //             src="/assets/Zlabs-Logo.png"
// //             alt="Admin"
// //             className="h-8 w-8 object-contain"
// //           />
// //         </div>
// //         <div className="leading-tight">
// //           <p className="subtle-label">SamayaHR</p>
// //           <h1 className="text-lg font-bold text-slate-900">Admin Console</h1>
// //         </div>
// //       </div>

// //       <div className="flex items-center gap-3">
// //         <button
// //           className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300"
// //           style={{ background: "linear-gradient(120deg,#0f172a,#ff6b35)" }}
// //           onClick={onLogout}
// //         >
// //           <svg
// //             className="w-5 h-5"
// //             xmlns="http://www.w3.org/2000/svg"
// //             fill="none"
// //             viewBox="0 0 24 24"
// //             stroke="currentColor"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               strokeWidth={2}
// //               d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
// //             />
// //           </svg>
// //           Logout
// //         </button>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default TopNav;


// //updtaed styling 7/3/2026
// import React, { useState, useEffect } from "react";

// const TopNav = ({ onLogout }) => {
//   const [time, setTime] = useState(new Date());
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const tick = setInterval(() => setTime(new Date()), 1000);
//     const onScroll = () => setScrolled(window.scrollY > 4);
//     window.addEventListener("scroll", onScroll);
//     return () => { clearInterval(tick); window.removeEventListener("scroll", onScroll); };
//   }, []);

//   const fmt = (d) =>
//     d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const fmtDate = (d) =>
//     d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

//   const companyName = (localStorage.getItem("companyName") || "").trim() || "Workspace";
//   const role = (localStorage.getItem("role") || "Admin").trim();

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
//         .tn-root { font-family: 'DM Sans', sans-serif; }
//         .tn-fd { font-family: 'Sora', sans-serif; }

//         .tn-nav {
//           height: 64px;
//           background: #fff;
//           border-bottom: 1px solid #f0f0f0;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0 28px;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//           transition: box-shadow 0.2s;
//         }
//         .tn-nav.scrolled {
//           box-shadow: 0 2px 20px rgba(13,31,45,.08);
//         }

//         /* Left cluster */
//         .tn-left { display: flex; align-items: center; gap: 14px; }
//         .tn-divider { width: 1px; height: 32px; background: #e5e7eb; }

//         .tn-breadcrumb {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 12px;
//           color: #9ca3af;
//           font-weight: 600;
//         }
//         .tn-breadcrumb span.active {
//           color: #0D1F2D;
//           font-weight: 700;
//         }
//         .tn-breadcrumb svg { color: #d1d5db; }

//         /* Center */
//         .tn-center {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           background: #F7F8FA;
//           border: 1px solid #e5e7eb;
//           border-radius: 12px;
//           padding: 6px 16px;
//         }
//         .tn-dot {
//           width: 7px; height: 7px;
//           border-radius: 50%;
//           background: #00C2A8;
//           animation: tn-pulse 2s ease-in-out infinite;
//         }
//         @keyframes tn-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
//         .tn-clock { font-size: 13px; font-weight: 700; color: #0D1F2D; letter-spacing: .02em; }
//         .tn-date { font-size: 11px; color: #9ca3af; font-weight: 500; }

//         /* Right cluster */
//         .tn-right { display: flex; align-items: center; gap: 10px; }

//         .tn-notif-btn {
//           position: relative;
//           width: 38px; height: 38px;
//           border-radius: 10px;
//           background: #F7F8FA;
//           border: 1px solid #e5e7eb;
//           display: flex; align-items: center; justify-content: center;
//           cursor: pointer;
//           transition: all .2s;
//           color: #6b7280;
//         }
//         .tn-notif-btn:hover { background: #fff3ee; border-color: #FF6B35; color: #FF6B35; }
//         .tn-badge {
//           position: absolute;
//           top: 6px; right: 6px;
//           width: 8px; height: 8px;
//           border-radius: 50%;
//           background: #FF6B35;
//           border: 2px solid #fff;
//         }

//         .tn-user {
//           display: flex; align-items: center; gap: 10px;
//           background: #F7F8FA;
//           border: 1px solid #e5e7eb;
//           border-radius: 12px;
//           padding: 5px 12px 5px 5px;
//           cursor: pointer;
//           transition: all .2s;
//         }
//         .tn-user:hover { border-color: #FF6B35; background: #fff3ee; }
//         .tn-avatar {
//           width: 30px; height: 30px;
//           border-radius: 8px;
//           background: linear-gradient(135deg,#FF6B35,#FF5722);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 12px; font-weight: 900; color: #fff;
//           font-family: 'Sora', sans-serif;
//         }
//         .tn-user-info { line-height: 1.2; }
//         .tn-user-name { font-size: 12px; font-weight: 700; color: #0D1F2D; }
//         .tn-user-role {
//           font-size: 10px; font-weight: 700;
//           color: #FF6B35;
//           background: rgba(255,107,53,.1);
//           padding: 0 6px;
//           border-radius: 999px;
//           display: inline-block;
//         }

//         .tn-logout {
//           display: flex; align-items: center; gap: 7px;
//           background: #0D1F2D;
//           color: #fff;
//           border: none;
//           border-radius: 10px;
//           padding: 8px 14px;
//           font-size: 12px;
//           font-weight: 700;
//           cursor: pointer;
//           transition: all .2s;
//           font-family: 'Sora', sans-serif;
//         }
//         .tn-logout:hover { background: #FF6B35; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(255,107,53,.3); }
//       `}</style>

//       <nav className={`tn-root tn-nav ${scrolled ? "scrolled" : ""}`}>
//         {/* Left */}
//         <div className="tn-left">
//           <div className="tn-breadcrumb">
//             <span>SamayaHR</span>
//             <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
//             </svg>
//             <span className="active">{companyName}</span>
//           </div>
//           <div className="tn-divider" />
//           <div className="tn-breadcrumb">
//             <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
//             </svg>
//             <span className="active">Control Center</span>
//           </div>
//         </div>

//         {/* Center clock */}
//         <div className="tn-center">
//           <div className="tn-dot" />
//           <div>
//             <div className="tn-clock">{fmt(time)}</div>
//             <div className="tn-date">{fmtDate(time)}</div>
//           </div>
//         </div>

//         {/* Right */}
//         <div className="tn-right">
//           <button className="tn-notif-btn">
//             <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
//             </svg>
//             <div className="tn-badge" />
//           </button>

//           <div className="tn-user">
//             <div className="tn-avatar">A</div>
//             <div className="tn-user-info">
//               <div className="tn-user-name">Admin</div>
//               <div className="tn-user-role">{role}</div>
//             </div>
//           </div>

//           <button className="tn-logout" onClick={onLogout}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
//             </svg>
//             Sign Out
//           </button>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default TopNav;


//18-3-2026

import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "@/lib/apiClient";

/* ─────────────────────────────────────────────────────────────
   Company Logo Component
   Shows Cloudinary image if available, else coloured initials
───────────────────────────────────────────────────────────── */
function CompanyLogo({ logoUrl, companyName, size = 36, radius = 9 }) {
  const [err, setErr] = useState(false);

  const initials = (companyName || "C")
    .split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  useEffect(() => { setErr(false); }, [logoUrl]);

  if (logoUrl && !err) {
    return (
      <img
        src={logoUrl}
        alt={companyName}
        onError={() => setErr(true)}
        style={{
          width: size, height: size, borderRadius: radius,
          objectFit: "contain", background: "#fff",
          border: "1.5px solid #e5e7eb",
          padding: 3, flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: "linear-gradient(135deg,#FF6B35,#FF5722)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 900, color: "#fff",
      fontFamily: "'Sora',sans-serif", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TopNav
   Fetches company logo by tenantCode on mount.
   GET /api/global-admin/companies/by-tenant/{tenantCode}
   → Company.logoUrl (Cloudinary CDN URL)
───────────────────────────────────────────────────────────── */
const TopNav = ({ onLogout }) => {
  const [time,    setTime]    = useState(new Date());
  const [scrolled,setScrolled]= useState(false);
  const [logoUrl, setLogoUrl] = useState(
    () => localStorage.getItem("companyLogoUrl") || ""
  );

  const companyName = (localStorage.getItem("companyName") || "Workspace").trim();
  const tenantCode  = (localStorage.getItem("tenantCode")  || "").trim();
  const role        = (localStorage.getItem("role")        || "Admin").trim();

  /* ── Clock + scroll listener ── */
  useEffect(() => {
    const tick     = setInterval(() => setTime(new Date()), 1000);
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll);
    return () => { clearInterval(tick); window.removeEventListener("scroll", onScroll); };
  }, []);

  /* ── Fetch company logo by tenantCode ──────────────────────────
     Uses the same endpoint as the Sidebar so only ONE fetch
     is needed across the app (result is cached in localStorage).
  ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!tenantCode) return;

    /* If sidebar already cached it, use instantly */
    const cached = localStorage.getItem("companyLogoUrl");
    if (cached) { setLogoUrl(cached); return; }

    const fetchLogo = async () => {
      try {
        const res  = await api.get(
          `/api/global-admin/companies/by-tenant/${tenantCode}`
        );
        const json = res.data;
        const url  = (json?.data ?? json)?.logoUrl || "";
        if (url) {
          setLogoUrl(url);
          localStorage.setItem("companyLogoUrl", url);
        }
      } catch { /* silently fall back to initials */ }
    };

    fetchLogo();
  }, [tenantCode]);

  /* ── Listen for logo updates from sidebar/other components ── */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "companyLogoUrl" && e.newValue) {
        setLogoUrl(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const fmt     = (d) => d.toLocaleTimeString("en-IN",  { hour: "2-digit", minute: "2-digit", hour12: true });
  const fmtDate = (d) => d.toLocaleDateString("en-IN",  { weekday: "short", day: "numeric", month: "short" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        .tn-root { font-family: 'DM Sans', sans-serif; }
        .tn-fd   { font-family: 'Sora', sans-serif; }

        .tn-nav {
          height: 64px;
          background: #fff;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: box-shadow 0.2s;
        }
        .tn-nav.scrolled { box-shadow: 0 2px 20px rgba(13,31,45,.08); }

        /* ── Left ── */
        .tn-left  { display: flex; align-items: center; gap: 14px; }
        .tn-divider { width: 1px; height: 32px; background: #e5e7eb; }

        /* ── Logo + company name pill ── */
        .tn-brand {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 14px 5px 6px;
          background: #f7f8fa;
          border: 1.5px solid #e5e7eb;
          border-radius: 13px;
        }
        .tn-brand-info { line-height: 1.25; }
        .tn-brand-name {
          font-size: 13px; font-weight: 700; color: #0D1F2D;
          white-space: nowrap; max-width: 160px;
          overflow: hidden; text-overflow: ellipsis;
          font-family: 'Sora', sans-serif;
        }
        .tn-tenant-pill {
          display: inline-block;
          font-size: 9.5px; font-weight: 800; color: #00C2A8;
          font-family: monospace; letter-spacing: .04em;
        }

        /* Breadcrumb */
        .tn-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #9ca3af; font-weight: 600;
        }
        .tn-breadcrumb span.active { color: #0D1F2D; font-weight: 700; }
        .tn-breadcrumb svg { color: #d1d5db; }

        /* ── Center clock ── */
        .tn-center {
          display: flex; align-items: center; gap: 8px;
          background: #f7f8fa; border: 1px solid #e5e7eb;
          border-radius: 12px; padding: 6px 16px;
        }
        .tn-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #00C2A8;
          animation: tn-pulse 2s ease-in-out infinite;
        }
        @keyframes tn-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
        .tn-clock { font-size: 13px; font-weight: 700; color: #0D1F2D; letter-spacing: .02em; font-family:'Sora',sans-serif; }
        .tn-date  { font-size: 11px; color: #9ca3af; font-weight: 500; }

        /* ── Right ── */
        .tn-right { display: flex; align-items: center; gap: 10px; }

        .tn-notif-btn {
          position: relative;
          width: 38px; height: 38px; border-radius: 10px;
          background: #f7f8fa; border: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s; color: #6b7280;
        }
        .tn-notif-btn:hover { background: #fff3ee; border-color: #FF6B35; color: #FF6B35; }
        .tn-badge {
          position: absolute; top: 6px; right: 6px;
          width: 8px; height: 8px; border-radius: 50%;
          background: #FF6B35; border: 2px solid #fff;
        }

        .tn-user {
          display: flex; align-items: center; gap: 10px;
          background: #f7f8fa; border: 1px solid #e5e7eb;
          border-radius: 12px; padding: 5px 12px 5px 5px;
          cursor: pointer; transition: all .2s;
        }
        .tn-user:hover { border-color: #FF6B35; background: #fff3ee; }
        .tn-user-avatar {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg,#FF6B35,#FF5722);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 900; color: #fff;
          font-family: 'Sora', sans-serif; flex-shrink: 0;
        }
        .tn-user-name { font-size: 12px; font-weight: 700; color: #0D1F2D; }
        .tn-user-role {
          font-size: 10px; font-weight: 700; color: #FF6B35;
          background: rgba(255,107,53,.1); padding: 0 6px; border-radius: 999px;
          display: inline-block;
        }

        .tn-logout {
          display: flex; align-items: center; gap: 7px;
          background: #0D1F2D; color: #fff; border: none;
          border-radius: 10px; padding: 8px 14px;
          font-size: 12px; font-weight: 700; cursor: pointer;
          transition: all .2s; font-family: 'Sora', sans-serif;
        }
        .tn-logout:hover {
          background: #FF6B35; transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(255,107,53,.3);
        }
      `}</style>

      <nav className={`tn-root tn-nav${scrolled ? " scrolled" : ""}`}>

        {/* ── Left: Company Logo + name ── */}
        <div className="tn-left">

          {/* Logo pill — company logo from Cloudinary */}
          <div className="tn-brand">
            <CompanyLogo
              logoUrl={logoUrl}
              companyName={companyName}
              size={36}
              radius={9}
            />
            <div className="tn-brand-info">
              <div className="tn-brand-name">{companyName}</div>
              {tenantCode && (
                <div className="tn-tenant-pill">{tenantCode}</div>
              )}
            </div>
          </div>

          <div className="tn-divider" />

          {/* Breadcrumb */}
          <div className="tn-breadcrumb">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span className="active">Control Center</span>
          </div>
        </div>

        {/* ── Center: Live Clock ── */}
        <div className="tn-center">
          <div className="tn-dot" />
          <div>
            <div className="tn-clock">{fmt(time)}</div>
            <div className="tn-date">{fmtDate(time)}</div>
          </div>
        </div>

        {/* ── Right: Notif + User + Logout ── */}
        <div className="tn-right">

          {/* Notification bell */}
          <button className="tn-notif-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <div className="tn-badge" />
          </button>

          {/* User pill */}
          <div className="tn-user">
            <div className="tn-user-avatar">A</div>
            <div>
              <div className="tn-user-name">Admin</div>
              <div className="tn-user-role">{role}</div>
            </div>
          </div>

          {/* Sign out */}
          <button className="tn-logout" onClick={onLogout}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>
        </div>
      </nav>
    </>
  );
};

export default TopNav;