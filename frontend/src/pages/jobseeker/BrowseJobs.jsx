import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchJobs } from '../../api/jobApi';

const CATEGORY_LABELS = {
  restaurant: 'Restaurant & Food',
  events: 'Events & Entertainment',
  health_care: 'Health & Care',
  education: 'Education & Tutoring',
  delivery: 'Delivery',
  software_sevelopment:'Software Development',
  other: 'Other',
};

const JOB_TYPE_LABELS = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
};

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const debounceRef = useRef(null);

  const loadJobs = (q, cat) => {
    setLoading(true);
    searchJobs(q, cat || undefined)
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load jobs.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs('', '');
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadJobs(value, categoryFilter);
    }, 400);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    loadJobs(search, value);
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-8 mt-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">Browse Jobs</h1>
          <p className="text-[15px] text-[#9ca3af] font-medium">Find your next opportunity.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title, company, or location..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 text-[14px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040]"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="w-full px-4 py-3 text-[14px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040]"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
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
      ) : jobs.length === 0 ? (
        <div className="text-center p-12 text-[#9ca3af]">
          <p>No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobseeker/dashboard/jobs/${job.id}`}
              className="block bg-white rounded-[20px] border border-[#e5e7eb] p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 no-underline"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-[#136040]/10 flex items-center justify-center text-[#136040] font-bold text-sm shrink-0">
                  {job.employer_name?.charAt(0) || 'C'}
                </div>
                <span className="text-[11px] font-medium text-[#9ca3af] bg-gray-100 px-2.5 py-1 rounded-full">
                  {CATEGORY_LABELS[job.category] || job.category}
                </span>
              </div>

              <h3 className="text-[16px] font-bold text-[#111827] mb-1.5 line-clamp-1">{job.title}</h3>
              <p className="text-[13px] text-[#6b7280] mb-3">{job.employer_name}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[11px] text-[#6b7280] bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                  {job.location}
                </span>
                <span className="text-[11px] text-[#6b7280] bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                  {JOB_TYPE_LABELS[job.job_type] || job.job_type}
                </span>
                {job.salary_range && (
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    {job.salary_range}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-[12px] text-[#9ca3af]">
                  {job.slots ? `${job.slots} slot${job.slots > 1 ? 's' : ''} available` : 'Open'}
                </span>
                <span className="text-[12px] font-medium text-[#136040]">View Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;
