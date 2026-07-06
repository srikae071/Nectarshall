import { useState } from "react";
import axios from "axios";

import CncLeftLayout from "../../../../../Cnc/CncLeftLayout";

import "./index.css";

function OnBoardingResonanceRequirementsCreateNew() {
  const [showPreliminary, setShowPreliminary] = useState(false);
  const [showBarriers, setShowBarriers] = useState(false);
  const [showQualifications, setShowQualifications] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [formData, setFormData] = useState({
    caseId: "",
    requesterName: "",
    department: "",
    impact: "",
    urgency: "",
    priority: "",

    firstName: "",
    lastName: "",
    preferredName: "",
    email: "",
    contactNumber: "",

    modernSlavery: "",
    legalBarrier: "",
    medicalLimitations: "",
    workRights: "",

    securityLicence: "",
    securityLicenceExpiry: "",

    drivingLicence: "",
    drivingLicenceExpiry: "",

    firstAid: "",
    firstAidExpiry: "",

    cpr: "",
    cprExpiry: "",

    workingWithChildren: "",
    workingWithChildrenExpiry: "",

    trafficManagement: "",
    trafficManagementExpiry: "",

    whiteCard: "",
    whiteCardExpiry: "",

    yellowCard: "",
    yellowCardExpiry: "",

    interview: "",
  });

  const subStatusOptions = {
    Pending: ["Request Information Pending", "Vendor Action Pending"],
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCaseSave = () => {
    if (!formData.requesterName) {
      alert("Requester Name is mandatory");
      return;
    }

    if (!formData.department) {
      alert("Department is mandatory");
      return;
    }

    setShowPreliminary(true);
  };

  const handlePreliminarySave = () => {
    if (!formData.firstName) {
      alert("First Name is mandatory");
      return;
    }

    if (!formData.lastName) {
      alert("Last Name is mandatory");
      return;
    }

    if (!formData.email) {
      alert("Email is mandatory");
      return;
    }

    if (!formData.contactNumber) {
      alert("Contact Number is mandatory");
      return;
    }

    setShowBarriers(true);
  };

  const handleQualificationSave = () => {
    setShowReferences(true);
  };
  const handleBarrierSave = () => {
    if (!formData.modernSlavery) {
      alert("Modern Slavery is mandatory");
      return;
    }

    if (!formData.legalBarrier) {
      alert("Legal Barrier is mandatory");
      return;
    }

    if (!formData.medicalLimitations) {
      alert("Medical Limitations is mandatory");
      return;
    }

    if (!formData.workRights) {
      alert("Work Rights is mandatory");
      return;
    }

    setShowQualifications(true);
  };
  // const handleFinalSave = () => {
  //   if (!formData.interview) {
  //     alert("Interview result is mandatory");
  //     return;
  //   }

  //   alert("Form Saved Successfully");
  // };

  const handleFinalSave = async () => {
    if (!formData.interview) {
      alert("Interview result is mandatory");
      return;
    }

    try {
      if (!formData.status) {
        alert("Status is mandatory");
        return;
      }

      const payload = {
        ...formData,
        category: "Resonance Requirement",
      };

      await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests",
        payload,
      );

      alert("Job Request Saved Successfully");
    } catch (error) {
      console.error(error);

      alert("Error Saving Job Request");
    }
  };
  return (
    <CncLeftLayout>
      <div className="CreateContainer">
        <h2 className="CreateTitle">Create New Case</h2>

        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Case ID</label>
            <input
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Requester Name</label>
            <input
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="C & C">C & C</option>
              <option value="Gardening">Gardening</option>
              <option value="Patrolling">Patrolling</option>
              <option value="Security">Security</option>
              <option value="Accounts">Accounts</option>
            </select>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>

              <option value="Open">Open</option>

              <option value="Pre-Joining">Pre-Joining Compliance</option>

              <option value="Offer Letter">Offer Letter</option>

              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Sub Status</label>
            <select
              name="subStatus"
              value={formData.subStatus}
              onChange={handleChange}
              disabled={formData.status !== "Pending"}
            >
              <option value="">Select Sub Status</option>

              {subStatusOptions[formData.status]?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="CreateField">
            <label>Impact</label>

            <select
              name="impact"
              value={formData.impact}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Urgency</label>

            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Priority</label>

            <input
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ROW 4 */}

        {/* TEXTAREAS */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>
          <textarea
            className="CreateTextarea CreateShortTextarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        {showPreliminary && (
          <div className="SectionCard">
            <h3>1. Preliminary Information</h3>

            <div className="CreateRow">
              <div className="CreateField">
                <label>First Name *</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="CreateField">
                <label>Last Name *</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="CreateField">
                <label>Preferred Name</label>
                <input
                  name="preferredName"
                  value={formData.preferredName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="CreateRow">
              <div className="CreateField">
                <label>Email *</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="CreateField">
                <label>Contact Number *</label>
                <input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="CreateBtn" onClick={handlePreliminarySave}>
              Save & Continue
            </button>
          </div>
        )}
        {showBarriers && (
          <div className="SectionCard">
            <h3>2. Barriers To Employment (Self Declaration)</h3>

            {/* Modern Slavery */}
            <div className="BarrierRow">
              <label>Modern Slavery *</label>

              <div className="ToggleGroup">
                <button
                  type="button"
                  className={
                    formData.modernSlavery === "PASS"
                      ? "ToggleActive"
                      : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      modernSlavery: "PASS",
                    })
                  }
                >
                  PASS
                </button>

                <button
                  type="button"
                  className={
                    formData.modernSlavery === "FAIL"
                      ? "ToggleFail"
                      : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      modernSlavery: "FAIL",
                    })
                  }
                >
                  FAIL
                </button>
              </div>
            </div>

            {/* Legal Barrier */}
            <div className="BarrierRow">
              <label>Legal Barrier *</label>

              <div className="ToggleGroup">
                <button
                  type="button"
                  className={
                    formData.legalBarrier === "PASS"
                      ? "ToggleActive"
                      : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      legalBarrier: "PASS",
                    })
                  }
                >
                  PASS
                </button>

                <button
                  type="button"
                  className={
                    formData.legalBarrier === "FAIL"
                      ? "ToggleFail"
                      : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      legalBarrier: "FAIL",
                    })
                  }
                >
                  FAIL
                </button>
              </div>
            </div>

            {/* Medical Limitations */}
            <div className="BarrierRow">
              <label>Medical Limitations *</label>

              <div className="ToggleGroup">
                <button
                  type="button"
                  className={
                    formData.medicalLimitations === "PASS"
                      ? "ToggleActive"
                      : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      medicalLimitations: "PASS",
                    })
                  }
                >
                  PASS
                </button>

                <button
                  type="button"
                  className={
                    formData.medicalLimitations === "FAIL"
                      ? "ToggleFail"
                      : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      medicalLimitations: "FAIL",
                    })
                  }
                >
                  FAIL
                </button>
              </div>
            </div>

            {/* Work Rights */}
            <div className="BarrierRow">
              <label>Work Rights *</label>

              <div className="ToggleGroup">
                <button
                  type="button"
                  className={
                    formData.workRights === "PASS"
                      ? "ToggleActive"
                      : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      workRights: "PASS",
                    })
                  }
                >
                  PASS
                </button>

                <button
                  type="button"
                  className={
                    formData.workRights === "FAIL" ? "ToggleFail" : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      workRights: "FAIL",
                    })
                  }
                >
                  FAIL
                </button>
              </div>

              <input
                type="file"
                className="DocumentUpload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>

            <div className="SectionActions">
              <button className="CreateBtn" onClick={handleBarrierSave}>
                Save & Continue
              </button>
            </div>
          </div>
        )}
        {showQualifications && (
          <div className="SectionCard">
            <h3>3. Qualifications</h3>

            {/* Security Licence */}
            <div className="QualificationCard">
              <h4>Security Licence</h4>

              <div className="QualificationRow">
                <input
                  type="text"
                  placeholder="Licence Number"
                  name="securityLicence"
                  value={formData.securityLicence}
                  onChange={handleChange}
                />

                <input type="file" />

                <input
                  type="date"
                  name="securityLicenceExpiry"
                  value={formData.securityLicenceExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Driving Licence */}
            <div className="QualificationCard">
              <h4>Driving Licence</h4>

              <div className="QualificationRow">
                <input
                  type="text"
                  placeholder="Licence Number"
                  name="drivingLicence"
                  value={formData.drivingLicence}
                  onChange={handleChange}
                />

                <input type="file" />

                <input
                  type="date"
                  name="drivingLicenceExpiry"
                  value={formData.drivingLicenceExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* First Aid */}
            <div className="QualificationCard">
              <h4>First Aid</h4>

              <div className="QualificationRow">
                <input
                  type="text"
                  placeholder="Certificate Number"
                  name="firstAid"
                  value={formData.firstAid}
                  onChange={handleChange}
                />

                <input type="file" />

                <input
                  type="date"
                  name="firstAidExpiry"
                  value={formData.firstAidExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CPR */}
            <div className="QualificationCard">
              <h4>CPR</h4>

              <div className="QualificationRow">
                <input
                  type="text"
                  placeholder="Certificate Number"
                  name="cpr"
                  value={formData.cpr}
                  onChange={handleChange}
                />

                <input type="file" />

                <input
                  type="date"
                  name="cprExpiry"
                  value={formData.cprExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Working With Children Check */}
            <div className="QualificationCard">
              <h4>Working With Children Check</h4>

              <div className="QualificationRow">
                <input
                  type="text"
                  placeholder="Check Number"
                  name="workingWithChildren"
                  value={formData.workingWithChildren}
                  onChange={handleChange}
                />

                <input type="file" />

                <input
                  type="date"
                  name="workingWithChildrenExpiry"
                  value={formData.workingWithChildrenExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Traffic Management */}
            <div className="QualificationCard">
              <h4>Traffic Management</h4>

              <div className="QualificationRow">
                <input
                  type="text"
                  placeholder="Certificate Number"
                  name="trafficManagement"
                  value={formData.trafficManagement}
                  onChange={handleChange}
                />

                <input type="file" />

                <input
                  type="date"
                  name="trafficManagementExpiry"
                  value={formData.trafficManagementExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* White Card */}
            <div className="QualificationCard">
              <h4>White Card</h4>

              <div className="QualificationRow">
                <input
                  type="text"
                  placeholder="White Card Number"
                  name="whiteCard"
                  value={formData.whiteCard}
                  onChange={handleChange}
                />

                <input type="file" />

                <input
                  type="date"
                  name="whiteCardExpiry"
                  value={formData.whiteCardExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Yellow Card */}
            <div className="QualificationCard">
              <h4>Yellow Card</h4>

              <div className="QualificationRow">
                <input
                  type="text"
                  placeholder="Yellow Card Number"
                  name="yellowCard"
                  value={formData.yellowCard}
                  onChange={handleChange}
                />

                <input type="file" />

                <input
                  type="date"
                  name="yellowCardExpiry"
                  value={formData.yellowCardExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="SectionActions">
              <button className="CreateBtn" onClick={handleQualificationSave}>
                Save Qualifications
              </button>
            </div>
          </div>
        )}
        {showReferences && (
          <div className="SectionCard">
            <h3>4. References</h3>

            <div className="BarrierRow">
              <label>Interview *</label>

              <div className="ToggleGroup">
                <button
                  type="button"
                  className={
                    formData.interview === "PASS" ? "ToggleActive" : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      interview: "PASS",
                    })
                  }
                >
                  PASS
                </button>

                <button
                  type="button"
                  className={
                    formData.interview === "FAIL" ? "ToggleFail" : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      interview: "FAIL",
                    })
                  }
                >
                  FAIL
                </button>
              </div>
            </div>

            <div className="SectionActions">
              <button className="CreateBtn" onClick={handleFinalSave}>
                Save
              </button>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button className="CreateBtn" onClick={handleCaseSave}>
            Submit
          </button>
          {/* <button className="CreateBtn">Submit</button> */}
          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </CncLeftLayout>
  );
}

export default OnBoardingResonanceRequirementsCreateNew;
