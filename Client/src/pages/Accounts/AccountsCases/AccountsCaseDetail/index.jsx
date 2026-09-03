import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountsLayout from "../../AccountsLayout";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";
import "../../../Hrms/SavedForms/HRSaves/index.css";

function AccountsCaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);

  const [formData, setFormData] = useState({
    caseId: "",
    requesterName: "",
    requester: "",
    requesterFor: "",
    category: "",
    subCategory: "",
    urgency: "",
    impact: "",
    priority: "",
    shortDescription: "",
    description: "",
    status: "",
    subStatus: "",
    assignmentGroup: "Accounts",
    assignTo: "",
    workNotes: "",
  });

  useEffect(() => {
    fetchApiData("/api/employees")
      .then((res) => setEmployeeList(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetchApiData(`/api/hrrequests/${id}`);
        const d = response.data || {};
        const dateVal = d.createdAt || d.createdOn || d.timestamp;
        let createdOnStr = "N/A";
        if (dateVal) {
          try {
            const dt = new Date(dateVal);
            if (!isNaN(dt.getTime())) createdOnStr = dt.toLocaleString();
          } catch (e) {}
        }

        setFormData({
          caseId: d.incidentNumber || "",
          requester: d.requester || d.requesterName || "",
          requesterName: d.requesterName || d.requester || "",
          requesterFor: d.requesterFor || "",
          createdOn: createdOnStr,
          category: d.category || "",
          subCategory: d.subCategory || "",
          urgency: d.urgency || "Low",
          impact: d.impact || "Low",
          priority: d.priority || "3 - Moderate",
          shortDescription: d.shortDescription || "",
          description: d.description || "",
          status: d.status || "Open",
          subStatus: d.subStatus || "",
          assignmentGroup: d.assignmentGroup || "Accounts",
          assignTo: d.assignTo || d.assignedTo || "",
          workNotes: d.workNotes || "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchRequest();
    }
  }, [id]);

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
        assignedTo: formData.assignTo || formData.assignedTo || "",
      };
      await sendApiData(`/api/hrrequests/${id}`, payload, "put");
      alert("Accounts Case Updated Successfully");
    } catch (error) {
      console.error(error);
      alert("Error Updating Case");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        assignedTo: formData.assignTo || formData.assignedTo || "",
      };
      await sendApiData(`/api/hrrequests/${id}`, payload, "put");
      alert("Accounts Case Submitted Successfully!");
      navigate("/accounts/cases/all");
    } catch (error) {
      console.error(error);
      alert("Error Submitting Case");
    }
  };

  const handleCancel = () => {
    navigate("/accounts/cases/all");
  };

  return (
    <AccountsLayout>
      <div className="CreateContainer">
        <h2 className="CreateTitle">ACCOUNTS CASE DETAILS</h2>

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
              value={formData.requesterName || formData.requester || ""}
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
              <option value="Leave Request">Leave Request</option>
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

        {/* ROW 5 / BELOW */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Created On</label>
            <input name="createdOn" value={formData.createdOn || "N/A"} readOnly />
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

export default AccountsCaseDetail;
