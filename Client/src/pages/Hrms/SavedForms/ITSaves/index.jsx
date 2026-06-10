import { useState } from "react";
// import axios from "axios";

import HrmsLeftLayout from "../../Hrmsleftlayout";

import "./index.css";

function ItSaves() {
  return (
    <HrmsLeftLayout>
      <div className="CreateContainer">
        <h2 className="CreateTitle">Create New Case</h2>

        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Case ID</label>
            <input name="caseId" />
          </div>

          <div className="CreateField">
            <label>Requester Name</label>
            <input name="requesterName" />
          </div>

          <div className="CreateField">
            <label>Department</label>
            <select name="department">
              <option>IT</option>
            </select>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Status</label>

            <select name="status">
              <option value="">Select Status</option>
              <option value="Open">Open</option>
              <option value="Work In Progress">Work In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Sub Status</label>
            <select name="subStatus">
              <option value="">Select Sub Status</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Category</label>
            <select name="category">
              <option>Payroll</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Assignment Group</label>
            <input name="assignmentGroup" />
          </div>

          <div className="CreateField">
            <label>Assign To</label>
            <input name="assignTo" />
          </div>

          <div className="CreateField">
            <label>Impact</label>

            <select name="impact">
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* ROW 4 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Urgency</label>

            <select name="urgency">
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Priority</label>
            <input name="priority" />
          </div>
        </div>

        {/* TEXTAREAS */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>
          <textarea
            className="CreateTextarea CreateShortTextarea"
            name="shortDescription"
          ></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
          ></textarea>
        </div>

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button className="CreateBtn">Save</button>
          <button className="CreateBtn">Submit</button>
          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default ItSaves;
