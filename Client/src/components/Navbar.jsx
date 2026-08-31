import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchProfile, allProfiles } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const username = (user?.displayName || user?.username || "").toLowerCase();
  const role = (user?.role || "").toUpperCase();
  const dept = (user?.department || "").toUpperCase();
  const isAdmin = role === "ADMIN" || username.includes("sumit") || dept === "ADMIN";

  const getModuleLabel = () => {
    const p = location.pathname.toLowerCase();

    // 0. Standalone Form & Request Page Titles (Top Priority)
    if (p.includes("/payroll")) {
      return "PAYROLLS";
    }
    if (p.includes("/ask-for-hr") || p.includes("/askforhr")) {
      return "ASK FOR HR";
    }
    if (p.includes("/ask-for-it") || p.includes("/askforit")) {
      return "ASK FOR IT";
    }
    if (p.includes("/business-engagement")) {
      return "BUSINESS ENGAGEMENT";
    }
    if (p.includes("/resonance") || p.includes("/employeerequest") || p.includes("/employe-request")) {
      return "EMPLOYEE REQUEST";
    }
    if (p.includes("/exit")) {
      return "EXIT";
    }
    if (p.includes("/leave")) {
      return "LEAVE MANAGEMENT";
    }

    // 1. CNC Module Routes
    if (
      p.includes("/cnc") ||
      p.includes("/client/onboarding-compliance") ||
      p.includes("/client-complience") ||
      p.includes("/onboaeding-complience") ||
      p.includes("/onboarding-compliance") ||
      p.includes("/supplier/onboardingcompilence") ||
      p.includes("/onboarding-supplier") ||
      p.includes("/offboarding-supplier") ||
      p.includes("/onb")
    ) {
      return "CNC";
    }

    // 2. ACCOUNTS Module Routes
    if (p.includes("/accounts")) {
      return "ACCOUNTS";
    }

    // 3. HRMS Module Routes
    if (
      p.includes("/hrms") ||
      p.includes("/regular-form") ||
      p.includes("/add-employee") ||
      p.includes("/onboarding") ||
      p.includes("/offboarding") ||
      p.includes("/candidate") ||
      p.includes("/offerletter") ||
      p.includes("/prejoining") ||
      p.includes("/resonancereq") ||
      p.includes("/employee-request-save")
    ) {
      return "HRMS";
    }

    // 4. IT Module Routes
    if (p.includes("/it")) {
      return "IT";
    }

    // 5. OPERATIONS Module Routes
    if (
      p.includes("/operations") ||
      p.includes("/timesheets") ||
      p.includes("/roster") ||
      p.includes("/main-dashboard") ||
      p.includes("/schedule") ||
      p.includes("/employe-sites") ||
      p.includes("/reports") ||
      p.includes("/incidents") ||
      p.includes("/add-adhoc")
    ) {
      return "OPERATIONS";
    }

    // 6. Other Modules
    if (p.includes("/my-tasks")) return "MY TASKS";
    if (p.includes("/my-tickets")) return "MY TICKETS";
    if (p.includes("/my-mails")) return "MY MAILS";
    if (p.includes("/payroll")) return "PAYROLLS";
    if (p.includes("/organisation-policies")) return "ORGANIZATION POLICIES";
    if (p.includes("/patrolling")) return "PATROLLING";

    return "";
  };

  const moduleLabel = getModuleLabel();

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/login");
  };

  const handleSwitchAccount = (profileUsername) => {
    switchProfile(profileUsername);
    setShowProfileMenu(false);
  };

  return (
    <div className="opnavbar">
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
      >
        <img src={logo} alt="logo" className="logoimage" />
        {moduleLabel && (
          <div className="operationslogoname">
            <p style={{ color: "#db3939", fontStyle: "italic" }}>{moduleLabel}</p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="button"
          onClick={() => navigate("/main-window")}
          title="Go to Main Window Portal Selection"
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
            color: "#ffffff",
            border: "none",
            fontWeight: "700",
            fontSize: "12.5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}
        >
          🪟 Main Window
        </button>

        <div className="userProfileMenuContainer" style={{ position: "relative" }}>
          <div
            className="profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="User Account Options"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            👤 {user?.displayName || user?.username || "User"}
          </div>

          {showProfileMenu && (
            <div
              className="userProfileDropdown"
              style={{
                position: "absolute",
                right: 0,
                top: "40px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                padding: "14px 16px",
                width: "240px",
                zIndex: 9999,
                color: "#0f172a",
              }}
            >
              {/* CURRENT LOGGED IN USER */}
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "14.5px",
                  color: "#047857",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "6px",
                  marginBottom: "6px",
                }}
              >
                👤 {user?.displayName || user?.username}
              </div>

              <div style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "12px" }}>
                Role: <strong>{user?.role || "Employee"}</strong>
              </div>

              {/* MAIN WINDOW PORTAL BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/main-window");
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "13px",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                🪟 Main Window
              </button>

              {/* LOGOUT BUTTON */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "13px",
                  marginBottom: "14px",
                }}
              >
                🚪 Logout
              </button>

              {/* SWITCH ACCOUNT PROFILE */}
              {isAdmin && (
                <div
                  style={{
                    borderTop: "1px dashed #cbd5e1",
                    paddingTop: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#475569",
                      marginBottom: "8px",
                    }}
                  >
                    🔄 Switch User Account:
                  </div>

                  <div
                    style={{
                      maxHeight: "160px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {(allProfiles || []).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSwitchAccount(p.username)}
                        style={{
                          textAlign: "left",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          background:
                            user?.username?.toLowerCase() === p.username?.toLowerCase()
                              ? "#dcfce7"
                              : "#f8fafc",
                          color:
                            user?.username?.toLowerCase() === p.username?.toLowerCase()
                              ? "#166534"
                              : "#334155",
                          fontWeight: "600",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>👤 {p.username}</span>
                        <span style={{ fontSize: "10.5px", color: "#64748b" }}>
                          [{p.department || "Ops"}]
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
