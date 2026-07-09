import CncLeftLayout from "../../../../Cnc/CncLeftLayout/index.jsx";
import RegularForm from "../../../../../components/Layouts/FormLayouts/RegularForm/index.jsx";
import { useState } from "react";
import axios from "axios";
import "./index.css";

function OnBoardingCompliance() {
  const [expanded, setExpanded] = useState(false);

  const [activeTab, setActiveTab] = useState("Client Contract Deliverables");
  const [formData, setFormData] = useState({
    SupplierId: "",

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
      ContractStartDate: "",
      ContractEndtDate: "",
      ContractValidDate: "",
    },
  ]);
  const [financialDetails, setFinancialDetails] = useState([
    {
      invoiceDate: "",
      invoicingentity: "",
      invoicingFrequency: "",
      invoiceNumber: "",
      billingCycle: "Monthly",
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
          category: "Client Onboarding",
          contractDeliverables,
          financialDetails,
        },
      );

      alert("Client Onboarding Saved Successfully");
    } catch (error) {
      console.error(error);
      alert("Error Saving Supplier Onboarding");
    }
  };

  return (
    <CncLeftLayout>
      <RegularForm
        title="Onboarding Compliance"
        onSave={handleSave}
        onCancel={() => {}}
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
          <label className="form-label">Company Address</label>
          <input
            className="form-input"
            name="companyAddress"
            value={formData.companyAddress}
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
            <button type="button" className="deliverable-toggle">
              {expanded ? "-" : "+"}
            </button>
          </div>

          {expanded && (
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
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
                            />
                          </div>

                          <div className="deliverable-field">
                            <label>Site Name</label>

                            <input
                              type="text"
                              name="siteName"
                              value={item.siteName}
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
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
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
                            />
                          </div>

                          <div className="deliverable-field">
                            <label>Site Manager Name</label>

                            <input
                              type="text"
                              name="siteManagerName"
                              value={item.siteManagerName}
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
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
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
                            />
                          </div>
                          <div className="deliverable-field">
                            <label>Contact Start Date</label>

                            <input
                              type="text"
                              name="siteMobile"
                              value={item.ContractStartDate}
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
                            />
                          </div>
                          <div className="deliverable-field">
                            <label>Contact End Date</label>

                            <input
                              type="text"
                              name="siteMobile"
                              value={item.ContractEndtDate}
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
                            />
                          </div>
                          <div className="deliverable-field">
                            <label>Contact Valid Date</label>

                            <input
                              type="text"
                              name="siteMobile"
                              value={item.ContractValidDate}
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
                            />
                          </div>

                          <div className="deliverable-field">
                            <label>Site Mobile Number</label>

                            <input
                              type="text"
                              name="siteMobile"
                              value={item.siteMobile}
                              onChange={(e) =>
                                handleDeliverableChange(index, e)
                              }
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
                          <label>Scope of Work</label>

                          <textarea
                            className="deliverable-scope"
                            name="scopeOfWork"
                            value={item.scopeOfWork}
                            onChange={(e) => handleDeliverableChange(index, e)}
                          />
                        </div>

                        <div className="deliverable-comment">
                          <label>Comments</label>

                          <textarea
                            className="deliverable-comments"
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
                            <label>Invoice Date</label>

                            <input
                              type="date"
                              name="invoiceDate"
                              value={item.invoiceDate}
                              onChange={(e) => handleFinancialChange(index, e)}
                            />
                          </div>
                          <div className="deliverable-field">
                            <label>Invoicing Entity</label>

                            <input
                              type="text"
                              name="invoiceingEntity"
                              value={item.invoicingentity}
                              onChange={(e) => handleFinancialChange(index, e)}
                            />
                          </div>
                          <div className="deliverable-field">
                            <label>Invoicing Frequency</label>

                            <input
                              type="text"
                              name="invoiceDate"
                              value={item.invoicingFrequency}
                              onChange={(e) => handleFinancialChange(index, e)}
                            />
                          </div>
                          <div className="deliverable-field">
                            <label>Billing Cycle</label>

                            <select
                              name="billingCycle"
                              value={item.billingCycle}
                              onChange={(e) => handleFinancialChange(index, e)}
                            >
                              <option>Weekly</option>
                              <option>Monthly</option>
                              <option>Quarterly</option>
                            </select>
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
                            <label>Annual Increase</label>

                            <div className="deliverable-radio-group">
                              <label>
                                <input
                                  type="radio"
                                  name={`annualIncrease-${index}`}
                                  checked={item.annualIncrease === "Yes"}
                                  onChange={() =>
                                    handleFinancialChange(index, {
                                      target: {
                                        name: "annualIncrease",
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
                                  name={`annualIncrease-${index}`}
                                  checked={item.annualIncrease === "No"}
                                  onChange={() =>
                                    handleFinancialChange(index, {
                                      target: {
                                        name: "annualIncrease",
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
                        {item.annualIncrease === "Yes" && (
                          <div className="deliverable-field deliverable-percentage-field">
                            <label>Annual Increase Percentage</label>

                            <div className="deliverable-percentage">
                              <input
                                type="number"
                                name="annualIncreasePercentage"
                                value={item.annualIncreasePercentage}
                                onChange={(e) =>
                                  handleFinancialChange(index, e)
                                }
                                placeholder="7.74"
                              />

                              <span>%</span>
                            </div>
                          </div>
                        )}

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
                            onChange={(e) =>
                              handleFinancialAttachment(index, e)
                            }
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
          )}
        </div>
      </RegularForm>
    </CncLeftLayout>
  );
}

export default OnBoardingCompliance;
