// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar.jsx";   
// import TopNav from "../components/Navbar.jsx";     

// const OperatorLayout = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // clear auth if you want
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen flex bg-[#020617] text-white">
//       {/* Sidebar stays constant */}
//       <Sidebar />

//       {/* Right side: navbar + page content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top nav stays constant */}
//         <TopNav onLogout={handleLogout} />

//         {/* Page content changes here */}
        
//         <main className="flex-1 bg-[#F5F6FB] p-4 md:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SuperOperatorLayout;

// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar.jsx";
// import TopNav from "../components/Navbar.jsx";

// const SuperOperatorLayout = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");
//     navigate("/login");
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f1f5f9" }}>

//       {/* Sidebar — sticky, shrinks/expands on its own */}
//       <Sidebar />

//       {/* Right side — scrollable column */}
//       <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

//         {/* TopNav pinned at top */}
//         <div style={{ flexShrink: 0 }}>
//           <TopNav onLogout={handleLogout} />
//         </div>

//         {/* Scrollable page content */}
//         <main className="cs-main-stage" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// };

// export default SuperOperatorLayout;



//layout navigation isued solved now it will not redirect without authetication and no Domain Name in URL Path

// ─────────────────────────────────────────────────────────────────────────────
//  src/features/Super_Operator/Layout/SuperOperatorLayout.jsx
//
//  KEY CHANGES vs all previous versions:
//  1. Uses <Outlet> — no children / setActivePage props
//  2. Auth guard removed — handled by ProtectedRoute in App.jsx
//  3. pageTitle resolved from obfuscated route segment
//  4. clearSession from canonical authGuard
// ─────────────────────────────────────────────────────────────────────────────

// import React from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import Sidebar from "../components/Sidebar.jsx";
// import TopNav  from "../components/Navbar.jsx";
// import { clearSession } from "../../../app/authGuard";

// const PAGE_TITLES = {
//   home:    "ControlRoom",
//   onboard: "Add Person",
//   team:    "Persons",
//   admins:  "Manage Operators",
//   finance: "MoneyOps",
//   time:    "Presence",
//   docs:    "Vault",
//   support: "CareDesk",
// };

// const resolveTitle = (pathname) => {
//   const seg = pathname.split("/").filter(Boolean).pop() || "";
//   return PAGE_TITLES[seg.toLowerCase()] || "Ops Portal";
// };

// const SuperOperatorLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     clearSession();
//     navigate("/login", { replace: true });
//   };

//   const pageTitle = resolveTitle(location.pathname);

//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f1f5f9" }}>

//       <Sidebar />

//       <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
//         <div style={{ flexShrink: 0 }}>
//           <TopNav onLogout={handleLogout} pageTitle={pageTitle} />
//         </div>

//         <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SuperOperatorLayout;

// With Domain Name in URL Path 9/3/2026
// src/features/Super_Operator/Layout/SuperOperatorLayout.jsx
//
// Props received from AppShell:
//   currentPage  : string  — active page key e.g. "sa_home"
//   navigateTo   : fn      — call navigateTo("sa_team") to switch page
//   onLogout     : fn      — call to logout
//   pageTitle    : string  — human-readable title shown in navbar
//   children     : node    — the active page component

import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import TopNav  from "../components/Navbar.jsx";

const SuperOperatorLayout = ({ children, currentPage, navigateTo, onLogout, pageTitle }) => {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: "var(--bg-page)",
    }}>
      {/* Sidebar — receives navigateTo instead of React Router links */}
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        onLogout={onLogout}
      />

      <div style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}>
        <div style={{ flexShrink: 0 }}>
          <TopNav
            onLogout={onLogout}
            pageTitle={pageTitle}
            currentPage={currentPage}
            navigateTo={navigateTo}
          />
        </div>

        <main style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperOperatorLayout;