const Employee = require("../models/Employee");

const cleanEmployeePayload = (body) => {
  const payload = { ...body };
  if (payload.employeeHireDate === "" || payload.employeeHireDate === undefined) {
    payload.employeeHireDate = null;
  }
  if (!payload.employeeName && payload.displayName) {
    payload.employeeName = payload.displayName;
  }
  if (!payload.place && payload.officeLocation) {
    payload.place = payload.officeLocation;
  }
  return payload;
};

const createEmployee = async (req, res) => {
  try {
    const payload = cleanEmployeePayload(req.body);
    const employee = new Employee(payload);
    const saved = await employee.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(400).json({ message: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(emp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const payload = cleanEmployeePayload(req.body);
    const updated = await Employee.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
