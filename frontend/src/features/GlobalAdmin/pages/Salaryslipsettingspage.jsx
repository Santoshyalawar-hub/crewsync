import React, { useState, useEffect } from "react";
import {
  Building2, CheckCircle, AlertCircle, Loader2, Save,
  FileText, Upload, Eye, RefreshCw, Settings2, X,
  TrendingUp, TrendingDown, User, CreditCard,
} from "lucide-react";
import api, { API_BASE_URL } from "@/lib/apiClient";

const SETTINGS_API = `${API_BASE_URL}/api/salary-slip-settings`;
const COMPANIES_API = `${API_BASE_URL}/api/global-admin/companies`;
const tok  = () => localStorage.getItem("token");
const hdrs = () => ({ "Content-Type": "application/json", ...(tok() ? { Authorization: `Bearer ${tok()}` } : {}) });

const S = {
  label: { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fff" },
  card:  { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  btn:   (bg, color = "#fff") => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, background: bg, color, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "opacity 0.15s" }),
};

function Toggle({ checked, onChange, label, desc }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", userSelect: "none", padding: "8px 0" }}>
      <div
        onClick={() => onChange(!checked)}
        style={{ width: 38, height: 21, borderRadius: 99, background: checked ? "#22c55e" : "#e2e8f0", position: "relative", transition: "background 0.2s", flexShrink: 0, marginTop: 1 }}
      >
        <div style={{ position: "absolute", top: 3, left: checked ? 19 : 3, width: 15, height: 15, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{desc}</p>}
      </div>
    </label>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 12, background: type === "success" ? "#22c55e" : "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
      {type === "success" ? <CheckCircle style={{ width: 16, height: 16 }} /> : <AlertCircle style={{ width: 16, height: 16 }} />}
      {message}
    </div>
  );
}

export default function CompensationSlipSettingsPage() {
  const [companies, setWorkspaces] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const defaultSettings = {
    slipTitle: "SALARY SLIP",
    footerNote: "This is a computer-generated salary slip and does not require a signature.",
    companyLogoBase64: null,
    logoMediaType: null,
    showPersonId: true, showDepartment: true, showDesignation: true,
    showDateOfJoining: true, showPanNumber: false, showUanNumber: true,
    showPfNumber: true, showEsiNumber: false, showBankName: true,
    showAccountNumber: true, showLoanNumber: false,
    showBasicCompensation: true, showHra: true, showSpecialAllowance: true,
    showTransportAllowance: false, showMedicalAllowance: false, showOtherAllowances: false,
    showPfDeduction: true, showEsiDeduction: false, showProfessionalTax: true,
    showTds: false, showLoanDeduction: false, showOtherDeductions: false,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const setS = (k, v) => setSettings(p => ({ ...p, [k]: v }));

  // Load companies on mount
  useEffect(() => {
    api.get("/api/global-admin/companies")
      .then(r => { const d = r.data; if (d.success) setWorkspaces(d.data || []); })
      .catch(() => {});
  }, []);

  // Load settings when tenant changes
  useEffect(() => {
    if (!selectedTenant) return;
    setLoading(true);
    api.get(`/api/salary-slip-settings/${selectedTenant}`)
      .then(r => {
        const d = r.data;
        if (d.success && d.data) {
          setSettings({ ...defaultSettings, ...d.data });
        } else {
          setSettings(defaultSettings);
        }
      })
      .catch(() => setSettings(defaultSettings))
      .finally(() => setLoading(false));
  }, [selectedTenant]);

  const handleWorkspaceSelect = (e) => {
    const tc = e.target.value;
    setSelectedTenant(tc);
    const comp = companies.find(c => c.tenantCode === tc);
    setSelectedWorkspace(comp || null);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setS("companyLogoBase64", reader.result.split(",")[1]);
      setS("logoMediaType", file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!selectedTenant) { setToast({ message: "Please select a company first", type: "error" }); return; }
    setSaving(true);
    try {
      const { id, ...settingsWithoutId } = settings;
      const payload = { ...settingsWithoutId, tenantCode: selectedTenant };
      const r = await api.put(`/api/salary-slip-settings/${selectedTenant}`, payload);
      const j = r.data;
      if (j.success) setToast({ message: "Settings saved successfully!", type: "success" });
      else setToast({ message: j.message || "Failed to save", type: "error" });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Error saving settings";
      setToast({ message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setToast({ message: "Reset to defaults", type: "success" });
  };

  // ── Toggle section component ──────────────────────────────────────────────
  const ToggleSection = ({ title, icon: Icon, color, bg, items }) => (
    <div style={{ ...S.card, overflow: "hidden" }}>
      <div style={{ background: bg, padding: "12px 18px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #eef0f4" }}>
        <Icon style={{ width: 15, height: 15, color }} />
        <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</span>
      </div>
      <div style={{ padding: "4px 18px 8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        {items.map(({ key, label, desc }) => (
          <Toggle key={key} label={label} desc={desc} checked={!!settings[key]} onChange={v => setS(key, v)} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 40 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Page Header ── */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)", borderRadius: 18, padding: "24px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 140, height: 140, borderRadius: "50%", background: "rgba(139,92,246,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>CrewSync · Global Operator</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>PayStatement Setup</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>Configure pay statement layout and visible fields per company</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {selectedTenant && (
              <button onClick={() => setPreviewOpen(true)} style={{ ...S.btn("rgba(255,255,255,0.1)"), border: "1px solid rgba(255,255,255,0.15)" }}>
                <Eye style={{ width: 15, height: 15 }} /> Preview
              </button>
            )}
            <button onClick={handleSave} disabled={saving || !selectedTenant} style={{ ...S.btn("#8B5CF6"), padding: "10px 20px", borderRadius: 11, boxShadow: "0 4px 14px rgba(139,92,246,0.35)", opacity: (!selectedTenant || saving) ? 0.6 : 1 }}>
              {saving ? <Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 15, height: 15 }} />}
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* ── Workspace Selector ── */}
      <div style={{ ...S.card, padding: "18px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 20 }}>
        <Building2 style={{ width: 20, height: 20, color: "#8B5CF6", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <label style={S.label}>Select Workspace to Configure</label>
          <select
            value={selectedTenant}
            onChange={handleWorkspaceSelect}
            style={{ ...S.input, maxWidth: 420 }}
          >
            <option value="">— Choose a company —</option>
            {companies.map(c => (
              <option key={c.tenantCode} value={c.tenantCode}>
                {c.displayName} ({c.tenantCode})
              </option>
            ))}
          </select>
        </div>
        {selectedWorkspace && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #eef0f4" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#8B5CF6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
              {(selectedWorkspace.displayName || "?").charAt(0)}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{selectedWorkspace.displayName}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>{selectedWorkspace.tenantCode} · {selectedWorkspace.plan} plan · <span style={{ color: selectedWorkspace.status === "active" ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{selectedWorkspace.status}</span></p>
            </div>
          </div>
        )}
        {selectedTenant && (
          <button onClick={handleReset} style={{ ...S.btn("#f1f5f9", "#64748b"), flexShrink: 0 }}>
            <RefreshCw style={{ width: 14, height: 14 }} /> Reset
          </button>
        )}
      </div>

      {!selectedTenant ? (
        <div style={{ ...S.card, padding: "60px 0", textAlign: "center" }}>
          <Settings2 style={{ width: 40, height: 40, color: "#e2e8f0", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", margin: 0 }}>Select a company to configure salary slip settings</p>
          <p style={{ fontSize: 13, color: "#cbd5e1", margin: "6px 0 0" }}>Each company can have its own logo, fields, and pay statement design</p>
        </div>
      ) : loading ? (
        <div style={{ ...S.card, padding: "60px 0", textAlign: "center", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} /> Loading settings…
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Branding */}
            <div style={S.card}>
              <div style={{ background: "#f8fafc", padding: "12px 18px", borderBottom: "1px solid #eef0f4", display: "flex", alignItems: "center", gap: 8 }}>
                <FileText style={{ width: 15, height: 15, color: "#8B5CF6" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>Branding & Header</span>
              </div>
              <div style={{ padding: "18px" }}>
                {/* Logo */}
                <label style={S.label}>Workspace Logo</label>
                <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", borderRadius: 10, border: "1.5px dashed #e2e8f0", cursor: "pointer", background: "#fafbfc", marginBottom: 14 }}>
                  {settings.companyLogoBase64 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                      <img src={`data:${settings.logoMediaType};base64,${settings.companyLogoBase64}`} alt="logo" style={{ height: 44, maxWidth: 120, objectFit: "contain", borderRadius: 6, border: "1px solid #eef0f4" }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#334155" }}>Logo uploaded</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>Click to replace</p>
                      </div>
                      <button type="button" onClick={e => { e.preventDefault(); setS("companyLogoBase64", null); setS("logoMediaType", null); }} style={{ background: "#fef2f2", border: "none", borderRadius: 6, padding: "4px 8px", color: "#ef4444", cursor: "pointer" }}>
                        <X style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Upload style={{ width: 18, height: 18, color: "#94a3b8" }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#334155" }}>Upload company logo</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>PNG, JPG or SVG · Max 2MB · Appears on every pay statement</p>
                      </div>
                    </>
                  )}
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoUpload} style={{ display: "none" }} />
                </label>

                {/* Slip title */}
                <div style={{ marginBottom: 14 }}>
                  <label style={S.label}>Slip Title</label>
                  <input style={S.input} value={settings.slipTitle || ""} onChange={e => setS("slipTitle", e.target.value)} placeholder="SALARY SLIP" />
                </div>
                <div>
                  <label style={S.label}>Footer Note</label>
                  <textarea rows={2} style={{ ...S.input, resize: "none" }} value={settings.footerNote || ""} onChange={e => setS("footerNote", e.target.value)} placeholder="This is a computer-generated salary slip..." />
                </div>
              </div>
            </div>

            {/* Person Info Fields */}
            <ToggleSection
              title="Person Information Fields"
              icon={User}
              color="#6366f1"
              bg="#f5f3ff"
              items={[
                { key: "showPersonId",    label: "Person ID",     desc: "Show emp. ID on slip"       },
                { key: "showDepartment",    label: "Department",      desc: "Show department name"       },
                { key: "showDesignation",   label: "Designation",     desc: "Show job title"             },
                { key: "showDateOfJoining", label: "Date of Joining", desc: "Show DOJ"                   },
                { key: "showPanNumber",     label: "PAN Number",      desc: "Show PAN (income tax)"      },
                { key: "showUanNumber",     label: "UAN Number",      desc: "Universal Account Number"   },
                { key: "showPfNumber",      label: "PF Number",       desc: "Provident Fund account"     },
                { key: "showEsiNumber",     label: "ESI Number",      desc: "Person State Insurance"   },
                { key: "showBankName",      label: "Bank Name",       desc: "Person's bank name"       },
                { key: "showAccountNumber", label: "Account Number",  desc: "Bank account number"        },
                { key: "showLoanNumber",    label: "Loan Number",     desc: "Workspace loan reference"     },
              ]}
            />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Earnings */}
            <ToggleSection
              title="Earnings Components"
              icon={TrendingUp}
              color="#16a34a"
              bg="#f0fdf4"
              items={[
                { key: "showBasicCompensation",        label: "Basic Compensation",         desc: "Core base salary component"     },
                { key: "showHra",                label: "HRA",                  desc: "House Rent Allowance"           },
                { key: "showSpecialAllowance",   label: "Special Allowance",    desc: "Flexible allowance component"   },
                { key: "showTransportAllowance", label: "Transport Allowance",  desc: "Conveyance / travel allowance"  },
                { key: "showMedicalAllowance",   label: "Medical Allowance",    desc: "Health-related allowance"       },
                { key: "showOtherAllowances",    label: "Other Allowances",     desc: "Any additional earnings"        },
              ]}
            />

            {/* Deductions */}
            <ToggleSection
              title="Deduction Components"
              icon={TrendingDown}
              color="#dc2626"
              bg="#fef2f2"
              items={[
                { key: "showPfDeduction",     label: "Provident Fund (PF)", desc: "Person PF contribution"   },
                { key: "showEsiDeduction",    label: "ESI Deduction",       desc: "Person State Insurance"   },
                { key: "showProfessionalTax", label: "Professional Tax",    desc: "State-level professional tax" },
                { key: "showTds",             label: "TDS",                  desc: "Tax Deducted at Source"     },
                { key: "showLoanDeduction",   label: "Loan Deduction",      desc: "EMI recovery from salary"   },
                { key: "showOtherDeductions", label: "Other Deductions",    desc: "Any additional deductions"  },
              ]}
            />

            {/* Summary card */}
            <div style={{ ...S.card, padding: "16px 20px", background: "linear-gradient(135deg,#0f172a,#1e293b)" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Current Settings Summary</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Info Fields",   count: [settings.showPersonId,settings.showDepartment,settings.showDesignation,settings.showDateOfJoining,settings.showPanNumber,settings.showUanNumber,settings.showPfNumber,settings.showEsiNumber,settings.showBankName,settings.showAccountNumber,settings.showLoanNumber].filter(Boolean).length, color: "#6366f1" },
                  { label: "Earnings",      count: [settings.showBasicCompensation,settings.showHra,settings.showSpecialAllowance,settings.showTransportAllowance,settings.showMedicalAllowance,settings.showOtherAllowances].filter(Boolean).length, color: "#22c55e" },
                  { label: "Deductions",    count: [settings.showPfDeduction,settings.showEsiDeduction,settings.showProfessionalTax,settings.showTds,settings.showLoanDeduction,settings.showOtherDeductions].filter(Boolean).length, color: "#ef4444" },
                ].map(({ label, count, color }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                    <p style={{ color, fontSize: 22, fontWeight: 900, margin: 0 }}>{count}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600, margin: "4px 0 0", textTransform: "uppercase" }}>{label}</p>
                  </div>
                ))}
              </div>
              {settings.companyLogoBase64 && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 8 }}>
                  <CheckCircle style={{ width: 13, height: 13, color: "#22c55e" }} />
                  <p style={{ margin: 0, fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Workspace logo uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: "18px 18px 0 0", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, margin: 0 }}>PayStatement Preview</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "3px 0 0" }}>How the slip will appear to employees</p>
              </div>
              <button onClick={() => setPreviewOpen(false)} style={{ width: 32, height: 32, borderRadius: 9, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Preview header */}
              <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {settings.companyLogoBase64
                    ? <img src={`data:${settings.logoMediaType};base64,${settings.companyLogoBase64}`} alt="logo" style={{ height: 44, objectFit: "contain", borderRadius: 6, background: "#fff", padding: 4 }} />
                    : <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#8B5CF6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18 }}>
                        {(selectedWorkspace?.displayName || "C").charAt(0)}
                      </div>
                  }
                  <div>
                    <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, margin: 0 }}>{selectedWorkspace?.displayName || "Workspace Name"}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "3px 0 0" }}>{[selectedWorkspace?.city, selectedWorkspace?.state].filter(Boolean).join(", ")}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#8B5CF6", fontWeight: 800, fontSize: 14, margin: 0 }}>{settings.slipTitle || "SALARY SLIP"}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "3px 0 0" }}>
                    {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Preview info grid */}
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 20px" }}>
                  <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>Person Name</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>John Doe</p></div>
                  {settings.showPersonId    && <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>Person ID</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>EMP001</p></div>}
                  {settings.showDepartment    && <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>Department</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>Engineering</p></div>}
                  {settings.showDesignation   && <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>Designation</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>Sr. Developer</p></div>}
                  {settings.showBankName      && <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>Bank Name</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>HDFC Bank</p></div>}
                  {settings.showAccountNumber && <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>Account No.</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>XXXX-1234</p></div>}
                  {settings.showUanNumber     && <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>UAN</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>100123456789</p></div>}
                  {settings.showPfNumber      && <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>PF Number</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>MH/12345/67</p></div>}
                  {settings.showPanNumber     && <div><p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase" }}>PAN</p><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", margin: "2px 0 0" }}>ABCDE1234F</p></div>}
                </div>
              </div>

              {/* Preview earnings/deductions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div style={{ background: "#f0fdf4", borderRadius: 10, overflow: "hidden" }}>
                  <p style={{ margin: 0, padding: "8px 14px", fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", borderBottom: "1px solid #bbf7d0" }}>Earnings</p>
                  {[
                    { show: settings.showBasicCompensation,        label: "Basic Compensation",       val: "₹ 30,000" },
                    { show: settings.showHra,                label: "HRA",                val: "₹ 12,000" },
                    { show: settings.showSpecialAllowance,   label: "Special Allowance",  val: "₹ 5,000"  },
                    { show: settings.showTransportAllowance, label: "Transport Allow.",   val: "₹ 1,600"  },
                    { show: settings.showMedicalAllowance,   label: "Medical Allow.",     val: "₹ 1,250"  },
                    { show: settings.showOtherAllowances,    label: "Other Allowances",   val: "₹ 500"    },
                  ].filter(r => r.show).map(({ label, val }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 14px", borderBottom: "1px solid #f0fdf4" }}>
                      <span style={{ fontSize: 12, color: "#334155" }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fef2f2", borderRadius: 10, overflow: "hidden" }}>
                  <p style={{ margin: 0, padding: "8px 14px", fontSize: 11, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", borderBottom: "1px solid #fecaca" }}>Deductions</p>
                  {[
                    { show: settings.showPfDeduction,     label: "PF",               val: "₹ 1,800" },
                    { show: settings.showEsiDeduction,    label: "ESI",              val: "₹ 630"   },
                    { show: settings.showProfessionalTax, label: "Prof. Tax",        val: "₹ 200"   },
                    { show: settings.showTds,             label: "TDS",              val: "₹ 2,500" },
                    { show: settings.showLoanDeduction,   label: "Loan Deduction",   val: "₹ 1,000" },
                    { show: settings.showOtherDeductions, label: "Other Deductions", val: "₹ 0"     },
                  ].filter(r => r.show).map(({ label, val }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 14px", borderBottom: "1px solid #fef2f2" }}>
                      <span style={{ fontSize: 12, color: "#334155" }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{val}</span>
                    </div>
                  ))}
                  {![settings.showPfDeduction,settings.showEsiDeduction,settings.showProfessionalTax,settings.showTds,settings.showLoanDeduction,settings.showOtherDeductions].some(Boolean) && (
                    <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", padding: "16px 0" }}>No deductions enabled</p>
                  )}
                </div>
              </div>

              {/* Net pay */}
              <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", margin: 0 }}>Net Pay</p>
                  <p style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: "2px 0 0" }}>₹ 47,620</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, margin: 0 }}>Gross: ₹ 50,350</p>
                  <p style={{ color: "#f87171", fontSize: 13, fontWeight: 700, margin: "4px 0 0" }}>Deductions: ₹ 2,730</p>
                </div>
              </div>

              {/* Footer note */}
              <p style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", marginTop: 12, fontStyle: "italic" }}>
                {settings.footerNote || "This is a computer-generated salary slip."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}