import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./index.css";

function TimesheetPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");

  const [hiddenRowIds, setHiddenRowIds] = useState(() => {
    try {
      const saved = localStorage.getItem("timesheet_hidden_rows");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await axios.get(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates"
        );
      } catch (err) {
        res = await axios.get("/api/BoardingCandidates");
      }
      const dataArr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setCandidates(dataArr);
    } catch (err) {
      console.error("Error fetching candidates in TimesheetPage:", err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRow = (rowId) => {
    setHiddenRowIds((prev) => {
      const next = [...prev, rowId];
      try {
        localStorage.setItem("timesheet_hidden_rows", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const calculateSummary = (startTimeStr, endTimeStr) => {
    if (!startTimeStr || !endTimeStr) return "8 Hours";
    const [sH, sM] = String(startTimeStr).split(":").map(Number);
    const [eH, eM] = String(endTimeStr).split(":").map(Number);
    if (isNaN(sH) || isNaN(eH)) return "8 Hours";
    let diffMins = (eH * 60 + (eM || 0)) - (sH * 60 + (sM || 0));
    if (diffMins <= 0) diffMins += 24 * 60;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (mins === 0) return `${hours} Hours`;
    return `${hours} Hours ${mins} Mins`;
  };

  // Collect submitted / accepted timesheet rows across candidates
  const allTimesheetRows = useMemo(() => {
    const rows = [];
    const safeCandidates = Array.isArray(candidates) ? candidates : [];
    safeCandidates.forEach((cand) => {
      (cand.contractDeliverables || []).forEach((contract) => {
        const contractStartDateStr = contract.contractStartDate
          ? String(contract.contractStartDate).slice(0, 10)
          : contract.startDate
          ? String(contract.startDate).slice(0, 10)
          : new Date().toISOString().slice(0, 10);

        // Standard Services
        (contract.services || []).forEach((svc, sIdx) => {
          const qty = Math.max(1, Number(svc.quantity) || 1);
          for (let q = 0; q < qty; q++) {
            const slotEmpObj = svc.assignedEmployees?.[q];
            const empName =
              slotEmpObj?.employee || (q === 0 ? svc.employee || "" : "");
            const isSubmitted =
              slotEmpObj?.isSubmitted === true ||
              slotEmpObj?.approvalState === "Accepted" ||
              Boolean(slotEmpObj?.actualStartTime);

            if (empName && empName.trim() !== "" && isSubmitted) {
              const actStart =
                slotEmpObj?.actualStartTime || svc.shiftStartTime || "08:00";
              const actEnd =
                slotEmpObj?.actualEndTime || svc.shiftEndTime || "16:00";

              rows.push({
                id: `${cand._id}_${contract._id}_${sIdx}_${q}`,
                date: contractStartDateStr,
                customer: cand.companyName || cand.clientId || "Client",
                employeeName: empName.trim(),
                position: svc.position || "N/A",
                typeOfService: svc.serviceType || svc.position || "Shift",
                startTime: actStart,
                endTime: actEnd,
                summary: calculateSummary(actStart, actEnd),
              });
            }
          }
        });
      });
    });
    return rows;
  }, [candidates]);

  // Unique customer options
  const customerOptions = useMemo(() => {
    const names = allTimesheetRows.map((r) => r.customer);
    return ["All", ...new Set(names)];
  }, [allTimesheetRows]);

  // Filtered rows (excluding hidden rows)
  const filteredRows = useMemo(() => {
    return allTimesheetRows.filter((r) => {
      if (hiddenRowIds.includes(r.id)) return false;
      if (
        selectedCustomer !== "All" &&
        r.customer.toLowerCase() !== selectedCustomer.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchEmp = r.employeeName.toLowerCase().includes(q);
        const matchCust = r.customer.toLowerCase().includes(q);
        const matchPos = r.position.toLowerCase().includes(q);
        const matchSvc = r.typeOfService.toLowerCase().includes(q);
        if (!matchEmp && !matchCust && !matchPos && !matchSvc) return false;
      }
      return true;
    });
  }, [allTimesheetRows, selectedCustomer, searchQuery, hiddenRowIds]);

  return (
    <div className="timesheet">
      <div className="timesheetHeader">
        <h2>Operations Timesheets Dashboard</h2>
        <p>
          View submitted shift times, employee assignments, positions, service types, and working summaries.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="filterBar">
        <div className="filterGroup">
          <label>SELECT CUSTOMER:</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            {customerOptions.map((cust) => (
              <option key={cust} value={cust}>
                {cust}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup searchBox">
          <label>SEARCH:</label>
          <input
            type="text"
            placeholder="Search by employee, customer, position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="tableContainer">
        {loading ? (
          <div className="timesheetLoading">Loading submitted timesheets...</div>
        ) : filteredRows.length === 0 ? (
          <div className="timesheetEmptyState">
            No submitted timesheet records found. Submit actual shift times in Roster Shifts Main to display them here.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="timesheatsheading">Date</th>
                <th className="timesheatsheading">Customer</th>
                <th className="timesheatsheading">Employee Name</th>
                <th className="timesheatsheading">Position</th>
                <th className="timesheatsheading">Type of Service</th>
                <th className="timesheatsheading">Start Time</th>
                <th className="timesheatsheading">End Time</th>
                <th className="timesheatsheading">Summary</th>
                <th className="timesheatsheading" style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>{row.date}</td>
                  <td>🏢 {row.customer}</td>
                  <td style={{ fontWeight: 700, color: "#0f172a" }}>
                    👤 {row.employeeName}
                  </td>
                  <td>
                    <span className="posBadge">{row.position}</span>
                  </td>
                  <td>
                    <span className="svcBadge">{row.typeOfService}</span>
                  </td>
                  <td style={{ color: "#2563eb", fontWeight: 600 }}>
                    🕒 {row.startTime}
                  </td>
                  <td style={{ color: "#2563eb", fontWeight: 600 }}>
                    🕒 {row.endTime}
                  </td>
                  <td>
                    <span className="summaryBadge">⏱️ {row.summary}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      className="deleteTimesheetRowBtn"
                      title="Delete from Timesheets view"
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TimesheetPage;
