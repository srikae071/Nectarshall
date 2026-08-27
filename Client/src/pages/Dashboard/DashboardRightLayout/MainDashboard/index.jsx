

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

const exportCsv = (filename, rows, columns) => {
  const escapeCsvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    columns.map((column) => escapeCsvValue(column.label)).join(","),
    ...rows.map((row, rowIndex) => columns.map((column) => escapeCsvValue(column.value(row, rowIndex))).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const employeeCsvColumns = [
  { label: "Employee ID", value: (employee) => employee.id },
  { label: "Name", value: (employee) => employee.name },
  { label: "Customer", value: (employee) => employee.customer },
  { label: "Site", value: (employee) => employee.siteName || employee.site },
  { label: "Role", value: (employee) => employee.role },
  { label: "Shift", value: (employee) => employee.shiftTime || `${employee.start || ""} - ${employee.end || ""}` },
  { label: "Status", value: (employee) => employee.clockedIn === undefined ? employee.status : employee.clockedIn ? "Clocked In" : "Offline" },
];

const incidentCsvColumns = [
  { label: "Incident ID", value: (incident) => incident.id }, { label: "Customer", value: (incident) => incident.customer },
  { label: "Location", value: (incident) => incident.location }, { label: "Incident Type", value: (incident) => incident.type },
  { label: "Logged By", value: (incident) => incident.loggedBy }, { label: "Priority", value: (incident) => incident.priority },
  { label: "Status", value: (incident) => incident.status }, { label: "Action Taken", value: (incident) => incident.action },
  { label: "Logged On", value: (incident) => incident.loggedOn },
];

const candidateCsvColumns = [
  { label: "Candidate ID", value: (candidate) => candidate.id }, { label: "Candidate", value: (candidate) => candidate.name },
  { label: "Customer", value: (candidate) => candidate.customer }, { label: "Site", value: (candidate) => candidate.site },
  { label: "Compliance", value: (candidate) => `${candidate.compliance}%` }, { label: "Documents", value: (candidate) => candidate.documents },
  { label: "Background", value: (candidate) => candidate.background }, { label: "Pipeline Stage", value: (candidate) => candidate.status },
  { label: "Age", value: (candidate) => `${candidate.days} days` },
];

const rosterCsvColumns = [
  { label: "Employee", value: (employee) => employee.name }, { label: "Customer", value: (employee) => employee.customer },
  { label: "Location", value: (employee) => employee.location }, { label: "Shifts", value: (employee) => employee.shifts },
  { label: "Accepted", value: (employee) => employee.accepted }, { label: "Declined", value: (employee) => employee.declined },
  { label: "Pending", value: (employee) => employee.pending }, { label: "Daily Hours", value: (employee) => employee.daily },
  { label: "Weekly Hours", value: (employee) => employee.weekly }, { label: "Remaining Hours", value: (employee) => 38 - employee.weekly },
  { label: "Status", value: (employee) => employee.status },
];

const ExportCsvButton = ({ filename, rows, columns = employeeCsvColumns }) => (
  <button className="export-csv-btn" type="button" disabled={rows.length === 0} onClick={(event) => { event.stopPropagation(); exportCsv(filename, rows, columns); }}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
    Export CSV
  </button>
);

const onboardingCandidates = [
  { id: "CND-8902", name: "Rahul Sharma", customer: "Dell", site: "Noida Sector 62", status: "Offer Sent", compliance: 98, background: "Pass", documents: "Complete", date: "24 Aug 2026", days: 2 },
  { id: "CND-8905", name: "Arjun Singh", customer: "Microsoft", site: "Delhi Okhla Phase 3", status: "Form Submitted", compliance: 95, background: "Pass", documents: "Complete", date: "23 Aug 2026", days: 3 },
  { id: "CND-8912", name: "Priya Nair", customer: "Google", site: "Gurugram Sector 48", status: "Interview", compliance: 72, background: "Pending", documents: "Missing 2", date: "22 Aug 2026", days: 4 },
  { id: "CND-8916", name: "Vikram Mehta", customer: "Amazon", site: "Mumbai Office", status: "Compliance Review", compliance: 64, background: "Pending", documents: "Missing 1", date: "21 Aug 2026", days: 5 },
  { id: "CND-8921", name: "Neha Kapoor", customer: "Dell", site: "Noida Site B", status: "Operations Review", compliance: 100, background: "Pass", documents: "Complete", date: "20 Aug 2026", days: 6 },
  { id: "CND-8925", name: "Aman Verma", customer: "Microsoft", site: "Bangalore ORR", status: "Ready for Roster", compliance: 100, background: "Pass", documents: "Complete", date: "19 Aug 2026", days: 7 },
  { id: "CND-8930", name: "Isha Roy", customer: "Google", site: "Delhi Dwarka", status: "Applied", compliance: 38, background: "Not Started", documents: "Missing 4", date: "18 Aug 2026", days: 8 },
  { id: "CND-8934", name: "Karan Joshi", customer: "Amazon", site: "Noida Site A", status: "Rejected", compliance: 46, background: "Fail", documents: "Incomplete", date: "17 Aug 2026", days: 9 },
  { id: "CND-8939", name: "Maya Thomas", customer: "Dell", site: "Gurugram Cybercity", status: "Offer Sent", compliance: 92, background: "Pass", documents: "Complete", date: "16 Aug 2026", days: 10 },
  { id: "CND-8943", name: "Rohan Das", customer: "Microsoft", site: "Delhi Connaught Place", status: "Form Submitted", compliance: 89, background: "Pass", documents: "Complete", date: "15 Aug 2026", days: 11 },
  { id: "CND-8948", name: "Sara Khan", customer: "Google", site: "Noida Sector 135", status: "Interview", compliance: 81, background: "Pending", documents: "Missing 1", date: "14 Aug 2026", days: 12 },
  { id: "CND-8952", name: "Dev Patel", customer: "Amazon", site: "Bangalore Whitefield", status: "Operations Review", compliance: 96, background: "Pass", documents: "Complete", date: "13 Aug 2026", days: 13 },
  { id: "CND-8957", name: "Anika Bose", customer: "Dell", site: "Delhi Okhla", status: "Ready for Roster", compliance: 100, background: "Pass", documents: "Complete", date: "12 Aug 2026", days: 14 },
  { id: "CND-8961", name: "Manish Rao", customer: "Microsoft", site: "Noida Sector 144", status: "Compliance Review", compliance: 58, background: "Pending", documents: "Missing 3", date: "11 Aug 2026", days: 15 },
  { id: "CND-8966", name: "Tara Iyer", customer: "Google", site: "Gurugram Site C", status: "Applied", compliance: 42, background: "Not Started", documents: "Missing 2", date: "10 Aug 2026", days: 16 },
  { id: "CND-8970", name: "Yash Gupta", customer: "Amazon", site: "Mumbai Office", status: "Offer Sent", compliance: 94, background: "Pass", documents: "Complete", date: "09 Aug 2026", days: 17 },
];

function MainDashboard() {
  const context = useContext(EmployeeContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [apiCustomers, setApiCustomers] = useState([]);
  const [selectedCust, setSelectedCust] = useState("All Customers");
  const [dateRange, setDateRange] = useState("last-7-days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedSiteName, setSelectedSiteName] = useState("");
  const [selectedPinCode, setSelectedPinCode] = useState("");
  const [hoveredSiteOverview, setHoveredSiteOverview] = useState("");
  const [hoveredHoursLocation, setHoveredHoursLocation] = useState("");
  const [isCustDropdownOpen, setIsCustDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard", "total-sites", "active-sites", "total-employees", "clocked-in", "site-schedule"
  const [incidentStatusFilter, setIncidentStatusFilter] = useState("All");
  const [incidentPriorityFilter, setIncidentPriorityFilter] = useState("All");
  const [rosterStatusFilter, setRosterStatusFilter] = useState("All");
  const [rosterDetailType, setRosterDetailType] = useState("");
  const [selectedRosterEmployee, setSelectedRosterEmployee] = useState(null);
  const [hoveredRosterBar, setHoveredRosterBar] = useState("");
  const [hoveredRosterDonut, setHoveredRosterDonut] = useState("");
  const [rosterHoursFilter, setRosterHoursFilter] = useState("");
  const [incidentDetailType, setIncidentDetailType] = useState("");
  const [hoveredIncidentStatus, setHoveredIncidentStatus] = useState("");
  const [hoveredIncidentPriority, setHoveredIncidentPriority] = useState("");
  const [incidentMenuId, setIncidentMenuId] = useState("");
  const [onboardingStatusFilter, setOnboardingStatusFilter] = useState("All");
  const [hoveredOnboardingStatus, setHoveredOnboardingStatus] = useState("");
  const [onboardingDetailType, setOnboardingDetailType] = useState("");
  
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

  const selectedDateBounds = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (dateRange === "custom") {
      return {
        start: customStart ? new Date(`${customStart}T00:00:00`) : null,
        end: customEnd ? new Date(`${customEnd}T23:59:59`) : null,
      };
    }

    const start = new Date(today);
    start.setDate(today.getDate() - (dateRange === "last-month" ? 29 : 6));
    start.setHours(0, 0, 0, 0);
    return { start, end: today };
  }, [dateRange, customStart, customEnd]);

  const selectedDateLabel = useMemo(() => {
    if (dateRange === "last-7-days") return "Last 7 Days";
    if (dateRange === "last-month") return "Last 30 Days";
    if (customStart && customEnd) return `${customStart} - ${customEnd}`;
    return "Choose dates";
  }, [dateRange, customStart, customEnd]);

  const isDateInSelectedRange = (value) => {
    const { start, end } = selectedDateBounds;
    if (!start || !end || start > end) return false;
    const date = value instanceof Date ? value : new Date(value);
    return !Number.isNaN(date.getTime()) && date >= start && date <= end;
  };

  const selectedDateDays = useMemo(() => {
    const { start, end } = selectedDateBounds;
    if (!start || !end || start > end) return 0;
    return Math.max(1, Math.floor((end - start) / 86400000) + 1);
  }, [selectedDateBounds]);

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
      const segmentLength = (site.percentage / 100) * size;
      const strokeDasharray = `${segmentLength} ${size - segmentLength}`;
      const strokeDashoffset = "0";
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
        const recordDate = new Date();
        recordDate.setDate(recordDate.getDate() - (nameIdx % 45));
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
          recordDate: `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, "0")}-${String(recordDate.getDate()).padStart(2, "0")}`,
          actualClockIn: isClockedIn ? "07:02" : "-",
          actualClockOut: "-",
          coordinatorVerify: isClockedIn ? "✓ Verified" : "⚠️ Warning"
        });
        nameIdx++;
      }
    });
    return list;
  }, [currentCustData, selectedCust, fallbackData]);

  const dateFilteredEmployees = useMemo(
    () => employeesList.filter((employee) => isDateInSelectedRange(`${employee.recordDate}T12:00:00`)),
    [employeesList, selectedDateBounds],
  );

  const totalEmployees = dateFilteredEmployees.length;
  const clockedIn = dateFilteredEmployees.filter((employee) => employee.clockedIn).length;

  const pinCodeWorkforce = useMemo(() => {
    const groups = new Map();
    dateFilteredEmployees.forEach((employee) => {
      const pinCode = employee.address?.match(/\b\d{6}\b/)?.[0] || "000000";
      const area = employee.address?.split("-")[0]?.trim() || employee.siteName;
      const group = groups.get(pinCode) || {
        pinCode,
        area,
        employees: 0,
        clockedIn: 0,
        sites: new Set(),
        customers: new Set(),
      };
      group.employees += 1;
      group.clockedIn += employee.clockedIn ? 1 : 0;
      group.sites.add(employee.siteName);
      group.customers.add(employee.customer);
      groups.set(pinCode, group);
    });

    return [...groups.values()]
      .map((group) => ({
        ...group,
        scheduled: group.employees - group.clockedIn,
        siteCount: group.sites.size,
        customerCount: group.customers.size,
        coverage: group.employees ? Math.round((group.clockedIn / group.employees) * 100) : 0,
      }))
      .sort((a, b) => b.employees - a.employees);
  }, [dateFilteredEmployees]);

  const selectedPinEmployees = useMemo(() => dateFilteredEmployees.filter(
    (employee) => (employee.address?.match(/\b\d{6}\b/)?.[0] || "000000") === selectedPinCode,
  ), [dateFilteredEmployees, selectedPinCode]);

  const openPinCodeDetails = (pinCode) => {
    setSelectedPinCode(pinCode);
    setActiveView("pin-code-employees");
  };

  const siteEmployees = useMemo(() => {
    return dateFilteredEmployees.filter(emp => {
      const matchSite = emp.siteName === selectedSiteName;
      const matchCust = selectedCust === "All Customers" ? true : emp.customer === selectedCust;
      return matchSite && matchCust;
    });
  }, [dateFilteredEmployees, selectedSiteName, selectedCust]);

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
    return dateFilteredEmployees.filter(emp =>
      emp.name.toLowerCase().includes(query) || 
      emp.siteName.toLowerCase().includes(query) || 
      emp.customer.toLowerCase().includes(query) || 
      emp.role.toLowerCase().includes(query)
    );
  }, [dateFilteredEmployees, searchQuery]);

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
    }).filter((incident) =>
      (selectedCust === "All Customers" || incident.customer === selectedCust)
      && isDateInSelectedRange(new Date(2026, 7, 24 - incident.trendDay)),
    );
  }, [selectedCust, selectedDateBounds]);

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

  const filteredOnboardingCandidates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return onboardingCandidates.filter((candidate) => {
      const matchesDate = isDateInSelectedRange(new Date(candidate.date));
      const matchesCustomer = selectedCust === "All Customers" || candidate.customer === selectedCust;
      const matchesStatus = onboardingStatusFilter === "All" || candidate.status === onboardingStatusFilter;
      const matchesQuery = !query || Object.values(candidate).some((value) => String(value).toLowerCase().includes(query));
      return matchesDate && matchesCustomer && matchesStatus && matchesQuery;
    });
  }, [searchQuery, selectedCust, selectedDateBounds, onboardingStatusFilter]);

  const onboardingCustomerCandidates = useMemo(
    () => onboardingCandidates.filter((candidate) =>
      (selectedCust === "All Customers" || candidate.customer === selectedCust)
      && isDateInSelectedRange(new Date(candidate.date)),
    ),
    [selectedCust, selectedDateBounds],
  );

  const onboardingKpis = useMemo(() => ({
    total: onboardingCustomerCandidates.length,
    active: onboardingCustomerCandidates.filter((candidate) => candidate.status !== "Rejected" && candidate.status !== "Ready for Roster").length,
    ready: onboardingCustomerCandidates.filter((candidate) => candidate.status === "Ready for Roster").length,
    missing: onboardingCustomerCandidates.filter((candidate) => candidate.documents !== "Complete").length,
    ageing: onboardingCustomerCandidates.filter((candidate) => candidate.days > 7 && candidate.status !== "Ready for Roster").length,
  }), [onboardingCustomerCandidates]);

  const onboardingStatusData = useMemo(() => {
    const statuses = [
      { label: "Applied", color: "#64748b" }, { label: "Compliance Review", color: "#f97316" },
      { label: "Interview", color: "#8b5cf6" }, { label: "Offer Sent", color: "#2563eb" },
      { label: "Form Submitted", color: "#0ea5e9" }, { label: "Operations Review", color: "#f59e0b" },
      { label: "Ready for Roster", color: "#10b981" }, { label: "Rejected", color: "#f43f5e" },
    ];
    return statuses.map((status) => ({
      ...status,
      value: onboardingCustomerCandidates.filter((candidate) => candidate.status === status.label).length,
    })).filter((status) => status.value > 0);
  }, [onboardingCustomerCandidates]);

  const onboardingDonutSegments = useMemo(() => {
    const circumference = 2 * Math.PI * 48;
    let offset = 0;
    return onboardingStatusData.map((item) => {
      const dash = onboardingKpis.total ? (item.value / onboardingKpis.total) * circumference : 0;
      const segment = { ...item, circumference, dash, offset: -offset };
      offset += dash;
      return segment;
    });
  }, [onboardingStatusData, onboardingKpis.total]);

  const onboardingComplianceData = useMemo(() => [
    { label: "Identity", value: Math.round(onboardingCustomerCandidates.reduce((sum, candidate) => sum + Math.min(candidate.compliance + 2, 100), 0) / Math.max(onboardingKpis.total, 1)), color: "#2563eb" },
    { label: "Work Rights", value: Math.round(onboardingCustomerCandidates.reduce((sum, candidate) => sum + Math.min(candidate.compliance + 1, 100), 0) / Math.max(onboardingKpis.total, 1)), color: "#10b981" },
    { label: "Licences", value: Math.round(onboardingCustomerCandidates.reduce((sum, candidate) => sum + candidate.compliance, 0) / Math.max(onboardingKpis.total, 1)), color: "#8b5cf6" },
    { label: "Documents", value: Math.round(onboardingCustomerCandidates.reduce((sum, candidate) => sum + (candidate.documents === "Complete" ? 100 : candidate.compliance - 8), 0) / Math.max(onboardingKpis.total, 1)), color: "#f97316" },
  ], [onboardingCustomerCandidates, onboardingKpis.total]);

  const onboardingTrendData = useMemo(() => Array.from({ length: 7 }, (_, index) => ({
    label: `${18 + index} Aug`,
    value: onboardingCustomerCandidates.filter((candidate) => candidate.days >= 7 - index && candidate.days < 10 - index).length,
  })), [onboardingCustomerCandidates]);

  const onboardingTrendPoints = useMemo(() => {
    const maxValue = Math.max(...onboardingTrendData.map((item) => item.value), 1);
    return onboardingTrendData.map((item, index) => ({ ...item, x: 42 + index * 93, y: 185 - (item.value / maxValue) * 145 }));
  }, [onboardingTrendData]);
  const onboardingTrendPath = onboardingTrendPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");

  const openOnboardingDetails = (type) => {
    setOnboardingDetailType(type);
    setOnboardingStatusFilter(["total", "missing", "ageing"].includes(type) ? "All" : type);
    setSearchQuery("");
    setActiveView("onboarding-detail");
  };

  const onboardingDetailCandidates = useMemo(() => {
    if (onboardingDetailType === "total") return onboardingCustomerCandidates;
    if (onboardingDetailType === "missing") return onboardingCustomerCandidates.filter((candidate) => candidate.documents !== "Complete");
    if (onboardingDetailType === "ageing") return onboardingCustomerCandidates.filter((candidate) => candidate.days > 7 && candidate.status !== "Ready for Roster");
    return onboardingCustomerCandidates.filter((candidate) => candidate.status === onboardingDetailType);
  }, [onboardingCustomerCandidates, onboardingDetailType]);

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
      const rosterDate = new Date();
      rosterDate.setDate(rosterDate.getDate() - (index % 45));
      const rosterDateValue = [
        rosterDate.getFullYear(),
        String(rosterDate.getMonth() + 1).padStart(2, "0"),
        String(rosterDate.getDate()).padStart(2, "0"),
      ].join("-");

      return {
        ...employee,
        location: employee.siteName,
        shifts,
        accepted,
        declined,
        pending,
        daily,
        weekly,
        rosterDate: rosterDateValue,
        status: overDaily || overWeekly ? "Hours exceeded" : pending > 0 ? "Pending review" : "On track",
      };
    });
  }, [fallbackData, selectedCust]);

  const dateFilteredRosterEmployees = useMemo(() => {
    const { start, end } = selectedDateBounds;
    if (!start || !end || start > end) return [];
    return rosterEmployees.filter((employee) => {
      const rosterDate = new Date(`${employee.rosterDate}T12:00:00`);
      return rosterDate >= start && rosterDate <= end;
    });
  }, [rosterEmployees, selectedDateBounds]);

  const filteredRosterEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return dateFilteredRosterEmployees.filter((employee) => {
      const matchesQuery = !query || Object.values(employee).some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = rosterStatusFilter === "All"
        || (rosterStatusFilter === "Alerts" ? employee.daily > 8 || employee.weekly > 38 : employee.status === rosterStatusFilter);
      const matchesHours = !rosterHoursFilter
        || (rosterHoursFilter === "weekly-under" && employee.weekly > 0 && employee.weekly < 36)
        || (rosterHoursFilter === "weekly-near" && employee.weekly >= 36 && employee.weekly < 38)
        || (rosterHoursFilter === "weekly-over" && employee.weekly >= 38)
        || (rosterHoursFilter === "weekly-none" && employee.weekly === 0)
        || (rosterHoursFilter === "daily-under" && employee.daily > 0 && employee.daily < 8)
        || (rosterHoursFilter === "daily-near" && employee.daily === 8)
        || (rosterHoursFilter === "daily-over" && employee.daily > 8)
        || (rosterHoursFilter === "daily-none" && employee.daily === 0);
      return matchesQuery && matchesStatus && matchesHours;
    });
  }, [dateFilteredRosterEmployees, searchQuery, rosterStatusFilter, rosterHoursFilter]);

  const rosterDonutData = useMemo(() => {
    const buildSegments = (type) => {
      const ranges = type === "weekly"
        ? [
            { key: "weekly-under", label: "Under 36h", color: "#48b982", matches: (employee) => employee.weekly > 0 && employee.weekly < 36 },
            { key: "weekly-near", label: "36-37h", color: "#f5b82e", matches: (employee) => employee.weekly >= 36 && employee.weekly < 38 },
            { key: "weekly-over", label: "38h and over", color: "#ef4444", matches: (employee) => employee.weekly >= 38 },
            { key: "weekly-none", label: "No scheduled hours", color: "#cbd5e1", matches: (employee) => employee.weekly === 0 },
          ]
        : [
            { key: "daily-under", label: "Under 8h", color: "#48b982", matches: (employee) => employee.daily > 0 && employee.daily < 8 },
            { key: "daily-near", label: "At 8h", color: "#f5b82e", matches: (employee) => employee.daily === 8 },
            { key: "daily-over", label: "Over 8h", color: "#ef4444", matches: (employee) => employee.daily > 8 },
            { key: "daily-none", label: "No scheduled hours", color: "#cbd5e1", matches: (employee) => employee.daily === 0 },
          ];
      const total = dateFilteredRosterEmployees.length;
      let offset = 0;
      const circumference = 2 * Math.PI * 52;
      return ranges.map((range) => {
        const value = dateFilteredRosterEmployees.filter(range.matches).length;
        const dash = total ? (value / total) * circumference : 0;
        const segment = { ...range, value, dash, circumference, offset: -offset };
        offset += dash;
        return segment;
      });
    };

    return {
      weekly: buildSegments("weekly"),
      daily: buildSegments("daily"),
      weeklyExceptions: [...dateFilteredRosterEmployees].filter((employee) => employee.weekly > 38).sort((a, b) => b.weekly - a.weekly).slice(0, 5),
      dailyExceptions: [...dateFilteredRosterEmployees].filter((employee) => employee.daily > 8).sort((a, b) => b.daily - a.daily).slice(0, 5),
    };
  }, [dateFilteredRosterEmployees]);

  const rosterPageSize = 6;
  const paginatedRosterEmployees = useMemo(() => {
    const start = (currentPage - 1) * rosterPageSize;
    return filteredRosterEmployees.slice(start, start + rosterPageSize);
  }, [filteredRosterEmployees, currentPage]);

  const rosterKpis = useMemo(() => ({
    totalShifts: dateFilteredRosterEmployees.reduce((total, employee) => total + employee.shifts, 0),
    acceptedShifts: dateFilteredRosterEmployees.reduce((total, employee) => total + employee.accepted, 0),
    declinedShifts: dateFilteredRosterEmployees.reduce((total, employee) => total + employee.declined, 0),
    openShifts: dateFilteredRosterEmployees.reduce((total, employee) => total + employee.pending, 0),
    scheduledHours: dateFilteredRosterEmployees.reduce((total, employee) => total + employee.weekly, 0),
  }), [dateFilteredRosterEmployees]);
  const rosterStatusTotal = rosterKpis.acceptedShifts + rosterKpis.declinedShifts + rosterKpis.openShifts;

  const overviewOperations = useMemo(() => {
    const rosterFulfilment = rosterStatusTotal ? Math.round((rosterKpis.acceptedShifts / rosterStatusTotal) * 100) : 0;
    const timesheetApproval = rosterKpis.totalShifts ? Math.round((rosterKpis.acceptedShifts / rosterKpis.totalShifts) * 100) : 0;
    const criticalIncidents = customerIncidentLogs.filter((incident) => incident.priority === "Critical" && incident.status === "Open").length;
    const highPendingIncidents = customerIncidentLogs.filter((incident) => incident.priority === "High" && incident.status === "Open").length;
    const lowCoverageSites = currentCustData.filter((site) => site.totalEmployees && (site.clockedIn / site.totalEmployees) < 0.8).length;
    const health = criticalIncidents > 0 || rosterFulfilment < 75 ? "Needs attention" : timesheetApproval < 85 || lowCoverageSites > 0 ? "Monitor closely" : "Operating well";
    const healthTone = health === "Needs attention" ? "critical" : health === "Monitor closely" ? "watch" : "good";
    const attention = [
      ...customerIncidentLogs.filter((incident) => incident.status === "Open" && ["Critical", "High"].includes(incident.priority)).slice(0, 2).map((incident) => ({ tone: incident.priority === "Critical" ? "critical" : "high", label: "Incident", title: `${incident.priority} priority case at ${incident.location}`, detail: incident.id })),
      ...(rosterKpis.openShifts > 0 ? [{ tone: "high", label: "Roster", title: `${rosterKpis.openShifts} shifts need assignment`, detail: "Open / Unassigned" }] : []),
      ...(rosterKpis.declinedShifts > 0 ? [{ tone: "watch", label: "Roster", title: `${rosterKpis.declinedShifts} shifts were declined`, detail: "Declined Shifts" }] : []),
      ...(onboardingKpis.missing > 0 ? [{ tone: "watch", label: "Onboarding", title: `${onboardingKpis.missing} candidates have missing documents`, detail: "Missing documents" }] : []),
      ...(lowCoverageSites > 0 ? [{ tone: "watch", label: "Coverage", title: `${lowCoverageSites} site${lowCoverageSites === 1 ? " is" : "s are"} below 80% coverage`, detail: "Workforce coverage" }] : []),
    ].slice(0, 5);
    const commitments = [
      ...(rosterKpis.openShifts > 0 ? [{ time: "Now", type: "Roster", text: `${rosterKpis.openShifts} open shifts require assignment` }] : []),
      ...(onboardingKpis.ready > 0 ? [{ time: "This week", type: "Onboarding", text: `${onboardingKpis.ready} candidates ready for roster` }] : []),
      ...(highPendingIncidents > 0 ? [{ time: "Today", type: "Incident", text: `${highPendingIncidents} high-priority incidents need review` }] : []),
      { time: "Today", type: "Timesheets", text: `${Math.max(rosterKpis.totalShifts - rosterKpis.acceptedShifts, 0)} shift records await approval` },
    ].slice(0, 4);
    return { rosterFulfilment, timesheetApproval, criticalIncidents, highPendingIncidents, lowCoverageSites, health, healthTone, attention, commitments };
  }, [rosterKpis, rosterStatusTotal, customerIncidentLogs, onboardingKpis, currentCustData]);

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

  const openOverviewModule = (module, detail = "") => {
    if (module === "Overview") {
      setActiveView(detail === "coverage" ? "active-sites" : "clocked-in");
      return;
    }
    if (module === "Incidents") {
      setIncidentStatusFilter(detail === "open" || detail === "high" ? "Open" : "All");
      setIncidentPriorityFilter(detail === "critical" ? "Critical" : detail === "high" ? "High" : "All");
    }
    if (module === "Onboarding Candidate") {
      setOnboardingStatusFilter(detail === "ready" ? "Ready for Roster" : "All");
    }
    if (module === "Roster") {
      setRosterStatusFilter(detail === "declined" ? "All" : detail === "hours" ? "Alerts" : "All");
    }
    setSearchQuery("");
    setActiveView("dashboard");
    navigate(`${location.pathname}?tab=${encodeURIComponent(module)}`);
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
    ? dateFilteredRosterEmployees.filter((employee) => rosterDetailType === "totalShifts" || activeRosterDetail.value(employee) > 0)
    : [];

  // Reset pagination when search or customer changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCust, activeTab, selectedDateBounds, incidentStatusFilter, incidentPriorityFilter, rosterStatusFilter, rosterHoursFilter, incidentDetailType, onboardingStatusFilter, onboardingDetailType]);

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
              {["Overview", "Timesheets", "Incidents", "Onboarding Candidate", "Roster"].includes(activeTab) && (
                <div className="roster-date-filter">
                  <label className="selector-label" htmlFor="dashboard-date-range">Date Range</label>
                  <div className="roster-date-select-wrap">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></svg>
                    <select id="dashboard-date-range" value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                      <option value="last-7-days">Last 7 Days</option>
                      <option value="last-month">Last 30 Days</option>
                      <option value="custom">Custom Date</option>
                    </select>
                  </div>
                  {dateRange === "custom" && (
                    <div className="roster-custom-dates">
                      <label><span>From</span><input type="date" value={customStart} max={customEnd || undefined} onChange={(event) => setCustomStart(event.target.value)} /></label>
                      <label><span>To</span><input type="date" value={customEnd} min={customStart || undefined} onChange={(event) => setCustomEnd(event.target.value)} /></label>
                    </div>
                  )}
                </div>
              )}
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
                <span className="metric-sub">{selectedDateLabel}</span>
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
                <span className="metric-sub">Clocked in · {selectedDateLabel}</span>
              </div>
              <div className="metric-sparkline">
                {drawSparkline("#f97316")}
              </div>
            </div>
          </div>

          <section className="ops-health-strip">
            <div className={`ops-health-lead ${overviewOperations.healthTone}`}>
              <span className="ops-health-pulse" />
              <div><small>Operational health</small><strong>{overviewOperations.health}</strong></div>
            </div>
            {[
              ["Workforce coverage", `${totalEmployees ? Math.round((clockedIn / totalEmployees) * 100) : 0}%`, `${clockedIn} of ${totalEmployees} clocked in`, "green"],
              ["Timesheet approval", `${overviewOperations.timesheetApproval}%`, `${Math.max(rosterKpis.totalShifts - rosterKpis.acceptedShifts, 0)} records pending`, "blue"],
              ["Incident risk", overviewOperations.criticalIncidents, overviewOperations.criticalIncidents ? "Critical cases open" : "No critical cases", overviewOperations.criticalIncidents ? "red" : "green"],
              ["Roster fulfilment", `${overviewOperations.rosterFulfilment}%`, `${rosterKpis.openShifts} shifts unassigned`, "purple"],
              ["Roster ready", onboardingKpis.ready, `${onboardingKpis.active} candidates in progress`, "orange"],
            ].map(([label, value, note, tone], index) => <button className="ops-health-metric" type="button" key={label} onClick={() => openOverviewModule(["Overview","Timesheets","Incidents","Roster","Onboarding Candidate"][index], index === 0 ? "workforce" : "")}><i className={`ops-health-icon ${tone}`} /><span>{label}</span><strong>{value}</strong><small>{note}</small></button>)}
          </section>

          <section className="ops-attention-card">
            <div className="ops-section-heading">
              <div><span className="ops-section-kicker">Priority control</span><h3>Operations Attention Queue</h3><p>Highest-impact exceptions requiring action across all operational modules.</p></div>
              <div className="ops-attention-count"><strong>{overviewOperations.attention.length}</strong><span>items to review</span></div>
            </div>
            <div className="ops-attention-list">
              {overviewOperations.attention.map((item, index) => <button className="ops-attention-row" type="button" key={`${item.label}-${item.title}`} onClick={() => openOverviewModule(item.label === "Incident" ? "Incidents" : item.label === "Onboarding" ? "Onboarding Candidate" : item.label === "Roster" ? "Roster" : "Overview", item.label === "Incident" ? (item.tone === "critical" ? "critical" : "high") : item.label === "Coverage" ? "coverage" : item.detail.toLowerCase().includes("declined") ? "declined" : "")}><span className={`ops-priority-marker ${item.tone}`}>{String(index + 1).padStart(2,"0")}</span><span className="ops-attention-module">{item.label}</span><div><strong>{item.title}</strong><small>{item.detail} · {selectedCust}</small></div><span className={`ops-priority-label ${item.tone}`}>{item.tone === "critical" ? "Critical" : item.tone === "high" ? "High" : "Review"}</span></button>)}
              {overviewOperations.attention.length === 0 && <div className="ops-attention-empty"><strong>Operations are clear</strong><span>No priority exceptions require action for the selected period.</span></div>}
            </div>
          </section>

          <div className="ops-snapshot-grid">
            <section className="ops-snapshot-card ops-snapshot-timesheets" role="button" tabIndex="0" onClick={() => openOverviewModule("Timesheets")} onKeyDown={(event) => event.key === "Enter" && openOverviewModule("Timesheets")}>
              <div className="ops-snapshot-header"><div className="ops-snapshot-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="17" rx="2"/><path d="m9 15 2 2 4-4"/></svg></div><div><span>Timesheets</span><h3>Compliance Snapshot</h3></div><strong>{overviewOperations.timesheetApproval}%</strong></div>
              <p>Share of scheduled shift records accepted for the selected period.</p>
              <div className="ops-segment-bar"><i className="approved" style={{width:`${overviewOperations.timesheetApproval}%`}}/><i className="pending" style={{width:`${Math.max(100-overviewOperations.timesheetApproval,0)}%`}}/></div>
              <div className="ops-stat-pair"><span><b>{rosterKpis.acceptedShifts}</b>Approved</span><span><b>{Math.max(rosterKpis.totalShifts-rosterKpis.acceptedShifts,0)}</b>Awaiting review</span><span><b>{rosterKpis.declinedShifts}</b>Declined</span></div>
              <div className="ops-snapshot-foot"><span className={overviewOperations.timesheetApproval >= 90 ? "good" : "watch"}>{overviewOperations.timesheetApproval >= 90 ? "Approval SLA on track" : "Approval follow-up required"}</span><small>Target 90%</small></div>
            </section>

            <section className="ops-snapshot-card ops-snapshot-incidents" role="button" tabIndex="0" onClick={() => openOverviewModule("Incidents", "open")} onKeyDown={(event) => event.key === "Enter" && openOverviewModule("Incidents", "open")}>
              <div className="ops-snapshot-header"><div className="ops-snapshot-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.3 3.4 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg></div><div><span>Incidents</span><h3>Risk Snapshot</h3></div><strong>{incidentKpis.open}</strong></div>
              <p>Open operational cases, prioritized by severity and urgency.</p>
              <div className="ops-risk-scale">{incidentPriorityData.map((item) => <span key={item.label}><i style={{height:`${Math.max((item.value/Math.max(...incidentPriorityData.map(entry=>entry.value),1))*52,5)}px`,background:item.color}}/><b>{item.value}</b><small>{item.label}</small></span>)}</div>
              <div className="ops-snapshot-foot"><span className={overviewOperations.criticalIncidents ? "critical" : "good"}>{overviewOperations.criticalIncidents ? `${overviewOperations.criticalIncidents} critical cases open` : "No critical cases open"}</span><small>{incidentKpis.resolved} resolved</small></div>
            </section>

            <section className="ops-snapshot-card ops-snapshot-onboarding" role="button" tabIndex="0" onClick={() => openOverviewModule("Onboarding Candidate")} onKeyDown={(event) => event.key === "Enter" && openOverviewModule("Onboarding Candidate")}>
              <div className="ops-snapshot-header"><div className="ops-snapshot-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M2 21c.8-4 3-6 7-6s6.2 2 7 6M17 11h5M19.5 8.5v5"/></svg></div><div><span>Onboarding</span><h3>Pipeline Snapshot</h3></div><strong>{onboardingKpis.ready}</strong></div>
              <p>Candidates progressing toward operational roster readiness.</p>
              <div className="ops-pipeline"><span><b>{onboardingKpis.total}</b><small>Total</small></span><i/><span><b>{onboardingKpis.active}</b><small>In progress</small></span><i/><span className="ready"><b>{onboardingKpis.ready}</b><small>Roster ready</small></span></div>
              <div className="ops-snapshot-foot"><span className={onboardingKpis.missing ? "watch" : "good"}>{onboardingKpis.missing ? `${onboardingKpis.missing} missing documents` : "Documents complete"}</span><small>{onboardingKpis.ageing} ageing cases</small></div>
            </section>

            <section className="ops-snapshot-card ops-snapshot-roster" role="button" tabIndex="0" onClick={() => openOverviewModule("Roster")} onKeyDown={(event) => event.key === "Enter" && openOverviewModule("Roster")}>
              <div className="ops-snapshot-header"><div className="ops-snapshot-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18M8 15h3M14 15h2"/></svg></div><div><span>Roster</span><h3>Coverage & Exceptions</h3></div><strong>{overviewOperations.rosterFulfilment}%</strong></div>
              <p>Accepted shift coverage and workforce-hour exceptions.</p>
              <div className="ops-roster-gauge"><div style={{"--coverage":`${overviewOperations.rosterFulfilment}%`}}><strong>{overviewOperations.rosterFulfilment}%</strong><small>fulfilled</small></div><span><b>{rosterKpis.openShifts}</b>Open shifts</span><span><b>{rosterKpis.declinedShifts}</b>Declined</span><span><b>{rosterDonutData.weeklyExceptions.length+rosterDonutData.dailyExceptions.length}</b>Hours alerts</span></div>
              <div className="ops-snapshot-foot"><span className={rosterKpis.openShifts ? "watch" : "good"}>{rosterKpis.openShifts ? "Assignment action required" : "All shifts assigned"}</span><small>{rosterKpis.totalShifts} scheduled</small></div>
            </section>
          </div>

          <section className="ops-commitments-card">
            <div className="ops-section-heading compact"><div><span className="ops-section-kicker">Next actions</span><h3>Upcoming Operational Commitments</h3><p>Time-sensitive work that operations teams should prepare for.</p></div><span className="ops-period-chip">Next 24–48 hours</span></div>
            <div className="ops-commitment-list">{overviewOperations.commitments.map((item,index)=><button type="button" key={`${item.type}-${index}`} className="ops-commitment-item" onClick={() => openOverviewModule(item.type === "Onboarding" ? "Onboarding Candidate" : item.type, item.type === "Incident" ? "high" : item.type === "Onboarding" ? "ready" : "")}><span className="ops-commitment-time">{item.time}</span><i/><div><strong>{item.text}</strong><small>{item.type} · {selectedCust}</small></div><span className="ops-commitment-index">{String(index+1).padStart(2,"0")}</span></button>)}</div>
          </section>

          <div className="dashboard-grid">
            {/* SITES OVERVIEW / DONUT CHART */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div><span className="ops-section-kicker">Location footprint</span><h3 className="card-title">Sites Overview</h3><p className="site-overview-subtitle">Active service locations by region</p></div>
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
                      className={`donut-segment ${hoveredSiteOverview === sector.siteName ? "active" : ""}`}
                      pointerEvents="visibleStroke"
                      tabIndex="0"
                      role="button"
                      aria-label={`${sector.siteName}: ${sector.count} sites, ${sector.percentage}% of network`}
                      onMouseEnter={() => setHoveredSiteOverview(sector.siteName)}
                      onMouseLeave={() => setHoveredSiteOverview("")}
                      onFocus={() => setHoveredSiteOverview(sector.siteName)}
                      onBlur={() => setHoveredSiteOverview("")}
                      onClick={() => handleSiteClick(sector.siteName, sector.customer)}
                    />
                  ))}
                  <text x="150" y="132" textAnchor="middle" className="donut-center-kicker">NETWORK</text>
                  <text x="150" y="151" textAnchor="middle" className="donut-center-val font-number">
                    {totalSites}
                  </text>
                  <text x="150" y="174" textAnchor="middle" className="donut-center-lbl">
                    sites across {currentCustData.length} regions
                  </text>
                </svg>
                {hoveredSiteOverview && (() => { const sector = donutSectors.find((item) => item.siteName === hoveredSiteOverview); const site = currentCustData.find((item) => item.siteName === hoveredSiteOverview); return sector && site ? <div className="site-donut-tooltip"><span className="site-tooltip-dot" style={{background:sector.color}}/><div><strong>{sector.siteName}</strong><span>{sector.count} {sector.count === 1 ? "site" : "sites"} · {sector.percentage}% of network</span><small>{site.clockedIn} of {site.totalEmployees} employees clocked in</small></div></div> : null; })()}
              </div>

              <div className="donut-legend">
                {donutSectors.map((sector, index) => (
                  <div key={index} className={`legend-item ${hoveredSiteOverview === sector.siteName ? "active" : ""}`} role="button" tabIndex="0" onMouseEnter={() => setHoveredSiteOverview(sector.siteName)} onMouseLeave={() => setHoveredSiteOverview("")} onFocus={() => setHoveredSiteOverview(sector.siteName)} onBlur={() => setHoveredSiteOverview("")} onClick={() => handleSiteClick(sector.siteName, sector.customer)}>
                    <span className="legend-dot" style={{ backgroundColor: sector.color }} />
                    <span className="legend-text-label">
                      {sector.siteName}
                    </span>
                    <span className="legend-text-val font-number"><strong>{sector.count}</strong> {sector.count > 1 ? "Sites" : "Site"}</span>
                    <span className="legend-percentage font-number">{sector.percentage}%</span>
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

          <section className="pin-workforce-card">
            <div className="pin-workforce-header">
              <div>
                <span className="pin-workforce-eyebrow">Workforce geography</span>
                <h3>Employee Distribution by Site PIN Code</h3>
                <p>{selectedCust} · {selectedDateLabel} · ranked by workforce strength</p>
              </div>
              <div className="pin-workforce-summary">
                <span><strong>{pinCodeWorkforce.length}</strong> PIN codes</span>
                <span><strong>{totalEmployees}</strong> employees</span>
                <span><strong>{totalEmployees ? Math.round((clockedIn / totalEmployees) * 100) : 0}%</strong> clocked in</span>
              </div>
            </div>

            <div className="pin-workforce-legend" aria-label="Chart legend">
              <span><i className="pin-legend-active" />Clocked in</span>
              <span><i className="pin-legend-scheduled" />Scheduled / offline</span>
              <small>Click a PIN code to view employees</small>
            </div>

            <div className="pin-workforce-chart">
              {pinCodeWorkforce.map((item) => {
                const maxEmployees = Math.max(...pinCodeWorkforce.map((group) => group.employees), 1);
                const barWidth = (item.employees / maxEmployees) * 100;
                const activeWidth = item.employees ? (item.clockedIn / item.employees) * 100 : 0;
                return (
                  <button className="pin-workforce-row" type="button" key={item.pinCode} onClick={() => openPinCodeDetails(item.pinCode)}>
                    <span className="pin-code-label">{item.pinCode}</span>
                    <span className="pin-area-label"><strong>{item.area}</strong><small>{item.siteCount} {item.siteCount === 1 ? "site" : "sites"} · {item.customerCount} {item.customerCount === 1 ? "customer" : "customers"}</small></span>
                    <span className="pin-bar-cell">
                      <span className="pin-bar-track">
                        <span className="pin-bar-total" style={{ width: `${barWidth}%` }}>
                          <span className="pin-bar-active" style={{ width: `${activeWidth}%` }} />
                        </span>
                      </span>
                    </span>
                    <span className="pin-workforce-count"><strong>{item.employees}</strong><small>{item.clockedIn} active · {item.coverage}%</small></span>
                    <svg className="pin-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                );
              })}
              {pinCodeWorkforce.length === 0 && <div className="pin-workforce-empty">No employee data is available for this date range.</div>}
            </div>
          </section>
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

        const baseTd = tsData[selectedCust] || tsData["All Customers"];
        const periodFactor = selectedDateDays / 7;
        const td = {
          ...baseTd,
          totalHours: Math.round(baseTd.totalHours * periodFactor),
          approvedLogs: Math.round(baseTd.approvedLogs * periodFactor),
          pendingLogs: Math.round(baseTd.pendingLogs * periodFactor),
          disputedLogs: Math.round(baseTd.disputedLogs * periodFactor),
          locations: baseTd.locations.map((location) => ({ ...location, hrs: Math.round(location.hrs * periodFactor) })),
          trend: baseTd.trend.map((value) => Math.round(value * periodFactor)),
        };
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
                  <span className="ts-kpi-desc">{selectedDateLabel}</span>
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
                  <span className="ts-period-badge">{selectedDateLabel}</span>
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
                        className={`donut-segment ${hoveredHoursLocation === loc.name ? "active" : ""}`}
                        pointerEvents="visibleStroke"
                        tabIndex="0"
                        role="button"
                        aria-label={`${loc.name}: ${loc.hrs} hours, ${loc.pct.toFixed(1)}%`}
                        onMouseEnter={() => setHoveredHoursLocation(loc.name)}
                        onMouseLeave={() => setHoveredHoursLocation("")}
                        onFocus={() => setHoveredHoursLocation(loc.name)}
                        onBlur={() => setHoveredHoursLocation("")}
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
                  {hoveredHoursLocation && (() => { const loc = donutLocs.find((item) => item.name === hoveredHoursLocation); return loc ? <div className="hours-donut-tooltip"><span className="site-tooltip-dot" style={{background:loc.color}}/><div><strong>{loc.name}</strong><span>{loc.hrs.toLocaleString()} approved hours</span><small>{loc.pct.toFixed(1)}% of total · {loc.clockedIn} staff clocked in</small></div></div> : null; })()}
                  <div className="ts-donut-legend">
                    {donutLocs.map((loc) => (
                      <div
                        key={loc.name}
                        className={`ts-legend-row ${hoveredHoursLocation === loc.name ? "active" : ""}`}
                        style={{ cursor: "pointer" }}
                        role="button"
                        tabIndex="0"
                        onMouseEnter={() => setHoveredHoursLocation(loc.name)}
                        onMouseLeave={() => setHoveredHoursLocation("")}
                        onFocus={() => setHoveredHoursLocation(loc.name)}
                        onBlur={() => setHoveredHoursLocation("")}
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
              <div className="ts-table-header exportable-table-header">
                <div className="ts-chart-title-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="ts-chart-title">Location Performance Overview — {selectedCust}</span>
                </div>
                <ExportCsvButton filename="location-performance-overview.csv" rows={td.locations} columns={[
                  { label: "Location", value: (location) => location.name },
                  { label: "Total Approved Hours", value: (location) => location.hrs },
                  { label: "Assigned Supervisor", value: (location, index) => `Supervisor ${String(index + 1).padStart(2, "0")}` },
                  { label: "Clocked In", value: (location) => location.clockedIn },
                  { label: "Approval Ratio", value: (location) => `${location.pct.toFixed(1)}%` },
                  { label: "Operational Status", value: () => "Synchronized" },
                ]} />
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
        const baseTd = tsData[selectedCust] || tsData["All Customers"];
        const periodFactor = selectedDateDays / 7;
        const td = {
          ...baseTd,
          totalHours: Math.round(baseTd.totalHours * periodFactor),
          approvedLogs: Math.round(baseTd.approvedLogs * periodFactor),
          pendingLogs: Math.round(baseTd.pendingLogs * periodFactor),
          disputedLogs: Math.round(baseTd.disputedLogs * periodFactor),
          locations: baseTd.locations.map((location) => ({ ...location, hrs: Math.round(location.hrs * periodFactor) })),
        };
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
            <div className="detail-view-header exportable-table-header">
              <h3 className="detail-view-title">
                Timesheet Details — {selectedCust}{selectedSiteName ? ` / ${selectedSiteName}` : ""}
              </h3>
              <ExportCsvButton filename="timesheet-employees.csv" rows={rows} columns={[
                { label: "Log ID", value: (row) => row.id }, { label: "Employee Name", value: (row) => row.name },
                { label: "Customer", value: (row) => row.customer }, { label: "Site", value: (row) => row.site },
                { label: "PIN Code", value: (row) => row.pin }, { label: "Role", value: (row) => row.role },
                { label: "Shift Start", value: (row) => row.start }, { label: "Shift End", value: (row) => row.end },
                { label: "Hours Logged", value: (row) => row.hrs }, { label: "Status", value: (row) => row.status },
              ]} />
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
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("total")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("total")}><ExportCsvButton filename="incident-total-cases.csv" rows={customerIncidentLogs} columns={incidentCsvColumns} />
              <div className="incident-kpi-icon incident-icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
              </div>
              <span className="incident-kpi-label">Total Cases</span>
              <strong className="incident-kpi-value">{incidentKpis.total}</strong>
              <span className="incident-kpi-sub">All incidents</span>
              <span className="incident-sparkline incident-sparkline-blue">↗︎</span>
            </div>
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("status", "Open")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("status", "Open")}><ExportCsvButton filename="incident-open-cases.csv" rows={customerIncidentLogs.filter((incident) => incident.status === "Open")} columns={incidentCsvColumns} />
              <div className="incident-kpi-icon incident-icon-purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="9" /></svg>
              </div>
              <span className="incident-kpi-label">Open Cases</span>
              <strong className="incident-kpi-value">{incidentKpis.open}</strong>
              <span className="incident-kpi-sub">Active incidents</span>
              <span className="incident-sparkline incident-sparkline-purple">↗︎</span>
            </div>
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("status", "Resolved")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("status", "Resolved")}><ExportCsvButton filename="incident-resolved-cases.csv" rows={customerIncidentLogs.filter((incident) => incident.status === "Resolved")} columns={incidentCsvColumns} />
              <div className="incident-kpi-icon incident-icon-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></svg>
              </div>
              <span className="incident-kpi-label">Resolved Cases</span>
              <strong className="incident-kpi-value">{incidentKpis.resolved}</strong>
              <span className="incident-kpi-sub">Successfully resolved</span>
              <span className="incident-sparkline incident-sparkline-green">↗︎</span>
            </div>
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("status", "Closed")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("status", "Closed")}><ExportCsvButton filename="incident-closed-cases.csv" rows={customerIncidentLogs.filter((incident) => incident.status === "Closed")} columns={incidentCsvColumns} />
              <div className="incident-kpi-icon incident-icon-slate">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h5M8 16h8" /></svg>
              </div>
              <span className="incident-kpi-label">Closed Cases</span>
              <strong className="incident-kpi-value">{incidentKpis.closed}</strong>
              <span className="incident-kpi-sub">Closed this period</span>
              <span className="incident-sparkline incident-sparkline-blue">↗︎</span>
            </div>
            <div className="incident-kpi-card incident-kpi-clickable" role="button" tabIndex="0" onClick={() => openIncidentDetails("highPending")} onKeyDown={(event) => event.key === "Enter" && openIncidentDetails("highPending")}><ExportCsvButton filename="incident-high-priority-pending.csv" rows={customerIncidentLogs.filter((incident) => incident.status === "Open" && incident.priority === "High")} columns={incidentCsvColumns} />
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
                <span>{selectedDateLabel}</span>
                <ExportCsvButton filename="incident-trend.csv" rows={incidentTrendData} columns={[{ label: "Date", value: (item) => item.label }, { label: "Incidents", value: (item) => item.value }]} />
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
              <div className="incident-section-heading"><h3>Incidents by Status</h3><ExportCsvButton filename="incidents-by-status.csv" rows={incidentStatusData} columns={[{ label: "Status", value: (item) => item.label }, { label: "Cases", value: (item) => item.value }]} /></div>
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
            <div className="incident-section-heading"><h3>Incidents by Priority</h3><ExportCsvButton filename="incidents-by-priority.csv" rows={incidentPriorityData} columns={[{ label: "Priority", value: (item) => item.label }, { label: "Cases", value: (item) => item.value }]} /></div>
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
                <ExportCsvButton filename="incident-logs.csv" rows={filteredIncidentLogs} columns={[
                  { label: "Incident ID", value: (incident) => incident.id }, { label: "Customer", value: (incident) => incident.customer },
                  { label: "Location", value: (incident) => incident.location }, { label: "Incident Type", value: (incident) => incident.type },
                  { label: "Logged By", value: (incident) => incident.loggedBy }, { label: "Priority", value: (incident) => incident.priority },
                  { label: "Status", value: (incident) => incident.status }, { label: "Action Taken", value: (incident) => incident.action },
                  { label: "Logged On", value: (incident) => incident.loggedOn },
                ]} />
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
          <div className="detail-view-header incident-detail-header exportable-table-header">
            <div>
              <h3 className="detail-view-title">{incidentDetailTitle} ({selectedCust})</h3>
              <span className="incident-detail-description">Filtered from the current 60-record incident dataset.</span>
            </div>
            <ExportCsvButton filename="incident-details.csv" rows={incidentDetailLogs} columns={incidentCsvColumns} />
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
        <div className="onboarding-dashboard animate-fade-in">
          <div className="onboarding-kpi-grid">
            {[
              ["Total Candidates", onboardingKpis.total, "All applications", "blue", "total"],
              ["In Progress", onboardingKpis.active, "Candidates being onboarded", "purple", "active"],
              ["Ready for Roster", onboardingKpis.ready, "Approved to schedule", "green", "Ready for Roster"],
              ["Missing Documents", onboardingKpis.missing, "Needs attention", "orange", "missing"],
              ["Ageing > 7 Days", onboardingKpis.ageing, "Requires follow-up", "red", "ageing"],
              ].map(([label, value, sub, color, detail]) => (
              <div className="onboarding-kpi-card onboarding-kpi-clickable" key={label} role="button" tabIndex="0" onClick={() => openOnboardingDetails(detail)} onKeyDown={(event) => event.key === "Enter" && openOnboardingDetails(detail)}><ExportCsvButton filename={`candidate-${String(detail).toLowerCase().replaceAll(" ", "-")}.csv`} rows={detail === "total" ? onboardingCustomerCandidates : detail === "missing" ? onboardingCustomerCandidates.filter((candidate) => candidate.documents !== "Complete") : detail === "ageing" ? onboardingCustomerCandidates.filter((candidate) => candidate.days > 7) : detail === "active" ? onboardingCustomerCandidates.filter((candidate) => !["Ready for Roster", "Rejected"].includes(candidate.status)) : onboardingCustomerCandidates.filter((candidate) => candidate.status === detail)} columns={candidateCsvColumns} />
                <div className={`onboarding-kpi-icon onboarding-icon-${color}`}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" /></svg></div>
                <span>{label}</span><strong>{value}</strong><small>{sub}</small>
              </div>
            ))}
          </div>

          <div className="onboarding-chart-grid">
            <section className="onboarding-chart-card">
              <div className="onboarding-section-heading"><div><h3>Candidate Intake Trend</h3><span>Applications received · {selectedDateLabel}</span></div><span className="onboarding-chart-badge">Dummy data</span><ExportCsvButton filename="candidate-intake-trend.csv" rows={onboardingTrendData} columns={[{ label: "Date", value: (item) => item.label }, { label: "Applications", value: (item) => item.value }]} /></div>
              <svg className="onboarding-trend-chart" viewBox="0 0 620 220" role="img" aria-label="Candidate intake trend over the last seven days">
                <g className="onboarding-grid-lines"><line x1="42" y1="25" x2="600" y2="25" /><line x1="42" y1="65" x2="600" y2="65" /><line x1="42" y1="105" x2="600" y2="105" /><line x1="42" y1="145" x2="600" y2="145" /><line x1="42" y1="185" x2="600" y2="185" /></g>
                <g className="onboarding-axis-labels"><text x="18" y="29">4</text><text x="18" y="69">3</text><text x="18" y="109">2</text><text x="18" y="149">1</text><text x="22" y="189">0</text></g>
                <path className="onboarding-trend-area" d={`${onboardingTrendPath} L600 185 L42 185 Z`} /><path className="onboarding-trend-line" d={onboardingTrendPath} />
                {onboardingTrendPoints.map((point) => <g key={point.label}><circle cx={point.x} cy={point.y} r="4" className="onboarding-trend-point" /><title>{`${point.label}: ${point.value} applications`}</title></g>)}
                <g className="onboarding-x-labels">{onboardingTrendPoints.map((point) => <text key={point.label} x={point.x - 12} y="210">{point.label}</text>)}</g>
              </svg>
            </section>

            <section className="onboarding-chart-card onboarding-status-card">
              <div className="onboarding-section-heading"><div><h3>Pipeline by Stage</h3><span>Click a stage to view candidates</span></div><ExportCsvButton filename="candidate-pipeline-by-stage.csv" rows={onboardingStatusData} columns={[{ label: "Stage", value: (item) => item.label }, { label: "Candidates", value: (item) => item.value }]} /></div>
              <div className="onboarding-donut-layout">
                <div className="onboarding-donut"><svg viewBox="0 0 128 128" aria-hidden="true">{onboardingDonutSegments.map((segment) => <circle key={segment.label} className={`onboarding-donut-segment ${hoveredOnboardingStatus === segment.label ? "active" : ""}`} cx="64" cy="64" r="48" fill="none" stroke={segment.color} strokeWidth="22" strokeDasharray={`${segment.dash} ${segment.circumference - segment.dash}`} strokeDashoffset={segment.offset} transform="rotate(-90 64 64)" onMouseEnter={() => setHoveredOnboardingStatus(segment.label)} onMouseLeave={() => setHoveredOnboardingStatus("")} onClick={() => openOnboardingDetails(segment.label)} />)}</svg><div><strong>{onboardingKpis.total}</strong><span>Candidates</span></div>{hoveredOnboardingStatus && <div className="onboarding-donut-tooltip"><strong>{hoveredOnboardingStatus}</strong><span>{onboardingStatusData.find((item) => item.label === hoveredOnboardingStatus)?.value || 0} candidates</span><small>{onboardingKpis.total ? Math.round(((onboardingStatusData.find((item) => item.label === hoveredOnboardingStatus)?.value || 0) / onboardingKpis.total) * 100) : 0}% of pipeline</small></div>}</div>
                <div className="onboarding-legend">{onboardingStatusData.map((item) => <div key={item.label} className={`onboarding-legend-item ${hoveredOnboardingStatus === item.label ? "active" : ""}`} role="button" tabIndex="0" onMouseEnter={() => setHoveredOnboardingStatus(item.label)} onMouseLeave={() => setHoveredOnboardingStatus("")} onFocus={() => setHoveredOnboardingStatus(item.label)} onBlur={() => setHoveredOnboardingStatus("")} onClick={() => openOnboardingDetails(item.label)} onKeyDown={(event) => event.key === "Enter" && openOnboardingDetails(item.label)}><i style={{ background: item.color }} /><span>{item.label}</span><strong>{item.value}</strong><small>{onboardingKpis.total ? `${Math.round((item.value / onboardingKpis.total) * 100)}%` : "0%"}</small></div>)}</div>
              </div>
            </section>
          </div>

          <section className="onboarding-chart-card onboarding-compliance-card">
            <div className="onboarding-section-heading"><div><h3>Compliance Readiness</h3><span>Average completion across the selected customer</span></div><strong className="onboarding-readiness-value">{Math.round(onboardingCustomerCandidates.reduce((sum, candidate) => sum + candidate.compliance, 0) / Math.max(onboardingKpis.total, 1))}% overall</strong><ExportCsvButton filename="candidate-compliance-readiness.csv" rows={onboardingComplianceData} columns={[{ label: "Compliance Factor", value: (item) => item.label }, { label: "Completion", value: (item) => `${item.value}%` }]} /></div>
            <div className="onboarding-compliance-bars">{onboardingComplianceData.map((item) => <div className="onboarding-compliance-row" key={item.label}><span>{item.label}</span><div><i style={{ width: `${item.value}%`, background: item.color }} /></div><strong>{item.value}%</strong></div>)}</div>
          </section>

          <section className="onboarding-table-card">
            <div className="onboarding-table-header"><div><h3>Candidate Queue <span>({selectedCust})</span></h3><span>Review onboarding progress and readiness</span></div><div className="onboarding-table-tools"><div className="onboarding-search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search candidate..." aria-label="Search candidates" /></div><select value={onboardingStatusFilter} onChange={(event) => setOnboardingStatusFilter(event.target.value)} aria-label="Filter candidates by stage"><option value="All">All stages</option>{onboardingStatusData.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}</select><ExportCsvButton filename="candidate-queue.csv" rows={filteredOnboardingCandidates} columns={[
              { label: "Candidate ID", value: (candidate) => candidate.id }, { label: "Candidate", value: (candidate) => candidate.name },
              { label: "Customer", value: (candidate) => candidate.customer }, { label: "Site", value: (candidate) => candidate.site },
              { label: "Compliance", value: (candidate) => `${candidate.compliance}%` }, { label: "Documents", value: (candidate) => candidate.documents },
              { label: "Background", value: (candidate) => candidate.background }, { label: "Pipeline Stage", value: (candidate) => candidate.status },
              { label: "Age", value: (candidate) => `${candidate.days} days` },
            ]} /></div></div>
            <div className="onboarding-table-wrap"><table className="onboarding-table"><thead><tr><th>Candidate</th><th>Customer / Site</th><th>Compliance</th><th>Documents</th><th>Background</th><th>Pipeline Stage</th><th>Age</th></tr></thead><tbody>{filteredOnboardingCandidates.slice(0, 6).map((candidate) => <tr key={candidate.id} onClick={() => openOnboardingDetails(candidate.status)}><td><strong>{candidate.name}</strong><small>{candidate.id}</small></td><td><strong>{candidate.customer}</strong><small>{candidate.site}</small></td><td><div className="onboarding-table-progress"><i style={{ width: `${candidate.compliance}%` }} /><span>{candidate.compliance}%</span></div></td><td><span className={`onboarding-doc-badge ${candidate.documents === "Complete" ? "complete" : "missing"}`}>{candidate.documents}</span></td><td><span className={`onboarding-background-badge ${candidate.background === "Pass" ? "pass" : candidate.background === "Fail" ? "fail" : "pending"}`}>{candidate.background}</span></td><td><span className="onboarding-stage-badge">{candidate.status}</span></td><td className={candidate.days > 7 ? "onboarding-age-warning" : ""}>{candidate.days} days</td></tr>)}{filteredOnboardingCandidates.length === 0 && <tr><td colSpan="7" className="onboarding-empty">No candidates match the selected filters.</td></tr>}</tbody></table></div>
            <div className="onboarding-table-footer"><span>Showing <strong>{Math.min(filteredOnboardingCandidates.length, 6)}</strong> of <strong>{filteredOnboardingCandidates.length}</strong> candidates</span><button className="onboarding-view-all" onClick={() => openOnboardingDetails("total")}>View full queue</button></div>
          </section>
        </div>
      )}

      {activeTab === "Onboarding Candidate" && activeView === "onboarding-detail" && (
        <div className="detail-view-card onboarding-detail-card animate-fade-in"><div className="detail-view-header exportable-table-header"><div><h3 className="detail-view-title">{onboardingDetailType === "total" ? "All Onboarding Candidates" : onboardingDetailType === "missing" ? "Candidates Missing Documents" : onboardingDetailType === "ageing" ? "Ageing Candidates" : onboardingDetailType} ({selectedCust})</h3><span className="onboarding-detail-description">Filtered from the current dummy onboarding dataset.</span></div><ExportCsvButton filename="onboarding-details.csv" rows={onboardingDetailCandidates} columns={candidateCsvColumns} /></div><div className="detail-table-wrapper"><table className="detail-table"><thead><tr><th>Candidate ID</th><th>Name</th><th>Customer</th><th>Site</th><th>Compliance</th><th>Documents</th><th>Background</th><th>Stage</th><th>Age</th></tr></thead><tbody>{onboardingDetailCandidates.map((candidate) => <tr key={candidate.id}><td className="font-mono">{candidate.id}</td><td className="fw-semibold">{candidate.name}</td><td>{candidate.customer}</td><td>{candidate.site}</td><td>{candidate.compliance}%</td><td>{candidate.documents}</td><td>{candidate.background}</td><td>{candidate.status}</td><td>{candidate.days} days</td></tr>)}{onboardingDetailCandidates.length === 0 && <tr><td colSpan="9" className="incident-empty">No candidates match this view.</td></tr>}</tbody></table></div></div>
      )}

      {/* ROSTER ANALYTICAL OVERVIEW VIEW */}
      {activeTab === "Roster" && activeView === "dashboard" && (
        <div className="roster-dashboard animate-fade-in">
          <div className="roster-kpi-grid">
             <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("totalShifts")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("totalShifts")}><ExportCsvButton filename="roster-total-shifts.csv" rows={dateFilteredRosterEmployees} columns={rosterCsvColumns} /><div className="roster-kpi-icon roster-icon-blue"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></svg></div><span>Total Shifts</span><strong>{rosterKpis.totalShifts}</strong><small>Scheduled shifts</small></div>
              <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("acceptedShifts")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("acceptedShifts")}><ExportCsvButton filename="roster-accepted-shifts.csv" rows={dateFilteredRosterEmployees.filter((employee) => employee.accepted > 0)} columns={rosterCsvColumns} /><div className="roster-kpi-icon roster-icon-green"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></svg></div><span>Accepted Shifts</span><strong>{rosterKpis.acceptedShifts}</strong><small>Accepted across employees</small></div>
              <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("declinedShifts")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("declinedShifts")}><ExportCsvButton filename="roster-declined-shifts.csv" rows={dateFilteredRosterEmployees.filter((employee) => employee.declined > 0)} columns={rosterCsvColumns} /><div className="roster-kpi-icon roster-icon-red"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" /></svg></div><span>Declined Shifts</span><strong>{rosterKpis.declinedShifts}</strong><small>Declined across employees</small></div>
              <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("openShifts")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("openShifts")}><ExportCsvButton filename="roster-open-shifts.csv" rows={dateFilteredRosterEmployees.filter((employee) => employee.pending > 0)} columns={rosterCsvColumns} /><div className="roster-kpi-icon roster-icon-orange"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="9" /></svg></div><span>Open / Unassigned</span><strong>{rosterKpis.openShifts}</strong><small>Needs assignment</small></div>
              <div className="roster-kpi-card roster-kpi-clickable" role="button" tabIndex="0" onClick={() => openRosterKpiDetails("scheduledHours")} onKeyDown={(event) => event.key === "Enter" && openRosterKpiDetails("scheduledHours")}><ExportCsvButton filename="roster-scheduled-hours.csv" rows={dateFilteredRosterEmployees} columns={rosterCsvColumns} /><div className="roster-kpi-icon roster-icon-purple"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></div><span>Total Scheduled Hours</span><strong>{rosterKpis.scheduledHours}</strong><small>Weekly hours across employees</small></div>
           </div>

          <div className="roster-chart-grid">
            <section className="roster-chart-card">
              <div className="roster-chart-heading"><div><h3>Weekly Hours Overview</h3><span>Employee distribution by weekly hours</span></div><span className="roster-limit-badge">Max 38h</span><ExportCsvButton filename="roster-weekly-hours.csv" rows={dateFilteredRosterEmployees} columns={rosterCsvColumns} /></div>
              <div className="roster-hours-summary">
                <div className="roster-donut-wrap">
                  <div className="roster-hours-donut">
                    <svg viewBox="0 0 144 144" aria-label="Weekly hours employee distribution">
                      {rosterDonutData.weekly.map((segment) => <circle key={segment.key} className={`roster-hours-segment ${rosterHoursFilter === segment.key || hoveredRosterDonut === segment.key ? "active" : ""}`} cx="72" cy="72" r="52" fill="none" stroke={segment.color} strokeWidth="22" strokeDasharray={`${segment.dash} ${segment.circumference - segment.dash}`} strokeDashoffset={segment.offset} transform="rotate(-90 72 72)" tabIndex="0" role="button" onMouseEnter={() => setHoveredRosterDonut(segment.key)} onMouseLeave={() => setHoveredRosterDonut("")} onFocus={() => setHoveredRosterDonut(segment.key)} onBlur={() => setHoveredRosterDonut("")} onClick={() => setRosterHoursFilter((current) => current === segment.key ? "" : segment.key)} onKeyDown={(event) => event.key === "Enter" && setRosterHoursFilter((current) => current === segment.key ? "" : segment.key)} />)}
                    </svg>
                    <div className="roster-donut-center"><strong>{dateFilteredRosterEmployees.length}</strong><span>Employees</span></div>
                  </div>
                  <div className="roster-hours-legend">{rosterDonutData.weekly.map((segment) => <button key={segment.key} className={rosterHoursFilter === segment.key ? "active" : ""} onMouseEnter={() => setHoveredRosterDonut(segment.key)} onMouseLeave={() => setHoveredRosterDonut("")} onClick={() => setRosterHoursFilter((current) => current === segment.key ? "" : segment.key)}><i style={{ background: segment.color }} /><span>{segment.label}</span><strong>{segment.value}</strong></button>)}</div>
                  <div className={`roster-hours-hover-result ${hoveredRosterDonut.startsWith("weekly") ? "visible" : ""}`}>{hoveredRosterDonut.startsWith("weekly") && (() => { const segment = rosterDonutData.weekly.find((item) => item.key === hoveredRosterDonut); return segment ? <><i style={{background:segment.color}}/><div><strong>{segment.label}</strong><span>{segment.value} employees</span></div><small>{dateFilteredRosterEmployees.length ? Math.round((segment.value / dateFilteredRosterEmployees.length) * 100) : 0}% of total</small></> : null; })()}</div>
                </div>
                <div className="roster-exception-list"><div className="roster-exception-title"><span>Top weekly exceedances</span><small>Click employee to view</small></div>{rosterDonutData.weeklyExceptions.map((employee) => <button key={employee.id} onClick={() => openRosterEmployeeDetails(employee)}><span><strong>{employee.name}</strong><small>{employee.location}</small></span><b>+{employee.weekly - 38}h</b></button>)}{rosterDonutData.weeklyExceptions.length === 0 && <p>No weekly exceedances</p>}</div>
              </div>
              <div className="roster-chart-note"><span className="roster-chart-dot" />Click a segment to filter the employee roster <b>{rosterHoursFilter.startsWith("weekly") ? "Weekly filter active" : "Weekly limit: 38 hours"}</b></div>
            </section>

            <section className="roster-chart-card">
              <div className="roster-chart-heading"><div><h3>Daily Hours Monitoring</h3><span>Employee distribution by daily hours</span></div><span className="roster-limit-badge">Max 8h</span><ExportCsvButton filename="roster-daily-hours.csv" rows={dateFilteredRosterEmployees} columns={rosterCsvColumns} /></div>
              <div className="roster-hours-summary">
                <div className="roster-donut-wrap">
                  <div className="roster-hours-donut">
                    <svg viewBox="0 0 144 144" aria-label="Daily hours employee distribution">
                      {rosterDonutData.daily.map((segment) => <circle key={segment.key} className={`roster-hours-segment ${rosterHoursFilter === segment.key || hoveredRosterDonut === segment.key ? "active" : ""}`} cx="72" cy="72" r="52" fill="none" stroke={segment.color} strokeWidth="22" strokeDasharray={`${segment.dash} ${segment.circumference - segment.dash}`} strokeDashoffset={segment.offset} transform="rotate(-90 72 72)" tabIndex="0" role="button" onMouseEnter={() => setHoveredRosterDonut(segment.key)} onMouseLeave={() => setHoveredRosterDonut("")} onFocus={() => setHoveredRosterDonut(segment.key)} onBlur={() => setHoveredRosterDonut("")} onClick={() => setRosterHoursFilter((current) => current === segment.key ? "" : segment.key)} onKeyDown={(event) => event.key === "Enter" && setRosterHoursFilter((current) => current === segment.key ? "" : segment.key)} />)}
                    </svg>
                    <div className="roster-donut-center"><strong>{dateFilteredRosterEmployees.length}</strong><span>Employees</span></div>
                  </div>
                  <div className="roster-hours-legend">{rosterDonutData.daily.map((segment) => <button key={segment.key} className={rosterHoursFilter === segment.key ? "active" : ""} onMouseEnter={() => setHoveredRosterDonut(segment.key)} onMouseLeave={() => setHoveredRosterDonut("")} onClick={() => setRosterHoursFilter((current) => current === segment.key ? "" : segment.key)}><i style={{ background: segment.color }} /><span>{segment.label}</span><strong>{segment.value}</strong></button>)}</div>
                  <div className={`roster-hours-hover-result ${hoveredRosterDonut.startsWith("daily") ? "visible" : ""}`}>{hoveredRosterDonut.startsWith("daily") && (() => { const segment = rosterDonutData.daily.find((item) => item.key === hoveredRosterDonut); return segment ? <><i style={{background:segment.color}}/><div><strong>{segment.label}</strong><span>{segment.value} employees</span></div><small>{dateFilteredRosterEmployees.length ? Math.round((segment.value / dateFilteredRosterEmployees.length) * 100) : 0}% of total</small></> : null; })()}</div>
                </div>
                <div className="roster-exception-list"><div className="roster-exception-title"><span>Top daily exceedances</span><small>Click employee to view</small></div>{rosterDonutData.dailyExceptions.map((employee) => <button key={employee.id} onClick={() => openRosterEmployeeDetails(employee)}><span><strong>{employee.name}</strong><small>{employee.location}</small></span><b>+{employee.daily - 8}h</b></button>)}{rosterDonutData.dailyExceptions.length === 0 && <p>No daily exceedances</p>}</div>
              </div>
              <div className="roster-chart-note"><span className="roster-chart-dot roster-dot-daily" />Click a segment to filter the employee roster <b>{rosterHoursFilter.startsWith("daily") ? "Daily filter active" : "Daily limit: 8 hours"}</b></div>
            </section>
          </div>

          <section className="roster-chart-card roster-status-card">
            <div className="roster-chart-heading"><div><h3>Shift Status Overview</h3><span>{selectedDateLabel} roster distribution</span></div><ExportCsvButton filename="roster-shift-status.csv" rows={dateFilteredRosterEmployees} columns={rosterCsvColumns} /></div>
            <div className="roster-status-content"><div className="roster-status-bar"><span style={{ width: `${(rosterKpis.acceptedShifts / rosterStatusTotal) * 100}%`, background: "#48b982" }} /><span style={{ width: `${(rosterKpis.declinedShifts / rosterStatusTotal) * 100}%`, background: "#f97316" }} /><span style={{ width: `${(rosterKpis.openShifts / rosterStatusTotal) * 100}%`, background: "#94a3b8" }} /></div><div className="roster-status-legend"><span><i className="roster-legend-green" />Accepted <b>{rosterKpis.acceptedShifts}</b></span><span><i className="roster-legend-orange" />Declined <b>{rosterKpis.declinedShifts}</b></span><span><i className="roster-legend-slate" />Open / Pending <b>{rosterKpis.openShifts}</b></span></div></div>
          </section>

          <section className="roster-table-card">
            <div className="roster-table-header"><div><h3>Employee Roster</h3><span>{selectedCust} · {selectedDateLabel} · hours and shift allocation</span></div><div className="roster-table-tools"><div className="roster-table-search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search employee..." aria-label="Search employees" /></div><select value={rosterStatusFilter} onChange={(event) => setRosterStatusFilter(event.target.value)} aria-label="Filter roster employees"><option value="All">All statuses</option><option value="On track">On track</option><option value="Alerts">Hours alerts</option><option value="Pending review">Pending review</option></select><ExportCsvButton filename="employee-roster.csv" rows={filteredRosterEmployees} columns={[
              { label: "Employee", value: (employee) => employee.name }, { label: "Customer", value: (employee) => employee.customer },
              { label: "Location", value: (employee) => employee.location }, { label: "Shifts", value: (employee) => employee.shifts },
              { label: "Accepted", value: (employee) => employee.accepted }, { label: "Declined", value: (employee) => employee.declined },
              { label: "Pending", value: (employee) => employee.pending }, { label: "Daily Hours", value: (employee) => employee.daily },
              { label: "Weekly Hours", value: (employee) => employee.weekly }, { label: "Remaining Hours", value: (employee) => 38 - employee.weekly },
              { label: "Status", value: (employee) => employee.status },
            ]} /></div></div>
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
            <ExportCsvButton filename="roster-employees.csv" rows={rosterDetailEmployees} columns={[
              { label: "Employee", value: (employee) => employee.name }, { label: "Customer", value: (employee) => employee.customer },
              { label: "Location", value: (employee) => employee.location }, { label: activeRosterDetail.title, value: activeRosterDetail.value },
              { label: "Daily Hours", value: (employee) => employee.daily }, { label: "Weekly Hours", value: (employee) => employee.weekly },
              { label: "Accepted", value: (employee) => employee.accepted }, { label: "Declined", value: (employee) => employee.declined },
              { label: "Pending", value: (employee) => employee.pending }, { label: "Status", value: (employee) => employee.status },
            ]} />
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

      {activeTab === "Overview" && activeView === "pin-code-employees" && (
        <div className="detail-view-card pin-detail-card animate-fade-in">
          <div className="detail-view-header exportable-table-header">
            <div>
              <h3 className="detail-view-title">Employees in PIN Code {selectedPinCode}</h3>
              <span className="pin-detail-description">{selectedCust} · {selectedDateLabel} · {selectedPinEmployees.length} employees</span>
            </div>
            <ExportCsvButton filename={`employees-${selectedPinCode}.csv`} rows={selectedPinEmployees} columns={[
              ...employeeCsvColumns.slice(0, 3),
              { label: "PIN Code", value: () => selectedPinCode },
              ...employeeCsvColumns.slice(3),
            ]} />
          </div>
          <div className="detail-table-wrapper">
            <table className="detail-table pin-detail-table">
              <thead><tr><th>Employee ID</th><th>Name</th><th>Customer</th><th>Site</th><th>PIN Code</th><th>Role</th><th>Shift</th><th>Status</th></tr></thead>
              <tbody>
                {selectedPinEmployees.map((employee) => <tr key={employee.id}><td className="font-mono">{employee.id}</td><td className="fw-semibold">{employee.name}</td><td>{employee.customer}</td><td>{employee.siteName}</td><td className="font-number">{selectedPinCode}</td><td>{employee.role}</td><td>{employee.shiftTime}</td><td><span className={`badge-pill ${employee.clockedIn ? "bg-success-pill" : "bg-warning-pill"}`}>{employee.clockedIn ? "Clocked In" : "Offline"}</span></td></tr>)}
                {selectedPinEmployees.length === 0 && <tr><td colSpan="8" className="incident-empty">No employees are available for this PIN code.</td></tr>}
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
          <div className="detail-view-header exportable-table-header">
            <h3 className="detail-view-title">Total Employees Details ({selectedCust})</h3>
            <ExportCsvButton filename="total-employees.csv" rows={dateFilteredEmployees} />
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
                {dateFilteredEmployees.map((emp, index) => (
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
          <div className="detail-view-header exportable-table-header">
            <h3 className="detail-view-title">Clocked In Employees Details ({selectedCust})</h3>
            <ExportCsvButton filename="clocked-in-employees.csv" rows={dateFilteredEmployees.filter((employee) => employee.clockedIn)} />
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
                {dateFilteredEmployees.filter(e => e.clockedIn).map((emp, index) => (
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
          <div className="detail-view-header exportable-table-header">
            <h3 className="detail-view-title">
              Site Schedule Details for {selectedSiteName} ({selectedCust === "All Customers" ? "All Customers" : selectedCust})
            </h3>
            <ExportCsvButton filename="site-schedule-employees.csv" rows={siteEmployees} />
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
