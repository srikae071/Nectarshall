import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ResonanceNav from "../ResonanceNav/index.jsx";
import "./index.css";

import { sendApiData } from "../../../../utils/apiClient";

function ResonanceMain() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requester: "",
    requesterFor: "",
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

  const handleSave = async () => {
    try {
      const response = await sendApiData("/api/jobrequests", {
        ...formData,
        category: "Employee Save",
        status: "Open",
        requestType: "Resonance",
      });
      navigate("/");

      console.log(response.data);

      alert("Resonance Request Saved Successfully");

      setFormData({
        requesterName: "",
        department: "",
        skillSet: "",
        experience: "",
        urgency: "",
        shortDescription: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error Saving Request");
    }
  };

  return (
    <>
      <ResonanceNav />

      <div className="CreateContainer">
        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Requester</label>
            <input
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Departmentss</label>

            <select
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

          <div className="CreateField">
            <label>Skill Set</label>

            <input
              name="skillSet"
              value={formData.skillSet}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Experience</label>

            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Urgency</label>

            <select
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
        <div className="CreateTextareaGroup">
          <label>Short Description</label>

          <textarea
            className="CreateTextarea shortTextarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="CreateTextareaGroup">
          <label>Description</label>

          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter detailed description..."
          />
        </div>

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button className="CreateBtn" onClick={handleSave}>
            Save
          </button>

          <button
            className="CreateBtn"
            onClick={() =>
              setFormData({
                requesterName: "",
                department: "",
                skillSet: "",
                experience: "",
                urgency: "",
                shortDescription: "",
                description: "",
              })
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default ResonanceMain;
