const Boarding = require("../models/Boarding");

exports.createBoarding = async (req, res) => {
  try {
    // Find the latest onboarding record
    const lastBoarding = await Boarding.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastBoarding && lastBoarding.clientId) {
      const lastNumber = parseInt(lastBoarding.clientId.split("-")[1], 10);

      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    let clientId = "";
    let businessId = "";

    // Generate IDs based on category
    if (req.body.category === "Home") {
      clientId = `CUST-${String(nextNumber).padStart(3, "0")}`;
      businessId = `BE-${String(nextNumber).padStart(3, "0")}`;
    } else {
      clientId = `OBD-${String(nextNumber).padStart(3, "0")}`;
    }

    const boarding = new Boarding({
      ...req.body,

      clientId,
      businessId,

      category: req.body.category,
    });

    await boarding.save();

    res.status(201).json({
      success: true,
      message: "Supplier Onboarding Created Successfully",
      data: boarding,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error creating Supplier Onboarding",
      error: err.message,
    });
  }
};

exports.getAllBoardings = async (req, res) => {
  try {
    const boardings = await Boarding.find().sort({ createdAt: -1 });

    res.status(200).json(boardings);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Error fetching boardings",
    });
  }
};
exports.getBoardingById = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id);

    if (!boarding) {
      return res.status(404).json({
        success: false,
        message: "Boarding not found",
      });
    }

    res.status(200).json(boarding);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// exports.updateBoarding = async (req, res) => {
//   try {
//     const boarding = await Boarding.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Boarding Updated Successfully",
//       data: boarding,
//     });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

exports.updateBoarding = async (req, res) => {
  try {
    console.log("BODY:");
    console.dir(req.body, { depth: null });

    return res.json(req.body);
  } catch (err) {
    console.log(err);
  }
};
// exports.updateBoarding = async (req, res) => {
//   try {
//     console.log("BODY:");
//     console.dir(req.body, { depth: null });

//     const boarding = await Boarding.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       success: true,
//       data: boarding,
//     });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
