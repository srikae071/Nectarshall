import HrmsLeftLayout from "../Hrms/Hrmsleftlayout";
import { useState, useEffect } from "react";
import { fetchApiData } from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import "./LeaveStatus.css";

function LeaveStatus() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await fetchApiData("/api/leaves");
      const allLeaves = response.data || [];

      // Admin (Sumit) sees all leaves. Employee accounts see their own leaves.
      const isAdmin =
        user?.role === "ADMIN" || (user?.username || "").toLowerCase().includes("sumit");

      if (isAdmin) {
        setData(allLeaves);
      } else {
        const currentName = (user?.username || "").trim().toLowerCase();
        const currentDisplay = (user?.displayName || "").trim().toLowerCase();

        const userLeaves = allLeaves.filter((item) => {
          const rName = (item.requester || item.employeeName || "").trim().toLowerCase();
          return (
            !rName ||
            rName === currentName ||
            rName === currentDisplay ||
            currentDisplay.includes(rName)
          );
        });

        setData(userLeaves);
      }
    } catch (error) {
      console.error("Error fetching leave status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 className="openheading" style={{ margin: 0 }}>
              📋 HRMS Leave Status {user ? `(${user.displayName || user.username})` : ""}
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
              User: <strong>{user?.displayName || user?.username || "Guest"}</strong>
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>Loading Leave Status...</div>
          ) : (
            <table className="opentable">
              <thead className="opentablerow">
                <tr className="opentablerow">
                  <th className="opentablerow">Leave ID</th>
                  <th className="opentablerow">Requester</th>
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
                      <td>👤 {item.requester || "Self"}</td>
                      <td>{item.leaveType || item.type}</td>
                      <td>{item.startDate || item.start}</td>
                      <td>{item.endDate || item.end}</td>
                      <td>{item.totalLeaves || item.total} day(s)</td>
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
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                      No leave records found for {user?.displayName || user?.username || "this user"}.
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
