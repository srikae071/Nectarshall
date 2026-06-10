import LeaveManagementLeftSide from "./../../LeaveManagementLeftSide";
import "./index.css";

function HomeLeaveBalance() {
  return (
    <LeaveManagementLeftSide>
      <div className="LeaveBalanceContainer">
        <h2 className="LeaveBalanceTitle">Leave Balance</h2>

        {/* ROW */}
        <div className="LeaveBalanceRow">
          <div className="LeaveBalanceField">
            <label>Leave Type</label>
            <select className="LeaveBalanceInput ">
              <option>Leave Type</option>
            </select>
          </div>

          <div className="LeaveBalanceField">
            <label>Total Allocated</label>
            <input className="LeaveBalanceInput" />
          </div>

          <div className="LeaveBalanceField">
            <label>Leave Consumed</label>
            <input className="LeaveBalanceInput" />
          </div>

          <div className="LeaveBalanceField">
            <label>Leave Balance</label>
            <input className="LeaveBalanceInput" />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="LeaveBalanceActions">
          <button className="LeaveBalanceSave">Save</button>
          <button className="LeaveBalanceCancel">Cancel</button>
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveBalance;
