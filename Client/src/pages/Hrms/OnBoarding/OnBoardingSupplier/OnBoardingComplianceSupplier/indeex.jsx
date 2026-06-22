import HrmsLeftLayout from "../../../Hrmsleftlayout/index.jsx";
import "./index.css";

function OnBoardingComplianceSupplier() {
  return (
    <HrmsLeftLayout>
      <div className="OnboardContainer">
        {/* ROW 1 */}
        <h3>Onboarding Compliance</h3>
        <div className="OnboardRow">
          <div className="OnboardFieldInline">
            <label>Company Name</label>
            <input className="OnboardInput" />
          </div>

          <div className="OnboardFieldInline">
            <label>ABN</label>
            <input className="OnboardInput" />
          </div>

          <div className="OnboardFieldInline">
            <label>ACN</label>
            <input className="OnboardInput" />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="OnboardRow">
          <div className="OnboardFieldInline">
            <label>Address</label>
            <input className="OnboardInput" />
          </div>

          <div className="OnboardFieldInline">
            <label>Company Address</label>
            <input className="OnboardInput" />
          </div>

          <div className="OnboardFieldInline">
            <label>Company Phone</label>
            <input className="OnboardInput" />
          </div>
        </div>

        {/* ROW 3 */}
        <div className="OnboardRow">
          <div className="OnboardFieldInline">
            <label>SPOC Name</label>
            <input className="OnboardInput" />
          </div>

          <div className="OnboardFieldInline">
            <label>SPOC Number</label>
            <input className="OnboardInput" />
          </div>

          <div className="OnboardFieldInline">
            <label>Email</label>
            <input className="OnboardInput" />
          </div>
        </div>

        {/* ROW 4 */}
        <div className="OnboardRow">
          <div className="OnboardFieldInline">
            <label>Contact Number</label>
            <input className="OnboardInput" />
          </div>

          <div className="OnboardFieldInline">
            <label>Onboarding Date</label>
            <input type="date" className="OnboardInput" />
          </div>

          <div className="OnboardFieldInline">
            <label>Offboarding Date</label>
            <input type="date" className="OnboardInput" />
          </div>
        </div>

        {/* ROW 5 */}
        <div className="OnboardRow">
          <div className="OnboardFieldInline OnboardFieldSmall">
            <label>Type</label>
            <select className="OnboardInput">
              <option>Adhoc</option>
              <option>Contractual</option>
            </select>
          </div>
        </div>

        {/* TEXTAREAS */}
        <div className="OnboardTextareaBlock">
          <label>Short Description</label>
          <textarea className="OnboardTextarea" />
        </div>

        <div className="OnboardTextareaBlock">
          <label>Description</label>
          <textarea className="OnboardTextarea" />
        </div>

        <div className="OnboardActions">
          <button className="OnboardSave">Save</button>
          <button className="OnboardSave">Submit</button>
          <button className="OnboardCancel">Cancel</button>
        </div>
        {/* <div className="OnboardFooter">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div> */}
      </div>
    </HrmsLeftLayout>
  );
}

export default OnBoardingComplianceSupplier;
