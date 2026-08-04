import React from "react";

function AccountsExpenditure() {
  return (
    <div style={{ padding: "30px", fontFamily: "Inter, sans-serif" }}>
      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>💸 Expenditure Dashboard</h2>
        <p style={{ color: "#64748b", margin: 0 }}>
          Expenditure management records are currently empty.
        </p>
      </div>
    </div>
  );
}

export default AccountsExpenditure;
