// import { useState } from "react";
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

function HomeLeaveRequest() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [description, setDescription] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [requester, setRequester] = useState("");
  const [requesterFor, setRequesterFor] = useState("");
  const navigate = useNavigate();
  const leaveAllocationMap = {
    "Casual Leave": 5,
    "Sick Leave": 10,
    "Paid Leave": 15,
    "Maternity Leave": 20,
    "Paternity Leave": 12,
  };


  const calculateLeaves = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const totalDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
      return halfDay ? totalDays / 2 : totalDays;
    }
    if (leaveType && leaveAllocationMap[leaveType]) {
      return leaveAllocationMap[leaveType];
    }
    return 1;
  };
  const handleSave = async () => {
    try {
      const leaveAllocation = {
        "Casual Leave": 5,
        "Sick Leave": 10,
        "Paid Leave": 15,
        "Maternity Leave": 20,
        "Paternity Leave": 12,
      };

      const allocated = leaveAllocation[leaveType] || 0;

      const response = await fetchApiData("/api/leaves");

      const approvedLeaves = response.data.filter(
        (item) => item.leaveType === leaveType && item.status === "Approved",
      );

      const consumed = approvedLeaves.reduce(
        (sum, item) => sum + Number(item.totalLeaves || 0),
        0,
      );

      const balance = allocated - consumed;
      const requestedLeaves = Number(calculateLeaves());

      if (requestedLeaves > balance) {
        alert(
          "Sorry! Your leave balance has been exhausted. Please apply for another leave type if available.",
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
      });

      const rawUser = requester.trim() || "Srikar";
      const userMail = getUserEmailByName(rawUser);
      const adminMail = ADMIN_EMAIL; // sumit@enhanceservices.com.au
      const senderMail = SYSTEM_SENDER_EMAIL; // srikar071@gmail.com

      let userBody = "Leave has been applied.";
      if (rawUser.toLowerCase().includes("karan")) {
        userBody = "Thank you, your leave has been applied.";
      }

      const adminBody = `Please approve ${rawUser}'s leave.`;

      // 1. Send User Email Notification (From: srikar071@gmail.com)
      sendMailNotification({
        to: userMail,
        toName: rawUser,
        from: senderMail,
        fromName: "srikar071@gmail.com",
        subject: "Leave Request Applied",
        body: userBody,
      });

      // 2. Send Admin Email Notification (From: srikar071@gmail.com)
      sendMailNotification({
        to: adminMail,
        toName: "Sumit (Admin)",
        from: senderMail,
        fromName: "srikar071@gmail.com",
        subject: `Leave Approval Request - ${rawUser}`,
        body: adminBody,
      });

      alert("Leave Request Saved Successfully & Notification Mails Sent!");

      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error Saving Leave Request");
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
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">Requester For</label>
                <input
                  type="text"
                  className="lr-input"
                  placeholder="Search employee"
                  value={requesterFor}
                  onChange={(e) => setRequesterFor(e.target.value)}
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
                <label className="lr-label">Total Leaves</label>
                <input
                  type="text"
                  className="lr-input"
                  value={calculateLeaves()}
                  readOnly
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
            <button className="lr-btn-cancel" onClick={() => navigate("/")}>Cancel</button>
            <button className="lr-btn-submit" onClick={handleSave}>Submit Request</button>
          </div>
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveRequest;
