import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import "./index.css";

function OpMainPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

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
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Error fetching candidates in OP Main Page:", err);
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
                companyName: cand.companyName || cand.requester || "Unnamed Company",
                siteName: contract.siteName || "N/A",
                siteAddress: contract.siteAddress || contract.siteName || "N/A",
                typeOfService: svc.serviceType || svc.position || "Shift",
                position: svc.position || "N/A",
                shiftStartTime: svc.shiftStartTime || "08:00",
                shiftEndTime: svc.shiftEndTime || "16:00",
                approvalState: slotEmpObj?.approvalState || "Pending",
                contractObj: contract,
                candObj: cand,
              });
            }
          }
        });

        // Adhoc Services
        (contract.adhocServices || []).forEach((adhoc, aIdx) => {
          const empName = adhoc.employee || "";
          if (empName && empName.trim() !== "") {
            rows.push({
              rowId: `${cand._id}_${contract._id}_adhoc_${aIdx}`,
              candidateId: cand._id,
              contractId: contract._id,
              adhocIndex: aIdx,
              isAdhoc: true,
              slotLabel: "ADHOC",
              employeeName: empName.trim(),
              companyName: cand.companyName || cand.requester || "Unnamed Company",
              siteName: contract.siteName || "N/A",
              siteAddress: contract.siteAddress || contract.siteName || "N/A",
              typeOfService: adhoc.serviceType || "Adhoc Service",
              position: adhoc.position || (contract.services?.[0]?.position) || "Adhoc",
              shiftStartTime: adhoc.shiftStartTime || "08:00",
              shiftEndTime: adhoc.shiftEndTime || "16:00",
              approvalState: adhoc.approvalState || "Pending",
              contractObj: contract,
              candObj: cand,
            });
          }
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

  const handleUpdateApproval = async (rowItem, newStatus) => {
    const actionKey = `${rowItem.rowId}_${newStatus}`;
    try {
      setActionLoadingId(actionKey);

      const candidate = candidates.find((c) => c._id === rowItem.candidateId);
      if (!candidate) return;

      const contract = (candidate.contractDeliverables || []).find(
        (c) => c._id === rowItem.contractId
      );
      if (!contract) return;

      let updatedServices = JSON.parse(
        JSON.stringify(contract.services || [])
      );
      let updatedAdhocServices = JSON.parse(
        JSON.stringify(contract.adhocServices || [])
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
            assigned.push({ employee: "", isYellow: false, approvalState: "Pending" });
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

      const apiUrl = `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${rowItem.candidateId}/contracts/${rowItem.contractId}/services`;

      try {
        await axios.put(apiUrl, {
          services: updatedServices,
          adhocServices: updatedAdhocServices,
        });
      } catch (err) {
        await axios.put(
          `/api/BoardingCandidates/${rowItem.candidateId}/contracts/${rowItem.contractId}/services`,
          {
            services: updatedServices,
            adhocServices: updatedAdhocServices,
          }
        );
      }

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

    return (
      <tr
        key={row.rowId}
        className={
          isAccepted
            ? "rowAccepted"
            : isRejected
            ? "rowRejected"
            : "rowPending"
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

        <td className="actionCol">
          {isAccepted ? (
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
        <div className="navTitle">Organisation Policies & Approvals</div>
      </div>

      <div className="opContentContainer">
        <div className="opHeaderBlock">
          <h2>Employee Shift Assignment Approval List</h2>
          <p>
            Review assigned shift employees from the Roster, grouped by company name.
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
                          <th>Type of Service</th>
                          <th>Position</th>
                          <th>Shift Start Time</th>
                          <th>Shift End Time</th>
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
                      ⚡ Adhoc Requests ({adhocRows.length})
                    </div>
                    <div className="opTableCard">
                      <table className="opApprovalTable">
                        <thead>
                          <tr>
                            <th>Employee Name</th>
                            <th>Site Address</th>
                            <th>Type of Service</th>
                            <th>Position</th>
                            <th>Shift Start Time</th>
                            <th>Shift End Time</th>
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
    </div>
  );
}

export default OpMainPage;
