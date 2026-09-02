import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../images/logo.png";
import ThemeSelector from "../../../components/ThemeSelector";
import "./index.css";

function DashbordNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

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

      <div style={{ display: "flex", alignItems: "center" }}>
        <ThemeSelector />
        <div className="profile">👤</div>
      </div>
    </div>
  );
}

export default DashbordNavbar;
