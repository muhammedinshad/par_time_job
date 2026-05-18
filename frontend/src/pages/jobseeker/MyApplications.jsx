import React from 'react';
import ApplicationCard from '../../components/jobseeker/ApplicationCard';

const MyApplications = () => {
  const applications = [
    { id: 1, title: 'Web Developer', status: 'Pending' },
  ];

  return (
    <div className="my-applications">
      <h1>My Applications</h1>
      <div className="application-list">
        {applications.map(app => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
