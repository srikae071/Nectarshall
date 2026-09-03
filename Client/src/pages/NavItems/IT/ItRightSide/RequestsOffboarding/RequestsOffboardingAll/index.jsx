import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ItLeftSide from "../../../ItLeftSide";
import { fetchApiData } from "../../../../../../utils/apiClient";
import CaseTable from "../../../../../../components/CaseTable";
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

  const sortNewestFirst = (arr) => {
    return [...arr].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      const numA = parseInt((a.incidentNumber || a.caseId || a.taskId || "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt((b.incidentNumber || b.caseId || a.taskId || "").replace(/\D/g, ""), 10) || 0;
      if (numA !== numB) return numB - numA;
      return String(b._id || "").localeCompare(String(a._id || ""));
    });
  };

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

      setData(sortNewestFirst(filtered));
    } catch (error) {
      console.log(error);
    }
  };

  const headingText = activeFilterStatus
    ? `IT Offboarding Requests (${activeFilterStatus})`
    : "IT Offboarding Requests (All)";

  return (
    <ItLeftSide>
      <CaseTable
        title={headingText}
        data={data}
        onRowClick={(item) => navigate(`/requests-offboarding-saves/${item._id}`)}
        emptyMessage="No Offboarding Requests Found"
      />
    </ItLeftSide>
  );
}

export default RequestsOffboardingAll;
