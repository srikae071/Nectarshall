import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
// import HrmsNavbar from "../HrmsNavbar";
import LeaveManagementNavBar from "../LeaveManagementNavBar";

const menuData = [
  {
    title: "Leave Management",
    items: [
      { label: "Leave Request", path: "/Home-leave-request" },
      { label: "Leave Balance", path: "/Home-leave-balance" },
      { label: "Leave Calendar", path: "/Home-leave-calendar" },
      { label: "Leave Status", path: "/Home-leave-status" },
    ],
  },
];

const MenuItem = ({ item, level = 0, expandedMenus, setExpandedMenus }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;

  const checkActive = (menuItem) => {
    if (menuItem.path === location.pathname) return true;

    if (menuItem.children) {
      return menuItem.children.some((child) => checkActive(child));
    }

    return false;
  };

  const isActive = checkActive(item);

  const itemKey = item.label + level;

  const isExpanded = expandedMenus[itemKey] ?? false;

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setExpandedMenus((prev) => ({
        ...prev,
        [itemKey]: !prev[itemKey],
      }));
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div>
      <div
        className={`hrmssubmenuItem ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${20 + level * 15}px` }}
        // onClick={handleClick}
        onClick={(e) => handleClick(e)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "2px" }}>{item.icon || "•"}</span>

          <span>{item.label}</span>
        </div>

        {hasChildren && <span>{isExpanded ? "-" : "+"}</span>}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {item.children.map((child, index) => (
            <MenuItem
              key={index}
              item={child}
              level={level + 1}
              expandedMenus={expandedMenus}
              setExpandedMenus={setExpandedMenus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
/* ================= MAIN LAYOUT ================= */
function LeaveManagementLeftSide({ children }) {
  // const [openIndex, setOpenIndex] = useState(0);

  // const toggle = (index) => {
  //   setOpenIndex(openIndex === index ? null : index);
  // };

  const [openMenus, setOpenMenus] = useState({});
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggle = (index) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const isResizing = useRef(false);
  const startResize = () => {
    isResizing.current = true;
  };

  const stopResize = () => {
    isResizing.current = false;
  };

  const resize = (e) => {
    if (isResizing.current) {
      const newWidth = e.clientX;

      // limits (important)
      if (newWidth > 180 && newWidth < 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  return (
    <div
      className="layoutContainer"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >
      <LeaveManagementNavBar />

      <div className="mainLayout">
        {/* SIDEBAR */}
        <div
          className="hrmssidebar"
          className="hrmssidebar"
          style={{ width: sidebarWidth }}
        >
          {menuData.map((menu, index) => (
            <div key={index} className="menuBlock">
              <div className="hrmsmenuHeader" onClick={() => toggle(index)}>
                <span>{menu.title}</span>

                <span>{openMenus[index] ? "-" : "+"}</span>
              </div>
              {openMenus[index] && (
                <div className="submenu">
                  {menu.items.map((item, i) => (
                    <MenuItem
                      key={i}
                      item={item}
                      expandedMenus={expandedMenus}
                      setExpandedMenus={setExpandedMenus}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="resizer" onMouseDown={startResize}></div>
        {/* RIGHT CONTENT */}
        <div className="rightContent">{children}</div>
      </div>
    </div>
  );
}
export default LeaveManagementLeftSide;
