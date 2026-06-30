import ItLeftSide from "../../ItLeftSide";
import { useNavigate } from "react-router-dom";
import "./index.css";

const data = [
  { id: 102, name: "Sumit Jain", dept: "IT", category: "Tax", status: "Open" },
  {
    id: 103,
    name: "Saumya Singh",
    dept: "Operations",
    category: "Compensation",
    status: "Resolved",
  },
];
const navigate = useNavigate();
function ItAssignedToMe() {
  return (
    <ItLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Assigned Cases</h3>

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
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/hrms/itsaves/${item._id}`)}
                  >
                    <td>{item.incidentNumber}</td>
                    <td>{item.requester}</td>
                    <td>{item.department}</td>
                    <td>{item.category}</td>
                    <td>{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* <div className="footer">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div> */}
      </div>
    </ItLeftSide>
  );
}

export default ItAssignedToMe;
