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
        contractId: String,
        siteName: String,
        siteAddress: String,
        siteManagerName: String,
        siteEmail: String,
        siteMobile: String,
        contractState: String,
        comments: String,
        attachment: String,
        type: String,
        numberOfServices: {
          type: Number,
          default: 1,
        },

        services: [
          {
            serviceType: String,
            position: String,
            quantity: Number,
            shiftStartTime: String,
            shiftEndTime: String,
          },
        ],
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
