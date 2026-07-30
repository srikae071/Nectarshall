import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";

import ItLeftSide from "../../../NavItems/IT/ItLeftSide";

import "./index.css";

function ItSaves() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    caseId: "",
    requester: "",
    requesterFor: "",
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

export default ItSaves;
