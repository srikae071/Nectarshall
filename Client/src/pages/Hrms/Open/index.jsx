import HrmsLeftLayout from "../Hrmsleftlayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { fetchApiData } from "../../../utils/apiClient";

function Open() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchOpenCases();
  }, []);

  const fetchOpenCases = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");

      const openCases = response.data.filter((item) => item.status === "Open");

      setData(openCases);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Open Cases</h3>

          <table className="opentable">
            <thead className="opentablerow">
              <tr className="opentablerow">
                <th>Incident ID</th>
                <th>Requester</th>
                <th>Requester For</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className="opentablerow">
              {data.map((item) => (
                <tr
                  className="opentablerow"
                  key={item._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/hrms/HRsaves/${item._id}`)}
                >
                  <td>{item.incidentNumber || "N/A"}</td>
                  <td>{item.requester || "N/A"}</td>
                  <td>{item.requesterFor || "N/A"}</td>
                  <td>{item.category || "N/A"}</td>
                  <td>{item.subCategory || "N/A"}</td>
                  <td>{item.status || "Open"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default Open;
