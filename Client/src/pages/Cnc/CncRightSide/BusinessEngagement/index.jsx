import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BusinessEngagementNavBar from "../../CncRightSide/BusinessEngagementNav";
import TableLayout2 from "../../../../components/Layouts/TableLayouts/TableLayout2";

import "./index.css";

function BusinessEngagement() {
  const [formData, setFormData] = useState({
    businessId: "",
    clientId: "",

    requester: "",
    requesterFor: "",

    type: "",
    companyName: "",
    abn: "",
    acn: "",
    companyAddress: "",
    companyPhone: "",
    managingAgentName: "",
    managingAgentEmail: "",
    attachment: "",
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
      attachment: file.name,
    }));
  };

  const handleSave = async () => {
    console.log("FORM DATA BEFORE SAVE:", formData);

    // Remove spaces before checking
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
      await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/create",
        {
          ...formData,
          category: "Client Onboarding",
          status: "Open",
        },
      );

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

      <TableLayout2
        title="Business Engagement"
        onSave={handleSave}
        onCancel={() => {}}
        onAttachment={handleAttachment}
        attachmentName={formData.attachment}
      >
        <div className="table2-field">
          <label className="table2-label">Requester</label>

          <input
            className="table2-input"
            name="requester"
            value={formData.requester}
            onChange={handleChange}
          />
        </div>

        <div className="table2-field">
          <label className="table2-label">Requested For</label>

          <input
            className="table2-input"
            name="requesterFor"
            value={formData.requesterFor}
            onChange={handleChange}
          />
        </div>

        <div className="table2-field">
          <label className="table2-label">Company Name</label>

          <input
            className="table2-input"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>

        <div className="table2-field">
          <label className="table2-label">ABN</label>

          <input
            className="table2-input"
            name="abn"
            maxLength={11}
            value={formData.abn}
            onChange={handleChange}
          />
        </div>

        <div className="table2-field">
          <label className="table2-label">ACN</label>

          <input
            className="table2-input"
            name="acn"
            value={formData.acn}
            maxLength={9}
            onChange={handleChange}
          />
        </div>

        <div className="table2-field">
          <label className="table2-label">Company Address</label>

          <input
            className="table2-input"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
          />
        </div>

        <div className="table2-field">
          <label className="table2-label">Managing Agent Name</label>

          <input
            className="table2-input"
            name="managingAgentName"
            value={formData.managingAgentName}
            onChange={handleChange}
          />
        </div>

        <div className="table2-field">
          <label className="table2-label">Managing Agent Email</label>

          <input
            className="table2-input"
            name="managingAgentEmail"
            value={formData.managingAgentEmail}
            onChange={handleChange}
          />
        </div>

        <div className="table2-full">
          <label className="table2-label">Short Description</label>

          <textarea
            className="table2-textarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          />
        </div>

        <div className="table2-full">
          <label className="table2-label">Description</label>

          <textarea
            className="table2-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter detailed description..."
          />
        </div>
      </TableLayout2>
    </>
  );
}

export default BusinessEngagement;
