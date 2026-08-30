const HrRequest = require("../models/HrRequest");

exports.createHrRequest = async (req, res) => {
  try {
    const lastRequest = await HrRequest.findOne({
      incidentNumber: { $regex: "^HR" },
    }).sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastRequest && lastRequest.incidentNumber) {
      const parsed = parseInt(lastRequest.incidentNumber.replace(/^HR/i, ""), 10);
      if (!isNaN(parsed)) {
        nextNumber = parsed + 1;
      }
    }

    const incidentNumber = `HR${String(nextNumber).padStart(3, "0")}`;

    const request = await HrRequest.create({
      ...req.body,
      incidentNumber,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating HrRequest:", error);
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
