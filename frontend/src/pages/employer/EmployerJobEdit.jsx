import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import { fetchEmployerJobDetail, updateEmployerJob } from '../../api/jobApi';

const CATEGORY_CHOICES = [
  { value: 'restaurant', label: 'Restaurant & Food' },
  { value: 'events', label: 'Events & Entertainment' },
  { value: 'health_care', label: 'Health & Care' },
  { value: 'education', label: 'Education & Tutoring' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'other', label: 'Other' },
];

const JOB_TYPE_CHOICES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const EmployerJobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    salary_range: '',
    job_type: '',
    location: '',
    timing: '',
    slots: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployerJobDetail(id)
      .then((data) => {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
          salary_range: data.salary_range || '',
          job_type: data.job_type || '',
          location: data.location || '',
          timing: data.timing || '',
          slots: data.slots?.toString() || '',
          is_active: data.is_active,
        });
      })
      .catch(() => setError('Failed to load job.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        salary_range: formData.salary_range,
        job_type: formData.job_type,
        location: formData.location,
        timing: formData.timing,
        slots: formData.slots ? Number(formData.slots) : null,
        is_active: formData.is_active,
      };
      await updateEmployerJob(id, payload);
      setSuccess('Job updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyles = "w-full px-4 py-2.5 text-[14px] text-[#111827] placeholder-[#6b7280] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] focus:ring-1 focus:ring-[#136040] transition-colors";
  const labelStyles = "block text-[13px] font-medium text-[#111827] mb-1.5 ml-1";

  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        <div className="px-10 pb-10 flex-1 w-full max-w-[700px] mx-auto">
          <div className="flex items-center justify-between mb-8 mt-6">
            <div>
              <button
                onClick={() => navigate(`/employer/my-jobs/${id}`)}
                className="text-sm text-[#136040] font-medium hover:underline mb-2 bg-transparent p-0 border-none shadow-none hover:translate-y-0"
              >
                &larr; Back to Job Detail
              </button>
              <h1 className="text-[28px] font-bold text-[#111827] tracking-tight mb-1.5">Edit Job</h1>
            </div>
          </div>

          {success && (
            <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl p-4 mb-4 border border-emerald-200">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#ffffff] rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col gap-5">
            <div>
              <label className={labelStyles}>Job Title <span className="text-red-500">*</span></label>
              <input name="title" value={formData.title} onChange={handleChange} required className={inputStyles} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelStyles}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputStyles}>
                  {CATEGORY_CHOICES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyles}>Job Type</label>
                <select name="job_type" value={formData.job_type} onChange={handleChange} className={inputStyles}>
                  {JOB_TYPE_CHOICES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelStyles}>Location <span className="text-red-500">*</span></label>
                <input name="location" value={formData.location} onChange={handleChange} required className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Timing</label>
                <input name="timing" value={formData.timing} onChange={handleChange} className={inputStyles} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelStyles}>Salary Range</label>
                <input name="salary_range" value={formData.salary_range} onChange={handleChange} className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Available Slots</label>
                <input name="slots" type="number" value={formData.slots} onChange={handleChange} className={inputStyles} />
              </div>
            </div>

            <div>
              <label className={labelStyles}>Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className={`${inputStyles} resize-none`}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-[#136040] focus:ring-[#136040]"
              />
              <span className="text-sm font-medium text-[#111827]">Active (visible to job seekers)</span>
            </label>

            <div className="pt-3 border-t border-gray-100 mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/employer/my-jobs/${id}`)}
                className="px-7 py-2.5 bg-transparent text-[#6b7280] text-[14px] font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all hover:translate-y-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-7 py-2.5 bg-[#136040] hover:bg-[#1d8258] text-white text-[14px] font-medium rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#79d89a]/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmployerJobEdit;
