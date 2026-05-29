import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import PayrollNavbar from "../PayrollNavbar";

const menuData = [
  {
    title: "Salary Slip",
    items: [{ label: "All", path: "/src/pages/PayrollPage" }],
  },
];

const MenuItem = ({ item, level = 0 }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;

  // const isActive = item.path && location.pathname.startsWith(item.path);

  const isActive =
    (item.path && location.pathname === item.path) ||
    (item.children &&
      item.children.some((child) => location.pathname === child.path));

  return (
    <div>
      <div
        className={`hrmssubmenuItem ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${20 + level * 15}px` }}
        onClick={() => {
          if (hasChildren) {
            setOpen(!open);
          } else if (item.path) {
            navigate(item.path);
          }
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "2px" }}>{item.icon || "•"}</span>
          <span>{item.label}</span>
        </div>
        {/* RIGHT SIDE (+ / -) */}
        {hasChildren && <span>{open ? "-" : "+"}</span>}
      </div>
      {/* CHILDREN */}
      {hasChildren && open && (
        <div>
          {item.children.map((child, index) => (
            <MenuItem key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
/* ================= MAIN LAYOUT ================= */
function PayrollLayout({ children }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
      <PayrollNavbar />

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
                <span>{openIndex === index ? "-" : "+"}</span>
              </div>
              {openIndex === index && (
                <div className="submenu">
                  {menu.items.map((item, i) => (
                    <MenuItem key={i} item={item} />
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
export default PayrollLayout;
