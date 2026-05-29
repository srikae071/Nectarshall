import { useState } from "react";
import "./index.css";

import PatrollingLeftLayout from "../../PatrollingLeftLayout/index.jsx";

function PatrollingTimesheet() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tableData, setTableData] = useState(data);
  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const format = (d) =>
      d.toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      });

    return `${format(start)} - ${format(end)}`;
  };

  const goPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };
  const handleTimeChange = (index, field, value) => {
    const updated = [...tableData];
    updated[index][field] = value;
    setTableData(updated);
  };

  const handleNoteClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };
  return (
    <PatrollingLeftLayout>
      <div className="timesheet">
        {/* FILTER BAR */}
        <div className="filterBar">
          <div className="filterGroup">
            <label>SELECT CUSTOMER:</label>
            <select>
              <option>CBRE</option>
            </select>
          </div>

          <div className="filterGroup">
            <label>SELECT SITE:</label>
            <select>
              <option>All</option>
            </select>
          </div>

          <div className="filterGroup searchBox">
            <label>SEARCH:</label>
            <input placeholder="Search ..." />
          </div>

          <div className="filterGroup">
            <label>GROUP ENTRIES BY:</label>
            <select>
              <option>Site</option>
            </select>
          </div>

          <div className="filterGroup">
            <label>VIEW:</label>
            <select>
              <option>Awaiting Approval</option>
            </select>
          </div>
        </div>

        {/* DATE ROW */}
        <div className="dateRow">
          <button onClick={goToday}>Today</button>
          <button onClick={goPrevWeek}>{"<"}</button>

          <span>{getWeekRange(currentDate)}</span>

          <button onClick={goNextWeek}>{">"}</button>
          <button className="actionsBtn">Actions ▾</button>
        </div>

        {/* TABLE */}
        <div className="tableContainer">
          {showModal && (
            <div className="modalOverlay">
              <div className="modalBox">
                <h3>Notes for {selectedDate}</h3>

                <label>Note:</label>
                <textarea placeholder="Enter your note..." />

                <div className="modalActions">
                  <button onClick={() => setShowModal(false)}>Cancel</button>

                  {/* NEW: Attachment Button */}
                  <label className="attachBtn">
                    📎 Attach
                    <input type="file" multiple style={{ display: "none" }} />
                  </label>

                  <button className="saveBtn">Save</button>
                </div>
              </div>
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th className="timesheatsheading">Date</th>
                <th className="timesheatsheading">Customer</th>
                <th className="timesheatsheading">Staff</th>
                <th className="timesheatsheading">Entry Type</th>
                <th className="timesheatsheading">Position</th>
                <th className="timesheatsheading">Scheduled</th>
                <th className="timesheatsheading">Start Time</th>
                <th className="timesheatsheading">End Time</th>
                <th className="timesheatsheading">Break</th>
                <th className="timesheatsheading">Summary</th>
                <th className="timesheatsheading">Notes</th>
                <th className="timesheatsheading">Approved</th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.customer}</td>
                  <td>{row.staff}</td>
                  <td>{row.type}</td>
                  <td>{row.position}</td>
                  <td>{row.schedule}</td>
                  <td>
                    <input
                      type="time"
                      value={row.start}
                      onChange={(e) =>
                        handleTimeChange(index, "start", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="time"
                      value={row.end}
                      onChange={(e) =>
                        handleTimeChange(index, "end", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={row.break}
                      onChange={(e) =>
                        handleTimeChange(index, "break", e.target.value)
                      }
                      style={{ width: "70px" }}
                    />
                  </td>
                  <td>{row.summary}</td>
                  <td
                    className="notes"
                    onClick={() => handleNoteClick(row.date)}
                  >
                    + note
                  </td>
                  <td>
                    <button className="approve">✓</button>
                    <button className="reject">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PatrollingLeftLayout>
  );
}

const data = [
  {
    date: "Mon 23 Mar",
    customer: "CBRE",
    staff: "Akash Deep",
    type: "Work",
    position: "L1 PT v7",
    schedule: "07:00 - 15:00",
    start: "07:00",
    end: "15:00",
    break: "0 mins",
    summary: "8 hrs | $0",
  },
  {
    date: "Mon 23 Mar",
    customer: "CBRE",
    staff: "Peter Golong",
    type: "Work",
    position: "L1 PT v7",
    schedule: "15:00 - 23:00",
    start: "15:00",
    end: "23:00",
    break: "0 mins",
    summary: "8 hrs | $0",
  },
];

export default PatrollingTimesheet;
