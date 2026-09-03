import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountsLayout from "../../AccountsLayout";
import { fetchApiData } from "../../../../utils/apiClient";
import CaseTable from "../../../../components/CaseTable";
import "../../../Hrms/HRSavesCases/index.css";

function AccountsWipCases() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWipCases();
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

  const fetchWipCases = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");
      const list = (response.data || []).filter((item) => {
        const grp = (item.assignmentGroup || "").toUpperCase();
        const isAccountsGrp = grp.includes("ACC") || grp.includes("FINANCE");
        const isWip = (item.status || "").toLowerCase().includes("progress");
        return isAccountsGrp && isWip;
      });

      setData(sortNewestFirst(list));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AccountsLayout>
      <CaseTable
        title="Accounts Cases (Work In Progress)"
        data={data}
        onRowClick={(item) => navigate(`/accounts/cases/${item._id}`)}
        emptyMessage="No Work In Progress Accounts Cases Found"
      />
    </AccountsLayout>
  );
}

export default AccountsWipCases;
