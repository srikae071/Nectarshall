import "./index.css";
import PatrollingLeftLayout from "../../PatrollingLeftLayout/index.jsx";

function PatrollingMainDashboard() {
  const rows = new Array(8).fill({
    site: "21-35 Radford Rd (Warehouse 1)",
    name: "Erin Gilmore",
    status: "MISSED CLOCK IN",
    start: "29 Apr - 07:00",
    end: "29 Apr - 10:00",
  });

  //
  return (
    <PatrollingLeftLayout>
      <div className="dashboard">
        {/* TOP TABLE */}
        <div className="Liveoperationscard">
          <div className="cardHeader">
            <h3>Live operations</h3>

            <div className="topActions">
              <span>Clocked In - 23 / 36 / 104</span>
              <span>Clocked Out - 42</span>

              <input placeholder="Search text..." />
              <button>Refresh</button>
              <button>Filters</button>
            </div>
          </div>

          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th className="tableheads">Site</th>
                  <th className="tableheads">Employe Name</th>
                  <th className="tableheads">Status</th>
                  <th className="tableheads">Schedule Start Time</th>
                  <th className="tableheads">Schedule End Time</th>
                  <th className="tableheads">Actual Start Time</th>
                  <th className="tableheads">Actual End Time</th>
                  <th className="tableheads">Coordinater Verification</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.site}</td>
                    <td>{r.name}</td>
                    <td>
                      <span className="statusRed">{r.status}</span>
                    </td>
                    <td>{r.start}</td>
                    <td>{r.end}</td>
                    <td>{r.start}</td>
                    <td>{r.end}</td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bottomGrid">
          {/* LEFT PANEL */}
          {/* <div className="card">
            <div className="cardHeader">
              <h3>Availability / Leave requests</h3>
              <input placeholder="Search..." />
            </div>

            <table>
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.date}</td>
                    <td>
                      <span className="statusBlue">{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}

          {/* RIGHT PANEL */}
          <div className="Stafconfomationcard">
            <div className="StafconfomationcardHeader">
              <h3>Staff Confirmation</h3>
            </div>

            <div className="statsRow">
              <div className="statBox gold">
                <h2>51</h2>
                <p>staff confirmed</p>
              </div>

              <div className="statBox blue">
                <h2>0</h2>
                <p>staff rejected</p>
              </div>

              <div className="statBox gray">
                <h2>17</h2>
                <p>staff unconfirmed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    </PatrollingLeftLayout>
  );
}

export default PatrollingMainDashboard;
