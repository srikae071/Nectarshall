const ItHrRequest = require("../models/ItHrRequest");

exports.createItHrRequest = async (req, res) => {
  try {
    const { requestType } = req.body;

    const prefix = requestType === "HR" ? "HR" : "INC";

    const lastRequest = await ItHrRequest.findOne({
      incidentNumber: { $regex: `^${prefix}` },
    }).sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastRequest && lastRequest.incidentNumber) {
      nextNumber = parseInt(lastRequest.incidentNumber.replace(prefix, "")) + 1;
    }

    const incidentNumber = `${prefix}${String(nextNumber).padStart(3, "0")}`;

    const request = new ItHrRequest({
      ...req.body,
      incidentNumber,
    });

    await request.save();

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getRequestById = async (req, res) => {
  try {
    const request = await ItHrRequest.findById(req.params.id);

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllItHrRequests = async (req, res) => {
  try {
    const requests = await ItHrRequest.find().sort({
      createdAt: -1,
    });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateItRequest = async (req, res) => {
  try {
    const updatedRequest = await ItHrRequest.findByIdAndUpdate(
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
