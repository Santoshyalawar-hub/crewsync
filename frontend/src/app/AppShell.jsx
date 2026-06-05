// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { isTokenValid, clearSession, getStoredRole, getRoleDefaultPage } from "./authGuard";

// /* ── LAYOUTS ─────────────────────────────────────────────────────────────── */
// import EmployeeLayout    from "../features/Employee/Layouts/EmployeeLayout.jsx";
// import AdminLayout       from "../features/Admin/Layouts/AdminLayout.jsx";
// import SuperAdminLayout  from "../features/Super_Admin/Layout/SuperAdminLayout.jsx";
// import GlobalAdminLayout from "../features/GlobalAdmin/Layout/GlobalAdminLayout.jsx";

// /* ── EMPLOYEE PAGES ──────────────────────────────────────────────────────── */
// import EmployeeDashboard            from "../features/Employee/pages/EmployeeDashboard.jsx";
// import EmpAttendance                from "../features/Employee/pages/Attendance.jsx";
// import FinancehubEmp                from "../features/Employee/pages/Financehub.jsx";
// import Payslip                      from "../features/Employee/pages/Payslip.jsx";
// import Policy                       from "../features/Employee/pages/Policy.jsx";
// import Reimbursements               from "../features/Employee/pages/Reimbursements.jsx";
// import SupportEmp                   from "../features/Employee/pages/Support.jsx";
// import TaxDeclaration               from "../features/Employee/pages/TaxDeclaration.jsx";
// import Notifications                from "../features/Employee/pages/Notifications.jsx";
// import EmpDocuments                 from "../features/Employee/pages/Documents.jsx";
// import EmployeeLeaveManagement      from "../features/Employee/pages/EmployeeLeaveManagement.jsx";
// import EmployeeAssets               from "../features/Employee/pages/EmployeeAssets.jsx";
// import EmployeePerformanceDashboard from "../features/Employee/pages/EmployeePerformanceDashboard.jsx";
// import EmployeeExit                 from "../features/Employee/pages/EmployeeExit.jsx";
// import EmployeeExitStatus           from "../features/Employee/pages/EmployeeExitStatus.jsx";
// import ChangePassword from "../features/Employee/pages/ChangePassword.jsx";

// /* ── ADMIN PAGES ─────────────────────────────────────────────────────────── */
// import AdminDashboard       from "../features/Admin/pages/AdminDashboard.jsx";
// import AdminManagement      from "../features/Admin/pages/AdminManagement.jsx";
// import CompanyManagement    from "../features/Admin/pages/CompanyManagement.jsx";
// import AddEmployee          from "../features/Admin/pages/AddEmployee.jsx";
// import ManageEmployees      from "../features/Admin/pages/ManageEmployees.jsx";
// import Financehub           from "../features/Admin/pages/Financehub.jsx";
// import FinanceOverview      from "../features/Admin/pages/FinanceOverview.jsx";
// import LeaveManagement      from "../features/Admin/pages/LeaveManagement.jsx";
// import ManualEntry          from "../features/Admin/pages/ManualEntry.jsx";
// import AutoPayroll          from "../features/Admin/pages/Autopayroll.jsx";   // ✅ NEW
// import PayrollManagement    from "../features/Admin/pages/PayrollManagement.jsx";
// import Attendance           from "../features/Admin/pages/Attendance.jsx";
// import Support              from "../features/Admin/pages/Support.jsx";
// import AdminDocuments       from "../features/Admin/pages/Documents.jsx";
// import AdminNotifications   from "../features/Admin/pages/Noifications.jsx";
// import PerformanceDashboard from "../features/Admin/pages/PerformanceDashboard.jsx";
// import Assets               from "../features/Admin/pages/Assets.jsx";
// import HierarchyTree        from "../features/Admin/pages/HierarchyTree.jsx";

// /* ── SUPER ADMIN PAGES ───────────────────────────────────────────────────── */
// import SuperAdminDashboard from "../features/Super_Admin/pages/SuperAdminDashboard.jsx";
// import EmployeeManagement  from "../features/Super_Admin/pages/EmployeeManagement.jsx";
// import ManageAdmins        from "../features/Super_Admin/pages/Manageadmins.jsx";

// /* ── GLOBAL ADMIN PAGES ──────────────────────────────────────────────────── */
// import GlobalAdminDashboard   from "../features/GlobalAdmin/pages/GlobalAdminDashboard.jsx";
// import GlobalCompanies        from "../features/GlobalAdmin/pages/GlobalCompanies.jsx";
// import SubscriptionsBilling   from "../features/GlobalAdmin/pages/SubscriptionsBilling.jsx";
// import UserRoleManagement     from "../features/GlobalAdmin/pages/UserRoleManagement.jsx";
// import ReportsAnalytics       from "../features/GlobalAdmin/pages/ReportsAnalytics.jsx";
// import SecurityCompliance     from "../features/GlobalAdmin/pages/SecurityCompliance.jsx";
// import SupportTickets         from "../features/GlobalAdmin/pages/SupportTickets.jsx";
// import SystemLogs             from "../features/GlobalAdmin/pages/SystemLogs.jsx";
// import SystemSettings         from "../features/GlobalAdmin/pages/SystemSettings.jsx";
// import SalarySlipSettingsPage from "../features/GlobalAdmin/pages/Salaryslipsettingspage.jsx";

// // ─────────────────────────────────────────────────────────────────────────────
// //  PAGE REGISTRY
// // ─────────────────────────────────────────────────────────────────────────────
// const PAGE_REGISTRY = {
//   // ── EMPLOYEE ──────────────────────────────────────────────────────────────
//   em_home:     { component: EmployeeDashboard,            title: "My Dashboard",     role: "EMPLOYEE" },
//   em_time:     { component: EmpAttendance,                title: "My Attendance",    role: "EMPLOYEE" },
//   em_leave:    { component: EmployeeLeaveManagement,      title: "Leave Management", role: "EMPLOYEE" },
//   em_finance:  { component: FinancehubEmp,                title: "Finance Hub",      role: "EMPLOYEE" },
//   em_pay:      { component: Payslip,                      title: "My Payslips",      role: "EMPLOYEE" },
//   em_claims:   { component: Reimbursements,               title: "Reimbursements",   role: "EMPLOYEE" },
//   em_tax:      { component: TaxDeclaration,               title: "Tax Declaration",  role: "EMPLOYEE" },
//   em_perf:     { component: EmployeePerformanceDashboard, title: "Performance",      role: "EMPLOYEE" },
//   em_gear:     { component: EmployeeAssets,               title: "Assets",           role: "EMPLOYEE" },
//   em_docs:     { component: EmpDocuments,                 title: "My Documents",     role: "EMPLOYEE" },
//   em_policy:   { component: Policy,                       title: "Policy Vault",     role: "EMPLOYEE" },
//   em_support:  { component: SupportEmp,                   title: "Help & Support",   role: "EMPLOYEE" },
//   em_alerts:   { component: Notifications,                title: "Notifications",    role: "EMPLOYEE" },
//   em_offboard: { component: EmployeeExit,                 title: "Exit Portal",      role: "EMPLOYEE" },
//   em_status:   { component: EmployeeExitStatus,           title: "Exit Status",      role: "EMPLOYEE" },
//   em_change_pwd: { component: ChangePassword, title: "Change Password", role: "EMPLOYEE" },

//   // ── ADMIN ─────────────────────────────────────────────────────────────────
//   ad_home:        { component: AdminDashboard,       title: "Dashboard",          role: "ADMIN" },
//   ad_team:        { component: ManageEmployees,      title: "Manage Employees",   role: "ADMIN" },
//   ad_onboard:     { component: AddEmployee,          title: "Add Employee",       role: "ADMIN" },
//   ad_time:        { component: Attendance,           title: "Attendance",         role: "ADMIN" },
//   ad_leave:       { component: LeaveManagement,      title: "Leave Management",   role: "ADMIN" },
//   ad_payroll:     { component: PayrollManagement,    title: "Payroll",            role: "ADMIN" },
//   ad_finance:     { component: Financehub,           title: "Finance Hub",        role: "ADMIN" },
//   ad_finview:     { component: FinanceOverview,      title: "Finance Overview",   role: "ADMIN" },
//   ad_manual:      { component: ManualEntry,          title: "Manual Entry",       role: "ADMIN" },
//   ad_autopayroll: { component: AutoPayroll,          title: "Auto Payroll",       role: "ADMIN" }, // ✅ NEW
//   ad_perf:        { component: PerformanceDashboard, title: "Performance",        role: "ADMIN" },
//   ad_gear:        { component: Assets,               title: "Assets",             role: "ADMIN" },
//   ad_org:         { component: HierarchyTree,        title: "Org Hierarchy",      role: "ADMIN" },
//   ad_docs:        { component: AdminDocuments,       title: "Documents",          role: "ADMIN" },
//   ad_alerts:      { component: AdminNotifications,   title: "Notifications",      role: "ADMIN" },
//   ad_support:     { component: Support,              title: "Support",            role: "ADMIN" },
//   ad_mgmt:        { component: AdminManagement,      title: "Management",         role: "ADMIN" },
//   ad_company:     { component: CompanyManagement,    title: "Company",            role: "ADMIN" },

//   // ── SUPER ADMIN ───────────────────────────────────────────────────────────
//   sa_home:    { component: SuperAdminDashboard, title: "Dashboard",        role: "SUPER_ADMIN" },
//   sa_team:    { component: EmployeeManagement,  title: "Employees",        role: "SUPER_ADMIN" },
//   sa_admins:  { component: ManageAdmins,        title: "Manage Admins",    role: "SUPER_ADMIN" },
//   sa_onboard: { component: AddEmployee,         title: "Add Employee",     role: "SUPER_ADMIN" },
//   sa_finance: { component: SuperAdminDashboard, title: "Finance",          role: "SUPER_ADMIN" },
//   sa_time:    { component: SuperAdminDashboard, title: "Attendance",       role: "SUPER_ADMIN" },
//   sa_docs:    { component: SuperAdminDashboard, title: "Documents",        role: "SUPER_ADMIN" },
//   sa_support: { component: SuperAdminDashboard, title: "Support",          role: "SUPER_ADMIN" },

//   // ── GLOBAL ADMIN ──────────────────────────────────────────────────────────
//   ga_home:     { component: GlobalAdminDashboard,   title: "Dashboard",         role: "GLOBAL_ADMIN" },
//   ga_org:      { component: GlobalCompanies,        title: "Companies",         role: "GLOBAL_ADMIN" },
//   ga_billing:  { component: SubscriptionsBilling,   title: "Subscriptions",     role: "GLOBAL_ADMIN" },
//   ga_users:    { component: UserRoleManagement,     title: "Users & Roles",     role: "GLOBAL_ADMIN" },
//   ga_reports:  { component: ReportsAnalytics,       title: "Reports",           role: "GLOBAL_ADMIN" },
//   ga_paysetup: { component: SalarySlipSettingsPage, title: "Salary Setup",      role: "GLOBAL_ADMIN" },
//   ga_security: { component: SecurityCompliance,     title: "Security",          role: "GLOBAL_ADMIN" },
//   ga_tickets:  { component: SupportTickets,         title: "Support Tickets",   role: "GLOBAL_ADMIN" },
//   ga_audit:    { component: SystemLogs,             title: "Audit Logs",        role: "GLOBAL_ADMIN" },
//   ga_config:   { component: SystemSettings,         title: "Settings",          role: "GLOBAL_ADMIN" },
// };

// // ── ROLE SETS ─────────────────────────────────────────────────────────────────
// const EMPLOYEE_ROLES     = ["EMPLOYEE"];
// const ADMIN_ROLES        = ["ADMIN"];
// const SUPER_ADMIN_ROLES  = ["SUPER_ADMIN", "SUPERADMIN", "COMPANY_ADMIN", "COMPANYADMIN"];
// const GLOBAL_ADMIN_ROLES = ["GLOBAL_ADMIN", "GLOBALADMIN"];

// function getRoleGroup(role) {
//   if (EMPLOYEE_ROLES.includes(role))     return "EMPLOYEE";
//   if (ADMIN_ROLES.includes(role))        return "ADMIN";
//   if (SUPER_ADMIN_ROLES.includes(role))  return "SUPER_ADMIN";
//   if (GLOBAL_ADMIN_ROLES.includes(role)) return "GLOBAL_ADMIN";
//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// //  APP SHELL COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// export default function AppShell() {
//   const navigate  = useNavigate();
//   const role      = getStoredRole();
//   const roleGroup = getRoleGroup(role);

//   const [currentPage, setCurrentPage] = useState(() => {
//     const saved = sessionStorage.getItem("currentPage");
//     const def   = getRoleDefaultPage();
//     if (saved && PAGE_REGISTRY[saved]) {
//       const pageRoleGroup = getRoleGroup(PAGE_REGISTRY[saved].role);
//       if (pageRoleGroup === roleGroup) return saved;
//     }
//     return def || "em_home";
//   });

//   useEffect(() => {
//     sessionStorage.setItem("currentPage", currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     const check = () => {
//       if (!isTokenValid()) {
//         clearSession();
//         sessionStorage.removeItem("currentPage");
//         navigate("/login", { replace: true });
//       }
//     };
//     const interval = setInterval(check, 60000);
//     return () => clearInterval(interval);
//   }, [navigate]);

//   const handleLogout = useCallback(() => {
//     clearSession();
//     sessionStorage.removeItem("currentPage");
//     navigate("/login", { replace: true });
//   }, [navigate]);

//   const navigateTo = useCallback((pageKey) => {
//     if (!PAGE_REGISTRY[pageKey]) return;
//     setCurrentPage(pageKey);
//   }, []);

//   const pageConfig = PAGE_REGISTRY[currentPage];
//   if (!pageConfig) {
//     const def = getRoleDefaultPage();
//     if (def) setCurrentPage(def);
//     return null;
//   }

//   const PageComponent = pageConfig.component;
//   const pageTitle     = pageConfig.title;
//   const childProps    = { currentPage, navigateTo, pageTitle };

//   if (roleGroup === "EMPLOYEE") {
//     return (
//       <EmployeeLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
//         <PageComponent {...childProps} />
//       </EmployeeLayout>
//     );
//   }

//   if (roleGroup === "ADMIN") {
//     return (
//       <AdminLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
//         <PageComponent {...childProps} />
//       </AdminLayout>
//     );
//   }

//   if (roleGroup === "SUPER_ADMIN") {
//     return (
//       <SuperAdminLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
//         <PageComponent {...childProps} />
//       </SuperAdminLayout>
//     );
//   }

//   if (roleGroup === "GLOBAL_ADMIN") {
//     return (
//       <GlobalAdminLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
//         <PageComponent {...childProps} />
//       </GlobalAdminLayout>
//     );
//   }

//   handleLogout();
//   return null;
// }
// ─────────────────────────────────────────────────────────────────────────────
//  src/app/AppShell.jsx
//  UPDATED — added AdminHrDocuments for ad_hrdocs (Admin) and sa_docs (SuperAdmin)
//
//  HOW YOUR ROUTING WORKS:
//  navRoutes.jsx has short keys  →  e.g. key:"hrdocs"
//  Sidebar calls navigateTo("ad_" + key)  →  navigateTo("ad_hrdocs")
//  PAGE_REGISTRY["ad_hrdocs"] → AdminHrDocuments component renders
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, clearSession, getStoredRole, getRoleDefaultPage } from "./authGuard";

/* ── LAYOUTS ─────────────────────────────────────────────────────────────── */
import EmployeeLayout    from "../features/Employee/Layouts/EmployeeLayout.jsx";
import AdminLayout       from "../features/Admin/Layouts/AdminLayout.jsx";
import SuperAdminLayout  from "../features/Super_Admin/Layout/SuperAdminLayout.jsx";
import GlobalAdminLayout from "../features/GlobalAdmin/Layout/GlobalAdminLayout.jsx";

/* ── EMPLOYEE PAGES ──────────────────────────────────────────────────────── */
import EmployeeDashboard            from "../features/Employee/pages/EmployeeDashboard.jsx";
import EmpAttendance                from "../features/Employee/pages/Attendance.jsx";
import FinancehubEmp                from "../features/Employee/pages/Financehub.jsx";
import Payslip                      from "../features/Employee/pages/Payslip.jsx";
import Policy                       from "../features/Employee/pages/Policy.jsx";
import Reimbursements               from "../features/Employee/pages/Reimbursements.jsx";
import SupportEmp                   from "../features/Employee/pages/Support.jsx";
import TaxDeclaration               from "../features/Employee/pages/TaxDeclaration.jsx";
import Notifications                from "../features/Employee/pages/Notifications.jsx";
import EmpDocuments                 from "../features/Employee/pages/Documents.jsx";
import EmployeeLeaveManagement      from "../features/Employee/pages/EmployeeLeaveManagement.jsx";
import EmployeeAssets               from "../features/Employee/pages/EmployeeAssets.jsx";
import EmployeePerformanceDashboard from "../features/Employee/pages/EmployeePerformanceDashboard.jsx";
import EmployeeExit                 from "../features/Employee/pages/EmployeeExit.jsx";
import EmployeeExitStatus           from "../features/Employee/pages/EmployeeExitStatus.jsx";
import ChangePassword               from "../features/Employee/pages/ChangePassword.jsx";
import EmployeeHierarchy           from "../features/Employee/pages/EmployeeHierarchy.jsx";

/* ── ADMIN PAGES ─────────────────────────────────────────────────────────── */
import AdminDashboard       from "../features/Admin/pages/AdminDashboard.jsx";
import AdminManagement      from "../features/Admin/pages/AdminManagement.jsx";
import CompanyManagement    from "../features/Admin/pages/CompanyManagement.jsx";
import AddEmployee          from "../features/Admin/pages/AddEmployee.jsx";
import ManageEmployees      from "../features/Admin/pages/ManageEmployees.jsx";
import Financehub           from "../features/Admin/pages/Financehub.jsx";
import FinanceOverview      from "../features/Admin/pages/FinanceOverview.jsx";
import LeaveManagement      from "../features/Admin/pages/LeaveManagement.jsx";
import ManualEntry          from "../features/Admin/pages/ManualEntry.jsx";
import AutoPayroll          from "../features/Admin/pages/Autopayroll.jsx";
import PayrollManagement    from "../features/Admin/pages/PayrollManagement.jsx";
import SalaryRevisionHistory from "../features/Admin/pages/SalaryRevisionHistory.jsx";
import Attendance           from "../features/Admin/pages/Attendance.jsx";
import Support              from "../features/Admin/pages/Support.jsx";
import AdminDocuments       from "../features/Admin/pages/Documents.jsx";
import AdminHrDocuments     from "../features/Admin/pages/AdminHrDocuments.jsx";    // ← NEW ✅
import AdminPolicies        from "../features/Admin/pages/AdminPolicies.jsx";
import AdminReimbursements  from "../features/Admin/pages/AdminReimbursements.jsx";
import AdminExitRequests    from "../features/Admin/pages/AdminExitRequests.jsx";
import AdminTaxDeclarations from "../features/Admin/pages/AdminTaxDeclarations.jsx";
import AdminPayslipManagement from "../features/Admin/pages/AdminPayslipManagement.jsx";
import AdminCompliance      from "../features/Admin/pages/AdminCompliance.jsx";
import AdminAuditLogs       from "../features/Admin/pages/AdminAuditLogs.jsx";
import SuperAdminPolicies   from "../features/Super_Admin/pages/SuperAdminPolicies.jsx";
import AdminNotifications   from "../features/Admin/pages/Noifications.jsx";
import PerformanceDashboard from "../features/Admin/pages/PerformanceDashboard.jsx";
import Assets               from "../features/Admin/pages/Assets.jsx";
import HierarchyTree        from "../features/Admin/pages/HierarchyTree.jsx";

/* ── SUPER ADMIN PAGES ───────────────────────────────────────────────────── */
import SuperAdminDashboard   from "../features/Super_Admin/pages/SuperAdminDashboard.jsx";
import EmployeeManagement    from "../features/Super_Admin/pages/EmployeeManagement.jsx";
import ManageAdmins          from "../features/Super_Admin/pages/Manageadmins.jsx";
import SuperAdminHrDocuments from "../features/Super_Admin/pages/AdminHrDocuments.jsx"; // ← NEW ✅

/* ── GLOBAL ADMIN PAGES ──────────────────────────────────────────────────── */
import GlobalAdminDashboard   from "../features/GlobalAdmin/pages/GlobalAdminDashboard.jsx";
import GlobalCompanies        from "../features/GlobalAdmin/pages/GlobalCompanies.jsx";
import SubscriptionsBilling   from "../features/GlobalAdmin/pages/SubscriptionsBilling.jsx";
import UserRoleManagement     from "../features/GlobalAdmin/pages/UserRoleManagement.jsx";
import ReportsAnalytics       from "../features/GlobalAdmin/pages/ReportsAnalytics.jsx";
import SecurityCompliance     from "../features/GlobalAdmin/pages/SecurityCompliance.jsx";
import SupportTickets         from "../features/GlobalAdmin/pages/SupportTickets.jsx";
import SystemLogs             from "../features/GlobalAdmin/pages/SystemLogs.jsx";
import SystemSettings         from "../features/GlobalAdmin/pages/SystemSettings.jsx";
import SalarySlipSettingsPage from "../features/GlobalAdmin/pages/Salaryslipsettingspage.jsx";

// ─────────────────────────────────────────────────────────────────────────────
//  PAGE REGISTRY
//  Prefixed keys: "ad_hrdocs", "sa_docs", "em_docs" etc.
//  Sidebar calls: navigateTo("ad_" + shortKey)
//  So navRoutes key:"hrdocs" → navigateTo("ad_hrdocs") → AdminHrDocuments
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_REGISTRY = {

  // ── EMPLOYEE ──────────────────────────────────────────────────────────────
  em_home:       { component: EmployeeDashboard,            title: "My Dashboard",     role: "EMPLOYEE" },
  em_time:       { component: EmpAttendance,                title: "My Attendance",    role: "EMPLOYEE" },
  em_leave:      { component: EmployeeLeaveManagement,      title: "Leave Management", role: "EMPLOYEE" },
  em_finance:    { component: FinancehubEmp,                title: "Finance Hub",      role: "EMPLOYEE" },
  em_pay:        { component: Payslip,                      title: "My Payslips",      role: "EMPLOYEE" },
  em_claims:     { component: Reimbursements,               title: "Reimbursements",   role: "EMPLOYEE" },
  em_tax:        { component: TaxDeclaration,               title: "Tax Declaration",  role: "EMPLOYEE" },
  em_perf:       { component: EmployeePerformanceDashboard, title: "Performance",      role: "EMPLOYEE" },
  em_gear:       { component: EmployeeAssets,               title: "Assets",           role: "EMPLOYEE" },
  em_docs:       { component: EmpDocuments,                 title: "My Documents",     role: "EMPLOYEE" }, // ← REPLACED Documents.jsx
  em_policy:     { component: Policy,                       title: "Policy Vault",     role: "EMPLOYEE" },
  em_support:    { component: SupportEmp,                   title: "Help & Support",   role: "EMPLOYEE" },
  em_alerts:     { component: Notifications,                title: "Notifications",    role: "EMPLOYEE" },
  em_offboard:   { component: EmployeeExit,                 title: "Exit Portal",      role: "EMPLOYEE" },
  em_status:     { component: EmployeeExitStatus,           title: "Exit Status",      role: "EMPLOYEE" },
  em_change_pwd: { component: ChangePassword,               title: "Change Password",  role: "EMPLOYEE" },
  em_org:        { component: () => React.createElement(HierarchyTree, { canEdit: false }), title: "Org Chart", role: "EMPLOYEE" },

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  ad_home:        { component: AdminDashboard,       title: "Dashboard",          role: "ADMIN" },
  ad_team:        { component: ManageEmployees,      title: "Manage Employees",   role: "ADMIN" },
  ad_onboard:     { component: AddEmployee,          title: "Add Employee",       role: "ADMIN" },
  ad_time:        { component: Attendance,           title: "Attendance",         role: "ADMIN" },
  ad_leave:       { component: LeaveManagement,      title: "Leave Management",   role: "ADMIN" },
  ad_payroll:     { component: PayrollManagement,    title: "Payroll",            role: "ADMIN" },
  ad_autopayroll: { component: AutoPayroll,          title: "Auto Payroll",       role: "ADMIN" },
  ad_finance:     { component: Financehub,           title: "Finance Hub",        role: "ADMIN" },
  ad_finview:     { component: FinanceOverview,      title: "Finance Overview",   role: "ADMIN" },
  ad_salrev:      { component: SalaryRevisionHistory, title: "Salary Revisions",  role: "ADMIN" },
  ad_manual:      { component: ManualEntry,          title: "Manual Entry",       role: "ADMIN" },
  ad_perf:        { component: PerformanceDashboard, title: "Performance",        role: "ADMIN" },
  ad_gear:        { component: Assets,               title: "Assets",             role: "ADMIN" },
  ad_org:         { component: HierarchyTree,        title: "Org Hierarchy",      role: "ADMIN" },
  ad_docs:        { component: AdminDocuments,       title: "Employee Documents", role: "ADMIN" }, // existing
  ad_hrdocs:      { component: AdminHrDocuments,     title: "HR Documents",       role: "ADMIN" }, // ← NEW ✅
  ad_policy:      { component: AdminPolicies,        title: "Policy Vault",       role: "ADMIN" },
  ad_reimbursements: { component: AdminReimbursements,   title: "Reimbursements",      role: "ADMIN" },
  ad_exit_requests:  { component: AdminExitRequests,    title: "Exit Requests",       role: "ADMIN" },
  ad_tax:            { component: AdminTaxDeclarations, title: "Tax Declarations",    role: "ADMIN" },
  ad_payslip:        { component: AdminPayslipManagement, title: "Payslip Management", role: "ADMIN" },
  ad_compliance:     { component: AdminCompliance,      title: "Compliance",          role: "ADMIN" },
  ad_audit:          { component: AdminAuditLogs,       title: "Audit Logs",          role: "ADMIN" },
  ad_alerts:      { component: AdminNotifications,   title: "Notifications",      role: "ADMIN" },
  ad_support:     { component: Support,              title: "Support",            role: "ADMIN" },
  ad_mgmt:        { component: AdminManagement,      title: "Management",         role: "ADMIN" },
  ad_company:     { component: CompanyManagement,    title: "Company",            role: "ADMIN" },

  // ── SUPER ADMIN ───────────────────────────────────────────────────────────
  sa_home:    { component: SuperAdminDashboard,   title: "Dashboard",        role: "SUPER_ADMIN" },
  sa_team:    { component: EmployeeManagement,    title: "Manage Employees", role: "SUPER_ADMIN" },
  sa_admins:  { component: ManageAdmins,          title: "Manage Admins",    role: "SUPER_ADMIN" },
  sa_onboard: { component: AddEmployee,           title: "Add Employee",     role: "SUPER_ADMIN" },
  sa_org:     { component: HierarchyTree,          title: "Org Hierarchy",    role: "SUPER_ADMIN" },
  sa_docs:    { component: SuperAdminHrDocuments, title: "HR Documents",     role: "SUPER_ADMIN" },
  sa_policy:  { component: SuperAdminPolicies,    title: "Policy Vault",     role: "SUPER_ADMIN" },
  sa_company: { component: CompanyManagement,     title: "Company Settings", role: "SUPER_ADMIN" },
  sa_audit:   { component: AdminAuditLogs,        title: "Audit Logs",       role: "SUPER_ADMIN" },

  // ── GLOBAL ADMIN ──────────────────────────────────────────────────────────
  ga_home:     { component: GlobalAdminDashboard,   title: "Dashboard",         role: "GLOBAL_ADMIN" },
  ga_org:      { component: GlobalCompanies,        title: "Companies",         role: "GLOBAL_ADMIN" },
  ga_billing:  { component: SubscriptionsBilling,   title: "Subscriptions",     role: "GLOBAL_ADMIN" },
  ga_users:    { component: UserRoleManagement,     title: "Users & Roles",     role: "GLOBAL_ADMIN" },
  ga_reports:  { component: ReportsAnalytics,       title: "Reports",           role: "GLOBAL_ADMIN" },
  ga_paysetup: { component: SalarySlipSettingsPage, title: "Salary Setup",      role: "GLOBAL_ADMIN" },
  ga_security: { component: SecurityCompliance,     title: "Security",          role: "GLOBAL_ADMIN" },
  ga_tickets:  { component: SupportTickets,         title: "Support Tickets",   role: "GLOBAL_ADMIN" },
  ga_audit:    { component: SystemLogs,             title: "Audit Logs",        role: "GLOBAL_ADMIN" },
  ga_config:   { component: SystemSettings,         title: "Settings",          role: "GLOBAL_ADMIN" },
};

// ── ROLE SETS ─────────────────────────────────────────────────────────────────
const EMPLOYEE_ROLES     = ["EMPLOYEE"];
const ADMIN_ROLES        = ["ADMIN"];
const SUPER_ADMIN_ROLES  = ["SUPER_ADMIN", "SUPERADMIN", "COMPANY_ADMIN", "COMPANYADMIN"];
const GLOBAL_ADMIN_ROLES = ["GLOBAL_ADMIN", "GLOBALADMIN"];

function getRoleGroup(role) {
  if (EMPLOYEE_ROLES.includes(role))     return "EMPLOYEE";
  if (ADMIN_ROLES.includes(role))        return "ADMIN";
  if (SUPER_ADMIN_ROLES.includes(role))  return "SUPER_ADMIN";
  if (GLOBAL_ADMIN_ROLES.includes(role)) return "GLOBAL_ADMIN";
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  APP SHELL — no logic changes, identical to your existing version
// ─────────────────────────────────────────────────────────────────────────────
export default function AppShell() {
  const navigate  = useNavigate();
  const role      = getStoredRole();
  const roleGroup = getRoleGroup(role);

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem("currentPage");
    const def   = getRoleDefaultPage();
    if (saved && PAGE_REGISTRY[saved]) {
      const pageRoleGroup = getRoleGroup(PAGE_REGISTRY[saved].role);
      if (pageRoleGroup === roleGroup) return saved;
    }
    return def || "em_home";
  });

  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    const check = () => {
      if (!isTokenValid()) {
        clearSession();
        sessionStorage.removeItem("currentPage");
        navigate("/login", { replace: true });
      }
    };
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    clearSession();
    sessionStorage.removeItem("currentPage");
    navigate("/login", { replace: true });
  }, [navigate]);

  const navigateTo = useCallback((pageKey) => {
    if (!PAGE_REGISTRY[pageKey]) return;
    setCurrentPage(pageKey);
  }, []);

  const pageConfig = PAGE_REGISTRY[currentPage];
  if (!pageConfig) {
    const def = getRoleDefaultPage();
    if (def) setCurrentPage(def);
    return null;
  }

  const PageComponent = pageConfig.component;
  const pageTitle     = pageConfig.title;
  const childProps    = { currentPage, navigateTo, pageTitle };

  if (roleGroup === "EMPLOYEE") {
    return (
      <EmployeeLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
        <PageComponent {...childProps} />
      </EmployeeLayout>
    );
  }

  if (roleGroup === "ADMIN") {
    return (
      <AdminLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
        <PageComponent {...childProps} />
      </AdminLayout>
    );
  }

  if (roleGroup === "SUPER_ADMIN") {
    return (
      <SuperAdminLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
        <PageComponent {...childProps} />
      </SuperAdminLayout>
    );
  }

  if (roleGroup === "GLOBAL_ADMIN") {
    return (
      <GlobalAdminLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
        <PageComponent {...childProps} />
      </GlobalAdminLayout>
    );
  }

  handleLogout();
  return null;
}