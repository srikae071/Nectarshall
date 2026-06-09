const express = require("express");

const router = express.Router();

const {
  createItHrRequest,
  getAllItHrRequests,
  getRequestById,
} = require("../controllers/ItHrRequestController");
router.get("/:id", getRequestById);
router.post("/create", createItHrRequest);

router.get("/", getAllItHrRequests);

module.exports = router;
