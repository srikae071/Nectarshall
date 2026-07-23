import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import DashboardLayout from "../../DashboardLayout";
import TableLayout1 from "../../../../components/Layouts/TableLayouts/TableLayout1";
import { useNavigate } from "react-router-dom";
import "./index.css";
function OprationsClientOnbTab() {
  const defaultColumns = [
    "clientId",
    "requester",
    "requesterFor",
    "status",
    "actions",
  ];
  const navigate = useNavigate();
  const allColumns = [
    { key: "clientId", label: "Client ID" },
    { key: "requester", label: "Requester Name" },
    { key: "requesterFor", label: "Requester For" },

    { key: "status", label: "Status" },
    { key: "abn", label: "ABN" },
    { key: "companyName", label: "Company Name" },
    { key: "acn", label: "ACN" },
    { key: "companyAddress", label: "Company Address" },
    { key: "companyPhone", label: "Company Phone" },
    { key: "managingAgentName", label: "Managing Agent Name" },
    { key: "managingAgentEmail", label: "Managing Agent Email" },
    { key: "shortDescription", label: "Short Description" },
    { key: "description", label: "Description" },
    { key: "actions", label: "Actions" },
  ];

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBusinessEngagement();
  }, []);

  const fetchBusinessEngagement = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates",
      );

      setData(
        response.data.filter(
          (item) =>
            item.category === "Client Onboarding" &&
            item.status == "On Boarded",
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };
  // Dummy data (replace with API later)
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding/${id}`,
        {
          operationsClientApproved: true,
        },
      );

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, operationsClientApproved: true } : item,
        ),
      );

      alert("Approved Successfully");
    } catch (error) {
      console.log(error);
      alert("Approval Failed");
    }
  };
  const handleReject = async (id) => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding/${id}`,
        {
          operationsClientApproved: false,
        },
      );

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, operationsClientApproved: false } : item,
        ),
      );

      alert("Rejected Successfully");
    } catch (error) {
      console.log(error);
      alert("Reject Failed");
    }
  };
  const filteredData = data.filter(
    (item) =>
      item.clientId?.toLowerCase().includes(search.toLowerCase()) ||
      item.requester?.toLowerCase().includes(search.toLowerCase()) ||
      item.requesterFor?.toLowerCase().includes(search.toLowerCase()) ||
      item.abn?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
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
          <React.Fragment key={item._id}>
            <tr
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/onboarding-saves/${item._id}`, {
                  state: { source: "operations" },
                })
              }
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

            <tr className="operationsApprovalRow">
              <td colSpan={visibleColumns.length}>
                <div className="operationsApprovalBox">
                  {item.operationsClientApproved === true ? (
                    <span className="approvedText">Approved</span>
                  ) : item.operationsClientApproved === false ? (
                    <span className="rejectedText">Rejected</span>
                  ) : (
                    <>
                      <button
                        className="approveBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(item._id);
                        }}
                      >
                        Approve
                      </button>

                      <button
                        className="rejectBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(item._id);
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          </React.Fragment>
        ))
      }
    </TableLayout1>
  );
}

export default OprationsClientOnbTab;
