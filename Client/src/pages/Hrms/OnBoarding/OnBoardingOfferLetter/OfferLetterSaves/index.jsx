import { useState } from "react";
import HrmsLeftLayout from "../../../Hrmsleftlayout";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "./index.css";

function OfferLetterSaves() {
  const { id } = useParams();

  const [jobRequest, setJobRequest] = useState({});
  const [offerStatus, setOfferStatus] = useState("");
  const [offerRLetterReleaseeDate, setofferRLetterReleaseeDate] = useState("");
  // const [confidentiality, setConfidentiality] = useState("");
  // const [contract, setContract] = useState("");
  // const [whs, setWhs] = useState("");
  // const [employment, setEmployment] = useState("");
  // const [bankName, setBankName] = useState("");
  // const [bankAccount, setBankAccount] = useState("");
  // const [bsb, setBsb] = useState("");
  // const [taxFileNumber, setTaxFileNumber] = useState("");
  // const [superFundName, setSuperFundName] = useState("");
  // const [superMemberNumber, setSuperMemberNumber] = useState("");
  // const [longServiceLeaveId, setLongServiceLeaveId] = useState("");
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
      setofferRLetterReleaseeDate(response.data.offerRLetterReleaseeDate || "");
      // setConfidentiality(response.data.confidentialityAgreement || "");
      // setContract(response.data.contract || "");
      // setWhs(response.data.handbookWhs || "");
      // setEmployment(response.data.handbookEmployment || "");
      // setBankName(response.data.bankName || "");
      // setBankAccount(response.data.bankAccount || "");
      // setBsb(response.data.bsb || "");
      // setTaxFileNumber(response.data.taxFileNumber || "");
      // setSuperFundName(response.data.superFundName || "");
      // setSuperMemberNumber(response.data.superMemberNumber || "");
      // setLongServiceLeaveId(response.data.longServiceLeaveId || "");
    } catch (error) {
      console.error(error);
    }
  };
  const handleSave = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        {
          offerStatus,
          offerRLetterReleaseeDate,
        },
      );

      alert("Saved Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        {
          offerStatus,
          offerRLetterReleaseeDate,

          status: "PreJoiningCompliance",
        },
      );

      await axios.post(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/send-candidate-form2/${jobRequest.caseId}`,
      );

      alert("Candidate Form 2 Email Sent");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <HrmsLeftLayout>
      <div className="OfferContainer">
        <h2 className="OfferTitle">Offer Letter</h2>

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
          <div className="OfferRow">
            <div className="OfferField">
              <label>Joining Date *</label>

              <input
                type="date"
                className="InterviewJoiningDate"
                value={offerRLetterReleaseeDate}
                onChange={(e) => setofferRLetterReleaseeDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* COMPLIANCE DOCUMENTS */}

        <div className="OfferFooter">
          <button className="CreateBtn" onClick={handleSave}>
            Save
          </button>
          <button className="CreateBtn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default OfferLetterSaves;
