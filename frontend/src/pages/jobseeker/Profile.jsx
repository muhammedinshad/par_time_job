import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../api/userApi';

const GENDER_CHOICES = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const fileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://localhost:8000${url}`;
};

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    phone_number: '',
    current_location: '',
    date_of_birth: '',
    gender: '',
    cv: null,
  });
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfileData(data);
        setFormData((prev) => ({
          ...prev,
          full_name: data.full_name || user?.name || '',
          phone_number: data.phone_number || '',
          current_location: data.current_location || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
        }));
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
    setSuccess('');
    setError('');
    try {
      const payload = new FormData();
      if (formData.full_name) payload.append('full_name', formData.full_name);
      if (formData.phone_number) payload.append('phone_number', formData.phone_number);
      if (formData.current_location) payload.append('current_location', formData.current_location);
      if (formData.date_of_birth) payload.append('date_of_birth', formData.date_of_birth);
      if (formData.gender) payload.append('gender', formData.gender);
      if (formData.cv) payload.append('cv', formData.cv);

      await updateProfile(payload);
      setSuccess('Profile updated successfully!');
      const updated = await fetchProfile();
      setProfileData(updated);
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

  return (
    <div>
      <div className="flex items-end justify-between mb-8 mt-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">My Profile</h1>
          <p className="text-[15px] text-[#9ca3af] font-medium">Manage your personal information.</p>
        </div>
      </div>

      <div className="max-w-[600px]">
        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm space-y-5">
          {success && (
            <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl p-4 border border-emerald-200">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 border border-red-200">
              {error}
            </div>
          )}

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
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Location</label>
            <input
              type="text"
              name="current_location"
              value={formData.current_location}
              onChange={handleChange}
              placeholder="Your current location"
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
            <label className="block text-xs font-medium text-[#111827] mb-1.5">CV / Resume</label>
            {profileData?.cv_url && (
              <div className="mb-2">
                <a
                  href={fileUrl(profileData.cv_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#136040] font-medium underline hover:text-[#0f4f34]"
                >
                  View current CV
                </a>
              </div>
            )}
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#136040]/10 file:text-[#136040] hover:file:bg-[#136040]/20"
            />
            <p className="text-[11px] text-[#9ca3af] mt-1">Upload a new CV to replace your existing one.</p>
          </div>

          <div className="pt-3 border-t border-gray-100">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
