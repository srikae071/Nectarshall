import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import axios from "axios";

import HrmsLeftLayout from "../../Hrmsleftlayout";

import "./index.css";

function HRSaves() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    caseId: "",
    requesterName: "",
    category: "",
    urgency: "",
    shortDescription: "",
    description: "",
    status: "",
    subStatus: "",
    assignmentGroup: "",
    workNotes: "",
  });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/hrrequests/${id}`,
        );

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
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/hrrequests/${id}`,
        formData,
      );

      alert("Case Updated Successfully");
    } catch (error) {
      console.log(error);
    }
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
              value={formData.requesterName}
              readOnly
            />
          </div>

          <div className="CreateField">
            <label>Department</label>
            <select name="department">
              <option>HR</option>
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
            <select name="category">
              <option>Payroll</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Assignment Group</label>
            <input name="assignmentGroup" />
          </div>

          <div className="CreateField">
            <label>Assign To</label>
            <input name="assignTo" />
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

            <select name="urgency">
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

        <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea
            className="CreateTextarea CreateDescriptionTextarea"
            name="description"
            value={formData.description}
            readOnly
          ></textarea>
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
    </HrmsLeftLayout>
  );
}

export default HRSaves;
