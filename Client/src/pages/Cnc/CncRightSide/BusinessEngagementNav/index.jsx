import { useNavigate } from "react-router-dom";
import logo from "../../../../images/logo.png";
import "./index.css";

function BusinessEngagementNavBar() {
  const navigate = useNavigate();

  return (
    <div className="hrmsnavbar">
      <div
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "80px",
            height: "38px",
            objectFit: "contain",
          }}
        />
        <span
          style={{
            color: "#ea580c",
            fontWeight: "700",
            fontStyle: "normal",
            fontSize: "16px",
            whiteSpace: "nowrap",
            lineHeight: "1",
          }}
        >
          BUSINESS ENGAGEMENT
        </span>
      </div>

      <div className="profile"></div>
    </div>
  );
}

export default BusinessEngagementNavBar;
