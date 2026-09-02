import React from "react";
import "./index.css";

function AuditTimeline({ data, module }) {
  if (!data) return null;

  const formatDate = (dateVal) => {
    if (!dateVal) return null;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const fallbackCreatedTime = formatDate(data.createdAt) || formatDate(new Date());

  // 1. Build initial milestones if timeline array is not populated yet
  const defaultMilestones = [
    {
      title: "Request Created / Submitted",
      module: "HRMS",
      by: data.requesterName || data.requester || "System User",
      time: formatDate(data.createdAt) || fallbackCreatedTime,
      status: "Submitted",
      badgeBg: "#e0f2fe",
      badgeColor: "#0369a1",
      icon: "📝",
    },
  ];

  if (data.approvedAt || data.approvedBy || data.status === "Approved" || data.approvalStatus === "Approved") {
    defaultMilestones.push({
      title: "Request Approved",
      module: "HRMS",
      by: data.approvedBy || "Admin",
      time: formatDate(data.approvedAt) || fallbackCreatedTime,
      status: data.approvalStatus || data.status || "Approved",
      badgeBg: "#dcfce7",
      badgeColor: "#15803d",
      icon: "✅",
    });
  }

  if (data.itStatusUpdatedAt || data.itDetailsUpdatedAt || data.itStatus || data.itClearanceStatus || data.laptopRecovered) {
    defaultMilestones.push({
      title: "IT Clearance Update",
      module: "IT",
      by: data.itStatusUpdatedBy || "IT Specialist",
      time: formatDate(data.itStatusUpdatedAt || data.itDetailsUpdatedAt) || fallbackCreatedTime,
      status: data.itClearanceStatus || data.itStatus || data.ItTAskStatus || "Open",
      details: data.laptopRecovered ? `Laptop Recovered: ${data.laptopRecovered}` : null,
      badgeBg: "#dbeafe",
      badgeColor: "#1d4ed8",
      icon: "💻",
    });
  }

  if (data.financeStatusUpdatedAt || data.financeClearanceStatus || data.financeStatus) {
    defaultMilestones.push({
      title: "Finance Clearance Update",
      module: "ACCOUNTS",
      by: data.financeStatusUpdatedBy || "Finance Admin",
      time: formatDate(data.financeStatusUpdatedAt) || fallbackCreatedTime,
      status: data.financeClearanceStatus || data.financeStatus || "Open",
      badgeBg: "#fef3c7",
      badgeColor: "#b45309",
      icon: "💰",
    });
  }

  if (data.hrStatusUpdatedAt || data.hrClearanceStatus || data.hrStatus) {
    defaultMilestones.push({
      title: "HR Clearance Update",
      module: "HRMS",
      by: data.hrStatusUpdatedBy || "HR Manager",
      time: formatDate(data.hrStatusUpdatedAt) || fallbackCreatedTime,
      status: data.hrClearanceStatus || data.hrStatus || "Open",
      details: data.relievingLetterIssued ? `Relieving Letter Issued: ${data.relievingLetterIssued}, Backup Hired: ${data.backupHired || 'No'}` : null,
      badgeBg: "#f3e8ff",
      badgeColor: "#7e22ce",
      icon: "📋",
    });
  }

  // 2. Parse backend timeline entries or use milestones
  let rawList = (Array.isArray(data.timeline) && data.timeline.length > 0)
    ? data.timeline.map((item) => {
        const itemModule = item.module || (item.action.includes("IT") ? "IT" : item.action.includes("Finance") ? "ACCOUNTS" : "HRMS");
        let badgeBg = "#f1f5f9";
        let badgeColor = "#334155";
        let icon = "⏱️";

        if (itemModule === "IT") {
          badgeBg = "#dbeafe";
          badgeColor = "#1d4ed8";
          icon = "💻";
        } else if (itemModule === "ACCOUNTS") {
          badgeBg = "#fef3c7";
          badgeColor = "#b45309";
          icon = "💰";
        } else if (item.action.includes("Approved")) {
          badgeBg = "#dcfce7";
          badgeColor = "#15803d";
          icon = "✅";
        } else if (itemModule === "HRMS") {
          badgeBg = "#f3e8ff";
          badgeColor = "#7e22ce";
          icon = "📋";
        }

        return {
          title: item.action,
          module: itemModule,
          by: item.performedBy || "System User",
          time: formatDate(item.timestamp) || fallbackCreatedTime,
          details: item.details,
          status: item.status || "Recorded",
          badgeBg,
          badgeColor,
          icon,
        };
      })
    : defaultMilestones;

  // 3. Filter by Module if specified (e.g. module="IT")
  if (module && module.toUpperCase() === "IT") {
    rawList = rawList.filter(
      (item) =>
        item.module === "IT" ||
        item.title.toLowerCase().includes("it") ||
        item.title.includes("Submitted") ||
        item.title.includes("Approved")
    );
  } else if (module && module.toUpperCase() === "ACCOUNTS") {
    rawList = rawList.filter(
      (item) =>
        item.module === "ACCOUNTS" ||
        item.title.toLowerCase().includes("finance") ||
        item.title.toLowerCase().includes("account") ||
        item.title.includes("Submitted") ||
        item.title.includes("Approved")
    );
  }

  return (
    <div
      className="AuditTimelineCard"
      style={{
        borderRadius: "12px",
        padding: "24px",
        marginTop: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>⏱️</span>
          <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
            {module ? `${module.toUpperCase()} Activity Audit Timeline` : "Activity & Status Timestamp Audit Log"}
          </h4>
        </div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#64748b",
            background: "#f1f5f9",
            padding: "4px 10px",
            borderRadius: "12px",
          }}
        >
          {rawList.length} Action Event{rawList.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div style={{ position: "relative", paddingLeft: "28px", borderLeft: "3px solid #cbd5e1", marginLeft: "14px" }}>
        {rawList.map((item, idx) => (
          <div key={idx} style={{ marginBottom: "24px", position: "relative" }}>
            {/* Timeline Dot */}
            <div
              style={{
                position: "absolute",
                left: "-38px",
                top: "2px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: item.badgeBg || "#e2e8f0",
                border: `2px solid ${item.badgeColor || "#94a3b8"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
              }}
            >
              {item.icon || "•"}
            </div>

            <div
              className="AuditTimelineItem"
              style={{
                borderRadius: "8px",
                padding: "14px 18px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>
                  {item.title}
                </span>

                {item.status && (
                  <span
                    style={{
                      background: item.badgeBg || "#e2e8f0",
                      color: item.badgeColor || "#1e293b",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {item.status}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "8px", fontSize: "13px", color: "#475569" }}>
                <span>👤 <strong>Performed By:</strong> {item.by}</span>
                <span>🕒 <strong>Timestamp:</strong> {item.time}</span>
              </div>

              {item.details && (
                <div
                  className="AuditTimelineDetails"
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#334155",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  ℹ️ {item.details}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditTimeline;
