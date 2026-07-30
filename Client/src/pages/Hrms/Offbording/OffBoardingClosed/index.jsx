import CncLeftLayout from "../../../Cnc/CncLeftLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import { fetchApiData } from "../../../../utils/apiClient";

function OffBoardingClosed() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");

      const filteredData = response.data.filter(
        (item) =>
          item.category === "Offboarding" && item.taskStatus === "Closed",
        // (item.status === "Open" || item.status === "Approved"),
      );

      setData(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (item) => {
    navigate(`/offboarding-saves/${item._id}`);
  };

  return (
    <CncLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Closed</h3>
          <table className="opentable">
            <thead>
              <tr className="opentablerow">
                <th>Case ID</th>
                <th>Requester</th>
                <th>Resignation Date</th>
                <th>Last Working Day</th>
                <th>Resignation Reason</th>
                <th>Status</th>
                <th>Task Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Records Found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.caseId}</td>
                    <td>{item.requesterName}</td>
                    <td>{item.resignationDate}</td>
                    <td>{item.lastWorkingDay}</td>
                    <td>{item.resignationReason}</td>
                    <td>{item.status}</td>
                    <td>{item.taskStatus}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CncLeftLayout>
  );
}

export default OffBoardingClosed;
