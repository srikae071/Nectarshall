import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { fetchApiData } from '../../../utils/apiClient';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css';

export const today = () => new Date().toISOString().split('T')[0];
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const ALL_LEAVE_COLUMNS = [
  { key: 'leaveNumber', label: 'Leave ID' },
  { key: 'employeeName', label: 'Employee Name' },
  { key: 'leaveType', label: 'Leave type' },
  { key: 'startDate', label: 'Start date' },
  { key: 'endDate', label: 'End date' },
  { key: 'totalLeaves', label: 'Total leave count' },
  { key: 'status', label: 'Status' },
  { key: 'description', label: 'Reason' },
];

const VendorLeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(ALL_LEAVE_COLUMNS.map(c => c.key));

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

      {/* Row 3: All Leaves Table */}
      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>All Leave Records</h2>
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

                {ALL_LEAVE_COLUMNS.map(col => (
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
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading leaves from database...</div>
        ) : filteredLeaves.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No leave records found in database.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {ALL_LEAVE_COLUMNS.filter(c => visibleColumns.includes(c.key)).map(c => (
                    <th key={c.key} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {visibleColumns.includes('leaveNumber') && <td style={{ padding: 16, fontSize: 13, fontWeight: 700, color: '#ea4104' }}>{l.id}</td>}
                    {visibleColumns.includes('employeeName') && <td style={{ padding: 16, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>👤 {l.employeeName}</td>}
                    {visibleColumns.includes('leaveType') && <td style={{ padding: 16, fontSize: 13, color: '#475569' }}>{l.leaveType}</td>}
                    {visibleColumns.includes('startDate') && <td style={{ padding: 16, fontSize: 13, color: '#475569' }}>{fmtDate(l.startDate)}</td>}
                    {visibleColumns.includes('endDate') && <td style={{ padding: 16, fontSize: 13, color: '#475569' }}>{fmtDate(l.endDate)}</td>}
                    {visibleColumns.includes('totalLeaves') && <td style={{ padding: 16, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{l.totalLeaves}d</td>}
                    {visibleColumns.includes('status') && (
                      <td style={{ padding: 16 }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: l.status.toLowerCase() === 'approved' ? '#f0fdf4' : '#fff7ed', color: l.status.toLowerCase() === 'approved' ? '#16a34a' : '#ea580c' }}>
                          {l.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('description') && <td style={{ padding: 16, fontSize: 13, color: '#64748b' }}>{l.description}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorLeaveManagement;
