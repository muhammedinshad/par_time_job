import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerEmployer } from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';

const EmployerRegister = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!state?.email || state?.role !== 'employer') {
      navigate('/', { replace: true });
    }
  }, []);

  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'restaurant',
    phone_number: '',
    email: state?.email || '',
    location: '',
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
      const response = await registerEmployer(formData);
      dispatch(setCredentials({
        user: { email: response.email },
        role: response.role,
        token: response.tokens?.access
      }));
      navigate('/employer/dashboard');
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
      <h1 className="text-center text-[#111827] mt-8 text-3xl font-bold">Employer Registration</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl flex flex-col gap-6 max-w-[450px] mx-auto my-8 shadow-sm border border-[#e5e7eb]">
        <input
          name="business_name"
          placeholder="Business Name"
          onChange={handleChange}
          required
        />
        <select name="business_type" onChange={handleChange} required>
          <option value="restaurant">Restaurant</option>
          <option value="events">Events</option>
          <option value="health_care">Health Care</option>
          <option value="other">Other</option>
        </select>
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
        <input
          name="location"
          placeholder="Location"
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
          {loading ? 'Registering...' : 'Register as Employer'}
        </button>
      </form>
    </div>
  );
};

export default EmployerRegister;
