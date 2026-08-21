import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiBookOpen,
} from "react-icons/fi";
import "./index.css";
import HrmsNavbar from "../HrmsNavbar";

const menuData = [
  {
    title: "Dashboard",
    directPath: "/regular-form",
  },
  {
    title: "Assignment Group",
    items: [
      { label: "All Groups", path: "/hrms/assignment-group" },
    ],
  },
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
    title: "Employee Management",
    items: [
      { label: "All Employees", path: "/hrms/all-employees" },
      {
        label: "Onboarding",
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
      {
        label: "Offboarding",
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
            label: "Open",
            path: "/offboarding-open",
          },
          {
            label: "Resolved",
            path: "/offboarding-resolved",
          },
          {
            label: "Closed",
            path: "/offboarding-closed",
          },
          {
            label: "Work In Progress",
            path: "/offboarding-wip",
          },
          {
            label: "Pending",
            path: "/offboarding-pending",
          },
        ],
      },
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
    title: "Training and Development",
    items: [
      { label: "All", path: "/hrms/training/all" },
      { label: "Create New", path: "/hrms/training/createnew" },
    ],
  },
];

/* ================= REUSABLE MENU ITEM ================= */
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

/* ================= TOP DASHBOARD NAVIGATION TABS ================= */
const DashboardNavTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isDashboardRoute =
    path === "/regular-form" || path.startsWith("/vendor-portal");

  if (!isDashboardRoute) return null;

  const isActive = (p) => {
    if (p === "/regular-form") return path === "/regular-form";
    return path.startsWith(p);
  };

  const navItems = [
    { label: "Overview", path: "/regular-form", icon: FiGrid },
    {
      label: "Case Management",
      path: "/vendor-portal/cases",
      icon: FiFileText,
    },
    {
      label: "Employee Management",
      path: "/vendor-portal/employees",
      icon: FiUsers,
    },
    {
      label: "Leave Management",
      path: "/vendor-portal/leave",
      icon: FiCalendar,
    },
    {
      label: "Training & Dev",
      path: "/vendor-portal/training",
      icon: FiBookOpen,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: "56px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <span
          onClick={() => navigate("/regular-form")}
          style={{
            cursor: "pointer",
            color: "#0f172a",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          Nectershell
        </span>
      </div>

      {/* Nav Tabs with Icons */}
      <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "14.5px",
                fontWeight: active ? 600 : 500,
                color: active ? "#2563eb" : "#64748b",
                borderBottom: active
                  ? "2.5px solid #2563eb"
                  : "2.5px solid transparent",
                padding: "16px 4px 14px 4px",
                transition: "all 0.15s ease-in-out",
              }}
            >
              <Icon
                size={16}
                style={{ color: active ? "#2563eb" : "#64748b" }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================= MAIN LAYOUT ================= */
function HrmsLeftLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [expandedMenus, setExpandedMenus] = useState({});

  // Automatically expand parent section and child submenus for current active route
  useEffect(() => {
    const currentPath = location.pathname;
    if (!currentPath || currentPath === "/") return;

    const itemMatchesPath = (item) => {
      if (item.path && item.path === currentPath) return true;
      if (item.children) {
        return item.children.some((child) => itemMatchesPath(child));
      }
      return false;
    };

    menuData.forEach((menu, index) => {
      if (!menu.items) return;

      const hasMatch = menu.items.some((item) => itemMatchesPath(item));
      if (hasMatch) {
        setOpenMenus((prev) => ({ ...prev, [index]: true }));

        const autoExpand = (items, level = 0) => {
          items.forEach((item) => {
            if (item.children && itemMatchesPath(item)) {
              const itemKey = item.label + level;
              setExpandedMenus((prev) => ({ ...prev, [itemKey]: true }));
              autoExpand(item.children, level + 1);
            }
          });
        };
        autoExpand(menu.items, 0);
      }
    });
  }, [location.pathname]);

  const toggle = (index) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [sidebarWidth, setSidebarWidth] = useState(180);

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
              {menu.directPath ? (
                // Direct navigation link (e.g. Dashboard)
                <div
                  className={`hrmsmenuHeader ${
                    location.pathname === menu.directPath ||
                    (menu.directPath === "/regular-form" && (location.pathname === "/regular-form" || location.pathname.startsWith("/vendor-portal")))
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate(menu.directPath)}
                  style={{ cursor: "pointer" }}
                >
                  <span>{menu.title}</span>
                </div>
              ) : (
                // Normal expandable dropdown
                <>
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
                </>
              )}
            </div>
          ))}
        </div>

        <div className="resizer" onMouseDown={startResize}></div>

        <div className="rightContent">
          <DashboardNavTabs />
          {children}
        </div>
      </div>
    </div>
  );
}
export default HrmsLeftLayout;
