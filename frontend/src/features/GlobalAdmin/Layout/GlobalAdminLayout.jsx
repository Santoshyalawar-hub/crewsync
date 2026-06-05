// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar.jsx";
// import Navbar from "../components/Navbar.jsx";

// export default function GlobalAdminLayout() {
//   return (
//     <div className="app-surface flex min-h-screen">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Navbar */}
//         <Navbar />

//         {/* Page Content */}
//         <main className="flex-1 overflow-auto px-4 md:px-8 pb-8 pt-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


//updated styling 7/3/2026 No Domain Name
// ─────────────────────────────────────────────────────────────────────────────
//  src/features/GlobalAdmin/Layout/GlobalAdminLayout.jsx
//
//  KEY CHANGES vs all previous versions:
//  1. Uses <Outlet> — consistent with all other layouts
//  2. Auth guard removed — handled by ProtectedRoute in App.jsx
//  3. pageTitle resolved from obfuscated route segment
//  4. clearSession from canonical authGuard
// ─────────────────────────────────────────────────────────────────────────────

// import React from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import Sidebar from "../components/Sidebar.jsx";
// import Navbar  from "../components/Navbar.jsx";
// import { clearSession } from "../../../app/authGuard";

// const PAGE_TITLES = {
//   home:     "Dashboard",
//   org:      "Companies",
//   billing:  "Subscriptions & Billing",
//   users:    "User & Role Management",
//   reports:  "Reports & Analytics",
//   paysetup: "Salary Slip Settings",
//   security: "Security & Compliance",
//   tickets:  "Support Tickets",
//   audit:    "System Logs",
//   config:   "System Settings",
// };

// const resolveTitle = (pathname) => {
//   const seg = pathname.split("/").filter(Boolean).pop() || "";
//   return PAGE_TITLES[seg.toLowerCase()] || "Global Admin";
// };

// export default function GlobalAdminLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     clearSession();
//     navigate("/login", { replace: true });
//   };

//   const pageTitle = resolveTitle(location.pathname);

//   return (
//     <div className="flex min-h-screen" style={{ background: "#f1f5f9" }}>
//       <Sidebar />
//       <div className="flex-1 flex flex-col overflow-hidden min-w-0">
//         <Navbar onLogout={handleLogout} pageTitle={pageTitle} />
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// with Domain Name in URL Path 9/3/2026 No Domain Name in URL

// src/features/GlobalAdmin/Layout/GlobalAdminLayout.jsx
//
// Props received from AppShell:
//   currentPage  : string  — active page key e.g. "ga_home"
//   navigateTo   : fn      — call navigateTo("ga_org") to switch page
//   onLogout     : fn      — call to logout
//   pageTitle    : string  — human-readable title shown in navbar
//   children     : node    — the active page component
// src/features/GlobalAdmin/Layout/GlobalAdminLayout.jsx
//
// FIXED: Sidebar + content always fill exactly 100vh, nothing bleeds out
// Props from AppShell: currentPage, navigateTo, onLogout, pageTitle, children

// src/features/GlobalAdmin/Layout/GlobalAdminLayout.jsx
//
// FIXED: Sidebar + content always fill exactly 100vh, nothing bleeds out
// Props from AppShell: currentPage, navigateTo, onLogout, pageTitle, children

import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar  from "../components/Navbar.jsx";

const GlobalAdminLayout = ({ children, currentPage, navigateTo, onLogout, pageTitle }) => {
  return (
    /*
      Root: full viewport, no scroll, flex row
      - Sidebar is position:sticky inside this, height:100vh, flexShrink:0
      - Right column scrolls independently
    */
    <div style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",           /* ← prevent ANY outer scroll */
      background: "#f1f5f9",
    }}>

      {/* ── SIDEBAR (sticky, never scrolls the page) ── */}
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        onLogout={onLogout}
      />

      {/* ── RIGHT COLUMN ── */}
      <div style={{
        flex: 1,
        minWidth: 0,                /* ← allows flex child to shrink below content size */
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}>
        {/* Navbar — fixed height, never scrolls */}
        <div style={{ flexShrink: 0 }}>
          <Navbar
            onLogout={onLogout}
            pageTitle={pageTitle}
            currentPage={currentPage}
            navigateTo={navigateTo}
          />
        </div>

        {/* Page content — ONLY this part scrolls */}
        <main data-main-scroll="true" style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "24px",
          scrollBehavior: "auto",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default GlobalAdminLayout;