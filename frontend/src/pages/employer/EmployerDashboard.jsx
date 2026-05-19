import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/common/Sidebar';
import axiosInstance from '../../api/axiosInstance';

const mockApplications = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', job: 'Web Developer', status: 'pending', appliedAt: '2026-05-18' },
  { id: 2, name: 'Michael Chen', email: 'm.chen@email.com', job: 'Graphic Designer', status: 'shortlisted', appliedAt: '2026-05-17' },
  { id: 3, name: 'Emily Davis', email: 'emily.d@email.com', job: 'Web Developer', status: 'accepted', appliedAt: '2026-05-16' },
  { id: 4, name: 'James Wilson', email: 'j.wilson@email.com', job: 'Content Writer', status: 'pending', appliedAt: '2026-05-15' },
  { id: 5, name: 'Olivia Brown', email: 'olivia.b@email.com', job: 'Graphic Designer', status: 'rejected', appliedAt: '2026-05-14' },
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

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get('/jobs/');
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Could not load job data.');
    } finally {
      setLoading(false);
    }
  };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.is_active).length;
  const totalApplications = mockApplications.length;
  const selectedApplications = mockApplications.filter(
    (app) => app.status === 'accepted' || app.status === 'shortlisted'
  ).length;

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const latestApplications = [...mockApplications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 5);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <span className="header-date">{today}</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon blue">
              <BriefcaseIcon />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalJobs}</span>
              <span className="stat-label">Total Jobs</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon green">
              <DocumentTextIcon />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalApplications}</span>
              <span className="stat-label">Total Applications</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon yellow">
              <ClockIcon />
            </div>
            <div className="stat-info">
              <span className="stat-value">{activeJobs}</span>
              <span className="stat-label">Active Jobs</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon purple">
              <CheckBadgeIcon />
            </div>
            <div className="stat-info">
              <span className="stat-value">{selectedApplications}</span>
              <span className="stat-label">Selected Applications</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Job Postings</h2>
            <Link to="/employer/my-jobs" className="section-link">View All</Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
            </div>
          ) : error ? (
            <div className="empty-state"><p>{error}</p></div>
          ) : recentJobs.length === 0 ? (
            <div className="empty-state"><p>No jobs posted yet.</p></div>
          ) : (
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <Link to={`/employer/my-jobs`} className="job-title-link">
                          {job.title}
                        </Link>
                      </td>
                      <td>{job.category}</td>
                      <td>{job.location}</td>
                      <td>
                        <span className={`status-badge ${job.is_active ? 'accepted' : 'rejected'}`}>
                          {job.is_active ? 'Active' : 'Closed'}
                        </span>
                      </td>
                      <td>{formatDate(job.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Latest Applications</h2>
            <Link to="/employer/applications" className="section-link">View All</Link>
          </div>

          {latestApplications.length === 0 ? (
            <div className="empty-state"><p>No applications yet.</p></div>
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
                  {latestApplications.map((app) => (
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
                      <td>{formatDate(app.appliedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
