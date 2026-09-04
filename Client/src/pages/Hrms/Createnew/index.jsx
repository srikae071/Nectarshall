import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HrmsLeftLayout from "../Hrmsleftlayout";
import { fetchApiData, sendApiData } from "../../../utils/apiClient";
import "../SavedForms/HRSaves/index.css";

function CreateCase() {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");

  const [formData, setFormData] = useState({
    caseId: "",
    incidentNumber: "",
    requester: "",
    requesterName: "",
    department: "HR",
    category: "",
    subCategory: "",
    assignmentGroup: "HR",
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

    const name = authUser?.displayName || authUser?.name || authUser?.username || "HR User";
    setCurrentUserName(name);
    setFormData((prev) => ({
      ...prev,
      requester: name,
      requesterName: name,
    }));

    fetchApiData("/api/employees")
      .then((res) => setEmployeeList(res.data || []))
      .catch((err) => console.error(err));

    fetchApiData("/api/hrrequests")
      .then((res) => {
        const list = res.data || [];
        const numbers = list
          .map((item) => {
            const str = item.incidentNumber || item.caseId || "";
            const match = str.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
          })
          .filter((n) => !isNaN(n));

        const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
        const nextNum = maxNum + 1;
        const nextCaseId = `HR${String(nextNum).padStart(3, "0")}`;
        setFormData((prev) => ({
          ...prev,
          caseId: nextCaseId,
          incidentNumber: nextCaseId,
        }));
      })
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
        department: formData.department || "HR",
        status: "Draft",
        assignedTo: formData.assignTo || "",
      };
      await sendApiData("/api/hrrequests/create", payload, "post");
      alert("HR Case Saved as Draft Successfully!");
      navigate("/hrms/hrsavescases");
    } catch (error) {
      console.error(error);
      alert("Error Saving HR Case as Draft");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        ...formData,
        department: formData.department || "HR",
        assignedTo: formData.assignTo || "",
      };

      await sendApiData("/api/hrrequests/create", payload, "post");
      alert("HR Case Submitted Successfully!");

      const grp = (formData.assignmentGroup || "").toUpperCase();
      if (grp.includes("ACC") || grp.includes("FINANCE")) {
        navigate("/accounts/cases/all");
      } else {
        navigate("/hrms/hrsavescases");
      }
    } catch (error) {
      console.error(error);
      alert("Error Submitting HR Case");
    }
  };

  const handleCancel = () => {
    navigate("/hrms/hrsavescases");
  };

  return (
    <HrmsLeftLayout>
      <div className="CreateContainer">
        <h2 className="CreateTitle">HR CASE - CREATE NEW</h2>

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
            <select name="department" value="HR" readOnly>
              <option value="HR">HR</option>
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
              <option value="Leave Request">Leave Request</option>
              <option value="Payroll Query">Payroll Query</option>
              <option value="Employee Relations">Employee Relations</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Sub Category</label>
            <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
              <option value="">Select</option>
              {formData.category === "Leave Request" && (
                <>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </>
              )}
              {formData.category === "Payroll Query" && (
                <>
                  <option value="Salary Issue">Salary Issue</option>
                  <option value="Tax Query">Tax Query</option>
                  <option value="Bonus Query">Bonus Query</option>
                </>
              )}
              {formData.category === "Employee Relations" && (
                <>
                  <option value="Conflict Resolution">Conflict Resolution</option>
                  <option value="Grievance">Grievance</option>
                  <option value="Feedback">Feedback</option>
                </>
              )}
            </select>
          </div>

          <div className="CreateField">
            <label>Assignment Group</label>
            <select name="assignmentGroup" value={formData.assignmentGroup} onChange={handleChange}>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="CNC">CNC</option>
              <option value="Accounts">Accounts</option>
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
                    {name} [{emp.department || "Dept"}]
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
    </HrmsLeftLayout>
  );
}

export default CreateCase;
