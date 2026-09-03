import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";

import HrmsLeftLayout from "../../Hrmsleftlayout";

import "./index.css";

function HRSaves() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    caseId: "",
    requesterName: "",
    category: "",
    subCategory: "",
    urgency: "",
    shortDescription: "",
    description: "",
    status: "",
    subStatus: "",
    assignmentGroup: "",
    assignTo: "",
    workNotes: "",
  });

  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    fetchApiData("/api/employees")
      .then((res) => setEmployeeList(res.data || []))
      .catch((err) => console.log(err));
  }, []);

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
      if (groupUpper === "PATROLLING" || groupUpper === "PETROLINK") return deptUpper.includes("PATROL") || deptUpper.includes("SECURITY");
      return deptUpper.includes(groupUpper);
    });

    return filtered.length > 0 ? filtered : employeeList;
  };

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
          requester: d.requester || d.requesterName,
          createdOn: createdOnStr,

          requesterName: d.requesterName || "",
          requesterFor: d.requesterFor || "",
          category: d.category || "",
          subCategory: d.subCategory || "",
          urgency: d.urgency || "",
          shortDescription: d.shortDescription || "",
          description: d.description || "",
          status: d.status || "Open",
          subStatus: d.subStatus || "",
          assignmentGroup: d.assignmentGroup || "",
          workNotes: d.workNotes || "",
        });
      } catch (error) {
        console.log(error);
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

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        assignedTo: formData.assignTo || formData.assignedTo || "",
      };
      await sendApiData(`/api/hrrequests/${id}`, payload, "put");
      alert("Case Updated Successfully");
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
      alert("Case Submitted Successfully!");

      const grp = (formData.assignmentGroup || "").toUpperCase();
      if (grp.includes("ACC") || grp.includes("FINANCE")) {
        navigate("/accounts/cases/all");
      } else {
        navigate("/hrms/hrsavescases");
      }
    } catch (error) {
      console.error(error);
      alert("Error Submitting Case");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <HrmsLeftLayout>
      <div className="CreateContainer">
        <h2 className="CreateTitle">HR CASE</h2>

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
            <select name="department">
              <option>HR</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
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
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
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
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
            >
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
                  <option value="Conflict Resolution">
                    Conflict Resolution
                  </option>
                  <option value="Grievance">Grievance</option>
                  <option value="Feedback">Feedback</option>
                </>
              )}
            </select>
          </div>

          <div className="CreateField">
            <label>Assignment Group</label>
            <select
              name="assignmentGroup"
              value={formData.assignmentGroup}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="CNC">CNC</option>
              <option value="Accounts">Accounts</option>
              <option value="Operations">Operations</option>
              <option value="PetroLink">Petroling</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Assign To</label>
            <select
              name="assignTo"
              value={formData.assignTo || ""}
              onChange={handleChange}
            >
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
            <select name="impact" value={formData.impact || ""} onChange={handleChange}>
              <option value="">Select</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Urgency</label>
            <select name="urgency" value={formData.urgency || ""} onChange={handleChange}>
              <option value="">Select</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Priority</label>
            <input name="priority" value={formData.priority || ""} onChange={handleChange} />
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
            value={formData.shortDescription || ""}
            readOnly
          ></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description || ""}
            readOnly
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

export default HRSaves;
