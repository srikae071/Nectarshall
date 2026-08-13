import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../images/logo.png";
import "./index.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, allProfiles } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const initialUsername = searchParams.get("username") || "";

  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("enhance123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
    }
  }, [initialUsername]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    const result = login(username, password);
    if (result.success) {
      navigate("/");
    } else {
      setErrorMsg(result.message || "Invalid credentials.");
    }
  };

  const handleSelectProfile = (profileUsername) => {
    setUsername(profileUsername);
    setPassword("enhance123");
    setErrorMsg("");
  };

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <div className="loginHeader">
          <img src={logo} alt="Enhance Logo" className="loginLogo" />
          <h2 className="loginTitle">Welcome Back</h2>
          <p className="loginSubtitle">
            Please sign in to access Enhance Portal
          </p>
        </div>

        {errorMsg && <div className="loginErrorAlert">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="loginForm">
          <div className="loginFormGroup">
            <label htmlFor="usernameInput">Username</label>
            <input
              id="usernameInput"
              type="text"
              className="loginInput"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (e.g. Rahul, Sumit, Srikar, Karan)"
              autoFocus
              required
            />
          </div>

          <div className="loginFormGroup">
            <label htmlFor="passwordInput">Password</label>
            <div className="passwordWrapper">
              <input
                id="passwordInput"
                type={showPassword ? "text" : "password"}
                className="loginInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
              />
              <button
                type="button"
                className="togglePasswordBtn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="loginSubmitBtn">
            Sign In
          </button>
        </form>

        <div className="loginHintBox" style={{ marginTop: "20px", textAlign: "left" }}>
          <p className="hintTitle" style={{ fontWeight: "700", marginBottom: "8px", fontSize: "13px" }}>
            👤 Select User Account Profile:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(allProfiles || []).map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectProfile(p.username)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: username === p.username ? "1.5px solid #047857" : "1px solid #cbd5e1",
                  background: username === p.username ? "#dcfce7" : "#f8fafc",
                  color: username === p.username ? "#15803d" : "#334155",
                  fontWeight: "600",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                👤 {p.username}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "12px", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => navigate("/main-window")}
            style={{
              background: "transparent",
              border: "none",
              color: "#0284c7",
              fontWeight: "700",
              fontSize: "12.5px",
              cursor: "pointer",
            }}
          >
            🪟 Switch Portal (Main Window)
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
