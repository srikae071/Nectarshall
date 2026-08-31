import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import ResonanceNav from "../ResonanceNav/index.jsx";
import "./index.css";

import "../../../../styles/SharedFormStyle.css";
import { sendApiData } from "../../../../utils/apiClient";

function ResonanceMain() {
  const { user } = useAuth();
  const currentUserName = user?.displayName || user?.username || "Employee";

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requesterName: currentUserName,
    requester: currentUserName,
    requesterFor: "Sumit",
    category: "",
    subCategory: "",
    urgency: "",
    shortDescription: "",
    description: "",
    workNotes: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      requesterName: currentUserName,
      requester: currentUserName,
      department: "",
      skillSet: "",
      experience: "",
      urgency: "",
      shortDescription: "",
      description: "",
    });
  };

  const handleSave = () => {
    alert("Employee Request Saved as Draft Successfully.");
  };

  const handleSubmit = async () => {
    if (!formData.shortDescription || !formData.shortDescription.trim()) {
      alert("Please enter a Short Description.");
      return;
    }
    try {
      await sendApiData("/api/jobrequests", {
        ...formData,
        category: "Employee Request",
        status: "Open",
        requestType: "Resonance",
      });
      alert("Employee Request Submitted Successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error Submitting Request");
    }
  };

  return (
    <>
      <ResonanceNav />

      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Create New Case</h2>

          <div className="section-header">EMPLOYEE DETAILS</div>

          {/* ROW 1 */}
          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Requester</label>
              <input
                className="lr-input"
                name="requesterName"
                value={currentUserName || formData.requesterName}
                readOnly
                disabled
                style={{ background: "#f1f5f9", cursor: "not-allowed" }}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Departmentss</label>
              <select
                className="lr-input"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Accounts">Accounts</option>
                <option value="Security">Security</option>
                <option value="Patrolling">Patrolling</option>
                <option value="Gardening">Gardening</option>
                <option value="C & C">C & C</option>
              </select>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Skill Set</label>
              <input
                className="lr-input"
                name="skillSet"
                value={formData.skillSet}
                onChange={handleChange}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Experience</label>
              <input
                className="lr-input"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Urgency</label>
              <select
                className="lr-input"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* SHORT DESCRIPTION */}
          <div className="lr-field" style={{ marginTop: "12px" }}>
            <label className="lr-label">Short Description *</label>
            <input
              type="text"
              className="lr-input"
              name="shortDescription"
              value={formData.shortDescription || ""}
              onChange={handleChange}
              placeholder="Enter short summary (1-2 lines)..."
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="lr-field" style={{ marginTop: "12px" }}>
            <label className="lr-label">Description</label>
            <textarea
              className="lr-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description..."
            />
          </div>

          {/* BUTTONS */}
          <div className="lr-actions">
            <button type="button" className="lr-btn-cancel" onClick={handleCancel}>
              Cancel
            </button>

            <button type="button" className="lr-btn-submit" style={{ background: "#64748b" }} onClick={handleSave}>
              Save
            </button>

            <button type="button" className="lr-btn-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResonanceMain;
