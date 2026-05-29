// import { useState } from "react";
import Hrmsleftlayout from "../../pages/Hrms/Hrmsleftlayout";
import "./LeaveRequest.css";

function LeaveRequest() {
  // const [leaveType, setLeaveType] = useState("Earned Leaves");

  return (
    <Hrmsleftlayout>
      <div className="LeaveRequestPage">
        <div className="LeaveRequestContainer">
          <h2 className="LeaveRequestTitle">Leave Request</h2>

          {/* ROW 1 */}
          <div className="LeaveRequestRow">
            <div className="LeaveRequestField">
              <label>Leave Type</label>
              <select className="LeaveRequestInput">
                <option>Earned Leaves</option>
              </select>
            </div>

            <div className="LeaveRequestField">
              <label>Start Date</label>
              <input type="date" className="LeaveRequestInput" />
            </div>

            <div className="LeaveRequestField">
              <label>End Date</label>
              <input type="date" className="LeaveRequestInput" />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="LeaveRequestRow">
            <div className="LeaveRequestField LeaveRequestSmallField">
              <label>Total Leaves</label>
              <input className="LeaveRequestInput" disabled />
            </div>

            <div className="LeaveRequestField LeaveRequestHalfDay">
              <label>Half Day</label>
              <input type="checkbox" className="LeaveRequestCheckbox" />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="LeaveRequestField LeaveRequestFull">
            <label className="leqreason">Description</label>
            <textarea className="LeaveRequestTextarea"></textarea>
          </div>

          {/* ACTIONS */}
          <div className="LeaveRequestActions">
            <button className="LeaveRequestSave">Save</button>
            <button className="LeaveRequestCancel">Cancel</button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="LeaveRequestFooter">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div>
      </div>
    </Hrmsleftlayout>
  );
}

export default LeaveRequest;
