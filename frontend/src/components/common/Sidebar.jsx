import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutApi } from '../../api/authApi';
import { logout } from '../../store/authSlice';
import {
  Squares2X2Icon,
  BriefcaseIcon,
  DocumentTextIcon,
  UsersIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Squares2X2Icon as Squares2X2Solid } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    { to: '/employer/dashboard', label: 'Dashboard', icon: Squares2X2Icon, solidIcon: Squares2X2Solid, end: true },
    { to: '/employer/my-jobs', label: 'My Jobs', icon: BriefcaseIcon, badge: '12+' },
    { to: '/employer/applications', label: 'Applications', icon: DocumentTextIcon },
    { to: '/employer/selected-job-seekers', label: 'Selected Job Seekers', icon: UsersIcon },
  ];

  const generalItems = [
    { to: '/employer/profile', label: 'Profile', icon: UserIcon },
    { to: '/employer/settings', label: 'Settings', icon: Cog6ToothIcon },
    { to: '/employer/help', label: 'Help', icon: QuestionMarkCircleIcon },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logout());
      navigate('/login');
    }
  };
  

  return (
    <aside className="w-[260px] bg-white border-r border-[#f0f0f0] flex flex-col shrink-0 h-screen overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-8 mt-8 mb-10">
        <div className="w-8 h-8 relative shrink-0">
          <span className="absolute border-[3px] border-[#136040] rounded-full w-7 h-7 top-0 left-0"></span>
          <span className="absolute border-[3px] border-[#1d8258] rounded-full w-[18px] h-[18px] top-[5px] left-[5px]"></span>
          <span className="absolute bg-[#136040] rounded-full w-[10px] h-[10px] top-[9px] left-[9px]"></span>
        </div>
        <h2 className="text-[22px] font-bold text-[#111827] m-0">Donezo</h2>
      </div>

      {/* Menu Section */}
      <div className="mb-8">
        <h3 className="text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider px-8 mb-4">MENU</h3>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-2.5 relative transition-colors hover:bg-black/[0.04] ${
                  isActive ? 'text-[#111827] font-bold' : 'text-[#9ca3af] font-medium hover:text-[#4b5563]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-8 bg-[#136040] rounded-r-md"></div>
                  )}
                  {isActive && item.solidIcon ? (
                    <item.solidIcon className="w-[22px] h-[22px] text-[#136040]" />
                  ) : (
                    <item.icon className={`w-[22px] h-[22px] ${isActive ? 'text-[#136040]' : 'text-[#9ca3af]'}`} />
                  )}
                  <span className="text-[15px]">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-[#136040] text-white text-[10px] font-bold px-2 py-[2px] rounded-full">{item.badge}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* General Section */}
      <div className="mb-8 mt-8">
        <h3 className="text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider px-8 mb-4">GENERAL</h3>
        <nav className="flex flex-col gap-1">
          {generalItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-2.5 relative transition-colors hover:bg-black/[0.04] ${
                  isActive ? 'text-[#111827] font-bold' : 'text-[#9ca3af] font-medium hover:text-[#4b5563]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-8 bg-[#136040] rounded-r-md"></div>
                  )}
                  <item.icon className={`w-[22px] h-[22px] ${isActive ? 'text-[#136040]' : 'text-[#9ca3af]'}`} />
                  <span className="text-[15px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-8 py-2.5 text-[#9ca3af] font-medium transition-colors hover:bg-black/[0.04] hover:text-[#4b5563] mt-4 w-full text-left bg-transparent border-none rounded-none shadow-none"
          >
            <ArrowRightOnRectangleIcon className="w-[22px] h-[22px] text-[#9ca3af] rotate-180" />
            <span className="text-[15px]">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
