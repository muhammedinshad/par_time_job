import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const selectedSeekers = [
  { id: 1, name: 'Emily Davis', email: 'emily.d@email.com', job: 'Web Developer', status: 'Accepted', selectedDate: '2026-05-18' },
  { id: 2, name: 'Michael Chen', email: 'm.chen@email.com', job: 'Graphic Designer', status: 'Shortlisted', selectedDate: '2026-05-17' },
];

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SelectedJobSeekers = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Selected Job Seekers</h1>
            <p>Candidates you've shortlisted or accepted.</p>
          </div>
        </div>

        {selectedSeekers.length === 0 ? (
          <div className="empty-state">
            <UserGroupIcon style={{ width: 48, height: 48, opacity: 0.3, marginBottom: '1rem' }} />
            <p>No selected job seekers yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Selected Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedSeekers.map((seeker) => (
                  <tr key={seeker.id}>
                    <td>
                      <div className="applicant-info">
                        <div className="applicant-avatar">
                          {seeker.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="applicant-details">
                          <span className="applicant-name">{seeker.name}</span>
                          <span className="applicant-email">{seeker.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{seeker.job}</td>
                    <td>
                      <span className={`status-badge ${seeker.status === 'Accepted' ? 'accepted' : 'shortlisted'}`}>
                        {seeker.status}
                      </span>
                    </td>
                    <td>{formatDate(seeker.selectedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default SelectedJobSeekers;
