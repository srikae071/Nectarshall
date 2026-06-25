import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import CandiateFormNav from "./CandiateFormNav";
import "./index.css";

function CandidateForm() {
  const [submitted, setSubmitted] = useState(false);
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
    securityLicenceResult: "",
    drivingLicenceResult: "",
    firstAidResult: "",
    cprResult: "",
    workingWithChildrenResult: "",
    trafficManagementResult: "",
    whiteCardResult: "",
    yellowCardResult: "",

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

    modernSlaveryCandidateForm: "",
    legalBarrierCandidateForm: "",
    medicalLimitationsCandidateForm: "",
    workRightsCandidateForm: "",

    securityLicenceCandidateForm: "",
    drivingLicenceCandidateForm: "",
    firstAidCandidateForm: "",
    cprCandidateForm: "",
    workingWithChildrenCandidateForm: "",
    trafficManagementCandidateForm: "",
    whiteCardCandidateForm: "",
    yellowCardCandidateForm: "",
  });

  const { id } = useParams();
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

  // const handleQualificationSave = () => {};
  // const handleBarrierSave = () => {
  //   if (!formData.modernSlavery) {
  //     alert("Modern Slavery is mandatory");
  //     return;
  //   }

  //   if (!formData.legalBarrier) {
  //     alert("Legal Barrier is mandatory");
  //     return;
  //   }

  //   if (!formData.medicalLimitations) {
  //     alert("Medical Limitations is mandatory");
  //     return;
  //   }

  //   if (!formData.workRights) {
  //     alert("Work Rights is mandatory");
  //     return;
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/case/${id}`,
      );
      console.log(response.data);
      setFormData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFinalSave = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/case/${id}`,
        {
          ...formData,
          candidateCompleted: true,
          status: "Open",
        },
      );
      setSubmitted(true);

      alert("Candidate Form Submitted Successfully");
    } catch (error) {
      console.log(error);
    }
  };
  if (submitted) {
    return (
      <div className="ThankYouContainer">
        <h1>Thank You</h1>

        <p>Your onboarding form has been submitted successfully.</p>

        <p>
          Our team will review your information and contact you if required.
        </p>
      </div>
    );
  }

  return (
    <>
      <CandiateFormNav />
      <div className="CreateContainer">
        <div className="SectionCard">
          <h2>Requester Name: {formData.requesterName}</h2>
          <h2>ID: {id}</h2>
          <h3>2. Barriers To Employment (Self Declaration)</h3>

          {/* Modern Slavery */}
          <div className="BarrierRow">
            <label>Modern Slavery *</label>

            <div className="ToggleGroup">
              <button
                type="button"
                className={
                  formData.modernSlaveryCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    modernSlaveryCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.modernSlaveryCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    modernSlaveryCandidateForm: "NO",
                  })
                }
              >
                NO
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
                  formData.legalBarrierCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    legalBarrierCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.legalBarrierCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    legalBarrierCandidateForm: "NO",
                  })
                }
              >
                NO
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
                  formData.medicalLimitationsCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    medicalLimitationsCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.medicalLimitationsCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    medicalLimitationsCandidateForm: "NO",
                  })
                }
              >
                NO
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
                  formData.workRightsCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    workRightsCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.workRightsCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    workRightsCandidateForm: "NO",
                  })
                }
              >
                NO
              </button>
            </div>

            <input
              type="file"
              className="DocumentUpload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>

          <div className="SectionActions"></div>
        </div>
        <div className="SectionCard">
          <h3>3. Qualifications</h3>

          {/* Security Licence */}
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

            <div className="ToggleGroup">
              {/* <button
              type="button"
              className={
                formData.securityLicenceCandidateForm === "YES"
                  ? "ToggleActive"
                  : "ToggleBtn"
              }
              onClick={() =>
                setFormData({
                  ...formData,
                  securityLicenceCandidateForm: "YES",
                })
              }
            >
              YES
            </button>

            <button
              type="button"
              className={
                formData.securityLicenceCandidateForm === "NO"
                  ? "ToggleFail"
                  : "ToggleBtn"
              }
              onClick={() =>
                setFormData({
                  ...formData,
                  securityLicenceCandidateForm: "NO",
                })
              }
            >
              NO
            </button> */}
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

              {/* <div className="ToggleGroup">
              <button
                type="button"
                className={
                  formData.drivingLicenceCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    drivingLicenceCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.drivingLicenceCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    drivingLicenceCandidateForm: "NO",
                  })
                }
              >
                NO
              </button>
            </div> */}
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
              {/* <div className="ToggleGroup">
              <button
                type="button"
                className={
                  formData.firstAidCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    firstAidCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.firstAidCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    firstAidCandidateForm: "NO",
                  })
                }
              >
                NO
              </button>
            </div> */}
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
              {/* <div className="ToggleGroup">
              <button
                type="button"
                className={
                  formData.cprCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    cprCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.cprCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    cprCandidateForm: "NO",
                  })
                }
              >
                NO
              </button>
            </div> */}
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
                {/* <button
                type="button"
                className={
                  formData.workingWithChildrenCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    workingWithChildrenCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.workingWithChildrenCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    workingWithChildrenCandidateForm: "NO",
                  })
                }
              >
                NO
              </button> */}
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
                {/* <button
                type="button"
                className={
                  formData.trafficManagementCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    trafficManagementCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.trafficManagementCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    trafficManagementCandidateForm: "NO",
                  })
                }
              >
                NO
              </button> */}
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
                {/* <button
                type="button"
                className={
                  formData.whiteCardCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    whiteCardCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.whiteCardCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    whiteCardCandidateForm: "NO",
                  })
                }
              >
                NO
              </button> */}
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
                {/* <button
                type="button"
                className={
                  formData.yellowCardCandidateForm === "YES"
                    ? "ToggleActive"
                    : "ToggleBtns"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    yellowCardCandidateForm: "YES",
                  })
                }
              >
                YES
              </button>

              <button
                type="button"
                className={
                  formData.yellowCardCandidateForm === "NO"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    yellowCardCandidateForm: "NO",
                  })
                }
              >
                NO
              </button> */}
              </div>
            </div>
          </div>

          <div className="SectionActions"></div>
        </div>

        <div className="CreateFooter">
          <button className="CreateBtn" onClick={handleFinalSave}>
            Submit
          </button>
          {/* <button className="CreateBtn">Submit</button> */}
          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </>
  );
}
export default CandidateForm;
