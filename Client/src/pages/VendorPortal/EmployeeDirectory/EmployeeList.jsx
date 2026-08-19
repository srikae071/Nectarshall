import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApiData, extractArrayData } from '../../../utils/apiClient';
import { FiArrowLeft, FiSearch, FiX, FiMail, FiMapPin, FiUsers, FiUserCheck, FiBriefcase, FiUserPlus, FiMoreHorizontal, FiList, FiGrid, FiChevronDown } from 'react-icons/fi';
import { ALL_EMP_COLUMNS, EmpDrawer } from './index';
import '../Dashboard/index.css';

const EmployeeList = () => {
  const { filterType: routeParam } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Column Settings
  const [showSettings, setShowSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(ALL_EMP_COLUMNS.map(c => c.key));

  const filterType = decodeURIComponent(routeParam || 'total');

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
        const isActive = emp.accountActive !== undefined 
          ? Boolean(emp.accountActive) 
          : emp.accountEnabled !== undefined 
          ? Boolean(emp.accountEnabled) 
          : emp.status ? emp.status.toLowerCase() === "active" : true;

        return {
          id: emp.employeeId || `EMP-${index + 101}`,
          name: name,
          title: emp.jobTitle || emp.position || "Employee",
          dept: emp.department || "General",
          email: emp.email || emp.workEmail || "N/A",
          location: emp.officeLocation || emp.place || emp.city || "Head Office",
          status: isActive ? "Active" : "Inactive",
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

  const toggleColumn = (key) => {
    if (visibleColumns.includes(key)) {
      if (visibleColumns.length === 1) return;
      setVisibleColumns(visibleColumns.filter(c => c !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  const totalEmployees = employees.length;
  const uniqueDepts = [...new Set(employees.map(e => e.dept))];

  const getFilteredList = () => {
    const t = filterType.toLowerCase();
    if (t === 'active' || t === 'total') return employees;
    if (t === 'new') return [];
    if (t === 'departments') return employees;
    return employees;
  };

  const currentEmployees = getFilteredList();

  const filtered = currentEmployees.filter(e => {
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
    const t = filterType.toLowerCase();
    if (t === 'active') return 'Active Employees';
    if (t === 'new') return 'New Hire Employees';
    if (t === 'departments') return 'Employees by Department';
    return 'Total Employees';
  };

  // ── NEW HIRE dedicated view ──────────────────────────────────────────
  // ── NEW HIRE dedicated view ──────────────────────────────────────────
  if (filterType.toLowerCase() === 'new') {
    const NewHireView = () => {
      const [candidates, setCandidates] = React.useState([]);
      const [loading, setLoading] = React.useState(true);
      const [activeStage, setActiveStage] = React.useState('OPEN');
      const [searchQuery, setSearchQuery] = React.useState('');

      React.useEffect(() => {
        loadJobRequests();
      }, []);

      const loadJobRequests = async () => {
        try {
          setLoading(true);
          const res = await fetchApiData("/api/jobrequests");
          const rawList = extractArrayData(res.data || []);
          const formatted = rawList.map((item, idx) => {
            const name =
              item.requesterName ||
              item.candidateName ||
              item.name ||
              item.companyName ||
              item.fullName ||
              `Candidate #${idx + 101}`;
            
            const role =
              item.category ||
              item.role ||
              item.position ||
              item.designation ||
              item.jobTitle ||
              item.serviceType ||
              "Position N/A";

            const dept =
              item.department ||
              item.dept ||
              item.serviceType ||
              "Human Resources";

            const rawStatus = String(
              item.status || item.stage || "Open"
            ).trim();
            const sLower = rawStatus.toLowerCase();

            let normalizedStatus = "Open";
            if (sLower.includes("interview")) {
              normalizedStatus = "Interview";
            } else if (sLower.includes("pre")) {
              normalizedStatus = "Pre-joining";
            } else if (
              sLower.includes("resolve") ||
              sLower.includes("complete") ||
              sLower.includes("boarded") ||
              sLower.includes("close")
            ) {
              normalizedStatus = "Resolved";
            }

            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : item.date || "N/A";

            return {
              id: item.caseId || item._id || `NH-${101 + idx}`,
              name: name,
              role: role,
              dept: dept,
              date: dateStr,
              status: normalizedStatus,
              rawStatus: rawStatus,
            };
          });

          setCandidates(formatted);
        } catch (err) {
          console.error("Error loading jobrequests in NewHireView:", err);
        } finally {
          setLoading(false);
        }
      };

      const openCandidates = candidates.filter((c) => c.status === "Open");
      const interviewCandidates = candidates.filter((c) => c.status === "Interview");
      const preJoiningCandidates = candidates.filter((c) => c.status === "Pre-joining");
      const resolvedCandidates = candidates.filter((c) => c.status === "Resolved");

      const stageCards = [
        {
          title: "OPEN",
          candidates: openCandidates,
          sub: "Positions currently open",
          color: "#3b82f6",
          bg: "#eff6ff",
          emoji: "📂",
        },
        {
          title: "INTERVIEW",
          candidates: interviewCandidates,
          sub: "Scheduled interviews",
          color: "#8b5cf6",
          bg: "#f5f3ff",
          emoji: "🎙️",
        },
        {
          title: "PRE-JOINING",
          candidates: preJoiningCandidates,
          sub: "Awaiting joining formalities",
          color: "#f59e0b",
          bg: "#fef3c7",
          emoji: "📋",
        },
        {
          title: "RESOLVE",
          candidates: resolvedCandidates,
          sub: "Successfully onboarded",
          color: "#10b981",
          bg: "#d1fae5",
          emoji: "✅",
        },
      ];

      const currentStageCard = stageCards.find((c) => c.title === activeStage) || stageCards[0];

      const filteredCandidates = currentStageCard.candidates.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.dept.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
        );
      });

      return (
        <div className="vendor-dashboard-wrapper" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={() => navigate('/vendor-portal/employees')}
                style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a' }}>New Hire Management</h1>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Sourced from Job Requests database table</p>
              </div>
            </div>

            <div style={{ position: 'relative', width: 320 }}>
              <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
              <input
                type="text"
                placeholder="Search candidates by name, role, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 14, outline: 'none', color: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 4 Clickable Stage Cards */}
          <div className="vendor-grid-kpi" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 32 }}>
            {stageCards.map((card, i) => {
              const isActive = activeStage === card.title;
              return (
                <div
                  className="vendor-kpi-card"
                  key={i}
                  onClick={() => setActiveStage(card.title)}
                  style={{
                    cursor: 'pointer',
                    borderBottom: isActive ? `3px solid ${card.color}` : '1px solid #f8fafc',
                    transform: isActive ? 'translateY(-3px)' : 'none',
                    boxShadow: isActive ? `0 8px 20px ${card.color}22` : '0 4px 12px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div className="vendor-kpi-bg-circle"></div>
                  <div className="vendor-kpi-icon-container" style={{ color: card.color, background: card.bg, fontSize: 20 }}>
                    {card.emoji}
                  </div>
                  <div className="vendor-kpi-label">{card.title}</div>
                  <div className="vendor-kpi-value">{loading ? "..." : card.candidates.length}</div>
                  <div className="vendor-kpi-badge" style={{ background: card.bg, color: card.color }}>{card.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Candidate Table — Always Visible for Selected Stage */}
          <div className="vendor-section-card" style={{ width: "100%" }}>
            <div className="vendor-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="vendor-section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
                <span style={{ fontSize: 20 }}>{currentStageCard.emoji}</span>
                {currentStageCard.title.charAt(0) + currentStageCard.title.slice(1).toLowerCase()} Candidates
                <span className="vendor-kpi-badge" style={{ background: currentStageCard.bg, color: currentStageCard.color, fontSize: 12 }}>
                  {filteredCandidates.length} records
                </span>
              </h2>
            </div>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                ⌛ Loading Boarding Candidates from backend...
              </div>
            ) : (
              <table className="vendor-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ width: '12%' }}>CASE ID</th>
                    <th style={{ width: '25%' }}>CANDIDATE NAME</th>
                    <th style={{ width: '22%' }}>ROLE</th>
                    <th style={{ width: '18%' }}>DEPARTMENT</th>
                    <th style={{ width: '13%' }}>ONBOARDING DATE</th>
                    <th style={{ width: '10%' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                        No candidates found under status {currentStageCard.title}.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((c, j) => {
                      const initialLetters = (c.name || "C")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <tr
                          key={j}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ fontWeight: 600, color: '#94a3b8' }}>{c.id}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: '50%',
                                  background: currentStageCard.color,
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: 12,
                                  flexShrink: 0,
                                }}
                              >
                                {initialLetters}
                              </div>
                              <span style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                            </div>
                          </td>
                          <td style={{ color: '#475569' }}>{c.role}</td>
                          <td>
                            <span style={{ padding: '3px 10px', borderRadius: 6, background: '#eff6ff', color: '#3b82f6', fontSize: 12, fontWeight: 600 }}>
                              {c.dept}
                            </span>
                          </td>
                          <td style={{ color: '#64748b', fontSize: 13 }}>{c.date}</td>
                          <td>
                            <span
                              className="vendor-badge"
                              style={{
                                background: currentStageCard.bg,
                                color: currentStageCard.color,
                                border: `1px solid ${currentStageCard.color}33`,
                              }}
                            >
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      );
    };

    return <NewHireView />;
  }
  // ── END NEW HIRE view ─────────────────────────────────────────────────

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
              placeholder="Search by employee name, title or department..."
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
              </select>
              <FiChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} size={16} />
            </div>

            {(search || deptFilter !== 'All' || statusFilter !== 'All' || locationFilter !== 'All') && (
              <button onClick={clearFilters} style={{ padding: '10px 16px', background: 'none', border: 'none', fontSize: 13, fontWeight: 500, color: '#64748b', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                Clear Filters
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Settings Icon Dropdown Button (Icon only) */}
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
                title="Settings"
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
                    ⚙️ Settings
                  </div>

                  {ALL_EMP_COLUMNS.map(col => (
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

            <div style={{ display: 'flex', background: '#f8fafc', padding: 4, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}><FiList size={16} /></button>
              <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#64748b', border: 'none', borderRadius: 6, cursor: 'pointer' }}><FiGrid size={16} /></button>
            </div>
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
            <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {ALL_EMP_COLUMNS.map(col => (
                    <th
                      key={col.key}
                      style={{
                        width: col.width,
                        padding: '16px 20px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: col.key === 'action' ? 'center' : 'left',
                        visibility: visibleColumns.includes(col.key) ? 'visible' : 'hidden',
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => setSelected(emp)}>
                    <td style={{ width: '22%', padding: '16px 20px', visibility: visibleColumns.includes('name') ? 'visible' : 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: emp.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{emp.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{emp.name}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '18%', padding: '16px 20px', fontSize: 14, color: '#0f172a', fontWeight: 500, visibility: visibleColumns.includes('title') ? 'visible' : 'hidden' }}>
                      {emp.title}
                    </td>
                    <td style={{ width: '15%', padding: '16px 20px', visibility: visibleColumns.includes('dept') ? 'visible' : 'hidden' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 6, background: '#eff6ff', color: '#3b82f6', fontSize: 12, fontWeight: 600 }}>{emp.dept}</span>
                    </td>
                    <td style={{ width: '18%', padding: '16px 20px', fontSize: 14, color: '#3b82f6', fontWeight: 500, visibility: visibleColumns.includes('email') ? 'visible' : 'hidden' }}>
                      {emp.email}
                    </td>
                    <td style={{ width: '12%', padding: '16px 20px', fontSize: 14, color: '#0f172a', fontWeight: 500, visibility: visibleColumns.includes('location') ? 'visible' : 'hidden' }}>
                      {emp.location}
                    </td>
                    <td style={{ width: '10%', padding: '16px 20px', visibility: visibleColumns.includes('status') ? 'visible' : 'hidden' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 6, background: emp.status === 'Active' ? '#f0fdf4' : '#fef2f2', color: emp.status === 'Active' ? '#16a34a' : '#dc2626', fontSize: 12, fontWeight: 600 }}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ width: '5%', padding: '16px 20px', textAlign: 'center', visibility: visibleColumns.includes('action') ? 'visible' : 'hidden' }}>
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
