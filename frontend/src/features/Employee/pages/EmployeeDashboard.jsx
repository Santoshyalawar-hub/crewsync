
// // import React, { useEffect, useState, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { API_BASE_URL } from "@/lib/apiClient";
// // import {
// //   User,
// //   Calendar,
// //   Clock,
// //   Activity,
// //   Camera,
// //   Upload,
// //   X,
// //   Check,
// //   TrendingUp,
// // } from "lucide-react";


// // const cleanBase = API_BASE_URL.replace(/\/+$/, "");

// // const T = {
// //   navy: "#0D1F2D",
// //   coral: "#FF6B35",
// //   teal: "#00C2A8",
// //   navyMid: "#1E3448",
// //   bg: "#F5F7FB",
// //   card: "#FFFFFF",
// //   border: "#E8ECF2",
// // };

// // const TOTAL_LEAVES = 24;

// // const CSS = `
// // @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

// // .edb * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
// // .edb .fd { font-family:'Sora',sans-serif; }

// // .edb-card {
// //   background:#fff;
// //   border:1.5px solid ${T.border};
// //   border-radius:18px;
// //   box-shadow:0 2px 12px rgba(13,31,45,.05);
// //   transition:box-shadow .2s;
// // }
// // .edb-card:hover { box-shadow:0 4px 20px rgba(13,31,45,.09); }

// // .edb-stat-chip {
// //   display:inline-flex;
// //   align-items:center;
// //   gap:6px;
// //   border-radius:999px;
// //   padding:5px 12px;
// //   font-size:11px;
// //   font-weight:600;
// //   border:1.5px solid;
// // }

// // .edb-avatar-ring {
// //   border-radius:50%;
// //   overflow:hidden;
// //   cursor:pointer;
// //   position:relative;
// //   background:linear-gradient(135deg,rgba(255,107,53,.15),rgba(0,194,168,.15));
// //   border:3px solid rgba(255,107,53,.3);
// //   transition:all .2s;
// // }
// // .edb-avatar-ring:hover { border-color:${T.coral}; }

// // .edb-avatar-ring .cam-overlay {
// //   position:absolute;
// //   inset:0;
// //   background:rgba(0,0,0,0);
// //   display:flex;
// //   align-items:center;
// //   justify-content:center;
// //   opacity:0;
// //   transition:all .2s;
// // }
// // .edb-avatar-ring:hover .cam-overlay {
// //   background:rgba(0,0,0,.45);
// //   opacity:1;
// // }

// // @keyframes edbFadeUp {
// //   from { opacity:0; transform:translateY(10px); }
// //   to   { opacity:1; transform:translateY(0); }
// // }
// // .edb-animate { animation:edbFadeUp .4s ease both; }
// // `;

// // export default function EmployeeDashboard() {
// //   const navigate = useNavigate();
// //   const fileInputRef = useRef(null);

// //   const handleProfileClick = () => navigate("/employee/dashboard");
// //   const handleLeaveClick = () => navigate("/employee/leaves");

// //   const [employeeName, setEmployeeName] = useState("");
// //   const [employeePhotoUrl, setEmployeePhotoUrl] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [loadError, setLoadError] = useState("");
// //   const [uploading, setUploading] = useState(false);
// //   const [uploadSuccess, setUploadSuccess] = useState("");
// //   const [uploadError, setUploadError] = useState("");
// //   const [showPhotoModal, setShowPhotoModal] = useState(false);

// //   const [headerStats, setHeaderStats] = useState({
// //     todayStatus: null,
// //     performanceStatus: null,
// //     thisMonthAttendancePercent: null,
// //     availableLeave: TOTAL_LEAVES,
// //     takenLeave: 0,
// //     usedLeaveDays: 0,
// //   });

// //   const safeUrl = (path) => {
// //     const p = path.replace(/^\/+/, "");
// //     return cleanBase ? `${cleanBase}/${p}` : `/${p}`;
// //   };

// //   const getCurrentMonthYear = () => {
// //     const now = new Date();
// //     return {
// //       month: (now.getMonth() + 1).toString().padStart(2, "0"),
// //       year: now.getFullYear().toString(),
// //     };
// //   };

// //   const calcLeaveSummary = (leaves) => {
// //     const approvedLeaves = leaves.filter(
// //       (l) => (l.status || "").toUpperCase() === "APPROVED"
// //     );

// //     const usedLeaveDays = approvedLeaves.reduce(
// //       (sum, leave) => sum + (Number(leave.totalDays) || 0),
// //       0
// //     );

// //     const availableLeave = Math.max(0, TOTAL_LEAVES - usedLeaveDays);

// //     return {
// //       availableLeave,
// //       usedLeaveDays,
// //       approvedCount: approvedLeaves.length,
// //     };
// //   };

// //   const handleFileSelect = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     if (!file.type.startsWith("image/")) {
// //       setUploadError("Select an image file");
// //       setTimeout(() => setUploadError(""), 3000);
// //       return;
// //     }

// //     if (file.size > 5 * 1024 * 1024) {
// //       setUploadError("Max 5MB allowed");
// //       setTimeout(() => setUploadError(""), 3000);
// //       return;
// //     }

// //     uploadPhoto(file);
// //   };

// //   const uploadPhoto = async (file) => {
// //     setUploading(true);
// //     setUploadError("");
// //     setUploadSuccess("");

// //     try {
// //       const userId = localStorage.getItem("userId");
// //       if (!userId) {
// //         setUploadError("User ID missing");
// //         setUploading(false);
// //         return;
// //       }

// //       const fd = new FormData();
// //       fd.append("photo", file);
// //       fd.append("userId", userId);

// //       const res = await fetch(safeUrl("/api/users/me/upload-photo"), {
// //         method: "POST",
// //         body: fd,
// //       });
// //       const data = await res.json();

// //       if (res.ok && data.success) {
// //         setEmployeePhotoUrl(data.data.photoUrl);
// //         setUploadSuccess("Photo updated!");
// //         setTimeout(() => {
// //           setUploadSuccess("");
// //           setShowPhotoModal(false);
// //         }, 2000);
// //       } else {
// //         setUploadError(data.message || "Upload failed");
// //         setTimeout(() => setUploadError(""), 3000);
// //       }
// //     } catch {
// //       setUploadError("Upload error");
// //       setTimeout(() => setUploadError(""), 3000);
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const handleDeletePhoto = async () => {
// //     if (!window.confirm("Delete profile photo?")) return;
// //     setUploading(true);

// //     try {
// //       const userId = localStorage.getItem("userId");
// //       const res = await fetch(safeUrl(`/api/users/${userId}/photo`), {
// //         method: "DELETE",
// //         headers: { "Content-Type": "application/json" },
// //       });
// //       const data = await res.json();

// //       if (res.ok && data.success) {
// //         setEmployeePhotoUrl("");
// //         setUploadSuccess("Photo removed");
// //         setTimeout(() => {
// //           setUploadSuccess("");
// //           setShowPhotoModal(false);
// //         }, 2000);
// //       } else {
// //         setUploadError(data.message || "Delete failed");
// //         setTimeout(() => setUploadError(""), 3000);
// //       }
// //     } catch {
// //       setUploadError("Error deleting");
// //       setTimeout(() => setUploadError(""), 3000);
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     (async () => {
// //       setLoading(true);
// //       try {
// //         const token = localStorage.getItem("token");
// //         const userId = localStorage.getItem("userId");

// //         if (!userId) {
// //           setEmployeeName("Employee");
// //           setLoadError("Session missing");
// //           setLoading(false);
// //           return;
// //         }

// //         const hdrs = {
// //           "Content-Type": "application/json",
// //           ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //         };

// //         try {
// //           const r = await fetch(safeUrl(`/api/users/${userId}`), { headers: hdrs });
// //           if (r.ok) {
// //             const j = await r.json();
// //             const u = j.data || {};
// //             const name = u.fullName || u.name || u.firstName || "Employee";
// //             setEmployeeName(name);
// //             localStorage.setItem("employeeName", name);

// //             const photo = u.profilePhotoUrl || u.photoUrl || u.avatarUrl || "";
// //             if (photo) setEmployeePhotoUrl(photo);
// //           }
// //         } catch {}

// //         try {
// //           const r = await fetch(safeUrl(`/api/documents/my-passport-photo`), {
// //             headers: hdrs,
// //           });
// //           if (r.ok) {
// //             const j = await r.json();
// //             if (j.data && !employeePhotoUrl) setEmployeePhotoUrl(j.data);
// //           }
// //         } catch {}

// //         try {
// //           const r = await fetch(safeUrl(`/api/leaves/my-leaves`), { headers: hdrs });
// //           if (r.ok) {
// //             const j = await r.json();
// //             const leaves = j.data || [];
// //             const summary = calcLeaveSummary(leaves);

// //             setHeaderStats((p) => ({
// //               ...p,
// //               availableLeave: summary.availableLeave,
// //               takenLeave: summary.approvedCount,
// //               usedLeaveDays: summary.usedLeaveDays,
// //             }));
// //           }
// //         } catch {
// //           setHeaderStats((p) => ({
// //             ...p,
// //             availableLeave: TOTAL_LEAVES,
// //             takenLeave: 0,
// //             usedLeaveDays: 0,
// //           }));
// //         }

// //         try {
// //           const r = await fetch(safeUrl(`/api/dashboard/employee/${userId}`), {
// //             headers: hdrs,
// //           });
// //           if (r.ok) {
// //             const j = await r.json();
// //             const d = j.data || {};
// //             setHeaderStats((p) => ({
// //               ...p,
// //               todayStatus: d.todayStatus || d.todayAttendance || "No data",
// //               performanceStatus: d.performance || d.performanceStatus || "Good",
// //             }));
// //           }
// //         } catch {}

// //         try {
// //           const { month, year } = getCurrentMonthYear();
// //           const r = await fetch(
// //             safeUrl(`/api/attendance/monthly?employeeId=${userId}&year=${year}&month=${month}`),
// //             { headers: hdrs }
// //           );
// //           if (r.ok) {
// //             const j = await r.json();
// //             const d = j.data || {};
// //             const pct =
// //               d.totalDays > 0
// //                 ? Math.round((d.presentDays / d.totalDays) * 1000) / 10
// //                 : null;

// //             setHeaderStats((p) => ({
// //               ...p,
// //               thisMonthAttendancePercent: pct,
// //             }));
// //           }
// //         } catch {}

// //         try {
// //           const r = await fetch(safeUrl(`/api/attendance/today/${userId}`), {
// //             headers: hdrs,
// //           });
// //           if (r.ok) {
// //             const j = await r.json();
// //             const d = j.data || {};
// //             setHeaderStats((p) => ({
// //               ...p,
// //               todayStatus: d.status || d.attendanceStatus || p.todayStatus,
// //             }));
// //           }
// //         } catch {}

// //         setLoadError("");
// //       } catch {
// //         setLoadError("Failed to load data");
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, []);

// //   const displayName = loading ? "…" : employeeName || "Employee";
// //   const attendancePercent = headerStats.thisMonthAttendancePercent;
// //   const availableLeave = headerStats.availableLeave;
// //   const usedLeaveDays = headerStats.usedLeaveDays;
// //   const { month, year } = getCurrentMonthYear();

// //   if (loading) {
// //     return (
// //       <div
// //         style={{
// //           minHeight: "100vh",
// //           background: T.bg,
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //         }}
// //       >
// //         <div style={{ textAlign: "center" }}>
// //           <div
// //             style={{
// //               width: 40,
// //               height: 40,
// //               borderRadius: "50%",
// //               border: `3px solid ${T.coral}`,
// //               borderTopColor: "transparent",
// //               animation: "spin 0.9s linear infinite",
// //               margin: "0 auto 12px",
// //             }}
// //           />
// //           <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
// //           <p style={{ color: T.navyMid, fontFamily: "DM Sans", fontSize: 14 }}>
// //             Loading your workspace…
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="edb" style={{ minHeight: "100vh", background: T.bg, padding: "0 0 40px" }}>
// //       <style>{CSS}</style>

// //       {showPhotoModal && (
// //         <div
// //           style={{
// //             position: "fixed",
// //             inset: 0,
// //             background: "rgba(0,0,0,.5)",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             zIndex: 50,
// //             padding: 16,
// //           }}
// //         >
// //           <div
// //             style={{
// //               background: "#fff",
// //               borderRadius: 20,
// //               maxWidth: 420,
// //               width: "100%",
// //               padding: 24,
// //               boxShadow: "0 20px 60px rgba(0,0,0,.2)",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "space-between",
// //                 marginBottom: 20,
// //               }}
// //             >
// //               <span className="fd" style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>
// //                 Profile Photo
// //               </span>
// //               <button
// //                 onClick={() => setShowPhotoModal(false)}
// //                 style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
// //               >
// //                 <X size={18} />
// //               </button>
// //             </div>

// //             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
// //               <div
// //                 style={{
// //                   width: 120,
// //                   height: 120,
// //                   borderRadius: "50%",
// //                   border: `4px solid ${T.border}`,
// //                   background: "#f3f4f6",
// //                   overflow: "hidden",
// //                   position: "relative",
// //                 }}
// //               >
// //                 {employeePhotoUrl ? (
// //                   <img
// //                     src={employeePhotoUrl}
// //                     alt={displayName}
// //                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
// //                     onError={(e) => {
// //                       e.target.style.display = "none";
// //                     }}
// //                   />
// //                 ) : (
// //                   <div
// //                     style={{
// //                       width: "100%",
// //                       height: "100%",
// //                       display: "flex",
// //                       alignItems: "center",
// //                       justifyContent: "center",
// //                     }}
// //                   >
// //                     <User size={48} color="#9ca3af" />
// //                   </div>
// //                 )}

// //                 {uploading && (
// //                   <div
// //                     style={{
// //                       position: "absolute",
// //                       inset: 0,
// //                       background: "rgba(0,0,0,.6)",
// //                       display: "flex",
// //                       alignItems: "center",
// //                       justifyContent: "center",
// //                       color: "#fff",
// //                       fontSize: 12,
// //                       fontWeight: 600,
// //                     }}
// //                   >
// //                     Uploading…
// //                   </div>
// //                 )}
// //               </div>

// //               <input
// //                 ref={fileInputRef}
// //                 type="file"
// //                 accept="image/*"
// //                 onChange={handleFileSelect}
// //                 style={{ display: "none" }}
// //               />

// //               <div style={{ display: "flex", gap: 8, width: "100%" }}>
// //                 <button
// //                   onClick={() => fileInputRef.current?.click()}
// //                   disabled={uploading}
// //                   style={{
// //                     flex: 1,
// //                     padding: "10px 16px",
// //                     background: T.coral,
// //                     color: "#fff",
// //                     border: "none",
// //                     borderRadius: 10,
// //                     fontWeight: 600,
// //                     cursor: "pointer",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     gap: 6,
// //                     opacity: uploading ? 0.5 : 1,
// //                   }}
// //                 >
// //                   <Upload size={14} />
// //                   {uploading ? "Uploading…" : employeePhotoUrl ? "Change Photo" : "Upload Photo"}
// //                 </button>

// //                 {employeePhotoUrl && (
// //                   <button
// //                     onClick={handleDeletePhoto}
// //                     disabled={uploading}
// //                     style={{
// //                       padding: "10px 14px",
// //                       background: "#FEE2E2",
// //                       color: "#DC2626",
// //                       border: "none",
// //                       borderRadius: 10,
// //                       fontWeight: 600,
// //                       cursor: "pointer",
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: 6,
// //                       opacity: uploading ? 0.5 : 1,
// //                     }}
// //                   >
// //                     <X size={14} />
// //                     Remove
// //                   </button>
// //                 )}
// //               </div>

// //               <p style={{ fontSize: 11, color: "#9ca3af" }}>JPG, PNG or GIF · Max 5MB</p>

// //               {uploadSuccess && (
// //                 <div
// //                   style={{
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: 8,
// //                     padding: "10px 14px",
// //                     background: "#ECFDF5",
// //                     border: "1px solid #A7F3D0",
// //                     borderRadius: 10,
// //                     color: "#065F46",
// //                     fontSize: 13,
// //                     width: "100%",
// //                   }}
// //                 >
// //                   <Check size={14} />
// //                   {uploadSuccess}
// //                 </div>
// //               )}

// //               {uploadError && (
// //                 <div
// //                   style={{
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: 8,
// //                     padding: "10px 14px",
// //                     background: "#FEF2F2",
// //                     border: "1px solid #FECACA",
// //                     borderRadius: 10,
// //                     color: "#991B1B",
// //                     fontSize: 13,
// //                     width: "100%",
// //                   }}
// //                 >
// //                   <X size={14} />
// //                   {uploadError}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
// //         <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
// //           <div className="edb-card edb-animate" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
// //             <div
// //               style={{
// //                 position: "absolute",
// //                 top: -20,
// //                 right: -20,
// //                 width: 100,
// //                 height: 100,
// //                 borderRadius: "50%",
// //                 background: "rgba(255,107,53,.06)",
// //                 pointerEvents: "none",
// //               }}
// //             />

// //             <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
// //               <div
// //                 className="edb-avatar-ring"
// //                 style={{ width: 68, height: 68, flexShrink: 0 }}
// //                 onClick={() => setShowPhotoModal(true)}
// //               >
// //                 {employeePhotoUrl ? (
// //                   <img
// //                     src={employeePhotoUrl}
// //                     alt={displayName}
// //                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
// //                     onError={(e) => {
// //                       e.target.style.display = "none";
// //                     }}
// //                   />
// //                 ) : (
// //                   <div
// //                     style={{
// //                       width: "100%",
// //                       height: "100%",
// //                       display: "flex",
// //                       alignItems: "center",
// //                       justifyContent: "center",
// //                       background: `linear-gradient(135deg,rgba(255,107,53,.12),rgba(0,194,168,.12))`,
// //                     }}
// //                   >
// //                     <User size={28} color={T.coral} />
// //                   </div>
// //                 )}
// //                 <div className="cam-overlay">
// //                   <Camera size={16} color="#fff" />
// //                 </div>
// //               </div>

// //               <div>
// //                 <p
// //                   style={{
// //                     fontSize: 10,
// //                     fontWeight: 700,
// //                     color: T.coral,
// //                     textTransform: "uppercase",
// //                     letterSpacing: ".1em",
// //                     marginBottom: 2,
// //                   }}
// //                 >
// //                   Welcome back
// //                 </p>
// //                 <h2 className="fd" style={{ fontSize: 20, fontWeight: 900, color: T.navy, margin: 0 }}>
// //                   {displayName}
// //                 </h2>
// //                 <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Employee</p>
// //               </div>
// //             </div>

// //             <div
// //               style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}
// //               className="edb-mini-grid"
// //             >
// //               <style>{`@media(max-width:640px){.edb-mini-grid{grid-template-columns:1fr!important}}`}</style>

// //               <div
// //                 style={{
// //                   background: "#F8FAFF",
// //                   border: `1.5px solid ${T.border}`,
// //                   borderRadius: 12,
// //                   padding: "10px 12px",
// //                 }}
// //               >
// //                 <p
// //                   style={{
// //                     fontSize: 10,
// //                     color: "#64748b",
// //                     marginBottom: 4,
// //                     textTransform: "uppercase",
// //                     letterSpacing: ".06em",
// //                   }}
// //                 >
// //                   {month}/{year} Attendance
// //                 </p>
// //                 <p className="fd" style={{ fontSize: 20, fontWeight: 900, color: T.navy }}>
// //                   {attendancePercent != null ? `${attendancePercent}%` : "—"}
// //                 </p>
// //                 <p
// //                   style={{
// //                     fontSize: 10,
// //                     color: T.teal,
// //                     marginTop: 2,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: 4,
// //                   }}
// //                 >
// //                   <Activity size={10} />
// //                   Monthly avg
// //                 </p>
// //               </div>

// //               <div
// //                 onClick={handleLeaveClick}
// //                 style={{
// //                   background: availableLeave > 10 ? "#ECFDF5" : availableLeave > 0 ? "#FFFBEB" : "#FEF2F2",
// //                   border: `1.5px solid ${
// //                     availableLeave > 10 ? "#A7F3D0" : availableLeave > 0 ? "#FDE68A" : "#FECACA"
// //                   }`,
// //                   borderRadius: 12,
// //                   padding: "10px 12px",
// //                   cursor: "pointer",
// //                   transition: "all .2s ease",
// //                 }}
// //               >
// //                 <p
// //                   style={{
// //                     fontSize: 10,
// //                     color: "#64748b",
// //                     marginBottom: 4,
// //                     textTransform: "uppercase",
// //                     letterSpacing: ".06em",
// //                   }}
// //                 >
// //                   Leave Balance
// //                 </p>
// //                 <p className="fd" style={{ fontSize: 20, fontWeight: 900, color: T.navy }}>
// //                   {availableLeave}
// //                 </p>
// //                 <p
// //                   style={{
// //                     fontSize: 10,
// //                     color: "#64748b",
// //                     marginTop: 2,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: 4,
// //                     flexWrap: "wrap",
// //                   }}
// //                 >
// //                   <Calendar size={10} />
// //                   {usedLeaveDays} used · {availableLeave} remaining of {TOTAL_LEAVES}
// //                 </p>
// //               </div>
// //             </div>

// //             <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
// //               <span
// //                 className="edb-stat-chip"
// //                 style={{ background: "#EBF8FF", color: "#0369A1", borderColor: "#BAE6FD" }}
// //               >
// //                 <Clock size={10} />
// //                 Status: {headerStats.todayStatus || "—"}
// //               </span>

// //               <span
// //                 className="edb-stat-chip"
// //                 style={{ background: "#ECFDF5", color: "#065F46", borderColor: "#A7F3D0" }}
// //               >
// //                 <TrendingUp size={10} />
// //                 {headerStats.performanceStatus || "Good"}
// //               </span>
// //             </div>

// //             {loadError && <p style={{ fontSize: 11, color: "#f87171", marginTop: 8 }}>{loadError}</p>}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "@/lib/apiClient";
// import {
//   Calendar, Clock, Activity,
//   Camera, Upload, X, Check, TrendingUp,
// } from "lucide-react";

// /*
//   UserService saves photo as:
//     baseUrl + "/uploads/profile-photos/" + fileName
//   where baseUrl = app.base-url property = "http://localhost:8080" by default.

//   fixPhotoUrl() strips whatever host:port the backend used and replaces it
//   with the real API_BASE_URL so the browser can load the image.

//   Upload endpoint : POST  /api/users/{userId}/upload-photo  (param: "photo")
//   Delete endpoint : DELETE /api/users/{userId}/photo
//   Profile endpoint: GET    /api/users/{userId}
//   Response shape  : { success: boolean, message: string, data: T }
//   Photo field     : data.profilePhotoUrl  (User.java confirmed)
//   Upload response : data.photoUrl         (Map<String,String> in controller)
// */

// const cleanBase = API_BASE_URL.replace(/\/+$/, "");

// const T = {
//   navy: "#0D1F2D", coral: "#FF6B35", teal: "#00C2A8",
//   navyMid: "#1E3448", bg: "#F5F7FB", border: "#E8ECF2",
// };
// const TOTAL_LEAVES = 24;

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
// .edb * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
// .edb .fd { font-family:'Sora',sans-serif; }
// .edb-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px;
//   box-shadow:0 2px 12px rgba(13,31,45,.05); transition:box-shadow .2s; }
// .edb-card:hover { box-shadow:0 4px 20px rgba(13,31,45,.09); }
// .edb-stat-chip { display:inline-flex; align-items:center; gap:6px; border-radius:999px;
//   padding:5px 12px; font-size:11px; font-weight:600; border:1.5px solid; }
// .edb-avatar-ring { border-radius:50%; overflow:hidden; cursor:pointer; position:relative;
//   background:linear-gradient(135deg,rgba(255,107,53,.15),rgba(0,194,168,.15));
//   border:3px solid rgba(255,107,53,.3); transition:all .2s; }
// .edb-avatar-ring:hover { border-color:${T.coral}; }
// .edb-avatar-ring .cam-overlay { position:absolute; inset:0; background:rgba(0,0,0,0);
//   display:flex; align-items:center; justify-content:center; opacity:0; transition:all .2s; }
// .edb-avatar-ring:hover .cam-overlay { background:rgba(0,0,0,.45); opacity:1; }
// @keyframes edbFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
// .edb-animate { animation:edbFadeUp .4s ease both; }
// @keyframes spin { to{transform:rotate(360deg)} }
// `;

// /* ─────────────────────────────────────────────
//    fixPhotoUrl
//    The service stores: http://localhost:8080/uploads/profile-photos/xxx.jpg
//    We need:           http://<real-server>/uploads/profile-photos/xxx.jpg

//    Strategy: keep only the PATH part (/uploads/...) and prepend cleanBase.
//    Blob URLs (local preview) are returned unchanged.
// ───────────────────────────────────────────── */
// function fixPhotoUrl(raw) {
//   if (!raw || typeof raw !== "string") return "";
//   const url = raw.trim();

//   // Local blob preview — use as-is
//   if (url.startsWith("blob:")) return url;

//   // Hosted on CDN (Cloudinary / S3 / Firebase) — use as-is
//   if (
//     url.includes("cloudinary.com") ||
//     url.includes("amazonaws.com")  ||
//     url.includes("googleapis.com") ||
//     url.includes("firebasestorage")
//   ) return url;

//   // Backend returned localhost / 127.0.0.1 URL — extract path and rebase
//   if (url.includes("localhost") || url.includes("127.0.0.1")) {
//     // e.g. http://localhost:8080/uploads/profile-photos/user_3_uuid.jpg
//     // → /uploads/profile-photos/user_3_uuid.jpg
//     const pathMatch = url.match(/https?:\/\/[^/]+(\/.*)/);
//     if (pathMatch) return `${cleanBase}${pathMatch[1]}`;
//   }

//   // Already a relative path
//   if (url.startsWith("/")) return `${cleanBase}${url}`;

//   // Full URL with correct host — use as-is
//   return url;
// }

// /* ── Avatar — shows photo or initials fallback ── */
// function Avatar({ src, name }) {
//   const [err, setErr] = useState(false);
//   useEffect(() => { setErr(false); }, [src]);

//   const initials = (name || "?")
//     .trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

//   if (src && !err) {
//     return (
//       <img
//         src={src}
//         alt={name || "Profile"}
//         style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
//         onError={() => setErr(true)}
//       />
//     );
//   }
//   return (
//     <div style={{
//       width: "100%", height: "100%", display: "flex",
//       alignItems: "center", justifyContent: "center",
//       background: "linear-gradient(135deg,rgba(255,107,53,.18),rgba(0,194,168,.18))",
//       color: T.coral, fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22,
//     }}>
//       {initials}
//     </div>
//   );
// }

// /* ── Main component ── */
// export default function EmployeeDashboard() {
//   const navigate      = useNavigate();
//   const modalInputRef = useRef(null);

//   const handleLeaveClick = () => navigate("/employee/leaves");

//   const [employeeName,   setEmployeeName]   = useState("");
//   const [photoUrl,       setPhotoUrl]       = useState("");
//   const [photoKey,       setPhotoKey]       = useState(0);
//   const [loading,        setLoading]        = useState(true);
//   const [loadError,      setLoadError]      = useState("");
//   const [uploading,      setUploading]      = useState(false);
//   const [uploadMsg,      setUploadMsg]      = useState({ type: "", text: "" }); // {type:"success"|"error", text}
//   const [showModal,      setShowModal]      = useState(false);

//   const [stats, setStats] = useState({
//     todayStatus: null, performanceStatus: null,
//     attendancePct: null,
//     availableLeave: TOTAL_LEAVES, usedLeaveDays: 0,
//   });

//   /* ── helpers ── */
//   const safeUrl = path => `${cleanBase}/${path.replace(/^\/+/, "")}`;

//   const authHdrs = () => {
//     const t = localStorage.getItem("token") || "";
//     return { Authorization: t.startsWith("Bearer ") ? t : `Bearer ${t}` };
//   };

//   /* Store photo — always sanitise through fixPhotoUrl first */
//   const storePhoto = rawUrl => {
//     if (!rawUrl) return;
//     const fixed = fixPhotoUrl(rawUrl);
//     if (!fixed) return;
//     setPhotoUrl(fixed);
//     setPhotoKey(k => k + 1);
//     localStorage.setItem("employeePhotoUrl", fixed);
//   };

//   const showSuccess = text => { setUploadMsg({ type: "success", text }); setTimeout(() => setUploadMsg({ type: "", text: "" }), 2500); };
//   const showError   = text => { setUploadMsg({ type: "error",   text }); setTimeout(() => setUploadMsg({ type: "", text: "" }), 4000); };

//   const getCurrentMonthYear = () => {
//     const n = new Date();
//     return { month: String(n.getMonth() + 1).padStart(2, "0"), year: String(n.getFullYear()) };
//   };

//   /* ────────────────────────────────────────────
//      UPLOAD
//      POST /api/users/{userId}/upload-photo
//      FormData param: "photo"   ← @RequestParam("photo") MultipartFile
//      Response: ApiResponse<Map<String,String>>
//        { success: true, data: { photoUrl: "http://localhost:8080/uploads/...", message: "..." } }
//      fixPhotoUrl() converts the localhost URL to the real server URL.
//   ──────────────────────────────────────────── */
//   const handleFileSelect = e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) { showError("Please select an image file (JPG, PNG, GIF)"); return; }
//     if (file.size > 5 * 1024 * 1024)    { showError("File too large — max 5 MB");                   return; }
//     doUpload(file);
//   };

//   const doUpload = async file => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) { showError("Session missing — please log in again"); return; }

//     setUploading(true);
//     setUploadMsg({ type: "", text: "" });

//     // Instant local preview
//     storePhoto(URL.createObjectURL(file));

//     try {
//       const fd = new FormData();
//       fd.append("photo", file);   // must match @RequestParam("photo")

//       const res  = await fetch(safeUrl(`/api/users/${userId}/upload-photo`), {
//         method: "POST",
//         headers: authHdrs(),        // no Content-Type — browser sets multipart boundary
//         body: fd,
//       });
//       const json = await res.json();

//       if (res.ok && json.success) {
//         /*
//           json.data = Map<String,String> = { photoUrl: "...", message: "..." }
//           The URL may be http://localhost:8080/... — fixPhotoUrl corrects it.
//         */
//         const serverUrl = json.data?.photoUrl || "";
//         if (serverUrl) storePhoto(serverUrl);   // replaces blob with real URL
//         showSuccess("Photo updated successfully!");
//         setTimeout(() => setShowModal(false), 2000);
//       } else {
//         showError(json.message || "Upload failed");
//       }
//     } catch {
//       showError("Network error — please try again");
//     } finally {
//       setUploading(false);
//       if (modalInputRef.current) modalInputRef.current.value = "";
//     }
//   };

//   /* ────────────────────────────────────────────
//      DELETE
//      DELETE /api/users/{userId}/photo
//      Response: ApiResponse<String> { success: true }
//   ──────────────────────────────────────────── */
//   const handleDelete = async () => {
//     if (!window.confirm("Remove your profile photo?")) return;
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     setUploading(true);
//     setUploadMsg({ type: "", text: "" });

//     try {
//       const res  = await fetch(safeUrl(`/api/users/${userId}/photo`), {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json", ...authHdrs() },
//       });
//       const json = await res.json();

//       if (res.ok && json.success) {
//         setPhotoUrl("");
//         setPhotoKey(k => k + 1);
//         localStorage.removeItem("employeePhotoUrl");
//         showSuccess("Photo removed");
//         setTimeout(() => setShowModal(false), 2000);
//       } else {
//         showError(json.message || "Delete failed");
//       }
//     } catch { showError("Network error"); }
//     finally  { setUploading(false); }
//   };

//   /* ────────────────────────────────────────────
//      INITIAL DATA LOAD
//      GET /api/users/{userId}
//      Response: ApiResponse<User>
//        { success: true, data: { fullName, profilePhotoUrl, ... } }
//      profilePhotoUrl confirmed from User.java entity.
//   ──────────────────────────────────────────── */
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       const userId = localStorage.getItem("userId");
//       const hdrs   = { "Content-Type": "application/json", ...authHdrs() };

//       if (!userId) {
//         setEmployeeName("Employee");
//         setLoadError("Session missing — please log in");
//         setLoading(false);
//         return;
//       }

//       // Show cached photo immediately (already fixed when previously stored)
//       const cached = localStorage.getItem("employeePhotoUrl");
//       if (cached) storePhoto(cached);

//       try {
//         /* User profile */
//         try {
//           const r = await fetch(safeUrl(`/api/users/${userId}`), { headers: hdrs });
//           if (r.ok) {
//             const j = await r.json();
//             const u = j.data || {};

//             // fullName confirmed from User.java
//             setEmployeeName(u.fullName || u.name || "Employee");
//             localStorage.setItem("employeeName", u.fullName || u.name || "Employee");

//             // profilePhotoUrl confirmed from User.java
//             // storePhoto → fixPhotoUrl converts localhost:8080 → real server
//             if (u.profilePhotoUrl) storePhoto(u.profilePhotoUrl);
//           }
//         } catch {}

//         /* Leaves */
//         try {
//           const r = await fetch(safeUrl(`/api/leaves/my-leaves`), { headers: hdrs });
//           if (r.ok) {
//             const j      = await r.json();
//             const leaves  = j.data || [];
//             const approved = leaves.filter(l => (l.status || "").toUpperCase() === "APPROVED");
//             const used     = approved.reduce((s, l) => s + (Number(l.totalDays) || 0), 0);
//             setStats(p => ({
//               ...p,
//               availableLeave: Math.max(0, TOTAL_LEAVES - used),
//               usedLeaveDays:  used,
//             }));
//           }
//         } catch {}

//         /* Dashboard */
//         try {
//           const r = await fetch(safeUrl(`/api/dashboard/employee/${userId}`), { headers: hdrs });
//           if (r.ok) {
//             const j = await r.json(); const d = j.data || {};
//             setStats(p => ({
//               ...p,
//               todayStatus:       d.todayStatus       || d.todayAttendance || "—",
//               performanceStatus: d.performanceStatus || d.performance     || "Good",
//             }));
//           }
//         } catch {}

//         /* Monthly attendance */
//         try {
//           const { month, year } = getCurrentMonthYear();
//           const r = await fetch(
//             safeUrl(`/api/attendance/monthly?employeeId=${userId}&year=${year}&month=${month}`),
//             { headers: hdrs }
//           );
//           if (r.ok) {
//             const j = await r.json(); const d = j.data || {};
//             const pct = d.totalDays > 0
//               ? Math.round((d.presentDays / d.totalDays) * 1000) / 10 : null;
//             setStats(p => ({ ...p, attendancePct: pct }));
//           }
//         } catch {}

//         /* Today attendance */
//         try {
//           const r = await fetch(safeUrl(`/api/attendance/today/${userId}`), { headers: hdrs });
//           if (r.ok) {
//             const j = await r.json(); const d = j.data || {};
//             setStats(p => ({
//               ...p, todayStatus: d.status || d.attendanceStatus || p.todayStatus,
//             }));
//           }
//         } catch {}

//         setLoadError("");
//       } catch { setLoadError("Failed to load data"); }
//       finally  { setLoading(false); }
//     })();
//   }, []);

//   const displayName    = loading ? "…" : employeeName || "Employee";
//   const { month, year } = getCurrentMonthYear();

//   /* ── Loading screen ── */
//   if (loading) return (
//     <div style={{ minHeight: "100vh", background: T.bg, display: "flex",
//       alignItems: "center", justifyContent: "center" }}>
//       <style>{CSS}</style>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 40, height: 40, borderRadius: "50%",
//           border: `3px solid ${T.coral}`, borderTopColor: "transparent",
//           animation: "spin 0.9s linear infinite", margin: "0 auto 12px" }} />
//         <p style={{ color: T.navyMid, fontFamily: "DM Sans", fontSize: 14 }}>
//           Loading your workspace…
//         </p>
//       </div>
//     </div>
//   );

//   /* ── Shared modal feedback banner ── */
//   const FeedbackBanner = () => uploadMsg.text ? (
//     <div style={{
//       display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
//       borderRadius: 10, fontSize: 13, width: "100%",
//       background: uploadMsg.type === "success" ? "#ECFDF5" : "#FEF2F2",
//       border:     `1px solid ${uploadMsg.type === "success" ? "#A7F3D0" : "#FECACA"}`,
//       color:      uploadMsg.type === "success" ? "#065F46" : "#991B1B",
//     }}>
//       {uploadMsg.type === "success" ? <Check size={14} /> : <X size={14} />}
//       {uploadMsg.text}
//     </div>
//   ) : null;

//   return (
//     <div className="edb" style={{ minHeight: "100vh", background: T.bg, padding: "0 0 40px" }}>
//       <style>{CSS}</style>

//       {/* ══════════════════════════════════════
//           PHOTO MODAL
//       ══════════════════════════════════════ */}
//       {showModal && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
//           display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
//           <div style={{ background: "#fff", borderRadius: 20, maxWidth: 400, width: "100%",
//             padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>

//             {/* header */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//               <span className="fd" style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>
//                 Profile Photo
//               </span>
//               <button onClick={() => setShowModal(false)}
//                 style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
//                 <X size={18} />
//               </button>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

//               {/* preview circle */}
//               <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden",
//                 border: `4px solid ${T.border}`, position: "relative", flexShrink: 0 }}>
//                 <Avatar key={`modal-${photoKey}`} src={photoUrl} name={displayName} />
//                 {uploading && (
//                   <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)",
//                     display: "flex", flexDirection: "column", alignItems: "center",
//                     justifyContent: "center", gap: 6 }}>
//                     <div style={{ width: 24, height: 24, borderRadius: "50%",
//                       border: "2px solid #fff", borderTopColor: "transparent",
//                       animation: "spin 0.8s linear infinite" }} />
//                     <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>Uploading…</span>
//                   </div>
//                 )}
//               </div>

//               <input ref={modalInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
//                 onChange={handleFileSelect} style={{ display: "none" }} />

//               {/* action buttons */}
//               <div style={{ display: "flex", gap: 8, width: "100%" }}>
//                 <button
//                   onClick={() => modalInputRef.current?.click()}
//                   disabled={uploading}
//                   style={{ flex: 1, padding: "10px 16px", background: T.coral, color: "#fff",
//                     border: "none", borderRadius: 10, fontWeight: 600,
//                     cursor: uploading ? "not-allowed" : "pointer",
//                     display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//                     opacity: uploading ? 0.6 : 1, fontFamily: "inherit", fontSize: 13 }}>
//                   <Upload size={14} />
//                   {uploading ? "Uploading…" : photoUrl ? "Change Photo" : "Upload Photo"}
//                 </button>

//                 {photoUrl && !uploading && (
//                   <button
//                     onClick={handleDelete}
//                     style={{ padding: "10px 14px", background: "#FEE2E2", color: "#DC2626",
//                       border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer",
//                       display: "flex", alignItems: "center", gap: 6,
//                       fontFamily: "inherit", fontSize: 13 }}>
//                     <X size={14} /> Remove
//                   </button>
//                 )}
//               </div>

//               <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
//                 JPG, PNG or GIF · Max 5 MB
//               </p>

//               <FeedbackBanner />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════════════════════════════════
//           DASHBOARD CARD
//       ══════════════════════════════════════ */}
//       <div style={{ padding: "20px 24px" }}>
//         <div className="edb-card edb-animate"
//           style={{ padding: 20, position: "relative", overflow: "hidden" }}>

//           {/* decorative circle */}
//           <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100,
//             borderRadius: "50%", background: "rgba(255,107,53,.06)", pointerEvents: "none" }} />

//           {/* profile row */}
//           <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
//             <div
//               className="edb-avatar-ring"
//               style={{ width: 68, height: 68, flexShrink: 0 }}
//               onClick={() => setShowModal(true)}
//             >
//               <Avatar key={`hero-${photoKey}`} src={photoUrl} name={displayName} />
//               <div className="cam-overlay"><Camera size={16} color="#fff" /></div>
//             </div>

//             <div>
//               <p style={{ fontSize: 10, fontWeight: 700, color: T.coral,
//                 textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>
//                 Welcome back
//               </p>
//               <h2 className="fd" style={{ fontSize: 20, fontWeight: 900, color: T.navy, margin: 0 }}>
//                 {displayName}
//               </h2>
//               <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Employee</p>
//             </div>
//           </div>

//           {/* stats grid */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}
//             className="edb-mini-grid">
//             <style>{`@media(max-width:640px){.edb-mini-grid{grid-template-columns:1fr!important}}`}</style>

//             {/* attendance */}
//             <div style={{ background: "#F8FAFF", border: `1.5px solid ${T.border}`,
//               borderRadius: 12, padding: "10px 12px" }}>
//               <p style={{ fontSize: 10, color: "#64748b", marginBottom: 4,
//                 textTransform: "uppercase", letterSpacing: ".06em" }}>
//                 {month}/{year} Attendance
//               </p>
//               <p className="fd" style={{ fontSize: 20, fontWeight: 900, color: T.navy }}>
//                 {stats.attendancePct != null ? `${stats.attendancePct}%` : "—"}
//               </p>
//               <p style={{ fontSize: 10, color: T.teal, marginTop: 2,
//                 display: "flex", alignItems: "center", gap: 4 }}>
//                 <Activity size={10} /> Monthly avg
//               </p>
//             </div>

//             {/* leave */}
//             <div
//               onClick={handleLeaveClick}
//               style={{
//                 background:
//                   stats.availableLeave > 10 ? "#ECFDF5" :
//                   stats.availableLeave > 0  ? "#FFFBEB" : "#FEF2F2",
//                 border: `1.5px solid ${
//                   stats.availableLeave > 10 ? "#A7F3D0" :
//                   stats.availableLeave > 0  ? "#FDE68A" : "#FECACA"
//                 }`,
//                 borderRadius: 12, padding: "10px 12px",
//                 cursor: "pointer", transition: "all .2s ease",
//               }}
//             >
//               <p style={{ fontSize: 10, color: "#64748b", marginBottom: 4,
//                 textTransform: "uppercase", letterSpacing: ".06em" }}>
//                 Leave Balance
//               </p>
//               <p className="fd" style={{ fontSize: 20, fontWeight: 900, color: T.navy }}>
//                 {stats.availableLeave}
//               </p>
//               <p style={{ fontSize: 10, color: "#64748b", marginTop: 2,
//                 display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
//                 <Calendar size={10} />
//                 {stats.usedLeaveDays} used · {stats.availableLeave} remaining of {TOTAL_LEAVES}
//               </p>
//             </div>
//           </div>

//           {/* status chips */}
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//             <span className="edb-stat-chip"
//               style={{ background: "#EBF8FF", color: "#0369A1", borderColor: "#BAE6FD" }}>
//               <Clock size={10} /> Status: {stats.todayStatus || "—"}
//             </span>
//             <span className="edb-stat-chip"
//               style={{ background: "#ECFDF5", color: "#065F46", borderColor: "#A7F3D0" }}>
//               <TrendingUp size={10} /> {stats.performanceStatus || "Good"}
//             </span>
//           </div>

//           {loadError && (
//             <p style={{ fontSize: 11, color: "#f87171", marginTop: 8 }}>{loadError}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


//18-3-2026
import React, { useEffect, useState, useRef } from "react";
import api, { API_BASE_URL } from "@/lib/apiClient";
import { Calendar, Clock, Activity, Camera, Upload, X, Check, TrendingUp, Lock } from "lucide-react";

const cleanBase = API_BASE_URL.replace(/\/+$/, "");
const T = { navy:"#0D1F2D", coral:"#FF6B35", teal:"#00C2A8", navyMid:"#1E3448", bg:"#F5F7FB", border:"#E8ECF2" };
const FALLBACK_TOTAL = 24;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.edb * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.edb .fd { font-family:'Sora',sans-serif; }
.edb-card { background:#fff; border:1.5px solid #E8ECF2; border-radius:18px; box-shadow:0 2px 12px rgba(13,31,45,.05); transition:box-shadow .2s; }
.edb-card:hover { box-shadow:0 4px 20px rgba(13,31,45,.09); }
.edb-stat-chip { display:inline-flex; align-items:center; gap:6px; border-radius:999px; padding:5px 12px; font-size:11px; font-weight:600; border:1.5px solid; }
.edb-avatar-ring { border-radius:50%; overflow:hidden; cursor:pointer; position:relative; background:linear-gradient(135deg,rgba(255,107,53,.15),rgba(0,194,168,.15)); border:3px solid rgba(255,107,53,.3); transition:all .2s; }
.edb-avatar-ring:hover { border-color:#FF6B35; }
.edb-avatar-ring .cam-overlay { position:absolute; inset:0; background:rgba(0,0,0,0); display:flex; align-items:center; justify-content:center; opacity:0; transition:all .2s; }
.edb-avatar-ring:hover .cam-overlay { background:rgba(0,0,0,.45); opacity:1; }
@keyframes edbFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.edb-animate { animation:edbFadeUp .4s ease both; }
@keyframes spin { to{transform:rotate(360deg)} }
.edb-action-card { background:#fff; border:1.5px solid #E8ECF2; border-radius:14px; padding:14px 16px; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:12px; }
.edb-action-card:hover { border-color:#FF6B35; box-shadow:0 4px 16px rgba(255,107,53,.12); transform:translateY(-1px); }
@media(max-width:640px){.edb-mini-grid{grid-template-columns:1fr!important}}
`;

function fixPhotoUrl(raw) {
  if (!raw || typeof raw !== "string") return "";
  const url = raw.trim();
  if (url.startsWith("blob:")) return url;
  if (url.includes("cloudinary.com")||url.includes("amazonaws.com")||url.includes("googleapis.com")||url.includes("firebasestorage")) return url;
  if (url.includes("localhost")||url.includes("127.0.0.1")) { const m=url.match(/https?:\/\/[^/]+(\/.*)/); if(m) return `${cleanBase}${m[1]}`; }
  if (url.startsWith("/")) return `${cleanBase}${url}`;
  return url;
}

function Avatar({ src, name }) {
  const [err, setErr] = useState(false);
  useEffect(() => { setErr(false); }, [src]);
  const initials = (name||"?").trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
  if (src && !err) return <img src={src} alt={name||"Profile"} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={()=>setErr(true)} />;
  return <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,rgba(255,107,53,.18),rgba(0,194,168,.18))",color:"#FF6B35",fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:22}}>{initials}</div>;
}

export default function EmployeeDashboard({ navigateTo }) {
  const fileInputRef = useRef(null);

  const [employeeName,  setEmployeeName]  = useState(localStorage.getItem("employeeName")||"");
  const [employeeRole,  setEmployeeRole]  = useState("Employee");
  const [employeeEmail, setEmployeeEmail] = useState(localStorage.getItem("userEmail")||"");
  const [employeeId,    setEmployeeId]    = useState(localStorage.getItem("employeeId")||"");
  const [photoUrl,      setPhotoUrl]      = useState("");
  const [photoKey,      setPhotoKey]      = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [loadError,     setLoadError]     = useState("");
  const [uploading,     setUploading]     = useState(false);
  const [uploadMsg,     setUploadMsg]     = useState({type:"",text:""});
  const [showModal,     setShowModal]     = useState(false);
  const [pwdSummary,    setPwdSummary]    = useState(null);
  const [stats, setStats] = useState({
    todayStatus:null, performanceStatus:null, attendancePct:null,
    totalEntitlement:FALLBACK_TOTAL, usedLeaveDays:0,
    remainingDays:FALLBACK_TOTAL, pendingLeaves:0
  });

  const storePhoto = raw => {
    if (!raw) return;
    const f = fixPhotoUrl(raw);
    if (!f) return;
    setPhotoUrl(f);
    setPhotoKey(k => k + 1);
    if (!f.startsWith("blob:")) {
      localStorage.setItem("employeePhotoUrl", f);
    }
  };

  const showMsg = (type, text) => {
    setUploadMsg({type, text});
    setTimeout(() => setUploadMsg({type:"",text:""}), type==="success" ? 2500 : 4000);
  };

  const getCurrentMonthYear = () => {
    const n = new Date();
    return { month: String(n.getMonth()+1).padStart(2,"0"), year: String(n.getFullYear()) };
  };

  const handleFileSelect = e => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { showMsg("error","Please select an image file"); return; }
    if (file.size > 5*1024*1024) { showMsg("error","File too large — max 5 MB"); return; }
    doUpload(file);
  };

  const doUpload = async file => {
    const userId = localStorage.getItem("userId");
    if (!userId) { showMsg("error","Session missing — please log in again"); return; }

    setUploading(true);
    setUploadMsg({type:"",text:""});

    // Immediate local preview
    const blobUrl = URL.createObjectURL(file);
    setPhotoUrl(blobUrl);
    setPhotoKey(k => k + 1);

    try {
      const fd = new FormData();
      fd.append("photo", file);

      // ✅ KEY FIX: No custom Content-Type header at all.
      // Axios + browser must set "multipart/form-data; boundary=----XYZ"
      // automatically. Passing "Content-Type": undefined, null, or the string
      // "multipart/form-data" all strip the boundary, making Spring's
      // MultipartResolver unable to parse the body → 400 Bad Request.
      const res = await api.post(`/api/users/${userId}/upload-photo`, fd);

      const json = res.data;

      if (json?.success) {
        const serverUrl = json.data?.photoUrl || json.photoUrl || "";
        if (serverUrl) {
          URL.revokeObjectURL(blobUrl);
          storePhoto(serverUrl);
        }
        showMsg("success","Photo updated!");
        setTimeout(() => setShowModal(false), 2000);
      } else {
        URL.revokeObjectURL(blobUrl);
        const prevUrl = localStorage.getItem("employeePhotoUrl") || "";
        setPhotoUrl(prevUrl);
        setPhotoKey(k => k + 1);
        showMsg("error", json?.message || "Upload failed");
      }
    } catch (e) {
      URL.revokeObjectURL(blobUrl);
      const prevUrl = localStorage.getItem("employeePhotoUrl") || "";
      setPhotoUrl(prevUrl);
      setPhotoKey(k => k + 1);
      const msg = e.response?.data?.message || e.response?.data?.error || e.message || "Network error";
      showMsg("error", msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove your profile photo?")) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setUploading(true);
    try {
      const res = await api.delete(`/api/users/${userId}/photo`);
      const json = res.data;
      if (json?.success) {
        setPhotoUrl("");
        setPhotoKey(k => k + 1);
        localStorage.removeItem("employeePhotoUrl");
        showMsg("success","Photo removed");
        setTimeout(() => setShowModal(false), 2000);
      } else {
        showMsg("error", json?.message || "Delete failed");
      }
    } catch(e) {
      showMsg("error", e.response?.data?.message || "Network error");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const cachedPhoto = localStorage.getItem("employeePhotoUrl");
    if (cachedPhoto) storePhoto(cachedPhoto);

    (async () => {
      setLoading(true);

      let userId = localStorage.getItem("userId")||localStorage.getItem("user_id")||localStorage.getItem("id")||"";

      if (!userId) {
        for (const endpoint of ["/api/auth/me","/api/users/me"]) {
          try {
            const r = await api.get(endpoint);
            const u = r.data?.data||r.data?.user||r.data||{};
            const id = String(u.id||u.userId||"");
            if (id) {
              userId = id;
              localStorage.setItem("userId", id);
              if (u.email) { localStorage.setItem("userEmail",u.email); setEmployeeEmail(u.email); }
              const n = u.fullName||u.full_name||u.name||"";
              if (n) { localStorage.setItem("employeeName",n); setEmployeeName(n); }
              if (u.profilePhotoUrl) storePhoto(u.profilePhotoUrl);
              if (u.employeeId) { localStorage.setItem("employeeId",u.employeeId); setEmployeeId(u.employeeId); }
              break;
            }
          } catch {}
        }
      }

      try {
        if (userId) {
          try {
            const r = await api.get(`/api/users/${userId}`);
            const u = r.data?.data||r.data||{};
            const n = u.fullName||u.full_name||u.name||"";
            if (n) { setEmployeeName(n); localStorage.setItem("employeeName",n); }
            const em = u.email||"";
            if (em) { setEmployeeEmail(em); localStorage.setItem("userEmail",em); }
            const pos = u.position||u.designation||u.jobTitle||"";
            if (pos) setEmployeeRole(pos);
            if (u.profilePhotoUrl) storePhoto(u.profilePhotoUrl);
          } catch {
            try {
              const r2 = await api.get("/api/users/me");
              const u2 = r2.data?.data||r2.data||{};
              const n2 = u2.fullName||u2.full_name||u2.name||"";
              if (n2) { setEmployeeName(n2); localStorage.setItem("employeeName",n2); }
              const em2 = u2.email||"";
              if (em2) { setEmployeeEmail(em2); localStorage.setItem("userEmail",em2); }
              if (u2.profilePhotoUrl) storePhoto(u2.profilePhotoUrl);
            } catch {}
          }
        }

        try {
          const r = await api.get("/api/login-access/password-summary");
          const j = r.data; if (j.success) setPwdSummary(j.data);
        } catch {}

        let balanceFetched = false;
        try {
          const r = await api.get("/api/leaves/my-balance");
          const b = r.data?.data||{};
          const total     = Number(b.totalEntitlement??b.totalLeaves??b.total??FALLBACK_TOTAL);
          const used      = Number(b.usedDays??b.usedLeaves??b.used??0);
          const remaining = Number(b.remainingDays??b.remainingLeaves??b.remaining??Math.max(0,total-used));
          const pending   = Number(b.pendingLeaves??b.pending??0);
          setStats(p=>({...p,totalEntitlement:total,usedLeaveDays:used,remainingDays:remaining,pendingLeaves:pending}));
          balanceFetched = true;
        } catch {}

        if (!balanceFetched) {
          try {
            const r = await api.get("/api/leaves/my-leaves");
            const leaves   = r.data?.data||[];
            const approved = leaves.filter(l=>(l.status||"").toUpperCase()==="APPROVED");
            const pending  = leaves.filter(l=>(l.status||"").toUpperCase()==="PENDING").length;
            const used     = approved.reduce((s,l)=>s+(Number(l.totalDays)||0),0);
            setStats(p=>({...p,totalEntitlement:FALLBACK_TOTAL,usedLeaveDays:used,remainingDays:Math.max(0,FALLBACK_TOTAL-used),pendingLeaves:pending}));
          } catch {}
        }

        if (userId) {
          try {
            const r = await api.get(`/api/attendance/today/${userId}`);
            const d = r.data?.data||{};
            setStats(p=>({...p,todayStatus:d.status||d.attendanceStatus||"—"}));
          } catch {}
        }

        if (userId) {
          try {
            const {month,year} = getCurrentMonthYear();
            const r = await api.get(`/api/attendance/monthly?employeeId=${userId}&year=${year}&month=${month}`);
            const d = r.data?.data||{};
            const pct = d.totalDays>0 ? Math.round((d.presentDays/d.totalDays)*1000)/10 : null;
            setStats(p=>({...p,attendancePct:pct}));
          } catch {}
        }

        try {
          const r = await api.get("/api/performance/me");
          const d = r.data?.data||{};
          setStats(p=>({...p,performanceStatus:d.status||d.performanceStatus||"Good"}));
        } catch {}

        setLoadError("");
      } catch { setLoadError("Failed to load some data."); }
      finally { setLoading(false); }
    })();
  }, []);

  const displayName = employeeName||localStorage.getItem("employeeName")||"Employee";
  const {month,year} = getCurrentMonthYear();
  const leaveColor = stats.remainingDays>10
    ? {bg:"#ECFDF5",border:"#A7F3D0"}
    : stats.remainingDays>0
      ? {bg:"#FFFBEB",border:"#FDE68A"}
      : {bg:"#FEF2F2",border:"#FECACA"};
  const pwdUsed      = pwdSummary?.usedThisMonth??null;
  const pwdLimit     = pwdSummary?.monthlyLimit??2;
  const pwdLimitHit  = pwdUsed!==null&&pwdUsed>=pwdLimit;
  const pwdBadgeColor = pwdLimitHit?"#dc2626":pwdUsed===1?"#d97706":"#16a34a";
  const pwdBadgeBg    = pwdLimitHit?"#fef2f2":pwdUsed===1?"#fffbeb":"#f0fdf4";
  const pwdBorderClr  = pwdLimitHit?"#fecaca":pwdUsed===1?"#fde68a":"#bbf7d0";

  const FeedbackBanner = () => uploadMsg.text ? (
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,fontSize:13,width:"100%",
      background:uploadMsg.type==="success"?"#ECFDF5":"#FEF2F2",
      border:`1px solid ${uploadMsg.type==="success"?"#A7F3D0":"#FECACA"}`,
      color:uploadMsg.type==="success"?"#065F46":"#991B1B"}}>
      {uploadMsg.type==="success"?<Check size={14}/>:<X size={14}/>}{uploadMsg.text}
    </div>
  ) : null;

  return (
    <div className="edb" style={{minHeight:"100vh",background:T.bg,padding:"0 0 40px"}}>
      <style>{CSS}</style>

      {/* Root-level hidden file input — always mounted, ref always valid */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileSelect}
        style={{display:"none",position:"absolute"}}
      />

      {/* ── PHOTO MODAL ── */}
      {showModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
          <div style={{background:"#fff",borderRadius:20,maxWidth:400,width:"100%",padding:24,boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <span className="fd" style={{fontSize:16,fontWeight:800,color:T.navy}}>Profile Photo</span>
              <button onClick={()=>setShowModal(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af"}}><X size={18}/></button>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
              <div style={{width:120,height:120,borderRadius:"50%",overflow:"hidden",border:`4px solid ${T.border}`,position:"relative",flexShrink:0}}>
                <Avatar key={`modal-${photoKey}`} src={photoUrl} name={displayName}/>
                {uploading && (
                  <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
                    <div style={{width:24,height:24,borderRadius:"50%",border:"2px solid #fff",borderTopColor:"transparent",animation:"spin 0.8s linear infinite"}}/>
                    <span style={{color:"#fff",fontSize:11,fontWeight:600}}>Uploading…</span>
                  </div>
                )}
              </div>

              <div style={{display:"flex",gap:8,width:"100%"}}>
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={uploading}
                  style={{flex:1,padding:"10px 16px",background:T.coral,color:"#fff",border:"none",borderRadius:10,fontWeight:600,fontFamily:"inherit",cursor:uploading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:uploading?0.6:1,fontSize:13}}
                >
                  <Upload size={14}/>{uploading ? "Uploading…" : photoUrl ? "Change Photo" : "Upload Photo"}
                </button>
                {photoUrl && !uploading && (
                  <button
                    onClick={handleDelete}
                    style={{padding:"10px 14px",background:"#FEE2E2",color:"#DC2626",border:"none",borderRadius:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit",fontSize:13}}
                  >
                    <X size={14}/> Remove
                  </button>
                )}
              </div>
              <p style={{fontSize:11,color:"#9ca3af",margin:0}}>JPG, PNG or GIF · Max 5 MB</p>
              <FeedbackBanner/>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{padding:"20px 24px"}}>
        <div className="edb-card edb-animate" style={{padding:20,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,107,53,.06)",pointerEvents:"none"}}/>

          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18,flexWrap:"wrap"}}>
            <div className="edb-avatar-ring" style={{width:68,height:68,flexShrink:0}} onClick={()=>setShowModal(true)}>
              <Avatar key={`hero-${photoKey}`} src={photoUrl} name={displayName}/>
              <div className="cam-overlay"><Camera size={16} color="#fff"/></div>
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".1em",marginBottom:2}}>Welcome back</p>
              <h2 className="fd" style={{fontSize:20,fontWeight:900,color:T.navy,margin:0}}>{displayName}</h2>
              <p style={{fontSize:12,color:"#64748b",marginTop:2}}>
                {employeeRole||"Employee"}
                {employeeId&&<span style={{marginLeft:8,color:"#94a3b8"}}>· {employeeId}</span>}
              </p>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}} className="edb-mini-grid">
            <div style={{background:"#F8FAFF",border:`1.5px solid ${T.border}`,borderRadius:12,padding:"10px 12px"}}>
              <p style={{fontSize:10,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>{month}/{year} Attendance</p>
              <p className="fd" style={{fontSize:20,fontWeight:900,color:T.navy}}>{stats.attendancePct!=null?`${stats.attendancePct}%`:"—"}</p>
              <p style={{fontSize:10,color:T.teal,marginTop:2,display:"flex",alignItems:"center",gap:4}}><Activity size={10}/> Monthly avg</p>
            </div>
            <div
              onClick={()=>navigateTo&&navigateTo("em_leave")}
              style={{background:leaveColor.bg,border:`1.5px solid ${leaveColor.border}`,borderRadius:12,padding:"10px 12px",cursor:navigateTo?"pointer":"default",transition:"all .2s ease"}}
            >
              <p style={{fontSize:10,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>Leave Balance</p>
              <p className="fd" style={{fontSize:20,fontWeight:900,color:T.navy}}>{stats.remainingDays}</p>
              <p style={{fontSize:10,color:"#64748b",marginTop:2,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                <Calendar size={10}/>{stats.usedLeaveDays} used · {stats.remainingDays} of {stats.totalEntitlement} left
                {stats.pendingLeaves>0&&` · ${stats.pendingLeaves} pending`}
              </p>
            </div>
          </div>

          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            <span className="edb-stat-chip" style={{background:"#EBF8FF",color:"#0369A1",borderColor:"#BAE6FD"}}><Clock size={10}/> Today: {stats.todayStatus||"—"}</span>
            <span className="edb-stat-chip" style={{background:"#ECFDF5",color:"#065F46",borderColor:"#A7F3D0"}}><TrendingUp size={10}/> {stats.performanceStatus||"Good"}</span>
            {stats.pendingLeaves>0&&(
              <span className="edb-stat-chip" style={{background:"#FFFBEB",color:"#92400E",borderColor:"#FDE68A"}}>
                <Calendar size={10}/> {stats.pendingLeaves} leave{stats.pendingLeaves>1?"s":""} pending
              </span>
            )}
          </div>
          {loadError&&<p style={{fontSize:11,color:"#f87171",marginTop:8}}>{loadError}</p>}
        </div>

        <div style={{marginTop:14}}>
          <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Quick Actions</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}} className="edb-mini-grid">
            <div
              className="edb-action-card"
              onClick={()=>navigateTo&&navigateTo("em_change_pwd")}
              style={{background:pwdLimitHit?"#fef2f2":"#fff",border:`1.5px solid ${pwdLimitHit?"#fecaca":T.border}`}}
            >
              <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:pwdLimitHit?"linear-gradient(135deg,#fee2e2,#fecaca)":"linear-gradient(135deg,rgba(255,107,53,.12),rgba(0,194,168,.12))",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Lock size={16} color={pwdLimitHit?"#dc2626":T.coral}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:700,color:T.navy,margin:0}}>Change Password</p>
                {pwdSummary!==null ? (
                  <div style={{marginTop:4,display:"flex",alignItems:"center",gap:5}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700,background:pwdBadgeBg,color:pwdBadgeColor,border:`1px solid ${pwdBorderClr}`}}>
                      {pwdUsed} / {pwdLimit} this month
                    </div>
                    {pwdLimitHit&&<span style={{fontSize:10,color:"#dc2626",fontWeight:600}}>Limit reached</span>}
                  </div>
                ) : (
                  <p style={{fontSize:10,color:"#94a3b8",margin:"3px 0 0"}}>Max 2 changes/month</p>
                )}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}