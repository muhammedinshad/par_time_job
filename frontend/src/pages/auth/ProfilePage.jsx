import React, { useEffect, useState } from 'react';
import { getProfile } from '../../api/authApi';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] flex justify-center items-center">
        <div className="w-12 h-12 border-[5px] border-[#136040] border-b-transparent rounded-full inline-block animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center text-red-500">
        <h2 className="text-2xl">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center p-8 bg-[#f5f7f6]">
      <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
        <div className="p-12 bg-gradient-to-r from-[#136040] to-[#1d8258] flex items-center gap-8 text-white max-sm:flex-col max-sm:text-center max-sm:p-8">
          <div className="w-[100px] h-[100px] bg-white/20 border-4 border-white/40 rounded-full flex justify-center items-center text-5xl font-bold uppercase shrink-0">
            {role === 'employer' ? profileData.business_name[0] : profileData.full_name[0]}
          </div>
          <div>
            <h1 className="m-0 text-4xl font-extrabold tracking-tight">{role === 'employer' ? profileData.business_name : profileData.full_name}</h1>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold my-2 capitalize">{role.replace('_', ' ')}</span>
            <p className="m-0 opacity-90">{profileData.email}</p>
          </div>
        </div>

        <div className="p-12 max-sm:p-8">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-[#111827] mb-6 pb-2 border-b-2 border-[#e5e7eb]">Contact Information</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Phone Number</span>
                <span className="text-lg font-medium text-[#111827]">{profileData.phone_number}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Location</span>
                <span className="text-lg font-medium text-[#111827]">{role === 'employer' ? profileData.location : profileData.current_location}</span>
              </div>
            </div>
          </div>

          {role === 'employer' && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-[#111827] mb-6 pb-2 border-b-2 border-[#e5e7eb]">Business Details</h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Business Type</span>
                  <span className="text-lg font-medium text-[#111827]">{profileData.business_type}</span>
                </div>
                {profileData.description && (
                  <div className="flex flex-col gap-2 col-span-full">
                    <span className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Description</span>
                    <p className="text-[#6b7280] leading-relaxed">{profileData.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {role === 'job_seeker' && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-[#111827] mb-6 pb-2 border-b-2 border-[#e5e7eb]">Personal Details</h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Date of Birth</span>
                  <span className="text-lg font-medium text-[#111827]">{profileData.date_of_birth}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Gender</span>
                  <span className="text-lg font-medium text-[#111827]">{profileData.gender}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-[#e5e7eb] flex justify-between items-center max-sm:flex-col max-sm:gap-6 max-sm:text-center">
            <p className="text-sm text-[#6b7280]">Member since: {new Date(profileData.created_at).toLocaleDateString()}</p>
            <button className="px-8 py-3 bg-[#136040] text-white border-none rounded-xl font-semibold cursor-pointer transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#0f4f34]">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
