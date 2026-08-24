import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchApiData, sendApiData } from "../../../utils/apiClient";
import Hrmsleftlayout from "../../Hrms/Hrmsleftlayout";
import axios from "axios";
import "../../../styles/SharedFormStyle.css";

function EmployeRequestSave() {
  const navigate = useNavigate();
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
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
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
        firstName: firstCand?.firstName || prev.firstName,
        lastName: firstCand?.lastName || prev.lastName,
        contactNumber: firstCand?.contactNumber || prev.contactNumber,
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

  const handleCandDecision = (field, val) => {
    setFormData((prev) => {
      const list =
        Array.isArray(prev.candidates) && prev.candidates.length > 0
          ? [...prev.candidates]
          : [{ candidateId: "CND-001" }];

      list[activeCandTabIdx] = {
        ...list[activeCandTabIdx],
        [field]: val,
      };

      return {
        ...prev,
        candidates: list,
        [field]: val,
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
      const updatedForm = { ...formData, form1EmailSent: true, emailSent: true };
      await sendApiData(`/api/jobrequests/${id}`, updatedForm, "put");
      setFormData(updatedForm);

      const res = await sendApiData(
        `/api/jobrequests/send-email/${formData.caseId}`,
        {}
      );

      const msg = res?.data?.message || "Emails Sent Successfully to Candidate(s)";
      alert(msg);
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Error sending candidate emails");
    }
  };

  const handleSendCandidateForm2Email = async () => {
    try {
      const updatedForm = { ...formData, form2EmailSent: true };
      await sendApiData(`/api/jobrequests/${id}`, updatedForm, "put");
      setFormData(updatedForm);

      await sendApiData(
        `/api/jobrequests/send-candidate-form2/${formData.caseId}`,
        {}
      );
      alert(`Candidate Form 2 Email Sent Successfully to ${currentCand.email || "candidates"}`);
    } catch (err) {
      console.log(err);
      alert("Error sending Candidate Form 2 Email");
    }
  };

  const handleFinalSave = async () => {
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

      alert("Request Updated Successfully");
    } catch (error) {
      console.log(error);
      alert("Error saving request");
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

  const checkIsSubmitted = (cand) => {
    if (!cand || typeof cand !== "object") return false;

    if (cand.submitted === true) return true;

    const hasCandidateFormResponses = Boolean(
      cand.securityLicenceCandidateForm ||
      cand.modernSlaveryCandidateForm ||
      cand.legalBarrierCandidateForm ||
      cand.medicalLimitationsCandidateForm ||
      cand.workRightsCandidateForm ||
      cand.drivingLicenceCandidateForm ||
      cand.firstAidCandidateForm ||
      cand.cprCandidateForm ||
      cand.workingWithChildrenCandidateForm ||
      cand.trafficManagementCandidateForm ||
      cand.whiteCardCandidateForm ||
      cand.yellowCardCandidateForm ||
      cand.bankName ||
      cand.bankAccount ||
      cand.taxFileNumber
    );

    return hasCandidateFormResponses;
  };

  const currentCand = candidateList[activeCandTabIdx] || candidateList[0];
  const isCurrentCandSubmitted = checkIsSubmitted(currentCand);

  const currentStatus = formData.status || "Open";
  const normStatus = currentStatus.toLowerCase().replace(/[\s\-_]/g, "");

  const showReferencesSection = ["interview", "offerletter", "prejoiningcompliance", "resolved"].includes(normStatus);
  const showOfferLetterSection = ["offerletter", "prejoiningcompliance", "resolved"].includes(normStatus);
  const showFinancialSection = ["prejoiningcompliance", "resolved"].includes(normStatus);

  const handleSubmit = async () => {
    let currentSt = formData.status || "Open";
    let nextSt = currentSt;

    const allCandSubmitted = Array.isArray(formData.candidates) && formData.candidates.length > 0
      ? formData.candidates.every(c => checkIsSubmitted(c))
      : checkIsSubmitted(currentCand);

    if (normStatus === "open" || normStatus === "workinprogress" || !normStatus) {
      if (allCandSubmitted) {
        nextSt = "Interview";
      } else {
        nextSt = "Open";
      }
    } else if (normStatus === "interview") {
      if (formData.interview === "PASS") {
        nextSt = "Offer Letter";
      }
    } else if (normStatus === "offerletter") {
      const res = currentCand.offerLetterResult || formData.offerLetterResult;
      if (res === "ACCEPT" || res === "PASS") {
        nextSt = "Pre Joining Compliance";
      } else if (res === "REJECT" || res === "FAIL") {
        nextSt = "Closed";
        alert("Candidate has declined the offer letter.");
      } else {
        alert("Candidate Offer Letter response is still PENDING. Waiting for candidate to Accept or Decline via Candidate Form 2 email.");
        return;
      }
    } else if (normStatus === "prejoiningcompliance") {
      nextSt = "Resolved";
    }

    try {
      const updatedForm = { ...formData, status: nextSt };
      await sendApiData(`/api/jobrequests/${id}`, updatedForm, "put");
      setFormData(updatedForm);

      const nextNorm = nextSt.toLowerCase().replace(/[\s\-_]/g, "");
      const currNorm = currentSt.toLowerCase().replace(/[\s\-_]/g, "");

      if (nextNorm === "interview" && currNorm !== "interview") {
        alert("Status changed to Interview! Located under HRMS Onboarding -> Interview.");
        navigate("/onboarding/Interview");
      } else if (nextNorm === "offerletter" && currNorm !== "offerletter") {
        alert("Status changed to Offer Letter! Located under HRMS Onboarding -> Offer Letter.");
        navigate("/onboarding/Offerletter/");
      } else if (nextNorm === "prejoiningcompliance" && currNorm !== "prejoiningcompliance") {
        alert("Status changed to Pre-Joining Compliance! Candidate Form 2 Email Sent.");
        navigate("/onboarding/prejoining");
      } else if (nextNorm === "resolved") {
        alert("Status changed to Resolved!");
        navigate("/onboardingresolved");
      } else {
        if (!allCandSubmitted && (normStatus === "open" || normStatus === "workinprogress")) {
          alert("Data submitted successfully! Case remains in Open / All until all candidates submit Step 1 (Barriers of Employment).");
        } else {
          alert("Submitted & Updated Successfully.");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Error submitting request");
    }
  };

  return (
    <Hrmsleftlayout>
      <div className="lr-page">
        <div className="lr-card">
          <div className="section-header">EMPLOYEE DETAILS</div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>1. Preliminary Information</h2>
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
              + Add Candidate
            </button>
          </div>

          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Case Id *</label>
              <input className="lr-input" name="caseId" value={formData.caseId || ""} readOnly />
            </div>
            <div className="lr-field">
              <label className="lr-label">Requester Name</label>
              <input className="lr-input" value={formData.requesterName || ""} readOnly />
            </div>
          </div>

          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Department</label>
              <input
                className="lr-input"
                name="department"
                value={formData.department || ""}
                readOnly
                type="text"
                autoComplete="off"
              />
            </div>
            <div className="lr-field">
              <label className="lr-label">SkillSet</label>
              <input
                className="lr-input"
                name="skillSet"
                value={formData.skillSet || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Urgency</label>
              <input
                className="lr-input"
                name="urgency"
                value={formData.urgency || ""}
                onChange={handleChange}
              />
            </div>
            <div className="lr-field">
              <label className="lr-label">Status *</label>
              <select
                name="status"
                value={
                  normStatus === "prejoiningcompliance" || normStatus === "prejoining"
                    ? "Pre Joining Compliance"
                    : normStatus === "offerletter"
                    ? "Offer Letter"
                    : normStatus === "workinprogress"
                    ? "Work In Progress"
                    : normStatus === "interview"
                    ? "Interview"
                    : normStatus === "resolved"
                    ? "Resolved"
                    : normStatus === "closed"
                    ? "Closed"
                    : formData.status || "Open"
                }
                onChange={handleChange}
                className="EmployeeSaveStatusDropdown lr-input"
              >
                <option value="Open">Open</option>
                <option value="Work In Progress">Work In Progress</option>
                <option value="Interview">Interview</option>
                <option value="Offer Letter">Offer Letter</option>
                <option value="Pre Joining Compliance">Pre Joining Compliance</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC CANDIDATE ENTRIES - VISIBLE ONLY WHEN + Add Candidate IS CLICKED */}
          {showCandidatesList && formData.candidates && formData.candidates.length > 0 && (
            <div style={{ marginTop: "18px", marginBottom: "18px", borderTop: "1px dashed #cbd5e1", paddingTop: "14px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                Candidate List
              </h4>

              {formData.candidates.map((cand, candIdx) => (
                <div
                  key={candIdx}
                  style={{
                    background: "#f8fafc",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    marginBottom: "12px",
                    display: "grid",
                    gridTemplateColumns: "130px 1fr 1fr 1fr 1fr 120px 44px",
                    gap: "12px",
                    alignItems: "flex-end",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label className="lr-label" style={{ fontSize: "12px", fontWeight: "700", color: "#334155", whiteSpace: "nowrap" }}>Candidate ID</label>
                    <input
                      value={cand.candidateId || `CND-${String(candIdx + 1).padStart(3, "0")}`}
                      readOnly
                      style={{
                        height: "38px",
                        padding: "0 10px",
                        background: "#e2e8f0",
                        fontWeight: "700",
                        color: "#0f172a",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label className="lr-label" style={{ fontSize: "12px", fontWeight: "700", color: "#334155", whiteSpace: "nowrap" }}>Candidate First Name *</label>
                    <input
                      value={cand.firstName || cand.name || ""}
                      onChange={(e) => handleCandidateChange(candIdx, "firstName", e.target.value)}
                      placeholder="First name..."
                      style={{
                        height: "38px",
                        padding: "0 12px",
                        background: "#ffffff",
                        color: "#0f172a",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label className="lr-label" style={{ fontSize: "12px", fontWeight: "700", color: "#334155", whiteSpace: "nowrap" }}>Candidate Last Name *</label>
                    <input
                      value={cand.lastName || ""}
                      onChange={(e) => handleCandidateChange(candIdx, "lastName", e.target.value)}
                      placeholder="Last name..."
                      style={{
                        height: "38px",
                        padding: "0 12px",
                        background: "#ffffff",
                        color: "#0f172a",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label className="lr-label" style={{ fontSize: "12px", fontWeight: "700", color: "#334155", whiteSpace: "nowrap" }}>Candidate Email ID *</label>
                    <input
                      type="email"
                      value={cand.email || ""}
                      onChange={(e) => handleCandidateChange(candIdx, "email", e.target.value)}
                      placeholder="Email ID..."
                      style={{
                        height: "38px",
                        padding: "0 12px",
                        background: "#ffffff",
                        color: "#0f172a",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label className="lr-label" style={{ fontSize: "12px", fontWeight: "700", color: "#334155", whiteSpace: "nowrap" }}>Contact Number *</label>
                    <input
                      type="text"
                      value={cand.contactNumber || cand.phone || ""}
                      onChange={(e) => handleCandidateChange(candIdx, "contactNumber", e.target.value)}
                      placeholder="Contact number..."
                      style={{
                        height: "38px",
                        padding: "0 12px",
                        background: "#ffffff",
                        color: "#0f172a",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label className="lr-label" style={{ fontSize: "12px", fontWeight: "700", color: "#334155", whiteSpace: "nowrap" }}>Status</label>
                    <span
                      style={{
                        height: "38px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "700",
                        background: checkIsSubmitted(cand) ? "#dcfce7" : "#fee2e2",
                        color: checkIsSubmitted(cand) ? "#15803d" : "#dc2626",
                        border: checkIsSubmitted(cand) ? "1px solid #bbf7d0" : "1px solid #fecaca",
                        whiteSpace: "nowrap",
                        boxSizing: "border-box",
                      }}
                    >
                      {checkIsSubmitted(cand) ? "Submitted" : "Not Submitted"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCandidate(candIdx)}
                    title="Remove Candidate"
                    style={{
                      height: "38px",
                      width: "44px",
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: "6px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                      boxSizing: "border-box",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="EmployeeSaveNotesContainer">
            <label className="lr-label">Short Description</label>

            <textarea
              name="shortDescription"
              value={formData.shortDescription || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                height: "45px",
                minHeight: "45px",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
              placeholder="Enter short description..."
            />
          </div>

          <div className="EmployeeSaveNotesContainer">
            <label className="lr-label">Description</label>

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                height: "130px",
                minHeight: "130px",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
              placeholder="Enter detailed description..."
            />
          </div>

          {/* <button className="CreateBtn" onClick={handlePreliminarySave}>
            Save & Continue
          </button> */}
          {normStatus !== "resolved" && (
            <div className="lr-actions">
              {!formData.form1EmailSent && !formData.emailSent && (
                <button type="button" className="lr-btn-cancel" onClick={handleSendEmail}>
                  Send Email
                </button>
              )}
              <button type="button" className="lr-btn-cancel" onClick={() => setFormData({})}>
                Cancel
              </button>

              <button type="button" className="lr-btn-submit btn-primary-dark" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
        </div>

        {showFullForm && (
          <>
            {/* CANDIDATE SELECTOR TABS BAR */}
            {candidateList.length > 0 && (
              <div className="lr-card" style={{ marginTop: "24px" }}>
                <div className="section-header">CANDIDATE ONBOARDING FORMS</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                  Candidate Onboarding Forms ({candidateList.length}):
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {candidateList.map((cand, idx) => {
                    const isSelected = activeCandTabIdx === idx;
                    const isSubmitted = checkIsSubmitted(cand);
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
                        <span>{cand.candidateId || `CND-${String(idx + 1).padStart(3, "0")}`}</span>
                        <span>({`${cand.firstName || ""} ${cand.lastName || ""}`.trim() || cand.name || "Candidate"})</span>
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
                          {isSubmitted ? "Submitted" : "Not Submitted"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!isCurrentCandSubmitted ? (
              <div
                className="lr-card"
                style={{
                  marginTop: "24px",
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                  borderRadius: "8px",
                  padding: "24px 28px",
                  color: "#d48806",
                  fontWeight: "700",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px" }}>
                    Candidate still did not submit the data.
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#8c6b00", fontWeight: "500" }}>
                    Candidate <strong>{currentCand.candidateId || `CND-${String(activeCandTabIdx + 1).padStart(3, "0")}`} ({`${currentCand.firstName || ""} ${currentCand.lastName || ""}`.trim() || currentCand.name || "Candidate"})</strong> has not submitted their onboarding form response yet.
                  </div>
                </div>
              </div>
            ) : (
              <>
            <div className="lr-card" style={{ marginTop: "24px" }}>
              <div className="section-header">BARRIERS TO EMPLOYMENT & QUALIFICATIONS</div>
              <h3 className="lr-section-title">2. Barriers To Employment (Self Declaration) - {currentCand.candidateId || "CND-001"} ({`${currentCand.firstName || ""} ${currentCand.lastName || ""}`.trim() || currentCand.name || "Candidate"})</h3>

              {/* Modern Slavery */}
              <div className="BarrierRow">
                <label className="lr-label">Modern Slavery *</label>

                {/* Candidate Answer */}
                <span
                  className={
                    (currentCand.modernSlaveryCandidateForm || formData.modernSlaveryCandidateForm) === "YES" ||
                    (currentCand.modernSlaveryCandidateForm || formData.modernSlaveryCandidateForm) === "Yes"
                      ? "CandidateAnswerYes"
                      : "CandidateAnswerNo"
                  }
                >
                  {currentCand.modernSlaveryCandidateForm || formData.modernSlaveryCandidateForm || "N/A"}
                </span>

                {/* HR Decision */}
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      (currentCand.modernSlaveryResult || formData.modernSlaveryResult) === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("modernSlaveryResult", "PASS")}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      (currentCand.modernSlaveryResult || formData.modernSlaveryResult) === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("modernSlaveryResult", "FAIL")}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Legal Barrier */}
              <div className="BarrierRow">
                <label className="lr-label">Legal Barrier *</label>

                {/* Candidate Answer */}
                <span
                  className={
                    (currentCand.legalBarrierCandidateForm || formData.legalBarrierCandidateForm) === "YES" ||
                    (currentCand.legalBarrierCandidateForm || formData.legalBarrierCandidateForm) === "Yes"
                      ? "CandidateAnswerYes"
                      : "CandidateAnswerNo"
                  }
                >
                  {currentCand.legalBarrierCandidateForm || formData.legalBarrierCandidateForm || "N/A"}
                </span>

                {/* HR Decision */}
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      (currentCand.legalBarrierResult || formData.legalBarrierResult) === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("legalBarrierResult", "PASS")}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      (currentCand.legalBarrierResult || formData.legalBarrierResult) === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("legalBarrierResult", "FAIL")}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Medical Limitations */}
              <div className="BarrierRow">
                <label className="lr-label">Medical Limitations *</label>

                {/* Candidate Answer */}
                <span
                  className={
                    (currentCand.medicalLimitationsCandidateForm || formData.medicalLimitationsCandidateForm) === "YES" ||
                    (currentCand.medicalLimitationsCandidateForm || formData.medicalLimitationsCandidateForm) === "Yes"
                      ? "CandidateAnswerYes"
                      : "CandidateAnswerNo"
                  }
                >
                  {currentCand.medicalLimitationsCandidateForm || formData.medicalLimitationsCandidateForm || "N/A"}
                </span>

                {/* HR Decision */}
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      (currentCand.medicalLimitationsResult || formData.medicalLimitationsResult) === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("medicalLimitationsResult", "PASS")}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      (currentCand.medicalLimitationsResult || formData.medicalLimitationsResult) === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("medicalLimitationsResult", "FAIL")}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Work Rights */}
              <div className="BarrierRow">
                <label className="lr-label">Work Rights *</label>

                {/* Candidate Answer */}
                <span
                  className={
                    (currentCand.workRightsCandidateForm || formData.workRightsCandidateForm) === "YES" ||
                    (currentCand.workRightsCandidateForm || formData.workRightsCandidateForm) === "Yes"
                      ? "CandidateAnswerYes"
                      : "CandidateAnswerNo"
                  }
                >
                  {currentCand.workRightsCandidateForm || formData.workRightsCandidateForm || "N/A"}
                </span>

                {/* HR Decision */}
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      (currentCand.workRightsResult || formData.workRightsResult) === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("workRightsResult", "PASS")}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      (currentCand.workRightsResult || formData.workRightsResult) === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("workRightsResult", "FAIL")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>            
            <div className="lr-card" style={{ marginTop: "24px" }}>
              <div className="section-header">QUALIFICATIONS & LICENCES</div>
              <h3 className="lr-section-title">3. Qualifications & Licences - {currentCand.candidateId || "CND-001"} ({`${currentCand.firstName || ""} ${currentCand.lastName || ""}`.trim() || currentCand.name || "Candidate"})</h3>

              {/* Security Licence */}
              <div className="QualificationCard">
                <h4>Security Licence</h4>

                <div className="QualificationRow">
                  <input
                    type="text"
                    placeholder="Licence Number"
                    name="securityLicence"
                    value={currentCand.securityLicenceCandidateForm || currentCand.securityLicence || formData.securityLicence || ""}
                    onChange={(e) => handleCandDecision("securityLicence", e.target.value)}
                  />

                  {currentCand.securityLicenceDocument || formData.securityLicenceDocument ? (
                    <a
                      href={currentCand.securityLicenceDocument || formData.securityLicenceDocument}
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
                    value={currentCand.securityLicenceExpiry ? currentCand.securityLicenceExpiry.split("T")[0] : (formData.securityLicenceExpiry ? formData.securityLicenceExpiry.split("T")[0] : "")}
                    onChange={(e) => handleCandDecision("securityLicenceExpiry", e.target.value)}
                  />
                </div>
                <div className="ToggleGroup">
                  <button
                    type="button"
                    className={
                      (currentCand.securityLicenceResult || formData.securityLicenceResult) === "PASS"
                        ? "ToggleActive"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("securityLicenceResult", "PASS")}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={
                      (currentCand.securityLicenceResult || formData.securityLicenceResult) === "FAIL"
                        ? "ToggleFail"
                        : "ToggleBtn"
                    }
                    onClick={() => handleCandDecision("securityLicenceResult", "FAIL")}
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
                    value={currentCand.drivingLicenceCandidateForm || currentCand.drivingLicence || formData.drivingLicence || ""}
                    onChange={(e) => handleCandDecision("drivingLicence", e.target.value)}
                  />

                  {currentCand.drivingLicenceDocument || formData.drivingLicenceDocument ? (
                    <a
                      href={currentCand.drivingLicenceDocument || formData.drivingLicenceDocument}
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
                    value={currentCand.drivingLicenceExpiry ? currentCand.drivingLicenceExpiry.split("T")[0] : (formData.drivingLicenceExpiry ? formData.drivingLicenceExpiry.split("T")[0] : "")}
                    onChange={(e) => handleCandDecision("drivingLicenceExpiry", e.target.value)}
                  />
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        (currentCand.drivingLicenceResult || formData.drivingLicenceResult) === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("drivingLicenceResult", "PASS")}
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        (currentCand.drivingLicenceResult || formData.drivingLicenceResult) === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("drivingLicenceResult", "FAIL")}
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
                    value={currentCand.firstAidCandidateForm || currentCand.firstAid || formData.firstAid || ""}
                    onChange={(e) => handleCandDecision("firstAid", e.target.value)}
                  />
                  {currentCand.firstAidDocument || formData.firstAidDocument ? (
                    <a
                      href={currentCand.firstAidDocument || formData.firstAidDocument}
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
                    value={currentCand.firstAidExpiry ? currentCand.firstAidExpiry.split("T")[0] : (formData.firstAidExpiry ? formData.firstAidExpiry.split("T")[0] : "")}
                    onChange={(e) => handleCandDecision("firstAidExpiry", e.target.value)}
                  />
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        (currentCand.firstAidResult || formData.firstAidResult) === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("firstAidResult", "PASS")}
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        (currentCand.firstAidResult || formData.firstAidResult) === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("firstAidResult", "FAIL")}
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
                    value={currentCand.cprCandidateForm || currentCand.cpr || formData.cpr || ""}
                    onChange={(e) => handleCandDecision("cpr", e.target.value)}
                  />
                  {currentCand.cprDocument || formData.cprDocument ? (
                    <a
                      href={currentCand.cprDocument || formData.cprDocument}
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
                    value={currentCand.cprExpiry ? currentCand.cprExpiry.split("T")[0] : (formData.cprExpiry ? formData.cprExpiry.split("T")[0] : "")}
                    onChange={(e) => handleCandDecision("cprExpiry", e.target.value)}
                  />
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        (currentCand.cprResult || formData.cprResult) === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("cprResult", "PASS")}
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        (currentCand.cprResult || formData.cprResult) === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("cprResult", "FAIL")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>

              {/* Working With Children */}
              <div className="QualificationCard">
                <h4>Working With Children</h4>

                <div className="QualificationRow">
                  <input
                    type="text"
                    placeholder="Check Number"
                    name="workingWithChildren"
                    value={currentCand.workingWithChildrenCandidateForm || currentCand.workingWithChildren || formData.workingWithChildren || ""}
                    onChange={(e) => handleCandDecision("workingWithChildren", e.target.value)}
                  />
                  {currentCand.workingWithChildrenDocument || formData.workingWithChildrenDocument ? (
                    <a
                      href={currentCand.workingWithChildrenDocument || formData.workingWithChildrenDocument}
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
                    value={currentCand.workingWithChildrenExpiry ? currentCand.workingWithChildrenExpiry.split("T")[0] : (formData.workingWithChildrenExpiry ? formData.workingWithChildrenExpiry.split("T")[0] : "")}
                    onChange={(e) => handleCandDecision("workingWithChildrenExpiry", e.target.value)}
                  />
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        (currentCand.workingWithChildrenResult || formData.workingWithChildrenResult) === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("workingWithChildrenResult", "PASS")}
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        (currentCand.workingWithChildrenResult || formData.workingWithChildrenResult) === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("workingWithChildrenResult", "FAIL")}
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
                    placeholder="Ticket Number"
                    name="trafficManagement"
                    value={currentCand.trafficManagementCandidateForm || currentCand.trafficManagement || formData.trafficManagement || ""}
                    onChange={(e) => handleCandDecision("trafficManagement", e.target.value)}
                  />
                  {currentCand.trafficManagementDocument || formData.trafficManagementDocument ? (
                    <a
                      href={currentCand.trafficManagementDocument || formData.trafficManagementDocument}
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
                    value={currentCand.trafficManagementExpiry ? currentCand.trafficManagementExpiry.split("T")[0] : (formData.trafficManagementExpiry ? formData.trafficManagementExpiry.split("T")[0] : "")}
                    onChange={(e) => handleCandDecision("trafficManagementExpiry", e.target.value)}
                  />
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        (currentCand.trafficManagementResult || formData.trafficManagementResult) === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("trafficManagementResult", "PASS")}
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        (currentCand.trafficManagementResult || formData.trafficManagementResult) === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("trafficManagementResult", "FAIL")}
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
                    value={currentCand.whiteCardCandidateForm || currentCand.whiteCard || formData.whiteCard || ""}
                    onChange={(e) => handleCandDecision("whiteCard", e.target.value)}
                  />

                  {currentCand.whiteCardDocument || formData.whiteCardDocument ? (
                    <a
                      href={currentCand.whiteCardDocument || formData.whiteCardDocument}
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
                    value={currentCand.whiteCardExpiry ? currentCand.whiteCardExpiry.split("T")[0] : (formData.whiteCardExpiry ? formData.whiteCardExpiry.split("T")[0] : "")}
                    onChange={(e) => handleCandDecision("whiteCardExpiry", e.target.value)}
                  />
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        (currentCand.whiteCardResult || formData.whiteCardResult) === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("whiteCardResult", "PASS")}
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        (currentCand.whiteCardResult || formData.whiteCardResult) === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("whiteCardResult", "FAIL")}
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
                    value={currentCand.yellowCardCandidateForm || currentCand.yellowCard || formData.yellowCard || ""}
                    onChange={(e) => handleCandDecision("yellowCard", e.target.value)}
                  />

                  {currentCand.yellowCardDocument || formData.yellowCardDocument ? (
                    <a
                      href={currentCand.yellowCardDocument || formData.yellowCardDocument}
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
                    value={currentCand.yellowCardExpiry ? currentCand.yellowCardExpiry.split("T")[0] : (formData.yellowCardExpiry ? formData.yellowCardExpiry.split("T")[0] : "")}
                    onChange={(e) => handleCandDecision("yellowCardExpiry", e.target.value)}
                  />
                  <div className="ToggleGroup">
                    <button
                      type="button"
                      className={
                        (currentCand.yellowCardResult || formData.yellowCardResult) === "PASS"
                          ? "ToggleActive"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("yellowCardResult", "PASS")}
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className={
                        (currentCand.yellowCardResult || formData.yellowCardResult) === "FAIL"
                          ? "ToggleFail"
                          : "ToggleBtn"
                      }
                      onClick={() => handleCandDecision("yellowCardResult", "FAIL")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>

            </div>


            {showReferenceSection && (
              <div className="lr-card" style={{ marginTop: "24px" }}>
                <div className="section-header">REFERENCES & INTERVIEW</div>
                <h3 className="lr-section-title">4. References</h3>

                <div className="BarrierRow">
                  <label className="lr-label">Interview *</label>

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
              </div>
            )}

            {/* 5. OFFER LETTER SECTION */}
            {showOfferLetterSection && (
              <div className="lr-card" style={{ marginTop: "24px" }}>
                <div className="section-header">OFFER LETTER & ROLE TYPE</div>
                <h3 className="lr-section-title">5. Offer Letter <span style={{ fontSize: "11px", background: "#ef4444", color: "#ffffff", padding: "2px 8px", borderRadius: "10px", marginLeft: "8px" }}>MUST HAVE</span></h3>

                <div className="BarrierRow" style={{ marginBottom: "14px" }}>
                  <label className="lr-label" style={{ fontWeight: "700" }}>Letter of Offer *</label>

                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "800",
                      padding: "6px 16px",
                      borderRadius: "14px",
                      background:
                        (currentCand.offerLetterResult || formData.offerLetterResult) === "ACCEPT" ||
                        (currentCand.offerLetterResult || formData.offerLetterResult) === "PASS"
                          ? "#dcfce7"
                          : (currentCand.offerLetterResult || formData.offerLetterResult) === "REJECT" ||
                            (currentCand.offerLetterResult || formData.offerLetterResult) === "FAIL"
                          ? "#fee2e2"
                          : "#fef3c7",
                      color:
                        (currentCand.offerLetterResult || formData.offerLetterResult) === "ACCEPT" ||
                        (currentCand.offerLetterResult || formData.offerLetterResult) === "PASS"
                          ? "#15803d"
                          : (currentCand.offerLetterResult || formData.offerLetterResult) === "REJECT" ||
                            (currentCand.offerLetterResult || formData.offerLetterResult) === "FAIL"
                          ? "#b91c1c"
                          : "#b45309",
                    }}
                  >
                    {(currentCand.offerLetterResult || formData.offerLetterResult) === "ACCEPT" ||
                    (currentCand.offerLetterResult || formData.offerLetterResult) === "PASS"
                      ? "ACCEPTED"
                      : (currentCand.offerLetterResult || formData.offerLetterResult) === "REJECT" ||
                        (currentCand.offerLetterResult || formData.offerLetterResult) === "FAIL"
                      ? "DECLINED"
                      : "PENDING"}
                  </span>
                </div>

                <div className="OfferRow">
                  <div className="OfferField">
                    <label className="lr-label" style={{ fontWeight: "700" }}>Role Type *</label>
                    <select
                      value={currentCand.roleType || formData.roleType || "FT"}
                      onChange={(e) => handleCandDecision("roleType", e.target.value)}
                      style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                    >
                      <option value="FT">Full Time (FT)</option>
                      <option value="PT">Part Time (PT)</option>
                      <option value="CS">Casual (CS)</option>
                      <option value="Oth">Other (Oth)</option>
                    </select>
                  </div>
                </div>

                {!formData.form2EmailSent && (
                  <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px dashed #cbd5e1", display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={handleSendCandidateForm2Email}
                      style={{
                        background: "#0284c7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 18px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Send Candidate Form 2 Email ({currentCand.candidateId || "CND-001"})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 6. FINANCIAL & TAX INFORMATION */}
            {showFinancialSection && (
              <div className="lr-card" style={{ marginTop: "24px" }}>
                <div className="section-header">FINANCIAL & TAX INFORMATION</div>
                <h3 className="lr-section-title">6. Financial & Tax Information <span style={{ fontSize: "11px", background: "#ef4444", color: "#ffffff", padding: "2px 8px", borderRadius: "10px", marginLeft: "8px" }}>MUST HAVE</span></h3>

                <div className="lr-grid-2">
                  <div className="lr-field">
                    <label className="lr-label">Bank Name *</label>
                    <input
                      className="lr-input"
                      type="text"
                      placeholder="e.g. Commonwealth Bank / ANZ"
                      value={currentCand.bankName || formData.bankName || ""}
                      onChange={(e) => handleCandDecision("bankName", e.target.value)}
                    />
                  </div>
                  <div className="lr-field">
                    <label className="lr-label">Bank Account Name *</label>
                    <input
                      className="lr-input"
                      type="text"
                      placeholder="Account Holder Name"
                      value={currentCand.bankAccountName || formData.bankAccountName || ""}
                      onChange={(e) => handleCandDecision("bankAccountName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="lr-grid-2">
                  <div className="lr-field">
                    <label className="lr-label">BSB *</label>
                    <input
                      className="lr-input"
                      type="text"
                      placeholder="6-digit BSB (e.g. 063-000)"
                      value={currentCand.bsb || formData.bsb || ""}
                      onChange={(e) => handleCandDecision("bsb", e.target.value)}
                    />
                  </div>
                  <div className="lr-field">
                    <label className="lr-label">Account Number *</label>
                    <input
                      className="lr-input"
                      type="text"
                      placeholder="Account Number"
                      value={currentCand.accountNumber || formData.accountNumber || ""}
                      onChange={(e) => handleCandDecision("accountNumber", e.target.value)}
                    />
                  </div>
                </div>

                <div className="lr-grid-2">
                  <div className="lr-field">
                    <label className="lr-label">Tax File Number (TFN) *</label>
                    <input
                      className="lr-input"
                      type="text"
                      placeholder="9-digit TFN"
                      value={currentCand.tfn || formData.tfn || ""}
                      onChange={(e) => handleCandDecision("tfn", e.target.value)}
                    />
                  </div>
                  <div className="lr-field">
                    <label className="lr-label">Superannuation Fund Name *</label>
                    <input
                      className="lr-input"
                      type="text"
                      placeholder="Super Fund Name"
                      value={currentCand.superFund || formData.superFund || ""}
                      onChange={(e) => handleCandDecision("superFund", e.target.value)}
                    />
                  </div>
                </div>

                <div className="lr-grid-2">
                  <div className="lr-field">
                    <label className="lr-label">Super Member Number *</label>
                    <input
                      className="lr-input"
                      type="text"
                      placeholder="Member Number"
                      value={currentCand.superMemberNum || formData.superMemberNum || ""}
                      onChange={(e) => handleCandDecision("superMemberNum", e.target.value)}
                    />
                  </div>
                  <div className="lr-field">
                    <label className="lr-label">Long Service Leave ID (Optional)</label>
                    <input
                      className="lr-input"
                      type="text"
                      placeholder="LSL ID Number (Optional)"
                      value={currentCand.longServiceLeaveId || formData.longServiceLeaveId || ""}
                      onChange={(e) => handleCandDecision("longServiceLeaveId", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            </>
            )}
            {normStatus !== "resolved" && (
              <div className="lr-actions">
                <button
                  type="button"
                  className="lr-btn-cancel"
                  onClick={() => setFormData({})}
                >
                  Cancel
                </button>
                <button type="button" className="lr-btn-submit btn-primary-dark" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Hrmsleftlayout>
  );
}
export default EmployeRequestSave;
