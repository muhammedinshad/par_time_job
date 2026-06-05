import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile } from '../../api/userApi';
import LocationAutocomplete from '../../components/common/LocationAutocomplete';

const GENDER_CHOICES = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const BASE_URL = 'http://127.0.0.1:8000';

const buildMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/media/${path}`;
};

const ProfileEdit = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    current_location: '',
    date_of_birth: '',
    gender: '',
    cv: null,
  });
  const [currentCvUrl, setCurrentCvUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          full_name: data.full_name || user?.name || '',
          phone_number: data.phone_number || '',
          current_location: data.current_location || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
        }));
        setCurrentCvUrl(buildMediaUrl(data.cv || data.cv_url || null));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.name]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = new FormData();
      payload.append('full_name', formData.full_name);
      payload.append('phone_number', formData.phone_number);
      payload.append('current_location', formData.current_location);
      payload.append('date_of_birth', formData.date_of_birth);
      payload.append('gender', formData.gender);
      if (formData.cv) payload.append('cv', formData.cv);

      await updateProfile(payload);
      navigate('/jobseeker/dashboard/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
      </div>
    );
  }

  const newCvPreviewUrl = formData.cv ? URL.createObjectURL(formData.cv) : null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8 mt-6">
        <button
          onClick={() => navigate('/jobseeker/dashboard/profile')}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-transparent shadow-none hover:translate-y-0"
        >
          <svg className="w-4 h-4 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">Edit Profile</h1>
          <p className="text-[15px] text-[#9ca3af] font-medium">Update your personal information.</p>
        </div>
      </div>

      <div className="max-w-[600px]">
        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 border border-red-200">{error}</div>
          )}

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Email</label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-[#9ca3af] cursor-not-allowed"
            />
            <p className="text-[11px] text-[#9ca3af] mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Your phone number"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] bg-white"
            >
              <option value="">Select gender</option>
              {GENDER_CHOICES.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Location</label>
            <LocationAutocomplete
              name="current_location"
              value={formData.current_location}
              onChange={handleChange}
              placeholder="Your current location"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040]"
            />
          </div>

          {/* CV Field */}
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">CV / Resume</label>

            {/* Preview: new file takes priority, else current */}
            {newCvPreviewUrl ? (
              <div className="mb-3">
                <p className="text-[11px] text-[#9ca3af] mb-1.5">New CV preview:</p>
                <iframe
                  src={newCvPreviewUrl}
                  title="New CV Preview"
                  style={{ width: '300px', height: '200px', display: 'block', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </div>
            ) : currentCvUrl ? (
              <div className="mb-3">
                <p className="text-[11px] text-[#9ca3af] mb-1.5">Current CV:</p>
                <iframe
                  src={currentCvUrl}
                  title="Current CV Preview"
                  style={{ width: '300px', height: '200px', display: 'block', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </div>
            ) : null}

            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#136040]/10 file:text-[#136040] hover:file:bg-[#136040]/20"
            />
            <p className="text-[11px] text-[#9ca3af] mt-1">
              {currentCvUrl ? 'Upload a new CV to replace your existing one.' : 'Upload your CV (.pdf, .doc, .docx)'}
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-[#136040] text-white text-sm font-semibold rounded-xl hover:bg-[#0f4f34] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/jobseeker/dashboard/profile')}
              className="px-6 py-2.5 text-sm font-medium text-[#6b7280] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-transparent shadow-none hover:translate-y-0"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
