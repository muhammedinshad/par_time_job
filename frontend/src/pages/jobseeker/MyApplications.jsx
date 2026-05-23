import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyApplications } from '../../api/jobApi';
import StatusBadge from '../../components/common/StatusBadge';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyApplications()
      .then((data) => {
        const allApps = Array.isArray(data) ? data : [];
        setApplications(allApps.filter((app) => app.status === 'accepted'));
      })
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between mb-8 mt-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">My Applications</h1>
          <p className="text-[15px] text-[#9ca3af] font-medium">Track your job applications.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16">
          <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center p-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#136040] text-white rounded-xl text-sm">
            Retry
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center p-12 text-[#9ca3af]">
          <p className="mb-4">You haven't applied to any jobs yet.</p>
          <Link
            to="/jobseeker/dashboard/browse-jobs"
            className="inline-flex px-6 py-3 bg-[#136040] text-white text-sm font-semibold rounded-xl hover:bg-[#0f4f34] transition-colors no-underline"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-[#e5e7eb] overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Job Title</th>
                <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Company</th>
                <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Status</th>
                <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Applied</th>
                <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50"></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="p-4 text-sm font-medium text-[#111827] border-b border-[#e5e7eb]">
                    {app.job_title}
                  </td>
                  <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">
                    {app.employer_name}
                  </td>
                  <td className="p-4 text-sm border-b border-[#e5e7eb]">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">
                    {formatDate(app.applied_at)}
                  </td>
                  <td className="p-4 text-sm border-b border-[#e5e7eb]">
                    <Link
                      to={`/jobseeker/dashboard/my-applications/${app.id}`}
                      state={{ application: app }}
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
  );
};

export default MyApplications;
