import React from 'react';
import JobCard from '../../components/employer/JobCard';

const MyJobs = () => {
  const jobs = [
    { id: 1, title: 'Web Developer', applicants: 10 },
    { id: 2, title: 'Graphic Designer', applicants: 5 },
  ];

  return (
    <div className="my-jobs">
      <h1>My Job Postings</h1>
      <div className="job-list">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default MyJobs;
