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
        // "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves",
        "http://localhost:5000/api/leaves",
      );

      setData(response.data.filter((item) => item.status === "Pending"));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPendingLeaves = async () => {
    try {
      const [leaveResponse, offboardingResponse] = await Promise.all([
        axios.get(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves",
        ),
        axios.get(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests",
        ),
      ]);

      const pendingLeaves = leaveResponse.data.filter(
        (item) => item.status === "Pending",
      ).length;

      const pendingOffboarding = offboardingResponse.data.filter(
        (item) => item.category === "Offboarding" && item.status === "Open",
      ).length;

      setPendingCount(pendingLeaves + pendingOffboarding);
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
  const deleteOffboarding = async (id) => {
    try {
      await axios.delete(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
      );

      fetchOffboarding();
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
        {data.length > 0 && (
          <>
            <h2 className="approval-title">Request Approval List</h2>

            <div className="table-wrapper">
              <table className="MyTaskTable">
                <thead>
                  <tr className="MyTaskTableRow">
                    <th className="MyTaskTableHeader">Record No</th>
                    <th className="MyTaskTableHeader">Requester</th>
                    <th className="MyTaskTableHeader">Requester For</th>
                    <th className="MyTaskTableHeader">Leave Type</th>
                    <th className="MyTaskTableHeader">Start Date</th>
                    <th className="MyTaskTableHeader">End Date</th>
                    <th className="MyTaskTableHeader">Days</th>
                    <th className="MyTaskTableHeader">Half Day</th>
                    <th className="MyTaskTableHeader">Approve</th>
                    <th className="MyTaskTableHeader">Reject</th>
                    <th className="MyTaskTableHeader">Comment</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item) => (
                    <tr className="MyTaskTableRow" key={item._id}>
                      <td className="MyTaskTableCell">{item.leaveNumber}</td>
                      <td className="MyTaskTableCell">{item.requester}</td>
                      <td className="MyTaskTableCell">{item.requesterFor}</td>
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
                        <button
                          className="approve-btn"
                          onClick={() => approveLeave(item._id)}
                        >
                          Approve
                        </button>
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <button
                          className="delete-btn"
                          onClick={() => rejectLeave(item._id)}
                        >
                          Delete
                        </button>
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <input
                          type="text"
                          placeholder="Comment..."
                          className="comment-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {offboardingData.length > 0 && (
          <>
            <h2 className="approval-title">
              Offboarding Employee Approval List
            </h2>

            <div className="table-wrapper">
              <table className="MyTaskTable">
                <thead>
                  <tr className="MyTaskTableRow">
                    <th className="MyTaskTableHeader">Case ID</th>
                    <th className="MyTaskTableHeader">Requester</th>
                    <th className="MyTaskTableHeader">Resignation Date</th>
                    <th className="MyTaskTableHeader">Last Working Day</th>
                    <th className="MyTaskTableHeader">Resignation Reason</th>
                    <th className="MyTaskTableHeader">Confirm Date</th>
                    <th className="MyTaskTableHeader">Approve</th>
                    <th className="MyTaskTableHeader">Delete</th>
                    <th className="MyTaskTableHeader">Comment</th>
                  </tr>
                </thead>

                <tbody>
                  {offboardingData.map((item) => (
                    <tr className="MyTaskTableRow" key={item._id}>
                      <td className="MyTaskTableCell">{item.caseId}</td>

                      <td className="MyTaskTableCell">{item.requesterName}</td>

                      <td className="MyTaskTableCell">
                        {item.resignationDate
                          ? new Date(item.resignationDate).toLocaleDateString()
                          : ""}
                      </td>

                      <td className="MyTaskTableCell">
                        {item.lastWorkingDay
                          ? new Date(item.lastWorkingDay).toLocaleDateString()
                          : ""}
                      </td>

                      <td className="MyTaskTableCell">
                        {item.resignationReason}
                      </td>

                      <td className="MyTaskTableCell">
                        <input type="date" className="confirm-date" />
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <button
                          className="approve-btn"
                          onClick={() => approveOffboarding(item._id)}
                        >
                          Approve
                        </button>
                      </td>

                      <td className="MyTaskTableCell MyTaskCenter">
                        <button
                          className="delete-btn"
                          onClick={() => deleteOffboarding(item._id)}
                        >
                          Delete
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ApprovalTable;
