import ItLeftSide from "../../../ItLeftSide";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchApiData } from "../../../../../../utils/apiClient";
import CaseTable from "../../../../../../components/CaseTable";
import "./index.css";

function ReqOnboardingAllTab({ filterStatus }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusFromPath = () => {
    if (filterStatus) return filterStatus;
    const p = location.pathname.toLowerCase();
    if (p.includes("/requests-onboarding-open") || p.includes("/onboarding/open")) return "Open";
    if (p.includes("/requests-onboarding-resolved") || p.includes("/onboarding/resolved")) return "Resolved";
    if (p.includes("/requests-onboarding-closed") || p.includes("/onboarding/closed")) return "Closed";
    if (p.includes("/requests-onboarding-wip") || p.includes("/onboarding/work-in-progress")) return "Work In Progress";
    if (p.includes("/requests-onboarding-pending") || p.includes("/onboarding/pending")) return "Pending";
    return null;
  };

  const activeFilterStatus = getStatusFromPath();

  useEffect(() => {
    fetchData();
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

  const fetchData = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");
      const allItems = response.data || [];
      let filtered = allItems.filter(
        (item) =>
          item.category === "Onboarding" ||
          item.category === "onboarding" ||
          item.category === "Resonance Requirement" ||
          item.onboardingTaskId ||
          item.taskType === "IT Onboarding"
      );
      if (filtered.length === 0) filtered = allItems;

      if (activeFilterStatus) {
        const s = activeFilterStatus.toLowerCase().replace(/\s+/g, "");
        filtered = filtered.filter((item) => {
          const st = (item.onboardingStatus || item.status || "Open").toLowerCase().replace(/\s+/g, "");
          return st === s || st.includes(s) || (s === "workinprogress" && (st === "wip" || st.includes("progress")));
        });
      }

      setData(sortNewestFirst(filtered));
    } catch (error) {
      console.error(error);
    }
  };

  const headingText = activeFilterStatus
    ? `IT Onboarding Requests (${activeFilterStatus})`
    : "IT Onboarding Requests (All)";

  return (
    <ItLeftSide>
      <CaseTable
        title={headingText}
        data={data}
        onRowClick={(item) => navigate(`/requests-onboarding-saves/${item._id}`)}
        emptyMessage="No Onboarding Requests Found"
      />
    </ItLeftSide>
  );
}

export default ReqOnboardingAllTab;
