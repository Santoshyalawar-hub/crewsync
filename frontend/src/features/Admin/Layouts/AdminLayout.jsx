// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar.jsx";   
// import TopNav from "../components/Navbar.jsx";     

// const AdminLayout = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // clear auth if you want
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");
//     navigate("/login");
//   };

//   return (
//     <div className="app-surface min-h-screen flex">
//       <Sidebar />

//       <div className="flex-1 flex flex-col min-w-0">
//         <TopNav onLogout={handleLogout} />

//         <main className="flex-1 px-4 md:px-8 pb-8 pt-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


//updtaed styling 7/3/2026
// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar.jsx";   // exports AdminSidebar
// import TopNav from "../components/Navbar.jsx";

// const AdminLayout = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("tenantCode");
//     localStorage.removeItem("companyId");
//     localStorage.removeItem("companyName");
//     navigate("/login");
//   };

//   return (
//     <div style={{
//       display: "flex",
//       minHeight: "100vh",
//       background: "#F7F8FA",
//       fontFamily: "'DM Sans', sans-serif",
//     }}>
//       <Sidebar />

//       <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
//         <TopNav onLogout={handleLogout} />

//         <main style={{
//           flex: 1,
//           padding: "28px 32px",
//           overflowY: "auto",
//           overflowX: "hidden",
//         }}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

//layout navigation isued solved now it will not redirect without authetication and no Domain Name in URL Path 9/3/2026

// ─────────────────────────────────────────────────────────────────────────────
//  src/features/Admin/Layouts/AdminLayout.jsx
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
//   home:    "Dashboard",
//   mgmt:    "Management",
//   company: "Company",
//   onboard: "Add Employee",
//   team:    "Manage Employees",
//   finance: "Finance Hub",
//   finview: "Finance Overview",
//   leave:   "Leave Management",
//   manual:  "Manual Entry",
//   payroll: "Payroll Management",
//   time:    "Attendance",
//   docs:    "Documents",
//   support: "Support",
//   alerts:  "Notifications",
//   perf:    "Performance",
//   gear:    "Assets",
//   org:     "Hierarchy",
// };

// const resolveTitle = (pathname) => {
//   const seg = pathname.split("/").filter(Boolean).pop() || "";
//   return PAGE_TITLES[seg.toLowerCase()] || "Admin Portal";
// };

// const AdminLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     clearSession();
//     navigate("/login", { replace: true });
//   };

//   const pageTitle = resolveTitle(location.pathname);

//   return (
//     <div style={{
//       display: "flex",
//       minHeight: "100vh",
//       background: "#F7F8FA",
//       fontFamily: "'DM Sans', sans-serif",
//     }}>
//       <Sidebar />

//       <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
//         <TopNav onLogout={handleLogout} pageTitle={pageTitle} />

//         <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", overflowX: "hidden" }}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

//with Domain Name in URL Path

// src/features/Admin/Layouts/AdminLayout.jsx
//
// Props received from AppShell:
//   currentPage  : string  — active page key e.g. "ad_home"
//   navigateTo   : fn      — call navigateTo("ad_payroll") to switch page
//   onLogout     : fn      — call to logout
//   pageTitle    : string  — human-readable title shown in navbar
//   children     : node    — the active page component

import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import TopNav  from "../components/Navbar.jsx";

const AdminLayout = ({ children, currentPage, navigateTo, onLogout, pageTitle }) => {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F7F8FA",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Sidebar — receives navigateTo instead of React Router links */}
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        onLogout={onLogout}
      />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        overflow: "hidden",
      }}>
        <TopNav
          onLogout={onLogout}
          pageTitle={pageTitle}
          currentPage={currentPage}
          navigateTo={navigateTo}
        />

        <main style={{
          flex: 1,
          padding: "28px 32px",
          overflowY: "auto",
          overflowX: "hidden",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;