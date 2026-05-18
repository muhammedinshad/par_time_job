import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>Applicants: {job.applicants}</p>
      <div className="card-actions">
        <button>Edit</button>
        <button>View Applicants</button>
      </div>
    </div>
  );
};

export default JobCard;
