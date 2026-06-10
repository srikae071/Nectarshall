const express = require("express");

const router = express.Router();

const {
  createHrRequest,
  getAllHrRequests,
  getHrRequestById,
} = require("../controllers/HrRequestController");

router.post("/create", createHrRequest);

router.get("/", getAllHrRequests);

router.get("/:id", getHrRequestById);

module.exports = router;
