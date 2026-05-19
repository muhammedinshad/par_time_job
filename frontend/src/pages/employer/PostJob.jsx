import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import axiosInstance from '../../api/axiosInstance';

const CATEGORY_CHOICES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'events', label: 'Events' },
  { value: 'health_care', label: 'Health Care' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

const JOB_TYPE_CHOICES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'restaurant',
    salary_range: '',
    job_type: 'part_time',
    location: '',
    timing: '',
    slots: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/jobs/create/', formData);
      navigate('/employer/my-jobs');
    } catch (err) {
      console.error('Failed to create job:', err);
      alert('Failed to create job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Post a New Job</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 0 }}>
          <input
            name="title"
            placeholder="Job Title *"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Job Description *"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <select name="category" value={formData.category} onChange={handleChange}>
            {CATEGORY_CHOICES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select name="job_type" value={formData.job_type} onChange={handleChange}>
            {JOB_TYPE_CHOICES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <input
            name="salary_range"
            placeholder="Salary Range (e.g. $15-$20/hr)"
            value={formData.salary_range}
            onChange={handleChange}
          />
          <input
            name="location"
            placeholder="Location *"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            name="timing"
            placeholder="Timing (e.g. 9 AM - 5 PM)"
            value={formData.timing}
            onChange={handleChange}
          />
          <input
            name="slots"
            type="number"
            placeholder="Number of slots"
            value={formData.slots}
            onChange={handleChange}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default PostJob;
