import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";

import "./index.css";
import DashbordNavbar from "../DashbordNavbar/index.jsx";
import { EmployeeContext } from "../DashboardRightLayout/EmployeeContext.js";
function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [employeeTrigger, setEmployeeTrigger] = useState(0);

  const generateEmployees = () => {
    setEmployeeTrigger((prev) => prev + 1);
  };
  const isScheduleRoute = location.pathname.startsWith("/schedule");
  const [manualToggle, setManualToggle] = useState(true);

  const openSchedule = isScheduleRoute || manualToggle;
  const [selectedCustomer, setSelectedCustomer] = useState("CBRE");
  // useEffect(() => {
  //   if (location.pathname === "/schedule") {
  //     setOpenSchedule(true);
  //   }
  // }, [location.pathname]);
  const customerData = {
    CBRE: { shifts: 27, unfilled: 0, hours: 230, cost: 7643.84 },
    Srikar: { shifts: 18, unfilled: 2, hours: 150, cost: 5200.5 },
    Teja: { shifts: 22, unfilled: 1, hours: 180, cost: 6100.2 },
    Kanth: { shifts: 30, unfilled: 3, hours: 250, cost: 8000.75 },
    Rohith: { shifts: 15, unfilled: 0, hours: 120, cost: 4200.0 },
    Pavan: { shifts: 20, unfilled: 4, hours: 170, cost: 5900.9 },
  };

  return (
    <div className="layoutContainer">
      <DashbordNavbar />

      <div className="mainLayout">
        {/* SIDEBAR */}
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

          {/* SCHEDULE (TOGGLE) */}
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

            {/* DROPDOWN PANEL */}
            {openSchedule && (
              <div className="schedulePanel">
                {/* HEADER */}
                <div className="publishBox">
                  <div>Publish & Notify</div>
                  <small>0 Shifts Unpublished</small>
                </div>

                {/* CUSTOMER */}
                <div className="section">
                  <label>SELECT CUSTOMER:</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    {Object.keys(customerData).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SCHEDULE BY */}
                <div className="section">
                  <label>SCHEDULE BY:</label>
                  <div className="btnGroup">
                    <button
                      className="activeBtn"
                      onClick={() => navigate("/schedule")}
                    >
                      Employees
                    </button>
                    <button onClick={() => navigate("/employe-sites")}>
                      Sites
                    </button>
                  </div>
                </div>

                {/* REPORT */}
                {/* <div className="reportBox">
                  <h4>WEEKLY REPORT</h4>

                  <div className="reportRow">
                    <span>Total Shifts</span>
                    <b>{customerData[selectedCustomer].shifts}</b>
                  </div>

                  <div className="reportRow">
                    <span>Unfilled Shifts</span>
                    <b>{customerData[selectedCustomer].unfilled}</b>
                  </div>

                  <div className="reportRow">
                    <span>Filled Hours</span>
                    <b>{customerData[selectedCustomer].hours}</b>
                  </div>

                  <div className="reportRow">
                    <span>Filled Cost</span>
                    <b>$ {customerData[selectedCustomer].cost}</b>
                  </div>
                </div> */}
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
          <div
            className={`submenuItem ${
              location.pathname === "/reports" ? "active" : ""
            }`}
            onClick={() => navigate("/reports")}
          >
            📊 Reports
          </div>
          <div
            className={`submenuItem ${
              location.pathname === "/incidents" ? "active" : ""
            }`}
            onClick={() => navigate("/incidents")}
          >
            📌 Incidents
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <EmployeeContext.Provider
          value={{ trigger: employeeTrigger, generateEmployees }}
        >
          <div className="rightContent">{children}</div>
        </EmployeeContext.Provider>
      </div>
    </div>
  );
}

export default DashboardLayout;
