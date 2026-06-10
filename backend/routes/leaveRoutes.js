const express = require("express");
const router = express.Router();

const {
  createLeave,
  getAllLeaves,
  approveLeave,
} = require("../controllers/leaveController");

router.post("/create", createLeave);

router.get("/", getAllLeaves);

router.put("/approve/:id", approveLeave);

module.exports = router;
