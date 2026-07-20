// const express = require("express");
// const router = express.Router();

// const {
//   createBoardingCandidate,
// } = require("../controllers/BoardingCandidatesController");

// router.post("/create", createBoardingCandidate);

// module.exports = router;
const express = require("express");

const router = express.Router();

const {
  createBoardingCandidate,
  getBoardingCandidates,
  getBoardingCandidateById,
  updateBoardingCandidate,
  deleteBoardingCandidate,
  updateContractService,
} = require("../controllers/BoardingCandidatesController");

router.post("/create", createBoardingCandidate);

router.get("/", getBoardingCandidates);

router.get("/:id", getBoardingCandidateById);

router.put("/:id", updateBoardingCandidate);

router.delete("/:id", deleteBoardingCandidate);
router.put("/:id/contracts/:contractId/services", updateContractService);

module.exports = router;
