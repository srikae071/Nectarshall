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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ItHrRequest", ItHrRequestSchema);
