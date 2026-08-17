import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiX, FiVideo, FiFileText, FiLock, FiBookOpen } from 'react-icons/fi';
import { trainingData, TrainingDrawer, TRN_STATUS_COLORS } from './index';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const TrainingList = () => {
  const { filterType } = useParams();
  const navigate = useNavigate();
  
  const [items, setItems] = useState(trainingData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Map URL param to status filter
    if (filterType === 'pending') setStatusFilter('Pending');
    else if (filterType === 'in-progress') setStatusFilter('In Progress');
    else if (filterType === 'completed') setStatusFilter('Completed');
    else setStatusFilter('All');
  }, [filterType]);

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    return (item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || item.status === statusFilter);
  });

  const getTitle = () => {
    if (filterType === 'pending') return 'Pending Training';
    if (filterType === 'in-progress') return 'In Progress Training';
    if (filterType === 'completed') return 'Completed Training';
    return 'All Training';
  };

  return (
    <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button 
          onClick={() => navigate('/vendor-portal/training')}
          style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
        >
          <FiArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a' }}>{getTitle()}</h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
          </div>
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
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* Pills & Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'All', count: items.length },
              { label: 'Pending', count: items.filter(i => i.status === 'Pending').length },
              { label: 'In Progress', count: items.filter(i => i.status === 'In Progress').length },
              { label: 'Completed', count: items.filter(i => i.status === 'Completed').length }
            ].filter(pill => pill.label === statusFilter).map(pill => (
              <button 
                key={pill.label}
                style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'default', border: 'none', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {pill.label} <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>{pill.count}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select style={{ appearance: 'none', padding: '10px 32px 10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#475569', outline: 'none' }}>
              <option>All Categories</option>
            </select>
            <select style={{ appearance: 'none', padding: '10px 32px 10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#475569', outline: 'none' }}>
              <option>All Types</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ appearance: 'none', padding: '10px 32px 10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#475569', outline: 'none' }}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button style={{ padding: '10px 16px', background: 'none', border: 'none', fontSize: 13, fontWeight: 500, color: '#64748b', cursor: 'pointer' }}>Clear Filters</button>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <FiBookOpen size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, color: '#0f172a', margin: '0 0 8px 0' }}>No items found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Try adjusting your filters or search term.</p>
          </div>
        ) : (
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
        )}
      </div>

      {selected && <TrainingDrawer item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default TrainingList;
