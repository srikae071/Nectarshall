import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ItLeftSide from "../../ItLeftSide";
import "./index.css";
// const data = [...];

function ItNavMain() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/itrequests",
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ItLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">IT Tasks</h3>

          <table className="opentable">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Requester</th>
                <th>Department</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/hrms/itsaves/${item._id}`)}
                  >
                    <td>{item.incidentNumber}</td>
                    <td>{item.requester}</td>
                    <td>{item.department}</td>
                    <td>{item.category}</td>
                    <td>{item.status}</td>
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

export default ItNavMain;
