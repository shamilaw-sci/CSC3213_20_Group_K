/**
 * Sidebar.jsx — Collapsible admin sidebar navigation
 */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import {
  MdDashboard, MdPeople, MdWork, MdPsychology, MdMenuBook,
  MdFeedback, MdBarChart, MdAssessment, MdSettings, MdPerson,
  MdLogout, MdChevronLeft, MdChevronRight
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { path: '/admin/dashboard',  icon: <MdDashboard />,  label: 'Dashboard' },
      { path: '/admin/students',   icon: <MdPeople />,     label: 'Students' },
      { path: '/admin/careers',    icon: <MdWork />,       label: 'Careers' },
      { path: '/admin/skills',     icon: <MdPsychology />, label: 'Skills' },
      { path: '/admin/resources',  icon: <MdMenuBook />,   label: 'Learning Resources' },
      { path: '/admin/feedback',   icon: <MdFeedback />,   label: 'Feedback' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { path: '/admin/analytics',  icon: <MdBarChart />,   label: 'Analytics' },
      { path: '/admin/reports',    icon: <MdAssessment />, label: 'Reports' },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/admin/settings',   icon: <MdSettings />,   label: 'Settings' },
      { path: '/admin/profile',    icon: <MdPerson />,     label: 'Profile' },
    ],
  },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">🎓</div>
        <div className="admin-sidebar__brand-text">
          <h3>FuturePath AI</h3>
          <span>Admin Dashboard</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="admin-sidebar__nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="admin-sidebar__section-label">{section.label}</div>
            {section.items.map((item) => (
              collapsed ? (
                <Tooltip key={item.path} title={item.label} placement="right">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `admin-sidebar__item ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="sidebar-item-icon">{item.icon}</span>
                    <span className="sidebar-item-label">{item.label}</span>
                  </NavLink>
                </Tooltip>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-sidebar__item ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span className="sidebar-item-label">{item.label}</span>
                </NavLink>
              )
            ))}
          </div>
        ))}

        {/* Logout */}
        {collapsed ? (
          <Tooltip title="Logout" placement="right">
            <div className="admin-sidebar__item logout-item" onClick={handleLogout}>
              <span className="sidebar-item-icon"><MdLogout /></span>
              <span className="sidebar-item-label">Logout</span>
            </div>
          </Tooltip>
        ) : (
          <div className="admin-sidebar__item logout-item" onClick={handleLogout}>
            <span className="sidebar-item-icon"><MdLogout /></span>
            <span className="sidebar-item-label">Logout</span>
          </div>
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="admin-sidebar__footer">
        <button className="sidebar-collapse-btn" onClick={onToggle}>
          {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
