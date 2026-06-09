require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itRequestRoutes = require("./routes/ItHrRequestRoutes");

const caseRoutes = require("./routes/caseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cases", caseRoutes);
app.use("/api/itrequests", itRequestRoutes);

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

// Routes
app.use("/api/cases", caseRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("HRMS Backend Running");
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port ${process.env.PORT}`);
});
