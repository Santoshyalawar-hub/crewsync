import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/apiClient";
import {
  Search, Edit2, Eye, Trash2, RefreshCw, ChevronDown,
  User, Mail, Phone, Briefcase, Building2, Calendar,
  Shield, AlertCircle, X, Check,
} from "lucide-react";

/* ── Design tokens ── */
const T = {
  navy: "#0B1020", navyMid: "#374151", coral: "#8B5CF6", teal: "#06B6D4",
  bg: "#F5F7FB", border: "#E8ECF2",
};

const DEPARTMENTS = [
  "Engineering", "Product", "Design", "Sales", "Marketing",
  "MoneyOps", "PeopleOps", "Operations", "Customer Success", "Legal", "Other",
];
const ROLES = ["EMPLOYEE", "ADMIN"];
const STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
.me { font-family:'DM Sans',sans-serif; background:${T.bg}; min-height:100vh; }
.me .fd { font-family:'Sora',sans-serif; }
.me-card { background:#fff; border:1.5px solid ${T.border}; border-radius:18px; box-shadow:0 2px 14px rgba(13,31,45,.05); overflow:hidden; }
.me-input { width:100%; border:1.5px solid ${T.border}; border-radius:10px; padding:9px 14px; font-size:13px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; transition:border-color .2s,box-shadow .2s; background:#fff; }
.me-input:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
.me-select { appearance:none; width:100%; border:1.5px solid ${T.border}; border-radius:10px; padding:9px 34px 9px 14px; font-size:13px; font-family:'DM Sans',sans-serif; color:${T.navy}; outline:none; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center; transition:border-color .2s; }
.me-select:focus { border-color:${T.coral}; box-shadow:0 0 0 3px rgba(139,92,246,.1); }
.me-row { background:#fff; border-bottom:1px solid ${T.border}; transition:background .15s; }
.me-row:last-child { border-bottom:none; }
.me-row:hover { background:#FAFBFF; }
.me-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:9px; border:1.5px solid; font-size:11px; font-weight:700; cursor:pointer; transition:all .15s; font-family:'DM Sans',sans-serif; }
.me-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:999px; font-size:10px; font-weight:700; }
@keyframes meUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.me-in { animation:meUp .35s ease both; }
@keyframes spin { to{transform:rotate(360deg)} }
`;

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    ACTIVE:    { bg: "rgba(16,185,129,.1)",  color: "#10b981", border: "rgba(16,185,129,.3)",  label: "Active"    },
    INACTIVE:  { bg: "rgba(148,163,184,.1)", color: "#94a3b8", border: "rgba(148,163,184,.3)", label: "Inactive"  },
    SUSPENDED: { bg: "rgba(239,68,68,.1)",   color: "#EF4444", border: "rgba(239,68,68,.3)",   label: "Suspended" },
  };
  const s = map[status] || map.INACTIVE;
  return (
    <span className="me-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
}

/* ── Role badge ── */
function RoleBadge({ role }) {
  const isOperator = role === "ADMIN";
  return (
    <span className="me-badge" style={{
      background: isOperator ? "rgba(129,140,248,.1)" : "rgba(6,182,212,.1)",
      color:      isOperator ? "#818cf8" : T.teal,
      border:     isOperator ? "1px solid rgba(129,140,248,.3)" : "1px solid rgba(6,182,212,.3)",
    }}>
      {isOperator ? <Shield size={9} style={{ marginRight: 4 }} /> : null}
      {role}
    </span>
  );
}

/* ── Avatar ── */
function Avatar({ name = "?", photoUrl }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (photoUrl) return <img src={photoUrl} alt={name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(139,92,246,.2)" }} />;
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${T.coral},${T.teal})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800, flexShrink: 0, fontFamily: "Sora,sans-serif" }}>
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function ManagePersons() {
  const [employees,   setPersons]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [filterDept,  setFilterDept]  = useState("All");
  const [filterRole,  setFilterRole]  = useState("All");
  const [filterStatus,setFilterStatus]= useState("All");
  const [viewEmp,     setViewEmp]     = useState(null);
  const [editEmp,     setEditEmp]     = useState(null);
  const [editForm,    setEditForm]    = useState({});
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(null);
  const [successMsg,  setSuccessMsg]  = useState(null);
  const [userTypeTab, setUserTypeTab] = useState("ALL"); // "ALL" | "EMPLOYEE" | "ADMIN"

  /* ── Fetch employees ── */
  const fetchPersons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await api.get("/api/users/tenant");
      const raw  = res.data?.data || res.data || [];
      setPersons(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error("ManagePersons fetch error:", err);
      setError("Failed to load employees. Please try again.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPersons(); }, [fetchPersons]);

  /* ── Filter ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter(e => {
      if (q && !`${e.fullName} ${e.email} ${e.employeeId} ${e.department} ${e.position}`.toLowerCase().includes(q)) return false;
      if (filterDept   !== "All" && e.department !== filterDept)   return false;
      if (filterRole   !== "All" && e.role       !== filterRole)   return false;
      if (filterStatus !== "All" && e.status      !== filterStatus) return false;
      if (userTypeTab === "EMPLOYEE" && e.role !== "EMPLOYEE") return false;
      if (userTypeTab === "ADMIN"    && e.role === "EMPLOYEE") return false;
      return true;
    });
  }, [employees, search, filterDept, filterRole, filterStatus, userTypeTab]);

  /* ── Open edit modal ── */
  const openEdit = (emp) => {
    setEditEmp(emp);
    setEditForm({
      fullName:   emp.fullName   || "",
      email:      emp.email      || "",
      mobile:     emp.mobile     || "",
      position:   emp.position   || "",
      department: emp.department || "",
      role:       emp.role       || "EMPLOYEE",
      status:     emp.status     || "ACTIVE",
      employeeId: emp.employeeId || "",
      joiningDate:emp.joiningDate|| "",
    });
  };

  /* ── Save edit ── */
  const saveEdit = async () => {
    if (!editEmp) return;
    setSaving(true);
    try {
      await api.put(`/api/users/tenant/${editEmp.id}`, editForm);
      setSuccessMsg("Person updated successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
      setEditEmp(null);
      await fetchPersons();
    } catch (err) {
      console.error("Update employee error:", err);
      setError(err.response?.data?.message || "Failed to update employee.");
    } finally { setSaving(false); }
  };

  /* ── Delete employee ── */
  const deletePerson = async (emp) => {
    if (!window.confirm(`Remove ${emp.fullName} from the system?`)) return;
    setDeleting(emp.id);
    try {
      await api.delete(`/api/users/tenant/${emp.id}`);
      setSuccessMsg(`${emp.fullName} removed successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchPersons();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete employee.");
    } finally { setDeleting(null); }
  };

  /* ── Unique departments ── */
  const departments = useMemo(() => {
    const set = new Set(employees.map(e => e.department).filter(Boolean));
    return ["All", ...set];
  }, [employees]);

  return (
    <div className="me" style={{ padding: "0 0 56px" }}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, padding: "22px 26px", position: "relative", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ position: "absolute", top: -50, right: 60, width: 180, height: 180, borderRadius: "50%", background: "rgba(139,92,246,.07)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.coral, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>CrewSync · People</p>
            <h1 className="fd" style={{ fontSize: 23, fontWeight: 900, color: "#fff", margin: 0 }}>People Grid</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4 }}>
              {employees.length} employee{employees.length !== 1 ? "s" : ""} in your organisation
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Person / Operator toggle */}
            <div style={{ display: "flex", background: "rgba(255,255,255,.1)", borderRadius: 10, padding: 3, gap: 2 }}>
              {[["ALL","All"],["EMPLOYEE","Persons"],["ADMIN","Operators"]].map(([val, lbl]) => (
                <button key={val} onClick={() => setUserTypeTab(val)}
                  style={{ padding: "6px 13px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans",
                    background: userTypeTab === val ? "#fff" : "transparent",
                    color:      userTypeTab === val ? T.navy  : "rgba(255,255,255,.7)",
                    transition: "all .15s" }}>
                  {lbl}
                </button>
              ))}
            </div>
            <button onClick={fetchPersons} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 11, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans" }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 26px" }}>

        {/* ── ALERTS ── */}
        {error && (
          <div className="me-in" style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <AlertCircle size={16} color="#EF4444" />
            <p style={{ fontSize: 13, color: "#991b1b", fontWeight: 600, flex: 1 }}>{error}</p>
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} color="#991b1b" /></button>
          </div>
        )}
        {successMsg && (
          <div className="me-in" style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Check size={16} color="#16a34a" />
            <p style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>{successMsg}</p>
          </div>
        )}

        {/* ── FILTERS ── */}
        <div className="me-card" style={{ marginBottom: 18, padding: "16px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input className="me-input" style={{ paddingLeft: 36 }} placeholder="Search by name, email, department…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ position: "relative", minWidth: 140 }}>
              <select className="me-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ position: "relative", minWidth: 120 }}>
              <select className="me-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                {["All", ...ROLES].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ position: "relative", minWidth: 130 }}>
              <select className="me-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                {["All", ...STATUSES].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 10 }}>
            Showing {filtered.length} of {employees.length} employees
          </p>
        </div>

        {/* ── TABLE ── */}
        <div className="me-card">
          {loading ? (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <div style={{ width: 36, height: 36, border: `3px solid ${T.coral}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .9s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 13, color: "#64748b" }}>Loading employees…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>👥</span>
              <p className="fd" style={{ fontSize: 15, fontWeight: 800, color: T.navy, marginBottom: 6 }}>No employees found</p>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>{search ? "Try adjusting your search or filters." : "No employees have been added yet."}</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFF", borderBottom: `1.5px solid ${T.border}` }}>
                    {["Person", "Department / Role", "Contact", "Joined", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, i) => (
                    <tr key={emp.id} className="me-row" style={{ animationDelay: `${i * 0.04}s` }}>
                      {/* Person */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={emp.fullName} photoUrl={emp.photoUrl} />
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{emp.fullName || "—"}</p>
                            <p style={{ fontSize: 11, color: "#64748b" }}>{emp.employeeId || ""}</p>
                          </div>
                        </div>
                      </td>
                      {/* Dept / Role */}
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{emp.position || "—"}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                          <Building2 size={10} color="#94a3b8" />
                          <p style={{ fontSize: 11, color: "#64748b" }}>{emp.department || "—"}</p>
                          <RoleBadge role={emp.role} />
                        </div>
                      </td>
                      {/* Contact */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <Mail size={10} color="#94a3b8" />
                          <p style={{ fontSize: 12, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{emp.email}</p>
                        </div>
                        {emp.mobile && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Phone size={10} color="#94a3b8" />
                            <p style={{ fontSize: 12, color: "#475569" }}>{emp.mobile}</p>
                          </div>
                        )}
                      </td>
                      {/* Joined */}
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: 12, color: "#475569" }}>
                          {emp.joiningDate
                            ? new Date(emp.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </p>
                      </td>
                      {/* Status */}
                      <td style={{ padding: "12px 16px" }}>
                        <StatusBadge status={emp.status} />
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="me-btn" onClick={() => setViewEmp(emp)}
                            style={{ borderColor: "rgba(6,182,212,.3)", background: "rgba(6,182,212,.08)", color: T.teal }}>
                            <Eye size={11} />
                          </button>
                          <button className="me-btn" onClick={() => openEdit(emp)}
                            style={{ borderColor: "rgba(99,102,241,.3)", background: "rgba(99,102,241,.08)", color: "#6366f1" }}>
                            <Edit2 size={11} />
                          </button>
                          <button className="me-btn" onClick={() => deletePerson(emp)} disabled={deleting === emp.id}
                            style={{ borderColor: "rgba(239,68,68,.25)", background: "rgba(239,68,68,.06)", color: "#EF4444", opacity: deleting === emp.id ? .6 : 1 }}>
                            {deleting === emp.id ? "…" : <Trash2 size={11} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── VIEW MODAL ── */}
      {viewEmp && (
        <Modal title={viewEmp.fullName} onClose={() => setViewEmp(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              ["Person ID",  viewEmp.employeeId || "—"],
              ["Email",        viewEmp.email],
              ["Pocket",       viewEmp.mobile     || "—"],
              ["Position",     viewEmp.position   || "—"],
              ["Department",   viewEmp.department || "—"],
              ["Role",         viewEmp.role],
              ["Status",       viewEmp.status],
              ["Joined",       viewEmp.joiningDate
                ? new Date(viewEmp.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : "—"],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: "10px 14px", background: "#F8FAFF", borderRadius: 10, border: `1px solid ${T.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>{l}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{v}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ── EDIT MODAL ── */}
      {editEmp && (
        <Modal title={`Edit — ${editEmp.fullName}`} onClose={() => setEditEmp(null)} wide>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { label: "Full Name",   key: "fullName",   type: "text" },
              { label: "Person ID", key: "employeeId", type: "text" },
              { label: "Email",       key: "email",      type: "email" },
              { label: "Pocket",      key: "mobile",     type: "tel" },
              { label: "Position",    key: "position",   type: "text" },
              { label: "Joining Date",key: "joiningDate",type: "date" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>{label}</label>
                <input className="me-input" type={type} value={editForm[key] || ""} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Department</label>
              <select className="me-select" value={editForm.department} onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Role</label>
              <select className="me-select" value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Status</label>
              <select className="me-select" value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
            <button onClick={() => setEditEmp(null)} className="me-btn" style={{ borderColor: T.border, background: "#fff", color: T.navy }}>Cancel</button>
            <button onClick={saveEdit} disabled={saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11, background: `linear-gradient(135deg,${T.coral},#06B6D4)`, color: "#fff", fontSize: 13, fontWeight: 800, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? .7 : 1, fontFamily: "DM Sans" }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Reusable Modal ── */
function Modal({ title, onClose, children, wide = false }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,31,45,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
      <div className="me-in" style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: wide ? 700 : 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(13,31,45,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1.5px solid #E8ECF2` }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#0B1020", fontFamily: "Sora,sans-serif" }}>{title}</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color="#94a3b8" /></button>
        </div>
        <div style={{ padding: "20px 22px" }}>{children}</div>
      </div>
    </div>
  );
}
