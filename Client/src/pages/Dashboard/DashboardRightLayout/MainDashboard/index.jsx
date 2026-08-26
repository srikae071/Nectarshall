

import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EmployeeContext } from "../EmployeeContext.js";
import { fetchApiData, extractArrayData } from "../../../../utils/apiClient";
import "./index.css";

// Reusable Table Toolbar Component
const TableToolbar = ({ searchVal, setSearchVal, filteredCount, totalCount, currentPage, pageSize, onPageChange }) => {
  return (
    <div className="table-toolbar">
      <div className="toolbar-left">
        <div className="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search records..." 
            value={searchVal} 
            onChange={(e) => setSearchVal(e.target.value)}
            className="toolbar-search-input"
          />
        </div>
        <span className="toolbar-count">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> records
        </span>
      </div>
      <div className="toolbar-right">
        <div className="pagination-controls">
          <button 
            disabled={currentPage === 1} 
            onClick={() => onPageChange(currentPage - 1)}
            className="pagination-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="page-indicator">
            Page <strong>{currentPage}</strong> of <strong>{Math.ceil(totalCount / pageSize) || 1}</strong>
          </span>
          <button 
            disabled={currentPage * pageSize >= totalCount} 
            onClick={() => onPageChange(currentPage + 1)}
            className="pagination-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const incidentLogs = [
  { id: "INC-38902", location: "Noida Site A", type: "Unauthorized Entry Attempt", loggedBy: "Guard 012", priority: "High", status: "Resolved", action: "Access Denied & Logged", loggedOn: "24 Aug 2026, 10:15 AM" },
  { id: "INC-38905", location: "Gurugram Cybercity", type: "Intruder Warning Trigger", loggedBy: "Guard 009", priority: "Medium", status: "Resolved", action: "Perimeter search cleared", loggedOn: "24 Aug 2026, 09:42 AM" },
  { id: "INC-38911", location: "Delhi Okhla", type: "Asset Check Audit Warning", loggedBy: "Supervisor 01", priority: "High", status: "Open", action: "Inventory discrepancy check", loggedOn: "24 Aug 2026, 08:30 AM" },
  { id: "INC-38918", location: "Noida Site B", type: "Emergency Exit Alarm", loggedBy: "Guard 015", priority: "Critical", status: "Open", action: "Alarm reset & area secured", loggedOn: "24 Aug 2026, 07:55 AM" },
  { id: "INC-38921", location: "Mumbai Office", type: "CCTV Offline Alert", loggedBy: "Tech Team", priority: "Medium", status: "Open", action: "Network issue identified", loggedOn: "24 Aug 2026, 07:20 AM" },
  { id: "INC-38924", location: "Bangalore Whitefield", type: "Visitor Access Exception", loggedBy: "Guard 021", priority: "Low", status: "Closed", action: "Visitor record verified", loggedOn: "23 Aug 2026, 06:44 PM" },
  { id: "INC-38927", location: "Delhi Dwarka", type: "Fire Panel Notification", loggedBy: "Guard 006", priority: "Critical", status: "Open", action: "Facilities team notified", loggedOn: "23 Aug 2026, 05:18 PM" },
  { id: "INC-38930", location: "Gurugram Site C", type: "Perimeter Sensor Alert", loggedBy: "Guard 018", priority: "High", status: "Resolved", action: "Sensor recalibrated", loggedOn: "23 Aug 2026, 03:05 PM" },
  { id: "INC-38934", location: "Noida Site A", type: "Key Register Mismatch", loggedBy: "Supervisor 02", priority: "Medium", status: "Open", action: "Key register under review", loggedOn: "23 Aug 2026, 01:36 PM" },
  { id: "INC-38939", location: "Mumbai Office", type: "Loading Bay Obstruction", loggedBy: "Guard 011", priority: "Low", status: "Closed", action: "Obstruction removed", loggedOn: "23 Aug 2026, 11:12 AM" },
  { id: "INC-38943", location: "Bangalore Whitefield", type: "Tailgating Alert", loggedBy: "Guard 024", priority: "High", status: "Resolved", action: "Access review completed", loggedOn: "23 Aug 2026, 09:48 AM" },
  { id: "INC-38947", location: "Delhi Okhla", type: "First Aid Cabinet Check", loggedBy: "Supervisor 01", priority: "Low", status: "Closed", action: "Supplies replenished", loggedOn: "22 Aug 2026, 04:25 PM" },
  ...Array.from({ length: 22 }, (_, index) => {
    const isOpen = index < 13;
    const isResolved = index >= 13 && index < 21;
    return {
      id: `INC-${38950 + index}`,
      location: ["Noida Site B", "Delhi Dwarka", "Gurugram Site C", "Mumbai Office"][index % 4],
      type: ["Access Control Alert", "Perimeter Sensor Alert", "CCTV Offline Alert", "Visitor Access Exception"][index % 4],
      loggedBy: `Guard ${String(26 + index).padStart(3, "0")}`,
      priority: index < 4 || (index >= 13 && index < 16) ? "High" : index >= 4 && index < 7 ? "Critical" : index >= 7 && index < 20 ? "Medium" : "Low",
      status: isOpen ? "Open" : isResolved ? "Resolved" : "Closed",
      action: isOpen ? "Assigned for review" : isResolved ? "Issue verified and resolved" : "Follow-up completed",
      loggedOn: `${23 - Math.floor(index / 8)} Aug 2026, ${String(12 - (index % 6)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")} ${index % 2 ? "AM" : "PM"}`,
    };
  }),
];

function MainDashboard() {
  const context = useContext(EmployeeContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [apiCustomers, setApiCustomers] = useState([]);
  const [selectedCust, setSelectedCust] = useState("All Customers");
  const [selectedSiteName, setSelectedSiteName] = useState("");
  const [isCustDropdownOpen, setIsCustDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard", "total-sites", "active-sites", "total-employees", "clocked-in", "site-schedule"
  const [incidentStatusFilter, setIncidentStatusFilter] = useState("All");
  const [incidentPriorityFilter, setIncidentPriorityFilter] = useState("All");
  const [rosterStatusFilter, setRosterStatusFilter] = useState("All");
  const [rosterDetailType, setRosterDetailType] = useState("");
  const [selectedRosterEmployee, setSelectedRosterEmployee] = useState(null);
  const [hoveredRosterBar, setHoveredRosterBar] = useState("");
  const [incidentDetailType, setIncidentDetailType] = useState("");
  const [hoveredIncidentStatus, setHoveredIncidentStatus] = useState("");
  const [hoveredIncidentPriority, setHoveredIncidentPriority] = useState("");
  const [incidentMenuId, setIncidentMenuId] = useState("");
  
  // Pagination and Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "Overview";

  const [currentDateStr, setCurrentDateStr] = useState("");
  const [currentDayStr, setCurrentDayStr] = useState("");
  const [greeting, setGreeting] = useState("Good morning");
  const [dateRangeStr, setDateRangeStr] = useState("");

  useEffect(() => {
    const today = new Date();
    const options = { day: "numeric", month: "short", year: "numeric" };
    setCurrentDateStr(today.toLocaleDateString("en-GB", options));
    
    const dayOptions = { weekday: "long" };
    setCurrentDayStr(today.toLocaleDateString("en-GB", dayOptions));

    const hour = today.getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    const rangeOptions = { day: "numeric", month: "short" };
    setDateRangeStr(`${lastWeek.toLocaleDateString("en-GB", rangeOptions)} - ${today.toLocaleDateString("en-GB", rangeOptions)}`);
  }, []);

  useEffect(() => {
    if (!isCustDropdownOpen) return;

    const handleClickOutside = (event) => {
      const trigger = document.querySelector(".custom-select-trigger");
      const options = document.querySelector(".custom-select-options");
      if (trigger && !trigger.contains(event.target) && options && !options.contains(event.target)) {
        setIsCustDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCustDropdownOpen]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetchApiData("/api/BoardingCandidates");
        const candidates = extractArrayData(response.data);
        const companyNames = candidates
          .map((item) => item.companyName || item.clientName || item.customerName || item.requester)
          .filter(Boolean)
          .map((name) => String(name).trim())
          .filter(Boolean);

        const uniqueCompanies = Array.from(new Set(companyNames));
        if (uniqueCompanies.length > 0) {
          setApiCustomers(["All Customers", ...uniqueCompanies]);
        } else {
          setApiCustomers(["All Customers", "Dell", "Microsoft", "Google", "Amazon"]);
        }
      } catch (error) {
        console.error("Error loading dashboard customers:", error);
        setApiCustomers(["All Customers", "Dell", "Microsoft", "Google", "Amazon"]);
      }
    };

    loadCustomers();
  }, []);

  const fallbackData = useMemo(() => {
    return {
      "All Customers": [
        { siteName: "Noida", count: 9, totalEmployees: 26, clockedIn: 21, percentage: 43.3, color: "#2563eb", address: "Sector 62, Noida, UP - 201301", active: true },
        { siteName: "Delhi", count: 7, totalEmployees: 14, clockedIn: 10, percentage: 23.3, color: "#10b981", address: "Okhla Phase 3, New Delhi - 110020", active: true },
        { siteName: "Gurugram", count: 5, totalEmployees: 10, clockedIn: 7, percentage: 16.7, color: "#8b5cf6", address: "Cyber City, Phase 2, Gurugram - 122002", active: true },
        { siteName: "Bangalore", count: 3, totalEmployees: 10, clockedIn: 6, percentage: 16.7, color: "#f97316", address: "Whitefield, Bangalore, Karnataka - 560066", active: true }
      ],
      Dell: [
        { siteName: "Noida", count: 2, totalEmployees: 5, clockedIn: 4, percentage: 41.7, color: "#2563eb", address: "Sector 62, Noida, UP - 201301", active: true },
        { siteName: "Delhi", count: 1, totalEmployees: 3, clockedIn: 2, percentage: 25.0, color: "#10b981", address: "Okhla Phase 3, New Delhi - 110020", active: true },
        { siteName: "Gurugram", count: 1, totalEmployees: 2, clockedIn: 1, percentage: 16.7, color: "#8b5cf6", address: "Cyber City, Phase 2, Gurugram - 122002", active: true },
        { siteName: "Bangalore", count: 1, totalEmployees: 2, clockedIn: 1, percentage: 16.7, color: "#f97316", address: "Whitefield, Bangalore, Karnataka - 560066", active: true }
      ],
      Microsoft: [
        { siteName: "Noida", count: 1, totalEmployees: 6, clockedIn: 5, percentage: 40.0, color: "#2563eb", address: "Sector 144, Noida, UP - 201306", active: true },
        { siteName: "Delhi", count: 2, totalEmployees: 4, clockedIn: 3, percentage: 26.7, color: "#10b981", address: "Connaught Place, New Delhi - 110001", active: true },
        { siteName: "Gurugram", count: 1, totalEmployees: 2, clockedIn: 2, percentage: 13.3, color: "#8b5cf6", address: "Golf Course Road, Gurugram - 122003", active: true },
        { siteName: "Bangalore", count: 2, totalEmployees: 3, clockedIn: 2, percentage: 20.0, color: "#f97316", address: "Outer Ring Road, Bangalore - 560103", active: true }
      ],
      Google: [
        { siteName: "Noida", count: 3, totalEmployees: 7, clockedIn: 6, percentage: 46.7, color: "#2563eb", address: "Sector 135, Noida, UP - 201304", active: true },
        { siteName: "Delhi", count: 1, totalEmployees: 3, clockedIn: 2, percentage: 20.0, color: "#10b981", address: "Dwarka Sector 21, New Delhi - 110077", active: true },
        { siteName: "Gurugram", count: 2, totalEmployees: 3, clockedIn: 2, percentage: 20.0, color: "#8b5cf6", address: "Sector 48, Gurugram - 122018", active: true },
        { siteName: "Bangalore", count: 1, totalEmployees: 2, clockedIn: 1, percentage: 13.3, color: "#f97316", address: "RMZ Infinity, Bangalore - 560016", active: true }
      ],
      Amazon: [
        { siteName: "Noida", count: 2, totalEmployees: 8, clockedIn: 6, percentage: 44.4, color: "#2563eb", address: "Sector 125, Noida, UP - 201313", active: true },
        { siteName: "Delhi", count: 2, totalEmployees: 4, clockedIn: 3, percentage: 22.2, color: "#10b981", address: "Jasola Vihar, New Delhi - 110025", active: true },
        { siteName: "Gurugram", count: 1, totalEmployees: 3, clockedIn: 2, percentage: 16.7, color: "#8b5cf6", address: "Sohna Road, Gurugram - 122018", active: true },
        { siteName: "Bangalore", count: 1, totalEmployees: 3, clockedIn: 2, percentage: 16.7, color: "#f97316", address: "Manyata Tech Park, Bangalore - 560045", active: true }
      ]
    };
  }, []);

  const currentCustData = useMemo(() => {
    return fallbackData[selectedCust] || fallbackData["All Customers"];
  }, [selectedCust, fallbackData]);

  // Dynamic values
  const totalSites = useMemo(() => {
    return currentCustData.reduce((sum, item) => sum + item.count, 0);
  }, [currentCustData]);

  const activeSites = useMemo(() => {
    if (selectedCust === "All Customers") return 16;
    return currentCustData.filter((item) => item.clockedIn > 0).length;
  }, [selectedCust, currentCustData]);

  const totalEmployees = useMemo(() => {
    return currentCustData.reduce((sum, item) => sum + item.totalEmployees, 0);
  }, [currentCustData]);

  const clockedIn = useMemo(() => {
    return currentCustData.reduce((sum, item) => sum + item.clockedIn, 0);
  }, [currentCustData]);

  const handleSiteClick = (siteName, customerName) => {
    const targetCust = customerName || selectedCust;
    setSelectedCust(targetCust);
    setSelectedSiteName(siteName);
    setActiveView("site-schedule");
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

    const sourceData = selectedCust === "All Customers"
      ? ["Dell", "Microsoft", "Google", "Amazon"].flatMap(cust => 
          (fallbackData[cust] || []).map(site => ({ ...site, customer: cust }))
        )
      : currentCustData.map(site => ({ ...site, customer: selectedCust }));

    sourceData.forEach((site) => {
      const custName = site.customer;
      for (let i = 0; i < site.totalEmployees; i++) {
        const empName = names[nameIdx % names.length] + ` (${(nameIdx + 1).toString().padStart(3, "0")})`;
        const isClockedIn = i < site.clockedIn;
        list.push({
          id: `EMP-${nameIdx + 1000}`,
          name: empName,
          customer: custName,
          siteName: site.siteName,
          address: site.address,
          role: i % 2 === 0 ? "Security Guard" : "Supervisor",
          shiftTime: i % 2 === 0 ? "07:00 - 15:00" : "15:00 - 23:00",
          startTime: i % 2 === 0 ? "07:00 AM" : "03:00 PM",
          endTime: i % 2 === 0 ? "03:00 PM" : "11:00 PM",
          clockedIn: isClockedIn,
          actualClockIn: isClockedIn ? "07:02" : "-",
          actualClockOut: "-",
          coordinatorVerify: isClockedIn ? "✓ Verified" : "⚠️ Warning"
        });
        nameIdx++;
      }
    });
    return list;
  }, [currentCustData, selectedCust, fallbackData]);

  const siteEmployees = useMemo(() => {
    return employeesList.filter(emp => {
      const matchSite = emp.siteName === selectedSiteName;
      const matchCust = selectedCust === "All Customers" ? true : emp.customer === selectedCust;
      return matchSite && matchCust;
    });
  }, [employeesList, selectedSiteName, selectedCust]);

  const expandSites = (sites) => {
    const expanded = [];
    sites.forEach(site => {
      const count = site.count || 1;
      for (let i = 0; i < count; i++) {
        const baseEmp = Math.floor(site.totalEmployees / count);
        const extraEmp = i < (site.totalEmployees % count) ? 1 : 0;
        const siteEmp = baseEmp + extraEmp;

        const baseClock = Math.floor(site.clockedIn / count);
        const extraClock = i < (site.clockedIn % count) ? 1 : 0;
        const siteClock = baseClock + extraClock;

        expanded.push({
          ...site,
          siteName: count > 1 ? `${site.siteName} Site ${i + 1}` : site.siteName,
          count: 1,
          totalEmployees: siteEmp,
          clockedIn: siteClock,
          active: siteClock > 0
        });
      }
    });
    return expanded;
  };

  // Filtered and Paginated Employees
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return employeesList.filter(emp => 
      emp.name.toLowerCase().includes(query) || 
      emp.siteName.toLowerCase().includes(query) || 
      emp.customer.toLowerCase().includes(query) || 
      emp.role.toLowerCase().includes(query)
    );
  }, [employeesList, searchQuery]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEmployees.slice(start, start + PAGE_SIZE);
  }, [filteredEmployees, currentPage]);

  const customerIncidentLogs = useMemo(() => {
    const customers = ["Dell", "Microsoft", "Google", "Amazon"];
    const customerSites = {
      Dell: ["Noida Site A", "Delhi Okhla", "Gurugram Cybercity"],
      Microsoft: ["Noida Sector 144", "Delhi Connaught Place", "Bangalore ORR"],
      Google: ["Noida Sector 135", "Delhi Dwarka", "Gurugram Site C"],
      Amazon: ["Noida Site B", "Mumbai Office", "Bangalore Whitefield"],
    };

    return Array.from({ length: 60 }, (_, index) => {
      const template = incidentLogs[index % incidentLogs.length];
      const customer = customers[index % customers.length];
      const statusCycle = ["Open", "Resolved", "Open", "Closed", "Resolved"];
      const priorityCycle = ["Critical", "High", "Medium", "Low", "High", "Medium"];
      const dayOffset = index % 7;

      return {
        ...template,
        id: `INC-${39001 + index}`,
        customer,
        location: customerSites[customer][index % customerSites[customer].length],
        status: statusCycle[index % statusCycle.length],
        priority: priorityCycle[index % priorityCycle.length],
        loggedBy: `Guard ${String(101 + index).padStart(3, "0")}`,
        loggedOn: `${24 - dayOffset} Aug 2026, ${String(8 + (index % 10)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")} ${index % 2 ? "PM" : "AM"}`,
        trendDay: dayOffset,
      };
    }).filter((incident) => selectedCust === "All Customers" || incident.customer === selectedCust);
  }, [selectedCust]);

  const incidentKpis = useMemo(() => ({
    total: customerIncidentLogs.length,
    open: customerIncidentLogs.filter((incident) => incident.status === "Open").length,
    resolved: customerIncidentLogs.filter((incident) => incident.status === "Resolved").length,
    closed: customerIncidentLogs.filter((incident) => incident.status === "Closed").length,
    highPending: customerIncidentLogs.filter(
      (incident) => incident.priority === "High" && incident.status === "Open",
    ).length,
  }), [customerIncidentLogs]);

  const incidentStatusData = useMemo(() => [
    { label: "Open", value: incidentKpis.open, color: "#2878f0" },
    { label: "Resolved", value: incidentKpis.resolved, color: "#65c995" },
    { label: "Closed", value: incidentKpis.closed, color: "#b8c2d2" },
  ], [incidentKpis]);

  const incidentDonutSegments = useMemo(() => {
    const circumference = 2 * Math.PI * 48;
    let offset = 0;
    return incidentStatusData.map((item) => {
      const dash = incidentKpis.total ? (item.value / incidentKpis.total) * circumference : 0;
      const segment = { ...item, circumference, dash, offset: -offset };
      offset += dash;
      return segment;
    });
  }, [incidentStatusData, incidentKpis.total]);

  const incidentPriorityData = useMemo(() => [
    { label: "Critical", value: customerIncidentLogs.filter((incident) => incident.priority === "Critical").length, color: "#ef4444" },
    { label: "High", value: customerIncidentLogs.filter((incident) => incident.priority === "High").length, color: "#f97316" },
    { label: "Medium", value: customerIncidentLogs.filter((incident) => incident.priority === "Medium").length, color: "#fbbf24" },
    { label: "Low", value: customerIncidentLogs.filter((incident) => incident.priority === "Low").length, color: "#48b982" },
  ], [customerIncidentLogs]);

  const incidentTrendData = useMemo(() => Array.from({ length: 7 }, (_, day) => ({
    label: `${18 + day} Aug`,
    value: customerIncidentLogs.filter((incident) => incident.trendDay === 6 - day).length,
  })), [customerIncidentLogs]);

  const incidentTrendPoints = useMemo(() => {
    const maxValue = Math.max(...incidentTrendData.map((item) => item.value), 1);
    return incidentTrendData.map((item, index) => ({
      ...item,
      x: 42 + index * 93,
      y: 185 - (item.value / maxValue) * 145,
    }));
  }, [incidentTrendData]);

  const incidentTrendPath = incidentTrendPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");

  const filteredIncidentLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return customerIncidentLogs.filter((incident) => {
      const matchesQuery = !query || Object.values(incident).some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = incidentStatusFilter === "All" || incident.status === incidentStatusFilter;
      const matchesPriority = incidentPriorityFilter === "All" || incident.priority === incidentPriorityFilter;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [customerIncidentLogs, searchQuery, incidentStatusFilter, incidentPriorityFilter]);

  const incidentPageSize = 6;
  const paginatedIncidentLogs = useMemo(() => {
    const start = (currentPage - 1) * incidentPageSize;
    return filteredIncidentLogs.slice(start, start + incidentPageSize);
  }, [filteredIncidentLogs, currentPage]);

  const openIncidentDetails = (type, value = "All") => {
    setIncidentDetailType(type === "status" ? `${type}:${value}` : type === "priority" ? `${type}:${value}` : type);
    setIncidentStatusFilter(type === "status" ? value : type === "highPending" ? "Open" : "All");
    setIncidentPriorityFilter(type === "priority" ? value : type === "highPending" ? "High" : "All");
    setSearchQuery("");
    setActiveView("incident-detail");
  };

  const incidentDetailLogs = useMemo(() => {
    if (!incidentDetailType || incidentDetailType === "total") return customerIncidentLogs;
    if (incidentDetailType === "highPending") {
      return customerIncidentLogs.filter((incident) => incident.status === "Open" && incident.priority === "High");
    }
    const [type, value] = incidentDetailType.split(":");
    return customerIncidentLogs.filter((incident) => incident[type] === value);
  }, [customerIncidentLogs, incidentDetailType]);

  const incidentDetailTitle = incidentDetailType === "total"
    ? "Total Cases"
    : incidentDetailType === "highPending"
      ? "High Priority Pending"
      : incidentDetailType
        ? `${incidentDetailType.split(":")[1]} Cases`
        : "Incident Cases";

  const rosterEmployees = useMemo(() => {
    const rosterSourceData = selectedCust === "All Customers"
      ? ["Dell", "Microsoft", "Google", "Amazon"].flatMap((customer) =>
          (fallbackData[customer] || []).map((site) => ({ ...site, customer })),
        )
      : (fallbackData[selectedCust] || []).map((site) => ({
          ...site,
          customer: selectedCust,
        }));

    const customerEmployees = [];
    let employeeIndex = 0;

    rosterSourceData.forEach((site) => {
      for (let siteEmployeeIndex = 0; siteEmployeeIndex < site.totalEmployees; siteEmployeeIndex += 1) {
        const name = [
          "Erin Gilmore", "Alex Rivera", "Jordan Smith", "Taylor Swift", "Chris Evans",
          "Morgan Freeman", "Jamie Lannister", "Sarah Connor", "John Doe", "Jane Foster",
          "Peter Parker", "Bruce Wayne", "Clark Kent", "Diana Prince", "Tony Stark",
        ][employeeIndex % 15];

        customerEmployees.push({
          id: `ROSTER-${employeeIndex + 1}`,
          name: `${name} (${String(employeeIndex + 1).padStart(3, "0")})`,
          customer: site.customer,
          siteName: site.siteName,
          address: site.address,
        });
        employeeIndex += 1;
      }
    });

    return customerEmployees.map((employee, index) => {
      const shifts = 8 + (index % 8);
      const declined = index % 6 === 0 ? 2 : index % 4 === 0 ? 1 : 0;
      const pending = index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0;
      const accepted = Math.max(shifts - declined - pending, 0);
      const daily = 6 + (index % 5);
      const weekly = daily * 4 + (index % 3);
      const overDaily = daily > 8;
      const overWeekly = weekly > 38;

      return {
        ...employee,
        location: employee.siteName,
        shifts,
        accepted,
        declined,
        pending,
        daily,
        weekly,
        status: overDaily || overWeekly ? "Hours exceeded" : pending > 0 ? "Pending review" : "On track",
      };
    });
  }, [fallbackData, selectedCust]);

  const filteredRosterEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return rosterEmployees.filter((employee) => {
      const matchesQuery = !query || Object.values(employee).some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = rosterStatusFilter === "All"
        || (rosterStatusFilter === "Alerts" ? employee.daily > 8 || employee.weekly > 38 : employee.status === rosterStatusFilter);
      return matchesQuery && matchesStatus;
    });
  }, [rosterEmployees, searchQuery, rosterStatusFilter]);

  const rosterPageSize = 6;
  const paginatedRosterEmployees = useMemo(() => {
    const start = (currentPage - 1) * rosterPageSize;
    return filteredRosterEmployees.slice(start, start + rosterPageSize);
  }, [filteredRosterEmployees, currentPage]);

  const rosterKpis = useMemo(() => ({
    totalShifts: rosterEmployees.reduce((total, employee) => total + employee.shifts, 0),
    acceptedShifts: rosterEmployees.reduce((total, employee) => total + employee.accepted, 0),
    declinedShifts: rosterEmployees.reduce((total, employee) => total + employee.declined, 0),
    openShifts: rosterEmployees.reduce((total, employee) => total + employee.pending, 0),
    scheduledHours: rosterEmployees.reduce((total, employee) => total + employee.weekly, 0),
  }), [rosterEmployees]);
  const rosterStatusTotal = rosterKpis.acceptedShifts + rosterKpis.declinedShifts + rosterKpis.openShifts;

  const openRosterKpiDetails = (detailType) => {
    setRosterDetailType(detailType);
    setSelectedRosterEmployee(null);
    setActiveView("roster-detail");
  };

  const openRosterEmployeeDetails = (employee) => {
    setSelectedRosterEmployee(employee);
    setRosterDetailType("");
    setActiveView("roster-employee-detail");
  };

  const rosterDetailConfig = {
    totalShifts: { title: "Total Shifts", value: (employee) => employee.shifts, description: "Scheduled shifts by employee" },
    acceptedShifts: { title: "Accepted Shifts", value: (employee) => employee.accepted, description: "Employees with accepted shifts" },
    declinedShifts: { title: "Declined Shifts", value: (employee) => employee.declined, description: "Employees with declined shifts" },
    openShifts: { title: "Open / Unassigned", value: (employee) => employee.pending, description: "Employees with open or pending shifts" },
    scheduledHours: { title: "Total Scheduled Hours", value: (employee) => employee.weekly, description: "Daily and weekly hours by employee" },
  };

  const activeRosterDetail = rosterDetailConfig[rosterDetailType];
  const rosterDetailEmployees = activeRosterDetail
    ? rosterEmployees.filter((employee) => rosterDetailType === "totalShifts" || activeRosterDetail.value(employee) > 0)
    : [];

  // Reset pagination when search or customer changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCust, activeTab, incidentStatusFilter, incidentPriorityFilter, rosterStatusFilter, incidentDetailType]);

  // Reset activeView to dashboard when the top tab is switched
  useEffect(() => {
    setActiveView("dashboard");
  }, [activeTab]);

  const backButtonLabel = activeTab === "Overview"
    ? "Back to Overview"
    : `Back to ${activeTab}`;

  return (
    <div className="dashboard-root">

      {/* TOP HEADER CONTROLS */}
      {activeView === "dashboard" ? (
        <div className="dashboard-header-controls">
          <div className="customer-selector-card">
            <label className="selector-label">Select Customer</label>
            <div className="select-wrapper">
              <div 
                className={`custom-select-trigger ${isCustDropdownOpen ? "open" : ""}`} 
                onClick={() => setIsCustDropdownOpen(!isCustDropdownOpen)}
              >
                {selectedCust}
                <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {isCustDropdownOpen && (
                <div className="custom-select-options">
                  {apiCustomers.map((cust) => (
                    <div 
                      key={cust} 
                      className={`custom-option ${selectedCust === cust ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedCust(cust);
                        setIsCustDropdownOpen(false);
                      }}
                    >
                      {cust}
                    </div>
                  ))}
                </div>
              )}
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
                <h2>{greeting}! 👋</h2>
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
            {backButtonLabel}
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
                      onClick={() => handleSiteClick(sector.siteName, sector.customer)}
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
                  <text x="150" y="140" textAnchor="middle" className="donut-center-val font-number">
                    {totalSites}
                  </text>
                  <text x="150" y="160" textAnchor="middle" className="donut-center-lbl">
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
                        <div className="site-status-row">
                          <span className={`status-chip ${site.active ? "chip-success" : "chip-warning"}`}>
                            {site.active ? "Active" : "Inactive"}
                          </span>
                          <span className="site-sub-count-badge font-number">{site.count} {site.count > 1 ? "Sites" : "Site"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="site-item-right">
                      <div className="clock-in-info">
                        <span className="clock-label">Clocked In</span>
                        <div className="clock-progress-wrapper">
                          <div className="clock-progress-bar">
                            <div 
                              className="clock-progress-fill" 
                              style={{ width: `${(site.clockedIn / site.totalEmployees) * 100}%`, backgroundColor: site.color }}
                            ></div>
                          </div>
                          <span className="clock-count-val">
                            <strong className="font-dark font-number">{site.clockedIn}</strong> <span className="font-divider">/</span> <span className="font-total font-number">{site.totalEmployees}</span>
                          </span>
                        </div>
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
      {activeTab === "Timesheets" && activeView === "dashboard" && (() => {
        // Per-customer timesheet data
        const tsData = {
          "All Customers": {
            totalHours: 5480, approvedLogs: 384, pendingLogs: 48, disputedLogs: 5,
            locations: [
              { name: "Noida",     hrs: 1920, pct: 35.0, color: "#2563eb", clockedIn: 21 },
              { name: "Delhi",     hrs: 1600, pct: 29.2, color: "#10b981", clockedIn: 10 },
              { name: "Gurugram",  hrs: 1280, pct: 23.4, color: "#8b5cf6", clockedIn: 7  },
              { name: "Bangalore", hrs:  680, pct: 12.4, color: "#f97316", clockedIn: 6  },
            ],
            trend: [120, 88, 76, 84, 72, 80, 72],
          },
          Dell: {
            totalHours: 640, approvedLogs: 42, pendingLogs: 5, disputedLogs: 1,
            locations: [
              { name: "Noida",     hrs: 270, pct: 42.2, color: "#2563eb", clockedIn: 4 },
              { name: "Delhi",     hrs: 160, pct: 25.0, color: "#10b981", clockedIn: 2 },
              { name: "Gurugram",  hrs: 110, pct: 17.2, color: "#8b5cf6", clockedIn: 1 },
              { name: "Bangalore", hrs: 100, pct: 15.6, color: "#f97316", clockedIn: 1 },
            ],
            trend: [60, 55, 48, 52, 44, 50, 44],
          },
          Microsoft: {
            totalHours: 960, approvedLogs: 68, pendingLogs: 9, disputedLogs: 1,
            locations: [
              { name: "Noida",     hrs: 384, pct: 40.0, color: "#2563eb", clockedIn: 5 },
              { name: "Delhi",     hrs: 256, pct: 26.7, color: "#10b981", clockedIn: 3 },
              { name: "Gurugram",  hrs: 128, pct: 13.3, color: "#8b5cf6", clockedIn: 2 },
              { name: "Bangalore", hrs: 192, pct: 20.0, color: "#f97316", clockedIn: 2 },
            ],
            trend: [90, 75, 68, 74, 62, 70, 62],
          },
          Google: {
            totalHours: 1200, approvedLogs: 85, pendingLogs: 12, disputedLogs: 2,
            locations: [
              { name: "Noida",     hrs: 560, pct: 46.7, color: "#2563eb", clockedIn: 6 },
              { name: "Delhi",     hrs: 240, pct: 20.0, color: "#10b981", clockedIn: 2 },
              { name: "Gurugram",  hrs: 240, pct: 20.0, color: "#8b5cf6", clockedIn: 2 },
              { name: "Bangalore", hrs: 160, pct: 13.3, color: "#f97316", clockedIn: 1 },
            ],
            trend: [130, 110, 95, 100, 88, 95, 88],
          },
          Amazon: {
            totalHours: 1280, approvedLogs: 94, pendingLogs: 11, disputedLogs: 1,
            locations: [
              { name: "Noida",     hrs: 568, pct: 44.4, color: "#2563eb", clockedIn: 6 },
              { name: "Delhi",     hrs: 284, pct: 22.2, color: "#10b981", clockedIn: 3 },
              { name: "Gurugram",  hrs: 213, pct: 16.7, color: "#8b5cf6", clockedIn: 2 },
              { name: "Bangalore", hrs: 215, pct: 16.7, color: "#f97316", clockedIn: 2 },
            ],
            trend: [100, 85, 72, 80, 68, 76, 68],
          },
        };

        const td = tsData[selectedCust] || tsData["All Customers"];
        const totalHrs = td.totalHours;

        // Build donut sectors for hours-by-location
        const circ = 314.16; // 2πr for r=50
        let accOffset = 0;
        const donutLocs = td.locations.map(loc => {
          const dash = (loc.pct / 100) * circ;
          const offset = -accOffset;
          accOffset += dash;
          return { ...loc, dash, offset };
        });

        // Trend points
        const trendMax = Math.max(...td.trend) + 20;
        const trendPoints = td.trend.map((v, i) => {
          const x = 60 + i * 80;
          const y = 140 - (v / trendMax) * 130;
          return [x, y];
        });
        const polyStr = trendPoints.map(([x, y]) => `${x},${y}`).join(" ");
        const areaStr = `M${trendPoints[0][0]},${trendPoints[0][1]} ` +
          trendPoints.slice(1).map(([x, y]) => `L${x},${y}`).join(" ") +
          ` L${trendPoints[trendPoints.length-1][0]},160 L${trendPoints[0][0]},160 Z`;

        return (
          <div className="ts-page animate-fade-in">

            {/* ── KPI CARDS ── */}
            <div className="ts-kpi-row">
              <div className="ts-kpi-card" style={{ cursor: "pointer" }} onClick={() => setActiveView("timesheet-detail")}>
                <div className="ts-kpi-icon ts-kpi-icon-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="ts-kpi-body">
                  <span className="ts-kpi-label">Total Hours Logged</span>
                  <div className="ts-kpi-value-row">
                    <span className="ts-kpi-num">{totalHrs.toLocaleString()}</span>
                    <span className="ts-kpi-unit">hrs</span>
                  </div>
                  <span className="ts-kpi-desc">{selectedCust === "All Customers" ? "All locations combined" : selectedCust}</span>
                </div>
                <div className="ts-kpi-bar ts-kpi-bar-blue"></div>
              </div>

              <div className="ts-kpi-card" style={{ cursor: "pointer" }} onClick={() => setActiveView("timesheet-detail")}>
                <div className="ts-kpi-icon ts-kpi-icon-green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>
                </div>
                <div className="ts-kpi-body">
                  <span className="ts-kpi-label">Approved Logs</span>
                  <div className="ts-kpi-value-row">
                    <span className="ts-kpi-num">{td.approvedLogs}</span>
                    <span className="ts-kpi-unit">Logs</span>
                  </div>
                  <span className="ts-kpi-desc">This week</span>
                </div>
                <div className="ts-kpi-bar ts-kpi-bar-green"></div>
              </div>

              <div className="ts-kpi-card" style={{ cursor: "pointer" }} onClick={() => setActiveView("timesheet-detail")}>
                <div className="ts-kpi-icon ts-kpi-icon-purple">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="ts-kpi-body">
                  <span className="ts-kpi-label">Pending Approval</span>
                  <div className="ts-kpi-value-row">
                    <span className="ts-kpi-num">{td.pendingLogs}</span>
                    <span className="ts-kpi-unit">Logs</span>
                  </div>
                  <span className="ts-kpi-desc">Awaiting review</span>
                </div>
                <div className="ts-kpi-bar ts-kpi-bar-purple"></div>
              </div>

              <div className="ts-kpi-card" style={{ cursor: "pointer" }} onClick={() => setActiveView("timesheet-detail")}>
                <div className="ts-kpi-icon ts-kpi-icon-orange">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div className="ts-kpi-body">
                  <span className="ts-kpi-label">Disputed Hours</span>
                  <div className="ts-kpi-value-row">
                    <span className="ts-kpi-num">{td.disputedLogs}</span>
                    <span className="ts-kpi-unit">Logs</span>
                  </div>
                  <span className="ts-kpi-desc">Requires attention</span>
                </div>
                <div className="ts-kpi-bar ts-kpi-bar-orange"></div>
              </div>
            </div>

            {/* ── CHARTS ROW ── */}
            <div className="ts-charts-grid">

              {/* Dynamic Hours Logged Trend */}
              <div className="ts-chart-card">
                <div className="ts-chart-header">
                  <div className="ts-chart-title-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <span className="ts-chart-title">Hours Logged Trend — {selectedCust}</span>
                  </div>
                  <span className="ts-period-badge">{dateRangeStr || "Last 7 Days"}</span>
                </div>
                <svg width="100%" height="160" viewBox="0 0 560 160" preserveAspectRatio="none">
                  {[0,40,80,120,160].map((y, i) => (
                    <line key={i} x1="40" y1={y} x2="560" y2={y} stroke="#f1f5f9" strokeWidth="1"/>
                  ))}
                  {["Hi","","Mid","","Lo"].map((l, i) => (
                    <text key={i} x="32" y={i * 40 + 6} textAnchor="end" fontSize="10" fill="#94a3b8">{l}</text>
                  ))}
                  <defs>
                    <linearGradient id="tsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18"/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01"/>
                    </linearGradient>
                  </defs>
                  <path d={areaStr} fill="url(#tsGrad)"/>
                  <polyline points={polyStr} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {trendPoints.map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="4" fill="#fff" stroke="#2563eb" strokeWidth="2.5"/>
                  ))}
                  {["15 Aug","16 Aug","17 Aug","18 Aug","19 Aug","20 Aug","21 Aug"].map((l, i) => (
                    <text key={i} x={60 + i * 80} y="156" textAnchor="middle" fontSize="10" fill="#94a3b8">{l}</text>
                  ))}
                </svg>
              </div>

              {/* Clickable + Hoverable Hours by Location donut */}
              <div className="ts-chart-card ts-donut-card">
                <div className="ts-chart-header">
                  <div className="ts-chart-title-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="ts-chart-title">Hours by Location</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Click a segment to view details</span>
                </div>
                <div className="ts-donut-wrap">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    {donutLocs.map((loc, i) => (
                      <circle
                        key={i}
                        cx="70" cy="70" r="50"
                        fill="transparent"
                        stroke={loc.color}
                        strokeWidth="24"
                        strokeDasharray={`${loc.dash} ${circ - loc.dash}`}
                        strokeDashoffset={loc.offset}
                        transform="rotate(-90 70 70)"
                        className="donut-segment"
                        onClick={() => {
                          setSelectedSiteName(loc.name);
                          setActiveView("timesheet-detail");
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                    <text x="70" y="66" textAnchor="middle" fontSize="17" fontWeight="800" fill="#0f172a" className="font-number">
                      {totalHrs >= 1000 ? `${(totalHrs/1000).toFixed(1)}K` : totalHrs}
                    </text>
                    <text x="70" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">Total Hrs</text>
                  </svg>

                  <div className="ts-donut-legend">
                    {donutLocs.map((loc) => (
                      <div
                        key={loc.name}
                        className="ts-legend-row"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedSiteName(loc.name);
                          setActiveView("timesheet-detail");
                        }}
                      >
                        <span className="ts-legend-dot" style={{ background: loc.color }}></span>
                        <span className="ts-legend-name">{loc.name}</span>
                        <span className="ts-legend-hrs">{loc.hrs.toLocaleString()} hrs</span>
                        <span className="ts-legend-pct">{loc.pct.toFixed(1)}%</span>
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
                  <span className="ts-chart-title">Location Performance Overview — {selectedCust}</span>
                </div>
              </div>
              <div className="detail-table-wrapper">
                <table className="detail-table ts-perf-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Total Approved Hours</th>
                      <th>Assigned Supervisors</th>
                      <th>Clocked In</th>
                      <th>Approval Ratio</th>
                      <th>Operational Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {td.locations.map((row, i) => (
                      <tr
                        key={row.name}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedSiteName(row.name);
                          setActiveView("timesheet-detail");
                        }}
                      >
                        <td>
                          <div className="ts-loc-cell">
                            <span className="ts-loc-icon" style={{ borderColor: row.color, color: row.color }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                            </span>
                            <span className="fw-semibold">{row.name}</span>
                          </div>
                        </td>
                        <td className="font-number fw-bold">{row.hrs.toLocaleString()} hrs</td>
                        <td className="text-secondary">Supervisor {String(i+1).padStart(2,"0")}</td>
                        <td className="text-secondary">{row.clockedIn} Staff</td>
                        <td>
                          <div className="ts-ratio-cell">
                            <div className="ts-ratio-bar">
                              <div className="ts-ratio-fill" style={{ width: `${row.pct}%`, background: row.color }}></div>
                            </div>
                            <span className="ts-ratio-pct">{row.pct.toFixed(1)}%</span>
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
        );
      })()}

      {/* TIMESHEET DETAIL VIEW */}
      {activeView === "timesheet-detail" && (() => {
        const tsData = {
          "All Customers": {
            totalHours: 5480, approvedLogs: 384, pendingLogs: 48, disputedLogs: 5,
            locations: [
              { name: "Noida",     hrs: 1920, pct: 35.0, color: "#2563eb", clockedIn: 21 },
              { name: "Delhi",     hrs: 1600, pct: 29.2, color: "#10b981", clockedIn: 10 },
              { name: "Gurugram",  hrs: 1280, pct: 23.4, color: "#8b5cf6", clockedIn: 7  },
              { name: "Bangalore", hrs:  680, pct: 12.4, color: "#f97316", clockedIn: 6  },
            ],
          },
          Dell: { totalHours: 640, approvedLogs: 42, pendingLogs: 5, disputedLogs: 1, locations: [ { name: "Noida", hrs: 270, pct: 42.2, color: "#2563eb", clockedIn: 4 }, { name: "Delhi", hrs: 160, pct: 25.0, color: "#10b981", clockedIn: 2 }, { name: "Gurugram", hrs: 110, pct: 17.2, color: "#8b5cf6", clockedIn: 1 }, { name: "Bangalore", hrs: 100, pct: 15.6, color: "#f97316", clockedIn: 1 } ] },
          Microsoft: { totalHours: 960, approvedLogs: 68, pendingLogs: 9, disputedLogs: 1, locations: [ { name: "Noida", hrs: 384, pct: 40.0, color: "#2563eb", clockedIn: 5 }, { name: "Delhi", hrs: 256, pct: 26.7, color: "#10b981", clockedIn: 3 }, { name: "Gurugram", hrs: 128, pct: 13.3, color: "#8b5cf6", clockedIn: 2 }, { name: "Bangalore", hrs: 192, pct: 20.0, color: "#f97316", clockedIn: 2 } ] },
          Google: { totalHours: 1200, approvedLogs: 85, pendingLogs: 12, disputedLogs: 2, locations: [ { name: "Noida", hrs: 560, pct: 46.7, color: "#2563eb", clockedIn: 6 }, { name: "Delhi", hrs: 240, pct: 20.0, color: "#10b981", clockedIn: 2 }, { name: "Gurugram", hrs: 240, pct: 20.0, color: "#8b5cf6", clockedIn: 2 }, { name: "Bangalore", hrs: 160, pct: 13.3, color: "#f97316", clockedIn: 1 } ] },
          Amazon: { totalHours: 1280, approvedLogs: 94, pendingLogs: 11, disputedLogs: 1, locations: [ { name: "Noida", hrs: 568, pct: 44.4, color: "#2563eb", clockedIn: 6 }, { name: "Delhi", hrs: 284, pct: 22.2, color: "#10b981", clockedIn: 3 }, { name: "Gurugram", hrs: 213, pct: 16.7, color: "#8b5cf6", clockedIn: 2 }, { name: "Bangalore", hrs: 215, pct: 16.7, color: "#f97316", clockedIn: 2 } ] },
        };
        const td = tsData[selectedCust] || tsData["All Customers"];
        const filteredLocs = selectedSiteName
          ? td.locations.filter(l => l.name === selectedSiteName)
          : td.locations;
        const names = ["Erin Gilmore","Alex Rivera","Jordan Smith","Taylor Swift","Chris Evans","Morgan Freeman","Jamie Lannister","Sarah Connor","John Doe","Jane Foster","Peter Parker","Bruce Wayne","Clark Kent","Diana Prince","Tony Stark"];
        const pinMap = {
          Noida: "201301", Delhi: "110001", Gurugram: "122001", Bangalore: "560001",
        };
        const rows = [];
        let idx = 0;
        filteredLocs.forEach((loc, li) => {
          const count = loc.clockedIn;
          const hrsPerEmp = Math.round(loc.hrs / Math.max(count, 1));
          const pin = pinMap[loc.name] || "000000";
          for (let i = 0; i < count; i++) {
            rows.push({
              id: `TS-${1000 + idx}`,
              name: names[idx % names.length],
              customer: selectedCust === "All Customers" ? ["Dell","Microsoft","Google","Amazon"][li % 4] : selectedCust,
              site: loc.name,
              pin,
              role: i % 2 === 0 ? "Security Guard" : "Supervisor",
              start: i % 2 === 0 ? "07:00 AM" : "03:00 PM",
              end: i % 2 === 0 ? "03:00 PM" : "11:00 PM",
              hrs: hrsPerEmp,
              status: i % 5 === 4 ? "Pending" : "Approved",
            });
            idx++;
          }
        });
        return (
          <div className="detail-view-card animate-fade-in">
            <div className="detail-view-header">
              <h3 className="detail-view-title">
                Timesheet Details — {selectedCust}{selectedSiteName ? ` / ${selectedSiteName}` : ""}
              </h3>
            </div>
            <div className="detail-table-wrapper">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Employee Name</th>
                    <th>Customer</th>
                    <th>Site / Location</th>
                    <th>PIN Code</th>
                    <th>Role</th>
                    <th>Shift Start</th>
                    <th>Shift End</th>
                    <th>Hours Logged</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="text-secondary font-mono">{r.id}</td>
                      <td className="fw-semibold">{r.name}</td>
                      <td>{r.customer}</td>
                      <td>{r.site}</td>
                      <td className="font-number text-secondary">{r.pin}</td>
                      <td>{r.role}</td>
                      <td className="font-number fw-bold">{r.start}</td>
                      <td className="font-number fw-bold">{r.end}</td>
                      <td className="font-number fw-bold">{r.hrs} hrs</td>
                      <td>
                        <span className={`badge-pill ${r.status === "Approved" ? "bg-success-pill" : "bg-warning-pill"}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}



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
        <div className="incident-dashboard animate-fade-in">
          <div className="incident-kpi-grid">
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("total")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("total")}>
              <div className="incident-kpi-icon incident-icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
              </div>
              <span className="incident-kpi-label">Total Cases</span>
              <strong className="incident-kpi-value">{incidentKpis.total}</strong>
              <span className="incident-kpi-sub">All incidents</span>
              <span className="incident-sparkline incident-sparkline-blue">↗︎</span>
            </div>
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("status", "Open")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("status", "Open")}>
              <div className="incident-kpi-icon incident-icon-purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="9" /></svg>
              </div>
              <span className="incident-kpi-label">Open Cases</span>
              <strong className="incident-kpi-value">{incidentKpis.open}</strong>
              <span className="incident-kpi-sub">Active incidents</span>
              <span className="incident-sparkline incident-sparkline-purple">↗︎</span>
            </div>
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("status", "Resolved")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("status", "Resolved")}>
              <div className="incident-kpi-icon incident-icon-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></svg>
              </div>
              <span className="incident-kpi-label">Resolved Cases</span>
              <strong className="incident-kpi-value">{incidentKpis.resolved}</strong>
              <span className="incident-kpi-sub">Successfully resolved</span>
              <span className="incident-sparkline incident-sparkline-green">↗︎</span>
            </div>
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("status", "Closed")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("status", "Closed")}>
              <div className="incident-kpi-icon incident-icon-slate">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h5M8 16h8" /></svg>
              </div>
              <span className="incident-kpi-label">Closed Cases</span>
              <strong className="incident-kpi-value">{incidentKpis.closed}</strong>
              <span className="incident-kpi-sub">Closed this period</span>
              <span className="incident-sparkline incident-sparkline-blue">↗︎</span>
            </div>
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("highPending")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("highPending")}>
              <div className="incident-kpi-icon incident-icon-red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.4 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
              </div>
              <span className="incident-kpi-label">High Priority Pending</span>
              <strong className="incident-kpi-value">{incidentKpis.highPending}</strong>
              <span className="incident-kpi-sub">Requires attention</span>
              <span className="incident-sparkline incident-sparkline-red">↗︎</span>
            </div>
          </div>

          <div className="incident-chart-grid">
            <section className="incident-chart-card">
              <div className="incident-section-heading">
                <h3>Incidents Trend</h3>
                <span>Last 7 Days</span>
              </div>
              <svg className="incident-trend-chart" viewBox="0 0 620 220" role="img" aria-label="Incidents trend over the last seven days">
                <g className="incident-grid-lines">
                  <line x1="42" y1="25" x2="600" y2="25" /><line x1="42" y1="65" x2="600" y2="65" /><line x1="42" y1="105" x2="600" y2="105" /><line x1="42" y1="145" x2="600" y2="145" /><line x1="42" y1="185" x2="600" y2="185" />
                </g>
                <g className="incident-axis-labels"><text x="12" y="29">20</text><text x="18" y="69">15</text><text x="18" y="109">10</text><text x="22" y="149">5</text><text x="25" y="189">0</text></g>
                <path className="incident-trend-area" d={`${incidentTrendPath} L600 185 L42 185 Z`} />
                <path className="incident-trend-line" d={incidentTrendPath} />
                {incidentTrendPoints.map((point) => <g key={point.label}><circle cx={point.x} cy={point.y} r="4" className="incident-trend-point" /><title>{`${point.label}: ${point.value} incidents (${selectedCust})`}</title></g>)}
                <g className="incident-x-labels">{incidentTrendPoints.map((point) => <text key={point.label} x={point.x - 12} y="210">{point.label}</text>)}</g>
              </svg>
            </section>

            <section className="incident-chart-card incident-status-card">
              <div className="incident-section-heading"><h3>Incidents by Status</h3></div>
              <div className="incident-donut-layout">
                <div className="incident-donut" aria-label={`${incidentKpis.total} incidents`}>
                  <svg viewBox="0 0 128 128" aria-hidden="true">
                    {incidentDonutSegments.map((segment) => <circle key={segment.label} className={`incident-donut-segment ${hoveredIncidentStatus === segment.label ? "active" : ""}`} cx="64" cy="64" r="48" fill="none" stroke={segment.color} strokeWidth="22" strokeDasharray={`${segment.dash} ${segment.circumference - segment.dash}`} strokeDashoffset={segment.offset} transform="rotate(-90 64 64)" onMouseEnter={() => setHoveredIncidentStatus(segment.label)} onMouseLeave={() => setHoveredIncidentStatus("")} onClick={() => openIncidentDetails("status", segment.label)} />)}
                  </svg>
                  <div><strong>{incidentKpis.total}</strong><span>Total</span></div>
                  {hoveredIncidentStatus && <span className="incident-donut-tooltip">{hoveredIncidentStatus}: {incidentStatusData.find((item) => item.label === hoveredIncidentStatus)?.value || 0} cases</span>}
                </div>
                <div className="incident-legend">
                  {incidentStatusData.map((item) => <div className={`incident-legend-clickable ${hoveredIncidentStatus === item.label ? "active" : ""}`} key={item.label} role="button" tabIndex="0" onMouseEnter={() => setHoveredIncidentStatus(item.label)} onMouseLeave={() => setHoveredIncidentStatus("")} onFocus={() => setHoveredIncidentStatus(item.label)} onBlur={() => setHoveredIncidentStatus("")} onClick={() => openIncidentDetails("status", item.label)} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("status", item.label)}><i className="incident-legend-dot" style={{ background: item.color }} /><span>{item.label}</span><strong>{item.value} <small>({incidentKpis.total ? ((item.value / incidentKpis.total) * 100).toFixed(1) : 0}%)</small></strong></div>)}
                </div>
              </div>
            </section>
          </div>

          <section className="incident-chart-card incident-priority-card">
            <div className="incident-section-heading"><h3>Incidents by Priority</h3></div>
            <div className="incident-priority-chart" role="img" aria-label="Incidents by priority">
              <div className="incident-priority-axis"><span>30</span><span>20</span><span>10</span><span>0</span></div>
              {incidentPriorityData.map((item) => (
                <div className={`incident-priority-column incident-priority-clickable ${hoveredIncidentPriority === item.label ? "active" : ""}`} key={item.label} role="button" tabIndex="0" onMouseEnter={() => setHoveredIncidentPriority(item.label)} onMouseLeave={() => setHoveredIncidentPriority("")} onFocus={() => setHoveredIncidentPriority(item.label)} onBlur={() => setHoveredIncidentPriority("")} onClick={() => openIncidentDetails("priority", item.label)} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("priority", item.label)}>
                  <strong>{item.value}</strong><div style={{ height: `${(item.value / Math.max(...incidentPriorityData.map((priority) => priority.value), 1)) * 82}%`, backgroundColor: item.color }} /><span>{item.label}</span>{hoveredIncidentPriority === item.label && <span className="incident-priority-tooltip">{item.label}: {item.value} cases</span>}
                </div>
              ))}
            </div>
          </section>

          <section className="incident-logs-card">
            <div className="incident-logs-header">
              <h3>Incident Logs <span>({selectedCust})</span></h3>
              <div className="incident-log-tools">
                <div className="incident-search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search incident..." aria-label="Search incidents" />
                </div>
                <select value={incidentStatusFilter} onChange={(event) => setIncidentStatusFilter(event.target.value)} aria-label="Filter incidents by status">
                  <option value="All">All statuses</option><option value="Open">Open</option><option value="Investigating">Investigating</option><option value="Resolved">Resolved</option><option value="Closed">Closed</option>
                </select>
                <select value={incidentPriorityFilter} onChange={(event) => setIncidentPriorityFilter(event.target.value)} aria-label="Filter incidents by priority">
                  <option value="All">All priorities</option><option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="incident-table-wrap">
              <table className="incident-log-table">
                <thead><tr><th>Incident ID</th><th>Location</th><th>Incident Type</th><th>Logged By</th><th>Priority</th><th>Status</th><th>Action Taken</th><th>Logged On</th><th aria-label="More actions" /></tr></thead>
                <tbody>
                  {paginatedIncidentLogs.map((incident) => (
                    <tr key={incident.id}>
                      <td className="incident-id">{incident.id}</td><td className="incident-location">{incident.location}</td><td>{incident.type}</td><td>{incident.loggedBy}</td>
                      <td><span className={`incident-badge incident-priority-${incident.priority.toLowerCase()}`}>{incident.priority}</span></td>
                      <td><span className={`incident-badge incident-status-${incident.status.toLowerCase()}`}>{incident.status}</span></td><td>{incident.action}</td><td className="incident-date">{incident.loggedOn}</td><td className="incident-more"><button onClick={() => setIncidentMenuId(incidentMenuId === incident.id ? "" : incident.id)} aria-label={`Actions for ${incident.id}`}>⋮</button>{incidentMenuId === incident.id && <div className="incident-action-menu"><button onClick={() => openIncidentDetails("status", incident.status)}>View {incident.status}</button><button onClick={() => openIncidentDetails("priority", incident.priority)}>View {incident.priority}</button></div>}</td>
                    </tr>
                  ))}
                  {paginatedIncidentLogs.length === 0 && <tr><td colSpan="9" className="incident-empty">No incidents match the selected filters.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="incident-logs-footer">
              <span>Showing <strong>{paginatedIncidentLogs.length}</strong> of <strong>{filteredIncidentLogs.length}</strong> incidents</span>
              <div className="incident-pagination"><button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} aria-label="Previous page">‹</button><span>Page {currentPage} of {Math.max(1, Math.ceil(filteredIncidentLogs.length / incidentPageSize))}</span><button disabled={currentPage >= Math.ceil(filteredIncidentLogs.length / incidentPageSize)} onClick={() => setCurrentPage((page) => page + 1)} aria-label="Next page">›</button></div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "Incidents" && activeView === "incident-detail" && (
        <div className="detail-view-card incident-detail-card animate-fade-in">
          <div className="detail-view-header incident-detail-header">
            <div>
              <h3 className="detail-view-title">{incidentDetailTitle} ({selectedCust})</h3>
              <span className="incident-detail-description">Filtered from the current 60-record incident dataset.</span>
            </div>
          </div>
          <div className="detail-table-wrapper">
            <table className="detail-table incident-detail-table">
              <thead><tr><th>Incident ID</th><th>Customer</th><th>Location</th><th>Incident Type</th><th>Priority</th><th>Status</th><th>Logged On</th><th>Action Taken</th></tr></thead>
              <tbody>{incidentDetailLogs.map((incident) => <tr key={incident.id}><td className="font-mono">{incident.id}</td><td className="fw-semibold">{incident.customer}</td><td>{incident.location}</td><td>{incident.type}</td><td><span className={`incident-badge incident-priority-${incident.priority.toLowerCase()}`}>{incident.priority}</span></td><td><span className={`incident-badge incident-status-${incident.status.toLowerCase()}`}>{incident.status}</span></td><td>{incident.loggedOn}</td><td>{incident.action}</td></tr>)}{incidentDetailLogs.length === 0 && <tr><td colSpan="8" className="incident-empty">No incidents match this view.</td></tr>}</tbody>
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
        <div className="roster-dashboard animate-fade-in">
          <div className="roster-kpi-grid">
             <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("totalShifts")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("totalShifts")}><div className="roster-kpi-icon roster-icon-blue"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></svg></div><span>Total Shifts</span><strong>{rosterKpis.totalShifts}</strong><small>Scheduled shifts</small></div>
             <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("acceptedShifts")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("acceptedShifts")}><div className="roster-kpi-icon roster-icon-green"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></svg></div><span>Accepted Shifts</span><strong>{rosterKpis.acceptedShifts}</strong><small>Accepted across employees</small></div>
             <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("declinedShifts")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("declinedShifts")}><div className="roster-kpi-icon roster-icon-red"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" /></svg></div><span>Declined Shifts</span><strong>{rosterKpis.declinedShifts}</strong><small>Declined across employees</small></div>
             <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("openShifts")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("openShifts")}><div className="roster-kpi-icon roster-icon-orange"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="9" /></svg></div><span>Open / Unassigned</span><strong>{rosterKpis.openShifts}</strong><small>Needs assignment</small></div>
             <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("scheduledHours")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("scheduledHours")}><div className="roster-kpi-icon roster-icon-purple"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></div><span>Total Scheduled Hours</span><strong>{rosterKpis.scheduledHours}</strong><small>Weekly hours across employees</small></div>
           </div>

          <div className="roster-chart-grid">
            <section className="roster-chart-card">
              <div className="roster-chart-heading"><div><h3>Weekly Hours Overview</h3><span>Maximum 38h per employee</span></div><span className="roster-limit-badge">Max 38h</span></div>
              <div className="roster-scroll-area">
                <div className="roster-week-chart">
                  <div className="roster-chart-axis"><span>45h</span><span>38h</span><span>30h</span><span>15h</span><span>0h</span></div>
                  {rosterEmployees.map((employee) => {
                    const barKey = `weekly-${employee.name}`;
                    const exceeded = Math.max(employee.weekly - 38, 0);
                    return <div className={`roster-employee-bar roster-bar-clickable ${hoveredRosterBar === barKey ? "roster-bar-highlight" : ""}`} key={employee.name} role="button" tabIndex="0" aria-label={`View weekly hours for ${employee.name}`} onMouseEnter={() => setHoveredRosterBar(barKey)} onMouseLeave={() => setHoveredRosterBar("")} onFocus={() => setHoveredRosterBar(barKey)} onBlur={() => setHoveredRosterBar("")} onClick={() => openRosterEmployeeDetails(employee)} onKeyDown={(event) => event.key === "Enter" && openRosterEmployeeDetails(employee)}><strong className={exceeded > 0 ? "roster-exceeded" : ""}>{exceeded > 0 ? `+${exceeded}h` : `${employee.weekly}h`}</strong><div className="roster-bar-track"><div className={`roster-bar-fill ${exceeded > 0 ? "roster-bar-danger" : ""}`} style={{ height: `${Math.min((employee.weekly / 45) * 100, 100)}%` }} /></div><span>{employee.name.split(" ")[0]}</span>{hoveredRosterBar === barKey && <div className="roster-bar-tooltip"><strong>{employee.name}</strong><span>Actual: {employee.weekly}h</span><span>Limit: 38h</span><span>{exceeded > 0 ? `Exceeded: ${exceeded}h` : "Within limit"}</span></div>}</div>;
                  })}
                </div>
              </div>
              <div className="roster-chart-note"><span className="roster-chart-dot" />Weekly limit: 38 hours <b>Scroll horizontally to view more employees</b></div>
            </section>

            <section className="roster-chart-card">
              <div className="roster-chart-heading"><div><h3>Daily Hours Monitoring</h3><span>Maximum 8h per employee</span></div><span className="roster-limit-badge">Max 8h</span></div>
              <div className="roster-scroll-area">
                <div className="roster-week-chart roster-daily-chart">
                  <div className="roster-chart-axis"><span>12h</span><span>8h</span><span>6h</span><span>3h</span><span>0h</span></div>
                  {rosterEmployees.map((employee) => {
                    const barKey = `daily-${employee.name}`;
                    const exceeded = Math.max(employee.daily - 8, 0);
                    return <div className={`roster-employee-bar roster-bar-clickable ${hoveredRosterBar === barKey ? "roster-bar-highlight" : ""}`} key={employee.name} role="button" tabIndex="0" aria-label={`View daily hours for ${employee.name}`} onMouseEnter={() => setHoveredRosterBar(barKey)} onMouseLeave={() => setHoveredRosterBar("")} onFocus={() => setHoveredRosterBar(barKey)} onBlur={() => setHoveredRosterBar("")} onClick={() => openRosterEmployeeDetails(employee)} onKeyDown={(event) => event.key === "Enter" && openRosterEmployeeDetails(employee)}><strong className={exceeded > 0 ? "roster-exceeded" : ""}>{exceeded > 0 ? `+${exceeded}h` : `${employee.daily}h`}</strong><div className="roster-bar-track"><div className={`roster-bar-fill roster-bar-daily ${exceeded > 0 ? "roster-bar-danger" : ""}`} style={{ height: `${Math.min((employee.daily / 12) * 100, 100)}%` }} /></div><span>{employee.name.split(" ")[0]}</span>{hoveredRosterBar === barKey && <div className="roster-bar-tooltip"><strong>{employee.name}</strong><span>Actual: {employee.daily}h</span><span>Limit: 8h</span><span>{exceeded > 0 ? `Exceeded: ${exceeded}h` : "Within limit"}</span></div>}</div>;
                  })}
                </div>
              </div>
              <div className="roster-chart-note"><span className="roster-chart-dot roster-dot-daily" />Daily limit: 8 hours <b>Red values show the exact exceeded amount</b></div>
            </section>
          </div>

          <section className="roster-chart-card roster-status-card">
            <div className="roster-chart-heading"><div><h3>Shift Status Overview</h3><span>Current roster distribution</span></div></div>
            <div className="roster-status-content"><div className="roster-status-bar"><span style={{ width: `${(rosterKpis.acceptedShifts / rosterStatusTotal) * 100}%`, background: "#48b982" }} /><span style={{ width: `${(rosterKpis.declinedShifts / rosterStatusTotal) * 100}%`, background: "#f97316" }} /><span style={{ width: `${(rosterKpis.openShifts / rosterStatusTotal) * 100}%`, background: "#94a3b8" }} /></div><div className="roster-status-legend"><span><i className="roster-legend-green" />Accepted <b>{rosterKpis.acceptedShifts}</b></span><span><i className="roster-legend-orange" />Declined <b>{rosterKpis.declinedShifts}</b></span><span><i className="roster-legend-slate" />Open / Pending <b>{rosterKpis.openShifts}</b></span></div></div>
          </section>

          <section className="roster-table-card">
            <div className="roster-table-header"><div><h3>Employee Roster</h3><span>{selectedCust} · hours and shift allocation</span></div><div className="roster-table-tools"><div className="roster-table-search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search employee..." aria-label="Search employees" /></div><select value={rosterStatusFilter} onChange={(event) => setRosterStatusFilter(event.target.value)} aria-label="Filter roster employees"><option value="All">All statuses</option><option value="On track">On track</option><option value="Alerts">Hours alerts</option><option value="Pending review">Pending review</option></select></div></div>
            <div className="roster-table-wrap"><table className="roster-table"><thead><tr><th>Employee</th><th>Location</th><th>Shifts</th><th>Accepted / Declined / Pending</th><th>Daily Hours</th><th>Weekly Hours</th><th>Remaining Hours</th><th>Status / Alert</th></tr></thead><tbody>{paginatedRosterEmployees.map((employee) => <tr key={employee.name} className="roster-row-clickable" role="button" tabIndex="0" onClick={() => openRosterEmployeeDetails(employee)} onKeyDown={(event) => event.key === "Enter" && openRosterEmployeeDetails(employee)}><td className="roster-employee-name">{employee.name}</td><td>{employee.location}</td><td className="roster-number">{employee.shifts}</td><td><span className="roster-count-green">{employee.accepted}</span><span className="roster-count-divider"> / </span><span className="roster-count-red">{employee.declined}</span><span className="roster-count-divider"> / </span><span className="roster-count-muted">{employee.pending}</span></td><td className={employee.daily > 8 ? "roster-hours-danger" : "roster-number"}>{employee.daily > 8 ? `${employee.daily}h (+${employee.daily - 8}h)` : `${employee.daily}h / 8h`}</td><td className={employee.weekly > 38 ? "roster-hours-danger" : "roster-number"}>{employee.weekly > 38 ? `${employee.weekly}h (+${employee.weekly - 38}h)` : `${employee.weekly}h / 38h`}</td><td className={employee.weekly > 38 ? "roster-hours-danger" : "roster-number"}>{38 - employee.weekly}h</td><td><span className={`roster-status-badge ${employee.status === "On track" ? "roster-status-ok" : employee.status === "Pending review" ? "roster-status-pending" : "roster-status-alert"}`}>{employee.status}</span></td></tr>)}{paginatedRosterEmployees.length === 0 && <tr><td colSpan="8" className="roster-empty">No employees match the selected filters.</td></tr>}</tbody></table></div>
            <div className="roster-table-footer"><span>Showing <b>{paginatedRosterEmployees.length}</b> of <b>{filteredRosterEmployees.length}</b> employees</span><div className="roster-pagination"><button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} aria-label="Previous page">‹</button><span>Page {currentPage} of {Math.max(1, Math.ceil(filteredRosterEmployees.length / rosterPageSize))}</span><button disabled={currentPage >= Math.ceil(filteredRosterEmployees.length / rosterPageSize)} onClick={() => setCurrentPage((page) => page + 1)} aria-label="Next page">›</button></div></div>
          </section>
        </div>
      )}

      {/* ROSTER KPI DETAIL VIEW */}
      {activeTab === "Roster" && activeView === "roster-detail" && activeRosterDetail && (
        <div className="detail-view-card roster-detail-card animate-fade-in">
            <div className="detail-view-header roster-detail-header">
            <div>
              <h3 className="detail-view-title">{activeRosterDetail.title} ({selectedCust})</h3>
              <span className="roster-detail-description">{activeRosterDetail.description} from the current dummy roster.</span>
            </div>
          </div>
          <div className="detail-table-wrapper">
            <table className="detail-table roster-detail-table">
              <thead><tr><th>Employee</th><th>Location</th><th>{activeRosterDetail.title}</th><th>Daily Hours</th><th>Weekly Hours</th><th>Accepted</th><th>Declined</th><th>Pending</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {rosterDetailEmployees.map((employee) => (
                  <tr key={employee.name}>
                    <td className="fw-semibold">{employee.name}</td>
                    <td>{employee.location}</td>
                    <td className="font-number">{activeRosterDetail.value(employee)}{rosterDetailType === "scheduledHours" ? "h" : ""}</td>
                    <td className={employee.daily > 8 ? "roster-hours-danger" : "font-number"}>{employee.daily}h / 8h</td>
                    <td className={employee.weekly > 38 ? "roster-hours-danger" : "font-number"}>{employee.weekly}h / 38h</td>
                    <td className="roster-count-green">{employee.accepted}</td>
                    <td className="roster-count-red">{employee.declined}</td>
                    <td className="roster-count-muted">{employee.pending}</td>
                    <td><span className={`roster-status-badge ${employee.status === "On track" ? "roster-status-ok" : employee.status === "Pending review" ? "roster-status-pending" : "roster-status-alert"}`}>{employee.status}</span></td>
                    <td><button className="roster-link-button" onClick={() => openRosterEmployeeDetails(employee)}>View employee</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROSTER EMPLOYEE DETAIL VIEW */}
      {activeTab === "Roster" && activeView === "roster-employee-detail" && selectedRosterEmployee && (
        <div className="detail-view-card roster-detail-card animate-fade-in">
            <div className="detail-view-header roster-detail-header">
            <div>
              <h3 className="detail-view-title">Employee Roster Details ({selectedCust})</h3>
              <span className="roster-detail-description">Dummy roster record for {selectedRosterEmployee.name}</span>
            </div>
          </div>
          <div className="roster-employee-detail-grid">
            <div><span>Employee</span><strong>{selectedRosterEmployee.name}</strong></div>
            <div><span>Location</span><strong>{selectedRosterEmployee.location}</strong></div>
            <div><span>Shifts</span><strong>{selectedRosterEmployee.shifts}</strong></div>
            <div><span>Accepted</span><strong className="roster-detail-value-green">{selectedRosterEmployee.accepted}</strong></div>
            <div><span>Declined</span><strong className="roster-detail-value-red">{selectedRosterEmployee.declined}</strong></div>
            <div><span>Pending</span><strong>{selectedRosterEmployee.pending}</strong></div>
            <div><span>Daily Hours</span><strong className={selectedRosterEmployee.daily > 8 ? "roster-detail-value-red" : ""}>{selectedRosterEmployee.daily}h / 8h</strong></div>
            <div><span>Weekly Hours</span><strong className={selectedRosterEmployee.weekly > 38 ? "roster-detail-value-red" : ""}>{selectedRosterEmployee.weekly}h / 38h</strong></div>
            <div><span>Remaining Hours</span><strong className={selectedRosterEmployee.weekly > 38 ? "roster-detail-value-red" : ""}>{38 - selectedRosterEmployee.weekly}h</strong></div>
            <div><span>Status</span><strong><span className={`roster-status-badge ${selectedRosterEmployee.status === "On track" ? "roster-status-ok" : selectedRosterEmployee.status === "Pending review" ? "roster-status-pending" : "roster-status-alert"}`}>{selectedRosterEmployee.status}</span></strong></div>
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
                {expandSites(currentCustData).map((site, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{site.siteName}</td>
                    {selectedCust === "All Customers" && <td>{site.customer}</td>}
                    <td className="text-secondary">{site.address || "Sector 62, Noida"}</td>
                    <td className="font-number">{site.count}</td>
                    <td className="font-number">{site.totalEmployees}</td>
                    <td>
                      <span className={`badge-pill ${site.active ? "bg-success-pill" : "bg-warning-pill"}`}>
                        {site.active ? "Active" : "Inactive"}
                      </span>
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
                {expandSites(currentCustData)
                  .filter(site => site.clockedIn > 0)
                  .slice(0, activeSites)
                  .map((site, index) => (
                    <tr key={index}>
                      <td className="fw-semibold">{site.siteName}</td>
                      {selectedCust === "All Customers" && <td>{site.customer || "All Customers"}</td>}
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

      {/* SITE SCHEDULE DETAILS VIEW */}
      {activeView === "site-schedule" && (
        <div className="detail-view-card">
          <div className="detail-view-header">
            <h3 className="detail-view-title">
              Site Schedule Details for {selectedSiteName} ({selectedCust === "All Customers" ? "All Customers" : selectedCust})
            </h3>
          </div>
          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Customer</th>
                  <th>Site Name</th>
                  <th>Site Address & PIN Code</th>
                  <th>Assigned Role</th>
                  <th>Scheduled Start Time</th>
                  <th>Scheduled End Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {siteEmployees.map((emp, index) => (
                  <tr key={index}>
                    <td className="text-secondary font-mono">{emp.id}</td>
                    <td className="fw-semibold">{emp.name}</td>
                    <td>{emp.customer}</td>
                    <td>{emp.siteName}</td>
                    <td className="text-secondary">{emp.address}</td>
                    <td>{emp.role}</td>
                    <td className="fw-bold font-number">{emp.startTime}</td>
                    <td className="fw-bold font-number">{emp.endTime}</td>
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
    </div>
  );
}

export default MainDashboard;
