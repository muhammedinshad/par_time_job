import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile } from '../../api/userApi';
import { changePassword } from '../../api/authApi';

const BASE_URL = 'http://127.0.0.1:8000';

const buildMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // path is like "cvs/filename.pdf" — prepend /media/
  return `${BASE_URL}${path}`;
};

const GENDER_LABELS = { male: 'Male', female: 'Female', other: 'Other' };

const InfoRow = ({ label, value }) => (
  <div className="py-3 border-b border-gray-50 last:border-0">
    <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-[14px] font-medium text-[#111827]">
      {value || <span className="text-[#9ca3af] font-normal italic">Not set</span>}
    </p>
  </div>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const [cvBlobUrl, setCvBlobUrl] = useState(null);

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
    fetchProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  
  const cvUrl = buildMediaUrl(profile?.cv || profile?.cv_url || null);
  
  useEffect(() => {
  if (!cvUrl) return;
  fetch(cvUrl, { credentials: 'include' })
    .then(res => res.blob())
    .then(blob => setCvBlobUrl(URL.createObjectURL(blob)))
    .catch(() => {});
}, [cvUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
      </div>
    );
  }
  console.log(cvUrl)
  return (
    <div>
      <div className="flex items-end justify-between mb-8 mt-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">My Profile</h1>
          <p className="text-[15px] text-[#9ca3af] font-medium">Your personal information at a glance.</p>
        </div>
        <button
          onClick={() => navigate('edit')}
          className="px-5 py-2.5 bg-[#136040] text-white text-sm font-semibold rounded-xl hover:bg-[#0f4f34] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
      </div>

      <div className="max-w-[600px] space-y-5">
        {/* Personal Details Card */}
        <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
          <h2 className="text-[12px] font-semibold text-[#136040] uppercase tracking-wider mb-4">Personal Details</h2>
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Full Name" value={profile?.full_name} />
          <InfoRow label="Phone Number" value={profile?.phone_number} />
          <InfoRow label="Date of Birth" value={profile?.date_of_birth} />
          <InfoRow label="Gender" value={GENDER_LABELS[profile?.gender] || profile?.gender} />
          <InfoRow label="Current Location" value={profile?.current_location} />
        </div>

        {/* CV Card */}
        <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[12px] font-semibold text-[#136040] uppercase tracking-wider">CV / Resume</h2>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="text-xs font-semibold text-[#136040] bg-[#136040]/10 px-3 py-1.5 rounded-lg hover:bg-[#136040]/20 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CV
              </a>
            )}
          </div>

          {cvUrl ? (
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <iframe
                src={cvBlobUrl}
                title="CV Preview"
                style={{ width: '300px', height: '200px', display: 'block' }}
              />
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <svg className="w-10 h-10 text-[#9ca3af] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-[#9ca3af] mb-3">No CV uploaded yet</p>
              <button
                onClick={() => navigate('edit')}
                className="px-4 py-2 bg-[#136040] text-white text-xs font-semibold rounded-lg hover:bg-[#0f4f34] transition-colors"
              >
                Upload CV
              </button>
            </div>
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
              <label className="block text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-[14px] text-[#111827] placeholder-[#9ca3af] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] focus:ring-1 focus:ring-[#136040] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-[14px] text-[#111827] placeholder-[#9ca3af] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] focus:ring-1 focus:ring-[#136040] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-[14px] text-[#111827] placeholder-[#9ca3af] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] focus:ring-1 focus:ring-[#136040] transition-colors"
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
      </div>
    </div>

  );
};

export default Profile;
