import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../../images/logo.png";
import { useAuth } from "../../../../context/AuthContext";
import "./index.css";

function LeaveManagementNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div
      className="hrmsnavbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 24px",
        height: "60px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "80px",
            height: "38px",
            objectFit: "contain",
          }}
        />
        <span
          style={{
            color: "#ea580c",
            fontWeight: "700",
            fontSize: "16px",
            whiteSpace: "nowrap",
          }}
        >
          LEAVE MANAGEMENT
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ color: "#94a3b8", fontSize: "13px" }}>
          {user?.displayName || user?.username || ""}
        </span>
      </div>
    </div>
  );
}

export default LeaveManagementNavBar;
