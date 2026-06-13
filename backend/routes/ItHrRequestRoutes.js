const express = require("express");

const router = express.Router();

const {
  createItHrRequest,
  getAllItHrRequests,
  getRequestById,
  updateItRequest,
} = require("../controllers/ItHrRequestController");
router.get("/:id", getRequestById);
router.post("/create", createItHrRequest);
router.put("/:id", updateItRequest);
router.get("/", getAllItHrRequests);

module.exports = router;
