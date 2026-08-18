import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApiData } from '../../../utils/apiClient';
import './index.css';
import { 
  FiFileText, 
  FiActivity, 
  FiCheckCircle, 
  FiXCircle, 
  FiBriefcase, 
  FiUserPlus,
  FiCalendar,
  FiBell,
  FiChevronDown,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiEdit,
  FiTrash2,
  FiArrowUpRight,
  FiUsers,
  FiUserCheck,
  FiMessageSquare
} from 'react-icons/fi';
import { mockVendorData } from '../mockData';

const ALL_EMP_COLUMNS = [
  { key: 'name', label: 'EMPLOYEE' },
  { key: 'title', label: 'TITLE / POSITION' },
  { key: 'dept', label: 'DEPARTMENT' },
  { key: 'email', label: 'EMAIL' },
  { key: 'status', label: 'STATUS' },
];

const VendorPortalDashboard = () => {
  const { kpis, pipeline, chart, vacancies, interviews, activities } = mockVendorData;
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);
  const [dbEmpList, setDbEmpList] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(ALL_EMP_COLUMNS.map(c => c.key));

  const navigate = useNavigate();

  useEffect(() => {
    fetchDbEmployees();
  }, []);

  const fetchDbEmployees = async () => {
    try {
      const res = await fetchApiData("/api/employees");
      setDbEmpList(res.data || []);
    } catch (err) {
      console.error("Error loading employees in vendor dashboard:", err);
    }
  };

  const toggleColumn = (key) => {
    if (visibleColumns.includes(key)) {
      if (visibleColumns.length === 1) return;
      setVisibleColumns(visibleColumns.filter(c => c !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  const employees = dbEmpList.map((emp, index) => ({
    id: emp.employeeId || `EMP-${index + 101}`,
    name: emp.displayName || emp.employeeName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unnamed Employee",
    title: emp.jobTitle || emp.position || "Employee",
    dept: emp.department || "General",
    email: emp.email || emp.workEmail || "N/A",
    status: "Active",
  }));

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

  const getActivityIcon = (type) => {
    switch(type) {
      case 'accepted': return <FiCheckCircle />;
      case 'submitted': return <FiBriefcase />;
      case 'invoice': return <FiFileText />;
      case 'rejected': return <FiXCircle />;
      case 'new': return <FiUserPlus />;
      case 'onboarding': return <FiCheckCircle />;
      default: return <FiCheck />;
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="vendor-dashboard-wrapper">
      {/* Header */}
      <div className="vendor-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#0f172a' }}>Dashboard</h1>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 5, fontWeight: 400 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Services Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: FiMessageSquare, label: 'Case Management', sub: 'View & manage cases', path: '/vendor-portal/cases', color: '#3b82f6' },
          { icon: FiCalendar, label: 'Leave Management', sub: 'Manage leave requests', path: '/vendor-portal/leave', color: '#10b981' },
          { icon: FiUsers, label: 'Employee Directory', sub: 'Employee profiles list', path: '/vendor-portal/employees', color: '#8b5cf6' },
          { icon: FiBriefcase, label: 'Training & Dev', sub: 'Explore training programs', path: '/vendor-portal/training', color: '#f59e0b' },
        ].map(({ icon: Icon, label, sub, path, color }) => (
          <div
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
              padding: '16px 18px', cursor: 'pointer',
              transition: 'box-shadow 0.18s, border-color 0.18s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.1)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{sub}</div>
            </div>
            <FiChevronRight size={14} color="#94a3b8" />
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="vendor-grid-kpi" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="vendor-kpi-card" onClick={() => navigate('/vendor-portal/employees/list/total')} style={{ cursor: 'pointer' }}>
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#ef4444', background: '#fee2e2' }}>
            <FiUsers />
          </div>
          <div className="vendor-kpi-label">TOTAL EMPLOYEES</div>
          <div className="vendor-kpi-value">{employees.length}</div>
          <div className="vendor-kpi-footer">Employee database total</div>
        </div>

        <div className="vendor-kpi-card">
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#10b981', background: '#d1fae5' }}>
            <FiUserCheck />
          </div>
          <div className="vendor-kpi-label">ACTIVE EMPLOYEES</div>
          <div className="vendor-kpi-value">{employees.length}</div>
          <div className="vendor-kpi-badge" style={{ background: '#dcfce7', color: '#16a34a' }}>100% active</div>
        </div>

        <div className="vendor-kpi-card">
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#f59e0b', background: '#fef3c7' }}>
            <FiCalendar />
          </div>
          <div className="vendor-kpi-label">ON LEAVE</div>
          <div className="vendor-kpi-value">0</div>
          <div className="vendor-kpi-badge" style={{ background: '#fef3c7', color: '#d97706' }}>No active leaves</div>
        </div>

        <div className="vendor-kpi-card">
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#8b5cf6', background: '#ede9fe' }}>
            <FiBriefcase />
          </div>
          <div className="vendor-kpi-label">DEPARTMENTS</div>
          <div className="vendor-kpi-value">{[...new Set(employees.map(e => e.dept))].length}</div>
          <div className="vendor-kpi-footer">In organization</div>
        </div>
      </div>

      {/* Employee Directory Section in Dashboard */}
      <div className="vendor-section-card" style={{ marginBottom: 24, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 className="vendor-section-title" style={{ fontSize: 18, color: '#0f172a', fontWeight: 700, margin: 0 }}>Employee Directory</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>Sourced directly from Employee database</p>
          </div>
          
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Settings Icon Dropdown Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "15px",
                  color: "#334155",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
                title="Customize Display Columns"
              >
                ⚙️
              </button>

              {showSettings && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    padding: "14px 16px",
                    width: "220px",
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "13px",
                      color: "#0f172a",
                      marginBottom: "10px",
                      borderBottom: "1px solid #e2e8f0",
                      paddingBottom: "6px",
                    }}
                  >
                    ⚙️ Display Columns:
                  </div>

                  {ALL_EMP_COLUMNS.map(col => (
                    <label
                      key={col.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        cursor: "pointer",
                        margin: "6px 0",
                        color: "#334155",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        style={{ cursor: "pointer" }}
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => navigate('/vendor-portal/employees')} className="vendor-view-all-btn">View All</button>
          </div>
        </div>

        {employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No employees found in database.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="vendor-table">
              <thead>
                <tr>
                  {ALL_EMP_COLUMNS.filter(c => visibleColumns.includes(c.key)).map(col => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 6).map((emp) => (
                  <tr key={emp.id}>
                    {visibleColumns.includes('name') && <td style={{ fontWeight: 600, color: '#0f172a' }}>{emp.name}</td>}
                    {visibleColumns.includes('title') && <td>{emp.title}</td>}
                    {visibleColumns.includes('dept') && <td><span className="vendor-badge open">{emp.dept}</span></td>}
                    {visibleColumns.includes('email') && <td>{emp.email}</td>}
                    {visibleColumns.includes('status') && <td><span className="vendor-badge confirmed">{emp.status}</span></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Middle Grid */}
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

        {/* Employee Status */}
        <div className="vendor-section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="vendor-section-header" style={{ alignItems: 'flex-start' }}>
            <div>
              <h2 className="vendor-section-title" style={{ fontSize: 18, color: '#0f172a' }}>Employee Status</h2>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Active vs Inactive</p>
            </div>
          </div>
          {(() => {
            const activeCount = employees.filter(e => e.status === 'Active').length;
            const inactiveCount = employees.filter(e => e.status !== 'Active').length;
            const totalCount = employees.length;
            return (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle
                    cx="100" cy="100" r="70"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="18"
                  />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <text x="100" y="95" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="600" fontFamily="inherit">Active</text>
                  <text x="100" y="122" textAnchor="middle" fill="#1e293b" fontSize="28" fontWeight="bold" fontFamily="inherit">{totalCount}</text>
                </svg>

                <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></div>
                    <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>Active ({activeCount})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f43f5e' }}></div>
                    <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>In-Active (0)</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default VendorPortalDashboard;
