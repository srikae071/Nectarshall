import { useState } from "react";
import axios from "axios";
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
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves",
      );

      const approvedLeaves = response.data.filter(
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

  return (
    <LeaveManagementLeftSide>
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
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveBalance;
