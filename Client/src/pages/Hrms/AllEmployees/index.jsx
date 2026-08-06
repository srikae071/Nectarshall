import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hrmsleftlayout from "../Hrmsleftlayout";
import { fetchApiData, sendApiData } from "../../../utils/apiClient";
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete employee "${name}"?`)) return;
    try {
      await sendApiData("DELETE", `/api/employees/${id}`);
      alert("Employee deleted successfully!");
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee.");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = search.toLowerCase();
    const name = (emp.displayName || emp.employeeName || `${emp.firstName || ""} ${emp.lastName || ""}`).toLowerCase();
    const title = (emp.jobTitle || "").toLowerCase();
    const dept = (emp.department || "").toLowerCase();
    const empId = (emp.employeeId || "").toLowerCase();
    return name.includes(q) || title.includes(q) || dept.includes(q) || empId.includes(q);
  });

  return (
    <Hrmsleftlayout>
      <div className="allEmployeesContainer">
        <div className="allEmployeesHeader">
          <div>
            <h2>All Employees</h2>
            <p className="allEmployeesSub">Manage core employee directory records</p>
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
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Employee ID</th>
                  <th>Email</th>
                  <th>Office Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                      No employees found. Click "+ Add Employee" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, index) => {
                    const dispName = emp.displayName || emp.employeeName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unnamed Employee";
                    return (
                      <tr key={emp._id || index}>
                        <td style={{ fontWeight: "600", color: "#64748b" }}>{index + 1}</td>
                        <td>
                          <button
                            className="empNameLink"
                            onClick={() => navigate(`/hrms/employee/${emp._id}`)}
                            title="Click to view & edit pre-filled details"
                          >
                            👤 {dispName}
                          </button>
                        </td>
                        <td>{emp.jobTitle || "-"}</td>
                        <td>{emp.department || "-"}</td>
                        <td>{emp.employeeId || "-"}</td>
                        <td>{emp.email || "-"}</td>
                        <td>{emp.officeLocation || emp.place || "-"}</td>
                        <td>
                          <span className={`statusBadge ${emp.accountEnabled !== false ? "active" : "inactive"}`}>
                            {emp.accountEnabled !== false ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="actionEditBtn"
                              onClick={() => navigate(`/hrms/employee/${emp._id}`)}
                            >
                              Edit
                            </button>
                            <button
                              className="actionDeleteBtn"
                              onClick={() => handleDelete(emp._id, dispName)}
                            >
                              Delete
                            </button>
                          </div>
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