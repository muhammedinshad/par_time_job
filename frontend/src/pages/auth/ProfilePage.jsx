import React, { useEffect, useState } from 'react';
import { getProfile } from '../../api/authApi';
import { useSelector } from 'react-redux';
import './ProfilePage.css';

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
      <div className="profile-loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card animate-in">
        <div className="profile-header">
          <div className="profile-avatar">
            {role === 'employer' ? profileData.business_name[0] : profileData.full_name[0]}
          </div>
          <div className="profile-info-main">
            <h1>{role === 'employer' ? profileData.business_name : profileData.full_name}</h1>
            <span className="profile-role-badge">{role.replace('_', ' ')}</span>
            <p className="profile-email">{profileData.email}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Phone Number</span>
                <span className="value">{profileData.phone_number}</span>
              </div>
              <div className="info-item">
                <span className="label">Location</span>
                <span className="value">{role === 'employer' ? profileData.location : profileData.current_location}</span>
              </div>
            </div>
          </div>

          {role === 'employer' && (
            <div className="profile-section">
              <h3>Business Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Business Type</span>
                  <span className="value">{profileData.business_type}</span>
                </div>
                {profileData.description && (
                  <div className="info-item full-width">
                    <span className="label">Description</span>
                    <p className="value description">{profileData.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {role === 'job_seeker' && (
            <div className="profile-section">
              <h3>Personal Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Date of Birth</span>
                  <span className="value">{profileData.date_of_birth}</span>
                </div>
                <div className="info-item">
                  <span className="label">Gender</span>
                  <span className="value">{profileData.gender}</span>
                </div>
              </div>
            </div>
          )}

          <div className="profile-footer">
            <p className="member-since">Member since: {new Date(profileData.created_at).toLocaleDateString()}</p>
            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
