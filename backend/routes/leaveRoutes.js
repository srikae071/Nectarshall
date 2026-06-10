const express = require("express");
const router = express.Router();

const {
  createLeave,
  getAllLeaves,
  approveLeave,
  deleteLeave,
} = require("../controllers/leaveController");

router.post("/create", createLeave);

router.get("/", getAllLeaves);

router.put("/approve/:id", approveLeave);
router.delete("/:id", deleteLeave);

module.exports = router;
