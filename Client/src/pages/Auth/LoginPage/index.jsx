import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../images/logo.png";
import "./index.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
              placeholder="Enter username (Kuran)"
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

        {/* <div className="loginHintBox">
          <p className="hintTitle">💡 Demo Credentials:</p>
          <ul>
            <li>
              <strong>Sumit</strong> (Password: <code>ENHANCE123</code>) → All
              Modules
            </li>
            <li>
              <strong>Srikar</strong> (Password: <code>ENHANCE123</code>) → HRMS
              + My Tasks
            </li>
            <li>
              <strong>Karan</strong> (Password: <code>ENHANCE123</code>) → IT &
              Operations + My Tasks
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default LoginPage;
