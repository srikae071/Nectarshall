import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItLeftSide from "../../../ItLeftSide";
import { fetchApiData } from "../../../../../../utils/apiClient";
import "./index.css";

function RequestsOffboardingAll() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");
      const filtered = (response.data || []).filter(
        (item) =>
          item.category === "Offboarding" ||
          item.category === "offboarding" ||
          item.category === "Exit" ||
          item.taskType === "IT Clearance"
      );
      setData(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ItLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">IT Offboarding Requests (All)</h3>

          <table className="opentable">
            <thead>
              <tr className="opentablerow">
                <th>Task / Case ID</th>
                <th>Requester</th>
                <th>Resignation Date</th>
                <th>Last Working Day</th>
                <th>Resignation Reason</th>
                <th>Task Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/tasksaves/${item._id}`)}
                  >
                    <td>{item.taskId || item.caseId || `TSK-${String(idx + 1).padStart(3, "0")}`}</td>
                    <td>{item.requesterName || item.requester || "N/A"}</td>
                    <td>{item.resignationDate ? new Date(item.resignationDate).toLocaleDateString() : "N/A"}</td>
                    <td>{item.lastWorkingDay ? new Date(item.lastWorkingDay).toLocaleDateString() : "N/A"}</td>
                    <td>{item.resignationReason || item.description || "N/A"}</td>
                    <td>{item.taskStatus || item.status || "Open"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Offboarding Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ItLeftSide>
  );
}

export default RequestsOffboardingAll;
