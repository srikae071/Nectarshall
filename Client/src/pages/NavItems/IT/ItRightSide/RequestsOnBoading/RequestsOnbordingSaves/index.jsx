import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchApiData, sendApiData } from "../../../../../../utils/apiClient";
import ItLeftSide from "../../../ItLeftSide";
import AuditTimeline from "../../../../../../components/AuditTimeline";
import "./index.css";

function RequestOnboardingSaves() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    onboardingTaskId: "",
    caseId: "",
    requesterName: "",
    firstName: "",
    lastName: "",
    department: "",

    onboardingStatus: "Open",
    onboardingSubStatus: "",

    onboardingCompleted: null,
    azureAccountCreated: null,
    laptopIssued: null,
  });

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await fetchApiData(`/api/jobrequests/${id}`);
      setFormData({
        ...response.data,
        onboardingStatus: response.data.onboardingStatus || "Open",
        onboardingSubStatus: response.data.onboardingSubStatus || "",
        onboardingCompleted:
          response.data.onboardingCompleted === "true"
            ? true
            : response.data.onboardingCompleted === "false"
              ? false
              : response.data.onboardingCompleted ?? null,

        azureAccountCreated:
          response.data.azureAccountCreated === "true"
            ? true
            : response.data.azureAccountCreated === "false"
              ? false
              : response.data.azureAccountCreated ?? null,

        laptopIssued:
          response.data.laptopIssued === "true"
            ? true
            : response.data.laptopIssued === "false"
              ? false
              : response.data.laptopIssued ?? null,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleBoolean = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        ...formData,
      };

      if (updatedData.onboardingCompleted === true) {
        updatedData.onboardingStatus = "Resolved";
      }
      await sendApiData(`/api/jobrequests/${id}`, updatedData, "put");
      alert("Saved Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ItLeftSide>
      <div className="ROSContainer">
        <div className="ROSCard">
          <h2 className="ROSTitle">Request Onboarding Saves</h2>

        <div className="ROSRow">
          <div className="ROSField">
            <label>Task ID</label>
            <input value={formData.onboardingTaskId || ""} readOnly />
          </div>

          <div className="ROSField">
            <label>Case ID</label>
            <input value={formData.caseId || ""} readOnly />
          </div>

          <div className="ROSField">
            <label>Employee Name</label>
            <input value={formData.requesterName || ""} readOnly />
          </div>
        </div>

        <div className="ROSRow">
          <div className="ROSField">
            <label>First Name</label>
            <input value={formData.firstName || ""} readOnly />
          </div>

          <div className="ROSField">
            <label>Last Name</label>
            <input value={formData.lastName || ""} readOnly />
          </div>

          <div className="ROSField">
            <label>Department</label>
            <input value={formData.department || ""} readOnly />
          </div>
        </div>

        <div className="ROSRow">
          <div className="ROSField">
            <label>Status</label>

            <select
              name="onboardingStatus"
              value={formData.onboardingStatus}
              onChange={handleChange}
            >
              <option>Open</option>
              <option>Resolved</option>
            </select>
          </div>

          <div className="ROSField">
            <label>Sub Status</label>

            <select
              name="onboardingSubStatus"
              value={formData.onboardingSubStatus}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="ROSToggleSection">
          <div className="ROSToggleCard">
            <label>Onboarding Completed</label>

            <div className="ROSToggleGroup">
              <button
                className={
                  formData.onboardingCompleted === true
                    ? "ROSActive"
                    : "ROSToggleBtn"
                }
                onClick={() => toggleBoolean("onboardingCompleted", true)}
                type="button"
              >
                Yes
              </button>

              <button
                className={
                  formData.onboardingCompleted === false
                    ? "ROSNo"
                    : "ROSToggleBtn"
                }
                onClick={() => toggleBoolean("onboardingCompleted", false)}
                type="button"
              >
                No
              </button>
            </div>
          </div>

          <div className="ROSToggleCard">
            <label>Azure Account Created</label>

            <div className="ROSToggleGroup">
              <button
                className={
                  formData.azureAccountCreated === true
                    ? "ROSActive"
                    : "ROSToggleBtn"
                }
                onClick={() => toggleBoolean("azureAccountCreated", true)}
                type="button"
              >
                Yes
              </button>

              <button
                className={
                  formData.azureAccountCreated === false
                    ? "ROSNo"
                    : "ROSToggleBtn"
                }
                onClick={() => toggleBoolean("azureAccountCreated", false)}
                type="button"
              >
                No
              </button>
            </div>
          </div>

          <div className="ROSToggleCard">
            <label>Laptop Issued</label>

            <div className="ROSToggleGroup">
              <button
                className={
                  formData.laptopIssued === true ? "ROSActive" : "ROSToggleBtn"
                }
                onClick={() => toggleBoolean("laptopIssued", true)}
                type="button"
              >
                Yes
              </button>

              <button
                className={
                  formData.laptopIssued === false ? "ROSNo" : "ROSToggleBtn"
                }
                onClick={() => toggleBoolean("laptopIssued", false)}
                type="button"
              >
                No
              </button>
            </div>
          </div>
        </div>

        <div className="ROSFooter">
          <button className="ROSButton" onClick={handleSubmit}>
            Submit
          </button>

          <button className="ROSButtonCancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>

      {/* AUDIT TIMELINE LOG & TIMESTAMPS */}
      <AuditTimeline data={formData} module="IT" />
    </div>
  </ItLeftSide>
);
}

export default RequestOnboardingSaves;
