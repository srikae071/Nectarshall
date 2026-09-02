import ItLeftSide from "../../ItLeftSide";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { fetchApiData } from "../../../../../utils/apiClient";

function ItOpen() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetchApiData("/api/itrequests");

      const openCases = response.data.filter((item) => item.status === "Open");

      setData(openCases);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ItLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Open Cases</h3>

          <table className="opentable">
            <thead className="opentablerow">
              <tr className="opentablerow">
                <th className="opentablerow">Incident ID</th>
                <th className="opentablerow">Requester</th>
                <th className="opentablerow">Department</th>
                <th className="opentablerow">Category</th>
                <th className="opentablerow">Status</th>
              </tr>
            </thead>

            <tbody className="opentablerow">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    className="opentablerow"
                    key={item._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/hrms/itsaves/${item._id}`)}
                  >
                    <td className="opentablerow">{item.incidentNumber}</td>
                    <td className="opentablerow">{item.requester}</td>
                    <td className="opentablerow">IT</td>
                    <td className="opentablerow">{item.category}</td>
                    <td className="opentablerow">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ItLeftSide>
  );
}

export default ItOpen;
