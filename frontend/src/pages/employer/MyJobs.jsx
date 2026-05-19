import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import axiosInstance from '../../api/axiosInstance';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get('/jobs/');
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>My Jobs</h1>
            <p>Manage your job postings.</p>
          </div>
          <Link to="/employer/post-job" className="sidebar-add-btn" style={{ marginTop: 0, textDecoration: 'none' }}>
            + Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state"><p>No jobs posted yet.</p></div>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Slots</th>
                  <th>Status</th>
                  <th>Posted</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <span className="job-title-link">{job.title}</span>
                    </td>
                    <td>{job.category}</td>
                    <td>{job.location}</td>
                    <td>{job.slots || '-'}</td>
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
      </main>
    </div>
  );
};

export default MyJobs;
