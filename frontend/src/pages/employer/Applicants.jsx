import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';

const applicants = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', job: 'Web Developer', status: 'pending', appliedDate: '2026-05-18' },
  { id: 2, name: 'Michael Chen', email: 'm.chen@email.com', job: 'Graphic Designer', status: 'shortlisted', appliedDate: '2026-05-17' },
  { id: 3, name: 'Emily Davis', email: 'emily.d@email.com', job: 'Web Developer', status: 'accepted', appliedDate: '2026-05-16' },
  { id: 4, name: 'James Wilson', email: 'j.wilson@email.com', job: 'Content Writer', status: 'pending', appliedDate: '2026-05-15' },
  { id: 5, name: 'Olivia Brown', email: 'olivia.b@email.com', job: 'Graphic Designer', status: 'rejected', appliedDate: '2026-05-14' },
];

const statusStyle = {
  pending: 'bg-amber-50 text-amber-600',
  shortlisted: 'bg-[#136040]/10 text-[#136040]',
  accepted: 'bg-[#1d8258]/10 text-[#1d8258]',
  rejected: 'bg-red-50 text-red-500',
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Applicants = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] text-[#111827] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        <div className="px-10 pb-10 flex-1 max-w-[1400px]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">Applications</h1>
              <p className="text-[15px] text-[#9ca3af] font-medium">Review and manage job applications.</p>
            </div>
          </div>

          {applicants.length === 0 ? (
            <div className="text-center p-12 text-[#9ca3af]"><p>No applications received yet.</p></div>
          ) : (
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Applicant</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Job</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Status</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#136040] flex items-center justify-center font-bold text-sm text-white shrink-0">
                            {app.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-[#111827]">{app.name}</span>
                            <span className="text-xs text-[#9ca3af]">{app.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{app.job}</td>
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[app.status]}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{formatDate(app.appliedDate)}</td>
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

export default Applicants;
