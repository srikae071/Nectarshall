import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItLeftSide from "../../../ItLeftSide";
import { fetchApiData, sendApiData } from "../../../../../../utils/apiClient";
import "./index.css";

function TaskSaves() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskId: "",
    caseId: "",
    requesterName: "",
    resignationDate: "",
    lastWorkingDay: "",
    resignationReason: "",
    laptopRecord: "",
    laptopRecovered: "",
    laptopWorkingCondition: "",
    dataBackup: "",
    emailIdReceived: "",
    taskStatus: "",
    status: "",
  });

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await fetchApiData(`/api/jobrequests/${id}`);
      const data = response.data || {};
      setFormData({
        ...data,
        taskStatus: data.taskStatus || data.itClearanceStatus || data.ItTAskStatus || "Open",
        itClearanceStatus: data.itClearanceStatus || data.ItTAskStatus || data.taskStatus || "Open",
        financeClearanceStatus: data.financeClearanceStatus || data.financeStatus || "Open",
        adminClearanceStatus: data.adminClearanceStatus || data.adminStatus || "Open",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const currentTaskStatus = formData.taskStatus || "Work In Progress";
      const updatedData = {
        ...formData,
        taskStatus: currentTaskStatus,
        ItTAskStatus: currentTaskStatus,
        itClearanceStatus: currentTaskStatus,
        itStatus: currentTaskStatus,
      };

      await sendApiData(`/api/jobrequests/${id}`, updatedData, "put");
      alert(`IT Offboarding Clearance Task Status updated to "${currentTaskStatus}"!`);

      const statusLower = currentTaskStatus.toLowerCase();
      if (statusLower.includes("wip") || statusLower.includes("work in progress")) {
        navigate("/requests-offboarding-wip");
      } else if (statusLower.includes("open")) {
        navigate("/requests-offboarding-open");
      } else if (statusLower.includes("closed")) {
        navigate("/requests-offboarding-closed");
      } else if (statusLower.includes("resolved")) {
        navigate("/requests-offboarding-resolved");
      } else if (statusLower.includes("pending")) {
        navigate("/requests-offboarding-pending");
      } else {
        navigate("/requests-offboarding-all");
      }
    } catch (err) {
      console.log(err);
      alert("Error updating IT Clearance Task");
    }
  };

  return (
    <ItLeftSide>
      <div className="ITSContainer">
        <div className="ITSCard">
          <h2 className="ITSHeading">IT Recovery & Offboarding Clearance Details</h2>

          {/* HEADER DETAILS SECTION */}
          <div className="ITSRow">
            <div className="ITSField ITSTaskIdField">
              <label>Task ID</label>
              <input value={formData.taskId || formData.caseId || ""} readOnly />
            </div>

            <div className="ITSField">
              <label>Requester Name</label>
              <input value={formData.requesterName || formData.requester || ""} readOnly />
            </div>
          </div>

          <div className="ITSRow">
            <div className="ITSField">
              <label>Date of Resignation</label>
              <input
                value={
                  formData.resignationDate
                    ? new Date(formData.resignationDate).toLocaleDateString()
                    : "N/A"
                }
                readOnly
              />
            </div>

            <div className="ITSField">
              <label>Last Working Day</label>
              <input
                value={
                  formData.lastWorkingDay
                    ? new Date(formData.lastWorkingDay).toLocaleDateString()
                    : "N/A"
                }
                readOnly
              />
            </div>
          </div>

          <div className="ITSRow">
            <div className="ITSField">
              <label>Resignation Reason</label>
              <input value={formData.resignationReason || formData.description || "N/A"} readOnly />
            </div>

            <div className="ITSField">
              <label>Approval Status</label>
              <input value={formData.approvalStatus || (formData.status === "Open" ? "Pending" : formData.status || "Pending")} readOnly />
            </div>
          </div>

          <hr style={{ margin: "20px 0", border: "none", borderTop: "1px dashed #cbd5e1" }} />

          {/* IT CLEARANCE FORM SECTION */}
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>
            IT Clearance Form Controls
          </h3>

          <div className="ITSRow">
            <div className="ITSField">
              <label>Laptop Record / Recovered</label>
              <select
                name="laptopRecovered"
                value={formData.laptopRecovered || formData.laptopRecord || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    laptopRecovered: e.target.value,
                    laptopRecord: e.target.value,
                  });
                }}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="ITSField">
              <label>Laptop Working Condition</label>
              <select
                name="laptopWorkingCondition"
                value={formData.laptopWorkingCondition || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="ITSRow">
            <div className="ITSField">
              <label>Data Backup</label>
              <select
                name="dataBackup"
                value={formData.dataBackup || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="ITSField">
              <label>Email ID Received</label>
              <select
                name="emailIdReceived"
                value={formData.emailIdReceived || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="ITSField">
              <label>IT Status</label>
              <select
                name="taskStatus"
                value={formData.taskStatus || formData.itStatus || "Open"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    taskStatus: e.target.value,
                    itStatus: e.target.value,
                    itClearanceStatus: e.target.value,
                    ItTAskStatus: e.target.value,
                  });
                }}
              >
                <option value="Open">Open</option>
                <option value="Work In Progress">Work In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Assigned to me">Assigned to me</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="ITSFooter">
            <button className="ITSButton" onClick={handleSave}>
              Save IT Clearance Task
            </button>
          </div>
        </div>
      </div>
    </ItLeftSide>
  );
}

export default TaskSaves;
