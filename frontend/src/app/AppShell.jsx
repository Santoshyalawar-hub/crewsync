// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { isTokenValid, clearSession, getStoredRole, getRoleDefaultPage } from "./authGuard";

// /* ── LAYOUTS ─────────────────────────────────────────────────────────────── */
// import PersonLayout    from "../features/Person/Layouts/PersonLayout.jsx";
// import OperatorLayout       from "../features/Operator/Layouts/OperatorLayout.jsx";
// import SuperOperatorLayout  from "../features/Super_Operator/Layout/SuperOperatorLayout.jsx";
// import GlobalOperatorLayout from "../features/GlobalOperator/Layout/GlobalOperatorLayout.jsx";

// /* ── EMPLOYEE PAGES ──────────────────────────────────────────────────────── */
// import PersonControlRoom            from "../features/Person/pages/PersonControlRoom.jsx";
// import EmpPresence                from "../features/Person/pages/Presence.jsx";
// import MoneyOpshubEmp                from "../features/Person/pages/MoneyOpshub.jsx";
// import PayStatement                      from "../features/Person/pages/PayStatement.jsx";
// import Playbook                       from "../features/Person/pages/Playbook.jsx";
// import ClaimsDesk               from "../features/Person/pages/ClaimsDesk.jsx";
// import CareDeskEmp                   from "../features/Person/pages/CareDesk.jsx";
// import TaxDeclaration               from "../features/Person/pages/TaxDeclaration.jsx";
// import Signals                from "../features/Person/pages/Signals.jsx";
// import EmpVault                 from "../features/Person/pages/Vault.jsx";
// import PersonTimeAwayOperations      from "../features/Person/pages/PersonTimeAwayOperations.jsx";
// import PersonEquipment               from "../features/Person/pages/PersonEquipment.jsx";
// import PersonMomentumControlRoom from "../features/Person/pages/PersonMomentumControlRoom.jsx";
// import PersonExit                 from "../features/Person/pages/PersonExit.jsx";
// import PersonExitStatus           from "../features/Person/pages/PersonExitStatus.jsx";
// import ChangePassword from "../features/Person/pages/ChangePassword.jsx";

// /* ── ADMIN PAGES ─────────────────────────────────────────────────────────── */
// import OperatorControlRoom       from "../features/Operator/pages/OperatorControlRoom.jsx";
// import OperatorOperations      from "../features/Operator/pages/OperatorOperations.jsx";
// import WorkspaceOperations    from "../features/Operator/pages/WorkspaceOperations.jsx";
// import AddPerson          from "../features/Operator/pages/AddPerson.jsx";
// import ManagePersons      from "../features/Operator/pages/ManagePersons.jsx";
// import MoneyOpshub           from "../features/Operator/pages/MoneyOpshub.jsx";
// import MoneyOpsOverview      from "../features/Operator/pages/MoneyOpsOverview.jsx";
// import TimeAwayOperations      from "../features/Operator/pages/TimeAwayOperations.jsx";
// import ManualEntry          from "../features/Operator/pages/ManualEntry.jsx";
// import AutoPayouts          from "../features/Operator/pages/Autopayroll.jsx";   // ✅ NEW
// import PayoutsOperations    from "../features/Operator/pages/PayoutsOperations.jsx";
// import Presence           from "../features/Operator/pages/Presence.jsx";
// import CareDesk              from "../features/Operator/pages/CareDesk.jsx";
// import OperatorVault       from "../features/Operator/pages/Vault.jsx";
// import OperatorSignals   from "../features/Operator/pages/Noifications.jsx";
// import MomentumControlRoom from "../features/Operator/pages/MomentumControlRoom.jsx";
// import Equipment               from "../features/Operator/pages/Equipment.jsx";
// import PeopleMapTree        from "../features/Operator/pages/PeopleMapTree.jsx";

// /* ── SUPER ADMIN PAGES ───────────────────────────────────────────────────── */
// import SuperOperatorControlRoom from "../features/Super_Operator/pages/SuperOperatorControlRoom.jsx";
// import PersonOperations  from "../features/Super_Operator/pages/PersonOperations.jsx";
// import ManageOperators        from "../features/Super_Operator/pages/Manageadmins.jsx";

// /* ── GLOBAL ADMIN PAGES ──────────────────────────────────────────────────── */
// import GlobalOperatorControlRoom   from "../features/GlobalOperator/pages/GlobalOperatorControlRoom.jsx";
// import GlobalWorkspaces        from "../features/GlobalOperator/pages/GlobalWorkspaces.jsx";
// import PlansBilling   from "../features/GlobalOperator/pages/PlansBilling.jsx";
// import UserRoleOperations     from "../features/GlobalOperator/pages/UserRoleOperations.jsx";
// import SignalReportsSignals       from "../features/GlobalOperator/pages/SignalReportsSignals.jsx";
// import TrustAssurance     from "../features/GlobalOperator/pages/TrustAssurance.jsx";
// import CareDeskTickets         from "../features/GlobalOperator/pages/CareDeskTickets.jsx";
// import SystemLogs             from "../features/GlobalOperator/pages/SystemLogs.jsx";
// import SystemConfiguration         from "../features/GlobalOperator/pages/SystemConfiguration.jsx";
// import CompensationSlipConfigurationPage from "../features/GlobalOperator/pages/Compensationslipsettingspage.jsx";

// // ─────────────────────────────────────────────────────────────────────────────
// //  PAGE REGISTRY
// // ─────────────────────────────────────────────────────────────────────────────
// const PAGE_REGISTRY = {
//   // ── EMPLOYEE ──────────────────────────────────────────────────────────────
//   em_home:     { component: PersonControlRoom,            title: "My Control Room",     role: "EMPLOYEE" },
//   em_time:     { component: EmpPresence,                title: "My Presence",    role: "EMPLOYEE" },
//   em_leave:    { component: PersonTimeAwayOperations,      title: "Time Away Flow", role: "EMPLOYEE" },
//   em_finance:  { component: MoneyOpshubEmp,                title: "Money Desk",      role: "EMPLOYEE" },
//   em_pay:      { component: PayStatement,                      title: "My Pay Statements",      role: "EMPLOYEE" },
//   em_claims:   { component: ClaimsDesk,               title: "ClaimsDesk",   role: "EMPLOYEE" },
//   em_tax:      { component: TaxDeclaration,               title: "Tax Desk",  role: "EMPLOYEE" },
//   em_perf:     { component: PersonMomentumControlRoom, title: "Momentum",      role: "EMPLOYEE" },
//   em_gear:     { component: PersonEquipment,               title: "Equipment",           role: "EMPLOYEE" },
//   em_docs:     { component: EmpVault,                 title: "My Vault",     role: "EMPLOYEE" },
//   em_policy:   { component: Playbook,                       title: "Playbook Vault",     role: "EMPLOYEE" },
//   em_support:  { component: CareDeskEmp,                   title: "Care Desk",   role: "EMPLOYEE" },
//   em_alerts:   { component: Signals,                title: "Signals",    role: "EMPLOYEE" },
//   em_offboard: { component: PersonExit,                 title: "Exit Portal",      role: "EMPLOYEE" },
//   em_status:   { component: PersonExitStatus,           title: "Exit Status",      role: "EMPLOYEE" },
//   em_change_pwd: { component: ChangePassword, title: "Change Password", role: "EMPLOYEE" },

//   // ── ADMIN ─────────────────────────────────────────────────────────────────
//   ad_home:        { component: OperatorControlRoom,       title: "Control Room",          role: "ADMIN" },
//   ad_team:        { component: ManagePersons,      title: "People Grid",   role: "ADMIN" },
//   ad_onboard:     { component: AddPerson,          title: "Add Person",       role: "ADMIN" },
//   ad_time:        { component: Presence,           title: "Presence",         role: "ADMIN" },
//   ad_leave:       { component: TimeAwayOperations,      title: "Time Away Flow",   role: "ADMIN" },
//   ad_payroll:     { component: PayoutsOperations,    title: "Payouts",            role: "ADMIN" },
//   ad_finance:     { component: MoneyOpshub,           title: "Money Desk",        role: "ADMIN" },
//   ad_finview:     { component: MoneyOpsOverview,      title: "Money Desk Overview",   role: "ADMIN" },
//   ad_manual:      { component: ManualEntry,          title: "Direct Entry",       role: "ADMIN" },
//   ad_autopayroll: { component: AutoPayouts,          title: "Auto Payouts",       role: "ADMIN" }, // ✅ NEW
//   ad_perf:        { component: MomentumControlRoom, title: "Momentum",        role: "ADMIN" },
//   ad_gear:        { component: Equipment,               title: "Equipment",             role: "ADMIN" },
//   ad_org:         { component: PeopleMapTree,        title: "People Map",      role: "ADMIN" },
//   ad_docs:        { component: OperatorVault,       title: "Vault",          role: "ADMIN" },
//   ad_alerts:      { component: OperatorSignals,   title: "Signals",      role: "ADMIN" },
//   ad_support:     { component: CareDesk,              title: "Care Desk",            role: "ADMIN" },
//   ad_mgmt:        { component: OperatorOperations,      title: "Operations",         role: "ADMIN" },
//   ad_company:     { component: WorkspaceOperations,    title: "Workspace",            role: "ADMIN" },

//   // ── SUPER ADMIN ───────────────────────────────────────────────────────────
//   sa_home:    { component: SuperOperatorControlRoom, title: "Control Room",        role: "SUPER_ADMIN" },
//   sa_team:    { component: PersonOperations,  title: "Persons",        role: "SUPER_ADMIN" },
//   sa_admins:  { component: ManageOperators,        title: "Manage Operators",    role: "SUPER_ADMIN" },
//   sa_onboard: { component: AddPerson,         title: "Add Person",     role: "SUPER_ADMIN" },
//   sa_finance: { component: SuperOperatorControlRoom, title: "Money Desk",          role: "SUPER_ADMIN" },
//   sa_time:    { component: SuperOperatorControlRoom, title: "Presence",       role: "SUPER_ADMIN" },
//   sa_docs:    { component: SuperOperatorControlRoom, title: "Vault",        role: "SUPER_ADMIN" },
//   sa_support: { component: SuperOperatorControlRoom, title: "Care Desk",          role: "SUPER_ADMIN" },

//   // ── GLOBAL ADMIN ──────────────────────────────────────────────────────────
//   ga_home:     { component: GlobalOperatorControlRoom,   title: "Control Room",         role: "GLOBAL_ADMIN" },
//   ga_org:      { component: GlobalWorkspaces,        title: "Workspaces",         role: "GLOBAL_ADMIN" },
//   ga_billing:  { component: PlansBilling,   title: "Plans",     role: "GLOBAL_ADMIN" },
//   ga_users:    { component: UserRoleOperations,     title: "Access Matrix",     role: "GLOBAL_ADMIN" },
//   ga_reports:  { component: SignalReportsSignals,       title: "Signal Reports",           role: "GLOBAL_ADMIN" },
//   ga_paysetup: { component: CompensationSlipConfigurationPage, title: "Pay Setup",      role: "GLOBAL_ADMIN" },
//   ga_security: { component: TrustAssurance,     title: "Trust",          role: "GLOBAL_ADMIN" },
//   ga_tickets:  { component: CareDeskTickets,         title: "Care Requests",   role: "GLOBAL_ADMIN" },
//   ga_audit:    { component: SystemLogs,             title: "Activity Trail",        role: "GLOBAL_ADMIN" },
//   ga_config:   { component: SystemConfiguration,         title: "Configuration",          role: "GLOBAL_ADMIN" },
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
//       <PersonLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
//         <PageComponent {...childProps} />
//       </PersonLayout>
//     );
//   }

//   if (roleGroup === "ADMIN") {
//     return (
//       <OperatorLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
//         <PageComponent {...childProps} />
//       </OperatorLayout>
//     );
//   }

//   if (roleGroup === "SUPER_ADMIN") {
//     return (
//       <SuperOperatorLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
//         <PageComponent {...childProps} />
//       </SuperOperatorLayout>
//     );
//   }

//   if (roleGroup === "GLOBAL_ADMIN") {
//     return (
//       <GlobalOperatorLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
//         <PageComponent {...childProps} />
//       </GlobalOperatorLayout>
//     );
//   }

//   handleLogout();
//   return null;
// }
// ─────────────────────────────────────────────────────────────────────────────
//  src/app/AppShell.jsx
//  UPDATED — added OperatorHrVault for ad_hrdocs (Operator) and sa_docs (SuperOperator)
//
//  HOW YOUR ROUTING WORKS:
//  navRoutes.jsx has short keys  →  e.g. key:"hrdocs"
//  Sidebar calls navigateTo("ad_" + key)  →  navigateTo("ad_hrdocs")
//  PAGE_REGISTRY["ad_hrdocs"] → OperatorHrVault component renders
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
//  So navRoutes key:"hrdocs" → navigateTo("ad_hrdocs") → OperatorHrVault
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_REGISTRY = {

  // ── EMPLOYEE ──────────────────────────────────────────────────────────────
  em_home:       { component: EmployeeDashboard,            title: "My Control Room",     role: "EMPLOYEE" },
  em_time:       { component: EmpAttendance,                title: "My Presence",        role: "EMPLOYEE" },
  em_leave:      { component: EmployeeLeaveManagement,      title: "Time Away Flow",     role: "EMPLOYEE" },
  em_finance:    { component: FinancehubEmp,                title: "Money Desk",          role: "EMPLOYEE" },
  em_pay:        { component: Payslip,                      title: "My Pay Statements",  role: "EMPLOYEE" },
  em_claims:     { component: Reimbursements,               title: "ClaimsDesk",        role: "EMPLOYEE" },
  em_tax:        { component: TaxDeclaration,               title: "Tax Desk",  role: "EMPLOYEE" },
  em_perf:       { component: EmployeePerformanceDashboard, title: "Momentum",      role: "EMPLOYEE" },
  em_gear:       { component: EmployeeAssets,               title: "Equipment",     role: "EMPLOYEE" },
  em_docs:       { component: EmpDocuments,                 title: "My Vault",      role: "EMPLOYEE" },
  em_policy:     { component: Policy,                       title: "Playbook Vault", role: "EMPLOYEE" },
  em_support:    { component: SupportEmp,                   title: "Care Desk",     role: "EMPLOYEE" },
  em_alerts:     { component: Notifications,                title: "Signals",       role: "EMPLOYEE" },
  em_offboard:   { component: EmployeeExit,                 title: "Exit Portal",   role: "EMPLOYEE" },
  em_status:     { component: EmployeeExitStatus,           title: "Exit Status",   role: "EMPLOYEE" },
  em_change_pwd: { component: ChangePassword,               title: "Change Password",  role: "EMPLOYEE" },
  em_org:        { component: EmployeeHierarchy,             title: "People Map",   role: "EMPLOYEE" },

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  ad_home:        { component: AdminDashboard,       title: "Control Room",          role: "ADMIN" },
  ad_team:        { component: ManageEmployees,      title: "People Grid",           role: "ADMIN" },
  ad_onboard:     { component: AddEmployee,          title: "Add Person",            role: "ADMIN" },
  ad_time:        { component: Attendance,           title: "Presence",              role: "ADMIN" },
  ad_leave:       { component: LeaveManagement,      title: "Time Away Flow",        role: "ADMIN" },
  ad_payroll:     { component: PayrollManagement,    title: "Payouts",               role: "ADMIN" },
  ad_autopayroll: { component: AutoPayroll,          title: "Auto Payouts",          role: "ADMIN" },
  ad_finance:     { component: Financehub,           title: "Money Desk",             role: "ADMIN" },
  ad_finview:     { component: FinanceOverview,      title: "Money Desk Overview",    role: "ADMIN" },
  ad_salrev:      { component: SalaryRevisionHistory, title: "Compensation Changes", role: "ADMIN" },
  ad_manual:      { component: ManualEntry,          title: "Direct Entry",       role: "ADMIN" },
  ad_perf:        { component: PerformanceDashboard, title: "Momentum",              role: "ADMIN" },
  ad_gear:        { component: Assets,               title: "Equipment",             role: "ADMIN" },
  ad_org:         { component: HierarchyTree,        title: "People Map",            role: "ADMIN" },
  ad_docs:        { component: AdminDocuments,       title: "People Vault",          role: "ADMIN" },
  ad_hrdocs:      { component: AdminHrDocuments,     title: "People Vault",      role: "ADMIN" },
  ad_policy:      { component: AdminPolicies,        title: "Playbook Vault",        role: "ADMIN" },
  ad_reimbursements: { component: AdminReimbursements, title: "ClaimsDesk",         role: "ADMIN" },
  ad_exit_requests:  { component: AdminExitRequests,    title: "Exit Requests",      role: "ADMIN" },
  ad_tax:            { component: AdminTaxDeclarations, title: "Tax Desk",           role: "ADMIN" },
  ad_payslip:        { component: AdminPayslipManagement, title: "Pay Statement Ops", role: "ADMIN" },
  ad_compliance:     { component: AdminCompliance,      title: "Assurance",          role: "ADMIN" },
  ad_audit:          { component: AdminAuditLogs,       title: "Activity Trail",     role: "ADMIN" },
  ad_alerts:      { component: AdminNotifications, title: "Signals",                 role: "ADMIN" },
  ad_support:     { component: Support,            title: "Care Desk",               role: "ADMIN" },
  ad_mgmt:        { component: AdminManagement,    title: "Operations",              role: "ADMIN" },
  ad_company:     { component: CompanyManagement,  title: "Workspace",               role: "ADMIN" },

  // ── SUPER ADMIN ───────────────────────────────────────────────────────────
  sa_home:    { component: SuperAdminDashboard,   title: "Control Room",        role: "SUPER_ADMIN" },
  sa_team:    { component: EmployeeManagement,    title: "People Grid",         role: "SUPER_ADMIN" },
  sa_admins:  { component: ManageAdmins,          title: "Manage Operators",    role: "SUPER_ADMIN" },
  sa_onboard: { component: AddEmployee,           title: "Add Person",          role: "SUPER_ADMIN" },
  sa_org:     { component: HierarchyTree,         title: "People Map",          role: "SUPER_ADMIN" },
  sa_docs:    { component: SuperAdminHrDocuments, title: "People Vault",    role: "SUPER_ADMIN" },
  sa_policy:  { component: SuperAdminPolicies,    title: "Playbook Vault",      role: "SUPER_ADMIN" },
  sa_company: { component: CompanyManagement,     title: "Workspace Config",    role: "SUPER_ADMIN" },
  sa_audit:   { component: AdminAuditLogs,        title: "Activity Trail",      role: "SUPER_ADMIN" },

  // ── GLOBAL ADMIN ──────────────────────────────────────────────────────────
  ga_home:     { component: GlobalAdminDashboard,   title: "Control Room",      role: "GLOBAL_ADMIN" },
  ga_org:      { component: GlobalCompanies,        title: "Workspaces",        role: "GLOBAL_ADMIN" },
  ga_billing:  { component: SubscriptionsBilling,   title: "Plans",             role: "GLOBAL_ADMIN" },
  ga_users:    { component: UserRoleManagement,     title: "Access Matrix",     role: "GLOBAL_ADMIN" },
  ga_reports:  { component: ReportsAnalytics,       title: "Signal Reports",    role: "GLOBAL_ADMIN" },
  ga_paysetup: { component: SalarySlipSettingsPage, title: "Pay Setup",         role: "GLOBAL_ADMIN" },
  ga_security: { component: SecurityCompliance,     title: "Trust",             role: "GLOBAL_ADMIN" },
  ga_tickets:  { component: SupportTickets,         title: "Care Requests",     role: "GLOBAL_ADMIN" },
  ga_audit:    { component: SystemLogs,             title: "Activity Trail",        role: "GLOBAL_ADMIN" },
  ga_config:   { component: SystemSettings,         title: "Configuration",      role: "GLOBAL_ADMIN" },
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
      <PersonLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
        <PageComponent {...childProps} />
      </PersonLayout>
    );
  }

  if (roleGroup === "ADMIN") {
    return (
      <OperatorLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
        <PageComponent {...childProps} />
      </OperatorLayout>
    );
  }

  if (roleGroup === "SUPER_ADMIN") {
    return (
      <SuperOperatorLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
        <PageComponent {...childProps} />
      </SuperOperatorLayout>
    );
  }

  if (roleGroup === "GLOBAL_ADMIN") {
    return (
      <GlobalOperatorLayout currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} pageTitle={pageTitle}>
        <PageComponent {...childProps} />
      </GlobalOperatorLayout>
    );
  }

  handleLogout();
  return null;
}
