import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchApiData, sendApiData } from "../../../../../utils/apiClient";
import { generateAndOpenSignedHandbookPdf } from "../../../../../utils/handbookPdfGenerator";
import CandiateFormNav from "../CandidateForm/CandiateFormNav";
import "./index.css";
function Candidateform2() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    offerStatus: "",

    bankName: "",
    bankAccount: "",
    bsb: "",
    taxFileNumber: "",

    superFundName: "",
    superMemberNumber: "",

    longServiceLeaveId: "",

    handbookSigned: false,
    handbookPrintName: "",
    handbookDate: new Date().toISOString().split("T")[0],
    handbookUrl: "/pdfs/employee-handbook.pdf.pdf",

    confidentialityAgreement: "",
    contract: "",
    handbookWhs: "",
    handbookEmployment: "",
  });
  const { id } = useParams();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchApiData(`/api/jobrequests/case/${id}`);
      if (response && response.data) {
        const d = response.data;
        setFormData({
          ...d,
          handbookPrintName: d.handbookPrintName || `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.requesterName || "",
          handbookDate: d.handbookDate ? d.handbookDate.split("T")[0] : new Date().toISOString().split("T")[0],
          handbookSigned: d.handbookSigned !== undefined ? d.handbookSigned : false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("CASE ID:", id);

      const payload = {
        ...formData,
        offerStatus: formData.offerStatus || "ACCEPT",
        offerLetterResult: formData.offerStatus || "ACCEPT",
        bankName: formData.bankName,
        bankAccount: formData.bankAccount,
        bankAccountName: formData.bankAccount,
        accountNumber: formData.bankAccount,
        bsb: formData.bsb,
        taxFileNumber: formData.taxFileNumber,
        tfn: formData.taxFileNumber,
        superFundName: formData.superFundName,
        superFund: formData.superFundName,
        superMemberNumber: formData.superMemberNumber,
        superMemberNum: formData.superMemberNumber,
        longServiceLeaveId: formData.longServiceLeaveId,
        handbookSigned: Boolean(formData.handbookSigned),
        handbookPrintName: formData.handbookPrintName || `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.requesterName || "",
        handbookDate: formData.handbookDate || new Date().toISOString().split("T")[0],
        handbookEmployment: formData.handbookSigned ? "Pass" : "",
        handbookUrl: "/pdfs/employee-handbook.pdf.pdf",
        candidateCompleted: true,
        status: "PreJoiningCompliance",
      };

      await sendApiData(`/api/jobrequests/case/${id}`, payload, "put");
      setSubmitted(true);
      alert("Candidate Form 2 Submitted Successfully");
    } catch (error) {
      console.log("ERROR:", error.response?.data);
      console.log(error);
      alert("Error submitting Candidate Form 2");
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
      <div className="OfferContainer">
        <div className="OfferRow">
          <div className="OfferField">
            <label>Case ID</label>
            <input value={formData.caseId || ""} readOnly />
          </div>

          <div className="OfferField">
            <label>Name</label>
            <input value={formData.requesterName || ""} readOnly />
          </div>
        </div>

        <div className="SectionBlock">
          <h3>Offer</h3>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Offer Status *</label>

              <div className="ToggleGroup">
                <button
                  type="button"
                  className={
                    formData.offerStatus === "ACCEPT" || formData.offerStatus === "Accept"
                      ? "ToggleActive"
                      : "ToggleBtn"
                  }
                  onClick={() => setFormData({ ...formData, offerStatus: "ACCEPT" })}
                >
                  Accept Offer
                </button>
                <button
                  type="button"
                  className={
                    formData.offerStatus === "REJECT" || formData.offerStatus === "Reject"
                      ? "ToggleFail"
                      : "ToggleBtn"
                  }
                  onClick={() => setFormData({ ...formData, offerStatus: "REJECT" })}
                >
                  Reject Offer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIALS */}

        <div className="SectionBlock">
          <h3>Financials</h3>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Bank Name *</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
            </div>
          </div>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Bank Account *</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount || ""}
                onChange={handleChange}
              />
            </div>

            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
            </div>
          </div>

          <div className="OfferRow">
            <div className="OfferField">
              <label>BSB *</label>
              <input
                type="text"
                name="bsb"
                value={formData.bsb || ""}
                onChange={handleChange}
              />
            </div>

            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
            </div>
          </div>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Tax File Number *</label>
              <input
                type="text"
                name="taxFileNumber"
                value={formData.taxFileNumber || ""}
                onChange={handleChange}
              />
            </div>

            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
            </div>
          </div>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Superannuation Fund Name *</label>
              <input
                type="text"
                name="superFundName"
                value={formData.superFundName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
            </div>
          </div>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Superannuation Member Number *</label>
              <input
                type="text"
                name="superMemberNumber"
                value={formData.superMemberNumber || ""}
                onChange={handleChange}
              />
            </div>

            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
            </div>
          </div>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Long Service Leave ID Number</label>
              <input
                type="text"
                name="longServiceLeaveId"
                value={formData.longServiceLeaveId || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* COMPLIANCE DOCUMENTS */}

        <div className="SectionBlock">
          <h3>Compliance Documents</h3>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Confidentiality Agreement *</label>

              {/* <div className="ToggleGroup">
              <button
                type="button"
                className={
                  formData.confidentialityAgreement === "Pass"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    confidentialityAgreement: "Pass",
                  })
                }
              >
                Pass
              </button>

              <button
                type="button"
                className={
                  formData.confidentialityAgreement === "Fail"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    confidentialityAgreement: "Fail",
                  })
                }
              >
                Fail
              </button>
            </div> */}
            </div>

            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
            </div>
          </div>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Contract *</label>

              {/* <div className="ToggleGroup">
              <button
                type="button"
                className={
                  formData.contract === "Pass" ? "ToggleActive" : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    contract: "Pass",
                  })
                }
              >
                Pass
              </button>

              <button
                type="button"
                className={
                  formData.contract === "Fail" ? "ToggleFail" : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    contract: "Fail",
                  })
                }
              >
                Fail
              </button>
            </div> */}
            </div>

            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
            </div>
          </div>

        </div>

        {/* EMPLOYEE HANDBOOK ACKNOWLEDGEMENT SECTION (34 Pages) */}
        <div className="SectionBlock" style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "20px 24px", marginTop: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>Employee Handbook (34 Pages)</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>Please review the Excell Security Employee Handbook V1.0 and complete the acknowledgement below.</p>
            </div>
            <button
              type="button"
              onClick={() => generateAndOpenSignedHandbookPdf({
                candidateName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.requesterName || "Candidate",
                printName: formData.handbookPrintName || `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.requesterName,
                dateOfAcknowledgement: formData.handbookDate || new Date().toISOString().split("T")[0],
                isSigned: formData.handbookSigned || false,
                action: "open"
              })}
              style={{
                background: "#0284c7",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              📄 Read / Preview Handbook (34 Pages PDF)
            </button>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "16px 20px", marginTop: "14px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "800", color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              ACKNOWLEDGEMENT (Page 34 of Handbook)
            </h4>
            <p style={{ fontStyle: "italic", fontSize: "13.5px", color: "#334155", margin: "0 0 16px 0", lineHeight: "1.5" }}>
              "I acknowledge that I received a copy of this Excell Security Employee Handbook V1.0 and that I have read and understood it."
            </p>

            <div style={{ marginBottom: "16px", background: "#f1f5f9", padding: "12px 16px", borderRadius: "6px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                <input
                  type="checkbox"
                  name="handbookSigned"
                  checked={Boolean(formData.handbookSigned)}
                  onChange={(e) => setFormData({ ...formData, handbookSigned: e.target.checked })}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span>Please Sign: I confirm and electronically sign my acknowledgement of the Employee Handbook.</span>
              </label>
            </div>

            <div className="OfferRow" style={{ marginTop: "10px" }}>
              <div className="OfferField">
                <label>Print Name *</label>
                <input
                  type="text"
                  name="handbookPrintName"
                  value={formData.handbookPrintName !== undefined ? formData.handbookPrintName : (`${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.requesterName || "")}
                  onChange={handleChange}
                  placeholder="Print your full name"
                />
              </div>

              <div className="OfferField">
                <label>Date of Acknowledgement *</label>
                <input
                  type="date"
                  name="handbookDate"
                  value={formData.handbookDate ? formData.handbookDate.split("T")[0] : new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="OfferFooter">
          <button className="CreateBtn">Save</button>
          <button className="CreateBtn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </>
  );
}

export default Candidateform2;
