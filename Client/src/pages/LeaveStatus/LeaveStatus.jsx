import HrmsLeftLayout from "../Hrms/Hrmsleftlayout";
import { useState, useEffect } from "react";
import { fetchApiData } from "../../utils/apiClient";
import "./LeaveStatus.css";

function LeaveStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await fetchApiData("/api/leaves");
      setData(response.data || []);
    } catch (error) {
      console.log("Error fetching leave status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Leave Status</h3>

          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>Loading Leave Status...</div>
          ) : (
            <table className="opentable">
              <thead className="opentablerow">
                <tr className="opentablerow">
                  <th className="opentablerow">Leave ID</th>
                  <th className="opentablerow">Leave type</th>
                  <th className="opentablerow">Start date</th>
                  <th className="opentablerow">End date</th>
                  <th className="opentablerow">Total leave count</th>
                  <th className="opentablerow">Status</th>
                </tr>
              </thead>

              <tbody className="opentablerow">
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr className="opentablerow" key={item._id || item.id}>
                      <td>{item.leaveNumber || item.id}</td>
                      <td>{item.leaveType || item.type}</td>
                      <td>{item.startDate || item.start}</td>
                      <td>{item.endDate || item.end}</td>
                      <td>{item.totalLeaves || item.total}</td>
                      <td>
                        <span
                          className={`badge ${(item.status || "Pending").replace(" ", "-").toLowerCase()}`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                      No leave records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default LeaveStatus;
