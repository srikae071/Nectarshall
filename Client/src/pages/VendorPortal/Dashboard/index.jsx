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

const VendorPortalDashboard = () => {
  const { kpis, pipeline, chart, vacancies, interviews, activities } = mockVendorData;
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);
  const [dbEmpList, setDbEmpList] = useState([]);
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

  const employees = dbEmpList.map((emp, index) => ({
    id: emp.employeeId || `EMP-${index + 101}`,
    name: emp.displayName || emp.employeeName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unnamed Employee",
    title: emp.jobTitle || "Employee",
    dept: emp.department || "General",
    status: emp.accountEnabled !== false ? "Active" : "Inactive",
  }));

  const LeaveTrendsChart = () => {
    const W = 520; const H = 240;
    const padL = 40; const padR = 20; const padT = 40; const padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padB - padT;
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
    
    // Smooth path
    const pathStr = `M 40 120 L 132 120 L 224 120 L 316 120 C 362 120, 362 80, 408 80 C 454 80, 454 120, 500 120`;
    const areaStr = `${pathStr} L 500 200 L 40 200 Z`;

    return (
      <div style={{ width: '100%', overflowX: 'auto', marginTop: 20 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ minWidth: 600, width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y labels */}
          {yTicks.map(t => {
            const y = padT + chartH - (t / 4) * chartH;
            return (
              <g key={t}>
                <line x1={padL} y1={y} x2={W} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5,5" />
                <text x={padL - 12} y={y + 4} textAnchor="end" fontSize="12" fill="#64748b" fontFamily="inherit">{t}</text>
              </g>
            );
          })}

          {/* Area & Line */}
          <path d={areaStr} fill="url(#purpleGrad)" />
          <path d={pathStr} fill="none" stroke="#3b82f6" strokeWidth="3" />

          {/* X labels & Points */}
          {dataPoints.map((pt, i) => (
            <g key={i}>
              <text x={pt.x} y={H - 12} textAnchor="middle" fontSize="12" fill="#475569" fontFamily="inherit">
                {xLabels[i]}
              </text>
              <circle cx={pt.x} cy={pt.y} r="10" fill="#3b82f6" />
              <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="bold" fontFamily="inherit">
                {pt.val}
              </text>
            </g>
          ))}
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
      {/* KPIs */}
      {/* Services Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: FiMessageSquare, label: 'Case Management', sub: 'View & manage cases', path: '/vendor-portal/cases', color: '#3b82f6' },
          { icon: FiCalendar, label: 'Leave Management', sub: 'Manage leave requests', path: '/vendor-portal/leave', color: '#10b981' },
          { icon: FiUsers, label: 'Employee Directory', sub: 'View employee profiles', path: '/vendor-portal/employees', color: '#8b5cf6' },
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
          <div className="vendor-kpi-footer">Click to view list</div>
        </div>

        <div className="vendor-kpi-card">
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#10b981', background: '#d1fae5' }}>
            <FiUserCheck />
          </div>
          <div className="vendor-kpi-label">PRESENT TODAY</div>
          <div className="vendor-kpi-value">19</div>
          <div className="vendor-kpi-badge" style={{ background: '#fef3c7', color: '#d97706' }}>10.7% rate</div>
        </div>

        <div className="vendor-kpi-card">
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#f59e0b', background: '#fef3c7' }}>
            <FiCalendar />
          </div>
          <div className="vendor-kpi-label">ON LEAVE</div>
          <div className="vendor-kpi-value">2</div>
          <div className="vendor-kpi-badge" style={{ background: '#fef3c7', color: '#d97706' }}>10 pending</div>
        </div>

        <div className="vendor-kpi-card">
          <div className="vendor-kpi-bg-circle"></div>
          <div className="vendor-kpi-icon-container" style={{ color: '#8b5cf6', background: '#ede9fe' }}>
            <FiBriefcase />
          </div>
          <div className="vendor-kpi-label">OPEN RECRUITMENTS</div>
          <div className="vendor-kpi-value">2</div>
          <div className="vendor-kpi-footer">Active hiring</div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="vendor-grid-main">
        {/* Chart Card */}
        {/* Chart Card */}
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
            const [empHover, setEmpHover] = React.useState(null);
            const centerLabel = empHover === 'active' ? 'Active' : empHover === 'inactive' ? 'In-Active' : 'Total';
            const centerValue = empHover === 'active' ? activeCount : empHover === 'inactive' ? inactiveCount : totalCount;
            return (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Outer Ring - Active (green) */}
                  <circle
                    cx="100" cy="100" r="70"
                    fill="none"
                    stroke={empHover === 'active' ? '#059669' : '#10b981'}
                    strokeWidth={empHover === 'active' ? 22 : 18}
                    style={{ cursor: 'pointer', transition: 'stroke-width 0.2s, stroke 0.2s' }}
                    onMouseEnter={() => setEmpHover('active')}
                    onMouseLeave={() => setEmpHover(null)}
                  />
                  {/* Inner Ring */}
                  <circle cx="100" cy="100" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  {/* Dot - Inactive (red) */}
                  <circle
                    cx="100" cy="50" r={empHover === 'inactive' ? 10 : 7}
                    fill={empHover === 'inactive' ? '#e11d48' : '#f43f5e'}
                    style={{ cursor: 'pointer', transition: 'r 0.2s, fill 0.2s' }}
                    onMouseEnter={() => setEmpHover('inactive')}
                    onMouseLeave={() => setEmpHover(null)}
                  />
                  {/* Center Label */}
                  <text x="100" y="95" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="600" fontFamily="inherit">{centerLabel}</text>
                  <text x="100" y="122" textAnchor="middle" fill="#1e293b" fontSize="28" fontWeight="bold" fontFamily="inherit">{centerValue}</text>
                </svg>

                {/* Legend */}
                <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></div>
                    <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>Active ({activeCount})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f43f5e' }}></div>
                    <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>In-Active ({inactiveCount})</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="vendor-grid-main">
        {/* Vacancies Table (Shifted from Top Right to Bottom Left) */}
        <div className="vendor-section-card" style={{ marginBottom: 0 }}>
          <div className="vendor-section-header">
            <h2 className="vendor-section-title">Open Vacancies</h2>
            <button className="vendor-view-all-btn">View All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="vendor-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th style={{ textAlign: 'center' }}>Open</th>
                  <th style={{ textAlign: 'center' }}>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((v) => (
                  <tr key={v.id}>
                    <td>{v.position}</td>
                    <td style={{ textAlign: 'center' }}>{v.openings}</td>
                    <td style={{ textAlign: 'center' }}>{v.submitted}</td>
                    <td><span className={`vendor-badge ${getStatusClass(v.status)}`}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity */}
        <div className="vendor-section-card" style={{ marginBottom: 0 }}>
          <div className="vendor-section-header">
            <h2 className="vendor-section-title">Recent Activity</h2>
            <button className="vendor-view-all-btn">View All</button>
          </div>
          <div>
            {activities.map((activity) => (
              <div className="vendor-list-item" key={activity.id}>
                <div className={`vendor-activity-icon activity-${activity.type}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="vendor-list-content">
                  <h4 className="vendor-list-title">{activity.title}</h4>
                </div>
                <div className="vendor-activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="vendor-grid-main">
        {/* Leave by Department Donut */}
        <div className="vendor-section-card" style={{ marginBottom: 0, position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="vendor-section-header" style={{ alignItems: 'flex-start', paddingBottom: 0 }}>
            <div>
              <h2 className="vendor-section-title" style={{ fontSize: 18, color: '#0f172a' }}>Leave by Department</h2>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Department-wise leave requests</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 20, flex: 1 }}>
            <svg viewBox="-110 -110 220 220" style={{ width: '100%', maxWidth: 280, height: 'auto', transform: 'rotate(-90deg)' }}>
              {/* C = 2 * pi * 75 = 471.24 */}
              <circle r="75" fill="none" stroke="#3b82f6" strokeWidth="30" strokeDasharray="136.3 471.24" strokeDashoffset="0" onMouseEnter={() => setHoveredDept({ name: 'Engineering', count: 5 })} onMouseLeave={() => setHoveredDept(null)} style={{ cursor: 'pointer' }} />
              <circle r="75" fill="none" stroke="#f43f5e" strokeWidth="30" strokeDasharray="89.2 471.24" strokeDashoffset="-141.3" onMouseEnter={() => setHoveredDept({ name: 'Sales', count: 4 })} onMouseLeave={() => setHoveredDept(null)} style={{ cursor: 'pointer' }} />
              <circle r="75" fill="none" stroke="#8b5cf6" strokeWidth="30" strokeDasharray="160 471.24" strokeDashoffset="-235.5" onMouseEnter={() => setHoveredDept({ name: 'HR', count: 6 })} onMouseLeave={() => setHoveredDept(null)} style={{ cursor: 'pointer' }} />
              <circle r="75" fill="none" stroke="#f59e0b" strokeWidth="30" strokeDasharray="18.5 471.24" strokeDashoffset="-400.5" onMouseEnter={() => setHoveredDept({ name: 'Marketing', count: 1 })} onMouseLeave={() => setHoveredDept(null)} style={{ cursor: 'pointer' }} />
              <circle r="75" fill="none" stroke="#10b981" strokeWidth="30" strokeDasharray="42.1 471.24" strokeDashoffset="-424.0" onMouseEnter={() => setHoveredDept({ name: 'Finance', count: 3 })} onMouseLeave={() => setHoveredDept(null)} style={{ cursor: 'pointer' }} />
              
              <text x="0" y="6" textAnchor="middle" fill="#64748b" fontSize="15" fontWeight="600" transform="rotate(90)">{hoveredDept ? hoveredDept.name : 'Total'}</text>
              <text x="0" y="34" textAnchor="middle" fill="#1e293b" fontSize="32" fontWeight="bold" transform="rotate(90)">{hoveredDept ? hoveredDept.count : 19}</text>
            </svg>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: 10, paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }}></div><span style={{ fontSize: 14, color: '#475569' }}>Engineering</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }}></div><span style={{ fontSize: 14, color: '#475569' }}>Sales</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8b5cf6' }}></div><span style={{ fontSize: 14, color: '#475569' }}>Human Resources</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></div><span style={{ fontSize: 14, color: '#475569' }}>Marketing</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></div><span style={{ fontSize: 14, color: '#475569' }}>Finance</span></div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="vendor-section-card" style={{ marginBottom: 0 }}>
          <div className="vendor-section-header" style={{ paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
            <h2 className="vendor-section-title" style={{ fontSize: 18, color: '#0f172a', fontWeight: 'bold' }}>Announcements</h2>
            <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', padding: 0 }}>+</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 8 }}>
            {[
              { title: 'Employee Referral Program — Earn Referral Bonuses', date: 'Aug 11, 2026', expires: 'Expires Nov 12', active: false },
              { title: 'Scheduled IT Infrastructure Maintenance', date: 'Aug 10, 2026', expires: 'Expires Aug 28', active: true },
              { title: 'Company Family Day — September 07, 2026', date: 'Aug 09, 2026', expires: 'Expires Sep 07', active: false },
              { title: 'Updated Work-From-Home Policy — Effective September 1, 2026', date: 'Aug 08, 2026', expires: 'Expires Oct 13', active: false },
              { title: 'Employee of the Month — August 2026', date: 'Aug 07, 2026', expires: 'Expires Sep 13', active: false },
              { title: 'Compensation Review Cycle — August Payroll', date: 'Aug 05, 2026', expires: 'Expires Sep 05', active: false }
            ].map((item, index, arr) => (
              <div key={index} style={{ 
                padding: '12px 16px', 
                borderBottom: (!item.active && index !== arr.length - 1 && !(arr[index+1]?.active)) ? '1px solid #f8fafc' : 'none',
                background: item.active ? '#f8fafc' : 'transparent',
                borderRadius: item.active ? 12 : 0,
                marginTop: item.active ? 4 : 0,
                marginBottom: item.active ? 4 : 0
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{item.date}</span>
                  <span style={{ 
                    background: '#fff7ed', color: '#d97706', fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 4
                  }}>
                    {item.expires}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* On Leave Today & Spacer Row */}
      <div className="vendor-grid-main">
        {/* On Leave Today */}
        <div className="vendor-section-card" style={{ marginBottom: 0 }}>
          <div className="vendor-section-header" style={{ paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
            <h2 className="vendor-section-title" style={{ fontSize: 18, color: '#0f172a', fontWeight: 'bold' }}>On Leave Today</h2>
            <a href="#" style={{ color: '#ef4444', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>View all</a>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { initials: 'CM', name: 'Chloe Morgan', type: 'Casual Leave', dateRange: 'Aug 14', days: '1d', color: '#3b82f6' },
              { initials: 'EG', name: 'Ethan Gonzalez', type: 'Casual Leave', dateRange: 'Aug 01 – Aug 31', days: '23d', color: '#a855f7' },
              { initials: 'SM', name: 'Sebastian Mitchell', type: 'Casual Leave', dateRange: 'Aug 01 – Aug 31', days: '23d', color: '#22c55e' }
            ].map((person, index, arr) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px 0', 
                borderBottom: index !== arr.length - 1 ? '1px solid #f8fafc' : 'none' 
              }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: '50%', background: person.color, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: '#fff', fontSize: 15, fontWeight: 500, flexShrink: 0 
                }}>
                  {person.initials}
                </div>
                
                <div style={{ marginLeft: 16, flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{person.name}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{person.type}</div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{person.dateRange}</div>
                  <div style={{ 
                    display: 'inline-block', background: '#dcfce7', color: '#16a34a', 
                    fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 4, marginTop: 4 
                  }}>
                    {person.days}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        

      </div>




      {/* Modal */}
      {selectedInterview && (
        <div className="vendor-modal-overlay" onClick={() => setSelectedInterview(null)}>
          <div className="vendor-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="vendor-modal-header">
              <div className="vendor-modal-title">Details</div>
              <div className="vendor-modal-header-actions">
                <button className="vendor-modal-header-btn red"><FiChevronLeft /></button>
                <button className="vendor-modal-header-btn red"><FiChevronRight /></button>
                <button className="vendor-modal-header-btn close" onClick={() => setSelectedInterview(null)}><FiX /></button>
              </div>
            </div>
            
            <div className="vendor-modal-body">
              <div className="vendor-modal-profile">
                <div className="vendor-modal-avatar" style={{ 
                  background: selectedInterview.color === 'purple' ? '#7e22ce' : selectedInterview.color === 'pink' ? '#be185d' : '#15803d'
                }}>
                  {selectedInterview.initials}
                </div>
                <div className="vendor-modal-profile-info">
                  <div className="vendor-modal-name">
                    {selectedInterview.name} <FiArrowUpRight color="#ef4444" size={14} />
                  </div>
                  <div className="vendor-modal-subtitle">
                    {selectedInterview.position}
                  </div>
                </div>
              </div>

              <div className="vendor-modal-details-grid">
                {selectedInterview.details && Object.entries(selectedInterview.details).map(([key, value]) => (
                  <div className="vendor-modal-detail-item" key={key}>
                    <div className="vendor-modal-detail-label">{key}</div>
                    <div className="vendor-modal-detail-colon">:</div>
                    <div className="vendor-modal-detail-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="vendor-modal-footer">
              <button className="vendor-modal-btn edit"><FiEdit /> Edit</button>
              <button className="vendor-modal-btn approve"><FiCheck /> Approve</button>
              <button className="vendor-modal-btn delete"><FiTrash2 /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPortalDashboard;
