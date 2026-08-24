import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hrmsleftlayout from "../Hrmsleftlayout";
import { fetchApiData } from "../../../utils/apiClient";
import "./index.css";

function AllEmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/employees");
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = search.toLowerCase();
    const name = (
      emp.displayName ||
      emp.employeeName ||
      `${emp.firstName || ""} ${emp.lastName || ""}`
    ).toLowerCase();
    const title = (emp.jobTitle || "").toLowerCase();
    const dept = (emp.department || "").toLowerCase();
    const empId = (emp.employeeId || "").toLowerCase();
    return (
      name.includes(q) || title.includes(q) || dept.includes(q) || empId.includes(q)
    );
  });

  return (
    <Hrmsleftlayout>
      <div className="allEmployeesContainer">
        <div className="allEmployeesHeader">
          <div>
            <h2>Employee Management</h2>
            <p className="allEmployeesSub">
              Click anywhere on a line to view employee profile details
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="text"
              className="employeeSearchInput"
              placeholder="Search by name, title, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="addNewEmpBtn"
              onClick={() => navigate("/hrms/add-employee")}
            >
              + Add Employee
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loadingState">Loading employee records...</div>
        ) : (
          <div className="tableCard">
            <table className="allEmpTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Display Name</th>
                  <th>Role Level</th>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Employee ID</th>
                  <th>Email</th>
                  <th>Office Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#64748b",
                      }}
                    >
                      No employees found. Click "+ Add Employee" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, index) => {
                    const dispName =
                      emp.displayName ||
                      emp.employeeName ||
                      `${emp.firstName || ""} ${emp.lastName || ""}`.trim() ||
                      "Unnamed Employee";

                    const roleLevel = emp.subRole || (emp.role === "ADMIN" || emp.department === "Admin" ? "Admin" : `${emp.department || "HR"} Manager`);

                    return (
                      <tr
                        key={emp._id || index}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/hrms/employee/${emp._id}`)}
                        title="Click to open employee record"
                      >
                        <td style={{ fontWeight: "600", color: "#64748b" }}>
                          {index + 1}
                        </td>
                        <td style={{ fontWeight: "700", color: "#047857" }}>
                          {dispName}
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "3px 8px",
                              borderRadius: "10px",
                              background: roleLevel.includes("Manager") || roleLevel === "Admin" ? "#e0f2fe" : "#fef3c7",
                              color: roleLevel.includes("Manager") || roleLevel === "Admin" ? "#0369a1" : "#b45309",
                            }}
                          >
                            {roleLevel}
                          </span>
                        </td>
                        <td>{emp.jobTitle || "-"}</td>
                        <td>{emp.department || "-"}</td>
                        <td>{emp.employeeId || "-"}</td>
                        <td>{emp.email || "-"}</td>
                        <td>{emp.officeLocation || emp.place || "-"}</td>
                        <td>
                          {(() => {
                            const isActive = emp.accountActive !== undefined 
                              ? Boolean(emp.accountActive) 
                              : (emp.status ? emp.status.toLowerCase() === "active" : emp.accountEnabled !== false);
                            return (
                              <span
                                className={`statusBadge ${
                                  isActive ? "active" : "inactive"
                                }`}
                              >
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Hrmsleftlayout>
  );
}

export default AllEmployees;