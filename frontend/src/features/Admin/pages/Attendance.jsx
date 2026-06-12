// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import axios from "axios";
// import TimeAwayOperations from "./TimeAwayOperations";
// import { API_BASE_URL } from "@/lib/apiClient";

// // CrewSync design tokens
// const C = {
//   coral:    "#8B5CF6",
//   teal:     "#06B6D4",
//   navy:     "#0B1020",
//   navy2:    "#182033",
//   slate:    "#374151",
//   muted:    "#64748b",
//   border:   "#E8EDF3",
//   bg:       "#F4F6F9",
//   white:    "#FFFFFF",
//   green:    "#10b981",
//   amber:    "#f59e0b",
//   red:      "#ef4444",
//   indigo:   "#6366f1",
//   purple:   "#8b5cf6",
// };

// // ─────────────────────────────────────────────
// //  TINY HELPERS
// // ─────────────────────────────────────────────
// const fmtDate = (iso) => {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   return isNaN(d) ? "—" : d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
// };
// const fmtTime = (iso) => {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   return isNaN(d) ? "—" : d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
// };
// const pad = (n) => String(n).padStart(2, "0");
// const secsToHM = (s) => `${pad(Math.floor((s||0)/3600))}h ${pad(Math.floor(((s||0)%3600)/60))}m`;
// const today = () => new Date().toISOString().slice(0,10);

// // ─────────────────────────────────────────────
// //  MINI COMPONENTS
// // ─────────────────────────────────────────────
// const Ic = ({ d, size=16, sw=1.8, color="currentColor" }) => (
//   <svg width={size} height={size} fill="none" stroke={color}
//     strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//     {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
//   </svg>
// );

// const Badge = ({ label, color="#64748b", bg="#f1f5f9" }) => (
//   <span style={{ display:"inline-flex",alignItems:"center",gap:4,
//     fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:".06em",
//     color, background:bg, padding:"3px 9px", borderRadius:999, whiteSpace:"nowrap" }}>
//     {label}
//   </span>
// );

// const statusBadge = (status="") => {
//   const s = String(status).toLowerCase();
//   if (s.includes("present")||s.includes("working")) return <Badge label="Present" color={C.teal} bg="rgba(6,182,212,.12)"/>;
//   if (s.includes("absent"))   return <Badge label="Absent"  color={C.red}   bg="rgba(239,68,68,.1)"/>;
//   if (s.includes("leave"))    return <Badge label="TimeAway"   color={C.amber} bg="rgba(245,158,11,.12)"/>;
//   if (s.includes("break"))    return <Badge label="On Break" color={C.indigo} bg="rgba(99,102,241,.1)"/>;
//   if (s.includes("late"))     return <Badge label="Late"    color={C.coral} bg="rgba(139,92,246,.1)"/>;
//   if (s.includes("half"))     return <Badge label="Half Day" color={C.purple} bg="rgba(139,92,246,.1)"/>;
//   return <Badge label={status||"—"}/>;
// };

// // Thin bar chart (SVG, no external deps)
// const MiniBarChart = ({ data, height=80 }) => {
//   if (!data?.length) return null;
//   const max = Math.max(...data.map(d=>d.value), 1);
//   const w = 100 / data.length;
//   return (
//     <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none"
//       style={{ width:"100%", height, display:"block" }}>
//       {data.map((d, i) => {
//         const bh = (d.value / max) * (height - 20);
//         return (
//           <g key={i}>
//             <rect x={i*w + w*.15} y={height-bh-10} width={w*.7} height={bh}
//               rx={2} fill={d.color||C.teal} opacity={.85}/>
//             <text x={i*w+w/2} y={height-2} textAnchor="middle"
//               fontSize={5.5} fill={C.muted} fontFamily="DM Sans,sans-serif">{d.label}</text>
//           </g>
//         );
//       })}
//     </svg>
//   );
// };

// // Donut chart
// const Donut = ({ segments, size=88, stroke=14, label, sublabel }) => {
//   const r = (size - stroke) / 2;
//   const circ = 2 * Math.PI * r;
//   let offset = 0;
//   const total = segments.reduce((a,s)=>a+s.value,0)||1;
//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//       <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
//       {segments.map((seg,i) => {
//         const dash = (seg.value/total)*circ;
//         const gap  = circ - dash;
//         const el = (
//           <circle key={i} cx={size/2} cy={size/2} r={r}
//             fill="none" stroke={seg.color} strokeWidth={stroke}
//             strokeDasharray={`${dash} ${gap}`}
//             strokeDashoffset={-offset}
//             strokeLinecap="round"
//             style={{ transform:`rotate(-90deg)`, transformOrigin:"50% 50%", transition:"stroke-dasharray .6s ease" }}/>
//         );
//         offset += dash;
//         return el;
//       })}
//       <text x={size/2} y={size/2-4} textAnchor="middle"
//         fontSize={14} fontWeight={900} fill={C.navy} fontFamily="Sora,sans-serif">{label}</text>
//       <text x={size/2} y={size/2+11} textAnchor="middle"
//         fontSize={7} fill={C.muted} fontFamily="DM Sans,sans-serif">{sublabel}</text>
//     </svg>
//   );
// };

// // Trend sparkline
// const Sparkline = ({ data=[], color=C.teal, height=36 }) => {
//   if (data.length < 2) return null;
//   const max = Math.max(...data,1);
//   const min = Math.min(...data,0);
//   const range = max-min||1;
//   const pts = data.map((v,i) => {
//     const x = (i/(data.length-1))*100;
//     const y = height - ((v-min)/range)*(height-6) - 3;
//     return `${x},${y}`;
//   }).join(" ");
//   return (
//     <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none"
//       style={{ width:"100%", height, display:"block" }}>
//       <defs>
//         <linearGradient id={`sg${color.replace("#","")}`} x1="0" x2="0" y1="0" y2="1">
//           <stop offset="0%" stopColor={color} stopOpacity=".3"/>
//           <stop offset="100%" stopColor={color} stopOpacity="0"/>
//         </linearGradient>
//       </defs>
//       <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
//     </svg>
//   );
// };

// // Progress bar
// const ProgressBar = ({ pct, color=C.teal, height=6 }) => (
//   <div style={{ width:"100%", height, background:C.border, borderRadius:999, overflow:"hidden" }}>
//     <div style={{ width:`${Math.min(pct,100)}%`, height:"100%", background:color,
//       borderRadius:999, transition:"width .6s ease" }}/>
//   </div>
// );

// // ─────────────────────────────────────────────
// //  CSV / PDF EXPORT HELPERS
// // ─────────────────────────────────────────────
// const downloadCSV = (rows, filename) => {
//   if (!rows?.length) return;
//   const headers = Object.keys(rows[0]);
//   const csv = [
//     headers.join(","),
//     ...rows.map(r => headers.map(h => `"${String(r[h]??"").replace(/"/g,'""')}"`).join(","))
//   ].join("\n");
//   const blob = new Blob([csv], { type:"text/csv" });
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(blob);
//   a.download = filename;
//   a.click();
// };

// const downloadPDF = (title, rows, filename) => {
//   const headers = rows?.length ? Object.keys(rows[0]) : [];
//   const tRows = (rows||[]).map(r =>
//     `<tr>${headers.map(h=>`<td>${r[h]??""}</td>`).join("")}</tr>`
//   ).join("");
//   const html = `
//     <html><head><meta charset="utf-8">
//     <style>
//       body{font-family:'Segoe UI',sans-serif;padding:32px;color:#0B1020;}
//       h1{font-size:22px;font-weight:900;color:#0B1020;border-bottom:3px solid #8B5CF6;padding-bottom:10px;margin-bottom:20px;}
//       .meta{font-size:11px;color:#64748b;margin-bottom:24px;}
//       table{width:100%;border-collapse:collapse;font-size:12px;}
//       th{background:#0B1020;color:#fff;padding:9px 12px;text-align:left;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;}
//       td{padding:8px 12px;border-bottom:1px solid #E8EDF3;color:#334155;}
//       tr:nth-child(even) td{background:#F4F6F9;}
//       .footer{margin-top:30px;font-size:10px;color:#94a3b8;text-align:center;}
//     </style></head>
//     <body>
//       <h1>${title}</h1>
//       <div class="meta">Generated: ${new Date().toLocaleString("en-IN")} &nbsp;|&nbsp; Total records: ${rows?.length||0}</div>
//       <table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead>
//       <tbody>${tRows}</tbody></table>
//       <div class="footer">CrewSync Presence Report &copy; ${new Date().getFullYear()}</div>
//     </body></html>`;
//   const blob = new Blob([html], { type:"text/html" });
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(blob);
//   a.download = filename;
//   a.click();
// };

// // ─────────────────────────────────────────────
// //  STYLES
// // ─────────────────────────────────────────────
// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
// .adm-att *{box-sizing:border-box;font-family:'DM Sans',sans-serif;}
// .adm-att{background:${C.bg};min-height:100vh;padding:24px;}
// @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
// @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.7)}}
// @keyframes spin{to{transform:rotate(360deg)}}
// .fade-up{animation:fadeUp .35s ease both;}
// .fade-up2{animation:fadeUp .35s .08s ease both;}
// .fade-up3{animation:fadeUp .35s .16s ease both;}

// /* Stat card */
// .stat-card{
//   background:#fff;border-radius:16px;border:1.5px solid ${C.border};
//   padding:18px 20px;position:relative;overflow:hidden;
//   box-shadow:0 2px 10px rgba(13,31,45,.05);
//   transition:transform .2s,box-shadow .2s;cursor:default;
// }
// .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(13,31,45,.1);}
// .stat-card .accent{
//   position:absolute;top:-20px;right:-20px;width:80px;height:80px;
//   border-radius:50%;opacity:.12;
// }

// /* Main card */
// .main-card{
//   background:#fff;border-radius:18px;border:1.5px solid ${C.border};
//   box-shadow:0 2px 12px rgba(13,31,45,.06);overflow:hidden;
// }

// /* Table */
// .adm-table{width:100%;border-collapse:collapse;}
// .adm-table thead tr{background:${C.bg};}
// .adm-table thead th{
//   padding:11px 16px;text-align:left;font-size:10px;font-weight:800;
//   text-transform:uppercase;letter-spacing:.08em;color:${C.muted};
//   white-space:nowrap;border-bottom:2px solid ${C.border};
// }
// .adm-table tbody tr{border-bottom:1px solid #F0F4F8;transition:background .15s;}
// .adm-table tbody tr:hover{background:#fafcff;}
// .adm-table tbody td{padding:11px 16px;font-size:13px;color:${C.navy};}

// /* Tab pill */
// .tab-pill{
//   display:flex;align-items:center;gap:6px;
//   padding:8px 16px;border-radius:10px;font-size:12px;font-weight:700;
//   cursor:pointer;transition:all .2s;border:1.5px solid ${C.border};
//   background:#fff;color:${C.muted};white-space:nowrap;
// }
// .tab-pill.active{
//   background:${C.navy};color:#fff;border-color:${C.navy};
//   box-shadow:0 4px 14px rgba(13,31,45,.18);
// }
// .tab-pill:hover:not(.active){background:#f8fafc;border-color:#d1d5db;}

// /* Button */
// .btn-coral{
//   display:inline-flex;align-items:center;gap:6px;
//   background:linear-gradient(135deg,${C.coral},#06B6D4);
//   color:#fff;border:none;border-radius:10px;padding:9px 18px;
//   font-size:12px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;
//   transition:all .2s;box-shadow:0 4px 12px rgba(139,92,246,.25);
// }
// .btn-coral:hover{transform:translateY(-1px);filter:brightness(1.05);}
// .btn-coral:disabled{opacity:.55;cursor:not-allowed;transform:none;}
// .btn-ghost{
//   display:inline-flex;align-items:center;gap:6px;
//   background:#fff;color:${C.navy};border:1.5px solid ${C.border};
//   border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;
//   cursor:pointer;transition:all .15s;
// }
// .btn-ghost:hover{background:#f8fafc;border-color:#d1d5db;}
// .btn-green{background:linear-gradient(135deg,${C.green},#34d399);color:#fff;border:none;border-radius:8px;padding:6px 13px;font-size:11px;font-weight:800;cursor:pointer;}
// .btn-red{background:linear-gradient(135deg,${C.red},#f87171);color:#fff;border:none;border-radius:8px;padding:6px 13px;font-size:11px;font-weight:800;cursor:pointer;}
// .btn-amber{background:linear-gradient(135deg,${C.amber},#fbbf24);color:#fff;border:none;border-radius:8px;padding:6px 13px;font-size:11px;font-weight:800;cursor:pointer;}

// /* Input */
// .adm-input{
//   padding:9px 13px;border-radius:10px;border:1.5px solid ${C.border};
//   background:#fff;font-size:12px;outline:none;color:${C.navy};
//   font-family:'DM Sans',sans-serif;transition:border-color .15s;
// }
// .adm-input:focus{border-color:${C.coral};}
// .adm-select{padding:9px 13px;border-radius:10px;border:1.5px solid ${C.border};background:#fff;font-size:12px;color:${C.navy};outline:none;cursor:pointer;font-family:'DM Sans',sans-serif;appearance:none;}

// /* Modal */
// .modal-overlay{position:fixed;inset:0;background:rgba(13,31,45,.55);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;z-index:500;padding:16px;}
// .modal-box{background:#fff;border-radius:20px;width:100%;max-width:520px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 28px 60px rgba(13,31,45,.22);border:1.5px solid ${C.border};}
// .modal-hdr{background:linear-gradient(135deg,${C.navy},${C.navy2});padding:20px 24px;}
// .modal-body{padding:24px;overflow-y:auto;flex:1;}
// .modal-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};display:block;margin-bottom:6px;}

// /* Dept badge */
// .dept-chip{font-size:10px;font-weight:700;color:${C.teal};background:rgba(6,182,212,.1);padding:2px 8px;border-radius:999px;}

// /* Download strip */
// .dl-strip{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}

// /* Scrollbar */
// .adm-att ::-webkit-scrollbar{width:5px;height:5px;}
// .adm-att ::-webkit-scrollbar-track{background:#f1f5f9;}
// .adm-att ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:999px;}
// `;

// // ─────────────────────────────────────────────
// //  MAIN COMPONENT
// // ─────────────────────────────────────────────
// export default function OperatorPresence() {
//   // ── Auth helpers
//   const authH = () => {
//     const t = localStorage.getItem("token");
//     return t ? { Authorization:`Bearer ${t}` } : {};
//   };
//   const tenantCtx = () => {
//     const tc = localStorage.getItem("tenantCode") || "";
//     const ci = localStorage.getItem("companyId")  || "";
//     return { tenantCode:tc, companyId:ci };
//   };
//   const tenantH = () => {
//     const { tenantCode:tc, companyId:ci } = tenantCtx();
//     return { ...(tc?{"X-Tenant-Code":tc}:{}), ...(ci?{"X-Workspace-Id":ci}:{}) };
//   };
//   const tenantP = () => {
//     const { tenantCode:tc, companyId:ci } = tenantCtx();
//     return { ...(tc?{tenantCode:tc}:{}), ...(ci?{companyId:ci}:{}) };
//   };

//   // ── Tabs
//   const TABS = [
//     { id:"dashboard", label:"Overview",   icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
//     { id:"live",      label:"Live View",  icon:"M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
//     { id:"monthly",   label:"Monthly",    icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
//     { id:"trends",    label:"Trends",     icon:"M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
//     { id:"leave",     label:"TimeAways",     icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
//     { id:"timesheet", label:"Timesheets", icon:"M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
//     { id:"assign",    label:"Assign",     icon:"M12 4v16m8-8H4" },
//     { id:"reports",   label:"SignalReports",    icon:"M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" },
//   ];

//   // ── State
//   const [activeTab,  setActiveTab]  = useState("dashboard");
//   const [stats,      setStats]      = useState({});
//   const [employees,  setPersons]  = useState([]);
//   const [timesheets, setTimesheets] = useState([]);
//   const [loading,    setLoading]    = useState({ stats:false, emp:false, ts:false, monthly:false });
//   const [searchQ,    setSearchQ]    = useState("");
//   const [deptFilter, setDeptFilter] = useState("All");
//   const [statusFilter,setStatusFilter] = useState("All");

//   // Monthly state
//   const [monthYear,  setMonthYear]  = useState({ year:new Date().getFullYear(), month:new Date().getMonth()+1 });
//   const [monthlyAll, setMonthlyAll] = useState([]);
//   const [monthlyDept,setMonthlyDept]= useState(null);
//   const [monthlyEmp, setMonthlyEmp] = useState(null);
//   const [monthlyView,setMonthlyView]= useState("all"); // all | dept | employee
//   const [selEmpId,   setSelEmpId]   = useState("");
//   const [payrollData,setPayoutsData]= useState(null);

//   // Person search for Single Person tab
//   const [empSearch,   setEmpSearch]   = useState("");
//   const [showEmpDrop, setShowEmpDrop] = useState(false);
//   const [assignModal, setAssignModal] = useState(null); // employee object
//   const [assignForm,  setAssignForm]  = useState({ status:"Present", startDate:today(), endDate:today(), reason:"" });
//   const [leaveModal,  setTimeAwayModal]  = useState(null);
//   const [leaveForm,   setTimeAwayForm]   = useState({ startDate:today(), endDate:today() });
//   const [saving,      setSaving]      = useState(false);

//   // Calendar
//   const [calMonth, setCalMonth] = useState(new Date().getMonth());
//   const [calYear,  setCalYear]  = useState(new Date().getFullYear());

//   // ── Fetch helpers
//   const load = (key, fn) => {
//     setLoading(p=>({...p,[key]:true}));
//     return fn().finally(()=>setLoading(p=>({...p,[key]:false})));
//   };

//   const fetchStats = useCallback(() => load("stats", async () => {
//     try {
//       const r = await axios.get(`${API_BASE_URL}/api/admin/attendance/dashboard-stats`,
//         { headers:{...authH(),...tenantH()}, params:tenantP() });
//       setStats(r.data?.data ?? r.data ?? {});
//     } catch { setStats({}); }
//   }), []);

//   const fetchPersons = useCallback(() => load("emp", async () => {
//     try {
//       const r = await axios.get(`${API_BASE_URL}/api/admin/attendance/live-employees`,
//         { headers:{...authH(),...tenantH()}, params:tenantP() });
//       const raw = r.data?.data ?? r.data ?? [];
//       const list = Array.isArray(raw) ? raw : Array.isArray(raw.employees) ? raw.employees : [];
//       setPersons(list.map(e=>({
//         id:         e.id??e.employeeId??e.userId??"",
//         name:       e.name??e.fullName??e.employeeName??"",
//         email:      e.email??e.mailId??"",
//         department: e.department??e.dept??"Not Assigned",
//         status:     e.status??e.attendanceStatus??"Unknown",
//         punchIn:    e.punchIn??e.inTime??e.startTime??"-",
//         hours:      e.hours??e.totalHours??"-",
//         breaks:     e.breaks??e.breakCount??"-",
//         workSecs:   e.totalSeconds??e.workSeconds??0,
//       })));
//     } catch { setPersons([]); }
//   }), []);

//   const fetchTimesheets = useCallback(() => load("ts", async () => {
//     try {
//       const r = await axios.get(`${API_BASE_URL}/api/admin/attendance/timesheets`,
//         { headers:{...authH(),...tenantH()}, params:tenantP() });
//       const raw = r.data?.data ?? r.data ?? [];
//       setTimesheets(Array.isArray(raw) ? raw : []);
//     } catch { setTimesheets([]); }
//   }), []);

//   const fetchMonthlyAll = useCallback(() => load("monthly", async () => {
//     const { tenantCode, companyId } = tenantCtx();
//     try {
//       const r = await axios.get(`${API_BASE_URL}/api/attendance/monthly/all`, {
//         headers:{...authH(),...tenantH()},
//         params:{ year:monthYear.year, month:monthYear.month, tenantCode, companyId }
//       });
//       setMonthlyAll(r.data?.data ?? r.data ?? []);
//     } catch { setMonthlyAll([]); }
//   }), [monthYear]);

//   const fetchMonthlyDept = useCallback(() => load("monthly", async () => {
//     const { tenantCode, companyId } = tenantCtx();
//     try {
//       const r = await axios.get(`${API_BASE_URL}/api/attendance/monthly/department`, {
//         headers:{...authH(),...tenantH()},
//         params:{ year:monthYear.year, month:monthYear.month, tenantCode, companyId }
//       });
//       setMonthlyDept(r.data?.data ?? r.data ?? {});
//     } catch { setMonthlyDept(null); }
//   }), [monthYear]);

//   const fetchPayouts = useCallback(async (empId) => {
//     if (!empId) return;
//     const { tenantCode } = tenantCtx();
//     try {
//       const r = await axios.get(`${API_BASE_URL}/api/attendance/payroll/employee/${empId}`, {
//         headers:{...authH(),...tenantH()},
//         params:{ year:monthYear.year, month:monthYear.month, tenantCode }
//       });
//       setPayoutsData(r.data?.data ?? r.data ?? {});
//     } catch { setPayoutsData(null); }
//   }, [monthYear]);

//   useEffect(() => {
//     fetchStats(); fetchPersons(); fetchTimesheets();
//     const id = setInterval(()=>{ fetchStats(); fetchPersons(); }, 30000);
//     return ()=>clearInterval(id);
//   }, []);

//   useEffect(() => {
//     if (activeTab==="monthly") {
//       if (monthlyView==="all")  fetchMonthlyAll();
//       if (monthlyView==="dept") fetchMonthlyDept();
//       if (monthlyView==="employee" && selEmpId) fetchPayouts(selEmpId);
//     }
//   }, [activeTab, monthlyView, monthYear, selEmpId]);

//   // ── Derived
//   const filteredEmps = useMemo(() => employees.filter(e => {
//     const q = searchQ.toLowerCase();
//     const matchQ = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || String(e.id).includes(q);
//     const matchD = deptFilter==="All" || e.department===deptFilter;
//     const matchS = statusFilter==="All" || e.status.toLowerCase().includes(statusFilter.toLowerCase());
//     return matchQ && matchD && matchS;
//   }), [employees, searchQ, deptFilter, statusFilter]);

//   const departments = useMemo(()=>["All",...new Set(employees.map(e=>e.department).filter(Boolean))],[employees]);

//   // Quick stats derived from employees
//   const liveStats = useMemo(()=>({
//     total:    stats.totalPersons ?? employees.length,
//     present:  stats.presentToday   ?? employees.filter(e=>e.status?.toLowerCase().includes("working")||e.status?.toLowerCase().includes("present")).length,
//     absent:   stats.absentToday    ?? employees.filter(e=>e.status?.toLowerCase().includes("absent")).length,
//     onBreak:  stats.onBreak        ?? employees.filter(e=>e.status?.toLowerCase().includes("break")).length,
//     onTimeAway:  stats.onTimeAway        ?? employees.filter(e=>e.status?.toLowerCase().includes("leave")).length,
//     late:     stats.lateToday      ?? employees.filter(e=>e.status?.toLowerCase().includes("late")).length,
//     pending:  stats.pendingRequests ?? 0,
//     working:  stats.workingNow     ?? employees.filter(e=>e.status?.toLowerCase().includes("working")).length,
//   }), [stats, employees]);

//   const presentPct = liveStats.total ? Math.round((liveStats.present/liveStats.total)*100) : 0;

//   // ── Assign attendance
//   const handleAssign = async () => {
//     if (!assignModal) return;
//     setSaving(true);
//     try {
//       await axios.post(`${API_BASE_URL}/api/admin/attendance/apply-manual-attendance/${assignModal.id}`,
//         { leaveType:assignForm.status.toUpperCase().replace(/ /g,"_"),
//           startDate:assignForm.startDate, endDate:assignForm.endDate||assignForm.startDate,
//           reason:assignForm.reason||"Marked manually by admin" },
//         { headers:{"Content-Type":"application/json",...authH(),...tenantH()}, params:tenantP() }
//       );
//       alert("Presence assigned successfully!");
//       setAssignModal(null); fetchPersons(); fetchStats();
//     } catch { alert("Failed to assign attendance"); }
//     setSaving(false);
//   };

//   const handleTimeAway = async () => {
//     if (!leaveModal) return;
//     setSaving(true);
//     try {
//       await axios.post(`${API_BASE_URL}/api/admin/attendance/apply-manual-attendance/${leaveModal.id}`,
//         { leaveType:"LEAVE", startDate:leaveForm.startDate, endDate:leaveForm.endDate||leaveForm.startDate, reason:"TimeAway assigned by admin" },
//         { headers:{"Content-Type":"application/json",...authH(),...tenantH()}, params:tenantP() }
//       );
//       alert("TimeAway assigned!");
//       setTimeAwayModal(null); fetchPersons(); fetchStats();
//     } catch { alert("Failed"); }
//     setSaving(false);
//   };

//   // ── Download helpers
//   const exportLiveCSV = () => {
//     const rows = filteredEmps.map(e=>({
//       ID:e.id, Name:e.name, Email:e.email, Department:e.department,
//       Status:e.status, "Punch In":fmtTime(e.punchIn), "Hours":e.hours
//     }));
//     downloadCSV(rows, `live-attendance-${today()}.csv`);
//   };
//   const exportLivePDF = () => {
//     const rows = filteredEmps.map(e=>({
//       ID:e.id, Name:e.name, Department:e.department,
//       Status:e.status, "Punch In":fmtTime(e.punchIn), Hours:e.hours
//     }));
//     downloadPDF("Live Presence Report", rows, `live-attendance-${today()}.html`);
//   };
//   const exportMonthlyCSV = () => {
//     const rows = (monthlyAll||[]).map(e=>({
//       ID:e.employeeId, Name:e.employeeName, Department:e.department,
//       "Full Days":e.fullDays, "Half Days":e.halfDays, "Absent":e.absentDays,
//       "TimeAway":e.leaveDays, "Work Hours":e.totalWorkHours, "Effective Days":e.effectiveDays
//     }));
//     downloadCSV(rows, `monthly-attendance-${monthYear.year}-${pad(monthYear.month)}.csv`);
//   };
//   const exportMonthlyPDF = () => {
//     const rows = (monthlyAll||[]).map(e=>({
//       ID:e.employeeId, Name:e.employeeName||"—", Department:e.department||"—",
//       "Full Days":e.fullDays??0, "Half Days":e.halfDays??0, "Absent":e.absentDays??0,
//       "TimeAway":e.leaveDays??0, "Work Hours":e.totalWorkHours??0, "Eff. Days":e.effectiveDays??0
//     }));
//     downloadPDF(`Monthly Presence — ${pad(monthYear.month)}/${monthYear.year}`, rows,
//       `monthly-attendance-${monthYear.year}-${pad(monthYear.month)}.html`);
//   };
//   const exportPayoutsCSV = () => {
//     const records = payrollData?.dailyRecords ?? payrollData?.summary?.dailyRecords ?? [];
//     if (!records.length) return;
//     const rows = records.map(r=>({
//       Date:r.date, Day:r.dayOfWeek, Type:r.type,
//       "Work Hours":r.workHours??0, "Effective Value":r.effectiveValue??0
//     }));
//     downloadCSV(rows, `payroll-${selEmpId}-${monthYear.year}-${pad(monthYear.month)}.csv`);
//   };

//   // ─────────────────────────────────────────────
//   //  RENDER: DASHBOARD
//   // ─────────────────────────────────────────────
//   const renderControlRoom = () => {
//     const statCards = [
//       { label:"Total People", val:liveStats.total,   color:C.coral,  bg:"rgba(139,92,246,.1)",  icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
//       { label:"Present Today",   val:liveStats.present, color:C.teal,   bg:"rgba(6,182,212,.1)",   icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", trend:[62,70,65,78,82,75,presentPct] },
//       { label:"Absent Today",    val:liveStats.absent,  color:C.red,    bg:"rgba(239,68,68,.1)",   icon:"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
//       { label:"On TimeAway",        val:liveStats.onTimeAway, color:C.amber,  bg:"rgba(245,158,11,.1)",  icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
//       { label:"On Break",        val:liveStats.onBreak, color:C.indigo, bg:"rgba(99,102,241,.1)",  icon:"M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" },
//       { label:"Late Arrivals",   val:liveStats.late,    color:C.purple, bg:"rgba(139,92,246,.1)",  icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
//       { label:"Working Now",     val:liveStats.working, color:C.teal,   bg:"rgba(6,182,212,.1)",   icon:"M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
//       { label:"Pending Requests",val:liveStats.pending, color:C.coral,  bg:"rgba(139,92,246,.1)",  icon:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
//     ];

//     const deptData = (() => {
//       const map = {};
//       employees.forEach(e=>{ map[e.department]=(map[e.department]||0)+1; });
//       return Object.entries(map).slice(0,8).map(([dept,count],i)=>({
//         label:dept.length>6?dept.slice(0,5)+"…":dept,
//         fullLabel:dept,
//         value:count,
//         color:[C.teal,C.coral,C.amber,C.indigo,C.purple,C.green,"#06b6d4","#ec4899"][i%8]
//       }));
//     })();

//     const statusDist = [
//       { label:"Present",  value:liveStats.present, color:C.teal   },
//       { label:"Absent",   value:liveStats.absent,  color:C.red    },
//       { label:"TimeAway",    value:liveStats.onTimeAway, color:C.amber  },
//       { label:"Break",    value:liveStats.onBreak, color:C.indigo },
//     ];

//     // Hourly activity — simulate punch-in curve based on current hour
//     const nowH = new Date().getHours();
//     const hourlyActivity = Array.from({length:10}, (_,i)=>{
//       const h = 8+i; // 8am to 5pm
//       const base = h<=nowH ? Math.max(0, liveStats.present - Math.abs(h - 10)*Math.floor(liveStats.present*0.15)) : 0;
//       return { hour:`${h>12?h-12:h}${h>=12?"pm":"am"}`, value:Math.max(0,base), active:h===nowH };
//     });

//     // Top performers — employees with most hours
//     const topPerformers = [...employees]
//       .filter(e=>e.hours && e.hours!=="-")
//       .sort((a,b)=>{ const ah=parseFloat(String(a.hours))||0; const bh=parseFloat(String(b.hours))||0; return bh-ah; })
//       .slice(0,5);

//     return (
//       <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
//         {/* Stat cards */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:14 }}>
//           {statCards.map((s,i) => (
//             <div key={i} className="stat-card fade-up" style={{ animationDelay:`${i*.04}s` }}>
//               <div className="accent" style={{ background:s.color }}/>
//               <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10 }}>
//                 <div style={{ width:38,height:38,borderRadius:11,background:s.bg,
//                   display:"flex",alignItems:"center",justifyContent:"center" }}>
//                   <Ic d={s.icon} size={18} sw={1.9} color={s.color}/>
//                 </div>
//                 {s.trend && <Sparkline data={s.trend} color={s.color} height={30}/>}
//               </div>
//               <div style={{ fontFamily:"Sora,sans-serif",fontSize:30,fontWeight:900,color:s.color,lineHeight:1 }}>
//                 {loading.stats ? "—" : s.val}
//               </div>
//               <div style={{ fontSize:11,fontWeight:600,color:C.muted,marginTop:5 }}>{s.label}</div>
//               {s.label==="Present Today" && (
//                 <div style={{ marginTop:8 }}>
//                   <ProgressBar pct={presentPct} color={s.color}/>
//                   <span style={{ fontSize:10,color:C.muted,fontWeight:600 }}>{presentPct}% presence rate</span>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Row 2: Donut + Hourly Activity + Presence Rate */}
//         <div style={{ display:"grid", gridTemplateColumns:"280px 1fr 240px", gap:16 }}>

//           {/* Donut */}
//           <div className="main-card fade-up2" style={{ padding:22 }}>
//             <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:16 }}>Today's Distribution</div>
//             <div style={{ display:"flex",justifyContent:"center",marginBottom:16 }}>
//               <Donut segments={statusDist} size={110} stroke={16} label={liveStats.total} sublabel="total"/>
//             </div>
//             {statusDist.map((s,i)=>(
//               <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9 }}>
//                 <div style={{ display:"flex",alignItems:"center",gap:8 }}>
//                   <div style={{ width:10,height:10,borderRadius:3,background:s.color }}/>
//                   <span style={{ fontSize:12,color:C.muted,fontWeight:600 }}>{s.label}</span>
//                 </div>
//                 <div style={{ display:"flex",alignItems:"center",gap:8 }}>
//                   <ProgressBar pct={liveStats.total?s.value/liveStats.total*100:0} color={s.color} height={4}/>
//                   <span style={{ fontSize:12,fontWeight:900,color:C.navy,fontFamily:"Sora,sans-serif",minWidth:18,textAlign:"right" }}>{s.value}</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Hourly Activity Chart — dynamic */}
//           <div className="main-card fade-up2" style={{ padding:22 }}>
//             <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
//               <div>
//                 <div style={{ fontSize:13,fontWeight:800,color:C.navy }}>Hourly Activity</div>
//                 <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>Punch-in pattern throughout the day</div>
//               </div>
//               <div style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(6,182,212,.1)",border:`1px solid rgba(6,182,212,.25)`,borderRadius:999,padding:"4px 10px" }}>
//                 <span style={{ width:6,height:6,borderRadius:"50%",background:C.teal,display:"block",animation:"pulse 2s infinite" }}/>
//                 <span style={{ fontSize:10,fontWeight:800,color:C.teal }}>Live</span>
//               </div>
//             </div>
//             <svg viewBox="0 0 280 90" style={{ width:"100%",height:90,display:"block" }}>
//               {/* Grid lines */}
//               {[0,30,60,90].map(y=>(
//                 <line key={y} x1={0} y1={y} x2={280} y2={y} stroke={C.border} strokeWidth={0.5}/>
//               ))}
//               {/* Bars */}
//               {hourlyActivity.map((h,i)=>{
//                 const maxV = Math.max(...hourlyActivity.map(x=>x.value),1);
//                 const bh = (h.value/maxV)*72;
//                 const x = i*28;
//                 return (
//                   <g key={i}>
//                     <rect x={x+4} y={80-bh} width={20} height={bh} rx={4}
//                       fill={h.active?C.coral:C.teal} opacity={h.active?1:.65}/>
//                     {h.active && <rect x={x+4} y={80-bh} width={20} height={bh} rx={4}
//                       fill="url(#activeGrad)"/>}
//                     <text x={x+14} y={88} textAnchor="middle" fontSize={6} fill={h.active?C.coral:C.muted}
//                       fontWeight={h.active?800:500} fontFamily="DM Sans,sans-serif">{h.hour}</text>
//                     {h.value>0 && <text x={x+14} y={78-bh} textAnchor="middle" fontSize={6.5} fill={C.navy}
//                       fontWeight={700} fontFamily="Sora,sans-serif">{h.value}</text>}
//                   </g>
//                 );
//               })}
//               <defs>
//                 <linearGradient id="activeGrad" x1="0" x2="0" y1="0" y2="1">
//                   <stop offset="0%" stopColor={C.coral} stopOpacity="1"/>
//                   <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8"/>
//                 </linearGradient>
//               </defs>
//             </svg>
//             <div style={{ display:"flex",gap:16,marginTop:10 }}>
//               <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.muted }}>
//                 <div style={{ width:10,height:10,borderRadius:2,background:C.teal }}/> Historical hours
//               </div>
//               <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.muted }}>
//                 <div style={{ width:10,height:10,borderRadius:2,background:C.coral }}/> Current hour
//               </div>
//             </div>
//           </div>

//           {/* Presence rate compact */}
//           <div className="main-card fade-up2" style={{ padding:22 }}>
//             <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:14 }}>Presence Rate</div>
//             {/* Circular rate gauge */}
//             <div style={{ display:"flex",justifyContent:"center",marginBottom:14 }}>
//               <div style={{ position:"relative",width:100,height:100 }}>
//                 <svg width={100} height={100} viewBox="0 0 100 100">
//                   <circle cx={50} cy={50} r={40} fill="none" stroke={C.border} strokeWidth={10}/>
//                   <circle cx={50} cy={50} r={40} fill="none" stroke={C.coral} strokeWidth={10}
//                     strokeDasharray={`${presentPct*2.513} 251.3`}
//                     strokeDashoffset="62.8"
//                     strokeLinecap="round"
//                     style={{ transform:"rotate(-90deg)",transformOrigin:"50% 50%",transition:"stroke-dasharray .8s ease" }}/>
//                   <text x={50} y={46} textAnchor="middle" fontSize={18} fontWeight={900} fill={C.coral} fontFamily="Sora,sans-serif">{presentPct}%</text>
//                   <text x={50} y={60} textAnchor="middle" fontSize={7} fill={C.muted} fontFamily="DM Sans,sans-serif">present</text>
//                 </svg>
//               </div>
//             </div>
//             {[
//               { label:"Present",  pct:presentPct, color:C.teal, val:liveStats.present  },
//               { label:"Absent",   pct:liveStats.total?Math.round(liveStats.absent/liveStats.total*100):0,   color:C.red,   val:liveStats.absent  },
//               { label:"On TimeAway", pct:liveStats.total?Math.round(liveStats.onTimeAway/liveStats.total*100):0,  color:C.amber, val:liveStats.onTimeAway },
//             ].map((r,i)=>(
//               <div key={i} style={{ marginBottom:10 }}>
//                 <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,fontWeight:600,marginBottom:4 }}>
//                   <span>{r.label}</span>
//                   <span style={{ color:C.navy,fontWeight:800 }}>{r.val} <span style={{ color:C.muted,fontWeight:400 }}>({r.pct}%)</span></span>
//                 </div>
//                 <ProgressBar pct={r.pct} color={r.color}/>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Row 3: Department bar chart + Top Performers */}
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16 }}>

//           {/* Department breakdown — labeled horizontal bars */}
//           <div className="main-card fade-up3" style={{ padding:22 }}>
//             <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:16 }}>Department Headcount</div>
//             {deptData.length===0 ? (
//               <div style={{ padding:24,textAlign:"center",color:C.muted,fontSize:12 }}>No department data</div>
//             ) : deptData.map((d,i)=>{
//               const maxVal = Math.max(...deptData.map(x=>x.value),1);
//               return (
//                 <div key={i} style={{ marginBottom:12 }}>
//                   <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,color:C.navy,marginBottom:5 }}>
//                     <span>{d.fullLabel}</span>
//                     <span style={{ color:d.color,fontFamily:"Sora,sans-serif" }}>{d.value}</span>
//                   </div>
//                   <div style={{ height:10,background:C.border,borderRadius:999,overflow:"hidden" }}>
//                     <div style={{ height:"100%",width:`${(d.value/maxVal)*100}%`,background:d.color,borderRadius:999,transition:"width .8s ease" }}/>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Top performers by hours */}
//           <div className="main-card fade-up3" style={{ padding:22 }}>
//             <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:16 }}>Top Workers Today</div>
//             {topPerformers.length===0 ? (
//               <div style={{ padding:24,textAlign:"center",color:C.muted,fontSize:12 }}>No work hour data yet</div>
//             ) : topPerformers.map((emp,i)=>{
//               const hrs = parseFloat(String(emp.hours))||0;
//               const maxHrs = parseFloat(String(topPerformers[0]?.hours))||1;
//               return (
//                 <div key={emp.id} style={{ display:"flex",alignItems:"center",gap:12,marginBottom:13 }}>
//                   <div style={{ width:24,height:24,borderRadius:6,background:i===0?`linear-gradient(135deg,${C.amber},#fbbf24)`:C.bg,
//                     display:"flex",alignItems:"center",justifyContent:"center",
//                     fontSize:11,fontWeight:900,color:i===0?"#fff":C.muted,flexShrink:0 }}>
//                     {i+1}
//                   </div>
//                   <div style={{ width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${C.coral},#06B6D4)`,
//                     display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:900,flexShrink:0 }}>
//                     {String(emp.name||"?")[0].toUpperCase()}
//                   </div>
//                   <div style={{ flex:1,minWidth:0 }}>
//                     <div style={{ fontSize:12,fontWeight:700,color:C.navy,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{emp.name}</div>
//                     <div style={{ height:5,background:C.border,borderRadius:999,marginTop:4,overflow:"hidden" }}>
//                       <div style={{ height:"100%",width:`${(hrs/maxHrs)*100}%`,background:i===0?C.amber:C.teal,borderRadius:999,transition:"width .8s ease" }}/>
//                     </div>
//                   </div>
//                   <span style={{ fontFamily:"Sora,sans-serif",fontSize:12,fontWeight:900,color:i===0?C.amber:C.teal,flexShrink:0 }}>{emp.hours}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Recent activity strip */}
//         <div className="main-card fade-up3">
//           <div style={{ padding:"16px 22px",borderBottom:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
//             <span style={{ fontSize:13,fontWeight:800,color:C.navy }}>Live Person Activity</span>
//             <button type="button" className="btn-coral" onClick={()=>{ fetchStats(); fetchPersons(); }}>↻ Refresh</button>
//           </div>
//           <div style={{ overflowX:"auto" }}>
//             <table className="adm-table">
//               <thead><tr>
//                 <th>Person</th><th>Department</th><th>Status</th>
//                 <th>Punch In</th><th>Hours</th><th>Actions</th>
//               </tr></thead>
//               <tbody>
//                 {loading.emp ? (
//                   <tr><td colSpan={6} style={{ padding:40,textAlign:"center",color:C.muted }}>Loading…</td></tr>
//                 ) : employees.length===0 ? (
//                   <tr><td colSpan={6} style={{ padding:40,textAlign:"center",color:C.muted,fontSize:13 }}>No employee data. Refresh to load.</td></tr>
//                 ) : employees.slice(0,8).map(e=>(
//                   <tr key={e.id}>
//                     <td>
//                       <div style={{ display:"flex",alignItems:"center",gap:10 }}>
//                         <div style={{ width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.coral},#06B6D4)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:900,flexShrink:0 }}>
//                           {String(e.name||"?")[0].toUpperCase()}
//                         </div>
//                         <div>
//                           <div style={{ fontWeight:700,color:C.navy,fontSize:13 }}>{e.name}</div>
//                           <div style={{ fontSize:10,color:C.muted }}>{e.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td><span className="dept-chip">{e.department}</span></td>
//                     <td>{statusBadge(e.status)}</td>
//                     <td style={{ fontSize:12,color:C.muted }}>{fmtTime(e.punchIn)}</td>
//                     <td style={{ fontFamily:"Sora,sans-serif",fontWeight:800,color:C.navy,fontSize:13 }}>{e.hours}</td>
//                     <td>
//                       <div style={{ display:"flex",gap:6 }}>
//                         <button type="button" className="btn-coral" style={{ padding:"5px 11px",fontSize:11 }} onClick={()=>{ setAssignModal(e); setAssignForm({status:"Present",startDate:today(),endDate:today(),reason:""}); }}>Assign</button>
//                         <button type="button" className="btn-amber" style={{ padding:"5px 11px",fontSize:11 }} onClick={()=>{ setTimeAwayModal(e); setTimeAwayForm({startDate:today(),endDate:today()}); }}>TimeAway</button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ─────────────────────────────────────────────
//   //  RENDER: LIVE VIEW
//   // ─────────────────────────────────────────────
//   const renderLive = () => (
//     <div className="main-card fade-up">
//       <div style={{ padding:"16px 22px",borderBottom:`1.5px solid ${C.border}` }}>
//         <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:14 }}>
//           <div style={{ display:"flex",alignItems:"center",gap:10 }}>
//             <h2 style={{ fontSize:15,fontWeight:800,color:C.navy,fontFamily:"Sora,sans-serif",margin:0 }}>Live Person Tracking</h2>
//             <div style={{ display:"flex",alignItems:"center",gap:5,background:"rgba(6,182,212,.1)",border:`1px solid rgba(6,182,212,.25)`,borderRadius:999,padding:"3px 10px" }}>
//               <span style={{ width:6,height:6,borderRadius:"50%",background:C.teal,display:"block",animation:"pulse 2s infinite" }}/>
//               <span style={{ fontSize:10,fontWeight:800,color:C.teal }}>Live</span>
//             </div>
//           </div>
//           <div className="dl-strip">
//             <button className="btn-ghost" onClick={exportLiveCSV}><Ic d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={13}/> CSV</button>
//             <button className="btn-ghost" onClick={exportLivePDF}><Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={13}/> PDF</button>
//             <button className="btn-coral" onClick={()=>{ fetchPersons(); fetchStats(); }}>↻ Refresh</button>
//           </div>
//         </div>
//         {/* Filters */}
//         <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
//           <div style={{ display:"flex",alignItems:"center",gap:7,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"8px 12px",flex:1,minWidth:160 }}>
//             <Ic d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" size={13}/>
//             <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search name, ID, email…"
//               style={{ border:"none",background:"transparent",outline:"none",fontSize:12,color:C.navy,width:"100%" }}/>
//           </div>
//           <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} className="adm-select">
//             {departments.map(d=><option key={d}>{d}</option>)}
//           </select>
//           <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="adm-select">
//             {["All","Working","Absent","On TimeAway","Late","On Break"].map(s=><option key={s}>{s}</option>)}
//           </select>
//           <button className="btn-ghost" onClick={()=>{ setSearchQ(""); setDeptFilter("All"); setStatusFilter("All"); }}>Clear</button>
//         </div>
//       </div>

//       <div style={{ overflowX:"auto" }}>
//         <table className="adm-table">
//           <thead><tr>
//             <th>Person</th><th>Department</th><th>Status</th>
//             <th>Punch In</th><th>Hours Worked</th><th>Breaks</th><th>Actions</th>
//           </tr></thead>
//           <tbody>
//             {loading.emp ? (
//               <tr><td colSpan={7} style={{ padding:56,textAlign:"center",color:C.muted }}>
//                 <div style={{ width:28,height:28,borderRadius:"50%",border:`3px solid ${C.coral}`,borderTopColor:"transparent",animation:"spin .8s linear infinite",margin:"0 auto" }}/>
//               </td></tr>
//             ) : filteredEmps.length===0 ? (
//               <tr><td colSpan={7} style={{ padding:40,textAlign:"center",color:C.muted,fontSize:13 }}>No employees found.</td></tr>
//             ) : filteredEmps.map(emp=>(
//               <tr key={emp.id}>
//                 <td>
//                   <div style={{ display:"flex",alignItems:"center",gap:10 }}>
//                     <div style={{ width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${C.coral},#06B6D4)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:900,flexShrink:0 }}>
//                       {String(emp.name||"?")[0].toUpperCase()}
//                     </div>
//                     <div>
//                       <div style={{ fontWeight:700,color:C.navy,fontSize:13 }}>{emp.name}</div>
//                       <div style={{ fontSize:11,color:C.muted }}>{emp.email}</div>
//                       <div style={{ fontSize:10,color:"#d1d5db" }}>ID: {emp.id}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td><span className="dept-chip">{emp.department}</span></td>
//                 <td>{statusBadge(emp.status)}</td>
//                 <td style={{ fontSize:12,color:C.muted }}>{fmtTime(emp.punchIn)}</td>
//                 <td>
//                   <span style={{ fontFamily:"Sora,sans-serif",fontWeight:800,color:C.navy,fontSize:13 }}>{emp.hours}</span>
//                 </td>
//                 <td style={{ fontSize:12,color:C.muted }}>{emp.breaks}</td>
//                 <td>
//                   <div style={{ display:"flex",gap:6 }}>
//                     <button className="btn-coral" style={{ padding:"5px 11px",fontSize:11 }}
//                       onClick={()=>{ setAssignModal(emp); setAssignForm({status:"Present",startDate:today(),endDate:today(),reason:""}); }}>
//                       Assign
//                     </button>
//                     <button className="btn-amber" style={{ padding:"5px 11px",fontSize:11 }}
//                       onClick={()=>{ setTimeAwayModal(emp); setTimeAwayForm({startDate:today(),endDate:today()}); }}>
//                       TimeAway
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ padding:"10px 22px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,fontWeight:600,flexWrap:"wrap",gap:8 }}>
//         <span>Showing <b style={{color:C.navy}}>{filteredEmps.length}</b> of {employees.length} employees</span>
//         <div style={{ display:"flex",gap:16 }}>
//           {[["Working",C.teal,"working"],["Break",C.indigo,"break"],["Absent",C.red,"absent"],["TimeAway",C.amber,"leave"]].map(([l,c,k])=>(
//             <span key={k}>{l}: <b style={{color:c}}>{filteredEmps.filter(e=>e.status?.toLowerCase().includes(k)).length}</b></span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────
//   //  RENDER: MONTHLY
//   // ─────────────────────────────────────────────
//   const renderMonthly = () => {
//     const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//     return (
//       <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
//         {/* Controls */}
//         <div className="main-card fade-up" style={{ padding:"16px 22px" }}>
//           <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
//             <div style={{ display:"flex",alignItems:"center",gap:8 }}>
//               <button type="button" className="btn-ghost" style={{ padding:"7px 12px" }}
//                 onClick={(e)=>{ e.preventDefault(); setMonthYear(p=>{ const m=p.month===1?12:p.month-1; const y=p.month===1?p.year-1:p.year; return {year:y,month:m}; }); }}>‹</button>
//               <span style={{ fontFamily:"Sora,sans-serif",fontWeight:800,color:C.navy,fontSize:14,minWidth:120,textAlign:"center" }}>
//                 {monthNames[monthYear.month-1]} {monthYear.year}
//               </span>
//               <button type="button" className="btn-ghost" style={{ padding:"7px 12px" }}
//                 onClick={(e)=>{ e.preventDefault(); setMonthYear(p=>{ const m=p.month===12?1:p.month+1; const y=p.month===12?p.year+1:p.year; return {year:y,month:m}; }); }}>›</button>
//             </div>
//             <div style={{ display:"flex",gap:6 }}>
//               {[["all","All Persons"],["dept","By Department"],["employee","Single Person"]].map(([id,label])=>(
//                 <button type="button" key={id} className={`tab-pill ${monthlyView===id?"active":""}`}
//                   onClick={(e)=>{ e.preventDefault(); setMonthlyView(id); }}>{label}</button>
//               ))}
//             </div>
//             <div style={{ marginLeft:"auto",display:"flex",gap:8 }}>
//               <button type="button" className="btn-ghost" onClick={(e)=>{ e.preventDefault(); exportMonthlyCSV(); }}><Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={13}/> CSV</button>
//               <button type="button" className="btn-ghost" onClick={(e)=>{ e.preventDefault(); exportMonthlyPDF(); }}><Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={13}/> PDF</button>
//             </div>
//           </div>

//           {monthlyView==="employee" && (
//             <div style={{ marginTop:12,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",position:"relative",zIndex:100 }}>
//               {/* Combined name + ID search with dropdown */}
//               <div style={{ position:"relative", minWidth:260, zIndex:100 }}>
//                 <div style={{ display:"flex",alignItems:"center",gap:7,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"8px 12px" }}>
//                   <Ic d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" size={13} color={C.muted}/>
//                   <input
//                     className="adm-input"
//                     placeholder="Search name or ID…"
//                     value={empSearch}
//                     style={{ border:"none",outline:"none",padding:0,flex:1,fontSize:12 }}
//                     onChange={e=>{ setEmpSearch(e.target.value); setShowEmpDrop(true); setSelEmpId(""); setPayoutsData(null); }}
//                     onFocus={()=>setShowEmpDrop(true)}
//                     onBlur={()=>setTimeout(()=>setShowEmpDrop(false),200)}
//                   />
//                   {empSearch && <button type="button" style={{ border:"none",background:"none",cursor:"pointer",color:C.muted,fontSize:14,lineHeight:1,padding:"0 2px" }}
//                     onClick={()=>{ setEmpSearch(""); setSelEmpId(""); setPayoutsData(null); }}>✕</button>}
//                 </div>
//                 {showEmpDrop && empSearch.length>0 && (
//                   <div style={{ position:"fixed",width:280,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,zIndex:9999,maxHeight:220,overflowY:"auto",boxShadow:"0 12px 36px rgba(13,31,45,.18)",marginTop:4 }}>
//                     {employees.filter(e=>
//                       e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
//                       String(e.id).includes(empSearch)
//                     ).length===0 ? (
//                       <div style={{ padding:"12px 16px",fontSize:12,color:C.muted }}>No employees found</div>
//                     ) : employees.filter(e=>
//                       e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
//                       String(e.id).includes(empSearch)
//                     ).map(emp=>(
//                       <div key={emp.id}
//                         onMouseDown={()=>{ setSelEmpId(String(emp.id)); setEmpSearch(emp.name+" (#"+emp.id+")"); setShowEmpDrop(false); }}
//                         style={{ padding:"10px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.border}` }}
//                         onMouseEnter={e=>e.currentTarget.style.background=C.bg}
//                         onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
//                         <div style={{ width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${C.coral},#06B6D4)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:900,flexShrink:0 }}>
//                           {String(emp.name||"?")[0].toUpperCase()}
//                         </div>
//                         <div>
//                           <div style={{ fontSize:12,fontWeight:700,color:C.navy }}>{emp.name}</div>
//                           <div style={{ fontSize:10,color:C.muted }}>ID: {emp.id} · {emp.department}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <button type="button" className="btn-coral" onClick={(e)=>{ e.preventDefault(); if(selEmpId) fetchPayouts(selEmpId); }} disabled={!selEmpId}>
//                 Fetch
//               </button>
//               {payrollData && <button type="button" className="btn-ghost" onClick={(e)=>{ e.preventDefault(); exportPayoutsCSV(); }}><Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={12}/> Payouts CSV</button>}
//             </div>
//           )}
//         </div>

//         {/* All employees monthly table */}
//         {monthlyView==="all" && (
//           <div className="main-card fade-up2">
//             <div style={{ padding:"14px 22px",borderBottom:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
//               <span style={{ fontSize:13,fontWeight:800,color:C.navy }}>Monthly Presence — All Persons</span>
//               <span style={{ fontSize:11,color:C.muted }}>{monthlyAll.length} employees</span>
//             </div>
//             {loading.monthly ? (
//               <div style={{ padding:56,textAlign:"center",color:C.muted }}>Loading…</div>
//             ) : (
//               <div style={{ overflowX:"auto" }}>
//                 <table className="adm-table">
//                   <thead><tr>
//                     <th>Person</th><th>Dept</th>
//                     <th>Full Days</th><th>Half Days</th><th>Absent</th>
//                     <th>TimeAway</th><th>Work Hours</th><th>Eff. Days</th>
//                   </tr></thead>
//                   <tbody>
//                     {(monthlyAll||[]).length===0 ? (
//                       <tr><td colSpan={8} style={{ padding:40,textAlign:"center",color:C.muted }}>No data. Click "Fetch" after selecting period.</td></tr>
//                     ) : (monthlyAll||[]).map((e,i)=>(
//                       <tr key={i}>
//                         <td>
//                           <div style={{ fontWeight:700,color:C.navy }}>{e.employeeName||`ID:${e.employeeId}`}</div>
//                           <div style={{ fontSize:10,color:C.muted }}>#{e.employeeId}</div>
//                         </td>
//                         <td><span className="dept-chip">{e.department||"—"}</span></td>
//                         <td><b style={{ color:C.teal }}>{e.fullDays??0}</b></td>
//                         <td><b style={{ color:C.amber }}>{e.halfDays??0}</b></td>
//                         <td><b style={{ color:C.red }}>{e.absentDays??0}</b></td>
//                         <td><b style={{ color:C.indigo }}>{e.leaveDays??0}</b></td>
//                         <td style={{ fontFamily:"Sora,sans-serif",fontWeight:800 }}>{e.totalWorkHours??0}h</td>
//                         <td>
//                           <span style={{ background:`rgba(6,182,212,.1)`,color:C.teal,fontWeight:900,fontSize:12,padding:"3px 10px",borderRadius:8 }}>
//                             {e.effectiveDays??0}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Department view */}
//         {monthlyView==="dept" && (
//           <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
//             {loading.monthly ? (
//               <div style={{ padding:56,textAlign:"center",color:C.muted }}>Loading…</div>
//             ) : (monthlyDept?.departments||[]).map((dept,i)=>(
//               <div key={i} className="main-card fade-up">
//                 <div style={{ padding:"14px 22px",borderBottom:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
//                   <div style={{ display:"flex",alignItems:"center",gap:10 }}>
//                     <span style={{ fontSize:14,fontWeight:800,color:C.navy,fontFamily:"Sora,sans-serif" }}>{dept.department}</span>
//                     <span className="dept-chip">{dept.totalPersons} employees</span>
//                   </div>
//                   <div style={{ display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
//                     <div style={{ display:"flex",gap:14,fontSize:12 }}>
//                       {[["Full",dept.deptFullDays,C.teal],["Half",dept.deptHalfDays,C.amber],["Absent",dept.deptAbsentDays,C.red],["Hours",(dept.deptTotalWorkHours??0)+"h",C.coral]].map(([l,v,c])=>(
//                         <span key={l} style={{ fontWeight:700 }}>{l}: <b style={{color:c}}>{v}</b></span>
//                       ))}
//                     </div>
//                     {/* Per-department download buttons */}
//                     <div style={{ display:"flex",gap:6 }}>
//                       <button type="button" className="btn-ghost" style={{ padding:"5px 11px",fontSize:11 }}
//                         onClick={(e)=>{
//                           e.preventDefault();
//                           const rows = (dept.employees||[]).map(emp=>({
//                             Person: emp.employeeName||`#${emp.employeeId}`,
//                             Designation: emp.designation||"",
//                             Department: dept.department,
//                             "Full Days": emp.fullDays??0,
//                             "Half Days": emp.halfDays??0,
//                             "Absent Days": emp.absentDays??0,
//                             "TimeAway Days": emp.leaveDays??0,
//                             "Work Hours": (emp.totalWorkHours??0)+"h",
//                             "Effective Days": emp.effectiveDays??0,
//                           }));
//                           downloadCSV(rows, `attendance-${dept.department.replace(/\s+/g,"-")}-${monthYear.year}-${pad(monthYear.month)}.csv`);
//                         }}>
//                         <Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={11}/> CSV
//                       </button>
//                       <button type="button" className="btn-ghost" style={{ padding:"5px 11px",fontSize:11 }}
//                         onClick={(e)=>{
//                           e.preventDefault();
//                           const rows = (dept.employees||[]).map(emp=>({
//                             Person: emp.employeeName||`#${emp.employeeId}`,
//                             Designation: emp.designation||"",
//                             "Full Days": emp.fullDays??0,
//                             "Half Days": emp.halfDays??0,
//                             "Absent Days": emp.absentDays??0,
//                             "TimeAway Days": emp.leaveDays??0,
//                             "Work Hours": (emp.totalWorkHours??0)+"h",
//                             "Effective Days": emp.effectiveDays??0,
//                           }));
//                           downloadPDF(`${dept.department} — Monthly Presence`,rows,`attendance-${dept.department.replace(/\s+/g,"-")}-${monthYear.year}-${pad(monthYear.month)}.html`);
//                         }}>
//                         <Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={11}/> PDF
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ overflowX:"auto" }}>
//                   <table className="adm-table">
//                     <thead><tr>
//                       <th>Person</th><th>Full</th><th>Half</th><th>Absent</th><th>TimeAway</th><th>Hours</th><th>Eff.</th>
//                     </tr></thead>
//                     <tbody>
//                       {(dept.employees||[]).map((e,j)=>(
//                         <tr key={j}>
//                           <td>
//                             <div style={{ fontWeight:700,color:C.navy }}>{e.employeeName||`#${e.employeeId}`}</div>
//                             <div style={{ fontSize:10,color:C.muted }}>{e.designation}</div>
//                           </td>
//                           <td><b style={{color:C.teal}}>{e.fullDays??0}</b></td>
//                           <td><b style={{color:C.amber}}>{e.halfDays??0}</b></td>
//                           <td><b style={{color:C.red}}>{e.absentDays??0}</b></td>
//                           <td><b style={{color:C.indigo}}>{e.leaveDays??0}</b></td>
//                           <td style={{ fontWeight:800 }}>{e.totalWorkHours??0}h</td>
//                           <td><span style={{ background:"rgba(6,182,212,.1)",color:C.teal,fontWeight:900,fontSize:12,padding:"2px 8px",borderRadius:6 }}>{e.effectiveDays??0}</span></td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Single employee payroll view */}
//         {monthlyView==="employee" && (
//           loading.monthly ? (
//             <div className="main-card" style={{ padding:56,textAlign:"center",color:C.muted }}>
//               <div style={{ width:32,height:32,borderRadius:"50%",border:`3px solid ${C.coral}`,borderTopColor:"transparent",animation:"spin .8s linear infinite",margin:"0 auto 12px" }}/>
//               <div style={{ fontSize:13 }}>Fetching employee data…</div>
//             </div>
//           ) : !selEmpId ? (
//             <div className="main-card" style={{ padding:48,textAlign:"center" }}>
//               <div style={{ fontSize:32,marginBottom:12 }}>🔍</div>
//               <div style={{ fontSize:14,fontWeight:700,color:C.navy,marginBottom:6 }}>Search for an employee</div>
//               <div style={{ fontSize:12,color:C.muted }}>Type a name or ID above to find and fetch their monthly presence</div>
//             </div>
//           ) : !payrollData ? (
//             <div className="main-card" style={{ padding:48,textAlign:"center" }}>
//               <div style={{ fontSize:32,marginBottom:12 }}>📭</div>
//               <div style={{ fontSize:14,fontWeight:700,color:C.navy,marginBottom:6 }}>No data found</div>
//               <div style={{ fontSize:12,color:C.muted }}>No presence records for this employee in the selected month</div>
//             </div>
//           ) : (
//           <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
//             {/* Person header */}
//             <div className="main-card fade-up" style={{ padding:"18px 24px",background:`linear-gradient(135deg,${C.navy},#1a3352)` }}>
//               <div style={{ display:"flex",alignItems:"center",gap:16 }}>
//                 <div style={{ width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${C.coral},#06B6D4)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:20,fontWeight:900 }}>
//                   {String(payrollData.employeeName||empSearch||"?")[0].toUpperCase()}
//                 </div>
//                 <div>
//                   <div style={{ fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:900,color:"#fff" }}>{payrollData.employeeName||`Person #${selEmpId}`}</div>
//                   <div style={{ fontSize:12,color:"rgba(255,255,255,.5)",marginTop:2 }}>
//                     {payrollData.monthName} {payrollData.year} · {payrollData.workingDays||0} working days
//                   </div>
//                 </div>
//                 <div style={{ marginLeft:"auto",display:"flex",gap:8 }}>
//                   <button type="button" className="btn-ghost" onClick={(e)=>{ e.preventDefault(); exportPayoutsCSV(); }} style={{ background:"rgba(255,255,255,.1)",borderColor:"rgba(255,255,255,.2)",color:"#fff" }}>
//                     <Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={12} color="#fff"/> CSV
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Summary cards */}
//             <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12 }}>
//               {[
//                 { label:"Full Days",    val:payrollData.fullDays??payrollData.summary?.fullDays??0,    color:C.teal   },
//                 { label:"Half Days",    val:payrollData.halfDays??payrollData.summary?.halfDays??0,    color:C.amber  },
//                 { label:"Absent",       val:payrollData.absentDays??payrollData.summary?.absentDays??0,  color:C.red    },
//                 { label:"TimeAway Days",   val:payrollData.leaveDays??payrollData.summary?.leaveDays??0,   color:C.indigo },
//                 { label:"Work Hours",   val:`${payrollData.totalWorkHours??payrollData.summary?.totalWorkHours??0}h`, color:C.coral },
//                 { label:"Eff. Days",    val:payrollData.effectiveDays??payrollData.summary?.effectiveDays??0, color:C.teal  },
//               ].map((s,i)=>(
//                 <div key={i} className="stat-card fade-up" style={{ padding:"14px 16px",animationDelay:`${i*.04}s` }}>
//                   <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:C.muted,marginBottom:4 }}>{s.label}</div>
//                   <div style={{ fontFamily:"Sora,sans-serif",fontSize:26,fontWeight:900,color:s.color }}>{s.val}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Daily work hours bar chart */}
//             {(()=>{
//               const records = payrollData.dailyRecords ?? payrollData.summary?.dailyRecords ?? [];
//               const workDays = records.filter(r=>r.type!=="WEEKEND"&&r.type!=="UPCOMING");
//               if (!workDays.length) return null;
//               const max = Math.max(...workDays.map(r=>parseFloat(r.workHours)||0),1);
//               return (
//                 <div className="main-card fade-up2" style={{ padding:22 }}>
//                   <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:16 }}>Daily Work Hours</div>
//                   <div style={{ overflowX:"auto" }}>
//                     <svg viewBox={`0 0 ${Math.max(workDays.length*28,300)} 100`} style={{ width:"100%",minWidth:300,height:100,display:"block" }}>
//                       {workDays.map((r,i)=>{
//                         const hrs = parseFloat(r.workHours)||0;
//                         const bh = (hrs/max)*72;
//                         const x = i*28;
//                         const color = r.type==="FULL_DAY"?C.teal:r.type==="HALF_DAY"?C.amber:r.type==="PARTIAL"?C.purple:C.red;
//                         return (
//                           <g key={i}>
//                             <rect x={x+4} y={80-bh} width={20} height={bh} rx={3} fill={color} opacity={.85}/>
//                             <text x={x+14} y={98} textAnchor="middle" fontSize={6} fill={C.muted} fontFamily="DM Sans,sans-serif">
//                               {r.date?.slice(8)||i+1}
//                             </text>
//                             {hrs>0 && <text x={x+14} y={78-bh} textAnchor="middle" fontSize={6} fill={C.navy} fontWeight={700} fontFamily="Sora,sans-serif">{hrs}h</text>}
//                           </g>
//                         );
//                       })}
//                     </svg>
//                     <div style={{ display:"flex",gap:16,marginTop:10,flexWrap:"wrap" }}>
//                       {[["Full Day",C.teal],["Half Day",C.amber],["Partial",C.purple],["Absent",C.red]].map(([l,c])=>(
//                         <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.muted,fontWeight:600 }}>
//                           <div style={{ width:10,height:10,borderRadius:2,background:c }}/>{l}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })()}

//             {/* Day-by-day table */}
//             <div className="main-card fade-up3">
//               <div style={{ padding:"14px 22px",borderBottom:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
//                 <span style={{ fontSize:13,fontWeight:800,color:C.navy }}>Day-by-Day Breakdown</span>
//                 <span style={{ fontSize:11,color:C.muted }}>{(payrollData.dailyRecords??payrollData.summary?.dailyRecords??[]).length} records</span>
//               </div>
//               <div style={{ overflowX:"auto" }}>
//                 <table className="adm-table">
//                   <thead><tr>
//                     <th>Date</th><th>Day</th><th>Type</th><th>Work Hours</th><th>Effective Value</th>
//                   </tr></thead>
//                   <tbody>
//                     {(payrollData.dailyRecords??payrollData.summary?.dailyRecords??[]).length===0 ? (
//                       <tr><td colSpan={5} style={{ padding:30,textAlign:"center",color:C.muted }}>No daily records available</td></tr>
//                     ) : (payrollData.dailyRecords??payrollData.summary?.dailyRecords??[]).map((r,i)=>(
//                       <tr key={i} style={{ opacity:r.type==="UPCOMING"?.5:1 }}>
//                         <td style={{ fontWeight:700 }}>{r.date}</td>
//                         <td style={{ fontSize:11,color:C.muted }}>{r.dayOfWeek}</td>
//                         <td>{statusBadge(r.type?.replace(/_/g," "))}</td>
//                         <td style={{ fontFamily:"Sora,sans-serif",fontWeight:700 }}>
//                           {r.type==="WEEKEND"||r.type==="UPCOMING"?"—":`${r.workHours??0}h`}
//                         </td>
//                         <td>
//                           <span style={{ fontFamily:"Sora,sans-serif",fontWeight:900,
//                             color:r.effectiveValue>=1?C.teal:r.effectiveValue>=0.5?C.amber:r.effectiveValue>0?C.purple:C.muted }}>
//                             {r.type==="WEEKEND"||r.type==="UPCOMING"?"—":r.effectiveValue??0}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//           )
//         )}
//       </div>
//     );
//   };

//   // ─────────────────────────────────────────────
//   //  RENDER: TRENDS
//   // ─────────────────────────────────────────────
//   const renderTrends = () => {
//     // Weekly attendance data (last 7 days simulated from current stats)
//     const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
//     const todayIdx = new Date().getDay()===0?6:new Date().getDay()-1;
//     const weekData = days.map((d,i)=>({
//       day:d,
//       present: i<=todayIdx ? Math.max(0,liveStats.total - Math.floor(Math.random()*Math.max(1,Math.ceil(liveStats.total*.3)))) : null,
//       absent:  i<=todayIdx ? Math.floor(Math.random()*Math.max(1,Math.ceil(liveStats.total*.2))) : null,
//       isToday: i===todayIdx,
//     }));

//     const maxW = Math.max(...weekData.filter(d=>d.present!==null).map(d=>d.present+d.absent),1);

//     // Dept efficiency (hours vs headcount)
//     const deptEff = (() => {
//       const map = {};
//       employees.forEach(e=>{
//         const hrs = parseFloat(String(e.hours))||0;
//         if(!map[e.department]) map[e.department]={count:0,totalHrs:0};
//         map[e.department].count++;
//         map[e.department].totalHrs+=hrs;
//       });
//       return Object.entries(map).slice(0,6).map(([dept,v],i)=>({
//         dept:dept.length>12?dept.slice(0,10)+"…":dept,
//         avgHrs:v.count?Math.round((v.totalHrs/v.count)*10)/10:0,
//         headcount:v.count,
//         color:[C.teal,C.coral,C.amber,C.indigo,C.purple,C.green][i%6]
//       }));
//     })();

//     const maxHrs = Math.max(...deptEff.map(d=>d.avgHrs),1);

//     return (
//       <div style={{ display:"flex",flexDirection:"column",gap:16 }}>

//         {/* Weekly overview bar chart */}
//         <div className="main-card fade-up" style={{ padding:24 }}>
//           <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
//             <div>
//               <div style={{ fontSize:14,fontWeight:800,color:C.navy }}>Weekly Presence Overview</div>
//               <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>Present vs Absent — this week</div>
//             </div>
//             <div style={{ display:"flex",gap:14 }}>
//               {[["Present",C.teal],["Absent",C.red]].map(([l,c])=>(
//                 <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:600,color:C.muted }}>
//                   <div style={{ width:12,height:12,borderRadius:3,background:c }}/>{l}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <svg viewBox="0 0 490 120" style={{ width:"100%",height:120,display:"block" }}>
//             {[0,40,80,120].map(y=>(
//               <line key={y} x1={0} y1={y} x2={490} y2={y} stroke={C.border} strokeWidth={0.5}/>
//             ))}
//             {weekData.map((d,i)=>{
//               const x = i*70;
//               const ph = d.present!==null?(d.present/maxW)*90:0;
//               const ah = d.present!==null?(d.absent/maxW)*90:0;
//               return (
//                 <g key={i}>
//                   {d.present!==null && <>
//                     <rect x={x+10} y={100-ph} width={22} height={ph} rx={4} fill={C.teal} opacity={d.isToday?1:.7}/>
//                     <rect x={x+34} y={100-ah} width={22} height={ah} rx={4} fill={C.red} opacity={d.isToday?1:.7}/>
//                     {d.present>0 && <text x={x+21} y={98-ph} textAnchor="middle" fontSize={7} fill={C.teal} fontWeight={700}>{d.present}</text>}
//                     {d.absent>0  && <text x={x+45} y={98-ah} textAnchor="middle" fontSize={7} fill={C.red}  fontWeight={700}>{d.absent}</text>}
//                   </>}
//                   {d.present===null && (
//                     <text x={x+33} y={70} textAnchor="middle" fontSize={8} fill={C.border} fontWeight={600}>—</text>
//                   )}
//                   <text x={x+33} y={115} textAnchor="middle" fontSize={9}
//                     fill={d.isToday?C.coral:C.muted} fontWeight={d.isToday?800:600}
//                     fontFamily="DM Sans,sans-serif">{d.day}</text>
//                   {d.isToday && <rect x={x+10} y={108} width={46} height={3} rx={2} fill={C.coral}/>}
//                 </g>
//               );
//             })}
//           </svg>
//         </div>

//         {/* Dept avg hours + headcount */}
//         <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
//           <div className="main-card fade-up2" style={{ padding:22 }}>
//             <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:16 }}>Avg Work Hours by Department</div>
//             {deptEff.length===0 ? (
//               <div style={{ padding:20,textAlign:"center",color:C.muted,fontSize:12 }}>No data</div>
//             ) : deptEff.map((d,i)=>(
//               <div key={i} style={{ marginBottom:14 }}>
//                 <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
//                   <span style={{ fontSize:12,fontWeight:700,color:C.navy }}>{d.dept}</span>
//                   <span style={{ fontSize:12,fontWeight:900,color:d.color,fontFamily:"Sora,sans-serif" }}>{d.avgHrs}h</span>
//                 </div>
//                 <div style={{ display:"flex",alignItems:"center",gap:8 }}>
//                   <div style={{ flex:1,height:8,background:C.border,borderRadius:999,overflow:"hidden" }}>
//                     <div style={{ height:"100%",width:`${(d.avgHrs/maxHrs)*100}%`,background:d.color,borderRadius:999,transition:"width .8s ease" }}/>
//                   </div>
//                   <span style={{ fontSize:10,color:C.muted,fontWeight:600,minWidth:50,textAlign:"right" }}>{d.headcount} emp</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Status breakdown with animated progress */}
//           <div className="main-card fade-up2" style={{ padding:22 }}>
//             <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:16 }}>Today's Presence Breakdown</div>
//             <div style={{ display:"flex",justifyContent:"center",marginBottom:16 }}>
//               <Donut segments={[
//                 { label:"Present",  value:liveStats.present, color:C.teal   },
//                 { label:"Absent",   value:liveStats.absent,  color:C.red    },
//                 { label:"TimeAway",    value:liveStats.onTimeAway, color:C.amber  },
//                 { label:"Break",    value:liveStats.onBreak, color:C.indigo },
//               ]} size={120} stroke={18} label={liveStats.total} sublabel="total"/>
//             </div>
//             {[
//               { label:"Present",  val:liveStats.present,  color:C.teal,   pct:presentPct },
//               { label:"Absent",   val:liveStats.absent,   color:C.red,    pct:liveStats.total?Math.round(liveStats.absent/liveStats.total*100):0 },
//               { label:"On TimeAway", val:liveStats.onTimeAway,  color:C.amber,  pct:liveStats.total?Math.round(liveStats.onTimeAway/liveStats.total*100):0 },
//               { label:"On Break", val:liveStats.onBreak,  color:C.indigo, pct:liveStats.total?Math.round(liveStats.onBreak/liveStats.total*100):0 },
//             ].map((r,i)=>(
//               <div key={i} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
//                 <div style={{ width:10,height:10,borderRadius:3,background:r.color,flexShrink:0 }}/>
//                 <span style={{ fontSize:12,fontWeight:600,color:C.muted,flex:1 }}>{r.label}</span>
//                 <div style={{ width:80,height:6,background:C.border,borderRadius:999,overflow:"hidden" }}>
//                   <div style={{ height:"100%",width:`${r.pct}%`,background:r.color,borderRadius:999,transition:"width .8s ease" }}/>
//                 </div>
//                 <span style={{ fontSize:12,fontWeight:900,color:r.color,fontFamily:"Sora,sans-serif",minWidth:24,textAlign:"right" }}>{r.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Punch-in heatmap by hour */}
//         <div className="main-card fade-up3" style={{ padding:22 }}>
//           <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:6 }}>Work Hours Distribution — Live Persons</div>
//           <div style={{ fontSize:11,color:C.muted,marginBottom:16 }}>Based on current session data</div>
//           <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
//             {employees.length===0 ? (
//               <div style={{ color:C.muted,fontSize:12,padding:"12px 0" }}>No live data available</div>
//             ) : employees.map(emp=>{
//               const hrs = parseFloat(String(emp.hours))||0;
//               const pct = Math.min(100,(hrs/9)*100);
//               return (
//                 <div key={emp.id} style={{ width:120,padding:"12px 14px",background:C.bg,borderRadius:12,border:`1.5px solid ${C.border}` }}>
//                   <div style={{ fontSize:11,fontWeight:700,color:C.navy,marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{emp.name}</div>
//                   <div style={{ fontSize:9,color:C.muted,marginBottom:8 }}>{emp.department}</div>
//                   <div style={{ height:6,background:C.border,borderRadius:999,marginBottom:5,overflow:"hidden" }}>
//                     <div style={{ height:"100%",width:`${pct}%`,background:hrs>=8?C.teal:hrs>=4?C.amber:C.coral,borderRadius:999,transition:"width .8s ease" }}/>
//                   </div>
//                   <div style={{ fontFamily:"Sora,sans-serif",fontSize:13,fontWeight:900,color:hrs>=8?C.teal:hrs>=4?C.amber:C.coral }}>{emp.hours}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ─────────────────────────────────────────────
//   //  RENDER: TIMESHEETS
//   // ─────────────────────────────────────────────
//   const renderTimesheets = () => (
//     <div className="main-card fade-up">
//       <div style={{ padding:"16px 22px",borderBottom:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
//         <div>
//           <h2 style={{ fontSize:15,fontWeight:800,color:C.navy,fontFamily:"Sora,sans-serif",margin:"0 0 2px" }}>Timesheets</h2>
//           <span style={{ fontSize:11,color:C.muted }}>{timesheets.length} records</span>
//         </div>
//         <div className="dl-strip">
//           <button className="btn-ghost" onClick={()=>{ const rows=(timesheets||[]).map(t=>({ ID:t.id, "Emp ID":t.employeeId, Task:t.tasks||"", Remarks:t.remarks||"", Date:fmtDate(t.submittedAt) })); downloadCSV(rows,`timesheets-${today()}.csv`); }}><Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={13}/> CSV</button>
//           <button className="btn-ghost" onClick={()=>{ const rows=(timesheets||[]).map(t=>({ ID:t.id, "Emp ID":t.employeeId, Task:t.tasks||"", Remarks:t.remarks||"", Date:fmtDate(t.submittedAt) })); downloadPDF("Timesheets Report",rows,`timesheets-${today()}.html`); }}><Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={13}/> PDF</button>
//           <button className="btn-coral" onClick={fetchTimesheets} disabled={loading.ts}>{loading.ts?"Loading…":"↻ Refresh"}</button>
//         </div>
//       </div>
//       <div style={{ overflowX:"auto" }}>
//         <table className="adm-table">
//           <thead><tr><th>#ID</th><th>Person</th><th>Tasks</th><th>Remarks</th><th>Submitted</th></tr></thead>
//           <tbody>
//             {loading.ts ? (
//               <tr><td colSpan={5} style={{ padding:56,textAlign:"center",color:C.muted }}>Loading…</td></tr>
//             ) : timesheets.length===0 ? (
//               <tr><td colSpan={5} style={{ padding:40,textAlign:"center",color:C.muted }}>No timesheets found.</td></tr>
//             ) : timesheets.map(t=>(
//               <tr key={t.id}>
//                 <td><span style={{ fontSize:12,fontWeight:800,color:C.coral,fontFamily:"Sora,sans-serif" }}>#{t.id}</span></td>
//                 <td>
//                   <div style={{ fontWeight:700,color:C.navy }}>Emp #{t.employeeId}</div>
//                   <div style={{ fontSize:10,color:C.muted }}>Session #{t.sessionId}</div>
//                 </td>
//                 <td style={{ maxWidth:220,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontSize:12 }}>{t.tasks||"—"}</td>
//                 <td style={{ maxWidth:180,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontSize:12,color:C.muted }}>{t.remarks||"—"}</td>
//                 <td style={{ fontWeight:700,color:C.navy,fontFamily:"Sora,sans-serif",fontSize:12 }}>{fmtDate(t.submittedAt)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────
//   //  RENDER: ASSIGN
//   // ─────────────────────────────────────────────
//   const renderAssign = () => (
//     <div className="main-card fade-up" style={{ padding:22 }}>
//       <div style={{ marginBottom:18 }}>
//         <h2 style={{ fontSize:15,fontWeight:800,color:C.navy,fontFamily:"Sora,sans-serif",margin:"0 0 4px" }}>Assign Presence / TimeAway</h2>
//         <p style={{ fontSize:12,color:C.muted,margin:0 }}>Manually assign presence or time away to any employee</p>
//       </div>
//       <div style={{ display:"flex",flexDirection:"column",gap:10,maxHeight:460,overflowY:"auto" }}>
//         {employees.filter(e=>!searchQ||e.name.toLowerCase().includes(searchQ.toLowerCase())).map(emp=>(
//           <div key={emp.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:C.bg,borderRadius:12,border:`1px solid ${C.border}`,transition:"background .15s" }}
//             onMouseEnter={e=>e.currentTarget.style.background="#eef2f8"}
//             onMouseLeave={e=>e.currentTarget.style.background=C.bg}>
//             <div style={{ display:"flex",alignItems:"center",gap:12 }}>
//               <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.coral},#06B6D4)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:900 }}>
//                 {String(emp.name||"?")[0].toUpperCase()}
//               </div>
//               <div>
//                 <div style={{ fontSize:13,fontWeight:700,color:C.navy }}>{emp.name}</div>
//                 <div style={{ fontSize:11,color:C.muted }}>{emp.email} · {emp.department} · ID: {emp.id}</div>
//               </div>
//             </div>
//             <div style={{ display:"flex",gap:8 }}>
//               <button className="btn-coral" style={{ padding:"7px 14px",fontSize:11 }}
//                 onClick={()=>{ setAssignModal(emp); setAssignForm({status:"Present",startDate:today(),endDate:today(),reason:""}); }}>
//                 Presence
//               </button>
//               <button className="btn-amber" style={{ padding:"7px 14px",fontSize:11 }}
//                 onClick={()=>{ setTimeAwayModal(emp); setTimeAwayForm({startDate:today(),endDate:today()}); }}>
//                 TimeAway
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────
//   //  RENDER: REPORTS
//   // ─────────────────────────────────────────────
//   const renderSignalReports = () => (
//     <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
//       {/* Summary donut + bars */}
//       <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
//         <div className="main-card fade-up" style={{ padding:22 }}>
//           <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:14 }}>Workforce Status Today</div>
//           <div style={{ display:"flex",gap:20,alignItems:"center" }}>
//             <Donut segments={[
//               { label:"Present",value:liveStats.present,color:C.teal  },
//               { label:"Absent", value:liveStats.absent, color:C.red   },
//               { label:"TimeAway",  value:liveStats.onTimeAway,color:C.amber },
//               { label:"Break",  value:liveStats.onBreak,color:C.indigo},
//             ]} size={100} stroke={16} label={liveStats.total} sublabel="total"/>
//             <div style={{ flex:1 }}>
//               {[["Present",liveStats.present,C.teal],["Absent",liveStats.absent,C.red],["TimeAway",liveStats.onTimeAway,C.amber],["Break",liveStats.onBreak,C.indigo]].map(([l,v,c])=>(
//                 <div key={l} style={{ marginBottom:10 }}>
//                   <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,fontWeight:600,marginBottom:3 }}>
//                     <span>{l}</span><b style={{color:C.navy}}>{v} <span style={{color:C.muted,fontWeight:400}}>({liveStats.total?Math.round(v/liveStats.total*100):0}%)</span></b>
//                   </div>
//                   <ProgressBar pct={liveStats.total?v/liveStats.total*100:0} color={c} height={5}/>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="main-card fade-up2" style={{ padding:22 }}>
//           <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:14 }}>Department Breakdown</div>
//           <MiniBarChart height={110}
//             data={[...new Set(employees.map(e=>e.department))].slice(0,7).map(dept=>({
//               label:dept.slice(0,5),
//               value:employees.filter(e=>e.department===dept).length,
//               color:C.teal
//             }))}/>
//         </div>
//       </div>

//       {/* Export panel */}
//       <div className="main-card fade-up3" style={{ padding:22 }}>
//         <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:16 }}>Export SignalReports</div>
//         <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12 }}>
//           {[
//             { title:"Live Presence", desc:"Current day employee status", onCSV:exportLiveCSV, onPDF:exportLivePDF },
//             { title:"Monthly Summary", desc:"Full month presence summary", onCSV:exportMonthlyCSV, onPDF:exportMonthlyPDF },
//             { title:"Timesheets",      desc:"All employee timesheets", onCSV:()=>{ const rows=(timesheets||[]).map(t=>({ID:t.id,"Emp ID":t.employeeId,Task:t.tasks||"",Date:fmtDate(t.submittedAt)})); downloadCSV(rows,`timesheets-${today()}.csv`); }, onPDF:()=>{ const rows=(timesheets||[]).map(t=>({ID:t.id,"Emp ID":t.employeeId,Task:t.tasks||"",Date:fmtDate(t.submittedAt)})); downloadPDF("Timesheets",rows,`timesheets.html`); } },
//           ].map((item,i)=>(
//             <div key={i} style={{ padding:16,background:C.bg,borderRadius:14,border:`1.5px solid ${C.border}` }}>
//               <div style={{ fontSize:13,fontWeight:800,color:C.navy,marginBottom:4 }}>{item.title}</div>
//               <div style={{ fontSize:11,color:C.muted,marginBottom:12 }}>{item.desc}</div>
//               <div style={{ display:"flex",gap:8 }}>
//                 <button className="btn-ghost" style={{ fontSize:11,padding:"6px 12px" }} onClick={item.onCSV}><Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={12}/> CSV</button>
//                 <button className="btn-ghost" style={{ fontSize:11,padding:"6px 12px" }} onClick={item.onPDF}><Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={12}/> PDF</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────
//   //  TAB ROUTER
//   // ─────────────────────────────────────────────
//   const renderContent = () => {
//     switch(activeTab) {
//       case "dashboard": return renderControlRoom();
//       case "live":      return renderLive();
//       case "monthly":   return renderMonthly();
//       case "trends":    return renderTrends();
//       case "leave":     return <TimeAwayOperations/>;
//       case "timesheet": return renderTimesheets();
//       case "assign":    return renderAssign();
//       case "reports":   return renderSignalReports();
//       default:          return null;
//     }
//   };

//   // ─────────────────────────────────────────────
//   //  RENDER
//   // ─────────────────────────────────────────────
//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="adm-att">

//         {/* ── Hero Banner ── */}
//         <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#1a3352 100%)`,borderRadius:20,padding:"20px 28px",marginBottom:22,position:"relative",overflow:"hidden" }}>
//           <div style={{ position:"absolute",top:-40,right:60,width:200,height:200,borderRadius:"50%",background:"rgba(139,92,246,.08)",filter:"blur(50px)",pointerEvents:"none" }}/>
//           <div style={{ position:"absolute",bottom:-30,left:200,width:160,height:160,borderRadius:"50%",background:"rgba(6,182,212,.07)",filter:"blur(40px)",pointerEvents:"none" }}/>
//           <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,position:"relative" }}>
//             <div>
//               <h1 style={{ fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:900,color:"#fff",margin:"0 0 5px" }}>Presence Operations</h1>
//               <p style={{ fontSize:12,color:"rgba(255,255,255,.45)",margin:0 }}>Live tracking · Monthly analytics · Payouts-ready reports</p>
//             </div>
//             <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
//               {/* Live indicator */}
//               <div style={{ display:"flex",alignItems:"center",gap:7,background:"rgba(6,182,212,.15)",border:"1px solid rgba(6,182,212,.3)",borderRadius:999,padding:"5px 14px" }}>
//                 <span style={{ width:7,height:7,borderRadius:"50%",background:C.teal,display:"block",animation:"pulse 2s infinite" }}/>
//                 <span style={{ fontSize:11,fontWeight:800,color:C.teal }}>Live · Auto-refresh 30s</span>
//               </div>
//               {/* Quick KPIs */}
//               {[
//                 { label:"Present",val:liveStats.present,  color:C.teal  },
//                 { label:"Absent", val:liveStats.absent,   color:C.red   },
//                 { label:"Pending",val:liveStats.pending,  color:C.coral },
//               ].map(k=>(
//                 <div key={k.label} style={{ background:"rgba(255,255,255,.08)",borderRadius:12,padding:"6px 14px",textAlign:"center" }}>
//                   <div style={{ fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:900,color:k.color }}>{loading.stats?"—":k.val}</div>
//                   <div style={{ fontSize:9,color:"rgba(255,255,255,.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em" }}>{k.label}</div>
//                 </div>
//               ))}
//               <button type="button" className="btn-coral" onClick={(e)=>{ e.preventDefault(); fetchStats(); fetchPersons(); fetchTimesheets(); }}
//                 disabled={loading.stats||loading.emp}>
//                 {(loading.stats||loading.emp)?"Loading…":"↻ Refresh All"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── Tab Bar ── */}
//         <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:20 }}>
//           {TABS.map(tab=>(
//             <button key={tab.id} type="button" className={`tab-pill ${activeTab===tab.id?"active":""}`}
//               onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); setActiveTab(tab.id); }}>
//               <Ic d={tab.icon} size={13} sw={activeTab===tab.id?2.5:1.8}/>
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* ── Content ── */}
//         {renderContent()}

//         {/* ══ Assign Presence Modal ══ */}
//         {assignModal && (
//           <div className="modal-overlay" onClick={()=>setAssignModal(null)}>
//             <div className="modal-box" onClick={e=>e.stopPropagation()}>
//               <div className="modal-hdr">
//                 <h3 style={{ fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:900,color:"#fff",margin:"0 0 4px" }}>Assign Presence</h3>
//                 <p style={{ fontSize:11,color:"rgba(255,255,255,.4)",margin:0 }}>
//                   {assignModal.name} · {assignModal.department}{assignModal.employeeId ? ` · ${assignModal.employeeId}` : ""}
//                 </p>
//               </div>
//               <div className="modal-body" style={{ display:"flex",flexDirection:"column",gap:14 }}>
//                 <div>
//                   <label className="modal-label">Status</label>
//                   <select value={assignForm.status} onChange={e=>setAssignForm(p=>({...p,status:e.target.value}))} className="adm-select" style={{ width:"100%" }}>
//                     {["Present","Absent","Half Day","TimeAway","Compensation Off","Saturday Work","Sunday Work"].map(s=><option key={s}>{s}</option>)}
//                   </select>
//                 </div>
//                 <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
//                   {[["Start Date","startDate"],["End Date","endDate"]].map(([lbl,key])=>(
//                     <div key={key}>
//                       <label className="modal-label">{lbl}</label>
//                       <input type="date" value={assignForm[key]} className="adm-input" style={{ width:"100%" }}
//                         onChange={e=>setAssignForm(p=>({...p,[key]:e.target.value}))}/>
//                     </div>
//                   ))}
//                 </div>
//                 <div>
//                   <label className="modal-label">Reason (optional)</label>
//                   <textarea rows={3} value={assignForm.reason} placeholder="Optional reason…" className="adm-input" style={{ width:"100%",resize:"none" }}
//                     onChange={e=>setAssignForm(p=>({...p,reason:e.target.value}))}/>
//                 </div>
//                 <div style={{ display:"flex",gap:10,marginTop:4 }}>
//                   <button className="btn-ghost" style={{ flex:1 }} onClick={()=>setAssignModal(null)}>Cancel</button>
//                   <button className="btn-coral" style={{ flex:2 }} onClick={handleAssign} disabled={saving}>
//                     {saving?"Assigning…":"Assign Presence"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ══ Assign TimeAway Modal ══ */}
//         {leaveModal && (
//           <div className="modal-overlay" onClick={()=>setTimeAwayModal(null)}>
//             <div className="modal-box" style={{ maxWidth:420 }} onClick={e=>e.stopPropagation()}>
//               <div className="modal-hdr">
//                 <h3 style={{ fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:900,color:"#fff",margin:"0 0 4px" }}>Assign TimeAway</h3>
//                 <p style={{ fontSize:11,color:"rgba(255,255,255,.4)",margin:0 }}>{leaveModal.name} · ID: {leaveModal.id}</p>
//               </div>
//               <div className="modal-body" style={{ display:"flex",flexDirection:"column",gap:14 }}>
//                 {[["Start Date","startDate"],["End Date","endDate"]].map(([lbl,key])=>(
//                   <div key={key}>
//                     <label className="modal-label">{lbl}</label>
//                     <input type="date" value={leaveForm[key]} className="adm-input" style={{ width:"100%" }}
//                       onChange={e=>setTimeAwayForm(p=>({...p,[key]:e.target.value}))}/>
//                   </div>
//                 ))}
//                 <div style={{ display:"flex",gap:10,marginTop:4 }}>
//                   <button className="btn-ghost" style={{ flex:1 }} onClick={()=>setTimeAwayModal(null)}>Cancel</button>
//                   <button style={{ flex:2,background:`linear-gradient(135deg,${C.amber},#fbbf24)`,color:"#fff",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:800,cursor:"pointer",opacity:saving?0.6:1 }}
//                     onClick={handleTimeAway} disabled={saving}>
//                     {saving?"Assigning…":"Assign TimeAway"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </>
//   );
// }


//18-3-2026

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import LeaveManagement from "./LeaveManagement";
import api from "@/lib/apiClient";

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  coral:  "#8B5CF6", teal:   "#06B6D4", navy:   "#0B1020",
  navy2:  "#182033", muted:  "#64748b", border: "#E8EDF3",
  bg:     "#F4F6F9", white:  "#FFFFFF", green:  "#10b981",
  amber:  "#f59e0b", red:    "#ef4444", indigo: "#6366f1", purple: "#8b5cf6",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
};

const fmtTime = (iso) => {
  if (!iso || iso === "-" || iso === "—") return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
};

const fmtDuration = (val) => {
  if (!val || val === "-" || val === "—") return "—";
  // Already formatted like "08:30:00"
  if (typeof val === "string" && val.includes(":")) return val.slice(0, 5);
  // Seconds number
  const s = parseInt(val) || 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m`;
};

const pad = (n) => String(n).padStart(2,"0");
const today = () => new Date().toISOString().slice(0,10);

// ─── Tenant context helpers ────────────────────────────────────────────────────
const tenantCtx = () => ({
  tenantCode: localStorage.getItem("tenantCode") || "",
  companyId:  localStorage.getItem("companyId")  || "",
});

// ─── Download helpers ─────────────────────────────────────────────────────────
const downloadCSV = (rows, filename) => {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => `"${String(r[h]??"").replace(/"/g,'""')}"`).join(","))
  ].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
  a.download = filename;
  a.click();
};

const downloadPDF = (title, rows, filename) => {
  const headers = rows?.length ? Object.keys(rows[0]) : [];
  const tRows = (rows||[]).map(r =>
    `<tr>${headers.map(h => `<td>${r[h]??""}</td>`).join("")}</tr>`
  ).join("");
  const html = `<html><head><meta charset="utf-8">
    <style>
      body{font-family:'Segoe UI',sans-serif;padding:32px;color:#0B1020;}
      h1{font-size:22px;font-weight:900;border-bottom:3px solid #8B5CF6;padding-bottom:10px;margin-bottom:20px;}
      .meta{font-size:11px;color:#64748b;margin-bottom:24px;}
      table{width:100%;border-collapse:collapse;font-size:12px;}
      th{background:#0B1020;color:#fff;padding:9px 12px;text-align:left;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;}
      td{padding:8px 12px;border-bottom:1px solid #E8EDF3;color:#334155;}
      tr:nth-child(even) td{background:#F4F6F9;}
      .footer{margin-top:30px;font-size:10px;color:#94a3b8;text-align:center;}
    </style></head>
    <body>
      <h1>${title}</h1>
      <div class="meta">Generated: ${new Date().toLocaleString("en-IN")} | Records: ${rows?.length||0}</div>
      <table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${tRows}</tbody></table>
      <div class="footer">CrewSync Presence Report © ${new Date().getFullYear()}</div>
    </body></html>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([html], { type:"text/html" }));
  a.download = filename;
  a.click();
};

// ─── Mini Components ──────────────────────────────────────────────────────────
const Ic = ({ d, size=16, sw=1.8, color="currentColor" }) => (
  <svg width={size} height={size} fill="none" stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);

const Badge = ({ label, color="#64748b", bg="#f1f5f9" }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:4,
    fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em",
    color, background:bg, padding:"3px 9px", borderRadius:999, whiteSpace:"nowrap" }}>
    {label}
  </span>
);

const statusBadge = (status="") => {
  const s = String(status).toLowerCase();
  if (s.includes("present")||s.includes("working")||s.includes("completed"))
    return <Badge label="Present" color={C.teal}   bg="rgba(6,182,212,.12)"/>;
  if (s.includes("absent"))
    return <Badge label="Absent"  color={C.red}    bg="rgba(239,68,68,.1)"/>;
  if (s.includes("leave"))
    return <Badge label="TimeAway"   color={C.amber}  bg="rgba(245,158,11,.12)"/>;
  if (s.includes("break")||s.includes("on_break"))
    return <Badge label="On Break" color={C.indigo} bg="rgba(99,102,241,.1)"/>;
  if (s.includes("late"))
    return <Badge label="Late"    color={C.coral}  bg="rgba(139,92,246,.1)"/>;
  if (s.includes("half"))
    return <Badge label="Half Day" color={C.purple} bg="rgba(139,92,246,.1)"/>;
  if (s.includes("partial"))
    return <Badge label="Partial" color={C.amber}  bg="rgba(245,158,11,.1)"/>;
  return <Badge label={status||"—"}/>;
};

const ProgressBar = ({ pct, color=C.teal, height=6 }) => (
  <div style={{ width:"100%", height, background:C.border, borderRadius:999, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(pct,100)}%`, height:"100%", background:color, borderRadius:999, transition:"width .6s ease" }}/>
  </div>
);

const Donut = ({ segments, size=88, stroke=14, label, sublabel }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((a,s) => a + s.value, 0) || 1;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset} strokeLinecap="round"
            style={{ transform:"rotate(-90deg)", transformOrigin:"50% 50%", transition:"stroke-dasharray .6s ease" }}/>
        );
        offset += dash;
        return el;
      })}
      <text x={size/2} y={size/2-4} textAnchor="middle"
        fontSize={14} fontWeight={900} fill={C.navy} fontFamily="Sora,sans-serif">{label}</text>
      <text x={size/2} y={size/2+11} textAnchor="middle"
        fontSize={7} fill={C.muted} fontFamily="DM Sans,sans-serif">{sublabel}</text>
    </svg>
  );
};

const Sparkline = ({ data=[], color=C.teal, height=36 }) => {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1), min = Math.min(...data, 0), range = max - min || 1;
  const pts = data.map((v,i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none"
      style={{ width:"100%", height, display:"block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.adm-att *{box-sizing:border-box;font-family:'DM Sans',sans-serif;}
.adm-att{background:${C.bg};min-height:100vh;padding:24px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.7)}}
@keyframes spin{to{transform:rotate(360deg)}}
.fade-up{animation:fadeUp .35s ease both;}
.fade-up2{animation:fadeUp .35s .08s ease both;}
.fade-up3{animation:fadeUp .35s .16s ease both;}

.stat-card{
  background:#fff;border-radius:16px;border:1.5px solid ${C.border};
  padding:18px 20px;position:relative;overflow:hidden;
  box-shadow:0 2px 10px rgba(13,31,45,.05);transition:transform .2s,box-shadow .2s;
}
.stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(13,31,45,.1);}

.main-card{
  background:#fff;border-radius:18px;border:1.5px solid ${C.border};
  box-shadow:0 2px 12px rgba(13,31,45,.06);overflow:hidden;
}

.adm-table{width:100%;border-collapse:collapse;}
.adm-table thead tr{background:${C.bg};}
.adm-table thead th{
  padding:11px 14px;text-align:left;font-size:10px;font-weight:800;
  text-transform:uppercase;letter-spacing:.08em;color:${C.muted};
  white-space:nowrap;border-bottom:2px solid ${C.border};
}
.adm-table tbody tr{border-bottom:1px solid #F0F4F8;transition:background .15s;}
.adm-table tbody tr:hover{background:#fafcff;}
.adm-table tbody td{padding:10px 14px;font-size:13px;color:${C.navy};}

.tab-pill{
  display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;
  font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;
  border:1.5px solid ${C.border};background:#fff;color:${C.muted};white-space:nowrap;
}
.tab-pill.active{background:${C.navy};color:#fff;border-color:${C.navy};box-shadow:0 4px 14px rgba(13,31,45,.18);}
.tab-pill:hover:not(.active){background:#f8fafc;border-color:#d1d5db;}

.btn-coral{
  display:inline-flex;align-items:center;gap:6px;
  background:linear-gradient(135deg,${C.coral},#06B6D4);color:#fff;border:none;
  border-radius:10px;padding:9px 18px;font-size:12px;font-weight:800;cursor:pointer;
  font-family:'DM Sans',sans-serif;transition:all .2s;box-shadow:0 4px 12px rgba(139,92,246,.25);
}
.btn-coral:hover{transform:translateY(-1px);filter:brightness(1.05);}
.btn-coral:disabled{opacity:.55;cursor:not-allowed;transform:none;}
.btn-ghost{
  display:inline-flex;align-items:center;gap:6px;background:#fff;color:${C.navy};
  border:1.5px solid ${C.border};border-radius:10px;padding:8px 14px;
  font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;
}
.btn-ghost:hover{background:#f8fafc;border-color:#d1d5db;}

.adm-input{
  padding:9px 13px;border-radius:10px;border:1.5px solid ${C.border};
  background:#fff;font-size:12px;outline:none;color:${C.navy};
  font-family:'DM Sans',sans-serif;transition:border-color .15s;
}
.adm-input:focus{border-color:${C.coral};}
.adm-select{
  padding:9px 13px;border-radius:10px;border:1.5px solid ${C.border};
  background:#fff;font-size:12px;color:${C.navy};outline:none;cursor:pointer;
  font-family:'DM Sans',sans-serif;appearance:none;
}

.modal-overlay{
  position:fixed;inset:0;background:rgba(13,31,45,.55);backdrop-filter:blur(7px);
  display:flex;align-items:center;justify-content:center;z-index:500;padding:16px;
}
.modal-box{
  background:#fff;border-radius:20px;width:100%;max-width:520px;max-height:90vh;
  overflow:hidden;display:flex;flex-direction:column;
  box-shadow:0 28px 60px rgba(13,31,45,.22);border:1.5px solid ${C.border};
}
.modal-hdr{background:linear-gradient(135deg,${C.navy},${C.navy2});padding:20px 24px;}
.modal-body{padding:24px;overflow-y:auto;flex:1;}
.modal-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};display:block;margin-bottom:6px;}

.dept-chip{font-size:10px;font-weight:700;color:${C.teal};background:rgba(6,182,212,.1);padding:2px 8px;border-radius:999px;}
.dl-strip{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.adm-att ::-webkit-scrollbar{width:5px;height:5px;}
.adm-att ::-webkit-scrollbar-track{background:#f1f5f9;}
.adm-att ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:999px;}
`;

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function OperatorPresence() {

  const TABS = [
    { id:"dashboard", label:"Overview",    icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id:"live",      label:"Live View",   icon:"M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
    { id:"monthly",   label:"Monthly",     icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { id:"trends",    label:"Trends",      icon:"M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
    { id:"leave",     label:"TimeAways",      icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id:"timesheet", label:"Timesheets",  icon:"M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id:"assign",    label:"Assign",      icon:"M12 4v16m8-8H4" },
    { id:"reports",   label:"SignalReports",     icon:"M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" },
  ];

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState("dashboard");
  const [stats,        setStats]        = useState({});
  const [employees,    setPersons]    = useState([]);
  const [timesheets,   setTimesheets]   = useState([]);
  const [loading,      setLoading]      = useState({ stats:false, emp:false, ts:false, monthly:false });
  const [searchQ,      setSearchQ]      = useState("");
  const [deptFilter,   setDeptFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Monthly
  const [monthYear,   setMonthYear]   = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const [monthlyAll,  setMonthlyAll]  = useState([]);
  const [monthlyDept, setMonthlyDept] = useState(null);
  const [monthlyView, setMonthlyView] = useState("all");
  const [selEmpId,    setSelEmpId]    = useState("");
  const [payrollData, setPayoutsData] = useState(null);
  const [empSearch,   setEmpSearch]   = useState("");
  const [showEmpDrop, setShowEmpDrop] = useState(false);
  const [empSearchMode, setEmpSearchMode] = useState("name"); // "name" | "id"
  const [dropPos,     setDropPos]     = useState({ top:0, left:0, width:280 });
  const [allPersons, setAllPersons] = useState([]);
  const empInputRef = useRef(null);

  // Modals
  const [assignModal, setAssignModal] = useState(null);
  const [assignForm,  setAssignForm]  = useState({ status:"Present", startDate:today(), endDate:today(), reason:"" });
  const [leaveModal,  setTimeAwayModal]  = useState(null);
  const [leaveForm,   setTimeAwayForm]   = useState({ startDate:today(), endDate:today() });
  const [saving,      setSaving]      = useState(false);

  // ── Loaders ────────────────────────────────────────────────────────────────
  const load = (key, fn) => {
    setLoading(p => ({ ...p, [key]:true }));
    return fn().finally(() => setLoading(p => ({ ...p, [key]:false })));
  };

  const fetchStats = useCallback(() => load("stats", async () => {
    try {
      const r = await api.get("/api/admin/attendance/dashboard-stats");
      setStats(r.data?.data ?? r.data ?? {});
    } catch { setStats({}); }
  }), []);

  const fetchPersons = useCallback(() => load("emp", async () => {
    try {
      const r = await api.get("/api/admin/attendance/live-employees");
      const raw = r.data?.data ?? r.data ?? [];
      const list = Array.isArray(raw) ? raw
                 : Array.isArray(raw.employees) ? raw.employees : [];

      setPersons(list.map(e => ({
        id:           e.id         ?? e.userId       ?? "",
        employeeId:   e.employeeCode || "",
        name:         e.name       ?? e.employeeName ?? e.fullName     ?? "",
        email:        e.email      ?? e.mailId       ?? "",
        department:   e.department ?? e.dept         ?? "Not Assigned",
        status:       e.status     ?? e.attendanceStatus ?? "Unknown",

        // ── Clock-in ──────────────────────────────────────────────────────
        punchIn:  e.startTime   ?? e.punchIn   ?? e.inTime     ?? e.checkIn    ?? null,

        // ── Clock-out — backend sends endTime / checkOut ──────────────────
        punchOut: e.endTime     ?? e.punchOut  ?? e.outTime    ?? e.checkOut   ?? null,

        // ── Duration ──────────────────────────────────────────────────────
        hours:       e.workDuration ?? e.hours ?? e.totalHours ?? null,
        breakTime:   e.breakDuration ?? e.breaks ?? null,
        workSecs:    e.totalSeconds  ?? e.workSeconds ?? 0,
      })));
    } catch { setPersons([]); }
  }), []);

  const fetchTimesheets = useCallback(() => load("ts", async () => {
    try {
      const r = await api.get("/api/admin/attendance/timesheets");
      const raw = r.data?.data ?? r.data ?? [];
      setTimesheets(Array.isArray(raw) ? raw : []);
    } catch { setTimesheets([]); }
  }), []);

  // Monthly — use admin endpoint with tenant context
  const fetchMonthlyAll = useCallback(() => load("monthly", async () => {
    const { tenantCode, companyId } = tenantCtx();
    try {
      const r = await api.get("/api/admin/attendance/monthly/all", {
        params: { year:monthYear.year, month:monthYear.month, tenantCode, companyId },
      });
      setMonthlyAll(r.data?.data ?? r.data ?? []);
    } catch { setMonthlyAll([]); }
  }), [monthYear]);

  const fetchMonthlyDept = useCallback(() => load("monthly", async () => {
    const { tenantCode, companyId } = tenantCtx();
    try {
      const r = await api.get("/api/admin/attendance/monthly/department", {
        params: { year:monthYear.year, month:monthYear.month, tenantCode, companyId },
      });
      setMonthlyDept(r.data?.data ?? r.data ?? {});
    } catch { setMonthlyDept(null); }
  }), [monthYear]);

  const fetchPayouts = useCallback(async (empId) => {
    if (!empId) return;
    const { tenantCode } = tenantCtx();
    try {
      const r = await api.get(`/api/admin/attendance/payroll/employee/${empId}`, {
        params: { year:monthYear.year, month:monthYear.month, tenantCode },
      });
      setPayoutsData(r.data?.data ?? r.data ?? {});
    } catch { setPayoutsData(null); }
  }, [monthYear]);

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    fetchStats(); fetchPersons(); fetchTimesheets();
    const id = setInterval(() => { fetchStats(); fetchPersons(); }, 30000);
    return () => clearInterval(id);
  }, []);

  // Load all tenant employees for Single Person search dropdown
  useEffect(() => {
    api.get("/api/users/tenant/employees")
      .then(res => {
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : [];
        setAllPersons(list.map(e => ({
          id:         String(e.id ?? ""),
          employeeId: e.employeeId ?? e.employeeCode ?? "",
          name:       e.fullName   ?? e.name ?? e.employeeName ?? "",
          department: e.department ?? "—",
        })).filter(e => e.id && e.name));
      })
      .catch(() => {
        // Fallback: try all tenant users
        api.get("/api/users/tenant")
          .then(res => {
            const raw = res.data?.data ?? res.data;
            const list = Array.isArray(raw) ? raw : [];
            setAllPersons(list
              .filter(e => (e.role || "").toUpperCase() !== "ADMIN")
              .map(e => ({
                id:         String(e.id ?? ""),
                employeeId: e.employeeId ?? e.employeeCode ?? "",
                name:       e.fullName   ?? e.name ?? e.employeeName ?? "",
                department: e.department ?? "—",
              })).filter(e => e.id && e.name));
          })
          .catch(() => {});
      });
  }, []);

  useEffect(() => {
    if (activeTab === "monthly") {
      if (monthlyView === "all")      fetchMonthlyAll();
      if (monthlyView === "dept")     fetchMonthlyDept();
      if (monthlyView === "employee" && selEmpId) fetchPayouts(selEmpId);
    }
  }, [activeTab, monthlyView, monthYear, selEmpId]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const filteredEmps = useMemo(() => employees.filter(e => {
    const q = searchQ.toLowerCase();
    const mq = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || String(e.id).includes(q);
    const md = deptFilter === "All" || e.department === deptFilter;
    const ms = statusFilter === "All" || e.status?.toLowerCase().includes(statusFilter.toLowerCase());
    return mq && md && ms;
  }), [employees, searchQ, deptFilter, statusFilter]);

  const departments = useMemo(() =>
    ["All", ...new Set(employees.map(e => e.department).filter(Boolean))],
    [employees]
  );

  const liveStats = useMemo(() => ({
    total:   stats.totalPersons ?? employees.length,
    present: stats.presentToday   ?? employees.filter(e => /working|present|completed/i.test(e.status)).length,
    absent:  stats.absentToday    ?? employees.filter(e => /absent/i.test(e.status)).length,
    onBreak: stats.onBreak        ?? employees.filter(e => /break/i.test(e.status)).length,
    onTimeAway: stats.onTimeAway        ?? employees.filter(e => /leave/i.test(e.status)).length,
    late:    stats.lateToday      ?? employees.filter(e => /late/i.test(e.status)).length,
    pending: stats.pendingRequests ?? 0,
    working: stats.workingNow     ?? employees.filter(e => /working/i.test(e.status)).length,
  }), [stats, employees]);

  const presentPct = liveStats.total ? Math.round((liveStats.present / liveStats.total) * 100) : 0;

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleAssign = async () => {
    if (!assignModal) return;
    setSaving(true);
    try {
      await api.post(
        `/api/admin/attendance/apply-manual-attendance/${assignModal.id}`,
        {
          leaveType: assignForm.status.toUpperCase().replace(/ /g,"_"),
          startDate: assignForm.startDate,
          endDate:   assignForm.endDate || assignForm.startDate,
          reason:    assignForm.reason || "Marked manually by admin",
        }
      );
      alert("Presence assigned successfully!");
      setAssignModal(null); fetchPersons(); fetchStats();
    } catch { alert("Failed to assign attendance"); }
    setSaving(false);
  };

  const handleTimeAway = async () => {
    if (!leaveModal) return;
    setSaving(true);
    try {
      await api.post(
        `/api/admin/attendance/apply-manual-attendance/${leaveModal.id}`,
        { leaveType:"LEAVE", startDate:leaveForm.startDate, endDate:leaveForm.endDate||leaveForm.startDate, reason:"TimeAway assigned by admin" }
      );
      alert("TimeAway assigned!");
      setTimeAwayModal(null); fetchPersons(); fetchStats();
    } catch { alert("Failed"); }
    setSaving(false);
  };

  // ── Export helpers ─────────────────────────────────────────────────────────
  /*
    Live export now includes Clock-In AND Clock-Out columns.
  */
  const exportLiveCSV = () => {
    const rows = filteredEmps.map(e => ({
      "Person ID":   e.employeeId || e.id,
      "Name":          e.name,
      "Email":         e.email,
      "Department":    e.department,
      "Status":        e.status,
      "Clock In":      fmtTime(e.punchIn),
      "Clock Out":     fmtTime(e.punchOut),
      "Work Duration": fmtDuration(e.hours),
      "Break Time":    fmtDuration(e.breakTime),
    }));
    downloadCSV(rows, `live-attendance-${today()}.csv`);
  };

  const exportLivePDF = () => {
    const rows = filteredEmps.map(e => ({
      "ID":            e.id,
      "Name":          e.name,
      "Department":    e.department,
      "Status":        e.status,
      "Clock In":      fmtTime(e.punchIn),
      "Clock Out":     fmtTime(e.punchOut),
      "Work Duration": fmtDuration(e.hours),
      "Break Time":    fmtDuration(e.breakTime),
    }));
    downloadPDF("Live Presence Report", rows, `live-attendance-${today()}.html`);
  };

  const exportMonthlyCSV = () => {
    const rows = (monthlyAll||[]).map(e => ({
      "ID":           e.employeeId,
      "Name":         e.employeeName,
      "Department":   e.department,
      "Full Days":    e.fullDays,
      "Half Days":    e.halfDays,
      "Absent":       e.absentDays,
      "TimeAway":        e.leaveDays,
      "Work Hours":   e.totalWorkHours,
      "Effective Days": e.effectiveDays,
    }));
    downloadCSV(rows, `monthly-attendance-${monthYear.year}-${pad(monthYear.month)}.csv`);
  };

  const exportMonthlyPDF = () => {
    const rows = (monthlyAll||[]).map(e => ({
      "ID":           e.employeeId,
      "Name":         e.employeeName || "—",
      "Department":   e.department   || "—",
      "Full Days":    e.fullDays     ?? 0,
      "Half Days":    e.halfDays     ?? 0,
      "Absent":       e.absentDays   ?? 0,
      "TimeAway":        e.leaveDays    ?? 0,
      "Work Hours":   e.totalWorkHours ?? 0,
      "Eff. Days":    e.effectiveDays  ?? 0,
    }));
    downloadPDF(
      `Monthly Presence — ${pad(monthYear.month)}/${monthYear.year}`,
      rows,
      `monthly-attendance-${monthYear.year}-${pad(monthYear.month)}.html`
    );
  };

  const exportPayoutsCSV = () => {
    const records = payrollData?.dailyRecords ?? payrollData?.summary?.dailyRecords ?? [];
    if (!records.length) return;
    const rows = records.map(r => ({
      "Date":           r.date,
      "Day":            r.dayOfWeek,
      "Type":           r.type,
      "Clock In":       fmtTime(r.startTime),
      "Clock Out":      fmtTime(r.endTime),
      "Work Hours":     r.workHours ?? 0,
      "Effective Value":r.effectiveValue ?? 0,
    }));
    downloadCSV(rows, `payroll-${selEmpId}-${monthYear.year}-${pad(monthYear.month)}.csv`);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  TAB: DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════
  const renderControlRoom = () => {
    const statCards = [
      { label:"Total People",  val:liveStats.total,   color:C.coral,  bg:"rgba(139,92,246,.1)",  icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
      { label:"Present Today",    val:liveStats.present, color:C.teal,   bg:"rgba(6,182,212,.1)",   icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", trend:[62,70,65,78,82,75,presentPct] },
      { label:"Absent Today",     val:liveStats.absent,  color:C.red,    bg:"rgba(239,68,68,.1)",   icon:"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
      { label:"On TimeAway",         val:liveStats.onTimeAway, color:C.amber,  bg:"rgba(245,158,11,.1)",  icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
      { label:"On Break",         val:liveStats.onBreak, color:C.indigo, bg:"rgba(99,102,241,.1)",  icon:"M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" },
      { label:"Late Arrivals",    val:liveStats.late,    color:C.purple, bg:"rgba(139,92,246,.1)",  icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
      { label:"Working Now",      val:liveStats.working, color:C.teal,   bg:"rgba(6,182,212,.1)",   icon:"M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
      { label:"Pending Requests", val:liveStats.pending, color:C.coral,  bg:"rgba(139,92,246,.1)",  icon:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    ];

    // Department breakdown from live employees
    const deptMap = {};
    employees.forEach(e => { deptMap[e.department] = (deptMap[e.department]||0) + 1; });
    const deptData = Object.entries(deptMap).slice(0,8).map(([d,c],i) => ({
      label:d.length>6?d.slice(0,5)+"…":d, fullLabel:d, value:c,
      color:[C.teal,C.coral,C.amber,C.indigo,C.purple,C.green,"#06b6d4","#ec4899"][i%8],
    }));

    const statusDist = [
      { label:"Present", value:liveStats.present, color:C.teal   },
      { label:"Absent",  value:liveStats.absent,  color:C.red    },
      { label:"TimeAway",   value:liveStats.onTimeAway, color:C.amber  },
      { label:"Break",   value:liveStats.onBreak, color:C.indigo },
    ];

    const topPerformers = [...employees]
      .filter(e => e.hours && e.hours !== "-" && e.hours !== "—")
      .sort((a,b) => (parseFloat(String(b.hours))||0) - (parseFloat(String(a.hours))||0))
      .slice(0,5);

    return (
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        {/* Stat cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:14 }}>
          {statCards.map((s,i) => (
            <div key={i} className="stat-card fade-up" style={{ animationDelay:`${i*.04}s` }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:s.color, opacity:.12 }}/>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:s.bg,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Ic d={s.icon} size={18} sw={1.9} color={s.color}/>
                </div>
                {s.trend && <Sparkline data={s.trend} color={s.color} height={30}/>}
              </div>
              <div style={{ fontFamily:"Sora,sans-serif", fontSize:30, fontWeight:900, color:s.color, lineHeight:1 }}>
                {loading.stats ? "—" : s.val}
              </div>
              <div style={{ fontSize:11, fontWeight:600, color:C.muted, marginTop:5 }}>{s.label}</div>
              {s.label === "Present Today" && (
                <div style={{ marginTop:8 }}>
                  <ProgressBar pct={presentPct} color={s.color}/>
                  <span style={{ fontSize:10, color:C.muted, fontWeight:600 }}>{presentPct}% presence rate</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Row 2: Donut + Status breakdown */}
        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr 240px", gap:16 }}>
          <div className="main-card fade-up2" style={{ padding:22 }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:16 }}>Today's Distribution</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
              <Donut segments={statusDist} size={110} stroke={16} label={liveStats.total} sublabel="total"/>
            </div>
            {statusDist.map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:9 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:s.color }}/>
                  <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{s.label}</span>
                </div>
                <span style={{ fontFamily:"Sora,sans-serif", fontWeight:800, color:C.navy, fontSize:12 }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Department headcount */}
          <div className="main-card fade-up2" style={{ padding:22 }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:16 }}>Department Headcount</div>
            {deptData.length === 0 ? (
              <div style={{ padding:24, textAlign:"center", color:C.muted, fontSize:12 }}>No data</div>
            ) : deptData.map((d,i) => {
              const maxVal = Math.max(...deptData.map(x => x.value), 1);
              return (
                <div key={i} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:700, color:C.navy, marginBottom:5 }}>
                    <span>{d.fullLabel}</span>
                    <span style={{ color:d.color, fontFamily:"Sora,sans-serif" }}>{d.value}</span>
                  </div>
                  <div style={{ height:10, background:C.border, borderRadius:999, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(d.value/maxVal)*100}%`, background:d.color, borderRadius:999, transition:"width .8s ease" }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Presence rate gauge */}
          <div className="main-card fade-up2" style={{ padding:22 }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:14 }}>Presence Rate</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
              <svg width={100} height={100} viewBox="0 0 100 100">
                <circle cx={50} cy={50} r={40} fill="none" stroke={C.border} strokeWidth={10}/>
                <circle cx={50} cy={50} r={40} fill="none" stroke={C.coral} strokeWidth={10}
                  strokeDasharray={`${presentPct*2.513} 251.3`}
                  strokeDashoffset="62.8" strokeLinecap="round"
                  style={{ transform:"rotate(-90deg)", transformOrigin:"50% 50%", transition:"stroke-dasharray .8s ease" }}/>
                <text x={50} y={46} textAnchor="middle" fontSize={18} fontWeight={900} fill={C.coral} fontFamily="Sora,sans-serif">{presentPct}%</text>
                <text x={50} y={60} textAnchor="middle" fontSize={7} fill={C.muted} fontFamily="DM Sans,sans-serif">present</text>
              </svg>
            </div>
            {[
              { label:"Present",  pct:presentPct, color:C.teal,  val:liveStats.present  },
              { label:"Absent",   pct:liveStats.total?Math.round(liveStats.absent/liveStats.total*100):0,   color:C.red,   val:liveStats.absent  },
              { label:"On TimeAway", pct:liveStats.total?Math.round(liveStats.onTimeAway/liveStats.total*100):0,  color:C.amber, val:liveStats.onTimeAway },
            ].map((r,i) => (
              <div key={i} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, fontWeight:600, marginBottom:4 }}>
                  <span>{r.label}</span>
                  <span style={{ color:C.navy, fontWeight:800 }}>{r.val} <span style={{ color:C.muted, fontWeight:400 }}>({r.pct}%)</span></span>
                </div>
                <ProgressBar pct={r.pct} color={r.color}/>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Top performers + quick activity */}
        <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:16 }}>
          <div className="main-card fade-up3" style={{ padding:22 }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:16 }}>Top Workers Today</div>
            {topPerformers.length === 0 ? (
              <div style={{ padding:24, textAlign:"center", color:C.muted, fontSize:12 }}>No work hour data yet</div>
            ) : topPerformers.map((emp,i) => {
              const hrs = parseFloat(String(emp.hours))||0;
              const maxHrs = parseFloat(String(topPerformers[0]?.hours))||1;
              return (
                <div key={emp.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:13 }}>
                  <div style={{ width:24, height:24, borderRadius:6,
                    background: i===0 ? `linear-gradient(135deg,${C.amber},#fbbf24)` : C.bg,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, fontWeight:900, color: i===0 ? "#fff" : C.muted, flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div style={{ width:32, height:32, borderRadius:10,
                    background:`linear-gradient(135deg,${C.coral},#06B6D4)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"#fff", fontSize:13, fontWeight:900, flexShrink:0 }}>
                    {String(emp.name||"?")[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.navy, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{emp.name}</div>
                    <div style={{ height:5, background:C.border, borderRadius:999, marginTop:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(hrs/maxHrs)*100}%`, background: i===0?C.amber:C.teal, borderRadius:999, transition:"width .8s ease" }}/>
                    </div>
                  </div>
                  <span style={{ fontFamily:"Sora,sans-serif", fontSize:12, fontWeight:900, color: i===0?C.amber:C.teal, flexShrink:0 }}>
                    {fmtDuration(emp.hours)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick live activity strip */}
          <div className="main-card fade-up3">
            <div style={{ padding:"14px 22px", borderBottom:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:13, fontWeight:800, color:C.navy }}>Live Person Activity</span>
              <button className="btn-coral" onClick={() => { fetchStats(); fetchPersons(); }}>↻ Refresh</button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table className="adm-table">
                <thead><tr>
                  <th>Person</th><th>Department</th><th>Status</th>
                  <th>Clock In</th><th>Clock Out</th><th>Duration</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {loading.emp ? (
                    <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:C.muted }}>Loading…</td></tr>
                  ) : employees.slice(0,8).map(e => (
                    <tr key={e.id}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:9,
                            background:`linear-gradient(135deg,${C.coral},#06B6D4)`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            color:"#fff", fontSize:12, fontWeight:900, flexShrink:0 }}>
                            {String(e.name||"?")[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, color:C.navy, fontSize:13 }}>{e.name}</div>
                            <div style={{ fontSize:10, color:C.muted }}>{e.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="dept-chip">{e.department}</span></td>
                      <td>{statusBadge(e.status)}</td>
                      <td style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{fmtTime(e.punchIn)}</td>
                      <td style={{ fontSize:12, color: e.punchOut ? C.teal : C.muted, fontWeight: e.punchOut ? 700 : 400 }}>
                        {fmtTime(e.punchOut)}
                      </td>
                      <td style={{ fontFamily:"Sora,sans-serif", fontWeight:800, color:C.navy, fontSize:13 }}>
                        {fmtDuration(e.hours)}
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:6 }}>
                          <button className="btn-coral" style={{ padding:"5px 11px", fontSize:11 }}
                            onClick={() => { setAssignModal(e); setAssignForm({ status:"Present", startDate:today(), endDate:today(), reason:"" }); }}>
                            Assign
                          </button>
                          <button style={{ padding:"5px 11px", fontSize:11,
                            background:`linear-gradient(135deg,${C.amber},#fbbf24)`, color:"#fff",
                            border:"none", borderRadius:8, cursor:"pointer", fontWeight:800 }}
                            onClick={() => { setTimeAwayModal(e); setTimeAwayForm({ startDate:today(), endDate:today() }); }}>
                            TimeAway
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  TAB: LIVE VIEW
  //  ✅ Clock Out column added in table + both CSV and PDF exports
  // ═══════════════════════════════════════════════════════════════════════════
  const renderLive = () => (
    <div className="main-card fade-up">
      <div style={{ padding:"16px 22px", borderBottom:`1.5px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <h2 style={{ fontSize:15, fontWeight:800, color:C.navy, fontFamily:"Sora,sans-serif", margin:0 }}>Live Person Tracking</h2>
            <div style={{ display:"flex", alignItems:"center", gap:5,
              background:"rgba(6,182,212,.1)", border:`1px solid rgba(6,182,212,.25)`,
              borderRadius:999, padding:"3px 10px" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:C.teal, display:"block", animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:10, fontWeight:800, color:C.teal }}>Live</span>
            </div>
          </div>
          <div className="dl-strip">
            <button className="btn-ghost" onClick={exportLiveCSV}>
              <Ic d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={13}/> CSV
            </button>
            <button className="btn-ghost" onClick={exportLivePDF}>
              <Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={13}/> PDF
            </button>
            <button className="btn-coral" onClick={() => { fetchPersons(); fetchStats(); }}>↻ Refresh</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, background:C.bg,
            border:`1.5px solid ${C.border}`, borderRadius:10, padding:"8px 12px", flex:1, minWidth:160 }}>
            <Ic d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" size={13}/>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search name, ID, email…"
              style={{ border:"none", background:"transparent", outline:"none", fontSize:12, color:C.navy, width:"100%" }}/>
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="adm-select">
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="adm-select">
            {["All","Working","Absent","On TimeAway","Late","On Break"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn-ghost" onClick={() => { setSearchQ(""); setDeptFilter("All"); setStatusFilter("All"); }}>Clear</button>
        </div>
      </div>

      <div style={{ overflowX:"auto" }}>
        <table className="adm-table">
          <thead><tr>
            <th>Person</th>
            <th>Department</th>
            <th>Status</th>
            <th>Clock In</th>
            {/* ✅ Clock Out column */}
            <th>Clock Out</th>
            <th>Duration</th>
            <th>Break Time</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {loading.emp ? (
              <tr><td colSpan={8} style={{ padding:56, textAlign:"center", color:C.muted }}>
                <div style={{ width:28, height:28, borderRadius:"50%", border:`3px solid ${C.coral}`,
                  borderTopColor:"transparent", animation:"spin .8s linear infinite", margin:"0 auto" }}/>
              </td></tr>
            ) : filteredEmps.length === 0 ? (
              <tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>
                No employees found.
              </td></tr>
            ) : filteredEmps.map(emp => (
              <tr key={emp.id}>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10,
                      background:`linear-gradient(135deg,${C.coral},#06B6D4)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"#fff", fontSize:13, fontWeight:900, flexShrink:0 }}>
                      {String(emp.name||"?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, color:C.navy, fontSize:13 }}>{emp.name}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{emp.email}</div>
                      <div style={{ fontSize:10, color:"#d1d5db" }}>{emp.employeeId ? `ID: ${emp.employeeId}` : ""}</div>
                    </div>
                  </div>
                </td>
                <td><span className="dept-chip">{emp.department}</span></td>
                <td>{statusBadge(emp.status)}</td>

                {/* ── Clock In ── */}
                <td style={{ fontSize:12, fontWeight:600, color:C.muted }}>
                  {fmtTime(emp.punchIn)}
                </td>

                {/* ── Clock Out ── highlighted when available ── */}
                <td>
                  {emp.punchOut ? (
                    <span style={{ fontSize:12, fontWeight:700, color:C.teal,
                      background:"rgba(6,182,212,.08)", padding:"3px 9px", borderRadius:8 }}>
                      {fmtTime(emp.punchOut)}
                    </span>
                  ) : (
                    <span style={{ fontSize:11, color:C.muted }}>—</span>
                  )}
                </td>

                {/* ── Duration ── */}
                <td>
                  <span style={{ fontFamily:"Sora,sans-serif", fontWeight:800, color:C.navy, fontSize:13 }}>
                    {fmtDuration(emp.hours)}
                  </span>
                </td>

                {/* ── Break ── */}
                <td style={{ fontSize:12, color:C.muted }}>
                  {fmtDuration(emp.breakTime)}
                </td>

                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="btn-coral" style={{ padding:"5px 11px", fontSize:11 }}
                      onClick={() => { setAssignModal(emp); setAssignForm({ status:"Present", startDate:today(), endDate:today(), reason:"" }); }}>
                      Assign
                    </button>
                    <button style={{ padding:"5px 11px", fontSize:11,
                      background:`linear-gradient(135deg,${C.amber},#fbbf24)`, color:"#fff",
                      border:"none", borderRadius:8, cursor:"pointer", fontWeight:800 }}
                      onClick={() => { setTimeAwayModal(emp); setTimeAwayForm({ startDate:today(), endDate:today() }); }}>
                      TimeAway
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div style={{ padding:"10px 22px", borderTop:`1px solid ${C.border}`,
        display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, fontWeight:600, flexWrap:"wrap", gap:8 }}>
        <span>Showing <b style={{ color:C.navy }}>{filteredEmps.length}</b> of {employees.length} employees</span>
        <div style={{ display:"flex", gap:16 }}>
          {[["Working",C.teal,"working"],["Break",C.indigo,"break"],["Absent",C.red,"absent"],["TimeAway",C.amber,"leave"]].map(([l,c,k]) => (
            <span key={k}>{l}: <b style={{ color:c }}>{filteredEmps.filter(e => e.status?.toLowerCase().includes(k)).length}</b></span>
          ))}
          <span>Clocked Out: <b style={{ color:C.teal }}>{filteredEmps.filter(e => !!e.punchOut).length}</b></span>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  //  TAB: MONTHLY
  // ═══════════════════════════════════════════════════════════════════════════
  const renderMonthly = () => {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {/* Controls */}
        <div className="main-card fade-up" style={{ padding:"16px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button className="btn-ghost" style={{ padding:"7px 12px" }}
                onClick={() => setMonthYear(p => {
                  const m = p.month===1 ? 12 : p.month-1;
                  const y = p.month===1 ? p.year-1 : p.year;
                  return { year:y, month:m };
                })}>‹</button>
              <span style={{ fontFamily:"Sora,sans-serif", fontWeight:800, color:C.navy, fontSize:14, minWidth:120, textAlign:"center" }}>
                {monthNames[monthYear.month-1]} {monthYear.year}
              </span>
              <button className="btn-ghost" style={{ padding:"7px 12px" }}
                onClick={() => setMonthYear(p => {
                  const m = p.month===12 ? 1 : p.month+1;
                  const y = p.month===12 ? p.year+1 : p.year;
                  return { year:y, month:m };
                })}>›</button>
            </div>

            <div style={{ display:"flex", gap:6 }}>
              {[["all","All Persons"],["dept","By Department"],["employee","Single Person"]].map(([id,label]) => (
                <button key={id} className={`tab-pill ${monthlyView===id?"active":""}`}
                  onClick={() => setMonthlyView(id)}>{label}</button>
              ))}
            </div>

            <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
              <button className="btn-ghost" onClick={exportMonthlyCSV}>
                <Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={13}/> CSV
              </button>
              <button className="btn-ghost" onClick={exportMonthlyPDF}>
                <Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={13}/> PDF
              </button>
            </div>
          </div>

          {/* Person search for Single Person view */}
          {monthlyView === "employee" && (
            <div style={{ marginTop:12, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>

              {/* Name / ID toggle */}
              <div style={{ display:"flex", background:"#F1F5F9", borderRadius:9, padding:3, gap:2, flexShrink:0 }}>
                {[["name","By Name"],["id","By ID"]].map(([val,lbl]) => (
                  <button key={val} onClick={() => { setEmpSearchMode(val); setEmpSearch(""); setSelEmpId(""); setPayoutsData(null); }}
                    style={{ padding:"5px 12px", borderRadius:7, border:"none", fontSize:11, fontWeight:700, cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif",
                      background: empSearchMode===val ? `linear-gradient(135deg,${C.coral},#FBBF24)` : "transparent",
                      color: empSearchMode===val ? "#fff" : "#64748b", transition:"all .15s" }}>
                    {lbl}
                  </button>
                ))}
              </div>

              {/* Search input with dropdown */}
              <div ref={empInputRef} style={{ position:"relative", minWidth:280, flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7,
                  background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"8px 12px" }}>
                  <Ic d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" size={13} color={C.muted}/>
                  <input className="adm-input"
                    placeholder={empSearchMode === "name" ? "Type employee name…" : "Type employee ID…"}
                    value={empSearch}
                    style={{ border:"none", outline:"none", padding:0, flex:1, fontSize:12 }}
                    onChange={e => {
                      setEmpSearch(e.target.value);
                      setSelEmpId("");
                      setPayoutsData(null);
                      if (e.target.value.length > 0) {
                        const rect = empInputRef.current?.getBoundingClientRect();
                        if (rect) setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                        setShowEmpDrop(true);
                      } else {
                        setShowEmpDrop(false);
                      }
                    }}
                    onFocus={() => {
                      if (empSearch.length > 0) {
                        const rect = empInputRef.current?.getBoundingClientRect();
                        if (rect) setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                        setShowEmpDrop(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowEmpDrop(false), 200)}
                  />
                  {empSearch && (
                    <button style={{ border:"none", background:"none", cursor:"pointer", color:C.muted, fontSize:14, lineHeight:1 }}
                      onMouseDown={() => { setEmpSearch(""); setSelEmpId(""); setPayoutsData(null); setShowEmpDrop(false); }}>✕</button>
                  )}
                </div>

                {/* Dropdown rendered via portal to escape overflow:hidden and transform stacking context */}
                {showEmpDrop && empSearch.length > 0 && ReactDOM.createPortal((() => {
                  const searchPool = allPersons.length > 0 ? allPersons : employees;
                  const matchedEmps = searchPool.filter(e =>
                    empSearchMode === "name"
                      ? (e.name || "").toLowerCase().includes(empSearch.toLowerCase())
                      : String(e.employeeId || "").toLowerCase().includes(empSearch.toLowerCase()) ||
                        String(e.id).includes(empSearch)
                  );
                  return (
                    <div style={{
                      position:"fixed",
                      top: dropPos.top,
                      left: dropPos.left,
                      width: dropPos.width,
                      background:"#fff",
                      border:`1.5px solid ${C.border}`,
                      borderRadius:10,
                      zIndex:999999,
                      maxHeight:240,
                      overflowY:"auto",
                      boxShadow:"0 12px 36px rgba(13,31,45,.22)",
                    }}>
                      {matchedEmps.length === 0 ? (
                        <div style={{ padding:"14px 16px", fontSize:12, color:C.muted, textAlign:"center" }}>No employees found</div>
                      ) : matchedEmps.map(emp => (
                        <div key={emp.id}
                          onMouseDown={() => {
                            setSelEmpId(emp.id);
                            setEmpSearch(emp.name + (emp.employeeId ? ` (${emp.employeeId})` : ""));
                            setShowEmpDrop(false);
                          }}
                          style={{ padding:"10px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:10,
                            borderBottom:`1px solid ${C.border}`, transition:"background .12s" }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bg}
                          onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                          <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
                            background:`linear-gradient(135deg,${C.coral},#06B6D4)`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            color:"#fff", fontSize:13, fontWeight:900 }}>
                            {String(emp.name||"?")[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:C.navy }}>{emp.name}</div>
                            <div style={{ fontSize:11, color:C.muted }}>
                              {emp.employeeId ? `ID: ${emp.employeeId}` : ""}
                              {emp.department ? ` · ${emp.department}` : ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })(), document.body)}
              </div>

              <button className="btn-coral" disabled={!selEmpId} onClick={() => { if (selEmpId) fetchPayouts(selEmpId); }}>
                Fetch
              </button>
              {payrollData && (
                <button className="btn-ghost" onClick={exportPayoutsCSV}>
                  <Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={12}/> Payouts CSV
                </button>
              )}
            </div>
          )}
        </div>

        {/* All employees monthly table */}
        {monthlyView === "all" && (
          <div className="main-card fade-up2">
            <div style={{ padding:"14px 22px", borderBottom:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:13, fontWeight:800, color:C.navy }}>Monthly Presence — All Persons</span>
              <span style={{ fontSize:11, color:C.muted }}>{monthlyAll.length} employees</span>
            </div>
            {loading.monthly ? (
              <div style={{ padding:56, textAlign:"center", color:C.muted }}>Loading…</div>
            ) : (
              <div style={{ overflowX:"auto" }}>
                <table className="adm-table">
                  <thead><tr>
                    <th>Person</th><th>Dept</th>
                    <th>Full Days</th><th>Half Days</th><th>Partial</th>
                    <th>Absent</th><th>TimeAway</th><th>Work Hours</th><th>Eff. Days</th>
                  </tr></thead>
                  <tbody>
                    {monthlyAll.length === 0 ? (
                      <tr><td colSpan={9} style={{ padding:40, textAlign:"center", color:C.muted }}>
                        No data. Select month and click fetch.
                      </td></tr>
                    ) : monthlyAll.map((e,i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight:700, color:C.navy }}>{e.employeeName || "—"}</div>
                          <div style={{ fontSize:10, color:C.muted }}>{e.employeeCode ? `ID: ${e.employeeCode}` : ""}</div>
                        </td>
                        <td><span className="dept-chip">{e.department||"—"}</span></td>
                        <td><b style={{ color:C.teal  }}>{e.fullDays    ?? 0}</b></td>
                        <td><b style={{ color:C.amber }}>{e.halfDays    ?? 0}</b></td>
                        <td><b style={{ color:C.purple}}>{e.partialDays ?? 0}</b></td>
                        <td><b style={{ color:C.red   }}>{e.absentDays  ?? 0}</b></td>
                        <td><b style={{ color:C.indigo}}>{e.leaveDays   ?? 0}</b></td>
                        <td style={{ fontFamily:"Sora,sans-serif", fontWeight:800 }}>
                          {typeof e.totalWorkHours === "number" ? e.totalWorkHours.toFixed(1) : (e.totalWorkHours ?? 0)}h
                        </td>
                        <td>
                          <span style={{ background:"rgba(6,182,212,.1)", color:C.teal, fontWeight:900, fontSize:12, padding:"3px 10px", borderRadius:8 }}>
                            {typeof e.effectiveDays === "number" ? e.effectiveDays.toFixed(2) : (e.effectiveDays ?? 0)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Department view */}
        {monthlyView === "dept" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {loading.monthly ? (
              <div style={{ padding:56, textAlign:"center", color:C.muted }}>Loading…</div>
            ) : (monthlyDept?.departments||[]).map((dept,i) => (
              <div key={i} className="main-card fade-up">
                <div style={{ padding:"14px 22px", borderBottom:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:14, fontWeight:800, color:C.navy, fontFamily:"Sora,sans-serif" }}>{dept.department}</span>
                    <span className="dept-chip">{dept.totalPersons} employees</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                    {[["Full",dept.deptFullDays,C.teal],["Half",dept.deptHalfDays,C.amber],["Absent",dept.deptAbsentDays,C.red],["Hours",(dept.deptTotalWorkHours??0)+"h",C.coral]].map(([l,v,c]) => (
                      <span key={l} style={{ fontSize:12, fontWeight:700 }}>{l}: <b style={{ color:c }}>{v}</b></span>
                    ))}
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn-ghost" style={{ padding:"5px 11px", fontSize:11 }}
                        onClick={() => {
                          const rows = (dept.employees||[]).map(emp => ({
                            "Person": emp.employeeName||`#${emp.employeeId}`, "Designation": emp.designation||"",
                            "Department": dept.department, "Full Days": emp.fullDays??0, "Half Days": emp.halfDays??0,
                            "Absent Days": emp.absentDays??0, "TimeAway Days": emp.leaveDays??0,
                            "Work Hours": (emp.totalWorkHours??0)+"h", "Effective Days": emp.effectiveDays??0,
                          }));
                          downloadCSV(rows, `attendance-${dept.department.replace(/\s+/g,"-")}-${monthYear.year}-${pad(monthYear.month)}.csv`);
                        }}>
                        <Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={11}/> CSV
                      </button>
                      <button className="btn-ghost" style={{ padding:"5px 11px", fontSize:11 }}
                        onClick={() => {
                          const rows = (dept.employees||[]).map(emp => ({
                            "Person": emp.employeeName||`#${emp.employeeId}`, "Designation": emp.designation||"",
                            "Full Days": emp.fullDays??0, "Half Days": emp.halfDays??0,
                            "Absent Days": emp.absentDays??0, "TimeAway Days": emp.leaveDays??0,
                            "Work Hours": (emp.totalWorkHours??0)+"h", "Effective Days": emp.effectiveDays??0,
                          }));
                          downloadPDF(`${dept.department} — Monthly Presence`, rows,
                            `attendance-${dept.department.replace(/\s+/g,"-")}-${monthYear.year}-${pad(monthYear.month)}.html`);
                        }}>
                        <Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={11}/> PDF
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table className="adm-table">
                    <thead><tr>
                      <th>Person</th><th>Full</th><th>Half</th><th>Absent</th><th>TimeAway</th><th>Hours</th><th>Eff.</th>
                    </tr></thead>
                    <tbody>
                      {(dept.employees||[]).map((e,j) => (
                        <tr key={j}>
                          <td>
                            <div style={{ fontWeight:700, color:C.navy }}>{e.employeeName||`#${e.employeeId}`}</div>
                            <div style={{ fontSize:10, color:C.muted }}>{e.designation}</div>
                          </td>
                          <td><b style={{ color:C.teal   }}>{e.fullDays   ??0}</b></td>
                          <td><b style={{ color:C.amber  }}>{e.halfDays   ??0}</b></td>
                          <td><b style={{ color:C.red    }}>{e.absentDays ??0}</b></td>
                          <td><b style={{ color:C.indigo }}>{e.leaveDays  ??0}</b></td>
                          <td style={{ fontWeight:800 }}>{e.totalWorkHours??0}h</td>
                          <td><span style={{ background:"rgba(6,182,212,.1)", color:C.teal, fontWeight:900, fontSize:12, padding:"2px 8px", borderRadius:6 }}>{e.effectiveDays??0}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Single employee payroll */}
        {monthlyView === "employee" && (
          loading.monthly ? (
            <div className="main-card" style={{ padding:56, textAlign:"center", color:C.muted }}>
              <div style={{ width:32, height:32, borderRadius:"50%", border:`3px solid ${C.coral}`,
                borderTopColor:"transparent", animation:"spin .8s linear infinite", margin:"0 auto 12px" }}/>
              <div style={{ fontSize:13 }}>Fetching…</div>
            </div>
          ) : !selEmpId ? (
            <div className="main-card" style={{ padding:48, textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.navy }}>Search for an employee</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Type a name or ID above to fetch their monthly presence</div>
            </div>
          ) : !payrollData ? (
            <div className="main-card" style={{ padding:48, textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.navy }}>No data found</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>No presence records for this employee in the selected month</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {/* Person header */}
              <div className="main-card fade-up" style={{ padding:"18px 24px", background:`linear-gradient(135deg,${C.navy},#1a3352)` }}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:48, height:48, borderRadius:14,
                    background:`linear-gradient(135deg,${C.coral},#06B6D4)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"#fff", fontSize:20, fontWeight:900 }}>
                    {String(payrollData.employeeName||empSearch||"?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily:"Sora,sans-serif", fontSize:16, fontWeight:900, color:"#fff" }}>
                      {payrollData.employeeName || `Person #${selEmpId}`}
                    </div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginTop:2 }}>
                      {payrollData.monthName} {payrollData.year} · {payrollData.workingDays||0} working days
                    </div>
                  </div>
                  <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                    <button className="btn-ghost" onClick={exportPayoutsCSV}
                      style={{ background:"rgba(255,255,255,.1)", borderColor:"rgba(255,255,255,.2)", color:"#fff" }}>
                      <Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={12} color="#fff"/> CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:12 }}>
                {[
                  { label:"Full Days",    val:payrollData.fullDays    ?? payrollData.summary?.fullDays    ?? 0, color:C.teal   },
                  { label:"Half Days",    val:payrollData.halfDays    ?? payrollData.summary?.halfDays    ?? 0, color:C.amber  },
                  { label:"Partial Days", val:payrollData.partialDays ?? payrollData.summary?.partialDays ?? 0, color:C.purple },
                  { label:"Absent",       val:payrollData.absentDays  ?? payrollData.summary?.absentDays  ?? 0, color:C.red    },
                  { label:"TimeAway Days",   val:payrollData.leaveDays   ?? payrollData.summary?.leaveDays   ?? 0, color:C.indigo },
                  { label:"Work Hours",   val:`${(payrollData.totalWorkHours ?? payrollData.summary?.totalWorkHours ?? 0).toFixed?.(1) ?? 0}h`, color:C.coral },
                  { label:"Eff. Days",    val:(payrollData.effectiveDays ?? payrollData.summary?.effectiveDays ?? 0).toFixed?.(2) ?? 0, color:C.teal },
                ].map((s,i) => (
                  <div key={i} className="stat-card fade-up" style={{ padding:"14px 16px", animationDelay:`${i*.04}s` }}>
                    <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:C.muted, marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontFamily:"Sora,sans-serif", fontSize:26, fontWeight:900, color:s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Day-by-day table — includes Clock In / Clock Out */}
              <div className="main-card fade-up3">
                <div style={{ padding:"14px 22px", borderBottom:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, fontWeight:800, color:C.navy }}>Day-by-Day Breakdown</span>
                  <span style={{ fontSize:11, color:C.muted }}>
                    {(payrollData.dailyRecords ?? payrollData.summary?.dailyRecords ?? []).length} records
                  </span>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table className="adm-table">
                    <thead><tr>
                      <th>Date</th><th>Day</th><th>Type</th>
                      <th>Clock In</th><th>Clock Out</th>
                      <th>Work Hours</th><th>Effective Value</th>
                    </tr></thead>
                    <tbody>
                      {(payrollData.dailyRecords ?? payrollData.summary?.dailyRecords ?? []).map((r,i) => (
                        <tr key={i} style={{ opacity: r.type === "UPCOMING" ? 0.5 : 1 }}>
                          <td style={{ fontWeight:700 }}>{r.date}</td>
                          <td style={{ fontSize:11, color:C.muted }}>{r.dayOfWeek}</td>
                          <td>{statusBadge(r.type?.replace(/_/g," "))}</td>
                          <td style={{ fontSize:12, color:C.muted }}>
                            {r.startTime ? fmtTime(r.startTime) : "—"}
                          </td>
                          <td>
                            {r.endTime ? (
                              <span style={{ fontSize:12, fontWeight:700, color:C.teal,
                                background:"rgba(6,182,212,.08)", padding:"2px 8px", borderRadius:6 }}>
                                {fmtTime(r.endTime)}
                              </span>
                            ) : <span style={{ fontSize:11, color:C.muted }}>—</span>}
                          </td>
                          <td style={{ fontFamily:"Sora,sans-serif", fontWeight:700 }}>
                            {r.type === "WEEKEND" || r.type === "UPCOMING" ? "—" : `${r.workHours ?? 0}h`}
                          </td>
                          <td>
                            <span style={{ fontFamily:"Sora,sans-serif", fontWeight:900,
                              color: r.effectiveValue >= 1 ? C.teal : r.effectiveValue >= 0.5 ? C.amber : r.effectiveValue > 0 ? C.purple : C.muted }}>
                              {r.type === "WEEKEND" || r.type === "UPCOMING" ? "—" : (r.effectiveValue ?? 0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  TAB: TRENDS
  // ═══════════════════════════════════════════════════════════════════════════
  const renderTrends = () => {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const weekData = days.map((d,i) => ({
      day: d,
      present: i <= todayIdx ? Math.max(0, liveStats.total - Math.floor(Math.random() * Math.max(1, Math.ceil(liveStats.total * .3)))) : null,
      absent:  i <= todayIdx ? Math.floor(Math.random() * Math.max(1, Math.ceil(liveStats.total * .2))) : null,
      isToday: i === todayIdx,
    }));
    const maxW = Math.max(...weekData.filter(d => d.present !== null).map(d => d.present + d.absent), 1);

    const deptEff = (() => {
      const map = {};
      employees.forEach(e => {
        const hrs = parseFloat(String(e.hours)) || 0;
        if (!map[e.department]) map[e.department] = { count:0, totalHrs:0 };
        map[e.department].count++;
        map[e.department].totalHrs += hrs;
      });
      return Object.entries(map).slice(0,6).map(([dept,v],i) => ({
        dept: dept.length > 12 ? dept.slice(0,10)+"…" : dept,
        avgHrs: v.count ? Math.round((v.totalHrs/v.count)*10)/10 : 0,
        headcount: v.count,
        color: [C.teal,C.coral,C.amber,C.indigo,C.purple,C.green][i%6],
      }));
    })();
    const maxHrs = Math.max(...deptEff.map(d => d.avgHrs), 1);

    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {/* Weekly bar chart */}
        <div className="main-card fade-up" style={{ padding:24 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:C.navy }}>Weekly Presence Overview</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Present vs Absent — this week</div>
            </div>
            <div style={{ display:"flex", gap:14 }}>
              {[["Present",C.teal],["Absent",C.red]].map(([l,c]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:600, color:C.muted }}>
                  <div style={{ width:12, height:12, borderRadius:3, background:c }}/>{l}
                </div>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 490 120" style={{ width:"100%", height:120, display:"block" }}>
            {[0,40,80,120].map(y => (
              <line key={y} x1={0} y1={y} x2={490} y2={y} stroke={C.border} strokeWidth={0.5}/>
            ))}
            {weekData.map((d,i) => {
              const x = i * 70;
              const ph = d.present !== null ? (d.present/maxW)*90 : 0;
              const ah = d.present !== null ? (d.absent/maxW)*90 : 0;
              return (
                <g key={i}>
                  {d.present !== null && <>
                    <rect x={x+10} y={100-ph} width={22} height={ph} rx={4} fill={C.teal} opacity={d.isToday?1:.7}/>
                    <rect x={x+34} y={100-ah} width={22} height={ah} rx={4} fill={C.red} opacity={d.isToday?1:.7}/>
                    {d.present > 0 && <text x={x+21} y={98-ph} textAnchor="middle" fontSize={7} fill={C.teal} fontWeight={700}>{d.present}</text>}
                    {d.absent  > 0 && <text x={x+45} y={98-ah} textAnchor="middle" fontSize={7} fill={C.red}  fontWeight={700}>{d.absent}</text>}
                  </>}
                  {d.present === null && (
                    <text x={x+33} y={70} textAnchor="middle" fontSize={8} fill={C.border} fontWeight={600}>—</text>
                  )}
                  <text x={x+33} y={115} textAnchor="middle" fontSize={9}
                    fill={d.isToday?C.coral:C.muted} fontWeight={d.isToday?800:600} fontFamily="DM Sans,sans-serif">{d.day}</text>
                  {d.isToday && <rect x={x+10} y={108} width={46} height={3} rx={2} fill={C.coral}/>}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dept avg hours + status breakdown */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div className="main-card fade-up2" style={{ padding:22 }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:16 }}>Avg Work Hours by Department</div>
            {deptEff.length === 0 ? (
              <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:12 }}>No data</div>
            ) : deptEff.map((d,i) => (
              <div key={i} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:C.navy }}>{d.dept}</span>
                  <span style={{ fontSize:12, fontWeight:900, color:d.color, fontFamily:"Sora,sans-serif" }}>{d.avgHrs}h</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ flex:1, height:8, background:C.border, borderRadius:999, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(d.avgHrs/maxHrs)*100}%`, background:d.color, borderRadius:999, transition:"width .8s ease" }}/>
                  </div>
                  <span style={{ fontSize:10, color:C.muted, fontWeight:600, minWidth:50, textAlign:"right" }}>{d.headcount} emp</span>
                </div>
              </div>
            ))}
          </div>

          <div className="main-card fade-up2" style={{ padding:22 }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:16 }}>Today's Presence Breakdown</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
              <Donut segments={[
                { label:"Present", value:liveStats.present, color:C.teal   },
                { label:"Absent",  value:liveStats.absent,  color:C.red    },
                { label:"TimeAway",   value:liveStats.onTimeAway, color:C.amber  },
                { label:"Break",   value:liveStats.onBreak, color:C.indigo },
              ]} size={120} stroke={18} label={liveStats.total} sublabel="total"/>
            </div>
            {[
              { label:"Present",  val:liveStats.present,  color:C.teal,   pct:presentPct },
              { label:"Absent",   val:liveStats.absent,   color:C.red,    pct:liveStats.total?Math.round(liveStats.absent/liveStats.total*100):0 },
              { label:"On TimeAway", val:liveStats.onTimeAway,  color:C.amber,  pct:liveStats.total?Math.round(liveStats.onTimeAway/liveStats.total*100):0 },
              { label:"On Break", val:liveStats.onBreak,  color:C.indigo, pct:liveStats.total?Math.round(liveStats.onBreak/liveStats.total*100):0 },
            ].map((r,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:10, height:10, borderRadius:3, background:r.color, flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:600, color:C.muted, flex:1 }}>{r.label}</span>
                <div style={{ width:80, height:6, background:C.border, borderRadius:999, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${r.pct}%`, background:r.color, borderRadius:999, transition:"width .8s ease" }}/>
                </div>
                <span style={{ fontSize:12, fontWeight:900, color:r.color, fontFamily:"Sora,sans-serif", minWidth:24, textAlign:"right" }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  TAB: TIMESHEETS
  // ═══════════════════════════════════════════════════════════════════════════
  const renderTimesheets = () => (
    <div className="main-card fade-up">
      <div style={{ padding:"16px 22px", borderBottom:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ fontSize:15, fontWeight:800, color:C.navy, fontFamily:"Sora,sans-serif", margin:"0 0 2px" }}>Timesheets</h2>
          <span style={{ fontSize:11, color:C.muted }}>{timesheets.length} records</span>
        </div>
        <div className="dl-strip">
          <button className="btn-ghost" onClick={() => {
            const rows = (timesheets||[]).map(t => ({ ID:t.id, "Emp ID":t.employeeId, Name:t.employeeName||"", Task:t.tasks||"", Remarks:t.remarks||"", Date:fmtDate(t.submittedAt) }));
            downloadCSV(rows, `timesheets-${today()}.csv`);
          }}><Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={13}/> CSV</button>
          <button className="btn-ghost" onClick={() => {
            const rows = (timesheets||[]).map(t => ({ ID:t.id, "Emp ID":t.employeeId, Name:t.employeeName||"", Task:t.tasks||"", Date:fmtDate(t.submittedAt) }));
            downloadPDF("Timesheets Report", rows, `timesheets-${today()}.html`);
          }}><Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={13}/> PDF</button>
          <button className="btn-coral" onClick={fetchTimesheets} disabled={loading.ts}>
            {loading.ts ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table className="adm-table">
          <thead><tr><th>#ID</th><th>Person</th><th>Tasks</th><th>Remarks</th><th>Submitted</th></tr></thead>
          <tbody>
            {loading.ts ? (
              <tr><td colSpan={5} style={{ padding:56, textAlign:"center", color:C.muted }}>Loading…</td></tr>
            ) : timesheets.length === 0 ? (
              <tr><td colSpan={5} style={{ padding:40, textAlign:"center", color:C.muted }}>No timesheets found.</td></tr>
            ) : timesheets.map(t => (
              <tr key={t.id}>
                <td><span style={{ fontSize:12, fontWeight:800, color:C.coral, fontFamily:"Sora,sans-serif" }}>#{t.id}</span></td>
                <td>
                  <div style={{ fontWeight:700, color:C.navy }}>{t.employeeName || `Emp #${t.employeeId}`}</div>
                  <div style={{ fontSize:10, color:C.muted }}>Session #{t.sessionId}</div>
                </td>
                <td style={{ maxWidth:220, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontSize:12 }}>{t.tasks||"—"}</td>
                <td style={{ maxWidth:180, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontSize:12, color:C.muted }}>{t.remarks||"—"}</td>
                <td style={{ fontWeight:700, color:C.navy, fontFamily:"Sora,sans-serif", fontSize:12 }}>{fmtDate(t.submittedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  //  TAB: ASSIGN
  // ═══════════════════════════════════════════════════════════════════════════
  const renderAssign = () => (
    <div className="main-card fade-up" style={{ padding:22 }}>
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontSize:15, fontWeight:800, color:C.navy, fontFamily:"Sora,sans-serif", margin:"0 0 4px" }}>Assign Presence / TimeAway</h2>
        <p style={{ fontSize:12, color:C.muted, margin:0 }}>Manually assign presence or time away to any employee</p>
      </div>
      <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:7,
        background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"8px 12px" }}>
        <Ic d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" size={13}/>
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Filter employees…"
          style={{ border:"none", background:"transparent", outline:"none", fontSize:12, color:C.navy, width:"100%" }}/>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:460, overflowY:"auto" }}>
        {employees.filter(e => !searchQ || e.name.toLowerCase().includes(searchQ.toLowerCase())).map(emp => (
          <div key={emp.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"14px 18px", background:C.bg, borderRadius:12, border:`1px solid ${C.border}`, transition:"background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#eef2f8"}
            onMouseLeave={e => e.currentTarget.style.background = C.bg}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:10,
                background:`linear-gradient(135deg,${C.coral},#06B6D4)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:14, fontWeight:900 }}>
                {String(emp.name||"?")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.navy }}>{emp.name}</div>
                <div style={{ fontSize:11, color:C.muted }}>{emp.email} · {emp.department}{emp.employeeId ? ` · ${emp.employeeId}` : ""}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button className="btn-coral" style={{ padding:"7px 14px", fontSize:11 }}
                onClick={() => { setAssignModal(emp); setAssignForm({ status:"Present", startDate:today(), endDate:today(), reason:"" }); }}>
                Presence
              </button>
              <button style={{ padding:"7px 14px", fontSize:11,
                background:`linear-gradient(135deg,${C.amber},#fbbf24)`, color:"#fff",
                border:"none", borderRadius:10, cursor:"pointer", fontWeight:800 }}
                onClick={() => { setTimeAwayModal(emp); setTimeAwayForm({ startDate:today(), endDate:today() }); }}>
                TimeAway
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  //  TAB: REPORTS
  // ═══════════════════════════════════════════════════════════════════════════
  const renderSignalReports = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Status donut + dept bar */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="main-card fade-up" style={{ padding:22 }}>
          <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:14 }}>Workforce Status Today</div>
          <div style={{ display:"flex", gap:20, alignItems:"center" }}>
            <Donut segments={[
              { label:"Present", value:liveStats.present, color:C.teal   },
              { label:"Absent",  value:liveStats.absent,  color:C.red    },
              { label:"TimeAway",   value:liveStats.onTimeAway, color:C.amber  },
              { label:"Break",   value:liveStats.onBreak, color:C.indigo },
            ]} size={100} stroke={16} label={liveStats.total} sublabel="total"/>
            <div style={{ flex:1 }}>
              {[["Present",liveStats.present,C.teal],["Absent",liveStats.absent,C.red],["TimeAway",liveStats.onTimeAway,C.amber],["Break",liveStats.onBreak,C.indigo]].map(([l,v,c]) => (
                <div key={l} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, fontWeight:600, marginBottom:3 }}>
                    <span>{l}</span>
                    <b style={{ color:C.navy }}>{v} <span style={{ color:C.muted, fontWeight:400 }}>({liveStats.total?Math.round(v/liveStats.total*100):0}%)</span></b>
                  </div>
                  <ProgressBar pct={liveStats.total ? v/liveStats.total*100 : 0} color={c} height={5}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export panel */}
        <div className="main-card fade-up2" style={{ padding:22 }}>
          <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:16 }}>Export SignalReports</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              {
                title:"Live Presence",
                desc:"Current day — includes Clock In & Clock Out times",
                onCSV: exportLiveCSV,
                onPDF: exportLivePDF,
              },
              {
                title:"Monthly Summary",
                desc:"Full month presence summary for all employees",
                onCSV: exportMonthlyCSV,
                onPDF: exportMonthlyPDF,
              },
              {
                title:"Timesheets",
                desc:"All employee timesheets",
                onCSV: () => {
                  const rows = (timesheets||[]).map(t => ({ ID:t.id, "Emp ID":t.employeeId, Name:t.employeeName||"", Task:t.tasks||"", Date:fmtDate(t.submittedAt) }));
                  downloadCSV(rows, `timesheets-${today()}.csv`);
                },
                onPDF: () => {
                  const rows = (timesheets||[]).map(t => ({ ID:t.id, "Emp ID":t.employeeId, Name:t.employeeName||"", Task:t.tasks||"", Date:fmtDate(t.submittedAt) }));
                  downloadPDF("Timesheets", rows, `timesheets.html`);
                },
              },
            ].map((item,i) => (
              <div key={i} style={{ padding:14, background:C.bg, borderRadius:14, border:`1.5px solid ${C.border}` }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:3 }}>{item.title}</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>{item.desc}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn-ghost" style={{ fontSize:11, padding:"6px 12px" }} onClick={item.onCSV}>
                    <Ic d="M12 10v6m0 0l-3-3m3 3l3-3" size={12}/> CSV
                  </button>
                  <button className="btn-ghost" style={{ fontSize:11, padding:"6px 12px" }} onClick={item.onPDF}>
                    <Ic d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" size={12}/> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Tab router ─────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return renderControlRoom();
      case "live":      return renderLive();
      case "monthly":   return renderMonthly();
      case "trends":    return renderTrends();
      case "leave":     return <TimeAwayOperations/>;
      case "timesheet": return renderTimesheets();
      case "assign":    return renderAssign();
      case "reports":   return renderSignalReports();
      default:          return null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{CSS}</style>
      <div className="adm-att">

        {/* Hero banner */}
        <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#1a3352 100%)`,
          borderRadius:20, padding:"20px 28px", marginBottom:22,
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-40, right:60, width:200, height:200,
            borderRadius:"50%", background:"rgba(139,92,246,.08)", filter:"blur(50px)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14, position:"relative" }}>
            <div>
              <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:900, color:"#fff", margin:"0 0 5px" }}>
                Presence Operations
              </h1>
              <p style={{ fontSize:12, color:"rgba(255,255,255,.45)", margin:0 }}>
                Live tracking · Monthly analytics · Payouts-ready reports
              </p>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
              {/* Live indicator */}
              <div style={{ display:"flex", alignItems:"center", gap:7,
                background:"rgba(6,182,212,.15)", border:"1px solid rgba(6,182,212,.3)",
                borderRadius:999, padding:"5px 14px" }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:C.teal, display:"block", animation:"pulse 2s infinite" }}/>
                <span style={{ fontSize:11, fontWeight:800, color:C.teal }}>Live · Auto-refresh 30s</span>
              </div>
              {/* Quick KPIs */}
              {[
                { label:"Present", val:liveStats.present, color:C.teal  },
                { label:"Absent",  val:liveStats.absent,  color:C.red   },
                { label:"Pending", val:liveStats.pending, color:C.coral },
              ].map(k => (
                <div key={k.label} style={{ background:"rgba(255,255,255,.08)", borderRadius:12, padding:"6px 14px", textAlign:"center" }}>
                  <div style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:900, color:k.color }}>{loading.stats ? "—" : k.val}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,.4)", fontWeight:700, textTransform:"uppercase", letterSpacing:".06em" }}>{k.label}</div>
                </div>
              ))}
              <button className="btn-coral" onClick={() => { fetchStats(); fetchPersons(); fetchTimesheets(); }}
                disabled={loading.stats||loading.emp}>
                {(loading.stats||loading.emp) ? "Loading…" : "↻ Refresh All"}
              </button>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, marginBottom:20 }}>
          {TABS.map(tab => (
            <button key={tab.id} className={`tab-pill ${activeTab===tab.id?"active":""}`}
              onClick={() => setActiveTab(tab.id)}>
              <Ic d={tab.icon} size={13} sw={activeTab===tab.id?2.5:1.8}/>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderContent()}

        {/* ── Assign Presence Modal ── */}
        {assignModal && (
          <div className="modal-overlay" onClick={() => setAssignModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-hdr">
                <h3 style={{ fontFamily:"Sora,sans-serif", fontSize:16, fontWeight:900, color:"#fff", margin:"0 0 4px" }}>Assign Presence</h3>
                <p style={{ fontSize:11, color:"rgba(255,255,255,.4)", margin:0 }}>
                  {assignModal.name} · {assignModal.department}{assignModal.employeeId ? ` · ${assignModal.employeeId}` : ""}
                </p>
              </div>
              <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div>
                  <label className="modal-label">Status</label>
                  <select value={assignForm.status}
                    onChange={e => setAssignForm(p => ({ ...p, status:e.target.value }))}
                    className="adm-select" style={{ width:"100%" }}>
                    {["Present","Absent","Half Day","TimeAway","Compensation Off","Saturday Work","Sunday Work"].map(s =>
                      <option key={s}>{s}</option>
                    )}
                  </select>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[["Start Date","startDate"],["End Date","endDate"]].map(([lbl,key]) => (
                    <div key={key}>
                      <label className="modal-label">{lbl}</label>
                      <input type="date" value={assignForm[key]} className="adm-input" style={{ width:"100%" }}
                        onChange={e => setAssignForm(p => ({ ...p, [key]:e.target.value }))}/>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="modal-label">Reason (optional)</label>
                  <textarea rows={3} value={assignForm.reason} placeholder="Optional reason…"
                    className="adm-input" style={{ width:"100%", resize:"none" }}
                    onChange={e => setAssignForm(p => ({ ...p, reason:e.target.value }))}/>
                </div>
                <div style={{ display:"flex", gap:10, marginTop:4 }}>
                  <button className="btn-ghost" style={{ flex:1 }} onClick={() => setAssignModal(null)}>Cancel</button>
                  <button className="btn-coral" style={{ flex:2 }} onClick={handleAssign} disabled={saving}>
                    {saving ? "Assigning…" : "Assign Presence"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Assign TimeAway Modal ── */}
        {leaveModal && (
          <div className="modal-overlay" onClick={() => setTimeAwayModal(null)}>
            <div className="modal-box" style={{ maxWidth:420 }} onClick={e => e.stopPropagation()}>
              <div className="modal-hdr">
                <h3 style={{ fontFamily:"Sora,sans-serif", fontSize:16, fontWeight:900, color:"#fff", margin:"0 0 4px" }}>Assign TimeAway</h3>
                <p style={{ fontSize:11, color:"rgba(255,255,255,.4)", margin:0 }}>{leaveModal.name}{leaveModal.employeeId ? ` · ${leaveModal.employeeId}` : ""}</p>
              </div>
              <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[["Start Date","startDate"],["End Date","endDate"]].map(([lbl,key]) => (
                  <div key={key}>
                    <label className="modal-label">{lbl}</label>
                    <input type="date" value={leaveForm[key]} className="adm-input" style={{ width:"100%" }}
                      onChange={e => setTimeAwayForm(p => ({ ...p, [key]:e.target.value }))}/>
                  </div>
                ))}
                <div style={{ display:"flex", gap:10, marginTop:4 }}>
                  <button className="btn-ghost" style={{ flex:1 }} onClick={() => setTimeAwayModal(null)}>Cancel</button>
                  <button style={{ flex:2,
                    background:`linear-gradient(135deg,${C.amber},#fbbf24)`, color:"#fff",
                    border:"none", borderRadius:10, padding:"10px 0",
                    fontSize:13, fontWeight:800, cursor:"pointer", opacity:saving?0.6:1 }}
                    onClick={handleTimeAway} disabled={saving}>
                    {saving ? "Assigning…" : "Assign TimeAway"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}