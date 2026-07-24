const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  deleteEmployee,
} = require("../controllers/EmployeeController");
router.post("/create", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.delete("/:id", deleteEmployee);
module.exports = router;
