import { useState, useEffect, useMemo } from "react";
import React from "react";
import TableLayout1 from "../../../../components/Layouts/TableLayouts/TableLayout1";
import { useNavigate } from "react-router-dom";
import {
  fetchApiData,
  sendApiData,
  extractArrayData,
} from "../../../../utils/apiClient";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessEngagement();
  }, []);

  const fetchBusinessEngagement = async () => {
    try {
      setLoading(true);
      const response = await fetchApiData("/api/BoardingCandidates");
      const allCandidates = extractArrayData(response.data);
      console.log("BoardingCandidates loaded from localhost 5000:", allCandidates);
      setData(allCandidates);
    } catch (error) {
      console.error("Error fetching BoardingCandidates in Operations Client Onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await sendApiData(
        `/api/BoardingCandidates/${id}`,
        {
          operationsClientApproved: true,
        },
        "put"
      );

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, operationsClientApproved: true } : item
        )
      );

      alert("Approved Successfully");
    } catch (error) {
      console.error("Error approving candidate:", error);
      alert("Approval Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await sendApiData(
        `/api/BoardingCandidates/${id}`,
        {
          operationsClientApproved: false,
        },
        "put"
      );

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, operationsClientApproved: false } : item
        )
      );

      alert("Rejected Successfully");
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      alert("Reject Failed");
    }
  };

  const filteredData = useMemo(() => {
    if (!search || !search.trim()) return data;
    const q = search.trim().toLowerCase();
    return data.filter((item) => {
      const clientId = String(item.clientId || "").toLowerCase();
      const requester = String(item.requester || "").toLowerCase();
      const requesterFor = String(item.requesterFor || "").toLowerCase();
      const abn = String(item.abn || "").toLowerCase();
      const companyName = String(item.companyName || "").toLowerCase();
      const status = String(item.status || "").toLowerCase();
      return (
        clientId.includes(q) ||
        requester.includes(q) ||
        requesterFor.includes(q) ||
        abn.includes(q) ||
        companyName.includes(q) ||
        status.includes(q)
      );
    });
  }, [data, search]);

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {loading ? (
        <div style={{ padding: "20px", fontWeight: "bold" }}>
          Loading Boarding Candidates data...
        </div>
      ) : (
        <TableLayout1
          title="Onboarding Client"
          storageKey="operationsClientOnboarding"
          search={search}
          setSearch={setSearch}
          allColumns={allColumns}
          defaultColumns={defaultColumns}
        >
          {(visibleColumns) =>
            filteredData.map((row) => (
              <tr key={row._id || row.id}>
                {visibleColumns.map((key) => {
                  if (key === "actions") {
                    return (
                      <td key={key}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/onboarding-saves/${row._id}?source=operations`
                              );
                            }}
                          >
                            Action
                          </button>

                          {row.operationsClientApproved ? (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(row._id);
                              }}
                              style={{
                                backgroundColor: "#2e7d32",
                                borderColor: "#2e7d32",
                                color: "white",
                              }}
                            >
                              ✓ Approved
                            </button>
                          ) : (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(row._id);
                              }}
                              style={{
                                backgroundColor: "#ed6c02",
                                borderColor: "#ed6c02",
                                color: "white",
                              }}
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  }

                  return <td key={key}>{row[key] || "-"}</td>;
                })}
              </tr>
            ))
          }
        </TableLayout1>
      )}
    </div>
  );
}

export default OprationsClientOnbTab;
