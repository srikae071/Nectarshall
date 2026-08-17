import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiX, FiUsers, FiMoreHorizontal, FiList, FiGrid, FiChevronDown, FiMapPin, FiMail } from 'react-icons/fi';
import { fetchApiData } from '../../../utils/apiClient';

export const EmpDrawer = ({ emp, onClose }) => (
  <>
    <div className="po-overlay" onClick={onClose} />
    <div className="po-drawer">
      <div className="po-drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: emp.color || '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{emp.initials}</div>
          <div>
            <div className="po-drawer-id" style={{ marginBottom: 2 }}>{emp.name}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{emp.title}</div>
          </div>
        </div>
        <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
      </div>
      <div className="po-drawer-body">
        <div className="po-info-grid">
          <div className="po-info-item"><span>Employee ID</span><strong>{emp.id}</strong></div>
          <div className="po-info-item"><span>Department</span><strong>{emp.dept}</strong></div>
          <div className="po-info-item"><span>Location</span><strong><FiMapPin size={11} style={{ marginRight: 4 }} />{emp.location}</strong></div>
          <div className="po-info-item"><span>Joining Date</span><strong>{emp.joiningDate}</strong></div>
          <div className="po-info-item"><span>Status</span><strong><span className="po-status-badge" style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>{emp.status}</span></strong></div>
          <div className="po-info-item" style={{ gridColumn: '1/-1' }}><span>Email</span><strong>{emp.email}</strong></div>
        </div>
      </div>
      <div className="po-drawer-footer">
        <button className="po-btn po-btn-ghost" onClick={onClose}>Close</button>
        <button className="po-btn po-btn-primary" onClick={() => { window.location.href = `mailto:${emp.email}`; }}>
          <FiMail /> Send Email
        </button>
      </div>
    </div>
  </>
);

const EmployeeList = () => {
  const { filterType } = useParams();
  const navigate = useNavigate();
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetchApiData("/api/employees");
      const emps = (res.data || []).map((emp, index) => {
        const name = emp.displayName || emp.employeeName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unnamed Employee";
        const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "EP";
        const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ea4104', '#059669', '#0284c7'];
        return {
          id: emp.employeeId || `EMP-${index + 101}`,
          name: name,
          title: emp.jobTitle || "Employee",
          dept: emp.department || "General",
          email: emp.email || "N/A",
          location: emp.officeLocation || emp.place || "Head Office",
          status: emp.accountEnabled !== false ? "Active" : "Inactive",
          joiningDate: emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "N/A",
          initials: initials,
          color: colors[index % colors.length]
        };
      });
      setEmployees(emps);
    } catch (err) {
      console.error("Error loading employees in EmployeeList:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterType === 'active') {
      setStatusFilter('Active');
    } else {
      setStatusFilter('All');
    }
  }, [filterType]);

  const totalEmployees = employees.length;
  const uniqueDepts = [...new Set(employees.map(e => e.dept))];

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.dept === deptFilter;
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchLoc = locationFilter === 'All' || e.location === locationFilter;
    return matchSearch && matchDept && matchStatus && matchLoc;
  });

  const clearFilters = () => {
    setSearch('');
    setDeptFilter('All');
    setStatusFilter('All');
    setLocationFilter('All');
  };

  const getTitle = () => {
    if (filterType === 'active') return 'Active Employees';
    if (filterType === 'departments') return 'Departments';
    if (filterType === 'new') return 'New This Month';
    return 'All Employees';
  };

  return (
    <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button 
          onClick={() => navigate('/vendor-portal/employees')}
          style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
        >
          <FiArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a' }}>{getTitle()}</h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Showing {filtered.length} contact{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ position: 'relative', width: 320 }}>
            <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
            <input
              type="text"
              placeholder="Search by name, title or department..."
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
        
        {/* Department Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <button 
            onClick={() => setDeptFilter('All')}
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: deptFilter === 'All' ? '#0f172a' : '#f8fafc', color: deptFilter === 'All' ? '#fff' : '#475569', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            All Departments <span style={{ background: deptFilter === 'All' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>{totalEmployees}</span>
          </button>
          {uniqueDepts.map(dept => {
            const count = employees.filter(e => e.dept === dept).length;
            const active = deptFilter === dept;
            return (
              <button 
                key={dept}
                onClick={() => setDeptFilter(dept)}
                style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: active ? '#0f172a' : '#f8fafc', color: active ? '#fff' : '#475569', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {dept} <span style={{ background: active ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                style={{ appearance: 'none', padding: '10px 36px 10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#0f172a', outline: 'none', cursor: 'pointer' }}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <FiChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} size={16} />
            </div>

            {(search || deptFilter !== 'All' || statusFilter !== 'All' || locationFilter !== 'All') && (
              <button onClick={clearFilters} style={{ padding: '10px 16px', background: 'none', border: 'none', fontSize: 13, fontWeight: 500, color: '#64748b', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table Area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading employees from database...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <FiUsers size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, color: '#0f172a', margin: '0 0 8px 0' }}>No employees found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Try adjusting your search term.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMPLOYEE</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TITLE</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DEPARTMENT</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMAIL</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LOCATION</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>STATUS</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => setSelected(emp)}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: emp.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{emp.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{emp.name}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{emp.title}</td>
                    <td style={{ padding: '16px 20px' }}><span style={{ padding: '4px 10px', borderRadius: 6, background: '#eff6ff', color: '#3b82f6', fontSize: 12, fontWeight: 600 }}>{emp.dept}</span></td>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#3b82f6', fontWeight: 500 }}>{emp.email}</td>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{emp.location}</td>
                    <td style={{ padding: '16px 20px' }}><span style={{ padding: '4px 10px', borderRadius: 6, background: '#f0fdf4', color: '#16a34a', fontSize: 12, fontWeight: 600 }}>{emp.status}</span></td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <button style={{ width: 32, height: 32, borderRadius: 6, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}>
                        <FiMoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <EmpDrawer emp={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default EmployeeList;
