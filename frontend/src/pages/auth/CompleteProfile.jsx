import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeProfile } from '../../api/authApi';
import { setCredentials } from '../../store/authSlice';
import './CompleteProfile.css';

const CompleteProfile = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector((state) => state.auth);

  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') || '';

  // step: 'role' | 'details'
  const [step, setStep] = useState(initialRole ? 'details' : 'role');

  const [formData, setFormData] = useState({
    role:             initialRole,
    // Employer fields
    business_name:   '',
    business_type:   'restaurant',
    location:        '',
    phone_number:    '',
    description:     '',
    // Job Seeker fields
    full_name:       user?.suggested_name || '',
    date_of_birth:   '',
    gender:          'male',
    current_location: '',
  });

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  // Sync role if it changes in URL (e.g. browser back/forward)
  useEffect(() => {
    if (initialRole && initialRole !== formData.role) {
      setFormData(prev => ({ ...prev, role: initialRole }));
      setStep('details');
    }
  }, [initialRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData(prev => ({ ...prev, role: selectedRole }));
    setErrors({});
  };

  const handleRoleContinue = () => {
    if (!formData.role) {
      setErrors({ general: 'Please select a role to continue.' });
      return;
    }
    setErrors({});
    setStep('details');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await completeProfile(formData);
      const { email, role: updatedRole } = response;

      dispatch(setCredentials({ user: { email }, role: updatedRole }));
      navigate(updatedRole === 'employer' ? '/employer/dashboard' : '/jobseeker/dashboard');
    } catch (err) {
      console.error('Profile Completion Error:', err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: 'Failed to save profile. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complete-profile-container">
      <div className="complete-profile-card">

        {/* ───────────── STEP 1 — Role Selection ───────────── */}
        {step === 'role' && (
          <>
            <h1>Welcome!</h1>
            <p>To get started, tell us how you want to use PrimeJob.</p>

            <div className="role-selection-step">
              <div className="role-grid">
                <div
                  className={`role-card ${formData.role === 'employer' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('employer')}
                  id="role-employer"
                >
                  <span className="role-icon">🏢</span>
                  <h3>Hire People</h3>
                  <p className="text-sm opacity-70">Post jobs and manage applicants</p>
                </div>
                <div
                  className={`role-card ${formData.role === 'job_seeker' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('job_seeker')}
                  id="role-jobseeker"
                >
                  <span className="role-icon">👤</span>
                  <h3>Find Work</h3>
                  <p className="text-sm opacity-70">Browse and apply for part-time jobs</p>
                </div>
              </div>

              {errors.general && (
                <div className="error-text text-center" style={{ marginTop: '0.75rem' }}>
                  {errors.general}
                </div>
              )}

              <button
                className="submit-btn"
                style={{ marginTop: '1.5rem' }}
                onClick={handleRoleContinue}
                id="btn-role-continue"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* ───────────── STEP 2 — Profile Details ───────────── */}
        {step === 'details' && (
          <>
            <h1>Almost Done!</h1>
            <p>
              Please provide your{' '}
              {formData.role === 'employer' ? 'business' : 'personal'} details.
            </p>

            <form onSubmit={handleSubmit} className="profile-form">
              {formData.role === 'employer' ? (
                <>
                  <div className="form-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="Prime Solutions Inc."
                      required
                    />
                    {errors.business_name && <span className="error-text">{errors.business_name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Business Type</label>
                      <select name="business_type" value={formData.business_type} onChange={handleChange}>
                        <option value="restaurant">Restaurant</option>
                        <option value="events">Events</option>
                        <option value="health_care">Health Care</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength="10"
                        required
                      />
                      {errors.phone_number && <span className="error-text">{errors.phone_number}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Area"
                      required
                    />
                    {errors.location && <span className="error-text">{errors.location}</span>}
                  </div>

                  <div className="form-group">
                    <label>Description (Optional)</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="A brief about your company..."
                      rows="3"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your legal name"
                      required
                    />
                    {errors.full_name && <span className="error-text">{errors.full_name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                      />
                      {errors.date_of_birth && <span className="error-text">{errors.date_of_birth}</span>}
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="current_location"
                        value={formData.current_location}
                        onChange={handleChange}
                        placeholder="Your current city"
                        required
                      />
                      {errors.current_location && <span className="error-text">{errors.current_location}</span>}
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength="10"
                        required
                      />
                      {errors.phone_number && <span className="error-text">{errors.phone_number}</span>}
                    </div>
                  </div>
                </>
              )}

              {errors.general && (
                <div className="error-text text-center font-bold mb-2">{errors.general}</div>
              )}
              {errors.error && (
                <div className="error-text text-center font-bold mb-2">{errors.error}</div>
              )}

              <div className="flex flex-col gap-3">
                <button type="submit" className="submit-btn" disabled={loading} id="btn-complete-profile">
                  {loading ? 'Finalizing...' : 'Complete My Profile'}
                </button>
                {/* Only show "Change Role" if user arrived without a pre-set role (new user) */}
                {!initialRole && (
                  <button
                    type="button"
                    className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => { setStep('role'); setErrors({}); }}
                  >
                    ← Change Role
                  </button>
                )}
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default CompleteProfile;
