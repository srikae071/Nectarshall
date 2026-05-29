import PatrollingLeftLayout from "../../PatrollingLeftLayout/index.jsx";
import "./index.css";

function PatrollingIncidents() {
  return (
    <PatrollingLeftLayout>
      <>
        <div className="insightsmain">
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th className="incidentstablnames">Date / Time</th>
                  <th className="incidentstablnames">Report ID</th>
                  <th className="incidentstablnames">Customer</th>
                  <th className="incidentstablnames">Site</th>
                  <th className="incidentstablnames">Submitted By</th>
                  <th className="incidentstablnames">Form Name</th>
                  <th className="incidentstablnames">Last Modified By</th>
                  <th className="incidentstablnames">Requires action?</th>
                  <th className="incidentstablnames">Approved</th>
                  <th className="incidentstablnames">Show to Customer</th>
                </tr>
              </thead>

              <tbody>
                {Array(12)
                  .fill()
                  .map((_, i) => (
                    <tr key={i} className="reportshead">
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
      </>
    </PatrollingLeftLayout>
  );
}
export default PatrollingIncidents;
