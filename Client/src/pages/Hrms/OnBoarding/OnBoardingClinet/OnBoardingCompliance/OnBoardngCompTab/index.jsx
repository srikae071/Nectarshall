import HrmsLeftLayout from "../../../../Hrmsleftlayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

function OnBoardingCompTab() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/compliance",
      );

      const filteredData = response.data.filter(
        (item) => item.category === "Onboarding Client Compliance",
      );

      setData(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (item) => {
    navigate(`/onboarding-compliance-save/${item._id}`);
  };

  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Onboarding Client Compliance</h3>

          <table className="opentable">
            <thead>
              <tr className="opentablerow">
                <th>Case ID</th>
                <th>Company Name</th>
                <th>Email Address</th>
                <th>Onboarding Date</th>
                <th>Valid Till</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Records Found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.complianceNumber}</td>
                    <td>{item.companyName}</td>
                    <td>{item.emailaddress}</td>
                    <td>{item.onboardingDate}</td>
                    <td>{item.validtill}</td>
                    <td>{item.status}</td>
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

export default OnBoardingCompTab;
