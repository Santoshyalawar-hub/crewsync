import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/apiClient";
import { Upload, X, FileText, ImageIcon, Eye, Download, AlertCircle, Plus, Trash2, RefreshCw, BookOpen } from "lucide-react";

/* ── Design tokens ── */
const T = {
  navy: "#0B1020", navyMid: "#374151", coral: "#8B5CF6", teal: "#06B6D4",
  bg: "#F5F7FB", border: "#E8ECF2",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.ap { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.ap .fd { font-family:'Sora',sans-serif; }
.ap-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.ap-input { width:100%; border:1.5px solid ${T.border}; border-radius:10px; padding:10px 14px; font-size:14px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; transition:border-color .2s,box-shadow .2s; background:#fff; }
.ap-input:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
.ap-label { font-size:12px; font-weight:700; color:#64748b; margin-bottom:6px; display:block; text-transform:uppercase; letter-spacing:.06em; }
.ap-btn-primary { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:11px; background:linear-gradient(135deg,${T.coral},#06B6D4); color:#fff; font-size:13px; font-weight:800; border:none; cursor:pointer; transition:all .2s; box-shadow:0 4px 16px rgba(139,92,246,.3); font-family:'DM Sans',sans-serif; }
.ap-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(139,92,246,.4); }
.ap-btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
.ap-btn-ghost { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; border:1.5px solid ${T.border}; background:#fff; color:${T.navy}; font-size:12px; font-weight:700; cursor:pointer; transition:all .15s; font-family:'DM Sans',sans-serif; }
.ap-btn-ghost:hover { border-color:${T.coral}; color:${T.coral}; }
.ap-policy-row { background:#fff; border:1.5px solid ${T.border}; border-radius:14px; padding:16px 18px; transition:all .15s; }
.ap-policy-row:hover { border-color:rgba(139,92,246,.3); box-shadow:0 4px 16px rgba(13,31,45,.07); }
.ap-upload-zone { border:2px dashed ${T.border}; border-radius:12px; padding:30px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; background:#fafbff; }
.ap-upload-zone:hover { border-color:${T.coral}; background:rgba(139,92,246,.03); }
@keyframes apUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.ap-in { animation:apUp .35s ease both; }
.ap-tag { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:999px; font-size:10px; font-weight:700; }
`;

export default function OperatorPlaybooks() {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [policyType,  setPlaybookType]  = useState("COMPANY_POLICY");
  const [filterType,  setFilterType]  = useState("ALL");
  const [file,        setFile]        = useState(null);
  const [policies,    setPlaybooks]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(null);
  const [error,       setError]       = useState(null);
  const [success,     setSuccess]     = useState(null);
  const [showForm,    setShowForm]    = useState(false);

  const tenantCode = localStorage.getItem("tenantCode") || "";
  const companyId  = localStorage.getItem("companyId")  || "";
  const userId     = localStorage.getItem("userId")     || "";

  /* ── Fetch policies ── */
  const loadPlaybooks = useCallback(async () => {
    if (!tenantCode) {
      setError("Tenant code not found. Please login again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/api/policies/tenant/${tenantCode}`);
      const data = res.data?.data || res.data || [];
      setPlaybooks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error loading policies:", err);
      setError(err.response?.data?.message || "Failed to load policies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [tenantCode]);

  useEffect(() => {
    loadPlaybooks();
  }, [loadPlaybooks]);

  /* ── File change ── */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowed.includes(f.type)) {
      setError("Only PDF, Word, and image files (JPG, PNG) are allowed.");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setError(null);
    setFile(f);
  };

  /* ── Save policy ── */
  const savePlaybook = async () => {
    if (!title.trim()) {
      setError("Playbook title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Playbook description is required.");
      return;
    }
    if (!tenantCode) {
      setError("Tenant code not found. Please login again.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("tenantCode", tenantCode);
      formData.append("policyType", policyType);

      // Only append if valid numbers
      if (companyId && !isNaN(Number(companyId))) {
        formData.append("companyId", String(Number(companyId)));
      }
      if (userId && !isNaN(Number(userId))) {
        formData.append("createdBy", String(Number(userId)));
      }

      // ✅ KEY FIX: only append if it's a real File instance with actual bytes.
      // Previously, an empty object {} was being appended when no file was
      // selected, which caused Spring to reject the request with 400.
      if (file && file instanceof File && file.size > 0) {
        formData.append("file", file);
      }

      await api.post("/api/policies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setDescription("");
      setFile(null);
      setPlaybookType("COMPANY_POLICY");
      setShowForm(false);
      setSuccess("Playbook published successfully!");
      setTimeout(() => setSuccess(null), 4000);
      await loadPlaybooks();
    } catch (err) {
      console.error("Error saving policy:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save policy. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete policy ── */
  const deletePlaybook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    setDeleting(id);
    try {
      await api.delete(`/api/policies/${id}`);
      setSuccess("Playbook deleted.");
      setTimeout(() => setSuccess(null), 3000);
      await loadPlaybooks();
    } catch (err) {
      console.error("Error deleting policy:", err);
      setError(err.response?.data?.message || "Failed to delete policy.");
    } finally {
      setDeleting(null);
    }
  };

  /* ── Force-download helper: inserts fl_attachment into Cloudinary URLs ── */
  const getDownloadUrl = (url, fileName) => {
    if (!url) return url;
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
      const label = fileName ? `fl_attachment:${encodeURIComponent(fileName.replace(/\s+/g, "_"))}` : "fl_attachment";
      return url.replace("/upload/", `/upload/${label}/`);
    }
    return url;
  };

  /* ── File icon helper ── */
  const FileIcon = ({ name = "" }) => {
    if (name.endsWith(".pdf"))        return <FileText size={16} color="#EF4444" />;
    if (/\.(doc|docx)$/i.test(name)) return <FileText size={16} color="#3b82f6" />;
    return <ImageIcon size={16} color="#8b5cf6" />;
  };

  /* ── Early error state (no tenant) ── */
  if (!tenantCode) {
    return (
      <div className="ap" style={{ padding: "32px 24px" }}>
        <style>{CSS}</style>
        <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <AlertCircle size={18} color="#EF4444" />
          <p style={{ fontSize: 13, color: "#991b1b", fontWeight: 600 }}>Tenant code not found. Please log out and log back in.</p>
        </div>
      </div>
    );
  }

  const filteredPlaybooks = policies.filter(p => filterType === "ALL" || p.policyType === filterType);

  return (
    <div className="ap" style={{ padding: "0 0 56px" }}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, padding: "22px 26px", position: "relative", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ position: "absolute", top: -50, right: 60, width: 180, height: 180, borderRadius: "50%", background: "rgba(139,92,246,.07)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.coral, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>CrewSync · Playbook Operations</p>
            <h1 className="fd" style={{ fontSize: 23, fontWeight: 900, color: "#fff", margin: 0 }}>Workspace Playbooks</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4 }}>Publish and manage policies visible to all employees in your organisation.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ap-btn-ghost" onClick={loadPlaybooks} style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)", background: "rgba(255,255,255,.08)" }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="ap-btn-primary" onClick={() => setShowForm(s => !s)}>
              <Plus size={14} /> {showForm ? "Cancel" : "New Playbook"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 26px" }}>

        {/* ── ALERTS ── */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }} className="ap-in">
            <AlertCircle size={16} color="#EF4444" />
            <p style={{ fontSize: 13, color: "#991b1b", fontWeight: 600 }}>{error}</p>
            <button onClick={() => setError(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer" }}>
              <X size={14} color="#991b1b" />
            </button>
          </div>
        )}

        {success && (
          <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }} className="ap-in">
            <span style={{ fontSize: 16 }}>✅</span>
            <p style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>{success}</p>
          </div>
        )}

        {/* ── NEW POLICY FORM ── */}
        {showForm && (
          <div className="ap-card ap-in" style={{ marginBottom: 24 }}>
            <div style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <BookOpen size={16} color={T.coral} />
              <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Create New Playbook</p>
            </div>

            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label className="ap-label">Playbook Title *</label>
                <input
                  className="ap-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. TimeAway Playbook 2025"
                />
              </div>

              <div>
                <label className="ap-label">Description *</label>
                <textarea
                  className="ap-input"
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the policy details…"
                  style={{ resize: "vertical" }}
                />
              </div>

              <div>
                <label className="ap-label">Playbook Type</label>
                <select
                  className="ap-input"
                  value={policyType}
                  onChange={e => setPlaybookType(e.target.value)}
                  style={{ appearance: "auto" }}
                >
                  <option value="COMPANY_POLICY">Workspace Playbook</option>
                  <option value="PeopleOps_POLICY">PeopleOps Playbook</option>
                </select>
              </div>

              <div>
                <label className="ap-label">Attachment (optional)</label>
                {!file ? (
                  <label className="ap-upload-zone">
                    <Upload size={28} color="#94a3b8" style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Click to upload or drag & drop</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>PDF, Word, PNG, JPG — max 10 MB</p>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8faff", border: `1.5px solid ${T.border}`, borderRadius: 10 }}>
                    <FileIcon name={file.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => setFile(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                      <X size={16} color="#94a3b8" />
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  className="ap-btn-ghost"
                  onClick={() => {
                    setShowForm(false);
                    setTitle("");
                    setDescription("");
                    setFile(null);
                    setPlaybookType("COMPANY_POLICY");
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button className="ap-btn-primary" onClick={savePlaybook} disabled={saving}>
                  {saving ? "Publishing…" : "Publish Playbook"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── POLICY LIST ── */}
        <div className="ap-card">
          <div style={{ background: `linear-gradient(90deg,${T.navy},${T.navyMid})`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BookOpen size={16} color={T.coral} />
              <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Published Playbooks</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", background: "rgba(255,255,255,.1)", borderRadius: 8, padding: 3, gap: 2 }}>
                {[["ALL", "All"], ["COMPANY_POLICY", "Workspace"], ["PeopleOps_POLICY", "PeopleOps"]].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setFilterType(val)}
                    style={{
                      padding: "4px 10px", borderRadius: 6, border: "none",
                      fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans",
                      background: filterType === val ? "#fff" : "transparent",
                      color: filterType === val ? T.navy : "rgba(255,255,255,.7)",
                      transition: "all .15s"
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(139,92,246,.2)", color: T.coral, fontSize: 11, fontWeight: 700, border: "1px solid rgba(139,92,246,.3)" }}>
                {filteredPlaybooks.length} {filteredPlaybooks.length === 1 ? "policy" : "policies"}
              </span>
            </div>
          </div>

          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${T.coral}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .9s linear infinite", margin: "0 auto 10px" }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <p style={{ fontSize: 13, color: "#64748b" }}>Loading policies…</p>
              </div>
            ) : filteredPlaybooks.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", border: `1.5px dashed ${T.border}`, borderRadius: 14, background: "#fafbff" }}>
                <span style={{ fontSize: 36, display: "block", marginBottom: 10 }}>📋</span>
                <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: T.navy, marginBottom: 6 }}>No policies published yet</p>
                <p style={{ fontSize: 12, color: "#94a3b8" }}>Click "New Playbook" to create and publish your first policy.</p>
              </div>
            ) : (
              filteredPlaybooks.map((p, i) => (
                <div key={p.id} className="ap-policy-row ap-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <p className="fd" style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{p.title}</p>

                        {p.policyType === "PeopleOps_POLICY" ? (
                          <span className="ap-tag" style={{ background: "rgba(99,102,241,.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,.25)" }}>PeopleOps Playbook</span>
                        ) : (
                          <span className="ap-tag" style={{ background: "rgba(139,92,246,.1)", color: T.coral, border: "1px solid rgba(139,92,246,.25)" }}>Workspace Playbook</span>
                        )}

                        {p.fileUrl && (
                          <span className="ap-tag" style={{ background: "rgba(6,182,212,.1)", color: T.teal, border: "1px solid rgba(6,182,212,.25)" }}>
                            <FileText size={10} /> Attachment
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, marginBottom: 8 }}>{p.description}</p>

                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {p.createdAt && (
                          <p style={{ fontSize: 11, color: "#94a3b8" }}>
                            Published: {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        )}
                        {p.createdByName && (
                          <p style={{ fontSize: 11, color: "#94a3b8" }}>By: {p.createdByName}</p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      {p.fileUrl && (
                        <>
                          <a
                            href={p.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 9, border: `1.5px solid rgba(6,182,212,.3)`, background: "rgba(6,182,212,.08)", color: T.teal, fontSize: 11, fontWeight: 700, textDecoration: "none" }}
                          >
                            <Eye size={11} /> View
                          </a>
                          <a
                            href={getDownloadUrl(p.fileUrl, p.fileName)}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 9, border: `1.5px solid rgba(99,102,241,.3)`, background: "rgba(99,102,241,.08)", color: "#6366f1", fontSize: 11, fontWeight: 700, textDecoration: "none" }}
                          >
                            <Download size={11} /> Download
                          </a>
                        </>
                      )}

                      <button
                        onClick={() => deletePlaybook(p.id)}
                        disabled={deleting === p.id}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 9, border: "1.5px solid rgba(239,68,68,.25)", background: "rgba(239,68,68,.06)", color: "#EF4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                      >
                        {deleting === p.id ? "…" : <><Trash2 size={11} /> Delete</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}