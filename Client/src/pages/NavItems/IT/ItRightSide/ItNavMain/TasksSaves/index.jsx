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
    laptopRecord: "",
    laptopRecovered: "",
    laptopWorkingCondition: "",
    dataBackup: "",
    emailIdReceived: "",
    taskStatus: "",
  });

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await fetchApiData(`/api/jobrequests/${id}`);
      setFormData(response.data);
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
      await sendApiData(`/api/jobrequests/${id}`, formData, "put");
      alert("IT Offboarding Clearance Task Updated Successfully!");
      navigate("/requests-offboarding-all");
    } catch (err) {
      console.log(err);
      alert("Error updating IT Clearance Task");
    }
  };

  return (
    <ItLeftSide>
      <div className="ITSContainer">
        <div className="ITSCard">
          <h2 className="ITSHeading">IT Recovery & Offboarding Clearance</h2>

          <div className="ITSRow">
            <div className="ITSField ITSTaskIdField">
              <label>Task / Case ID</label>
              <input value={formData.taskId || formData.caseId || ""} readOnly />
            </div>

            <div className="ITSField">
              <label>Requester Name</label>
              <input value={formData.requesterName || formData.requester || ""} readOnly />
            </div>
          </div>

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
              <label>Task Status</label>
              <select
                name="taskStatus"
                value={formData.taskStatus || ""}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
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
