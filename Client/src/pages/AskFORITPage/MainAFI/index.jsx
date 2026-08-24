import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import AskForItNavBar from "../AskForItNavBar";
import "./index.css";
import "../../../styles/SharedFormStyle.css";

import { fetchApiData, sendApiData } from "../../../utils/apiClient";
import { useAuth } from "../../../context/AuthContext";

function MainAFI() {
  const { user } = useAuth();
  const currentUserName = user?.displayName || user?.username || "Employee";

  const [formData, setFormData] = useState({
    requester: currentUserName,
    requesterFor: "Sumit",
    category: "",
    subCategory: "",
    urgency: "",
    shortDescription: "",
    description: "",
    workNotes: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetchApiData(`/api/itrequests/${id}`);

        setFormData({
          requester: response.data.requester || "",
          requesterFor: response.data.requesterFor || "",
          category: response.data.category || "",
          subCategory: response.data.subCategory || "",
          urgency: response.data.urgency || "",
          shortDescription: response.data.shortDescription || "",
          description: response.data.description || "",
          workNotes: response.data.workNotes || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchRequest();
    }
  }, [id]);
  const subCategoryOptions = {
    Network: ["Router", "LAN", "WAN"],
    Application: ["Zoho", "Guard House", "Light House"],
    "Desk Side Support": ["Laptop Issue", "Printer Issue", "System Slow"],
  };

  const handleChange = (e) => {
    console.log("name:", e.target.name, "value:", e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    console.log("FORM DATA BEFORE SAVE:", formData);
    try {
      console.log("Sending:", formData);

      const response = await sendApiData("/api/itrequests/create", {
        ...formData,
        requestType: "IT",
      });

      console.log(response.data);
      navigate("/"); // Home page route
      alert("IT Request Saved Successfully");

      setFormData({
        requester: "",
        requesterFor: "",
        category: "",
        subCategory: "",
        urgency: "",
        shortDescription: "",
        description: "",
        workNotes: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error Saving Request");
    }
  };

  return (
    <>
      <AskForItNavBar />

      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Ask For IT</h2>

          <div className="section-header">EMPLOYEE DETAILS</div>

          {/* ROW 1 */}
          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Requester</label>
              <input
                className="lr-input"
                name="requester"
                value={currentUserName || formData.requester}
                readOnly
                disabled
                style={{ background: "#f1f5f9", cursor: "not-allowed" }}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Requested For</label>
              <input
                className="lr-input"
                name="requesterFor"
                value="Sumit"
                readOnly
                disabled
                style={{ background: "#f1f5f9", cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Category</label>
              <select
                className="lr-input"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Network">Network</option>
                <option value="Application">Application</option>
                <option value="Desk Side Support">Desk Side Support</option>
              </select>
            </div>

            <div className="lr-field">
              <label className="lr-label">Sub Category</label>
              <select
                className="lr-input"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                disabled={!formData.category}
              >
                <option value="">Select</option>
                {subCategoryOptions[formData.category]?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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



          {/* DESCRIPTION */}
          <div className="lr-field">
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
          <div className="CreateFooter">
            <button
              type="button"
              className="CreateBtn btn-cancel"
              onClick={() =>
                setFormData({
                  requesterName: "",
                  category: "",
                  subCategory: "",
                  urgency: "",
                  shortDescription: "",
                  description: "",
                })
              }
            >
              Cancel
            </button>

            <button type="button" className="CreateBtn btn-submit" onClick={handleSave}>
              Save
            </button>

            <button type="button" className="CreateBtn btn-submit" onClick={handleSave}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainAFI;

