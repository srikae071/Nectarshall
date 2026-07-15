const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {
  createBoarding,
  getAllBoardings,
  getBoardingById,
  updateBoarding,
} = require("../controllers/BoardingController");

router.post("/create", upload.single("attachment"), createBoarding);

router.get("/", getAllBoardings);

router.get("/:id", getBoardingById);

router.put("/:id", upload.single("attachment"), updateBoarding);

module.exports = router;
