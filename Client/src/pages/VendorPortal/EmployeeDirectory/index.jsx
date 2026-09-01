import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchApiData } from '../../../utils/apiClient';
import { 
  FiSearch, FiX, FiMail, FiMapPin, FiUsers, FiUserCheck, 
  FiBriefcase, FiUserPlus, FiMoreHorizontal, FiDownload 
} from 'react-icons/fi';
import '../Dashboard/index.css';

export const ALL_EMP_COLUMNS = [
  { key: 'name', label: 'EMPLOYEE', width: '22%' },
  { key: 'title', label: 'TITLE / POSITION', width: '18%' },
  { key: 'dept', label: 'DEPARTMENT', width: '15%' },
  { key: 'email', label: 'EMAIL', width: '18%' },
  { key: 'location', label: 'LOCATION', width: '12%' },
  { key: 'status', label: 'STATUS', width: '10%' },
  { key: 'action', label: 'ACTION', width: '5%' },
];

export const EmpDrawer = ({ emp, onClose }) => (
  <>
    <div className="po-overlay" onClick={onClose} />
    <div className="po-drawer">
      <div className="po-drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: emp.color || '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{emp.initials}</div>
          <div>
            <div className="po-drawer-id" style={{ marginBottom: 2 }}>{emp.name}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{emp.title}</div>
          </div>
        </div>
        <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
      </div>
      <div className="po-drawer-body">
        <div className="po-info-grid">
          <div className="po-info-item"><span>Employee ID</span><strong>{emp.id}</strong></div>
          <div className="po-info-item"><span>Department</span><strong>{emp.dept}</strong></div>
          <div className="po-info-item"><span>Location</span><strong><FiMapPin size={11} style={{ marginRight: 4 }} />{emp.location}</strong></div>
          <div className="po-info-item"><span>Joining Date</span><strong>{emp.joiningDate}</strong></div>
          <div className="po-info-item"><span>Status</span><strong><span className="po-status-badge" style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>{emp.status}</span></strong></div>
          <div className="po-info-item" style={{ gridColumn: '1/-1' }}><span>Email</span><strong>{emp.email}</strong></div>
        </div>
      </div>
      <div className="po-drawer-footer">
        <button className="po-btn po-btn-ghost" onClick={onClose}>Close</button>
        <button className="po-btn po-btn-primary" onClick={() => { window.location.href = `mailto:${emp.email}`; }}>
          <FiMail /> Send Email
        </button>
      </div>
    </div>
  </>
);


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
            ← Back to Employee Management
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

/* ==================== MAIN COMPONENT ==================== */
const VendorEmployeeDirectory = () => {
  const navigate = useNavigate();
  const [dbEmployees, setDbEmployees] = useState([]);
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('directory'); // 'directory', 'onboarding-detail', 'offboarding-detail'
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchEmployees();
    fetchJobRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/employees");
      const emps = (res.data || []).map((emp, index) => {
        const name = emp.displayName || emp.employeeName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unnamed Employee";
        const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "EP";
        const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ea4104', '#059669', '#0284c7'];
        const isActive = emp.accountActive !== undefined 
          ? Boolean(emp.accountActive) 
          : emp.accountEnabled !== undefined 
          ? Boolean(emp.accountEnabled) 
          : emp.status ? emp.status.toLowerCase() === "active" : true;

        return {
          id: emp.employeeId || `EMP-${index + 101}`,
          name: name,
          title: emp.jobTitle || emp.position || "Employee",
          dept: emp.department || "General",
          email: emp.email || emp.workEmail || "N/A",
          location: emp.officeLocation || emp.place || emp.city || "Head Office",
          status: isActive ? "Active" : "Inactive",
          joiningDate: emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "N/A",
          initials: initials,
          color: colors[index % colors.length]
        };
      });
      setDbEmployees(emps);
    } catch (err) {
      console.error("Error loading employees in directory:", err);
    } finally {
      setLoading(false);
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

  const currentEmployees = dbEmployees;
  const totalEmployees = currentEmployees.length;
  const activeEmployees = currentEmployees.filter(e => e.status === "Active").length;
  const uniqueDepts = [...new Set(currentEmployees.map(e => e.dept))];
  const activePct = totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(1) : '0.0';

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

  if (view === 'onboarding-detail') {
    return (
      <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <DetailView
          title="Onboarding Details"
          type="onboarding"
          segments={onboardingSegments}
          allRecords={onboardingRecords}
          initialActiveTab={activeTab}
          columns={onboardingColumns}
          onBack={() => setView('directory')}
          onRowClick={(item) => handleDetailRowClick(item, 'onboarding')}
        />
      </div>
    );
  }

  if (view === 'offboarding-detail') {
    return (
      <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <DetailView
          title="Offboarding Details"
          type="offboarding"
          segments={offboardingSegments}
          allRecords={offboardingRecords}
          initialActiveTab={activeTab}
          columns={offboardingColumns}
          onBack={() => setView('directory')}
          onRowClick={(item) => handleDetailRowClick(item, 'offboarding')}
        />
      </div>
    );
  }

  return (
    <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Employee Management</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Your key company contacts (Sourced from Employee database)</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {[
          { icon: <FiUsers size={24} color="#3b82f6" />, bg: '#eff6ff', title: 'TOTAL EMPLOYEES', value: totalEmployees, sub: 'All active employees', path: 'total' },
          { icon: <FiUserCheck size={24} color="#10b981" />, bg: '#f0fdf4', title: 'ACTIVE EMPLOYEES', value: activeEmployees, sub: `${activePct}% of total`, subColor: '#10b981', path: 'active' },
          { icon: <FiBriefcase size={24} color="#8b5cf6" />, bg: '#f5f3ff', title: 'DEPARTMENTS', value: uniqueDepts.length, sub: 'In database', path: 'departments' },
          { icon: <FiUserPlus size={24} color="#f59e0b" />, bg: '#fffbeb', title: 'NEW HIRE', value: '0', sub: 'Added this month', path: 'new' }
        ].map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => navigate(`/vendor-portal/employees/list/${kpi.path}`)}
            style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, display: 'flex', alignItems: 'flex-start', gap: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.title}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', margin: '4px 0 2px 0', lineHeight: 1.2 }}>{kpi.value}</div>
              <div style={{ fontSize: 13, color: kpi.subColor || '#94a3b8', fontWeight: kpi.subColor ? 600 : 400 }}>{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>


      {/* Donut Charts Section (Replaces Employee Table) */}
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
    </div>
  );
};

export default VendorEmployeeDirectory;
