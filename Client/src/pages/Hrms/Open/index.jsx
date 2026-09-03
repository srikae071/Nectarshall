import HrmsLeftLayout from "../Hrmsleftlayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { fetchApiData } from "../../../utils/apiClient";
import { checkHasHrAccess } from "../../../context/AuthContext";

function Open() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchOpenCases();
  }, []);

  const fetchOpenCases = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");
      const hrCases = (response.data || []).filter(
        (item) => !item.assignmentGroup || item.assignmentGroup.trim() === "" || item.assignmentGroup.toUpperCase() === "HR"
      );
      const openCases = hrCases.filter((item) => (item.status || "Open").toLowerCase() === "open");

      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }

      const isHrOrAdmin = checkHasHrAccess(authUser);

      if (isHrOrAdmin) {
        setData(openCases);
      } else if (authUser) {
        const u = (authUser?.username || authUser?.name || authUser?.displayName || "").toLowerCase().trim();
        setData(
          openCases.filter((item) => {
            const r1 = (item.requester || "").toLowerCase();
            const r2 = (item.requesterFor || "").toLowerCase();
            const r3 = (item.assignedTo || "").toLowerCase();
            return r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2.includes(u) || r3.includes(u);
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
          <h3 className="openheading">Open Cases</h3>

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
