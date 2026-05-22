import React from 'react';
import { EnvelopeIcon, BellIcon } from '@heroicons/react/24/outline';

const EmployerNavbar = () => {
  return (
    <header className="h-[80px] flex items-center justify-between px-10 bg-transparent shrink-0">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:shadow transition-shadow border-none shadow-sm" style={{ padding: 0 }}>
          <EnvelopeIcon className="w-5 h-5 text-[#4b5563]" />
        </button>
        <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:shadow transition-shadow border-none shadow-sm relative" style={{ padding: 0 }}>
          <BellIcon className="w-5 h-5 text-[#4b5563]" />
        </button>
        <div className="flex items-center gap-3 ml-4 py-2 px-3 rounded-full bg-[#fdf8f6]">
          <img
            src="https://ui-avatars.com/api/?name=Totok+Michael&background=fecdd3&color=be123c"
            alt="Profile"
            className="w-[42px] h-[42px] rounded-full object-cover"
          />
          <div className="flex flex-col pr-2">
            <span className="text-[14px] font-bold text-[#111827] leading-tight">Totok Michael</span>
            <span className="text-[12px] text-[#9ca3af] font-medium">tmichael20@mail.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployerNavbar;
