const Case = require("../models/Case");

exports.createCase = async (req, res) => {
  try {
    const newCase = new Case(req.body);

    await newCase.save();

    res.status(201).json({
      success: true,
      data: newCase,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.find();

    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json(error);
  }
};
