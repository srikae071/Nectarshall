const JobRequest = require("../models/JobRequest");
const Employee = require("../models/Employee");
const nodemailer = require("nodemailer");

const syncResolvedCandidateToEmployee = async (candData, requestData) => {
  try {
    const candidateName = candData.name || candData.firstName || requestData.firstName || requestData.employeeName || "Candidate";
    let firstName = candData.firstName || candidateName.split(" ")[0] || "Candidate";
    let lastName = candData.lastName || candidateName.split(" ").slice(1).join(" ") || "";
    const displayName = `${firstName} ${lastName}`.trim() || candidateName;
    const candidateId = candData.candidateId || "CND-001";
    const email = candData.email || requestData.email || `${firstName.toLowerCase()}@company.com`;

    let existingEmp = await Employee.findOne({
      $or: [
        { email: email },
        { candidateId: candidateId },
        { displayName: displayName }
      ]
    });

    if (!existingEmp) {
      const newEmp = new Employee({
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobilePhone: candData.phone || candData.contactNumber || requestData.contactNumber || requestData.mobilePhone || "",
        userPrincipalName: `${firstName.toLowerCase()}.${lastName.toLowerCase() || "emp"}@enhanceservices.com`,
        candidateId: candidateId,
        shortDescription: requestData.shortDescription || candData.shortDescription || "",
        description: requestData.description || candData.description || "",
        barriers: candData.barriers || requestData.barriers || "",

        securityLicence: candData.securityLicence || candData.securityLicenceCandidateForm || "",
        securityLicenceExpiry: candData.securityLicenceExpiry || "",
        drivingLicence: candData.drivingLicence || candData.drivingLicenceCandidateForm || "",
        drivingLicenceExpiry: candData.drivingLicenceExpiry || "",
        firstAid: candData.firstAid || candData.firstAidCandidateForm || "",
        firstAidExpiry: candData.firstAidExpiry || "",
        cpr: candData.cpr || candData.cprCandidateForm || "",
        cprExpiry: candData.cprExpiry || "",
        workingWithChildren: candData.workingWithChildren || candData.workingWithChildrenCandidateForm || "",
        wwccExpiry: candData.wwccExpiry || candData.workingWithChildrenExpiry || "",
        trafficManagement: candData.trafficManagement || candData.trafficManagementCandidateForm || "",
        trafficManagementExpiry: candData.trafficManagementExpiry || "",
        whiteCard: candData.whiteCard || candData.whiteCardCandidateForm || "",
        yellowCard: candData.yellowCard || candData.yellowCardCandidateForm || "",

        bankName: candData.bankName || requestData.bankName || "",
        bankAccountName: candData.bankAccountName || candData.accountName || candData.name || "",
        bsb: candData.bsb || requestData.bsb || "",
        accountNumber: candData.accountNumber || candData.bankAccount || requestData.bankAccount || "",
        tfn: candData.taxFileNumber || requestData.taxFileNumber || "",
        superNumber: candData.superNumber || "",
        superFund: candData.superFundName || requestData.superFundName || "",
        superMemberNum: candData.superMemberNumber || requestData.superMemberNumber || "",
        longServiceLeaveId: candData.longServiceLeaveId || "",

        accountActive: false,
        accountEnabled: false,
        accountStatus: "Pending",
        status: "Pending"
      });

      await newEmp.save();
      console.log(`Auto-created Pending Employee '${displayName}' from Resolved Candidate ${candidateId}`);
    }
  } catch (err) {
    console.error("Error auto-creating employee from resolved candidate:", err);
  }
};

exports.createJobRequest = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body);

    // Generate Case ID
    const lastRecord = await JobRequest.findOne().sort({ caseId: -1 });
    let nextNumber = 1;
    if (lastRecord?.caseId) {
      const numPart = lastRecord.caseId.replace(/\D/g, "");
      if (numPart) nextNumber = parseInt(numPart) + 1;
    }
    data.caseId = data.caseId || `HRY${String(nextNumber).padStart(3, "0")}`;

    // Generate Task ID
    if (!data.taskId) {
      const lastTask = await JobRequest.findOne({ taskId: { $regex: "^TSK" } }).sort({ createdAt: -1 });
      let nextTaskNum = 1;
      if (lastTask && lastTask.taskId) {
        const numPart = lastTask.taskId.replace(/\D/g, "");
        if (numPart) nextTaskNum = parseInt(numPart) + 1;
      }
      data.taskId = `TSK${String(nextTaskNum).padStart(3, "0")}`;
    }

    // Default values only if not provided
    data.status = data.status || "Pending";
    data.approvalStatus = data.approvalStatus || "Pending";
    data.itStatus = data.itStatus || "Open";
    data.itClearanceStatus = data.itClearanceStatus || "Open";
    data.ItTAskStatus = data.ItTAskStatus || "Open";
    data.category = data.category || "Employee Request";

    // Initial timeline record
    data.timeline = [
      {
        action: "Request Submitted",
        performedBy: data.requesterName || data.requester || "System User",
        timestamp: new Date(),
        details: `Request created for category ${data.category}`,
      },
    ];

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

    const now = new Date();
    if (!Array.isArray(request.timeline)) {
      request.timeline = [];
    }

    // 1. Approval Status Change
    if (req.body.approvalStatus && req.body.approvalStatus !== request.approvalStatus) {
      if (req.body.approvalStatus === "Approved") {
        request.approvedAt = now;
        request.approvedBy = req.body.approvedBy || "Admin";
        request.timeline.push({
          action: "Request Approved",
          module: "HRMS",
          performedBy: req.body.approvedBy || "Admin",
          timestamp: now,
          status: "Approved",
          details: `Approval status updated to Approved`,
        });
      } else if (req.body.approvalStatus === "Rejected") {
        request.timeline.push({
          action: "Request Rejected",
          module: "HRMS",
          performedBy: req.body.approvedBy || "Admin",
          timestamp: now,
          status: "Rejected",
          details: `Approval status updated to Rejected`,
        });
      }
    }

    // 2. IT Clearance Status Change
    const newItStatus = req.body.itClearanceStatus || req.body.itStatus || req.body.ItTAskStatus;
    const oldItStatus = request.itClearanceStatus || request.itStatus || request.ItTAskStatus;
    if (newItStatus && newItStatus !== oldItStatus) {
      request.itStatusUpdatedAt = now;
      request.itStatusUpdatedBy = req.body.updatedBy || "IT Admin";
      request.timeline.push({
        action: `IT Clearance Status Changed`,
        module: "IT",
        performedBy: req.body.updatedBy || "IT Admin",
        timestamp: now,
        status: newItStatus,
        details: `IT Clearance Status updated to "${newItStatus}"`,
      });
    }

    // 3. IT Equipment Fields Update
    if (
      (req.body.laptopRecovered !== undefined && req.body.laptopRecovered !== request.laptopRecovered) ||
      (req.body.laptopWorkingCondition !== undefined && req.body.laptopWorkingCondition !== request.laptopWorkingCondition) ||
      (req.body.dataBackup !== undefined && req.body.dataBackup !== request.dataBackup) ||
      (req.body.emailIdReceived !== undefined && req.body.emailIdReceived !== request.emailIdReceived)
    ) {
      request.itDetailsUpdatedAt = now;
      request.timeline.push({
        action: `IT Equipment Details Updated`,
        module: "IT",
        performedBy: req.body.updatedBy || "IT Specialist",
        timestamp: now,
        status: newItStatus || request.itClearanceStatus || request.itStatus || "Updated",
        details: `Laptop Recovered: ${req.body.laptopRecovered ?? request.laptopRecovered ?? 'N/A'}, Condition: ${req.body.laptopWorkingCondition ?? request.laptopWorkingCondition ?? 'N/A'}, Data Backup: ${req.body.dataBackup ?? request.dataBackup ?? 'N/A'}, Email Received: ${req.body.emailIdReceived ?? request.emailIdReceived ?? 'N/A'}`,
      });
    }

    // 4. Finance / Accounts Clearance Status Change
    const newFinStatus = req.body.financeClearanceStatus || req.body.financeStatus;
    const oldFinStatus = request.financeClearanceStatus || request.financeStatus;
    if (newFinStatus && newFinStatus !== oldFinStatus) {
      request.financeStatusUpdatedAt = now;
      request.financeStatusUpdatedBy = req.body.updatedBy || "Finance Admin";
      request.timeline.push({
        action: `Finance Clearance Status Changed`,
        module: "ACCOUNTS",
        performedBy: req.body.updatedBy || "Finance Admin",
        timestamp: now,
        status: newFinStatus,
        details: `Finance Clearance Status updated to "${newFinStatus}"`,
      });
    }

    // 5. HR Clearance Status Change
    const newHrStatus = req.body.hrClearanceStatus || req.body.hrStatus;
    const oldHrStatus = request.hrClearanceStatus || request.hrStatus;
    if (
      (newHrStatus && newHrStatus !== oldHrStatus) ||
      (req.body.relievingLetterIssued !== undefined && req.body.relievingLetterIssued !== request.relievingLetterIssued) ||
      (req.body.backupHired !== undefined && req.body.backupHired !== request.backupHired)
    ) {
      request.hrStatusUpdatedAt = now;
      request.hrStatusUpdatedBy = req.body.updatedBy || "HR Manager";
      request.timeline.push({
        action: `HR Clearance Updated`,
        module: "HRMS",
        performedBy: req.body.updatedBy || "HR Manager",
        timestamp: now,
        status: newHrStatus || request.hrClearanceStatus || "Updated",
        details: `HR Clearance Status: "${newHrStatus || request.hrClearanceStatus || 'Open'}" (Relieving Letter: ${req.body.relievingLetterIssued ?? request.relievingLetterIssued ?? 'No'}, Backup Hired: ${req.body.backupHired ?? request.backupHired ?? 'No'})`,
      });
    }

    // Update all fields sent from frontend
    Object.assign(request, req.body);
    request.markModified("candidates");
    request.markModified("timeline");

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

    // Auto-create Pending Employee if request or candidate is Resolved
    if (request.status === "Resolved") {
      if (Array.isArray(request.candidates) && request.candidates.length > 0) {
        for (const cand of request.candidates) {
          await syncResolvedCandidateToEmployee(cand, request);
        }
      } else {
        await syncResolvedCandidateToEmployee({}, request);
      }
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
    const request = await JobRequest.findOne({ caseId: req.params.caseId });

    if (!request) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    Object.assign(request, req.body);

    if (req.body.offerStatus) {
      request.offerLetterResult = req.body.offerStatus;
    }
    if (req.body.bankAccount) {
      request.accountNumber = req.body.bankAccount;
      request.bankAccountName = req.body.bankAccount;
    }
    if (req.body.taxFileNumber) {
      request.tfn = req.body.taxFileNumber;
    }
    if (req.body.superFundName) {
      request.superFund = req.body.superFundName;
    }
    if (req.body.superMemberNumber) {
      request.superMemberNum = req.body.superMemberNumber;
    }

    if (Array.isArray(request.candidates) && request.candidates.length > 0) {
      request.candidates.forEach((cand) => {
        if (req.body.offerStatus) cand.offerLetterResult = req.body.offerStatus;
        if (req.body.bankName) cand.bankName = req.body.bankName;
        if (req.body.bankAccount) {
          cand.bankAccountName = req.body.bankAccount;
          cand.accountNumber = req.body.bankAccount;
          cand.bankAccount = req.body.bankAccount;
        }
        if (req.body.bsb) cand.bsb = req.body.bsb;
        if (req.body.taxFileNumber) {
          cand.tfn = req.body.taxFileNumber;
          cand.taxFileNumber = req.body.taxFileNumber;
        }
        if (req.body.superFundName) {
          cand.superFund = req.body.superFundName;
          cand.superFundName = req.body.superFundName;
        }
        if (req.body.superMemberNumber) {
          cand.superMemberNum = req.body.superMemberNumber;
          cand.superMemberNumber = req.body.superMemberNumber;
        }
        if (req.body.longServiceLeaveId) cand.longServiceLeaveId = req.body.longServiceLeaveId;
        cand.submitted = true;
      });
      request.markModified("candidates");
    }

    await request.save();

    res.json(request);
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

    request.form1EmailSent = true;
    request.emailSent = true;
    await request.save();

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
    let idx = request.candidates.findIndex(
      (c) => c.candidateId === targetCandId || (targetCandId === "CND-001" && !c.candidateId)
    );

    const existingCand = idx !== -1 ? (request.candidates[idx].toObject ? request.candidates[idx].toObject() : request.candidates[idx]) : {};

    const candData = {
      ...existingCand,
      candidateId: targetCandId,
      name: formData.name || formData.firstName || existingCand.name || request.firstName || "Candidate",
      email: formData.email || existingCand.email || request.email || "",
      submitted: true,
      submittedAt: new Date(),

      modernSlaveryCandidateForm: formData.modernSlaveryCandidateForm || existingCand.modernSlaveryCandidateForm,
      legalBarrierCandidateForm: formData.legalBarrierCandidateForm || existingCand.legalBarrierCandidateForm,
      medicalLimitationsCandidateForm: formData.medicalLimitationsCandidateForm || existingCand.medicalLimitationsCandidateForm,
      workRightsCandidateForm: formData.workRightsCandidateForm || existingCand.workRightsCandidateForm,

      securityLicence: formData.securityLicence || formData.securityLicenceCandidateForm || existingCand.securityLicence,
      securityLicenceExpiry: formData.securityLicenceExpiry || existingCand.securityLicenceExpiry,
      securityLicenceCandidateForm: formData.securityLicenceCandidateForm || formData.securityLicence || existingCand.securityLicenceCandidateForm,

      drivingLicence: formData.drivingLicence || formData.drivingLicenceCandidateForm || existingCand.drivingLicence,
      drivingLicenceExpiry: formData.drivingLicenceExpiry || existingCand.drivingLicenceExpiry,
      drivingLicenceCandidateForm: formData.drivingLicenceCandidateForm || formData.drivingLicence || existingCand.drivingLicenceCandidateForm,

      firstAid: formData.firstAid || formData.firstAidCandidateForm || existingCand.firstAid,
      firstAidExpiry: formData.firstAidExpiry || existingCand.firstAidExpiry,
      firstAidCandidateForm: formData.firstAidCandidateForm || formData.firstAid || existingCand.firstAidCandidateForm,

      cpr: formData.cpr || formData.cprCandidateForm || existingCand.cpr,
      cprExpiry: formData.cprExpiry || existingCand.cprExpiry,
      cprCandidateForm: formData.cprCandidateForm || formData.cpr || existingCand.cprCandidateForm,

      workingWithChildren: formData.workingWithChildren || formData.workingWithChildrenCandidateForm || existingCand.workingWithChildren,
      workingWithChildrenExpiry: formData.workingWithChildrenExpiry || existingCand.workingWithChildrenExpiry,
      workingWithChildrenCandidateForm: formData.workingWithChildrenCandidateForm || formData.workingWithChildren || existingCand.workingWithChildrenCandidateForm,

      trafficManagement: formData.trafficManagement || formData.trafficManagementCandidateForm || existingCand.trafficManagement,
      trafficManagementExpiry: formData.trafficManagementExpiry || existingCand.trafficManagementExpiry,
      trafficManagementCandidateForm: formData.trafficManagementCandidateForm || formData.trafficManagement || existingCand.trafficManagementCandidateForm,

      whiteCard: formData.whiteCard || formData.whiteCardCandidateForm || existingCand.whiteCard,
      whiteCardExpiry: formData.whiteCardExpiry || existingCand.whiteCardExpiry,
      whiteCardCandidateForm: formData.whiteCardCandidateForm || formData.whiteCard || existingCand.whiteCardCandidateForm,

      yellowCard: formData.yellowCard || formData.yellowCardCandidateForm || existingCand.yellowCard,
      yellowCardExpiry: formData.yellowCardExpiry || existingCand.yellowCardExpiry,
      yellowCardCandidateForm: formData.yellowCardCandidateForm || formData.yellowCard || existingCand.yellowCardCandidateForm,

      bankName: formData.bankName || existingCand.bankName,
      bankAccount: formData.bankAccount || existingCand.bankAccount,
      bsb: formData.bsb || existingCand.bsb,
      taxFileNumber: formData.taxFileNumber || existingCand.taxFileNumber,
      superFundName: formData.superFundName || existingCand.superFundName,
      superMemberNumber: formData.superMemberNumber || existingCand.superMemberNumber,
      longServiceLeaveId: formData.longServiceLeaveId || existingCand.longServiceLeaveId,
    };

    if (idx !== -1) {
      request.candidates[idx] = candData;
    } else {
      request.candidates.push(candData);
    }

    request.candidateCompleted = true;
    request.status = "Open";

    if (idx === 0 || targetCandId === "CND-001") {
      request.modernSlaveryCandidateForm = candData.modernSlaveryCandidateForm;
      request.legalBarrierCandidateForm = candData.legalBarrierCandidateForm;
      request.medicalLimitationsCandidateForm = candData.medicalLimitationsCandidateForm;
      request.workRightsCandidateForm = candData.workRightsCandidateForm;
      request.bankName = candData.bankName;
      request.bankAccount = candData.bankAccount;
      request.bsb = candData.bsb;
      request.taxFileNumber = candData.taxFileNumber;
      request.superFundName = candData.superFundName;
      request.superMemberNumber = candData.superMemberNumber;
    }

    request.markModified("candidates");
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

    request.form2EmailSent = true;
    await request.save();

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

    if (!request.taskId) {
      request.taskId = `TSK${String(nextNumber).padStart(3, "0")}`;
    }

    request.taskType = "IT Clearance";

    if (!request.taskStatus) {
      request.taskStatus = "Open";
    }

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
