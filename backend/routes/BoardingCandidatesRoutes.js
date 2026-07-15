const express = require("express");
const router = express.Router();

const {
  createBoardingCandidate,
} = require("../controllers/BoardingCandidatesController");

router.post("/create", createBoardingCandidate);

module.exports = router;
