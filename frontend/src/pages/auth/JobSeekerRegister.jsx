import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerJobSeeker } from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import LocationAutocomplete from '../../components/common/LocationAutocomplete';

const JobSeekerRegister = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: state?.email || '',
    date_of_birth: '',
    gender: 'male',
    current_location: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await registerJobSeeker(formData);
      dispatch(setCredentials({
        user: { email: response.email },
        role: response.role,
      }));
      navigate('/jobseeker/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your details.');
      if (err.response?.data) {
        const details = Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join(', ');
        setError(`Error: ${details}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center text-[#111827] mt-8 text-3xl font-bold">Job Seeker Registration</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl flex flex-col gap-6 max-w-[450px] mx-auto my-8 shadow-sm border border-[#e5e7eb]">
        <input 
          name="full_name" 
          placeholder="Full Name" 
          onChange={handleChange} 
          required 
        />
        <input 
          name="phone_number" 
          placeholder="Phone Number (10 digits)" 
          onChange={handleChange} 
          required 
        />
        <input 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email" 
          required 
          readOnly={!!state?.email}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#6b7280]">Date of Birth</label>
          <input 
            name="date_of_birth" 
            type="date" 
            onChange={handleChange} 
            required 
          />
        </div>
        <select name="gender" onChange={handleChange} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <LocationAutocomplete 
          name="current_location" 
          placeholder="Current Location" 
          value={formData.current_location}
          onChange={handleChange} 
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <input 
          name="confirm_password" 
          type="password" 
          placeholder="Confirm Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register as Job Seeker'}
        </button>
      </form>
    </div>
  );
};

export default JobSeekerRegister;
