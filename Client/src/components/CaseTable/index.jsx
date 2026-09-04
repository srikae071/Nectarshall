import { useState, useRef, useEffect } from "react";
import { FiSearch, FiSettings } from "react-icons/fi";
import "./index.css";

const ALL_COLUMNS = [
  { key: "incidentNumber", label: "Incident ID", default: true },
  { key: "department", label: "Department", default: true },
  { key: "requester", label: "Requester", default: true },
  { key: "requesterFor", label: "Requested For", default: true },
  { key: "category", label: "Category", default: true },
  { key: "subCategory", label: "Sub Category", default: true },
  { key: "status", label: "Status", default: true },
  { key: "requestType", label: "Type", default: false },
  { key: "assignmentGroup", label: "Assignment Group", default: false },
  { key: "assignTo", label: "Assign To", default: false },
  { key: "impact", label: "Impact", default: false },
  { key: "urgency", label: "Urgency", default: false },
  { key: "priority", label: "Priority", default: false },
  { key: "createdOn", label: "Created On", default: true },
  { key: "shortDescription", label: "Short Description", default: false },
  { key: "description", label: "Description", default: false },
  { key: "workNotes", label: "Work Notes", default: false },
];

function CaseTable({
  title = "Cases",
  data = [],
  onRowClick = null,
  emptyMessage = "No Cases Found",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    ALL_COLUMNS.filter((c) => c.default).map((c) => c.key)
  );

  const settingsRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, k]
    );
  };

  const formatCreatedOn = (item) => {
    const val = item?.createdAt || item?.createdOn || item?.timestamp;
    if (!val) return "N/A";
    try {
      const d = new Date(val);
      return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
    } catch (e) {
      return "N/A";
    }
  };

  const getCellValue = (item, key) => {
    if (key === "createdOn") return formatCreatedOn(item);
    if (key === "incidentNumber") return item.incidentNumber || item.caseId || item.taskId || "N/A";
    if (key === "requester") return item.requester || item.requesterName || "N/A";
    if (key === "requesterFor") return item.requesterFor || "N/A";
    if (key === "assignTo") return item.assignTo || item.assignedTo || "N/A";
    if (key === "department") {
      const deptVal = (item.department || item.requestType || "IT").toUpperCase();
      const isHR = deptVal === "HR";
      return (
        <span className={isHR ? "TicketBadgeHR" : "TicketBadgeIT"}>
          {item.department || item.requestType || "IT"}
        </span>
      );
    }
    if (key === "requestType") {
      const typeStr = item.requestType || (item.assignmentGroup === "IT" ? "IT" : "HR");
      return (
        <span className={typeStr === "IT" ? "TicketBadgeIT" : "TicketBadgeHR"}>
          {typeStr}
        </span>
      );
    }
    return item[key] || "N/A";
  };

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const req = (item.requester || item.requesterName || "").toLowerCase();
    const reqFor = (item.requesterFor || "").toLowerCase();
    const inc = (item.incidentNumber || item.caseId || item.taskId || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();
    const subCat = (item.subCategory || "").toLowerCase();
    const st = (item.status || "").toLowerCase();
    const desc = (item.shortDescription || item.description || "").toLowerCase();
    const typeStr = (item.requestType || "").toLowerCase();

    return (
      req.includes(q) ||
      reqFor.includes(q) ||
      inc.includes(q) ||
      cat.includes(q) ||
      subCat.includes(q) ||
      st.includes(q) ||
      desc.includes(q) ||
      typeStr.includes(q)
    );
  });

  const visibleColumnsList = ALL_COLUMNS.filter((c) => selectedColumns.includes(c.key));

  return (
    <div className="CaseTableContainer">
      {/* TOOLBAR */}
      <div className="CaseTableToolbar">
        <h3 className="CaseTableTitle">{title}</h3>

        <div className="CaseTableControls">
          {/* SEARCH BAR */}
          <div className="CaseSearchWrapper">
            <FiSearch className="CaseSearchIcon" />
            <input
              type="text"
              className="CaseSearchInput"
              placeholder="Search by requester, ID, status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* SETTINGS BUTTON */}
          <div className="CaseSettingsWrapper" ref={settingsRef}>
            <button
              type="button"
              className="CaseSettingsBtn"
              onClick={() => setShowSettings(!showSettings)}
              title="Column Settings"
            >
              <FiSettings /> Settings
            </button>

            {showSettings && (
              <div className="CaseSettingsDropdown">
                <div className="CaseSettingsTitle">Select Columns to Display:</div>
                {ALL_COLUMNS.map((col) => (
                  <label key={col.key} className="CaseSettingsOption">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="CaseTableWrapper">
        <table className="CaseTableMain">
          <thead>
            <tr>
              {visibleColumnsList.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr
                  key={item._id || idx}
                  className="CaseTableRow"
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {visibleColumnsList.map((col) => (
                    <td key={col.key}>{getCellValue(item, col.key)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumnsList.length} className="NoCasesCell">
                  {searchQuery ? "No matching cases found" : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CaseTable;
