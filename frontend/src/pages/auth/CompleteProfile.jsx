import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeProfile } from '../../api/authApi';
import { setCredentials } from '../../store/authSlice';

const CompleteProfile = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector((state) => state.auth);

  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') || '';

  const [step, setStep] = useState(initialRole ? 'details' : 'role');

  const [formData, setFormData] = useState({
    role:             initialRole,
    business_name:   '',
    business_type:   'restaurant',
    location:        '',
    phone_number:    '',
    description:     '',
    full_name:       user?.suggested_name || '',
    date_of_birth:   '',
    gender:          'male',
    current_location: '',
  });

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialRole && initialRole !== formData.role) {
      setFormData(prev => ({ ...prev, role: initialRole }));
      setStep('details');
    }
  }, [initialRole]);

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
    <div className="min-h-screen flex justify-center items-center p-8 bg-[#f5f7f6]">
      <div className="w-full max-w-[600px] bg-white rounded-[2rem] p-12 shadow-sm border border-[#e5e7eb] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-[#136040] before:to-[#1d8258]">

        {step === 'role' && (
          <>
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#136040] to-[#1d8258] bg-clip-text text-transparent text-center">Welcome!</h1>
            <p className="text-[#6b7280] text-center mb-10 text-lg">To get started, tell us how you want to use PrimeJob.</p>

            <div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div
                  className={`bg-[#f5f7f6] border-2 border-transparent rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-4 hover:bg-gray-100 hover:-translate-y-1.5 ${formData.role === 'employer' ? 'bg-[#136040]/5 border-[#136040] shadow-[0_0_20px_rgba(19,96,64,0.1)]' : ''}`}
                  onClick={() => handleRoleSelect('employer')}
                  id="role-employer"
                >
                  <span className="text-4xl mb-2">🏢</span>
                  <h3 className="text-xl font-bold text-[#111827]">Hire People</h3>
                  <p className="text-sm text-[#6b7280]">Post jobs and manage applicants</p>
                </div>
                <div
                  className={`bg-[#f5f7f6] border-2 border-transparent rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-4 hover:bg-gray-100 hover:-translate-y-1.5 ${formData.role === 'job_seeker' ? 'bg-[#136040]/5 border-[#136040] shadow-[0_0_20px_rgba(19,96,64,0.1)]' : ''}`}
                  onClick={() => handleRoleSelect('job_seeker')}
                  id="role-jobseeker"
                >
                  <span className="text-4xl mb-2">👤</span>
                  <h3 className="text-xl font-bold text-[#111827]">Find Work</h3>
                  <p className="text-sm text-[#6b7280]">Browse and apply for part-time jobs</p>
                </div>
              </div>

              {errors.general && (
                <div className="text-red-500 text-sm text-center mt-3">
                  {errors.general}
                </div>
              )}

              <button
                className="mt-6 w-full bg-gradient-to-r from-[#136040] to-[#1d8258] text-white border-none rounded-2xl py-4 text-lg font-bold cursor-pointer transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleRoleContinue}
                id="btn-role-continue"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#136040] to-[#1d8258] bg-clip-text text-transparent text-center">Almost Done!</h1>
            <p className="text-[#6b7280] text-center mb-10 text-lg">
              Please provide your{' '}
              {formData.role === 'employer' ? 'business' : 'personal'} details.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ margin: 0, maxWidth: 'none', boxShadow: 'none', border: 'none', padding: 0, background: 'transparent' }}>
              {formData.role === 'employer' ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111827] ml-2">Business Name</label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="Prime Solutions Inc."
                      required
                    />
                    {errors.business_name && <span className="text-red-500 text-sm ml-2">{errors.business_name}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#111827] ml-2">Business Type</label>
                      <select name="business_type" value={formData.business_type} onChange={handleChange}>
                        <option value="restaurant" className="bg-white">Restaurant</option>
                        <option value="events" className="bg-white">Events</option>
                        <option value="health_care" className="bg-white">Health Care</option>
                        <option value="other" className="bg-white">Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#111827] ml-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength="10"
                        required
                      />
                      {errors.phone_number && <span className="text-red-500 text-sm ml-2">{errors.phone_number}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111827] ml-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Area"
                      required
                    />
                    {errors.location && <span className="text-red-500 text-sm ml-2">{errors.location}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111827] ml-2">Description (Optional)</label>
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
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111827] ml-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your legal name"
                      required
                    />
                    {errors.full_name && <span className="text-red-500 text-sm ml-2">{errors.full_name}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#111827] ml-2">Date of Birth</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                      />
                      {errors.date_of_birth && <span className="text-red-500 text-sm ml-2">{errors.date_of_birth}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#111827] ml-2">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="male" className="bg-white">Male</option>
                        <option value="female" className="bg-white">Female</option>
                        <option value="other" className="bg-white">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#111827] ml-2">Location</label>
                      <input
                        type="text"
                        name="current_location"
                        value={formData.current_location}
                        onChange={handleChange}
                        placeholder="Your current city"
                        required
                      />
                      {errors.current_location && <span className="text-red-500 text-sm ml-2">{errors.current_location}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#111827] ml-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength="10"
                        required
                      />
                      {errors.phone_number && <span className="text-red-500 text-sm ml-2">{errors.phone_number}</span>}
                    </div>
                  </div>
                </>
              )}

              {errors.general && (
                <div className="text-red-500 text-sm text-center font-bold">{errors.general}</div>
              )}
              {errors.error && (
                <div className="text-red-500 text-sm text-center font-bold">{errors.error}</div>
              )}

              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full bg-gradient-to-r from-[#136040] to-[#1d8258] text-white border-none rounded-2xl py-4 text-lg font-bold cursor-pointer transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading} id="btn-complete-profile">
                  {loading ? 'Finalizing...' : 'Complete My Profile'}
                </button>
                {!initialRole && (
                  <button
                    type="button"
                    className="text-sm text-[#6b7280] hover:text-[#136040] transition-colors bg-transparent border-none cursor-pointer"
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
