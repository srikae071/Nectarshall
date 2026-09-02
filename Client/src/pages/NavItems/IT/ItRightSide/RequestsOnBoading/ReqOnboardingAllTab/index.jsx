import ItLeftSide from "../../../ItLeftSide";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchApiData } from "../../../../../../utils/apiClient";
import "./index.css";

function ReqOnboardingAllTab() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");
      const allItems = response.data || [];
      const filtered = allItems.filter(
        (item) =>
          item.category === "Onboarding" ||
          item.category === "onboarding" ||
          item.category === "Resonance Requirement" ||
          item.onboardingTaskId ||
          item.taskType === "IT Onboarding"
      );
      setData(filtered.length > 0 ? filtered : allItems);
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleRowClick = (item) => {
    navigate(`/requests-onboarding-saves/${item._id}`);
  };
  return (
    <ItLeftSide>
      <div className="Openhome">
        <div>
          <h3 className="openheading">All Onboarding Requests</h3>

          <table className="opentable">
            <thead className="opentablerow">
              <tr className="opentablerow">
                <th className="opentablerow">Task ID</th>

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
                    <td className="opentablerow">{item.onboardingTaskId}</td>
                    <td className="opentablerow">{item.caseId}</td>
                    <td className="opentablerow">{item.requesterName}</td>
                    <td className="opentablerow">{item.department}</td>
                    <td className="opentablerow">{item.category}</td>
                    <td className="opentablerow">{item.onboardingStatus}</td>
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
    </ItLeftSide>
  );
}

export default ReqOnboardingAllTab;
