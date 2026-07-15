const mongoose = require("mongoose");
const BoardingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },

    clientId: String,
    SupplierId: String,
    BusinessId: String,
    SupplierType: String,
    companyName: String,
    requester: String,
    requesterFor: String,
    abn: String,

    acn: String,

    emailAddress: String,

    companyAddress: String,
    SupplierAgentName: String,
    SupplierAgentEmail: String,
    companyPhone: String,

    managingAgentName: String,

    managingAgentNumber: String,

    managingAgentEmail: String,

    onboardingDate: Date,

    validTill: Date,

    type: String,

    shortDescription: String,

    description: String,
    supplierType: String,
    attachment: String,
    operationsClientApproved: {
      type: Boolean,
      default: null,
    },

    status: {
      type: String,
      default: "Open",
    },
    contractDeliverables: [
      {
        clientId: String,
        siteName: String,
        siteAddress: String,
        siteManagerName: String,
        siteEmail: String,
        siteMobile: String,
        contractState: {
          type: String,
          default: "Active",
        },
        adhoc: {
          type: String,
          default: "No",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Boarding", BoardingSchema);
