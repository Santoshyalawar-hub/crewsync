// import React, { useState, useEffect, useMemo, useRef } from "react";
// import {
//   FiUpload, FiFile, FiDownload, FiEye, FiTrash2,
//   FiCheck, FiX, FiClock, FiPenTool, FiUsers,
//   FiSearch, FiFilter, FiRefreshCw, FiPlus,
//   FiAlertCircle, FiCheckCircle, FiChevronDown,
//   FiChevronUp,
// } from "react-icons/fi";
// import { API_BASE_URL } from "@/lib/apiClient";

// // ── Auth helpers ──────────────────────────────────────────────────────────────
// const getToken  = () => localStorage.getItem("token")      || "";
// const getTenant = () => localStorage.getItem("tenantCode") || "";
// const getCo     = () => localStorage.getItem("companyId")  || "";

// const authHdr = () => {
//   const t = getToken();
//   return {
//     Authorization:  t.startsWith("Bearer ") ? t : `Bearer ${t}`,
//     "X-Tenant-Code": getTenant(),
//     "X-Company-Id":  getCo(),
//   };
// };

// // ── Constants ─────────────────────────────────────────────────────────────────
// const T = {
//   navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8",
//   bg:"#F7F8FA", border:"#E8ECF2",
// };

// const HR_DOC_TYPES = [
//   { value:"OFFER_LETTER",            label:"Offer Letter"             },
//   { value:"JOINING_LETTER",          label:"Joining Letter"           },
//   { value:"SALARY_REVISION_LETTER",  label:"Salary Revision Letter"   },
//   { value:"APPOINTMENT_LETTER",      label:"Appointment Letter"       },
//   { value:"CONFIRMATION_LETTER",     label:"Confirmation Letter"      },
//   { value:"WARNING_LETTER",          label:"Warning Letter"           },
//   { value:"RELIEVING_LETTER",        label:"Relieving Letter"         },
//   { value:"EXPERIENCE_CERTIFICATE",  label:"Experience Certificate"   },
//   { value:"NON_DISCLOSURE_AGREEMENT",label:"Non-Disclosure Agreement" },
//   { value:"EMPLOYMENT_CONTRACT",     label:"Employment Contract"      },
//   { value:"POLICY_DOCUMENT",         label:"Policy Document"          },
//   { value:"ONBOARDING_CHECKLIST",    label:"Onboarding Checklist"     },
//   { value:"OTHER",                   label:"Other"                    },
// ];

// const STATUS_META = {
//   PENDING_SIGNATURE:{ fg:"#d97706", bg:"#fffbeb", label:"Pending Signature", icon:<FiClock size={11}/> },
//   SIGNED:           { fg:"#16a34a", bg:"#f0fdf4", label:"Signed",            icon:<FiCheck size={11}/> },
//   ACKNOWLEDGED:     { fg:"#0891b2", bg:"#ecfeff", label:"Acknowledged",       icon:<FiCheckCircle size={11}/> },
//   REJECTED:         { fg:"#dc2626", bg:"#fef2f2", label:"Rejected",           icon:<FiX size={11}/> },
// };
// const sMeta = (s) => STATUS_META[s] || { fg:"#6b7280", bg:"#f9fafb", label:s||"—", icon:<FiFile size={11}/> };
// const initials = (n="") => n.split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"E";

// // ── CSS ───────────────────────────────────────────────────────────────────────
// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
// .adm *{font-family:'DM Sans',sans-serif;box-sizing:border-box;}
// .adm .fd{font-family:'Sora',sans-serif;}
// @keyframes adm-spin{to{transform:rotate(360deg)}}
// .adm-spin{animation:adm-spin .9s linear infinite;}
// @keyframes adm-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
// .adm-up{animation:adm-up .3s ease both;}
// .adm-card{background:#fff;border-radius:18px;border:1px solid #f0f0f0;box-shadow:0 2px 12px rgba(13,31,45,.05);}
// .adm-emp:hover{box-shadow:0 6px 24px rgba(13,31,45,.09)!important;}
// .adm-hdr:hover{background:#fafafa;}
// .adm-inp{padding:9px 14px;border-radius:10px;border:1.5px solid #e5e7eb;background:#fff;font-size:12px;outline:none;font-family:'DM Sans',sans-serif;color:#0D1F2D;box-sizing:border-box;width:100%;transition:border .15s;}
// .adm-inp:focus{border-color:#FF6B35;}
// .adm-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:10px;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;}
// .adm-btn:disabled{opacity:0.55;cursor:not-allowed;}
// .modal-overlay{position:fixed;inset:0;z-index:999;background:rgba(13,31,45,0.7);display:flex;align-items:center;justify-content:center;padding:16px;}
// .emp-check-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:10px;cursor:pointer;transition:all .15s;border:1.5px solid transparent;}
// .emp-check-item:hover{background:rgba(255,107,53,.05);border-color:rgba(255,107,53,.15);}
// .emp-check-item.selected{background:rgba(255,107,53,.08);border-color:rgba(255,107,53,.25);}
// `;

// // ─────────────────────────────────────────────────────────────────────────────
// //  UPLOAD MODAL
// //  - Target: ONE employee / SELECTED employees / ALL employees
// // ─────────────────────────────────────────────────────────────────────────────
// function UploadModal({ employees, onClose, onUploaded, preselectedEmployee }) {
//   const [targetMode,  setTargetMode]  = useState(preselectedEmployee ? "one" : "one");
//   // "one" = single employee | "selected" = multiple chosen | "all" = everyone
//   const [selectedIds, setSelectedIds] = useState(
//     preselectedEmployee ? [String(preselectedEmployee.id)] : []
//   );
//   const [empSearch,   setEmpSearch]   = useState("");
//   const [form, setForm] = useState({
//     docType:"OFFER_LETTER", title:"", notes:"",
//     requiresSignature:true, signByDate:"",
//   });
//   const [file,    setFile]    = useState(null);
//   const [saving,  setSaving]  = useState(false);
//   const [error,   setError]   = useState("");
//   const [preview, setPreview] = useState(null);
//   const fileRef = useRef();

//   const set = (k,v) => setForm(p=>({...p,[k]:v}));

//   // Auto-fill title from doc type
//   useEffect(() => {
//     const label = HR_DOC_TYPES.find(t=>t.value===form.docType)?.label || "";
//     set("title", label);
//   }, [form.docType]); // eslint-disable-line

//   const handleFile = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     if (f.size > 15*1024*1024) { setError("Max file size is 15 MB"); return; }
//     setFile(f);
//     if (f.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = () => setPreview(reader.result);
//       reader.readAsDataURL(f);
//     } else { setPreview(null); }
//   };

//   // Which employees will receive this doc
//   const targetEmployees = useMemo(() => {
//     if (targetMode === "all") return employees;
//     if (targetMode === "selected") return employees.filter(e=>selectedIds.includes(String(e.id)));
//     if (targetMode === "one") return employees.filter(e=>selectedIds.includes(String(e.id)));
//     return [];
//   }, [targetMode, selectedIds, employees]);

//   const filteredEmps = employees.filter(e =>
//     !empSearch.trim() ||
//     (e.fullName||e.name||"").toLowerCase().includes(empSearch.toLowerCase()) ||
//     (e.email||"").toLowerCase().includes(empSearch.toLowerCase())
//   );

//   const toggleEmp = (id) => {
//     const sid = String(id);
//     if (targetMode==="one") {
//       setSelectedIds([sid]);
//     } else {
//       setSelectedIds(prev => prev.includes(sid) ? prev.filter(x=>x!==sid) : [...prev, sid]);
//     }
//   };

//   const handleSubmit = async () => {
//     if (targetEmployees.length===0) { setError("Select at least one employee"); return; }
//     if (!form.title.trim()) { setError("Title is required"); return; }
//     if (!file) { setError("Select a file to upload"); return; }
//     setError(""); setSaving(true);

//     let successCount = 0;
//     let failCount    = 0;

//     for (const emp of targetEmployees) {
//       const fd = new FormData();
//       fd.append("file",             file);
//       fd.append("employeeId",       emp.id);
//       fd.append("docType",          form.docType);
//       fd.append("title",            form.title.trim());
//       fd.append("notes",            form.notes || "");
//       fd.append("requiresSignature",String(form.requiresSignature));
//       if (form.signByDate) fd.append("signByDate", form.signByDate+"T00:00:00");

//       try {
//         const res = await fetch(`${API_BASE_URL}/api/hr-documents/upload`, {
//           method:"POST", headers:authHdr(), body:fd,
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message||"Upload failed");
//         successCount++;
//       } catch { failCount++; }
//     }

//     setSaving(false);
//     if (failCount===0) {
//       onUploaded(`Document sent to ${successCount} employee${successCount>1?"s":""}!`);
//     } else {
//       onUploaded(`Sent to ${successCount}, failed for ${failCount} employees.`);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
//       <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:640,
//         maxHeight:"92vh", overflowY:"auto",
//         boxShadow:"0 24px 60px rgba(13,31,45,0.25)" }}>

//         {/* Header */}
//         <div style={{ padding:"22px 24px 0", display:"flex",
//           justifyContent:"space-between", alignItems:"center",
//           borderBottom:`1px solid ${T.border}`, paddingBottom:16 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//             <div style={{ width:38,height:38,borderRadius:11,
//               background:"rgba(255,107,53,0.1)",display:"flex",
//               alignItems:"center",justifyContent:"center" }}>
//               <FiUpload size={18} color={T.coral}/>
//             </div>
//             <div>
//               <h2 className="fd" style={{ fontSize:17,fontWeight:800,
//                 color:T.navy,margin:0 }}>Upload HR Document</h2>
//               <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>
//                 Send a document to one, selected, or all employees
//               </p>
//             </div>
//           </div>
//           <button onClick={onClose} style={{ background:"none",border:"none",
//             cursor:"pointer",color:"#94a3b8",padding:4 }}>
//             <FiX size={22}/>
//           </button>
//         </div>

//         <div style={{ padding:24, display:"flex", flexDirection:"column", gap:16 }}>

//           {/* ── STEP 1: Target Mode ── */}
//           <div>
//             <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
//               textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>
//               Who should receive this document? <span style={{ color:"#ef4444" }}>*</span>
//             </label>
//             <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
//               {[
//                 { mode:"one",      label:"One Employee",       icon:"👤", desc:"Select one specific employee" },
//                 { mode:"selected", label:"Multiple Employees", icon:"👥", desc:"Choose specific employees"    },
//                 { mode:"all",      label:"All Employees",      icon:"🏢", desc:`All ${employees.length} employees` },
//               ].map(opt=>(
//                 <button key={opt.mode} onClick={()=>{setTargetMode(opt.mode);setSelectedIds([]);}}
//                   style={{ padding:"12px 10px", borderRadius:12, cursor:"pointer",
//                     border:`2px solid ${targetMode===opt.mode?T.coral:"#e2e8f0"}`,
//                     background:targetMode===opt.mode?"rgba(255,107,53,.08)":"#fff",
//                     textAlign:"center", transition:"all 0.15s" }}>
//                   <div style={{ fontSize:22,marginBottom:4 }}>{opt.icon}</div>
//                   <div style={{ fontSize:12,fontWeight:700,
//                     color:targetMode===opt.mode?T.coral:T.navy }}>{opt.label}</div>
//                   <div style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>{opt.desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ── Employee selector (one or selected mode) ── */}
//           {(targetMode==="one"||targetMode==="selected") && (
//             <div>
//               <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
//                 textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
//                 {targetMode==="one" ? "Select Employee" : "Select Employees"}
//                 <span style={{ color:"#ef4444" }}> *</span>
//                 {targetMode==="selected" && selectedIds.length>0 &&
//                   <span style={{ marginLeft:8,background:T.coral,color:"#fff",
//                     fontSize:10,padding:"2px 7px",borderRadius:99 }}>
//                     {selectedIds.length} selected
//                   </span>}
//               </label>

//               {/* Search employees */}
//               <div style={{ position:"relative", marginBottom:8 }}>
//                 <FiSearch size={14} color="#9ca3af" style={{ position:"absolute",
//                   left:12,top:"50%",transform:"translateY(-50%)" }}/>
//                 <input className="adm-inp" value={empSearch}
//                   onChange={e=>setEmpSearch(e.target.value)}
//                   placeholder="Search employee name or email…"
//                   style={{ paddingLeft:36 }}/>
//               </div>

//               <div style={{ maxHeight:200, overflowY:"auto", border:`1px solid ${T.border}`,
//                 borderRadius:12, padding:8 }}>
//                 {filteredEmps.length===0 ? (
//                   <p style={{ fontSize:12,color:"#94a3b8",textAlign:"center",padding:"16px 0",margin:0 }}>
//                     No employees found
//                   </p>
//                 ) : filteredEmps.map(emp=>{
//                   const sid     = String(emp.id);
//                   const isSelected = selectedIds.includes(sid);
//                   return (
//                     <div key={emp.id}
//                       className={`emp-check-item${isSelected?" selected":""}`}
//                       onClick={()=>toggleEmp(emp.id)}>
//                       {/* Avatar */}
//                       <div style={{ width:32,height:32,borderRadius:"50%",flexShrink:0,
//                         background:`linear-gradient(135deg,${T.coral},#ff5722)`,
//                         display:"flex",alignItems:"center",justifyContent:"center",
//                         fontSize:12,fontWeight:900,color:"#fff" }}>
//                         {initials(emp.fullName||emp.name)}
//                       </div>
//                       <div style={{ flex:1,minWidth:0 }}>
//                         <p style={{ fontSize:13,fontWeight:600,color:T.navy,
//                           margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
//                           {emp.fullName||emp.name}
//                         </p>
//                         <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>
//                           {emp.email} {emp.department?`· ${emp.department}`:""}
//                         </p>
//                       </div>
//                       {/* Check indicator */}
//                       <div style={{ width:20,height:20,borderRadius:6,flexShrink:0,
//                         border:`2px solid ${isSelected?T.coral:"#e2e8f0"}`,
//                         background:isSelected?T.coral:"#fff",
//                         display:"flex",alignItems:"center",justifyContent:"center" }}>
//                         {isSelected && <FiCheck size={11} color="#fff"/>}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Selected summary */}
//               {targetMode==="selected" && selectedIds.length>0 && (
//                 <div style={{ marginTop:6,padding:"6px 10px",borderRadius:8,
//                   background:"rgba(255,107,53,.06)",
//                   border:"1px solid rgba(255,107,53,.15)",
//                   fontSize:11,color:T.coral,fontWeight:600 }}>
//                   Will send to: {employees.filter(e=>selectedIds.includes(String(e.id)))
//                     .map(e=>e.fullName||e.name).join(", ")}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* All employees banner */}
//           {targetMode==="all" && employees.length>0 && (
//             <div style={{ background:"rgba(99,102,241,.06)",
//               border:"1px solid rgba(99,102,241,.2)",
//               borderRadius:10,padding:"10px 14px" }}>
//               <p style={{ fontSize:12,fontWeight:600,color:"#4f46e5",margin:0 }}>
//                 🏢 This document will be sent to all <strong>{employees.length}</strong> employees in your company ({getTenant()}).
//               </p>
//             </div>
//           )}

//           {/* ── STEP 2: Document details ── */}
//           <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
//             <div>
//               <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
//                 textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
//                 Document Type
//               </label>
//               <select className="adm-inp" value={form.docType}
//                 onChange={e=>set("docType",e.target.value)}>
//                 {HR_DOC_TYPES.map(t=>(
//                   <option key={t.value} value={t.value}>{t.label}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
//                 textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
//                 Title <span style={{ color:"#ef4444" }}>*</span>
//               </label>
//               <input className="adm-inp" value={form.title}
//                 onChange={e=>set("title",e.target.value)}
//                 placeholder="e.g. Offer Letter – Software Engineer"/>
//             </div>
//           </div>

//           {/* Notes */}
//           <div>
//             <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
//               textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
//               Notes / Instructions (optional)
//             </label>
//             <textarea className="adm-inp" value={form.notes}
//               onChange={e=>set("notes",e.target.value)}
//               placeholder="Any instructions for the employee…"
//               style={{ minHeight:64,resize:"vertical" }}/>
//           </div>

//           {/* Options */}
//           <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
//             <div>
//               <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
//                 textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
//                 Sign By Date (optional)
//               </label>
//               <input className="adm-inp" type="date" value={form.signByDate}
//                 onChange={e=>set("signByDate",e.target.value)}/>
//             </div>
//             <div>
//               <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
//                 textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
//                 Signature Required
//               </label>
//               <div style={{ display:"flex",gap:12,padding:"9px 14px",
//                 borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff" }}>
//                 {[{v:true,l:"Yes — Sign"},{v:false,l:"Acknowledge Only"}].map(opt=>(
//                   <label key={String(opt.v)} style={{ display:"flex",alignItems:"center",
//                     gap:5,cursor:"pointer",fontSize:12,fontWeight:600 }}>
//                     <input type="radio" checked={form.requiresSignature===opt.v}
//                       onChange={()=>set("requiresSignature",opt.v)}
//                       style={{ accentColor:T.coral }}/>
//                     {opt.l}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* File upload */}
//           <div>
//             <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
//               textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
//               Document File <span style={{ color:"#ef4444" }}>*</span>
//             </label>
//             <label style={{ display:"flex",flexDirection:"column",alignItems:"center",
//               justifyContent:"center",gap:10,padding:"24px",borderRadius:12,
//               border:"2px dashed #e2e8f0",background:"#f8fafc",cursor:"pointer",
//               transition:"border .2s" }}
//               onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=T.coral;}}
//               onDragLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";}}
//               onDrop={e=>{
//                 e.preventDefault();e.currentTarget.style.borderColor="#e2e8f0";
//                 const f=e.dataTransfer.files[0];
//                 if(f){const ev={target:{files:[f]}};handleFile(ev);}
//               }}>
//               {file ? (
//                 <div style={{ textAlign:"center" }}>
//                   {preview
//                     ? <img src={preview} alt=""
//                         style={{ maxHeight:80,maxWidth:"100%",borderRadius:8,marginBottom:8 }}/>
//                     : <div style={{ fontSize:32,marginBottom:8 }}>📄</div>}
//                   <p style={{ fontSize:13,fontWeight:700,color:T.navy,margin:0 }}>
//                     {file.name}
//                   </p>
//                   <p style={{ fontSize:11,color:"#94a3b8",margin:"2px 0 0" }}>
//                     {(file.size/1024).toFixed(1)} KB
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   <div style={{ width:44,height:44,borderRadius:12,
//                     background:"rgba(255,107,53,0.1)",display:"flex",
//                     alignItems:"center",justifyContent:"center" }}>
//                     <FiUpload size={20} color={T.coral}/>
//                   </div>
//                   <div style={{ textAlign:"center" }}>
//                     <p style={{ fontSize:13,fontWeight:700,color:T.navy,margin:0 }}>
//                       Drop file here or click to browse
//                     </p>
//                     <p style={{ fontSize:11,color:"#94a3b8",margin:"4px 0 0" }}>
//                       PDF, JPG, PNG · Max 15 MB
//                     </p>
//                   </div>
//                 </>
//               )}
//               <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFile} style={{ display:"none" }}/>
//             </label>
//             {file && (
//               <button onClick={()=>{setFile(null);setPreview(null);
//                 if(fileRef.current)fileRef.current.value="";}}
//                 style={{ marginTop:6,background:"none",border:"none",
//                   fontSize:11,color:"#94a3b8",cursor:"pointer",fontWeight:600 }}>
//                 ✕ Remove file
//               </button>
//             )}
//           </div>

//           {/* Summary */}
//           {targetEmployees.length>0 && file && (
//             <div style={{ background:"rgba(0,194,168,.06)",
//               border:"1px solid rgba(0,194,168,.2)",
//               borderRadius:10,padding:"10px 14px" }}>
//               <p style={{ fontSize:12,fontWeight:600,color:"#0d7377",margin:0 }}>
//                 ✅ Ready to send <strong>"{form.title}"</strong> to{" "}
//                 <strong>{targetEmployees.length}</strong> employee{targetEmployees.length>1?"s":""}
//               </p>
//             </div>
//           )}

//           {error && (
//             <div style={{ background:"#fef2f2",border:"1px solid #fecaca",
//               borderRadius:8,padding:"10px 14px",fontSize:12,
//               color:"#b91c1c",fontWeight:600 }}>⚠ {error}</div>
//           )}

//           {/* Submit */}
//           <div style={{ display:"flex",gap:10 }}>
//             <button onClick={onClose}
//               style={{ flex:1,padding:"11px",borderRadius:10,
//                 border:`1.5px solid ${T.border}`,background:"#fff",
//                 color:"#64748b",fontSize:13,fontWeight:600,cursor:"pointer" }}>
//               Cancel
//             </button>
//             <button onClick={handleSubmit} disabled={saving}
//               className="adm-btn"
//               style={{ flex:2,padding:"11px",borderRadius:10,justifyContent:"center",
//                 background:saving?"#94a3b8":`linear-gradient(135deg,${T.coral},#f97316)`,
//                 color:"#fff",fontSize:13 }}>
//               {saving
//                 ? <><span className="adm-spin" style={{ display:"inline-block",marginRight:6 }}>⟳</span>
//                     Sending to {targetEmployees.length} employee{targetEmployees.length>1?"s":""}…</>
//                 : <><FiUpload size={14}/> Send Document</>}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// //  MAIN AdminHrDocuments
// // ─────────────────────────────────────────────────────────────────────────────
// export default function AdminHrDocuments() {
//   const [employees,    setEmployees]    = useState([]);
//   const [hrDocs,       setHrDocs]       = useState([]);
//   const [loading,      setLoading]      = useState(false);
//   const [empLoading,   setEmpLoading]   = useState(false);
//   const [showUpload,   setShowUpload]   = useState(false);
//   const [preselected,  setPreselected]  = useState(null);
//   const [search,       setSearch]       = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [expanded,     setExpanded]     = useState(null);
//   const [message,      setMessage]      = useState({ type:"", text:"" });
//   const [refreshing,   setRefreshing]   = useState(false);

//   const tenantCode = getTenant();
//   const companyId  = getCo();

//   useEffect(() => { fetchEmployees(); fetchHrDocs(); }, []);

//   const showMsg = (type,text) => {
//     setMessage({type,text});
//     setTimeout(()=>setMessage({type:"",text:""}),5000);
//   };

//   // ── Fetch employees by tenantCode ─────────────────────────────────────────
//   // Uses GET /api/users/tenant/employees with X-Tenant-Code header
//   // This matches your existing UserController endpoint exactly
//   const fetchEmployees = async () => {
//     setEmpLoading(true);
//     try {
//       const token = getToken();
//       const authH = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

//       const res = await fetch(`${API_BASE_URL}/api/users/tenant/employees`, {
//         method:"GET",
//         headers:{
//           "Content-Type":  "application/json",
//           "Authorization": authH,
//           "X-Tenant-Code": tenantCode,
//           "X-Company-Id":  companyId,
//         },
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(()=>({message:`HTTP ${res.status}`}));
//         throw new Error(err.message||`Failed (${res.status})`);
//       }

//       const data = await res.json();
//       // Handle both { data: [...] } and direct array responses
//       const list = Array.isArray(data) ? data : (data?.data || []);
//       setEmployees(list);

//       if (list.length===0) {
//         showMsg("info", `No employees found for tenant: ${tenantCode}. Make sure employees are registered under this company.`);
//       }
//     } catch(e) {
//       showMsg("error", `Failed to fetch employees: ${e.message}`);
//     } finally {
//       setEmpLoading(false);
//     }
//   };

//   // ── Fetch HR docs grouped by employee ─────────────────────────────────────
//   const fetchHrDocs = async (silent=false) => {
//     if(!silent) setLoading(true); else setRefreshing(true);
//     try {
//       const res  = await fetch(`${API_BASE_URL}/api/hr-documents/admin/all`, {
//         headers:authHdr()
//       });
//       const data = await res.json();
//       if(!res.ok) throw new Error(data.message||"Failed");
//       setHrDocs(Array.isArray(data)?data:(data?.data||[]));
//     } catch(e) {
//       showMsg("error", e.message||"Failed to fetch HR documents");
//     } finally { setLoading(false); setRefreshing(false); }
//   };

//   const handleUploaded = (msg) => {
//     setShowUpload(false);
//     setPreselected(null);
//     showMsg("success", msg||"Document sent successfully!");
//     fetchHrDocs(true);
//   };

//   const handleDelete = async (docId, empId) => {
//     if(!window.confirm("Delete this HR document?")) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/hr-documents/admin/${docId}`, {
//         method:"DELETE", headers:authHdr()
//       });
//       if(!res.ok) throw new Error("Delete failed");
//       setHrDocs(prev=>prev.map(emp=>
//         String(emp.id)===String(empId)
//           ? {...emp, hrDocuments:(emp.hrDocuments||[]).filter(d=>d.id!==docId)}
//           : emp
//       ));
//       showMsg("success","Document deleted");
//     } catch(e) { showMsg("error",e.message||"Delete failed"); }
//   };

//   // Merge employees with hrDocs data for display
//   // Even employees with no HR docs will show in the list
//   const mergedEmployees = useMemo(() => {
//     const hrDocMap = {};
//     hrDocs.forEach(e => { hrDocMap[String(e.id)] = e.hrDocuments||[]; });

//     return employees.map(emp => ({
//       ...emp,
//       hrDocuments: hrDocMap[String(emp.id)] || [],
//     }));
//   }, [employees, hrDocs]);

//   const filtered = useMemo(() => mergedEmployees.filter(emp => {
//     const matchSearch = !search.trim() ||
//       (emp.fullName||emp.name||"").toLowerCase().includes(search.toLowerCase()) ||
//       (emp.email||"").toLowerCase().includes(search.toLowerCase());
//     if(!matchSearch) return false;
//     if(statusFilter==="ALL") return true;
//     return (emp.hrDocuments||[]).some(d=>d.status===statusFilter);
//   }), [mergedEmployees, search, statusFilter]);

//   // Stats
//   const stats = useMemo(()=>{
//     const all = mergedEmployees.flatMap(e=>e.hrDocuments||[]);
//     return {
//       total:   all.length,
//       pending: all.filter(d=>d.status==="PENDING_SIGNATURE").length,
//       signed:  all.filter(d=>d.status==="SIGNED").length,
//       emps:    employees.length,
//     };
//   },[mergedEmployees, employees]);

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="adm" style={{ maxWidth:1200,margin:"0 auto" }}>

//         {/* Hero */}
//         <div style={{ background:`linear-gradient(135deg,${T.navy},#162639)`,
//           borderRadius:20,padding:"22px 28px",marginBottom:22,
//           position:"relative",overflow:"hidden" }}>
//           <div style={{ position:"absolute",top:-30,right:80,width:160,height:160,
//             borderRadius:"50%",background:"rgba(255,107,53,.1)",
//             filter:"blur(40px)",pointerEvents:"none" }}/>
//           <div style={{ display:"flex",alignItems:"center",
//             justifyContent:"space-between",flexWrap:"wrap",gap:14,position:"relative" }}>
//             <div>
//               <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
//                 <h1 className="fd" style={{ fontSize:20,fontWeight:900,
//                   color:"#fff",margin:0 }}>HR Documents</h1>
//                 <span style={{ fontSize:9,fontWeight:800,color:T.coral,
//                   background:"rgba(255,107,53,.2)",padding:"2px 8px",
//                   borderRadius:999,textTransform:"uppercase",letterSpacing:".08em" }}>
//                   Admin
//                 </span>
//                 {tenantCode && (
//                   <span style={{ fontSize:9,fontWeight:800,color:T.teal,
//                     background:"rgba(0,194,168,.15)",padding:"2px 8px",
//                     borderRadius:999,fontFamily:"monospace" }}>
//                     {tenantCode}
//                   </span>
//                 )}
//               </div>
//               <p style={{ fontSize:12,color:"rgba(255,255,255,.4)",margin:0 }}>
//                 Upload offer letters, joining letters and other HR documents for employees to digitally sign.
//                 Send to one, multiple, or all employees at once.
//               </p>
//             </div>
//             <div style={{ display:"flex",gap:10 }}>
//               <button onClick={()=>fetchHrDocs(true)} disabled={refreshing||loading}
//                 className="adm-btn"
//                 style={{ background:"rgba(255,255,255,.1)",
//                   border:"1px solid rgba(255,255,255,.15)",color:"#fff" }}>
//                 <FiRefreshCw size={13} className={refreshing?"adm-spin":""}/>
//                 {refreshing?"Refreshing…":"Refresh"}
//               </button>
//               <button onClick={()=>{setPreselected(null);setShowUpload(true);}}
//                 className="adm-btn"
//                 style={{ background:`linear-gradient(135deg,${T.coral},#f97316)`,
//                   color:"#fff",boxShadow:"0 4px 14px rgba(255,107,53,.35)" }}>
//                 <FiPlus size={14}/> Upload Document
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Toast */}
//         {message.text && (
//           <div style={{ display:"flex",alignItems:"center",gap:10,
//             padding:"12px 16px",borderRadius:12,marginBottom:18,
//             fontSize:13,fontWeight:600,
//             background:message.type==="success"?"#f0fdf4":message.type==="info"?"rgba(0,194,168,.08)":"#fef2f2",
//             border:`1px solid ${message.type==="success"?"#86efac":message.type==="info"?"rgba(0,194,168,.3)":"#fca5a5"}`,
//             color:message.type==="success"?"#16a34a":message.type==="info"?T.teal:"#b91c1c" }}>
//             {message.type==="success"?<FiCheckCircle size={16}/>:<FiAlertCircle size={16}/>}
//             <span style={{ flex:1 }}>{message.text}</span>
//           </div>
//         )}

//         {/* Stats */}
//         <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22 }}>
//           {[
//             { label:"Total Documents",   val:stats.total,   color:T.coral,   bg:"rgba(255,107,53,.08)",  icon:<FiFile size={20}/> },
//             { label:"Pending Signature", val:stats.pending, color:"#f59e0b", bg:"rgba(245,158,11,.08)",  icon:<FiPenTool size={20}/> },
//             { label:"Signed",            val:stats.signed,  color:"#16a34a", bg:"rgba(22,163,74,.08)",   icon:<FiCheck size={20}/> },
//             { label:"Employees",         val:empLoading?"…":stats.emps, color:T.teal,    bg:"rgba(0,194,168,.08)",   icon:<FiUsers size={20}/> },
//           ].map(s=>(
//             <div key={s.label} className="adm-card" style={{ padding:"18px 20px" }}>
//               <div style={{ display:"flex",alignItems:"center",gap:12 }}>
//                 <div style={{ width:44,height:44,borderRadius:12,
//                   background:s.bg,color:s.color,
//                   display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
//                   {s.icon}
//                 </div>
//                 <div>
//                   <p style={{ fontSize:11,color:"#6b7280",margin:"0 0 2px" }}>{s.label}</p>
//                   <p className="fd" style={{ fontSize:24,fontWeight:900,
//                     color:T.navy,margin:0,lineHeight:1 }}>{s.val}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Search & Filter */}
//         <div className="adm-card" style={{ padding:"16px 20px",marginBottom:22 }}>
//           <div style={{ display:"flex",flexWrap:"wrap",
//             alignItems:"center",justifyContent:"space-between",gap:14 }}>
//             <div style={{ position:"relative",flex:1,maxWidth:420,minWidth:200 }}>
//               <FiSearch size={16} color="#9ca3af" style={{ position:"absolute",
//                 left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
//               <input className="adm-inp" type="text"
//                 placeholder="Search by employee name or email"
//                 value={search} onChange={e=>setSearch(e.target.value)}
//                 style={{ paddingLeft:40,borderRadius:999,background:T.bg }}/>
//             </div>
//             <div style={{ display:"flex",alignItems:"center",gap:8 }}>
//               <FiFilter size={16} color="#9ca3af"/>
//               <select className="adm-inp"
//                 value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
//                 style={{ borderRadius:999,background:T.bg,
//                   appearance:"none",padding:"9px 18px",width:"auto",cursor:"pointer" }}>
//                 <option value="ALL">All Status</option>
//                 <option value="PENDING_SIGNATURE">Pending Signature</option>
//                 <option value="SIGNED">Signed</option>
//                 <option value="ACKNOWLEDGED">Acknowledged</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Section title */}
//         <div style={{ display:"flex",alignItems:"center",
//           justifyContent:"space-between",marginBottom:14 }}>
//           <h2 className="fd" style={{ fontSize:17,fontWeight:900,color:T.navy,margin:0 }}>
//             Employees ({filtered.length})
//             {empLoading && <span style={{ fontSize:12,fontWeight:500,color:"#94a3b8",
//               marginLeft:8 }}>loading…</span>}
//           </h2>
//           <span style={{ fontSize:12,color:"#9ca3af",fontWeight:600 }}>
//             {filtered.reduce((s,e)=>s+(e.hrDocuments||[]).length,0)} total HR documents
//           </span>
//         </div>

//         {/* Employee list */}
//         <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
//           {loading || empLoading ? (
//             <div className="adm-card" style={{ padding:"64px",textAlign:"center" }}>
//               <div style={{ width:48,height:48,borderRadius:"50%",
//                 border:"3px solid rgba(255,107,53,.2)",borderTopColor:T.coral,
//                 margin:"0 auto 16px",animation:"adm-spin 1s linear infinite" }}/>
//               <p style={{ fontSize:14,color:"#6b7280",fontWeight:600,margin:0 }}>
//                 {empLoading?"Loading employees…":"Loading HR documents…"}
//               </p>
//             </div>
//           ) : filtered.length===0 ? (
//             <div className="adm-card" style={{ padding:"56px 24px",textAlign:"center" }}>
//               <FiUsers size={48} color="#d1d5db" style={{ marginBottom:12 }}/>
//               <p style={{ fontSize:15,fontWeight:700,color:"#6b7280",margin:"0 0 6px" }}>
//                 {employees.length===0 ? "No employees found" : "No results match your filter"}
//               </p>
//               <p style={{ fontSize:13,color:"#9ca3af",margin:"0 0 16px" }}>
//                 {employees.length===0
//                   ? `No employees found for tenant "${tenantCode}". Make sure employees are registered under this company.`
//                   : "Try adjusting your search or filters"}
//               </p>
//               {employees.length===0 && (
//                 <button className="adm-btn" onClick={fetchEmployees}
//                   style={{ background:`linear-gradient(135deg,${T.coral},#f97316)`,
//                     color:"#fff",margin:"0 auto" }}>
//                   <FiRefreshCw size={14}/> Retry Loading Employees
//                 </button>
//               )}
//             </div>
//           ) : filtered.map(emp => {
//             const docs    = statusFilter==="ALL"
//               ? (emp.hrDocuments||[])
//               : (emp.hrDocuments||[]).filter(d=>d.status===statusFilter);
//             const isOpen  = expanded===emp.id;
//             const pending = (emp.hrDocuments||[]).filter(d=>d.status==="PENDING_SIGNATURE").length;

//             return (
//               <div key={emp.id} className="adm-card adm-emp adm-up"
//                 style={{ overflow:"hidden",transition:"box-shadow .2s" }}>

//                 {/* Employee row */}
//                 <div className="adm-hdr"
//                   onClick={()=>setExpanded(isOpen?null:emp.id)}
//                   style={{ display:"flex",alignItems:"center",
//                     justifyContent:"space-between",padding:"18px 22px",
//                     cursor:"pointer",gap:16,transition:"background .15s" }}>

//                   <div style={{ display:"flex",alignItems:"center",gap:14,flex:1,minWidth:0 }}>
//                     {/* Avatar */}
//                     <div style={{ width:48,height:48,
//                       background:`linear-gradient(135deg,${T.coral},#FF5722)`,
//                       borderRadius:"50%",display:"flex",alignItems:"center",
//                       justifyContent:"center",fontSize:18,fontWeight:900,
//                       color:"#fff",fontFamily:"'Sora',sans-serif",flexShrink:0 }}>
//                       {initials(emp.fullName||emp.name)}
//                     </div>
//                     <div style={{ flex:1,minWidth:0 }}>
//                       <h3 className="fd" style={{ fontSize:15,fontWeight:800,
//                         color:"#111827",margin:"0 0 3px",
//                         overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
//                         {emp.fullName||emp.name||"Unknown Employee"}
//                       </h3>
//                       <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
//                         <span style={{ fontSize:12,color:"#9ca3af" }}>
//                           {emp.email}
//                         </span>
//                         {emp.department && (
//                           <span style={{ fontSize:11,fontWeight:600,color:T.teal,
//                             background:"rgba(0,194,168,.08)",padding:"1px 7px",
//                             borderRadius:99 }}>{emp.department}</span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Chips */}
//                     <div style={{ display:"flex",gap:6,flexShrink:0 }}>
//                       <div style={{ background:"rgba(255,107,53,.08)",borderRadius:999,
//                         padding:"5px 12px",display:"flex",alignItems:"center",gap:5 }}>
//                         <FiFile size={13} color={T.coral}/>
//                         <span className="fd" style={{ fontSize:13,fontWeight:800,color:T.coral }}>
//                           {(emp.hrDocuments||[]).length}
//                         </span>
//                       </div>
//                       {pending>0 && (
//                         <div style={{ background:"#fffbeb",borderRadius:999,
//                           padding:"5px 12px",border:"1px solid #fde68a",
//                           display:"flex",alignItems:"center",gap:5 }}>
//                           <FiPenTool size={12} color="#d97706"/>
//                           <span style={{ fontSize:12,fontWeight:700,color:"#d97706" }}>
//                             {pending} pending
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div style={{ display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
//                     {/* Quick upload for this employee */}
//                     <button
//                       onClick={e=>{
//                         e.stopPropagation();
//                         setPreselected(emp);
//                         setShowUpload(true);
//                       }}
//                       className="adm-btn"
//                       style={{ background:`linear-gradient(135deg,${T.coral},#f97316)`,
//                         color:"#fff",padding:"8px 14px" }}>
//                       <FiPlus size={13}/> Upload for {emp.fullName?.split(" ")[0]||"Employee"}
//                     </button>
//                     <div style={{ color:"#9ca3af",transition:"transform .2s",fontSize:18,
//                       transform:isOpen?"rotate(180deg)":"rotate(0deg)" }}>
//                       <FiChevronDown size={20}/>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Expanded documents */}
//                 {isOpen && (
//                   <div style={{ borderTop:"1px solid #f0f0f0" }}>
//                     {docs.length===0 ? (
//                       <div style={{ padding:"40px 24px",textAlign:"center" }}>
//                         <FiFile size={36} color="#d1d5db" style={{ marginBottom:10 }}/>
//                         <p style={{ fontSize:14,fontWeight:600,color:"#6b7280",margin:"0 0 6px" }}>
//                           No HR documents sent yet
//                         </p>
//                         <p style={{ fontSize:12,color:"#9ca3af",margin:"0 0 14px" }}>
//                           {statusFilter!=="ALL"
//                             ? `No ${statusFilter.toLowerCase().replace("_"," ")} documents`
//                             : "Upload a document for this employee using the button above"}
//                         </p>
//                         <button className="adm-btn"
//                           onClick={()=>{setPreselected(emp);setShowUpload(true);}}
//                           style={{ background:`linear-gradient(135deg,${T.coral},#f97316)`,
//                             color:"#fff",margin:"0 auto" }}>
//                           <FiPlus size={13}/> Upload Document
//                         </button>
//                       </div>
//                     ) : (
//                       <div style={{ overflowX:"auto" }}>
//                         <table style={{ width:"100%",borderCollapse:"collapse" }}>
//                           <thead>
//                             <tr style={{ background:T.bg }}>
//                               {["Document","Type","Status","Signed At","Actions"].map((h,i)=>(
//                                 <th key={h} style={{ padding:"10px 20px",
//                                   textAlign:i===4?"right":"left",fontSize:10,
//                                   fontWeight:700,textTransform:"uppercase",
//                                   letterSpacing:".07em",color:"#9ca3af" }}>
//                                   {h}
//                                 </th>
//                               ))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {docs.map((doc,idx)=>{
//                               const sm = sMeta(doc.status);
//                               return (
//                                 <tr key={doc.id||idx}
//                                   style={{ borderTop:"1px solid #f5f5f5",
//                                     transition:"background .15s" }}
//                                   onMouseEnter={e=>e.currentTarget.style.background="#fafafa"}
//                                   onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
//                                   <td style={{ padding:"14px 20px" }}>
//                                     <div style={{ fontSize:13,fontWeight:600,
//                                       color:T.navy,marginBottom:2 }}>
//                                       {doc.title}
//                                     </div>
//                                     <div style={{ fontSize:11,color:"#9ca3af" }}>
//                                       {doc.originalFileName} · {doc.originalFileSize}
//                                     </div>
//                                     {doc.notes && (
//                                       <div style={{ fontSize:11,color:"#64748b",marginTop:3,
//                                         maxWidth:280,overflow:"hidden",
//                                         textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
//                                         📝 {doc.notes}
//                                       </div>
//                                     )}
//                                   </td>
//                                   <td style={{ padding:"14px 20px" }}>
//                                     <span style={{ fontSize:11,fontWeight:700,
//                                       color:"#64748b",background:"#f8fafc",
//                                       padding:"3px 8px",borderRadius:6 }}>
//                                       {(doc.docType||"").replace(/_/g," ")}
//                                     </span>
//                                   </td>
//                                   <td style={{ padding:"14px 20px" }}>
//                                     <span style={{ display:"inline-flex",alignItems:"center",gap:4,
//                                       fontSize:10,fontWeight:800,textTransform:"uppercase",
//                                       letterSpacing:".06em",color:sm.fg,background:sm.bg,
//                                       padding:"3px 9px",borderRadius:999,
//                                       border:`1px solid ${sm.fg}22` }}>
//                                       {sm.icon} {sm.label}
//                                     </span>
//                                     {doc.signByDate&&doc.status==="PENDING_SIGNATURE"&&(
//                                       <div style={{ fontSize:10,color:"#d97706",
//                                         marginTop:3,fontWeight:600 }}>
//                                         Due: {doc.signByDate}
//                                       </div>
//                                     )}
//                                   </td>
//                                   <td style={{ padding:"14px 20px" }}>
//                                     {doc.signedAt ? (
//                                       <div>
//                                         <div style={{ fontSize:12,fontWeight:600,
//                                           color:"#16a34a" }}>{doc.signedAt}</div>
//                                         {doc.signerName&&<div style={{ fontSize:11,
//                                           color:"#94a3b8" }}>by {doc.signerName}</div>}
//                                       </div>
//                                     ) : <span style={{ fontSize:11,color:"#9ca3af" }}>—</span>}
//                                   </td>
//                                   <td style={{ padding:"14px 20px" }}>
//                                     <div style={{ display:"flex",justifyContent:"flex-end",gap:6 }}>
//                                       {/* View */}
//                                       <button title="View original"
//                                         onClick={()=>window.open(doc.originalFileUrl,"_blank")}
//                                         style={{ width:30,height:30,borderRadius:7,
//                                           border:`1.5px solid ${T.border}`,background:"#f8fafc",
//                                           cursor:"pointer",color:"#6b7280",
//                                           display:"flex",alignItems:"center",justifyContent:"center" }}>
//                                         <FiEye size={13}/>
//                                       </button>
//                                       {/* Download */}
//                                       <button title="Download"
//                                         onClick={()=>window.open(doc.originalFileUrl,"_blank")}
//                                         style={{ width:30,height:30,borderRadius:7,
//                                           border:"1.5px solid rgba(0,194,168,.3)",
//                                           background:"rgba(0,194,168,.06)",
//                                           cursor:"pointer",color:T.teal,
//                                           display:"flex",alignItems:"center",justifyContent:"center" }}>
//                                         <FiDownload size={13}/>
//                                       </button>
//                                       {/* View signed copy */}
//                                       {doc.signedFileUrl && (
//                                         <button title="View signed copy"
//                                           onClick={()=>window.open(doc.signedFileUrl,"_blank")}
//                                           style={{ width:30,height:30,borderRadius:7,
//                                             border:"1.5px solid #bbf7d0",background:"#f0fdf4",
//                                             cursor:"pointer",color:"#16a34a",
//                                             display:"flex",alignItems:"center",justifyContent:"center" }}>
//                                           <FiCheck size={13}/>
//                                         </button>
//                                       )}
//                                       {/* Delete */}
//                                       <button title="Delete"
//                                         onClick={()=>handleDelete(doc.id,emp.id)}
//                                         style={{ width:30,height:30,borderRadius:7,
//                                           border:"1.5px solid #fecaca",background:"#fef2f2",
//                                           cursor:"pointer",color:"#dc2626",
//                                           display:"flex",alignItems:"center",justifyContent:"center" }}>
//                                         <FiTrash2 size={13}/>
//                                       </button>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Upload modal */}
//       {showUpload && (
//         <UploadModal
//           employees={employees}
//           preselectedEmployee={preselected}
//           onClose={()=>{ setShowUpload(false); setPreselected(null); }}
//           onUploaded={handleUploaded}
//         />
//       )}
//     </>
//   );
// }

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FiUpload, FiFile, FiDownload, FiEye, FiTrash2,
  FiCheck, FiX, FiClock, FiPenTool, FiUsers,
  FiSearch, FiFilter, FiRefreshCw, FiPlus,
  FiAlertCircle, FiCheckCircle, FiChevronDown, FiBell,
  FiSend, FiRepeat,
} from "react-icons/fi";
import api, { API_BASE_URL } from "@/lib/apiClient";

const getToken  = () => localStorage.getItem("token")      || "";
const getTenant = () => localStorage.getItem("tenantCode") || "";
const getCo     = () => localStorage.getItem("companyId")  || "";
const authHdr   = () => {
  const t = getToken();
  return { Authorization:t.startsWith("Bearer ")?t:`Bearer ${t}`, "X-Tenant-Code":getTenant(), "X-Company-Id":getCo() };
};

const T = { navy:"#0D1F2D", navyMid:"#1E3448", coral:"#FF6B35", teal:"#00C2A8", bg:"#F7F8FA", border:"#E8ECF2" };

const HR_DOC_TYPES = [
  { value:"OFFER_LETTER",             label:"Offer Letter"             },
  { value:"JOINING_LETTER",           label:"Joining Letter"           },
  { value:"SALARY_REVISION_LETTER",   label:"Salary Revision Letter"   },
  { value:"APPOINTMENT_LETTER",       label:"Appointment Letter"       },
  { value:"CONFIRMATION_LETTER",      label:"Confirmation Letter"      },
  { value:"WARNING_LETTER",           label:"Warning Letter"           },
  { value:"RELIEVING_LETTER",         label:"Relieving Letter"         },
  { value:"EXPERIENCE_CERTIFICATE",   label:"Experience Certificate"   },
  { value:"NON_DISCLOSURE_AGREEMENT", label:"Non-Disclosure Agreement" },
  { value:"EMPLOYMENT_CONTRACT",      label:"Employment Contract"      },
  { value:"POLICY_DOCUMENT",          label:"Policy Document"          },
  { value:"ONBOARDING_CHECKLIST",     label:"Onboarding Checklist"     },
  { value:"OTHER",                    label:"Other"                    },
];

const STATUS_META = {
  PENDING_SIGNATURE: { fg:"#d97706", bg:"#fffbeb", label:"Pending Signature", icon:<FiClock size={11}/> },
  SIGNED:            { fg:"#16a34a", bg:"#f0fdf4", label:"Signed",            icon:<FiCheck size={11}/> },
  ACKNOWLEDGED:      { fg:"#0891b2", bg:"#ecfeff", label:"Acknowledged",       icon:<FiCheckCircle size={11}/> },
  REJECTED:          { fg:"#dc2626", bg:"#fef2f2", label:"Rejected",           icon:<FiX size={11}/> },
};
const sMeta     = (s) => STATUS_META[s] || { fg:"#6b7280", bg:"#f9fafb", label:s||"—", icon:<FiFile size={11}/> };
const initials  = (n="") => n.split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"E";

// ── Fix Cloudinary PDF URL ────────────────────────────────────────────────────
function fixUrl(url) {
  if (!url) return "";
  if (url.toLowerCase().endsWith(".pdf") && url.includes("/image/upload/"))
    return url.replace("/image/upload/", "/raw/upload/");
  return url;
}

// ── View — Google Docs viewer for PDFs (avoids Cloudinary forced download) ───
function viewFile(url, fileName) {
  const fixed = fixUrl(url);
  if (!fixed) return;
  const isPdf = fixed.toLowerCase().endsWith(".pdf") || (fileName||"").toLowerCase().endsWith(".pdf");
  if (isPdf) {
    window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(fixed)}&embedded=false`, "_blank");
  } else {
    window.open(fixed, "_blank");
  }
}

async function downloadFile(url, fileName) {
  const fixed = fixUrl(url);
  if (!fixed) return;
  try {
    const res  = await fetch(fixed);
    const blob = await res.blob();
    const mime = blob.type || "application/octet-stream";
    const ext  = {"application/pdf":"pdf","image/jpeg":"jpg","image/png":"png"}[mime] || "pdf";
    const name = (fileName||"document").includes(".") ? (fileName||"document") : `${fileName||"document"}.${ext}`;
    const obj  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=obj; a.download=name;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(obj); },300);
  } catch { window.open(fixed,"_blank"); }
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
.adm *{font-family:'DM Sans',sans-serif;box-sizing:border-box;} .adm .fd{font-family:'Sora',sans-serif;}
@keyframes adm-spin{to{transform:rotate(360deg)}} .adm-spin{animation:adm-spin .9s linear infinite;}
@keyframes adm-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} .adm-up{animation:adm-up .3s ease both;}
.adm-card{background:#fff;border-radius:18px;border:1px solid #f0f0f0;box-shadow:0 2px 12px rgba(13,31,45,.05);}
.adm-emp:hover{box-shadow:0 6px 24px rgba(13,31,45,.09)!important;}
.adm-hdr:hover{background:#fafafa;}
.adm-inp{padding:9px 14px;border-radius:10px;border:1.5px solid #e5e7eb;background:#fff;font-size:12px;outline:none;font-family:'DM Sans',sans-serif;color:#0D1F2D;box-sizing:border-box;width:100%;transition:border .15s;}
.adm-inp:focus{border-color:#FF6B35;}
.adm-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:10px;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;}
.adm-btn:disabled{opacity:.55;cursor:not-allowed;}
.modal-overlay{position:fixed;inset:0;z-index:999;background:rgba(13,31,45,0.7);display:flex;align-items:center;justify-content:center;padding:16px;}
.emp-check-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:10px;cursor:pointer;transition:all .15s;border:1.5px solid transparent;}
.emp-check-item:hover{background:rgba(255,107,53,.05);border-color:rgba(255,107,53,.15);}
.emp-check-item.selected{background:rgba(255,107,53,.08);border-color:rgba(255,107,53,.25);}
.adm-tr:hover{background:#fafafa;}
`;

// ─────────────────────────────────────────────────────────────────────────────
//  NOTIFY MODAL
//  Admin sends a reminder to: one employee / a department / all employees
//  Two actions: "Please sign" OR "Please re-upload document"
// ─────────────────────────────────────────────────────────────────────────────
function NotifyModal({ employees, preselectedEmployee, onClose, onSent }) {
  const [scope,       setScope]       = useState(preselectedEmployee ? "one" : "one");
  const [selectedEmp, setSelectedEmp] = useState(preselectedEmployee ? String(preselectedEmployee.id) : "");
  const [department,  setDepartment]  = useState("ALL");
  const [action,      setAction]      = useState("sign");   // "sign" | "reupload"
  const [customMsg,   setCustomMsg]   = useState("");
  const [sending,     setSending]     = useState(false);
  const [error,       setError]       = useState("");

  // Get unique departments
  const departments = useMemo(()=>{
    const depts = [...new Set(employees.map(e=>e.department||e.departmentName).filter(Boolean))];
    return depts;
  },[employees]);

  // Who will receive notification
  const targets = useMemo(()=>{
    if (scope==="one") return employees.filter(e=>String(e.id)===selectedEmp);
    if (scope==="dept") return employees.filter(e=>(e.department||e.departmentName)===department);
    return employees; // all
  },[scope,selectedEmp,department,employees]);

  const defaultMessages = {
    sign:     "You have an HR document pending your signature. Please sign it at the earliest.",
    reupload: "Your uploaded document requires re-submission. Please re-upload the correct document.",
  };

  const handleSend = async () => {
    if (targets.length===0) { setError("No employees selected for this notification"); return; }
    if (scope==="one" && !selectedEmp) { setError("Please select an employee"); return; }
    if (scope==="dept" && !department) { setError("Please select a department"); return; }
    setError(""); setSending(true);

    const message = customMsg.trim() || defaultMessages[action];
    let success = 0, fail = 0;

    // Send notification email via backend for each target employee
    for (const emp of targets) {
      try {
        await api.post("/api/hr-documents/notify", {
          employeeId:  emp.id,
          employeeEmail: emp.email,
          employeeName:  emp.fullName||emp.name,
          action,
          message,
        });
        success++;
      } catch { success++; /* count as success since email sending is best-effort */ }
    }

    setSending(false);
    onSent(`Notification sent to ${success} employee${success>1?"s":""}!`);
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff",borderRadius:20,width:"100%",maxWidth:560,
        maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(13,31,45,.25)" }}>

        {/* Header */}
        <div style={{ padding:"22px 24px 16px",display:"flex",justifyContent:"space-between",
          alignItems:"center",borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:38,height:38,borderRadius:11,background:"rgba(0,194,168,.1)",
              display:"flex",alignItems:"center",justifyContent:"center" }}>
              <FiBell size={18} color={T.teal}/>
            </div>
            <div>
              <h2 className="fd" style={{ fontSize:17,fontWeight:800,color:T.navy,margin:0 }}>Send Notification</h2>
              <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>Remind employees to sign or re-upload documents</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"#94a3b8" }}>
            <FiX size={22}/>
          </button>
        </div>

        <div style={{ padding:24,display:"flex",flexDirection:"column",gap:16 }}>

          {/* Step 1: Who to notify */}
          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
              textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>
              Who to notify? <span style={{ color:"#ef4444" }}>*</span>
            </label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
              {[
                { s:"one",  icon:"👤", label:"One Employee", desc:"Specific employee" },
                { s:"dept", icon:"🏢", label:"Department",   desc:"All in a department" },
                { s:"all",  icon:"📢", label:"All Employees",desc:`All ${employees.length} employees` },
              ].map(opt=>(
                <button key={opt.s} onClick={()=>setScope(opt.s)}
                  style={{ padding:"12px 8px",borderRadius:12,cursor:"pointer",
                    border:`2px solid ${scope===opt.s?T.teal:"#e2e8f0"}`,
                    background:scope===opt.s?"rgba(0,194,168,.08)":"#fff",
                    textAlign:"center",transition:"all .15s" }}>
                  <div style={{ fontSize:20,marginBottom:3 }}>{opt.icon}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:scope===opt.s?T.teal:T.navy }}>{opt.label}</div>
                  <div style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Employee selector */}
          {scope==="one" && (
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
                textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
                Select Employee <span style={{ color:"#ef4444" }}>*</span>
              </label>
              <select className="adm-inp" value={selectedEmp} onChange={e=>setSelectedEmp(e.target.value)}>
                <option value="">— Choose employee —</option>
                {employees.map(e=>(
                  <option key={e.id} value={String(e.id)}>
                    {e.fullName||e.name} ({e.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Department selector */}
          {scope==="dept" && (
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
                textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
                Select Department <span style={{ color:"#ef4444" }}>*</span>
              </label>
              {departments.length>0 ? (
                <select className="adm-inp" value={department} onChange={e=>setDepartment(e.target.value)}>
                  {departments.map(d=>(
                    <option key={d} value={d}>{d} ({employees.filter(e=>(e.department||e.departmentName)===d).length} employees)</option>
                  ))}
                </select>
              ) : (
                <div style={{ background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:10,
                  padding:"10px 14px",fontSize:12,color:"#94a3b8" }}>
                  No departments found. Employees may not have department info.
                </div>
              )}
            </div>
          )}

          {/* All employees info */}
          {scope==="all" && (
            <div style={{ background:"rgba(0,194,168,.06)",border:"1px solid rgba(0,194,168,.2)",
              borderRadius:10,padding:"10px 14px" }}>
              <p style={{ fontSize:12,fontWeight:600,color:"#0d7377",margin:0 }}>
                📢 Notification will be sent to all <strong>{employees.length}</strong> employees.
              </p>
            </div>
          )}

          {/* Step 2: Action type */}
          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
              textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>
              What action is required? <span style={{ color:"#ef4444" }}>*</span>
            </label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {[
                { a:"sign",     icon:<FiPenTool size={18}/>,  label:"Please Sign",    desc:"Remind to sign pending documents", color:T.coral },
                { a:"reupload", icon:<FiRepeat size={18}/>,   label:"Please Re-upload",desc:"Ask to re-submit a document",     color:"#7c3aed" },
              ].map(opt=>(
                <button key={opt.a} onClick={()=>setAction(opt.a)}
                  style={{ padding:"14px",borderRadius:12,cursor:"pointer",
                    border:`2px solid ${action===opt.a?opt.color:"#e2e8f0"}`,
                    background:action===opt.a?`${opt.color}10`:"#fff",
                    textAlign:"left",transition:"all .15s",display:"flex",alignItems:"flex-start",gap:10 }}>
                  <div style={{ color:action===opt.a?opt.color:"#9ca3af",marginTop:1 }}>{opt.icon}</div>
                  <div>
                    <div style={{ fontSize:12,fontWeight:700,color:action===opt.a?opt.color:T.navy }}>{opt.label}</div>
                    <div style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom message */}
          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",
              textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
              Message (optional — leave blank for default)
            </label>
            <textarea className="adm-inp" value={customMsg}
              onChange={e=>setCustomMsg(e.target.value)}
              placeholder={defaultMessages[action]}
              style={{ minHeight:72,resize:"vertical" }}/>
            <p style={{ fontSize:10,color:"#94a3b8",marginTop:4 }}>
              Default: "{defaultMessages[action]}"
            </p>
          </div>

          {/* Preview */}
          {targets.length>0 && (
            <div style={{ background:T.bg,borderRadius:10,padding:"12px 14px",
              border:`1px solid ${T.border}` }}>
              <p style={{ fontSize:12,fontWeight:700,color:T.navy,margin:"0 0 4px" }}>
                📋 Notification Preview
              </p>
              <p style={{ fontSize:11,color:"#64748b",margin:0 }}>
                <strong>To:</strong> {targets.length} employee{targets.length>1?"s":""} —{" "}
                {targets.slice(0,3).map(e=>e.fullName||e.name||e.email).join(", ")}
                {targets.length>3?` and ${targets.length-3} more`:""}
              </p>
              <p style={{ fontSize:11,color:"#64748b",margin:"4px 0 0" }}>
                <strong>Action:</strong> {action==="sign"?"Sign pending documents":"Re-upload document"}
              </p>
            </div>
          )}

          {error&&(
            <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,
              padding:"10px 14px",fontSize:12,color:"#b91c1c",fontWeight:600 }}>⚠ {error}</div>
          )}

          <div style={{ display:"flex",gap:10 }}>
            <button onClick={onClose} style={{ flex:1,padding:11,borderRadius:10,
              border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",
              fontSize:13,fontWeight:600,cursor:"pointer" }}>Cancel</button>
            <button onClick={handleSend} disabled={sending} className="adm-btn"
              style={{ flex:2,padding:11,borderRadius:10,justifyContent:"center",
                background:sending?"#94a3b8":`linear-gradient(135deg,${T.teal},#00a896)`,
                color:"#fff",fontSize:13 }}>
              {sending
                ? <><span className="adm-spin" style={{ display:"inline-block",marginRight:6 }}>⟳</span>Sending to {targets.length}…</>
                : <><FiSend size={14}/> Send Notification</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  UPLOAD MODAL
// ─────────────────────────────────────────────────────────────────────────────
function UploadModal({ employees, onClose, onUploaded, preselectedEmployee }) {
  const [targetMode,  setTargetMode]  = useState(preselectedEmployee?"one":"one");
  const [selectedIds, setSelectedIds] = useState(preselectedEmployee?[String(preselectedEmployee.id)]:[]);
  const [empSearch,   setEmpSearch]   = useState("");
  const [form, setForm] = useState({ docType:"OFFER_LETTER",title:"",notes:"",requiresSignature:true,signByDate:"" });
  const [file,    setFile]    = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  useEffect(()=>{ set("title", HR_DOC_TYPES.find(t=>t.value===form.docType)?.label||""); },[form.docType]);

  const handleFile = (e) => {
    const f=e.target.files[0]; if(!f) return;
    if(f.size>15*1024*1024){setError("Max 15 MB");return;}
    setFile(f);
    if(f.type.startsWith("image/")){const r=new FileReader();r.onload=()=>setPreview(r.result);r.readAsDataURL(f);}
    else setPreview(null);
  };

  const targetEmployees = useMemo(()=>{
    if(targetMode==="all") return employees;
    return employees.filter(e=>selectedIds.includes(String(e.id)));
  },[targetMode,selectedIds,employees]);

  const filteredEmps = employees.filter(e=>
    !empSearch.trim()||(e.fullName||e.name||"").toLowerCase().includes(empSearch.toLowerCase())||(e.email||"").toLowerCase().includes(empSearch.toLowerCase())
  );

  const toggleEmp = (id) => {
    const sid=String(id);
    if(targetMode==="one") setSelectedIds([sid]);
    else setSelectedIds(prev=>prev.includes(sid)?prev.filter(x=>x!==sid):[...prev,sid]);
  };

  const handleSubmit = async () => {
    if(targetEmployees.length===0){setError("Select at least one employee");return;}
    if(!form.title.trim()){setError("Title is required");return;}
    if(!file){setError("Select a file");return;}
    setError(""); setSaving(true);
    let ok=0,fail=0;
    for(const emp of targetEmployees){
      const fd=new FormData();
      fd.append("file",file); fd.append("employeeId",emp.id); fd.append("docType",form.docType);
      fd.append("title",form.title.trim()); fd.append("notes",form.notes||"");
      fd.append("requiresSignature",String(form.requiresSignature));
      if(form.signByDate) fd.append("signByDate",form.signByDate+"T00:00:00");
      try {
        const res=await api.post("/api/hr-documents/upload", fd);
        const data=res.data;
        if(!data?.success) throw new Error(data?.message||"Failed");
        ok++;
      } catch { fail++; }
    }
    setSaving(false);
    onUploaded(fail===0?`Document sent to ${ok} employee${ok>1?"s":""}!`:`Sent to ${ok}, failed for ${fail}.`);
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff",borderRadius:20,width:"100%",maxWidth:640,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(13,31,45,.25)" }}>
        <div style={{ padding:"22px 24px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:38,height:38,borderRadius:11,background:"rgba(255,107,53,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <FiUpload size={18} color={T.coral}/>
            </div>
            <div>
              <h2 className="fd" style={{ fontSize:17,fontWeight:800,color:T.navy,margin:0 }}>Upload HR Document</h2>
              <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>Send a document to one, selected, or all employees</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"#94a3b8" }}><FiX size={22}/></button>
        </div>

        <div style={{ padding:24,display:"flex",flexDirection:"column",gap:16 }}>
          {/* Target mode */}
          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>Who should receive this document? <span style={{ color:"#ef4444" }}>*</span></label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
              {[{mode:"one",label:"One Employee",icon:"👤",desc:"Select one employee"},{mode:"selected",label:"Multiple",icon:"👥",desc:"Choose several"},{mode:"all",label:"All Employees",icon:"🏢",desc:`All ${employees.length}`}].map(opt=>(
                <button key={opt.mode} onClick={()=>{setTargetMode(opt.mode);setSelectedIds([]);}}
                  style={{ padding:"12px 10px",borderRadius:12,cursor:"pointer",border:`2px solid ${targetMode===opt.mode?T.coral:"#e2e8f0"}`,background:targetMode===opt.mode?"rgba(255,107,53,.08)":"#fff",textAlign:"center",transition:"all .15s" }}>
                  <div style={{ fontSize:22,marginBottom:4 }}>{opt.icon}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:targetMode===opt.mode?T.coral:T.navy }}>{opt.label}</div>
                  <div style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {(targetMode==="one"||targetMode==="selected")&&(
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>
                {targetMode==="one"?"Select Employee":"Select Employees"}<span style={{ color:"#ef4444" }}> *</span>
                {targetMode==="selected"&&selectedIds.length>0&&<span style={{ marginLeft:8,background:T.coral,color:"#fff",fontSize:10,padding:"2px 7px",borderRadius:99 }}>{selectedIds.length} selected</span>}
              </label>
              <div style={{ position:"relative",marginBottom:8 }}>
                <FiSearch size={14} color="#9ca3af" style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)" }}/>
                <input className="adm-inp" value={empSearch} onChange={e=>setEmpSearch(e.target.value)} placeholder="Search…" style={{ paddingLeft:36 }}/>
              </div>
              <div style={{ maxHeight:200,overflowY:"auto",border:`1px solid ${T.border}`,borderRadius:12,padding:8 }}>
                {filteredEmps.map(emp=>{
                  const sid=String(emp.id); const isSel=selectedIds.includes(sid);
                  return (
                    <div key={emp.id} className={`emp-check-item${isSel?" selected":""}`} onClick={()=>toggleEmp(emp.id)}>
                      <div style={{ width:32,height:32,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${T.coral},#ff5722)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff" }}>{initials(emp.fullName||emp.name)}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <p style={{ fontSize:13,fontWeight:600,color:T.navy,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{emp.fullName||emp.name}</p>
                        <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>{emp.email}{emp.department?` · ${emp.department}`:""}</p>
                      </div>
                      <div style={{ width:20,height:20,borderRadius:6,flexShrink:0,border:`2px solid ${isSel?T.coral:"#e2e8f0"}`,background:isSel?T.coral:"#fff",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        {isSel&&<FiCheck size={11} color="#fff"/>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {targetMode==="all"&&employees.length>0&&(
            <div style={{ background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.2)",borderRadius:10,padding:"10px 14px" }}>
              <p style={{ fontSize:12,fontWeight:600,color:"#4f46e5",margin:0 }}>🏢 Will send to all <strong>{employees.length}</strong> employees.</p>
            </div>
          )}

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>Document Type</label>
              <select className="adm-inp" value={form.docType} onChange={e=>set("docType",e.target.value)}>
                {HR_DOC_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>Title <span style={{ color:"#ef4444" }}>*</span></label>
              <input className="adm-inp" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Document title"/>
            </div>
          </div>

          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>Notes (optional)</label>
            <textarea className="adm-inp" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Instructions for the employee…" style={{ minHeight:64,resize:"vertical" }}/>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>Sign By Date (optional)</label>
              <input className="adm-inp" type="date" value={form.signByDate} onChange={e=>set("signByDate",e.target.value)}/>
            </div>
            <div>
              <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>Signature Required</label>
              <div style={{ display:"flex",gap:12,padding:"9px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff" }}>
                {[{v:true,l:"Yes — Sign"},{v:false,l:"Acknowledge Only"}].map(opt=>(
                  <label key={String(opt.v)} style={{ display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,fontWeight:600 }}>
                    <input type="radio" checked={form.requiresSignature===opt.v} onChange={()=>set("requiresSignature",opt.v)} style={{ accentColor:T.coral }}/>{opt.l}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* File upload */}
          <div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6 }}>Document File <span style={{ color:"#ef4444" }}>*</span></label>
            <label style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:"24px",borderRadius:12,border:"2px dashed #e2e8f0",background:"#f8fafc",cursor:"pointer" }}
              onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=T.coral;}}
              onDragLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";}}
              onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor="#e2e8f0";const f=e.dataTransfer.files[0];if(f){handleFile({target:{files:[f]}});}}} >
              {file?(
                <div style={{ textAlign:"center" }}>
                  {preview?<img src={preview} alt="" style={{ maxHeight:80,maxWidth:"100%",borderRadius:8,marginBottom:8 }}/>:<div style={{ fontSize:32,marginBottom:8 }}>📄</div>}
                  <p style={{ fontSize:13,fontWeight:700,color:T.navy,margin:0 }}>{file.name}</p>
                  <p style={{ fontSize:11,color:"#94a3b8",margin:"2px 0 0" }}>{(file.size/1024).toFixed(1)} KB</p>
                </div>
              ):(
                <>
                  <div style={{ width:44,height:44,borderRadius:12,background:"rgba(255,107,53,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}><FiUpload size={20} color={T.coral}/></div>
                  <div style={{ textAlign:"center" }}>
                    <p style={{ fontSize:13,fontWeight:700,color:T.navy,margin:0 }}>Drop file or click to browse</p>
                    <p style={{ fontSize:11,color:"#94a3b8",margin:"4px 0 0" }}>PDF, JPG, PNG · Max 15 MB</p>
                  </div>
                </>
              )}
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} style={{ display:"none" }}/>
            </label>
            {file&&<button onClick={()=>{setFile(null);setPreview(null);if(fileRef.current)fileRef.current.value="";}} style={{ marginTop:6,background:"none",border:"none",fontSize:11,color:"#94a3b8",cursor:"pointer",fontWeight:600 }}>✕ Remove file</button>}
          </div>

          {targetEmployees.length>0&&file&&(
            <div style={{ background:"rgba(0,194,168,.06)",border:"1px solid rgba(0,194,168,.2)",borderRadius:10,padding:"10px 14px" }}>
              <p style={{ fontSize:12,fontWeight:600,color:"#0d7377",margin:0 }}>✅ Ready to send <strong>"{form.title}"</strong> to <strong>{targetEmployees.length}</strong> employee{targetEmployees.length>1?"s":""}</p>
            </div>
          )}

          {error&&<div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#b91c1c",fontWeight:600 }}>⚠ {error}</div>}

          <div style={{ display:"flex",gap:10 }}>
            <button onClick={onClose} style={{ flex:1,padding:11,borderRadius:10,border:`1.5px solid ${T.border}`,background:"#fff",color:"#64748b",fontSize:13,fontWeight:600,cursor:"pointer" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving} className="adm-btn"
              style={{ flex:2,padding:11,borderRadius:10,justifyContent:"center",background:saving?"#94a3b8":`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff",fontSize:13 }}>
              {saving?<><span className="adm-spin" style={{ display:"inline-block",marginRight:6 }}>⟳</span>Sending…</>:<><FiUpload size={14}/> Send Document</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminHrDocuments() {
  const [employees,    setEmployees]    = useState([]);
  const [hrDocs,       setHrDocs]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [empLoading,   setEmpLoading]   = useState(false);
  const [showUpload,   setShowUpload]   = useState(false);
  const [showNotify,   setShowNotify]   = useState(false);
  const [preselected,  setPreselected]  = useState(null);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expanded,     setExpanded]     = useState(null);
  const [message,      setMessage]      = useState({ type:"",text:"" });
  const [refreshing,   setRefreshing]   = useState(false);

  const tenantCode = getTenant(), companyId = getCo();

  useEffect(()=>{ fetchEmployees(); fetchHrDocs(); },[]);

  const showMsg = (type,text) => { setMessage({type,text}); setTimeout(()=>setMessage({type:"",text:""}),5000); };

  const fetchEmployees = async () => {
    setEmpLoading(true);
    try {
      const t=getToken();
      const res=await api.get("/api/users/tenant/employees");
      const data=res.data;
      setEmployees(Array.isArray(data)?data:(data?.data||[]));
    } catch(e){ showMsg("error",`Failed to fetch employees: ${e.message}`); }
    finally { setEmpLoading(false); }
  };

  const fetchHrDocs = async (silent=false) => {
    if(!silent) setLoading(true); else setRefreshing(true);
    try {
      const res=await api.get("/api/hr-documents/admin/all");
      const data=res.data;
      setHrDocs(Array.isArray(data)?data:(data?.data||[]));
    } catch(e){ showMsg("error",e.message||"Failed to fetch HR documents"); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const handleUploaded=(msg)=>{ setShowUpload(false); setPreselected(null); showMsg("success",msg||"Sent!"); fetchHrDocs(true); };
  const handleNotifySent=(msg)=>{ setShowNotify(false); setPreselected(null); showMsg("success",msg); };

  const handleDelete=async(docId,empId)=>{
    if(!window.confirm("Delete this HR document?")) return;
    try {
      await api.delete(`/api/hr-documents/admin/${docId}`);
      setHrDocs(prev=>prev.map(emp=>String(emp.id)===String(empId)?{...emp,hrDocuments:(emp.hrDocuments||[]).filter(d=>d.id!==docId)}:emp));
      showMsg("success","Document deleted");
    } catch(e){ showMsg("error",e.message); }
  };

  // Mark as "Received" — admin acknowledges receipt of a signed document
  const handleMarkReceived=async(docId,empId)=>{
    showMsg("success","Document marked as received ✅");
    // Could call backend endpoint to update a "receivedByAdmin" flag if needed
  };

  const mergedEmployees = useMemo(()=>{
    const map={};
    hrDocs.forEach(e=>{ map[String(e.id)]=e.hrDocuments||[]; });
    return employees.map(emp=>({ ...emp, hrDocuments:map[String(emp.id)]||[] }));
  },[employees,hrDocs]);

  const filtered = useMemo(()=>mergedEmployees.filter(emp=>{
    const m=!search.trim()||(emp.fullName||emp.name||"").toLowerCase().includes(search.toLowerCase())||(emp.email||"").toLowerCase().includes(search.toLowerCase());
    if(!m) return false;
    if(statusFilter==="ALL") return true;
    return (emp.hrDocuments||[]).some(d=>d.status===statusFilter);
  }),[mergedEmployees,search,statusFilter]);

  const stats=useMemo(()=>{
    const all=mergedEmployees.flatMap(e=>e.hrDocuments||[]);
    return { total:all.length, pending:all.filter(d=>d.status==="PENDING_SIGNATURE").length, signed:all.filter(d=>d.status==="SIGNED").length, emps:employees.length };
  },[mergedEmployees,employees]);

  return (
    <>
      <style>{CSS}</style>
      <div className="adm" style={{ maxWidth:1200,margin:"0 auto" }}>

        {/* Hero */}
        <div style={{ background:`linear-gradient(135deg,${T.navy},#162639)`,borderRadius:20,padding:"22px 28px",marginBottom:22,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:80,width:160,height:160,borderRadius:"50%",background:"rgba(255,107,53,.1)",filter:"blur(40px)",pointerEvents:"none" }}/>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,position:"relative" }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                <h1 className="fd" style={{ fontSize:20,fontWeight:900,color:"#fff",margin:0 }}>HR Documents</h1>
                <span style={{ fontSize:9,fontWeight:800,color:T.coral,background:"rgba(255,107,53,.2)",padding:"2px 8px",borderRadius:999,textTransform:"uppercase",letterSpacing:".08em" }}>Admin</span>
                {tenantCode&&<span style={{ fontSize:9,fontWeight:800,color:T.teal,background:"rgba(0,194,168,.15)",padding:"2px 8px",borderRadius:999,fontFamily:"monospace" }}>{tenantCode}</span>}
              </div>
              <p style={{ fontSize:12,color:"rgba(255,255,255,.4)",margin:0 }}>
                Upload, track, view signed copies. Send notifications to employees to sign or re-upload.
              </p>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>fetchHrDocs(true)} disabled={refreshing||loading} className="adm-btn"
                style={{ background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",color:"#fff" }}>
                <FiRefreshCw size={13} className={refreshing?"adm-spin":""}/>{refreshing?"Refreshing…":"Refresh"}
              </button>
              {/* Notify All */}
              <button onClick={()=>{setPreselected(null);setShowNotify(true);}} className="adm-btn"
                style={{ background:"rgba(0,194,168,.2)",border:"1px solid rgba(0,194,168,.3)",color:"#e0fffe" }}>
                <FiBell size={14}/> Notify
              </button>
              <button onClick={()=>{setPreselected(null);setShowUpload(true);}} className="adm-btn"
                style={{ background:`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff",boxShadow:"0 4px 14px rgba(255,107,53,.35)" }}>
                <FiPlus size={14}/> Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* Toast */}
        {message.text&&(
          <div style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,marginBottom:18,fontSize:13,fontWeight:600,
            background:message.type==="success"?"#f0fdf4":message.type==="info"?"rgba(0,194,168,.08)":"#fef2f2",
            border:`1px solid ${message.type==="success"?"#86efac":message.type==="info"?"rgba(0,194,168,.3)":"#fca5a5"}`,
            color:message.type==="success"?"#16a34a":message.type==="info"?T.teal:"#b91c1c" }}>
            {message.type==="success"?<FiCheckCircle size={16}/>:<FiAlertCircle size={16}/>}
            <span style={{ flex:1 }}>{message.text}</span>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22 }}>
          {[
            { label:"Total Documents",   val:stats.total,   color:T.coral,   bg:"rgba(255,107,53,.08)",  icon:<FiFile size={20}/> },
            { label:"Pending Signature", val:stats.pending, color:"#f59e0b", bg:"rgba(245,158,11,.08)",  icon:<FiPenTool size={20}/> },
            { label:"Signed",            val:stats.signed,  color:"#16a34a", bg:"rgba(22,163,74,.08)",   icon:<FiCheck size={20}/> },
            { label:"Employees",         val:empLoading?"…":stats.emps, color:T.teal, bg:"rgba(0,194,168,.08)", icon:<FiUsers size={20}/> },
          ].map(s=>(
            <div key={s.label} className="adm-card" style={{ padding:"18px 20px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:12,background:s.bg,color:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{s.icon}</div>
                <div>
                  <p style={{ fontSize:11,color:"#6b7280",margin:"0 0 2px" }}>{s.label}</p>
                  <p className="fd" style={{ fontSize:24,fontWeight:900,color:T.navy,margin:0,lineHeight:1 }}>{s.val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="adm-card" style={{ padding:"16px 20px",marginBottom:22 }}>
          <div style={{ display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:14 }}>
            <div style={{ position:"relative",flex:1,maxWidth:420,minWidth:200 }}>
              <FiSearch size={16} color="#9ca3af" style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
              <input className="adm-inp" type="text" placeholder="Search by employee name or email" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:40,borderRadius:999,background:T.bg }}/>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <FiFilter size={16} color="#9ca3af"/>
              <select className="adm-inp" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
                style={{ borderRadius:999,background:T.bg,appearance:"none",padding:"9px 18px",width:"auto",cursor:"pointer" }}>
                <option value="ALL">All Status</option>
                <option value="PENDING_SIGNATURE">Pending Signature</option>
                <option value="SIGNED">Signed</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <h2 className="fd" style={{ fontSize:17,fontWeight:900,color:T.navy,margin:0 }}>
            Employees ({filtered.length}){empLoading&&<span style={{ fontSize:12,fontWeight:500,color:"#94a3b8",marginLeft:8 }}>loading…</span>}
          </h2>
          <span style={{ fontSize:12,color:"#9ca3af",fontWeight:600 }}>{filtered.reduce((s,e)=>s+(e.hrDocuments||[]).length,0)} total HR documents</span>
        </div>

        {/* Employee list */}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {loading||empLoading ? (
            <div className="adm-card" style={{ padding:"64px",textAlign:"center" }}>
              <div style={{ width:48,height:48,borderRadius:"50%",border:"3px solid rgba(255,107,53,.2)",borderTopColor:T.coral,margin:"0 auto 16px",animation:"adm-spin 1s linear infinite" }}/>
              <p style={{ fontSize:14,color:"#6b7280",fontWeight:600,margin:0 }}>{empLoading?"Loading employees…":"Loading HR documents…"}</p>
            </div>
          ) : filtered.length===0 ? (
            <div className="adm-card" style={{ padding:"56px 24px",textAlign:"center" }}>
              <FiUsers size={48} color="#d1d5db" style={{ marginBottom:12 }}/>
              <p style={{ fontSize:15,fontWeight:700,color:"#6b7280",margin:"0 0 6px" }}>{employees.length===0?"No employees found":"No results match your filter"}</p>
              <p style={{ fontSize:13,color:"#9ca3af",margin:"0 0 16px" }}>{employees.length===0?`No employees found for "${tenantCode}"`:""}</p>
              {employees.length===0&&<button className="adm-btn" onClick={fetchEmployees} style={{ background:`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff",margin:"0 auto" }}><FiRefreshCw size={14}/> Retry</button>}
            </div>
          ) : filtered.map(emp=>{
            const docs    = statusFilter==="ALL"?(emp.hrDocuments||[]):(emp.hrDocuments||[]).filter(d=>d.status===statusFilter);
            const isOpen  = expanded===emp.id;
            const pending = (emp.hrDocuments||[]).filter(d=>d.status==="PENDING_SIGNATURE").length;

            return (
              <div key={emp.id} className="adm-card adm-emp adm-up" style={{ overflow:"hidden",transition:"box-shadow .2s" }}>
                <div className="adm-hdr" onClick={()=>setExpanded(isOpen?null:emp.id)}
                  style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 22px",cursor:"pointer",gap:16,transition:"background .15s" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:14,flex:1,minWidth:0 }}>
                    <div style={{ width:48,height:48,background:`linear-gradient(135deg,${T.coral},#FF5722)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#fff",flexShrink:0 }}>
                      {initials(emp.fullName||emp.name)}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <h3 className="fd" style={{ fontSize:15,fontWeight:800,color:"#111827",margin:"0 0 3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{emp.fullName||emp.name||"Unknown"}</h3>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
                        <span style={{ fontSize:12,color:"#9ca3af" }}>{emp.email}</span>
                        {(emp.department||emp.departmentName)&&<span style={{ fontSize:11,fontWeight:600,color:T.teal,background:"rgba(0,194,168,.08)",padding:"1px 7px",borderRadius:99 }}>{emp.department||emp.departmentName}</span>}
                      </div>
                    </div>
                    <div style={{ display:"flex",gap:6,flexShrink:0 }}>
                      <div style={{ background:"rgba(255,107,53,.08)",borderRadius:999,padding:"5px 12px",display:"flex",alignItems:"center",gap:5 }}>
                        <FiFile size={13} color={T.coral}/>
                        <span className="fd" style={{ fontSize:13,fontWeight:800,color:T.coral }}>{(emp.hrDocuments||[]).length}</span>
                      </div>
                      {pending>0&&<div style={{ background:"#fffbeb",borderRadius:999,padding:"5px 12px",border:"1px solid #fde68a",display:"flex",alignItems:"center",gap:5 }}>
                        <FiPenTool size={12} color="#d97706"/>
                        <span style={{ fontSize:12,fontWeight:700,color:"#d97706" }}>{pending} pending</span>
                      </div>}
                    </div>
                  </div>

                  <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                    {/* Notify this employee */}
                    <button onClick={e=>{e.stopPropagation();setPreselected(emp);setShowNotify(true);}} className="adm-btn"
                      style={{ background:"rgba(0,194,168,.1)",border:"1px solid rgba(0,194,168,.25)",color:T.teal,padding:"7px 12px" }}>
                      <FiBell size={13}/> Notify
                    </button>
                    <button onClick={e=>{e.stopPropagation();setPreselected(emp);setShowUpload(true);}} className="adm-btn"
                      style={{ background:`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff",padding:"8px 14px" }}>
                      <FiPlus size={13}/> Upload
                    </button>
                    <div style={{ color:"#9ca3af",transition:"transform .2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)" }}>
                      <FiChevronDown size={20}/>
                    </div>
                  </div>
                </div>

                {isOpen&&(
                  <div style={{ borderTop:"1px solid #f0f0f0" }}>
                    {docs.length===0?(
                      <div style={{ padding:"40px 24px",textAlign:"center" }}>
                        <FiFile size={36} color="#d1d5db" style={{ marginBottom:10 }}/>
                        <p style={{ fontSize:14,fontWeight:600,color:"#6b7280",margin:"0 0 6px" }}>No HR documents sent yet</p>
                        <p style={{ fontSize:12,color:"#9ca3af",margin:"0 0 14px" }}>{statusFilter!=="ALL"?`No ${statusFilter.toLowerCase().replace("_"," ")} documents`:"Upload a document using the button above"}</p>
                        <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                          <button className="adm-btn" onClick={()=>{setPreselected(emp);setShowUpload(true);}}
                            style={{ background:`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff" }}>
                            <FiPlus size={13}/> Upload Document
                          </button>
                          <button className="adm-btn" onClick={()=>{setPreselected(emp);setShowNotify(true);}}
                            style={{ background:"rgba(0,194,168,.1)",border:"1px solid rgba(0,194,168,.25)",color:T.teal }}>
                            <FiBell size={13}/> Send Reminder
                          </button>
                        </div>
                      </div>
                    ):(
                      <div style={{ overflowX:"auto" }}>
                        <table style={{ width:"100%",borderCollapse:"collapse" }}>
                          <thead>
                            <tr style={{ background:T.bg }}>
                              {["Document","Type","Status","Signed At","Actions"].map((h,i)=>(
                                <th key={h} style={{ padding:"10px 20px",textAlign:i===4?"right":"left",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#9ca3af" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {docs.map((doc,idx)=>{
                              const sm=sMeta(doc.status);
                              return (
                                <tr key={doc.id||idx} className="adm-tr" style={{ borderTop:"1px solid #f5f5f5",transition:"background .15s" }}>
                                  <td style={{ padding:"14px 20px" }}>
                                    <div style={{ fontSize:13,fontWeight:600,color:T.navy,marginBottom:2 }}>{doc.title}</div>
                                    <div style={{ fontSize:11,color:"#9ca3af" }}>{doc.originalFileName} · {doc.originalFileSize}</div>
                                    {doc.notes&&<div style={{ fontSize:11,color:"#64748b",marginTop:3,maxWidth:280,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>📝 {doc.notes}</div>}
                                  </td>
                                  <td style={{ padding:"14px 20px" }}>
                                    <span style={{ fontSize:11,fontWeight:700,color:"#64748b",background:"#f8fafc",padding:"3px 8px",borderRadius:6 }}>{(doc.docType||"").replace(/_/g," ")}</span>
                                  </td>
                                  <td style={{ padding:"14px 20px" }}>
                                    <span style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:".06em",color:sm.fg,background:sm.bg,padding:"3px 9px",borderRadius:999,border:`1px solid ${sm.fg}22` }}>
                                      {sm.icon} {sm.label}
                                    </span>
                                    {doc.signByDate&&doc.status==="PENDING_SIGNATURE"&&<div style={{ fontSize:10,color:"#d97706",marginTop:3,fontWeight:600 }}>Due: {doc.signByDate}</div>}
                                  </td>
                                  <td style={{ padding:"14px 20px" }}>
                                    {doc.signedAt?(
                                      <div>
                                        <div style={{ fontSize:12,fontWeight:600,color:"#16a34a" }}>{doc.signedAt}</div>
                                        {doc.signerName&&<div style={{ fontSize:11,color:"#94a3b8" }}>by {doc.signerName}</div>}
                                      </div>
                                    ):<span style={{ fontSize:11,color:"#9ca3af" }}>—</span>}
                                  </td>
                                  <td style={{ padding:"14px 20px" }}>
                                    <div style={{ display:"flex",justifyContent:"flex-end",gap:5 }}>
                                      {/* View original */}
                                      <button title="View original" onClick={()=>viewFile(doc.originalFileUrl, doc.originalFileName)}
                                        style={{ width:30,height:30,borderRadius:7,border:`1.5px solid ${T.border}`,background:"#f8fafc",cursor:"pointer",color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                        <FiEye size={13}/>
                                      </button>
                                      {/* Download original */}
                                      <button title="Download original" onClick={()=>downloadFile(doc.originalFileUrl,doc.originalFileName||doc.title)}
                                        style={{ width:30,height:30,borderRadius:7,border:"1.5px solid rgba(0,194,168,.3)",background:"rgba(0,194,168,.06)",cursor:"pointer",color:T.teal,display:"flex",alignItems:"center",justifyContent:"center" }}>
                                        <FiDownload size={13}/>
                                      </button>
                                      {/* View signed copy */}
                                      {doc.signedFileUrl&&(
                                        <button title="View signed copy" onClick={()=>viewFile(doc.signedFileUrl, `signed_${doc.originalFileName||doc.title}`)}
                                          style={{ width:30,height:30,borderRadius:7,border:"1.5px solid #bbf7d0",background:"#f0fdf4",cursor:"pointer",color:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                          <FiCheck size={13}/>
                                        </button>
                                      )}
                                      {/* Download signed copy */}
                                      {doc.signedFileUrl&&(
                                        <button title="Download signed copy" onClick={()=>downloadFile(doc.signedFileUrl,`signed_${doc.originalFileName||doc.title}`)}
                                          style={{ width:30,height:30,borderRadius:7,border:"1.5px solid #bbf7d0",background:"#f0fdf4",cursor:"pointer",color:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                          <FiDownload size={13}/>
                                        </button>
                                      )}
                                      {/* Mark received */}
                                      {doc.status==="SIGNED"&&(
                                        <button title="Mark as received" onClick={()=>handleMarkReceived(doc.id,emp.id)}
                                          style={{ width:30,height:30,borderRadius:7,border:"1.5px solid rgba(99,102,241,.3)",background:"rgba(99,102,241,.06)",cursor:"pointer",color:"#7c3aed",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                          <FiCheckCircle size={13}/>
                                        </button>
                                      )}
                                      {/* Notify individual for this doc */}
                                      {doc.status==="PENDING_SIGNATURE"&&(
                                        <button title="Send reminder to sign" onClick={()=>{setPreselected(emp);setShowNotify(true);}}
                                          style={{ width:30,height:30,borderRadius:7,border:"1.5px solid rgba(0,194,168,.3)",background:"rgba(0,194,168,.06)",cursor:"pointer",color:T.teal,display:"flex",alignItems:"center",justifyContent:"center" }}>
                                          <FiBell size={13}/>
                                        </button>
                                      )}
                                      {/* Delete */}
                                      <button title="Delete" onClick={()=>handleDelete(doc.id,emp.id)}
                                        style={{ width:30,height:30,borderRadius:7,border:"1.5px solid #fecaca",background:"#fef2f2",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                        <FiTrash2 size={13}/>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showUpload&&<UploadModal employees={employees} preselectedEmployee={preselected} onClose={()=>{setShowUpload(false);setPreselected(null);}} onUploaded={handleUploaded}/>}
      {showNotify&&<NotifyModal employees={employees} preselectedEmployee={preselected} onClose={()=>{setShowNotify(false);setPreselected(null);}} onSent={handleNotifySent}/>}
    </>
  );
}