import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchApiData, sendApiData } from "../../../utils/apiClient";
import HrmsLeftLayout from "../../Hrms/Hrmsleftlayout";
import axios from "axios";
import "./index.css";

function EmployeRequestSave() {
  const [showFullForm, setShowFullForm] = useState(false);
  const [showCandidatesList, setShowCandidatesList] = useState(false);
  const [activeCandTabIdx, setActiveCandTabIdx] = useState(0);
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
    modernSlaveryResult: "",
    legalBarrierResult: "",
    medicalLimitationsResult: "",
    workRightsResult: "",
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

  const handleAddCandidate = () => {
    setShowCandidatesList(true);
    setFormData((prev) => {
      const list =
        Array.isArray(prev.candidates) && prev.candidates.length > 0
          ? [...prev.candidates]
          : [];
      const nextNum = list.length + 1;
      const nextId = `CND-${String(nextNum).padStart(3, "0")}`;
      list.push({
        candidateId: nextId,
        name: "",
        email: "",
      });
      return {
        ...prev,
        candidates: list,
      };
    });
  };

  const handleCandidateChange = (index, field, value) => {
    setFormData((prev) => {
      const list = Array.isArray(prev.candidates) ? [...prev.candidates] : [];
      list[index] = {
        ...list[index],
        [field]: value,
      };
      const firstCand = list[0];
      return {
        ...prev,
        candidates: list,
        email: firstCand?.email || prev.email,
        firstName: firstCand?.name || prev.firstName,
      };
    });
  };

  const handleRemoveCandidate = (index) => {
    setFormData((prev) => {
      const list = (prev.candidates || []).filter((_, i) => i !== index);
      if (list.length === 0) {
        setShowCandidatesList(false);
      }
      const reindexed = list.map((c, i) => ({
        ...c,
        candidateId: `CND-${String(i + 1).padStart(3, "0")}`,
      }));
      return {
        ...prev,
        candidates: reindexed,
      };
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetchApiData(`/api/jobrequests/${id}`);
      const data = response.data;

      if (Array.isArray(data.candidates) && data.candidates.length > 0) {
        setShowCandidatesList(true);
      } else {
        data.candidates = [];
        setShowCandidatesList(false);
      }

      setFormData(data);
      if (data.candidateCompleted) {
        setShowFullForm(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleQualificationSave = async () => {
    try {
      await sendApiData(
        `/api/jobrequests/${id}`,
        {
          ...formData,
          status: "Interview",
        },
        "put"
      );

      setFormData({
        ...formData,
        status: "Interview",
      });

      alert("Status changed to Interview");
    } catch (error) {
      console.log(error);
    }
  };
  const handleSendEmail = async () => {
    try {
      await sendApiData(
        `/api/jobrequests/send-email/${formData.caseId}`,
        {}
      );

      alert("Email Sent Successfully");
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      // console.log(error);
    }
  };
  // const handleFinalSave = async () => {
  //   if (!formData.firstName) {
  //     alert("First Name is mandatory");
  //     return;
  //   }

  //   if (!formData.lastName) {
  //     alert("Last Name is mandatory");
  //     return;
  //   }

  //   if (!formData.email) {
  //     alert("Email is mandatory");
  //     return;
  //   }

  //   if (!formData.contactNumber) {
  //     alert("Contact Number is mandatory");
  //     return;
  //   }

  //   let nextStatus = formData.status || "Open";

  //   if (formData.interview === "PASS") {
  //     nextStatus = "Interview";
  //   }

  //   if (formData.interview === "FAIL") {
  //     nextStatus = "Closed";
  //   }

  //   try {
  //     // Update Job Request
  //     await axios.put(
  //       `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
  //       {
  //         ...formData,
  //         status: nextStatus,
  //       },
  //     );

  //     // Send Candidate Form 2 email only when PASS
  //     if (formData.interview === "PASS") {
  //       await axios.post(
  //         `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/send-candidate-form2/${formData.caseId}`,
  //       );
  //     }

  //     alert("Request Updated Successfully");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
      nextStatus = "OfferLetter";
    }

    if (formData.interview === "FAIL") {
      nextStatus = "Closed";
    }
    try {
      await sendApiData(
        `/api/jobrequests/${id}`,
        {
          ...formData,
          status: nextStatus,
        },
        "put"
      );

      // if (formData.interview === "PASS") {
      //   await axios.post(
      //     `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/send-candidate-form2/${formData.caseId}`,
      //   );
      // }

      alert("Request Updated Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const candidateList =
    Array.isArray(formData.candidates) && formData.candidates.length > 0
      ? formData.candidates
      : [
          {
            candidateId: "CND-001",
            name: `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || formData.requesterName || "Candidate",
            email: formData.email || "",
            submitted: formData.candidateCompleted || false,
            modernSlaveryCandidateForm: formData.modernSlaveryCandidateForm,
            legalBarrierCandidateForm: formData.legalBarrierCandidateForm,
            medicalLimitationsCandidateForm: formData.medicalLimitationsCandidateForm,
            workRightsCandidateForm: formData.workRightsCandidateForm,
            securityLicenceCandidateForm: formData.securityLicenceCandidateForm,
            drivingLicenceCandidateForm: formData.drivingLicenceCandidateForm,
            firstAidCandidateForm: formData.firstAidCandidateForm,
            cprCandidateForm: formData.cprCandidateForm,
            workingWithChildrenCandidateForm: formData.workingWithChildrenCandidateForm,
            trafficManagementCandidateForm: formData.trafficManagementCandidateForm,
            whiteCardCandidateForm: formData.whiteCardCandidateForm,
            yellowCardCandidateForm: formData.yellowCardCandidateForm,
            bankName: formData.bankName,
            bankAccount: formData.bankAccount,
            bsb: formData.bsb,
            taxFileNumber: formData.taxFileNumber,
            superFundName: formData.superFundName,
            superMemberNumber: formData.superMemberNumber,
          },
        ];

  const currentCand = candidateList[activeCandTabIdx] || candidateList[0];

  return (
    <HrmsLeftLayout>
      <div className="CreateContainer">
        <div className="SectionCard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ margin: 0 }}>1. Preliminary Information</h3>
            <button
              type="button"
              onClick={handleAddCandidate}
              style={{
                background: "#047857",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              + Add Employee
            </button>
          </div>

          <div className="CreateRow">
            <div className="CreateField">
              <label>Case Id *</label>
              <input name="CaseId" value={formData.caseId} readOnly />
            </div>
            <div className="CreateField">
              <label>Requester Name</label>
              <input value={formData.requesterName} readOnly />
            </div>

            <div className="CreateField">
              <label>Department</label>
              <input
                name="department"
                value={formData.department}
                readOnly
                type="text"
                autoComplete="off"
              />
            </div>
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
              <label>Primary Email *</label>
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
                <option value="Interview">Interwiew</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC CANDIDATE / EMPLOYEE ENTRIES - VISIBLE ONLY WHEN + Add Employee IS CLICKED */}
          {showCandidatesList && formData.candidates && formData.candidates.length > 0 && (
            <div style={{ marginTop: "18px", marginBottom: "18px", borderTop: "1px dashed #cbd5e1", paddingTop: "14px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                👥 Candidate / Employee List
              </h4>

              {formData.candidates.map((cand, candIdx) => (
                <div
                  key={candIdx}
                  className="CreateRow"
                  style={{
                    background: "#f8fafc",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    marginBottom: "10px",
                    alignItems: "center",
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className="CreateField" style={{ flex: "0 0 160px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Employee / Candidate ID</label>
                    <input
                      value={cand.candidateId || `CND-${String(candIdx + 1).padStart(3, "0")}`}
                      readOnly
                      style={{ background: "#e2e8f0", fontWeight: "700", color: "#0f172a" }}
                    />
                  </div>

                  <div className="CreateField" style={{ flex: 1 }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Employee Name *</label>
                    <input
                      value={cand.name || ""}
                      onChange={(e) => handleCandidateChange(candIdx, "name", e.target.value)}
                      placeholder="Enter employee name..."
                    />
                  </div>

                  <div className="CreateField" style={{ flex: 1 }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Employee Email ID *</label>
                    <input
                      type="email"
                      value={cand.email || ""}
                      onChange={(e) => handleCandidateChange(candIdx, "email", e.target.value)}
                      placeholder="Enter email ID..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCandidate(candIdx)}
                    title="Remove Candidate"
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      marginTop: "16px",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
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
            {/* CANDIDATE SELECTOR TABS BAR */}
            {candidateList.length > 0 && (
              <div style={{ background: "#ffffff", padding: "16px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                  📂 Candidate Onboarding Forms ({candidateList.length}):
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {candidateList.map((cand, idx) => {
                    const isSelected = activeCandTabIdx === idx;
                    const isSubmitted = cand.submitted;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveCandTabIdx(idx)}
                        style={{
                          padding: "8px 18px",
                          borderRadius: "20px",
                          border: isSelected ? "2px solid #0284c7" : "1px solid #cbd5e1",
                          background: isSelected ? "#e0f2fe" : "#ffffff",
                          color: isSelected ? "#0369a1" : "#475569",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span>👤 {cand.candidateId || `CND-${String(idx + 1).padStart(3, "0")}`}</span>
                        <span>({cand.name || "Candidate"})</span>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 7px",
                            borderRadius: "10px",
                            background: isSubmitted ? "#dcfce7" : "#fef3c7",
                            color: isSubmitted ? "#15803d" : "#b45309",
                            fontWeight: "700",
                          }}
                        >
                          {isSubmitted ? "Submitted" : "Pending"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!currentCand.submitted ? (
              <div
                style={{
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                  borderRadius: "10px",
                  padding: "24px 28px",
                  color: "#d48806",
                  fontWeight: "700",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginTop: "16px",
                  marginBottom: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ fontSize: "28px" }}>⚠️</span>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px" }}>
                    Candidate still did not submit the data.
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#8c6b00", fontWeight: "500" }}>
                    Candidate <strong>{currentCand.candidateId || `CND-${String(activeCandTabIdx + 1).padStart(3, "0")}`} ({currentCand.name || "Candidate"})</strong> has not submitted their onboarding form response yet.
                  </div>
                </div>
              </div>
            ) : (
              <>
            <div className="SectionCard">
              <h3>2. Barriers To Employment (Self Declaration) - {currentCand.candidateId || "CND-001"}</h3>

              {/* Modern Slavery */}
              <div className="BarrierRow">
                <label>Modern Slavery *</label>

                {/* Candidate Answer */}
                <span
                  className={
                    (currentCand.modernSlaveryCandidateForm || formData.modernSlaveryCandidateForm) === "Yes"
                      ? "CandidateAnswerYes"
                      : "CandidateAnswerNo"
                  }
                >
                  {currentCand.modernSlaveryCandidateForm || formData.modernSlaveryCandidateForm}
                </span>

                {/* HR Decision */}
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      formData.modernSlaveryResult === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        modernSlaveryResult: "PASS",
                      })
                    }
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      formData.modernSlaveryResult === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        modernSlaveryResult: "FAIL",
                      })
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
              {/* Legal Barrier */}
              {/* Legal Barrier */}
              <div className="BarrierRow">
                <label>Legal Barrier *</label>

                {/* Candidate Answer */}
                <span
                  className={
                    formData.legalBarrierCandidateForm === "Yes"
                      ? "CandidateAnswerYes"
                      : "CandidateAnswerNo"
                  }
                >
                  {formData.legalBarrierCandidateForm}
                </span>

                {/* HR Decision */}
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      formData.legalBarrierResult === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        legalBarrierResult: "PASS",
                      })
                    }
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      formData.legalBarrierResult === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        legalBarrierResult: "FAIL",
                      })
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Medical Limitations */}
              {/* Medical Limitations */}
              <div className="BarrierRow">
                <label>Medical Limitations *</label>

                {/* Candidate Answer */}
                <span
                  className={
                    formData.medicalLimitationsCandidateForm === "Yes"
                      ? "CandidateAnswerYes"
                      : "CandidateAnswerNo"
                  }
                >
                  {formData.medicalLimitationsCandidateForm}
                </span>

                {/* HR Decision */}
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      formData.medicalLimitationsResult === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        medicalLimitationsResult: "PASS",
                      })
                    }
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      formData.medicalLimitationsResult === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        medicalLimitationsResult: "FAIL",
                      })
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Work Rights */}
              {/* Work Rights */}
              <div className="BarrierRow">
                <label>Work Rights *</label>

                {/* Candidate Answer */}
                <span
                  className={
                    formData.workRightsCandidateForm === "Yes"
                      ? "CandidateAnswerYes"
                      : "CandidateAnswerNo"
                  }
                >
                  {formData.workRightsCandidateForm}
                </span>

                {/* HR Decision */}
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      formData.workRightsResult === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        workRightsResult: "PASS",
                      })
                    }
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      formData.workRightsResult === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        workRightsResult: "FAIL",
                      })
                    }
                  >
                    Reject
                  </button>
                </div>
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

                  {formData.securityLicenceDocument ? (
                    <a
                      href={formData.securityLicenceDocument}
                      target="_blank"
                      rel="noreferrer"
                      className="UploadedDocument"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="NoDocument"></span>
                  )}

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
                    onClick={() =>
                      setFormData({
                        ...formData,
                        securityLicenceResult: "PASS",
                      })
                    }
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      formData.securityLicenceResult === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        securityLicenceResult: "FAIL",
                      })
                    }
                  >
                    Reject
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

                  {formData.drivingLicenceDocument ? (
                    <a
                      href={formData.drivingLicenceDocument}
                      target="_blank"
                      rel="noreferrer"
                      className="UploadedDocument"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="NoDocument"></span>
                  )}

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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          drivingLicenceResult: "PASS",
                        })
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        formData.drivingLicenceResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          drivingLicenceResult: "FAIL",
                        })
                      }
                    >
                      Reject
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
                  {formData.firstAidDocument ? (
                    <a
                      href={formData.firstAidDocument}
                      target="_blank"
                      rel="noreferrer"
                      className="UploadedDocument"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="NoDocument"></span>
                  )}

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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          firstAidResult: "PASS",
                        })
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        formData.firstAidResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          firstAidResult: "FAIL",
                        })
                      }
                    >
                      Reject
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
                  {formData.cprDocument ? (
                    <a
                      href={formData.cprDocument}
                      target="_blank"
                      rel="noreferrer"
                      className="UploadedDocument"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="NoDocument"></span>
                  )}

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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          cprResult: "PASS",
                        })
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        formData.cprResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          cprResult: "FAIL",
                        })
                      }
                    >
                      Reject
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

                  {formData.workingWithChildrenDocument ? (
                    <a
                      href={formData.workingWithChildrenDocument}
                      target="_blank"
                      rel="noreferrer"
                      className="UploadedDocument"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="NoDocument"></span>
                  )}
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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          workingWithChildrenResult: "PASS",
                        })
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        formData.workingWithChildrenResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          workingWithChildrenResult: "FAIL",
                        })
                      }
                    >
                      Reject
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

                  {formData.trafficManagementDocument ? (
                    <a
                      href={formData.trafficManagementDocument}
                      target="_blank"
                      rel="noreferrer"
                      className="UploadedDocument"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="NoDocument"></span>
                  )}

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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          trafficManagementResult: "PASS",
                        })
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        formData.trafficManagementResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          trafficManagementResult: "FAIL",
                        })
                      }
                    >
                      Reject
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

                  {formData.whiteCardDocument ? (
                    <a
                      href={formData.whiteCardDocument}
                      target="_blank"
                      rel="noreferrer"
                      className="UploadedDocument"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="NoDocument"></span>
                  )}

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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          whiteCardResult: "PASS",
                        })
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        formData.whiteCardResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          whiteCardResult: "FAIL",
                        })
                      }
                    >
                      Reject
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

                  {formData.yellowCardDocument ? (
                    <a
                      href={formData.yellowCardDocument}
                      target="_blank"
                      rel="noreferrer"
                      className="UploadedDocument"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="NoDocument"></span>
                  )}

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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          yellowCardResult: "PASS",
                        })
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        formData.yellowCardResult === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          yellowCardResult: "FAIL",
                        })
                      }
                    >
                      Reject
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
                      Accept
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
                      Reject
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
            </>
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
