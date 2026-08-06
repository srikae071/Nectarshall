import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import "./index.css";

function AccountsLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    {
      label: "Parent",
      icon: "🏢",
      path: "/accounts/parent",
    },
    {
      label: "PayRun",
      icon: "📋",
      path: "/accounts/payrun",
    },
    {
      label: "Expenditure",
      icon: "💸",
      path: "/accounts/expenditure",
    },
    {
      label: "Reconciliation",
      icon: "⚖️",
      path: "/accounts/reconciliation",
    },
    {
      label: "Customer Billing",
      icon: "💳",
      path: "/accounts/customer-billing",
    },
  ];

  return (
    <div className="layoutContainer">
      <Navbar />

      <div className="mainLayout">
        <div
          className={`accountssidebar ${sidebarCollapsed ? "collapsed" : ""}`}
        >
          <div className="sidebarTop">
            <button
              className="hamburgerBtn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title="Toggle Sidebar"
            >
              ☰
            </button>
          </div>

          <div className="sidebarNavList">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className={`submenuItem ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <span className="menuIcon">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="menuText">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rightContent">{children}</div>
      </div>
    </div>
  );
}

export default AccountsLayout;
