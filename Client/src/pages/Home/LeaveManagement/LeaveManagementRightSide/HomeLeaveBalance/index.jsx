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
              className="LeaveBalanceInput LeaveSelectInput"
              value={leaveType}
              onChange={handleLeaveTypeChange}
            >
              <option value="">Select Leave Type</option>
              <option value="Casual Leave">Casual Leave (5 Days)</option>
              <option value="Sick Leave">Sick Leave (10 Days)</option>
              <option value="Paid Leave">Paid Leave (15 Days)</option>
              <option value="Maternity Leave">Maternity Leave (20 Days)</option>
              <option value="Paternity Leave">Paternity Leave (12 Days)</option>
            </select>
          </div>

          <div className="LeaveBalanceField">
            <label>Total Allocated</label>
            <input
              className="LeaveBalanceInput ReadOnlyInput"
              value={totalAllocated !== "" ? totalAllocated : ""}
              readOnly
            />
          </div>
        </div>

        <div className="LeaveBalanceRow" style={{ marginTop: "16px" }}>
          <div className="LeaveBalanceField">
            <label>Leave Consumed</label>
            <input
              className="LeaveBalanceInput ReadOnlyInput"
              value={leaveConsumed !== "" ? leaveConsumed : ""}
              readOnly
            />
          </div>

          <div className="LeaveBalanceField">
            <label>Leave Balance</label>
            <input
              className="LeaveBalanceInput ReadOnlyInput"
              value={leaveBalance !== "" ? leaveBalance : ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveBalance;
