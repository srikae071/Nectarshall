import React, { useState, useEffect, useMemo } from "react";
import { fetchApiData, extractArrayData } from "../../../../utils/apiClient";
import "./index.css";

function MainDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [candRes, empRes] = await Promise.allSettled([
        fetchApiData("/api/BoardingCandidates"),
        fetchApiData("/api/employees"),
      ]);

      if (candRes.status === "fulfilled") {
        setCandidates(extractArrayData(candRes.value.data));
      }

      if (empRes.status === "fulfilled") {
        setEmployees(extractArrayData(empRes.value.data));
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Today's Date formatted YYYY-MM-DD
  const todayDateStr = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Live Operations derived from timesheet candidate contract services
  const liveOperations = useMemo(() => {
    const rows = [];
    const safeCandidates = Array.isArray(candidates) ? candidates : [];

    safeCandidates.forEach((cand) => {
      (cand.contractDeliverables || []).forEach((contract) => {
        const contractDate = contract.contractStartDate
          ? String(contract.contractStartDate).slice(0, 10)
          : contract.startDate
          ? String(contract.startDate).slice(0, 10)
          : todayDateStr;

        (contract.services || []).forEach((svc) => {
          const qty = Math.max(1, Number(svc.quantity) || 1);
          for (let q = 0; q < qty; q++) {
            const slotEmpObj = svc.assignedEmployees?.[q];
            const empName =
              slotEmpObj?.employee ||
              slotEmpObj?.name ||
              svc.assignedEmployee ||
              "Unassigned";

            const site =
              svc.siteName ||
              contract.siteName ||
              cand.siteName ||
              cand.requester ||
              "Main Site";

            rows.push({
              id: `${cand._id}_${contract._id}_${svc._id || Math.random()}_${q}`,
              date: contractDate,
              site,
              name: empName,
              status: "Unknown",
              shiftStart: svc.shiftStartTime || svc.startTime || "09:00",
              shiftEnd: svc.shiftEndTime || svc.endTime || "17:00",
              actualStart: slotEmpObj?.actualStartTime || svc.shiftStartTime || "09:00",
              actualEnd: slotEmpObj?.actualEndTime || svc.shiftEndTime || "17:00",
              verification: "Unknown",
            });
          }
        });
      });
    });

    const todayRows = rows.filter((r) => !r.date || r.date === todayDateStr);
    return todayRows.length > 0 ? todayRows : rows;
  }, [candidates, todayDateStr]);

  const filteredOperations = useMemo(() => {
    if (!searchTerm.trim()) return liveOperations;
    const term = searchTerm.toLowerCase();
    return liveOperations.filter(
      (item) =>
        item.site.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term)
    );
  }, [liveOperations, searchTerm]);

  // Total Employee Count from Employee Table
  const totalEmployeesCount = useMemo(() => {
    if (Array.isArray(employees) && employees.length > 0) {
      return employees.length;
    }
    if (Array.isArray(candidates) && candidates.length > 0) {
      return candidates.length;
    }
    return 0;
  }, [employees, candidates]);

  return (
    <div className="dashboard">
      {/* TOP TABLE */}
      <div className="Liveoperationscard">
        <div className="cardHeader">
          <h3>Live operations ({todayDateStr})</h3>

          <div className="topActions">
            <span>Clocked In - 0 / {filteredOperations.length}</span>
            <span>Clocked Out - 0</span>

            <input
              placeholder="Search site, employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" onClick={fetchDashboardData}>
              Refresh
            </button>
          </div>
        </div>

        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th className="tableheads">Site</th>
                <th className="tableheads">Employee Name</th>
                <th className="tableheads">Status</th>
                <th className="tableheads">Schedule Start Time</th>
                <th className="tableheads">Schedule End Time</th>
                <th className="tableheads">Actual Start Time</th>
                <th className="tableheads">Actual End Time</th>
                <th className="tableheads">Coordinator Verification</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    Loading Live Operations...
                  </td>
                </tr>
              ) : filteredOperations.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                    No Live Operations Found for Today
                  </td>
                </tr>
              ) : (
                filteredOperations.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.site}</td>
                    <td>{r.name}</td>
                    <td>
                      <span className="statusUnknown">{r.status}</span>
                    </td>
                    <td>{r.shiftStart}</td>
                    <td>{r.shiftEnd}</td>
                    <td>{r.actualStart}</td>
                    <td>{r.actualEnd}</td>
                    <td>{r.verification}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM SECTION - STAFF CONFIRMATION */}
      <div className="bottomGrid">
        <div className="Stafconfomationcard">
          <div className="StafconfomationcardHeader">
            <h3>Staff Confirmation</h3>
          </div>

          <div className="statsRow">
            <div className="statBox gold">
              <h2>{totalEmployeesCount}</h2>
              <p>staff confirmed</p>
            </div>

            <div className="statBox blue">
              <h2>0</h2>
              <p>staff rejected</p>
            </div>

            <div className="statBox gray">
              <h2>0</h2>
              <p>staff unconfirmed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainDashboard;
