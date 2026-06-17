const HrRequest = require("../models/HrRequest");

exports.createHrRequest = async (req, res) => {
  try {
    const count = await HrRequest.countDocuments();

    const incidentNumber = `HR${String(count + 1).padStart(3, "0")}`;

    const request = await HrRequest.create({
      ...req.body,
      incidentNumber,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllHrRequests = async (req, res) => {
  try {
    const requests = await HrRequest.find();

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getHrRequestById = async (req, res) => {
  try {
    const request = await HrRequest.findById(req.params.id);

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateHrRequest = async (req, res) => {
  try {
    const updatedRequest = await HrRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
