const mongoose = require("mongoose");

const HrRequestSchema = new mongoose.Schema(
  {
    incidentNumber: String,
    requester: String,
    requesterFor: String,
    category: String,
    subCategory: String,
    urgency: String,
    shortDescription: String,
    description: String,
    requesterName: String,
    department: {
      type: String,
      default: "HR",
    },

    status: {
      type: String,
      default: "Open",
    },

    assignmentGroup: {
      type: String,
      default: "",
    },

    assignTo: {
      type: String,
      default: "",
    },

    impact: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      default: "",
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("HrRequest", HrRequestSchema);
