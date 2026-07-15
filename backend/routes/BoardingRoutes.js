const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {
  createBoarding,
  getAllBoardings,
  getBoardingById,
  updateBoarding,
} = require("../controllers/BoardingController");

router.post("/", upload.any(), boardingController.createBoarding);

router.get("/", getAllBoardings);

router.get("/:id", getBoardingById);
router.put("/:id", upload.any(), boardingController.updateBoarding);

module.exports = router;
