import MyTasksNavBar from "./MyTaskNavvar";
import { useEffect, useState } from "react";
import axios from "axios";

import "./index.css";

function ApprovalTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const response = await axios.get(
      "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves",
    );

    setData(response.data);
  };

  const approveLeave = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/approve/${id}`,
      );

      fetchLeaves();
    } catch (error) {
      console.log("ERROR RESPONSE:", error.response?.data);
      console.log(error);
    }
  };

  const deleteLeave = async (id) => {
    try {
      await axios.delete(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves/${id}`,
      );

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <MyTasksNavBar />
      <div className="approval-container">
        <h2 className="approval-title">Request Approval List</h2>

        <table className="MyTaskTable">
          <thead>
            <tr className="MyTaskTableRow">
              <th className="MyTaskTableHeader">Serial Number</th>
              <th className="MyTaskTableHeader">Name</th>
              <th className="MyTaskTableHeader">Approve</th>
              <th className="MyTaskTableHeader">Delete</th>
              <th className="MyTaskTableHeader">Comment</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr className="MyTaskTableRow" key={item._id}>
                <td className="MyTaskTableCell">{item.leaveNumber}</td>

                <td className="MyTaskTableCell">{item.employeeName}</td>

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
                    onClick={() => deleteLeave(item._id)}
                  >
                    Delete
                  </button>
                </td>

                <td className="MyTaskTableCell">
                  <input
                    type="text"
                    placeholder="Enter comment..."
                    className="comment-input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ApprovalTable;
