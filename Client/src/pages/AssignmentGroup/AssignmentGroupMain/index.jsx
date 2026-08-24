import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { fetchApiData } from "../../../utils/apiClient";
import { useAuth } from "../../../context/AuthContext";
import "./index.css";

const INITIAL_ASSIGNMENT_DATA = [
  // IT DEPARTMENT TICKETS
  {
    id: "ASG-IT-001",
    requester: "Rahul Sharma",
    assignmentGroup: "IT",
    category: "Hardware & Laptop Access",
    shortDescription: "New developer laptop configuration and VPN credentials",
    priority: "High",
    assignedTo: "Sumit (IT Lead)",
    createdDate: "2026-08-10",
    status: "In Progress",
  },
  {
    id: "ASG-IT-002",
    requester: "Priya Patel",
    assignmentGroup: "IT",
    category: "Software License",
    shortDescription: "Request for Figma Professional & VSCode extensions",
    priority: "Medium",
    assignedTo: "Karan (IT Support)",
    createdDate: "2026-08-11",
    status: "Open",
  },
  {
    id: "ASG-IT-003",
    requester: "Amit Kumar",
    assignmentGroup: "IT",
    category: "Network & Wifi",
    shortDescription: "Wi-Fi bandwidth congestion on 4th floor workstation",
    priority: "Low",
    assignedTo: "Unassigned",
    createdDate: "2026-08-12",
    status: "Open",
  },
  {
    id: "ASG-IT-004",
    requester: "Srikar Verma",
    assignmentGroup: "IT",
    category: "Security & Passwords",
    shortDescription: "Multi-Factor Authentication (MFA) reset request",
    priority: "High",
    assignedTo: "Sumit (IT Lead)",
    createdDate: "2026-08-13",
    status: "Resolved",
  },

  // HR DEPARTMENT TICKETS
  {
    id: "ASG-HR-101",
    requester: "Ananya Roy",
    assignmentGroup: "HR",
    category: "Onboarding & Offer Letter",
    shortDescription: "Pre-joining compliance document verification for CND-002",
    priority: "High",
    assignedTo: "Karan (HR Specialist)",
    createdDate: "2026-08-09",
    status: "In Progress",
  },
  {
    id: "ASG-HR-102",
    requester: "Vikram Malhotra",
    assignmentGroup: "HR",
    category: "Leave Management Query",
    shortDescription: "Annual Leave balance audit and rollover confirmation",
    priority: "Medium",
    assignedTo: "Rahul (HR Lead)",
    createdDate: "2026-08-10",
    status: "Open",
  },
  {
    id: "ASG-HR-103",
    requester: "Neha Gupta",
    assignmentGroup: "HR",
    category: "Employee Offboarding",
    shortDescription: "Clearance certificate and exit interview scheduling",
    priority: "High",
    assignedTo: "Karan (HR Specialist)",
    createdDate: "2026-08-11",
    status: "Open",
  },
  {
    id: "ASG-HR-104",
    requester: "Rohan Singh",
    assignmentGroup: "HR",
    category: "Organisation Policies",
    shortDescription: "Clarification on hybrid remote work policy guidelines",
    priority: "Low",
    assignedTo: "Unassigned",
    createdDate: "2026-08-13",
    status: "Resolved",
  },

  // ACCOUNTS DEPARTMENT TICKETS
  {
    id: "ASG-ACC-201",
    requester: "Kavita Reddy",
    assignmentGroup: "Accounts",
    category: "Payroll & Salary Slips",
    shortDescription: "July Tax File Number (TFN) tax deduction query",
    priority: "High",
    assignedTo: "Srikar (Accounts Lead)",
    createdDate: "2026-08-08",
    status: "In Progress",
  },
  {
    id: "ASG-ACC-202",
    requester: "Suresh Menon",
    assignmentGroup: "Accounts",
    category: "Expense Reimbursement",
    shortDescription: "Client dinner expense invoice claim ($245.50)",
    priority: "Medium",
    assignedTo: "Srikar (Accounts Lead)",
    createdDate: "2026-08-10",
    status: "Open",
  },
  {
    id: "ASG-ACC-203",
    requester: "Deepak Joshi",
    assignmentGroup: "Accounts",
    category: "Superannuation & Bank Details",
    shortDescription: "Superannuation Fund BSB & Member Account update",
    priority: "High",
    assignedTo: "Unassigned",
    createdDate: "2026-08-12",
    status: "Open",
  },
];

function AssignmentGroupMain() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(INITIAL_ASSIGNMENT_DATA);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL | IT | HR | Accounts
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Column settings
  const [columns, setColumns] = useState({
    id: true,
    requester: true,
    assignmentGroup: true,
    category: true,
    priority: true,
    assignedTo: true,
    createdDate: true,
    status: true,
    actions: true,
  });

  useEffect(() => {
    fetchLiveTickets();
  }, []);

  const fetchLiveTickets = async () => {
    try {
      // Attempt fetching from backend endpoints
      const [itRes, hrRes, leaveRes] = await Promise.allSettled([
        fetchApiData("/api/it-cases"),
        fetchApiData("/api/hr-cases"),
        fetchApiData("/api/leaves"),
      ]);

      let fetchedItems = [];

      if (itRes.status === "fulfilled" && Array.isArray(itRes.value?.data)) {
        const liveIt = itRes.value.data.map((item, idx) => ({
          id: item.ticketNumber || `ASG-IT-L${idx + 1}`,
          requester: item.requesterName || item.requester || "Employee",
          assignmentGroup: "IT",
          category: item.category || "IT Support",
          shortDescription: item.shortDescription || item.description || "IT Case",
          priority: item.urgency || item.priority || "Medium",
          assignedTo: item.assignedTo || "IT Team",
          createdDate: item.createdDate || "2026-08-12",
          status: item.status || "Open",
        }));
        fetchedItems = [...fetchedItems, ...liveIt];
      }

      if (hrRes.status === "fulfilled" && Array.isArray(hrRes.value?.data)) {
        const liveHr = hrRes.value.data.map((item, idx) => ({
          id: item.ticketNumber || `ASG-HR-L${idx + 1}`,
          requester: item.requesterName || item.requester || "Employee",
          assignmentGroup: "HR",
          category: item.category || "HR Support",
          shortDescription: item.shortDescription || item.description || "HR Case",
          priority: item.urgency || item.priority || "Medium",
          assignedTo: item.assignedTo || "HR Team",
          createdDate: item.createdDate || "2026-08-11",
          status: item.status || "Open",
        }));
        fetchedItems = [...fetchedItems, ...liveHr];
      }

      if (fetchedItems.length > 0) {
        setTickets([...fetchedItems, ...INITIAL_ASSIGNMENT_DATA]);
      }
    } catch (err) {
      console.log("Using initial assignment group data:", err);
    }
  };

  // Status badge update helper
  const handleStatusChange = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  // Filter by Tab
  const tabFiltered = tickets.filter((t) => {
    if (activeTab === "ALL") return true;
    return (t.assignmentGroup || "").toUpperCase() === activeTab.toUpperCase();
  });

  // Filter by Search
  const filteredTickets = tabFiltered.filter((t) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      (t.id || "").toLowerCase().includes(s) ||
      (t.requester || "").toLowerCase().includes(s) ||
      (t.assignmentGroup || "").toLowerCase().includes(s) ||
      (t.category || "").toLowerCase().includes(s) ||
      (t.shortDescription || "").toLowerCase().includes(s) ||
      (t.assignedTo || "").toLowerCase().includes(s) ||
      (t.status || "").toLowerCase().includes(s)
    );
  });

  // Counts for tabs
  const countAll = tickets.length;
  const countIT = tickets.filter((t) => t.assignmentGroup === "IT").length;
  const countHR = tickets.filter((t) => t.assignmentGroup === "HR").length;
  const countAcc = tickets.filter((t) => t.assignmentGroup === "Accounts").length;

  const visibleColumnCount = Object.values(columns).filter(Boolean).length || 1;

  return (
    <div className="asgWrapper">
      <Navbar />

      <div className="asgContainer">
        {/* HEADER TITLE BAR */}
        <div className="asgHeader">
          <div>
            <h2 className="asgTitle">🏢 Assignment Group Management</h2>
            <p className="asgSubtitle">
              Centralized ticket assignment and routing for IT, HR, and Accounts departments
            </p>
          </div>

          {/* TOP CONTROLS: SEARCH & SETTINGS */}
          <div className="asgControls">
            <input
              type="text"
              placeholder="🔍 Search assignment tickets..."
              className="asgSearchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="asgSettingsBtn"
                onClick={() => setShowSettings(!showSettings)}
                title="Table Column Settings"
              >
                ⚙️ Settings
              </button>

              {showSettings && (
                <div className="asgSettingsDropdown">
                  <div className="asgSettingsTitle">⚙️ Display Columns:</div>
                  {Object.entries({
                    id: "Ticket ID",
                    requester: "Requester",
                    assignmentGroup: "Assignment Group",
                    category: "Category / Details",
                    priority: "Priority",
                    assignedTo: "Assigned To",
                    createdDate: "Created Date",
                    status: "Status",
                    actions: "Actions",
                  }).map(([key, label]) => (
                    <label key={key} className="asgCheckboxLabel">
                      <input
                        type="checkbox"
                        checked={columns[key]}
                        onChange={() =>
                          setColumns((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DEPARTMENT SUB-TABS */}
        <div className="asgTabContainer">
          <button
            type="button"
            className={`asgTabBtn ${activeTab === "ALL" ? "active" : ""}`}
            onClick={() => setActiveTab("ALL")}
          >
            🌐 All Assignments ({countAll})
          </button>
          <button
            type="button"
            className={`asgTabBtn it-tab ${activeTab === "IT" ? "active" : ""}`}
            onClick={() => setActiveTab("IT")}
          >
            💻 IT Table ({countIT})
          </button>
          <button
            type="button"
            className={`asgTabBtn hr-tab ${activeTab === "HR" ? "active" : ""}`}
            onClick={() => setActiveTab("HR")}
          >
            👥 HR Table ({countHR})
          </button>
          <button
            type="button"
            className={`asgTabBtn acc-tab ${activeTab === "Accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("Accounts")}
          >
            💰 Accounts Table ({countAcc})
          </button>
        </div>

        {/* TABLE CONTAINER */}
        <div className="asgTableCard">
          <table className="asgTable">
            <thead>
              <tr>
                {columns.id && <th>Ticket ID</th>}
                {columns.requester && <th>Requester</th>}
                {columns.assignmentGroup && <th>Assignment Group</th>}
                {columns.category && <th>Category & Details</th>}
                {columns.priority && <th>Priority</th>}
                {columns.assignedTo && <th>Assigned To</th>}
                {columns.createdDate && <th>Created Date</th>}
                {columns.status && <th>Status</th>}
                {columns.actions && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <tr key={t.id}>
                    {columns.id && <td className="asgIdCell">{t.id}</td>}
                    {columns.requester && (
                      <td>
                        <strong>{t.requester}</strong>
                      </td>
                    )}
                    {columns.assignmentGroup && (
                      <td>
                        <span className={`asgGroupPill ${t.assignmentGroup.toLowerCase()}`}>
                          {t.assignmentGroup === "IT" && "IT Department"}
                          {t.assignmentGroup === "HR" && "HR Department"}
                          {t.assignmentGroup === "Accounts" && "Accounts Department"}
                        </span>
                      </td>
                    )}
                    {columns.category && (
                      <td>
                        <div style={{ fontWeight: "600", color: "#0f172a" }}>{t.category}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{t.shortDescription}</div>
                      </td>
                    )}
                    {columns.priority && (
                      <td>
                        <span className={`asgPriorityBadge ${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                      </td>
                    )}
                    {columns.assignedTo && <td>{t.assignedTo}</td>}
                    {columns.createdDate && <td>{t.createdDate}</td>}
                    {columns.status && (
                      <td>
                        <select
                          className={`asgStatusSelect ${t.status.replace(/\s+/g, "").toLowerCase()}`}
                          value={t.status}
                          onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending Approval">Pending Approval</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    )}
                    {columns.actions && (
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="asgActionBtn btn-save"
                            onClick={() => alert(`Saved changes for ${t.id}`)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="asgActionBtn btn-submit"
                            onClick={() => handleStatusChange(t.id, "Resolved")}
                          >
                            Submit
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumnCount} className="asgEmptyCell">
                    No tickets found in {activeTab} Assignment Group.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssignmentGroupMain;
