import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ItLeftSide from "../../../ItLeftSide";
import { fetchApiData } from "../../../../../../utils/apiClient";
import "./index.css";

function RequestsOffboardingAll({ filterStatus }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusFromPath = () => {
    if (filterStatus) return filterStatus;
    const p = location.pathname.toLowerCase();
    if (p.includes("/requests-offboarding-open") || p.includes("/offboarding/open")) return "Open";
    if (p.includes("/requests-offboarding-resolved") || p.includes("/offboarding/resolved")) return "Resolved";
    if (p.includes("/requests-offboarding-closed") || p.includes("/offboarding/closed")) return "Closed";
    if (p.includes("/requests-offboarding-wip") || p.includes("/offboarding/work-in-progress")) return "Work In Progress";
    if (p.includes("/requests-offboarding-pending") || p.includes("/offboarding/pending")) return "Pending";
    return null;
  };

  const activeFilterStatus = getStatusFromPath();

  useEffect(() => {
    fetchRequests();
  }, [location.pathname]);

  const fetchRequests = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");
      let filtered = (response.data || []).filter(
        (item) =>
          item.category === "Offboarding" ||
          item.category === "offboarding" ||
          item.category === "Exit" ||
          item.taskType === "IT Clearance"
      );

      if (activeFilterStatus) {
        const s = activeFilterStatus.toLowerCase().replace(/\s+/g, "");
        filtered = filtered.filter((item) => {
          const tStatus = (item.itStatus || item.itClearanceStatus || item.ItTAskStatus || item.taskStatus || "Open")
            .toLowerCase()
            .replace(/\s+/g, "");
          return tStatus === s || tStatus.includes(s) || (s === "workinprogress" && (tStatus === "wip" || tStatus.includes("progress")));
        });
      }

      setData(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  const headingText = activeFilterStatus
    ? `IT Offboarding Requests (${activeFilterStatus})`
    : "IT Offboarding Requests (All)";

  return (
    <ItLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">{headingText}</h3>

          <table className="opentable">
            <thead>
              <tr className="opentablerow">
                <th>Task ID</th>
                <th>Requester</th>
                <th>Resignation Date</th>
                <th>Last Working Day</th>
                <th>Resignation Reason</th>
                <th>IT Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/tasksaves/${item._id}`)}
                  >
                    <td>{item.taskId || `TSK-${String(idx + 1).padStart(3, "0")}`}</td>
                    <td>{item.requesterName || item.requester || "N/A"}</td>
                    <td>{item.resignationDate ? new Date(item.resignationDate).toLocaleDateString() : "N/A"}</td>
                    <td>{item.lastWorkingDay ? new Date(item.lastWorkingDay).toLocaleDateString() : "N/A"}</td>
                    <td>{item.resignationReason || item.description || "N/A"}</td>
                    <td>{item.itStatus || item.itClearanceStatus || item.ItTAskStatus || item.taskStatus || "Open"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Offboarding Records Found {activeFilterStatus ? `for status: ${activeFilterStatus}` : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ItLeftSide>
  );
}

export default RequestsOffboardingAll;
