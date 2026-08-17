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
    if (p.includes('employees')) return 'Employee Directory';
    if (p.includes('training')) return 'Training & Dev';
    return 'Dashboard';
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
                <span>Dashboard</span>
              </div>
            </div>
          </div>
        </div>


        {/* PURCHASE */}
        <div className="vendor-sidebar-section">
          <div className="vendor-sidebar-section-title">PURCHASE</div>
          <div className="vendor-sidebar-nav">
            <NavLink path="/vendor-portal/purchase-orders" icon={FiFileText} label="Purchase Orders" />
            <NavLink path="/vendor-portal/invoices"        icon={FiFile}     label="Invoices" />
          </div>
        </div>

        <div className="vendor-sidebar-footer">
          <div className="vendor-sidebar-profile">
            <div className="vendor-sidebar-profile-icon"><FiShield /></div>
            <div className="vendor-sidebar-profile-info">
              <span className="vendor-sidebar-profile-name">Wwe Vendors</span>
              <span className="vendor-sidebar-profile-role">Vendor ID: VND-1024</span>
            </div>
          </div>
          <FiChevronRight className="vendor-sidebar-chevron" />
        </div>
      </div>

      {/* Main Content */}
      <div className="vendor-main-content">
        <div className="vendor-top-header">
          <div className="vendor-breadcrumb">
            <span className="vendor-breadcrumb-parent vendor-breadcrumb-link" onClick={() => navigate('/')}>Nectershell</span>
            <FiChevronRight className="vendor-breadcrumb-separator" />
            <span className="vendor-breadcrumb-current">{breadcrumbLabel()}</span>
          </div>
          <div className="vendor-top-actions">
            <div className="vendor-top-icon-btn">
              <FiBell size={18} />
              <span className="vendor-notification-dot"></span>
            </div>
            <div className="vendor-top-profile">
              <div className="vendor-top-profile-text">
                <span className="vendor-top-profile-name">Wwe Vendors</span>
                <span className="vendor-top-profile-role">Vendor</span>
              </div>
              <FiChevronDown className="vendor-top-profile-chevron" size={14} />
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
