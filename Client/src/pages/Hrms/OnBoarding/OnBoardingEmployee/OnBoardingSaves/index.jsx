import { useState } from "react";
import Hrmsleftlayout from "../../../../Hrmsleftlayout";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "./index.css";

function OnBoardingSaves() {
  const { id } = useParams();
  const [onboardingShortDescription, setOnboardingShortDescription] =
    useState("");

  const [onboardingDescription, setOnboardingDescription] = useState("");
  const [jobRequest, setJobRequest] = useState({});
  const [offerStatus, setOfferStatus] = useState("");
  const [confidentiality, setConfidentiality] = useState("");
  const [contract, setContract] = useState("");
  const [whs, setWhs] = useState("");
  const [employment, setEmployment] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bsb, setBsb] = useState("");
  const [taxFileNumber, setTaxFileNumber] = useState("");
  const [superFundName, setSuperFundName] = useState("");
  const [superMemberNumber, setSuperMemberNumber] = useState("");
  const [longServiceLeaveId, setLongServiceLeaveId] = useState("");
  useEffect(() => {
    fetchRequest();
  }, []);

  const fetchRequest = async () => {
    try {
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
      );
      console.log(response.data);

      setJobRequest(response.data);
      setOfferStatus(response.data.offerStatus || "");
      setConfidentiality(response.data.confidentialityAgreement || "");
      setContract(response.data.contract || "");
      setWhs(response.data.handbookWhs || "");
      setEmployment(response.data.handbookEmployment || "");
      setBankName(response.data.bankName || "");
      setBankAccount(response.data.bankAccount || "");
      setBsb(response.data.bsb || "");
      setTaxFileNumber(response.data.taxFileNumber || "");
      setSuperFundName(response.data.superFundName || "");
      setSuperMemberNumber(response.data.superMemberNumber || "");
      setLongServiceLeaveId(response.data.longServiceLeaveId || "");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        {
          offerStatus,
          bankName,
          bankAccount,
          bsb,
          taxFileNumber,
          superFundName,
          superMemberNumber,
          longServiceLeaveId,
          confidentiality,
          contract,
          whs,
          employment,

          status: jobRequest.status,
        },
      );

      alert("Saved Successfully");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Hrmsleftlayout>
      <div className="OfferContainer">
        <h2 className="OfferTitle">Onboarding Compliance</h2>

        {/* Basic Details */}
        <div className="OfferRow">
          <div className="OfferField">
            <label>Name</label>
            <input value={jobRequest.requesterName || ""} readOnly />
          </div>

          <div className="OfferField">
            <label>Case ID</label>
            <input value={jobRequest.caseId || ""} readOnly />
          </div>
        </div>

        <div className="OfferRow">
          <div className="OfferField">
            <label>Department</label>
            <input value={jobRequest.department || ""} readOnly />
          </div>

          <div className="OfferField">
            <label>Status</label>
            <input value={jobRequest.status || ""} readOnly />
          </div>
        </div>

        {/* OFFER */}

        <div className="SectionBlock">
          <h3>Offer</h3>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Offer Status *</label>

              <div className="ToggleGroup">
                <button
                  type="button"
                  className={
                    offerStatus === "Accept" ? "ToggleActive" : "ToggleBtn"
                  }
                  onClick={() => setOfferStatus("Accept")}
                >
                  Accept
                </button>

                <button
                  type="button"
                  className={
                    offerStatus === "Reject" ? "ToggleFail" : "ToggleBtn"
                  }
                  onClick={() => setOfferStatus("Reject")}
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
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
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
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
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
                value={bsb}
                onChange={(e) => setBsb(e.target.value)}
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
                value={taxFileNumber}
                onChange={(e) => setTaxFileNumber(e.target.value)}
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
                value={superFundName}
                onChange={(e) => setSuperFundName(e.target.value)}
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
                value={superMemberNumber}
                onChange={(e) => setSuperMemberNumber(e.target.value)}
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
                value={longServiceLeaveId}
                onChange={(e) => setLongServiceLeaveId(e.target.value)}
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
                    confidentiality === "Pass" ? "ToggleActive" : "ToggleBtn"
                  }
                  onClick={() => setConfidentiality("Pass")}
                >
                  Pass
                </button>

                <button
                  type="button"
                  className={
                    confidentiality === "Fail" ? "ToggleFail" : "ToggleBtn"
                  }
                  onClick={() => setConfidentiality("Fail")}
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
                  className={contract === "Pass" ? "ToggleActive" : "ToggleBtn"}
                  onClick={() => setContract("Pass")}
                >
                  Pass
                </button>

                <button
                  type="button"
                  className={contract === "Fail" ? "ToggleFail" : "ToggleBtn"}
                  onClick={() => setContract("Fail")}
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
                  className={whs === "Pass" ? "ToggleActive" : "ToggleBtn"}
                  onClick={() => setWhs("Pass")}
                >
                  Pass
                </button>

                <button
                  type="button"
                  className={whs === "Fail" ? "ToggleFail" : "ToggleBtn"}
                  onClick={() => setWhs("Fail")}
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
                    employment === "Pass" ? "ToggleActive" : "ToggleBtn"
                  }
                  onClick={() => setEmployment("Pass")}
                >
                  Pass
                </button>

                <button
                  type="button"
                  className={employment === "Fail" ? "ToggleFail" : "ToggleBtn"}
                  onClick={() => setEmployment("Fail")}
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
    </Hrmsleftlayout>
  );
}

export default OnBoardingSaves;
