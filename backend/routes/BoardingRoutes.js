const express = require("express");
const router = express.Router();

const {
  createBoarding,
  getAllBoardings,
  getBoardingById,
  updateBoarding,
} = require("../controllers/BoardingController");

router.post("/create", createBoarding);

router.get("/", getAllBoardings);

router.get("/:id", getBoardingById);

router.put("/:id", updateBoarding);

module.exports = router;
