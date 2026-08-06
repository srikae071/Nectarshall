import React, { useMemo, useState, useEffect } from "react";
import { fetchApiData } from "../../../utils/apiClient";
import "./index.css";

function AccountsParent() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Process and Match Employee Shift Placements from BoardingCandidates
  const allMatchedShifts = useMemo(() => {
    const shiftList = [];

    (candidates || []).forEach((candidate) => {
      const companyName = candidate.companyName || candidate.clientId || "N/A";

      (candidate.contractDeliverables || []).forEach((contract, cIdx) => {
        const siteName =
          contract.siteName || contract.siteAddress || "Default Site";

        (contract.services || []).forEach((service, sIdx) => {
          const serviceType =
            service.serviceType || service.position || "Security";
          const shiftStartTime = service.shiftStartTime || "08:00";
          const shiftEndTime = service.shiftEndTime || "16:00";
          const contractStartDate =
            service.contractStartDate ||
            candidate.onboardingDate ||
            new Date();
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
            const role =
              matchedEmp?.designation || matchedEmp?.jobTitle || serviceType;
            const ratePerHour =
              Number(matchedEmp?.ratePerHour || matchedEmp?.payRate) || 25.0;

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

            shiftList.push({
              id: `${candidate._id}_${contract._id || cIdx}_${service._id || sIdx}_${slotIdx}`,
              weekNumber: shiftWeek,
              empName: empDisplayName,
              role,
              companyName,
              siteName,
              shiftStartTime,
              shiftEndTime,
              actualStartTime: assigned.actualStartTime || "Not Logged",
              actualEndTime: assigned.actualEndTime || "Not Logged",
              hours: hoursWorked,
              ratePerHour,
              totalPay: hoursWorked * ratePerHour,
              assignedDate,
            });
          });
        });
      });
    });

    return shiftList;
  }, [candidates, employees]);

  // Map week numbers (1 - 52) to set of unique employee initial letters present in that week
  const weekInitialsMap = useMemo(() => {
    const map = {};
    for (let i = 1; i <= 52; i++) {
      map[i] = new Set();
    }

    allMatchedShifts.forEach((shift) => {
      if (shift.weekNumber && shift.empName) {
        const initial = shift.empName.trim().charAt(0).toUpperCase();
        if (initial && map[shift.weekNumber]) {
          map[shift.weekNumber].add(initial);
        }
      }
    });

    return map;
  }, [allMatchedShifts]);

  // 52 Weeks Selector Labels with Employee Initial Badges (e.g. Week 32 [ K, S ])
  const weekOptions = useMemo(() => {
    return Array.from({ length: 52 }, (_, i) => {
      const weekNum = i + 1;
      const initialsSet = weekInitialsMap[weekNum];
      const initialsArr = initialsSet ? Array.from(initialsSet).sort() : [];
      const initialsSuffix =
        initialsArr.length > 0 ? ` [ ${initialsArr.join(", ")} ]` : "";

      return {
        id: weekNum,
        label: `Week ${weekNum}${initialsSuffix}`,
        hasData: initialsArr.length > 0,
        initials: initialsArr,
      };
    });
  }, [weekInitialsMap]);

  // Filter Shifts for the Selected Week
  const selectedWeekShifts = useMemo(() => {
    return allMatchedShifts.filter((s) => s.weekNumber === selectedWeek);
  }, [allMatchedShifts, selectedWeek]);

  // Group shifts by worker name for clean display
  const groupedWorkerShifts = useMemo(() => {
    const map = new Map();
    selectedWeekShifts.forEach((shift) => {
      if (!map.has(shift.empName)) {
        map.set(shift.empName, {
          empName: shift.empName,
          role: shift.role,
          shifts: [],
        });
      }
      map.get(shift.empName).shifts.push(shift);
    });
    return Array.from(map.values());
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

  return (
    <div className="accountsParentContainer">
      <div className="accountsHeader">
        <div>
          <h2>📋 PayRun Accounts Dashboard (52 Weeks View)</h2>
          <p className="accountsSubtext">
            Select a week to review matched worker placements, assigned sites,
            shift dates, actual hours worked, and payable wages.
          </p>
        </div>

        <div className="weekSelectorContainer">
          <label style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>
            Select Week:
          </label>
          <select
            className="accountsSearchInput"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
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
                <th>Role / Position</th>
                <th>Company / Client</th>
                <th>Site Name</th>
                <th>Assigned Date</th>
                <th>Scheduled Shift</th>
                <th>Actual Worked Time</th>
                <th>Hours</th>
                <th>Rate / Hr</th>
                <th>Total Pay</th>
              </tr>
            </thead>
            <tbody>
              {groupedWorkerShifts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="accountsEmpty">
                    No employee shift placements found for Week {selectedWeek}.
                  </td>
                </tr>
              ) : (
                groupedWorkerShifts.map((workerGroup) =>
                  workerGroup.shifts.map((shift, index) => {
                    const initialLetter = (
                      workerGroup.empName || "E"
                    )
                      .charAt(0)
                      .toUpperCase();
                    return (
                      <tr key={shift.id}>
                        {index === 0 ? (
                          <>
                            <td
                              className="empNameText"
                              rowSpan={workerGroup.shifts.length}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span className="empInitialAvatar">
                                  {initialLetter}
                                </span>
                                <span>{workerGroup.empName}</span>
                              </div>
                            </td>
                            <td rowSpan={workerGroup.shifts.length}>
                              {workerGroup.role}
                            </td>
                          </>
                        ) : null}
                        <td>🏢 {shift.companyName}</td>
                        <td>📍 {shift.siteName}</td>
                        <td>📅 {shift.assignedDate}</td>
                        <td>
                          ⏰ {shift.shiftStartTime} - {shift.shiftEndTime}
                        </td>
                        <td>
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
                        </td>
                        <td>{shift.hours} hrs</td>
                        <td>{formatCurrency(shift.ratePerHour)}</td>
                        <td style={{ fontWeight: "700", color: "#0f172a" }}>
                          {formatCurrency(shift.totalPay)}
                        </td>
                      </tr>
                    );
                  })
                )
              )}
              {groupedWorkerShifts.length > 0 && (
                <tr
                  style={{
                    background: "#f8fafc",
                    borderTop: "2px solid #e2e8f0",
                  }}
                >
                  <td
                    colSpan="9"
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