import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ResonanceNav from "../ExitNav";
import "./index.css";

function Exit() {
  const [formData, setFormData] = useState({
    requesterName: "",
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
  //   const navigate = useNavigate();
  //   const handleChange = (e) => {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: e.target.value,
  //     });
  //   };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests",
        {
          ...formData,
          category: "Offboarding",
          status: "Open",
          requestType: "Resignation",
        },
      );

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
      <div className="CreateContainer">
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
            <label>Date of Resignation</label>

            <input
              type="date"
              name="resignationDate"
              value={formData.resignationDate}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Last Working Day</label>

            <input
              type="date"
              name="lastWorkingDay"
              value={formData.lastWorkingDay}
              readOnly
            />
          </div>
        </div>

        <div className="CreateRow">
          <div className="CreateField">
            <label>Resignation Reason</label>

            <select
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

        <div className="CreateTextareaGroup">
          <label>Description</label>

          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
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

export default Exit;
