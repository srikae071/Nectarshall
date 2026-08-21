import MyTasksNavBar from "./MyTaskNavvar";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
        (item) => item.category === "Offboarding" || item.category === "Exit"
      );
      const { username, isAdmin } = getAuthDetails();
      if (isAdmin) {
        // Admin sees all open/pending offboardings for approval
        setOffboardingData(list.filter((item) => item.status === "Open" || item.status === "Pending"));
      } else if (username) {
        const u = username.toLowerCase();
        // Employee sees all their own offboarding requests (Pending, Approved, Rejected)
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
      await sendApiData(`/api/jobrequests/${id}`, { status: "Approved" }, "put");
      alert("Offboarding request approved successfully");
      fetchOffboarding();
    } catch (error) {
      console.log(error);
      alert("Error approving request");
    }
  };

  const deleteOffboarding = async (id) => {
    try {
      await sendApiData(`/api/jobrequests/${id}`, { status: "Rejected" }, "put");
      alert("Offboarding request rejected/deleted");
      fetchOffboarding();
    } catch (error) {
      console.log(error);
      alert("Error rejecting request");
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

  const { isAdmin } = getAuthDetails();

  return (
    <>
      <MyTasksNavBar />

      <div className="approval-container">
        <div
          style={{
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2 className="approval-title" style={{ margin: 0 }}>
            {isAdmin ? "Request Approval List (Admin)" : "My Pending Tasks & Requests"}
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
                              Delete
                            </button>
                          </td>
                          <td className="MyTaskTableCell MyTaskCenter">
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

        {/* OFFBOARDING / EXIT REQUESTS TABLE */}
        {offboardingData.length > 0 ? (
          <>
            <h2 className="approval-title" style={{ marginTop: "20px" }}>
              Offboarding Employee Request
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
                    {isAdmin ? (
                      <>
                        <th className="MyTaskTableHeader">Confirm Date</th>
                        <th className="MyTaskTableHeader">Approve</th>
                        <th className="MyTaskTableHeader">Delete</th>
                        <th className="MyTaskTableHeader">Comment</th>
                      </>
                    ) : (
                      <th className="MyTaskTableHeader">Approval Status</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {offboardingData.map((item, idx) => (
                    <tr className="MyTaskTableRow" key={item._id || idx}>
                      <td className="MyTaskTableCell">
                        {item.caseId || (item._id ? `OFF-${item._id.slice(-5).toUpperCase()}` : `OFF-00${idx + 1}`)}
                      </td>

                      <td className="MyTaskTableCell">
                        {item.requesterName || item.requester || user?.displayName || user?.username}
                      </td>

                      <td className="MyTaskTableCell">
                        {item.resignationDate ? new Date(item.resignationDate).toLocaleDateString() : "-"}
                      </td>

                      <td className="MyTaskTableCell">
                        {item.lastWorkingDay ? new Date(item.lastWorkingDay).toLocaleDateString() : "-"}
                      </td>

                      <td className="MyTaskTableCell">{item.resignationReason || item.description || "-"}</td>

                      {isAdmin ? (
                        <>
                          <td className="MyTaskTableCell">
                            <input type="date" className="confirm-date" />
                          </td>

                          <td className="MyTaskTableCell MyTaskCenter">
                            <button className="approve-btn" onClick={() => approveOffboarding(item._id)}>
                              Approve
                            </button>
                          </td>

                          <td className="MyTaskTableCell MyTaskCenter">
                            <button className="delete-btn" onClick={() => deleteOffboarding(item._id)}>
                              Delete
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
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontWeight: "700",
                              fontSize: "12px",
                              background:
                                item.status === "Approved"
                                  ? "#dcfce7"
                                  : item.status === "Rejected" || item.status === "Deleted"
                                  ? "#fee2e2"
                                  : "#fef3c7",
                              color:
                                item.status === "Approved"
                                  ? "#166534"
                                  : item.status === "Rejected" || item.status === "Deleted"
                                  ? "#991b1b"
                                  : "#92400e",
                            }}
                          >
                            {item.status === "Open" ? "Pending" : item.status || "Pending"}
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
          <div style={{ color: "#64748b", padding: "10px 0", fontSize: "14px" }}>
            No offboarding requests found.
          </div>
        )}
      </div>
    </>
  );
}

export default ApprovalTable;
