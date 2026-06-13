import ItLeftSide from "../../ItLeftSide";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function ItClosed() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchclosedCases();
  }, []);

  const fetchclosedCases = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/itrequests",
      );

      const closedCases = response.data.filter(
        (item) => item.status === "Closed",
      );

      setData(closedCases);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ItLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Closed Cases</h3>

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
              {data.map((item) => (
                <tr className="opentablerow" key={item._id}>
                  <td className="opentablerow">{item.incidentNumber}</td>

                  <td className="opentablerow">{item.requester}</td>

                  <td className="opentablerow">IT</td>

                  <td className="opentablerow">{item.category}</td>

                  <td className="opentablerow">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ItLeftSide>
  );
}

export default ItClosed;
