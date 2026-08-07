import React, { useState, useEffect } from "react";
import CncLeftLayout from "../../../../Cnc/CncLeftLayout";
import DashboardLayout from "../../../../Dashboard/DashboardLayout";
import AccountsLayout from "../../../../Accounts/AccountsLayout";
import RegularForm from "../../../../../components/Layouts/FormLayouts/RegularForm";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchApiData, sendApiData } from "../../../../../utils/apiClient";

import "./index.css";

function OnBoardingSaves() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const source = location.state?.source || searchParams.get("source");
  const isOperations =
    source === "operations" || searchParams.get("source") === "operations";
  const isAccounts =
    source === "accounts" || searchParams.get("source") === "accounts";
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("Client Contract Deliverables");
  const [activeContractSubTabs, setActiveContractSubTabs] = useState({});

  const handleSubTabChange = (index, tabName) => {
    setActiveContractSubTabs((prev) => ({
      ...prev,
      [index]: tabName,
    }));
  };
  const [pageTitle, setPageTitle] = useState("");
  const [backendStatus, setBackendStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const Layout = isAccounts
    ? AccountsLayout
    : isOperations
    ? DashboardLayout
    : CncLeftLayout;

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
  const [initialFormData, setInitialFormData] = useState(null);
  const [initialContractDeliverables, setInitialContractDeliverables] =
    useState(null);
  const [initialFinancialDetails, setInitialFinancialDetails] = useState(null);
  const [entries, setEntries] = useState([]);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);

  const fetchBoarding = async () => {
    try {
      const response = await fetchApiData(`/api/BoardingCandidates/${id}`);
      const data = response.data;
      console.log(data.contractDeliverables);
      setBackendStatus(data.status);
      const rawEntries =
        data.entries ||
        (Array.isArray(data.contractDeliverables) &&
          data.contractDeliverables[0]?.entries) ||
        [];

      let parsedEntries = [];
      if (typeof rawEntries === "string") {
        try {
          parsedEntries = JSON.parse(rawEntries);
        } catch (e) {
          parsedEntries = [];
        }
      } else if (Array.isArray(rawEntries)) {
        parsedEntries = rawEntries;
      }
      setEntries(parsedEntries);

      const titleMap = {
        "Supplier Onboarding": "Onboarding Supplier",
        "Client Onboarding": "Onboarding Client",
        Request: "Business Management",
      };

      setPageTitle(titleMap[data.category] || "Onboarding");
      const loadedForm = {
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
        operationsClientApproved: data.operationsClientApproved ?? null,
        accountsApproved: data.accountsApproved ?? null,
        attachment: data.attachment || {
          fileName: "",
          filePath: "",
        },
      };

      setFormData(loadedForm);
      setInitialFormData(loadedForm);

      const loadedCd =
        data.contractDeliverables && data.contractDeliverables.length > 0
          ? JSON.parse(JSON.stringify(data.contractDeliverables))
          : [
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
            ];

      const loadedFin = data.financialDetails?.length
        ? JSON.parse(JSON.stringify(data.financialDetails))
        : [
            {
              contractId: "FIN-001",
              invoiceDate: "",
              invoiceNumber: "",
              billingCycle: "Monthly",
              comments: "",
            },
          ];

      setContractDeliverables(loadedCd);
      setInitialContractDeliverables(JSON.parse(JSON.stringify(loadedCd)));
      setFinancialDetails(loadedFin);
      setInitialFinancialDetails(JSON.parse(JSON.stringify(loadedFin)));

      let loadedEntries = [];
      if (data.entries) {
        try {
          loadedEntries =
            typeof data.entries === "string"
              ? JSON.parse(data.entries)
              : data.entries;
        } catch (e) {
          loadedEntries = [];
        }
      }
      if (!Array.isArray(loadedEntries)) loadedEntries = [];
      setEntries(loadedEntries);
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

    const lastFinId =
      financialDetails[financialDetails.length - 1]?.contractId || "FIN-000";
    const nextFinNumber = parseInt(lastFinId.replace("FIN-", ""), 10) + 1;

    setContractDeliverables((prev) => [
      ...prev,
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

    setFinancialDetails((prev) => [
      ...prev,
      {
        contractId: `FIN-${String(nextFinNumber).padStart(3, "0")}`,
        invoiceDate: "",
        invoiceNumber: "",
        billingCycle: "Monthly",
        comments: "",
      },
    ]);
  };

  const addFinancialDetail = () => {
    addContractDeliverable();
  };

  const deleteContractDeliverable = (index) => {
    if (contractDeliverables.length === 1) {
      alert("At least one Client Contract Variable is required.");
      return;
    }

    setContractDeliverables((prev) => prev.filter((_, i) => i !== index));
    setFinancialDetails((prev) => prev.filter((_, i) => i !== index));
  };
  const handleDeliverableChange = (index, e) => {
    const { name, value } = e.target;
    const updated = JSON.parse(JSON.stringify(contractDeliverables));
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
    const updated = JSON.parse(JSON.stringify(financialDetails));
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
      const updatedEntries = [...entries];
      const newEntry = {
        serialNo: updatedEntries.length + 1,
        timestamp: new Date().toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }),
        summary: "Operations status changed to Approved",
        changedBy: "admin",
      };
      updatedEntries.push(newEntry);
      const entriesString = JSON.stringify(updatedEntries);

      await sendApiData("PUT", `/api/BoardingCandidates/${id}`, {
        operationsClientApproved: true,
        entries: entriesString,
      });

      setFormData((prev) => ({
        ...prev,
        operationsClientApproved: true,
      }));
      setEntries(updatedEntries);

      alert("Approved Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async () => {
    try {
      const updatedEntries = [...entries];
      const newEntry = {
        serialNo: updatedEntries.length + 1,
        timestamp: new Date().toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }),
        summary: "Operations status changed to Rejected",
        changedBy: "admin",
      };
      updatedEntries.push(newEntry);
      const entriesString = JSON.stringify(updatedEntries);

      await sendApiData("PUT", `/api/BoardingCandidates/${id}`, {
        operationsClientApproved: false,
        entries: entriesString,
      });

      setFormData((prev) => ({
        ...prev,
        operationsClientApproved: false,
      }));
      setEntries(updatedEntries);

      alert("Rejected Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountsApprove = async () => {
    try {
      const updatedEntries = [...entries];
      const newEntry = {
        serialNo: updatedEntries.length + 1,
        timestamp: new Date().toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }),
        summary: "Accounts status changed to Approved",
        changedBy: "admin",
      };
      updatedEntries.push(newEntry);
      const entriesString = JSON.stringify(updatedEntries);

      await sendApiData("PUT", `/api/BoardingCandidates/${id}`, {
        accountsApproved: true,
        status: "Approved",
        entries: entriesString,
      });

      setFormData((prev) => ({
        ...prev,
        accountsApproved: true,
        status: "Approved",
      }));
      setEntries(updatedEntries);

      alert("Accounts Approved Successfully");
    } catch (error) {
      console.log(error);
      alert("Accounts Approval Failed");
    }
  };

  const handleAccountsReject = async () => {
    try {
      const updatedEntries = [...entries];
      const newEntry = {
        serialNo: updatedEntries.length + 1,
        timestamp: new Date().toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }),
        summary: "Accounts status changed to Rejected",
        changedBy: "admin",
      };
      updatedEntries.push(newEntry);
      const entriesString = JSON.stringify(updatedEntries);

      await sendApiData("PUT", `/api/BoardingCandidates/${id}`, {
        accountsApproved: false,
        status: "Rejected",
        entries: entriesString,
      });

      setFormData((prev) => ({
        ...prev,
        accountsApproved: false,
        status: "Rejected",
      }));
      setEntries(updatedEntries);

      alert("Accounts Rejected Successfully");
    } catch (error) {
      console.log(error);
      alert("Accounts Rejection Failed");
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
  const getWorkingDayObj = (workingDays, dayValue) => {
    if (!Array.isArray(workingDays)) return null;
    return workingDays.find((item) => {
      if (typeof item === "string") return item === dayValue;
      if (typeof item === "object" && item !== null)
        return item.day === dayValue;
      return false;
    });
  };

  const isWorkingDaySelected = (workingDays, dayValue) => {
    return Boolean(getWorkingDayObj(workingDays, dayValue));
  };

  const getWorkingDayTasks = (workingDays, dayValue) => {
    const obj = getWorkingDayObj(workingDays, dayValue);
    if (typeof obj === "object" && obj !== null && Array.isArray(obj.tasks)) {
      return obj.tasks;
    }
    return [];
  };

  const handleWorkingDayChange = (index, serviceIndex, dayValue, checked) => {
    const updated = JSON.parse(JSON.stringify(contractDeliverables));
    let days = updated[index].services[serviceIndex].workingDays || [];
    if (!Array.isArray(days)) days = [];

    if (checked) {
      const exists = days.some((d) =>
        typeof d === "string" ? d === dayValue : d?.day === dayValue,
      );
      if (!exists) {
        days.push({ day: dayValue, tasks: [] });
      }
    } else {
      days = days.filter((d) =>
        typeof d === "string" ? d !== dayValue : d?.day !== dayValue,
      );
    }

    updated[index].services[serviceIndex].workingDays = days;
    setContractDeliverables(updated);
  };

  const handleTaskChange = (
    index,
    serviceIndex,
    dayValue,
    taskName,
    checked,
  ) => {
    const updated = JSON.parse(JSON.stringify(contractDeliverables));
    let days = updated[index].services[serviceIndex].workingDays || [];
    if (!Array.isArray(days)) days = [];

    let dayObjIndex = days.findIndex((d) =>
      typeof d === "string" ? d === dayValue : d?.day === dayValue,
    );

    if (dayObjIndex === -1) {
      if (checked) {
        days.push({ day: dayValue, tasks: [taskName] });
      }
    } else {
      let existingItem = days[dayObjIndex];
      let tasks = [];
      if (
        typeof existingItem === "object" &&
        existingItem !== null &&
        Array.isArray(existingItem.tasks)
      ) {
        tasks = [...existingItem.tasks];
      }

      if (checked) {
        if (!tasks.includes(taskName)) tasks.push(taskName);
      } else {
        tasks = tasks.filter((t) => t !== taskName);
      }

      days[dayObjIndex] = { day: dayValue, tasks: tasks };
    }

    updated[index].services[serviceIndex].workingDays = days;
    setContractDeliverables(updated);
  };
  const fieldLabels = {
    clientId: "Client ID",
    companyName: "Company Name",
    abn: "ABN",
    acn: "ACN",
    companyAddress: "Company Address",
    companyPhone: "Company Phone",
    managingAgentName: "Managing Agent Name",
    managingAgentEmail: "Managing Agent Email",
    email: "Email",
    contactNumber: "Contact Number",
    onboardingDate: "Onboarding Date",
    validTill: "Valid Till",
    status: "Status",
    shortDescription: "Short Description",
    description: "Description",
  };

  const cdFieldLabels = {
    siteName: "site name",
    siteAddress: "site address",
    siteManagerName: "site manager name",
    siteEmail: "site email",
    siteMobile: "site mobile",
    contractState: "contract state",
    scopeOfWork: "scope of work",
    comments: "comments",
    numberOfServices: "number of services",
  };

  const finFieldLabels = {
    contractId: "contract ID",
    invoiceDate: "invoice date",
    invoiceNumber: "invoice number",
    billingCycle: "billing cycle",
    comments: "financial comments",
  };

  const handleSave = async () => {
    try {
      const changedDetails = [];

      // 1. Compare top-level form fields
      if (initialFormData) {
        Object.keys(fieldLabels).forEach((key) => {
          const oldVal = (initialFormData[key] || "").toString().trim();
          const newVal = (formData[key] || "").toString().trim();
          if (oldVal !== newVal) {
            changedDetails.push(`${fieldLabels[key]} changed`);
          }
        });
      }

      // 2. Compare Client Contract Deliverables per contract ID (e.g. CNT-001, CNT-002)
      if (
        Array.isArray(initialContractDeliverables) &&
        Array.isArray(contractDeliverables)
      ) {
        contractDeliverables.forEach((currCd, cIdx) => {
          const initCd = initialContractDeliverables[cIdx] || {};
          const contractId =
            currCd.clientId || currCd.contractId || `CNT-00${cIdx + 1}`;
          const cdChanges = [];

          // Compare basic contract fields
          Object.keys(cdFieldLabels).forEach((fieldKey) => {
            const oldVal = (initCd[fieldKey] || "").toString().trim();
            const newVal = (currCd[fieldKey] || "").toString().trim();
            if (oldVal !== newVal) {
              cdChanges.push(cdFieldLabels[fieldKey]);
            }
          });

          // Compare services array inside contract deliverable
          const currServices = Array.isArray(currCd.services)
            ? currCd.services
            : [];
          const initServices = Array.isArray(initCd.services)
            ? initCd.services
            : [];

          currServices.forEach((currSvc, sIdx) => {
            const initSvc = initServices[sIdx] || {};
            const svcChanges = [];

            [
              "serviceType",
              "position",
              "quantity",
              "shiftStartTime",
              "shiftEndTime",
            ].forEach((sKey) => {
              const oldVal = (initSvc[sKey] || "").toString().trim();
              const newVal = (currSvc[sKey] || "").toString().trim();
              if (oldVal !== newVal) {
                svcChanges.push(sKey);
              }
            });

            // Date comparisons
            const oldStart = (initSvc.contractStartDate || "")
              .toString()
              .slice(0, 10);
            const newStart = (currSvc.contractStartDate || "")
              .toString()
              .slice(0, 10);
            if (oldStart !== newStart) svcChanges.push("start date");

            const oldEnd = (initSvc.contractEndDate || "")
              .toString()
              .slice(0, 10);
            const newEnd = (currSvc.contractEndDate || "")
              .toString()
              .slice(0, 10);
            if (oldEnd !== newEnd) svcChanges.push("end date");

            // Working days & tasks comparison
            const oldDays = JSON.stringify(initSvc.workingDays || []);
            const newDays = JSON.stringify(currSvc.workingDays || []);
            if (oldDays !== newDays) svcChanges.push("working days/tasks");

            if (svcChanges.length > 0) {
              cdChanges.push(`Service ${sIdx + 1} (${svcChanges.join(", ")})`);
            }
          });

          if (cdChanges.length > 0) {
            changedDetails.push(
              `client contract deliverables client ID ${contractId} ${cdChanges.join(", ")} changed`,
            );
          }
        });
      }

      // 3. Compare Financial Deliverables per contract ID (e.g. FIN-001, FIN-002)
      if (
        Array.isArray(initialFinancialDetails) &&
        Array.isArray(financialDetails)
      ) {
        financialDetails.forEach((currFin, fIdx) => {
          const initFin = initialFinancialDetails[fIdx] || {};
          const contractId = currFin.contractId || `FIN-00${fIdx + 1}`;
          const finChanges = [];

          Object.keys(finFieldLabels).forEach((fieldKey) => {
            let oldVal = (initFin[fieldKey] || "").toString().trim();
            let newVal = (currFin[fieldKey] || "").toString().trim();
            if (fieldKey === "invoiceDate") {
              oldVal = oldVal.slice(0, 10);
              newVal = newVal.slice(0, 10);
            }
            if (oldVal !== newVal) {
              finChanges.push(finFieldLabels[fieldKey]);
            }
          });

          if (finChanges.length > 0) {
            changedDetails.push(
              `financial contract deliverables contract ID ${contractId} ${finChanges.join(", ")} changed`,
            );
          }
        });
      }

      let updatedEntries = [...entries];
      if (changedDetails.length > 0) {
        const newEntry = {
          serialNo: updatedEntries.length + 1,
          timestamp: new Date().toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          }),
          summary: changedDetails.join("; "),
          changedBy: "admin",
        };
        updatedEntries.push(newEntry);
      }

      const entriesString = JSON.stringify(updatedEntries);

      const updatedContractDeliverables = (contractDeliverables || []).map(
        (cd) => ({
          ...cd,
          entries: entriesString,
        }),
      );

      await sendApiData("PUT", `/api/BoardingCandidates/${id}`, {
        ...formData,
        contractDeliverables: updatedContractDeliverables,
        financialDetails,
        entries: entriesString,
      });
      setBackendStatus(formData.status);
      setEntries(updatedEntries);
      setInitialFormData({ ...formData });
      setInitialContractDeliverables(
        JSON.parse(JSON.stringify(contractDeliverables)),
      );
      setInitialFinancialDetails(JSON.parse(JSON.stringify(financialDetails)));

      alert("Saved Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  // const Layout =
  //   backendStatus === "On Boarded" ? DashboardLayout : CncLeftLayout;
  return (
    <Layout>
      <RegularForm
        title={pageTitle}
        onSave={handleSave}
        onCancel={() => {}}
        onAttachment={handleAttachment}
        attachmentName={formData.attachment?.fileName}
        // actions={
        //   <button
        //     type="button"
        //     className="entriesToggleBtn"
        //     onClick={() => setShowEntriesDropdown(!showEntriesDropdown)}
        //   >
        //     📋 Temporary Entries ({entries.length}) {showEntriesDropdown ? "▲" : "▼"}
        //   </button>
        // }
        formData={formData}
        approvalStatus={
          isAccounts
            ? formData.accountsApproved
            : isOperations
            ? formData.operationsClientApproved
            : null
        }
        onApprove={
          isOperations
            ? handleApprove
            : isAccounts
            ? handleAccountsApprove
            : undefined
        }
        onReject={
          isOperations
            ? handleReject
            : isAccounts
            ? handleAccountsReject
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

        <div className="form-row form-full entriesSection">
          <div className="entriesHeaderRow">
            <button
              type="button"
              className="entriesToggleBtn"
              onClick={() => setShowEntriesDropdown(!showEntriesDropdown)}
            >
              📋 Entries ({entries.length}) {showEntriesDropdown ? "▲" : "▼"}
            </button>
          </div>

          {showEntriesDropdown && (
            <div className="entriesCard">
              {entries.length === 0 ? (
                <p className="noEntriesText">No change entries recorded yet.</p>
              ) : (
                <div className="entriesList">
                  {entries.map((entry) => (
                    <div key={entry.serialNo} className="entryItem">
                      <span className="entryBadge">
                        Serial #{entry.serialNo}
                      </span>
                      <span className="entrySummary">{entry.summary}</span>
                      <span className="entryMeta">
                        changed by {entry.changedBy || "admin"} on{" "}
                        {entry.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
            {contractDeliverables.map((item, index) => {
              const currentTab =
                activeContractSubTabs[index] || "Client Contract Deliverables";
              const finItem = financialDetails[index] || {};

              return (
                <div className="contract-block-container" key={index}>
                  <div className="deliverable-tabs">
                    <button
                      type="button"
                      className={
                        currentTab === "Client Contract Deliverables"
                          ? "deliverable-tab active"
                          : "deliverable-tab"
                      }
                      onClick={() =>
                        handleSubTabChange(
                          index,
                          "Client Contract Deliverables",
                        )
                      }
                    >
                      Client Contract Variables
                    </button>

                    {!isOperations && (
                      <button
                        type="button"
                        className={
                          currentTab === "Financial Details"
                            ? "deliverable-tab active"
                            : "deliverable-tab"
                        }
                        onClick={() =>
                          handleSubTabChange(index, "Financial Details")
                        }
                      >
                        Financial Contract Variables
                      </button>
                    )}
                  </div>

                  {currentTab === "Client Contract Deliverables" && (
                    <div className="deliverable-form">
                      <h4 className="deliverable-section-heading">
                        Client Contract Variables
                      </h4>
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
                                <option value="Gardening">Gardening</option>
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

                                <option value="Site Manager">
                                  Site Manager
                                </option>
                                <option value="In Charge">
                                  Site In Charge
                                </option>
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
                                    ? String(service.contractEndDate).slice(
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
                          </div>

                          <div className="deliverable-field deliverable-full">
                            <label className="onbdsaveslabel">
                              Working Days & Tasks
                            </label>

                            <div className="vertical-working-days-grid">
                              {[
                                { label: "MO", value: "Monday" },
                                { label: "TU", value: "Tuesday" },
                                { label: "WE", value: "Wednesday" },
                                { label: "TH", value: "Thursday" },
                                { label: "FR", value: "Friday" },
                                { label: "SA", value: "Saturday" },
                                { label: "SU", value: "Sunday" },
                              ].map((day) => {
                                const isDayChecked = isWorkingDaySelected(
                                  service.workingDays,
                                  day.value,
                                );
                                const selectedTasks = getWorkingDayTasks(
                                  service.workingDays,
                                  day.value,
                                );

                                return (
                                  <div
                                    className="vertical-day-col"
                                    key={day.value}
                                  >
                                    <div className="vertical-day-header">
                                      <label className="day-header-label">
                                        <input
                                          type="checkbox"
                                          checked={isDayChecked}
                                          onChange={(e) =>
                                            handleWorkingDayChange(
                                              index,
                                              serviceIndex,
                                              day.value,
                                              e.target.checked,
                                            )
                                          }
                                        />
                                        <strong>{day.label}</strong>
                                        <span className="day-full-name">
                                          ({day.value})
                                        </span>
                                      </label>
                                    </div>

                                    <div className="vertical-task-list">
                                      {[
                                        "Task 1",
                                        "Task 2",
                                        "Task 3",
                                        "Task 4",
                                        "Task 5",
                                      ].map((taskName) => (
                                        <label
                                          className="task-checkbox-label"
                                          key={taskName}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={selectedTasks.includes(
                                              taskName,
                                            )}
                                            onChange={(e) =>
                                              handleTaskChange(
                                                index,
                                                serviceIndex,
                                                day.value,
                                                taskName,
                                                e.target.checked,
                                              )
                                            }
                                          />
                                          <span>{taskName}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isOperations && currentTab === "Financial Details" && (
                    <div className="deliverable-form">
                      <h4 className="deliverable-section-heading">
                        Financial Contract Variables
                      </h4>
                      <div className="deliverable-grid">
                        <div className="deliverable-field">
                          <label>Contract ID</label>
                          <input
                            name="contractId"
                            value={finItem.contractId || ""}
                            onChange={(e) => handleFinancialChange(index, e)}
                          />
                        </div>

                        <div className="deliverable-field">
                          <label>Hourly Rate ($)</label>
                          <input
                            type="text"
                            name="hourlyRate"
                            placeholder="e.g. 25.00"
                            value={finItem.hourlyRate || finItem.rate || ""}
                            onChange={(e) => handleFinancialChange(index, e)}
                          />
                        </div>

                        <div className="deliverable-field">
                          <label>Billing Cycle</label>

                          <select
                            name="billingCycle"
                            value={finItem.billingCycle || "Monthly"}
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
                            value={finItem.comments || ""}
                            onChange={(e) => handleFinancialChange(index, e)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="deliverable-action">
                    <button
                      type="button"
                      className="add-contract-btn"
                      onClick={addContractDeliverable}
                    >
                      + Add Client Contract Variable
                    </button>

                    {contractDeliverables.length > 1 && (
                      <button
                        type="button"
                        className="delete-contract-btn"
                        onClick={() => deleteContractDeliverable(index)}
                      >
                        Delete Client Contract Variable
                      </button>
                    )}
                  </div>

                  {index !== contractDeliverables.length - 1 && (
                    <div className="contract-divider"></div>
                  )}
                </div>
              );
            })}
          </>
        </div>

        {/* ENTRIES / CHANGE HISTORY LOGS */}
        <div className="onboardingEntriesSection" style={{ marginTop: "30px" }}>
          <div className="onboardingEntriesHeader" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px", background: "#f8fafc", padding: "12px 18px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              📋 Entries ({entries.length})
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
              History Log of all changes & updates
            </span>
          </div>

          {entries.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#64748b", fontSize: "13.5px" }}>
              No entries logged yet. Updates and status changes will appear here.
            </div>
          ) : (
            <div className="onboardingEntriesTableWrapper" style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #cbd5e1", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #cbd5e1", color: "#1e293b" }}>
                    <th style={{ padding: "12px 16px", width: "60px" }}>#</th>
                    <th style={{ padding: "12px 16px", width: "180px" }}>Timestamp</th>
                    <th style={{ padding: "12px 16px" }}>Summary of Changes</th>
                    <th style={{ padding: "12px 16px", width: "120px" }}>Changed By</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 16px", fontWeight: "600", color: "#64748b" }}>{entry.serialNo || idx + 1}</td>
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap", color: "#047857", fontWeight: "600" }}>📅 {entry.timestamp}</td>
                      <td style={{ padding: "12px 16px", color: "#334155" }}>{entry.summary}</td>
                      <td style={{ padding: "12px 16px", color: "#0f172a", fontWeight: "600" }}>👤 {entry.changedBy || "Admin"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </RegularForm>
    </Layout>
  );
}

export default OnBoardingSaves;
