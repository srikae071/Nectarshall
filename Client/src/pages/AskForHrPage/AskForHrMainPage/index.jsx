// import HrmsLeftLayout from "../Hrmsleftlayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import AshrNavBar from "../AshrNavBar";
import "../../../styles/SharedFormStyle.css";
import { fetchApiData, sendApiData } from "../../../utils/apiClient";
import { useAuth } from "../../../context/AuthContext";

function AskForHrMainPage() {
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
  });
  const { id } = useParams();
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
    "Leave Request": ["Sick Leave", "Casual Leave", "Earned Leave"],
    "Payroll Query": ["Salary Issue", "Tax Query", "Bonus Query"],
    "Employee Relations": ["Conflict Resolution", "Grievance", "Feedback"],
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

      const response = await sendApiData("/api/hrrequests/create", {
        ...formData,
        requestType: "HR",
      });

      console.log(response.data);

      alert("HR Request Saved Successfully");

      setFormData({
        requester: "",
        requesterFor: "",
        category: "",
        subCategory: "",
        urgency: "",
        // shortDescription: "",
        // description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error Saving Request");
    }
  };

  return (
    <>
      <AshrNavBar />

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
                <option value="Leave Request">Leave Request</option>
                <option value="Payroll Query">Payroll Query</option>
                <option value="Employee Relations">Employee Relations</option>
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

          {/* TEXTAREAS */}

          <div className="lr-field">
            <label className="lr-label">Description</label>
            <textarea
              className="lr-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* BUTTONS */}
          <div className="lr-actions">
            <button
              type="button"
              className="lr-btn-cancel"
              onClick={() =>
                setFormData({
                  requesterName: "",
                  category: "",
                  urgency: "",
                  shortDescription: "",
                  description: "",
                })
              }
            >
              Cancel
            </button>

            <button type="button" className="lr-btn-submit" onClick={handleSave}>
              Save
            </button>

            <button type="button" className="lr-btn-submit" onClick={handleSave}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AskForHrMainPage;
