import axios from "axios";
import CncLeftLayout from "../../../../Cnc/CncLeftLayout";
import RegularForm from "../../../../../components/Layouts/FormLayouts/RegularForm";
import { useState } from "react";
import "./index.css";

function OnBoardingComplianceSupplier() {
  const [expanded, setExpanded] = useState(false);

  const [activeTab, setActiveTab] = useState("Client Contract Deliverables");
  const [formData, setFormData] = useState({
    SupplierID: "",
    companyName: "",
    abn: "",
    acn: "",
    address: "",
    companyAddress: "",
    companyPhone: "",
    managingAgentName: "",
    managingAgentEmail: "",
    email: "",
    contactNumber: "",
    onboardingDate: "",
    validTill: "",
    type: "Adhoc",
    shortDescription: "",
    description: "",
  });
  const [contractDeliverables, setContractDeliverables] = useState([
    {
      contractId: "",
      siteName: "",
      siteAddress: "",
      siteManagerName: "",
      siteEmail: "",
      siteMobile: "",
      contractState: "Active",
      comments: "",
      attachment: null,
    },
  ]);
  const [financialDetails, setFinancialDetails] = useState([
    {
      InvoicingCycle: "Monthly",
      comments: "",

      attachment: null,
    },
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeliverableChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...contractDeliverables];

    updated[index][name] = value;

    setContractDeliverables(updated);
  };
  const handleFinancialChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...financialDetails];

    updated[index][name] = value;

    setFinancialDetails(updated);
  };
  const addDeliverable = () => {
    setContractDeliverables([
      ...contractDeliverables,

      {
        contractId: "",
        siteName: "",
        siteAddress: "",
        siteManagerName: "",
        siteEmail: "",
        siteMobile: "",
        contractState: "Active",
        comments: "",
      },
    ]);
  };
  const removeDeliverable = (index) => {
    if (index === 0) return;

    const updated = contractDeliverables.filter((_, i) => i !== index);

    setContractDeliverables(updated);
  };
  const addFinancial = () => {
    setFinancialDetails([
      ...financialDetails,

      {
        invoiceDate: "",
        invoiceNumber: "",
        billingCycle: "Monthly",
        comments: "",
      },
    ]);
  };

  const handleDeliverableAttachment = (index, e) => {
    const updated = [...contractDeliverables];

    updated[index].attachment = e.target.files[0];

    setContractDeliverables(updated);
  };
  const handleFinancialAttachment = (index, e) => {
    const updated = [...financialDetails];

    updated[index].attachment = e.target.files[0];

    setFinancialDetails(updated);
  };
  const removeFinancial = (index) => {
    if (index === 0) return;

    const updated = financialDetails.filter((_, i) => i !== index);

    setFinancialDetails(updated);
  };

  const handleSave = async () => {
    try {
      await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/boarding/create",
        {
          ...formData,
          category: "Supplier Onboarding",
          contractDeliverables,
          financialDetails,
        },
      );

      alert("Supplier Onboarding Saved Successfully");
    } catch (error) {
      console.error(error);
      alert("Error Saving Supplier Onboarding");
    }
  };

  return (
    <CncLeftLayout>
      <RegularForm
        title="Onboarding Supplier"
        onSave={handleSave}
        onCancel={() => {}}
      >
        <div className="form-row">
          <label className="form-label">Supplier ID</label>
          <input
            className="form-input"
            name="clientId"
            value={formData.SupplierID}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Type</label>

          <select
            className="form-input"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="Vendor">Vendor</option>
            <option value="Subcontractor">Sub-Contractor</option>
          </select>
        </div>

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

        <div className="form-row">
          <label className="form-label">Address</label>
          <input
            className="form-input"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

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

        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

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

            <div className="deliverable-body">
              {/* ===========================
             CLIENT CONTRACT TAB
        ============================ */}

              {activeTab === "Client Contract Deliverables" && (
                <>
                  {contractDeliverables.map((item, index) => (
                    <div className="deliverable-form" key={index}>
                      {index > 0 && (
                        <div className="deliverable-remove">
                          <button
                            type="button"
                            onClick={() => removeDeliverable(index)}
                          >
                            Cancel This
                          </button>
                        </div>
                      )}

                      <div className="deliverable-row">
                        <div className="deliverable-field">
                          <label>Contract ID</label>

                          <input
                            type="text"
                            name="contractId"
                            value={item.contractId}
                            onChange={(e) => handleDeliverableChange(index, e)}
                          />
                        </div>

                        <div className="deliverable-field">
                          <label>Site Name</label>

                          <input
                            type="text"
                            name="siteName"
                            value={item.siteName}
                            onChange={(e) => handleDeliverableChange(index, e)}
                          />
                        </div>
                      </div>

                      <div className="deliverable-row">
                        <div className="deliverable-field">
                          <label>Site Address</label>

                          <input
                            type="text"
                            name="siteAddress"
                            value={item.siteAddress}
                            onChange={(e) => handleDeliverableChange(index, e)}
                          />
                        </div>

                        <div className="deliverable-field">
                          <label>Site Manager Name</label>

                          <input
                            type="text"
                            name="siteManagerName"
                            value={item.siteManagerName}
                            onChange={(e) => handleDeliverableChange(index, e)}
                          />
                        </div>
                      </div>

                      <div className="deliverable-row">
                        <div className="deliverable-field">
                          <label>Site Email ID</label>

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
                            type="text"
                            name="siteMobile"
                            value={item.siteMobile}
                            onChange={(e) => handleDeliverableChange(index, e)}
                          />
                        </div>
                      </div>

                      <div className="deliverable-row">
                        <div className="deliverable-field">
                          <label>Contract State</label>

                          <div className="deliverable-radio-group">
                            <label>
                              <input
                                type="radio"
                                name="contractState"
                                value="Active"
                                checked={item.contractState === "Active"}
                                onChange={(e) =>
                                  handleDeliverableChange(index, e)
                                }
                              />
                              Active
                            </label>

                            <label>
                              <input
                                type="radio"
                                name="contractState"
                                value="Inactive"
                                checked={item.contractState === "Inactive"}
                                onChange={(e) =>
                                  handleDeliverableChange(index, e)
                                }
                              />
                              Inactive
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="deliverable-comment">
                        <label>Comments</label>

                        <textarea
                          name="comments"
                          value={item.comments}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>
                      <div className="deliverable-field">
                        <label>Attachment</label>

                        <input
                          type="file"
                          onChange={(e) =>
                            handleDeliverableAttachment(index, e)
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <div className="deliverable-add">
                    <button type="button" onClick={addDeliverable}>
                      + Add Contract
                    </button>
                  </div>
                </>
              )}

              {/* ===========================
             FINANCIAL TAB
        ============================ */}

              {activeTab === "Financial Details" && (
                <>
                  {financialDetails.map((item, index) => (
                    <div className="deliverable-form" key={index}>
                      {index > 0 && (
                        <div className="deliverable-remove">
                          <button
                            type="button"
                            onClick={() => removeFinancial(index)}
                          >
                            Cancel This
                          </button>
                        </div>
                      )}

                      <div className="deliverable-row">
                        <div className="deliverable-field">
                          <label>Contract ID</label>

                          <input
                            type="text"
                            name="contractId"
                            value={item.contractId}
                            onChange={(e) => handleFinancialChange(index, e)}
                          />
                        </div>

                        <div className="deliverable-field">
                          <label>Invoice Number</label>

                          <input
                            type="text"
                            name="invoiceNumber"
                            value={item.invoiceNumber}
                            onChange={(e) => handleFinancialChange(index, e)}
                          />
                        </div>
                      </div>

                      <div className="deliverable-row">
                        <div className="deliverable-field">
                          <label>Invoicing Cycle</label>

                          <select
                            name="invoicingCycle"
                            value={item.InvoicingCycle}
                            onChange={(e) => handleFinancialChange(index, e)}
                          >
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                          </select>
                        </div>
                      </div>

                      <div className="deliverable-comment">
                        <label>Comments</label>

                        <textarea
                          name="comments"
                          value={item.comments}
                          onChange={(e) => handleFinancialChange(index, e)}
                        />
                      </div>
                      <div className="deliverable-field">
                        <label>Attachment</label>

                        <input
                          type="file"
                          onChange={(e) => handleFinancialAttachment(index, e)}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="deliverable-add">
                    <button type="button" onClick={addFinancial}>
                      + Add Financial Details
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        </div>
      </RegularForm>
    </CncLeftLayout>
  );
}

export default OnBoardingComplianceSupplier;
