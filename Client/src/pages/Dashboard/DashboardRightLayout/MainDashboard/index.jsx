

import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EmployeeContext } from "../EmployeeContext.js";
import { fetchApiData, extractArrayData } from "../../../../utils/apiClient";
import "./index.css";

function MainDashboard() {
  const context = useContext(EmployeeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [apiCustomers, setApiCustomers] = useState([]);
  const [selectedCust, setSelectedCust] = useState("All Customers");
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard", "total-sites", "active-sites", "total-employees", "clocked-in"
  
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "Overview";

  const [currentDateStr, setCurrentDateStr] = useState("");
  const [currentDayStr, setCurrentDayStr] = useState("");

  useEffect(() => {
    const today = new Date();
    const options = { day: "numeric", month: "short", year: "numeric" };
    setCurrentDateStr(today.toLocaleDateString("en-GB", options));
    
    const dayOptions = { weekday: "long" };
    setCurrentDayStr(today.toLocaleDateString("en-GB", dayOptions));
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetchApiData("/api/BoardingCandidates");
        const allCandidates = extractArrayData(response.data);

        const boarded = allCandidates.filter((item) => {
          const s = String(item.status || item.approvalStatus || "").trim().toLowerCase();
          return (
            s === "on boarded" ||
            s === "onboarded" ||
            s === "boarded" ||
            item.isBoarded === true
          );
        });

        const requesters = [...new Set(boarded.map((item) => item.requester).filter(Boolean))];
        const merged = ["All Customers", ...new Set([...requesters, "Dell", "Microsoft", "Google", "Amazon"])];
        setApiCustomers(merged);
      } catch (err) {
        console.error("Error fetching candidates for dashboard:", err);
        setApiCustomers(["All Customers", "Dell", "Microsoft", "Google", "Amazon"]);
      }
    };
    fetchCandidates();
  }, []);

  const fallbackData = useMemo(() => {
    return {
      "All Customers": [
        { siteName: "Noida", count: 9, totalEmployees: 240, clockedIn: 185, percentage: 37.5, color: "#2563eb", address: "Sector 62, Noida, UP", active: true },
        { siteName: "Delhi", count: 7, totalEmployees: 200, clockedIn: 142, percentage: 29.2, color: "#10b981", address: "Okhla Phase 3, New Delhi", active: true },
        { siteName: "Gurugram", count: 5, totalEmployees: 160, clockedIn: 105, percentage: 20.8, color: "#8b5cf6", address: "Cyber City, Phase 2, Gurugram", active: true },
        { siteName: "Bangalore", count: 3, totalEmployees: 120, clockedIn: 74, percentage: 12.5, color: "#f97316", address: "Whitefield, Bangalore, Karnataka", active: true }
      ],
      Dell: [
        { siteName: "Noida", count: 2, totalEmployees: 50, clockedIn: 40, percentage: 40, color: "#2563eb", address: "Sector 62, Noida, UP", active: true },
        { siteName: "Delhi", count: 1, totalEmployees: 30, clockedIn: 25, percentage: 30, color: "#10b981", address: "Okhla Phase 3, New Delhi", active: true },
        { siteName: "Gurugram", count: 1, totalEmployees: 20, clockedIn: 15, percentage: 20, color: "#8b5cf6", address: "Cyber City, Phase 2, Gurugram", active: true },
        { siteName: "Bangalore", count: 1, totalEmployees: 16, clockedIn: 12, percentage: 10, color: "#f97316", address: "Whitefield, Bangalore, Karnataka", active: true }
      ],
      Microsoft: [
        { siteName: "Noida", count: 1, totalEmployees: 40, clockedIn: 35, percentage: 25, color: "#2563eb", address: "Sector 144, Noida, UP", active: true },
        { siteName: "Delhi", count: 2, totalEmployees: 60, clockedIn: 50, percentage: 40, color: "#10b981", address: "Connaught Place, New Delhi", active: true },
        { siteName: "Gurugram", count: 1, totalEmployees: 25, clockedIn: 20, percentage: 15, color: "#8b5cf6", address: "Golf Course Road, Gurugram", active: true },
        { siteName: "Bangalore", count: 2, totalEmployees: 30, clockedIn: 26, percentage: 20, color: "#f97316", address: "Outer Ring Road, Bangalore", active: true }
      ],
      Google: [
        { siteName: "Noida", count: 3, totalEmployees: 80, clockedIn: 70, percentage: 45, color: "#2563eb", address: "Sector 135, Noida, UP", active: true },
        { siteName: "Delhi", count: 1, totalEmployees: 40, clockedIn: 32, percentage: 25, color: "#10b981", address: "Dwarka Sector 21, New Delhi", active: true },
        { siteName: "Gurugram", count: 2, totalEmployees: 30, clockedIn: 24, percentage: 20, color: "#8b5cf6", address: "Sector 48, Gurugram", active: true },
        { siteName: "Bangalore", count: 1, totalEmployees: 15, clockedIn: 12, percentage: 10, color: "#f97316", address: "RMZ Infinity, Bangalore", active: true }
      ],
      Amazon: [
        { siteName: "Noida", count: 2, totalEmployees: 70, clockedIn: 58, percentage: 35, color: "#2563eb", address: "Sector 125, Noida, UP", active: true },
        { siteName: "Delhi", count: 2, totalEmployees: 50, clockedIn: 42, percentage: 30, color: "#10b981", address: "Jasola Vihar, New Delhi", active: true },
        { siteName: "Gurugram", count: 1, totalEmployees: 30, clockedIn: 24, percentage: 20, color: "#8b5cf6", address: "Sohna Road, Gurugram", active: true },
        { siteName: "Bangalore", count: 1, totalEmployees: 25, clockedIn: 21, percentage: 15, color: "#f97316", address: "Manyata Tech Park, Bangalore", active: true }
      ]
    };
  }, []);

  const currentCustData = useMemo(() => {
    return fallbackData[selectedCust] || fallbackData["All Customers"];
  }, [selectedCust, fallbackData]);

  // Dynamic values
  const totalSites = useMemo(() => {
    if (selectedCust === "All Customers") return 24;
    return currentCustData.reduce((sum, item) => sum + item.count, 0);
  }, [selectedCust, currentCustData]);

  const activeSites = useMemo(() => {
    if (selectedCust === "All Customers") return 16;
    return currentCustData.filter((item) => item.clockedIn > 0).length;
  }, [selectedCust, currentCustData]);

  const totalEmployees = useMemo(() => {
    if (selectedCust === "All Customers") return 611;
    return currentCustData.reduce((sum, item) => sum + item.totalEmployees, 0);
  }, [selectedCust, currentCustData]);

  const clockedIn = useMemo(() => {
    if (selectedCust === "All Customers") return 506;
    return currentCustData.reduce((sum, item) => sum + item.clockedIn, 0);
  }, [selectedCust, currentCustData]);

  const handleSiteClick = (siteName, customerName) => {
    const targetCust = customerName || selectedCust;
    navigate("/employe-sites", {
      state: {
        requester: targetCust === "All Customers" ? "Dell" : targetCust,
        siteName: siteName
      }
    });
  };

  const donutSectors = useMemo(() => {
    let accumulatedPercent = 0;
    const size = 565.48; // Circumference for r=90

    return currentCustData.map((site) => {
      const strokeDasharray = `${size}`;
      const strokeDashoffset = `${size - (site.percentage / 100) * size}`;
      const rotation = (accumulatedPercent / 100) * 360 - 90;
      
      const midAngle = rotation + (site.percentage / 100 * 360) / 2;
      const rad = (midAngle * Math.PI) / 180;
      const labelX = 150 + 90 * Math.cos(rad);
      const labelY = 150 + 90 * Math.sin(rad);

      accumulatedPercent += site.percentage;

      return {
        ...site,
        strokeDasharray,
        strokeDashoffset,
        rotation,
        labelX,
        labelY
      };
    });
  }, [currentCustData]);

  const drawSparkline = (color) => (
    <svg width="100%" height="32" viewBox="0 0 240 32" className="sparkline-svg">
      <path
        d="M0 24 Q 40 8, 80 20 T 160 16 T 240 12"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  // Generate employees mock detailed list
  const employeesList = useMemo(() => {
    const list = [];
    const names = [
      "Erin Gilmore", "Alex Rivera", "Jordan Smith", "Taylor Swift", "Chris Evans",
      "Morgan Freeman", "Jamie Lannister", "Sarah Connor", "John Doe", "Jane Foster",
      "Peter Parker", "Bruce Wayne", "Clark Kent", "Diana Prince", "Tony Stark"
    ];
    let nameIdx = 0;
    currentCustData.forEach((site) => {
      const custName = site.customer || selectedCust;
      for (let i = 0; i < site.totalEmployees; i++) {
        const empName = names[nameIdx % names.length] + ` (${(nameIdx + 1).toString().padStart(3, "0")})`;
        const isClockedIn = i < site.clockedIn;
        list.push({
          id: `EMP-${nameIdx + 1000}`,
          name: empName,
          customer: custName,
          siteName: site.siteName,
          role: i % 2 === 0 ? "Security Guard" : "Supervisor",
          shiftTime: i % 2 === 0 ? "07:00 - 15:00" : "15:00 - 23:00",
          clockedIn: isClockedIn,
          actualClockIn: isClockedIn ? "07:02" : "-",
          actualClockOut: "-",
          coordinatorVerify: isClockedIn ? "✓ Verified" : "⚠️ Warning"
        });
        nameIdx++;
      }
    });
    return list;
  }, [currentCustData, selectedCust]);

  return (
    <div className="dashboard-root">

      {/* TOP HEADER CONTROLS */}
      {activeView === "dashboard" ? (
        <div className="dashboard-header-controls">
          <div className="customer-selector-card">
            <label className="selector-label">Select Customer</label>
            <div className="select-wrapper">
              <select
                value={selectedCust}
                onChange={(e) => setSelectedCust(e.target.value)}
                className="customer-dropdown"
              >
                {apiCustomers.map((cust) => (
                  <option key={cust} value={cust}>
                    {cust}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* WELCOME BANNER WITH DYNAMIC DATES */}
          <div className="welcome-banner-card">
            <div className="welcome-left">
              <div className="building-art">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="12" y="16" width="18" height="40" rx="3" fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="2"/>
                  <rect x="34" y="24" width="18" height="32" rx="3" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2"/>
                  <line x1="18" y1="24" x2="24" y2="24" stroke="#2563eb" strokeWidth="2"/>
                  <line x1="18" y1="32" x2="24" y2="32" stroke="#2563eb" strokeWidth="2"/>
                  <line x1="18" y1="40" x2="24" y2="40" stroke="#2563eb" strokeWidth="2"/>
                  <line x1="40" y1="32" x2="46" y2="32" stroke="#3b82f6" strokeWidth="2"/>
                  <line x1="40" y1="40" x2="46" y2="40" stroke="#3b82f6" strokeWidth="2"/>
                </svg>
              </div>
              <div className="welcome-text-info">
                <h2>Good morning! 👋</h2>
                <p>Here's what's happening across all locations today.</p>
                <div className="live-pill">
                  <span className="live-dot"></span>
                  Live updates
                </div>
              </div>
            </div>
            <div className="welcome-right">
              <div className="welcome-date-item">
                <svg className="welcome-date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{currentDateStr}</span>
              </div>
              <div className="welcome-date-item">
                <svg className="welcome-date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{currentDayStr}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-header-controls-detail">
          <button onClick={() => setActiveView("dashboard")} className="back-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Overview
          </button>
        </div>
      )}

      {/* OVERVIEW TAB CONTENT */}
      {activeTab === "Overview" && activeView === "dashboard" && (
        <>
          {/* METRICS ROW */}
          <div className="metrics-row">
            <div className="metric-card clickable-card" onClick={() => setActiveView("total-sites")}>
              <div className="metric-header">
                <div className="metric-icon-box bg-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="10" width="20" height="12" rx="2" />
                    <path d="M6 10V5a3 3 0 0 1 6 0v5" />
                  </svg>
                </div>
                <button className="metric-dots-btn" onClick={(e) => e.stopPropagation()}>⋮</button>
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Sites</span>
                <span className="metric-value font-number">{totalSites}</span>
                <span className="metric-sub">All locations</span>
              </div>
              <div className="metric-sparkline">
                {drawSparkline("#2563eb")}
              </div>
            </div>

            <div className="metric-card clickable-card" onClick={() => setActiveView("active-sites")}>
              <div className="metric-header">
                <div className="metric-icon-box bg-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <button className="metric-dots-btn" onClick={(e) => e.stopPropagation()}>⋮</button>
              </div>
              <div className="metric-info">
                <span className="metric-label">Active Sites</span>
                <span className="metric-value font-number">{activeSites}</span>
                <span className="metric-sub">Currently active</span>
              </div>
              <div className="metric-sparkline">
                {drawSparkline("#10b981")}
              </div>
            </div>

            <div className="metric-card clickable-card" onClick={() => setActiveView("total-employees")}>
              <div className="metric-header">
                <div className="metric-icon-box bg-purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <button className="metric-dots-btn" onClick={(e) => e.stopPropagation()}>⋮</button>
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Employees</span>
                <span className="metric-value font-number">{totalEmployees}</span>
                <span className="metric-sub">Across all sites</span>
              </div>
              <div className="metric-sparkline">
                {drawSparkline("#8b5cf6")}
              </div>
            </div>

            <div className="metric-card clickable-card" onClick={() => setActiveView("clocked-in")}>
              <div className="metric-header">
                <div className="metric-icon-box bg-orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                </div>
                <button className="metric-dots-btn" onClick={(e) => e.stopPropagation()}>⋮</button>
              </div>
              <div className="metric-info">
                <span className="metric-label">Clocked In</span>
                <span className="metric-value font-number">{clockedIn}</span>
                <span className="metric-sub">Right now</span>
              </div>
              <div className="metric-sparkline">
                {drawSparkline("#f97316")}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* SITES OVERVIEW / DONUT CHART */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="card-title">Sites Overview</h3>
                <button className="more-options-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>

              <div className="donut-chart-container">
                <svg width="300" height="300" viewBox="0 0 300 300" className="donut-svg">
                  {donutSectors.map((sector, index) => (
                    <circle
                      key={index}
                      cx="150"
                      cy="150"
                      r="90"
                      fill="transparent"
                      stroke={sector.color}
                      strokeWidth="32"
                      strokeDasharray={sector.strokeDasharray}
                      strokeDashoffset={sector.strokeDashoffset}
                      transform={`rotate(${sector.rotation} 150 150)`}
                      className="donut-segment"
                    />
                  ))}
                  {donutSectors.map((sector, index) => {
                    if (sector.percentage < 5) return null;
                    return (
                      <text
                        key={`pct-${index}`}
                        x={sector.labelX}
                        y={sector.labelY + 4}
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="700"
                        textAnchor="middle"
                        className="font-number"
                      >
                        {sector.percentage}
                      </text>
                    );
                  })}
                  <text x="150" y="145" textAnchor="middle" className="donut-center-val font-number">
                    {totalSites}
                  </text>
                  <text x="150" y="175" textAnchor="middle" className="donut-center-lbl">
                    Total Sites
                  </text>
                </svg>
              </div>

              <div className="donut-legend">
                {donutSectors.map((sector, index) => (
                  <div key={index} className="legend-item" onClick={() => handleSiteClick(sector.siteName, sector.customer)}>
                    <span className="legend-dot" style={{ backgroundColor: sector.color }} />
                    <span className="legend-text-label">
                      {sector.siteName}
                    </span>
                    <span className="legend-text-val font-number">
                      {sector.count} {sector.count > 1 ? "Sites" : "Site"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="chart-footer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Click on any site to view details</span>
              </div>
            </div>

            {/* SITE LIST VIEW */}
            <div className="list-card">
              <div className="list-card-header">
                <h3 className="card-title">Site List</h3>
                <button className="view-all-link" onClick={() => setActiveView("total-sites")}>View all</button>
              </div>

              <div className="sites-list-container">
                {currentCustData.map((site, index) => (
                  <div
                    key={index}
                    className="site-list-item"
                    onClick={() => handleSiteClick(site.siteName, site.customer)}
                  >
                    <div className="site-item-left">
                      <span className="site-indicator-dot" style={{ backgroundColor: site.color }} />
                      <div className="site-info-text">
                        <span className="site-name">
                          {site.siteName} {site.customer && <span className="site-cust-tag">({site.customer})</span>}
                        </span>
                        <span className="site-sub-count-badge font-number">{site.count} {site.count > 1 ? "Sites" : "Site"}</span>
                      </div>
                    </div>

                    <div className="site-item-right">
                      <div className="clock-in-info">
                        <span className="clock-label">Clocked In</span>
                        <span className="clock-count-val">
                          <strong className="font-dark font-number">{site.clockedIn}</strong> <span className="font-divider">/</span> <span className="font-total font-number">{site.totalEmployees}</span>
                        </span>
                      </div>
                      <div className="arrow-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* TIMESHEETS ANALYTICAL OVERVIEW VIEW */}
      {activeTab === "Timesheets" && activeView === "dashboard" && (
        <div className="ts-page animate-fade-in">

          {/* ── KPI CARDS ── */}
          <div className="ts-kpi-row">
            {/* Total Hours */}
            <div className="ts-kpi-card">
              <div className="ts-kpi-icon ts-kpi-icon-blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="ts-kpi-body">
                <span className="ts-kpi-label">Total Hours Logged</span>
                <div className="ts-kpi-value-row">
                  <span className="ts-kpi-num">5,480</span>
                  <span className="ts-kpi-unit">hrs</span>
                </div>
                <span className="ts-kpi-desc">All locations combined</span>
              </div>
              <div className="ts-kpi-bar ts-kpi-bar-blue"></div>
            </div>

            {/* Approved */}
            <div className="ts-kpi-card">
              <div className="ts-kpi-icon ts-kpi-icon-green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>
              </div>
              <div className="ts-kpi-body">
                <span className="ts-kpi-label">Approved Logs</span>
                <div className="ts-kpi-value-row">
                  <span className="ts-kpi-num">384</span>
                  <span className="ts-kpi-unit">Logs</span>
                </div>
                <span className="ts-kpi-desc">This week</span>
              </div>
              <div className="ts-kpi-bar ts-kpi-bar-green"></div>
            </div>

            {/* Pending */}
            <div className="ts-kpi-card">
              <div className="ts-kpi-icon ts-kpi-icon-purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="ts-kpi-body">
                <span className="ts-kpi-label">Pending Approval</span>
                <div className="ts-kpi-value-row">
                  <span className="ts-kpi-num">48</span>
                  <span className="ts-kpi-unit">Logs</span>
                </div>
                <span className="ts-kpi-desc">Awaiting review</span>
              </div>
              <div className="ts-kpi-bar ts-kpi-bar-purple"></div>
            </div>

            {/* Disputed */}
            <div className="ts-kpi-card">
              <div className="ts-kpi-icon ts-kpi-icon-orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div className="ts-kpi-body">
                <span className="ts-kpi-label">Disputed Hours</span>
                <div className="ts-kpi-value-row">
                  <span className="ts-kpi-num">5</span>
                  <span className="ts-kpi-unit">Logs</span>
                </div>
                <span className="ts-kpi-desc">Requires attention</span>
              </div>
              <div className="ts-kpi-bar ts-kpi-bar-orange"></div>
            </div>
          </div>

          {/* ── CHARTS ROW ── */}
          <div className="ts-charts-grid">

            {/* Hours Logged Trend (SVG area chart) */}
            <div className="ts-chart-card">
              <div className="ts-chart-header">
                <div className="ts-chart-title-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  <span className="ts-chart-title">Hours Logged Trend</span>
                </div>
                <span className="ts-period-badge">Last 7 Days</span>
              </div>
              <svg width="100%" height="160" viewBox="0 0 560 160" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0,40,80,120,160].map((y, i) => (
                  <line key={i} x1="40" y1={y} x2="560" y2={y} stroke="#f1f5f9" strokeWidth="1"/>
                ))}
                {/* Y labels */}
                {["8K","6K","4K","2K","0"].map((l, i) => (
                  <text key={i} x="32" y={i * 40 + 6} textAnchor="end" fontSize="10" fill="#94a3b8">{l}</text>
                ))}
                {/* Area fill */}
                <defs>
                  <linearGradient id="tsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01"/>
                  </linearGradient>
                </defs>
                <path d="M60,120 L140,88 L220,76 L300,84 L380,72 L460,80 L540,72 L540,160 L60,160 Z" fill="url(#tsGrad)"/>
                {/* Line */}
                <polyline points="60,120 140,88 220,76 300,84 380,72 460,80 540,72" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Dots */}
                {[[60,120],[140,88],[220,76],[300,84],[380,72],[460,80],[540,72]].map(([cx,cy],i) => (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#fff" stroke="#2563eb" strokeWidth="2.5"/>
                ))}
                {/* X labels */}
                {["15 Aug","16 Aug","17 Aug","18 Aug","19 Aug","20 Aug","21 Aug"].map((l, i) => (
                  <text key={i} x={60 + i * 80} y="156" textAnchor="middle" fontSize="10" fill="#94a3b8">{l}</text>
                ))}
              </svg>
            </div>

            {/* Hours by Location (donut) */}
            <div className="ts-chart-card ts-donut-card">
              <div className="ts-chart-header">
                <div className="ts-chart-title-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="ts-chart-title">Hours by Location</span>
                </div>
              </div>
              <div className="ts-donut-wrap">
                {/* Donut */}
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {/* Noida 35% – blue */}
                  <circle cx="70" cy="70" r="50" fill="transparent" stroke="#2563eb" strokeWidth="24"
                    strokeDasharray="110 204.16" strokeDashoffset="0" transform="rotate(-90 70 70)"/>
                  {/* Delhi 29.2% – green */}
                  <circle cx="70" cy="70" r="50" fill="transparent" stroke="#10b981" strokeWidth="24"
                    strokeDasharray="91.7 222.46" strokeDashoffset="-110" transform="rotate(-90 70 70)"/>
                  {/* Gurugram 23.4% – purple */}
                  <circle cx="70" cy="70" r="50" fill="transparent" stroke="#8b5cf6" strokeWidth="24"
                    strokeDasharray="73.5 240.66" strokeDashoffset="-201.7" transform="rotate(-90 70 70)"/>
                  {/* Bangalore 17.5% – orange */}
                  <circle cx="70" cy="70" r="50" fill="transparent" stroke="#f97316" strokeWidth="24"
                    strokeDasharray="55 259.16" strokeDashoffset="-275.2" transform="rotate(-90 70 70)"/>
                  <text x="70" y="66" textAnchor="middle" fontSize="17" fontWeight="800" fill="#0f172a" className="font-number">5,480</text>
                  <text x="70" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">Total Hrs</text>
                </svg>

                {/* Legend */}
                <div className="ts-donut-legend">
                  {[
                    { name:"Noida",     hrs:"1,920 hrs", pct:"35.0%", color:"#2563eb"  },
                    { name:"Delhi",     hrs:"1,600 hrs", pct:"29.2%", color:"#10b981"  },
                    { name:"Gurugram",  hrs:"1,280 hrs", pct:"23.4%", color:"#8b5cf6"  },
                    { name:"Bangalore", hrs:"960 hrs",   pct:"17.5%", color:"#f97316"  },
                  ].map((loc) => (
                    <div key={loc.name} className="ts-legend-row">
                      <span className="ts-legend-dot" style={{background: loc.color}}></span>
                      <span className="ts-legend-name">{loc.name}</span>
                      <span className="ts-legend-hrs">{loc.hrs}</span>
                      <span className="ts-legend-pct">{loc.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── LOCATION PERFORMANCE TABLE ── */}
          <div className="ts-table-card">
            <div className="ts-table-header">
              <div className="ts-chart-title-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span className="ts-chart-title">Location Performance Overview</span>
              </div>
            </div>
            <div className="detail-table-wrapper">
              <table className="detail-table ts-perf-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Total Approved Hours</th>
                    <th>Assigned Supervisors</th>
                    <th>Recent Submissions</th>
                    <th>Approval Ratio</th>
                    <th>Operational Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name:"Noida",     color:"#2563eb", hrs:"1,920 hrs", submissions: currentCustData[0]?.clockedIn ?? 185 },
                    { name:"Delhi",     color:"#10b981", hrs:"1,600 hrs", submissions: currentCustData[1]?.clockedIn ?? 142 },
                    { name:"Gurugram",  color:"#8b5cf6", hrs:"1,280 hrs", submissions: currentCustData[2]?.clockedIn ?? 105 },
                    { name:"Bangalore", color:"#f97316", hrs:"960 hrs",   submissions: currentCustData[3]?.clockedIn ?? 74  },
                  ].map((row, i) => (
                    <tr key={row.name}>
                      <td>
                        <div className="ts-loc-cell">
                          <span className="ts-loc-icon" style={{borderColor: row.color, color: row.color}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                          </span>
                          <span className="fw-semibold">{row.name}</span>
                        </div>
                      </td>
                      <td className="font-number fw-bold">{row.hrs}</td>
                      <td className="text-secondary">Supervisor {String(i+1).padStart(2,"0")}</td>
                      <td className="text-secondary">{row.submissions} Submissions</td>
                      <td>
                        <div className="ts-ratio-cell">
                          <div className="ts-ratio-bar">
                            <div className="ts-ratio-fill" style={{width:"100%", background: row.color}}></div>
                          </div>
                          <span className="ts-ratio-pct">100%</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-pill bg-success-pill">Synchronized</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* REPORTS ANALYTICAL OVERVIEW VIEW */}
      {activeTab === "Reports" && activeView === "dashboard" && (
        <div className="ts-page animate-fade-in">
          
          {/* ── REPORTS MAIN CONTENT CARD ── */}
          <div className="ts-table-card">
            <div className="ts-table-header" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '24px' }}>
              <h3 className="ts-chart-title" style={{ fontSize: '18px' }}>Reports Analytics Overview ({selectedCust})</h3>
            </div>
            
            {/* KPI Row */}
            <div className="rep-kpi-row">
              {/* Compliance Score */}
              <div className="rep-kpi-card">
                <div className="rep-kpi-icon rep-icon-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div className="rep-kpi-body">
                  <span className="ts-kpi-label">Compliance Score</span>
                  <span className="ts-kpi-num">96.4%</span>
                </div>
              </div>

              {/* Average Attendance */}
              <div className="rep-kpi-card">
                <div className="rep-kpi-icon rep-icon-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="rep-kpi-body">
                  <span className="ts-kpi-label">Average Attendance</span>
                  <span className="ts-kpi-num">98.2%</span>
                </div>
              </div>

              {/* Roster SLA Breach */}
              <div className="rep-kpi-card">
                <div className="rep-kpi-icon rep-icon-purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
                <div className="rep-kpi-body">
                  <span className="ts-kpi-label">Roster SLA Breach</span>
                  <span className="ts-kpi-num">0.5%</span>
                </div>
              </div>

              {/* Guard Audit Score */}
              <div className="rep-kpi-card">
                <div className="rep-kpi-icon rep-icon-orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="rep-kpi-body">
                  <span className="ts-kpi-label">Guard Audit Score</span>
                  <span className="ts-kpi-num">95%</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="detail-table-wrapper" style={{ marginTop: '24px' }}>
              <table className="detail-table ts-perf-table">
                <thead>
                  <tr>
                    <th>Compliance Factor</th>
                    <th>Audited Sites</th>
                    <th>SLA Target Status</th>
                    <th>Quality Index</th>
                    <th>System Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-semibold">Active Patrol Logs</td>
                    <td className="text-secondary">24 audited locations</td>
                    <td className="fw-bold text-dark">98.5% Compliant</td>
                    <td className="text-secondary">Excellent</td>
                    <td><span className="badge-pill bg-success-pill">Optimal</span></td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Coordinator Verification Ratio</td>
                    <td className="text-secondary">16 active zones</td>
                    <td className="fw-bold text-dark">99.1% Verified</td>
                    <td className="text-secondary">Excellent</td>
                    <td><span className="badge-pill bg-success-pill">Optimal</span></td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Incident Mitigation SLA</td>
                    <td className="text-secondary">All zones</td>
                    <td className="fw-bold text-dark">95.0% Resolved &lt; 30m</td>
                    <td className="text-secondary">Very Good</td>
                    <td><span className="badge-pill bg-primary-pill">Review Guard Logs</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INCIDENTS ANALYTICAL OVERVIEW VIEW */}
      {activeTab === "Incidents" && activeView === "dashboard" && (
        <div className="detail-view-card animate-fade-in">
          <div className="detail-view-header">
            <h3 className="detail-view-title">Incidents Tracker Overview ({selectedCust})</h3>
          </div>

          <div className="metrics-row mini-metrics">
            <div className="metric-card">
              <span className="metric-label">Total Logs (24h)</span>
              <span className="metric-value font-number text-primary">12 Cases</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Mitigated</span>
              <span className="metric-value font-number font-green">10 Cases</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Under Investigation</span>
              <span className="metric-value font-number text-warning">2 Cases</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Critical Severity</span>
              <span className="metric-value font-number text-danger">0 Cases</span>
            </div>
          </div>

          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Incident Log ID</th>
                  <th>Location</th>
                  <th>Incident Type</th>
                  <th>Logged By</th>
                  <th>Action Taken</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono">INC-38902</td>
                  <td className="fw-semibold">Noida Site A</td>
                  <td>Unauthorized Entry Attempt</td>
                  <td>Guard 012</td>
                  <td>Access Denied & Logged</td>
                  <td><span className="badge-pill bg-success-pill">Resolved</span></td>
                </tr>
                <tr>
                  <td className="font-mono">INC-38905</td>
                  <td className="fw-semibold">Gurugram Cybercity</td>
                  <td>Intruder Warning Trigger</td>
                  <td>Guard 009</td>
                  <td>Perimeter search cleared</td>
                  <td><span className="badge-pill bg-success-pill">Resolved</span></td>
                </tr>
                <tr>
                  <td className="font-mono">INC-38911</td>
                  <td className="fw-semibold">Delhi Okhla</td>
                  <td>Asset Check Audit Warning</td>
                  <td>Supervisor 01</td>
                  <td>Inventory discrepancy check</td>
                  <td><span className="badge-pill bg-warning-pill">Investigating</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONBOARDING CANDIDATE ANALYTICAL OVERVIEW VIEW */}
      {activeTab === "Onboarding Candidate" && activeView === "dashboard" && (
        <div className="detail-view-card animate-fade-in">
          <div className="detail-view-header">
            <h3 className="detail-view-title">Onboarding Pipeline Overview ({selectedCust})</h3>
          </div>

          <div className="metrics-row mini-metrics">
            <div className="metric-card">
              <span className="metric-label">Total Applied Candidates</span>
              <span className="metric-value font-number text-primary">45 Applications</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Compliance Pass</span>
              <span className="metric-value font-number font-green">32 Verified</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Interview Pipeline</span>
              <span className="metric-value font-number text-warning">8 Pending</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Offers Dispatched</span>
              <span className="metric-value font-number text-purple">5 Offers</span>
            </div>
          </div>

          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Candidate ID</th>
                  <th>Name</th>
                  <th>Target Placement Site</th>
                  <th>Compliance Rating</th>
                  <th>Background Check</th>
                  <th>Pipeline State</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono">CND-8902</td>
                  <td className="fw-semibold">Rahul Sharma</td>
                  <td>Noida Sector 62</td>
                  <td>98% Compliance</td>
                  <td><span className="badge-pill bg-success-pill">PASS</span></td>
                  <td>Offer Letter Sent</td>
                </tr>
                <tr>
                  <td className="font-mono">CND-8905</td>
                  <td className="fw-semibold">Arjun Singh</td>
                  <td>Delhi Okhla Phase 3</td>
                  <td>95% Compliance</td>
                  <td><span className="badge-pill bg-success-pill">PASS</span></td>
                  <td>Onboarding Form Submitted</td>
                </tr>
                <tr>
                  <td className="font-mono">CND-8912</td>
                  <td className="fw-semibold">Priya Nair</td>
                  <td>Gurugram Sector 48</td>
                  <td>Pending check</td>
                  <td><span className="badge-pill bg-warning-pill">Pending Docs</span></td>
                  <td>Interview Scheduled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROSTER ANALYTICAL OVERVIEW VIEW */}
      {activeTab === "Roster" && activeView === "dashboard" && (
        <div className="detail-view-card animate-fade-in">
          <div className="detail-view-header">
            <h3 className="detail-view-title">Roster Operations Overview ({selectedCust})</h3>
          </div>

          <div className="metrics-row mini-metrics">
            <div className="metric-card">
              <span className="metric-label">Shift Coverage</span>
              <span className="metric-value font-number font-green">94.8% Covered</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Assigned Shifts</span>
              <span className="metric-value font-number text-primary">142 Shifts</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Open Shifts Alert</span>
              <span className="metric-value font-number text-danger">8 Unassigned</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Standby Guards Ready</span>
              <span className="metric-value font-number text-purple">15 Staff</span>
            </div>
          </div>

          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Shift ID</th>
                  <th>Location Code</th>
                  <th>Shift Schedule Timing</th>
                  <th>Guard Assigned</th>
                  <th>Clock status</th>
                  <th>Shift Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono">SFT-902</td>
                  <td className="fw-semibold">Noida Site-A</td>
                  <td>07:00 AM - 03:00 PM</td>
                  <td>Rahul Sharma (Guard 01)</td>
                  <td><span className="badge-pill bg-success-pill">Clocked In</span></td>
                  <td>High</td>
                </tr>
                <tr>
                  <td className="font-mono">SFT-903</td>
                  <td className="fw-semibold">Delhi Site-B</td>
                  <td>03:00 PM - 11:00 PM</td>
                  <td>Arjun Singh (Guard 02)</td>
                  <td><span className="badge-pill bg-blue-pill">Scheduled</span></td>
                  <td>Medium</td>
                </tr>
                <tr>
                  <td className="font-mono">SFT-904</td>
                  <td className="fw-semibold">Gurugram Site-C</td>
                  <td>11:00 PM - 07:00 AM</td>
                  <td className="text-danger fw-bold">UNASSIGNED (Assign Guard)</td>
                  <td><span className="badge-pill bg-warning-pill">Unfilled</span></td>
                  <td>Critical</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOTAL SITES DETAILS VIEW */}
      {activeView === "total-sites" && (
        <div className="detail-view-card">
          <div className="detail-view-header">
            <h3 className="detail-view-title">Total Sites Details ({selectedCust})</h3>
          </div>
          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Site Name</th>
                  {selectedCust === "All Customers" && <th>Customer</th>}
                  <th>Site Address</th>
                  <th>Total Sites Count</th>
                  <th>Employees Assigned</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentCustData.map((site, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{site.siteName}</td>
                    {selectedCust === "All Customers" && <td>{site.customer}</td>}
                    <td className="text-secondary">{site.address || "Sector 62, Noida"}</td>
                    <td className="font-number">{site.count}</td>
                    <td className="font-number">{site.totalEmployees}</td>
                    <td>
                      <span className="badge-pill bg-success-pill">Active</span>
                    </td>
                    <td>
                      <button className="view-link-btn" onClick={() => handleSiteClick(site.siteName, site.customer)}>
                        View Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACTIVE SITES DETAILS VIEW */}
      {activeView === "active-sites" && (
        <div className="detail-view-card">
          <div className="detail-view-header">
            <h3 className="detail-view-title">Active Sites Details ({selectedCust})</h3>
          </div>
          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Site Name</th>
                  {selectedCust === "All Customers" && <th>Customer</th>}
                  <th>Site Address</th>
                  <th>Current Active Roster Shift</th>
                  <th>Clocked In / Target</th>
                  <th>Activity State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentCustData.filter(site => site.clockedIn > 0).map((site, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{site.siteName}</td>
                    {selectedCust === "All Customers" && <td>{site.customer}</td>}
                    <td className="text-secondary">{site.address || "Sector 62, Noida"}</td>
                    <td>07:00 - 15:00 (Day shift)</td>
                    <td className="fw-bold font-green font-number">{site.clockedIn}/{site.totalEmployees}</td>
                    <td>
                      <span className="badge-pill bg-blue-pill">Roster Running</span>
                    </td>
                    <td>
                      <button className="view-link-btn" onClick={() => handleSiteClick(site.siteName, site.customer)}>
                        Roster View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOTAL EMPLOYEES DETAILS VIEW */}
      {activeView === "total-employees" && (
        <div className="detail-view-card">
          <div className="detail-view-header">
            <h3 className="detail-view-title">Total Employees Details ({selectedCust})</h3>
          </div>
          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Customer</th>
                  <th>Site Name</th>
                  <th>Assigned Role</th>
                  <th>Roster Timing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employeesList.map((emp, index) => (
                  <tr key={index}>
                    <td className="text-secondary font-mono">{emp.id}</td>
                    <td className="fw-semibold">{emp.name}</td>
                    <td>{emp.customer}</td>
                    <td>{emp.siteName}</td>
                    <td>{emp.role}</td>
                    <td>{emp.shiftTime}</td>
                    <td>
                      <span className={`badge-pill ${emp.clockedIn ? "bg-success-pill" : "bg-warning-pill"}`}>
                        {emp.clockedIn ? "Clocked In" : "Offline"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLOCKED IN DETAILS VIEW */}
      {activeView === "clocked-in" && (
        <div className="detail-view-card">
          <div className="detail-view-header">
            <h3 className="detail-view-title">Clocked In Employees Details ({selectedCust})</h3>
          </div>
          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Customer</th>
                  <th>Site Name</th>
                  <th>Shift Time</th>
                  <th>Clock In Time</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {employeesList.filter(e => e.clockedIn).map((emp, index) => (
                  <tr key={index}>
                    <td className="text-secondary font-mono">{emp.id}</td>
                    <td className="fw-semibold">{emp.name}</td>
                    <td>{emp.customer}</td>
                    <td>{emp.siteName}</td>
                    <td>{emp.shiftTime}</td>
                    <td className="fw-bold font-green font-number">{emp.actualClockIn}</td>
                    <td>
                      <span className="badge-pill bg-success-pill">{emp.coordinatorVerify}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainDashboard;
