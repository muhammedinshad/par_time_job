import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import StatusBadge from '../../components/common/StatusBadge';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { fetchEmployerApplications } from '../../api/jobApi';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SelectedJobSeekers = () => {
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployerApplications()
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        setSeekers(all.filter((app) => app.status === 'accepted'));
      })
      .catch(() => setError('Failed to load selected seekers.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] text-[#111827] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        <div className="px-10 pb-10 flex-1 max-w-[1400px]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">Selected Job Seekers</h1>
              <p className="text-[15px] text-[#9ca3af] font-medium">Candidates you've accepted.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-16">
              <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center p-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : seekers.length === 0 ? (
            <div className="text-center p-12 text-[#9ca3af]">
              <UserGroupIcon className="w-12 h-12 opacity-30 mb-4 mx-auto text-[#9ca3af]" />
              <p>No accepted applicants yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Name</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Job</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Status</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {seekers.map((seeker) => (
                    <tr key={seeker.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#136040] flex items-center justify-center font-bold text-sm text-white shrink-0">
                            {seeker.seeker_name?.split(' ').map((n) => n[0]).join('') || '?'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-[#111827]">{seeker.seeker_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{seeker.job_title}</td>
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <StatusBadge status={seeker.status} />
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{formatDate(seeker.applied_at)}</td>
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
