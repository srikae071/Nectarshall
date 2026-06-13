const mongoose = require("mongoose");

const ItHrRequestSchema = new mongoose.Schema(
  {
    incidentNumber: String,
    requester: String,
    requesterFor: String,
    category: String,
    subCategory: String,
    urgency: String,
    shortDescription: String,
    description: String,
    workNotes: String,

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
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ItHrRequest", ItHrRequestSchema);
