import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/apiClient";


/* ─────────────────────────────────────────────────────────────
   MODULE-LEVEL CONSTANTS — never re-created on re-render
───────────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Personal Info",   icon: "👤" },
  { id: 2, label: "Salary Details",  icon: "💰" },
  { id: 3, label: "Bank Details",    icon: "🏦" },
  { id: 4, label: "Documents",       icon: "📄" },
  { id: 5, label: "Review & Submit", icon: "✅" },
];

const DOC_TYPES = [
  { key: "aadharCard",          label: "Aadhar Card",           subtitle: "National ID proof",            accept: "image/*,.pdf" },
  { key: "panCard",             label: "PAN Card",              subtitle: "Income Tax PAN",               accept: "image/*,.pdf" },
  { key: "passportPhoto",       label: "Passport Photo",        subtitle: "Recent passport-size photo",   accept: "image/*"      },
  { key: "offerLetter",         label: "Offer Letter",          subtitle: "Signed offer letter",          accept: "image/*,.pdf" },
  { key: "experienceLetter",    label: "Experience Letter",     subtitle: "Previous employer letter",     accept: "image/*,.pdf" },
  { key: "degreeCertificate",   label: "Degree Certificate",    subtitle: "Highest qualification degree", accept: "image/*,.pdf" },
  { key: "graduationMarksheet", label: "Graduation Marksheet",  subtitle: "UG/PG marks/result",           accept: "image/*,.pdf" },
];

// All salary amount field keys
const AMOUNT_KEYS = [
  "annualCtc","monthlyGross","basicSalary","hra","specialAllowance",
  "transportAllowance","medicalAllowance","lta","otherAllowance",
  "pfEmployee","pfEmployer","professionalTax","tds","esiEmployee",
  "esiEmployer","otherDeduction","netTakeHome",
];

const COMPONENT_META = [
  { key: "basicSalary",        name: "Basic Salary",        type: "EARNING"   },
  { key: "hra",                name: "HRA",                 type: "EARNING"   },
  { key: "specialAllowance",   name: "Special Allowance",   type: "EARNING"   },
  { key: "transportAllowance", name: "Transport Allowance", type: "EARNING"   },
  { key: "medicalAllowance",   name: "Medical Allowance",   type: "EARNING"   },
  { key: "lta",                name: "LTA",                 type: "EARNING"   },
  { key: "otherAllowance",     name: "Other Allowance",     type: "EARNING"   },
  { key: "pfEmployee",         name: "PF",                  type: "DEDUCTION" },
  { key: "professionalTax",    name: "Professional Tax",    type: "DEDUCTION" },
  { key: "tds",                name: "TDS",                 type: "DEDUCTION" },
  { key: "esiEmployee",        name: "ESI",                 type: "DEDUCTION" },
  { key: "otherDeduction",     name: "Other Deduction",     type: "DEDUCTION" },
];

// toggles: { basicSalary: true, hra: true, pfEmployee: false, ... }
// A component is included if its toggle is ON (regardless of amount).
// Amount defaults to 0 if toggle is ON but no value entered.
const buildSalaryComponents = (salary, toggles = {}) =>
  COMPONENT_META.map((item, index) => {
    const isActive = toggles[item.key] === true;
    const amount = salary[item.key] ? parseFloat(salary[item.key]) : 0;
    return {
      componentKey: item.key,
      componentName: item.name,
      componentType: item.type,
      amount: isActive ? (amount > 0 ? amount : 0) : 0,
      isActive,
      displayOrder: index,
    };
  }).filter((item) => item.isActive);

/* ─────────────────────────────────────────────────────────────
   STYLE TOKENS
───────────────────────────────────────────────────────────── */
const inp = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13,
  color: "#0f172a", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border 0.15s",
};

/* ─────────────────────────────────────────────────────────────
   MODULE-LEVEL ATOMS
───────────────────────────────────────────────────────────── */
const Label = ({ children, required }) => (
  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748b",
    textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>
    {children}{required && <span style={{ color:"#ef4444", marginLeft:3 }}>*</span>}
  </label>
);

const Field = ({ label, required, span, children }) => (
  <div style={span ? { gridColumn:"span 2" } : {}}>
    {label && <Label required={required}>{label}</Label>}
    {children}
  </div>
);

const Inp = ({ label, required, span, ...props }) => (
  <Field label={label} required={required} span={span}>
    <input style={inp} {...props}
      onFocus={e => e.target.style.borderColor="#ff6b35"}
      onBlur={e  => e.target.style.borderColor="#e2e8f0"} />
  </Field>
);

const Sel = ({ label, required, span, options, ...props }) => (
  <Field label={label} required={required} span={span}>
    <select style={{ ...inp, cursor:"pointer" }} {...props}
      onFocus={e => e.target.style.borderColor="#ff6b35"}
      onBlur={e  => e.target.style.borderColor="#e2e8f0"}>
      <option value="">Select…</option>
      {options.map(o => <option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
    </select>
  </Field>
);

const G = ({ children, cols=2 }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:"14px 16px" }}>
    {children}
  </div>
);

const SectionHead = ({ color, children }) => (
  <p style={{ fontSize:11, fontWeight:800, color, textTransform:"uppercase",
    letterSpacing:"0.08em", margin:"16px 0 10px", paddingLeft:10,
    borderLeft:`3px solid ${color}` }}>
    {children}
  </p>
);

const Banner = ({ color, bg, border, children }) => (
  <div style={{ background:bg, borderRadius:10, padding:"10px 14px",
    border:`1px solid ${border}`, marginBottom:4 }}>
    <p style={{ fontSize:12, color, fontWeight:600, margin:0, lineHeight:1.5 }}>{children}</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   THE DEFINITIVE CURSOR FIX — NumInput
   
   Why cursor jumps in React:
   When a parent component re-renders and passes a new `value`
   prop to an input, React replaces the DOM node's value,
   which resets cursor position to the end.
   
   The only 100% reliable fix:
   Use a LOCAL state inside NumInput itself.
   The field manages its own string value.
   On blur it calls onCommit(value) to report upward.
   
   This way the PARENT never re-renders the input on each
   keystroke — only on blur does the value propagate up.
   The cursor NEVER jumps because React never touches the
   DOM value while the user is typing.
───────────────────────────────────────────────────────────── */
function NumInput({ label, fieldKey, initialValue, onCommit, compact = false }) {
  const [val, setVal] = useState(initialValue || "");

  const handleChange = (e) => {
    // Allow digits and one decimal point only
    const v = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\./g, "$1");
    setVal(v);
    // Report immediately so parent has the latest value
    onCommit(fieldKey, v);
  };

  const inputEl = (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      style={{ ...inp, width: compact ? 110 : "100%" }}
      value={val}
      onChange={handleChange}
      placeholder="0.00"
      onFocus={e => e.target.style.borderColor="#ff6b35"}
      onBlur={e  => e.target.style.borderColor="#e2e8f0"}
    />
  );

  if (compact) return inputEl;

  return (
    <Field label={label}>
      {inputEl}
    </Field>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOGGLE ROW — shows a pill toggle + conditional amount input
   Used in StepSalary for each dynamic component.
───────────────────────────────────────────────────────────── */
function ToggleRow({ label, fieldKey, isEarning, isActive, onToggle, initialValue, onCommit }) {
  const color = isEarning ? "#16a34a" : "#dc2626";
  const bg    = isEarning ? "#f0fdf4" : "#fef2f2";
  const activeBorder = isEarning ? "#bbf7d0" : "#fecaca";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", borderRadius: 12,
      border: `1.5px solid ${isActive ? activeBorder : "#e2e8f0"}`,
      background: isActive ? bg : "#fafafa",
      transition: "all 0.18s",
    }}>
      {/* Toggle pill */}
      <button
        type="button"
        onClick={() => onToggle(fieldKey)}
        style={{
          flexShrink: 0,
          width: 42, height: 24, borderRadius: 12,
          background: isActive ? color : "#cbd5e1",
          border: "none", cursor: "pointer",
          position: "relative", transition: "background 0.2s",
          padding: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: isActive ? 21 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>

      {/* Label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 12, fontWeight: 700, margin: 0,
          color: isActive ? color : "#94a3b8",
        }}>{label}</p>
        {!isActive && (
          <p style={{ fontSize: 10, color: "#cbd5e1", margin: "2px 0 0" }}>Off — not included</p>
        )}
      </div>

      {/* Amount input — only visible when active */}
      {isActive && (
        <NumInput
          key={fieldKey}
          label=""
          fieldKey={fieldKey}
          initialValue={initialValue || ""}
          onCommit={onCommit}
          compact
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SALARY SLIP PREVIEW  — module-level
   Fetches company SalarySlipSettings once and shows which
   fields WILL appear on the slip (toggle ON + value > 0).
───────────────────────────────────────────────────────────── */
function SlipPreview({ salary }) {
  const tenantCode = localStorage.getItem("tenantCode") || "";
  const [settings, setSettings] = useState(null);
  const fetched = useRef(false);

  React.useEffect(() => {
    if (!tenantCode || fetched.current) return;
    fetched.current = true;
    api.get(`/api/salary-slip-settings/${tenantCode}`)
      .then(res => { if(res.data.success && res.data.data) setSettings(res.data.data); })
      .catch(()=>{});
  }, [tenantCode]);

  const s = settings || {};
  const showAll = !settings;
  const b = (v) => v===true||v==="true";
  const fmt = (v) => "₹"+Number(v||0).toLocaleString("en-IN",{minimumFractionDigits:2});

  const earn = [
    { key:"basicSalary",        label:"Basic Salary",        show:showAll||b(s.showBasicSalary),        val:salary.basicSalary        },
    { key:"hra",                label:"HRA",                 show:showAll||b(s.showHra),                val:salary.hra                },
    { key:"specialAllowance",   label:"Special Allowance",   show:showAll||b(s.showSpecialAllowance),   val:salary.specialAllowance   },
    { key:"transportAllowance", label:"Transport Allowance", show:showAll||b(s.showTransportAllowance), val:salary.transportAllowance },
    { key:"medicalAllowance",   label:"Medical Allowance",   show:showAll||b(s.showMedicalAllowance),   val:salary.medicalAllowance   },
    { key:"otherAllowance",     label:"Other Allowances",    show:showAll||b(s.showOtherAllowances),    val:salary.otherAllowance     },
  ].filter(f=>f.show&&Number(f.val||0)>0);

  const ded = [
    { key:"pfEmployee",      label:"Provident Fund (PF)", show:showAll||b(s.showPfDeduction),    val:salary.pfEmployee      },
    { key:"esiEmployee",     label:"ESI Deduction",       show:showAll||b(s.showEsiDeduction),   val:salary.esiEmployee     },
    { key:"professionalTax", label:"Professional Tax",    show:showAll||b(s.showProfessionalTax),val:salary.professionalTax },
    { key:"tds",             label:"TDS",                 show:showAll||b(s.showTds),            val:salary.tds             },
    { key:"otherDeduction",  label:"Other Deductions",    show:showAll||b(s.showOtherDeductions),val:salary.otherDeduction  },
  ].filter(f=>f.show&&Number(f.val||0)>0);

  if (earn.length===0 && ded.length===0) return null;

  return (
    <div style={{ marginTop:20, borderRadius:14, border:"1.5px solid #e0f2fe",
      background:"#f0f9ff", overflow:"hidden" }}>
      <div style={{ background:"#0284c7", padding:"10px 16px" }}>
        <span style={{ fontSize:11, fontWeight:800, color:"#fff",
          textTransform:"uppercase", letterSpacing:"0.08em" }}>
          📄 Fields that will appear on this employee's salary slip
        </span>
      </div>
      <div style={{ padding:"14px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          <p style={{ fontSize:10, fontWeight:800, color:"#16a34a",
            textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 8px" }}>
            ✅ Earnings on slip
          </p>
          {earn.map(f=>(
            <div key={f.key} style={{ display:"flex", justifyContent:"space-between",
              padding:"4px 0", borderBottom:"1px solid #dcfce7" }}>
              <span style={{ fontSize:12, color:"#15803d" }}>{f.label}</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#15803d" }}>{fmt(f.val)}</span>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontSize:10, fontWeight:800, color:"#dc2626",
            textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 8px" }}>
            ✅ Deductions on slip
          </p>
          {ded.length>0 ? ded.map(f=>(
            <div key={f.key} style={{ display:"flex", justifyContent:"space-between",
              padding:"4px 0", borderBottom:"1px solid #fecaca" }}>
              <span style={{ fontSize:12, color:"#dc2626" }}>{f.label}</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#dc2626" }}>{fmt(f.val)}</span>
            </div>
          )) : <p style={{ fontSize:11, color:"#94a3b8", margin:0 }}>No deductions entered</p>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 1 — PERSONAL INFO
   Defined at module level — React never remounts it.
═══════════════════════════════════════════════════════════ */
function StepPersonal({ data, onChange }) {
  const set = (k,v) => onChange({...data,[k]:v});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <h3 style={{ fontSize:15, fontWeight:800, color:"#0f172a", margin:0 }}>Personal Information</h3>
      <Banner color="#0369a1" bg="#eff6ff" border="#bfdbfe">
        💡 Employee will receive login credentials via email after registration.
      </Banner>
      <G>
        <Inp label="Full Name"              required value={data.fullName    ||""} onChange={e=>set("fullName",    e.target.value)} placeholder="John Doe" />
        <Inp label="Email"                  required type="email" value={data.email||""} onChange={e=>set("email",e.target.value)} placeholder="john@company.com" />
        <Inp label="Password"               required type="password" value={data.password||""} onChange={e=>set("password",e.target.value)} placeholder="Min 8 characters" />
        <Inp label="Mobile Number"          value={data.mobile     ||""} onChange={e=>set("mobile",     e.target.value)} placeholder="+91 9876543210" />
        <Inp label="Employee ID"            value={data.employeeId ||""} onChange={e=>set("employeeId", e.target.value)} placeholder="EMP001" />
        <Inp label="Date of Birth"          type="date" value={data.dob||""} onChange={e=>set("dob",e.target.value)} />
        <Inp label="Joining Date"           type="date" value={data.joiningDate||""} onChange={e=>set("joiningDate",e.target.value)} />
        <Sel label="Department" value={data.department||""} onChange={e=>set("department",e.target.value)}
          options={["Engineering","HR","Finance","Marketing","Operations","Sales","Legal","Design","Product","IT","Admin"]} />
        <Inp label="Position / Designation" value={data.position||""} onChange={e=>set("position",e.target.value)} placeholder="Software Engineer" />
        <Sel label="Role" value={data.role||"EMPLOYEE"} onChange={e=>set("role",e.target.value)}
          options={[{value:"EMPLOYEE",label:"Employee"},{value:"ADMIN",label:"Admin"}]} />
      </G>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 2 — SALARY DETAILS
   
   DEFINITIVE CURSOR FIX:
   - Component defined at MODULE LEVEL (not inside AddEmployee)
   - Each NumInput manages its OWN local state
   - onCommit only updates the parent's salary object — it does NOT
     cause StepSalary to re-render because salary is a ref in parent
   - The select/text fields use normal controlled state via onMeta
═══════════════════════════════════════════════════════════ */
function StepSalary({ salary, onCommit, meta, onMeta, toggles, onToggle }) {
  const earnings    = COMPONENT_META.filter(c => c.type === "EARNING");
  const deductions  = COMPONENT_META.filter(c => c.type === "DEDUCTION");
  const activeCount = COMPONENT_META.filter(c => toggles[c.key]).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <h3 style={{ fontSize:15, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Salary Structure</h3>
      <Banner color="#c2410c" bg="#fff7ed" border="#fed7aa">
        💡 Toggle each component ON/OFF to control what appears on this employee's payslip.
        Enter the monthly amount (₹) for each active component.
        <strong> {activeCount} component{activeCount !== 1 ? "s" : ""} active.</strong>
      </Banner>

      <SectionHead color="#64748b">CTC Overview</SectionHead>
      <G>
        <NumInput key="annualCtc"    label="Annual CTC (₹)"    fieldKey="annualCtc"    initialValue={salary.annualCtc   ||""} onCommit={onCommit} />
        <NumInput key="monthlyGross" label="Monthly Gross (₹)" fieldKey="monthlyGross" initialValue={salary.monthlyGross||""} onCommit={onCommit} />
      </G>

      <SectionHead color="#16a34a">
        Earnings ({earnings.filter(c => toggles[c.key]).length} active)
      </SectionHead>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {earnings.map(c => (
          <ToggleRow
            key={c.key}
            label={c.name}
            fieldKey={c.key}
            isEarning
            isActive={!!toggles[c.key]}
            onToggle={onToggle}
            initialValue={salary[c.key] || ""}
            onCommit={onCommit}
          />
        ))}
      </div>

      <SectionHead color="#ef4444">
        Deductions ({deductions.filter(c => toggles[c.key]).length} active)
      </SectionHead>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {deductions.map(c => (
          <ToggleRow
            key={c.key}
            label={c.name}
            fieldKey={c.key}
            isEarning={false}
            isActive={!!toggles[c.key]}
            onToggle={onToggle}
            initialValue={salary[c.key] || ""}
            onCommit={onCommit}
          />
        ))}
      </div>

      <SectionHead color="#6366f1">Net & Pay Info</SectionHead>
      <G>
        <NumInput key="netTakeHome" label="Net Take-Home (₹)" fieldKey="netTakeHome" initialValue={salary.netTakeHome||""} onCommit={onCommit} />
        <Sel label="Pay Cycle" value={meta.payCycle||"MONTHLY"} onChange={e=>onMeta("payCycle",e.target.value)}
          options={[{value:"MONTHLY",label:"Monthly"},{value:"BI_WEEKLY",label:"Bi-Weekly"},{value:"WEEKLY",label:"Weekly"}]} />
        <Sel label="Salary Mode" value={meta.salaryMode||"BANK_TRANSFER"} onChange={e=>onMeta("salaryMode",e.target.value)}
          options={[{value:"BANK_TRANSFER",label:"Bank Transfer"},{value:"CASH",label:"Cash"},{value:"CHEQUE",label:"Cheque"}]} />
        <Inp label="Effective From" type="date" value={meta.effectiveFrom||""} onChange={e=>onMeta("effectiveFrom",e.target.value)} />
        <Inp label="Salary Grade"   value={meta.salaryGrade||""} onChange={e=>onMeta("salaryGrade",e.target.value)} placeholder="L4" />
        <Inp label="Pay Band"       value={meta.payBand||""}     onChange={e=>onMeta("payBand",    e.target.value)} placeholder="Band 3" />
      </G>

      <SectionHead color="#64748b">Statutory IDs</SectionHead>
      <G>
        <Inp label="PF UAN"     value={meta.pfUan    ||""} onChange={e=>onMeta("pfUan",    e.target.value)} placeholder="100123456789" />
        <Inp label="ESI Number" value={meta.esiNumber||""} onChange={e=>onMeta("esiNumber",e.target.value)} placeholder="31-00-123456-000-0001" />
        <Inp label="PAN Number" value={meta.panNumber||""} onChange={e=>onMeta("panNumber",e.target.value)} placeholder="ABCDE1234F" />
        <Field label="Remarks" span>
          <textarea value={meta.remarks||""} onChange={e=>onMeta("remarks",e.target.value)}
            placeholder="Any notes about this salary structure…"
            style={{ ...inp, minHeight:64, resize:"vertical" }} />
        </Field>
      </G>

      <SlipPreview salary={salary} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 3 — BANK DETAILS
═══════════════════════════════════════════════════════════ */
function StepBank({ data, onChange }) {
  const set = (k,v) => onChange({...data,[k]:v});
  const [preview, setPreview] = useState(null);
  const isPdf = data.proofFile?.type==="application/pdf";

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("proofFile", file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else { setPreview(null); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <h3 style={{ fontSize:15, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Bank Account Details</h3>
      <Banner color="#0369a1" bg="#eff6ff" border="#bfdbfe">
        💡 Bank proof is uploaded to Cloudinary — tenant-isolated.
      </Banner>
      <SectionHead color="#0284c7">Account Information</SectionHead>
      <G>
        <Inp label="Bank Name"           required value={data.bankName            ||""} onChange={e=>set("bankName",            e.target.value)} placeholder="State Bank of India" />
        <Inp label="Account Holder Name" required value={data.accountHolderName  ||""} onChange={e=>set("accountHolderName",  e.target.value)} placeholder="John Doe" />
        <Inp label="Account Number"      required value={data.accountNumber       ||""} onChange={e=>set("accountNumber",       e.target.value)} placeholder="Account number" />
        <Inp label="Confirm Account No." required value={data.confirmAccountNumber||""} onChange={e=>set("confirmAccountNumber",e.target.value)} placeholder="Re-enter" />
        <Inp label="IFSC Code"           required value={data.ifscCode            ||""} onChange={e=>set("ifscCode",e.target.value.toUpperCase())} placeholder="SBIN0001234" />
        <Inp label="Branch Name"  value={data.branchName ||""} onChange={e=>set("branchName", e.target.value)} placeholder="Koramangala Branch" />
        <Sel label="Account Type" value={data.accountType||"SAVINGS"} onChange={e=>set("accountType",e.target.value)}
          options={[{value:"SAVINGS",label:"Savings"},{value:"CURRENT",label:"Current"},{value:"SALARY",label:"Salary"}]} />
        <Inp label="MICR Code"  value={data.micrCode ||""} onChange={e=>set("micrCode", e.target.value)} placeholder="560002094" />
        <Inp label="SWIFT Code" value={data.swiftCode||""} onChange={e=>set("swiftCode",e.target.value)} placeholder="SBININBB" />
      </G>
      <Field label="Branch Address" span>
        <textarea value={data.branchAddress||""} onChange={e=>set("branchAddress",e.target.value)}
          placeholder="Full branch address…" style={{ ...inp, minHeight:56, resize:"vertical" }} />
      </Field>
      <SectionHead color="#7c3aed">Proof Document</SectionHead>
      <G>
        <Sel label="Document Type" value={data.proofDocumentType||"CANCELLED_CHEQUE"} onChange={e=>set("proofDocumentType",e.target.value)}
          options={[{value:"CANCELLED_CHEQUE",label:"Cancelled Cheque"},{value:"PASSBOOK",label:"Bank Passbook"},{value:"BANK_STATEMENT",label:"Bank Statement"}]} />
        <Field label="Upload File">
          <label style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
            borderRadius:10, border:"1.5px dashed #e2e8f0", background:"#f8fafc",
            cursor:"pointer", fontSize:13, color:"#64748b" }}>
            📎 {data.proofFile ? data.proofFile.name : "Choose image or PDF…"}
            <input type="file" accept="image/*,.pdf" onChange={handleFile} style={{ display:"none" }} />
          </label>
        </Field>
      </G>
      {data.proofFile && (
        <div style={{ marginTop:8, padding:"10px 14px", background:"#f0fdf4", borderRadius:10, border:"1px solid #bbf7d0" }}>
          <p style={{ fontSize:11, color:"#15803d", fontWeight:700, margin:"0 0 6px" }}>
            ✅ {data.proofFile.name} ({(data.proofFile.size/1024).toFixed(1)} KB)
          </p>
          {preview && <img src={preview} alt="Preview" style={{ maxWidth:200, borderRadius:8, border:"1px solid #e2e8f0" }} />}
          {isPdf && <p style={{ fontSize:11, color:"#64748b", margin:0 }}>PDF — will upload to Cloudinary.</p>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 4 — DOCUMENTS
═══════════════════════════════════════════════════════════ */
const SVG_UP  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`;
const SVG_DEL = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const SVG_EYE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

function DocCard({ docMeta, fileEntry, onUpload, onRemove }) {
  const inputRef = useRef();
  const uploaded = !!fileEntry;
  const isPdf    = fileEntry?.file?.type==="application/pdf";

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (fileEntry?.url) URL.revokeObjectURL(fileEntry.url);
    onUpload({ file, url, uploadedAt: new Date().toISOString() });
    e.target.value = "";
  };

  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 14px",
      borderRadius:12, border:uploaded?"1.5px solid #bbf7d0":"1.5px solid #f1f5f9",
      background:uploaded?"#f0fdf4":"#fafafa", transition:"all 0.2s" }}>
      <div style={{ width:40, height:40, borderRadius:9, flexShrink:0, overflow:"hidden",
        border:"1.5px solid #e2e8f0", background:uploaded?"#dcfce7":"#f1f5f9",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        {uploaded&&!isPdf&&fileEntry.url
          ? <img src={fileEntry.url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          : <span style={{ fontSize:16 }}>{uploaded&&isPdf?"📄":"📎"}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{docMeta.label}</span>
          {uploaded && <span style={{ fontSize:10, fontWeight:700, color:"#15803d", background:"#dcfce7", borderRadius:20, padding:"2px 7px" }}>✓ Selected</span>}
        </div>
        <div style={{ fontSize:11, color:"#94a3b8" }}>
          {uploaded ? `${fileEntry.file.name} · ${(fileEntry.file.size/1024).toFixed(1)} KB` : docMeta.subtitle}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
        {uploaded ? (
          <>
            <button title="View" onClick={()=>window.open(fileEntry.url,"_blank")}
              style={{ width:30,height:30,borderRadius:8,border:"1px solid #c7d2fe",background:"#eef2ff",color:"#4f46e5",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}
              dangerouslySetInnerHTML={{ __html:SVG_EYE }} />
            <button title="Re-upload" onClick={()=>inputRef.current.click()}
              style={{ width:30,height:30,borderRadius:8,border:"1px solid #bbf7d0",background:"#dcfce7",color:"#16a34a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}
              dangerouslySetInnerHTML={{ __html:SVG_UP }} />
            <button title="Remove" onClick={onRemove}
              style={{ width:30,height:30,borderRadius:8,border:"1px solid #fecaca",background:"#fef2f2",color:"#dc2626",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}
              dangerouslySetInnerHTML={{ __html:SVG_DEL }} />
          </>
        ) : (
          <button onClick={()=>inputRef.current.click()}
            style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,border:"none",
              background:"linear-gradient(135deg,#ff6b35,#f97316)",color:"#fff",fontSize:12,fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>
            <span dangerouslySetInnerHTML={{ __html:SVG_UP }} /> Upload
          </button>
        )}
        <input ref={inputRef} type="file" accept={docMeta.accept} onChange={handleChange} style={{ display:"none" }} />
      </div>
    </div>
  );
}

function StepDocuments({ data, onChange }) {
  const [fileEntries, setFileEntries] = useState({});

  const handleUpload = (key, entry) => {
    const next = { ...fileEntries, [key]: entry };
    setFileEntries(next);
    const flat = {};
    Object.entries(next).forEach(([k,v]) => { flat[k] = v?.file??null; });
    onChange({ ...data, ...flat });
  };

  const handleRemove = (key) => {
    if (fileEntries[key]?.url) URL.revokeObjectURL(fileEntries[key].url);
    const next = { ...fileEntries }; delete next[key];
    setFileEntries(next);
    onChange({ ...data, [key]: null });
  };

  const uploaded = Object.keys(fileEntries).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <h3 style={{ fontSize:15, fontWeight:800, color:"#0f172a", margin:0 }}>Upload Documents</h3>
        <span style={{ fontSize:12, fontWeight:600, color:"#64748b" }}>{uploaded} / {DOC_TYPES.length} selected</span>
      </div>
      <div style={{ height:5, background:"#f1f5f9", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#ff6b35,#16a34a)",
          width:`${(uploaded/DOC_TYPES.length)*100}%`, transition:"width 0.4s ease" }} />
      </div>
      <Banner color="#15803d" bg="#f0fdf4" border="#bbf7d0">
        ✅ All documents optional — employee can upload from their dashboard. Stored on Cloudinary CDN, tenant-isolated.
      </Banner>
      {DOC_TYPES.map(docMeta => (
        <DocCard key={docMeta.key} docMeta={docMeta}
          fileEntry={fileEntries[docMeta.key]||null}
          onUpload={entry=>handleUpload(docMeta.key,entry)}
          onRemove={()=>handleRemove(docMeta.key)} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 5 — REVIEW
═══════════════════════════════════════════════════════════ */
function StepReview({ personal, salary, meta, bank, docs }) {
  const Row = ({ label, value }) => (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #f8fafc" }}>
      <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>{label}</span>
      <span style={{ fontSize:13, color:"#0f172a", fontWeight:500 }}>{value||"—"}</span>
    </div>
  );
  const Section = ({ title, color="#475569", children }) => (
    <div style={{ background:"#f8fafc", borderRadius:12, padding:"14px 16px", border:"1px solid #f1f5f9" }}>
      <p style={{ fontSize:11, fontWeight:800, color, textTransform:"uppercase",
        letterSpacing:"0.07em", margin:"0 0 10px", paddingLeft:8,
        borderLeft:`3px solid ${color}` }}>{title}</p>
      {children}
    </div>
  );
  const fmt = (v) => v&&Number(v)>0 ? `₹ ${Number(v).toLocaleString()}` : "Not set";
  const docCount = DOC_TYPES.filter(d=>docs[d.key]).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <h3 style={{ fontSize:15, fontWeight:800, color:"#0f172a", margin:0 }}>Review & Confirm</h3>
      <Banner color="#0369a1" bg="#eff6ff" border="#bfdbfe">
        ℹ Review all details. Each section saves independently.
      </Banner>
      <Section title="Personal Info" color="#ff6b35">
        <Row label="Name"        value={personal.fullName} />
        <Row label="Email"       value={personal.email} />
        <Row label="Employee ID" value={personal.employeeId} />
        <Row label="Department"  value={personal.department} />
        <Row label="Position"    value={personal.position} />
        <Row label="Role"        value={personal.role||"EMPLOYEE"} />
        <Row label="Joining"     value={personal.joiningDate} />
      </Section>
      <Section title="Salary" color="#16a34a">
        <Row label="Annual CTC"    value={fmt(salary.annualCtc)} />
        <Row label="Monthly Gross" value={fmt(salary.monthlyGross)} />
        <Row label="Basic Salary"  value={fmt(salary.basicSalary)} />
        <Row label="HRA"           value={fmt(salary.hra)} />
        <Row label="PF (Employee)" value={fmt(salary.pfEmployee)} />
        <Row label="Net Take-Home" value={fmt(salary.netTakeHome)} />
        <Row label="Pay Cycle"     value={meta.payCycle||"MONTHLY"} />
      </Section>
      <Section title="Bank Details" color="#0284c7">
        <Row label="Bank"        value={bank.bankName} />
        <Row label="Account No." value={bank.accountNumber?"••••"+(bank.accountNumber||"").slice(-4):"Not set"} />
        <Row label="IFSC"        value={bank.ifscCode} />
        <Row label="Proof File"  value={bank.proofFile?`${bank.proofFile.name} ✅`:"Not uploaded"} />
      </Section>
      <Section title="Documents" color="#7c3aed">
        <Row label="Files Selected" value={`${docCount} / ${DOC_TYPES.length}`} />
        {DOC_TYPES.filter(d=>docs[d.key]).map(d=>(
          <Row key={d.key} label={d.label} value={`${docs[d.key].name} ✅`} />
        ))}
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN — AddEmployee
═══════════════════════════════════════════════════════════ */
export default function AddEmployee() {
  const navigate   = useNavigate();
  const tenantCode = localStorage.getItem("tenantCode") || "";
  const companyId  = localStorage.getItem("companyId")  || "";

  const [step,    setStep]    = useState(1);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [logs,    setLogs]    = useState([]);

  const [personal, setPersonal] = useState({
    fullName:"", email:"", password:"", mobile:"",
    employeeId:"", dob:"", joiningDate:"", department:"", position:"", role:"EMPLOYEE",
  });

  // salary: plain object, updated via onCommit from NumInput
  // Stored in a ref so that NumInput's onCommit call does NOT
  // trigger a re-render of StepSalary (which would lose focus)
  const salaryRef = useRef({});
  // salaryDisplay is ONLY used in Step 5 review — updated when user navigates to step 5
  const [salaryDisplay, setSalaryDisplay] = useState({});

  const [meta, setMeta] = useState({
    payCycle:"MONTHLY", salaryMode:"BANK_TRANSFER", effectiveFrom:"",
    remarks:"", pfUan:"", esiNumber:"", panNumber:"", salaryGrade:"", payBand:"",
  });

  const handleMetaChange = (k,v) => setMeta(prev => ({...prev,[k]:v}));

  // onCommit: NumInput calls this on every change.
  // We update only the ref — NO state update — so StepSalary does NOT re-render.
  // This is why the cursor never jumps.
  const handleCommit = (key, value) => {
    salaryRef.current[key] = value;
  };

  // componentToggles: tracks which salary components are enabled (isActive).
  // Default: basic + HRA + PF on; rest off. User can toggle any time.
  const [componentToggles, setComponentToggles] = useState(() => {
    const defaults = {};
    COMPONENT_META.forEach(c => { defaults[c.key] = false; });
    defaults.basicSalary = true;
    defaults.hra         = true;
    defaults.pfEmployee  = true;
    return defaults;
  });

  const handleToggle = (key) => {
    setComponentToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [bank, setBank] = useState({});
  const [docs, setDocs] = useState({});

  const addLog = (msg, ok=true) => setLogs(prev => [...prev, {msg,ok}]);

  const validate = () => {
    if (step===1) {
      if (!personal.fullName.trim())                          return "Full name is required";
      if (!personal.email.trim())                             return "Email is required";
      if (!personal.password||personal.password.length < 8)  return "Password must be at least 8 characters";
    }
    if (step===3) {
      if (bank.accountNumber&&bank.confirmAccountNumber&&
          bank.accountNumber!==bank.confirmAccountNumber)     return "Account numbers do not match";
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    // When navigating to review (step 5), snapshot salary for display
    if (step===4) setSalaryDisplay({...salaryRef.current});
    setStep(s => Math.min(s+1, STEPS.length));
  };

  const prev = () => { setError(""); setStep(s => Math.max(s-1, 1)); };

  const handleSubmit = async () => {
    if (!tenantCode) { setError("Tenant code not found."); return; }
    setSaving(true); setError(""); setLogs([]);
    let userId = null;

    try {
      addLog("Registering employee…");
      const regRes = await api.post("/api/auth/register", {
        fullName:   personal.fullName.trim(),
        email:      personal.email.trim().toLowerCase(),
        password:   personal.password,
        mobile:     personal.mobile     ||null,
        employeeId: personal.employeeId ||null,
        dob:        personal.dob        ||null,
        joiningDate:personal.joiningDate||null,
        department: personal.department ||null,
        position:   personal.position   ||null,
        role:       personal.role       ||"EMPLOYEE",
        tenantCode,
        companyId: companyId ? parseInt(companyId) : null,
      });
      const regData = regRes.data;
      if (!regData.success) throw new Error(regData.message||"Registration failed");
      userId = regData.data?.id||regData.data?.userId||regData.data?.user?.id;
      if (!userId) throw new Error("No userId returned.");
      addLog(`✅ Registered — userId: ${userId}`);

      // Salary — read from ref
      const s = salaryRef.current;
      const toF = (v) => v ? parseFloat(v) : null;
      const components = buildSalaryComponents(s, componentToggles);
      const hasSalary = AMOUNT_KEYS.some(k => s[k] && parseFloat(s[k]) > 0);
      if (hasSalary) {
        addLog("Saving salary…");
        try {
          const sr = await api.post(`/api/salary/employee/${userId}`, {
            annualCtc:          toF(s.annualCtc),
            monthlyGross:       toF(s.monthlyGross),
            basicSalary:        toF(s.basicSalary),
            hra:                toF(s.hra),
            specialAllowance:   toF(s.specialAllowance),
            transportAllowance: toF(s.transportAllowance),
            medicalAllowance:   toF(s.medicalAllowance),
            lta:                toF(s.lta),
            otherAllowance:     toF(s.otherAllowance),
            pfEmployee:         toF(s.pfEmployee),
            pfEmployer:         toF(s.pfEmployer),
            professionalTax:    toF(s.professionalTax),
            tds:                toF(s.tds),
            esiEmployee:        toF(s.esiEmployee),
            esiEmployer:        toF(s.esiEmployer),
            otherDeduction:     toF(s.otherDeduction),
            netTakeHome:        toF(s.netTakeHome),
            payCycle:           meta.payCycle     ||"MONTHLY",
            salaryMode:         meta.salaryMode   ||"BANK_TRANSFER",
            effectiveFrom:      meta.effectiveFrom||null,
            salaryGrade:        meta.salaryGrade  ||null,
            payBand:            meta.payBand      ||null,
            pfUan:              meta.pfUan        ||null,
            esiNumber:          meta.esiNumber     ||null,
            panNumber:          meta.panNumber     ||null,
            remarks:            meta.remarks      ||null,
            components,
          });
          const sd = sr.data;
          if (!sd.success) addLog(`⚠ Salary: ${sd.message||"error"}`, false);
          else addLog("✅ Salary saved");
        } catch(e) { addLog(`⚠ Salary: ${e.message}`, false); }
      } else { addLog("ℹ Salary skipped (no values entered)"); }

      // Bank
      if (bank.bankName||bank.accountNumber||bank.ifscCode) {
        addLog("Saving bank…");
        try {
          const bb = {...bank}; delete bb.proofFile;
          const br = await api.post(`/api/bank/employee/${userId}`, bb);
          const bd = br.data;
          if (!bd.success) addLog(`⚠ Bank: ${bd.message||"error"}`, false);
          else addLog("✅ Bank saved");
        } catch(e) { addLog(`⚠ Bank: ${e.message}`, false); }
      }

      if (bank.proofFile) {
        addLog("Uploading bank proof…");
        try {
          const fd = new FormData();
          fd.append("file", bank.proofFile);
          fd.append("proofDocumentType", bank.proofDocumentType||"CANCELLED_CHEQUE");
          const pr = await api.post(`/api/bank/employee/${userId}/upload-proof`, fd);
          const pd = pr.data;
          if (!pd.success) addLog(`⚠ Proof: ${pd.message||"error"}`, false);
          else addLog("✅ Bank proof uploaded");
        } catch(e) { addLog(`⚠ Proof: ${e.message}`, false); }
      }

      // Documents
      for (const {key} of DOC_TYPES) {
        if (docs[key]) {
          addLog(`Uploading ${key}…`);
          try {
            const fd = new FormData();
            fd.append("file", docs[key]);
            fd.append("documentType", key);
            const dr = await api.post(`/api/documents/upload/${userId}`, fd);
            const dd = dr.data;
            if (!dd.success) addLog(`⚠ ${key}: ${dd.message||"error"}`, false);
            else addLog(`✅ ${key} uploaded`);
          } catch(e) { addLog(`⚠ ${key}: ${e.message}`, false); }
        }
      }

      setSuccess(true);
      setTimeout(() => navigate("/super-admin/employees"), 3000);
    } catch(err) {
      setError(err.message||"Registration failed.");
      addLog(`❌ ${err.message}`, false);
    } finally { setSaving(false); }
  };

  if (success) {
    return (
      <div style={{ minHeight:"60vh", display:"flex", alignItems:"center",
        justifyContent:"center", flexDirection:"column", gap:16, padding:24 }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"#dcfce7",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>✅</div>
        <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, color:"#0f172a", margin:0 }}>
          Employee Added Successfully!
        </h2>
        <p style={{ color:"#94a3b8", fontSize:13, margin:0 }}>Redirecting…</p>
        <div style={{ width:"100%", maxWidth:480, background:"#f8fafc", borderRadius:12, padding:"12px 16px" }}>
          {logs.map((l,i) => (
            <div key={i} style={{ fontSize:11, color:l.ok?"#15803d":"#b91c1c", fontWeight:600, padding:"2px 0" }}>
              {l.msg}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Figtree:wght@400;500;600;700&display=swap');
        .addEmp { font-family:'Figtree',sans-serif; }
        @keyframes ae-fade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
      `}</style>

      <div className="addEmp" style={{ padding:"28px 32px", maxWidth:860, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <div style={{ width:5, height:32, borderRadius:3,
            background:"linear-gradient(180deg,#ff6b35,#fbbf24)", flexShrink:0 }} />
          <div>
            <h1 style={{ fontSize:22, fontWeight:900, color:"#0f172a",
              fontFamily:"'Outfit',sans-serif", margin:0 }}>Add New Employee</h1>
            <p style={{ fontSize:12, color:"#94a3b8", margin:"3px 0 0" }}>
              Salary fields entered here appear on the employee's salary slip based on company settings
            </p>
          </div>
        </div>

        {tenantCode && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:7,
            padding:"5px 12px", borderRadius:20, background:"rgba(255,107,53,0.08)",
            border:"1px solid rgba(255,107,53,0.2)", marginBottom:20 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
            <span style={{ fontSize:11, fontWeight:700, color:"#ff6b35" }}>Tenant: {tenantCode}</span>
          </div>
        )}

        {/* Step Indicator */}
        <div style={{ display:"flex", gap:0, marginBottom:28, overflowX:"auto" }}>
          {STEPS.map((s, i) => {
            const done   = step > s.id;
            const active = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:80, gap:5 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", display:"flex",
                    alignItems:"center", justifyContent:"center", fontSize:done?16:13,
                    fontWeight:700, transition:"all 0.2s",
                    background:done?"#16a34a":active?"#ff6b35":"#f1f5f9",
                    color:done||active?"#fff":"#94a3b8",
                    border:active?"2px solid #ff6b35":"2px solid transparent" }}>
                    {done?"✓":s.icon}
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, textAlign:"center", lineHeight:1.2,
                    color:active?"#ff6b35":done?"#16a34a":"#94a3b8" }}>{s.label}</span>
                </div>
                {i < STEPS.length-1 && (
                  <div style={{ flex:1, height:2, marginTop:17, minWidth:16,
                    background:done?"#16a34a":"#f1f5f9", transition:"background 0.3s" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {error && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10,
            padding:"10px 14px", fontSize:12, color:"#b91c1c", fontWeight:600, marginBottom:16 }}>
            ⚠ {error}
          </div>
        )}

        {/* Form Card */}
        <div style={{ background:"#fff", borderRadius:20, border:"1px solid #f1f5f9",
          boxShadow:"0 4px 24px rgba(15,23,42,0.06)", padding:"28px 32px",
          minHeight:360, animation:"ae-fade 0.3s ease" }}>
          {step===1 && <StepPersonal data={personal} onChange={setPersonal} />}
          {step===2 && (
            <StepSalary
              salary={salaryRef.current}
              onCommit={handleCommit}
              meta={meta}
              onMeta={handleMetaChange}
              toggles={componentToggles}
              onToggle={handleToggle}
            />
          )}
          {step===3 && <StepBank      data={bank} onChange={setBank} />}
          {step===4 && <StepDocuments data={docs} onChange={setDocs} />}
          {step===5 && <StepReview    personal={personal} salary={salaryDisplay} meta={meta} bank={bank} docs={docs} />}
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
          <button onClick={prev} disabled={step===1}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 20px",
              borderRadius:11, border:"1px solid #e2e8f0", background:"#fff", color:"#475569",
              fontSize:13, fontWeight:600, fontFamily:"inherit",
              cursor:step===1?"not-allowed":"pointer", opacity:step===1?0.4:1 }}>
            ← Previous
          </button>
          <div style={{ display:"flex", gap:10 }}>
            {step < STEPS.length && (
              <button onClick={() => { setError(""); if(step===4) setSalaryDisplay({...salaryRef.current}); setStep(s=>Math.min(s+1,STEPS.length)); }}
                style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 20px",
                  borderRadius:11, border:"1px solid #e2e8f0", background:"#f8fafc",
                  color:"#64748b", fontSize:13, fontWeight:600, fontFamily:"inherit", cursor:"pointer" }}>
                Skip →
              </button>
            )}
            {step < STEPS.length ? (
              <button onClick={next}
                style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 24px",
                  borderRadius:11, border:"none",
                  background:"linear-gradient(135deg,#ff6b35,#f97316)", color:"#fff",
                  fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                  boxShadow:"0 4px 14px rgba(255,107,53,0.3)" }}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 28px",
                  borderRadius:11, border:"none",
                  background:saving?"#94a3b8":"linear-gradient(135deg,#16a34a,#15803d)",
                  color:"#fff", fontSize:13, fontWeight:700, fontFamily:"inherit",
                  cursor:saving?"not-allowed":"pointer",
                  boxShadow:saving?"none":"0 4px 14px rgba(22,163,74,0.3)" }}>
                {saving?"⏳ Submitting…":"✅ Submit Employee"}
              </button>
            )}
          </div>
        </div>

        {saving && logs.length > 0 && (
          <div style={{ marginTop:16, background:"#0f172a", borderRadius:12, padding:"12px 16px" }}>
            <p style={{ fontSize:10, fontWeight:700, color:"#64748b",
              textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 8px" }}>
              Submission Progress
            </p>
            {logs.map((l,i) => (
              <div key={i} style={{ fontSize:11, color:l.ok?"#4ade80":"#f87171",
                fontWeight:600, padding:"2px 0", fontFamily:"monospace" }}>
                {l.msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
