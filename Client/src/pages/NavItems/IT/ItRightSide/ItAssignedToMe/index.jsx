import ItLeftSide from "../../ItLeftSide";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApiData } from "../../../../../utils/apiClient";
import "./index.css";

function ItAssignedToMe() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetchApiData("/api/itrequests");
      setData(response?.data || []);
    } catch (error) {
      console.error("Error fetching assigned IT requests:", error);
    }
  };

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
                    <td>{item.incidentNumber || item._id}</td>
                    <td>{item.requester || "Employee"}</td>
                    <td>{item.department || "IT"}</td>
                    <td>{item.category || "General"}</td>
                    <td>{item.status || "Open"}</td>
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
