const express = require("express");
const router = express.Router();
const {
  getAssignmentGroup,
  addTicketToGroup,
  updateSubTableTicket,
} = require("../controllers/assignmentGroupController");

router.get("/", getAssignmentGroup);
router.post("/add-ticket", addTicketToGroup);
router.put("/update-ticket", updateSubTableTicket);

module.exports = router;
