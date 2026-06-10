const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    leaveNumber: String,
    employeeName: String,
    leaveType: String,
    startDate: String,
    endDate: String,
    totalLeaves: Number,
    halfDay: Boolean,
    description: String,
    status: {
      type: String,
      default: "Pending",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Leave", LeaveSchema);
