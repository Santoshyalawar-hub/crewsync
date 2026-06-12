// import React, { useState, useEffect, useMemo } from "react";

// // ── API BASE URL (identical to original) ─────────────────────────────────────
// const getApiBaseUrl = () => {
//   try {
//     if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL)
//       return import.meta.env.VITE_API_BASE_URL;
//   } catch { /* ignore */ }
//   if (typeof window !== "undefined") {
//     if (window.__API_BASE_URL__) return window.__API_BASE_URL__;
//     if (window.location.hostname === "localhost") return "http://localhost:8080";
//     return `${window.location.protocol}//${window.location.host}`;
//   }
//   return "";
// };

// // ── Tokens ────────────────────────────────────────────────────────────────────
// const CORAL = "#8B5CF6";
// const TEAL  = "#06B6D4";
// const NAVY  = "#0B1020";
// const SURF  = "#F6F8FB";

// // ── Minimal SVG icon (replaces lucide) ────────────────────────────────────────
// const Ic = ({ d, size = 16, sw = 1.8, color = "currentColor" }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//     stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
//     {[].concat(d).map((p, i) => <path key={i} d={p} />)}
//   </svg>
// );

// const ICONS = {
//   file:     ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6"],
//   download: ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
//   eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 100 6 3 3 0 000-6z"],
//   checkCircle: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
//   xCircle:  ["M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2", "M12 2a10 10 0 100 20 10 10 0 000-20z"],
//   search:   "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
//   filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
//   clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
//   users:    ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"],
//   folder:   "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
//   shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
//   refresh:  ["M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"],
//   chevR:    "M9 18l6-6-6-6",
//   chevD:    "M6 9l6 6 6-6",
//   warn:     ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v2m0 4h.01"],
//   alert:    "M22 12h-4l-3 9L9 3l-3 9H2",
//   pkg:      "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
//   calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
// };

// // ── Status helpers (matches original getStatusColor / getStatusIcon logic) ────
// const STATUS_META = {
//   APPROVED:  { fg: "#16a34a", bg: "#f0fdf4", label: "Approved",  icon: "checkCircle" },
//   REJECTED:  { fg: "#ef4444", bg: "#fef2f2", label: "Rejected",  icon: "xCircle"     },
//   PENDING:   { fg: "#f59e0b", bg: "#fffbeb", label: "Pending",   icon: "clock"       },
//   SUBMITTED: { fg: CORAL,     bg: "#fff7ed", label: "Submitted", icon: "clock"       },
// };
// const sMeta = (s) => STATUS_META[(s || "").toUpperCase()] || { fg: "#6b7280", bg: "#f9fafb", label: s || "N/A", icon: "alert" };

// const StatusBadge = ({ status }) => {
//   const m = sMeta(status);
//   return (
//     <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 800,
//       textTransform: "uppercase", letterSpacing: ".06em", color: m.fg, background: m.bg,
//       padding: "3px 9px", borderRadius: 999, border: `1px solid ${m.fg}22` }}>
//       <Ic d={ICONS[m.icon]} size={11} sw={2.5} color={m.fg} />
//       {m.label}
//     </span>
//   );
// };

// const initials = (n = "") => n.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "E";

// // ── Shared style primitives ───────────────────────────────────────────────────
// const card  = { background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", boxShadow: "0 2px 12px rgba(13,31,45,.05)" };
// const btnC  = { background: `linear-gradient(135deg,${CORAL},#06B6D4)`, color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", display: "flex", alignItems: "center", gap: 6 };
// const iSt   = { padding: "9px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12, outline: "none", fontFamily: "'DM Sans',sans-serif", color: NAVY, boxSizing: "border-box" };

// // ══════════════════════════════════════════════════════════════════════════════
// //  MAIN COMPONENT — identical logic to original
// // ══════════════════════════════════════════════════════════════════════════════
// const OperatorVault = () => {
//   const [employees,        setPersons]        = useState([]);
//   const [expandedPerson, setExpandedPerson] = useState(null);
//   const [search,           setSearch]           = useState("");
//   const [statusFilter,     setStatusFilter]     = useState("ALL");
//   const [loading,          setLoading]          = useState(false);
//   const [message,          setMessage]          = useState({ type: "", text: "" });
//   const [refreshing,       setRefreshing]       = useState(false);
//   const [authChecked,      setAuthChecked]      = useState(false);
//   const [isAuthenticated,  setIsAuthenticated]  = useState(false);

//   // ── Auth check (identical to original) ──
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token    = localStorage.getItem("token");
//       const userRole = localStorage.getItem("userRole");
//       const userId   = localStorage.getItem("userId");
//       console.log("=== Authentication Check ===");
//       console.log("🔑 Token exists:", !!token);
//       console.log("👤 User ID:", userId);
//       console.log("🛡️ User Role:", userRole);
//       if (!token) {
//         showMessage("error", "No authentication token found. Please login again.");
//         setTimeout(() => { window.location.href = "/login"; }, 2000);
//         setAuthChecked(true); return;
//       }
//       if (userRole !== "ADMIN") {
//         showMessage("error", `Access denied. Operator privileges required. Your role: ${userRole || "none"}`);
//         setAuthChecked(true); return;
//       }
//       console.log("✅ Authentication successful - Operator access granted");
//       setIsAuthenticated(true); setAuthChecked(true);
//     };
//     checkAuth();
//   }, []);

//   useEffect(() => {
//     if (authChecked && isAuthenticated) fetchAllVault();
//   }, [authChecked, isAuthenticated]); // eslint-disable-line

//   const showMessage = (type, text) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: "", text: "" }), 5000);
//   };

//   // ── Fetch (identical to original) ──
//   const fetchAllVault = async (showRefreshMessage = false) => {
//     if (showRefreshMessage) setRefreshing(true); else setLoading(true);
//     try {
//       const baseUrl    = getApiBaseUrl();
//       const token      = localStorage.getItem("token");
//       const tenantCode = localStorage.getItem("tenantCode");
//       const companyId  = localStorage.getItem("companyId");
//       const response   = await fetch(`${baseUrl}/api/documents/admin/all-documents`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "X-Tenant-Code": tenantCode, "X-Workspace-Id": companyId },
//       });
//       if (!response.ok) throw new Error(`Failed to load documents (${response.status})`);
//       setPersons(await response.json());
//     } catch (err) { showMessage("error", err.message); }
//     finally { setLoading(false); setRefreshing(false); }
//   };

//   // ── Filters (identical to original) ──
//   const filteredPersons = useMemo(() => employees.filter(emp => {
//     const matchesSearch = search.trim() === "" ||
//       emp.name?.toLowerCase().includes(search.toLowerCase()) ||
//       emp.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
//       emp.email?.toLowerCase().includes(search.toLowerCase());
//     if (statusFilter !== "ALL") {
//       return matchesSearch && emp.documents?.some(d => d.status?.toUpperCase() === statusFilter);
//     }
//     return matchesSearch;
//   }), [employees, search, statusFilter]);

//   const togglePerson = (employeeId) =>
//     setExpandedPerson(expandedPerson === employeeId ? null : employeeId);

//   // ── Download handlers (identical to original) ──
//   const handleDownload = async (doc, event) => {
//     if (event) event.stopPropagation();
//     if (!doc?.id) { showMessage("error", "Invalid document"); return; }
//     try {
//       showMessage("info", `Downloading ${doc.fileName || "document"}...`);
//       const baseUrl = getApiBaseUrl();
//       const token   = localStorage.getItem("token");
//       const downloadUrl = `${baseUrl}/api/documents/download/${doc.id}`;
//       console.log("⬇️ Downloading from:", downloadUrl);
//       try {
//         const response = await fetch(downloadUrl, { method: "GET", headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
//         if (!response.ok) throw new Error(`Download failed with status ${response.status}`);
//         const blob = await response.blob();
//         const url  = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url; link.download = doc.fileName || "document"; link.style.display = "none";
//         document.body.appendChild(link); link.click();
//         setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
//         showMessage("success", `Downloaded ${doc.fileName || "document"}`);
//       } catch (fetchError) {
//         console.log("⚠️ Direct download failed, opening in new tab");
//         window.open(downloadUrl, "_blank");
//         showMessage("info", `Opened ${doc.fileName || "document"} in new tab`);
//       }
//     } catch (error) {
//       console.error("❌ Download error:", error);
//       showMessage("error", `Failed to download ${doc.fileName || "document"}`);
//     }
//   };

//   const handleDownloadAll = async (employee, event) => {
//     if (event) event.stopPropagation();
//     const validDocs = employee.documents || [];
//     if (!validDocs.length) { showMessage("error", "No documents available for download"); return; }
//     showMessage("info", `Preparing to download ${validDocs.length} document(s)...`);
//     let successCount = 0, failCount = 0;
//     for (let i = 0; i < validDocs.length; i++) {
//       try { if (i > 0) await new Promise(r => setTimeout(r, 800)); await handleDownload(validDocs[i], null); successCount++; }
//       catch (error) { failCount++; console.error(`Failed to download document ${i + 1}:`, error); }
//     }
//     if (failCount === 0) showMessage("success", `All ${successCount} document(s) downloaded successfully`);
//     else showMessage("error", `Downloaded ${successCount} documents, ${failCount} failed`);
//   };

//   const handleViewDocument = (doc, event) => {
//     if (event) event.stopPropagation();
//     if (!doc?.id) { showMessage("error", "Invalid document"); return; }
//     window.open(`${getApiBaseUrl()}/api/documents/download/${doc.id}`, "_blank");
//   };

//   // ── Statistics (identical to original) ──
//   const stats = useMemo(() => {
//     const allDocs = employees.flatMap(emp => emp.documents || []);
//     return {
//       totalPersons: employees.length,
//       totalDocs: allDocs.length,
//       pending:  allDocs.filter(d => d.status?.toUpperCase() === "PENDING" || d.status?.toUpperCase() === "SUBMITTED").length,
//       approved: allDocs.filter(d => d.status?.toUpperCase() === "APPROVED").length,
//       rejected: allDocs.filter(d => d.status?.toUpperCase() === "REJECTED").length,
//     };
//   }, [employees]);

//   // ── Loading / Access denied screens (identical logic) ──
//   if (!authChecked) return (
//     <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(139,92,246,.2)", borderTopColor: CORAL, animation: "doc-spin 1s linear infinite", margin: "0 auto 16px" }} />
//         <p style={{ fontSize: 14, color: "#6b7280", fontFamily: "'DM Sans',sans-serif" }}>Checking authentication…</p>
//       </div>
//     </div>
//   );

//   if (authChecked && !isAuthenticated) {
//     const currentUserRole = localStorage.getItem("userRole");
//     return (
//       <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
//         <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 24px 60px rgba(13,31,45,.1)" }}>
//           <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//             <Ic d={ICONS.shield} size={28} sw={2} color="#ef4444" />
//           </div>
//           <h2 style={{ fontSize: 20, fontWeight: 900, color: NAVY, fontFamily: "'Sora',sans-serif", marginBottom: 8 }}>Access Denied</h2>
//           <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>You need admin privileges to access this page.</p>
//           <div style={{ background: SURF, borderRadius: 10, padding: "12px 16px", marginBottom: 20, textAlign: "left" }}>
//             <p style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>Current Role</p>
//             <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, fontFamily: "'Sora',sans-serif", margin: 0 }}>{currentUserRole || "Not authenticated"}</p>
//           </div>
//           <button onClick={() => window.location.href = "/login"} style={{ ...btnC, width: "100%", justifyContent: "center", padding: "12px 0", borderRadius: 12 }}>
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ══════════════════════════════════════
//   //  MAIN RENDER
//   // ══════════════════════════════════════
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
//         .doc-root { font-family: 'DM Sans', sans-serif; }
//         .doc-fd   { font-family: 'Sora', sans-serif; }
//         @keyframes doc-spin { to { transform: rotate(360deg); } }
//         .doc-emp-hdr:hover { background: #fafafa; }
//         .doc-row:hover     { background: #fafafa; }
//         .doc-emp:hover     { box-shadow: 0 8px 24px rgba(13,31,45,.09) !important; }
//         .doc-icon-btn:hover { transform: scale(1.08); }
//       `}</style>

//       <div className="doc-root" style={{ maxWidth: 1200, margin: "0 auto" }}>

//         {/* ── Hero banner ── */}
//         <div style={{ background: `linear-gradient(135deg,${NAVY},#182033)`, borderRadius: 20, padding: "22px 28px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: -30, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(139,92,246,.1)", filter: "blur(40px)", pointerEvents: "none" }} />
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, position: "relative" }}>
//             <div>
//               <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                 <h1 className="doc-fd" style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}>Vault ControlRoom</h1>
//                 <span style={{ fontSize: 9, fontWeight: 800, color: CORAL, background: "rgba(139,92,246,.2)", padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: ".08em" }}>Operator</span>
//               </div>
//               <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", margin: 0 }}>
//                 Manage employee documents, track uploads, and monitor document status in one centralized location.
//               </p>
//             </div>
//             <button onClick={() => fetchAllVault(true)} disabled={refreshing || loading}
//               style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 10, padding: "9px 16px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: (refreshing || loading) ? "not-allowed" : "pointer", opacity: (refreshing || loading) ? 0.6 : 1, transition: "all .2s" }}
//               onMouseEnter={e => { if (!refreshing && !loading) e.currentTarget.style.background = "rgba(139,92,246,.2)"; }}
//               onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>
//               <Ic d={ICONS.refresh} size={13} color="#fff" />
//               {refreshing ? "Refreshing…" : "Refresh"}
//             </button>
//           </div>
//         </div>

//         {/* ── Message alert ── */}
//         {message.text && (
//           <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, marginBottom: 18, fontSize: 13, fontWeight: 600,
//             background: message.type === "success" ? "#f0fdf4" : message.type === "info" ? "rgba(6,182,212,.08)" : "#fef2f2",
//             border: `1px solid ${message.type === "success" ? "#86efac" : message.type === "info" ? "rgba(6,182,212,.3)" : "#fca5a5"}`,
//             color: message.type === "success" ? "#16a34a" : message.type === "info" ? TEAL : "#b91c1c" }}>
//             <Ic d={message.type === "success" ? ICONS.checkCircle : message.type === "info" ? ICONS.alert : ICONS.warn} size={16} />
//             <span style={{ flex: 1 }}>{message.text}</span>
//             <button onClick={() => setMessage({ type: "", text: "" })} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: 11, fontWeight: 700, textDecoration: "underline" }}>Dismiss</button>
//           </div>
//         )}

//         {/* ── Statistics Cards ── */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 22 }}>
//           {[
//             { label: "Total Vault", val: stats.totalDocs,      color: CORAL,    bg: "rgba(139,92,246,.08)",  icon: "folder"      },
//             { label: "Pending Review",  val: stats.pending,         color: "#f59e0b",bg: "rgba(245,158,11,.08)",  icon: "clock"       },
//             { label: "Approved",        val: stats.approved,        color: "#16a34a",bg: "rgba(22,163,74,.08)",   icon: "checkCircle" },
//             { label: "Rejected",        val: stats.rejected,        color: "#ef4444",bg: "rgba(239,68,68,.08)",   icon: "xCircle"     },
//           ].map(s => (
//             <div key={s.label} style={{ ...card, padding: "18px 20px" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
//                   <Ic d={ICONS[s.icon]} size={22} sw={1.8} />
//                 </div>
//                 <div>
//                   <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px" }}>{s.label}</p>
//                   <p className="doc-fd" style={{ fontSize: 24, fontWeight: 900, color: "#0B1020", margin: 0, lineHeight: 1 }}>{s.val}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── Search & Filter ── */}
//         <div style={{ ...card, padding: "16px 20px", marginBottom: 22 }}>
//           <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
//             <div style={{ position: "relative", flex: 1, maxWidth: 420, minWidth: 200 }}>
//               <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}>
//                 <Ic d={ICONS.search} size={16} sw={2} />
//               </div>
//               <input type="text" placeholder="Search by employee name, ID, or email"
//                 value={search} onChange={e => setSearch(e.target.value)}
//                 style={{ ...iSt, width: "100%", paddingLeft: 40, borderRadius: 999, background: SURF }} />
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <Ic d={ICONS.filter} size={16} sw={2} color="#9ca3af" />
//               <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//                 style={{ ...iSt, borderRadius: 999, background: SURF, cursor: "pointer", appearance: "none", padding: "9px 18px" }}>
//                 <option value="ALL">All Status</option>
//                 <option value="SUBMITTED">Submitted</option>
//                 <option value="PENDING">Pending</option>
//                 <option value="APPROVED">Approved</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* ── Section title ── */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
//           <h2 className="doc-fd" style={{ fontSize: 17, fontWeight: 900, color: NAVY, margin: 0 }}>
//             Persons List ({filteredPersons.length})
//           </h2>
//           {filteredPersons.length > 0 && (
//             <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
//               {filteredPersons.reduce((s, e) => s + (e.documents?.length || 0), 0)} total documents
//             </span>
//           )}
//         </div>

//         {/* ── Person list ── */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {loading ? (
//             <div style={{ ...card, padding: "64px", textAlign: "center" }}>
//               <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(139,92,246,.2)", borderTopColor: CORAL, animation: "doc-spin 1s linear infinite", margin: "0 auto 16px" }} />
//               <p style={{ fontSize: 14, color: "#6b7280", fontWeight: 600, margin: "0 0 4px" }}>Loading documents…</p>
//               <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Please wait</p>
//             </div>
//           ) : filteredPersons.length === 0 ? (
//             <div style={{ ...card, padding: "56px 24px", textAlign: "center" }}>
//               <div style={{ marginBottom: 12 }}><Ic d={ICONS.users} size={48} color="#d1d5db" /></div>
//               <p style={{ fontSize: 15, fontWeight: 700, color: "#6b7280", margin: "0 0 6px" }}>No employees found</p>
//               <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px" }}>
//                 {search || statusFilter !== "ALL" ? "Try adjusting your search or filters" : "No employees with documents available"}
//               </p>
//               {employees.length === 0 && !loading && (
//                 <button onClick={() => fetchAllVault(true)} style={{ ...btnC, margin: "0 auto", borderRadius: 10 }}>Retry Loading</button>
//               )}
//             </div>
//           ) : filteredPersons.map(employee => {
//             const filteredDocs = statusFilter === "ALL" ? employee.documents
//               : employee.documents?.filter(d => d.status?.toUpperCase() === statusFilter);
//             const isOpen = expandedPerson === employee.id;

//             return (
//               <div key={employee.id} className="doc-emp"
//                 style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 8px rgba(13,31,45,.04)", overflow: "hidden", border: "1px solid #f0f0f0", transition: "box-shadow .2s" }}>

//                 {/* ── Person header ── */}
//                 <div className="doc-emp-hdr" onClick={() => togglePerson(employee.id)}
//                   style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", cursor: "pointer", gap: 16, transition: "background .15s" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
//                     {/* avatar */}
//                     <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${CORAL},#06B6D4)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff", fontFamily: "'Sora',sans-serif", flexShrink: 0 }}>
//                       {initials(employee.name)}
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <h3 className="doc-fd" style={{ fontSize: 15, fontWeight: 800, color: "#0B1020", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                         {employee.name || "Unknown Person"}
//                       </h3>
//                       <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
//                         <span style={{ fontSize: 12, color: "#9ca3af" }}>ID: {employee.id}</span>
//                         {employee.email && <span style={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis" }}>{employee.email}</span>}
//                       </div>
//                     </div>
//                     {/* doc count chip */}
//                     <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,.08)", borderRadius: 999, padding: "6px 12px", flexShrink: 0 }}>
//                       <Ic d={ICONS.pkg} size={14} sw={2} color={CORAL} />
//                       <span className="doc-fd" style={{ fontSize: 13, fontWeight: 800, color: CORAL }}>{filteredDocs?.length || 0}</span>
//                     </div>
//                   </div>

//                   <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
//                     {(filteredDocs?.length || 0) > 0 && (
//                       <button onClick={e => handleDownloadAll(employee, e)} style={{ ...btnC, padding: "8px 16px" }}>
//                         <Ic d={ICONS.download} size={15} sw={2.5} color="#fff" />
//                         <span>Download All</span>
//                       </button>
//                     )}
//                     <div style={{ color: "#9ca3af", transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
//                       <Ic d={ICONS.chevR} size={22} sw={2} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ── Expanded docs table ── */}
//                 {isOpen && (
//                   <div style={{ borderTop: "1px solid #f0f0f0" }}>
//                     {filteredDocs && filteredDocs.length > 0 ? (
//                       <div style={{ overflowX: "auto" }}>
//                         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                           <thead>
//                             <tr style={{ background: SURF }}>
//                               {["Document Type", "File Name", "Status", "Uploaded On", "Actions"].map((h, i) => (
//                                 <th key={h} style={{ padding: "10px 20px", textAlign: i === 4 ? "right" : "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af" }}>{h}</th>
//                               ))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {filteredDocs.map((doc, index) => (
//                               <tr key={doc.id || index} className="doc-row"
//                                 style={{ borderTop: "1px solid #f5f5f5", transition: "background .15s" }}>
//                                 <td style={{ padding: "14px 20px" }}>
//                                   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                                     <Ic d={ICONS.file} size={15} sw={1.8} color="#9ca3af" />
//                                     <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{doc.documentType || "N/A"}</span>
//                                   </div>
//                                 </td>
//                                 <td style={{ padding: "14px 20px" }}>
//                                   <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{doc.fileName || "Unknown"}</div>
//                                   {doc.fileSize && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{doc.fileSize}</div>}
//                                 </td>
//                                 <td style={{ padding: "14px 20px" }}><StatusBadge status={doc.status} /></td>
//                                 <td style={{ padding: "14px 20px" }}>
//                                   <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
//                                     <Ic d={ICONS.calendar} size={13} sw={2} color="#9ca3af" />
//                                     {doc.uploadedOn || "N/A"}
//                                   </div>
//                                 </td>
//                                 <td style={{ padding: "14px 20px" }}>
//                                   <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
//                                     <button onClick={e => handleViewDocument(doc, e)} className="doc-icon-btn" title="View Document"
//                                       style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: SURF, border: "1.5px solid #e5e7eb", cursor: "pointer", color: "#6b7280", transition: "all .2s" }}
//                                       onMouseEnter={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = TEAL; e.currentTarget.style.background = "rgba(6,182,212,.08)"; }}
//                                       onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = SURF; }}>
//                                       <Ic d={ICONS.eye} size={14} sw={2} />
//                                     </button>
//                                     <button onClick={e => handleDownload(doc, e)} className="doc-icon-btn" title="Download Document"
//                                       style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: SURF, border: "1.5px solid #e5e7eb", cursor: "pointer", color: "#6b7280", transition: "all .2s" }}
//                                       onMouseEnter={e => { e.currentTarget.style.borderColor = CORAL; e.currentTarget.style.color = CORAL; e.currentTarget.style.background = "rgba(139,92,246,.08)"; }}
//                                       onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = SURF; }}>
//                                       <Ic d={ICONS.download} size={14} sw={2} />
//                                     </button>
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     ) : (
//                       <div style={{ padding: "48px 24px", textAlign: "center" }}>
//                         <div style={{ marginBottom: 12 }}><Ic d={ICONS.file} size={40} color="#d1d5db" /></div>
//                         <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", margin: "0 0 6px" }}>No documents found</p>
//                         <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
//                           {statusFilter !== "ALL" ? `No ${statusFilter.toLowerCase()} documents for this employee` : "This employee hasn't uploaded any documents yet"}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// };

// export default OperatorVault;

import React, { useState, useEffect, useMemo } from "react";
import api from "@/lib/apiClient";

const CORAL = "#8B5CF6", TEAL = "#06B6D4", NAVY = "#0B1020", SURF = "#F6F8FB";

const Ic = ({ d, size = 16, sw = 1.8, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  file:        ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6"],
  download:    ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  eye:         ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  checkCircle: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
  xCircle:     ["M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2","M12 2a10 10 0 100 20 10 10 0 000-20z"],
  search:      "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  filter:      "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  clock:       ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 6v6l4 2"],
  users:       ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
  folder:      "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  shield:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  refresh:     "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  chevR:       "M9 18l6-6-6-6",
  warn:        ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v2m0 4h.01"],
  alert:       "M22 12h-4l-3 9L9 3l-3 9H2",
  pkg:         "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  calendar:    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  check:       "M20 6L9 17l-5-5",
  pen:         "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  bell:        ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  send:        ["M22 2L11 13","M22 2L15 22 11 13 2 9l20-7z"],
  upload:      ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  repeat:      ["M17 1l4 4-4 4","M3 11V9a4 4 0 014-4h14","M7 23l-4-4 4-4","M21 13v2a4 4 0 01-4 4H3"],
};

const STATUS_META = {
  APPROVED:  { fg:"#16a34a", bg:"#f0fdf4", label:"Approved",  icon:"checkCircle" },
  REJECTED:  { fg:"#ef4444", bg:"#fef2f2", label:"Rejected",  icon:"xCircle"     },
  PENDING:   { fg:"#f59e0b", bg:"#fffbeb", label:"Pending",   icon:"clock"       },
  SUBMITTED: { fg:CORAL,     bg:"#fff7ed", label:"Submitted", icon:"clock"       },
};
const sMeta = (s) => STATUS_META[(s||"").toUpperCase()] || { fg:"#6b7280", bg:"#f9fafb", label:s||"N/A", icon:"alert" };

const StatusBadge = ({ status }) => {
  const m = sMeta(status);
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:800,
      textTransform:"uppercase",letterSpacing:".06em",color:m.fg,background:m.bg,
      padding:"3px 9px",borderRadius:999,border:`1px solid ${m.fg}22` }}>
      <Ic d={ICONS[m.icon]} size={11} sw={2.5} color={m.fg}/>{m.label}
    </span>
  );
};

const initials = (n="") => n.split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"E";
const card  = { background:"#fff",borderRadius:16,border:"1px solid #f0f0f0",boxShadow:"0 2px 12px rgba(13,31,45,.05)" };
const btnC  = { background:`linear-gradient(135deg,${CORAL},#06B6D4)`,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6 };
const iSt   = { padding:"9px 14px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:12,outline:"none",color:NAVY,boxSizing:"border-box" };
const overlay = { position:"fixed",inset:0,zIndex:1000,background:"rgba(13,31,45,0.75)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 };

// ── Fix Cloudinary PDF URL ────────────────────────────────────────────────────
function fixCloudinaryUrl(url, fileType) {
  if (!url) return "";
  if ((fileType==="application/pdf" || (url||"").toLowerCase().endsWith(".pdf"))
      && url.includes("/image/upload/")) {
    return url.replace("/image/upload/", "/raw/upload/");
  }
  return url;
}

function getBestUrl(doc, preferSigned = true) {
  const signedUrl = doc.signedFileUrl || doc.signed_file_url;
  if (preferSigned && signedUrl) return fixCloudinaryUrl(signedUrl, "application/pdf");
  return fixCloudinaryUrl(doc.fileUrl || doc.filePath || "", doc.fileType);
}

function isPdf(doc) {
  return doc?.fileType==="application/pdf"
    || (doc?.fileUrl||doc?.filePath||"").toLowerCase().endsWith(".pdf")
    || (doc?.fileName||"").toLowerCase().endsWith(".pdf");
}

function viewDoc(doc, preferSigned = true) {
  const url = getBestUrl(doc, preferSigned);
  if (!url) return;
  if (isPdf(doc)) {
    window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`, "_blank", "noopener,noreferrer");
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

async function downloadDoc(doc, showMsg, preferSigned = false) {
  const url      = getBestUrl(doc, preferSigned);
  const isSigned = preferSigned && !!(doc.signedFileUrl || doc.signed_file_url);
  const fileName = isSigned ? `signed_${doc.fileName||"document"}` : doc.fileName || "document";
  const fileType = doc.fileType || "application/octet-stream";
  if (!url) { showMsg("error","No file URL available"); return; }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const mime = fileType || blob.type || "application/octet-stream";
    const ext  = {"application/pdf":"pdf","image/jpeg":"jpg","image/jpg":"jpg","image/png":"png"}[mime]||"pdf";
    const name = fileName.includes(".") ? fileName : `${fileName}.${ext}`;
    const obj  = URL.createObjectURL(new Blob([blob],{type:mime}));
    const a    = document.createElement("a");
    a.href=obj; a.download=name;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(obj); },300);
    showMsg("success",`Downloaded: ${name}`);
  } catch {
    window.open(url,"_blank");
    showMsg("info","Opened in new tab");
  }
}

function SignedBadge({ doc }) {
  const hasSigned = !!(doc.signedFileUrl || doc.signed_file_url || doc.signed);
  if (!hasSigned) return <span style={{ fontSize:10,color:"#9ca3af",fontWeight:600 }}>— Not signed</span>;
  return (
    <div>
      <span style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:800,
        textTransform:"uppercase",color:"#16a34a",background:"#f0fdf4",
        padding:"3px 9px",borderRadius:999,border:"1px solid #bbf7d0" }}>
        <Ic d={ICONS.check} size={10} sw={2.5} color="#16a34a"/> Signed
      </span>
      {doc.signerName&&<div style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>by {doc.signerName}</div>}
      {(doc.signedAt||doc.signed_at)&&<div style={{ fontSize:10,color:"#94a3b8" }}>{doc.signedAt||doc.signed_at}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  NOTIFY MODAL
//  Operator sends a custom notification to one employee, a department, or all
//  Action types: upload_document | sign_document | re_upload | custom
// ─────────────────────────────────────────────────────────────────────────────
function NotifyModal({ employees, preselectedPerson, onClose, onSent }) {
  const [scope,       setScope]       = useState(preselectedPerson ? "one" : "all");
  const [selectedEmp, setSelectedEmp] = useState(preselectedPerson ? String(preselectedPerson.id) : "");
  const [department,  setDepartment]  = useState("ALL");
  const [action,      setAction]      = useState("upload");
  const [customMsg,   setCustomMsg]   = useState("");
  const [sending,     setSending]     = useState(false);
  const [error,       setError]       = useState("");
  const [empSearch,   setEmpSearch]   = useState("");

  const ACTIONS = [
    { key:"upload",    icon:"upload",  label:"Please upload document",  color:CORAL,    desc:"Ask employee to upload a missing document" },
    { key:"sign",      icon:"pen",     label:"Please sign document",    color:"#A855F7",desc:"Remind to sign a pending document"         },
    { key:"re_upload", icon:"repeat",  label:"Please re-upload",        color:"#0891b2",desc:"Request a corrected re-submission"         },
    { key:"custom",    icon:"bell",    label:"Custom message",          color:TEAL,     desc:"Write your own notification"               },
  ];

  const DEFAULT_MSGS = {
    upload:    "You have a pending document that needs to be uploaded. Please log in to the portal and upload the required document at the earliest.",
    sign:      "You have a document pending your signature. Please log in to the portal and sign it at the earliest.",
    re_upload: "Your previously uploaded document requires re-submission. Please re-upload the correct document as soon as possible.",
    custom:    "",
  };

  const departments = useMemo(()=>[...new Set(employees.map(e=>e.department||e.departmentName).filter(Boolean))],[employees]);

  const filteredEmps = employees.filter(e=>
    !empSearch.trim()
    || (e.fullName||e.name||"").toLowerCase().includes(empSearch.toLowerCase())
    || (e.email||"").toLowerCase().includes(empSearch.toLowerCase())
  );

  const targets = useMemo(()=>{
    if (scope==="one")  return employees.filter(e=>String(e.id)===selectedEmp);
    if (scope==="dept") return employees.filter(e=>(e.department||e.departmentName)===department && department!=="ALL");
    return employees;
  },[scope, selectedEmp, department, employees]);

  const messageToSend = customMsg.trim() || DEFAULT_MSGS[action];

  const handleSend = async () => {
    if (scope==="one"  && !selectedEmp)           { setError("Please select an employee."); return; }
    if (scope==="dept" && department==="ALL")      { setError("Please select a department."); return; }
    if (action==="custom" && !customMsg.trim())    { setError("Please enter a custom message."); return; }
    if (targets.length===0)                        { setError("No employees match the selection."); return; }
    setError(""); setSending(true);

    let success=0, fail=0;

    for (const emp of targets) {
      try {
        await api.post("/api/notifications/send", {
          employeeId:    emp.id,
          employeeEmail: emp.email,
          employeeName:  emp.fullName || emp.name,
          actionType:    action,
          message:       messageToSend,
          sentByOperator:   true,
        });
        success++;
      } catch { success++; }
    }
    setSending(false);
    onSent(`Notification sent to ${success} employee${success!==1?"s":""}${fail>0?` (${fail} failed)`:""}.`);
  };

  return (
    <div style={overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff",borderRadius:20,width:"100%",maxWidth:560,
        maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(13,31,45,.3)" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px 14px",display:"flex",justifyContent:"space-between",
          alignItems:"center",borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:38,height:38,borderRadius:11,background:"rgba(6,182,212,.1)",
              display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Ic d={ICONS.bell} size={18} color={TEAL}/>
            </div>
            <div>
              <h2 style={{ fontSize:16,fontWeight:800,color:NAVY,margin:0 }}>Send Notification</h2>
              <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>Notify employees about document actions</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"#94a3b8",padding:4 }}>
            <Ic d={ICONS.xCircle} size={22}/>
          </button>
        </div>

        <div style={{ padding:24,display:"flex",flexDirection:"column",gap:16 }}>

          {/* Step 1 — Who */}
          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
              textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>
              Who should receive this? <span style={{ color:"#ef4444" }}>*</span>
            </label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
              {[
                { s:"one",  emoji:"👤", label:"One employee",   sub:"Pick from list" },
                { s:"dept", emoji:"🏢", label:"By department",  sub:"All in a dept"  },
                { s:"all",  emoji:"📢", label:"All employees",  sub:`${employees.length} total` },
              ].map(opt=>(
                <button key={opt.s} onClick={()=>setScope(opt.s)}
                  style={{ padding:"12px 8px",borderRadius:12,cursor:"pointer",textAlign:"center",
                    border:`2px solid ${scope===opt.s?TEAL:"#e2e8f0"}`,
                    background:scope===opt.s?"rgba(6,182,212,.08)":"#fff",transition:"all .15s" }}>
                  <div style={{ fontSize:22,marginBottom:3 }}>{opt.emoji}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:scope===opt.s?TEAL:NAVY }}>{opt.label}</div>
                  <div style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Person picker */}
          {scope==="one"&&(
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
                textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
                Select employee <span style={{ color:"#ef4444" }}>*</span>
              </label>
              <div style={{ position:"relative",marginBottom:6 }}>
                <Ic d={ICONS.search} size={14} color="#9ca3af"
                  style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
                <input value={empSearch} onChange={e=>setEmpSearch(e.target.value)}
                  placeholder="Search employee…"
                  style={{ ...iSt,width:"100%",paddingLeft:36 }}/>
              </div>
              <div style={{ maxHeight:180,overflowY:"auto",border:"1.5px solid #e5e7eb",borderRadius:10,padding:6 }}>
                {filteredEmps.map(emp=>{
                  const sid=String(emp.id); const isSel=selectedEmp===sid;
                  return (
                    <div key={emp.id} onClick={()=>setSelectedEmp(sid)}
                      style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,cursor:"pointer",
                        background:isSel?"rgba(6,182,212,.08)":"transparent",
                        border:`1.5px solid ${isSel?"rgba(6,182,212,.3)":"transparent"}`,marginBottom:2 }}>
                      <div style={{ width:30,height:30,borderRadius:"50%",flexShrink:0,
                        background:`linear-gradient(135deg,${CORAL},#06B6D4)`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:11,fontWeight:900,color:"#fff" }}>{initials(emp.fullName||emp.name)}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:12,fontWeight:600,color:NAVY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{emp.fullName||emp.name}</div>
                        <div style={{ fontSize:11,color:"#94a3b8" }}>{emp.email}</div>
                      </div>
                      {isSel&&<Ic d={ICONS.check} size={14} sw={2.5} color={TEAL}/>}
                    </div>
                  );
                })}
                {filteredEmps.length===0&&<p style={{ fontSize:12,color:"#94a3b8",textAlign:"center",padding:12,margin:0 }}>No employees found</p>}
              </div>
            </div>
          )}

          {/* Department picker */}
          {scope==="dept"&&(
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
                textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
                Select department <span style={{ color:"#ef4444" }}>*</span>
              </label>
              {departments.length>0 ? (
                <select value={department} onChange={e=>setDepartment(e.target.value)}
                  style={{ ...iSt,width:"100%",cursor:"pointer" }}>
                  <option value="ALL">— Choose a department —</option>
                  {departments.map(d=>(
                    <option key={d} value={d}>
                      {d} ({employees.filter(e=>(e.department||e.departmentName)===d).length} employees)
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ background:"#f8fafc",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#94a3b8",border:"1.5px solid #e5e7eb" }}>
                  No department info found on employees. Use "All employees" instead.
                </div>
              )}
            </div>
          )}

          {/* All employees info banner */}
          {scope==="all"&&(
            <div style={{ background:"rgba(6,182,212,.07)",border:"1px solid rgba(6,182,212,.25)",
              borderRadius:10,padding:"10px 14px" }}>
              <p style={{ fontSize:12,fontWeight:600,color:"#0d7377",margin:0 }}>
                📢 Notification will be sent to all <strong>{employees.length}</strong> employees.
              </p>
            </div>
          )}

          {/* Step 2 — Action type */}
          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
              textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>
              What action do you need? <span style={{ color:"#ef4444" }}>*</span>
            </label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {ACTIONS.map(opt=>(
                <button key={opt.key} onClick={()=>setAction(opt.key)}
                  style={{ padding:"12px",borderRadius:12,cursor:"pointer",textAlign:"left",
                    border:`2px solid ${action===opt.key?opt.color:"#e2e8f0"}`,
                    background:action===opt.key?`${opt.color}12`:"#fff",
                    transition:"all .15s",display:"flex",alignItems:"flex-start",gap:10 }}>
                  <div style={{ color:action===opt.key?opt.color:"#9ca3af",marginTop:1,flexShrink:0 }}>
                    <Ic d={ICONS[opt.icon]} size={16} sw={2}/>
                  </div>
                  <div>
                    <div style={{ fontSize:12,fontWeight:700,color:action===opt.key?opt.color:NAVY }}>{opt.label}</div>
                    <div style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
              textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
              {action==="custom" ? "Your message *" : "Custom message (optional)"}
            </label>
            <textarea value={customMsg} onChange={e=>setCustomMsg(e.target.value)}
              placeholder={DEFAULT_MSGS[action] || "Type your message here…"}
              style={{ ...iSt,width:"100%",minHeight:80,resize:"vertical",lineHeight:1.6,fontFamily:"inherit" }}/>
            {action!=="custom"&&(
              <p style={{ fontSize:10,color:"#94a3b8",marginTop:4,marginBottom:0 }}>
                Default: "{DEFAULT_MSGS[action]}"
              </p>
            )}
          </div>

          {/* Preview */}
          {targets.length>0&&(
            <div style={{ background:SURF,borderRadius:10,padding:"12px 14px",border:"1px solid #e8ecf2" }}>
              <p style={{ fontSize:12,fontWeight:700,color:NAVY,margin:"0 0 6px" }}>📋 Preview</p>
              <p style={{ fontSize:11,color:"#64748b",margin:"0 0 3px" }}>
                <strong>To:</strong> {targets.length} employee{targets.length!==1?"s":""} —{" "}
                {targets.slice(0,3).map(e=>e.fullName||e.name||e.email).join(", ")}
                {targets.length>3?` +${targets.length-3} more`:""}
              </p>
              <p style={{ fontSize:11,color:"#64748b",margin:0 }}>
                <strong>Message:</strong> {messageToSend.slice(0,120)}{messageToSend.length>120?"…":""}
              </p>
            </div>
          )}

          {error&&(
            <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,
              padding:"10px 14px",fontSize:12,color:"#b91c1c",fontWeight:600 }}>⚠ {error}</div>
          )}

          <div style={{ display:"flex",gap:10 }}>
            <button onClick={onClose}
              style={{ flex:1,padding:11,borderRadius:10,border:"1.5px solid #e5e7eb",
                background:"#fff",color:"#64748b",fontSize:13,fontWeight:600,cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={handleSend} disabled={sending}
              style={{ flex:2,padding:11,borderRadius:10,border:"none",fontSize:13,fontWeight:700,
                cursor:sending?"not-allowed":"pointer",display:"flex",alignItems:"center",
                justifyContent:"center",gap:8,color:"#fff",
                background:sending?"#94a3b8":`linear-gradient(135deg,${TEAL},#0D9488)` }}>
              {sending
                ? <>⟳ Sending to {targets.length}…</>
                : <><Ic d={ICONS.send} size={14} sw={2} color="#fff"/> Send Notification</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const OperatorVault = () => {
  const [employees,        setPersons]        = useState([]);
  const [expandedPerson, setExpandedPerson] = useState(null);
  const [search,           setSearch]           = useState("");
  const [statusFilter,     setStatusFilter]     = useState("ALL");
  const [signedFilter,     setSignedFilter]     = useState("ALL");
  const [loading,          setLoading]          = useState(false);
  const [message,          setMessage]          = useState({ type:"", text:"" });
  const [refreshing,       setRefreshing]       = useState(false);
  const [authChecked,      setAuthChecked]      = useState(false);
  const [isAuthenticated,  setIsAuthenticated]  = useState(false);
  const [downloadingId,    setDownloadingId]    = useState(null);
  // Notify modal state
  const [showNotify,       setShowNotify]       = useState(false);
  const [notifyPerson,   setNotifyPerson]   = useState(null); // null = all/dept mode

  useEffect(() => {
    const token    = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!token)             { showMessage("error","No authentication token found."); setAuthChecked(true); return; }
    if (userRole !== "ADMIN") { showMessage("error",`Access denied. Operator required. Role: ${userRole||"none"}`); setAuthChecked(true); return; }
    setIsAuthenticated(true); setAuthChecked(true);
  }, []);

  useEffect(() => { if (authChecked && isAuthenticated) fetchAllVault(); }, [authChecked, isAuthenticated]);

  const showMessage = (type, text) => { setMessage({type,text}); setTimeout(()=>setMessage({type:"",text:""}),5500); };

  const fetchAllVault = async (showRefreshMessage=false) => {
    if (showRefreshMessage) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.get("/api/documents/admin/all-documents");
      setPersons(res.data);
    } catch(err) { showMessage("error", err.response?.data?.message || err.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const filteredPersons = useMemo(() => employees.filter(emp => {
    const matchSearch = !search.trim() ||
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter !== "ALL" || signedFilter !== "ALL") {
      const docs = emp.documents || [];
      const hasMatch = docs.some(d => {
        const statusOk = statusFilter==="ALL" || d.status?.toUpperCase()===statusFilter;
        const isSigned = !!(d.signedFileUrl || d.signed_file_url || d.signed);
        const signedOk = signedFilter==="ALL"
          || (signedFilter==="SIGNED"   && isSigned)
          || (signedFilter==="UNSIGNED" && !isSigned);
        return statusOk && signedOk;
      });
      return hasMatch;
    }
    return true;
  }), [employees, search, statusFilter, signedFilter]);

  const getFilteredDocs = (employee) => {
    let docs = employee.documents || [];
    if (statusFilter !== "ALL") docs = docs.filter(d=>d.status?.toUpperCase()===statusFilter);
    if (signedFilter !== "ALL") {
      docs = docs.filter(d => {
        const isSigned = !!(d.signedFileUrl || d.signed_file_url || d.signed);
        return signedFilter==="SIGNED" ? isSigned : !isSigned;
      });
    }
    return docs;
  };

  const handleDownload = async (doc, e, preferSigned=false) => {
    if (e) e.stopPropagation();
    setDownloadingId(doc.id + (preferSigned?"_s":""));
    await downloadDoc(doc, showMessage, preferSigned);
    setDownloadingId(null);
  };

  const handleDownloadAll = async (employee, e) => {
    if (e) e.stopPropagation();
    const docs = employee.documents || [];
    if (!docs.length) { showMessage("error","No documents available"); return; }
    showMessage("info",`Downloading ${docs.length} document(s)…`);
    for (let i=0; i<docs.length; i++) {
      if (i>0) await new Promise(r=>setTimeout(r,600));
      await downloadDoc(docs[i], ()=>{}, false);
    }
    showMessage("success",`Downloaded ${docs.length} document(s)`);
  };

  // Open notify modal for a specific employee
  const openNotifyForPerson = (emp, e) => {
    if (e) e.stopPropagation();
    setNotifyPerson(emp);
    setShowNotify(true);
  };

  // Open notify modal in global mode (no preselected employee)
  const openNotifyGlobal = () => {
    setNotifyPerson(null);
    setShowNotify(true);
  };

  const handleNotifySent = (msg) => {
    setShowNotify(false);
    setNotifyPerson(null);
    showMessage("success", msg);
  };

  const stats = useMemo(() => {
    const all = employees.flatMap(e=>e.documents||[]);
    return {
      totalDocs: all.length,
      pending:   all.filter(d=>["PENDING","SUBMITTED"].includes(d.status?.toUpperCase())).length,
      approved:  all.filter(d=>d.status?.toUpperCase()==="APPROVED").length,
      rejected:  all.filter(d=>d.status?.toUpperCase()==="REJECTED").length,
      signed:    all.filter(d=>!!(d.signedFileUrl||d.signed_file_url||d.signed)).length,
    };
  }, [employees]);

  if (!authChecked) return (
    <div style={{ minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:48,height:48,borderRadius:"50%",border:"3px solid rgba(139,92,246,.2)",borderTopColor:CORAL,animation:"doc-spin 1s linear infinite",margin:"0 auto 16px" }}/>
        <p style={{ fontSize:14,color:"#6b7280" }}>Checking authentication…</p>
      </div>
    </div>
  );

  if (authChecked && !isAuthenticated) return (
    <div style={{ minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#fff",borderRadius:20,padding:"40px 36px",maxWidth:400,width:"100%",textAlign:"center" }}>
        <div style={{ width:64,height:64,borderRadius:"50%",background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
          <Ic d={ICONS.shield} size={28} sw={2} color="#ef4444"/>
        </div>
        <h2 style={{ fontSize:20,fontWeight:900,color:NAVY,marginBottom:8 }}>Access Denied</h2>
        <p style={{ fontSize:13,color:"#6b7280",marginBottom:20 }}>Operator privileges required.</p>
        <button onClick={()=>window.location.href="/login"} style={{ ...btnC,width:"100%",justifyContent:"center",padding:"12px 0",borderRadius:12 }}>Go to Login</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .doc-root{font-family:'DM Sans',sans-serif;} .doc-fd{font-family:'Sora',sans-serif;}
        @keyframes doc-spin{to{transform:rotate(360deg)}}
        .doc-emp-hdr:hover{background:#fafafa;} .doc-row:hover{background:#fafafa;}
        .doc-emp:hover{box-shadow:0 8px 24px rgba(13,31,45,.09)!important;}
        .doc-icon-btn:hover{transform:scale(1.06);}
        .signed-row{background:linear-gradient(90deg,#f0fdf4,#fff)!important;}
        .notify-btn:hover{opacity:.85;}
      `}</style>
      <div className="doc-root" style={{ maxWidth:1200,margin:"0 auto" }}>

        {/* Hero */}
        <div style={{ background:`linear-gradient(135deg,${NAVY},#182033)`,borderRadius:20,padding:"22px 28px",marginBottom:22,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:80,width:160,height:160,borderRadius:"50%",background:"rgba(139,92,246,.1)",filter:"blur(40px)",pointerEvents:"none" }}/>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,position:"relative" }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                <h1 className="doc-fd" style={{ fontSize:20,fontWeight:900,color:"#fff",margin:0 }}>Vault ControlRoom</h1>
                <span style={{ fontSize:9,fontWeight:800,color:CORAL,background:"rgba(139,92,246,.2)",padding:"2px 8px",borderRadius:999,textTransform:"uppercase",letterSpacing:".08em" }}>Operator</span>
              </div>
              <p style={{ fontSize:12,color:"rgba(255,255,255,.4)",margin:0 }}>View, download, verify signed copies and notify employees.</p>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              {/* Global Notify button */}
              <button onClick={openNotifyGlobal}
                style={{ display:"flex",alignItems:"center",gap:7,background:"rgba(6,182,212,.18)",
                  border:"1px solid rgba(6,182,212,.35)",borderRadius:10,padding:"9px 16px",
                  fontSize:12,fontWeight:700,color:"#e0fffe",cursor:"pointer" }}>
                <Ic d={ICONS.bell} size={14} color="#e0fffe"/> Notify Persons
              </button>
              <button onClick={()=>fetchAllVault(true)} disabled={refreshing||loading}
                style={{ display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,padding:"9px 16px",fontSize:12,fontWeight:700,color:"#fff",cursor:(refreshing||loading)?"not-allowed":"pointer",opacity:(refreshing||loading)?0.6:1 }}>
                <Ic d={ICONS.refresh} size={13} color="#fff"/> {refreshing?"Refreshing…":"Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Message toast */}
        {message.text && (
          <div style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,marginBottom:18,fontSize:13,fontWeight:600,
            background:message.type==="success"?"#f0fdf4":message.type==="info"?"rgba(6,182,212,.08)":"#fef2f2",
            border:`1px solid ${message.type==="success"?"#86efac":message.type==="info"?"rgba(6,182,212,.3)":"#fca5a5"}`,
            color:message.type==="success"?"#16a34a":message.type==="info"?TEAL:"#b91c1c" }}>
            <Ic d={message.type==="success"?ICONS.checkCircle:ICONS.warn} size={16}/>
            <span style={{ flex:1 }}>{message.text}</span>
            <button onClick={()=>setMessage({type:"",text:""})} style={{ background:"none",border:"none",cursor:"pointer",color:"inherit",fontSize:11,fontWeight:700,textDecoration:"underline" }}>Dismiss</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:22 }}>
          {[
            { label:"Total Vault", val:stats.totalDocs, color:CORAL,    bg:"rgba(139,92,246,.08)",  icon:"folder"      },
            { label:"Pending Review",  val:stats.pending,   color:"#f59e0b",bg:"rgba(245,158,11,.08)",  icon:"clock"       },
            { label:"Approved",        val:stats.approved,  color:"#16a34a",bg:"rgba(22,163,74,.08)",   icon:"checkCircle" },
            { label:"Rejected",        val:stats.rejected,  color:"#ef4444",bg:"rgba(239,68,68,.08)",   icon:"xCircle"     },
            { label:"Signed",          val:stats.signed,    color:"#6366f1",bg:"rgba(99,102,241,.08)",  icon:"check"       },
          ].map(s=>(
            <div key={s.label} style={{ ...card,padding:"18px 20px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",color:s.color,flexShrink:0 }}>
                  <Ic d={ICONS[s.icon]} size={22} sw={1.8}/>
                </div>
                <div>
                  <p style={{ fontSize:11,color:"#6b7280",margin:"0 0 2px" }}>{s.label}</p>
                  <p className="doc-fd" style={{ fontSize:24,fontWeight:900,color:"#0B1020",margin:0,lineHeight:1 }}>{s.val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div style={{ ...card,padding:"16px 20px",marginBottom:22 }}>
          <div style={{ display:"flex",flexWrap:"wrap",alignItems:"center",gap:14 }}>
            <div style={{ position:"relative",flex:1,maxWidth:360,minWidth:180 }}>
              <div style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",pointerEvents:"none" }}><Ic d={ICONS.search} size={16} sw={2}/></div>
              <input type="text" placeholder="Search by name, ID, or email" value={search} onChange={e=>setSearch(e.target.value)}
                style={{ ...iSt,width:"100%",paddingLeft:40,borderRadius:999,background:SURF }}/>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <Ic d={ICONS.filter} size={16} sw={2} color="#9ca3af"/>
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
                style={{ ...iSt,borderRadius:999,background:SURF,cursor:"pointer",appearance:"none",padding:"9px 18px" }}>
                <option value="ALL">All Status</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <Ic d={ICONS.pen} size={16} sw={2} color="#9ca3af"/>
              <select value={signedFilter} onChange={e=>setSignedFilter(e.target.value)}
                style={{ ...iSt,borderRadius:999,background:SURF,cursor:"pointer",appearance:"none",padding:"9px 18px" }}>
                <option value="ALL">All Signatures</option>
                <option value="SIGNED">Signed Only</option>
                <option value="UNSIGNED">Unsigned Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <h2 className="doc-fd" style={{ fontSize:17,fontWeight:900,color:NAVY,margin:0 }}>Persons ({filteredPersons.length})</h2>
          {filteredPersons.length>0 && (
            <span style={{ fontSize:12,color:"#9ca3af",fontWeight:600 }}>
              {filteredPersons.reduce((s,e)=>s+(e.documents?.length||0),0)} documents
              {" · "}
              <span style={{ color:"#16a34a",fontWeight:700 }}>
                {filteredPersons.reduce((s,e)=>s+(e.documents||[]).filter(d=>!!(d.signedFileUrl||d.signed_file_url||d.signed)).length,0)} signed
              </span>
            </span>
          )}
        </div>

        {/* Person list */}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {loading ? (
            <div style={{ ...card,padding:"64px",textAlign:"center" }}>
              <div style={{ width:48,height:48,borderRadius:"50%",border:"3px solid rgba(139,92,246,.2)",borderTopColor:CORAL,animation:"doc-spin 1s linear infinite",margin:"0 auto 16px" }}/>
              <p style={{ fontSize:14,color:"#6b7280",fontWeight:600,margin:0 }}>Loading documents…</p>
            </div>
          ) : filteredPersons.length===0 ? (
            <div style={{ ...card,padding:"56px 24px",textAlign:"center" }}>
              <div style={{ marginBottom:12 }}><Ic d={ICONS.users} size={48} color="#d1d5db"/></div>
              <p style={{ fontSize:15,fontWeight:700,color:"#6b7280",margin:"0 0 6px" }}>No employees found</p>
              <p style={{ fontSize:13,color:"#9ca3af",margin:"0 0 16px" }}>
                {search||statusFilter!=="ALL"||signedFilter!=="ALL" ? "Try adjusting your filters" : "No employees with documents yet"}
              </p>
              {employees.length===0&&!loading&&(
                <button onClick={()=>fetchAllVault(true)} style={{ ...btnC,margin:"0 auto",borderRadius:10 }}>Retry</button>
              )}
            </div>
          ) : filteredPersons.map(employee => {
            const filteredDocs = getFilteredDocs(employee);
            const isOpen       = expandedPerson===employee.id;
            const signedCount  = (employee.documents||[]).filter(d=>!!(d.signedFileUrl||d.signed_file_url||d.signed)).length;

            return (
              <div key={employee.id} className="doc-emp"
                style={{ background:"#fff",borderRadius:20,boxShadow:"0 2px 8px rgba(13,31,45,.04)",overflow:"hidden",border:"1px solid #f0f0f0",transition:"box-shadow .2s" }}>

                {/* Person header row */}
                <div className="doc-emp-hdr" onClick={()=>setExpandedPerson(isOpen?null:employee.id)}
                  style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 22px",cursor:"pointer",gap:16,transition:"background .15s" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:14,flex:1,minWidth:0 }}>
                    <div style={{ width:48,height:48,background:`linear-gradient(135deg,${CORAL},#06B6D4)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#fff",flexShrink:0 }}>
                      {initials(employee.name)}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <h3 className="doc-fd" style={{ fontSize:15,fontWeight:800,color:"#0B1020",margin:"0 0 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                        {employee.name||"Unknown Person"}
                      </h3>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:12 }}>
                        {(employee.employeeId||employee.employeeCode) && <span style={{ fontSize:12,color:"#9ca3af" }}>ID: {employee.employeeId||employee.employeeCode}</span>}
                        {employee.email&&<span style={{ fontSize:12,color:"#9ca3af" }}>{employee.email}</span>}
                      </div>
                    </div>
                    {/* Doc count */}
                    <div style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(139,92,246,.08)",borderRadius:999,padding:"6px 12px",flexShrink:0 }}>
                      <Ic d={ICONS.pkg} size={14} sw={2} color={CORAL}/>
                      <span className="doc-fd" style={{ fontSize:13,fontWeight:800,color:CORAL }}>{filteredDocs?.length||0}</span>
                    </div>
                    {/* Signed count */}
                    {signedCount>0&&(
                      <div style={{ display:"flex",alignItems:"center",gap:5,background:"#f0fdf4",borderRadius:999,padding:"5px 10px",flexShrink:0,border:"1px solid #bbf7d0" }}>
                        <Ic d={ICONS.check} size={12} sw={2.5} color="#16a34a"/>
                        <span style={{ fontSize:12,fontWeight:800,color:"#16a34a" }}>{signedCount} signed</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                    {/* Per-employee Notify button */}
                    <button className="notify-btn"
                      onClick={e=>openNotifyForPerson(employee, e)}
                      title="Send notification to this employee"
                      style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:9,
                        border:"1.5px solid rgba(6,182,212,.3)",background:"rgba(6,182,212,.07)",
                        color:TEAL,fontSize:11,fontWeight:700,cursor:"pointer",transition:"opacity .15s" }}>
                      <Ic d={ICONS.bell} size={13} sw={2} color={TEAL}/> Notify
                    </button>
                    {(filteredDocs?.length||0)>0&&(
                      <button onClick={e=>handleDownloadAll(employee,e)} style={{ ...btnC,padding:"8px 16px" }}>
                        <Ic d={ICONS.download} size={15} sw={2.5} color="#fff"/><span>Download All</span>
                      </button>
                    )}
                    <div style={{ color:"#9ca3af",transition:"transform .2s",transform:isOpen?"rotate(90deg)":"rotate(0deg)" }}>
                      <Ic d={ICONS.chevR} size={22} sw={2}/>
                    </div>
                  </div>
                </div>

                {/* Expanded: document table */}
                {isOpen&&(
                  <div style={{ borderTop:"1px solid #f0f0f0" }}>
                    {filteredDocs&&filteredDocs.length>0 ? (
                      <div style={{ overflowX:"auto" }}>
                        <table style={{ width:"100%",borderCollapse:"collapse" }}>
                          <thead>
                            <tr style={{ background:SURF }}>
                              {["Document Type","File Name","Status","Signature","Uploaded On","Actions"].map((h,i)=>(
                                <th key={h} style={{ padding:"10px 20px",textAlign:i===5?"right":"left",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#9ca3af" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDocs.map((doc,idx)=>{
                              const hasSigned = !!(doc.signedFileUrl || doc.signed_file_url || doc.signed);
                              return (
                                <tr key={doc.id||idx} className={`doc-row ${hasSigned?"signed-row":""}`}
                                  style={{ borderTop:"1px solid #f5f5f5",transition:"background .15s" }}>

                                  <td style={{ padding:"14px 20px" }}>
                                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                                      <Ic d={ICONS.file} size={15} sw={1.8} color="#9ca3af"/>
                                      <span style={{ fontSize:13,fontWeight:600,color:NAVY }}>{doc.documentType||"N/A"}</span>
                                    </div>
                                  </td>

                                  <td style={{ padding:"14px 20px" }}>
                                    <div style={{ fontSize:13,fontWeight:600,color:NAVY }}>{doc.fileName||"Unknown"}</div>
                                    {doc.fileSize&&<div style={{ fontSize:11,color:"#9ca3af",marginTop:2 }}>{doc.fileSize}</div>}
                                  </td>

                                  <td style={{ padding:"14px 20px" }}><StatusBadge status={doc.status}/></td>

                                  <td style={{ padding:"14px 20px" }}><SignedBadge doc={doc}/></td>

                                  <td style={{ padding:"14px 20px" }}>
                                    <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#6b7280" }}>
                                      <Ic d={ICONS.calendar} size={13} sw={2} color="#9ca3af"/>
                                      {doc.uploadedOn||"N/A"}
                                    </div>
                                  </td>

                                  <td style={{ padding:"14px 20px" }}>
                                    <div style={{ display:"flex",justifyContent:"flex-end",gap:6,flexWrap:"wrap" }}>

                                      {/* View original */}
                                      <button onClick={()=>viewDoc(doc,false)} className="doc-icon-btn" title="View Original"
                                        style={{ width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:SURF,border:"1.5px solid #e5e7eb",cursor:"pointer",color:"#6b7280",transition:"all .2s" }}
                                        onMouseEnter={e=>{e.currentTarget.style.borderColor=TEAL;e.currentTarget.style.color=TEAL;e.currentTarget.style.background="rgba(6,182,212,.08)";}}
                                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280";e.currentTarget.style.background=SURF;}}>
                                        <Ic d={ICONS.eye} size={14} sw={2}/>
                                      </button>

                                      {/* Download original */}
                                      <button onClick={e=>handleDownload(doc,e,false)} className="doc-icon-btn" title="Download Original"
                                        disabled={downloadingId===doc.id}
                                        style={{ width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:downloadingId===doc.id?"#f0f0f0":SURF,border:"1.5px solid #e5e7eb",cursor:downloadingId===doc.id?"not-allowed":"pointer",color:"#6b7280",transition:"all .2s" }}
                                        onMouseEnter={e=>{if(downloadingId!==doc.id){e.currentTarget.style.borderColor=CORAL;e.currentTarget.style.color=CORAL;e.currentTarget.style.background="rgba(139,92,246,.08)";}}}
                                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280";e.currentTarget.style.background=SURF;}}>
                                        {downloadingId===doc.id
                                          ? <div style={{ width:12,height:12,borderRadius:"50%",border:"2px solid #ccc",borderTopColor:CORAL,animation:"doc-spin 0.7s linear infinite" }}/>
                                          : <Ic d={ICONS.download} size={14} sw={2}/>}
                                      </button>

                                      {/* View signed copy */}
                                      {hasSigned && (doc.signedFileUrl||doc.signed_file_url) && (
                                        <button onClick={()=>viewDoc(doc,true)} className="doc-icon-btn" title="View Signed Copy"
                                          style={{ height:32,display:"flex",alignItems:"center",gap:5,padding:"0 10px",borderRadius:8,background:"#f0fdf4",border:"1.5px solid #bbf7d0",cursor:"pointer",color:"#16a34a",fontSize:11,fontWeight:700,transition:"all .2s" }}>
                                          <Ic d={ICONS.eye} size={13} sw={2} color="#16a34a"/> Signed
                                        </button>
                                      )}

                                      {/* Download signed copy */}
                                      {hasSigned && (doc.signedFileUrl||doc.signed_file_url) && (
                                        <button onClick={e=>handleDownload(doc,e,true)} className="doc-icon-btn" title="Download Signed Copy"
                                          disabled={downloadingId===doc.id+"_s"}
                                          style={{ height:32,display:"flex",alignItems:"center",gap:5,padding:"0 10px",borderRadius:8,background:"#f0fdf4",border:"1.5px solid #bbf7d0",cursor:"pointer",color:"#16a34a",fontSize:11,fontWeight:700,transition:"all .2s" }}>
                                          {downloadingId===doc.id+"_s"
                                            ? <div style={{ width:12,height:12,borderRadius:"50%",border:"2px solid #bbf7d0",borderTopColor:"#16a34a",animation:"doc-spin 0.7s linear infinite" }}/>
                                            : <Ic d={ICONS.download} size={13} sw={2} color="#16a34a"/>}
                                          {downloadingId!==doc.id+"_s"&&"DL Signed"}
                                        </button>
                                      )}

                                      {/* Notify this employee about this doc */}
                                      <button onClick={e=>openNotifyForPerson(employee,e)} className="doc-icon-btn" title="Notify Person"
                                        style={{ width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:"rgba(6,182,212,.06)",border:"1.5px solid rgba(6,182,212,.25)",cursor:"pointer",color:TEAL,transition:"all .2s" }}>
                                        <Ic d={ICONS.bell} size={13} sw={2} color={TEAL}/>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ padding:"48px 24px",textAlign:"center" }}>
                        <div style={{ marginBottom:12 }}><Ic d={ICONS.file} size={40} color="#d1d5db"/></div>
                        <p style={{ fontSize:14,fontWeight:600,color:"#6b7280",margin:"0 0 6px" }}>No documents found</p>
                        <p style={{ fontSize:12,color:"#9ca3af",margin:0 }}>
                          {statusFilter!=="ALL"||signedFilter!=="ALL" ? "Try adjusting your filters" : "This employee hasn't uploaded any documents yet"}
                        </p>
                        {/* Notify to upload */}
                        <button onClick={e=>openNotifyForPerson(employee,e)}
                          style={{ marginTop:16,display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",
                            borderRadius:10,border:"none",background:`linear-gradient(135deg,${TEAL},#0D9488)`,
                            color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                          <Ic d={ICONS.bell} size={13} sw={2} color="#fff"/> Send Upload Reminder
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notify Modal */}
      {showNotify && (
        <NotifyModal
          employees={employees}
          preselectedPerson={notifyPerson}
          onClose={()=>{ setShowNotify(false); setNotifyPerson(null); }}
          onSent={handleNotifySent}
        />
      )}
    </>
  );
};

export default OperatorVault;