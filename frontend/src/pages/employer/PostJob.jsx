import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import axiosInstance from '../../api/axiosInstance';
import LocationAutocomplete from '../../components/common/LocationAutocomplete';

const CATEGORY_CHOICES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'events', label: 'Events' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'health_care', label: 'Health Care' },
  { value: 'education', label: 'Education' },
  { value: 'software_development', label: 'Software Development' },
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

  // Reusable input styling
  const inputStyles = "w-full px-4 py-2.5 text-[14px] text-[#111827] placeholder-[#6b7280] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] focus:ring-1 focus:ring-[#136040] transition-colors";
  const labelStyles = "block text-[13px] font-medium text-[#111827] mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        
        {/* CHANGED: max-w-[1000px] to max-w-[700px] to decrease form width */}
        <div className="px-10 pb-10 flex-1 w-full max-w-[700px] mx-auto">
          <div className="flex items-end justify-between mb-8 mt-6">
            <div>
              <h1 className="text-[28px] font-bold text-[#111827] tracking-tight mb-1.5">
                Post a New Job
              </h1>
              <p className="text-[14px] text-[#6b7280]">
                Fill in the details below to publish a new job opening.
              </p>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="bg-[#ffffff] rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col gap-5"
          >
            {/* Row 1: Title */}
            <div>
              <label className={labelStyles}>Job Title <span className="text-red-500">*</span></label>
              <input
                name="title"
                placeholder="e.g. Lead Chef, Event Coordinator"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            {/* Row 2: Category & Job Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelStyles}>Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className={inputStyles}
                >
                  {CATEGORY_CHOICES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyles}>Job Type</label>
                <select 
                  name="job_type" 
                  value={formData.job_type} 
                  onChange={handleChange}
                  className={inputStyles}
                >
                  {JOB_TYPE_CHOICES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Location & Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelStyles}>Location <span className="text-red-500">*</span></label>
                <LocationAutocomplete
                  name="location"
                  placeholder="e.g. Kozhikode, Kerala"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Timing</label>
                <input
                  name="timing"
                  placeholder="e.g. 9 AM - 5 PM"
                  value={formData.timing}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
            </div>

            {/* Row 4: Salary Range & Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelStyles}>Salary Range</label>
                <input
                  name="salary_range"
                  placeholder="e.g. $15-$20/hr"
                  value={formData.salary_range}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Available Slots</label>
                <input
                  name="slots"
                  type="number"
                  placeholder="Number of openings"
                  value={formData.slots}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
            </div>

            {/* Row 5: Description */}
            <div>
              <label className={labelStyles}>Job Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                placeholder="Describe the responsibilities, requirements, and benefits..."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className={`${inputStyles} resize-none`}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-gray-100 mt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={submitting}
                className="px-7 py-2.5 bg-[#136040] hover:bg-[#1d8258] text-white text-[14px] font-medium rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#79d89a]/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostJob;