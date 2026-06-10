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
      console.log(error);
    }
  };
  return (
    <div className="approval-container">
      <h2 className="approval-title">Request Approval List</h2>

      <table className="approval-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Name</th>
            <th>Approve</th>
            <th>Delete</th>
            <th>Comment</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.leaveNumber}</td>
              <td>{item.employeeName}</td>

              <td>
                {item.status === "Approved" ? (
                  "Approved"
                ) : (
                  <button onClick={() => approveLeave(item._id)}>
                    Approve
                  </button>
                )}
              </td>

              <td>
                <button>Reject</button>
              </td>

              <td>
                <input type="text" placeholder="Comment" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApprovalTable;
