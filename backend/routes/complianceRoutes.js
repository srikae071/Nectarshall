const express = require("express");

const router = express.Router();

const {
  createCompliance,
  getAllCompliance,
  getComplianceById,
  updateCompliance,
  deleteCompliance,
} = require("../controllers/complianceController");

router.post("/create", createCompliance);

router.get("/", getAllCompliance);

router.get("/:id", getComplianceById);

router.put("/:id", updateCompliance);

router.delete("/:id", deleteCompliance);

module.exports = router;
