import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApiData, sendApiData } from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import logo from "../../images/logo.png";
import ThemeSelector from "../../components/ThemeSelector";
import "./index.css";

const ALL_ROLES = ["HR", "IT", "Operations", "Accounts", "C&C", "Patrolling"];

function Console() {
  const navigate = useNavigate();
  const { user, logout, switchProfile, allProfiles } = useAuth();

  const [activeModule, setActiveModule] = useState("EMPLOYEE_MGMT"); // "EMPLOYEE_MGMT" or "THEME_MGMT"
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDeptTab, setActiveDeptTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [modalExtraRoles, setModalExtraRoles] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "regular";
  });

  const username = (user?.displayName || user?.username || "").toLowerCase();
  const role = (user?.role || "").toUpperCase();
  const dept = (user?.department || "").toUpperCase();
  const isAdmin = role === "ADMIN" || username.includes("sumit") || dept === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      alert("Access Denied: Console is only accessible to Admin.");
      navigate("/");
      return;
    }
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/employees");
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSwitchAccount = (pUsername) => {
    switchProfile(pUsername);
    setShowProfileMenu(false);
  };

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem("app_theme", newTheme);
    if (newTheme === "green") {
      document.documentElement.setAttribute("data-theme", "green");
      document.body.classList.add("theme-green");
      document.body.classList.remove("theme-white");
    } else if (newTheme === "white") {
      document.documentElement.setAttribute("data-theme", "white");
      document.body.classList.add("theme-white");
      document.body.classList.remove("theme-green");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("theme-green", "theme-white");
    }
  };

  const [modalSubRole, setModalSubRole] = useState("");

  const openRoleModal = (emp) => {
    setSelectedEmp(emp);
    setModalSubRole(emp.subRole || "");
    let roles = [];
    if (Array.isArray(emp.extraRoles)) {
      roles = [...emp.extraRoles];
    } else if (typeof emp.extraRoles === "string" && emp.extraRoles.trim() !== "") {
      roles = emp.extraRoles.split(",").map((s) => s.trim());
    } else if (typeof emp.ExtaRoles === "string" && emp.ExtaRoles.trim() !== "") {
      roles = emp.ExtaRoles.split(",").map((s) => s.trim());
    }
    if (emp.role === "ADMIN" || emp.department === "Admin") {
      if (!roles.includes("Admin")) roles.push("Admin");
    }
    setModalExtraRoles(roles);
  };

  const handleCheckboxToggle = (roleName) => {
    if (modalExtraRoles.includes(roleName)) {
      setModalExtraRoles(modalExtraRoles.filter((r) => r !== roleName));
    } else {
      setModalExtraRoles([...modalExtraRoles, roleName]);
    }
  };

  const handleSaveRoles = async () => {
    if (!selectedEmp) return;
    try {
      const isAdminSelected = modalExtraRoles.includes("Admin");
      const payload = {
        ...selectedEmp,
        extraRoles: modalExtraRoles,
        ExtaRoles: modalExtraRoles.join(", "),
        subRole: modalSubRole,
        ...(isAdminSelected ? { role: "ADMIN", department: "Admin" } : {}),
      };

      await sendApiData(`/api/employees/${selectedEmp._id}`, payload, "put");
      alert(`Roles & Access rights updated for ${selectedEmp.displayName || selectedEmp.employeeName}!`);
      setSelectedEmp(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to update employee extra roles.");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const primaryDept = (emp.department || "").toUpperCase();
    const nameMatch = (
      emp.displayName ||
      emp.employeeName ||
      `${emp.firstName || ""} ${emp.lastName || ""}`
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const idMatch = (emp.employeeId || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (!nameMatch && !idMatch) return false;

    if (activeDeptTab === "All") return true;
    if (activeDeptTab === "Admin") return primaryDept.includes("ADMIN");
    if (activeDeptTab === "Operations") return primaryDept.includes("OPERAT");
    if (activeDeptTab === "HR") return primaryDept.includes("HR");
    if (activeDeptTab === "IT") return primaryDept.includes("IT");
    if (activeDeptTab === "Accounts") return primaryDept.includes("ACC") || primaryDept.includes("FIN");
    if (activeDeptTab === "C&C") return primaryDept.includes("CNC") || primaryDept.includes("COMPLIANCE");
    if (activeDeptTab === "Patrolling") return primaryDept.includes("PATROL") || primaryDept.includes("SECURITY");

    return true;
  });

  return (
    <div className="consoleContainer">
      {/* CONSOLE TOP HEADER */}
      <div className="consoleHeader">
        <div className="consoleLogo" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="logoimage" />
          <span className="consoleTitle">Admin Console | Control Panel</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ThemeSelector />

          {/* USER PROFILE DROPDOWN MENU */}
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.15)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "700",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              👤 {user?.displayName || user?.username || "Admin"} ▾
            </div>

            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "42px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  padding: "14px 16px",
                  width: "230px",
                  zIndex: 9999,
                  color: "#0f172a",
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginBottom: "4px" }}>
                  {user?.displayName || user?.username}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
                  Department: <strong>{user?.department || "Admin"}</strong> ({user?.role || "ADMIN"})
                </div>

                <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase" }}>
                  Switch Profile:
                </div>
                <div style={{ maxHeight: "140px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
                  {(allProfiles || []).map((p) => {
                    const isCurrent = (user?.username || "").toLowerCase() === p.username.toLowerCase();
                    return (
                      <div
                        key={p.username}
                        onClick={() => handleSwitchAccount(p.username)}
                        style={{
                          padding: "6px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: isCurrent ? "700" : "500",
                          background: isCurrent ? "#eff6ff" : "#f8fafc",
                          color: isCurrent ? "#2563eb" : "#334155",
                          border: isCurrent ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{p.username}</span>
                        <span style={{ fontSize: "10.5px", color: "#64748b" }}>[{p.department || "Ops"}]</span>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#ef4444",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

          <button className="consoleHomeBtn" onClick={() => navigate("/")}>
            🏠 Main Home
          </button>
        </div>
      </div>

      <div className="consoleBody">
        {/* SIDEBAR MODULE NAVIGATION */}
        <div className="consoleSidebar">
          <h4 className="sidebarHeading">Admin Console Modules</h4>
          
          <div
            className={`consoleModuleTab ${activeModule === "EMPLOYEE_MGMT" ? "active" : ""}`}
            onClick={() => setActiveModule("EMPLOYEE_MGMT")}
          >
            <span>👥 Employee Management</span>
          </div>

          <div
            className={`consoleModuleTab ${activeModule === "THEME_MGMT" ? "active" : ""}`}
            onClick={() => setActiveModule("THEME_MGMT")}
          >
            <span>🎨 Theme Management</span>
          </div>

          <hr style={{ margin: "16px 0", border: "none", borderTop: "1px dashed #cbd5e1" }} />

          {/* DEPARTMENT SUB-TABS IF IN EMPLOYEE MANAGEMENT */}
          {activeModule === "EMPLOYEE_MGMT" && (
            <>
              <h4 className="sidebarHeading">Departments & Profiles</h4>
              {["All", "Accounts", "Admin", "C&C", "HR", "IT", "Operations", "Patrolling"].map((tab) => (
                <div
                  key={tab}
                  className={`consoleTab ${activeDeptTab === tab ? "active" : ""}`}
                  onClick={() => setActiveDeptTab(tab)}
                >
                  <span>{tab === "All" ? "• All Employees" : `• ${tab} Department`}</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="consoleMain">
          {activeModule === "EMPLOYEE_MGMT" && (
            <>
              <div className="consoleToolbar">
                <h3>Employee Profile & Multi-Role Manager ({filteredEmployees.length})</h3>
                <input
                  type="text"
                  placeholder="Search by Employee Name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="consoleSearchInput"
                />
              </div>

              {loading ? (
                <div className="consoleLoading">Loading employees...</div>
              ) : (
                <table className="consoleTable">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Display Name</th>
                      <th>Primary Department</th>
                      <th>Assigned Extra Roles</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                          No employees found for department: {activeDeptTab}
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((emp) => {
                        const extra = Array.isArray(emp.extraRoles)
                          ? emp.extraRoles
                          : (emp.extraRoles || emp.ExtaRoles || "").split(",").filter(Boolean);

                        return (
                          <tr key={emp._id}>
                            <td><strong>{emp.employeeId || "EMP-000"}</strong></td>
                            <td>{emp.displayName || emp.employeeName}</td>
                            <td>
                              <span className="deptBadge">{emp.department || "Operations"}</span>
                            </td>
                            <td>
                              {extra.length > 0 ? (
                                extra.map((r, i) => (
                                  <span key={i} className="extraRoleBadge">
                                    +{r.trim()}
                                  </span>
                                ))
                              ) : (
                                <span style={{ color: "#94a3b8", fontSize: "12px" }}>None</span>
                              )}
                            </td>
                            <td>
                              <button className="manageRolesBtn" onClick={() => openRoleModal(emp)}>
                                ⚙️ Assign Extra Roles
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* THEME MANAGEMENT MODULE */}
          {activeModule === "THEME_MGMT" && (
            <div className="themeMgmtCard">
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
                🎨 Admin Theme & Appearance Management
              </h3>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
                Configure and apply global application color schemes and visual themes across all user sessions.
              </p>

              <div className="themeGrid">
                <div
                  className={`themeCard ${currentTheme === "regular" ? "selected" : ""}`}
                  onClick={() => handleThemeChange("regular")}
                >
                  <div className="themePreview regularPreview">
                    <div className="previewHeader"></div>
                    <div className="previewBody"></div>
                  </div>
                  <h4>Regular (Default Light)</h4>
                  <p>Standard clean slate theme with crisp blue accents.</p>
                  {currentTheme === "regular" && <span className="activeThemeTag">Active Theme</span>}
                </div>

                <div
                  className={`themeCard ${currentTheme === "green" ? "selected" : ""}`}
                  onClick={() => handleThemeChange("green")}
                >
                  <div className="themePreview greenPreview">
                    <div className="previewHeader"></div>
                    <div className="previewBody"></div>
                  </div>
                  <h4>Emerald Green</h4>
                  <p>Refreshingly vibrant green theme for enhanced contrast.</p>
                  {currentTheme === "green" && <span className="activeThemeTag">Active Theme</span>}
                </div>

                <div
                  className={`themeCard ${currentTheme === "white" ? "selected" : ""}`}
                  onClick={() => handleThemeChange("white")}
                >
                  <div className="themePreview whitePreview">
                    <div className="previewHeader"></div>
                    <div className="previewBody"></div>
                  </div>
                  <h4>Minimal White</h4>
                  <p>Ultra-clean high readability minimalist white theme.</p>
                  {currentTheme === "white" && <span className="activeThemeTag">Active Theme</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ASSIGN EXTRA ROLES & SUB-ROLES MODAL */}
      {selectedEmp && (
        <div className="consoleModalBackdrop">
          <div className="consoleModalCard" style={{ maxWidth: "560px" }}>
            <h3>Assign Roles & Access Rights for {selectedEmp.displayName || selectedEmp.employeeName}</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
              Primary Department: <strong>{selectedEmp.department || "Operations"}</strong>
            </p>

            {/* 1. ADMIN ROLE BLOCKER */}
            <div style={{ marginBottom: "18px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "12px 16px" }}>
              <label style={{ fontWeight: "700", color: "#991b1b", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={modalExtraRoles.includes("Admin")}
                  onChange={() => handleCheckboxToggle("Admin")}
                  style={{ width: "18px", height: "18px", accentColor: "#dc2626" }}
                />
                <span>Make System Admin (Full Admin Access across all modules & console)</span>
              </label>
            </div>

            {/* 2. SELECT EXTRA DEPARTMENT ROLES & SUB-ROLES */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "700", display: "block", marginBottom: "10px" }}>
                Select Department Access & Role Level (Multiple Selection Allowed):
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {ALL_ROLES.map((rName) => {
                  const isChecked = modalExtraRoles.includes(rName) || modalExtraRoles.some(r => r.startsWith(rName));
                  const deptKey = rName === "C&C" ? "CNC" : rName;

                  return (
                    <div
                      key={rName}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justify: "space-between",
                      }}
                    >
                      <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", color: "#1e293b" }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxToggle(rName)}
                          style={{ width: "16px", height: "16px" }}
                        />
                        <span>{rName}</span>
                      </label>

                      {isChecked && (
                        <select
                          value={modalSubRole && (modalSubRole.includes(deptKey) || modalSubRole.includes(rName)) ? modalSubRole : `${deptKey} Manager`}
                          onChange={(e) => setModalSubRole(e.target.value)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "13px",
                            fontWeight: "600",
                            background: "#ffffff",
                            color: "#0f172a",
                          }}
                        >
                          <option value={`${deptKey} Manager`}>{deptKey} Manager</option>
                          <option value={`${deptKey} Coordinator`}>{deptKey} Coordinator</option>
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modalFooter">
              <button className="saveRolesBtn" onClick={handleSaveRoles}>
                Save Roles & Permissions
              </button>
              <button className="cancelModalBtn" onClick={() => setSelectedEmp(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Console;
