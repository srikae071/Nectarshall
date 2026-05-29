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

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div className="empty"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(
      <div key={d} className="day">
        {d}
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
