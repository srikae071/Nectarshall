import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ItLeftSide from "../../../ItLeftSide";
import "./index.css";

function TaskSaves() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    taskId: "",
    laptopRecovered: "",
    laptopWorkingCondition: "",
  });

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
      );

      setFormData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        formData,
      );

      alert("IT Updated Successfully");

      fetchTask();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ItLeftSide>
      <div className="ITSContainer">
        <div className="ITSCard">
          <h2 className="ITSHeading">IT Recovery</h2>

          <div className="ITSRow">
            <div className="ITSField">
              <label>Task ID</label>

              <input value={formData.taskId || ""} readOnly />
            </div>
          </div>

          <div className="ITSRow">
            <div className="ITSField">
              <label>Laptop Recovered</label>

              <select
                name="laptopRecovered"
                value={formData.laptopRecovered || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div className="ITSField">
              <label>Laptop Working Condition</label>

              <select
                name="laptopWorkingCondition"
                value={formData.laptopWorkingCondition || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div className="ITSFooter">
            <button className="ITSButton" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </ItLeftSide>
  );
}

export default TaskSaves;
