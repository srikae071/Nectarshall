import HrmsLeftLayout from "../../Hrmsleftlayout";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";

import { fetchApiData } from "../../../../utils/apiClient";

function OffBoardingEmployesAll({ filterStatus }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusFromPath = () => {
    if (filterStatus) return filterStatus;
    const p = location.pathname.toLowerCase();
    if (p.includes("/offboarding-open") || p.includes("/offboarding/open")) return "Open";
    if (p.includes("/offboarding-resolved") || p.includes("/offboarding/resolved")) return "Resolved";
    if (p.includes("/offboarding-closed") || p.includes("/offboarding/closed")) return "Closed";
    if (p.includes("/offboarding-wip") || p.includes("/offboarding/work-in-progress")) return "Work In Progress";
    if (p.includes("/offboarding-pending") || p.includes("/offboarding/pending")) return "Pending";
    return null;
  };

  const activeFilterStatus = getStatusFromPath();

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");

      let filteredData = (response.data || []).filter(
        (item) =>
          item.category === "Offboarding" ||
          item.category === "offboarding" ||
          item.category === "Exit" ||
          item.taskType === "IT Clearance"
      );

      if (activeFilterStatus) {
        const s = activeFilterStatus.toLowerCase().replace(/\s+/g, "");
        filteredData = filteredData.filter((item) => {
          const tStatus = (item.taskStatus || item.ItTAskStatus || item.status || "Open")
            .toLowerCase()
            .replace(/\s+/g, "");
          return tStatus === s || tStatus.includes(s);
        });
      }

      setData(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (item) => {
    navigate(`/offboarding-saves/${item._id}`);
  };

  const headingText = activeFilterStatus
    ? `Offboarding Requests (${activeFilterStatus})`
    : "Offboarding Requests (All)";

  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">{headingText}</h3>
          <table className="opentable">
            <thead>
              <tr className="opentablerow">
                <th>Case ID</th>
                <th>Requester</th>
                <th>Resignation Date</th>
                <th>Last Working Day</th>
                <th>Resignation Reason</th>
                <th>Task Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Records Found {activeFilterStatus ? `for status: ${activeFilterStatus}` : ""}
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.caseId || item.taskId || item.jobRequestId || `OFF-${String(idx + 1).padStart(3, "0")}`}</td>
                    <td>{item.requesterName || item.requester || item.name || "N/A"}</td>
                    <td>
                      {item.resignationDate
                        ? new Date(item.resignationDate).toLocaleDateString()
                        : item.startDate || "N/A"}
                    </td>
                    <td>
                      {item.lastWorkingDay
                        ? new Date(item.lastWorkingDay).toLocaleDateString()
                        : item.endDate || "N/A"}
                    </td>
                    <td>{item.resignationReason || item.reason || item.description || "N/A"}</td>
                    <td>{item.taskStatus || item.ItTAskStatus || item.status || "Open"}</td>
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

export default OffBoardingEmployesAll;
