const express = require("express");

const router = express.Router();

const {
  createJobRequest,
  getAllJobRequests,
  getJobRequestById,
  getJobRequestByCaseId,
  updateJobRequest,
  updateJobRequestByCaseId,
} = require("../controllers/jobRequestController");

router.post("/", createJobRequest);

router.get("/", getAllJobRequests);
router.get("/case/:caseId", getJobRequestByCaseId);
router.get("/:id", getJobRequestById);
router.put("/case/:caseId", updateJobRequestByCaseId);
router.put("/:id", updateJobRequest);
module.exports = router;
