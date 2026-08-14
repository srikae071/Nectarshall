import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import leaveImg from "../../../images/leavemanagement.jfif";
import payrollImg from "../../../images/payrools.jfif";
import rosterImg from "../../../images/roster.jfif";
import "./index.css";

function OpMainPage() {
  const navigate = useNavigate();

  return (
    <div className="OPPage">
      <div className="navbar">
        <div className="logo">
          <img
            src={logo}
            className="logoimage"
            alt="Logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="navTitle">Organisation Policies</div>
      </div>

      <div className="opContentContainer" style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "32px", fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
          Organisation Policies & Key Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 1. LEAVE MANAGEMENT PHOTO */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              transition: "transform 0.2s ease, boxShadow 0.2s ease",
            }}
          >
            <img
              src={leaveImg}
              alt="Leave Management"
              style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "16px", textAlign: "center", fontWeight: "700", fontSize: "16px", color: "#0f172a" }}>
              Leave Management
            </div>
          </div>

          {/* 2. PAYROLL PHOTO */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              transition: "transform 0.2s ease, boxShadow 0.2s ease",
            }}
          >
            <img
              src={payrollImg}
              alt="Payroll"
              style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "16px", textAlign: "center", fontWeight: "700", fontSize: "16px", color: "#0f172a" }}>
              Payroll
            </div>
          </div>

          {/* 3. ROSTER / SHIFT PHOTO */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              transition: "transform 0.2s ease, boxShadow 0.2s ease",
            }}
          >
            <img
              src={rosterImg}
              alt="Shift & Roster"
              style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "16px", textAlign: "center", fontWeight: "700", fontSize: "16px", color: "#0f172a" }}>
              Shift & Roster
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpMainPage;
