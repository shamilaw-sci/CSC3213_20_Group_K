/**
 * Topbar.jsx — Fixed top navigation bar
 */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Dropdown, Badge, Avatar } from 'antd';
import { MdNotifications, MdSearch, MdLogout, MdPerson, MdSettings } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PAGE_TITLES = {
  '/admin/dashboard':  { title: 'Dashboard',         subtitle: 'Overview & insights' },
  '/admin/students':   { title: 'Student Management', subtitle: 'Manage student records' },
  '/admin/careers':    { title: 'Career Management',  subtitle: 'Manage career paths' },
  '/admin/skills':     { title: 'Skills Management',  subtitle: 'Manage skill catalogue' },
  '/admin/resources':  { title: 'Learning Resources', subtitle: 'Manage educational resources' },
  '/admin/feedback':   { title: 'Feedback',           subtitle: 'Student feedback & reviews' },
  '/admin/analytics':  { title: 'Analytics',          subtitle: 'Data insights & trends' },
  '/admin/reports':    { title: 'Reports',            subtitle: 'Generate & export reports' },
  '/admin/settings':   { title: 'Settings',           subtitle: 'System configuration' },
  '/admin/profile':    { title: 'My Profile',         subtitle: 'Account information' },
};

const Topbar = ({ collapsed }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const page = PAGE_TITLES[location.pathname] || { title: 'Dashboard', subtitle: '' };
  const initials = admin?.name ? admin.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'AD';

  const profileMenu = {
    items: [
      { key: 'profile',  icon: <MdPerson />,   label: 'My Profile',  onClick: () => navigate('/admin/profile') },
      { key: 'settings', icon: <MdSettings />, label: 'Settings',    onClick: () => navigate('/admin/settings') },
      { type: 'divider' },
      {
        key: 'logout', icon: <MdLogout style={{ color: '#ef4444' }} />,
        label: <span style={{ color: '#ef4444' }}>Logout</span>,
        onClick: () => { logout(); navigate('/admin/login'); }
      },
    ],
  };

  return (
    <header className={`admin-topbar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        <div>
          <div className="topbar-page-title">{page.title}</div>
          <div className="topbar-breadcrumb">{page.subtitle}</div>
        </div>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <Badge count={3} size="small">
          <button className="topbar-icon-btn" title="Notifications">
            <MdNotifications />
          </button>
        </Badge>

        {/* Profile dropdown */}
        <Dropdown menu={profileMenu} trigger={['click']} placement="bottomRight">
          <div className="topbar-avatar" title={admin?.name || 'Admin'}>
            {initials}
          </div>
        </Dropdown>

        {admin && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text)' }}>
              {admin.name || 'Administrator'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>
              {admin.role || 'Super Admin'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
