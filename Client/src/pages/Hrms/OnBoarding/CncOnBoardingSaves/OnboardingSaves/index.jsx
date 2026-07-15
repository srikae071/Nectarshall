import axios from "axios";
import CncLeftLayout from "../../../../Cnc/CncLeftLayout";
import DashboardLayout from "../../../../Dashboard/DashboardLayout";
import RegularForm from "../../../../../components/Layouts/FormLayouts/RegularForm";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./index.css";

function OnBoardingSaves() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("Client Contract Deliverables");
  const [pageTitle, setPageTitle] = useState("");
  const [backendStatus, setBackendStatus] = useState("");
  const [formData, setFormData] = useState({
    clientId: "",
    SupplierType: "",
    companyName: "",
    abn: "",
    acn: "",
    // address: "",
    companyAddress: "",
    companyPhone: "",
    managingAgentName: "",
    managingAgentEmail: "",
    email: "",
    contactNumber: "",
    onboardingDate: "",
    validTill: "",

    shortDescription: "",
    description: "",
    category: "",
    status: "",
    attachment: "",
    operationsClientApproved: "",
  });

  const fetchBoarding = async () => {
    try {
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding/${id}`,
      );

      const data = response.data;
      setBackendStatus(data.status);
      const titleMap = {
        "Supplier Onboarding": "Onboarding Supplier",
        "Client Onboarding": "Onboarding Client",
        Request: "Business Management",
      };

      setPageTitle(titleMap[data.category] || "Onboarding");
      setFormData({
        clientId: data.clientId || "",
        type: data.type || "",
        companyName: data.companyName || "",
        abn: data.abn || "",
        acn: data.acn || "",
        // address: data.address || "",
        companyAddress: data.companyAddress || "",
        companyPhone: data.companyPhone || "",
        managingAgentName: data.managingAgentName || "",
        managingAgentEmail: data.managingAgentEmail || "",
        email: data.email || "",
        contactNumber: data.contactNumber || "",
        onboardingDate: data.onboardingDate?.slice(0, 10) || "",
        validTill: data.validTill?.slice(0, 10) || "",
        shortDescription: data.shortDescription || "",
        description: data.description || "",
        category: data.category || "",
        status: data.status || "Open",
        attachment: data.attachment || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [contractDeliverables, setContractDeliverables] = useState([
    {
      clientId: "",
      siteName: "",
      siteAddress: "",
      siteManagerName: "",
      siteEmail: "",
      siteMobile: "",
      contractState: "Active",
      adhoc: "No",
    },
  ]);
  const handleDeliverableChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...contractDeliverables];

    updated[index][name] = value;

    setContractDeliverables(updated);
  };

  useEffect(() => {
    if (id) {
      fetchBoarding();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding/${id}`,
        {
          operationsClientApproved: true,
        },
      );

      setFormData((prev) => ({
        ...prev,
        operationsClientApproved: true,
      }));

      alert("Approved Successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const handleReject = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding/${id}`,
        {
          operationsClientApproved: false,
        },
      );

      setFormData((prev) => ({
        ...prev,
        operationsClientApproved: false,
      }));

      alert("Rejected Successfully");
    } catch (error) {
      console.log(error);
    }
  };
  // const handleDeliverableAttachment = (index, e) => {
  //   const updated = [...contractDeliverables];

  //   updated[index].attachment = e.target.files[0];

  //   setContractDeliverables(updated);
  // };
  // const handleFinancialAttachment = (index, e) => {
  //   const updated = [...financialDetails];

  //   updated[index].attachment = e.target.files[0];

  //   setFinancialDetails(updated);
  // };
  // const removeFinancial = (index) => {
  //   if (index === 0) return;

  //   const updated = financialDetails.filter((_, i) => i !== index);

  //   setFinancialDetails(updated);
  // };

  const handleSave = async () => {
    try {
      // console.log("FORM DATA:");
      // console.log(formData);

      // console.log("CONTRACT DELIVERABLES:");
      // console.log(contractDeliverables);

      // console.log("FINANCIAL DETAILS:");
      // console.log(financialDetails);
      console.log("Sending:");
      console.log({
        ...formData,
      });

      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding/${id}`,
        {
          ...formData,
          contractDeliverables,
        },
      );
      setBackendStatus(formData.status);

      alert("Saved Successfully");
      navigate("/");
    } catch (error) {
      // console.log("FULL ERROR:", error);

      // console.log("RESPONSE:");
      // console.log(error.response);

      // console.log("DATA:");
      // console.log(error.response?.data);

      console.log(error);
      alert("Update Failed");
    }
  };

  const Layout =
    backendStatus === "On Boarded" ? DashboardLayout : CncLeftLayout;
  return (
    <Layout>
      <RegularForm
        title={pageTitle}
        onSave={handleSave}
        onCancel={() => {}}
        attachmentName={formData.attachment}
        attachmentPath={`https://your-backend-url/uploads/${formData.attachment}`}
        formData={formData}
        onApprove={backendStatus === "On Boarded" ? handleApprove : undefined}
        onReject={backendStatus === "On Boarded" ? handleReject : undefined}
      >
        <div className="form-row">
          <label className="form-label">Client ID</label>
          <input
            className="form-input"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
          />
        </div>
        {formData.category === "Supplier Onboarding" && (
          <div className="form-row">
            <label className="form-label">Type</label>

            <select
              className="form-input"
              name="SupplierType"
              value={formData.SupplierType}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="Vendor">Vendor</option>
              <option value="Subcontractor">Sub-Contractor</option>
            </select>
          </div>
        )}

        <div className="form-row">
          <label className="form-label">Company Name</label>
          <input
            className="form-input"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">ABN</label>
          <input
            className="form-input"
            name="abn"
            value={formData.abn}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">ACN</label>
          <input
            className="form-input"
            name="acn"
            value={formData.acn}
            onChange={handleChange}
          />
        </div>

        {/* <div className="form-row">
          <label className="form-label">Address</label>
          <input
            className="form-input"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div> */}

        <div className="form-row">
          <label className="form-label">Company Address</label>
          <input
            className="form-input"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Company Phone</label>
          <input
            className="form-input"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Managing Agent Name</label>
          <input
            className="form-input"
            name="managingAgentName"
            value={formData.managingAgentName}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Managing Agent Email</label>
          <input
            className="form-input"
            name="managingAgentEmail"
            value={formData.managingAgentEmail}
            onChange={handleChange}
          />
        </div>

        {/* <div className="form-row">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div> */}

        <div className="form-row">
          <label className="form-label">Contact Number</label>
          <input
            className="form-input"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Onboarding Date</label>
          <input
            type="date"
            className="form-input"
            name="onboardingDate"
            value={formData.onboardingDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Valid Till</label>
          <input
            type="date"
            className="form-input"
            name="validTill"
            value={formData.validTill}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Status</label>

          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="Work In Progress">Work In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="On Boarded">On Boarded</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option>Adhoc</option>
            <option>Contractual</option>
          </select>
        </div>

        <div className="form-row form-full">
          <label className="form-label">Short Description</label>
          <textarea
            className="form-short-textarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          />
        </div>

        <div className="form-row form-full">
          <label className="form-label">Description</label>
          <textarea
            className="form-description-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="deliverable-container">
          <div
            className="deliverable-header"
            onClick={() => setExpanded(!expanded)}
          >
            {/* <button type="button" className="deliverable-toggle">
              {expanded ? "-" : "+"}
            </button> */}
          </div>

          <>
            <div className="deliverable-tabs">
              <button
                type="button"
                className={
                  activeTab === "Client Contract Deliverables"
                    ? "deliverable-tab active"
                    : "deliverable-tab"
                }
                onClick={() => setActiveTab("Client Contract Deliverables")}
              >
                Client Contract Deliverables
              </button>

              <button
                type="button"
                className={
                  activeTab === "Financial Details"
                    ? "deliverable-tab active"
                    : "deliverable-tab"
                }
                onClick={() => setActiveTab("Financial Details")}
              >
                Financial Details
              </button>
            </div>
            {activeTab === "Client Contract Deliverables" && (
              <>
                {contractDeliverables.map((item, index) => (
                  <div className="deliverable-form" key={index}>
                    <div className="deliverable-grid">
                      <div className="deliverable-field">
                        <label>Client ID</label>
                        <input
                          name="clientId"
                          value={item.clientId}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>

                      <div className="deliverable-field">
                        <label>Site Name</label>
                        <input
                          name="siteName"
                          value={item.siteName}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>

                      <div className="deliverable-field">
                        <label>Site Address</label>
                        <input
                          name="siteAddress"
                          value={item.siteAddress}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>

                      <div className="deliverable-field">
                        <label>Site Manager Name</label>
                        <input
                          name="siteManagerName"
                          value={item.siteManagerName}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>

                      <div className="deliverable-field">
                        <label>Site Email</label>
                        <input
                          type="email"
                          name="siteEmail"
                          value={item.siteEmail}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>

                      <div className="deliverable-field">
                        <label>Site Mobile Number</label>
                        <input
                          name="siteMobile"
                          value={item.siteMobile}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>

                      <div className="deliverable-field">
                        <label>Contract State</label>

                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              name={`contractState-${index}`}
                              checked={item.contractState === "Active"}
                              onChange={() =>
                                handleDeliverableChange(index, {
                                  target: {
                                    name: "contractState",
                                    value: "Active",
                                  },
                                })
                              }
                            />
                            Active
                          </label>

                          <label>
                            <input
                              type="radio"
                              name={`contractState-${index}`}
                              checked={item.contractState === "Inactive"}
                              onChange={() =>
                                handleDeliverableChange(index, {
                                  target: {
                                    name: "contractState",
                                    value: "Inactive",
                                  },
                                })
                              }
                            />
                            Inactive
                          </label>
                        </div>
                      </div>

                      <div className="deliverable-field">
                        <label>Ad Hoc</label>

                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              name={`adhoc-${index}`}
                              checked={item.adhoc === "Yes"}
                              onChange={() =>
                                handleDeliverableChange(index, {
                                  target: {
                                    name: "adhoc",
                                    value: "Yes",
                                  },
                                })
                              }
                            />
                            Yes
                          </label>

                          <label>
                            <input
                              type="radio"
                              name={`adhoc-${index}`}
                              checked={item.adhoc === "No"}
                              onChange={() =>
                                handleDeliverableChange(index, {
                                  target: {
                                    name: "adhoc",
                                    value: "No",
                                  },
                                })
                              }
                            />
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        </div>
      </RegularForm>
    </Layout>
  );
}

export default OnBoardingSaves;
