import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaveManagementLeftSide from "./../../LeaveManagementLeftSide";
import { fetchApiData } from "../../../../../utils/apiClient";
import { useAuth } from "../../../../../context/AuthContext";
import { FiSearch } from "react-icons/fi";
import "./index.css";

const leaveAllocation = {
  "Casual Leave": 5,
  "Sick Leave": 10,
  "Paid Leave": 15,
  "Maternity Leave": 20,
  "Paternity Leave": 12,
};

function HomeLeaveStatus() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeaveModal, setSelectedLeaveModal] = useState(null);

  const handleItemClick = (item) => {
    if ((item.status || "").toLowerCase() === "draft") {
      navigate("/home-leave-request", { state: { draftLeave: item } });
    } else {
      setSelectedLeaveModal(item);
    }
  };

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
      console.error("Error fetching personalized leave status:", error);
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
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.requester || "").toLowerCase().includes(query) ||
      (item.leaveNumber || "").toLowerCase().includes(query) ||
      (item.leaveType || "").toLowerCase().includes(query) ||
      (item.status || "").toLowerCase().includes(query)
    );
  });

  const visibleColumnCount = Object.values(columns).filter(Boolean).length || 1;

  const currentUserName = user?.displayName || user?.username || user?.name || "Logged In User";

  return (
    <LeaveManagementLeftSide>
      <div className="Openhome">
        <div>
          {/* HEADER ROW WITH TITLE, SEARCH BAR & SETTINGS */}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                      {columns.leaveNumber && (
                        <td
                          style={{ fontWeight: "700", color: "#0284c7", cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => handleItemClick(item)}
                          title={(item.status || "").toLowerCase() === "draft" ? "Click to edit draft leave request" : "Click to view full leave details"}
                        >
                          {item.leaveNumber || "View Details"}
                        </td>
                      )}
                      {columns.requester && (
                        <td
                          style={{ cursor: "pointer" }}
                          onClick={() => handleItemClick(item)}
                        >
                          {item.requester || currentUserName}
                        </td>
                      )}
                      {columns.leaveType && <td>{item.leaveType}</td>}
                      {columns.startDate && <td>{item.startDate}</td>}
                      {columns.endDate && <td>{item.endDate}</td>}
                      {columns.totalLeaves && <td>{getPersonalLeaveBalance(item)} day(s)</td>}
                      {columns.status && (
                        <td>
                          <span
                            className={`badge ${(item.status || "Pending").toLowerCase()}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleItemClick(item)}
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

        {/* LEAVE DETAILS MODAL POPUP */}
        {selectedLeaveModal && (
          <div
            className="pdfModalBackdrop"
            onClick={() => setSelectedLeaveModal(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(15, 23, 42, 0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1100,
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff",
                width: "90%",
                maxWidth: "540px",
                maxHeight: "90vh",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "12px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#0284c7", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    Leave Application Details
                  </span>
                  <h3 style={{ margin: "4px 0 0 0", fontSize: "18px", color: "#0f172a" }}>
                    {selectedLeaveModal.leaveNumber || selectedLeaveModal._id || "Leave Detail"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLeaveModal(null)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#64748b",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Requester Name</label>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginTop: "2px" }}>
                      {selectedLeaveModal.requester || selectedLeaveModal.employeeName || currentUserName}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Requested For (Admin)</label>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginTop: "2px" }}>
                      {selectedLeaveModal.requesterFor || "Sumit"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Leave Category</label>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#0284c7", marginTop: "2px" }}>
                      {selectedLeaveModal.leaveType || "Casual Leave"}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Approval Status</label>
                    <div style={{ marginTop: "2px" }}>
                      <span className={`badge ${(selectedLeaveModal.status || "Pending").toLowerCase()}`}>
                        {selectedLeaveModal.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Start Date</label>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155", marginTop: "2px" }}>
                      {selectedLeaveModal.startDate || "-"}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>End Date</label>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155", marginTop: "2px" }}>
                      {selectedLeaveModal.endDate || "-"}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Total Days</label>
                    <div style={{ fontSize: "13px", fontWeight: "400", color: "#047857", marginTop: "2px" }}>
                      {selectedLeaveModal.totalLeaves || 1} day(s)
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Half Day</label>
                  <div style={{ fontSize: "13px", fontWeight: "400", color: "#334155", marginTop: "2px" }}>
                    {selectedLeaveModal.halfDay ? "Yes (Half Day Leave)" : "No (Full Day Leave)"}
                  </div>
                </div>

                {selectedLeaveModal.shortDescription && (
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Short Description</label>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#334155",
                        marginTop: "4px",
                        background: "#f8fafc",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {selectedLeaveModal.shortDescription}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Reason / Description</label>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#334155",
                      marginTop: "4px",
                      background: "#f8fafc",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      minHeight: "50px",
                      lineHeight: "1.5",
                    }}
                  >
                    {selectedLeaveModal.description || "No description provided."}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setSelectedLeaveModal(null)}
                  style={{
                    padding: "8px 18px",
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveStatus;
