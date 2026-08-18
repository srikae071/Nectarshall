import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiX, FiChevronRight, FiMessageSquare } from 'react-icons/fi';
import { initialCases, StatusBadge, PriorityBadge, fmtDate, CaseDetailDrawer } from './index';

const CaseList = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  
  // Determine which cases to show based on the URL param
  const filterType = decodeURIComponent(type || 'all');
  
  const displayCases = initialCases.filter(c => {
    if (filterType.toLowerCase() === 'all') return true;
    return c.status.toLowerCase() === filterType.toLowerCase();
  });

  const filtered = displayCases.filter(c => {
    const q = search.toLowerCase();
    return c.id.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q);
  });

  const getTitle = () => {
    if (filterType.toLowerCase() === 'all') return 'All Cases';
    return `${filterType} Cases`;
  };

  return (
    <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button 
          onClick={() => navigate('/vendor-portal/cases')}
          style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
        >
          <FiArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a', textTransform: 'capitalize' }}>{getTitle()}</h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Showing {filtered.length} case{filtered.length !== 1 ? 's' : ''}</p>
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
            {search && (
              <button 
                onClick={() => setSearch('')} 
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Case List Table */}
      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <FiMessageSquare size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, color: '#0f172a', margin: '0 0 8px 0' }}>No cases found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>We couldn't find any cases matching your search criteria.</p>
          </div>
        ) : (
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
                    <td style={{ padding: '16px', fontSize: 13, fontWeight: 600, color: '#3b82f6', whiteSpace: 'nowrap' }}>{c.id}</td>
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
        )}
      </div>

      {selected && <CaseDetailDrawer c={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default CaseList;
