import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { EnvelopeIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const EmployerNavbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const displayName = user?.name || user?.username || user?.email?.split('@')[0] || 'Employer';
  const displayEmail = user?.email || '';

  // Generate avatar URL from name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=136040&color=ffffff&bold=true`;

  return (
    <header className="h-[80px] flex items-center justify-between px-10 bg-transparent shrink-0">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <button
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:shadow transition-shadow border-none shadow-sm"
          style={{ padding: 0 }}
        >
          <EnvelopeIcon className="w-5 h-5 text-[#4b5563]" />
        </button>
        <button
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:shadow transition-shadow border-none shadow-sm relative"
          style={{ padding: 0 }}
        >
          <BellIcon className="w-5 h-5 text-[#4b5563]" />
        </button>

        {/* Profile avatar — clickable, navigates to /employer/profile */}
        <button
          onClick={() => navigate('/employer/profile')}
          className="flex items-center gap-3 ml-4 py-2 px-3 rounded-full bg-[#f0f7f4] hover:bg-[#e6f2ec] transition-colors border-none shadow-none cursor-pointer"
          title="View Profile"
        >
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-[42px] h-[42px] rounded-full object-cover"
          />
          <div className="flex flex-col pr-2 text-left">
            <span className="text-[14px] font-bold text-[#111827] leading-tight">
              {displayName}
            </span>
            <span className="text-[12px] text-[#9ca3af] font-medium flex items-center gap-1">
              <UserCircleIcon className="w-3 h-3" />
              My Profile
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default EmployerNavbar;
