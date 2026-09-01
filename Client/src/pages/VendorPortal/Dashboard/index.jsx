import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApiData } from '../../../utils/apiClient';
import './index.css';
import { 
  FiBriefcase, 
  FiCalendar,
  FiX,
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiUserMinus,
} from 'react-icons/fi';
import { mockVendorData } from '../mockData';

/* ==================== DONUT CHART COMPONENT ==================== */
const DonutChart = ({ title, subtitle, segments, total, onSegmentClick, centerLabel }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // SVG donut parameters
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 70;
  const strokeWidth = 28;
  const hoverStrokeWidth = 34;
  const circumference = 2 * Math.PI * radius;

  // Build arc segments
  let cumulativePercent = 0;
  const arcs = segments.map((seg, i) => {
    const percent = total > 0 ? seg.count / total : 0;
    const dashArray = `${percent * circumference} ${circumference}`;
    const rotation = cumulativePercent * 360 - 90; // -90 to start from top
    cumulativePercent += percent;
    return {
      ...seg,
      percent,
      dashArray,
      rotation,
      index: i,
    };
  });

  return (
    <div className="donut-chart-card vendor-section-card">
      <div className="donut-chart-header">
        <div>
          <h2 className="vendor-section-title" style={{ fontSize: 18, color: '#0f172a' }}>{title}</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{subtitle}</p>
        </div>
      </div>

      <div className="donut-chart-body">
        {/* SVG Donut */}
        <div className="donut-svg-container">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circle */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {arcs.map((arc) => (
              <circle
                key={arc.index}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth={hoveredIndex === arc.index ? hoverStrokeWidth : strokeWidth}
                strokeDasharray={arc.dashArray}
                strokeDashoffset="0"
                strokeLinecap="butt"
                transform={`rotate(${arc.rotation} ${cx} ${cy})`}
                style={{
                  cursor: 'pointer',
                  transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                  opacity: hoveredIndex !== null && hoveredIndex !== arc.index ? 0.5 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(arc.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSegmentClick && onSegmentClick(arc)}
              />
            ))}
            {/* Center text */}
            <text x={cx} y={cy - 8} textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="600" fontFamily="inherit">
              {centerLabel || 'Total'}
            </text>
            <text x={cx} y={cy + 18} textAnchor="middle" fill="#0f172a" fontSize="30" fontWeight="800" fontFamily="inherit">
              {total}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          {arcs.map((arc) => {
            const pct = total > 0 ? Math.round((arc.count / total) * 100) : 0;
            return (
              <div
                key={arc.index}
                className={`donut-legend-item ${hoveredIndex === arc.index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredIndex(arc.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSegmentClick && onSegmentClick(arc)}
              >
                <div className="donut-legend-dot" style={{ background: arc.color }}></div>
                <span className="donut-legend-label">{arc.label} ({arc.count})</span>
                <span className="donut-legend-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ==================== DETAIL VIEW PAGE ==================== */
const DetailView = ({ title, type, segments, allRecords, initialActiveTab, columns, onBack, onRowClick }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'All');

  const tabs = [
    { label: 'All', count: allRecords.length, records: allRecords },
    ...segments
  ];

  const activeTabData = tabs.find(t => t.label === activeTab)?.records || [];

  return (
    <div className="vendor-detail-page">
      <div className="vendor-dashboard-header" style={{ marginBottom: 16 }}>
        <div>
          <button 
            onClick={onBack}
            style={{ 
              background: 'none', border: 'none', color: '#2563eb', 
              cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: 600, 
              display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8
            }}
          >
            ← Back to Overview
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#0f172a' }}>
            {title}
          </h1>
        </div>
      </div>

      {/* Top Filter Tabs */}
      <div className="vendor-detail-tabs">
        {tabs.map(tab => (
          <div 
            key={tab.label}
            className={`vendor-detail-tab ${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            <span>{tab.label}</span>
            <span className="vendor-tab-badge">{tab.count}</span>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="vendor-section-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
        <div style={{ overflowX: 'auto' }}>
          {activeTabData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No records found</div>
          ) : (
            <table className="vendor-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col.key} style={{ width: col.width }}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeTabData.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    onClick={() => onRowClick && onRowClick(item)}
                    className="donut-detail-row"
                  >
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(item) : (item[col.key] || 'N/A')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==================== MAIN DASHBOARD ==================== */
const VendorPortalDashboard = () => {
  const [dbEmpList, setDbEmpList] = useState([]);
  const [jobRequests, setJobRequests] = useState([]);
  const [leavesData, setLeavesData] = useState([]);
  const [hrCases, setHrCases] = useState([]);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'onboarding-detail', 'offboarding-detail', 'employee-detail'
  const [activeTab, setActiveTab] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDbEmployees();
    fetchJobRequests();
    fetchLeaves();
    fetchHrCases();
  }, []);

  const fetchDbEmployees = async () => {
    try {
      const res = await fetchApiData("/api/employees");
      setDbEmpList(res.data || []);
    } catch (err) {
      console.error("Error loading employees in vendor dashboard:", err);
    }
  };

  const fetchJobRequests = async () => {
    try {
      const res = await fetchApiData("/api/jobrequests");
      setJobRequests(res.data || []);
    } catch (err) {
      console.error("Error loading job requests:", err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetchApiData("/api/leaves");
      setLeavesData(res.data || []);
    } catch (err) {
      console.error("Error loading leaves in vendor dashboard:", err);
    }
  };

  const fetchHrCases = async () => {
    try {
      const res = await fetchApiData("/api/hrrequests");
      setHrCases(res.data || []);
    } catch (err) {
      console.error("Error loading HR cases in vendor dashboard:", err);
    }
  };

  // ---- Employee calculations ----
  const employees = dbEmpList.map((emp, index) => {
    const isActive = emp.accountActive !== undefined 
      ? Boolean(emp.accountActive) 
      : emp.accountEnabled !== undefined 
      ? Boolean(emp.accountEnabled) 
      : emp.status ? emp.status.toLowerCase() === "active" : true;

    return {
      id: emp.employeeId || `EMP-${index + 101}`,
      name: emp.displayName || emp.employeeName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unnamed Employee",
      title: emp.jobTitle || emp.position || "Employee",
      dept: emp.department || "General",
      email: emp.email || emp.workEmail || "N/A",
      status: isActive ? "Active" : "Inactive",
    };
  });

  const activeEmployeesCount = employees.filter((e) => e.status === "Active").length;
  const activeEmployeesPct = employees.length > 0 ? ((activeEmployeesCount / employees.length) * 100).toFixed(0) : "0";

  // ---- Departments ----
  const departmentsList = [...new Set(employees.map(e => e.dept).filter(Boolean))];

  // ---- On Leave Today (real from /api/leaves) ----
  const todayStr = new Date().toISOString().split('T')[0];
  const onLeaveTodayList = leavesData.filter(l => {
    const status = (l.status || '').toLowerCase();
    const isActive = status === 'approved' || status === 'pending';
    const start = (l.startDate || '').slice(0, 10);
    const end = (l.endDate || l.startDate || '').slice(0, 10);
    return isActive && start <= todayStr && end >= todayStr;
  });
  const onLeaveTodayCount = onLeaveTodayList.length;

  // ---- Onboarding / Offboarding data classification ----
  const onboardingRecords = jobRequests.filter(
    (item) =>
      item.category !== "Offboarding" &&
      item.category !== "offboarding" &&
      item.category !== "Exit" &&
      item.taskType !== "IT Clearance"
  );

  const offboardingRecords = jobRequests.filter(
    (item) =>
      item.category === "Offboarding" ||
      item.category === "offboarding" ||
      item.category === "Exit" ||
      item.taskType === "IT Clearance"
  );

  // ---- Onboarding segments ----
  const onbPending = onboardingRecords.filter(
    (r) => {
      const s = (r.status || "").toLowerCase();
      return s === "pending" || s === "open";
    }
  );
  const onbInProgress = onboardingRecords.filter(
    (r) => {
      const s = (r.status || "").toLowerCase();
      return s === "interview" || s === "offer letter" || s === "offerletter" || s === "pre-joining" || s === "pre joining" || s === "work in progress" || s === "wip";
    }
  );
  const onbCompleted = onboardingRecords.filter(
    (r) => {
      const s = (r.status || "").toLowerCase();
      return s === "resolved" || s === "closed" || s === "employee save";
    }
  );
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const onbJoiningThisMonth = onboardingRecords.filter((r) => {
    const dateStr = r.joiningDate || r.startDate || r.createdAt;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const onboardingSegments = [
    { label: 'Pending', count: onbPending.length, color: '#ef4444', records: onbPending },
    { label: 'In Progress', count: onbInProgress.length, color: '#f59e0b', records: onbInProgress },
    { label: 'Completed', count: onbCompleted.length, color: '#10b981', records: onbCompleted },
    { label: 'Joining This Month', count: onbJoiningThisMonth.length, color: '#3b82f6', records: onbJoiningThisMonth },
  ];

  // ---- Offboarding segments ----
  const offResignations = offboardingRecords.filter((r) => {
    const reason = (r.resignationReason || r.reason || "").toLowerCase();
    const cat = (r.category || "").toLowerCase();
    return reason.includes("resign") || cat === "exit";
  });
  const offTerminations = offboardingRecords.filter((r) => {
    const reason = (r.resignationReason || r.reason || "").toLowerCase();
    return reason.includes("terminat");
  });
  const offNoticePeriod = offboardingRecords.filter((r) => {
    const s = (r.taskStatus || r.status || "").toLowerCase().replace(/\s+/g, "");
    return s === "open" || s === "workinprogress" || s === "wip";
  });
  const offPendingClearance = offboardingRecords.filter((r) => {
    const s = (r.taskStatus || r.status || "").toLowerCase();
    return s === "pending" || s.includes("pending");
  });
  const offCompleted = offboardingRecords.filter((r) => {
    const s = (r.taskStatus || r.status || "").toLowerCase();
    return s === "closed" || s === "resolved";
  });

  const offboardingSegments = [
    { label: 'Resignations', count: offResignations.length, color: '#ef4444', records: offResignations },
    { label: 'Terminations', count: offTerminations.length, color: '#f97316', records: offTerminations },
    { label: 'Notice Period', count: offNoticePeriod.length, color: '#f59e0b', records: offNoticePeriod },
    { label: 'Pending Clearance', count: offPendingClearance.length, color: '#8b5cf6', records: offPendingClearance },
    { label: 'Completed Exits', count: offCompleted.length, color: '#10b981', records: offCompleted },
  ];

  // ---- Onboarding detail columns ----
  const onboardingColumns = [
    { key: 'caseId', label: 'CASE ID', width: '15%' },
    { key: 'requesterName', label: 'REQUESTER', width: '25%' },
    { key: 'department', label: 'DEPARTMENT', width: '20%' },
    { key: 'category', label: 'CATEGORY', width: '20%', render: (item) => item.category || 'Onboarding' },
    { key: 'status', label: 'STATUS', width: '20%', render: (item) => (
      <span className={`vendor-badge ${(item.status || 'Open').toLowerCase().replace(/\s+/g, '-')}`}>
        {item.status || 'Open'}
      </span>
    )},
  ];

  // ---- Offboarding detail columns ----
  const offboardingColumns = [
    { key: 'caseId', label: 'CASE ID', width: '12%', render: (item) => item.caseId || item.taskId || item.jobRequestId || 'N/A' },
    { key: 'requesterName', label: 'REQUESTER', width: '18%', render: (item) => item.requesterName || item.requester || item.name || 'N/A' },
    { key: 'resignationDate', label: 'RESIGNATION DATE', width: '18%', render: (item) => item.resignationDate ? new Date(item.resignationDate).toLocaleDateString() : item.startDate || 'N/A' },
    { key: 'lastWorkingDay', label: 'LAST WORKING DAY', width: '18%', render: (item) => item.lastWorkingDay ? new Date(item.lastWorkingDay).toLocaleDateString() : item.endDate || 'N/A' },
    { key: 'reason', label: 'REASON', width: '18%', render: (item) => item.resignationReason || item.reason || item.description || 'N/A' },
    { key: 'taskStatus', label: 'STATUS', width: '16%', render: (item) => (
      <span className={`vendor-badge ${(item.taskStatus || item.status || 'Open').toLowerCase().replace(/\s+/g, '-')}`}>
        {item.taskStatus || item.ItTAskStatus || item.status || 'Open'}
      </span>
    )},
  ];

  const handleOnboardingSegmentClick = (arc) => {
    setActiveTab(arc ? arc.label : 'All');
    setView('onboarding-detail');
  };

  const handleOffboardingSegmentClick = (arc) => {
    setActiveTab(arc ? arc.label : 'All');
    setView('offboarding-detail');
  };

  const handleDetailRowClick = (item, type) => {
    if (type === 'onboarding') {
      sessionStorage.setItem("onboardingSource", "all");
      navigate(`/employee-request-save/${item._id}?source=all`);
    } else {
      navigate(`/offboarding-saves/${item._id}`);
    }
  };

  // ---- Employee Status segments ----
  const activeEmployees = employees.filter(e => e.status === 'Active');
  const inactiveEmployees = employees.filter(e => e.status !== 'Active');

  const employeeStatusSegments = [
    { label: 'Active', count: activeEmployees.length, color: '#10b981', records: activeEmployees },
    { label: 'Inactive', count: inactiveEmployees.length, color: '#f43f5e', records: inactiveEmployees },
  ];

  const handleEmployeeStatusClick = (arc) => {
    setActiveTab(arc ? arc.label : 'All');
    setView('employee-detail');
  };

  // ---- Employee Status detail columns ----
  const employeeColumns = [
    { key: 'id', label: 'EMPLOYEE ID', width: '15%' },
    { key: 'name', label: 'NAME', width: '25%' },
    { key: 'dept', label: 'DEPARTMENT', width: '20%' },
    { key: 'title', label: 'TITLE', width: '20%' },
    { key: 'email', label: 'EMAIL', width: '20%' },
    { key: 'status', label: 'STATUS', width: '10%', render: (item) => (
      <span style={{
        display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
        borderRadius: 99, fontSize: 12, fontWeight: 600,
        background: item.status === 'Active' ? '#dcfce7' : '#fee2e2',
        color: item.status === 'Active' ? '#16a34a' : '#dc2626',
      }}>{item.status}</span>
    )},
  ];

  // ---- Cases by Status (real from /api/hrrequests) ----
  const STATUS_DEFS = [
    { label: 'Open',                  color: '#3b82f6' },
    { label: 'Vendor Action Pending', color: '#f59e0b' },
    { label: 'Work In Progress',      color: '#8b5cf6' },
    { label: 'Resolved',              color: '#10b981' },
    { label: 'Closed',                color: '#ef4444' },
  ];

  const casesByStatusSegments = STATUS_DEFS.map(def => ({
    label: def.label,
    color: def.color,
    count: hrCases.filter(c => (c.status || 'Open') === def.label).length,
  })).filter(seg => seg.count > 0);

  const handleCaseStatusClick = (arc) => {
    if (!arc) return;
    navigate(`/vendor-portal/cases/list/status:${arc.label}`);
  };



  // ---- Leave Trends Chart (kept from original) ----
  const LeaveTrendsChart = () => {
    const W = 520; const H = 240;
    const padL = 40; const padR = 20; const padT = 40; const padB = 40;
    const yTicks = [0, 1, 2, 3, 4];
    const xLabels = ['10-08-2026', '11-08-2026', '12-08-2026', '13-08-2026', '14-08-2026', '15-08-2026'];
    const dataPoints = [
      { x: 40, y: 120, val: 2 },
      { x: 132, y: 120, val: 2 },
      { x: 224, y: 120, val: 2 },
      { x: 316, y: 120, val: 2 },
      { x: 408, y: 80, val: 3 },
      { x: 500, y: 120, val: 2 },
    ];
    
    const pathStr = `M 40 120 L 132 120 L 224 120 L 316 120 C 362 120, 362 80, 408 80 C 454 80, 454 120, 500 120`;
    const areaStr = `${pathStr} L 500 200 L 40 200 Z`;

    return (
      <div style={{ width: '100%', overflowX: 'auto', marginTop: 20 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ minWidth: 600, width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="leaveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {yTicks.map(t => {
            const y = (200) - (t / 4) * (160);
            return (
              <g key={t}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <text x={padL - 12} y={y + 4} textAnchor="end" fontSize="12" fill="#94a3b8" fontWeight="500">{t}</text>
              </g>
            );
          })}

          <path d={areaStr} fill="url(#leaveGrad)" />
          <path d={pathStr} fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {dataPoints.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
              <circle cx={pt.x} cy={pt.y} r="2" fill="#3b82f6" />
            </g>
          ))}

          {xLabels.map((lbl, i) => {
            const x = padL + i * ((W - padL - padR) / (xLabels.length - 1));
            return (
              <text key={i} x={x} y={H - 10} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="500">{lbl}</text>
            );
          })}
        </svg>
      </div>
    );
  };

  if (view === 'onboarding-detail') {
    return (
      <div className="vendor-dashboard-wrapper">
        <DetailView
          title="Onboarding Details"
          type="onboarding"
          segments={onboardingSegments}
          allRecords={onboardingRecords}
          initialActiveTab={activeTab}
          columns={onboardingColumns}
          onBack={() => setView('dashboard')}
          onRowClick={(item) => handleDetailRowClick(item, 'onboarding')}
        />
      </div>
    );
  }

  if (view === 'offboarding-detail') {
    return (
      <div className="vendor-dashboard-wrapper">
        <DetailView
          title="Offboarding Details"
          type="offboarding"
          segments={offboardingSegments}
          allRecords={offboardingRecords}
          initialActiveTab={activeTab}
          columns={offboardingColumns}
          onBack={() => setView('dashboard')}
          onRowClick={(item) => handleDetailRowClick(item, 'offboarding')}
        />
      </div>
    );
  }

  if (view === 'employee-detail') {
    return (
      <div className="vendor-dashboard-wrapper">
        <DetailView
          title="Employee Status"
          type="employee"
          segments={employeeStatusSegments}
          allRecords={employees}
          initialActiveTab={activeTab}
          columns={employeeColumns}
          onBack={() => setView('dashboard')}
          onRowClick={null}
        />
      </div>
    );
  }

  return (
    <div className="vendor-dashboard-wrapper">
      {/* Header */}
      <div className="vendor-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#0f172a' }}>Overview</h1>
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPIs */}
      <div className="vendor-grid-kpi" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>

        {/* Total Employees */}
        <div
          className="vendor-kpi-card"
          onClick={() => navigate('/vendor-portal/employees/list/total')}
          style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(239,68,68,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
        >
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#ef4444', background: '#fee2e2' }}>
            <FiUsers />
          </div>
          <div className="vendor-kpi-label">TOTAL EMPLOYEES</div>
          <div className="vendor-kpi-value">{employees.length}</div>
          <div className="vendor-kpi-footer">Click to view all employees</div>
        </div>

        {/* Active Employees */}
        <div
          className="vendor-kpi-card"
          onClick={() => { setActiveTab('Active'); setView('employee-detail'); }}
          style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
        >
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#10b981', background: '#d1fae5' }}>
            <FiUserCheck />
          </div>
          <div className="vendor-kpi-label">ACTIVE EMPLOYEES</div>
          <div className="vendor-kpi-value">{activeEmployeesCount}</div>
          <div className="vendor-kpi-badge" style={{ background: '#dcfce7', color: '#16a34a' }}>{activeEmployeesPct}% of total</div>
        </div>

        {/* On Leave Today */}
        <div
          className="vendor-kpi-card"
          onClick={() => navigate('/vendor-portal/leave')}
          style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
        >
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#f59e0b', background: '#fef3c7' }}>
            <FiCalendar />
          </div>
          <div className="vendor-kpi-label">ON LEAVE TODAY</div>
          <div className="vendor-kpi-value">{onLeaveTodayCount}</div>
          {onLeaveTodayCount > 0
            ? <div className="vendor-kpi-badge" style={{ background: '#fef3c7', color: '#d97706' }}>{onLeaveTodayCount} active {onLeaveTodayCount === 1 ? 'leave' : 'leaves'}</div>
            : <div className="vendor-kpi-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>No active leaves</div>
          }
        </div>

        {/* Departments */}
        <div
          className="vendor-kpi-card"
          onClick={() => navigate('/vendor-portal/employees/list/total')}
          style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
        >
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#8b5cf6', background: '#ede9fe' }}>
            <FiBriefcase />
          </div>
          <div className="vendor-kpi-label">DEPARTMENTS</div>
          <div className="vendor-kpi-value">{departmentsList.length}</div>
          <div className="vendor-kpi-footer">In organization</div>
        </div>

      </div>


      {/* Onboarding & Offboarding Donut Charts */}
      <div className="vendor-grid-main" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <DonutChart
          title="Onboarding"
          subtitle="Employee onboarding status overview"
          segments={onboardingSegments}
          total={onboardingRecords.length}
          centerLabel="Total"
          onSegmentClick={handleOnboardingSegmentClick}
        />
        <DonutChart
          title="Offboarding"
          subtitle="Employee offboarding status overview"
          segments={offboardingSegments}
          total={offboardingRecords.length}
          centerLabel="Total"
          onSegmentClick={handleOffboardingSegmentClick}
        />
      </div>

      {/* Middle Grid — Leave Trends + Employee Status */}
      <div className="vendor-grid-main">
        {/* Leave Trends Chart Card */}
        <div className="vendor-section-card" style={{ marginBottom: 0, position: 'relative', overflow: 'hidden', padding: '24px 32px' }}>
          <div className="vendor-section-header" style={{ alignItems: 'flex-start' }}>
            <div>
              <h2 className="vendor-section-title" style={{ fontSize: 18, color: '#0f172a' }}>Leave Trends</h2>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: 500 }}>Daily leaves — current week</p>
            </div>
          </div>
          <LeaveTrendsChart />
        </div>

        {/* Employee Status — now a DonutChart matching Onboarding/Offboarding */}
        <DonutChart
          title="Employee Status"
          subtitle="Active vs Inactive employees"
          segments={employeeStatusSegments}
          total={employees.length}
          centerLabel="Total"
          onSegmentClick={handleEmployeeStatusClick}
        />
      </div>

      {/* Cases by Status — real from /api/hrrequests */}
      <div className="vendor-grid-main" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <DonutChart
          title="Cases by Status"
          subtitle="HR case distribution by current status"
          segments={casesByStatusSegments.length > 0 ? casesByStatusSegments : [{ label: 'No Cases', count: 1, color: '#e2e8f0' }]}
          total={hrCases.length}
          centerLabel="Total Cases"
          onSegmentClick={casesByStatusSegments.length > 0 ? handleCaseStatusClick : null}
        />
      </div>
    </div>
  );
};

export default VendorPortalDashboard;
