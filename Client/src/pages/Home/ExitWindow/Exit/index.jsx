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
    description: "",
  });
  const navigate = useNavigate();
  //
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

  const handleSave = async () => {
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

      const response = await sendApiData("/api/jobrequests", payload);

      console.log(response.data);
      alert("Offboarding Request Saved Successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error Saving Request");
    }
  };
  return (
    <>
      <ResonanceNav />
      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Exit</h2>
          
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

          <div className="lr-field">
            <label className="lr-label">Description</label>
            <textarea
              className="lr-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="CreateFooter">
            <button
              type="button"
              className="CreateBtn btn-cancel"
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

            <button type="button" className="CreateBtn btn-save" onClick={handleSave}>
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

export default Exit;
