import { useState } from "react";
import Navbar from "./Navbar";
import Payrollsidebar from "../components/Payrollsidebar";
import "../components/Layout.css";

function PayrolLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app">
      <Navbar />

      {/* Mobile Header */}
      <div className="mobileHeader">
        <button onClick={() => setOpen(true)}>☰</button>
        <span>Employee Centre</span>
      </div>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      <div className="main">
        {/* Sidebar */}
        <div className={`sidebarWrapper ${open ? "open" : ""}`}>
          {/* Close button (mobile only) */}
          <div className="sidebarHeader">
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <Payrollsidebar setOpen={setOpen} />
        </div>

        {/* Page Content */}
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default PayrolLayout;
