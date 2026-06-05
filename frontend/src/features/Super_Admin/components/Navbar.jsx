// import React from "react";

// const TopNav = ({ onLogout }) => {
//   return (
//     <nav className="sticky top-0 z-50 glass-nav h-18 px-6 md:px-8 py-3 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-lg font-bold text-[#000080]">
//           SA
//         </div>
//         <div className="leading-tight">
//           <p className="subtle-label">SamayaHR</p>
//           <h1 className="text-lg font-bold text-slate-900">Super Admin</h1>
//         </div>
//       </div>

//       <div>
//         <button
//           className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300"
//           style={{ background: "linear-gradient(120deg,#0f172a,#ff6b35)" }}
//           onClick={onLogout}
//         >
//           <svg
//             className="w-5 h-5"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//             />
//           </svg>
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default TopNav;

//updated new style 7/3/2026
import React, { useState, useEffect } from "react";

const Ic = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const BELL   = "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9";
const LOGOUT = "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1";
const SEARCH = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z";
const CLOCK  = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";

/* Company logo pill — reads cached logo from localStorage */
function CompanyBrandPill({ role }) {
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem("companyLogoUrl") || "");
  const [logoErr, setLogoErr] = useState(false);
  const companyName = (localStorage.getItem("companyName") || "Company").trim();
  const initials = companyName.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "companyLogoUrl" && e.newValue) { setLogoUrl(e.newValue); setLogoErr(false); }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 14px 6px 8px", borderRadius:12, background:"linear-gradient(135deg, #0f172a, #1e293b)", boxShadow:"0 2px 10px rgba(15,23,42,0.25)" }}>
      {logoUrl && !logoErr ? (
        <img src={logoUrl} alt={companyName} onError={() => setLogoErr(true)}
          style={{ width:30, height:30, borderRadius:8, objectFit:"contain", background:"#fff", padding:3, flexShrink:0 }} />
      ) : (
        <div style={{ width:30, height:30, borderRadius:8, flexShrink:0, background:"linear-gradient(135deg, #ff6b35, #f97316)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff" }}>
          {initials || "C"}
        </div>
      )}
      <div style={{ lineHeight:1.15, overflow:"hidden" }}>
        <div className="brand" style={{ fontSize:13, fontWeight:800, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:130 }}>{companyName}</div>
        <div className="role-badge" style={{ marginTop:1 }}>{role}</div>
      </div>
    </div>
  );
}

export default function TopNav({ onLogout }) {
  const [time, setTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr   = time.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

  const role = (() => {
    try { return (localStorage.getItem("role") || "SUPER_ADMIN").toUpperCase(); } catch { return "SUPER_ADMIN"; }
  })();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Figtree:wght@400;500;600;700&display=swap');
        .samaya-topnav { font-family: 'Figtree', sans-serif; }
        .samaya-topnav .brand { font-family: 'Outfit', sans-serif; }
        .samaya-topnav .search-input {
          outline: none; background: transparent; border: none;
          font-size: 13px; color: #0f172a; width: 100%;
          font-family: 'Figtree', sans-serif;
        }
        .samaya-topnav .search-input::placeholder { color: #94a3b8; }
        .samaya-topnav .icon-btn {
          width: 38px; height: 38px; border-radius: 10px; border: 1px solid #e2e8f0;
          background: #fff; display: flex; align-items: center; justify-content: center;
          color: #64748b; cursor: pointer; transition: all 0.18s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .samaya-topnav .icon-btn:hover {
          background: #f8fafc; border-color: #cbd5e1; color: #0f172a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .samaya-topnav .logout-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 18px; border-radius: 10px; border: none; cursor: pointer;
          font-size: 13px; font-weight: 700; color: #fff;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #ff6b35 150%);
          box-shadow: 0 4px 14px rgba(255,107,53,0.3);
          transition: all 0.2s; font-family: 'Figtree', sans-serif;
          letter-spacing: 0.02em;
        }
        .samaya-topnav .logout-btn:hover {
          box-shadow: 0 6px 20px rgba(255,107,53,0.45);
          transform: translateY(-1px);
        }
        .samaya-topnav .role-badge {
          font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 2px 8px; border-radius: 99px;
          background: linear-gradient(135deg, rgba(255,107,53,0.12), rgba(251,191,36,0.1));
          color: #ff6b35; border: 1px solid rgba(255,107,53,0.25);
        }
        /* subtle top border accent */
        .samaya-topnav::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #ff6b35, #fbbf24, #ff6b35);
        }
        @keyframes nav-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .samaya-topnav { animation: nav-in 0.35s ease forwards; }
      `}</style>

      <nav className="samaya-topnav"
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226,232,240,0.8)",
          boxShadow: "0 1px 20px rgba(15,23,42,0.06)",
          padding: "0 28px",
          height: 64,
          display: "flex", alignItems: "center",
          gap: 16,
        }}>

        {/* ── Left: Brand pill (company logo + name) ── */}
        <CompanyBrandPill role={role} />

        {/* ── Live clock ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7, padding: "5px 12px",
          borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0",
        }}>
          <Ic d={CLOCK} size={13} />
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
            <span style={{ color: "#0f172a", fontWeight: 700, fontFamily: "'Outfit', monospace" }}>{formatted}</span>
            <span style={{ margin: "0 4px", color: "#cbd5e1" }}>·</span>
            {dateStr}
          </div>
        </div>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Search ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 14px",
          borderRadius: 10,
          background: searchOpen ? "#fff" : "#f8fafc",
          border: `1px solid ${searchOpen ? "#ff6b35" : "#e2e8f0"}`,
          boxShadow: searchOpen ? "0 0 0 3px rgba(255,107,53,0.1)" : "none",
          transition: "all 0.2s",
          width: searchOpen ? 240 : 140,
          cursor: "pointer",
        }} onClick={() => { if (!searchOpen) setSearchOpen(true); }}>
          <Ic d={SEARCH} size={14} />
          {searchOpen ? (
            <input
              className="search-input"
              autoFocus
              placeholder="Search anything…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onBlur={() => { setSearchOpen(false); setSearchVal(""); }}
            />
          ) : (
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Quick search…</span>
          )}
        </div>

        {/* ── Notification bell ── */}
        <div style={{ position: "relative" }}>
          <button className="icon-btn">
            <Ic d={BELL} size={17} />
          </button>
          {/* unread dot */}
          <span style={{
            position: "absolute", top: 7, right: 7,
            width: 7, height: 7, borderRadius: "50%",
            background: "#ff6b35", border: "2px solid #fff",
          }} />
        </div>

        {/* ── User avatar ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "4px 12px 4px 4px",
          borderRadius: 11, background: "#f8fafc",
          border: "1px solid #e2e8f0",
          cursor: "default",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: "linear-gradient(135deg, #0f172a, #334155)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: "#fff",
          }}>SA</div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Super Admin</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Administrator</div>
          </div>
        </div>

        {/* ── Logout ── */}
        <button className="logout-btn" onClick={onLogout}>
          <Ic d={LOGOUT} size={15} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
}