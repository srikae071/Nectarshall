const Leave = require("../models/Leave");

exports.createLeave = async (req, res) => {
  try {
    const count = await Leave.countDocuments();

    const leaveNumber = `LEV${String(count + 1).padStart(3, "0")}`;

    const leave = await Leave.create({
      ...req.body,
      leaveNumber,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();

    res.json(leaves);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: "Approved",
        comment: req.body.comment,
      },
      { new: true },
    );

    res.json(leave);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
