import HrmsLeftLayout from "../Hrmsleftlayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "./index.css";

import { fetchApiData } from "../../../utils/apiClient";

function Assigntome() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAssingtomecases();
  }, []);

  const fetchAssingtomecases = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");
      const list = (response.data || []).filter(
        (item) => !item.assignmentGroup || item.assignmentGroup.trim() === "" || item.assignmentGroup.toUpperCase() === "HR"
      );

      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }

      const username = (authUser?.username || authUser?.name || authUser?.displayName || "").toLowerCase().trim();

      if (username) {
        setData(
          list.filter((item) => {
            const assigned = (item.assignedTo || "").toLowerCase().trim();
            return assigned && (assigned.includes(username) || username.includes(assigned));
          })
        );
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Assigned Cases</h3>

          <table className="opentable">
            <thead className="opentablerow">
              <tr className="opentablerow">
                <th>Incident ID</th>
                <th>Requester</th>
                <th>Requested For</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className="opentablerow">
              {data.map((item) => (
                <tr
                  className="opentablerow"
                  key={item.id}
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

        {/* <div className="footer">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div> */}
      </div>
    </HrmsLeftLayout>
  );
}

export default Assigntome;
