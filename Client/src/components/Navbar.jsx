import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import ThemeSelector from "./ThemeSelector";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="opnavbar">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <img src={logo} alt="logo" className="logoimage" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                borderRadius: "8px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                padding: "12px 14px",
                width: "200px",
                zIndex: 9999,
                color: "#0f172a",
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "8px" }}>
                {user?.displayName || user?.username}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                Role: <strong>{user?.role}</strong>
              </div>
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
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
