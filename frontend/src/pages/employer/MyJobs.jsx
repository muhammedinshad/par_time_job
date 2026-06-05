import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import axiosInstance from '../../api/axiosInstance';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('jobs/')
      .then((response) => setJobs(response.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axiosInstance.delete(`jobs/${jobId}/`);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch {
      alert('Failed to delete job.');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] text-[#111827] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        <div className="px-10 pb-10 flex-1 max-w-[1400px]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">My Jobs</h1>
              <p className="text-[15px] text-[#9ca3af] font-medium">Manage your job postings.</p>
            </div>
            <Link to="/employer/post-job" className="flex items-center gap-2 bg-[#176646] text-white px-6 py-3 rounded-full text-[15px] font-semibold hover:bg-[#0f4f34] transition-colors shadow-sm no-underline">
              Post New Job
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-16">
              <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center p-12 text-[#9ca3af]"><p>No jobs posted yet.</p></div>
          ) : (
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Job Title</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Category</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Location</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Slots</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Status</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50">Posted</th>
                    <th className="text-left p-4 text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb] bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="p-4 text-sm text-[#111827] border-b border-[#e5e7eb] font-medium">{job.title}</td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb] capitalize">{job.category?.replace(/_/g, ' ')}</td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{job.location}</td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{job.slots || '-'}</td>
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${job.is_active ? 'bg-[#1d8258]/10 text-[#1d8258]' : 'bg-red-500/10 text-red-500'}`}>
                          {job.is_active ? 'Active' : 'Closed'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#6b7280] border-b border-[#e5e7eb]">{formatDate(job.created_at)}</td>
                      <td className="p-4 text-sm border-b border-[#e5e7eb]">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/employer/my-jobs/${job.id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-[#136040] text-white text-xs font-medium rounded-lg hover:bg-[#0f4f34] transition-colors no-underline"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
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

export default MyJobs;
