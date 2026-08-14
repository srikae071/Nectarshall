const mongoose = require("mongoose");

const AssignmentGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      default: "Assignment Group",
    },
    description: {
      type: String,
      default: "Centralized assignment group schema with sub-tables for IT, HR, and Accounts",
    },

    // IT SUB-TABLE DOCUMENT COLLECTION
    itTable: [
      {
        ticketNumber: { type: String, default: "" },
        requester: { type: String, default: "" },
        category: { type: String, default: "IT Support" },
        shortDescription: { type: String, default: "" },
        description: { type: String, default: "" },
        priority: { type: String, default: "Medium" },
        assignedTo: { type: String, default: "Unassigned" },
        status: { type: String, default: "Open" },
        createdDate: { type: Date, default: Date.now },
      },
    ],

    // HR SUB-TABLE DOCUMENT COLLECTION
    hrTable: [
      {
        ticketNumber: { type: String, default: "" },
        requester: { type: String, default: "" },
        category: { type: String, default: "HR Support" },
        shortDescription: { type: String, default: "" },
        description: { type: String, default: "" },
        priority: { type: String, default: "Medium" },
        assignedTo: { type: String, default: "Unassigned" },
        status: { type: String, default: "Open" },
        createdDate: { type: Date, default: Date.now },
      },
    ],

    // ACCOUNTS SUB-TABLE DOCUMENT COLLECTION
    accountsTable: [
      {
        ticketNumber: { type: String, default: "" },
        requester: { type: String, default: "" },
        category: { type: String, default: "Accounts & Payroll" },
        shortDescription: { type: String, default: "" },
        description: { type: String, default: "" },
        priority: { type: String, default: "Medium" },
        assignedTo: { type: String, default: "Unassigned" },
        status: { type: String, default: "Open" },
        createdDate: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("AssignmentGroup", AssignmentGroupSchema);
