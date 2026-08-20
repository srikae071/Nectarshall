// import "../LeaveBalance/LeaveBalance.css";
import PayrolLayout from "../PayrollLayout";

import "./index.css";

const Payroll = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [2024, 2025, 2026];

  return (
    <PayrolLayout>
      <div className="page-container">
        <div className="card">
          <h2 className="title">Salary Slip</h2>

          <div className="controls">
            <select className="dropdown">
              <option>Select Month</option>
              {months.map((month, index) => (
                <option key={index}>{month}</option>
              ))}
            </select>

            <select className="dropdown">
              <option>Year</option>
              {years.map((year, index) => (
                <option key={index}>{year}</option>
              ))}
            </select>

            <button className="btn view-btn">View</button>

            <button className="btn download-btn">Download</button>
          </div>
        </div>

        <footer className="footer">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </footer>
      </div>
    </PayrolLayout>
  );
};

export default Payroll;
