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
  },
  { timestamps: true },
);

module.exports = mongoose.model("HrRequest", HrRequestSchema);
