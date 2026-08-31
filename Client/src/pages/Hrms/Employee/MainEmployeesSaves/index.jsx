import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hrmsleftlayout from "../../Hrmsleftlayout";
import RegularForm from "../../../../components/Layouts/FormLayouts/RegularForm";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";
import { FiShield, FiFileText, FiDollarSign, FiBriefcase } from "react-icons/fi";
import "./index.css";

function MainEmployeesSaves() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (id) {
      loadEmployeeDetails();
    }
  }, [id]);

  const loadEmployeeDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData(`/api/employees/${id}`);
      const emp = res.data;
      if (emp) {
        let statusVal = emp.accountStatus || emp.status || "Active";
        if (!emp.accountStatus) {
          if (emp.status === "Pending") statusVal = "Pending";
          else if (emp.accountActive === false || emp.accountEnabled === false) statusVal = "Inactive";
          else statusVal = "Active";
        }

        setFormData({
          displayName: emp.displayName || emp.employeeName || "",
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          userPrincipalName: emp.userPrincipalName || "",
          userType: emp.userType || "Member",
          authorizationInfo: emp.authorizationInfo || "",

          jobTitle: emp.jobTitle || "",
          companyName: emp.companyName || "",
          department: emp.department || "",
          subRole: emp.subRole || "",
          employeeId: emp.employeeId || "",
          employeeType: emp.employeeType || "Full-Time",
          employeeHireDate: emp.employeeHireDate ? emp.employeeHireDate.slice(0, 10) : "",
          officeLocation: emp.officeLocation || emp.place || "",
          manager: emp.manager || "",
          sponsors: emp.sponsors || "",
          shiftStartTime: emp.shiftStartTime || "08:00",
          shiftEndTime: emp.shiftEndTime || "20:00",

          streetAddress: emp.streetAddress || "",
          city: emp.city || "",
          stateOrProvince: emp.stateOrProvince || "",
          zipOrPostalCode: emp.zipOrPostalCode || "",
          countryOrRegion: emp.countryOrRegion || "",
          businessPhone: emp.businessPhone || "",
          mobilePhone: emp.mobilePhone || "",
          email: emp.email || "",
          otherEmails: emp.otherEmails || "",
          faxNumber: emp.faxNumber || "",
          mailNickname: emp.mailNickname || "",

          securityLicence: emp.securityLicence || "",
          securityLicenceExpiry: emp.securityLicenceExpiry ? emp.securityLicenceExpiry.slice(0, 10) : "",
          drivingLicence: emp.drivingLicence || "",
          drivingLicenceExpiry: emp.drivingLicenceExpiry ? emp.drivingLicenceExpiry.slice(0, 10) : "",
          firstAid: emp.firstAid || "",
          firstAidExpiry: emp.firstAidExpiry ? emp.firstAidExpiry.slice(0, 10) : "",
          cpr: emp.cpr || "",
          cprExpiry: emp.cprExpiry ? emp.cprExpiry.slice(0, 10) : "",
          workingWithChildren: emp.workingWithChildren || "",
          wwccExpiry: emp.wwccExpiry ? emp.wwccExpiry.slice(0, 10) : "",
          trafficManagement: emp.trafficManagement || "",
          trafficManagementExpiry: emp.trafficManagementExpiry ? emp.trafficManagementExpiry.slice(0, 10) : "",
          whiteCard: emp.whiteCard || "",
          yellowCard: emp.yellowCard || "",

          offerLetterUrl: emp.offerLetterUrl || "/policies/Sample_Offer_Letter.pdf",
          offerLetterTitle: emp.offerLetterTitle || "Standard Candidate Offer Letter (Sample)",
          offerLetterStatus: emp.offerLetterStatus || "Generated",

          bankName: emp.bankName || "",
          bankAccountName: emp.bankAccountName || "",
          bsb: emp.bsb || "",
          accountNumber: emp.accountNumber || "",
          tfn: emp.tfn || "",
          superNumber: emp.superNumber || "",
          superFund: emp.superFund || "",
          superMemberNum: emp.superMemberNum || "",
          longServiceLeaveId: emp.longServiceLeaveId || "",
          financialRemarks: emp.financialRemarks || "",

          shortDescription: emp.shortDescription || "",
          description: emp.description || "",
          barriers: emp.barriers || "",

          ageGroup: emp.ageGroup || "Adult",
          consentProvidedForMinor: emp.consentProvidedForMinor || "No",

          accountStatus: statusVal,
          accountActive: statusVal === "Active",
          accountEnabled: statusVal === "Active",
          usageLocation: emp.usageLocation || "",
        });
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      alert("Failed to load employee details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      alert("Display Name is required!");
      return;
    }

    try {
      const isAct = formData.accountStatus === "Active";
      const payload = {
        ...formData,
        accountActive: isAct,
        accountEnabled: isAct,
        accountStatus: formData.accountStatus,
        status: formData.accountStatus,
        employeeHireDate: formData.employeeHireDate || null,
        employeeName: formData.displayName,
        place: formData.officeLocation,
      };

      await sendApiData("PUT", `/api/employees/${id}`, payload);

      alert("Employee Details Updated Successfully!");
      navigate("/hrms/all-employees");
    } catch (error) {
      console.error("Error updating employee:", error);
      const msg = error.response?.data?.message || error.message || "Failed to update employee.";
      alert(`Update Failed: ${msg}`);
    }
  };

  const handleCancel = () => {
    navigate("/hrms/all-employees");
  };

  if (loading) {
    return (
      <Hrmsleftlayout>
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          Loading employee profile...
        </div>
      </Hrmsleftlayout>
    );
  }

  return (
    <Hrmsleftlayout>
      <RegularForm
        title="Edit Employee Profile"
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
              <span>💼 Job Information</span>
            </button>

            <button
              type="button"
              className={`jobSubTabBtn ${jobSecTab === "QUALIFICATIONS" ? "active" : ""}`}
              onClick={() => setJobSecTab("QUALIFICATIONS")}
            >
              <FiShield size={15} />
              <span>🛡️ Qualification Licenses</span>
            </button>

            <button
              type="button"
              className={`jobSubTabBtn ${jobSecTab === "OFFER_LETTER" ? "active" : ""}`}
              onClick={() => setJobSecTab("OFFER_LETTER")}
            >
              <FiFileText size={15} />
              <span>📄 Offer Letter</span>
            </button>

            <button
              type="button"
              className={`jobSubTabBtn ${jobSecTab === "FINANCIAL" ? "active" : ""}`}
              onClick={() => setJobSecTab("FINANCIAL")}
            >
              <FiDollarSign size={15} />
              <span>💳 Financial & Tax Information</span>
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
                maxLength={100}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Department / Role</label>
              <input
                className="form-input wideInput"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Employee ID</label>
              <input
                className="form-input wideInput"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
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
                placeholder="License Number (15+ chars)"
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
                placeholder="Driver License Number"
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
                placeholder="Bank Name (15+ chars)"
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
                placeholder="Account Holder Name"
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
                placeholder="6-digit BSB"
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
                placeholder="Account Number (15+ chars)"
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
                placeholder="9-digit TFN"
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
                placeholder="Super Account ID"
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
                placeholder="Super Fund Name"
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
                placeholder="Super Member ID"
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
                placeholder="LSL ID"
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
                placeholder="Financial Remarks"
                maxLength={100}
              />
            </div>
          </div>
        )}

        {/* SECTION 3: CONTACT INFORMATION (ALL 11 ORIGINAL FIELDS PRESERVED) */}
        <div className="section-header-row" style={{ marginTop: "25px" }}>
          <h3 className="section-title">📞 Contact Information</h3>
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
          <h3 className="section-title">👨‍👩‍👧 Parental Controls</h3>
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
          <h3 className="section-title">⚙️ Settings</h3>
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

export default MainEmployeesSaves;