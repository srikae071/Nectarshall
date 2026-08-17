import Hrmsleftlayout from "../../pages/Hrms/Hrmsleftlayout";
import { useState, useEffect } from "react";
import "./LeaveBalance.css";
import { fetchApiData } from "../../utils/apiClient";

function LeaveBalance() {
  const [leaveType, setLeaveType] = useState("Paid Leave");
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [leaveConsumed, setLeaveConsumed] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(0);

  const leaveAllocation = {
    "Casual Leave": 5,
    "Sick Leave": 10,
    "Paid Leave": 15,
    "Maternity Leave": 20,
    "Paternity Leave": 12,
  };

  useEffect(() => {
    loadBalance("Paid Leave");
  }, []);

  const loadBalance = async (selectedType) => {
    if (!selectedType) {
      setTotalAllocated(0);
      setLeaveConsumed(0);
      setLeaveBalance(0);
      return;
    }

    const allocated = leaveAllocation[selectedType] || 0;
    setTotalAllocated(allocated);

    try {
      const response = await fetchApiData("/api/leaves");
      const approvedLeaves = (response.data || []).filter(
        (item) => item.leaveType === selectedType && item.status === "Approved",
      );
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

  const handleLeaveTypeChange = (e) => {
    const selectedType = e.target.value;
    setLeaveType(selectedType);
    loadBalance(selectedType);
  };
  return (
    <Hrmsleftlayout>
      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Leave Balance</h2>
          
          <div className="lr-section">
            <div className="lr-section-header">
              <span className="lr-icon">📊</span>
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
    </Hrmsleftlayout>
  );
}

export default LeaveBalance;
