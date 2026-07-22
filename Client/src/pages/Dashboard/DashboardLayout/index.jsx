import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import "./index.css";
import DashbordNavbar from "../DashbordNavbar/index.jsx";
import { EmployeeContext } from "../DashboardRightLayout/EmployeeContext.js";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openOnboarding, setOpenOnboarding] = useState(false);
  const [openAdhoc, setOpenAdhoc] = useState(false);

  const [employeeTrigger, setEmployeeTrigger] = useState(0);

  const [manualToggle, setManualToggle] = useState(true);

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

        <div className="operationssidebar">
          {/* DASHBOARD */}

          <div
            className={`submenuItem ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("/main-dashboard")}
          >
            📊 Dashboard
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
              <span>📅 Schedule</span>

              <span>{openSchedule ? "-" : "+"}</span>
            </div>

            {openSchedule && (
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

                {/* REPORT SECTION
                        (Keeping commented exactly like existing code)
                    */}

                {/*
                    <div className="reportBox">

                      <h4>WEEKLY REPORT</h4>

                      <div className="reportRow">
                        <span>Total Shifts</span>
                        <b>0</b>
                      </div>

                      <div className="reportRow">
                        <span>Unfilled Shifts</span>
                        <b>0</b>
                      </div>

                      <div className="reportRow">
                        <span>Filled Hours</span>
                        <b>0</b>
                      </div>

                      <div className="reportRow">
                        <span>Filled Cost</span>
                        <b>$0</b>
                      </div>

                    </div>
                    */}
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
            ⏱️ Timesheets
          </div>

          {/* REPORTS */}

          <div
            className={`submenuItem ${
              location.pathname === "/reports" ? "active" : ""
            }`}
            onClick={() => navigate("/reports")}
          >
            📊 Reports
          </div>

          {/* INCIDENTS */}

          <div
            className={`submenuItem ${
              location.pathname === "/incidents" ? "active" : ""
            }`}
            onClick={() => navigate("/incidents")}
          >
            📌 Incidents
          </div>

          {/* ONBOARDING CLIENT */}

          <div className="menuBlock">
            <div
              className="submenuItem toggleHeader"
              onClick={() => setOpenOnboarding(!openOnboarding)}
            >
              <span>👤 On Boarding Client</span>

              <span>{openOnboarding ? "-" : "+"}</span>
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

          {/* AD HOC SERVICES */}

          {/* <div className="menuBlock">
            <div
              className="submenuItem toggleHeader"
              onClick={() => setOpenAdhoc(!openAdhoc)}
            >
              <span>🛠️ Ad Hoc Services</span>

              <span>{openAdhoc ? "-" : "+"}</span>
            </div>

            {openAdhoc && (
              <div className="submenuDropdown">
                <div
                  className={`submenuItem ${
                    location.pathname === "/adhoc/all" ? "active" : ""
                  }`}
                  onClick={() => navigate("/adhoc/all")}
                >
                  📋 All
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "" ? "active" : ""
                  }`}
                  onClick={() => navigate("")}
                >
                  🟢 Open
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "/adhoc-services/pending"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("/adhoc-services/pending")}
                >
                  🟡 Pending
                </div>

                <div
                  className={`submenuItem ${
                    location.pathname === "/adhoc-services/new" ? "active" : ""
                  }`}
                  onClick={() => navigate("/adhoc-services/new")}
                >
                  ➕ New Service
                </div>
              </div>
            )}
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
          <div className="rightContent">{children}</div>
        </EmployeeContext.Provider>
      </div>
    </div>
  );
}

export default DashboardLayout;
