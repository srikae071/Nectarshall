const BoardingCandidates = require("../models/BoardingCandidates");

const createBoardingCandidate = async (req, res) => {
  try {
    // Get the latest created record
    const lastCandidate = await BoardingCandidates.findOne().sort({
      createdAt: -1,
    });

    let clientId = "ONBD-001";

    if (lastCandidate && lastCandidate.clientId) {
      const lastNumber = parseInt(
        lastCandidate.clientId.replace("ONBD-", ""),
        10,
      );

      clientId = `ONBD-${String(lastNumber + 1).padStart(3, "0")}`;
    }

    const candidate = new BoardingCandidates({
      ...req.body,
      clientId,
    });

    const savedCandidate = await candidate.save();

    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Boarding Candidates
const getBoardingCandidates = async (req, res) => {
  try {
    const candidates = await BoardingCandidates.find().sort({
      createdAt: -1,
    });

    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch Boarding Candidates",
      error: error.message,
    });
  }
};

// Get One Boarding Candidate
const getBoardingCandidateById = async (req, res) => {
  try {
    const candidate = await BoardingCandidates.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Boarding Candidate not found",
      });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateBoardingCandidate = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Generate Contract IDs if missing
    if (Array.isArray(updateData.contractDeliverables)) {
      updateData.contractDeliverables = updateData.contractDeliverables.map(
        (item, index) => ({
          ...item,
          clientId:
            item.clientId && item.clientId.trim() !== ""
              ? item.clientId
              : `CNT-${String(index + 1).padStart(3, "0")}`,
        }),
      );
    }

    const updatedCandidate = await BoardingCandidates.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCandidate) {
      return res.status(404).json({
        message: "Boarding Candidate not found",
      });
    }

    res.status(200).json(updatedCandidate);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Boarding Candidate
const deleteBoardingCandidate = async (req, res) => {
  try {
    await BoardingCandidates.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// newly added
const updateContractService = async (req, res) => {
  try {
    console.log("===== updateContractService HIT =====");
    console.log(req.body);
    const { id, contractId } = req.params;
    const { services, adhocServices = [] } = req.body;

    const boarding = await BoardingCandidates.findById(id);

    if (!boarding) {
      return res.status(404).json({ message: "Boarding Candidate not found" });
    }

    const contract = boarding.contractDeliverables.id(contractId);

    if (!contract) {
      return res
        .status(404)
        .json({ message: "Contract Deliverable not found" });
    }

    contract.services = services;
    const existingAdhocServices = contract.adhocServices || [];

    let lastNumber = existingAdhocServices.reduce((max, item) => {
      if (!item.adhocId) return max;

      const num = parseInt(item.adhocId.replace("AD", ""), 10);

      return isNaN(num) ? max : Math.max(max, num);
    }, 0);

    contract.adhocServices = adhocServices.map((item) => {
      if (item.adhocId && item.adhocId.trim() !== "") {
        return item;
      }

      lastNumber++;

      return {
        ...item,
        adhocId: `AD${String(lastNumber).padStart(3, "0")}`,
      };
    });

    await boarding.save();

    res.status(200).json({
      message: "Service updated successfully",
      data: boarding,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  createBoardingCandidate,
  getBoardingCandidates,
  getBoardingCandidateById,
  updateBoardingCandidate,
  deleteBoardingCandidate,
  //newly added
  updateContractService,
};
