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

const CaseList = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

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
          <FiArrowLeft size={20} />
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

      {/* Case List Table */}
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
            style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
          >
            Loading cases from HR Request database...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <FiMessageSquare
              size={48}
              color="#cbd5e1"
              style={{ marginBottom: 16 }}
            />
            <h3 style={{ fontSize: 18, color: "#0f172a", margin: "0 0 8px 0" }}>
              No cases found
            </h3>
            <p style={{ color: "#64748b", margin: 0 }}>
              We couldn't find any cases matching your search criteria in the
              database.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    INCIDENT NUMBER
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    REQUESTER
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    CATEGORY
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    PRIORITY
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    IMPACT
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    STATUS
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    LAST UPDATED
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      textAlign: "right",
                    }}
                  >
                    ACTIONS
                  </th>
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
                        padding: "16px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#ea4104",
                      }}
                    >
                      {c.id}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: 13,
                        color: "#0f172a",
                        fontWeight: 600,
                      }}
                    >
                      👤 {c.requester}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      {c.category}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      {c.impact}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <StatusBadge status={c.status} />
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      {fmtDate(c.lastUpdate)}
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
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

      {selected && (
        <CaseDetailDrawer c={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default CaseList;
