const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    caseId: String,
    requesterName: String,
    department: String,
    status: String,
    subStatus: String,
    category: String,
    assignmentGroup: String,
    assignTo: String,
    impact: String,
    urgency: String,
    priority: String,
    shortDescription: String,
    description: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Case", caseSchema);
