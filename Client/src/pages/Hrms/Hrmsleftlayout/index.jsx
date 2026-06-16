import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import HrmsNavbar from "../HrmsNavbar";

const menuData = [
  {
    title: "Case Management",
    items: [
      { label: "All", path: "/hrms" },
      { label: "HR Cases", path: "/hrms/hrsavescases" },
      { label: "Create New", path: "/hrms/createnew" },
      { label: "Open", path: "/hrms/it-open" },
      { label: "Resolved", path: "/hrms/resolved-cases" },
      { label: "Assign to Me", path: "/hrms/assigned-cases" },
    ],
  },
  {
    title: "Leave Management",
    items: [
      { label: "Leave Request", path: "/leave-request" },
      { label: "Leave Balance", path: "/leave-balance" },
      { label: "Leave Calendar", path: "/leave-calendar" },
      { label: "Leave Status", path: "/leave-status" },
    ],
  },

  {
    title: "Onboarding",
    items: [
      {
        label: "Client",
        // icon: "📁",
        children: [
          {
            label: "Onbording Compilence",
            path: "/Client/onboarding-compliance",
            icon: "📄",
          },
        ],
      },
      {
        label: "Employee",
        // icon: "📁",
        children: [
          {
            label: "Resonence Requirement",
            // icon: "📄",
            children: [
              {
                label: "All",
                path: "/onboarding/resonancerequirement/all",
              },
              {
                label: "Create New",
                path: "/onboarding/resonancerequirement/createnew",
              },
              {
                label: "Resolve",
                path: "/onboarding/resonancerequirement/resolved",
              },
            ],
          },
          {
            label: "Pre-Joining Compilence",
            // icon: "📁",
            children: [
              {
                label: "All",
                path: "/hrms/Open",
              },
            ],
          },
          {
            label: "Offer-letter",
            // icon: "📄",
            path: "/onboarding/offer-letter",
          },
        ],
      },
      {
        label: "Supplier",
        // icon: "📁",
        children: [
          {
            label: "Onbording Compilence",
            path: "/onboarding/clint",
            // icon: "📄",
          },
        ],
      },
    ],
  },
  {
    title: "Offboarding",
    items: [
      {
        label: "Client",
        // icon: "📁",
        children: [
          {
            label: "Onbording Compilence",
            path: "/onboarding/clint",
            // icon: "📄",
          },
        ],
      },
    ],
  },
  {
    title: "Training and Development",
    items: [
      { label: "All", path: "/hrms" },
      { label: "Create New", path: "/hrms/createnew" },
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
function HrmsLeftLayout({ children }) {
  const [openMenus, setOpenMenus] = useState(() => {
    const saved = localStorage.getItem("hrms-open-menus");

    return saved ? JSON.parse(saved) : { 0: true };
  });

  const [expandedMenus, setExpandedMenus] = useState(() => {
    const saved = localStorage.getItem("hrms-expanded-menus");

    return saved ? JSON.parse(saved) : {};
  });

  const toggle = (index) => {
    setOpenMenus((prev) => {
      const updated = {
        ...prev,
        [index]: !prev[index],
      };

      localStorage.setItem("hrms-open-menus", JSON.stringify(updated));

      return updated;
    });
  };

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return Number(localStorage.getItem("hrms-sidebar-width")) || 250;
  });

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

      if (newWidth > 180 && newWidth < 400) {
        setSidebarWidth(newWidth);

        localStorage.setItem("hrms-sidebar-width", newWidth);
      }
    }
  };

  return (
    <div
      className="layoutContainer"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >
      <HrmsNavbar />

      <div className="mainLayout">
        <div className="hrmssidebar" style={{ width: sidebarWidth }}>
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
                      setExpandedMenus={(updater) => {
                        setExpandedMenus((prev) => {
                          const updated =
                            typeof updater === "function"
                              ? updater(prev)
                              : updater;

                          localStorage.setItem(
                            "hrms-expanded-menus",
                            JSON.stringify(updated),
                          );

                          return updated;
                        });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="resizer" onMouseDown={startResize}></div>

        <div className="rightContent">{children}</div>
      </div>
    </div>
  );
}
export default HrmsLeftLayout;
