import { useNavigate } from "react-router-dom";
import logo from "../../../../images/logo.png";
import ThemeSelector from "../../../../components/ThemeSelector";
import { useAuth } from "../../../../context/AuthContext";
import "./index.css";

function MyMailsNavBar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="myMailsNavbar">
      <div className="myMailsLogo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <img src={logo} alt="logo" className="myMailsLogoImage" />
        <div className="myMailsNavName">
          <p>My Mails</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <ThemeSelector />
        <div className="myMailsUserProfile">👤 {user?.username || "User"}</div>
      </div>
    </div>
  );
}

export default MyMailsNavBar;