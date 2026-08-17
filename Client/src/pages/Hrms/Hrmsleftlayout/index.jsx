import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import HrmsNavbar from "../HrmsNavbar";

const menuData = [
  {
    title: "Case Management",
    items: [
      { label: "All", path: "/hrms/hrsavescases" },
      { label: "Create New", path: "/hrms/createnew" },
      { label: "Open", path: "/hrms/open" },
      { label: "Resolved", path: "/hrms/resolved-cases" },
      { label: "Assign to Me", path: "/hrms/assigned-cases" },
    ],
  },
  {
    title: "Leave Management",
    items: [
      { label: "All", path: "/leave-management-all" },
      { label: "Leave Request", path: "/leave-request" },
      { label: "Leave Balance", path: "/leave-balance" },
      { label: "Leave Calendar", path: "/leave-calendar" },
      { label: "Leave Status", path: "/leave-status" },
    ],
  },
  {
    title: "Employee Management",
    items: [
      { label: "All Employees", path: "/hrms/all-employees" },
      {
        label: "Onboarding",
        children: [
          {
            label: "Employe",
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
                path: "/onboardingresolved",
              },
              {
                label: "Employe Request",
                path: "/onboarding/employerequest",
              },
              {
                label: "Pre-Joining Compilence",
                path: "/onboarding/prejoining",
              },
              {
                label: "Interview",
                path: "/onboarding/Interview",
              },
              {
                label: "Offer Letter",
                path: "/onboarding/Offerletter",
              },
            ],
          },
        ],
      },
      {
        label: "Offboarding",
        children: [
          {
            label: "Employe",
            children: [
              {
                label: "All",
                path: "/offboarding-employes-all",
              },
              {
                label: "Create New",
                path: "/offboarding/createnew",
              },
              {
                label: "Closed",
                path: "/offboarding-closed",
              },
              {
                label: "Employe Request",
                path: "/offboarding/employerequest",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Training and Development",
    items: [
      { label: "All", path: "/hrms/training/all" },
      { label: "Create New", path: "/hrms/training/createnew" },
    ],
  },
];

const MenuItem = ({ item, level = 0, expandedMenus, setExpandedMenus }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;

  const checkActive = (menuItem) => {
    if (menuItem.path && menuItem.path === location.pathname) return true;

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
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [expandedMenus, setExpandedMenus] = useState({});

  // Automatically expand parent section and child submenus for current active route
  useEffect(() => {
    const currentPath = location.pathname;
    if (!currentPath || currentPath === "/") return;

    const itemMatchesPath = (item) => {
      const pathLower = (item.path || "").toLowerCase();
      const currentLower = currentPath.toLowerCase();

      if (pathLower && currentLower === pathLower) return true;

      if (currentLower.includes("interview") && pathLower.includes("interview")) return true;
      if (currentLower.includes("prejoining") && pathLower.includes("prejoining")) return true;
      if (currentLower.includes("offerletter") && pathLower.includes("offerletter")) return true;
      if (currentLower.includes("employerequest") && pathLower.includes("employerequest")) return true;
      if (currentLower.includes("employee-request-save") && pathLower.includes("employerequest")) return true;
      if (currentLower.includes("onboarding-saves") && pathLower.includes("resonancerequirement")) return true;

      if (item.children) {
        return item.children.some((child) => itemMatchesPath(child));
      }
      return false;
    };

    menuData.forEach((menu, index) => {
      const hasMatch = menu.items.some((item) => itemMatchesPath(item));
      if (hasMatch) {
        setOpenMenus((prev) => ({ ...prev, [index]: true }));

        const expandRecursive = (items, level = 0) => {
          items.forEach((item) => {
            if (item.children && itemMatchesPath(item)) {
              const itemKey = item.label + level;
              setExpandedMenus((prev) => ({ ...prev, [itemKey]: true }));
              expandRecursive(item.children, level + 1);
            }
          });
        };

        expandRecursive(menu.items);
      }
    });
  }, [location.pathname]);

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
                      setExpandedMenus={setExpandedMenus}
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
