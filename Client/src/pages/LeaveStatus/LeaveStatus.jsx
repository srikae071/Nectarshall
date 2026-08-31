import HrmsLeftLayout from "../Hrms/Hrmsleftlayout";
import { useState, useEffect } from "react";
import { fetchApiData } from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import { FiSearch } from "react-icons/fi";
import "./LeaveStatus.css";

const leaveAllocation = {
  "Casual Leave": 5,
  "Sick Leave": 10,
  "Paid Leave": 15,
  "Maternity Leave": 20,
  "Paternity Leave": 12,
};

function LeaveStatus() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Column visibility settings
  const [columns, setColumns] = useState({
    leaveNumber: true,
    requester: true,
    leaveType: true,
    startDate: true,
    endDate: true,
    totalLeaves: true,
    status: true,
  });

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await fetchApiData("/api/leaves");
      const allLeaves = response.data || [];

      let authUser = user;
      if (!authUser) {
        try {
          const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
          if (saved) authUser = JSON.parse(saved);
        } catch (e) {
          const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
          if (raw && typeof raw === "string") authUser = { username: raw };
        }
      }

      const username = (authUser?.username || authUser?.name || authUser?.displayName || (typeof authUser === "string" ? authUser : "")).trim();

      if (username) {
        const u = username.toLowerCase();
        const userLeaves = allLeaves.filter((item) => {
          const r1 = (item.requester || item.employeeName || "").trim().toLowerCase();
          const r2 = (item.requesterFor || "").trim().toLowerCase();
          return r1 === u || r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2 === u || r2.includes(u);
        });
        setData(userLeaves);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching leave status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPersonalLeaveBalance = (item) => {
    const type = item.leaveType || "Paid Leave";
    const allocated = leaveAllocation[type] || 15;
    const consumed = data
      .filter((l) => l.leaveType === type && l.status === "Approved")
      .reduce((sum, l) => sum + Number(l.totalLeaves || 0), 0);
    return Math.max(0, allocated - consumed);
  };

  const filteredData = data.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.leaveNumber || "").toLowerCase().includes(term) ||
      (item.requester || "").toLowerCase().includes(term) ||
      (item.leaveType || "").toLowerCase().includes(term) ||
      (item.status || "").toLowerCase().includes(term) ||
      (item.startDate || "").toLowerCase().includes(term) ||
      (item.endDate || "").toLowerCase().includes(term)
    );
  });

  const visibleColumnCount = Object.values(columns).filter(Boolean).length || 1;
  const currentUserName = user?.displayName || user?.username || user?.name || "Logged In User";

  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          {/* HEADER ROW WITH SEARCH & SETTINGS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h3 className="openheading" style={{ margin: 0 }}>
              📋 Leave Status - {currentUserName}
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* SEARCH BAR */}
              <div style={{ position: "relative", display: "inline-block" }}>
                <FiSearch
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by requester, type, status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "7px 12px 7px 32px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    width: "240px",
                    outline: "none",
                  }}
                />
              </div>

              {/* SETTINGS BUTTON */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#334155",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  title="Customize Display Columns"
                >
                  ⚙️ Settings
                </button>

                {showSettings && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "40px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      padding: "14px 16px",
                      width: "220px",
                      zIndex: 100,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "13px",
                        color: "#0f172a",
                        marginBottom: "10px",
                        borderBottom: "1px solid #e2e8f0",
                        paddingBottom: "6px",
                      }}
                    >
                      Display Columns:
                    </div>

                    {Object.entries({
                      leaveNumber: "Leave ID",
                      requester: "Requester",
                      leaveType: "Leave Type",
                      startDate: "Start Date",
                      endDate: "End Date",
                      totalLeaves: "Total Leave Balance",
                      status: "Status",
                    }).map(([key, label]) => (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "#334155",
                          marginBottom: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={columns[key]}
                          onChange={() =>
                            setColumns((prev) => ({ ...prev, [key]: !prev[key] }))
                          }
                          style={{ width: "16px", height: "16px", cursor: "pointer" }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
              Loading personal leave status for {currentUserName}...
            </div>
          ) : (
            <table className="opentable">
              <thead>
                <tr>
                  {columns.leaveNumber && <th>Leave ID</th>}
                  {columns.requester && <th>Requester</th>}
                  {columns.leaveType && <th>Leave Type</th>}
                  {columns.startDate && <th>Start Date</th>}
                  {columns.endDate && <th>End Date</th>}
                  {columns.totalLeaves && <th>Total Leave Balance</th>}
                  {columns.status && <th>Status</th>}
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item._id}>
                      {columns.leaveNumber && <td>{item.leaveNumber || "N/A"}</td>}
                      {columns.requester && <td>{item.requester || currentUserName}</td>}
                      {columns.leaveType && <td>{item.leaveType}</td>}
                      {columns.startDate && <td>{item.startDate}</td>}
                      {columns.endDate && <td>{item.endDate}</td>}
                      {columns.totalLeaves && <td>{getPersonalLeaveBalance(item)} day(s)</td>}
                      {columns.status && (
                        <td>
                          <span
                            className={`badge ${(item.status || "Pending").toLowerCase()}`}
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={visibleColumnCount}
                      style={{ padding: "20px", textAlign: "center", color: "#64748b" }}
                    >
                      No leave records found for {currentUserName}.
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
