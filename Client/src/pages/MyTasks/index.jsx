import MyTasksNavBar from "./MyTaskNavvar";
import React, { useState, useEffect } from "react";
import { fetchApiData, sendApiData } from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import "./index.css";

function ApprovalTable() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [offboardingData, setOffboardingData] = useState([]);

  useEffect(() => {
    fetchLeaves();
    fetchOffboarding();
  }, [user]);

  const getAuthDetails = () => {
    const username = (user?.displayName || user?.username || "").trim();
    const role = (user?.role || "").toUpperCase();
    const dept = (user?.department || "").toUpperCase();
    const isAdmin = role === "ADMIN" || username.toLowerCase().includes("sumit") || dept === "ADMIN";
    return { username, isAdmin };
  };

  const fetchOffboarding = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");
      const list = (response.data || []).filter(
        (item) => item.category === "Offboarding" || item.category === "offboarding" || item.category === "Exit"
      );
      const { username, isAdmin } = getAuthDetails();
      if (isAdmin) {
        setOffboardingData(list);
      } else if (username) {
        const u = username.toLowerCase();
        setOffboardingData(
          list.filter((item) => {
            const r1 = (item.requester || item.requesterName || item.employeeName || "").toLowerCase();
            const r2 = (item.requesterFor || "").toLowerCase();
            return (
              r1.includes(u) ||
              u.includes(r1 && r1.length > 2 ? r1 : "___never___") ||
              r2.includes(u)
            );
          })
        );
      } else {
        setOffboardingData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await fetchApiData("/api/leaves");
      const list = response.data || [];
      const { username, isAdmin } = getAuthDetails();
      if (isAdmin) {
        setData(list.filter((item) => item.status === "Pending"));
      } else if (username) {
        const u = username.toLowerCase();
        setData(
          list.filter((item) => {
            const r1 = (item.requester || item.employeeName || "").toLowerCase();
            const r2 = (item.requesterFor || "").toLowerCase();
            return (
              r1.includes(u) ||
              u.includes(r1 && r1.length > 2 ? r1 : "___never___") ||
              r2.includes(u)
            );
          })
        );
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approveLeave = async (id) => {
    try {
      await sendApiData(`/api/leaves/approve/${id}`, {}, "put");
      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectLeave = async (id) => {
    try {
      await sendApiData(`/api/leaves/reject/${id}`, {}, "put");
      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };

  const approveOffboarding = async (id) => {
    try {
      await sendApiData(`/api/jobrequests/${id}`, { approvalStatus: "Approved", status: "Approved" }, "put");
      alert("Offboarding request approved successfully");
      fetchOffboarding();
    } catch (error) {
      console.log(error);
      alert("Error approving request");
    }
  };

  const deleteOffboarding = async (id) => {
    try {
      await sendApiData(`/api/jobrequests/${id}`, { approvalStatus: "Rejected", status: "Rejected" }, "put");
      alert("Offboarding request rejected/deleted");
      fetchOffboarding();
    } catch (error) {
      console.log(error);
      alert("Error rejecting request");
    }
  };

  const handleClearanceStatusUpdate = async (id, fieldName, newStatus) => {
    try {
      const payload = {
        [fieldName]: newStatus,
      };

      if (fieldName === "itClearanceStatus") {
        payload.ItTAskStatus = newStatus;
        payload.itStatus = newStatus;
        payload.taskStatus = newStatus;
      } else if (fieldName === "financeClearanceStatus") {
        payload.financeStatus = newStatus;
      } else if (fieldName === "adminClearanceStatus") {
        payload.adminStatus = newStatus;
      }

      await sendApiData(`/api/jobrequests/${id}`, payload, "put");
      fetchOffboarding();
    } catch (error) {
      console.log(error);
      alert("Error updating clearance status");
    }
  };

  const handleLastWorkingDayUpdate = async (id, newDate) => {
    try {
      await sendApiData(`/api/jobrequests/${id}`, { lastWorkingDay: newDate }, "put");
      fetchOffboarding();
    } catch (error) {
      console.log(error);
      alert("Error updating last working day");
    }
  };

  const handleResetLeaves = async () => {
    try {
      await sendApiData(`/api/leaves/reset-all`, {}, "put");
      alert("All leave requests and consumed balances have been reset successfully!");
      fetchLeaves();
    } catch (error) {
      console.log(error);
      alert("Error resetting leave balances");
    }
  };

  const getStatusBadgeStyle = (statusVal) => {
    const s = (statusVal || "Open").toLowerCase();
    if (s.includes("approved") || s.includes("resolved") || s.includes("closed")) {
      return { bg: "#dcfce7", color: "#166534" };
    }
    if (s.includes("rejected") || s.includes("deleted")) {
      return { bg: "#fee2e2", color: "#991b1b" };
    }
    if (s.includes("progress") || s.includes("wip")) {
      return { bg: "#dbeafe", color: "#1e40af" };
    }
    if (s.includes("pending")) {
      return { bg: "#ffedd5", color: "#c2410c" };
    }
    return { bg: "#fef3c7", color: "#92400e" };
  };

  const { isAdmin } = getAuthDetails();

  return (
    <>
      <MyTasksNavBar />

      <div className="approval-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2 className="approval-title" style={{ margin: 0 }}>
            {isAdmin ? "Request Approval & Clearance Management (Admin)" : "My Pending Tasks & Clearance Status"}
          </h2>
          {isAdmin && (
            <button
              type="button"
              className="resetTaskBtn"
              onClick={handleResetLeaves}
              style={{
                backgroundColor: "#ef4444",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
                fontSize: "13.5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              }}
            >
              🔄 Reset Leave Balances
            </button>
          )}
        </div>

        {/* LEAVE REQUESTS TABLE */}
        {data.length > 0 ? (
          <>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "10px" }}>
              Leave Requests
            </h3>
            <div className="table-wrapper">
              <table className="MyTaskTable">
                <thead>
                  <tr className="MyTaskTableRow">
                    <th className="MyTaskTableHeader">Record No</th>
                    <th className="MyTaskTableHeader">Requester</th>
                    <th className="MyTaskTableHeader">Requested For</th>
                    <th className="MyTaskTableHeader">Leave Type</th>
                    <th className="MyTaskTableHeader">Start Date</th>
                    <th className="MyTaskTableHeader">End Date</th>
                    <th className="MyTaskTableHeader">Days</th>
                    <th className="MyTaskTableHeader">Half Day</th>
                    {isAdmin ? (
                      <>
                        <th className="MyTaskTableHeader">Approve</th>
                        <th className="MyTaskTableHeader">Reject</th>
                        <th className="MyTaskTableHeader">Comment</th>
                      </>
                    ) : (
                      <th className="MyTaskTableHeader">Approval Status</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {data.map((item) => (
                    <tr className="MyTaskTableRow" key={item._id}>
                      <td className="MyTaskTableCell">{item.leaveNumber}</td>
                      <td className="MyTaskTableCell">{item.requester}</td>
                      <td className="MyTaskTableCell">{item.requesterFor || "Sumit"}</td>
                      <td className="MyTaskTableCell">{item.leaveType}</td>
                      <td className="MyTaskTableCell">{item.startDate}</td>
                      <td className="MyTaskTableCell">{item.endDate}</td>
                      <td className="MyTaskTableCell MyTaskCenter">{item.totalLeaves}</td>
                      <td className="MyTaskTableCell MyTaskCenter">{item.halfDay ? "Yes" : "No"}</td>

                      {isAdmin ? (
                        <>
                          <td className="MyTaskTableCell MyTaskCenter">
                            <button className="approve-btn" onClick={() => approveLeave(item._id)}>
                              Approve
                            </button>
                          </td>
                          <td className="MyTaskTableCell MyTaskCenter">
                            <button className="delete-btn" onClick={() => rejectLeave(item._id)}>
                              Reject
                            </button>
                          </td>
                          <td className="MyTaskTableCell">
                            <input type="text" placeholder="Comment..." className="comment-input" />
                          </td>
                        </>
                      ) : (
                        <td className="MyTaskTableCell MyTaskCenter">
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontWeight: "700",
                              fontSize: "12px",
                              background:
                                item.status === "Approved"
                                  ? "#dcfce7"
                                  : item.status === "Rejected"
                                  ? "#fee2e2"
                                  : "#fef3c7",
                              color:
                                item.status === "Approved"
                                  ? "#166534"
                                  : item.status === "Rejected"
                                  ? "#991b1b"
                                  : "#92400e",
                            }}
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={{ color: "#64748b", padding: "10px 0 20px 0", fontSize: "14px" }}>
            No pending leave requests.
          </div>
        )}

        {/* OFFBOARDING / EXIT REQUESTS TABLE WITH SEPARATE CLEARANCE STATUSES */}
        {offboardingData.length > 0 ? (
          <>
            <h2 className="approval-title" style={{ marginTop: "24px" }}>
              Offboarding Exit & Task Clearance Requests
            </h2>

            <div className="table-wrapper">
              <table className="MyTaskTable">
                <thead>
                  <tr className="MyTaskTableRow">
                    <th className="MyTaskTableHeader">Case ID</th>
                    <th className="MyTaskTableHeader">Requester</th>
                    <th className="MyTaskTableHeader">Resignation Date</th>
                    <th className="MyTaskTableHeader">Last Working Day</th>
                    <th className="MyTaskTableHeader">Resignation Reason</th>
                    <th className="MyTaskTableHeader">IT Clearance</th>
                    <th className="MyTaskTableHeader">Finance Clearance</th>
                    <th className="MyTaskTableHeader">Admin Clearance</th>
                    <th className="MyTaskTableHeader">Approval Status</th>
                    <th className="MyTaskTableHeader">Onboarding Status</th>
                  </tr>
                </thead>

                <tbody>
                  {offboardingData.map((item, idx) => {
                    const itStatusVal = item.itClearanceStatus || item.ItTAskStatus || item.itStatus || item.taskStatus || "Open";
                    const finStatusVal = item.financeClearanceStatus || item.financeStatus || "Open";
                    const admStatusVal = item.adminClearanceStatus || item.adminStatus || "Open";

                    const itBadge = getStatusBadgeStyle(itStatusVal);
                    const finBadge = getStatusBadgeStyle(finStatusVal);
                    const admBadge = getStatusBadgeStyle(admStatusVal);
                    const appStatusVal = item.approvalStatus || (item.status === "Open" ? "Pending" : item.status || "Pending");
                    const appBadge = getStatusBadgeStyle(appStatusVal);

                    return (
                      <tr className="MyTaskTableRow" key={item._id || idx}>
                        <td className="MyTaskTableCell">
                          <strong
                            style={{ cursor: "pointer", color: "#0284c7" }}
                            onClick={() => navigate(`/offboarding-saves/${item._id}`)}
                            title="Click to open offboarding task details"
                          >
                            {item.caseId || `OFF-${item._id.slice(-5).toUpperCase()}`}
                          </strong>
                        </td>

                        <td className="MyTaskTableCell">
                          {item.requesterName || item.requester || user?.displayName || user?.username}
                        </td>

                        <td className="MyTaskTableCell">
                          {item.resignationDate ? new Date(item.resignationDate).toLocaleDateString() : "-"}
                        </td>

                        {/* EDITABLE LAST WORKING DAY FOR ADMIN */}
                        <td className="MyTaskTableCell">
                          {isAdmin ? (
                            <input
                              type="date"
                              value={
                                item.lastWorkingDay
                                  ? new Date(item.lastWorkingDay).toISOString().slice(0, 10)
                                  : ""
                              }
                              onChange={(e) => handleLastWorkingDayUpdate(item._id, e.target.value)}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                border: "1px solid #cbd5e1",
                                color: "#0f172a",
                                backgroundColor: "#ffffff",
                              }}
                              title="Click to edit Last Working Day"
                            />
                          ) : (
                            item.lastWorkingDay ? new Date(item.lastWorkingDay).toLocaleDateString() : "-"
                          )}
                        </td>

                        <td className="MyTaskTableCell">{item.resignationReason || item.description || "-"}</td>

                        {/* IT CLEARANCE STATUS */}
                        <td className="MyTaskTableCell MyTaskCenter">
                          {isAdmin ? (
                            <select
                              value={itStatusVal}
                              onChange={(e) => handleClearanceStatusUpdate(item._id, "itClearanceStatus", e.target.value)}
                              style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #cbd5e1" }}
                            >
                              <option value="Open">Open</option>
                              <option value="Work In Progress">Work In Progress</option>
                              <option value="Pending">Pending</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>
                          ) : (
                            <span style={{ padding: "4px 10px", borderRadius: "12px", fontWeight: "700", fontSize: "12px", background: itBadge.bg, color: itBadge.color }}>
                              {itStatusVal}
                            </span>
                          )}
                        </td>

                        {/* FINANCE CLEARANCE STATUS */}
                        <td className="MyTaskTableCell MyTaskCenter">
                          {isAdmin ? (
                            <select
                              value={finStatusVal}
                              onChange={(e) => handleClearanceStatusUpdate(item._id, "financeClearanceStatus", e.target.value)}
                              style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #cbd5e1" }}
                            >
                              <option value="Open">Open</option>
                              <option value="Work In Progress">Work In Progress</option>
                              <option value="Pending">Pending</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>
                          ) : (
                            <span style={{ padding: "4px 10px", borderRadius: "12px", fontWeight: "700", fontSize: "12px", background: finBadge.bg, color: finBadge.color }}>
                              {finStatusVal}
                            </span>
                          )}
                        </td>

                        {/* ADMIN CLEARANCE STATUS */}
                        <td className="MyTaskTableCell MyTaskCenter">
                          {isAdmin ? (
                            <select
                              value={admStatusVal}
                              onChange={(e) => handleClearanceStatusUpdate(item._id, "adminClearanceStatus", e.target.value)}
                              style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #cbd5e1" }}
                            >
                              <option value="Open">Open</option>
                              <option value="Work In Progress">Work In Progress</option>
                              <option value="Pending">Pending</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>
                          ) : (
                            <span style={{ padding: "4px 10px", borderRadius: "12px", fontWeight: "700", fontSize: "12px", background: admBadge.bg, color: admBadge.color }}>
                              {admStatusVal}
                            </span>
                          )}
                        </td>

                        {/* APPROVAL STATUS COLUMN AT THE END */}
                        <td className="MyTaskTableCell MyTaskCenter">
                          {appStatusVal === "Approved" ? (
                            <span
                              style={{
                                padding: "4px 12px",
                                borderRadius: "12px",
                                fontWeight: "700",
                                fontSize: "12px",
                                background: "#dcfce7",
                                color: "#166534",
                              }}
                            >
                              Approved
                            </span>
                          ) : appStatusVal === "Rejected" ? (
                            <span
                              style={{
                                padding: "4px 12px",
                                borderRadius: "12px",
                                fontWeight: "700",
                                fontSize: "12px",
                                background: "#fee2e2",
                                color: "#991b1b",
                              }}
                            >
                              Rejected
                            </span>
                          ) : isAdmin ? (
                            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                              <button
                                className="approve-btn"
                                onClick={() => approveOffboarding(item._id)}
                                style={{ padding: "4px 10px", fontSize: "12px", fontWeight: "600", borderRadius: "6px" }}
                              >
                                Approve
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => deleteOffboarding(item._id)}
                                style={{ padding: "4px 10px", fontSize: "12px", fontWeight: "600", borderRadius: "6px" }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span
                              style={{
                                padding: "4px 12px",
                                borderRadius: "12px",
                                fontWeight: "700",
                                fontSize: "12px",
                                background: "#fef3c7",
                                color: "#92400e",
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </td>

                        {/* ONBOARDING STATUS COLUMN */}
                        <td className="MyTaskTableCell MyTaskCenter">
                          {(() => {
                            const isItDone = ["resolved", "closed", "approved"].includes(String(itStatusVal).toLowerCase());
                            const isFinDone = ["resolved", "closed", "approved"].includes(String(finStatusVal).toLowerCase());
                            const isHrDone = ["resolved", "closed", "approved"].includes(String(admStatusVal).toLowerCase());
                            const isAllResolved = isItDone && isFinDone && isHrDone;
                            const onbStatus = isAllResolved ? "Resolved" : (item.onboardingStatus || item.offboardingStatus || "Open");

                            return (
                              <span
                                style={{
                                  padding: "4px 12px",
                                  borderRadius: "12px",
                                  fontWeight: "700",
                                  fontSize: "12px",
                                  background: isAllResolved ? "#dcfce7" : "#ffedd5",
                                  color: isAllResolved ? "#166534" : "#c2410c",
                                }}
                              >
                                {onbStatus}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={{ color: "#64748b", padding: "10px 0", fontSize: "14px" }}>
            No offboarding requests found.
          </div>
        )}
      </div>
    </>
  );
}

export default ApprovalTable;
