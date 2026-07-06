const mongoose = require("mongoose");
const BoardingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "Supplier Onboarding",
    },

    clientId: String,

    companyName: String,

    abn: String,

    acn: String,

    emailAddress: String,

    companyAddress: String,

    companyPhone: String,

    managingAgentName: String,

    managingAgentNumber: String,

    managingAgentEmail: String,

    onboardingDate: Date,

    validTill: Date,

    type: String,

    shortDescription: String,

    description: String,

    contractDeliverables: [
      {
        contractId: String,
        siteName: String,
        siteAddress: String,
        siteManagerName: String,
        siteEmail: String,
        siteMobile: String,
        contractState: String,
        comments: String,
        attachment: String,
      },
    ],

    financialDetails: [
      {
        contractId: String,
        invoiceDate: Date,
        invoiceNumber: String,
        billingCycle: String,
        comments: String,
        attachment: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Boarding", BoardingSchema);
