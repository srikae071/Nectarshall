import React, { useState } from "react";
import Hrmsleftlayout from "../../pages/Hrms/Hrmsleftlayout";
import { getHolidayForDate } from "../../utils/holidays";
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
    days.push(<div key={`empty-${i}`} className="empty"></div>);
  }

  const currentMonthNum = date.getMonth() + 1; // 1-indexed

  for (let d = 1; d <= daysInMonth; d++) {
    const holiday = getHolidayForDate(year, currentMonthNum, d);

    days.push(
      <div key={d} className={`day ${holiday ? "holiday-day" : ""}`}>
        <div className="day-number">{d}</div>
        {holiday && (
          <div className="holiday-badge" title={holiday.name}>
            {holiday.icon} {holiday.name}
          </div>
        )}
      </div>,
    );
  }

  return (
    <Hrmsleftlayout>
      <div className="calendar-container">
        <div className="calendar-title">
          <h3>leave calendar</h3>
        </div>

        <div className="calendar-grid-wrapper">
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
      </div>
    </Hrmsleftlayout>
  );
}

export default LeaveCalendar;
