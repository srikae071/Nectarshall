import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hrmsleftlayout from "../Hrmsleftlayout";
import RegularForm from "../../../components/Layouts/FormLayouts/RegularForm";
import { sendApiData } from "../../../utils/apiClient";
import { useAuth } from "../../../context/AuthContext";
import { FiShield, FiFileText, FiDollarSign, FiBriefcase } from "react-icons/fi";
import "./index.css";

function AddEmployee() {
  const navigate = useNavigate();
  // Section 2 Sub-tab state
  const [jobSecTab, setJobSecTab] = useState("JOB_INFO"); // 'JOB_INFO' | 'QUALIFICATIONS' | 'OFFER_LETTER' | 'FINANCIAL'

  const [formData, setFormData] = useState({
    // Identity
    displayName: "",
    firstName: "",
    lastName: "",
    userPrincipalName: "",
    userType: "Member",
    authorizationInfo: "",

    // Job Information
    jobTitle: "",
    companyName: "",
    department: "",
    subRole: "",
    employeeId: "",
    employeeType: "Full-Time",
    employeeHireDate: "",
    officeLocation: "",
    manager: "",
    sponsors: "",
    shiftStartTime: "08:00",
    shiftEndTime: "20:00",

    // Qualification & Licenses
    securityLicence: "",
    securityLicenceExpiry: "",
    drivingLicence: "",
    drivingLicenceExpiry: "",
    firstAid: "",
    firstAidExpiry: "",
    cpr: "",
    cprExpiry: "",
    workingWithChildren: "",
    wwccExpiry: "",
    trafficManagement: "",
    trafficManagementExpiry: "",
    whiteCard: "",
    yellowCard: "",

    // Offer Letter
    offerLetterUrl: "/policies/Sample_Offer_Letter.pdf",
    offerLetterTitle: "Standard Candidate Offer Letter (Sample)",
    offerLetterStatus: "Generated",

    // Financial & Tax Information
    bankName: "",
    bankAccountName: "",
    bsb: "",
    accountNumber: "",
    tfn: "",
    superNumber: "",
    superFund: "",
    superMemberNum: "",
    longServiceLeaveId: "",
    financialRemarks: "",

    // Contact Information (All 11 Original Fields Preserved)
    streetAddress: "",
    city: "",
    stateOrProvince: "",
    zipOrPostalCode: "",
    countryOrRegion: "",
    businessPhone: "",
    mobilePhone: "",
    email: "",
    otherEmails: "",
    faxNumber: "",
    mailNickname: "",

    // Candidate Origin & Descriptions
    shortDescription: "",
    description: "",
    barriers: "",

    // Parental Controls
    ageGroup: "Adult",
    consentProvidedForMinor: "No",

    // Settings & Account Status
    accountActive: true,
    accountStatus: "Active", // 'Active' | 'Inactive' | 'Pending'
    accountEnabled: true,
    usageLocation: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { reloadEmployees } = useAuth();

  const handleSave = async () => {
    if (!formData.displayName) {
      alert("Please fill in required field: Display Name.");
      return;
    }

    try {
      const isAdmin = formData.department === "Admin" || formData.subRole === "Admin";
      const isAct = formData.accountStatus === "Active";
      const payload = {
        ...formData,
        accountActive: isAct,
        accountEnabled: isAct,
        status: formData.accountStatus,
        employeeHireDate: formData.employeeHireDate || null,
        employeeName: formData.displayName,
        place: formData.officeLocation,
        subRole: formData.subRole || `${formData.department || "HR"} Manager`,
        ...(isAdmin ? { role: "ADMIN", extraRoles: ["Admin"] } : {}),
      };

      await sendApiData("POST", "/api/employees/create", payload);

      if (reloadEmployees) {
        await reloadEmployees();
      }

      alert(`Employee '${formData.displayName}' Created Successfully with status '${formData.accountStatus}'!`);
      navigate("/hrms/all-employees");
    } catch (error) {
      console.error("Error creating employee:", error);
      const msg = error.response?.data?.message || error.message || "Failed to create employee.";
      alert(`Failed to create employee: ${msg}`);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Hrmsleftlayout>
      <RegularForm
        title="Add Employee"
        onSave={handleSave}
        onCancel={handleCancel}
      >
        {/* SECTION 1: IDENTITY */}
        <div className="section-header-row">
          <h3 className="section-title">Identity</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Display Name *</label>
          <input
            className="form-input wideInput"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="e.g. Sumith Sir"
            required
            maxLength={100}
          />
        </div>

        <div className="form-row">
          <label className="form-label">First Name</label>
          <input
            className="form-input wideInput"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="e.g. Sumit"
            maxLength={100}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Last Name</label>
          <input
            className="form-input wideInput"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="e.g. Kumar"
            maxLength={100}
          />
        </div>

        <div className="form-row">
          <label className="form-label">User Principal Name</label>
          <input
            className="form-input wideInput"
            name="userPrincipalName"
            value={formData.userPrincipalName}
            onChange={handleChange}
            placeholder="e.g. sumit@company.com"
            maxLength={100}
          />
        </div>

        <div className="form-row">
          <label className="form-label">User Type</label>
          <select
            className="form-input wideInput"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="Member">Member</option>
            <option value="Guest">Guest</option>
            <option value="Contractor">Contractor</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Authorization Info</label>
          <textarea
            className="form-description-textarea"
            name="authorizationInfo"
            value={formData.authorizationInfo}
            onChange={handleChange}
            placeholder="Security Certificate / Authorization Details..."
          />
        </div>

        {/* SECTION 2: JOB INFORMATION WITH SUB-TAB RIBBON */}
        <div className="section-header-row jobSubTabHeaderRow">
          <div className="jobSubTabRibbon">
            <button
              type="button"
              className={`jobSubTabBtn ${jobSecTab === "JOB_INFO" ? "active" : ""}`}
              onClick={() => setJobSecTab("JOB_INFO")}
            >
              <FiBriefcase size={15} />
              <span>Job Information</span>
            </button>

            <button
              type="button"
              className={`jobSubTabBtn ${jobSecTab === "QUALIFICATIONS" ? "active" : ""}`}
              onClick={() => setJobSecTab("QUALIFICATIONS")}
            >
              <FiShield size={15} />
              <span>Qualification Licenses</span>
            </button>

            <button
              type="button"
              className={`jobSubTabBtn ${jobSecTab === "OFFER_LETTER" ? "active" : ""}`}
              onClick={() => setJobSecTab("OFFER_LETTER")}
            >
              <FiFileText size={15} />
              <span>Offer Letter</span>
            </button>

            <button
              type="button"
              className={`jobSubTabBtn ${jobSecTab === "FINANCIAL" ? "active" : ""}`}
              onClick={() => setJobSecTab("FINANCIAL")}
            >
              <FiDollarSign size={15} />
              <span>Financial & Tax Information</span>
            </button>
          </div>
        </div>

        {/* --- SUB-TAB 1: JOB INFORMATION FIELDS --- */}
        {jobSecTab === "JOB_INFO" && (
          <>
            <div className="form-row">
              <label className="form-label">Job Title</label>
              <input
                className="form-input wideInput"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Security Officer"
                maxLength={100}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Company Name</label>
              <input
                className="form-input wideInput"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Enhance Services"
                maxLength={100}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Department / Role *</label>
              <select
                className="form-input wideInput"
                name="department"
                value={formData.subRole || formData.department}
                onChange={(e) => {
                  const val = e.target.value;
                  let dept = val;
                  let sub = val;
                  if (val.startsWith("HR")) dept = "HR";
                  else if (val.startsWith("Operations")) dept = "Operations";
                  else if (val.startsWith("Accounts")) dept = "Accounts";
                  else if (val.startsWith("IT")) dept = "IT";
                  else if (val.startsWith("CNC")) dept = "CNC";
                  else if (val.startsWith("Patrolling")) dept = "Patrolling";
                  else if (val === "Admin") { dept = "Admin"; sub = "Admin"; }
                  else if (val === "End User") { dept = "End User"; sub = "End User"; }

                  setFormData({ ...formData, department: dept, subRole: sub });
                }}
              >
                <option value="">Select Department / Role</option>
                <option value="Admin">Admin</option>
                <option value="End User">End User</option>
                <option value="HR Manager">HR Manager</option>
                <option value="HR Coordinator">HR Coordinator</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Operations Coordinator">Operations Coordinator</option>
                <option value="Accounts Manager">Accounts Manager</option>
                <option value="Accounts Coordinator">Accounts Coordinator</option>
                <option value="IT Manager">IT Manager</option>
                <option value="IT Coordinator">IT Coordinator</option>
                <option value="CNC Manager">CNC Manager</option>
                <option value="CNC Coordinator">CNC Coordinator</option>
                <option value="Patrolling Manager">Patrolling Manager</option>
                <option value="Patrolling Coordinator">Patrolling Coordinator</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Employee ID</label>
              <input
                className="form-input wideInput"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="e.g. EMP-101"
                maxLength={100}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Employee Type</label>
              <select
                className="form-input wideInput"
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Casual">Casual</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Employee Hire Date</label>
              <input
                type="date"
                className="form-input wideInput"
                name="employeeHireDate"
                value={formData.employeeHireDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Office Location</label>
              <input
                className="form-input wideInput"
                name="officeLocation"
                value={formData.officeLocation}
                onChange={handleChange}
                placeholder="e.g. Melbourne Headquarters"
                maxLength={100}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Manager</label>
              <input
                className="form-input wideInput"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                maxLength={100}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Sponsors</label>
              <input
                className="form-input wideInput"
                name="sponsors"
                value={formData.sponsors}
                onChange={handleChange}
                placeholder="e.g. Client Partner"
                maxLength={100}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Shift Start Time</label>
              <input
                type="time"
                className="form-input wideInput"
                name="shiftStartTime"
                value={formData.shiftStartTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Shift End Time</label>
              <input
                type="time"
                className="form-input wideInput"
                name="shiftEndTime"
                value={formData.shiftEndTime}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* --- SUB-TAB 2: QUALIFICATION LICENSES (CLEAN 2-COLUMN GRID 6x2 FORMAT) --- */}
        {jobSecTab === "QUALIFICATIONS" && (
          <div className="qualificationsGrid2Col">
            {/* ROW 1 */}
            <div className="form-row">
              <label className="form-label">Security License</label>
              <input
                className="form-input wideInput"
                name="securityLicence"
                value={formData.securityLicence}
                onChange={handleChange}
                placeholder="e.g. SEC-9876543210 (15+ chars)"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Security License Expiry</label>
              <input
                type="date"
                className="form-input wideInput"
                name="securityLicenceExpiry"
                value={formData.securityLicenceExpiry}
                onChange={handleChange}
              />
            </div>

            {/* ROW 2 */}
            <div className="form-row">
              <label className="form-label">Driving License</label>
              <input
                className="form-input wideInput"
                name="drivingLicence"
                value={formData.drivingLicence}
                onChange={handleChange}
                placeholder="e.g. DL-998877665544 (15+ chars)"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Driving License Expiry</label>
              <input
                type="date"
                className="form-input wideInput"
                name="drivingLicenceExpiry"
                value={formData.drivingLicenceExpiry}
                onChange={handleChange}
              />
            </div>

            {/* ROW 3 */}
            <div className="form-row">
              <label className="form-label">First Aid Certificate</label>
              <input
                className="form-input wideInput"
                name="firstAid"
                value={formData.firstAid}
                onChange={handleChange}
                placeholder="e.g. HLTAID011 Senior Certificate"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">First Aid Expiry</label>
              <input
                type="date"
                className="form-input wideInput"
                name="firstAidExpiry"
                value={formData.firstAidExpiry}
                onChange={handleChange}
              />
            </div>

            {/* ROW 4 */}
            <div className="form-row">
              <label className="form-label">CPR Certificate</label>
              <input
                className="form-input wideInput"
                name="cpr"
                value={formData.cpr}
                onChange={handleChange}
                placeholder="e.g. HLTAID009 CPR Refresher"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">CPR Expiry</label>
              <input
                type="date"
                className="form-input wideInput"
                name="cprExpiry"
                value={formData.cprExpiry}
                onChange={handleChange}
              />
            </div>

            {/* ROW 5 */}
            <div className="form-row">
              <label className="form-label">Working With Children Check (WWCC)</label>
              <input
                className="form-input wideInput"
                name="workingWithChildren"
                value={formData.workingWithChildren}
                onChange={handleChange}
                placeholder="e.g. WWCC-1234567890 (15+ chars)"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">WWCC Expiry</label>
              <input
                type="date"
                className="form-input wideInput"
                name="wwccExpiry"
                value={formData.wwccExpiry}
                onChange={handleChange}
              />
            </div>

            {/* ROW 6 */}
            <div className="form-row">
              <label className="form-label">Traffic Management Ticket</label>
              <input
                className="form-input wideInput"
                name="trafficManagement"
                value={formData.trafficManagement}
                onChange={handleChange}
                placeholder="e.g. TMC-9988776655 (15+ chars)"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Traffic Management Expiry</label>
              <input
                type="date"
                className="form-input wideInput"
                name="trafficManagementExpiry"
                value={formData.trafficManagementExpiry}
                onChange={handleChange}
              />
            </div>

            {/* ROW 7 */}
            <div className="form-row">
              <label className="form-label">White Card (Construction Safety)</label>
              <input
                className="form-input wideInput"
                name="whiteCard"
                value={formData.whiteCard}
                onChange={handleChange}
                placeholder="e.g. WC-554433221100"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Yellow Card (EWP / High Risk)</label>
              <input
                className="form-input wideInput"
                name="yellowCard"
                value={formData.yellowCard}
                onChange={handleChange}
                placeholder="e.g. YC-776655443322"
                maxLength={100}
              />
            </div>
          </div>
        )}

        {/* --- SUB-TAB 3: SAMPLE OFFER LETTER --- */}
        {jobSecTab === "OFFER_LETTER" && (
          <div className="offerLetterContainerBox">
            <div className="offerHeaderMeta">
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>{formData.offerLetterTitle}</h4>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Status: {formData.offerLetterStatus}</span>
              </div>
              <a
                href={formData.offerLetterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="viewPdfBtnLink"
              >
                Open Offer Letter PDF
              </a>
            </div>

            <div className="pdfPreviewFrameBox">
              <iframe
                src={formData.offerLetterUrl}
                title="Sample Offer Letter"
                style={{ width: "100%", height: "420px", border: "none", borderRadius: "6px" }}
              />
            </div>
          </div>
        )}

        {/* --- SUB-TAB 4: FINANCIAL & TAX INFORMATION (CLEAN 2-COLUMN GRID 6x2 FORMAT) --- */}
        {jobSecTab === "FINANCIAL" && (
          <div className="financialGrid2Col">
            {/* ROW 1 */}
            <div className="form-row">
              <label className="form-label">Bank Name</label>
              <input
                className="form-input wideInput"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g. Commonwealth Bank of Australia (15+ chars)"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Bank Account Name</label>
              <input
                className="form-input wideInput"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                placeholder="e.g. Alexander Smith (15+ chars)"
                maxLength={100}
              />
            </div>

            {/* ROW 2 */}
            <div className="form-row">
              <label className="form-label">BSB Code</label>
              <input
                className="form-input wideInput"
                name="bsb"
                value={formData.bsb}
                onChange={handleChange}
                placeholder="e.g. 063-000 (6 digits)"
                maxLength={20}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Bank Account Number</label>
              <input
                className="form-input wideInput"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="e.g. 1098 7654 3210 (15+ chars)"
                maxLength={100}
              />
            </div>

            {/* ROW 3 */}
            <div className="form-row">
              <label className="form-label">Tax File Number (TFN)</label>
              <input
                className="form-input wideInput"
                name="tfn"
                value={formData.tfn}
                onChange={handleChange}
                placeholder="e.g. 987 654 321 (9 digits)"
                maxLength={50}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Superannuation Account Number</label>
              <input
                className="form-input wideInput"
                name="superNumber"
                value={formData.superNumber}
                onChange={handleChange}
                placeholder="e.g. SUP-9988776655 (15+ chars)"
                maxLength={100}
              />
            </div>

            {/* ROW 4 */}
            <div className="form-row">
              <label className="form-label">Super Fund Name</label>
              <input
                className="form-input wideInput"
                name="superFund"
                value={formData.superFund}
                onChange={handleChange}
                placeholder="e.g. AustralianSuper Industry Fund (15+ chars)"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Super Member Number</label>
              <input
                className="form-input wideInput"
                name="superMemberNum"
                value={formData.superMemberNum}
                onChange={handleChange}
                placeholder="e.g. MEM-1234567890 (15+ chars)"
                maxLength={100}
              />
            </div>

            {/* ROW 5 */}
            <div className="form-row">
              <label className="form-label">Long Service Leave ID (Optional)</label>
              <input
                className="form-input wideInput"
                name="longServiceLeaveId"
                value={formData.longServiceLeaveId}
                onChange={handleChange}
                placeholder="e.g. LSL-8847291039 (15+ chars)"
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Financial Remarks / Notes</label>
              <input
                className="form-input wideInput"
                name="financialRemarks"
                value={formData.financialRemarks}
                onChange={handleChange}
                placeholder="e.g. Standard weekly pay processing"
                maxLength={100}
              />
            </div>
          </div>
        )}

        {/* SECTION 3: CONTACT INFORMATION (ALL 11 ORIGINAL FIELDS PRESERVED) */}
        <div className="section-header-row" style={{ marginTop: "25px", padding: "12px 0 8px 0" }}>
          <h3 className="section-title" style={{ padding: "12px 0 8px 0" }}>Contact Information</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Street Address</label>
          <input
            className="form-input wideInput"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="Sydney"
          />
        </div>

        <div className="form-row">
          <label className="form-label">City</label>
          <input
            className="form-input wideInput"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Melbourne"
          />
        </div>

        <div className="form-row">
          <label className="form-label">State or Province</label>
          <input
            className="form-input wideInput"
            name="stateOrProvince"
            value={formData.stateOrProvince}
            onChange={handleChange}
            placeholder="e.g. VIC"
          />
        </div>

        <div className="form-row">
          <label className="form-label">ZIP or Postal Code</label>
          <input
            className="form-input wideInput"
            name="zipOrPostalCode"
            value={formData.zipOrPostalCode}
            onChange={handleChange}
            placeholder="e.g. 3000"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Country or Region</label>
          <input
            className="form-input wideInput"
            name="countryOrRegion"
            value={formData.countryOrRegion}
            onChange={handleChange}
            placeholder="e.g. Australia"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Business Phone</label>
          <input
            className="form-input wideInput"
            name="businessPhone"
            value={formData.businessPhone}
            onChange={handleChange}
            placeholder="e.g. +61 3 9000 0000"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Mobile Phone</label>
          <input
            className="form-input wideInput"
            name="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleChange}
            placeholder="e.g. +61 400 000 000"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input wideInput"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. employee@company.com"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Other Emails</label>
          <input
            className="form-input wideInput"
            name="otherEmails"
            value={formData.otherEmails}
            onChange={handleChange}
            placeholder="e.g. personal@email.com"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Fax Number</label>
          <input
            className="form-input wideInput"
            name="faxNumber"
            value={formData.faxNumber}
            onChange={handleChange}
            placeholder="e.g. +61 3 9000 0001"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Mail Nickname</label>
          <input
            className="form-input wideInput"
            name="mailNickname"
            value={formData.mailNickname}
            onChange={handleChange}
            placeholder="e.g. sumitk"
          />
        </div>

        {/* SECTION 4: PARENTAL CONTROLS */}
        <div className="section-header-row" style={{ marginTop: "25px" }}>
          <h3 className="section-title">Parental Controls</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Age Group</label>
          <select
            className="form-input wideInput"
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleChange}
          >
            <option value="Adult">Adult</option>
            <option value="Minor">Minor</option>
            <option value="Not Specified">Not Specified</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Consent Provided for Minor</label>
          <select
            className="form-input wideInput"
            name="consentProvidedForMinor"
            value={formData.consentProvidedForMinor}
            onChange={handleChange}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
            <option value="N/A">N/A</option>
          </select>
        </div>

        {/* SECTION 5: SETTINGS & ACCOUNT STATUS */}
        <div className="section-header-row" style={{ marginTop: "25px" }}>
          <h3 className="section-title">Settings</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Account Status *</label>
          <select
            className="form-input wideInput"
            name="accountStatus"
            value={formData.accountStatus}
            onChange={(e) => {
              const statusVal = e.target.value;
              const isAct = statusVal === "Active";
              setFormData((prev) => ({
                ...prev,
                accountStatus: statusVal,
                accountActive: isAct,
                accountEnabled: isAct,
              }));
            }}
            style={{
              fontWeight: "700",
              color:
                formData.accountStatus === "Active"
                  ? "#15803d"
                  : formData.accountStatus === "Pending"
                  ? "#b45309"
                  : "#dc2626",
            }}
          >
            <option value="Active">🟢 Active (Account Activated)</option>
            <option value="Pending">🟠 Pending (Awaiting HR Activation)</option>
            <option value="Inactive">🔴 Inactive (Disabled)</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Usage Location</label>
          <input
            className="form-input wideInput"
            name="usageLocation"
            value={formData.usageLocation}
            onChange={handleChange}
            placeholder="e.g. AU"
          />
        </div>
      </RegularForm>
    </Hrmsleftlayout>
  );
}

export default AddEmployee;
