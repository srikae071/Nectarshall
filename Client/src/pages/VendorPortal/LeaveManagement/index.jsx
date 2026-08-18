import React, { useState } from 'react';
import { FiSearch, FiX, FiCalendar, FiUser } from 'react-icons/fi';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const DEPT_COLORS = {
  'Procurement': { bg: '#eff6ff', color: '#2563eb' },
  'Finance':     { bg: '#f0fdf4', color: '#16a34a' },
  'IT':          { bg: '#f5f3ff', color: '#7c3aed' },
  'Legal':       { bg: '#fff7ed', color: '#ea580c' },
};

const AVAIL_STATUS = {
  'Available': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'On Leave':  { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'Planned':   { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
};

const contacts = [
  { id: 1, name: 'Sarah Mitchell', role: 'Procurement Manager', dept: 'Procurement', leaveType: 'Annual Leave', startDate: '2026-08-15', endDate: '2026-08-22', status: 'On Leave', cover: 'James Hartley', initials: 'SM' },
  { id: 2, name: 'James Hartley', role: 'Finance Controller', dept: 'Finance', leaveType: null, startDate: null, endDate: null, status: 'Available', cover: null, initials: 'JH' },
  { id: 3, name: 'Priya Nair', role: 'IT Liaison', dept: 'IT', leaveType: 'Sick Leave', startDate: '2026-08-13', endDate: '2026-08-14', status: 'On Leave', cover: 'James Hartley', initials: 'PN' },
  { id: 4, name: 'David Chen', role: 'Contract Manager', dept: 'Legal', leaveType: null, startDate: null, endDate: null, status: 'Available', cover: null, initials: 'DC' },
  { id: 5, name: 'Emma Brown', role: 'Accounts Payable', dept: 'Finance', leaveType: 'Casual Leave', startDate: '2026-08-20', endDate: '2026-08-20', status: 'Planned', cover: 'James Hartley', initials: 'EB' },
];

const VendorLeaveManagement = () => {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const onLeaveList = filtered.filter(c => c.status !== 'Available');

  const getInitialsBg = (dept) => DEPT_COLORS[dept]?.color || '#64748b';

  return (
    <div className="vendor-dashboard-wrapper">
      <div className="vendor-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#0f172a' }}>Leave Management</h1>
          <div style={{ fontSize: 14, color: '#64748b', margin: '8px 0 0 0' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Row 3: Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {/* On Leave Today */}
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: 'none', height: 440, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>On Leave Today</h2>
            <span style={{ fontSize: 13, color: '#f43f5e', cursor: 'pointer' }}>View all</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
             {[
               {i: 'AA', n: 'Adam Admin', t: 'Casual Leave', d: 'Aug 25', bg: '#ef4444'},
               {i: 'AS', n: 'Alexander Smith', t: 'Casual Leave', d: 'Aug 28', bg: '#78716c'},
               {i: 'AC', n: 'Amelia Cooper', t: 'Casual Leave', d: 'Aug 03 – Aug 05', bg: '#ea580c'},
               {i: 'CW', n: 'Charlotte White', t: 'Casual Leave', d: 'Aug 02', bg: '#0ea5e9'},
               {i: 'CW', n: 'Charlotte White', t: 'Sick Leave', d: 'Aug 30', bg: '#0ea5e9'},
             ].map((x, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div style={{ width: 40, height: 40, borderRadius: '50%', background: x.bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>{x.i}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{x.n}</div>
                   <div style={{ fontSize: 13, color: '#64748b' }}>{x.t}</div>
                 </div>
                 <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{x.d}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Upcoming Leaves */}
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: 'none', height: 440, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Upcoming Leaves</h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>Next 7 days</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
             {[
               {i: 'SM', n: 'Sebastian Mitchell', t: 'Casual Leave · Aug 01 – Aug 31', d: '-13d', bg: '#22c55e', bb: '#dcfce7', bc: '#16a34a'},
               {i: 'CW', n: 'Charlotte White', t: 'Casual Leave · Aug 02', d: '-12d', bg: '#0ea5e9', bb: '#dcfce7', bc: '#16a34a'},
               {i: 'AC', n: 'Amelia Cooper', t: 'Casual Leave · Aug 03 – Aug 05', d: '-11d', bg: '#ea580c', bb: '#dcfce7', bc: '#16a34a'},
               {i: 'CM', n: 'Chloe Morgan', t: 'Casual Leave · Aug 14', d: '0d', bg: '#3b82f6', bb: '#dcfce7', bc: '#16a34a'},
               {i: 'AA', n: 'Adam Admin', t: 'Casual Leave · Aug 25', d: '11d', bg: '#ef4444', bb: '#dcfce7', bc: '#16a34a'},
             ].map((x, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div style={{ width: 40, height: 40, borderRadius: '50%', background: x.bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>{x.i}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{x.n}</div>
                   <div style={{ fontSize: 13, color: '#64748b' }}>{x.t}</div>
                 </div>
                 <div style={{ fontSize: 12, fontWeight: 700, color: x.bc, background: x.bb, padding: '4px 8px', borderRadius: 4 }}>{x.d}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Top Leave Takers */}
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: 'none', height: 440, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Top Leave Takers</h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>August 2026</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
             {[
               {i: 'SM', n: 'Sebastian Mitchell', t: '1 request(s)', d: '23d', bg: '#86efac'},
               {i: 'AC', n: 'Amelia Cooper', t: '1 request(s)', d: '3d', bg: '#f97316'},
               {i: 'AA', n: 'Adam Admin', t: '1 request(s)', d: '1d', bg: '#ef4444'},
               {i: 'SA', n: 'Sarah Anderson', t: '1 request(s)', d: '1d', bg: '#f59e0b'},
               {i: 'AS', n: 'Alexander Smith', t: '1 request(s)', d: '1d', bg: '#78716c'},
             ].map((x, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div style={{ width: 40, height: 40, borderRadius: '50%', background: x.bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>{x.i}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{x.n}</div>
                   <div style={{ fontSize: 13, color: '#64748b' }}>{x.t}</div>
                 </div>
                 <div style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>{x.d}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
      {/* Row 2: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 24 }}>
        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Leave by Department</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, marginBottom: 32 }}>August 2026</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 140, fontSize: 14, color: '#475569', textAlign: 'right', paddingRight: 20 }}>Finance</div>
              <div style={{ flex: 1, position: 'relative', height: 28, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                <div style={{ width: '96%', height: '100%', background: '#f43f5e', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 600 }}>24d (2)</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 140, fontSize: 14, color: '#475569', textAlign: 'right', paddingRight: 20 }}>Human Resources</div>
              <div style={{ flex: 1, position: 'relative', height: 28, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                <div style={{ width: '12%', height: '100%', background: '#22c55e', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 12, color: 'white', fontSize: 13, fontWeight: 600 }}>3d (1)</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 140, fontSize: 14, color: '#475569', textAlign: 'right', paddingRight: 20 }}>Engineering</div>
              <div style={{ flex: 1, position: 'relative', height: 28, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                <div style={{ width: '8%', height: '100%', background: '#f59e0b', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 12, color: 'white', fontSize: 13, fontWeight: 600 }}>2d (2)</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 140, fontSize: 14, color: '#475569', textAlign: 'right', paddingRight: 20 }}>Sales</div>
              <div style={{ flex: 1, position: 'relative', height: 28, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                <div style={{ width: '4%', height: '100%', background: '#f43f5e', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, color: 'white', fontSize: 13, fontWeight: 600 }}>1d</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 140, fontSize: 14, color: '#475569', textAlign: 'right', paddingRight: 20 }}>Marketing</div>
              <div style={{ flex: 1, position: 'relative', height: 28, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                <div style={{ width: '4%', height: '100%', background: '#3b82f6', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, color: 'white', fontSize: 13, fontWeight: 600 }}>1d</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
              <div style={{ width: 140 }}></div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingLeft: 12, borderTop: '1px solid #e2e8f0', paddingTop: 12, fontSize: 14, color: '#64748b' }}>
                <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vendor-section-card" style={{ marginBottom: 0, padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Leave Utilization</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, marginBottom: 32 }}>Used vs remaining by leave type — all employees</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 120, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Sick Leave</div>
              <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: '0%', height: '100%', background: '#22c55e' }}></div>
              </div>
              <div style={{ width: 50, textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#22c55e' }}>0%</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 120, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Casual Leave</div>
              <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: '2.4%', height: '100%', background: '#22c55e' }}></div>
              </div>
              <div style={{ width: 50, textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#22c55e' }}>2.4%</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default VendorLeaveManagement;
