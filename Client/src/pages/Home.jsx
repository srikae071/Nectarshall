import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { Route, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import leaveImg from "../images/leavemanagement.jfif";
import payrollImg from "../images/payrools.jfif";
import rosterImg from "../images/roster.jfif";
import orgImg from "../images/orhanizationpolicies.jfif";
import askItImg from "../images/askit.jfif";
import askHrImg from "../images/askhr.jfif";
import corosolimg from "../images/corosolimg.jpg";
import empreq from "../images/emloyereq.jpg";
import offboarding from "../images/offboarding.jpg";
import busineseng from "../images/businesseng.avif";
import ThemeSelector from "../components/ThemeSelector";
import { fetchApiData } from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { user, logout, hasModuleAccess } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchPendingLeaves = async () => {
    try {
      const [leaveResponse, jobResponse] = await Promise.all([
        fetchApiData("/api/leaves"),
        fetchApiData("/api/jobrequests"),
      ]);

      const pendingLeaves = leaveResponse.data.filter(
        (item) => item.status === "Pending",
      ).length;

      const pendingOffboarding = jobResponse.data.filter(
        (item) => item.category === "Offboarding" && item.status === "Open",
      ).length;

      setPendingCount(pendingLeaves + pendingOffboarding);

      console.log("Pending Leaves:", pendingLeaves);
      console.log("Pending Offboarding:", pendingOffboarding);
    } catch (error) {
      console.log(error);
    }
  };

  const allServices = [
    {
      title: "Leaves Management",
      desc: "Smart Leave Management for Modern Teams",
      img: leaveImg,
      route: "/home-leave-request",
      module: "COMMON",
    },
    {
      title: "Payrolls",
      desc: "Reliable & Accurate Payroll Management",
      img: payrollImg,
      route: "/payroll",
      module: "HRMS",
    },
    {
      title: "Roster / Shift",
      desc: "Plan Shifts Smarter and Faster",
      img: rosterImg,
      route: "/roster-shifts",
      module: "OPERATIONS",
    },
    {
      title: "Organization Policies",
      desc: "Clear policies for a stronger organization",
      img: orgImg,
      route: "/organisation-policies",
      module: "COMMON",
    },
    {
      title: "Ask for IT",
      desc: "Report technical issues instantly",
      img: askItImg,
      route: "/ask-for-it",
      module: "IT",
    },
    {
      title: "Ask for HR",
      desc: "A simple way to communicate HR issues",
      img: askHrImg,
      route: "/ask-for-hr",
      module: "HRMS",
    },
    // ss

    {
      title: "Employe Request",
      desc: "A simple way to communicate HR issues",
      img: empreq,
      route: "/Resonancereq",
      module: "HRMS",
    },
    {
      title: "Exit",
      desc: "A simple way to communicate HR issues",
      img: offboarding,
      route: "/exit",
      module: "HRMS",
    },
    {
      title: "Business Engagement",
      desc: "A simple way to communicate HR issues",
      img: busineseng,
      route: "/business-engagement",
      module: "CNC",
    },
    /* {
      title: "Assignment Group",
      desc: "Centralized ticket routing for IT, HR, and Accounts tables",
      img: orgImg,
      route: "/assignment-group",
      module: "COMMON",
    }, */
  ];

  const visibleServices = allServices.filter((item) => {
    if (!user) return true;
    if (user.role === "ADMIN") return true;
    if (user.role === "HRMS") {
      return ["HRMS", "COMMON"].includes(item.module);
    }
    if (user.role === "IT_OPERATIONS") {
      return ["IT", "OPERATIONS", "COMMON"].includes(item.module);
    }
    return true;
  });

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <img src={logo} className="logoimage" alt="logo" />
        </div>

        <div className="nav-links">
          {hasModuleAccess("ALL") && (
            <>
              <a role="button" tabIndex={0} onClick={() => navigate("/test")}>
                test
              </a>
              <a
                role="button"
                tabIndex={0}
                onClick={() => navigate("/accounts/payrun")}
              >
                ACCOUNTS
              </a>
            </>
          )}
          {(hasModuleAccess("ALL") || hasModuleAccess("CNC")) && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/Client/onboarding-compliance")}
            >
              C&C
            </a>
          )}
          {(hasModuleAccess("ALL") || hasModuleAccess("IT")) && (
            <a role="button" tabIndex={0} onClick={() => navigate("/it/open")}>
              IT
            </a>
          )}
          {(hasModuleAccess("ALL") || hasModuleAccess("PATROLLING")) && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/PatrolingSchedule")}
            >
              PATROLLING
            </a>
          )}
          {(hasModuleAccess("ALL") || hasModuleAccess("OPERATIONS")) && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/main-dashboard")}
            >
              OPERATIONS
            </a>
          )}
          {(hasModuleAccess("ALL") || hasModuleAccess("HRMS")) && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/regular-form")}
            >
              HRMS
            </a>
          )}

          {/* MY TASK IS VISIBLE FOR EVERYONE */}
          <div
            className="MyTaskNotificationWrapper"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/my-tasks")}
          >
            <a>MY TASK</a>
            <span className="MyTaskNotificationBadge">{pendingCount}</span>
          </div>

          <a role="button" tabIndex={0} onClick={() => navigate("/my-tickets")}>
            MY TICKETS
          </a>

          {/* <a role="button" tabIndex={0} onClick={() => navigate("/assignment-group")}>
            ASSIGNMENT GROUP
          </a> */}

          <a role="button" tabIndex={0} onClick={() => navigate("/my-mails")}>
            MY MAILS
          </a>

          <ThemeSelector />

          {/* PROFILE USER MENU WITH LOGOUT */}
          <div
            className="userProfileMenuContainer"
            style={{ position: "relative" }}
          >
            <div
              className="profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title="User Account Options"
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              👤 {user?.username || "User"}
            </div>

            {showProfileMenu && (
              <div
                className="userProfileDropdown"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "40px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  padding: "12px 14px",
                  width: "210px",
                  zIndex: 9999,
                  color: "#0f172a",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {user?.displayName || user?.username}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "12px",
                  }}
                >
                  Role: <strong>{user?.role}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/main-window");
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background:
                      "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "13px",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  🪟 Main Window
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="navbarbgc">
        <img src={corosolimg} className="hero-img" />
        <div className="hero-content">
          <div className="search-box">
            <input placeholder="What are you looking for?" />
            <button>Search</button>
          </div>
        </div>
      </div>

      {/* <div className="services">
        {services.map((item, index) => (
          <div
            className="card"
            key={index}
            onClick={() => {
              if (item.title === "Leaves Management") {
                console.log("Navigating to Leave Request");
                navigate("/leave-request");
              } else if (item.title === "Payrolls") {
                console.log("Navigating to Payroll");
                navigate("/payroll");
              }
            }}
          >
            <div
              className="card-img"
              style={{ backgroundImage: `url(${item.img})` }}
            ></div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div> */}
      <div className="HomeServices">
        {visibleServices.map((item, index) => (
          <div
            className="HomeCard"
            key={index}
            onClick={() => item.route && navigate(item.route)}
          >
            <div
              className="HomeCardImage"
              style={{ backgroundImage: `url(${item.img})` }}
            />

            <div className="HomeCardContent">
              <h3 className="HomeCardTitle">{item.title}</h3>
              <p className="HomeCardDescription">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
