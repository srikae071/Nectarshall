import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import AskForItNavBar from "../AskForItNavBar";
import "./index.css";

function MainAFI() {
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
        const response = await axios.get(
          `http://localhost:5000/api/itrequests/${id}`,
        );

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
    Network: ["Router", "LAN", "WAN"],
    Application: ["Zoho", "Guard House", "Light House"],
    "Desk Side Support": ["Laptop Issue", "Printer Issue", "System Slow"],
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

      const response = await axios.post(
        "http://localhost:5000/api/itrequests/create",
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
      <AskForItNavBar />

      <div className="CreateContainer">
        {/* ROW 1 */}
        <div className="CreateRow">
          <div className="CreateField">
            <label>Requester</label>
            <input
              name="requester"
              value={formData.requester}
              onChange={handleChange}
            />
          </div>

          <div className="CreateField">
            <label>Requester For</label>
            <input
              name="requesterFor"
              value={formData.requesterFor}
              onChange={handleChange}
            />
          </div>
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
              <option value="Network">Network</option>
              <option value="Application">Application</option>
              <option value="Desk Side Support">Desk Side Support</option>
            </select>
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

        {/* SHORT DESCRIPTION */}
        <div className="CreateTextareaGroup">
          <label>Short Description</label>

          <textarea
            className="CreateTextarea shortTextarea"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="CreateTextareaGroup">
          <label>Description</label>

          <textarea
            className="CreateTextarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* BUTTONS */}
        <div className="CreateFooter">
          <button className="CreateBtn" onClick={handleSave}>
            Save
          </button>

          <button className="CreateBtn">Cancel</button>
        </div>
      </div>
    </>
  );
}

export default MainAFI;
