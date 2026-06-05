import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Eye,
  Edit,
  Save,
  X,
  Plus,
  AlertCircle,
  ChevronDown,
  Building2,
  RefreshCw,
  Calendar,
  BarChart3,
} from "lucide-react";
import api from "@/lib/apiClient";

/* -------------------- Theme -------------------- */
const T = {
  navy: "#0D1F2D",
  navyMid: "#1E3448",
  coral: "#FF6B35",
  teal: "#00C2A8",
  bg: "#F5F7FB",
  border: "#E8ECF2",
  textSoft: "#64748B",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

.apd * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }
.apd .fd { font-family:'Sora',sans-serif; }

.apd-shell{
  min-height:100vh;
  background:
    radial-gradient(circle at top right, rgba(255,107,53,.08), transparent 20%),
    radial-gradient(circle at left bottom, rgba(0,194,168,.08), transparent 18%),
    ${T.bg};
  padding-bottom:32px;
}

.apd-hero{
  position:relative;
  overflow:hidden;
  padding:28px 28px 24px;
  background:linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 55%, #28445D 100%);
  border-bottom-left-radius:26px;
  border-bottom-right-radius:26px;
  margin-bottom:22px;
}
.apd-orb1,.apd-orb2,.apd-orb3{
  position:absolute; border-radius:50%; pointer-events:none;
}
.apd-orb1{ width:220px;height:220px;right:-40px;top:-40px;background:rgba(255,255,255,.05); }
.apd-orb2{ width:130px;height:130px;right:220px;bottom:-35px;background:rgba(255,107,53,.10); }
.apd-orb3{ width:110px;height:110px;left:-15px;bottom:-20px;background:rgba(0,194,168,.08); }

.apd-hero-top{
  position:relative;
  z-index:2;
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:16px;
  flex-wrap:wrap;
}
.apd-badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  color:#FFD7C8;
  font-size:11px;
  font-weight:700;
  letter-spacing:.08em;
  text-transform:uppercase;
  margin-bottom:12px;
}
.apd-title{
  font-size:30px;
  line-height:1.1;
  margin:0;
  color:#fff;
  font-weight:900;
}
.apd-sub{
  margin-top:8px;
  font-size:13px;
  color:rgba(255,255,255,.66);
  max-width:700px;
}
.apd-top-actions{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}
.apd-btn-outline{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:11px 16px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.18);
  background:rgba(255,255,255,.08);
  color:#fff;
  font-size:13px;
  font-weight:700;
  cursor:pointer;
  transition:.18s ease;
}
.apd-btn-outline:hover{
  background:rgba(255,255,255,.14);
  transform:translateY(-1px);
}

.apd-wrap{
  width:min(1400px, calc(100% - 32px));
  margin:0 auto;
}

.apd-banner{
  background:linear-gradient(135deg, rgba(255,107,53,.10), rgba(0,194,168,.06));
  border:1.5px solid rgba(255,107,53,.16);
  border-radius:22px;
  padding:18px 20px;
  margin-bottom:18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
}
.apd-banner-left{
  display:flex;
  align-items:center;
  gap:12px;
}
.apd-banner-icon{
  width:48px;height:48px;border-radius:15px;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg, rgba(255,107,53,.16), rgba(0,194,168,.12));
  color:${T.navy};
}
.apd-banner-title{ font-size:18px; font-weight:800; color:${T.navy}; margin:0; }
.apd-banner-sub{ font-size:12px; color:${T.textSoft}; margin-top:2px; }

.apd-btn-primary{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:12px 16px;
  border:none;
  border-radius:14px;
  background:linear-gradient(135deg, ${T.coral}, #FF8C5A);
  color:#fff;
  font-size:13px;
  font-weight:800;
  cursor:pointer;
  transition:.18s ease;
  box-shadow:0 10px 22px rgba(255,107,53,.22);
}
.apd-btn-primary:hover{
  transform:translateY(-1px);
  box-shadow:0 14px 26px rgba(255,107,53,.28);
}
.apd-btn-soft{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:11px 15px;
  border:1.5px solid ${T.border};
  border-radius:14px;
  background:#fff;
  color:${T.navy};
  font-size:13px;
  font-weight:700;
  cursor:pointer;
  transition:.18s ease;
}
.apd-btn-soft:hover{ border-color:${T.coral}; color:${T.coral}; }

.apd-stats{
  display:grid;
  grid-template-columns:repeat(4, minmax(0,1fr));
  gap:16px;
  margin-bottom:18px;
}
.apd-stat{
  background:#fff;
  border:1.5px solid ${T.border};
  border-radius:22px;
  padding:18px;
  box-shadow:0 10px 26px rgba(13,31,45,.05);
}
.apd-stat-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}
.apd-stat-label{
  font-size:11px;
  color:#94A3B8;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.08em;
  margin-bottom:8px;
}
.apd-stat-value{
  font-size:30px;
  font-weight:900;
  color:${T.navy};
  line-height:1;
  font-family:'Sora',sans-serif;
}
.apd-stat-icon{
  width:48px;height:48px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
}
.apd-stat-icon.orange{ background:rgba(255,107,53,.10); color:${T.coral}; }
.apd-stat-icon.green{ background:rgba(16,185,129,.10); color:#10B981; }
.apd-stat-icon.yellow{ background:rgba(245,158,11,.10); color:#F59E0B; }
.apd-stat-icon.purple{ background:rgba(139,92,246,.10); color:#8B5CF6; }

.apd-grid-2{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
  margin-bottom:18px;
}
.apd-card{
  background:#fff;
  border:1.5px solid ${T.border};
  border-radius:24px;
  box-shadow:0 10px 26px rgba(13,31,45,.05);
  overflow:hidden;
}
.apd-card-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding:18px 20px;
  border-bottom:1px solid ${T.border};
  background:linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 100%);
}
.apd-card-title-wrap{
  display:flex;
  align-items:center;
  gap:10px;
}
.apd-card-icon{
  width:40px;height:40px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg, rgba(255,107,53,.14), rgba(0,194,168,.12));
  color:${T.navy};
}
.apd-card-title{ font-size:16px; font-weight:800; color:${T.navy}; margin:0; }
.apd-card-sub{ font-size:12px; color:#8A98A9; margin-top:2px; }
.apd-card-body{ padding:20px; }

.apd-month{
  margin-bottom:18px;
}
.apd-month-row{
  display:flex;
  align-items:end;
  gap:16px;
  flex-wrap:wrap;
}
.apd-field{
  display:flex;
  flex-direction:column;
  gap:6px;
  min-width:220px;
}
.apd-label{
  font-size:10px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.1em;
  color:#94A3B8;
}
.apd-input,.apd-select{
  width:100%;
  border:1.5px solid ${T.border};
  background:#FBFCFE;
  border-radius:14px;
  padding:13px 14px;
  font-size:13px;
  color:${T.navy};
  outline:none;
  transition:.18s ease;
}
.apd-input:focus,.apd-select:focus{
  border-color:${T.coral};
  background:#fff;
  box-shadow:0 0 0 4px rgba(255,107,53,.08);
}
.apd-select{
  appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23FF6B35'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right 14px center;
  padding-right:38px;
}
.apd-search{
  position:relative;
}
.apd-search svg{
  position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94A3B8;
}
.apd-search input{
  padding-left:40px;
}

.apd-progress-list{ display:flex; flex-direction:column; gap:14px; }
.apd-progress-head{
  display:flex; justify-content:space-between; gap:12px; margin-bottom:6px;
  font-size:12px;
}
.apd-progress-head span:first-child{ color:${T.textSoft}; }
.apd-progress-head span:last-child{ color:${T.navy}; font-weight:800; }
.apd-progress-track{
  width:100%; height:9px; border-radius:999px; background:#EEF2F7; overflow:hidden;
}
.apd-progress-fill{ height:100%; border-radius:999px; }
.apd-progress-fill.green{ background:#10B981; }
.apd-progress-fill.orange{ background:${T.coral}; }
.apd-progress-fill.yellow{ background:#F59E0B; }
.apd-progress-fill.red{ background:#EF4444; }

.apd-quick{ display:flex; flex-direction:column; gap:12px; }
.apd-quick-row{
  display:flex; justify-content:space-between; align-items:center;
  padding:10px 0; border-bottom:1px solid ${T.border};
}
.apd-quick-row:last-child{ border-bottom:none; }
.apd-quick-key{ color:${T.textSoft}; font-size:13px; }
.apd-quick-val{ color:${T.navy}; font-size:17px; font-weight:800; }

.apd-filters{
  margin-bottom:18px;
}
.apd-filters-grid{
  display:grid;
  grid-template-columns:2fr 1fr 1fr 1fr auto;
  gap:14px;
}

.apd-table-wrap{ overflow:auto; }
.apd-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
  min-width:1050px;
}
.apd-table thead th{
  background:#F8FAFC;
  color:#64748B;
  font-size:11px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.08em;
  padding:14px 16px;
  text-align:left;
  border-bottom:1px solid ${T.border};
}
.apd-table tbody td{
  padding:16px;
  border-bottom:1px solid ${T.border};
  vertical-align:middle;
  color:${T.navy};
  font-size:13px;
}
.apd-table tbody tr:hover{ background:#FCFDFF; }

.apd-rank{ font-weight:800; color:#64748B; }
.apd-rank.gold{ color:#EAB308; }
.apd-rank.silver{ color:#94A3B8; }
.apd-rank.bronze{ color:#EA580C; }

.apd-emp-name{ font-size:13px; font-weight:800; color:${T.navy}; }
.apd-emp-sub{ font-size:11px; color:${T.textSoft}; margin-top:2px; }

.apd-score{
  display:flex; align-items:center; gap:8px;
  font-size:18px; font-weight:800; color:${T.navy};
}
.apd-badge-status{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:7px 10px;
  border-radius:999px;
  font-size:11px;
  font-weight:800;
}
.apd-badge-status.excellent{ background:#DCFCE7; color:#166534; }
.apd-badge-status.good{ background:#FFEDD5; color:#C2410C; }
.apd-badge-status.average{ background:#FEF3C7; color:#92400E; }
.apd-badge-status.needs{ background:#FEE2E2; color:#991B1B; }

.apd-valid{
  display:inline-flex;
  align-items:center;
  gap:5px;
  color:#10B981;
  font-size:11px;
  font-weight:700;
  margin-top:6px;
}

.apd-actions{
  display:flex; align-items:center; gap:10px;
}
.apd-icon-btn{
  width:34px; height:34px; border:none; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  background:#fff; cursor:pointer; transition:.18s ease;
  border:1px solid ${T.border};
}
.apd-icon-btn:hover{ transform:translateY(-1px); }
.apd-icon-btn.view{ color:${T.coral}; }
.apd-icon-btn.edit{ color:#D97706; }
.apd-icon-btn.ok{ color:#10B981; }
.apd-icon-btn.no{ color:#EF4444; }

.apd-empty{
  text-align:center;
  padding:44px 20px;
}
.apd-empty p:first-of-type{ color:${T.navy}; font-size:18px; font-weight:800; margin-top:12px; }
.apd-empty p:last-of-type{ color:${T.textSoft}; font-size:13px; margin-top:6px; }

.apd-modal-overlay{
  position:fixed; inset:0; background:rgba(13,31,45,.55);
  display:flex; align-items:center; justify-content:center;
  z-index:50; padding:16px;
}
.apd-modal{
  width:min(980px, 100%);
  max-height:90vh;
  overflow:auto;
  background:#fff;
  border-radius:24px;
  border:1.5px solid ${T.border};
  box-shadow:0 30px 70px rgba(13,31,45,.20);
}
.apd-modal-sm{ width:min(860px,100%); }
.apd-modal-head{
  display:flex; align-items:flex-start; justify-content:space-between;
  gap:16px; padding:20px 22px; border-bottom:1px solid ${T.border};
}
.apd-modal-title{ font-size:24px; font-weight:900; color:${T.navy}; margin:0; font-family:'Sora',sans-serif; }
.apd-close{
  width:38px;height:38px;border-radius:12px;border:1px solid ${T.border};background:#fff;
  display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748B;
}
.apd-close:hover{ border-color:${T.coral}; color:${T.coral}; }

.apd-modal-body{ padding:22px; }
.apd-modal-grid-2{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
}
.apd-info-box{
  background:#FCFDFF;
  border:1.5px solid ${T.border};
  border-radius:18px;
  padding:16px;
}
.apd-info-label{
  font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#94A3B8;
}
.apd-info-value{
  font-size:14px; font-weight:800; color:${T.navy}; margin-top:6px;
}
.apd-score-lg{
  font-size:30px; font-weight:900; color:${T.coral}; font-family:'Sora',sans-serif;
}
.apd-section-title{
  font-size:15px; font-weight:800; color:${T.navy}; margin:22px 0 14px;
}
.apd-form-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px;
}
.apd-footer{
  display:flex; justify-content:flex-end; gap:12px; border-top:1px solid ${T.border}; padding-top:18px; margin-top:20px;
}

@keyframes apdFadeUp {
  from { opacity:0; transform:translateY(10px); }
  to { opacity:1; transform:translateY(0); }
}
.apd-in{ animation:apdFadeUp .35s ease both; }

@media (max-width: 1180px){
  .apd-stats{ grid-template-columns:repeat(2, minmax(0,1fr)); }
  .apd-filters-grid{ grid-template-columns:1fr 1fr; }
}
@media (max-width: 860px){
  .apd-wrap{ width:min(100% - 20px, 100%); }
  .apd-hero{ padding:22px 16px 20px; border-bottom-left-radius:20px; border-bottom-right-radius:20px; }
  .apd-stats, .apd-grid-2, .apd-filters-grid, .apd-form-grid, .apd-modal-grid-2{ grid-template-columns:1fr; }
  .apd-banner, .apd-month-row{ align-items:stretch; }
}
`;


export default function AdminPerformanceDashboard() {
  const [tenantInfo, setTenantInfo] = useState({
    tenantCode: "",
    companyName: "",
    companyId: null,
  });

  const [employees, setEmployees] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("score-desc");

  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    currentScore: 0,
    attendance: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    productivity: 0,
    qualityScore: 0,
    punctuality: 0,
    status: "Average",
    validated: false,
    performanceMonth: "",
  });
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    try {
      const tenantCode = localStorage.getItem("tenantCode");
      const companyName = localStorage.getItem("companyName");
      const companyId = localStorage.getItem("companyId");

      if (!tenantCode) {
        setError("Tenant code not found. Please log in again.");
        setLoading(false);
        return;
      }

      setTenantInfo({
        tenantCode: tenantCode || "",
        companyName: companyName || "Unknown Company",
        companyId: companyId ? parseInt(companyId) : null,
      });
    } catch (err) {
      console.error("Error reading tenant info:", err);
      setError("Failed to load company information.");
      setLoading(false);
    }
  }, []);

  const fetchAvailableMonths = async () => {
    if (!tenantInfo.tenantCode) return;

    try {
      const response = await api.get('/api/performance/tenant/months');

      const result = response.data;

      if (result.success) {
        const months = result.data || [];
        setAvailableMonths(months);

        const currentMonth = new Date().toISOString().slice(0, 7);
        if (months.includes(currentMonth)) {
          setSelectedMonth(currentMonth);
        } else if (months.length > 0) {
          setSelectedMonth(months[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching months:", err);
    }
  };

  const fetchAllUsers = async () => {
    if (!tenantInfo.tenantCode) return;

    try {
      const response = await api.get('/api/users/tenant/employees');

      const result = response.data;

      if (result.success) {
        setAllUsers(result.data || []);
      } else {
        throw new Error(result.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchEmployees = async () => {
    if (!tenantInfo.tenantCode) return;

    try {
      setLoading(true);
      setError(null);

      let url = '/api/performance/tenant/all';
      if (selectedMonth) url = `/api/performance/tenant/by-month?month=${selectedMonth}`;

      const response = await api.get(url);

      const result = response.data;

      if (result.success) {
        setEmployees(result.data || []);
      } else {
        throw new Error(result.message || "Failed to load performance data");
      }
    } catch (err) {
      console.error("Error fetching performance:", err);
      setError(err.message || "Failed to load employee performance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tenantInfo.tenantCode) return;
    (async () => {
      await fetchAvailableMonths();
      await fetchAllUsers();
    })();
  }, [tenantInfo.tenantCode]);

  useEffect(() => {
    if (tenantInfo.tenantCode) fetchEmployees();
  }, [selectedMonth, tenantInfo.tenantCode]);

  const handleUserSelection = (userId) => {
    setSelectedUserId(userId);
    const selectedUser = allUsers.find((user) => user.id === parseInt(userId));

    if (selectedUser) {
      let fullName = "";
      if (selectedUser.fullName) fullName = selectedUser.fullName;
      else if (selectedUser.firstName && selectedUser.lastName) fullName = `${selectedUser.firstName} ${selectedUser.lastName}`;
      else if (selectedUser.firstName) fullName = selectedUser.firstName;
      else if (selectedUser.lastName) fullName = selectedUser.lastName;
      else if (selectedUser.username) fullName = selectedUser.username;
      else fullName = selectedUser.email;

      setCreateForm((prev) => ({
        ...prev,
        userId: selectedUser.id,
        employeeId: selectedUser.employeeId || selectedUser.username || `EMP${selectedUser.id}`,
        name: fullName,
        department: selectedUser.department || "",
        position: selectedUser.position || selectedUser.role || "",
        email: selectedUser.email || "",
        performanceMonth: selectedMonth || new Date().toISOString().slice(0, 7),
      }));
    }
  };

  const handleValidate = async (employeeId) => {
    try {
      const response = await api.put(`/api/performance/validate/${employeeId}`, { validated: true });

      const result = response.data;
      if (result.success) {
        await fetchEmployees();
        alert("✅ Performance validated successfully!");
      } else {
        alert("❌ Failed to validate: " + result.message);
      }
    } catch (err) {
      console.error("Error validating:", err);
      alert("❌ Failed to validate employee");
    }
  };

  const handleReject = async (employeeId) => {
    try {
      const response = await api.put(`/api/performance/validate/${employeeId}`, { validated: false });

      const result = response.data;
      if (result.success) {
        await fetchEmployees();
        alert("✅ Validation revoked successfully!");
      } else {
        alert("❌ Failed to revoke: " + result.message);
      }
    } catch (err) {
      console.error("Error revoking:", err);
      alert("❌ Failed to revoke validation");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setEditForm({ ...employee });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/api/performance/${editingEmployee}`, editForm);

      const result = response.data;
      if (result.success) {
        setEditingEmployee(null);
        setEditForm({});
        await fetchEmployees();
        alert("✅ Performance updated successfully!");
      } else {
        alert("❌ Failed to update: " + result.message);
      }
    } catch (err) {
      console.error("Error updating:", err);
      alert("❌ Failed to update employee performance");
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setEditForm({});
  };

  const updateEditForm = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCreateForm = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreatePerformance = async () => {
    if (!createForm.userId || !createForm.employeeId) {
      alert("❌ Please select an employee");
      return;
    }

    if (!createForm.name || createForm.name.trim() === "") {
      alert("❌ Employee name is required");
      return;
    }

    const existingPerformance = employees.find(
      (emp) => emp.userId === createForm.userId && emp.performanceMonth === createForm.performanceMonth
    );

    if (existingPerformance) {
      alert("❌ Performance record already exists for this employee in the selected month. Please edit the existing record instead.");
      return;
    }

    try {
      const response = await api.post('/api/performance', createForm);

      const result = response.data;
      if (result.success) {
        setShowCreateModal(false);
        setCreateForm({
          currentScore: 0,
          attendance: 0,
          tasksCompleted: 0,
          totalTasks: 0,
          productivity: 0,
          qualityScore: 0,
          punctuality: 0,
          status: "Average",
          validated: false,
          performanceMonth: selectedMonth || new Date().toISOString().slice(0, 7),
        });
        setSelectedUserId("");
        await fetchEmployees();
        await fetchAvailableMonths();
        alert("✅ Performance record created successfully!");
      } else {
        alert("❌ Failed to create: " + result.message);
      }
    } catch (err) {
      console.error("Error creating:", err);
      alert("❌ Failed to create performance record");
    }
  };

  const availableUsersForPerformance = allUsers.filter((user) => {
    if (user.role === "ADMIN" || user.userRole === "ADMIN") return false;
    const hasPerformance = employees.some((emp) => emp.userId === user.id);
    return !hasPerformance;
  });

  const stats = {
    totalEmployees: employees.length,
    validated: employees.filter((e) => e.validated).length,
    pending: employees.filter((e) => !e.validated).length,
    avgScore:
      employees.length > 0
        ? (employees.reduce((sum, e) => sum + (e.currentScore || 0), 0) / employees.length).toFixed(1)
        : "0.0",
    excellent: employees.filter((e) => e.status === "Excellent").length,
    needsImprovement: employees.filter((e) => e.status === "Needs Improvement").length,
  };

  const departments = ["All", ...new Set(employees.map((e) => e.department).filter(Boolean))];
  const statuses = ["All", "Excellent", "Good", "Average", "Needs Improvement"];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === "All" || emp.department === filterDepartment;
    const matchesStatus = filterStatus === "All" || emp.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case "score-desc":
        return (b.currentScore || 0) - (a.currentScore || 0);
      case "score-asc":
        return (a.currentScore || 0) - (b.currentScore || 0);
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");
      case "attendance-desc":
        return (b.attendance || 0) - (a.attendance || 0);
      case "attendance-asc":
        return (a.attendance || 0) - (b.attendance || 0);
      default:
        return (b.currentScore || 0) - (a.currentScore || 0);
    }
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Excellent":
        return "excellent";
      case "Good":
        return "good";
      case "Average":
        return "average";
      case "Needs Improvement":
        return "needs";
      default:
        return "average";
    }
  };

  const handleExport = () => {
    if (sortedEmployees.length === 0) {
      alert("No data to export");
      return;
    }

    const csvContent = [
      [
        "Employee ID",
        "Name",
        "Department",
        "Position",
        "Score",
        "Status",
        "Tasks Completed",
        "Total Tasks",
        "Attendance %",
        "Productivity %",
        "Quality Score %",
        "Punctuality %",
        "Validated",
        "Month",
      ],
      ...sortedEmployees.map((emp) => [
        emp.employeeId,
        emp.name,
        emp.department,
        emp.position,
        emp.currentScore,
        emp.status,
        emp.tasksCompleted,
        emp.totalTasks,
        emp.attendance,
        emp.productivity,
        emp.qualityScore,
        emp.punctuality,
        emp.validated ? "Yes" : "No",
        emp.performanceMonth || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance_${tenantInfo.companyName}_${selectedMonth || "all"}_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatMonthDisplay = (monthStr) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  if (loading) {
    return (
      <div className="apd apd-shell">
        <style>{CSS}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <RefreshCw size={44} color={T.coral} className="spin" style={{ animation: "apdSpin 1s linear infinite" }} />
            <p style={{ color: T.navy, fontSize: 18, fontWeight: 800, marginTop: 14 }}>Loading performance data...</p>
            <p style={{ color: T.textSoft, fontSize: 13, marginTop: 6 }}>Company: {tenantInfo.companyName}</p>
          </div>
        </div>
        <style>{`@keyframes apdSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apd apd-shell">
        <style>{CSS}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div className="apd-card" style={{ maxWidth: 460, width: "100%" }}>
            <div className="apd-card-body" style={{ textAlign: "center" }}>
              <AlertCircle size={48} color="#EF4444" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: 22, fontWeight: 900, color: T.navy, marginBottom: 8 }}>Error</h2>
              <p style={{ color: T.textSoft, marginBottom: 18 }}>{error}</p>
              <button
                onClick={async () => {
                  await fetchAvailableMonths();
                  await fetchAllUsers();
                  await fetchEmployees();
                }}
                className="apd-btn-primary"
              >
                <RefreshCw size={18} />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apd apd-shell">
      <style>{CSS}</style>

      <div className="apd-hero">
        <div className="apd-orb1" />
        <div className="apd-orb2" />
        <div className="apd-orb3" />

        <div className="apd-hero-top">
          <div>
            <div className="apd-badge">
              <BarChart3 size={13} />
              SamayaHR · Performance Workspace
            </div>
            <h1 className="apd-title fd">Performance Dashboard</h1>
            <p className="apd-sub">
              Manage and track employee performance metrics with the same modern styling and colors used in the manual entry page.
            </p>
          </div>

          <div className="apd-top-actions">
            <button
              className="apd-btn-outline"
              onClick={async () => {
                await fetchAvailableMonths();
                await fetchAllUsers();
                await fetchEmployees();
              }}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
            <button onClick={() => setShowCreateModal(true)} className="apd-btn-outline">
              <Plus size={15} />
              Add Performance
            </button>
          </div>
        </div>
      </div>

      <div className="apd-wrap">
        <div className="apd-banner apd-in">
          <div className="apd-banner-left">
            <div className="apd-banner-icon">
              <Building2 size={22} />
            </div>
            <div>
              <p className="apd-banner-title">{tenantInfo.companyName}</p>
              <p className="apd-banner-sub">
                Tenant: {tenantInfo.tenantCode}
                {tenantInfo.companyId && ` • ID: ${tenantInfo.companyId}`}
              </p>
            </div>
          </div>

          <button onClick={handleExport} className="apd-btn-primary">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {availableMonths.length > 0 && (
          <div className="apd-card apd-month apd-in" style={{ animationDelay: ".04s" }}>
            <div className="apd-card-head">
              <div className="apd-card-title-wrap">
                <div className="apd-card-icon">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="apd-card-title">Select Month</p>
                  <p className="apd-card-sub">Filter performance records by month</p>
                </div>
              </div>
            </div>
            <div className="apd-card-body">
              <div className="apd-month-row">
                <div className="apd-field">
                  <label className="apd-label">Month Filter</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="apd-select"
                  >
                    <option value="">All Months</option>
                    {availableMonths.map((month) => (
                      <option key={month} value={month}>
                        {formatMonthDisplay(month)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMonth && (
                  <div style={{ color: T.textSoft, fontSize: 13, fontWeight: 700 }}>
                    Showing: <span style={{ color: T.navy }}>{formatMonthDisplay(selectedMonth)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="apd-stats apd-in" style={{ animationDelay: ".06s" }}>
          <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} color="orange" />
          <StatCard icon={CheckCircle} label="Validated" value={stats.validated} color="green" />
          <StatCard icon={Clock} label="Pending Validation" value={stats.pending} color="yellow" />
          <StatCard icon={Target} label="Average Score" value={stats.avgScore} color="purple" />
        </div>

        <div className="apd-grid-2 apd-in" style={{ animationDelay: ".08s" }}>
          <div className="apd-card">
            <div className="apd-card-head">
              <div className="apd-card-title-wrap">
                <div className="apd-card-icon">
                  <Award size={18} />
                </div>
                <div>
                  <p className="apd-card-title">Performance Distribution</p>
                  <p className="apd-card-sub">Employee performance breakdown</p>
                </div>
              </div>
            </div>
            <div className="apd-card-body">
              <div className="apd-progress-list">
                <ProgressBar label="Excellent" value={stats.excellent} total={stats.totalEmployees || 1} color="green" />
                <ProgressBar label="Good" value={employees.filter((e) => e.status === "Good").length} total={stats.totalEmployees || 1} color="orange" />
                <ProgressBar label="Average" value={employees.filter((e) => e.status === "Average").length} total={stats.totalEmployees || 1} color="yellow" />
                <ProgressBar label="Needs Improvement" value={stats.needsImprovement} total={stats.totalEmployees || 1} color="red" />
              </div>
            </div>
          </div>

          <div className="apd-card">
            <div className="apd-card-head">
              <div className="apd-card-title-wrap">
                <div className="apd-card-icon">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="apd-card-title">Quick Stats</p>
                  <p className="apd-card-sub">Key performance highlights</p>
                </div>
              </div>
            </div>
            <div className="apd-card-body">
              <div className="apd-quick">
                <div className="apd-quick-row">
                  <span className="apd-quick-key">Validation Rate</span>
                  <span className="apd-quick-val">
                    {stats.totalEmployees > 0 ? ((stats.validated / stats.totalEmployees) * 100).toFixed(1) : "0.0"}%
                  </span>
                </div>
                <div className="apd-quick-row">
                  <span className="apd-quick-key">High Performers (90+)</span>
                  <span className="apd-quick-val">{employees.filter((e) => (e.currentScore || 0) >= 90).length}</span>
                </div>
                <div className="apd-quick-row">
                  <span className="apd-quick-key">Needs Attention (&lt;70)</span>
                  <span className="apd-quick-val" style={{ color: "#EF4444" }}>
                    {employees.filter((e) => (e.currentScore || 0) < 70).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="apd-card apd-filters apd-in" style={{ animationDelay: ".10s" }}>
          <div className="apd-card-head">
            <div className="apd-card-title-wrap">
              <div className="apd-card-icon">
                <Search size={18} />
              </div>
              <div>
                <p className="apd-card-title">Filters & Search</p>
                <p className="apd-card-sub">Find the exact employee record quickly</p>
              </div>
            </div>
          </div>
          <div className="apd-card-body">
            <div className="apd-filters-grid">
              <div className="apd-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="apd-input"
                />
              </div>

              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="apd-select">
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All" ? "All Departments" : dept}
                  </option>
                ))}
              </select>

              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="apd-select">
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All Statuses" : status}
                  </option>
                ))}
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="apd-select">
                <option value="score-desc">Score: High to Low</option>
                <option value="score-asc">Score: Low to High</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="attendance-desc">Attendance: High to Low</option>
                <option value="attendance-asc">Attendance: Low to High</option>
              </select>

              <button onClick={handleExport} className="apd-btn-soft">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="apd-card apd-in" style={{ animationDelay: ".12s" }}>
          <div className="apd-card-head">
            <div className="apd-card-title-wrap">
              <div className="apd-card-icon">
                <Users size={18} />
              </div>
              <div>
                <p className="apd-card-title">Performance Records</p>
                <p className="apd-card-sub">Employee ranking, status, and actions</p>
              </div>
            </div>
          </div>

          <div className="apd-table-wrap">
            <table className="apd-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Score</th>
                  <th>Tasks</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedEmployees.map((employee, index) => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    rank={index + 1}
                    editingEmployee={editingEmployee}
                    editForm={editForm}
                    onEdit={handleEdit}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    updateEditForm={updateEditForm}
                    onView={() => {
                      setSelectedEmployee(employee);
                      setShowModal(true);
                    }}
                    onValidate={handleValidate}
                    onReject={handleReject}
                    getStatusClass={getStatusClass}
                  />
                ))}
              </tbody>
            </table>

            {sortedEmployees.length === 0 && (
              <div className="apd-empty">
                <Users size={60} color="#CBD5E1" />
                <p>No performance records found</p>
                <p>
                  {searchTerm || filterDepartment !== "All" || filterStatus !== "All"
                    ? "Try adjusting your filters"
                    : selectedMonth
                    ? `No records for ${formatMonthDisplay(selectedMonth)}`
                    : "Click 'Add Performance' to create a new record"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowModal(false);
            setSelectedEmployee(null);
          }}
          onValidate={handleValidate}
          onReject={handleReject}
          getStatusClass={getStatusClass}
        />
      )}

      {showCreateModal && (
        <CreateModal
          createForm={createForm}
          updateCreateForm={updateCreateForm}
          allUsers={availableUsersForPerformance}
          selectedUserId={selectedUserId}
          onUserSelect={handleUserSelection}
          onSave={handleCreatePerformance}
          onClose={() => {
            setShowCreateModal(false);
            setCreateForm({
              currentScore: 0,
              attendance: 0,
              tasksCompleted: 0,
              totalTasks: 0,
              productivity: 0,
              qualityScore: 0,
              punctuality: 0,
              status: "Average",
              validated: false,
              performanceMonth: selectedMonth || new Date().toISOString().slice(0, 7),
            });
            setSelectedUserId("");
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="apd-stat">
      <div className="apd-stat-top">
        <div>
          <div className="apd-stat-label">{label}</div>
          <div className="apd-stat-value">{value}</div>
        </div>
        <div className={`apd-stat-icon ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="apd-progress-head">
        <span>{label}</span>
        <span>
          {value} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="apd-progress-track">
        <div className={`apd-progress-fill ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function EmployeeRow({
  employee,
  rank,
  editingEmployee,
  editForm,
  onEdit,
  onSave,
  onCancel,
  updateEditForm,
  onView,
  onValidate,
  onReject,
  getStatusClass,
}) {
  if (editingEmployee === employee.id) {
    return (
      <tr>
        <td><span className="apd-rank">#{rank}</span></td>
        <td>
          <input
            type="text"
            value={editForm.name || ""}
            onChange={(e) => updateEditForm("name", e.target.value)}
            className="apd-input"
          />
          <input
            type="text"
            value={editForm.employeeId || ""}
            disabled
            className="apd-input"
            style={{ marginTop: 8, background: "#F1F5F9" }}
          />
        </td>
        <td>
          <input
            type="text"
            value={editForm.department || ""}
            onChange={(e) => updateEditForm("department", e.target.value)}
            className="apd-input"
          />
          <input
            type="text"
            value={editForm.position || ""}
            onChange={(e) => updateEditForm("position", e.target.value)}
            className="apd-input"
            style={{ marginTop: 8 }}
          />
        </td>
        <td>
          <input
            type="number"
            value={editForm.currentScore || 0}
            onChange={(e) => updateEditForm("currentScore", parseInt(e.target.value) || 0)}
            className="apd-input"
            min="0"
            max="100"
          />
        </td>
        <td>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              value={editForm.tasksCompleted || 0}
              onChange={(e) => updateEditForm("tasksCompleted", parseInt(e.target.value) || 0)}
              className="apd-input"
              min="0"
            />
            <span>/</span>
            <input
              type="number"
              value={editForm.totalTasks || 0}
              onChange={(e) => updateEditForm("totalTasks", parseInt(e.target.value) || 0)}
              className="apd-input"
              min="0"
            />
          </div>
        </td>
        <td>
          <input
            type="number"
            value={editForm.attendance || 0}
            onChange={(e) => updateEditForm("attendance", parseInt(e.target.value) || 0)}
            className="apd-input"
            min="0"
            max="100"
          />
        </td>
        <td>
          <select
            value={editForm.status || "Average"}
            onChange={(e) => updateEditForm("status", e.target.value)}
            className="apd-select"
          >
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
            <option>Needs Improvement</option>
          </select>
        </td>
        <td>
          <div className="apd-actions">
            <button onClick={onSave} className="apd-icon-btn ok" title="Save">
              <Save size={18} />
            </button>
            <button onClick={onCancel} className="apd-icon-btn no" title="Cancel">
              <X size={18} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>
        {rank <= 3 ? (
          <span className={`apd-rank ${rank === 1 ? "gold" : rank === 2 ? "silver" : "bronze"}`}>#{rank}</span>
        ) : (
          <span className="apd-rank">#{rank}</span>
        )}
      </td>

      <td>
        <div className="apd-emp-name">{employee.name || "N/A"}</div>
        <div className="apd-emp-sub">{employee.employeeId || "N/A"}</div>
      </td>

      <td>
        <div className="apd-emp-name" style={{ fontSize: 13 }}>{employee.department || "N/A"}</div>
        <div className="apd-emp-sub">{employee.position || "N/A"}</div>
      </td>

      <td>
        <div className="apd-score">
          <span>{employee.currentScore || 0}</span>
          {(employee.currentScore || 0) >= 90 ? (
            <TrendingUp size={16} color="#10B981" />
          ) : (employee.currentScore || 0) < 70 ? (
            <TrendingDown size={16} color="#EF4444" />
          ) : null}
        </div>
      </td>

      <td>
        <div style={{ fontWeight: 800, color: T.navy }}>
          {employee.tasksCompleted || 0}
          <span style={{ color: T.textSoft, fontWeight: 600 }}>/{employee.totalTasks || 0}</span>
        </div>
      </td>

      <td>
        <div style={{ fontWeight: 800 }}>{employee.attendance || 0}%</div>
      </td>

      <td>
        <span className={`apd-badge-status ${getStatusClass(employee.status)}`}>
          {employee.status || "N/A"}
        </span>
        {employee.validated && (
          <div className="apd-valid">
            <CheckCircle size={12} />
            Validated
          </div>
        )}
      </td>

      <td>
        <div className="apd-actions">
          <button onClick={onView} className="apd-icon-btn view" title="View">
            <Eye size={18} />
          </button>
          <button onClick={() => onEdit(employee)} className="apd-icon-btn edit" title="Edit">
            <Edit size={18} />
          </button>
          {!employee.validated ? (
            <button onClick={() => onValidate(employee.id)} className="apd-icon-btn ok" title="Validate">
              <CheckCircle size={18} />
            </button>
          ) : (
            <button onClick={() => onReject(employee.id)} className="apd-icon-btn no" title="Revoke">
              <XCircle size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function MetricBar({ label, value }) {
  const safeValue = isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="apd-progress-head">
        <span>{label}</span>
        <span>{safeValue.toFixed(1)}%</span>
      </div>
      <div className="apd-progress-track">
        <div className="apd-progress-fill orange" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function EmployeeModal({ employee, onClose, onValidate, onReject, getStatusClass }) {
  const taskCompletionRate =
    employee.totalTasks > 0 ? (employee.tasksCompleted / employee.totalTasks) * 100 : 0;

  return (
    <div className="apd-modal-overlay">
      <div className="apd-modal apd-modal-sm">
        <div className="apd-modal-head">
          <div>
            <h2 className="apd-modal-title">{employee.name || "N/A"}</h2>
            <p style={{ color: T.textSoft, marginTop: 4 }}>{employee.employeeId || "N/A"}</p>
          </div>
          <button onClick={onClose} className="apd-close">
            <XCircle size={20} />
          </button>
        </div>

        <div className="apd-modal-body">
          <div className="apd-modal-grid-2">
            <div className="apd-info-box">
              <div className="apd-info-label">Department</div>
              <div className="apd-info-value">{employee.department || "N/A"}</div>
            </div>
            <div className="apd-info-box">
              <div className="apd-info-label">Position</div>
              <div className="apd-info-value">{employee.position || "N/A"}</div>
            </div>
            <div className="apd-info-box">
              <div className="apd-info-label">Performance Score</div>
              <div className="apd-score-lg">{employee.currentScore || 0}/100</div>
            </div>
            <div className="apd-info-box">
              <div className="apd-info-label">Status</div>
              <div style={{ marginTop: 8 }}>
                <span className={`apd-badge-status ${getStatusClass(employee.status)}`}>
                  {employee.status || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="apd-section-title">Performance Metrics</div>
          <MetricBar label="Task Completion" value={taskCompletionRate} />
          <MetricBar label="Attendance" value={employee.attendance || 0} />
          <MetricBar label="Productivity" value={employee.productivity || 0} />
          <MetricBar label="Quality Score" value={employee.qualityScore || 0} />
          <MetricBar label="Punctuality" value={employee.punctuality || 0} />

          <div className="apd-footer">
            {!employee.validated ? (
              <button
                onClick={() => {
                  onValidate(employee.id);
                  onClose();
                }}
                className="apd-btn-primary"
              >
                <CheckCircle size={16} />
                Validate
              </button>
            ) : (
              <button
                onClick={() => {
                  onReject(employee.id);
                  onClose();
                }}
                className="apd-btn-primary"
                style={{ background: "linear-gradient(135deg,#EF4444,#F87171)", boxShadow: "0 10px 22px rgba(239,68,68,.20)" }}
              >
                <XCircle size={16} />
                Revoke
              </button>
            )}

            <button onClick={onClose} className="apd-btn-soft">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateModal({
  createForm,
  updateCreateForm,
  allUsers,
  selectedUserId,
  onUserSelect,
  onSave,
  onClose,
}) {
  const getUserDisplayName = (user) => {
    if (user.fullName) return user.fullName;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    if (user.username) return user.username;
    return user.email;
  };

  const getUserEmployeeId = (user) => user.employeeId || user.username || `EMP${user.id}`;

  return (
    <div className="apd-modal-overlay">
      <div className="apd-modal">
        <div className="apd-modal-head">
          <h2 className="apd-modal-title">Create Performance Record</h2>
          <button onClick={onClose} className="apd-close">
            <XCircle size={20} />
          </button>
        </div>

        <div className="apd-modal-body">
          <div className="apd-info-box" style={{ marginBottom: 18 }}>
            <div className="apd-field">
              <label className="apd-label">Select Employee *</label>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedUserId}
                  onChange={(e) => onUserSelect(e.target.value)}
                  className="apd-select"
                >
                  <option value="">-- Select an Employee --</option>
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {getUserEmployeeId(user)} - {getUserDisplayName(user)}
                      {user.department && ` (${user.department})`}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
              </div>
              {allUsers.length === 0 && (
                <p style={{ color: "#D97706", fontSize: 12, marginTop: 8 }}>
                  No employees available. All employees already have performance records for the selected month.
                </p>
              )}
            </div>
          </div>

          {selectedUserId && (
            <>
              <div className="apd-form-grid">
                <div className="apd-field">
                  <label className="apd-label">Performance Month *</label>
                  <input
                    type="month"
                    value={createForm.performanceMonth || ""}
                    onChange={(e) => updateCreateForm("performanceMonth", e.target.value)}
                    className="apd-input"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Employee ID</label>
                  <input type="text" value={createForm.employeeId || ""} disabled className="apd-input" style={{ background: "#F1F5F9" }} />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Name *</label>
                  <input
                    type="text"
                    value={createForm.name || ""}
                    onChange={(e) => updateCreateForm("name", e.target.value)}
                    className="apd-input"
                    placeholder="Enter employee name"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Department</label>
                  <input
                    type="text"
                    value={createForm.department || ""}
                    onChange={(e) => updateCreateForm("department", e.target.value)}
                    className="apd-input"
                    placeholder="Engineering"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Position</label>
                  <input
                    type="text"
                    value={createForm.position || ""}
                    onChange={(e) => updateCreateForm("position", e.target.value)}
                    className="apd-input"
                    placeholder="Software Developer"
                  />
                </div>
              </div>

              <div className="apd-section-title">Performance Metrics</div>

              <div className="apd-form-grid">
                <div className="apd-field">
                  <label className="apd-label">Current Score (0-100) *</label>
                  <input
                    type="number"
                    value={createForm.currentScore || 0}
                    onChange={(e) => updateCreateForm("currentScore", parseInt(e.target.value) || 0)}
                    className="apd-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Attendance % *</label>
                  <input
                    type="number"
                    value={createForm.attendance || 0}
                    onChange={(e) => updateCreateForm("attendance", parseInt(e.target.value) || 0)}
                    className="apd-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Tasks Completed *</label>
                  <input
                    type="number"
                    value={createForm.tasksCompleted || 0}
                    onChange={(e) => updateCreateForm("tasksCompleted", parseInt(e.target.value) || 0)}
                    className="apd-input"
                    min="0"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Total Tasks *</label>
                  <input
                    type="number"
                    value={createForm.totalTasks || 0}
                    onChange={(e) => updateCreateForm("totalTasks", parseInt(e.target.value) || 0)}
                    className="apd-input"
                    min="0"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Productivity % *</label>
                  <input
                    type="number"
                    value={createForm.productivity || 0}
                    onChange={(e) => updateCreateForm("productivity", parseInt(e.target.value) || 0)}
                    className="apd-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Quality Score % *</label>
                  <input
                    type="number"
                    value={createForm.qualityScore || 0}
                    onChange={(e) => updateCreateForm("qualityScore", parseInt(e.target.value) || 0)}
                    className="apd-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Punctuality % *</label>
                  <input
                    type="number"
                    value={createForm.punctuality || 0}
                    onChange={(e) => updateCreateForm("punctuality", parseInt(e.target.value) || 0)}
                    className="apd-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="apd-field">
                  <label className="apd-label">Status *</label>
                  <select
                    value={createForm.status || "Average"}
                    onChange={(e) => updateCreateForm("status", e.target.value)}
                    className="apd-select"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="apd-footer">
            <button onClick={onClose} className="apd-btn-soft">Cancel</button>
            <button
              onClick={onSave}
              disabled={!selectedUserId || !createForm.performanceMonth}
              className="apd-btn-primary"
              style={{
                opacity: selectedUserId && createForm.performanceMonth ? 1 : 0.55,
                pointerEvents: selectedUserId && createForm.performanceMonth ? "auto" : "none",
              }}
            >
              <Save size={16} />
              Create Performance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}