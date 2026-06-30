import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ItLeftSide from "../../../ItLeftSide";
import "./index.css";
// const data = [...];

function HrReqAll() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests",
      );

      const filtered = response.data.filter(
        (item) => item.taskType === "IT Clearance",
      );

      setData(filtered);

      console.log(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ItLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Requests</h3>

          <table className="opentable">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Requester</th>
                <th>Resignation Date</th>
                <th>Last Working Day</th>
                <th>Resignation Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/tasksaves/${item._id}`)}
                  >
                    <td>{item.taskId}</td>
                    <td>{item.requesterName}</td>
                    <td>{item.resignationDate}</td>
                    <td>{item.lastWorkingDay}</td>
                    <td>{item.resignationReason}</td>
                    <td>{item.ItTAskStatus || "Open"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Records Found
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

export default HrReqAll;
