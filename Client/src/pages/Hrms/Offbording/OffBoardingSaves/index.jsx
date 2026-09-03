import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import HrmsLeftLayout from "../../Hrmsleftlayout";
import ItLeftSide from "../../../NavItems/IT/ItLeftSide";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";
import AuditTimeline from "../../../../components/AuditTimeline";
import axios from "axios";
import "./index.css";

function OffBoardingSaves() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isItView = location.pathname.includes("/requests-offboarding");
  const LayoutComponent = isItView ? ItLeftSide : HrmsLeftLayout;

  const [formData, setFormData] = useState({
    caseId: "",
    requesterName: "",
    resignationDate: "",
    lastWorkingDay: "",
    resignationReason: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchApiData(`/api/jobrequests/${id}`);

      setFormData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [showHRForm, setShowHRForm] = useState(false);
  const [hrFormData, setHrFormData] = useState({
    relievingLetterIssued: "No",
    backupHired: "No",
    hrClearanceStatus: "Open",
  });

  useEffect(() => {
    if (formData) {
      setHrFormData({
        relievingLetterIssued: formData.relievingLetterIssued || "No",
        backupHired: formData.backupHired || "No",
        hrClearanceStatus: formData.hrClearanceStatus || formData.hrStatus || "Open",
      });
    }
  }, [formData]);

  const openITTask = () => {
    navigate("/requests-offboarding-all");
  };

  const openAccountsTask = () => {
    navigate("/accounts/offboarding-request/all");
  };

  const handleSave = async () => {
    try {
      await sendApiData(
        `/api/jobrequests/${id}`,
        formData,
        "put"
      );
      alert("Saved Successfully");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleHRSave = async () => {
    try {
      const currentStatus = hrFormData.hrClearanceStatus || "Work In Progress";
      const updatedData = {
        ...formData,
        relievingLetterIssued: hrFormData.relievingLetterIssued,
        backupHired: hrFormData.backupHired,
        hrClearanceStatus: currentStatus,
        hrStatus: currentStatus,
      };

      await sendApiData(`/api/jobrequests/${id}`, updatedData, "put");
      alert(`HR Clearance Task updated to "${currentStatus}"!`);

      const s = currentStatus.toLowerCase();
      if (s.includes("wip") || s.includes("work in progress")) {
        navigate("/offboarding-wip");
      } else if (s.includes("open")) {
        navigate("/offboarding-open");
      } else if (s.includes("closed")) {
        navigate("/offboarding-closed");
      } else if (s.includes("resolved")) {
        navigate("/offboarding-resolved");
      } else if (s.includes("pending")) {
        navigate("/offboarding-pending");
      } else {
        navigate("/offboarding-employes-all");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating HR Clearance Task");
    }
  };

  const itStatusVal = formData.itClearanceStatus || formData.ItTAskStatus || formData.itStatus || "Open";
  const finStatusVal = formData.financeClearanceStatus || formData.financeStatus || "Open";
  const hrStatusVal = formData.hrClearanceStatus || formData.hrStatus || "Open";

  const isItResolved =
    String(itStatusVal).toLowerCase() === "resolved" ||
    String(itStatusVal).toLowerCase() === "closed";

  const isFinanceResolved =
    String(finStatusVal).toLowerCase() === "resolved" ||
    String(finStatusVal).toLowerCase() === "closed";

  const isTask3Visible = isItResolved && isFinanceResolved;

  return (
    <LayoutComponent>
      <div className="OBSContainer">
        <div className="OBSCard">
          <h3 className="OBSHeading">Offboarding Employee Details</h3>

          <div className="OBSRow">
            <div className="OBSField">
              <label>Case ID / Task ID</label>
              <input value={formData.caseId || formData.taskId || ""} readOnly />
            </div>

            <div className="OBSField">
              <label>Requester Name</label>
              <input value={formData.requesterName || ""} readOnly />
            </div>
          </div>

          <div className="OBSRow">
            <div className="OBSField">
              <label>Date of Resignation</label>
              <input
                value={
                  formData.resignationDate
                    ? new Date(formData.resignationDate).toLocaleDateString()
                    : ""
                }
                readOnly
              />
            </div>

            <div className="OBSField">
              <label>Last Working Day (Editable by Admin)</label>
              <input
                type="date"
                name="lastWorkingDay"
                value={
                  formData.lastWorkingDay
                    ? new Date(formData.lastWorkingDay).toISOString().slice(0, 10)
                    : ""
                }
                onChange={handleChange}
                style={{ fontWeight: "600", color: "#0f172a" }}
              />
            </div>
          </div>

          <div className="OBSRow">
            <div className="OBSField">
              <label>Resignation Reason</label>
              <input value={formData.resignationReason || ""} readOnly />
            </div>

            <div className="OBSField">
              <label>Approval Status</label>
              <input type="text" value={formData.approvalStatus || (formData.status === "Open" ? "Pending" : formData.status || "Pending")} readOnly />
            </div>

            <div className="OBSField">
              <label>Onboarding Status</label>
              <input
                type="text"
                value={
                  ["resolved", "closed", "approved"].includes(String(itStatusVal).toLowerCase()) &&
                  ["resolved", "closed", "approved"].includes(String(finStatusVal).toLowerCase()) &&
                  ["resolved", "closed", "approved"].includes(String(formData.approvalStatus || formData.status || "Open").toLowerCase())
                    ? "Resolved"
                    : (formData.onboardingStatus || formData.offboardingStatus || "Open")
                }
                readOnly
                style={{
                  fontWeight: "700",
                  color: ["resolved", "closed", "approved"].includes(String(itStatusVal).toLowerCase()) &&
                         ["resolved", "closed", "approved"].includes(String(finStatusVal).toLowerCase()) &&
                         ["resolved", "closed", "approved"].includes(String(formData.approvalStatus || formData.status || "Open").toLowerCase())
                           ? "#166534"
                           : "#c2410c",
                  background: ["resolved", "closed", "approved"].includes(String(itStatusVal).toLowerCase()) &&
                              ["resolved", "closed", "approved"].includes(String(finStatusVal).toLowerCase()) &&
                              ["resolved", "closed", "approved"].includes(String(formData.approvalStatus || formData.status || "Open").toLowerCase())
                                ? "#dcfce7"
                                : "#ffedd5",
                }}
              />
            </div>
          </div>

          <div className="OBSDescription">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="OBSFooter">
            <button className="OBSButton" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        {(formData.status === "Approved" || formData.approvalStatus === "Approved" || formData.status === "Open" || true) && (
          <div className="OBSCard">
            <h3 className="OBSTaskHeading">Offboarding Clearance Tasks</h3>

            {/* TASK 1: IT CLEARANCE */}
            <div className="OBSTaskCard" onClick={openITTask} style={{ cursor: "pointer", marginBottom: "16px" }}>
              <div className="OBSTaskGrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center" }}>
                <div className="OBSTaskInfo">
                  <div className="OBSTaskTitle" style={{ fontWeight: "700" }}>Task 1 - IT Clearance</div>
                </div>

                <div className="OBSTaskItem" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <label style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Status</label>
                  <span className="OBSStatus" style={{ padding: "4px 14px", borderRadius: "12px", fontWeight: "700", fontSize: "12px", background: "#dbeafe", color: "#1e40af", display: "inline-block" }}>
                    {itStatusVal}
                  </span>
                </div>

                <div className="OBSTaskItem" style={{ textAlign: "right" }}>
                  <label style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Laptop Recovered</label>
                  <span className="OBSTaskValue" style={{ fontWeight: "700", color: "#334155" }}>
                    {formData.laptopRecovered || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* TASK 2: FINANCE / ACCOUNTS CLEARANCE */}
            <div className="OBSTaskCard" onClick={openAccountsTask} style={{ cursor: "pointer", marginBottom: "16px" }}>
              <div className="OBSTaskGrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center" }}>
                <div className="OBSTaskInfo">
                  <div className="OBSTaskTitle" style={{ fontWeight: "700" }}>Task 2 - Finance Clearance</div>
                </div>

                <div className="OBSTaskItem" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <label style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Status</label>
                  <span className="OBSStatus" style={{ padding: "4px 14px", borderRadius: "12px", fontWeight: "700", fontSize: "12px", background: "#fef3c7", color: "#92400e", display: "inline-block" }}>
                    {finStatusVal}
                  </span>
                </div>

                <div className="OBSTaskItem" style={{ textAlign: "right" }}>
                  <span className="OBSTaskValue" style={{ fontWeight: "600", color: "#94a3b8", fontSize: "12px" }}>
                    Accounts Clearance
                  </span>
                </div>
              </div>
            </div>

            {/* TASK 3: HR CLEARANCE (VISIBLE ONLY WHEN TASK 1 AND TASK 2 ARE RESOLVED/CLOSED) */}
            {isTask3Visible && (
              <>
                <div
                  className="OBSTaskCard"
                  onClick={() => setShowHRForm(!showHRForm)}
                  style={{ cursor: "pointer", borderLeft: showHRForm ? "4px solid #2563eb" : "none", marginBottom: "16px" }}
                >
                  <div className="OBSTaskGrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center" }}>
                    <div className="OBSTaskInfo">
                      <div className="OBSTaskTitle" style={{ fontWeight: "700" }}>Task 3 - HR Clearance</div>
                    </div>

                    <div className="OBSTaskItem" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <label style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Status</label>
                      <span className="OBSStatus" style={{ padding: "4px 14px", borderRadius: "12px", fontWeight: "700", fontSize: "12px", background: "#dcfce7", color: "#166534", display: "inline-block" }}>
                        {hrStatusVal}
                      </span>
                    </div>

                    <div className="OBSTaskItem" style={{ textAlign: "right" }}>
                      <span className="OBSTaskValue" style={{ fontWeight: "600", color: "#94a3b8", fontSize: "12px" }}>
                        HR Clearance
                      </span>
                    </div>
                  </div>
                </div>

                {/* HR CLEARANCE INLINE FORM CONTROLS */}
                {showHRForm && (
                  <div style={{ background: "#f8fafc", borderRadius: "8px", border: "1px solid #cbd5e1", padding: "20px", marginTop: "16px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
                      HR Clearance Form Controls
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Relieving Letter Issued</label>
                        <select
                          value={hrFormData.relievingLetterIssued}
                          onChange={(e) => setHrFormData({ ...hrFormData, relievingLetterIssued: e.target.value })}
                          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Backup Hired</label>
                        <select
                          value={hrFormData.backupHired}
                          onChange={(e) => setHrFormData({ ...hrFormData, backupHired: e.target.value })}
                          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>HR Clearance Status *</label>
                      <select
                        value={hrFormData.hrClearanceStatus}
                        onChange={(e) => setHrFormData({ ...hrFormData, hrClearanceStatus: e.target.value })}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontWeight: "700", fontSize: "14px" }}
                      >
                        <option value="Open">Open</option>
                        <option value="Work In Progress">Work In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                      <button
                        onClick={() => setShowHRForm(false)}
                        style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", fontWeight: "600", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleHRSave}
                        style={{ padding: "8px 20px", borderRadius: "6px", border: "none", background: "#2563eb", fontWeight: "700", cursor: "pointer", color: "#ffffff" }}
                      >
                        Save HR Clearance Task
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* AUDIT TIMELINE LOG & TIMESTAMPS */}
        <AuditTimeline data={formData} module="HRMS" />
      </div>
    </LayoutComponent>
  );
}

export default OffBoardingSaves;
