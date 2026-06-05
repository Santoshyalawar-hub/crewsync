import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/lib/apiClient";

/*
  ForgotPasswordPage
  ──────────────────────────────────────────────────────────────────────────────
  Step 1 (default):  Employee enters email → POST /api/auth/forgot-password
                     → "Check your inbox" success screen shown

  Step 2 (when ?token=xxx in URL):
                     Employee enters new password → POST /api/auth/reset-password
                     → "Password updated" success screen → redirect to /login
  ──────────────────────────────────────────────────────────────────────────────
*/

const C = {
  coral: "#FF6B35",
  navy:  "#0D1F2D",
};

const API = API_BASE_URL.replace(/\/+$/, "");

async function apiFetch(path, body) {
  const res = await fetch(`${API}${path}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.success) throw new Error(data?.message || "Request failed");
  return data;
}

export default function ForgotPasswordPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Detect reset token in URL params
  const params    = new URLSearchParams(location.search);
  const resetToken = params.get("token") || "";

  const [step,     setStep]     = useState(resetToken ? "reset" : "request");
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);  // success screen
  const [error,    setError]    = useState("");

  useEffect(() => {
    document.title = step === "reset" ? "Reset Password · SamayaHR" : "Forgot Password · SamayaHR";
  }, [step]);

  /* ── STEP 1: request reset email ── */
  const handleRequest = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      await apiFetch("/api/auth/forgot-password", { email: email.trim().toLowerCase() });
      setDone(true);
    } catch {
      // Always show success to avoid email enumeration
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 2: submit new password ── */
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (pass.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pass !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await apiFetch("/api/auth/reset-password", { token: resetToken, newPassword: pass });
      setDone(true);
    } catch (err) {
      setError(err.message || "The reset link may have expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .fp-sora { font-family: 'Sora', sans-serif !important; }
        @keyframes fp-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fp-fade { animation: fp-fadeUp .4s ease both; }
        .fp-input {
          width:100%; border:1.5px solid #e5e7eb; border-radius:12px;
          background:#fff; padding:11px 14px 11px 42px; font-size:14px;
          color:#0D1F2D; outline:none; transition:border-color .2s, box-shadow .2s;
        }
        .fp-input::placeholder { color:#9ca3af; }
        .fp-input:focus { border-color:${C.coral}; box-shadow:0 0 0 3px rgba(255,107,53,.1); }
        .fp-btn {
          width:100%; background:linear-gradient(135deg,#FF6B35,#FF5722); color:#fff;
          font-weight:800; font-size:15px; padding:13px; border-radius:14px; border:none;
          cursor:pointer; box-shadow:0 4px 24px rgba(255,107,53,.38);
          transition:transform .22s, box-shadow .22s; display:flex;
          align-items:center; justify-content:center; gap:8px;
        }
        .fp-btn:hover    { transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,107,53,.5); }
        .fp-btn:disabled { opacity:.65; cursor:not-allowed; transform:none; }
        @keyframes fp-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <header style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", height:64, display:"flex", alignItems:"center", padding:"0 24px", boxShadow:"0 1px 10px rgba(0,0,0,.05)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={()=>navigate("/login")} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer" }}>
            <img src="/SamayaHRSidebar.png" alt="SamayaHR" style={{ width:32, height:32, borderRadius:10, objectFit:"contain" }} onError={e=>e.target.style.display="none"} />
            <span className="fp-sora" style={{ fontWeight:900, fontSize:20, color:C.navy }}>Samaya<span style={{ color:C.coral }}>HR</span></span>
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"#6b7280", background:"none", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"7px 16px", cursor:"pointer" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.coral;e.currentTarget.style.color=C.coral;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280";}}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Sign In
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div className="fp-fade" style={{ background:"#fff", borderRadius:24, padding:"40px", width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(13,31,45,.12)" }}>

          {/* ── SUCCESS SCREENS ── */}
          {done && step === "request" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:72, height:72, borderRadius:20, background:"rgba(16,185,129,.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
                <svg width="36" height="36" fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h2 className="fp-sora" style={{ fontSize:24, fontWeight:900, color:C.navy, margin:"0 0 10px" }}>Check your inbox</h2>
              <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7, margin:"0 0 24px" }}>
                If <strong>{email}</strong> is registered, you'll receive a password reset link within a few minutes. Check your spam folder if you don't see it.
              </p>
              <button className="fp-btn" onClick={()=>navigate("/login")}>
                Back to Sign In
              </button>
              <button onClick={()=>{setDone(false);setEmail("");}} style={{ marginTop:12, width:"100%", background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#9ca3af", fontWeight:600 }}>
                Didn't receive it? Try again
              </button>
            </div>
          )}

          {done && step === "reset" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:72, height:72, borderRadius:20, background:"rgba(16,185,129,.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
                <svg width="36" height="36" fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h2 className="fp-sora" style={{ fontSize:24, fontWeight:900, color:C.navy, margin:"0 0 10px" }}>Password updated!</h2>
              <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7, margin:"0 0 24px" }}>
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <button className="fp-btn" onClick={()=>navigate("/login")}>
                Sign In Now
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
          )}

          {/* ── STEP 1: Request reset ── */}
          {!done && step === "request" && (
            <>
              {/* Icon + title */}
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#FF6B35,#FF5722)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 6px 20px rgba(255,107,53,.35)" }}>
                  <svg width="30" height="30" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                </div>
                <h2 className="fp-sora" style={{ fontSize:24, fontWeight:900, color:C.navy, margin:"0 0 8px" }}>Forgot your password?</h2>
                <p style={{ fontSize:13, color:"#64748b", margin:0, lineHeight:1.6 }}>Enter your work email and we'll send a reset link.</p>
              </div>

              {error && (
                <div style={{ background:"#fef2f2", border:"1.5px solid #fecaca", borderRadius:12, padding:"11px 14px", marginBottom:16, fontSize:13, color:"#dc2626", fontWeight:600 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleRequest} style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
                    Work Email <span style={{ color:C.coral }}>*</span>
                  </label>
                  <div style={{ position:"relative" }}>
                    <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <input type="email" className="fp-input" placeholder="you@company.com"
                      value={email} onChange={e=>{setEmail(e.target.value);setError("");}} required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="fp-btn">
                  {loading
                    ? <><svg style={{ animation:"fp-spin 1s linear infinite", width:15, height:15 }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity:.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity:.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</>
                    : <>Send Reset Link <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                  }
                </button>
              </form>

              <p style={{ marginTop:20, textAlign:"center", fontSize:12, color:"#9ca3af", lineHeight:1.6 }}>
                Remembered it?{" "}
                <button onClick={()=>navigate("/login")} style={{ background:"none", border:"none", cursor:"pointer", color:C.coral, fontWeight:700, fontSize:12, padding:0 }}>Sign in →</button>
              </p>
            </>
          )}

          {/* ── STEP 2: New password form ── */}
          {!done && step === "reset" && (
            <>
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#FF6B35,#FF5722)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 6px 20px rgba(255,107,53,.35)" }}>
                  <svg width="30" height="30" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h2 className="fp-sora" style={{ fontSize:24, fontWeight:900, color:C.navy, margin:"0 0 8px" }}>Set new password</h2>
                <p style={{ fontSize:13, color:"#64748b", margin:0, lineHeight:1.6 }}>Choose a strong password for your account.</p>
              </div>

              {error && (
                <div style={{ background:"#fef2f2", border:"1.5px solid #fecaca", borderRadius:12, padding:"11px 14px", marginBottom:16, fontSize:13, color:"#dc2626", fontWeight:600 }}>
                  {error}
                  {error.includes("expired") && (
                    <button onClick={()=>navigate("/forgot-password")} style={{ display:"block", marginTop:6, background:"none", border:"none", cursor:"pointer", color:C.coral, fontWeight:700, fontSize:12, padding:0, textDecoration:"underline" }}>
                      Request a new reset link
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleReset} style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
                    New Password <span style={{ color:C.coral }}>*</span>
                  </label>
                  <div style={{ position:"relative" }}>
                    <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </div>
                    <input
                      type={showPass ? "text" : "password"}
                      className="fp-input"
                      placeholder="At least 8 characters"
                      style={{ paddingRight:42 }}
                      value={pass}
                      onChange={e=>{setPass(e.target.value);setError("");}}
                      required minLength={8} />
                    <button type="button" onClick={()=>setShowPass(p=>!p)}
                      style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0 }}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        {showPass
                          ? <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></>
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
                    Confirm Password <span style={{ color:C.coral }}>*</span>
                  </label>
                  <div style={{ position:"relative" }}>
                    <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <input
                      type={showPass ? "text" : "password"}
                      className="fp-input"
                      placeholder="Repeat password"
                      value={confirm}
                      onChange={e=>{setConfirm(e.target.value);setError("");}}
                      required />
                  </div>
                  {confirm && pass !== confirm && (
                    <p style={{ fontSize:11, color:"#ef4444", margin:"5px 0 0", fontWeight:600 }}>Passwords don't match</p>
                  )}
                </div>

                <button type="submit" disabled={loading || (confirm && pass !== confirm)} className="fp-btn" style={{ marginTop:4 }}>
                  {loading
                    ? <><svg style={{ animation:"fp-spin 1s linear infinite", width:15, height:15 }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity:.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity:.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Updating...</>
                    : <>Reset Password <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <footer style={{ textAlign:"center", padding:"20px", fontSize:12, color:"#9ca3af" }}>
        © {new Date().getFullYear()} SamayaHR · <a href="/privacy" style={{ color:"#FF6B35", textDecoration:"none" }}>Privacy Policy</a>
      </footer>
    </div>
  );
}
