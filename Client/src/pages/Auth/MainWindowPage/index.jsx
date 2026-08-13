import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import "./index.css";

function MainWindowPage() {
  const navigate = useNavigate();

  return (
    <div className="mainWindowContainer">
      <div className="mainWindowTopBar">
        <img src={logo} alt="Enhance Logo" className="mainWindowLogo" />
        <button
          className="backToDashBtn"
          onClick={() => navigate("/")}
          title="Return to Dashboard"
        >
          🏠 Back to Dashboard
        </button>
      </div>

      <div className="mainWindowHeader">
        <h1 className="mainWindowMainTitle">Enhance Enterprise Portals</h1>
        <p className="mainWindowSubTitle">
          Select your destination portal workspace to log in or access features
        </p>
      </div>

      <div className="portalCardsGrid">
        {/* EMPLOYEE PORTAL CARD */}
        <div
          className="portalCard employeeCard"
          onClick={() => navigate("/login")}
        >
          <div className="portalBadge employeeBadge">Staff & Operations</div>
          <div className="portalIconCircle employeeIcon">👔</div>
          <h2 className="portalCardTitle">Employee Portal</h2>
          <p className="portalCardDesc">
            Access internal HRMS, Attendance, Shift Rosters, Timesheets,
            Accounts & IT Services.
          </p>
          <ul className="portalFeatureList">
            <li>✓ HRMS & Attendance Management</li>
            <li>✓ Roster Shifts & Time Tracking</li>
            <li>✓ Payroll, Accounts & Rate Cards</li>
            <li>✓ Internal Tickets & Help Desk</li>
          </ul>
          <button className="portalActionBtn employeeBtn">
            Enter Employee Portal →
          </button>
        </div>

        {/* VENDOR PORTAL CARD */}
        <div
          className="portalCard vendorCard"
          onClick={() => navigate("/vendor-login")}
        >
          <div className="portalBadge vendorBadge">Suppliers & Partners</div>
          <div className="portalIconCircle vendorIcon">🏬</div>
          <h2 className="portalCardTitle">Vendor Portal</h2>
          <p className="portalCardDesc">
            Access Vendor Compliance, Deliverables, Invoicing, Purchase Orders
            & Partner Management.
          </p>
          <ul className="portalFeatureList">
            <li>✓ Vendor Compliance & Onboarding</li>
            <li>✓ Financial Deliverables & Work Orders</li>
            <li>✓ Vendor Invoices & Billing Reconciliation</li>
            <li>✓ Service Contracts & Supplier Support</li>
          </ul>
          <button className="portalActionBtn vendorBtn">
            Enter Vendor Portal →
          </button>
        </div>
      </div>

      <div className="mainWindowFooter">
        <p>© 2026 Enhance Services Group | All Rights Reserved</p>
      </div>
    </div>
  );
}

export default MainWindowPage;
