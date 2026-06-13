// import { useState } from "react";
import axios from "axios";
import LeaveManagementLeftSide from "./../../LeaveManagementLeftSide";

import "./index.css";
import { useState } from "react";

function HomeLeaveRequest() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [description, setDescription] = useState("");
  // const [leaveType, setLeaveType] = useState("Earned Leaves");
  const [leaveType, setLeaveType] = useState("");
  const handleSave = async () => {
    try {
      await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/create",
        {
          employeeName: "Sumith Sir",
          startDate,
          leaveType,
          endDate,
          totalLeaves: calculateLeaves(),
          halfDay,
          description,
        },
      );

      alert("Leave Request Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Error Saving Leave Request");
    }
  };
  const calculateLeaves = () => {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end.getTime() - start.getTime();

    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return halfDay ? totalDays / 2 : totalDays;
  };
  return (
    <LeaveManagementLeftSide>
      <div className="LeaveRequestPage">
        <div className="LeaveRequestContainer">
          <h2 className="LeaveRequestTitle">Leave Request</h2>

          {/* ROW 1 */}
          <div className="LeaveRequestRow">
            <div className="LeaveRequestField">
              <label>Leave Types</label>
              <select
                className="LeaveRequestInput"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="">Select Leave Type</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
                <option value="Paid Leave">Paid Leave</option>
              </select>
            </div>

            <div className="LeaveRequestField">
              <label>Start Date</label>
              <input
                type="date"
                className="LeaveRequestInput"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="LeaveRequestField">
              <label>End Date</label>
              <input
                type="date"
                className="LeaveRequestInput"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="LeaveRequestRow">
            <div className="LeaveRequestField LeaveRequestSmallField">
              <label>Total Leaves</label>
              <input
                className="LeaveRequestInput"
                value={calculateLeaves()}
                readOnly
              />
            </div>

            <div className="LeaveRequestField LeaveRequestHalfDay">
              <label>Half Day</label>
              <input
                type="checkbox"
                className="LeaveRequestCheckbox"
                checked={halfDay}
                onChange={(e) => setHalfDay(e.target.checked)}
              />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="LeaveRequestField LeaveRequestFull">
            <label className="leqreason">Description</label>
            <textarea
              className="LeaveRequestTextarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* ACTIONS */}
          <div className="LeaveRequestActions">
            <button className="LeaveRequestSave" onClick={handleSave}>
              Save
            </button>
            <button className="LeaveRequestCancel">Cancel</button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="LeaveRequestFooter">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div>
      </div>
    </LeaveManagementLeftSide>
  );
}

export default HomeLeaveRequest;
