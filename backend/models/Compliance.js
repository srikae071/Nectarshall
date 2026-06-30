const mongoose = require("mongoose");

const complianceSchema = new mongoose.Schema(
  {
    complianceNumber: {
      type: String,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    companyName: String,
    abn: String,
    acn: String,

    emailaddress: String,
    companyAddress: String,
    companyPhone: String,

    spocName: String,
    spocNumber: String,
    spocemailaddres: String,

    onboardingDate: Date,
    validtill: String,
    type: String,

    shortDescription: String,
    description: String,

    status: {
      type: String,
      default: "Draft",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Compliance", complianceSchema);
