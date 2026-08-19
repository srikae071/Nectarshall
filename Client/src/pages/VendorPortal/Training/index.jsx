import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiCheck, FiBookOpen, FiAlertCircle, FiVideo, FiFileText, FiLock, FiShield, FiClock, FiDownload } from 'react-icons/fi';
import '../Dashboard/index.css';

const today = () => new Date().toISOString().split('T')[0];
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const TRN_STATUS_COLORS = {
  'Pending':     { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'In Progress': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Completed':   { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Not Applicable': { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' },
};

export const trainingData = [
  { id: 'TRN-001', title: 'Vendor Code of Conduct', category: 'Compliance', type: 'Document', dueDate: '2026-09-01', status: 'Pending', mandatory: true, progress: 0, completedOn: null },
  { id: 'TRN-002', title: 'Health & Safety Awareness', category: 'Safety', type: 'Video', dueDate: '2026-09-15', status: 'Completed', mandatory: true, progress: 100, completedOn: '2026-08-10' },
  { id: 'TRN-003', title: 'Data Protection Policy', category: 'Compliance', type: 'Document', dueDate: '2026-09-01', status: 'Pending', mandatory: true, progress: 0, completedOn: null },
  { id: 'TRN-004', title: 'Site Access & Security', category: 'Operations', type: 'Document', dueDate: '2026-10-01', status: 'In Progress', mandatory: false, progress: 60, completedOn: null },
  { id: 'TRN-005', title: 'Emergency Response', category: 'Safety', type: 'Document', dueDate: '2026-09-30', status: 'Completed', mandatory: true, progress: 100, completedOn: '2026-08-05' },
  { id: 'TRN-006', title: 'Anti-Bribery Policy', category: 'Compliance', type: 'Document', dueDate: '2026-09-01', status: 'Pending', mandatory: true, progress: 0, completedOn: null },
];

export const TrainingDrawer = ({ item, onClose }) => {
  const s = TRN_STATUS_COLORS[item.status];
  return (
    <>
      <div className="po-overlay" onClick={onClose} />
      <div className="po-drawer">
        <div className="po-drawer-header">
          <div>
            <div className="po-drawer-id">{item.id}</div>
            <span className="po-status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>{item.status}</span>
          </div>
          <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
        </div>
        <div className="po-drawer-body">
          <div className="po-info-grid">
            <div className="po-info-item"><span>Category</span><strong>{item.category}</strong></div>
            <div className="po-info-item"><span>Type</span><strong>{item.type}</strong></div>
            <div className="po-info-item"><span>Due Date</span><strong>{fmtDate(item.dueDate)}</strong></div>
            <div className="po-info-item"><span>Mandatory</span><strong>{item.mandatory ? <span style={{ color: '#dc2626', fontWeight: 700 }}>Required</span> : <span style={{ color: '#16a34a' }}>Optional</span>}</strong></div>
            {item.completedOn && <div className="po-info-item"><span>Completed On</span><strong>{fmtDate(item.completedOn)}</strong></div>}
            <div className="po-info-item" style={{ gridColumn: '1/-1' }}><span>Title</span><strong>{item.title}</strong></div>
          </div>
        </div>
        <div className="po-drawer-footer">
          <button className="po-btn po-btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
};

const VendorTraining = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(trainingData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const mandatory = items.filter(i => i.mandatory);
  const completedMandatory = mandatory.filter(i => i.status === 'Completed');
  const progress = mandatory.length > 0 ? Math.round((completedMandatory.length / mandatory.length) * 100) : 0;

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    return (item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || item.status === statusFilter);
  });

  return (
    <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Training & Compliance</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Complete all mandatory training and review required compliance documents.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 320 }}>
            <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
            <input
              type="text"
              placeholder="Search training items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, outline: 'none', color: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <FiX size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              const headers = ['Training Code', 'Title', 'Type', 'Status', 'Due Date', 'Mandatory'];
              const rows = filteredData.map(t => [t.id, t.title, t.type, t.status, t.due, t.mandatory ? 'Yes' : 'No']);
              const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
              const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'training.csv'; a.click();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <FiDownload size={15} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {[
          { icon: <FiBookOpen size={24} color="#3b82f6" />, bg: '#eff6ff', title: 'TOTAL TRAINING', value: '6', sub: 'All assigned training', path: 'all' },
          { icon: <FiCheck size={24} color="#10b981" />, bg: '#f0fdf4', title: 'COMPLETED', value: '2', sub: '33% of total', subColor: '#10b981', path: 'completed' },
          { icon: <FiClock size={24} color="#f59e0b" />, bg: '#fffbeb', title: 'IN PROGRESS', value: '1', sub: '17% of total', subColor: '#f59e0b', path: 'in-progress' },
          { icon: <FiFileText size={24} color="#8b5cf6" />, bg: '#f5f3ff', title: 'PENDING', value: '3', sub: '50% of total', subColor: '#8b5cf6', path: 'pending' }
        ].map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => navigate(`/vendor-portal/training/list/${kpi.path}`)}
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

      {/* Progress & Donut Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Mandatory Progress */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: '32px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Mandatory Training Progress</div>
            <div style={{ fontSize: 14, color: '#64748b' }}><strong style={{ color: '#16a34a' }}>2</strong> of 5 completed (40%)</div>
          </div>
          <div style={{ height: 12, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `40%`, background: '#16a34a', borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Donut Chart */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          {(() => {
            const [hovered, setHovered] = React.useState(null);
            const data = [
              { id: 'pending', label: 'Pending (3)', val: '3', pct: '50%', color: '#ef4444', dash: '125.6 251.2', off: '0' },
              { id: 'in_progress', label: 'In Progress (1)', val: '1', pct: '17%', color: '#f59e0b', dash: '42.7 251.2', off: '-125.6' },
              { id: 'completed', label: 'Completed (2)', val: '2', pct: '33%', color: '#10b981', dash: '82.9 251.2', off: '-168.3' },
              { id: 'na', label: 'Not Applicable (0)', val: '0', pct: '0%', color: '#3b82f6', dash: '0 251.2', off: '-251.2' },
            ];
            const activeData = hovered ? data.find(d => d.id === hovered) : { label: 'Total', val: '6' };

            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', width: 140, height: 140 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                    {[...data].reverse().map(item => (
                      <circle
                        key={item.id}
                        cx="50" cy="50" r="40"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={hovered === item.id ? 20 : 16}
                        strokeDasharray={item.dash}
                        strokeDashoffset={item.off}
                        style={{ transition: 'all 0.3s ease', cursor: 'pointer', opacity: hovered && hovered !== item.id ? 0.3 : 1 }}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    ))}
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{activeData.label.split(' ')[0]}</div>
                    <div style={{ fontSize: 24, color: '#0f172a', fontWeight: 700, lineHeight: 1.1 }}>{activeData.val}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.map(d => (
                    <div 
                      key={d.id} 
                      style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', opacity: hovered && hovered !== d.id ? 0.4 : 1 }}
                      onMouseEnter={() => setHovered(d.id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                      <span style={{ color: '#475569', width: 110 }}>{d.label}</span>
                      <strong style={{ color: '#0f172a', width: 30, textAlign: 'right' }}>{d.pct}</strong>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* Pills & Filters */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f1f5f9' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mock dropdowns for design fidelity */}
            <select style={{ appearance: 'none', padding: '10px 32px 10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#475569', outline: 'none' }}>
              <option>All Categories</option>
            </select>
            <select style={{ appearance: 'none', padding: '10px 32px 10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#475569', outline: 'none' }}>
              <option>All Types</option>
            </select>
            <select style={{ appearance: 'none', padding: '10px 32px 10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#475569', outline: 'none' }}>
              <option>All Status</option>
            </select>
            <button style={{ padding: '10px 16px', background: 'none', border: 'none', fontSize: 13, fontWeight: 500, color: '#64748b', cursor: 'pointer' }}>Clear Filters</button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TITLE</th>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CATEGORY</th>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TYPE</th>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DUE DATE</th>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MANDATORY</th>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>STATUS</th>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PROGRESS</th>
                <th style={{ padding: '16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const s = TRN_STATUS_COLORS[emp.status];
                const typeIcon = emp.type === 'Document' ? <FiFileText size={14} color="#3b82f6" /> : (emp.type === 'Video' ? <FiVideo size={14} color="#10b981" /> : <FiLock size={14} color="#8b5cf6" />);
                const typeBg = emp.type === 'Document' ? '#eff6ff' : (emp.type === 'Video' ? '#f0fdf4' : '#f5f3ff');
                const catColor = emp.category === 'Compliance' ? { bg: '#eff6ff', col: '#3b82f6' } : (emp.category === 'Safety' ? { bg: '#f0fdf4', col: '#16a34a' } : { bg: '#f5f3ff', col: '#8b5cf6' });

                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => setSelected(emp)}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: typeBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {typeIcon}
                        </div>
                        <span style={{ fontWeight: 600, color: '#3b82f6', fontSize: 13 }}>{emp.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{emp.title}</td>
                    <td style={{ padding: '16px' }}><span style={{ padding: '4px 10px', borderRadius: 6, background: catColor.bg, color: catColor.col, fontSize: 12, fontWeight: 600 }}>{emp.category}</span></td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{emp.type}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#475569', fontWeight: 500 }}>{fmtDate(emp.dueDate)}</td>
                    <td style={{ padding: '16px' }}>
                      {emp.mandatory 
                        ? <span style={{ padding: '4px 10px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600 }}>Required</span>
                        : <span style={{ padding: '4px 10px', borderRadius: 6, background: '#eff6ff', color: '#3b82f6', fontSize: 12, fontWeight: 600 }}>Optional</span>}
                    </td>
                    <td style={{ padding: '16px' }}><span style={{ padding: '4px 10px', borderRadius: 6, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600 }}>{emp.status}</span></td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 6, background: '#f1f5f9', borderRadius: 99 }}>
                          <div style={{ width: `${emp.progress}%`, height: '100%', background: s.color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{emp.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        {emp.status === 'Completed' ? (
                          <button style={{ padding: '6px 12px', borderRadius: 6, background: '#eff6ff', color: '#3b82f6', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View Certificate</button>
                        ) : emp.status === 'In Progress' ? (
                          <button style={{ padding: '6px 12px', borderRadius: 6, background: '#16a34a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Continue</button>
                        ) : (
                          <button style={{ padding: '6px 12px', borderRadius: 6, background: '#10b981', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Mark Complete</button>
                        )}
                        <button style={{ width: 30, height: 30, borderRadius: 6, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <span style={{ transform: 'rotate(90deg)' }}>...</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <TrainingDrawer item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default VendorTraining;
