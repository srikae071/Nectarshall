import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";

import ItLeftSide from "../../../NavItems/IT/ItLeftSide";

import "./index.css";

function ITSaves() {
  const { id } = useParams();

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

        setFormData({
          caseId: response.data.incidentNumber || "",
          requester: response.data.requester || response.data.requesterName,

          requesterName: response.data.requesterName || "",
          requesterFor: response.data.requesterFor || "",
          category: response.data.category || "",
          urgency: response.data.urgency || "",
          shortDescription: response.data.shortDescription || "",
          description: response.data.description || "",
          status: response.data.status || "Open",
          subStatus: response.data.subStatus || "",
          assignmentGroup: response.data.assignmentGroup || "",
          workNotes: response.data.workNotes || "",
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
    console.log(formData);
  };
  const handleSave = async () => {
    try {
      await sendApiData(
        `/api/itrequests/${id}`,
        formData,
        "put"
      );

      alert("Case Updated Successfully");
    } catch (error) {
      console.log(error);
    }
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
            <input name="requester" value={formData.requester} readOnly />
          </div>

          <div className="CreateField">
            <label>Department</label>
            <select name="department">
              <option>IT</option>
            </select>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="Open">Open</option>
              <option value="Work In Progress">Work In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Sub Status</label>
            <select name="subStatus">
              <option value="">Select Sub Status</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Category</label>
            <select name="category" value={formData.category} readOnly>
              <option>{formData.category}</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="CreateRow">
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

          <div className="CreateField">
            <label>Impact</label>

            <select name="impact">
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* ROW 4 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Urgency</label>

            <select name="urgency" value={formData.urgency} readOnly>
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Priority</label>
            <input name="priority" />
          </div>
        </div>

        {/* TEXTAREAS */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>
          <textarea
            className="CreateTextarea CreateShortTextarea"
            name="shortDescription"
            value={formData.shortDescription}
            readOnly
          ></textarea>
        </div>

        {/* <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description}
            readOnly
          ></textarea>
        </div> */}

        <div className="CreateTextareaGroup">
          <label>Description</label>

          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description}
            readOnly
          />
        </div>

        <div className="CreateTextareaGroup">
          <label>Work Notes</label>

          <textarea
            className="CreateTextarea CreateWorkNotesTextarea"
            name="workNotes"
            value={formData.workNotes}
            onChange={handleChange}
            placeholder="Enter work notes..."
          />
        </div>

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button className="CreateBtn" onClick={handleSave}>
            Save
          </button>
          <button className="CreateBtn">Submit</button>
          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </ItLeftSide>
  );
}

export default ITSaves;
