import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import "./index.css";

function PatrollingNavbar() {
  const navigate = useNavigate();

  return (
    <div className="opnavbar">
      <div className="oplogo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logoimage" />
        <div className="operationslogoname">
          <p style={{ color: "#db3939", fontStyle: "italic" }}>PATROLLING</p>
        </div>
      </div>

      <div className="profile">👤</div>
    </div>
  );
}

export default PatrollingNavbar;
