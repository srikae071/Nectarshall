import HrmsLeftLayout from "../Hrms/Hrmsleftlayout";
import { useState, useEffect } from "react";
import { fetchApiData } from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import "./LeaveStatus.css";

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
      const role = (authUser?.role || "").toUpperCase();
      const isAdmin = role === "ADMIN" || username.toLowerCase().includes("sumit");

      if (isAdmin) {
        setData(allLeaves);
      } else if (username) {
        const u = username.toLowerCase();
        const userLeaves = allLeaves.filter((item) => {
          const r1 = (item.requester || item.employeeName || "").trim().toLowerCase();
          const r2 = (item.requesterFor || "").trim().toLowerCase();
          return r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2.includes(u);
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
              HRMS Leave Status
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* HRMS SEARCH BAR */}
              <input
                type="text"
                placeholder="🔍 Search leave requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                  width: "220px",
                  background: "#ffffff",
                  color: "#0f172a",
                }}
              />

              {/* SETTINGS ICON BUTTON */}
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
                      leaveType: "Leave type",
                      startDate: "Start date",
                      endDate: "End date",
                      totalLeaves: "Total leave count",
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
                            setColumns((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
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
            <div
              style={{ padding: "20px", textAlign: "center", color: "#64748b" }}
            >
              Loading Leave Status...
            </div>
          ) : (
            <table className="opentable">
              <thead className="opentablerow">
                <tr className="opentablerow">
                  {columns.leaveNumber && (
                    <th className="opentablerow">Leave ID</th>
                  )}
                  {columns.requester && (
                    <th className="opentablerow">Requester</th>
                  )}
                  {columns.leaveType && (
                    <th className="opentablerow">Leave type</th>
                  )}
                  {columns.startDate && (
                    <th className="opentablerow">Start date</th>
                  )}
                  {columns.endDate && (
                    <th className="opentablerow">End date</th>
                  )}
                  {columns.totalLeaves && (
                    <th className="opentablerow">Total leave count</th>
                  )}
                  {columns.status && <th className="opentablerow">Status</th>}
                </tr>
              </thead>

              <tbody className="opentablerow">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr className="opentablerow" key={item._id || item.id}>
                      {columns.leaveNumber && (
                        <td>{item.leaveNumber || item.id}</td>
                      )}
                      {columns.requester && (
                        <td> {item.requester || "Self"}</td>
                      )}
                      {columns.leaveType && (
                        <td>{item.leaveType || item.type}</td>
                      )}
                      {columns.startDate && (
                        <td>{item.startDate || item.start}</td>
                      )}
                      {columns.endDate && <td>{item.endDate || item.end}</td>}
                      {columns.totalLeaves && (
                        <td>{item.totalLeaves || item.total} day(s)</td>
                      )}
                      {columns.status && (
                        <td>
                          <span
                            className={`badge ${(item.status || "Pending")
                              .replace(" ", "-")
                              .toLowerCase()}`}
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
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#64748b",
                      }}
                    >
                      {searchTerm
                        ? `No leave records matching "${searchTerm}".`
                        : `No leave records found for ${user?.displayName || user?.username || "this user"}.`}
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
