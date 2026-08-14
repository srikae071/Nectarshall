const AssignmentGroup = require("../models/AssignmentGroup");

// Get or initialize Assignment Group Document with IT, HR, Accounts sub-tables
exports.getAssignmentGroup = async (req, res) => {
  try {
    let group = await AssignmentGroup.findOne({});
    if (!group) {
      group = await AssignmentGroup.create({
        groupName: "Assignment Group",
        itTable: [],
        hrTable: [],
        accountsTable: [],
      });
    }
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new ticket entry in specific sub-table (IT, HR, or Accounts)
exports.addTicketToGroup = async (req, res) => {
  try {
    const { department, ticket } = req.body; // department = "IT" | "HR" | "Accounts"
    let group = await AssignmentGroup.findOne({});
    if (!group) {
      group = new AssignmentGroup({ groupName: "Assignment Group" });
    }

    if (department === "IT") {
      group.itTable.push(ticket);
    } else if (department === "HR") {
      group.hrTable.push(ticket);
    } else if (department === "Accounts") {
      group.accountsTable.push(ticket);
    } else {
      return res.status(400).json({ success: false, message: "Invalid department" });
    }

    await group.save();
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update sub-table item
exports.updateSubTableTicket = async (req, res) => {
  try {
    const { department, ticketId, updateData } = req.body;
    let group = await AssignmentGroup.findOne({});
    if (!group) {
      return res.status(404).json({ success: false, message: "Assignment Group not found" });
    }

    const tableKey = department === "IT" ? "itTable" : department === "HR" ? "hrTable" : "accountsTable";
    const subItem = group[tableKey].id(ticketId) || group[tableKey].find((t) => t.ticketNumber === ticketId || t._id.toString() === ticketId);

    if (subItem) {
      Object.assign(subItem, updateData);
      await group.save();
      return res.status(200).json({ success: true, data: group });
    }

    res.status(404).json({ success: false, message: "Ticket not found in sub-table" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
