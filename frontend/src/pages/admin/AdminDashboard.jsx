import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#111827] mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] text-[#111827] shadow-sm">Total Users: 150</div>
        <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] text-[#111827] shadow-sm">Total Jobs: 45</div>
        <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] text-[#111827] shadow-sm">Reports: 2</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
