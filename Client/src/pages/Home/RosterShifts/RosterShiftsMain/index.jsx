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

  // Task Dropdown Options (Monday: Toilet Cleaning, Tuesday: Dusting & Vacuuming, etc.)
  const AVAILABLE_TASKS = [
    { id: "toilet_cleaning", label: "🚽 Toilet Cleaning (Monday)", day: "Monday" },
    { id: "dusting_vacuuming", label: "🧹 Dusting & Vacuuming (Tuesday)", day: "Tuesday" },
    { id: "sanitization", label: "🧼 Sanitization & Washroom (Wednesday)", day: "Wednesday" },
    { id: "waste_disposal", label: "🗑️ Waste Disposal & Bins (Thursday)", day: "Thursday" },
    { id: "floor_mopping", label: "🧽 Floor Mopping & Buffing (Friday)", day: "Friday" },
    { id: "window_cleaning", label: "🪟 Window & Glass Cleaning (Saturday)", day: "Saturday" },
    { id: "inventory_restock", label: "📦 Inventory & Restock (Sunday)", day: "Sunday" },
  ];

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

  const handleToggleTaskCompletion = (rowId, taskId, isChecked) => {
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
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569" }}>
              Task Assignment:
            </label>
            <select
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1.5px solid #cbd5e1",
                fontSize: "12px",
                fontWeight: "600",
                color: "#0f172a",
                outline: "none",
                background: "#ffffff",
              }}
              value={selectedTasksMap[row.rowId] || "toilet_cleaning"}
              onChange={(e) => handleSelectTask(row.rowId, e.target.value)}
            >
              {AVAILABLE_TASKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            {(() => {
              const activeTaskId = selectedTasksMap[row.rowId] || "toilet_cleaning";
              const activeTaskObj =
                AVAILABLE_TASKS.find((t) => t.id === activeTaskId) ||
                AVAILABLE_TASKS[0];

              const isChecked = Boolean(
                completedTasksMap[row.rowId]?.[activeTaskId] ||
                  completedTasksMap[row.rowId] === true,
              );

              // Calculate total completed tasks for this shift row (each adds +3.69%)
              const completedCount =
                typeof completedTasksMap[row.rowId] === "object" &&
                completedTasksMap[row.rowId] !== null
                  ? Object.values(completedTasksMap[row.rowId]).filter(Boolean).length
                  : isChecked
                  ? 1
                  : 0;

              const totalBonusPercent = completedCount * 3.69;

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "2px" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", color: "#0f172a" }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleToggleTaskCompletion(row.rowId, activeTaskId, e.target.checked)
                      }
                    />
                    <span>{activeTaskObj.label}</span>
                  </label>
                  {completedCount > 0 ? (
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#166534", background: "#dcfce7", border: "1px solid #bbf7d0", padding: "2px 6px", borderRadius: "4px", display: "inline-block" }}>
                      ✓ {completedCount} Task{completedCount > 1 ? "s" : ""} Completed (+{totalBonusPercent.toFixed(2)}% Bonus)
                    </span>
                  ) : (
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>
                      Pending Checklist
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
