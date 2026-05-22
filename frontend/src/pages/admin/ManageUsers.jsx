import React from 'react';

const ManageUsers = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#111827] mb-6">Manage Users</h1>
      <table className="bg-white rounded-2xl border border-[#e5e7eb] w-full shadow-sm">
        <thead>
          <tr>
            <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">User</th>
            <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Role</th>
            <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Status</th>
            <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4 text-sm text-[#111827] border-b border-[#e5e7eb]">Jane Smith</td>
            <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">Employer</td>
            <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">Active</td>
            <td className="p-4 text-sm border-b border-[#e5e7eb]"><button className="px-4 py-2 text-sm">Deactivate</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
