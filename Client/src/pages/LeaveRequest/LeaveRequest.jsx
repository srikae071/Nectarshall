import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchApiData, sendApiData, extractArrayData } from "../../utils/apiClient";
import { FiSearch } from "react-icons/fi";
import {
  sendMailNotification,
  getUserEmailByName,
  ADMIN_EMAIL,
  SYSTEM_SENDER_EMAIL,
} from "../../utils/mailService";
import Hrmsleftlayout from "../Hrms/Hrmsleftlayout";
import "./LeaveRequest.css";
import { useAuth } from "../../context/AuthContext";
import RequestedForSelect from "../../components/RequestedForSelect";

function LeaveRequest() {
  const { user } = useAuth();
  const location = useLocation();
  const draftItem = location.state?.draftLeave;

  const currentUserName = user?.displayName || user?.username || "Employee";

  const [editingDraftId, setEditingDraftId] = useState(draftItem?._id || draftItem?.id || null);
  const [startDate, setStartDate] = useState(draftItem?.startDate || "");
  const [endDate, setEndDate] = useState(draftItem?.endDate || "");
  const [halfDay, setHalfDay] = useState(draftItem?.halfDay || false);
  const [shortDescription, setShortDescription] = useState(draftItem?.shortDescription || "");
  const [description, setDescription] = useState(draftItem?.description || "");
  const [requester, setRequester] = useState(draftItem?.requester || currentUserName);
  const [requesterFor, setRequesterFor] = useState(draftItem?.requesterFor || "");
  const [employeeOptions, setEmployeeOptions] = useState(["Sumit", "Srikar"]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState("");
  const [leaveType, setLeaveType] = useState(draftItem?.leaveType || "");
  const [employeeList, setEmployeeList] = useState([]);
  const [leaveBalanceInfo, setLeaveBalanceInfo] = useState({ remaining: 0, consumed: 0, allocated: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (draftItem) {
      setEditingDraftId(draftItem._id || draftItem.id);
      if (draftItem.startDate) setStartDate(draftItem.startDate);
      if (draftItem.endDate) setEndDate(draftItem.endDate);
      if (draftItem.leaveType) setLeaveType(draftItem.leaveType);
      if (draftItem.shortDescription) setShortDescription(draftItem.shortDescription);
      if (draftItem.description) setDescription(draftItem.description);
      if (draftItem.halfDay !== undefined) setHalfDay(draftItem.halfDay);
      if (draftItem.requesterFor) setRequesterFor(draftItem.requesterFor);
      if (draftItem.requester) setRequester(draftItem.requester);
    }
  }, [draftItem]);

  useEffect(() => {
    if (currentUserName && !draftItem) {
      setRequester(currentUserName);
    }
  }, [currentUserName, draftItem]);

  useEffect(() => {
    fetchApiData("/api/employees")
      .then((res) => {
        const empData = res.data || [];
        setEmployeeList(empData);

        const empNames = empData
          .map(
            (emp) =>
              emp.displayName ||
              emp.employeeName ||
              `${emp.firstName || ""} ${emp.lastName || ""}`.trim()
          )
          .filter(Boolean);

        if (!empNames.includes("Sumit")) empNames.unshift("Sumit");
        const uniqueEmpNames = [...new Set(empNames)];

        if (uniqueEmpNames.length > 0) {
          setEmployeeOptions(uniqueEmpNames);
        }
      })
      .catch((err) => {
        console.error("Error fetching employee list:", err);
      });
  }, []);

  const leaveAllocationMap = {
    "Casual Leave": 5,
    "Sick Leave": 10,
    "Paid Leave": 15,
    "Maternity Leave": 20,
    "Paternity Leave": 12,
  };

  const filteredSearchEmployees = employeeOptions.filter((name) => {
    if (!searchEmployeeQuery.trim()) return true;
    const q = searchEmployeeQuery.toLowerCase().trim();
    return name.toLowerCase().includes(q);
  });

  useEffect(() => {
    const fetchPersonalBalance = async () => {
      if (!leaveType) {
        setLeaveBalanceInfo({ remaining: 0, consumed: 0, allocated: 0 });
        return;
      }
      const allocated = leaveAllocationMap[leaveType] || 15;
      try {
        const response = await fetchApiData("/api/leaves");
        const allLeavesList = extractArrayData(response?.data || response);
        const u = (currentUserName || "").trim().toLowerCase();
        const userApprovedLeaves = allLeavesList.filter((item) => {
          if (item.leaveType !== leaveType || item.status !== "Approved") return false;
          const r1 = (item.requester || item.employeeName || "").trim().toLowerCase();
          const r2 = (item.requesterFor || "").trim().toLowerCase();
          return r1 === u || r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2 === u || r2.includes(u);
        });
        const consumed = userApprovedLeaves.reduce((sum, item) => sum + Number(item.totalLeaves || 0), 0);
        const remaining = Math.max(0, allocated - consumed);
        setLeaveBalanceInfo({ remaining, consumed, allocated });
      } catch (err) {
        console.error("Error fetching personal balance:", err);
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
    setShortDescription("");
    setDescription("");
  };

  const handleSave = async () => {
    if (!leaveType || !startDate || !endDate) {
      alert("Please select Leave Type, Start Date, and End Date before saving as Draft.");
      return;
    }
    try {
      const requestedLeaves = Number(calculateLeaves());
      const payload = {
        requester,
        requesterFor,
        startDate,
        endDate,
        leaveType,
        totalLeaves: requestedLeaves,
        halfDay,
        shortDescription,
        description,
        status: "Draft",
      };

      if (editingDraftId) {
        await sendApiData("PUT", `/api/leaves/${editingDraftId}`, payload);
        alert("Draft Leave Request Updated Successfully!");
      } else {
        await sendApiData("POST", "/api/leaves/create", payload);
        alert("Leave Request Saved as Draft Successfully!");
      }
      navigate("/leave-status");
    } catch (err) {
      console.log("Error saving draft leave:", err);
      alert("Error saving draft leave.");
    }
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

      const payload = {
        requester,
        requesterFor,
        startDate,
        leaveType,
        endDate,
        totalLeaves: requestedLeaves,
        halfDay,
        shortDescription,
        description,
        status: "Pending",
      };

      if (editingDraftId) {
        await sendApiData("PUT", `/api/leaves/${editingDraftId}`, payload);
      } else {
        await sendApiData("POST", "/api/leaves/create", payload);
      }

      const rawUser = requester.trim() || "Srikar";
      const userMail = getUserEmailByName(rawUser);
      const targetAdminMail = getUserEmailByName(requesterFor) || ADMIN_EMAIL;
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
        to: targetAdminMail,
        toName: `${requesterFor} (Admin)`,
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
    <Hrmsleftlayout>
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
                  className="lr-input"
                  name="requester"
                  placeholder="Enter requester"
                  value={currentUserName || requester}
                  readOnly
                  disabled
                  style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                />
              </div>

              <RequestedForSelect
                value={requesterFor}
                onChange={(e) => setRequesterFor(e.target.value)}
              />
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
                  style={{ fontWeight: "normal", color: "#334155", background: "#f8fafc" }}
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

            <div className="lr-row-checkbox" style={{ marginBottom: "16px" }}>
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

            <div className="lr-field lr-full" style={{ marginBottom: "16px" }}>
              <label className="lr-label">Short Description</label>
              <input
                type="text"
                className="lr-input"
                placeholder="Enter short description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>

            <div className="lr-field lr-full">
              <label className="lr-label">Description</label>
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
    </Hrmsleftlayout>
  );
}

export default LeaveRequest;
