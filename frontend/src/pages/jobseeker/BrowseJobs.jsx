import React from 'react';

const BrowseJobs = () => {
  return (
    <div className="browse-jobs">
      <h1>Find Your Next Job</h1>
      <div className="filters">
        <input type="text" placeholder="Search jobs..." />
      </div>
      <div className="job-listings">
        {/* Job cards will go here */}
        <p>No jobs found.</p>
      </div>
    </div>
  );
};

export default BrowseJobs;
