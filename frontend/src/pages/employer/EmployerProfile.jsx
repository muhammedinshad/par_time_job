import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import { fetchEmployerProfile, updateEmployerProfile } from '../../api/jobApi';

const BUSINESS_TYPE_CHOICES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'retail', label: 'Retail' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
];

const EmployerProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    location: '',
    description: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployerProfile()
      .then((data) => {
        setFormData({
          business_name: data.business_name || user?.name || '',
          business_type: data.business_type || '',
          location: data.location || '',
          description: data.description || '',
          phone_number: data.phone_number || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');
    try {
      const payload = new FormData();
      if (formData.business_name) payload.append('business_name', formData.business_name);
      if (formData.business_type) payload.append('business_type', formData.business_type);
      if (formData.location) payload.append('location', formData.location);
      if (formData.description) payload.append('description', formData.description);
      if (formData.phone_number) payload.append('phone_number', formData.phone_number);

      await updateEmployerProfile(payload);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
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
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] text-[#111827] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        <div className="px-10 pb-10 flex-1 max-w-[700px]">
          <div className="flex items-end justify-between mb-8 mt-6">
            <div>
              <h1 className="text-[28px] font-bold text-[#111827] tracking-tight mb-1.5">Employer Profile</h1>
              <p className="text-[14px] text-[#6b7280]">Manage your business profile.</p>
            </div>
          </div>

          {success && (
            <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl p-4 mb-4 border border-emerald-200">{success}</div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 mb-4 border border-red-200">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#ffffff] rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col gap-5">
            <div>
              <label className={labelStyles}>Business Name</label>
              <input name="business_name" value={formData.business_name} onChange={handleChange} className={inputStyles} />
            </div>

            <div>
              <label className={labelStyles}>Business Type</label>
              <select name="business_type" value={formData.business_type} onChange={handleChange} className={inputStyles}>
                <option value="">Select type</option>
                {BUSINESS_TYPE_CHOICES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyles}>Location</label>
              <input name="location" value={formData.location} onChange={handleChange} className={inputStyles} />
            </div>

            <div>
              <label className={labelStyles}>Phone Number</label>
              <input name="phone_number" value={formData.phone_number} onChange={handleChange} className={inputStyles} />
            </div>

            <div>
              <label className={labelStyles}>Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`${inputStyles} resize-none`}
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-2.5 bg-[#136040] hover:bg-[#1d8258] text-white text-[14px] font-medium rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmployerProfile;
