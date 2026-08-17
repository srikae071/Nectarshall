import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiPlus, FiAlertCircle, FiCheck, FiMessageSquare, FiChevronRight, FiFileText, FiBox, FiCheckSquare, FiFile, FiCalendar } from 'react-icons/fi';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css';

export const today = () => new Date().toISOString().split('T')[0];
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const CASE_STATUS_COLORS = {
  'Open':                   { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Vendor Action Pending':  { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'Work In Progress':       { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  'Resolved':               { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Closed':                 { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

const PRIORITY_COLORS = {
  'High':   { bg: '#fef2f2', color: '#dc2626' },
  'Medium': { bg: '#fff7ed', color: '#ea580c' },
  'Low':    { bg: '#f0fdf4', color: '#16a34a' },
};

export const ALL_STATUSES = ['All', 'Open', 'Vendor Action Pending', 'Work In Progress', 'Resolved', 'Closed'];
export const CATEGORIES = ['Payment', 'Contract', 'Invoice', 'Onboarding', 'IT Access', 'Other'];

export const initialCases = [
  { id: 'CASE-001', subject: 'Payment delay for INV-2045', category: 'Payment', priority: 'High', status: 'Open', created: '2026-08-01', lastUpdate: '2026-08-10', description: 'Invoice INV-2045 was submitted on Aug 8 but payment has not been received. Please confirm the expected payment date.' },
  { id: 'CASE-002', subject: 'PO-1024 scope clarification needed', category: 'Contract', priority: 'Medium', status: 'Vendor Action Pending', created: '2026-08-03', lastUpdate: '2026-08-12', description: 'The procurement team requires additional documentation regarding the scope of services under PO-1024. Please upload the revised scope document.' },
  { id: 'CASE-003', subject: 'Invoice rejected - incorrect PO reference', category: 'Invoice', priority: 'High', status: 'Work In Progress', created: '2026-07-28', lastUpdate: '2026-08-08', description: 'INV-2046 was rejected due to an incorrect PO number. Our team is reviewing and will issue a corrected invoice shortly.' },
  { id: 'CASE-004', subject: 'Onboarding document submission', category: 'Onboarding', priority: 'Low', status: 'Resolved', created: '2026-07-15', lastUpdate: '2026-07-20', description: 'All required onboarding compliance documents have been submitted and verified by HR.' },
  { id: 'CASE-005', subject: 'Access credentials request', category: 'IT Access', priority: 'Low', status: 'Closed', created: '2026-07-10', lastUpdate: '2026-07-12', description: 'Vendor portal login credentials have been issued to 3 team members.' },
];

export const StatusBadge = ({ status }) => {
  const s = CASE_STATUS_COLORS[status] || CASE_STATUS_COLORS['Closed'];
  return <span className="po-status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>{status}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const s = PRIORITY_COLORS[priority] || PRIORITY_COLORS['Low'];
  return <span className="po-status-badge" style={{ background: s.bg, color: s.color, border: 'none', fontSize: '10px' }}>{priority}</span>;
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
          <div className="po-info-item"><span>Category</span><strong>{c.category}</strong></div>
          <div className="po-info-item"><span>Priority</span><strong><PriorityBadge priority={c.priority} /></strong></div>
          <div className="po-info-item"><span>Created</span><strong>{fmtDate(c.created)}</strong></div>
          <div className="po-info-item"><span>Last Updated</span><strong>{fmtDate(c.lastUpdate)}</strong></div>
          <div className="po-info-item" style={{ gridColumn: '1/-1' }}><span>Subject</span><strong>{c.subject}</strong></div>
          <div className="po-info-item" style={{ gridColumn: '1/-1' }}><span>Description</span><strong style={{ fontWeight: 400, color: '#475569', lineHeight: '1.6' }}>{c.description}</strong></div>
        </div>
        <div className="po-drawer-section-title" style={{ marginTop: 20 }}>Timeline</div>
        <div className="po-timeline">
          {['Created', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((step, i, arr) => {
            const order = ['Open', 'Work In Progress', 'Vendor Action Pending', 'Resolved', 'Closed'];
            const statusIdx = order.indexOf(c.status);
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

const RaiseCaseModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ subject: '', category: '', priority: 'Medium', description: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.category) e.category = 'Category is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newCase = {
      id: `CASE-00${Math.floor(Math.random() * 900) + 100}`,
      subject: form.subject,
      category: form.category,
      priority: form.priority,
      status: 'Open',
      created: today(),
      lastUpdate: today(),
      description: form.description,
    };
    onCreate(newCase);
    setSuccess(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="po-overlay" onClick={onClose}>
      <div className="po-modal" onClick={e => e.stopPropagation()}>
        <div className="po-drawer-header">
          <div className="po-drawer-id">Raise a Case</div>
          <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
        </div>
        <div className="po-modal-body">
          {success && <div className="po-alert" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', marginBottom: 12 }}><FiCheck /> Case raised successfully!</div>}
          <div className="po-field-group">
            <label className="po-field-label">Subject <span style={{ color: '#ef4444' }}>*</span></label>
            <input className={`po-input ${errors.subject ? 'po-input-error' : ''}`} placeholder="Briefly describe your issue…" value={form.subject} onChange={e => { setForm({ ...form, subject: e.target.value }); setErrors({ ...errors, subject: '' }); }} />
            {errors.subject && <div className="po-inline-error"><FiAlertCircle size={12} /> {errors.subject}</div>}
          </div>
          <div className="po-field-row">
            <div className="po-field-group">
              <label className="po-field-label">Category <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="po-select-wrapper">
                <select className={`po-select ${errors.category ? 'po-input-error' : ''}`} value={form.category} onChange={e => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: '' }); }}>
                  <option value="">— Select —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {errors.category && <div className="po-inline-error"><FiAlertCircle size={12} /> {errors.category}</div>}
            </div>
            <div className="po-field-group">
              <label className="po-field-label">Priority</label>
              <div className="po-select-wrapper">
                <select className="po-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
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
  const [cases, setCases] = useState(initialCases);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    return (c.id.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || c.status === statusFilter);
  });

  return (
    <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="vendor-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>Case Management</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Submit and track your support cases with the procurement team.</p>
        </div>
        <div style={{ position: 'relative', width: 320 }}>
          <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
          <input
            type="text"
            placeholder="Search by case ID or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, outline: 'none', color: '#0f172a' }}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {[
          { icon: <FiFileText size={20} color="#3b82f6" />, bg: '#eff6ff', title: 'TOTAL CASES', value: '25', sub: 'All time', path: 'all' },
          { icon: <FiBox size={20} color="#10b981" />, bg: '#f0fdf4', title: 'OPEN CASES', value: '5', sub: '20% of total', path: 'Open' },
          { icon: <FiFile size={20} color="#f59e0b" />, bg: '#fffbeb', title: 'PENDING ACTION', value: '3', sub: 'Awaiting vendor', path: 'Vendor Action Pending' },
          { icon: <FiCheckSquare size={20} color="#8b5cf6" />, bg: '#f5f3ff', title: 'RESOLVED CASES', value: '17', sub: '68% of total', path: 'Resolved' }
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

      {/* Middle Charts 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Cases by Status */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 24px 0' }}>Cases by Status</h2>
          {(() => {
            const [hovered, setHovered] = React.useState(null);
            const data = [
              { id: 'open', label: 'Open', val: '5', pct: '20%', color: '#3b82f6', dash: '50.2 251.2', off: '0' },
              { id: 'pending', label: 'Vendor Action Pending', val: '3', pct: '12%', color: '#f59e0b', dash: '30.1 251.2', off: '-58' },
              { id: 'wip', label: 'Work In Progress', val: '4', pct: '16%', color: '#8b5cf6', dash: '40.1 251.2', off: '-88.1' },
              { id: 'resolved', label: 'Resolved', val: '12', pct: '48%', color: '#10b981', dash: '120.5 251.2', off: '-128.2' },
              { id: 'closed', label: 'Closed', val: '1', pct: '4%', color: '#ef4444', dash: '2.5 251.2', off: '-248.7' },
            ];
            const activeData = hovered ? data.find(d => d.id === hovered) : { label: 'Total', val: '25' };

            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', width: 200, height: 200 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                    {/* Reversing array so hovered item renders on top */}
                    {[...data].reverse().map(item => (
                      <circle
                        key={item.id}
                        cx="50" cy="50" r="40" fill="none"
                        stroke={hovered && hovered !== item.id ? '#e2e8f0' : item.color}
                        strokeWidth={hovered === item.id ? '20' : '16'}
                        strokeDasharray={item.dash}
                        strokeDashoffset={item.off}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    ))}
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: hovered ? 11 : 13, color: '#64748b', textAlign: 'center', maxWidth: 80, lineHeight: 1.2 }}>{activeData.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{activeData.val}</div>
                  </div>
                </div>
                
                <div style={{ flex: 1, marginLeft: 32 }}>
                  {data.map(item => (
                    <div 
                      key={item.id} 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '4px 8px', borderRadius: 6, background: hovered === item.id ? '#f8fafc' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={() => setHovered(item.id)}
                      onMouseLeave={() => setHovered(null)}
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
            );
          })()}
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            Last 30 days <FiCalendar size={12} />
          </div>
        </div>

        {/* Cases Trend */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 24px 0' }}>Cases Trend <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>(Last 7 Days)</span></h2>
          <div style={{ width: '100%', height: 240, position: 'relative' }}>
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

              {/* X Axis */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <text key={d} x={40 + (i * 70)} y="195" fill="#94a3b8" fontSize="12" textAnchor="middle">{d}</text>
              ))}

              {/* Line & Area */}
              <path d="M 40 125 L 110 110 L 180 140 L 250 95 L 320 80 L 390 125 L 460 140" fill="none" stroke="#3b82f6" strokeWidth="3" />
              <path d="M 40 125 L 110 110 L 180 140 L 250 95 L 320 80 L 390 125 L 460 140 L 460 170 L 40 170 Z" fill="url(#blueGrad)" />

              {/* Points */}
              {[ {x: 40, y: 125, v: 3}, {x: 110, y: 110, v: 4}, {x: 180, y: 140, v: 2}, {x: 250, y: 95, v: 5}, {x: 320, y: 80, v: 6}, {x: 390, y: 125, v: 3}, {x: 460, y: 140, v: 2} ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#3b82f6" />
                  <text x={pt.x} y={pt.y - 12} fill="#3b82f6" fontSize="13" fontWeight="bold" textAnchor="middle">{pt.v}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Charts 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Cases by Category */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 24px 0' }}>Cases by Category</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Payment', val: 8, pct: '32%', color: '#3b82f6', w: '80%' },
              { label: 'Contract', val: 6, pct: '24%', color: '#10b981', w: '60%' },
              { label: 'Invoice', val: 5, pct: '20%', color: '#f59e0b', w: '50%' },
              { label: 'Onboarding', val: 3, pct: '12%', color: '#8b5cf6', w: '30%' },
              { label: 'IT Access', val: 3, pct: '12%', color: '#ef4444', w: '30%' },
            ].map(cat => (
              <div key={cat.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 80, fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{cat.label}</div>
                <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, margin: '0 16px', overflow: 'hidden' }}>
                  <div style={{ width: cat.w, height: '100%', background: cat.color, borderRadius: 4 }}></div>
                </div>
                <div style={{ width: 60, textAlign: 'right', fontSize: 13, color: '#64748b' }}>{cat.val} ({cat.pct})</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 96, marginRight: 76, marginTop: 12 }}>
            {[0, 2, 4, 6, 8, 10].map(n => <div key={n} style={{ fontSize: 11, color: '#94a3b8' }}>{n}</div>)}
          </div>
        </div>

        {/* Cases by Priority */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 24px 0' }}>Cases by Priority</h2>
          {(() => {
            const [hovered, setHovered] = React.useState(null);
            const data = [
              { id: 'high', label: 'High', val: '9', pct: '36%', color: '#ef4444', dash: '90.4 251.2', off: '0' },
              { id: 'medium', label: 'Medium', val: '10', pct: '40%', color: '#f59e0b', dash: '100.5 251.2', off: '-90.4' },
              { id: 'low', label: 'Low', val: '6', pct: '24%', color: '#10b981', dash: '60.3 251.2', off: '-190.9' },
            ];
            const activeData = hovered ? data.find(d => d.id === hovered) : { label: 'Total', val: '25' };

            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                <div style={{ position: 'relative', width: 180, height: 180 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                    {[...data].reverse().map(item => (
                      <circle
                        key={item.id}
                        cx="50" cy="50" r="40" fill="none"
                        stroke={hovered && hovered !== item.id ? '#e2e8f0' : item.color}
                        strokeWidth={hovered === item.id ? '22' : '18'}
                        strokeDasharray={item.dash}
                        strokeDashoffset={item.off}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    ))}
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{activeData.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{activeData.val}</div>
                  </div>
                </div>
                
                <div style={{ marginLeft: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {data.map(item => (
                    <div 
                      key={item.id} 
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 8px', borderRadius: 6, background: hovered === item.id ? '#f8fafc' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={() => setHovered(item.id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 70 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }}></div>
                        <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{item.val} ({item.pct})</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Recent Cases */}
      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Cases</h2>
          <button onClick={() => navigate('/vendor-portal/cases/list/all')} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>View All Cases</button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>CASE ID</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>SUBJECT</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>CATEGORY</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>PRIORITY</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>STATUS</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>LAST UPDATED</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => setSelected(c)} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px', fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>{c.id}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{c.subject}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: '#475569' }}>{c.category}</td>
                  <td style={{ padding: '16px' }}><PriorityBadge priority={c.priority} /></td>
                  <td style={{ padding: '16px' }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: '16px', fontSize: 13, color: '#475569' }}>{fmtDate(c.lastUpdate)}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                      <FiChevronRight size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <CaseDetailDrawer c={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default VendorCaseManagement;
