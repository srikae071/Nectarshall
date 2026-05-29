import { useState } from "react";
// import { useContext } from "react";
import { EmployeeContext } from "../EmployeeContext.js";
import "./index.css";

import PatrollingLeftLayout from "../../PatrollingLeftLayout/index.jsx";

function PatrollingEmployeesites() {
  // const { trigger } = useContext(EmployeeContext);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [popup, setPopup] = useState(null);
  // const employeeNames = [
  //   "Abdul Haseeb Ansar",
  //   "Abdul Rahman Najjarine",
  //   "Abu Talha",
  //   "Adeel Sultan",
  //   "Ajdin Sabonoski",
  // ];
  const employees = ["ST petersburg", "Perth", "Canberra", "Noida", "Victoria"];
  const [formData, setFormData] = useState({
    start: "",
    end: "",
    break: "",
    position: "",
    role: "",
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
  // const generateRandomEmployees = () => {
  //   const newData = {};

  //   const totalRows = employees.length;
  //   const totalCols = weekDates.length;

  //   const usedKeys = new Set();

  //   while (usedKeys.size < 5) {
  //     const i = Math.floor(Math.random() * totalRows);
  //     const j = Math.floor(Math.random() * totalCols);

  //     const key = `${i}-${weekDates[j].full.toDateString()}`;

  //     if (usedKeys.has(key)) continue;

  //     usedKeys.add(key);

  //     const randomEmployee =
  //       employeeNames[Math.floor(Math.random() * employeeNames.length)];

  //     newData[key] = {
  //       start: "09:00",
  //       end: "18:00",
  //       position: randomEmployee,
  //     };
  //   }

  //   setSavedData((prev) => ({
  //     ...prev,
  //     ...newData,
  //   }));
  // };

  // useEffect(() => {
  //   if (trigger === 0) return;
  //   generateRandomEmployees();
  // }, [trigger]);

  // ✅ CLICK CELL
  const handleClick = (e, dateObj, empIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const key = `${empIndex}-${dateObj.toDateString()}`;
    const existing = savedData[key];

    setPopup({
      date: dateObj,
      empIndex,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 5,
    });

    setFormData(
      existing || {
        start: "",
        end: "",
        break: "",
        position: "",
        role: "",
      },
    );
  };

  // ✅ SAVE DATA
  const handleSave = () => {
    if (!formData.start || !formData.end) {
      alert("Start and End time required");
      return;
    }

    const key = `${popup.empIndex}-${popup.date.toDateString()}`;

    setSavedData((prev) => ({
      ...prev,
      [key]: formData,
    }));

    setPopup(null);
  };

  return (
    <PatrollingLeftLayout>
      <div className="mainLayout">
        <div className="rightPanel">
          <div className="container">
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
                <span>
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
                <button className="savechangesbtn">Save Changes</button>
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
                    const key = `${i}-${d.full.toDateString()}`;
                    const data = savedData[key];
                    const isBlocked = i % 2 === 0;

                    return (
                      <div key={j} className="cell">
                        <div
                          onClick={(e) => handleClick(e, d.full, i)}
                          className="cellInner"
                        >
                          {!data ? (
                            <div className="plus">+</div>
                          ) : data ? (
                            <div className="savedBox">
                              <div>
                                {data.start} - {data.end}
                              </div>
                              <div className="small">{data.position}</div>
                            </div>
                          ) : null}
                          <div></div>
                        </div>

                        {isBlocked && (
                          <div className="blocked">
                            Full Day <br /> Not Available
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="nameRow">{emp}</div>
              </div>
            ))}

            {/* POPUP */}
            {popup && (
              <div
                className="popupForm"
                style={{ top: popup.y, left: popup.x }}
              >
                <div className="popupHeader">
                  <span>Selected Shift</span>
                  <span className="closeBtn" onClick={() => setPopup(null)}>
                    ×
                  </span>
                </div>

                <div className="form">
                  <label>Start</label>
                  <input
                    type="time"
                    value={formData.start}
                    onChange={(e) =>
                      setFormData({ ...formData, start: e.target.value })
                    }
                  />

                  <label>End</label>
                  <input
                    type="time"
                    value={formData.end}
                    onChange={(e) =>
                      setFormData({ ...formData, end: e.target.value })
                    }
                  />

                  <label>Meal Break</label>
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
                      setFormData({
                        ...formData,
                        position: e.target.value,
                      })
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
                      setFormData({
                        ...formData,
                        role: e.target.value,
                      })
                    }
                  >
                    <option>Select</option>
                    <option>Guard</option>
                    <option>Supervisor</option>
                  </select>

                  <button className="saveBtn" onClick={handleSave}>
                    Save Template
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PatrollingLeftLayout>
  );
}

export default PatrollingEmployeesites;
