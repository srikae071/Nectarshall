import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import "./index.css";

function VendorLoginPage() {
  const navigate = useNavigate();

  const [vendorCode, setVendorCode] = useState("VND-101");
  const [password, setPassword] = useState("vendor123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const sampleVendors = [
    { code: "VND-101", name: "CleanTech Supplies Ltd", pass: "vendor123" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!vendorCode.trim() || !password.trim()) {
      setErrorMsg("Please enter both Vendor Code/Email and Password.");
      return;
    }

    navigate("/vendor-dashboard");
  };

  const handleSelectVendor = (v) => {
    setVendorCode(v.code);
    setPassword(v.pass);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className="vendorLoginContainer">
      <div className="vendorLoginCard">
        <div className="vendorLoginHeader">
          <img src={logo} alt="Enhance Logo" className="vendorLoginLogo" />
          <div className="vendorBadgeHeader">🏬 Vendor Portal</div>
          <h2 className="vendorLoginTitle">Welcome to Vendor Portal</h2>
          <p className="vendorLoginSubtitle">
            Sign in to manage vendor compliance, deliverables & billing
          </p>
        </div>

        {errorMsg && <div className="vendorErrorAlert">{errorMsg}</div>}
        {successMsg && <div className="vendorSuccessAlert">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="vendorLoginForm">
          <div className="vendorFormGroup">
            <label htmlFor="vendorCodeInput">Vendor ID / Email</label>
            <input
              id="vendorCodeInput"
              type="text"
              className="vendorInput"
              value={vendorCode}
              onChange={(e) => setVendorCode(e.target.value)}
              placeholder="e.g. VEND-101 or vendor@cleantech.com"
              autoFocus
              required
            />
          </div>

          <div className="vendorFormGroup">
            <label htmlFor="vendorPasswordInput">Password</label>
            <div className="vendorPasswordWrapper">
              <input
                id="vendorPasswordInput"
                type={showPassword ? "text" : "password"}
                className="vendorInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter vendor password..."
                required
              />
              <button
                type="button"
                className="vendorTogglePasswordBtn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="vendorSubmitBtn">
            Sign In to Vendor Portal
          </button>
        </form>

        <div className="vendorHintBox">
          <p className="vendorHintTitle">🏬 Quick Select Vendor Profile:</p>
          <div className="vendorProfileChips">
            {sampleVendors.map((v, idx) => (
              <button
                key={idx}
                type="button"
                className={`vendorChip ${vendorCode === v.code ? "active" : ""}`}
                onClick={() => handleSelectVendor(v)}
              >
                🏢 {v.name} ({v.code})
              </button>
            ))}
          </div>
        </div>

        <div className="vendorFooterNav">
          <button
            type="button"
            className="vendorNavBtn secondary"
            onClick={() => navigate("/login")}
          >
            👔 Switch to Employee Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorLoginPage;
