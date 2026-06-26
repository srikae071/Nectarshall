const mongoose = require("mongoose");

const JobRequestSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
    },

    requesterName: String,
    department: String,
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

    modernSlavery: String,
    legalBarrier: String,
    medicalLimitations: String,
    workRights: String,

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
    taskId: String,
    taskType: String,
    taskStatus: {
      type: String,
      default: "Open",
    },
    taskId: String,
    laptopRecovered: String,
    laptopWorkingCondition: String,
    ItTAskStatus: String,
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("JobRequest", JobRequestSchema);
