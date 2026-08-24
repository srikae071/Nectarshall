// import "../LeaveBalance/LeaveBalance.css";
import PayrolLayout from "../PayrollLayout";
import "../../../styles/SharedFormStyle.css";
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
      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Salary Slip</h2>

          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Month</label>
              <select className="lr-input">
                <option>Select Month</option>
                {months.map((month, index) => (
                  <option key={index}>{month}</option>
                ))}
              </select>
            </div>

            <div className="lr-field">
              <label className="lr-label">Year</label>
              <select className="lr-input">
                <option>Year</option>
                {years.map((year, index) => (
                  <option key={index}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="controls">
            <button className="btn view-btn">View</button>
            <button className="btn download-btn">Download</button>
          </div>
        </div>
      </div>
    </PayrolLayout>
  );
};

export default Payroll;
