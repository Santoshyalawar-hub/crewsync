import React, { useState } from "react";
import api from "@/lib/apiClient";

/* ── CrewSync design tokens ── */
const T = {
  navy:"#0B1020", navyMid:"#374151", coral:"#8B5CF6", teal:"#06B6D4",
  bg:"#F5F7FB", border:"#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.rb { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.rb .fd { font-family:'Sora',sans-serif; }
.rb-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.rb-sec { padding:20px 22px; border-bottom:1.5px solid ${T.border}; }
.rb-sec:last-child { border-bottom:none; }
.rb-sec-head { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.rb-sec-ico { width:30px; height:30px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }

.rb-label { display:block; font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.07em; margin-bottom:5px; }
.rb-req { color:${T.coral}; }

.rb-input {
  width:100%; border:1.5px solid ${T.border}; border-radius:10px;
  padding:9px 12px; font-size:13px; font-family:'DM Sans',sans-serif;
  color:${T.navy}; outline:none; transition:border-color .15s; background:#fff; box-sizing:border-box;
}
.rb-input:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
.rb-input.err { border-color:#EF4444; }
.rb-err { font-size:11px; color:#EF4444; margin-top:4px; }

/* radio/checkbox cards */
.rb-radio { border:1.5px solid ${T.border}; border-radius:10px; padding:9px 13px; cursor:pointer; transition:all .15s; display:flex; align-items:center; gap:9px; font-size:13px; font-family:'DM Sans',sans-serif; color:${T.navy}; background:#fff; }
.rb-radio:hover { border-color:rgba(139,92,246,.3); background:#FFFAF8; }
.rb-radio.selected { border-color:${T.coral}; background:rgba(139,92,246,.05); }

/* file input */
.rb-file { border:1.5px dashed ${T.border}; border-radius:10px; padding:10px 12px; font-size:12px; color:#64748b; cursor:pointer; transition:border-color .15s; background:#FAFBFF; width:100%; box-sizing:border-box; }
.rb-file:hover { border-color:${T.coral}; }

/* action buttons */
.rb-btn-primary { padding:10px 24px; border-radius:11px; border:none; background:linear-gradient(135deg,${T.coral},#FBBF24); color:#fff; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; box-shadow:0 4px 14px rgba(139,92,246,.3); transition:all .15s; }
.rb-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
.rb-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(139,92,246,.35); }
.rb-btn-ghost { padding:10px 20px; border-radius:11px; border:1.5px solid ${T.border}; background:#fff; color:#64748b; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
.rb-btn-ghost:hover:not(:disabled) { border-color:${T.coral}; color:${T.coral}; }

@keyframes rbUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.rb-in { animation:rbUp .35s ease both; }

.rb-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.rb-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.rb-grid-2-full { grid-column:1/-1; }
@media(max-width:640px){
  .rb-grid-2, .rb-grid-3 { grid-template-columns:1fr !important; }
  .rb-grid-2-full { grid-column:auto; }
}
`;

const REIMB_TYPES = ["Travel","Food","Medical","Office Supplies","Client Meeting","Internet/Phone","Miscellaneous"];
const PAYMENT_MODES = ["Bank Transfer","Compensation Adjustment"];
const DEPARTMENTS = ["IT","PeopleOps","MoneyOps","Marketing","Other"];

const SECTIONS = [
  { emoji:"👤", label:"Staff Details",          accent:T.coral  },
  { emoji:"🏷️", label:"Expense Category",        accent:"#6366F1" },
  { emoji:"🧾", label:"Expense Details",          accent:T.teal   },
  { emoji:"📎", label:"CareDesking Vault",     accent:"#D97706" },
  { emoji:"💳", label:"Reimbursement Method",     accent:"#A855F7" },
  { emoji:"📝", label:"Claim Justification",      accent:T.coral  },
  { emoji:"📌", label:"Additional Information",   accent:"#64748b" },
  { emoji:"✅", label:"Declaration",              accent:T.teal   },
];

const INIT_FORM = {
  employeeName:localStorage.getItem("employeeName") || localStorage.getItem("fullName") || "",
  employeeId:localStorage.getItem("employeeId") || "",
  department:localStorage.getItem("department") || "",
  designation:localStorage.getItem("position") || "",
  requestDate:new Date().toISOString().slice(0,10),
  reimbursementType:"",expenseTitle:"",expenseDescription:"",expenseDate:"",expenseAmount:"",
  paymentMode:"",bankDetails:"",claimReason:"",projectName:"",managerName:"",
  travelDistance:"",gstNumber:"",declaration:false,
};

export default function ClaimsDesk() {
  const [formData, setFormData] = useState(INIT_FORM);
  const [files, setFiles] = useState({ receipt:null, additionalProof:[] });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(p=>({...p,[name]:type==="checkbox"?checked:value}));
    setErrors(p=>({...p,[name]:""}));
  };

  const handleFileChange = e => {
    const { name, files:f } = e.target;
    setFiles(p=>({...p,[name]:name==="additionalProof"?Array.from(f):f[0]||null}));
  };

  const validate = () => {
    const e={};
    if(!formData.employeeName.trim()) e.employeeName="Person name is required.";
    if(!formData.employeeId.trim())   e.employeeId="Person ID is required.";
    if(!formData.department)          e.department="Department is required.";
    if(!formData.designation.trim())  e.designation="Designation is required.";
    if(!formData.requestDate)         e.requestDate="Date of request is required.";
    if(!formData.reimbursementType)   e.reimbursementType="Select a reimbursement type.";
    if(!formData.expenseTitle.trim()) e.expenseTitle="Expense title is required.";
    if(!formData.expenseDescription.trim()) e.expenseDescription="Expense description is required.";
    if(!formData.expenseDate)         e.expenseDate="Expense date is required.";
    if(!formData.expenseAmount)       e.expenseAmount="Expense amount is required.";
    if(!files.receipt)                e.receipt="Upload at least one bill/receipt.";
    if(!formData.paymentMode)         e.paymentMode="Preferred reimbursement mode is required.";
    if(!formData.claimReason.trim())  e.claimReason="Reason for claim is required.";
    if(!formData.declaration)         e.declaration="You must confirm the declaration.";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleReset = ({ keepStatus = false } = {}) => {
    setFormData(INIT_FORM);
    setFiles({receipt:null,additionalProof:[]});
    setErrors({});
    if (!keepStatus) setSubmitStatus(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitStatus(null);
    if(!validate()) return;
    setSubmitting(true);
    try {
      const description = [
        formData.expenseTitle && `Title: ${formData.expenseTitle}`,
        formData.expenseDescription && `Expense: ${formData.expenseDescription}`,
        formData.claimReason && `Reason: ${formData.claimReason}`,
        formData.paymentMode && `Payment Mode: ${formData.paymentMode}`,
        formData.department && `Department: ${formData.department}`,
        formData.designation && `Designation: ${formData.designation}`,
        formData.projectName && `Project: ${formData.projectName}`,
        formData.managerName && `Manager: ${formData.managerName}`,
        formData.bankDetails && `Bank Details: ${formData.bankDetails}`,
        formData.travelDistance && `Travel Distance: ${formData.travelDistance} km`,
        formData.gstNumber && `GST Number: ${formData.gstNumber}`,
        files.receipt?.name && `Receipt: ${files.receipt.name}`,
        files.additionalProof?.length ? `Additional Proofs: ${files.additionalProof.map(f=>f.name).join(", ")}` : "",
      ].filter(Boolean).join("\n");

      const payload = {
        reimbursementType: formData.reimbursementType,
        amount: Number(formData.expenseAmount || 0),
        description,
        expenseDate: formData.expenseDate,
      };

      await api.post(`/api/reimbursements`, payload);
      setSubmitStatus("success");
      handleReset({ keepStatus: true });
    } catch(err){
      console.error(err);
      setSubmitStatus("error");
    } finally { setSubmitting(false); }
  };

  const Field = ({label,required,error,children})=>(
    <div>
      <label className="rb-label">{label}{required&&<span className="rb-req"> *</span>}</label>
      {children}
      {error&&<p className="rb-err">{error}</p>}
    </div>
  );

  return (
    <div className="rb" style={{padding:"0 0 56px"}}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,padding:"22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:60,width:180,height:180,borderRadius:"50%",background:"rgba(139,92,246,.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-30,right:260,width:100,height:100,borderRadius:"50%",background:"rgba(6,182,212,.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.coral,textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>CrewSync · MoneyOps</p>
          <h1 className="fd" style={{fontSize:23,fontWeight:900,color:"#fff",margin:0}}>ClaimsDesk</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>Submit a new expense claim for review and approval.</p>
        </div>
      </div>

      <div style={{padding:"22px 26px"}}>
        {submitStatus==="success"&&(
          <div className="rb-in" style={{marginBottom:18,padding:"14px 18px",borderRadius:12,background:"rgba(6,182,212,.08)",border:`1.5px solid rgba(6,182,212,.25)`,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>✅</span>
            <div>
              <p className="fd" style={{fontSize:13,fontWeight:800,color:T.navy}}>Request submitted!</p>
              <p style={{fontSize:12,color:"#475569"}}>Your reimbursement claim has been sent for review.</p>
            </div>
          </div>
        )}
        {submitStatus==="error"&&(
          <div className="rb-in" style={{marginBottom:18,padding:"14px 18px",borderRadius:12,background:"#FEF2F2",border:"1.5px solid #FECACA",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>⚠️</span>
            <p style={{fontSize:13,color:"#991B1B"}}>Something went wrong. Please try again.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="rb-card rb-in">

            {/* ── 1. STAFF DETAILS ── */}
            <div className="rb-sec">
              <div className="rb-sec-head">
                <div className="rb-sec-ico" style={{background:"rgba(139,92,246,.1)"}}>👤</div>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:T.coral}}>1 &nbsp;·&nbsp; Staff Details</p>
              </div>
              <div className="rb-grid-2">
                <Field label="Person Name" required error={errors.employeeName}>
                  <input name="employeeName" value={formData.employeeName} onChange={handleChange} placeholder="Enter full name" className={`rb-input${errors.employeeName?" err":""}`}/>
                </Field>
                <Field label="Person ID" required error={errors.employeeId}>
                  <input name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="EMP001" className={`rb-input${errors.employeeId?" err":""}`}/>
                </Field>
                <Field label="Department" required error={errors.department}>
                  <select name="department" value={formData.department} onChange={handleChange} className={`rb-input${errors.department?" err":""}`}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Designation" required error={errors.designation}>
                  <input name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Software Engineer" className={`rb-input${errors.designation?" err":""}`}/>
                </Field>
                <Field label="Date of Request" required error={errors.requestDate}>
                  <input type="date" name="requestDate" value={formData.requestDate} onChange={handleChange} className={`rb-input${errors.requestDate?" err":""}`}/>
                </Field>
              </div>
            </div>

            {/* ── 2. EXPENSE CATEGORY ── */}
            <div className="rb-sec">
              <div className="rb-sec-head">
                <div className="rb-sec-ico" style={{background:"rgba(99,102,241,.1)"}}>🏷️</div>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:"#6366F1"}}>2 &nbsp;·&nbsp; Expense Category <span style={{color:T.coral}}>*</span></p>
              </div>
              <div className="rb-grid-3">
                {REIMB_TYPES.map(type=>(
                  <label key={type} className={`rb-radio${formData.reimbursementType===type?" selected":""}`}>
                    <input type="radio" name="reimbursementType" value={type} checked={formData.reimbursementType===type} onChange={handleChange} style={{accentColor:T.coral,width:14,height:14,flexShrink:0}}/>
                    {type}
                  </label>
                ))}
              </div>
              {errors.reimbursementType&&<p className="rb-err" style={{marginTop:8}}>{errors.reimbursementType}</p>}
            </div>

            {/* ── 3. EXPENSE DETAILS ── */}
            <div className="rb-sec">
              <div className="rb-sec-head">
                <div className="rb-sec-ico" style={{background:"rgba(6,182,212,.1)"}}>🧾</div>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:T.teal}}>3 &nbsp;·&nbsp; Expense Details</p>
              </div>
              <div className="rb-grid-2">
                <div className="rb-grid-2-full">
                  <Field label="Expense Title" required error={errors.expenseTitle}>
                    <input name="expenseTitle" value={formData.expenseTitle} onChange={handleChange} placeholder="e.g. Client meeting lunch, Taxi to client site" className={`rb-input${errors.expenseTitle?" err":""}`}/>
                  </Field>
                </div>
                <div className="rb-grid-2-full">
                  <Field label="Why did you spend this? (brief explanation)" required error={errors.expenseDescription}>
                    <textarea rows={3} name="expenseDescription" value={formData.expenseDescription} onChange={handleChange} placeholder="Explain the purpose of this expense…" className={`rb-input${errors.expenseDescription?" err":""}`} style={{resize:"none"}}/>
                  </Field>
                </div>
                <Field label="Expense Date" required error={errors.expenseDate}>
                  <input type="date" name="expenseDate" value={formData.expenseDate} onChange={handleChange} className={`rb-input${errors.expenseDate?" err":""}`}/>
                </Field>
                <Field label="Amount (₹)" required error={errors.expenseAmount}>
                  <input type="number" name="expenseAmount" value={formData.expenseAmount} onChange={handleChange} placeholder="Enter amount" min="0" className={`rb-input${errors.expenseAmount?" err":""}`}/>
                </Field>
              </div>
            </div>

            {/* ── 4. DOCUMENTS ── */}
            <div className="rb-sec">
              <div className="rb-sec-head">
                <div className="rb-sec-ico" style={{background:"rgba(217,119,6,.1)"}}>📎</div>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:"#D97706"}}>4 &nbsp;·&nbsp; CareDesking Vault</p>
              </div>
              <div className="rb-grid-2">
                <Field label="Primary bill / receipt (PDF, JPG, PNG)" required error={errors.receipt}>
                  <input type="file" name="receipt" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="rb-file"/>
                  {files.receipt&&<p style={{fontSize:11,color:T.teal,marginTop:4}}>📄 {files.receipt.name}</p>}
                </Field>
                <Field label="Additional proof (tickets, invoices — optional)">
                  <input type="file" name="additionalProof" multiple onChange={handleFileChange} className="rb-file"/>
                  {files.additionalProof?.length>0&&(
                    <p style={{fontSize:11,color:T.teal,marginTop:4}}>📄 {files.additionalProof.length} file{files.additionalProof.length!==1?"s":""} selected</p>
                  )}
                </Field>
              </div>
            </div>

            {/* ── 5. PAYMENT METHOD ── */}
            <div className="rb-sec">
              <div className="rb-sec-head">
                <div className="rb-sec-ico" style={{background:"rgba(124,58,237,.1)"}}>💳</div>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:"#A855F7"}}>5 &nbsp;·&nbsp; Reimbursement Method</p>
              </div>
              <div className="rb-grid-2" style={{marginBottom:14}}>
                {PAYMENT_MODES.map(mode=>(
                  <label key={mode} className={`rb-radio${formData.paymentMode===mode?" selected":""}`}>
                    <input type="radio" name="paymentMode" value={mode} checked={formData.paymentMode===mode} onChange={handleChange} style={{accentColor:T.coral,width:14,height:14,flexShrink:0}}/>
                    {mode}
                  </label>
                ))}
              </div>
              {errors.paymentMode&&<p className="rb-err">{errors.paymentMode}</p>}
              <Field label="Bank details (if requested by company)">
                <textarea rows={2} name="bankDetails" value={formData.bankDetails} onChange={handleChange} placeholder="Account Holder Name, Bank Name, Account Number, IFSC Code" className="rb-input" style={{resize:"none"}}/>
              </Field>
            </div>

            {/* ── 6. CLAIM JUSTIFICATION ── */}
            <div className="rb-sec">
              <div className="rb-sec-head">
                <div className="rb-sec-ico" style={{background:"rgba(139,92,246,.1)"}}>📝</div>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:T.coral}}>6 &nbsp;·&nbsp; Claim Justification <span style={{fontFamily:"DM Sans",fontWeight:400,fontSize:11,color:"#94a3b8"}}>(1–2 lines)</span></p>
              </div>
              <Field label="" required error={errors.claimReason}>
                <textarea rows={2} name="claimReason" value={formData.claimReason} onChange={handleChange}
                  placeholder={`e.g. "Purchased office chair for better ergonomic work setup." / "Client meeting lunch expenses."`}
                  className={`rb-input${errors.claimReason?" err":""}`} style={{resize:"none"}}/>
              </Field>
            </div>

            {/* ── 7. ADDITIONAL INFO ── */}
            <div className="rb-sec">
              <div className="rb-sec-head">
                <div className="rb-sec-ico" style={{background:"rgba(100,116,139,.1)"}}>📌</div>
                <div>
                  <p className="fd" style={{fontSize:13,fontWeight:800,color:"#64748b"}}>7 &nbsp;·&nbsp; Additional Information</p>
                  <p style={{fontSize:11,color:"#94a3b8",marginTop:2}}>Optional — some companies require these details.</p>
                </div>
              </div>
              <div className="rb-grid-2">
                <Field label="Project / Client Name">
                  <input name="projectName" value={formData.projectName} onChange={handleChange} placeholder="e.g. Project Apollo / ABC Corp" className="rb-input"/>
                </Field>
                <Field label="Reporting Manager">
                  <input name="managerName" value={formData.managerName} onChange={handleChange} placeholder="Enter manager name" className="rb-input"/>
                </Field>
                <Field label="Travel Distance (km)">
                  <input type="number" name="travelDistance" value={formData.travelDistance} onChange={handleChange} placeholder="If applicable" min="0" className="rb-input"/>
                </Field>
                <Field label="GST Number on Invoice">
                  <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="If available" className="rb-input"/>
                </Field>
              </div>
            </div>

            {/* ── 8. DECLARATION ── */}
            <div className="rb-sec" style={{borderBottom:"none"}}>
              <div className="rb-sec-head">
                <div className="rb-sec-ico" style={{background:"rgba(6,182,212,.1)"}}>✅</div>
                <p className="fd" style={{fontSize:13,fontWeight:800,color:T.teal}}>8 &nbsp;·&nbsp; Declaration <span style={{color:T.coral}}>*</span></p>
              </div>
              <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"12px 14px",borderRadius:12,background:formData.declaration?"rgba(6,182,212,.05)":"#F8FAFF",border:`1.5px solid ${formData.declaration?"rgba(6,182,212,.3)":T.border}`,transition:"all .15s"}}>
                <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleChange} style={{accentColor:T.teal,width:16,height:16,marginTop:1,flexShrink:0}}/>
                <span style={{fontSize:13,color:"#374151",lineHeight:1.65}}>
                  I confirm that the submitted expenses are genuine and work-related. I understand that false claims may lead to disciplinary action.
                </span>
              </label>
              {errors.declaration&&<p className="rb-err" style={{marginTop:6}}>{errors.declaration}</p>}
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:18}}>
            <button type="button" onClick={handleReset} disabled={submitting} className="rb-btn-ghost">Discard</button>
            <button type="submit" disabled={submitting} className="rb-btn-primary">
              {submitting?"Submitting…":"Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
