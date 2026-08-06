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
    entries: mongoose.Schema.Types.Mixed,

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
        entries: {
          type: String,
          default: "",
        },

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
        scopeOfWork: {
          type: String,
          default: "",
        },

        numberOfServices: {
          type: Number,
          default: 1,
        },

        services: [
          {
            employee: {
              type: String,
              default: "",
            },
            assignedEmployees: [
              {
                employee: {
                  type: String,
                  default: "",
                },
                isYellow: {
                  type: Boolean,
                  default: false,
                },
                isUpdated: {
                  type: Boolean,
                  default: false,
                },
                approvalState: {
                  type: String,
                  default: "Pending",
                },
                actualStartTime: {
                  type: String,
                  default: "",
                },
                actualEndTime: {
                  type: String,
                  default: "",
                },
                isSubmitted: {
                  type: Boolean,
                  default: false,
                },
                timeSheatsApproved: {
                  type: Boolean,
                  default: false,
                },
                scopeOfWork: {
                  type: String,
                  default: "",
                },
                mealTime: {
                  type: String,
                  default: "30 mins",
                },
                assignedDate: {
                  type: String,
                  default: "",
                },
              },
            ],

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
            contractStartDate: {
              type: Date,
              default: null,
            },

            contractEndDate: {
              type: Date,
              default: null,
            },
            workingDays: {
              type: mongoose.Schema.Types.Mixed,
              default: [],
            },
            mealTime: {
              type: String,
              default: "30 mins",
            },
          },
        ],
        adhocServices: [
          {
            adhocId: {
              type: String,
              default: "",
            },

            serviceType: {
              type: String,
              default: "",
            },

            position: {
              type: String,
              default: "",
            },

            shiftStartTime: {
              type: String,
              default: "",
            },

            shiftEndTime: {
              type: String,
              default: "",
            },
            mealTime: {
              type: String,
              default: "30 mins",
            },

            serviceDate: {
              type: Date,
              default: null,
            },

            employee: {
              type: String,
              default: "",
            },

            approvalState: {
              type: String,
              default: "Pending",
            },

            isYellow: {
              type: Boolean,
              default: false,
            },

            actualStartTime: {
              type: String,
              default: "",
            },

            actualEndTime: {
              type: String,
              default: "",
            },
            scopeOfWork: {
              type: String,
              default: "",
            },
            isSubmitted: {
              type: Boolean,
              default: false,
            },
            timeSheatsApproved: {
              type: Boolean,
              default: false,
            },
            timesheetApproved: {
              type: Boolean,
              default: false,
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
