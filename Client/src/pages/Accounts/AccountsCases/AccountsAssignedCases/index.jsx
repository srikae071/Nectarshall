import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountsLayout from "../../AccountsLayout";
import { fetchApiData } from "../../../../utils/apiClient";
import CaseTable from "../../../../components/CaseTable";
import "../../../Hrms/HRSavesCases/index.css";

function AccountsAssignedCases() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedCases();
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

  const fetchAssignedCases = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");
      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }

      const username = (authUser?.username || authUser?.name || authUser?.displayName || "").toLowerCase().trim();

      const list = (response.data || []).filter((item) => {
        const grp = (item.assignmentGroup || "").toUpperCase();
        const isAccountsGrp = grp.includes("ACC") || grp.includes("FINANCE");
        if (!isAccountsGrp) return false;

        const assigned = (item.assignedTo || item.assignTo || "").toLowerCase().trim();
        const statusMatch = (item.status || "").toLowerCase().includes("assigned");
        return statusMatch || (username && assigned && (assigned.includes(username) || username.includes(assigned)));
      });

      setData(sortNewestFirst(list));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AccountsLayout>
      <CaseTable
        title="Accounts Cases (Assigned to Me)"
        data={data}
        onRowClick={(item) => navigate(`/accounts/cases/${item._id}`)}
        emptyMessage="No Cases Assigned to You"
      />
    </AccountsLayout>
  );
}

export default AccountsAssignedCases;
