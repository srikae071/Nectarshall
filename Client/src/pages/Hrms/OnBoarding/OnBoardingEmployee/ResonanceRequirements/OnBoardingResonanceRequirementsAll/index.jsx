import HrmsLeftLayout from "../../../../Hrmsleftlayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApiData } from "../../../../../../utils/apiClient";
import "./index.css";

function OnBoardingResonanceRequirementsAll() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchApiData("/api/jobrequests");
      const list = (response.data || []).filter(
        (item) =>
          item.category !== "Offboarding" &&
          item.category !== "offboarding" &&
          item.category !== "Exit",
      );
      setData(list);
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleRowClick = (item) => {
    sessionStorage.setItem("onboardingSource", "all");
    navigate(`/employee-request-save/${item._id}?source=all`);
  };

  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">All Onboarding Cases (Every Status)</h3>

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
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="opentablerow">{item.caseId}</td>
                    <td className="opentablerow">{item.requesterName}</td>
                    <td className="opentablerow">{item.department}</td>
                    <td className="opentablerow">{item.category || "Resonance Requirement"}</td>
                    <td className="opentablerow">
                      <span className={`badge ${(item.status || "Open").toLowerCase()}`}>
                        {item.status || "Open"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default OnBoardingResonanceRequirementsAll;
