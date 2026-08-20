import HrmsLeftLayout from "../../Hrmsleftlayout";
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

      const filteredData = (response.data || []).filter(
        (item) =>
          (item.category === "Offboarding" ||
            item.category === "offboarding" ||
            item.category === "Exit") &&
          (item.taskStatus === "Closed" ||
            item.status === "Closed" ||
            item.status === "Resolved"),
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
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Closed Offboarding Cases</h3>
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
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No Records Found
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.caseId || item.jobRequestId || `OFF-${String(idx + 1).padStart(3, "0")}`}</td>
                    <td>{item.requesterName || item.requester || item.name || "N/A"}</td>
                    <td>{item.resignationDate || item.startDate || "N/A"}</td>
                    <td>{item.lastWorkingDay || item.endDate || "N/A"}</td>
                    <td>{item.resignationReason || item.reason || item.description || "N/A"}</td>
                    <td>{item.status || "Open"}</td>
                    <td>{item.taskStatus || "Closed"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default OffBoardingClosed;
