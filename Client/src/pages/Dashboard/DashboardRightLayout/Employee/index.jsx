import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./index.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Form State with 3 location provisions
  const [formData, setFormData] = useState({
    employeeName: "",
    loc1_place: "",
    loc1_start: "08:00",
    loc1_end: "20:00",
    loc2_place: "",
    loc2_start: "08:00",
    loc2_end: "20:00",
    loc3_place: "",
    loc3_start: "08:00",
    loc3_end: "20:00",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Edit Modal Pop-up State
  const [editModal, setEditModal] = useState({
    isOpen: false,
    id: "",
    employeeName: "",
    locations: [],
  });
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

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

  // Create New Employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeName.trim()) {
      alert("Please enter Employee Name.");
      return;
    }

    try {
      setSaving(true);
      setSuccessMsg("");

      const locations = [];
      if (formData.loc1_place.trim()) {
        locations.push({
          place: formData.loc1_place.trim(),
          shiftStartTime: formData.loc1_start || "08:00",
          shiftEndTime: formData.loc1_end || "20:00",
        });
      }
      if (formData.loc2_place.trim()) {
        locations.push({
          place: formData.loc2_place.trim(),
          shiftStartTime: formData.loc2_start || "08:00",
          shiftEndTime: formData.loc2_end || "20:00",
        });
      }
      if (formData.loc3_place.trim()) {
        locations.push({
          place: formData.loc3_place.trim(),
          shiftStartTime: formData.loc3_start || "08:00",
          shiftEndTime: formData.loc3_end || "20:00",
        });
      }

      const payload = {
        employeeName: formData.employeeName.trim(),
        place:
          locations[0]?.place || formData.loc1_place.trim() || "Location 1",
        shiftStartTime:
          locations[0]?.shiftStartTime || formData.loc1_start || "08:00",
        shiftEndTime:
          locations[0]?.shiftEndTime || formData.loc1_end || "20:00",
        locations:
          locations.length > 0
            ? locations
            : [
                {
                  place: formData.loc1_place.trim() || "Location 1",
                  shiftStartTime: formData.loc1_start || "08:00",
                  shiftEndTime: formData.loc1_end || "20:00",
                },
              ],
      };

      try {
        await axios.post(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/employees/create",
          payload,
        );
      } catch (err) {
        await axios.post("/api/employees/create", payload);
      }

      setSuccessMsg("Employee created successfully!");
      setFormData({
        employeeName: "",
        loc1_place: "",
        loc1_start: "08:00",
        loc1_end: "20:00",
        loc2_place: "",
        loc2_start: "08:00",
        loc2_end: "20:00",
        loc3_place: "",
        loc3_start: "08:00",
        loc3_end: "20:00",
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

  // Open Edit Employee Modal
  const handleOpenEditModal = (emp) => {
    const locs =
      emp.locations && emp.locations.length > 0
        ? JSON.parse(JSON.stringify(emp.locations))
        : [
            {
              place: emp.place || "Location 1",
              shiftStartTime: emp.shiftStartTime || "08:00",
              shiftEndTime: emp.shiftEndTime || "20:00",
            },
          ];

    setEditModal({
      isOpen: true,
      id: emp._id,
      employeeName: emp.employeeName,
      locations: locs,
    });
    setUpdateMsg("");
  };

  // Close Edit Modal
  const handleCloseEditModal = () => {
    setEditModal({
      isOpen: false,
      id: "",
      employeeName: "",
      locations: [],
    });
    setUpdateMsg("");
  };

  // Add Location entry in Edit Modal
  const handleAddLocationInEdit = () => {
    setEditModal((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          place: "",
          shiftStartTime: "08:00",
          shiftEndTime: "20:00",
        },
      ],
    }));
  };

  // Edit Location field change
  const handleEditLocationChange = (idx, field, value) => {
    setEditModal((prev) => {
      const updatedLocs = [...prev.locations];
      updatedLocs[idx] = { ...updatedLocs[idx], [field]: value };
      return { ...prev, locations: updatedLocs };
    });
  };

  // Remove Location entry in Edit Modal
  const handleRemoveLocationInEdit = (idx) => {
    setEditModal((prev) => {
      const updatedLocs = prev.locations.filter((_, i) => i !== idx);
      return { ...prev, locations: updatedLocs };
    });
  };

  // Save / Update Employee Pop-up
  const handleUpdateEmployee = async () => {
    if (!editModal.employeeName.trim()) {
      alert("Please enter Employee Name.");
      return;
    }

    try {
      setUpdating(true);
      setUpdateMsg("");

      const payload = {
        employeeName: editModal.employeeName.trim(),
        place: editModal.locations[0]?.place || "",
        shiftStartTime: editModal.locations[0]?.shiftStartTime || "08:00",
        shiftEndTime: editModal.locations[0]?.shiftEndTime || "20:00",
        locations: editModal.locations,
      };

      const apiUrl = `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/employees/${editModal.id}`;

      try {
        await axios.put(apiUrl, payload);
      } catch (err) {
        await axios.put(`/api/employees/${editModal.id}`, payload);
      }

      setUpdateMsg("Employee updated successfully!");
      await fetchEmployees();

      setTimeout(() => {
        handleCloseEditModal();
      }, 1000);
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("Failed to update employee.");
    } finally {
      setUpdating(false);
    }
  };

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
      {/* FORM SECTION: CREATE EMPLOYEE */}
      <div className="employeeFormCard">
        <div className="formHeader">
          <h2>Create New Employee Record (With Locations & Shift Timings)</h2>
          <span className="formSub">
            Enter employee name and up to 3 locations. You can also edit
            existing employees anytime below.
          </span>
        </div>

        {successMsg && <div className="successAlert">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="employeeForm">
          <div className="formGroupMain">
            <label>EMPLOYEE NAME *</label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              placeholder="e.g. Captain Srikar"
              required
              className="empNameMainInput"
            />
          </div>

          <div className="locationsGrid">
            {/* LOCATION 1 */}
            <div className="locationBlockCard">
              <h4>City Location 1</h4>
              <div className="inputSubGroup">
                <label>City Location</label>
                <input
                  type="text"
                  name="loc1_place"
                  value={formData.loc1_place}
                  onChange={handleInputChange}
                  placeholder="e.g. Hyderabad"
                />
              </div>
              <div className="timeRow">
                <div className="inputSubGroup">
                  <label>Shift Start</label>
                  <input
                    type="time"
                    name="loc1_start"
                    value={formData.loc1_start}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="inputSubGroup">
                  <label>Shift End</label>
                  <input
                    type="time"
                    name="loc1_end"
                    value={formData.loc1_end}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* LOCATION 2 */}
            <div className="locationBlockCard">
              <h4>City Location 2</h4>
              <div className="inputSubGroup">
                <label>City Location</label>
                <input
                  type="text"
                  name="loc2_place"
                  value={formData.loc2_place}
                  onChange={handleInputChange}
                  placeholder="e.g. Bangalore"
                />
              </div>
              <div className="timeRow">
                <div className="inputSubGroup">
                  <label>Shift Start</label>
                  <input
                    type="time"
                    name="loc2_start"
                    value={formData.loc2_start}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="inputSubGroup">
                  <label>Shift End</label>
                  <input
                    type="time"
                    name="loc2_end"
                    value={formData.loc2_end}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* LOCATION 3 */}
            <div className="locationBlockCard">
              <h4>City Location 3</h4>
              <div className="inputSubGroup">
                <label>City Location</label>
                <input
                  type="text"
                  name="loc3_place"
                  value={formData.loc3_place}
                  onChange={handleInputChange}
                  placeholder="e.g. Chennai"
                />
              </div>
              <div className="timeRow">
                <div className="inputSubGroup">
                  <label>Shift Start</label>
                  <input
                    type="time"
                    name="loc3_start"
                    value={formData.loc3_start}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="inputSubGroup">
                  <label>Shift End</label>
                  <input
                    type="time"
                    name="loc3_end"
                    value={formData.loc3_end}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="formSubmitRow">
            <button type="submit" className="saveEmpBtn" disabled={saving}>
              {saving ? "Saving..." : "Save Employee Record"}
            </button>
          </div>
        </form>
      </div>

      {/* DISPLAY SECTION: EMPLOYEE TIMELINE GRID WITH EDIT PROVISION */}
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

          {/* TOTAL EMPLOYEES QUICK SELECT / EDIT DROPDOWN */}
          <div className="toolRight">
            <span className="totalBadge">
              Total Employees ({employees.length})
            </span>
            <select
              className="quickEditSelect"
              onChange={(e) => {
                const found = employees.find(
                  (emp) => emp._id === e.target.value,
                );
                if (found) handleOpenEditModal(found);
              }}
              value=""
            >
              <option value="">-- Click to Edit an Employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  ✏️ Edit: {emp.employeeName}
                </option>
              ))}
            </select>
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
              <div className="agentColHeader">
                Employee / Location (Click to Edit)
              </div>
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
              const locList =
                emp.locations && emp.locations.length > 0
                  ? emp.locations
                  : [
                      {
                        place: emp.place || "Default Location",
                        shiftStartTime: emp.shiftStartTime || "08:00",
                        shiftEndTime: emp.shiftEndTime || "20:00",
                      },
                    ];

              return locList.map((loc, lIdx) => {
                const barStyle = getShiftBarStyle(
                  loc.shiftStartTime,
                  loc.shiftEndTime,
                );

                return (
                  <div
                    key={`${emp._id}_${lIdx}`}
                    className="employeeTimelineRow"
                  >
                    <div
                      className="agentInfoCol editableCol"
                      title="Click to Edit Employee & Locations"
                      onClick={() => handleOpenEditModal(emp)}
                    >
                      <div className="agentNameRow">
                        <span className="agentName">{emp.employeeName}</span>
                        <button className="editIconBtn">✏️</button>
                      </div>
                      <div className="agentLocation">
                        📍 {loc.place || "Default Location"}
                      </div>
                    </div>

                    <div className="timelineBarCol">
                      <div className="hoursBackgroundGrid">
                        {hours.map((_, hIdx) => (
                          <div key={hIdx} className="gridHourCell"></div>
                        ))}
                      </div>

                      <div
                        className="shiftBlockBar clickableShiftBar"
                        style={barStyle}
                        title="Click to Edit Shift & Locations"
                        onClick={() => handleOpenEditModal(emp)}
                      >
                        <div className="shiftBlockTitle">
                          Shift: {loc.shiftStartTime || "08:00"} -{" "}
                          {loc.shiftEndTime || "20:00"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        )}
      </div>

      {/* EDIT EMPLOYEE POP-UP MODAL */}
      {editModal.isOpen && (
        <div className="modalOverlay">
          <div className="editEmpModalContainer">
            <div className="modalHeader">
              <h3>Edit Employee & Add/Update Locations</h3>
              <button className="closeModalBtn" onClick={handleCloseEditModal}>
                ✕
              </button>
            </div>

            <div className="modalBody">
              {updateMsg && <div className="successAlert">{updateMsg}</div>}

              <div className="formGroup">
                <label>Employee Name *</label>
                <input
                  type="text"
                  value={editModal.employeeName}
                  onChange={(e) =>
                    setEditModal((prev) => ({
                      ...prev,
                      employeeName: e.target.value,
                    }))
                  }
                  className="modalInput"
                  placeholder="Enter employee name..."
                />
              </div>

              <div className="editLocationsHeaderRow">
                <h4>
                  Locations & Shift Timings ({editModal.locations.length})
                </h4>
                <button
                  type="button"
                  className="addLocBtn"
                  onClick={handleAddLocationInEdit}
                >
                  + Add Location
                </button>
              </div>

              <div className="editLocationsList">
                {editModal.locations.map((loc, idx) => (
                  <div key={idx} className="editLocationCard">
                    <div className="locCardTop">
                      <span>Location #{idx + 1}</span>
                      {editModal.locations.length > 1 && (
                        <button
                          type="button"
                          className="removeLocBtn"
                          onClick={() => handleRemoveLocationInEdit(idx)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="locInputsRow">
                      <div className="inputSubGroup">
                        <label>City Location</label>
                        <input
                          type="text"
                          value={loc.place}
                          onChange={(e) =>
                            handleEditLocationChange(
                              idx,
                              "place",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Hyderabad / Site Name"
                        />
                      </div>
                      <div className="inputSubGroup">
                        <label>Shift Start</label>
                        <input
                          type="time"
                          value={loc.shiftStartTime}
                          onChange={(e) =>
                            handleEditLocationChange(
                              idx,
                              "shiftStartTime",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="inputSubGroup">
                        <label>Shift End</label>
                        <input
                          type="time"
                          value={loc.shiftEndTime}
                          onChange={(e) =>
                            handleEditLocationChange(
                              idx,
                              "shiftEndTime",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modalFooter">
              <button
                type="button"
                className="cancelBtn"
                onClick={handleCloseEditModal}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="saveAssignBtn"
                onClick={handleUpdateEmployee}
                disabled={updating || !editModal.employeeName.trim()}
              >
                {updating ? "Saving..." : "Update Employee Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
