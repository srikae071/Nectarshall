import React, { useState } from 'react';
import { FiSearch, FiX, FiCheck, FiBookOpen, FiAlertCircle } from 'react-icons/fi';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css';

const today = () => new Date().toISOString().split('T')[0];
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const TRN_STATUS_COLORS = {
  'Pending':     { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'In Progress': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Completed':   { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

const ALL_STATUSES = ['All', 'Pending', 'In Progress', 'Completed'];

const initialTraining = [
  { id: 'TRN-001', title: 'Vendor Code of Conduct', category: 'Compliance', type: 'Document', dueDate: '2026-09-01', status: 'Pending', mandatory: true, completedOn: null, description: 'Review and acknowledge the company\'s vendor code of conduct, covering ethical standards, conflict of interest, and compliance obligations.' },
  { id: 'TRN-002', title: 'Health & Safety Induction', category: 'Safety', type: 'Video', dueDate: '2026-09-15', status: 'Completed', mandatory: true, completedOn: '2026-08-10', description: 'Mandatory health and safety induction video covering site entry procedures, emergency exits, PPE requirements, and incident reporting.' },
  { id: 'TRN-003', title: 'Data Protection & GDPR Policy', category: 'Compliance', type: 'Document', dueDate: '2026-09-01', status: 'Pending', mandatory: true, completedOn: null, description: 'Read and sign acknowledgement of the company data protection policy in compliance with GDPR. Covers data handling, storage, and breach notification.' },
  { id: 'TRN-004', title: 'Site Access & Visitor Procedures', category: 'Operations', type: 'Document', dueDate: '2026-10-01', status: 'In Progress', mandatory: false, completedOn: null, description: 'Guidelines for accessing company sites, signing in, visitor badge protocol, and restricted area procedures.' },
  { id: 'TRN-005', title: 'Emergency Evacuation Procedures', category: 'Safety', type: 'Document', dueDate: '2026-09-30', status: 'Completed', mandatory: true, completedOn: '2026-08-05', description: 'Emergency evacuation plan covering assembly points, fire safety, and vendor responsibilities during emergency drills.' },
  { id: 'TRN-006', title: 'Anti-Bribery & Corruption Policy', category: 'Compliance', type: 'Document', dueDate: '2026-09-01', status: 'Pending', mandatory: true, completedOn: null, description: 'Read and acknowledge the Anti-Bribery and Corruption policy, covering gifts, hospitality, facilitation payments, and reporting obligations.' },
];

const TrainingDrawer = ({ item, onClose }) => {
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
            <div className="po-info-item" style={{ gridColumn: '1/-1' }}><span>Description</span><strong style={{ fontWeight: 400, color: '#475569', lineHeight: 1.6 }}>{item.description}</strong></div>
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
  const [items, setItems] = useState(initialTraining);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const mandatory = items.filter(i => i.mandatory);
  const completedMandatory = mandatory.filter(i => i.status === 'Completed');
  const progress = mandatory.length > 0 ? (completedMandatory.length / mandatory.length) * 100 : 0;

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    return (item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || item.status === statusFilter);
  });

  const markComplete = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'Completed', completedOn: today() } : i));
    setConfirmId(null);
  };

  return (
    <div className="vendor-dashboard-wrapper">
      <div className="vendor-dashboard-header">
        <div>
          <h1>Training & Compliance</h1>
          <p>Complete all mandatory training and review required compliance documents.</p>
        </div>
        <div className="vendor-header-actions">
          <div className="po-search-box">
            <FiSearch className="po-search-icon" />
            <input className="po-search-input" placeholder="Search training items…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="po-search-clear" onClick={() => setSearch('')}><FiX size={14} /></button>}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="vendor-section-card" style={{ marginBottom: 16, padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Mandatory Training Progress</div>
          <div style={{ fontSize: 13, color: '#64748b' }}><strong style={{ color: '#16a34a' }}>{completedMandatory.length}</strong> of {mandatory.length} completed</div>
        </div>
        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#16a34a', borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div className="po-filter-tabs">
        {ALL_STATUSES.map(s => (
          <button key={s} className={`po-filter-tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
            {s}
            <span className="po-filter-count">{s === 'All' ? items.length : items.filter(i => i.status === s).length}</span>
          </button>
        ))}
      </div>

      <div className="vendor-section-card">
        {filtered.length === 0 ? (
          <div className="po-empty-state"><FiBookOpen size={40} /><h3>No items found</h3><p>Try adjusting your search or filter.</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="vendor-table po-table">
              <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Type</th><th>Due Date</th><th>Mandatory</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(item => {
                  const s = TRN_STATUS_COLORS[item.status];
                  return (
                    <tr key={item.id} className="po-row" style={{ cursor: 'pointer' }} onClick={() => setSelected(item)}>
                      <td className="po-id-cell">{item.id}</td>
                      <td style={{ fontWeight: 500 }}>{item.title}</td>
                      <td>{item.category}</td>
                      <td>{item.type}</td>
                      <td>{fmtDate(item.dueDate)}</td>
                      <td>
                        {item.mandatory
                          ? <span className="po-status-badge" style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca', fontSize: '10px' }}>Required</span>
                          : <span className="po-status-badge" style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0', fontSize: '10px' }}>Optional</span>}
                      </td>
                      <td><span className="po-status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>{item.status}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        {item.status === 'Completed'
                          ? <span style={{ fontSize: 11, color: '#94a3b8' }}>Done {fmtDate(item.completedOn)}</span>
                          : <button className="po-btn po-btn-success" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setConfirmId(item.id)}><FiCheck size={11} /> Mark Complete</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <TrainingDrawer item={selected} onClose={() => setSelected(null)} />}

      {confirmId && (
        <div className="po-overlay" onClick={() => setConfirmId(null)}>
          <div className="po-dialog" onClick={e => e.stopPropagation()}>
            <div className="po-dialog-header">
              <h3>Mark as Completed</h3>
              <button className="po-icon-btn" onClick={() => setConfirmId(null)}><FiX /></button>
            </div>
            <div className="po-dialog-body">
              <p className="po-dialog-msg">Confirm that you have completed <strong>{items.find(i => i.id === confirmId)?.title}</strong>? This will be recorded as completed today.</p>
            </div>
            <div className="po-dialog-footer">
              <button className="po-btn po-btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="po-btn po-btn-success" onClick={() => markComplete(confirmId)}><FiCheck /> Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorTraining;
