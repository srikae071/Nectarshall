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

    // 4. Qualification & Licenses
    securityLicence: { type: String, default: "" },
    securityLicenceExpiry: { type: String, default: "" },
    drivingLicence: { type: String, default: "" },
    drivingLicenceExpiry: { type: String, default: "" },
    firstAid: { type: String, default: "" },
    firstAidExpiry: { type: String, default: "" },
    cpr: { type: String, default: "" },
    cprExpiry: { type: String, default: "" },
    workingWithChildren: { type: String, default: "" },
    wwccExpiry: { type: String, default: "" },
    trafficManagement: { type: String, default: "" },
    trafficManagementExpiry: { type: String, default: "" },
    whiteCard: { type: String, default: "" },
    yellowCard: { type: String, default: "" },

    // 5. Offer Letter
    offerLetterUrl: { type: String, default: "" },
    offerLetterTitle: { type: String, default: "" },
    offerLetterStatus: { type: String, default: "Generated" },

    // 6. Financial & Tax Information
    bankName: { type: String, default: "" },
    bankAccountName: { type: String, default: "" },
    bsb: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    tfn: { type: String, default: "" },
    superNumber: { type: String, default: "" },
    superFund: { type: String, default: "" },
    superMemberNum: { type: String, default: "" },
    longServiceLeaveId: { type: String, default: "" },

    // Candidate Origin & Descriptions
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    barriers: { type: String, default: "" },
    candidateId: { type: String, default: "" },

    // 7. Parental Controls
    ageGroup: { type: String, default: "Adult" },
    consentProvidedForMinor: { type: String, default: "No" },

    // 8. Settings & Account Status
    accountActive: { type: Boolean, default: true },
    accountStatus: { type: String, default: "Active" }, // 'Active' | 'Inactive' | 'Pending'
    status: { type: String, default: "Active" },
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
  if (this.accountStatus) {
    if (this.accountStatus === "Active") {
      this.accountActive = true;
      this.accountEnabled = true;
      this.status = "Active";
    } else if (this.accountStatus === "Pending") {
      this.accountActive = false;
      this.accountEnabled = false;
      this.status = "Pending";
    } else {
      this.accountActive = false;
      this.accountEnabled = false;
      this.status = "Inactive";
    }
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
