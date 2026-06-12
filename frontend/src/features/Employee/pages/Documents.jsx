// import React, { useState, useEffect } from "react";
// import {
//   FiFile, FiDownload, FiEye, FiUpload,
//   FiCheck, FiX, FiShield,
// } from "react-icons/fi";
// import { API_BASE_URL } from "@/lib/apiClient";

// const buildAuthHeader = () => {
//   const token = localStorage.getItem("token") || "";
//   return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
// };

// const getHeaders = () => ({
//   Authorization: buildAuthHeader(),
// });

// const formatFileSize = (bytes) => {
//   if (!bytes) return "0 B";
//   const sizes = ["B", "KB", "MB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(1024));
//   return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
// };

// const BACKEND_TO_FRONTEND_MAP = {
//   TENTH_MARKSHEET:           "tenthMarksheet",
//   TWELFTH_MARKSHEET:         "twelfthMarksheet",
//   GRADUATION_MARKSHEET:      "graduationMarksheet",
//   POST_GRADUATION_MARKSHEET: "postGraduationMarksheet",
//   DEGREE_CERTIFICATE:        "degreeCertificate",
//   AADHAR_CARD:               "aadharCard",
//   PAN_CARD:                  "panCard",
//   PASSPORT_PHOTO:            "passportPhoto",
//   OFFER_LETTER:              "offerLetter",
//   EXPERIENCE_LETTER:         "experienceLetter",
// };

// const T = {
//   navy:'#0B1020', navyMid:'#374151', coral:'#8B5CF6', teal:'#06B6D4',
//   bg:'#F5F7FB', border:'#E8ECF2',
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
// .doc *{font-family:'DM Sans',sans-serif;box-sizing:border-box;}
// .doc .fd{font-family:'Sora',sans-serif;}

// .doc-card{background:#fff;border:1.5px solid ${T.border};border-radius:18px;box-shadow:0 2px 14px rgba(13,31,45,.05);}

// .doc-row{
//   display:flex;align-items:center;justify-content:space-between;gap:12px;
//   padding:13px 16px;border-radius:12px;border:1.5px solid ${T.border};
//   background:#fff;transition:all .18s;margin-bottom:8px;
// }
// .doc-row:hover{border-color:rgba(139,92,246,.3);box-shadow:0 3px 12px rgba(139,92,246,.08);}
// .doc-row:last-child{margin-bottom:0;}

// .doc-icon-wrap{width:36px;height:36px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}

// .doc-action-btn{
//   display:flex;align-items:center;justify-content:center;
//   width:32px;height:32px;border-radius:8px;border:1.5px solid;
//   cursor:pointer;background:none;transition:all .15s;
// }
// .doc-action-btn:hover{transform:scale(1.08);}

// .doc-upload-label{
//   display:inline-flex;align-items:center;gap:6px;
//   padding:7px 14px;border-radius:9px;font-size:12px;font-weight:700;
//   cursor:pointer;transition:all .18s;font-family:'DM Sans',sans-serif;
//   border:1.5px solid transparent;
// }
// .doc-upload-label:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(139,92,246,.25);}

// .doc-toast{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;border:1.5px solid;background:#fff;box-shadow:0 4px 18px rgba(0,0,0,.08);}

// @keyframes docUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
// .doc-animate{animation:docUp .35s ease both;}
// @keyframes docSpin{to{transform:rotate(360deg)}}
// .doc-spin-icon{animation:docSpin .7s linear infinite;}
// `;

// const DOCUMENT_CATEGORIES = [
//   {
//     id: "educational", label: "Academic Records",
//     icon: "🎓", description: "Certificates, marksheets and degree documents",
//     fields: [
//       { key: "tenthMarksheet",          label: "10th Grade Marksheet",             required: true  },
//       { key: "twelfthMarksheet",        label: "12th / Diploma Marksheet",         required: true  },
//       { key: "graduationMarksheet",     label: "Undergraduate Marksheet",          required: true  },
//       { key: "postGraduationMarksheet", label: "Postgraduate Marksheet",           required: false },
//       { key: "degreeCertificate",       label: "Degree / Convocation Certificate", required: true  },
//     ],
//   },
//   {
//     id: "identity", label: "Identity Verification",
//     icon: "🪪", description: "Government-issued ID documents",
//     fields: [
//       { key: "aadharCard",    label: "Aadhaar Card",        required: true },
//       { key: "panCard",       label: "PAN Card",            required: true },
//       { key: "passportPhoto", label: "Passport Size Photo", required: true },
//     ],
//   },
//   {
//     id: "employment", label: "Employment History",
//     icon: "💼", description: "Previous employment and offer records",
//     fields: [
//       { key: "offerLetter",      label: "Current Offer Letter",    required: false },
//       { key: "experienceLetter", label: "Prior Experience Letter", required: false },
//     ],
//   },
// ];

// /* ── Normalise a document from backend response ── */
// const normaliseDoc = (doc) => ({
//   id:           doc.id,
//   documentType: BACKEND_TO_FRONTEND_MAP[doc.documentType] || doc.documentType,
//   fileName:     doc.fileName,
//   // filePath is now a Cloudinary https:// URL — use it directly, no prefixing
//   fileUrl:      doc.filePath || doc.fileUrl || "",
//   fileType:     doc.fileType || "application/octet-stream",
//   uploadedAt:   doc.uploadedAt || new Date().toISOString(),
//   fileSize:     doc.fileSize || 0,
// });

// export default function Vault() {
//   const [documents, setVault] = useState([]);
//   const [uploading, setUploading] = useState({});
//   const [message,   setMessage]   = useState({ type: "", text: "" });

//   useEffect(() => { fetchVault(); }, []);

//   const showMessage = (type, text) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: "", text: "" }), 4500);
//   };

//   /* ── Fetch my documents ── */
//   const fetchVault = async () => {
//     try {
//       const res    = await fetch(`${API_BASE_URL}/api/documents/my-documents`, { headers: getHeaders() });
//       const parsed = await res.json();
//       if (!res.ok) { showMessage("error", parsed?.message || "Failed to fetch documents"); return; }
//       const docs = parsed?.data || [];
//       setVault(docs.map(normaliseDoc));
//     } catch {
//       showMessage("error", "Failed to fetch documents");
//     }
//   };

//   const getDocumentByType = (type) => documents.find(d => d.documentType === type);

//   /* ── Upload ── */
//   const handleFileChange = async (e, docType) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
//     if (!allowed.includes(file.type)) { showMessage("error", "Only PDF, JPG, JPEG, PNG allowed."); e.target.value = ""; return; }
//     if (file.size > 5 * 1024 * 1024) { showMessage("error", "Max 5MB per file."); e.target.value = ""; return; }
//     await uploadDocument(file, docType);
//     e.target.value = "";
//   };

//   const uploadDocument = async (file, documentType) => {
//     try {
//       setUploading(p => ({ ...p, [documentType]: true }));
//       const fd = new FormData();
//       fd.append("file", file);
//       fd.append("documentType", documentType);

//       const res    = await fetch(`${API_BASE_URL}/api/documents/upload`, {
//         method: "POST",
//         headers: getHeaders(), // no Content-Type — browser sets multipart boundary
//         body: fd,
//       });
//       const parsed = await res.json();
//       if (!res.ok) { showMessage("error", parsed?.message || "Upload failed"); return; }

//       const dp     = parsed?.data || parsed?.document || parsed;
//       const newDoc = normaliseDoc(dp);
//       // Override documentType with the frontend key we used
//       newDoc.documentType = BACKEND_TO_FRONTEND_MAP[dp.documentType] || documentType;

//       setVault(prev => [...prev.filter(d => d.documentType !== newDoc.documentType), newDoc]);

//       const fieldLabel = DOCUMENT_CATEGORIES.flatMap(c => c.fields).find(f => f.key === documentType)?.label || documentType;
//       showMessage("success", `${fieldLabel} uploaded successfully`);
//     } catch {
//       showMessage("error", "Upload failed.");
//     } finally {
//       setUploading(p => ({ ...p, [documentType]: false }));
//     }
//   };

//   /* ── View — open Cloudinary URL directly ── */
//   const handleView = (doc) => {
//     if (doc?.fileUrl) window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
//     else showMessage("error", "File URL not available.");
//   };

//   /* ── Download — open Cloudinary URL (browser will prompt save) ── */
//   const handleDownload = (doc) => {
//     if (!doc?.fileUrl) { showMessage("error", "File URL not available."); return; }
//     // For Cloudinary URLs we open in new tab — browser handles save
//     window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
//   };

//   /* ── Delete ── */
//   const handleDelete = async (documentType) => {
//     if (!window.confirm("Remove this document?")) return;
//     const doc = getDocumentByType(documentType);
//     if (!doc) { showMessage("error", "Document not found."); return; }
//     try {
//       const res    = await fetch(`${API_BASE_URL}/api/documents/${doc.id}`, {
//         method: "DELETE", headers: getHeaders(),
//       });
//       const parsed = await res.json();
//       if (!res.ok) { showMessage("error", parsed?.message || "Delete failed"); return; }
//       setVault(prev => prev.filter(d => d.documentType !== documentType));
//       showMessage("success", "Document removed");
//     } catch {
//       showMessage("error", "Delete failed.");
//     }
//   };

//   const uploadedCount = documents.length;
//   const totalRequired = DOCUMENT_CATEGORIES.reduce((a, c) => a + c.fields.filter(f => f.required).length, 0);
//   const completionPct = totalRequired > 0 ? Math.min(100, Math.round((uploadedCount / totalRequired) * 100)) : 0;

//   return (
//     <div className="doc" style={{ minHeight:'100vh', background:T.bg, padding:'0 0 40px' }}>
//       <style>{CSS}</style>

//       {/* HERO */}
//       <div style={{ background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`, padding:'20px 24px', position:'relative', overflow:'hidden' }}>
//         <div style={{ position:'absolute', top:-40, right:40, width:160, height:160, borderRadius:'50%', background:'rgba(139,92,246,.08)', pointerEvents:'none' }} />
//         <div style={{ position:'absolute', bottom:-20, right:200, width:90, height:90, borderRadius:'50%', background:'rgba(6,182,212,.06)', pointerEvents:'none' }} />
//         <div style={{ position:'relative' }}>
//           <p style={{ fontSize:11, fontWeight:700, color:T.coral, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:4 }}>CrewSync · Vault</p>
//           <h1 className="fd" style={{ fontSize:22, fontWeight:900, color:'#fff', margin:0 }}>My Vault</h1>
//           <p style={{ fontSize:13, color:'rgba(255,255,255,.55)', marginTop:4 }}>Upload, manage and track all your PeopleOps documents securely.</p>
//         </div>
//       </div>

//       <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:18 }}>

//         {/* TOAST */}
//         {message.text && (
//           <div className="doc-toast doc-animate" style={{ borderColor: message.type === "success" ? "#A7F3D0" : "#FECACA" }}>
//             <div style={{ width:30, height:30, borderRadius:8, background: message.type === "success" ? "#ECFDF5" : "#FEF2F2", display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
//               {message.type === "success" ? <FiCheck color="#059669" size={15}/> : <FiX color="#DC2626" size={15}/>}
//             </div>
//             <span style={{ fontSize:13, fontWeight:600, color: message.type === "success" ? "#065F46" : "#991B1B" }}>{message.text}</span>
//           </div>
//         )}

//         {/* STATS */}
//         <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }} className="doc-stats-grid doc-animate">
//           <style>{`@media(max-width:640px){.doc-stats-grid{grid-template-columns:1fr!important}}`}</style>

//           {[
//             { icon:<FiFile size={16}/>,   iconBg:'rgba(139,92,246,.1)', iconColor:T.coral, label:'Uploaded',  value:uploadedCount },
//             { icon:<FiCheck size={16}/>,  iconBg:'rgba(6,182,212,.1)',  iconColor:T.teal,  label:'Required',  value:totalRequired },
//           ].map(s => (
//             <div key={s.label} className="doc-card" style={{ padding:'16px 18px' }}>
//               <div style={{ display:'flex', alignItems:'center', gap:12 }}>
//                 <div style={{ width:36, height:36, borderRadius:10, background:s.iconBg, color:s.iconColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{s.icon}</div>
//                 <div>
//                   <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>{s.label}</p>
//                   <p className="fd" style={{ fontSize:22, fontWeight:900, color:T.navy }}>{s.value}</p>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Completion */}
//           <div className="doc-card" style={{ padding:'16px 18px' }}>
//             <div style={{ display:'flex', alignItems:'center', gap:12 }}>
//               <div style={{ width:36, height:36, borderRadius:10, background:'rgba(139,92,246,.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
//                 <FiUpload size={16} color={T.coral}/>
//               </div>
//               <div style={{ flex:1, minWidth:0 }}>
//                 <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Completion</p>
//                 <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
//                   <p className="fd" style={{ fontSize:22, fontWeight:900, color:T.navy }}>{completionPct}%</p>
//                   <div style={{ flex:1, height:5, borderRadius:4, background:T.border, overflow:'hidden', minWidth:60 }}>
//                     <div style={{ height:'100%', borderRadius:4, background:`linear-gradient(90deg,${T.coral},${T.teal})`, width:`${completionPct}%`, transition:'width .6s ease' }} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* DOCUMENT SECTIONS */}
//         {DOCUMENT_CATEGORIES.map((cat, ci) => (
//           <div key={cat.id} className="doc-card doc-animate" style={{ overflow:'hidden', animationDelay:`${ci * .06}s` }}>
//             <div style={{ padding:'14px 20px', background:'linear-gradient(90deg,#FAFBFF,#F5F7FB)', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:12 }}>
//               <span style={{ fontSize:20 }}>{cat.icon}</span>
//               <div>
//                 <p className="fd" style={{ fontSize:13, fontWeight:800, color:T.navy, marginBottom:1 }}>{cat.label}</p>
//                 <p style={{ fontSize:11, color:'#94a3b8' }}>{cat.description}</p>
//               </div>
//               <div style={{ marginLeft:'auto', padding:'4px 10px', borderRadius:999, background:`rgba(139,92,246,.08)`, border:`1px solid rgba(139,92,246,.15)`, fontSize:11, fontWeight:700, color:T.coral }}>
//                 {cat.fields.filter(f => getDocumentByType(f.key)).length}/{cat.fields.length}
//               </div>
//             </div>

//             <div style={{ padding:'16px 20px' }}>
//               {cat.fields.map(field => {
//                 const doc        = getDocumentByType(field.key);
//                 const isUploading = uploading[field.key];
//                 return (
//                   <div key={field.key} className="doc-row">
//                     {/* Status icon */}
//                     <div className="doc-icon-wrap" style={{ background: doc ? "rgba(6,182,212,.1)" : "#F1F5F9", color: doc ? T.teal : '#94a3b8', flexShrink:0 }}>
//                       {doc ? <FiCheck size={16}/> : <FiFile size={16}/>}
//                     </div>

//                     {/* Info */}
//                     <div style={{ flex:1, minWidth:0 }}>
//                       <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
//                         <span style={{ fontSize:13, fontWeight:600, color:T.navy }}>{field.label}</span>
//                         {field.required && (
//                           <span style={{ fontSize:9, fontWeight:800, padding:'2px 7px', borderRadius:999, background:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA', textTransform:'uppercase', letterSpacing:'.05em' }}>Required</span>
//                         )}
//                         {doc && (
//                           <span style={{ fontSize:9, fontWeight:800, padding:'2px 7px', borderRadius:999, background:'rgba(6,182,212,.1)', color:T.teal, border:`1px solid rgba(6,182,212,.2)`, textTransform:'uppercase', letterSpacing:'.05em' }}>✓ Uploaded</span>
//                         )}
//                       </div>
//                       {doc
//                         ? <p style={{ fontSize:11, color:'#94a3b8', marginTop:3 }}>
//                             {doc.fileName} · {formatFileSize(doc.fileSize)} · {new Date(doc.uploadedAt).toLocaleDateString()}
//                           </p>
//                         : <p style={{ fontSize:11, color:'#C4C9D4', marginTop:3 }}>No file uploaded yet</p>
//                       }
//                     </div>

//                     {/* Actions */}
//                     <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
//                       {doc ? (
//                         <>
//                           <button className="doc-action-btn" onClick={() => handleView(doc)} title="Preview"
//                             style={{ borderColor:T.border, color:'#64748b' }}
//                             onMouseEnter={e => { e.currentTarget.style.borderColor = T.navy; e.currentTarget.style.color = T.navy; }}
//                             onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = '#64748b'; }}>
//                             <FiEye size={14}/>
//                           </button>
//                           <button className="doc-action-btn" onClick={() => handleDownload(doc)} title="Download"
//                             style={{ borderColor:'rgba(6,182,212,.3)', color:T.teal, background:'rgba(6,182,212,.06)' }}
//                             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,.12)'; }}
//                             onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,182,212,.06)'; }}>
//                             <FiDownload size={14}/>
//                           </button>
//                           <button className="doc-action-btn" onClick={() => handleDelete(field.key)} title="Remove"
//                             style={{ borderColor:'#FECACA', color:'#DC2626', background:'#FEF2F2' }}
//                             onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; }}
//                             onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; }}>
//                             <FiX size={14}/>
//                           </button>
//                         </>
//                       ) : (
//                         <label className="doc-upload-label" style={{
//                           background: isUploading ? T.border : `linear-gradient(135deg,${T.coral},#FBBF24)`,
//                           color: '#fff', cursor: isUploading ? 'not-allowed' : 'pointer',
//                           opacity: isUploading ? 0.7 : 1,
//                           boxShadow: isUploading ? 'none' : '0 3px 10px rgba(139,92,246,.25)',
//                         }}>
//                           {isUploading
//                             ? <><span className="doc-spin-icon" style={{ display:'inline-block' }}>⟳</span> Uploading…</>
//                             : <><FiUpload size={13}/> Upload</>
//                           }
//                           <input type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={isUploading}
//                             onChange={e => handleFileChange(e, field.key)} style={{ display:'none' }}/>
//                         </label>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         {/* GUIDELINES */}
//         <div className="doc-card doc-animate" style={{ padding:'18px 20px', animationDelay:'.2s' }}>
//           <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
//             <div style={{ width:34, height:34, borderRadius:10, background:'rgba(6,182,212,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
//               <FiShield size={16} color={T.teal}/>
//             </div>
//             <p className="fd" style={{ fontSize:13, fontWeight:800, color:T.navy }}>Upload Guidelines</p>
//           </div>
//           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 24px' }} className="doc-guide-grid">
//             <style>{`@media(max-width:500px){.doc-guide-grid{grid-template-columns:1fr!important}}`}</style>
//             {[
//               'Accepted formats: PDF, JPG, JPEG, PNG',
//               'Maximum file size: 5 MB per document',
//               'Ensure copies are clear and fully readable',
//               'All required documents must be uploaded',
//               'Replace a document by deleting and re-uploading',
//               'Files are stored securely on Cloudinary CDN',
//             ].map((g, i) => (
//               <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:7, padding:'5px 0' }}>
//                 <span style={{ color:T.coral, fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>·</span>
//                 <span style={{ fontSize:12, color:'#64748b' }}>{g}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiFile, FiDownload, FiEye, FiUpload,
  FiCheck, FiX, FiShield, FiPenTool,
  FiClock, FiAlertCircle, FiCheckCircle, FiLock, FiRefreshCw,
} from "react-icons/fi";
import api from "@/lib/apiClient";

const getTenant = () => localStorage.getItem("tenantCode") || "";

const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const BACKEND_TO_FRONTEND = {
  TENTH_MARKSHEET:"tenthMarksheet", TWELFTH_MARKSHEET:"twelfthMarksheet",
  GRADUATION_MARKSHEET:"graduationMarksheet", POST_GRADUATION_MARKSHEET:"postGraduationMarksheet",
  DEGREE_CERTIFICATE:"degreeCertificate", AADHAR_CARD:"aadharCard",
  PAN_CARD:"panCard", PASSPORT_PHOTO:"passportPhoto",
  OFFER_LETTER:"offerLetter", EXPERIENCE_LETTER:"experienceLetter",
};

const normaliseDoc = (raw) => {
  const doc = {
    id:           raw.id,
    documentType: BACKEND_TO_FRONTEND[raw.documentType] || raw.documentType,
    fileName:     raw.fileName,
    fileUrl:      raw.filePath || raw.fileUrl || "",
    fileType:     raw.fileType || "application/octet-stream",
    uploadedAt:   raw.uploadedAt || new Date().toISOString(),
    fileSize:     raw.fileSize || 0,
    // Signed fields — persisted on backend, restored on page refresh
    signed:       !!(raw.signedFileUrl || raw.signed_file_url || raw.signed),
    signedFileUrl: raw.signedFileUrl || raw.signed_file_url || null,
    signerName:   raw.signerName || raw.signer_name || null,
    signedAt:     raw.signedAt   || raw.signed_at   || null,
  };
  if (doc.signedFileUrl) doc._signedCloudUrl = doc.signedFileUrl;
  return doc;
};

const formatSize = (bytes) => {
  if (!bytes) return "0 B";
  const s = ["B","KB","MB"]; const i = Math.floor(Math.log(bytes)/Math.log(1024));
  return `${Math.round((bytes/Math.pow(1024,i))*100)/100} ${s[i]}`;
};

const PeopleOps_DOC_LABELS = {
  OFFER_LETTER:"Offer Letter", JOINING_LETTER:"Joining Letter",
  SALARY_REVISION_LETTER:"Compensation Revision Letter", APPOINTMENT_LETTER:"Appointment Letter",
  CONFIRMATION_LETTER:"Confirmation Letter", WARNING_LETTER:"Warning Letter",
  RELIEVING_LETTER:"Relieving Letter", EXPERIENCE_CERTIFICATE:"Experience Certificate",
  NON_DISCLOSURE_AGREEMENT:"Non-Disclosure Agreement", EMPLOYMENT_CONTRACT:"Employment Contract",
  POLICY_DOCUMENT:"Playbook Document", ONBOARDING_CHECKLIST:"JoinerFlow Checklist",
  OTHER:"Other Document",
};

const DOCUMENT_CATEGORIES = [
  { id:"educational", label:"Academic Records", icon:"🎓", description:"Certificates, marksheets and degree documents",
    fields:[
      { key:"tenthMarksheet",         label:"10th Grade Marksheet",             required:true  },
      { key:"twelfthMarksheet",       label:"12th / Diploma Marksheet",         required:true  },
      { key:"graduationMarksheet",    label:"Undergraduate Marksheet",          required:true  },
      { key:"postGraduationMarksheet",label:"Postgraduate Marksheet",           required:false },
      { key:"degreeCertificate",      label:"Degree / Convocation Certificate", required:true  },
    ]},
  { id:"identity", label:"Identity Verification", icon:"🪪", description:"Government-issued ID documents",
    fields:[
      { key:"aadharCard",    label:"Aadhaar Card",        required:true },
      { key:"panCard",       label:"PAN Card",            required:true },
      { key:"passportPhoto", label:"Passport Size Photo", required:true },
    ]},
  { id:"employment", label:"Employment History", icon:"💼", description:"Previous employment and offer records",
    fields:[
      { key:"offerLetter",      label:"Current Offer Letter",    required:false },
      { key:"experienceLetter", label:"Prior Experience Letter", required:false },
    ]},
];

// ── URL helpers ───────────────────────────────────────────────────────────────
function fixUrl(url, fileType) {
  if (!url) return "";
  if ((fileType==="application/pdf"||(url||"").toLowerCase().endsWith(".pdf"))
      && url.includes("/image/upload/")) {
    return url.replace("/image/upload/", "/raw/upload/");
  }
  return url;
}
function getDocUrl(doc) {
  // Prefer signed version if available, else original
  const raw = doc?._signedCloudUrl || doc?.signedFileUrl || doc?.fileUrl || doc?.filePath || "";
  return fixUrl(raw, doc?.fileType);
}
function getOriginalUrl(doc) {
  return fixUrl(doc?.fileUrl || doc?.filePath || "", doc?.fileType);
}
function isPdfFile(doc) {
  return doc?.fileType==="application/pdf"
    ||(doc?.fileUrl||"").toLowerCase().endsWith(".pdf")
    ||(doc?.fileName||"").toLowerCase().endsWith(".pdf");
}
function getFileName(doc) {
  return doc?.fileName || doc?.originalFileName || "document";
}

// ── VIEW ──────────────────────────────────────────────────────────────────────
async function viewDocument(doc, preferSigned = true) {
  const url = preferSigned ? getDocUrl(doc) : getOriginalUrl(doc);
  if (!url) return;
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const mime = doc?.fileType || blob.type || "application/octet-stream";
    const obj  = URL.createObjectURL(new Blob([blob],{type:mime}));
    window.open(obj,"_blank");
    setTimeout(()=>URL.revokeObjectURL(obj),30000);
  } catch { window.open(url,"_blank"); }
}

// ── DOWNLOAD ──────────────────────────────────────────────────────────────────
async function downloadDocument(doc, preferSigned = true) {
  const url      = preferSigned ? getDocUrl(doc) : getOriginalUrl(doc);
  const fileName = (preferSigned && (doc?._signedCloudUrl || doc?.signedFileUrl))
    ? `signed_${getFileName(doc)}`
    : getFileName(doc);
  if (!url) return;
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const mime = doc?.fileType || blob.type || "application/octet-stream";
    const ext  = {"application/pdf":"pdf","image/jpeg":"jpg","image/jpg":"jpg","image/png":"png"}[mime] || (isPdfFile(doc)?"pdf":"bin");
    const name = fileName.includes(".") ? fileName : `${fileName}.${ext}`;
    const obj  = URL.createObjectURL(new Blob([blob],{type:mime}));
    const a    = document.createElement("a");
    a.href=obj; a.download=name;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(obj); },300);
  } catch { window.open(url,"_blank"); }
}

// ── PDF.js + jsPDF loaders ────────────────────────────────────────────────────
async function loadPdfJs() {
  if (window.pdfjsLib) return window.pdfjsLib;
  await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
  window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return window.pdfjsLib;
}
async function loadJsPDF() {
  if (window.jspdf) return window.jspdf.jsPDF;
  await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
  return window.jspdf.jsPDF;
}

// ── Stamp signature on every PDF page ────────────────────────────────────────
async function createSignedPdf(pdfUrl, sigDataUrl, signerName) {
  const [pdfjsLib, JsPDF] = await Promise.all([loadPdfJs(), loadJsPDF()]);
  const res   = await fetch(pdfUrl);
  const bytes = await res.arrayBuffer();
  const pdf   = await pdfjsLib.getDocument({data:bytes}).promise;
  const pages = [];
  for (let i=1; i<=pdf.numPages; i++) {
    const page=await pdf.getPage(i);
    const vp=page.getViewport({scale:2.0});
    const canvas=document.createElement("canvas");
    canvas.width=vp.width; canvas.height=vp.height;
    await page.render({canvasContext:canvas.getContext("2d"),viewport:vp}).promise;
    pages.push({canvas,width:vp.width,height:vp.height});
  }
  await new Promise((resolve,reject)=>{
    const sigImg=new Image();
    sigImg.onload=()=>{
      for (let pi=0; pi<pages.length; pi++) {
        const {canvas,width:W,height:H}=pages[pi];
        const ctx=canvas.getContext("2d");
        const sigArea=Math.min(W*0.30,240);
        const sw=sigArea, sh=(sigImg.naturalHeight||80)*(sigArea/(sigImg.naturalWidth||sigArea));
        const marginR=Math.max(24,W*0.025), marginB=Math.max(24,H*0.025);
        const lineH=Math.max(13,W*0.014), blockW=Math.max(sw,180);
        const blockH=sh+6+lineH+lineH+4;
        const bx=W-blockW-marginR, by=H-blockH-marginB;
        ctx.drawImage(sigImg,bx,by,sw,sh);
        ctx.strokeStyle="#374151"; ctx.lineWidth=0.8*(W/800);
        ctx.beginPath(); ctx.moveTo(bx,by+sh+4); ctx.lineTo(bx+blockW,by+sh+4); ctx.stroke();
        const fs=Math.max(9,Math.round(W*0.012));
        ctx.fillStyle="#0B1020"; ctx.font=`bold ${fs}px Arial,sans-serif`; ctx.textBaseline="top";
        ctx.fillText(signerName,bx,by+sh+8);
        ctx.fillStyle="#6b7280"; ctx.font=`${fs-1}px Arial,sans-serif`;
        ctx.fillText(new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:true}),bx,by+sh+8+lineH);
      }
      resolve();
    };
    sigImg.onerror=reject; sigImg.src=sigDataUrl;
  });
  const pxToMm=(px)=>px*25.4/(96*2.0);
  const fw=pxToMm(pages[0].width), fh=pxToMm(pages[0].height);
  const doc=new JsPDF({orientation:fw>fh?"landscape":"portrait",unit:"mm",format:[fw,fh]});
  for (let i=0; i<pages.length; i++) {
    if (i>0) { const pw=pxToMm(pages[i].width),ph=pxToMm(pages[i].height); doc.addPage([pw,ph],pw>ph?"landscape":"portrait"); }
    doc.addImage(pages[i].canvas.toDataURL("image/jpeg",0.92),"JPEG",0,0,pxToMm(pages[i].width),pxToMm(pages[i].height));
  }
  return doc.output("blob");
}

// ── Upload signed blob to Cloudinary via backend ──────────────────────────────
// Works for BOTH PeopleOps docs and My Uploads using the SAME endpoint pattern
// signerName is passed so the backend saves ALL metadata in one atomic call.
// This means signature survives page refresh even if the subsequent PATCH fails.
async function uploadSignedBlob(blob, docId, isHrDoc, tenantCode, originalFileName, signerName) {
  try {
    const fileName = `signed_${originalFileName||"document"}.pdf`;
    const file     = new File([blob], fileName, {type:"application/pdf"});
    const fd       = new FormData();
    fd.append("file", file);
    // Pass signerName so backend saves it atomically with the upload
    if (signerName) fd.append("signerName", signerName);

    const endpoint = isHrDoc
      ? `/api/signed-docs/hr/${docId}/upload`
      : `/api/signed-docs/my/${docId}/upload`;

    const extraHeaders = isHrDoc ? { "X-Tenant-Code": tenantCode } : {};

    const res  = await api.post(endpoint, fd, { headers: extraHeaders });
    const data = res.data;
    // Backend returns signedFileUrl in data.data or data directly
    return data.data?.signedFileUrl || data.signedFileUrl || null;
  } catch(e) {
    console.error("uploadSignedBlob failed:", e.message);
    throw e; // Re-throw so caller can show error to user
  }
}

// ── Save signature metadata to backend ───────────────────────────────────────
// PeopleOps DOCS:    POST  /api/hr-documents/{id}/sign
// MY UPLOADS: PATCH /api/documents/{id}/sign-status
//             (also aliased as PATCH /api/documents/{id}/sign on the backend)
async function saveSignatureToBackend(docId, isHrDoc, sigDataUrl, signerName, tenantCode, signedCloudUrl) {
  try {
    if (isHrDoc) {
      // ── PeopleOps document: POST to hr-documents sign endpoint ──────────────────
      const res = await api.post(`/api/hr-documents/${docId}/sign`, {
          signerName,
          signatureData:  sigDataUrl,
          signedFileType: "application/pdf",
          signedFileName: "signed_document.pdf",
          signedFileUrl:  signedCloudUrl || null,
        }, { headers: { "X-Tenant-Code": tenantCode } });
      const data = res.data;
      return data;
    } else {
      // ── My Uploads: PATCH /api/documents/{id}/sign-status ────────────────
      // This is the single, reliable endpoint for my-uploads sign metadata.
      const res = await api.patch(`/api/documents/${docId}/sign-status`, {
          signerName,
          signedFileUrl: signedCloudUrl || null,
          signedAt:      new Date().toISOString(),
          signed:        true,
        });
      const data = res.data;
      if (!res.status || res.status >= 400) {
        // Log clearly so developers can see what the backend returned
        console.error("sign-status failed:", res.status, data);
        throw new Error(data.message || data.error || `sign-status error ${res.status}`);
      }
      return data;
    }
  } catch(e) {
    // Re-throw so the signing modal can surface the error to the user
    console.error("saveSignatureToBackend error:", e.message);
    throw e;
  }
}

async function getUpdatedStatus(docId, isHrDoc, tenantCode) {
  try {
    if (isHrDoc) {
      const res = await api.get(`/api/hr-documents/my`, { headers: { "X-Tenant-Code": tenantCode } });
      const data = res.data;
      const doc = (data?.data||[]).find(d=>d.id===docId);
      return doc?.status;
    }
  } catch {}
  return "SIGNED";
}

// ─────────────────────────────────────────────────────────────────────────────
//  RE-SIGN VERIFICATION MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ReSignModal({ onVerified, onCancel }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleVerify = async () => {
    if (!email.trim()||!password.trim()) { setError("Both fields are required."); return; }
    setLoading(true); setError("");
    try {
      await api.post(`/api/signed-docs/verify-resign`, {email:email.trim(), password:password.trim()});
      onVerified();
    } catch(e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:3000,
      background:"rgba(13,31,45,0.85)",display:"flex",
      alignItems:"center",justifyContent:"center"}}
      onClick={e=>e.target===e.currentTarget&&onCancel()}>
      <div style={{background:"#fff",borderRadius:16,padding:28,width:380,
        boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{width:40,height:40,borderRadius:10,
            background:"rgba(139,92,246,0.1)",display:"flex",
            alignItems:"center",justifyContent:"center"}}>
            <FiLock size={18} color={T.coral}/>
          </div>
          <div>
            <h3 style={{margin:0,fontSize:15,fontWeight:800,color:T.navy}}>Verify Identity to Re-Sign</h3>
            <p style={{margin:0,fontSize:11,color:"#94a3b8"}}>Enter your credentials to unlock re-signing</p>
          </div>
        </div>
        <div style={{background:"#fff8f0",border:"1px solid #fed7aa",
          borderRadius:10,padding:"10px 14px",marginBottom:16}}>
          <p style={{fontSize:11,color:"#9a3412",fontWeight:600,margin:0,lineHeight:1.6}}>
            ⚠️ This document is already signed. Re-signing will replace the existing signature permanently.
          </p>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Your Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email address" type="email"
            style={{width:"100%",padding:"10px 14px",borderRadius:9,border:`1.5px solid ${error?"#fca5a5":"#e2e8f0"}`,fontSize:13,outline:"none",boxSizing:"border-box"}}
            onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor=error?"#fca5a5":"#e2e8f0"}
            onKeyDown={e=>e.key==="Enter"&&handleVerify()}/>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Your Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your current password" type="password"
            style={{width:"100%",padding:"10px 14px",borderRadius:9,border:`1.5px solid ${error?"#fca5a5":"#e2e8f0"}`,fontSize:13,outline:"none",boxSizing:"border-box"}}
            onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor=error?"#fca5a5":"#e2e8f0"}
            onKeyDown={e=>e.key==="Enter"&&handleVerify()}/>
        </div>
        {error&&(
          <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"9px 12px",marginBottom:14,fontSize:12,color:"#b91c1c",fontWeight:600}}>⚠ {error}</div>
        )}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:11,borderRadius:9,border:"1.5px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleVerify} disabled={loading}
            style={{flex:2,padding:11,borderRadius:9,border:"none",background:loading?"#94a3b8":`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
            {loading?"⏳ Verifying…":<><FiLock size={13}/> Verify &amp; Re-Sign</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DOCUMENT SIGNER MODAL  — works identically for PeopleOps docs AND My Uploads
// ─────────────────────────────────────────────────────────────────────────────
function DocumentSignerModal({ doc, onClose, onSigned }) {
  const canvasRef = useRef(null);
  const [drawing,       setDrawing]       = useState(false);
  const [hasDrawn,      setHasDrawn]      = useState(false);
  const [signerName,    setSignerName]    = useState("");
  const [signMode,      setSignMode]      = useState("draw");
  const [typedSig,      setTypedSig]      = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [processing,    setProcessing]    = useState(false);
  const [processMsg,    setProcessMsg]    = useState("");
  const [error,         setError]         = useState("");
  const [signedPdfBlob, setSignedPdfBlob] = useState(null);
  const [signedImgUrl,  setSignedImgUrl]  = useState(null);
  const lastPos = useRef(null);

  // Determine if this is an PeopleOps doc or a My Uploads doc
  const isHrDoc    = !!(doc.docType || doc.originalFileUrl);
  const isPdf      = isPdfFile(doc);
  const viewUrl    = getOriginalUrl(doc); // always use original for signing source
  const tenantCode = getTenant();
  const pdfViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(viewUrl)}&embedded=true`;

  useEffect(()=>{
    const c=canvasRef.current; if(!c) return;
    c.width=c.offsetWidth||460; c.height=c.offsetHeight||130;
    const ctx=c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.strokeStyle="#0B1020"; ctx.lineWidth=2.5;
    ctx.lineCap="round"; ctx.lineJoin="round";
  },[signMode]);

  const getPos=(e,c)=>{ const r=c.getBoundingClientRect(),s=e.touches?e.touches[0]:e; return{x:s.clientX-r.left,y:s.clientY-r.top}; };
  const startDraw=(e)=>{ e.preventDefault(); setDrawing(true); lastPos.current=getPos(e,canvasRef.current); };
  const draw=(e)=>{
    e.preventDefault(); if(!drawing) return;
    const c=canvasRef.current,ctx=c.getContext("2d"),pos=getPos(e,c);
    ctx.beginPath(); ctx.moveTo(lastPos.current.x,lastPos.current.y);
    ctx.lineTo(pos.x,pos.y); ctx.stroke();
    lastPos.current=pos; setHasDrawn(true);
  };
  const stopDraw=()=>setDrawing(false);
  const clearSig=()=>{
    const c=canvasRef.current; if(!c) return;
    c.getContext("2d").clearRect(0,0,c.width,c.height);
    setHasDrawn(false); setSignedPdfBlob(null); setSignedImgUrl(null);
  };

  const getSigDataUrl=()=>{
    if(signMode==="type"){
      const off=document.createElement("canvas"); off.width=500; off.height=120;
      const ctx=off.getContext("2d");
      ctx.fillStyle="#0B1020"; ctx.font="italic 52px Georgia,serif";
      ctx.textBaseline="middle"; ctx.fillText(typedSig,24,62);
      return off.toDataURL("image/png");
    }
    return canvasRef.current?canvasRef.current.toDataURL("image/png"):null;
  };

  const stampOnImage=async(sigDataUrl,name)=>{
    return new Promise((resolve,reject)=>{
      const docImg=new Image(); docImg.crossOrigin="anonymous";
      docImg.onload=()=>{
        const sigImg=new Image();
        sigImg.onload=()=>{
          const W=docImg.naturalWidth||800,H=docImg.naturalHeight||600;
          const canvas=document.createElement("canvas"); canvas.width=W; canvas.height=H;
          const ctx=canvas.getContext("2d"); ctx.drawImage(docImg,0,0,W,H);
          const sigArea=Math.min(W*0.30,240);
          const sw=sigArea,sh=(sigImg.naturalHeight||80)*(sigArea/(sigImg.naturalWidth||sigArea));
          const marginR=Math.max(24,W*0.025),marginB=Math.max(24,H*0.025);
          const lineH=Math.max(13,W*0.014),blockW=Math.max(sw,180),blockH=sh+6+lineH+lineH+4;
          const bx=W-blockW-marginR,by=H-blockH-marginB;
          ctx.drawImage(sigImg,bx,by,sw,sh);
          ctx.strokeStyle="#374151"; ctx.lineWidth=0.8;
          ctx.beginPath(); ctx.moveTo(bx,by+sh+4); ctx.lineTo(bx+blockW,by+sh+4); ctx.stroke();
          const fs=Math.max(10,Math.round(W*0.013));
          ctx.fillStyle="#0B1020"; ctx.font=`bold ${fs}px Arial,sans-serif`; ctx.textBaseline="top";
          ctx.fillText(name,bx,by+sh+8);
          ctx.fillStyle="#6b7280"; ctx.font=`${fs-1}px Arial,sans-serif`;
          ctx.fillText(new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:true}),bx,by+sh+8+lineH);
          try{resolve(canvas.toDataURL("image/png"));}catch(e){reject(e);}
        };
        sigImg.onerror=reject; sigImg.src=sigDataUrl;
      };
      docImg.onerror=reject;
      docImg.src=viewUrl+(viewUrl.includes("?")?"&":"?")+"cb="+Date.now();
    });
  };

  const handleSubmit=async()=>{
    if(!signerName.trim()){setError("Please enter your full name.");return;}
    if(signMode==="draw"&&!hasDrawn){setError("Please draw your signature.");return;}
    if(signMode==="type"&&!typedSig.trim()){setError("Please type your signature.");return;}
    setError(""); setSubmitting(true);

    const sigDataUrl=getSigDataUrl();
    let pdfBlob=null, imgUrl=null, cloudUrl=null;

    if(isPdf){
      setProcessing(true); setProcessMsg("📄 Rendering PDF pages…");
      try{
        setProcessMsg("✍️ Stamping signature on all pages…");
        pdfBlob=await createSignedPdf(viewUrl,sigDataUrl,signerName.trim());
        setSignedPdfBlob(pdfBlob);

        setProcessMsg("⬆️ Uploading signed PDF to server…");
        // Pass signerName so backend saves ALL metadata atomically in one DB call
        cloudUrl = await uploadSignedBlob(
          pdfBlob, doc.id, isHrDoc, tenantCode,
          doc.originalFileName || doc.fileName || "document",
          signerName.trim()
        );

        setProcessMsg("💾 Saving signature metadata…");
        // Save metadata — works for BOTH PeopleOps docs and My Uploads
        await saveSignatureToBackend(doc.id, isHrDoc, sigDataUrl, signerName.trim(), tenantCode, cloudUrl);

        setProcessMsg("✅ Signed and saved!");

        const updatedStatus = isHrDoc
          ? (await getUpdatedStatus(doc.id, isHrDoc, tenantCode) || "SIGNED")
          : "SIGNED";

        onSigned({
          ...doc,
          status:          updatedStatus,
          signerName:      signerName.trim(),
          signed:          true,
          signedAt:        new Date().toLocaleDateString("en-IN"),
          signedFileUrl:   cloudUrl,
          _signedCloudUrl: cloudUrl,
          _signedPdfBlob:  pdfBlob,
        });
      }catch(e){
        setError(`Signing failed: ${e.message}`);
        setSubmitting(false); setProcessing(false); return;
      }
      setProcessing(false);
    }else{
      setProcessing(true); setProcessMsg("✍️ Stamping signature…");
      try{
        imgUrl=await stampOnImage(sigDataUrl,signerName.trim());
        setSignedImgUrl(imgUrl);
        if(imgUrl){
          const imgRes = await fetch(imgUrl);
          const imgBlob = await imgRes.blob();
          cloudUrl = await uploadSignedBlob(
            imgBlob, doc.id, isHrDoc, tenantCode,
            doc.originalFileName || doc.fileName || "document",
            signerName.trim()
          );
        }
      }catch(e){console.warn("Stamp failed:",e.message);}
      setProcessing(false);
      try {
        await saveSignatureToBackend(doc.id, isHrDoc, sigDataUrl, signerName.trim(), tenantCode, cloudUrl);
      } catch(e) {
        // Non-fatal for image: show warning but still complete signing locally
        console.warn("Could not save sign metadata to server:", e.message);
      }
      onSigned({
        ...doc,
        status:          "SIGNED",
        signerName:      signerName.trim(),
        signed:          true,
        signedAt:        new Date().toLocaleDateString("en-IN"),
        signedFileUrl:   cloudUrl,
        _signedCloudUrl: cloudUrl,
        _signedImgUrl:   imgUrl,
      });
    }
    setSubmitting(false);
  };

  const downloadSignedFile=()=>{
    if(signedPdfBlob){
      const url=URL.createObjectURL(signedPdfBlob);
      const name=`signed_${getFileName(doc)}`; const a=document.createElement("a");
      a.href=url; a.download=name.endsWith(".pdf")?name:name+".pdf";
      document.body.appendChild(a); a.click();
      setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); },300);
    }else if(signedImgUrl){
      const a=document.createElement("a"); a.href=signedImgUrl;
      a.download=`signed_${getFileName(doc)}.png`; a.click();
    }
  };

  const isSignedReady=!!(signedPdfBlob||signedImgUrl);

  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(13,31,45,0.92)",display:"flex",flexDirection:"column"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.navy,padding:"12px 20px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div>
          <h2 style={{color:"#fff",fontSize:15,fontWeight:800,margin:0}}>✍️ Sign Document</h2>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:11,margin:"1px 0 0"}}>{doc.title||doc.fileName||doc.originalFileName}</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          {isSignedReady&&<button onClick={downloadSignedFile} style={{background:"#16a34a",border:"none",borderRadius:7,color:"#fff",padding:"6px 14px",cursor:"pointer",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5}}><FiDownload size={12}/> Download Signed</button>}
          <button onClick={()=>window.open(viewUrl,"_blank")} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:7,color:"#fff",padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:600}}>🔗 Original</button>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:7,color:"#fff",padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:600}}>✕ Close</button>
        </div>
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Left: document preview */}
        <div style={{flex:1,background:"#0B1020",display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <div style={{background:"#182033",padding:"6px 16px",fontSize:10,color:"#9ca3af",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>{signedPdfBlob?"✅ All pages signed — download ready":signedImgUrl?"✅ Signature stamped":processing?processMsg:isPdf?"📄 PDF — all pages will be signed":"🖼 Document image"}</span>
            {processing&&<span style={{color:T.coral,fontSize:11}}>⏳ {processMsg}</span>}
          </div>
          <div style={{flex:1,overflow:"auto",display:"flex",alignItems:(!signedPdfBlob&&!signedImgUrl&&isPdf)?"stretch":"center",justifyContent:"center",padding:(!signedPdfBlob&&!signedImgUrl&&isPdf)?0:16}}>
            {signedPdfBlob?(
              <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:20,justifyContent:"center"}}>
                <div style={{background:"#16a34a",borderRadius:12,padding:"16px 28px",textAlign:"center",boxShadow:"0 4px 20px rgba(22,163,74,0.3)"}}>
                  <div style={{fontSize:36,marginBottom:8}}>✅</div>
                  <p style={{color:"#fff",fontWeight:800,fontSize:16,margin:0}}>All Pages Signed!</p>
                  <p style={{color:"rgba(255,255,255,0.8)",fontSize:12,margin:"4px 0 0"}}>Signature stamped on every page · Saved to server</p>
                </div>
                <button onClick={downloadSignedFile} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(139,92,246,0.4)"}}>
                  <FiDownload size={16}/> Download Signed PDF
                </button>
              </div>
            ):signedImgUrl?(
              <div style={{textAlign:"center",maxWidth:"100%"}}>
                <div style={{background:"#16a34a",color:"#fff",fontSize:11,fontWeight:700,padding:"6px 14px",textAlign:"left"}}>✅ Signature stamped</div>
                <img src={signedImgUrl} alt="Signed" style={{maxWidth:"100%",display:"block"}}/>
                <button onClick={downloadSignedFile} style={{width:"100%",padding:"10px",background:"#16a34a",border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <FiDownload size={14}/> Download Signed Image
                </button>
              </div>
            ):processing?(
              <div style={{textAlign:"center",padding:40}}>
                <div style={{width:60,height:60,borderRadius:"50%",border:"4px solid rgba(139,92,246,0.2)",borderTop:`4px solid ${T.coral}`,margin:"0 auto 16px",animation:"spin 0.8s linear infinite"}}/>
                <p style={{color:"#9ca3af",fontSize:13}}>{processMsg}</p>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ):isPdf?(
              <iframe src={pdfViewerUrl} title="PDF" style={{width:"100%",height:"100%",border:"none",minHeight:400}}/>
            ):(
              <img src={viewUrl} alt="Document" style={{maxWidth:"100%",maxHeight:"100%",borderRadius:4}}/>
            )}
          </div>
        </div>

        {/* Right: sign panel */}
        <div style={{width:360,background:"#fff",display:"flex",flexDirection:"column",overflow:"auto",flexShrink:0}}>
          <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px"}}>
              <p style={{fontSize:11,color:"#92400e",fontWeight:600,margin:0,lineHeight:1.6}}>⚖️ By signing you agree to all terms. This digital signature has the same legal effect as a handwritten signature.</p>
            </div>
            {isPdf?(
              <div style={{background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:10,padding:"10px 14px"}}>
                <p style={{fontSize:11,color:"#4f46e5",fontWeight:700,margin:0,lineHeight:1.7}}>📄 Your signature will be stamped on <strong>every page</strong>. Signed PDF is saved to server — persists after refresh.</p>
              </div>
            ):(
              <div style={{background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:10,padding:"8px 12px"}}>
                <p style={{fontSize:11,color:"#0d7377",fontWeight:600,margin:0}}>🖼 Signature will be stamped at bottom-right of this document.</p>
              </div>
            )}
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Your Full Name <span style={{color:"#ef4444"}}>*</span></label>
              <input value={signerName} onChange={e=>setSignerName(e.target.value)} placeholder="Type your full legal name"
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:T.navy,outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
            </div>
            <div>
              <div style={{display:"flex",borderRadius:10,overflow:"hidden",border:"1.5px solid #e2e8f0",marginBottom:12}}>
                {[{k:"draw",l:"✏️ Draw"},{k:"type",l:"⌨️ Type"}].map(t=>(
                  <button key={t.k} onClick={()=>{setSignMode(t.k);setSignedPdfBlob(null);setSignedImgUrl(null);clearSig();}}
                    style={{flex:1,padding:"9px 0",border:"none",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.15s",background:signMode===t.k?T.coral:"#fff",color:signMode===t.k?"#fff":"#64748b"}}>
                    {t.l}
                  </button>
                ))}
              </div>
              {signMode==="draw"?(
                <div>
                  <div style={{position:"relative"}}>
                    <canvas ref={canvasRef}
                      style={{width:"100%",height:130,borderRadius:10,border:`2px solid ${hasDrawn?T.coral:"#e2e8f0"}`,background:"#fafafa",cursor:"crosshair",display:"block",touchAction:"none"}}
                      onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                      onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}/>
                    {!hasDrawn&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><p style={{fontSize:12,color:"#cbd5e1",fontStyle:"italic",margin:0}}>✍️ Draw your signature here</p></div>}
                  </div>
                  <button onClick={clearSig} style={{marginTop:6,background:"none",border:"none",fontSize:11,color:"#94a3b8",cursor:"pointer",fontWeight:600}}>↺ Clear and redraw</button>
                </div>
              ):(
                <div>
                  <input value={typedSig} onChange={e=>{setTypedSig(e.target.value);setSignedPdfBlob(null);setSignedImgUrl(null);}} placeholder="Sign here"
                    style={{width:"100%",padding:"14px",borderRadius:10,border:`2px solid ${typedSig?T.coral:"#e2e8f0"}`,fontSize:34,color:T.navy,outline:"none",boxSizing:"border-box",fontFamily:"Georgia,'Times New Roman',serif",fontStyle:"italic",background:"#fafafa"}}/>
                  <p style={{fontSize:10,color:"#94a3b8",marginTop:4}}>This text will be rendered as your signature</p>
                </div>
              )}
            </div>
            {isSignedReady&&<div style={{background:"#f0fdf4",border:"1.5px solid #bbf7d0",borderRadius:10,padding:"10px 14px"}}><p style={{fontSize:11,color:"#16a34a",fontWeight:700,margin:0}}>✅ {isPdf?"Signed PDF saved!":"Signature stamped!"} Click "Download Signed" to save a copy.</p></div>}
            {error&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#b91c1c",fontWeight:600}}>⚠ {error}</div>}
            <div style={{display:"flex",gap:10,paddingTop:4}}>
              <button onClick={onClose} style={{flex:1,padding:11,borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting||processing}
                style={{flex:2,padding:11,borderRadius:10,border:"none",background:(submitting||processing)?"#94a3b8":`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff",fontSize:13,fontWeight:700,cursor:(submitting||processing)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {processing?`⏳ ${processMsg}`:submitting?"⏳ Saving…":<><FiCheckCircle size={15}/> Sign &amp; Generate</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PeopleOps Document Card ──────────────────────────────────────────────────────────
function HrDocCard({ doc, onSign, onResign, onAcknowledge }) {
  const isSigned  = doc.status==="SIGNED"||doc.status==="ACKNOWLEDGED";
  const isPending = doc.status==="PENDING_SIGNATURE";
  const isOverdue = isPending&&doc.signByDate&&new Date(doc.signByDate)<new Date();
  const hasSignedFile = !!(doc._signedCloudUrl||doc.signedFileUrl);
  const sc = {
    PENDING_SIGNATURE:{fg:"#d97706",bg:"#fffbeb",label:"Pending Signature"},
    SIGNED:           {fg:"#16a34a",bg:"#f0fdf4",label:"Signed"},
    ACKNOWLEDGED:     {fg:T.teal,   bg:"rgba(6,182,212,0.1)",label:"Acknowledged"},
    REJECTED:         {fg:"#dc2626",bg:"#fef2f2",label:"Rejected"},
  }[doc.status]||{fg:"#64748b",bg:"#f8fafc",label:doc.status};

  return (
    <div style={{background:"#fff",borderRadius:14,marginBottom:10,
      border:isPending?`1.5px solid ${isOverdue?"#fca5a5":"#fed7aa"}`:`1.5px solid ${T.border}`,
      padding:"16px 18px",boxShadow:isPending?"0 2px 12px rgba(139,92,246,0.08)":"none"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
            <span style={{fontSize:13,fontWeight:700,color:T.navy}}>{doc.title}</span>
            <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:999,background:sc.bg,color:sc.fg,border:`1px solid ${sc.fg}22`,textTransform:"uppercase"}}>{sc.label}</span>
            {isOverdue&&<span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:999,background:"#fef2f2",color:"#dc2626",border:"1px solid #fca5a5",textTransform:"uppercase"}}>⚠ Overdue</span>}
          </div>
          <div style={{fontSize:11,color:"#94a3b8"}}>{PeopleOps_DOC_LABELS[doc.docType]||doc.docType} · {doc.originalFileName} · Sent {doc.createdAt}</div>
          {doc.notes&&<div style={{fontSize:12,color:"#475569",background:"#f8fafc",borderRadius:8,padding:"6px 10px",marginTop:4,borderLeft:"3px solid #e2e8f0"}}>📝 {doc.notes}</div>}
          {isPending&&doc.signByDate&&<div style={{fontSize:11,color:isOverdue?"#dc2626":"#d97706",fontWeight:600,marginTop:5,display:"flex",alignItems:"center",gap:5}}><FiClock size={12}/> Sign by: {doc.signByDate}</div>}
          {isSigned&&doc.signerName&&<div style={{fontSize:11,color:"#16a34a",marginTop:4,fontWeight:600}}>✅ Signed by {doc.signerName} on {doc.signedAt}</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,flexWrap:"wrap"}}>
          <button onClick={()=>viewDocument(doc)}
            style={{display:"flex",alignItems:"center",gap:4,padding:"6px 11px",borderRadius:8,
              border:`1.5px solid ${hasSignedFile?"#bbf7d0":T.border}`,
              background:hasSignedFile?"#f0fdf4":"#f8fafc",
              color:hasSignedFile?"#16a34a":"#374151",cursor:"pointer",fontSize:11,fontWeight:600}}>
            <FiEye size={13}/> {hasSignedFile?"View Signed":"View"}
          </button>
          <button onClick={()=>downloadDocument(doc)}
            style={{display:"flex",alignItems:"center",gap:4,padding:"6px 11px",borderRadius:8,
              border:"1.5px solid rgba(6,182,212,.3)",background:"rgba(6,182,212,.06)",
              color:T.teal,cursor:"pointer",fontSize:11,fontWeight:600}}>
            <FiDownload size={13}/> {hasSignedFile?"Signed":"Download"}
          </button>
          {isPending&&(
            doc.requiresSignature!==false?(
              <button onClick={()=>onSign(doc)}
                style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${T.coral},#f97316)`,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:"0 3px 10px rgba(139,92,246,0.3)"}}>
                <FiPenTool size={13}/> Sign Now
              </button>
            ):(
              <button onClick={()=>onAcknowledge(doc.id)}
                style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${T.teal},#0D9488)`,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                <FiCheckCircle size={13}/> Acknowledge
              </button>
            )
          )}
          {isSigned&&(
            <button onClick={()=>onResign(doc)}
              style={{display:"flex",alignItems:"center",gap:4,padding:"6px 11px",borderRadius:8,
                border:"1.5px solid #e2e8f0",background:"#f8fafc",
                color:"#64748b",cursor:"pointer",fontSize:11,fontWeight:600}}>
              <FiRefreshCw size={12}/> Re-sign
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.doc *{font-family:'DM Sans',sans-serif;box-sizing:border-box;}
.doc .fd{font-family:'Sora',sans-serif;}
.doc-card{background:#fff;border:1.5px solid #E8ECF2;border-radius:18px;box-shadow:0 2px 14px rgba(13,31,45,.05);}
.doc-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 16px;border-radius:12px;border:1.5px solid #E8ECF2;background:#fff;transition:all .18s;margin-bottom:8px;}
.doc-row:hover{border-color:rgba(139,92,246,.3);box-shadow:0 3px 12px rgba(139,92,246,.08);}
.doc-row:last-child{margin-bottom:0;}
.doc-icon-wrap{width:36px;height:36px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.doc-action-btn{display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:8px;border:1.5px solid;cursor:pointer;background:none;transition:all .15s;font-size:11px;font-weight:600;font-family:'DM Sans',sans-serif;}
.doc-upload-label{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;transition:all .18s;font-family:'DM Sans',sans-serif;border:none;}
.doc-upload-label:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(139,92,246,.25);}
.doc-toast{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;border:1.5px solid;background:#fff;box-shadow:0 4px 18px rgba(0,0,0,.08);}
@keyframes docUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.doc-animate{animation:docUp .35s ease both;}
@keyframes docSpin{to{transform:rotate(360deg)}}
.doc-spin-icon{animation:docSpin .7s linear infinite;}
.tab-btn{padding:10px 20px;border:none;border-bottom:2px solid transparent;background:none;font-size:13px;font-weight:700;cursor:pointer;color:#94a3b8;transition:all .15s;font-family:'DM Sans',sans-serif;}
.tab-btn.active{color:#8B5CF6;border-bottom-color:#8B5CF6;}
`;

export default function Vault() {
  const [activeTab,    setActiveTab]    = useState("hr");
  const [documents,    setVault]    = useState([]);
  const [hrDocs,       setHrDocs]       = useState([]);
  const [uploading,    setUploading]    = useState({});
  const [message,      setMessage]      = useState({type:"",text:""});
  // Single modal state — prevents re-sign flicker caused by two racing setState calls.
  // mode: null | "signing" | "resign_verify"
  const [modal, setModal] = useState({ mode: null, doc: null });
  const tenantCode = getTenant();

  useEffect(()=>{ fetchVault(); fetchHrVault(); },[]);

  const showMsg=(type,text)=>{ setMessage({type,text}); setTimeout(()=>setMessage({type:"",text:""}),5000); };

  // ── Fetch My Uploads — normaliseDoc now restores signed fields ──
  const fetchVault=async()=>{
    try {
      const res=await api.get(`/api/documents/my-documents`);
      const p=res.data;
      setVault((p?.data||[]).map(normaliseDoc));
    } catch {showMsg("error","Failed to fetch documents");}
  };

  const fetchHrVault=async()=>{
    try {
      const res=await api.get(`/api/hr-documents/my`, { headers: { "X-Tenant-Code": tenantCode } });
      const p=res.data;
      setHrDocs(p?.data||[]);
    } catch {}
  };

  const getDocByType=t=>documents.find(d=>d.documentType===t);

  const handleFileChange=async(e,docType)=>{
    const file=e.target.files?.[0]; if(!file) return;
    if(!["application/pdf","image/jpeg","image/jpg","image/png"].includes(file.type)){showMsg("error","Only PDF, JPG, PNG allowed.");e.target.value="";return;}
    if(file.size>5*1024*1024){showMsg("error","Max 5MB.");e.target.value="";return;}
    setUploading(p=>({...p,[docType]:true}));
    try {
      const fd=new FormData(); fd.append("file",file); fd.append("documentType",docType);
      const res=await api.post(`/api/documents/upload`, fd);
      const p=res.data;
      const newDoc=normaliseDoc(p?.data||p?.document||p); newDoc.documentType=docType;
      setVault(prev=>[...prev.filter(d=>d.documentType!==newDoc.documentType),newDoc]);
      showMsg("success",`${DOCUMENT_CATEGORIES.flatMap(c=>c.fields).find(f=>f.key===docType)?.label||docType} uploaded`);
    } catch {showMsg("error","Upload failed.");}
    finally {setUploading(p=>({...p,[docType]:false})); e.target.value="";}
  };

  const handleDelete=async(documentType)=>{
    if(!window.confirm("Remove this document?")) return;
    const doc=getDocByType(documentType); if(!doc) return;
    try {
      await api.delete(`/api/documents/${doc.id}`);
      setVault(prev=>prev.filter(d=>d.documentType!==documentType));
      showMsg("success","Document removed");
    } catch {showMsg("error","Delete failed.");}
  };

  // ── Called when DocumentSignerModal completes signing ───────────────────────
  const handleSigned=useCallback((signedData)=>{
    const isHr = !!(signedData.docType || signedData.originalFileUrl);
    if(isHr){
      setHrDocs(prev=>prev.map(d=>d.id===signedData.id
        ?{...d,
          status:        signedData.status||"SIGNED",
          signerName:    signedData.signerName,
          signedAt:      signedData.signedAt||new Date().toLocaleDateString("en-IN"),
          signedFileUrl: signedData.signedFileUrl||signedData._signedCloudUrl||d.signedFileUrl,
          _signedCloudUrl:signedData._signedCloudUrl||null,
        }:d));
      setTimeout(fetchHrVault, 800);
    } else {
      // MY UPLOADS — update with full signed info
      setVault(prev=>prev.map(d=>d.id===signedData.id
        ?{...d,
          signed:        true,
          signerName:    signedData.signerName,
          signedAt:      signedData.signedAt||new Date().toLocaleDateString("en-IN"),
          signedFileUrl: signedData.signedFileUrl||signedData._signedCloudUrl||d.signedFileUrl,
          _signedCloudUrl:signedData._signedCloudUrl||null,
          _signedPdfBlob: signedData._signedPdfBlob||null,
          _signedImgUrl:  signedData._signedImgUrl||null,
        }:d));
      // Re-fetch to pick up persisted signedFileUrl from backend
      setTimeout(fetchVault, 1000);
    }
    setModal({ mode: null, doc: null });
    showMsg("success","✅ Document signed and saved — signature persists after refresh.");
  },[tenantCode]);

  const handleAcknowledge=async(docId)=>{
    try {
      await api.post(`/api/hr-documents/${docId}/acknowledge`, {}, { headers: { "X-Tenant-Code": tenantCode } });
      await fetchHrVault();
      showMsg("success","Document acknowledged");
    } catch {showMsg("error","Failed to acknowledge");}
  };

  // Open re-sign verify modal
  const handleResignRequest = (doc) => { setModal({ mode: "resign_verify", doc }); };
  // Verified — ONE atomic state update: mode->signing, keep same doc. No flicker.
  const handleResignVerified = () => { setModal(prev => ({ mode: "signing", doc: prev.doc })); };
  // Cancel
  const handleResignCancel = () => { setModal({ mode: null, doc: null }); };
  // First-time sign
  const openSigning = (doc) => { setModal({ mode: "signing", doc }); };

  const uploadedCount=documents.length;
  const totalRequired=DOCUMENT_CATEGORIES.reduce((a,c)=>a+c.fields.filter(f=>f.required).length,0);
  const completionPct=totalRequired>0?Math.min(100,Math.round((uploadedCount/totalRequired)*100)):0;
  const pendingHr=hrDocs.filter(d=>d.status==="PENDING_SIGNATURE").length;

  return (
    <div className="doc" style={{minHeight:"100vh",background:T.bg,padding:"0 0 40px"}}>
      <style>{CSS}</style>

      <div style={{background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`,padding:"20px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:40,width:160,height:160,borderRadius:"50%",background:"rgba(139,92,246,.08)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>CrewSync · Vault</p>
          <h1 className="fd" style={{fontSize:22,fontWeight:900,color:"#fff",margin:0}}>My Vault</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,.55)",marginTop:4}}>Upload, view, download and sign your documents.</p>
        </div>
      </div>

      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}}>
        {message.text&&(
          <div className="doc-toast doc-animate" style={{borderColor:message.type==="success"?"#A7F3D0":"#FECACA"}}>
            <div style={{width:30,height:30,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:message.type==="success"?"#ECFDF5":"#FEF2F2"}}>
              {message.type==="success"?<FiCheck color="#059669" size={15}/>:<FiX color="#DC2626" size={15}/>}
            </div>
            <span style={{fontSize:13,fontWeight:600,color:message.type==="success"?"#065F46":"#991B1B"}}>{message.text}</span>
          </div>
        )}

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
          {[
            {label:"PeopleOps Docs",val:hrDocs.length,color:T.coral,bg:"rgba(139,92,246,.08)",icon:<FiFile size={16}/>},
            {label:"Pending Signature",val:pendingHr,color:"#f59e0b",bg:"rgba(245,158,11,.08)",icon:<FiPenTool size={16}/>},
            {label:"My Uploads",val:uploadedCount,color:T.teal,bg:"rgba(6,182,212,.08)",icon:<FiUpload size={16}/>},
            {label:"Completion",val:`${completionPct}%`,color:"#6366f1",bg:"rgba(99,102,241,.08)",icon:<FiCheckCircle size={16}/>},
          ].map(s=>(
            <div key={s.label} className="doc-card" style={{padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:s.bg,color:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s.icon}</div>
                <div>
                  <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".08em",marginBottom:2}}>{s.label}</p>
                  <p className="fd" style={{fontSize:20,fontWeight:900,color:T.navy,margin:0}}>{s.val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{borderBottom:"2px solid #f1f5f9",display:"flex"}}>
          <button className={`tab-btn ${activeTab==="hr"?"active":""}`} onClick={()=>setActiveTab("hr")}>
            📋 PeopleOps Vault
            {pendingHr>0&&<span style={{marginLeft:7,background:T.coral,color:"#fff",fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:999}}>{pendingHr}</span>}
          </button>
          <button className={`tab-btn ${activeTab==="my"?"active":""}`} onClick={()=>setActiveTab("my")}>
            📁 My Uploads
          </button>
        </div>

        {/* PeopleOps Vault Tab */}
        {activeTab==="hr"&&(
          <div className="doc-animate">
            {hrDocs.length===0?(
              <div className="doc-card" style={{padding:"48px 24px",textAlign:"center"}}>
                <FiFile size={40} color="#d1d5db" style={{marginBottom:12}}/>
                <p style={{fontSize:14,fontWeight:600,color:"#6b7280",margin:"0 0 6px"}}>No PeopleOps documents yet</p>
                <p style={{fontSize:12,color:"#9ca3af",margin:0}}>Your People team will send documents here.</p>
              </div>
            ):(
              <>
                {pendingHr>0&&(
                  <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                    <FiAlertCircle color="#d97706" size={18}/>
                    <p style={{fontSize:13,fontWeight:600,color:"#92400e",margin:0}}>You have <strong>{pendingHr}</strong> document{pendingHr>1?"s":""} awaiting your signature.</p>
                  </div>
                )}
                {hrDocs.map(doc=>(
                  <HrDocCard key={doc.id} doc={doc}
                    onSign={openSigning}
                    onResign={handleResignRequest}
                    onAcknowledge={handleAcknowledge}/>
                ))}
              </>
            )}
          </div>
        )}

        {/* My Uploads Tab */}
        {activeTab==="my"&&(
          <div className="doc-animate">
            <div className="doc-card" style={{padding:"14px 18px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:700,color:T.navy}}>Profile Completion</span>
                <span style={{fontSize:12,fontWeight:700,color:T.coral}}>{uploadedCount} / {totalRequired} required docs</span>
              </div>
              <div style={{height:6,background:"#f1f5f9",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${T.coral},${T.teal})`,width:`${completionPct}%`,transition:"width 0.4s ease"}}/>
              </div>
            </div>

            {DOCUMENT_CATEGORIES.map((cat,ci)=>(
              <div key={cat.id} className="doc-card doc-animate" style={{overflow:"hidden",animationDelay:`${ci*.06}s`,marginBottom:14}}>
                <div style={{padding:"14px 20px",background:"linear-gradient(90deg,#FAFBFF,#F5F7FB)",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:20}}>{cat.icon}</span>
                  <div style={{flex:1}}>
                    <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy,marginBottom:1}}>{cat.label}</p>
                    <p style={{fontSize:11,color:"#94a3b8"}}>{cat.description}</p>
                  </div>
                  <div style={{padding:"4px 10px",borderRadius:999,background:"rgba(139,92,246,.08)",border:"1px solid rgba(139,92,246,.15)",fontSize:11,fontWeight:700,color:T.coral}}>
                    {cat.fields.filter(f=>getDocByType(f.key)).length}/{cat.fields.length}
                  </div>
                </div>
                <div style={{padding:"16px 20px"}}>
                  {cat.fields.map(field=>{
                    const doc=getDocByType(field.key); const isUpl=uploading[field.key];
                    const hasSignedVersion=!!(doc?._signedCloudUrl||doc?.signedFileUrl);
                    return (
                      <div key={field.key} className="doc-row">
                        <div className="doc-icon-wrap" style={{background:doc?"rgba(6,182,212,.1)":"#F1F5F9",color:doc?T.teal:"#94a3b8"}}>
                          {doc?<FiCheck size={16}/>:<FiFile size={16}/>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                            <span style={{fontSize:13,fontWeight:600,color:T.navy}}>{field.label}</span>
                            {field.required&&<span style={{fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:999,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",textTransform:"uppercase"}}>Required</span>}
                            {doc&&<span style={{fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:999,background:"rgba(6,182,212,.1)",color:T.teal,border:`1px solid rgba(6,182,212,.2)`,textTransform:"uppercase"}}>✓ Uploaded</span>}
                            {doc?.signed&&<span style={{fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:999,background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",textTransform:"uppercase"}}>✍ Signed</span>}
                          </div>
                          {doc
                            ?<p style={{fontSize:11,color:"#94a3b8",marginTop:2}}>
                                {doc.fileName} · {formatSize(doc.fileSize)} · {new Date(doc.uploadedAt).toLocaleDateString()}
                                {doc.signerName&&<span style={{color:"#16a34a",fontWeight:600}}> · Signed by {doc.signerName}</span>}
                              </p>
                            :<p style={{fontSize:11,color:"#C4C9D4",marginTop:2}}>No file uploaded yet</p>
                          }
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                          {doc?(
                            <>
                              {/* View — shows signed version if available */}
                              <button className="doc-action-btn"
                                onClick={()=>viewDocument(doc, true)}
                                style={{borderColor:hasSignedVersion?"#bbf7d0":T.border,color:hasSignedVersion?"#16a34a":"#374151",background:hasSignedVersion?"#f0fdf4":"none"}}>
                                <FiEye size={13}/> {hasSignedVersion?"View Signed":"View"}
                              </button>
                              {/* Download — downloads signed version if available */}
                              <button className="doc-action-btn"
                                onClick={()=>downloadDocument(doc, true)}
                                style={{borderColor:"rgba(6,182,212,.3)",color:T.teal,background:"rgba(6,182,212,.05)"}}>
                                <FiDownload size={13}/> {hasSignedVersion?"Signed":"Download"}
                              </button>
                              {/* Sign / Re-sign */}
                              {doc.signed?(
                                <button className="doc-action-btn"
                                  onClick={()=>handleResignRequest(doc)}
                                  style={{borderColor:"rgba(139,92,246,.3)",color:T.coral,background:"rgba(139,92,246,.05)"}}>
                                  <FiRefreshCw size={13}/> Re-sign
                                </button>
                              ):(
                                <button className="doc-action-btn"
                                  onClick={()=>openSigning(doc)}
                                  style={{borderColor:"rgba(139,92,246,.3)",color:T.coral,background:"rgba(139,92,246,.05)"}}>
                                  <FiPenTool size={13}/> Sign
                                </button>
                              )}
                              <button className="doc-action-btn"
                                onClick={()=>handleDelete(field.key)}
                                style={{borderColor:"#FECACA",color:"#DC2626",background:"#FEF2F2"}}>
                                <FiX size={13}/>
                              </button>
                            </>
                          ):(
                            <label className="doc-upload-label"
                              style={{background:isUpl?"#94a3b8":`linear-gradient(135deg,${T.coral},#FBBF24)`,color:"#fff",cursor:isUpl?"not-allowed":"pointer",opacity:isUpl?0.7:1}}>
                              {isUpl?<><span className="doc-spin-icon" style={{display:"inline-block"}}>⟳</span> Uploading…</>:<><FiUpload size={13}/> Upload</>}
                              <input type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={isUpl} onChange={e=>handleFileChange(e,field.key)} style={{display:"none"}}/>
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign modal — only when mode is "signing" AND doc is set */}
      {modal.mode === "signing" && modal.doc && (
        <DocumentSignerModal
          doc={modal.doc}
          onClose={() => setModal({ mode: null, doc: null })}
          onSigned={handleSigned}
        />
      )}

      {/* Re-sign verify modal — single atomic transition to "signing", no flicker */}
      {modal.mode === "resign_verify" && (
        <ReSignModal
          onVerified={handleResignVerified}
          onCancel={handleResignCancel}
        />
      )}
    </div>
  );
}