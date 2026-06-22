import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import "./index.css";
function Candidateform2() {
  const [formData, setFormData] = useState({
    offerStatus: "",

    bankName: "",
    bankAccount: "",
    bsb: "",
    taxFileNumber: "",

    superFundName: "",
    superMemberNumber: "",

    longServiceLeaveId: "",

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
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/case/${id}`,
      );

      setFormData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/case/${id}`,
        {
          ...formData,
          status: "Interview",
        },
      );

      alert("Candidate Form 2 Submitted Successfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="OfferContainer">
      <div className="OfferRow">
        <div className="OfferField">
          <label>Name</label>
          <input value={formData.requesterName || ""} readOnly />
        </div>

        <div className="OfferField">
          <label>Case ID</label>
          <input value={formData.caseId || ""} readOnly />
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
                  formData.offerStatus === "Accept"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    offerStatus: "Accept",
                  })
                }
              >
                Accept
              </button>
              <button
                type="button"
                className={
                  formData.offerStatus === "Reject" ? "ToggleFail" : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    offerStatus: "Reject",
                  })
                }
              >
                Reject
              </button>
            </div>
          </div>

          <div className="OfferField">
            <label>Offer Letter *</label>
            <input type="file" />
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
              name="longServiceLeaveId"
              value={formData.longServiceLeaveId || ""}
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

            <div className="ToggleGroup">
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
            </div>
          </div>

          <div className="OfferField">
            <label>Document *</label>
            <input type="file" />
          </div>
        </div>

        <div className="OfferRow">
          <div className="OfferField">
            <label>Contract *</label>

            <div className="ToggleGroup">
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
            </div>
          </div>

          <div className="OfferField">
            <label>Document *</label>
            <input type="file" />
          </div>
        </div>

        <div className="OfferRow">
          <div className="OfferField">
            <label>Handbook WHS *</label>

            <div className="ToggleGroup">
              <button
                type="button"
                className={
                  formData.handbookWhs === "Pass" ? "ToggleActive" : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    handbookWhs: "Pass",
                  })
                }
              >
                Pass
              </button>

              <button
                type="button"
                className={
                  formData.handbookWhs === "Fail" ? "ToggleFail" : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    handbookWhs: "Fail",
                  })
                }
              >
                Fail
              </button>
            </div>
          </div>

          <div className="OfferField">
            <label>Document *</label>
            <input type="file" />
          </div>
        </div>

        <div className="OfferRow">
          <div className="OfferField">
            <label>Handbook Employment *</label>

            <div className="ToggleGroup">
              <button
                type="button"
                className={
                  formData.handbookEmployment === "Pass"
                    ? "ToggleActive"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    handbookEmployment: "Pass",
                  })
                }
              >
                Pass
              </button>

              <button
                type="button"
                className={
                  formData.handbookEmployment === "Fail"
                    ? "ToggleFail"
                    : "ToggleBtn"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    handbookEmployment: "Fail",
                  })
                }
              >
                Fail
              </button>
            </div>
          </div>

          <div className="OfferField">
            <label>Document *</label>
            <input type="file" />
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
  );
}

export default Candidateform2;
