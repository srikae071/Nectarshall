import HrmsLeftLayout from "../../../../Hrmsleftlayout/index.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function OnBoardingResonanceRequirementsAll() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobrequests");

      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">All Resonance Requirements cases</h3>

          <table className="opentable">
            <thead className="opentablerow">
              <tr className="opentablerow">
                <th className="opentablerow">Case ID</th>
                <th className="opentablerow">Requester Name</th>
                <th className="opentablerow">Department</th>
                <th className="opentablerow">Category</th>
                <th className="opentablerow">Status</th>
              </tr>
            </thead>
            <tbody className="opentablerow">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Records Found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr className="opentablerow" key={item._id}>
                    <td className="opentablerow">{item.caseId}</td>
                    <td className="opentablerow">{item.requesterName}</td>
                    <td className="opentablerow">{item.department}</td>
                    <td className="opentablerow">{item.category}</td>
                    <td className="opentablerow">{item.status}</td>
                  </tr>
                ))
              )}
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

export default OnBoardingResonanceRequirementsAll;
