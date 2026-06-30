import React, { useState } from "react";

import Hrmsleftlayout from "../../pages/Hrms/Hrmsleftlayout";
import "./LeaveCalendar.css";

function LeaveCalendar() {
  const [date, setDate] = useState(new Date());

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const firstDay = new Date(year, date.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();

  const prevMonth = () => {
    setDate(new Date(year, date.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDate(new Date(year, date.getMonth() + 1, 1));
  };

  const goToday = () => {
    setDate(new Date());
  };
  const holidays = {
    "2026-01-01": "New Year's Day",
    "2026-01-26": "Australia Day",
    "2026-03-09": "Labour Day",
    "2026-04-03": "Good Friday",
    "2026-04-04": "Easter Saturday",
    "2026-04-05": "Easter Sunday",
    "2026-04-06": "Easter Monday",
    "2026-04-25": "ANZAC Day",
    "2026-06-08": "King's Birthday",
    "2026-09-25": "AFL Grand Final",
    "2026-11-03": "Melbourne Cup",
    "2026-12-25": "Christmas Day",
    "2026-12-26": "Boxing Day",
    "2026-12-28": "Boxing Day Holiday",
  };
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div className="empty"></div>);
  }

  // for (let d = 1; d <= daysInMonth; d++) {
  //   days.push(
  //     <div key={d} className="day">
  //       {d}
  //     </div>,
  //   );
  // }

  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = `${year}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d).padStart(2, "0")}`;

    const holiday = holidays[fullDate];

    days.push(
      <div key={d} className={`day ${holiday ? "holiday-day" : ""}`}>
        <div className="day-number">{d}</div>

        {holiday && <div className="holiday-badge">{holiday}</div>}
      </div>,
    );
  }

  return (
    <Hrmsleftlayout>
      <div className="calendar-container">
        <div className="calendar-title">
          <h3>leave calendar</h3>
        </div>
        <div className="calendar-header">
          <h2>
            {month} {year}
          </h2>
          <div className="controls">
            <button onClick={goToday}>today</button>
            <button onClick={prevMonth}>{"<"}</button>
            <button onClick={nextMonth}>{">"}</button>
          </div>
        </div>

        <div className="calendar-grid header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-grid">{days}</div>
      </div>
    </Hrmsleftlayout>
  );
}

export default LeaveCalendar;
