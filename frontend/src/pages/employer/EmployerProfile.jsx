import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import { fetchEmployerProfile, updateEmployerProfile } from '../../api/jobApi';
import { changePassword } from '../../api/authApi';

const BUSINESS_TYPE_LABELS = {
  restaurant: 'Restaurant',
  retail: 'Retail',
  healthcare: 'Healthcare',
  education: 'Education',
  technology: 'Technology',
  other: 'Other',
};

const BUSINESS_TYPE_CHOICES = Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => ({ value, label }));

const InfoRow = ({ label, value }) => (
  <div className="py-3 border-b border-gray-50 last:border-0">
    <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-[14px] font-medium text-[#111827]">
      {value || <span className="text-[#9ca3af] font-normal italic">Not set</span>}
    </p>
  </div>
);

const EmployerProfile = () => {
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    location: '',
    description: '',
    phone_number: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPwdError('New passwords do not match.');
      setPwdSuccess('');
      return;
    }
    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      setPwdSuccess('');
      return;
    }
    
    setPwdLoading(true);
    setPwdError('');
    setPwdSuccess('');
    
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmNewPassword
      });
      setPwdSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPwdError(err.response?.data?.error || err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setPwdLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerProfile()
      .then((data) => {
        setProfile(data);
        setFormData({
          business_name: data.business_name || '',
          business_type: data.business_type || '',
          location: data.location || '',
          description: data.description || '',
          phone_number: data.phone_number || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      // Use JSON for employer profile (no file upload needed)
      const updated = await updateEmployerProfile(formData);
      setProfile((prev) => ({ ...prev, ...updated, ...formData }));
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to current profile values
    setFormData({
      business_name: profile?.business_name || '',
      business_type: profile?.business_type || '',
      location: profile?.location || '',
      description: profile?.description || '',
      phone_number: profile?.phone_number || '',
    });
    setEditing(false);
    setError('');
  };

  const inputStyles =
    'w-full px-4 py-2.5 text-[14px] text-[#111827] placeholder-[#9ca3af] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] focus:ring-1 focus:ring-[#136040] transition-colors';
  const labelStyles = 'block text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5';

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
        <div className="px-10 pb-10 flex-1 max-w-[720px]">
          {/* Header */}
          <div className="flex items-end justify-between mb-8 mt-6">
            <div>
              <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">Company Profile</h1>
              <p className="text-[15px] text-[#9ca3af] font-medium">Your business information at a glance.</p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2.5 bg-[#136040] text-white text-sm font-semibold rounded-xl hover:bg-[#0f4f34] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>

          {/* Success / Error messages */}
          {success && (
            <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl p-4 mb-5 border border-emerald-200 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 mb-5 border border-red-200">{error}</div>
          )}

          <div className="space-y-5">
            {/* Account Info Card */}
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
              <h2 className="text-[12px] font-semibold text-[#136040] uppercase tracking-wider mb-4">Account</h2>
              <InfoRow label="Email" value={user?.email} />
              <InfoRow label="Role" value="Employer" />
            </div>

            {/* Business Details Card */}
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
              <h2 className="text-[12px] font-semibold text-[#136040] uppercase tracking-wider mb-4">Business Details</h2>
              <InfoRow label="Business Name" value={profile?.business_name} />
              <InfoRow label="Business Type" value={BUSINESS_TYPE_LABELS[profile?.business_type] || profile?.business_type} />
              <InfoRow label="Location" value={profile?.location} />
              <InfoRow label="Phone Number" value={profile?.phone_number} />
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
              <h2 className="text-[12px] font-semibold text-[#136040] uppercase tracking-wider mb-4">About</h2>
              {profile?.description ? (
                <p className="text-[14px] text-[#4b5563] leading-relaxed">{profile.description}</p>
              ) : (
                <p className="text-[14px] text-[#9ca3af] italic">No description added yet.</p>
              )}
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
              <h2 className="text-[12px] font-semibold text-[#136040] uppercase tracking-wider mb-4">Change Password</h2>
              
              {pwdError && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 mb-4 border border-red-200">
                  {pwdError}
                </div>
              )}
              
              {pwdSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl p-4 mb-4 border border-emerald-200 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {pwdSuccess}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className={labelStyles}>Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className={inputStyles}
                  />
                </div>
                
                <div>
                  <label className={labelStyles}>New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className={labelStyles}>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className={inputStyles}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="px-5 py-2.5 bg-[#136040] hover:bg-[#0f4f34] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {pwdLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>


            {/* Edit Form — expands inline when editing */}
            {editing && (
              <div className="bg-white rounded-[24px] border border-[#136040]/30 p-6 shadow-sm ring-1 ring-[#136040]/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[16px] font-bold text-[#111827]">Edit Profile</h2>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-sm text-[#9ca3af] hover:text-[#111827] bg-transparent border-none shadow-none p-0 hover:translate-y-0 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className={labelStyles}>Business Name</label>
                    <input
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="Your business name"
                      className={inputStyles}
                    />
                  </div>

                  <div>
                    <label className={labelStyles}>Business Type</label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      className={inputStyles}
                    >
                      <option value="">Select type</option>
                      {BUSINESS_TYPE_CHOICES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelStyles}>Location</label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Kochi, Kerala"
                      className={inputStyles}
                    />
                  </div>

                  <div>
                    <label className={labelStyles}>Phone Number</label>
                    <input
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="+91 XXXXXXXXXX"
                      className={inputStyles}
                    />
                  </div>

                  <div>
                    <label className={labelStyles}>Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell job seekers about your business..."
                      className={`${inputStyles} resize-none`}
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-5 py-2.5 text-sm font-medium text-[#6b7280] bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border-none shadow-none hover:translate-y-0"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-7 py-2.5 bg-[#136040] hover:bg-[#0f4f34] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerProfile;
