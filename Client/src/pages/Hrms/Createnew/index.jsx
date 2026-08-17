import { useState } from "react";
import axios from "axios";
import RegularForm from "../../../components/Layouts/FormLayouts/RegularForm";
import HrmsLeftLayout from "../Hrmsleftlayout";
import { sendApiData } from "../../../utils/apiClient";

import "./index.css";

function CreateCase() {
  const [formData, setFormData] = useState({
    caseId: "",
    requesterName: "",
    department: "",
    status: "",
    subStatus: "",
    category: "",
    assignmentGroup: "",
    assignTo: "",
    impact: "",
    urgency: "",
    priority: "",
    shortDescription: "",
    description: "",
  });
  const subStatusOptions = {
    Pending: ["Request Information Pending", "Vendor Action Pending"],
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await sendApiData("/api/cases/create", formData);

      alert("Case Saved Successfully");

      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error Saving Case");
    }
  };
  return (
    <HrmsLeftLayout>
      <RegularForm
        title="Create New Case"
        onSave={handleSave}
        onCancel={() => {}}
      >
        <div className="form-row">
          <label className="form-label">Case ID</label>
          <input
            className="form-input"
            name="caseId"
            value={formData.caseId}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Requester Name</label>
          <input
            className="form-input"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option>IT</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="Open">Open</option>
            <option value="Work In Progress">Work In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Sub Status</label>
          <select
            className="form-select"
            name="subStatus"
            value={formData.subStatus}
            onChange={handleChange}
            disabled={formData.status !== "Pending"}
          >
            <option value="">Select Sub Status</option>

            {subStatusOptions[formData.status]?.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>Payroll</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Assignment Group</label>
          <select
            className="form-select"
            name="assignmentGroup"
            value={formData.assignmentGroup}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="CNC">CNC</option>
            <option value="Accounts">Accounts</option>
            <option value="Operations">Operations</option>
            <option value="PetroLink">PetroLink</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Assign To</label>
          <input
            className="form-input"
            name="assignTo"
            value={formData.assignTo}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Impact</label>
          <select
            className="form-select"
            name="impact"
            value={formData.impact}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Urgency</label>
          <select
            className="form-select"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Priority</label>
          <input
            className="form-input"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          />
        </div>

        <div className="form-row form-full">
          <label className="form-label">Short Description</label>
          <textarea
            className="form-short-textarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          />
        </div>

        <div className="form-row form-full">
          <label className="form-label">Description</label>
          <textarea
            className="form-description-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </RegularForm>
    </HrmsLeftLayout>
  );
}

export default CreateCase;
