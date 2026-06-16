const express = require("express");

const router = express.Router();

const {
  createJobRequest,
  getAllJobRequests,
} = require("../controllers/jobRequestController");

router.post("/", createJobRequest);

router.get("/", getAllJobRequests);

module.exports = router;
