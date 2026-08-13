import CncLeftLayout from "../../../../../Cnc/CncLeftLayout";
import TableLayout1 from "../../../../../../components/Layouts/TableLayouts/TableLayout1";
import { fetchApiData, extractArrayData } from "../../../../../../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// import "./index.css";

function OnbCOnBoarded() {
  const navigate = useNavigate();
  const defaultColumns = ["clientId", "companyName", "emailAddress", "status"];

  const allColumns = [
    { key: "clientId", label: "Client ID" },
    { key: "companyName", label: "Company Name" },
    { key: "emailAddress", label: "Email Address" },

    { key: "status", label: "Status" },
    { key: "onboardingDate", label: "Onboarding Date" },
    { key: "abn", label: "ABN" },
    { key: "acn", label: "ACN" },
    { key: "companyAddress", label: "Company Address" },
    { key: "companyPhone", label: "Company Phone" },
    { key: "managingAgentName", label: "Managing Agent Name" },
    { key: "managingAgentEmail", label: "Managing Agent Email" },
    { key: "managingAgentNumber", label: "Managing Agent Number" },
    { key: "shortDescription", label: "Short Description" },
    { key: "description", label: "Description" },
  ];

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBoarding();
  }, []);

  const fetchBoarding = async () => {
    try {
      const response = await fetchApiData("/api/BoardingCandidates");
      const allCandidates = extractArrayData(response.data);

      const filtered = allCandidates.filter((item) => {
        const catStr = (item.category || "").trim().toLowerCase();
        const statusStr = (item.status || "").trim().toLowerCase();
        const isClientOnb = catStr === "" || catStr.includes("client") || catStr.includes("onboarding");
        const isOnBoarded = statusStr === "on boarded" || statusStr === "onboarded" || statusStr.includes("board");
        return isClientOnb && isOnBoarded;
      });

      setData(filtered.length > 0 ? filtered : allCandidates);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter((item) =>
    item.clientId?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <CncLeftLayout>
      <TableLayout1
        title="Client Onboarding"
        storageKey="boardingColumns"
        search={search}
        setSearch={setSearch}
        defaultColumns={defaultColumns}
        allColumns={allColumns}
      >
        {(visibleColumns) =>
          filteredData.map((item) => (
            <tr
              key={item._id}
              onClick={() => navigate(`/onboarding-saves/${item._id}`)}
              style={{ cursor: "pointer" }}
            >
              {visibleColumns.includes("clientId") && <td>{item.clientId}</td>}

              {visibleColumns.includes("companyName") && (
                <td>{item.companyName}</td>
              )}

              {visibleColumns.includes("emailAddress") && (
                <td>{item.managingAgentName}</td>
              )}

              {visibleColumns.includes("onboardingDate") && (
                <td>{item.onboardingDate?.slice(0, 10)}</td>
              )}

              {visibleColumns.includes("status") && <td>{item.status}</td>}
              {visibleColumns.includes("abn") && <td>{item.abn}</td>}

              {visibleColumns.includes("acn") && <td>{item.acn}</td>}

              {visibleColumns.includes("companyAddress") && (
                <td>{item.companyAddress}</td>
              )}

              {visibleColumns.includes("companyPhone") && (
                <td>{item.companyPhone}</td>
              )}

              {visibleColumns.includes("managingAgentName") && (
                <td>{item.managingAgentName}</td>
              )}

              {visibleColumns.includes("managingAgentEmail") && (
                <td>{item.managingAgentEmail}</td>
              )}

              {visibleColumns.includes("managingAgentNumber") && (
                <td>{item.managingAgentNumber}</td>
              )}

              {visibleColumns.includes("shortDescription") && (
                <td>{item.shortDescription}</td>
              )}

              {visibleColumns.includes("description") && (
                <td>{item.description}</td>
              )}
            </tr>
          ))
        }
      </TableLayout1>
    </CncLeftLayout>
  );
}

export default OnbCOnBoarded;
