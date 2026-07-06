import CncLeftLayout from "../../../../../Cnc/CncLeftLayout";
import "./index.css";

const data = [
  {
    id: 101,
    name: "Amit Jain",
    dept: "IT",
    category: "Payroll",
    status: "Open",
  },
  { id: 102, name: "Sumit Jain", dept: "IT", category: "Tax", status: "Open" },
  {
    id: 103,
    name: "Saumya Singh",
    dept: "Operations",
    category: "Compensation",
    status: "Resolved",
  },
  {
    id: 104,
    name: "Kanak Singh",
    dept: "HR",
    category: "Compensation",
    status: "Resolved",
  },
];

function OnBoardingResonanceRequirementsResolve() {
  return (
    <CncLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Resolved Resonance Requirements cases</h3>

          <table className="opentable">
            <thead className="opentablerow">
              <tr className="opentablerow">
                <th className="opentablerow">Case ID</th>
                <th className="opentablerow">Requester Name</th>
                <th className="opentablerow">Department</th>
                <th className="opentablerow">Category</th>
                <th className="opentablerow">Status</th>
              </tr>
            </thead>

            <tbody className="opentablerow">
              {data.map((item) => (
                <tr className="opentablerow" key={item.id}>
                  <td className="opentablerow">{item.id}</td>
                  <td className="opentablerow">{item.name}</td>
                  <td className="opentablerow">{item.dept}</td>
                  <td className="opentablerow">{item.category}</td>
                  <td className="opentablerow">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="footer">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div> */}
      </div>
    </CncLeftLayout>
  );
}

export default OnBoardingResonanceRequirementsResolve;
