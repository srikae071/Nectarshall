import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logoimage" />
      </div>

      <div className="profile">👤</div>
    </div>
  );
}

export default Navbar;
