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
import { calculateNetLeaveDays } from "../../../../../utils/holidays";

import { useAuth } from "../../../../../context/AuthContext";

function HomeLeaveRequest() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [description, setDescription] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [requester, setRequester] = useState(() => user?.displayName || user?.username || "");
  const [requesterFor, setRequesterFor] = useState("");

  const navigate = useNavigate();

  const leaveAllocationMap = {
    "Casual Leave": 5,
    "Sick Leave": 10,
    "Paid Leave": 15,
    "Maternity Leave": 20,
    "Paternity Leave": 12,
  };

  // Load saved draft if present
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("leave_request_draft");
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (draft.requester !== undefined) setRequester(draft.requester);
        if (draft.requesterFor !== undefined) setRequesterFor(draft.requesterFor);
        if (draft.leaveType !== undefined) setLeaveType(draft.leaveType);
        if (draft.startDate !== undefined) setStartDate(draft.startDate);
        if (draft.endDate !== undefined) setEndDate(draft.endDate);
        if (draft.halfDay !== undefined) setHalfDay(draft.halfDay);
        if (draft.description !== undefined) setDescription(draft.description);
      }
    } catch (e) {
      console.error("Error loading leave request draft", e);
    }
  }, []);

  useEffect(() => {
    if (user && !requester) {
      setRequester(user.displayName || user.username);
    }
  }, [user]);

  const calculateLeaves = () => {
    if (startDate && endDate) {
      return calculateNetLeaveDays(startDate, endDate, halfDay);
    }
    if (leaveType && leaveAllocationMap[leaveType]) {
      return leaveAllocationMap[leaveType];
    }
    return 1;
  };

  // Cancel Button: Clears all form fields & removes draft
  const handleCancel = () => {
    setStartDate("");
    setEndDate("");
    setHalfDay(false);
    setDescription("");
    setLeaveType("");
    setRequester(user?.displayName || user?.username || "");
    setRequesterFor("");
    localStorage.removeItem("leave_request_draft");
  };

  // Save Button: Preserves form fields in localStorage so returning users see their data
  const handleDraftSave = () => {
    try {
      const draft = {
        requester,
        requesterFor,
        leaveType,
        startDate,
        endDate,
        halfDay,
        description,
      };
      localStorage.setItem("leave_request_draft", JSON.stringify(draft));
      alert("Form details saved successfully! Your entries will remain available when you return.");
    } catch (e) {
      console.error("Error saving draft", e);
      alert("Error saving form details.");
    }
  };

  // Submit Request Button: Executes calculations, API backend creation, notifications & navigation
  const handleSubmitRequest = async () => {
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

      localStorage.removeItem("leave_request_draft");
      alert("Leave Request Saved Successfully & Notification Mails Sent!");

      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error Saving Leave Request");
    }
  };

  return (
    <LeaveManagementLeftSide>
      <div className="lr-page LeaveRequestPage">
        <div className="lr-card LeaveRequestContainer">
          <h2 className="lr-title LeaveRequestTitle">Leave Request</h2>

          {/* EMPLOYEE DETAILS SECTION */}
          <div className="lr-section" style={{ marginBottom: "22px" }}>
            <div className="lr-section-header" style={{ marginBottom: "12px" }}>
              <span className="lr-icon">👤</span>
              <span className="lr-section-title">EMPLOYEE DETAILS</span>
            </div>
            <div className="lr-grid-2">
              <div className="lr-field">
                <label className="lr-label">Requester</label>
                <input
                  type="text"
                  className="lr-input LeaveRequestInput"
                  placeholder="Enter requester"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">Requester For</label>
                <input
                  type="text"
                  className="lr-input LeaveRequestInput"
                  placeholder="Search employee"
                  value={requesterFor}
                  onChange={(e) => setRequesterFor(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* LEAVE DETAILS SECTION */}
          <div className="lr-section" style={{ marginBottom: "22px" }}>
            <div className="lr-section-header" style={{ marginBottom: "12px" }}>
              <span className="lr-icon">📅</span>
              <span className="lr-section-title">LEAVE DETAILS</span>
            </div>
            
            <div className="lr-grid-2" style={{ gap: "14px 24px" }}>
              <div className="lr-field">
                <label className="lr-label">Leave Type</label>
                <select
                  className="lr-input LeaveSelectInput"
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
                  className="lr-input ReadOnlyInput"
                  value={calculateLeaves()}
                  readOnly
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">Start Date</label>
                <input
                  type="date"
                  className="lr-input LeaveRequestInput"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="lr-field">
                <label className="lr-label">End Date</label>
                <input
                  type="date"
                  className="lr-input LeaveRequestInput"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="lr-row-checkbox" style={{ marginTop: "10px" }}>
              <label className="lr-checkbox-label-wrap">
                <input
                  type="checkbox"
                  className="lr-checkbox LeaveRequestCheckbox"
                  checked={halfDay}
                  onChange={(e) => setHalfDay(e.target.checked)}
                />
                <span className="lr-checkbox-text">Half-day leave</span>
              </label>
            </div>
          </div>

          {/* DESCRIPTION SECTION */}
          <div className="lr-section" style={{ marginTop: "14px", marginBottom: "10px" }}>
            <div className="lr-section-header" style={{ marginBottom: "2px" }}>
              <span className="lr-icon">📄</span>
              <span className="lr-section-title">DESCRIPTION</span>
            </div>
            
            <div className="lr-textarea-wrap" style={{ marginTop: "4px" }}>
              <textarea
                className="lr-textarea LeaveRequestTextarea"
                placeholder="Briefly explain the reason for your leave request."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              ></textarea>
              <div className="lr-char-counter">{description.length} / 500</div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="lr-actions LeaveRequestActions">
            <button className="lr-btn-cancel LeaveRequestCancel" onClick={handleCancel}>Cancel</button>
            <button className="lr-btn-draft LeaveRequestDraft" onClick={handleDraftSave}>Save</button>
            <button className="lr-btn-submit LeaveRequestSave" onClick={handleSubmitRequest}>Submit Request</button>
          </div>
        </div>

        <div className="LeaveRequestFooter">
          © Copyright 2026 Enhance Services - All Rights Reserved.
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveRequest;
