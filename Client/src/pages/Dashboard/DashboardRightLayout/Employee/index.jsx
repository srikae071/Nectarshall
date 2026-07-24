import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./index.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    employeeName: "",
    place: "",
    shiftStartTime: "08:00",
    shiftEndTime: "20:00",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Timeline Hours Header (00:00 - 23:00)
  const hours = useMemo(() => {
    const arr = [];
    for (let h = 0; h < 24; h++) {
      arr.push(`${String(h).padStart(2, "0")}:00`);
    }
    return arr;
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      let response;
      try {
        response = await axios.get(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/employees",
        );
      } catch (err) {
        response = await axios.get("/api/employees");
      }

      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeName.trim()) {
      alert("Please enter Employee Name.");
      return;
    }

    try {
      setSaving(true);
      setSuccessMsg("");

      const payload = {
        employeeName: formData.employeeName.trim(),
        place: formData.place.trim(),
        shiftStartTime: formData.shiftStartTime || "08:00",
        shiftEndTime: formData.shiftEndTime || "20:00",
      };

      try {
        await axios.post(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/employees/create",
          payload,
        );
      } catch (err) {
        await axios.post("/api/employees/create", payload);
      }

      setSuccessMsg("Employee saved successfully!");
      setFormData({
        employeeName: "",
        place: "",
        shiftStartTime: "08:00",
        shiftEndTime: "20:00",
      });

      await fetchEmployees();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error saving employee:", err);
      alert("Failed to save employee.");
    } finally {
      setSaving(false);
    }
  };

  // Calculate shift bar start percentage and width percentage along 24h timeline
  const getShiftBarStyle = (startTimeStr, endTimeStr) => {
    const parseHour = (str) => {
      if (!str) return 8;
      const parts = str.split(":");
      const h = parseInt(parts[0], 10) || 0;
      const m = parseInt(parts[1], 10) || 0;
      return h + m / 60;
    };

    const startH = parseHour(startTimeStr);
    let endH = parseHour(endTimeStr);
    if (endH <= startH) endH = 24;

    const leftPercent = (startH / 24) * 100;
    const widthPercent = ((endH - startH) / 24) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  return (
    <div className="employeePageWrapper">
      {/* FORM SECTION */}
      <div className="employeeFormCard">
        <div className="formHeader">
          <h2>Create New Employee Shift Record</h2>
          <span className="formSub">
            Enter employee details to store shift schedule
          </span>
        </div>

        {successMsg && <div className="successAlert">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="employeeForm">
          <div className="formRow">
            <div className="inputGroup">
              <label>Employee Name *</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                placeholder="e.g. Captain Srikar"
                required
              />
            </div>

            <div className="inputGroup">
              <label>City / Location</label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleInputChange}
                placeholder="e.g. Hyderabad / Demo Location"
              />
            </div>

            <div className="inputGroup">
              <label>Shift Start Time</label>
              <input
                type="time"
                name="shiftStartTime"
                value={formData.shiftStartTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="inputGroup">
              <label>Shift End Time</label>
              <input
                type="time"
                name="shiftEndTime"
                value={formData.shiftEndTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="btnSubmitGroup">
              <button type="submit" className="saveEmpBtn" disabled={saving}>
                {saving ? "Saving..." : "Save Employee"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* DISPLAY SECTION - SERVICENOW TIMELINE SCHEDULE AS IN IMAGE */}
      <div className="employeeDisplayCard">
        <div className="timelineToolbar">
          <div className="toolLeft">
            <button className="toolBtn">Today</button>
            <div className="arrowGroup">
              <button className="toolBtn">‹</button>
              <button className="toolBtn">›</button>
            </div>
            <span className="timelineDateTxt">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loadingState">Loading employees...</div>
        ) : error ? (
          <div className="errorState">{error}</div>
        ) : employees.length === 0 ? (
          <div className="emptyState">
            No employees recorded yet. Fill the form above to add an employee.
          </div>
        ) : (
          <div className="timelineGridContainer">
            {/* TIMELINE HOURS HEADER */}
            <div className="timelineHeaderRow">
              <div className="agentColHeader">Employee / Location</div>
              <div className="hoursScrollContainer">
                {hours.map((h, i) => (
                  <div key={i} className="hourHeaderCell">
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* EMPLOYEE ROWS */}
            {employees.map((emp) => {
              const barStyle = getShiftBarStyle(
                emp.shiftStartTime,
                emp.shiftEndTime,
              );

              return (
                <div key={emp._id} className="employeeTimelineRow">
                  {/* LEFT AGENT INFO CARD */}
                  <div className="agentInfoCol">
                    <div className="agentName">{emp.employeeName}</div>
                    <div className="agentLocation">
                      📍 {emp.place || "Default Location"}
                    </div>
                  </div>

                  {/* RIGHT TIMELINE SHIFT BAR AREA */}
                  <div className="timelineBarCol">
                    <div className="hoursBackgroundGrid">
                      {hours.map((_, hIdx) => (
                        <div key={hIdx} className="gridHourCell"></div>
                      ))}
                    </div>

                    <div className="shiftBlockBar" style={barStyle}>
                      <div className="shiftBlockTitle">
                        Shift: {emp.shiftStartTime || "08:00"} -{" "}
                        {emp.shiftEndTime || "20:00"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;
