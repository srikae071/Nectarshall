import "./index.css";

function Reportss() {
  return (
    <div className="reportsPageLayout">
      <div className="reportsMain">
        <div className="reportsContainer">
          
          {/* ANALYTICS OVERVIEW SECTION */}
          <div className="reports-analytics-section">
            <h2 className="analytics-title">Reports Analytics Overview (All Customers)</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="card-icon blue"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <div className="card-content">
                  <span className="card-label">Compliance Score</span>
                  <span className="card-value">96.4%</span>
                </div>
              </div>
              <div className="analytics-card">
                <div className="card-icon green"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <div className="card-content">
                  <span className="card-label">Average Attendance</span>
                  <span className="card-value">98.2%</span>
                </div>
              </div>
              <div className="analytics-card">
                <div className="card-icon purple"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
                <div className="card-content">
                  <span className="card-label">Roster SLA Breach</span>
                  <span className="card-value">0.5%</span>
                </div>
              </div>
              <div className="analytics-card">
                <div className="card-icon orange"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div className="card-content">
                  <span className="card-label">Guard Audit Score</span>
                  <span className="card-value">95%</span>
                </div>
              </div>
            </div>
          </div>

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
  );
}

export default Reportss;
