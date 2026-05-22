import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] mb-4 shadow-sm">
      <h3 className="text-[#111827] text-lg font-semibold mb-2">{job.title}</h3>
      <p className="text-[#6b7280] mb-4">Applicants: {job.applicants}</p>
      <div className="flex gap-3">
        <button className="px-4 py-2 text-sm">Edit</button>
        <button className="px-4 py-2 text-sm">View Applicants</button>
      </div>
    </div>
  );
};

export default JobCard;
