import DashboardLayout from "../../DashboardLayout";

import "./index.css";

function Reportss() {
  return (
    <DashboardLayout>
      <div className="reportsPageLayout">
        <div className="reportsMain">
          <div className="reportsContainer">
            {/* TOP TABS */}
            <div className="tabs">
              <button className="activeTab">Site Reports</button>
              <button>Patrol Reports</button>
            </div>

            {/* FILTER BAR */}
            <div className="filters">
              <div className="filterItem">
                <label>SELECT CUSTOMER:</label>
                <select>
                  <option>All Customers</option>
                </select>
              </div>

              <div className="filterItem">
                <label>SELECT SITE:</label>
                <select>
                  <option>All Sites</option>
                </select>
              </div>

              <div className="filterItem">
                <label>SELECT FORM NAME:</label>
                <select>
                  <option>All Forms</option>
                </select>
              </div>

              <div className="filterItem">
                <label>DATE RANGE:</label>
                <input />
              </div>

              <div className="filterItem">
                <label>SELECT STAFF:</label>
                <select>
                  <option>All Staff</option>
                </select>
              </div>
            </div>

            {/* SEARCH + BUTTONS */}
            <div className="actionsRow">
              <input className="searchInput" placeholder="Search ..." />
              <button className="addBtn">Add new report</button>
              <button className="actionBtn">Actions ▾</button>
            </div>

            {/* TABLE */}
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th className="reportsheading">Date / Time</th>
                    <th className="reportsheading">Report ID</th>
                    <th className="reportsheading">Customer</th>
                    <th className="reportsheading">Site</th>
                    <th className="reportsheading">Submitted By</th>
                    <th className="reportsheading">Form Name</th>
                    <th className="reportsheading">Last Modified By</th>
                    <th className="reportsheading">Requires action?</th>
                    <th className="reportsheading">Approved</th>
                    <th className="reportsheading">Show to Customer</th>
                  </tr>
                </thead>

                <tbody>
                  {Array(12)
                    .fill()
                    .map((_, i) => (
                      <tr key={i} className="reportsreportshead">
                        <td>
                          26-03-2026
                          <br />
                          18:36 +0530
                        </td>
                        <td>198116407848</td>
                        <td>Vantage Property Group</td>
                        <td>11 Queens Rd</td>
                        <td>Angie Ardila</td>
                        <td>(C) Tenancy Cleaning</td>
                        <td>-</td>
                        <td className="warning">⚠</td>
                        <td>
                          <div className="toggle"></div>
                        </td>
                        <td>
                          <div className="toggle"></div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="reportsSidebar">
          <div className="optionsPanel">
            <h4>REPORT OPTIONS</h4>

            <div className="optionSection">
              <label>Customer</label>
              <div className="tagBox">All Customer ✕</div>
              <div className="btnRow">
                <button>Select All</button>
                <button>Clear All</button>
              </div>
            </div>

            <div className="optionSection">
              <label>Site</label>
              <div className="tagBox">All Site ✕</div>
              <div className="btnRow">
                <button>Select All</button>
                <button>Clear All</button>
              </div>
            </div>

            <div className="optionSection">
              <label>Date range</label>
              <div className="dateBox">23/03/2026 - 29/03/2026</div>
            </div>

            <div className="checkboxList">
              <label>
                <input type="checkbox" /> Approved timesheet
              </label>
              <label>
                <input type="checkbox" /> Display mobile number
              </label>
              <label>
                <input type="checkbox" /> Display email address
              </label>
              <label>
                <input type="checkbox" /> Display security licence number
              </label>
              <label>
                <input type="checkbox" /> Display bank details
              </label>
              <label>
                <input type="checkbox" /> Display full name
              </label>
              <label>
                <input type="checkbox" /> Show site position
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reportss;
