import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import ThemeSelector from "./ThemeSelector";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logoimage" />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <ThemeSelector />
        <div className="profile">👤</div>
      </div>
    </div>
  );
}

export default Navbar;
