import { useNavigate } from "react-router-dom";
import logo from "../../../../images/logo.png";
import "./index.css";

function MyTicketsNavBar() {
  const navigate = useNavigate();

  return (
    <div className="hrmsnavbar">
      <div className="hrmslogo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="hrmslogoimage" />
        <div className="navname">
          <p>My Tickets</p>
        </div>
      </div>

      <div className="profile">👤</div>
    </div>
  );
}

export default MyTicketsNavBar;
