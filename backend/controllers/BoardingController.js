exports.createBoarding = async (req, res) => {
  try {
    // Find the latest onboarding record
    const lastBoarding = await Boarding.findOne().sort({ createdAt: -1 });
    console.log("===== CREATE BOARDING =====");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Files:", req.files);
    console.log("Body:", req.body);
    let nextNumber = 1;

    if (lastBoarding && lastBoarding.clientId) {
      const lastNumber = parseInt(lastBoarding.clientId.split("-")[1], 10);

      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // let clientId = "";
    // let businessId = "";

    // // Generate IDs based on category
    // if (req.body.category === "Home") {
    //   clientId = `CUST-${String(nextNumber).padStart(3, "0")}`;
    //   businessId = `BE-${String(nextNumber).padStart(3, "0")}`;
    // } else {
    //   clientId = `OBD-${String(nextNumber).padStart(3, "0")}`;
    // }

    const boarding = new Boarding({
      ...req.body,

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
const Boarding = require("../models/Boarding");

exports.updateBoarding = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("===== UPDATE BOARDING =====");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Files:", req.files);
    console.log("Body:", req.body);
    if (!boarding) {
      return res.status(404).json({
        success: false,
        message: "Boarding not found",
      });
    }

    // Update all schema fields
    boarding.category = req.body.category;
    boarding.clientId = req.body.clientId;
    boarding.SupplierId = req.body.SupplierId;
    boarding.BusinessId = req.body.BusinessId;
    boarding.SupplierType = req.body.SupplierType;
    boarding.companyName = req.body.companyName;
    boarding.requester = req.body.requester;
    boarding.requesterFor = req.body.requesterFor;
    boarding.abn = req.body.abn;
    boarding.acn = req.body.acn;
    boarding.emailAddress = req.body.emailAddress;
    boarding.companyAddress = req.body.companyAddress;
    boarding.SupplierAgentName = req.body.SupplierAgentName;
    boarding.SupplierAgentEmail = req.body.SupplierAgentEmail;
    boarding.companyPhone = req.body.companyPhone;
    boarding.managingAgentName = req.body.managingAgentName;
    boarding.managingAgentNumber = req.body.managingAgentNumber;
    boarding.managingAgentEmail = req.body.managingAgentEmail;
    boarding.onboardingDate = req.body.onboardingDate;
    boarding.validTill = req.body.validTill;
    boarding.type = req.body.type;
    boarding.shortDescription = req.body.shortDescription;
    boarding.description = req.body.description;
    boarding.supplierType = req.body.supplierType;
    boarding.attachment = req.body.attachment;
    boarding.operationsClientApproved = req.body.operationsClientApproved;
    boarding.status = req.body.status;
    boarding.contractDeliverables = req.body.contractDeliverables;
    await boarding.save();

    res.status(200).json({
      success: true,
      message: "Boarding Updated Successfully",
      data: boarding,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
