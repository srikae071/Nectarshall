import { useEffect, useState } from "react";
import LeaveManagementLeftSide from "./../../LeaveManagementLeftSide";
import { fetchApiData } from "../../../../../utils/apiClient";
import { useAuth } from "../../../../../context/AuthContext";
import "./index.css";

function HomeLeaveStatus() {
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

      // If user is ADMIN (Sumit), show all leaves. Otherwise, filter by logged-in employee name
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
      console.error("Error fetching personalized leave status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeaveManagementLeftSide>
      <div className="Openhome">
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 className="openheading" style={{ margin: 0 }}>
              📋 Leave Status {user ? `(${user.displayName || user.username})` : ""}
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
              Logged in as: <strong>{user?.displayName || user?.username || "Guest"}</strong>
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Loading personalized leave status...</div>
          ) : (
            <table className="opentable">
              <thead>
                <tr>
                  <th>Leave ID</th>
                  <th>Requester</th>
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
                      <td>{item.leaveNumber || "N/A"}</td>
                      <td>👤 {item.requester || "Self"}</td>
                      <td>{item.leaveType}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>{item.totalLeaves} day(s)</td>

                      <td>
                        <span className={`badge ${(item.status || "Pending").toLowerCase()}`}>
                          {item.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
                      No leave requests found for {user?.displayName || user?.username || "this account"}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveStatus;
