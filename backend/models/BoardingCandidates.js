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
    // contractDeliverables: [
    //   {
    //     clientId: String,
    //     siteName: String,
    //     siteAddress: String,
    //     siteManagerName: String,
    //     siteEmail: String,
    //     siteMobile: String,
    //     contractState: String,
    //     adhoc: String,
    //     comments: String,
    //   },
    // ],

    // new code
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("BoardingCandidates", BoardingCandidatesSchema);
