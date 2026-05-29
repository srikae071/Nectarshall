import HrmsLeftLayout from "../../../Hrmsleftlayout/index";
import "./index.css";

function EmployeeCreateNew() {
  return (
    <HrmsLeftLayout>
      <div className="createContainer">
        <div className="card">
          <h2 className="title">Create New</h2>

          <div className="formGrid">
            <input placeholder="Case ID" />
            <input placeholder="Requester Name" />

            <select>
              <option>IT</option>
            </select>

            <select>
              <option>Payroll</option>
            </select>

            <select>
              <option>Status</option>
            </select>

            <select>
              <option>Pending Information</option>
            </select>

            <input placeholder="Assignment Group" />
            <input placeholder="Assign to" />

            <input placeholder="Impact" />
            <input placeholder="Argency" />
            <input placeholder="Priority" />
          </div>

          <textarea className="full" placeholder="Short Description"></textarea>
          <textarea className="full" placeholder="Description"></textarea>

          <div className="footerBtns">
            <button className="saveBtn">💾 Save</button>
            <button className="cancelBtn">✕ Cancel</button>
          </div>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default EmployeeCreateNew;
