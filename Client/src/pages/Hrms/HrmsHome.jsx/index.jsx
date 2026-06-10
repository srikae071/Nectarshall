import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HrmsLeftLayout from "../Hrmsleftlayout";
import "./index.css";
// const data = [...];

function HrmsHome() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/itrequests",
      );
      console.log(response.data);

      setData(response.data);

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">All</h3>

          <table className="opentable">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Requester</th>
                <th>Requester For</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/hrms/itsaves/${item._id}`)}
                  >
                    <td>{item.incidentNumber || "N/A"}</td>
                    <td>{item.requester || "N/A"}</td>
                    <td>{item.requesterFor || "N/A"}</td>
                    <td>{item.category || "N/A"}</td>
                    <td>{item.subCategory || "N/A"}</td>
                    <td>{item.status || "Open"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default HrmsHome;
