import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import CncNavBar from "../CncNavBar";

const menuData = [
  {
    title: "Offboarding",
    items: [
      {
        label: "Client",
        // icon: "📁",
        children: [
          {
            label: "OffBoarding Compilence",
            path: "/onb",
            // icon: "📄",
          },
        ],
      },

      {
        label: "Supplier",
        // icon: "📁",
        children: [
          {
            label: "Offbording Compilence",
            path: "/offboarding-supplier-form",
            // icon: "📄",
          },
        ],
      },
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
            label: "Client OnBoarding",
            path: "/Client/onboarding-compliance",
          },
          {
            label: "All",
            path: "/client-complience",
          },
          { label: "Open", path: "/onboaeding-complience/Open" },
          {
            label: "Work In Progress",
            path: "/onboaeding-complience/work-in-progress",
          },
          {
            label: "On Boarded",
            path: "/onboaeding-complience/On-Boarded",
          },
        ],
      },

      {
        label: "Supplier",
        // icon: "📁",
        children: [
          {
            label: "Supplier OnBoarding",
            path: "/supplier/onboardingcompilence",
            // icon: "📄",
          },
          {
            label: "All",
            path: "/onboarding-supplier",
            // icon: "📄",
          },
        ],
      },
    ],
  },
  // {
  //   title: "Business Engagement",
  //   items: [
  //     // { label: "All", path: "/hrms" },
  //     { label: "All", path: "/Business-EngagementTab" },
  //     { label: "Create New", path: "" },
  //     { label: "Open", path: "/Business-Engagement-open" },
  //     {
  //       label: "Work In Progress",
  //       path: "/Business-Engagement-work-in-progress",
  //     },
  //     { label: "Resolved", path: "/Business-Engagement-resolved" },
  //     { label: "Closed", path: "/Business-Engagement-closed" },
  //   ],
  // },
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
import { useAuth } from "../../../context/AuthContext";

/* ================= MAIN LAYOUT ================= */
function CncLeftLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEndUser } = useAuth();

  useEffect(() => {
    if (isEndUser && isEndUser()) {
      alert("Access Restricted: End User role cannot access management modules.");
      navigate("/");
    }
  }, [location.pathname]);

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
      <CncNavBar />

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
export default CncLeftLayout;
