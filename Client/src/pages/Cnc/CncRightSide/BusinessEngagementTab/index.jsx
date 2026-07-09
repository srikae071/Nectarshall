import { useState, useEffect } from "react";
import axios from "axios";
import CncLeftLayout from "../../CncLeftLayout";
import TableLayout1 from "../../../../components/Layouts/TableLayouts/TableLayout1";
import { useNavigate } from "react-router-dom";
function BusinessEngagementTab() {
  const defaultColumns = ["clientId", "requester", "requesterFor", "abn"];
  const navigate = useNavigate();
  const allColumns = [
    { key: "clientId", label: "Client ID" },
    { key: "requester", label: "Requester Name" },
    { key: "requesterFor", label: "Requester For" },
    { key: "abn", label: "ABN" },

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
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding",
      );

      setData(response.data.filter((item) => item.category === "Request"));
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

              {visibleColumns.includes("abn") && <td>{item.abn}</td>}
            </tr>
          ))
        }
      </TableLayout1>
    </CncLeftLayout>
  );
}

export default BusinessEngagementTab;
