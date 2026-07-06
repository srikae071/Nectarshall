const express = require("express");
const router = express.Router();

const {
  createBoarding,
  getAllBoardings,
} = require("../controllers/BoardingController");

router.post("/create", createBoarding);

router.get("/", getAllBoardings);

module.exports = router;
