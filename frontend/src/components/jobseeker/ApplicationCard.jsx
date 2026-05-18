import React from 'react';

const ApplicationCard = ({ application }) => {
  return (
    <div className="application-card">
      <h3>{application.title}</h3>
      <p>Status: <span className={`status ${application.status.toLowerCase()}`}>{application.status}</span></p>
    </div>
  );
};

export default ApplicationCard;
