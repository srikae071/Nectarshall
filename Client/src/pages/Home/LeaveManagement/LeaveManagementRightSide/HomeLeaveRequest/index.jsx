import axios from "axios";
import { fetchApiData, sendApiData } from "../../../../../utils/apiClient";
import {
  sendMailNotification,
  getUserEmailByName,
  ADMIN_EMAIL,
  SYSTEM_SENDER_EMAIL,
} from "../../../../../utils/mailService";
import LeaveManagementLeftSide from "./../../LeaveManagementLeftSide";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";

function HomeLeaveRequest() {
  const { user } = useAuth();
  const currentUserName = user?.displayName || user?.username || "Employee";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [description, setDescription] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [requester, setRequester] = useState(currentUserName);
  const [requesterFor, setRequesterFor] = useState("Sumit");
  const [leaveBalanceInfo, setLeaveBalanceInfo] = useState({ remaining: 0, consumed: 0, allocated: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserName) {
      setRequester(currentUserName);
    }
    setRequesterFor("Sumit");
  }, [currentUserName]);

  const leaveAllocationMap = {
    "Casual Leave": 5,
    "Sick Leave": 10,
    "Paid Leave": 15,
    "Maternity Leave": 20,
    "Paternity Leave": 12,
  };

  useEffect(() => {
    const fetchPersonalBalance = async () => {
      if (!leaveType) {
        setLeaveBalanceInfo({ remaining: 0, consumed: 0, allocated: 0 });
        return;
      }
      const allocated = leaveAllocationMap[leaveType] || 15;
      try {
        const response = await fetchApiData("/api/leaves");
        const u = (currentUserName || "").trim().toLowerCase();
        const userApprovedLeaves = (response.data || []).filter((item) => {
          if (item.leaveType !== leaveType || item.status !== "Approved") return false;
          const r1 = (item.requester || item.employeeName || "").trim().toLowerCase();
          const r2 = (item.requesterFor || "").trim().toLowerCase();
          return r1 === u || r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2 === u || r2.includes(u);
        });
        const consumed = userApprovedLeaves.reduce((sum, item) => sum + Number(item.totalLeaves || 0), 0);
        const remaining = Math.max(0, allocated - consumed);
        setLeaveBalanceInfo({ remaining, consumed, allocated });
      } catch (err) {
        console.log(err);
      }
    };
    fetchPersonalBalance();
  }, [leaveType, currentUserName]);

  const calculateLeaves = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const totalDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
      return halfDay ? totalDays / 2 : totalDays;
    }
    return 1;
  };

  const handleCancel = () => {
    setStartDate("");
    setEndDate("");
    setHalfDay(false);
    setLeaveType("");
    setDescription("");
  };

  const handleSave = () => {
    alert("Leave Request Saved as Draft Successfully.");
  };

  const handleSubmit = async () => {
    if (!leaveType || !startDate || !endDate) {
      alert("Please fill in required fields (Leave Type, Start Date, End Date).");
      return;
    }
    try {
      const allocated = leaveAllocationMap[leaveType] || 0;
      const response = await fetchApiData("/api/leaves");
      const u = (currentUserName || "").trim().toLowerCase();
      const approvedLeaves = (response.data || []).filter((item) => {
        if (item.leaveType !== leaveType || item.status !== "Approved") return false;
        const r1 = (item.requester || item.employeeName || "").trim().toLowerCase();
        const r2 = (item.requesterFor || "").trim().toLowerCase();
        return r1 === u || r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2 === u || r2.includes(u);
      });
      const consumed = approvedLeaves.reduce(
        (sum, item) => sum + Number(item.totalLeaves || 0),
        0,
      );

      const balance = allocated - consumed;
      const requestedLeaves = Number(calculateLeaves());

      if (requestedLeaves > balance) {
        alert(
          `Sorry! Your leave balance for ${leaveType} has been exhausted (${balance} days remaining). Please apply for another leave type if available.`,
        );
        navigate("/");
        return;
      }

      await sendApiData("/api/leaves/create", {
        requester,
        requesterFor,
        startDate,
        leaveType,
        endDate,
        totalLeaves: requestedLeaves,
        halfDay,
        description,
        status: "Pending",
      });

      const rawUser = requester.trim() || "Srikar";
      const userMail = getUserEmailByName(rawUser);
      const adminMail = ADMIN_EMAIL;
      const senderMail = SYSTEM_SENDER_EMAIL;

      let userBody = "Leave has been applied.";
      if (rawUser.toLowerCase().includes("karan")) {
        userBody = "Thank you, your leave has been applied.";
      }
      const adminBody = `Please approve ${rawUser}'s leave.`;

      sendMailNotification({
        to: userMail,
        toName: rawUser,
        from: senderMail,
        fromName: "srikar071@gmail.com",
        subject: "Leave Request Applied",
        body: userBody,
      });

      sendMailNotification({
        to: adminMail,
        toName: "Sumit (Admin)",
        from: senderMail,
        fromName: "srikar071@gmail.com",
        subject: `Leave Approval Request - ${rawUser}`,
        body: adminBody,
      });

      alert("Leave Request Submitted Successfully & Notification Mails Sent!");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error Submitting Leave Request");
    }
  };

  return (
    <LeaveManagementLeftSide>
      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Leave Request</h2>

          {/* EMPLOYEE DETAILS SECTION */}
          <div className="lr-section">
            <div className="lr-section-header">
              <span className="lr-section-title">EMPLOYEE DETAILS</span>
            </div>
            <div className="lr-grid-2">
              <div className="lr-field">
                <label className="lr-label">Requester</label>
                <input
                  type="text"
                  className="lr-input"
                  placeholder="Enter requester"
                  value={currentUserName || requester}
                  readOnly
                  disabled
                  style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">Requested For</label>
                <input
                  type="text"
                  className="lr-input"
                  placeholder="Admin"
                  value="Sumit"
                  readOnly
                  disabled
                  style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                />
              </div>
            </div>
          </div>

          {/* LEAVE DETAILS SECTION */}
          <div className="lr-section">
            <div className="lr-section-header">
              <span className="lr-section-title">LEAVE DETAILS</span>
            </div>
            
            <div className="lr-grid-2">
              <div className="lr-field">
                <label className="lr-label">Leave Type</label>
                <select
                  className="lr-input"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="">Select leave type</option>
                  <option value="Casual Leave">Casual Leave (5 Days)</option>
                  <option value="Sick Leave">Sick Leave (10 Days)</option>
                  <option value="Paid Leave">Paid Leave (15 Days)</option>
                  <option value="Maternity Leave">Maternity Leave (20 Days)</option>
                  <option value="Paternity Leave">Paternity Leave (12 Days)</option>
                </select>
              </div>

              <div className="lr-field">
                <label className="lr-label">Total Leave Balance</label>
                <input
                  type="text"
                  className="lr-input"
                  value={
                    leaveType
                      ? `${leaveBalanceInfo.remaining} days remaining (${leaveBalanceInfo.consumed} taken / ${leaveBalanceInfo.allocated} total)`
                      : "Select leave type"
                  }
                  readOnly
                  style={{ fontWeight: "700", color: "#0f172a", background: "#f8fafc" }}
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">Start Date</label>
                <input
                  type="date"
                  className="lr-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">End Date</label>
                <input
                  type="date"
                  className="lr-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="lr-row-checkbox">
              <label className="lr-checkbox-label-wrap">
                <input
                  type="checkbox"
                  className="lr-checkbox"
                  checked={halfDay}
                  onChange={(e) => setHalfDay(e.target.checked)}
                />
                <span className="lr-checkbox-text">Half-day leave</span>
              </label>
            </div>
          </div>

          {/* DESCRIPTION SECTION */}
          <div className="lr-section">
            <div className="lr-section-header">
              <span className="lr-section-title">DESCRIPTION</span>
            </div>
            
            <div className="lr-field lr-full">
              <div className="lr-textarea-wrap">
                <textarea
                  className="lr-textarea"
                  placeholder="Briefly explain the reason for your leave request."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                ></textarea>
                <div className="lr-char-counter">{description.length} / 500</div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="lr-actions">
            <button type="button" className="lr-btn-cancel" onClick={handleCancel}>Cancel</button>
            <button type="button" className="lr-btn-submit" style={{ background: "#64748b" }} onClick={handleSave}>Save</button>
            <button type="button" className="lr-btn-submit" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveRequest;
