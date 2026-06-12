// export const EMP_NAV = [
//   { key: "home",     label: "My Control Room",   path: "/p/em/home"     },
//   { key: "time",     label: "Presence",      path: "/p/em/time"     },
//   { key: "leave",    label: "Time Away",           path: "/p/em/leave"    },
//   { key: "finance",  label: "Money Desk",     path: "/p/em/finance"  },
//   { key: "pay",      label: "Pay Statements",        path: "/p/em/pay"      },
//   { key: "claims",   label: "ClaimsDesk",  path: "/p/em/claims"   },
//   { key: "tax",      label: "Tax Desk", path: "/p/em/tax"      },
//   { key: "perf",     label: "Momentum",     path: "/p/em/perf"     },
//   { key: "gear",     label: "Equipment",          path: "/p/em/gear"     },
//   { key: "docs",     label: "Vault",       path: "/p/em/docs"     },
//   { key: "policy",   label: "Playbook Vault",    path: "/p/em/policy"   },
//   { key: "support",  label: "Care Desk",  path: "/p/em/support"  },
//   { key: "alerts",   label: "Signals",   path: "/p/em/alerts"   },
//   { key: "offboard", label: "Exit Portal",     path: "/p/em/offboard" },
//   { key: "status",   label: "Exit Status",     path: "/p/em/status"   },
// ];

// // ══════════════════════════════════════════════════════════════════════════════
// //  ADMIN  →  /p/ad/*
// // ══════════════════════════════════════════════════════════════════════════════
// export const ADM_NAV = [
//   { key: "home",        label: "Control Room",         path: "/p/ad/home"        },
//   { key: "team",        label: "People Grid",  path: "/p/ad/team"        },
//   { key: "onboard",     label: "Add Person",      path: "/p/ad/onboard"     },
//   { key: "time",        label: "Presence",        path: "/p/ad/time"        },
//   { key: "leave",       label: "Time Away Flow",  path: "/p/ad/leave"       },
//   { key: "payroll",     label: "Payouts",           path: "/p/ad/payroll"     },
//   { key: "finance",     label: "Money Desk",       path: "/p/ad/finance"     },
//   { key: "finview",     label: "Money Desk Overview",  path: "/p/ad/finview"     },
//   { key: "manual",      label: "Direct Entry",      path: "/p/ad/manual"      },
//   { key: "autopayroll", label: "Auto Payouts",      path: "/p/ad/autopayroll" }, // ✅ NEW
//   { key: "perf",        label: "Momentum",       path: "/p/ad/perf"        },
//   { key: "gear",        label: "Equipment",            path: "/p/ad/gear"        },
//   { key: "org",         label: "People Map",     path: "/p/ad/org"         },
//   { key: "docs",        label: "Vault",         path: "/p/ad/docs"        },
//   { key: "alerts",      label: "Signals",     path: "/p/ad/alerts"      },
//   { key: "support",     label: "Care Desk",           path: "/p/ad/support"     },
//   { key: "mgmt",        label: "Operations",        path: "/p/ad/mgmt"        },
//   { key: "company",     label: "Workspace",           path: "/p/ad/company"     },
// ];

// // ══════════════════════════════════════════════════════════════════════════════
// //  SUPER ADMIN  →  /p/sa/*
// // ══════════════════════════════════════════════════════════════════════════════
// export const SA_NAV = [
//   { key: "home",    label: "Control Room",     path: "/p/sa/home"    },
//   { key: "team",    label: "Persons",     path: "/p/sa/team"    },
//   { key: "admins",  label: "Manage Operators", path: "/p/sa/admins"  },
//   { key: "onboard", label: "Add Person",  path: "/p/sa/onboard" },
//   { key: "finance", label: "Money Desk",       path: "/p/sa/finance" },
//   { key: "time",    label: "Presence",    path: "/p/sa/time"    },
//   { key: "docs",    label: "Vault",     path: "/p/sa/docs"    },
//   { key: "support", label: "Care Desk",       path: "/p/sa/support" },
// ];

// // ══════════════════════════════════════════════════════════════════════════════
// //  GLOBAL ADMIN  →  /p/ga/*
// // ══════════════════════════════════════════════════════════════════════════════
// export const GA_NAV = [
//   { key: "home",     label: "Control Room",       path: "/p/ga/home"     },
//   { key: "org",      label: "Workspaces",       path: "/p/ga/org"      },
//   { key: "billing",  label: "Plans",   path: "/p/ga/billing"  },
//   { key: "users",    label: "Access Matrix",   path: "/p/ga/users"    },
//   { key: "reports",  label: "Signal Reports",         path: "/p/ga/reports"  },
//   { key: "paysetup", label: "Pay Setup",    path: "/p/ga/paysetup" },
//   { key: "security", label: "Trust",        path: "/p/ga/security" },
//   { key: "tickets",  label: "Care Requests", path: "/p/ga/tickets"  },
//   { key: "audit",    label: "Activity Trail",      path: "/p/ga/audit"    },
//   { key: "config",   label: "Configuration",        path: "/p/ga/config"   },
// ];

// ─────────────────────────────────────────────────────────────────────────────
//  src/app/navRoutes.jsx
//  UPDATED — added hrdocs for Operator, updated docs label for SuperOperator
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
  { key: "home",     label: "My Control Room",   path: "/p/em/home"     },
  { key: "time",     label: "Presence",      path: "/p/em/time"     },
  { key: "leave",    label: "Time Away",           path: "/p/em/leave"    },
  { key: "finance",  label: "Money Desk",     path: "/p/em/finance"  },
  { key: "pay",      label: "Pay Statements",        path: "/p/em/pay"      },
  { key: "claims",   label: "ClaimsDesk",  path: "/p/em/claims"   },
  { key: "tax",      label: "Tax Desk", path: "/p/em/tax"      },
  { key: "perf",     label: "Momentum",     path: "/p/em/perf"     },
  { key: "gear",     label: "Equipment",          path: "/p/em/gear"     },
  { key: "docs",     label: "Vault",       path: "/p/em/docs"     },
  { key: "policy",   label: "Playbook Vault",    path: "/p/em/policy"   },
  { key: "support",  label: "Care Desk",  path: "/p/em/support"  },
  { key: "alerts",   label: "Signals",   path: "/p/em/alerts"   },
  { key: "offboard", label: "Exit Portal",     path: "/p/em/offboard" },
  { key: "status",   label: "Exit Status",     path: "/p/em/status"   },
];

// ══════════════════════════════════════════════════════════════════════════════
//  ADMIN  — added "hrdocs" entry, everything else UNCHANGED
// ══════════════════════════════════════════════════════════════════════════════
export const ADM_NAV = [
  { key: "home",        label: "Control Room",          path: "/p/ad/home"        },
  { key: "team",        label: "People Grid",   path: "/p/ad/team"        },
  { key: "onboard",     label: "Add Person",       path: "/p/ad/onboard"     },
  { key: "time",        label: "Presence",         path: "/p/ad/time"        },
  { key: "leave",       label: "Time Away Flow",   path: "/p/ad/leave"       },
  { key: "payroll",     label: "Payouts",            path: "/p/ad/payroll"     },
  { key: "finance",     label: "Money Desk",        path: "/p/ad/finance"     },
  { key: "finview",     label: "Money Desk Overview",   path: "/p/ad/finview"     },
  { key: "manual",      label: "Direct Entry",       path: "/p/ad/manual"      },
  { key: "autopayroll", label: "Auto Payouts",       path: "/p/ad/autopayroll" },
  { key: "perf",        label: "Momentum",        path: "/p/ad/perf"        },
  { key: "gear",        label: "Equipment",             path: "/p/ad/gear"        },
  { key: "org",         label: "People Map",      path: "/p/ad/org"         },
  { key: "docs",        label: "People Vault", path: "/p/ad/docs"        },  // existing — renamed label for clarity
  { key: "hrdocs",      label: "People Vault",       path: "/p/ad/hrdocs"      },  // ← NEW ✅
  { key: "policy",      label: "Playbook Vault",       path: "/p/ad/policy"      },
  { key: "alerts",      label: "Signals",      path: "/p/ad/alerts"      },
  { key: "support",     label: "Care Desk",            path: "/p/ad/support"     },
  { key: "mgmt",        label: "Operations",         path: "/p/ad/mgmt"        },
  { key: "company",     label: "Workspace",            path: "/p/ad/company"     },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SUPER ADMIN  — "docs" key unchanged, label updated to "People Vault"
// ══════════════════════════════════════════════════════════════════════════════
export const SA_NAV = [
  { key: "home",    label: "Control Room",     path: "/p/sa/home"    },
  { key: "team",    label: "Persons",     path: "/p/sa/team"    },
  { key: "admins",  label: "Manage Operators", path: "/p/sa/admins"  },
  { key: "onboard", label: "Add Person",  path: "/p/sa/onboard" },
  { key: "finance", label: "Money Desk",       path: "/p/sa/finance" },
  { key: "time",    label: "Presence",    path: "/p/sa/time"    },
  { key: "docs",    label: "People Vault",  path: "/p/sa/docs"    },  // ← label updated ✅, key same
  { key: "policy",  label: "Playbook Vault",  path: "/p/sa/policy"  },
  { key: "support", label: "Care Desk",       path: "/p/sa/support" },
];

// ══════════════════════════════════════════════════════════════════════════════
//  GLOBAL ADMIN  — UNCHANGED from your original
// ══════════════════════════════════════════════════════════════════════════════
export const GA_NAV = [
  { key: "home",     label: "Control Room",       path: "/p/ga/home"     },
  { key: "org",      label: "Workspaces",       path: "/p/ga/org"      },
  { key: "billing",  label: "Plans",   path: "/p/ga/billing"  },
  { key: "users",    label: "Access Matrix",   path: "/p/ga/users"    },
  { key: "reports",  label: "Signal Reports",         path: "/p/ga/reports"  },
  { key: "paysetup", label: "Pay Setup",    path: "/p/ga/paysetup" },
  { key: "security", label: "Trust",        path: "/p/ga/security" },
  { key: "tickets",  label: "Care Requests", path: "/p/ga/tickets"  },
  { key: "audit",    label: "Activity Trail",      path: "/p/ga/audit"    },
  { key: "config",   label: "Configuration",        path: "/p/ga/config"   },
];