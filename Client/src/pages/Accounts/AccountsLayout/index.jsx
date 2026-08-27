import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../../../context/AuthContext";
import "./index.css";

function AccountsLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEndUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isEndUser && isEndUser()) {
      alert("Access Restricted: End User role cannot access management modules.");
      navigate("/");
    }
  }, [location.pathname]);

  // Expanded category dropdown states (default open based on active route)
  const [expandedCategories, setExpandedCategories] = useState({
    employee:
      location.pathname === "/accounts/payrun" ||
      location.pathname === "/accounts/employee-rate-card" ||
      location.pathname === "/accounts/parent",
    customer:
      location.pathname === "/accounts/customer-billing" ||
      location.pathname === "/accounts/customer-rate-card",
    requests:
      location.pathname.startsWith("/accounts/onboarding-request") ||
      location.pathname.startsWith("/accounts/offboarding-request"),
    onboardingReq: location.pathname.startsWith("/accounts/onboarding-request"),
    offboardingReq: location.pathname.startsWith("/accounts/offboarding-request"),
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
      icon: "",
      children: [
        {
          label: "PayRun",
          icon: "",
          path: "/accounts/payrun",
        },
        {
          label: "Rate Card",
          icon: "",
          path: "/accounts/employee-rate-card",
        },
      ],
    },
    {
      key: "customer",
      label: "Customer",
      icon: "",
      children: [
        {
          label: "Customer Billing",
          icon: "",
          path: "/accounts/customer-billing",
        },
        {
          label: "Rate Card",
          icon: "",
          path: "/accounts/customer-rate-card",
        },
      ],
    },
    {
      key: "requests",
      label: "Requests",
      icon: "",
      children: [
        {
          key: "onboardingReq",
          label: "Onboarding Request",
          subChildren: [
            { label: "All", path: "/accounts/onboarding-request/all" },
            { label: "Create New", path: "/onboarding/resonancerequirement/createnew" },
            { label: "Open", path: "/accounts/onboarding-request/open" },
            { label: "Work In Progress", path: "/accounts/onboarding-request/wip" },
            { label: "Pending", path: "/accounts/onboarding-request/pending" },
            { label: "Resolved", path: "/accounts/onboarding-request/resolved" },
            { label: "Closed", path: "/accounts/onboarding-request/closed" },
          ],
        },
        {
          key: "offboardingReq",
          label: "Offboarding Request",
          subChildren: [
            { label: "All", path: "/accounts/offboarding-request/all" },
            { label: "Create New", path: "/exit" },
            { label: "Open", path: "/accounts/offboarding-request/open" },
            { label: "Work In Progress", path: "/accounts/offboarding-request/wip" },
            { label: "Pending", path: "/accounts/offboarding-request/pending" },
            { label: "Resolved", path: "/accounts/offboarding-request/resolved" },
            { label: "Closed", path: "/accounts/offboarding-request/closed" },
          ],
        },
      ],
    },
    {
      label: "Onboarding Candidates",
      icon: "",
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
                        {group.children.map((child, cIdx) => {
                          if (child.subChildren) {
                            const isSubOpen = expandedCategories[child.key];
                            return (
                              <div key={child.key || cIdx}>
                                <div
                                  className={`categoryGroupHeader ${isSubOpen ? "activeCategory" : ""}`}
                                  style={{ paddingLeft: "32px", fontSize: "13.5px" }}
                                  onClick={() => toggleCategory(child.key)}
                                >
                                  <span>{child.label}</span>
                                  <span className="categoryArrowIcon" style={{ fontWeight: 700, fontSize: "14px" }}>
                                    {isSubOpen ? "-" : "+"}
                                  </span>
                                </div>

                                {isSubOpen && (
                                  <div className="categorySubmenuList" style={{ paddingLeft: "10px" }}>
                                    {child.subChildren.map((sub) => (
                                      <div
                                        key={sub.path}
                                        className={`submenuItem childItem ${
                                          location.pathname === sub.path ? "active" : ""
                                        }`}
                                        onClick={() => navigate(sub.path)}
                                        style={{ paddingLeft: "36px", fontSize: "13px" }}
                                      >
                                        <span className="menuText">• {sub.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
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
                          );
                        })}
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
