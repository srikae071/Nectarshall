import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { fetchApiData } from '../../../utils/apiClient';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css';

export const today = () => new Date().toISOString().split('T')[0];
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const ALL_LEAVE_COLUMNS = [
  { key: 'leaveNumber', label: 'Leave ID', width: '12%' },
  { key: 'employeeName', label: 'Employee Name', width: '18%' },
  { key: 'leaveType', label: 'Leave type', width: '14%' },
  { key: 'startDate', label: 'Start date', width: '13%' },
  { key: 'endDate', label: 'End date', width: '13%' },
  { key: 'totalLeaves', label: 'Total leave count', width: '12%' },
  { key: 'status', label: 'Status', width: '10%' },
  { key: 'description', label: 'Reason', width: '18%' },
];

const VendorLeaveManagement = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(ALL_LEAVE_COLUMNS.map(c => c.key));
  const [hoveredType, setHoveredType] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/leaves");
      const mapped = (res.data || []).map((l, idx) => ({
        id: l.leaveNumber || `LV-${String(idx + 1).padStart(3, '0')}`,
        employeeName: l.employeeName || l.requester || "Unnamed Employee",
        leaveType: l.leaveType || "Casual Leave",
        startDate: l.startDate || today(),
        endDate: l.endDate || today(),
        totalLeaves: Number(l.totalLeaves) || 1,
        status: l.status || "Pending",
        description: l.description || l.comment || "N/A",
        dept: l.department || "General",
        initials: (l.employeeName || l.requester || "EP").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      }));
      setLeaves(mapped);
    } catch (err) {
      console.error("Error loading leaves in VendorLeaveManagement:", err);
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

  // Leaves by Department
  const deptLeaves = useMemo(() => {
    const deptMap = {};
    leaves.forEach(l => {
      const dept = l.dept || "General";
      if (!deptMap[dept]) deptMap[dept] = { dept, days: 0, count: 0 };
      deptMap[dept].days += l.totalLeaves;
      deptMap[dept].count += 1;
    });
    const maxDays = Math.max(1, ...Object.values(deptMap).map(d => d.days));
    return Object.values(deptMap).map(d => ({
      ...d,
      pct: Math.min(100, Math.round((d.days / maxDays) * 100))
    }));
  }, [leaves]);

  // Leave Utilization
  const utilizationData = useMemo(() => {
    const typeMap = {};
    leaves.forEach(l => {
      const type = l.leaveType || "Casual Leave";
      typeMap[type] = (typeMap[type] || 0) + l.totalLeaves;
    });
    const totalDays = leaves.reduce((sum, l) => sum + l.totalLeaves, 0) || 1;
    return Object.entries(typeMap).map(([type, days]) => ({
      type,
      days,
      pct: Math.min(100, Math.round((days / totalDays) * 100))
    }));
  }, [leaves]);

  const filteredLeaves = leaves.filter(l => {
    const q = search.toLowerCase();
    return l.id.toLowerCase().includes(q) || l.employeeName.toLowerCase().includes(q) || l.leaveType.toLowerCase().includes(q);
  });

  if (selectedType) {
    const typeLeaves = leaves.filter(l => l.leaveType === selectedType);
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
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Showing all {selectedType.toLowerCase()} records</p>
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
                      <td style={{ width: '13%', padding: 16, fontSize: 13, fontWeight: 700, color: '#ea4104' }}>{l.id}</td>
                      <td style={{ width: '20%', padding: 16, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{l.employeeName}</td>
                      <td style={{ width: '14%', padding: 16, fontSize: 13, color: '#475569' }}>{fmtDate(l.startDate)}</td>
                      <td style={{ width: '14%', padding: 16, fontSize: 13, color: '#475569' }}>{fmtDate(l.endDate)}</td>
                      <td style={{ width: '13%', padding: 16, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{`${l.totalLeaves}d`}</td>
                      <td style={{ width: '11%', padding: 16 }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: l.status.toLowerCase() === 'approved' ? '#f0fdf4' : '#fff7ed', color: l.status.toLowerCase() === 'approved' ? '#16a34a' : '#ea580c' }}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ width: '15%', padding: 16, fontSize: 13, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.description}>{l.description}</td>
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
            <span style={{ fontSize: 13, color: '#64748b' }}>Database Total</span>
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

      {/* Row 2: Department & Utilization */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Leaves by Department */}
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Leaves by Department</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 24 }}>Database Distribution</p>
          {deptLeaves.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13 }}>No department data available.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {deptLeaves.map(d => (
                <div key={d.dept} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 120, fontSize: 13, color: '#475569', fontWeight: 600 }}>{d.dept}</div>
                  <div style={{ flex: 1, height: 24, background: '#f1f5f9', borderRadius: 6, margin: '0 16px', overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: '#ea4104', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, color: 'white', fontSize: 12, fontWeight: 700 }}>
                      {d.days}d ({d.count})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave Utilization */}
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Leave Utilization</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 24 }}>By Leave Type — Database Total</p>
          {utilizationData.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13 }}>No leave utilization data recorded.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {utilizationData.map(u => (
                <div key={u.type} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 120, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{u.type}</div>
                  <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${u.pct}%`, height: '100%', background: '#10b981', borderRadius: 5 }}></div>
                  </div>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#10b981' }}>{u.pct}%</div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            This Month
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
        
        {(() => {
          if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading data...</div>;
          if (utilizationData.length === 0) return <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No data available.</div>;
          
          const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];
          const BG_COLORS = ['#eff6ff', '#ecfdf5', '#fffbeb', '#f5f3ff', '#fdf2f8', '#f0fdfa', '#fff1f2'];
          
          const totalDays = leaves.reduce((sum, l) => sum + l.totalLeaves, 0) || 1;

          const r = 110;
          const cx = 140;
          const cy = 140;
          const circ = 2 * Math.PI * r;
          const gap = 6; // pixel gap between arcs
          
          let currentOffset = circ * 0.25; // start at top
          
          const activeData = hoveredType ? utilizationData.find(u => u.type === hoveredType) : null;
          const activeIndex = activeData ? utilizationData.findIndex(u => u.type === hoveredType) : 0;
          
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
                  
                  {utilizationData.map((u, i) => {
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
                {utilizationData.map((u, i) => (
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
