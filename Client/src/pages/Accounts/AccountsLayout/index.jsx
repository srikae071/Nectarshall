import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import "./index.css";

function AccountsLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Expanded category dropdown states (default open based on active route)
  const [expandedCategories, setExpandedCategories] = useState({
    employee:
      location.pathname === "/accounts/payrun" ||
      location.pathname === "/accounts/employee-rate-card" ||
      location.pathname === "/accounts/parent",
    customer:
      location.pathname === "/accounts/customer-billing" ||
      location.pathname === "/accounts/customer-rate-card",
  });

  const toggleCategory = (catKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  const navCategories = [
    {
      key: "employee",
      label: "Employee",
      icon: "👤",
      children: [
        {
          label: "PayRun",
          icon: "📋",
          path: "/accounts/payrun",
        },
        {
          label: "Rate Card",
          icon: "🏷️",
          path: "/accounts/employee-rate-card",
        },
      ],
    },
    {
      key: "customer",
      label: "Customer",
      icon: "🏢",
      children: [
        {
          label: "Customer Billing",
          icon: "💳",
          path: "/accounts/customer-billing",
        },
        {
          label: "Rate Card",
          icon: "🏷️",
          path: "/accounts/customer-rate-card",
        },
      ],
    },
    // {
    //   label: "Expenditure",
    //   icon: "💸",
    //   path: "/accounts/expenditure",
    // },
    // {
    //   label: "Reconciliation",
    //   icon: "⚖️",
    //   path: "/accounts/reconciliation",
    // },
    {
      label: "Onboarding Candidates",
      icon: "👥",
      path: "/accounts/onboarding-candidates",
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
            {navCategories.map((group, index) => {
              if (group.children) {
                const isOpen = expandedCategories[group.key];
                const hasActiveChild = group.children.some(
                  (child) => location.pathname === child.path,
                );

                return (
                  <div
                    key={group.key || index}
                    className="categoryGroupWrapper"
                  >
                    <div
                      className={`categoryGroupHeader ${
                        hasActiveChild ? "activeCategory" : ""
                      }`}
                      onClick={() => toggleCategory(group.key)}
                      title={group.label}
                    >
                      <div className="categoryHeaderLeft">
                        <span className="menuIcon">{group.icon}</span>
                        {!sidebarCollapsed && (
                          <span className="categoryTitleText">
                            {group.label}
                          </span>
                        )}
                      </div>
                      {!sidebarCollapsed && (
                        <span className="categoryArrowIcon" style={{ fontWeight: 700, fontSize: "16px" }}>
                          {isOpen ? "-" : "+"}
                        </span>
                      )}
                    </div>

                    {isOpen && !sidebarCollapsed && (
                      <div className="categorySubmenuList">
                        {group.children.map((child) => (
                          <div
                            key={child.path}
                            className={`submenuItem childItem ${
                              location.pathname === child.path ? "active" : ""
                            }`}
                            onClick={() => navigate(child.path)}
                          >
                            <span className="menuIcon">{child.icon}</span>
                            <span className="menuText">{child.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={group.path}
                  className={`submenuItem ${
                    location.pathname === group.path ? "active" : ""
                  }`}
                  onClick={() => navigate(group.path)}
                >
                  <span className="menuIcon">{group.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="menuText">{group.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rightContent">{children}</div>
      </div>
    </div>
  );
}

export default AccountsLayout;
