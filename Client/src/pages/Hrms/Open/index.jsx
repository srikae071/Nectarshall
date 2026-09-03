import HrmsLeftLayout from "../Hrmsleftlayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { fetchApiData } from "../../../utils/apiClient";
import { checkHasHrAccess } from "../../../context/AuthContext";
import CaseTable from "../../../components/CaseTable";

function Open() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchOpenCases();
  }, []);

  const sortNewestFirst = (arr) => {
    return [...arr].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      const numA = parseInt((a.incidentNumber || a.caseId || "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt((b.incidentNumber || b.caseId || "").replace(/\D/g, ""), 10) || 0;
      if (numA !== numB) return numB - numA;
      return String(b._id || "").localeCompare(String(a._id || ""));
    });
  };

  const fetchOpenCases = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");
      const hrCases = (response.data || []).filter(
        (item) => !item.assignmentGroup || item.assignmentGroup.trim() === "" || item.assignmentGroup.toUpperCase() === "HR"
      );
      const openCases = sortNewestFirst(
        hrCases.filter((item) => (item.status || "Open").toLowerCase() === "open")
      );

      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }

      const isHrOrAdmin = checkHasHrAccess(authUser);

      if (isHrOrAdmin) {
        setData(openCases);
      } else if (authUser) {
        const u = (authUser?.username || authUser?.name || authUser?.displayName || "").toLowerCase().trim();
        setData(
          openCases.filter((item) => {
            const r1 = (item.requester || "").toLowerCase();
            const r2 = (item.requesterFor || "").toLowerCase();
            const r3 = (item.assignedTo || "").toLowerCase();
            return r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2.includes(u) || r3.includes(u);
          })
        );
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HrmsLeftLayout>
      <CaseTable
        title="HR Cases (Open)"
        data={data}
        onRowClick={(item) => navigate(`/hrms/HRsaves/${item._id}`)}
        emptyMessage="No Open HR Cases Found"
      />
    </HrmsLeftLayout>
  );
}

export default Open;
