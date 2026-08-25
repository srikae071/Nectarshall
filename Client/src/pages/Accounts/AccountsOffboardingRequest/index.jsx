import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AccountsLayout from "../AccountsLayout";
import TableLayout1 from "../../../components/Layouts/TableLayouts/TableLayout1";
import { fetchApiData } from "../../../utils/apiClient";
import "./index.css";

const allColumns = [
  { key: "taskId", label: "Task ID" },
  { key: "requesterName", label: "Requester Name" },
  { key: "resignationDate", label: "Resignation Date" },
  { key: "lastWorkingDay", label: "Last Working Day" },
  { key: "resignationReason", label: "Resignation Reason" },
  { key: "financeStatus", label: "Finance Clearance Status" },
];

const defaultColumns = [
  "taskId",
  "requesterName",
  "resignationDate",
  "lastWorkingDay",
  "resignationReason",
  "financeStatus",
];

function AccountsOffboardingRequest({ filterStatus }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusFromPath = () => {
    if (filterStatus) return filterStatus;
    const p = location.pathname.toLowerCase();
    if (p.includes("/accounts/offboarding-request/open")) return "Open";
    if (p.includes("/accounts/offboarding-request/resolved")) return "Resolved";
    if (p.includes("/accounts/offboarding-request/closed")) return "Closed";
    if (p.includes("/accounts/offboarding-request/wip") || p.includes("/work-in-progress")) return "Work In Progress";
    if (p.includes("/accounts/offboarding-request/pending")) return "Pending";
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
          item.category === "Offboarding" ||
          item.category === "offboarding" ||
          item.category === "Exit" ||
          item.taskType === "IT Clearance" ||
          item.taskType === "Accounts Clearance"
      );

      if (activeFilterStatus) {
        const s = activeFilterStatus.toLowerCase().replace(/\s+/g, "");
        filtered = filtered.filter((item) => {
          const st = (item.financeStatus || item.financeClearanceStatus || item.status || "Open")
            .toLowerCase()
            .replace(/\s+/g, "");
          return st === s || st.includes(s) || (s === "workinprogress" && (st === "wip" || st.includes("progress")));
        });
      }

      setData(filtered);
    } catch (error) {
      console.error("Error fetching accounts offboarding requests:", error);
    }
  };

  const filteredData = data.filter((item) => {
    const q = search.toLowerCase();
    const tId = (item.taskId || "").toLowerCase();
    const req = (item.requesterName || item.requester || "").toLowerCase();
    const reason = (item.resignationReason || item.description || "").toLowerCase();
    return tId.includes(q) || req.includes(q) || reason.includes(q);
  });

  const headingText = activeFilterStatus
    ? `Accounts Offboarding Requests (${activeFilterStatus})`
    : "Accounts Offboarding Requests (All)";

  return (
    <AccountsLayout>
      <TableLayout1
        title={headingText}
        search={search}
        setSearch={setSearch}
        allColumns={allColumns}
        defaultColumns={defaultColumns}
        storageKey="accountsOffboardingColumns"
      >
        {filteredData.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
              No Offboarding Records Found {activeFilterStatus ? `for status: ${activeFilterStatus}` : ""}
            </td>
          </tr>
        ) : (
          filteredData.map((item, idx) => {
            const finStatus = item.financeStatus || item.financeClearanceStatus || "Open";
            return (
              <tr
                key={item._id || idx}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/accounts/task-saves/${item._id}`)}
              >
                <td style={{ fontWeight: "700", color: "#2563eb" }}>
                  {item.taskId || `TSK-${String(idx + 1).padStart(3, "0")}`}
                </td>
                <td>{item.requesterName || item.requester || "N/A"}</td>
                <td>{item.resignationDate ? new Date(item.resignationDate).toLocaleDateString() : "N/A"}</td>
                <td>{item.lastWorkingDay ? new Date(item.lastWorkingDay).toLocaleDateString() : "N/A"}</td>
                <td>{item.resignationReason || item.description || "N/A"}</td>
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

export default AccountsOffboardingRequest;
