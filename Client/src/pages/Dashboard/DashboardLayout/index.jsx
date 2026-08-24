import { useNavigate, useLocation, Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchApiData, extractArrayData } from "../../../utils/apiClient";
import "./index.css";
import DashbordNavbar from "../DashbordNavbar/index.jsx";
import { EmployeeContext } from "../DashboardRightLayout/EmployeeContext.js";

import { FiFileText, FiShield, FiUsers, FiCalendar, FiGrid } from "react-icons/fi";

const OperationsNavTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "Overview";

  const navItems = [
    { label: "Overview", tab: "Overview", icon: FiGrid },
    { label: "Timesheets", tab: "Timesheets", icon: FiFileText },
    { label: "Incidents", tab: "Incidents", icon: FiShield },
    { label: "Onboarding Candidate", tab: "Onboarding Candidate", icon: FiUsers },
    { label: "Roster", tab: "Roster", icon: FiCalendar },
  ];

  return (
    <nav className="operationsNavTabs" aria-label="Operations dashboard sections">
      <div className="operationsNavTabsList">
        {navItems.map((item) => {
          const active = activeTab === item.tab;
          const Icon = item.icon;
          return (
            <div
              key={item.tab}
              className={`operationsNavTab${active ? " active" : ""}`}
              onClick={() => navigate(`/main-dashboard?tab=${item.tab}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate(`/main-dashboard?tab=${item.tab}`);
                }
              }}
            >
              <Icon className="operationsNavTabIcon" size={16} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
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
