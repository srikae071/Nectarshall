import React, { useState, useEffect, useMemo, useRef } from "react";
import { fetchApiData, extractArrayData } from "../../../utils/apiClient";
import "./index.css";

const ALL_COLUMNS = [
  { key: "empName", label: "WORKER NAME", width: "12%" },
  { key: "serviceType", label: "TYPE OF SERVICE", width: "10%" },
  { key: "position", label: "POSITION", width: "8%" },
  { key: "companyName", label: "COMPANY / CLIENT", width: "11%" },
  { key: "siteName", label: "SITE NAME", width: "11%" },
  { key: "assignedDate", label: "ASSIGNED DATE", width: "9%" },
  { key: "scheduledShift", label: "SCHEDULED SHIFT", width: "9%" },
  { key: "actualWorkedTime", label: "ACTUAL WORKED TIME", width: "10%" },
  { key: "mealTime", label: "MEAL", width: "6%" },
  { key: "hours", label: "HOURS", width: "5%" },
  { key: "ratePerHour", label: "RATE / HR", width: "5%" },
  { key: "totalPay", label: "TOTAL AMOUNT", width: "6%" },
  { key: "status", label: "STATUS", width: "8%" },
];

const DEFAULT_COLUMNS = ALL_COLUMNS.map((c) => c.key);

function AccountsCustomerBilling() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("all"); // "all" | "roster" | "adhoc"
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("customerBillingColumns");
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });

  useEffect(() => {
    loadData();
  }, []);

  // Close column settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [candRes, empRes] = await Promise.all([
        fetchApiData("/api/BoardingCandidates"),
        fetchApiData("/api/employees"),
      ]);
      setCandidates(extractArrayData(candRes.data));
      setEmployees(extractArrayData(empRes.data));
    } catch (err) {
      console.error("Error loading Customer Billing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (key) => {
    let updated;
    if (visibleColumns.includes(key)) {
      if (visibleColumns.length === 1) return; // keep at least 1 column
      updated = visibleColumns.filter((c) => c !== key);
    } else {
      updated = [...visibleColumns, key];
    }
    setVisibleColumns(updated);
    localStorage.setItem("customerBillingColumns", JSON.stringify(updated));
  };

  // Helper to calculate hours
  const calculateHours = (startTimeStr, endTimeStr) => {
    if (!startTimeStr || !endTimeStr) return 8;
    const [h1, m1] = String(startTimeStr).split(":").map(Number);
    const [h2, m2] = String(endTimeStr).split(":").map(Number);
    if (isNaN(h1) || isNaN(h2)) return 8;

    let mins = h2 * 60 + (m2 || 0) - (h1 * 60 + (m1 || 0));
    if (mins <= 0) mins += 24 * 60;
    return Math.max(1, Math.round((mins / 60) * 10) / 10);
  };

  // EXTRACT ALL ACCEPTED ROSTER SHIFTS & ADHOC SERVICES
  const allBillingRecords = useMemo(() => {
    const records = [];

    candidates.forEach((candidate) => {
      const companyName =
        (candidate.companyName || candidate.clientId || candidate.clientName || "Client").trim();

      (candidate.contractDeliverables || []).forEach((contract, cIdx) => {
        const siteName =
          (contract.siteName || contract.siteAddress || `Site ${cIdx + 1}`).trim();

        // 1. Process Contract Services (Roster Shifts)
        (contract.services || []).forEach((service, sIdx) => {
          const serviceType = service.serviceType || "Security";
          const position = service.position || "GL1";
          const shiftStartTime = service.shiftStartTime || "08:00";
          const shiftEndTime = service.shiftEndTime || "16:00";

          (service.assignedEmployees || []).forEach((assigned, slotIdx) => {
            const empName = (assigned.employee || "").trim();
            if (!empName) return;

            // Include accepted shifts or all assigned roster shifts
            const isAccepted =
              assigned.approvalState === "Accepted" ||
              !assigned.approvalState ||
              assigned.approvalState === "Approved";

            if (!isAccepted) return;

            const actualStartTime = assigned.actualStartTime || shiftStartTime;
            const actualEndTime = assigned.actualEndTime || shiftEndTime;
            const hours = calculateHours(actualStartTime, actualEndTime);
            const ratePerHour = Number(assigned.ratePerHour || service.hourlyRate) || 39.66;
            const mealTime = assigned.mealTime || service.mealTime || "30 mins";
            const assignedDate =
              assigned.assignedDate ||
              (service.contractStartDate
                ? String(service.contractStartDate).slice(0, 10)
                : "N/A");

            records.push({
              id: `roster_${candidate._id}_${contract._id || cIdx}_${sIdx}_${slotIdx}`,
              type: "roster",
              companyName,
              siteName,
              empName,
              serviceType,
              position,
              assignedDate,
              scheduledShift: `${shiftStartTime} - ${shiftEndTime}`,
              actualWorkedTime: `${actualStartTime} - ${actualEndTime}`,
              mealTime,
              hours,
              ratePerHour,
              totalPay: hours * ratePerHour,
              status: "Accepted",
            });
          });
        });

        // 2. Process Adhoc Services
        (contract.adhocServices || []).forEach((adhoc, aIdx) => {
          const empName = (adhoc.employee || "").trim();
          if (!empName) return;

          const isAccepted =
            adhoc.approvalState === "Accepted" ||
            !adhoc.approvalState ||
            adhoc.approvalState === "Approved";

          if (!isAccepted) return;

          const shiftStartTime = adhoc.shiftStartTime || "08:00";
          const shiftEndTime = adhoc.shiftEndTime || "16:00";
          const hours = calculateHours(shiftStartTime, shiftEndTime);
          const ratePerHour = Number(adhoc.ratePerHour) || 39.66;
          const mealTime = adhoc.mealTime || "30 mins";
          const assignedDate = adhoc.serviceDate
            ? String(adhoc.serviceDate).slice(0, 10)
            : "N/A";

          records.push({
            id: `adhoc_${candidate._id}_${contract._id || cIdx}_${aIdx}`,
            type: "adhoc",
            companyName,
            siteName,
            empName,
            serviceType: adhoc.serviceType || adhoc.adhocName || "Adhoc",
            position: adhoc.position || "Adhoc Staff",
            assignedDate,
            scheduledShift: `${shiftStartTime} - ${shiftEndTime}`,
            actualWorkedTime: `${shiftStartTime} - ${shiftEndTime}`,
            mealTime,
            hours,
            ratePerHour,
            totalPay: hours * ratePerHour,
            status: "Accepted",
          });
        });
      });
    });

    return records;
  }, [candidates]);

  // Dropdown Option Lists
  const customerOptions = useMemo(() => {
    const list = new Set();
    allBillingRecords.forEach((r) => {
      if (r.companyName) list.add(r.companyName);
    });
    return [...list].sort();
  }, [allBillingRecords]);

  const siteOptions = useMemo(() => {
    const list = new Set();
    allBillingRecords.forEach((r) => {
      if (selectedCustomer && r.companyName.toLowerCase() !== selectedCustomer.toLowerCase()) {
        return;
      }
      if (r.siteName) list.add(r.siteName);
    });
    return [...list].sort();
  }, [allBillingRecords, selectedCustomer]);

  const employeeOptions = useMemo(() => {
    const list = new Set();
    allBillingRecords.forEach((r) => {
      if (r.empName) list.add(r.empName);
    });
    return [...list].sort();
  }, [allBillingRecords]);

  // Filter Records by Dropdowns & Search
  const filteredRecords = useMemo(() => {
    return allBillingRecords.filter((item) => {
      // Subtab filter
      if (activeSubTab === "roster" && item.type !== "roster") return false;
      if (activeSubTab === "adhoc" && item.type !== "adhoc") return false;

      // Customer filter
      if (
        selectedCustomer &&
        item.companyName.toLowerCase() !== selectedCustomer.trim().toLowerCase()
      ) {
        return false;
      }

      // Site filter
      if (
        selectedSite &&
        item.siteName.toLowerCase() !== selectedSite.trim().toLowerCase()
      ) {
        return false;
      }

      // Employee filter
      if (
        selectedEmployee &&
        item.empName.toLowerCase() !== selectedEmployee.trim().toLowerCase()
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const comp = item.companyName.toLowerCase();
        const emp = item.empName.toLowerCase();
        const site = item.siteName.toLowerCase();
        const st = item.serviceType.toLowerCase();
        const pos = item.position.toLowerCase();
        if (!comp.includes(q) && !emp.includes(q) && !site.includes(q) && !st.includes(q) && !pos.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [
    allBillingRecords,
    activeSubTab,
    selectedCustomer,
    selectedSite,
    selectedEmployee,
    searchQuery,
  ]);

  // Calculate Total Billing Pay
  const totalPayAmount = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + r.totalPay, 0);
  }, [filteredRecords]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="accountsParentContainer">
      <div className="accountsHeader">
        <div>
          <h2>Customer Billing Dashboard</h2>
          <p className="accountsSubtext">
            Filter accepted roster shifts and adhoc billing records by Customer, Site Name, and Employee Name. Use Column Settings to select visible columns.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Column Settings Toggle Button */}
          <div style={{ position: "relative" }} ref={settingsRef}>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
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

            {showSettings && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  right: 0,
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  padding: "16px",
                  zIndex: 999,
                  width: "240px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "13.5px",
                    marginBottom: "10px",
                    color: "#0f172a",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "6px",
                  }}
                >
                  ⚙️ Settings
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "260px", overflowY: "auto" }}>
                  {ALL_COLUMNS.map((col) => (
                    <label
                      key={col.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#334155",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search Company, Employee, Site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="accountsSearchInput"
          />
        </div>
      </div>

      {/* FILTER DROPDOWNS BAR */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
          background: "#ffffff",
          padding: "16px 20px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Select Customer */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>
            Customer Name:
          </label>
          <select
            className="accountsSearchInput"
            style={{ width: "200px" }}
            value={selectedCustomer}
            onChange={(e) => {
              setSelectedCustomer(e.target.value);
              setSelectedSite("");
            }}
          >
            <option value="">All Customers</option>
            {customerOptions.map((cust, idx) => (
              <option key={idx} value={cust}>
                {cust}
              </option>
            ))}
          </select>
        </div>

        {/* Select Site Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>
            Site Name:
          </label>
          <select
            className="accountsSearchInput"
            style={{ width: "200px" }}
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="">All Sites</option>
            {siteOptions.map((site, idx) => (
              <option key={idx} value={site}>
                {site}
              </option>
            ))}
          </select>
        </div>

        {/* Select Employee Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>
            Employee Name:
          </label>
          <select
            className="accountsSearchInput"
            style={{ width: "200px" }}
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All Employees</option>
            {employeeOptions.map((emp, idx) => (
              <option key={idx} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Button */}
        {(selectedCustomer || selectedSite || selectedEmployee || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCustomer("");
              setSelectedSite("");
              setSelectedEmployee("");
              setSearchQuery("");
            }}
            style={{
              marginTop: "18px",
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              background: "#f1f5f9",
              color: "#475569",
              fontSize: "12.5px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ✕ Reset Filters
          </button>
        )}
      </div>

      {/* SUBTABS BAR */}
      <div className="accountsTabButtons">
        <button
          className={`accountsTabBtn ${activeSubTab === "all" ? "active" : ""}`}
          onClick={() => setActiveSubTab("all")}
        >
          All Billing Items ({allBillingRecords.length})
        </button>
        <button
          className={`accountsTabBtn ${activeSubTab === "roster" ? "active" : ""}`}
          onClick={() => setActiveSubTab("roster")}
        >
          Roster Shifts ({allBillingRecords.filter((r) => r.type === "roster").length})
        </button>
        <button
          className={`accountsTabBtn ${activeSubTab === "adhoc" ? "active" : ""}`}
          onClick={() => setActiveSubTab("adhoc")}
        >
          Adhoc Services ({allBillingRecords.filter((r) => r.type === "adhoc").length})
        </button>
      </div>

      {/* BILLING DATA TABLE */}
      {loading ? (
        <div className="accountsLoading">Loading Customer Billing Records...</div>
      ) : (
        <div className="accountsTableWrapper">
          <table className="accountsTable" style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {ALL_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      width: col.width,
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
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={ALL_COLUMNS.length}
                    className="accountsEmpty"
                  >
                    No matching customer billing records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id}>
                    <td
                      className="empNameText"
                      style={{
                        fontWeight: "700",
                        visibility: visibleColumns.includes("empName")
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {item.empName}
                    </td>
                    <td style={{ visibility: visibleColumns.includes("serviceType") ? "visible" : "hidden" }}>{item.serviceType}</td>
                    <td style={{ visibility: visibleColumns.includes("position") ? "visible" : "hidden" }}>{item.position}</td>
                    <td className="boldText" style={{ visibility: visibleColumns.includes("companyName") ? "visible" : "hidden" }}>{item.companyName}</td>
                    <td style={{ visibility: visibleColumns.includes("siteName") ? "visible" : "hidden" }}>{item.siteName}</td>
                    <td style={{ visibility: visibleColumns.includes("assignedDate") ? "visible" : "hidden" }}>{item.assignedDate}</td>
                    <td style={{ visibility: visibleColumns.includes("scheduledShift") ? "visible" : "hidden" }}>{item.scheduledShift}</td>
                    <td style={{ visibility: visibleColumns.includes("actualWorkedTime") ? "visible" : "hidden" }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11.5px",
                          fontWeight: "600",
                          background: "#dcfce7",
                          color: "#166534",
                        }}
                      >
                        {item.actualWorkedTime}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", visibility: visibleColumns.includes("mealTime") ? "visible" : "hidden" }}>
                      Meal: {item.mealTime}
                    </td>
                    <td style={{ visibility: visibleColumns.includes("hours") ? "visible" : "hidden" }}>{item.hours} hrs</td>
                    <td style={{ fontWeight: "700", color: "#047857", visibility: visibleColumns.includes("ratePerHour") ? "visible" : "hidden" }}>
                      {formatCurrency(item.ratePerHour)}
                    </td>
                    <td style={{ fontWeight: "700", color: "#0f172a", visibility: visibleColumns.includes("totalPay") ? "visible" : "hidden" }}>
                      {formatCurrency(item.totalPay)}
                    </td>
                    <td style={{ visibility: visibleColumns.includes("status") ? "visible" : "hidden" }}>
                      <span className="statusBadgeAccepted">✓ Accepted</span>
                    </td>
                  </tr>
                ))
              )}
              {filteredRecords.length > 0 && (
                <tr
                  style={{
                    background: "#f8fafc",
                    borderTop: "2px solid #e2e8f0",
                  }}
                >
                  <td
                    colSpan={11}
                    style={{
                      textAlign: "right",
                      fontWeight: "700",
                      padding: "12px 16px",
                      visibility: visibleColumns.includes("totalPay") ? "visible" : "hidden",
                    }}
                  >
                    Total Customer Billing Amount:
                  </td>
                  <td
                    style={{
                      fontWeight: "800",
                      color: "#047857",
                      fontSize: "15px",
                      padding: "12px 16px",
                      visibility: visibleColumns.includes("totalPay") ? "visible" : "hidden",
                    }}
                  >
                    {formatCurrency(totalPayAmount)}
                  </td>
                  <td style={{ visibility: visibleColumns.includes("status") ? "visible" : "hidden" }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AccountsCustomerBilling;
