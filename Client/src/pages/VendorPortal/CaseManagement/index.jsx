import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiPlus, FiAlertCircle, FiCheck, FiMessageSquare, FiChevronRight, FiFileText, FiBox, FiCheckSquare, FiFile, FiCalendar } from 'react-icons/fi';
import { fetchApiData, sendApiData } from '../../../utils/apiClient';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css';

export const today = () => new Date().toISOString().split('T')[0];
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const STATIC_COLOR = { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };

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
export const CATEGORIES = ['Payroll', 'Employee Relations', 'Onboarding', 'IT Access', 'General'];

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
            let currentStepIdx = 0;
            if (c.status === 'Closed') currentStepIdx = 4;
            else if (c.status === 'Resolved') currentStepIdx = 3;
            else if (c.status === 'Work In Progress' || c.status === 'Vendor Action Pending' || c.status === 'In Progress') currentStepIdx = 2;
            else if (c.status === 'Open') currentStepIdx = 0;

            const done = i <= currentStepIdx;
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

const RaiseCaseModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ requester: '', category: 'General', subCategory: '', priority: '', impact: '', description: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      const payload = {
        requester: form.requester || "User",
        category: form.category,
        subCategory: form.subCategory || "General",
        shortDescription: form.description.slice(0, 50),
        description: form.description,
        priority: form.priority || "",
        impact: form.impact || "",
        status: "Open"
      };
      const res = await sendApiData("/api/hrrequests/create", payload);
      if (res.data) {
        onCreate(res.data);
        setSuccess(true);
        setTimeout(onClose, 1200);
      }
    } catch (err) {
      console.error("Error raising HR case:", err);
    }
  };

  return (
    <div className="po-overlay" onClick={onClose}>
      <div className="po-modal" onClick={e => e.stopPropagation()}>
        <div className="po-drawer-header">
          <div className="po-drawer-id">Create HR Case</div>
          <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
        </div>
        <div className="po-modal-body">
          {success && <div className="po-alert" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', marginBottom: 12 }}><FiCheck /> Case created successfully!</div>}
          <div className="po-field-group">
            <label className="po-field-label">Requester Name</label>
            <input className="po-input" placeholder="Enter requester name…" value={form.requester} onChange={e => setForm({ ...form, requester: e.target.value })} />
          </div>
          <div className="po-field-row">
            <div className="po-field-group">
              <label className="po-field-label">Category</label>
              <div className="po-select-wrapper">
                <select className="po-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="po-field-group">
              <label className="po-field-label">Priority</label>
              <div className="po-select-wrapper">
                <select className="po-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="">No Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
          <div className="po-field-group">
            <label className="po-field-label">Description <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea className={`po-textarea ${errors.description ? 'po-input-error' : ''}`} rows={4} placeholder="Provide full details of your issue…" value={form.description} onChange={e => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: '' }); }} />
            {errors.description && <div className="po-inline-error"><FiAlertCircle size={12} /> {errors.description}</div>}
          </div>
        </div>
        <div className="po-drawer-footer">
          <button className="po-btn po-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="po-btn po-btn-success" onClick={handleSubmit}><FiMessageSquare /> Submit Case</button>
        </div>
      </div>
    </div>
  );
};

const VendorCaseManagement = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [hoveredStatus, setHoveredStatus] = useState(null);

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

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    const matchQ = c.id.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.requester.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
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

  // Dynamic Cases Trend Calculation (7 Days, 1 Month, Custom)
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

  // Scaled Y-axis logic to keep 0, 2, 4, 6, 8, 10 strictly inside the canvas below header
  const maxTrendCount = useMemo(() => {
    const counts = trendData.map(d => d.count);
    return Math.max(4, ...counts);
  }, [trendData]);

  const yStep = Math.max(1, Math.ceil(maxTrendCount / 4));
  const maxYTick = yStep * 4;
  const yTicks = [0, yStep, yStep * 2, yStep * 3, maxYTick];

  const getYPos = (val) => {
    const bottomY = 160; // Bottom base line inside canvas
    const topY = 40;     // Top ceiling well below title heading
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
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>Case Management</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>HR Requests and Case Tracker (Sourced from HR Request database)</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setShowCreate(true)} style={{ padding: '10px 18px', borderRadius: 8, background: '#ea4104', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiPlus /> Raise HR Case
          </button>
          <div style={{ position: 'relative', width: 280 }}>
            <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
            <input
              type="text"
              placeholder="Search by incident number or subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, outline: 'none', color: '#0f172a' }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 32 }}>
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
            style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.title}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>{kpi.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid 1: Cases by Status & Cases Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Cases by Status (Donut Chart) */}
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

<<<<<<< HEAD
        {/* Cases Trend */}
        {(() => {
          const [trendPeriod, setTrendPeriod] = React.useState('7d');
          const [customFrom, setCustomFrom] = React.useState('');
          const [customTo, setCustomTo] = React.useState('');

          // Compute real date labels for custom range
          const getCustomLabels = () => {
            if (!customFrom || !customTo) return ['Pick dates above'];
            const from = new Date(customFrom);
            const to = new Date(customTo);
            if (to <= from) return ['Invalid range'];
            const totalMs = to - from;
            const steps = 5;
            return Array.from({ length: steps }, (_, i) => {
              const d = new Date(from.getTime() + (totalMs / (steps - 1)) * i);
              return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            });
          };

          const trendDataMap = {
            '7d': {
              label: 'Last 7 Days',
              xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              points: [{x:40,y:125,v:3},{x:110,y:110,v:4},{x:180,y:140,v:2},{x:250,y:95,v:5},{x:320,y:80,v:6},{x:390,y:125,v:3},{x:460,y:140,v:2}],
            },
            '1m': {
              label: 'Last 1 Month',
              xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              points: [{x:80,y:115,v:8},{x:200,y:90,v:12},{x:320,y:105,v:10},{x:440,y:75,v:14}],
            },
            'custom': {
              label: customFrom && customTo ? `${customFrom} → ${customTo}` : 'Select a date range',
              xLabels: getCustomLabels(),
              points: [{x:60,y:130,v:5},{x:160,y:100,v:9},{x:260,y:120,v:7},{x:360,y:85,v:11},{x:460,y:110,v:8}],
            },
          };

          const current = trendDataMap[trendPeriod];
          const linePath = current.points.map((p,i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
          const areaPath = linePath + ` L ${current.points[current.points.length-1].x} 170 L ${current.points[0].x} 170 Z`;

          return (
            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  Cases Trend <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>({current.label})</span>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Period toggle pills */}
                  {[{key:'7d',label:'7 Days'},{key:'1m',label:'1 Month'},{key:'custom',label:'Custom'}].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setTrendPeriod(opt.key)}
                      style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid', transition: 'all 0.2s',
                        background: trendPeriod === opt.key ? '#0f172a' : '#f8fafc',
                        color: trendPeriod === opt.key ? '#fff' : '#475569',
                        borderColor: trendPeriod === opt.key ? '#0f172a' : '#e2e8f0'
                      }}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>

              {/* Custom date pickers — only shown when Custom is active */}
              {trendPeriod === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>From</span>
                  <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', background: '#fff' }}
                  />
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>→</span>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>To</span>
                  <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', background: '#fff' }}
                  />
                </div>
              )}

              {/* Chart */}
              <div style={{ width: '100%', height: 220, position: 'relative' }}>
                <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Y Axis */}
                  {[0, 2, 4, 6, 8, 10].map(y => (
                    <g key={y}>
                      <text x="10" y={170 - (y * 15)} fill="#94a3b8" fontSize="11">{y}</text>
                    </g>
                  ))}

                  {/* X Axis labels */}
                  {current.xLabels.map((d, i) => {
                    const totalSlots = current.xLabels.length - 1;
                    const x = totalSlots === 0 ? 250 : 40 + (i * (420 / totalSlots));
                    return <text key={d} x={x} y="195" fill="#94a3b8" fontSize="12" textAnchor="middle">{d}</text>;
                  })}

                  {/* Line & Area */}
                  <path d={areaPath} fill="url(#blueGrad)" />
                  <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />

                  {/* Data Points */}
                  {current.points.map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#3b82f6" />
                      <text x={pt.x} y={pt.y - 12} fill="#3b82f6" fontSize="13" fontWeight="bold" textAnchor="middle">{pt.v}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          );
        })()}
=======
        {/* Cases Trend (7 Days, 1 Month, Custom) */}
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
                
                {/* Y Axis Grid & Labels (Kept strictly inside canvas below title) */}
                {yTicks.map(yVal => {
                  const py = getYPos(yVal);
                  return (
                    <g key={yVal}>
                      <line x1="50" y1={py} x2="480" y2={py} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="35" y={py + 4} fill="#94a3b8" fontSize="11" textAnchor="end">{yVal}</text>
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {trendPoints.map((pt, idx) => (
                  <text key={idx} x={pt.x} y="190" fill="#94a3b8" fontSize="11" textAnchor="middle">{pt.label}</text>
                ))}

                {/* Line & Fill Area */}
                {trendPathStr && <path d={trendPathStr} fill="none" stroke="#3b82f6" strokeWidth="3" />}
                {trendAreaStr && <path d={trendAreaStr} fill="url(#blueGrad)" />}

                {/* Data Points */}
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
>>>>>>> 10a9936 (Update dashboard and case management work)
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
                  <div key={cat.label} style={{ display: 'flex', alignItems: 'center' }}>
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
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: p.bg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }}></div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{p.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.count} case{p.count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>All HR Cases</h2>
          <button onClick={() => navigate('/vendor-portal/cases/list/all')} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>View Detailed List</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading cases from HR Request database...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No HR cases found in database.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>INCIDENT NUMBER</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>REQUESTER</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>CATEGORY</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>PRIORITY</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>IMPACT</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>LAST UPDATED</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => setSelected(c)} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px', fontSize: 13, fontWeight: 700, color: '#ea4104' }}>{c.id}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#0f172a', fontWeight: 600 }}>👤 {c.requester}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#475569' }}>{c.category}</td>
                    <td style={{ padding: '16px' }}><PriorityBadge priority={c.priority} /></td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#475569' }}>{c.impact}</td>
                    <td style={{ padding: '16px' }}><StatusBadge status={c.status} /></td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#475569' }}>{fmtDate(c.lastUpdate)}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: '#ea4104', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                        <FiChevronRight size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
>>>>>>> 10a9936 (Update dashboard and case management work)

      {selected && <CaseDetailDrawer c={selected} onClose={() => setSelected(null)} />}
      {showCreate && <RaiseCaseModal onClose={() => setShowCreate(false)} onCreate={loadHrCases} />}
    </div>
  );
};

export default VendorCaseManagement;
