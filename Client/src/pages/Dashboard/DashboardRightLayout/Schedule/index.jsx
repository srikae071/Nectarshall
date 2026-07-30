import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { fetchApiData } from "../../../../utils/apiClient";
// import { useContext } from "react";
import { EmployeeContext } from "../EmployeeContext.js";

import "./index.css";

function Schedule() {
  // const { trigger } = useContext(EmployeeContext);
  // const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [popup, setPopup] = useState(null);
  const [siteNames, setSiteNames] = useState([]);
  // const getDateKey = (date) => {
  //   return new Date(date).toISOString().split("T")[0];
  // };
  // const employeeNames = [
  //   "Abdul Haseeb Ansar",
  //   "Abdul Rahman Najjarine",
  //   "Abu Talha",
  //   "Adeel Sultan",
  //   "Ajdin Sabonoski",
  // ];
  const employees = [
    "Abdul Haseeb Ansar",
    "Abdul Rahman Najjarine",
    "Alex",
    "Jhon",
    "Pal",
  ];
  const [formData, setFormData] = useState({
    start: "",
    end: "",
    break: "",
    position: "",
    role: "",
    note: "",
    siteName: "",
    selectedDate: "",
  });

  const [savedData, setSavedData] = useState({});

  // ✅ GENERATE WEEK
  const getWeekDates = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      week.push({
        label: d.toDateString().slice(0, 10),
        full: new Date(d),
      });
    }

    return week;
  };

  const weekDates = getWeekDates(currentDate);

  // ✅ CLICK CELL
  const handleClick = (e, dateObj, empIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // const key = `${empIndex}-${dateObj.toDateString()}`;
    // const existing = savedData[key];
    const dateKey = dateObj.toISOString().split("T")[0];
    const existing = savedData[empIndex]?.[dateKey];

    setPopup({
      date: dateObj,
      empIndex,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 5,
    });

    setFormData({
      start: existing?.start || "",
      end: existing?.end || "",
      break: existing?.break || "",
      position: existing?.position || "",
      role: existing?.role || "",
      note: existing?.note || "",
      startDate: dateKey,
      endDate: dateKey,
    });
  };
  useEffect(() => {
    const fetchSiteNames = async () => {
      try {
        const response = await fetchApiData("/api/boarding");

        const sites = [];

        response.data.forEach((item) => {
          if (item.contractDeliverables?.length > 0) {
            item.contractDeliverables.forEach((contract) => {
              if (contract.siteAddress) {
                sites.push(contract.siteAddress);
              }
            });
          }
        });

        setSiteNames(sites);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSiteNames();
  }, []);
  // const handleSave = () => {
  //   if (!formData.start || !formData.end) {
  //     alert("Start and End time required");
  //     return;
  //   }

  //   if (!formData.startDate || !formData.endDate) {
  //     alert("Start Date and End Date required");
  //     return;
  //   }

  //   const start = new Date(formData.startDate);
  //   const end = new Date(formData.endDate);

  //   if (start > end) {
  //     alert("Invalid date range");
  //     return;
  //   }

  //   const emp = popup.empIndex;

  //   setSavedData((prev) => {
  //     const updated = { ...prev };

  //     if (!updated[emp]) {
  //       updated[emp] = {};
  //     }

  //     let current = new Date(start);

  //     while (current <= end) {
  //       const key = current.toISOString().split("T")[0];

  //       updated[emp][key] = {
  //         start: formData.start,
  //         end: formData.end,
  //         position: formData.position,
  //         role: formData.role,
  //       };

  //       current.setDate(current.getDate() + 1);
  //     }

  //     return updated;
  //   });

  //   setPopup(null);
  // };

  const handleSave = () => {
    if (!formData.start || !formData.end) {
      alert("Start and End time required");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert("Start Date and End Date required");
      return;
    }

    const emp = popup.empIndex;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    setSavedData((prev) => {
      const updated = { ...prev };

      if (!updated[emp]) updated[emp] = {};

      // ✅ CASE 1: Single day edit
      if (formData.startDate === formData.endDate) {
        const key = formData.startDate;

        updated[emp][key] = {
          start: formData.start,
          end: formData.end,
          position: formData.position,
          role: formData.role,
        };

        return updated;
      }

      // ✅ CASE 2: Range update
      let current = new Date(start);

      while (current <= end) {
        const key = current.toISOString().split("T")[0];

        updated[emp][key] = {
          start: formData.start,
          end: formData.end,
          position: formData.position,
          role: formData.role,
        };

        current.setDate(current.getDate() + 1);
      }

      return updated;
    });

    setPopup(null);
  };
  return (
    <div className="mainLayout">
      <div className="rightPanel">
        <div className="Shedulecontainer">
          {/* TOP BAR */}
          <div className="topBar">
            <div className="Datebuttons">
              {/* PREVIOUS WEEK */}
              <button
                onClick={() =>
                  setCurrentDate((prev) => {
                    const d = new Date(prev);
                    d.setDate(prev.getDate() - 7);
                    return d;
                  })
                }
              >
                {"<"}
              </button>

              {/* DATE RANGE */}
              <span style={{ color: "#e5e7eb" }}>
                {weekDates[0].label} - {weekDates[6].label}
              </span>

              {/* NEXT WEEK */}
              <button
                onClick={() =>
                  setCurrentDate((prev) => {
                    const d = new Date(prev);
                    d.setDate(prev.getDate() + 7);
                    return d;
                  })
                }
              >
                {">"}
              </button>

              <div className="right">
                <select className="actionbuttons">
                  <option>Actions</option>
                </select>
                <button className="actionbuttons">Collapse</button>
              </div>
            </div>

            <div className="savebuttons">
              <button className="shedulesavechangesbtn">Save Changes</button>
              <button className="btn">Cancel</button>
            </div>
          </div>

          {/* HEADER */}
          <div className="grid header">
            {weekDates.map((d, i) => (
              <div key={i} className="headerCell">
                {d.label}
              </div>
            ))}
          </div>

          {/* BODY */}
          {employees.map((emp, i) => (
            <div key={i} className="rowBlock">
              <div className="grid">
                {weekDates.map((d, j) => {
                  const dateKey = d.full.toISOString().split("T")[0];
                  const data = savedData[i]?.[dateKey];
                  const isBlocked = i % 2 === 0;

                  return (
                    <div key={j} className="cell">
                      <div
                        onClick={(e) => handleClick(e, d.full, i)}
                        className="cellInner"
                      >
                        {isBlocked && (
                          <div className="blocked">Full Day Not Available</div>
                        )}

                        <div className="cellContent">
                          {!data ? (
                            <div className="plus">+</div>
                          ) : (
                            <div className="savedBox">
                              <div className="timeRow">
                                {data.start} - {data.end}
                              </div>

                              <div className="positionRow">{data.position}</div>

                              {data.role && (
                                <div className="roleRow">{data.role}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="nameRow">{emp}</div>
            </div>
          ))}

          {/* POPUP */}
          {popup && (
            <div className="popupForm">
              <div className="popupHeader">
                <span>Shift Details</span>
                <span className="closeBtn" onClick={() => setPopup(null)}>
                  ×
                </span>
              </div>

              <div className="popupGrid">
                {/* LEFT SIDE */}
                <div className="leftCol">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />

                  <label>Start Time</label>
                  <input
                    type="time"
                    value={formData.start}
                    onChange={(e) =>
                      setFormData({ ...formData, start: e.target.value })
                    }
                  />

                  <label>Meal Break (mins)</label>
                  <input
                    type="number"
                    value={formData.break}
                    onChange={(e) =>
                      setFormData({ ...formData, break: e.target.value })
                    }
                  />

                  <label>Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  >
                    <option>Select</option>
                    <option>Security</option>
                    <option>Manager</option>
                  </select>

                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option>Select</option>
                    <option>Guard</option>
                    <option>Supervisor</option>
                  </select>
                </div>

                {/* RIGHT SIDE */}
                <div className="rightCol">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />

                  <label>End Time</label>
                  <input
                    type="time"
                    value={formData.end}
                    onChange={(e) =>
                      setFormData({ ...formData, end: e.target.value })
                    }
                  />

                  <label>Description</label>
                  <textarea
                    className="descriptionBox"
                    placeholder="Enter shift details, notes, or instructions..."
                    maxLength={1000}
                    value={formData.note || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />

                  <div className="charCount">
                    {(formData.note || "").length}/1000
                  </div>
                  <label>Site Name</label>

                  <select
                    value={formData.siteName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        siteName: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Site</option>

                    {siteNames.map((site, index) => (
                      <option key={index} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                  <div className="mapSection">
                    <a
                      href="https://www.google.com/maps?q=17.3850,78.4867"
                      target="_blank"
                      rel="noreferrer"
                      className="mapLink"
                    >
                      📍 View Site Map
                    </a>

                    <div className="mapPoints">
                      <span>• Site A</span>
                      <span>• Site B</span>
                      <span>• Site C</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="popupFooter">
                <button className="saveBtn" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;
