import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import ThemeSelector from "../../../components/ThemeSelector";
import "./index.css";

function CncNavbar() {
  const navigate = useNavigate();

  return (
    <div className="hrmsnavbar">
      <div className="hrmslogo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <img src={logo} alt="logo" className="hrmslogoimage" />
        <span className="navbarModuleLabel">
          | C&C
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ThemeSelector />
        <div className="profile"></div>
      </div>
    </div>
  );
}

export default CncNavbar;
