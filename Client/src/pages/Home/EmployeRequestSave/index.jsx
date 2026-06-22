import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HrmsLeftLayout from "../../Hrms/Hrmsleftlayout";
import axios from "axios";
import "./index.css";

function EmployeRequestSave() {
  const [showFullForm, setShowFullForm] = useState(false);
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
    shortDescription: "",
    description: "",
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
    securityLicenceResult: "",
    drivingLicenceResult: "",
    firstAidResult: "",
    cprResult: "",
    workingWithChildrenResult: "",
    trafficManagementResult: "",
    whiteCardResult: "",
    yellowCardResult: "",

    interview: "",
    status: "",
    employeeShortDescription: "",
    employeeDescription: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleCaseSave = () => {
  //   if (!formData.requesterName) {
  //     alert("Requester Name is mandatory");
  //     return;
  //   }

  //   if (!formData.department) {
  //     alert("Department is mandatory");
  //     return;
  //   }
  // };

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
  };
  const showReferenceSection =
    formData.securityLicenceResult === "PASS" &&
    formData.drivingLicenceResult === "PASS" &&
    formData.firstAidResult === "PASS" &&
    formData.cprResult === "PASS" &&
    formData.workingWithChildrenResult === "PASS" &&
    formData.trafficManagementResult === "PASS" &&
    formData.whiteCardResult === "PASS" &&
    formData.yellowCardResult === "PASS";
  const handleQualificationSave = () => {};
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
    setShowFullForm(true);
  };
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
      );

      setFormData(response.data);
      if (response.data.candidateCompleted) {
        setShowFullForm(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/send-email/${formData.caseId}`,
      );

      alert("Email Sent Successfully");
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      // console.log(error);
    }
  };
  const handleFinalSave = async () => {
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

    let nextStatus = formData.status || "Open";

    if (formData.interview === "PASS") {
      nextStatus = "Interview";
    }

    if (formData.interview === "FAIL") {
      nextStatus = "Closed";
    }

    try {
      // Update Job Request
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        {
          ...formData,
          status: nextStatus,
        },
      );

      // Send Candidate Form 2 email only when PASS
      if (formData.interview === "PASS") {
        await axios.post(
          `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/send-candidate-form2/${formData.caseId}`,
        );
      }

      alert("Request Updated Successfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <HrmsLeftLayout>
      <div className="CreateContainer">
        <div className="SectionCard">
          <h3>1. Preliminary Information</h3>

          <div className="CreateRow">
            <div className="CreateField">
              <label>Requester Name</label>
              <input value={formData.requesterName} readOnly />
            </div>
            <div className="CreateField">
              <label>Case Id *</label>
              <input name="CaseId" value={formData.caseId} readOnly />
            </div>
            <div className="CreateField">
              <label>Department</label>
              <input
                name="department"
                value={formData.department}
                readOnly
                type="text"
                type="text"
                autoComplete="off"
              />
            </div>

            {/* <div className="CreateField">
              <label>Preferred Name</label>
              <input
                name="preferredName"
                value={formData.preferredName}
                onChange={handleChange}
              />
            </div> */}
          </div>

          <div className="CreateRow">
            <div className="CreateField">
              <label>SkillSet *</label>
              <input
                name="Slillset"
                value={formData.skillSet}
                onChange={handleChange}
              />
            </div>

            <div className="CreateField">
              <label>Urgency*</label>
              <input
                name="Urgency"
                value={formData.urgency}
                onChange={handleChange}
              />
            </div>
            <div className="CreateField">
              <label>First Name*</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="CreateRow">
            <div className="CreateField">
              <label>Last Name *</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="CreateField">
              <label>Preferd Name*</label>
              <input
                name="preferredName"
                value={formData.preferredName}
                onChange={handleChange}
              />
            </div>
            <div className="CreateField">
              <label>Email *</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="CreateRow">
            <div className="CreateField">
              <label>Contact Number *</label>
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>

            <div className="CreateField">
              <label>Status *</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="EmployeeSaveStatusDropdown"
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Work In Progress">Work In Progress</option>
                <option value="Offer Letter">Offer Letter</option>
                <option value="Pre Joining Compliance">
                  Pre Joining Compliance
                </option>
              </select>
            </div>
          </div>
          <div className="EmployeeSaveNotesContainer">
            <label>Short Description</label>

            <textarea
              name="employeeShortDescription"
              value={formData.shortDescription || ""}
              onChange={handleChange}
              className="EmployeeSaveShortDescriptionBox"
            />
          </div>

          <div className="EmployeeSaveNotesContainer">
            <label>Description</label>

            <textarea
              name="employeeDescription"
              value={formData.description || ""}
              onChange={handleChange}
              className="EmployeeSaveDescriptionBox"
              placeholder="Enter detailed description..."
            />
          </div>

          {/* <button className="CreateBtn" onClick={handlePreliminarySave}>
            Save & Continue
          </button> */}
          <div className="SectionActions">
            <button className="CreateBtn" onClick={handleSendEmail}>
              Send Email
            </button>

            <button className="CreateBtn" onClick={handleFinalSave}>
              Save & Continue
            </button>
          </div>
        </div>

        {showFullForm && (
          <>
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
                      formData.workRights === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
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
                {/* <button className="CreateBtn" onClick={handleBarrierSave}>
                  Save & Continue
                </button> */}
              </div>
            </div>
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
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      formData.securityLicenceResult === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                  >
                    PASS
                  </button>

                  <button
                    type="button"
                    className={
                      formData.securityLicenceResult === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                  >
                    FAIL
                  </button>
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
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        formData.drivingLicenceResult === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                    >
                      PASS
                    </button>

                    <button
                      type="button"
                      className={
                        formData.drivingLicenceResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                    >
                      FAIL
                    </button>
                  </div>
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
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        formData.firstAidResult === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                    >
                      PASS
                    </button>

                    <button
                      type="button"
                      className={
                        formData.firstAidResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                    >
                      FAIL
                    </button>
                  </div>
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
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        formData.cprResult === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                    >
                      PASS
                    </button>

                    <button
                      type="button"
                      className={
                        formData.cprResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                    >
                      FAIL
                    </button>
                  </div>
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
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        formData.workingWithChildrenResult === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                    >
                      PASS
                    </button>

                    <button
                      type="button"
                      className={
                        formData.workingWithChildrenResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                    >
                      FAIL
                    </button>
                  </div>
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
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        formData.trafficManagementResult === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                    >
                      PASS
                    </button>

                    <button
                      type="button"
                      className={
                        formData.trafficManagementResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                    >
                      FAIL
                    </button>
                  </div>
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
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        formData.whiteCardResult === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                    >
                      PASS
                    </button>

                    <button
                      type="button"
                      className={
                        formData.whiteCardResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                    >
                      FAIL
                    </button>
                  </div>
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
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        formData.yellowCardResult === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                    >
                      PASS
                    </button>

                    <button
                      type="button"
                      className={
                        formData.yellowCardResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                    >
                      FAIL
                    </button>
                  </div>
                </div>
              </div>

              <div className="SectionActions">
                <button className="CreateBtn" onClick={handleQualificationSave}>
                  Save Qualifications
                </button>
              </div>
            </div>
            {showReferenceSection && (
              <div className="SectionCard">
                <h3>4. References</h3>

                <div className="BarrierRow">
                  <label>Interview *</label>

                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        formData.interview === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
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
                        formData.interview === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
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
                  {/* <button className="CreateBtn" onClick={}>
                  Save
                </button> */}
                </div>
              </div>
            )}
            <div className="CreateFooter">
              <button className="CreateBtn" onClick={handleFinalSave}>
                Submit
              </button>
              {/* <button className="CreateBtn">Submit</button> */}
              <button className="CreateBtn">Cancel</button>
            </div>
          </>
        )}
      </div>
    </HrmsLeftLayout>
  );
}
export default EmployeRequestSave;
