import React from 'react';

const BrowseJobs = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#111827] mb-6">Find Your Next Job</h1>
      <div className="mb-6">
        <input type="text" placeholder="Search jobs..." className="w-full max-w-md" />
      </div>
      <div>
        <p className="text-[#6b7280]">No jobs found.</p>
      </div>
    </div>
  );
};

export default BrowseJobs;
