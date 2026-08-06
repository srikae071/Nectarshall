import React from "react";
import "./index.css";

function AccountsParent() {
  return (
    <div className="accountsParentContainer">
      <div className="accountsHeader">
        <div>
          <h2>🏢 Accounts Parent</h2>
          <p className="accountsSubtext">
            Parent Accounts Management & Overview.
          </p>
        </div>
      </div>

      <div className="accountsTableWrapper" style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏢</div>
        <h3 style={{ margin: "0 0 8px 0", color: "#334155" }}>Accounts Parent Portal</h3>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
          Parent account overview and configurations will be displayed here.
        </p>
      </div>
    </div>
  );
}

export default AccountsParent;
