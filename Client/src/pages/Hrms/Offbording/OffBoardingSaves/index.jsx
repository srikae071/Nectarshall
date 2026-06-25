import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HrmsLeftLayout from "../../../Hrms/Hrmsleftlayout";
import axios from "axios";
import "./index.css";

function OffBoardingSaves() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    caseId: "",
    requesterName: "",
    resignationDate: "",
    lastWorkingDay: "",
    resignationReason: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
      );

      setFormData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const openITTask = async () => {
    try {
      await axios.post(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/create-it-task/${id}`,
      );

      navigate("/it-all");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests/${id}`,
        formData,
      );

      alert("Saved Successfully");

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <HrmsLeftLayout>
      <div className="OBSContainer">
        <div className="OBSCard">
          <h3 className="OBSHeading">Offboarding Employee Details</h3>

          <div className="OBSRow">
            <div className="OBSField">
              <label>Case ID</label>
              <input value={formData.caseId || ""} readOnly />
            </div>

            <div className="OBSField">
              <label>Requester Name</label>
              <input value={formData.requesterName || ""} readOnly />
            </div>
          </div>

          <div className="OBSRow">
            <div className="OBSField">
              <label>Date of Resignation</label>
              <input
                value={
                  formData.resignationDate
                    ? new Date(formData.resignationDate).toLocaleDateString()
                    : ""
                }
                readOnly
              />
            </div>

            <div className="OBSField">
              <label>Last Working Day</label>
              <input
                value={
                  formData.lastWorkingDay
                    ? new Date(formData.lastWorkingDay).toLocaleDateString()
                    : ""
                }
                readOnly
              />
            </div>
          </div>

          <div className="OBSRow">
            <div className="OBSField">
              <label>Resignation Reason</label>
              <input value={formData.resignationReason || ""} readOnly />
            </div>

            <div className="OBSField">
              <label>Status</label>

              <input type="text" value={formData.status || ""} readOnly />
            </div>
          </div>

          <div className="OBSDescription">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="OBSFooter">
            <button className="OBSButton" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        {formData.status === "Approved" && (
          <div className="OBSCard">
            <h3 className="OBSTaskHeading">Offboarding Clearance Tasks</h3>

            <div className="OBSTaskCard" onClick={openITTask}>
              <div>
                <h4 className="OBSTaskTitle">Task 1</h4>

                <p className="OBSTaskSubTitle">IT Clearance</p>
              </div>
            </div>

            <div
              className="OBSTaskCard"
              onClick={() => navigate(`/offboarding/finance-clearance/${id}`)}
            >
              <div>
                <h4 className="OBSTaskTitle">Task 2</h4>

                <p className="OBSTaskSubTitle">Finance Clearance</p>
              </div>
            </div>

            <div
              className="OBSTaskCard"
              onClick={() => navigate(`/offboarding/admin-clearance/${id}`)}
            >
              <div>
                <h4 className="OBSTaskTitle">Task 3</h4>

                <p className="OBSTaskSubTitle">Admin Clearance</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </HrmsLeftLayout>
  );
}

export default OffBoardingSaves;
