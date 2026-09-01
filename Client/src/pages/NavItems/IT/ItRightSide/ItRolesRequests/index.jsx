import React, { useEffect, useState } from "react";
import ItLeftSide from "../../ItLeftSide";
import { fetchApiData, extractArrayData } from "../../../../../utils/apiClient";
import { useAuth } from "../../../../../context/AuthContext";
import "./index.css";

function ItRolesRequests() {
  const { user, checkIsItAdmin } = useAuth();
  const [roleRequestsList, setRoleRequestsList] = useState([]);
  const [approvedMap, setApprovedMap] = useState({});
  const [loading, setLoading] = useState(true);

  // IT & Admin authorization verification
  const isAuthorizedItAdmin = checkIsItAdmin ? checkIsItAdmin(user) : false;

  useEffect(() => {
    fetchRoleRequests();
  }, []);

  const fetchRoleRequests = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/employees");
      const employees = extractArrayData(res?.data || res);

      const allRequests = [];
      employees.forEach((emp) => {
        const empDisplayName = emp.displayName || emp.employeeName || "Employee";

        // 1. Extract from emp.roleRequests array
        if (emp.roleRequests && Array.isArray(emp.roleRequests)) {
          emp.roleRequests.forEach((req) => {
            allRequests.push({
              ...req,
              empId: emp._id,
              employeeName: req.employeeName || empDisplayName,
            });
          });
        }

        // 2. Extract from emp.activityLogs if role change request was recorded in log history
        if (emp.activityLogs && Array.isArray(emp.activityLogs)) {
          emp.activityLogs.forEach((logStr) => {
            if (typeof logStr === "string" && logStr.includes("Role change request placed")) {
              const match = logStr.match(/\[(.*?)\] Role change request placed to change role from '(.*?)' to '(.*?)'/);
              if (match) {
                const reqDate = match[1];
                const fromRole = match[2];
                const toRole = match[3];

                const exists = allRequests.some(
                  (r) => r.employeeName === empDisplayName && r.newRole === toRole && r.requestedAt === reqDate
                );
                if (!exists) {
                  allRequests.push({
                    id: `${emp._id}-${reqDate}-${toRole}`,
                    empId: emp._id,
                    employeeName: empDisplayName,
                    currentRole: fromRole,
                    newRole: toRole,
                    status: "Pending",
                    requestedAt: reqDate,
                  });
                }
              }
            }
          });
        }
      });

      // Show newest role change requests first
      allRequests.reverse();
      setRoleRequestsList(allRequests);
    } catch (err) {
      console.error("Error fetching role requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (reqId) => {
    // Show as Approved UI button feedback without mutating backend data
    setApprovedMap((prev) => ({ ...prev, [reqId]: true }));
  };

  if (!isAuthorizedItAdmin) {
    return (
      <ItLeftSide>
        <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
          <h3>Access Restricted</h3>
          <p>This Roles Requests section is restricted to IT Admins only (IT Profile + Admin Role).</p>
        </div>
      </ItLeftSide>
    );
  }

  return (
    <ItLeftSide>
      <div className="Openhome" style={{ padding: "20px" }}>
        <h3 className="openheading" style={{ color: "#008075", marginBottom: "20px" }}>
          IT Role Change Requests
        </h3>

        {loading ? (
          <div>Loading role change requests...</div>
        ) : (
          <table className="opentable" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="opentablerow">
                <th>Employee Name</th>
                <th>Current Role</th>
                <th>Requested New Role</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {roleRequestsList.length > 0 ? (
                roleRequestsList.map((req, idx) => {
                  const reqId = req.id || idx;
                  const isApproved = approvedMap[reqId] || req.status === "Approved";

                  return (
                    <tr key={reqId}>
                      <td style={{ fontWeight: "600" }}>{req.employeeName}</td>
                      <td>{req.currentRole || "Member"}</td>
                      <td style={{ color: "#0284c7", fontWeight: "700" }}>{req.newRole}</td>
                      <td>{req.requestedAt || "N/A"}</td>
                      <td>
                        {isApproved ? (
                          <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "6px", fontWeight: "700", fontSize: "12px" }}>
                            Approved
                          </span>
                        ) : (
                          <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 10px", borderRadius: "6px", fontWeight: "700", fontSize: "12px" }}>
                            Pending
                          </span>
                        )}
                      </td>
                      <td>
                        {isApproved ? (
                          <button
                            type="button"
                            disabled
                            style={{
                              background: "#16a34a",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              fontWeight: "700",
                              fontSize: "12.5px",
                              cursor: "default",
                            }}
                          >
                            ✓ Approved
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApprove(reqId)}
                            style={{
                              background: "#0284c7",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              fontWeight: "700",
                              fontSize: "12.5px",
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No Role Change Requests Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </ItLeftSide>
  );
}

export default ItRolesRequests;
