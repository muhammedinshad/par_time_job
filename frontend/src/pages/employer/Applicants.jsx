import React from 'react';
import Sidebar from '../../components/common/Sidebar';

const applicants = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', job: 'Web Developer', status: 'pending', appliedDate: '2026-05-18' },
  { id: 2, name: 'Michael Chen', email: 'm.chen@email.com', job: 'Graphic Designer', status: 'shortlisted', appliedDate: '2026-05-17' },
  { id: 3, name: 'Emily Davis', email: 'emily.d@email.com', job: 'Web Developer', status: 'accepted', appliedDate: '2026-05-16' },
  { id: 4, name: 'James Wilson', email: 'j.wilson@email.com', job: 'Content Writer', status: 'pending', appliedDate: '2026-05-15' },
  { id: 5, name: 'Olivia Brown', email: 'olivia.b@email.com', job: 'Graphic Designer', status: 'rejected', appliedDate: '2026-05-14' },
];

const statusColors = {
  pending: 'pending',
  shortlisted: 'shortlisted',
  accepted: 'accepted',
  rejected: 'rejected',
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Applicants = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Applications</h1>
            <p>Review and manage job applications.</p>
          </div>
        </div>

        {applicants.length === 0 ? (
          <div className="empty-state"><p>No applications received yet.</p></div>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="applicant-info">
                        <div className="applicant-avatar">
                          {app.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="applicant-details">
                          <span className="applicant-name">{app.name}</span>
                          <span className="applicant-email">{app.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{app.job}</td>
                    <td>
                      <span className={`status-badge ${statusColors[app.status]}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td>{formatDate(app.appliedDate)}</td>
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

export default Applicants;
