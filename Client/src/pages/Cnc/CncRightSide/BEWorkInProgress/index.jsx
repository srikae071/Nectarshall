import { useState, useEffect } from "react";
import axios from "axios";
import CncLeftLayout from "../../CncLeftLayout";
import TableLayout1 from "../../../../components/Layouts/TableLayouts/TableLayout1";
import { useNavigate } from "react-router-dom";
import { fetchApiData } from "../../../../utils/apiClient";

function BEWorkInProgress() {
  const defaultColumns = ["clientId", "requester", "requesterFor", "status"];
  const navigate = useNavigate();
  const allColumns = [
    { key: "clientId", label: "Client ID" },
    { key: "requester", label: "Requester Name" },
    { key: "requesterFor", label: "Requested For" },
    { key: "abn", label: "ABN" },
    { key: "status", label: "Status" },
    { key: "companyName", label: "Company Name" },
    { key: "acn", label: "ACN" },
    { key: "companyAddress", label: "Company Address" },
    { key: "companyPhone", label: "Company Phone" },
    { key: "managingAgentName", label: "Managing Agent Name" },
    { key: "managingAgentEmail", label: "Managing Agent Email" },
    { key: "shortDescription", label: "Short Description" },
    { key: "description", label: "Description" },
  ];

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBusinessEngagement();
  }, []);

  const fetchBusinessEngagement = async () => {
    try {
      const response = await fetchApiData("/api/boarding");

      setData(
        response.data.filter(
          (item) =>
            item.category === "Request" && item.status === "Work In Progress",
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };
  // Dummy data (replace with API later)

  const filteredData = data.filter(
    (item) =>
      item.clientId?.toLowerCase().includes(search.toLowerCase()) ||
      item.requester?.toLowerCase().includes(search.toLowerCase()) ||
      item.requesterFor?.toLowerCase().includes(search.toLowerCase()) ||
      item.abn?.toLowerCase().includes(search.toLowerCase()),
  );
  console.log(filteredData);
  return (
    <CncLeftLayout>
      <TableLayout1
        title="Business Engagement"
        storageKey="businessEngagementColumns"
        search={search}
        setSearch={setSearch}
        defaultColumns={defaultColumns}
        allColumns={allColumns}
      >
        {(visibleColumns) =>
          filteredData.map((item) => (
            <tr
              key={item._id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/onboarding-saves/${item._id}`)}
            >
              {visibleColumns.includes("clientId") && <td>{item.clientId}</td>}

              {visibleColumns.includes("requester") && (
                <td>{item.requester}</td>
              )}

              {visibleColumns.includes("requesterFor") && (
                <td>{item.requesterFor}</td>
              )}

              {visibleColumns.includes("status") && <td>{item.status}</td>}

              {visibleColumns.includes("companyName") && (
                <td>{item.companyName}</td>
              )}

              {visibleColumns.includes("acn") && <td>{item.acn}</td>}
              {visibleColumns.includes("abn") && <td>{item.abn}</td>}

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

export default BEWorkInProgress;
