const BoardingCandidates = require("../models/BoardingCandidates");

const createBoardingCandidate = async (req, res) => {
  try {
    const candidate = new BoardingCandidates(req.body);

    const savedCandidate = await candidate.save();

    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBoardingCandidate,
};
