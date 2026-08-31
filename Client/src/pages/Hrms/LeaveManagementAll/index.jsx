import HrmsLeftLayout from "../Hrmsleftlayout";
import TableLayout1 from "../../../components/Layouts/TableLayouts/TableLayout1";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchApiData } from "../../../utils/apiClient";
import { FiSettings, FiSearch } from "react-icons/fi";
import "./index.css";

const defaultColumns = [
  "leaveNumber",
  "requester",
  "leaveType",
  "startDate",
  "endDate",
];

const allColumns = [
  { key: "leaveNumber", label: "Leave Number" },
  { key: "requester", label: "Employee Name" },
  { key: "leaveType", label: "Leave Type" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "totalLeaves", label: "Total Leave Balance" },
  { key: "halfDay", label: "Half Day" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "comment", label: "Comment" },
  { key: "leaveBalance", label: "Leave Balance" },
];

const leaveAllocation = {
  "Casual Leave": 5,
  "Sick Leave": 10,
  "Paid Leave": 15,
  "Maternity Leave": 20,
  "Paternity Leave": 12,
};

const getLeaveBalance = (item) => {
  const allocated = leaveAllocation[item.leaveType] || 0;

  return allocated - Number(item.totalLeaves || 0);
};
function LeaveManagementAll() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("leaveColumns");
    return saved ? JSON.parse(saved) : defaultColumns;
  });

  const settingsRef = useRef(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    localStorage.setItem("leaveColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await fetchApiData("/api/leaves");
      const allLeaves = response.data || [];

      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }

      const username = (authUser?.username || authUser?.name || authUser?.displayName || (typeof authUser === "string" ? authUser : "")).trim();
      const role = (authUser?.role || "").toUpperCase();
      const dept = (authUser?.department || "").toUpperCase();
      const isHrOrAdmin = role === "ADMIN" || role.includes("HR") || dept.includes("HR") || username.toLowerCase().includes("sumit");

      if (isHrOrAdmin) {
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
      console.log(error);
    }
  };

  const filteredData = data.filter((item) =>
    item.requester?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleColumn = (key) => {
    // Don't allow default columns to be removed
    if (defaultColumns.includes(key)) {
      return;
    }

    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };
  const navigate = useNavigate();
  const [selectedLeaveModal, setSelectedLeaveModal] = useState(null);

  const handleItemClick = (item) => {
    if ((item.status || "").toLowerCase() === "draft") {
      navigate("/leave-request", { state: { draftLeave: item } });
    } else {
      setSelectedLeaveModal(item);
    }
  };

  return (
    <HrmsLeftLayout>
      <TableLayout1
        title="Employee Leaves"
        search={search}
        setSearch={setSearch}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        settingsRef={settingsRef}
        settingsContent={allColumns
          .filter((col) => !defaultColumns.includes(col.key))
          .map((col) => (
            <label key={col.key} className="LMACheckbox">
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.key)}
                onChange={() => toggleColumn(col.key)}
              />
              {col.label}
            </label>
          ))}
        headers={allColumns.filter((col) => visibleColumns.includes(col.key))}
      >
        {filteredData.map((item) => {
          const currentHeaders = allColumns.filter((col) => visibleColumns.includes(col.key));
          return (
            <tr key={item._id}>
              {currentHeaders.map((col) => {
                let cellVal = item[col.key];
                if (col.key === "halfDay") {
                  cellVal = item.halfDay ? "Yes" : "No";
                } else if (col.key === "leaveBalance") {
                  cellVal = getLeaveBalance(item);
                } else if (!cellVal) {
                  cellVal = "-";
                }

                if (col.key === "leaveNumber") {
                  return (
                    <td
                      key={col.key}
                      style={{ fontWeight: "700", color: "#0284c7", cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => handleItemClick(item)}
                      title={(item.status || "").toLowerCase() === "draft" ? "Click to edit draft leave request" : "Click to view full leave details"}
                    >
                      {String(cellVal)}
                    </td>
                  );
                }

                if (col.key === "status") {
                  return (
                    <td key={col.key}>
                      <span
                        className={`badge ${(item.status || "Pending").toLowerCase()}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleItemClick(item)}
                      >
                        {item.status || "Pending"}
                      </span>
                    </td>
                  );
                }

                return (
                  <td key={col.key} style={{ cursor: "pointer" }} onClick={() => handleItemClick(item)}>
                    {String(cellVal)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </TableLayout1>

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
                    {selectedLeaveModal.requester || selectedLeaveModal.employeeName || "Employee"}
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
    </HrmsLeftLayout>
  );
}

export default LeaveManagementAll;
