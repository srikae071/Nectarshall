import CncLeftLayout from "../../../../Cnc/CncLeftLayout";
import RegularForm from "../../../../../components/Layouts/FormLayouts/RegularForm/index.jsx";
import { useState } from "react";
import axios from "axios";
import "./index.css";

function OnBoardingCompliance() {
  const [expanded, setExpanded] = useState(false);

  const [activeTab, setActiveTab] = useState("Client Contract Deliverables");
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
    },
  ]);

  const [financialDetails, setFinancialDetails] = useState([
    {
      invoiceDate: "",
      invoiceNumber: "",
      billingCycle: "Monthly",
      financialComments: "",
    },
  ]);
  const handleContractChange = (index, e) => {
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
  const addContract = () => {
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
  const addFinancial = () => {
    setFinancialDetails([
      ...financialDetails,
      {
        invoiceDate: "",
        invoiceNumber: "",
        billingCycle: "Monthly",
        financialComments: "",
      },
    ]);
  };

  const removeContract = (index) => {
    if (index === 0) return; // Don't remove the first form

    const updated = [...contractDeliverables];
    updated.splice(index, 1);

    setContractDeliverables(updated);
  };

  const removeFinancial = (index) => {
    if (index === 0) return; // Don't remove the first form

    const updated = [...financialDetails];
    updated.splice(index, 1);

    setFinancialDetails(updated);
  };
  const [formData, setFormData] = useState({
    companyName: "",
    abn: "",
    acn: "",

    emailaddress: "",
    companyAddress: "",
    companyPhone: "",

    spocName: "",
    spocNumber: "",
    spocemailaddres: "",

    onboardingDate: "",
    validtill: "",

    type: "Adhoc",

    shortDescription: "",
    description: "",
    contractId: "",
    siteName: "",
    siteAddress: "",
    siteManagerName: "",
    siteEmail: "",
    siteMobile: "",
    contractState: "Active",
    comments: "",

    invoiceDate: "",
    invoiceNumber: "",
    billingCycle: "Monthly",
    financialComments: "",
  });

  // const [showClientDeliverables, setShowClientDeliverables] = useState(false);
  // const [showFinancialDetails, setshowFinancialDetails] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/compliance/create",
        {
          ...formData,
          category: "Onboarding Client Compliance",
          clientContractDeliverables: contractDeliverables,

          financialDetails: financialDetails,
        },
      );

      alert("Compliance Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Error Saving Compliance");
    }
  };
  return (
    <CncLeftLayout>
      <RegularForm title="Client Details" onSave={handleSave}>
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
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            name="emailaddress"
            value={formData.emailaddress}
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
          <label className="form-label">SPOC Name</label>
          <input
            className="form-input"
            name="spocName"
            value={formData.spocName}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label className="form-label">SPOC Number</label>
          <input
            className="form-input"
            name="spocNumber"
            value={formData.spocNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label className="form-label">SPOC Email</label>
          <input
            className="form-input"
            name="spocemailaddres"
            value={formData.spocemailaddres}
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
            name="validtill"
            value={formData.validtill}
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
            <option value="Adhoc">Adhoc</option>
            <option value="Contractual">Contractual</option>
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
                {activeTab === "Client Contract Deliverables" && (
                  <>
                    <div className="deliverable-add-wrapper">
                      <button
                        type="button"
                        className="deliverable-add"
                        onClick={addContract}
                      >
                        +
                      </button>
                    </div>

                    {contractDeliverables.map((item, index) => (
                      <div className="deliverable-form" key={index}>
                        <div className="deliverable-title">
                          Contract Deliverable {index + 1}
                        </div>
                        {index > 0 && (
                          <div className="deliverable-remove-wrapper">
                            <button
                              type="button"
                              className="deliverable-remove"
                              onClick={() => removeContract(index)}
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
                              onChange={(e) => handleContractChange(index, e)}
                            />
                          </div>

                          <div className="deliverable-field">
                            <label>Site Name</label>

                            <input
                              type="text"
                              name="siteName"
                              value={item.siteName}
                              onChange={(e) => handleContractChange(index, e)}
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
                              onChange={(e) => handleContractChange(index, e)}
                            />
                          </div>

                          <div className="deliverable-field">
                            <label>Site Manager Name</label>

                            <input
                              type="text"
                              name="siteManagerName"
                              value={item.siteManagerName}
                              onChange={(e) => handleContractChange(index, e)}
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
                              onChange={(e) => handleContractChange(index, e)}
                            />
                          </div>

                          <div className="deliverable-field">
                            <label>Site Mobile Number</label>

                            <input
                              type="text"
                              name="siteMobile"
                              value={item.siteMobile}
                              onChange={(e) => handleContractChange(index, e)}
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
                                    handleContractChange(index, e)
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
                                    handleContractChange(index, e)
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
                            onChange={(e) => handleContractChange(index, e)}
                          />
                        </div>

                        <hr className="deliverable-divider" />
                      </div>
                    ))}
                  </>
                )}

                {activeTab === "Financial Details" && (
                  <>
                    <div className="deliverable-add-wrapper">
                      <button
                        type="button"
                        className="deliverable-add"
                        onClick={addFinancial}
                      >
                        +
                      </button>
                    </div>

                    {financialDetails.map((item, index) => (
                      <div className="deliverable-form" key={index}>
                        <div className="deliverable-title">
                          Financial Detail {index + 1}
                        </div>
                        {index > 0 && (
                          <div className="deliverable-remove-wrapper">
                            <button
                              type="button"
                              className="deliverable-remove"
                              onClick={() => removeFinancial(index)}
                            >
                              Cancel This
                            </button>
                          </div>
                        )}
                        <div className="deliverable-row">
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
                            <label>Billing Cycle</label>

                            <select
                              name="billingCycle"
                              value={item.billingCycle}
                              onChange={(e) => handleFinancialChange(index, e)}
                            >
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                            </select>
                          </div>
                        </div>

                        <div className="deliverable-comment">
                          <label>Comments</label>

                          <textarea
                            name="financialComments"
                            value={item.financialComments}
                            onChange={(e) => handleFinancialChange(index, e)}
                          />
                        </div>

                        <hr className="deliverable-divider" />
                      </div>
                    ))}
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
