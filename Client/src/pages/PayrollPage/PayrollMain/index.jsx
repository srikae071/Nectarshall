import React, { useState } from "react";
import PayrolLayout from "../PayrollLayout";
import "../../../styles/SharedFormStyle.css";
import "./index.css";

const Payroll = () => {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
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
  const years = [2024, 2025, 2026, 2027];

  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [showSlip, setShowSlip] = useState(false);

  const handleView = () => {
    setShowSlip(true);
  };

  const handleDownload = () => {
    alert(`Downloading Salary Slip for ${selectedWeek}, ${selectedMonth} ${selectedYear}...`);
  };

  return (
    <PayrolLayout>
      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Salary Slip & Payroll Management</h2>

          <div className="lr-grid-3">
            {/* WEEK SELECT */}
            <div className="lr-field">
              <label className="lr-label">Week</label>
              <select
                className="lr-input"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              >
                <option value="">Select Week</option>
                {weeks.map((week, index) => (
                  <option key={index} value={week}>{week}</option>
                ))}
              </select>
            </div>

            {/* MONTH SELECT */}
            <div className="lr-field">
              <label className="lr-label">Month</label>
              <select
                className="lr-input"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={month}>{month}</option>
                ))}
              </select>
            </div>

            {/* YEAR SELECT */}
            <div className="lr-field">
              <label className="lr-label">Year</label>
              <select
                className="lr-input"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="controls" style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <button
              className="btn view-btn"
              onClick={handleView}
              style={{
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: "600",
                padding: "8px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              👁️ View
            </button>
            <button
              className="btn download-btn"
              onClick={handleDownload}
              style={{
                background: "#059669",
                color: "#ffffff",
                fontWeight: "600",
                padding: "8px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              📥 Download
            </button>
          </div>

          {/* SLIP PREVIEW SECTION */}
          {showSlip && (
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
                📄 Salary Slip Summary ({selectedWeek}, {selectedMonth} {selectedYear})
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", fontSize: "13px", color: "#334155" }}>
                <div><strong>Period:</strong> {selectedWeek}, {selectedMonth} {selectedYear}</div>
                <div><strong>Basic Pay:</strong> $3,450.00</div>
                <div><strong>Allowances:</strong> $420.00</div>
                <div><strong>Tax Deduction (TFN):</strong> $680.00</div>
                <div><strong>Superannuation (11.5%):</strong> $396.75</div>
                <div><strong>Net Salary Paid:</strong> <span style={{ color: "#059669", fontWeight: "700" }}>$3,190.00</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PayrolLayout>
  );
};

export default Payroll;
