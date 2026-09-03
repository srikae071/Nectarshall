import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountsLayout from "../../AccountsLayout";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";
import "../../../Hrms/SavedForms/HRSaves/index.css";

function AccountsCreateNewCase() {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");

  const [formData, setFormData] = useState({
    caseId: "",
    incidentNumber: "",
    requester: "",
    requesterName: "",
    department: "Accounts",
    category: "",
    subCategory: "",
    assignmentGroup: "Accounts",
    assignTo: "",
    impact: "",
    urgency: "",
    priority: "",
    shortDescription: "",
    description: "",
    workNotes: "",
    status: "Open",
  });

  useEffect(() => {
    let authUser = null;
    try {
      const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
      if (saved) authUser = JSON.parse(saved);
    } catch (e) {
      const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
      if (raw && typeof raw === "string") authUser = { username: raw };
    }

    const name = authUser?.displayName || authUser?.name || authUser?.username || "Accounts User";
    setCurrentUserName(name);
    setFormData((prev) => ({
      ...prev,
      requester: name,
      requesterName: name,
    }));

    fetchApiData("/api/employees")
      .then((res) => setEmployeeList(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getAssignToOptions = (selectedGroup) => {
    if (!selectedGroup) return employeeList;
    const groupUpper = selectedGroup.trim().toUpperCase();

    const filtered = employeeList.filter((emp) => {
      const deptUpper = (emp.department || emp.dept || emp.designation || "").trim().toUpperCase();
      if (groupUpper === "HR") return deptUpper.includes("HR");
      if (groupUpper === "IT") return deptUpper.includes("IT");
      if (groupUpper === "OPERATIONS") return deptUpper.includes("OPERAT");
      if (groupUpper === "ACCOUNTS") return deptUpper.includes("ACC") || deptUpper.includes("FIN");
      if (groupUpper === "CNC" || groupUpper === "C&C") return deptUpper.includes("CNC") || deptUpper.includes("COMPLIANCE");
      return deptUpper.includes(groupUpper);
    });

    return filtered.length > 0 ? filtered : employeeList;
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        status: "Draft",
        assignedTo: formData.assignTo || "",
      };
      await sendApiData("/api/hrrequests/create", payload, "post");
      alert("Accounts Case Saved as Draft Successfully!");
      navigate("/accounts/cases/all");
    } catch (error) {
      console.error(error);
      alert("Error Saving Accounts Case as Draft");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        ...formData,
        assignedTo: formData.assignTo || "",
      };

      await sendApiData("/api/hrrequests/create", payload, "post");
      alert("Accounts Case Submitted Successfully!");
      navigate("/accounts/cases/all");
    } catch (error) {
      console.error(error);
      alert("Error Submitting Accounts Case");
    }
  };

  const handleCancel = () => {
    navigate("/accounts/cases/all");
  };

  return (
    <AccountsLayout>
      <div className="CreateContainer">
        <h2 className="CreateTitle">ACCOUNTS CASE - CREATE NEW</h2>

        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Case ID</label>
            <input name="caseId" value={formData.caseId} readOnly />
          </div>

          <div className="CreateField">
            <label>Requester Name</label>
            <input
              name="requesterName"
              value={formData.requesterName || currentUserName}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Requested For</label>
            <input
              name="requesterFor"
              value={formData.requesterFor || ""}
              onChange={handleChange}
              placeholder="Leave empty if for self"
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Department</label>
            <select name="department" value="Accounts" readOnly>
              <option value="Accounts">Accounts</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Assigned to Me">Assigned to Me</option>
              <option value="Closed">Closed</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Work In Progress">Work In Progress</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Accounts Query">Accounts Query</option>
              <option value="Payroll Query">Payroll Query</option>
              <option value="Billing Query">Billing Query</option>
              <option value="Vendor Query">Vendor Query</option>
              <option value="Expense Query">Expense Query</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Sub Category</label>
            <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Salary / PayRun">Salary / PayRun</option>
              <option value="Invoice Clearance">Invoice Clearance</option>
              <option value="Taxation & TDS">Taxation & TDS</option>
              <option value="Reimbursement">Reimbursement</option>
              <option value="General Query">General Query</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Assignment Group</label>
            <select name="assignmentGroup" value={formData.assignmentGroup} onChange={handleChange}>
              <option value="Accounts">Accounts</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Assign To</label>
            <select name="assignTo" value={formData.assignTo} onChange={handleChange}>
              <option value="">Select Assignee</option>
              {getAssignToOptions(formData.assignmentGroup).map((emp, i) => {
                const name = emp.displayName || emp.employeeName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
                return (
                  <option key={i} value={name}>
                    {name} [{emp.department || "Accounts"}]
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* ROW 4 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Impact</label>
            <select name="impact" value={formData.impact} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Urgency</label>
            <select name="urgency" value={formData.urgency} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Priority</label>
            <input name="priority" value={formData.priority} onChange={handleChange} />
          </div>
        </div>

        {/* TEXTAREAS */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>
          <textarea
            className="CreateTextarea CreateShortTextarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Work Notes</label>
          <textarea
            className="CreateTextarea CreateWorkNotesTextarea"
            name="workNotes"
            value={formData.workNotes}
            onChange={handleChange}
            placeholder="Enter work notes..."
          ></textarea>
        </div>

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button className="CreateBtn" type="button" onClick={handleSave}>
            Save
          </button>
          <button className="CreateBtn" type="button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="CreateBtn" type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </AccountsLayout>
  );
}

export default AccountsCreateNewCase;
