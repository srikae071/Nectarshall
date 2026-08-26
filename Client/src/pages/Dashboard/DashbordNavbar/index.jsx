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
        <img src={logo} alt="logo" className="logoimage" />
        <div className="operationslogoname">
          <p style={{ color: "#db3939", fontStyle: "italic" }}>{headerTitle}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <ThemeSelector />
        <div className="profile">👤</div>
      </div>
    </div>
  );
}

export default HrmsNavbar;
