import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import StatusBadge from '../../components/common/StatusBadge';
import { fetchEmployerApplications } from '../../api/jobApi';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const BASE_URL = 'http://127.0.0.1:8000';

const buildMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployerApplications()
      .then((data) => {
        const allApps = Array.isArray(data) ? data : [];
        setApplications(allApps.filter((app) => app.status === 'pending'));
      })
      .catch(() => setError('Failed to load applications.'))
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
              <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">Applications</h1>
              <p className="text-[15px] text-[#9ca3af] font-medium">Review and manage job applications.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-16">
              <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center p-12 text-red-500">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-[#136040] text-white rounded-xl text-sm">
                Retry
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center p-12 text-[#9ca3af]">
              <p>No applications received yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Applicant</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Job Title</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Category</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Status</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Applied</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">CV</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#136040] flex items-center justify-center font-bold text-sm text-white shrink-0">
                            {app.seeker_name?.split(' ').map((n) => n[0]).join('') || '?'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-[#111827]">{app.seeker_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{app.job_title}</td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{app.job_category}</td>
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{formatDate(app.applied_at)}</td>
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        {(() => {
                          const cvUrl = buildMediaUrl(app.cv_snapshot || app.cv_url || null);
                          return cvUrl ? (
                            <button
                              onClick={() => window.open(cvUrl, '_blank')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#136040]/10 text-[#136040] text-xs font-semibold rounded-lg hover:bg-[#136040]/20 transition-colors border-none shadow-none"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View CV
                            </button>
                          ) : (
                            <span className="text-xs text-[#9ca3af]">No CV</span>
                          );
                        })()}
                      </td>
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <Link
                          to={`/employer/applications/${app.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-[#136040] text-white text-xs font-medium rounded-lg hover:bg-[#0f4f34] transition-colors no-underline"
                        >
                          View
                        </Link>
                      </td>
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
