import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AccountsLayout from "../AccountsLayout";
import TableLayout1 from "../../../components/Layouts/TableLayouts/TableLayout1";
import { fetchApiData } from "../../../utils/apiClient";

const allColumns = [
  { key: "caseId", label: "Task / Case ID" },
  { key: "candidateName", label: "Candidate / Employee Name" },
  { key: "department", label: "Department" },
  { key: "offerStatus", label: "Offer Status" },
  { key: "financeStatus", label: "Finance Status" },
];

const defaultColumns = [
  "caseId",
  "candidateName",
  "department",
  "offerStatus",
  "financeStatus",
];

function AccountsOnboardingRequest({ filterStatus }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusFromPath = () => {
    if (filterStatus) return filterStatus;
    const p = location.pathname.toLowerCase();
    if (p.includes("/accounts/onboarding-request/open")) return "Open";
    if (p.includes("/accounts/onboarding-request/resolved")) return "Resolved";
    if (p.includes("/accounts/onboarding-request/closed")) return "Closed";
    if (p.includes("/accounts/onboarding-request/wip") || p.includes("/work-in-progress")) return "Work In Progress";
    if (p.includes("/accounts/onboarding-request/pending")) return "Pending";
    return null;
  };

  const activeFilterStatus = getStatusFromPath();

  useEffect(() => {
    fetchRequests();
  }, [location.pathname]);

  const fetchRequests = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");
      let filtered = (response.data || []).filter(
        (item) =>
          item.category === "Onboarding" ||
          item.category === "onboarding" ||
          item.category === "Employee Request" ||
          item.category === "Candidate Onboarding"
      );

      if (activeFilterStatus) {
        const s = activeFilterStatus.toLowerCase().replace(/\s+/g, "");
        filtered = filtered.filter((item) => {
          const st = (item.financeStatus || item.status || "Open")
            .toLowerCase()
            .replace(/\s+/g, "");
          return st === s || st.includes(s) || (s === "workinprogress" && (st === "wip" || st.includes("progress")));
        });
      }

      setData(filtered);
    } catch (error) {
      console.error("Error fetching accounts onboarding requests:", error);
    }
  };

  const filteredData = data.filter((item) => {
    const q = search.toLowerCase();
    const cId = (item.caseId || item.taskId || "").toLowerCase();
    const name = (item.firstName ? `${item.firstName} ${item.lastName}` : item.requesterName || "").toLowerCase();
    return cId.includes(q) || name.includes(q);
  });

  const headingText = activeFilterStatus
    ? `Accounts Onboarding Requests (${activeFilterStatus})`
    : "Accounts Onboarding Requests (All)";

  return (
    <AccountsLayout>
      <TableLayout1
        title={headingText}
        search={search}
        setSearch={setSearch}
        allColumns={allColumns}
        defaultColumns={defaultColumns}
        storageKey="accountsOnboardingColumns"
      >
        {filteredData.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
              No Onboarding Records Found {activeFilterStatus ? `for status: ${activeFilterStatus}` : ""}
            </td>
          </tr>
        ) : (
          filteredData.map((item, idx) => {
            const candidateName =
              item.firstName && item.lastName
                ? `${item.firstName} ${item.lastName}`
                : item.requesterName || item.employeeName || "N/A";
            const finStatus = item.financeStatus || item.status || "Open";

            return (
              <tr
                key={item._id || idx}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/onboarding/employerequest`)}
              >
                <td style={{ fontWeight: "700", color: "#2563eb" }}>
                  {item.caseId || item.taskId || `HRY-${String(idx + 1).padStart(3, "0")}`}
                </td>
                <td>{candidateName}</td>
                <td>{item.department || "Operations"}</td>
                <td>{item.offerStatus || "ACCEPTED"}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "12px",
                      background: finStatus.toLowerCase().includes("resolved") || finStatus.toLowerCase().includes("closed")
                        ? "#dcfce7"
                        : finStatus.toLowerCase().includes("progress") || finStatus.toLowerCase().includes("wip")
                        ? "#dbeafe"
                        : "#fef3c7",
                      color: finStatus.toLowerCase().includes("resolved") || finStatus.toLowerCase().includes("closed")
                        ? "#166534"
                        : finStatus.toLowerCase().includes("progress") || finStatus.toLowerCase().includes("wip")
                        ? "#1e40af"
                        : "#92400e",
                    }}
                  >
                    {finStatus}
                  </span>
                </td>
              </tr>
            );
          })
        )}
      </TableLayout1>
    </AccountsLayout>
  );
}

export default AccountsOnboardingRequest;
