const express = require("express");
const router = express.Router();

const Case = require("../models/Case");

// CREATE CASE
router.post("/create", async (req, res) => {
  try {
    const newCase = new Case(req.body);

    const savedCase = await newCase.save();

    res.status(201).json(savedCase);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL CASES
router.get("/", async (req, res) => {
  try {
    const cases = await Case.find();

    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
