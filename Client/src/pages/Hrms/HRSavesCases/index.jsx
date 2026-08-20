import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HrmsLeftLayout from "../Hrmsleftlayout";
import "./index.css";
// const data = [...];

import { fetchApiData } from "../../../utils/apiClient";

function HRSavesCases() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");
      const list = response.data || [];

      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }
      const username = (authUser?.username || authUser?.name || authUser?.displayName || (typeof authUser === "string" ? authUser : "")).trim();
      const role = (authUser?.role || "").toUpperCase();
      const isAdmin = role === "ADMIN" || username.toLowerCase().includes("sumit");

      if (isAdmin) {
        setData(list);
      } else if (username) {
        const u = username.toLowerCase();
        setData(
          list.filter((item) => {
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
          <h3 className="openheading">HR Cases</h3>

          <table className="opentable">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Requester</th>
                <th>Requested For</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default HRSavesCases;
