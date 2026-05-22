import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const selectedSeekers = [
  { id: 1, name: 'Emily Davis', email: 'emily.d@email.com', job: 'Web Developer', status: 'Accepted', selectedDate: '2026-05-18' },
  { id: 2, name: 'Michael Chen', email: 'm.chen@email.com', job: 'Graphic Designer', status: 'Shortlisted', selectedDate: '2026-05-17' },
];

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SelectedJobSeekers = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] text-[#111827] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        <div className="px-10 pb-10 flex-1 max-w-[1400px]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">Selected Job Seekers</h1>
              <p className="text-[15px] text-[#9ca3af] font-medium">Candidates you've shortlisted or accepted.</p>
            </div>
          </div>

          {selectedSeekers.length === 0 ? (
            <div className="text-center p-12 text-[#9ca3af]">
              <UserGroupIcon className="w-12 h-12 opacity-30 mb-4 mx-auto text-[#9ca3af]" />
              <p>No selected job seekers yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Name</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Job</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Status</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Selected Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSeekers.map((seeker) => (
                    <tr key={seeker.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#136040] flex items-center justify-center font-bold text-sm text-white shrink-0">
                            {seeker.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-[#111827]">{seeker.name}</span>
                            <span className="text-xs text-[#9ca3af]">{seeker.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{seeker.job}</td>
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${seeker.status === 'Accepted' ? 'bg-[#1d8258]/10 text-[#1d8258]' : 'bg-[#136040]/10 text-[#136040]'}`}>
                          {seeker.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{formatDate(seeker.selectedDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SelectedJobSeekers;
