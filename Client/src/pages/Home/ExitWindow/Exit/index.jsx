import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { sendApiData } from "../../../../utils/apiClient";
import ResonanceNav from "../ExitNav";
import "./index.css";
import "../../../../styles/SharedFormStyle.css";

function Exit() {
  const { user } = useAuth();
  const currentUserName = user?.displayName || user?.username || "Employee";

  const [formData, setFormData] = useState({
    requesterName: currentUserName,
    resignationDate: "",
    lastWorkingDay: "",
    resignationReason: "",
    shortDescription: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "resignationDate") {
      const selectedDate = new Date(value);
      let workingDays = 0;
      let nextDate = new Date(selectedDate);

      while (workingDays < 10) {
        nextDate.setDate(nextDate.getDate() + 1);
        const day = nextDate.getDay();
        if (day !== 0 && day !== 6) {
          workingDays++;
        }
      }

      const lastWorkingDay = nextDate.toISOString().split("T")[0];

      setFormData({
        ...formData,
        resignationDate: value,
        lastWorkingDay,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const today = new Date();
    const resignationDate = today.toISOString().split("T")[0];
    let workingDays = 0;
    let nextDate = new Date(today);

    while (workingDays < 10) {
      nextDate.setDate(nextDate.getDate() + 1);
      const day = nextDate.getDay();
      if (day !== 0 && day !== 6) {
        workingDays++;
      }
    }

    const lastWorkingDay = nextDate.toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      resignationDate,
      lastWorkingDay,
    }));
  }, []);

  const handleCancel = () => {
    setFormData((prev) => ({
      ...prev,
      resignationReason: "",
      shortDescription: "",
      description: "",
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        requester: currentUserName,
        requesterName: currentUserName,
        requesterFor: "Sumit",
        category: "Offboarding",
        status: "Draft",
        requestType: "Resignation",
      };

      await sendApiData("/api/jobrequests", payload);
      alert("Offboarding Request Saved as Draft Successfully.");
    } catch (error) {
      console.error(error);
      alert("Error Saving Draft");
    }
  };

  const handleSubmit = async () => {
    if (!formData.shortDescription || !formData.shortDescription.trim()) {
      alert("Please enter a Short Description.");
      return;
    }
    try {
      const payload = {
        ...formData,
        requester: currentUserName,
        requesterName: currentUserName,
        requesterFor: "Sumit",
        category: "Offboarding",
        status: "Open",
        requestType: "Resignation",
      };

      await sendApiData("/api/jobrequests", payload);
      alert("Offboarding Request Submitted Successfully!");
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
          <h2 className="lr-title">Exit</h2>
          
          <div className="section-header">EMPLOYEE DETAILS</div>
          
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
              <label className="lr-label">Date of Resignation</label>
              <input
                className="lr-input"
                type="date"
                name="resignationDate"
                value={formData.resignationDate}
                onChange={handleChange}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Last Working Day</label>
              <input
                className="lr-input"
                type="date"
                name="lastWorkingDay"
                value={formData.lastWorkingDay}
                readOnly
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Resignation Reason</label>
              <select
                className="lr-input"
                name="resignationReason"
                value={formData.resignationReason}
                onChange={handleChange}
              >
                <option value="">Select Reason</option>
                <option value="Personal">Personal</option>
                <option value="Career Growth">Career Growth</option>
                <option value="Relocation">Relocation</option>
                <option value="Health">Health</option>
                <option value="Higher Studies">Higher Studies</option>
                <option value="Salary">Salary</option>
                <option value="Work Environment">Work Environment</option>
                <option value="Other">Other</option>
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
          
          <div className="CreateFooter">
            <button type="button" className="CreateBtn btn-cancel" onClick={handleCancel}>
              Cancel
            </button>

            <button type="button" className="CreateBtn btn-submit" style={{ background: "#64748b" }} onClick={handleSave}>
              Save
            </button>

            <button type="button" className="CreateBtn btn-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Exit;
