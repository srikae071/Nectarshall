import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import "./index.css";

function PatrollingNavbar() {
  const navigate = useNavigate();

  return (
    <div className="opnavbar">
      <div className="oplogo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" style={{ width: "80px", height: "38px", objectFit: "contain" }} />
        <span style={{ color: "#ea580c", fontWeight: "700", fontStyle: "normal", fontSize: "16px", marginLeft: "10px", lineHeight: "1", whiteSpace: "nowrap" }}>PATROLLING</span>
      </div>

      <div className="profile">👤</div>
    </div>
  );
}

export default PatrollingNavbar;
