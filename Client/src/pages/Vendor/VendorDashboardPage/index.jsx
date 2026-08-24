import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import "./index.css";

function VendorDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="vendorDashboardContainer">
      {/* TOP HEADER BAR */}
      <header className="vendorHeaderBar">
        <div className="vendorHeaderLeft">
          <img src={logo} alt="Logo" className="vendorHeaderLogo" />
          <span className="vendorBadge">🏬 Vendor Portal</span>
        </div>

        <div className="vendorHeaderRight">
          <span className="vendorNamePill">
            🏢 CleanTech Supplies Ltd (VND-101)
          </span>
          <button
            className="vendorHeaderBtn"
            onClick={() => navigate("/main-window")}
            title="Go to Main Window Portal Selection"
          >
            🪟 Main Window
          </button>
          <button
            className="vendorLogoutBtn"
            onClick={() => navigate("/vendor-login")}
            title="Log out of Vendor Portal"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* MAIN WHITE PAGE CONTENT */}
      <main className="vendorMainContent">
        <div className="vendorWelcomeBanner">
          <h1>Welcome to Vendor Portal</h1>
          <p>
            CleanTech Supplies Ltd (VND-101) • Supplier & Contractor Management Workspace
          </p>
        </div>

        <div className="vendorStatsRow">
          <div className="vendorStatCard">
            <span className="statIcon">📋</span>
            <div className="statInfo">
              <h3>Active Contracts</h3>
              <p className="statValue">1 Contract</p>
            </div>
          </div>

          <div className="vendorStatCard">
            <span className="statIcon">✅</span>
            <div className="statInfo">
              <h3>Deliverables Status</h3>
              <p className="statValue">Up to Date</p>
            </div>
          </div>

          <div className="vendorStatCard">
            <span className="statIcon">🛡️</span>
            <div className="statInfo">
              <h3>Compliance Status</h3>
              <p className="statValue verified">Verified Partner</p>
            </div>
          </div>
        </div>

        <div className="vendorContentBox">
          <h2 className="contentBoxTitle">Supplier Workspace Overview</h2>
          <p className="contentBoxDesc">
            Welcome to your dedicated Vendor Portal dashboard. Here you will be able to manage your contract deliverables, work orders, adhoc requests, and billing invoices.
          </p>

          <div className="vendorPlaceholderGrid">
            <div className="vendorPlaceholderCard">
              <h4>Contract Deliverables</h4>
              <p>View & submit scheduled contract tasks and deliverables.</p>
            </div>

            <div className="vendorPlaceholderCard">
              <h4>Invoicing & Payments</h4>
              <p>Track purchase orders, billing cycles, and invoice statuses.</p>
            </div>

            <div className="vendorPlaceholderCard">
              <h4>Compliance Documents</h4>
              <p>Upload ABN, ACN, insurance policies and compliance files.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VendorDashboardPage;
