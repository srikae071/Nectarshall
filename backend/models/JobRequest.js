const mongoose = require("mongoose");

const JobRequestSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
    },

    requesterName: String,

    category: String,

    status: {
      type: String,
      default: "Pending",
    },
    department: String,
    impact: String,
    urgency: String,
    priority: String,

    firstName: String,
    lastName: String,
    preferredName: String,
    email: String,
    contactNumber: String,

    candidates: [
      {
        candidateId: { type: String },
        name: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        contactNumber: { type: String },
        phone: { type: String },
        submitted: { type: Boolean, default: false },
        submittedAt: { type: Date },

        modernSlaveryCandidateForm: String,
        legalBarrierCandidateForm: String,
        medicalLimitationsCandidateForm: String,
        workRightsCandidateForm: String,

        modernSlaveryResult: String,
        legalBarrierResult: String,
        medicalLimitationsResult: String,
        workRightsResult: String,

        securityLicence: String,
        securityLicenceExpiry: Date,
        securityLicenceCandidateForm: String,
        securityLicenceResult: String,

        drivingLicence: String,
        drivingLicenceExpiry: Date,
        drivingLicenceCandidateForm: String,
        drivingLicenceResult: String,

        firstAid: String,
        firstAidExpiry: Date,
        firstAidCandidateForm: String,
        firstAidResult: String,

        cpr: String,
        cprExpiry: Date,
        cprCandidateForm: String,
        cprResult: String,

        workingWithChildren: String,
        workingWithChildrenExpiry: Date,
        workingWithChildrenCandidateForm: String,
        workingWithChildrenResult: String,

        trafficManagement: String,
        trafficManagementExpiry: Date,
        trafficManagementCandidateForm: String,
        trafficManagementResult: String,

        whiteCard: String,
        whiteCardExpiry: Date,
        whiteCardCandidateForm: String,
        whiteCardResult: String,

        yellowCard: String,
        yellowCardExpiry: Date,
        yellowCardCandidateForm: String,
        yellowCardResult: String,

        bankName: String,
        bankAccount: String,
        bsb: String,
        taxFileNumber: String,
        superFundName: String,
        superMemberNumber: String,
        longServiceLeaveId: String,
      },
    ],

    modernSlavery: String,
    legalBarrier: String,
    medicalLimitations: String,
    workRights: String,
    modernSlaveryResult: String,
    legalBarrierResult: String,
    medicalLimitationsResult: String,
    workRightsResult: String,
    securityLicence: String,
    securityLicenceExpiry: Date,

    drivingLicence: String,
    drivingLicenceExpiry: Date,

    firstAid: String,
    firstAidExpiry: Date,

    cpr: String,
    cprExpiry: Date,

    workingWithChildren: String,
    workingWithChildrenExpiry: Date,

    trafficManagement: String,
    trafficManagementExpiry: Date,

    whiteCard: String,
    whiteCardExpiry: Date,

    yellowCard: String,
    yellowCardExpiry: Date,

    interview: String,

    shortDescription: String,
    description: String,
    offerStatus: String,

    bankName: String,
    bankAccount: String,
    bsb: String,
    taxFileNumber: String,

    superFundName: String,
    superMemberNumber: String,

    longServiceLeaveId: String,

    confidentialityAgreement: String,
    contract: String,
    handbookWhs: String,
    handbookEmployment: String,
    skillSet: String,
    experience: String,
    requestType: String,
    candidateCompleted: {
      type: Boolean,
      default: false,
    },
    securityLicenceResult: String,
    drivingLicenceResult: String,
    firstAidResult: String,
    cprResult: String,
    workingWithChildrenResult: String,
    trafficManagementResult: String,
    whiteCardResult: String,
    yellowCardResult: String,

    modernSlaveryCandidateForm: String,
    legalBarrierCandidateForm: String,
    medicalLimitationsCandidateForm: String,
    workRightsCandidateForm: String,

    securityLicenceCandidateForm: String,
    drivingLicenceCandidateForm: String,
    firstAidCandidateForm: String,
    cprCandidateForm: String,
    workingWithChildrenCandidateForm: String,
    trafficManagementCandidateForm: String,
    whiteCardCandidateForm: String,
    yellowCardCandidateForm: String,
    offerRLetterReleaseeDate: Date,

    resignationDate: Date,
    lastWorkingDay: Date,
    resignationReason: String,

    requester: String,
    requesterFor: String,

    taskType: String,
    taskStatus: {
      type: String,
      default: "Open",
    },
    taskId: String,
    laptopRecord: String,
    laptopRecovered: String,
    laptopWorkingCondition: String,
    dataBackup: String,
    emailIdReceived: String,
    ItTAskStatus: String,

    approvalStatus: {
      type: String,
      default: "Pending",
    },
    itClearanceStatus: {
      type: String,
      default: "Open",
    },
    financeClearanceStatus: {
      type: String,
      default: "Open",
    },
    adminClearanceStatus: {
      type: String,
      default: "Open",
    },
    hrClearanceStatus: {
      type: String,
      default: "Open",
    },
    relievingLetterIssued: {
      type: String,
      default: "No",
    },
    backupHired: {
      type: String,
      default: "No",
    },
    itStatus: String,
    financeStatus: String,
    adminStatus: String,
    hrStatus: String,

    approvedAt: Date,
    approvedBy: String,
    itStatusUpdatedAt: Date,
    itStatusUpdatedBy: String,
    itDetailsUpdatedAt: Date,
    financeStatusUpdatedAt: Date,
    financeStatusUpdatedBy: String,
    hrStatusUpdatedAt: Date,
    hrStatusUpdatedBy: String,
    timeline: [
      {
        action: String,
        module: { type: String, default: "HRMS" },
        performedBy: String,
        timestamp: { type: Date, default: Date.now },
        details: String,
        status: String,
      },
    ],

    onboardingTaskId: {
      type: String,
      default: "",
    },

    onboardingStatus: {
      type: String,
      default: "Pending",
    },
    onboardingCompleted: {
      type: Boolean,
      default: null,
    },

    azureAccountCreated: {
      type: Boolean,
      default: null,
    },

    laptopIssued: {
      type: Boolean,
      default: null,
    },
    requestonbordingstatus: String,
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("JobRequest", JobRequestSchema);
