// import HrmsLeftLayout from "../Hrmsleftlayout";
import AshrNavBar from "../AshrNavBar";
import "./index.css";

function AskForHrMainPage() {
  return (
    <>
      <AshrNavBar />

      <div className="CreateContainer">
        {/* <h2 className="CreateTitle">Create New Case</h2> */}

        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Requested</label>
            <input />
          </div>

          <div className="CreateField">
            <label>Requested For</label>
            <input />
          </div>

          {/* <div className="CreateField">
          <label>Department</label>
          <select>
            <option>IT</option>
          </select>
        </div> */}
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Category</label>
            <input />
            {/* <select>
            <option>Status</option>
          </select> */}
          </div>
          <div className="CreateField">
            <label>Sub Category</label>
            <input />
            {/* <select>
            <option>Pending</option>
          </select> */}
          </div>

          <div className="CreateField">
            <label>Urgency</label>

            <select className="modernSelect">
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        {/* <div className="CreateRow">
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
          <input />
        </div>
      </div> */}

        {/* ROW 4 */}
        {/* <div className="CreateRow">
        <div className="CreateField">
          <label>Urgency</label>
          <input />
        </div>

        <div className="CreateField">
          <label>Priority</label>
          <input />
        </div>
      </div> */}

        {/* TEXTAREAS */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>
          <textarea className="CreateTextarea shortTextarea"></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea className="CreateTextarea"></textarea>
        </div>

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button className="CreateBtn">Save</button>
          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </>
  );
}

export default AskForHrMainPage;
