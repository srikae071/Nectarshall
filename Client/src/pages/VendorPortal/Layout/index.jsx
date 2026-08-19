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
        <div className="vendor-top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '32px' }}>
          <div className="vendor-breadcrumb">
            <span className="vendor-breadcrumb-parent vendor-breadcrumb-link" onClick={() => navigate('/')}>Nectershell</span>
            <FiChevronRight className="vendor-breadcrumb-separator" />
            <span className="vendor-breadcrumb-current">{breadcrumbLabel()}</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span 
              onClick={() => navigate('/vendor-portal/cases')} 
              style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: isActive('/vendor-portal/cases') ? '#3b82f6' : '#64748b', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#3b82f6'}
              onMouseLeave={e => e.target.style.color = isActive('/vendor-portal/cases') ? '#3b82f6' : '#64748b'}
            >
              Case Management
            </span>
            <span 
              onClick={() => navigate('/vendor-portal/leave')} 
              style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: isActive('/vendor-portal/leave') ? '#3b82f6' : '#64748b', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#3b82f6'}
              onMouseLeave={e => e.target.style.color = isActive('/vendor-portal/leave') ? '#3b82f6' : '#64748b'}
            >
              Leave Management
            </span>
            <span 
              onClick={() => navigate('/vendor-portal/employees')} 
              style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: isActive('/vendor-portal/employees') ? '#3b82f6' : '#64748b', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#3b82f6'}
              onMouseLeave={e => e.target.style.color = isActive('/vendor-portal/employees') ? '#3b82f6' : '#64748b'}
            >
              Employee Management
            </span>
            <span 
              onClick={() => navigate('/vendor-portal/training')} 
              style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: isActive('/vendor-portal/training') ? '#3b82f6' : '#64748b', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#3b82f6'}
              onMouseLeave={e => e.target.style.color = isActive('/vendor-portal/training') ? '#3b82f6' : '#64748b'}
            >
              Training & Dev
            </span>
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
