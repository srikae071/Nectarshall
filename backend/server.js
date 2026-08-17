require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itRequestRoutes = require("./routes/ItHrRequestRoutes");
const hrRequestRoutes = require("./routes/HrRequestRoutes");
const caseRoutes = require("./routes/caseRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const jobRequestRoutes = require("./routes/jobRequestRoutes");
const complianceRoutes = require("./routes/complianceRoutes");
const employeeRoutes = require("./routes/EmployeeRoutes");
const boardingCandidatesRoutes = require("./routes/BoardingCandidatesRoutes");
const mailRoutes = require("./routes/MailRoutes");
const assignmentGroupRoutes = require("./routes/assignmentGroupRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cases", caseRoutes);
app.use("/api/itrequests", itRequestRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/hrrequests", hrRequestRoutes);
app.use("/api/jobrequests", jobRequestRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/BoardingCandidates", boardingCandidatesRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/assignment-group", assignmentGroupRoutes);
// Middleware

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Routesdd
app.use("/api/cases", caseRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("HRMS Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
