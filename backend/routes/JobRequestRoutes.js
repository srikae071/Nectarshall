const express = require("express");

const router = express.Router();

const {
  createJobRequest,
  getAllJobRequests,
  getJobRequestById,
  getJobRequestByCaseId,
  updateJobRequest,
  updateJobRequestByCaseId,
  sendCandidateEmail,
  sendCandidateForm2Email,
} = require("../controllers/jobRequestController");

router.post("/", createJobRequest);

router.get("/", getAllJobRequests);
router.get("/case/:caseId", getJobRequestByCaseId);
router.get("/:id", getJobRequestById);
router.put("/case/:caseId", updateJobRequestByCaseId);
router.put("/:id", updateJobRequest);
router.post("/send-email/:caseId", sendCandidateEmail);
router.post("/send-candidate-form2/:caseId", sendCandidateForm2Email);
module.exports = router;
