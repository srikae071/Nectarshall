// import HrmsLeftLayout from "../Hrmsleftlayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import AshrNavBar from "../AshrNavBar";
import "./index.css";
import { fetchApiData, sendApiData } from "../../../utils/apiClient";

function AskForHrMainPage() {
  const [formData, setFormData] = useState({
    requester: "",
    requesterFor: "",
    category: "",
    subCategory: "",
    urgency: "",
    shortDescription: "",
    description: "",
  });
  const { id } = useParams();
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetchApiData(`/api/itrequests/${id}`);
        setFormData({
          requester: response.data.requester || "",
          requesterFor: response.data.requesterFor || "",
          category: response.data.category || "",
          subCategory: response.data.subCategory || "",
          urgency: response.data.urgency || "",
          shortDescription: response.data.shortDescription || "",
          description: response.data.description || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchRequest();
    }
  }, [id]);
  const subCategoryOptions = {
    "Leave Request": ["Sick Leave", "Casual Leave", "Earned Leave"],
    "Payroll Query": ["Salary Issue", "Tax Query", "Bonus Query"],
    "Employee Relations": ["Conflict Resolution", "Grievance", "Feedback"],
  };
  const handleChange = (e) => {
    console.log("name:", e.target.name, "value:", e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSave = async () => {
    console.log("FORM DATA BEFORE SAVE:", formData);
    try {
      console.log("Sending:", formData);

      const response = await sendApiData("/api/hrrequests/create", {
        ...formData,
        requestType: "HR",
      });

      console.log(response.data);

      alert("HR Request Saved Successfully");

      setFormData({
        requester: "",
        requesterFor: "",
        category: "",
        subCategory: "",
        urgency: "",
        // shortDescription: "",
        // description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error Saving Request");
    }
  };

  return (
    <>
      <AshrNavBar />

      <div className="CreateContainer">
        {/* <h2 className="CreateTitle">Create New Case</h2> */}

        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Requested</label>
            <input
              name="requester"
              value={formData.requester}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Requested For</label>
            <input
              name="requesterFor"
              value={formData.requesterFor}
              onChange={handleChange}
            />
          </div>

          {/* <div className="CreateField">
          <label>Department</label>
          <select>
            <option>IT</option>
          </select>
        </div> */}
        </div>

        {/* ROW 2 */}
        <div className="CreateRow">
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
            {/* <select>
            <option>Status</option>
          </select> */}
          </div>
          <div className="CreateField">
            <label>Sub Category</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              disabled={!formData.category}
            >
              <option value="">Select</option>

              {subCategoryOptions[formData.category]?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {/* <select>
            <option>Pending</option>
          </select> */}
          </div>

          <div className="CreateField">
            <label>Urgency</label>

            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        {/* <div className="CreateRow">
        <div className="CreateField">
          <label>Assignment Group</label>
          <input />
        </div>

        <div className="CreateField">
          <label>Assign To</label>
          <input />
        </div>

        <div className="CreateField">
          <label>Impact</label>
          <input />
        </div>
      </div> */}

        {/* ROW 4 */}
        {/* <div className="CreateRow">
        <div className="CreateField">
          <label>Urgency</label>
          <input />
        </div>

        <div className="CreateField">
          <label>Priority</label>
          <input />
        </div>
      </div> */}

        {/* TEXTAREAS */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>
          <textarea
            className="CreateTextarea shortTextarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="CreateTextareaGroup">
          <label>Description</label>
          <textarea
            className="CreateTextarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button
            type="button"
            className="CreateBtn btn-cancel"
            onClick={() =>
              setFormData({
                requesterName: "",
                category: "",
                urgency: "",
                shortDescription: "",
                description: "",
              })
            }
          >
            Cancel
          </button>

          <button type="button" className="CreateBtn btn-save" onClick={handleSave}>
            Save
          </button>

          <button type="button" className="CreateBtn btn-submit" onClick={handleSave}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default AskForHrMainPage;
