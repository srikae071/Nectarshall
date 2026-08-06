import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hrmsleftlayout from "../../Hrmsleftlayout";
import RegularForm from "../../../../components/Layouts/FormLayouts/RegularForm";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";
import "./index.css";

function MainEmployeesSaves() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    employeeId: "",
    employeeType: "Full-Time",
    employeeHireDate: "",
    officeLocation: "",
    manager: "",
    sponsors: "",
    shiftStartTime: "08:00",
    shiftEndTime: "20:00",

    // Contact Information
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

    // Parental Controls
    ageGroup: "Adult",
    consentProvidedForMinor: "No",

    // Settings
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

          ageGroup: emp.ageGroup || "Adult",
          consentProvidedForMinor: emp.consentProvidedForMinor || "No",

          accountEnabled: emp.accountEnabled !== false,
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
      const payload = {
        ...formData,
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
          Loading employee details...
        </div>
      </Hrmsleftlayout>
    );
  }

  return (
    <Hrmsleftlayout>
      <RegularForm
        title={`Edit Employee - ${formData.displayName || "Employee Record"}`}
        onSave={handleSave}
        onCancel={handleCancel}
      >
        {/* SECTION 1: IDENTITY */}
        <div className="section-header-row">
          <h3 className="section-title">👤 Identity</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Display Name *</label>
          <input
            className="form-input"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="e.g. Sumit Kumar"
            required
          />
        </div>

        <div className="form-row">
          <label className="form-label">First Name</label>
          <input
            className="form-input"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="e.g. Sumit"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Last Name</label>
          <input
            className="form-input"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="e.g. Kumar"
          />
        </div>

        <div className="form-row">
          <label className="form-label">User Principal Name</label>
          <input
            className="form-input"
            name="userPrincipalName"
            value={formData.userPrincipalName}
            onChange={handleChange}
            placeholder="e.g. sumit@company.com"
          />
        </div>

        <div className="form-row">
          <label className="form-label">User Type</label>
          <select
            className="form-input"
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

        {/* SECTION 2: JOB INFORMATION */}
        <div className="section-header-row">
          <h3 className="section-title">💼 Job Information</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Job Title</label>
          <input
            className="form-input"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g. Security Officer"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Company Name</label>
          <input
            className="form-input"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Enhance Services"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Department</label>
          <input
            className="form-input"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g. Operations"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Employee ID</label>
          <input
            className="form-input"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="e.g. EMP-101"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Employee Type</label>
          <select
            className="form-input"
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
            className="form-input"
            name="employeeHireDate"
            value={formData.employeeHireDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Office Location</label>
          <input
            className="form-input"
            name="officeLocation"
            value={formData.officeLocation}
            onChange={handleChange}
            placeholder="e.g. Melbourne Headquarters"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Manager</label>
          <input
            className="form-input"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Sponsors</label>
          <input
            className="form-input"
            name="sponsors"
            value={formData.sponsors}
            onChange={handleChange}
            placeholder="e.g. Client Partner"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Shift Start Time</label>
          <input
            type="time"
            className="form-input"
            name="shiftStartTime"
            value={formData.shiftStartTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Shift End Time</label>
          <input
            type="time"
            className="form-input"
            name="shiftEndTime"
            value={formData.shiftEndTime}
            onChange={handleChange}
          />
        </div>

        {/* SECTION 3: CONTACT INFORMATION */}
        <div className="section-header-row">
          <h3 className="section-title">📞 Contact Information</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Street Address</label>
          <input
            className="form-input"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="e.g. 123 Main Street"
          />
        </div>

        <div className="form-row">
          <label className="form-label">City</label>
          <input
            className="form-input"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Melbourne"
          />
        </div>

        <div className="form-row">
          <label className="form-label">State or Province</label>
          <input
            className="form-input"
            name="stateOrProvince"
            value={formData.stateOrProvince}
            onChange={handleChange}
            placeholder="e.g. VIC"
          />
        </div>

        <div className="form-row">
          <label className="form-label">ZIP or Postal Code</label>
          <input
            className="form-input"
            name="zipOrPostalCode"
            value={formData.zipOrPostalCode}
            onChange={handleChange}
            placeholder="e.g. 3000"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Country or Region</label>
          <input
            className="form-input"
            name="countryOrRegion"
            value={formData.countryOrRegion}
            onChange={handleChange}
            placeholder="e.g. Australia"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Business Phone</label>
          <input
            className="form-input"
            name="businessPhone"
            value={formData.businessPhone}
            onChange={handleChange}
            placeholder="e.g. +61 3 9000 0000"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Mobile Phone</label>
          <input
            className="form-input"
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
            className="form-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. employee@company.com"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Other Emails</label>
          <input
            className="form-input"
            name="otherEmails"
            value={formData.otherEmails}
            onChange={handleChange}
            placeholder="e.g. personal@email.com"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Fax Number</label>
          <input
            className="form-input"
            name="faxNumber"
            value={formData.faxNumber}
            onChange={handleChange}
            placeholder="e.g. +61 3 9000 0001"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Mail Nickname</label>
          <input
            className="form-input"
            name="mailNickname"
            value={formData.mailNickname}
            onChange={handleChange}
            placeholder="e.g. sumitk"
          />
        </div>

        {/* SECTION 4: PARENTAL CONTROLS */}
        <div className="section-header-row">
          <h3 className="section-title">👨‍👩‍👧 Parental Controls</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Age Group</label>
          <select
            className="form-input"
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
            className="form-input"
            name="consentProvidedForMinor"
            value={formData.consentProvidedForMinor}
            onChange={handleChange}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
            <option value="N/A">N/A</option>
          </select>
        </div>

        {/* SECTION 5: SETTINGS */}
        <div className="section-header-row">
          <h3 className="section-title">⚙️ Settings</h3>
        </div>

        <div className="form-row">
          <label className="form-label">Account Enabled</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              id="accountEnabled"
              name="accountEnabled"
              checked={formData.accountEnabled}
              onChange={handleChange}
              style={{ width: "20px", height: "20px", cursor: "pointer", marginLeft: "60px" }}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Usage Location</label>
          <input
            className="form-input"
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