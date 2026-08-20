import MyTasksNavBar from "./MyTaskNavvar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchApiData } from "../../utils/apiClient";

import "./index.css";

function ApprovalTable() {
  const [data, setData] = useState([]);
  const [offboardingData, setOffboardingData] = useState([]);

  useEffect(() => {
    fetchLeaves();
    fetchOffboarding();
  }, []);
  const getAuthDetails = () => {
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
    const isAdmin = role === "ADMIN" || username.toLowerCase().includes("sumit");
    return { username, isAdmin };
  };

  const fetchOffboarding = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");
      const list = response.data.filter(
        (item) => item.category === "Offboarding" && item.status === "Open",
      );
      const { username, isAdmin } = getAuthDetails();
      if (isAdmin) {
        setOffboardingData(list);
      } else if (username) {
        const u = username.toLowerCase();
        setOffboardingData(
          list.filter((item) => {
            const r1 = (item.requester || item.name || item.employeeName || "").toLowerCase();
            const r2 = (item.requesterFor || "").toLowerCase();
            return r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2.includes(u);
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
      const list = response.data.filter((item) => item.status === "Pending");
      const { username, isAdmin } = getAuthDetails();
      if (isAdmin) {
        setData(list);
      } else if (username) {
        const u = username.toLowerCase();
        setData(
          list.filter((item) => {
            const r1 = (item.requester || item.employeeName || "").toLowerCase();
            const r2 = (item.requesterFor || "").toLowerCase();
            return r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2.includes(u);
          })
        );
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPendingLeaves = async () => {
    try {
      const [leaveResponse, offboardingResponse] = await Promise.all([
        fetchApiData("/api/leaves"),
        fetchApiData("/api/jobrequests"),
      ]);

      const pendingLeaves = leaveResponse.data.filter(
        (item) => item.status === "Pending",
      ).length;

      const pendingOffboarding = offboardingResponse.data.filter(
        (item) => item.category === "Offboarding" && item.status === "Open",
      ).length;

      setPendingCount(pendingLeaves + pendingOffboarding);
    } catch (error) {
      console.log(error);
    }
  };
  const approveLeave = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/approve/${id}`,
      );

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteOffboarding = async (id) => {
    try {
      await axios.delete(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
      );

      fetchOffboarding();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectLeave = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/reject/${id}`,
      );

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };
  const approveOffboarding = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        {
          status: "Approved",
        },
      );

      fetchOffboarding();
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetLeaves = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/reset-all`,
      );
      alert("All leave requests and consumed balances have been reset successfully!");
      fetchLeaves();
    } catch (error) {
      console.log(error);
      alert("Error resetting leave balances");
    }
  };

  return (
    <>
      <MyTasksNavBar />

      <div className="approval-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
          <h2 className="approval-title" style={{ margin: 0 }}>Request Approval List</h2>
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
        </div>

        {data.length > 0 ? (
          <>
            <div className="table-wrapper">
              <table className="MyTaskTable">
                <thead>
                  <tr className="MyTaskTableRow">
                    <th className="MyTaskTableHeader">Record No</th>
                    <th className="MyTaskTableHeader">Requester</th>
                    <th className="MyTaskTableHeader">Requester For</th>
                    <th className="MyTaskTableHeader">Leave Type</th>
                    <th className="MyTaskTableHeader">Start Date</th>
                    <th className="MyTaskTableHeader">End Date</th>
                    <th className="MyTaskTableHeader">Days</th>
                    <th className="MyTaskTableHeader">Half Day</th>
                    <th className="MyTaskTableHeader">Approve</th>
                    <th className="MyTaskTableHeader">Reject</th>
                    <th className="MyTaskTableHeader">Comment</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item) => (
                    <tr className="MyTaskTableRow" key={item._id}>
                      <td className="MyTaskTableCell">{item.leaveNumber}</td>
                      <td className="MyTaskTableCell">{item.requester}</td>
                      <td className="MyTaskTableCell">{item.requesterFor}</td>
                      <td className="MyTaskTableCell">{item.leaveType}</td>
                      <td className="MyTaskTableCell">{item.startDate}</td>
                      <td className="MyTaskTableCell">{item.endDate}</td>
                      <td className="MyTaskTableCell MyTaskCenter">
                        {item.totalLeaves}
                      </td>
                      <td className="MyTaskTableCell MyTaskCenter">
                        {item.halfDay ? "Yes" : "No"}
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <button
                          className="approve-btn"
                          onClick={() => approveLeave(item._id)}
                        >
                          Approve
                        </button>
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <button
                          className="delete-btn"
                          onClick={() => rejectLeave(item._id)}
                        >
                          Delete
                        </button>
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <input
                          type="text"
                          placeholder="Comment..."
                          className="comment-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={{ color: "#64748b", padding: "15px 0", fontSize: "14px" }}>
            No pending leave approval requests.
          </div>
        )}
        {offboardingData.length > 0 && (
          <>
            <h2 className="approval-title">
              Offboarding Employee Approval List
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
                    <th className="MyTaskTableHeader">Confirm Date</th>
                    <th className="MyTaskTableHeader">Approve</th>
                    <th className="MyTaskTableHeader">Delete</th>
                    <th className="MyTaskTableHeader">Comment</th>
                  </tr>
                </thead>

                <tbody>
                  {offboardingData.map((item) => (
                    <tr className="MyTaskTableRow" key={item._id}>
                      <td className="MyTaskTableCell">{item.caseId}</td>

                      <td className="MyTaskTableCell">{item.requesterName}</td>

                      <td className="MyTaskTableCell">
                        {item.resignationDate
                          ? new Date(item.resignationDate).toLocaleDateString()
                          : ""}
                      </td>

                      <td className="MyTaskTableCell">
                        {item.lastWorkingDay
                          ? new Date(item.lastWorkingDay).toLocaleDateString()
                          : ""}
                      </td>

                      <td className="MyTaskTableCell">
                        {item.resignationReason}
                      </td>

                      <td className="MyTaskTableCell">
                        <input type="date" className="confirm-date" />
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <button
                          className="approve-btn"
                          onClick={() => approveOffboarding(item._id)}
                        >
                          Approve
                        </button>
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <button
                          className="delete-btn"
                          onClick={() => deleteOffboarding(item._id)}
                        >
                          Delete
                        </button>
                      </td>

                      <td className="MyTaskTableCell">
                        <input
                          type="text"
                          placeholder="Comment..."
                          className="comment-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ApprovalTable;
