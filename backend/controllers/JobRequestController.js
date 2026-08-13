const JobRequest = require("../models/JobRequest");
const nodemailer = require("nodemailer");

exports.createJobRequest = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body);

    // Generate Case ID
    const lastRecord = await JobRequest.findOne().sort({ caseId: -1 });

    let nextNumber = 1;

    if (lastRecord?.caseId) {
      nextNumber = parseInt(lastRecord.caseId.replace("HRY", "")) + 1;
    }

    data.caseId = `HRY${String(nextNumber).padStart(3, "0")}`;

    // Default values
    // Default values only if not provided
    data.status = data.status || "Pending";

    data.category = data.category || "Employee Save";
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

exports.getJobRequestById = async (req, res) => {
  try {
    const request = await JobRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getJobRequestByCaseId = async (req, res) => {
  try {
    const request = await JobRequest.findOne({
      caseId: req.params.caseId,
    });

    if (!request) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateJobRequest = async (req, res) => {
  try {
    const request = await JobRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    // Update all fields sent from frontend
    Object.assign(request, req.body);

    // Generate Onboarding Task ID only when status becomes Resolved
    if (request.status === "Resolved" && !request.onboardingTaskId) {
      const lastTask = await JobRequest.findOne({
        onboardingTaskId: { $regex: "^ONBTSK" },
      }).sort({ createdAt: -1 });

      let nextNumber = 1;

      if (lastTask && lastTask.onboardingTaskId) {
        nextNumber =
          parseInt(lastTask.onboardingTaskId.replace("ONBTSK", "")) + 1;
      }

      request.onboardingTaskId = `ONBTSK${String(nextNumber).padStart(3, "0")}`;
    }

    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateJobRequestByCaseId = async (req, res) => {
  try {
    const updated = await JobRequest.findOneAndUpdate(
      { caseId: req.params.caseId },
      req.body,
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.sendCandidateEmail = async (req, res) => {
  try {
    const request = await JobRequest.findOne({
      caseId: req.params.caseId,
    });

    if (!request) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const recipientsMap = new Map();

    if (Array.isArray(request.candidates) && request.candidates.length > 0) {
      request.candidates.forEach((c) => {
        if (c.email && c.email.trim()) {
          recipientsMap.set(c.email.trim().toLowerCase(), {
            email: c.email.trim(),
            name: c.name || request.firstName || "Candidate",
            candidateId: c.candidateId || "CND-001",
          });
        }
      });
    }

    if (recipientsMap.size === 0 && request.email && request.email.trim()) {
      recipientsMap.set(request.email.trim().toLowerCase(), {
        email: request.email.trim(),
        name: request.firstName || "Candidate",
        candidateId: "CND-001",
      });
    }

    const recipientList = Array.from(recipientsMap.values());

    if (recipientList.length === 0) {
      return res.status(400).json({
        message: "No recipient email addresses found for this request.",
      });
    }

    for (const recipient of recipientList) {
      const candidateLink = `https://purple-sand-0241d5e00.7.azurestaticapps.net/candidate-form/${request.caseId}?candId=${recipient.candidateId}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient.email,
        subject: `Complete Candidate Form (${recipient.candidateId})`,
        html: `
          <h3>Hello ${recipient.name}</h3>

          <p>Please complete your onboarding form for Candidate ID: <strong>${recipient.candidateId}</strong>.</p>

          <a href="${candidateLink}">
            Open Candidate Form (${recipient.candidateId})
          </a>
        `,
      });
    }

    res.json({
      message: `Emails Sent Successfully to ${recipientList.length} candidate(s)`,
    });
  } catch (error) {
    console.log("EMAIL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.submitCandidateFormById = async (req, res) => {
  try {
    const { caseId, candId } = req.params;
    const formData = req.body;

    const request = await JobRequest.findOne({ caseId });
    if (!request) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (!Array.isArray(request.candidates)) {
      request.candidates = [];
    }

    const targetCandId = candId || "CND-001";
    const idx = request.candidates.findIndex(
      (c) => c.candidateId === targetCandId || (targetCandId === "CND-001" && !c.candidateId)
    );

    const candData = {
      candidateId: targetCandId,
      name: formData.name || formData.firstName || "Candidate",
      email: formData.email || "",
      submitted: true,
      submittedAt: new Date(),

      modernSlaveryCandidateForm: formData.modernSlaveryCandidateForm,
      legalBarrierCandidateForm: formData.legalBarrierCandidateForm,
      medicalLimitationsCandidateForm: formData.medicalLimitationsCandidateForm,
      workRightsCandidateForm: formData.workRightsCandidateForm,

      securityLicenceCandidateForm: formData.securityLicenceCandidateForm,
      drivingLicenceCandidateForm: formData.drivingLicenceCandidateForm,
      firstAidCandidateForm: formData.firstAidCandidateForm,
      cprCandidateForm: formData.cprCandidateForm,
      workingWithChildrenCandidateForm: formData.workingWithChildrenCandidateForm,
      trafficManagementCandidateForm: formData.trafficManagementCandidateForm,
      whiteCardCandidateForm: formData.whiteCardCandidateForm,
      yellowCardCandidateForm: formData.yellowCardCandidateForm,

      bankName: formData.bankName,
      bankAccount: formData.bankAccount,
      bsb: formData.bsb,
      taxFileNumber: formData.taxFileNumber,
      superFundName: formData.superFundName,
      superMemberNumber: formData.superMemberNumber,
      longServiceLeaveId: formData.longServiceLeaveId,
    };

    if (idx !== -1) {
      request.candidates[idx] = {
        ...request.candidates[idx].toObject(),
        ...candData,
      };
    } else {
      request.candidates.push(candData);
    }

    request.candidateCompleted = true;
    request.status = "Open";
    await request.save();

    res.json({ message: "Candidate Form Submitted Successfully", request });
  } catch (error) {
    console.log("SUBMIT CANDIDATE FORM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.sendCandidateForm2Email = async (req, res) => {
  try {
    const request = await JobRequest.findOne({
      caseId: req.params.caseId,
    });

    if (!request) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const candidateLink = `https://purple-sand-0241d5e00.7.azurestaticapps.net/Candidate-form2/${request.caseId}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: request.email,
      subject: "Complete Candidate Form 2",
      html: `
        <h3>Hello ${request.firstName}</h3>
        <p>Please complete Candidate Form 2.</p>
        <a href="${candidateLink}">
          Open Candidate Form 2
        </a>
      `,
    });

    res.json({
      message: "Candidate Form 2 Email Sent",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getInterviewStats = async (req, res) => {
  try {
    const passCount = await JobRequest.countDocuments({
      interview: "PASS",
    });

    const failCount = await JobRequest.countDocuments({
      interview: "FAIL",
    });

    res.json({
      passCount,
      failCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.createITTask = async (req, res) => {
  try {
    const request = await JobRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    const lastTask = await JobRequest.findOne({
      taskId: { $exists: true },
    }).sort({ taskId: -1 });

    let nextNumber = 1;

    if (lastTask?.taskId) {
      nextNumber = parseInt(lastTask.taskId.replace("TSK", "")) + 1;
    }

    request.taskId = `TSK${String(nextNumber).padStart(3, "0")}`;

    request.taskType = "IT Clearance";

    request.taskStatus = "Open";

    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteJobRequest = async (req, res) => {
  try {
    await JobRequest.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
