import CncLeftLayout from "../../../../Cnc/CncLeftLayout";
import TableLayout1 from "../../../../../components/Layouts/TableLayouts/TableLayout1";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

function OnBoardingSupplierTab() {
  const defaultColumns = [
    "clientId",
    "companyName",
    "emailAddress",
    "onboardingDate",
    "validTill",
    "status",
  ];

  const allColumns = [
    { key: "clientId", label: "Client ID" },
    { key: "companyName", label: "Company Name" },
    { key: "emailAddress", label: "Email Address" },
    { key: "onboardingDate", label: "Onboarding Date" },
    { key: "validTill", label: "Valid Till" },
    { key: "status", label: "Status" },

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
  const [showSettings, setShowSettings] = useState(false);

  const settingsRef = useRef(null);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("boardingColumns");
    return saved ? JSON.parse(saved) : defaultColumns;
  });

  useEffect(() => {
    fetchBoarding();
  }, []);

  useEffect(() => {
    localStorage.setItem("boardingColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBoarding = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding",
      );

      setData(
        response.data.filter((item) => item.category === "Supplier Onboarding"),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter((item) =>
    item.clientId?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleColumn = (key) => {
    if (defaultColumns.includes(key)) return;

    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  return (
    <CncLeftLayout>
      <TableLayout1
        title="Supplier Onboarding"
        search={search}
        setSearch={setSearch}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        settingsRef={settingsRef}
        headers={allColumns.filter((col) => visibleColumns.includes(col.key))}
        settingsContent={
          <>
            {allColumns
              .filter((col) => !defaultColumns.includes(col.key))
              .map((column) => (
                <label key={column.key} className="ONBSCheckbox">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => toggleColumn(column.key)}
                  />
                  {column.label}
                </label>
              ))}
          </>
        }
      >
        {filteredData.map((item) => (
          <tr key={item._id}>
            {visibleColumns.includes("clientId") && <td>{item.clientId}</td>}

            {visibleColumns.includes("companyName") && (
              <td>{item.companyName}</td>
            )}

            {visibleColumns.includes("emailAddress") && (
              <td>{item.emailAddress}</td>
            )}

            {visibleColumns.includes("onboardingDate") && (
              <td>{item.onboardingDate?.slice(0, 10)}</td>
            )}

            {visibleColumns.includes("validTill") && (
              <td>{item.validTill?.slice(0, 10)}</td>
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
        ))}
      </TableLayout1>
    </CncLeftLayout>
  );
}

export default OnBoardingSupplierTab;
