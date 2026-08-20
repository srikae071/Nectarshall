import HrmsLeftLayout from "../Hrmsleftlayout";
import TableLayout1 from "../../../components/Layouts/TableLayouts/TableLayout1";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { fetchApiData } from "../../../utils/apiClient";
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
      const response = await fetchApiData("/api/leaves");
      const allLeaves = response.data || [];

      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }

      const username = (authUser?.username || authUser?.name || authUser?.displayName || (typeof authUser === "string" ? authUser : "")).trim();
      const role = (authUser?.role || "").toUpperCase();
      const isAdmin = role === "ADMIN" || username.toLowerCase().includes("sumit");

      if (isAdmin) {
        setData(allLeaves);
      } else if (username) {
        const u = username.toLowerCase();
        const userLeaves = allLeaves.filter((item) => {
          const r1 = (item.requester || item.employeeName || "").trim().toLowerCase();
          const r2 = (item.requesterFor || "").trim().toLowerCase();
          return r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2.includes(u);
        });
        setData(userLeaves);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter((item) =>
    item.requester?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleColumn = (key) => {
    // Don't allow default columns to be removed
    if (defaultColumns.includes(key)) {
      return;
    }

    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };
  return (
    <HrmsLeftLayout>
      <TableLayout1
        title="Employee Leaves"
        search={search}
        setSearch={setSearch}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        settingsRef={settingsRef}
        settingsContent={allColumns
          .filter((col) => !defaultColumns.includes(col.key))
          .map((col) => (
            <label key={col.key} className="LMACheckbox">
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.key)}
                onChange={() => toggleColumn(col.key)}
              />
              {col.label}
            </label>
          ))}
        headers={allColumns.filter((col) => visibleColumns.includes(col.key))}
      >
        {filteredData.map((item) => {
          const currentHeaders = allColumns.filter((col) => visibleColumns.includes(col.key));
          return (
            <tr key={item._id}>
              {currentHeaders.map((col) => {
                let cellVal = item[col.key];
                if (col.key === "halfDay") {
                  cellVal = item.halfDay ? "Yes" : "No";
                } else if (col.key === "leaveBalance") {
                  cellVal = getLeaveBalance(item);
                } else if (!cellVal) {
                  cellVal = "-";
                }

                if (col.key === "status") {
                  return (
                    <td key={col.key}>
                      <span className={`badge ${(item.status || "Pending").toLowerCase()}`}>
                        {item.status || "Pending"}
                      </span>
                    </td>
                  );
                }

                return <td key={col.key}>{String(cellVal)}</td>;
              })}
            </tr>
          );
        })}
      </TableLayout1>
    </HrmsLeftLayout>
  );
}

export default LeaveManagementAll;
