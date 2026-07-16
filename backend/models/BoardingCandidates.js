const mongoose = require("mongoose");
const BoardingCandidatesSchema = new mongoose.Schema(
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

    operationsClientApproved: {
      type: Boolean,
      default: null,
    },

    status: {
      type: String,
      default: "Open",
    },

    attachment: {
      fileName: {
        type: String,
        default: "",
      },
      filePath: {
        type: String,
        default: "",
      },
    },
    contractDeliverables: [
      {
        clientId: {
          type: String,
          default: "",
        },

        siteName: {
          type: String,
          default: "",
        },

        siteAddress: {
          type: String,
          default: "",
        },

        siteManagerName: {
          type: String,
          default: "",
        },

        siteEmail: {
          type: String,
          default: "",
        },

        siteMobile: {
          type: String,
          default: "",
        },

        contractState: {
          type: String,
          default: "Active",
        },

        adhoc: {
          type: String,
          default: "No",
        },

        comments: {
          type: String,
          default: "",
        },

        numberOfServices: {
          type: Number,
          default: 1,
        },

        services: [
          {
            serviceType: {
              type: String,
              default: "",
            },

            position: {
              type: String,
              default: "",
            },

            quantity: {
              type: Number,
              default: 0,
            },

            shiftStartTime: {
              type: String,
              default: "",
            },

            shiftEndTime: {
              type: String,
              default: "",
            },
          },
        ],
      },
    ],
    financialDetails: [
      {
        contractId: {
          type: String,
          default: "",
        },

        invoiceDate: {
          type: Date,
          default: null,
        },

        invoiceNumber: {
          type: String,
          default: "",
        },

        billingCycle: {
          type: String,
          default: "Monthly",
        },

        comments: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("BoardingCandidates", BoardingCandidatesSchema);
