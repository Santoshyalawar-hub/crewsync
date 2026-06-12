// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Bell,
//   RefreshCw,
//   LogOut,
//   Configuration,
//   ChevronDown,
// } from "lucide-react";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [userRole, setUserRole] = useState("");

//   useEffect(() => {
//     const role = localStorage.getItem("role")?.toUpperCase() || "GLOBAL ADMIN";
//     setUserRole(role);
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <header className="glass-nav px-6 py-4 sticky top-0 z-40">
//       <div className="flex items-center justify-between gap-4">
//         <div>
//           <p className="subtle-label">CrewSync</p>
//           <p className="text-lg font-semibold text-slate-900">Global Operator</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button className="relative p-2 rounded-lg hover:bg-slate-50 transition">
//             <Bell className="h-5 w-5 text-slate-600" />
//             <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-semibold">
//               3
//             </span>
//           </button>

//           <button className="p-2 rounded-lg hover:bg-slate-50 transition">
//             <RefreshCw className="h-5 w-5 text-slate-600" />
//           </button>

//           <span className="px-3 py-1.5 rounded-full bg-[#8B5CF6]lue-50 text-xs border border-[#8B5CF6]lue-200 text-[#8B5CF6] font-semibold">
//             {userRole}
//           </span>

//           <div className="relative">
//             <button
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
//             >
//               <div className="w-9 h-9 rounded-full bg-white border shadow-sm flex items-center justify-center">
//                 <img
//                   src="/assets/crewsync-mark.svg"
//                   alt="Profile Logo"
//                   className="w-7 h-7 object-contain"
//                 />
//               </div>

//               <ChevronDown className="h-4 w-4 text-slate-600" />
//             </button>

//             {showProfileMenu && (
//               <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
//                 <div className="px-4 py-2 border-[#8B5CF6] border-slate-100">
//                   <p className="text-sm font-semibold text-slate-900">
//                     Global Operator
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     admin@zlabs.com
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => navigate("/global-admin/settings")}
//                   className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
//                 >
//                   <Configuration className="h-4 w-4" />
//                   Configuration
//                 </button>

//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                 >
//                   <LogOut className="h-4 w-4" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </header>
//   );
// }


//updated styling 7/3/2026
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, RefreshCw, LogOut, Settings, ChevronDown, User } from "lucide-react";

function CrewSyncNavLogo() {
  const [err, setErr] = React.useState(false);
  if (err) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "linear-gradient(135deg,#8B5CF6,#FBBF24)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 14, fontWeight: 900, flexShrink: 0,
      }}>S</div>
    );
  }
  return (
    <img src="/crewsync-mark.svg" alt="CrewSync"
      onError={() => setErr(true)}
      style={{ width: 38, height: 38, borderRadius: 10, objectFit: "contain", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}
    />
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSignals, setShowSignals] = useState(false);
  const [adminName, setOperatorName] = useState("Operator");
  const [adminEmail, setOperatorEmail] = useState("");
  const [notifCount, setNotifCount] = useState(0);
  const profileRef = useRef(null);

  useEffect(() => {
    setOperatorName(localStorage.getItem("name") || localStorage.getItem("adminName") || "Global Operator");
    setOperatorEmail(localStorage.getItem("email") || localStorage.getItem("adminEmail") || "");
    setNotifCount(Number(localStorage.getItem("notifCount")) || 0);

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
        setShowSignals(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between gap-4"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left: Page context */}
      <div className="flex items-center gap-3">
        <CrewSyncNavLogo />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8B5CF6" }}>
            CrewSync
          </p>
          <p className="text-base font-bold text-slate-800 leading-tight">Global Operator</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2" ref={profileRef}>

        {/* Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Signals */}
        <div className="relative">
          <button
            onClick={() => { setShowSignals(!showSignals); setShowProfileMenu(false); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#8B5CF6" }} />
            )}
          </button>

          {showSignals && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl overflow-hidden"
              style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <p className="text-sm font-semibold text-slate-800">Signals</p>
              </div>
              <div className="px-4 py-8 text-center">
                <Bell className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-400">No new notifications</p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1 bg-slate-200" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowSignals(false); }}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-all"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }}
            >
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{adminName}</p>
              {adminEmail && <p className="text-[11px] text-slate-400 leading-tight">{adminEmail}</p>}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden"
              style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <p className="text-sm font-semibold text-slate-800">{adminName}</p>
                {adminEmail && <p className="text-xs text-slate-400 mt-0.5">{adminEmail}</p>}
              </div>
              <div className="py-1">
                <button
                  onClick={() => { navigate("/global-admin/settings"); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Configuration className="w-4 h-4" />
                  Configuration
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{ color: "#ef4444" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}