import HrmsLeftLayout from "../../../Hrmsleftlayout/index.jsx";
import { useState } from "react";
import axios from "axios";
import "./index.css";

function OnBoardingCompliance() {
  const [formData, setFormData] = useState({
    companyName: "",
    abn: "",
    acn: "",

    emailaddress: "",
    companyAddress: "",
    companyPhone: "",

    spocName: "",
    spocNumber: "",
    spocemailaddres: "",

    onboardingDate: "",
    validtill: "",

    type: "Adhoc",

    shortDescription: "",
    description: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/compliance/create",
        {
          ...formData,
          category: "Onboarding Client Compliance",
        },
      );

      alert("Compliance Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Error Saving Compliance");
    }
  };
  return (
    <HrmsLeftLayout>
      <div className="OnboardContainer">
        {/* ROW 1 */}
        <h3>Onboarding Compliance</h3>
        <div className="OnboardRow">
          <div className="OnboardFieldInline">
            <label>Company Name</label>
            <input
              className="OnboardInput"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div className="OnboardFieldInline">
            <label>ABN</label>
            <input
              className="OnboardInput"
              name="abn"
              value={formData.abn}
              onChange={handleChange}
            />
          </div>

          <div className="OnboardFieldInline">
            <label>ACN</label>
            <input
              className="OnboardInput"
              name="acn"
              value={formData.acn}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="OnboardRow">
          <div className="OnboardFieldInline">
            <label>Email Address</label>
            <input
              className="OnboardInput"
              name="emailaddress"
              value={formData.emailaddress}
              onChange={handleChange}
            />
          </div>

          <div className="OnboardFieldInline">
            <label>Company Address</label>
            <input
              className="OnboardInput"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
            />
          </div>

          <div className="OnboardFieldInline">
            <label>Company Phone</label>
            <input
              className="OnboardInput"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ROW 3 */}
        <div className="OnboardRow">
          <div className="OnboardFieldInline">
            <label>SPOC Name</label>
            <input
              className="OnboardInput"
              name="spocName"
              value={formData.spocName}
              onChange={handleChange}
            />
          </div>

          <div className="OnboardFieldInline">
            <label>SPOC Number</label>
            <input
              className="OnboardInput"
              name="spocNumber"
              value={formData.spocNumber}
              onChange={handleChange}
            />
          </div>

          <div className="OnboardFieldInline">
            <label>SPOC Email</label>
            <input
              className="OnboardInput"
              name="spocemailaddres"
              value={formData.spocemailaddres}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ROW 4 */}
        <div className="OnboardRow">
          <div className="OnboardFieldInline">
            <label>Onboarding Date</label>
            <input
              type="date"
              className="OnboardInput"
              name="onboardingDate"
              value={formData.onboardingDate}
              onChange={handleChange}
            />
          </div>

          <div className="OnboardFieldInline">
            <label>Valid Till</label>
            <input
              type="date"
              className="OnboardInput"
              name="validtill"
              value={formData.validtill}
              onChange={handleChange}
            />
          </div>
          <div className="OnboardFieldInline">
            <label>Type</label>
            <select
              className="OnboardInput"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Adhoc">Adhoc</option>
              <option value="Contractual">Contractual</option>
            </select>
          </div>
        </div>

        {/* ROW 5 */}

        {/* TEXTAREAS */}
        <div className="OnboardTextareaBlock">
          <label>Short Description</label>
          <textarea
            className="OnboardTextarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          />
        </div>

        <div className="OnboardTextareaBlock">
          <label>Description</label>
          <textarea
            className="OnboardTextarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="OnboardActions">
          <button className="OnboardSave" onClick={handleSave}>
            Save
          </button>
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

export default OnBoardingCompliance;
