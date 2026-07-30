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
    fetchLeaves();
  }, [leaveType]);

  const fetchLeaves = async () => {
    const allocated = leaveAllocation[leaveType] || 0;
    setTotalAllocated(allocated);

    try {
      const response = await fetchApiData("/api/leaves");

      const approvedLeaves = response.data.filter(
        (item) => item.leaveType === leaveType && item.status === "Approved",
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
  return (
    <Hrmsleftlayout>
      <div className="LeaveBalanceContainer">
        <h2 className="LeaveBalanceTitle">Leave Balance</h2>

        <div className="LeaveBalanceRow">
          <div className="LeaveBalanceField">
            <label>Leave Type</label>

            <select
              className="LeaveBalanceInput"
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

          <div className="LeaveBalanceField">
            <label>Total Allocated</label>
            <input
              className="LeaveBalanceInput"
              value={totalAllocated}
              readOnly
            />
          </div>

          <div className="LeaveBalanceField">
            <label>Leave Consumed</label>
            <input
              className="LeaveBalanceInput"
              value={leaveConsumed}
              readOnly
            />
          </div>

          <div className="LeaveBalanceField">
            <label>Leave Balance</label>
            <input
              className="LeaveBalanceInput"
              value={leaveBalance}
              readOnly
            />
          </div>
        </div>

        <div className="LeaveBalanceActions">
          <button className="LeaveBalanceSave">Save</button>
          <button className="LeaveBalanceCancel">Cancel</button>
        </div>
      </div>
    </Hrmsleftlayout>
  );
}

export default LeaveBalance;
