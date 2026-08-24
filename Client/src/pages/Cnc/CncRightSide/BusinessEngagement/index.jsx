import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendApiData } from "../../../../utils/apiClient";
import { useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import BusinessEngagementNavBar from "../../CncRightSide/BusinessEngagementNav";

import "../../../../styles/SharedFormStyle.css";

function BusinessEngagement() {
  const { user } = useAuth();
  const currentUserName = user?.displayName || user?.username || "Employee";

  const [formData, setFormData] = useState({
    businessId: "",
    clientId: "",

    requester: currentUserName,
    requesterFor: "Sumit",

    type: "",
    companyName: "",
    abn: "",
    acn: "",
    companyAddress: "",
    companyPhone: "",
    managingAgentName: "",
    managingAgentEmail: "",
    // attachment: "",
    attachment: {
      fileName: "",
      filePath: "",
    },
    shortDescription: "",
    description: "",
    CompanyAddress: "",
    status: "",
    category: "Home",
  });

  // const { id } = useParams();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const fetchRequest = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/itrequests/${id}`,
  //       );

  //       setFormData({
  //         requester: response.data.requester || "",
  //         requesterFor: response.data.requesterFor || "",
  //         category: response.data.category || "",
  //         subCategory: response.data.subCategory || "",
  //         urgency: response.data.urgency || "",
  //         shortDescription: response.data.shortDescription || "",
  //         description: response.data.description || "",
  //         workNotes: response.data.workNotes || "",
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (id) {
  //     fetchRequest();
  //   }
  // }, [id]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "abn") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "acn") {
      value = value.replace(/\D/g, "").slice(0, 9);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAttachment = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      // attachment: file.name,
      attachment: {
        fileName: file.name,
        filePath: "",
      },
    }));
  };

  const handleSave = async () => {
    // console.log("FORM DATA BEFORE SAVE:", formData);

    // Remove spaces before checking
    console.log("Business Engagement Attachment:", formData.attachment);
    const abn = formData.abn.trim();
    const acn = formData.acn.trim();

    let hasError = false;

    // ABN validation (must be exactly 11 digits)
    if (!/^\d{11}$/.test(abn)) {
      alert("Invalid ABN Number. ABN must contain exactly 11 digits.");
      hasError = true;
    }

    // ACN validation (must be exactly 9 digits)
    if (!/^\d{9}$/.test(acn)) {
      alert("Invalid ACN Number. ACN must contain exactly 9 digits.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      await sendApiData("/api/BoardingCandidates/create", {
        ...formData,
        category: "Client Onboarding",
        status: "Open",
      });

      navigate("/");
      alert("Business Request Saved Successfully");
    } catch (error) {
      console.error(error);
      alert("Error Saving Request");
    }
  };
  return (
    <>
      <BusinessEngagementNavBar />

      <div className="lr-page">
        <div className="lr-card">
          <h2 className="lr-title">Business Engagement</h2>

          <div className="section-header">EMPLOYEE DETAILS</div>

          {/* ROW 1 */}
          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Requester</label>
              <input
                className="lr-input"
                name="requester"
                value={currentUserName || formData.requester}
                readOnly
                disabled
                style={{ background: "#f1f5f9", cursor: "not-allowed" }}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Requested For</label>
              <input
                className="lr-input"
                name="requesterFor"
                value="Sumit"
                readOnly
                disabled
                style={{ background: "#f1f5f9", cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Company Name</label>
              <input
                className="lr-input"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">ABN</label>
              <input
                className="lr-input"
                name="abn"
                maxLength={11}
                value={formData.abn}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">ACN</label>
              <input
                className="lr-input"
                name="acn"
                value={formData.acn}
                maxLength={9}
                onChange={handleChange}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Company Address</label>
              <input
                className="lr-input"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ROW 4 */}
          <div className="lr-grid-2">
            <div className="lr-field">
              <label className="lr-label">Managing Agent Name</label>
              <input
                className="lr-input"
                name="managingAgentName"
                value={formData.managingAgentName}
                onChange={handleChange}
              />
            </div>

            <div className="lr-field">
              <label className="lr-label">Managing Agent Email</label>
              <input
                className="lr-input"
                name="managingAgentEmail"
                value={formData.managingAgentEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="lr-field" style={{ marginTop: "12px" }}>
            <label className="lr-label">Description</label>
            <textarea
              className="lr-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description..."
            />
          </div>

          {/* ACTIONS */}
          <div className="lr-actions" style={{ alignItems: "center" }}>
            <label
              className="lr-btn-cancel"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                height: "38px",
                boxSizing: "border-box",
              }}
            >
              Choose Attachment
              <input type="file" hidden onChange={handleAttachment} />
            </label>

            {formData.attachment?.fileName && (
              <span style={{ fontSize: "13px", color: "#475569", marginLeft: "8px" }}>
                {formData.attachment.fileName}
              </span>
            )}

            <div style={{ flexGrow: 1 }} />

            <button
              type="button"
              className="lr-btn-cancel"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  companyName: "",
                  abn: "",
                  acn: "",
                  companyAddress: "",
                  companyPhone: "",
                  managingAgentName: "",
                  managingAgentEmail: "",
                  shortDescription: "",
                  description: "",
                  attachment: { fileName: "", filePath: "" },
                }))
              }
            >
              Cancel
            </button>

            <button type="button" className="lr-btn-submit" onClick={handleSave}>
              Save
            </button>

            <button type="button" className="lr-btn-submit" onClick={handleSave}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BusinessEngagement;
