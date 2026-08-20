import React from "react";
import HrmsLeftLayout from "../Hrmsleftlayout";
import { FiUsers, FiFolder, FiInfo } from "react-icons/fi";
import "./index.css";

function AssignmentGroup() {
  return (
    <HrmsLeftLayout>
      <div className="assignment-group-container">
        <div className="assignment-group-header">
          <div className="header-title-box">
            <FiUsers className="header-icon" />
            <div>
              <h2>Assignment Group</h2>
              <p>Manage and organize team assignment groups</p>
            </div>
          </div>
        </div>

        <div className="assignment-group-content">
          <div className="welcome-card">
            <h3>👋 Welcome to Assignment Group</h3>
            <p>
              This section displays all team assignment groups and configurations for HRMS cases and task allocations.
            </p>
          </div>

          <div className="no-data-card">
            <FiFolder size={48} className="no-data-icon" />
            <h4>No Assignment Groups Found</h4>
            <p>Currently there is no data available for Assignment Group.</p>
            <div className="info-badge">
              <FiInfo size={14} />
              <span>New groups will appear here once configured.</span>
            </div>
          </div>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default AssignmentGroup;
