import { useNavigate, useLocation, Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import "./index.css";
import DashbordNavbar from "../DashbordNavbar/index.jsx";
import { EmployeeContext } from "../DashboardRightLayout/EmployeeContext.js";
// import { SidebarProvider } from "../SidebarContext";
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

      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates",
      );

      const data = Array.isArray(response.data) ? response.data : [];

      const approvedCustomers = data.filter(
        (item) =>
          item.operationsClientApproved === true &&
          item.status === "On Boarded",
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
              location.pathname === "/dashboard" ? "active" : ""
            }`}
            onClick={() => {
              navigate("/main-dashboard");
            }}
          >
            <span className="menuIcon">📊</span>

            {!sidebarCollapsed && <span className="menuText">Dashboard</span>}
          </div>

          {/* SCHEDULE */}

          <div className="menuBlock">
            <div
              className="submenuItem toggleHeader"
              onClick={() => {
                navigate("/schedule");
                setManualToggle(false);
              }}
            >
              <div className="menuLeft">
                <span className="menuIcon">📅</span>

                {!sidebarCollapsed && (
                  <span className="menuText">Schedule</span>
                )}
              </div>

              {!sidebarCollapsed && <span>{openSchedule ? "-" : "+"}</span>}
            </div>

            {openSchedule && !sidebarCollapsed && (
              <div className="schedulePanel">
                <div className="publishBox">
                  <div>Publish & Notify</div>

                  <small>0 Shifts Unpublished</small>
                </div>

                {/* CUSTOMER */}
                {/* CUSTOMER */}

                <div className="section">
                  <label>SELECT CUSTOMER:</label>

                  {loadingCustomers ? (
                    <div className="customerLoading">Loading customers...</div>
                  ) : customerError ? (
                    <div className="customerError">{customerError}</div>
                  ) : (
                    <select
                      value={selectedCustomer}
                      // onChange={(e) => setSelectedCustomer(e.target.value)}
                      onChange={(e) => {
                        const customer = e.target.value;

                        setSelectedCustomer(customer);

                        if (location.pathname === "/employe-sites") {
                          navigate("/employe-sites", {
                            replace: true,
                            state: { requester: customer },
                          });
                        }

                        if (location.pathname.startsWith("/schedule")) {
                          navigate("/schedule", {
                            replace: true,
                            state: { requester: customer },
                          });
                        }
                      }}
                    >
                      {customers.length === 0 ? (
                        <option value="">No Approved Customers</option>
                      ) : (
                        customers.map((customer) => (
                          <option key={customer} value={customer}>
                            {customer}
                          </option>
                        ))
                      )}
                    </select>
                  )}
                </div>

                {/* SCHEDULE BY */}

                <div className="section">
                  <label>SCHEDULE BY:</label>

                  <div className="btnGroup">
                    <button
                      className={
                        location.pathname.startsWith("/schedule")
                          ? "activeBtn"
                          : ""
                      }
                      onClick={openEmployeeSchedule}
                    >
                      Employees
                    </button>

                    <button
                      className={
                        location.pathname.startsWith("/employe-sites")
                          ? "activeBtn"
                          : ""
                      }
                      onClick={openSiteSchedule}
                    >
                      Sites
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TIMESHEETS */}

          <div
            className={`submenuItem ${
              location.pathname === "/timesheets" ? "active" : ""
            }`}
            onClick={() => navigate("/timesheets")}
          >
            <span className="menuIcon">⏱️</span>

            {!sidebarCollapsed && <span className="menuText">Timesheets</span>}
          </div>

          {/* REPORTS */}

          <div
            className={`submenuItem ${
              location.pathname === "/reports" ? "active" : ""
            }`}
            onClick={() => navigate("/reports")}
          >
            <span className="menuIcon">📊</span>

            {!sidebarCollapsed && <span className="menuText">Reports</span>}
          </div>

          {/* INCIDENTS */}

          <div
            className={`submenuItem ${
              location.pathname === "/incidents" ? "active" : ""
            }`}
            onClick={() => navigate("/incidents")}
          >
            <span className="menuIcon">📌</span>

            {!sidebarCollapsed && <span className="menuText">Incidents</span>}
          </div>

          {/* ONBOARDING CLIENT */}

          <div className="menuBlock">
            <div
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
                <span className="menuIcon">👤</span>

                {!sidebarCollapsed && (
                  <span className="menuText">On Boarding Client</span>
                )}
              </div>

              {!sidebarCollapsed && <span>{openOnboarding ? "-" : "+"}</span>}
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
                  📋 All
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "/onboarding-client-open"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("/onboarding-client-open")}
                >
                  🟢 Open
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "/onboarding-client-pending"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("/onboarding-client-pending")}
                >
                  🟡 Pending
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "/onboarding-client-new"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("/onboarding-client-new")}
                >
                  ➕ New Client
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
            <span className="menuIcon">⏱️</span>

            {!sidebarCollapsed && <span className="menuText">Roster</span>}
          </div>
          <div
            className={`submenuItem ${
              location.pathname === "/add-adhoc" ? "active" : ""
            }`}
            onClick={() => navigate("/add-adhoc")}
          >
            <span className="menuIcon">➕</span>

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
          <div className="rightContent">{children ? children : <Outlet />}</div>
        </EmployeeContext.Provider>
      </div>
    </div>
  );
}

export default DashboardLayout;
