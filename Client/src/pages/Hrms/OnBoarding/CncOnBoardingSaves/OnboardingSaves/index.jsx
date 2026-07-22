import axios from "axios";
import CncLeftLayout from "../../../../Cnc/CncLeftLayout";
import DashboardLayout from "../../../../Dashboard/DashboardLayout";
import RegularForm from "../../../../../components/Layouts/FormLayouts/RegularForm";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import "./index.css";

function OnBoardingSaves() {
  const navigate = useNavigate();
  const location = useLocation();

  const source = location.state?.source;
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("Client Contract Deliverables");
  const [pageTitle, setPageTitle] = useState("");
  const [backendStatus, setBackendStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);
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

  const [contractDeliverables, setContractDeliverables] = useState([
    {
      clientId: "CNT-001",
      siteName: "",
      siteAddress: "",
      siteManagerName: "",
      siteEmail: "",
      siteMobile: "",
      contractState: "Active",
      adhoc: "No",
      comments: "",

      numberOfServices: 1,
      scopeOfWork: "",
      services: [
        {
          serviceType: "",
          position: "",
          quantity: "",
          shiftStartTime: "",
          shiftEndTime: "",
          contractStartDate: "",
          contractEndDate: "",
          workingDays: [],
        },
      ],
    },
  ]);

  const [financialDetails, setFinancialDetails] = useState([
    {
      contractId: "FIN-001",
      invoiceDate: "",
      invoiceNumber: "",
      billingCycle: "Monthly",
      comments: "",
    },
  ]);
  const fetchBoarding = async () => {
    try {
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${id}`,
      );

      const data = response.data;
      console.log(data.contractDeliverables);
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
        attachment: data.attachment || {
          fileName: "",
          filePath: "",
        },
      });
      setContractDeliverables(
        data.contractDeliverables && data.contractDeliverables.length > 0
          ? data.contractDeliverables
          : [
              // {
              //   clientId: "",
              //   siteName: "",
              //   siteAddress: "",
              //   siteManagerName: "",
              //   siteEmail: "",
              //   siteMobile: "",
              //   contractState: "Active",
              //   adhoc: "No",
              //   comments: "",
              //   attachment: "",
              // },

              // new code
              {
                clientId: "CNT-001",
                siteName: "",
                siteAddress: "",
                siteManagerName: "",
                siteEmail: "",
                siteMobile: "",
                contractState: "Active",
                adhoc: "No",
                comments: "",

                numberOfServices: 1,

                services: [
                  {
                    serviceType: "",
                    position: "",
                    quantity: "",
                    shiftStartTime: "",
                    shiftEndTime: "",
                    contractStartDate: "",
                    contractEndDate: "",
                    workingDays: [],
                  },
                ],
              },
            ],
      );
      setFinancialDetails(
        data.financialDetails?.length
          ? data.financialDetails
          : [
              {
                contractId: "FIN-001",
                invoiceDate: "",
                invoiceNumber: "",
                billingCycle: "Monthly",
                comments: "",
              },
            ],
      );
    } catch (err) {
      console.log(err);
    }
  };

  //new code

  const addContractDeliverable = () => {
    const lastId =
      contractDeliverables[contractDeliverables.length - 1]?.clientId ||
      "CNT-000";

    const nextNumber = parseInt(lastId.replace("CNT-", ""), 10) + 1;

    setContractDeliverables([
      ...contractDeliverables,
      {
        clientId: `CNT-${String(nextNumber).padStart(3, "0")}`,
        siteName: "",
        siteAddress: "",
        siteManagerName: "",
        siteEmail: "",
        siteMobile: "",
        contractState: "Active",
        adhoc: "No",
        comments: "",

        numberOfServices: 1,

        services: [
          {
            serviceType: "",
            position: "",
            quantity: "",
            shiftStartTime: "",
            shiftEndTime: "",
            contractStartDate: "",
            contractEndDate: "",
            workingDays: [],
          },
        ],
      },
    ]);
  };
  const addFinancialDetail = () => {
    const lastId =
      financialDetails[financialDetails.length - 1]?.contractId || "FIN-000";

    const nextNumber = parseInt(lastId.replace("FIN-", ""), 10) + 1;

    setFinancialDetails([
      ...financialDetails,
      {
        contractId: `FIN-${String(nextNumber).padStart(3, "0")}`,
        invoiceDate: "",
        invoiceNumber: "",
        billingCycle: "Monthly",
        comments: "",
      },
    ]);
  };

  const deleteContractDeliverable = (index) => {
    if (contractDeliverables.length === 1) {
      alert("At least one Client Contract Deliverable is required.");
      return;
    }

    const updated = contractDeliverables.filter((_, i) => i !== index);

    setContractDeliverables(updated);
  };
  const handleDeliverableChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...contractDeliverables];

    updated[index][name] = value;

    setContractDeliverables(updated);
  };

  const deleteFinancialDetail = (index) => {
    if (financialDetails.length === 1) {
      alert("At least one Financial Detail is required.");
      return;
    }

    setFinancialDetails(financialDetails.filter((_, i) => i !== index));
  };
  const handleFinancialChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...financialDetails];

    updated[index][name] = value;

    setFinancialDetails(updated);
  };
  // const handleDeliverableAttachment = (index, e) => {
  //   const file = e.target.files[0];

  //   if (!file) return;

  //   const updated = [...contractDeliverables];

  //   updated[index].attachment = file;

  //   setContractDeliverables(updated);
  // };

  // new code
  const handleNumberOfServices = (index, value) => {
    const updated = [...contractDeliverables];

    updated[index].numberOfServices = Number(value);

    updated[index].services = Array.from(
      { length: Number(value) },
      (_, i) =>
        updated[index].services[i] || {
          serviceType: "",
          position: "",
          quantity: "",
          shiftStartTime: "",
          shiftEndTime: "",
        },
    );

    setContractDeliverables(updated);
  };

  const handleServiceChange = (contractIndex, serviceIndex, e) => {
    const { name, value } = e.target;

    const updated = [...contractDeliverables];

    updated[contractIndex].services[serviceIndex][name] = value;

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
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${id}`,
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
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${id}`,
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
  const handleAttachment = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    setFormData((prev) => ({
      ...prev,
      attachment: {
        fileName: file.name,
        filePath: "",
      },
    }));
  };
  const handleWorkingDayChange = (index, serviceIndex, day, checked) => {
    const updated = [...contractDeliverables];

    let days = updated[index].services[serviceIndex].workingDays || [];

    if (checked) {
      if (!days.includes(day)) {
        days = [...days, day];
      }
    } else {
      days = days.filter((d) => d !== day);
    }

    updated[index].services[serviceIndex].workingDays = days;

    setContractDeliverables(updated);
  };
  const handleSave = async () => {
    try {
      console.log("Sending:");
      console.log({
        ...formData,
      });

      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${id}`,
        {
          ...formData,
          contractDeliverables,
          financialDetails,
        },
      );
      setBackendStatus(formData.status);

      alert("Saved Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  // const Layout =
  //   backendStatus === "On Boarded" ? DashboardLayout : CncLeftLayout;
  const Layout = source === "operations" ? DashboardLayout : CncLeftLayout;
  return (
    <Layout>
      <RegularForm
        title={pageTitle}
        onSave={handleSave}
        onCancel={() => {}}
        onAttachment={handleAttachment}
        attachmentName={formData.attachment?.fileName}
        formData={formData}
        onApprove={
          backendStatus === "On Boarded" && source === "operations"
            ? handleApprove
            : undefined
        }
        onReject={
          backendStatus === "On Boarded" && source === "operations"
            ? handleReject
            : undefined
        }
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
            {activeTab === "Financial Details" && (
              <>
                {financialDetails.map((item, index) => (
                  <div className="deliverable-form" key={index}>
                    <div className="deliverable-grid">
                      <div className="deliverable-field">
                        <label>Contract ID</label>
                        <input
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
                        <label>Invoice Number</label>
                        <input
                          name="invoiceNumber"
                          value={item.invoiceNumber}
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
                          <option value="Monthly">Monthly</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Adaptive">Adaptive</option>
                        </select>
                      </div>

                      <div className="deliverable-field deliverable-full">
                        <label>Comments</label>

                        <textarea
                          className="deliverable-textarea"
                          name="comments"
                          value={item.comments}
                          onChange={(e) => handleFinancialChange(index, e)}
                        />
                      </div>
                    </div>

                    <div className="deliverable-action">
                      <button
                        type="button"
                        className="add-contract-btn"
                        onClick={addFinancialDetail}
                      >
                        + Add Financial Detail
                      </button>

                      {financialDetails.length > 1 && (
                        <button
                          type="button"
                          className="delete-contract-btn"
                          onClick={() => deleteFinancialDetail(index)}
                        >
                          Delete Financial Detail
                        </button>
                      )}
                    </div>

                    {index !== financialDetails.length - 1 && (
                      <div className="contract-divider"></div>
                    )}
                  </div>
                ))}
              </>
            )}
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
                      <div className="deliverable-field deliverable-full">
                        <label>Scope Of Work</label>
                        <textarea
                          className="deliverable-textarea"
                          name="scopeOfWork"
                          value={item.scopeOfWork}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>
                      <div className="deliverable-field deliverable-full">
                        <label>Comments</label>
                        <textarea
                          className="deliverable-textarea"
                          name="comments"
                          value={item.comments || ""}
                          onChange={(e) => handleDeliverableChange(index, e)}
                        />
                      </div>
                      <div className="deliverable-field deliverable-full">
                        <label>Number Of Services</label>

                        <select
                          className="deliverable-input"
                          value={item.numberOfServices}
                          onChange={(e) =>
                            handleNumberOfServices(index, e.target.value)
                          }
                        >
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* <div className="deliverable-field deliverable-full">
                        <label>Attachment</label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleDeliverableAttachment(index, e)
                          }
                        />

                        <div className="attachment-name">
                          <input
                            type="file"
                            onChange={(e) => e.target.files[0]}
                          />
                        </div>
                      </div> */}
                    </div>
                    {(item.services || []).map((service, serviceIndex) => (
                      <div key={serviceIndex} className="service-container">
                        <h4 className="service-title">
                          Service {serviceIndex + 1}
                        </h4>

                        <div className="deliverable-grid">
                          <div className="deliverable-field">
                            <label>Type Of Service</label>

                            <select
                              name="serviceType"
                              value={service.serviceType}
                              onChange={(e) =>
                                handleServiceChange(index, serviceIndex, e)
                              }
                            >
                              <option value="">Select</option>
                              <option value="Security">Security</option>
                              <option value="Patrolling">Patrolling</option>
                              <option value="Electronics">Electronics</option>
                            </select>
                          </div>

                          <div className="deliverable-field">
                            <label>Position</label>

                            <select
                              name="position"
                              value={service.position}
                              onChange={(e) =>
                                handleServiceChange(index, serviceIndex, e)
                              }
                            >
                              <option value="">Select</option>

                              <option value="Site Manager">Site Manager</option>
                              <option value="In Charge">Site In Charge</option>
                              <option value="GL1">GL1</option>
                              <option value="GL2">GL2</option>
                              <option value="GL3">GL3</option>
                              <option value="GL4">GL4</option>
                            </select>
                          </div>
                        </div>
                        <div className="deliverable-field">
                          <label>Quantity</label>

                          <input
                            type="number"
                            name="quantity"
                            min="0"
                            step="1"
                            value={service.quantity}
                            onChange={(e) =>
                              handleServiceChange(index, serviceIndex, e)
                            }
                          />
                        </div>
                        <div className="deliverable-grid">
                          <div className="deliverable-field">
                            <label>Shift Start Time</label>

                            <input
                              type="time"
                              name="shiftStartTime"
                              value={service.shiftStartTime}
                              onChange={(e) =>
                                handleServiceChange(index, serviceIndex, e)
                              }
                            />
                          </div>

                          <div className="deliverable-field">
                            <label>Shift End Time</label>

                            <input
                              type="time"
                              name="shiftEndTime"
                              value={service.shiftEndTime}
                              onChange={(e) =>
                                handleServiceChange(index, serviceIndex, e)
                              }
                            />
                          </div>
                          <div className="deliverable-field">
                            <label>Contract Start Date</label>

                            <input
                              type="date"
                              name="contractStartDate"
                              value={
                                service.contractStartDate
                                  ? String(service.contractStartDate).slice(
                                      0,
                                      10,
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                handleServiceChange(index, serviceIndex, e)
                              }
                            />
                          </div>
                          <div className="deliverable-field">
                            <label>Contract End Date</label>

                            <input
                              type="date"
                              name="contractEndDate"
                              value={
                                service.contractEndDate
                                  ? String(service.contractEndDate).slice(0, 10)
                                  : ""
                              }
                              onChange={(e) =>
                                handleServiceChange(index, serviceIndex, e)
                              }
                            />
                          </div>
                        </div>
                        {/* </div> */}
                        <div className="deliverable-field deliverable-full">
                          <label className="onbdsaveslabel">Working Days</label>

                          <div className="working-days">
                            {[
                              { label: "MO", value: "Monday" },
                              { label: "TU", value: "Tuesday" },
                              { label: "WE", value: "Wednesday" },
                              { label: "TH", value: "Thursday" },
                              { label: "FR", value: "Friday" },
                              { label: "SA", value: "Saturday" },
                              { label: "SU", value: "Sunday" },
                            ].map((day) => (
                              <label key={day.value}>
                                <input
                                  type="checkbox"
                                  checked={(service.workingDays || []).includes(
                                    day.value,
                                  )}
                                  onChange={(e) =>
                                    handleWorkingDayChange(
                                      index,
                                      serviceIndex,
                                      day.value,
                                      e.target.checked,
                                    )
                                  }
                                />
                                {day.label}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="deliverable-action">
                      <button
                        type="button"
                        className="add-contract-btn"
                        onClick={addContractDeliverable}
                      >
                        + Add Client Contract Deliverable
                      </button>

                      {contractDeliverables.length > 1 && (
                        <button
                          type="button"
                          className="delete-contract-btn"
                          onClick={() => deleteContractDeliverable(index)}
                        >
                          Delete Client Contract Deliverable
                        </button>
                      )}
                    </div>

                    {index !== contractDeliverables.length - 1 && (
                      <div className="contract-divider"></div>
                    )}
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
