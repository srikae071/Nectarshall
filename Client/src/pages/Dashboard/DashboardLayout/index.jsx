import { useNavigate, useLocation, Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchApiData, extractArrayData } from "../../../utils/apiClient";
import { FiFileText, FiBarChart2, FiShield, FiUsers, FiCalendar } from "react-icons/fi";

import "./index.css";
import DashbordNavbar from "../DashbordNavbar/index.jsx";
import { EmployeeContext } from "../DashboardRightLayout/EmployeeContext.js";

const OperationsNavTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isDashboardRoute =
    path === "/main-dashboard" ||
    path === "/dashboard";

  if (!isDashboardRoute) return null;

  const isActive = (p) => {
    if (p === "/timesheets") return path.startsWith("/timesheets") || path.startsWith("/schedule");
    if (p === "/reports") return path.startsWith("/reports");
    if (p === "/incidents") return path.startsWith("/incidents");
    if (p === "/Operations-Complience/All") return path.includes("Complience") || path.includes("onboarding-client");
    if (p === "/roster") return path.startsWith("/roster");
    return false;
  };

  const navItems = [
    { label: "Timesheets", path: "/timesheets", icon: FiFileText },
    { label: "Reports", path: "/reports", icon: FiBarChart2 },
    { label: "Incidents", path: "/incidents", icon: FiShield },
    { label: "Onboarding Candidate", path: "/Operations-Complience/All", icon: FiUsers },
    { label: "Roster", path: "/roster", icon: FiCalendar },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: "56px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <span
          onClick={() => navigate("/main-dashboard")}
          style={{ cursor: "pointer", color: "#0f172a", fontSize: "16px", fontWeight: 700 }}
        >
          Operations
        </span>
      </div>

      {/* Nav Tabs with Icons */}
      <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "14.5px",
                fontWeight: active ? 600 : 500,
                color: active ? "#2563eb" : "#64748b",
                borderBottom: active ? "2.5px solid #2563eb" : "2.5px solid transparent",
                padding: "16px 4px 14px 4px",
                transition: "all 0.15s ease-in-out",
              }}
            >
              <Icon size={16} style={{ color: active ? "#2563eb" : "#64748b" }} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openOnboarding, setOpenOnboarding] = useState(false);
  // const [openAdhoc, setOpenAdhoc] = useState(false);

  const [employeeTrigger, setEmployeeTrigger] = useState(0);

  const [manualToggle, setManualToggle] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isScheduleRoute = location.pathname.startsWith("/schedule");

  const openSchedule = isScheduleRoute || manualToggle;

  // ==========================
  // Dynamic Customer States
  // ==========================

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [customerError, setCustomerError] = useState("");

  const generateEmployees = () => {
    setEmployeeTrigger((prev) => prev + 1);
  };

  // ==========================
  // Fetch Approved Customers
  // ==========================

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      setCustomerError("");

      const response = await fetchApiData("/api/BoardingCandidates");
      const data = extractArrayData(response.data);

      const approvedCustomers = data.filter(
        (item) =>
          (item.operationsClientApproved === true ||
            !item.operationsClientApproved) &&
          (item.status === "On Boarded" ||
            item.status === "Onboarded" ||
            !item.status),
      );

      const uniqueCustomers = [
        ...new Set(
          approvedCustomers
            .map((item) => item.requester)
            .filter((item) => item && item.trim() !== ""),
        ),
      ];

      setCustomers(uniqueCustomers);

      // if (uniqueCustomers.length > 0) {
      //   setSelectedCustomer(uniqueCustomers[0]);
      // }
      if (location.state?.requester) {
        setSelectedCustomer(location.state.requester);
      } else if (uniqueCustomers.length > 0) {
        setSelectedCustomer(uniqueCustomers[0]);
      }
    } catch (error) {
      console.error("Failed to load customers", error);

      setCustomerError("Unable to load customers.");
    } finally {
      setLoadingCustomers(false);
    }
  };

  // ====================================
  // Navigation Helpers
  // ====================================

  const openEmployeeSchedule = () => {
    navigate("/schedule", {
      state: {
        requester: selectedCustomer,
      },
    });
  };

  const openSiteSchedule = () => {
    navigate("/employe-sites", {
      state: {
        requester: selectedCustomer,
      },
    });
  };

  return (
    <div className="layoutContainer">
      <DashbordNavbar />

      <div className="mainLayout">
        {/* LEFT SIDEBAR */}

        <div
          className={`operationssidebar ${sidebarCollapsed ? "collapsed" : ""}`}
        >
          {/* DASHBOARD */}
          <div className="sidebarTop">
            <button
              className="hamburgerBtn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              ☰
            </button>
          </div>
          <div
            className={`submenuItem ${
              location.pathname === "/dashboard" || location.pathname === "/main-dashboard" ? "active" : ""
            }`}
            onClick={() => {
              navigate("/main-dashboard");
            }}
          >
            <span className="menuIcon" style={{ fontWeight: 700, fontSize: "16px", color: "#ffffff" }}>
              {sidebarCollapsed ? "D" : ""}
            </span>

            {!sidebarCollapsed && <span className="menuText">Dashboard</span>}
          </div>

          {/* TIMESHEETS */}

          <div
            className={`submenuItem ${
              location.pathname === "/timesheets" ? "active" : ""
            }`}
            onClick={() => navigate("/timesheets")}
          >
            <span className="menuIcon" style={{ fontWeight: 700, fontSize: "16px", color: "#ffffff" }}>
              {sidebarCollapsed ? "T" : ""}
            </span>

            {!sidebarCollapsed && <span className="menuText">Timesheets</span>}
          </div>

          {/* REPORTS */}

          <div
            className={`submenuItem ${
              location.pathname === "/reports" ? "active" : ""
            }`}
            onClick={() => navigate("/reports")}
          >
            <span className="menuIcon" style={{ fontWeight: 700, fontSize: "16px", color: "#ffffff" }}>
              {sidebarCollapsed ? "R" : ""}
            </span>

            {!sidebarCollapsed && <span className="menuText">Reports</span>}
          </div>

          {/* INCIDENTS */}

          <div
            className={`submenuItem ${
              location.pathname === "/incidents" ? "active" : ""
            }`}
            onClick={() => navigate("/incidents")}
          >
            <span className="menuIcon" style={{ fontWeight: 700, fontSize: "16px", color: "#ffffff" }}>
              {sidebarCollapsed ? "I" : ""}
            </span>

            {!sidebarCollapsed && <span className="menuText">Incidents</span>}
          </div>

          {/* ONBOARDING CLIENT */}

          <div className="menuBlock">
            <div
              className="menuHeader"
              onClick={() => {
                if (sidebarCollapsed) {
                  setSidebarCollapsed(false);
                  setOpenOnboarding(true);
                  return;
                }

                setOpenOnboarding(!openOnboarding);
              }}
            >
              <div className="menuLeft">
                <span className="menuIcon" style={{ fontWeight: 700, fontSize: "16px", color: "#ffffff" }}>
                  {sidebarCollapsed ? "O" : ""}
                </span>

                {!sidebarCollapsed && (
                  <span className="menuText">On Boarding Client</span>
                )}
              </div>

              {!sidebarCollapsed && (
                <span className="togglePlus">{openOnboarding ? "-" : "+"}</span>
              )}
            </div>

            {openOnboarding && (
              <div className="submenuDropdown">
                <div
                  className={`submenuItem ${
                    location.pathname === "/Operations-Complience/All"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("/Operations-Complience/All")}
                >
                  {sidebarCollapsed ? "A" : "All"}
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "/onboarding-client-open"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("/onboarding-client-open")}
                >
                  {sidebarCollapsed ? "O" : "Open"}
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "/onboarding-client-pending"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("/onboarding-client-pending")}
                >
                  {sidebarCollapsed ? "P" : "Pending"}
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "/onboarding-client-new"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("/onboarding-client-new")}
                >
                  {sidebarCollapsed ? "N" : "New Client"}
                </div>
              </div>
            )}
          </div>
          <div
            className={`submenuItem ${
              location.pathname === "/roster" ? "active" : ""
            }`}
            onClick={() => navigate("/roster")}
          >
            <span className="menuIcon" style={{ fontWeight: 700, fontSize: "16px", color: "#ffffff" }}>
              {sidebarCollapsed ? "R" : ""}
            </span>

            {!sidebarCollapsed && <span className="menuText">Roster</span>}
          </div>
          <div
            className={`submenuItem ${
              location.pathname === "/add-adhoc" ? "active" : ""
            }`}
            onClick={() => navigate("/add-adhoc")}
          >
            <span className="menuIcon" style={{ fontWeight: 700, fontSize: "16px", color: "#ffffff" }}>
              {sidebarCollapsed ? "A" : ""}
            </span>

            {!sidebarCollapsed && <span className="menuText">Add Adhoc</span>}
          </div>
          {/* <div
            className={`submenuItem ${
              location.pathname === "/dashboard/employee" ? "active" : ""
            }`}
            onClick={() => navigate("/dashboard/employee")}
          >
            <span className="menuIcon">👥</span>

            {!sidebarCollapsed && <span className="menuText">Employee</span>}
          </div> */}
        </div>

        {/* RIGHT CONTENT */}

        <EmployeeContext.Provider
          value={{
            trigger: employeeTrigger,
            generateEmployees,
            selectedCustomer,
            customers,
          }}
        >
          <div className="rightContent">
            <OperationsNavTabs />
            {children ? children : <Outlet />}
          </div>
        </EmployeeContext.Provider>
      </div>
    </div>
  );
}

export default DashboardLayout;
