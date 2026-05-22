import React from 'react';

const JobSeekerDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#111827] mb-6">Job Seeker Dashboard</h1>
      <div className="flex gap-6">
        <p className="bg-white p-6 rounded-2xl border border-[#e5e7eb] text-[#111827] shadow-sm">Applied Jobs: 12</p>
        <p className="bg-white p-6 rounded-2xl border border-[#e5e7eb] text-[#111827] shadow-sm">Shortlisted: 2</p>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
