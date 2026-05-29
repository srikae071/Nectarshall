import HrmsLeftLayout from "../Hrmsleftlayout";
import "./index.css";

function CreateCase() {
  return (
    <HrmsLeftLayout>
      <div className="CreateContainer">
        <h2 className="CreateTitle">Create New Case</h2>

        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Case ID</label>
            <input />
          </div>

          <div className="CreateField">
            <label>Requested Name</label>
            <input />
          </div>

          <div className="CreateField">
            <label>Department</label>
            <select>
              <option>IT</option>
            </select>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Status</label>
            <select>
              <option>Status</option>
            </select>
          </div>
          <div className="CreateField">
            <label>Sub Status</label>
            <select>
              <option>Pending</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Category</label>
            <select>
              <option>Payroll</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Assignment Group</label>
            <input />
          </div>

          <div className="CreateField">
            <label>Assign To</label>
            <input />
          </div>

          <div className="CreateField">
            <label>Impact</label>

            <select>
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

            <select>
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Priority</label>
            <input />
          </div>
        </div>

        {/* TEXTAREAS */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>
          <textarea className="CreateTextarea CreateShortTextarea"></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea className="CreateTextarea CreateDescriptionTextarea"></textarea>
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

export default CreateCase;
