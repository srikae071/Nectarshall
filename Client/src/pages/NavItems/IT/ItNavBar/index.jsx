import { useNavigate } from "react-router-dom";
import logo from "../../../../images/logo.png";
import ThemeSelector from "../../../../components/ThemeSelector";
import "./index.css";

function ItNavbar() {
  const navigate = useNavigate();

  return (
    <div className="hrmsnavbar">
      <div className="hrmslogo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="hrmslogoimage" />
        <div className="navname">
          <p>IT</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <ThemeSelector />
        <div className="profile">👤</div>
      </div>
    </div>
  );
}

export default ItNavbar;
