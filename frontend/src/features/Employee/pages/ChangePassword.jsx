import React, { useState, useEffect } from "react";
import api from "@/lib/apiClient";

/**
 * ChangePassword — Employee Dashboard page.
 *
 * Features:
 *  • Enter current password → verify before showing new-password fields
 *  • New Password + Confirm Password
 *  • Monthly limit counter (max 2/month) fetched from /api/login-access/password-summary
 *  • Email (username) is shown as read-only — cannot be changed
 *  • Responsive, polished UI consistent with EmployeeDashboard style
 */

const T = {
  navy:    "#0D1F2D",
  coral:   "#FF6B35",
  teal:    "#00C2A8",
  navyMid: "#1E3448",
  bg:      "#F5F7FB",
  border:  "#E8ECF2",
};


const EyeIcon = ({ visible }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

function PasswordInput({ label, value, onChange, placeholder, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b",
        textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10,
            border: `1.5px solid ${T.border}`, background: disabled ? "#f8fafc" : "#fff",
            fontSize: 14, color: T.navy, outline: "none", boxSizing: "border-box",
            fontFamily: "inherit", transition: "border 0.15s",
          }}
          onFocus={(e) => !disabled && (e.target.style.borderColor = T.coral)}
          onBlur={(e)  => (e.target.style.borderColor = T.border)}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          style={{
            position: "absolute", right: 12, top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none", cursor: disabled ? "default" : "pointer",
            color: "#94a3b8", padding: 0, display: "flex", alignItems: "center",
          }}
        >
          <EyeIcon visible={show} />
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword({ navigateTo }) {
  const [email,       setEmail]       = useState("");
  const [oldPwd,      setOldPwd]      = useState("");
  const [newPwd,      setNewPwd]      = useState("");
  const [confirmPwd,  setConfirmPwd]  = useState("");
  const [loading,     setLoading]     = useState(false);
  const [summaryLoad, setSummaryLoad] = useState(true);
  const [msg,         setMsg]         = useState({ type: "", text: "" });
  const [summary,     setSummary]     = useState(null);   // PasswordChangeSummary

  // Load current user's email and password summary
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token  = localStorage.getItem("token") || "";

    // Email from localStorage (set at login)
    const storedEmail = localStorage.getItem("userEmail") || "";
    setEmail(storedEmail);

    // Fetch monthly summary
    (async () => {
      setSummaryLoad(true);
      try {
        const res  = await api.get("/api/login-access/password-summary");
        const json = res.data;
        if (json.success) setSummary(json.data);
      } catch (_) {}
      finally { setSummaryLoad(false); }
    })();
  }, []);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    if (type === "success") setTimeout(() => setMsg({ type: "", text: "" }), 5000);
  };

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    // Client-side validation
    const pwdErr = validatePassword(newPwd);
    if (pwdErr) { showMsg("error", pwdErr); return; }
    if (newPwd !== confirmPwd) {
      showMsg("error", "New password and confirm password do not match.");
      return;
    }
    if (oldPwd === newPwd) {
      showMsg("error", "New password must be different from your current password.");
      return;
    }

    setLoading(true);
    try {
      const res  = await api.post("/api/login-access/change-password", {
        oldPassword:     oldPwd,
        newPassword:     newPwd,
        confirmPassword: confirmPwd,
      });
      const json = res.data;

      if (json.success) {
        showMsg("success", "✅ Password changed successfully!");
        setOldPwd(""); setNewPwd(""); setConfirmPwd("");

        // Refresh summary
        try {
          const r2 = await api.get("/api/login-access/password-summary");
          if (r2.data?.success) setSummary(r2.data.data);
        } catch (_) {}
      } else {
        showMsg("error", json.message || "Failed to change password.");
      }
    } catch (_) {
      showMsg("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Colour for the monthly limit badge
  const limitReached   = summary?.usedThisMonth >= 2;
  const usageColor     = limitReached ? "#dc2626"
    : (summary?.usedThisMonth === 1) ? "#d97706" : "#16a34a";
  const usageBg        = limitReached ? "#fef2f2"
    : (summary?.usedThisMonth === 1) ? "#fffbeb" : "#f0fdf4";
  const usageBorder    = limitReached ? "#fecaca"
    : (summary?.usedThisMonth === 1) ? "#fde68a" : "#bbf7d0";

  return (
    <div style={{ minHeight: "100vh", background: T.bg, padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .cpw * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
        .cpw .fd { font-family:'Sora',sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .cpw-card { animation:fadeUp .35s ease both; }
      `}</style>

      <div className="cpw" style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* ── Page heading ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,rgba(255,107,53,.15),rgba(0,194,168,.15))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: T.coral }}>
            <LockIcon />
          </div>
          <div>
            <h2 className="fd" style={{ fontSize: 20, fontWeight: 800,
              color: T.navy, margin: 0 }}>
              Change Password
            </h2>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              Keep your account secure
            </p>
          </div>
        </div>

        {/* ── Monthly limit badge ── */}
        {!summaryLoad && summary && (
          <div className="cpw-card" style={{
            background: usageBg, border: `1.5px solid ${usageBorder}`,
            borderRadius: 12, padding: "12px 16px", marginBottom: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8,
          }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: usageColor,
                textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>
                Monthly Password Changes
              </p>
              <p style={{ fontSize: 13, color: T.navy, fontWeight: 600, margin: "4px 0 0" }}>
                {summary.summaryText}
                {limitReached
                  ? " — Limit reached. Try again next month."
                  : ` — ${summary.remainingChanges} remaining`}
              </p>
            </div>
            {/* Visual bar */}
            <div style={{ display: "flex", gap: 6 }}>
              {[0, 1].map((i) => (
                <div key={i} style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: i < summary.usedThisMonth ? usageColor : "#e2e8f0",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Limit-reached warning ── */}
        {limitReached && (
          <div style={{
            background: "#fef2f2", border: "1.5px solid #fecaca",
            borderRadius: 12, padding: "14px 18px", marginBottom: 16,
            fontSize: 13, color: "#b91c1c", fontWeight: 600, lineHeight: 1.5,
          }}>
            🚫 You have reached your monthly password change limit (2 / 2).
            <br/>
            Please try again at the beginning of next month.
          </div>
        )}

        {/* ── Main form card ── */}
        <div className="cpw-card" style={{
          background: "#fff", borderRadius: 18,
          border: `1.5px solid ${T.border}`,
          boxShadow: "0 4px 24px rgba(13,31,45,0.06)",
          padding: "28px 24px",
        }}>

          {/* Username — read-only */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.07em", display: "block",
              marginBottom: 6 }}>
              Login Email (Username)
            </label>
            <div style={{
              padding: "11px 14px", borderRadius: 10,
              border: `1.5px solid ${T.border}`,
              background: "#f8fafc", fontSize: 14, color: "#475569",
              fontWeight: 500, display: "flex", alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span>{email || "Loading…"}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8",
                background: "#f1f5f9", padding: "3px 8px", borderRadius: 6 }}>
                Cannot change
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "5px 0 0" }}>
              Your email address is your permanent username and cannot be changed.
            </p>
          </div>

          <form onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <PasswordInput
              label="Current Password"
              value={oldPwd}
              onChange={setOldPwd}
              placeholder="Enter your current password"
              disabled={loading || limitReached}
            />

            <div style={{ height: 1, background: T.border }} />

            <PasswordInput
              label="New Password"
              value={newPwd}
              onChange={setNewPwd}
              placeholder="Min. 8 characters"
              disabled={loading || limitReached}
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPwd}
              onChange={setConfirmPwd}
              placeholder="Repeat your new password"
              disabled={loading || limitReached}
            />

            {/* Password strength hints */}
            {newPwd.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { pass: newPwd.length >= 8, text: "At least 8 characters" },
                  { pass: /[A-Z]/.test(newPwd), text: "Contains uppercase letter" },
                  { pass: /[0-9]/.test(newPwd), text: "Contains a number" },
                ].map(({ pass, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center",
                    gap: 6, fontSize: 12, color: pass ? "#16a34a" : "#94a3b8",
                    fontWeight: 600 }}>
                    <CheckIcon />
                    {text}
                  </div>
                ))}
              </div>
            )}

            {/* Feedback message */}
            {msg.text && (
              <div style={{
                padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                color:  msg.type === "success" ? "#15803d" : "#b91c1c",
              }}>
                {msg.text}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || limitReached || !oldPwd || !newPwd || !confirmPwd}
              style={{
                padding: "13px 0", borderRadius: 11, border: "none",
                background: (loading || limitReached)
                  ? "#cbd5e1"
                  : "linear-gradient(135deg,#FF6B35,#f97316)",
                color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: (loading || limitReached) ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: (!loading && !limitReached)
                  ? "0 4px 14px rgba(255,107,53,0.35)" : "none",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Changing Password…" : "Change Password"}
            </button>

          </form>
        </div>

        {/* ── Note ── */}
        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center",
          marginTop: 12, lineHeight: 1.6 }}>
          You may change your password up to <strong>2 times per month</strong>.
          The limit resets automatically on the 1st of each month.
        </p>
      </div>
    </div>
  );
}