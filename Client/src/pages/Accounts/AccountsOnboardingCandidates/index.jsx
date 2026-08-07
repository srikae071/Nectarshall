import { useState, useEffect, useMemo } from "react";
import React from "react";

import TableLayout1 from "../../../components/Layouts/TableLayouts/TableLayout1";
import { useNavigate } from "react-router-dom";

import {
  fetchApiData,
  sendApiData,
  extractArrayData,
} from "../../../utils/apiClient";
import "./index.css";

function AccountsOnboardingCandidates() {
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
      console.log(
        "BoardingCandidates loaded for Accounts Onboarding Candidates:",
        allCandidates,
      );
      setData(allCandidates);
    } catch (error) {
      console.error(
        "Error fetching BoardingCandidates in Accounts Client Onboarding:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await sendApiData(
        `/api/BoardingCandidates/${id}`,
        {
          accountsApproved: true,
          status: "Approved",
        },
        "put",
      );

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, accountsApproved: true, status: "Approved" } : item,
        ),
      );

      alert("Accounts Approved Successfully");
    } catch (error) {
      console.error("Error approving candidate in Accounts:", error);
      alert("Accounts Approval Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await sendApiData(
        `/api/BoardingCandidates/${id}`,
        {
          accountsApproved: false,
          status: "Rejected",
        },
        "put",
      );

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, accountsApproved: false, status: "Rejected" } : item,
        ),
      );

      alert("Accounts Rejected Successfully");
    } catch (error) {
      console.error("Error rejecting candidate in Accounts:", error);
      alert("Accounts Reject Failed");
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
          Loading Accounts Boarding Candidates data...
        </div>
      ) : (
        <TableLayout1
          title="Accounts Onboarding Client Candidates"
          storageKey="accountsClientOnboarding"
          search={search}
          setSearch={setSearch}
          allColumns={allColumns}
          defaultColumns={defaultColumns}
        >
          {(visibleColumns) =>
            filteredData.map((row) => (
              <tr
                key={row._id || row.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/onboarding-saves/${row._id}?source=accounts`, {
                    state: { source: "accounts" },
                  })
                }
              >
                {visibleColumns.map((key) => {
                  if (key === "actions") {
                    return (
                      <td key={key} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {row.accountsApproved === true ? (
                            <button
                              className="btn btn-success btn-sm"
                              style={{
                                backgroundColor: "#16a34a",
                                borderColor: "#16a34a",
                                color: "white",
                                fontWeight: "700",
                                padding: "6px 14px",
                                borderRadius: "4px",
                                cursor: "default",
                              }}
                            >
                              ✓ Approved
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(row._id);
                                }}
                                style={{
                                  backgroundColor: "#16a34a",
                                  borderColor: "#16a34a",
                                  color: "white",
                                  fontWeight: "700",
                                  padding: "6px 14px",
                                  borderRadius: "4px",
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(row._id);
                                }}
                                style={{
                                  backgroundColor: "#dc2626",
                                  borderColor: "#dc2626",
                                  color: "white",
                                  fontWeight: "700",
                                  padding: "6px 14px",
                                  borderRadius: "4px",
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    );
                  }

                  if (key === "status") {
                    const statusVal = row.accountsApproved === true
                      ? "Approved"
                      : row.accountsApproved === false
                      ? "Rejected"
                      : row.status || "Pending";
                    return (
                      <td key={key}>
                        <span
                          className={`badge ${statusVal.toLowerCase()}`}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "700",
                            background:
                              statusVal === "Approved"
                                ? "#dcfce7"
                                : statusVal === "Rejected"
                                ? "#fee2e2"
                                : "#fef3c7",
                            color:
                              statusVal === "Approved"
                                ? "#166534"
                                : statusVal === "Rejected"
                                ? "#991b1b"
                                : "#92400e",
                          }}
                        >
                          {statusVal}
                        </span>
                      </td>
                    );
                  }

                  return <td key={key}>{row[key]}</td>;
                })}
              </tr>
            ))
          }
        </TableLayout1>
      )}
    </div>
  );
}

export default AccountsOnboardingCandidates;
