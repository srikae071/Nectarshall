import { useState } from "react";
import HrmsLeftLayout from "../../../Hrmsleftlayout";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "./index.css";

function OnBoardingPreJoiningSaves() {
  const { id } = useParams();

  const [jobRequest, setJobRequest] = useState({});

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
          ...jobRequest,

          bankName,
          bankAccount,
          bsb,
          taxFileNumber,
          superFundName,
          superMemberNumber,
          longServiceLeaveId,

          confidentialityAgreement: confidentiality,
          contract,
          handbookWhs: whs,
          handbookEmployment: employment,

          status: "Closed",
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
        <h2 className="OfferTitle">Pre</h2>

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

        {/* OFFER */}

        {/* FINANCIALS */}

        <div className="SectionBlock">
          <h3>Financials</h3>

          <div className="OfferRow">
            <div className="OfferField">
              <label>Bank Name *</label>
              <input
                type="text"
                value={bankName}
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
                value={jobRequest.taxFileNumber}
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
                value={jobRequest.superFundName}
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
                value={jobRequest.superMemberNumber}
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
                value={jobRequest.longServiceLeaveId}
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
    </HrmsLeftLayout>
  );
}

export default OnBoardingPreJoiningSaves;
