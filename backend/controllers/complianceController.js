const Compliance = require("../models/Compliance");

exports.createCompliance = async (req, res) => {
  try {
    const count = await Compliance.countDocuments();

    const complianceNumber = `CMP${String(count + 1).padStart(3, "0")}`;

    const compliance = await Compliance.create({
      ...req.body,
      complianceNumber,
    });

    res.status(201).json(compliance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllCompliance = async (req, res) => {
  try {
    const data = await Compliance.find();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getComplianceById = async (req, res) => {
  try {
    const data = await Compliance.findById(req.params.id);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateCompliance = async (req, res) => {
  try {
    const data = await Compliance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteCompliance = async (req, res) => {
  try {
    await Compliance.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
