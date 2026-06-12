import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { isTokenValid } from "./authGuard";
import AppShell from "./AppShell.jsx";

/* ── PUBLIC PAGES ────────────────────────────────────────────────────────── */
import LoginPage          from "../LoginPage.jsx";
import ForgotPasswordPage from "../ForgotPasswordPage.jsx";
import HomePage           from "../features/Home/pages/HomePage.jsx";
import BookDemo     from "../features/Home/pages/BookDemo.jsx";
import SignupPage   from "../features/Home/pages/Signuppage.jsx";
import FeaturesPage from "../features/Home/pages/FeaturesPage.jsx";

import AttendanceFeaturePage      from "../features/Home/pages/Attendancefeaturepage.jsx";
import PayrollFeaturePage         from "../features/Home/pages/Payrollfeaturepage.jsx";
import LeaveManagementFeaturePage from "../features/Home/pages/Leavemanagementfeaturepage.jsx";
import EmployeeDirectoryPage      from "../features/Home/pages/Employeedirectorypage.jsx";
import AnalyticsPage              from "../features/Home/pages/Analyticspage.jsx";
import OnboardingPage             from "../features/Home/pages/Onboardingpage.jsx";
import MobileAppPage              from "../features/Home/pages/Mobileapppage.jsx";
import SecurityPage               from "../features/Home/pages/Securitypage.jsx";

import StartupsPage   from "../features/Home/pages/Startupspage.jsx";
import SMBPage        from "../features/Home/pages/Smbpage.jsx";
import EnterprisePage from "../features/Home/pages/Enterprisepage.jsx";

import TechPage       from "../features/Home/pages/Techpage.jsx";
import RetailPage     from "../features/Home/pages/Retailpage.jsx";
import HealthcarePage from "../features/Home/pages/Healthcarepage.jsx";

import DocsPage       from "../features/Home/pages/Docspage.jsx";
import BlogPage       from "../features/Home/pages/Blogpage.jsx";
import AcademyPage    from "../features/Home/pages/Academypage.jsx";
import HelpCenterPage from "../features/Home/pages/Helpcenterpage.jsx";
import ChangelogPage  from "../features/Home/pages/Changelogpage.jsx";

function RootEntry() {
  return isTokenValid() ? <AppShell /> : <HomePage />;
}

function LoginEntry() {
  const navigate = useNavigate();
  useEffect(() => {
    if (isTokenValid()) navigate("/", { replace: true });
  }, [navigate]);
  return <LoginPage />;
}

function AppRoutes() {
  return (
    <Routes>

      {/* ── ROOT ── */}
      <Route path="/" element={<RootEntry />} />

      {/* ── AUTH ── */}
      <Route path="/login"           element={<LoginEntry />} />
      <Route path="/signup"          element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ForgotPasswordPage />} />

      {/* ── MARKETING ── */}
      <Route path="/features"                        element={<FeaturesPage />} />
      <Route path="/demo"                            element={<BookDemo />} />  {/* ← changed from /solutions/bookdemo */}
      <Route path="/solutions/bookdemo"              element={<Navigate to="/demo" replace />} />  {/* ← old URL still works, redirects to /demo */}
      <Route path="/features/attendance"             element={<AttendanceFeaturePage />} />
      <Route path="/features/payroll"                element={<PayrollFeaturePage />} />
      <Route path="/features/leave-management"       element={<LeaveManagementFeaturePage />} />
      <Route path="/features/employee-dashboard"     element={<EmployeeDirectoryPage />} />
      <Route path="/features/analytics"              element={<AnalyticsPage />} />
      <Route path="/features/onboarding"             element={<OnboardingPage />} />
      <Route path="/features/mobile"                 element={<MobileAppPage />} />
      <Route path="/features/security"               element={<SecurityPage />} />
      <Route path="/solutions/startups"              element={<StartupsPage />} />
      <Route path="/solutions/smb"                   element={<SMBPage />} />
      <Route path="/solutions/enterprise"            element={<EnterprisePage />} />
      <Route path="/solutions/tech"                  element={<TechPage />} />
      <Route path="/solutions/retail"                element={<RetailPage />} />
      <Route path="/solutions/healthcare"            element={<HealthcarePage />} />
      <Route path="/docs"                            element={<DocsPage />} />
      <Route path="/blog"                            element={<BlogPage />} />
      <Route path="/academy"                         element={<AcademyPage />} />
      <Route path="/help-center"                     element={<HelpCenterPage />} />
      <Route path="/changelog"                       element={<ChangelogPage />} />

      {/* ── CATCH ALL old private URLs ── */}
      <Route path="/employee/*"     element={<Navigate to="/" replace />} />
      <Route path="/admin/*"        element={<Navigate to="/" replace />} />
      <Route path="/super-admin/*"  element={<Navigate to="/" replace />} />
      <Route path="/global-admin/*" element={<Navigate to="/" replace />} />
      <Route path="/p/*"            element={<Navigate to="/" replace />} />

      {/* ── FALLBACK ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
