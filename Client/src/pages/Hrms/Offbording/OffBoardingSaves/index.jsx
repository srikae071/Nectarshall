import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CncLeftLayout from "../../../Cnc/CncLeftLayout";
import { fetchApiData, sendApiData } from "../../../../utils/apiClient";
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
      const response = await fetchApiData(`/api/jobrequests/${id}`);

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
    console.log("Clicked Task 1");

    try {
      await sendApiData(
        `/api/jobrequests/create-it-task/${id}`,
        {}
      );

      console.log("Navigating to /hrreq-all");

      navigate("/hrreq-all");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      await sendApiData(
        `/api/jobrequests/${id}`,
        formData,
        "put"
      );

      alert("Saved Successfully");

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CncLeftLayout>
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
              <div className="OBSTaskGrid">
                <div className="OBSTaskInfo">
                  <div className="OBSTaskTitle">Task 1 - IT Clearance</div>
                </div>

                <div className="OBSTaskItem">
                  <label>Status</label>
                  <span className="OBSStatus">{formData.taskStatus}</span>
                </div>

                <div className="OBSTaskItem">
                  <label>Laptop Recovered</label>
                  <span className="OBSTaskValue">
                    {formData.laptopRecovered || "N/A"}
                  </span>
                </div>

                <div className="OBSTaskItem">
                  <label>Working Condition</label>
                  <span className="OBSTaskValue">
                    {formData.laptopWorkingCondition || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="OBSTaskCard"
              onClick={() => navigate(`/offboarding/finance-clearance/${id}`)}
            >
              <div className="OBSTaskGrid">
                <div className="OBSTaskInfo">
                  <div className="OBSTaskTitle">Task 2 - Finance Clearance</div>
                </div>
              </div>
            </div>

            <div
              className="OBSTaskCard"
              onClick={() => navigate(`/offboarding/admin-clearance/${id}`)}
            >
              <div className="OBSTaskGrid">
                <div className="OBSTaskInfo">
                  <div className="OBSTaskTitle">Task 3 - Admin Clearance</div>
                </div>
              </div>
            </div>
            {formData.ItTAskStatus === "Closed" && (
              <div
                className="OBSTaskCard"
                onClick={() => navigate(`/offboarding/hr-clearance/${id}`)}
              >
                <div className="OBSTaskGrid">
                  <div className="OBSTaskInfo">
                    <div className="OBSTaskTitle">Task 4 - HR Clearance</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CncLeftLayout>
  );
}

export default OffBoardingSaves;
