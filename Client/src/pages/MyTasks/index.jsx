import MyTasksNavBar from "./MyTaskNavvar";
import { useEffect, useState } from "react";
import axios from "axios";

import "./index.css";

function ApprovalTable() {
  const [data, setData] = useState([]);
  const [offboardingData, setOffboardingData] = useState([]);

  useEffect(() => {
    fetchLeaves();
    fetchOffboarding();
  }, []);
  const fetchOffboarding = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests",
      );

      setOffboardingData(
        response.data.filter(
          (item) => item.category === "Offboarding" && item.status === "Open",
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };
  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves",
      );

      setData(response.data.filter((item) => item.status === "Pending"));
    } catch (error) {
      console.log(error);
    }
  };

  const approveLeave = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/approve/${id}`,
      );

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectLeave = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/reject/${id}`,
      );

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };

  const approveOffboarding = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        {
          status: "Approved",
        },
      );

      fetchOffboarding();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MyTasksNavBar />

      <div className="approval-container">
        <h2 className="approval-title">Request Approval List</h2>

        <div className="table-wrapper">
          <table className="MyTaskTable">
            <thead>
              <tr className="MyTaskTableRow">
                <th className="MyTaskTableHeader">Record No</th>
                <th className="MyTaskTableHeader">Employee</th>
                <th className="MyTaskTableHeader">Leave Type</th>
                <th className="MyTaskTableHeader">Start Date</th>
                <th className="MyTaskTableHeader">End Date</th>
                <th className="MyTaskTableHeader">Days</th>
                <th className="MyTaskTableHeader">Half Day</th>
                {/* <th className="MyTaskTableHeader">Description</th> */}
                <th className="MyTaskTableHeader">Approve</th>
                <th className="MyTaskTableHeader">Reject</th>
                <th className="MyTaskTableHeader">Comment</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr className="MyTaskTableRow" key={item._id}>
                    <td className="MyTaskTableCell">{item.leaveNumber}</td>

                    <td className="MyTaskTableCell">{item.employeeName}</td>

                    <td className="MyTaskTableCell">{item.leaveType}</td>

                    <td className="MyTaskTableCell">{item.startDate}</td>

                    <td className="MyTaskTableCell">{item.endDate}</td>

                    <td className="MyTaskTableCell MyTaskCenter">
                      {item.totalLeaves}
                    </td>

                    <td className="MyTaskTableCell MyTaskCenter">
                      {item.halfDay ? "Yes" : "No"}
                    </td>

                    <td className="MyTaskTableCell MyTaskCenter">
                      {item.status === "Approved" ? (
                        <button className="approved-btn">Approved</button>
                      ) : (
                        <button
                          className="approve-btn"
                          onClick={() => approveLeave(item._id)}
                        >
                          Approve
                        </button>
                      )}
                    </td>

                    <td className="MyTaskTableCell MyTaskCenter">
                      <button
                        className="delete-btn"
                        onClick={() => rejectLeave(item._id)}
                      >
                        Reject
                      </button>
                    </td>

                    <td className="MyTaskTableCell">
                      <input
                        type="text"
                        placeholder="Comment..."
                        className="comment-input"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="NoDataCell">
                    No leave requests available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="approval-section">
        <h2 className="approval-title">Offboarding Employee Approval List</h2>

        <div className="table-wrapper">
          <table className="MyTaskTable">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Requester</th>
                <th>Date of Resignation</th>
                <th>Last Working Day</th>
                <th>Resignation Reason</th>
                <th>Confirm Date</th>
                <th>Approve</th>
              </tr>
            </thead>

            <tbody>
              {offboardingData.length > 0 ? (
                offboardingData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.caseId}</td>

                    <td>{item.requesterName}</td>

                    <td>
                      {item.resignationDate
                        ? new Date(item.resignationDate).toLocaleDateString()
                        : ""}
                    </td>

                    <td>
                      {item.lastWorkingDay
                        ? new Date(item.lastWorkingDay).toLocaleDateString()
                        : ""}
                    </td>

                    <td>{item.resignationReason}</td>

                    <td>
                      <input type="date" className="confirm-date" />
                    </td>

                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => approveOffboarding(item._id)}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="NoDataCell">
                    No Offboarding Requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ApprovalTable;
