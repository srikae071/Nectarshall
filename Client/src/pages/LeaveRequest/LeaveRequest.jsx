// import { useState } from "react";
import axios from "axios";
import Hrmsleftlayout from "../../pages/Hrms/Hrmsleftlayout";
import "./LeaveRequest.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LeaveRequest() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [description, setDescription] = useState("");
  const [requester, setRequester] = useState("");
  const [requesterFor, setRequesterFor] = useState("");
  // const [leaveType, setLeaveType] = useState("Earned Leaves");
  const [leaveType, setLeaveType] = useState("");
  const navigate = useNavigate();
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

      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves",
      );

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

      await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/create",
        {
          requester,
          requesterFor,
          startDate,
          leaveType,
          endDate,
          totalLeaves: requestedLeaves,
          halfDay,
          description,
        },
      );

      alert("Leave Request Saved Successfully");

      navigate("/");
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
    <Hrmsleftlayout>
      <div className="LeaveRequestPage">
        <div className="LeaveRequestContainer">
          <h2 className="LeaveRequestTitle">Leave Request</h2>

          {/* Row 1 */}
          <div className="LeaveRequestRow">
            <div className="LeaveRequestField">
              <label>Requester</label>
              <input
                type="text"
                className="LeaveRequestInput"
                placeholder="Enter Requester"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
              />
            </div>

            <div className="LeaveRequestField">
              <label>Requester For</label>
              <input
                type="text"
                className="LeaveRequestInput"
                placeholder="Enter Requester For"
                value={requesterFor}
                onChange={(e) => setRequesterFor(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="LeaveRequestRow">
            <div className="LeaveRequestField">
              <label>Leave Type</label>

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
              <label>Total Leaves</label>

              <input
                className="LeaveRequestInput"
                value={calculateLeaves()}
                readOnly
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="LeaveRequestRow">
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

          {/* Row 4 */}
          <div className="LeaveRequestRow">
            <div className="LeaveRequestField">
              <label>Half Day</label>

              <input
                type="checkbox"
                className="LeaveRequestCheckbox"
                checked={halfDay}
                onChange={(e) => setHalfDay(e.target.checked)}
              />
            </div>

            <div className="LeaveRequestField"></div>
          </div>

          {/* Description */}
          <div className="LeaveRequestFull">
            <label className="leqreason">Description</label>

            <textarea
              className="LeaveRequestTextarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="LeaveRequestActions">
            <button className="LeaveRequestSave" onClick={handleSave}>
              Save
            </button>

            <button className="LeaveRequestCancel">Cancel</button>
          </div>
        </div>

        <div className="LeaveRequestFooter">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div>
      </div>
    </Hrmsleftlayout>
  );
}

export default LeaveRequest;
