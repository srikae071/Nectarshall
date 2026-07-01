import HrmsLeftLayout from "../Hrmsleftlayout";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiSettings, FiSearch } from "react-icons/fi";
import "./index.css";

const defaultColumns = [
  "leaveNumber",
  "requester",
  "leaveType",
  "startDate",
  "endDate",
];

const allColumns = [
  { key: "leaveNumber", label: "Leave Number" },
  { key: "requester", label: "Employee Name" },
  { key: "leaveType", label: "Leave Type" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "totalLeaves", label: "Total Leaves" },
  { key: "halfDay", label: "Half Day" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "comment", label: "Comment" },
  { key: "leaveBalance", label: "Leave Balance" },
];

const leaveAllocation = {
  "Casual Leave": 5,
  "Sick Leave": 10,
  "Paid Leave": 15,
  "Maternity Leave": 20,
  "Paternity Leave": 12,
};

const getLeaveBalance = (item) => {
  const allocated = leaveAllocation[item.leaveType] || 0;

  return allocated - Number(item.totalLeaves || 0);
};
function LeaveManagementAll() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("leaveColumns");
    return saved ? JSON.parse(saved) : defaultColumns;
  });

  const settingsRef = useRef(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    localStorage.setItem("leaveColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/leaves",
      );

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter((item) =>
    item.requester?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleColumn = (key) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  return (
    <HrmsLeftLayout>
      <div className="LMAHome">
        <div className="LMATopSection">
          <h2 className="LMAHeading">Employe Leaves</h2>

          <div className="LMARightSection">
            <div className="LMASearchBox">
              <FiSearch className="LMASearchIcon" />

              <input
                type="text"
                placeholder="Search Employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="LMASettingWrapper" ref={settingsRef}>
              <button
                className="LMASettingButton"
                onClick={() => setShowSettings(!showSettings)}
              >
                <FiSettings />
              </button>

              {showSettings && (
                <div className="LMADropdown">
                  {allColumns.map((column) => (
                    <label key={column.key} className="LMACheckbox">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(column.key)}
                        onChange={() => toggleColumn(column.key)}
                      />
                      {column.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <table className="LMATable">
          <thead>
            <tr>
              {allColumns
                .filter((col) => visibleColumns.includes(col.key))
                .map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                {visibleColumns.includes("leaveNumber") && (
                  <td>{item.leaveNumber}</td>
                )}

                {visibleColumns.includes("employeeName") && (
                  <td>{item.requester}</td>
                )}

                {visibleColumns.includes("leaveType") && (
                  <td>{item.leaveType}</td>
                )}

                {visibleColumns.includes("startDate") && (
                  <td>{item.startDate}</td>
                )}

                {visibleColumns.includes("endDate") && <td>{item.endDate}</td>}

                {visibleColumns.includes("totalLeaves") && (
                  <td>{item.totalLeaves}</td>
                )}

                {visibleColumns.includes("halfDay") && (
                  <td>{item.halfDay ? "Yes" : "No"}</td>
                )}

                {visibleColumns.includes("description") && (
                  <td>{item.description}</td>
                )}

                {visibleColumns.includes("status") && <td>{item.status}</td>}

                {visibleColumns.includes("comment") && <td>{item.comment}</td>}
                {visibleColumns.includes("leaveBalance") && (
                  <td>{getLeaveBalance(item)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HrmsLeftLayout>
  );
}

export default LeaveManagementAll;
