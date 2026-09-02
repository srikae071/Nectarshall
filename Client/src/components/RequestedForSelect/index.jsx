import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { fetchApiData } from "../../utils/apiClient";

export default function RequestedForSelect({
  value = "",
  onChange,
  label = "Requested For",
  name = "requesterFor",
  required = false,
  disabled = false,
  style = {},
  selectStyle = {},
}) {
  const [employeeOptions, setEmployeeOptions] = useState(["Sumit", "Srikar"]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const res = await fetchApiData("/api/employees");
        const employeesList = res && res.data && Array.isArray(res.data) ? res.data : [];
        const empNames = employeesList
          .map(
            (emp) =>
              emp.displayName ||
              emp.employeeName ||
              `${emp.firstName || ""} ${emp.lastName || ""}`.trim()
          )
          .filter(Boolean);

        if (!empNames.includes("Sumit")) empNames.unshift("Sumit");
        if (!empNames.includes("Srikar")) empNames.push("Srikar");
        const uniqueEmpNames = [...new Set(empNames)];

        if (uniqueEmpNames.length > 0) {
          setEmployeeOptions(uniqueEmpNames);
        }
      } catch (err) {
        console.error("Error fetching employee options for RequestedForSelect:", err);
      }
    };

    fetchAllEmployees();
  }, []);

  // Click outside listener to close search box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSearchBox(false);
      }
    };
    if (showSearchBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchBox]);

  const filteredSearchEmployees = employeeOptions.filter((empName) =>
    empName.toLowerCase().includes(searchEmployeeQuery.toLowerCase())
  );

  const handleSelect = (selectedName) => {
    if (onChange) {
      onChange({ target: { name, value: selectedName } });
    }
    setShowSearchBox(false);
    setSearchEmployeeQuery("");
  };

  return (
    <div className="lr-field" ref={containerRef} style={{ position: "relative", ...style }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <label className="lr-label" style={{ margin: 0, fontWeight: "600" }}>
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        {!disabled && (
          <button
            type="button"
            onClick={() => setShowSearchBox(!showSearchBox)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#0284c7",
              fontSize: "12.5px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
            title="Search employee"
          >
            <FiSearch size={14} />
            <span>Search</span>
          </button>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <select
          className="lr-input"
          name={name}
          value={value || ""}
          onChange={(e) => handleSelect(e.target.value)}
          disabled={disabled}
          style={{
            background: disabled ? "#f1f5f9" : "#ffffff",
            cursor: disabled ? "not-allowed" : "pointer",
            fontWeight: "600",
            ...selectStyle,
          }}
        >
          <option value="">Select Employee</option>
          {employeeOptions.map((empName, idx) => (
            <option key={idx} value={empName}>
              {empName}
            </option>
          ))}
        </select>

        {/* SEARCH POPUP */}
        {showSearchBox && (
          <div
            style={{
              position: "absolute",
              top: "44px",
              left: 0,
              right: 0,
              zIndex: 1000,
              background: "#ffffff",
              border: "1.5px solid #0284c7",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(2, 132, 199, 0.25)",
              padding: "10px",
            }}
          >
            <div style={{ position: "relative", marginBottom: "8px" }}>
              <FiSearch
                size={14}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#0284c7",
                }}
              />
              <input
                type="text"
                autoFocus
                placeholder="Search employee by name..."
                value={searchEmployeeQuery}
                onChange={(e) => setSearchEmployeeQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 28px 6px 30px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {searchEmployeeQuery && (
                <button
                  type="button"
                  onClick={() => setSearchEmployeeQuery("")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    fontSize: "12px",
                  }}
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            <div style={{ maxHeight: "160px", overflowY: "auto" }}>
              {filteredSearchEmployees.length > 0 ? (
                filteredSearchEmployees.map((name, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(name)}
                    style={{
                      padding: "7px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: value === name ? "#0284c7" : "#1e293b",
                      background: value === name ? "#eff6ff" : "transparent",
                      fontWeight: value === name ? "700" : "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => {
                      if (value !== name) e.currentTarget.style.background = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      if (value !== name) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span>{name}</span>
                    {value === name && <span style={{ fontSize: "11px", color: "#0284c7" }}>✓ Selected</span>}
                  </div>
                ))
              ) : (
                <div style={{ padding: "10px", fontSize: "12.5px", color: "#94a3b8", textAlign: "center" }}>
                  No employee matching "{searchEmployeeQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
