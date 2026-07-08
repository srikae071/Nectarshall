import { useState, useEffect } from "react";
import axios from "axios";
import CncLeftLayout from "../../CncLeftLayout";
import TableLayout1 from "../../../../components/Layouts/TableLayouts/TableLayout1";

function BusinessEngagementTab() {
  const defaultColumns = ["requesterName", "requester"];

  const allColumns = [
    {
      key: "requester",
      label: "Requester Name",
    },
    {
      key: "requesterFor",
      label: "Requester",
    },
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

      setData(response.data.filter((item) => item.category === "Home"));
    } catch (error) {
      console.log(error);
    }
  };
  // Dummy data (replace with API later)

  const filteredData = data.filter(
    (item) =>
      item.requesterName?.toLowerCase().includes(search.toLowerCase()) ||
      item.requester?.toLowerCase().includes(search.toLowerCase()),
  );

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
            <tr key={item._id}>
              {visibleColumns.includes("requester") && (
                <td>{item.requester}</td>
              )}

              {visibleColumns.includes("requesterFor") && (
                <td>{item.requesterFor}</td>
              )}
            </tr>
          ))
        }
      </TableLayout1>
    </CncLeftLayout>
  );
}

export default BusinessEngagementTab;
