import React, { useState, useEffect } from "react";
import api from "@/lib/apiClient";

/* ── tokens ── */
const T = {
  navy: "#0D1F2D",
  navyMid: "#1E3448",
  coral: "#FF6B35",
  teal: "#00C2A8",
  bg: "#F5F7FB",
  border: "#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.lv *{font-family:'DM Sans',sans-serif;box-sizing:border-box;}
.lv .fd{font-family:'Sora',sans-serif;}
.lv-card{background:#fff;border:1.5px solid ${T.border};border-radius:18px;box-shadow:0 2px 14px rgba(13,31,45,.05);}
.lv-row{transition:background .15s;cursor:default;}
.lv-row:hover{background:#FAFBFF;}
.lv-filter-btn{
  padding:6px 14px;border-radius:8px;font-size:11px;font-weight:700;
  border:1.5px solid transparent;cursor:pointer;transition:all .15s;
  font-family:'DM Sans',sans-serif;
}
.lv-input{
  border:1.5px solid ${T.border};border-radius:10px;
  padding:9px 12px;font-size:13px;font-family:'DM Sans',sans-serif;
  color:${T.navy};outline:none;transition:border-color .15s;background:#fff;
}
.lv-input:focus{border-color:${T.coral};}
@keyframes lvUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.lv-animate{animation:lvUp .35s ease both;}
`;

const STATUS_CFG = {
  APPROVED: { label: "Approved", bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0", dot: "#10B981" },
  PENDING: { label: "Pending", bg: "#FFF8EB", color: "#92400E", border: "#FDE68A", dot: "#F59E0B" },
  REJECTED: { label: "Declined", bg: "#FEF2F2", color: "#991B1B", border: "#FECACA", dot: "#EF4444" },
};

const LEAVE_TYPES = [
  { val: "CASUAL", label: "Casual Leave" },
  { val: "ANNUAL", label: "Annual Leave" },
  { val: "SICK", label: "Medical Leave" },
  { val: "MATERNITY", label: "Maternity Leave" },
  { val: "PATERNITY", label: "Paternity Leave" },
];

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];
const TOTAL_LEAVES = 24;

export default function EmployeeLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const [formData, setFormData] = useState({
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
  };

  const fetchLeaves = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await api.get("/api/leaves/my-leaves");
      setLeaves(r.data?.data || r.data || []);
    } catch {
      setError("Unable to load leave records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async () => {
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      await api.post("/api/leaves/apply", formData);

      setFormData({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setShowForm(false);
      showToast("Leave request submitted successfully!");
      fetchLeaves();
    } catch {
      setError("Unable to submit leave request.");
      showToast("Unable to submit leave request.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── leave summary logic ── */
  const approvedRequests = leaves.filter((l) => l.status === "APPROVED");
  const pending = leaves.filter((l) => l.status === "PENDING").length;
  const rejected = leaves.filter((l) => l.status === "REJECTED").length;
  const approved = approvedRequests.length;

  const usedLeaveDays = approvedRequests.reduce((sum, leave) => {
    return sum + (Number(leave.totalDays) || 0);
  }, 0);

  const available = Math.max(0, TOTAL_LEAVES - usedLeaveDays);

  const filtered =
    filterStatus === "ALL"
      ? leaves
      : leaves.filter((l) => l.status === filterStatus);

  const today = new Date().toISOString().split("T")[0];
  const consumedPercentage = Math.min(100, (usedLeaveDays / TOTAL_LEAVES) * 100);

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div
        className="lv"
        style={{
          minHeight: "100vh",
          background: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `3px solid ${T.coral}`,
              borderTopColor: "transparent",
              animation: "astSpin .8s linear infinite",
              margin: "0 auto 10px",
            }}
          />
          <style>{`@keyframes astSpin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>Loading leave records…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lv" style={{ minHeight: "100vh", background: T.bg, padding: "0 0 40px" }}>
      <style>{CSS}</style>

      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 100,
            padding: "12px 18px",
            borderRadius: 12,
            background: toast.type === "success" ? "#ECFDF5" : "#FEF2F2",
            border: `1.5px solid ${toast.type === "success" ? "#A7F3D0" : "#FECACA"}`,
            color: toast.type === "success" ? "#065F46" : "#991B1B",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{toast.type === "success" ? "✓" : "✗"}</span>
          {toast.msg}
        </div>
      )}

      <div
        style={{
          background: `linear-gradient(135deg,${T.navy},${T.navyMid})`,
          padding: "20px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: 40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,107,53,.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: 200,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(0,194,168,.06)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.coral,
                textTransform: "uppercase",
                letterSpacing: ".12em",
                marginBottom: 4,
              }}
            >
              SamayaHR · Time Off
            </p>
            <h1 className="fd" style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>
              Leave Planner
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4 }}>
              {available} of {TOTAL_LEAVES} days still available this year.
            </p>
          </div>

          <button
            onClick={() => setShowForm((s) => !s)}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "none",
              background: showForm
                ? "rgba(255,255,255,.15)"
                : `linear-gradient(135deg,${T.coral},#ff8c5a)`,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: showForm ? "none" : "0 4px 14px rgba(255,107,53,.35)",
              transition: "all .2s",
            }}
          >
            {showForm ? "✕ Cancel" : "+ Request Time Off"}
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        {showForm && (
          <div className="lv-card lv-animate" style={{ padding: 20 }}>
            <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: T.navy, marginBottom: 16 }}>
              New Time-Off Request
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="lv-form-grid">
              <style>{`@media(max-width:600px){.lv-form-grid{grid-template-columns:1fr!important}}`}</style>

              <div style={{ gridColumn: "span 1" }}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Leave Category
                </label>
                <select
                  className="lv-input"
                  style={{ width: "100%" }}
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                >
                  {LEAVE_TYPES.map((t) => (
                    <option key={t.val} value={t.val}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ gridColumn: "span 1" }}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Reason
                </label>
                <input
                  className="lv-input"
                  style={{ width: "100%" }}
                  placeholder="Brief reason for your request…"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  From
                </label>
                <input
                  type="date"
                  className="lv-input"
                  style={{ width: "100%" }}
                  value={formData.startDate}
                  min={today}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate: e.target.value,
                      endDate: "",
                    })
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  To
                </label>
                <input
                  type="date"
                  className="lv-input"
                  style={{ width: "100%" }}
                  value={formData.endDate}
                  min={formData.startDate || today}
                  disabled={!formData.startDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            {error && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 10 }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 10 }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    leaveType: "CASUAL",
                    startDate: "",
                    endDate: "",
                    reason: "",
                  });
                }}
                style={{
                  padding: "9px 18px",
                  borderRadius: 10,
                  border: `1.5px solid ${T.border}`,
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleApplyLeave}
                disabled={
                  submitting ||
                  !formData.startDate ||
                  !formData.endDate ||
                  !formData.reason.trim()
                }
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  border: "none",
                  background: `linear-gradient(135deg,${T.coral},#ff8c5a)`,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(255,107,53,.3)",
                  opacity:
                    submitting ||
                    !formData.startDate ||
                    !formData.endDate ||
                    !formData.reason.trim()
                      ? 0.5
                      : 1,
                }}
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </div>
        )}

        <div
          className="lv-kpi-grid lv-animate"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "14px",
            animationDelay: ".04s",
          }}
        >
          <style>{`@media(max-width:640px){.lv-kpi-grid{grid-template-columns:1fr 1fr!important}}`}</style>

          {[
            {
              label: "Total Requests",
              val: leaves.length,
              accent: T.coral,
              bg: "rgba(255,107,53,.08)",
              icon: "📋",
            },
            {
              label: "Approved",
              val: approved,
              accent: "#10B981",
              bg: "rgba(16,185,129,.08)",
              icon: "✅",
            },
            {
              label: "Under Review",
              val: pending,
              accent: "#F59E0B",
              bg: "rgba(245,158,11,.08)",
              icon: "⏳",
            },
            {
              label: "Days Remaining",
              val: available,
              accent: T.teal,
              bg: "rgba(0,194,168,.08)",
              icon: "🗓️",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="lv-card"
              style={{
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: k.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {k.icon}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    marginBottom: 2,
                  }}
                >
                  {k.label}
                </p>
                <p className="fd" style={{ fontSize: 22, fontWeight: 900, color: k.accent }}>
                  {k.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lv-card lv-animate" style={{ overflow: "hidden", animationDelay: ".08s" }}>
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${T.border}`,
              background: "linear-gradient(90deg,#FAFBFF,#F5F7FB)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: T.navy, marginBottom: 1 }}>
                Request History
              </p>
              <p style={{ fontSize: 11, color: "#94a3b8" }}>
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FILTERS.map((f) => {
                const active = filterStatus === f;
                const cfg = f === "ALL" ? null : STATUS_CFG[f];

                return (
                  <button
                    key={f}
                    className="lv-filter-btn"
                    onClick={() => setFilterStatus(f)}
                    style={{
                      background: active
                        ? cfg
                          ? cfg.bg
                          : `linear-gradient(135deg,${T.coral},#ff8c5a)`
                        : "#F1F5F9",
                      color: active ? (cfg ? cfg.color : "#fff") : "#64748b",
                      borderColor: active ? (cfg ? cfg.border : "transparent") : T.border,
                      boxShadow: active && !cfg ? "0 3px 10px rgba(255,107,53,.25)" : "none",
                    }}
                  >
                    {f === "ALL" ? "All Requests" : STATUS_CFG[f]?.label || f}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})` }}>
                  {["Ref #", "Leave Category", "Purpose", "Period", "Duration", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(255,255,255,.75)",
                        textTransform: "uppercase",
                        letterSpacing: ".07em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "48px 24px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 36 }}>🗓️</span>
                        <p style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>No requests found</p>
                        <p style={{ fontSize: 12, color: "#94a3b8" }}>
                          {filterStatus === "ALL"
                            ? "You haven't submitted any leave requests yet."
                            : `No ${STATUS_CFG[filterStatus]?.label.toLowerCase() || filterStatus.toLowerCase()} requests.`}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => {
                    const sc = STATUS_CFG[l.status] || {
                      label: l.status,
                      bg: "#F1F5F9",
                      color: "#64748b",
                      border: T.border,
                      dot: "#94a3b8",
                    };

                    const typeLabel =
                      LEAVE_TYPES.find((t) => t.val === l.leaveType)?.label ||
                      l.leaveType ||
                      "—";

                    return (
                      <tr key={l.id} className="lv-row" style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: "12px 16px" }}>
                          <code
                            style={{
                              fontSize: 11,
                              background: "#F1F5F9",
                              padding: "3px 8px",
                              borderRadius: 6,
                              color: "#475569",
                              border: `1px solid ${T.border}`,
                              fontFamily: "monospace",
                            }}
                          >
                            #{l.id}
                          </code>
                        </td>

                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>
                            {typeLabel}
                          </span>
                        </td>

                        <td style={{ padding: "12px 16px", maxWidth: 180 }}>
                          <p
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 180,
                            }}
                          >
                            {l.reason || "—"}
                          </p>
                        </td>

                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: T.navy }}>
                            {l.startDate} → {l.endDate}
                          </p>
                        </td>

                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: 32,
                              height: 22,
                              padding: "0 8px",
                              borderRadius: 6,
                              background: "rgba(255,107,53,.08)",
                              color: T.coral,
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            {Number(l.totalDays) || 0}
                          </span>
                        </td>

                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: sc.bg,
                              color: sc.color,
                              border: `1px solid ${sc.border}`,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: sc.dot,
                                display: "inline-block",
                              }}
                            />
                            {sc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lv-card lv-animate" style={{ padding: "16px 20px", animationDelay: ".12s" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>
              Annual Leave Balance
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>
              <span style={{ fontWeight: 800, color: T.coral }}>{usedLeaveDays}</span> used ·{" "}
              <span style={{ fontWeight: 800, color: T.teal }}>{available}</span> remaining of{" "}
              {TOTAL_LEAVES}
            </p>
          </div>

          <div style={{ height: 8, borderRadius: 6, background: T.border, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: 6,
                background: `linear-gradient(90deg,${T.coral},${T.teal})`,
                width: `${consumedPercentage}%`,
                transition: "width .6s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 10, color: "#94a3b8" }}>
              {Math.round(consumedPercentage)}% consumed
            </p>
            <p style={{ fontSize: 10, color: "#94a3b8" }}>
              {rejected > 0 ? `${rejected} declined` : "No declined requests"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}