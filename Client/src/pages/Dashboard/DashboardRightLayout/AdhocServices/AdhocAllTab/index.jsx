import TableLayout1 from "../../../../../components/Layouts/TableLayouts/TableLayout1";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import { fetchApiData, extractArrayData } from "../../../../../utils/apiClient";

function AdhocAllTab() {
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
        const firstContract = item.contractDeliverables?.[0];
        return firstContract?.adhoc === "Yes" || (item.adhocServices && item.adhocServices.length > 0);
      });

      setData(filtered.length > 0 ? filtered : allCandidates);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter((item) =>
    item.clientId?.toLowerCase().includes(search.toLowerCase()) ||
    item.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <TableLayout1
        title="Client Onboarding (Adhoc)"
        storageKey="adhocBoardingColumns"
        search={search}
        onSearchChange={setSearch}
        allColumns={allColumns}
        defaultColumns={defaultColumns}
        data={filteredData}
        renderRow={(row, selectedKeys) => (
          <tr key={row._id}>
            {selectedKeys.map((key) => (
              <td key={key}>{row[key] || "-"}</td>
            ))}
          </tr>
        )}
      />
    </div>
  );
}

export default AdhocAllTab;
