import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountsLayout from "../../AccountsLayout";
import { fetchApiData } from "../../../../utils/apiClient";
import "../../../Hrms/HRSavesCases/index.css";

function AccountsAllCases() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccountsCases();
  }, []);

  const fetchAccountsCases = async () => {
    try {
      const response = await fetchApiData("/api/hrrequests");
      const list = (response.data || []).filter((item) => {
        const grp = (item.assignmentGroup || "").toUpperCase();
        return grp.includes("ACC") || grp.includes("FINANCE");
      });
      setData(list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AccountsLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Accounts Cases (All)</h3>

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
                    No Accounts Cases Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AccountsLayout>
  );
}

export default AccountsAllCases;
