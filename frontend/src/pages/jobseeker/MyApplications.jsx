import React from 'react';
import ApplicationCard from '../../components/jobseeker/ApplicationCard';

const MyApplications = () => {
  const applications = [
    { id: 1, title: 'Web Developer', status: 'Pending' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#111827] mb-6">My Applications</h1>
      <div className="flex flex-col gap-4">
        {applications.map(app => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
