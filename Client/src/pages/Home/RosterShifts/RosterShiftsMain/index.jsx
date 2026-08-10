import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  fetchApiData,
  sendApiData,
  extractArrayData,
} from "../../../../utils/apiClient";
import logo from "../../../../images/logo.png";
import "./index.css";

function RosterShiftsMain() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [actualTimesMap, setActualTimesMap] = useState({});
  const [submittingRowId, setSubmittingRowId] = useState(null);
  const [submitSuccessRowId, setSubmitSuccessRowId] = useState(null);
  const [submittedRowIds, setSubmittedRowIds] = useState([]);

  // Weekday Options (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
  const WEEK_DAYS = [
    { id: "Monday", label: "Monday" },
    { id: "Tuesday", label: "Tuesday" },
    { id: "Wednesday", label: "Wednesday" },
    { id: "Thursday", label: "Thursday" },
    { id: "Friday", label: "Friday" },
    { id: "Saturday", label: "Saturday" },
    { id: "Sunday", label: "Sunday" },
  ];

  const getTasksForDay = (dayName) => {
    if (dayName === "Monday") {
      return [
        { id: "mon_task1", label: "🚽 Toilet Cleaning" },
        { id: "mon_task2", label: "📋 Task 2" },
        { id: "mon_task3", label: "📋 Task 3" },
        { id: "mon_task4", label: "📋 Task 4" },
        { id: "mon_task5", label: "📋 Task 5" },
      ];
    }
    return [
      { id: `${dayName.toLowerCase()}_task1`, label: `📋 ${dayName} Task 1` },
      { id: `${dayName.toLowerCase()}_task2`, label: `📋 ${dayName} Task 2` },
      { id: `${dayName.toLowerCase()}_task3`, label: `📋 ${dayName} Task 3` },
      { id: `${dayName.toLowerCase()}_task4`, label: `📋 ${dayName} Task 4` },
      { id: `${dayName.toLowerCase()}_task5`, label: `📋 ${dayName} Task 5` },
    ];
  };

  const [selectedTasksMap, setSelectedTasksMap] = useState(() => {
    const saved = localStorage.getItem("rosterSelectedTasks");
    return saved ? JSON.parse(saved) : {};
  });

  // Task Completion checklist tracking for PayRun +3.69% bonus per task
  const [completedTasksMap, setCompletedTasksMap] = useState(() => {
    const saved = localStorage.getItem("rosterCompletedTasks");
    return saved ? JSON.parse(saved) : {};
  });

  const handleSelectTask = (rowId, taskId) => {
    setSelectedTasksMap((prev) => {
      const updated = {
        ...prev,
        [rowId]: taskId,
      };
      localStorage.setItem("rosterSelectedTasks", JSON.stringify(updated));
      window.dispatchEvent(new Event("rosterTasksUpdated"));
      return updated;
    });
  };

  const handleToggleTaskCompletion = (rowId, taskId, isChecked, empName = "") => {
    setCompletedTasksMap((prev) => {
      const rowTasks =
        typeof prev[rowId] === "object" && prev[rowId] !== null
          ? { ...prev[rowId] }
          : {};
      rowTasks[taskId] = isChecked;

      const updated = {
        ...prev,
        [rowId]: rowTasks,
      };

      if (empName && empName.trim() !== "") {
        const empKey = empName.trim();
        const empTasks =
          typeof prev[empKey] === "object" && prev[empKey] !== null
            ? { ...prev[empKey] }
            : {};
        empTasks[taskId] = isChecked;
        updated[empKey] = empTasks;
      }

      localStorage.setItem("rosterCompletedTasks", JSON.stringify(updated));
      window.dispatchEvent(new Event("rosterTasksUpdated"));
      return updated;
    });
  };

  // Scope of Work Notepad Pop-up Modal State
  const [scopeModalData, setScopeModalData] = useState({
    isOpen: false,
    scopeOfWork: "",
    companyName: "",
    siteName: "",
    employeeName: "",
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/BoardingCandidates");
      setCandidates(extractArrayData(res.data));
    } catch (err) {
      console.error(
        "Error fetching candidates in Roster Shifts Main Page:",
        err,
      );
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Collect all assigned employee slot cards across candidates & contracts
  const assignedSlotRows = useMemo(() => {
    const rows = [];
    (candidates || []).forEach((cand) => {
      (cand.contractDeliverables || []).forEach((contract) => {
        // Standard Services
        (contract.services || []).forEach((svc, sIdx) => {
          const qty = Math.max(1, Number(svc.quantity) || 1);
          for (let q = 0; q < qty; q++) {
            const slotEmpObj = svc.assignedEmployees?.[q];
            const empName =
              slotEmpObj?.employee || (q === 0 ? svc.employee || "" : "");

            // Extract DB working days and tasks for this service / contract
            const rawWorkingDays =
              svc.workingDays ||
              contract.workingDays ||
              cand.workingDays ||
              [];

            const dbWorkingDays = [];
            if (Array.isArray(rawWorkingDays) && rawWorkingDays.length > 0) {
              rawWorkingDays.forEach((wd) => {
                if (typeof wd === "string" && wd.trim() !== "") {
                  dbWorkingDays.push({
                    day: wd.trim(),
                    tasks:
                      wd.trim() === "Monday"
                        ? ["Toilet Cleaning", "Task 2"]
                        : ["Task 1", "Task 2"],
                  });
                } else if (typeof wd === "object" && wd !== null && wd.day) {
                  const tasksList =
                    Array.isArray(wd.tasks) && wd.tasks.length > 0
                      ? wd.tasks
                      : wd.day === "Monday"
                      ? ["Toilet Cleaning", "Task 2"]
                      : ["Task 1", "Task 2"];
                  dbWorkingDays.push({
                    day: wd.day,
                    tasks: tasksList,
                  });
                }
              });
            }

            if (dbWorkingDays.length === 0) {
              dbWorkingDays.push(
                { day: "Monday", tasks: ["Toilet Cleaning", "Task 2", "Task 3"] },
                { day: "Tuesday", tasks: ["Toilet Cleaning", "Task 3", "Task 4"] },
                { day: "Wednesday", tasks: ["Task 2", "Task 3"] },
                { day: "Thursday", tasks: ["Task 4"] },
                { day: "Friday", tasks: ["Toilet Cleaning"] }
              );
            }

            if (empName && empName.trim() !== "") {
              rows.push({
                rowId: `${cand._id}_${contract._id}_${sIdx}_${q}`,
                candidateId: cand._id,
                contractId: contract._id,
                serviceIndex: sIdx,
                slotIndex: q,
                slotLabel: `Slot ${q + 1}`,
                isAdhoc: false,
                employeeName: empName.trim(),
                hasEmployee: true,
                companyName:
                  cand.companyName || cand.requester || "Unnamed Company",
                siteName: contract.siteName || "N/A",
                siteAddress: contract.siteAddress || contract.siteName || "N/A",
                typeOfService: "General",
                position: svc.position || "N/A",
                shiftStartTime: svc.shiftStartTime || "08:00",
                shiftEndTime: svc.shiftEndTime || "16:00",
                actualStartTime:
                  slotEmpObj?.actualStartTime || svc.shiftStartTime || "08:00",
                actualEndTime:
                  slotEmpObj?.actualEndTime || svc.shiftEndTime || "16:00",
                approvalState: slotEmpObj?.approvalState || "Pending",
                isSubmitted: slotEmpObj?.isSubmitted === true,
                dbWorkingDays,
                contractObj: contract,
                candObj: cand,
              });
            }
          }
        });

        // Adhoc Services (Included always if adhoc service exists)
        (contract.adhocServices || []).forEach((adhoc, aIdx) => {
          const empName = adhoc.employee || "";
          rows.push({
            rowId: `${cand._id}_${contract._id}_adhoc_${aIdx}`,
            candidateId: cand._id,
            contractId: contract._id,
            adhocIndex: aIdx,
            isAdhoc: true,
            slotLabel: "ADHOC",
            employeeName:
              empName && empName.trim() !== ""
                ? empName.trim()
                : "Unassigned (Assign in Roster)",
            hasEmployee: Boolean(empName && empName.trim() !== ""),
            companyName:
              cand.companyName || cand.requester || "Unnamed Company",
            siteName: contract.siteName || "N/A",
            siteAddress: contract.siteAddress || contract.siteName || "N/A",
            typeOfService: "Adhoc",
            position: "Adhoc",
            shiftStartTime: adhoc.shiftStartTime || "08:00",
            shiftEndTime: adhoc.shiftEndTime || "16:00",
            actualStartTime:
              adhoc.actualStartTime || adhoc.shiftStartTime || "08:00",
            actualEndTime: adhoc.actualEndTime || adhoc.shiftEndTime || "16:00",
            scopeOfWork: adhoc.scopeOfWork || "",
            approvalState: adhoc.approvalState || "Pending",
            isSubmitted: adhoc.isSubmitted === true,
            contractObj: contract,
            candObj: cand,
          });
        });
      });
    });
    return rows;
  }, [candidates]);

  // Group assigned rows by Company Name
  const groupedByCompany = useMemo(() => {
    const groups = {};
    assignedSlotRows.forEach((row) => {
      const comp = row.companyName || "Other Companies";
      if (!groups[comp]) {
        groups[comp] = [];
      }
      groups[comp].push(row);
    });
    return groups;
  }, [assignedSlotRows]);

  const handleTimeChange = (rowId, field, value) => {
    setActualTimesMap((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const handleSaveActualTimes = async (rowItem) => {
    try {
      setSubmittingRowId(rowItem.rowId);
      setSubmitSuccessRowId(null);

      const candidate = candidates.find((c) => c._id === rowItem.candidateId);
      if (!candidate) return;

      const contract = (candidate.contractDeliverables || []).find(
        (c) => c._id === rowItem.contractId,
      );
      if (!contract) return;

      let updatedServices = JSON.parse(JSON.stringify(contract.services || []));
      let updatedAdhocServices = JSON.parse(
        JSON.stringify(contract.adhocServices || []),
      );

      const curTimes = actualTimesMap[rowItem.rowId] || {};
      const actStart =
        curTimes.actualStartTime || rowItem.actualStartTime || "08:00";
      const actEnd = curTimes.actualEndTime || rowItem.actualEndTime || "16:00";

      if (rowItem.isAdhoc) {
        if (updatedAdhocServices[rowItem.adhocIndex]) {
          updatedAdhocServices[rowItem.adhocIndex].actualStartTime = actStart;
          updatedAdhocServices[rowItem.adhocIndex].actualEndTime = actEnd;
          updatedAdhocServices[rowItem.adhocIndex].approvalState = "Accepted";
          updatedAdhocServices[rowItem.adhocIndex].isSubmitted = true;
        }
      } else {
        if (updatedServices[rowItem.serviceIndex]) {
          const targetSvc = updatedServices[rowItem.serviceIndex];
          const qty = Math.max(1, Number(targetSvc.quantity) || 1);
          let assigned = targetSvc.assignedEmployees || [];
          while (assigned.length < qty) {
            assigned.push({
              employee: "",
              isYellow: false,
              approvalState: "Pending",
            });
          }

          assigned[rowItem.slotIndex] = {
            ...assigned[rowItem.slotIndex],
            employee: rowItem.employeeName,
            actualStartTime: actStart,
            actualEndTime: actEnd,
            approvalState: "Accepted",
            isSubmitted: true,
          };

          targetSvc.assignedEmployees = assigned;
        }
      }

      await sendApiData(
        "PUT",
        `/api/BoardingCandidates/${rowItem.candidateId}/contracts/${rowItem.contractId}/services`,
        {
          services: updatedServices,
          adhocServices: updatedAdhocServices,
        },
      );

      setSubmitSuccessRowId(rowItem.rowId);
      setSubmittedRowIds((prev) => [...prev, rowItem.rowId]);
      await fetchCandidates();
      setTimeout(() => setSubmitSuccessRowId(null), 3000);
    } catch (err) {
      console.error("Error saving actual times:", err);
      alert(`Failed to save actual times: ${err.message}`);
    } finally {
      setSubmittingRowId(null);
    }
  };

  const handleUpdateApproval = async (rowItem, newStatus) => {
    if (!rowItem.hasEmployee) {
      alert(
        "Please assign an employee to this Adhoc shift in the Roster first before approving/rejecting.",
      );
      return;
    }

    const actionKey = `${rowItem.rowId}_${newStatus}`;
    try {
      setActionLoadingId(actionKey);

      const candidate = candidates.find((c) => c._id === rowItem.candidateId);
      if (!candidate) return;

      const contract = (candidate.contractDeliverables || []).find(
        (c) => c._id === rowItem.contractId,
      );
      if (!contract) return;

      let updatedServices = JSON.parse(JSON.stringify(contract.services || []));
      let updatedAdhocServices = JSON.parse(
        JSON.stringify(contract.adhocServices || []),
      );

      if (rowItem.isAdhoc) {
        if (updatedAdhocServices[rowItem.adhocIndex]) {
          updatedAdhocServices[rowItem.adhocIndex].approvalState = newStatus;
          updatedAdhocServices[rowItem.adhocIndex].isYellow =
            newStatus !== "Accepted" && newStatus !== "Rejected";
        }
      } else {
        if (updatedServices[rowItem.serviceIndex]) {
          const targetSvc = updatedServices[rowItem.serviceIndex];
          const qty = Math.max(1, Number(targetSvc.quantity) || 1);
          let assigned = targetSvc.assignedEmployees || [];
          while (assigned.length < qty) {
            assigned.push({
              employee: "",
              isYellow: false,
              approvalState: "Pending",
            });
          }

          assigned[rowItem.slotIndex] = {
            ...assigned[rowItem.slotIndex],
            employee: rowItem.employeeName,
            approvalState: newStatus,
            isYellow: newStatus !== "Accepted" && newStatus !== "Rejected",
          };

          targetSvc.assignedEmployees = assigned;
        }
      }

      await sendApiData(
        "PUT",
        `/api/BoardingCandidates/${rowItem.candidateId}/contracts/${rowItem.contractId}/services`,
        {
          services: updatedServices,
          adhocServices: updatedAdhocServices,
        },
      );

      await fetchCandidates();
    } catch (err) {
      console.error("Error updating approval state:", err);
      alert(`Failed to update approval status: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderApprovalRow = (row) => {
    const isAccepted = row.approvalState === "Accepted";
    const isRejected = row.approvalState === "Rejected";
    const isRowSubmitted =
      row.isSubmitted || submittedRowIds.includes(row.rowId);

    return (
      <tr
        key={row.rowId}
        className={
          isAccepted ? "rowAccepted" : isRejected ? "rowRejected" : "rowPending"
        }
      >
        <td className="empNameCol">
          <span className="empNameTxt">
            👤 {row.employeeName}{" "}
            <strong className="slotBadge">({row.slotLabel})</strong>
          </span>
        </td>

        <td className="siteAddressCol">
          <span className="siteAddressTxt">📍 {row.siteAddress}</span>
        </td>

        <td className="serviceCol">
          <span className="serviceTag">{row.typeOfService}</span>
        </td>

        <td className="positionCol">
          <span className="positionTxt">{row.position}</span>
        </td>

        <td className="shiftTimeCol">
          <span className="shiftTimeTxt">🕒 {row.shiftStartTime}</span>
        </td>

        <td className="shiftTimeCol">
          <span className="shiftTimeTxt">🕒 {row.shiftEndTime}</span>
        </td>

        {/* Scope of Work Notepad Icon Column for Adhoc Rows */}
        {row.isAdhoc && (
          <td className="scopeCol">
            <button
              type="button"
              className="scopeNotepadBtn"
              title="Click to view Scope of Work"
              onClick={() =>
                setScopeModalData({
                  isOpen: true,
                  scopeOfWork:
                    row.scopeOfWork ||
                    "No scope of work provided for this adhoc shift.",
                  companyName: row.companyName,
                  siteName: row.siteName,
                  employeeName: row.employeeName,
                })
              }
            >
              📝 View Scope
            </button>
          </td>
        )}

        <td className="taskChecklistCol">
          <div className="taskChecklistWrap" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569" }}>
                Working Day:
              </label>
              <select
                style={{
                  padding: "3px 6px",
                  borderRadius: "4px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "11.5px",
                  fontWeight: "600",
                  color: "#0f172a",
                  outline: "none",
                  background: "#ffffff",
                }}
                value={selectedTasksMap[row.rowId] || (row.dbWorkingDays?.[0]?.day || "Monday")}
                onChange={(e) => handleSelectTask(row.rowId, e.target.value)}
              >
                {(row.dbWorkingDays || []).map((wd) => (
                  <option key={wd.day} value={wd.day}>
                    {wd.day} ({wd.tasks.length} Task{wd.tasks.length > 1 ? "s" : ""})
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const activeDayName =
                selectedTasksMap[row.rowId] || (row.dbWorkingDays?.[0]?.day || "Monday");

              const activeDayObj =
                (row.dbWorkingDays || []).find((d) => d.day === activeDayName) ||
                (row.dbWorkingDays || [])[0] ||
                { day: "Monday", tasks: ["Toilet Cleaning", "Task 2"] };

              const dayTasks = activeDayObj.tasks || [];
              const rowTaskState =
                typeof completedTasksMap[row.rowId] === "object" &&
                completedTasksMap[row.rowId] !== null
                  ? completedTasksMap[row.rowId]
                  : {};

              const completedCount = dayTasks.filter((tName) => {
                const taskKey = `${activeDayName}_${tName}`;
                return Boolean(
                  rowTaskState[taskKey] ||
                  rowTaskState[tName] ||
                  (tName === "Task 1" && rowTaskState["Toilet Cleaning"])
                );
              }).length;

              const bonusPercent = (completedCount * 3.69).toFixed(2);

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "2px" }}>
                  {dayTasks.map((tName, tIdx) => {
                    const taskLabel =
                      tName === "Task 1" || tName === "Toilet Cleaning"
                        ? "Toilet Cleaning"
                        : tName;

                    const taskKey = `${activeDayName}_${tName}`;
                    const isChecked = Boolean(
                      rowTaskState[taskKey] ||
                      rowTaskState[tName] ||
                      rowTaskState[taskLabel]
                    );

                    return (
                      <label
                        key={tIdx}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "11.5px",
                          fontWeight: "600",
                          cursor: "pointer",
                          color: "#0f172a",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleToggleTaskCompletion(
                              row.rowId,
                              taskKey,
                              e.target.checked,
                              row.employeeName
                            )
                          }
                        />
                        <span>
                          {taskLabel === "Toilet Cleaning"
                            ? "🚽 Toilet Cleaning"
                            : `📋 ${taskLabel}`}
                        </span>
                      </label>
                    );
                  })}

                  {completedCount > 0 ? (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#166534",
                        background: "#dcfce7",
                        border: "1px solid #bbf7d0",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        display: "inline-block",
                        marginTop: "4px",
                      }}
                    >
                      ✓ {completedCount} Task{completedCount > 1 ? "s" : ""} Checked (+{bonusPercent}% Bonus)
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#64748b",
                        marginTop: "4px",
                      }}
                    >
                      Pending Checklist (0 Tasks Checked)
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
        </td>

        <td className="actionCol">
          {!row.hasEmployee ? (
            <span
              style={{
                fontSize: "11.5px",
                color: "#64748b",
                fontStyle: "italic",
              }}
            >
              Pending Assignment in Roster
            </span>
          ) : isAccepted ? (
            <div className="acceptedActionBox">
              <div className="statusBadge flexBadge acceptedBadge">
                <span>✓ Accepted</span>
                <button
                  className="changeStatusBtn"
                  onClick={() => handleUpdateApproval(row, "Pending")}
                  title="Re-evaluate"
                >
                  Reset
                </button>
              </div>

              <div className="actualTimesForm">
                <div className="actualTimeField">
                  <label htmlFor={`actStart_${row.rowId}`}>Actual Start:</label>
                  <input
                    id={`actStart_${row.rowId}`}
                    type="time"
                    className="actualTimeInput"
                    value={
                      actualTimesMap[row.rowId]?.actualStartTime ??
                      row.actualStartTime
                    }
                    onChange={(e) =>
                      handleTimeChange(
                        row.rowId,
                        "actualStartTime",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className="actualTimeField">
                  <label htmlFor={`actEnd_${row.rowId}`}>Actual End:</label>
                  <input
                    id={`actEnd_${row.rowId}`}
                    type="time"
                    className="actualTimeInput"
                    value={
                      actualTimesMap[row.rowId]?.actualEndTime ??
                      row.actualEndTime
                    }
                    onChange={(e) =>
                      handleTimeChange(
                        row.rowId,
                        "actualEndTime",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <button
                  type="button"
                  className={`submitActualTimesBtn ${
                    isRowSubmitted ? "submittedBtn" : ""
                  }`}
                  disabled={submittingRowId === row.rowId}
                  onClick={() => handleSaveActualTimes(row)}
                >
                  {submittingRowId === row.rowId
                    ? "Submitting..."
                    : isRowSubmitted
                      ? "✓ Submitted"
                      : "Submit"}
                </button>

                {submitSuccessRowId === row.rowId && (
                  <span className="actualTimeSuccessMsg">✓ Submitted!</span>
                )}
              </div>
            </div>
          ) : isRejected ? (
            <div className="statusBadge flexBadge rejectedBadge">
              <span>✕ Rejected</span>
              <button
                className="changeStatusBtn"
                onClick={() => handleUpdateApproval(row, "Pending")}
                title="Re-evaluate"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="btnGroup">
              <button
                className="acceptBtn"
                disabled={actionLoadingId !== null}
                onClick={() => handleUpdateApproval(row, "Accepted")}
              >
                {actionLoadingId === `${row.rowId}_Accepted`
                  ? "Saving..."
                  : "Accept"}
              </button>
              <button
                className="rejectBtn"
                disabled={actionLoadingId !== null}
                onClick={() => handleUpdateApproval(row, "Rejected")}
              >
                {actionLoadingId === `${row.rowId}_Rejected`
                  ? "Saving..."
                  : "Reject"}
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="OPPage">
      <div className="navbar">
        <div className="logo">
          <img
            src={logo}
            className="logoimage"
            alt="Logo"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="navTitle">Shift Approvals</div>
        {/* <button
          type="button"
          style={{
            marginLeft: "auto",
            marginRight: "20px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/roster")}
        >
          📋 Go to Roster Main ➔
        </button> */}
      </div>

      <div className="opContentContainer">
        <div className="opHeaderBlock">
          <h2>Employee Shift Assignment Approval List</h2>
          <p>
            Review assigned shift employees & adhoc requests from the Roster,
            grouped by company name.
          </p>
        </div>

        {loading ? (
          <div className="opLoading">Loading employee shift assignments...</div>
        ) : Object.keys(groupedByCompany).length === 0 ? (
          <div className="opEmptyState">
            No employee slot assignments found requiring approval.
          </div>
        ) : (
          Object.entries(groupedByCompany).map(([companyName, rows]) => {
            const standardRows = rows.filter((r) => !r.isAdhoc);
            const adhocRows = rows.filter((r) => r.isAdhoc);

            return (
              <div className="opCompanyCard" key={companyName}>
                <div className="opCompanyCardHeader">
                  <span className="opCompanyTitle">🏢 {companyName}</span>
                  <span className="opCompanyBadge">
                    {rows.length} Total Request{rows.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Standard Shift Requests Table */}
                {standardRows.length > 0 && (
                  <div className="opTableCard">
                    <table className="opApprovalTable">
                      <thead>
                        <tr>
                          <th>Employee Name</th>
                          <th>Site Address</th>
                          <th>Type</th>
                          <th>Position</th>
                          <th>Shift Start Time</th>
                          <th>Shift End Time</th>
                          <th>Task Checklist</th>
                          <th>Accept / Reject</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standardRows.map((row) => renderApprovalRow(row))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Adhoc Shift Requests Section */}
                {adhocRows.length > 0 && (
                  <div className="opAdhocSection">
                    <div className="opAdhocSubheader">
                      ⚡ Adhoc Approvals ({adhocRows.length})
                    </div>
                    <div className="opTableCard">
                      <table className="opApprovalTable">
                        <thead>
                          <tr>
                            <th>Employee Name</th>
                            <th>Site Address</th>
                            <th>Type</th>
                            <th>Position</th>
                            <th>Shift Start Time</th>
                            <th>Shift End Time</th>
                            <th>Scope of Work</th>
                            <th>Task Checklist</th>
                            <th>Accept / Reject</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adhocRows.map((row) => renderApprovalRow(row))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Scope of Work Notepad Pop-up Modal */}
      {scopeModalData.isOpen && (
        <div className="scopeModalOverlay">
          <div className="scopeModalBox">
            <div className="scopeModalHeader">
              <h3>📝 Scope of Work</h3>
              <button
                className="closeModalX"
                onClick={() => setScopeModalData({ isOpen: false })}
              >
                ✕
              </button>
            </div>

            <div className="scopeModalMeta">
              <div>
                🏢 <strong>Company:</strong> {scopeModalData.companyName}
              </div>
              <div>
                📍 <strong>Site:</strong> {scopeModalData.siteName}
              </div>
              <div>
                👤 <strong>Employee:</strong> {scopeModalData.employeeName}
              </div>
            </div>

            <div className="scopeModalContent">
              {scopeModalData.scopeOfWork}
            </div>

            <div className="scopeModalFooter">
              <button
                className="closeScopeBtn"
                onClick={() => setScopeModalData({ isOpen: false })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RosterShiftsMain;
