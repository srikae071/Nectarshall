import { useState } from "react";
import HrmsLeftLayout from "../../../Hrmsleftlayout";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "./index.css";

function OnBoardingPreJoiningSaves() {
  const [formData, setFormData] = useState({
    bankAccount: "",
    bankName: "",
    bsb: "",
    confidentialityAgreement: "",
    contract: "",
    handbookEmployment: "",
    handbookWhs: "",
    longServiceLeaveId: "",
    superFundName: "",
    taxFileNumber: "",
    superMemberNumber: "",
  });
  const { id } = useParams();
  useEffect(() => {
    fetchRequest();
  }, []);

  const fetchRequest = async () => {
    try {
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
      );
      console.log(response.data);

      setFormData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        {
          ...formData,

          status: "Resolved",
        },
      );

      alert("Saved Successfully");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <HrmsLeftLayout>
      <div className="OfferContainer">
        <h2 className="OfferTitle">Pre Joining Compliance</h2>

        {/* Basic Details */}
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

        <div className="OfferRow">
          <div className="OfferField">
            <label>Department</label>
            <input value={formData.department || ""} readOnly />
          </div>

          <div className="OfferField">
            <label>Status</label>
            <input value={formData.status || ""} readOnly />
          </div>
        </div>

        {/* OFFER */}

        {/* OFFER */}

        {/* FINANCIALS */}

        <div className="SectionBlock">
          <h3>Financials</h3>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Bank Name *</label>
              <input
                type="text"
                value={formData.bankName}
                // onChange={(e) => setBankName(e.target.value)}
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
                value={formData.bankAccount}
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
              <input type="text" value={formData.bsb} onChange={handleChange} />
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
                value={formData.taxFileNumber}
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
                value={formData.superFundName}
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
                value={formData.superMemberNumber}
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
                value={formData.longServiceLeaveId}
                onChange={handleChange}
              />
            </div>
            <div className="OfferField">
              <label>Document *</label>
              <input type="file" />
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
                  Accept
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
                  Reject
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
                  Accept
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
                  Reject
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
                    formData.handbookWhs === "Pass"
                      ? "ToggleActive"
                      : "ToggleBtn"
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      handbookWhs: "Pass",
                    })
                  }
                >
                  Accept
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
                  Reject
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
                  Accept
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
                  Reject
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
    </HrmsLeftLayout>
  );
}

export default OnBoardingPreJoiningSaves;
