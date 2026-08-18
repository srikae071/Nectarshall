import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiX,
  FiChevronRight,
  FiMessageSquare,
} from "react-icons/fi";
import { fetchApiData } from "../../../utils/apiClient";
import { StatusBadge, PriorityBadge, fmtDate, CaseDetailDrawer } from "./index";

const ALL_CASE_COLUMNS = [
  { key: "id", label: "INCIDENT NUMBER", width: "15%" },
  { key: "requester", label: "REQUESTER", width: "16%" },
  { key: "category", label: "CATEGORY", width: "15%" },
  { key: "priority", label: "PRIORITY", width: "12%" },
  { key: "impact", label: "IMPACT", width: "12%" },
  { key: "status", label: "STATUS", width: "14%" },
  { key: "lastUpdate", label: "LAST UPDATED", width: "14%" },
  { key: "action", label: "ACTIONS", width: "10%" },
];

const CaseList = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // Column Settings state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_CASE_COLUMNS.map((c) => c.key)
  );

  const filterType = decodeURIComponent(type || "all");

  useEffect(() => {
    fetchHrCases();
  }, []);

  const fetchHrCases = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/hrrequests");
      const mapped = (res.data || []).map((item, index) => ({
        id: item.incidentNumber || `HR-${String(index + 1).padStart(3, "0")}`,
        subject:
          item.shortDescription ||
          item.description ||
          `${item.category || "HR Case"} - ${item.requester || "Requester"}`,
        requester: item.requester || item.requesterName || "N/A",
        requesterFor: item.requesterFor || "N/A",
        category: item.category || "General",
        subCategory: item.subCategory || "N/A",
        priority: item.priority || item.urgency || "No Priority",
        impact: item.impact || "N/A",
        assignmentGroup: item.assignmentGroup || "N/A",
        assignTo: item.assignTo || "N/A",
        status: item.status || "Open",
        created: item.createdAt
          ? new Date(item.createdAt).toISOString().split("T")[0]
          : "",
        lastUpdate: item.updatedAt
          ? new Date(item.updatedAt).toISOString().split("T")[0]
          : "",
        description:
          item.description ||
          item.shortDescription ||
          "No description available.",
      }));
      setCases(mapped);
    } catch (err) {
      console.error("Error loading cases in CaseList:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (key) => {
    if (visibleColumns.includes(key)) {
      if (visibleColumns.length === 1) return;
      setVisibleColumns(visibleColumns.filter((c) => c !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  const displayCases = cases.filter((c) => {
    if (filterType.toLowerCase() === "all") return true;
    return (
      c.status.toLowerCase() === filterType.toLowerCase() ||
      (filterType.toLowerCase() === "in progress" &&
        c.status.toLowerCase().includes("progress"))
    );
  });

  const filtered = displayCases.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.requester.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const getTitle = () => {
    if (filterType.toLowerCase() === "all") return "All HR Cases";
    return `${filterType} Cases`;
  };

  return (
    <div
      className="vendor-dashboard-wrapper"
      style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <button
          onClick={() => navigate("/vendor-portal/cases")}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#fff",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <FiArrowLeft size={18} />
        </button>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                margin: "0 0 4px 0",
                color: "#0f172a",
                textTransform: "capitalize",
              }}
            >
              {getTitle()}
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              Showing {filtered.length} case{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Icon-Only Settings Button */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "15px",
                color: "#334155",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
              title="Settings"
            >
              ⚙️
            </button>
            <div style={{ position: "relative", width: 320 }}>
              <FiSearch
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
                size={16}
              />
              <input
                type="text"
                placeholder="Search by incident number or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 40px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  fontSize: 14,
                  outline: "none",
                  color: "#0f172a",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #f1f5f9",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        {loading ? (
          <div
            style={{ textAlign: "center", padding: "60px", color: "#64748b" }}
          >
            Loading cases from HR Request database...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "60px", color: "#64748b" }}
          >
            No cases match your filters.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {ALL_CASE_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        width: col.width,
                        padding: "14px 16px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        textAlign: col.key === "action" ? "right" : "left",
                        visibility: visibleColumns.includes(col.key)
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background 0.2s",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelected(c)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f8fafc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        width: "15%",
                        padding: "16px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#ea4104",
                        visibility: visibleColumns.includes("id")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {c.id}
                    </td>
                    <td
                      style={{
                        width: "16%",
                        padding: "16px",
                        fontSize: 13,
                        color: "#0f172a",
                        fontWeight: 600,
                        visibility: visibleColumns.includes("requester")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {c.requester}
                    </td>
                    <td
                      style={{
                        width: "15%",
                        padding: "16px",
                        fontSize: 13,
                        color: "#475569",
                        visibility: visibleColumns.includes("category")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {c.category}
                    </td>
                    <td
                      style={{
                        width: "12%",
                        padding: "16px",
                        visibility: visibleColumns.includes("priority")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td
                      style={{
                        width: "12%",
                        padding: "16px",
                        fontSize: 13,
                        color: "#475569",
                        visibility: visibleColumns.includes("impact")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {c.impact}
                    </td>
                    <td
                      style={{
                        width: "14%",
                        padding: "16px",
                        visibility: visibleColumns.includes("status")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      <StatusBadge status={c.status} />
                    </td>
                    <td
                      style={{
                        width: "14%",
                        padding: "16px",
                        fontSize: 13,
                        color: "#475569",
                        visibility: visibleColumns.includes("lastUpdate")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {fmtDate(c.lastUpdate)}
                    </td>
                    <td
                      style={{
                        width: "10%",
                        padding: "16px",
                        textAlign: "right",
                        visibility: visibleColumns.includes("action")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ea4104",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 13,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        <FiChevronRight size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settings Modal for Case Column Customizer */}
      {showSettingsModal && (
        <div className="po-overlay" onClick={() => setShowSettingsModal(false)}>
          <div
            className="po-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 420,
              padding: 24,
              borderRadius: 12,
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                ⚙️ Settings
              </h3>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
                onClick={() => setShowSettingsModal(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                marginTop: 0,
                marginBottom: 20,
              }}
            >
              Select which case table columns you want to display on your
              screen.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {ALL_CASE_COLUMNS.map((col) => (
                <label
                  key={col.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#0f172a",
                    cursor: "pointer",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: visibleColumns.includes(col.key)
                      ? "#f8fafc"
                      : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: "#ea4104",
                      cursor: "pointer",
                    }}
                  />
                  <span>{col.label}</span>
                </label>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "#ea4104",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Apply & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <CaseDetailDrawer c={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default CaseList;
