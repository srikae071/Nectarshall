import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountsLayout from "../../AccountsLayout";
import { fetchApiData } from "../../../../utils/apiClient";
import CaseTable from "../../../../components/CaseTable";
import "../../../Hrms/HRSavesCases/index.css";

function AccountsOpenCases() {
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
      const list = (response.data || []).filter((item) => {
        const grp = (item.assignmentGroup || "").toUpperCase();
        const isAcc = grp.includes("ACC") || grp.includes("FINANCE");
        const isOpen = (item.status || "Open").toLowerCase() === "open";
        return isAcc && isOpen;
      });

      setData(sortNewestFirst(list));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AccountsLayout>
      <CaseTable
        title="Accounts Cases (Open)"
        data={data}
        onRowClick={(item) => navigate(`/accounts/cases/${item._id}`)}
        emptyMessage="No Open Accounts Cases Found"
      />
    </AccountsLayout>
  );
}

export default AccountsOpenCases;
