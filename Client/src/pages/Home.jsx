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
  const {
    user,
    logout,
    switchProfile,
    allProfiles,
    hasTabAccess,
    hasTileAccess,
  } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const username = (user?.displayName || user?.username || "").toLowerCase();
  const role = (user?.role || "").toUpperCase();
  const dept = (user?.department || "").toUpperCase();
  const isAdmin = role === "ADMIN" || username.includes("sumit") || dept === "ADMIN";

  useEffect(() => {
    fetchPendingLeaves();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSwitchProfile = (pUsername) => {
    switchProfile(pUsername);
    setShowProfileMenu(false);
  };

  const fetchPendingLeaves = async () => {
    try {
      const [leaveResponse, jobResponse] = await Promise.all([
        fetchApiData("/api/leaves"),
        fetchApiData("/api/jobrequests"),
      ]);

      const username = (user?.displayName || user?.username || "").toLowerCase();
      const role = (user?.role || "").toUpperCase();
      const dept = (user?.department || "").toUpperCase();
      const isAdmin = role === "ADMIN" || username.includes("sumit") || dept === "ADMIN";

      const leavesList = leaveResponse.data || [];
      const jobList = jobResponse.data || [];

      let pendingLeaves = 0;
      let pendingOffboarding = 0;

      if (isAdmin) {
        pendingLeaves = leavesList.filter((item) => item.status === "Pending").length;
        pendingOffboarding = jobList.filter(
          (item) =>
            (item.category === "Offboarding" || item.category === "Exit") &&
            (item.status === "Open" || item.status === "Pending")
        ).length;
      } else if (username) {
        pendingLeaves = leavesList.filter((item) => {
          const r1 = (item.requester || item.employeeName || "").toLowerCase();
          const r2 = (item.requesterFor || "").toLowerCase();
          const isMatch =
            r1.includes(username) ||
            username.includes(r1 && r1.length > 2 ? r1 : "___never___") ||
            r2.includes(username);
          return isMatch && item.status === "Pending";
        }).length;

        pendingOffboarding = jobList.filter((item) => {
          const r1 = (
            item.requester ||
            item.requesterName ||
            item.employeeName ||
            ""
          ).toLowerCase();
          const r2 = (item.requesterFor || "").toLowerCase();
          const isMatch =
            r1.includes(username) ||
            username.includes(r1 && r1.length > 2 ? r1 : "___never___") ||
            r2.includes(username);
          const isOff = item.category === "Offboarding" || item.category === "Exit";
          const isPending = item.status === "Open" || item.status === "Pending";
          return isMatch && isOff && isPending;
        }).length;
      }

      setPendingCount(pendingLeaves + pendingOffboarding);
    } catch (error) {
      console.log(error);
    }
  };

  const allServices = [
    {
      key: "LEAVE_MANAGEMENT",
      title: "Leaves Management",
      desc: "Smart Leave Management for Modern Teams",
      img: leaveImg,
      route: "/home-leave-request",
    },
    {
      key: "PAYROLLS",
      title: "Payrolls",
      desc: "Reliable & Accurate Payroll Management",
      img: payrollImg,
      route: "/payroll",
    },
    {
      key: "ROSTER_SHIFT",
      title: "Roster / Shift",
      desc: "Plan Shifts Smarter and Faster",
      img: rosterImg,
      route: "/roster-shifts",
    },
    {
      key: "ORGANISATION_POLICIES",
      title: "Organization Policies",
      desc: "Clear policies for a stronger organization",
      img: orgImg,
      route: "/organisation-policies",
    },
    {
      key: "ASK_FOR_IT",
      title: "Ask for IT",
      desc: "Quick IT support & technical assistance",
      img: askItImg,
      route: "/ask-for-it",
    },
    {
      key: "ASK_FOR_HR",
      title: "Ask for HR",
      desc: "Seamless HR inquiries & support requests",
      img: askHrImg,
      route: "/ask-for-hr",
    },
    {
      key: "EMPLOYE_REQUEST",
      title: "Employe Request",
      desc: "Submit employee requests & internal queries",
      img: empreq,
      route: "/Resonancereq",
    },
    {
      key: "EXIT",
      title: "Exit",
      desc: "Streamlined employee offboarding & exit requests",
      img: offboarding,
      route: "/exit",
    },
    {
      key: "BUSINESS_ENGAGEMENT",
      title: "Business Engagement",
      desc: "Strategic client & business onboarding",
      img: busineseng,
      route: "/business-engagement",
    },
  ];

  const visibleServices = allServices.filter((item) => hasTileAccess(item.key));

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <img src={logo} className="logoimage" alt="logo" />
        </div>

        <div className="nav-links">
          {hasTabAccess("ACCOUNTS") && (
            <>
              {hasTabAccess("ADMIN") && (
                <a role="button" tabIndex={0} onClick={() => navigate("/test")}>
                  test
                </a>
              )}
              <a
                role="button"
                tabIndex={0}
                onClick={() => navigate("/accounts/payrun")}
              >
                ACCOUNTS
              </a>
            </>
          )}

          {hasTabAccess("CONSOLE") && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/console")}
              style={{ fontWeight: "700" }}
            >
              CONSOLE
            </a>
          )}

          {hasTabAccess("CNC") && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/Client/onboarding-compliance")}
            >
              C&C
            </a>
          )}

          {hasTabAccess("IT") && (
            <a role="button" tabIndex={0} onClick={() => navigate("/it/open")}>
              IT
            </a>
          )}

          {hasTabAccess("PATROLLING") && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/PatrolingSchedule")}
            >
              PATROLLING
            </a>
          )}

          {hasTabAccess("OPERATIONS") && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/main-dashboard")}
            >
              OPERATIONS
            </a>
          )}

          {hasTabAccess("HRMS") && (
            <a
              role="button"
              tabIndex={0}
              onClick={() => navigate("/regular-form")}
            >
              HRMS
            </a>
          )}

          {/* COMMON FOR EVERYONE */}
          {hasTabAccess("MY_TASK") && (
            <div
              className="MyTaskNotificationWrapper"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/my-tasks")}
            >
              <a>MY TASK</a>
              <span className="MyTaskNotificationBadge">{pendingCount}</span>
            </div>
          )}

          {hasTabAccess("MY_TICKETS") && (
            <a role="button" tabIndex={0} onClick={() => navigate("/my-tickets")}>
              MY TICKETS
            </a>
          )}

          {hasTabAccess("MY_MAILS") && (
            <a role="button" tabIndex={0} onClick={() => navigate("/my-mails")}>
              MY MAILS
            </a>
          )}

          {/* PROFILE USER MENU WITH DEPARTMENT ACCESS & SWITCHER */}
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
              👤 {user?.displayName || user?.username || "User"}
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
                  width: "240px",
                  zIndex: 9999,
                  color: "#0f172a",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "6px",
                    marginBottom: "4px",
                  }}
                >
                  {user?.displayName || user?.username}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "10px",
                  }}
                >
                  Department: <strong>{user?.department || "Operations"}</strong> ({user?.role})
                </div>

                {isAdmin && (
                  <>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#475569",
                        marginBottom: "6px",
                        textTransform: "uppercase",
                      }}
                    >
                      Switch Profile:
                    </div>
                    <div
                      style={{
                        maxHeight: "140px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginBottom: "10px",
                      }}
                    >
                      {(allProfiles || []).map((p) => {
                        const isCurrent =
                          (user?.username || "").toLowerCase() ===
                          p.username.toLowerCase();
                        return (
                          <div
                            key={p.username}
                            onClick={() => handleSwitchProfile(p.username)}
                            style={{
                              padding: "6px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: isCurrent ? "700" : "500",
                              background: isCurrent ? "#eff6ff" : "#f8fafc",
                              color: isCurrent ? "#2563eb" : "#334155",
                              border: isCurrent ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{p.username}</span>
                            <span style={{ fontSize: "10.5px", color: "#64748b" }}>
                              [{p.department || "Ops"}]
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

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
                  Main Window
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
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="navbarbgc">
        <img src={corosolimg} className="hero-img" alt="carousel" />
        <div className="hero-content">
          <div className="search-box">
            <input placeholder="What are you looking for?" />
            <button>Search</button>
          </div>
        </div>
      </div>

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
              {item.desc && <p className="HomeCardDescription">{item.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
