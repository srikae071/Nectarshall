import React, { useMemo, useState, useEffect } from "react";
import { fetchApiData } from "../../../utils/apiClient";
import "./index.css";

function AccountsParent() {
  // Helper to parse dates into week numbers (1 - 52)
  const getWeekNumberFromDate = (dateObj) => {
    if (!dateObj || isNaN(new Date(dateObj).getTime())) return 1;
    const d = new Date(dateObj);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return Math.min(52, Math.max(1, weekNo));
  };

  // Helper to calculate current week number of system date (new Date())
  const getCurrentSystemWeek = () => {
    return getWeekNumberFromDate(new Date());
  };

  // Helper to calculate end date string for a week number (e.g. Jan 7, Aug 9)
  const getWeekEndDateStr = (weekNum, year = new Date().getFullYear()) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(
      startDate.getTime() + (weekNum * 7 - 1) * 86400000,
    );
    return endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const [selectedWeek, setSelectedWeek] = useState(() =>
    getCurrentSystemWeek(),
  );
  const [expandedEmp, setExpandedEmp] = useState(null);
  const [selectedLedgerShift, setSelectedLedgerShift] = useState(null);
  const [completedTasksMap, setCompletedTasksMap] = useState(() => {
    const saved = localStorage.getItem("rosterCompletedTasks");
    return saved ? JSON.parse(saved) : {};
  });
  const [employees, setEmployees] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeRateCard, setActiveRateCard] = useState(() => {
    const saved = localStorage.getItem("accountsRateCard");
    return saved
      ? JSON.parse(saved)
      : {
          level1: { hourlyRate: 26.5 },
          level2: { hourlyRate: 30 },
          level3: { hourlyRate: 35 },
        };
  });

  useEffect(() => {
    const handleRateUpdate = () => {
      const saved = localStorage.getItem("accountsRateCard");
      if (saved) {
        setActiveRateCard(JSON.parse(saved));
      }
    };
    const handleTasksUpdate = () => {
      const saved = localStorage.getItem("rosterCompletedTasks");
      setCompletedTasksMap(saved ? JSON.parse(saved) : {});
    };

    window.addEventListener("accountsRateCardUpdated", handleRateUpdate);
    window.addEventListener("rosterTasksUpdated", handleTasksUpdate);
    return () => {
      window.removeEventListener("accountsRateCardUpdated", handleRateUpdate);
      window.removeEventListener("rosterTasksUpdated", handleTasksUpdate);
    };
  }, []);

  const getRateForPosition = (pos) => {
    const p = String(pos || "").toUpperCase();
    if (p.includes("GL3") || p.includes("LEVEL 3") || p.includes("LEVEL3")) {
      return Number(activeRateCard?.level3?.hourlyRate) || 35;
    }
    if (p.includes("GL2") || p.includes("LEVEL 2") || p.includes("LEVEL2")) {
      return Number(activeRateCard?.level2?.hourlyRate) || 30;
    }
    return Number(activeRateCard?.level1?.hourlyRate) || 26.5;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, candRes] = await Promise.all([
        fetchApiData("/api/employees"),
        fetchApiData("/api/BoardingCandidates"),
      ]);

      setEmployees(empRes.data || []);
      setCandidates(candRes.data || []);
    } catch (err) {
      console.error("Error loading Accounts Parent data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate total hours worked from time strings like "08:00" to "16:00"
  const calculateHours = (startTimeStr, endTimeStr) => {
    if (!startTimeStr || !endTimeStr) return 8;
    const [h1, m1] = String(startTimeStr).split(":").map(Number);
    const [h2, m2] = String(endTimeStr).split(":").map(Number);
    if (isNaN(h1) || isNaN(h2)) return 8;

    let mins = h2 * 60 + (m2 || 0) - (h1 * 60 + (m1 || 0));
    if (mins <= 0) mins += 24 * 60;
    return Math.max(1, Math.round((mins / 60) * 10) / 10);
  };

  // Process and Match Employee Shift Placements from BoardingCandidates
  const allMatchedShifts = useMemo(() => {
    const shiftList = [];

    (candidates || []).forEach((candidate) => {
      const companyName = candidate.companyName || candidate.clientId || "N/A";

      (candidate.contractDeliverables || []).forEach((contract, cIdx) => {
        const siteName =
          contract.siteName || contract.siteAddress || "Default Site";

        (contract.services || []).forEach((service, sIdx) => {
          const serviceType = service.serviceType || "Security";
          const position = service.position || "GL1";
          const shiftStartTime = service.shiftStartTime || "08:00";
          const shiftEndTime = service.shiftEndTime || "16:00";
          const contractStartDate =
            service.contractStartDate || candidate.onboardingDate || new Date();
          const baseWeek = getWeekNumberFromDate(contractStartDate);

          (service.assignedEmployees || []).forEach((assigned, slotIdx) => {
            const assignedEmpName = (assigned.employee || "").trim();
            if (!assignedEmpName) return;

            // Case-insensitive matching against employee table
            const matchedEmp = employees.find((emp) => {
              const dName = (emp.displayName || "").trim().toLowerCase();
              const eName = (emp.employeeName || "").trim().toLowerCase();
              const target = assignedEmpName.toLowerCase();
              return (
                dName === target ||
                eName === target ||
                (dName && target.includes(dName)) ||
                (eName && target.includes(eName))
              );
            });

            const empDisplayName =
              matchedEmp?.displayName ||
              matchedEmp?.employeeName ||
              assignedEmpName;

            const empPosition =
              position ||
              matchedEmp?.designation ||
              matchedEmp?.jobTitle ||
              "GL1";

            // Interlinked rate per hour from active Rate Card & position level
            const ratePerHour =
              Number(assigned.ratePerHour) ||
              Number(matchedEmp?.ratePerHour) ||
              getRateForPosition(empPosition);

            const mealTime = assigned.mealTime || service.mealTime || "30 mins";
            const actualStartTime = assigned.actualStartTime || shiftStartTime;
            const actualEndTime = assigned.actualEndTime || shiftEndTime;
            const hoursWorked = calculateHours(actualStartTime, actualEndTime);
            const assignedDate =
              assigned.assignedDate ||
              (contractStartDate
                ? String(contractStartDate).slice(0, 10)
                : "N/A");
            const shiftWeek = assigned.assignedDate
              ? getWeekNumberFromDate(assigned.assignedDate)
              : baseWeek;

            const shiftId = `${candidate._id}_${contract._id || cIdx}_${service._id || sIdx}_${slotIdx}`;
            const approvalState =
              assigned.approvalState || service.approvalState || "Pending";

            // Multi-fallback lookup for task completion state
            const shiftTaskData =
              completedTasksMap[shiftId] ||
              completedTasksMap[empDisplayName] ||
              completedTasksMap[
                `${candidate._id}_${contract._id}_${sIdx}_${slotIdx}`
              ];

            let checkedTasks = [];
            const isToiletTaskKey = (tKey) => {
              const str = String(tKey || "").toLowerCase();
              return str.includes("toilet") || str.includes("cleaning");
            };

            if (typeof shiftTaskData === "object" && shiftTaskData !== null) {
              Object.entries(shiftTaskData).forEach(([tKey, val]) => {
                if (val) checkedTasks.push(tKey);
              });
            } else if (shiftTaskData === true) {
              checkedTasks.push("Toilet Cleaning");
            }

            if (checkedTasks.length === 0) {
              Object.keys(completedTasksMap).forEach((key) => {
                if (
                  key === shiftId ||
                  key === empDisplayName ||
                  (empDisplayName && key.includes(empDisplayName))
                ) {
                  const valObj = completedTasksMap[key];
                  if (typeof valObj === "object" && valObj !== null) {
                    Object.entries(valObj).forEach(([tKey, val]) => {
                      if (val && !checkedTasks.includes(tKey)) {
                        checkedTasks.push(tKey);
                      }
                    });
                  } else if (valObj === true) {
                    if (!checkedTasks.includes("Toilet Cleaning")) {
                      checkedTasks.push("Toilet Cleaning");
                    }
                  }
                }
              });
            }

            const completedCount = checkedTasks.length;
            // Rule: Add 3.69% bonus if Toilet Cleaning task is checked!
            // Formula: (Base Wage + Super 12% + Long Leave Allowance 1.98%) * 3.69%
            const hasToiletCleaningChecked =
              checkedTasks.some((tKey) => isToiletTaskKey(tKey));

            const baseWage = hoursWorked * ratePerHour;
            const superAmount = baseWage * 0.12;
            const leaveAmount = baseWage * 0.0198; // Long Leave Allowance (1.98%)
            const subtotalWage = baseWage + superAmount + leaveAmount;
            const taskBonusPercent = hasToiletCleaningChecked ? 0.0369 : 0;
            const taskBonusAmount = subtotalWage * taskBonusPercent;
            const totalPay = subtotalWage + taskBonusAmount;

            shiftList.push({
              id: shiftId,
              weekNumber: shiftWeek,
              empName: empDisplayName,
              serviceType,
              position: empPosition,
              companyName,
              siteName,
              shiftStartTime,
              shiftEndTime,
              actualStartTime: assigned.actualStartTime || "Not Logged",
              actualEndTime: assigned.actualEndTime || "Not Logged",
              mealTime,
              hours: hoursWorked,
              ratePerHour,
              baseWage,
              superAmount,
              leaveAmount,
              taskBonusAmount,
              hasToiletCleaningChecked,
              completedCount,
              taskBonusPercentStr: hasToiletCleaningChecked ? "3.69" : "0.00",
              isTaskCompleted: completedCount > 0,
              approvalState,
              totalPay,
              assignedDate,
            });
          });
        });
      });
    });

    return shiftList;
  }, [candidates, employees, activeRateCard, completedTasksMap]);

  // 52 Weeks Selector Labels with End Dates (e.g. Week 32 - Aug 9)
  const weekOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 52 }, (_, i) => {
      const weekNum = i + 1;
      const endDateStr = getWeekEndDateStr(weekNum, currentYear);

      return {
        id: weekNum,
        label: `Week ${weekNum} - ${endDateStr}`,
        endDateStr,
      };
    });
  }, []);

  // Filter Shifts for the Selected Week
  const selectedWeekShifts = useMemo(() => {
    return allMatchedShifts.filter((s) => s.weekNumber === selectedWeek);
  }, [allMatchedShifts, selectedWeek]);

  // Group shifts by worker name and calculate multi-company statistics
  const groupedWorkerShifts = useMemo(() => {
    const map = new Map();
    selectedWeekShifts.forEach((shift) => {
      if (!map.has(shift.empName)) {
        map.set(shift.empName, {
          empName: shift.empName,
          shifts: [],
        });
      }
      map.get(shift.empName).shifts.push(shift);
    });

    const result = [];
    map.forEach((value, empName) => {
      const shifts = value.shifts;

      // Group shifts by company
      const companyMap = new Map();
      shifts.forEach((s) => {
        if (!companyMap.has(s.companyName)) {
          companyMap.set(s.companyName, {
            companyName: s.companyName,
            companyHours: 0,
            companyBase: 0,
            companySuper: 0,
            companyLeave: 0,
            companyTaskBonus: 0,
            companyPay: 0,
            companyShifts: [],
          });
        }
        const comp = companyMap.get(s.companyName);
        comp.companyHours += s.hours;
        comp.companyBase += s.baseWage;
        comp.companySuper += s.superAmount;
        comp.companyLeave += s.leaveAmount;
        comp.companyTaskBonus += s.taskBonusAmount;
        comp.companyPay += s.totalPay;
        comp.companyShifts.push(s);
      });

      const companyBreakdown = Array.from(companyMap.values());
      const totalWorkerHours = shifts.reduce((sum, s) => sum + s.hours, 0);
      const totalWorkerBase = shifts.reduce((sum, s) => sum + s.baseWage, 0);
      const totalWorkerSuper = shifts.reduce(
        (sum, s) => sum + s.superAmount,
        0,
      );
      const totalWorkerLeave = shifts.reduce(
        (sum, s) => sum + s.leaveAmount,
        0,
      );
      const totalWorkerTaskBonus = shifts.reduce(
        (sum, s) => sum + s.taskBonusAmount,
        0,
      );
      const totalWorkerPay = shifts.reduce((sum, s) => sum + s.totalPay, 0);
      const uniqueCompanies = companyBreakdown.map((c) => c.companyName);

      result.push({
        empName,
        shifts,
        companyBreakdown,
        uniqueCompanies,
        isMultiCompany: uniqueCompanies.length > 1,
        totalWorkerHours,
        totalWorkerBase,
        totalWorkerSuper,
        totalWorkerLeave,
        totalWorkerTaskBonus,
        totalWorkerPay,
      });
    });

    return result;
  }, [selectedWeekShifts]);

  // Calculate Total Weekly Wages
  const totalWeeklyPay = useMemo(() => {
    return selectedWeekShifts.reduce((sum, s) => sum + s.totalPay, 0);
  }, [selectedWeekShifts]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  const handleToggleExpand = (empName) => {
    setExpandedEmp((prev) => (prev === empName ? null : empName));
  };

  return (
    <div className="accountsParentContainer">
      <div className="accountsHeader">
        <div>
          <h2>📋 PayRun Accounts Dashboard (52 Weeks View)</h2>
          <p className="accountsSubtext">
            Click on any worker's name to smoothly expand multi-company shift
            breakdowns, total hours worked, and combined weekly pay
            calculations.
          </p>
        </div>

        <div className="weekSelectorContainer">
          <label
            style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}
          >
            Select Week:
          </label>
          <select
            className="accountsSearchInput"
            value={selectedWeek}
            onChange={(e) => {
              setSelectedWeek(Number(e.target.value));
              setExpandedEmp(null);
            }}
          >
            {weekOptions.map((week) => (
              <option key={week.id} value={week.id}>
                {week.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="accountsTabButtons">
        <button className="accountsTabBtn active">
          📋{" "}
          {weekOptions.find((w) => w.id === selectedWeek)?.label ||
            `Week ${selectedWeek}`}{" "}
          Weekly Wage View ({selectedWeekShifts.length} Shift Placements)
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          ⌛ Loading employee placements and contract shifts...
        </div>
      ) : (
        <div className="accountsTableWrapper">
          <table className="accountsTable">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Type Of Service</th>
                <th>Position</th>
                <th>Company / Client</th>
                <th>Site Name</th>
                <th>Assigned Date</th>
                <th>Scheduled Shift</th>
                <th>Actual Worked Time & Meal</th>
                <th>Hours</th>
                <th>Rate / Hr</th>
                <th>Total Pay</th>
              </tr>
            </thead>
            <tbody>
              {groupedWorkerShifts.length === 0 ? (
                <tr>
                  <td colSpan="11" className="accountsEmpty">
                    No employee shift placements found for Week {selectedWeek}.
                  </td>
                </tr>
              ) : (
                groupedWorkerShifts.map((workerGroup) => {
                  const isExpanded = expandedEmp === workerGroup.empName;
                  const initialLetter = (workerGroup.empName || "E")
                    .charAt(0)
                    .toUpperCase();

                  return (
                    <React.Fragment key={workerGroup.empName}>
                      {workerGroup.shifts.map((shift, index) => (
                        <tr key={shift.id}>
                          {index === 0 ? (
                            <td
                              className="empNameText"
                              rowSpan={workerGroup.shifts.length}
                              style={{ verticalAlign: "top" }}
                            >
                              <div
                                className="empClickableName"
                                onClick={() =>
                                  handleToggleExpand(workerGroup.empName)
                                }
                                title="Click to expand multi-company shift breakdown & pay calculation"
                              >
                                <span className="empInitialAvatar">
                                  {initialLetter}
                                </span>
                                <div>
                                  <div
                                    style={{
                                      fontWeight: "700",
                                      color: "#047857",
                                    }}
                                  >
                                    {workerGroup.empName}{" "}
                                    {isExpanded ? "▲" : "▼"}
                                  </div>
                                  {workerGroup.isMultiCompany ? (
                                    <span
                                      className="multiCompanyBadge"
                                      style={{ marginTop: "2px" }}
                                    >
                                      🏢 {workerGroup.uniqueCompanies.length}{" "}
                                      Companies
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: "#64748b",
                                      }}
                                    >
                                      Click to View Pay Details
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          ) : null}
                          <td>🛡️ {shift.serviceType}</td>
                          <td>👔 {shift.position}</td>
                          <td>🏢 {shift.companyName}</td>
                          <td>📍 {shift.siteName}</td>
                          <td>📅 {shift.assignedDate}</td>
                          <td>
                            ⏰ {shift.shiftStartTime} - {shift.shiftEndTime}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                              }}
                            >
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontSize: "11.5px",
                                  fontWeight: "600",
                                  background:
                                    shift.actualStartTime !== "Not Logged"
                                      ? "#dcfce7"
                                      : "#f1f5f9",
                                  color:
                                    shift.actualStartTime !== "Not Logged"
                                      ? "#166534"
                                      : "#64748b",
                                }}
                              >
                                ⏱️ {shift.actualStartTime} -{" "}
                                {shift.actualEndTime}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#64748b",
                                  fontWeight: "600",
                                }}
                              >
                                🍱 Meal: {shift.mealTime}
                              </span>
                            </div>
                          </td>
                          <td>{shift.hours} hrs</td>
                          <td style={{ fontWeight: "700", color: "#047857" }}>
                            {formatCurrency(shift.ratePerHour)}
                          </td>
                          <td
                            style={{
                              fontWeight: "700",
                              color: "#0f172a",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span>{formatCurrency(shift.totalPay)}</span>
                              <button
                                className="ledgerIconBtn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLedgerShift(
                                    selectedLedgerShift === shift.id
                                      ? null
                                      : shift.id,
                                  );
                                }}
                                title="Click to view Pay Ledger (Base Wage + Super 12% + Long Leave Allowance 1.98% + Toilet Cleaning 3.69%)"
                              >
                                📒
                              </button>
                            </div>

                            {selectedLedgerShift === shift.id && (
                              <div className="payLedgerPopover">
                                <div className="ledgerPopoverHeader">
                                  <span>📒 Wage Ledger Brkdown</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedLedgerShift(null);
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="ledgerRow">
                                  <span>Shift Hours & Rate:</span>
                                  <strong>
                                    {shift.hours} hrs ×{" "}
                                    {formatCurrency(shift.ratePerHour)}
                                  </strong>
                                </div>
                                <div className="ledgerRow">
                                  <span>💵 Base Wage:</span>
                                  <strong>
                                    {formatCurrency(shift.baseWage)}
                                  </strong>
                                </div>
                                <div className="ledgerRow">
                                  <span>🏦 Super (12%):</span>
                                  <strong style={{ color: "#047857" }}>
                                    +{formatCurrency(shift.superAmount)}
                                  </strong>
                                </div>
                                <div className="ledgerRow">
                                  <span>🌴 Long Leave Allowance (1.98%):</span>
                                  <strong style={{ color: "#0284c7" }}>
                                    +{formatCurrency(shift.leaveAmount)}
                                  </strong>
                                </div>
                                <div className="ledgerRow">
                                  <span>🚽 Toilet Cleaning (3.69% Bonus):</span>
                                  <strong
                                    style={{
                                      color: shift.hasToiletCleaningChecked
                                        ? "#d97706"
                                        : "#64748b",
                                    }}
                                  >
                                    {shift.hasToiletCleaningChecked
                                      ? `+${formatCurrency(shift.taskBonusAmount)} (3.69%)`
                                      : "$0.00"}
                                  </strong>
                                </div>
                                <div className="ledgerRowTotal">
                                  <span>💰 Total Payable Vuge:</span>
                                  <strong>
                                    {formatCurrency(shift.totalPay)}
                                  </strong>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* SMOOTH ANIMATED EXPANDED MULTI-COMPANY BREAKDOWN DRAWER */}
                      <tr>
                        <td colSpan="11" style={{ padding: 0, border: "none" }}>
                          <div
                            className={`expandedDrawerWrapper ${isExpanded ? "open" : ""}`}
                          >
                            <div className="expandedDrawerInnerContent">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "12px",
                                }}
                              >
                                <div>
                                  <h4
                                    style={{
                                      margin: 0,
                                      fontSize: "16px",
                                      color: "#0f172a",
                                    }}
                                  >
                                    👤 {workerGroup.empName} - Weekly
                                    Multi-Company Pay Summary
                                  </h4>
                                  <p
                                    style={{
                                      margin: "2px 0 0 0",
                                      fontSize: "12.5px",
                                      color: "#64748b",
                                    }}
                                  >
                                    Detailed breakdown including Base Wage,
                                    Super 12%, Long Leave Allowance 1.98%,
                                    Toilet Cleaning 3.69%, and Total Payable
                                    Wage for Week {selectedWeek}.
                                  </p>
                                </div>

                                {workerGroup.isMultiCompany && (
                                  <span className="multiCompanyBadge">
                                    🏢 Multi-Company Placement (
                                    {workerGroup.uniqueCompanies.join(" & ")})
                                  </span>
                                )}
                              </div>

                              {/* COMPANY BY COMPANY BREAKDOWN */}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "12px",
                                }}
                              >
                                {workerGroup.companyBreakdown.map(
                                  (comp, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className="companyBreakdownCard"
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          borderBottom: "1px solid #e2e8f0",
                                          paddingBottom: "8px",
                                          marginBottom: "8px",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            color: "#0f172a",
                                          }}
                                        >
                                          🏢 Company:{" "}
                                          <strong style={{ color: "#047857" }}>
                                            {comp.companyName}
                                          </strong>
                                        </span>
                                        <span
                                          style={{
                                            fontWeight: "700",
                                            fontSize: "13px",
                                            color: "#047857",
                                          }}
                                        >
                                          Subtotal: {comp.companyHours} hrs |
                                          Base:{" "}
                                          {formatCurrency(comp.companyBase)} |
                                          Super (12%):{" "}
                                          {formatCurrency(comp.companySuper)} |
                                          Long Leave Allowance (1.98%):{" "}
                                          {formatCurrency(comp.companyLeave)} |
                                          Toilet Cleaning (3.69%):{" "}
                                          {formatCurrency(comp.companyTaskBonus)} |{" "}
                                          <strong>
                                            Total:{" "}
                                            {formatCurrency(comp.companyPay)}
                                          </strong>
                                        </span>
                                      </div>

                                      <div className="companyTableScrollWrapper">
                                        <table className="drawerInnerTable">
                                          <thead>
                                            <tr>
                                              <th>Service / Position</th>
                                              <th>Site Name</th>
                                              <th>Assigned Date</th>
                                              <th>Shift Timings</th>
                                              <th>Actual Worked Time & Meal</th>
                                              <th
                                                style={{ textAlign: "right" }}
                                              >
                                                Hours
                                              </th>
                                              <th
                                                style={{ textAlign: "right" }}
                                              >
                                                Rate/Hr
                                              </th>
                                              <th
                                                style={{ textAlign: "right" }}
                                              >
                                                Base Wage
                                              </th>
                                              <th
                                                style={{ textAlign: "right" }}
                                              >
                                                Super (12%)
                                              </th>
                                              <th
                                                style={{ textAlign: "right" }}
                                              >
                                                Long Leave Allowance (1.98%)
                                              </th>
                                              <th
                                                style={{ textAlign: "right" }}
                                              >
                                                Toilet Cleaning (3.69%)
                                              </th>
                                              <th
                                                style={{ textAlign: "right" }}
                                              >
                                                Total Payable Pay
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {comp.companyShifts.map(
                                              (s, sIdx) => (
                                                <tr key={sIdx}>
                                                  <td>
                                                    🛡️ {s.serviceType} (
                                                    {s.position})
                                                  </td>
                                                  <td>📍 {s.siteName}</td>
                                                  <td>📅 {s.assignedDate}</td>
                                                  <td>
                                                    ⏰ {s.shiftStartTime} -{" "}
                                                    {s.shiftEndTime}
                                                  </td>
                                                  <td>
                                                    <span
                                                      style={{
                                                        padding: "2px 6px",
                                                        borderRadius: "4px",
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        background:
                                                          s.actualStartTime !==
                                                          "Not Logged"
                                                            ? "#dcfce7"
                                                            : "#f1f5f9",
                                                        color:
                                                          s.actualStartTime !==
                                                          "Not Logged"
                                                            ? "#166534"
                                                            : "#64748b",
                                                      }}
                                                    >
                                                      ⏱️ {s.actualStartTime} -{" "}
                                                      {s.actualEndTime} (🍱{" "}
                                                      {s.mealTime})
                                                    </span>
                                                  </td>
                                                  <td
                                                    style={{
                                                      textAlign: "right",
                                                    }}
                                                  >
                                                    {s.hours} hrs
                                                  </td>
                                                  <td
                                                    style={{
                                                      textAlign: "right",
                                                      fontWeight: "700",
                                                      color: "#047857",
                                                    }}
                                                  >
                                                    {formatCurrency(
                                                      s.ratePerHour,
                                                    )}
                                                  </td>
                                                  <td
                                                    style={{
                                                      textAlign: "right",
                                                      fontWeight: "600",
                                                    }}
                                                  >
                                                    {formatCurrency(s.baseWage)}
                                                  </td>
                                                  <td
                                                    style={{
                                                      textAlign: "right",
                                                      fontWeight: "600",
                                                      color: "#047857",
                                                    }}
                                                  >
                                                    +
                                                    {formatCurrency(
                                                      s.superAmount,
                                                    )}
                                                  </td>
                                                  <td
                                                    style={{
                                                      textAlign: "right",
                                                      fontWeight: "600",
                                                      color: "#0284c7",
                                                    }}
                                                  >
                                                    +
                                                    {formatCurrency(
                                                      s.leaveAmount,
                                                    )}
                                                  </td>
                                                  <td
                                                    style={{
                                                      textAlign: "right",
                                                      fontWeight: "600",
                                                      color: s.hasToiletCleaningChecked
                                                        ? "#d97706"
                                                        : "#64748b",
                                                    }}
                                                  >
                                                    {s.hasToiletCleaningChecked
                                                      ? `+${formatCurrency(s.taskBonusAmount)}`
                                                      : "$0.00"}
                                                  </td>
                                                  <td
                                                    style={{
                                                      textAlign: "right",
                                                      fontWeight: "700",
                                                      color: "#0f172a",
                                                    }}
                                                  >
                                                    {formatCurrency(s.totalPay)}
                                                  </td>
                                                </tr>
                                              ),
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>

                              {/* GRAND TOTAL COMBINED CALCULATION BANNER */}
                              <div
                                style={{
                                  marginTop: "16px",
                                  padding: "12px 18px",
                                  borderRadius: "8px",
                                  background: "#047857",
                                  color: "#ffffff",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "14px",
                                  }}
                                >
                                  💰 Total Combined Weekly Payable (Base Wage +
                                  Super 12% + Long Leave Allowance 1.98% + Toilet Cleaning 3.69%):
                                </span>
                                <span
                                  style={{
                                    fontWeight: "800",
                                    fontSize: "15px",
                                  }}
                                >
                                  {workerGroup.totalWorkerHours} hrs | Base:{" "}
                                  {formatCurrency(workerGroup.totalWorkerBase)}{" "}
                                  | Super (12%):{" "}
                                  {formatCurrency(workerGroup.totalWorkerSuper)}{" "}
                                  | Long Leave (1.98%):{" "}
                                  {formatCurrency(workerGroup.totalWorkerLeave)}{" "}
                                  | Toilet Cleaning (3.69%):{" "}
                                  {formatCurrency(workerGroup.totalWorkerTaskBonus)}{" "}
                                  | Total Payable:{" "}
                                  {formatCurrency(workerGroup.totalWorkerPay)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}

              {groupedWorkerShifts.length > 0 && (
                <tr
                  style={{
                    background: "#f8fafc",
                    borderTop: "2px solid #e2e8f0",
                  }}
                >
                  <td
                    colSpan="10"
                    style={{
                      textAlign: "right",
                      fontWeight: "700",
                      padding: "12px 16px",
                    }}
                  >
                    Total Weekly Payable Wages for Week {selectedWeek}:
                  </td>
                  <td
                    style={{
                      fontWeight: "800",
                      color: "#047857",
                      fontSize: "15px",
                      padding: "12px 16px",
                    }}
                  >
                    {formatCurrency(totalWeeklyPay)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AccountsParent;
