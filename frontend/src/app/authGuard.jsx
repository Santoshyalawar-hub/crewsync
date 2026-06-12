// old code with no Domain Name
// // ─────────────────────────────────────────────────────────────────────────────
// //  src/app/authGuard.jsx
// //  React-compatible — use this for Vite + React projects
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";

// // ── OBFUSCATED ROUTE BASES ──────────────────────────────────────────────────
// export const ROLE_ROUTES = {
//   GLOBAL_ADMIN:  "/p/ga",
//   GLOBALADMIN:   "/p/ga",
//   SUPER_ADMIN:   "/p/sa",
//   SUPERADMIN:    "/p/sa",
//   COMPANY_ADMIN: "/p/sa",
//   COMPANYADMIN:  "/p/sa",
//   ADMIN:         "/p/ad",
//   EMPLOYEE:      "/p/em",
// };

// // ── HOME PATHS ──────────────────────────────────────────────────────────────
// const ROLE_HOME = {
//   GLOBAL_ADMIN:  "/p/ga/home",
//   GLOBALADMIN:   "/p/ga/home",
//   SUPER_ADMIN:   "/p/sa/home",
//   SUPERADMIN:    "/p/sa/home",
//   COMPANY_ADMIN: "/p/sa/home",
//   COMPANYADMIN:  "/p/sa/home",
//   ADMIN:         "/p/ad/home",
//   EMPLOYEE:      "/p/em/home",
// };

// // ── ROLE → ALLOWED PATH PREFIXES ───────────────────────────────────────────
// const ROLE_ALLOWED = {
//   GLOBAL_ADMIN:  ["/p/ga"],
//   GLOBALADMIN:   ["/p/ga"],
//   SUPER_ADMIN:   ["/p/sa"],
//   SUPERADMIN:    ["/p/sa"],
//   COMPANY_ADMIN: ["/p/sa"],
//   COMPANYADMIN:  ["/p/sa"],
//   ADMIN:         ["/p/ad"],
//   EMPLOYEE:      ["/p/em"],
// };

// // ── PUBLIC PREFIXES ─────────────────────────────────────────────────────────
// const PUBLIC_PREFIXES = [
//   "/login", "/signup",
//   "/features", "/solutions",
//   "/docs", "/blog", "/academy", "/help-center", "/changelog",
// ];

// function isPublicPath(pathname) {
//   if (pathname === "/") return true;
//   return PUBLIC_PREFIXES.some(
//     (p) => pathname === p || pathname.startsWith(p + "/")
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// //  HELPERS
// // ══════════════════════════════════════════════════════════════════════════════

// /** Wipe every auth key from localStorage. */
// export function clearSession() {
//   [
//     "token", "role", "userRole", "userId",
//     "employeeName", "employeeId",
//     "tenantCode", "companyId", "companyName",
//   ].forEach((k) => localStorage.removeItem(k));
// }

// /** Normalised role string — always UPPERCASE, reads from "role" key. */
// export function getStoredRole() {
//   return (localStorage.getItem("role") || "").toUpperCase().trim();
// }

// /** Home dashboard path for the currently stored role. */
// export function getRoleHome() {
//   return ROLE_HOME[getStoredRole()] || "/login";
// }

// /**
//  * Returns true when:
//  *  1. A "Bearer <jwt>" token exists in localStorage, AND
//  *  2. The JWT's exp claim (if present) has not yet passed.
//  */
// export function isTokenValid() {
//   const raw = localStorage.getItem("token");
//   if (!raw || !raw.startsWith("Bearer ")) return false;

//   try {
//     const jwt     = raw.split(" ")[1];
//     const payload = JSON.parse(atob(jwt.split(".")[1]));
//     const nowSec  = Math.floor(Date.now() / 1000);

//     if (payload.exp && payload.exp < nowSec) {
//       clearSession();
//       return false;
//     }
//     return true;
//   } catch {
//     clearSession();
//     return false;
//   }
// }

// /** True if the stored role may access the given pathname. */
// function canAccessPath(pathname) {
//   const allowed = ROLE_ALLOWED[getStoredRole()] || [];
//   return allowed.some((prefix) => pathname.startsWith(prefix));
// }

// // ══════════════════════════════════════════════════════════════════════════════
// //  PROTECTED ROUTE COMPONENT
// // ══════════════════════════════════════════════════════════════════════════════

// /**
//  * Wrap any private route with this component in App.jsx:
//  *
//  *   <Route
//  *     path="/p/em"
//  *     element={
//  *       <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
//  *         <PersonLayout />
//  *       </ProtectedRoute>
//  *     }
//  *   >
//  *     <Route path="home" element={<PersonControlRoom />} />
//  *   </Route>
//  *
//  * allowedRoles is optional — omit it to allow any authenticated user.
//  */
// export function ProtectedRoute({ children, allowedRoles }) {
//   const location = useLocation();

//   // 1. No valid token → go to login, remember where they wanted to go
//   if (!isTokenValid()) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 2. Valid token but wrong role → send to their own dashboard
//   if (allowedRoles && allowedRoles.length > 0) {
//     if (!allowedRoles.includes(getStoredRole())) {
//       return <Navigate to={getRoleHome()} replace />;
//     }
//   }

//   // 3. All good
//   return <>{children}</>;
// }

// // ══════════════════════════════════════════════════════════════════════════════
// //  GLOBAL NAVIGATION INTERCEPTOR HOOK
// // ══════════════════════════════════════════════════════════════════════════════

// /**
//  * Call this ONCE inside the component that renders <Routes>.
//  * Must be inside <Router>.
//  *
//  * Silently guards every URL change including browser back / forward / direct typing.
//  *
//  * Usage:
//  *   function AppRoutes() {
//  *     useAuthInterceptor();
//  *     return <Routes>...</Routes>;
//  *   }
//  */
// export function useAuthInterceptor() {
//   const location = useLocation();

//   useEffect(() => {
//     if (isPublicPath(location.pathname)) return;

//     if (!isTokenValid()) {
//       window.location.replace("/login");
//       return;
//     }

//     if (!canAccessPath(location.pathname)) {
//       window.location.replace(getRoleHome());
//     }
//   }, [location.pathname]);
// }

//With Domain Name in URL Path

// ─────────────────────────────────────────────────────────────────────────────
//  src/app/authGuard.jsx
//
//  Pure auth helpers — no URL routing for private pages.
//  Private navigation is handled by AppShell state (page key in memory only).
//  URL stays at domain root forever once logged in.
// ─────────────────────────────────────────────────────────────────────────────

// ── CLEAR SESSION ────────────────────────────────────────────────────────────
export function clearSession() {
    [
      "token", "role", "userRole", "userId",
      "employeeName", "employeeId",
      "tenantCode", "companyId", "companyName",
    ].forEach((k) => localStorage.removeItem(k));
  }
  
  // ── GET ROLE ─────────────────────────────────────────────────────────────────
  export function getStoredRole() {
    return (localStorage.getItem("role") || "").toUpperCase().trim();
  }
  
  // ── VALIDATE TOKEN ───────────────────────────────────────────────────────────
  export function isTokenValid() {
    const raw = localStorage.getItem("token");
    if (!raw || !raw.startsWith("Bearer ")) return false;
  
    const safeDecode = (segment = "") => {
      const base = segment.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base.padEnd(base.length + ((4 - (base.length % 4)) % 4), "=");
      return atob(padded);
    };
  
    try {
      const jwt = raw.split(" ")[1];
      const parts = jwt.split(".");
      if (parts.length < 2) return true; // opaque token, let backend validate
  
      const payload = JSON.parse(safeDecode(parts[1]));
      const nowSec = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < nowSec) {
        clearSession();
        return false;
      }
      return true;
    } catch (err) {
      console.warn("Token decode failed; treating token as opaque.", err);
      // Assume server will reject invalid/expired tokens on API calls.
      return true;
    }
  }
  
  // ── DEFAULT PAGE KEY PER ROLE ─────────────────────────────────────────────────
  // These are internal state keys — NEVER appear in the URL
  export function getRoleDefaultPage() {
    const role = getStoredRole();
    const map = {
      GLOBAL_ADMIN:  "ga_home",
      GLOBALADMIN:   "ga_home",
      SUPER_ADMIN:   "sa_home",
      SUPERADMIN:    "sa_home",
      COMPANY_ADMIN: "sa_home",
      COMPANYADMIN:  "sa_home",
      ADMIN:         "ad_home",
      EMPLOYEE:      "em_home",
    };
    return map[role] || null;
  }
