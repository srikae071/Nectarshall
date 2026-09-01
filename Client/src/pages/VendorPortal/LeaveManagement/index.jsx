import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiChevronDown } from 'react-icons/fi';
import { fetchApiData } from '../../../utils/apiClient';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css';

export const today = () => new Date().toISOString().split('T')[0];
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';const ALL_LEAVE_COLUMNS = [
  { key: 'leaveNumber', label: 'Leave ID', width: '12%' },
  { key: 'employeeName', label: 'Employee Name', width: '18%' },
  { key: 'dept', label: 'Department', width: '15%' },
  { key: 'leaveType', label: 'Leave type', width: '13%' },
  { key: 'startDate', label: 'Start date', width: '12%' },
  { key: 'endDate', label: 'End date', width: '12%' },
  { key: 'totalLeaves', label: 'Total leave count', width: '10%' },
  { key: 'status', label: 'Status', width: '10%' },
  { key: 'description', label: 'Reason', width: '14%' },
];

const VendorLeaveManagement = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(ALL_LEAVE_COLUMNS.map(c => c.key));
  const [hoveredType, setHoveredType] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resLeaves, resEmps] = await Promise.allSettled([
        fetchApiData("/api/leaves"),
        fetchApiData("/api/employees")
      ]);

      const rawLeaves = resLeaves.status === 'fulfilled' ? (resLeaves.value.data || []) : [];
      const rawEmps = resEmps.status === 'fulfilled' ? (resEmps.value.data || []) : [];

      // List of employees with names, emails, and departments
      const empList = rawEmps.map((e, idx) => ({
        fullName: (e.displayName || e.employeeName || `${e.firstName || ""} ${e.lastName || ""}`).trim().toLowerCase(),
        firstName: (e.firstName || (e.displayName || e.employeeName || "").split(" ")[0] || "").trim().toLowerCase(),
        email: (e.email || e.workEmail || "").trim().toLowerCase(),
        dept: e.department || e.dept || "General"
      }));

      const deptsSet = new Set();
      empList.forEach(e => { if (e.dept) deptsSet.add(e.dept); });

      const mappedLeaves = rawLeaves.map((l, idx) => {
        const empName = (l.employeeName || l.requester || "Unnamed Employee").trim();
        const empNameLower = empName.toLowerCase();
        const empEmailLower = (l.email || l.workEmail || "").trim().toLowerCase();

        // Enhanced flexible employee matching
        const matchedEmp = empList.find(e => 
          (empEmailLower && e.email === empEmailLower) ||
          e.fullName === empNameLower ||
          (e.firstName && e.firstName === empNameLower) ||
          (empNameLower && e.fullName.includes(empNameLower)) ||
          (empNameLower && empNameLower.includes(e.firstName))
        );

        const matchedDept = 
          l.department || 
          l.dept || 
          (matchedEmp ? matchedEmp.dept : null) || 
          "General";

        if (matchedDept) {
          deptsSet.add(matchedDept);
        }

        return {
          id: l.leaveNumber || `LV-${String(idx + 1).padStart(3, '0')}`,
          employeeName: empName,
          leaveType: l.leaveType || "Casual Leave",
          startDate: l.startDate || today(),
          endDate: l.endDate || today(),
          totalLeaves: Number(l.totalLeaves) || 1,
          status: l.status || "Pending",
          description: l.description || l.comment || "N/A",
          dept: matchedDept,
          initials: empName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        };
      });

      setLeaves(mappedLeaves);
      setDepartmentsList(Array.from(deptsSet).filter(Boolean));
    } catch (err) {
      console.error("Error loading data in VendorLeaveManagement:", err);
    } finally {
      setLoading(false);
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

  const todayStr = today();

  // On Leave Today
  const onLeaveToday = useMemo(() => {
    return leaves.filter(l => {
      const isStatusOk = l.status.toLowerCase() === 'approved' || l.status.toLowerCase() === 'pending';
      return isStatusOk && l.startDate <= todayStr && l.endDate >= todayStr;
    });
  }, [leaves, todayStr]);

  // Upcoming Leaves
  const upcomingLeaves = useMemo(() => {
    return leaves.filter(l => {
      const isStatusOk = l.status.toLowerCase() !== 'rejected';
      return isStatusOk && l.startDate > todayStr;
    });
  }, [leaves, todayStr]);

  // Top Leave Takers
  const topLeaveTakers = useMemo(() => {
    const takerMap = {};
    leaves.forEach(l => {
      const name = l.employeeName || "Employee";
      if (!takerMap[name]) {
        takerMap[name] = { name, requests: 0, days: 0, initials: l.initials };
      }
      takerMap[name].requests += 1;
      takerMap[name].days += l.totalLeaves;
    });
    return Object.values(takerMap).sort((a, b) => b.days - a.days).slice(0, 5);
  }, [leaves]);

  // Leaves filtered by selected department
  const departmentFilteredLeaves = useMemo(() => {
    if (selectedDept === "All") return leaves;
    return leaves.filter(l => (l.dept || "General") === selectedDept);
  }, [leaves, selectedDept]);

  // Leave Utilization (Filtered by selected department for Row 2)
  const utilizationData = useMemo(() => {
    const typeMap = {};
    departmentFilteredLeaves.forEach(l => {
      const type = l.leaveType || "Casual Leave";
      typeMap[type] = (typeMap[type] || 0) + l.totalLeaves;
    });
    const totalDays = departmentFilteredLeaves.reduce((sum, l) => sum + l.totalLeaves, 0) || 1;
    return Object.entries(typeMap).map(([type, days]) => ({
      type,
      days,
      pct: Math.min(100, Math.round((days / totalDays) * 100))
    }));
  }, [departmentFilteredLeaves]);

  // Filter leaves by time range for Leave Types Overview (Row 3)
  const timeFilteredLeaves = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return leaves.filter(l => {
      if (timeFilter === 'all') return true;
      if (!l.startDate) return true;
      const d = new Date(l.startDate);
      if (isNaN(d.getTime())) return true;

      if (timeFilter === 'thisMonth') {
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      }
      if (timeFilter === 'lastMonth') {
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
        return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth();
      }
      if (timeFilter === 'thisYear') {
        return d.getFullYear() === currentYear;
      }
      return true;
    });
  }, [leaves, timeFilter]);

  // Overall Leave Utilization (For Row 3 "Leave Types Overview" - filtered by timeFilter)
  const overallUtilizationData = useMemo(() => {
    const typeMap = {};
    timeFilteredLeaves.forEach(l => {
      const type = l.leaveType || "Casual Leave";
      typeMap[type] = (typeMap[type] || 0) + l.totalLeaves;
    });
    const totalDays = timeFilteredLeaves.reduce((sum, l) => sum + l.totalLeaves, 0) || 1;
    return Object.entries(typeMap).map(([type, days]) => ({
      type,
      days,
      pct: Math.min(100, Math.round((days / totalDays) * 100))
    }));
  }, [timeFilteredLeaves]);


  const filteredLeaves = leaves.filter(l => {
    const q = search.toLowerCase();
    return l.id.toLowerCase().includes(q) || l.employeeName.toLowerCase().includes(q) || l.leaveType.toLowerCase().includes(q);
  });

  if (selectedType) {
    const typeLeaves = leaves.filter(l => 
      l.leaveType === selectedType && (selectedDept === 'All' || l.dept === selectedDept)
    );

    return (
      <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={() => setSelectedType(null)}
            style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
          >
            <FiX size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a' }}>{selectedType}</h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Showing all {selectedType.toLowerCase()} records {selectedDept !== 'All' ? `for ${selectedDept} Department` : ''}</p>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          {typeLeaves.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No leave records found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {ALL_LEAVE_COLUMNS.filter(c => c.key !== 'leaveType').map(c => (
                      <th
                        key={c.key}
                        style={{
                          width: c.width,
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                        }}
                      >
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {typeLeaves.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ width: '12%', padding: 16, fontSize: 13, fontWeight: 700, color: '#ea4104' }}>{l.id}</td>
                      <td style={{ width: '18%', padding: 16, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{l.employeeName}</td>
                      <td style={{ width: '15%', padding: 16 }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, background: '#eff6ff', color: '#2563eb', fontSize: 12, fontWeight: 600 }}>
                          {l.dept}
                        </span>
                      </td>
                      <td style={{ width: '12%', padding: 16, fontSize: 13, color: '#475569' }}>{fmtDate(l.startDate)}</td>
                      <td style={{ width: '12%', padding: 16, fontSize: 13, color: '#475569' }}>{fmtDate(l.endDate)}</td>
                      <td style={{ width: '10%', padding: 16, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{`${l.totalLeaves}d`}</td>
                      <td style={{ width: '10%', padding: 16 }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: l.status.toLowerCase() === 'approved' ? '#f0fdf4' : '#fff7ed', color: l.status.toLowerCase() === 'approved' ? '#16a34a' : '#ea580c' }}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ width: '14%', padding: 16, fontSize: 13, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.description}>{l.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-dashboard-wrapper">
      {/* Header */}
      <div className="vendor-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#0f172a' }}>Leave Management</h1>
          <div style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0 0' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 260 }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={15} />
            <input
              type="text"
              placeholder="Search leaves by employee or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Row 1: Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {/* On Leave Today */}
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', height: 380, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>On Leave Today</h2>
            <span style={{ fontSize: 13, color: '#f43f5e', fontWeight: 600 }}>{onLeaveToday.length} employee(s)</span>
          </div>
          {onLeaveToday.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', paddingTop: 60 }}>No leaves as of now.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {onLeaveToday.map((x, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{x.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{x.employeeName}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{x.leaveType}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{x.startDate} – {x.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Leaves */}
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', height: 380, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Upcoming Leaves</h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>Scheduled</span>
          </div>
          {upcomingLeaves.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', paddingTop: 60 }}>No upcoming leaves.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {upcomingLeaves.map((x, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{x.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{x.employeeName}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{x.leaveType} · {x.startDate}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '3px 8px', borderRadius: 4 }}>{x.totalLeaves}d</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Leave Takers */}
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', height: 380, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Top Leave Takers</h2>
          </div>
          {topLeaveTakers.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', paddingTop: 60 }}>Nobody is there.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {topLeaveTakers.map((x, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ea4104', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{x.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{x.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{x.requests} request(s)</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ea4104' }}>{x.days}d</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Leave Utilization with Department Filter Dropdown */}
      <div style={{ marginBottom: 32 }}>
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Leave Utilization</h2>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, margin: 0 }}>By Leave Type</p>
            </div>

            {/* Department Filter Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                style={{
                  appearance: 'none',
                  padding: '9px 36px 9px 16px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <option value="All">All Departments</option>
                {departmentsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <FiChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} size={16} />
            </div>
          </div>

          {utilizationData.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>
              No leave utilization data recorded {selectedDept !== 'All' ? `for ${selectedDept} Department` : ''}.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {utilizationData.map(u => (
                <div 
                  key={u.type} 
                  onClick={() => setSelectedType(u.type)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 16, 
                    padding: '12px 16px', 
                    borderRadius: 10, 
                    background: '#f8fafc', 
                    border: '1px solid #f1f5f9', 
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#f1f5f9';
                  }}
                >
                  <div style={{ width: 140, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{u.type}</div>
                  <div style={{ flex: 1, height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${u.pct}%`, height: '100%', background: '#10b981', borderRadius: 6, transition: 'width 0.3s ease' }}></div>
                  </div>
                  <div style={{ width: 110, textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                    {u.days} days ({u.pct}%)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Leave Types Overview Redesign */}
      <div className="vendor-section-card" style={{ padding: 32, borderRadius: 16, border: '1px solid #f1f5f9', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><rect x="8" y="14" width="8" height="4" rx="1"></rect></svg>
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Leave Types Overview</h2>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Track and analyze leave distribution across all leave types</p>
            </div>
          </div>
          {/* Time Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
              style={{
                appearance: 'none',
                padding: '9px 38px 9px 16px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
              <option value="all">All Time</option>
            </select>
            <FiChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} size={16} />
          </div>
        </div>
        
        {(() => {
          if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading data...</div>;
          if (overallUtilizationData.length === 0) return <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No data available for selected time period.</div>;
          
          const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];
          const BG_COLORS = ['#eff6ff', '#ecfdf5', '#fffbeb', '#f5f3ff', '#fdf2f8', '#f0fdfa', '#fff1f2'];
          
          const totalDays = timeFilteredLeaves.reduce((sum, l) => sum + l.totalLeaves, 0) || 1;

          const r = 110;
          const cx = 140;
          const cy = 140;
          const circ = 2 * Math.PI * r;
          const gap = 6; // pixel gap between arcs
          
          let currentOffset = circ * 0.25; // start at top
          
          const activeData = hoveredType ? overallUtilizationData.find(u => u.type === hoveredType) : null;
          const activeIndex = activeData ? overallUtilizationData.findIndex(u => u.type === hoveredType) : 0;
          
          const innerTitle = activeData ? activeData.type : "Total Leave Taken";
          const innerDays = activeData ? activeData.days : totalDays;
          const innerSubtitle = activeData ? `${activeData.pct}% of total` : "of total allocated";
          const innerColor = activeData ? COLORS[activeIndex % COLORS.length] : '#3b82f6';
          const innerBgColor = activeData ? BG_COLORS[activeIndex % BG_COLORS.length] : '#eff6ff';

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
              {/* Left Side: Donut */}
              <div 
                style={{ position: 'relative', width: 280, height: 280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseLeave={() => setHoveredType(null)}
              >
                <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f8fafc" strokeWidth="28" />
                  
                  {overallUtilizationData.map((u, i) => {
                    const pct = u.days / totalDays;
                    const dashLength = circ * pct;
                    const strokeColor = COLORS[i % COLORS.length];
                    const isHovered = hoveredType === u.type;
                    
                    const offset = currentOffset;
                    currentOffset -= dashLength;
                    
                    // Don't render empty segments
                    if (dashLength <= gap) return null;

                    return (
                      <circle
                        key={u.type}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isHovered ? "32" : "28"}
                        strokeDasharray={`${Math.max(0, dashLength - gap)} ${circ}`}
                        strokeDashoffset={offset}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onMouseEnter={() => setHoveredType(u.type)}
                        onClick={() => setSelectedType(u.type)}
                      />
                    );
                  })}
                </svg>
                
                {/* Inner HTML Circle with Drop Shadow */}
                <div style={{
                  width: 170, height: 170, borderRadius: '50%', background: '#fff',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', zIndex: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: 16, textAlign: 'center', transition: 'all 0.3s'
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>{innerTitle}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{innerDays}d</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, marginBottom: 12 }}>{innerSubtitle}</div>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: innerBgColor, color: innerColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                </div>
              </div>
              
              {/* Right Side: Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {overallUtilizationData.map((u, i) => (
                  <div
                    key={u.type}
                    onClick={() => setSelectedType(u.type)}
                    style={{ 
                      padding: 20, borderRadius: 16, border: '1px solid #f1f5f9', background: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'all 0.2s',
                      transform: hoveredType === u.type ? 'scale(1.02)' : 'scale(1)'
                    }}
                    onMouseEnter={() => setHoveredType(u.type)}
                    onMouseLeave={() => setHoveredType(null)}
                  >

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: BG_COLORS[i % BG_COLORS.length], color: COLORS[i % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{u.type}</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS[i % COLORS.length] }}>{u.days} days</div>
                        </div>
                      </div>
                      <div style={{ background: BG_COLORS[i % BG_COLORS.length], color: COLORS[i % COLORS.length], padding: '6px 12px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
                        {u.pct}%
                      </div>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, width: '100%', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: COLORS[i % COLORS.length], width: `${u.pct}%`, borderRadius: 3 }}></div>
                    </div>
                  </div>
                ))}
                
                {/* Bottom Stats Card */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 24, borderRadius: 16, border: '1px solid #f1f5f9', background: '#fff', marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', borderRight: '1px solid #f1f5f9' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>Total Leave Taken</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{totalDays} days</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingLeft: 8 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>Utilization Rate</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>62%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default VendorLeaveManagement;
