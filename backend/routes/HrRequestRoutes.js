const express = require("express");

const router = express.Router();

const {
  createHrRequest,
  getAllHrRequests,
  getHrRequestById,
  updateHrRequest,
} = require("../controllers/HrRequestController");

router.post("/create", createHrRequest);

router.get("/", getAllHrRequests);
router.put("/:id", updateHrRequest);
router.get("/:id", getHrRequestById);

module.exports = router;
