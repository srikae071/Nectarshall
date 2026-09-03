import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";

import ItLeftSide from "../../../NavItems/IT/ItLeftSide";

import "./index.css";

function ITSaves() {
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
        const response = await fetchApiData(`/api/itrequests/${id}`);
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
      await sendApiData(`/api/itrequests/${id}`, payload, "put");
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
      await sendApiData(`/api/itrequests/${id}`, payload, "put");
      alert("IT Case Submitted Successfully!");

      const statusLower = (formData.status || "Open").toLowerCase();
      if (statusLower.includes("wip") || statusLower.includes("work in progress")) {
        navigate("/it/work-in-progress");
      } else if (statusLower.includes("resolved")) {
        navigate("/it/resolved");
      } else if (statusLower.includes("closed")) {
        navigate("/it/closed");
      } else if (statusLower.includes("pending")) {
        navigate("/it/pending");
      } else if (statusLower.includes("open")) {
        navigate("/it/open");
      } else {
        navigate("/it/all");
      }
    } catch (error) {
      console.error(error);
      alert("Error Submitting IT Case");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <ItLeftSide>
      <div className="CreateContainer">
        <h2 className="CreateTitle">IT CASE</h2>

        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Case ID</label>
            <input name="caseId" value={formData.caseId} readOnly />
          </div>

          <div className="CreateField">
            <label>Requester Name</label>
            <input name="requester" value={formData.requester} onChange={handleChange} />
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
            <select name="department" value="IT" readOnly>
              <option value="IT">IT</option>
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
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Access">Access</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Sub Category</label>
            <select name="subCategory" value={formData.subCategory || ""} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Laptop/PC">Laptop/PC</option>
              <option value="Email/Account">Email/Account</option>
              <option value="VPN/Wifi">VPN/Wifi</option>
              <option value="Software Install">Software Install</option>
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
              <option value="PetroLink">PetroLink</option>
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
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Description</label>

          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="CreateTextareaGroup">
          <label>Work Notes</label>

          <textarea
            className="CreateTextarea CreateWorkNotesTextarea"
            name="workNotes"
            value={formData.workNotes || ""}
            onChange={handleChange}
            placeholder="Enter work notes..."
          />
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
    </ItLeftSide>
  );
}

export default ITSaves;
