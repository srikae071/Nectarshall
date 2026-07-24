const mongoose = require("mongoose");
const EmployeeSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      default: "",
    },
    shiftStartTime: {
      type: String,
      default: "08:00",
    },
    shiftEndTime: {
      type: String,
      default: "20:00",
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Employee", EmployeeSchema);
