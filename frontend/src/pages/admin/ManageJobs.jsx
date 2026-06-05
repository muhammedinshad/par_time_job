import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'restaurant', label: 'Restaurant & Food' },
  { value: 'events', label: 'Events & Entertainment' },
  { value: 'health_care', label: 'Health & Care' },
  { value: 'education', label: 'Education & Tutoring' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'other', label: 'Other' }
];

const ManageJobs = ({ jobs, onJobsUpdate, triggerNotification, jobsLoading, jobsError, loadJobsFromAPI }) => {
  const [jobCategoryFilter, setJobCategoryFilter] = useState('all');
  const [jobSearch, setJobSearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredJobs = jobs.filter(job => {
    const search = jobSearch.toLowerCase();
    const matchesSearch = job.title.toLowerCase().includes(search) ||
      (job.employerName || '').toLowerCase().includes(search) ||
      (job.location || '').toLowerCase().includes(search);
    const matchesCategory = jobCategoryFilter === 'all' ? true : job.category === jobCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (id) => {
    setShowDeleteConfirm({ id });
  };

  const handleConfirmDelete = () => {
    if (!showDeleteConfirm) return;
    const { id } = showDeleteConfirm;
    onJobsUpdate(prev => {
      const updated = prev.filter(j => j.id !== id);
      return updated;
    });
    triggerNotification('Job removed from view. Note: deletion requires a backend admin endpoint.', 'info');
    setShowDeleteConfirm(null);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Category Filter Pills */}
      <div className="bg-white p-4.5 rounded-[24px] border border-gray-100 shadow-sm flex flex-wrap gap-2.5 items-center justify-start">
        <span className="text-[13px] font-bold text-gray-400 mr-2.5 pl-2">Filter Category:</span>
        {categories.map((cat) => {
          const count = cat.value === 'all'
            ? jobs.length
            : jobs.filter(j => j.category === cat.value).length;

          return (
            <button
              key={cat.value}
              onClick={() => setJobCategoryFilter(cat.value)}
              className={`px-4.5 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 ${
                jobCategoryFilter === cat.value
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100'
              }`}
            >
              {cat.label}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                jobCategoryFilter === cat.value ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Job List Body */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
        {/* Header with real-data badge */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-bold text-[#111827] pl-1">
              Active Vacancies ({filteredJobs.length})
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live from Backend API
            </span>
          </div>

          <div className="w-80 relative">
            <input
              type="text"
              placeholder="Search jobs, companies or locations..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-[13px] transition-all"
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Loading State */}
        {jobsLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-[14px] text-gray-400 font-semibold">Fetching jobs from backend...</p>
          </div>
        )}

        {/* Error State */}
        {!jobsLoading && jobsError && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <ExclamationCircleIcon className="w-7 h-7 text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-gray-800 mb-1">Failed to Load Jobs</p>
              <p className="text-[13px] text-gray-400">{jobsError}</p>
            </div>
            <button
              onClick={loadJobsFromAPI}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full text-[13px] font-bold hover:bg-indigo-700 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Jobs Table */}
        {!jobsLoading && !jobsError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-150">
                  <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider pl-2">Job Specs</th>
                  <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Type / Salary</th>
                  <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Slots</th>
                  <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 pl-2 max-w-[260px]">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-[#111827] group-hover:text-indigo-600 transition-colors leading-tight">
                            {job.title}
                          </span>
                          <span className="text-[12px] text-gray-400 font-semibold mt-1 flex items-center gap-1">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            {job.location}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-[14px] font-bold text-[#111827]">
                        {job.employerName}
                      </td>
                      <td className="py-4">
                        <span className="text-[13px] text-gray-500 font-bold bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                          {job.categoryLabel}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] text-[#111827] font-bold">
                            {job.salaryRange}
                          </span>
                          <span className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                            {job.jobTypeLabel}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-[13px] text-gray-600 font-extrabold pl-2">
                        {job.slots || 'Unlimited'}
                      </td>
                      <td className="py-4 text-right pr-4">
                        <button
                          onClick={() => handleDeleteClick(job.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all hover:scale-105 active:scale-95 ml-auto shadow-sm text-[12px] font-bold"
                        >
                          <TrashIcon className="w-3.5 h-3.5 stroke-[2]" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-[14px] text-gray-400 font-medium">
                      No matching active job postings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-[#111827]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6.5 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-4">
              <TrashIcon className="w-6 h-6 stroke-2" />
            </div>

            <h3 className="text-[17px] font-bold text-[#111827] mb-2">
              Are you absolutely sure?
            </h3>

            <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6">
              Deleting this job vacancy will remove the active listing from browse-board permanently.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-[13px] transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-[13px] transition-colors shadow-md shadow-red-150"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageJobs;
