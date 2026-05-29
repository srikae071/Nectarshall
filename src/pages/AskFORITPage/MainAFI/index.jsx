import { useState } from "react";
import AskForItNavBar from "../AskForItNavBar";
import "./index.css";

function MainAFI() {
  const [category, setCategory] = useState("");

  const subCategoryOptions = {
    Network: ["Router", "LAN", "WAN"],

    Application: ["Zoho", "Guard House", "Light House"],

    "Desk Side Support": ["Laptop Issue", "Printer Issue", "System Slow"],
  };

  return (
    <>
      <AskForItNavBar />

      <div className="CreateContainer">
        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Requester</label>
            <input />
          </div>

          <div className="CreateField">
            <label>Requester For</label>
            <input />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
          {/* CATEGORY */}
          <div className="CreateField">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select</option>

              <option>Network</option>
              <option>Application</option>
              <option>Desk Side Support</option>
            </select>
          </div>

          {/* SUB CATEGORY */}
          <div className="CreateField">
            <label>Sub Category</label>

            <select disabled={!category}>
              <option value="">Select</option>

              {subCategoryOptions[category]?.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
          </div>

          {/* URGENCY */}
          <div className="CreateField">
            <label>Urgency</label>

            <select>
              <option>Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* SHORT DESCRIPTION */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>

          <textarea className="CreateTextarea shortTextarea"></textarea>
        </div>

        {/* DESCRIPTION */}
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

export default MainAFI;
