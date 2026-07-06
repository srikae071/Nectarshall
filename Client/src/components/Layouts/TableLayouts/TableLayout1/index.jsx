import { FiSearch, FiSettings } from "react-icons/fi";
import "./index.css";

function TableLayout1({
  title,
  search,
  setSearch,
  showSettings,
  setShowSettings,
  settingsRef,
  settingsContent,
  headers,
  children,
}) {
  return (
    <div className="table-layout-page">
      {title && (
        <div className="table-layout-header">
          <h2>{title}</h2>

          <div className="table-layout-right">
            <div className="table-search-box">
              <FiSearch className="table-search-icon" />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="table-setting-wrapper" ref={settingsRef}>
              <button
                className="table-setting-btn"
                onClick={() => setShowSettings(!showSettings)}
              >
                <FiSettings />
              </button>

              {showSettings && (
                <div className="table-setting-dropdown">{settingsContent}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="table-layout-card">
        <table className="common-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header.key}>{header.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export default TableLayout1;
