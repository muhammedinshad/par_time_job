import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import { fetchEmployerJobDetail } from '../../api/jobApi';

const CATEGORY_LABELS = {
  restaurant: 'Restaurant & Food',
  events: 'Events & Entertainment',
  health_care: 'Health & Care',
  education: 'Education & Tutoring',
  delivery: 'Delivery',
  other: 'Other',
};

const JOB_TYPE_LABELS = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
};

const EmployerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployerJobDetail(id)
      .then((data) => setJob(data))
      .catch(() => setError('Failed to load job.'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] font-sans flex z-[9999] overflow-hidden m-0 p-0">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-y-auto">
          <EmployerNavbar />
          <div className="px-10 pb-10 flex-1">
            <div className="text-center p-12 text-red-500">{error || 'Job not found.'}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        <div className="px-10 pb-10 flex-1 w-full max-w-[700px] mx-auto">
          <div className="flex items-center justify-between mb-8 mt-6">
            <div>
              <button
                onClick={() => navigate('/employer/my-jobs')}
                className="text-sm text-[#136040] font-medium hover:underline mb-2 bg-transparent p-0 border-none shadow-none hover:translate-y-0"
              >
                &larr; Back to My Jobs
              </button>
              <h1 className="text-[28px] font-bold text-[#111827] tracking-tight mb-1.5">{job.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${job.is_active ? 'bg-[#1d8258]/10 text-[#1d8258]' : 'bg-red-500/10 text-red-500'}`}>
                {job.is_active ? 'Active' : 'Closed'}
              </span>
            </div>
            <button
              onClick={() => navigate(`/employer/my-jobs/${id}/edit`)}
              className="px-6 py-2.5 bg-[#136040] hover:bg-[#1d8258] text-white text-[14px] font-medium rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#79d89a]/40"
            >
              Edit Job
            </button>
          </div>

          <div className="bg-[#ffffff] rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Category</p>
                <p className="text-[14px] text-[#111827] capitalize">{CATEGORY_LABELS[job.category] || job.category?.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Job Type</p>
                <p className="text-[14px] text-[#111827]">{JOB_TYPE_LABELS[job.job_type] || job.job_type}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Location</p>
                <p className="text-[14px] text-[#111827]">{job.location}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Timing</p>
                <p className="text-[14px] text-[#111827]">{job.timing || '-'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Salary Range</p>
                <p className="text-[14px] text-[#111827]">{job.salary_range || '-'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Available Slots</p>
                <p className="text-[14px] text-[#111827]">{job.slots || '-'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">Description</p>
              <p className="text-[14px] text-[#111827] leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Posted On</p>
              <p className="text-[14px] text-[#111827]">{formatDate(job.created_at)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerJobDetail;
