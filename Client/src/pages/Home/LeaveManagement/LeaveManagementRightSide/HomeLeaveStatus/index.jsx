import { useEffect, useState } from "react";
import axios from "axios";
import LeaveManagementLeftSide from "./../../LeaveManagementLeftSide";
import "./index.css";

function HomeLeaveStatus() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves",
      );

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LeaveManagementLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Leave Status</h3>

          <table className="opentable">
            <thead>
              <tr>
                <th>Leave ID</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Leave Count</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.leaveNumber}</td>
                    <td>{item.leaveType}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>{item.totalLeaves}</td>

                    <td>
                      <span className={`badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Leave Requests Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveStatus;
