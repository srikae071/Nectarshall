const express = require("express");
const router = express.Router();

const {
  createLeave,
  getAllLeaves,
  approveLeave,
  deleteLeave,
  rejectLeave,
  resetLeaves,
} = require("../controllers/leaveController");

router.post("/create", createLeave);

router.get("/", getAllLeaves);

router.put("/approve/:id", approveLeave);
router.delete("/:id", deleteLeave);
router.put("/reject/:id", rejectLeave);
router.put("/reset-all", resetLeaves);

module.exports = router;
