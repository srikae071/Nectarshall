import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ItLeftside from "../../ItLeftSide";

import "./index.css";

function ITCreateCase() {
  const { user } = useAuth();
  const currentUserName = user?.displayName || user?.username || "Employee";

  const [formData, setFormData] = useState({
    caseId: "",
    requesterName: currentUserName,
    department: "",
    status: "",
    subStatus: "",
    category: "",
    assignmentGroup: "",
    assignTo: "",
    impact: "",
    urgency: "",
    priority: "",
    shortDescription: "",
    description: "",
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/itrequests/${id}`,
        );

        setFormData({
          requesterName: response.data.requesterName || "",
          requesterFor: response.data.requesterFor || "",
          category: response.data.category || "",
          subCategory: response.data.subCategory || "",
          urgency: response.data.urgency || "",
          shortDescription: response.data.shortDescription || "",
          description: response.data.description || "",
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
  const subStatusOptions = {
    Pending: ["Request Information Pending", "Vendor Action Pending"],
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSave = async () => {
  //   try {
  //     const response = await axios.post(
  //       "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/cases/create",
  //       formData,
  //     );

  //     alert("Case Saved Successfully");

  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Error Saving Case");
  //   }
  // };
  const handleSave = async () => {
    console.log("FORM DATA BEFORE SAVE:", formData);
    try {
      console.log("Sending:", formData);

      const response = await axios.post(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/itrequests/create",
        {
          ...formData,
          requestType: "IT",
        },
      );

      console.log(response.data);

      alert("IT Request Saved Successfully");

      setFormData({
        requester: "",
        requesterFor: "",
        category: "",
        subCategory: "",
        urgency: "",
        shortDescription: "",
        description: "",
        workNotes: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error Saving Request");
    }
  };
  return (
    <ItLeftside>
      <div className="CreateContainer">
        <h2 className="CreateTitle">Create New Case</h2>

        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Case ID</label>
            <input
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Requester Name</label>
            <input
              name="requesterName"
              value={currentUserName || formData.requesterName}
              readOnly
              disabled
              style={{ background: "#f1f5f9", cursor: "not-allowed" }}
            />
          </div>

          <div className="CreateField">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
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
            <select
              name="subStatus"
              value={formData.subStatus}
              onChange={handleChange}
              disabled={formData.status !== "Pending"}
            >
              <option value="">Select Sub Status</option>

              {subStatusOptions[formData.status]?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="CreateField">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Payroll</option>
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
            <input
              name="assignTo"
              value={formData.assignTo}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Impact</label>

            <select
              name="impact"
              value={formData.impact}
              onChange={handleChange}
            >
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

            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="CreateField">
            <label>Priority</label>
            <input
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            />
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

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button className="CreateBtn" onClick={handleSave}>
            Save
          </button>
          <button className="CreateBtn">Submit</button>
          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </ItLeftside>
  );
}

export default ITCreateCase;
