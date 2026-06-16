const JobRequest = require("../models/JobRequest");

exports.createJobRequest = async (req, res) => {
  try {
    const data = req.body;

    // Generate Case ID
    const lastRecord = await JobRequest.findOne().sort({ caseId: -1 });

    let nextNumber = 1;

    if (lastRecord?.caseId) {
      nextNumber = parseInt(lastRecord.caseId.replace("HR", "")) + 1;
    }

    data.caseId = `HR${String(nextNumber).padStart(3, "0")}`;

    // Default values
    data.status = "Pending";
    data.category = "Resonance Requirement";

    const savedRequest = await JobRequest.create(data);

    res.status(201).json(savedRequest);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllJobRequests = async (req, res) => {
  try {
    const requests = await JobRequest.find().sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
