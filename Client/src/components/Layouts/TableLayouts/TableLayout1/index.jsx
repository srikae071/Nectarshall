import { useState, useEffect, useRef } from "react";
import { FiSearch, FiSettings } from "react-icons/fi";
import "./index.css";

function TableLayout1({
  title,
  storageKey,
  search,
  setSearch,
  allColumns = [],
  defaultColumns = [],
  children,
}) {
  const [showSettings, setShowSettings] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);

  const settingsRef = useRef(null);

  // Load columns from localStorage or use defaults
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setVisibleColumns(JSON.parse(saved));
    } else {
      setVisibleColumns(defaultColumns);
    }
  }, [storageKey, defaultColumns]);

  // Save selected columns
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
  }, [visibleColumns, storageKey]);

  // Close settings popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key) => {
    if (defaultColumns.includes(key)) return;

    if (visibleColumns.includes(key)) {
      setVisibleColumns((prev) => prev.filter((col) => col !== key));
    } else {
      setVisibleColumns((prev) => [...prev, key]);
    }
  };

  return (
    <div className="TL1Container">
      <div className="TL1TopBar">
        <h2 className="TL1Heading">{title}</h2>

        <div className="TL1Right">
          <div className="TL1SearchBox">
            <FiSearch className="TL1SearchIcon" />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="TL1SettingWrapper" ref={settingsRef}>
            <button
              className="TL1SettingButton"
              onClick={() => setShowSettings((prev) => !prev)}
            >
              <FiSettings />
            </button>

            {showSettings && (
              <div className="TL1Dropdown">
                {allColumns
                  .filter((column) => !defaultColumns.includes(column.key))
                  .map((column) => (
                    <label key={column.key} className="TL1Checkbox">
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

      <div className="TL1TableContainer">
        <table className="TL1Table">
          <thead>
            <tr>
              {allColumns
                .filter((column) => visibleColumns.includes(column.key))
                .map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
            </tr>
          </thead>

          <tbody>
            {typeof children === "function"
              ? children(visibleColumns)
              : children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableLayout1;
