import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../images/logo.png";
import ThemeSelector from "../../../components/ThemeSelector";
import { useAuth } from "../../../context/AuthContext";
import "./index.css";

function DashbordNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isCnc = location.pathname.toLowerCase().includes("/cnc");
  const headerTitle = isCnc ? "CNC" : "OPERATIONS";

  return (
    <div className="opnavbar">
      <div className="oplogo" onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
        <img src={logo} alt="logo" className="logoimage" style={{ width: "92px", height: "44px", objectFit: "contain", margin: 0 }} />
        <div style={{ display: "flex", alignItems: "center", paddingTop: "6px" }}>
          <p style={{ color: "#d32f2f", fontStyle: "italic", fontWeight: "800", fontSize: "20px", margin: 0, padding: 0, lineHeight: "1" }}>{headerTitle}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <ThemeSelector />
        <div className="profile" style={{ fontWeight: "800", fontSize: "14px", cursor: "default" }}>
          👤 {user?.displayName || user?.username || "User"}
        </div>
      </div>
    </div>
  );
}

export default DashbordNavbar;
