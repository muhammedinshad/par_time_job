import React from 'react';

const ApplicationCard = ({ application }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] mb-4 shadow-sm">
      <h3 className="text-[#111827] text-lg font-semibold mb-2">{application.title}</h3>
      <p className="text-[#6b7280]">Status: <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${application.status.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-[#1d8258]/10 text-[#1d8258]'}`}>{application.status}</span></p>
    </div>
  );
};

export default ApplicationCard;
