// export const EMP_NAV = [
//   { key: "home",     label: "My Dashboard",   path: "/p/em/home"     },
//   { key: "time",     label: "Attendance",      path: "/p/em/time"     },
//   { key: "leave",    label: "Leave",           path: "/p/em/leave"    },
//   { key: "finance",  label: "Finance Hub",     path: "/p/em/finance"  },
//   { key: "pay",      label: "Payslips",        path: "/p/em/pay"      },
//   { key: "claims",   label: "Reimbursements",  path: "/p/em/claims"   },
//   { key: "tax",      label: "Tax Declaration", path: "/p/em/tax"      },
//   { key: "perf",     label: "Performance",     path: "/p/em/perf"     },
//   { key: "gear",     label: "Assets",          path: "/p/em/gear"     },
//   { key: "docs",     label: "Documents",       path: "/p/em/docs"     },
//   { key: "policy",   label: "Policy Vault",    path: "/p/em/policy"   },
//   { key: "support",  label: "Help & Support",  path: "/p/em/support"  },
//   { key: "alerts",   label: "Notifications",   path: "/p/em/alerts"   },
//   { key: "offboard", label: "Exit Portal",     path: "/p/em/offboard" },
//   { key: "status",   label: "Exit Status",     path: "/p/em/status"   },
// ];

// // ══════════════════════════════════════════════════════════════════════════════
// //  ADMIN  →  /p/ad/*
// // ══════════════════════════════════════════════════════════════════════════════
// export const ADM_NAV = [
//   { key: "home",        label: "Dashboard",         path: "/p/ad/home"        },
//   { key: "team",        label: "Manage Employees",  path: "/p/ad/team"        },
//   { key: "onboard",     label: "Add Employee",      path: "/p/ad/onboard"     },
//   { key: "time",        label: "Attendance",        path: "/p/ad/time"        },
//   { key: "leave",       label: "Leave Management",  path: "/p/ad/leave"       },
//   { key: "payroll",     label: "Payroll",           path: "/p/ad/payroll"     },
//   { key: "finance",     label: "Finance Hub",       path: "/p/ad/finance"     },
//   { key: "finview",     label: "Finance Overview",  path: "/p/ad/finview"     },
//   { key: "manual",      label: "Manual Entry",      path: "/p/ad/manual"      },
//   { key: "autopayroll", label: "Auto Payroll",      path: "/p/ad/autopayroll" }, // ✅ NEW
//   { key: "perf",        label: "Performance",       path: "/p/ad/perf"        },
//   { key: "gear",        label: "Assets",            path: "/p/ad/gear"        },
//   { key: "org",         label: "Org Hierarchy",     path: "/p/ad/org"         },
//   { key: "docs",        label: "Documents",         path: "/p/ad/docs"        },
//   { key: "alerts",      label: "Notifications",     path: "/p/ad/alerts"      },
//   { key: "support",     label: "Support",           path: "/p/ad/support"     },
//   { key: "mgmt",        label: "Management",        path: "/p/ad/mgmt"        },
//   { key: "company",     label: "Company",           path: "/p/ad/company"     },
// ];

// // ══════════════════════════════════════════════════════════════════════════════
// //  SUPER ADMIN  →  /p/sa/*
// // ══════════════════════════════════════════════════════════════════════════════
// export const SA_NAV = [
//   { key: "home",    label: "Dashboard",     path: "/p/sa/home"    },
//   { key: "team",    label: "Employees",     path: "/p/sa/team"    },
//   { key: "admins",  label: "Manage Admins", path: "/p/sa/admins"  },
//   { key: "onboard", label: "Add Employee",  path: "/p/sa/onboard" },
//   { key: "finance", label: "Finance",       path: "/p/sa/finance" },
//   { key: "time",    label: "Attendance",    path: "/p/sa/time"    },
//   { key: "docs",    label: "Documents",     path: "/p/sa/docs"    },
//   { key: "support", label: "Support",       path: "/p/sa/support" },
// ];

// // ══════════════════════════════════════════════════════════════════════════════
// //  GLOBAL ADMIN  →  /p/ga/*
// // ══════════════════════════════════════════════════════════════════════════════
// export const GA_NAV = [
//   { key: "home",     label: "Dashboard",       path: "/p/ga/home"     },
//   { key: "org",      label: "Companies",       path: "/p/ga/org"      },
//   { key: "billing",  label: "Subscriptions",   path: "/p/ga/billing"  },
//   { key: "users",    label: "Users & Roles",   path: "/p/ga/users"    },
//   { key: "reports",  label: "Reports",         path: "/p/ga/reports"  },
//   { key: "paysetup", label: "Salary Setup",    path: "/p/ga/paysetup" },
//   { key: "security", label: "Security",        path: "/p/ga/security" },
//   { key: "tickets",  label: "Support Tickets", path: "/p/ga/tickets"  },
//   { key: "audit",    label: "Audit Logs",      path: "/p/ga/audit"    },
//   { key: "config",   label: "Settings",        path: "/p/ga/config"   },
// ];

// ─────────────────────────────────────────────────────────────────────────────
//  src/app/navRoutes.jsx
//  UPDATED — added hrdocs for Admin, updated docs label for SuperAdmin
//
//  YOUR KEY FORMAT: short keys WITHOUT role prefix
//  e.g.  key:"docs"  key:"hrdocs"  key:"team"
//
//  Your Sidebar component calls: navigateTo("ad_" + item.key)
//  So key:"hrdocs" → navigateTo("ad_hrdocs") → PAGE_REGISTRY["ad_hrdocs"]
// ─────────────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════════════
//  EMPLOYEE  — UNCHANGED from your original
// ══════════════════════════════════════════════════════════════════════════════
export const EMP_NAV = [
  { key: "home",     label: "My Dashboard",   path: "/p/em/home"     },
  { key: "time",     label: "Attendance",      path: "/p/em/time"     },
  { key: "leave",    label: "Leave",           path: "/p/em/leave"    },
  { key: "finance",  label: "Finance Hub",     path: "/p/em/finance"  },
  { key: "pay",      label: "Payslips",        path: "/p/em/pay"      },
  { key: "claims",   label: "Reimbursements",  path: "/p/em/claims"   },
  { key: "tax",      label: "Tax Declaration", path: "/p/em/tax"      },
  { key: "perf",     label: "Performance",     path: "/p/em/perf"     },
  { key: "gear",     label: "Assets",          path: "/p/em/gear"     },
  { key: "docs",     label: "Documents",       path: "/p/em/docs"     },
  { key: "policy",   label: "Policy Vault",    path: "/p/em/policy"   },
  { key: "support",  label: "Help & Support",  path: "/p/em/support"  },
  { key: "alerts",   label: "Notifications",   path: "/p/em/alerts"   },
  { key: "offboard", label: "Exit Portal",     path: "/p/em/offboard" },
  { key: "status",   label: "Exit Status",     path: "/p/em/status"   },
];

// ══════════════════════════════════════════════════════════════════════════════
//  ADMIN  — added "hrdocs" entry, everything else UNCHANGED
// ══════════════════════════════════════════════════════════════════════════════
export const ADM_NAV = [
  { key: "home",        label: "Dashboard",          path: "/p/ad/home"        },
  { key: "team",        label: "Manage Employees",   path: "/p/ad/team"        },
  { key: "onboard",     label: "Add Employee",       path: "/p/ad/onboard"     },
  { key: "time",        label: "Attendance",         path: "/p/ad/time"        },
  { key: "leave",       label: "Leave Management",   path: "/p/ad/leave"       },
  { key: "payroll",     label: "Payroll",            path: "/p/ad/payroll"     },
  { key: "finance",     label: "Finance Hub",        path: "/p/ad/finance"     },
  { key: "finview",     label: "Finance Overview",   path: "/p/ad/finview"     },
  { key: "manual",      label: "Manual Entry",       path: "/p/ad/manual"      },
  { key: "autopayroll", label: "Auto Payroll",       path: "/p/ad/autopayroll" },
  { key: "perf",        label: "Performance",        path: "/p/ad/perf"        },
  { key: "gear",        label: "Assets",             path: "/p/ad/gear"        },
  { key: "org",         label: "Org Hierarchy",      path: "/p/ad/org"         },
  { key: "docs",        label: "Employee Documents", path: "/p/ad/docs"        },  // existing — renamed label for clarity
  { key: "hrdocs",      label: "HR Documents",       path: "/p/ad/hrdocs"      },  // ← NEW ✅
  { key: "policy",      label: "Policy Vault",       path: "/p/ad/policy"      },
  { key: "alerts",      label: "Notifications",      path: "/p/ad/alerts"      },
  { key: "support",     label: "Support",            path: "/p/ad/support"     },
  { key: "mgmt",        label: "Management",         path: "/p/ad/mgmt"        },
  { key: "company",     label: "Company",            path: "/p/ad/company"     },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SUPER ADMIN  — "docs" key unchanged, label updated to "HR Documents"
// ══════════════════════════════════════════════════════════════════════════════
export const SA_NAV = [
  { key: "home",    label: "Dashboard",     path: "/p/sa/home"    },
  { key: "team",    label: "Employees",     path: "/p/sa/team"    },
  { key: "admins",  label: "Manage Admins", path: "/p/sa/admins"  },
  { key: "onboard", label: "Add Employee",  path: "/p/sa/onboard" },
  { key: "finance", label: "Finance",       path: "/p/sa/finance" },
  { key: "time",    label: "Attendance",    path: "/p/sa/time"    },
  { key: "docs",    label: "HR Documents",  path: "/p/sa/docs"    },  // ← label updated ✅, key same
  { key: "policy",  label: "Policy Vault",  path: "/p/sa/policy"  },
  { key: "support", label: "Support",       path: "/p/sa/support" },
];

// ══════════════════════════════════════════════════════════════════════════════
//  GLOBAL ADMIN  — UNCHANGED from your original
// ══════════════════════════════════════════════════════════════════════════════
export const GA_NAV = [
  { key: "home",     label: "Dashboard",       path: "/p/ga/home"     },
  { key: "org",      label: "Companies",       path: "/p/ga/org"      },
  { key: "billing",  label: "Subscriptions",   path: "/p/ga/billing"  },
  { key: "users",    label: "Users & Roles",   path: "/p/ga/users"    },
  { key: "reports",  label: "Reports",         path: "/p/ga/reports"  },
  { key: "paysetup", label: "Salary Setup",    path: "/p/ga/paysetup" },
  { key: "security", label: "Security",        path: "/p/ga/security" },
  { key: "tickets",  label: "Support Tickets", path: "/p/ga/tickets"  },
  { key: "audit",    label: "Audit Logs",      path: "/p/ga/audit"    },
  { key: "config",   label: "Settings",        path: "/p/ga/config"   },
];