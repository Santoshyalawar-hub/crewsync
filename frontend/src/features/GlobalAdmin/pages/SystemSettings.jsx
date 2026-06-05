// import React from "react";
// import { Settings } from "lucide-react";

// export default function SystemSettings() {
//   return (
//     <div className="px-4 md:px-6 py-6">
//       <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
//         <Settings className="h-16 w-16 text-slate-300 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-slate-900 mb-2">
//           System Settings
//         </h2>
//         <p className="text-slate-500">
//           Configure global system settings and preferences
//         </p>
//       </div>
//     </div>
//   );
// }

//updated 7/3/2026
import React, { useState, useEffect } from "react";
import { Settings, Globe, Bell, Database, Mail, Shield, Palette, Save, CheckCircle } from "lucide-react";

const STORAGE_KEY = "samayahr_ga_settings";

const S = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 32 },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #eef0f4", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  label: { fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fff" },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f8fafc" },
};

const SECTIONS = [
  { id: "general",       label: "General",       icon: Globe,     color: "#ff6b35" },
  { id: "notifications", label: "Notifications", icon: Bell,      color: "#8b5cf6" },
  { id: "database",      label: "Database",      icon: Database,  color: "#0ea5e9" },
  { id: "email",         label: "Email / SMTP",  icon: Mail,      color: "#22c55e" },
  { id: "security",      label: "Security",      icon: Shield,    color: "#ef4444" },
  { id: "appearance",    label: "Appearance",    icon: Palette,   color: "#f59e0b" },
];

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: value ? "#ff6b35" : "#e2e8f0", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

export default function SystemSettings() {
  const [section, setSection] = useState("general");
  const [saved, setSaved] = useState(false);

  const DEFAULTS = {
    general:  { appName: "SamayaHR", timezone: "Asia/Kolkata", language: "English", dateFormat: "DD/MM/YYYY", maintenanceMode: false },
    notifs:   { emailAlerts: true, smsAlerts: false, slackAlerts: false, weeklyReport: true },
    db:       { host: "localhost", port: "5432", name: "samayahr_db", autoBackup: true, backupFreq: "daily" },
    email:    { smtpHost: "smtp.gmail.com", smtpPort: "587", fromEmail: "noreply@samayahr.com", fromName: "SamayaHR" },
    security: { enforce2FA: true, sessionTimeout: "8", passwordExpiry: "90", ipAllowlist: false },
  };

  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  };
  const saved_data = load();

  const [general, setGeneral]   = useState({ ...DEFAULTS.general,  ...saved_data.general  });
  const [notifs,  setNotifs]    = useState({ ...DEFAULTS.notifs,   ...saved_data.notifs   });
  const [db,      setDb]        = useState({ ...DEFAULTS.db,       ...saved_data.db       });
  const [email,   setEmail]     = useState({ ...DEFAULTS.email,    ...saved_data.email    });
  const [security, setSecurity] = useState({ ...DEFAULTS.security, ...saved_data.security });

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ general, notifs, db, email, security }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={S.page}>
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 18, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: 60, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,107,53,0.1)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>SamayaHR · Global Admin</p>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>System Settings</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "6px 0 0" }}>Configure global system preferences and integrations</p>
          </div>
          <button onClick={handleSave}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: saved ? "#22c55e" : "#ff6b35", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "background 0.2s", boxShadow: "0 4px 14px rgba(255,107,53,0.3)" }}>
            {saved ? <CheckCircle style={{ width: 15, height: 15 }} /> : <Save style={{ width: 15, height: 15 }} />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
        {/* Sidebar */}
        <div style={{ ...S.card, padding: "8px", height: "fit-content" }}>
          {SECTIONS.map(({ id, label, icon: Icon, color }) => (
            <button key={id} onClick={() => setSection(id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 2, transition: "all 0.15s", background: section === id ? color + "15" : "transparent", color: section === id ? color : "#64748b", borderLeft: section === id ? `3px solid ${color}` : "3px solid transparent" }}>
              <Icon style={{ width: 15, height: 15 }} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={S.card}>
          {section === "general" && (
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>General Settings</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[["Application Name","appName","text"],["Timezone","timezone","text"],["Language","language","text"],["Date Format","dateFormat","text"]].map(([label, key, type]) => (
                  <div key={key}>
                    <label style={S.label}>{label}</label>
                    <input type={type} style={S.input} value={general[key]} onChange={e => setGeneral(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div style={{ ...S.row, marginTop: 16 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>Maintenance Mode</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0" }}>Puts the platform into read-only maintenance state</p>
                </div>
                <Toggle value={general.maintenanceMode} onChange={v => setGeneral(p => ({ ...p, maintenanceMode: v }))} />
              </div>
            </div>
          )}

          {section === "notifications" && (
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Notification Settings</p>
              {[
                ["Email Alerts",   "emailAlerts",  "Send system alerts via email"],
                ["SMS Alerts",     "smsAlerts",    "Send critical alerts via SMS"],
                ["Slack Alerts",   "slackAlerts",  "Push alerts to Slack workspace"],
                ["Weekly Report",  "weeklyReport", "Auto-send weekly summary report"],
              ].map(([label, key, desc]) => (
                <div key={key} style={S.row}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0" }}>{desc}</p>
                  </div>
                  <Toggle value={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
                </div>
              ))}
            </div>
          )}

          {section === "database" && (
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Database Configuration</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[["Host","host"],["Port","port"],["Database Name","name"]].map(([label, key]) => (
                  <div key={key}>
                    <label style={S.label}>{label}</label>
                    <input style={S.input} value={db[key]} onChange={e => setDb(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label style={S.label}>Backup Frequency</label>
                  <select style={S.input} value={db.backupFreq} onChange={e => setDb(p => ({ ...p, backupFreq: e.target.value }))}>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div style={S.row}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>Auto Backup</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0" }}>Automatically backup database on schedule</p>
                </div>
                <Toggle value={db.autoBackup} onChange={v => setDb(p => ({ ...p, autoBackup: v }))} />
              </div>
            </div>
          )}

          {section === "email" && (
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Email / SMTP Settings</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[["SMTP Host","smtpHost"],["SMTP Port","smtpPort"],["From Email","fromEmail"],["From Name","fromName"]].map(([label, key]) => (
                  <div key={key}>
                    <label style={S.label}>{label}</label>
                    <input style={S.input} value={email[key]} onChange={e => setEmail(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "security" && (
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Security Settings</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Session Timeout (hours)</label>
                  <input style={S.input} type="number" value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))} />
                </div>
                <div>
                  <label style={S.label}>Password Expiry (days)</label>
                  <input style={S.input} type="number" value={security.passwordExpiry} onChange={e => setSecurity(p => ({ ...p, passwordExpiry: e.target.value }))} />
                </div>
              </div>
              {[["Enforce 2FA","enforce2FA","Require two-factor authentication for all admins"],["IP Allowlisting","ipAllowlist","Restrict access to approved IP addresses only"]].map(([label, key, desc]) => (
                <div key={key} style={S.row}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0" }}>{desc}</p>
                  </div>
                  <Toggle value={security[key]} onChange={v => setSecurity(p => ({ ...p, [key]: v }))} />
                </div>
              ))}
            </div>
          )}

          {section === "appearance" && (
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Appearance</p>
              <div>
                <label style={S.label}>Brand Color</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["#ff6b35","#6366f1","#0ea5e9","#22c55e","#f59e0b","#ef4444","#0f172a"].map(c => (
                    <button key={c} style={{ width: 36, height: 36, borderRadius: 10, background: c, border: c === "#ff6b35" ? "3px solid #0f172a" : "3px solid transparent", cursor: "pointer" }} />
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <label style={S.label}>Theme Mode</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Light","Dark","System"].map(t => (
                    <button key={t} style={{ padding: "8px 20px", borderRadius: 9, border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 13, fontWeight: 600, background: t === "Light" ? "#0f172a" : "#fff", color: t === "Light" ? "#fff" : "#64748b" }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}