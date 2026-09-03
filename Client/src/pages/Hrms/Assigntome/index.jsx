import HrmsLeftLayout from "../Hrmsleftlayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "./index.css";

import { fetchApiData } from "../../../utils/apiClient";
import CaseTable from "../../../components/CaseTable";

function Assigntome() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAssingtomecases();
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

  const fetchAssingtomecases = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");
      const unfiltered = (response.data || []).filter(
        (item) => !item.assignmentGroup || item.assignmentGroup.trim() === "" || item.assignmentGroup.toUpperCase() === "HR"
      );
      const list = sortNewestFirst(unfiltered);

      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }

      const username = (authUser?.username || authUser?.name || authUser?.displayName || "").toLowerCase().trim();

      if (username) {
        setData(
          list.filter((item) => {
            const assigned = (item.assignedTo || item.assignTo || "").toLowerCase().trim();
            const statusMatch = (item.status || "").toLowerCase().includes("assigned");
            return statusMatch || (assigned && (assigned.includes(username) || username.includes(assigned)));
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
        title="HR Cases (Assigned to Me)"
        data={data}
        onRowClick={(item) => navigate(`/hrms/HRsaves/${item._id}`)}
        emptyMessage="No Cases Assigned to You"
      />
    </HrmsLeftLayout>
  );
}

export default Assigntome;
