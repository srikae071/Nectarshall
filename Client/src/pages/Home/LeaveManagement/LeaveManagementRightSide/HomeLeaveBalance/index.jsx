import { useState } from "react";
import axios from "axios";
import { fetchApiData } from "../../../../../utils/apiClient";
import LeaveManagementLeftSide from "./../../LeaveManagementLeftSide";
import "./index.css";

function HomeLeaveBalance() {
  const [leaveType, setLeaveType] = useState("");
  const [totalAllocated, setTotalAllocated] = useState("");
  const [leaveConsumed, setLeaveConsumed] = useState("");
  const [leaveBalance, setLeaveBalance] = useState("");

  const leaveAllocation = {
    "Casual Leave": 5,
    "Sick Leave": 10,
    "Paid Leave": 15,
    "Maternity Leave": 20,
    "Paternity Leave": 12,
  };

  const handleLeaveTypeChange = async (e) => {
    const selectedType = e.target.value;

    setLeaveType(selectedType);

    const allocated = leaveAllocation[selectedType] || 0;
    setTotalAllocated(allocated);

    try {
      const response = await fetchApiData("/api/leaves");

      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }
      const username = (authUser?.username || authUser?.name || authUser?.displayName || (typeof authUser === "string" ? authUser : "")).trim().toLowerCase();

      const approvedLeaves = (response.data || []).filter((item) => {
        if (item.leaveType !== selectedType || item.status !== "Approved") return false;
        if (!username) return true;
        const r1 = (item.requester || item.employeeName || "").trim().toLowerCase();
        const r2 = (item.requesterFor || "").trim().toLowerCase();
        return r1 === username || r1.includes(username) || username.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2 === username || r2.includes(username);
      });

      const consumed = approvedLeaves.reduce(
        (sum, item) => sum + Number(item.totalLeaves || 0),
        0,
      );

      const balance = allocated - consumed;

      setLeaveConsumed(consumed);
      setLeaveBalance(balance);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LeaveManagementLeftSide>
      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Leave Balance</h2>
          
          <div className="lr-section">
            <div className="lr-section-header">
              <span className="lr-section-title">BALANCE DETAILS</span>
            </div>
            
            <div className="lr-grid-2">
              <div className="lr-field">
                <label className="lr-label">Leave Type</label>
                <select
                  className="lr-input"
                  value={leaveType}
                  onChange={handleLeaveTypeChange}
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                </select>
              </div>

              <div className="lr-field">
                <label className="lr-label">Total Allocated</label>
                <input
                  className="lr-input"
                  value={totalAllocated}
                  readOnly
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">Leave Consumed</label>
                <input
                  className="lr-input"
                  value={leaveConsumed}
                  readOnly
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">Leave Balance</label>
                <input
                  className="lr-input"
                  value={leaveBalance}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="lr-actions">
            <button className="lr-btn-cancel">Cancel</button>
            <button className="lr-btn-submit">Save</button>
          </div>
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveBalance;
