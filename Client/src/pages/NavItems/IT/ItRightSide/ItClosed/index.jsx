import ItLeftSide from "../../ItLeftSide";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchApiData } from "../../../../../utils/apiClient";
import CaseTable from "../../../../../components/CaseTable";
import "./index.css";

function ItClosed() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
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

  const fetchRequests = async () => {
    try {
      const response = await fetchApiData("/api/itrequests");
      const closedCases = (response.data || []).filter(
        (item) => (item.status || "").toLowerCase() === "closed"
      );
      setData(sortNewestFirst(closedCases));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ItLeftSide>
      <CaseTable
        title="IT Closed Cases"
        data={data}
        onRowClick={(item) => navigate(`/hrms/itsaves/${item._id}`)}
        emptyMessage="No Closed IT Cases Found"
      />
    </ItLeftSide>
  );
}

export default ItClosed;
