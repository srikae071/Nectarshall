import Hrmsleftlayout from "../../Hrmsleftlayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function Interview() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/jobrequests",
      );

      setData(
        response.data.filter(
          (item) =>
            // item.category === "" &&
            item.status === "Interview",
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleRowClick = (item) => {
    navigate(`/OnBoardingInterviewSaves/${item._id}`);
  };
  return (
    <Hrmsleftlayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Interview </h3>

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
                  <tr
                    className="opentablerow"
                    key={item._id}
                    a
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: "pointer" }}
                  >
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
    </Hrmsleftlayout>
  );
}

export default Interview;
