const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    // 1. Identity
    displayName: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    userPrincipalName: { type: String, default: "" },
    userType: { type: String, default: "Member" },
    authorizationInfo: { type: String, default: "" },

    // 2. Job Information
    jobTitle: { type: String, default: "" },
    companyName: { type: String, default: "" },
    department: { type: String, default: "" },
    employeeId: { type: String, default: "" },
    employeeType: { type: String, default: "Full-Time" },
    employeeHireDate: { type: Date, default: null },
    officeLocation: { type: String, default: "" },
    manager: { type: String, default: "" },
    sponsors: { type: String, default: "" },
    shiftStartTime: { type: String, default: "08:00" },
    shiftEndTime: { type: String, default: "20:00" },
    extraRoles: { type: [String], default: [] },
    ExtaRoles: { type: String, default: "" },
    subRole: { type: String, default: "" },

    // 3. Contact Information
    streetAddress: { type: String, default: "" },
    city: { type: String, default: "" },
    stateOrProvince: { type: String, default: "" },
    zipOrPostalCode: { type: String, default: "" },
    countryOrRegion: { type: String, default: "" },
    businessPhone: { type: String, default: "" },
    mobilePhone: { type: String, default: "" },
    email: { type: String, default: "" },
    otherEmails: { type: String, default: "" },
    faxNumber: { type: String, default: "" },
    mailNickname: { type: String, default: "" },

    // 4. Parental Controls
    ageGroup: { type: String, default: "Adult" },
    consentProvidedForMinor: { type: String, default: "No" },

    // 5. Settings
    accountEnabled: { type: Boolean, default: true },
    usageLocation: { type: String, default: "" },

    // Backward compatibility helper
    employeeName: { type: String, default: "" },
    place: { type: String, default: "" },
  },
  { timestamps: true },
);

// Pre-save middleware to keep employeeName and place synced if missing
EmployeeSchema.pre("save", function () {
  if (!this.employeeName && this.displayName) {
    this.employeeName = this.displayName;
  }
  if (!this.place && this.officeLocation) {
    this.place = this.officeLocation;
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
