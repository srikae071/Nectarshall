import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid, FiFileText, FiFile, FiShield, FiChevronRight,
  FiBell, FiChevronDown, FiMessageSquare, FiCalendar, FiUsers, FiBookOpen
} from 'react-icons/fi';
import './index.css';

const VendorPortalLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const breadcrumbLabel = () => {
    const p = location.pathname;
    if (p.includes('purchase-orders')) return 'Purchase Orders';
    if (p.includes('invoices')) return 'Invoices';
    if (p.includes('cases')) return 'Case Management';
    if (p.includes('leave')) return 'Leave Management';
    if (p.includes('employees')) return 'Employee Management';
    if (p.includes('training')) return 'Training & Dev';
    return 'Overview';
  };

  const NavLink = ({ path, icon: Icon, label }) => (
    <div
      className={`vendor-sidebar-link ${isActive(path) ? 'active' : ''}`}
      onClick={() => navigate(path)}
    >
      <div className="vendor-sidebar-link-content">
        <Icon className="vendor-sidebar-icon" />
        <span>{label}</span>
      </div>
      <FiChevronRight className="vendor-sidebar-chevron" />
    </div>
  );

  return (
    <div className="vendor-layout-container">
      {/* Sidebar */}
      <div className="vendor-sidebar">
        <div className="vendor-sidebar-header">
          <div className="vendor-company-logo"><FiShield size={18} /></div>
          <div className="vendor-sidebar-company-info">
            <span className="vendor-company-name">Your Company</span>
            <span className="vendor-company-sub">My Company</span>
          </div>
        </div>

        {/* MAIN MENU */}
        <div className="vendor-sidebar-section">
          <div className="vendor-sidebar-section-title">MAIN MENU</div>
          <div className="vendor-sidebar-nav">
            <div
              className={`vendor-sidebar-link ${isActive('/regular-form') ? 'active' : ''}`}
              onClick={() => navigate('/regular-form')}
            >
              <div className="vendor-sidebar-link-content">
                <FiGrid className="vendor-sidebar-icon" />
                <span>Overview</span>
              </div>
            </div>
          </div>
        </div>




        <div className="vendor-sidebar-footer">
        </div>
      </div>

      {/* Main Content */}
      <div className="vendor-main-content">
        <div className="vendor-top-header" style={{ display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', width: '100%', boxSizing: 'border-box', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div 
              onClick={() => navigate('/regular-form')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14.5px', fontWeight: isActive('/regular-form') ? 600 : 500, color: isActive('/regular-form') ? '#2563eb' : '#64748b', borderBottom: isActive('/regular-form') ? '2.5px solid #2563eb' : '2.5px solid transparent', padding: '16px 4px 14px 4px' }}
            >
              <FiGrid size={16} />
              <span>Overview</span>
            </div>
            <div 
              onClick={() => navigate('/vendor-portal/cases')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14.5px', fontWeight: isActive('/vendor-portal/cases') ? 600 : 500, color: isActive('/vendor-portal/cases') ? '#2563eb' : '#64748b', borderBottom: isActive('/vendor-portal/cases') ? '2.5px solid #2563eb' : '2.5px solid transparent', padding: '16px 4px 14px 4px' }}
            >
              <FiFileText size={16} />
              <span>Case Management</span>
            </div>
            <div 
              onClick={() => navigate('/vendor-portal/employees')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14.5px', fontWeight: isActive('/vendor-portal/employees') ? 600 : 500, color: isActive('/vendor-portal/employees') ? '#2563eb' : '#64748b', borderBottom: isActive('/vendor-portal/employees') ? '2.5px solid #2563eb' : '2.5px solid transparent', padding: '16px 4px 14px 4px' }}
            >
              <FiUsers size={16} />
              <span>Employee Management</span>
            </div>
            <div 
              onClick={() => navigate('/vendor-portal/leave')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14.5px', fontWeight: isActive('/vendor-portal/leave') ? 600 : 500, color: isActive('/vendor-portal/leave') ? '#2563eb' : '#64748b', borderBottom: isActive('/vendor-portal/leave') ? '2.5px solid #2563eb' : '2.5px solid transparent', padding: '16px 4px 14px 4px' }}
            >
              <FiCalendar size={16} />
              <span>Leave Management</span>
            </div>
            <div 
              onClick={() => navigate('/vendor-portal/training')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14.5px', fontWeight: isActive('/vendor-portal/training') ? 600 : 500, color: isActive('/vendor-portal/training') ? '#2563eb' : '#64748b', borderBottom: isActive('/vendor-portal/training') ? '2.5px solid #2563eb' : '2.5px solid transparent', padding: '16px 4px 14px 4px' }}
            >
              <FiBookOpen size={16} />
              <span>Training & Dev</span>
            </div>
          </div>
        </div>
        <div className="vendor-main-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default VendorPortalLayout;
