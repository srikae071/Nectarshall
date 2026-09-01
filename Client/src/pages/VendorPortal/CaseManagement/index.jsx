import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiCheck, FiChevronRight, FiFileText, FiBox, FiCheckSquare, FiFile, FiDownload } from 'react-icons/fi';
import { fetchApiData } from '../../../utils/apiClient';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css';

export const today = () => new Date().toISOString().split('T')[0];
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const ALL_CASE_COLUMNS = [
  { key: 'id', label: 'INCIDENT NUMBER', width: '15%' },
  { key: 'requester', label: 'REQUESTER', width: '16%' },
  { key: 'category', label: 'CATEGORY', width: '15%' },
  { key: 'priority', label: 'PRIORITY', width: '12%' },
  { key: 'impact', label: 'IMPACT', width: '12%' },
  { key: 'status', label: 'STATUS', width: '14%' },
  { key: 'lastUpdate', label: 'LAST UPDATED', width: '14%' },
  { key: 'action', label: 'ACTIONS', width: '10%' },
];

const CASE_STATUS_COLORS = {
  'Open':                   { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Vendor Action Pending':  { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'Work In Progress':       { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  'In Progress':            { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  'Resolved':               { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Closed':                 { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

const PRIORITY_COLORS = {
  'High':   { bg: '#fef2f2', color: '#dc2626' },
  'Medium': { bg: '#fff7ed', color: '#ea580c' },
  'Low':    { bg: '#f0fdf4', color: '#16a34a' },
  'No Priority': { bg: '#f1f5f9', color: '#64748b' },
};

export const ALL_STATUSES = ['All', 'Open', 'Work In Progress', 'Resolved', 'Closed'];

export const StatusBadge = ({ status }) => {
  const st = status || 'Open';
  const s = CASE_STATUS_COLORS[st] || { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
  return <span className="po-status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>{st}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const p = priority && priority.trim() ? priority : 'No Priority';
  const s = PRIORITY_COLORS[p] || PRIORITY_COLORS['No Priority'];
  return <span className="po-status-badge" style={{ background: s.bg, color: s.color, border: 'none', fontSize: '10px' }}>{p}</span>;
};

export const CaseDetailDrawer = ({ c, onClose }) => (
  <>
    <div className="po-overlay" onClick={onClose} />
    <div className="po-drawer">
      <div className="po-drawer-header">
        <div>
          <div className="po-drawer-id">{c.id}</div>
          <StatusBadge status={c.status} />
        </div>
        <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
      </div>
      <div className="po-drawer-body">
        <div className="po-info-grid">
          <div className="po-info-item"><span>Requester</span><strong>{c.requester}</strong></div>
          <div className="po-info-item"><span>Category</span><strong>{c.category}</strong></div>
          <div className="po-info-item"><span>Sub Category</span><strong>{c.subCategory}</strong></div>
          <div className="po-info-item"><span>Priority</span><strong><PriorityBadge priority={c.priority} /></strong></div>
          <div className="po-info-item"><span>Impact</span><strong>{c.impact}</strong></div>
          <div className="po-info-item"><span>Assignment Group</span><strong>{c.assignmentGroup}</strong></div>
          <div className="po-info-item"><span>Assigned To</span><strong>{c.assignTo}</strong></div>
          <div className="po-info-item"><span>Created</span><strong>{fmtDate(c.created)}</strong></div>
          <div className="po-info-item" style={{ gridColumn: '1/-1' }}><span>Subject / Description</span><strong style={{ fontWeight: 400, color: '#475569', lineHeight: '1.6' }}>{c.description}</strong></div>
        </div>
        <div className="po-drawer-section-title" style={{ marginTop: 20 }}>Timeline</div>
        <div className="po-timeline">
          {['Created', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((step, i, arr) => {
            const done = i === 0 || (c.status === 'Resolved' && i <= 3) || c.status === 'Closed';
            return (
              <div className={`po-timeline-step ${done ? 'done' : 'pending'}`} key={step}>
                <div className="po-timeline-dot">{done ? <FiCheck size={10} /> : null}</div>
                {i < arr.length - 1 && <div className="po-timeline-line" />}
                <div className="po-timeline-label">{step}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="po-drawer-footer">
        <button className="po-btn po-btn-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  </>
);

const VendorCaseManagement = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [hoveredStatus, setHoveredStatus] = useState(null);

  // Column Settings Dropdown state
  const [showSettings, setShowSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(ALL_CASE_COLUMNS.map(c => c.key));

  // Time Range Filter state (7days, 1month, custom)
  const [trendRange, setTrendRange] = useState('7days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    loadHrCases();
  }, []);

  const loadHrCases = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/hrrequests");
      const mapped = (res.data || []).map((item, index) => ({
        id: item.incidentNumber || `HR-${String(index + 1).padStart(3, '0')}`,
        subject: item.shortDescription || item.description || `${item.category || "HR Case"} - ${item.requester || "Requester"}`,
        requester: item.requester || item.requesterName || "N/A",
        requesterFor: item.requesterFor || "N/A",
        category: item.category || "General",
        subCategory: item.subCategory || "N/A",
        priority: item.priority || item.urgency || "No Priority",
        impact: item.impact || "N/A",
        assignmentGroup: item.assignmentGroup || "N/A",
        assignTo: item.assignTo || "N/A",
        status: item.status || "Open",
        created: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : today(),
        lastUpdate: item.updatedAt ? new Date(item.updatedAt).toISOString().split('T')[0] : today(),
        description: item.description || item.shortDescription || "No description available.",
      }));
      setCases(mapped);
    } catch (err) {
      console.error("Error loading HR cases in Case Management:", err);
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

  // Only display cases where priority is High OR status is Open for the bottom HR Cases table
  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    const matchQ = c.id.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.requester.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
    const isHighOrOpen = (c.priority && c.priority.toLowerCase() === 'high') || (c.status && c.status.toLowerCase() === 'open');
    return matchQ && matchS && isHighOrOpen;
  });

  // Dynamic KPI counts
  const totalCount = cases.length;
  const openCount = cases.filter(c => (c.status || '').toLowerCase() === 'open').length;
  const pendingCount = cases.filter(c => (c.status || '').toLowerCase().includes('progress') || (c.status || '').toLowerCase().includes('pending')).length;
  const resolvedCount = cases.filter(c => (c.status || '').toLowerCase() === 'resolved' || (c.status || '').toLowerCase() === 'closed').length;

  // Dynamic Cases by Status Donut Chart Data
  const statusCounts = {
    Open: cases.filter(c => (c.status || '').toLowerCase() === 'open').length,
    'Vendor Action Pending': cases.filter(c => (c.status || '').toLowerCase().includes('pending')).length,
    'Work In Progress': cases.filter(c => (c.status || '').toLowerCase().includes('progress')).length,
    Resolved: cases.filter(c => (c.status || '').toLowerCase() === 'resolved').length,
    Closed: cases.filter(c => (c.status || '').toLowerCase() === 'closed').length,
  };

  const statusItems = [
    { id: 'open', label: 'Open', val: statusCounts.Open, color: '#3b82f6' },
    { id: 'pending', label: 'Vendor Action Pending', val: statusCounts['Vendor Action Pending'], color: '#f59e0b' },
    { id: 'wip', label: 'Work In Progress', val: statusCounts['Work In Progress'], color: '#8b5cf6' },
    { id: 'resolved', label: 'Resolved', val: statusCounts.Resolved, color: '#10b981' },
    { id: 'closed', label: 'Closed', val: statusCounts.Closed, color: '#ef4444' },
  ];

  let cumulativeStatusOffset = 0;
  const statusChartData = statusItems.map(item => {
    const pctVal = totalCount > 0 ? item.val / totalCount : 0;
    const dashVal = (pctVal * 251.2).toFixed(1);
    const dash = `${dashVal} 251.2`;
    const off = `-${cumulativeStatusOffset.toFixed(1)}`;
    cumulativeStatusOffset += pctVal * 251.2;
    return {
      ...item,
      pct: totalCount > 0 ? `${Math.round(pctVal * 100)}%` : '0%',
      dash,
      off
    };
  });

  const activeStatusData = hoveredStatus
    ? statusChartData.find(d => d.id === hoveredStatus)
    : { label: 'Total Cases', val: totalCount };

  // Dynamic Cases Trend Calculation
  const trendData = useMemo(() => {
    const now = new Date();

    if (trendRange === '7days') {
      const points = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = d.toISOString().split('T')[0];
        const count = cases.filter(c => c.created === dateStr).length;
        points.push({ label: dayLabel, dateStr, count });
      }
      return points;
    }

    if (trendRange === '1month') {
      const points = [];
      for (let i = 25; i >= 0; i -= 5) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dateStr = d.toISOString().split('T')[0];
        const count = cases.filter(c => {
          if (!c.created) return false;
          const cd = new Date(c.created);
          const diffDays = Math.floor((now - cd) / (1000 * 60 * 60 * 24));
          return diffDays >= (i - 4) && diffDays <= i;
        }).length;
        points.push({ label: dayLabel, dateStr, count });
      }
      return points;
    }

    if (trendRange === 'custom') {
      if (!customStartDate || !customEndDate) return [];
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      if (start > end) return [];

      const points = [];
      const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
      const step = Math.max(1, Math.floor(totalDays / 6));

      let curr = new Date(start);
      while (curr <= end) {
        const dateStr = curr.toISOString().split('T')[0];
        const label = curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const count = cases.filter(c => c.created === dateStr).length;
        points.push({ label, dateStr, count });
        curr.setDate(curr.getDate() + step);
      }
      return points;
    }

    return [];
  }, [cases, trendRange, customStartDate, customEndDate]);

  const maxTrendCount = useMemo(() => {
    const counts = trendData.map(d => d.count);
    return Math.max(4, ...counts);
  }, [trendData]);

  const yStep = Math.max(1, Math.ceil(maxTrendCount / 4));
  const maxYTick = yStep * 4;
  const yTicks = [0, yStep, yStep * 2, yStep * 3, maxYTick];

  const getYPos = (val) => {
    const bottomY = 160;
    const topY = 40;
    return bottomY - (val / maxYTick) * (bottomY - topY);
  };

  const trendPoints = useMemo(() => {
    if (!trendData || trendData.length === 0) return [];
    const svgWidth = 400;
    const leftPad = 60;
    const stepX = trendData.length > 1 ? svgWidth / (trendData.length - 1) : 0;
    return trendData.map((d, i) => ({
      x: leftPad + i * stepX,
      y: getYPos(d.count),
      val: d.count,
      label: d.label
    }));
  }, [trendData, maxYTick]);

  const trendPathStr = useMemo(() => {
    if (trendPoints.length === 0) return '';
    return trendPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  }, [trendPoints]);

  const trendAreaStr = useMemo(() => {
    if (trendPoints.length === 0) return '';
    const lastX = trendPoints[trendPoints.length - 1].x;
    const firstX = trendPoints[0].x;
    return `${trendPathStr} L ${lastX} 160 L ${firstX} 160 Z`;
  }, [trendPoints, trendPathStr]);

  // Dynamic Category Stats
  const categoryCounts = {};
  cases.forEach(c => {
    const cat = c.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryList = Object.entries(categoryCounts).map(([cat, val]) => ({
    label: cat,
    val,
    pct: totalCount > 0 ? `${Math.round((val / totalCount) * 100)}%` : '0%',
    w: totalCount > 0 ? `${Math.min(100, Math.round((val / totalCount) * 100))}%` : '0%'
  }));

  // Dynamic Priority Stats
  const priorityCounts = { High: 0, Medium: 0, Low: 0, 'No Priority': 0 };
  cases.forEach(c => {
    const p = c.priority && PRIORITY_COLORS[c.priority] ? c.priority : 'No Priority';
    priorityCounts[p] = (priorityCounts[p] || 0) + 1;
  });

  return (
    <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="vendor-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#0f172a' }}>Case Management</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0 0' }}>HR Requests and Case Tracker (Sourced from HR Request database)</p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
            <input
              type="text"
              placeholder="Search by incident number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, outline: 'none', color: '#0f172a' }}
            />
          </div>
          <button
            onClick={() => {
              const headers = ['Incident Number', 'Requester', 'Category', 'Priority', 'Impact', 'Status', 'Last Updated'];
              const rows = filtered.map(c => [c.id, c.requester, c.category, c.priority, c.impact, c.status, c.lastUpdate]);
              const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
              const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'hr_cases.csv'; a.click();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <FiDownload size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {[
          { icon: <FiFileText size={20} color="#3b82f6" />, bg: '#eff6ff', title: 'TOTAL CASES', value: totalCount, sub: 'All HR Requests', path: 'all' },
          { icon: <FiBox size={20} color="#2563eb" />, bg: '#eff6ff', title: 'OPEN CASES', value: openCount, sub: `${totalCount > 0 ? Math.round((openCount/totalCount)*100) : 0}% of total`, path: 'Open' },
          { icon: <FiFile size={20} color="#f59e0b" />, bg: '#fffbeb', title: 'IN PROGRESS / PENDING', value: pendingCount, sub: 'Awaiting action', path: 'In Progress' },
          { icon: <FiCheckSquare size={20} color="#10b981" />, bg: '#f0fdf4', title: 'RESOLVED / CLOSED', value: resolvedCount, sub: `${totalCount > 0 ? Math.round((resolvedCount/totalCount)*100) : 0}% resolved`, path: 'Resolved' }
        ].map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => navigate(`/vendor-portal/cases/list/${encodeURIComponent(kpi.path)}`)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
            style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, display: 'flex', alignItems: 'flex-start', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.title}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>{kpi.value}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid 1: Cases by Status & Cases Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Cases by Status */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 24px 0' }}>Cases by Status</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                {[...statusChartData].reverse().map(item => (
                  <circle
                    key={item.id}
                    cx="50" cy="50" r="40" fill="none"
                    stroke={hoveredStatus && hoveredStatus !== item.id ? '#e2e8f0' : item.color}
                    strokeWidth={hoveredStatus === item.id ? '20' : '16'}
                    strokeDasharray={item.dash}
                    strokeDashoffset={item.off}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={() => setHoveredStatus(item.id)}
                    onMouseLeave={() => setHoveredStatus(null)}
                    onClick={() => navigate(`/vendor-portal/cases/list/${encodeURIComponent(item.label)}`)}
                  />
                ))}
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: hoveredStatus ? 11 : 13, color: '#64748b', textAlign: 'center', maxWidth: 80, lineHeight: 1.2 }}>{activeStatusData.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{activeStatusData.val}</div>
              </div>
            </div>
            
            <div style={{ flex: 1, marginLeft: 32 }}>
              {statusChartData.map(item => (
                <div 
                  key={item.id} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '4px 8px', borderRadius: 6, background: hoveredStatus === item.id ? '#f8fafc' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={() => setHoveredStatus(item.id)}
                  onMouseLeave={() => setHoveredStatus(null)}
                  onClick={() => navigate(`/vendor-portal/cases/list/${encodeURIComponent(item.label)}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }}></div>
                    <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500, lineHeight: 1.2 }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginLeft: 8, whiteSpace: 'nowrap' }}>{item.val} ({item.pct})</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cases Trend */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>Cases Trend</h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0 0' }}>Creation timeline analysis</p>
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#f8fafc', padding: 4, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setTrendRange('7days')}
                style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: trendRange === '7days' ? '#0f172a' : 'transparent', color: trendRange === '7days' ? '#fff' : '#64748b', transition: 'all 0.2s' }}
              >
                7 Days
              </button>
              <button
                onClick={() => setTrendRange('1month')}
                style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: trendRange === '1month' ? '#0f172a' : 'transparent', color: trendRange === '1month' ? '#fff' : '#64748b', transition: 'all 0.2s' }}
              >
                1 Month
              </button>
              <button
                onClick={() => setTrendRange('custom')}
                style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: trendRange === 'custom' ? '#0f172a' : 'transparent', color: trendRange === 'custom' ? '#fff' : '#64748b', transition: 'all 0.2s' }}
              >
                Custom
              </button>
            </div>
          </div>

          {trendRange === 'custom' && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>
          )}

          <div style={{ width: '100%', height: 210, position: 'relative', marginTop: 8 }}>
            {trendRange === 'custom' && (!customStartDate || !customEndDate) ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', fontSize: 13 }}>
                Select a start and end date above to view custom date trend.
              </div>
            ) : trendPoints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', fontSize: 13 }}>
                No case creation records found in this range.
              </div>
            ) : (
              <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {yTicks.map(yVal => {
                  const py = getYPos(yVal);
                  return (
                    <g key={yVal}>
                      <line x1="50" y1={py} x2="480" y2={py} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="35" y={py + 4} fill="#94a3b8" fontSize="11" textAnchor="end">{yVal}</text>
                    </g>
                  );
                })}

                {trendPoints.map((pt, idx) => (
                  <text key={idx} x={pt.x} y="190" fill="#94a3b8" fontSize="11" textAnchor="middle">{pt.label}</text>
                ))}

                {trendPathStr && <path d={trendPathStr} fill="none" stroke="#3b82f6" strokeWidth="3" />}
                {trendAreaStr && <path d={trendAreaStr} fill="url(#blueGrad)" />}

                {trendPoints.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#3b82f6" />
                    <text x={pt.x} y={pt.y - 10} fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">{pt.val}</text>
                  </g>
                ))}
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Middle Grid 2: Cases by Category & Cases by Priority */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Cases by Category */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 24px 0' }}>Cases by Category</h2>
          {categoryList.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13 }}>No HR cases registered yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {categoryList.map((cat, idx) => {
                const colors = ['#ea4104', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                const barColor = colors[idx % colors.length];
                return (
                  <div 
                    key={cat.label} 
                    onClick={() => navigate(`/vendor-portal/cases/list/category:${encodeURIComponent(cat.label)}`)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer', 
                      padding: '6px 8px', 
                      borderRadius: 8, 
                      transition: 'all 0.15s ease' 
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateX(2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <div style={{ width: 110, fontSize: 13, color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.label}</div>
                    <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, margin: '0 16px', overflow: 'hidden' }}>
                      <div style={{ width: cat.w, height: '100%', background: barColor, borderRadius: 5 }}></div>
                    </div>
                    <div style={{ width: 70, textAlign: 'right', fontSize: 13, color: '#64748b', fontWeight: 600 }}>{cat.val} ({cat.pct})</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cases by Priority */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 24px 0' }}>Cases by Priority</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'High', count: priorityCounts.High, color: '#dc2626', bg: '#fef2f2' },
              { label: 'Medium', count: priorityCounts.Medium, color: '#ea580c', bg: '#fff7ed' },
              { label: 'Low', count: priorityCounts.Low, color: '#16a34a', bg: '#f0fdf4' },
              { label: 'No Priority', count: priorityCounts['No Priority'], color: '#64748b', bg: '#f1f5f9' },
            ].map(p => (
              <div 
                key={p.label} 
                onClick={() => navigate(`/vendor-portal/cases/list/priority:${encodeURIComponent(p.label)}`)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justify: 'space-between', 
                  padding: '12px 16px', 
                  borderRadius: 8, 
                  background: p.bg, 
                  cursor: 'pointer', 
                  transition: 'all 0.15s ease' 
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateX(2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }}></div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{p.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: p.color, marginLeft: '16px', flexShrink: 0 }}>
                  {p.count} case{p.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
      {selected && <CaseDetailDrawer c={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default VendorCaseManagement;
