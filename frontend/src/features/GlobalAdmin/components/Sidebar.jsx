import React, { useState } from "react";
import {
  LayoutDashboard, Building2, CreditCard, UserCog, BarChart3,
  Lock, Headphones, FileText, Settings, ChevronLeft, ChevronRight, Receipt,
} from "lucide-react";

/* CrewSync sidebar icon (square mark) */
function CrewSyncIcon({ size = 44 }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 12,
        background: "linear-gradient(135deg,#8B5CF6,#FBBF24)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: Math.round(size * 0.38), fontWeight: 900,
        flexShrink: 0, fontFamily: "'Sora',sans-serif",
        boxShadow: "0 6px 16px rgba(139,92,246,.3)",
      }}>S</div>
    );
  }
  return (
    <img src="/crewsync-mark.svg" alt="CrewSync"
      onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: 12, objectFit: "contain", flexShrink: 0,
        boxShadow: "0 4px 14px rgba(0,0,0,.12)" }}
    />
  );
}

const T = {
  coral:  "#8B5CF6",
  navy:   "#0B1020",
  purple: "#A855F7",
  border: "#E8ECF2",
  soft:   "#64748B",
};

const NAV_SECTIONS = [
  {
    label: "Platform",
    items: [
      { key: "ga_home",     label: "Control Room",            Icon: LayoutDashboard },
      { key: "ga_org",      label: "Workspaces",            Icon: Building2       },
      { key: "ga_billing",  label: "Plans",        Icon: CreditCard      },
      { key: "ga_users",    label: "Access Matrix",      Icon: UserCog         },
    ],
  },
  {
    label: "Insights",
    items: [
      { key: "ga_reports",  label: "Signals",            Icon: BarChart3       },
      { key: "ga_paysetup", label: "PayStatement Setup", Icon: Receipt         },
      { key: "ga_audit",    label: "System Trail",          Icon: FileText        },
    ],
  },
  {
    label: "Trust & Config",
    items: [
      { key: "ga_security", label: "Trust",             Icon: Lock            },
      { key: "ga_tickets",  label: "Care Desk",              Icon: Headphones      },
      { key: "ga_config",   label: "Settings",             Icon: Settings        },
    ],
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.gasb * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.gasb .fd { font-family:'Sora',sans-serif; }

.gasb-link {
  display:flex; align-items:center; gap:10px; padding:10px 12px;
  border-radius:14px; color:#64748B; font-size:13px; font-weight:600;
  transition:all .18s ease; position:relative;
  border:1px solid transparent; cursor:pointer; background:transparent;
  width:100%; text-align:left;
}
.gasb-link:hover {
  background:linear-gradient(135deg,rgba(139,92,246,.08),rgba(124,58,237,.04));
  color:${T.coral}; border-color:rgba(139,92,246,.10); transform:translateX(2px);
}
.gasb-link.active {
  background:linear-gradient(135deg,rgba(139,92,246,.14),rgba(124,58,237,.06));
  color:${T.navy}; font-weight:800; border-color:rgba(139,92,246,.14);
  box-shadow:inset 3px 0 0 ${T.coral},0 8px 18px rgba(139,92,246,.08);
}
.gasb-link.active .gasb-icon-wrap {
  background:linear-gradient(135deg,${T.coral},#FBBF24);
  color:#fff; box-shadow:0 6px 14px rgba(139,92,246,.25);
}
.gasb-link.collapsed-link { justify-content:center; padding:11px 0; gap:0; }

.gasb-icon-wrap {
  width:30px; height:30px; border-radius:10px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  transition:all .18s ease; background:rgba(100,116,139,.10); color:inherit;
}
.gasb-link:hover .gasb-icon-wrap { background:rgba(139,92,246,.10); color:${T.coral}; }

.gasb-section-label {
  font-size:9px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
  color:#94A3B8; padding:8px 12px 6px; display:block;
}

.gasb-collapse-btn {
  position:absolute; top:50%; transform:translateY(-50%); right:-11px; z-index:10;
  width:24px; height:24px; border-radius:999px;
  background:linear-gradient(135deg,${T.coral},#FBBF24);
  color:#fff; border:2.5px solid #fff;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; box-shadow:0 4px 12px rgba(139,92,246,.30); transition:all .18s ease;
}
.gasb-collapse-btn:hover { transform:translateY(-50%) scale(1.05); }
`;

export default function Sidebar({ currentPage, navigateTo }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="gasb" style={{
      position:"sticky", top:0, height:"100vh",
      width: collapsed ? 72 : 260,
      background:"#fff",
      borderRight:`1.5px solid ${T.border}`,
      display:"flex", flexDirection:"column",
      transition:"width .25s cubic-bezier(.4,0,.2,1)",
      flexShrink:0, zIndex:40,
      boxShadow:"4px 0 22px rgba(13,31,45,.06)",
      overflow:"hidden",
    }}>
      <style>{CSS}</style>

      {/* LOGO */}
      <div style={{
        padding: collapsed ? "18px 0" : "18px 16px 14px",
        borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", gap:10,
        justifyContent: collapsed ? "center" : "flex-start",
        flexShrink:0,
        background:"linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(250,251,253,1) 100%)",
      }}>
        {collapsed ? (
          <CrewSyncIcon size={40} />
        ) : (
          <img src="/crewsync-logo.svg" alt="CrewSync"
            style={{ height: 44, maxWidth: 180, objectFit: "contain", objectPosition: "left", flexShrink: 0 }} />
        )}
      </div>

      {/* COLLAPSE TOGGLE */}
      <div style={{ position:"relative", height:0, flexShrink:0 }}>
        <button className="gasb-collapse-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand" : "Collapse"}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* NAV */}
      <nav style={{ flex:1, overflowY:"auto", padding:"12px 8px 8px", display:"flex", flexDirection:"column", gap:2, scrollbarWidth:"none" }}>
        <style>{`.gasb nav::-webkit-scrollbar{display:none}`}</style>
        {NAV_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom:6 }}>
            {!collapsed && <span className="gasb-section-label">{section.label}</span>}
            {section.items.map(({ key, label, Icon }) => {
              const active = currentPage === key;
              return (
                <button key={key} onClick={() => navigateTo(key)} title={collapsed ? label : undefined}
                  className={`gasb-link${active ? " active" : ""}${collapsed ? " collapsed-link" : ""}`}>
                  <span className="gasb-icon-wrap"><Icon size={15} strokeWidth={active ? 2.2 : 1.8} /></span>
                  {!collapsed && <span style={{ flex:1 }}>{label}</span>}
                  {!collapsed && active && (
                    <span style={{ width:6, height:6, borderRadius:"50%", background:T.coral, flexShrink:0, boxShadow:"0 0 0 4px rgba(139,92,246,.10)" }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div style={{
        padding: collapsed ? "12px 8px" : "10px 12px 14px",
        borderTop: `1px solid ${T.border}`,
        flexShrink: 0,
        background: "rgba(250,251,253,.8)",
      }}>
        {/* Live status pill */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: collapsed ? 0 : 8,
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "8px 0" : "8px 10px",
          borderRadius: 12,
          background: collapsed ? "transparent" : "linear-gradient(135deg,rgba(16,185,129,.08),rgba(16,185,129,.03))",
          border: collapsed ? "none" : "1px solid rgba(16,185,129,.18)",
          marginBottom: collapsed ? 0 : 8,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#10b981",
            flexShrink: 0, display: "inline-block",
            animation: "gasb-pulse 2s ease-in-out infinite",
          }} />
          {!collapsed && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", whiteSpace: "nowrap" }}>
              All Systems <span style={{ color: "#10b981" }}>Online</span>
            </span>
          )}
        </div>

        {/* Version */}
        {!collapsed && (
          <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, margin: 0, textAlign: "center", letterSpacing: ".04em" }}>
            v2.0.1 · © {new Date().getFullYear()} CrewSync
          </p>
        )}

        <style>{`@keyframes gasb-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.6)} }`}</style>
      </div>
    </aside>
  );
}