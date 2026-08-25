import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountsLayout from "../AccountsLayout";
import { fetchApiData, sendApiData } from "../../../utils/apiClient";
import "./index.css";

function AccountsTaskSaves() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskId: "",
    caseId: "",
    requesterName: "",
    resignationDate: "",
    lastWorkingDay: "",
    resignationReason: "",
    financeStatus: "Open",
    financeNotes: "",
    payrollCleared: "",
    expensesCleared: "",
    approvalStatus: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await fetchApiData(`/api/jobrequests/${id}`);
      const data = response.data || {};
      setFormData({
        ...data,
        financeStatus: data.financeStatus || data.financeClearanceStatus || "Open",
        financeClearanceStatus: data.financeClearanceStatus || data.financeStatus || "Open",
      });
    } catch (err) {
      console.error("Error fetching task details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const currentStatus = formData.financeStatus || "Work In Progress";
      const updatedData = {
        ...formData,
        financeStatus: currentStatus,
        financeClearanceStatus: currentStatus,
      };

      await sendApiData(`/api/jobrequests/${id}`, updatedData, "put");
      alert(`Accounts Offboarding Clearance Task Status updated to "${currentStatus}"!`);

      const statusLower = currentStatus.toLowerCase();
      if (statusLower.includes("wip") || statusLower.includes("work in progress")) {
        navigate("/accounts/offboarding-request/wip");
      } else if (statusLower.includes("open")) {
        navigate("/accounts/offboarding-request/open");
      } else if (statusLower.includes("closed")) {
        navigate("/accounts/offboarding-request/closed");
      } else if (statusLower.includes("resolved")) {
        navigate("/accounts/offboarding-request/resolved");
      } else if (statusLower.includes("pending")) {
        navigate("/accounts/offboarding-request/pending");
      } else {
        navigate("/accounts/offboarding-request/all");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating Accounts Clearance Task");
    }
  };

  return (
    <AccountsLayout>
      <div style={{ padding: "30px", background: "#e9e5e5", minHeight: "100vh", width: "100%", boxSizing: "border-box" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading Accounts Clearance details...</div>
        ) : (
          <div className="accountsTaskCard" style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #d9e2ef", padding: "28px", boxShadow: "0 5px 18px rgba(0,0,0,0.08)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#070b11", marginBottom: "22px", borderBottom: "2px solid #e2e8f0", paddingBottom: "12px" }}>
              Account Recovery & Offboarding Clearance Details
            </h2>

            {/* HEADER DETAILS SECTION */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Task ID</label>
                <input value={formData.taskId || formData.caseId || ""} readOnly style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: "700", color: "#2563eb" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Requester Name</label>
                <input value={formData.requesterName || formData.requester || ""} readOnly style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Date of Resignation</label>
                <input
                  value={
                    formData.resignationDate
                      ? new Date(formData.resignationDate).toLocaleDateString()
                      : "N/A"
                  }
                  readOnly
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Last Working Day</label>
                <input
                  value={
                    formData.lastWorkingDay
                      ? new Date(formData.lastWorkingDay).toLocaleDateString()
                      : "N/A"
                  }
                  readOnly
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Resignation Reason</label>
                <input value={formData.resignationReason || formData.description || "N/A"} readOnly style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Approval Status</label>
                <input value={formData.approvalStatus || (formData.status === "Open" ? "Pending" : formData.status || "Pending")} readOnly style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: "700" }} />
              </div>
            </div>

            <hr style={{ margin: "24px 0", border: "none", borderTop: "1px dashed #cbd5e1" }} />

            {/* ACCOUNTS CLEARANCE FORM CONTROLS */}
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
              Account Clearance Form Controls
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Payroll Final Settlement Cleared</label>
                <select
                  name="payrollCleared"
                  value={formData.payrollCleared || ""}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Expenses / Company Credit Card Cleared</label>
                <select
                  name="expensesCleared"
                  value={formData.expensesCleared || ""}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>Finance / Accounts Clearance Status *</label>
              <select
                name="financeStatus"
                value={formData.financeStatus || "Open"}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontWeight: "700", fontSize: "14px" }}
              >
                <option value="Open">Open</option>
                <option value="Work In Progress">Work In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => navigate("/accounts/offboarding-request/all")}
                style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: "600", cursor: "pointer", color: "#475569" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "#2563eb", fontWeight: "700", cursor: "pointer", color: "#ffffff" }}
              >
                Save Account Clearance Task
              </button>
            </div>
          </div>
        )}
      </div>
    </AccountsLayout>
  );
}

export default AccountsTaskSaves;
