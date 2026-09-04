import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AshrNavBar from "../AshrNavBar";
import "../../../styles/SharedFormStyle.css";
import { fetchApiData, sendApiData } from "../../../utils/apiClient";
import { useAuth } from "../../../context/AuthContext";
import RequestedForSelect from "../../../components/RequestedForSelect";

function AskForHrMainPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentUserName = user?.displayName || user?.username || "Employee";

  const [formData, setFormData] = useState({
    requester: currentUserName,
    requesterFor: "",
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
  const handleCancel = () => {
    setFormData({
      requesterName: currentUserName,
      category: "",
      urgency: "",
      shortDescription: "",
      description: "",
    });
  };

  const handleSave = async () => {
    if (!formData.shortDescription || !formData.shortDescription.trim()) {
      alert("Please enter a Short Description.");
      return;
    }
    try {
      await sendApiData("/api/hrrequests/create", {
        ...formData,
        department: "HR",
        assignmentGroup: "HR",
        status: "Draft",
        requestType: "HR",
      });
      alert("HR Request Saved as Draft Successfully.");
      navigate("/hrms/hrsavescases");
    } catch (error) {
      console.error(error);
      alert("Error Saving Request as Draft");
    }
  };

  const handleSubmit = async () => {
    if (!formData.shortDescription || !formData.shortDescription.trim()) {
      alert("Please enter a Short Description.");
      return;
    }
    try {
      await sendApiData("/api/hrrequests/create", {
        ...formData,
        department: "HR",
        assignmentGroup: "HR",
        status: "Open",
        requestType: "HR",
      });
      alert("HR Request Submitted Successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error Submitting Request");
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

            <RequestedForSelect
              value={formData.requesterFor}
              onChange={handleChange}
            />
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

          <div className="lr-field" style={{ marginTop: "16px" }}>
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

          <div className="lr-field" style={{ marginTop: "16px" }}>
            <label className="lr-label">Description</label>
            <textarea
              className="lr-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description..."
            ></textarea>
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

export default AskForHrMainPage;
