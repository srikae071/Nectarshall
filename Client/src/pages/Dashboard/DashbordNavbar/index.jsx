import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../images/logo.png";
import ThemeSelector from "../../../components/ThemeSelector";
import "./index.css";

function HrmsNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCnc = location.pathname.toLowerCase().includes("/cnc");
  const headerTitle = isCnc ? "CNC" : "OPERATIONS";

  return (
    <div className="opnavbar">
      <div className="oplogo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" style={{ width: "80px", height: "38px", objectFit: "contain" }} />
        <span style={{ color: "#ea580c", fontWeight: "700", fontStyle: "normal", fontSize: "16px", marginLeft: "10px", lineHeight: "1", whiteSpace: "nowrap" }}>{headerTitle}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <ThemeSelector />
        <div className="profile">👤</div>
      </div>
    </div>
  );
}

export default HrmsNavbar;
