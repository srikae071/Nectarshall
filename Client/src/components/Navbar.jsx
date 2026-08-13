import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png";
import ThemeSelector from "./ThemeSelector";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, allProfiles } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getModuleLabel = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes("/accounts")) return "ACCOUNTS";
    if (
      p.includes("/operations") ||
      p.includes("/timesheets") ||
      p.includes("/roster") ||
      p.includes("/client/onboarding-compliance")
    )
      return "OPERATIONS";
    if (p.includes("/hrms")) return "HRMS";
    if (p.includes("/it")) return "IT";
    return "";
  };

  const moduleLabel = getModuleLabel();

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/login");
  };

  const handleSwitchAccount = (profileUsername) => {
    logout();
    setShowProfileMenu(false);
    navigate(`/login?username=${encodeURIComponent(profileUsername)}`);
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
          <span
            style={{
              fontSize: "15px",
              fontWeight: "800",
              color: "#047857",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            | {moduleLabel}
          </span>
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

        <ThemeSelector />

        <div className="userProfileMenuContainer" style={{ position: "relative" }}>
          <div
            className="profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="User Account Options"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            👤 {user?.username || "User"}
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
                        justify: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>👤 {p.username}</span>
                      <span style={{ fontSize: "10px", color: "#64748b" }}>
                        ({p.role || "Employee"})
                      </span>
                    </button>
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

export default Navbar;
