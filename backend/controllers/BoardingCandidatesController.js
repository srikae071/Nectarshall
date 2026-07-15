// const BoardingCandidates = require("../models/BoardingCandidates");

// const createBoardingCandidate = async (req, res) => {
//   try {
//     const candidate = new BoardingCandidates(req.body);

//     const savedCandidate = await candidate.save();

//     res.status(201).json(savedCandidate);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   createBoardingCandidate,
// };
const BoardingCandidates = require("../models/BoardingCandidates");

// Create Boarding Candidate
// const createBoardingCandidate = async (req, res) => {
//   try {
//     const candidate = new BoardingCandidates(req.body);

//     const savedCandidate = await candidate.save();

//     res.status(201).json(savedCandidate);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Failed to create Boarding Candidate",
//       error: error.message,
//     });
//   }
// };

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

// const updateBoardingCandidate = async (req, res) => {
//   try {
//     const updatedCandidate = await BoardingCandidates.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         contractDeliverables: req.body.contractDeliverables || [],
//       },
//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!updatedCandidate) {
//       return res.status(404).json({
//         message: "Boarding Candidate not found",
//       });
//     }

//     res.status(200).json({
//       message: "Boarding Candidate updated successfully",
//       data: updatedCandidate,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Failed to update Boarding Candidate",
//       error: error.message,
//     });
//   }
// };

//new code
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

module.exports = {
  createBoardingCandidate,
  getBoardingCandidates,
  getBoardingCandidateById,
  updateBoardingCandidate,
  deleteBoardingCandidate,
};
