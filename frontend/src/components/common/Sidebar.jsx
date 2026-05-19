import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Squares2X2Icon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserGroupIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

const sidebarLinks = [
  { path: '/employer/dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { path: '/employer/my-jobs', label: 'My Jobs', icon: BriefcaseIcon },
  { path: '/employer/applications', label: 'Applications', icon: DocumentTextIcon },
  { path: '/employer/selected-job-seekers', label: 'Selected Job Seekers', icon: UserGroupIcon },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <BriefcaseIcon className="sidebar-logo-icon" />
        <span className="sidebar-brand">Employer</span>
      </div>

      <nav className="sidebar-nav">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/employer/dashboard'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <link.icon className="sidebar-link-icon" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-add-btn" onClick={() => navigate('/employer/post-job')}>
        <PlusCircleIcon className="sidebar-add-icon" />
        <span>Add Job</span>
      </button>
    </aside>
  );
};

export default Sidebar;
